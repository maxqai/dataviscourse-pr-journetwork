// class implementing the searchBar
// adapted from votePercentageChart.js
class SearchBar {

    constructor(){
        //initialize svg elements, svg sizing
        // this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        // let divSearchBar = d3.select("#search").classed("horizontalBars", true);
        //
        // //fetch the svg bounds
        // this.svgBounds = divSearchBar.node().getBoundingClientRect();
        // this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        // this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
        //
        // //add the svg to the div
        // this.svg = divSearchBar.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", 30);//TODO: fix this to not be hardcoded

        let divSearchBar = d3.select('#search');

        this.input = divSearchBar.append('input')
            .attr('id', 'uinput')
            .attr('type', 'text')
            .attr('placeholder', 'Search...');


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
	 * Creates the searchBar, content and tool tips
	 *
	 * @param currInput - potential journal selection
	 */
	update (currInput){
	    console.log('Current Text Entry in searchBar.js: ', currInput);

	    // load the journal json
        let journalData = d3.json('data/100_Top_Journals.json');
        // console.log('journalData', journalData);

        /*
        let options = {
          id: "Full Journal Title",
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 2,
          keys: [
            "Rank",
            "Full Journal Title",
            "Journal Impact Factor",
            "Title29",
            "Title20",
            "ISSN",
            "EISSN",
            "Category"
        ]
        };
        let fuse = new Fuse(list, options); // "list" is the item array
        let result = fuse.search("nature");
        */

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