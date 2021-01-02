#!/usr/bin/env node

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var lineIndex = 0

var numberOfBacteria = 0

var headNode = null
var currentNode = null

var nodesAtLevels = [] // index - level, subarray contains nodes at that level

rl.on('line', function (line) {
    // console.log('current line: ', line)
    // console.log('current lineIndex: ', lineIndex)
    if (lineIndex == 0) { // 1st line specifies numberOfBacteria

        numberOfBacteria = line * 1
        // console.log(`numberOfBacteria: ${numberOfBacteria}`)

    } else { // each subsequent line is an array in the matrix

        addElementToBinaryTree(line)

        if (lineIndex == numberOfBacteria) {
            // console.log('DONE! Results: ')

            var outputString = ""

            nodesAtLevels.forEach(level => {
                outputString += roundToTwo(level.reduce((a, b) => a + b) / level.length).toFixed(2)
                outputString += " "
            })

            console.log(outputString)

            // console.log("closing readline")
            rl.close()
            rl.removeAllListeners()
        }

    }
    lineIndex += 1
})

class BTNode {
    constructor(bacteriaID, hoursLived, parentID, level, offspringID1, offspringID2, offspring1, offspring2) {
        this.bacteriaID = bacteriaID;
        this.hoursLived = hoursLived;
        this.parentID = parentID;
        this.level = level;
        this.offspringID1 = offspringID1;
        this.offspringID2 = offspringID2;
        this.offspring1 = offspring1;
        this.offspring2 = offspring2;
    }
}

function traverseAndInsert(currentNode, newNode) {
    // console.log(`traverseAndInsert called with currentNode ${currentNode.bacteriaID} and newNode ${newNode.bacteriaID}`)

    if (currentNode == null || newNode == null) { return }

    // check if found:

    if (currentNode.offspringID1 == newNode.bacteriaID) { // spot found (set to offspring 1)

        // console.log(`currentNode.offspringID1 == newNode.bacteriaID (${newNode.bacteriaID})`)

        newNode.parentID = currentNode.bacteriaID
        newNode.level = currentNode.level + 1

        currentNode.offspring1 = newNode

        addToNodeLevels(newNode)

        return

    } else if (currentNode.offspringID2 == newNode.bacteriaID) { // spot found (set to offspring 2)
        // console.log(`currentNode.offspringID2 == newNode.bacteriaID (${newNode.bacteriaID})`)

        newNode.parentID = currentNode.bacteriaID
        newNode.level = currentNode.level + 1

        currentNode.offspring2 = newNode

        addToNodeLevels(newNode)

        return

    }

    // otherwise traverse

    if (currentNode.offspring1 != null) {
        traverseAndInsert(currentNode.offspring1, newNode)
    }

    if (currentNode.offspring2 != null) {
        traverseAndInsert(currentNode.offspring2, newNode)
    }
}

function addToNodeLevels(newNode) {
    if (nodesAtLevels[newNode.level] != null) {
        nodesAtLevels[newNode.level].push(newNode.hoursLived)
    } else {
        nodesAtLevels[newNode.level] = [newNode.hoursLived]
    }

    // console.log('addToNodeLevels called, nodesAtLevels:')
    // console.log(nodesAtLevels)
}

function addElementToBinaryTree(line) {
    // console.log(`addElementToBinaryTree called with ${line}`)
    const input = line.split(' ').map(el => el * 1)
    // console.log(input)

    const bacteriaID = input[0]
    const hoursLived = input[1]
    const parentID = null
    const level = null
    const offspringID1 = input[2] != -1 ? input[2] : null
    const offspringID2 = input[3] != -1 ? input[3] : null
    const offspring1 = null
    const offspring2 = null

    const newNode = new BTNode(bacteriaID, hoursLived, parentID, level, offspringID1, offspringID2, offspring1, offspring2)

    // populate the binary tree
    if (lineIndex == 1) { // set the head node

        headNode = newNode
        headNode.level = 0
        // console.log(headNode)

        nodesAtLevels[0] = [headNode.hoursLived]

    } else { // all other nodes: traverse the binary tree to find the right spot

        currentNode = headNode // start at the head with each new line (node)
        traverseAndInsert(currentNode, newNode)
        // console.log(`***BT: ${JSON.stringify(headNode)}`)

    }

    return
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}