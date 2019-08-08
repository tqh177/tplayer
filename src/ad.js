export default class Ad {

    /**
     * @param {Tplayer} player
     */
    constructor (player) {
        this.ele = document.querySelector(`#${player.id} .tplayer-ad`);
        this._customer_listen(player);
    }

    /** @param {Tplayer} player*/
    _customer_listen (player) {
        const ele = this.ele;
        let adShowing = false;
        player.event.on('showAd',

            /**
         * @param {Tplayer.Ad} ad
         */
            function (ad) {
                if (!adShowing) {
                    adShowing = true;
                    ad.width = ad.width || 100;
                    ad.height = ad.height || 100;
                    ad.target = ad.target || '_blank';
                    ele.style.width = `${ad.width}px`;
                    ele.style.height = `${ad.height}px`;
                    ele.style.marginLeft = `-${ad.width / 2}px`;
                    ele.style.marginTop = `-${ad.height / 2}px`;
                    const adhtml = `<div style="width:100%;height:100%;position:relative;"><a href="${ad.href}" target="${ad.target}"><img alt="${ad.alt}" src="${ad.image}" style="width:100%;height:100%;"/></a><div style="position:absolute;right:0;top:0;width:1em;height:1em;color:red;cursor:pointer;" onclick="this.parentElement.remove()">&times;</div></div>`;
                    ele.innerHTML = adhtml;
                    ele.onclick = function (e) {
                        if (e.target !== this) {
                            e.stopPropagation();
                        }
                    };
                    ele.style.display = 'block';
                }
            }).on('hiddenAd', function () {
            if (adShowing) {
                ele.innerHTML = '';
                adShowing = false;
                ele.onclick = null;
                ele.style.display = 'none';
            }
        });
    }
}