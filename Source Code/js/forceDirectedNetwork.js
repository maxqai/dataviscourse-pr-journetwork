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
            .attr("height", 800); //TODO: fix this to not be hardcoded




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


        //
        let journalsNetworkInfo = this.citingTab.map( (d, i) => {
            if(i>1){
                return {
                    journalName: d['Journal'],
                    citedJournalName: d['Cited Journal'],
                    impactFactor: d['Impact Factor'],
                    citedJournal: d[String(this.year)]
                }
            }
        });
        journalsNetworkInfo = journalsNetworkInfo.slice(2);
        // add info for current journal
        let currentJournal = this.profileGrid.filter( obj => {
            return obj.Year === String(this.year);
        });
        currentJournal = currentJournal[0];
        currentJournal = {
            journalName: currentJournal['Journal'],
            citedJournalName: currentJournal['Journal'],
            impactFactor: currentJournal['Journal Impact Factor'],
            citedJournal: '0'
        };
        // bring current journal to front: TODO: deal with case of journal self-cites
        journalsNetworkInfo.unshift(currentJournal);
        console.log('currJournal', currentJournal);
        console.log('journalNetworkInfo', journalsNetworkInfo);

	    // make scale for circle sizes (have to sqrt for area)
        let domainMax = d3.max(journalsNetworkInfo.map(d => d.impactFactor));
        let domainMin = d3.min(journalsNetworkInfo.map(d => d.impactFactor));
        let rangeMax = 50;
        let impactFactorScale = d3.scaleLinear()
            .domain([domainMin,domainMax])
            .range([0,rangeMax]) //TODO: correction for area


        // make nodes and links similar to format below... we don't need groups at this point
                // {
                //   "nodes": [
                //     {"id": "Myriel", "group": 1},
                //     {"id": "Napoleon", "group": 1},
                //     {"id": "Mlle.Baptistine", "group": 1},
                //     {"id": "Mme.Magloire", "group": 1},
                //     {"id": "Child1", "group": 10},
                //     {"id": "Child2", "group": 10},
                //     {"id": "Brujon", "group": 4},
                //     {"id": "Mme.Hucheloup", "group": 8}
                //   ],
                //   "links": [
                //     {"source": "Napoleon", "target": "Myriel", "value": 1},
                //     {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
                //     {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
                //     {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6},
                //     {"source": "CountessdeLo", "target": "Myriel", "value": 1},
                //     {"source": "Mme.Hucheloup", "target": "Gavroche", "value": 1},
                //     {"source": "Mme.Hucheloup", "target": "Enjolras", "value": 1}
                //   ]
                // }
        let forceData = {
            nodes: journalsNetworkInfo.map(d => {
                return {
                    id: d.citedJournalName
                }
            }),
            links: journalsNetworkInfo.map(d => {
                return {
                    source: d.journalName,
                    target: d.citedJournalName,
                    value: d.impactFactor
                }
            })
        };
        console.log('forceData', forceData);

        let forceSimulation = d3.forceSimulation()
            .force("link", d3.forceLink)





        this.impactTrace.update(this.profileGrid, this.citedTab, this.citingTab);



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