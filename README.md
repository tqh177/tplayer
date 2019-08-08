# tplayer
## 功能
1. web端播放视频  
2. 支持MP4,flv,m3u8视频播放  
3. 可扩展其他类型视频播放  
4. 支持弹幕显示  
5. 支持暂停广告  
## API
``` typescript
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
```
## 播放器配置说明
``` typescript
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
        // 广告跳转方式 参考a标签属性target
        target?: string;
    }
}
```
详见[ts文件](./typings/index.d.ts)  
示例见[./index.html](./index.html)  
## 如何打包
```shell
npm install
npm run build
```