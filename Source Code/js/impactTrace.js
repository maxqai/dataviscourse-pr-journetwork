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

		//for reference: https://github.com/Caged/d3-tip
		//Use this tool tip element to handle any hover over the chart
		// this.tip = d3.tip().attr('class', 'd3-tip')
		// 	.direction('s')
		// 	.offset(function() {
		// 		return [0,0];
		// 	});
    };


	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{

	    });
	    return text;
	}

	/**
	 * Creates the horizontalBars, content and tool tips
	 *
	 * @param journalsImpact - array of journals with their impact factor over time
	 */
	update (Grid, Cited, Citing){

        // First Sort the Data
        Grid = Grid.sort(function (e1, e2) {
            return d3.ascending(e1.Year, e2.Year)
        });

        Cited = Cited.sort(function(e1, e2) {
            return d3.ascending(e1.Year, e2.Year)
        });

        Citing = Citing.sort(function(e1, e2) {
            return d3.ascending(e1.Year, e2.Year)
        });

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
                        .domain([startYear, endYear])
                        .range([0, this.svgWidth - this.margin.left/2 - this.margin.right/2]);

        // create Yscale based on JIF values
        this.Yscale = d3.scaleLinear()
                        .domain([0, endJIF])
                        .range([this.svgHeight - this.margin.bottom, this.margin.top]);

        // Create X axis
        this.Xaxis = d3.axisBottom(this.Xscale);

        // Create Y axis
        this.Yaxis = d3.axisLeft(this.Yscale);

        // create line
        this.line = d3.line()
                      .x(e2 => {
                        return this.Xscale(e2[0]);
                        })
                      .y(e2 => {
                        if (e2["Journal Impact Factor"] === "Not Available") {
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
                return [parseInt(e2["Year"]), parseFloat(e2["Journal Impact Factor"])]
            });

            return this.line(vals);
        });

        console.log(lines);
        let lined = this.svg.append("g")
                .attr("id", "ImpactTrace")
                .selectAll("path")
                .data(lines);
        lined.exit().remove();
        lined.enter().append("path")
                     .attr("d", d => {return d});
	};
}
