import ListenEvent from './listener';
import { parseTime, noFullElement } from './until';
import svg from './svg';

export default class Controller {

    /**
     * @param {Tplayer} player
     */
    constructor (player) {
        this._customer_listen(player);
        this._system_listen(player);
    }

    /** @param {Tplayer} player*/
    _customer_listen (player) {
        const time = document.querySelector(`#${player.id} .tplayer-time`);
        const controller = document.querySelector(`#${player.id} .tplayer-controller`);
        const progress = document.querySelector(`#${player.id} .tplayer-progress`);
        // let timerController = null;
        player.event.on('timeupdate', function (that) { // 刷新进度条
            if (isNaN(that.duration)) {
                time.innerText = '00:00/00:00';
            } else {
                progress.style.width = that.currentTime / that.duration * 100 + '%';
                time.innerText = parseTime(that.currentTime) + '/' + parseTime(that.duration);
            }
        }).on('showController', function () { // 显示控制面板
            // if (timerController) {
            //     clearInterval(timerController);
            //     timerController = null;
            // }
            controller.style.bottom = '0px';
        }).on('hiddenController', function () { // 隐藏控制面板
            // if (timerController === null) {
            //     const height = controller.offsetHeight;
            //     const f = height / 0.5 / 50;
            //     let h = f;
            //     timerController = setInterval(() => {
            //         controller.style.bottom = '-' + h + 'px';
            //         if (h >= height) {
            //             clearInterval(timerController);
            //             timerController = null;
            //         }
            //         h += f;
            //     }, 20);
            // }
            controller.style.bottom = '-' + controller.offsetHeight + 'px';
        }).on('durationchange', function (that) {
            time.innerText = '00:00/' + parseTime(that.duration);
        }).on('destroy', function () {
            player.event.trigger('showpause');
            time.innerText = '00:00/00:00';
            progress.style.width = '0';
        }).on('showplay', function () {
            // ReactDOM.render(svg_play, document.querySelector(`#${player.id} .tplayer-svg-toggle`));
            document.querySelector(`#${player.id} .tplayer-svg-toggle`).innerHTML = svg.play;
        }).on('showpause', function () {
            document.querySelector(`#${player.id} .tplayer-svg-toggle`).innerHTML = svg.pause;
        }).on('showvolumechange', function (volume) {
            const ele = document.querySelector(`#${player.id} .tplayer-svg-volume`);
            if (volume < 0.01) {
                ele.innerHTML = svg.volumeOff;
            } else if (volume > 0.98) {
                ele.innerHTML = svg.volumeUp;
            } else {
                ele.innerHTML = svg.volumeDown;
            }
            document.querySelector(`#${player.id} .tplayer-volume-progress`).style.width = volume * 100 + '%';
        });
    }

    /** @param {Tplayer} player*/
    _system_listen (player) {
        const bar = document.querySelector(`#${player.id} .tplayer-bar`);
        const barTitle = document.querySelector(`#${player.id} .tplayer-bar-title`);
        const svg_toggle = document.querySelector(`#${player.id} .tplayer-svg-toggle`);
        const svg_volume = document.querySelector(`#${player.id} .tplayer-svg-volume`);
        const volume = document.querySelector(`#${player.id} .tplayer-volume`);
        const fullscreen = document.querySelector(`#${player.id} .tplayer-fullscreen`);
        ListenEvent.regist(bar, player.id).on('click', function (e) {
            if (e.target !== barTitle) {
                player.event.trigger('seeking', e.offsetX / bar.offsetWidth);
                e.preventDefault();
                e.stopPropagation();
            }
        }).on('mousemove mouseover', function (e) {
            if (e.target === barTitle) {
                return;
            }
            if (barTitle.style.display === 'none') {
                barTitle.style.display = 'block';
            }
            const offset = e.offsetX / bar.offsetWidth;
            barTitle.innerText = parseTime(player.duration * offset);
            barTitle.style.left = e.offsetX - barTitle.offsetWidth / 2 + 'px';
        }).on('mouseleave', function () {
            barTitle.style.display = 'none';
        });
        ListenEvent.regist(svg_toggle, player.id).on('click', function (e) {
            player.event.trigger('toggle', e);
            e.preventDefault();
            e.stopPropagation();
        });
        let lastVolume = player.config.volume;
        ListenEvent.regist(svg_volume, player.id).on('click', function (e) {
            const offset = volume.getElementsByTagName('div')[0].offsetWidth / volume.offsetWidth;
            if (offset < 0.01) {
                player.event.trigger('volumechange', lastVolume);
                lastVolume = 0;
            } else {
                player.event.trigger('volumechange', 0);
                lastVolume = offset;
            }
            e.preventDefault();
            e.stopPropagation();
        });
        let isdrag = false;
        ListenEvent.regist(volume, player.id).on('click', function (e) {
            const offset = e.offsetX / volume.offsetWidth;
            player.event.trigger('volumechange', offset);
            e.preventDefault();
            e.stopPropagation();
        }).on('mousedown', function () {
            isdrag = true;
        }).on('mousemove', function (e) {
            if (isdrag) {
                const offset = e.offsetX / volume.offsetWidth;
                player.event.trigger('volumechange', offset);
                e.preventDefault();
                e.stopPropagation();
            }
        });
        ListenEvent.regist(fullscreen, player.id).on('click', function (e) {
            const flag = noFullElement();
            flag === true ? player.fullScreen() : player.exitfullscreen();
            e.preventDefault();
            e.stopPropagation();
        });
        ListenEvent.regist(document, player.id).on('mouseup', function () {
            isdrag = false;
        });
    }
}