import alt from '../alt';

import markdownActions from '../actions/MarkdownActions';

const MarkdownSource = {
  fetchById: { 
    local(state, id) {
      return undefined; // will return `undefined` if there
                             // is no todo at that id
    },
    // `remote` is called if the return value of local == undefined
    // It will receive the same parameters as local would but should
    // return a promise.
    remote(state, id) {
      return new Promise((resolve, reject) => setTimeout(() => { 
        resolve({ markdown: 'hahhh' });
        console.log("resolving...");
      }, 4000 ));
    },
    shouldFetch(state, args){
      console.log('shopuld');
      return true;
    },

    // loading specifies an optional action to fire once `remote`
    // has been called, this can be useful for doing things like
    // clearing out data in the store if it should be replaced once
    // the request completes.
    // loading: TodoActions.fetchingTodo,

    // success is required and specifies what action should be
    // called if the promise returned by remote resolves. This
    // action will be passed the data resolved by the promise.
    success: markdownActions.fetched,

    // error is required and specifies what action should be
    // called if the promise returned by remote rejects. This
    // action will be passed the data rejected by the promise.
    error: markdownActions.fetchFailed,
  },
};

export default MarkdownSource;
