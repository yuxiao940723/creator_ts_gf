import { merge } from "./Func";
import GFData from "./GFData"
import GFListener from "./GFListener";

class GFCore  {

    data:Object = {}; 

    init() {
        
    }

    addCommonData(data) {
        merge(this.data, data);
    }

    destroyCommonData() {

    }

    /**
     * 绑定数据
     * @param node 绑定数据的节点
     * @param data 绑定的数据
     */
    bindData (node:cc.Node, data:Object) {
        let comp = node.getComponent(GFListener);
        if (!comp) {
            comp = node.addComponent(GFListener);
        }
        comp.listenSelfData(node, data, false);
    }

    /**
     * 刷新数据
     * @param node 刷新数据的节点
     * @param data 刷新的数据
     * @param onlySelf 是否只刷新自身字节，只刷新自身节点，不会传整个data，只需要传data里面节点的数据就可以了
     */
    refreshData(node:cc.Node, data:GFData, onlySelf:boolean) {
        let comp = node.getComponent(GFListener);
        if (!comp) {
            comp = node.addComponent(GFListener);
        }
        comp.listenSelfData(node, data, onlySelf);
    }

    unbindData(node:cc.Node) {
        let comp = node.getComponent(GFListener);
        comp && comp.destroy();
        if (node.childrenCount > 0) {
            for (let i = 0; i < node.childrenCount; ++i) {
                this.unbindData(node.children[i]);
            }
        }
    }

}

let gfCore = new GFCore();
export default gfCore;
