/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import { join } from 'path';
import { Router } from 'express';
import Promise from 'bluebird';
import secrets from '../../secrets';
import fetch from '../core/fetch';

// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, './markdown');
const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const dirExists = dirname => new Promise(resolve => {
  fs.stat(dirname, (er, s) => resolve(!er && s.isDirectory()));
});

const readdir = dirname => new Promise(resolve => {
  fs.readdir(dirname, (er, ss) => resolve(ss));
});


const router = new Router();

async function dirs(path) {
  const dirName = join(CONTENT_DIR, path);
  const _dirs = await readdir(dirName);
  if (_dirs) {
    const dirss = _dirs.filter(d => d !== 'readme.md').map(name => dirExists(join(dirName, name)).then(isDirectory => readdir(join(dirName, name)).then(ds => ({
      name,
      'path': join(path, isDirectory ? name : name.substring(0, name.lastIndexOf('.md'))),
      'children': ds,
      isDirectory,
    }))));

    const arr = await Promise.all(dirss);
    return arr;
  }
  return [];
}

router.get('/', async (req, res, next) => {
  try {
    const path = req.query.path;
    const names = path.split('/');

    if (!path || await dirExists(join(CONTENT_DIR, path))) {
      const dirName = join(CONTENT_DIR, path);

      if (!(await dirExists(dirName))) {
        throw `no directory '${path}'`;
      }
      const options = await dirs(path);    
      const fileName = join(dirName, '/readme.md');
      const apiResult = await fetch('https://api.github.com/repos/gilesbradshaw/rstart/readme');
      const apiResultContent = await apiResult.json();
      console.log(JSON.stringify(apiResultContent));
      const ct = new Buffer(apiResultContent.content, 'base64').toString('ascii');
      if (!(await fileExists(fileName))) {
        res.status(200).send({ options, 'content': null, name: names[names.length - 1], path });
      } else {
        const content = await readFile(fileName, { encoding: 'utf8' });
        res.status(200).send({ options, content: ct, name: names[names.length - 1], path });
      }
    } else {
      let fileName = join(CONTENT_DIR, (path === '/' ? '/readme' : path) + '.md');
      if (!(await fileExists(fileName))) {
        fileName = join(CONTENT_DIR, path + '/readme.md');
      }
      let dirName = path;
      if (path.indexOf('/') !== -1) {
        dirName = path.substring(0, path.lastIndexOf('/'));
      } else {
        dirName = '';
      }
      const options = await dirs(dirName);
      if (!(await fileExists(fileName))) {
        res.status(404).send({ error: `The page '${path}' is not found.` });
      } else {
        const content = await readFile(fileName, { encoding: 'utf8' });
        res.status(200).send({ options, content, name: names[names.length - 1], path: path });
      }
    }
  } catch (err) {
    next(err);
  }
});

export default router;
