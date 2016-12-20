import React, { Component } from 'react';
 
import AxbItem from './AxbItem.jsx';
import {
  createContainer
}
from 'meteor/react-meteor-data';

import { Tasks } from '../api/db.js';
// App component - represents the whole app
class App extends Component {
  getTasks() {
    return [
      { _id: 1, a: 'This is task 1' },
      { _id: 2, a: 'This is task 2' },
      { _id: 3, a: 'This is task 3' },
    ];
  }
 
  renderTasks() {
    return this.getTasks().map((task) => (
      <AxbItem key={task._id} task={task} />
    ));
  }
  
  componentDidMount() {
    $("#btn_clear_axb_input").click(function(){
                                           console.log("clear button");
                                           $("#input_a").val("");
                                           $("#input_x").val("");
                                           $("#input_b").val("");
                                          }.bind(this)
    );
    
     $("#btn_ok_axb_input").click(function(){
                                           console.log("ok button");
                                          }.bind(this)
    );
  
  }
  
 
 
  render() {
    console.log("reander");
    return (
      <div className="container">
        <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">axb业务</a>
            </div>
             <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className="active"><a href="#">Home</a></li>
                {//<li><a href="#about">About</a></li>
                }
                {//<li><a href="#contact">Contact</a></li>
                }
              </ul>
             </div>
          </div>
        </nav>
        <header>
          <h1>请输入axb</h1>
        </header>
        

         <div className="input-group">
          <span className="input-group-addon">a号码:</span>
          <input id="input_a" type="text" className="form-control" placeholder="862152530001"/>
         </div>
         <br/>
         <div className="input-group">
            <span className="input-group-addon">x号码:</span>
            <input id="input_x" type="text" className="form-control" placeholder="9501312345"/>
        </div>
         <br/>
         <div className="input-group">
            <span className="input-group-addon">b号码:</span>
            <input id="input_b" type="text" className="form-control" placeholder="862152531116"/>
         </div>
          <br/>
         <div className="btn-group">
            <button id="btn_clear_axb_input" type="button" className="btn btn-default">清除</button>
            <button id="btn_ok_axb_input" type="button" className="btn btn-default">确定</button>
         </div>
         </div>
         
        <ul>
          {this.renderTasks()}
        </ul>
    );
  }
}

export default createContainer(() => {
  console.log("app refresh data");
  return {
  };
}, App);