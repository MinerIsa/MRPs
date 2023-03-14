import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import "./MRPData.css";
import MRPHeader from "./MRPHeader";
import InfiniteScroll from "react-infinite-scroll-component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";

const Product = ({ product, quantity, price }) => {
  return (
    <tr>
      <td style={{ wordBreak: "break-word" }}>{product}</td>
      <td>{quantity}</td>
      <td>${price.toFixed(2)}</td>
    </tr>
  );
};

// const spreadsheetId = "1HdJ-aVaYejXXnp03w52tYRaEmAbopbogWcAUu69KMFs";
// const sheetName = "Sheet1";
// const range = "A1:F"; // the range of cells to retrieve
// const apiKey = "AIzaSyAKCEeBePyebPS9TiHwf7Vvs4kE0Zniapk";
// const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey}`;

const MRPData = ({ searchQuery, fromDate, toDate }) => {
  const [data, setData] = useState([]);
  const [expandedCards, setExpandedCards] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(-1);

  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8q2hxPf8MgLTReI2_uAzHwjBwI9mAbnJ2S9LGp0B5kvUNdIKj81EaMmMrGecIfpyROqIeIRmj63YW/pub?output=csv",
        );
        const text = response.data;
        const result = Papa.parse(text, { header: true });
        const orders = result.data.filter(
          (order) => parseFloat(order.Total) > 0,
        );
        setData(orders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000); // fetch data every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const toggleCard = (index) => {
    setExpandedCards((prevExpandedCards) => {
      const isExpanded = prevExpandedCards.includes(index);
      const newExpandedCards = isExpanded
        ? prevExpandedCards.filter((i) => i !== index)
        : [...prevExpandedCards, index];
      return newExpandedCards;
    });

    if (expandedCardIndex === index) {
      setExpandedCardIndex(-1);
    } else {
      setExpandedCardIndex(index);
    }
  };

  const isCardExpanded = (index) => expandedCards.includes(index);

  const displayCards = () => {
    const filteredData = data.filter(
      (order) =>
        Object.values(order).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ) &&
        (fromDate === "" || order.Created >= fromDate) &&
        (toDate === "" || order.Created <= toDate + 86400),
    );

    const uniqueOrders = [];
    const uniqueData = [];

    filteredData.forEach((order) => {
      const index = uniqueOrders.indexOf(order.Order);
      if (index === -1) {
        uniqueOrders.push(order.Order);
        uniqueData.push([order]);
      } else {
        uniqueData[index].push(order);
      }
    });

    const reversedData = uniqueData.reverse();

    // calculate sum of all Totals
    const sumOfTotals = filteredData.reduce((acc, order) => {
      const total = order.Total.replace(/,/g, "");
      return acc + parseFloat(total);
    }, 0);

    // get three Customers with highest Totals
    const customersByTotal = filteredData.reduce((acc, order) => {
      const customer = order.Customer;
      const total = parseFloat(order.Total.replace(/,/g, ""));
      if (!acc[customer]) {
        acc[customer] = total;
      } else {
        acc[customer] += total;
      }
      return acc;
    }, {});

    const sortedCustomers = Object.entries(customersByTotal)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [customer, total]) => {
        if (!acc.includes(customer)) {
          acc.push(customer);
        }
        return acc;
      }, [])
      .slice(0, 3);

    // number of orders displayed
    const numOrdersDisplayed = filteredData.length;

    return (
      <div>
        <div style={{ maxWidth: "800px", margin: "15px auto" }}>
          <MRPHeader
            sumOfTotals={sumOfTotals}
            sortedCustomers={sortedCustomers}
            numOrdersDisplayed={numOrdersDisplayed}
          />
        </div>
        <div className="container">
          {reversedData.map((orders, index) => {
            const { Customer, Total, Order, Created } = orders[0];

            const isExpanded = isCardExpanded(index);

            const arrowClasses = isExpanded
              ? "rotate-down"
              : "rotate-up d-none";

            // Convert epoch time to readable date
            const createdDate = new Date(Created * 1000);

            const formattedDate = createdDate.toLocaleString();

            const productData = orders.reduce((acc, order) => {
              const products = order.SKU.split(",");
              const quantities = order.Quantity.split(",");
              const prices = order.Price.split(",");

              products.forEach((product, index) => {
                if (!acc[product]) {
                  acc[product] = {
                    quantity: parseFloat(quantities[index]),

                    price: parseFloat(prices[index]),
                  };
                } else {
                  acc[product].quantity += parseFloat(quantities[index]);
                  acc[product].price += parseFloat(prices[index]);
                }
              });
              return acc;
            }, {});

            return (
              <div
                className="card"
                key={index}
                id={`card-${index}`}
                onClick={() => toggleCard(index)}
              >
                <h3 style={{ textDecoration: "underline" }}>{Customer}</h3>
                <p className="text-muted mb-1">
                  {Created ? formattedDate : ""}
                </p>
                <div
                  className="row text-center p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="col total-order unclickable">
                    <h4 className="">
                      <b className="text-success">${Total}</b>
                    </h4>
                  </div>
                  <div className="col total-order unclickable">
                    <b style={{ color: "#3B71CA" }}>{Order}</b>
                  </div>
                </div>

                <div className="expand-arrow-container">
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className={`expand-arrow ${
                      isCardExpanded(index) ? "rotate-down" : "rotate-up"
                    }`}
                  />
                </div>
                <div className="table-div p-3">
                  <table
                    className={`card-body table table-bordered ${
                      isCardExpanded(index) ? "" : "d-none"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <thead>
                      <tr>
                        <th style={{ wordBreak: "break-word" }}>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(productData).map((product, index) => (
                        <Product
                          key={index}
                          product={product}
                          quantity={productData[product].quantity}
                          price={productData[product].price}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return data.length > 0 ? displayCards() : <div>Loading...</div>;
};

export default MRPData;
