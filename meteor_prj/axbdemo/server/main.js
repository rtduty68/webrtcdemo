import { Meteor } from 'meteor/meteor';
import '../imports/api/db.js';
import { Axbs } from '../imports/api/db.js';
const url = require('url');
Meteor.startup(() => {
  // code to run on server at startup
  
  
  WebApp.connectHandlers.use("/router/rest", function(req, res, next) {
                  var requrl = url.parse(req.url,true);
                  console.log("in router rest route");
                  console.log("query object is" + JSON.stringify(requrl.query));
                  console.log("call_out_no is " + requrl.query.call_out_no);
                  console.log("no_x is " + requrl.query.no_x);
                  var axbItem = Axbs.findOne({a:requrl.query.call_out_no, x:requrl.query.no_x});
                  if(axbItem)
                  {
                    console.log("found axb item " + JSON.stringify(axbItem));
                  }
                  else
                  {
                    console.log("axb item not found");
                    res.writeHead(404);
                    res.end("not found");
                    return;
                  }
   
                  var ressss ={
                                  alibaba_aliqin_secret_call_control_response:{
                                  play_code:185,
                                  record:"false",
                                  call_type:0,
                                  op_type:1,
                                  call_in_no:axbItem.b,
                                  display_code:"0",
                                  }
                          };
                  /*
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
                  */
                  res.writeHead(200);
                  res.end(JSON.stringify(ressss));
                });
});
