import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex justify-center items-center py-32">
      <div className="bg-bg_form flex flex-col  w-[30%] px-10 py-6 rounded-[40px] ">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Username:</label>
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
              className="w-full px-3 py-2 border-2 border-black rounded-xl  focus:outline-none focus:border-blue-500"
            />
            <div className="text-right mt-1">
              <Link to="/reset_password" className="text-sm text-gray-600 hover:underline">
                Forget password
              </Link>
            </div>
          </div>
          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              className="w-[70%]  border-2 border-black rounded-xl  items-center py-2 px-4 bg-bg_button text-black   hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-center text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
