'use strict';

const axios = require('axios');
const Swagger = require('swagger-client');
const WebSocket = require('ws');

// Login to Orion and retrieve a Auth Token, then call callback:
/**
 * auth Authenticate against the Orion Platform.
 * @param username {str} Username for Orion.
 * @param password {str} Password for Orion.
 * @returns {Promise<unknown>} Resolves to {id: str, token: str}
 */
const auth = (username, password) => {
  return new Promise((resolve, reject) => {
    Swagger('https://api.orionlabs.io/api/swagger.json')
      .then((client) => {
        const authParams = { uid: username, password: password };
        client.apis.auth
          .login({ body: authParams })
          .then((res) => resolve(res.body))
          .catch((x) => reject(x));
      })
      .catch((x) => reject(x));
  });
};

const updateUserStatus = (username, password, userstatus) => {
  return auth(username, password).then((resolve, reject) => {
    const uid = resolve.id;
    const token = resolve.token;
    return new Promise((resolve, reject) => {
      axios({
        method: 'PATCH',
        url: `https://api.orionlabs.io/api/users/${uid}/status`,
        headers: { Authorization: token },
        data: userstatus,
      }).then((response) => {
        if (response.status == 204) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  });
};

/*
'Engage' with the Orion Event Stream.
Ensures user Presence for asyncronous stream connections (APN).
*/
const engage = (username, password, groups, verbosity = 'active') => {
  return auth(username, password).then((resolve, reject) => {
    const token = resolve.token;
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: 'https://api.orionlabs.io/api/engage',
        headers: { Authorization: token },
        data: {
          seqnum: Date.now(),
          groupIds: groups,
          destinations: [{ destination: 'EventStream', verbosity: verbosity }]
        },
      }).then((response) => {
        if (response.status == 200) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  });
};

const getAllUserGroups = (username, password) => {
  return auth(username, password).then((resolve, reject) => {
    const token = resolve.token;
    const uid = resolve.id;
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `https://api.orionlabs.io/api/users/${uid}`,
        headers: { Authorization: token },
      }).then((response) => {
        if (response.status == 200) {
          resolve(response.data.groups);
        } else {
          reject(response);
        }
      });
    });
  });
};

const connectToWebsocket = (username, password) => {

  const wsURL = 'wss://alnilam.orionlabs.io/stream/wss';
  return auth(username, password).then((resolve, reject) => {
    if (connectToWebsocket.server && connectToWebsocket.server.readyState < 2) {
      console.log("reusing the socket connection [state = " + connectToWebsocket.server.readyState + "]: " + connectToWebsocket.server.url);
      return Promise.resolve(connectToWebsocket.server);
    }

    const wsOptions = { headers: { Authorization: resolve.token } };

    return new Promise((resolve, reject) => {
      connectToWebsocket.server = new WebSocket(wsURL, wsOptions);
      connectToWebsocket.server.onopen = () => {
        console.log('Socket Connected');
        resolve(connectToWebsocket.server);
      }
      connectToWebsocket.server.onerror = (error) => {
        console.log(`Socket Error=${error}`);
        reject(error);
      }
    });
  });
};

/*
'Engage' with the Orion Event Stream.
Ensures user Presence for asyncronous stream connections (APN).
*/
const engageWithToken = (token, groups, verbosity = 'active') => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'https://api.orionlabs.io/api/engage',
      headers: { Authorization: token },
      data: {
        seqnum: Date.now(),
        groupIds: groups,
        destinations: [{ destination: 'EventStream', verbosity: verbosity }]
      },
    }).then(({ status, data }) => {
      console.log(`status=${status}`);
      console.log(data);
      if (status === 200) {
        resolve(data);
      } else {
        reject(new Error('error'));
      }
    });
  });
};

const connectToWebsocketWithToken = (token) => {
  const wsURL = 'wss://alnilam.orionlabs.io/stream/wss';

  if (connectToWebsocket.server && connectToWebsocket.server.readyState < 2) {
    console.log("reusing the socket connection [state = " + connectToWebsocket.server.readyState + "]: " + connectToWebsocket.server.url);
    return Promise.resolve(connectToWebsocket.server);
  }

  const wsOptions = { headers: { Authorization: token } };

  return new Promise((resolve, reject) => {
    connectToWebsocket.server = new WebSocket(wsURL, wsOptions);
    connectToWebsocket.server.onopen = () => {
      console.log('Socket Connected');
      resolve(connectToWebsocket.server);
    }
    connectToWebsocket.server.onerror = (error) => {
      console.log(`Socket Error=${error}`);
      reject(error);
    }
  });

};

module.exports = { auth, updateUserStatus, engage, getAllUserGroups,
  connectToWebsocket, engageWithToken, connectToWebsocketWithToken  };
