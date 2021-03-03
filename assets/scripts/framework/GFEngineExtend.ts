import { CompType } from "./GFCore";

function extendFunction(target, funName:string, cb:Function) {
    let func:Function = target[funName];
    target[funName] = function() {
        func.call(this, arguments)
        cb && cb.call(this);
    }
}

function extendComponent (comp:typeof cc.Component, compType:CompType) {
    extendFunction(comp.prototype, 'onEnable', function(){
        if (!this.node._compBit) {
            this.node._compBit = compType;
        } else {
            this.node._compBit |= compType;
        }
    });

    extendFunction(comp.prototype, 'onDisable', function(){
        this.node._compBit &= ~compType;
    });
}

function gfEngineExtend() {
    extendComponent(cc.Sprite, CompType.Sprite);
    extendComponent(cc.Label, CompType.Label);
    extendComponent(cc.Button, CompType.Button);
    extendComponent(cc.Toggle, CompType.Toggle);
    extendComponent(cc.Mask, CompType.Mask);
    extendComponent(cc.ParticleSystem, CompType.ParticleSystem);
    extendComponent(sp.Skeleton, CompType.Spine);
    extendComponent(cc.RichText, CompType.RichText);
    extendComponent(cc.EditBox, CompType.EditBox);
    extendComponent(cc.ScrollView, CompType.ScrollView);
    extendComponent(cc.PageView, CompType.PageView);
    extendComponent(cc.Layout, CompType.Layout);
    extendComponent(cc.Widget, CompType.Widget);
    extendComponent(cc.Animation, CompType.Animation);
    extendComponent(cc.Camera, CompType.Camera);
    extendComponent(cc.RigidBody, CompType.RigidBody);
}

cc.game.on(cc.game.EVENT_ENGINE_INITED, gfEngineExtend);

