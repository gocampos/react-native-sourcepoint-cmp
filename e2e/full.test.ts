import { web, element, by, expect, waitFor, device } from 'detox';

export const sleep = async (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

interface ElementAttributes {
  text: string;
}

const app = {
  _timeout: 30000, //ms
  loadMessagesButton: element(by.text(/load messages/i)),
  loadGDPRPMButton: element(by.text(/load gdpr pm/i)),
  loadUSNatPMButton: element(by.text(/load usnat pm/i)),
  clearDataButton: element(by.text(/clear all/i)),
  sdkElement: element(by.id('sdkStatus')),
  gdprUUIDLabel: element(by.id('gdpr.uuid')),
  gdprConsentStatusLabel: element(by.id('gdpr.consentStatus')),
  usnatUUIDLabel: element(by.id('usnat.uuid')),
  usnatConsentStatusLabel: element(by.id('usnat.consentStatus')),
  presentingStatusText: 'Presenting',
  finishedStatusText: 'Finished',
  messageContainer: web.element(by.web.cssSelector('.messageContainer')),
  messageTitle: web.element(by.web.cssSelector('.messageTitle')),
  acceptAllButton: web.element(by.web.cssSelector('.acceptAllButton')),
  rejectAllButton: web.element(by.web.cssSelector('.rejectAllButton')),

  getGDPRUUIDText: async function () {
    return ((await this.gdprUUIDLabel.getAttributes()) as ElementAttributes)
      .text;
  },

  getUSNatUUIDText: async function () {
    return ((await this.usnatUUIDLabel.getAttributes()) as ElementAttributes)
      .text;
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

  assertNoMessageShow: async function () {
    await this.reloadMessages({ clearData: false });
    await this.forSDKToBeFinished();
  },

  reloadMessages: async function ({ clearData }: { clearData: boolean }) {
    if (clearData) await this.clearData();
    await this.loadMessagesButton.tap();
  },

  clearData: async function () {
    await this.clearDataButton.tap();
  },

  acceptAll: async function () {
    await app.forSDKToBePresenting();
    await sleep(2000);
    await app.acceptAllButton.tap();
    return this;
  },

  rejectAll: async function () {
    await app.forSDKToBePresenting();
    await sleep(2000);
    await app.rejectAllButton.tap();
    return this;
  },
};

const assertUUIDsDontChangeAfterReloadingMessages = async () => {
  const gdprUUIDBeforeReloading = await app.getGDPRUUIDText();
  const usnatUUIDBeforeReloading = await app.getUSNatUUIDText();
  await app.assertNoMessageShow();
  await expect(app.gdprUUIDLabel).toHaveText(gdprUUIDBeforeReloading);
  await expect(app.usnatUUIDLabel).toHaveText(usnatUUIDBeforeReloading);
};

const launchApp = async (launchArgs = {}) =>
  device.launchApp({
    newInstance: true,
    launchArgs: { clearData: true, ...launchArgs },
  });

beforeEach(async () => {
  await launchApp();
});

describe('SourcepointSDK', () => {
  it('Accepting All, works', async () => {
    await app.acceptAll(); // GDPR
    await app.acceptAll(); // USNAT
    await app.forSDKToBeFinished();
    await assertUUIDsDontChangeAfterReloadingMessages();
    await expect(app.gdprConsentStatusLabel).toHaveText('consentedAll');
    await expect(app.usnatConsentStatusLabel).toHaveText('consentedAll');
  });

  it('Rejecting All, works', async () => {
    await app.rejectAll(); // GDPR
    await app.rejectAll(); // USNAT
    await app.forSDKToBeFinished();
    await assertUUIDsDontChangeAfterReloadingMessages();
    await expect(app.gdprConsentStatusLabel).toHaveText('rejectedAll');
    await expect(app.usnatConsentStatusLabel).toHaveText('rejectedAll');
  });
});
