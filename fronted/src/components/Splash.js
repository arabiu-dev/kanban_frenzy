import React, { useState } from "react";
import SignInUp from "../modals/SingInUp";
import appVid from '../assets/vid.mp4'
import logo from "../assets/logo-mobile.svg";
import "../styles/Splash.css";

export default function Splash() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [type, setType] = useState("");

  return (
    <div className="board-empty full">
      <video
      src={appVid}
      type="video/mp4"
      loop
      controls={false}
      muted
      autoPlay
      className="video"
      />
      <div className="center">
      <div className="logo-con">
      <img className="logo-splash" src={logo} alt="logo" />
      <h1 className="frenzy">Frenzy</h1>
      </div>
      <h3 className="board-empty-text desc" style={{color: "#23395d", fontWeight:"700"}}>
        A continuous flow of work through visualizing, limiting, and improving work processes.
      </h3>
      <div className="sign-btns">
      <button
        onClick={() => {
          setType("signin")
          setIsBoardModalOpen(true);
        }}
        className="add-column-btn pad"
      >
        Sign In
      </button>
      <button
        onClick={() => {
          setType("signup")
          setIsBoardModalOpen(true);
        }}
        className="add-column-btn pad"
      >
        Sign Up
      </button>
      </div>
      {isBoardModalOpen && <SignInUp type={type} setIsBoardModalOpen={setIsBoardModalOpen} />}
      </div>
    </div>
  );
}
