pragma solidity ^0.4.23;

import "openzeppelin-zos/contracts/token/ERC721/ERC721.sol";

contract IRacersCar is ERC721 {
    function mintCar(address _to, string _name, uint256 _rarity, uint256 _carBrand) external returns(uint256);

    function getCar(uint256 _carId)
    public view returns ( uint256 produced, uint256 rarity, uint256 carBrand);
}
