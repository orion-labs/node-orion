'use strict';

const OrionClient = require('./../src/main');

describe('Orion Auth', () => {
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

describe('Orion TX with Lyre', () => {
  it('Transmit to an Orion Group', () => {
    const username = process.env.TEST_ORION_USERNAME;
    const password = process.env.TEST_ORION_PASSWORD;
    const groups = process.env.TEST_ORION_GROUPS;

    OrionClient.auth(username, password).then((resolve) => {
      expect(resolve).toBeDefined();

      const token = resolve.token;
      const userId = resolve.id;

      expect(token).toBeDefined();
      expect(userId).toBeDefined();

      const lyreParams = { token: token, groups: groups, message: 'Unit Test' };
      OrionClient.utils.lyre(lyreParams).then((resolve) => {
        expect(resolve).toBeDefined();
        expect(resolve).toEqual('OK');
      });
    });
  });
});
