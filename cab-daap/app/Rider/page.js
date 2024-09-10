"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, IndianRupee, Navigation, Check } from 'lucide-react';
import './RiderHome.css';
import { initializeContracts, listenToRideRequestedEvent, listenToRideAcceptedEvent, placeBid, getRidesForCustomer, startRide } from '@/lib/ContractServices';
import { useRouter } from 'next/navigation';
const RideRequest = ({ request, onBidSubmit, onStartRide }) => {
  const [bidAmount, setBidAmount] = useState(request.bidAmount || '');

  const calculateDistance = (from, to) => {
    const fromCoords = JSON.parse(from);
    const toCoords = JSON.parse(to);
    const R = 6371; // Earth's radius in km
    const dLat = (toCoords.lat - fromCoords.lat) * Math.PI / 180;
    const dLon = (toCoords.lng - fromCoords.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(fromCoords.lat * Math.PI / 180) * Math.cos(toCoords.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  return (
    <div className="ride-request">
      <div className="ride-info">
        <div className="ride-time">
          <Clock size={18} className="icon-gray" />
          <span>{request.timestamp ? new Date(request.timestamp * 1000).toLocaleTimeString() : 'N/A'}</span>
        </div>
        <span className="ride-distance">{calculateDistance(request.pickupLocation, request.destination)} km</span>
      </div>
      <div className="ride-locations">
        <div className="location-item">
          <div className="location-icon green-bg">
            <MapPin size={14} className="icon-white" />
          </div>
          <span>
            {request.pickupLocation && JSON.parse(request.pickupLocation).lat && JSON.parse(request.pickupLocation).lng
              ? `${parseFloat(JSON.parse(request.pickupLocation).lat).toFixed(6)}, ${parseFloat(JSON.parse(request.pickupLocation).lng).toFixed(6)}`
              : 'Location not available'}
          </span>
        </div>
        <div className="location-item">
          <div className="location-icon red-bg">
            <Navigation size={14} className="icon-white" />
          </div>
          <span>
            {request.destination && JSON.parse(request.destination).lat && JSON.parse(request.destination).lng
              ? `${parseFloat(JSON.parse(request.destination).lat).toFixed(6)}, ${parseFloat(JSON.parse(request.destination).lng).toFixed(6)}`
              : 'Location not available'}
          </span>
        </div>
      </div>
      {request.status === 'Accepted' ? (
        <div className="ride-accepted">
          <p>Your bid of {Number(request.acceptedBid.price)} was accepted!</p>
          <button onClick={() => onStartRide(request.rideId)} className="start-ride-button">
            <Check size={18} className="icon-white" />&nbsp;
            Start Ride
          </button>
        </div>
      ) : (
        <div className="ride-bid">
          <input
            type="number"
            placeholder="Your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="bid-input"
          />
          <button onClick={() => onBidSubmit(request.rideId, bidAmount)} className="bid-button">
            <IndianRupee size={18} className="icon-white" />
            Bid
          </button>
        </div>
      )}
    </div>
  );
};

export default function RiderHome() {
  const [liveRequests, setLiveRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const rideRequestedListener = listenToRideRequestedEvent((rideId, customer, ride) => {
      setLiveRequests(prevRequests => [
        ...prevRequests.filter(
        (req) => req.rideId !== Number(rideId)
        ),
        {
          rideId: Number(rideId),
          customer,
          pickupLocation: ride.pickupLocation,
          destination: ride.destination,
          timestamp: Number(ride.timestamp),
          status: 'Requested',
          typeOfVehicle: ride.typeOfVehicle,
          bidAmount: '',
          bids: []
        }
      ]); 
    });

    

    // return () => {
    //   if (rideRequestedListener) {
    //     rideRequestedListener.removeAllListeners();
    //   }
    //   if (rideAcceptedListener) {
    //     rideAcceptedListener.removeAllListeners();
    //   }
    // };
  }, []);

  useEffect(() => {
    const lastBid = bids.length > 0 ? bids[bids.length - 1] : null;
    if (lastBid) {
    const rideAcceptedListener = listenToRideAcceptedEvent(lastBid.rideId,( event) => {
      const rideId = event.args[0];
      const driver = event.args[1];
      console.log("rideAcceptedListener",rideId, driver);
      setLiveRequests(prevRequests => 
        prevRequests.map(req => 
          req.rideId === Number(rideId) 
            ? {...req, status: 'Accepted', acceptedBid: {
              price: Number(lastBid.amount),
              driver: driver
            }}
            : req
        )
      );
    });
  }

    // return () => {
    //   if (rideAcceptedListener) {
    //     rideAcceptedListener.removeAllListeners();
    //   }
    // };
  }, [bids]);

  const handleBidSubmit = async (rideId, amount) => {
    try {
      if (isNaN(amount) || amount <= 0 || amount > Number.MAX_SAFE_INTEGER) {
        throw new Error("Invalid bid amount");
      }
      await placeBid(rideId, amount, "ICE");
      console.log(`Bid of ${amount} submitted for ride ${rideId}`);
      setBids(prevBids => [...prevBids, {rideId, amount}]);
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Error submitting bid. Please try again with a valid amount.");
    }
  };

  const handleStartRide = async (rideId) => {
    try {
      await startRide(rideId);
      console.log(`Ride ${rideId} started`);
      router.push(`/Rider/Accepted/?ride=${rideId}`);
    } catch (error) {
      console.error("Error starting ride:", error);
      alert("Error starting ride. Please try again.");
    }
  };

  return (
    <div className="rider-home">
      <h1 className="header">Available Rides</h1>
      {liveRequests.length === 0 ? (
        <div className="no-requests">
          <Clock size={48} className="icon-gray" />
          <p>Waiting for ride requests...</p>
        </div>
      ) : (
        <div className="requests-list">
          {liveRequests.map((request) => (
            <RideRequest 
              key={request.rideId} 
              request={request} 
              onBidSubmit={handleBidSubmit}
              onStartRide={handleStartRide}
            />
          ))}
        </div>
      )}
    </div>
  );
}