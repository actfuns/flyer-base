var eventsApi = function(iteratee, events, name, callback, opts) {
    if(typeof name === 'string'){
        name.replace(/\W*(\w*)\W*/g, function($0, $1){
            $1 && (events = iteratee(events, $1, callback, opts));
        });
    }
    return events;
};

var onApi = function(events, name, callback, options) {
    if (callback) {
        var handlers = events[name] || (events[name] = []);
        var context = options.context, ctx = options.ctx, listening = options.listening;
        if (listening) listening.count++;

        handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});
    }
    return events;
};

var internalOn = function(obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
    });

    if (listening) {
      var listeners = obj._listeners || (obj._listeners = {});
      listeners[listening.id] = listening;
    }
    return obj;
};

var triggerApi = function(objEvents, name, callback, args) {
    var events = objEvents ? objEvents[name] : null;
    if (events) {
        var i = -1, l = events.length;
        while(++i < l){
            var ev = events[i];
            ev.callback.apply(ev.ctx, args);
        }
    }
    return objEvents;
};

/**
 * 事件
 */
var AFEvent = af.Class({
    /**
     * 类名
     */
    name: "AFEvent",
    
    /**
     * 注册监听
     */
    on: function(name, callback, context) {
        return internalOn(this, name, callback, context);
    },

    /**
     * 注册监听(一次)
     */
    once : function(name, callback, context) {
        var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
        if (typeof name === 'string' && context == null) callback = void 0;
        return this.on(events, callback, context);
    },

    /**
     * 删除监听
     */
    off: function(name, callback, context) {
        if (!this._events) return this;
        this._events = eventsApi(offApi, this._events, name, callback, {
            context: context,
            listeners: this._listeners
        });
        return this;
    },

    /**
     * 分发事件
     */
    emit: function(name){
        if (!this._events) return this;
  
        var length = Math.max(0, arguments.length - 1);
        var args = Array(length);
        for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
    
        eventsApi(triggerApi, this._events, name, void 0, args);
        return this;
    },

    /**
     * 移除目标上的所有监听
     */
    targetOff: function(context){
        return this.off(null, null, context);
    },
});

module.exports = AFEvent;
