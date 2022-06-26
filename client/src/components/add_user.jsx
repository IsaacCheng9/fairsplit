import React, { useState, createRef } from "react";
import "../styles/add_user.css";

function Add_user(props) {
  // Reactive variables to store element classes, allowing for dynamic styling
  let [transitionClass, setTransitionClass] = useState("add-user-plus");
  let [crossClass, setCrossClass] = useState("add-user-plus");
  let [picClass, setPicClass] = useState("add-user-pic");
  let [inputClass, setInputClass] = useState("add-user-input");
  let [inputValue, setInputValue] = useState("");

  // Create reference to input element to add focus when rendered
  let inputRef = createRef();

  return (
    <div className="add-user-container">
      <div className={picClass}></div>
      <input ref={inputRef} className={inputClass} type="text"></input>
      <div className={transitionClass}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Frame 1">
            <g id="cross" className={crossClass}>
              <line
                id="y-line"
                x1="50.5"
                y1="15"
                x2="50.5"
                y2="86"
                stroke="black"
                strokeWidth="4"
              />
              <line
                id="x-line"
                x1="14"
                y1="49.5"
                x2="85"
                y2="49.5"
                stroke="black"
                strokeWidth="4"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Add_user;
