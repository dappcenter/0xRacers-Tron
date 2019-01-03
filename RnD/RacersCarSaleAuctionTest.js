// test/.RacersPartSaleAuctionTest.js
const RacersCar = artifacts.require("RacersCar");
const RacersCarProxy = artifacts.require("RacersCarProxy");

const RacersBoxFactory = artifacts.require("RacersBoxFactory");
const RacersBoxFactoryProxy = artifacts.require("RacersBoxFactoryProxy");

const CarSaleAuction = artifacts.require("CarSaleAuction");
const CarSaleAuctionProxy = artifacts.require("CarSaleAuctionProxy");

const STARTING_PRICE = 10000000;
const ENDING_PRICE =   1000000;
const SIMPLE_BID = 2000000;

const PRICE_BOX_TYPE_0 = 10000000;
const PRICE_BOX_TYPE_2 = 40000000;

contract('RacersCarSaleAuction', function (accounts) {
    const [firstAccount, secondAccount, thirdAccount, fourthAccount, fifthAccount, proxyAccount] = accounts;
    let racersCar;
    let racersBoxFactory;
    let auction;

    const TREASURER_COMMISSION = 500; // 5%

    beforeEach(async () => {
        racersCar = await RacersCar.new();
        const racersCarProxy  = await RacersCarProxy.new(racersCar.address, {from: proxyAccount});
        racersCar = await RacersCar.at(racersCarProxy.address);
        await racersCar.init();

        racersBoxFactory = await RacersBoxFactory.new();
        const racersBoxFactoryProxy  = await RacersBoxFactoryProxy.new(racersBoxFactory.address, {from: proxyAccount});
        racersBoxFactory = await RacersBoxFactory.at(racersBoxFactoryProxy.address);
        await racersBoxFactory.initialize(racersCarProxy.address);

        auction = await CarSaleAuction.new(racersCar.address, TREASURER_COMMISSION);
        const carSaleAuctionProxy  = await CarSaleAuctionProxy.new(auction.address, {from: proxyAccount});
        auction = await CarSaleAuction.at(carSaleAuctionProxy.address);
        await auction.init(racersCarProxy.address, TREASURER_COMMISSION);

        await racersCar.addAddressToWhitelist(racersBoxFactory.address);
        await racersCar.setCarSaleAuction(auction.address);
        await racersCar.setApprovalForAll(racersBoxFactory.address, true, {from: thirdAccount});

        await racersBoxFactory.setCarContract(racersCar.address);
        await racersBoxFactory.addAddressToWhitelist(firstAccount);

        await auction.unpause();
        });


    it('#1 should be initiated ', async () => {
        assert.equal(await racersCar.owner.call(), firstAccount);
        assert.equal(await racersCar.treasurer.call(), firstAccount);
        assert.ok(await auction.ownerCut.call(), TREASURER_COMMISSION);
        assert.equal(await auction.nonFungibleContract.call(), racersCar.address, "Sale action token should be set");
    });


    it('#2 should be  created simple auction', async () => {
        await racersBoxFactory.giftBox(0, firstAccount, {from: firstAccount});
        assert.equal(await racersCar.balanceOf(firstAccount), 3);
        assert.equal(await racersCar.totalSupply.call(), 3);
        await racersCar.createSaleAuction(1, STARTING_PRICE, ENDING_PRICE, 286400, {from: firstAccount});
    });


    it('#3 must bid on a simple auction', async () => {
        await racersBoxFactory.giftBox(1, secondAccount, {from: firstAccount});
        assert.equal(await racersCar.balanceOf(secondAccount), 3);
        assert.equal(await racersCar.totalSupply.call(), 3);
        await racersCar.createSaleAuction(1, STARTING_PRICE, ENDING_PRICE, 186400, {from: secondAccount});

        try {
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: SIMPLE_BID/4});
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: SIMPLE_BID/3});
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: SIMPLE_BID/2});
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: SIMPLE_BID});
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: 2 * SIMPLE_BID});
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: 3 * SIMPLE_BID});
            await auction.bid.sendTransaction(1, {from: fourthAccount, value: 4 * SIMPLE_BID});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await auction.bid.sendTransaction(1, {from: fourthAccount, value: 5 * SIMPLE_BID});

    });


    it("#4 should close to simple auction", async () => {
        await racersBoxFactory.giftBox(2, firstAccount);
        await racersCar.createSaleAuction(1, STARTING_PRICE, ENDING_PRICE, 186400);

        try {
            await auction.cancelAuction(0, { from: secondAccount });
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
        try {
            await auction.cancelAuction(1, { from: thirdAccount });
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await auction.cancelAuction(1);
    });


    it("#5 can't call the clear, non-game contract", async () => {
        await racersBoxFactory.buyBox.sendTransaction(2, {from: fifthAccount, value: 1 * PRICE_BOX_TYPE_2});
        await racersBoxFactory.buyBox.sendTransaction(0, {from: fourthAccount, value: 1 * PRICE_BOX_TYPE_0});

        await racersCar.createSaleAuction(0, STARTING_PRICE, ENDING_PRICE, 186400, {from: fifthAccount});
        await racersCar.createSaleAuction(1, STARTING_PRICE, ENDING_PRICE, 186400, {from: fifthAccount});
        await racersCar.createSaleAuction(2, STARTING_PRICE, ENDING_PRICE, 186400, {from: fifthAccount});

        await racersCar.createSaleAuction(3, STARTING_PRICE, ENDING_PRICE, 86400, {from: fourthAccount});
        await racersCar.createSaleAuction(4, STARTING_PRICE, ENDING_PRICE, 86400, {from: fourthAccount});
        await racersCar.createSaleAuction(5, STARTING_PRICE, ENDING_PRICE, 86400, {from: fourthAccount});

        for (var i=0; i<6; i++) {
            const price = await auction.getCurrentPrice(i);
            await auction.bid.sendTransaction(i, {from: secondAccount, value:  price});
        }

        try {
            await auction.clearAll(fifthAccount, 1, {from: proxyAccount});
            await auction.clearOne(fifthAccount, 1, {from: proxyAccount});
            await auction.clearAll(fourthAccount, 4, {from: firstAccount});
            await auction.clearOne(fourthAccount, 4, {from: secondAccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

    });


    it("#6 commission should be withdrawable for owner", async () => {
        await racersBoxFactory.buyBox.sendTransaction(0, {from: thirdAccount, value: 1 * PRICE_BOX_TYPE_0});
        await racersCar.createSaleAuction(1, STARTING_PRICE, ENDING_PRICE, 186400, {from: thirdAccount});
        const price = await auction.getCurrentPrice(1);
        await auction.bid.sendTransaction(1, { from: fourthAccount, value: price });
        //await racersCar.withdrawAuctionBalances({from: thirdAccount}); // TODO
    });

});