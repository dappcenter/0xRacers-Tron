pragma solidity ^0.4.23;

import "openzeppelin-zos/contracts/lifecycle/Pausable.sol";
import "./TreasurerMigratable.sol";


contract AccessControl is Pausable, TreasurerMigratable {

    modifier onlyTeam() {
        require(
            msg.sender == owner ||
            msg.sender == treasurer
        , "Only owner and treasure have access"
        );
        _;
    }

    function pause() public onlyTeam {
        return super.pause();
    }
}
