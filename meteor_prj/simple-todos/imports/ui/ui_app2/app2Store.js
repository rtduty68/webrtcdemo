import { callEventEnum,ActiveCallEvents,CurrentTime} from '../../api/app2/calls.js';
class app2Store {
  constructor() {

  }

  say() {
    console.log("app2Stoe hello");
  }
  
  getProps()
  {
        return {
                callEvents: ActiveCallEvents.find({}, { sort: { createdAt: -1 } }).fetch(),
              };
  
  }
}

export var testVar="123";
export var app2StoreInst = new app2Store();


