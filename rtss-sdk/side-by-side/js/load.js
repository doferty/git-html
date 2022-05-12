
            function streamSetup() {

	
		// get secret API key from environment//
		var id = "bUEzT6";
		var stream_name=document.getElementById('sname').value;
		var token=document.getElementById('token').value;
		var path = "rtmp://rtmp-realtime1.wowza.com:1935/v2/pub/";
                var pubpath = "iframe.html"
		var playpath = "/rtsCDN/viewer/public/iframe.html";
		var acctid = "bUEzT6";
	    var streamName = "c558e5838b8742e29f9911069059dec3"
        var publishToken = "e08fab2e4c39d475807288f502cd86685dcbd17063e828b88e96b5bba145ee1b"

		// contsruct rtmp publish datastring with required components
		var rtmp = path + id + "?token=" + token;
		// construct viewer playback URL
		var playback = playpath + "?streamName=" + stream_name;
                // construct publish URL
                var publish = pubpath + "?streamName=" + stream_name + "&accountId=" + acctid + "&publishToken=" + token;
		document.getElementById("frame1").contentWindow.location.reload();
                document.getElementById("frame1").src = publish;

                document.getElementById("frame2").contentWindow.location.reload();
                document.getElementById("frame2").src = playback;          
		

            };

