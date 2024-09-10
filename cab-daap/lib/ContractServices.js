"use client"

import { BrowserProvider, Contract } from "ethers";
import UserInfoContract_ABI from "./UserInfoContract_ABI.json";
import RideRequestContract_ABI from "./RideRequestContract_ABI.json";

const RIDE_REQUEST_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_RIDE_REQUEST_CONTRACT_ADDRESS;
const USER_INFO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USER_INFO_CONTRACT_ADDRESS;

let provider;
let signer;
let rideRequestContract;
let userInfoContract;

export async function initializeContracts() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            provider = new BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            
            rideRequestContract = new Contract(RIDE_REQUEST_CONTRACT_ADDRESS, RideRequestContract_ABI, signer);
            userInfoContract = new Contract(USER_INFO_CONTRACT_ADDRESS, UserInfoContract_ABI, signer);
            
            console.log("Contracts initialized successfully");
            console.log("RideRequestContract version:", await rideRequestContract.version());
        } catch (error) {
            console.error("Error initializing contracts:", error);
            throw new Error("Failed to initialize contracts");
        }
    } else {
        throw new Error("No Ethereum wallet detected");
    }
}

export async function requestAccount() {
    try {
        await initializeContracts();
        const accounts = await provider.send("eth_requestAccounts", []);
        return accounts[0];
    } catch (error) {
        console.error("Error requesting account:", error);
        throw new Error("Failed to request account");
    }
}

export async function registerUser(name, contactDetails, userType) {
    try {
        await initializeContracts();
        const tx = await userInfoContract.registerUser(name, contactDetails, userType);
        await tx.wait();
        console.log("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user");
    }
}

export async function registerDriverDetails(vehicleNumber, vehicleType, insuranceDetails, licenseDetails) {
    try {
        await initializeContracts();
        const userAddress = await signer.getAddress();
        const userInfo = await userInfoContract.getUserInfo(userAddress);
        
        if (Number(userInfo[2]) !== 1) {
            throw new Error("User is not registered as a driver");
        }
        
        const tx = await userInfoContract.registerDriverDetails(vehicleNumber, vehicleType, insuranceDetails, licenseDetails);
        await tx.wait();
        console.log("Driver details registered successfully");
        return true;
    } catch (error) {
        console.error("Error registering driver details:", error);
        throw error;
    }
}

export async function getUserInfo(userAddress) {
    try {
        await initializeContracts();
        return await userInfoContract.getUserInfo(userAddress);
    } catch (error) {
        console.error("Error getting user info:", error);
        throw new Error("Failed to get user info");
    }
}

export async function getDriverDetails(driverAddress) {
    try {
        await initializeContracts();
        return await userInfoContract.getDriverInfo(driverAddress);
    } catch (error) {
        console.error("Error getting driver details:", error);
        throw new Error("Failed to get driver details");
    }
}

// export async function requestRide(pickupLocation, destination, ICE, typeOfVehicle) {
//     try {
//         await initializeContracts();
//         const tx = await rideRequestContract.requestRide(pickupLocation, destination, ICE, typeOfVehicle);
//         const receipt = await tx.wait();
        
//         const requestRideEvent = receipt.logs.find(
//             log => log.topics[0] === rideRequestContract.interface.getEventTopic('RideRequested')
//         );
        
//         if (requestRideEvent) {
//             const parsedLog = rideRequestContract.interface.parseLog(requestRideEvent);
//             return parsedLog.args.rideId.toString();
//         } else {
//             throw new Error("RideRequested event not found in transaction logs");
//         }
//     } catch (error) {
//         console.error("Error requesting ride:", error);
//         throw new Error("Failed to request ride");
//     }
// }

export async function requestRide(pickupLocation, destination, ICE, typeOfVehicle) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.requestRide(pickupLocation, destination, ICE, typeOfVehicle);
        const receipt = await tx.wait();

        // Use the filter to find the RideRequested event
        const filter = rideRequestContract.filters.RideRequested();
        const logs = await provider.getLogs({
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
            address: rideRequestContract.address,
            topics: filter.topics
        });

        if (logs.length > 0) {
            const eventLog = logs[0]; // Taking the first event log
            const parsedLog = rideRequestContract.interface.parseLog(eventLog);
            return parsedLog.args.rideId.toString();
        } else {
            throw new Error("RideRequested event not found in transaction logs");
        }
    } catch (error) {
        console.error("Error requesting ride:", error);
        throw new Error("Failed to request ride");
    }
}

export async function placeBid(rideId, price, ICE) {
    try {
        await initializeContracts();
        console.log(rideId,price,ICE)
        const tx = await rideRequestContract.placeBid(rideId, Number(price), 1);
        await tx.wait();
        console.log("Bid placed successfully");
    } catch (error) {
        console.error("Error placing bid:", error);
        throw new Error("Failed to place bid");
    }
}

export async function acceptBid(rideId, bidIndex) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.acceptBid(rideId, bidIndex);
        await tx.wait();
        console.log("Bid accepted successfully");
    } catch (error) {
        console.error("Error accepting bid:", error);
        throw new Error("Failed to accept bid");
    }
}

export async function startRide(rideId) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.startRide(rideId);
        await tx.wait();
        console.log("Ride started successfully");
    } catch (error) {
        console.error("Error starting ride:", error);
        throw new Error("Failed to start ride");
    }
}

export async function completeRide(rideId) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.completeRide(rideId);
        await tx.wait();
        console.log("Ride completed successfully");
    } catch (error) {
        console.error("Error completing ride:", error);
        throw new Error("Failed to complete ride");
    }
}

export async function cancelRideByCustomer(rideId, reason) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.cancelRideByCustomer(rideId, reason);
        await tx.wait();
        console.log("Ride cancelled by customer successfully");
    } catch (error) {
        console.error("Error cancelling ride by customer:", error);
        throw new Error("Failed to cancel ride by customer");
    }
}

export async function cancelRideByDriver(rideId, reason) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.cancelRideByDriver(rideId, reason);
        await tx.wait();
        console.log("Ride cancelled by driver successfully");
    } catch (error) {
        console.error("Error cancelling ride by driver:", error);
        throw new Error("Failed to cancel ride by driver");
    }
}

export async function reportRideByCustomer(rideId, report) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.reportRideByCustomer(rideId, report);
        await tx.wait();
        console.log("Ride reported by customer successfully");
    } catch (error) {
        console.error("Error reporting ride by customer:", error);
        throw new Error("Failed to report ride by customer");
    }
}

export async function reportRideByDriver(rideId, report) {
    try {
        await initializeContracts();
        const tx = await rideRequestContract.reportRideByDriver(rideId, report);
        await tx.wait();
        console.log("Ride reported by driver successfully");
    } catch (error) {
        console.error("Error reporting ride by driver:", error);
        throw new Error("Failed to report ride by driver");
    }
}

export async function getRidesForCustomer(customer) {
    try {
        await initializeContracts();
        return await rideRequestContract.getRidesForCustomer(customer);
    } catch (error) {
        console.error("Error getting rides for customer:", error);
        throw new Error("Failed to get rides for customer");
    }
}

export async function getBidsForRide(rideId) {
    try {
        await initializeContracts();
        return await rideRequestContract.getBidsForRide(rideId);
    } catch (error) {
        console.error("Error getting bids for ride:", error);
        throw new Error("Failed to get bids for ride");
    }
}

function createEventListener(eventName, callback) {
    return async (rideId,callback) => {
        await initializeContracts();
        const filter = rideRequestContract.filters[eventName](rideId);
        rideRequestContract.on(filter, callback);
        return () => {
            rideRequestContract.off(filter, callback);
        };
    };
}

export const listenToBidPlacedEvent = createEventListener("BidPlaced");
export const listenToRideAcceptedEvent = createEventListener("RideAccepted");
export const listenToRideStartedEvent = createEventListener("RideStarted");
export const listenToRideCompletedEvent = createEventListener("RideCompleted");
export const listenToRideCancelledByCustomerEvent = createEventListener("RideCancelledByCustomer");
export const listenToRideCancelledByDriverEvent = createEventListener("RideCancelledByDriver");
export const listenToRideReportedByCustomerEvent = createEventListener("RideReportedByCustomer");
export const listenToRideReportedByDriverEvent = createEventListener("RideReportedByDriver");
export const listenToRideRequestedEvent = async (callback) => {
        await initializeContracts();
        rideRequestContract.on("RideRequested", (rideId, customer, ride) => {
            callback(rideId, customer, ride);
        });
        return () => {
            rideRequestContract.removeAllListeners("RideRequested");
        };
    };

export async function getRideById(rideId) {
    try {
        await initializeContracts();
        const ride = await rideRequestContract.rides(rideId);
        const userInfo = await getUserInfo(ride[0]); // customer address
        const driverInfo = await getUserInfo(ride[1]); // accepted driver address
        const driverDetails = await getDriverDetails(ride[1]);

        return {
            customer: {
                name: userInfo[0],
                contactDetails: userInfo[1],
                negativePoints: Number(userInfo[2]),
                isBlocked: userInfo[3],
                address: ride[0]
            },
            acceptedDriver: {
                name: driverInfo[0],
                contactDetails: driverInfo[1],
                negativePoints: Number(driverInfo[2]),
                isBlocked: driverInfo[3],
                address: ride[1]
            },
            pickupLocation: ride[2],
            destination: ride[3],
            timestamp: Number(ride[4]),
            status: Number(ride[5]),
            rideId: Number(ride[6]),
            customerReport: ride[7],
            driverReport: ride[8],
            acceptedBid: {
                driver: {
                    name: driverInfo[0],
                    contactDetails: driverDetails[1],
                    vehicleNumber: driverDetails[2],
                    vehicleType: driverDetails[3],
                    insuranceDetails: driverDetails[4],
                    licenseDetails: driverDetails[5]
                },
                price: Number(ride[9][1]), // acceptedBid.price
                ICE: Number(ride[9][2]), // acceptedBid.ICE
                isAccepted: ride[9][3] // acceptedBid.isAccepted
            },
            ICE: ride[10],
            typeOfVehicle: ride[11]
        };
    } catch (error) {
        console.error("Error getting ride by ID:", error);
        throw new Error("Failed to get ride by ID");
    }
}

export async function getRideByIdByCustomer(rideId) {
    try {
        await initializeContracts();
        console.log(rideId)
        var ride = await rideRequestContract.rides(rideId);
        // There's no direct function to get all rides, so we'll remove this line
        // If you need to get all rides, you might need to implement a custom function
        // that iterates through all ride IDs and fetches each ride individually
        // console.log(allRides)
        // for (let i = rideId-5; i < rideId+1; i++) {
        //     const ridee = await rideRequestContract.rides(i);
        //     if(ridee.rideId == rideId){
        //         ride = ridee;
        //     }
        //     console.log(i,ridee)
        // }
        // get driver details
        const driver = await getDriverDetails(ride.acceptedDriver);
        const DriverInfo = await getUserInfo(ride.acceptedDriver);
        const userInfo = await getUserInfo(ride.customer);
        // console.log(
        //     ride,
        //     driver,
        //     userInfo,
        //     DriverInfo,
        //     "ride, driver, userInfo, DriverInfo"
        // )

        return {
            customer: {
                name: userInfo[0],
                contactDetails: userInfo[1],
                negativePoints: userInfo[2],
                isBlocked: userInfo[3],
                address:ride.customer
            },
            acceptedDriver: {
                contactDetails: DriverInfo[1],
                negativePoints: DriverInfo[2],
                isBlocked: DriverInfo[3],
                address:ride.acceptedDriver
            },
            pickupLocation: ride.pickupLocation,
            destination: ride.destination,
            timestamp: Number(ride.timestamp),
            status: ride.status,
            rideId: Number(ride.rideId),
            customerReport: ride.customerReport,
            driverReport: ride.driverReport,
            acceptedBid: {
                driver: {
                    name: DriverInfo[0],
                    contactDetails: DriverInfo[1],
                    vehicleNumber: driver[0],
                    vehicleType: driver[1],
                    insuranceDetails: driver[2],
                    licenseDetails: driver[3]
                    // name: "Rajesh Kumar",
                    // contactDetails: "+91 92574 77746",
                    // vehicleNumber: "DL 01 AB 1234",
                    // vehicleType: "Hatchback",
                    // insuranceDetails: "ICICI Lombard Policy #IN987654",
                    // licenseDetails: "DL-1420110012345"
                },
                price: Number(ride.acceptedBid.price),
                ICE: Number(ride.acceptedBid.ICE),
                isAccepted: ride.acceptedBid.isAccepted
            },
            ICE: ride.ICE,
            typeOfVehicle: ride.typeOfVehicle
        };
    } catch (error) {
        console.error("Error getting ride by ID:", error);
        // throw new Error("Failed to get ride by ID");
    }
}