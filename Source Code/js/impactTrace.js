// class implementing the impactTrace
// adapted from votePercentageChart.js
class ImpactTrace {

    constructor(){
        //initialize svg elements, svg sizing
        this.margin = {top: 20, right: 50, bottom: 20, left: 50};
        let divImpactTrace = d3.select("#impactTrace")
                               .classed("impactTrace", true);

        //fetch the svg bounds
        this.svgBounds = divImpactTrace.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left/2 - this.margin.right/2;
        this.svgHeight = 400;

        //add the svg to the div
        this.svg = divImpactTrace.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);//TODO: fix this to not be hardcoded
   };
	update (Grid){
        // Things that need to get done: Formatting of Graph - adding X and Y Labels, Changing Year so it Looks Good, appending circle to show which line was highlighted

        // First Sort the Data
        Grid = Grid.sort(function (e1, e2) {
            return d3.ascending(e1.Year, e2.Year)
        });
        var sortGrid = Grid;

        // Separate Years
        this.Years = Grid.map(d => {
            return parseInt(d["Year"])
        });

        // Find Min and Max Years
        let startYear = d3.min(this.Years)
        let endYear = d3.max(this.Years)

        // Find Columns worth filtering
        let JofInterest = ["5-Year Impact Factor", "% Articles in Citable Items", "Article Influence Score", "Citable Items", "Cited Half-Life", "Citing Half-LIfe", "Eigenfactor Score", "Immediacy Index", "Impact Factor without Journal Self Cites", "Journal Impact Factor", "Normalized Eigenfactor", "Total Cites", "avgJIFPercentile"];

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
                        .range([this.margin.left, this.svgWidth - this.margin.right]);

        // create Yscale based on JIF values
        this.Yscale = d3.scaleLinear()
                        .domain([0, endJIF])
                        .range([this.svgHeight - 2 * this.margin.bottom, 2 * this.margin.top]);

        // Create X axis
        this.Xaxis = d3.axisBottom();
        this.Xaxis
            .scale(this.Xscale)
            .tickValues([1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]);

        // Create Y axis
        this.Yaxis = d3.axisLeft();
        this.Yaxis
            .scale(this.Yscale)
            .tickValues([0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);

        // Append X Axis
        this.svg.append("g")
                .attr("transform","translate(" + 0 + "," + this.Yscale(0) + ")")
                .call(this.Xaxis)
                .selectAll(".ticks")
                .attr("id", "lineAxis");

        // Append X Label
        this.svg.append("g")
                .classed("label", true)
                .append("text")
                .text("YEAR")
                .attr("x", this.svgWidth/2)
                .attr("y", this.svgHeight)
                .attr("id", "lineAxis");

        // Append Y Axis
        this.svg.append("g")
                .attr("transform","translate(" + this.margin.left + "," + 0 + ")")
                .call(this.Yaxis)
                .selectAll(".ticks")
                .attr("id", "lineAxis");

        // Append Y Label
        this.svg.append("g")
                .classed("label", true)
                .append("text")
                .attr("transform", "rotate(-90)")
                .text("Journal Impact Factor")
                .attr("x", -this.svgHeight/2*1.25)
                .attr("y", this.margin.left/5*2)
                .attr("id", "lineAxis");

        d3.select(".itTitle").remove();

        let cnams = Grid.columns;
        let rectScale = d3.scaleLinear()
                          .domain([0, JofInterest.length])
                          .range([this.margin.left, this.svgWidth - this.margin.right]);

        // Append Text About Which Filter is On
        this.svg.append("text")
                .classed("Filt_Data_Text", true)
                .text("Filter: Journal")
                .attr("x", this.margin.left)
                .attr("y", this.margin.top)
                .classed("instruct", true)
                .attr("font-size", this.margin.top + "px");

        this.svg.select("g > FilterData").exit().remove();
        this.svg.append("g")
                .classed("FD_Group", true)
                .selectAll("rect")
                .classed("FilterData", true)
                .data(JofInterest)
                .enter()
                .append("rect")
                .attr("x", (d,i) => {
                    return rectScale(i);
                })
                .attr("y", this.margin.top/2)
                .attr("width", this.margin.left/5)
                .attr("height", this.margin.top)
                .style("fill", "#43a2ca")
                .on("mouseover", function(d,i) {
                    let x = d3.select(this)
                              .attr("x", d => {
                                return rectScale(i) - 5;
                              })
                              .attr("y", function(d) {
                                return 0
                              })
                              .attr("width", function(d) {
                                return 25
                              })
                              .attr("height", function(d) {
                                return 20
                              })
                              .style("fill", "#6FB98F");

                    d3.select(".FD_Group")
                      .append("title")
                      .text(d)
                      .attr("class", "tooltip")
                      .style("opacity", 0)
                      .transition()
                      .duration(200)
                      .style("opacity", 1);

                    console.log(d);
                })
                .on("mouseout", function(d,i) {
                    let that = this;
                    d3.select(this)
                      .attr("x", function(d) {
                        return rectScale(i);
                      })
                      .attr("y", that.margin.top/2)
                      .attr("width", that.margin.left/5)
                      .attr("height", that.margin.top)
                      .style("fill", "#43a2ca");

                    d3.selectAll(".tooltip")
                      .transition()
                      .duration(100)
                      .style("opacity", 0)
                      .remove();
                })
                .on("click", d => {
                    let dnam = JofInterest.indexOf(d);
                    let vals = sortGrid.map((e1) => {
                        let b = Object.keys(e1);
                        let val = e1[b[dnam]];
                        // If the number is a Float
                        if (!isNaN(val) && val.toString().indexOf('.') != -1) {
                            return parseFloat(val);
                        // if the number is an Integer
                        } else if (!isNaN(val) && val.toString().indexOf(',') == -1) {
                            return parseInt(val);
                        // If there is no number
                        } else {
                            return 0;
                        }
                    })
                        // Find the Min and Max of Vals
                        let ext = d3.extent(vals);
                        // Get X scale
                        let Xscaled = d3.scaleLinear()
                                        .domain([ext])
                                        .range([]);

                        let Yscaled = d3.scaleLinear()
                                        .domain([])
                                        .range([]);

                        d3.select(".ImpactTrace")
                          .selectAll("path")
                          .data(vals)
                          .enter().append("")
                        console.log(vals);
                    }
                );

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
                     .attr("d", d => {return d})
                     .style("stroke", function(d) {
                        if (name[lines.indexOf(d)] === "Nature") {
                            return "#E38533";
                        } else {
                            return "#004445";
                        }
                     })
                     .style("opacity", d => {
                        if (name[lines.indexOf(d)] === "Nature") {
                            return 1;
                        } else {
                            return 0.15;
                        }
                     });

        d3.select(".ImpactTrace")
                .selectAll("path")
                .on("mouseover", function(d) {
                    let that = this;

                    // Find Journal Name Through Mapping
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

                    // highlight related nodes in FDN
                        d3.select('.nodes').selectAll('circle')
                          .attr('id', e1 => {
                                if (sortGrid[pos[0]]["Journal"].toUpperCase() === e1.id.toUpperCase()) {
                                    return 'hlightCited'
                                } else {
                                return null
                                }
                          });

                        // highlight cited bars
                        d3.select('.citedBars')
                          .selectAll("rect")
                          .attr("id", e1 => {
                            if (sortGrid[pos[0]]["Journal"] === e1["Journal"]) {
                                return 'hlightCited'
                            } else {
                                return null
                            }
                          });

                        // highlight citing bars
                        d3.select('.citingBars')
                          .selectAll("rect")
                          .attr("id", e1 => {
                            if (sortGrid[pos[0]]["Journal"] === e1["Journal"]) {
                                return 'hlightCited'
                            } else {
                                return null
                            }
                          });

                        d3.select(this)
                          .style("stroke-width", 3 + "px")
                          .style("opacity", 1)
                          .style("stroke", "#6FB98F");
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
