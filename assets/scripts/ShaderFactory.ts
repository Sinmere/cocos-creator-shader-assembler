// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var ShaderFactory = {
    _shaders: {},

    // 增加一个新的Shader
    addShader: function (shader) {
        if (this._shaders[shader.name]) {
            // console.error("addShader - shader already exist: ", shader.name);
            return;
        }
        // 注册program _template 提供给Technique的pass使用 里面有2个默认模板
        if (cc.renderer._forward) {
            cc.renderer._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines || []);
            this._shaders[shader.name] = shader;
        } else {
            //在微信上初始时cc.renderer._forward不存在，需要等引擎初始化完毕才能使用 
            //其实没有__preload不用这层，没测试就加着了
            cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
                cc.renderer._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines || []);
                this._shaders[shader.name] = shader;
            });
        }
    },

    // 取Shader的定义
    getShader: function (name) {
        return this._shaders[name];
    }
}

export default ShaderFactory;
