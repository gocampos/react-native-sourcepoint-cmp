//
//  RCTConvert+Types.swift
//  sourcepoint-react-native-cmp
//
//  Created by Andre Herculano on 3/5/24.
//

import Foundation
import React
import ConsentViewController

extension RCTConvert {
    @objc static func SPCampaignEnv(_ envString: String?) -> ConsentViewController.SPCampaignEnv {
        switch envString {
        case "public": .Public
        case "stage": .Stage
        default: .Public
        }
    }
    
    @objc static func SPCampaign(_ json: NSDictionary?) -> ConsentViewController.SPCampaign? {
        guard let json = json else { return nil }
        
        return ConsentViewController.SPCampaign(
            targetingParams: json["targetingParams"] as? [String: String] ?? [:],
            supportLegacyUSPString: json["supportLegacyUSPString"] as? Bool ?? false
        )
    }
    
    @objc static func SPCampaigns(_ json: NSDictionary) -> ConsentViewController.SPCampaigns {
        ConsentViewController.SPCampaigns(
            gdpr: SPCampaign(json["gdpr"] as? NSDictionary),
            usnat: SPCampaign(json["usnat"] as? NSDictionary),
            environment: SPCampaignEnv(json["environment"] as? String)
        )
    }
}
