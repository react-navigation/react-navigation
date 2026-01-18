package org.reactnavigation

import com.facebook.fbreact.specs.NativeMaterialSymbolModuleSpec
import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class ReactNavigationPackage : BaseReactPackage() {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(MaterialSymbolViewManager())
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      NativeMaterialSymbolModuleSpec.NAME -> MaterialSymbolModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        NativeMaterialSymbolModuleSpec.NAME to ReactModuleInfo(
          NativeMaterialSymbolModuleSpec.NAME,
          MaterialSymbolModule::class.java.name,
          false, // canOverrideExistingModule
          false, // needsEagerInit
          false, // isCxxModule
          true // isTurboModule
        )
      )
    }
  }
}
