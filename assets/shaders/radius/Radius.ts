import ShaderBase from "../base/ShaderBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Radius extends ShaderBase {

    @property _radius = 0;
    @property set radius(v) {
        this._radius = v;
        this._updateProperty();
    }
    @property get radius() {
        // cc.log("get radius");
        return this._radius;
    }

    start () {
        
    }

    // update (dt) {}

    _updateProperty() {
        let sp:cc.Sprite = this.renderComponent;
        if (sp && sp.spriteFrame) {
            let tex1 = sp.spriteFrame.getTexture();
            let rect = sp.spriteFrame.getRect();
            let material = sp.getMaterial(0);

            let perPixelInUV = rect.width/tex1.width/this.node.width;    //一像素在uv中的大小
            material.setProperty('halfTexLength', rect.width/tex1.width/2);
            material.setProperty('texCenter', [(rect.x+rect.width/2)/tex1.width, (rect.y+rect.height/2)/tex1.height]);
            material.setProperty('round', this.radius * perPixelInUV );
            material.setProperty('perPixelInUV', perPixelInUV);       
        }
    }
}
