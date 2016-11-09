/*
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Calls = new Mongo.Collection('calls');
if (Meteor.isServer) {
  Meteor.publish('calls', function tasksPublication() {
      this.onStop(function(){console.log("sub Calls stopped");})
      return Calls.find({});
  });
}

Meteor.methods({
  'calls.insert'(offer)
  {
    console.log("calls insert");
     Calls.insert({
      callerCallInfo : callinfo,
      calledCallInfo : null,
    });
  },
  
  'calls.setAnswer'(callId, paramAnswer) {
    paramAnswer.createrUserId = this.userId;
    Calls.update(callId, { $set: { answer: paramAnswer } });
  },
  
  'calls.setAnswer'(callId, paramAnswer) {
    paramAnswer.createrUserId = this.userId;
    Calls.update(callId, { $set: { answer: paramAnswer } });
  },
  
   'calls.remove'(callId) {
    Calls.remove(callId);
  },
})
*/