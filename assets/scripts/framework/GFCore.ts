
let FlagOfset = 0;

export enum CompType {
    None = 0,
    SelfNode = 1 << FlagOfset++,
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

class ListenerList {
    _func = null;
    _next:ListenerList = null; 

    doNothing() {}

    addListenAll(target, value, sets?:Function[], gets?:Function[]) {
        let prop = {};
        sets = sets || [];
        gets = gets || [];
        for (const name in value) {
            if (name in target) {
                prop[name] = {
                    get:sets[name] || function() {
                        return target[name];
                    },
                    set:gets[name] || function(v) {
                        target[name] = v;
                    }
                }
                target[name] = value[name];
            }
        }
        Object.defineProperties(value, prop);
    }

    addListenProp(o:{target:Object, name:string, set?:Function, get?:Function, value:Object, valueName?:string}) { // target, name:string, value, valueName:string, set?:Function, get?:Function

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

    listenSprite(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenLabel(node:cc.Node, bindData) {
        let labelData = bindData['label'];
        if (labelData) {
            let label = node.getComponent(cc.Label);
            if (typeof labelData === 'string') {
                this.addListenProp({target:label, name:'string', value:bindData, valueName:'label'});
            } else {
                this.addListenAll(label, labelData);
            }
        }
        this._next._func(node, bindData);
    }

    listenButton(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenToggle(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenMask(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenParticleSystem(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenSpine(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenRichText(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenEditBox(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenScrollView(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenPageView(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenLayout(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenWidget(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenAnimation(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenCamera(node:cc.Node, bindData) {
        this._next._func(node, bindData);
    }

    listenRigidBody(node:cc.Node, bindData) {
        this._next._func(node, bindData);
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
                getFuncList(c)._func(c, data);
            }
        }
        if (bindData) {
            this._next._func(node, bindData);
        }
    }
}

let EmptyListenerList = new ListenerList();
EmptyListenerList._func = EmptyListenerList.doNothing;
EmptyListenerList._next = EmptyListenerList;

function createFunc(flag, next) {
    let listener = new ListenerList();
    listener._next = next || EmptyListenerList;
    switch (flag) {
        case CompType.Sprite:
            listener._func = listener.listenSprite;
            break
        case CompType.Label:
            listener._func = listener.listenLabel;
            break
        case CompType.Button:
            listener._func = listener.listenButton;
            break
        case CompType.Toggle:
            listener._func = listener.listenToggle;
            break
        case CompType.Mask:
            listener._func = listener.listenMask;
            break
        case CompType.ParticleSystem:
            listener._func = listener.listenParticleSystem;
            break
        case CompType.Spine:
            listener._func = listener.listenSpine;
            break
        case CompType.RichText:
            listener._func = listener.listenRichText;
            break
        case CompType.EditBox:
            listener._func = listener.listenEditBox;
            break
        case CompType.ScrollView:
            listener._func = listener.listenScrollView;
            break
        case CompType.PageView:
            listener._func = listener.listenPageView;
            break
        case CompType.Layout:
            listener._func = listener.listenLayout;
            break
        case CompType.Widget:
            listener._func = listener.listenWidget;
            break
        case CompType.Animation:
            listener._func = listener.listenAnimation;
            break
        case CompType.Camera:
            listener._func = listener.listenCamera;
            break
        case CompType.RigidBody:
            listener._func = listener.listenRigidBody;
            break
        case CompType.None:
            listener._func = listener.doNothing;
            break
        case CompType.SelfNode:
            listener._func = listener.listenSelfData;
    }
    return listener;
}


function getFuncList(node) {
    let flag = node._compBit || CompType.None;
    flag |= CompType.SelfNode;
    let funcList = funcLists[flag];
    if (funcList) {
        return funcList;
    }
    console.log(node.name, flag);
    let nowFlag = CompType.Finnal;
    while (nowFlag > 0) {
        if (nowFlag & flag) {
            funcList = createFunc(nowFlag, funcList);
        }
        nowFlag = nowFlag >> 1;
    }
    return funcList;
}

let funcLists = {};

class GFCore  {

    static CompType = CompType;

    init() {
        funcLists[0] = EmptyListenerList;
    }

    addCommonData() {

    }

    bindNode (node:cc.Node, data:Object) {
        let list = getFuncList(node);
        list._func(node, data);
    }

    refreshNodeBind(node:cc.Node, data:Object, onlySelf:Boolean) {
        let list = getFuncList(node);
        list.listenSelfData(node, data, onlySelf);
    }

}

let gfCore = new GFCore();
export default gfCore;
