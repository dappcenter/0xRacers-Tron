/* global artifacts, contract, it, assert, web3 */
/* eslint-disable prefer-reflect */

// test/.TournamentAITest.js
const TournamentAI = artifacts.require("./TournamentAI/TournamentAI.sol");

const TRON = 10000000;

const TYPE_0 = 5000000000000000000;
const TYPE_1 = 15000000000000000000;
const TYPE_2 = 50000000000000000000;

contract("TournamentAI", accounts => {

    const [firstAccount, secondAccount, thirdaccount, fourthaccount] = accounts;

    let tournament;

    before(async () => {
        tournament = await TournamentAI.deployed()
    });


    it("#1 should created racing with bots", async () => {

        await tournament.runTournament(0,  {from: firstAccount, value: 1 * TYPE_0});
        await tournament.runTournament(1,  {from: secondAccount, value: 1 * TYPE_1});
        await tournament.runTournament(2,  {from: thirdaccount, value: 1 * TYPE_2});
        await tournament.withdrawBalance(firstAccount,  {from: firstAccount});
    });


    it("#2 does not allow non-owners to withdraw funds",  async () => {

        try {
            await tournament.withdrawBalance(fourthaccount,  {from: fourthaccount});
            assert(false, "didn't throw attempting to withdraw from another accounts")
        } catch (error) {
            assert.equal(error.message, "didn't throw attempting to withdraw from another accounts")
        }
    });


    it("#3 does not allow non-owners to call setBid",  async () => {

        try {
            await tournament.setBid(0, 0,  {from: fourthaccount});
            assert(false, "didn't throw when  non-owners to call setBid")
        } catch (error) {
            assert.equal(error.message, "didn't throw when  non-owners to call setBid")
        }
    });
});