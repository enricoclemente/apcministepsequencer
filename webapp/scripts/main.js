const inputSelect = document.getElementById('inputSelect');
const throughSelect = document.getElementById('throughSelect');
const outputSelect = document.getElementById('outputSelect');
const grid = document.getElementById('grid');
const rootNoteSelect = document.getElementById('rootNoteSelect');
const octaveSelect = document.getElementById('octaveSelect');
const scaleSelect = document.getElementById('scaleSelect');


initPadGrid(grid);

initRootMidiNote(rootNoteSelect, octaveSelect);

initScales(scaleSelect);

WebMidi.enable()
    .then(() => {
        // Aggiorna liste dispositivi iniziali
        updateDeviceLists(inputSelect, throughSelect, outputSelect);

        // Imposta event listeners selezione
        inputSelect.addEventListener('change', (e) => onInputChange(e, inputSelect));
        throughSelect.addEventListener('change', (e) => onThroughChange());
        outputSelect.addEventListener('change', (e) => onOutputChange());

        WebMidi.addListener('connected', e => {
            updateDeviceLists(inputSelect, throughSelect, outputSelect);
        });

        WebMidi.addListener('disconnected', e => {
            updateDeviceLists(inputSelect, throughSelect, outputSelect);
        });

        // Selezione iniziale di input/output e attivazione listener
        onInputChange(null, inputSelect);
        onThroughChange()
        onOutputChange();
        setAllPadStatus(currentThrough);

        rootNoteSelect.addEventListener('change', (e) => updateRootNote(rootNoteSelect, octaveSelect, grid));
        octaveSelect.addEventListener('change', (e) => updateRootNote(rootNoteSelect, octaveSelect, grid));
        scaleSelect.addEventListener('change', (e) => updateScale(scaleSelect, currentThrough, grid));
    })
    .catch(err => {
        console.error("Errore WebMidi.js: " + err);
    });


function initPadGrid(grid) {
    grid.innerHTML = '';

    let padNotes = [];
    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            let note = row * 8 + col + rootMidiNote;
            padNotes.push(note);
        }
    }

    padNotes.forEach(note => {
        const pad = document.createElement('div');
        pad.classList.add('pad');
        const row = 7 - parseInt((note - rootMidiNote) / 8)
        const col = (note - rootMidiNote) % 8

        if (currentPadGrid) {
            if (currentPadGrid[row][col] === 3) {
                pad.classList.add('pad-main-tone');
            } else if(currentPadGrid[row][col] === 5){
                pad.classList.add('pad-scale-tone');
            }
        }

        pad.id = 'pad-' + note;

        const labelNum = document.createElement('div');
        labelNum.classList.add('pad-label-num');
        labelNum.textContent = note;

        const labelNote = document.createElement('div');
        labelNote.classList.add('pad-label-note');
        labelNote.textContent = Utilities.toNoteIdentifier(note);

        pad.appendChild(labelNum);
        pad.appendChild(labelNote);
        grid.appendChild(pad);
    });
}

function initRootMidiNote(rootNoteSelect, octaveSelect) {
    for (let note of NOTE_NAMES) {
        const option = document.createElement("option");
        option.value = note;
        option.textContent = note;
        rootNoteSelect.appendChild(option);
    }

    for (let octave of OCTAVES) {
        const option = document.createElement("option");
        option.value = octave;
        option.textContent = String(octave);
        octaveSelect.appendChild(option);
    }
}

function initScales(scaleSelect) {
    Object.keys(scales).forEach(scaleName => {
        const option = document.createElement('option');
        option.value = scaleName;
        option.text = scaleName;
        scaleSelect.appendChild(option);
    });
}