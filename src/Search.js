import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const Search = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleReset = () => {
    setSearchTerm("");
    handleSearch("");
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div className="search-container">
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
      <input
        type="text"
        placeholder="Search orders"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchTerm && (
        <button className="reset-button" onClick={handleReset}>
          <FontAwesomeIcon icon={faTimes} className="reset-icon" />
        </button>
      )}
    </div>
  );
};

export default Search;
