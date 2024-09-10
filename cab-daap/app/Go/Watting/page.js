"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { requestRide, listenToBidPlacedEvent, getUserInfo, acceptBid, listenToRideAcceptedEvent } from '@/lib/ContractServices';
import './InDriveWaitingRoom.css';

const DriverCard = ({ name, rating="4.5", rides=100, time="10:00", distance="10 km", price=1000, vehicle="BMW M8", onAccept }) => (
  <div className="driver-card">
    <div className="driver-header">
      <div className="driver-info">
        <div className="driver-initial">
          {name.charAt(0)}
        </div>
        <div>
          <p className="driver-name">{name}</p>
          <div className="driver-rating">
            <Star className="star-icon" />
            <span>{rating} ({rides} rides)</span>
          </div>
        </div>
      </div>
      <div className="ride-info">
        <p>{time}</p>
        <p>{distance}</p>
      </div>
    </div>
    <p className="price">₹{price}</p>
    <p className="vehicle">{vehicle}</p>
    <div className="button-group">
      <button className="decline-btn">Decline</button>
      <button className="accept-btn" onClick={onAccept}>Accept</button>
    </div>
  </div>
);

const InDriveWaitingRoom = () => {
  const [cab, setCab] = useState('');
  const [from, setFrom] = useState({lat: 0.000000, lng: 0.000000});
  const [destination, setDestination] = useState({lat: 0.000000, lng: 0.000000});
  const [bids, setBids] = useState([]);
  const [rideId, setRideId] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();

  const generateICE = () => {
    return new Promise((resolve) => {
      const pc = new RTCPeerConnection();
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          resolve(JSON.stringify(event.candidate));
        }
      };
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
    });
  };

  const chainWork = useCallback(async () => {
    const account = localStorage.getItem("account");
    const userInfo = await getUserInfo(account);
    const userType = Number(userInfo[2]);
    if (userType === 1) {
      alert("You are not allowed to request a ride");
      return;
    }
    // const ICE = await generateICE();
    try {
      const newRideId = await requestRide(JSON.stringify(from), JSON.stringify(destination), "ICE", cab);
      setRideId(newRideId);
      console.log("Ride requested successfully, Ride ID:", newRideId);
    } catch (error) {
      console.error("Error requesting ride:", error);
    }
  }, [from, destination, cab]);

  const book=() => {
    const cab = searchParams.get('cab');
    const flat = searchParams.get('flat');
    const flng = searchParams.get('flng');
    const dflat = searchParams.get('dflat');
    const dflng = searchParams.get('dflng');
    const destination = searchParams.get('destination');
    
    setCab(cab);
    setFrom({lat: flat, lng: flng});
    if(dflat && dflng) {
      setDestination({lat: dflat, lng: dflng});
    } else {
      setDestination(destination);
    }
    
    
  }
  useEffect(() => {
    book();
  }, []);

  useEffect(() => {

    const unsubscribeBidPlaced = listenToBidPlacedEvent(rideId,(event) => {
      const eventRideId = Number(event.args[0]); // 19n (first argument)
      const driver = event.args[1];       // '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' (second argument)
      const price = Number(event.args[2]);        // 10n (third argument)
      const driverICE = Number(event.args[3]); 
      console.log(eventRideId, driver, price, driverICE);
      console.log(
        rideId,eventRideId==rideId,eventRideId===rideId
      )
      if (eventRideId == rideId) {
        setBids(prevBids => [...prevBids, { driver, price, driverICE }]);
      }
    });

    const unsubscribeRideAccepted = listenToRideAcceptedEvent(rideId,(eventRideId, customer, driver) => {
      if (eventRideId === rideId) {
        router.push(`/Go/Ride?rideId=${rideId}`);
      }
    });

    // return () => {
    //   if (unsubscribeBidPlaced) unsubscribeBidPlaced();
    //   if (unsubscribeRideAccepted) unsubscribeRideAccepted();
    // };
  }, [rideId, router]);

  const handleAcceptBid = async (bid) => {
    console.log("Accepted bid:", bid);
    if (!rideId) {
      console.error("No ride ID available");
      return;
    }
    try {
      await acceptBid(rideId, bids.indexOf(bid));
      console.log("Bid accepted successfully");
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
    router.push(`/Go/Ride?rideId=${rideId}&driver=${bid.driver}&price=${bid.price}&driverICE=${bid.driverICE}&cab=${cab}&flat=${from.lat}&flng=${from.lng}&dflat=${destination.lat}&dflng=${destination.lng}`);
  };

  if(!isBooked) {
    return (<div className="booking-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Book Your Ride</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="ride-details">
              <h2 className="text-xl font-semibold mb-4">Ride Details</h2>
              <div className="mb-4">
                <p className="text-gray-600">From:</p>
                <p className="font-medium">{from.lat}, {from.lng}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">To:</p>
                <p className="font-medium">{destination.lat}, {destination.lng}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Vehicle Type:</p>
                <p className="font-medium">{cab}</p>
              </div>
            </div>
            <div className="passenger-details">
              <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
              <div className="mb-4">
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{/* Add passenger name here */}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Phone:</p>
                <p className="font-medium">{/* Add passenger phone here */}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button 
              onClick={()=>
              {
                chainWork();
                setIsBooked(true);
              }
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>)
  }
  return (
    <div className="waiting-room">
      <div className="container">
        <h1 className="title">Available Drivers</h1>
        {bids.length > 0 ? (
          bids.map((bid, index) => (
            <DriverCard
              key={index}
              driver={bid.driver}
              price={bid.price}
              name={bid.driver}
              onAccept={() => handleAcceptBid(bid)}
            />
          ))
        ) : (
          <div className="waiting-message">
            <p>Waiting for bids...</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InDriveWaitingRoom;