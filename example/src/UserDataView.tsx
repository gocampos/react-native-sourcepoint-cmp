import * as React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import { TestableText } from './TestableText';

export default ({ data }: UserDataViewProps) => (
  <View style={styles.container}>
    <Text style={styles.header}>Local User Data</Text>
    <TestableText testID="gdpr.uuid">{data?.gdpr?.consents?.uuid}</TestableText>
    <TestableText testID="gdpr.consentStatus">
      {data?.gdpr?.consents?.consentStatus?.consentedAll
        ? 'consentedAll'
        : 'rejectedAll'}
    </TestableText>
    <TestableText testID="usnat.uuid">
      {data?.usnat?.consents?.uuid}
    </TestableText>
    <TestableText testID="usnat.consentStatus">
      {/* TODO: cleanup below once consent classes are standardised */}
      {data?.usnat?.consents?.consentStatus?.consentedToAll ||
      data?.usnat?.consents?.consentStatus?.consentedAll
        ? 'consentedAll'
        : 'rejectedAll'}
    </TestableText>
    <ScrollView style={styles.container}>
      <Text testID="userData" style={styles.userDataText}>
        {JSON.stringify(
          {
            gdpr: {
              uuid: data?.gdpr?.consents?.uuid,
              consentStatus: data?.gdpr?.consents?.consentStatus,
              applies: data?.gdpr?.applies,
            },
            usnat: {
              uuid: data?.usnat?.consents?.uuid,
              consentStatus: data?.usnat?.consents?.consentStatus,
              applies: data?.usnat?.applies,
            },
          },
          null,
          2
        )}
      </Text>
    </ScrollView>
  </View>
);

type UserDataViewProps = {
  data: Record<string | number | symbol, any>;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
  },
  userDataText: {
    fontSize: 10,
  },
});
