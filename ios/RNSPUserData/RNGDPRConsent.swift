//
//  RNGDPRConsent.swift
//  sourcepoint-react-native-cmp
//
//  Created by Andre Herculano on 22/5/24.
//

import Foundation
import ConsentViewController

// encapsulates GDPR consent
struct RNSPGDPRConsent: RNSPConsent {
    struct Statuses: Encodable {
        let consentedAll, consentedAny, rejectedAny: Bool?
    }

    // the uuid given to a consent profile (user) it can be nil if the profile is not yet created
    let uuid: String?

    // the TCF consent string representing this user's consent. this can be nil if the user doesn't yet have consent.
    let euconsent: String?
    let expirationDate, createdDate: SPDate?
    let vendorGrants: SPGDPRVendorGrants
    let statuses: Statuses

    // this data is stored at the "root level" of the `UserDefaults` as specified by
    // https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#in-app-details
    let tcfData: SPJson?
}

extension RNSPGDPRConsent.Statuses {
    init(from status: ConsentStatus) {
        consentedAll = status.consentedAll
        consentedAny = status.consentedToAny
        rejectedAny = status.rejectedAny
    }
}

extension RNSPGDPRConsent {
    init?(from gdpr: SPGDPRConsent?) {
        guard let gdpr = gdpr else { return nil }

        self.init(
            uuid: gdpr.uuid,
            euconsent: gdpr.euconsent,
            expirationDate: nil,
            createdDate: gdpr.dateCreated,
            vendorGrants: gdpr.vendorGrants,
            statuses: Statuses(from: gdpr.consentStatus),
            tcfData: gdpr.tcfData
        )
    }
}

