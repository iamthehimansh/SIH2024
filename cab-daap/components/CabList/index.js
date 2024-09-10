"use client"
import Link from 'next/link';
import { useState } from 'react';

const CabList = ({markerPosition, destination}) => {
  const [cabList, ] = useState([
{
  type: "bike",
  image: "/bike.jpg",
  eta: "10 mins",
  maxUsers: 1,
},{
  type: "sedan",
  image: "/sedan.png",
  eta: "2 mins",
  maxUsers: 4,
},
{
  type: "suv",
  image: "/suv.png",
  eta: "5 mins",
    maxUsers: 4,
  },{
    type: "Prime",
    image: "/prime.png",
    eta: "5 mins",
      maxUsers: 6,
    },
  {
    type:"auto",
    image: "/auto.svg",
    eta: "10 mins",
    maxUsers: 3,
  },{
    type:"tuktuk",
    image: "/tuktuk.svg",
        eta: "10 mins",
        maxUsers: 4,
    }
  ]);
  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
      {cabList.map((cab, index) => (
        <div key={index} className="flex items-center bg-white p-4 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
          <img src={cab.image} alt={cab.type} className="w-16 h-16 object-fit rounded-full mr-4" />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold capitalize">{cab.type}</h3>
            <p className="text-sm text-gray-600">ETA: {cab.eta}</p>
            <p className="text-sm text-gray-600">Max Users: {cab.maxUsers}</p>
          </div>
          <Link
          href={`/Go/Watting?cab=${cab.type}&flat=${markerPosition?.lat || ''}&flng=${markerPosition?.lng || ''}&dflat=${destination?.lat || ''}&dflng=${destination?.lng || ''}&destination=${destination}`}
          // href={`/Go/Watting?cab=${cab.type}&flat=${markerPosition.lat}&flng=${markerPosition.lng}&dflat=${destination?.lat}&dflng=${destination?.lng}&destination=${destination}`}  
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
            Book
          </Link>
        </div>
      ))}
    </div>
  )
}


export default CabList;
  