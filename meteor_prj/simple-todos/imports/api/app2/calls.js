
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ActiveCallEvents = new Mongo.Collection('activeCallEvents');

export const CurrentTime = new Mongo.Collection('currentTime');

export const callEventEnum = {offer:"offer",answer:"answer",candidate:"candidate"};
if (Meteor.isServer) {
  Meteor.publish('activeCallEvents', function PubActiveCallEvents() {
      this.onStop(function(){console.log("subActiveCallEvents stopped");})
      return ActiveCallEvents.find({});
  });
  
  Meteor.publish('currentTime', function PubCurrentTime() {
      this.onStop(function(){console.log("currentTime stopped");})
      console.log("CurrentTime.find({}) " +JSON.stringify(CurrentTime.find({}).fetch()));
      return CurrentTime.find({});
  });
}


