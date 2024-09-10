"use client";

import React, { useState} from 'react'
import Search from '@/components/Search'
import MapSelector from '@/components/MapSelector'
import CabList from '@/components/CabList'

export default function Go() {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default center
  const [markerPosition, setMarkerPosition] = useState({lat: 0, lng:0});
  const [destination, setDestination] = useState({
    lat:28.612894,
    lng:77.229446
  });
  return (
    <main >
      <div className="relative">
      <div className="absolute inset-0 ">
        <Search center={center} setCenter={setCenter} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} setDestination={setDestination} destination={destination}/>
      </div>
      <MapSelector center={center} setCenter={setCenter} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} />

      </div>
      <CabList markerPosition={markerPosition} destination={destination} />
    </main>
  )
}
