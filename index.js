//初始化
var actFuns = {};
var Global = global ? global : window;
Global.af = actFuns;

//导出模块
actFuns.Class = require("./core/AFClass"); 
actFuns.Event = require("./core/AFEvent"); 
actFuns.Model = require("./core/AFModel"); 
actFuns.Connector = require("./core/AFConnector"); 

module.exports = actFuns;

