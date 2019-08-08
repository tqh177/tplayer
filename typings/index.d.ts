/// <reference path="./flv.d.ts" />

declare const __VERSION__ = '1.0';
declare namespace Tplayer {
    interface VideoConfig {
        // 视频播放地址
        url: string;
        // flv分段视频播放地址
        segments?: FlvJs.MediaSegment[];
        // 视频封面
        poster: string;
        // 自动播放
        autoplay: boolean;
        // 播放类型
        type: "mp4" | "flv" | "m3u8" | "other";
        // 初始音量
        volume?: number;
        // 是否循环播放
        loop: false;
        // 扩展配置（当调用外部解码脚本时，如flv.js，播放时需用到）
        extend?: {
            MediaDataSource?: FlvJs.MediaDataSource;
            config?: keyof FlvJs.Config;
        }
    }
    interface MenuConfig {
        // 菜单标题
        title: string;
        // 菜单样式
        style: "link" | "text";
        // 当link时有效，跳转链接
        link?: string;
        // a标签的target
        target?: string;
    }
    interface ContainerConfig {
        // 播放器容器ID,不加#号
        containerID: string;
        // 是否显示弹幕
        showDanmaku: boolean;
        // 是否暂停时显示广告
        showAd: boolean;
    }
    interface Config extends VideoConfig, ContainerConfig {
        /* 扩展播放接口*/
        function: (this: Tplayer, video: HTMLVideoElement) => void;
        // 菜单
        menu: MenuConfig[];
        // 弹幕数组，不建议直接在配置中配置弹幕,请使用player.addDanmaku
        danmaku: Danmaku[];
        // 暂停时的广告，只能一个，不建议直接在配置中配置广告，请使用player.addAd
        ad: Ad;
    }
    interface Danmaku {
        // 弹幕top大小
        position: number;
        // 弹幕开始显示的时间
        time: number;
        // 弹幕文字
        text: string;
        // 弹幕显示的时间 默认5秒
        speed?: number;
        // 弹幕的颜色 默认#ffffff
        color?: string;
        // 弹幕字体 参考CSS font
        font?: string;
        // 弹幕类型 0:滚动 1:居中
        type?: number;
    }
    interface Ad {
        // 广告点击跳转链接
        href: string;
        // 广告图片
        image: string;
        // 图片不显示时显示的文字
        alt: string;
        // 广告宽度
        width?: number;
        // 广告高度
        height?: number;
        // 广告跳转方式 参考a target
        target?: string;
    }
}
// 各种事件
declare interface PlayerEventMap {
    "showplay": Event;
    "showpause": Event;
    "fullscreen": Event;
    "exitfullscreen": Event;
    "seeking": Event;
    "volumechange": Event;
    "showvolumechange": Event;
    "timeupdate": Event;
    "showController": Event;
    "hiddenController": Event;
    "contextmenu": Event;
    "toggle": Event;
    "durationchange": Event;
    "backward": Event;
    "fastforward": Event;
    "destroy": Event;
    "analysis": Event;
    "showLoading": Event;
    "hiddenLoading": Event;
    "showDanmaku": Event;
    "pauseDanmaku": Event;
    "showAd": Event;
    "hiddenAd": Event;
}
// 播放器事件监听及触发函数
declare class PlayerEvent {
    on(type: keyof PlayerEventMap, callback: (e: any) => void, times?: number): PlayerEvent;
    one(type: keyof PlayerEventMap, callback: (e: any) => void): PlayerEvent;
    off(type: keyof PlayerEventMap, callback: (e: any) => void): void;
    trigger(type: keyof PlayerEventMap, e: any): void;
}
declare class Tplayer {
    static version: string;
    id: string;
    containerFocus: boolean;
    config: Tplayer.Config;
    // 事件
    event: PlayerEvent;
    readonly currentTime: number;
    readonly duration: number;
    constructor(config: Tplayer.Config);
    play(): void;
    pause(): void;
    // 播放或暂停
    toggle(): void;
    // 销毁播放器
    destroy(): void;
    // 定位播放时间
    seek(time: number): void;
    // 全屏
    fullScreen(): void;
    // 退出全屏
    exitfullscreen(): void;
    // 创建新的视频
    newVideo(config: Tplayer.Config): Tplayer;
    // 添加弹幕库
    addDanmaku(danmaku: Tplayer.Danmaku): void;
    // 添加广告
    addAd(ad: Tplayer.Ad): void;
}