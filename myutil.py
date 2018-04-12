
from pathlib import Path;
from os import walk;
from flask import url_for;

def sort_chord_imgs( chord_imgs ):
	new_chord_imgs = chord_imgs[:]; # Save a copy, so that original is not mutated
	
	last_index = len(chord_imgs) - 1; # Iterate up to this position
	
	while last_index > 0:
		for i in range(last_index):
			a, b = new_chord_imgs[i], new_chord_imgs[i + 1]; # Consecutive numbers in array
			if a['number'] > b['number']:
				new_chord_imgs[i], new_chord_imgs[i + 1] = b, a; # Swap positions
		last_index -= 1; # A new number has bubbled up, no need to inspect it again
	
	return new_chord_imgs;


def get_chord_imgs( key_mode ):
	
	chords_path = Path( 'Mode_Chords_db', key_mode);
	chords_dir = url_for( 'static', filename=str(chords_path) );
	
	if chords_dir[0] == '/':
		chords_dir = chords_dir[1:];
	
	chord_imgs = [];
	
	for (dirpath, directories, files) in walk(chords_dir):
		for chord_img_file in files:
			chord_img = {};
			
			chord_img['file_path'] = str(Path( chords_dir, chord_img_file ));
			
			tmp = chord_img_file.split('_');
			
			chord_img['number'] = int( tmp[0].split('-')[1] );
			
			chord_img['name'] = tmp[1].replace('.png','').replace('-','/').replace('s','#');
			
			chord_imgs.append( chord_img );
	
	chord_imgs = sort_chord_imgs( chord_imgs );
	
	return chord_imgs;
