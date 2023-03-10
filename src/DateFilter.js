import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const DateFilter = ({ setFromDate, setToDate, isDateFilterOpen }) => {
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");

  const handleFromDateChange = (event) => {
    setFromDateInput(event.target.value);
    setFromDate(new Date(event.target.value).getTime() / 1000);
  };

  const handleToDateChange = (event) => {
    setToDateInput(event.target.value);
    setToDate(new Date(event.target.value).getTime() / 1000);
  };

  return (
    <div
      className={`form-group row date-div text-center date-filter-container ${
        isDateFilterOpen ? "date-filter-expand" : ""
      }`}
    >
      <label htmlFor="from-date" className="col-sm-2 col-form-label">
        From Date:
      </label>
      <div className="col">
        <input
          type="date"
          className="form-control"
          id="from-date"
          value={fromDateInput}
          onChange={handleFromDateChange}
        />
      </div>
      <label htmlFor="to-date" className="col-sm-2 col-form-label">
        To Date:
      </label>
      <div className="col">
        <input
          type="date"
          className="form-control"
          id="to-date"
          value={toDateInput}
          onChange={handleToDateChange}
        />
      </div>
      <div className="expand-arrow-container">
        <FontAwesomeIcon
          filterIcon={isDateFilterOpen ? faChevronUp : faChevronDown}
          className={`expand-arrow ${isDateFilterOpen ? "rotate" : ""}`}
        />
      </div>
    </div>
  );
};

export default DateFilter;
