/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import s from './MarkdownPage.scss';
import withStyles from '../../decorators/withStyles';
import Markdown from 'react-remarkable';
import Link from '../Link';

@withStyles(s)
class MarkdownPage extends Component {

  static propTypes = {
    // path: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    // title: PropTypes.string,
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  render() {
    // this.context.onSetTitle(this.props.title);
    const links = this.props.path.split('/').reduce((prev,current)=>prev.concat([{name:current, href: prev[prev.length-1].href + '/' + current}]), [{name:'root', href:''}]);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.name}</h1>
          <div>
            {links.map(l=><span><a className={s.brand} href={'/markdown' + l.href} onClick={Link.handleClick}>
                  <img src={require('../Header/logo-small.png')} width="38" height="38" alt="React" />
                  <span className={s.brandTxt}>{l.name}</span>
                </a></span>)}
          </div>
          <ul>
            {this.props.options.map(o=>
              <li key={o.name}>
                <a className={s.brand} href={'/markdown/' + o.path} onClick={Link.handleClick}>
                  <img src={require('../Header/logo-small.png')} width="38" height="38" alt="React" />
                  <span className={s.brandTxt}>{o.name}</span>
                </a>
              </li>)}
          </ul>
          <Markdown source={this.props.content || ''} />
        </div>
      </div>
    );
  }

}

export default MarkdownPage;
