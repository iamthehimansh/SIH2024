// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserInfoContract.sol";

contract RideRequestContract {
    UserInfoContract userInfoContract;

    constructor(address _userInfoContractAddress) {
        userInfoContract = UserInfoContract(_userInfoContractAddress);
    }

    enum RideStatus {
        Active,
        Accepted,
        Started,
        Completed,
        CancelledByCustomer,
        CancelledByDriver,
        ReportedByCustomer,
        ReportedByDriver
    }

    struct Ride {
        address customer;
        address acceptedDriver;
        string pickupLocation;
        string destination;
        uint256 timestamp;
        RideStatus status;
        uint256 rideId;
        string customerReport;
        string driverReport;
        Bid acceptedBid;
        string ICE;
        string typeOfVehicle;
    }

    struct Bid {
        address driver;
        uint256 price;
        uint256 ICE;
        bool isAccepted;
    }

    mapping(uint256 => Ride) public rides;
    mapping(uint256 => Bid[]) public rideBids;
    uint256 public rideCounter;

    event BidPlaced(uint256 indexed rideId, address indexed driver, uint256 price, uint256 ICE);
    event RideStarted(uint256 indexed rideId, address indexed driver);
    event RideCompleted(uint256 indexed rideId, address indexed driver);
    event RideCancelledByCustomer(uint256 indexed rideId, string reason);
    event RideCancelledByDriver(uint256 indexed rideId, address driver, string reason);
    event RideReportedByCustomer(uint256 indexed rideId, string report);
    event RideReportedByDriver(uint256 indexed rideId, string report);
    event RideAccepted(uint256 indexed rideId, address indexed driver);
    event RideRequested(uint256 indexed rideId, address indexed customer,Ride ride);

    modifier onlyCustomer(uint256 _rideId) {
        (, , UserInfoContract.UserType userType, , ) = userInfoContract
            .getUserInfo(msg.sender);
        require(
            userType == UserInfoContract.UserType.Customer,
            "Not a customer"
        );
        require(
            rides[_rideId].customer == msg.sender,
            "Not the ride requester"
        );
        _;
    }

    modifier onlyAcceptedDriver(uint256 _rideId) {
        (, , UserInfoContract.UserType userType, , ) = userInfoContract
            .getUserInfo(msg.sender);
        require(userType == UserInfoContract.UserType.Driver, "Not a driver");
        require(
            rides[_rideId].acceptedDriver == msg.sender,
            "Not the accepted driver"
        );
        _;
    }

    modifier onlyDriver() {
        (, , UserInfoContract.UserType userType, , ) = userInfoContract
            .getUserInfo(msg.sender);
        require(userType == UserInfoContract.UserType.Driver, "Not a driver");
        _;
    }

    function requestRide(
        string memory _pickupLocation,
        string memory _destination,
        string memory _ICE,
        string memory _typeOfVehicle
    ) public {
        require(
            userInfoContract.canBookRide(msg.sender),
            "User cannot book rides"
        );
        rideCounter++;
        rides[rideCounter] = Ride(
            msg.sender,
            address(0),
            _pickupLocation,
            _destination,
            block.timestamp,
            RideStatus.Active,
            rideCounter,
            "",
            "",
            Bid(address(0), 0, 0, false),
            _ICE,
            _typeOfVehicle
        );

        emit RideRequested(rideCounter, msg.sender,rides[rideCounter]);
    }

    function placeBid(
        uint256 _rideId,
        uint256 _price,
        uint256 _ICE
    ) public onlyDriver {
        require(
            userInfoContract.canBidForRide(msg.sender),
            "Driver cannot bid for rides"
        );

        require(
            rides[_rideId].status == RideStatus.Active,
            "Ride is not active"
        );
        rideBids[_rideId].push(Bid(msg.sender, _price, _ICE, false));

        emit BidPlaced(_rideId, msg.sender, _price, _ICE);
    }

    function acceptBid(
        uint256 _rideId,
        uint256 _bidIndex
    ) public onlyCustomer(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Active,
            "Ride is not active"
        );

        Bid storage bid = rideBids[_rideId][_bidIndex];
        require(!bid.isAccepted, "Bid already accepted");

        bid.isAccepted = true;
        rides[_rideId].status = RideStatus.Accepted;
        rides[_rideId].acceptedDriver = bid.driver;

        // Store the accepted bid in the ride
        rides[_rideId].acceptedBid = bid;

        emit RideAccepted(_rideId, bid.driver);
    }

    function startRide(uint256 _rideId) public onlyAcceptedDriver(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Accepted,
            "Ride is not in accepted state"
        );

        rides[_rideId].status = RideStatus.Started;

        emit RideStarted(_rideId, msg.sender);
    }

    function completeRide(uint256 _rideId) public onlyAcceptedDriver(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Started,
            "Ride has not started yet"
        );

        rides[_rideId].status = RideStatus.Completed;

        emit RideCompleted(_rideId, msg.sender);
        // Logic to finalize the ride, handle payments, etc.
    }

    function cancelRideByCustomer(
        uint256 _rideId,
        string memory _reason
    ) public onlyCustomer(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Active ||
                rides[_rideId].status == RideStatus.Accepted,
            "Ride cannot be cancelled"
        );

        rides[_rideId].status = RideStatus.CancelledByCustomer;
        rides[_rideId].customerReport = _reason;

        emit RideCancelledByCustomer(_rideId, _reason);
        // Logic to handle cancellation fees, if any
        userInfoContract.addNegativePoints(msg.sender, 25);
    }

    function cancelRideByDriver(
        uint256 _rideId,
        string memory _reason
    ) public onlyAcceptedDriver(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Accepted,
            "Ride cannot be cancelled by driver"
        );

        rides[_rideId].status = RideStatus.CancelledByDriver;

        emit RideCancelledByDriver(_rideId, msg.sender, _reason);
        // Logic to handle driver penalties for cancellation, if any
        userInfoContract.addNegativePoints(msg.sender, 25);
    }

    function reportRideByCustomer(
        uint256 _rideId,
        string memory _report
    ) public onlyCustomer(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Started ||
                rides[_rideId].status == RideStatus.Completed,
            "Ride cannot be reported at this stage"
        );

        rides[_rideId].customerReport = _report;
        rides[_rideId].status = RideStatus.ReportedByCustomer;

        emit RideReportedByCustomer(_rideId, _report);
        // Logic to notify authorities or take appropriate action
    }

    function reportRideByDriver(
        uint256 _rideId,
        string memory _report
    ) public onlyAcceptedDriver(_rideId) {
        require(
            rides[_rideId].status == RideStatus.Started ||
                rides[_rideId].status == RideStatus.Completed,
            "Ride cannot be reported at this stage"
        );

        rides[_rideId].driverReport = _report;
        rides[_rideId].status = RideStatus.ReportedByDriver;

        emit RideReportedByDriver(_rideId, _report);
        // Logic to notify authorities or take appropriate action
    }

    function getRidesForCustomer(
        address _customer
    ) public view returns (Ride[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= rideCounter; i++) {
            if (rides[i].customer == _customer) {
                count++;
            }
        }

        Ride[] memory customerRides = new Ride[](count);
        uint256 j = 0;
        for (uint256 i = 1; i <= rideCounter; i++) {
            if (rides[i].customer == _customer) {
                customerRides[j] = rides[i];
                j++;
            }
        }
        return customerRides;
    }

    function getBidsForRide(
        uint256 _rideId
    ) public view returns (Bid[] memory) {
        return rideBids[_rideId];
    }

    function version() public pure returns (string memory) {
        return "1.0.0";
    }
}
