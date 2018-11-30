// class implementing the yearSlider
// adapted from votePercentageChart.js
class YearSlider {

    constructor(forceDirectedNetwork, journalData, initialYear, initialJournal, mapType, searchBar){

        this.activeYear = initialYear;

        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        let divYearSlider = d3.select("#yearSlider").classed("yearSlider", true);

        //fetch the svg bounds
        this.svgBounds = divYearSlider.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;

        //add the svg to the div
        this.svg = divYearSlider.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", 30); //TODO: fix this to not be hardcoded

        // The following has been adapted from the HW 4 solution provided to us via Slack

        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([2008, 2017]).range([30, 730]);

        let yearSlider = d3.select('#yearSlider')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 2008)
            .attr('max', 2017)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function() {
            sliderText.text(this.value);
            sliderText.attr('x', yearScale(this.value));

            // Determine which node was the center of the most recent FDN to keep it consistent after year change
            let Nodes = d3.select('.nodes').selectAll('circle');
            let currJournal = [];
            Nodes._groups[0].forEach(d => {
                // ***Note: the below fill value MUST be hard-coded to match the one from forceDirectedNetwork.js
                if (d.getAttribute('fill') === '#ec7f3e') {
                    currJournal.push(d.childNodes[0].textContent);
                }
            });
            forceDirectedNetwork.update(journalData, parseInt(this.value), currJournal[0], mapType);
        });

    };

    //
	// /**
	//  * Creates the yearSlider, content and tool tips
	//  *
	//  * @param yearArray - Array of available years
	//  */
	// update (yearArray){
    //
	// 		// this.tip.html((d)=> {
	// 		// 		let tooltip_data = {
    //         //
	// 		// 		return this.tooltip_render(tooltip_data);
	//         //     });
    //
    //
	// 		// let bars = d3.select('#votes-percentage').select('svg').selectAll('rect')
	// 		// 	.call(this.tip);
	// 		// bars
	// 		// 	.on('mouseover', this.tip.show)
	// 		// 	.on('mouseout', this.tip.hide);
	// };


}