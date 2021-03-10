

const {ccclass} = cc._decorator;
import {monkeyPatching} from "../../scripts/framework/Func";

let StaticCamera:cc.Camera = null;

@ccclass
export default class ShaderBase extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    material:cc.Material = null;

    renderComponent:cc.RenderComponent = null;
    originalUpdateMaterial:Function = null;

    private staticSpriteFrame:cc.SpriteFrame = null;

    private renderTexture:cc.RenderTexture = null;

    get staticCamera() {
        if (!StaticCamera) {
            let cameraNode = new cc.Node('Shader Camera');
            cc.game.addPersistRootNode(cameraNode);
            StaticCamera = cameraNode.addComponent(cc.Camera);
        }
        return StaticCamera;
    }

    resetInEditor() {
        cc.log(this.name);
        let idx1 = this.name.indexOf('<');
        let idx2 = this.name.indexOf('>');
        let filename = this.name.substring(idx1+1, idx2);
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
        if (CC_EDITOR) {
            return ;
        }
        this.renderComponent = this.node.getComponent(cc.RenderComponent);
        if (!this.renderComponent) {
            cc.error('此节点必须包含一个渲染组件');
            this.destroy();
            return;
        }
        this._overrideUpdateMaterial();
    }

    applyStaticSpriteFrame() {
        if (!(this.renderComponent instanceof cc.Sprite || this.renderComponent instanceof cc.Label)) {
            cc.error('此方法仅支持 Sprite 或者 Label');
            return ;
        }
        this._getStaticSpriteFrame();
    }

    onDestroy() {
        if (this.renderComponent) {
            this._resetUpdateMaterial();
            this._resetMaterial();
        }
        this.renderTexture && this.renderTexture.destroy();
    }

    _overrideUpdateMaterial() {
        this.originalUpdateMaterial = this.renderComponent._updateMaterial;
        monkeyPatching(this.renderComponent, '_updateMaterial', ()=>{
            this._updateProperty();
        });
    }

    _resetUpdateMaterial() {
        this.renderComponent._updateMaterial = this.originalUpdateMaterial;
        this.originalUpdateMaterial = null;
    }

    _updateProperty() {
        
    }

    _getStaticSpriteFrame() {
        if (this.staticSpriteFrame) {
            return this.staticSpriteFrame;
        }

        let sf:cc.SpriteFrame = this.renderComponent.spriteFrame;
        let originalSize = sf.getRect();

        let scaleX = this.node.scaleX;
        let scaleY = this.node.scaleY;
        let size = this.node.getContentSize();
        let angle = this.node.angle;
        let active = this.node.active;
        let opacity = this.node.opacity;
        let children = this.node._children;

        this.node.scaleX = 1;
        this.node.scaleY = -1;
        this.node.setContentSize(cc.size(originalSize.width, originalSize.height));
        this.node.angle = 0;
        this.node.active = true;
        this.node.opacity = 255;
        this.node._children = [];


        let cameraParent = this.staticCamera.node.parent;
        let cameraPos = this.staticCamera.node.position;
        let zoomRatio = this.staticCamera.zoomRatio;

        this.staticCamera.node.setPosition(this.node.position);
        this.staticCamera.zoomRatio = cc.winSize.height/this.node.height;
        this.staticCamera.node.parent = this.node.parent;

        this._renderStaticSpriteFrame(originalSize);

        this.node.scaleX = scaleX;
        this.node.scaleY = scaleY;
        this.node.setContentSize(size);
        this.node.angle = angle;
        this.node.active = active;
        this.node.opacity = opacity;
        this.node._children = children;

        this.staticCamera.zoomRatio = zoomRatio;
        this.staticCamera.node.parent = cameraParent;
        this.staticCamera.node.setPosition(cameraPos);
    }

    _renderStaticSpriteFrame(size) {
        let gl = cc.game._renderContext;
        if (!this.renderTexture) {
            this.renderTexture = new cc.RenderTexture();
            this.renderTexture.initWithSize(size.width, size.height, gl.DEPTH_STENCIL);
        }
        this.staticCamera.targetTexture = this.renderTexture;
        this.staticCamera.render(this.node);
    }

    _resetMaterial() {
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



    // update (dt) {}
}
