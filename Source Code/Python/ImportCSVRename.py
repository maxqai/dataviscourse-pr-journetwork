import csv
from os import listdir
from os.path import isfile, join
import re


path = 'Source Code/data_presort'


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
print(csvs)
print(des_word)
