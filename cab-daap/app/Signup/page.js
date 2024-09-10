"use client";


import React, { useState,useEffect } from 'react'
import {registerUser,initializeContracts} from "@/lib/ContractServices"
import { useRouter } from 'next/navigation';
export default function Signup() {
    const [name, setName] = useState("");
    const [contactDetails, setContactDetails] = useState("");
    const [userType, setUserType] = useState("");
    const router = useRouter();

    useEffect(() => {
      initializeContracts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser(name, contactDetails, Number(userType));
        if(Number(userType) === 0){
            router.push('/Go/');
        }else{
            router.push('/Signup/Rider');
        }
    };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">User registration</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
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
            </div>
            <div>
              <label htmlFor="contactDetails" className="sr-only">
                Contact Details
              </label>
              <input
                id="contactDetails"
                name="contactDetails"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contact Details"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="userType" className="sr-only">
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={userType}
                onChange={(e) => setUserType(Number(e.target.value))}
              >
                <option value="">Select User Type</option>
                <option value="0">User</option>
                <option value="1">Rider</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
