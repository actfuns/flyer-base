var SeedRandom = function(seed){
    this.seed = seed || new Date().getTime();
};

SeedRandom.prototype = {
    /**
     * 随机小数
     */
    rand: function(){
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return parseFloat((this.seed / 233280.0).toFixed(8));
    },

    /**
     * 随机整数
     */
    randInt: function(min, max){
        return min + Math.floor((max - min) * this.rand());
    },
}

//导出随机数
module.exports = SeedRandom;