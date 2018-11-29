// class implementing the forceDirectedNetwork
// adapted from votePercentageChart.js
class ForceDirectedNetwork {

    constructor(horizontalBars, impactTrace, journalInfoBox){
        // Make accessible
		this.horizontalBars = horizontalBars;
		this.impactTrace = impactTrace;
		this.journalInfoBox = journalInfoBox;


        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 100, bottom: 20, left: 50};
        let divForceDirectedNetwork = d3.select("#network").classed("network", true);

        //fetch the svg bounds
        this.svgBounds = divForceDirectedNetwork.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
        this.svgHeight = 800; //TODO: fix this to not be hardcoded

        //add the svg to the div
        this.svg = divForceDirectedNetwork.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);




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
     * @param journalCSVs - loaded CSVs containing profileGrid, cited, citations
     * @param year - year for display
     * @param journal - journal to center
     * @param mapType - 'Citing' or 'Cited'
     */
	update (journalCSVs, year, journal, mapType){
	    // let temp = journalData[0].filter(d => {
	    //     return parseInt(d.Year) === year
        // }).map( d => d.Journal);
	    // console.log('profGrid', temp);

        // try and get year from yearSlider, if possible
        // this is to avoid cases where the searchBar is used (which only uses initial year instead of slider year
        let tryYear = d3.select('.slider-wrap').select('input');
        if (tryYear._groups[0][0] !== undefined) {
            year = parseInt(tryYear._groups[0][0].value);
        }

        this.profileGrid = journalCSVs[0].filter(d => {
            return parseInt(d.Year) === year;
        });
        this.citedTab = journalCSVs[1];
        this.citingTab = journalCSVs[2];
        this.year = year;


        // create link structures
        let journalsLinkInfo = undefined;
        if(mapType === 'Citing') {
            journalsLinkInfo = this.citingTab.map((d, i) => {
                if (i > 1) {
                    return {
                        mainJournalName: d['Journal'],
                        citationJournalName: d['Cited Journal'],
                        impactFactor: parseFloat(d['Impact Factor']),
                        citationCount: parseInt(d[String(this.year)])
                    }
                }
            });
            journalsLinkInfo = journalsLinkInfo.slice(2); // get rid of blank rows

            // get rid of elements in array where cited journal is "ALL Journals", "ALL OTHERS (#number)" which varies, and self-cites
            journalsLinkInfo = journalsLinkInfo.filter(d => {
                return d.citationJournalName !== "ALL Journals";
            });
            journalsLinkInfo = journalsLinkInfo.filter(d => {
                let string = d.citationJournalName;
                let substring = "ALL OTHERS";
                if (string.includes(substring)) {
                } else {
                    return d.citationJournalName;
                }
            });
            journalsLinkInfo = journalsLinkInfo.filter(d => {
                return d.citationJournalName !== d.mainJournalName;
            });
        } else if(mapType === 'Cited') {
            journalsLinkInfo = this.citedTab.map((d, i) => {
                if (i > 1) {
                    return {
                        mainJournalName: d['Journal'],
                        citationJournalName: d['Citing Journal'],
                        impactFactor: parseFloat(d['Impact Factor']),
                        citationCount: parseInt(d[String(this.year)])
                    }
                }
            });
            journalsLinkInfo = journalsLinkInfo.slice(2); // get rid of blank rows

            // get rid of elements in array where cited journal is "ALL Journals", "ALL OTHERS (#number)" which varies, and self-cites
            journalsLinkInfo = journalsLinkInfo.filter(d => {
                return d.citationJournalName !== "ALL Journals";
            });
            // journalsLinkInfo = journalsLinkInfo.filter(d => {
            //     let string = d.citationJournalName;
            //     let substring = "ALL OTHERS";
            //     if (string.includes(substring)) {
            //     } else {
            //         return d.citationJournalName;
            //     }
            // });
            journalsLinkInfo = journalsLinkInfo.filter(d => {
                return d.citationJournalName !== d.mainJournalName;
            });
        }

        // get rid of journals that aren't in top 100 - need to check for every year.
        let tempJournalData = [];
        // console.log('length JLI', journalsLinkInfo)
        journalsLinkInfo.forEach( d => {
            let count = 0;
            this.profileGrid.forEach( jName => {
                if((jName['Journal'] === d['citationJournalName']) || jName['Journal'] === d['mainJournalName']) {
                    count = count + 1;
                }
            });
            if(count === 2) {
                tempJournalData.push(d);
            }
        });
        // console.log('tempJournalData', tempJournalData);
        journalsLinkInfo = tempJournalData;


        // create node structures
        this.profileGrid.sort( function(a,b) {
            return b['Journal Impact Factor'] - a['Journal Impact Factor']
        });
        let journalsNodeInfo = this.profileGrid.map( d => {
            return {
                journal: d.Journal,
                impactFactor: parseFloat(d['Journal Impact Factor'])
            }
        });





	    // make scale for circle sizes (have to sqrt for area)
        let domainMax = d3.max(journalsLinkInfo.map(d => d.impactFactor));
        let domainMin = d3.min(journalsLinkInfo.map(d => d.impactFactor));
        let rangeMax = 20;
        let rangeMin = 3;
        let impactFactorScale = d3.scaleSqrt()
            .domain([domainMin,domainMax])
            .range([rangeMin,rangeMax]); //TODO: correction for area


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
        // d3.json('https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json').then( d => console.log('json', d));

        let forceData = {
            nodes: journalsNodeInfo.map((d,i) => {
                if(d.journal === journal) {
                    // console.log('selJOurnal', d.journal);
                    return {
                        fx: this.svgWidth/2, // initially fix selected journal in center
                        fy: this.svgHeight/2,
                        id: d.journal,
                        impactFactor: d.impactFactor
                    }
                } else {
                    return {
                        id: d.journal,
                        impactFactor: d.impactFactor
                    }
                }
            }),
            links: journalsLinkInfo.map(d => {
                return {
                    source: d.mainJournalName,
                    target: d.citationJournalName,
                    impactFactor: d.impactFactor,
                    citedCount: d.citationCount+1
                }
            })
        };

        //citation scale
        let citeMax = d3.max(journalsLinkInfo.map( d => {
            return d.citationCount;
        }));
        let citeMin = d3.min(journalsLinkInfo.map( d => d.citationCount));
        let citationScale = d3.scaleLog()
            .domain([citeMin+1, citeMax+1])
            .range([citeMax+1, citeMin+1]);

        let forceSimulation = d3.forceSimulation()
            .force("link", d3.forceLink()
                .id(function(d) {
                    // console.log('d forceLink', d);
                    return d.id;})
                .distance(function(d) {
                    // console.log('d citedCount', d.citedCount, 'citationScale', citationScale(d.citedCount));
                    return citationScale(d.citedCount);
                }))
            .force('charge', d3.forceManyBody().strength(-60))
            .force('center', d3.forceCenter(this.svgWidth/2, this.svgHeight/2))
            .force('collision', d3.forceCollide(d => {
                return impactFactorScale(d.impactFactor);
            }));


        //get rid of old links and nodes
        d3.select('.links').remove();
        d3.select('.nodes').remove();

        //add encompassing group for the zoom
        let gWrap = this.svg.append('g')
            .attr('class', 'everything');

        let links = gWrap.append('g')
        // let links = this.svg.append('g')
            .attr('class', 'links')
            .selectAll("line")
            .data(forceData.links)
            .enter().append("line");

        let nodes = gWrap.append('g')
        // let nodes = this.svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(forceData.nodes)
            .enter().append('circle')
            .attr('r', d => {
                return impactFactorScale(d.impactFactor);
            })
            .attr('fill', d => {
                // console.log('d', d.id);
                if(d.id === journal){
                    // console.log('in')
                    return '#ec7f3e' // *** <-- If this gets updated in the future, please update in yearSlider, as well!
                } else {
                    return '#004647'
                }
            })
            .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));

        nodes.append("title")
              .text(function(d) { return d.id; });

        forceSimulation
              .nodes(forceData.nodes)
              .on("tick", ticked);

        //applies links
        // console.log('forceData.links', forceData.links);
        forceSimulation.force("link")
              .links(forceData.links);

        function ticked() {
            links
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodes
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }
        function dragstarted(d) {
            if (!d3.event.active) forceSimulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
        }
        function dragged(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
        }

        function dragended(d) {
              if (!d3.event.active) forceSimulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
        }

        this.impactTrace.update(journalCSVs[0], journalCSVs[1], journalCSVs[2]);
        // Update horizontalBars graph with above values
        this.horizontalBars.update(this.citedTab, this.citingTab, this.year, journal, journalCSVs[3]);
        this.journalInfoBox.update(journal, journalCSVs[3]);

        //update journalInfoBox on click
        nodes
            .on('click', function() {
                // console.log('hello', d3.select(this)._groups[0][0].__data__.id);
                d3.select('#network > svg').selectAll('circle').classed('selectedNode', false);
                d3.select(this).classed('selectedNode', true);
                let journalName = d3.select(this)._groups[0][0].__data__.id;
                journalInfoBox.update(journalName, journalCSVs[3]);
            });

        // highlight other charts on node hover
        nodes
            .on('mouseover', function(d) {
                for ( let child of d3.select('.citedBars')._groups[0][0].children) {
                    if(d.id === child.__data__.Journal) {
                        child.setAttribute('id', 'hlightCited');
                    }
                }
                for ( let child of d3.select('.citingBars')._groups[0][0].children) {
                    if(d.id === child.__data__.Journal) {
                        console.log('in child', child);
                        if(child.nodeName === 'rect') {
                            child.setAttribute('id', 'hlightCited');
                        } else if (child.nodeName === 'text') {
                            child.setAttribute('id', 'hlightBarText');
                        }

                    }
                }

            });
        nodes
            .on('mouseout', function(d) {
                for ( let child of d3.select('.citedBars')._groups[0][0].children) {
                    if(d.id === child.__data__.Journal) {
                        child.removeAttribute('id');
                    }
                }
                for ( let child of d3.select('.citingBars')._groups[0][0].children) {
                    if(d.id === child.__data__.Journal) {
                        child.removeAttribute('id');
                    }
                }
            });

        // Add zoom feature to FDN
        let zoom = d3.zoom()
            .on('zoom', () => {
                gWrap.attr('transform',d3.event.transform);
            });

        this.svg
            .call(zoom);
            // .on('wheel.zoom',null);

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

        // Auto-scroll to top of page when network is redrawn (or when page is reloaded)
        document.body.scrollTop = document.documentElement.scrollTop = 0;
	};


}
