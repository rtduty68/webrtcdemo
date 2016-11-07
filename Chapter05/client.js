var  hostname = window.location.hostname;
var wssurl = 'wss://' + hostname + ":8081";
console.log("connect to ", wssurl);
var connection = new WebSocket(wssurl),
    name = "";

var loginPage = document.querySelector('#login-page'),
    usernameInput = document.querySelector('#username'),
    loginButton = document.querySelector('#login'),
    callPage = document.querySelector('#call-page'),
    theirUsernameInput = document.querySelector('#their-username'),
    callButton = document.querySelector('#call'),
    hangUpButton = document.querySelector('#hang-up'),
    startRecordButton = document.querySelector('#start-record'),
    stopRecordButton = document.querySelector('#stop-record'),
    playBothButton = document.querySelector('#play-both');
    
var record_index = 1;
callPage.style.display = "none";

// Login when the user clicks the button
loginButton.addEventListener("click", function (event) {
  name = usernameInput.value;

  if (name.length > 0) {
    send({
      type: "login",
      name: name
    });
  }
});

function sendKeppAlive()
{
  send({
    type: "keepAliveReq"
  });
};

var timer;
connection.onopen = function () {
  console.log("Connected");
  timer=self.setInterval(sendKeppAlive,2000);
};

connection.onclose = function(){
  console.log("Closed");
  self.clearInterval(timer);
}

// Handle all messages through this callback
connection.onmessage = function (message) {
  console.log("Got message", message.data);

  var data = JSON.parse(message.data);

  switch(data.type) {
    case "login":
      onLogin(data.success);onLeave
      break;
    case "offer":
      onOffer(data.offer, data.name);
      break;
    case "answer":
      onAnswer(data.answer);
      break;
    case "candidate":
      onCandidate(data.candidate);
      break;
    case "leave":
      onLeave();
      break;
    default:
      break;
  }
};

connection.onerror = function (err) {
  console.log("Got error", err);
};

// Alias for sending messages in JSON format
function send(message) {
  if (connectedUser) {
    message.name = connectedUser;
  }
  
  if(name){
    message.myName = name;
  }

  connection.send(JSON.stringify(message));
};

function onLogin(success) {
  if (success === false) {
    alert("Login unsuccessful, please try a different name.");
    var info_text = document.createElement('p');
    info_text.innerHTML="fail";
    loginPage.appendChild(info_text);
  } else {
    loginPage.style.display = "none";
    callPage.style.display = "block";
    var info_text = document.createElement('p');
    info_text.innerHTML="success";
    callPage.appendChild(info_text);
    // Get the plumbing ready for a call
    startConnection();
  }
};

callButton.addEventListener("click", function () {
  var theirUsername = theirUsernameInput.value;

  if (theirUsername.length > 0) {
    startPeerConnection(theirUsername);
  }
});

hangUpButton.addEventListener("click", function () {
  send({
    type: "leave"
  });

  onLeave();
});

startRecordButton.addEventListener("click", function () {
  localmediaRecorder.start(-1);
  remotemediaRecorder.start(-1);
});
stopRecordButton.addEventListener("click", function () {
  localmediaRecorder.stop();
  remotemediaRecorder.stop();
});

playBothButton.addEventListener("click", function () {
  localMedial.play();
  remoteMedial.play();
});

function onOffer(offer, name) {
  connectedUser = name;
  yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

  yourConnection.createAnswer(function (answer) {
    yourConnection.setLocalDescription(answer);
    send({
      type: "answer",
      answer: answer
    });
  }, function (error) {
    alert("An error has occurred");
  });
}

function onAnswer(answer) {
  yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

function onCandidate(candidate) {
  yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function onLeave() {
  connectedUser = null;
  theirVideo.src = null;
  yourConnection.close();
  yourConnection.onicecandidate = null;
  yourConnection.onaddstream = null;
  localmediaRecorder.stop();
  remotemediaRecorder.stop();
  setupPeerConnection(stream);
};

function hasUserMedia() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
};

function hasRTCPeerConnection() {
  window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
  window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
  return !!window.RTCPeerConnection;
};

var yourVideo = document.querySelector('#yours'),
    theirVideo = document.querySelector('#theirs'),
    localMedial = document.querySelector('#localmedial'),
    remoteMedial = document.querySelector('#remotemedial'),
    yourConnection, connectedUser, stream;
function bytesToSize(bytes) {
                var k = 1000;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes === 0) return '0 Bytes';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            }

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
                var data = new Date(milliseconds);
                return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
            }

var localstream;
var localmediaRecorder;
var remotemediaRecorder;
function startConnection() {
  if (hasUserMedia()) {
    navigator.getUserMedia({ video: false, audio: true}, function (myStream) {
       localmediaRecorder = new MediaStreamRecorder(myStream);
       localmediaRecorder.mimeType = 'video/webm';
       var timeInterval = 10000;
       localmediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var a = document.createElement('a');
         a.target = '_blank';
         a.innerHTML = 'Open local Recorded Audio No. ' + (record_index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
         a.href = window.URL.createObjectURL(blob);
         callPage.appendChild(a);
         callPage.appendChild(document.createElement('hr'));
         localMedial.src = window.URL.createObjectURL(blob);
      };
      //localmediaRecorder.start(10000);
      stream = myStream;
      localstream = myStream;
      //yourVideo.src = window.URL.createObjectURL(stream);

      if (hasRTCPeerConnection()) {
        setupPeerConnection(stream);
      } else {
        alert("Sorry, your browser does not support WebRTC.");
      }
    }, function (error) {
      console.log(error);
    });
  } else {
    alert("Sorry, your browser does not support WebRTC.");
  }
};

function setupPeerConnection(stream) {
  var configuration = {
    "iceServers": [{ "url": "stun:127.0.0.1:9876" }]
  };
  yourConnection = new RTCPeerConnection(configuration);

  // Setup stream listening
  yourConnection.addStream(stream);
  yourConnection.onaddstream = function (e) {
    //play remote
    theirVideo.src = window.URL.createObjectURL(e.stream);
    
     //record remote
     remotemediaRecorder = new MediaStreamRecorder(e.stream);
       remotemediaRecorder.mimeType = 'video/webm';
       var timeInterval = 10000;
       remotemediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var a = document.createElement('a');
         a.target = '_blank';
         a.innerHTML = 'Open remote Recorded Audio No. ' + (record_index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
         a.href = window.URL.createObjectURL(blob);
         callPage.appendChild(a);
         callPage.appendChild(document.createElement('hr'));
         remoteMedial.src = window.URL.createObjectURL(blob);
      };
      //remotemediaRecorder.start(timeInterval);
      /*
      //record remote and local
      //var mix = new MediaStream([localstream.getAudioTracks()[0],e.stream.getAudioTracks()[0]]);
      var mix = new MediaStream([e.stream.getAudioTracks()[0]],localstream.getAudioTracks()[0]);
      var mixrMediaRecorder = new MediaStreamRecorder(mix);
      mixrMediaRecorder.mimeType = 'video/webm';
      mixrMediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var a = document.createElement('a');
         a.target = '_blank';
         a.innerHTML = 'Open mix Recorded Audio No. ' + (record_index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
         a.href = window.URL.createObjectURL(blob);
         callPage.appendChild(a);
         callPage.appendChild(document.createElement('hr'));
      };
      mixrMediaRecorder.start(timeInterval);
      */
  };

  // Setup ice handling
  yourConnection.onicecandidate = function (event) {
    if (event.candidate) {
      send({
        type: "candidate",
        candidate: event.candidate
      });
    }
  };
};

function startPeerConnection(user) {
  connectedUser = user;

  // Begin the offer
  yourConnection.createOffer(function (offer) {
    send({
      type: "offer",
      offer: offer
    });
    yourConnection.setLocalDescription(offer);
  }, function (error) {
    alert("An error has occurred.");
  });
};
