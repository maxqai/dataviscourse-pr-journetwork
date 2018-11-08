from os import listdir

# get names of csv's categorized by type
allCSVs = listdir('data')
print(allCSVs)

# https://docs.python.org/3/howto/regex.html
journalCitedList = []
for i in range(len(allCSVs)):
    if allCSVs[i].find('JournalCitedTab'):
        journalCitedList.push(allCSVs[i])

