let currentInput = null;
let currentOutput = null;

function clearListeners(input) {
    if (input) {
        input.removeListener('noteon', 'all');
        input.removeListener('noteoff', 'all');
    }
}

function updateDeviceLists(inputSelect, outputSelect, status) {
    // salva selezioni attuali per ripristinarle
    const selectedInputId = inputSelect.value;
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
        status.textContent = "Nessun dispositivo MIDI di input disponibile.";
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
        status.textContent += " Nessun dispositivo MIDI di output disponibile.";
    }
}

function onInputChange(e, inputSelect, status) {
    clearListeners();
    const selectedId = inputSelect.value;
    currentInput = WebMidi.getInputById(selectedId);
    if (currentInput) {
        currentInput.addListener('noteon', 'all', e => {
            if (e.note.number >= 0 && e.note.number < 64) 
                setPadActive(currentOutput, e.note.number, true);
        });
        currentInput.addListener('noteoff', 'all', e => {
            if (e.note.number >= 0 && e.note.number < 64) 
                setPadActive(currentOutput, e.note.number, false);
        });
        status.textContent = 'Input MIDI selezionato: ' + currentInput.name + (currentOutput ? ', Output: ' + currentOutput.name : '');
    } else {
        status.textContent = 'Nessun input selezionato';
    }
}

function onOutputChange(status) {
    const selectedId = outputSelect.value;
    currentOutput = WebMidi.getOutputById(selectedId);
    resetPadStatus(currentOutput);
    status.textContent = (currentInput ? 'Input: ' + currentInput.name : 'Nessun input') + ', Output MIDI selezionato: ' + (currentOutput ? currentOutput.name : 'nessuno');
}


