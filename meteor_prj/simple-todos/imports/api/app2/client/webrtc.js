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

export function reset()
{
   yourConnection = null;
}

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
    onLocalStream(null);
  }
  
   if (hasUserMedia()) {
      console.log("OK, your browser does support WebRTC.");
      navigator.getUserMedia({ video: false, audio: true }, getUserMediaSuccess, getUserMediaError);
    } else {
    alert("Sorry, your browser does not support WebRTC.");
  }
};

export function startPeerConnection(onOfferCreate, onError) {
  function onOfferCreate_(offer)
  {
      yourConnection.setLocalDescription(offer,
                                         function(){console.log("setLocalDescription by offer success");},
                                         function(){console.log("setLocalDescription by offer failed");}
                                         );
      onOfferCreate(JSON.stringify(offer));
  }
  
  function onError_(error)
  {
     onError(error);
  }
  yourConnection.createOffer(onOfferCreate_ , onError_);
}


export function onOffer(offer, onAnswerCreate)
{
    var jobjOffer = JSON.parse(offer);
    function oncreateAnswer(answer)
    {
       console.log("create anawer success");
      yourConnection.setLocalDescription(answer,
                                         function(){console.log("setLocalDescription by answer success");},
                                         function(){console.log("setLocalDescription by answer failed");});
      onAnswerCreate(JSON.stringify(answer));
        //send({
        //  type: "answer",
        //  answer: answer
        //});
   }
  
  function oncreateOnswerErr(error)
  {
     console.log("oncreateOnswerErr An error has occurred" + error);
     onAnswerCreate(null);
  }
  console.log("webrtc onOffer");
  yourConnection.setRemoteDescription(new RTCSessionDescription(jobjOffer),
                                       function(){console.log("setRemoteDescription by offer success");},
                                      function(){console.log("setRemoteDescription by offer failed");});
  yourConnection.createAnswer(oncreateAnswer, oncreateOnswerErr);
}