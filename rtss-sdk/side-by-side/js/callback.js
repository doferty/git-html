
            function streamSetup() {

	
		// get secret API key from environment//
		var id = "2adffc17";
		var stream_name = "8d304b93f1684320a54f2798666eeca7";
		var token = "97e52731bc21ef66e4c05a8ee1e28b64bf5f9db728573d94e690277cea9215bc";
	        var state = "active";
		var path = "rtmp://rtmp-realtime1.wowza.com:1935/v2/pub/";
                var playpath = "https://realtime1.wowza.com/v2";
		var acctid = "tWBXmA";
		// contsruct rtmp publish datastring with required components
		var rtmp = path + id + "?token=" + token;
		// construct viewer playback URL
		var playback = playpath + "?streamId=" + acctid + stream_name;

		document.getElementById("p1").innerHTML = "<b>ID</b>=" + id;	
                document.getElementById("p2").innerHTML = "<b>Stream Name=</b>" + " " + stream_name; 
                document.getElementById("p3").innerHTML = "<b>Token=</b>" + " " + token; 
                document.getElementById("p4").innerHTML = "<b>State</b>=" + " " + state; 
                document.getElementById("p5").innerHTML = "<b>RTMP=</b>" + " " + rtmp; 
		document.getElementById("p6").innerHTML = "<b>Viewer Playback=</b>" + " " + playback; 
            };

