
interface NodeData {

}

interface GFSpriteData {
    spriteFrame:cc.SpriteFrame;
}

interface GFLabelData {
    string:string;
}

interface GFButtonData {
    click:Function;
}

interface GFToggleData {
    toggle:Function;
}

interface GFMaskData {

}

interface GFParticleSystemData {

}

interface GFSpineData {

}

interface GFRichTextData {

}

interface GFEditBoxData {

}

interface GFScrollViewData {

}

interface GFPageViewData {

}

interface GFLayoutData {

}

interface GFWidgetData {

}

interface GFAnimationData {

}

interface GFCameraData {

}

interface GFRigidBodyData {

}


export default interface GFData {
    node?:NodeData;
    sprite?:GFSpriteData;
    label?:GFLabelData|string;
    button?:GFButtonData;
    toggle?:GFToggleData;
    mask?:GFMaskData;
    particleSystem?:GFParticleSystemData;
    spine?:GFSpineData;
    richText?:GFRichTextData;
    editBox?:GFEditBoxData;
    scrollView?:GFScrollViewData;
    pageView?:GFPageViewData;
    layout?:GFLayoutData;
    widget?:GFWidgetData;
    animation?:GFAnimationData;
    camera?:GFCameraData;
    rigidBody?:GFRigidBodyData;
    custom?:Object;
}
