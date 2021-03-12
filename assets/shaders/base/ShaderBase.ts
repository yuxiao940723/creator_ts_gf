

const {ccclass, executeInEditMode} = cc._decorator;
import {monkeyPatching} from "../../scripts/framework/Func";

let StaticCamera:cc.Camera = null;

@ccclass
@executeInEditMode
export default class ShaderBase extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    material:cc.Material = null;

    renderComponent:cc.RenderComponent = null;
    originalUpdateMaterial:Function = null;

    private staticSpriteFrame:cc.SpriteFrame = null;

    oldSpriteFrame:cc.SpriteFrame = null;
    renderTexture:cc.RenderTexture = null;

    get staticCamera() {
        if (!StaticCamera) {
            let cameraNode = new cc.Node('Shader Camera');
            cc.game.addPersistRootNode(cameraNode);
            cameraNode.active = false;
            StaticCamera = cameraNode.addComponent(cc.Camera);
        }
        return StaticCamera;
    }

    private _getShaderName() {
        let idx1 = this.name.indexOf('<');
        let idx2 = this.name.indexOf('>');
        return this.name.substring(idx1+1, idx2);
    }

    resetInEditor() {
        let filename = this._getShaderName();
        let url = `db://assets/shaders/${filename.toLowerCase()}/${filename}.mtl`;
        let uuid = Editor.assetdb.remote.urlToUuid(url);
        cc.assetManager.loadAny({uuid: uuid}, {type:cc.Material}, (err, material:cc.Material)=>{
            if (err) {
                cc.error(material);
                return ;
            }
            if (!cc.isValid(this)) {
                return ;
            }
            this.renderComponent = this.getComponent(cc.RenderComponent);
            this.renderComponent.setMaterial(0, material);
            this._overrideUpdateMaterial();
        });
    }

    onLoad () {
        this.renderComponent = this.node.getComponent(cc.RenderComponent);
        if (!this.renderComponent) {
            cc.error('此节点必须包含一个渲染组件');
            this.destroy();
            return;
        }
        this._overrideUpdateMaterial();
    }

    applyStaticSpriteFrame() {
        if (!(this.renderComponent instanceof cc.Sprite)) {
            cc.error('此方法仅支持 Sprite ');
            return ;
        }
        this._updateStaticTexture();
        this.oldSpriteFrame = this.renderComponent.spriteFrame;
        this.renderComponent.spriteFrame = new cc.SpriteFrame(this.renderTexture);
        this._resetUpdateMaterial();
        this._resetMaterial();
    }

    onDestroy() {
        if (this.renderComponent) {
            this._resetUpdateMaterial();
            this._resetMaterial();
        }
        this.renderTexture && this.renderTexture.destroy();
    }

    private _overrideUpdateMaterial() {
        this.originalUpdateMaterial = this.renderComponent._updateMaterial;
        monkeyPatching(this.renderComponent, '_updateMaterial', ()=>{
            if (CC_EDITOR) {
                let material = this.renderComponent.getMaterial(0);
                if (material) {
                    let shaderName = this._getShaderName();
                    let idx = material.name.indexOf(shaderName+' ');
                    if (idx >= 0) {
                        this._updateProperty();
                    }
                }
            } else {
                this._updateProperty();
            }
        });
    }

    private _resetUpdateMaterial() {
        if (this.originalUpdateMaterial) {
            this.renderComponent._updateMaterial = this.originalUpdateMaterial;
            this.originalUpdateMaterial = null;
        }
    }

    _updateProperty() {
        
    }

    private _updateStaticTexture() {
        if (this.staticSpriteFrame) {
            return this.staticSpriteFrame;
        }

        let scaleX = this.node.scaleX;
        let scaleY = this.node.scaleY;
        let angle = this.node.angle;
        let active = this.node.active;
        let opacity = this.node.opacity;
        let children = this.node._children;
        let color = this.node.color;
        let anchor = this.node.getAnchorPoint();
        let skewX = this.node.skewX;
        let skewY = this.node.skewY;

        this.node.scaleX = 1;
        this.node.scaleY = -1;
        this.node.angle = 0;
        this.node.active = true;
        this.node.opacity = 255;
        this.node._children = [];
        this.node.color = cc.Color.WHITE;
        this.node.angle = 0;
        this.node.skewX = 0;
        this.node.skewY = 0;

        let cameraParent = this.staticCamera.node.parent;
        let cameraPos = this.staticCamera.node.position;
        let zoomRatio = this.staticCamera.zoomRatio;

        this.staticCamera.node.setPosition(this.node.position);
        this.staticCamera.zoomRatio = cc.winSize.height/this.node.height;
        this.staticCamera.node.parent = this.node.parent;

        this.staticCamera.node.active = true;

        this._renderStaticTexture(this.node.getContentSize());

        this.staticCamera.node.active = false;

        this.node.scaleX = scaleX;
        this.node.scaleY = scaleY;
        this.node.angle = angle;
        this.node.active = active;
        this.node.opacity = opacity;
        this.node._children = children;
        this.node.color = color;
        this.node.setAnchorPoint(anchor);
        this.node.skewX = skewX;
        this.node.skewY = skewY;

        this.staticCamera.zoomRatio = zoomRatio;
        this.staticCamera.node.parent = cameraParent;
        this.staticCamera.node.setPosition(cameraPos);
    }

    private _renderStaticTexture(size) {
        if (!this.renderTexture) {
            let gl = cc.game._renderContext;
            this.renderTexture = new cc.RenderTexture();
            this.renderTexture.initWithSize(size.width, size.height, gl.DEPTH_STENCIL);
            this.renderTexture.packable = true;
        }
        this.staticCamera.targetTexture = this.renderTexture;
        this.staticCamera.render(this.node);
        this.staticCamera.targetTexture = null;
        this.renderTexture._image = this.renderTexture.readPixels();
    }

    private _resetMaterial() {
        if (this.renderComponent instanceof cc.Sprite || this.renderComponent instanceof cc.Label) {
            let material = cc.Material.getBuiltinMaterial('2d-sprite');
            this.renderComponent.setMaterial(0, material);
        } else if (sp.Skeleton && this.renderComponent instanceof sp.Skeleton) {
            let material = cc.Material.getBuiltinMaterial('2d-spine');
            this.renderComponent.setMaterial(0, material);
        } else {
            cc.error('请覆盖 resetMaterial 函数，并将material设置为内建材质');
            return;
        }
    }

    onFocusInEditor() {

    }


    // update (dt) {}
}
