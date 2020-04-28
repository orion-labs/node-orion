/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

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

  it('Should fail to login', () => {
    return OrionClient.auth('bad-username', 'bad-password').catch((error) => {
      expect(error).toBeInstanceOf(Object);
      // Should be 401, but if we run the test too many times we'll get 429.
      expect(error.id).toBeGreaterThan(400);
    });
  });
});

describe('whoami', () => {
  it('Should get the User Profile for the current user', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      return OrionClient.whoami(token).then((resolve) => {
        expect(resolve).toBeDefined();
        expect(resolve.id).toBeDefined();
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

  it('Should not Engage with an Orion Group', () => {
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
        expect(error.id).toEqual(404);
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
        expect(resolve.groups.length).toBeLessThanOrEqual(1);
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

  it('Should not get Group Profile', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;

      expect(token).toBeDefined();

      return OrionClient.getGroup(token, 'bad-group').catch((response) => {
        expect(response).toBeInstanceOf(Object);
        expect(response.id).toEqual(404);
      });
    });
  });
});

describe('sendTextMessage', () => {
  it('Should send a text message to a group', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;
    const groups = process.env.TEST_ORION_GROUPS;

    return OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeInstanceOf(Object);
      expect(resolve).toBeDefined();

      const token = resolve.token;

      expect(token).toBeDefined();

      const message = 'Hello from a unit test!';
      return OrionClient.sendTextMessage(token, message, groups).then((response) => {
        console.log(response);
        expect(response).toBeDefined();
      });
    });
  });

  if (OrionCrypto) {
    it('Should send an encrypted text message to a group', () => {
      const username = process.env.TEST_ORION_USERNAME;
      const password = process.env.TEST_ORION_PASSWORD;
      const groups = process.env.TEST_ORION_GROUPS;

      return OrionClient.auth(username, password).then((resolve) => {
        expect(resolve).toBeInstanceOf(Object);
        expect(resolve).toBeDefined();

        const token = resolve.token;

        expect(token).toBeDefined();

        let message = 'Hello from a unit test!';

        let streamKey;
        if (OrionCrypto) {
          streamKey = OrionCrypto.utils.generateStreamKey();
          message = OrionCrypto.encryptText(streamKey, message);
        }

        return OrionClient.sendTextMessage(token, message, groups, streamKey).then((response) => {
          console.log(response);
          expect(response).toBeDefined();
        });
      });
    });
  }
});
