d3.csv("colleges.csv", function (data) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 60
    };
    var width = 500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
  
    var svg = d3.select("#collegeSelector")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + ", " + margin.top + ")");
  
    var minCost = 0;
    var maxCost = 100000;
    var xAxis = d3.scaleLinear()
      .domain([minCost, maxCost])
      .range([0, width]);
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xAxis));
  
    data.forEach(function (d) {
      d.Cost = +d["Average Cost"];
    });
  
    var numBins = 5;
    var histogram = d3.histogram()
      .value(function (d) {
        return d.Cost;
      })
      .domain(xAxis.domain())
      .thresholds(xAxis.ticks(numBins));
  
    var bins = histogram(data);
  
    var yAxis = d3.scaleLinear()
      .range([height, 0]);
  
    console.log(height);
  
    yAxis.domain([0, d3.max(bins, function (d) {
      console.log("Length: " + d.length);
      return d.length;
    })]);
  
    console.log(bins);
  
    svg.append("g")
      .call(d3.axisLeft(yAxis));
  
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + xAxis(d.x0) + "," + yAxis(d.length) + ")";
      })
      .attr("width", function (d) {
        return xAxis(d.x1) - xAxis(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - yAxis(d.length);
      })
      .style("fill", "#69b3a2")
      .on("click", function(d) {
        minCost = d.x0;
        maxCost = d.x1;
        console.log("min cost: " + minCost);
        console.log("max cost: " + maxCost);
      
        newXAxis = d3.scaleLinear()
          .domain([minCost, maxCost])
          .range([0, width]);
      
        svg.selectAll("g.x-Axis")
          .call(d3.axisBottom(newXAxis));
      })

      var path = g.selectAll('path')
        .enter()
        .append("g")
        .append('path')
        
  });