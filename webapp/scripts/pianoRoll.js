const inputSelect = document.getElementById('inputSelect');
const outputSelect = document.getElementById('outputSelect');
const midiDevStatus = document.getElementById('status');
const grid = document.getElementById('grid');



initPadGrid(grid);

WebMidi.enable()
    .then(() => {
        // Aggiorna liste dispositivi iniziali
        updateDeviceLists(inputSelect, outputSelect, midiDevStatus);

        // Imposta event listeners selezione
        inputSelect.addEventListener('change', (e) => onInputChange(e, inputSelect, midiDevStatus));
        outputSelect.addEventListener('change', (e) => onOutputChange(midiDevStatus));

        WebMidi.addListener('connected', e => {
            updateDeviceLists(inputSelect, outputSelect, midiDevStatus);
        });

        WebMidi.addListener('disconnected', e => {
            updateDeviceLists(inputSelect, outputSelect, midiDevStatus);
        });


        // Selezione iniziale di input/output e attivazione listener
        onInputChange(null, inputSelect, midiDevStatus);
        onOutputChange(midiDevStatus);
        resetPadStatus(currentOutput);
    })
    .catch(err => {
        document.getElementById('status').textContent = "Errore WebMidi.js: " + err;
    });