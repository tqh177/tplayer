export default class Config {
    constructor () {
        throw 'private constructor';
    }

    /**
     * 处理配置
     * @param {Tplayer.Config} config
     * @returns {Tplayer.Config}
     */
    static parse (config) {
        return Config._join(Config._getDefault(), config);
    }

    /**
     * 处理配置
     * @param {Tplayer.Config} config
     */
    static parse1 (config) {
        let c = Config._getDefault();
        c = Config._join(c, config);
        return {
            video: {
                url: c.url,
                segments: c.segments,
                poster: c.poster,
                autoplay: c.autoplay,
                type: c.type,
                extend: c.extend,
                volume: c.volume,
                loop: c.loop,
            },
            menu: c.menu,
            container: {
                containerID: c.containerID
            },
            danmaku: c.danmaku
        };
    }
    static _join (source, dest) {
        for (const key in dest) {
            if (Array.isArray(source[key])) {
                source[key] = [].concat(source[key], dest[key]);
            } else if (typeof source[key] === 'object') {
                source[key] = Config._join(source[key], dest[key]);
            } else {
                source[key] = dest[key];
            }
        }
        return source;
    }

    /**
     * @returns {Tplayer.Config}
     */
    static _getDefault () {
        return {
            url: undefined,
            segments: undefined,
            poster: '',
            autoplay: true,
            type: 'mp4',
            volume: 0.8,
            loop: false,
            backward: 5, // 快退5秒
            fastforward: 5, // 快进5秒
            extend: {},
            containerID: '#all',
            menu: [{
                /* global __VERSION__ */
                title: `version:${__VERSION__}`,
                style: 'text'
            }],
            function: undefined,
            danmaku: [],
            showDanmaku: false,
            ad: null,
            showAd: false
        };
    }
}