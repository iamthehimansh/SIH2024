"use client"

  import React, { useState,useEffect } from 'react'
  import { registerDriverDetails,initializeContracts } from "@/lib/ContractServices"
  import { useRouter } from 'next/navigation';

  export default function RiderSignup() {
    // const [name, setName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [insuranceDetails, setInsuranceDetails] = useState("");
    const [licenseDetails, setLicenseDetails] = useState("");
    const router = useRouter();
    useEffect(() => {
      initializeContracts();
    }, []);
    const handleSubmit = async (e) => {
      e.preventDefault();
      await registerDriverDetails(vehicleNumber, vehicleType, insuranceDetails, licenseDetails);
      router.push('/Rider');
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Rider Registration</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              {/* <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div> */}
              <div>
                <label htmlFor="vehicleNumber" className="sr-only">Vehicle Number</label>
                <input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Vehicle Number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="vehicleType" className="sr-only">Vehicle Type</label>
                <input
                  id="vehicleType"
                  name="vehicleType"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Vehicle Type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="insuranceDetails" className="sr-only">Insurance Details</label>
                <input
                  id="insuranceDetails"
                  name="insuranceDetails"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Insurance Details"
                  value={insuranceDetails}
                  onChange={(e) => setInsuranceDetails(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="licenseDetails" className="sr-only">License Details</label>
                <input
                  id="licenseDetails"
                  name="licenseDetails"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="License Details"
                  value={licenseDetails}
                  onChange={(e) => setLicenseDetails(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register as Rider
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }