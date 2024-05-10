import type { SPCampaigns } from '@sourcepoint/react-native-cmp';

export type LaunchArgs = {
  config: {
    accountId?: number;
    propertyId?: number;
    propertyName?: string;
    gdprPMId?: string;
    usnatPMId?: string;
    campaigns?: SPCampaigns;
  };
  clearData?: boolean;
};
