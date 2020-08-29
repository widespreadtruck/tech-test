import React, { useEffect, useState } from "react";
import Plot from 'react-plotly.js';

const conversions = {
  "CAD_BTC": 0.00006616,
  "BTC_CAD": 15114.33,
  "CAD_ETH": 0.001889015202040959,
  "ETH_CAD": 529.37,
  "USD_BTC": 0.00008666,
  "BTC_USD": 11539.11,
  "USD_ETH": 0.00247429822716532,
  "ETH_USD": 404.15,
  "BTC_ETH": 28.551034975017846,
  "ETH_BTC": 0.035025,
  "CAD_USD": 0.76,
  "USD_CAD": 1.3
};

function App() {
  const [dataArr, setDataArr] = useState([]);
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);



  const getData = async () => {
    const url = `https://shakepay.github.io/programming-exercise/web/transaction_history.json`;

    try {
      const getResponse = await fetch(url);
      const data = await getResponse.json();
      const dataReversed = data.reverse();
      setDataArr(dataReversed);
      
    } catch (e) {
      console.log(e);
    }
  };

  console.log("Initial data array:", dataArr);



  
    const groupedData = {};

    dataArr.map(obj => {
      const date = obj.createdAt.split('T')[0];
      let convAmt = 0;

      if (obj.type === "peer") {
        switch (obj.currency) {
          case 'BTC':
            convAmt = obj.amount * conversions.BTC_CAD;
            break;
          case 'ETH':
            convAmt = obj.amount * conversions.ETH_CAD;
            break;
          default:
            convAmt = obj.amount;
            break;
        };

        if (groupedData[date] !== undefined) {
          groupedData[date].push({
            convAmt,
            direction: obj.direction,
            type: obj.type,
          });
        } else {
          groupedData[date] = [];
          groupedData[date].push({
            convAmt,
            direction: obj.direction,
            type: obj.type,
          });
        }
      };




      if (obj.type === "conversion") {
        switch (obj.to.currency) {
          case 'BTC':
            convAmt = obj.to.amount * conversions.BTC_CAD;
            break;
          case 'ETH':
            convAmt = obj.to.amount * conversions.ETH_CAD;
            break;
          default:
            convAmt = obj.to.amount;
            break;
        };

        if (groupedData[date] !== undefined) {
          groupedData[date].push({
            convAmt,
            direction: 'credit',
            type: obj.type,
          });
        } else {
          groupedData[date] = [];
          groupedData[date].push({
            convAmt,
            direction: 'credit',
            type: obj.type,
          });
        }
      };




      if (obj.type === "external account") {
        switch (obj.currency) {
          case 'BTC':
            convAmt = obj.amount * conversions.BTC_CAD;
            break;
          case 'ETH':
            convAmt = obj.amount * conversions.ETH_CAD;
            break;
          default:
            convAmt = obj.amount;
            break;
        };

        if (groupedData[date] !== undefined) {
          groupedData[date].push({
            convAmt,
            direction: obj.direction,
            type: obj.type,
          });
        } else {
          groupedData[date] = [];
          groupedData[date].push({
            convAmt,
            direction: obj.direction,
            type: obj.type,
          });
        }
      };
    });
  
    const finalConversion = {};
  
    Object.keys(groupedData).map(date => {
      // console.log(groupedData[date]);
      if (finalConversion[date] === undefined) {
        finalConversion[date] = 0;
      }
      groupedData[date].forEach(trn => {
        switch (trn.direction) {
          case 'debit':
            finalConversion[date] -= trn.convAmt;
            break;
          case 'credit':
            finalConversion[date] += trn.convAmt;
            break;
          default:
            break;
        }
      });
    })
  
    // console.log(groupedData);
    // console.log(finalConversion);
  
    const arrX = Object.keys(finalConversion);
    
    const arrY = Object.values(finalConversion)
    let newArrY = [0];
  
    for ( let i = 0; i < arrY.length; i++) {
      newArrY.push(arrY[i] + newArrY[i])
    };
    newArrY.shift();
    console.log("X axis values:",arrX);
    console.log("Y axis values:",newArrY);
    
    
    // console.log(xValues, yValues);
    
      // setXValues(arrX);
      // setYValues(newArrY)

  useEffect( ()=>{
    getData();
  }, [])




  return (
    <Plot
      data={[
        {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: '#009FFF' },
        },
      ]}
      layout={{ width: 1100, height: 540, title: 'Balance over time' }}
    />
  );
}

export default App;
