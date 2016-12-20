import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Axbs = new Mongo.Collection('axbs');
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('axbs', function axbsPublication() {
      console.log("axbs publish function called");
      this.onStop(function(){console.log("sub stopped");})
      return Axbs.find({
      });
  });
  
}
Axbs.allow({
  insert: function() {
    return true;
  },
  update: function () {
    // can only change your own documents
    return true;
  },
  remove: function () {
    // can only remove your own documents
    return true;
  },

});
//console.log("Meteor.methods called");

Meteor.methods({
   'axbs.insert'(text) {
    //console.log("check user pass of userid" + JSON.stringify(Meteor.user()),this.userId);
    
    text.createdAt = new Date();
    var id = Axbs.insert({
      text
    });
    
    console.log("axb insert id : " + id);
  },
  'axbs.remove'(axbId) {
    check(axbId, String);
    Axbs.remove(axbId, String);
  },


});

