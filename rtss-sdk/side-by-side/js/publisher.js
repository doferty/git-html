
            function streamSetup() {

	
		// get secret API key from environment//
		var id = "bUEzT6";
		var stream_name=document.getElementById('sname').value;
		var token=document.getElementById('token').value;
		var path = "rtmp://rtmp-realtime1.wowza.com:1935/v2/pub/";
                var pubpath = "iframe.html"
		var playpath = "/rtsCDN/viewer/public/iframe.html";
		var acctid = "bUEzT6";

		// contsruct rtmp publish datastring with required components
		var rtmp = path + id + "?token=" + token;
		// construct viewer playback URL
		var playback = playpath + "?streamName=" + stream_name;
                // construct publish URL
                var publish = pubpath + "?streamName=" + stream_name + "&accountId=" + acctid + "&publishToken=" + token;
		document.getElementById("frame1").contentWindow.location.reload();
                document.getElementById("frame1").src = publish;


            };

