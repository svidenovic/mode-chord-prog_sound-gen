
$(document).ready(function(){
	
	$('.goBtn').click(function(){
		var key = $('.selectKey').val();
		var mode = $('.selectMode').val();
		key = key.replace('#','s');
		mode = mode.toLowerCase().split(' ')[0];
		var key_mode = key+'_'+mode;
		
		$.ajax({
			method: "GET",
			url: "/chords/"+key_mode
		})
		.done(function( response ){
			$('.chordHolder').fadeOut(100, function(){
				$(this).html( response );
				$(this).fadeIn(250);
				
				$('.chordImgPreview').children('img').each(function( index ) {
					$(this).fadeOut(1);
				});
				
				$('.add2timelineBtn').fadeOut(1);
			});
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.chordHolder').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
	});
	
	$('.chordHolder').on( 'click', '.chordBtn', function(){
		var chord_number = $(this).attr('chord-number');
		var chord_name = '';
		
		$('.chordBtnsHolder').children('button').each(function(i){
			if ( $(this).attr('chord-number') == chord_number ){
				$(this).css('border-bottom-color', '#6997CE'); // blue
				chord_name = $(this).html().split(' ')[2];
			}
			else{
				$(this).css('border-bottom-color', '#BDBDBD');
			}
		});
		
		$('.chordImgPreview').children('img').each(function( index ) {
			if ($(this).attr('chord-number') == chord_number){
				$(this).fadeIn(250);
			}
			else{
				$(this).fadeOut(1);
			}
		});
		
		$('.add2timelineBtn').find('span').html( chord_name );
		$('.add2timelineBtn').attr('selected-chord', chord_number+' '+chord_name );
		$('.add2timelineBtn').fadeIn(250);
		
	});
	
	$('.chordHolder').on( 'click', '.add2timelineBtn', function(){
		var selected_chord = $(this).attr('selected-chord');
		var sc = selected_chord.split(' ');
		var chord_number = sc[0];
		var chord_name = sc[1];
		
		var chord_img_file = '';
		$('.chordImgPreview').children('img').each(function(i){
			if ($(this).attr('chord-number') == chord_number){
				chord_img_file = $(this).attr('src');
				return false;
			}
		});
		//~ chord_img_file = chord_img_file.replace('static/','');
		
		var MyChord = {
			id: 0,
			number: parseInt(chord_number),
			name: chord_name,
			octave: 4,
			duration: 4,
			img_file: chord_img_file,
			img_position: '0 0'
		};
		
		$.ajax({
			method: "POST",
			contentType: "application/json",
			url: "/timeline/chord",
			data: JSON.stringify( MyChord )
		})
		.done(function( response ){
			load_up_timeline();
			$('.generateWavBtn').find('span').html('*');
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.timelineDiv').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
		
		
	});
	
	$('.timelineDiv').on( 'change', 'select', function(){
		var select_chord_id = $(this).attr('chord-id');
		
		$('.timelineDiv').children('.timelineChord').each(function(i){
			var updateChordBtn = $(this).find('.updateChordBtn');
			
			if (select_chord_id == $(updateChordBtn).attr('chord-id')){
				$(updateChordBtn).find('span').html('*');
				return false;
			}
		});
		$('.timelineDiv').children('.timelineChordPause').each(function(i){
			var updateChordBtn = $(this).find('.updateChordBtn');
			
			if (select_chord_id == $(updateChordBtn).attr('chord-id')){
				$(updateChordBtn).find('span').html('*');
				return false;
			}
		});
	});
	
	$('.timelineDiv').on( 'click', '.updateChordBtn', function(){
		if ($(this).find('span').html() == '*'){
			var save_btn = $(this);
			var chord_id = $(save_btn).attr('chord-id');
			
			$('.timelineDiv').children('.timelineChord').each(function(i){
				if (chord_id == $(this).attr('chord-id')){
					var duration = $(this).find('.durationSelect').val();
						duration = duration.split('/')[1];
					var octave = $(this).find('.octaveSelect').val();
					var position = $(this).find('.positionSelect').val();
					
					var img_positions = [
						'0 0', '-200px 0', '-400px 0', '0 -200px', '-200px -200px', '-400px -200px'
					];
					
					var MyChord_update = {
						id: 0,        // dummy data
						number: 0,    // dummy data
						name: '',     // dummy data
						octave: octave,
						duration: duration,
						img_file: '', // dummy data
						img_position: img_positions [parseInt(position)-1]
					};
					
					$(save_btn).html('Saving...');
					
					$.ajax({
						method: "PUT",
						contentType: "application/json",
						url: "/timeline/chord/"+chord_id,
						data: JSON.stringify( MyChord_update )
					})
					.done(function( response ){
						load_up_timeline();
						$('.generateWavBtn').find('span').html('*');
					})
					.fail(function( xhr, textStatus, errorThrown ){
						$('.timelineDiv').fadeOut(100, function(){
							$(this).html( xhr.responseText );
							$(this).fadeIn(250);
						});
					})
					.always(function( msg ){
						
					});
					
				}
			});
			$('.timelineDiv').children('.timelineChordPause').each(function(i){
				if (chord_id == $(this).attr('chord-id')){
					var duration = $(this).find('.durationSelect').val();
						duration = duration.split('/')[1];
					
					var MyChord_pause = {
						id: 0,
						number: 0,
						name: 'Pause',
						octave: 4,
						duration: duration,
						img_file: 'pause',
						img_position: 'pause'
					};
					
					$(save_btn).html('...');
					
					$.ajax({
						method: "PUT",
						contentType: "application/json",
						url: "/timeline/chord/"+chord_id,
						data: JSON.stringify( MyChord_pause )
					})
					.done(function( response ){
						load_up_timeline();
						$('.generateWavBtn').find('span').html('*');
					})
					.fail(function( xhr, textStatus, errorThrown ){
						$('.timelineDiv').fadeOut(100, function(){
							$(this).html( xhr.responseText );
							$(this).fadeIn(250);
						});
					})
					.always(function( msg ){
						
					});
				}
			});
			
			//~ $(this).find('span').html('');
		}
	}); 
	
	
	$('.timelineDiv').on( 'click', '.removeChordBtn', function(){
		var chord_id = $(this).attr('chord-id');
		
		$.ajax({
			method: "DELETE",
			contentType: "application/json",
			url: "/timeline/chord/"+chord_id,
			data: {}
		})
		.done(function( response ){
			load_up_timeline();
			$('.generateWavBtn').find('span').html('*');
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.timelineDiv').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
	});
	
	$('.timelineDiv').on( 'click', '.moveLeftChordBtn', function(){
		var chord_id = $(this).attr('chord-id');
		
		$.ajax({
			method: "PUT",
			contentType: "application/json",
			url: "/timeline/chord/"+chord_id+"/move/left",
			data: {}
		})
		.done(function( response ){
			load_up_timeline();
			$('.generateWavBtn').find('span').html('*');
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.timelineDiv').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
	});
	$('.timelineDiv').on( 'click', '.moveRightChordBtn', function(){
		var chord_id = $(this).attr('chord-id');
		
		$.ajax({
			method: "PUT",
			contentType: "application/json",
			url: "/timeline/chord/"+chord_id+"/move/right",
			data: {}
		})
		.done(function( response ){
			load_up_timeline();
			$('.generateWavBtn').find('span').html('*');
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.timelineDiv').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
	});
	
	$('.insertPauseBtn').click(function(){
		
		var MyChord_puase = {
			id: 0,
			number: 0,
			name: 'Pause',
			octave: 0,
			duration: 4,
			img_file: 'pause',
			img_position: 'pause'
		};
		
		$.ajax({
			method: "POST",
			contentType: "application/json",
			url: "/timeline/chord",
			data: JSON.stringify( MyChord_puase )
		})
		.done(function( response ){
			load_up_timeline();
			$('.generateWavBtn').find('span').html('*');
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.timelineDiv').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
		
	});
	
	$('.soundSampleSelect').change(function(){
		$('.generateWavBtn').find('span').html('*');
	});
	
	$('.generateWavBtn').click(function(){
		
		var btn_html = $(this).html();
		
		$('button').prop('disabled', true);
		$('.playStopBtn').attr('wav-path', '');
		$(this).html(' Generating... ');
		
		var sound_sample = $('.soundSampleSelect :selected').attr('ss');
		
		$.ajax({
			method: "GET",
			contentType: "application/json",
			url: "/timeline/wav/generate/"+sound_sample
		})
		.done(function( response ){
			if (response.match('.wav')){
				// $('#timeline_wav').attr('src', response);
				// $('#timeline_wav').attr('playing','false');
			}
		})
		.fail(function( xhr, textStatus, errorThrown ){
			alert( xhr.responseText );
		})
		.always(function( msg ){
			$('.generateWavBtn').html(btn_html);
			$('.generateWavBtn').find('span').html('');
			
			$('button').prop('disabled', false);
			
		});
	});
	
	$('#timeline_wav').bind('ended', function(){
		if ($('.loopCheckbox').find('input').is(':checked') ){
			//~ $('#timeline_wav').attr('playing','true');
			//~ $('.playStopBtn').html('Stop');
			document.getElementById('timeline_wav').play();
		}
		else{
			$(this).attr('playing', 'false');
			$('.playStopBtn').html('Play');
		}
	});
	
	
	$('.playStopBtn').click(function(){
		
		$(this).html('Loading...');
		
		$.ajax({
			method: "GET",
			contentType: "application/json",
			url: "/timeline/wav/get/path"
		})
		.done(function( response ){
			if (response.match('.wav')){
				$('#timeline_wav').attr('src', response);
				
				if ($('#timeline_wav').attr('playing') == 'false'){
					$('#timeline_wav').attr('playing','true');
					$('.playStopBtn').html('Stop');
					document.getElementById('timeline_wav').play();
				}
				else{
					$('#timeline_wav').attr('playing','false');
					$('.playStopBtn').html('Play');
					document.getElementById('timeline_wav').pause();
					document.getElementById('timeline_wav').currentTime = 0;
				}
			}
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.playStopBtn').html('Play');
			$('#timeline_wav').attr('playing','false');
			alert( xhr.responseText );
		})
		.always(function( msg ){
			//~ $('.generateWavBtn').html(btn_html);
		});
		
	});
	
	
	$('.ClearTimelineBtn').click(function(){
		$('#timeline_wav').attr('playing','false');
		$('.playStopBtn').html('Play');
		document.getElementById('timeline_wav').pause();
		document.getElementById('timeline_wav').currentTime = 0;
		
		$.ajax({
			method: "GET",
			contentType: "application/json",
			url: "/timeline/clear"
		})
		.done(function( response ){
			load_up_timeline();
			$('.generateWavBtn').find('span').html('');
		})
		.fail(function( xhr, textStatus, errorThrown ){
			alert( xhr.responseText );
		})
		.always(function( msg ){
			
		});
	});
	
	
	
	// ------- Helper functions: --------------------------------------
	
	function load_up_timeline(){
		$.ajax({
			method: "GET",
			url: "/timeline"
		})
		.done(function( response ){
			$('.timelineDiv').fadeOut(1, function(){
				$(this).html( response );
				$(this).fadeIn(250);
			});
		})
		.fail(function( xhr, textStatus, errorThrown ){
			$('.timelineDiv').fadeOut(100, function(){
				$(this).html( xhr.responseText );
				$(this).fadeIn(250);
			});
		})
		.always(function( msg ){
			
		});
		
		// load up sound sample in the select drop-down
		$.ajax({
			method: "GET",
			url: "/timeline/get/sound_sample"
		})
		.done(function( response ){
			var ss = parseInt(response);
			$('.soundSampleSelect :nth-child('+ss+')').prop('selected', true);
		})
		.fail(function( xhr, textStatus, errorThrown ){
			alert( xhr.responseText )
		})
		.always(function( msg ){
			
		});
	}
	
	// ------- Call on page load: --------------------------------------
	
	load_up_timeline();
	
});
