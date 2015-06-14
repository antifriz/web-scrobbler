function parseDurationString(timestr) {
    if (timestr) {
        var m = /(\d\d):(\d\d)/.exec(timestr);

        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    return 0;
}

$(function() {
    var lastTrack = null;

    $(window).unload(function() {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
    });

    $("#songInfo").bind('DOMSubtreeModified', function (e) {
        //var current = parseDurationString($("#songInfo>div:first").text());
        
        //if (current > 0) {
            //var m = /(.*)\s+-\s+(.*)\s+\((\d\d:\d\d)\)/.exec($("#songInfo>div:first").text());
            var info = $("#songInfo>div");
            var artist = info.first().text();
            var title = info.last().text();
            var total = 0; 
            var track = artist + "-" + title;
            var $r = chrome.runtime.sendMessage;
            
            if ((artist || title)&& track != lastTrack) {
                //console.log(artist.length,title.length);
                lastTrack = track;
                //console.log(track,lastTrack,track != lastTrack);

                
                $r({type: 'validate', artist: artist, track: title}, function(response) {
                    if (response != false) {
                        $r({
                            type: 'nowPlaying', 
                            artist: response.artist, 
                            track: response.track, 
                            duration: total
                        });
                    } else {
                        $r({type: 'nowPlaying', duration: total});	
                    }
                });
            }
        //}
    });
});
