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
const renderer = renderEngine.renderer;

import ShaderAssembler, { default_vert, default_frag_prefix, default_frag_postfix } from './ShaderAssembler';


@ccclass
export default class Test extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    _start = 0;

    start() {
        this._start = Date.now();
        var name = 'cloud2d';

        var self = this;
        cc.loader.loadRes('shader/' + name, function (err, data) {
            // console.log(data.text);
            // console.log(default_vert);
            // console.log(default_frag_prefix + data.text + default_frag_postfix);
            let shader_assembler = self.sprite.node.getComponent(ShaderAssembler);
            shader_assembler.registerFragShaderTemplate(
                name,
                default_vert,
                default_frag_prefix + data.text + default_frag_postfix
                ,
                [
                    { name: 'use2DPos' },
                    { name: 'useModel' },
                ]);
            let mat = shader_assembler.createCustomMaterial(
                name,
                [
                    { name: 'iResolution', type: renderer.PARAM_FLOAT3 },
                    { name: 'iTime', type: renderer.PARAM_FLOAT },
                ],
                [
                    { name: 'use2DPos', value: 'true' },
                    { name: 'useModel', value: 'false' }
                ]
            )
            // var iResolution = new cc.Vec3(
            //     self.sprite.spriteFrame.getTexture().width,
            //     self.sprite.spriteFrame.getTexture().height,
            //     10
            // );
            var iResolution = new cc.Vec3(
                self.sprite.node.width,
                self.sprite.node.height,
                10
            );
            console.log(iResolution);
            shader_assembler.activateCustomMaterial(self.sprite, mat)
            mat.setParamValue("iResolution", iResolution);
        });
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
