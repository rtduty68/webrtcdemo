import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import '../imports/api/app2/calls.js';
import '../imports/api/app2/server/methods.js';

import { CurrentTime } from '../imports/api/app2/calls.js';

Meteor.startup(() => {
  // code to run on server at startup
   console.log("kkk")
   var id;
   if(CurrentTime.find({}).count==0)
   {
     console.log("insert time");
     id = CurrentTime.insert({currentTime : new Date()});
   }
   else
   {
      console.log("update  time");
      CurrentTime.update({},{$set: {currentTime : new Date()}});
   }
   
  
   function setttm()
   {
      CurrentTime.update({},{$set: {currentTime : new Date()}});
   }
   Meteor.setInterval(setttm,500); 
});
