const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];

const chords = {
	major: [0, 4, 7],
	minor: [0, 3, 7],
	diminished: [0, 3, 6],
	augmented: [0, 4, 8],
	major7: [0, 4, 7, 11],
	minor7: [0, 3, 7, 10],
	dominant7: [0, 4, 7, 10],
	major9: [0, 4, 7, 11, 14],
	minor9: [0, 3, 7, 10, 14],
	dominant9: [0, 4, 7, 10, 14],
	major11: [0, 4, 7, 11, 14, 17],
	minor11: [0, 3, 7, 10, 14, 17],
	dominant11: [0, 4, 7, 10, 14, 17],
	major13: [0, 4, 7, 11, 14, 17, 21],
	minor13: [0, 3, 7, 10, 14, 17, 21],
	dominant13: [0, 4, 7, 10, 14, 17, 21],
	sus2: [0, 2, 7],
	sus4: [0, 5, 7],
	halfDiminished: [0, 3, 6, 10]
};

const logger = createLogger("Notes");

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function identifyChordFromMidiNotes(midiNotes) {
	logger.debug("identifyChordFromMidiNotes", 
					"midiNotes: " + midiNotes.join(' ') + " | " + midiNotes.map(note => Utilities.toNoteIdentifier(note)).join(' '));
	const chord = document.getElementById('chord');
	chord.innerHTML = "";
	if (midiNotes.length === 0) return;

	let notes = Array.from(new Set(midiNotes)).sort((a, b) => a - b);
	logger.debug("identifyChordFromMidiNotes", 
					"notes: " + notes.join(' ') + " | " + notes.map(note => Utilities.toNoteIdentifier(note)).join(' '));
	for (let i = 0; i < notes.length; i++) {
		const root = notes[i];
		const intervals = Array.from(new Set(notes.map(n => (n - root + 12) % 12))).sort((a, b) => a - b);
		logger.debug("identifyChordFromMidiNotes", 
						"Intervals: " + intervals.join(" "));
		for (const [name, pattern] of Object.entries(chords)) {
			if (arraysEqual(intervals, pattern)) {
				const bassNote = notes[0];
				const inversion = root === bassNote ? '' : ` (inversione con basso ${Utilities.toNoteIdentifier(bassNote)})`;
				
				chord.innerHTML = `${Utilities.toNoteIdentifier(root)} ${name}${inversion}`;
				logger.info("identifyChordFromMidiNotes", 
								`${Utilities.toNoteIdentifier(root)} ${name}${inversion} | ${notes.map(note => Utilities.toNoteIdentifier(note)).join(' ')}`);
			}
		}
	}
}

const akaiToMatrix = new Map([
	// row 0
	[0, 56],
	[1, 57],
	[2, 58],
	[3, 59],
	[4, 60],
	[5, 61],
	[6, 62],
	[7, 63],
	// row 1
	[8, 48],
	[9, 49],
	[10, 50],
	[11, 51],
	[12, 52],
	[13, 53],
	[14, 54],
	[15, 55],
	// row 2
	[16, 40],
	[17, 41],
	[18, 42],
	[19, 43],
	[20, 44],
	[21, 45],
	[22, 46],
	[23, 47],
	// row 3
	[24, 32],
	[25, 33],
	[26, 34],
	[27, 35],
	[28, 36],
	[29, 37],
	[30, 38],
	[31, 39],
	// row 4
	[32, 24],
	[33, 25],
	[34, 26],
	[35, 27],
	[36, 28],
	[37, 29],
	[38, 30],
	[39, 31],
	// row 5
	[40, 16],
	[41, 17],
	[42, 18],
	[43, 19],
	[44, 20],
	[45, 21],
	[46, 22],
	[47, 23],
	// row 6
	[48, 8],
	[49, 9],
	[50, 10],
	[51, 11],
	[52, 12],
	[53, 13],
	[54, 14],
	[55, 15],
	// row 7
	[56, 0],
	[57, 1],
	[58, 2],
	[59, 3],
	[60, 4],
	[61, 5],
	[62, 6],
	[63, 7],
]);

const matrixToAkai = new Map([
	// row 0
	[56, 0],
	[57, 1],
	[58, 2],
	[59, 3],
	[60, 4],
	[61, 5],
	[62, 6],
	[63, 7],
	// row 1
	[48, 8],
	[49, 9],
	[50, 10],
	[51, 11],
	[52, 12],
	[53, 13],
	[54, 14],
	[55, 15],
	// row 2
	[40, 16],
	[41, 17],
	[42, 18],
	[43, 19],
	[44, 20],
	[45, 21],
	[46, 22],
	[47, 23],
	// row 3
	[32, 24],
	[33, 25],
	[34, 26],
	[35, 27],
	[36, 28],
	[37, 29],
	[38, 30],
	[39, 31],
	// row 4
	[24, 32],
	[25, 33],
	[26, 34],
	[27, 35],
	[28, 36],
	[29, 37],
	[30, 38],
	[31, 39],
	// row 5
	[16, 40],
	[17, 41],
	[18, 42],
	[19, 43],
	[20, 44],
	[21, 45],
	[22, 46],
	[23, 47],
	// row 6
	[8, 48],
	[9, 49],
	[10, 50],
	[11, 51],
	[12, 52],
	[13, 53],
	[14, 54],
	[15, 55],

	[0, 56],
	[1, 57],
	[2, 58],
	[3, 59],
	[4, 60],
	[5, 61],
	[6, 62],
	[7, 63],
]);

