/**
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
 **/

'use strict';

const axios = require('axios');
const Swagger = require('swagger-client');
const WebSocket = require('ws');

const utils = require('./utils');
exports.utils = utils;

/**
 * Authenticates against the Orion Platform, and retrieves an Authentication
 * Token. Every token has a pre-determined TTL and is associated with a
 * sessionId, which can be used to logout using the logout() call.
 * @param username {string} Username for Orion.
 * @param password {string} Password for Orion.
 * @returns {Promise<unknown>} Resolves to {id: str, token: str}
 */
const auth = (username, password) => {
  return new Promise((resolve, reject) => {
    Swagger('https://api.orionlabs.io/api/swagger.json')
      .then((client) => {
        const authParams = { uid: username, password: password };
        client.apis.auth
          .login({ body: authParams })
          .then((response) => resolve(response.body))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};
exports.auth = auth;
exports.login = auth;

/**
 * Logout of a given Orion Session.
 * Orion issues authentication Tokens of a specific TTL upon successful
 * login. To invalidate these tokens a user can call the logout endpoint.
 * @param sessionId {string} ID of the Orion Session to logout from.
 * @returns {Promise<unknown>} Resolves or Rejects successful logout.
 */
const logout = (sessionId) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `https://api.orionlabs.io/api/logout/${sessionId}`,
      method: 'POST',
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        const errorMsg = `status=${response.status} ` + `statusText=${response.statusText}`;
        reject(new Error(errorMsg));
      }
    });
  });
};
exports.logout = logout;

/**
 * Gets the current Orion User's Profile information.
 * @param token {string} Orion Auth Token.
 * @returns {Promise<object>} Resolves to the User's Profile as an Object.
 */
const whoami = (token) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: 'https://api.orionlabs.io/api/whoami',
      headers: { Authorization: token },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        const errorMsg = `status=${response.status} ` + `statusText=${response.statusText}`;
        reject(new Error(errorMsg));
      }
    });
  });
};
exports.whoami = whoami;

const updateUserStatus = (token, userstatus) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PATCH',
      url: `https://api.orionlabs.io/api/users/${userstatus.id}/status`,
      headers: { Authorization: token },
      data: userstatus,
    }).then((response) => {
      if (response.status === 204) {
        resolve(response.data);
      } else {
        const errorMsg = `status=${response.status} ` + `statusText=${response.statusText}`;
        reject(new Error(errorMsg));
      }
    });
  });
};
exports.updateUserStatus = updateUserStatus;

const engage = (token, groups, verbosity = 'active') => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'https://api.orionlabs.io/api/engage',
      headers: { Authorization: token },
      data: {
        seqnum: Date.now(),
        groupIds: groups,
        destinations: [{ destination: 'EventStream', verbosity: verbosity }],
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
exports.engage = engage;

const getAllUserGroups = (token) => {
  return whoami(token).then((resolve) => {
    const userId = resolve.id;
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `https://api.orionlabs.io/api/users/${userId}`,
        headers: { Authorization: token },
      }).then((response) => {
        if (response.status === 200) {
          resolve(response.data.groups);
        } else {
          reject(response);
        }
      });
    });
  });
};
exports.getAllUserGroups = getAllUserGroups;

const connectToWebsocket = (token) => {
  const wsURL = 'wss://alnilam.orionlabs.io/stream/wss';

  if (connectToWebsocket.server && connectToWebsocket.server.readyState < 2) {
    console.debug(
      `Re-using the socket connection [state=${connectToWebsocket.server.readyState}]: ` +
        `${connectToWebsocket.server.url}`,
    );
    return Promise.resolve(connectToWebsocket.server);
  }

  const wsOptions = { headers: { Authorization: token } };

  return new Promise((resolve, reject) => {
    connectToWebsocket.server = new WebSocket(wsURL, wsOptions);

    connectToWebsocket.server.onopen = () => {
      console.debug('Socket Connected');
      resolve(connectToWebsocket.server);
    };

    connectToWebsocket.server.onerror = (error) => {
      console.error(`Socket Error=${error}`);
      reject(error);
    };
  });
};
exports.connectToWebsocket = connectToWebsocket;

const pong = (token) => {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://api.orionlabs.io/api/pong',
      method: 'POST',
      headers: { Authorization: token },
    }).then(({ status, data }) => {
      if (status === 200) {
        resolve(data);
      } else {
        reject(new Error('error'));
      }
    });
  });
};
exports.pong = pong;

const getUserStatus = (token, userId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://api.orionlabs.io/api/users/${userId}/status`,
      headers: { Authorization: token },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
};
exports.getUserStatus = getUserStatus;

const getUser = (token, userId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://api.orionlabs.io/api/users/${userId}`,
      headers: { Authorization: token },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
};
exports.getUser = getUser;

const getGroup = (token, groupId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://api.orionlabs.io/api/groups/${groupId}`,
      headers: { Authorization: token },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
};
exports.getGroup = getGroup;
