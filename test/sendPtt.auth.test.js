/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

const fs = require('fs');
const OrionClient = require('./../src/main');

let OrionCrypto = false;
try {
  require.resolve('@orionlabs/node-orion-crypto');
  OrionCrypto = require('@orionlabs/node-orion-crypto');
} catch (exception) {
  OrionCrypto = false;
}

describe('sendPtt', () => {
  const username = process.env.TEST_ORION_USERNAME;
  const password = process.env.TEST_ORION_PASSWORD;
  const groups = process.env.TEST_ORION_GROUPS;
  const fileName = 'test/test.ov';

  it('Should send a PTT Voice message to a group', () => {
    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();
      const token = resolve.token;
      expect(token).toBeDefined();

      const media = new Uint8Array(fs.readFileSync(fileName));

      return OrionClient.sendPtt(token, media, groups).then((response) => {
        expect(response).toBeDefined();
      });
    });
  });

  it('Should send a PTT Voice message to a targeted user', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;
    const groups = process.env.TEST_ORION_GROUPS;
    const fileName = 'test/test.ov';

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();
      const token = resolve.token;
      const userId = resolve.id;
      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      const media = new Uint8Array(fs.readFileSync(fileName));

      return OrionClient.sendPtt(token, media, groups, userId).then((response) => {
        expect(response).toBeDefined();
      });
    });
  });

  it('Should not send a PTT Voice message to a group', () => {
    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();
      const token = resolve.token;
      const userId = resolve.id;
      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      const media = new Uint8Array(fs.readFileSync(fileName));

      return OrionClient.sendPtt(token, media, 'x').catch((error) => {
        expect(error).toBeDefined();
      });
    });
  });
  if (OrionCrypto) {
    it('Should send an encrypted PTT Voice message to a group', () => {
      const username = process.env.TEST_ORION_USERNAME;
      const password = process.env.TEST_ORION_PASSWORD;
      const groups = process.env.TEST_ORION_GROUPS;
      const fileName = 'test/test.ov';

      return OrionClient.auth(username, password).then((resolve) => {
        expect(resolve).toBeInstanceOf(Object);
        expect(resolve).toBeDefined();
        const token = resolve.token;
        expect(token).toBeDefined();

        const media = new Uint8Array(fs.readFileSync(fileName));

        let streamKey = OrionCrypto.utils.generateStreamKey();
        let cipherMedia = OrionCrypto.encryptOpus(streamKey, media);

        return OrionClient.sendPtt(token, cipherMedia, groups, null, streamKey).then((response) => {
          expect(response).toBeDefined();
        });
      });
    });
  }
});
