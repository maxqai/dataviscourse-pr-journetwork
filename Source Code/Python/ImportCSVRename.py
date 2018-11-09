import csv
from os import listdir
from os.path import isfile, join
import re
import json


path = 'Source Code/data_presort'
path2 = 'Source Code/data'
# Make sure wd = dataviscourse-pr-journetwork

# Finds the Names of the Files and Renames them Appropriately
csvs = []
l = listdir(path)
for f in l:
    if f.find('.csv') != -1:
        if f == 'JournalProfileGrid.csv':
            JName = f
            with open(path + '/' + JName) as f1:
                for idx, line in enumerate(f1):
                    if idx == 0:
                        word = line.split(',')
                        if word[0].find('Journal Profile: ') == 0:
                            des_word = word[0][17::]
            csvs.append(f)
        elif f == "JournalCitingTab.csv" or f == "JournalCitedTab.csv":
            csvs.append(f)

NewFileNames = []
[NewFileNames.append(path2 + '/' + des_word + f) for f in csvs]
print(NewFileNames)

# Store CSV as Python Object
Grid = []
Cite = []
Cited = []
for f in l:
    if f.find(".csv") != -1:
        if f == 'JournalProfileGrid.csv':
            JName = f
            csv1 = csv.reader(open(path + '/' + f, 'r'))
            for id, row in enumerate(csv1):
                if id > 0:
                    Grid.append(row)
        elif f == 'JournalCitingTab.csv':
            JName = f
            csv1 = csv.reader(open(path + '/' + f, 'r'))
            for id, row in enumerate(csv1):
                if id > 0 and id < 104:
                    Cite.append(row)
        elif f == 'JournalCitedTab.csv':
            JName = f
            csv1 = csv.reader(open(path + '/' + f, 'r'))
            for id, row in enumerate(csv1):
                if id > 0 and id < 104:
                    Cited.append(row)

for i in range(0,len(Grid)):
    Grid[i].append(des_word)
for i in range(0, len(Cite)):
    Cite[i].append(des_word)

for i in range(0, len(Cited)):
    Cited[i].append(des_word)

Grid = Grid[:-2]
print(Grid)
print(Cite)
print(Cited)

for i in range(0, len(NewFileNames)):
    csvfile = open(NewFileNames[i], 'w')
    csvwriter = csv.writer(csvfile)
    for ii in range(0,len(Grid)):
        csvwriter.writerow(Grid[ii])
    csvfile.close()
