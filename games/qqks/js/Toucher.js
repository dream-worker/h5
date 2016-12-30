/**
 * 屏幕界面区域绑定处理事件
 */
function Toucher(){
    this.speed=256;
    this.isHandMoving=false;
    this.touchTimer=null;
};
/**
 * 事件处理
 * @param eventType 执行操作
 * @param element 绑定的元素
 * @param eType  事件类型
 * @param handle 事件处理函数
 * @param bol 是否冒泡上浮
 */
Toucher.prototype.eventHandle=function(eventType,element, eType, handle, bol){
    var eventHandle={
        add:function(element, eType, handle, bol) {
            if(element.addEventListener){
                element.addEventListener(eType, handle, bol);
            }else if(element.attachEvent){
                element.attachEvent("on"+eType, handle);
            }else{
                element["on"+eType] = handle;
            }
        },
        remove:function(element, eType, handle, bol) {
            if(element.addEventListener){
                element.removeEventListener(eType, handle, bol);
            }else if(element.attachEvent){
                element.detachEvent("on"+eType, handle);
            }else{
                element["on"+eType] = null;
            }
        }
    };
    eventHandle[eventType](element, eType, handle, bol);
};

//点击一次屏幕，添加一个定时器，在限定时间内可以执行一次抓钱操作
Toucher.prototype.addTriger=function(){
    var _self=this;
    _self.isHandMoving=true;
    clearTimeout(_self.touchTimer);
    _self.touchTimer=setTimeout(function(){
        _self.isHandMoving=false;
    },1000);
};

//解绑事件
// if(!_self.isEnabled){
//     //中途由于碰到锤子，被迫停止
//     // alert("sorry,你还没有权限通往第"+number+"关");
//
// }

//检测碰撞
Toucher.prototype.checkCollisions=function(){
    // console.info("检测碰撞");
    var _self=this;
    var game=application.game;
    var hammerRect=game.hammer.rect;
    var moneyRect=game.money.rect;
    var handRect=game.hand.rect;

    //锤子和手
    var flagA=_self.boxCollides(
        [hammerRect.x,hammerRect.y],
        [hammerRect.width,hammerRect.height],
        [handRect.x,handRect.y],
        [handRect.width,handRect.height]
    );
    // console.log(flagA);

    //手和钱
    var flagB=_self.boxCollides(
        [handRect.x,handRect.y],
        [handRect.width,handRect.height],
        [moneyRect.x,moneyRect.y],
        [moneyRect.width,moneyRect.height]
    );
    // console.log(flagB);
    var progress={'-1':'back','1':'one','2':'two','3':'three','4':'four'};
    //如果有金手套
    if(game.hand.hasGoldenHand){
        if(flagB){
            game.txt.setMoneyValue(game.txt.getMoneyValue()+100);
            application.game.hand.handAction='shrink';
            console.log(game.txt.getMoneyValue());
        }
    }else if(!game.hand.hasGoldenHand&&!application.game.toucher.isHandMoving){
        //没金手套&&无论有没有碰到钱&&碰到锤子
        if(flagA){
            game.isRunning=false;
        }

        //没金手套&&碰到钱&&没碰到锤子
        if(flagA&&flagB){
            console.log("抢到钱咯");
            application.game.hand.handAction='shrink'
        }
    }

    var progress={'-1':'back','1':'one','2':'two','3':'three','4':'four'};
    var nowValue=game.txt.getMoneyValue();
    var totalValue=game.txt.gate[progress[game.gameNumber]].moneyCounter.total.value;
    //如果抢到的金额大于通关值，那么显示成功弹层
    if(nowValue>totalValue||nowValue==totalValue){
        game.isRunning=false;
    }
};

//返回两个物体的边界
Toucher.prototype.boxCollides=function(pos, size, pos2, size2) {
    return this.collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
};

//判断是否碰撞
Toucher.prototype.collides=function(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
    b <= y2 || y > b2);
};
