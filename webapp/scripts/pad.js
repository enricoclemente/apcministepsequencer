const padConf = [
    [0, 0, 0, 0, 5, 0, 0, 0],
    [5, 0, 0, 0, 3, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0],
    [5, 0, 0, 0, 3, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0],
    [5, 0, 0, 0, 3, 0, 0, 0],
]

function initPadGrid(grid) {
    // Crea 64 pad dal 0 al 63 in griglia 8x8 Akai (riga 7 a 0 invertita)
    let padNotes = [];
    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            let note = row * 8 + col;
            padNotes.push(note);
        }
    }

    padNotes.forEach(note => {
        const pad = document.createElement('div');
        pad.classList.add('pad');
        pad.id = 'pad-' + note;

        const labelNum = document.createElement('div');
        labelNum.classList.add('pad-label-num');
        labelNum.textContent = note;

        const labelNote = document.createElement('div');
        labelNote.classList.add('pad-label-note');
        labelNote.textContent = midiNoteToName(note);

        pad.appendChild(labelNum);
        pad.appendChild(labelNote);
        grid.appendChild(pad);
    });
}

function setPadActive(output, note, active) {
    const pad = document.getElementById('pad-' + note);
    if (pad) pad.classList.toggle('active', active);
    if (output) {
        if (active) {
            output.send([0x90 + 0, note, 1]);
        } else {
            const row = 7 - parseInt(note / 8)
            const col = note % 8
            output.send([0x90 + 0, note, parseInt(padConf[row][col])]);
        }
    } else {
        console.error("There is not a valid midi output")
    }
}

function resetPadStatus(output) {
    if (output) {
        let k = 0
        for (let i = 7; i >= 0; i--) {
            for (let j = 0; j < 8; j++) {
                output.send([0x90 + 0, k, parseInt(padConf[i][j])]);
                k++
            }
        }
    } else {
        console.error("There is not a valid midi output")
    }
}