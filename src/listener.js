export default class ListenEvent {

    /**
     * @param {Element} element
     * @param {string} id
     */
    constructor (element, id) {
        this._element = element;
        this._id = id;
    }

    /**
     * @param {keyof HTMLElementEventMap} type
     * @param {(this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener
     */
    on (type, listener, options = false) {
        const types = type.split(' ');
        types.forEach((t) => {
            if (t !== '') {
                this._element.addEventListener(t, listener, options);
                ListenEvent._listeners[this._id] = ListenEvent._listeners[this._id] || [];
                ListenEvent._listeners[this._id].push([this._element, type, listener]);
            }
        });
        return this;
    }

    /**
     * @param {Element} element
     * @param {string} id
     * @returns {ListenEvent}
     */
    static regist (element, id = ListenEvent._id) {
        return new ListenEvent(element, id);
    }

    /**
     * @param {Element} element
     * @param {keyof ElementEventMap} type
     * @param {(this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener
     */
    static remove (element, type, listener) {
        Element.prototype.removeEventListener.call(element, type, listener);
    }

    /**
     * @param {Element} element
     * @param {keyof ElementEventMap} type
     * @param {(this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener
     */
    static removeInId (id, element, type, listener) {
        const arr = [];
        ListenEvent._listeners[id].forEach(function (value) {
            const flag = arguments.length === 2 && value[0] === element
                || arguments.length === 3 && value[0] === element && value[1] === type
                || arguments.length === 4 && value[0] === element && value[1] === type && value[2] === listener;
            if (flag) {
                element.removeEventListener(type, listener);
            } else {
                arr.push(value);
            }
        });
        ListenEvent._listeners[id] = arr;
    }
    static removeAll (id = ListenEvent._id) {
        if (Array.isArray(ListenEvent._listeners[id])) {
            ListenEvent._listeners[id].forEach(function (value) {
                Element.prototype.removeEventListener.call(...value);
            });
            delete ListenEvent._listeners[id];
        }
    }
}

/** @type {{[x:string]:[]}} */
ListenEvent._listeners = {};
ListenEvent._id = 'window';