import React from "react";
import { Link } from "react-router-dom";
import { IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
export default function Footer() {
  return (
    <div className="bg-[#4B4B4B] w-full py-12 px-28 grid grid-cols-2 gap-36">
      <div className="grid grid-cols-2 col-span-1 gap-8 ">
        <div className="col-span-1 flex flex-col gap-4">
          <p className="text-white font-semibold text-2xl">Jewelry Shop</p>
          <p className="text-white font-normal ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="col-span-1 flex flex-col gap-2">
          <p className="text-white font-semibold text-2xl">Quick Link</p>
          <div className="flex flex-col">
            <Link className="text-white font-normal" to="/link-a">
              Link A
            </Link>
            <Link className="text-white font-normal" to="/l ink-b">
              Link B
            </Link>
            <Link className="text-white font-normal" to="/link-c">
              Link C
            </Link>
            <Link className="text-white font-normal" to="/link-d">
              Link D
            </Link>
            <Link className="text-white font-normal" to="/link-e">
              Link E
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 col-span-2 flex-row  items-center ">
          <div className="col-span-1 flex-col flex gap-2">
            <p className="text-white font-semibold text-2xl">Social Media</p>
            <div className="flex flex-row items-center gap-4 ">
              <IoLogoFacebook color="white" size={30} />
              <FaInstagram color="white" size={30} />
              <FaYoutube color="white" size={30} />
            </div>
          </div>
          <div className="col-span-1">
            <button className="shadow-shadow_header text-xl px-4 py-3 text-white font-semibold  border-4 rounded-full border-solid border-white text-center ">
              Make your own jewelry
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 col-span-1">
        <div className="col-span-1 flex flex-col gap-4">
          <p className="text-white font-semibold text-2xl">Contact us</p>
          <div className="flex flex-col">
            <p className="text-white font-normal">Phone: 607-647-4949</p>
            <p className="text-white font-normal">Gmail: placeholder@gmail.com</p>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <p className="text-white font-semibold text-2xl">Address</p>
          <div>
            <p className="text-white font-normal">1771 Frosty Lane,</p>
            <p className="text-white font-normal">Mcdonugh, </p>
            <p className="text-white font-normal">New Yoir 13801</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex justify-between text-xl  text-white">
        <p className="">Copyright Ⓒ jewelryshop.com 2024.</p>
        <div className="flex gap-10  ">
            <p>Privacy Policy</p>
            <p>Return Policy</p>
            <p>Terms and service</p>
        </div>
      </div>
    </div>
  );
}
