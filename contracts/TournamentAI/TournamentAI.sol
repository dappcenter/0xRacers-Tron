pragma solidity ^0.4.23;

import "../Tools/Random.sol";
import "../Access/TreasurerMigratable.sol";
import "../Access/WhitelistMigratable.sol";

contract TournamentAI is TreasurerMigratable, Random, WhitelistMigratable {

    // EVENTS
    event Result(uint256 place);

    uint256[3] bidType;


    function init() public isInitializer("RacersAI", "1.0.0") {
        Ownable.initialize(msg.sender);

        bidType[0] = 5000000000000000000;
        bidType[1] = 15000000000000000000;
        bidType[2] = 50000000000000000000;
    }


    function setBid(uint256 _type, uint256 _bid) public onlyOwner {
        bidType[_type] = _bid;
    }


    function runTournament(uint256 _gameType) public payable {
        require(_gameType >= 0 && _gameType <= 2, "Type cannot be more than 2");
        require(msg.value >= bidType[_gameType], "Insufficient equity");

        uint256 nightstand = _gameProccess();

        if (nightstand == 1) {
            msg.sender.transfer(bidType[_gameType]);
        }
        emit Result(nightstand);
    }


    function () public payable {
        revert();
    }


    function withdrawBalance(address _wallet) public onlyOwner {
        require(_wallet != address(0), "address incorrect");
        _wallet.transfer(address(this).balance);
    }


    function _gameProccess() internal returns(uint256) {
        uint256 result = _randRange(1,100);

        if (result <= 5) {
            return 1;
        }
        if (result <= 15) {
            return 2;
        }
        if (result <= 35) {
            return 3;
        }
        if (result <= 55) {
            return 4;
        }
        else {
            return 5;
        }
    }
}