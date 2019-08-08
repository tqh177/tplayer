export default class playerEvent {
    constructor () {
        this.type = ['showplay', 'showpause', 'fullscreen', 'exitfullscreen', 'seeking', 'volumechange', 'showvolumechange', 'timeupdate', 'showController', 'hiddenController', 'contextmenu', 'toggle', 'durationchange', 'backward', 'fastforward', 'destroy', 'analysis', 'showLoading', 'hiddenLoading', 'showDanmaku', 'pauseDanmaku', 'showAd', 'hiddenAd'];
        this.listen = {};
    }

    /**
     * @param {keyof PlayerEventMap} type
     * @param {(e:any)=>void} callback
     * @param {number} times
     */
    on (type, callback, times = -1) {
        if (this.type.indexOf(type) !== -1) {
            this.listen[type] = this.listen[type] || [];
            [].push.call(this.listen[type], [callback, times]);
        }
        return this;
    }

    /**
     * @param {keyof PlayerEventMap} type
     * @param {(e:any)=>void} callback
     */
    one (type, callback) {
        return this.on(type, callback, 1);
    }

    /** @param {keyof PlayerEventMap} type*/
    off (type, callback = null) {
        if (type in this.listen) {
            if (callback === null) {
                delete this.listen[type];
            } else {
                const arr = [];
                [].forEach.call(this.listen[type], function (value) {
                    if (callback !== value[0]) {
                        arr.push(value);
                    }
                });
                if (arr.length === 0) {
                    delete this.listen[type];
                } else {
                    this.listen[type] = arr;
                }
            }
        } else {
            throw `undefined event: ${type}`;
        }
    }

    /** @param {keyof PlayerEventMap} type*/
    trigger (type, e = null) {
        const _this = this;
        if (this.listen[type]) {
            [].forEach.call(this.listen[type], function (value) {
                value[0](e);
                if (value[1] > 0) {
                    value[1]--;
                }
                if (value[1] === 0) {
                    _this.off(type, value[0]);
                }
            });
        } else {
            throw `undefined event: ${type}`;
        }
    }
}