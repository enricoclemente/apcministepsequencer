const inputSelect = document.getElementById('inputSelect');
const throughSelect = document.getElementById('throughSelect');
const outputSelect = document.getElementById('outputSelect');
const grid = document.getElementById('grid');

initPadGrid(grid);

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
    })
    .catch(err => {
        console.error("Errore WebMidi.js: " + err);
    });