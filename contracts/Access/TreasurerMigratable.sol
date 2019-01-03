pragma solidity ^0.4.23;

import "openzeppelin-zos/contracts/ownership/Ownable.sol";

contract TreasurerMigratable is Ownable {
    address public treasurer;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyTreasurer() {
        require(msg.sender == treasurer, "Only treasurer");
        _;
    }

    function transferTreasurer(address _treasurer) public onlyOwner {
        if (_treasurer != address(0)) {
            treasurer = _treasurer;
        }
    }
}
