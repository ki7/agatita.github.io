'use strict';

var path = require('path'),
  fs = require('fs'),
  marked = require('marked'),
  _ = require('lodash'),
  monthNames = ['jan.', 'fév.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

var opts = {
  value: {
    basedir: path.resolve(__dirname, '../../src/pages/'),
    locals: {
      path: function() {
        return module.exports.value.locals.page.replace(/(?:index)$/, '');
      },
      isSamePage: function(path) {
        return (
          path.replace(/(?:index)?\.html$/, '') ===
          module.exports.value.locals.page.replace(/\/(?:index)$/, '')
        );
      },
      hasSamePath: function(path) {
        var linkPath = path.replace(/(?:index)?\.html$/, '');
        var pagePath = module.exports.value.locals.page.replace(/(?:index)$/, '');
        var uri = module.exports.value.locals.uri(linkPath, pagePath);
        return (
          uri === '' || /\.\.(?:\/([\w\-]+))?$/.test(uri)
        );
      },
      uri: function(to, from) {
        var locals = module.exports.value.locals,
          absoluteLinks = locals.exports && locals.exports.links === 'absolute',
          uriParts = from.split(/\/|\\/),
          deep = uriParts.length - 1;

        if (_.isArray(to)) {
          to = path.join.apply(path, to);
        }
        if (_.isArray(from)) {
          from = path.join.apply(path, from);
        }

        if (to.indexOf('://') !== -1) {
          return to;
        }

        if (to.indexOf('mailto:') !== -1) {
          return to;
        }

        if (from && !absoluteLinks) {

          // We keep track of the links ending with a slash,
          // sincepath.relative( from.replace( /index$/, '' ), to ), we'll remove it
          var endingSLash = /\/$/.test(to);

          // if
          // from = assurance-vie/index
          // to = assurance-vie/
          // OR
          // from = assurance-vie/performance-sur-mesure/index
          // to = assurance-vie/performance-sur-mesure/
          // ==> /
          // So we rewrite it to be relative

          var samePage = from.replace(/index$/, '') === to;
          var standAloneMd = from + '/' === to;

          if (samePage) {
            var buff = '';
            for (var i = 0; i < deep; i++) {
              buff += '../';
            }

            to = buff + to;

            // console.log('buff', to);

          } else if (standAloneMd) {
            to = '../' + uriParts[deep];
          } else {
            to = path.relative(from.replace(/index$/, ''), to);
          }

          if (endingSLash && !samePage) {
            to = to + '/';
          }
        }

        to = to

        // windows OS fix
          .replace(/\\/g, '/')

        // remove useless & ugly trailing index.html
        .replace(/index\.html$/, '');

        // Error pages must have absolute path
        if (absoluteLinks) {
          to = '/' + to;
        }

        // FIXME
        // replace href=".." or href="../.." by href="/" for auto crawling

        // I.E.
        // var _page = page.split( '/' ),
        // isCategorieHome = _page && _page[ 0 ] + '/' === itemLink;
        // return ( isCategorieHome ? '/' + _page[ 0 ] : module.exports.value.locals.uri( itemLink, page ) );

        return to;
      },
      formatDate: function(date) {
        date = new Date(date);

        return [
          date.getDate(),
          monthNames[date.getMonth()],
          date.getFullYear()
        ].join(' ');
      },
      getFile: function(pathString) {
        return (
          fs.readFileSync(
            path.resolve(__dirname, '../../src/', pathString),
            'utf-8'
          )
        );
      },
      getMarkdown: function(pathString) {
        return marked(module.exports.value.locals.getFile(pathString));
      }
    }
  }

};
//console.log('basedir', opts.value.basedir );
module.exports = opts;
