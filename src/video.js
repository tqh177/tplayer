import ListenEvent from './listener';

export default class Video {

    /**
     * @param {Tplayer} player
     */
    constructor (player) {
        this._player = player;

        /** @type {HTMLVideoElement} */
        const ele = document.querySelector(`#${player.id} video`);
        this.ele = ele;
        this._analysis(player);
        this._system_listen(player);
        this._customer_listen(player);
    }

    /** @param {Tplayer} player*/
    _customer_listen (player) {
        const _this = this;
        const ele = this.ele;
        player.event.on('seeking', function (offset) {
            const time = offset * ele.duration;
            ele.currentTime = time;
        }).on('toggle', function () {
            if (ele.paused) {
                ele.play();
            } else {
                ele.pause();
            }
        }).on('volumechange', function (volume) {
            let v = ele.volume;
            if (typeof volume === 'string') {
                v += parseFloat(volume);
            } else {
                v = volume;
            }
            if (v > 1 || v < 0) {
                return;
            }
            ele.volume = v;
        }).on('backward', function (time) {
            ele.currentTime -= time;
        }).on('fastforward', function (time) {
            ele.currentTime += time;
        }).on('destroy', function () {
            _this.destroy && _this.destroy();
        }).on('analysis', function (t) {
            _this._analysis(t);
        });
    }

    /** @param {Tplayer} player*/
    _system_listen (player) {
        let time = 0;
        const ele = this.ele;
        let isLoading = false;
        ListenEvent.regist(ele, player.id).on('volumechange', function () {
            player.event.trigger('showvolumechange', ele.volume);
        }).on('play', function (e) {
            player.event.trigger('showplay', e);
            if (player.config.showAd) {
                player.event.trigger('hiddenAd');
            }
        }).on('pause', function (e) {
            player.event.trigger('showpause', e);
            if (player.config.showDanmaku) {
                player.event.trigger('pauseDanmaku');
            }
            if (player.config.showAd) {
                player.event.trigger('showAd', player.config.ad);
            }
        }).on('timeupdate', function () {
            if (Math.abs(ele.currentTime - time) >= 1) {
                time = ele.currentTime;
                player.event.trigger('timeupdate', this);
            }
            if (player.config.showDanmaku && !ele.paused) {
                player.event.trigger('showDanmaku', ele.currentTime);
            }
        }).on('durationchange', function () {
            player.event.trigger('durationchange', this);
        }).on('progress', function () {
            if ((ele.buffered.length === 0 || ele.currentTime > ele.buffered.end(0) - 0.1) && isLoading === false) {
                isLoading = true;
                player.event.trigger('showLoading');
            }
        }).on('canplay', function () {
            if (isLoading === true) {
                isLoading = false;
                player.event.trigger('hiddenLoading');
            }
        }).on('error', function (e) {
            console.log(e);
            alert('视频出错');
        });
        ListenEvent.regist(document, player.id).on('mouseup', function (e) {
            if (e.target === ele) {
                player.containerFocus = true;
            } else {
                player.containerFocus = false;
            }
        });
    }

    /** @param {Tplayer} player*/
    _analysis (player) {
        this.ele.volume = player.config.volume;
        this.ele.autoplay = !!player.config.autoplay;
        this.ele.loop = !!player.config.loop;
        switch (player.config.type) {
            case 'mp4':
                this._mp4(player.config.url);
                break;
            case 'm3u8':
                this._m3u8(player.config.url);
                break;
            case 'flv': {
                const MediaDataSource = player.config.extend.MediaDataSource || {};
                MediaDataSource.type = player.config.type;
                if (player.config.segments) {
                    MediaDataSource.segments = player.config.segments;
                } else if (player.config.url) {
                    MediaDataSource.url = player.config.url;
                }
                const config = player.config.extend.config || undefined;
                this._flv(MediaDataSource, config);
                break;
            }
            default:
                if (typeof player.config.function === 'function') {
                    player.config.function.call(player);
                } else {
                    throw 'type error or empty';
                }
                break;
        }
    }

    /** @param {string} url */
    _mp4 (url) {
        this.ele.src = url;
    }

    /** @param {string} url */
    _m3u8 (url) {
        const video = this.ele;
        if (video.canPlayType('application/vnd.apple.mpegurl') !== '') {
            video.src = url;
        } else {
            const hlsPlayer = new Hls();
            hlsPlayer.loadSource(url);
            hlsPlayer.attachMedia(video);
            hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        }
    }

    /**
     * @param {FlvJs.MediaDataSource} mediaDataSource
     * @param {FlvJs.Config} config
     */
    _flv (mediaDataSource, config) {
        if (flvjs.isSupported()) {
            const flvPlayer = flvjs.createPlayer(mediaDataSource, config);
            flvPlayer.attachMediaElement(this.ele);
            flvPlayer.load();
            this.destroy = function () {
                flvPlayer.detachMediaElement();
                flvPlayer.destroy();
                this.destroy = null;
            };
        } else {
            throw '不支持flv视频播放';
        }
    }
}