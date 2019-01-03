pragma solidity ^0.4.23;

import "../CarSaleAuction/ICarSaleAuction.sol";
import "./RacersCarStore.sol";

contract CarAuction is RacersCarStore {

    ICarSaleAuction public saleAuction;

    
    function setCarSaleAuction(address _address) external onlyOwner {
        ICarSaleAuction candidateContract = ICarSaleAuction(_address);

        // NOTE: verify that a contract is what we expect - https://github.com/Lunyr/crowdsale-contracts/blob/cfadd15986c30521d8ba7d5b6f57b4fefcc7ac38/contracts/LunyrToken.sol#L117
        require(candidateContract.isCarSaleAuction(), "Incorrect address param");

        // Set the new contract address
        saleAuction = candidateContract;
    }


    function createSaleAuction(
        uint256 _Id,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration
    )
    external whenNotPaused {
        // CarSaleAuction contract checks input sizes
        // If Car is already on any auction, this will throw
        // because it will be owned by the auction contract.
        require(ownerOf(_Id) == msg.sender, "Not owner");

        approve(saleAuction, _Id);
        // Sale auction throws if inputs are invalid and clears
        // transfer approval after escrowing the Car.
        saleAuction.createAuction(
            _Id,
            _startingPrice,
            _endingPrice,
            _duration,
            msg.sender
        );
    }


    function withdrawAuctionBalances() external onlyOwner {
        saleAuction.withdrawBalance();
    }
}