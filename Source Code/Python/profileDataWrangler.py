from os import listdir
import csv
import re

def is_float(string):
    try:
        float(string)
        return True
    except ValueError:
        return False

## find all files with for profileGrid
# ensure working directory is set to 'Source Code'
path = 'data'

allFiles = listdir(path)
# print('allFiles', allFiles)
journalProfGrid = []
for file in allFiles:
    if file.find('JournalProfileGrid.csv') != -1:
        # print('file', file)
        journalProfGrid.append(file)

# print('journalProfGridPost', journalProfGrid)

## compile list of journal names
journalNamePattern = re.compile('Journal Profile: ')
journalInfo = {}
for profGrid in journalProfGrid:
    # print(path+profGrid)
    with open(path+'/'+profGrid) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter = ',')
        # print('csvreader', csv_reader)
        for row in csv_reader:
            print('row', row)
            if journalNamePattern.match(row[0]) != None:
                finalIndex = journalNamePattern.match(row[0]).end()
                # journalName = {row[0][finalIndex::]: {'Years': []}}
                journalName = row[0][finalIndex::]
                # journalInfo.append(journalName)
                journalInfo[journalName] = {'Years': [], 'impactFactor': []}
            if str.isdigit(row[0]):
                journalInfo[journalName]['Years'].append(int(row[0]))
            if is_float(row[2]):
                journalInfo[journalName]['impactFactor'].append(float(row[2]))

print('journalNames', journalInfo)