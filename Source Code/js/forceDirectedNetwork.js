// class implementing the forceDirectedNetwork
// adapted from votePercentageChart.js
class ForceDirectedNetwork {

    constructor(horizontalBars, impactTrace, journalInfoBox){
        // Make accessible
		this.horizontalBars = horizontalBars;
		this.impactTrace = impactTrace;
		this.journalInfoBox = journalInfoBox;

        //initialize svg elements, svg sizing
        this.margin = {top: 10, right: 120, bottom: 20, left: 50};
        let divForceDirectedNetwork = d3.select("#network").classed("network", true);

        //fetch the svg bounds
        this.svgBounds = divForceDirectedNetwork.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
        this.svgHeight = 930;

        //add the svg to the div
        this.svg = divForceDirectedNetwork.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

    };

    /**
     * Creates the forceDirectedNetwork, content and tool tips
     *
     * @param journalCSVs - loaded CSVs containing profileGrid, cited, citations
     * @param year - year for display
     * @param journal - journal to center
     * @param mapType - 'Citing' or 'Cited'
     */
	update (journalCSVs, year, journal, mapType){

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
            journalsLinkInfo = journalsLinkInfo.filter(d => {
                return d.citationJournalName !== d.mainJournalName;
            });
        }

        // get rid of journals that aren't in top 100 - need to check for every year.
        let tempJournalData = [];
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
            .range([rangeMin,rangeMax]);

        let forceData = {
            nodes: journalsNodeInfo.map((d,i) => {
                if(d.journal === journal) {
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
                    return d.id;})
                .distance(function(d) {
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
        d3.select('.everything').remove();
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
                if(d.id === journal){
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

        this.impactTrace.update(journalCSVs[0]);
        // Update horizontalBars graph with above values
        this.horizontalBars.update(this.citedTab, this.citingTab, this.year, journal, journalCSVs[3]);
        this.journalInfoBox.update(journal, journalCSVs[3]);

        //update journalInfoBox on click
        nodes
            .on('click', function() {
                d3.select('#network > svg').selectAll('circle').classed('selectedNode', false);
                d3.select(this).classed('selectedNode', true);
                let journalName = d3.select(this)._groups[0][0].__data__.id;
                journalInfoBox.update(journalName, journalCSVs[3]);
            });

        // highlight all charts on node hover
        nodes
            .on('mouseover', function(d) {
                d3.select(this)
                    .style('cursor','pointer')
                    .attr('id', 'hlightCited');
                for ( let child of d3.select('.citedBars')._groups[0][0].children) {
                    if(d.id === child.__data__.Journal) {
                        child.setAttribute('id', 'hlightCited');
                    }
                }
                for ( let child of d3.select('.citingBars')._groups[0][0].children) {
                    if(d.id === child.__data__.Journal) {
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
                d3.select(this)
                    .attr('id', d => {
                        if (d.id.toUpperCase() === journal.toUpperCase()) {
                            return 'FDNCenter'
                        } else {
                            return null
                        }
                    });
                for ( let child of d3.select('.citedBars')._groups[0][0].children) {
                    if (d.id === journal) {
                        if (d.id === child.__data__.Journal) {
                            child.setAttribute('id', 'selectedCited')
                        }
                    } else if(d.id === child.__data__.Journal) {
                        child.removeAttribute('id');
                    }
                }
                for ( let child of d3.select('.citingBars')._groups[0][0].children) {
                    if (d.id === journal) {
                        if (d.id === child.__data__.Journal) {
                            if (child.nodeName === 'rect') {
                                child.setAttribute('id', 'selectedCiting')
                            } else if (child.nodeName === 'text') {
                                child.setAttribute('id', 'selectedBarText')
                            }
                        }
                    } else if(d.id === child.__data__.Journal) {
                        child.removeAttribute('id');
                    }
                }
            });

        // On links hover, change color so that you can see where it goes to
        links
            .on('mouseover', function(d) {
                d3.select(this)
                    .attr('id', 'hlightLink');
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .attr('id', null)
            });

        // Add zoom feature to FDN
        let zoom = d3.zoom()
            .on('zoom', () => {
                gWrap.attr('transform',d3.event.transform);
            })
            .filter(function() {
                return d3.event.ctrlKey;
            });

        this.svg
            .call(zoom);

        // Add text instructions for zooming
        d3.select('#network > svg').selectAll('text').remove();
        this.svg.append('text')
            .text('CTRL + scroll to zoom')
            .attr('y', 30)
            .attr('x', 15)
            .classed('instruct', true);
        this.svg.append('text')
            .text('CTRL + drag to pan')
            .attr('y', 50)
            .attr('x', 15)
            .classed('instruct', true);

        // Auto-scroll to top of page when network is redrawn (or when page is reloaded)
        document.body.scrollTop = document.documentElement.scrollTop = 0;
	};


}
