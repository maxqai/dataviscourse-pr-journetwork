// class implementing the impactTrace
// adapted from votePercentageChart.js
class ImpactTrace {

    constructor(){
        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        let divImpactTrace = d3.select("#impactTrace").classed("impactTrace", true);

        //fetch the svg bounds
        this.svgBounds = divImpactTrace.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;

        //add the svg to the div
        this.svg = divImpactTrace.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", 400);//TODO: fix this to not be hardcoded

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
        console.log('Grid', Grid)
        console.log('Cited', Cited)
        console.log('Citing', Citing)

        // Find the Min Grid Journal Year
        this.Years = Grid.map(d => {
            return parseInt(d["Year"])
        })

        let JIF = Grid.map(d => {
            return parseFloat(d["Journal Impact Factor"])
        })

        this.startYear = d3.min(this.Years)
        this.endYear = d3.max(this.Years)

        let JIFmax = d3.max(JIF)
        let JIFmin = d3.min(JIF)

        var cname = Grid[0].name

        // X-axis based on year range
        this.Xscale = d3.scaleLinear()
                        .domain([this.startYear, this.endYear])
                        .range(0, this.svgWidth)
        // Y-axis based on Journal Impact Factor
        this.Yscale = d3.scaleLinear()
                        .domain([JIFmin, JIFmax])
                        .range(0, this.svgHeight)
        // Journal Name List
        let name = Grid.map((d,i) => {
            if (i == 0){
                return d["Journal"]
            } else if (d["Journal"] !== Grid[i-1]["Journal"]){
                return d["Journal"]
            }
        })
        name = name.filter(d => {
            if (d !== null){
                return d
            }
        })

        // Filter Data Based On Year and Names
        name.forEach(d => {
            this.svg.append("g")
                    .attr("id", i)
        });

        // Organize Data into


	};
}
