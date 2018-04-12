
from MyChord import MyChord;

class MyTimeline:
	
	sound_sample = 3;
	timeline = [];
	
	def add_chord( self, chord ):
		new_id = len(self.timeline)+1;
		chord.id = new_id;
		self.timeline.append( chord );
	
	def delete_chord( self, chord_id ):
		for chord in self.timeline:
			if chord.id == chord_id:
				self.timeline.remove(chord);
				break;
	
	def edit_chord( self, chord_id, new_chord ):
		for chord in self.timeline:
			if chord.id == chord_id:
				chord.update( new_chord );
	
	def private_swap( self, idx1, idx2 ):
		a, b = self.timeline[idx1], self.timeline[idx2];
		self.timeline[idx1] = b;
		self.timeline[idx2] = a;
	
	def move_chord( self, chord_id, move ):
		chord_idx = None;
		for c in range(0,len(self.timeline)):
			if self.timeline[c].id == chord_id:
				chord_idx = c; break;
		
		if chord_idx == None:
			return False;
		
		if move == 'left':
			chord_idx_prev = chord_idx-1;
			if chord_idx_prev < 0:
				chord_to_move = self.timeline[chord_idx];
				self.delete_chord( self.timeline[chord_idx].id );
				self.timeline.append( chord_to_move );
			else:
				self.private_swap( chord_idx, chord_idx_prev );
			return True;
		
		elif move == 'right':
			chord_idx_next = chord_idx+1;
			if chord_idx_next >= len(self.timeline):
				chord_to_move = self.timeline[chord_idx];
				self.delete_chord( self.timeline[chord_idx].id );
				self.timeline.insert( 0, chord_to_move );
			else:
				self.private_swap( chord_idx, chord_idx_next );
			return True;
		
		return False;
	
	
	def get_chord( self, chord_id ):
		for chord in self.timeline:
			if chord.id == chord_id:
				return chord;
	
	def clear_timeline(self):
		self.timeline = [];
	
	def get_timeline(self):
		return self.timeline;
		
