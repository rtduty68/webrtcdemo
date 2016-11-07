import React, { Component } from 'react';
import { foo2,startConnection } from '../../api/app2/client/webrtc.js'


// App component - represents the whole app
export default class App2 extends Component {
  
 
 
  constructor(props) {
    super(props);

    this.state = {
      testval: "123",
      mystream: null,
      theirStream : null,
    };
  }
  
  componentDidMount() {
    
   //define callback function
   function onLocalstream(paramMystream)
   {
      console.log("onLocalstream");
      this.setState({
        mystream: paramMystream,
      });
    }
    
   function onTheirStream(paramTheirstream)
   {
      console.log("onTheirStream");
      this.setState({
        theirStream: paramTheirstream,
      });
    }
    
    console.log("componentDidMount")
    startConnection(onLocalstream.bind(this), onTheirStream.bind(this));
  }
  
  render() {
    console.log("render app2 page :" + JSON.stringify(this.state));
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
            <button id="call">Call</button>
            <button id="hang-up">Hang Up</button>
      
            <input type="text" id="message"></input>
            <button id="send">Send</button>
            <div id="received"></div>
         </div>
       </div>
    );
  }
}