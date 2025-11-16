let currentInput = null;
let currentThrough = null;
let currentOutput = null;

let midiDevStatus = {
    input: null,
    through: null,
    output: null
}

let rootMidiNote = 0;

const activeMidiNotes = new Set();

function updateDeviceLists(inputSelect, throughSelect, outputSelect) {
    // salva selezioni attuali per ripristinarle
    const selectedInputId = inputSelect.value;
    const selectedThroughId = throughSelect.value;
    const selectedOutputId = outputSelect.value;

    // aggiorna input
    inputSelect.innerHTML = '';
    WebMidi.inputs.forEach(input => {
        const option = document.createElement('option');
        option.value = input.id;
        option.textContent = input.name;
        inputSelect.appendChild(option);
    });
    if (inputSelect.querySelector(`option[value="${selectedInputId}"]`)) {
        inputSelect.value = selectedInputId;
    } else if (WebMidi.inputs.length > 0) {
        inputSelect.value = WebMidi.inputs[0].id;
    } else {
        inputSelect.value = '';
        console.error("Nessun dispositivo MIDI di input disponibile");
    }

    // aggiorna through
    throughSelect.innerHTML = '';
    WebMidi.outputs.forEach(output => {
        const option = document.createElement('option');
        option.value = output.id;
        option.textContent = output.name;
        throughSelect.appendChild(option);
    });
    if (throughSelect.querySelector(`option[value="${selectedThroughId}"]`)) {
        throughSelect.value = selectedThroughId;
    } else if (WebMidi.outputs.length > 0) {
        throughSelect.value = WebMidi.outputs[0].id;
    } else {
        throughSelect.value = '';
        console.error("Nessun dispositivo MIDI di output disponibile");
    }

    // aggiorna output
    outputSelect.innerHTML = '';
    WebMidi.outputs.forEach(output => {
        const option = document.createElement('option');
        option.value = output.id;
        option.textContent = output.name;
        outputSelect.appendChild(option);
    });
    if (outputSelect.querySelector(`option[value="${selectedOutputId}"]`)) {
        outputSelect.value = selectedOutputId;
    } else if (WebMidi.outputs.length > 0) {
        outputSelect.value = WebMidi.outputs[0].id;
    } else {
        outputSelect.value = '';
        console.error("Nessun dispositivo MIDI di output disponibile");
    }
}

function clearListeners(input) {
    if (input) {
        input.removeListener('noteon', 'all');
        input.removeListener('noteoff', 'all');
    }
}

function onInputChange(e, inputSelect) {
    clearListeners();
    const selectedId = inputSelect.value;
    currentInput = WebMidi.getInputById(selectedId);
    if (currentInput) {
        currentInput.addListener('noteon', 'all', e => {
            if (e.note.number >= 0 && e.note.number < 64) {
                setPad(currentThrough, e.note.number, true);
                if (currentOutput) {
                    const midiNote = parseInt(e.note.number) + parseInt(rootMidiNote);
                    activeMidiNotes.add(midiNote);
                    currentOutput.send([0x90 + 0, midiNote, 127]);
                    identifyChordFromMidiNotes(Array.from(activeMidiNotes));
                } else {
                    console.error("There is not a valid midi output")
                }
            }
        });
        currentInput.addListener('noteoff', 'all', e => {
            if (e.note.number >= 0 && e.note.number < 64) {
                setPad(currentThrough, e.note.number, false);
                if (currentOutput) {
                    const midiNote = parseInt(e.note.number) + parseInt(rootMidiNote);
                    activeMidiNotes.delete(midiNote);
                    currentOutput.send([0x80 + 0, midiNote, 0]);
                    identifyChordFromMidiNotes(Array.from(activeMidiNotes));
                } else {
                    console.error("There is not a valid midi output")
                }
            }
        });
        midiDevStatus.input = currentInput.name;
        console.log(midiDevStatus);
    } else {
        console.error("There is not a valid midi input");
    }
}

function onThroughChange() {
    const selectedId = throughSelect.value;
    currentThrough = WebMidi.getOutputById(selectedId);
    setAllPadStatus(currentThrough);
    midiDevStatus.through = currentThrough.name;
    console.log(midiDevStatus);
}

function onOutputChange() {
    const selectedId = outputSelect.value;
    currentOutput = WebMidi.getOutputById(selectedId);
    midiDevStatus.output = currentOutput.name;
    console.log(midiDevStatus);
}

function updateRootNote(rootNoteSelect, octaveSelect, grid) {
    const root = rootNoteSelect.value;
    const octave = parseInt(octaveSelect.value);
    rootMidiNote = Utilities.toNoteNumber(root + octave);
    initPadGrid(grid);
    console.log("Nota scelta:", root + octave, "| Numero MIDI:", rootMidiNote);
}



