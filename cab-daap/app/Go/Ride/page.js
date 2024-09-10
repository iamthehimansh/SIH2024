"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Phone, MessageSquare,AlertTriangle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { 
  listenToRideStartedEvent, 
  listenToRideCompletedEvent, 
  listenToRideCancelledByDriverEvent, 
  listenToRideCancelledByCustomerEvent,
  startRide,
  completeRide,
  cancelRideByDriver,
  cancelRideByCustomer,
  getRideByIdByCustomer
} from '@/lib/ContractServices';
import './RideSharingApp.css';
import { useRouter } from 'next/navigation';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = degrees => degrees * (Math.PI / 180);
  
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

const RideSharingApp = () => {
  const [directions, setDirections] = useState(null);
  const [rideStatus, setRideStatus] = useState('started');
  const [rideId, setRideId] = useState(null);
  const [ride, setRide] = useState({
    customer: {
      name: '',
      contactDetails: '',
      negativePoints: 0,
      isBlocked: false,
      address: ''
    },
    acceptedDriver: {
      contactDetails: '',
      negativePoints: 0,
      isBlocked: false,
      address: ''
    },
    pickupLocation: '',
    destination: '',
    timestamp: 0,
    status: '',
    rideId: 0,
    customerReport: '',
    driverReport: '',
    acceptedBid: {
      driver: {
        name: '',
        contactDetails: '',
        vehicleNumber: '',
        vehicleType: '',
        insuranceDetails: '',
        licenseDetails: ''
      },
      price: 0,
      ICE: 0,
      isAccepted: false
    },
    ICE: '',
    typeOfVehicle: ''
  });
  const searchParams = useSearchParams();

  const [origin, setOrigin] = useState({ lat: 28.7041, lng: 77.1025 });
  const [destination, setDestination] = useState({ lat: 28.5355, lng: 77.3910 });
  const distance = useMemo(() => haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng), [origin, destination]);
  const router = useRouter();
  useEffect(() => {
    const fetchRide = async () => {
      const rideIdFromParams = searchParams.get('rideId');
      if (rideIdFromParams) {
        setRideId(rideIdFromParams);
        const rideData = await getRideByIdByCustomer(Number(rideIdFromParams));
        // console.log(rideData);
        setRide(rideData);

        // Parse pickupLocation and destination
        const pickupLocation = JSON.parse(rideData.pickupLocation);
        const destination = JSON.parse(rideData.destination);
        pickupLocation.lat=Number(pickupLocation.lat)
        pickupLocation.lng=Number(pickupLocation.lng)
        destination.lat=Number(destination.lat)
        destination.lng=Number(destination.lng)
        setOrigin(pickupLocation);
        setDestination(destination);
      }
    };
    fetchRide();
    const setupEventListeners = async () => {
      await listenToRideStartedEvent(rideId, () => setRideStatus('started'));
      await listenToRideCompletedEvent(rideId, () => setRideStatus('completed'));
      await listenToRideCancelledByDriverEvent(rideId, () => setRideStatus('cancelled'));
      await listenToRideCancelledByCustomerEvent(rideId, () => setRideStatus('cancelled'));
    };

    if (rideId) {
      setupEventListeners();
    }
  }, [rideId]);

  const directionsCallback = useCallback((result, status) => {
    if (status === 'OK' && result) {
      setDirections(result);
    } else {
      console.error(`Error fetching directions: ${result}`);
    }
  }, []);

  const handleStartRide = async () => {
    try {
      await startRide(rideId);
      setRideStatus('started');
    } catch (error) {
      console.error("Error starting ride:", error);
    }
  };

  const handleCompleteRide = async () => {
    try {
      await completeRide(rideId);
      setRideStatus('completed');
      router.push(`/Go/Ride/Done?rideId=${rideId}`);
    } catch (error) {
      console.error("Error completing ride:", error);
    }
  };

  const handleCancelRide = async () => {
    try {
      await cancelRideByCustomer(rideId, "Customer cancelled");
      setRideStatus('cancelled');
      router.push('/Go');
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };
  const handleReportIssue = () => {
    console.log("Reporting issue");
    alert("Your issue has been reported. Our support team will contact you shortly.");
    // Implement actual issue reporting functionality here
  };
  return (
    <div className="ride-sharing-app">
      <LoadScript googleMapsApiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={origin}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
          }}
        >
          <DirectionsService
            options={{
              origin: origin,
              destination: destination,
              travelMode: 'DRIVING'
            }}
            callback={directionsCallback}
          />
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      <div className="info-bar">
        <div className="arriving-text">Arriving</div>
        <div className="distance-tag">{distance.toFixed(2)} km</div>
      </div>

      <div className="driver-info">
        <div className="pickup-details">
          <span>Meet at the pickup point</span>
          <span className="eta">ETA: {new Date(ride.timestamp * 1000).toLocaleTimeString()}</span>
        </div>
        <div className="driver-details">
          <div className="driver-avatar">
            <img src="/land-removebg-preview.png" alt="Driver" />
          </div>
          <div className="driver-meta">
            <div className="driver-name">{ride.acceptedBid.driver.name}</div>
            <div className="vehicle-info">{ride.acceptedBid.driver.vehicleNumber} • {ride.acceptedBid.driver.vehicleType}</div>
          </div>
          <div className="driver-rating">4.3★</div>
        </div>
        <input className="message-input" placeholder="Message your driver..." />
        <div className="action-buttons">
          <button className="message-button">
            <MessageSquare className="icon" />
            Message
          </button>
          <button className="call-button">
            <Phone className="icon" />
            Call
          </button>
          <button onClick={handleReportIssue} className="call-button report-issue-button">
        <AlertTriangle className="icon" />
            Report Issue
          </button>
        </div>
      </div>

      <button onClick={() => {
        console.log("Sending data to police");
        alert("Sending data to police (currently not sending because of dev)");
      }} className="safety-button">
        SAFETY
      </button>
      <button className="open-map-button" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`, '_blank')}>
        Open in Google Maps
      </button>

      <div className="ride-action-buttons">
        {rideStatus === 'waiting' && <button className="action-button start-ride" onClick={handleStartRide}>Start Ride</button>}
        {rideStatus === 'started' && <button className="action-button complete-ride" onClick={handleCompleteRide}>Complete Ride</button>}
        {rideStatus !== 'completed' && rideStatus !== 'cancelled' && <button className="action-button cancel-ride" onClick={handleCancelRide}>Cancel Ride</button>}
      </div>

      
    </div>
  );
};

export default RideSharingApp;