import ShaderBase from "../../shaders/base/ShaderBase";
import GFBindData from "../framework/GFBindData";
import gfCore from "../framework/GFCore";
import { CompType } from "../framework/GFListener";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends GFBindData {


    @property(ShaderBase) shaderBase:ShaderBase = null;

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
        this.setBindData(data);
        let add = {
            label:'string'
        }
        this.addBindData('test', add);
        data.test.label = 'abc';
        this.scheduleOnce(()=>{
            data.test.label = 'yes';
        }, 3);
        cc.tween(data.test.node)
        .by(3, {x:-200})
        .start();

    }

    // update (dt) {}
}