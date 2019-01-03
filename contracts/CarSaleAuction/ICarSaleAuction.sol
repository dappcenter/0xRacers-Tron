pragma solidity ^0.4.23;

contract ICarSaleAuction {

    function isCarSaleAuction() public returns(bool);


    /// @dev Creates and begins a new auction.
    /// @param _tokenId - ID of token to auction, sender must be owner.
    /// @param _startingPrice - Price of item (in wei) at beginning of auction.
    /// @param _endingPrice - Price of item (in wei) at end of auction.
    /// @param _duration - Length of auction (in seconds).
    /// @param _seller - Seller, if not the message sender
    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration,
        address _seller
    )
    external;

    /// @dev Updates lastSalePrice if seller is the nft contract
    /// Otherwise, works the same as default bid method.
    function bid(uint256 _tokenId)
    external
    payable;

    function cancelAuction(uint256 _tokenId)
    external;

    // cancel all old auctions
    function clearAll(address _seller, uint planetLimitation)
    external;

    // cancel an old auction for the token id
    function clearOne(address _seller, uint256 _tokenId)
    external;

    function withdrawBalance() external;
}