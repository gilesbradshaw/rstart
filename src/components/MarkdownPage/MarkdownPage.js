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
import connectToStores from 'alt-utils/lib/connectToStores';
import MarkdownStore from '../../stores/MarkdownStore';


@withStyles(s)
@connectToStores
class MarkdownPage extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired,
    pages: PropTypes.object.isRequired,
    // title: PropTypes.string,
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  static getStores(props) {
     return [MarkdownStore]
  }
  static getPropsFromStores(props) {
    var aaa = MarkdownStore.getState();
    return {
      markdown: MarkdownStore.getState()
    };
  }

  static componentDidConnect(props) {
    MarkdownStore.fetchById(props.path);
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.path !== nextProps.path)
      MarkdownStore.fetchById(nextProps.path);
  }


 

  render() {
    // this.context.onSetTitle(this.props.title);
    if(this.props.markdown && this.props.markdown.pages[this.props.path])
    {
        const links = this.props.path.split('/').reduce((prev,current)=>prev.concat([{name:current, href: prev[prev.length-1].href + '/' + current}]), [{name:'\\', href:''}]);
        return (
        <div className={s.root}>
          <div className={s.container}>
            <ul className="nav nav-pills" role="pilllist">
              {links.filter(l=>l.name.trim()!=="").map(l=><li key={l.path} role="presentation" >  
                  <a className={s.brand} href={'/markdown' + l.href} onClick={Link.handleClick}>
                    <span className={s.brandTxt}>{l.name}</span>
                  </a>
                </li>)}
            </ul>
            {this.props.markdown.pages[this.props.path] ? 
              <div>
                  <ul className="nav nav-pills" role="tablist">
                    {this.props.markdown.pages[this.props.path].options.map(o=>
                      <li key={o.name} role="presentation" className={o.path.replace(/\\/g, '/') === this.props.path ? 'active' : ''}>
                    
                          <a className={s.brand} href={'/markdown/' + o.path} onClick={Link.handleClick}>
                            <span className={s.brandTxt}>{o.name}</span>
                          </a>
                      </li>
                    )}
                  </ul>
                  <Markdown source={this.props.markdown.pages[this.props.path].markdown || ''} />
              </div> : undefined
            }
          </div>
        </div>
      );
    } else {
      return (
        <div> <h1>loading</h1></div>
        );
    }

 }
}
export default MarkdownPage;
