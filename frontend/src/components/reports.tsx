import React, { useState } from "react";

import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'

import { UserDataContextType } from "../Types";
import { UserDataContext } from "./contexts/userDataContext";

import { Bar } from "react-chartjs-2";
ChartJS.register(...registerables);
const Data = [
    {
      userGain: 0,
    },
    {
      userGain: 0,
    },
  ];

const getenv = require('getenv');
const url = getenv.string('REACT_APP_API');
  
const Reports = (props) => {

    const { authToken, userId } = React.useContext(UserDataContext) as UserDataContextType;
    const colorArr = [
      "#5e738b", // Slate Blue
      "#8d8676", // Taupe Gray
      "#7d8491", // Blue Gray
      "#a09fad", // Ash Gray
      "#7c8f8f", // Dark Slate Gray
      "#848482", // Battleship Gray
      "#768080", // Grayish Blue
      "#6d7f7d", // Cadet Blue
      "#738276", // Pewter Blue
      "#6f7d7d", // Gray Olive
      "#727f76", // Sage Gray
      "#757d74"  // Slate Gray
      // Add more colors as needed
    ];
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    today.toDateString()
    
    const [from, setFrom] = useState(getFormattedDate(thirtyDaysAgo));
    const [to, setTo] = useState(getFormattedDate(today));
    const [totalRoundCount, setTotalRoundCount] = useState(0);

    React.useEffect(() => {
        if (from > to) {
            const oldTo = to;
            setTo(from);
            setFrom(oldTo);
        }
        fetch(url + '/range/getDateAndAmmoReport?user_id='+encodeURIComponent(userId as string)+'&date_done=2024-01-01&date_from=' + from +'&date_to=' + to, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + authToken
            }})
        .then((response) => response.json())
        .then((data) => {
          // this is ugly, but using data.map was causing duplicate ammo types to be added
          const label_map: { [key: string]: number } = {};
          for (var i = 0; i < data.length; i++) {
            label_map[data[i].date.split("T")[0]] = 0;
          }
          const labels = Object.keys(label_map);

          const ammo_types_map: { [key: string]: number } = {};
          for (var i = 0; i < data.length; i++) {
            ammo_types_map[data[i].ammo_name[0]] = 0;
          }

          const ammo_types: string[] = [];
          for (var key in ammo_types_map) {
            ammo_types.push(key);
          }

          var roundCount = 0;
          for (var i=0; i<data.length; i++) {
            roundCount += data[i].count;
          }

          setTotalRoundCount(roundCount);

          // we now have unique dates (labels) and unique ammo types
          // we need to create a dataset for each ammo type
          // each dataset needs to have a data array with the same length as the labels array

          var datasetvals = [] as any[];
          for (var j = 0; j < ammo_types.length; j++) {
            var dataset = {label: ammo_types[j], data: [] as number[], backgroundColor: [
                  colorArr[j],
                ],
                color: "black",
                borderColor: "black",
                borderWidth: 2};
          
            for (var i = 0; i < labels.length; i++) {
              var ammo_count = 0;
              // we could have multiple "date" entries for the same date and ammo type
              // this needs to be fixed at the query level but this also solves the no-null issue and making sure the dataset length
              // is the same as the labels length
              for (var k = 0; k < data.length; k++) {
                if (data[k].date.split("T")[0] === labels[i] && data[k].ammo_name[0] === ammo_types[j]) {
                  ammo_count += data[k].count;
                }
              }
              dataset.data.push(ammo_count);
            }

            datasetvals.push(dataset);
          }
          console.log(datasetvals);
          setChartData({
            labels: labels,
            datasets: datasetvals,
          });
        }
        );

    }, [from,to]);

    const [chartData, setChartData] = useState({
        labels: ["2024-01-01", "2024-01-02"], 
        datasets: [
          {
            label: "5.56",
            data: [0,0],
          }
        ]
    });

    function getFormattedDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '-' + month + '-' + day;
      }

 

    return (
        <>
            <h1 className="tracking-widest text-xl px-4 py-2"><img className="float-left" src="/pie-chart-red.png" />Reports</h1>
            <label className="inline-block mx-4 text-sm font-extralight tracking-wider">From</label>
            <input className="inline-block w-1/4 text-neutral-700" type="date" name="from" onChange={ (e) => {setFrom(e.target.value) }} value={from}/>
            <label className="inline-block mx-4 text-sm font-extralight tracking-widerr">To</label>
            <input className="inline-block w-1/4 text-neutral-700" type="date" name="to" onChange={ (e) =>  { setTo(e.target.value) }} value={to} />
            <div className="font-bold text-center mt-2">Total Rounds for Period: {totalRoundCount}</div>
            <Bar className="mt-2 bg-gray-500 mb-14 h-4/6" 
                data={chartData}
                options={{
                  plugins: {
                      title: {
                        display: true,
                        text: "Ammo Used Per Day",
                        color: "black",
                      },
                      legend: {
                        labels : {
                          color: "black",
                        },
                        display: true,
                      }
                  },
                  // set font color to black for all labels
                  scales: {
                    x: {
                      ticks: {
                        color: "black",
                      },
                      grid: {
                        color: "black",
                      },
                    },
                    y: {
                      ticks: {
                        color: "black",
                      },
                      grid: {
                        color: "black",
                      },
                    },
                  },
                }}
            />
        </>
    )
}
export default Reports;