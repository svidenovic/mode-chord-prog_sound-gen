This project sort of builds on top of my "Modal chords generator" script.
Given a musical key and mode will display 7 chords as guitar diagrams.
The user can add any combination of those chords to the timeline, set their duration, octave, etc... 
and have a sound file generated and played of that chord progression. 

On the back-end it uses a lightweight Flask Framework to handle REST requests. 
For sound generation it uses 2 python modules: pySynth and pyDub.

pySynth module can generate only monophonic melodies, but the chords are polyphonic. 
So my work-around was to first break down those chords to separate notes (roots, thirds, fifths...) 
and generate separate sound files for each one of them. 
And then have them mixed and overlayed together with pyDub module in the final sound file.

pySynth: https://mdoege.github.io/PySynth/
pyDub: https://github.com/jiaaro/pydub
