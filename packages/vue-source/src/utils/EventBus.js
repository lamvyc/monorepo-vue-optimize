class EventBus {
    constructor() {
        this.events = {};
    }

    // 监听事件
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ callback, once: false });
        return this; // 支持链式调用
    }

    // 只监听一次
    once(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ callback, once: true });
        return this;
    }

    // 触发事件
    emit(event, ...args) {
        const eventList = this.events[event];
        if (!eventList || eventList.length === 0) return;

        // 遍历执行回调，并过滤掉 once 类型的
        const toKeep = [];
        for (const handler of eventList) {
            const { callback, once } = handler;
            callback.apply(null, args);
            if (!once) {
                toKeep.push(handler);
            }
        }

        this.events[event] = toKeep;
        return this;
    }

    // 移除某个事件的某个回调
    off(event, callback) {
        const eventList = this.events[event];
        if (!eventList) return;

        this.events[event] = eventList.filter(
            (handler) => handler.callback !== callback
        );
        return this;
    }

    // 移除某个事件的所有监听器
    offAll(event) {
        delete this.events[event];
        return this;
    }
}

const bus = new EventBus();

function greet(name) {
    console.log(`Hello, ${name}!`);
}

function farewell(name) {
    console.log(`Goodbye, ${name}!`);
}

bus.on('greet', greet);
bus.once('greetOnce', greet);
bus.on('farewell', farewell);

bus.emit('greet', 'Alice'); // Hello, Alice!
bus.emit('greet', 'Bob');   // Hello, Bob!

bus.emit('greetOnce', 'Charlie'); // Hello, Charlie!（只触发一次）

bus.off('greet', greet);
bus.emit('greet', 'David'); // 不再输出

bus.offAll('farewell');
bus.emit('farewell', 'Eve'); // 不再输出