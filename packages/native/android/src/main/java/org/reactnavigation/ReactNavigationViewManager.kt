package org.reactnavigation

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.views.view.ReactViewManager

@ReactModule(name = ReactNavigationViewManager.NAME)
class ReactNavigationViewManager : ReactViewManager() {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "ReactNavigationView"
  }
}
