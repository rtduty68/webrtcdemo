import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../../api/tasks.js';
import { Testdata } from '../../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
// App component - represents the whole app
class App extends Component {
  
  testfunc()
  {
    console.log("test111"); 
    Meteor.call('testdata.insert', "hello");
    console.log(Testdata.find({}, { sort: { createdAt: -1 } }).fetch());
    //Meteor.call('testdata.clear');
    //console.log(Testdata.find({}, { sort: { createdAt: -1 } }).fetch());
  }
  

  
  constructor(props) {
     console.log("App constructor");
    super(props);

    this.state = {
      hideCompleted: false,
    };
    
    this.myStream = null;
    
    this.subHandleTasks = null;
    this.subHandleTestData = null;
   
  }

  componentWillUnmount()
  {
    console.log("App componentWillUnmount");
    this.subHandleTasks.stop();
    this.subHandleTestData.stop();
  }
  
  componentDidMount() {
    console.log("App componentDidMount");
      this.subHandleTasks = Meteor.subscribe('tasks');
      this.subHandleTestData = Meteor.subscribe('testdata');
  }
  
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    console.log("render todopage");
    return (
      <div className="container">
        <p> <a href="/">return home</a> </p>
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>
          
           <button onClick={this.testfunc}>
            { 'test' }
          </button>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
  testdata: PropTypes.array.isRequired,
};



export default createContainer(() => {

  
  console.log("app refresh data");
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
    testdata : Testdata.find({}, { sort: { createdAt: -1 } }).fetch()
  };
}, App);