package org.reactnavigation

import android.graphics.Matrix
import android.view.View
import android.widget.HorizontalScrollView
import androidx.core.graphics.Insets
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.uimanager.PixelUtil
import kotlin.math.max

internal data class WindowInsetsPixels(
  val top: Float,
  val bottom: Float,
  val left: Float,
  val right: Float
) {
  fun flipped(horizontal: Boolean, vertical: Boolean): WindowInsetsPixels {
    return WindowInsetsPixels(
      top = if (vertical) bottom else top,
      bottom = if (vertical) top else bottom,
      left = if (horizontal) right else left,
      right = if (horizontal) left else right
    )
  }
}

internal data class ResolvedWindowInsets(
  val overlap: WindowInsetsPixels,
  val full: WindowInsetsPixels
)

internal fun resolveWindowInsets(
  view: View,
  windowInsets: WindowInsetsCompat,
  typeMask: Int,
  includesCustom: Boolean,
  ignoreVisibility: Boolean
): ResolvedWindowInsets {
  val matrix = FloatArray(9)
  var host = view
  var x = 0
  var y = 0
  var isFlippedX = false
  var isFlippedY = false

  do {
    val parent = host.parent as? View ?: break

    host.matrix.getValues(matrix)

    // We ignore transforms used for animations, but RTL scroll views and inverted lists use negative scales
    // So we mirror the position within the flipped view to get where the content is on the screen
    if (matrix[Matrix.MSCALE_X] < 0) {
      x = host.width - x - view.width
      isFlippedX = !isFlippedX
    }

    if (matrix[Matrix.MSCALE_Y] < 0) {
      y = host.height - y - view.height
      isFlippedY = !isFlippedY
    }

    x += host.left
    y += host.top

    if (parent is HorizontalScrollView && host.layoutDirection == View.LAYOUT_DIRECTION_RTL) {
      // We use the offset before any scrolling to avoid changing insets during scroll
      // In RTL, we start at the right edge of the content rather than the left edge
      x -= max(0, host.width - parent.width)
    }

    host = parent
  } while (host !is OverlayInsetsProvider)

  val insets = if (host is OverlayInsetsProvider) {
    val inherited = resolveWindowInsets(host, windowInsets, typeMask, includesCustom, ignoreVisibility).overlap

    // We add provider insets only for custom, so they don't affect unrelated insets
    // For example, we still measure the keyboard from the window when the safe area is overridden
    if (!includesCustom) {
      inherited
    } else {
      val isRTL = host.layoutDirection == View.LAYOUT_DIRECTION_RTL

      WindowInsetsPixels(
        top = max(PixelUtil.toPixelFromDIP(host.insetTop), inherited.top),
        bottom = max(PixelUtil.toPixelFromDIP(host.insetBottom), inherited.bottom),
        left = max(PixelUtil.toPixelFromDIP(if (isRTL) host.insetEnd else host.insetStart), inherited.left),
        right = max(PixelUtil.toPixelFromDIP(if (isRTL) host.insetStart else host.insetEnd), inherited.right)
      )
    }
  } else {
    val visibleInsets = windowInsets.getInsets(typeMask)
    val insets = if (ignoreVisibility) {
      // The keyboard has no size while hidden, so the system throws if we ask for it
      Insets.max(
        visibleInsets,
        windowInsets.getInsetsIgnoringVisibility(typeMask and WindowInsetsCompat.Type.ime().inv())
      )
    } else {
      visibleInsets
    }

    WindowInsetsPixels(
      top = insets.top.toFloat(),
      bottom = insets.bottom.toFloat(),
      left = insets.left.toFloat(),
      right = insets.right.toFloat()
    )
  }

  val top = max(0f, insets.top - max(0, y))
  val bottom = max(0f, insets.bottom - max(0, host.height - y - view.height))
  val left = max(0f, insets.left - max(0, x))
  val right = max(0f, insets.right - max(0, host.width - x - view.width))

  // The edges of a view flipped an odd number of times are on the opposite sides of the screen
  // So we swap the insets for the flipped axis to apply them on the sides where they're needed
  return ResolvedWindowInsets(
    overlap = WindowInsetsPixels(top, bottom, left, right).flipped(isFlippedX, isFlippedY),
    full = insets.flipped(isFlippedX, isFlippedY)
  )
}
