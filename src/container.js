import { noFullElement } from './until';
import ListenEvent from './listener';
import svg from './svg';
import Danmaku from './danmaku';
import Ad from './ad';

export default class Container {

    /** @param {Tplayer} player*/
    constructor (player) {
        this.player = player;

        /** @type {HTMLDivElement}*/
        const ele = document.getElementById(player.id);
        ele.style.position = 'relative';
        ele.style.backgroundColor = '#000';
        this.ele = ele;
        ele.innerHTML = this._init(player.config);
        this.menu = this._create_menu(document.querySelector(`#${player.id} .tplayer-menu`), player.config.menu);
        this._system_listen(player);
        this._customer_listen(player);
        new Danmaku(player, ele);
        new Ad(player);
    }

    /** @param {Tplayer} player*/
    _customer_listen (player) {
        const ele = this.ele;
        const loadEle = document.querySelector(`#${player.id} .tplayer-loading`);
        let timer_loading = null;
        player.event.on('fullscreen', function () {
            const e = ele;
            const i = e.requestFullscreen || e.msRequestFullscreen || e.webkitRequestFullscreen;
            i.call(ele);
        }).on('exitfullscreen', function () {
            const i = document.exitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen;
            i.call(document);
        }).on('showLoading', function () {
            loadEle.style.display = 'block';
            let deg = 0;
            timer_loading = setInterval(function () {
                deg += 30;
                deg %= 360;
                loadEle.style.transform = `rotate(${deg}deg)`;
            }, 100);
        }).on('hiddenLoading', function () {
            clearInterval(timer_loading);
            timer_loading = null;
            loadEle.style.display = 'none';
        });
    }

    /** @param {HTMLDivElement} menu*/
    _create_menu (menu, config) {
        [].forEach.call(config, (element) => {
            const menuitem = document.createElement('p');
            menuitem.style.height = '30px';
            menuitem.style.lineHeight = '30px';
            menuitem.style.margin = '0';
            menuitem.style.fontSize = '12px';
            menuitem.style.paddingLeft = '10px';
            menuitem.style.paddingRight = '30px';
            switch (element.style) {
                case 'link': {
                    const a = document.createElement('a');
                    a.style.color = '#000';
                    a.style.textDecoration = 'none';
                    a.href = element.link;
                    a.target = element.target || 'blank';
                    a.innerText = element.title;
                    menuitem.appendChild(a);
                    break;
                }
                case 'text':
                    menuitem.innerText = element.title;
                    break;
                default:
                    break;
            }
            menu.appendChild(menuitem);
        });
        return menu;
    }

    /** @param {Tplayer} player*/
    _system_listen (player) {
        const ele = this.ele;
        const menu = this.menu;
        let timer_click = null;
        let timer_showController = null;
        function setTimeHiddenController () {
            clearTimeout(timer_showController);
            timer_showController = setTimeout(() => {
                player.event.trigger('hiddenController');
                if (!noFullElement()) {
                    ele.style.cursor = 'none';
                }
                timer_showController = null;
            }, 3000);
            if (ele.style.cursor === 'none') {
                ele.style.cursor = 'default';
            }
        }
        setTimeHiddenController();
        ListenEvent.regist(ele, player.id).on('dblclick', function (e) {
            if (noFullElement()) {
                player.fullScreen();
            } else {
                player.exitfullscreen();
            }
            e.preventDefault();
            e.stopPropagation();
        }, true).on('click', function () {
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
                return;
            }
            if (timer_click) {
                clearTimeout(timer_click);
                timer_click = null;
                return;
            }
            timer_click = setTimeout(() => {
                player.toggle();
                timer_click = null;
            }, 500);
        }).on('mousemove', function (e) {
            if (e.offsetX && e.offsetX + 3 >= window.screen.width) {
                clearInterval(timer_showController);
                timer_showController = null;
                player.event.trigger('hiddenController');
                if (!noFullElement()) {
                    ele.style.cursor = 'none';
                }
                return;
            }
            player.event.trigger('showController');
            setTimeHiddenController();
        }).on('mouseleave', function () {
            clearTimeout(timer_showController);
            timer_showController = null;
            player.event.trigger('hiddenController');
        }).on('contextmenu', function (e) {
            menu.style.display = 'block';
            const rect = e.currentTarget.getBoundingClientRect();
            menu.style.left = e.clientX - rect.left + 'px';
            menu.style.top = e.clientY - rect.top + 'px';
            // menu.style.left = e.offsetX + 'px';
            // menu.style.top = e.offsetY + 'px';
            e.preventDefault();
        });

        /** MSFullscreenChange just for ie…… */
        const w = ele.style.width;
        const h = ele.style.height;
        ListenEvent.regist(document, player.id).on('MSFullscreenChange', function () {
            if (noFullElement()) {
                ele.style.width = w;
                ele.style.height = h;
            } else {
                ele.style.width = '100%';
                ele.style.height = '100%';
            }
        }).on('keydown', function (e) {
            if (player.containerFocus) {
                // player.event.trigger('showController');
                player.event.trigger('showController');
                setTimeHiddenController();
                if (e.keyCode === 37) {
                    player.event.trigger('backward', player.config.backward || 5);
                } else if (e.keyCode === 39) {
                    player.event.trigger('fastforward', player.config.fastforward || 5);
                } else if (e.keyCode === 32) {
                    player.event.trigger('toggle');
                } else if (e.keyCode === 102 || e.keyCode === 70) {
                    const flag = noFullElement();
                    flag === true ? player.fullScreen() : player.exitfullscreen();
                } else if (e.keyCode === 38) {
                    player.event.trigger('volumechange', '+0.1');
                } else if (e.keyCode === 40) {
                    player.event.trigger('volumechange', '-0.1');
                } else {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    /** @param {Tplayer.Config} options*/
    _init (options) {
        const svg_toggle = options.autoplay ? svg.play : svg.pause;
        const svg_volume = options.volume === 0 ? svg.volumeOff : options.volume < 1 ? svg.volumeDown : svg.volumeUp;
        const volume = options.volume;
        return `<div class="tplayer-container" style="width: 100%;height:100%;position:absolute;overflow:hidden;" onselectstart="return false">
        <video style="width:100%;height:100%;"></video>
        <div class="tplayer-menu" oncontextmenu="self.event.stopPropagation()" style="z-index: 999;position: absolute;font-size: 12px;background-color: #fff;padding: 5px;color: rgb(161,169,190);box-shadow: rgb(170, 170, 170) 2px 2px 3px;display: none;"></div>
        <div class="tplayer-loading" style="display:none;position: absolute;left:50%;top:50%;margin-left:-50px;margin-top:-50px;width:100px;">${svg.loading}</div>
        <div class="tplayer-ad" style="display:none;position: absolute;left:50%;top:50%;z-index:9;"></div>
        <div class="tplayer-danmaku" style="position: absolute;top:0;left:0;"></div>
        <div class="tplayer-controller" onclick="event.stopPropagation();return false" style="position: absolute;bottom: 0;height: 40px;width: 96%;left: 2%;transition:bottom 0.5s;">
            <div class="tplayer-bar" style="cursor: pointer; background-color: rgba(255, 255, 255, 0.3); width: 100%; height: 4px; border-radius: 2px;">
                <div class="tplayer-bar-title" style="color: rgb(255, 255, 255); font-size: 12px; position: absolute; bottom: 100%; left: -11.5px; display: none;"></div>
                <div class="tplayer-progress" style="background-color: rgb(255, 255, 255); width: 0; height: 100%; float: left;"></div>
            </div>
            <div class="tplayer-left" style="float: left; display: inline-block;">
                <div class="tplayer-svg-toggle" style="cursor: pointer; height: 30px; width: 30px; display: inline-block;">
                    ${svg_toggle}
                </div>
                <div class="tplayer-svg-volume" style="cursor: pointer; height: 30px; width: 30px; display: inline-block;">
                    ${svg_volume}
                </div>
                <div class="tplayer-volume" style="cursor: pointer; height: 6px; width: 100px; background-color: rgba(255, 255, 255, 0.3); display: inline-block; vertical-align: text-top;">
                    <div class="tplayer-volume-progress" style="height: 100%; width: ${volume * 100}%; background-color: rgb(255, 255, 255); float: left;"></div>
                </div>
                <div class="tplayer-time" style="height: 30px; display: inline-block; line-height: 30px; color: rgb(255, 255, 255); vertical-align: top; padding-left: 10px;">00:00/00:00</div>
            </div>
            <div class="tplayer-right" style="float: right; display: inline-block;">
                <div class="tplayer-fullscreen" style="cursor: pointer; height: 30px; width: 30px; display: inline-block;">
                    ${svg.full}
                </div>
            </div>
        </div>
    </div>`;
    }
}