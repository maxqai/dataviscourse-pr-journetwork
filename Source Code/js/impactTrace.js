// class implementing the impactTrace
// adapted from votePercentageChart.js
class ImpactTrace {

    constructor(){
        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        let divImpactTrace = d3.select("#impactTrace").classed("impactTrace", true);

        //fetch the svg bounds
        this.svgBounds = divImpactTrace.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left/2 - this.margin.right/2;
        this.svgHeight = 400;

        //add the svg to the div
        this.svg = divImpactTrace.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);//TODO: fix this to not be hardcoded
   };
	update (Grid, Cited, Citing){

        // First Sort the Data
        Grid = Grid.sort(function (e1, e2) {
            return d3.ascending(e1.Year, e2.Year)
        });
        var sortGrid = Grid;

//        Cited = Cited.sort(function(e1, e2) {
//            return d3.ascending(e1.Year, e2.Year)
//        });
//
//        Citing = Citing.sort(function(e1, e2) {
//            return d3.ascending(e1.Year, e2.Year)
//        });

        // Separate Years
        this.Years = Grid.map(d => {
            return parseInt(d["Year"])
        });

        // Find Min and Max Years
        let startYear = d3.min(this.Years)
        let endYear = d3.max(this.Years)

        // Find All Unique Journal Names else return Undefineds
        let name = Grid.map((d,i) => {
            if (i > 0){
                if (d["Journal"] !== Grid[i-1]["Journal"]) {
                    return d["Journal"]
                }
            } else {
                return d["Journal"]
            }
        });

        // Filter out undefined names
        name = name.filter(d => {
            if (d !== ""){
                return d
            }
        });

        // Filter JIF values
        this.JIF = Grid.map(d => {
            return parseInt(d["Journal Impact Factor"])
        })

        let endJIF = d3.max(this.JIF);

        // create Xscale based on year values
        this.Xscale = d3.scaleLinear()
                        .domain([new Date(startYear), new Date(endYear)])
                        .range([this.margin.left/2, this.svgWidth - this.margin.right/2]);

        // create Yscale based on JIF values
        this.Yscale = d3.scaleLinear()
                        .domain([0, endJIF])
                        .range([this.svgHeight - this.margin.bottom, 2 * this.margin.top]);

        // Create X axis
        this.Xaxis = d3.axisBottom();
        this.Xaxis
            .scale(this.Xscale);
//            .tickValues([1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]);

        // Create Y axis
        this.Yaxis = d3.axisLeft();
        this.Yaxis
            .scale(this.Yscale)
            .tickValues([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);

        this.svg.append("g")
                .classed("lineAxis", true)
                .attr("transform","translate(" + 0 + "," + 380 + ")")
                .call(this.Xaxis)

        this.svg.append("g")
                .classed("lineAxis", true)
                .attr("transform","translate(" + this.margin.left/2 + "," + 0 + ")")
                .call(this.Yaxis)

        d3.select(".itTitle").remove();

        this.svg.append("g")
                .append("text")
                .text("Journal Impact Factor")
                .attr("x", this.Xscale(endYear * 0.5))
                .attr("y", this.margin.top)
                .classed("itTitle", true);
        let cnams = Grid.columns;

//        this.tip.html((d)=> {
//            // let tooltip_data;
//            console.log(d);
//            return this.tooltip_render(d);
//        });

        this.svg.append("g")
                .append("text")
                .text("Filters")
                .attr("x", this.margin.left/5)
                .attr("y", this.margin.top * 3 / 2)
                .style("stroke-color", " #E38533");


        this.svg.select("g > FilterData").exit().remove();
        this.svg.append("g")
                .classed("FD_Group", true)
                .selectAll("rect")
                .classed("FilterData", true)
                .data(cnams)
                .enter()
                .append("rect")
                .attr("x", (d,i) => {
                    return (i-1) * (this.svgWidth - this.margin.left - 2 * this.margin.right) / (cnams.length-1) + 2 * this.margin.left;
                })
                .attr("y", this.margin.top)
                .attr("width", this.margin.left/5)
                .attr("height", this.margin.top)
                .style("fill", "#43a2ca")
                .on("mouseover", function(d,i) {
                    d3.select(".FD_Group")
                      .append("title")
                      .text(d)
                      .attr("class", "tooltip")
                      .style("opacity", 0)
                      .transition()
                      .duration(200)
                      .style("opacity", 1);
                })
                .on("mouseout", function(d) {
                    d3.selectAll(".tooltip")
                      .transition()
                      .duration(100)
                      .style("opacity", 0);
                })
                .on("mouseclick", d => {

                });

        // create line
        this.line = d3.line()
                      .x(e2 => {
                        return this.Xscale(e2[0]);
                        })
                      .y(e2 => {
                        if (isNaN(e2[1])) {
                            return this.Yscale(0);
                        } else {
                            return this.Yscale(e2[1]);
                        }
                        });

        let lines = name.map((e1,i) => {
            let vals = Grid.filter((e2,i) => {
                if (e2["Journal"] === e1){
                    return e2;
                }
            });
            vals = vals.map((e2,i) => {
                return [parseInt(e2["Year"]), parseFloat(e2["Journal Impact Factor"], e2["Journal"])]
            });
            return this.line(vals);
        });

        let lined = this.svg.append("g")
                .classed("ImpactTrace", true)
                .selectAll("path")
                .data(lines);
        lined.exit().remove();
        lined.enter().append("path")
                     .attr("d", d => {return d});

        d3.select(".ImpactTrace")
                .selectAll("path")
                .on("mouseover", function(d) {
                    let pos = lines.map((e1,i) => {
                        if (d === e1) {
                            return [i];
                        } else {
                            return NaN;
                        }
                    });
                    // Remove NaNs from pos
                    pos = pos.filter((e1) => {if (!isNaN(e1)) {return e1}});
                    d3.select(this)
                        .append("title")
                        .text("Journal: " + sortGrid[pos[0]]["Journal"])
                        .classed("barsTitle", true)
                        .transition()
                        .duration(100)
                        .style("opacity", 0.9);
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                      .transition()
                      .duration(100)
                      .style("opacity", 0)
                      .remove();
                });
    }
};
