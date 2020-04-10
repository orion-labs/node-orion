// 'use strict';

const axios = require('axios');
const OrionClient = require('./../main.js');

jest.mock('axios');

describe('engageWithToken', () => {
  it('engages with a group, us a token, and returns a configuration', () => {
    // expect.assertions(1);

    const data = {
      status: 200,
      data: {
        configuration: {
          mediabase: 'https://alnitak.orionlabs.io:443/',
          archival_host: 'https://icarus.orionlabs.io/v1/graphql/',
        },
        missedPTTs: [],
        streamURL: 'https://api.orionlabs.io/api/ptt/123',
        userStatuses: [
          {
            id: '456',
            presence: 'offline',
            muted: true,
            groups: ['123'],
            location: {},
            indoor_location: {},
            sensor_data: {},
            event_type: 'userstatus',
          },
        ],
        welcomes: [],
      },
    };

    axios.mockResolvedValue(data);

    OrionClient.engageWithToken('123', ['1']).then((response) => {
      expect(response).toBeDefined();
      expect(response).toEqual(data.data);
    });
  });
});

describe('engage', () => {
  it('engages with a group, us a token, and returns a configuration', () => {
    // expect.assertions(1);

    const data = {
      status: 200,
      data: {
        configuration: {
          mediabase: 'https://alnitak.orionlabs.io:443/',
          archival_host: 'https://icarus.orionlabs.io/v1/graphql/',
        },
        missedPTTs: [],
        streamURL: 'https://api.orionlabs.io/api/ptt/123',
        userStatuses: [
          {
            id: '456',
            presence: 'offline',
            muted: true,
            groups: ['123'],
            location: {},
            indoor_location: {},
            sensor_data: {},
            event_type: 'userstatus',
          },
        ],
        welcomes: [],
      },
    };

    axios.mockResolvedValue(data);

    OrionClient.engageWithToken('123', ['1']).then((response) => {
      expect(response).toBeDefined();
      expect(response).toEqual(data.data);
    });
  });
});
