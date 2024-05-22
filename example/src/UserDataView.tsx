import * as React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import { TestableText } from './TestableText';
import type { SPUserData } from '@sourcepoint/react-native-cmp';

export default ({ data }: UserDataViewProps) => (
  <View style={styles.container}>
    <Text style={styles.header}>Local User Data</Text>
    <TestableText testID="gdpr.uuid">{data?.gdpr?.consents?.uuid}</TestableText>
    <TestableText testID="gdpr.consentStatus">
      {data?.gdpr?.consents?.statuses?.consentedAll
        ? 'consentedAll'
        : 'rejectedAll'}
    </TestableText>
    <TestableText testID="usnat.uuid">
      {data?.usnat?.consents?.uuid}
    </TestableText>
    <TestableText testID="usnat.consentStatus">
      {data?.usnat?.consents?.statuses?.consentedAll
        ? 'consentedAll'
        : 'rejectedAll'}
    </TestableText>
    <ScrollView style={styles.container}>
      <Text testID="userData" style={styles.userDataText}>
        {JSON.stringify(data, null, 2)}
      </Text>
    </ScrollView>
  </View>
);

type UserDataViewProps = {
  data: SPUserData;
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
