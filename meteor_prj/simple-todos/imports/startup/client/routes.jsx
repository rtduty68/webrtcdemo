
import React from 'react';
import { render } from 'react-dom';

import StartPage from '../../ui/start_page.jsx';
import Todos from '../../ui/ui_todos/App.jsx';
import App2 from '../../ui/ui_app2/App2.jsx';
import { mount } from 'react-mounter';
import { callEventEnum,ActiveCallEvents,CurrentTime} from '../../api/app2/calls.js';

FlowRouter.route( '/', {
  action: function() {
    render(<StartPage myProp="123"/>, document.getElementById('render-target'));
  },
});

FlowRouter.route( '/todos', {
  action: function() {
    render(<Todos />, document.getElementById('render-target'));
  },
});

const WelcomeComponent = ({name}) => (<p>Hello, {name}</p>);
FlowRouter.route( '/app2', {
  action: function() {

  
    render(<App2 name="inst11"/>, document.getElementById('render-target'));
    //render(<App2 name="inst33" callEvents={[]}/>, document.getElementById('render-target'));
    //mount(WelcomeComponent, {name: {App2}});
}
});
