
class MyChord:
	id = 0;
	number = 0;
	name = '';
	octave = 4;
	duration = 4;
	img_file = '';
	img_position = '0 0';
	
	
	def update( self, chord ):
		self.octave = chord.octave;
		self.duration = chord.duration;
		self.img_position = chord.img_position;
	
	def create_from( self, data ):
		if data['number']:
			self.number = int( data['number'] );
		
		if data['name']:
			self.name = data['name'];
		
		self.octave = int( data['octave'] );
		
		self.duration = int( data['duration'] );
		
		if data['img_file']:
			self.img_file = data['img_file'];
		
		if data['img_position']:
			self.img_position = data['img_position'];
		
	def toString( self ):
		return ' id:{} num:{} name:{} oct:{} dur:{} img_file:{} img_pos:{} '.format(
			self.id, self.number, self.name, self.octave, self.duration, self.img_file, self.img_position
		);
