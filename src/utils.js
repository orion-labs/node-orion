/**
 * Orion-Node Utilities for working with Orion streams & media.
 *
 * @module @orionlabs/node-orion/utils
 * @see @orionlabs/node-orion
 * @author Greg Albrecht <gba@orionlabs.io>
 * @copyright Orion Labs, Inc. https://www.orionlabs.io
 * @license Apache-2.0
 **/

'use strict';

const axios = require('axios');
const fs = require('fs');
const tmp = require('tmp');

tmp.setGracefulCleanup();

/**
 * Transmits to an Orion Group.
 * @param token {String} Orion Auth Token
 * @param groups {Array} List of Orion Groups to transmit to
 * @param message {String} Optional. Message to speak (using TTS)
 * @param media {String} Optional. URL to Orion Audio file to transmit
 * @param target {String} Optional. Direct message/target specified User Id
 * @returns {Promise<Object>}
 */
exports.lyre = (token, groups, message = '', media = '', target = '') => {
  return new Promise((resolve, reject) => {
    const url = process.env.LYRE_URL || 'https://lyre.api.orionaster.com/lyre';

    axios({
      method: 'POST',
      url: url,
      data: {
        token: token,
        group_ids: groups,
        message: message || null,
        media: media || null,
        target: target,
      },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};

/**
 * Decodes Orion Opus Audio to WAV.
 * @param event {Object} Orion Audio Event to decode.
 * @returns {Promise<Object>} Transformed event containing wav file.
 */
exports.ov2wav = (event) => {
  return new Promise((resolve, reject) => {
    const url = process.env.LOCRIS_OV2WAV || 'https://locris.api.orionaster.com/ov2wav';

    axios({
      method: 'POST',
      url: url,
      data: event,
    }).then((response) => {
      if (response.status === 200) {
        if (event.return_type === 'buffer') {
          response.data.payload = Buffer.from(response.data.payload);
        }
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};

/**
 * Transcribes Orion Audio Events to text.
 * @param event {Object} Orion Audio Event to transcribe.
 * @returns {Promise<Object>} Transformed event containing transcription.
 */
exports.stt = (event) => {
  return new Promise((resolve, reject) => {
    const url = process.env.LOCRIS_STT || 'https://locris.api.orionaster.com/stt';

    axios({
      method: 'POST',
      url: url,
      data: event,
    }).then((response) => {
      if (response.status === 200) {
        if (event.return_type === 'buffer') {
          response.data.payload = Buffer.from(response.data.payload);
        }
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};

/**
 * Translates Orion Opus Audio from one language to another.
 * @param event {Object} Orion Audio Event to translate.
 * @returns {Promise<Object>} Original object transformed to include
 *                            translation.
 */
exports.translate = (event) => {
  return new Promise((resolve, reject) => {
    const url = process.env.LOCRIS_TRANSLATE || 'https://locris.api.orionaster.com/translate';

    axios({
      method: 'POST',
      url: url,
      data: event,
    }).then((response) => {
      if (response.status === 200) {
        if (event.return_type === 'buffer') {
          response.data.payload = Buffer.from(response.data.payload);
        }
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};

/**
 * Encodes WAV file as Orion Opus file and uploads to S3.
 * @param event {Object} Node-RED message object containing audio to encode.
 * @returns {Promise<Object>} Resolves original object + media URL to ov file.
 */
exports.wav2ov = (event) => {
  return new Promise((resolve, reject) => {
    const url = process.env.LOCRIS_WAV2OV || 'https://locris.api.orionaster.com/wav2ov';

    axios({
      method: 'POST',
      url: url,
      data: event,
    }).then((response) => {
      if (response.status === 200) {
        if (event.return_type === 'buffer') {
          response.data.payload = Buffer.from(response.data.payload);
        }
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};

const downloadMedia = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    }).then((response) => {
      if (response.status == 200) {
        const tmpobj = tmp.fileSync();
        const writer = fs.createWriteStream(tmpobj.name);
        response.data.pipe(writer);

        writer.on('finish', () => {
          resolve(tmpobj.name);
        });
        writer.on('error', () => {
          reject(response);
        });
      } else {
        reject(response);
      }
    });
  });
};
exports.downloadMedia = downloadMedia;
