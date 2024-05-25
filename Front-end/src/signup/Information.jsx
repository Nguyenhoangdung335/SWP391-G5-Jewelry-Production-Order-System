import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Information() {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center py-32">
      <div className="bg-bg_form flex flex-col w-[30%] px-10 py-6 rounded-[40px] ">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Input information
        </h2>
        <form onSubmit={handleSubmit} >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">First Name:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Date of birth:</label>
            <input
              type="date"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4 flex flex-row items-center gap-10">
            <label className=" text-gray-700 mb-1">Gender:</label>
            <div className="flex items-center">
              <input type="radio" name="gender" value="male" className="mr-2" />
              <label className="mr-4">Male</label>
              <input
                type="radio"
                name="gender"
                value="female"
                className="mr-2"
              />
              <label>Female</label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Phone:</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 mb-1">Address:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="w-[70%] py-2 px-4 bg-bg_button text-black font-semibold rounded-xl hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
