import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const CSVData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8q2hxPf8MgLTReI2_uAzHwjBwI9mAbnJ2S9LGp0B5kvUNdIKj81EaMmMrGecIfpyROqIeIRmj63YW/pub?output=csv",
      );
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const { data } = Papa.parse(csv, { header: true });
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.Quantity}</td>
              <td>{row.Price}</td>
              <td>{row.SKU}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVData;
