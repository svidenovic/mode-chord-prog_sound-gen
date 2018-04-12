
import re, os;
from pathlib import Path;
import pysynth_b, pysynth_e, pysynth_s;
from pydub import AudioSegment

def get_pysynth( _type ):
	if _type == 1:
		return pysynth_b;
	elif _type == 2:
		return pysynth_e;
	else:
		return pysynth_s;


chromatic_scale = [
	'a','a#','b','c','c#','d','d#','e','f','f#','g','g#'
];


# octave = [1,7]
def get_relative_note( root_note, interval, octave ):
	interval_values = {
		'1':0, '1#':1, '2':2, '2#':3, '3':4, '4':5, '4#':6, '5':7, '5#':8, '6':9, '6#':10, '7':11
	};
	offset = interval_values [interval];
	
	root_note_i = -1;
	for n in range(0,len(chromatic_scale)):
		if chromatic_scale[n] == root_note:
			root_note_i = n; break;
	
	if root_note_i == -1:
		return None;
	
	rel_note = root_note_i + offset;
	if rel_note < 0:
		rel_note += 12;
	elif rel_note > 11:
		rel_note -= 12;
	
	return chromatic_scale [rel_note] + octave;


# octaves = [ root, third, fifth ] default value is 4
def get_triad_notes( chord, octaves ):
	chord = chord.strip().lower();
	
	rest = 'r';
	if chord == rest:
		return [rest,rest,rest];
	
	chord_data = re.findall( r'^([a-g])(#)?(m|dim)?$', chord );
	if chord_data:
		root_note = chord_data[0][0];
		sharp = chord_data[0][1];
		triad_type = chord_data[0][2]; # 'm' = minor, '' = major, 'dim' = diminished
		
		if sharp:
			root_note += sharp;
			
		while len(octaves) < 3:
			octaves.append('4');
		
		chord_notes = [];
		if triad_type == 'm':
			chord_notes = [
				get_relative_note( root_note, '1', octaves[0] ),
				get_relative_note( root_note, '2#', octaves[1] ),
				get_relative_note( root_note, '5', octaves[2] )
			];
		elif triad_type == 'dim':
			chord_notes = [
				get_relative_note( root_note, '1', octaves[0] ),
				get_relative_note( root_note, '2#', octaves[1] ),
				get_relative_note( root_note, '4#', octaves[2] )
			];
		else:
			chord_notes = [
				get_relative_note( root_note, '1', octaves[0] ),
				get_relative_note( root_note, '3', octaves[1] ),
				get_relative_note( root_note, '5', octaves[2] )
			];
		
		return chord_notes;
	
	else:
		return None;


# octaves = [ triad_root, triad_third, triad_fifth, mode_root ]
def get_slashChord_notes( chord, octaves ):
	chord = chord.strip().lower();
	
	rest = 'r';
	if chord == rest:
		return [rest,rest,rest,rest];
	
	while len(octaves) < 4:
		octaves.append('4');
	
	tmp = chord.split('/');
	triad = tmp[0];
	mode_root = tmp[1];
	
	triad = get_triad_notes( triad, octaves[0:-1] );
	mode_root = get_relative_note( mode_root, '1', octaves[-1] );
	
	if triad == None or mode_root == None:
		return None;
	
	chord_notes = [];
	chord_notes.append( mode_root );
	for note in triad:
		chord_notes.append( note );
	
	return chord_notes;


def get_note_tracks( chords, durations ):
	note_tracks = [];
	
	for i in range(0,len(chords)):
		
		if len(note_tracks) == 0:
			for note in chords[i]:
				note_tracks.append([]);
		
		for n in range(0,len(chords[i])):
			chord_note = chords[i][n];
			note_tracks[n].append([ chord_note, durations[i] ]);
	
	return note_tracks;
	
def convert_to_tuple( arr ):
	arr_tuples = [];
	for a in arr:
		code_as_string = str(a).replace('[','(').replace(']',')');
		arr_tuples.append( eval(code_as_string) );
	return arr_tuples;
	
def create_end_wav( note_tracks, file_name, pysynth_ ):
	sounds = [];
	wav_tracks = [];
	
	for i in range(0,len(note_tracks)):
		wav_tracks.append( 'track_'+str(i+1)+'.wav' );
		pysynth_.make_wav( note_tracks[i], fn=wav_tracks[i] );
		sounds.append( AudioSegment.from_wav( wav_tracks[i] ) );
		
	outsound = sounds[0];
	for s in range(1, len(sounds)):
		outsound = outsound.overlay(sounds[s]);
	
	print(' Creating {} '.format(file_name));
	outsound.export( file_name, format='wav');
	
	for wt in wav_tracks:
		os.remove(wt);
		
	print(' All Done ');



def create_WAV_from_timeline( mytimeline, wav_path, pysynth_ ):
	if len(mytimeline.get_timeline()) < 2:
		return None;
	
	chords = [];
	chord_durations = [];
	
	for chord in mytimeline.get_timeline():
		if chord.name == 'Pause':
			slashChord = get_slashChord_notes( 'R', None );
			chords.append( slashChord );
			chord_durations.append( chord.duration );
		
		else:
			chord.name = chord.name.replace('s','#');
			
			octave_vector = [];
			for i in range(0,4):
				octave_vector.append( str(chord.octave) );
			
			slashChord = get_slashChord_notes( chord.name, octave_vector );
			chords.append( slashChord );
			
			chord_durations.append( chord.duration );
	
	note_tracks = get_note_tracks( chords, chord_durations );
	note_tracks = convert_to_tuple( note_tracks );
	
	create_end_wav( note_tracks, wav_path, pysynth_ );
	
	return wav_path;


def get_wav_path( wavs_dir ):
	for root, dirs, files in os.walk( wavs_dir ):
		for wav_file in files:
			if re.match( r'.+\.wav$', wav_file ):
				return str(Path( root, wav_file ));
	return None;

def remove_all_wavs( wavs_dir ):
	for root, dirs, files in os.walk( wavs_dir ):
		for wav_file in files:
			if re.match( r'.+\.wav$', wav_file ):
				os.remove( str(Path( root, wav_file )) );


