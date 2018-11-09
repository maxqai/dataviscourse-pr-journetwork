import csv
from os import listdir, remove


path = 'Source Code/data_presort'
path2 = 'Source Code/data'
# Make sure wd = dataviscourse-pr-journetwork

# Finds the Names of the Files and Renames them Appropriately
csvs = []
l = listdir(path)
names = ['JournalProfileGrid.csv', 'JournalCitingTab.csv', 'JournalCitedTab.csv']
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
OldFileNames = []
[OldFileNames.append(path + '/' + f) for f in names]
print(OldFileNames)

# Store CSV as Python Object
Grid = []
Cite = []
Cited = []
for f in l:
    if f.find(".csv") != -1:
        if f == 'JournalProfileGrid.csv':
            JName = f
            csv1 = csv.reader(open(path + '/' + f, 'r'))
            for id, row1 in enumerate(csv1):
                if id > 0:
                    Grid.append(row1)
        elif f == 'JournalCitingTab.csv':
            JName = f
            csv2 = csv.reader(open(path + '/' + f, 'r'))
            for id, row2 in enumerate(csv2):
                if id > 0 and id < 102:
                    Cite.append(row2)
        elif f == 'JournalCitedTab.csv':
            JName = f
            csv3 = csv.reader(open(path + '/' + f, 'r'))
            for id, row3 in enumerate(csv3):
                if id > 0 and id < 102:
                    Cited.append(row3)

for i in range(0,len(Grid)):
    if i > 0:
        Grid[i].append(des_word)
    else:
        Grid[i].append("Journal")

for i in range(0, len(Cite)):
    if i > 0:
        Cite[i].append(des_word)
    else:
        Cite[i].append("Journal")

for i in range(0, len(Cited)):
    if i > 0:
        Cited[i].append(des_word)
    else:
        Cited[i].append("Journal")

Grid = Grid[:-2]
#
# print(Grid)
# print(Cite)
print(Cited)

for i in range(0, len(NewFileNames)):
    csvfile = open(NewFileNames[i], 'w', newline='')
    csvwriter = csv.writer(csvfile)
    if i == 0:
        for ii in range(0, len(Cited)):
            csvwriter.writerow(Cited[ii])
    elif i == 1:
        for ii in range(0, len(Cite)):
            csvwriter.writerow(Cite[ii])
    else:
        for ii in range(0, len(Grid)):
            csvwriter.writerow(Grid[ii])
    csvfile.close()

