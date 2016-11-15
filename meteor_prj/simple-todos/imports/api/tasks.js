import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');
export const Testdata = new Mongo.Collection('testdata');
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
      console.log("task publish function called");
      this.onStop(function(){console.log("sub stopped");})
      return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
  
    Meteor.publish('testdata', function tasksPublication2() {
       console.log("testdata publish function called");
     this.onStop(function(){console.log("testdata sub stopped");})
      return Testdata.find({});
  });
}
Tasks.allow({
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
  'testdata.insert'(data1)
  {
    
    if(Meteor.isClient)
    {
      console.log("isclient");
      console.log("testdada insert");
      Testdata.insert({data1});
      return;
    }
    else
    {
      console.log("isserver");
      console.log("testdada insert");
      Testdata.insert({username: "server"});
      return;
    }
      

  },
  
  'testdata.clear'()
  {
    
    console.log("testdada clear");
    Testdata.remove({});
  },
  
  'tasks.insert'(text) {
    check(text, String);
 
     //Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    //console.log("check user pass of userid" + JSON.stringify(Meteor.user()),this.userId);
    
    var id = Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      private: true
    });
    
    console.log("task insert id : " + id);
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});

