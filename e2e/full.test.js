import jestExpect from 'expect';
import { web, element, by, expect, waitFor, device } from 'detox';

const app = {
  _timeout: 30000, //ms
  loadMessagesButton: element(by.text(/load messages/i)),
  loadGDPRPMButton: element(by.text(/load gdpr pm/i)),
  loadUSNatPMButton: element(by.text(/load usnat pm/i)),
  clearDataButton: element(by.text(/clear all/i)),
  sdkElement: element(by.id('sdkStatus')),
  presentingStatusText: 'Presenting',
  finishedStatusText: 'Finished',
  messageTitle: web.element(by.web.cssSelector('.messageTitle')),
  acceptAllButton: web.element(by.web.cssSelector('.acceptAllButton')),
  rejectAllButton: web.element(by.web.cssSelector('.rejectAllButton')),
  pmCancelButton: web.element(by.web.cssSelector('.pmCancelButton')),
  pmToggleOn: web.element(by.web.cssSelector('button[aria-checked=true]')),
  pmToggleOff: web.element(by.web.cssSelector('button[aria-checked=false]')),

  getGDPRUUID: async function () {
    return (await element(by.id('gdpr.uuid')).getAttributes()).text;
  },

  getUSNatUUID: async function () {
    return (await element(by.id('usnat.uuid')).getAttributes()).text;
  },

  forSDKToBePresenting: async function () {
    await waitFor(this.sdkElement)
      .toHaveText(this.presentingStatusText)
      .withTimeout(this._timeout);
  },

  forSDKToBeFinished: async function () {
    await waitFor(this.sdkElement)
      .toHaveText(this.finishedStatusText)
      .withTimeout(this._timeout);
  },

  loadGDPRPM: async function () {
    await this.loadGDPRPMButton.tap();
  },

  loadUSNatPM: async function () {
    await this.loadUSNatPMButton.tap();
  },

  dismissPM: async function () {
    await this.pmCancelButton.tap();
  },

  assertNoMessageShow: async function () {
    await this.reloadMessages({ clearData: false });
    await this.forSDKToBeFinished();
  },

  reloadMessages: async function ({ clearData }) {
    if (clearData) await this.clearData();
    await this.loadMessagesButton.tap();
  },

  clearData: async function () {
    await this.clearDataButton.tap();
  },

  acceptAllGDPRMessage: async function (withTitle = 'GDPR Message') {
    await expect(app.messageTitle).toHaveText(withTitle);
    await app.acceptAllButton.tap();
  },

  acceptAllUSNatMessage: async function (withTitle = 'USNat Message') {
    await expect(app.messageTitle).toHaveText(withTitle);
    await app.acceptAllButton.tap();
  },

  rejectAllGDPRMessage: async function (withTitle = 'GDPR Message') {
    await expect(app.messageTitle).toHaveText(withTitle);
    await app.rejectAllButton.tap();
  },

  rejectAllUSNatMessage: async function (withTitle = 'USNat Message') {
    await expect(app.messageTitle).toHaveText(withTitle);
    await app.rejectAllButton.tap();
  },
};

const assertUUIDsDidntChange = async () => {
  const gdprUUIDBeforeReloading = app.gdprUUID;
  const usnatUUIDBeforeReloading = app.usnatUUID;
  await app.assertNoMessageShow();
  jestExpect(gdprUUIDBeforeReloading).toEqual(app.gdprUUID);
  jestExpect(usnatUUIDBeforeReloading).toEqual(app.usnatUUID);
};

const assertAllPMToggles = async (loadPMFn, { toggled, togglesCount }) => {
  await loadPMFn();
  await app.forSDKToBePresenting();
  if (toggled) {
    await expect(app.pmToggleOn.atIndex(togglesCount - 1)).toExist();
  } else {
    await expect(app.pmToggleOff.atIndex(togglesCount - 1)).toExist();
  }
  await app.dismissPM();
};

describe('SourcepointSDK', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  afterEach(async () => {
    await app.clearData();
    await device.reloadReactNative();
  });

  it('Accepting All, works', async () => {
    await app.forSDKToBePresenting();
    await app.acceptAllGDPRMessage();
    await app.acceptAllUSNatMessage();
    await app.forSDKToBeFinished();
    await assertUUIDsDidntChange();
    await assertAllPMToggles(() => app.loadGDPRPM(), {
      toggled: true,
      togglesCount: 10,
    });
    await assertAllPMToggles(() => app.loadUSNatPM(), {
      toggled: true,
      togglesCount: 1,
    });
  });

  it('Rejecting All, works', async () => {
    await app.forSDKToBePresenting();
    await app.rejectAllGDPRMessage();
    await app.rejectAllUSNatMessage();
    await app.forSDKToBeFinished();
    await assertUUIDsDidntChange();
    await assertAllPMToggles(() => app.loadGDPRPM(), {
      toggled: false,
      togglesCount: 10,
    });
    await assertAllPMToggles(() => app.loadUSNatPM(), {
      toggled: false,
      togglesCount: 1,
    });
  });
});
