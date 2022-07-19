import React, { useState, createRef } from "react";
import "../styles/add_user.css";

function AddUser(props) {
  // Reactive variables to store element classes, allowing for dynamic styling
  let [transitionClass, setTransitionClass] = useState("add-user-plus");
  let [crossClass, setCrossClass] = useState("add-user-plus");
  let [picClass, setPicClass] = useState("add-user-pic");
  let [inputClass, setInputClass] = useState("add-user-input");
  let [inputValue, setInputValue] = useState("");

  // Create reference to input element to add focus when rendered
  let inputRef = createRef();

  function handleChange(event) {
    // Update the state with the new value
    setInputValue(event.target.value);
    const inputLen = event.target.value.length;

    // Alter styling based on state of input by adding/removing classes
    if (inputLen > 0) {
      setCrossClass("");
    } else if (!inputLen) {
      setCrossClass("cross-rotate");
    }
  }

  // Handle dynamic styling when the user wants to add a user
  function addTransformClass() {
    // Removes classes when user is added or the user cancels the action
    if (transitionClass.includes("clicked")) {
      if (inputValue.length > 0) {
        // Pushes new user to parent component
        props.onClick(inputValue);
        setInputValue("");
      }
      setInputClass("add-user-input");
      setTransitionClass("add-user-plus");
      setCrossClass("add-user-plus");
      setPicClass("add-user-pic");
    } else {
      // Add classes that will animate the add user button
      setTransitionClass(
        transitionClass + " add-user-plus-clicked x-rotate y-rotate"
      );

      // Add class that will animate the cross SVG icon on the add user button
      setCrossClass("cross-rotate");
      // Add classes that will fade in the profile picture and input
      setPicClass(picClass + " add-user-pic-clicked");
      setInputClass(inputClass + " add-user-input-clicked");
      // Add focus to the input element
      inputRef.current.focus();
    }
  }

  return (
    <div className="add-user-container">
      <div className={picClass}></div>
      <input
        value={inputValue}
        onChange={handleChange}
        ref={inputRef}
        className={inputClass}
        type="text"
      ></input>
      <div className={transitionClass} onClick={addTransformClass}>
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

export default AddUser;
