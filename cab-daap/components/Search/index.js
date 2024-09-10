"use client"
import { Autocomplete } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import { useCallback } from 'react';

  const Search = ({center, setCenter, markerPosition, setMarkerPosition, setDestination, destination}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8', // Replace with your actual API key
    libraries: ['places'],
  });
  const onPlaceChanged = useCallback(
    (autocomplete) => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setCenter(place.geometry.location);
        setMarkerPosition(place.geometry.location);
        setDestination(place.geometry.location);
      }
    },
    []
  );
  if (!isLoaded) return null;
  return (
    <div style={{backgroundColor: "white",borderRadius: "31px"}} className="sticky top-4 z-20 mx-4 my-4 bg-white">
      <div style={{backgroundColor: "white",borderRadius: "31px"}}   className="bg-white  border border-gray-300 shadow-lg p-2">
      <Autocomplete onPlaceChanged={onPlaceChanged} >
      <input
          type="text"
          placeholder="Where to?"
          className="w-full px-4 py-2 text-lg text-gray-700 bg-transparent outline-none"
          // value={destination}
          // onChange={(e) => {
          //   setDestination(e.target.value);
          // }}
        />
          </Autocomplete>
        
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Search;