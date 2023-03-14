import React, { useState, useEffect } from "react";
import MRPData from "./MRPData";
import LegacyData from "./LegacyData";
import Search from "./Search";
import DateFilter from "./DateFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    if (password === "030597Isa") {
      setIsLoggedIn(true);
      localStorage.setItem("lastLogin", Date.now());
    } else {
      alert("Incorrect password!");
    }
  };

  useEffect(() => {
    const lastLogin = localStorage.getItem("lastLogin");
    if (lastLogin && Date.now() - lastLogin < 3 * 60 * 60 * 1000) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const header = document.querySelector(".header");
      const arrowIcon = document.querySelector(
        ".date-filter-button .expand-arrow",
      );

      if (scrollTop > 0) {
        header.classList.add("scrolled");
        arrowIcon.classList.add("white");
      } else {
        header.classList.remove("scrolled");
        arrowIcon.classList.remove("white");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const isDateFilterOpenStr = localStorage.getItem("isDateFilterOpen");
    if (isDateFilterOpenStr) {
      setIsDateFilterOpen(JSON.parse(isDateFilterOpenStr));
    }
  }, []);

  const toggleDateFilter = () => {
    setIsDateFilterOpen(!isDateFilterOpen);
    localStorage.setItem("isDateFilterOpen", JSON.stringify(!isDateFilterOpen));
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <header className="header pb-3">
          <div className="container-of-search">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App mb-5">
      <header className="header pb-3 pt-3">
        <div className="container-of-search">
          <Search handleSearch={handleSearch} />
        </div>
        <button className="date-filter-button" onClick={toggleDateFilter}>
          <FontAwesomeIcon
            icon={faAngleDown}
            className={`expand-arrow ${
              isDateFilterOpen ? "rotate-down" : "rotate-up"
            }`}
          />
        </button>
        {isDateFilterOpen && (
          <DateFilter
            setFromDate={setFromDate}
            setToDate={setToDate}
            isDateFilterOpen={isDateFilterOpen}
          />
        )}
      </header>
      <main className="pt-3">
        <MRPData
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fromDate={fromDate}
          toDate={toDate}
        />
        {/* Uncomment the following line to render the LegacyData component /}
{/ <LegacyData
       searchQuery={searchQuery}
       setSearchQuery={setSearchQuery}
       fromDate={fromDate}
       toDate={toDate}
     /> */}
      </main>
    </div>
  );
}

export default App;
