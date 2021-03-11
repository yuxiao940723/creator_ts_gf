import GFData from "./GFData";

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
export default class GFListener extends cc.Component {

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

    dealComponentBit(node:cc.Node, bindData:GFData) {
        
        let compBit = this.node._compBit;

        let dealBit = 1;

        while (dealBit < CompType.Finnal) {
            if (dealBit & compBit) {
                if (dealBit === CompType.Label) {
                    this.listenLabel(node, bindData);
                } else {
                    let key = CompType[dealBit];
                    let compName = dealBit === CompType.Spine ? 'sp.Skeleton' : `cc${key}`;
                    this.listenComponent(key, compName, node, bindData)
                }
            }
            dealBit = dealBit << 1;
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

    listenComponent(key:string, component:typeof cc.Component | String, node:cc.Node, bindData:GFData) {
        let data = bindData[key]
        if (data) {
            let comp = node.getComponent(component);
            comp[BindDataKey] = data;
            this.addListenAll(comp, data);
        }
    }

    listenSelfData(node:cc.Node, data:Object, onlySelf) {
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
                let comp = c.getComponent(GFListener);
                if (!comp) {
                    comp = c.addComponent(GFListener);
                }
                comp.listenSelfData(c, data, onlySelf);
            }
        }
    }

}
