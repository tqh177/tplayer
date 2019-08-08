export default class Danmaku {

    /**
     * @param {Tplayer} player 播放器实例
     * @param {HTMLElement} ele 容器对象
     */
    constructor (player, ele) {
        this.containerEle = ele;
        this._customer_listen(player);
    }

    /** @param {Tplayer} player*/
    _customer_listen (player) {
        const ele = this.containerEle;
        const danmakuEle = document.querySelector(`#${player.id} .tplayer-danmaku`);
        let danmakuItemEles = [];
        let lastTime = 0;
        let lastIndex = 0;
        player.event.on('showDanmaku', function (time) {
            const danmaku = player.config.danmaku;
            const containerWidth = ele.offsetWidth;
            const _danmakuItemEles = [];
            for (const item of danmakuItemEles) {

                /** @type {HTMLElement} */
                let div = item[0];

                /** @type {Tplayer.Danmaku} */
                const danmaku = item[1];
                switch (danmaku.type) {
                    case 0: {
                        const x = div.offsetWidth + containerWidth;
                        const translateX = -parseFloat(window.getComputedStyle(div).transform.split(',')[4]);
                        if (x <= translateX) {
                            div.remove();
                            div = null;
                        } else {
                            if (item[2] === false) {
                                div.style.transform = `translateX(-${x}px)`;
                                div.style.transition = `transform ${(x - translateX) / x * danmaku.speed}s linear`;
                                item[2] = true;
                            }
                            _danmakuItemEles.push(item);
                        }
                        break;
                    }
                    case 1: {
                        if (!(danmaku.time < time && time < danmaku.time + danmaku.speed) && item[2] === true) {
                            div.remove();
                            div = null;
                        } else {
                            item[2] = true;
                            _danmakuItemEles.push(item);
                        }
                        break;
                    }
                }
            }
            danmakuItemEles = _danmakuItemEles.length ? _danmakuItemEles : danmakuItemEles;
            if (lastTime > time) {
                lastTime = time;
                lastIndex = 0;
            }
            for (let i = lastIndex; i < danmaku.length; i++) {
                if (danmaku[i].time < lastTime) {
                    continue;
                } else if (danmaku[i].time <= time) {
                    danmaku[i].font = danmaku[i].font || 'initial';
                    danmaku[i].color = danmaku[i].color || '#ffffff';
                    danmaku[i].speed = danmaku[i].speed || 5;
                    danmaku[i].type = danmaku[i].type || 0;
                    const div = document.createElement('div');
                    div.innerText = danmaku[i].text;
                    switch (danmaku[i].type) {
                        case 0: {
                            div.style.cssText = `pointer-events:none;white-space:pre;position:absolute;z-index:1;will-change:transition;color:${danmaku[i].color};top:${danmaku[i].position}px;left:${containerWidth}px;font:${danmaku[i].font};transition:transform ${danmaku[i].speed}s linear;transform:translateX(0px);`;
                            setTimeout(() => {
                                div.style.transform = `translateX(-${div.offsetWidth + containerWidth}px)`;
                                danmakuItemEles.push([div, danmaku[i], true]);
                            }, 0);
                            danmakuEle.appendChild(div);
                            break;
                        }
                        case 1: {
                            div.style.cssText = `pointer-events:none;white-space:pre;position:absolute;z-index:1;color:${danmaku[i].color};top:${danmaku[i].position}px;font:${danmaku[i].font};`;
                            setTimeout(() => {
                                div.style.marginLeft = `${(containerWidth - div.clientWidth) / 2}px`;
                                danmakuItemEles.push([div, danmaku[i], true]);
                            }, 0);
                            danmakuEle.appendChild(div);
                            break;
                        }
                    }
                } else {
                    lastIndex = i;
                    break;
                }
            }
            lastTime = time;
        }).on('pauseDanmaku', function () {
            for (const item of danmakuItemEles) {

                /** @type {HTMLElement} */
                const div = item[0];

                /** @type {Tplayer.Danmaku} */
                const danmaku = item[1];
                item[2] = false;
                switch (danmaku.type) {
                    case 0: {
                        const translateX = window.getComputedStyle(div).transform.split(',')[4];
                        div.style.transform = `translateX(${translateX}px)`;
                        div.style.transition = 'transform 0s';
                        break;
                    }
                }
            }
        });
    }
}