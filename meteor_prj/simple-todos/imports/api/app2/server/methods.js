import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { callEventEnum,ActiveCallEvents} from '../calls.js';

Meteor.methods({
  //method insesrt
  'activeCallEvents.insert'(event)
  {
    console.log("activeCallEvents insert");
    function insertret(error, id)
    {
        if(error)
        {
            console.log("insert failed : " + error);
        }
        else
        {
            console.log("insert success : " + id);
        }
    
    }
    
    console.log(this.connection);
    
    if(this.connection.onClose)
    {
        console.log("onClose has a value"); 
    }
    else
    {
        console.log("onClose dont has a value"); 
    }
    
    ActiveCallEvents.insert({
                              event,
                              creater: this.userId,
                              createdAt: new Date(),
                            },insertret);
    
  },
  
  //method
  'getCurrentTime'()
  {
      console.log("get current time");
      return new Date();
  }
})