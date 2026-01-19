package org.reactnavigation

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = MaterialSymbolViewManager.NAME)
class MaterialSymbolViewManager : SimpleViewManager<MaterialSymbolView>() {

  override fun getName(): String {
    return NAME
  }

  override fun createViewInstance(context: ThemedReactContext): MaterialSymbolView {
    return MaterialSymbolView(context)
  }

  @ReactProp(name = "name")
  fun setName(view: MaterialSymbolView, name: String) {
    view.setName(name)
  }

  @ReactProp(name = "variant")
  fun setVariant(view: MaterialSymbolView, variant: String) {
    view.setVariant(variant)
  }

  @ReactProp(name = "color", customType = "Color", defaultInt = android.graphics.Color.BLACK)
  fun setColor(view: MaterialSymbolView, color: Int) {
    view.setColor(color)
  }

  @ReactProp(name = "size")
  fun setSize(view: MaterialSymbolView, size: Float) {
    view.setSize(size)
  }

  companion object {
    const val NAME = "ReactNavigationMaterialSymbolView"
  }
}
