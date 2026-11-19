package org.reactnavigation

import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

@ReactModule(name = WindowInsetsViewManager.NAME)
class WindowInsetsViewManager : ReactViewManager() {

  override fun getName(): String {
    return NAME
  }

  override fun createViewInstance(context: ThemedReactContext): WindowInsetsView {
    return WindowInsetsView(context)
  }

  @ReactProp(name = "types")
  fun setTypes(view: WindowInsetsView, types: ReadableArray?) {
    var mask = 0
    var includesCustom = false

    if (types != null) {
      for (index in 0 until types.size()) {
        mask = mask or when (val type = types.getString(index)) {
          "custom" -> {
            includesCustom = true

            0
          }

          "systemBars" -> WindowInsetsCompat.Type.systemBars()
          "statusBars" -> WindowInsetsCompat.Type.statusBars()
          "navigationBars" -> WindowInsetsCompat.Type.navigationBars()
          "captionBar" -> WindowInsetsCompat.Type.captionBar()
          "displayCutout" -> WindowInsetsCompat.Type.displayCutout()
          "ime" -> WindowInsetsCompat.Type.ime()
          "systemGestures" -> WindowInsetsCompat.Type.systemGestures()
          "mandatorySystemGestures" -> WindowInsetsCompat.Type.mandatorySystemGestures()
          "tappableElement" -> WindowInsetsCompat.Type.tappableElement()
          else -> throw IllegalArgumentException("Unknown window inset type: $type")
        }
      }
    }

    view.typeMask = mask
    view.includesCustom = includesCustom
  }

  @ReactProp(name = "ignoreVisibility")
  fun setIgnoreVisibility(view: WindowInsetsView, ignoreVisibility: Boolean) {
    view.ignoreVisibility = ignoreVisibility
  }

  @ReactProp(name = "edges")
  fun setEdges(view: WindowInsetsView, edges: ReadableMap?) {
    view.edges = listOf("top", "bottom", "start", "end").filter { edge ->
      (edges?.getString(edge) ?: "off") != "off"
    }.toSet()
  }

  @ReactProp(name = "hasInsetsChangeListener")
  fun setHasInsetsChangeListener(view: WindowInsetsView, hasInsetsChangeListener: Boolean) {
    view.hasInsetsChangeListener = hasInsetsChangeListener
  }

  override fun updateState(view: ReactViewGroup, props: ReactStylesDiffMap?, stateWrapper: StateWrapper?): Any? {
    (view as WindowInsetsView).stateWrapper = stateWrapper

    return null
  }

  override fun onDropViewInstance(view: ReactViewGroup) {
    (view as WindowInsetsView).stateWrapper = null

    super.onDropViewInstance(view)
  }

  override fun onAfterUpdateTransaction(view: ReactViewGroup) {
    super.onAfterUpdateTransaction(view)

    view.rootView.invalidate()
  }

  companion object {
    const val NAME = "ReactNavigationWindowInsetsView"
  }
}
