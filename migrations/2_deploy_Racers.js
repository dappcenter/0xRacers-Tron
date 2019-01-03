const Car = artifacts.require("./Car/RacersCar.sol");
const RacersBoxFactory = artifacts.require("./LootBoxFactory/RacersBoxFactory.sol");
const CarSaleAuction = artifacts.require("./CarSaleAuction/CarSaleAuction.sol");
const TournamentAI = artifacts.require("./TournamentAI/TournamentAI.sol");

require('dotenv').config();
const delay = require('delay');

const paused = parseInt( process.env.DELAY_MS || "1" );

const wait = async (param) => { console.log("Delay " + paused); await delay(paused); return param;};
const logReceipt = (receipt, name) => console.log(name + " :: success :: " + receipt.tx);

module.exports = function(deployer) {
  deployer.then(async () => {
    await wait();

    await wait(await deployer.deploy(Car));

    let car = await Car.deployed();
    await wait(logReceipt(await car.init(),
      'car.initialize'));

    await wait(await deployer.deploy(RacersBoxFactory));

    let racersBoxFactory = await RacersBoxFactory.deployed();
    await wait(logReceipt(await racersBoxFactory.initialize( Car.address ),
      'racersBoxFactory.initialize'));

    // clean up current discovery from everywhere
    await wait(logReceipt(await racersBoxFactory.setCarContract(car.address),
      "racersBoxFactory setCarContract car address " + car.address));


    const treasurerCommission = 500; // 5%

    await wait(await deployer.deploy(CarSaleAuction));

    let saleAuction = await CarSaleAuction.deployed();
    await wait(logReceipt(await saleAuction.init( car.address, treasurerCommission),
      'saleAuction.initialize'));


    await wait(await deployer.deploy(TournamentAI));

    let tournamentAI = await TournamentAI.deployed();
    await wait(logReceipt(await tournamentAI.init(),
        'tournamentAI.initialize'));
  });
};