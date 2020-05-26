/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

const axios = require('axios');
const fs = require('fs');
const OrionClient = require('./../src/main');

jest.mock('axios');

describe('putMedia', () => {
  it('Should fail with formatted error', () => {
    const mockUrl = 'http://mock.url';
    const mockStatus = 400;
    const mockData = { id: 400, status: 'bad' };

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    return OrionClient.utils.putMedia(mockUrl, mockData).catch((error) => {
      expect(error).toBeInstanceOf(Object);
      expect(error.id).toEqual(mockStatus);
    });
  });

  it('Should fail because of Network Error', () => {
    const mockUrl = 'http://mock.url';
    const errorMessage = 'Network Error';
    const mockData = {};

    axios.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    return OrionClient.utils.putMedia(mockUrl, mockData).catch((error) => {
      expect(error).toBeInstanceOf(Object);
      expect(error.toString()).toContain(errorMessage);
    });
  });
});

describe('getMedia', () => {
  it('Should fail with non-200 Status', () => {
    const mockUrl = 'http://mock.url';
    const mockStatus = 400;
    const mockData = { id: 400, status: 'bad' };

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    return OrionClient.utils.getMedia(mockUrl).catch((error) => {
      expect(error).toBeInstanceOf(Object);
    });
  });

  it('Should fail because of Network Error', () => {
    const mockUrl = 'http://mock.url';
    const errorMessage = 'Network Error';

    axios.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    return OrionClient.utils.getMedia(mockUrl).catch((error) => {
      expect(error).toBeInstanceOf(Object);
      expect(error.toString()).toContain(errorMessage);
    });
  });
});

describe('wav2ov', () => {
  it('Should fail with non-200 Status', () => {
    const inputFile = fs.readFileSync('test/test.wav');
    const event = { payload: inputFile };
    const mockStatus = 400;
    const mockData = { id: 400, status: 'bad' };

    axios.mockResolvedValue({ status: mockStatus, data: mockData });

    return OrionClient.utils.wav2ov(event).catch((error) => {
      expect(error).toBeDefined();
    });
  });

  it('Should fail because of Network Error', () => {
    const inputFile = fs.readFileSync('test/test.wav');
    const event = { payload: inputFile };
    const errorMessage = 'Network Error';

    axios.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    return OrionClient.utils.wav2ov(event).catch((error) => {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Object);
      expect(error.toString()).toContain(errorMessage);
    });
  });
});
