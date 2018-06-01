var INVALID_STATICS = ['name', '__proto__', 'arguments', 'call', 'apply', 'caller', 'length', 'prototype'];

function AFObject(){};

function analysisParam(options){
    options = options || {};
    var params = {
        ctor: function(){},
        name: "AFClass",
        base: AFObject,
        statics: {},
        properties: {},
        mixins: [],
    };
    options.ctor && (params.ctor = options.ctor,delete options.ctor);
    options.name && (params.name = options.name,delete options.name);
    options.extends && (params.base = options.extends,delete options.extends);
    options.statics && (params.statics = options.statics,delete options.statics);
    options.properties && (params.properties = options.properties,delete options.properties);
    options.mixins && (params.mixins = options.mixins,delete options.mixins);
    return params;
}

function doDefine(name, base, ctor){
    try{
        var body = "";
        body += "return function " + name + "(){\n";
        body += "base.call(this);\n";
        body += "ctor.apply(this, arguments);\n";
        body += "};";
        return Function("base", "ctor", body)(base, ctor);
    }catch(ex){
        var AFClass = function(){
            base.call(this);
            ctor.apply(this, arguments);
        };
        return AFClass;
    }
};

function beget(obj){  
    var Func = function(){};
    Func.prototype = obj;
    return new Func();
}

function doDefineProp(content, name, value){
    Object.defineProperty(content, name, {
        configurable: true,
        writable: true,
        enumerable: true,
        value: value
    });
}

function getPropDescriptor(obj, name) {
    while (obj) {
        var pd = Object.getOwnPropertyDescriptor(obj, name);
        if (pd) {
            return pd;
        }
        obj = Object.getPrototypeOf(obj);
    }
    return null;
}

function mixinInherited (dest, src, filter) {
    for (var prop in src) {
        if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
            Object.defineProperty(dest, prop, getPropDescriptor(src, prop));
        }
    }
}

var AFClass = function(options){
    var params = analysisParam(options);
    var sub = doDefine(params.name, params.base, params.ctor);
    var proto = beget(params.base.prototype);
    proto.constructor = sub;         
    sub.prototype = proto;
    for(var idx in options) {
        sub.prototype[idx] = options[idx];
    }
    for(var idx in params.base) {
        sub[idx] = params.base[idx];
    }
    for(var idx in params.statics) {
        sub[idx] = params.statics[idx];
    }
    var prototype = sub.prototype;
    var properties = params.properties;
    for(var property in properties){
        doDefineProp(prototype, property, properties[property]);
    }
    var mixins = params.mixins;
    if (mixins) {
        for (var m = mixins.length - 1; m >= 0; m--) {
            var mixin = mixins[m];
            mixinInherited(prototype, mixin.prototype);
            mixinInherited(sub, mixin, function (prop) { return mixin.hasOwnProperty(prop) && INVALID_STATICS_DEV.indexOf(prop) < 0;});
        }
        prototype.constructor = sub;
    }
    return sub;
}

module.exports = AFClass;