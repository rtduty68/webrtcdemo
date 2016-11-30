
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ActiveCallEvents = new Mongo.Collection('activeCallEvents');

export const CurrentTime = new Mongo.Collection('currentTime');

export const callEventEnum = {offer:"offer",answer:"answer",candidate:"candidate", release:"release"};
if (Meteor.isServer) {
  Meteor.publish('activeCallEvents', function PubActiveCallEvents(paramPresentName) {
      this.onStop(function(){console.log("subActiveCallEvents stopped");})
      console.log(this.userId +" publish " + paramPresentName);
      //console.log(Meteor.users.findOne(this.userId).username + " publish " + paramPresentName);
      if(this.userId)
      {
         return ActiveCallEvents.find({"event.presentName": {$eq: paramPresentName}});
      }
      else
      {
        return [];
      }
  });
  
  Meteor.publish('currentTime', function PubCurrentTime() {
      this.onStop(function(){console.log("currentTime stopped");})
      console.log("CurrentTime.find({}) " +JSON.stringify(CurrentTime.find({}).fetch()));
      return CurrentTime.find({});
  });
}


