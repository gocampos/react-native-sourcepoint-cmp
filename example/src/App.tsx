import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Button, StyleSheet } from 'react-native';
import { LaunchArguments } from 'react-native-launch-arguments';

import {
  SPConsentManager,
  SPCampaignEnvironment,
} from '@sourcepoint/react-native-cmp';
import type { SPCampaigns, SPUserData } from '@sourcepoint/react-native-cmp';
import type { LaunchArgs } from './LaunchArgs';

import UserDataView from './UserDataView';

enum SDKStatus {
  NotStarted = 'Not Started',
  Networking = 'Networking',
  Presenting = 'Presenting',
  Finished = 'Finished',
  Errored = 'Errored',
}

const launchArgs = LaunchArguments.value<LaunchArgs>();

const config = {
  accountId: 22,
  propertyId: 16893,
  propertyName: 'mobile.multicampaign.demo',
  gdprPMId: '488393',
  usnatPMId: '988851',
  campaigns: {
    gdpr: {},
    usnat: { supportLegacyUSPString: true },
    environment: SPCampaignEnvironment.Public,
  } as SPCampaigns,
  ...launchArgs?.config,
};

export default function App() {
  const [userData, setUserData] = useState<SPUserData>({});
  const [sdkStatus, setSDKStatus] = useState<SDKStatus>(SDKStatus.NotStarted);
  const consentManager = useRef<SPConsentManager | null>();

  useEffect(() => {
    consentManager.current = new SPConsentManager();
    consentManager.current?.build(
      config.accountId,
      config.propertyId,
      config.propertyName,
      config.campaigns
    );

    if (launchArgs.clearData === true) {
      consentManager.current?.clearLocalData();
    }

    consentManager.current?.onSPUIReady(() =>
      setSDKStatus(SDKStatus.Presenting)
    );

    consentManager.current?.onSPUIFinished(() =>
      setSDKStatus(SDKStatus.Networking)
    );

    consentManager.current?.onFinished(() => {
      setSDKStatus(SDKStatus.Finished);
      consentManager.current?.getUserData().then(setUserData);
    });

    consentManager.current?.onAction((actionType) => console.log(actionType));

    consentManager.current?.onError((description) => {
      setSDKStatus(SDKStatus.Errored);
      console.error(description);
    });

    consentManager.current?.getUserData().then(setUserData);

    consentManager.current?.loadMessage();

    setSDKStatus(SDKStatus.Networking);

    return () => {
      consentManager.current?.dispose();
    };
  }, []);

  const onLoadMessagePress = useCallback(() => {
    consentManager.current?.loadMessage();
    setSDKStatus(SDKStatus.Networking);
  }, []);

  const onGDPRPMPress = useCallback(() => {
    setSDKStatus(SDKStatus.Networking);
    consentManager.current?.loadGDPRPrivacyManager(config.gdprPMId);
  }, []);

  const onUSNATPMPress = useCallback(() => {
    setSDKStatus(SDKStatus.Networking);
    consentManager.current?.loadUSNatPrivacyManager(config.usnatPMId);
  }, []);

  const onClearDataPress = useCallback(() => {
    consentManager.current?.clearLocalData();
    setUserData({});
  }, []);

  const disable =
    sdkStatus === SDKStatus.Networking || sdkStatus === SDKStatus.Presenting;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Sourcepoint CMP</Text>
        <Button
          title="Load Messages"
          onPress={onLoadMessagePress}
          disabled={disable}
        />
        <Button
          title="Load GDPR PM"
          onPress={onGDPRPMPress}
          disabled={disable}
        />
        <Button
          title="Load USNAT PM"
          onPress={onUSNATPMPress}
          disabled={disable}
        />
        <Button title="Clear All" onPress={onClearDataPress} />
        <Text testID="sdkStatus" style={styles.status}>
          {sdkStatus}
        </Text>
      </View>
      <UserDataView data={userData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  status: {
    textAlign: 'center',
    color: '#999',
  },
});
