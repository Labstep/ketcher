var Vec2 = require('../util/vec2');
var Visel = require('./visel');          
var util = require('../util');

var ReObject = function ()  // TODO ??? should it be in ReStruct namespace
{
	this.__ext = new Vec2(0.05 * 3, 0.05 * 3);
};

ReObject.prototype.init = function (viselType)
{
	this.visel = new Visel(viselType);

	this.highlight = false;
	this.highlighting = null;
	this.selected = false;
	this.selectionPlate = null;
};

// returns the bounding box of a ReObject in the object coordinates
ReObject.prototype.getVBoxObj = function (render) {
	var vbox = this.visel.boundingBox;
	if (util.isNull(vbox))
		return null;
	if (render.offset)
		vbox = vbox.translate(render.offset.negated());
	return vbox.transform(render.scaled2obj, render);
};

ReObject.prototype.drawHighlight = function (render) {
	console.log('ReObject.drawHighlight is not overridden');
};

ReObject.prototype.setHighlight = function (highLight, render) { // TODO render should be field
	if (highLight) {
		var noredraw = 'highlighting' in this && this.highlighting != null;// && !this.highlighting.removed;
		if (noredraw) {
			if (this.highlighting.type == 'set') {
				noredraw = !this.highlighting[0].removed;
			} else {
				noredraw = !this.highlighting.removed;
			}
		}
		// rbalabanov: here is temporary fix for "drag issue" on iPad
		//BEGIN
		//noredraw = noredraw && (!('hiddenPaths' in ReStruct.prototype) || ReStruct.prototype.hiddenPaths.indexOf(this.highlighting) < 0);
		//END
		if (noredraw) {
			this.highlighting.show();
		}
		else {
			render.paper.setStart();
			this.drawHighlight(render);
			this.highlighting = render.paper.setFinish();
		}
	} else {
		if (this.highlighting) this.highlighting.hide();
	}
	this.highlight = highLight;
};

ReObject.prototype.makeSelectionPlate = function (render) {
	console.log('ReObject.makeSelectionPlate is not overridden');
};

module.exports = ReObject