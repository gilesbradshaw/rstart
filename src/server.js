/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
import assets from './assets';
import { port } from './config';


import iso from 'iso';
import alt from './alt';

import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import {
  Strategy as GitHubStrategy } from 'passport-github2';
import partials from 'express-partials';

import secrets from '../secrets';


import fetch from './core/fetch';


const server = global.server = express();


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser((user, done) =>
  done(null, user));

passport.deserializeUser((obj, done) =>
  done(null, obj));


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
  clientID: secrets.GITHUB_CLIENT_ID,
  clientSecret: secrets.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(() =>
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      done(null, profile)
    );
  }
));

server.use(partials());
server.use(bodyParser());
server.use(methodOverride());
server.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize());
server.use(passport.session());


// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
server.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  () => undefined);

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
server.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/' + req.user.displayName)
);

server.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));


server.use('/css/bootstrap', express.static(__dirname + '/public/bower_components/bootstrap/dist/css'));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content'));
server.use('/api/markdown', require('./api/markdown'));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

server.get('/', function(req, res) {   
    res.redirect('/markdown');
});
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = {
      title: '', description: '',
      css: '',
      body: '',
      entry: assets.main.js };
    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
      user: req.user,
    };
    

    //const response = await fetch(`/api/markdown?path=`);
    //const content = await response.json();
    const altData = { MarkdownStore: { pages:{} }, UserStore: {user: req.user ? req.user.displayName : '?&&&&&&?'}, ProductStore: { products: [1, 2, 3] } };
    alt.bootstrap(JSON.stringify(altData));

      await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
        data.body = iso.render(ReactDOM.renderToString(component), alt.flush());
        data.css = css.join('');
      });

      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(statusCode).send( '<!doctype html>\n ' + html);
   
    
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
