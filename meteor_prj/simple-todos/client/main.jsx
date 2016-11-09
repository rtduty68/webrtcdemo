import { Meteor } from 'meteor/meteor';
import '../imports/startup/accounts-config.js';
import '../imports/startup/client/routes.jsx';

Meteor.startup(() => {
     Meteor.subscribe('tasks');
     Meteor.subscribe('testdata');

});