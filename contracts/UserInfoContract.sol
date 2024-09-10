// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserInfoContract {
    enum UserType { Customer, Driver }

    struct User {
        string name;
        string contactDetails;
        UserType userType;
        bool isRegistered;
        uint256 negativePoints;
        bool isBlocked;
    }

    struct Driver {
        string vehicleNumber;
        string vehicleType;
        string insuranceDetails;
        string licenseDetails;
    }

    mapping(address => User) public users;
    mapping(address => Driver) public drivers;

    uint256 public constant BLOCKING_THRESHOLD = 100; // Negative points threshold for blocking

    event UserRegistered(address indexed userAddress, string name, UserType userType);
    event DriverDetailsRegistered(address indexed driverAddress, string vehicleNumber);
    event NegativePointsAdded(address indexed userAddress, uint256 points, uint256 totalPoints);
    event UserBlocked(address indexed userAddress);
    event UserUnblocked(address indexed userAddress);

    modifier onlyDriver() {
        require(users[msg.sender].userType == UserType.Driver, "Not a driver");
        _;
    }

    modifier onlyCustomer() {
        require(users[msg.sender].userType == UserType.Customer, "Not a customer");
        _;
    }

    modifier notBlocked() {
        require(!users[msg.sender].isBlocked, "User is blocked");
        _;
    }

    function registerUser(string memory _name, string memory _contactDetails, UserType _userType) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User(_name, _contactDetails, _userType, true, 0, false);
        emit UserRegistered(msg.sender, _name, _userType);
    }

    function registerDriverDetails(
        string memory _vehicleNumber,
        string memory _vehicleType,
        string memory _insuranceDetails,
        string memory _licenseDetails
    ) public onlyDriver {
        drivers[msg.sender] = Driver(_vehicleNumber, _vehicleType, _insuranceDetails, _licenseDetails);
        emit DriverDetailsRegistered(msg.sender, _vehicleNumber);
    }

    function getUserInfo(address _user) public view returns (string memory, string memory, UserType, uint256, bool) {
        User memory user = users[_user];
        return (user.name, user.contactDetails, user.userType, user.negativePoints, user.isBlocked);
    }

    function getDriverInfo(address _driver) public view onlyCustomer returns (string memory, string memory, string memory, string memory) {
        Driver memory driver = drivers[_driver];
        return (driver.vehicleNumber, driver.vehicleType, driver.insuranceDetails, driver.licenseDetails);
    }

    function addNegativePoints(address _user, uint256 _points) public {
        require(users[_user].isRegistered, "User not registered");
        users[_user].negativePoints += _points;
        emit NegativePointsAdded(_user, _points, users[_user].negativePoints);

        if (users[_user].negativePoints >= BLOCKING_THRESHOLD && !users[_user].isBlocked) {
            users[_user].isBlocked = true;
            emit UserBlocked(_user);
        }
    }

    function unblockUser(address _user) public {
        require(users[_user].isRegistered, "User not registered");
        require(users[_user].isBlocked, "User is not blocked");
        users[_user].isBlocked = false;
        users[_user].negativePoints = 0;
        emit UserUnblocked(_user);
    }

    function isUserBlocked(address _user) public view returns (bool) {
        return users[_user].isBlocked;
    }

    // Functions to be called by the RideRequestContract
    function canBookRide(address _user) public view returns (bool) {
        return users[_user].isRegistered && users[_user].userType == UserType.Customer && !users[_user].isBlocked;
    }

    function canBidForRide(address _driver) public view returns (bool) {
        return users[_driver].isRegistered && users[_driver].userType == UserType.Driver && !users[_driver].isBlocked;
    }
}