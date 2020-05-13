/**
 * Orion Node.js Module Tests.
 *
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

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

describe('ov2wav', () => {
  it('Should decode Orion Opus Audio (OV) to WAV/PCM Audio URL', () => {
    const event = {
      media: 'https://alnitak-rx.orionlabs.io/b9577f6f-668f-423b-bb9a-11d1ace77f42.ov',
      ts: 1587406431.588,
      id: '81a84c52ff91497aa6182d09e66d50f8',
      sender: '2a6d61f9023342c8855423ba36128a19',
      event_type: 'ptt',
      sender_token_hash: '388b20153a4c47b386120fc3e05c88bc',
      ptt_seqnum: '1587406432.056607',
      sender_name: 'G2347',
      ptt_id: 'fc6c96a1e09e4aeda45cc6e5babac1fe',
      eventId: 'fc6c96a1e09e4aeda45cc6e5babac1fe',
    };

    return OrionClient.utils.ov2wav(event).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve.media).toBeDefined();
      expect(resolve.media_wav).toBeDefined();
    });
  });

  it('Should decode Orion Opus Audio (OV) to WAV/PCM Audio Buffer', () => {
    const event = {
      media: 'https://alnitak-rx.orionlabs.io/b9577f6f-668f-423b-bb9a-11d1ace77f42.ov',
      ts: 1587406431.588,
      id: '81a84c52ff91497aa6182d09e66d50f8',
      sender: '2a6d61f9023342c8855423ba36128a19',
      event_type: 'ptt',
      sender_token_hash: '388b20153a4c47b386120fc3e05c88bc',
      ptt_seqnum: '1587406432.056607',
      sender_name: 'G2347',
      ptt_id: 'fc6c96a1e09e4aeda45cc6e5babac1fe',
      eventId: 'fc6c96a1e09e4aeda45cc6e5babac1fe',
      return_type: 'buffer',
    };

    return OrionClient.utils.ov2wav(event).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve.media).toBeDefined();
      expect(resolve.payload).toBeDefined();
      expect(resolve.payload).toBeInstanceOf(Buffer);
    });
  });
});

describe('downloadMedia', () => {
  it('Should download media', () => {
    const url = 'https://orion-agro.herokuapp.com/sine.ov?frequency=2600&seconds=1';
    return OrionClient.utils.downloadMedia(url).then((result) => {
      console.log(result);
    });
  });
});
/*
Need media to be generated:
describe('translate', () => {
  it('Should translate English to Spanish URL', () => {
    const event = {
      media: 'https://alnitak-rx.orionlabs.io/b9577f6f-668f-423b-bb9a-11d1ace77f42.ov',
      ts: 1587406431.588,
      id: '81a84c52ff91497aa6182d09e66d50f8',
      sender: '2a6d61f9023342c8855423ba36128a19',
      event_type: 'ptt',
      sender_token_hash: '388b20153a4c47b386120fc3e05c88bc',
      ptt_seqnum: '1587406432.056607',
      sender_name: 'G2347',
      ptt_id: 'fc6c96a1e09e4aeda45cc6e5babac1fe',
      eventId: 'fc6c96a1e09e4aeda45cc6e5babac1fe',
      input_lang: 'en-US',
      output_lang: 'es-MX',
    };

    return OrionClient.utils.translate(event).then((resolve) => {
      expect(resolve).toBeDefined();
      expect(resolve.translation).toBeDefined();
      expect(resolve.translation.translated_media).toBeDefined();
      expect(resolve.translation.translated_text).toBeDefined();
    });
  });
});
*/
