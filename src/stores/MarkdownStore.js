import alt from '../alt';
import MarkdownSource from '../data sources/MarkdownSource';
import MyActions from '../actions/MarkdownActions';
import { createStore, datasource } from 'alt-utils/lib/decorators';

@createStore(alt)
@datasource(MarkdownSource)
class MarkdownStore {
  constructor() {
    this.bindActions(MyActions);
    
    
  } 
  onFetched(state){
    this.pages[state.path] = state;
    
  }
  
}
export default MarkdownStore;
