import React, { Component, PropTypes } from 'react';
import { a_num_to_edit } from '../api/store.js'
import { x_num_to_edit } from '../api/store.js'
import { b_num_to_edit } from '../api/store.js'
// Task component - represents a single todo item
export default class AxbItem extends Component {
  
  deleteThisAxb() {
    Meteor.call('axbs.remove', this.props.axbItem._id);
  }
  
  editThisAxb() {
    a_num_to_edit.set(this.props.axbItem.a);
    x_num_to_edit.set(this.props.axbItem.x);
    b_num_to_edit.set(this.props.axbItem.b);
    console.log("editThisAxb" + a_num_to_edit.get() + b_num_to_edit.get() + x_num_to_edit.get());
  }
  
  render() {
    return (
      <div>
      
      <li className="list-group-item">
      <button className="delete" onClick={this.deleteThisAxb.bind(this)}>
          &times;
      </button>
      <button onClick={this.editThisAxb.bind(this)}>
          编辑
      </button>
      <span className="text">
        a: {this.props.axbItem.a},x: {this.props.axbItem.x}, b: {this.props.axbItem.b}
      </span>
      </li>
      </div>
    );
  }
}
 
AxbItem.propTypes = {
  axbItem: PropTypes.object.isRequired,
};