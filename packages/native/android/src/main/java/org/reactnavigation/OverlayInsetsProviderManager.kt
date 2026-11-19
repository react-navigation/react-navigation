package org.reactnavigation

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReactContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

@ReactModule(name = OverlayInsetsProviderManager.NAME)
class OverlayInsetsProviderManager : ReactViewManager() {

  override fun getName(): String {
    return NAME
  }

  override fun createViewInstance(context: ThemedReactContext): OverlayInsetsProvider {
    return OverlayInsetsProvider(context)
  }

  @ReactProp(name = "insets")
  fun setInsets(view: OverlayInsetsProvider, insets: ReadableMap?) {
    fun inset(edge: String): Float {
      return if (insets != null && insets.hasKey(edge)) {
        insets.getDouble(edge).toFloat()
      } else {
        0f
      }
    }

    view.insetTop = inset("top")
    view.insetBottom = inset("bottom")
    view.insetStart = inset("start")
    view.insetEnd = inset("end")

    view.rootView.invalidate()
  }

  companion object {
    const val NAME = "ReactNavigationOverlayInsetsProvider"
  }
}

class OverlayInsetsProvider(context: ReactContext) : ReactViewGroup(context) {
  var insetTop = 0f
  var insetBottom = 0f
  var insetStart = 0f
  var insetEnd = 0f
}
