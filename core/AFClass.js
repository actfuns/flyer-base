function AFObject(){};

function analysisParam(options){
    options = options || {};
    var params = {
        ctor: function(){},
        name: "AFObject",
        base: AFObject,
        statics: {}
    };
    options.ctor && (params.ctor = options.ctor,delete options.ctor);
    options.name && (params.name = options.name,delete options.name);
    options.extends && (params.base = options.extends,delete options.extends);
    options.statics && (params.statics = options.statics,delete options.statics);
    return params;
}

function doDefine(name, base, ctor){
    var body = "";
    body += "return function " + name + "(){\n";
    body += "base.call(this);\n";
    body += "ctor.apply(this, arguments);\n";
    body += "};";
    return Function("base", "ctor", body)(base, ctor);
};

function beget(obj){  
    var Func = function(){};
    Func.prototype = obj;
    return new Func();
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
    return sub;
}

module.exports = AFClass;