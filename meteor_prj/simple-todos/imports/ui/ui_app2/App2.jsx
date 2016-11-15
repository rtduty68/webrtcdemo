import React, { Component,PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { foo2,startConnection,startPeerConnection,reset as webRtcReset,
         restart as webRtcResart, onOffer,onAnswer,onCandidate } from '../../api/app2/client/webrtc.js'
import { callEventEnum,ActiveCallEvents,CurrentTime} from '../../api/app2/calls.js';
import { Random } from 'meteor/random'
import AccountsUIWrapper from '../AccountsUIWrapper.jsx';
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'

// App component - represents the whole app
class App2 extends Component {
  
     
   constructor(props) {
    super(props);
    console.log("app2 construct");
    this.sessionId=null;
    this.presentName=null;
    this.currentTime=null;
    this.callStateEnum = {init:"init",readyForCall:"readyForCall",PeerConnectionStart:"PeerConnectionStart"};
    this.state = {
      mystream: null,
      theirStream : null,
      callState : this.callStateEnum.init,
    };
  
    this.subHandleCalled = null;
  }
  componentWillUnmount()
  {

    console.log("componentWillUnmount");
    webRtcReset();
    this.lastCallEventTime=null;
    this.sessionId=null;
    this.presentName=null;
    this.currentTime=null;
    this.state = {
      mystream: null,
      theirStream : null,
      callState : this.callStateEnum.init,
    }
  }
  
  componentDidUpdate(prevProps, prevState)
  {
    console.log("update");
    this.processCallEvents(this.props.callEvents);
  }
  
  componentDidMount() {
    console.log("componentDidMount");
    function getCurrentTimeResult(err,ret)
       {
          if(err)
          {
            console.log("getCurrentTimeResult failed " + err);
          }
          else if(ret)
          {
            console.log("getCurrentTimeResult success " + ret);
            this.setState({currentTime : ret});
          }
          else
          {
            console.log("getCurrentTimeResult success with no ret");
          }
       }
    
    Meteor.apply('getCurrentTime', [], {wait: true, noRetry:false},getCurrentTimeResult.bind(this));
    console.log("current time is " + this.currentTime);
     $("#call")[0].addEventListener("click", this.makeCall.bind(this));
    $("#hang-up")[0].addEventListener("click", this.dropCall.bind(this));
    startConnection(this.onLocalstream.bind(this), this.onTheirStream.bind(this),this.onicecandidate.bind(this));
  }
  
  processEvent(event)
  {
    this.state.currentTime = event.createdAt;
    
    if(!event.creater)
    {
       console.log("event has no creater");
       return;
    }
    
    if(! Meteor.userId())
    {
       console.log("user not login");
       return;
    }
    
    if(event.creater == Meteor.userId())
    {
        //dont process event create by me
        return;
    }
    function onAnswerCreate(paramAnswer)
    {
      //console.log("onAnswerCreate");
      
      var answer = {
         type : callEventEnum.answer,
         content : paramAnswer,
         presentName : this.presentName,
         sessionId : this.sessionId
       };
       
       function insertResult(err,ret)
       {
          if(err)
          {
            console.log("insert answer failed " + err);
          }
          else if(ret)
          {
            //console.log("insert answer success " + ret);
          }
          else
          {
            //console.log("insert answer success with no ret");
          }
       }
       Meteor.apply('activeCallEvents.insert', [answer], {wait: true, noRetry:true} ,insertResult);
    }
  
    switch(event.event.type) {
    case callEventEnum.offer:
        console.log("process offerf");
        
      //console.log("event.creater" + event.creater);
      //console.log(" Meteor.userId" +  Meteor.userId()); 
      this.sessionId=event.event.sessionId;
      this.presentName=event.event.presentName;
      onOffer(event.event.content, onAnswerCreate.bind(this));
 
      break;
    case callEventEnum.answer:
       console.log("process answer");
       onAnswer(event.event.content);
      break;
    case callEventEnum.candidate:
      //console.log("process candidate");
      onCandidate(event.event.content);
      break;
    case callEventEnum.release:
      console.log("process release");
      this.onLeave();
    default:
      break;
  }
  }
  
  processCallEvents(events)
  {
     if(!this.state.currentTime)
     {
        //console.log("no current time, return");
        return;
     }
     for (var i=events.length-1;i>=0;i--)
     {
          if(!events[i].createdAt)
           continue;
     
        if(events[i].createdAt.valueOf()>this.state.currentTime.valueOf())
        {
           this.processEvent(events[i]);
        }
     }
  }
  
  makeCall()
  {
    function onOfferCreate(paramOffer)
    {
       var offer = {
         type : callEventEnum.offer,
         content : paramOffer,
         presentName : this.presentName,
         sessionId : this.sessionId
       };
       
       function insertResult(err,ret)
       {
          if(err)
          {
            console.log("insert failed " + err);
          }
          else if(ret)
          {
            //console.log("insert success " + ret);
          }
          else
          {
            //console.log("insert success with no ret");
          }
       }
       this.subHandleCalled = Meteor.subscribe('activeCallEvents', offer.presentName);
       Meteor.apply('activeCallEvents.insert', [offer], {wait: true, noRetry:true} ,insertResult);
    }
    
       
    function onError(error)
    {
       //console.log("make call failed!");
       if(this.state.mystream)
       {
          this.setState({callState : this.callStateEnum.readyForCall});
       }
       else
       {
          this.setState({callState : this.callStateEnum.init});
       }
    }
    console.log("make call!");
    this.presentName = $("#their-username").val();
    this.sessionId = Random.id();
    this.setState({callState : this.callStateEnum.PeerConnectionStart});
     startPeerConnection(onOfferCreate.bind(this), onError.bind(this));
  }
  
  onLeave()
  {
    console.log("onLeave");
    webRtcResart(this.state.mystream,this.onTheirStream.bind(this),this.onicecandidate.bind(this));
    this.sessionId=null;
    this.presentName=null;
    var callState;
    if(this.state.mystream)
    {
      callState = this.callStateEnum.readyForCall;
    }
    else
    {
          callState = this.callStateEnum.init;
    }
    
    if(this.subHandleCalled)
    {
      this.subHandleCalled.stop();
      this.subHandleCalled = null;
    }
    
    this.setState({
      theirStream : null,
      callState : callState,
    });
  }
  
    dropCall()
    {
         var leave = {
         type : callEventEnum.release,
         content : null,
         presentName : this.presentName,
         sessionId : this.sessionId
       };
       
       function insertResult(err,ret)
       {
          if(err)
          {
            console.log("insert answer failed " + err);
          }
          else if(ret)
          {
            //console.log("insert answer success " + ret);
          }
          else
          {
            //console.log("insert answer success with no ret");
          }
       }
       Meteor.apply('activeCallEvents.insert', [leave], {wait: true, noRetry:true} ,insertResult);
       this.onLeave();
    }
  
  shouldCallButtonDisabled()
  {
     return this.state.callState !== this.callStateEnum.readyForCall  ? true : false;
  }
  
  shouldHanupButtonDisabled()
  {
    return this.state.callState === this.callStateEnum.readyForCall
           || this.state.callState === this.callStateEnum.init ? true : false;
  }
  
  render() {
    console.log("render app2 page");
    //console.log("render app2 page :" + JSON.stringify(this.state));
    //console.log("active call events is");
    //console.log(this.props.callEvents);
    
    //console.log("this.props.currentTime :" + JSON.stringify(CurrentTime.find({}).fetch()));
    return (
      <div className="container">
        <p> <a href="/">return home</a> </p>
        <header>
          <h1>App2</h1>
        </header>
        
        <div id="login-page" className="page">
          <AccountsUIWrapper />
          {//<h2>Login As</h2>
            
          }
          {//<input type="text" id="username" />
            
          }
          {//<button id="login">Login</button>
            
          }
        </div>

          <div id="call-page" className="page">
            {//<video id="yours" src={this.state.mystream ? window.URL.createObjectURL(this.state.mystream) : null} autoPlay controls></video>
            }
            <p>
            <video id="theirs" src={this.state.theirStream ? window.URL.createObjectURL(this.state.theirStream) : null} autoPlay controls></video>
            </p>
            <p>
            <input type="text" id="their-username" />
            <button id="call" disabled={this.shouldCallButtonDisabled()}>Call</button>
            <button id="hang-up" disabled={this.shouldHanupButtonDisabled()}>Hang Up</button>
            </p>
            {//<input type="text" id="message"></input>
            }
            {//<button id="send">Send</button>
            }
            {//<div id="received"></div>
            }
         </div>
       </div>
    );
  }
  
  
  onLocalstream(paramMystream)
   {
      //console.log("onLocalstream");
      
      var callstate;
      if(paramMystream)
      {
        if(this.state.callState===this.callStateEnum.init)
           callstate=this.callStateEnum.readyForCall;
        else
        {
          console.log("should not happen onLocalstream 1");
        }
      }
      else
      {
        if(this.state.callState===this.callStateEnum.readyForCall)
           callstate=this.callStateEnum.init;
        else if(this.state.callState!==this.callStateEnum.init)
        {
          console.log("should not happen onLocalstream 2");
        }
      }
      
      this.setState({
        mystream: paramMystream,
        callState : callstate
      });
      
      this.processCallEvents(this.props.callEvents);
    }
    
   onTheirStream(paramTheirstream)
   {
      console.log("onTheirStream : " + JSON.stringify(paramTheirstream));
      this.setState({
        theirStream: paramTheirstream,
      });
    }
    
    onicecandidate(paramCandidate)
    {
       console.log("ap2 icecandidate" + paramCandidate);
       var candidate = {
         type : callEventEnum.candidate,
         content : paramCandidate,
         presentName : this.presentName,
         sessionId : this.sessionId
       };
       
       function insertResult(err,ret)
       {
          if(err)
          {
            console.log("insert icecandidate failed " + err);
          }
          else if(ret)
          {
            //console.log("insert icecandidate success " + ret);
          }
          else
          {
            //console.log("insert icecandidate success with no ret");
          }
       }
       Meteor.apply('activeCallEvents.insert', [candidate], {wait: true, noRetry:true} ,insertResult);
    }
    
    utilityXor(val1, val2)
    {
	     return ((val1&&!val2) || (!val1&&val2));
    }

}


App2.propTypes = {
  callEvents: PropTypes.array.isRequired,
};



Tracker.autorun(function () {
  if(Meteor.user())
    Meteor.subscribe('activeCallEvents', Meteor.user().username);
});


export default app2Container = createContainer(() => {
  console.log("app refresh data");
  //console.log("CurrentTime.find({}).fetch() :" + JSON.stringify(CurrentTime.find({}).fetch()));
  
  return {
    callEvents: ActiveCallEvents.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUserId: Meteor.userId(),
    currentUser: Meteor.user(),
  };
}, App2);


