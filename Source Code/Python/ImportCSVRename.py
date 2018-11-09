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
# print(NewFileNames)


# Finds the csv file and turn to json file
l = listdir(path)
for f in l:
    if f.find('.csv') != -1:
        print(f)
        if f == 'JournalProfileGrid.csv':
            JName = f
            csvfile = open(path + '/' + f,'r')
            jsonfile = open(NewFileNames[2],'w')
            print(jsonfile)
            fieldnames = ('Year','Total Cites', 'Journal Impact Factor', 'Impact Factor without Journal Self Cites', '5-Year Impact Factor'	'Immediacy Index',	'Citable Items', 'Cited Half-Life',	'Citing Half-life',	'Eigenfactor Score', 'Article Influence Score',	'% Articles in Citable Items', 'Normalized Eigenfactor', 'avgJifPercentile')
            reader = csv.DictReader(csvfile, fieldnames)
            for row in reader:
                json.dump(row, jsonfile)
                jsonfile.write('\n')

