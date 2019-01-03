pragma solidity ^0.4.23;

import "./RacersCarAuction.sol";

contract RacersCar is CarAuction {

    function init() public isInitializer("CAR", "1.0.0") {
        RacersCarStore.initialize();
    }

    function() public payable onlyWhitelisted() { }

    function withdrawBalance() external onlyTreasurer {
        uint256 balance = address(this).balance;
        treasurer.transfer(balance);
    }

    uint256[50] private ______gap;
}