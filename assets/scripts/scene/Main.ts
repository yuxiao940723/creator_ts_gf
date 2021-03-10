import gfCore from "../framework/GFCore";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let data = {
            test: {
                node:{
                    x:0,
                    y:100,
                },
                label:"hhh",
                custom:{
                    Main:10,
                }
            },
        };
        gfCore.bindData(this.node, data);
        this.scheduleOnce(()=>{
            data.test.label = 'yes';
        }, 3);
        cc.tween(data.test.node)
        .by(3, {x:-200})
        .start();

        let o = {a:1};
        Object.defineProperties(o, {a:{set:function(v){console.log("set o.a", v);}}});
        console.log("o.a =", o.a);
        o.a = 2;
        console.log("o.a =", o.a);
        Object.defineProperties(o, {a:{value:o.a, writable:true}});
        o.a = 3;
        console.log("o.a =", o.a);
    }

    // update (dt) {}
}