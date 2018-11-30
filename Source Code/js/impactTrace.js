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
        let sortGrid = Grid;

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
        let Xscale = d3.scaleLinear()
                        .domain([new Date(startYear), new Date(endYear)])
                        .range([this.margin.left, this.svgWidth - this.margin.right]);

        // create Yscale based on JIF values
        let Yscale = d3.scaleLinear()
                        .domain([0, endJIF])
                        .range([this.svgHeight - 2 * this.margin.bottom, 3 * this.margin.top]);

        // Create X axis
        this.Xaxis = d3.axisBottom();
        this.Xaxis
            .scale(Xscale)
            .tickValues([1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017])
            .tickFormat(d3.format("d"));

        // Create Y axis
        this.Yaxis = d3.axisLeft();
        this.Yaxis
            .scale(Yscale)
            .tickValues([0, 5, 10, 15, 20, 25, 30, 35, 40, 45]);

        // Append X Axis
        this.svg.append("g")
                .attr("transform","translate(" + 0 + "," + Yscale(0) + ")")
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

        let rectScale = d3.scaleLinear()
                          .domain([0, JofInterest.length])
                          .range([this.margin.left*3, this.svgWidth - this.margin.right]);

        // Append Text About Which Filter is On
        this.svg.append("text")
                .classed("Filt_Data_Text", true)
                .text("Current Filter: Journal")
                .attr("x", this.margin.left)
                .attr("y", this.margin.top)
                .classed("instruct", true)
                .attr("font-size", this.margin.top + "px");

        this.svg.append("text")
                .classed("FFilter", true)
                .text("Filters: ")
                .attr("x", this.margin.left)
                .attr("y", this.margin.top*2.5)

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
                .attr("y", this.margin.top*2)
                .attr("width", this.margin.left/5)
                .attr("height", this.margin.top/2)
                .style("fill", "#43a2ca")
                .on("mouseover", function(d,i) {
                    let x = d3.select(this)
                              .attr("x", d => {
                                return rectScale(i) - 5;
                              })
                              .attr("y", 30)
                              .attr("width", 30)
                              .attr("height", 30)
                              .style("fill", "#6FB98F");

                    d3.select(".FD_Group")
                      .append("title")
                      .text(d)
                      .attr("class", "tooltip")
                      .style("opacity", 0)
                      .transition()
                      .duration(200)
                      .style("opacity", 1);
                })
                .on("click", d => {
                    // Create a Line Function
                    let line = d3.line()
                                 .x(e2 => {
                                    return Xscale(e2[0]);
                                 })
                                 .y(e2 => {
                                    if (isNaN(e2[1])) {
                                        return Yscale(0);
                                    } else {
                                        return Yscale(e2[1]);
                                    }
                                 });
                    // Find Min and Max Data Points
                    let ext = d3.extent(Grid.map((e1,i) => {
                        let idx = parseFloat(Grid[i][d]);
                        if (isNaN(idx)) {
                            idx = 0;
                        }
                        return idx;
                    }));

                    // In case all of them are 0s
                    if (ext[1] === 0) {
                        ext[1] = 5;
                    }
                    Yscale = d3.scaleLinear().domain([ext[0], ext[1]])
                                             .range([[this.svgHeight - 2 * this.margin.bottom, 3 * this.margin.top]]);

                    // Map Data points and create path strings
                    let lines =  name.map((e1,i) => {
                        // Filter Data Based On Journal
                        let vals = Grid.filter((e2,i) => {
                            if (e2["Journal"] === e1){
                                return e2;
                            }
                        });
                        // Find the Column of Interest
//                        let year = parseInt(e1["Year"]);
//                        let val =   parseFloat(e1[sGnames[sGpos]]);
                        // Compute the line
                        vals = vals.map((e2,i) => {
                            let sGnames = Object.keys(e2);
                            let sGpos = [];
                            sGnames.forEach((e3,i1) => {
                                if (e3 === d) {
                                    sGpos = i1;
                                }
                            });
                            let y1 = parseInt(e2["Year"]);
                            let v1 = parseFloat(e2[sGnames[sGpos]]);
                            if (isNaN(v1)) {
                                v1 = 0;
                            };
                            return [y1, v1]
                        });
                        return line(vals)
                    });

//                    // Get X scale
//                    let Xscaled = d3.scaleLinear()
//                                    .domain([1997, 2017])
//                                    .range([20, 380]).nice();
//
//                    // create Yscale based on JIF values
//                    let Yscaled = d3.scaleLinear()
//                        .domain([ext[0], ext[1]])
//                        .range([360, 60]).nice();
//
//                    let values2 = line(values);

                    let lined = this.svg.append("g")
                            .classed("ImpactTrace", true)
                            .selectAll("path")
                            .data(lines);
                    lined.exit().remove();
                    lined.enter().append("path")
                         .attr("d", e1 => {
                            console.log(e1);
                            return e1
                         })
                         .style("stroke", function(e1) {
                            if (name[lines.indexOf(e1)] === "Nature") {
                                return "#E38533";
                            } else {
                                return "#004445";
                            }
                            })
                        .style("opacity", e1 => {
                            if (name[lines.indexOf(e1)] === "Nature") {
                                return 1;
                            } else {
                                return 0.15;
                            }
                        });
                })
                .on("mouseout", function(d,i) {
                    let that = this;
                    d3.select(this)
                      .transition()
                      .duration(200)
                      .attr("x", function(d) {
                        return rectScale(i);
                      })
                      .attr("y", 40)
                      .attr("width", 10)
                      .attr("height", 10)
                      .style("fill", "#43a2ca");

                    d3.selectAll(".tooltip")
                      .transition()
                      .duration(100)
                      .style("opacity", 0)
                      .remove();
                });

        // Create Voronoi Function
        this.voronoi = d3.voronoi()
                        .x(function(d) {
                            return Xscale(d[0]) + 200
                        })
                        .y(function(d) {
                            if (isNaN(d[1])) {
                                return Yscale(0);
                            } else {
                                return Yscale(d[1])
                            }
                        })
                        .extent([[-50, -20], [539.5 + 25, 400 + 25]]);

        // Create Line Function
        this.line = d3.line()
                      .x(e2 => {
                        return Xscale(e2[0]);
                        })
                      .y(e2 => {
                        if (isNaN(e2[1])) {
                            return Yscale(0);
                        } else {
                            return Yscale(e2[1]);
                        }
                        });

        // Filter Data
        let lines =  name.map((e1,i) => {
            let vals = Grid.filter((e2,i) => {
                if (e2["Journal"] === e1){
                    return e2;
                }
            });
            vals = vals.map((e2,i) => {
                return [parseInt(e2["Year"]), parseFloat(e2["Journal Impact Factor"])]
            });
            return this.line(vals)
        });
//        let voronois =  name.map((e1,i) => {
//            let vals = Grid.filter((e2,i) => {
//                if (e2["Journal"] === e1){
//                    return e2;
//                }
//            });
//            vals = vals.map((e2,i) => {
//                return [parseInt(e2["Year"]), parseFloat(e2["Journal Impact Factor"])]
//            });
//            return this.voronoi(vals).polygons()
//        });
//
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

//        let voron = this.svg.append("g")
//                            .attr("class", "voronoi");
//
//        voron.selectAll("path")
//             .data(voronois)
//             .enter().append("path")
//             .attr("d", d => {
//                let str = d ? "M" + d.join("L") : null;
//                let nstr = str.replace(/L+/g,"L");
//                while (nstr[nstr.length-1] === "L") {
//                    nstr = nstr.slice(0,-1);
//                };
//                nstr = nstr + "Z";
//                return nstr;
//             })
//             .datum(function(d) {
//                console.log(d.point);
//                return d.point;
//             })
//             .style("opacity", 0)
//             .on("mouseover", mouseover)
//             .on("mouseout", mouseout);
//                let l2 = d3.select(".ImpactTrace").selectAll("path")._groups[0][i];
//                l2.style.opacity = 1;

        function mouseover(d) {
            d3.select("."+d.type).classed("city_hover", true);

//            let l0 = lines[i];
//                let l1 = d3.select(".ImpactTrace").selectAll("path")._groups[0];
//                let des_l1 = [];
//                l1.forEach((e2,i) => {
//                    if (e2.__data__ === l0) {
//                        des_l1.push(i)
//                    };
//                });
//                console.log(des_l1);
//                des_l1.forEach(d => {
//                    d3.select(".ImpactTrace")
//                      .select("path:nth-child("+ des_l1[0] +")")
//                      .style("opacity",1)
//                      .style("stroke", "black")
//                      .style("stroke-width", 10);
//                });
        };

        function mouseout(d) {
            d3.select("."+d.type).classed("city_hover", false);
//            d3.select(this)
//              .style("opacity", 0.1)
//              .style("stroke-width", 1)
//              .style("stroke", "#6FB98F")
        };

        // Give the lines interactivity properties
        d3.select(".ImpactTrace")
                .selectAll("path")
                .on("mouseover", function(d) {
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
                })
                .on("mouseout", function(d) {
//                    d3.select(this)
//                      .transition()
//                      .duration(100)
//                      .style("opacity", 0)
//                      .remove();
                });
    }
};
