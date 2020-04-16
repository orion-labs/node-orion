'use strict';

const OrionClient = require('@orionlabs/node-orion');

describe('auth', () => {
  it('Lookup user & Group info', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;

    OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();
    });
  });
});

describe('lookup', () => {
  it('Lookup user & Group info', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;
    const groups = process.env.TEST_ORION_GROUPS;

    OrionClient.auth(username, password).then((resolve) => {
      const token = resolve.token;
      const msg = { group: groups[0] };

      OrionClient.lookup(token, msg).then((resolve) => {
        expect(resolve).toBeDefined();
        console.log(resolve);
      });
    });
  });
});
