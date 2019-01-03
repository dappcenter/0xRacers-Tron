/* global artifacts, contract, it, assert, web3 */
/* eslint-disable prefer-reflect */

// test/.RacersBoxFactoryTest.js
const RacersCar = artifacts.require('RacersCar.sol')
const RacersBoxFactory = artifacts.require("RacersBoxFactory.sol");

const PRICE_0 = 10000000;
const PRICE_1 = 20000000;
const PRICE_2 = 40000000;


const MICRO = 100000;
const TRON = 10000000;

contract("RacersBoxFactory", accounts => {

    let racersCar, racersBoxFactory;

    before(async () => {
        racersCar = await RacersCar.deployed()
        racersBoxFactory = await  RacersBoxFactory.deployed()
    })


    it("#1 should worked basic buy functional correctly", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);

        await racersBoxFactory.buyBox(0, {
            from: accounts[0],
            feeLimit:1000000000,
            callValue: 1 * PRICE_0,
            shouldPollResponse:true
        });

         await racersBoxFactory.buyBox(1, {
            from: accounts[0],
            feeLimit:1000000000,
            callValue: 1 * PRICE_1,
            shouldPollResponse:true
        });

        await racersBoxFactory.buyBox(2, {
            from: accounts[0],
            feeLimit:1000000000,
            callValue: 1 * PRICE_2,
            shouldPollResponse:true
        });

        let balance = await racersCar.balanceOf(accounts[0]);
        assert.equal(balance.toString(), 3);

        await racersBoxFactory.withdrawFactoryBalance();
    });


    it("#2 should worked basic gifted functional correctly", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);
        await racersBoxFactory.addAddressToWhitelist(accounts[0]);

        await racersBoxFactory.giftBox(1, accounts[2], {from: accounts[0]});

        let balance = await racersCar.balanceOf(accounts[2]);
        assert.equal(balance.toString(), 1);
    });


    it("#3 does not allow non-whitelist's members to gift", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);

        try {
            await racersBoxFactory.giftBox(1, accounts[3], {from: accounts[3]});
            assert(false, "didn't throw attempting to non-whitelist's members to gift to car");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to non-whitelist's members to gift to car");
        }

        let balance4 = await racersCar.balanceOf(accounts[3]);
        assert.equal(balance4.toString(), 0);
    });

    // TODO Не Бросает исключения!!!!!!
    it("#4 can't buy, because incorrect amount", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);

        try {
            await racersBoxFactory.buyBox(1, {
                from: accounts[4],
                feeLimit:1000000000,
                callValue: PRICE_0,
                shouldPollResponse:true
            });
            assert(false, "didn't throw attempting for incorrect amount");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting for incorrect amount");
        }
        try {
            await racersBoxFactory.buyBox(2, {
                from: accounts[4],
                feeLimit:1000000000,
                callValue: PRICE_0,
                shouldPollResponse:true
            });
            assert(false, "didn't throw attempting for incorrect amount");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting for incorrect amount");
        }
    });


    // TODO Не Бросает исключения!!!!!!
    it("#5 can't call the setCarContract, non-owner", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);

        try {
            await racersBoxFactory.setCarContract(accounts[8], {
                from: accounts[8],
                feeLimit:1000000000,
                shouldPollResponse: true
            });

            assert(false, "didn't throw attempting to non-owner's call the setCarContract");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to non-owner's call the setCarContract");
        }
    });


    it("#6 can't call the setBoxPrices, non-owner ", async () => {

        try {
            await racersBoxFactory.setBoxPrices(0, 1000, {from: accounts[1]} );
            assert(false, "didn't throw attempting to non-owner's call the setBoxPrices");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to non-owner's call the setBoxPrices");
        }

        try {
            await racersBoxFactory.setBoxPrices(1, 1000, {from: accounts[2]} );
            assert(false, "didn't throw attempting to non-owner's call the setBoxPrices");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to non-owner's call the setBoxPrices");
        }

        try {
            await racersBoxFactory.setBoxPrices(2, 1000, {from: accounts[3]} );
            assert(false, "didn't throw attempting to non-owner's call the setBoxPrices");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to non-owner's call the setBoxPrices");
        }

        try {
            await racersBoxFactory.setBoxPrices(3, 1000, {from: accounts[4]} );
            assert(false, "didn't throw attempting to non-owner's call the setBoxPrices");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to non-owner's call the setBoxPrices");
        }
    });

    /* TODO syntax ERROR - send
     it("#8 does not allow to send funds to the contract directly", async () => {
         await racersBoxFactory.setCarContract(racersCar.address);
         await racersCar.addAddressToWhitelist(racersBoxFactory.address);

         try {
             await racersBoxFactory.send({
                 from: accounts[0],
                 feeLimit:1000000000,
                 callValue: 10 * PRICE_2,
                 shouldPollResponse:true
             });
             assert(false, "didn't throw attempting to send funds to the contract directly");
         } catch (error) {
             assert.equal(error.message, "didn't throw attempting to send funds to the contract directly");
         }
     });
     
 it("#9 should revert transfer TRON to contract", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);
        await racersCar.addAddressToWhitelist(accounts[2]);

        for (var i = 0; i < 600; i++) {
            try {
                await racersBoxFactory.sendTransaction({from: accounts[1], value: MICRO});
                await racersBoxFactory.sendTransaction({from: accounts[2], value: 10* MICRO});
                await racersBoxFactory.sendTransaction({from: accounts[3], value: 100* MICRO});

                assert(false, "didn't throw attempting to send funds to the contract directly");
            } catch (error) {
                assert.equal(error.message, "didn't throw attempting to send funds to the contract directly");
            }
        }
    });
     */


    it("#7 does not allow non-owners to withdraw funds", async () => {
        await racersBoxFactory.setCarContract(racersCar.address);
        await racersCar.addAddressToWhitelist(racersBoxFactory.address);

        try {
            await racersBoxFactory.withdrawFactoryBalance({from: accounts[1]});
            assert(false, "didn't throw attempting allow non-owners to withdraw funds");
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting allow non-owners to withdraw funds");
        }
    });




});