// Enable WEBMIDI.js and trigger the onEnabled() function when ready
WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => {
        console.log(err)
        alert(err)
    });

// Function triggered when WEBMIDI.js is ready
function onEnabled() {

    if (WebMidi.inputs.length < 1) {
        document.body.innerHTML += "No input device detected.";
    } else {
        WebMidi.inputs.forEach((device, index) => {
            document.body.innerHTML += `${index}: ${device.name} <br>`;
        });
    }

    if (WebMidi.outputs.length < 1) {
        document.body.innerHTML += "No output device detected.";
    } else {
        WebMidi.outputs.forEach((device, index) => {
            document.body.innerHTML += `${index}: ${device.name} <br>`;
        });
    }

    const input = WebMidi.getInputByName("APC MINI")
    const output = WebMidi.getOutputByName("APC MINI")

    //console.log(matrixToAkai)
    let padsActive = new Map()
    // reset 
    for(const pad of matrixToAkai.keys()) {
        //console.log(pad)
        output.send([0x90 + 0, pad, 0]);
        if(!padsActive.has(pad)) {
            padsActive.set(pad, false)
        }
    }

    let k=0
    for(let i=7; i>=0; i--) {
        for(let j=0; j<8; j++) {
            console.log(k)
            const pad = matrixToAkai.get(k)
            console.log(pad)
            if(scale[i][j] === 1) {
                output.send([0x90 + 0, k, 3]);
            }
            k++
        }
    }

    console.log(padsActive)

    input.channels[1].addListener("noteon", e => {
        return
        console.log(e)
        const pad = e.dataBytes[0]
        document.body.innerHTML += `From AKAI ${pad} to MIDI ${akaiToMatrix.get(e.dataBytes[0])}<br>`;

        if(output) {
            console.log(padsActive[pad])
            console.log(padsActive[pad] ? 0 : 3)
            output.send([0x90 + 0, pad, padsActive[pad] ? 0 : 3]);
            padsActive[pad] = !padsActive[pad]
        }
    });
}
