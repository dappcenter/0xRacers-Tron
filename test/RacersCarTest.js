/* global artifacts, contract, it, assert, web3 */
/* eslint-disable prefer-reflect */

// test/.RacersCar.js
const RacersCar = artifacts.require('RacersCar.sol')

const TRON = 10000000;

contract('RacersCar', (accounts) => {

    let racersCar;

    before(async () => {
        racersCar = await RacersCar.deployed()
    })

    it('#1 should deposit and withdraw funds correctly', async function () {
        await racersCar.addAddressToWhitelist(accounts[0]);

        await racersCar.withdrawBalance();
    })


    it('#2 does not allow non-owners to withdraw funds', async function () {
        await racersCar.addAddressToWhitelist(accounts[2]);

        try {
            await racersCar.withdrawBalance({ from: accounts[1] });
            await racersCar.withdrawBalance({ from: accounts[3] });
            await racersCar.withdrawBalance({ from: accounts[4] });
            assert(false, "didn't throw attempting to withdraw from another accounts")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to withdraw from another accounts")
        }
    })


    it('#3 does not allow non-owners to call unpause', async function () {

        try {
            await racersCar.pause({ from: accounts[4] });
            assert(false, "didn't throw attempting to allow non-owners to call unpause")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to allow non-owners to call unpause")
        }
    })


    it('#4 should minted required car', async function () {

        await racersCar.addAddressToWhitelist(accounts[0]);

        await racersCar.mintCar(accounts[0], "New", 1, 1, { from: accounts[0] });
        await racersCar.mintCar(accounts[0], "New2", 2, 10, { from: accounts[0] });

        let balance = await racersCar.balanceOf(accounts[0]);
        assert.equal(balance.toString(), 5); // because + 3 after RacersBoxFactoryTest

        const _car = await racersCar.getCar.call(0);
        assert.notEqual(0, _car[0]);
        assert.notEqual(0, _car[1]);
        assert.notEqual(0, _car[2]);

        const _car1 = await racersCar.getCar.call(1);
        assert.notEqual(0, _car1[0]);
        assert.notEqual(0, _car1[1]);
        assert.notEqual(0, _car1[2]);
    })


    it('#5 does not minted during pause', async () => {

        await racersCar.addAddressToWhitelist(accounts[0]);

        try {
            await racersCar.mintCar(accounts[0], "New", 1, 1,  { from: accounts[3] });
            assert(false, "didn't throw attempting to minted during pause")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to minted during pause")
        }
    })


    it('#6 does not allow non-owner and non-whitelisted', async () => {

        try {
            await racersCar.mintCar(accounts[0], "New", 1, 1,  { from: accounts[0] });
            assert(false, "didn't throw attempting to call  non-owner and non-whitelisted")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to call  non-owner and non-whitelisted")
        }
        try {
            await racersCar.addAddressToWhitelist(accounts[2]);
            await racersCar.mintCar(accounts[0], "New", 3, 11, { from: accounts[2] });
            assert(false, "didn't throw attempting to call  non-owner and non-whitelisted")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to call  non-owner and non-whitelisted")
        }
        try {
            await racersCar.addAddressToWhitelist(accounts[4]);
            await racersCar.mintCar(accounts[0], "New", 4, 2, { from: accounts[4] });
            assert(false, "didn't throw attempting to call  non-owner and non-whitelisted")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to call  non-owner and non-whitelisted")
        }
    })
})