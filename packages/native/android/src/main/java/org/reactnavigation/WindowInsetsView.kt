package org.reactnavigation

import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.common.LifecycleState
import com.facebook.react.modules.i18nmanager.I18nUtil
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.views.scroll.ReactScrollViewHelper.HasScrollState
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.soloader.SoLoader

internal data class WindowInsetsMeasurement(
  val top: Float,
  val bottom: Float,
  val start: Float,
  val end: Float,
  val isRTL: Boolean,
  val swapLeftAndRight: Boolean
)

class WindowInsetsView(context: ReactContext) : ReactViewGroup(context), ViewTreeObserver.OnPreDrawListener {
  var adjustScrollInsets = false
  private var contentTag = 0
  var typeMask = 0
  var includesCustom = false
  var ignoreVisibility = false
  var edges = emptySet<String>()
  var hasInsetsChangeListener = false
    set(value) {
      field = value

      if (!value) {
        sentInsets = null
      }
    }

  var stateWrapper: StateWrapper? = null

  private var animatedInsets: WindowInsetsCompat? = null
  private var isAnimationPending = false
  private val runningAnimations = mutableSetOf<WindowInsetsAnimationCompat>()
  private var committedInsets = WindowInsetsMeasurement(0f, 0f, 0f, 0f, false, false)
  private var sentInsets: WindowInsetsMeasurement? = null

  init {
    ViewCompat.setWindowInsetsAnimationCallback(
      this,
      object : WindowInsetsAnimationCompat.Callback(DISPATCH_MODE_CONTINUE_ON_SUBTREE) {
        override fun onPrepare(animation: WindowInsetsAnimationCompat) {
          isAnimationPending = true
        }

        override fun onProgress(
          insets: WindowInsetsCompat,
          animations: List<WindowInsetsAnimationCompat>
        ): WindowInsetsCompat {
          // The window insets already have the final value during the animation,
          // so we keep the insets for the current frame to measure with them
          animatedInsets = insets
          runningAnimations.clear()
          runningAnimations.addAll(animations)

          rootView.invalidate()

          return insets
        }

        override fun onEnd(animation: WindowInsetsAnimationCompat) {
          runningAnimations.remove(animation)

          if (runningAnimations.isEmpty()) {
            animatedInsets = null

            rootView.invalidate()
          }
        }
      }
    )
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()

    viewTreeObserver.addOnPreDrawListener(this)
  }

  override fun onDetachedFromWindow() {
    viewTreeObserver.removeOnPreDrawListener(this)
    animatedInsets = null
    isAnimationPending = false
    runningAnimations.clear()

    super.onDetachedFromWindow()
  }

  override fun onPreDraw(): Boolean {
    val previousTag = contentTag
    val animationPending = isAnimationPending

    // FIXME: Android 11 can cancel an animation after it's prepared, without reporting its end
    // So we skip only one pre-draw to wait for the animated insets
    isAnimationPending = false

    if (animatedInsets != null || !animationPending) {
      updateInsets()
    } else {
      rootView.postInvalidateOnAnimation()
    }

    if (contentTag != 0 && contentTag != previousTag) {
      val wrapper = stateWrapper ?: return true
      // FIXME: Surface teardown destroys the native state under the wrapper's monitor.
      // Hold it across React Native's validity check and the subsequent JNI read.
      val mountedTag = synchronized(wrapper) { wrapper.stateData?.getInt("contentTag") }
      if (mountedTag != contentTag) {
        rootView.postInvalidateOnAnimation()
        return false
      }
    }

    return true
  }

  private fun findScrollView(parent: ViewGroup): ViewGroup? {
    for (i in 0 until parent.childCount) {
      val child = parent.getChildAt(i)
      if (child is ViewGroup && child is HasScrollState) {
        return child
      }

      if (child is ViewGroup && !(child is WindowInsetsView && child.adjustScrollInsets)) {
        findScrollView(child)?.let { return it }
      }
    }

    return null
  }

  private fun updateInsets() {
    if (stateWrapper == null) {
      return
    }

    val windowInsets = animatedInsets ?: ViewCompat.getRootWindowInsets(this) ?: return
    if (adjustScrollInsets) {
      val viewport = findScrollView(this)
      val tag = viewport?.getChildAt(0)?.id
      if (viewport == null || tag == null) {
        if (contentTag != 0) {
          commitInsets(WindowInsetsMeasurement(0f, 0f, 0f, 0f, false, false))
        }

        return
      }

      val insets = resolveWindowInsets(viewport, windowInsets, typeMask, includesCustom, ignoreVisibility)
      val measurement = insets.overlap.toMeasurement(viewport.layoutDirection)

      commitInsets(measurement, tag)

      return
    }

    val insets = resolveWindowInsets(this, windowInsets, typeMask, includesCustom, ignoreVisibility)
    var measurement = insets.overlap.toMeasurement()

    val previousInsets = committedInsets

    commitInsets(measurement)

    if (edges.isNotEmpty() && committedInsets != previousInsets) {
      // We measure again since padding can change the size of the view and its overlap with the insets
      // We extrapolate from the changes to find the padding where the measured insets stay the same,
      // and refine it with the last measurement to reduce the effect of pixel rounding during animations
      val nextInsets = resolveWindowInsets(this, windowInsets, typeMask, includesCustom, ignoreVisibility)
      val nextMeasurement = nextInsets.overlap.toMeasurement()

      if (nextMeasurement != measurement) {
        val fullInsets = nextInsets.full.toMeasurement()
        val settledInsets = settleInsets(previousInsets, measurement, measurement, nextMeasurement, fullInsets)

        commitInsets(settledInsets)

        val confirmedMeasurement = resolveWindowInsets(this, windowInsets, typeMask, includesCustom, ignoreVisibility).overlap.toMeasurement()

        measurement = settleInsets(measurement, nextMeasurement, settledInsets, confirmedMeasurement, fullInsets)

        commitInsets(measurement)
      }
    }

    if (hasInsetsChangeListener && measurement != sentInsets) {
      val reactContext = context as ThemedReactContext
      val dispatcher = UIManagerHelper.getEventDispatcher(reactContext) ?: return

      // We send asynchronous events during animations, since synchronous events wait for the JS thread,
      // and only the first synchronous event per view is sent in a frame
      // FIXME: React Native resets the sent synchronous events each frame, but stops while the host is paused
      // So we send asynchronous events while the host is paused to keep delivering inset changes
      val synchronous = animatedInsets == null &&
        reactContext.reactApplicationContext.lifecycleState == LifecycleState.RESUMED

      sentInsets = measurement

      dispatcher.dispatchEvent(
        WindowInsetsChangeEvent(UIManagerHelper.getSurfaceId(this), id, measurement, synchronous)
      )
    }
  }

  private fun settleInsets(
    appliedA: WindowInsetsMeasurement,
    measuredA: WindowInsetsMeasurement,
    appliedB: WindowInsetsMeasurement,
    measuredB: WindowInsetsMeasurement,
    full: WindowInsetsMeasurement
  ): WindowInsetsMeasurement {
    return measuredB.copy(
      top = if ("top" in edges) settleInset(appliedA.top, measuredA.top, appliedB.top, measuredB.top, full.top) else measuredB.top,
      bottom = if ("bottom" in edges) settleInset(appliedA.bottom, measuredA.bottom, appliedB.bottom, measuredB.bottom, full.bottom) else measuredB.bottom,
      start = if ("start" in edges) settleInset(appliedA.start, measuredA.start, appliedB.start, measuredB.start, full.start) else measuredB.start,
      end = if ("end" in edges) settleInset(appliedA.end, measuredA.end, appliedB.end, measuredB.end, full.end) else measuredB.end
    )
  }

  private fun settleInset(appliedA: Float, measuredA: Float, appliedB: Float, measuredB: Float, full: Float): Float {
    if (measuredB == appliedB || measuredA == measuredB || appliedA == appliedB) {
      return measuredB
    }

    val slope = (measuredB - measuredA) / (appliedB - appliedA)

    if (slope >= 1f) {
      return if (measuredB > measuredA) full else 0f
    }

    return ((measuredA - slope * appliedA) / (1f - slope)).coerceIn(0f, full)
  }

  private fun WindowInsetsPixels.toMeasurement(direction: Int = layoutDirection): WindowInsetsMeasurement {
    val isRTL = direction == View.LAYOUT_DIRECTION_RTL
    val i18nUtil = I18nUtil.instance
    val left = PixelUtil.toDIPFromPixel(left)
    val right = PixelUtil.toDIPFromPixel(right)

    return WindowInsetsMeasurement(
      top = PixelUtil.toDIPFromPixel(top),
      bottom = PixelUtil.toDIPFromPixel(bottom),
      start = if (isRTL) right else left,
      end = if (isRTL) left else right,
      isRTL = isRTL,
      swapLeftAndRight = i18nUtil.isRTL(context) && i18nUtil.doLeftAndRightSwapInRTL(context)
    )
  }

  private fun commitInsets(measurement: WindowInsetsMeasurement, tag: Int = 0) {
    val insets = measurement.copy(
      top = if ("top" in edges) measurement.top else 0f,
      bottom = if ("bottom" in edges) measurement.bottom else 0f,
      start = if ("start" in edges) measurement.start else 0f,
      end = if ("end" in edges) measurement.end else 0f
    )

    if (insets == committedInsets && tag == contentTag) {
      return
    }

    val stateWrapper = stateWrapper ?: return

    val committed = updateState(
      stateWrapper,
      tag,
      insets.top,
      insets.bottom,
      insets.start,
      insets.end,
      insets.isRTL,
      insets.swapLeftAndRight
    )

    if (committed) {
      contentTag = tag
      committedInsets = insets
    }
  }

  private external fun updateState(
    stateWrapper: StateWrapper,
    contentTag: Int,
    top: Float,
    bottom: Float,
    start: Float,
    end: Float,
    isRTL: Boolean,
    swapLeftAndRight: Boolean
  ): Boolean

  companion object {
    init {
      SoLoader.loadLibrary("react_codegen_ReactNavigationSpec")
    }
  }
}

internal class WindowInsetsChangeEvent(
  surfaceId: Int,
  viewId: Int,
  private val insets: WindowInsetsMeasurement,
  private val synchronous: Boolean
) : Event<WindowInsetsChangeEvent>(surfaceId, viewId) {

  override fun experimental_isSynchronous(): Boolean {
    return synchronous
  }

  override fun getEventName(): String {
    return "topInsetsChange"
  }

  override fun getEventData(): WritableMap {
    return Arguments.createMap().apply {
      putMap("insets", Arguments.createMap().apply {
        putDouble("top", insets.top.toDouble())
        putDouble("bottom", insets.bottom.toDouble())
        putDouble("start", insets.start.toDouble())
        putDouble("end", insets.end.toDouble())
      })
    }
  }
}
