var AFClass = require("./AFClass");

/**
 * 事件
 */
var AFEvent = AFClass({
    /**
     * 事件
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
        console.log("emit");

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
