/**
 * Orion Node.js Module Tests.
 *
 * Copyright Orion Labs, Inc. https://www.orionlabs.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

'use strict';

const OrionClient = require('./../src/main');

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
      expect(error.id).toEqual(401);
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
