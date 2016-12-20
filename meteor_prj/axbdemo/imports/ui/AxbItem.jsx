import React, { Component, PropTypes } from 'react';
 
// Task component - represents a single todo item
export default class AxbItem extends Component {
  render() {
    return (
      <li>{this.props.task.a}</li>
    );
  }
}
 
AxbItem.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  axbItem: PropTypes.object.isRequired,
};