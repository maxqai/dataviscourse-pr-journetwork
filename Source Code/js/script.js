// initiate necessary objects

let forceDirectedNetwork = new ForceDirectedNetwork();

let yearSlider = new YearSlider();

let horizontalBars = new HorizontalBars();

let impactTrace = new ImpactTrace();

let journalInfoBox = new JournalInfoBox();

// load all data
// begin with loading a single one... Nature!
// let profGrid = d3.csv("data/NATUREJournalProfileGrid.csv"); // all d3 commands look at first line only for header... looks like no way around modifying the csv
// console.log('profGrid', profGrid);
// d3.csvParse("data/NATUREJournalProfileGrid.csv").then(data => {
//     console.log(data);
// });
d3.csv("data/NATUREJournalProfileGrid.csv").then(profGrid => {
    console.log('profGrid', profGrid);
});
// d3.csv("data/yearwiseWinner.csv").then(electionWinners => {
//     // console.log(electionWinners);
//     let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners);
//     yearChart.update();
// });

// create first network, maybe first in alphabet? That with largest impact factor?