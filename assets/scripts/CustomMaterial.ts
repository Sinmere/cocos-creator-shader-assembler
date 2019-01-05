const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

export default class CustomMaterial extends Material {

	_color = null;
	_effect = null;
	_mainTech = null;
	_texture = null;

	_shaderName = '';
	_params = null;
	_defines = '';

	constructor(shaderName, params, defines, presist = false) {
		super(presist)

		this._shaderName = shaderName;
		this._params = params;
		this._defines = defines;

		var pass = new renderer.Pass(shaderName);
		pass.setDepth(false, false);
		pass.setCullMode(gfx.CULL_NONE);
		pass.setBlend(
			gfx.BLEND_FUNC_ADD,
			gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
			gfx.BLEND_FUNC_ADD,
			gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
		);

		// var Technique = function Technique(stages, parameters, passes, layer) 
		// 1.stages参数用来设置_stageIDs 引擎中都是transparent 具体意义不明待解答
		// 2.parameters sprite必带 textrue color
		// 3 pass 上面的标准来 单pass	
		// 4.lay无用
		var techParams = [
			{ name: 'texture', type: renderer.PARAM_TEXTURE_2D },
			{ name: 'color', type: renderer.PARAM_COLOR4 }
		];
		if (params) {
			techParams = techParams.concat(params);
		}
		var mainTech = new renderer.Technique(
			['transparent'],
			techParams,
			[
			pass
			]
		);

		console.log(mainTech);

		// color初始白 标配
		this._color = { r: 1, g: 1, b: 1, a: 1 };

		// SpriteMaterial Define 模板
		// defines = [
		// 	{ name: 'useTexture', value: true },
		// 	{ name: 'useModel', value: false },
		// 	{ name: 'alphaTest', value: false },
		// 	{ name: 'use2DPos', value: true },
		// 	{ name: 'useColor', value: true }
		// ];

		// Effect
		this._effect = new renderer.Effect(
			[
				mainTech],
			{
				'color': this._color
			},
			defines
		);

		this._mainTech = mainTech;
		this._texture = null;
	}


	get effect() {
		return this._effect;
	}

	get shaderName(){
		return this._shaderName;
	}

	get texture() {
		return this._texture;
	}

	set texture(value) {
		if (this._texture !== value) {
			this._texture = value;
			this._effect.setProperty('texture', value.getImpl());
			this._texIds['texture'] = value.getId();
		}
	}

	get color() {
		return this._color;
	}

	set color(value) {
		var color = this._color;
		color.r = value.r / 255;
		color.g = value.g / 255;
		color.b = value.b / 255;
		color.a = value.a / 255;
		this._effect.setProperty('color', color);
	}

	clone() {
		var copy = new CustomMaterial(this._shaderName, this._params, this._defines);
		copy.texture = this.texture;
		copy.color = this.color;
		copy.updateHash();
		return copy;
	};

	// 设置自定义参数的值
	setParamValue(name, value) {
		// 等价于this._properties[name] = value;
		this._effect.setProperty(name, value);
	};

	// 设置定义值
	setDefine(name, value) {
		this._effect.define(name, value);
	};
}




