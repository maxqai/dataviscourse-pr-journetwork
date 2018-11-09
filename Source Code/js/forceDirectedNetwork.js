// class implementing the forceDirectedNetwork
// adapted from votePercentageChart.js
class ForceDirectedNetwork {

    constructor(yearSlider, horizontalBars, impactTrace, journalInfoBox){
        // Make accessible
		this.yearSlider = yearSlider;
		this.horizontalBars = horizontalBars;
		this.impactTrace = impactTrace;
		this.journalInfoBox = journalInfoBox;
		// Data - thinking I have to do this in the update since it changes
        // this.profileGrid = journalCSVs[0];
        // this.citedTab = journalCSVs[1];
        // this.citingTab = journalCSVs[2];
        // this.year = initialYear;
        // console.log('prfGrid', this.profileGrid);
        // console.log('citedTab', this.citedTab);
        // console.log('citingTab', this.citingTab);
        // console.log('initYear', this.year);

        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        let divForceDirectedNetwork = d3.select("#network").classed("network", true);

        //fetch the svg bounds
        this.svgBounds = divForceDirectedNetwork.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;

        //add the svg to the div
        this.svg = divForceDirectedNetwork.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", 30); //TODO: fix this to not be hardcoded




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
     * Creates the forceDirectedNetwork, content and tool tips
     *
     * @param selectedJournal - Journal selection
     * @param year - year for display
     */
	update (journalCSVs, year){
        this.profileGrid = journalCSVs[0];
        this.citedTab = journalCSVs[1];
        this.citingTab = journalCSVs[2];
        this.year = year;
        // console.log('prfGrid', this.profileGrid);
        // console.log('citedTab', this.citedTab);
        // console.log('citingTab', this.citingTab);
        // console.log('Year', this.year);

	    // make scale for circle sizes (have to sqrt for area)
        let impactFactorScale = d3.scaleLinear()
            .domain([0,1])
            .range([0,1])


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
        //TODO: When adding interactivity, use something like below
        // circles
        //     .attr("cx", d => yearScale(d.YEAR))
        //     .attr("cy", this.svgHeight/3)
        //     .attr("r", 10)
        //     .attr("class", d => this.chooseClass(d.PARTY))
        //     .on('mouseover', function() {
        //         d3.select(this).classed('highlighted', true)
        //     })
        //     .on('mouseout', function() {
        //         d3.select(this).classed('highlighted', false)
        //     })
        //     .on('click', d =>  {
        //         d3.select("#year-chart").selectAll("circle").classed('selected', false);
        //         d3.select("#year-chart").selectAll("circle").filter(selYear => selYear.YEAR === d.YEAR)
        //             .classed('selected', true);
        //         d3.csv("data/Year_Timeline_" + d.YEAR + ".csv").then(selectedYear => {
        //             this.electoralVoteChart.update(selectedYear, this.colorScale);
        //             this.tileChart.update(selectedYear, this.colorScale);
        //             this.votePercentageChart.update(selectedYear);
        //         })
        //     });
	};


}