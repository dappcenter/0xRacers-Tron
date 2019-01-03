pragma solidity ^0.4.23;

import "zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol";

contract TournamentAIProxy is AdminUpgradeabilityProxy {
    constructor(address _implementation) AdminUpgradeabilityProxy(_implementation) public { }
}