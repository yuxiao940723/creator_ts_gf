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
            },
        };
        gfCore.bindNode(this.node, data);
        this.scheduleOnce(()=>{
            data.test.node.x = cc.winSize.width/2-50;
            data.test.label = 'yes';
        }, 3);
    }

    // update (dt) {}
}