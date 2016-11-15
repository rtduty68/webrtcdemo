import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { callEventEnum,ActiveCallEvents} from '../calls.js';

Meteor.methods({
  //method insesrt
  'activeCallEvents.insert'(event)
  {
    //console.log("activeCallEvents insert");
    function insertret(error, id)
    {
        if(error)
        {
           console.log("insert failed : " + error);
        }
        else
        {
            //console.log("insert success : " + id);
            if(event.type==callEventEnum.offer)
            {/*
                ActiveCallEvents.update(id, { $set: { sessionId: id } }, 
                   function(uperr,upret)
                   {
                       if(uperr)
                       {
                           console.log("set session id failed :" + uperr);
                       }
                       else
                       {
                           //console.log(upret + "doc updated");
                       }
                   }
                );*/
            }
        }
    
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
      //console.log("get current time");
      return new Date();
  }
})