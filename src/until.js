export function parseTime (time) {
    const h = Math.floor(time / 3600);
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    if (h === 0) {
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    } else {
        return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }
}
export function noFullElement () {
    const flag = document.fullscreenElement === null
        || document.msFullscreenElement === null
        || document.webkitFullscreenElement === null;
    return flag;
}