// class implementing the journalInfoBox
// adapted from votePercentageChart.js
class JournalInfoBox {

    constructor(){
        //initialize svg elements, svg sizing
        // this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        // let divInfoBox = d3.select("#infoBox").classed("infoBox", true);
        //
        // //fetch the svg bounds
        // this.svgBounds = divInfoBox.node().getBoundingClientRect();
        // this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        // this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
        //
        // //add the svg to the div
        // this.svg = divInfoBox.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", 30);//TODO: fix this to not be hardcoded



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
	 * @return text HTML content for tool tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{

	    });
	    return text;
	}

	/**
	 * Creates the journalInfoBox, content and tool tips
	 *
	 * @param selectedJournal - Journal selection
	 */
	update (selectedJournal, jData){

	    // console.log('Info Journal', selectedJournal);
	    // console.log('Journal Data', jData);

        let currData = jData.filter(d => {
            return d['Full Journal Title'].toUpperCase() === selectedJournal.toUpperCase();
        });

        console.log('currData', currData);

        d3.select('#infoBox > g').remove();

        d3.select('#infoBox').append('g');

        let box = d3.select('#infoBox > g');

        box.append('h2')
            .text('Journal Info');
        box.append('h3')
            .text(currData[0]['Full Journal Title']);
        let ul = box.append('ul')
            .attr('class', 'infoList');
        ul.append('li')
            .text('Rank: ' + currData[0]['Rank']);
        ul.append('li')
            .text('Years Active: ' + currData[0]['Years']);
        ul.append('li')
            .text('2017 Impact Factor: ' + currData[0]['Journal Impact Factor']);
        ul.append('li')
            .text(function() {
                if (currData[0]['Title29'].toUpperCase() === currData[0]['Title20'].toUpperCase()) {
                    return 'Common Abbreviation: ' + currData[0]['Title29'];
                } else {
                    return 'Common Abbreviations: ' + currData[0]['Title29'] + '; ' + currData[0]['Title20'];
                }
            });
        ul.append('li')
            .text('Category: ' + currData[0]['Category']);
        ul.append('li')
            .text('ISSN: ' + currData[0]['ISSN']);
        ul.append('li')
            .text('EISSN: ' + currData[0]['EISSN']);
        ul.append('li')
            .text('Website: ' + currData[0]['Link']);
        ul.append('li')
            .text('Wikipedia Page: ' + currData[0]['WikiLink']);
        ul.append('p')
            .text(currData[0]['Description']);



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