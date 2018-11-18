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

        let maxYear = Citing.filter(d => {

        })

        this.Xaxis = d3.scaleLinear().domain([]).range([this.margin.left, svg.width - this.margin.right]);

        this.svg.append


			// this.tip.html((d)=> {
			// 		let tooltip_data = {
            //
			// 		return this.tooltip_render(tooltip_data);
	        //     });


			// let bars = d3.select('#votes-percentage').select('svg').selectAll('rect')
			// 	.call(this.tip);
			// bars
			// 	.on('mouseover', this.tip.show)
			// 	.on('mouseout', this.tip.hide);
	};


}