import { callEventEnum,ActiveCallEvents,CurrentTime} from '../../api/app2/calls.js';
class app2Store {
  constructor() {
      function getCurrentTimeResult(err,ret)
       {
          if(err)
          {
            console.log("getCurrentTimeResult failed " + err);
          }
          else if(ret)
          {
            console.log("getCurrentTimeResult success " + ret);
            this.currentTime = ret;
          }
          else
          {
            console.log("getCurrentTimeResult success with no ret");
          }
       }
      Meteor.apply('getCurrentTime', [], {wait: true, noRetry:false},getCurrentTimeResult.bind(this));
  }

  say() {
    console.log("app2Stoe hello");
  }
  
  getProps()
  {
        return {
                callEvents: ActiveCallEvents.find({}, { sort: { createdAt: -1 } }).fetch(),
                currentUserId: Meteor.userId(),
                currentUser: Meteor.user(),
              };
  
  }
}

export var testVar="123";
export var app2StoreInst = new app2Store();


