/**
 * Orion-Node Utilities for working with Orion streams & media.
 *
 * Copyright Orion Labs, Inc. https://www.orionlabs.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @module @orionlabs/node-orion/utils
 * @see @orionlabs/node-orion
 **/

'use strict';

const axios = require('axios');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

/**
 * Transmits to an Orion Group.
 * @param token {String} Orion Auth Token.
 * @param groups {Array} List of Orion Groups to transmit to.
 * @param message {String} Optional. Message to speak (using TTS).
 * @param media {String} Optional. URL to Orion Audio file to transmit.
 * @param target {String} Optional. Direct message/target specified user id.
 * @returns {Promise<Object>}
 */
exports.lyre = (token, groups, message = '', media = '', target = '') => {
  const url = process.env.LYRE_URL || 'https://lyre.api.orionaster.com/lyre';
  return new Promise((resolve, reject) => {
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
    }).then(({ status, data }) => {
      if (status === 200) {
        resolve(data);
      } else {
        reject(new Error('error'));
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
  return new Promise((resolve) => {
    const url = process.env.LOCRIS_OV2WAV || 'https://locris.api.orionaster.com/ov2wav';

    let xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        if (event.return_type === 'buffer') {
          response.payload = Buffer.from(response.payload);
        }
        resolve(response);
      }
    };

    xhr.send(JSON.stringify(event));
  });
};

/**
 * Transcribes Orion Audio Events to text.
 * @param event {Object} Orion Audio Event to transcribe.
 * @returns {Promise<Object>} Transformed event containing transcription.
 */
exports.stt = (event) => {
  return new Promise((resolve) => {
    const url = process.env.LOCRIS_STT || 'https://locris.api.orionaster.com/stt';

    let xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);

        if (event.return_type === 'buffer') {
          response.payload = Buffer.from(response.payload);
        }
        resolve(response);
      }
    };

    xhr.send(JSON.stringify(event));
  });
};

/**
 * Translates Orion Opus Audio from one language to another.
 * @param event {Object} Orion Audio Event to translate.
 * @returns {Promise<Object>} Original object transformed to include
 *                            translation.
 */
exports.translate = (event) => {
  return new Promise((resolve) => {
    const LOCRIS_TRANSLATE = 'https://locris.api.orionaster.com/translate';
    const locrisTranslateURL = process.env.LOCRIS_TRANSLATE || LOCRIS_TRANSLATE;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', locrisTranslateURL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        if (event.return_type === 'buffer') {
          response.payload = Buffer.from(response.payload);
        }
        resolve(response);
      }
    };

    xhr.send(JSON.stringify(event));
  });
};

/**
 * Encodes WAV file as Orion Opus file and uploads to S3.
 * @param event {Object} Node-RED message object containing audio to encode.
 * @returns {Promise<Object>} Resolves original object + media URL to ov file.
 */
exports.wav2ov = (event) => {
  return new Promise((resolve) => {
    const LOCRIS_WAV2OV = 'https://locris.api.orionaster.com/wav2ov';
    const locrisWAV2OVURL = process.env.LOCRIS_WAV2OV || LOCRIS_WAV2OV;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', locrisWAV2OVURL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      }
    };

    xhr.send(JSON.stringify(event));
  });
};
