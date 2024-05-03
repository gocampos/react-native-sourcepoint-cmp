package com.sourcepoint.reactnativecmp

import com.facebook.react.bridge.ReactApplicationContext

abstract class RNSourcepointCmpSpec internal constructor(context: ReactApplicationContext) :
  NativeSourcepointCmpSpec(context) {
  abstract fun build(accountId: Int, propertyId: Int, propertyName: String)
  abstract fun loadMessage()
  abstract fun clearLocalData()
  abstract fun getUserData(promise: Promise)
  abstract fun loadGDPRPrivacyManager(pmId: String)
  abstract fun loadUSNatPrivacyManager(pmId: String)
  abstract fun supportedEvents(): Array<String>
}
