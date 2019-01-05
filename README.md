# cocos-creator-shader-assembler

## 简介

TypeScript版本

使用Creator2.0的材质系统 ，懒人shader， 自定义shader部分不通过可通过少量修改，shadertoy部分shader和完整格式可直接复制用。

1.支持完整配置let object={name：'',defines:[]，vert:'',frag:''} 格式。

2.支持shadertoy部分代码，单pass Demo支持，多pass引擎不支持，shader 文件保存文本格式txt。

3.支持部分不完整的shader 采用define覆盖方式，进行兼容，有部分shader多次定义需手动更改，shader 文件保存文本格式txt。


## 实现概述

使用控件ShaderAssembler挂载控件的方式对Sprite中材质进行操控，不对Sprite进行改造，所有自定义材质都再ShaderAssmber管理自定义材质。

ShaderFactory注册Template到渲染引擎中，ShaderFactory要先注册，才能使用自定义Shader。 

ShaderFactory可独立操作，一次性全部注册，或者动态注册。


### 自定义材质类

参考colinsusie 提供的[CustomMaterial](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/assets/Scripts/CustomMaterial.js)，这个材质类可以实现各种不同的效果。，再此感谢colin的分享。


### Demo代码片段
import 完整的Object shader配置
```js
import Glowing from './Glowing';
let shader_assembler = this.sprite.node.getComponent(ShaderAssembler);
// 注册渲染引擎pass template 可直接调用ShaderFactory独立注册
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
```

shadertoy上代码copy直接用
```js
var name = 'cloud2d';

var self = this;
cc.loader.loadRes('shader/' + name, function (err, data) {
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
    var iResolution = new cc.Vec3(
        self.sprite.node.width,
        self.sprite.node.height,
        10
    );
    console.log(iResolution);
    shader_assembler.activateCustomMaterial(self.sprite, mat)
    mat.setParamValue("iResolution", iResolution);
});
```

非shadertoy代码，定义缺失，采用define方式覆盖，只有加少量define，让shader修改量降至最小。
```js
var name = 'lightcircle';
var self = this;
cc.loader.loadRes('shader/' + name, function (err, data) {
    // console.log(data.text);
    let shader_assembler = self.sprite.node.getComponent(ShaderAssembler);
    shader_assembler.registerFragShaderTemplate(
        name,
        default_vert,
        `#define v_texCoord uv0
        `+default_frag_prefix + data.text 
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
    let iResolution = new cc.Vec3(
        self.sprite.node.width,
        self.sprite.node.height,
        10
    );
    console.log(iResolution);
    shader_assembler.activateCustomMaterial(self.sprite, mat)
    mat.setParamValue("iResolution", iResolution);
});
```

### 效果图

- 完整shader配置：
![效果](https://github.com/Sinmere/cocos-creator-shader-assembler/blob/master/snapshot/compelete.png)

- shadertoy：

![效果](https://github.com/Sinmere/cocos-creator-shader-assembler/blob/master/snapshot/shadertoy.gif)

- 1.x修复shader

![效果](https://github.com/Sinmere/cocos-creator-shader-assembler/blob/master/snapshot/shader_disable.gif)