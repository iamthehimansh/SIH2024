"use client";
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import './RideSharingApp.css';
import { initializeContracts, getRideById, listenToRideStartedEvent, listenToRideCompletedEvent, listenToRideCancelledByDriverEvent } from '@/lib/ContractServices';
import { useSearchParams } from 'next/navigation';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = degrees => degrees * (Math.PI / 180);
    
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

const RideSharingApp = () => {
  const [directions, setDirections] = useState(null);
  const [rideInfo, setRideInfo] = useState(null);
   //   enum{
//     Accepted,Started,Completed,Cancelled
//   }
  const [status, setStatus] = useState(0);
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const rideId = searchParams.get('ride');

  const [origin, setOrigin] = useState({ lat: 28.7041, lng: 77.1025 });
  const [destination, setDestination] = useState({ lat: 28.5355, lng: 77.3910 });
  const distance = useMemo(() => haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng), [origin, destination]);

  const directionsCallback = useCallback((result, status) => {
    if (status === 'OK' && result) {
      setDirections(result);
    } else {
      console.error(`Error fetching directions: ${result}`);
    }
  }, []);

  useEffect(() => {
    const fetchRideInfo = async () => {
      await initializeContracts();
      const currentRide = await getRideById(Number(rideId));
      console.log(currentRide,"currentRide")
      if (currentRide) {
        setRideInfo(currentRide);
        let org = JSON.parse(currentRide.pickupLocation);
        org.lat=Number(org.lat)
        org.lng=Number(org.lng)

        setOrigin(org);
        let dest = JSON.parse(currentRide.destination);
        dest.lat=Number(dest.lat)
        dest.lng=Number(dest.lng)
        setDestination(dest);
        console.log(org, dest);
        console.log(currentRide);
      }
    };

    fetchRideInfo();

    const rideStartedListener = listenToRideStartedEvent(rideId, (event) => {
      console.log(`Ride ${event.args[0]} has started`);
      setStatus(1);
    });

    const rideCompletedListener = listenToRideCompletedEvent(rideId, (event) => {
      console.log(`Ride ${event.args[0]} has completed`);
      setStatus(2);
    });

    const rideCancelledListener = listenToRideCancelledByDriverEvent(rideId, (event) => {
      console.log(`Ride ${event.args[0]} has been cancelled by the driver. Reason: ${event.args[1]}`);
      setStatus(3);
    });

    // return () => {
    //   if (rideStartedListener) rideStartedListener();
    //   if (rideCompletedListener) rideCompletedListener();
    //   if (rideCancelledListener) rideCancelledListener();
    // };
  }, [rideId]);

  if (!rideInfo) {
    return <div>Loading...</div>;
  }

  const handleMessageClick = () => {
    if (message.trim() !== '') {
      console.log(`Sending message: ${message}`);
      alert(`Message sent: ${message}`);
      setMessage('');
    } else {
      alert('Please enter a message before sending.');
    }
  };

  const handleCallClick = () => {
    if (rideInfo && rideInfo.acceptedBid && rideInfo.acceptedBid.driver) {
      window.location.href = `tel:${rideInfo.customer.contactDetails}`;
    } else {
      alert("Driver contact information not available");
    }
  };

  const handleSafetyClick = () => {
    console.log("Sending data to police");
    alert("Emergency services have been notified. Help is on the way.");
    // Implement actual emergency service notification here
  };

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleReportIssue = () => {
    console.log("Reporting issue");
    alert("Your issue has been reported. Our support team will contact you shortly.");
    // Implement actual issue reporting functionality here
  };
  console.log("origin",origin)
  return (
    <div className="ride-sharing-app">
      <LoadScript googleMapsApiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={origin}
          onClick={handleOpenGoogleMaps}
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
          <span className="eta">7 MIN</span>
        </div>
        <div className="driver-details">
          <div className="driver-avatar">
            <img src="/man.png" alt="Driver" />
          </div>
          <div className="driver-meta">
            <div className="driver-name">{rideInfo.customer.name}</div>
            <div className="vehicle-info">
              {/* {rideInfo.acceptedBid.driver.vehicleNumber} - {rideInfo.acceptedBid.driver.vehicleType} */}
              Love care and Respect!!!
              </div>
          </div>
          <div className="driver-rating">4.3★</div>
        </div>
        <input 
          className="message-input" 
          placeholder="Message Your Driver..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="action-buttons">
          <button className="message-button" onClick={handleMessageClick}>
            <MessageSquare className="icon" />
            Message
          </button>
          <button className="call-button" onClick={handleCallClick}>
            <Phone className="icon" />
            Call
          </button>
          <button onClick={handleReportIssue} className="call-button report-issue-button">
        <AlertTriangle className="icon" />
            Report Issue
          </button>
        </div>
      </div>

      <button onClick={handleSafetyClick} className="safety-button">
        SAFETY
      </button>
      <button className="open-map-button" onClick={handleOpenGoogleMaps}>
        Open in Google Maps
      </button>
      
    </div>
  );
};

export default RideSharingApp;
