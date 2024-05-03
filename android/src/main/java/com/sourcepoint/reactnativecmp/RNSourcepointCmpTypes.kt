package com.sourcepoint.reactnativecmp

import com.facebook.react.bridge.ReadableMap
import com.sourcepoint.cmplibrary.data.network.util.CampaignsEnv
import com.sourcepoint.cmplibrary.model.exposed.TargetingParam

fun campaignsEnvFrom(rawValue: String?): CampaignsEnv? =
  when (rawValue) {
    "public" -> CampaignsEnv.PUBLIC
    "stage" -> CampaignsEnv.STAGE
    else -> { null }
}

data class SPCampaign(
  val rawTargetingParam: ReadableMap?,
  val supportLegacyUSPString: Boolean
) {
  val targetingParams = rawTargetingParam?.toHashMap()?.map { TargetingParam(it.key, it.toString()) } ?: emptyList()
}

data class SPCampaigns(
  val gdpr: SPCampaign?,
  val usnat: SPCampaign?,
  val environment: CampaignsEnv?
)

fun ReadableMap.SPCampaign() = SPCampaign(
  rawTargetingParam = this.getMap("targetingParams"),
  supportLegacyUSPString = if(this.hasKey("supportLegacyUSPString")) this.getBoolean("supportLegacyUSPString") else false
)

fun ReadableMap.SPCampaigns() = SPCampaigns(
  gdpr = this.getMap("gdpr")?.SPCampaign(),
  usnat = this.getMap("usnat")?.SPCampaign(),
  environment = campaignsEnvFrom(rawValue = this.getString("environment"))
)

