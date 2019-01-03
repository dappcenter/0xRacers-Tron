pragma solidity ^0.4.23;

import "../Tools/Random.sol";
import "./../Access/AccessControl.sol";
import "openzeppelin-zos/contracts/token/ERC721/ERC721Token.sol";
import "./IRacersCar.sol";
import "../Access/WhitelistMigratable.sol";

contract RacersCarStore is IRacersCar, ERC721Token, WhitelistMigratable, AccessControl, Random {


    /*** EVENTS ***/
    event CarCreated(
        address owner,
        uint256 id,
        uint256 rarity,
        uint256 carBrand,
        uint256 creationDate);


    /*** DATA TYPES ***/
    struct Car {
        uint256 produced; // now
        uint256 rarity; // 0 - 3
        uint256 carBrand; // 0 - 23
    }


    /*** STORAGE ***/
        //    struct Cart.sol {
        //        uint48 produced;
        //        uint8 rarity;
        //        uint8 carBrand;
        //    }


    uint256[] public cars;

    function initialize() public isInitializer("CarStore", "1.0.0") {
        Pausable.initialize(msg.sender);

        ERC721Token.initialize("Car", "CAR");

        paused = false;
        transferTreasurer(owner);
    }


    function getCar(uint256  _carId)
        public view returns (uint256 produced, uint256 rarity, uint256 carBrand) {
        Car memory _car = _getCar(_carId);

        produced = _car.produced;
        rarity = _car.rarity;
        carBrand = _car.carBrand;
    }


    function mintCar (address _to, string _name, uint256 _rarity, uint256 _carBrand)
        external whenNotPaused onlyWhitelisted()
        returns(uint256)
    {
        require(_rarity <= 3, "Value cannot be greater than 3");
        require(_carBrand <= 23, "Value cannot be greater than 23");

        Car memory _car = _createCar(_rarity, _carBrand);
        uint256 car = _convertCarToHash(_car);
        uint256 newID = cars.push(car)-1;
        emit CarCreated(_to, newID, _rarity, _carBrand, now);
        _mint(_to, newID);
        _setTokenURI(newID, _name);

    return newID;
    }


    function _getCar (uint256 _id) internal view returns(Car memory _car) {
        uint256 car = cars[_id];

        _car.produced = uint256(uint48(car));
        _car.rarity = uint256(uint8(car>>48));
        _car.carBrand = uint256(uint8(car>>56));
    }


    function _convertCarToHash(Car memory _car)
    internal pure returns(uint256 _carHash)
    {
        _carHash = _car.produced;
        _carHash |= _car.rarity<<48;
        _carHash |= _car.carBrand<<56;
    }


    function _createCar(uint256 _rarity, uint256 _carBrand)
        internal view returns (Car memory _car)
    {
        _car = Car({
            produced: uint256(now),
            rarity: _rarity,
            carBrand: _carBrand
            });
    }


    function () public payable {
        revert("Contract cannot be funded");
    }
}