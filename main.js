var raceDict = {};
var collegeNames = [];


d3.csv("colleges.csv", function (data) {
    //college names
    //console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (!(collegeNames.includes(data[i].Name))) {
            collegeNames.push(data[i].Name);
        }
    }
    //race data 
    data.forEach(function (d) {
        d.White = +d["% White"];
        //console.log(d.White);
        d.Black = +d["% Black"];
        //console.log(d.Black);
        d.Hispanic = +d["% Hispanic"];
        d.Asian = +d["% Asian"]
        d.American_Indian = +d["% American Indian"]
        d.Pacific_Islander = +d["% Pacific Islander"]
        d.Biracial = +d["% Biracial"];
        var totalRace = d.White + d.Black + d.Hispanic + d.Asian + d.American_Indian + d.Pacific_Islander + d.Biracial;
        var raceList = [d.White, d.Black, d.Hispanic, d.Asian, d.American_Indian, d.Pacific_Islander, d.Biracial];
        raceDict[d.Name] = raceList;
    });

    selector = document.getElementById('collegeSelect');
    for (var i = 0; i < collegeNames.length; i++) {
        selector.options.add(new Option(collegeNames[i], collegeNames[i]));
    }
    var startText = 'Start the process by selecting a College using the selection dropbox';
    document.getElementById("selectionStatement").innerHTML = startText;

         


});
//console.log(raceDict);
//console.log(collegeNames);
//console.log(raceDict[collegeNames][0]);

function generateGraphs() {
    //getting info for whatever user picks in drop select 
    var e = document.getElementById("collegeSelect");
    var collegeName = e.options[e.selectedIndex].text;
    //updating text on drop select to react with user's choice
    document.getElementById("selectionStatement").innerHTML = "Nice! You picked " + collegeName;
    document.getElementById("pieChart").innerHTML = "";

    //creating our pi charts 
    d3.csv("colleges.csv", function (data) {
      


    d3.selectAll("circle").classed('selected', function(m) {
        if (m.Name == collegeName){
            return true;
        };
            return false;
        });

        var raceData = [
          {race: "White", value: raceDict[collegeName][0]},
          {race: "Black", value: raceDict[collegeName][1]},
          {race: "Hispanic", value: raceDict[collegeName][2]},
          {race: "Asian", value: raceDict[collegeName][3]},
          {race: "American Indian", value: raceDict[collegeName][4]},
          {race: "Pacific Islander", value: raceDict[collegeName][5]},
          {race: "Mixed", value: raceDict[collegeName][6]},
          
        ];


        console.log(raceData);
       


        var width = 400;
        var height = 450;
        var padding = 10;
        var opacity = .8;
        var opacityHover = 1;
        var otherOpacityOnHover = .8;
        var tooltipMargin = 13;

        var radius = Math.min(width - padding, height - padding) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select("#pieChart")
            .append('svg')
            .attr('class', 'pie')
            .attr('id', "svgPie")
            .attr('width', width)
            .attr('height', height);


        var g = svg.append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);

        var path = g.selectAll('path')
            .data(pie(raceData))
            .enter()
            .append("g")
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            
            .style('opacity', opacity)
            .style('stroke', 'white')
            // .transition()
            //     .ease("bounce")
            //     .duration(100)
            //     .attrTween("d", tweenPie)

            //mouse hover feature
            .on("mouseover", function (d) {
                d3.selectAll('path')
                    .style("opacity", otherOpacityOnHover);
                d3.select(this)
                    .style("opacity", opacityHover);

                let g = d3.select("#svgPie")
                    .style("cursor", "pointer")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                g.append("text")
                    .attr("class", "name-text")
                    .text(`${d.data.race} (${d.data.value})`)
                    .attr('text-anchor', 'middle');

                let text = g.select("text");
                let bbox = text.node().getBBox();
                let padding = 2;
                g.insert("rect", "text")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + (padding * 2))
                    .attr("height", bbox.height + (padding * 2))
                    .style("fill", "white")
                    .style("opacity", 0.75);
            })
            .on("mousemove", function (d) {
                let mousePosition = d3.mouse(this);
                let x = mousePosition[0] + width / 2;
                let y = mousePosition[1] + height / 2 - tooltipMargin;

                let text = d3.select('.tooltip text');
                let bbox = text.node().getBBox();
                if (x - bbox.width / 2 < 0) {
                    x = bbox.width / 2;
                }
                else if (width - x - bbox.width / 2 < 0) {
                    x = width - bbox.width / 2;
                }

                if (y - bbox.height / 2 < 0) {
                    y = bbox.height + tooltipMargin * 2;
                }
                else if (height - y - bbox.height / 2 < 0) {
                    y = height - bbox.height / 2;
                }

                d3.select('.tooltip')
                    .style("opacity", 1)
                    .attr('transform', `translate(${x}, ${y})`);
            })
            .on("mouseout", function (d) {
                d3.select("#svgPie")
                    .style("cursor", "none")
                    .select(".tooltip").remove();
                d3.selectAll('path')
                    .style("opacity", opacity);
            })
            .on("touchstart", function (d) {
                d3.select("#svgPie")
                    .style("cursor", "none");
            })
            .each(function (d, i) {
                this._current = i;
            });

        let legend = d3.select("#pieChart").append('div')
            .attr('class', 'legend')
            .style('margin-top', '30px');

        let keys = legend.selectAll('.key')
            .data(raceData)
            .enter().append('div')
            .attr('class', 'key')
            .style('display', 'flex')
            .style('align-items', 'left')
            .style('margin-left', '20px');

        keys.append('div')
            .attr('class', 'symbol')
            .style('height', '50px')
            .style('width', '20px')
            .style('margin', '0px 5px')
            .style('background-color', (d, i) => color(i));

        keys.append('div')
            .attr('class', 'name')
            .text(d => `${d.race}`);

        keys.exit().remove();
        

       //subtitle 
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 435)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Race Distribution at " + collegeName);

    });

    function tweenPie(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
      }

    <strong>Admission Rate:</strong> <span id="admRate"></span><br/>
    <strong>Average Cost:</strong> <span id="avgCost"></span><br/>
    <strong>Undergrad Population:</strong> <span id="undergradPop"></span><br/>
    <strong>ACT Median:</strong> <span id="act"></span><br/>
    <strong>SAT Average:</strong> <span id="sat"></span><br/>

    
};