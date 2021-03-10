
const { ccclass } = cc._decorator;

let FlagOfset = 0;

export enum CompType {
    None = 0,
    Sprite = 1 << FlagOfset++,
    Label = 1 << FlagOfset++,
    Button = 1 << FlagOfset++,
    Toggle = 1 << FlagOfset++,
    Mask = 1 << FlagOfset++,
    ParticleSystem = 1 << FlagOfset++,
    Spine = 1 << FlagOfset++,
    RichText = 1 << FlagOfset++,
    EditBox = 1 << FlagOfset++,
    ScrollView = 1 << FlagOfset++,
    PageView = 1 << FlagOfset++,
    Layout = 1 << FlagOfset++,
    Widget = 1 << FlagOfset++,
    Animation = 1 << FlagOfset++,
    Camera = 1 << FlagOfset++,
    RigidBody = 1 << FlagOfset++,
    Finnal = 1 << FlagOfset++,
}

const BindDataKey = '__bindData__';

@ccclass
class GFListenComponent extends cc.Component {

    onDestroy() {
        if (this.node[BindDataKey]) {
            this.node[BindDataKey] = null;
        }
        let components:cc.Component[] = this.node._components;
        for (let i = 0, len = components.length; i < len; ++i) {
            if (components[BindDataKey]) {
                components[BindDataKey] = null;
            }
        }
    }

    dealComponentBit(node:cc.Node, bindData) {
        
        let bit = this.node._compBit;

        if (bit | CompType.Sprite) {
            this.listenComponent('sprite', cc.Sprite, node, bindData)
        }

        if (bit | CompType.Label) {
            this.listenLabel(node, bindData);
        }

        if (bit | CompType.Button) {
            this.listenComponent('button', cc.Button, node, bindData)
        }

        if (bit | CompType.Toggle) {
            this.listenComponent('toggle', cc.Toggle, node, bindData)
        }

        if (bit | CompType.Mask) {
            this.listenComponent('mask', cc.Mask, node, bindData)
        }

        if (bit | CompType.ParticleSystem) {
            this.listenComponent('particleSystem', cc.ParticleSystem, node, bindData)
        }

        if (bit | CompType.Spine) {
            this.listenComponent('spine', sp.Skeleton, node, bindData)
        }

        if (bit | CompType.RichText) {
            this.listenComponent('richText', cc.RichText, node, bindData)
        }

        if (bit | CompType.EditBox) {
            this.listenComponent('editBox', cc.EditBox, node, bindData)
        }

        if (bit | CompType.ScrollView) {
            this.listenComponent('scrollView', cc.ScrollView, node, bindData)
        }

        if (bit | CompType.PageView) {
            this.listenComponent('pageView', cc.PageView, node, bindData)
        }

        if (bit | CompType.Layout) {
            this.listenComponent('layout', cc.Layout, node, bindData)
        }

        if (bit | CompType.Widget) {
            this.listenComponent('widget', cc.Widget, node, bindData)
        }

        if (bit | CompType.Animation) {
            this.listenComponent('animation', cc.Animation, node, bindData)
        }

        if (bit | CompType.Camera) {
            this.listenComponent('camera', cc.Camera, node, bindData)
        }

        if (bit | CompType.RigidBody) {
            this.listenComponent('rigidBody', cc.RigidBody, node, bindData)
        }

    }

    addListenAll(target:cc.Node|cc.Component, value, sets?:{}, gets?:{}) {
        let node:cc.Node = target["node"] || target;
        let prop = {};
        sets = sets || {};
        gets = gets || {};
        for (const name in value) {
            if (name in target) {
                if (typeof target[name] !== 'function') {
                    prop[name] = {
                        get:sets[name] || function() {
                            return target[name];
                        },
                        set:gets[name] || function(v) {
                            target[name] = v;
                        }
                    }
                    target[name] = value[name];
                } else {
                    node.on(name, target[name], target);
                }
            }
        }
        Object.defineProperties(value, prop);
    }

    addListenProp(o:{target:Object, name:string, set?:Function, get?:Function, value:Object, valueName?:string}) {
        let target = o.target;
        let name = o.name;
        let value = o.value;
        let set = o.set;
        let get = o.get;
        let valueName = o.valueName || name;
        if (!(name in target )) {
            return ;
        }
        let prop = {};
        prop[valueName] = {
            get:get || function() {
                return target[name];
            },
            set:set || function (v) {
                target[name] = v;
            }
        }
        target[name] = value[valueName];
        Object.defineProperties(value, prop);
    }

    removeListen(value) {
        let prop = {};
        for (const name in value) {
            prop[name] = {
                value:value[name],
                writable:true
            }
        }
        Object.defineProperties(value, prop);
    }

    listenLabel(node:cc.Node, bindData) {
        let labelData = bindData['label'];
        if (labelData) {
            let label = node.getComponent(cc.Label);
            let type = typeof labelData;
            if (type === 'string') {
                this.addListenProp({target:label, name:'string', value:bindData, valueName:'label'});
            } else if (type === 'object') {
                this.addListenAll(label, labelData);
            } else {
                console.error(`unsupport type of ${type} in label`);
            }
        }
    }

    listenComponent(key:string, component:typeof cc.Component, node:cc.Node, bindData) {
        let data = bindData[key]
        if (data) {
            let comp = node.getComponent(component);
            comp[BindDataKey] = data;
            this.addListenAll(comp, data);
        }
    }

    listenSelfData(node:cc.Node, data, onlySelf) {
        console.log('listenSelfData', this.node.name, node._compBit, CompType.Widget, CompType.Camera);
        let bindData = onlySelf ? data : data[node.name];
        if (bindData) {
            let selfData = bindData.node;
            if (selfData && typeof selfData === 'object') {
                node[BindDataKey] = selfData;
                this.addListenAll(node, selfData);
            }
            this.dealComponentBit(node, bindData);
            let custom = bindData.custom;
            if (custom && typeof custom === 'object') {
                for (const comp in custom) {
                    let d = custom[comp];
                    let component = node.getComponent(comp);
                    if (!component)
                        continue;
                    component[BindDataKey] = d;
                    this.addListenAll(d, component);
                }
            }
        }
        if (!onlySelf) {
            let children = node.children;
            for (let i = 0, l = children.length; i < l; i++) {
                let c = children[i];
                let comp = c.getComponent(GFListenComponent);
                if (!comp) {
                    comp = c.addComponent(GFListenComponent);
                }
                comp.listenSelfData(c, data, onlySelf);
            }
        }
    }

}


class GFCore  {

    static CompType = CompType;

    init() {
        
    }

    addCommonData() {

    }

    /**
     * 绑定数据
     * @param node 绑定数据的节点
     * @param data 绑定的数据
     */
    bindData (node:cc.Node, data:Object) {
        let comp = node.getComponent(GFListenComponent);
        if (!comp) {
            comp = node.addComponent(GFListenComponent);
        }
        comp.listenSelfData(node, data, false);
    }

    /**
     * 刷新数据
     * @param node 刷新数据的节点
     * @param data 刷新的数据
     * @param onlySelf 是否只刷新自身字节，只刷新自身节点，不会传整个data，只需要传data里面节点的数据就可以了
     */
    refreshData(node:cc.Node, data:Object, onlySelf:boolean) {
        let comp = node.getComponent(GFListenComponent);
        if (!comp) {
            comp = node.addComponent(GFListenComponent);
        }
        comp.listenSelfData(node, data, onlySelf);
    }

}

let gfCore = new GFCore();
export default gfCore;
