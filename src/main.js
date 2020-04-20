/**
 * Orion Node.js Module. Functions for connecting to the Orion Platform.
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
 * @module @orionlabs/node-orion
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
 * @param username {string} Username for Orion
 * @param password {string} Password for Orion
 * @returns {Promise<Object>} Resolves to {id: str, token: str}
 */
const auth = (username, password) => {
  return new Promise((resolve, reject) => {
    Swagger('https://api.orionlabs.io/api/swagger.json')
      .then((client) => {
        const authParams = { uid: username, password: password };
        client.apis.auth
          .login({ body: authParams })
          .then((response) => resolve(response.body))
          .catch((response) => {
            reject(response.response.body);
          });
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
 * @param sessionId {string} ID of the Orion Session to logout from
 * @returns {Promise<Object>} Resolves or Rejects successful logout
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
 * @param token {String} Orion Auth Token
 * @returns {Promise<Object>} Resolves to the User's Profile as an Object
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

/**
 * Updates a User's Status.
 * @param token {String} Authentication Token
 * @param userstatus {Object} User Status Object to update with
 * @returns {Promise<Object>} Updated User Status
 */
const updateUserStatus = (token, userstatus) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PATCH',
      url: `https://api.orionlabs.io/api/users/${userstatus.id}/status`,
      headers: { Authorization: token },
      data: userstatus,
    })
      .then((response) => {
        if (response.status === 204) {
          resolve(response.data);
        } else {
          const errorMsg = `status=${response.status} ` + `statusText=${response.statusText}`;
          reject(new Error(errorMsg));
        }
      })
      .catch((reason) => {
        reject(reason);
      });
  });
};
exports.updateUserStatus = updateUserStatus;

/**
 * Engages ("subscribes") to Orion Group Event Streams.
 * @param token {String} Orion Authentication Token
 * @param groups {String|Array} List of groups to engage with.
 * @param verbosity {String} Stream verbosity level.
 * @returns {Promise<Object>} Group(s) Configuration.
 */
const engage = (token, groups, verbosity = 'active') => {
  if (typeof groups === 'string') {
    groups = groups.split(',');
  }

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
    })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(new Error(response));
        }
      })
      .catch((response) => {
        reject(response.response.data);
      });
  });
};
exports.engage = engage;

/**
 * Gets all Groups for the current user (as determined by the token).
 * @param token {String} Orion Authentication Token.
 * @returns {Promise<Object>} User's Groups
 */
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

/**
 * Connects to the Orion Event Stream Websocket
 * @param token {String} Orion Authentication Token
 * @returns {Promise<ws>} Websocket session
 */
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
      resolve(connectToWebsocket.server);
    };

    connectToWebsocket.server.onerror = (error) => {
      console.error(`Socket Error=${error}`);
      reject(error);
    };
  });
};
exports.connectToWebsocket = connectToWebsocket;

/**
 * Respond to an Orion Event Stream keepalive 'Ping'
 * @param token {String} Orion Authentication Token
 * @returns {Promise<Object>} Updated Stream Configuration
 */
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

/**
 * Gets User Status for the given User Id
 * @param token {String} Orion Authentication Token
 * @param userId {String} Orion User Id
 * @returns {Promise<Object>} Orion User Profile
 */
const getUserStatus = (token, userId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://api.orionlabs.io/api/users/${userId}/status`,
      headers: { Authorization: token },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};
exports.getUserStatus = getUserStatus;

/**
 * Gets User Profile for the given User Id
 * @param token {String} Orion Authentication Token
 * @param userId {String} Orion User Id
 * @returns {Promise<Object>} User Profile
 */
const getUser = (token, userId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://api.orionlabs.io/api/users/${userId}`,
      headers: { Authorization: token },
    }).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(response);
      }
    });
  });
};
exports.getUser = getUser;

/**
 * Gets Group Profile for the given Group Id
 * @param token {String} Orion Authentication Token
 * @param groupId {String} Orion Group Id
 * @returns {Promise<Object>} Orion Group Profile
 */
const getGroup = (token, groupId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `https://api.orionlabs.io/api/groups/${groupId}`,
      headers: { Authorization: token },
    })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((response) => reject(response.response.data));
  });
};
exports.getGroup = getGroup;
