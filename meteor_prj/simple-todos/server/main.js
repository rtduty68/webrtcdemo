import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import '../imports/api/app2/calls.js';
import '../imports/api/app2/server/methods.js';

import { CurrentTime,ActiveCallEvents } from '../imports/api/app2/calls.js';
const url = require('url');
Meteor.startup(() => {
  // code to run on server at startup
   //console.log("kkk")
    WebApp.connectHandlers.use("/hello", function(req, res, next) {
                  res.writeHead(200);
                  res.end("Hello world from: " + Meteor.release);
                });
                
    
    WebApp.connectHandlers.use("/hello2", function(req, res, next) {
                  var requrl = url.parse(req.url,true);
                  console.log("in hello2 route");
                  console.log("rt val is " + requrl.query.rt);
                  res.writeHead(200);
                  res.end("Hello world from: " + JSON.stringify(requrl.query));
                });
    
     WebApp.connectHandlers.use("/router/rest", function(req, res, next) {
         
                          var ressss ={
                                    alibaba_aliqin_secret_call_control_response:{
                                    play_code:185,
                                    record:"false",
                                    call_type:0,
                                    op_type:1,
                                    call_in_no:"00862152531116",
                                    display_code:"0",
                                     }
                          };
                  var requrl = url.parse(req.url,true);
                  console.log("in router rest route");
                  console.log("rt val is " + requrl.query.rt);
                  res.writeHead(200);
                  res.end(JSON.stringify(ressss));
                });

   
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
