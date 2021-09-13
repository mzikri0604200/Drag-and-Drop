/**
 * videojs-related
 * @version 0.0.1
 * @copyright 2016 Gustaf Elbander <gustaf.elbander@flownetwork.se>
 * @license MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsRelated = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * JavaScript Templates
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/* global define */

;(function ($) {
  'use strict'
  var tmpl = function (str, data) {
    var f = !/[^\w\-\.:]/.test(str)
      ? tmpl.cache[str] = tmpl.cache[str] || tmpl(tmpl.load(str))
      : new Function(// eslint-disable-line no-new-func
        tmpl.arg + ',tmpl',
        'var _e=tmpl.encode' + tmpl.helper + ",_s='" +
          str.replace(tmpl.regexp, tmpl.func) + "';return _s;"
      )
    return data ? f(data, tmpl) : function (data) {
      return f(data, tmpl)
    }
  }
  tmpl.cache = {}
  tmpl.load = function (id) {
    return document.getElementById(id).innerHTML
  }
  tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g
  tmpl.func = function (s, p1, p2, p3, p4, p5) {
    if (p1) { // whitespace, quote and backspace in HTML context
      return {
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        ' ': ' '
      }[p1] || '\\' + p1
    }
    if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
      if (p2 === '=') {
        return "'+_e(" + p3 + ")+'"
      }
      return "'+(" + p3 + "==null?'':" + p3 + ")+'"
    }
    if (p4) { // evaluation start tag: {%
      return "';"
    }
    if (p5) { // evaluation end tag: %}
      return "_s+='"
    }
  }
  tmpl.encReg = /[<>&"'\x00]/g // eslint-disable-line no-control-regex
  tmpl.encMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  }
  tmpl.encode = function (s) {
    return (s == null ? '' : '' + s).replace(
      tmpl.encReg,
      function (c) {
        return tmpl.encMap[c] || ''
      }
    )
  }
  tmpl.arg = 'o'
  tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
                  ',include=function(s,d){_s+=tmpl(s,d);}'
  if (typeof define === 'function' && define.amd) {
    define(function () {
      console.log('1');
      return tmpl
    })
  } else if (typeof module === 'object' && module.exports) {
    console.log('2');
    module.exports = tmpl
  } else {
    console.log('3');
    $.tmpl = tmpl
  }
}(this))

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

var _blueimpTmpl = require('blueimp-tmpl');

var _blueimpTmpl2 = _interopRequireDefault(_blueimpTmpl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default options for the plugin.
var defaults = {
  //Video container title
  videoContainerTitle: 'More videos!',

  // Css class for the overlay wich will contain the related videos.
  className: 'related-video-wall',

  // Base url for fetching videos (REST)
  base_url: '/resources/related.json',

  // If the link privided by the video should goto the url set `true`.
  // If `false` it will replace the videojs source
  gotoUrl: true
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-related');

  player.related.settings = options;
  player.related.createQuery = options.createQuery;

  player.on('play', function () {
    player.related.removeWall();
  });

  player.on('canplaythrough', function () {
    player.related.showWall();
  });
};

/**
 * When player is ready, load the plugin
 *
 * @param    {Object} [options={}]
 */
var related = function related(options) {
  var _this = this;

  this.ready(function () {
    onPlayerReady(_this, _video2.default.mergeOptions(defaults, options));
  });
};

/**
 * Handle the different actions you can do on the current video.
 * @param  {Object} event
 * @param  {Object} data
 */
related.handleActionClicks = function (event, data) {
  var expression = event.currentTarget.attributes.id.textContent;

  event.preventDefault();

  switch (expression) {
    case 'return':
      player.play();
      break;
    case 'fb':
      console.log('fb');
      break;
    case 'twitter':
      console.log('twitter');
      break;
    case 'copy':
      console.log('copy');
      break;
  }
};

/**
 * Create the container wich contains actions regarding the current video.
 * @return {DOMElement} Return the processed element.
 */
related.createActionContainer = function () {
  var actionContainerWrapper = void 0,
      buttons = void 0;

  actionContainerWrapper = document.createElement('div');
  actionContainerWrapper.className = 'action-container-wrapper';
  actionContainerWrapper.innerHTML = (0, _blueimpTmpl2.default)('related-actions', {});

  buttons = actionContainerWrapper.getElementsByClassName('action');

  for (var _iterator = buttons, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var button = _ref;

    button.addEventListener('click', function (e) {
      this.handleActionClicks(e);
    }.bind(this), false);
  }

  return actionContainerWrapper;
};

/**
 * Either goto a url or update player source.
 * @param  {Object} event
 * @param  {Object} data
 */
related.handleClickedVideo = function (event, data) {
  event.preventDefault();

  if (this.settings.gotoUrl) {
    window.location = event.target.href;
  }

  player.related.updateSource(event.target.href);
};

/**
 * Create the container wich contains list of related videos.
 * @return {DOMElement} Return the processed element.
 */
related.createVideoContainer = function (videos) {
  var videoContainerWrapper = void 0,
      videoElements = void 0;

  videoContainerWrapper = document.createElement('div');
  videoContainerWrapper.className = 'video-container-wrapper';
  videoContainerWrapper.innerHTML = (0, _blueimpTmpl2.default)('related-videos', {
    title: this.settings.videoContainerTitle,
    videos: videos
  });

  videoElements = videoContainerWrapper.getElementsByClassName('video-preview');

  for (var _iterator2 = videoElements, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var videoElement = _ref2;

    videoElement.addEventListener('click', function (e) {
      this.handleClickedVideo(e);
    }.bind(this), false);
  }

  return videoContainerWrapper;
};

/**
 * Create wall containing actions on current video and videolist.
 *
 * @param  {Array} videos
 */
related.createWall = function (videos) {
  var wall = void 0,
      header = void 0;

  this.removeWall();

  wall = document.createElement('div');
  wall.className = this.settings.className;

  // Append to wall
  wall.appendChild(this.createActionContainer());
  wall.appendChild(this.createVideoContainer(videos));

  player.el().appendChild(wall);
};

/**
 * Load the json.
 *
 * @param  {String} query Should look like `key=value&otherKey=otherValue`
 */
related.loadSource = function (query) {
  var url = this.settings.base_url + '?' + query,
      request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.send();
  request.onload = function () {
    var response = JSON.parse(this.response);
    player.trigger('related:fetched', {
      response: response
    });
  };
};

/**
 * Display the wall with its content.
 */
related.showWall = function () {
  var query = this.createQuery();
  this.loadSource(query);
};

/**
 * Remove the wall when not needed. eg. when video is playing.
 */
related.removeWall = function () {
  var wall = document.querySelector('.' + this.settings.className);
  if (wall != null) {
    wall.remove();
  }
};

/**
 * Update the videosjs source and play.
 *
 * @param  {String} source
 */
related.updateSource = function (source) {
  player.src(source);
  player.play();
};

window.tmpl = _blueimpTmpl2.default;

// Register the plugin with video.js.
_video2.default.plugin('related', related);

// Include the version number.
related.VERSION = '0.0.1';

exports.default = related;

// TODO: Make actions dynamic based on template?
// TODO: Maybe move templates to strings.
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"blueimp-tmpl":1}]},{},[2])(2)
});