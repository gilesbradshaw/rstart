/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import s from './Header.scss';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Navigation from '../Navigation';
import connectToStores from 'alt-utils/lib/connectToStores';
import UserStore from '../../stores/UserStore';

@withStyles(s)
@connectToStores
class Header extends Component {

  static getStores(props) {
     return [UserStore]
  }
  static getPropsFromStores(props) {
    return {
      user: UserStore.getState(),
    };
  }

  render() {
    return (
      <div className={s.root}>
        <span>{this.props.user.user}</span>
        <div className={s.container}>


          <Navigation className={s.nav} />
          <a className={s.brand} href="/markdown" onClick={Link.handleClick}>
            <img src={require('./logo-small.png')} width="38" height="38" alt="React" />
            <span className={s.brandTxt}>SiGyl</span>
          </a>
          
        </div>
      </div>
    );
  }

}

export default Header;
