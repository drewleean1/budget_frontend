import * as d3 from 'd3';

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';


const Barchart = (month, year) => {
    const ref = useRef(); 

    const [dataSet, setDataSet] = useState({});

    const margin = { top:30, right:30, bottom:30, left:60}, 
    const width = 460 - margin.left - margin.right; 
    const height = 400 - margin.top - margin.bottom;

    const loadExpenses = async () => {
        const response = await fetch(`https://budget-drewleean-80248645fdf0.herokuapp.com/expenses/month/${month}/year/${year}`);;
        const expenses = await response.json(); 

        let preparedData = {};

        for (let i = 0; i < Object.keys(expenses).length; i ++ ) {
            if (expenses[i]["amount"] < 0) {continue;}
            try {
                preparedData[expenses[i]["category"]] = preparedData[expenses[i]["category"]] + expenses[i]["amount"]
            }
            catch(err) {
                preparedData[expenses[i]["category"]] = expenses[i]["amount"]
            }
        }

        for (let j in Object.keys(preparedData)) {
            preparedData[j] = Math.round(preparedData[j])
        }

        setDataSet(preparedData)
    }

    useEffect(() => {
        loadExpenses();
    }, []);

    useEffect(() => {
        const margin = { top:30, right:30, bottom:30, left:60}, 
        const width = 460 - margin.left - margin.right; 
        const height = 400 - margin.top - margin.bottom;
        
        const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.json(expenses).then(function(data){
        const x = d3
            .scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.Category))
            .padding(0.2);
        svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

      // Add Y axis
        const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Bars
        svg
            .selectAll("mybar")
            .data(data)
            .join("rect")
            .attr("x", (d) => x(d.Category))
            .attr("y", (d) => y(d.Value))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.Value))
            .attr("fill", "#5f0f40");
            }); 
    }, []);

};


export default Barchart