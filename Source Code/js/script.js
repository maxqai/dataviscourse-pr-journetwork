
let initialYear = 2017;

// let yearSlider = new YearSlider(initialYear);

let horizontalBars = new HorizontalBars();

let impactTrace = new ImpactTrace();

let journalInfoBox = new JournalInfoBox();


// load all data
let initialJournal = 'Nature';
let journalFiles = ["filtered data/AllJournalProfileGrid.csv", "filtered data/AllJournalCitedTab.csv", "filtered data/AllJournalCitingTab.csv"];
let promises = [];
journalFiles.forEach( file => {
    promises.push(d3.csv(file));
});
promises.push(d3.json('data/100_Top_Journals.json'));


Promise.all(promises).then( data => {
    let journalData = [];
    // change journal references to full journal name

    //journalProfileGrid
    for(i=0; i < 3; i++) {
        data[i].forEach( d => {
            data[3].forEach( jName => {
                if(jName.Title20.toUpperCase() === d.Journal.toUpperCase()) {
                    d.Journal = jName['Full Journal Title'];
                } else if(jName.Title29.toUpperCase() === d.Journal.toUpperCase()) {
                    d.Journal = jName['Full Journal Title'];
                } else if(jName['Full Journal Title'].toUpperCase() === d.Journal.toUpperCase()) {
                    d.Journal = jName['Full Journal Title'];
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
                    } else if (jName.Title29.toUpperCase() === d['Citing Journal'].toUpperCase()) {
                        d['Citing Journal'] = jName['Full Journal Title'];
                    } else if (jName['Full Journal Title'].toUpperCase() === d['Citing Journal'].toUpperCase()) {
                        d['Citing Journal'] = jName['Full Journal Title'];
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
                    } else if (jName.Title29.toUpperCase() === d['Cited Journal'].toUpperCase()) {
                        d['Cited Journal'] = jName['Full Journal Title'];
                    } else if (jName['Full Journal Title'].toUpperCase() === d['Cited Journal'].toUpperCase()) {
                        d['Cited Journal'] = jName['Full Journal Title'];
                    }
                })
            })
        }
        journalData.push(data[i]);


    }


    // get rid of journals that aren't in top 100
    let tempJournalData = [];
    journalData[1].forEach( d => {
        if(d['Citing Journal'] === 'ALL Journals') {
            tempJournalData.push(d);
        }
        data[3].forEach( jName => {
            // if((jName['Full Journal Title'] === d['Citing Journal']) || (d['Citing Journal'] === 'ALL Journals')) {
            if((jName['Full Journal Title'] === d['Citing Journal'])) {
                tempJournalData.push(d);
            }
        })
    });
    journalData[1] = tempJournalData;

    tempJournalData = [];
    journalData[2].forEach( d => {
        if(d['Cited Journal'] === 'ALL Journals'){
            tempJournalData.push(d);
        }
        data[3].forEach( jName => {
            if((jName['Full Journal Title'] === d['Cited Journal'])) {
                tempJournalData.push(d);
                // console.log('temp', d);
            }
        })
    });
    journalData[2] = tempJournalData;

    journalData[3] = data[3]; // set up to pass top 100 info with journal info and abbreviations

    let forceDirectedNetwork = new ForceDirectedNetwork(horizontalBars, impactTrace, journalInfoBox);
    forceDirectedNetwork.update(journalData, initialYear, initialJournal, 'Cited');

    let searchBar = new SearchBar(forceDirectedNetwork);
    let yearSlider = new YearSlider(forceDirectedNetwork, journalData, initialYear, initialJournal, 'Cited');

    let uInput = d3.select('#uinput');
    uInput.on('click', function() {
        uInput.on('keyup', function() {
            // searchBar.update(document.getElementById('uinput').value, data[3]);
            searchBar.update(document.getElementById('uinput').value, journalData, initialYear, 'Cited');
        })
    });
});
