// initiate necessary objects

// let forceDirectedNetwork = new ForceDirectedNetwork();

let searchBar = new searchBar();

let yearSlider = new YearSlider();

let horizontalBars = new HorizontalBars();

let impactTrace = new ImpactTrace();

let journalInfoBox = new JournalInfoBox();

// load all data
// begin with loading a single one... Nature!
// let profGrid = d3.csvParseRows("data/NATUREJournalProfileGrid.csv"); // all d3 commands look at first line only for header... looks like no way around modifying the csv
// console.log('profGrid', profGrid);
let initialYear = 2017;
let journalFiles = ["data/NATUREJournalProfileGrid.csv", "data/NATUREJournalCitedTab.csv", "data/NATUREJournalCitingTab.csv", "filtered data/All Journal Profile Grids.csv"];
let promises = [];
journalFiles.forEach( file => {
    promises.push(d3.csv(file));
});

let journalCSVs = undefined;
Promise.all(promises).then( data => {
    journalCSVs = data;
    // console.log('values', journalCSVs);
    let forceDirectedNetwork = new ForceDirectedNetwork(yearSlider, horizontalBars, impactTrace, journalInfoBox);
    forceDirectedNetwork.update(journalCSVs, initialYear);
});
// d3.csv("data/NATUREJournalProfileGrid.csv").then(data => {
//     console.log('profGrid',data);
// });
// d3.csv("data/NATUREJournalProfileGrid.csv").then(profGrid => {
//     console.log('profGrid', profGrid);
// });
// d3.csv("data/yearwiseWinner.csv").then(electionWinners => {
//     // console.log(electionWinners);
//     let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners);
//     yearChart.update();
// });


