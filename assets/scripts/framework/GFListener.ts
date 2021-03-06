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


let KeyId = 0;

@ccclass
export default class GFListener extends cc.Component {

    key:string = "";

    getBindDataKey() {
        if (!this.key) {
            this.key = '__bindData__' + KeyId.toString();
            KeyId ++;
        }
        return this.key;
    }

    onDestroy() {
        this.removeAllListen();
    }

    removeAllListen() {
        let bindDataKey = this.getBindDataKey(); 
        if (this.node[bindDataKey]) {
            this.removeListen(this.node[bindDataKey]);
            this.node[bindDataKey] = null;
        }
        let components:cc.Component[] = this.node._components;
        for (let i = 0, len = components.length; i < len; ++i) {
            if (components[bindDataKey]) {
                this.removeListen(components[bindDataKey]);
                components[bindDataKey] = null;
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
        console.log("add listen", value);
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
                } else if (typeof value[name] === 'function') {
                    this.node.on(name, value[name], value);
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
            if (typeof value[name] === 'function') {
                this.node.off(name, value[name], value);
            } else {
                prop[name] = {
                    value:value[name],
                    writable:true
                }
            }
        }
        Object.defineProperties(value, prop);
    }

    listenLabel(node:cc.Node, bindData:GFData) {
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
            comp[this.getBindDataKey()] = data;
            this.addListenAll(comp, data);
        }
    }

    listenSelfData(bindData:GFData) {
        if (bindData) {
            let bindDataKey = this.getBindDataKey();
            let oldData = this.node[bindDataKey];
            if (oldData != bindData) {
                this.removeAllListen();
            }
            let selfData = bindData.node;
            if (selfData && typeof selfData === 'object') {
                this.node[bindDataKey] = selfData;
                this.addListenAll(this.node, selfData);
            }
            this.dealComponentBit(this.node, bindData);
            let custom = bindData.custom;
            if (custom && typeof custom === 'object') {
                for (const comp in custom) {
                    let d = custom[comp];
                    let component = this.node.getComponent(comp);
                    if (!component)
                        continue;
                    component[bindDataKey] = d;
                    this.addListenAll(d, component);
                }
            }
        }
    }

}
