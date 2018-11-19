import os
import pandas as pd

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)
pd.set_option('display.max_colwidth', -1)

cd = os.chdir('C:/Users/bphil/Documents/Data Visualization/JourNetwork/dataviscourse-pr-journetwork/Source Code/data')
files = os.listdir(cd)

count = 0
for ll in range(0, len(files)):
    str = files[ll].find('JournalCitedTab.csv') # Swap with a name = ['JournalProfileGrid.csv', 'JournalCitingTab.csv', 'JournalCitedTab.csv']
    if str > -1:
        if count is 0:
            print(files[ll])
            JIF = pd.read_csv(files[ll])
            count += 1
        else:
            print(files[ll])
            csv = pd.read_csv(files[ll])
            frames = [JIF, csv]
            JIF = pd.concat(frames)
JIF.to_csv('C:/Users/bphil/Documents/Data Visualization/JourNetwork/dataviscourse-pr-journetwork/Source Code/filtered data/AllJournalCitedTab.csv')
