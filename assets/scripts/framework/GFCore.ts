
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

@ccclass
class GFListenComponent extends cc.Component {

    onDestroy() {
        
    }

    dealComponentBit(node:cc.Node, bindData) {
        
        let bit = this.node._compBit;

        if (bit | CompType.Sprite) {
            this.listenSprite(node, bindData);
        }
        if (bit | CompType.Label) {
            this.listenLabel(node, bindData);
        }

        if (bit | CompType.Button) {
            this.listenButton(node, bindData);
        }

        if (bit | CompType.Toggle) {
            this.listenToggle(node, bindData);
        }

        if (bit | CompType.Mask) {
            this.listenMask(node, bindData);
        }

        if (bit | CompType.ParticleSystem) {
            this.listenParticleSystem(node, bindData);
        }

        if (bit | CompType.Spine) {
            this.listenSpine(node, bindData);
        }

        if (bit | CompType.RichText) {
            this.listenRichText(node, bindData);
        }

        if (bit | CompType.EditBox) {
            this.listenEditBox(node, bindData);
        }

        if (bit | CompType.ScrollView) {
            this.listenScrollView(node, bindData);
        }

        if (bit | CompType.PageView) {
            this.listenPageView(node, bindData);
        }

        if (bit | CompType.Layout) {
            this.listenLayout(node, bindData);
        }

        if (bit | CompType.Widget) {
            this.listenWidget(node, bindData);
        }

        if (bit | CompType.Animation) {
            this.listenAnimation(node, bindData);
        }

        if (bit | CompType.Camera) {
            this.listenCamera(node, bindData);
        }

        if (bit | CompType.RigidBody) {
            this.listenRigidBody(node, bindData);
        }

    }

    addListenAll(target, value, sets?:Function[], gets?:Function[]) {
        let node = target.node || target;
        let prop = {};
        sets = sets || [];
        gets = gets || [];
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
                    node.on();
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

    listenSprite(node:cc.Node, bindData) {
        let labelData = bindData['label'];
        if (labelData) {
            
        }
    }

    listenLabel(node:cc.Node, bindData) {
        let labelData = bindData['label'];
        if (labelData) {
            let label = node.getComponent(cc.Label);
            let type = typeof labelData;
            if (type === 'string') {
                this.addListenProp({target:label, name:'string', value:bindData, valueName:'label', set:(v)=>{
                    if (typeof v === 'object') {
                        if ('string' in v) {
                            this.removeListen(bindData);
                            bindData.label = v;
                            this.addListenAll(label, v);
                        } else {
                            console.error(`translate to object in label must contain string`);
                        }
                    } else if (type === 'string') {
                        label.string = v;
                    } else {
                        console.error(`unsupport type of ${type} in label`);
                    }
                }});
            } else if (type === 'object') {
                this.addListenAll(label, labelData);
            } else {
                console.error(`unsupport type of ${type} in label`);
            }
        }
        
    }

    listenButton(node:cc.Node, bindData) {
        
    }

    listenToggle(node:cc.Node, bindData) {
        
    }

    listenMask(node:cc.Node, bindData) {
        
    }

    listenParticleSystem(node:cc.Node, bindData) {
        
    }

    listenSpine(node:cc.Node, bindData) {
        
    }

    listenRichText(node:cc.Node, bindData) {
        
    }

    listenEditBox(node:cc.Node, bindData) {
       
    }

    listenScrollView(node:cc.Node, bindData) {
        
    }

    listenPageView(node:cc.Node, bindData) {
        
    }

    listenLayout(node:cc.Node, bindData) {
        
    }

    listenWidget(node:cc.Node, bindData) {
       
    }

    listenAnimation(node:cc.Node, bindData) {
        
    }

    listenCamera(node:cc.Node, bindData) {
       
    }

    listenRigidBody(node:cc.Node, bindData) {
        
    }

    listenSelfData(node:cc.Node, data, onlySelf) {
        let bindData = onlySelf ? data : data[node.name];
        if (bindData) {
            let custom = bindData.custom;
            if (custom && typeof custom === 'object') {
                for (const comp in custom) {
                    let component = node.getComponent(comp);
                    let d = custom[comp];
                }
            }
            let self = bindData.node;
            if (self && typeof self === 'object') {
                this.addListenAll(node, self);
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
        if (bindData) {
            
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
    bindNode (node:cc.Node, data:Object) {
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
