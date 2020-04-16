'use strict';

const axios = require('axios');
const OrionClient = require('./../src/main');

jest.mock('axios');

describe('logout', () => {
  it('Logs a User out of Orion', () => {
    const mockStatus = 200;
    const mockData = {};
    const mockSessionId = '123';

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    OrionClient.logout(mockSessionId).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve).toEqual(mockData);
    });
  });
});

describe('whoami', () => {
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

    OrionClient.whoami(mockToken).then((resolve) => {
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

    OrionClient.updateUserStatus(mockToken, mockData).then((resolve) => {
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

    OrionClient.engage('123', ['1']).then((response) => {
      expect(response).toBeDefined();
      expect(response).toEqual(data.data);
    });
  });
});
