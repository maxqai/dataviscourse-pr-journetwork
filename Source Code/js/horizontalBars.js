// class implementing the horizontalBars
// adapted from votePercentageChart.js
class HorizontalBars {

    constructor(){
        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 50, bottom: 20, left: 50};
        let divHorizontalBars = d3.select("#horizontalBars").classed("horizontalBars", true);

        //fetch the svg bounds
        this.svgBounds = divHorizontalBars.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;

        //add the svg to the div
        this.svg = divHorizontalBars.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", 3000);//TODO: fix this to not be hardcoded

        //add a group for each political party to the svg
        this.svg.append('g')
            .classed('citedBars', true);
        this.svg.append('g')
            .classed('citingBars', true);

        //set up stable params for bars
        this.barHeight = 18;

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
     * @param journal - Journal selection (used for highlighting in chart
     * @param year - year for display
	 */
	update (cited, citing, year, journal){

        // Filter the input data by ALL Journals to get total counts for cited and citing
        this.cited = cited.filter(d => {
            return d['Citing Journal'] === 'ALL Journals';
        });
        this.citing = citing.filter(d => {
            return d['Cited Journal'] === 'ALL Journals';
        });

        // the following empirically found values might prove useful later:
        // max cited = 47014
        // max citing = 22933
        // however, it may be most beneficial to just make the max the max for the current year
        let yearCitedMax = d3.max(this.cited.map(d => parseInt(d[year])));
        let yearCitingMax = d3.max(this.citing.map(d => parseInt(d[year])));
        let yearMax = d3.max([yearCitedMax, yearCitingMax]);
        // console.log('yearMax', yearMax);

        // Map just the relevant data to avoid unnecessary fluff and combine citing and cited info in one object
        let currCited = this.cited.map(d => parseInt(d[year]));
        let currCiting = this.citing.map(d => parseInt(d[year]));
        let allJournals = this.cited.map(d => d.Journal);
        let dataObj = [];
        currCited.forEach((d,i) => {
            dataObj.push({Journal: allJournals[i], Cited: d, Citing: currCiting[i]});
        });

        // Create linear scale for all bar charts
        let horzScale = d3.scaleLinear()
            .domain([0, 2.5*yearMax]) // note the 2.5* is because it will need to be at least twice as wide to have side-by-side bars with labels
            .range([0, this.svgWidth]);

        // Sort by cited in descending order initially
        dataObj.sort((a,b) => {
            // console.log('a.Cited ', a.Cited, 'b.Cited ', b.Cited);
            return b.Cited - a.Cited;
        });

        // Try removing all old rects and text instead of worrying about updating them
        d3.select('.citedBars').selectAll('rect').remove();
        d3.select('.citedBars').selectAll('text').remove();

        // Now bind the data
        let citedBars = d3.select('.citedBars').selectAll('rect')
            .data(dataObj);
        let citedText = d3.select('.citedBars').selectAll('text')
            .data(dataObj);

        // Now create the horizontal bars for cited
        citedBars.enter().append('rect')
            .attr('height', this.barHeight)
            .attr('width', d => {
                return horzScale(d.Cited);
            })
            .attr('x', 0)
            .attr('y', (d,i) => i*20 + 20)
            .classed('bar', true);

        // Add text to bars
        citedText.enter().append('text')
            .text(d => d.Journal)
            .attr('dy', this.barHeight/1.25)
            .attr('x', d => {
                return horzScale(d.Cited + 75)
            })
            .attr('y', (d,i) => i*20 + 20);

        //
        // Now repeat process for citingBars
        //

        // Try removing all old rects and text instead of worrying about updating them
        d3.select('.citingBars').selectAll('rect').remove();
        d3.select('.citingBars').selectAll('text').remove();

        // Now bind the data
        let citingBars = d3.select('.citingBars').selectAll('rect')
            .data(dataObj);
        let citingText = d3.select('.citingBars').selectAll('text')
            .data(dataObj);

        // Now create the horizontal bars for citing
        citingBars.enter().append('rect')
            .attr('height', this.barHeight)
            .attr('width', d => {
                return horzScale(d.Citing);
            })
            .attr('x', 0)
            .attr('y', (d,i) => i*20 + 20)
            .classed('bar', true);

        // Add text to bars
        citingText.enter().append('text')
            .text(d => d.Journal)
            .attr('dy', this.barHeight/1.25)
            .attr('x', d => {
                return horzScale(d.Citing + 75)
            })
            .attr('y', (d,i) => i*20 + 20);

        // flip cited group and offset
        d3.select('.citedBars')
            .attr("transform", "translate(" + horzScale(yearMax) + ",0)" + "scale(-1,1)");

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