import GFBindData from "../framework/GFBindData";
import TaskDispatcher from "../framework/TaskDispatcher";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends GFBindData {

    // @property a = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    //折纸片（纸片折好，然后画图，然后展开，将图放在旁边，让玩家根据画好的图折出来）
    //按顺序亮灯，然后让玩家重复
    //写字过河

    start () {
        console.log("start");
        this.test();
    }

    async test() {
    //     for (let i = 0; i < 100000; ++i) {
    //         TaskDispatcher.dispatch(()=>{
    //             console.log(cc.director.getTotalFrames());
    //             return i+i;
    //         });
    //    }
    }

    // update() {
    //     cc.log(this.data.test.node.x);
    // }

    // update (dt) {}
}