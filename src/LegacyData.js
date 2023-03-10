import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import "./MRPData.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";

const Product = ({ product, quantity, price }) => {
  return (
    <li>
      {product}: <b className="text-dark">{quantity} </b>
      for <b className="text-danger">${price}</b>
    </li>
  );
};

const LegacyData = ({ searchQuery, setSearchQuery }) => {
  const [data, setData] = useState([]);
  const [expandedCards, setExpandedCards] = useState([]);

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
        console.log(orders);
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
  };

  const isCardExpanded = (index) => expandedCards.includes(index);

  const displayCards = () => {
    const filteredData = data.filter((order) =>
      Object.values(order).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
      ),
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

    return (
      <div className="container p-3">
        {/* <div className="">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search orders"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div> */}

        {reversedData.map((orders, index) => {
          const { Customer, Total, Order, Created } = orders[0];

          const isExpanded = isCardExpanded(index);

          const arrowClasses = isExpanded ? "rotate-down" : "rotate-up d-none";

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
              <p className="text-muted mb-1">{Created ? formattedDate : ""}</p>
              <div className="row text-center p-3">
                <div className="col total-order">
                  <h4 className="">
                    <b className="text-success">${Total}</b>
                  </h4>
                </div>
                <div className="col total-order">
                  <b style={{ color: "#3B71CA" }}>{Order}</b>
                </div>
              </div>

              <ul
                className={`card-body ${isCardExpanded(index) ? "" : "d-none"}`}
              >
                <li>
                  <ul>
                    <b>Products:</b>
                    {Object.keys(productData).map((product, index) => (
                      <Product
                        key={index}
                        product={product}
                        quantity={productData[product].quantity}
                        price={productData[product].price}
                      />
                    ))}
                  </ul>
                </li>
              </ul>
              <div className="expand-arrow-container">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`expand-arrow ${
                    isCardExpanded(index) ? "rotate-down" : "rotate-up"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return data.length > 0 ? displayCards() : <div>Loading...</div>;
};

export default LegacyData;
