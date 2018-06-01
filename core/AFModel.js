var AFClass = require("./AFClass");
var AFEvent = require("./AFEvent");

function doDefineProp(content, name, value){
    var val = value;
    Object.defineProperty(content, name, {
        configurable: true,
        enumerable: true,
        get: function(){
            return val;
        },
        set: function(value){
            val = value;
            this._changeValue && this._changeValue();
        }
    });
}

var AFModel = function(options){
    var base = options.extends;
    var properties = options.properties;
    var mixins = options.mixins == null && (options.mixins = [], options.mixins);
    mixins.push(AFEvent);
    var afClass = AFClass(options);
    
    var prototype = afClass.prototype;
    doDefineProp(prototype, "_changeValue", function(){
        if(this._changeTimeout) return;
        this._changeTimeout = setTimeout(function(){
            this._changeTimeout = null;
            this.emit("change");
        }.bind(this), 0);
    });
    if(properties){
        var prototype = afClass.prototype;
        for(var property in properties){
            doDefineProp(prototype, property, properties[property]);
        }
    }
    return afClass;
};

module.exports = AFModel;