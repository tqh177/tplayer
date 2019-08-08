import Config from './config';
import Video from './video';
import playerEvent from './event';
import Container from './container';
import Controller from './controller';

export default class player {

    /**
     * Tplayer:{__VERSION__}
     * @param {Tplayer.Config} config
     */
    constructor (config) {
        this.id = config.containerID;
        this.containerFocus = false;
        this.config = Config.parse(config);
        this.event = new playerEvent();
        new Container(this);
        const video = new Video(this);
        this.video = video.ele;
        new Controller(this);
        // container.appendChild(video.ele, controller.ele);
    }
    newVideo (config) {
        this.pause();
        this.config = Config.parse(config);
        this.event.trigger('destroy');
        this.event.trigger('analysis', this);
    }
    play () {
        this.video.play();
    }
    pause () {
        this.video.pause();
    }
    toggle () {
        this.video.paused ? this.video.play() : this.video.pause();
    }
    seek (time) {
        this.currentTime = time < 0 ? 0 : time > this.video.duration ? this.video.duration : time;
    }
    get currentTime () {
        return this.video.currentTime;
    }
    get duration () {
        return this.video.duration;
    }
    destroy () {
        this.event.trigger('destroy');
    }
    fullScreen () {
        this.event.trigger('fullscreen');
    }
    exitfullscreen () {
        this.event.trigger('exitfullscreen');
    }
    addDanmaku (danmaku) {
        this.config.danmaku = this.config.danmaku.concat(danmaku);
    }
    addAd (ad) {
        this.config.ad = ad;
    }
}
/* global __VERSION__ */
player.version = `${__VERSION__}`;