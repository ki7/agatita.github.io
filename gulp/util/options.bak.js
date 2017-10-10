'use strict';

var path = require('path'),
  fs = require('fs'),

  plugins = require('gulp-load-plugins')(),
  marked = require('marked'),
  debug = require('debug')('tasks:options.js'),
  _ = require('lodash'),

  paths = require('../../config/paths.json'),
  cache = require('./'),
  data = cache.data,
  md = cache.md,
  monthNames = ['jan.', 'fév.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

var opts = {

  // Used by the gulp watch task to build only one jade at a time;
  currentFile: false,
  update: function(currentPage) {
    this.value.locals.pages = cache.exports.value;
    Object.defineProperties(
      this.value.locals, {
        'fn': {
          get: function() {
            return this.exports.libs ? require(path.join('../../src', this.exports.libs)) : 'none';
          },
          configurable: true
        },

        'dataMD': {
          get: function() {
            var dataMD = this.page.split('/').slice(0, -1).join('/') + '/_data';

            // console.log(dataMD);
            if (this.exports.dataMD) {
              dataMD = this.exports.dataMD + '/_data';
            }

            return md.value[dataMD];
          },
          configurable: true
        },

        'productMD': {
          get: function() {
            return md.value[this.exports.productLg + '/_data'];
          },
          configurable: true
        },

        'Data': {
          get: function() {
            return data.value;
          },
          configurable: true
        },

        'fondsData': {
          get: function() {

            // Quick acces finninfo perf Data.fondsData in jade files
            // check gulp datas task fro cache.fondsData.value initialisation
            return cache.fondsData.value;
          },
          configurable: true
        },

        'data': {
          get: function() {
            var _data = data.value.getPageData(this.page);
   
            // console.log('\n=================\n');
            // console.log(data.value);
            // console.log('\n=================\n');
            // console.log(_data);
            // console.log('\n=================\n\n');
       
            if (this.exports.data) {
              var hasOwn = Object.prototype.hasOwnProperty,
                data2merge = data.value[this.exports.data]._data;

              for (var key in data2merge) {
                if (hasOwn.call(data2merge, key)) {
                  _data[key] = data2merge[key];
                }
              }
            }
          
            debug('\nOptions.js=================');
            debug(this.page);
            debug(_data);
            debug('=================\n');
            debug('\n');
          
            return _data;
          },
          configurable: true
        },

        'md': {
          get: function() {
            return md.value[this.page] || {};
          },
          configurable: true
        }
      }
    );

    if (typeof currentPage !== 'undefined') {
      Object.defineProperty(this.value.locals, 'currentPage', {
        get: function() {
          return currentPage;
        },
        configurable: true
      });
    }
  },
  value: {
    basedir: path.resolve(__dirname, '../../src/'),
    locals: {
      pages: cache.exports.value,
      isDevelopement: plugins.util.env.type === 'dev',

      // FIXME ==> rewrite  mixins to accept no object as value
      // Use case, need the mixin only for the markup /style
      // but content is higly dynamic, doen't belong to Markdown
      stub: function() {
        return [{
          title: '',
          contents: '',
          json: {}
        }];
      },
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

      // ## Helper to use in mixins

      // parseAttrs("rightBloc epargner")
      // ==> "ing--rightBloc ing--epargner"

      // parseAttrs("rightBloc epargner", 'ing-Target--')
      // ==> "ing-Target--rightBloc ing-Target--epargner"

      parseAttrs: function(str, name) {
        if (typeof str === 'undefined') {
          return '';
        }
        var Block = name || 'ing--',
          aStrs = str.split(/\s/);

        if (aStrs.length > 0) {
          return aStrs.map(function(modifier) {
            return Block + modifier;
          }).join(' ');

        }

        // Juste one attrs
        return Block + str;

      },
      getModifiers: function(modifiers, block) {

        var base = ' ing' + (block ? '-' + block : '') + '--';

        if (!modifiers) {
          return '';
        }

        var buffer = '';
        if (/\s/.test(modifiers)) {
          var m = modifiers.split(' '),
            lgt = m.length;
          for (var i = 0; i < lgt; i++) {
            buffer += base + m[i];
          }
          return buffer;
        }

        return base + modifiers;

      },
      idFromLink: function(link, prefix) {
        return (prefix || '') +
          link
          .replace(/(\/$|\/\/|(https?)?:\/\/)/, '')
          .replace(/\./g, '_')
          .replace(/\//g, '--');
      },
      getPages: function(object) {
        return _.where(cache.exports.value, object);
      },
      getFeedDescription: function(post) {
        return marked(
          fs.readFileSync(
            path.resolve(__dirname, '../../pages/', post + '.md'),
            'utf-8'
          )
        );
      },
      parseMdArray: function(arr) {
        var res = {};

        for (var i = 0; i < arr.length; i++) {
          if (arr[i].json.isTitle) {
            res.intro = arr.splice(i, 1)[0];
            break;
          }
        }

        res.contents = arr;

        return res;
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
      },
      // helper taking an objet to format a proper  mailto string to put in a href
      mailto: function(obj) {
        return 'mailto:' + obj.mailto +
          '?subject=' + encodeURIComponent(obj.subject) +
          '&body=' + encodeURIComponent(obj.body.join('\n'))
      }
    }
  }

};

module.exports = opts;