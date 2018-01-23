var DefaultBuilder = require('truffle-default-builder');

module.exports = {
  build: new DefaultBuilder({}),
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 5000000
    },
    ropsten: {
      host: 'localhost',
      port: 8545,
      network_id: '3',
      gas: 5000000
    },
    rinkeby: {
      host: 'localhost',
      port: 8545,
      network_id: '4',
      gas: 5000000
    }
  }
};
