// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
const renderEngine = cc.renderer.renderEngine;

export const default_vert = `

#ifdef use2DPos
attribute vec2 a_position;
#else
attribute vec3 a_position;
#endif

#ifdef useModel
uniform mat4 model;
#endif

uniform mat4 viewProj;
attribute mediump vec2 a_uv0;
varying mediump vec2 uv0;

void main () {
    mat4 mvp;
    #ifdef useModel
        mvp = viewProj * model;
    #else
        mvp = viewProj;
    #endif

    #ifdef use2DPos
        vec4 pos = mvp * vec4(a_position, 0, 1);
    #else
        vec4 pos = mvp * vec4(a_position, 1);
    #endif

    uv0 = a_uv0;
    gl_Position = pos;
}
`;


export const default_frag_prefix = `
#define iChannel0 texture
#define iGlobalTime iTime
uniform sampler2D texture;
varying mediump vec2 uv0;
uniform lowp vec4 color;
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
`;

export const default_frag_postfix =`
void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

import ShaderFactory from './ShaderFactory';
import CustomMaterial from './CustomMaterial';

@ccclass
export default class ShaderAssembler extends cc.Component {

    _materials = {};

    _current_material = null;

    _sprite: cc.Sprite = null;



    // 灰度图 调用则清空shader效果
    state2Gray() {
        this._sprite.setState(cc.Sprite.State.GRAY);
    }

    // 灰度图 调用则清空shader效果
    state2Normal() {
        this._sprite.setState(cc.Sprite.State.NORMAL);
    }

    createCustomMaterial(name, params, define) {
        let custom_material = new CustomMaterial(name, params, define);
        this.setMaterial(name, custom_material);
        return custom_material;
    }

    get currentMaterial() {
        return this._current_material;
    }

    // 取自定义材质
    getMaterial(name) {
        if (this._materials) {
            return this._materials[name];
        } else {
            return undefined;
        }
    }

    // 设置自定义材质
    setMaterial(name, mat) {
        if (!this._materials) {
            this._materials = {}
        }
        this._materials[name] = mat;
        this._current_material = mat;
    }

    // 删除节点上材质
    removeMaterial(name){
        if(this._current_material.shaderName === name){
            this.state2Normal();
            delete this._materials[name];
            this._current_material = null;
        }else{
            delete this._materials[name];
        }
    }

    activateCustomMaterial(sprite, material) {
        console.log(material)
        if (!(sprite instanceof cc.Sprite)) {
            return;
        }
        let spriteFrame = sprite.spriteFrame;
        // WebGL
        if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
            // Set texture
            if (spriteFrame && spriteFrame.textureLoaded()) {
                let texture = spriteFrame.getTexture();
                if (material.texture !== texture) {
                    material.texture = texture;
                    sprite._updateMaterial(material);
                }
                else if (material !== sprite._material) {
                    sprite._updateMaterial(material);
                }
                if (sprite._renderData) {
                    sprite._renderData.material = material;
                }

                // 1 << 4 等价于 cc.RenderFlow.FLAG_COLOR 可解决ts强迫症小红点 
                sprite.node._renderFlag |= cc.RenderFlow.FLAG_COLOR

                sprite.markForUpdateRenderData(true);
                sprite.markForRender(true);
            }
            else {
                sprite.disableRender();
            }
        }
        else {
            sprite.markForUpdateRenderData(true);
            sprite.markForRender(true);
        }
    }

    registerShaderTemplate(shader) {
        ShaderFactory.addShader(shader);
    }

    registerFragShaderTemplate(name, vert, frag, define) {
        let shader = {}
        shader['name'] = name;
        shader['vert'] = vert;
        shader['frag'] = frag;
        shader['define'] = define;
        // shader
        ShaderFactory.addShader(shader);
    }
}

