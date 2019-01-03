pragma solidity ^0.4.23;

import "./CommonAuction.sol";
import "./ICarSaleAuction.sol";
import "../Car/IRacersCar.sol";

contract CarSaleAuction is ICarSaleAuction, CommonAuction  {

    function isCarSaleAuction() public returns(bool) {
        return true;
    }

    IRacersCar private carContract;

    mapping (address => uint256[]) sellerToTokenIds;

    modifier onlyOtherGameContracts() {
        require(msg.sender == address(carContract), "Not Game Contract");
        _;
    }

    function init (
        address _carContract,
        uint256 _treasurerCommission)
    isInitializer("CarSaleAuction", "1.0.0")
    public
    {
        CommonAuction.initialize(_carContract, _treasurerCommission);
        carContract = IRacersCar(_carContract);
    }

    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        address _seller
    )
    external
    onlyOtherGameContracts
    {
        require(_startingPrice == uint256(uint128(_startingPrice)), "Incorrect change to dimension");
        require(_endingPrice == uint256(uint128(_endingPrice)), "Incorrect change to dimension");
        require(_duration == uint256(uint64(_duration)), "Incorrect change to dimension");

        _escrow(_seller, _tokenId);
        Auction memory auction = Auction(
            _seller,
            uint128(_startingPrice),
            uint128(_endingPrice),
            uint64(_duration),
            uint64(now)
        );
        _addAuction(_tokenId, auction);

        sellerToTokenIds[_seller].push(_tokenId);
    }

    function bid(uint256 _tokenId)
    external
    payable
    {
        // _bid verifies token ID size
        address seller = tokenIdToAuction[_tokenId].seller;
        uint256 price = _bid(_tokenId, msg.value);
        _transfer(msg.sender, _tokenId);

        uint rarity;
        (,rarity,) = carContract.getCar(_tokenId);

        deleteSellerToTokenId(seller, _tokenId);
    }


    function cancelAuction(uint256 _tokenId)
    external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        address seller = auction.seller;
        require(msg.sender == seller);
        _cancelAuction(_tokenId, seller);

        deleteSellerToTokenId(seller, _tokenId);
    }

    // cancel all old auctions
    function clearAll(address _seller, uint _carLimitation)
    external
    onlyOtherGameContracts
    {
        uint256[] storage tokenIds = sellerToTokenIds[_seller];
        uint256 limiter;
        for(uint i = 0; i < tokenIds.length; i++) {
            // stop if ten cancellation have been made
            if(limiter > _carLimitation) break;

            uint256 tokenId = tokenIds[i];
            Auction storage auction = tokenIdToAuction[tokenId];

            if (auction.startedAt > 0 && now > auction.startedAt + auction.duration) {
                if (auction.seller == _seller ) {
                    _cancelAuction(tokenId, _seller);
                }

                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.length--;
                i--; // for checking new auction on old place
            }

            limiter++;
        }
    }

    function clearOne(address _seller, uint _tokenId)
    external
    onlyOtherGameContracts
    {
        uint256[] storage tokenIds = sellerToTokenIds[_seller];
        for(uint i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            if (tokenId == _tokenId) {
                Auction storage auction = tokenIdToAuction[tokenId];

                if (auction.startedAt > 0 && now > auction.startedAt + auction.duration) {
                    if (auction.seller == _seller ) {
                        _cancelAuction(tokenId, _seller);
                    }

                    tokenIds[i] = tokenIds[tokenIds.length - 1];
                    tokenIds.length--;
                    break;
                }
            }
        }
    }


    function deleteSellerToTokenId(address _seller, uint256 _tokenId)
    internal
    {
        uint256[] storage tokenIds = sellerToTokenIds[_seller];
        for(uint i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == _tokenId) {

                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.length--;
                break;
            }
        }
    }

    uint256[50] private ______gap;
}