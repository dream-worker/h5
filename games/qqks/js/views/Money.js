/*钱*/
function Money(){
    this.fallMoney={
        speed:256,// 每秒移动的像素
        step:0,
        first:'money-first',
        second:'money-second',
        third:'money-third',
        startX:130,
        startY:0
    };
    this.stackedMoney={

    };
}
/*下落*/
Money.prototype.fall=function(moneyObj,name){
    var _self = this;
    var myImage = util.$$(name);
    var x = moneyObj.startX;
    var y = moneyObj.startY+moneyObj.step*180;
    var width = Math.round(myImage.width * appConfig.prop);
    var height = Math.round(myImage.height * appConfig.prop);

    application.context.drawImage(myImage, x, y, width, height);
    moneyObj.step++;
    if(moneyObj.step>4){
        moneyObj.step=0;
    }

};

Money.prototype.moving=function(modifier){

};
/*堆叠*/
Money.prototype.stack=function(){

};

