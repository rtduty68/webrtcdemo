import React, { Component,PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { foo2,startConnection,startPeerConnection,reset as webRtcReset,onOffer } from '../../api/app2/client/webrtc.js'
import { callEventEnum,ActiveCallEvents,CurrentTime} from '../../api/app2/calls.js';


// App component - represents the whole app
class App2 extends Component {
  
   constructor(props) {
    super(props);
    console.log("app2 construct");
    this.count=0;
    this.callStateEnum = {init:"init",readyForCall:"readyForCall",PeerConnectionStart:"PeerConnectionStart"};
    this.state = {
      testval: "123",
      mystream: null,
      theirStream : null,
      callState : this.callStateEnum.init,
      currentTime : null,
    };
  }
  componentWillUnmount()
  {
    console.log("componentWillUnmount");
    webRtcReset();
    this.lastCallEventTime=null;
    this.subHandleTasks.stop();
    //this.subHandleCurrentTime.stop();
    this.count=0;
    this.state = {
      testval: "123",
      mystream: null,
      theirStream : null,
      callState : this.callStateEnum.init,
      currentTime:null,
    }
  }
  
  componentDidMount() {
    this.count+=1;
     console.log("this.count :" + this.count);
   //define callback function
   function onLocalstream(paramMystream)
   {
      console.log("onLocalstream");
      
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
    }
    
   function onTheirStream(paramTheirstream)
   {
      console.log("onTheirStream");
      this.setState({
        theirStream: paramTheirstream,
      });
    }
    
    console.log("componentDidMount");

    
    this.subHandleTasks = Meteor.subscribe('activeCallEvents');
    //this.subHandleCurrentTime = Meteor.subscribe('currentTime');
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
    
    //if(this.lastCallEventTime)
    //{
    //   console.log("got current time stop sub ");
    //   this.subHandleCurrentTime.stop();
    //}
    
    $("#call")[0].addEventListener("click", this.makeCall.bind(this));
    startConnection(onLocalstream.bind(this), onTheirStream.bind(this));
  }
  
  processEvent(event)
  {
    function onAnswerCreate(answer)
    {
      console.log("onAnswerCreate");
    }
    
    switch(event.event.type) {
    case callEventEnum.offer:
        console.log("process offer");
        
      console.log("event.creater" + event.creater);
      console.log(" Meteor.userId" +  Meteor.userId()); 
      if(event.creater)
      {
        if(event.creater !== Meteor.userId() && Meteor.userId())
        {
          onOffer(event.event.content, onAnswerCreate);
        }
      }
      break;
    case callEventEnum.answer:
       console.log("process answer");
      break;
    case callEventEnum.candidate:
      console.log("process candidate");
      break;
    default:
      break;
  }
  }
  
  processCallEvents(events)
  {
     if(!this.state.currentTime)
     {
        console.log("no current time, return");
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
         presentName : $("#their-username").val(),
       };
       
       function insertResult(err,ret)
       {
          if(err)
          {
            console.log("insert failed " + err);
          }
          else if(ret)
          {
            console.log("insert success " + ret);
          }
          else
          {
            console.log("insert success with no ret");
          }
       }
       Meteor.apply('activeCallEvents.insert', [offer], {wait: true, noRetry:true} ,insertResult);
    }
       
    function onError(error)
    {
       console.log("make call failed!");
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
    this.setState({callState : this.callStateEnum.PeerConnectionStart});
    startPeerConnection(onOfferCreate, onError);
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
    console.log("render app2 page :" + JSON.stringify(this.state));
    console.log("active call events is");
    console.log(this.props.callEvents);
    
    this.lastCallEventTime = this.props.currentTime;
    console.log("this.props.currentTime :" + JSON.stringify(CurrentTime.find({}).fetch()));
     this.processCallEvents(this.props.callEvents);
    return (
      <div className="container">
        <p> <a href="/">return home</a> </p>
        <header>
          <h1>App2</h1>
        </header>
        
        <div id="login-page" className="page">
          <h2>Login As</h2>
          <input type="text" id="username" />
          <button id="login">Login</button>
        </div>

          <div id="call-page" className="page">
            <video id="yours" src={this.state.mystream ? window.URL.createObjectURL(this.state.mystream) : null} autoPlay controls></video>
            <video id="theirs" src={this.state.theirStream ? window.URL.createObjectURL(this.state.theirStream) : null} autoPlay controls></video>
            <input type="text" id="their-username" />
            <button id="call" disabled={this.shouldCallButtonDisabled()}>Call</button>
            <button id="hang-up" disabled={this.shouldHanupButtonDisabled()}>Hang Up</button>
      
            <input type="text" id="message"></input>
            <button id="send">Send</button>
            <div id="received"></div>
         </div>
       </div>
    );
  }
}

App2.propTypes = {
  callEvents: PropTypes.array.isRequired,
  currentTime: PropTypes.array.isRequired,
};



export default createContainer(() => {
  console.log("app refresh data");
  //console.log("CurrentTime.find({}).fetch() :" + JSON.stringify(CurrentTime.find({}).fetch()));
  return {
    callEvents: ActiveCallEvents.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentTime: CurrentTime.find({}).fetch(),
  };
}, App2);