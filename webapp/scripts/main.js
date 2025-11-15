const inputSelect = document.getElementById('inputSelect');
const throughSelect = document.getElementById('throughSelect');
const outputSelect = document.getElementById('outputSelect');
const grid = document.getElementById('grid');
const rootNoteSelect = document.getElementById('rootNoteSelect');
const octaveSelect = document.getElementById('octaveSelect');

initPadGrid(grid);

initRootMidiNote(rootNoteSelect, octaveSelect);

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
        resetPadStatus(currentThrough);

        rootNoteSelect.addEventListener('change', (e) => updateRootNote(rootNoteSelect, octaveSelect, grid));
        octaveSelect.addEventListener('change', (e) => updateRootNote(rootNoteSelect, octaveSelect, grid));
    })
    .catch(err => {
        console.error("Errore WebMidi.js: " + err);
    });