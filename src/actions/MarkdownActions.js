import alt from '../alt';
import { createActions } from 'alt-utils/lib/decorators';

@createActions(alt)
class MarkdownActions {
  constructor() {
   
  }
  fetched(payload) {
    return payload;
    return (dispatch) => {
        console.log("displatchunbg" + payload.markdown);//
        return dispatch(payload);
    }
  }
  fetchedFailed(payload) {
    //const md = payload.data;
    //this.dispatch(md);
  }
  // ...
}

export default MarkdownActions;
