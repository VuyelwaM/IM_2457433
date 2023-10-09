getData();

async function getData() {
    const apiKey = "UqV6Y2axrvRmhVEWKg6XvqQ2uMjt6jCwKe6bdQf8";
    const startYear = 2021; // Replace with the year you're interested in
    const endYear = 2022;   // Replace with the year you're interested in
    const apiUrl = `https://api.nasa.gov/DONKI/GST?startDate=${startYear}-01-01&endDate=${endYear}-12-31&api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json(); // Parse the response as JSON
        console.log(data);

        createScatterPlot(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function createScatterPlot(data) {
    // Extract relevant information for the graph
    const processedData = data.map(event => ({
        startTime: new Date(event.startTime),
        kpIndex: event.allKpIndex[0].kpIndex
    }));

    // Set Dimensions
    const xSize = 800;
    const ySize = 400;
    const margin = 40;
    const xMax = xSize - margin * 2;
    const yMax = ySize - margin * 2;

    // Append SVG Object to the Page
    const svg = d3.select("#myPlot")
        .append("svg")
        .attr("width", xSize)
        .attr("height", ySize)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    // X Axis
    const x = d3.scaleTime()
        .domain(d3.extent(processedData, d => d.startTime))
        .range([0, xMax]);

    svg.append("g")
        .attr("transform", "translate(0," + yMax + ")")
        .call(d3.axisBottom(x));

    // Y Axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.kpIndex)])
        .range([yMax, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Create a tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Dots
    svg.selectAll("circle")
        .data(processedData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.startTime))
        .attr("cy", d => y(d.kpIndex))
        .attr("r", 3)
        .style("fill", "Red")
        .on("mouseover", (event, d) => {
            // Show the tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.html(`Date: ${d.startTime}<br>Kp Index: ${d.kpIndex}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            // Hide the tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}




