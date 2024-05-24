# @sourcepoint/react-native-cmp

The official React Native package for Sourcepoint

## Installation

```sh
npm install @sourcepoint/react-native-cmp
```

## Usage

### Overview
In a nutshell, in order to use the `SPConsentManager`  you'll need:
1. Instantiate and call build with your configuration
2. Set up the callbacks in the instance of `SPConsentManager`
3. Call `loadMessages`. This will initiate the message, contact SP's servers, and it may or may not display a message, depending on your campaign scenario (configured in Sourcepoin't Dashboard).
4. Retrieve user data with `getUserData`.

Let's review each of the steps above in more detail.

### Instantiate and call build with your configuration
In your app, you can setup the SPConsent manager in a external file or on your App. In this example we use `useRef`
to keep a reference of the `SPConsentManager`. It's important to notice we wrap the initialisation of `SPConsentManager` in a `useEffect` and call `consentManager.current?.dispose()` to avoid memory leaks.
```ts
const consentManager = useRef<SPConsentManager | null>();

useEffect(() => {
  consentManager.current = new SPConsentManager();
  consentManager.current?.build(
    config.accountId,
    config.propertyId,
    config.propertyName,
    config.campaigns
  );

  return () => {
    consentManager.current?.dispose();
  };
}
```

### Set up the callbacks in the instance of `SPConsentManager`
`SPConsentManager` communicates with your app through a series of callbacks.

* `onSPUIReady(callback: () => {})`
This is called if the server determined a message should be displayed. The native SDKs will take care of the showing the message.
* `onAction(callback: (action: string) => {});`
Called when the user takes a action (e.g. accept all) within the consent message. `action: string` is going to be replaced with an enum.
* `onSPUIFinished(callback: () => {})`
Called when the native SDKs is done removing the consent UI from the foreground.
* `onFinished(callback: () => {})`
Called when all UI and network processes are finished. User consent is stored on the local storage of each platform (`UserDefaults` for iOS and `SharedPrefs` for Android). And it's safe to retrieve consent data with `getUserData`
* `onError(callback: (description: string) => {})`
Called if something go wrong.

### Call `loadMessages`
After instantiating and setting up `SPConsentManager`, configuring its callbacks, it's time to call `loadMessages`. This can be done at any stage of your app's lifecycle. Ideally you will want to call it as early as possible, in order to have consent for your vendors.

### Retrieve user data with `getUserData`
`getUserData` returns a `Promise<SPUserData>`. You can call this function at any point in your app's lifecycle, but consent may or may not yet be ready. The safest place to call it is inside the callback `onSPFinished`.

## Full Example
```jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { SPConsentManager, SPCampaignEnvironment } from '@sourcepoint/react-native-cmp';

export default function App() {
  const [userData, setUserData] = useState<SPUserData>({});
  const consentManager = useRef<SPConsentManager | null>();

  useEffect(() => {
    // setup
    consentManager.current = new SPConsentManager();
    consentManager.current?.build(
      22,
      16893,
      "mobile.multicampaign.demo",
      {
        gdpr: {},
        // usnat: {} // uncomment this if you have a usnat campaign set up
      }
    );

    // configure callbacks
    consentManager.current?.onSPUIReady(() => {
      console.log("Consent UI is ready to be displayed")
    });
    consentManager.current?.onSPUIFinished(() => {
      console.log("Consent UI is finished")
    });
    consentManager.current?.onFinished(() => {
      consentManager.current?.getUserData().then(setUserData);
    });
    consentManager.current?.onAction((action) => {
      console.log(`User took action ${action}`)
    });
    consentManager.current?.onError(console.error);

    consentManager.current?.loadMessage();

    return () => {
      consentManager.current?.dispose();
    };
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text>{JSON.stringify(userData, null, 2)}</Text>
      </View>
    </SafeAreaView>
)
```

### Complete Example

For a complete app example, check the `/example` folder.

## License

MIT

