
class GFTexMgr {

    _enabled = false;

    init(){
        if (cc.gfx && cc.gfx.Texture2D && cc.renderer && cc.renderer._handle && cc.Texture2D) {
            this._enabled = true;
        } else {
            this._enabled = false;
            return ;
        }
        cc.macro.CLEANUP_IMAGE_CACHE = false;
    
        let renderTexture = cc.renderer.Texture2D;

        let $this = this;
    
        let update = renderTexture.prototype.update;
        renderTexture.prototype.update = function() {
            this._glID === null && this._reload && this._reload();
            update.apply(this, arguments);
        }
    
        let updateSubImage = renderTexture.prototype.updateSubImage;
        renderTexture.prototype.updateSubImage = function() {
            this._glID === null && this._reload && this._reload();
            updateSubImage.apply(this, arguments);
        }
    
        let updateImage = renderTexture.prototype.updateImage;
        renderTexture.prototype.updateImage = function() {
            this._glID === null && this._reload && this._reload();
            updateImage.apply(this, arguments);
        }
    
        cc.Texture2D.prototype.onlyReleaseTexture = function() {
            this._texture._device._gl.deleteTexture(this._texture._glID);
            this._texture._glID = null;
        }
    
        let initWithElement = cc.Texture2D.prototype.initWithElement;
        cc.Texture2D.prototype.initWithElement = function(element) {
            initWithElement.apply(this, arguments);
            this.AddTexture(this);
            let _this = this;
            let reload = function() {
                this._glID = this._device._gl.createTexture();
                initWithElement.call(_this, element);
            }
            if (this._texture) {
                this._texture._reload = reload;
            } else {
                this.on('load', ()=>{
                    this._texture && (this._texture._reload = reload);
                });
            }
        }
    
        let initWithData = cc.Texture2D.prototype.initWithData;
        cc.Texture2D.prototype.initWithData = function(data, pixelFormat, pixelsWidth, pixelsHeight) {
            let bool = initWithData.apply(this, arguments);
            this.AddTexture(this);
            let _this = this;
            this._texture._reload = function() {
                this._glID = this._device._gl.createTexture();
                initWithData.call(_this, data, pixelFormat, pixelsWidth, pixelsHeight);
            }
            return bool;
        }
    
        let destroy = cc.Texture2D.prototype.destroy;
        cc.Texture2D.prototype.destroy = function() {
            this.RemoveTexture(this);
            return destroy.apply(this, arguments);
        }
    
        cc.renderer._handle._flushMaterial = function (material) {
            if (!material) {
                return;
            }
            this.material = material;
            let effect = material.effect;
            if (!effect) return;
    
            let texture = material.getProperty('texture');
            if (texture) {
                texture._lastRenderTime = Date.now()
                texture._glID === null && texture._reload && texture._reload();
            }
    
            // Generate model
            let model = this._modelPool.add();
            this._batchedModels.push(model);
            model.sortKey = this._sortKey++;
            model._cullingMask = this.cullingMask;
            model.setNode(this.node);
            model.setEffect(effect, null);
            model.setInputAssembler({});
    
            this._renderScene.addModel(model);
        }
    
        cc.renderer._handle._flush = function () {
            let material = this.material,
                buffer = this._buffer,
                indiceCount = buffer.indiceOffset - buffer.indiceStart;
            if (!this.walking || !material || indiceCount <= 0) {
                return;
            }
    
            let effect = material.effect;
            if (!effect) return;
    
            let texture = material.getProperty('texture');
            if (texture) {
                texture._lastRenderTime = Date.now()
                texture._glID === null && texture._reload && texture._reload();
            }
    
            // Generate ia
            let ia = this._iaPool.add();
            ia._vertexBuffer = buffer._vb;
            ia._indexBuffer = buffer._ib;
            ia._start = buffer.indiceStart;
            ia._count = indiceCount;
    
            // Generate model
            let model = this._modelPool.add();
            this._batchedModels.push(model);
            model.sortKey = this._sortKey++;
            model._cullingMask = this.cullingMask;
            model.setNode(this.node);
            model.setEffect(effect);
            model.setInputAssembler(ia);
    
            this._renderScene.addModel(model);
            buffer.forwardIndiceStartToOffset();
        }
    
        cc.renderer._handle._flushIA = function (ia) {
            if (!ia) {
                return;
            }
    
            let material = this.material;
            let effect = material.effect;
            if (!effect) return;
    
            let texture = material.getProperty('texture');
            if (texture) {
                texture._lastRenderTime = Date.now()
                texture._glID === null && texture._reload && texture._reload();
            }
    
            // Generate model
            let model = this._modelPool.add();
            this._batchedModels.push(model);
            model.sortKey = this._sortKey++;
            model._cullingMask = this.cullingMask;
            model.setNode(this.node);
            model.setEffect(effect);
            model.setInputAssembler(ia);
    
            this._renderScene.addModel(model);
        }
    }

    AddTexture(tex:cc.Texture2D) {

    }

    RemoveTexture(tex:cc.Texture2D) {

    }
}

