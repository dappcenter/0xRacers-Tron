require('dotenv').config();

module.exports = {
  networks: {
    test: {
      privateKey: <privateKey1>,
      consume_user_resource_percent: 30,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*" // Match any network id
    },
    development: {
      // For trontools/quickstart docker image
      privateKey: <privateKey2>,
      consume_user_resource_percent: 30,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullHost: "http://127.0.0.1:9090",
      network_id: "*"
    },
    production: {}
  }
};