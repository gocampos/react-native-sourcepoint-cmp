//
//  RNSPUserData.swift
//  sourcepoint-react-native-cmp
//
//  Created by Andre Herculano on 21/5/24.
//

import Foundation
import ConsentViewController

protocol RNSPConsent: Encodable {
    var uuid: String? { get }
    var expirationDate: SPDate? { get }
    var createdDate: SPDate? { get }
}

// Represents the consent data for a given campaign type.
struct RNSPCampaignData<Consent: RNSPConsent>: Encodable {
    // Whether a campaign "applies", based on the "applies" scope on the campaigns
    // vendor list, setup in Sourcepoint's web dashboard.
    let applies: Bool
    let consents: Consent
}

extension RNSPCampaignData {
    init?(applies: Bool?, consents: Consent?) {
        guard let consents = consents, let applies = applies else { return nil }

        self.applies = applies
        self.consents = consents
    }
}

// Represents the consent data associated with an user.
// It's an interface on top of native SDKs SPUserData
struct RNSPUserData: Encodable {
    let gdpr: RNSPCampaignData<RNSPGDPRConsent>?
    let usnat: RNSPCampaignData<RNSPUSNatConsent>?

    init(
        gdpr: RNSPCampaignData<RNSPGDPRConsent>? = nil,
        usnat: RNSPCampaignData<RNSPUSNatConsent>? = nil
    ) {
        self.gdpr = gdpr
        self.usnat = usnat
    }
}

extension RNSPUserData {
    init(from sdkConsents: SPUserData?) {
        guard let sdkConsents = sdkConsents else {
            self.init()
            return
        }

        self.init(
            gdpr: RNSPCampaignData(
                applies: sdkConsents.gdpr?.applies,
                consents: RNSPGDPRConsent(from: sdkConsents.gdpr?.consents)
            ),
            usnat: RNSPCampaignData(
                applies: sdkConsents.gdpr?.applies,
                consents: RNSPUSNatConsent(from: sdkConsents.usnat?.consents)
            )
        )
    }
}
