'use strict';

const OrionClient = require('./../src/main');

describe('auth', () => {
  it('Login to Orion and retrieve a Token & User ID', () => {
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
});

describe('whoami', () => {
  it('Retrieve my Orion User Profile', () => {
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
  it('Update my User Status', () => {
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
  it('Engage with an Orion Group', () => {
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
