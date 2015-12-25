
import alt from '../alt';
import { createActions } from 'alt-utils/lib/decorators';

@createActions(alt)
class ActionsCreators {
  constructor() {
    this.generateActions(
      'receiveProducts',
      'addToCart',
      'finishCheckout'
    );
  }

  cartCheckout(products) {
    this.dispatch(products);
  }
}

export default ActionsCreators;
