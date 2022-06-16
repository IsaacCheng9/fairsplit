import React from "react";
import arrow from "../assets/arrow.svg";
import "../styles/App.css";
import GroupExpenses from "../components/GroupExpenses";

// Temporary group to display component data
let group = {
  name: "4 Portal Road",
  balance: 24,
  currency: "£",
};

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="title">SplitWise</h1>
        <a href={"#"} className="sign-in">
          Sign in
          <img className="arrow" src={arrow} />
        </a>
      </div>

      <div className="bg-container">
        <div className="bg-element bg-top-left"></div>
        <div className="bg-element bg-top-center"></div>
        <div className="bg-element bg-top-right"></div>
        <div className="bg-element bg-left"></div>
        <div className="bg-element bg-center"></div>
        <div className="bg-element bg-right"></div>
      </div>

      <GroupExpenses value={group}></GroupExpenses>
    </div>
  );
}

export default App;
