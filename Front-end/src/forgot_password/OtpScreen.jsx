import React from 'react'
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
export default function OtpScreen() {
    const navigate = useNavigate();

    const handleBack = () => {
      navigate("/reset_password");
    };
  
    const handleNext = () => {
      navigate("/new_password");
    };
  return (
    <div className="flex justify-center items-center py-32">
      <div className="bg-bg_form flex flex-col  w-[30%] px-10 py-6 rounded-[40px] ">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
        <form>
          <div className="mb-8">
            <input
              type="number"
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 mx-10">
            <button
              type="button"
              onClick={handleBack}
              className="bg-bg_button flex flex-row items-center justify-center  border-2 border-black rounded-xl   py-2 px-4"
            >
              <RiArrowLeftLine size={20} /> <p>Back</p>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-bg_button flex flex-row items-center justify-center  border-2 border-black rounded-xl   py-2 px-4"
            >
              <p>Next</p> <RiArrowRightLine size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
