//
//  Utils.swift
//  react-native-sourcepoint-cmp
//
//  Created by Andre Herculano on 21.12.23.
//

import Foundation

extension Encodable {
    func toDictionary() -> [String: Any] {
        guard let jsonData = try? JSONEncoder().encode(self) else {
            return [:]
        }
        return (try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any]) ?? [:]
    }
}
