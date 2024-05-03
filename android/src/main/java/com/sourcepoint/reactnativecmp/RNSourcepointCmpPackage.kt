package com.sourcepoint.reactnativecmp

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.module.model.ReactModuleInfo
import java.util.HashMap

class RNSourcepointCmpPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == RNSourcepointCmpModule.NAME) {
      RNSourcepointCmpModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      moduleInfos[RNSourcepointCmpModule.NAME] = ReactModuleInfo(
        RNSourcepointCmpModule.NAME,
        RNSourcepointCmpModule.NAME,
        false,
        false,
        false,
        isTurboModule
      )
      moduleInfos
    }
  }
}
