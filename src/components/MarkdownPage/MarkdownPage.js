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
          <ul className="nav nav-pills" role="pilllist">
            {links.map(l=><li key={l.path} role="presentation" className = {l.href === '/' + this.props.path ? 'active' : ''}>  
                <a className={s.brand} href={'/markdown' + l.href} onClick={Link.handleClick}>
                  <span className={s.brandTxt}>{l.name}</span>
                </a>
              </li>)}
          </ul>
          <ul className="nav nav-pills" role="tablist">
            {this.props.options.map(o=>
              <li key={o.name} role="presentation" className={o.path.replace(/\\/g, '/') === this.props.path ? 'active' : ''}>
                
                  <a className={s.brand} href={'/markdown/' + o.path} onClick={Link.handleClick}>
                    <span className={s.brandTxt}>{o.name}</span>
                  </a>
              </li>
              )}
          </ul>
          <Markdown source={this.props.content || ''} />
        </div>
      </div>
    );
  }

}

export default MarkdownPage;
