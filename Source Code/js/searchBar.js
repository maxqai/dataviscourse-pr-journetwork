// class implementing the searchBar
// adapted from votePercentageChart.js
class SearchBar {

    constructor(forceDirectedNetwork){
        // make accessible
        this.forceDirectedNetwork = forceDirectedNetwork;


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
        //     .attr("height", 30);

        let divSearchBar = d3.select('#search');

        this.input = divSearchBar.append('input')
            .attr('id', 'uinput')
            .attr('type', 'text')
            .attr('placeholder', 'Search by Journal Name, Abbreviation, Category, or Rank')
            .attr('size', 80);

    };

	/**
	 * Creates the searchBar, content and tool tips
	 *
	 * @param currInput - potential journal selection
     * @param allData - includes top 100 journal info as loaded from JSON
     * @param year - necessary input to forceDirectedNetwork (called on click)
     * @param mapType - necessary input to forceDirectedNetwork (called on click)
	 */
	update (currInput, allData, year, mapType){

        let forceDirectedNetwork = this.forceDirectedNetwork;

        let journalData = allData[3];

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
            "Title29",
            "Title20",
            // "ISSN",
            // "EISSN",
            "Category"
        ]
        };

        let fuse = new Fuse(journalData, options); // "list" is the item array
        let searchResults = fuse.search(currInput);
        // console.log('searchResults', searchResults);

        // TODO: Figure out how to prevent other objects (e.g. force-directed network) from being pushed down when the following list is created:
        // TODO: Add styling to results to prevent them from being full width when highlighted

        // create ul below search box after removing any old ones
        d3.selectAll('#ulsearch').remove();
        if (currInput.length > 0) {
            let ul = d3.select('#search').append('ul')
                .attr('id', 'ulsearch')
                .attr('class', 'searchResults');

            // now add list elements for each match, up to 10 matches
            let abbsearchResults = searchResults.slice(0, 10);
            ul.selectAll('li')
                .data(abbsearchResults)
                .enter()
                .append('li')
                .html(String);


            // set events for hover and click on resulting items
            d3.select('#ulsearch').selectAll('li')
                .on('mouseover', function (d) {
                    d3.select(this)
                        .classed('searchHighlight', true)
                })
                .on('mouseout', function (d) {
                    d3.select(this)
                        .classed('searchHighlight', false)
                })
                .on('click', function () {
                    // return the selected journal
                    let currJournal = d3.select(this).data()[0];
                    // console.log('current selection: ', currJournal);
                    // put clicked text in search box
                    document.getElementById('uinput').value = currJournal;
                    // remove search list
                    d3.select('#ulsearch').remove();
                    // call update method of forceDirectedNetwork with appropriate inputs
                    forceDirectedNetwork.update(allData, year, currJournal, mapType);
                });
        }

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