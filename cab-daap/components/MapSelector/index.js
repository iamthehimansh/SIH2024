"use client"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const MapSelector = ({center, setCenter, markerPosition, setMarkerPosition}) => {
  
  const [zoom, setZoom] = useState(18);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8', // Replace with your actual API key
    libraries: ['places'],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
      setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
      console.log(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  return (
    <div>
      {isLoaded && (
        <div>
          <GoogleMap
            mapContainerStyle={{ height: '450px', width: '100%' }}
            center={center}
            zoom={zoom}
            onClick={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setMarkerPosition({ lat, lng });
            }}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: false,
            }}
            onZoomChanged={(e) => {
              // setZoom(e.zoom);
              console.log(e);
            }}
          >
            {markerPosition && <Marker position={markerPosition} />}

            {/* reset button */}
            <button style={{position: "absolute", bottom: "15px", right: "2px",color:"white",display:"flex",alignItems:"center"}} id='reset-button' className='flex items-center text-white bg-blue-500 px-4 py-2 rounded-md' onClick={() => {
              navigator.geolocation.getCurrentPosition((position) => {
                setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                setMarkerPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
                  setZoom(15);
              });
            }}>
             {/* location icon */}
             <span className="text-white ">Current Location</span>
             
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
              </button>
          </GoogleMap>
          
        </div>
        
      )}
     
    </div>
  );
};
export default MapSelector;