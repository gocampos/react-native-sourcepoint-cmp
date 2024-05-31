//
//  RNSourcepointActionType.swift
//  sourcepoint-react-native-cmp
//
//  Created by Andre Herculano on 31/5/24.
//

import Foundation
import ConsentViewController

enum RNSourcepointActionType: String, Codable {
    case acceptAll, rejectAll, showPrivacyManager, saveAndExit, dismiss, pmCancel, unknown

    init(from actionType: SPActionType){
        switch actionType {
        case .AcceptAll: self = .acceptAll
        case .RejectAll: self = .rejectAll
        case .SaveAndExit: self = .saveAndExit
        case .ShowPrivacyManager: self = .showPrivacyManager
        case .Dismiss: self = .dismiss
        case .PMCancel: self = .pmCancel
        default: self = .unknown
        }
    }
}
