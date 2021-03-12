import gfCore from "./GFCore";
import GFData from "./GFData";

export default class GFBindData extends cc.Component {

    data:Object = {};

    /**
     * 设置绑定数据。数据为 Object<string, GFData> 格式。string为节点名，GFData为节点绑定的数据
     * 绑定数据在不需要后应调用deleteBindData方法移除。一般在onDestroy方法中移除。
     * @param data 
     */
    setBindData(data) {
        data = data || {};
        if (this.data) {
            gfCore.unbindData(this.node);
        }
        this.data = data; 
        gfCore.bindData(this.node, this.data);
    }

    /**
     * 销毁绑定的数据。
     */
    deleteBindData() {
        gfCore.unbindData(this.node);
        this.data = {};
    }

    /**
     * 添加绑定数据。如果原本该节点上存在绑定数据，则覆盖。
     * @param path 节点路径。默认为自身节点
     * @param bindData 绑定数据
     * @returns 是否绑定成功
     */
    addBindData(path:string, bindData:GFData) {
        if (typeof bindData !== 'object') {
            return false;
        }
        let node = path ? cc.find(path, this.node) : this.node;
        if (!node) {
            cc.error('can not find path :', path);
            return false;
        }
        this.data[node.name] = bindData;
        gfCore.refreshData(node, bindData, true);
        return true;
    }

    /**
     * 删除绑定数据
     * @param path 节点路径。默认为自身节点
     * @returns 是否删除成功
     */
    removeBindData(path:string) {
        let node = path ? cc.find(path, this.node) : this.node;
        if (!node) {
            cc.error('can not find path :', path);
            return false;
        }
        gfCore.unbindData(node, true);
        delete this.data[node.name];
        return true;
    }

    /**
     * 子类重新此方法，需要调用super.onDestroy();s
     */
    onDestroy() {
        this.deleteBindData();
    }
}


