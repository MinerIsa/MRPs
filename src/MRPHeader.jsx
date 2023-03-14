import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const MRPHeader = ({ sumOfTotals, sortedCustomers, numOrdersDisplayed }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="row mb-3">
      <div className="col-sm-4">
        <b>Sum of all Totals:</b> ${sumOfTotals.toLocaleString()}
      </div>
      <div className="col-sm-4 clickable" onClick={toggleExpand}>
        <b>
          Top 3 Customers by Total
          <FontAwesomeIcon
            icon={isExpanded ? faAngleDown : faAngleRight}
            style={{ marginLeft: "5px" }}
          />
        </b>
        {isExpanded && (
          <ul>
            {sortedCustomers.map((customer) => (
              <li key={customer}>{customer}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-sm-4">
        <b>Number of orders displayed:</b> {numOrdersDisplayed}
      </div>
    </div>
  );
};

export default MRPHeader;
