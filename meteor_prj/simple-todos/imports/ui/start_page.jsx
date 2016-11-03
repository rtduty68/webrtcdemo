import React, { Component } from 'react';
 
// App component - represents the whole app
export default class StartPage extends Component {
  render() {
    return (
      <div className="container">
        <header>
          <h1>welcome</h1>
          <p> <a href="/todos">todos</a> </p>
          <p> <a href="/app2">test app</a> </p>
        </header>
       </div>
    );
  }
}