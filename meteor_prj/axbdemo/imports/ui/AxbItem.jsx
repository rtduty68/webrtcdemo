import React, { Component, PropTypes } from 'react';
 
// Task component - represents a single todo item
export default class AxbItem extends Component {
  
  deleteThisAxb() {
    Meteor.call('axbs.remove', this.props.axbItem._id);
  }
  
  render() {
    return (
      <div>
      
      <li className="list-group-item">
      <button className="delete" onClick={this.deleteThisAxb.bind(this)}>
          &times;
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