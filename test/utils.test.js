'use strict';

const fs = require('fs');

const OrionClient = require('./../src/main');

describe('wav2ov', () => {
  it('Should encode WAV/PCM Audio to Orion Opus Audio (OV)', () => {
    const inputFile = fs.readFileSync('test/test.wav');
    const event = { payload: inputFile };

    return OrionClient.utils.wav2ov(event).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve.media).toBeDefined();
      expect(resolve.payload.type).toEqual('Buffer');
    });
  });
});
