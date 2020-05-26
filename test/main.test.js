/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

const rewire = require('rewire');

const OrionClient = require('./../src/main');
const OrionClientRewire = rewire('../src/main.js');

describe('callOrion', () => {
  it('Should fail', () => {
    const callOrion = OrionClientRewire.__get__('callOrion');

    return callOrion('123', 'http://mock.url').catch((reason) => {
      expect(reason).toBeDefined();
    });
  });
});

describe('getMediaBase', () => {
  const getMediaBase = OrionClientRewire.__get__('getMediaBase');

  it('Should get the Bedia Base', () => {
    return getMediaBase().then((res) => {
      expect(res).toBeDefined();
      expect(res).toContain('http');
    });
  });
});

describe('uploadMedia', () => {
  it('Should upload a media file', () => {
    const mediaFile = 'test/test.ov';
    return OrionClient.uploadMedia(mediaFile).then((response) => {
      expect(response).toBeDefined();
      expect(response).toContain('http');
    });
  });
  it('Should fail', () => {
    return OrionClient.uploadMedia('xxx').catch((res) => {
      expect(res).toBeDefined();
    });
  });
});
