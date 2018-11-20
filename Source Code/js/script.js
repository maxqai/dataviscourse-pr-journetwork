
let searchBar = new SearchBar();
let uInput = d3.select('#uinput');
uInput.on('click', function() {
    uInput.on('keyup', function() {
        searchBar.update(document.getElementById('uinput').value);
    })
});

let yearSlider = new YearSlider();

let horizontalBars = new HorizontalBars();

let impactTrace = new ImpactTrace();

let journalInfoBox = new JournalInfoBox();

// initiate necessary objects

// let forceDirectedNetwork = new ForceDirectedNetwork();

// load all data
// begin with loading a single one... Nature!
// let profGrid = d3.csvParseRows("data/NATUREJournalProfileGrid.csv"); // all d3 commands look at first line only for header... looks like no way around modifying the csv
// console.log('profGrid', profGrid);
let initialYear = 2017;
let initialJournal = 'NATURE';
// let journalFiles = ["data/NATUREJournalProfileGrid.csv", "data/NATUREJournalCitedTab.csv", "data/NATUREJournalCitingTab.csv", "filtered data/AllJournalCitedTab.csv", "filtered data/AllJournalCitingTab.csv", "filtered data/AllJournalProfileGrid.csv"];
let journalFiles = ["filtered data/AllJournalProfileGrid.csv", "filtered data/AllJournalCitedTab.csv", "filtered data/AllJournalCitingTab.csv"];
let promises = [];
journalFiles.forEach( file => {
    promises.push(d3.csv(file));
});
promises.push(d3.json('data/100_Top_Journals.json'))

// let journalAbbreviations = undefined;
// d3.json('data/100_Top_Journals.json').then( d=> {
//     console.log('journalAbbrev d', d);
//     journalAbbreviations = d;
//     // journalAbbreviations = {
//     //     fullName: d['Full Journal Title'],
//     //     title29: d['Title29'],
//     //     title20: d['Title20']
//     }
// );
// console.log('journalAbbreviations', journalAbbreviations);

// let journalData = undefined;
Promise.all(promises).then( data => {
    let journalData = [];
    // change journal references to full journal name
    //journalProfileGrid
    // console.log('data', data);
    for(i=0; i < 3; i++) {
        // console.log('data i', data[i]);
        data[i].forEach( d => {
            // console.log('d Journal', d.Journal.toUpperCase());
            data[3].forEach( jName => {
                if(jName.Title20.toUpperCase() === d.Journal.toUpperCase()) {
                    d.Journal = jName['Full Journal Title'];
                    // console.log('in Title20');
                } else if(jName.Title29.toUpperCase() === d.Journal.toUpperCase()) {
                    d.Journal = jName['Full Journal Title'];
                    // console.log('in Title29');
                } else if(jName['Full Journal Title'].toUpperCase() === d.Journal.toUpperCase()) {
                    d.Journal = jName['Full Journal Title'];
                    // console.log('in Full journal Title');
                }else {
                    // console.log('didnt match any');
                }
            })
        });
        // case for 'Citing Journal' in journalsCitedTab
        if(i === 1) {
            data[i].forEach( d => {
                // console.log('d citing journal', d['Citing Journal']);
                data[3].forEach( jName => {
                    if (jName.Title20.toUpperCase() === d['Citing Journal'].toUpperCase()) {
                        d['Citing Journal'] = jName['Full Journal Title'];
                        // console.log('in Title20');
                    } else if (jName.Title29.toUpperCase() === d['Citing Journal'].toUpperCase()) {
                        d['Citing Journal'] = jName['Full Journal Title'];
                        // console.log('in Title29');
                    } else if (jName['Full Journal Title'].toUpperCase() === d['Citing Journal'].toUpperCase()) {
                        d['Citing Journal'] = jName['Full Journal Title'];
                        // console.log('in Full journal Title');
                    } else {
                        // console.log('didnt match any');
                    }
                })
            })
        }
        // case for 'Cited Journal' in journalsCitingTab
        if(i === 2) {
            data[i].forEach( d => {
                data[3].forEach( jName => {
                    if (jName.Title20.toUpperCase() === d['Cited Journal'].toUpperCase()) {
                        d['Cited Journal'] = jName['Full Journal Title'];
                        // console.log('in Title20');
                    } else if (jName.Title29.toUpperCase() === d['Cited Journal'].toUpperCase()) {
                        d['Cited Journal'] = jName['Full Journal Title'];
                        // console.log('in Title29');
                    } else if (jName['Full Journal Title'].toUpperCase() === d['Cited Journal'].toUpperCase()) {
                        d['Cited Journal'] = jName['Full Journal Title'];
                        // console.log('in Full journal Title');
                    } else {
                        // console.log('didnt match any');
                    }
                })
            })
        }
        journalData.push(data[i]);
    }

    // console.log('fixedJournalData', journalData);
    let forceDirectedNetwork = new ForceDirectedNetwork(yearSlider, horizontalBars, impactTrace, journalInfoBox);
    forceDirectedNetwork.update(journalData, initialYear, initialJournal);
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


