import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const DateFilter = ({
  setFromDate,
  setToDate,
  isDateFilterOpen,
  isHeaderWhite,
}) => {
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");

  const handleScroll = () => {
    const button = document.querySelector(".reset-button-white");
    if (button) {
      if (window.scrollY > 0) {
        button.classList.add("scrolled");
      } else {
        button.classList.remove("scrolled");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Load fromDate and toDate from localStorage on mount
  useEffect(() => {
    const fromDate = localStorage.getItem("fromDate");
    const toDate = localStorage.getItem("toDate");
    if (fromDate) {
      setFromDate(fromDate);
      setFromDateInput(new Date(fromDate * 1000).toISOString().slice(0, 10));
    }
    if (toDate) {
      setToDate(toDate);
      setToDateInput(new Date(toDate * 1000).toISOString().slice(0, 10));
    }

    // Clear fromDate and toDate from localStorage on refresh
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("fromDate");
        localStorage.removeItem("toDate");
      });
    };
  }, []);

  const handleFromDateChange = (event) => {
    setIsDirty(true);
    const value = event.target.value;
    setFromDateInput(value);
    setFromDate(new Date(value).getTime() / 1000);
    localStorage.setItem("fromDate", new Date(value).getTime() / 1000);
  };

  const handleToDateChange = (event) => {
    setIsDirty(true);
    const value = event.target.value;
    setToDateInput(value);
    setToDate(new Date(value).getTime() / 1000);
    localStorage.setItem("toDate", new Date(value).getTime() / 1000);
  };

  const handleReset = () => {
    setFromDate("");
    setFromDateInput("");
    setToDate("");
    setToDateInput("");
    localStorage.removeItem("fromDate");
    localStorage.removeItem("toDate");
    setIsDirty(false);
    setSelectedRange("");
  };

  const handleDateRangeChange = (range) => {
    setIsDirty(true);
    setSelectedRange(range); // Update the selected date range
    const today = new Date().toISOString().slice(0, 10);
    const thisWeek = new Date();
    const lastWeek = new Date(
      thisWeek.getFullYear(),
      thisWeek.getMonth(),
      thisWeek.getDate() - 7,
    );
    const firstDayOfWeek = thisWeek.getDate() - thisWeek.getDay();
    const lastDayOfWeek = firstDayOfWeek + 6;
    const startDateOfWeek = new Date(thisWeek.setDate(firstDayOfWeek))
      .toISOString()
      .slice(0, 10);
    const endDateOfWeek = new Date(thisWeek.setDate(lastDayOfWeek))
      .toISOString()
      .slice(0, 10);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const thisQuarter = Math.floor(new Date().getMonth() / 3) + 1;
    const yearToDate = new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .slice(0, 10);
    switch (range) {
      case "today":
        setFromDateInput(today);
        setToDateInput(today);
        setFromDate(new Date(today).getTime() / 1000);
        setToDate(new Date(today).getTime() / 1000);
        localStorage.setItem("fromDate", new Date(today).getTime() / 1000);
        localStorage.setItem("toDate", new Date(today).getTime() / 1000);
        break;
      case "this-week":
        setFromDateInput(startDateOfWeek);
        setToDateInput(endDateOfWeek);
        setFromDate(new Date(startDateOfWeek).getTime() / 1000);
        setToDate(new Date(endDateOfWeek).getTime() / 1000);
        localStorage.setItem(
          "fromDate",
          new Date(startDateOfWeek).getTime() / 1000,
        );
        localStorage.setItem(
          "toDate",
          new Date(endDateOfWeek).getTime() / 1000,
        );
        break;
      case "last-week":
        setFromDateInput(lastWeek.toISOString().slice(0, 10));
        setToDateInput(today);
        setFromDate(
          new Date(lastWeek.toISOString().slice(0, 10)).getTime() / 1000,
        );
        setToDate(new Date(today).getTime() / 1000);
        localStorage.setItem(
          "fromDate",
          new Date(lastWeek.toISOString().slice(0, 10)).getTime() / 1000,
        );
        localStorage.setItem("toDate", new Date(today).getTime() / 1000);
        break;
      case "this-month":
        setFromDateInput(thisMonth + "-01");
        setToDateInput(today);
        setFromDate(new Date(thisMonth + "-01").getTime() / 1000);
        setToDate(new Date(today).getTime() / 1000);
        localStorage.setItem(
          "fromDate",
          new Date(thisMonth + "-01").getTime() / 1000,
        );
        localStorage.setItem("toDate", new Date(today).getTime() / 1000);
        break;
      case "this-quarter":
        const quarterStartMonth = (thisQuarter - 1) * 3;
        const quarterStartDate = new Date(
          new Date().getFullYear(),
          quarterStartMonth,
          1,
        )
          .toISOString()
          .slice(0, 10);
        setFromDateInput(quarterStartDate);
        setToDateInput(today);
        setFromDate(new Date(quarterStartDate).getTime() / 1000);
        setToDate(new Date(today).getTime() / 1000);
        localStorage.setItem(
          "fromDate",
          new Date(quarterStartDate).getTime() / 1000,
        );
        localStorage.setItem("toDate", new Date(today).getTime() / 1000);
        break;
      case "year-to-date":
        setFromDateInput(yearToDate);
        setToDateInput(today);
        setFromDate(new Date(yearToDate).getTime() / 1000);
        setToDate(new Date(today).getTime() / 1000);
        localStorage.setItem("fromDate", new Date(yearToDate).getTime() / 1000);
        localStorage.setItem("toDate", new Date(today).getTime() / 1000);
        break;
      default:
        break;
    }

    // Set active button
    const buttons = document.querySelectorAll(".date-range-button");
    buttons.forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-range") === range) {
        button.classList.add("active");
      }
    });
  };

  // Use the isDirty state to decide whether to update fromDate and toDate
  if (!isDirty && !isDateFilterOpen) {
    return null;
  }

  return (
    <div className="">
      <div className="form-group row date-div text-center date-range-container">
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleReset()}
            data-range=""
          >
            All time
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleDateRangeChange("today")}
            data-range="today"
          >
            Today
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleDateRangeChange("this-week")}
            data-range="this-week"
          >
            This Week
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleDateRangeChange("last-week")}
            data-range="last-week"
          >
            Last Week
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleDateRangeChange("this-month")}
            data-range="this-month"
          >
            This Month
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleDateRangeChange("this-quarter")}
            data-range="this-quarter"
          >
            This Quarter
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-link date-range-button"
            onClick={() => handleDateRangeChange("year-to-date")}
            data-range="year-to-date"
          >
            Year-to-Date
          </button>
        </div>
      </div>
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
        <div className="col-1 d-flex align-items-center justify-content-center">
          <button
            className={`date-reset-button reset-button-white ${
              !fromDateInput && !toDateInput ? "reset-button-disabled" : ""
            }`}
            onClick={handleReset}
            disabled={!fromDateInput && !toDateInput}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <FontAwesomeIcon
          filterIcon={isDateFilterOpen ? faChevronUp : faChevronDown}
          className={`expand-arrow ${isDateFilterOpen ? "rotate" : ""}`}
        />
      </div>
    </div>
  );
};
export default DateFilter;
