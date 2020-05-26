/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

const axios = require('axios');
const Swagger = require('swagger-client');

const OrionClient = require('./../src/main');

jest.mock('axios');
jest.mock('swagger-client');

describe('login', () => {
  afterEach(() => jest.resetAllMocks());

  it('Should fail because of Network Error', () => {
    const errorMessage = 'Network Error';

    Swagger.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    return OrionClient.auth('x', 'y').catch((error) => {
      expect(error).toBeInstanceOf(Object);
      expect(error.toString()).toContain(errorMessage);
    });
  });
});

describe('logout', () => {
  afterEach(() => jest.resetAllMocks());

  it('Should succeed', () => {
    const mockStatus = 200;
    const mockData = {};
    const mockSessionId = '123';

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    return OrionClient.logout('xxx', mockSessionId).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve).toEqual(mockData);
    });
  });

  it('Should fail', () => {
    const mockStatus = 400;
    const mockSessionId = '123';

    axios.mockRejectedValue({ status: mockStatus });

    return OrionClient.logout('zzz', mockSessionId).catch((reason) => {
      console.log('reason=', reason);
      expect(reason).toBeDefined();
    });
  });
});

describe('whoami', () => {
  afterEach(() => jest.resetAllMocks());

  it('Should fail', () => {
    const mockStatus = 400;
    axios.mockRejectedValue({ status: mockStatus });
    return OrionClient.whoami().catch((reason) => {
      expect(reason).toBeDefined();
    });
  });

  it("Gets an Orion User's Profile information", () => {
    const mockStatus = 200;
    const mockData = {
      uid: 'sara@example.com',
      phones: [
        {
          body: '4145551212',
          verified: false,
          id: '432',
        },
      ],
      id: '123',
      is_organization_manager: false,
      system_flags: ['fw_testing', 'fw_unstable', 'staff'],
      organization_name: 'Orion Labs',
      haptic_setting: 'off',
      transmitterInfoSetting: 'on',
      led_setting: 'on',
      requireLocationSetting: 'off',
      ptt_mode: 'default',
      organization_id: '987',
      assimilationPending: false,
      latest_location_services_disabled: false,
      emails: [
        {
          body: 'sara@example.com',
          verified: true,
          id: '567',
        },
      ],
      created_ts: 0,
      name: 'Sara Example',
      language: 'en',
      is_organization_owner: false,
      avatars: {
        x60: 'https://example.com/avatar_x60.png',
        x100: 'https://example.com/avatar_x100.png',
        x104: 'https://example.com/avatar_x104.png',
        x120: 'https://example.com/avatar_x120.png',
        x200: 'https://example.com/avatar_x200.png',
      },
      rxTone: 'on',
      location_setting: 'on',
      initials: 'se',
      eula_agreement: true,
      eula_agreement_date: '2019-12-17 18:05:02.982766',
      is_contact: true,
    };
    const mockToken = '123';

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    return OrionClient.whoami(mockToken).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve).toEqual(mockData);
    });
  });
});

describe('updateUserStatus', () => {
  it('Updates a User Status', () => {
    const mockStatus = 204;
    const mockData = {
      id: '123',
      lat: 1.2,
      lng: 2.1,
    };
    const mockToken = '123';

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    return OrionClient.updateUserStatus(mockToken, mockData).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve).toEqual(mockData);
    });
  });
});

describe('engage', () => {
  it('engages with a group and returns a configuration', () => {
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

    return OrionClient.engage('123', ['1']).then((response) => {
      expect(response).toBeDefined();
      expect(response).toEqual(data.data);
    });
  });
});
