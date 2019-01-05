// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

import ShaderAssembler, {default_vert} from './ShaderAssembler';
import Glowing from './Glowing';

@ccclass
export default class Test extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    _start = 0;


    start () {
        console.log(default_vert);
        this._start = Date.now();
        let shader_assembler = this.sprite.node.getComponent(ShaderAssembler);
        shader_assembler.registerShaderTemplate(Glowing);
        let mat = shader_assembler.createCustomMaterial(
            Glowing.name,
            [
                {name: 'iResolution', type: renderer.PARAM_FLOAT3},
                {name: 'iTime', type: renderer.PARAM_FLOAT},
            ],
            []
        )
        var iResolution = new cc.Vec3(
            this.sprite.spriteFrame.getTexture().width, 
            this.sprite.spriteFrame.getTexture().height,
            0
        );
        mat.color = new cc.Color().fromHEX("#1A7ADC")
        shader_assembler.activateCustomMaterial(this.sprite,mat)
        mat.setParamValue("iResolution", iResolution);
    }

    update() {
        const mat = this.sprite.node.getComponent(ShaderAssembler).currentMaterial;
        if (!mat) {
            return;
        }
        const now = Date.now();
        const time = (now - this._start) / 1000;
        mat.setParamValue("iTime", time);

    }
}
