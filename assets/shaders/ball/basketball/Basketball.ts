import BallBase from "../BallBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends BallBase  {

    @property _lightOffset = cc.v2();
    @property set lightOffset(v) {
        this._lightOffset = v;
        this._updateProperty();
    }
    @property get lightOffset() {
        return this._lightOffset;
    }

    @property _light = 2;
    @property set light(v) {
        this._light = v;
        this._updateProperty();
    }
    @property get light() {
        return this._light;
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
            // material.setProperty('perPixelInUV', perPixelInUV);
            material.setProperty('raidus', rect.width/tex1.width/2);
            material.setProperty('texCenter', [(rect.x+rect.width/2)/tex1.width, (rect.y+rect.height/2)/tex1.height]);
            material.setProperty('lightOffset', [this.lightOffset.x * perPixelInUV, this.lightOffset.y * perPixelInUV]);
            material.setProperty('lightLength', (this.node.width/2 + this.lightOffset.len())*perPixelInUV);
            material.setProperty('light', this.light);
        }
    }
}
