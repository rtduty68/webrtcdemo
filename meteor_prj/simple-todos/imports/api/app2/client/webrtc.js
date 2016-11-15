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

var yourConnection = null;


function setupPeerConnection(stream,onTheirStream, onicecandidate) {
  var configuration = {
    "iceServers": [{ "url": "stun:127.0.0.1:9876" }]
  };
  yourConnection = new RTCPeerConnection(configuration);
  // Setup stream listening
  yourConnection.addStream(stream);
  //console.log("got local stream and add to rtcconnection");
  function onAddStream(e)
  {
    console.log("remote stream got in rtcconnection" + e.stream);
    onTheirStream(e.stream);
  }
  yourConnection.onaddstream = onAddStream;
  

  function onicecandidate_(event)
  {
     //console.log("webrtc wrap icecandidate");
     if (event.candidate) {
        onicecandidate(JSON.stringify(event.candidate));
    }
  }
  
  yourConnection.onicecandidate = onicecandidate_;
  
};
  
export function foo2(){alert("call foo2");};

export function reset()
{
   yourConnection.close();
   yourConnection.onicecandidate = null;
   yourConnection.onaddstream = null;
   yourConnection = null;
}

export function restart(stream,onaddstream,onicecandidate)
{
    reset();
    setupPeerConnection(stream,onaddstream, onicecandidate);
}

export  function startConnection(onLocalStream, onTheirStream,onicecandidate) {
   
   function getUserMediaSuccess(paramMyStream) {
      onLocalStream(paramMyStream);
      if (hasRTCPeerConnection()) {
          setupPeerConnection(paramMyStream,onTheirStream, onicecandidate);
        } else {
          console.log("Sorry, your browser does not support WebRTC.");
        }
  };
    
  function getUserMediaError(error)
  {
    console.log(error);
    onLocalStream(null);
  }
  
   if (hasUserMedia()) {
      //console.log("OK, your browser does support WebRTC.");
      navigator.getUserMedia({ video: false, audio: true }, getUserMediaSuccess, getUserMediaError);
    } else {
    console.log("Sorry, your browser does not support WebRTC.");
  }
};

export function startPeerConnection(onOfferCreate, onError) {
  function onOfferCreate_(offer)
  {
      yourConnection.setLocalDescription(offer,
                                         function(){//console.log("setLocalDescription by offer success")
                                         },
                                         function(error){console.log("setLocalDescription by offer failed " + error);}
                                         );
      onOfferCreate(JSON.stringify(offer));
  }
  
  function onError_(error)
  {
     console.log("createOffer An error has occurred" + error);
     onError(error);
  }
  yourConnection.createOffer(onOfferCreate_ , onError_);
}


export function onOffer(offer, onAnswerCreate)
{
    var jobjOffer = JSON.parse(offer);
    function oncreateAnswer(answer)
    {
       //console.log("create anawer success");
      yourConnection.setLocalDescription(answer,
                                         function(){//console.log("setLocalDescription by answer success");
                                         },
                                         function(error){console.log("setLocalDescription by answer failed " + error);});
      onAnswerCreate(JSON.stringify(answer));
   }
  
  function oncreateOnswerErr(error)
  {
     console.log("oncreateOnswerErr An error has occurred" + error);
     onAnswerCreate(null);
  }
  console.log("webrtc onOffer");
  yourConnection.setRemoteDescription(new RTCSessionDescription(jobjOffer),
                                       function(){//console.log("setRemoteDescription by offer success");
                                                  },
                                      function(error){console.log("setRemoteDescription by offer failed " + error);});
  yourConnection.createAnswer(oncreateAnswer, oncreateOnswerErr);
}

export function onAnswer(answer)
{
  var jobjAnswer = JSON.parse(answer);
  yourConnection.setRemoteDescription(new RTCSessionDescription(jobjAnswer),
                                      function(){//console.log("setRemoteDescription by answer success");
                                                 },
                                      function(error){console.log("setRemoteDescription by answer failed " + error);});
}

export function onCandidate(candidate)
{
  var jobjCandidate = JSON.parse(candidate);
  yourConnection.addIceCandidate(new RTCIceCandidate(jobjCandidate),
                                 function(){//console.log("addIceCandidate success");
                                           },
                                      function(error){console.log("addIceCandidate failed " + error);});
}