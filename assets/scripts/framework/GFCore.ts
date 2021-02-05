

export enum CompType {
    Sprite = 1 << 0,
    Label = 1 << 1,
    Button = 1 << 2,
    Toggle = 1 << 3,
    Mask = 1 << 4,
    ParticleSystem = 1 << 5,
    Spine = 1 << 6,
    RichText = 1 << 7,
    EditBox = 1 << 8,
    ScrollView = 1 << 9,
    PageView = 1 << 10,
    Layout = 1 << 11,
    Widget = 1 << 12,
    Animation = 1 << 13,
    Camera = 1 << 14,
    RigidBody = 1 << 15,
}

class GFCore  {

    static CompType = CompType;

    bindNode (node:cc.Node, data:{}) {
        
    }

}

let gfCore = new GFCore();
export default gfCore;
