import os

ignoreList = []

def walk(folder):
    global totalLOC

    for f in os.listdir(folder):
        if f.startswith('.'):
            continue
        if f.endswith('css'):
            continue

        fpath = folder + '/' + f
        if os.path.isdir(fpath):
            walk(fpath)
        else:
            loc = len(open(fpath).readlines())
            totalLOC += loc
            print(fpath, loc)

totalLOC = 0

walk('./react-extension/src')

print(totalLOC)

# react-extension: 3893
# bg.js: 121
# content.js: 30
# devtools.js: 53
# helpers.js: 685
# cl.js: 402