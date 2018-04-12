
import re

def validate_key_mode( key_mode ):
	key_mode = key_mode.lower().strip();
	match = re.match( 
		r'^[a-g]s?(m|dim)?_(ionian|dorian|phrygian|lydian|mixolydian|aeolian|locrian)$',
		key_mode
	);
	if match:
		return True;
	else:
		return False;
