// initiate necessary objects

let forceDirectedNetwork = new ForceDirectedNetwork();

let yearSlider = new YearSlider();

let horizontalBars = new HorizontalBars();

let impactTrace = new ImpactTrace();

let journalInfoBox = new JournalInfoBox();

// load all data
const fs = require('fs');
const dir = './data';

fs.readdir(dir, (err, files) => {
  console.log(files.length);
});
// create first network, maybe first in alphabet? That with largest impact factor?