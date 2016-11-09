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

var yourConnection;


function setupPeerConnection(stream,onTheirStream) {
  var configuration = {
    "iceServers": [{ "url": "stun:127.0.0.1:9876" }]
  };
  yourConnection = new RTCPeerConnection(configuration);
  // Setup stream listening
  yourConnection.addStream(stream);
  
  function onAddStream(e)
  {
    onTheirStream(e.stream);
  }
  yourConnection.onaddstream = onAddStream;
};
  
export function foo2(){alert("call foo2");};

export  function startConnection(onLocalStream, onTheirStream) {
   
   function getUserMediaSuccess(paramMyStream) {
      onLocalStream(paramMyStream);
      if (hasRTCPeerConnection()) {
          setupPeerConnection(paramMyStream,onTheirStream);
        } else {
          alert("Sorry, your browser does not support WebRTC.");
        }
  };
    
  function getUserMediaError(error)
  {
    console.log(error);
  }
  
   if (hasUserMedia()) {
      alert("OK, your browser does support WebRTC.");
      navigator.getUserMedia({ video: false, audio: true }, getUserMediaSuccess, getUserMediaError);
    } else {
    alert("Sorry, your browser does not support WebRTC.");
  }
};