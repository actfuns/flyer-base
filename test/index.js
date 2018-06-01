var atfuns = require("../index");
global.af = atfuns;

var TestA = af.Model({
    name: 'TestA',
    ctor: function(){
        this.a =  10;
    },
    properties:{
        a: 10,
    }
});

var a = {b: 999};

var conn = new af.Connector();
conn.on("test", function(a, b, c){
    console.log("123  ---test---- 123123", a, this.b, c);
}, a);

conn.on("test", function(a, b, c){
    console.log("123  ---test2--- 123123", a, b, c);
});

conn.emit("acb,test", 1, 2, 3);

console.log(conn);

var a = new TestA();
a.a = 100;