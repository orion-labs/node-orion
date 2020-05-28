/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

const fs = require('fs');
const imageThumbnail = require('image-thumbnail');
const OrionClient = require('./../src/main');

let OrionCrypto = false;
try {
  require.resolve('@orionlabs/node-orion-crypto');
  OrionCrypto = require('@orionlabs/node-orion-crypto');
} catch (exception) {
  OrionCrypto = false;
}

describe('auth', () => {
  it('Should Login to Orion and retrieve a Token & User ID', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();
    });
  });

  it('Should fail', () => {
    return OrionClient.auth('bad-username', 'bad-password').catch((error) => {
      expect(error).toBeInstanceOf(Object);
    });
  });
});

describe('logout', () => {
  it('Should Log Out of a given Session ID', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((res) => {
      expect(res).toBeDefined();

      const token = res.token;
      const userId = res.id;
      const sessionId = res.sessionId;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();
      expect(sessionId).toBeDefined();

      return OrionClient.logout(token, sessionId).then((res) => {
        expect(res).toBeDefined();
      });
    });
  });
});

describe('whoami', () => {
  it('Should get the User Profile for the current user', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((res) => {
      expect(res).toBeDefined();

      const token = res.token;
      const userId = res.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.whoami(token).then((res) => {
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
      });
    });
  });
});

describe('updateUserStatus', () => {
  it('Should Update my User Status', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      const userstatus = {
        id: userId,
        lat: 1.2,
        lng: 2.1,
      };

      return OrionClient.updateUserStatus(token, userstatus).then((resolve) => {
        expect(resolve).toBeDefined();
      });
    });
  });
});

describe('engage', () => {
  it('Should Engage with an Orion Group', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;
    const groups = process.env.TEST_ORION_GROUPS;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.engage(token, groups).then((resolve) => {
        expect(resolve).toBeInstanceOf(Object);
        expect(resolve.configuration.mediabase).toBeDefined();
        expect(resolve.streamURL).toContain(groups);
      });
    });
  });

  it('Should fail', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.engage(token, 'bad-group').catch((error) => {
        expect(error).toBeInstanceOf(Object);
      });
    });
  });
});

describe('getAllUserGroups', () => {
  it('Should get all Groups for the currently logged-in User', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.getAllUserGroups(token).then((resolve) => {
        expect(resolve).toBeInstanceOf(Array);
        expect(resolve.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

describe('getUserStatus', () => {
  it('Should get User Status for the given User', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.getUserStatus(token, userId).then((resolve) => {
        expect(resolve).toBeInstanceOf(Object);
        expect(resolve.groups.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

describe('getUser', () => {
  it('Should get User Profile for the given User', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.getUser(token, userId).then((resolve) => {
        expect(resolve).toBeInstanceOf(Object);
        expect(resolve.id).toEqual(userId);
        expect(resolve.profile).toBeInstanceOf(Object);
      });
    });
  });
});

describe('getGroup', () => {
  it('Should get Group Profile for the given Group', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;
    const groups = process.env.TEST_ORION_GROUPS;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;

      expect(token).toBeDefined();

      return OrionClient.getGroup(token, groups).then((resolve) => {
        expect(resolve).toBeInstanceOf(Object);
        expect(resolve.id).toBeDefined();
        expect(resolve.members).toBeInstanceOf(Object);
      });
    });
  });

  it('Should fail', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;

      expect(token).toBeDefined();

      return OrionClient.getGroup(token, 'bad-group').catch((reason) => {
        expect(reason).toBeInstanceOf(Object);
      });
    });
  });
});

describe('sendText', () => {
  const username = process.env.TEST_ORION_USERNAME;
  const password = process.env.TEST_ORION_PASSWORD;
  const groups = process.env.TEST_ORION_GROUPS;
  const message = "Hello from node-orion's sendText unit test!";

  it('Should send a text message to a group', () => {
    return OrionClient.auth(username, password).then(({ token }) => {
      return OrionClient.sendText(token, message, groups).then((res) => {
        expect(res).toBeDefined();
      });
    });
  });

  it('Should send a text message to a target user', () => {
    return OrionClient.auth(username, password).then(({ token, id }) => {
      return OrionClient.sendText(token, message, groups, id).then((res) => {
        expect(res).toBeDefined();
      });
    });
  });

  if (OrionCrypto) {
    it('Should send an encrypted text message to a group', () => {
      return OrionClient.auth(username, password).then(({ token }) => {
        const streamKey = OrionCrypto.utils.generateStreamKey();
        let cipherMessage = OrionCrypto.encryptText(streamKey, message);
        return OrionClient.sendText(token, cipherMessage, groups, null, streamKey).then(
          (response) => {
            expect(response).toBeDefined();
          },
        );
      });
    });
  }
});

describe('sendImage', () => {
  const imageFile = Buffer.from(fs.readFileSync('test/test_input_image.png'));
  const username = process.env.TEST_ORION_USERNAME;
  const password = process.env.TEST_ORION_PASSWORD;
  const groups = process.env.TEST_ORION_GROUPS;

  it('Should send an image to a group', () => {
    return OrionClient.auth(username, password).then(({ token }) => {
      const imageFile = new Uint8Array(fs.readFileSync('test/test_input_image.png'));
      return OrionClient.sendImage(token, imageFile, groups).then((response) => {
        console.log(response);
        expect(response).toBeDefined();
      });
    });
  });

  it('Should send an image to a target user', () => {
    return OrionClient.auth(username, password).then(({ token, id }) => {
      const imageFile = new Uint8Array(fs.readFileSync('test/test_input_image.png'));
      return OrionClient.sendImage(token, imageFile, groups, id).then((response) => {
        console.log(response);
        expect(response).toBeDefined();
      });
    });
  });

  if (OrionCrypto) {
    it('Should send an encrypted image to a group', () => {
      return OrionClient.auth(username, password).then(({ token }) => {
        let streamKey = OrionCrypto.utils.generateStreamKey();
        const cipherImage = OrionCrypto.encryptImage(streamKey, imageFile);
        return OrionClient.sendImage(token, cipherImage, groups, null, streamKey).then((res) => {
          expect(res).toBeDefined();
        });
      });
    });

    it('Should send an encrypted image to a group with thumb', () => {
      return OrionClient.auth(username, password).then(({ token }) => {
        let streamKey = OrionCrypto.utils.generateStreamKey();
        const cipherImage = OrionCrypto.encryptImage(streamKey, imageFile);
        return imageThumbnail(imageFile, { percentage: 20 }).then((thumbMedia) => {
          thumbMedia = OrionCrypto.encryptImage(streamKey, thumbMedia);
          return OrionClient.sendImage(
            token,
            cipherImage,
            groups,
            null,
            streamKey,
            'image/png',
            thumbMedia,
          ).then((res) => {
            expect(res).toBeDefined();
          });
        });
      });
    });
  }
});
