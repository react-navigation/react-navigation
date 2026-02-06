package org.reactnavigation

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.ReactNavigationMaterialSymbolViewManagerInterface

@ReactModule(name = MaterialSymbolViewManager.NAME)
class MaterialSymbolViewManager : SimpleViewManager<MaterialSymbolView>(),
  ReactNavigationMaterialSymbolViewManagerInterface<MaterialSymbolView> {

  override fun getName(): String {
    return NAME
  }

  override fun createViewInstance(context: ThemedReactContext): MaterialSymbolView {
    return MaterialSymbolView(context)
  }

  @ReactProp(name = "name")
  override fun setName(view: MaterialSymbolView, name: String?) {
    view.setName(name)
  }

  @ReactProp(name = "variant")
  override fun setVariant(view: MaterialSymbolView, variant: String?) {
    view.setVariant(variant)
  }

  @ReactProp(name = "weight")
  override fun setWeight(view: MaterialSymbolView, weight: Int?) {
    view.setWeight(weight)
  }

  @ReactProp(name = "size")
  override fun setSize(view: MaterialSymbolView, size: Float) {
    view.setSize(size)
  }

  @ReactProp(name = "color", customType = "Color")
  override fun setColor(view: MaterialSymbolView, color: Int?) {
    view.setColor(color)
  }

  companion object {
    const val NAME = "ReactNavigationMaterialSymbolView"
  }
}
