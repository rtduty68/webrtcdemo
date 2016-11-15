import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import '../imports/api/app2/calls.js';
import '../imports/api/app2/server/methods.js';

import { CurrentTime,ActiveCallEvents } from '../imports/api/app2/calls.js';

Meteor.startup(() => {
  // code to run on server at startup
   //console.log("kkk")
   var id;
   if(CurrentTime.find({}).count==0)
   {
     console.log("insert time");
     id = CurrentTime.insert({currentTime : new Date()});
   }
   else
   {
      //console.log("update  time");
      CurrentTime.update({},{$set: {currentTime : new Date()}});
   }
   
  
   function setttm()
   {
      //CurrentTime.update({},{$set: {currentTime : new Date()}});
      //console.log("before delete");
      //console.log(ActiveCallEvents.find({}).fetch());
      //var now = new Date();
      //now.setMilliseconds(now.valueOf()-1000*60);
      //ActiveCallEvents.remove({createdAt: {$lt: now}});
      //console.log("end delete");
      //console.log(ActiveCallEvents.find({}).fetch());
   }
   Meteor.setInterval(setttm,1000*60); 
});
