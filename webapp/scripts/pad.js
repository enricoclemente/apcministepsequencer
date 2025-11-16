let currentPadGrid = createScaleMatrix(scales.none);    // all'inizio la griglia di pad segna solo ogni primo tono

const padLogger = createLogger("Pad");

function setPad(throughMidi, note, active) {
    const pad = document.getElementById('pad-' + (note + rootMidiNote));
    if (pad) pad.classList.toggle('active', active);
    if (throughMidi) {
        if (active) {
            throughMidi.send([0x90 + 0, note, 1]);
        } else {
            const row = 7 - parseInt(note / 8)
            const col = note % 8
            throughMidi.send([0x90 + 0, note, parseInt(currentPadGrid[row][col])]);
        }
    } else {
        console.error("There is not a valid midi through")
    }
}

function setAllPadStatus(throughMidi, scale = scales.none) {
    if (throughMidi) {
        let k = 0
        for (let i = 7; i >= 0; i--) {
            for (let j = 0; j < 8; j++) {
                currentPadGrid = createScaleMatrix(scale);
                padLogger.debug("setAllPadStatus", "currentPadGrid:\n" + prettyPrintMatrix(currentPadGrid));
                throughMidi.send([0x90 + 0, k, parseInt(currentPadGrid[i][j])]);
                k++
            }
        }
    } else {
        console.error("There is not a valid midi output")
    }
}

function createScaleMatrix(scalePattern, rows = 8, cols = 8) {
    const matrix = Array(rows).fill(null).map(() => Array(cols).fill(0));
    const scaleLen = scalePattern.length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const noteIndex = c + r * cols;
            const scaleNotePos = noteIndex % scaleLen;
            if (scalePattern[scaleNotePos] === 1) {
                matrix[rows - 1 - r][c] = (scaleNotePos === 0) ? 3 : 5;
            }
        }
    }

    return matrix;
}

function updateScale(scaleSelect, throughMidi, grid) {
    const selectedScale = scaleSelect.value;
    //padLogger.debug("updateScale", "selectedScale: " + selectedScale);
    setAllPadStatus(throughMidi, scales[selectedScale]);
    initPadGrid(grid)
}
