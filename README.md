# @orionlabs/node-orion - Node.js Module for Orion.

[![Build Status](https://travis-ci.org/orion-labs/node-orion.svg?branch=master)](https://travis-ci.org/orion-labs/node-orion)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/orion-labs/node-orion/graphs/commit-activity)
[![HitCount](http://hits.dwyl.io/orion-labs/node-orion.svg)](http://hits.dwyl.io/orion-labs/node-orion)
[![Dependencies Status](https://img.shields.io/david/orion-labs/node-orion.svg)](https://david-dm.org/orion-labs/node-orion)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Issues](https://img.shields.io/github/issues/orion-labs/node-orion.svg?style=flat-square)](https://github.com/orion-labs/node-orion/issues)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![NPM](https://nodei.co/npm/@orionlabs/node-orion.png)](https://nodei.co/npm/@orionlabs/node-orion/)

--
## Install

To install from npm registry:

```shell script
$ yarn add @orionlabs/node-orion
# or
$ npm i @orionlabs/node-orion
```

To install from source:

```shell script
$ git clone https://github.com/orion-labs/node-orion
$ cd node-orion
$ npm install
# or
$ yarn add ./
```

## Usage

Almost all module methods return a Promise. Most require a `token`, which can be retrieved with the `auth()` method.
### Authenticate against the Orion Platform

With a given Orion `username` ("User ID") and `password`:
```js
OrionClient.auth(username, password).then((result) => {
  console.log(`userId=${result.id} token=${result.token}`);
})
```

### Authenticate against the Orion Platform

With a given Orion `username` ("User ID") and `password`:
```js
OrionClient.auth(username, password).then((result) => {
  console.log(`userId=${result.id} token=${result.token}`);
})
```

### Lookup your user profile

With a given Orion `username` ("User ID") and `password`:
```js
OrionClient.auth(username, password).then((result) => {
  OrionClient.whoami(result.token).then((result) => {
    console.log('Here is my Orion User Profile:');
    console.log(result);
  });
});
```

# Copyright

Copyrigh 2020 Orion Labs, Inc.

# License

Apache License, Version 2.0

# Author

Greg Albrecht <gba@orionlabs.io>

# Source

https://github.com/orion-labs/node-orion
