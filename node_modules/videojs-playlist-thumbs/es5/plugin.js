"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

// Default options for the plugin.
var defaults = {
	thumbnailSize: 190,
	playlistItems: 3,
	hideIcons: false,
	upNext: true,
	hideSidebar: false
};

var player = undefined;
var currentIdx = 0;
var videos = [];
var playlistsElemen = null;

/**
* creates each video on the playlist
*/
var createVideoElement = function createVideoElement(idx, title, thumbnail) {
	var videoElement = document.createElement("li");
	var videoTitle = document.createElement("div");
	videoTitle.className = "vjs-playlist-video-title";

	if (idx == 0) {
		if (defaults.upNext) {
			var upNext = document.createElement("div");
			upNext.className = "vjs-playlist-video-upnext";
			upNext.innerText = "UP Next";

			videoTitle.appendChild(upNext);
		}
	}

	if (title) {
		var videoTitleText = document.createElement("div");
		videoTitleText.innerText = title;

		videoTitle.appendChild(videoTitleText); // = "<span>" + title + "</span>";

		videoElement.appendChild(videoTitle);
	}

	videoElement.setAttribute("style", "background-image: url('" + thumbnail + "');");
	videoElement.setAttribute("data-index", idx);

	// when the user clicks on the playlist, the video will start playing
	videoElement.onclick = function (ev) {
		var idx = parseInt(ev.target.getAttribute("data-index"));

		// updates the list and everything before this index should be moved to the end
		var videosBefore = videos.splice(0, idx);

		videosBefore.map(function (video) {
			// adds to the end of the array
			videos.push(video);
		});

		// and play this video
		updatePlaylistAndPlay(true);
	};

	return videoElement;
};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
var onPlayerReady = function onPlayerReady(player, options) {
	videos = options.videos;

	if (options.playlist && options.playlist.thumbnailSize) {
		defaults.thumbnailSize = options.playlist.thumbnailSize.toString().replace("px", "");
	}

	if (options.playlist && options.playlist.items) {
		defaults.playlistItems = options.playlist.items;
	}

	if (options.playlist && options.playlist.hideIcons) {
		defaults.hideIcons = options.playlist.hideIcons;
	}

	if (options.playlist && options.playlist.hideSidebar) {
		defaults.hideSidebar = options.playlist.hideSidebar;
	}

	createElements(player, options);
	updateElementWidth(player);
};

var updatePlaylistAndPlay = function updatePlaylistAndPlay(autoplay) {
	// plays the first video on the playlist
	playVideo(0, autoplay);

	// and move this video to the end of the playlist
	var first = videos.splice(0, 1);

	// then add at the end of the array
	videos.push(first[0]);

	// clean the playlist
	while (playlistsElemen.firstChild) {
		playlistsElemen.removeChild(playlistsElemen.firstChild);
	}

	// add each video on the playlist
	videos.map(function (video, idx) {
		playlistsElemen.appendChild(createVideoElement(idx, video.title, video.thumbnail));
	});
};

/**
* Creates the root html elements for the playlist
*/
var createElements = function createElements(player, options) {
	// creates the playlist items and add on the video player
	playlistsElemen = document.createElement("ul");
	playlistsElemen.className = "vjs-playlist-items";

	if (!defaults.hideSidebar) {
		player.el().appendChild(playlistsElemen);
	}

	// plays the first video
	if (videos.length > 0) {
		updatePlaylistAndPlay(false);
	}

	// create next and previous button
	if (!defaults.hideIcons) {
		var prevBtn = document.createElement("button");
		prevBtn.className = "vjs-button-prev";
		prevBtn.onclick = onPrevClick;

		player.controlBar.el().insertBefore(prevBtn, player.controlBar.playToggle.el());

		var nextBtn = document.createElement("button");
		nextBtn.className = "vjs-button-next";
		nextBtn.onclick = onNextClick;

		player.controlBar.el().insertBefore(nextBtn, player.controlBar.volumeMenuButton.el());
	}

	// creates the loading next on video ends
	player.on("ended", createPlayingNext);

	// adds the main class on the player
	player.addClass('vjs-playlist');
};

var createPlayingNext = function createPlayingNext() {
	nextVideo();
};

var onNextClick = function onNextClick(ev) {
	nextVideo();
};

var onPrevClick = function onPrevClick(ev) {
	previousVideo();
};

/**
* updates the main video player width
*/
var updateElementWidth = function updateElementWidth(player) {
	var resize = function resize(p) {
		var itemWidth = defaults.thumbnailSize;

		var playerWidth = p.el().offsetWidth;
		var playerHeight = p.el().offsetHeight;
		var itemHeight = Math.round(playerHeight / defaults.playlistItems);

		var youtube = p.$(".vjs-tech");
		var newSize = playerWidth - itemWidth;

		if (newSize >= 0) {
			var style = document.createElement('style');
			var def = ' ' + '.vjs-playlist .vjs-poster { width: ' + newSize + 'px !important; }' + '.vjs-playlist .vjs-playlist-items { width: ' + itemWidth + 'px !important; }' + '.vjs-playlist .vjs-playlist-items li { width: ' + itemWidth + 'px !important; height: ' + itemHeight + 'px !important; }' + '.vjs-playlist .vjs-modal-dialog { width: ' + newSize + 'px !important; } ' + '.vjs-playlist .vjs-control-bar, .vjs-playlist .vjs-tech { width: ' + newSize + 'px !important; } ' + '.vjs-playlist .vjs-big-play-button, .vjs-playlist .vjs-loading-spinner { left: ' + Math.round(newSize / 2) + 'px !important; } ';

			style.setAttribute('type', 'text/css');
			document.getElementsByTagName('head')[0].appendChild(style);

			if (style.styleSheet) {
				style.styleSheet.cssText = def;
			} else {
				style.appendChild(document.createTextNode(def));
			}
		}
	};

	if (!defaults.hideSidebar) {
		window.onresize = function () {
			resize(player);
		};

		if (player) {
			resize(player);
		}
	}
};

/**
* plays the video based on an index
*/
var playVideo = function playVideo(idx, autoPlay) {
	var video = { type: videos[idx].type, src: videos[idx].src };

	player.src(video);
	player.poster(videos[idx].thumbnail);

	if (autoPlay || player.options_.autoplay) {
		try {
			player.play();
		} catch (e) {}
	}
};

/**
* plays the next video, if it comes to the end, loop 
*/
var nextVideo = function nextVideo() {
	if (currentIdx < videos.length) {
		currentIdx++;
	} else {
		currentIdx = 0;
	}

	updatePlaylistAndPlay(true);
};

/**
* plays the previous video, if it comes to the first video, loop
*/
var previousVideo = function previousVideo() {
	if (currentIdx > 0) {
		currentIdx--;
	} else {
		currentIdx = videos.length - 1;
	}
	playVideo(currentIdx, true);
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function playlist
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var playlist = function playlist(options) {
	var _this = this;

	this.ready(function () {
		player = _this;
		onPlayerReady(_this, _videoJs2["default"].mergeOptions(defaults, options));
	});
};

// Register the plugin with video.js.
_videoJs2["default"].plugin('playlist', playlist);

// Include the version number.
playlist.VERSION = '__VERSION__';

exports["default"] = playlist;
module.exports = exports["default"];