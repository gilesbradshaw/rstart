
import alt from '../alt';


import ActionCreators from '../actions/ActionCreators';

class UserStore {
  constructor() {
    this.bindActions(ActionCreators);
    this.user = undefined;
  }
}

export default alt.createStore(UserStore, 'UserStore');
