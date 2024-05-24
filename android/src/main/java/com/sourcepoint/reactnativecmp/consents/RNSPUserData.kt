package com.sourcepoint.reactnativecmp.consents

import com.facebook.react.bridge.Arguments.createMap
import com.facebook.react.bridge.ReadableMap
import com.sourcepoint.cmplibrary.model.exposed.SPConsents

interface RNMappable {
  fun toRN(): ReadableMap
}

interface RNSPConsent: RNMappable {
  val uuid: String?
  val expirationDate: String?
  val createdDate: String?
}

data class RNSPCampaignData<Consent: RNSPConsent>(
  val applies: Boolean,
  val consents: Consent
): RNMappable {
  override fun toRN(): ReadableMap = createMap().apply {
    putBoolean("applies", applies)
    putMap("consents", consents.toRN())
  }
}

data class RNSPUserData(
  val gdpr: RNSPCampaignData<RNSPGDPRConsent>?,
  val usnat: RNSPCampaignData<RNSPUSNatConsent>?
): RNMappable {
  constructor(spData: SPConsents): this(
    gdpr = spData.gdpr?.let { RNSPCampaignData<RNSPGDPRConsent>(
      applies = it.consent.applies,
      consents = RNSPGDPRConsent(gdpr = it.consent)
    )},
    usnat = spData.usNat?.let { RNSPCampaignData<RNSPUSNatConsent>(
      applies = it.consent.applies,
      consents = RNSPUSNatConsent(usnat = it.consent)
    )}
  )

  override fun toRN(): ReadableMap = createMap().apply {
    gdpr?.let { putMap("gdpr", it.toRN()) }
    usnat?.let { putMap("usnat", it.toRN()) }
  }
}
