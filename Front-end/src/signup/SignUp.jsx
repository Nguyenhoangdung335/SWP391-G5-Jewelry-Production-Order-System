import React from "react";

import { RiArrowLeftLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/info");
  };
  return (
    <div className="flex justify-center items-center py-32">
      <div className="relative bg-bg_form flex flex-col  w-[30%] px-10 py-6 rounded-[40px]">
        <Link className="absolute" to="/login">
          <RiArrowLeftLine size={30} />
        </Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 mb-1">
              Confirm Password:
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              className="w-[70%]  border-2 border-black rounded-xl  items-center py-2 px-4 bg-bg_button text-black   hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
