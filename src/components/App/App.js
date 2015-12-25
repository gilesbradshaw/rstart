/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.scss';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import ProductStore from '../../stores/ProductStore';
import UserStore from '../../stores/UserStore';
import ActionCreators from '../../actions/ActionCreators';
import connectToStores from 'alt-utils/lib/connectToStores';
import MarkdownStore from '../../stores/MarkdownStore';


function _getStateFromStores(){
  return {
    product: ProductStore.getState(),
    user: UserStore.getState()
  };
}

@connectToStores
class App extends Component {

  static getStores(props) {
     return [MarkdownStore, ProductStore, UserStore]
  }
  static getPropsFromStores(props) {
    console.log("getting popos");
    return {
      product: ProductStore.getState(),
      user: UserStore.getState(),
      markdown: MarkdownStore.getState()
    };
  }
  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
    markdown: PropTypes.object
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };
  static componentDidConnect() {
    console.log("fetching by id");
    MarkdownStore.fetchById();
  };

  constructor() {
    super();
    //this.state = _getStateFromStores();
    //this._onChange = this._onChange.bind(this);
  }

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction,
    };
  }

  componentWillMount() {
    this.removeCss = this.props.context.insertCss(s);
  }

  componentDidMount(){
    //console.log("fetching by id!!");
    //MarkdownStore.fetchById();
    //ProductStore.listen(this._onChange);
  }

  componentWillUnmount() {
    //ProductStore.unlisten(this._onChange);
    this.removeCss();
  }

  
  changeProducts() {
    ActionCreators.receiveProducts([5,6,7,8]);
  }
  render() {
    return !this.props.error ? (
      <div>
      <span>{this.props.user.user}</span>
      <span>{this.props.markdown.markdown}</span>
      <button className="uk-button uk-button-small uk-button-primary"
          onClick={this.changeProducts}>clickme
        </button>
        <ul>
          {
            this.props.product.products.map(p=><li key = {p}>
                {p}
              </li>)
          }
        </ul>
        <Header />
        {this.props.children}
        <Feedback />
        <Footer />
      </div>
    ) : this.props.children;
  }
  

}

export default App;
