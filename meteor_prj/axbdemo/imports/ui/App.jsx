import React, { Component,PropTypes } from 'react';
 
import AxbItem from './AxbItem.jsx';
import {
  createContainer
}
from 'meteor/react-meteor-data';

import { Axbs } from '../api/db.js';

import { a_num_to_edit } from '../api/store.js'
import { x_num_to_edit } from '../api/store.js'
import { b_num_to_edit } from '../api/store.js'

// App component - represents the whole app
class App extends Component {
  getAxbs() {
    return [
      { _id: 1, a: 'a number1', x:'x number 1', b:'b number 1'},
      { _id: 2, a: 'a number2', x:'x number 1', b:'b number 1'},
      { _id: 3, a: 'a number3', x:'x number 1', b:'b number 1'},
    ];
  }
 
  renderAxbs() {
    return this.props.axbs.map((val) => (
      <AxbItem key={val._id} axbItem={val} />
    ));
  }
  
   renderAxbs2() {
    return this.getAxbs().map((val) => (
      <AxbItem key={val._id} axbItem={val} />
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
                                           console.log("ok button " + $("#input_a").val());
                                           var axb = {a: $("#input_a").val(),
                                                      x: $("#input_x").val(),
                                                      b: $("#input_b").val()
                                           }
                                          Meteor.call('axbs.insert', axb);
                                          }.bind(this)
    );
  }

 handleInputChange_a(event)
 {
    a_num_to_edit.set(event.target.value);
    console.log("ok change a" + a_num_to_edit.get());
 }
 
 handleInputChange_x(event)
 {
    x_num_to_edit.set(event.target.value);
    console.log("ok change x" + x_num_to_edit.get());
 }
 
  handleInputChange_b(event)
 {
    b_num_to_edit.set(event.target.value);
    console.log("ok change c" + b_num_to_edit.get());
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
          <input id="input_a" type="text"  className="form-control" placeholder="862152530001"  
                  value={this.props.a_num_to_edit_} onChange={this.handleInputChange_a.bind(this)}/>
         </div>
         <br/>
         <div className="input-group">
            <span className="input-group-addon">x号码:</span>
            <input id="input_x" type="text" className="form-control" placeholder="862152530002"  
            value={this.props.x_num_to_edit_} onChange={this.handleInputChange_x.bind(this)}/>
        </div>
         <br/>
         <div className="input-group">
            <span className="input-group-addon">b号码:</span>
            <input id="input_b" type="text" className="form-control" placeholder="00862152531116"
            value={this.props.b_num_to_edit_} onChange={this.handleInputChange_b.bind(this)}/>
         </div>
          <br/>
         <div className="btn-group">
            <button id="btn_clear_axb_input" type="button" className="btn btn-default">清除</button>
            <button id="btn_ok_axb_input" type="button" className="btn btn-default">确定</button>
         </div>
   
        <ul className="list-group">
        <br/> 
          {this.renderAxbs()}
        </ul>
         </div>
         

    );
  }
}

App.propTypes = {
  axbs: PropTypes.array.isRequired,
   a_num_to_edit_ : PropTypes.string.isRequired
};
export default createContainer(() => {
  console.log("app refresh data");
  return {
    axbs: Axbs.find({}, { sort: { createdAt: -1 } }).fetch(),
    a_num_to_edit_ : a_num_to_edit.get(),
    x_num_to_edit_ : x_num_to_edit.get(),
    b_num_to_edit_ : b_num_to_edit.get(),
  };
}, App);