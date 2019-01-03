require('dotenv').config();

module.exports = {
  networks: {
    test: {
      privateKey: '1e99867131ebeeb05f2205a16ecc5d36df22f0bbbc287486f83991e76eaf7b7e',
      consume_user_resource_percent: 30,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*" // Match any network id
    },
    development: {
      // For trontools/quickstart docker image
      privateKey: '72e5ceca0e03b9ce170300b562fdd3e1680a9c76422914a083384397fdcf0a4e',
      consume_user_resource_percent: 30,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullHost: "http://127.0.0.1:9090",
      network_id: "*"
    },
    production: {}
  }
};