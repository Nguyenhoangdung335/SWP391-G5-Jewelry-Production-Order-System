import React from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
export default function ResetPassword() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  const handleNext = () => {
    navigate("/otp");
  };
  return (
    <div className="flex justify-center items-center py-32">
      <div className="bg-bg_form flex flex-col  w-[30%] px-10 py-6 rounded-[40px] ">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form>
          <div className="mb-8">
            <input
              type="email"
              placeholder="Email"
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
  );
}
