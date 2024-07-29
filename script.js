d3.csv("https://flunky.github.io/cars2017.csv").then(data => {

    const width = 700;
    const height = 400;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    xScale = d3.scaleLog()
        .domain([10, 150])
        .range([0, width]);

    yScale = d3.scaleLog()
        .domain([10, 150])
        .range([height, 0]);

    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("text-align", "left")
        .style("width", "auto")
        .style("height", "auto")
        .style("padding", "5px")
        .style("font", "12px sans-serif")
        .style("background", "lightsteelblue")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    let currentScene = 0;

    setupScene0();

    d3.select("#nextSceneButton").on("click", function() {
        currentScene++;
        if (currentScene === 1) {
            setupScene1();
        } 

        if (currentScene === 2) {
            setupScene2();
        } 

        if (currentScene === 3) {
            d3.select("#nextSceneButton").text("Start Over");
            setupScene3();
        }

        if (currentScene == 4) {
            currentScene = 0;
            d3.select("#nextSceneButton").text("Next");
            d3.select("#nextSceneButton").attr("disabled", true);
            dropdown.attr("disabled", true);
            setupScene0();
        }
    });

    const makes = Array.from(new Set(data.map(d => d.Make)));
    makes.sort();
    const dropdown = d3.select("#makeDropdown");
    dropdown.selectAll("option")
        .data(makes)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    function updateChart(selectedMake, mustAnnotate) {
        const filteredData = selectedMake === "All" ? data : data.filter(d => d.Make === selectedMake);
        console.log(filteredData);

        const circles = svg.selectAll("circle")
        .data(filteredData, d => d.Make + d.AverageCityMPG + d.AverageHighwayMPG);

        circles.enter()
            .append("circle")
            .attr("cx", d => xScale(d.AverageCityMPG))
            .attr("cy", d => yScale(d.AverageHighwayMPG))
            .attr("r", d => 2 + +d.EngineCylinders)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7)
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Make: ${d.Make}<br>Fuel: ${d.Fuel}<br>Engine Cylinders: ${d.EngineCylinders}<br>Average City MPG: ${d.AverageCityMPG}<br>Average Highway MPG: ${d.AverageHighwayMPG}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .merge(circles)
            .transition()
            .duration(500)
            .attr("cx", d => xScale(d.AverageCityMPG))
            .attr("cy", d => yScale(d.AverageHighwayMPG))
            .attr("r", d => 2 + +d.EngineCylinders)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7);

        circles.exit().transition().duration(500).remove();

        if (mustAnnotate) {
            svg.selectAll(".annotation").remove();
            const minData = d3.min(filteredData, d => +d.AverageHighwayMPG);
            const maxData = d3.max(filteredData, d => +d.AverageHighwayMPG);
            const minCar = data.find(d => +d.AverageHighwayMPG === minData);
            const maxCar = data.find(d => +d.AverageHighwayMPG === maxData);



            svg.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Minimum Avg Highway MPG: ${minCar.AverageHighwayMPG}`);


            svg.append("text")
            .attr("x", 10)
            .attr("y", 30)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Maximum Avg Highway MPG: ${maxCar.AverageHighwayMPG}`);


        }

    }


    function updateEngineCylinders() {
        const filteredData = data.filter(d => d.EngineCylinders > 8);
        console.log(filteredData);

        const circles = svg.selectAll("circle")
        .data(filteredData, d => d.Make + d.AverageCityMPG + d.AverageHighwayMPG);  

        circles.enter()
            .append("circle")
            .attr("cx", d => xScale(d.AverageCityMPG))
            .attr("cy", d => yScale(d.AverageHighwayMPG))
            .attr("r", d => 2 + +d.EngineCylinders)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7)
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Make: ${d.Make}<br>Fuel: ${d.Fuel}<br>Engine Cylinders: ${d.EngineCylinders}<br>Average City MPG: ${d.AverageCityMPG}<br>Average Highway MPG: ${d.AverageHighwayMPG}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .merge(circles) 
            .transition()
            .duration(500)
            .attr("cx", d => xScale(d.AverageCityMPG))
            .attr("cy", d => yScale(d.AverageHighwayMPG))
            .attr("r", d => 2 + +d.EngineCylinders)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7);

        circles.exit().transition().duration(500).remove();
        svg.selectAll(".annotation").remove();

        svg.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Makes with the most Engine Cylinders: Aston Martin, Audi, Bentley, BMW, Dodge, Ferrari, Lamborghini, Mercendes Benz, and Rolls-Royce`);


    }
    
    dropdown.on("change", function() {
        const selectedMake = this.value;
        console.log(selectedMake);
        updateChart(selectedMake, true);
    });
    

    function setupScene0() {
        svg.selectAll("*").remove();

        const xAxis = d3.axisBottom(xScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        const yAxis = d3.axisLeft(yScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.AverageCityMPG))
            .attr("cy", d => yScale(d.AverageHighwayMPG))
            .attr("r", d => 2 + +d.EngineCylinders)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Scatterplot of Average City MPG vs Average Highway MPG for 2017 Cars");
             
        svg.append("text")
        .attr("x", -250)
        .attr("y", -25)
        .attr("text-anchor", "left")
        .attr("transform", "rotate(-90)")
        .style("font-size", "12px")
        .text("Average Highway MPG");

        svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Average City MPG");

        const popup = d3.select("body").append("div")
            .attr("class", "popup")
            .style("position", "absolute")
            .style("top", "300px")
            .style("left", "700px")
            .style("width", "300px")
            .style("padding", "10px")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("border-radius", "5px")
            .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.1)");

        const texts = [
            "Thinking about getting a new car? This scatterplot will show you detailed information on cars from 2017.",
            "Each circle represents a car model. The size of the circle corresponds to the number of engine cylinders that car has. The x-axis is the average city MPG and the y-axis is the average highway MPG of each car in the dataset.",
            "When you look at all the data, you will see that the lowest average highway MPG is 16 and highest is 122.",
            "If you aren't looking for a specific make, the car make with the best highway and city MPG would be Hyundai!",
            "You can hover over any circle to see the detailed information about that car. Click next scene to move on."
            
        ];

        let currentText = 0;

        popup.append("p").text(texts[currentText]);

        const nextButton = popup.append("button")
            .text("Next")
            .on("click", () => {
                currentText++;
                if (currentText < texts.length) {
                    popup.select("p").text(texts[currentText]);
                }   
                if (currentText == texts.length - 1) {
                    nextButton.remove();
                    popup.append("button")
                        .text("Let's get started!")
                        .on("click", () => {
                            popup.remove();
                            currentScene++;
                            setupScene1();
                        });
                }
                
            });

        const minData = d3.min(data, d => +d.AverageHighwayMPG);
        const maxData = d3.max(data, d => +d.AverageHighwayMPG);
        const minCar = data.find(d => +d.AverageHighwayMPG === minData);
        const maxCar = data.find(d => +d.AverageHighwayMPG === maxData);

        svg.append("line")
            .attr("x1", xScale(minCar.AverageCityMPG))
            .attr("y1", yScale(minCar.AverageHighwayMPG))
            .attr("x2", xScale(minCar.AverageCityMPG) + 20)
            .attr("y2", yScale(minCar.AverageHighwayMPG) + 20)
            .attr("class", "annotation")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        svg.append("text")
            .attr("x", xScale(minCar.AverageCityMPG) + 25)
            .attr("y", yScale(minCar.AverageHighwayMPG) + 25)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Make: ${minCar.Make}, Engine Cylinders: ${minCar.EngineCylinders}, Avg City MPG: ${minCar.AverageCityMPG}, Avg Highway MPG: ${minCar.AverageHighwayMPG}`);

        svg.append("line")
            .attr("x1", xScale(maxCar.AverageCityMPG))
            .attr("y1", yScale(maxCar.AverageHighwayMPG))
            .attr("class", "annotation")
            .attr("x2", xScale(maxCar.AverageCityMPG) - 100)
            .attr("y2", yScale(maxCar.AverageHighwayMPG) - 20)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        svg.append("text")
            .attr("x", xScale(maxCar.AverageCityMPG) - 310)
            .attr("y", yScale(maxCar.AverageHighwayMPG) - 25)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Make: ${maxCar.Make}, Engine Cylinders: ${maxCar.EngineCylinders}, Avg City MPG: ${maxCar.AverageCityMPG}, Avg Highway MPG: ${maxCar.AverageHighwayMPG}`);

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("class", "annotation")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

    }

    function setupScene1() {
        svg.selectAll("*").remove();
        d3.select("#nextSceneButton").attr("disabled", null);

        const xAxis = d3.axisBottom(xScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        const yAxis = d3.axisLeft(yScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        updateChart('All', false);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.AverageCityMPG))
            .attr("cy", d => yScale(d.AverageHighwayMPG))
            .attr("r", d => 2 + +d.EngineCylinders)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Scatterplot of Average City MPG vs Average Highway MPG for 2017 Cars");
             
        svg.append("text")
        .attr("x", -250)
        .attr("y", -25)
        .attr("text-anchor", "left")
        .attr("transform", "rotate(-90)")
        .style("font-size", "12px")
        .text("Average Highway MPG");

        svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Average City MPG");

        const minData = d3.min(data, d => +d.AverageHighwayMPG);
        const maxData = d3.max(data, d => +d.AverageHighwayMPG);
        const minCar = data.find(d => +d.AverageHighwayMPG === minData);
        const maxCar = data.find(d => +d.AverageHighwayMPG === maxData);

        svg.append("line")
            .attr("x1", xScale(minCar.AverageCityMPG))
            .attr("y1", yScale(minCar.AverageHighwayMPG))
            .attr("x2", xScale(minCar.AverageCityMPG) + 20)
            .attr("y2", yScale(minCar.AverageHighwayMPG) + 20)
            .attr("class", "annotation")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        svg.append("text")
            .attr("x", xScale(minCar.AverageCityMPG) + 25)
            .attr("y", yScale(minCar.AverageHighwayMPG) + 25)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Make: ${minCar.Make}, Engine Cylinders: ${minCar.EngineCylinders}, Avg City MPG: ${minCar.AverageCityMPG}, Avg Highway MPG: ${minCar.AverageHighwayMPG}`);

        svg.append("line")
            .attr("x1", xScale(maxCar.AverageCityMPG))
            .attr("y1", yScale(maxCar.AverageHighwayMPG))
            .attr("class", "annotation")
            .attr("x2", xScale(maxCar.AverageCityMPG) - 100)
            .attr("y2", yScale(maxCar.AverageHighwayMPG) - 20)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        svg.append("text")
            .attr("x", xScale(maxCar.AverageCityMPG) - 310)
            .attr("y", yScale(maxCar.AverageHighwayMPG) - 25)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Make: ${maxCar.Make}, Engine Cylinders: ${maxCar.EngineCylinders}, Avg City MPG: ${maxCar.AverageCityMPG}, Avg Highway MPG: ${maxCar.AverageHighwayMPG}`);

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("class", "annotation")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        
    }

    function setupScene2() {
        svg.selectAll("*").remove();

        d3.select("#nextSceneButton").attr("disabled", null);

        const xAxis = d3.axisBottom(xScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        const yAxis = d3.axisLeft(yScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

            svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Scatterplot of Average City MPG vs Average Highway MPG for 2017 Cars");
        
        svg.append("text")
            .attr("x", -250)
            .attr("y", -25)
            .attr("text-anchor", "left")
            .attr("transform", "rotate(-90)")
            .style("font-size", "12px")
            .text("Average Highway MPG");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Average City MPG");

        const minData = d3.min(data, d => +d.AverageHighwayMPG);
        const maxData = d3.max(data, d => +d.AverageHighwayMPG);
        const minCar = data.find(d => +d.AverageHighwayMPG === minData);
        const maxCar = data.find(d => +d.AverageHighwayMPG === maxData);

        const texts = [
            "Looking for large engine cylinders? Here are the cars with the most engine cylinders! These are cars with 8 or more cylinders. Feel free to hover over the circles to see more information.",
            "As you can see, cars with the most engine cylinders also have the lowest city and highway MPG. That's something to keep in mind.",
            "In the last scene, you can use the top left dropdown to filter by car makes to see how much the same car make can differ in engine cylinders, city mpg, and highway mpg. You can also see the minimum and maximum average highway MPG of that car make when you filter.",
            "If you are looking for a specific make, play with this chart to see some more details on these cars. Click next scene to start using the filter. Have fun exploring!"

        ];

        let currentText2 = 0;

        const popup2 = d3.select("body").append("div")
        .attr("class", "popup")
        .style("position", "absolute")
        .style("top", "300px")
        .style("left", "700px")
        .style("width", "300px")
        .style("padding", "10px")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.1)");

        popup2.append("p").text(texts[currentText2]);

        const nextButton2 = popup2.append("button")
            .text("Next")
            .on("click", () => {
                currentText2++;
                if (currentText2 < texts.length) {
                    popup2.select("p").text(texts[currentText2]);
                }   
                if (currentText2 == texts.length - 1) {
                    nextButton2.remove();
                    popup2.append("button")
                        .text("Finish")
                        .on("click", () => {
                            popup2.remove();
                        });

                    
                }

                
            });


        svg.append("line")
            .attr("x1", xScale(minCar.AverageCityMPG))
            .attr("y1", yScale(minCar.AverageHighwayMPG))
            .attr("x2", xScale(minCar.AverageCityMPG) + 20)
            .attr("y2", yScale(minCar.AverageHighwayMPG) + 20)
            .attr("class", "annotation")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        svg.append("text")
            .attr("x", xScale(minCar.AverageCityMPG) + 25)
            .attr("y", yScale(minCar.AverageHighwayMPG) + 25)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Make: ${minCar.Make},  Engine Cylinders: ${minCar.EngineCylinders}, Avg City MPG: ${minCar.AverageCityMPG}, Avg Highway MPG: ${minCar.AverageHighwayMPG}`);

        svg.append("line")
            .attr("x1", xScale(maxCar.AverageCityMPG))
            .attr("y1", yScale(maxCar.AverageHighwayMPG))
            .attr("x2", xScale(maxCar.AverageCityMPG) - 100)
            .attr("y2", yScale(maxCar.AverageHighwayMPG) - 20)
            .attr("class", "annotation")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        svg.append("text")
            .attr("x", xScale(maxCar.AverageCityMPG) - 310)
            .attr("y", yScale(maxCar.AverageHighwayMPG) - 25)
            .attr("class", "annotation")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(`Make: ${maxCar.Make}, Engine Cylinders: ${maxCar.EngineCylinders}, Avg City MPG: ${maxCar.AverageCityMPG}, Avg Highway MPG: ${maxCar.AverageHighwayMPG}`);

        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("class", "annotation")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        updateEngineCylinders();
        
    }

    function setupScene3() {
        svg.selectAll("*").remove();

        dropdown.attr("disabled", null);

        const xAxis = d3.axisBottom(xScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        const yAxis = d3.axisLeft(yScale)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"));

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

            svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Scatterplot of Average City MPG vs Average Highway MPG for 2017 Cars");
        
        svg.append("text")
            .attr("x", -250)
            .attr("y", -25)
            .attr("text-anchor", "left")
            .attr("transform", "rotate(-90)")
            .style("font-size", "12px")
            .text("Average Highway MPG");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Average City MPG");

        
        updateChart('All', true);

    }

});
