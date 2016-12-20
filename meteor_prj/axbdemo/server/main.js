import { Meteor } from 'meteor/meteor';
import '../imports/api/db.js';
const url = require('url');
Meteor.startup(() => {
  // code to run on server at startup
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
});
