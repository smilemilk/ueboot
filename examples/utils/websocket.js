/**
 * Created by yangkui on 17/4/7.
 */
/**
 * 导出一个默认的方法，实际上就是将这个方法整体导出
 * @returns {"default"}
 */
export default function (options) {

    this.createMethod =function(method, options, stateCallback){
        let that = this;
        this[method] = function () {
            if (stateCallback && stateCallback.apply) {
                stateCallback(method);
            }
            if (options[method] && options[method].apply) {
                options[method].apply(that, arguments);
            }
        };
    };

    let ws,
        events = ['onopen', 'onmessage', 'onclose', 'onerror'],
        i, len, prop = {
            opened: false,
            closed: false,
            error: false
        },
        method;

    if (typeof options === 'undefined' || !options) {
        throw 'ArgumentException: please add default constructor options';
    }

    this.queue = [];

    this.onEventTrigger = function (eventName) {
        let i, len;
        if (eventName === 'onopen') {
            prop.opened = true;
            prop.closed = false;
            // openend send queue
            if (this.queue.length > 0) {
                for (i = this.queue.length; --i >= 0;) {
                    this.send.apply(this, this.queue[0]);
                    this.queue.splice(0, 1);
                }
            }
        }
        if (eventName === 'onerror') {
            prop.error = true;
        }
        if (eventName === 'onclosed') {
            prop.opened = false;
            prop.closed = true;
        }
    };

    this.init = function () {
        let cb = this.onEventTrigger.bind(this);
        ws = new WebSocket(options.url);

        for (i = 0; i < events.length; i++) {
            method = events[i];
            this.createMethod.apply(ws, [method, options, cb]);
        }
    };

    this.send = function () {
        if (prop.closed) {
            // throw 'InvalidOperation: Cannot send messages to a closed Websocket!';
            console.log("连接已经关闭，尝试重新打开!");
            alert("当前登录会话已经丢失，请重新刷新尝试连接！");
        }
        if (!prop.opened) {
            this.queue.push(arguments);
        } else {
            ws.send.apply(ws, arguments);
        }
    };

    this.init();
    return this;
}