
// minifier: path aliases

enyo.path.addPaths({layout: "/Volumes/Work/apps/t24/app/enyo/tools/../../lib/layout/", onyx: "/Volumes/Work/apps/t24/app/enyo/tools/../../lib/onyx/", onyx: "/Volumes/Work/apps/t24/app/enyo/tools/../../lib/onyx/source/", phonegap: "/Volumes/Work/apps/t24/app/enyo/tools/../../lib/phonegap/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var a = 0, b = this.container.children, c; c = b[a]; a++) if (c.fit && c.showing) return a;
},
getFitControl: function() {
var a = this.container.children, b = a[this.fitIndex];
return b && b.fit && b.showing || (this.fitIndex = this.calcFitIndex(), b = a[this.fitIndex]), b;
},
getLastControl: function() {
var a = this.container.children, b = a.length - 1, c = a[b];
while ((c = a[b]) && !c.showing) b--;
return c;
},
_reflow: function(a, b, c, d) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var e = this.getFitControl();
if (!e) return;
var f = 0, g = 0, h = 0, i, j = this.container.hasNode();
j && (i = enyo.FittableLayout.calcPaddingExtents(j), f = j[b] - (i[c] + i[d]));
var k = e.getBounds();
g = k[c] - (i && i[c] || 0);
var l = this.getLastControl();
if (l) {
var m = enyo.FittableLayout.getComputedStyleValue(l.hasNode(), "margin", d) || 0;
if (l != e) {
var n = l.getBounds(), o = k[c] + k[a], p = n[c] + n[a] + m;
h = p - o;
} else h = m;
}
var q = f - (g + h);
e.applyStyle(a, q + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
},
statics: {
_ieCssToPixelValue: function(a, b) {
var c = b, d = a.style, e = d.left, f = a.runtimeStyle && a.runtimeStyle.left;
return f && (a.runtimeStyle.left = a.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, f && (d.runtimeStyle.left = f), c;
},
_pxMatch: /px/i,
getComputedStyleValue: function(a, b, c, d) {
var e = d || enyo.dom.getComputedStyle(a);
if (e) return parseInt(e.getPropertyValue(b + "-" + c));
if (a && a.currentStyle) {
var f = a.currentStyle[b + enyo.cap(c)];
return f.match(this._pxMatch) || (f = this._ieCssToPixelValue(a, f)), parseInt(f);
}
return 0;
},
calcBoxExtents: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return {
top: this.getComputedStyleValue(a, b, "top", c),
right: this.getComputedStyleValue(a, b, "right", c),
bottom: this.getComputedStyleValue(a, b, "bottom", c),
left: this.getComputedStyleValue(a, b, "left", c)
};
},
calcPaddingExtents: function(a) {
return this.calcBoxExtents(a, "padding");
},
calcMarginExtents: function(a) {
return this.calcBoxExtents(a, "margin");
}
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
multiSelect: !1,
toggleSelected: !1
},
events: {
onSetupItem: ""
},
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
bottomUp: !1,
create: function() {
this.inherited(arguments), this.multiSelectChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
setupItem: function(a) {
this.doSetupItem({
index: a,
selected: this.isSelected(a)
});
},
generateChildHtml: function() {
var a = "";
this.index = null;
for (var b = 0, c = 0; b < this.count; b++) c = this.rowOffset + (this.bottomUp ? this.count - b - 1 : b), this.setupItem(c), this.$.client.setAttribute("index", c), a += this.inherited(arguments), this.$.client.teardownRender();
return a;
},
previewDomEvent: function(a) {
var b = this.index = this.rowForEvent(a);
a.rowIndex = a.index = b, a.flyweight = this;
},
decorateEvent: function(a, b, c) {
var d = b && b.index != null ? b.index : this.index;
b && d != null && (b.index = d, b.flyweight = this), this.inherited(arguments);
},
tap: function(a, b) {
this.toggleSelected ? this.$.selection.toggle(b.index) : this.$.selection.select(b.index);
},
selectDeselect: function(a, b) {
this.renderRow(b.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(a) {
return this.getSelection().isSelected(a);
},
renderRow: function(a) {
var b = this.fetchRowNode(a);
b && (this.setupItem(a), b.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(a) {
if (this.hasNode()) {
var b = this.node.querySelectorAll('[index="' + a + '"]');
return b && b[0];
}
},
rowForEvent: function(a) {
var b = a.target, c = this.hasNode().id;
while (b && b.parentNode && b.id != c) {
var d = b.getAttribute && b.getAttribute("index");
if (d !== null) return Number(d);
b = b.parentNode;
}
return -1;
},
prepareRow: function(a) {
var b = this.fetchRowNode(a);
enyo.FlyweightRepeater.claimNode(this.$.client, b);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(a, b, c) {
b && (this.prepareRow(a), enyo.call(c || null, b), this.lockRow());
},
statics: {
claimNode: function(a, b) {
var c = b && b.querySelectorAll("#" + a.id);
c = c && c[0], a.generated = Boolean(c || !a.tag), a.node = c, a.node && a.rendered();
for (var d = 0, e = a.children, f; f = e[d]; d++) this.claimNode(f, b);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var a = 0; a < this.pageCount; a++) this.portSize += this.getPageHeight(a);
this.adjustPortSize();
},
generatePage: function(a, b) {
this.page = a;
var c = this.$.generator.rowOffset = this.rowsPerPage * this.page, d = this.$.generator.count = Math.min(this.count - c, this.rowsPerPage), e = this.$.generator.generateChildHtml();
b.setContent(e);
var f = b.getBounds().height;
!this.rowHeight && f > 0 && (this.rowHeight = Math.floor(f / d), this.updateMetrics());
if (!this.fixedHeight) {
var g = this.getPageHeight(a);
g != f && f > 0 && (this.pageHeights[a] = f, this.portSize += f - g);
}
},
update: function(a) {
var b = !1, c = this.positionToPageInfo(a), d = c.pos + this.scrollerHeight / 2, e = Math.floor(d / Math.max(c.height, this.scrollerHeight) + .5) + c.no, f = e % 2 == 0 ? e : e - 1;
this.p0 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page0), this.positionPage(f, this.$.page0), this.p0 = f, b = !0), f = e % 2 == 0 ? Math.max(1, e - 1) : e, this.p1 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page1), this.positionPage(f, this.$.page1), this.p1 = f, b = !0), b && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(a) {
this.update(this.calcPos(a));
},
calcPos: function(a) {
return this.bottomUp ? this.portSize - this.scrollerHeight - a : a;
},
adjustBottomPage: function() {
var a = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(a.pageNo, a);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var a = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", a + "px");
},
positionPage: function(a, b) {
b.pageNo = a;
var c = this.pageToPosition(a);
b.applyStyle(this.pageBound, c + "px");
},
pageToPosition: function(a) {
var b = 0, c = a;
while (c > 0) c--, b += this.getPageHeight(c);
return b;
},
positionToPageInfo: function(a) {
var b = -1, c = this.calcPos(a), d = this.defaultPageHeight;
while (c >= 0) b++, d = this.getPageHeight(b), c -= d;
return {
no: b,
height: d,
pos: c + d
};
},
isPageInRange: function(a) {
return a == Math.max(0, Math.min(this.pageCount - 1, a));
},
getPageHeight: function(a) {
return this.pageHeights[a] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(a, b) {
var c = this.inherited(arguments);
return this.update(this.getScrollTop()), c;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(a) {
this.update(a), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(a) {
this.setScrollTop(this.calcPos(a));
},
scrollToRow: function(a) {
var b = Math.floor(a / this.rowsPerPage), c = a % this.rowsPerPage, d = this.pageToPosition(b);
this.updateForPosition(d), d = this.pageToPosition(b), this.setScrollPosition(d);
if (b == this.p0 || b == this.p1) {
var e = this.$.generator.fetchRowNode(a);
if (e) {
var f = e.offsetTop;
this.bottomUp && (f = this.getPageHeight(b) - e.offsetHeight - f);
var g = this.getScrollPosition() + f;
this.setScrollPosition(g);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(a, b) {
return this.getSelection().select(a, b);
},
isSelected: function(a) {
return this.$.generator.isSelected(a);
},
renderRow: function(a) {
this.$.generator.renderRow(a);
},
prepareRow: function(a) {
this.$.generator.prepareRow(a);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(a, b, c) {
this.$.generator.performOnRow(a, b, c);
},
animateFinish: function(a) {
return this.twiddle(), !0;
},
twiddle: function() {
var a = this.getStrategy();
enyo.call(a, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScroll: "scrollHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var a = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, a), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(a, b) {
this.pully = b.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scrollHandler: function(a) {
this.completingPull && this.pully.setShowing(!1);
var b = this.getStrategy().$.scrollMath, c = b.y;
b.isInOverScroll() && c > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + c + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), c > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && c < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel()));
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var a = this.getStrategy().$.scrollMath;
a.setScrollY(a.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var a = this.getInitialStyleValue(this.hasNode(), this.boundary);
a.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return c ? c.getPropertyValue(b) : a && a.currentStyle ? a.currentStyle[b] : "0";
},
updateBounds: function(a, b) {
var c = {};
c[this.boundary] = a, this.setBounds(c, this.unit), this.setInlineStyles(a, b);
},
updateDragScalar: function() {
if (this.unit == "%") {
var a = this.getBounds()[this.dimension];
this.kDragScalar = a ? 100 / a : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var a = this.axis == "h";
this.dragMoveProp = a ? "dx" : "dy", this.shouldDragProp = a ? "horizontal" : "vertical", this.transform = a ? "translateX" : "translateY", this.dimension = a ? "width" : "height", this.boundary = a ? "left" : "top";
},
setInlineStyles: function(a, b) {
var c = {};
this.unitModifier ? (c[this.boundary] = this.percentToPixels(a, this.unitModifier), c[this.dimension] = this.unitModifier, this.setBounds(c)) : (b ? c[this.dimension] = b : c[this.boundary] = a, this.setBounds(c, this.unit));
},
valueChanged: function(a) {
var b = this.value;
this.isOob(b) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(b) : this.clampValue(b)), enyo.platform.android > 2 && (this.value ? (a === 0 || a === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(a) {
var b = this.calcMin(), c = this.calcMax();
return Math.max(b, Math.min(a, c));
},
dampValue: function(a) {
return this.dampBound(this.dampBound(a, this.min, 1), this.max, -1);
},
dampBound: function(a, b, c) {
var d = a;
return d * c < b * c && (d = b + (d - b) / 4), d;
},
percentToPixels: function(a, b) {
return Math.floor(b / 100 * a);
},
pixelsToPercent: function(a) {
var b = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return a / b * 100;
},
shouldDrag: function(a) {
return this.draggable && a[this.shouldDragProp];
},
isOob: function(a) {
return a > this.calcMax() || a < this.calcMin();
},
dragstart: function(a, b) {
if (this.shouldDrag(b)) return b.preventDefault(), this.$.animator.stop(), b.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(a, b) {
if (this.dragging) {
b.preventDefault();
var c = this.canTransform ? b[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(b[this.dragMoveProp]), d = this.drag0 + c, e = c - this.dragd0;
return this.dragd0 = c, e && (b.dragInfo.minimizing = e < 0), this.setValue(d), this.preventDragPropagation;
}
},
dragfinish: function(a, b) {
if (this.dragging) return this.dragging = !1, this.completeDrag(b), b.preventTap(), this.preventDragPropagation;
},
completeDrag: function(a) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(a.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(a, b) {
this.$.animator.play({
startValue: a,
endValue: b,
node: this.hasNode()
});
},
animateTo: function(a) {
this.play(this.value, a);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(a) {
a ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.doAnimateFinish(a), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c._arranger = null;
this.inherited(arguments);
},
arrange: function(a, b) {},
size: function() {},
start: function() {
var a = this.container.fromIndex, b = this.container.toIndex, c = this.container.transitionPoints = [ a ];
if (this.incrementalPoints) {
var d = Math.abs(b - a) - 2, e = a;
while (d >= 0) e += b < a ? -1 : 1, c.push(e), d--;
}
c.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(a) {
return a[this.canDragProp];
},
calcDragDirection: function(a) {
return a[this.dragDirectionProp];
},
calcDrag: function(a) {
return a[this.dragProp];
},
drag: function(a, b, c, d, e) {
var f = this.measureArrangementDelta(-a, b, c, d, e);
return f;
},
measureArrangementDelta: function(a, b, c, d, e) {
var f = this.calcArrangementDifference(b, c, d, e), g = f ? a / Math.abs(f) : 0;
return g *= this.container.fromIndex > this.container.toIndex ? -1 : 1, g;
},
calcArrangementDifference: function(a, b, c, d) {},
_arrange: function(a) {
var b = this.getOrderedControls(a);
this.arrange(b, a);
},
arrangeControl: function(a, b) {
a._arranger = enyo.mixin(a._arranger || {}, b);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var a = 0, b = this.container.getPanels(), c; c = b[a]; a++) {
enyo.dom.accelerate(c, this.accelerated);
if (enyo.platform.safari) {
var d = c.children;
for (var e = 0, f; f = d[e]; e++) enyo.dom.accelerate(f, this.accelerated);
}
}
},
reflow: function() {
var a = this.container.hasNode();
this.containerBounds = a ? {
width: a.clientWidth,
height: a.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var a = this.container.arrangement;
if (a) for (var b = 0, c = this.container.getPanels(), d; d = c[b]; b++) this.flowControl(d, a[b]);
},
flowControl: function(a, b) {
enyo.Arranger.positionControl(a, b);
var c = b.opacity;
c != null && enyo.Arranger.opacifyControl(a, c);
},
getOrderedControls: function(a) {
var b = Math.floor(a), c = b - this.controlsIndex, d = c > 0, e = this.c$ || [];
for (var f = 0; f < Math.abs(c); f++) d ? e.push(e.shift()) : e.unshift(e.pop());
return this.controlsIndex = b, e;
},
statics: {
positionControl: function(a, b, c) {
var d = c || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var e = b.left, f = b.top, e = enyo.isString(e) ? e : e && e + d, f = enyo.isString(f) ? f : f && f + d;
enyo.dom.transform(a, {
translateX: e || null,
translateY: f || null
});
} else a.setBounds(b, c);
},
opacifyControl: function(a, b) {
var c = b;
c = c > .99 ? 1 : c < .01 ? 0 : c, enyo.platform.ie < 9 ? a.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + c * 100 + ")") : a.applyStyle("opacity", c);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
canDragProp: "none",
calcArrangementDifference: function(a, b, c, d) {
return this.containerBounds.width;
},
arrange: function(a, b) {
for (var c = 0, d, e, f; d = a[c]; c++) f = c == 0 ? 1 : 0, this.arrangeControl(d, {
opacity: f
});
},
start: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) {
var d = c.showing;
c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && !d && c.resized();
}
},
finish: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.opacifyControl(c, 1), c.showing || c.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) {
var d = c.showing;
c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && !d && c.resized();
}
var e = this.container.fromIndex, b = this.container.toIndex;
this.container.transitionPoints = [ b + "." + e + ".s", b + "." + e + ".f" ];
},
finish: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
arrange: function(a, b) {
var c = b.split("."), d = c[0], e = c[1], f = c[2] == "s", g = this.containerBounds.width;
for (var h = 0, i = this.container.getPanels(), j, k; j = i[h]; h++) k = g, e == h && (k = f ? 0 : -g), d == h && (k = f ? g : 0), e == h && e == d && (k = 0), this.arrangeControl(j, {
left: k
});
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var a = this.container.getPanels(), b = this.containerPadding = this.container.hasNode() ? enyo.FittableLayout.calcPaddingExtents(this.container.node) : {}, c = this.containerBounds;
c.height -= b.top + b.bottom, c.width -= b.left + b.right;
var d;
for (var e = 0, f = 0, g, h; h = a[e]; e++) g = enyo.FittableLayout.calcMarginExtents(h.hasNode()), h.width = h.getBounds().width, h.marginWidth = g.right + g.left, f += (h.fit ? 0 : h.width) + h.marginWidth, h.fit && (d = h);
if (d) {
var i = c.width - f;
d.width = i >= 0 ? i : d.width;
}
for (var e = 0, j = b.left, g, h; h = a[e]; e++) h.setBounds({
top: b.top,
bottom: b.bottom,
width: h.fit ? h.width : null
});
},
arrange: function(a, b) {
this.container.wrap ? this.arrangeWrap(a, b) : this.arrangeNoWrap(a, b);
},
arrangeNoWrap: function(a, b) {
var c = this.container.getPanels(), d = this.container.clamp(b), e = this.containerBounds.width;
for (var f = d, g = 0, h; h = c[f]; f++) {
g += h.width + h.marginWidth;
if (g > e) break;
}
var i = e - g, j = 0;
if (i > 0) {
var k = d;
for (var f = d - 1, l = 0, h; h = c[f]; f--) {
l += h.width + h.marginWidth;
if (i - l <= 0) {
j = i - l, d = f;
break;
}
}
}
for (var f = 0, m = this.containerPadding.left + j, n, h; h = c[f]; f++) n = h.width + h.marginWidth, f < d ? this.arrangeControl(h, {
left: -n
}) : (this.arrangeControl(h, {
left: Math.floor(m)
}), m += n);
},
arrangeWrap: function(a, b) {
for (var c = 0, d = this.containerPadding.left, e, f; f = a[c]; c++) this.arrangeControl(f, {
left: d
}), d += f.width + f.marginWidth;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e].left - d[e].left;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("top", null), c.applyStyle("bottom", null), c.applyStyle("left", null), c.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var a = 0, b = this.container.getPanels(), c; c = b[a]; a++) c._fit && a != b.length - 1 && (c.applyStyle("width", null), c._fit = null);
},
arrange: function(a, b) {
var c = this.container.getPanels();
for (var d = 0, e = this.containerPadding.left, f, g; g = c[d]; d++) this.arrangeControl(g, {
left: e
}), d >= b && (e += g.width + g.marginWidth), d == c.length - 1 && b < 0 && this.arrangeControl(g, {
left: e - b
});
},
calcArrangementDifference: function(a, b, c, d) {
var e = this.container.getPanels().length - 1;
return Math.abs(d[e].left - b[e].left);
},
flowControl: function(a, b) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var c = this.container.getPanels(), d = c.length - 1, e = c[d];
a == e && this.fitControl(a, b.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var a = this.container.getPanels(), b = this.container.arrangement, c = a.length - 1, d = a[c];
this.fitControl(d, b[c].left);
}
},
fitControl: function(a, b) {
a._fit = !0, a.applyStyle("width", this.containerBounds.width - b + "px"), a.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var a = this.container.getPanels(), b = this.containerBounds[this.axisSize], c = b - this.margin - this.margin;
for (var d = 0, e, f; f = a[d]; d++) e = {}, e[this.axisSize] = c, e[this.offAxisSize] = "100%", f.setBounds(e);
},
arrange: function(a, b) {
var c = Math.floor(this.container.getPanels().length / 2), d = this.getOrderedControls(Math.floor(b) - c), e = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - e * c, g = (d.length - 1) / 2;
for (var h = 0, i, j, k; i = d[h]; h++) j = {}, j[this.axisPosition] = f, j.opacity = h == 0 || h == d.length - 1 ? 0 : 1, this.arrangeControl(i, j), f += e;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e][this.axisPosition] - d[e][this.axisPosition];
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(c, 1), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var a = this.container.getPanels(), b = this.containerBounds, c = this.controlWidth = b.width / 3, d = this.controlHeight = b.height / 3;
for (var e = 0, f; f = a[e]; e++) f.setBounds({
width: c,
height: d
});
},
arrange: function(a, b) {
var c = this.inc;
for (var d = 0, e = a.length, f; f = a[d]; d++) {
var g = Math.cos(d / e * 2 * Math.PI) * d * c + this.controlWidth, h = Math.sin(d / e * 2 * Math.PI) * d * c + this.controlHeight;
this.arrangeControl(f, {
left: g,
top: h
});
}
},
start: function() {
this.inherited(arguments);
var a = this.getOrderedControls(this.container.toIndex);
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", a.length - b);
},
calcArrangementDifference: function(a, b, c, d) {
return this.controlWidth;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", null), enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var a = this.container.getPanels(), b = this.colWidth, c = this.colHeight;
for (var d = 0, e; e = a[d]; d++) e.setBounds({
width: b,
height: c
});
},
arrange: function(a, b) {
var c = this.colWidth, d = this.colHeight, e = Math.floor(this.containerBounds.width / c), f;
for (var g = 0, h = 0; h < a.length; g++) for (var i = 0; i < e && (f = a[h]); i++, h++) this.arrangeControl(f, {
left: c * i,
top: d * g
});
},
flowControl: function(a, b) {
this.inherited(arguments), enyo.Arranger.opacifyControl(a, b.top % this.colHeight != 0 ? .25 : 1);
},
calcArrangementDifference: function(a, b, c, d) {
return this.colWidth;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.avoidFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
avoidFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(a) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(a) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var a = this.controlParent || this;
return a.children;
},
getActive: function() {
var a = this.getPanels();
return a[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(a) {
this.setPropertyValue("index", a, "indexChanged");
},
setIndexDirect: function(a) {
this.setIndex(a), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(a) {
var b = this.getPanels().length - 1;
return this.wrap ? a : Math.max(0, Math.min(a, b));
},
indexChanged: function(a) {
this.lastIndex = a, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(a) {
this.fraction = a.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(a, b) {
if (this.draggable && this.layout && this.layout.canDragEvent(b)) return b.preventDefault(), this.dragstartTransition(b), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(a, b) {
this.dragging && (b.preventDefault(), this.dragTransition(b));
},
dragfinish: function(a, b) {
this.dragging && (this.dragging = !1, b.preventTap(), this.dragfinishTransition(b));
},
dragstartTransition: function(a) {
if (!this.$.animator.isAnimating()) {
var b = this.fromIndex = this.index;
this.toIndex = b - (this.layout ? this.layout.calcDragDirection(a) : 0);
} else this.verifyDragTransition(a);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(a) {
var b = this.layout ? this.layout.calcDrag(a) : 0, c = this.transitionPoints, d = c[0], e = c[c.length - 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e), h = this.layout ? this.layout.drag(b, d, f, e, g) : 0, i = b && !h;
!i, this.fraction += h;
var j = this.fraction;
if (j > 1 || j < 0 || i) (j > 0 || i) && this.dragfinishTransition(a), this.dragstartTransition(a), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(a) {
this.verifyDragTransition(a), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(a) {
var b = this.layout ? this.layout.calcDragDirection(a) : 0, c = Math.min(this.fromIndex, this.toIndex), d = Math.max(this.fromIndex, this.toIndex);
if (b > 0) {
var e = c;
c = d, d = e;
}
c != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = c, this.toIndex = d;
},
refresh: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var a = this.startTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.fromIndex || a.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var a = this.finishTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.lastIndex || a.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var a = this.transitionPoints, b = (this.fraction || 0) * (a.length - 1), c = Math.floor(b);
b -= c;
var d = a[c], e = a[c + 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e);
this.arrangement = f && g ? enyo.Panels.lerp(f, g, b) : f || g, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(a) {
return a != null && !this.arrangements[a] && this.layout && (this.layout._arrange(a), this.arrangements[a] = this.readArrangement(this.getPanels())), this.arrangements[a];
},
readArrangement: function(a) {
var b = [];
for (var c = 0, d = a, e; e = d[c]; c++) b.push(enyo.clone(e._arranger));
return b;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(a, b, c) {
var d = [];
for (var e = 0, f = enyo.keys(a), g; g = f[e]; e++) d.push(this.lerpObject(a[g], b[g], c));
return d;
},
lerpObject: function(a, b, c) {
var d = enyo.clone(a), e, f;
if (b) for (var g in a) e = a[g], f = b[g], e != f && (d[g] = e - (e - f) * c);
return d;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(a) {
this.destroyClientControls();
for (var b = 0, c; c = a[b]; b++) this.createComponent(c);
this.$.client.render();
},
addTextNodes: function(a) {
this.destroyClientControls();
for (var b = 0, c; c = a[b]; b++) this.createComponent({
content: c
});
this.$.client.render();
},
tap: function(a, b) {
return this.onlyIconExpands ? b.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(a, b) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var a = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -a
});
},
_expand: function() {
this.addClass("enyo-animate");
var a = this.$.client.getBounds().height;
this.$.box.setBounds({
height: a
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var a = this.$.client.getBounds().height;
this.$.box.setBounds({
height: a
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -a
});
}), 25);
},
expandedChanged: function(a) {
if (!this.expandable) this.expanded = !1; else {
var b = {
expanded: this.expanded
};
this.doExpand(b), b.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: ""
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged();
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
ondown: "downHandler",
onclick: ""
},
downHandler: function(a, b) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(a, b) {
return !this.disabled;
}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v"
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var a = this.orient == "v", b = a ? "height" : "width", c = a ? "top" : "left";
this.applyStyle(b, null);
var d = this.hasNode()[a ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : d,
endValue: this.open ? d : 0,
dimension: b,
position: c
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(a) {
if (this.hasNode()) {
var b = a.dimension;
this.node.style[b] = this.domStyles[b] = a.value + "px";
}
var c = this.$.client.hasNode();
if (c) {
var d = a.position, e = this.open ? a.endValue : a.startValue;
c.style[d] = this.$.client.domStyles[d] = a.value - e + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
this.open || this.$.client.hide(), this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(a) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var b = this.getScrim();
if (a) {
var c = this.getScrimZIndex();
this._scrimZ = c, b.showAtZIndex(c);
} else b.hideAtZIndex(this._scrimZ);
enyo.call(b, "addRemoveClass", [ this.scrimClassName, b.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var a = this.defaultZ;
return this._zIndex ? a = this._zIndex : this.hasNode() && (a = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || a), this._zIndex = a;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
receiveFocus: function() {
this.addClass("onyx-focused");
},
receiveBlur: function() {
this.removeClass("onyx-focused");
},
disabledChange: function(a, b) {
this.addRemoveClass("onyx-disabled", b.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
var b = this.node.getBoundingClientRect();
b.top + b.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), b.left + b.width > window.innerWidth && (this.applyPosition({
"margin-left": -b.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(a, b) {
this.requestHideTooltip(), b.originator.active && (this.menuActive = !0, this.activator = b.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(a) {
this.menuActive || this.inherited(arguments);
},
leave: function(a, b) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
showOnTop: !1,
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
itemActivated: function(a, b) {
return b.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.adjustPosition(!0);
},
requestMenuShow: function(a, b) {
if (this.floating) {
var c = b.activator.hasNode();
if (c) {
var d = this.activatorOffset = this.getPageOffset(c);
this.applyPosition({
top: d.top + (this.showOnTop ? 0 : d.height),
left: d.left,
width: d.width
});
}
}
return this.show(), !0;
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
getPageOffset: function(a) {
var b = a.getBoundingClientRect(), c = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, d = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, e = b.height === undefined ? b.bottom - b.top : b.height, f = b.width === undefined ? b.right - b.left : b.width;
return {
top: b.top + c,
left: b.left + d,
height: e,
width: f
};
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
left: "auto"
});
var b = this.node.getBoundingClientRect(), c = b.height === undefined ? b.bottom - b.top : b.height, d = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, e = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = b.top + c > d && d - b.bottom < b.top - c, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var f = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: f.top - c + (this.showOnTop ? f.height : 0),
bottom: "auto"
}) : b.top < f.top && f.top + (a ? f.height : 0) + c < d && this.applyPosition({
top: f.top + (this.showOnTop ? 0 : f.height),
bottom: "auto"
});
}
b.right > e && (this.floating ? this.applyPosition({
left: f.left - (b.left + b.width - e)
}) : this.applyPosition({
left: -(b.right - e)
}));
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition(!0);
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
tag: "div",
classes: "onyx-menu-item",
events: {
onSelect: ""
},
tap: function(a) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(a, b) {
this.waterfallDown("onChange", b);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(a, b) {
this.setContent(b.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null,
maxHeight: "200px"
},
events: {
onChange: ""
},
components: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
floating: !0,
showOnTop: !0,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.getScroller().setMaxHeight(this.maxHeight);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(a, b) {
return this.processActivatedItem(b.originator), this.inherited(arguments);
},
processActivatedItem: function(a) {
a.active && this.setSelected(a);
},
selectedChanged: function(a) {
a && a.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition(!1);
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "client",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var a = this.$.client.fetchRowNode(this.selected);
this.getScroller().scrollToNode(a, !this.menuUp);
},
countChanged: function() {
this.$.client.count = this.count;
},
processActivatedItem: function(a) {
this.item = a;
},
selectedChanged: function(a) {
if (!this.item) return;
a !== undefined && (this.item.removeClass("selected"), this.$.client.renderRow(a)), this.item.addClass("selected"), this.$.client.renderRow(this.selected), this.item.removeClass("selected");
var b = this.$.client.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: b && b.textContent || this.item.content
});
},
itemTap: function(a, b) {
this.setSelected(b.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(a, b) {
if (b.originator != this) return !0;
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
highlander: !0,
defaultKind: "onyx.RadioButton"
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.valueChanged();
},
valueChanged: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(a) {
this.disabled || (this.setValue(a), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = b.dx;
return Math.abs(c) > 10 && (this.updateValue(c > 0), this.dragged = !0), !0;
}
},
dragfinish: function(a, b) {
this.dragging = !1, this.dragged && b.preventTap();
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
handlers: {
onHide: "render"
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
var b = this.node.getBoundingClientRect();
b.top + b.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), b.left + b.width > window.innerWidth && (this.applyPosition({
"margin-left": -b.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(a) {
this.$.bar.removeClass(a), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var a = this.calcPercent(this.progress);
this.updateBarPosition(a);
},
clampValue: function(a, b, c) {
return Math.max(a, Math.min(c, b));
},
calcRatio: function(a) {
return (a - this.min) / (this.max - this.min);
},
calcPercent: function(a) {
return this.calcRatio(a) * 100;
},
updateBarPosition: function(a) {
this.$.bar.applyStyle("width", a + "%");
},
animateProgressTo: function(a) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: a,
node: this.hasNode()
});
},
progressAnimatorStep: function(a) {
return this.setProgress(a.value), !0;
},
progressAnimatorComplete: function(a) {
return this.doAnimateProgressFinish(a), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(a) {
enyo.indexOf(a, this.zStack) < 0 && this.zStack.push(a);
},
removeZIndex: function(a) {
enyo.remove(a, this.zStack);
},
showAtZIndex: function(a) {
this.addZIndex(a), a !== undefined && this.setZIndex(a), this.show();
},
hideAtZIndex: function(a) {
this.removeZIndex(a);
if (!this.zStack.length) this.hide(); else {
var b = this.zStack[this.zStack.length - 1];
this.setZIndex(b);
}
},
setZIndex: function(a) {
this.zIndex = a, this.applyStyle("z-index", a);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(a, b) {
this.instanceName = a, enyo.setObject(this.instanceName, this), this.props = b || {};
},
make: function() {
var a = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, a), a;
},
showAtZIndex: function(a) {
var b = this.make();
b.showAtZIndex(a);
},
hideAtZIndex: enyo.nop,
show: function() {
var a = this.make();
a.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var a = this.calcPercent(this.value);
this.updateKnobPosition(a), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(a) {
this.$.knob.applyStyle("left", a + "%");
},
calcKnobPosition: function(a) {
var b = a.clientX - this.hasNode().getBoundingClientRect().left;
return b / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = this.calcKnobPosition(b);
return this.setValue(c), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(a, b) {
return this.dragging = !1, b.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(a, b) {
if (this.tappable) {
var c = this.calcKnobPosition(b);
return this.tapped = !0, this.animateTo(c), !0;
}
},
animateTo: function(a) {
this.$.animator.play({
startValue: this.value,
endValue: a,
node: this.hasNode()
});
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(a), !0;
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(a, b) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
release: function(a, b) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
statics: {
addFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.setClassAttribute(a.getClassAttribute()) : a.addClass(b);
}), a.removeClass(b);
}
},
removeFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.removeClass(b) : a.setClassAttribute(a.getClassAttribute());
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
tools: [ {
name: "client",
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
classes: "onyx-more-menu",
prepend: !0
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(a, b) {
this.addRemoveClass("active", b.originator.active);
},
popItem: function() {
var a = this.findCollapsibleItem();
if (a) {
this.movedClass && this.movedClass.length > 0 && !a.hasClass(this.movedClass) && a.addClass(this.movedClass), this.$.menu.addChild(a);
var b = this.$.menu.hasNode();
return b && a.hasNode() && a.insertNodeInParent(b), !0;
}
},
pushItem: function() {
var a = this.$.menu.children, b = a[0];
if (b) {
this.movedClass && this.movedClass.length > 0 && b.hasClass(this.movedClass) && b.removeClass(this.movedClass), this.$.client.addChild(b);
var c = this.$.client.hasNode();
if (c && b.hasNode()) {
var d = undefined, e;
for (var f = 0; f < this.$.client.children.length; f++) {
var g = this.$.client.children[f];
if (g.toolbarIndex != undefined && g.toolbarIndex != f) {
d = g, e = f;
break;
}
}
if (d && d.hasNode()) {
b.insertNodeInParent(c, d.node);
var h = this.$.client.children.pop();
this.$.client.children.splice(e, 0, h);
} else b.appendNodeToParent(c);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var a = this.$.client.children, b = a[a.length - 1].hasNode();
if (b) return b.offsetLeft + b.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var a = this.$.client.children;
for (var b = a.length - 1; c = a[b]; b--) {
if (!c.unmoveable) return c;
c.toolbarIndex == undefined && (c.toolbarIndex = b);
}
}
});

// phonegap-events.js

(function() {
var a = [ "deviceready", "pause", "resume", "online", "offline", "backbutton", "batterycritical", "batterylow", "batterystatus", "menubutton", "searchbutton", "startcallbutton", "endcallbutton", "volumedownbutton", "volumeupbutton" ];
try {
(!window.cordova || !window.PhoneGap) && enyo.error("Phonegap needs to be loaded before enyo for events to attach correctly");
for (var b = 0, c, d; c = a[b]; b++) d = enyo.bind(enyo.Signals, "send", "on" + c), document.addEventListener(c, d, !1);
} catch (c) {}
})();

// ../data/1/tblClasses.js

var dbTableClasses = {};

dbTableClasses[1] = {
name: "A",
fullname: "A",
rank: 2,
helppage: "klasse_a",
maxallowedpoints: 10,
description: "Motorrad \u00fcber 50 ccm, ab 24 Jahre",
description_full: '<h2>Motorrad \u00fcber 50 cm\u00b3 oder \u00fcber 45 km/h</h2>\r\n\r\n<p>Kraftr\u00e4der (auch mit Beiwagen) mit einem Hubraum von mehr als 50 cm\u00b3 oder mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von mehr als 45 km/h</p>\r\n\r\n<p>Dreir\u00e4drige Kraftfahrzeuge mit einer Leistung von mehr als 15 kW und dreir\u00e4drige Kraftfahrzeuge mit symmetrisch angeordneten R\u00e4dern und einem Hubraum von mehr als 50 cm\u00b3 bei Verbrennungsmotoren oder einer bauartbedingten H\u00f6chstgeschwindigkeit von mehr als 45 km/h und mit einer Leistung von mehr als 15 kW</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">A2, A1, AM</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">24 Jahre (bei Direkteinstieg), 20 Jahre (bei mind. 2 Jahre Vorbesitz der Klasse A2)</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">60 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 468
}, dbTableClasses[2] = {
name: "A1",
fullname: "A1",
rank: 4,
helppage: "klasse_a1",
maxallowedpoints: 10,
description: "Motorrad bis 125 ccm Hubraum, ab 16 Jahre",
description_full: '<h2>Motorrad bis zu 125 cm\u00b3, max. 11 kW</h2>\r\n\r\n<p>Kraftr\u00e4der (auch mit Beiwagen) mit einem Hubraum von bis zu 125 cm\u00b3 und einer Motorleistung von nicht mehr als 11 kW, bei denen das Verh\u00e4ltnis der Leistung zum Gewicht 0,1 kW/ kg nicht \u00fcbersteigt.</p>\r\n\r\n<p>Dreir\u00e4drige Kraftfahrzeuge mit symmetrisch angeordneten R\u00e4dern und einem Hubraum von mehr als 50 cm\u00b3 bei Verbrennungsmotoren oder einer bauartbedingten H\u00f6chstgeschwindigkeit von mehr als 45 km/h und mit einer Leistung von bis zu 15 kW.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">AM</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">45 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 467
}, dbTableClasses[3] = {
name: "A2",
fullname: "A2",
rank: 3,
helppage: "klasse_a2",
maxallowedpoints: 10,
description: "Kraftrad bis 35 kW Motorleistung\r\n",
description_full: '<h2>Motorrad, Motorleistung max. 35 kW</h2>\r\n\r\n<p>Kraftr\u00e4der (auch mit Beiwagen) mit<br>\r\na) einer Motorleistung von nicht mehr als 35 kW und<br>\r\nb) einem Verh\u00e4ltnis der Leistung zum Gewicht von nicht mehr als 0,2 kW/kg,<br>\r\ndie nicht von einem Kraftrad mit einer Leistung von \u00fcber 70 kW Motorleistung abgeleitet sind.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">A1, AM</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">18 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">60 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 468
}, dbTableClasses[4] = {
name: "AM",
fullname: "AM",
rank: 5,
helppage: "klasse_am",
maxallowedpoints: 10,
description: "Klein-Kraftr\u00e4der mit Hilfsmotor bis 45 km/h\r\n- g\u00fcltig ab 19.01.2013",
description_full: '<h2>Zweir\u00e4drige Kleinkraftr\u00e4der bis 45 km/h</h2>\r\n<p>- Zweir\u00e4drige Kleinkraftr\u00e4der (auch mit Beiwagen) mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 45 km/h und einer elektrischen Antriebsmaschine oder einem Verbrennungsmotor mit einem Hubraum von nicht mehr als 50 cm\u00b3 oder einer maximalen Nenndauerleistung bis zu 4 kW im Falle von Elektromotoren,</p>\r\n\r\n<p>- Kraftr\u00e4der mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 45 km/h und einer elektrischen Antriebsmaschine oder einem Verbrennungsmotor mit einem Hubraum von nicht mehr als 50 cm\u00b3, die zus\u00e4tzlich hinsichtlich der Gebrauchsf\u00e4higkeit die Merkmale von Fahrr\u00e4dern aufweisen (Fahrr\u00e4der mit Hilfsmotor),</p>\r\n\r\n<p>- dreir\u00e4drige Kleinkraftr\u00e4der und vierr\u00e4drige Leichtkraftfahrzeuge jeweils mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 45 km/h und einem Hubraum von nicht mehr als 50 cm\u00b3 im Falle von Fremdz\u00fcndungsmotoren, einer maximalen Nutzleistung von nicht mehr als 4 kW im Falle anderer Verbrennungsmotoren oder einer maximalen Nenndauerleistung von nicht mehr als 4 kW im Falle von Elektromotoren;\r\n</p>\r\n\r\n<p>bei vierr\u00e4drigen Leichtkraftfahrzeugen darf dar\u00fcber hinaus die Leermasse nicht mehr als 350 kg betragen, ohne Masse der Batterien im Falle von Elektrofahrzeugen.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n2 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, keine Sonderfahrten</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">45 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 203
}, dbTableClasses[5] = {
name: "Mofa",
fullname: "Mofa",
rank: 50,
helppage: "klasse_mofa",
maxallowedpoints: 7,
description: "Mofa bis 25 km/h, ab 15 Jahre",
description_full: '<h2>Mofa bis 25 km/h</h2>\r\n\r\n<p>Einspurige Fahrr\u00e4der mit Hilfsmotor oder Kleinkraftr\u00e4der mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von maximal 25 km/h; mit Verbrennungsmotor bis 50 cm\u00b3 Hubraum oder Elektromotor (auch zweisitzig).</p>\r\n\r\n<p>Zweir\u00e4drige und dreir\u00e4drige Kraftfahrzeuge mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von maximal 25 km/h;<br>\r\nmit Verbrennungsmotor bis 50 cm\u00b3 Hubraum oder Elektromotor (auch zweisitzig).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">15 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden, spezieller Mofakurs</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">90 Minuten Grundausbildung</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">20 Fragen (15 Grund- und 5 Zusatzstoff)\r\n<br>\r\nmaximal 7 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">entf\u00e4llt</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_mofa.gif",
parent_class_id: null,
numberofquestions: 63
}, dbTableClasses[6] = {
name: "B",
fullname: "B (BE, B17, B96)",
rank: 1,
helppage: "klasse_b",
maxallowedpoints: 10,
description: "PKW bis 3 500 kg, ab 18 (17) Jahre",
description_full: '<h2>PKW bis 3 500 kg, ab 18 (17) Jahre</h2>\r\n\r\n<p>Kraftfahrzeuge - ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2 und A - mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 3 500 kg, die zur Bef\u00f6rderung von nicht mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg oder mit Anh\u00e4nger \u00fcber 750 kg zul\u00e4ssiger Gesamtmasse, sofern 3 500 kg zul\u00e4ssige Gesamtmasse der Kombination nicht \u00fcberschritten wird)</p>\r\n\r\n<p><b>BE - Theoriepr\u00fcfung entf\u00e4llt</b></p>\r\n<p><b>B96 - Theoriepr\u00fcfung entf\u00e4llt</b></p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">AM, L</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">18 Jahre, Begleitetes Fahren ab 17 Jahren</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n2 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">55 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_pkw.gif",
parent_class_id: null,
numberofquestions: 694
}, dbTableClasses[7] = {
name: "C",
fullname: "C",
rank: 20,
helppage: "klasse_c",
maxallowedpoints: 10,
description: "LKW \u00fcber 3 500 kg",
description_full: '<h2>LKW \u00fcber 3 500 kg, ab 21 Jahre</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2, A, mit einer zul\u00e4ssigen Gesamtmasse von mehr als 3 500 kg, die zur Bef\u00f6rderung von nicht mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">C1</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">21 Jahre, 18 Jahre in Sonderf\u00e4llen </td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n10 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten (B auf C):<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n2 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">37 Fragen (10 Grund- und 27 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_lkw.gif",
parent_class_id: null,
numberofquestions: 371
}, dbTableClasses[8] = {
name: "C1",
fullname: "C1 (C1E)",
rank: 22,
helppage: "klasse_c1",
maxallowedpoints: 10,
description: "LKW bis 7 500 kg, ab 18 Jahre",
description_full: '<h2>LKW bis 7 500 kg, ab 18 Jahre</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2 und A, mit einer zul\u00e4ssigen Gesamtmasse von mehr als 3 500 kg, aber nicht mehr als 7 500 kg, und die zur Bef\u00f6rderung von nicht mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">18 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n6 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n3 Fahrstunden \u00dcberland<br>\r\n1 Fahrstunden Autobahn<br>\r\n1 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (10 Grund- und 20 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_lkw.gif",
parent_class_id: null,
numberofquestions: 314
}, dbTableClasses[9] = {
name: "CE",
fullname: "CE",
rank: 21,
helppage: "klasse_ce",
maxallowedpoints: 10,
description: "LKW \u00fcber  3 500 kg und Anh\u00e4nger \u00fcber 750 kg",
description_full: '<h2>LKW \u00fcber 3 500 kg und Anh\u00e4nger \u00fcber 750 kg</h2>\r\n\r\n<p>Fahrzeugkombinationen, die aus einem Zugfahrzeug der Klasse C und Anh\u00e4ngern oder einem Sattelanh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von mehr als 750 kg bestehen.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">C</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">C1E, BE, T, bei Besitz von D: DE</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">21 Jahre, 18 Jahre in Sonderf\u00e4llen</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten (C auf CE):<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n2 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (10 Grund- und 20 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_lkw_ce.gif",
parent_class_id: null,
numberofquestions: 183
}, dbTableClasses[10] = {
name: "D",
fullname: "D (DE)",
rank: 30,
helppage: "klasse_d",
maxallowedpoints: 10,
description: "Bus mit mehr als 16 Fahrgastpl\u00e4tzen",
description_full: '<h2>Bus mit mehr als acht Personen</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2, A, die zur Bef\u00f6rderung von mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg)</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">D1</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">24 Jahre, 18 / 21 Jahre in Sonderf\u00e4llen</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\nBei Vorbesitz Klasse B:<br>\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n18 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\nBei Vorbesitz Klasse B, bis 2 Jahre Fahrpraxis:<br>\r\n45 Fahrstunden Grundausbildung<br>\r\n22 Fahrstunden \u00dcberland<br>\r\n14 Fahrstunden Autobahn<br>\r\n8 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">40 Fragen (10 Grund- und 30 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_bus.gif",
parent_class_id: null,
numberofquestions: 334
}, dbTableClasses[11] = {
name: "D1",
fullname: "D1 (D1E)",
rank: 31,
helppage: "klasse_d1",
maxallowedpoints: 10,
description: "Bus mit mehr als 8 aber h\u00f6chstens 16 Fahrgastpl\u00e4tzen",
description_full: '<h2>Bus mit bis zu 16 Personen</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2, A, die zur Bef\u00f6rderung von mehr als acht, aber nicht mehr als 16 Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind und deren L\u00e4nge nicht mehr als 8 m betr\u00e4gt (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">21 Jahre, 18 Jahre in Sonderf\u00e4llen</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\nBei Vorbesitz Klasse B:<br>\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n10 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\nBei Vorbesitz Klasse B, bis 2 Jahre Fahrpraxis:<br>\r\n41 Fahrstunden Grundausbildung<br>\r\n19 Fahrstunden \u00dcberland<br>\r\n12 Fahrstunden Autobahn<br>\r\n7 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">35 Fragen (10 Grund- und 25 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_bus.gif",
parent_class_id: null,
numberofquestions: 300
}, dbTableClasses[12] = {
name: "L",
fullname: "L",
rank: 40,
helppage: "klasse_l",
maxallowedpoints: 10,
description: "Traktor bis 40 km/h",
description_full: '<h2>Zugmaschinen mit max. 40 km/h</h2>\r\n\r\n<p>Zugmaschinen, die nach ihrer Bauart zur Verwendung f\u00fcr land- oder forstwirtschaftliche Zwecke bestimmt sind und f\u00fcr solche Zwecke eingesetzt werden, mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 40 km/h und Kombinationen aus diesen Fahrzeugen und Anh\u00e4ngern, wenn sie mit einer Geschwindigkeit von nicht mehr als 25 km/h gef\u00fchrt werden, sowie selbstfahrende Arbeitsmaschinen, selbstfahrende Futtermischwagen, Stapler und andere Flurf\u00f6rderzeuge jeweils mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 25 km/h und Kombinationen aus diesen Fahrzeugen und Anh\u00e4ngern.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n2 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Keine praktische Ausbildung erforderlich</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Praktische Pr\u00fcfung entf\u00e4llt</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_traktor.gif",
parent_class_id: null,
numberofquestions: 179
}, dbTableClasses[13] = {
name: "T",
fullname: "T",
rank: 41,
helppage: "klasse_t",
maxallowedpoints: 10,
description: "Traktor bis 60 km/h",
description_full: '<h2>Zugmaschinen mit max. 60 km/h</h2>\r\n\r\n<p>Zugmaschinen mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 60 km/h und selbstfahrende Arbeitsmaschinen oder selbstfahrende Futtermischwagen mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 40 km/h, die jeweils nach ihrer Bauart zur Verwendung f\u00fcr land- oder forstwirtschaftliche Zwecke bestimmt sind und f\u00fcr solche Zwecke eingesetzt werden (jeweils auch mit Anh\u00e4ngern).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">AM, L</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre f\u00fcr bis 40 km/h<br>\r\n18 Jahre f\u00fcr 40 km/h bis 60 km/h\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n6 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">60 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_traktor.gif",
parent_class_id: null,
numberofquestions: 253
}, dbTableClasses[15] = {
name: "A erw.",
fullname: "A erweitert",
rank: 101,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 1,
numberofquestions: 0
}, dbTableClasses[16] = {
name: "A1 erw.",
fullname: "A1 erweitert",
rank: 103,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 2,
numberofquestions: 0
}, dbTableClasses[17] = {
name: "A2 erw.",
fullname: "A2 erweitert",
rank: 102,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 3,
numberofquestions: 0
}, dbTableClasses[18] = {
name: "AM erw.",
fullname: "AM erweitert",
rank: 104,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 4,
numberofquestions: 0
}, dbTableClasses[19] = {
name: "B erw.",
fullname: "B erweitert",
rank: 100,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_pkw.gif",
parent_class_id: 6,
numberofquestions: 0
}, dbTableClasses[20] = {
name: "L erw.",
fullname: "L erweitert",
rank: 140,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_traktor.gif",
parent_class_id: 12,
numberofquestions: 0
}, dbTableClasses[21] = {
name: "T erw.",
fullname: "T erweitert",
rank: 141,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_traktor.gif",
parent_class_id: 13,
numberofquestions: 0
};

// ../data/2/tblClasses.js

var dbTableClasses = {};

dbTableClasses[1] = {
name: "A",
fullname: "A",
rank: 2,
helppage: "klasse_a",
maxallowedpoints: 10,
description: "Motorrad \u00fcber 50 ccm, ab 24 Jahre",
description_full: '<h2>Motorrad \u00fcber 50 cm\u00b3 oder \u00fcber 45 km/h</h2>\r\n\r\n<p>Kraftr\u00e4der (auch mit Beiwagen) mit einem Hubraum von mehr als 50 cm\u00b3 oder mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von mehr als 45 km/h</p>\r\n\r\n<p>Dreir\u00e4drige Kraftfahrzeuge mit einer Leistung von mehr als 15 kW und dreir\u00e4drige Kraftfahrzeuge mit symmetrisch angeordneten R\u00e4dern und einem Hubraum von mehr als 50 cm\u00b3 bei Verbrennungsmotoren oder einer bauartbedingten H\u00f6chstgeschwindigkeit von mehr als 45 km/h und mit einer Leistung von mehr als 15 kW</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">A2, A1, AM</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">24 Jahre (bei Direkteinstieg), 20 Jahre (bei mind. 2 Jahre Vorbesitz der Klasse A2)</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">60 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 468
}, dbTableClasses[2] = {
name: "A1",
fullname: "A1",
rank: 4,
helppage: "klasse_a1",
maxallowedpoints: 10,
description: "Motorrad bis 125 ccm Hubraum, ab 16 Jahre",
description_full: '<h2>Motorrad bis zu 125 cm\u00b3, max. 11 kW</h2>\r\n\r\n<p>Kraftr\u00e4der (auch mit Beiwagen) mit einem Hubraum von bis zu 125 cm\u00b3 und einer Motorleistung von nicht mehr als 11 kW, bei denen das Verh\u00e4ltnis der Leistung zum Gewicht 0,1 kW/ kg nicht \u00fcbersteigt.</p>\r\n\r\n<p>Dreir\u00e4drige Kraftfahrzeuge mit symmetrisch angeordneten R\u00e4dern und einem Hubraum von mehr als 50 cm\u00b3 bei Verbrennungsmotoren oder einer bauartbedingten H\u00f6chstgeschwindigkeit von mehr als 45 km/h und mit einer Leistung von bis zu 15 kW.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">AM</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">45 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 467
}, dbTableClasses[3] = {
name: "A2",
fullname: "A2",
rank: 3,
helppage: "klasse_a2",
maxallowedpoints: 10,
description: "Kraftrad bis 35 kW Motorleistung\r\n",
description_full: '<h2>Motorrad, Motorleistung max. 35 kW</h2>\r\n\r\n<p>Kraftr\u00e4der (auch mit Beiwagen) mit<br>\r\na) einer Motorleistung von nicht mehr als 35 kW und<br>\r\nb) einem Verh\u00e4ltnis der Leistung zum Gewicht von nicht mehr als 0,2 kW/kg,<br>\r\ndie nicht von einem Kraftrad mit einer Leistung von \u00fcber 70 kW Motorleistung abgeleitet sind.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">A1, AM</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">18 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">60 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 468
}, dbTableClasses[4] = {
name: "AM",
fullname: "AM",
rank: 5,
helppage: "klasse_am",
maxallowedpoints: 10,
description: "Klein-Kraftr\u00e4der mit Hilfsmotor bis 45 km/h\r\n- g\u00fcltig ab 19.01.2013",
description_full: '<h2>Zweir\u00e4drige Kleinkraftr\u00e4der bis 45 km/h</h2>\r\n<p>- Zweir\u00e4drige Kleinkraftr\u00e4der (auch mit Beiwagen) mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 45 km/h und einer elektrischen Antriebsmaschine oder einem Verbrennungsmotor mit einem Hubraum von nicht mehr als 50 cm\u00b3 oder einer maximalen Nenndauerleistung bis zu 4 kW im Falle von Elektromotoren,</p>\r\n\r\n<p>- Kraftr\u00e4der mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 45 km/h und einer elektrischen Antriebsmaschine oder einem Verbrennungsmotor mit einem Hubraum von nicht mehr als 50 cm\u00b3, die zus\u00e4tzlich hinsichtlich der Gebrauchsf\u00e4higkeit die Merkmale von Fahrr\u00e4dern aufweisen (Fahrr\u00e4der mit Hilfsmotor),</p>\r\n\r\n<p>- dreir\u00e4drige Kleinkraftr\u00e4der und vierr\u00e4drige Leichtkraftfahrzeuge jeweils mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 45 km/h und einem Hubraum von nicht mehr als 50 cm\u00b3 im Falle von Fremdz\u00fcndungsmotoren, einer maximalen Nutzleistung von nicht mehr als 4 kW im Falle anderer Verbrennungsmotoren oder einer maximalen Nenndauerleistung von nicht mehr als 4 kW im Falle von Elektromotoren;\r\n</p>\r\n\r\n<p>bei vierr\u00e4drigen Leichtkraftfahrzeugen darf dar\u00fcber hinaus die Leermasse nicht mehr als 350 kg betragen, ohne Masse der Batterien im Falle von Elektrofahrzeugen.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n2 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, keine Sonderfahrten</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">45 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_motorrad.gif",
parent_class_id: null,
numberofquestions: 203
}, dbTableClasses[5] = {
name: "Mofa",
fullname: "Mofa",
rank: 50,
helppage: "klasse_mofa",
maxallowedpoints: 7,
description: "Mofa bis 25 km/h, ab 15 Jahre",
description_full: '<h2>Mofa bis 25 km/h</h2>\r\n\r\n<p>Einspurige Fahrr\u00e4der mit Hilfsmotor oder Kleinkraftr\u00e4der mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von maximal 25 km/h; mit Verbrennungsmotor bis 50 cm\u00b3 Hubraum oder Elektromotor (auch zweisitzig).</p>\r\n\r\n<p>Zweir\u00e4drige und dreir\u00e4drige Kraftfahrzeuge mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von maximal 25 km/h;<br>\r\nmit Verbrennungsmotor bis 50 cm\u00b3 Hubraum oder Elektromotor (auch zweisitzig).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">15 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden, spezieller Mofakurs</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">90 Minuten Grundausbildung</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">20 Fragen (15 Grund- und 5 Zusatzstoff)\r\n<br>\r\nmaximal 7 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">entf\u00e4llt</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_mofa.gif",
parent_class_id: null,
numberofquestions: 63
}, dbTableClasses[6] = {
name: "B",
fullname: "B (BE, B17, B96)",
rank: 1,
helppage: "klasse_b",
maxallowedpoints: 10,
description: "PKW bis 3 500 kg, ab 18 (17) Jahre",
description_full: '<h2>PKW bis 3 500 kg, ab 18 (17) Jahre</h2>\r\n\r\n<p>Kraftfahrzeuge - ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2 und A - mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 3 500 kg, die zur Bef\u00f6rderung von nicht mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg oder mit Anh\u00e4nger \u00fcber 750 kg zul\u00e4ssiger Gesamtmasse, sofern 3 500 kg zul\u00e4ssige Gesamtmasse der Kombination nicht \u00fcberschritten wird)</p>\r\n\r\n<p><b>BE - Theoriepr\u00fcfung entf\u00e4llt</b></p>\r\n<p><b>B96 - Theoriepr\u00fcfung entf\u00e4llt</b></p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">AM, L</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">18 Jahre, Begleitetes Fahren ab 17 Jahren</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n2 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n4 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">55 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_pkw.gif",
parent_class_id: null,
numberofquestions: 694
}, dbTableClasses[7] = {
name: "C",
fullname: "C",
rank: 20,
helppage: "klasse_c",
maxallowedpoints: 10,
description: "LKW \u00fcber 3 500 kg",
description_full: '<h2>LKW \u00fcber 3 500 kg, ab 21 Jahre</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2, A, mit einer zul\u00e4ssigen Gesamtmasse von mehr als 3 500 kg, die zur Bef\u00f6rderung von nicht mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">C1</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">21 Jahre, 18 Jahre in Sonderf\u00e4llen </td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n10 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten (B auf C):<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n2 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">37 Fragen (10 Grund- und 27 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_lkw.gif",
parent_class_id: null,
numberofquestions: 371
}, dbTableClasses[8] = {
name: "C1",
fullname: "C1 (C1E)",
rank: 22,
helppage: "klasse_c1",
maxallowedpoints: 10,
description: "LKW bis 7 500 kg, ab 18 Jahre",
description_full: '<h2>LKW bis 7 500 kg, ab 18 Jahre</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2 und A, mit einer zul\u00e4ssigen Gesamtmasse von mehr als 3 500 kg, aber nicht mehr als 7 500 kg, und die zur Bef\u00f6rderung von nicht mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">18 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n6 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\n3 Fahrstunden \u00dcberland<br>\r\n1 Fahrstunden Autobahn<br>\r\n1 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (10 Grund- und 20 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_lkw.gif",
parent_class_id: null,
numberofquestions: 314
}, dbTableClasses[9] = {
name: "CE",
fullname: "CE",
rank: 21,
helppage: "klasse_ce",
maxallowedpoints: 10,
description: "LKW \u00fcber  3 500 kg und Anh\u00e4nger \u00fcber 750 kg",
description_full: '<h2>LKW \u00fcber 3 500 kg und Anh\u00e4nger \u00fcber 750 kg</h2>\r\n\r\n<p>Fahrzeugkombinationen, die aus einem Zugfahrzeug der Klasse C und Anh\u00e4ngern oder einem Sattelanh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von mehr als 750 kg bestehen.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">C</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">C1E, BE, T, bei Besitz von D: DE</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">21 Jahre, 18 Jahre in Sonderf\u00e4llen</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n4 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten (C auf CE):<br>\r\n5 Fahrstunden \u00dcberland<br>\r\n2 Fahrstunden Autobahn<br>\r\n3 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (10 Grund- und 20 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_lkw_ce.gif",
parent_class_id: null,
numberofquestions: 183
}, dbTableClasses[10] = {
name: "D",
fullname: "D (DE)",
rank: 30,
helppage: "klasse_d",
maxallowedpoints: 10,
description: "Bus mit mehr als 16 Fahrgastpl\u00e4tzen",
description_full: '<h2>Bus mit mehr als acht Personen</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2, A, die zur Bef\u00f6rderung von mehr als acht Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg)</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">D1</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">24 Jahre, 18 / 21 Jahre in Sonderf\u00e4llen</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\nBei Vorbesitz Klasse B:<br>\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n18 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\nBei Vorbesitz Klasse B, bis 2 Jahre Fahrpraxis:<br>\r\n45 Fahrstunden Grundausbildung<br>\r\n22 Fahrstunden \u00dcberland<br>\r\n14 Fahrstunden Autobahn<br>\r\n8 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">40 Fragen (10 Grund- und 30 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_bus.gif",
parent_class_id: null,
numberofquestions: 334
}, dbTableClasses[11] = {
name: "D1",
fullname: "D1 (D1E)",
rank: 31,
helppage: "klasse_d1",
maxallowedpoints: 10,
description: "Bus mit mehr als 8 aber h\u00f6chstens 16 Fahrgastpl\u00e4tzen",
description_full: '<h2>Bus mit bis zu 16 Personen</h2>\r\n\r\n<p>Kraftfahrzeuge, ausgenommen Kraftfahrzeuge der Klassen AM, A1, A2, A, die zur Bef\u00f6rderung von mehr als acht, aber nicht mehr als 16 Personen au\u00dfer dem Fahrzeugf\u00fchrer ausgelegt und gebaut sind und deren L\u00e4nge nicht mehr als 8 m betr\u00e4gt (auch mit Anh\u00e4nger mit einer zul\u00e4ssigen Gesamtmasse von nicht mehr als 750 kg).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">B</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">5 Jahre</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">21 Jahre, 18 Jahre in Sonderf\u00e4llen</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\nBei Vorbesitz Klasse B:<br>\r\n6 Doppelstunden Grundstoff\r\n<br>\r\n10 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung, Sonderfahrten:<br>\r\nBei Vorbesitz Klasse B, bis 2 Jahre Fahrpraxis:<br>\r\n41 Fahrstunden Grundausbildung<br>\r\n19 Fahrstunden \u00dcberland<br>\r\n12 Fahrstunden Autobahn<br>\r\n7 Fahrstunden bei Dunkelheit<br>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">35 Fragen (10 Grund- und 25 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">75 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_bus.gif",
parent_class_id: null,
numberofquestions: 300
}, dbTableClasses[12] = {
name: "L",
fullname: "L",
rank: 40,
helppage: "klasse_l",
maxallowedpoints: 10,
description: "Traktor bis 40 km/h",
description_full: '<h2>Zugmaschinen mit max. 40 km/h</h2>\r\n\r\n<p>Zugmaschinen, die nach ihrer Bauart zur Verwendung f\u00fcr land- oder forstwirtschaftliche Zwecke bestimmt sind und f\u00fcr solche Zwecke eingesetzt werden, mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 40 km/h und Kombinationen aus diesen Fahrzeugen und Anh\u00e4ngern, wenn sie mit einer Geschwindigkeit von nicht mehr als 25 km/h gef\u00fchrt werden, sowie selbstfahrende Arbeitsmaschinen, selbstfahrende Futtermischwagen, Stapler und andere Flurf\u00f6rderzeuge jeweils mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 25 km/h und Kombinationen aus diesen Fahrzeugen und Anh\u00e4ngern.</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">Keine</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n2 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Keine praktische Ausbildung erforderlich</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Praktische Pr\u00fcfung entf\u00e4llt</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_traktor.gif",
parent_class_id: null,
numberofquestions: 179
}, dbTableClasses[13] = {
name: "T",
fullname: "T",
rank: 41,
helppage: "klasse_t",
maxallowedpoints: 10,
description: "Traktor bis 60 km/h",
description_full: '<h2>Zugmaschinen mit max. 60 km/h</h2>\r\n\r\n<p>Zugmaschinen mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 60 km/h und selbstfahrende Arbeitsmaschinen oder selbstfahrende Futtermischwagen mit einer durch die Bauart bestimmten H\u00f6chstgeschwindigkeit von nicht mehr als 40 km/h, die jeweils nach ihrer Bauart zur Verwendung f\u00fcr land- oder forstwirtschaftliche Zwecke bestimmt sind und f\u00fcr solche Zwecke eingesetzt werden (jeweils auch mit Anh\u00e4ngern).</p>\r\n\r\n<table class="licenseclass">\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Vorbesitz:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Befristet:</td>\r\n<td class="content">Nein</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Einschluss<br>der Klassen:</td>\r\n<td class="content">AM, L</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Mindestalter:</td>\r\n<td class="content">16 Jahre f\u00fcr bis 40 km/h<br>\r\n18 Jahre f\u00fcr 40 km/h bis 60 km/h\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Ausbildung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">\r\n12 Doppelstunden Grundstoff\r\n<br>\r\n6 Doppelstunden Zusatzstoff</td>\r\n</tr>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">Grundausbildung</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<h3>Pr\u00fcfung</h3>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Theorie</td>\r\n<td class="content">30 Fragen (20 Grund- und 10 Zusatzstoff)\r\n<br>\r\nmaximal 10 Fehlerpunkte</td>\r\n<tr>\r\n<td class="category" style="font-weight: bold;">Praxis</td>\r\n<td class="content">60 Minuten</td>\r\n</tr>\r\n</tbody>\r\n</table>',
icon: "ico_traktor.gif",
parent_class_id: null,
numberofquestions: 253
}, dbTableClasses[15] = {
name: "A erw.",
fullname: "A erweitert",
rank: 101,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 1,
numberofquestions: 0
}, dbTableClasses[16] = {
name: "A1 erw.",
fullname: "A1 erweitert",
rank: 103,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 2,
numberofquestions: 0
}, dbTableClasses[17] = {
name: "A2 erw.",
fullname: "A2 erweitert",
rank: 102,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 3,
numberofquestions: 0
}, dbTableClasses[18] = {
name: "AM erw.",
fullname: "AM erweitert",
rank: 104,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_motorrad.gif",
parent_class_id: 4,
numberofquestions: 0
}, dbTableClasses[19] = {
name: "B erw.",
fullname: "B erweitert",
rank: 100,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_pkw.gif",
parent_class_id: 6,
numberofquestions: 0
}, dbTableClasses[20] = {
name: "L erw.",
fullname: "L erweitert",
rank: 140,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_traktor.gif",
parent_class_id: 12,
numberofquestions: 0
}, dbTableClasses[21] = {
name: "T erw.",
fullname: "T erweitert",
rank: 141,
helppage: "klasse_erweiterung",
maxallowedpoints: 6,
description: "",
description_full: "<p>Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.</p>\r\n    \r\n<p>In der Theoriepr\u00fcfung der Klassen B, A, A2, A1, AM, T und L werden bei einer Erweiterungspr\u00fcfung nur 10 anstatt 20 Fragen im Grundstoff gepr\u00fcft. Der Fragebogen f\u00fcr die Theoriepr\u00fcfung besteht somit aus nur 20 Fragen (10 Grundstoff und 10 Zusatzstoff), dabei sind maximal 6 Fehlerpunkte zul\u00e4ssig.</p>",
icon: "ico_traktor.gif",
parent_class_id: 13,
numberofquestions: 0
};

// ../data/1/tblCategories.js

function getCategoryTree1Date() {
return "2023-04-01";
}

function getCategoryTree1Data() {
return [ {
id: 1,
titles: {
DE: "Grundstoff",
GB: "Basic knowledge",
E: "Materia b\u00e1sica",
F: "Mati\u00e8re de base",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03ae \u03cd\u03bb\u03b7",
HR: "Osnovno \u0161tivo",
I: "Materiale di base",
P: "Mat\u00e9ria fundamental",
PL: "Materia\u0142 podstawowy",
RO: "Materia de baz\u0103",
RUS: "\u0411\u0430\u0437\u043e\u0432\u044b\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b",
TR: "Temel konular",
AR: "\u0627\u0644\u0645\u0627\u062f\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1",
questioncount: {
"1": 625,
"2": 625,
"3": 625,
"4": 625,
"5": 268,
"6": 625,
"7": 625,
"8": 625,
"9": 625,
"10": 625,
"11": 625,
"12": 625,
"13": 625,
"15": 625,
"16": 625,
"17": 625,
"18": 625,
"19": 625,
"20": 625,
"21": 625
},
subcategoryIds: [ 13, 2, 91, 41, 92, 37, 93 ],
children: [ {
id: 13,
titles: {
DE: "Gefahrenlehre",
GB: "Danger theory",
E: "Teor\u00eda del peligro",
F: "Th\u00e9orie des dangers",
GR: "\u0398\u03b5\u03c9\u03c1\u03af\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03bf\u03c5",
HR: "Teorija opasnosti",
I: "Teoria del pericolo",
P: "Teoria do perigo",
PL: "Teoria zagro\u017ce\u0144",
RO: "Teoria pericolului",
RUS: "\u0422\u0435\u043e\u0440\u0438\u044f \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
TR: "tehlike teorisi",
AR: "\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631"
},
basic: "1",
chapterLevelIndex: "1.1",
questioncount: {
"1": 175,
"2": 175,
"3": 175,
"4": 175,
"5": 80,
"6": 175,
"7": 175,
"8": 175,
"9": 175,
"10": 175,
"11": 175,
"12": 175,
"13": 175,
"15": 175,
"16": 175,
"17": 175,
"18": 175,
"19": 175,
"20": 175,
"21": 175
},
subcategoryIds: [ 49, 77, 35, 29, 45, 68, 26, 14, 112 ],
children: [ {
id: 49,
titles: {
DE: "Grundformen des Verkehrsverhaltens",
GB: "Basic forms of traffic behavior",
E: "Formas b\u00e1sicas de comportamiento del tr\u00e1fico",
F: "Formes de base du comportement routier",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03ad\u03c2 \u03bc\u03bf\u03c1\u03c6\u03ad\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ae\u03c2 \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac\u03c2",
HR: "Osnovni oblici pona\u0161anja u prometu",
I: "Forme di base del comportamento del traffico",
P: "Formas b\u00e1sicas de comportamento no tr\u00e2nsito",
PL: "Podstawowe formy zachowania w ruchu drogowym",
RO: "Forme de baz\u0103 ale comportamentului \u00een trafic",
RUS: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0444\u043e\u0440\u043c\u044b \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435",
TR: "Temel trafik davran\u0131\u015f\u0131 bi\u00e7imleri",
AR: "\u0627\u0644\u0623\u0634\u0643\u0627\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0631\u0648\u0631\u064a"
},
basic: "1",
chapterLevelIndex: "1.1.1",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 4,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 77,
titles: {
DE: "Verhalten gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior towards pedestrians",
E: "Comportamiento con los peatones",
F: "Comportement vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03ad\u03bd\u03b1\u03bd\u03c4\u03b9 \u03c4\u03c9\u03bd \u03c0\u03b5\u03b6\u03ce\u03bd",
HR: "Pona\u0161anje prema pje\u0161acima",
I: "Comportamento verso i pedoni",
P: "Comportamento para com os pe\u00f5es",
PL: "Zachowanie wobec pieszych",
RO: "Comportamentul fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u062a\u062c\u0627\u0647 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.2",
questioncount: {
"1": 38,
"2": 38,
"3": 38,
"4": 38,
"5": 27,
"6": 38,
"7": 38,
"8": 38,
"9": 38,
"10": 38,
"11": 38,
"12": 38,
"13": 38,
"15": 38,
"16": 38,
"17": 38,
"18": 38,
"19": 38,
"20": 38,
"21": 38
},
subcategoryIds: [],
children: []
}, {
id: 35,
titles: {
DE: "Fahrbahn- und Witterungsverh\u00e4ltnisse",
GB: "Road and weather conditions",
E: "Condiciones de la carretera y del tiempo",
F: "Conditions de la chauss\u00e9e et conditions m\u00e9t\u00e9orologiques",
GR: "\u039f\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03b9\u03c1\u03b9\u03ba\u03ad\u03c2 \u03c3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b5\u03c2",
HR: "Cestovni i vremenski uvjeti",
I: "Condizioni stradali e meteorologiche",
P: "Condi\u00e7\u00f5es rodovi\u00e1rias e meteorol\u00f3gicas",
PL: "Warunki drogowe i pogodowe",
RO: "Condi\u021bii rutiere \u0219i meteorologice",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0438 \u043f\u043e\u0433\u043e\u0434\u043d\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f",
TR: "Yol ve hava ko\u015fullar\u0131",
AR: "\u0623\u062d\u0648\u0627\u0644 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0637\u0642\u0633"
},
basic: "1",
chapterLevelIndex: "1.1.3",
questioncount: {
"1": 17,
"2": 17,
"3": 17,
"4": 17,
"5": 4,
"6": 17,
"7": 17,
"8": 17,
"9": 17,
"10": 17,
"11": 17,
"12": 17,
"13": 17,
"15": 17,
"16": 17,
"17": 17,
"18": 17,
"19": 17,
"20": 17,
"21": 17
},
subcategoryIds: [],
children: []
}, {
id: 29,
titles: {
DE: "Dunkelheit und schlechte Sicht",
GB: "Darkness and poor visibility",
E: "Oscuridad y poca visibilidad",
F: "Obscurit\u00e9 et mauvaise visibilit\u00e9",
GR: "\u03a3\u03ba\u03bf\u03c4\u03ac\u03b4\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03ba\u03ae \u03bf\u03c1\u03b1\u03c4\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Mrak i slab vid",
I: "Buio e scarsa visibilit\u00e0",
P: "Escurid\u00e3o e m\u00e1 visibilidade",
PL: "Ciemno\u015b\u0107 i s\u0142aba widoczno\u015b\u0107",
RO: "\u00centuneric \u0219i vizibilitate redus\u0103",
RUS: "\u0422\u0435\u043c\u043d\u043e\u0442\u0430 \u0438 \u043f\u043b\u043e\u0445\u0430\u044f \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c",
TR: "Karanl\u0131k ve zay\u0131f g\u00f6r\u00fc\u015f",
AR: "\u0627\u0644\u0638\u0644\u0627\u0645 \u0648\u0636\u0639\u0641 \u0627\u0644\u0631\u0624\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.4",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"6": 5,
"7": 5,
"8": 5,
"9": 5,
"10": 5,
"11": 5,
"12": 5,
"13": 5,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 5,
"20": 5,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 45,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.5",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 6,
"5": 4,
"6": 6,
"7": 6,
"8": 6,
"9": 6,
"10": 6,
"11": 6,
"12": 6,
"13": 6,
"15": 6,
"16": 6,
"17": 6,
"18": 6,
"19": 6,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 68,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "1",
chapterLevelIndex: "1.1.6",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 4,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 26,
titles: {
DE: "Besondere Verkehrssituationen",
GB: "Special traffic scenarios",
E: "Situaciones especiales de tr\u00e1fico",
F: "Situations de circulation particuli\u00e8res",
GR: "\u0395\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Posebne prometne situacije",
I: "Situazioni speciali di traffico",
P: "Situa\u00e7\u00f5es especiais de tr\u00e1fego",
PL: "Szczeg\u00f3lne sytuacje w ruchu drogowym",
RO: "Situa\u021bii speciale de trafic",
RUS: "\u041e\u0441\u043e\u0431\u044b\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
TR: "\u00d6zel trafik durumlar\u0131",
AR: "\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062e\u0627\u0635\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.7",
questioncount: {
"1": 62,
"2": 62,
"3": 62,
"4": 62,
"5": 20,
"6": 62,
"7": 62,
"8": 62,
"9": 62,
"10": 62,
"11": 62,
"12": 62,
"13": 62,
"15": 62,
"16": 62,
"17": 62,
"18": 62,
"19": 62,
"20": 62,
"21": 62
},
subcategoryIds: [],
children: []
}, {
id: 14,
titles: {
DE: "Alkohol, Drogen, Medikamente",
GB: "Alcohol, drugs, medication",
E: "Alcohol, drogas, medicamentos",
F: "Alcool, drogues, m\u00e9dicaments",
GR: "\u0391\u03bb\u03ba\u03bf\u03cc\u03bb, \u03bd\u03b1\u03c1\u03ba\u03c9\u03c4\u03b9\u03ba\u03ac, \u03c6\u03ac\u03c1\u03bc\u03b1\u03ba\u03b1",
HR: "Alkohol, droge, lijekovi",
I: "Alcool, droghe, farmaci",
P: "\u00c1lcool, drogas, medicamentos",
PL: "Alkohol, narkotyki, leki",
RO: "Alcool, droguri, medicamente",
RUS: "\u0410\u043b\u043a\u043e\u0433\u043e\u043b\u044c, \u043d\u0430\u0440\u043a\u043e\u0442\u0438\u043a\u0438, \u043b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0430",
TR: "Alkol, uyu\u015fturucu, ila\u00e7",
AR: "\u0627\u0644\u0643\u062d\u0648\u0644 \u0648\u0627\u0644\u0645\u062e\u062f\u0631\u0627\u062a \u0648\u0627\u0644\u0623\u062f\u0648\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.9",
questioncount: {
"1": 18,
"2": 18,
"3": 18,
"4": 18,
"5": 16,
"6": 18,
"7": 18,
"8": 18,
"9": 18,
"10": 18,
"11": 18,
"12": 18,
"13": 18,
"15": 18,
"16": 18,
"17": 18,
"18": 18,
"19": 18,
"20": 18,
"21": 18
},
subcategoryIds: [],
children: []
}, {
id: 112,
titles: {
DE: "Erm\u00fcdung, Ablenkung",
GB: "Fatigue, distraction",
E: "Fatiga, distracci\u00f3n",
F: "Fatigue, distraction",
GR: "\u039a\u03cc\u03c0\u03c9\u03c3\u03b7, \u03b1\u03c0\u03cc\u03c3\u03c0\u03b1\u03c3\u03b7 \u03c0\u03c1\u03bf\u03c3\u03bf\u03c7\u03ae\u03c2",
HR: "Umor, rastresenost",
I: "Fatica, distrazione",
P: "Fadiga, distrac\u00e7\u00e3o",
PL: "Zm\u0119czenie, rozproszenie uwagi",
RO: "Oboseal\u0103, distragere a aten\u021biei",
RUS: "\u0423\u0441\u0442\u0430\u043b\u043e\u0441\u0442\u044c, \u0440\u0430\u0441\u0441\u0435\u044f\u043d\u043d\u043e\u0441\u0442\u044c",
TR: "Yorgunluk, dikkat da\u011f\u0131n\u0131kl\u0131\u011f\u0131",
AR: "\u0627\u0644\u062a\u0639\u0628 \u0648\u0627\u0644\u0625\u0644\u0647\u0627\u0621"
},
basic: "1",
chapterLevelIndex: "1.1.10",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 2,
titles: {
DE: "Verhalten im Stra\u00dfenverkehr",
GB: "Behavior in road traffic",
E: "Comportamiento en el tr\u00e1fico rodado",
F: "Comportement dans la circulation routi\u00e8re",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1",
HR: "Pona\u0161anje u prometu",
I: "Comportamento nel traffico stradale",
P: "Comportamento no tr\u00e1fego rodovi\u00e1rio",
PL: "Zachowanie w ruchu drogowym",
RO: "Comportamentul \u00een traficul rutier",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438",
TR: "trafikte davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "1",
chapterLevelIndex: "1.2",
questioncount: {
"1": 230,
"2": 230,
"3": 230,
"4": 230,
"5": 100,
"6": 230,
"7": 230,
"8": 230,
"9": 230,
"10": 230,
"11": 230,
"12": 230,
"13": 230,
"15": 230,
"16": 230,
"17": 230,
"18": 230,
"19": 230,
"20": 230,
"21": 230
},
subcategoryIds: [ 51, 66, 46, 9, 69, 82, 23, 3, 32, 25, 52, 85, 21, 19, 58, 54, 63, 75, 73, 89, 87, 28 ],
children: [ {
id: 51,
titles: {
DE: "Grundregeln \u00fcber das Verhalten im Stra\u00dfenverkehr",
GB: "Basic rules of behaviour in traffic",
E: "Normas b\u00e1sicas de comportamiento en carretera",
F: "R\u00e8gles de base sur le comportement dans la circulation routi\u00e8re",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03bf\u03af \u03ba\u03b1\u03bd\u03cc\u03bd\u03b5\u03c2 \u03bf\u03b4\u03b9\u03ba\u03ae\u03c2 \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac\u03c2",
HR: "Osnovna pravila pona\u0161anja u prometu",
I: "Regole di base del comportamento stradale",
P: "Regras b\u00e1sicas de comportamento na estrada",
PL: "Podstawowe zasady zachowania na drodze",
RO: "Reguli de baz\u0103 ale comportamentului rutier",
RUS: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u0430 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435",
TR: "Trafikte davran\u0131\u015fla ilgili temel kurallar",
AR: "\u0627\u0644\u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0633\u0644\u0648\u0643 \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "1",
chapterLevelIndex: "1.2.1",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"4": 2,
"5": 2,
"6": 2,
"7": 2,
"8": 2,
"9": 2,
"10": 2,
"11": 2,
"12": 2,
"13": 2,
"15": 2,
"16": 2,
"17": 2,
"18": 2,
"19": 2,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 66,
titles: {
DE: "Stra\u00dfenbenutzung",
GB: "Road use",
E: "Uso de la carretera",
F: "Utilisation de la route",
GR: "\u039f\u03b4\u03b9\u03ba\u03ae \u03c7\u03c1\u03ae\u03c3\u03b7",
HR: "Kori\u0161tenje cesta",
I: "Uso della strada",
P: "Utiliza\u00e7\u00e3o da estrada",
PL: "U\u017cytkowanie dr\u00f3g",
RO: "Utilizarea drumurilor",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0433",
TR: "Yol kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0637\u0631\u064a\u0642"
},
basic: "1",
chapterLevelIndex: "1.2.2",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 8,
"5": 4,
"6": 8,
"7": 8,
"8": 8,
"9": 8,
"10": 8,
"11": 8,
"12": 8,
"13": 8,
"15": 8,
"16": 8,
"17": 8,
"18": 8,
"19": 8,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 46,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.3",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 8,
"5": 2,
"6": 8,
"7": 8,
"8": 8,
"9": 8,
"10": 8,
"11": 8,
"12": 8,
"13": 8,
"15": 8,
"16": 8,
"17": 8,
"18": 8,
"19": 8,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 9,
titles: {
DE: "Abstand",
GB: "Distance",
E: "Distancia",
F: "Distance",
GR: "\u0391\u03c0\u03cc\u03c3\u03c4\u03b1\u03c3\u03b7",
HR: "udaljenosti",
I: "Distanza",
P: "Dist\u00e2ncia",
PL: "Odleg\u0142o\u015b\u0107",
RO: "Distan\u021ba",
RUS: "\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435",
TR: "mesafe",
AR: "\u0645\u0633\u0627\u0641\u0647: \u0628\u0639\u062f"
},
basic: "1",
chapterLevelIndex: "1.2.4",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 3,
"6": 3,
"7": 3,
"8": 3,
"9": 3,
"10": 3,
"11": 3,
"12": 3,
"13": 3,
"15": 3,
"16": 3,
"17": 3,
"18": 3,
"19": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 69,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "1",
chapterLevelIndex: "1.2.5",
questioncount: {
"1": 19,
"2": 19,
"3": 19,
"4": 19,
"5": 4,
"6": 19,
"7": 19,
"8": 19,
"9": 19,
"10": 19,
"11": 19,
"12": 19,
"13": 19,
"15": 19,
"16": 19,
"17": 19,
"18": 19,
"19": 19,
"20": 19,
"21": 19
},
subcategoryIds: [],
children: []
}, {
id: 82,
titles: {
DE: "Vorbeifahren",
GB: "Pass by",
E: "Pasando por",
F: "Passage des v\u00e9hicules",
GR: "\u03a0\u03b5\u03c1\u03bd\u03ce\u03bd\u03c4\u03b1\u03c2",
HR: "Vozite mimo",
I: "Passaggio",
P: "Aprova\u00e7\u00e3o",
PL: "Passing",
RO: "Trecere",
RUS: "\u041f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435",
TR: "ge\u00e7mi\u015f s\u00fcr\u00fcc\u00fc",
AR: "\u0642\u0645 \u0628\u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0641\u064a \u0627\u0644\u0645\u0627\u0636\u064a"
},
basic: "1",
chapterLevelIndex: "1.2.6",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 3,
"5": 1,
"6": 3,
"7": 3,
"8": 3,
"9": 3,
"10": 3,
"11": 3,
"12": 3,
"13": 3,
"15": 3,
"16": 3,
"17": 3,
"18": 3,
"19": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 23,
titles: {
DE: "Benutzung von Fahrstreifen durch Kraftfahrzeuge",
GB: "Use of lanes by motor vehicles",
E: "Uso de los carriles por parte de los veh\u00edculos de motor",
F: "Utilisation des voies de circulation par les v\u00e9hicules \u00e0 moteur",
GR: "\u03a7\u03c1\u03ae\u03c3\u03b7 \u03bb\u03c9\u03c1\u03af\u03b4\u03c9\u03bd \u03b1\u03c0\u03cc \u03bc\u03b7\u03c7\u03b1\u03bd\u03bf\u03ba\u03af\u03bd\u03b7\u03c4\u03b1 \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03b1",
HR: "Kori\u0161tenje traka za motorna vozila",
I: "Uso delle corsie da parte dei veicoli a motore",
P: "Utiliza\u00e7\u00e3o das faixas pelos ve\u00edculos autom\u00f3veis",
PL: "Wykorzystanie pas\u00f3w ruchu przez pojazdy silnikowe",
RO: "Utilizarea benzilor de circula\u021bie de c\u0103tre autovehicule",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u043e\u0441 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f \u0430\u0432\u0442\u043e\u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043e\u043c",
TR: "Motorlu ara\u00e7lar\u0131n \u015ferit kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0645\u0631\u0627\u062a \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a"
},
basic: "1",
chapterLevelIndex: "1.2.7",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 6,
"5": 1,
"6": 6,
"7": 6,
"8": 6,
"9": 6,
"10": 6,
"11": 6,
"12": 6,
"13": 6,
"15": 6,
"16": 6,
"17": 6,
"18": 6,
"19": 6,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 3,
titles: {
DE: "Abbiegen, Wenden und R\u00fcckw\u00e4rtsfahren",
GB: "Turning, U-turning and reversing",
E: "Girar, dar vueltas y retroceder",
F: "Tourner, faire demi-tour et reculer",
GR: "\u03a3\u03c4\u03c1\u03bf\u03c6\u03ae, \u03c3\u03c4\u03c1\u03bf\u03c6\u03ae \u03ba\u03b1\u03b9 \u03b1\u03bd\u03b1\u03c3\u03c4\u03c1\u03bf\u03c6\u03ae",
HR: "Okretanje, okretanje i rikverc",
I: "Girare, girare e fare retromarcia",
P: "Torneamento, viragem e invers\u00e3o de marcha",
PL: "Skr\u0119canie, zawracanie i cofanie",
RO: "\u00centoarcerea, \u00eentoarcerea \u0219i mersul \u00eenapoi",
RUS: "\u041f\u043e\u0432\u043e\u0440\u043e\u0442, \u0440\u0430\u0437\u0432\u043e\u0440\u043e\u0442 \u0438 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435 \u0437\u0430\u0434\u043d\u0438\u043c \u0445\u043e\u0434\u043e\u043c",
TR: "D\u00f6nd\u00fcrme, d\u00f6nd\u00fcrme ve geri \u00e7evirme",
AR: "\u0627\u0644\u062f\u0648\u0631\u0627\u0646 \u0648\u0627\u0644\u0627\u0646\u0639\u0637\u0627\u0641 \u0648\u0627\u0644\u0639\u0643\u0633"
},
basic: "1",
chapterLevelIndex: "1.2.9",
questioncount: {
"1": 32,
"2": 32,
"3": 32,
"4": 32,
"5": 15,
"6": 32,
"7": 32,
"8": 32,
"9": 32,
"10": 32,
"11": 32,
"12": 32,
"13": 32,
"15": 32,
"16": 32,
"17": 32,
"18": 32,
"19": 32,
"20": 32,
"21": 32
},
subcategoryIds: [],
children: []
}, {
id: 32,
titles: {
DE: "Einfahren und Anfahren",
GB: "Run-in and start-up",
E: "Entrar y arrancar",
F: "Entr\u00e9e et d\u00e9marrage",
GR: "\u0395\u03af\u03c3\u03bf\u03b4\u03bf\u03c2 \u03ba\u03b1\u03b9 \u03b5\u03ba\u03ba\u03af\u03bd\u03b7\u03c3\u03b7",
HR: "Uhodavanje i pokretanje",
I: "Entrare e iniziare",
P: "Entrada e arranque",
PL: "Wprowadzanie i uruchamianie",
RO: "Intrarea \u0219i pornirea",
RUS: "\u0412\u0445\u043e\u0434 \u0438 \u0437\u0430\u043f\u0443\u0441\u043a",
TR: "\u00c7al\u0131\u015ft\u0131rma ve \u00e7al\u0131\u015ft\u0131rma",
AR: "\u0627\u0644\u062a\u0634\u063a\u064a\u0644 \u0648\u0628\u062f\u0621 \u0627\u0644\u062a\u0634\u063a\u064a\u0644"
},
basic: "1",
chapterLevelIndex: "1.2.10",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 8,
"5": 5,
"6": 8,
"7": 8,
"8": 8,
"9": 8,
"10": 8,
"11": 8,
"12": 8,
"13": 8,
"15": 8,
"16": 8,
"17": 8,
"18": 8,
"19": 8,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 25,
titles: {
DE: "Besondere Verkehrslagen",
GB: "Special traffic scenarios",
E: "Situaciones especiales de tr\u00e1fico",
F: "Situations de circulation particuli\u00e8res",
GR: "\u0395\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Posebne prometne situacije",
I: "Situazioni speciali di traffico",
P: "Situa\u00e7\u00f5es especiais de tr\u00e1fego",
PL: "Szczeg\u00f3lne sytuacje w ruchu drogowym",
RO: "Situa\u021bii speciale de trafic",
RUS: "\u041e\u0441\u043e\u0431\u044b\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
TR: "\u00d6zel trafik durumlar\u0131",
AR: "\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062e\u0627\u0635\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.11",
questioncount: {
"1": 11,
"2": 11,
"3": 11,
"4": 11,
"5": 6,
"6": 11,
"7": 11,
"8": 11,
"9": 11,
"10": 11,
"11": 11,
"12": 11,
"13": 11,
"15": 11,
"16": 11,
"17": 11,
"18": 11,
"19": 11,
"20": 11,
"21": 11
},
subcategoryIds: [],
children: []
}, {
id: 52,
titles: {
DE: "Halten und Parken",
GB: "Stopping and parking",
E: "Parada y estacionamiento",
F: "Arr\u00eat et stationnement",
GR: "\u03a3\u03c4\u03ac\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c4\u03ac\u03b8\u03bc\u03b5\u03c5\u03c3\u03b7",
HR: "Zaustavite se i parkirajte",
I: "Sosta e parcheggio",
P: "Paragem e estacionamento",
PL: "Zatrzymanie i parkowanie",
RO: "Oprire \u0219i parcare",
RUS: "\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0438 \u0441\u0442\u043e\u044f\u043d\u043a\u0430",
TR: "Dur ve park et",
AR: "\u062a\u0648\u0642\u0641 \u0648\u062a\u0648\u0642\u0641"
},
basic: "1",
chapterLevelIndex: "1.2.12",
questioncount: {
"1": 22,
"2": 22,
"3": 22,
"4": 22,
"5": 2,
"6": 22,
"7": 22,
"8": 22,
"9": 22,
"10": 22,
"11": 22,
"12": 22,
"13": 22,
"15": 22,
"16": 22,
"17": 22,
"18": 22,
"19": 22,
"20": 22,
"21": 22
},
subcategoryIds: [],
children: []
}, {
id: 85,
titles: {
DE: "Warnzeichen",
GB: "Warning sign",
E: "Se\u00f1al de advertencia",
F: "Signes d'avertissement",
GR: "\u03a0\u03c1\u03bf\u03b5\u03b9\u03b4\u03bf\u03c0\u03bf\u03b9\u03b7\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "znak upozorenja",
I: "Segnale di avvertimento",
P: "Sinal de advert\u00eancia",
PL: "Znak ostrzegawczy",
RO: "Semn de avertizare",
RUS: "\u041f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0430\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "Uyar\u0131 i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062a\u062d\u0630\u064a\u0631"
},
basic: "1",
chapterLevelIndex: "1.2.16",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"5": 1,
"6": 5,
"7": 5,
"8": 5,
"9": 5,
"10": 5,
"11": 5,
"12": 5,
"13": 5,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 5,
"20": 5,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 21,
titles: {
DE: "Beleuchtung",
GB: "Lighting",
E: "Iluminaci\u00f3n",
F: "\u00c9clairage",
GR: "\u03a6\u03c9\u03c4\u03b9\u03c3\u03bc\u03cc\u03c2",
HR: "rasvjeta",
I: "Illuminazione",
P: "Ilumina\u00e7\u00e3o",
PL: "O\u015bwietlenie",
RO: "Iluminat",
RUS: "\u041e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u0435",
TR: "ayd\u0131nlatma",
AR: "\u0625\u0636\u0627\u0621\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.17",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"4": 2,
"5": 1,
"6": 2,
"7": 2,
"8": 2,
"9": 2,
"10": 2,
"11": 2,
"12": 2,
"13": 2,
"15": 2,
"16": 2,
"17": 2,
"18": 2,
"19": 2,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 19,
titles: {
DE: "Bahn\u00fcberg\u00e4nge",
GB: "Level Crossings",
E: "Pasos a nivel",
F: "Passages \u00e0 niveau",
GR: "\u0399\u03c3\u03cc\u03c0\u03b5\u03b4\u03b5\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2",
HR: "Prijelazi preko razine",
I: "Passaggi a livello",
P: "Passagens de n\u00edvel",
PL: "Przejazdy kolejowe",
RO: "Trecerile la nivel",
RUS: "\u041f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u044f \u0443\u0440\u043e\u0432\u043d\u0435\u0439",
TR: "hemzemin ge\u00e7itler",
AR: "\u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0633\u062a\u0648\u0649"
},
basic: "1",
chapterLevelIndex: "1.2.19",
questioncount: {
"1": 18,
"2": 18,
"3": 18,
"4": 18,
"5": 5,
"6": 18,
"7": 18,
"8": 18,
"9": 18,
"10": 18,
"11": 18,
"12": 18,
"13": 18,
"15": 18,
"16": 18,
"17": 18,
"18": 18,
"19": 18,
"20": 18,
"21": 18
},
subcategoryIds: [],
children: []
}, {
id: 58,
titles: {
DE: "\u00d6ffentliche Verkehrsmittel und Schulbusse",
GB: "Public transport and school buses",
E: "Transporte p\u00fablico y autobuses escolares",
F: "Transports publics et bus scolaires",
GR: "\u0394\u03b7\u03bc\u03cc\u03c3\u03b9\u03b5\u03c2 \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03c3\u03c7\u03bf\u03bb\u03b9\u03ba\u03ac \u03bb\u03b5\u03c9\u03c6\u03bf\u03c1\u03b5\u03af\u03b1",
HR: "Javni prijevoz i \u0161kolski autobusi",
I: "Trasporto pubblico e scuolabus",
P: "Transportes p\u00fablicos e autocarros escolares",
PL: "Transport publiczny i autobusy szkolne",
RO: "Transport public \u0219i autobuze \u0219colare",
RUS: "\u041e\u0431\u0449\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442 \u0438 \u0448\u043a\u043e\u043b\u044c\u043d\u044b\u0435 \u0430\u0432\u0442\u043e\u0431\u0443\u0441\u044b",
TR: "Toplu ta\u015f\u0131ma ve okul otob\u00fcsleri",
AR: "\u0627\u0644\u0646\u0642\u0644 \u0627\u0644\u0639\u0627\u0645 \u0648\u0627\u0644\u062d\u0627\u0641\u0644\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.20",
questioncount: {
"1": 9,
"2": 9,
"3": 9,
"4": 9,
"5": 7,
"6": 9,
"7": 9,
"8": 9,
"9": 9,
"10": 9,
"11": 9,
"12": 9,
"13": 9,
"15": 9,
"16": 9,
"17": 9,
"18": 9,
"19": 9,
"20": 9,
"21": 9
},
subcategoryIds: [],
children: []
}, {
id: 54,
titles: {
DE: "Ladung",
GB: "Cargo",
E: "Carga",
F: "Chargement",
GR: "\u03a6\u03bf\u03c1\u03c4\u03af\u03bf",
HR: "naplatiti",
I: "Carico",
P: "Carga",
PL: "Obci\u0105\u017cenie",
RO: "\u00cenc\u0103rcare",
RUS: "\u041d\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
TR: "\u015farj etmek",
AR: "\u0627\u0644\u0634\u062d\u0646\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.22",
questioncount: {
"1": 7,
"2": 7,
"3": 7,
"4": 7,
"6": 7,
"7": 7,
"8": 7,
"9": 7,
"10": 7,
"11": 7,
"12": 7,
"13": 7,
"15": 7,
"16": 7,
"17": 7,
"18": 7,
"19": 7,
"20": 7,
"21": 7
},
subcategoryIds: [],
children: []
}, {
id: 63,
titles: {
DE: "Sonstige Pflichten des Fahrzeugf\u00fchrers",
GB: "Other duties of the driver",
E: "Otras funciones del conductor",
F: "Autres obligations du conducteur",
GR: "\u0386\u03bb\u03bb\u03b1 \u03ba\u03b1\u03b8\u03ae\u03ba\u03bf\u03bd\u03c4\u03b1 \u03c4\u03bf\u03c5 \u03bf\u03b4\u03b7\u03b3\u03bf\u03cd",
HR: "Ostale obveze voza\u010da vozila",
I: "Altri compiti dell'autista",
P: "Outras fun\u00e7\u00f5es do condutor",
PL: "Inne obowi\u0105zki kierowcy",
RO: "Alte sarcini ale \u0219oferului",
RUS: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043e\u0431\u044f\u0437\u0430\u043d\u043d\u043e\u0441\u0442\u0438 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
TR: "Ara\u00e7 s\u00fcr\u00fcc\u00fcs\u00fcn\u00fcn di\u011fer y\u00fck\u00fcml\u00fcl\u00fckleri",
AR: "\u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645\u0627\u062a \u0627\u0644\u0623\u062e\u0631\u0649 \u0644\u0633\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0643\u0628\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.23",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 6,
"5": 5,
"6": 6,
"7": 6,
"8": 6,
"9": 6,
"10": 6,
"11": 6,
"12": 6,
"13": 6,
"15": 6,
"16": 6,
"17": 6,
"18": 6,
"19": 6,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 75,
titles: {
DE: "Verhalten an Fu\u00dfg\u00e4nger\u00fcberwegen und gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior at crosswalks and towards pedestrians",
E: "Comportamiento en los pasos de peatones y hacia los peatones",
F: "Comportement aux passages pour pi\u00e9tons et vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2 \u03c0\u03b5\u03b6\u03ce\u03bd \u03ba\u03b1\u03b9 \u03c0\u03c1\u03bf\u03c2 \u03c4\u03bf\u03c5\u03c2 \u03c0\u03b5\u03b6\u03bf\u03cd\u03c2",
HR: "Pona\u0161anje na pje\u0161a\u010dkim prijelazima i prema pje\u0161acima",
I: "Comportamento sulle strisce pedonali e verso i pedoni",
P: "Comportamento nas passagens de pe\u00f5es e em direc\u00e7\u00e3o aos pe\u00f5es",
PL: "Zachowanie na przej\u015bciach dla pieszych i wobec pieszych",
RO: "Comportamentul la trecerile de pietoni \u0219i fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043d\u0430 \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u043d\u044b\u0445 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430\u0445 \u0438 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yaya ge\u00e7itlerinde ve yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0639\u0646\u062f \u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0634\u0627\u0629 \u0648\u0646\u062d\u0648 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.26",
questioncount: {
"1": 16,
"2": 16,
"3": 16,
"4": 16,
"5": 9,
"6": 16,
"7": 16,
"8": 16,
"9": 16,
"10": 16,
"11": 16,
"12": 16,
"13": 16,
"15": 16,
"16": 16,
"17": 16,
"18": 16,
"19": 16,
"20": 16,
"21": 16
},
subcategoryIds: [],
children: []
}, {
id: 73,
titles: {
DE: "Unfall",
GB: "Accident",
E: "Accidente",
F: "Accident",
GR: "\u0391\u03c4\u03cd\u03c7\u03b7\u03bc\u03b1",
HR: "nesre\u0107a",
I: "Incidente",
P: "Acidente",
PL: "Wypadek",
RO: "Accident",
RUS: "\u041d\u0435\u0441\u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u043b\u0443\u0447\u0430\u0439",
TR: "kaza",
AR: "\u062d\u0627\u062f\u062b\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.34",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 6,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 89,
titles: {
DE: "Zeichen und Weisungen der Polizeibeamten",
GB: "Signs and instructions of the police officers",
E: "Se\u00f1ales e instrucciones de los agentes de polic\u00eda",
F: "Signes et instructions des agents de police",
GR: "\u03a3\u03b7\u03bc\u03ac\u03b4\u03b9\u03b1 \u03ba\u03b1\u03b9 \u03bf\u03b4\u03b7\u03b3\u03af\u03b5\u03c2 \u03c4\u03c9\u03bd \u03b1\u03c3\u03c4\u03c5\u03bd\u03bf\u03bc\u03b9\u03ba\u03ce\u03bd",
HR: "Znakovi i upute policijskih slu\u017ebenika",
I: "Segni e istruzioni degli agenti di polizia",
P: "Sinais e instru\u00e7\u00f5es dos agentes da pol\u00edcia",
PL: "Znaki i instrukcje funkcjonariuszy policji",
RO: "Semne \u0219i instruc\u021biuni ale poli\u021bi\u0219tilor",
RUS: "\u0417\u043d\u0430\u043a\u0438 \u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432 \u043f\u043e\u043b\u0438\u0446\u0438\u0438",
TR: "Polis memurlar\u0131ndan i\u015faretler ve talimatlar",
AR: "\u0625\u0634\u0627\u0631\u0627\u062a \u0648\u062a\u0639\u0644\u064a\u0645\u0627\u062a \u0645\u0646 \u0636\u0628\u0627\u0637 \u0627\u0644\u0634\u0631\u0637\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.36",
questioncount: {
"1": 12,
"2": 12,
"3": 12,
"4": 12,
"5": 11,
"6": 12,
"7": 12,
"8": 12,
"9": 12,
"10": 12,
"11": 12,
"12": 12,
"13": 12,
"15": 12,
"16": 12,
"17": 12,
"18": 12,
"19": 12,
"20": 12,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 87,
titles: {
DE: "Wechsellichtzeichen und Dauerlichtzeichen",
GB: "Alternating and permanent light signals",
E: "Se\u00f1ales luminosas variables y fijas",
F: "Signaux \u00e0 feux alternatifs et permanents",
GR: "\u039c\u03b5\u03c4\u03b1\u03b2\u03bb\u03b7\u03c4\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03c3\u03c4\u03b1\u03b8\u03b5\u03c1\u03ad\u03c2 \u03c6\u03c9\u03c4\u03b5\u03b9\u03bd\u03ad\u03c2 \u03b5\u03bd\u03b4\u03b5\u03af\u03be\u03b5\u03b9\u03c2",
HR: "Izmjeni\u010dni svjetlosni signali i trajni svjetlosni signali",
I: "Segnali a luce variabile e fissa",
P: "Sinais luminosos vari\u00e1veis e est\u00e1veis",
PL: "Znaki \u015bwietlne zmienne i sta\u0142e",
RO: "Semne luminoase variabile \u0219i constante",
RUS: "\u041f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0438 \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0435 \u0441\u0432\u0435\u0442\u043e\u0432\u044b\u0435 \u0443\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u0438",
TR: "De\u011fi\u015fen \u0131\u015f\u0131k sinyalleri ve kal\u0131c\u0131 \u0131\u015f\u0131k sinyalleri",
AR: "\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u0645\u062a\u0646\u0627\u0648\u0628\u0629 \u0648\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u062f\u0627\u0626\u0645\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.37",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 11,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 28,
titles: {
DE: "Blaues Blinklicht und gelbes Blinklicht",
GB: "Blue flashing light and yellow flashing light",
E: "Luz azul intermitente y luz amarilla intermitente",
F: "Feu bleu clignotant et feu jaune clignotant",
GR: "\u039c\u03c0\u03bb\u03b5 \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03af\u03c4\u03c1\u03b9\u03bd\u03bf \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9",
HR: "Trep\u0107u\u0107e plavo svjetlo i trep\u0107u\u0107e \u017euto svjetlo",
I: "Luce lampeggiante blu e luce lampeggiante gialla",
P: "Luz intermitente azul e luz intermitente amarela",
PL: "Niebieskie \u015bwiat\u0142o migaj\u0105ce i \u017c\u00f3\u0142te \u015bwiat\u0142o migaj\u0105ce",
RO: "Lumin\u0103 intermitent\u0103 albastr\u0103 \u0219i lumin\u0103 intermitent\u0103 galben\u0103",
RUS: "\u0421\u0438\u043d\u0438\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442 \u0438 \u0436\u0435\u043b\u0442\u044b\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442",
TR: "Yan\u0131p s\u00f6nen mavi \u0131\u015f\u0131k ve yan\u0131p s\u00f6nen sar\u0131 \u0131\u015f\u0131k",
AR: "\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0632\u0631\u0642 \u0648\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0635\u0641\u0631"
},
basic: "1",
chapterLevelIndex: "1.2.38",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"5": 2,
"6": 5,
"7": 5,
"8": 5,
"9": 5,
"10": 5,
"11": 5,
"12": 5,
"13": 5,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 5,
"20": 5,
"21": 5
},
subcategoryIds: [],
children: []
} ]
}, {
id: 91,
titles: {
DE: "Vorfahrt, Vorrang",
GB: "Right of way, priority",
E: "Derecho de paso, prioridad",
F: "priorit\u00e9 de passage, priorit\u00e9",
GR: "\u0394\u03b9\u03ba\u03b1\u03af\u03c9\u03bc\u03b1 \u03b4\u03b9\u03ad\u03bb\u03b5\u03c5\u03c3\u03b7\u03c2, \u03c0\u03c1\u03bf\u03c4\u03b5\u03c1\u03b1\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Pravo puta, prioritet",
I: "Diritto di passaggio, priorit\u00e0",
P: "Direito de passagem, prioridade",
PL: "Prawo drogi, pierwsze\u0144stwo",
RO: "Dreptul de trecere, prioritate",
RUS: "\u041f\u0440\u0430\u0432\u043e \u043d\u0430 \u043f\u0440\u043e\u0435\u0437\u0434, \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
TR: "Yol hakk\u0131, \u00f6ncelik",
AR: "\u062d\u0642 \u0627\u0644\u0637\u0631\u064a\u0642 \u060c \u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.3",
questioncount: {
"1": 45,
"2": 45,
"3": 45,
"4": 45,
"5": 35,
"6": 45,
"7": 45,
"8": 45,
"9": 45,
"10": 45,
"11": 45,
"12": 45,
"13": 45,
"15": 45,
"16": 45,
"17": 45,
"18": 45,
"19": 45,
"20": 45,
"21": 45
},
subcategoryIds: [ 97 ],
children: [ {
id: 97,
titles: {
DE: "Vorfahrt, Vorrang",
GB: "Right of way, priority",
E: "Derecho de paso, prioridad",
F: "Priorit\u00e9, priorit\u00e9",
GR: "\u0394\u03b9\u03ba\u03b1\u03af\u03c9\u03bc\u03b1 \u03b4\u03b9\u03ad\u03bb\u03b5\u03c5\u03c3\u03b7\u03c2, \u03c0\u03c1\u03bf\u03c4\u03b5\u03c1\u03b1\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Pravo puta, prioritet",
I: "Diritto di passaggio, priorit\u00e0",
P: "Direito de passagem, prioridade",
PL: "Prawo drogi, pierwsze\u0144stwo",
RO: "Dreptul de trecere, prioritate",
RUS: "\u041f\u0440\u0430\u0432\u043e \u043d\u0430 \u043f\u0440\u043e\u0435\u0437\u0434, \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
TR: "Yol hakk\u0131, \u00f6ncelik",
AR: "\u062d\u0642 \u0627\u0644\u0637\u0631\u064a\u0642 \u060c \u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.3.1",
questioncount: {
"1": 45,
"2": 45,
"3": 45,
"4": 45,
"5": 35,
"6": 45,
"7": 45,
"8": 45,
"9": 45,
"10": 45,
"11": 45,
"12": 45,
"13": 45,
"15": 45,
"16": 45,
"17": 45,
"18": 45,
"19": 45,
"20": 45,
"21": 45
},
subcategoryIds: [],
children: []
} ]
}, {
id: 41,
titles: {
DE: "Verkehrszeichen",
GB: "Traffic signs",
E: "Se\u00f1ales de tr\u00e1fico",
F: "Panneaux de signalisation",
GR: "\u039a\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ad\u03c2 \u03c0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b5\u03c2",
HR: "Prometni znakovi",
I: "Segnali stradali",
P: "Sinais de tr\u00e2nsito",
PL: "Znaki drogowe",
RO: "Semne de circula\u021bie",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0437\u043d\u0430\u043a\u0438",
TR: "Trafik i\u015faretleri",
AR: "\u0627\u0634\u0627\u0631\u0627\u062a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "1",
chapterLevelIndex: "1.4",
questioncount: {
"1": 147,
"2": 147,
"3": 147,
"4": 147,
"5": 44,
"6": 147,
"7": 147,
"8": 147,
"9": 147,
"10": 147,
"11": 147,
"12": 147,
"13": 147,
"15": 147,
"16": 147,
"17": 147,
"18": 147,
"19": 147,
"20": 147,
"21": 147
},
subcategoryIds: [ 42, 83, 60, 79 ],
children: [ {
id: 42,
titles: {
DE: "Gefahrzeichen",
GB: "Danger sign",
E: "Se\u00f1ales de peligro",
F: "Panneaux de danger",
GR: "\u03a3\u03ae\u03bc\u03b1\u03c4\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03bf\u03c5",
HR: "Znak opasnosti",
I: "Segnali di pericolo",
P: "Sinais de perigo",
PL: "Znaki ostrzegawcze",
RO: "Semne de pericol",
RUS: "\u0417\u043d\u0430\u043a\u0438 \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
TR: "Tehlike i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062e\u0637\u0631"
},
basic: "1",
chapterLevelIndex: "1.4.40",
questioncount: {
"1": 38,
"2": 38,
"3": 38,
"4": 38,
"5": 7,
"6": 38,
"7": 38,
"8": 38,
"9": 38,
"10": 38,
"11": 38,
"12": 38,
"13": 38,
"15": 38,
"16": 38,
"17": 38,
"18": 38,
"19": 38,
"20": 38,
"21": 38
},
subcategoryIds: [],
children: []
}, {
id: 83,
titles: {
DE: "Vorschriftzeichen",
GB: "Regulation sign",
E: "Se\u00f1al reglamentaria",
F: "Panneau de prescription",
GR: "\u03a1\u03c5\u03b8\u03bc\u03b9\u03c3\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "Propisni znak",
I: "Segno regolamentare",
P: "Sinal regulamentar",
PL: "Znak regulacyjny",
RO: "Semnul de reglementare",
RUS: "\u0420\u0435\u0433\u0443\u043b\u0438\u0440\u0443\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "d\u00fczenleme i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0644\u0627\u0626\u062d\u0629"
},
basic: "1",
chapterLevelIndex: "1.4.41",
questioncount: {
"1": 74,
"2": 74,
"3": 74,
"4": 74,
"5": 31,
"6": 74,
"7": 74,
"8": 74,
"9": 74,
"10": 74,
"11": 74,
"12": 74,
"13": 74,
"15": 74,
"16": 74,
"17": 74,
"18": 74,
"19": 74,
"20": 74,
"21": 74
},
subcategoryIds: [],
children: []
}, {
id: 60,
titles: {
DE: "Richtzeichen",
GB: "Direction sign",
E: "Signo indicador",
F: "Panneaux indicateurs",
GR: "\u0388\u03bd\u03b4\u03b5\u03b9\u03be\u03b7",
HR: "Znak smjera",
I: "Segno indicativo",
P: "Sinal indicador",
PL: "Znak sygnalizacyjny",
RO: "Semnul indicator",
RUS: "\u0418\u043d\u0434\u0438\u043a\u0430\u0442\u043e\u0440\u043d\u044b\u0439 \u0437\u043d\u0430\u043a",
TR: "y\u00f6n i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0627\u062a\u062c\u0627\u0647"
},
basic: "1",
chapterLevelIndex: "1.4.42",
questioncount: {
"1": 34,
"2": 34,
"3": 34,
"4": 34,
"5": 6,
"6": 34,
"7": 34,
"8": 34,
"9": 34,
"10": 34,
"11": 34,
"12": 34,
"13": 34,
"15": 34,
"16": 34,
"17": 34,
"18": 34,
"19": 34,
"20": 34,
"21": 34
},
subcategoryIds: [],
children: []
}, {
id: 79,
titles: {
DE: "Verkehrseinrichtungen",
GB: "Transport facilities",
E: "Instalaciones de tr\u00e1fico",
F: "Dispositifs de circulation",
GR: "\u0395\u03b3\u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Prometni objekti",
I: "Strutture per il traffico",
P: "Facilidades de tr\u00e1fego",
PL: "Udogodnienia w ruchu drogowym",
RO: "Facilit\u0103\u021bi de trafic",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u043e\u043e\u0440\u0443\u0436\u0435\u043d\u0438\u044f",
TR: "Ula\u015f\u0131m tesisleri",
AR: "\u062a\u0633\u0647\u064a\u0644\u0627\u062a \u0627\u0644\u0646\u0642\u0644"
},
basic: "1",
chapterLevelIndex: "1.4.43",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 92,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "1",
chapterLevelIndex: "1.5",
questioncount: {
"1": 26,
"2": 26,
"3": 26,
"4": 26,
"5": 6,
"6": 26,
"7": 26,
"8": 26,
"9": 26,
"10": 26,
"11": 26,
"12": 26,
"13": 26,
"15": 26,
"16": 26,
"17": 26,
"18": 26,
"19": 26,
"20": 26,
"21": 26
},
subcategoryIds: [ 96 ],
children: [ {
id: 96,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "1",
chapterLevelIndex: "1.5.1",
questioncount: {
"1": 26,
"2": 26,
"3": 26,
"4": 26,
"5": 6,
"6": 26,
"7": 26,
"8": 26,
"9": 26,
"10": 26,
"11": 26,
"12": 26,
"13": 26,
"15": 26,
"16": 26,
"17": 26,
"18": 26,
"19": 26,
"20": 26,
"21": 26
},
subcategoryIds: [],
children: []
} ]
}, {
id: 37,
titles: {
DE: "Technik",
GB: "Technology",
E: "Tecnolog\u00eda",
F: "Technique",
GR: "\u03a4\u03b5\u03c7\u03bd\u03bf\u03bb\u03bf\u03b3\u03af\u03b1",
HR: "tehnologija",
I: "Tecnologia",
P: "Tecnologia",
PL: "Technologia",
RO: "Tehnologie",
RUS: "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f",
TR: "teknoloji",
AR: "\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627"
},
basic: "1",
chapterLevelIndex: "1.7",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 2,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [ 38 ],
children: [ {
id: 38,
titles: {
DE: "Fahrbetrieb, Fahrphysik, Fahrtechnik",
GB: "Driving operation, driving physics, driving technique",
E: "Funcionamiento de la conducci\u00f3n, f\u00edsica de la conducci\u00f3n, t\u00e9cnica de la conducci\u00f3n",
F: "Conduite, physique de la conduite, technique de conduite",
GR: "\u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c6\u03c5\u03c3\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c4\u03b5\u03c7\u03bd\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Operacija vo\u017enje, fizika vo\u017enje, tehnika vo\u017enje",
I: "Funzionamento della guida, fisica della guida, tecnica di guida",
P: "Opera\u00e7\u00e3o de condu\u00e7\u00e3o, f\u00edsica de condu\u00e7\u00e3o, t\u00e9cnica de condu\u00e7\u00e3o",
PL: "Prowadzenie pojazdu, fizyka jazdy, technika jazdy",
RO: "Func\u021bionarea la volan, fizica conducerii, tehnica conducerii",
RUS: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u043c, \u0444\u0438\u0437\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f, \u0442\u0435\u0445\u043d\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f",
TR: "S\u00fcr\u00fc\u015f operasyonu, s\u00fcr\u00fc\u015f fizi\u011fi, s\u00fcr\u00fc\u015f tekni\u011fi",
AR: "\u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u0641\u064a\u0632\u064a\u0627\u0621 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629"
},
basic: "1",
chapterLevelIndex: "1.7.1",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 2,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 93,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Qualification and ability of drivers",
E: "Idoneidad y competencia de los conductores",
F: "Aptitude et capacit\u00e9 des conducteurs de v\u00e9hicules \u00e0 moteur",
GR: "\u039a\u03b1\u03c4\u03b1\u03bb\u03bb\u03b7\u03bb\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03c9\u03bd \u03bf\u03b4\u03b7\u03b3\u03ce\u03bd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Idoneit\u00e0 e competenza dei conducenti",
P: "Adequa\u00e7\u00e3o e compet\u00eancia dos condutores",
PL: "Przydatno\u015b\u0107 i kompetencje maszynist\u00f3w",
RO: "Aptitudinea \u0219i competen\u021ba conduc\u0103torilor auto",
RUS: "\u041f\u0440\u0438\u0433\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "1",
chapterLevelIndex: "1.8",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [ 98 ],
children: [ {
id: 98,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Qualification and ability of drivers",
E: "Aptitud y competencia del conductor",
F: "Aptitude et comp\u00e9tences des conducteurs",
GR: "\u0399\u03ba\u03b1\u03bd\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03bf\u03c5 \u03bf\u03b4\u03b7\u03b3\u03bf\u03cd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Attitudine e competenza dell'autista",
P: "Aptid\u00e3o e compet\u00eancia do condutor",
PL: "predyspozycje i kompetencje kierowcy",
RO: "Aptitudini \u0219i competen\u021be ale conduc\u0103torului auto",
RUS: "\u0421\u043f\u043e\u0441\u043e\u0431\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "1",
chapterLevelIndex: "1.8.1",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
} ]
}, {
id: 4,
titles: {
DE: "Zusatzstoff",
GB: "Additive",
E: "Aditivo",
F: "Substance compl\u00e9mentaire",
GR: "\u03a0\u03c1\u03cc\u03c3\u03b8\u03b5\u03c4\u03bf",
HR: "Aditiv",
I: "Additivo",
P: "Aditivo",
PL: "Dodatek",
RO: "Aditiv",
RUS: "\u0414\u043e\u0431\u0430\u0432\u043a\u0430",
TR: "Katk\u0131",
AR: "\u0645\u0627\u062f\u0629 \u0645\u0636\u0627\u0641\u0629"
},
basic: "0",
chapterLevelIndex: "2",
questioncount: {
"1": 386,
"2": 385,
"3": 386,
"4": 163,
"5": 59,
"6": 561,
"7": 342,
"8": 289,
"9": 167,
"10": 303,
"11": 273,
"12": 162,
"13": 226,
"15": 386,
"16": 385,
"17": 386,
"18": 163,
"19": 561,
"20": 162,
"21": 226
},
subcategoryIds: [ 11, 5, 43, 94, 7, 39, 95 ],
children: [ {
id: 11,
titles: {
DE: "Gefahrenlehre",
GB: "Danger theory",
E: "Teor\u00eda del peligro",
F: "Th\u00e9orie des dangers",
GR: "\u0398\u03b5\u03c9\u03c1\u03af\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03c9\u03bd",
HR: "Teorija opasnosti",
I: "Teoria del pericolo",
P: "Teoria do perigo",
PL: "Teoria zagro\u017ce\u0144",
RO: "Teoria riscului",
RUS: "\u0422\u0435\u043e\u0440\u0438\u044f \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0435\u0439",
TR: "tehlike teorisi",
AR: "\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631"
},
basic: "0",
chapterLevelIndex: "2.1",
questioncount: {
"1": 132,
"2": 132,
"3": 132,
"4": 46,
"5": 8,
"6": 161,
"7": 25,
"8": 33,
"9": 3,
"10": 35,
"11": 35,
"12": 14,
"13": 24,
"15": 132,
"16": 132,
"17": 132,
"18": 46,
"19": 161,
"20": 14,
"21": 24
},
subcategoryIds: [ 50, 78, 36, 30, 47, 70, 27, 17, 15, 34, 12 ],
children: [ {
id: 50,
titles: {
DE: "Grundformen des Verkehrsverhaltens",
GB: "Basic forms of traffic behavior",
E: "Formas b\u00e1sicas de comportamiento del tr\u00e1fico",
F: "Formes de base du comportement dans la circulation",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03ad\u03c2 \u03bc\u03bf\u03c1\u03c6\u03ad\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ae\u03c2 \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac\u03c2",
HR: "Osnovni oblici pona\u0161anja u prometu",
I: "Forme di base del comportamento del traffico",
P: "Formas b\u00e1sicas de comportamento no tr\u00e2nsito",
PL: "Podstawowe formy zachowania w ruchu drogowym",
RO: "Forme de baz\u0103 ale comportamentului \u00een trafic",
RUS: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0444\u043e\u0440\u043c\u044b \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435",
TR: "Temel trafik davran\u0131\u015f\u0131 bi\u00e7imleri",
AR: "\u0627\u0644\u0623\u0634\u0643\u0627\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0631\u0648\u0631\u064a"
},
basic: "0",
chapterLevelIndex: "2.1.1",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 2,
"6": 5,
"12": 2,
"13": 2,
"15": 4,
"16": 4,
"17": 4,
"18": 2,
"19": 5,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 78,
titles: {
DE: "Verhalten gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior towards pedestrians",
E: "Comportamiento con los peatones",
F: "Comportement vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03ad\u03bd\u03b1\u03bd\u03c4\u03b9 \u03c4\u03c9\u03bd \u03c0\u03b5\u03b6\u03ce\u03bd",
HR: "Pona\u0161anje prema pje\u0161acima",
I: "Comportamento verso i pedoni",
P: "Comportamento para com os pe\u00f5es",
PL: "Zachowanie wobec pieszych",
RO: "Comportamentul fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u062a\u062c\u0627\u0647 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.2",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 2,
"6": 4,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"13": 1,
"15": 3,
"16": 3,
"17": 3,
"18": 2,
"19": 4,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 36,
titles: {
DE: "Fahrbahn- und Witterungsverh\u00e4ltnisse",
GB: "Road and weather conditions",
E: "Condiciones de la carretera y del tiempo",
F: "Conditions de la chauss\u00e9e et conditions m\u00e9t\u00e9orologiques",
GR: "\u039f\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03b9\u03c1\u03b9\u03ba\u03ad\u03c2 \u03c3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b5\u03c2",
HR: "Cestovni i vremenski uvjeti",
I: "Condizioni stradali e meteorologiche",
P: "Condi\u00e7\u00f5es rodovi\u00e1rias e meteorol\u00f3gicas",
PL: "Warunki drogowe i pogodowe",
RO: "Condi\u021bii rutiere \u0219i meteorologice",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0438 \u043f\u043e\u0433\u043e\u0434\u043d\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f",
TR: "Yol ve hava ko\u015fullar\u0131",
AR: "\u0623\u062d\u0648\u0627\u0644 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0637\u0642\u0633"
},
basic: "0",
chapterLevelIndex: "2.1.3",
questioncount: {
"1": 30,
"2": 30,
"3": 30,
"4": 17,
"5": 7,
"6": 31,
"7": 9,
"8": 10,
"9": 1,
"10": 10,
"11": 10,
"12": 7,
"13": 12,
"15": 30,
"16": 30,
"17": 30,
"18": 17,
"19": 31,
"20": 7,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 30,
titles: {
DE: "Dunkelheit und schlechte Sicht",
GB: "Darkness and poor visibility",
E: "Oscuridad y poca visibilidad",
F: "Obscurit\u00e9 et mauvaise visibilit\u00e9",
GR: "\u03a3\u03ba\u03bf\u03c4\u03ac\u03b4\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03ba\u03ae \u03bf\u03c1\u03b1\u03c4\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Mrak i slab vid",
I: "Buio e scarsa visibilit\u00e0",
P: "Escurid\u00e3o e m\u00e1 visibilidade",
PL: "Ciemno\u015b\u0107 i s\u0142aba widoczno\u015b\u0107",
RO: "\u00centuneric \u0219i vizibilitate redus\u0103",
RUS: "\u0422\u0435\u043c\u043d\u043e\u0442\u0430 \u0438 \u043f\u043b\u043e\u0445\u0430\u044f \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c",
TR: "Karanl\u0131k ve zay\u0131f g\u00f6r\u00fc\u015f",
AR: "\u0627\u0644\u0638\u0644\u0627\u0645 \u0648\u0636\u0639\u0641 \u0627\u0644\u0631\u0624\u064a\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.4",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 3,
"6": 4,
"12": 1,
"13": 4,
"15": 3,
"16": 3,
"17": 3,
"18": 3,
"19": 4,
"20": 1,
"21": 4
},
subcategoryIds: [],
children: []
}, {
id: 47,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.5",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 1,
"6": 9,
"8": 1,
"10": 2,
"11": 2,
"15": 8,
"16": 8,
"17": 8,
"18": 1,
"19": 9
},
subcategoryIds: [],
children: []
}, {
id: 70,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "0",
chapterLevelIndex: "2.1.6",
questioncount: {
"1": 22,
"2": 22,
"3": 22,
"4": 5,
"6": 27,
"7": 1,
"8": 3,
"10": 4,
"11": 4,
"12": 2,
"13": 1,
"15": 22,
"16": 22,
"17": 22,
"18": 5,
"19": 27,
"20": 2,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 27,
titles: {
DE: "Besondere Verkehrssituationen",
GB: "Special traffic scenarios",
E: "Situaciones especiales de tr\u00e1fico",
F: "Situations de circulation particuli\u00e8res",
GR: "\u0395\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Posebne prometne situacije",
I: "Situazioni speciali di traffico",
P: "Situa\u00e7\u00f5es especiais de tr\u00e1fego",
PL: "Szczeg\u00f3lne sytuacje w ruchu drogowym",
RO: "Situa\u021bii speciale de trafic",
RUS: "\u041e\u0441\u043e\u0431\u044b\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
TR: "\u00d6zel trafik durumlar\u0131",
AR: "\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062e\u0627\u0635\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.7",
questioncount: {
"1": 26,
"2": 26,
"3": 26,
"4": 4,
"6": 30,
"7": 5,
"8": 9,
"9": 1,
"10": 8,
"11": 8,
"12": 1,
"13": 3,
"15": 26,
"16": 26,
"17": 26,
"18": 4,
"19": 30,
"20": 1,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 17,
titles: {
DE: "Autobahn",
GB: "Freeway",
E: "Autopista",
F: "Autoroute",
GR: "\u0391\u03c5\u03c4\u03bf\u03ba\u03b9\u03bd\u03b7\u03c4\u03cc\u03b4\u03c1\u03bf\u03bc\u03bf\u03c2",
HR: "autocesta",
I: "Autostrada",
P: "Auto-estrada",
PL: "Autostrada",
RO: "Autostrada",
RUS: "\u0410\u0432\u0442\u043e\u043c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u043b\u044c",
TR: "Otoban",
AR: "\u0637\u0631\u064a\u0642 \u0633\u0631\u064a\u0639"
},
basic: "0",
chapterLevelIndex: "2.1.8",
questioncount: {
"1": 18,
"2": 18,
"3": 18,
"6": 19,
"7": 5,
"8": 5,
"9": 1,
"10": 4,
"11": 4,
"15": 18,
"16": 18,
"17": 18,
"19": 19
},
subcategoryIds: [],
children: []
}, {
id: 15,
titles: {
DE: "Alkohol, Drogen, Medikamente",
GB: "Alcohol, drugs, medication",
E: "Alcohol, drogas, medicamentos",
F: "Alcool, drogues, m\u00e9dicaments",
GR: "\u0391\u03bb\u03ba\u03bf\u03cc\u03bb, \u03bd\u03b1\u03c1\u03ba\u03c9\u03c4\u03b9\u03ba\u03ac, \u03c6\u03ac\u03c1\u03bc\u03b1\u03ba\u03b1",
HR: "Alkohol, droge, lijekovi",
I: "Alcool, droghe, farmaci",
P: "\u00c1lcool, drogas, medicamentos",
PL: "Alkohol, narkotyki, leki",
RO: "Alcool, droguri, medicamente",
RUS: "\u0410\u043b\u043a\u043e\u0433\u043e\u043b\u044c, \u043d\u0430\u0440\u043a\u043e\u0442\u0438\u043a\u0438, \u043b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0430",
TR: "Alkol, uyu\u015fturucu, ila\u00e7",
AR: "\u0627\u0644\u0643\u062d\u0648\u0644 \u0648\u0627\u0644\u0645\u062e\u062f\u0631\u0627\u062a \u0648\u0627\u0644\u0623\u062f\u0648\u064a\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.9",
questioncount: {
"10": 2,
"11": 2
},
subcategoryIds: [],
children: []
}, {
id: 34,
titles: {
DE: "Erm\u00fcdung, Ablenkung",
GB: "Fatigue, distraction",
E: "Fatiga, distracci\u00f3n",
F: "Fatigue, distraction",
GR: "\u039a\u03cc\u03c0\u03c9\u03c3\u03b7, \u03b1\u03c0\u03cc\u03c3\u03c0\u03b1\u03c3\u03b7 \u03c0\u03c1\u03bf\u03c3\u03bf\u03c7\u03ae\u03c2",
HR: "Umor, rastresenost",
I: "Fatica, distrazione",
P: "Fadiga, distrac\u00e7\u00e3o",
PL: "Zm\u0119czenie, rozproszenie uwagi",
RO: "Oboseal\u0103, distragere a aten\u021biei",
RUS: "\u0423\u0441\u0442\u0430\u043b\u043e\u0441\u0442\u044c, \u0440\u0430\u0441\u0441\u0435\u044f\u043d\u043d\u043e\u0441\u0442\u044c",
TR: "Yorgunluk, dikkat da\u011f\u0131n\u0131kl\u0131\u011f\u0131",
AR: "\u0627\u0644\u062a\u0639\u0628 \u0648\u0627\u0644\u0625\u0644\u0647\u0627\u0621"
},
basic: "0",
chapterLevelIndex: "2.1.10",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 4,
"6": 7,
"7": 3,
"8": 3,
"10": 3,
"11": 3,
"15": 5,
"16": 5,
"17": 5,
"18": 4,
"19": 7
},
subcategoryIds: [],
children: []
}, {
id: 12,
titles: {
DE: "Affektiv-emotionales Verhalten im Stra\u00dfenverkehr",
GB: "Affective-emotional behavior in traffic",
E: "Comportamiento afectivo-emocional en el tr\u00e1fico rodado",
F: "Comportement affectif et \u00e9motionnel dans la circulation routi\u00e8re",
GR: "\u03a3\u03c5\u03bd\u03b1\u03b9\u03c3\u03b8\u03b7\u03bc\u03b1\u03c4\u03b9\u03ba\u03ae-\u03c3\u03c5\u03bd\u03b1\u03b9\u03c3\u03b8\u03b7\u03bc\u03b1\u03c4\u03b9\u03ba\u03ae \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1",
HR: "Afektivno-emocionalno pona\u0161anje u prometu",
I: "Comportamento affettivo-emotivo nel traffico stradale",
P: "Comportamento afectivo-emocional no tr\u00e1fego rodovi\u00e1rio",
PL: "Zachowania afektywno-emocjonalne w ruchu drogowym",
RO: "Comportamentul afectiv-emo\u021bional \u00een traficul rutier",
RUS: "\u0410\u0444\u0444\u0435\u043a\u0442\u0438\u0432\u043d\u043e-\u044d\u043c\u043e\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438",
TR: "Trafikte duygusal-duygusal davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0639\u0627\u0637\u0641\u064a \u0627\u0644\u0639\u0627\u0637\u0641\u064a \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "0",
chapterLevelIndex: "2.1.11",
questioncount: {
"1": 13,
"2": 13,
"3": 13,
"4": 8,
"5": 1,
"6": 25,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 13,
"16": 13,
"17": 13,
"18": 8,
"19": 25,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 5,
titles: {
DE: "Verhalten im Stra\u00dfenverkehr",
GB: "Behavior in road traffic",
E: "Comportamiento en el tr\u00e1fico rodado",
F: "Comportement dans la circulation routi\u00e8re",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1",
HR: "Pona\u0161anje u prometu",
I: "Comportamento nel traffico stradale",
P: "Comportamento no tr\u00e1fego rodovi\u00e1rio",
PL: "Zachowanie w ruchu drogowym",
RO: "Comportamentul \u00een traficul rutier",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438",
TR: "trafikte davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "0",
chapterLevelIndex: "2.2",
questioncount: {
"1": 136,
"2": 135,
"3": 136,
"4": 50,
"5": 23,
"6": 190,
"7": 93,
"8": 85,
"9": 49,
"10": 52,
"11": 48,
"12": 74,
"13": 86,
"15": 136,
"16": 135,
"17": 136,
"18": 50,
"19": 190,
"20": 74,
"21": 86
},
subcategoryIds: [ 67, 48, 10, 71, 113, 24, 6, 53, 33, 65, 57, 86, 22, 18, 20, 59, 55, 64, 76, 72, 62, 81, 111, 88, 114 ],
children: [ {
id: 67,
titles: {
DE: "Stra\u00dfenbenutzung",
GB: "Road use",
E: "Uso de la carretera",
F: "Utilisation de la route",
GR: "\u039f\u03b4\u03b9\u03ba\u03ae \u03c7\u03c1\u03ae\u03c3\u03b7",
HR: "Kori\u0161tenje cesta",
I: "Uso della strada",
P: "Utiliza\u00e7\u00e3o da estrada",
PL: "U\u017cytkowanie dr\u00f3g",
RO: "Utilizarea drumurilor",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0433",
TR: "Yol kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0637\u0631\u064a\u0642"
},
basic: "0",
chapterLevelIndex: "2.2.2",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 2,
"5": 6,
"6": 2,
"7": 2,
"8": 2,
"9": 1,
"12": 1,
"13": 2,
"15": 3,
"16": 3,
"17": 3,
"18": 2,
"19": 2,
"20": 1,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 48,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.3",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 4,
"5": 2,
"6": 19,
"7": 3,
"8": 2,
"9": 2,
"10": 3,
"11": 2,
"13": 6,
"15": 14,
"16": 14,
"17": 14,
"18": 4,
"19": 19,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 10,
titles: {
DE: "Abstand",
GB: "Distance",
E: "Distancia",
F: "Distance",
GR: "\u0391\u03c0\u03cc\u03c3\u03c4\u03b1\u03c3\u03b7",
HR: "udaljenosti",
I: "Distanza",
P: "Dist\u00e2ncia",
PL: "Odleg\u0142o\u015b\u0107",
RO: "Distan\u021ba",
RUS: "\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435",
TR: "mesafe",
AR: "\u0645\u0633\u0627\u0641\u0647: \u0628\u0639\u062f"
},
basic: "0",
chapterLevelIndex: "2.2.4",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 2,
"6": 8,
"7": 6,
"8": 5,
"9": 1,
"10": 3,
"11": 3,
"12": 1,
"13": 3,
"15": 4,
"16": 4,
"17": 4,
"18": 2,
"19": 8,
"20": 1,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 71,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "0",
chapterLevelIndex: "2.2.5",
questioncount: {
"1": 11,
"2": 11,
"3": 11,
"4": 1,
"6": 12,
"7": 4,
"8": 1,
"10": 2,
"12": 2,
"13": 1,
"15": 11,
"16": 11,
"17": 11,
"18": 1,
"19": 12,
"20": 2,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 113,
titles: {
DE: "Vorbeifahren",
GB: "Pass by",
E: "Pasando por",
F: "Passage des v\u00e9hicules",
GR: "\u03a0\u03b5\u03c1\u03bd\u03ce\u03bd\u03c4\u03b1\u03c2",
HR: "Vozite mimo",
I: "Passaggio",
P: "Aprova\u00e7\u00e3o",
PL: "Passing",
RO: "Trecere",
RUS: "\u041f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435",
TR: "ge\u00e7mi\u015f s\u00fcr\u00fcc\u00fc",
AR: "\u0642\u0645 \u0628\u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0641\u064a \u0627\u0644\u0645\u0627\u0636\u064a"
},
basic: "0",
chapterLevelIndex: "2.2.6",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 24,
titles: {
DE: "Benutzung von Fahrstreifen durch Kraftfahrzeuge",
GB: "Use of lanes by motor vehicles",
E: "Uso de los carriles por parte de los veh\u00edculos de motor",
F: "Utilisation de voies de circulation par des v\u00e9hicules \u00e0 moteur",
GR: "\u03a7\u03c1\u03ae\u03c3\u03b7 \u03bb\u03c9\u03c1\u03af\u03b4\u03c9\u03bd \u03b1\u03c0\u03cc \u03bc\u03b7\u03c7\u03b1\u03bd\u03bf\u03ba\u03af\u03bd\u03b7\u03c4\u03b1 \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03b1",
HR: "Kori\u0161tenje traka za motorna vozila",
I: "Uso delle corsie da parte dei veicoli a motore",
P: "Utiliza\u00e7\u00e3o das faixas pelos ve\u00edculos autom\u00f3veis",
PL: "Wykorzystanie pas\u00f3w ruchu przez pojazdy silnikowe",
RO: "Utilizarea benzilor de circula\u021bie de c\u0103tre autovehicule",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u043e\u0441 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f \u0430\u0432\u0442\u043e\u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043e\u043c",
TR: "Motorlu ara\u00e7lar\u0131n \u015ferit kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0645\u0631\u0627\u062a \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.7",
questioncount: {
"1": 11,
"2": 11,
"3": 11,
"4": 2,
"6": 10,
"7": 3,
"8": 3,
"9": 2,
"10": 3,
"11": 3,
"12": 1,
"13": 1,
"15": 11,
"16": 11,
"17": 11,
"18": 2,
"19": 10,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 6,
titles: {
DE: "Abbiegen, Wenden und R\u00fcckw\u00e4rtsfahren",
GB: "Turning, U-turning and reversing",
E: "Girar, dar vueltas y retroceder",
F: "Tourner, faire demi-tour et faire marche arri\u00e8re",
GR: "\u03a3\u03c4\u03c1\u03bf\u03c6\u03ae, \u03c3\u03c4\u03c1\u03bf\u03c6\u03ae \u03ba\u03b1\u03b9 \u03b1\u03bd\u03b1\u03c3\u03c4\u03c1\u03bf\u03c6\u03ae",
HR: "Okretanje, okretanje i rikverc",
I: "Girare, girare e fare retromarcia",
P: "Torneamento, viragem e invers\u00e3o de marcha",
PL: "Skr\u0119canie, zawracanie i cofanie",
RO: "\u00centoarcerea, \u00eentoarcerea \u0219i mersul \u00eenapoi",
RUS: "\u041f\u043e\u0432\u043e\u0440\u043e\u0442, \u0440\u0430\u0437\u0432\u043e\u0440\u043e\u0442 \u0438 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435 \u0437\u0430\u0434\u043d\u0438\u043c \u0445\u043e\u0434\u043e\u043c",
TR: "D\u00f6nd\u00fcrme, d\u00f6nd\u00fcrme ve geri \u00e7evirme",
AR: "\u0627\u0644\u062f\u0648\u0631\u0627\u0646 \u0648\u0627\u0644\u0627\u0646\u0639\u0637\u0627\u0641 \u0648\u0627\u0644\u0639\u0643\u0633"
},
basic: "0",
chapterLevelIndex: "2.2.9",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 2,
"6": 5,
"7": 4,
"8": 5,
"9": 2,
"10": 3,
"11": 2,
"12": 8,
"13": 8,
"15": 4,
"16": 4,
"17": 4,
"18": 2,
"19": 5,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 53,
titles: {
DE: "Halten und Parken",
GB: "Stopping and parking",
E: "Parada y estacionamiento",
F: "Arr\u00eat et stationnement",
GR: "\u03a3\u03c4\u03ac\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c4\u03ac\u03b8\u03bc\u03b5\u03c5\u03c3\u03b7",
HR: "Zaustavite se i parkirajte",
I: "Sosta e parcheggio",
P: "Paragem e estacionamento",
PL: "Zatrzymanie i parkowanie",
RO: "Oprire \u0219i parcare",
RUS: "\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0438 \u0441\u0442\u043e\u044f\u043d\u043a\u0430",
TR: "Dur ve park et",
AR: "\u062a\u0648\u0642\u0641 \u0648\u062a\u0648\u0642\u0641"
},
basic: "0",
chapterLevelIndex: "2.2.12",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 4,
"5": 2,
"6": 10,
"7": 1,
"10": 2,
"11": 1,
"12": 7,
"13": 7,
"15": 5,
"16": 5,
"17": 5,
"18": 4,
"19": 10,
"20": 7,
"21": 7
},
subcategoryIds: [],
children: []
}, {
id: 33,
titles: {
DE: "Einrichtungen zur \u00dcberwachung der Parkzeit",
GB: "Facilities for monitoring parking time",
E: "Dispositivos de control del tiempo de estacionamiento",
F: "Dispositifs de contr\u00f4le du temps de stationnement",
GR: "\u03a3\u03c5\u03c3\u03ba\u03b5\u03c5\u03ad\u03c2 \u03c0\u03b1\u03c1\u03b1\u03ba\u03bf\u03bb\u03bf\u03cd\u03b8\u03b7\u03c3\u03b7\u03c2 \u03c4\u03bf\u03c5 \u03c7\u03c1\u03cc\u03bd\u03bf\u03c5 \u03c3\u03c4\u03ac\u03b8\u03bc\u03b5\u03c5\u03c3\u03b7\u03c2",
HR: "Objekti za pra\u0107enje vremena parkiranja",
I: "Dispositivi di monitoraggio del tempo di parcheggio",
P: "Dispositivos de monitoriza\u00e7\u00e3o do tempo de estacionamento",
PL: "Urz\u0105dzenia monitoruj\u0105ce czas parkowania",
RO: "Dispozitive de monitorizare a timpului de parcare",
RUS: "\u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044f \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438",
TR: "Park s\u00fcresini izleme olanaklar\u0131",
AR: "\u0645\u0631\u0627\u0641\u0642 \u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0648\u0642\u062a \u0648\u0642\u0648\u0641 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.13",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 4,
"6": 5,
"12": 1,
"13": 1,
"15": 4,
"16": 4,
"17": 4,
"18": 4,
"19": 5,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 65,
titles: {
DE: "Sorgfaltspflichten",
GB: "Due diligence obligations",
E: "Deberes de asistencia",
F: "Devoir de diligence",
GR: "\u039a\u03b1\u03b8\u03ae\u03ba\u03bf\u03bd\u03c4\u03b1 \u03c6\u03c1\u03bf\u03bd\u03c4\u03af\u03b4\u03b1\u03c2",
HR: "Dubinska analiza",
I: "Doveri di cura",
P: "Deveres de cuidado",
PL: "Obowi\u0105zki w zakresie opieki",
RO: "Obliga\u021biile de \u00eengrijire",
RUS: "\u041e\u0431\u044f\u0437\u0430\u043d\u043d\u043e\u0441\u0442\u0438 \u043f\u043e \u0443\u0445\u043e\u0434\u0443",
TR: "Durum tespit s\u00fcreci",
AR: "\u0627\u062c\u0631\u0627\u0621\u0627\u062a \u0644\u0627\u0631\u0636\u0627\u0621 \u0627\u0644\u0645\u062a\u0637\u0644\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.14",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 2,
"6": 6,
"8": 1,
"11": 1,
"15": 5,
"16": 5,
"17": 5,
"18": 2,
"19": 6
},
subcategoryIds: [],
children: []
}, {
id: 57,
titles: {
DE: "Liegenbleiben und Abschleppen von Fahrzeugen",
GB: "Breakdowns and towing of vehicles",
E: "Inmovilizaci\u00f3n y remolque de veh\u00edculos",
F: "Immobilisation et remorquage de v\u00e9hicules",
GR: "\u0391\u03ba\u03b9\u03bd\u03b7\u03c4\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c1\u03c5\u03bc\u03bf\u03cd\u03bb\u03ba\u03b7\u03c3\u03b7 \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Kvarovi i vu\u010da vozila",
I: "Immobilizzazione e traino di veicoli",
P: "Imobiliza\u00e7\u00e3o e reboque de ve\u00edculos",
PL: "Unieruchomienie i holowanie pojazd\u00f3w",
RO: "Imobilizarea \u0219i tractarea vehiculelor",
RUS: "\u0418\u043c\u043c\u043e\u0431\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0438 \u0431\u0443\u043a\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7lar\u0131n ar\u0131zalanmas\u0131 ve \u00e7ekilmesi",
AR: "\u0623\u0639\u0637\u0627\u0644 \u0648\u0633\u062d\u0628 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.15",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"6": 8,
"7": 2,
"8": 2,
"9": 1,
"10": 2,
"11": 2,
"12": 2,
"13": 2,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 8,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 86,
titles: {
DE: "Warnzeichen",
GB: "Warning sign",
E: "Se\u00f1al de advertencia",
F: "Signes d'avertissement",
GR: "\u03a0\u03c1\u03bf\u03b5\u03b9\u03b4\u03bf\u03c0\u03bf\u03b9\u03b7\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "znak upozorenja",
I: "Segnale di avvertimento",
P: "Sinal de advert\u00eancia",
PL: "Znak ostrzegawczy",
RO: "Semn de avertizare",
RUS: "\u041f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0430\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "Uyar\u0131 i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062a\u062d\u0630\u064a\u0631"
},
basic: "0",
chapterLevelIndex: "2.2.16",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 2,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 2,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 22,
titles: {
DE: "Beleuchtung",
GB: "Lighting",
E: "Iluminaci\u00f3n",
F: "\u00c9clairage",
GR: "\u03a6\u03c9\u03c4\u03b9\u03c3\u03bc\u03cc\u03c2",
HR: "rasvjeta",
I: "Illuminazione",
P: "Ilumina\u00e7\u00e3o",
PL: "O\u015bwietlenie",
RO: "Iluminat",
RUS: "\u041e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u0435",
TR: "ayd\u0131nlatma",
AR: "\u0625\u0636\u0627\u0621\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.17",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 1,
"6": 16,
"7": 3,
"8": 2,
"9": 1,
"10": 1,
"11": 1,
"12": 14,
"13": 14,
"15": 6,
"16": 6,
"17": 6,
"18": 1,
"19": 16,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 18,
titles: {
DE: "Autobahnen und Kraftfahrstra\u00dfen",
GB: "Freeways and highways",
E: "Autopistas y autov\u00edas",
F: "Autoroutes et routes \u00e0 grande circulation",
GR: "\u0391\u03c5\u03c4\u03bf\u03ba\u03b9\u03bd\u03b7\u03c4\u03cc\u03b4\u03c1\u03bf\u03bc\u03bf\u03b9 \u03ba\u03b1\u03b9 \u03b1\u03c5\u03c4\u03bf\u03ba\u03b9\u03bd\u03b7\u03c4\u03cc\u03b4\u03c1\u03bf\u03bc\u03bf\u03b9",
HR: "Autoceste i autoceste",
I: "Autostrade e superstrade",
P: "Auto-estradas e auto-estradas",
PL: "Autostrady i drogi szybkiego ruchu",
RO: "Autostr\u0103zi \u0219i autostr\u0103zi",
RUS: "\u0410\u0432\u0442\u043e\u0441\u0442\u0440\u0430\u0434\u044b \u0438 \u0430\u0432\u0442\u043e\u043c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u043b\u0438",
TR: "Otoyollar ve otoyollar",
AR: "\u0627\u0644\u0637\u0631\u0642 \u0627\u0644\u0633\u0631\u064a\u0639\u0629 \u0648\u0627\u0644\u0637\u0631\u0642 \u0627\u0644\u0633\u0631\u064a\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.18",
questioncount: {
"1": 17,
"2": 16,
"3": 17,
"6": 19,
"7": 9,
"8": 11,
"9": 7,
"10": 4,
"11": 4,
"15": 17,
"16": 16,
"17": 17,
"19": 19
},
subcategoryIds: [],
children: []
}, {
id: 20,
titles: {
DE: "Bahn\u00fcberg\u00e4nge",
GB: "Level Crossings",
E: "Pasos a nivel",
F: "Passages \u00e0 niveau",
GR: "\u0399\u03c3\u03cc\u03c0\u03b5\u03b4\u03b5\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2",
HR: "Prijelazi preko razine",
I: "Passaggi a livello",
P: "Passagens de n\u00edvel",
PL: "Przejazdy kolejowe",
RO: "Trecerile la nivel",
RUS: "\u041f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u044f \u0443\u0440\u043e\u0432\u043d\u0435\u0439",
TR: "hemzemin ge\u00e7itler",
AR: "\u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0633\u062a\u0648\u0649"
},
basic: "0",
chapterLevelIndex: "2.2.19",
questioncount: [],
subcategoryIds: [],
children: []
}, {
id: 59,
titles: {
DE: "Personenbef\u00f6rderung",
GB: "Passenger transport",
E: "Transporte de pasajeros",
F: "Transport de personnes",
GR: "\u0395\u03c0\u03b9\u03b2\u03b1\u03c4\u03b9\u03ba\u03ad\u03c2 \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2",
HR: "Prijevoz putnika",
I: "Trasporto passeggeri",
P: "Transporte de passageiros",
PL: "Transport pasa\u017cerski",
RO: "Transport de pasageri",
RUS: "\u041f\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0441\u043a\u0438\u0439 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442",
TR: "Yolcu ta\u015f\u0131mac\u0131l\u0131\u011f\u0131",
AR: "\u0646\u0642\u0644 \u0627\u0644\u0631\u0643\u0627\u0628"
},
basic: "0",
chapterLevelIndex: "2.2.21",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 5,
"5": 4,
"6": 15,
"10": 3,
"11": 3,
"12": 1,
"13": 1,
"15": 6,
"16": 6,
"17": 6,
"18": 5,
"19": 15,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 55,
titles: {
DE: "Ladung",
GB: "Cargo",
E: "Cargando",
F: "Chargement",
GR: "\u03a6\u03cc\u03c1\u03c4\u03c9\u03c3\u03b7",
HR: "naplatiti",
I: "Caricamento",
P: "Carregamento",
PL: "\u0141adowanie",
RO: "\u00cenc\u0103rcare",
RUS: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
TR: "\u015farj etmek",
AR: "\u0627\u0644\u0634\u062d\u0646\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.22",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 2,
"5": 1,
"6": 17,
"7": 21,
"8": 21,
"9": 20,
"12": 7,
"13": 9,
"15": 4,
"16": 4,
"17": 4,
"18": 2,
"19": 17,
"20": 7,
"21": 9
},
subcategoryIds: [],
children: []
}, {
id: 64,
titles: {
DE: "Sonstige Pflichten des Fahrzeugf\u00fchrers",
GB: "Other duties of the driver",
E: "Otras funciones del conductor",
F: "Autres obligations du conducteur",
GR: "\u0386\u03bb\u03bb\u03b1 \u03ba\u03b1\u03b8\u03ae\u03ba\u03bf\u03bd\u03c4\u03b1 \u03c4\u03bf\u03c5 \u03bf\u03b4\u03b7\u03b3\u03bf\u03cd",
HR: "Ostale obveze voza\u010da vozila",
I: "Altri compiti dell'autista",
P: "Outras fun\u00e7\u00f5es do condutor",
PL: "Inne obowi\u0105zki kierowcy",
RO: "Alte sarcini ale \u0219oferului",
RUS: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043e\u0431\u044f\u0437\u0430\u043d\u043d\u043e\u0441\u0442\u0438 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
TR: "Ara\u00e7 s\u00fcr\u00fcc\u00fcs\u00fcn\u00fcn di\u011fer y\u00fck\u00fcml\u00fcl\u00fckleri",
AR: "\u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645\u0627\u062a \u0627\u0644\u0623\u062e\u0631\u0649 \u0644\u0633\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0643\u0628\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.23",
questioncount: {
"1": 31,
"2": 31,
"3": 31,
"4": 15,
"5": 8,
"6": 20,
"7": 19,
"8": 16,
"9": 6,
"10": 15,
"11": 15,
"12": 22,
"13": 22,
"15": 31,
"16": 31,
"17": 31,
"18": 15,
"19": 20,
"20": 22,
"21": 22
},
subcategoryIds: [],
children: []
}, {
id: 76,
titles: {
DE: "Verhalten an Fu\u00dfg\u00e4nger\u00fcberwegen und gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior at crosswalks and towards pedestrians",
E: "Comportamiento en los pasos de peatones y hacia los peatones",
F: "Comportement aux passages pi\u00e9tons et vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2 \u03c0\u03b5\u03b6\u03ce\u03bd \u03ba\u03b1\u03b9 \u03c0\u03c1\u03bf\u03c2 \u03c4\u03bf\u03c5\u03c2 \u03c0\u03b5\u03b6\u03bf\u03cd\u03c2",
HR: "Pona\u0161anje na pje\u0161a\u010dkim prijelazima i prema pje\u0161acima",
I: "Comportamento sulle strisce pedonali e verso i pedoni",
P: "Comportamento nas passagens de pe\u00f5es e em direc\u00e7\u00e3o aos pe\u00f5es",
PL: "Zachowanie na przej\u015bciach dla pieszych i wobec pieszych",
RO: "Comportamentul la trecerile de pietoni \u0219i fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043d\u0430 \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u043d\u044b\u0445 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430\u0445 \u0438 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yaya ge\u00e7itlerinde ve yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0639\u0646\u062f \u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0634\u0627\u0629 \u0648\u0646\u062d\u0648 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.26",
questioncount: {
"6": 1,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 72,
titles: {
DE: "\u00dcberm\u00e4\u00dfige Stra\u00dfenbenutzung",
GB: "Excessive road use",
E: "Uso excesivo de la carretera",
F: "Utilisation excessive de la route",
GR: "\u03a5\u03c0\u03b5\u03c1\u03b2\u03bf\u03bb\u03b9\u03ba\u03ae \u03bf\u03b4\u03b9\u03ba\u03ae \u03c7\u03c1\u03ae\u03c3\u03b7",
HR: "Prekomjerno kori\u0161tenje ceste",
I: "Uso eccessivo della strada",
P: "Uso excessivo da estrada",
PL: "Nadmierne korzystanie z dr\u00f3g",
RO: "Utilizarea excesiv\u0103 a drumurilor",
RUS: "\u0427\u0440\u0435\u0437\u043c\u0435\u0440\u043d\u043e\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0433",
TR: "A\u015f\u0131r\u0131 yol kullan\u0131m\u0131",
AR: "\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0641\u0631\u0637 \u0644\u0644\u0637\u0631\u0642"
},
basic: "0",
chapterLevelIndex: "2.2.29",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"7": 3,
"8": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 62,
titles: {
DE: "Sonntagsfahrverbot",
GB: "Sunday driving ban",
E: "Prohibici\u00f3n de conducir los domingos",
F: "Interdiction de circuler le dimanche",
GR: "\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ac\u03c4\u03b9\u03ba\u03b7 \u03b1\u03c0\u03b1\u03b3\u03cc\u03c1\u03b5\u03c5\u03c3\u03b7 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Zabrana vo\u017enje nedjeljom",
I: "Divieto di guida di domenica",
P: "Proibi\u00e7\u00e3o de condu\u00e7\u00e3o aos domingos",
PL: "Zakaz prowadzenia pojazd\u00f3w w niedziel\u0119",
RO: "Interdic\u021bia de a conduce duminica",
RUS: "\u0417\u0430\u043f\u0440\u0435\u0442 \u043d\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u0435 \u0432 \u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435",
TR: "Pazar s\u00fcr\u00fc\u015f yasa\u011f\u0131",
AR: "\u062d\u0638\u0631 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u064a\u0648\u0645 \u0627\u0644\u0623\u062d\u062f"
},
basic: "0",
chapterLevelIndex: "2.2.30",
questioncount: {
"6": 1,
"7": 4,
"8": 3,
"9": 3,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 81,
titles: {
DE: "Verkehrshindernisse",
GB: "Traffic Obstructions",
E: "Obst\u00e1culos al tr\u00e1fico",
F: "Obstacles \u00e0 la circulation",
GR: "\u039a\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ac \u03b5\u03bc\u03c0\u03cc\u03b4\u03b9\u03b1",
HR: "Prometne prepreke",
I: "Ostruzioni al traffico",
P: "Obstru\u00e7\u00f5es de tr\u00e1fego",
PL: "Przeszkody w ruchu drogowym",
RO: "Obstacole \u00een trafic",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u043f\u0440\u0435\u043f\u044f\u0442\u0441\u0442\u0432\u0438\u044f",
TR: "Trafik engelleri",
AR: "\u0627\u0644\u0639\u0648\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0648\u0631\u064a\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.32",
questioncount: {
"6": 2,
"7": 2,
"8": 2,
"9": 1,
"12": 6,
"13": 6,
"19": 2,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 111,
titles: {
DE: "Unfall",
GB: "Accident",
E: "Accidente",
F: "Accident",
GR: "\u0391\u03c4\u03cd\u03c7\u03b7\u03bc\u03b1",
HR: "nesre\u0107a",
I: "Incidente",
P: "Acidente",
PL: "Wypadek",
RO: "Accident",
RUS: "\u041d\u0435\u0441\u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u043b\u0443\u0447\u0430\u0439",
TR: "kaza",
AR: "\u062d\u0627\u062f\u062b\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.34",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"6": 4,
"7": 5,
"8": 5,
"9": 2,
"10": 8,
"11": 8,
"15": 2,
"16": 2,
"17": 2,
"19": 4
},
subcategoryIds: [],
children: []
}, {
id: 88,
titles: {
DE: "Wechsellichtzeichen und Dauerlichtzeichen",
GB: "Alternating and permanent light signals",
E: "Se\u00f1ales luminosas variables y permanentes",
F: "Signaux \u00e0 feux alternatifs et permanents",
GR: "\u039c\u03b5\u03c4\u03b1\u03b2\u03bb\u03b7\u03c4\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03bc\u03cc\u03bd\u03b9\u03bc\u03b5\u03c2 \u03c6\u03c9\u03c4\u03b5\u03b9\u03bd\u03ad\u03c2 \u03c0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b5\u03c2",
HR: "Izmjeni\u010dni svjetlosni signali i trajni svjetlosni signali",
I: "Segni luminosi variabili e permanenti",
P: "Sinais luminosos vari\u00e1veis e permanentes",
PL: "Znaki \u015bwietlne zmienne i sta\u0142e",
RO: "Semne luminoase variabile \u0219i permanente",
RUS: "\u041f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0438 \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0435 \u0441\u0432\u0435\u0442\u043e\u0432\u044b\u0435 \u0432\u044b\u0432\u0435\u0441\u043a\u0438",
TR: "De\u011fi\u015fen \u0131\u015f\u0131k sinyalleri ve kal\u0131c\u0131 \u0131\u015f\u0131k sinyalleri",
AR: "\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u0645\u062a\u0646\u0627\u0648\u0628\u0629 \u0648\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u062f\u0627\u0626\u0645\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.37",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 3,
"6": 5,
"7": 1,
"8": 2,
"10": 2,
"11": 2,
"13": 2,
"15": 5,
"16": 5,
"17": 5,
"18": 3,
"19": 5,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 114,
titles: {
DE: "Blaues Blinklicht und gelbes Blinklicht",
GB: "Blue flashing light and yellow flashing light",
E: "Luz azul intermitente y luz amarilla intermitente",
F: "Feu bleu clignotant et feu jaune clignotant",
GR: "\u039c\u03c0\u03bb\u03b5 \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03af\u03c4\u03c1\u03b9\u03bd\u03bf \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9",
HR: "Trep\u0107u\u0107e plavo svjetlo i trep\u0107u\u0107e \u017euto svjetlo",
I: "Luce lampeggiante blu e luce lampeggiante gialla",
P: "Luz intermitente azul e luz intermitente amarela",
PL: "Niebieskie \u015bwiat\u0142o migaj\u0105ce i \u017c\u00f3\u0142te \u015bwiat\u0142o migaj\u0105ce",
RO: "Lumin\u0103 intermitent\u0103 albastr\u0103 \u0219i lumin\u0103 intermitent\u0103 galben\u0103",
RUS: "\u0421\u0438\u043d\u0438\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442 \u0438 \u0436\u0435\u043b\u0442\u044b\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442",
TR: "Yan\u0131p s\u00f6nen mavi \u0131\u015f\u0131k ve yan\u0131p s\u00f6nen sar\u0131 \u0131\u015f\u0131k",
AR: "\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0632\u0631\u0642 \u0648\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0635\u0641\u0631"
},
basic: "0",
chapterLevelIndex: "2.2.38",
questioncount: {
"6": 1,
"19": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 43,
titles: {
DE: "Verkehrszeichen",
GB: "Traffic signs",
E: "Se\u00f1ales de tr\u00e1fico",
F: "Panneaux de signalisation",
GR: "\u039a\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ad\u03c2 \u03c0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b5\u03c2",
HR: "Prometni znakovi",
I: "Segnali stradali",
P: "Sinais de tr\u00e2nsito",
PL: "Znaki drogowe",
RO: "Semne de circula\u021bie",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0437\u043d\u0430\u043a\u0438",
TR: "Trafik i\u015faretleri",
AR: "\u0627\u0634\u0627\u0631\u0627\u062a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "0",
chapterLevelIndex: "2.4",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 7,
"5": 1,
"6": 30,
"7": 13,
"8": 10,
"9": 2,
"10": 6,
"11": 4,
"12": 12,
"13": 16,
"15": 14,
"16": 14,
"17": 14,
"18": 7,
"19": 30,
"20": 12,
"21": 16
},
subcategoryIds: [ 44, 84, 61, 80 ],
children: [ {
id: 44,
titles: {
DE: "Gefahrzeichen",
GB: "Danger sign",
E: "Se\u00f1ales de peligro",
F: "Panneaux de danger",
GR: "\u03a3\u03ae\u03bc\u03b1\u03c4\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03bf\u03c5",
HR: "Znak opasnosti",
I: "Segnali di pericolo",
P: "Sinais de perigo",
PL: "Znaki ostrzegawcze",
RO: "Semne de pericol",
RUS: "\u0417\u043d\u0430\u043a\u0438 \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
TR: "Tehlike i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062e\u0637\u0631"
},
basic: "0",
chapterLevelIndex: "2.4.40",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"6": 6,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 3,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 6,
"20": 1,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 84,
titles: {
DE: "Vorschriftzeichen",
GB: "Regulation sign",
E: "Se\u00f1al reglamentaria",
F: "Panneau de prescription",
GR: "\u03a1\u03c5\u03b8\u03bc\u03b9\u03c3\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "Propisni znak",
I: "Segno regolamentare",
P: "Sinal regulamentar",
PL: "Znak regulacyjny",
RO: "Semnul de reglementare",
RUS: "\u0420\u0435\u0433\u0443\u043b\u0438\u0440\u0443\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "d\u00fczenleme i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0644\u0627\u0626\u062d\u0629"
},
basic: "0",
chapterLevelIndex: "2.4.41",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"5": 1,
"6": 10,
"7": 11,
"8": 8,
"9": 1,
"10": 5,
"11": 3,
"12": 11,
"13": 12,
"15": 1,
"16": 1,
"17": 1,
"19": 10,
"20": 11,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 61,
titles: {
DE: "Richtzeichen",
GB: "Direction sign",
E: "Se\u00f1al de direcci\u00f3n",
F: "Panneaux indicateurs",
GR: "\u03a0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b1 \u03ba\u03b1\u03c4\u03b5\u03cd\u03b8\u03c5\u03bd\u03c3\u03b7\u03c2",
HR: "Znak smjera",
I: "Segno direzionale",
P: "Sinal direccional",
PL: "Znak kierunkowy",
RO: "Semn direc\u021bional",
RUS: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "y\u00f6n i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0627\u062a\u062c\u0627\u0647"
},
basic: "0",
chapterLevelIndex: "2.4.42",
questioncount: {
"1": 7,
"2": 7,
"3": 7,
"4": 2,
"6": 13,
"7": 1,
"8": 1,
"9": 1,
"13": 1,
"15": 7,
"16": 7,
"17": 7,
"18": 2,
"19": 13,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 80,
titles: {
DE: "Verkehrseinrichtungen",
GB: "Transport facilities",
E: "Instalaciones de tr\u00e1fico",
F: "Dispositifs de circulation",
GR: "\u0395\u03b3\u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Prometni objekti",
I: "Strutture per il traffico",
P: "Facilidades de tr\u00e1fego",
PL: "Udogodnienia w ruchu drogowym",
RO: "Facilit\u0103\u021bi de trafic",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u043e\u043e\u0440\u0443\u0436\u0435\u043d\u0438\u044f",
TR: "Ula\u015f\u0131m tesisleri",
AR: "\u062a\u0633\u0647\u064a\u0644\u0627\u062a \u0627\u0644\u0646\u0642\u0644"
},
basic: "0",
chapterLevelIndex: "2.4.43",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 94,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "0",
chapterLevelIndex: "2.5",
questioncount: {
"1": 9,
"2": 9,
"3": 9,
"4": 5,
"5": 1,
"6": 31,
"7": 8,
"8": 7,
"10": 5,
"11": 4,
"12": 2,
"13": 3,
"15": 9,
"16": 9,
"17": 9,
"18": 5,
"19": 31,
"20": 2,
"21": 3
},
subcategoryIds: [ 99 ],
children: [ {
id: 99,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "0",
chapterLevelIndex: "2.5.1",
questioncount: {
"1": 9,
"2": 9,
"3": 9,
"4": 5,
"5": 1,
"6": 31,
"7": 8,
"8": 7,
"10": 5,
"11": 4,
"12": 2,
"13": 3,
"15": 9,
"16": 9,
"17": 9,
"18": 5,
"19": 31,
"20": 2,
"21": 3
},
subcategoryIds: [],
children: []
} ]
}, {
id: 7,
titles: {
DE: "Vorschriften \u00fcber den Betrieb der Fahrzeuge",
GB: "Rules concerning the operation of vehicles",
E: "Normativa relativa a la circulaci\u00f3n de veh\u00edculos",
F: "Prescriptions relatives \u00e0 l'utilisation des v\u00e9hicules",
GR: "\u039a\u03b1\u03bd\u03bf\u03bd\u03b9\u03c3\u03bc\u03bf\u03af \u03c3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5 \u03c4\u03b7 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03c4\u03c9\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Pravila o upravljanju vozilima",
I: "Regolamenti riguardanti il funzionamento dei veicoli",
P: "Regulamentos relativos ao funcionamento dos ve\u00edculos",
PL: "Przepisy dotycz\u0105ce eksploatacji pojazd\u00f3w",
RO: "Reglement\u0103ri privind exploatarea vehiculelor",
RUS: "\u041f\u0440\u0430\u0432\u0438\u043b\u0430, \u043a\u0430\u0441\u0430\u044e\u0449\u0438\u0435\u0441\u044f \u044d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u0438 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7lar\u0131n \u00e7al\u0131\u015fmas\u0131na ili\u015fkin kurallar",
AR: "\u0642\u0648\u0627\u0639\u062f \u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.6",
questioncount: {
"1": 12,
"2": 13,
"3": 12,
"4": 13,
"5": 14,
"6": 24,
"7": 57,
"8": 56,
"9": 31,
"10": 50,
"11": 47,
"12": 20,
"13": 25,
"15": 12,
"16": 13,
"17": 12,
"18": 13,
"19": 24,
"20": 20,
"21": 25
},
subcategoryIds: [ 74, 90, 16, 56, 31, 8, 100 ],
children: [ {
id: 74,
titles: {
DE: "Untersuchung der Fahrzeuge",
GB: "Examination of the vehicles",
E: "Investigaci\u00f3n de veh\u00edculos",
F: "Examen des v\u00e9hicules",
GR: "\u0394\u03b9\u03b5\u03c1\u03b5\u03cd\u03bd\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Istraga vozila",
I: "Indagine sui veicoli",
P: "Investiga\u00e7\u00e3o de ve\u00edculos",
PL: "Dochodzenie w sprawie pojazd\u00f3w",
RO: "Investigarea vehiculelor",
RUS: "\u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7lar\u0131n incelenmesi",
AR: "\u0627\u0644\u062a\u062d\u0642\u064a\u0642 \u0641\u064a \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.6.1",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"6": 3,
"7": 3,
"8": 2,
"10": 3,
"11": 3,
"12": 1,
"13": 2,
"15": 2,
"16": 2,
"17": 2,
"19": 3,
"20": 1,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 90,
titles: {
DE: "Zulassung zum Stra\u00dfenverkehr, Fahrzeugpapiere, Fahrerlaubnis",
GB: "Admission to road traffic, vehicle documents, driver's license",
E: "Admisi\u00f3n al tr\u00e1fico rodado, documentos del veh\u00edculo, permiso de conducir",
F: "Admission \u00e0 la circulation routi\u00e8re, documents du v\u00e9hicule, permis de conduire",
GR: "\u0395\u03b9\u03c3\u03b1\u03b3\u03c9\u03b3\u03ae \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1, \u03ad\u03b3\u03b3\u03c1\u03b1\u03c6\u03b1 \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03bf\u03c2, \u03ac\u03b4\u03b5\u03b9\u03b1 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Odobrenje za cestovni promet, dokumenti vozila, voza\u010dka dozvola",
I: "Ammissione al traffico stradale, documenti del veicolo, patente di guida",
P: "Admiss\u00e3o ao tr\u00e1fego rodovi\u00e1rio, documentos de ve\u00edculos, carta de condu\u00e7\u00e3o",
PL: "Dopuszczenie do ruchu drogowego, dokumenty pojazdu, prawo jazdy",
RO: "Admiterea \u00een traficul rutier, documentele vehiculului, permisul de conducere",
RUS: "\u0414\u043e\u043f\u0443\u0441\u043a \u043a \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c\u0443 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044e, \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u043d\u0430 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u043e\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043e, \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u0441\u043a\u043e\u0435 \u0443\u0434\u043e\u0441\u0442\u043e\u0432\u0435\u0440\u0435\u043d\u0438\u0435",
TR: "Karayolu trafi\u011fi, ara\u00e7 belgeleri, ehliyet i\u00e7in onay",
AR: "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0633\u064a\u0631 \u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u0642 \u060c \u0648\u062b\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0643\u0628\u0629 \u060c \u0631\u062e\u0635\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629"
},
basic: "0",
chapterLevelIndex: "2.6.2",
questioncount: {
"1": 9,
"2": 10,
"3": 9,
"4": 13,
"5": 14,
"6": 5,
"7": 13,
"8": 14,
"9": 1,
"10": 14,
"11": 13,
"12": 3,
"13": 5,
"15": 9,
"16": 10,
"17": 9,
"18": 13,
"19": 5,
"20": 3,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 16,
titles: {
DE: "Anh\u00e4ngerbetrieb",
GB: "Trailer operation",
E: "Funcionamiento del remolque",
F: "Conduite d'une remorque",
GR: "\u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03c4\u03c1\u03ad\u03b9\u03bb\u03b5\u03c1",
HR: "Rad prikolice",
I: "Funzionamento del rimorchio",
P: "Opera\u00e7\u00e3o de reboque",
PL: "Obs\u0142uga przyczepy",
RO: "Func\u021bionarea remorcii",
RUS: "\u042d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u044f \u043f\u0440\u0438\u0446\u0435\u043f\u0430",
TR: "R\u00f6mork operasyonu",
AR: "\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u0642\u0637\u0648\u0631\u0629"
},
basic: "0",
chapterLevelIndex: "2.6.3",
questioncount: {
"6": 10,
"9": 7,
"10": 1,
"11": 1,
"12": 8,
"13": 9,
"19": 10,
"20": 8,
"21": 9
},
subcategoryIds: [],
children: []
}, {
id: 56,
titles: {
DE: "Lenk- und Ruhezeiten",
GB: "Driving and rest periods",
E: "Periodos de conducci\u00f3n y descanso",
F: "Temps de conduite et de repos",
GR: "\u03a0\u03b5\u03c1\u03af\u03bf\u03b4\u03bf\u03b9 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2 \u03ba\u03b1\u03b9 \u03b1\u03bd\u03ac\u03c0\u03b1\u03c5\u03c3\u03b7\u03c2",
HR: "Razdoblja vo\u017enje i odmora",
I: "Periodi di guida e di riposo",
P: "Per\u00edodos de condu\u00e7\u00e3o e repouso",
PL: "Prowadzenie pojazdu i okresy odpoczynku",
RO: "Perioadele de conducere \u0219i de odihn\u0103",
RUS: "\u0412\u0440\u0435\u043c\u044f \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f \u0438 \u043e\u0442\u0434\u044b\u0445\u0430",
TR: "S\u00fcr\u00fc\u015f ve dinlenme s\u00fcreleri",
AR: "\u0641\u062a\u0631\u0627\u062a \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0648\u0627\u0644\u0631\u0627\u062d\u0629"
},
basic: "0",
chapterLevelIndex: "2.6.4",
questioncount: {
"7": 8,
"8": 9,
"9": 6,
"10": 5,
"11": 5
},
subcategoryIds: [],
children: []
}, {
id: 31,
titles: {
DE: "EG-Kontrollger\u00e4t",
GB: "EC control unit",
E: "Unidad de control CE",
F: "Appareil de contr\u00f4le CE",
GR: "\u039c\u03bf\u03bd\u03ac\u03b4\u03b1 \u03b5\u03bb\u03ad\u03b3\u03c7\u03bf\u03c5 \u0395\u039a",
HR: "EC kontrolni ure\u0111aj",
I: "Unit\u00e0 di controllo CE",
P: "Unidade de controlo CE",
PL: "Jednostka steruj\u0105ca WE",
RO: "Unitatea de control CE",
RUS: "\u0411\u043b\u043e\u043a \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0415\u0421",
TR: "AT kontrol cihaz\u0131",
AR: "\u062c\u0647\u0627\u0632 \u0627\u0644\u062a\u062d\u0643\u0645 EC"
},
basic: "0",
chapterLevelIndex: "2.6.5",
questioncount: {
"7": 8,
"8": 8,
"10": 8,
"11": 8
},
subcategoryIds: [],
children: []
}, {
id: 8,
titles: {
DE: "Abmessungen und Gewichte",
GB: "Dimensions and weights",
E: "Dimensiones y pesos",
F: "Dimensions et poids",
GR: "\u0394\u03b9\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03b1\u03b9 \u03b2\u03ac\u03c1\u03b7",
HR: "Dimenzije i te\u017eine",
I: "Dimensioni e pesi",
P: "Dimens\u00f5es e pesos",
PL: "Wymiary i ci\u0119\u017cary",
RO: "Dimensiuni \u0219i greut\u0103\u021bi",
RUS: "\u0420\u0430\u0437\u043c\u0435\u0440\u044b \u0438 \u0432\u0435\u0441",
TR: "Boyutlar ve a\u011f\u0131rl\u0131klar",
AR: "\u0627\u0644\u0623\u0628\u0639\u0627\u062f \u0648\u0627\u0644\u0623\u0648\u0632\u0627\u0646"
},
basic: "0",
chapterLevelIndex: "2.6.6",
questioncount: {
"6": 3,
"7": 6,
"8": 5,
"9": 8,
"10": 6,
"11": 4,
"12": 8,
"13": 8,
"19": 3,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 100,
titles: {
DE: "Lesen einer Stra\u00dfenkarte und Streckenplanung",
GB: "Reading a road map and route planning",
E: "Lectura de un mapa de carreteras y planificaci\u00f3n de rutas",
F: "Lecture d'une carte routi\u00e8re et planification d'un itin\u00e9raire",
GR: "\u0391\u03bd\u03ac\u03b3\u03bd\u03c9\u03c3\u03b7 \u03bf\u03b4\u03b9\u03ba\u03bf\u03cd \u03c7\u03ac\u03c1\u03c4\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c7\u03b5\u03b4\u03b9\u03b1\u03c3\u03bc\u03cc\u03c2 \u03b4\u03b9\u03b1\u03b4\u03c1\u03bf\u03bc\u03ae\u03c2",
HR: "\u010citanje karte puta i planiranje rute",
I: "Lettura di una mappa stradale e pianificazione del percorso",
P: "Leitura de um mapa de estradas e planeamento de rotas",
PL: "Czytanie mapy drogowej i planowanie trasy",
RO: "Citirea unei h\u0103r\u021bi rutiere \u0219i planificarea traseului",
RUS: "\u0427\u0442\u0435\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u044b \u0438 \u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0430",
TR: "Bir yol haritas\u0131 okuma ve bir rota planlama",
AR: "\u0642\u0631\u0627\u0621\u0629 \u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642 \u0648\u062a\u062e\u0637\u064a\u0637 \u0627\u0644\u0637\u0631\u064a\u0642"
},
basic: "0",
chapterLevelIndex: "2.6.7",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 3,
"7": 19,
"8": 18,
"9": 9,
"10": 13,
"11": 13,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 3,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 39,
titles: {
DE: "Technik",
GB: "Technology",
E: "Tecnolog\u00eda",
F: "Technique",
GR: "\u03a4\u03b5\u03c7\u03bd\u03bf\u03bb\u03bf\u03b3\u03af\u03b1",
HR: "tehnologija",
I: "Tecnologia",
P: "Tecnologia",
PL: "Technologia",
RO: "Tehnologie",
RUS: "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f",
TR: "teknoloji",
AR: "\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627"
},
basic: "0",
chapterLevelIndex: "2.7",
questioncount: {
"1": 78,
"2": 77,
"3": 78,
"4": 41,
"5": 12,
"6": 120,
"7": 142,
"8": 95,
"9": 81,
"10": 149,
"11": 130,
"12": 39,
"13": 71,
"15": 78,
"16": 77,
"17": 78,
"18": 41,
"19": 120,
"20": 39,
"21": 71
},
subcategoryIds: [ 40, 101, 102, 103, 104, 105, 106, 107, 108, 109 ],
children: [ {
id: 40,
titles: {
DE: "Fahrbetrieb, Fahrphysik, Fahrtechnik",
GB: "Driving operation, driving physics, driving technique",
E: "Funcionamiento de la conducci\u00f3n, f\u00edsica de la conducci\u00f3n, t\u00e9cnica de la conducci\u00f3n",
F: "Conduite, physique de conduite, technique de conduite",
GR: "\u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c6\u03c5\u03c3\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c4\u03b5\u03c7\u03bd\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Operacija vo\u017enje, fizika vo\u017enje, tehnika vo\u017enje",
I: "Funzionamento della guida, fisica della guida, tecnica di guida",
P: "Opera\u00e7\u00e3o de condu\u00e7\u00e3o, f\u00edsica de condu\u00e7\u00e3o, t\u00e9cnica de condu\u00e7\u00e3o",
PL: "Prowadzenie pojazdu, fizyka jazdy, technika jazdy",
RO: "Func\u021bionarea la volan, fizica conducerii, tehnica conducerii",
RUS: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u043c, \u0444\u0438\u0437\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f, \u0442\u0435\u0445\u043d\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f",
TR: "S\u00fcr\u00fc\u015f operasyonu, s\u00fcr\u00fc\u015f fizi\u011fi, s\u00fcr\u00fc\u015f tekni\u011fi",
AR: "\u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u0641\u064a\u0632\u064a\u0627\u0621 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.1",
questioncount: {
"1": 45,
"2": 45,
"3": 45,
"4": 23,
"5": 8,
"6": 57,
"7": 28,
"8": 22,
"9": 8,
"10": 44,
"11": 47,
"12": 10,
"13": 14,
"15": 45,
"16": 45,
"17": 45,
"18": 23,
"19": 57,
"20": 10,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 101,
titles: {
DE: "M\u00e4ngelerkennung, Lokalisierung von St\u00f6rungen",
GB: "Defect detection, localization of faults",
E: "Detecci\u00f3n de defectos, localizaci\u00f3n de aver\u00edas",
F: "D\u00e9tection des d\u00e9fauts, localisation des pannes",
GR: "\u0391\u03bd\u03af\u03c7\u03bd\u03b5\u03c5\u03c3\u03b7 \u03b5\u03bb\u03b1\u03c4\u03c4\u03c9\u03bc\u03ac\u03c4\u03c9\u03bd, \u03b5\u03bd\u03c4\u03bf\u03c0\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c3\u03c6\u03b1\u03bb\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Detekcija kvarova, lokalizacija kvarova",
I: "Rilevare i difetti, localizzare i guasti",
P: "Detec\u00e7\u00e3o de defeitos, localiza\u00e7\u00e3o de avarias",
PL: "Wykrywanie wad, lokalizowanie usterek",
RO: "Detectarea defectelor, localizarea defectelor",
RUS: "\u0412\u044b\u044f\u0432\u043b\u0435\u043d\u0438\u0435 \u0434\u0435\u0444\u0435\u043a\u0442\u043e\u0432, \u043b\u043e\u043a\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0435\u0439",
TR: "Ar\u0131za tespiti, ar\u0131zalar\u0131n lokalizasyonu",
AR: "\u0643\u0634\u0641 \u0627\u0644\u062e\u0644\u0644 \u060c \u062a\u0648\u0637\u064a\u0646 \u0627\u0644\u0623\u0639\u0637\u0627\u0644"
},
basic: "0",
chapterLevelIndex: "2.7.2",
questioncount: {
"1": 25,
"2": 24,
"3": 25,
"4": 13,
"6": 35,
"7": 16,
"8": 16,
"9": 7,
"10": 15,
"11": 14,
"12": 3,
"13": 12,
"15": 25,
"16": 24,
"17": 25,
"18": 13,
"19": 35,
"20": 3,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 102,
titles: {
DE: "Verbrennungsmaschine, Fl\u00fcssigkeiten, Kraftstoffsystem, elektrische Anlage, Z\u00fcndung, Kraft\u00fcbertragung",
GB: "combustion engine, fluids, fuel system, electrical system, ignition, power transmission",
E: "Motor de combusti\u00f3n interna, fluidos, sistema de combustible, sistema el\u00e9ctrico, encendido, transmisi\u00f3n de potencia",
F: "Moteur \u00e0 combustion interne, fluides, syst\u00e8me de carburant, syst\u00e8me \u00e9lectrique, allumage, transmission de puissance",
GR: "\u039a\u03b9\u03bd\u03b7\u03c4\u03ae\u03c1\u03b1\u03c2 \u03b5\u03c3\u03c9\u03c4\u03b5\u03c1\u03b9\u03ba\u03ae\u03c2 \u03ba\u03b1\u03cd\u03c3\u03b7\u03c2, \u03c5\u03b3\u03c1\u03ac, \u03c3\u03cd\u03c3\u03c4\u03b7\u03bc\u03b1 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03bf\u03c5, \u03b7\u03bb\u03b5\u03ba\u03c4\u03c1\u03b9\u03ba\u03cc \u03c3\u03cd\u03c3\u03c4\u03b7\u03bc\u03b1, \u03b1\u03bd\u03ac\u03c6\u03bb\u03b5\u03be\u03b7, \u03bc\u03b5\u03c4\u03ac\u03b4\u03bf\u03c3\u03b7 \u03b9\u03c3\u03c7\u03cd\u03bf\u03c2",
HR: "Motor s unutarnjim izgaranjem, teku\u0107ine, sustav goriva, elektri\u010dni sustav, paljenje, prijenos snage",
I: "Motore a combustione interna, fluidi, sistema di alimentazione, sistema elettrico, accensione, trasmissione di potenza",
P: "Motor de combust\u00e3o interna, fluidos, sistema de combust\u00edvel, sistema el\u00e9ctrico, igni\u00e7\u00e3o, transmiss\u00e3o de energia",
PL: "Silnik spalinowy, p\u0142yny, uk\u0142ad paliwowy, uk\u0142ad elektryczny, zap\u0142on, przeniesienie nap\u0119du",
RO: "Motor cu ardere intern\u0103, fluide, sistem de alimentare, sistem electric, aprindere, transmisie de putere",
RUS: "\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043b\u044c \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0435\u0433\u043e \u0441\u0433\u043e\u0440\u0430\u043d\u0438\u044f, \u0436\u0438\u0434\u043a\u043e\u0441\u0442\u0438, \u0442\u043e\u043f\u043b\u0438\u0432\u043d\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430, \u044d\u043b\u0435\u043a\u0442\u0440\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430, \u0437\u0430\u0436\u0438\u0433\u0430\u043d\u0438\u0435, \u0442\u0440\u0430\u043d\u0441\u043c\u0438\u0441\u0441\u0438\u044f",
TR: "Yanmal\u0131 motor, s\u0131v\u0131lar, yak\u0131t sistemi, elektrik sistemi, ate\u015fleme, g\u00fc\u00e7 aktar\u0131m\u0131",
AR: "\u0645\u062d\u0631\u0643 \u0627\u0644\u0627\u062d\u062a\u0631\u0627\u0642 \u060c \u0648\u0627\u0644\u0633\u0648\u0627\u0626\u0644 \u060c \u0648\u0646\u0638\u0627\u0645 \u0627\u0644\u0648\u0642\u0648\u062f \u060c \u0648\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a \u060c \u0648\u0627\u0644\u0625\u0634\u0639\u0627\u0644 \u060c \u0648\u0646\u0642\u0644 \u0627\u0644\u0637\u0627\u0642\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.3",
questioncount: {
"6": 2,
"7": 13,
"8": 4,
"10": 12,
"11": 4,
"12": 4,
"13": 4,
"19": 2,
"20": 4,
"21": 4
},
subcategoryIds: [],
children: []
}, {
id: 103,
titles: {
DE: "Schmier- und Frostschutzmittel",
GB: "Lubricant and antifreeze",
E: "Lubricantes y anticongelantes",
F: "Lubrifiants et antigels",
GR: "\u039b\u03b9\u03c0\u03b1\u03bd\u03c4\u03b9\u03ba\u03ac \u03ba\u03b1\u03b9 \u03b1\u03bd\u03c4\u03b9\u03c8\u03c5\u03ba\u03c4\u03b9\u03ba\u03ac",
HR: "Maziva i sredstva protiv smrzavanja",
I: "Lubrificanti e antigelo",
P: "Lubrificantes e anticongelantes",
PL: "Smary i \u015brodki przeciw zamarzaniu",
RO: "Lubrifian\u021bi \u0219i antigel",
RUS: "\u0421\u043c\u0430\u0437\u043e\u0447\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0438 \u0430\u043d\u0442\u0438\u0444\u0440\u0438\u0437",
TR: "Ya\u011flay\u0131c\u0131lar ve antifriz maddeleri",
AR: "\u0645\u0648\u0627\u062f \u0627\u0644\u062a\u0634\u062d\u064a\u0645 \u0648\u0627\u0644\u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u0645\u0636\u0627\u062f\u0629 \u0644\u0644\u062a\u062c\u0645\u062f"
},
basic: "0",
chapterLevelIndex: "2.7.4",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 1,
"6": 3,
"7": 6,
"8": 2,
"10": 6,
"11": 3,
"12": 3,
"13": 3,
"15": 3,
"16": 3,
"17": 3,
"18": 1,
"19": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 104,
titles: {
DE: "Verwendung und Wartung von Reifen",
GB: "Use and maintenance of tires",
E: "Uso y mantenimiento de los neum\u00e1ticos",
F: "Utilisation et entretien des pneus",
GR: "\u03a7\u03c1\u03ae\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c5\u03bd\u03c4\u03ae\u03c1\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03b5\u03bb\u03b1\u03c3\u03c4\u03b9\u03ba\u03ce\u03bd",
HR: "Kori\u0161tenje i odr\u017eavanje guma",
I: "Uso e manutenzione dei pneumatici",
P: "Utiliza\u00e7\u00e3o e manuten\u00e7\u00e3o de pneus",
PL: "U\u017cytkowanie i konserwacja opon",
RO: "Utilizarea \u0219i \u00eentre\u021binerea pneurilor",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0438 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u0448\u0438\u043d",
TR: "Lastiklerin kullan\u0131m\u0131 ve bak\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062a \u0648\u0635\u064a\u0627\u0646\u062a\u0647\u0627"
},
basic: "0",
chapterLevelIndex: "2.7.5",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 4,
"5": 3,
"6": 10,
"7": 19,
"8": 16,
"9": 10,
"10": 17,
"11": 16,
"12": 4,
"13": 5,
"15": 4,
"16": 4,
"17": 4,
"18": 4,
"19": 10,
"20": 4,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 105,
titles: {
DE: "Bremsanlagen und Geschwindigkeitsregler",
GB: "Braking systems and speed controllers",
E: "Sistemas de frenado y control de crucero",
F: "Syst\u00e8mes de freinage et r\u00e9gulateurs de vitesse",
GR: "\u03a3\u03c5\u03c3\u03c4\u03ae\u03bc\u03b1\u03c4\u03b1 \u03c0\u03ad\u03b4\u03b7\u03c3\u03b7\u03c2 \u03ba\u03b1\u03b9 cruise control",
HR: "Sustavi ko\u010denja i regulatori brzine",
I: "Sistemi frenanti e controllo di crociera",
P: "Sistemas de travagem e controlo de velocidade de cruzeiro",
PL: "Uk\u0142ady hamulcowe i tempomat",
RO: "Sisteme de fr\u00e2nare \u0219i control al vitezei de croazier\u0103",
RUS: "\u0422\u043e\u0440\u043c\u043e\u0437\u043d\u044b\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u044b \u0438 \u043a\u0440\u0443\u0438\u0437-\u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c",
TR: "Fren sistemleri ve h\u0131z reg\u00fclat\u00f6rleri",
AR: "\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0643\u0628\u062d \u0648\u0645\u0646\u0638\u0645\u0627\u062a \u0627\u0644\u0633\u0631\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.6",
questioncount: {
"6": 12,
"7": 31,
"8": 24,
"9": 13,
"10": 32,
"11": 24,
"12": 4,
"13": 13,
"19": 12,
"20": 4,
"21": 13
},
subcategoryIds: [],
children: []
}, {
id: 106,
titles: {
DE: "Anh\u00e4ngerkupplungssysteme",
GB: "Trailer coupling systems",
E: "Sistemas de acoplamiento de remolques",
F: "Syst\u00e8mes d'attelage de remorque",
GR: "\u03a3\u03c5\u03c3\u03c4\u03ae\u03bc\u03b1\u03c4\u03b1 \u03b6\u03b5\u03cd\u03be\u03b7\u03c2 \u03c1\u03c5\u03bc\u03bf\u03c5\u03bb\u03ba\u03bf\u03cd\u03bc\u03b5\u03bd\u03c9\u03bd",
HR: "Sustavi spojnica za prikolice",
I: "Sistemi di aggancio per rimorchi",
P: "Sistemas de acoplamento de reboques",
PL: "Systemy sprz\u0119gania przyczep",
RO: "Sisteme de cuplare a remorcilor",
RUS: "\u0421\u0438\u0441\u0442\u0435\u043c\u044b \u0441\u0446\u0435\u043f\u043b\u0435\u043d\u0438\u044f \u043f\u0440\u0438\u0446\u0435\u043f\u043e\u0432",
TR: "R\u00f6mork ba\u011flant\u0131 sistemleri",
AR: "\u0623\u0646\u0638\u0645\u0629 \u0627\u0642\u062a\u0631\u0627\u0646 \u0627\u0644\u0645\u0642\u0637\u0648\u0631\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.7",
questioncount: {
"7": 3,
"8": 3,
"9": 20,
"10": 2,
"11": 2,
"12": 7,
"13": 16,
"20": 7,
"21": 16
},
subcategoryIds: [],
children: []
}, {
id: 107,
titles: {
DE: "Wartung von Kraftfahrzeugen und rechtzeitige Veranlassung von Reparaturen",
GB: "Maintenance of motor vehicles and timely initiation of repairs",
E: "Mantenimiento de los veh\u00edculos de motor y arreglo oportuno de las reparaciones",
F: "Entretien des v\u00e9hicules \u00e0 moteur et organisation des r\u00e9parations en temps utile",
GR: "\u03a3\u03c5\u03bd\u03c4\u03ae\u03c1\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03bc\u03b7\u03c7\u03b1\u03bd\u03bf\u03ba\u03af\u03bd\u03b7\u03c4\u03c9\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd \u03ba\u03b1\u03b9 \u03ad\u03b3\u03ba\u03b1\u03b9\u03c1\u03b7 \u03b4\u03b9\u03b5\u03c5\u03b8\u03ad\u03c4\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03b5\u03c0\u03b9\u03c3\u03ba\u03b5\u03c5\u03ce\u03bd",
HR: "Odr\u017eavanje motornih vozila i pravovremeni popravci",
I: "Manutenzione dei veicoli a motore e disposizione tempestiva delle riparazioni",
P: "Manuten\u00e7\u00e3o de ve\u00edculos motorizados e organiza\u00e7\u00e3o atempada de repara\u00e7\u00f5es",
PL: "Utrzymanie pojazd\u00f3w silnikowych i terminowe dokonywanie napraw",
RO: "\u00centre\u021binerea autovehiculelor \u0219i aranjarea la timp a repara\u021biilor",
RUS: "\u0422\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0430 \u0438 \u0441\u0432\u043e\u0435\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u0430\u044f \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f \u0440\u0435\u043c\u043e\u043d\u0442\u0430",
TR: "Motorlu ta\u015f\u0131tlar\u0131n bak\u0131m\u0131 ve zaman\u0131nda onar\u0131mlar",
AR: "\u0635\u064a\u0627\u0646\u0629 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a \u0648\u0627\u0644\u0625\u0635\u0644\u0627\u062d\u0627\u062a \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0645\u0646\u0627\u0633\u0628"
},
basic: "0",
chapterLevelIndex: "2.7.8",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"7": 8,
"9": 5,
"10": 8,
"11": 8,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 108,
titles: {
DE: "Entgegennahme, Transport und Ablieferung der G\u00fcter",
GB: "Receipt, transport and delivery of goods",
E: "Recepci\u00f3n, transporte y entrega de mercanc\u00edas",
F: "R\u00e9ception, transport et livraison des marchandises",
GR: "\u03a0\u03b1\u03c1\u03b1\u03bb\u03b1\u03b2\u03ae, \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ac \u03ba\u03b1\u03b9 \u03c0\u03b1\u03c1\u03ac\u03b4\u03bf\u03c3\u03b7 \u03b1\u03b3\u03b1\u03b8\u03ce\u03bd",
HR: "Prijem, transport i isporuka robe",
I: "Ricevimento, trasporto e consegna delle merci",
P: "Recep\u00e7\u00e3o, transporte e entrega de mercadorias",
PL: "Odbi\u00f3r, transport i dostawa towar\u00f3w",
RO: "Recep\u021bia, transportul \u0219i livrarea m\u0103rfurilor",
RUS: "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435, \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0430 \u0438 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0442\u043e\u0432\u0430\u0440\u043e\u0432",
TR: "Mallar\u0131n al\u0131nmas\u0131, nakliyesi ve teslimi",
AR: "\u0627\u0633\u062a\u0644\u0627\u0645 \u0648\u0646\u0642\u0644 \u0648\u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u0628\u0636\u0627\u0626\u0639"
},
basic: "0",
chapterLevelIndex: "2.7.9",
questioncount: {
"7": 18,
"8": 8,
"9": 18,
"10": 1,
"11": 1,
"12": 3,
"13": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 109,
titles: {
DE: "Ausr\u00fcstung von Fahrzeugen",
GB: "Equipment of vehicles",
E: "Equipamiento de veh\u00edculos",
F: "\u00c9quipement des v\u00e9hicules",
GR: "\u0395\u03be\u03bf\u03c0\u03bb\u03b9\u03c3\u03bc\u03cc\u03c2 \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Oprema vozila",
I: "Attrezzatura dei veicoli",
P: "Equipamento de ve\u00edculos",
PL: "Wyposa\u017cenie pojazd\u00f3w",
RO: "Echiparea vehiculelor",
RUS: "\u041e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7 ekipmanlar\u0131",
AR: "\u0645\u0639\u062f\u0627\u062a \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.7.10",
questioncount: {
"5": 1,
"10": 12,
"11": 11
},
subcategoryIds: [],
children: []
} ]
}, {
id: 95,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Qualification and ability of drivers",
E: "Idoneidad y competencia de los conductores",
F: "Aptitude et comp\u00e9tences des conducteurs",
GR: "\u039a\u03b1\u03c4\u03b1\u03bb\u03bb\u03b7\u03bb\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03c9\u03bd \u03bf\u03b4\u03b7\u03b3\u03ce\u03bd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Idoneit\u00e0 e competenza dei conducenti",
P: "Adequa\u00e7\u00e3o e compet\u00eancia dos condutores",
PL: "Przydatno\u015b\u0107 i kompetencje maszynist\u00f3w",
RO: "Aptitudinea \u0219i competen\u021ba conduc\u0103torilor auto",
RUS: "\u041f\u0440\u0438\u0433\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.8",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 1,
"6": 5,
"7": 4,
"8": 3,
"9": 1,
"10": 6,
"11": 5,
"12": 1,
"13": 1,
"15": 5,
"16": 5,
"17": 5,
"18": 1,
"19": 5,
"20": 1,
"21": 1
},
subcategoryIds: [ 110 ],
children: [ {
id: 110,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Suitability and competence of drivers",
E: "Idoneidad y competencia de los conductores",
F: "aptitude et comp\u00e9tences des conducteurs",
GR: "\u039a\u03b1\u03c4\u03b1\u03bb\u03bb\u03b7\u03bb\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03c9\u03bd \u03bf\u03b4\u03b7\u03b3\u03ce\u03bd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Idoneit\u00e0 e competenza dei conducenti",
P: "Adequa\u00e7\u00e3o e compet\u00eancia dos condutores",
PL: "Zdolno\u015b\u0107 i kompetencje maszynist\u00f3w",
RO: "Aptitudinea \u0219i competen\u021ba conduc\u0103torilor auto",
RUS: "\u041f\u0440\u0438\u0433\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.8.1",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 1,
"6": 5,
"7": 4,
"8": 3,
"9": 1,
"10": 6,
"11": 5,
"12": 1,
"13": 1,
"15": 5,
"16": 5,
"17": 5,
"18": 1,
"19": 5,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
} ]
} ];
}

function initCategoryTree1() {
function b(a) {
return {
icon: a.children.length ? "assets/folder.png" : "assets/file.png",
classes: a.children.length ? "categorybranch" : "categoryleave",
content: Object.keys(a.titles).map(function(b) {
return '<span class="t_' + b.toLowerCase() + '">' + a.titles[b] + "</span>";
}).join(""),
attributes: {
chapterLevelIndex: a.chapterLevelIndex,
categoryId: a.id,
basic: a.basic,
subcategoryIds: a.subcategoryIds,
questioncount: a.questioncount
},
expandable: !!a.children.length,
expanded: !1,
components: a.children.map(b)
};
}
var a = getCategoryTree1Data(), c = [ {
kind: "Node",
icon: "assets/folder-big.png",
name: "nodBasicClassContent",
allowHtml: !0,
classes: "categoryroot",
content: "GRUNDSTOFF",
attributes: {
chapterLevelIndex: "1"
},
expandable: !0,
expanded: !1,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: a[0].children.map(b)
}, {
kind: "Node",
icon: "assets/folder-big.png",
name: "nodExtClassContent",
allowHtml: !0,
classes: "categoryroot",
content: "ZUSATZSTOFF",
attributes: {
chapterLevelIndex: "2"
},
expandable: !0,
expanded: !1,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: a[1].children.map(b)
} ];
return c;
}

// ../data/2/tblCategories.js

function getCategoryTree2Date() {
return "2023-10-01";
}

function getCategoryTree2Data() {
return [ {
id: 1,
titles: {
DE: "Grundstoff",
GB: "Basic knowledge",
E: "Materia b\u00e1sica",
F: "Mati\u00e8re de base",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03ae \u03cd\u03bb\u03b7",
HR: "Osnovno \u0161tivo",
I: "Materiale di base",
P: "Mat\u00e9ria fundamental",
PL: "Materia\u0142 podstawowy",
RO: "Materia de baz\u0103",
RUS: "\u0411\u0430\u0437\u043e\u0432\u044b\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b",
TR: "Temel konular",
AR: "\u0627\u0644\u0645\u0627\u062f\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1",
questioncount: {
"1": 629,
"2": 629,
"3": 629,
"4": 629,
"5": 273,
"6": 629,
"7": 629,
"8": 629,
"9": 629,
"10": 629,
"11": 629,
"12": 629,
"13": 629,
"15": 629,
"16": 629,
"17": 629,
"18": 629,
"19": 629,
"20": 629,
"21": 629
},
subcategoryIds: [ 13, 2, 91, 41, 92, 37, 93 ],
children: [ {
id: 13,
titles: {
DE: "Gefahrenlehre",
GB: "Danger theory",
E: "Teor\u00eda del peligro",
F: "Th\u00e9orie des dangers",
GR: "\u0398\u03b5\u03c9\u03c1\u03af\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03bf\u03c5",
HR: "Teorija opasnosti",
I: "Teoria del pericolo",
P: "Teoria do perigo",
PL: "Teoria zagro\u017ce\u0144",
RO: "Teoria pericolului",
RUS: "\u0422\u0435\u043e\u0440\u0438\u044f \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
TR: "tehlike teorisi",
AR: "\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631"
},
basic: "1",
chapterLevelIndex: "1.1",
questioncount: {
"1": 174,
"2": 174,
"3": 174,
"4": 174,
"5": 80,
"6": 174,
"7": 174,
"8": 174,
"9": 174,
"10": 174,
"11": 174,
"12": 174,
"13": 174,
"15": 174,
"16": 174,
"17": 174,
"18": 174,
"19": 174,
"20": 174,
"21": 174
},
subcategoryIds: [ 49, 77, 35, 29, 45, 68, 26, 14, 112 ],
children: [ {
id: 49,
titles: {
DE: "Grundformen des Verkehrsverhaltens",
GB: "Basic forms of traffic behavior",
E: "Formas b\u00e1sicas de comportamiento del tr\u00e1fico",
F: "Formes de base du comportement routier",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03ad\u03c2 \u03bc\u03bf\u03c1\u03c6\u03ad\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ae\u03c2 \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac\u03c2",
HR: "Osnovni oblici pona\u0161anja u prometu",
I: "Forme di base del comportamento del traffico",
P: "Formas b\u00e1sicas de comportamento no tr\u00e2nsito",
PL: "Podstawowe formy zachowania w ruchu drogowym",
RO: "Forme de baz\u0103 ale comportamentului \u00een trafic",
RUS: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0444\u043e\u0440\u043c\u044b \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435",
TR: "Temel trafik davran\u0131\u015f\u0131 bi\u00e7imleri",
AR: "\u0627\u0644\u0623\u0634\u0643\u0627\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0631\u0648\u0631\u064a"
},
basic: "1",
chapterLevelIndex: "1.1.1",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 4,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 77,
titles: {
DE: "Verhalten gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior towards pedestrians",
E: "Comportamiento con los peatones",
F: "Comportement vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03ad\u03bd\u03b1\u03bd\u03c4\u03b9 \u03c4\u03c9\u03bd \u03c0\u03b5\u03b6\u03ce\u03bd",
HR: "Pona\u0161anje prema pje\u0161acima",
I: "Comportamento verso i pedoni",
P: "Comportamento para com os pe\u00f5es",
PL: "Zachowanie wobec pieszych",
RO: "Comportamentul fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u062a\u062c\u0627\u0647 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.2",
questioncount: {
"1": 37,
"2": 37,
"3": 37,
"4": 37,
"5": 26,
"6": 37,
"7": 37,
"8": 37,
"9": 37,
"10": 37,
"11": 37,
"12": 37,
"13": 37,
"15": 37,
"16": 37,
"17": 37,
"18": 37,
"19": 37,
"20": 37,
"21": 37
},
subcategoryIds: [],
children: []
}, {
id: 35,
titles: {
DE: "Fahrbahn- und Witterungsverh\u00e4ltnisse",
GB: "Road and weather conditions",
E: "Condiciones de la carretera y del tiempo",
F: "Conditions de la chauss\u00e9e et conditions m\u00e9t\u00e9orologiques",
GR: "\u039f\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03b9\u03c1\u03b9\u03ba\u03ad\u03c2 \u03c3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b5\u03c2",
HR: "Cestovni i vremenski uvjeti",
I: "Condizioni stradali e meteorologiche",
P: "Condi\u00e7\u00f5es rodovi\u00e1rias e meteorol\u00f3gicas",
PL: "Warunki drogowe i pogodowe",
RO: "Condi\u021bii rutiere \u0219i meteorologice",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0438 \u043f\u043e\u0433\u043e\u0434\u043d\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f",
TR: "Yol ve hava ko\u015fullar\u0131",
AR: "\u0623\u062d\u0648\u0627\u0644 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0637\u0642\u0633"
},
basic: "1",
chapterLevelIndex: "1.1.3",
questioncount: {
"1": 17,
"2": 17,
"3": 17,
"4": 17,
"5": 5,
"6": 17,
"7": 17,
"8": 17,
"9": 17,
"10": 17,
"11": 17,
"12": 17,
"13": 17,
"15": 17,
"16": 17,
"17": 17,
"18": 17,
"19": 17,
"20": 17,
"21": 17
},
subcategoryIds: [],
children: []
}, {
id: 29,
titles: {
DE: "Dunkelheit und schlechte Sicht",
GB: "Darkness and poor visibility",
E: "Oscuridad y poca visibilidad",
F: "Obscurit\u00e9 et mauvaise visibilit\u00e9",
GR: "\u03a3\u03ba\u03bf\u03c4\u03ac\u03b4\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03ba\u03ae \u03bf\u03c1\u03b1\u03c4\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Mrak i slab vid",
I: "Buio e scarsa visibilit\u00e0",
P: "Escurid\u00e3o e m\u00e1 visibilidade",
PL: "Ciemno\u015b\u0107 i s\u0142aba widoczno\u015b\u0107",
RO: "\u00centuneric \u0219i vizibilitate redus\u0103",
RUS: "\u0422\u0435\u043c\u043d\u043e\u0442\u0430 \u0438 \u043f\u043b\u043e\u0445\u0430\u044f \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c",
TR: "Karanl\u0131k ve zay\u0131f g\u00f6r\u00fc\u015f",
AR: "\u0627\u0644\u0638\u0644\u0627\u0645 \u0648\u0636\u0639\u0641 \u0627\u0644\u0631\u0624\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.4",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"6": 5,
"7": 5,
"8": 5,
"9": 5,
"10": 5,
"11": 5,
"12": 5,
"13": 5,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 5,
"20": 5,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 45,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.5",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 6,
"5": 4,
"6": 6,
"7": 6,
"8": 6,
"9": 6,
"10": 6,
"11": 6,
"12": 6,
"13": 6,
"15": 6,
"16": 6,
"17": 6,
"18": 6,
"19": 6,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 68,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "1",
chapterLevelIndex: "1.1.6",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 4,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 26,
titles: {
DE: "Besondere Verkehrssituationen",
GB: "Special traffic scenarios",
E: "Situaciones especiales de tr\u00e1fico",
F: "Situations de circulation particuli\u00e8res",
GR: "\u0395\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Posebne prometne situacije",
I: "Situazioni speciali di traffico",
P: "Situa\u00e7\u00f5es especiais de tr\u00e1fego",
PL: "Szczeg\u00f3lne sytuacje w ruchu drogowym",
RO: "Situa\u021bii speciale de trafic",
RUS: "\u041e\u0441\u043e\u0431\u044b\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
TR: "\u00d6zel trafik durumlar\u0131",
AR: "\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062e\u0627\u0635\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.7",
questioncount: {
"1": 62,
"2": 62,
"3": 62,
"4": 62,
"5": 20,
"6": 62,
"7": 62,
"8": 62,
"9": 62,
"10": 62,
"11": 62,
"12": 62,
"13": 62,
"15": 62,
"16": 62,
"17": 62,
"18": 62,
"19": 62,
"20": 62,
"21": 62
},
subcategoryIds: [],
children: []
}, {
id: 14,
titles: {
DE: "Alkohol, Drogen, Medikamente",
GB: "Alcohol, drugs, medication",
E: "Alcohol, drogas, medicamentos",
F: "Alcool, drogues, m\u00e9dicaments",
GR: "\u0391\u03bb\u03ba\u03bf\u03cc\u03bb, \u03bd\u03b1\u03c1\u03ba\u03c9\u03c4\u03b9\u03ba\u03ac, \u03c6\u03ac\u03c1\u03bc\u03b1\u03ba\u03b1",
HR: "Alkohol, droge, lijekovi",
I: "Alcool, droghe, farmaci",
P: "\u00c1lcool, drogas, medicamentos",
PL: "Alkohol, narkotyki, leki",
RO: "Alcool, droguri, medicamente",
RUS: "\u0410\u043b\u043a\u043e\u0433\u043e\u043b\u044c, \u043d\u0430\u0440\u043a\u043e\u0442\u0438\u043a\u0438, \u043b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0430",
TR: "Alkol, uyu\u015fturucu, ila\u00e7",
AR: "\u0627\u0644\u0643\u062d\u0648\u0644 \u0648\u0627\u0644\u0645\u062e\u062f\u0631\u0627\u062a \u0648\u0627\u0644\u0623\u062f\u0648\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.1.9",
questioncount: {
"1": 18,
"2": 18,
"3": 18,
"4": 18,
"5": 16,
"6": 18,
"7": 18,
"8": 18,
"9": 18,
"10": 18,
"11": 18,
"12": 18,
"13": 18,
"15": 18,
"16": 18,
"17": 18,
"18": 18,
"19": 18,
"20": 18,
"21": 18
},
subcategoryIds: [],
children: []
}, {
id: 112,
titles: {
DE: "Erm\u00fcdung, Ablenkung",
GB: "Fatigue, distraction",
E: "Fatiga, distracci\u00f3n",
F: "Fatigue, distraction",
GR: "\u039a\u03cc\u03c0\u03c9\u03c3\u03b7, \u03b1\u03c0\u03cc\u03c3\u03c0\u03b1\u03c3\u03b7 \u03c0\u03c1\u03bf\u03c3\u03bf\u03c7\u03ae\u03c2",
HR: "Umor, rastresenost",
I: "Fatica, distrazione",
P: "Fadiga, distrac\u00e7\u00e3o",
PL: "Zm\u0119czenie, rozproszenie uwagi",
RO: "Oboseal\u0103, distragere a aten\u021biei",
RUS: "\u0423\u0441\u0442\u0430\u043b\u043e\u0441\u0442\u044c, \u0440\u0430\u0441\u0441\u0435\u044f\u043d\u043d\u043e\u0441\u0442\u044c",
TR: "Yorgunluk, dikkat da\u011f\u0131n\u0131kl\u0131\u011f\u0131",
AR: "\u0627\u0644\u062a\u0639\u0628 \u0648\u0627\u0644\u0625\u0644\u0647\u0627\u0621"
},
basic: "1",
chapterLevelIndex: "1.1.10",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 2,
titles: {
DE: "Verhalten im Stra\u00dfenverkehr",
GB: "Behavior in road traffic",
E: "Comportamiento en el tr\u00e1fico rodado",
F: "Comportement dans la circulation routi\u00e8re",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1",
HR: "Pona\u0161anje u prometu",
I: "Comportamento nel traffico stradale",
P: "Comportamento no tr\u00e1fego rodovi\u00e1rio",
PL: "Zachowanie w ruchu drogowym",
RO: "Comportamentul \u00een traficul rutier",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438",
TR: "trafikte davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "1",
chapterLevelIndex: "1.2",
questioncount: {
"1": 232,
"2": 232,
"3": 232,
"4": 232,
"5": 102,
"6": 232,
"7": 232,
"8": 232,
"9": 232,
"10": 232,
"11": 232,
"12": 232,
"13": 232,
"15": 232,
"16": 232,
"17": 232,
"18": 232,
"19": 232,
"20": 232,
"21": 232
},
subcategoryIds: [ 51, 66, 46, 9, 69, 82, 23, 3, 32, 25, 52, 85, 21, 19, 58, 54, 63, 75, 73, 89, 87, 28 ],
children: [ {
id: 51,
titles: {
DE: "Grundregeln \u00fcber das Verhalten im Stra\u00dfenverkehr",
GB: "Basic rules of behaviour in traffic",
E: "Normas b\u00e1sicas de comportamiento en carretera",
F: "R\u00e8gles de base sur le comportement dans la circulation routi\u00e8re",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03bf\u03af \u03ba\u03b1\u03bd\u03cc\u03bd\u03b5\u03c2 \u03bf\u03b4\u03b9\u03ba\u03ae\u03c2 \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac\u03c2",
HR: "Osnovna pravila pona\u0161anja u prometu",
I: "Regole di base del comportamento stradale",
P: "Regras b\u00e1sicas de comportamento na estrada",
PL: "Podstawowe zasady zachowania na drodze",
RO: "Reguli de baz\u0103 ale comportamentului rutier",
RUS: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u0430 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435",
TR: "Trafikte davran\u0131\u015fla ilgili temel kurallar",
AR: "\u0627\u0644\u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0633\u0644\u0648\u0643 \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "1",
chapterLevelIndex: "1.2.1",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"4": 2,
"5": 2,
"6": 2,
"7": 2,
"8": 2,
"9": 2,
"10": 2,
"11": 2,
"12": 2,
"13": 2,
"15": 2,
"16": 2,
"17": 2,
"18": 2,
"19": 2,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 66,
titles: {
DE: "Stra\u00dfenbenutzung",
GB: "Road use",
E: "Uso de la carretera",
F: "Utilisation de la route",
GR: "\u039f\u03b4\u03b9\u03ba\u03ae \u03c7\u03c1\u03ae\u03c3\u03b7",
HR: "Kori\u0161tenje cesta",
I: "Uso della strada",
P: "Utiliza\u00e7\u00e3o da estrada",
PL: "U\u017cytkowanie dr\u00f3g",
RO: "Utilizarea drumurilor",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0433",
TR: "Yol kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0637\u0631\u064a\u0642"
},
basic: "1",
chapterLevelIndex: "1.2.2",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 8,
"5": 4,
"6": 8,
"7": 8,
"8": 8,
"9": 8,
"10": 8,
"11": 8,
"12": 8,
"13": 8,
"15": 8,
"16": 8,
"17": 8,
"18": 8,
"19": 8,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 46,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.3",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 8,
"5": 2,
"6": 8,
"7": 8,
"8": 8,
"9": 8,
"10": 8,
"11": 8,
"12": 8,
"13": 8,
"15": 8,
"16": 8,
"17": 8,
"18": 8,
"19": 8,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 9,
titles: {
DE: "Abstand",
GB: "Distance",
E: "Distancia",
F: "Distance",
GR: "\u0391\u03c0\u03cc\u03c3\u03c4\u03b1\u03c3\u03b7",
HR: "udaljenosti",
I: "Distanza",
P: "Dist\u00e2ncia",
PL: "Odleg\u0142o\u015b\u0107",
RO: "Distan\u021ba",
RUS: "\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435",
TR: "mesafe",
AR: "\u0645\u0633\u0627\u0641\u0647: \u0628\u0639\u062f"
},
basic: "1",
chapterLevelIndex: "1.2.4",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 3,
"6": 3,
"7": 3,
"8": 3,
"9": 3,
"10": 3,
"11": 3,
"12": 3,
"13": 3,
"15": 3,
"16": 3,
"17": 3,
"18": 3,
"19": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 69,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "1",
chapterLevelIndex: "1.2.5",
questioncount: {
"1": 19,
"2": 19,
"3": 19,
"4": 19,
"5": 4,
"6": 19,
"7": 19,
"8": 19,
"9": 19,
"10": 19,
"11": 19,
"12": 19,
"13": 19,
"15": 19,
"16": 19,
"17": 19,
"18": 19,
"19": 19,
"20": 19,
"21": 19
},
subcategoryIds: [],
children: []
}, {
id: 82,
titles: {
DE: "Vorbeifahren",
GB: "Pass by",
E: "Pasando por",
F: "Passage des v\u00e9hicules",
GR: "\u03a0\u03b5\u03c1\u03bd\u03ce\u03bd\u03c4\u03b1\u03c2",
HR: "Vozite mimo",
I: "Passaggio",
P: "Aprova\u00e7\u00e3o",
PL: "Passing",
RO: "Trecere",
RUS: "\u041f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435",
TR: "ge\u00e7mi\u015f s\u00fcr\u00fcc\u00fc",
AR: "\u0642\u0645 \u0628\u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0641\u064a \u0627\u0644\u0645\u0627\u0636\u064a"
},
basic: "1",
chapterLevelIndex: "1.2.6",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 3,
"5": 1,
"6": 3,
"7": 3,
"8": 3,
"9": 3,
"10": 3,
"11": 3,
"12": 3,
"13": 3,
"15": 3,
"16": 3,
"17": 3,
"18": 3,
"19": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 23,
titles: {
DE: "Benutzung von Fahrstreifen durch Kraftfahrzeuge",
GB: "Use of lanes by motor vehicles",
E: "Uso de los carriles por parte de los veh\u00edculos de motor",
F: "Utilisation des voies de circulation par les v\u00e9hicules \u00e0 moteur",
GR: "\u03a7\u03c1\u03ae\u03c3\u03b7 \u03bb\u03c9\u03c1\u03af\u03b4\u03c9\u03bd \u03b1\u03c0\u03cc \u03bc\u03b7\u03c7\u03b1\u03bd\u03bf\u03ba\u03af\u03bd\u03b7\u03c4\u03b1 \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03b1",
HR: "Kori\u0161tenje traka za motorna vozila",
I: "Uso delle corsie da parte dei veicoli a motore",
P: "Utiliza\u00e7\u00e3o das faixas pelos ve\u00edculos autom\u00f3veis",
PL: "Wykorzystanie pas\u00f3w ruchu przez pojazdy silnikowe",
RO: "Utilizarea benzilor de circula\u021bie de c\u0103tre autovehicule",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u043e\u0441 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f \u0430\u0432\u0442\u043e\u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043e\u043c",
TR: "Motorlu ara\u00e7lar\u0131n \u015ferit kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0645\u0631\u0627\u062a \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a"
},
basic: "1",
chapterLevelIndex: "1.2.7",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 6,
"5": 1,
"6": 6,
"7": 6,
"8": 6,
"9": 6,
"10": 6,
"11": 6,
"12": 6,
"13": 6,
"15": 6,
"16": 6,
"17": 6,
"18": 6,
"19": 6,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 3,
titles: {
DE: "Abbiegen, Wenden und R\u00fcckw\u00e4rtsfahren",
GB: "Turning, U-turning and reversing",
E: "Girar, dar vueltas y retroceder",
F: "Tourner, faire demi-tour et reculer",
GR: "\u03a3\u03c4\u03c1\u03bf\u03c6\u03ae, \u03c3\u03c4\u03c1\u03bf\u03c6\u03ae \u03ba\u03b1\u03b9 \u03b1\u03bd\u03b1\u03c3\u03c4\u03c1\u03bf\u03c6\u03ae",
HR: "Okretanje, okretanje i rikverc",
I: "Girare, girare e fare retromarcia",
P: "Torneamento, viragem e invers\u00e3o de marcha",
PL: "Skr\u0119canie, zawracanie i cofanie",
RO: "\u00centoarcerea, \u00eentoarcerea \u0219i mersul \u00eenapoi",
RUS: "\u041f\u043e\u0432\u043e\u0440\u043e\u0442, \u0440\u0430\u0437\u0432\u043e\u0440\u043e\u0442 \u0438 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435 \u0437\u0430\u0434\u043d\u0438\u043c \u0445\u043e\u0434\u043e\u043c",
TR: "D\u00f6nd\u00fcrme, d\u00f6nd\u00fcrme ve geri \u00e7evirme",
AR: "\u0627\u0644\u062f\u0648\u0631\u0627\u0646 \u0648\u0627\u0644\u0627\u0646\u0639\u0637\u0627\u0641 \u0648\u0627\u0644\u0639\u0643\u0633"
},
basic: "1",
chapterLevelIndex: "1.2.9",
questioncount: {
"1": 32,
"2": 32,
"3": 32,
"4": 32,
"5": 15,
"6": 32,
"7": 32,
"8": 32,
"9": 32,
"10": 32,
"11": 32,
"12": 32,
"13": 32,
"15": 32,
"16": 32,
"17": 32,
"18": 32,
"19": 32,
"20": 32,
"21": 32
},
subcategoryIds: [],
children: []
}, {
id: 32,
titles: {
DE: "Einfahren und Anfahren",
GB: "Run-in and start-up",
E: "Entrar y arrancar",
F: "Entr\u00e9e et d\u00e9marrage",
GR: "\u0395\u03af\u03c3\u03bf\u03b4\u03bf\u03c2 \u03ba\u03b1\u03b9 \u03b5\u03ba\u03ba\u03af\u03bd\u03b7\u03c3\u03b7",
HR: "Uhodavanje i pokretanje",
I: "Entrare e iniziare",
P: "Entrada e arranque",
PL: "Wprowadzanie i uruchamianie",
RO: "Intrarea \u0219i pornirea",
RUS: "\u0412\u0445\u043e\u0434 \u0438 \u0437\u0430\u043f\u0443\u0441\u043a",
TR: "\u00c7al\u0131\u015ft\u0131rma ve \u00e7al\u0131\u015ft\u0131rma",
AR: "\u0627\u0644\u062a\u0634\u063a\u064a\u0644 \u0648\u0628\u062f\u0621 \u0627\u0644\u062a\u0634\u063a\u064a\u0644"
},
basic: "1",
chapterLevelIndex: "1.2.10",
questioncount: {
"1": 8,
"2": 8,
"3": 8,
"4": 8,
"5": 5,
"6": 8,
"7": 8,
"8": 8,
"9": 8,
"10": 8,
"11": 8,
"12": 8,
"13": 8,
"15": 8,
"16": 8,
"17": 8,
"18": 8,
"19": 8,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 25,
titles: {
DE: "Besondere Verkehrslagen",
GB: "Special traffic scenarios",
E: "Situaciones especiales de tr\u00e1fico",
F: "Situations de circulation particuli\u00e8res",
GR: "\u0395\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Posebne prometne situacije",
I: "Situazioni speciali di traffico",
P: "Situa\u00e7\u00f5es especiais de tr\u00e1fego",
PL: "Szczeg\u00f3lne sytuacje w ruchu drogowym",
RO: "Situa\u021bii speciale de trafic",
RUS: "\u041e\u0441\u043e\u0431\u044b\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
TR: "\u00d6zel trafik durumlar\u0131",
AR: "\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062e\u0627\u0635\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.11",
questioncount: {
"1": 12,
"2": 12,
"3": 12,
"4": 12,
"5": 7,
"6": 12,
"7": 12,
"8": 12,
"9": 12,
"10": 12,
"11": 12,
"12": 12,
"13": 12,
"15": 12,
"16": 12,
"17": 12,
"18": 12,
"19": 12,
"20": 12,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 52,
titles: {
DE: "Halten und Parken",
GB: "Stopping and parking",
E: "Parada y estacionamiento",
F: "Arr\u00eat et stationnement",
GR: "\u03a3\u03c4\u03ac\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c4\u03ac\u03b8\u03bc\u03b5\u03c5\u03c3\u03b7",
HR: "Zaustavite se i parkirajte",
I: "Sosta e parcheggio",
P: "Paragem e estacionamento",
PL: "Zatrzymanie i parkowanie",
RO: "Oprire \u0219i parcare",
RUS: "\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0438 \u0441\u0442\u043e\u044f\u043d\u043a\u0430",
TR: "Dur ve park et",
AR: "\u062a\u0648\u0642\u0641 \u0648\u062a\u0648\u0642\u0641"
},
basic: "1",
chapterLevelIndex: "1.2.12",
questioncount: {
"1": 22,
"2": 22,
"3": 22,
"4": 22,
"5": 2,
"6": 22,
"7": 22,
"8": 22,
"9": 22,
"10": 22,
"11": 22,
"12": 22,
"13": 22,
"15": 22,
"16": 22,
"17": 22,
"18": 22,
"19": 22,
"20": 22,
"21": 22
},
subcategoryIds: [],
children: []
}, {
id: 85,
titles: {
DE: "Warnzeichen",
GB: "Warning sign",
E: "Se\u00f1al de advertencia",
F: "Signes d'avertissement",
GR: "\u03a0\u03c1\u03bf\u03b5\u03b9\u03b4\u03bf\u03c0\u03bf\u03b9\u03b7\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "znak upozorenja",
I: "Segnale di avvertimento",
P: "Sinal de advert\u00eancia",
PL: "Znak ostrzegawczy",
RO: "Semn de avertizare",
RUS: "\u041f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0430\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "Uyar\u0131 i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062a\u062d\u0630\u064a\u0631"
},
basic: "1",
chapterLevelIndex: "1.2.16",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"5": 1,
"6": 5,
"7": 5,
"8": 5,
"9": 5,
"10": 5,
"11": 5,
"12": 5,
"13": 5,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 5,
"20": 5,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 21,
titles: {
DE: "Beleuchtung",
GB: "Lighting",
E: "Iluminaci\u00f3n",
F: "\u00c9clairage",
GR: "\u03a6\u03c9\u03c4\u03b9\u03c3\u03bc\u03cc\u03c2",
HR: "rasvjeta",
I: "Illuminazione",
P: "Ilumina\u00e7\u00e3o",
PL: "O\u015bwietlenie",
RO: "Iluminat",
RUS: "\u041e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u0435",
TR: "ayd\u0131nlatma",
AR: "\u0625\u0636\u0627\u0621\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.17",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"4": 2,
"5": 1,
"6": 2,
"7": 2,
"8": 2,
"9": 2,
"10": 2,
"11": 2,
"12": 2,
"13": 2,
"15": 2,
"16": 2,
"17": 2,
"18": 2,
"19": 2,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 19,
titles: {
DE: "Bahn\u00fcberg\u00e4nge",
GB: "Level Crossings",
E: "Pasos a nivel",
F: "Passages \u00e0 niveau",
GR: "\u0399\u03c3\u03cc\u03c0\u03b5\u03b4\u03b5\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2",
HR: "Prijelazi preko razine",
I: "Passaggi a livello",
P: "Passagens de n\u00edvel",
PL: "Przejazdy kolejowe",
RO: "Trecerile la nivel",
RUS: "\u041f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u044f \u0443\u0440\u043e\u0432\u043d\u0435\u0439",
TR: "hemzemin ge\u00e7itler",
AR: "\u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0633\u062a\u0648\u0649"
},
basic: "1",
chapterLevelIndex: "1.2.19",
questioncount: {
"1": 18,
"2": 18,
"3": 18,
"4": 18,
"5": 5,
"6": 18,
"7": 18,
"8": 18,
"9": 18,
"10": 18,
"11": 18,
"12": 18,
"13": 18,
"15": 18,
"16": 18,
"17": 18,
"18": 18,
"19": 18,
"20": 18,
"21": 18
},
subcategoryIds: [],
children: []
}, {
id: 58,
titles: {
DE: "\u00d6ffentliche Verkehrsmittel und Schulbusse",
GB: "Public transport and school buses",
E: "Transporte p\u00fablico y autobuses escolares",
F: "Transports publics et bus scolaires",
GR: "\u0394\u03b7\u03bc\u03cc\u03c3\u03b9\u03b5\u03c2 \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03c3\u03c7\u03bf\u03bb\u03b9\u03ba\u03ac \u03bb\u03b5\u03c9\u03c6\u03bf\u03c1\u03b5\u03af\u03b1",
HR: "Javni prijevoz i \u0161kolski autobusi",
I: "Trasporto pubblico e scuolabus",
P: "Transportes p\u00fablicos e autocarros escolares",
PL: "Transport publiczny i autobusy szkolne",
RO: "Transport public \u0219i autobuze \u0219colare",
RUS: "\u041e\u0431\u0449\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442 \u0438 \u0448\u043a\u043e\u043b\u044c\u043d\u044b\u0435 \u0430\u0432\u0442\u043e\u0431\u0443\u0441\u044b",
TR: "Toplu ta\u015f\u0131ma ve okul otob\u00fcsleri",
AR: "\u0627\u0644\u0646\u0642\u0644 \u0627\u0644\u0639\u0627\u0645 \u0648\u0627\u0644\u062d\u0627\u0641\u0644\u0627\u062a \u0627\u0644\u0645\u062f\u0631\u0633\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.20",
questioncount: {
"1": 9,
"2": 9,
"3": 9,
"4": 9,
"5": 7,
"6": 9,
"7": 9,
"8": 9,
"9": 9,
"10": 9,
"11": 9,
"12": 9,
"13": 9,
"15": 9,
"16": 9,
"17": 9,
"18": 9,
"19": 9,
"20": 9,
"21": 9
},
subcategoryIds: [],
children: []
}, {
id: 54,
titles: {
DE: "Ladung",
GB: "Cargo",
E: "Carga",
F: "Chargement",
GR: "\u03a6\u03bf\u03c1\u03c4\u03af\u03bf",
HR: "naplatiti",
I: "Carico",
P: "Carga",
PL: "Obci\u0105\u017cenie",
RO: "\u00cenc\u0103rcare",
RUS: "\u041d\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
TR: "\u015farj etmek",
AR: "\u0627\u0644\u0634\u062d\u0646\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.22",
questioncount: {
"1": 7,
"2": 7,
"3": 7,
"4": 7,
"6": 7,
"7": 7,
"8": 7,
"9": 7,
"10": 7,
"11": 7,
"12": 7,
"13": 7,
"15": 7,
"16": 7,
"17": 7,
"18": 7,
"19": 7,
"20": 7,
"21": 7
},
subcategoryIds: [],
children: []
}, {
id: 63,
titles: {
DE: "Sonstige Pflichten des Fahrzeugf\u00fchrers",
GB: "Other duties of the driver",
E: "Otras funciones del conductor",
F: "Autres obligations du conducteur",
GR: "\u0386\u03bb\u03bb\u03b1 \u03ba\u03b1\u03b8\u03ae\u03ba\u03bf\u03bd\u03c4\u03b1 \u03c4\u03bf\u03c5 \u03bf\u03b4\u03b7\u03b3\u03bf\u03cd",
HR: "Ostale obveze voza\u010da vozila",
I: "Altri compiti dell'autista",
P: "Outras fun\u00e7\u00f5es do condutor",
PL: "Inne obowi\u0105zki kierowcy",
RO: "Alte sarcini ale \u0219oferului",
RUS: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043e\u0431\u044f\u0437\u0430\u043d\u043d\u043e\u0441\u0442\u0438 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
TR: "Ara\u00e7 s\u00fcr\u00fcc\u00fcs\u00fcn\u00fcn di\u011fer y\u00fck\u00fcml\u00fcl\u00fckleri",
AR: "\u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645\u0627\u062a \u0627\u0644\u0623\u062e\u0631\u0649 \u0644\u0633\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0643\u0628\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.23",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 6,
"5": 5,
"6": 6,
"7": 6,
"8": 6,
"9": 6,
"10": 6,
"11": 6,
"12": 6,
"13": 6,
"15": 6,
"16": 6,
"17": 6,
"18": 6,
"19": 6,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 75,
titles: {
DE: "Verhalten an Fu\u00dfg\u00e4nger\u00fcberwegen und gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior at crosswalks and towards pedestrians",
E: "Comportamiento en los pasos de peatones y hacia los peatones",
F: "Comportement aux passages pour pi\u00e9tons et vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2 \u03c0\u03b5\u03b6\u03ce\u03bd \u03ba\u03b1\u03b9 \u03c0\u03c1\u03bf\u03c2 \u03c4\u03bf\u03c5\u03c2 \u03c0\u03b5\u03b6\u03bf\u03cd\u03c2",
HR: "Pona\u0161anje na pje\u0161a\u010dkim prijelazima i prema pje\u0161acima",
I: "Comportamento sulle strisce pedonali e verso i pedoni",
P: "Comportamento nas passagens de pe\u00f5es e em direc\u00e7\u00e3o aos pe\u00f5es",
PL: "Zachowanie na przej\u015bciach dla pieszych i wobec pieszych",
RO: "Comportamentul la trecerile de pietoni \u0219i fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043d\u0430 \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u043d\u044b\u0445 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430\u0445 \u0438 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yaya ge\u00e7itlerinde ve yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0639\u0646\u062f \u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0634\u0627\u0629 \u0648\u0646\u062d\u0648 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.26",
questioncount: {
"1": 16,
"2": 16,
"3": 16,
"4": 16,
"5": 9,
"6": 16,
"7": 16,
"8": 16,
"9": 16,
"10": 16,
"11": 16,
"12": 16,
"13": 16,
"15": 16,
"16": 16,
"17": 16,
"18": 16,
"19": 16,
"20": 16,
"21": 16
},
subcategoryIds: [],
children: []
}, {
id: 73,
titles: {
DE: "Unfall",
GB: "Accident",
E: "Accidente",
F: "Accident",
GR: "\u0391\u03c4\u03cd\u03c7\u03b7\u03bc\u03b1",
HR: "nesre\u0107a",
I: "Incidente",
P: "Acidente",
PL: "Wypadek",
RO: "Accident",
RUS: "\u041d\u0435\u0441\u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u043b\u0443\u0447\u0430\u0439",
TR: "kaza",
AR: "\u062d\u0627\u062f\u062b\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.34",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 14,
"5": 6,
"6": 14,
"7": 14,
"8": 14,
"9": 14,
"10": 14,
"11": 14,
"12": 14,
"13": 14,
"15": 14,
"16": 14,
"17": 14,
"18": 14,
"19": 14,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 89,
titles: {
DE: "Zeichen und Weisungen der Polizeibeamten",
GB: "Signs and instructions of the police officers",
E: "Se\u00f1ales e instrucciones de los agentes de polic\u00eda",
F: "Signes et instructions des agents de police",
GR: "\u03a3\u03b7\u03bc\u03ac\u03b4\u03b9\u03b1 \u03ba\u03b1\u03b9 \u03bf\u03b4\u03b7\u03b3\u03af\u03b5\u03c2 \u03c4\u03c9\u03bd \u03b1\u03c3\u03c4\u03c5\u03bd\u03bf\u03bc\u03b9\u03ba\u03ce\u03bd",
HR: "Znakovi i upute policijskih slu\u017ebenika",
I: "Segni e istruzioni degli agenti di polizia",
P: "Sinais e instru\u00e7\u00f5es dos agentes da pol\u00edcia",
PL: "Znaki i instrukcje funkcjonariuszy policji",
RO: "Semne \u0219i instruc\u021biuni ale poli\u021bi\u0219tilor",
RUS: "\u0417\u043d\u0430\u043a\u0438 \u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432 \u043f\u043e\u043b\u0438\u0446\u0438\u0438",
TR: "Polis memurlar\u0131ndan i\u015faretler ve talimatlar",
AR: "\u0625\u0634\u0627\u0631\u0627\u062a \u0648\u062a\u0639\u0644\u064a\u0645\u0627\u062a \u0645\u0646 \u0636\u0628\u0627\u0637 \u0627\u0644\u0634\u0631\u0637\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.36",
questioncount: {
"1": 12,
"2": 12,
"3": 12,
"4": 12,
"5": 11,
"6": 12,
"7": 12,
"8": 12,
"9": 12,
"10": 12,
"11": 12,
"12": 12,
"13": 12,
"15": 12,
"16": 12,
"17": 12,
"18": 12,
"19": 12,
"20": 12,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 87,
titles: {
DE: "Wechsellichtzeichen und Dauerlichtzeichen",
GB: "Alternating and permanent light signals",
E: "Se\u00f1ales luminosas variables y fijas",
F: "Signaux \u00e0 feux alternatifs et permanents",
GR: "\u039c\u03b5\u03c4\u03b1\u03b2\u03bb\u03b7\u03c4\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03c3\u03c4\u03b1\u03b8\u03b5\u03c1\u03ad\u03c2 \u03c6\u03c9\u03c4\u03b5\u03b9\u03bd\u03ad\u03c2 \u03b5\u03bd\u03b4\u03b5\u03af\u03be\u03b5\u03b9\u03c2",
HR: "Izmjeni\u010dni svjetlosni signali i trajni svjetlosni signali",
I: "Segnali a luce variabile e fissa",
P: "Sinais luminosos vari\u00e1veis e est\u00e1veis",
PL: "Znaki \u015bwietlne zmienne i sta\u0142e",
RO: "Semne luminoase variabile \u0219i constante",
RUS: "\u041f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0438 \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0435 \u0441\u0432\u0435\u0442\u043e\u0432\u044b\u0435 \u0443\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u0438",
TR: "De\u011fi\u015fen \u0131\u015f\u0131k sinyalleri ve kal\u0131c\u0131 \u0131\u015f\u0131k sinyalleri",
AR: "\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u0645\u062a\u0646\u0627\u0648\u0628\u0629 \u0648\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u062f\u0627\u0626\u0645\u0629"
},
basic: "1",
chapterLevelIndex: "1.2.37",
questioncount: {
"1": 15,
"2": 15,
"3": 15,
"4": 15,
"5": 12,
"6": 15,
"7": 15,
"8": 15,
"9": 15,
"10": 15,
"11": 15,
"12": 15,
"13": 15,
"15": 15,
"16": 15,
"17": 15,
"18": 15,
"19": 15,
"20": 15,
"21": 15
},
subcategoryIds: [],
children: []
}, {
id: 28,
titles: {
DE: "Blaues Blinklicht und gelbes Blinklicht",
GB: "Blue flashing light and yellow flashing light",
E: "Luz azul intermitente y luz amarilla intermitente",
F: "Feu bleu clignotant et feu jaune clignotant",
GR: "\u039c\u03c0\u03bb\u03b5 \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03af\u03c4\u03c1\u03b9\u03bd\u03bf \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9",
HR: "Trep\u0107u\u0107e plavo svjetlo i trep\u0107u\u0107e \u017euto svjetlo",
I: "Luce lampeggiante blu e luce lampeggiante gialla",
P: "Luz intermitente azul e luz intermitente amarela",
PL: "Niebieskie \u015bwiat\u0142o migaj\u0105ce i \u017c\u00f3\u0142te \u015bwiat\u0142o migaj\u0105ce",
RO: "Lumin\u0103 intermitent\u0103 albastr\u0103 \u0219i lumin\u0103 intermitent\u0103 galben\u0103",
RUS: "\u0421\u0438\u043d\u0438\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442 \u0438 \u0436\u0435\u043b\u0442\u044b\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442",
TR: "Yan\u0131p s\u00f6nen mavi \u0131\u015f\u0131k ve yan\u0131p s\u00f6nen sar\u0131 \u0131\u015f\u0131k",
AR: "\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0632\u0631\u0642 \u0648\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0635\u0641\u0631"
},
basic: "1",
chapterLevelIndex: "1.2.38",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"5": 2,
"6": 5,
"7": 5,
"8": 5,
"9": 5,
"10": 5,
"11": 5,
"12": 5,
"13": 5,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 5,
"20": 5,
"21": 5
},
subcategoryIds: [],
children: []
} ]
}, {
id: 91,
titles: {
DE: "Vorfahrt, Vorrang",
GB: "Right of way, priority",
E: "Derecho de paso, prioridad",
F: "priorit\u00e9 de passage, priorit\u00e9",
GR: "\u0394\u03b9\u03ba\u03b1\u03af\u03c9\u03bc\u03b1 \u03b4\u03b9\u03ad\u03bb\u03b5\u03c5\u03c3\u03b7\u03c2, \u03c0\u03c1\u03bf\u03c4\u03b5\u03c1\u03b1\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Pravo puta, prioritet",
I: "Diritto di passaggio, priorit\u00e0",
P: "Direito de passagem, prioridade",
PL: "Prawo drogi, pierwsze\u0144stwo",
RO: "Dreptul de trecere, prioritate",
RUS: "\u041f\u0440\u0430\u0432\u043e \u043d\u0430 \u043f\u0440\u043e\u0435\u0437\u0434, \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
TR: "Yol hakk\u0131, \u00f6ncelik",
AR: "\u062d\u0642 \u0627\u0644\u0637\u0631\u064a\u0642 \u060c \u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.3",
questioncount: {
"1": 46,
"2": 46,
"3": 46,
"4": 46,
"5": 36,
"6": 46,
"7": 46,
"8": 46,
"9": 46,
"10": 46,
"11": 46,
"12": 46,
"13": 46,
"15": 46,
"16": 46,
"17": 46,
"18": 46,
"19": 46,
"20": 46,
"21": 46
},
subcategoryIds: [ 97 ],
children: [ {
id: 97,
titles: {
DE: "Vorfahrt, Vorrang",
GB: "Right of way, priority",
E: "Derecho de paso, prioridad",
F: "Priorit\u00e9, priorit\u00e9",
GR: "\u0394\u03b9\u03ba\u03b1\u03af\u03c9\u03bc\u03b1 \u03b4\u03b9\u03ad\u03bb\u03b5\u03c5\u03c3\u03b7\u03c2, \u03c0\u03c1\u03bf\u03c4\u03b5\u03c1\u03b1\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Pravo puta, prioritet",
I: "Diritto di passaggio, priorit\u00e0",
P: "Direito de passagem, prioridade",
PL: "Prawo drogi, pierwsze\u0144stwo",
RO: "Dreptul de trecere, prioritate",
RUS: "\u041f\u0440\u0430\u0432\u043e \u043d\u0430 \u043f\u0440\u043e\u0435\u0437\u0434, \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442",
TR: "Yol hakk\u0131, \u00f6ncelik",
AR: "\u062d\u0642 \u0627\u0644\u0637\u0631\u064a\u0642 \u060c \u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629"
},
basic: "1",
chapterLevelIndex: "1.3.1",
questioncount: {
"1": 46,
"2": 46,
"3": 46,
"4": 46,
"5": 36,
"6": 46,
"7": 46,
"8": 46,
"9": 46,
"10": 46,
"11": 46,
"12": 46,
"13": 46,
"15": 46,
"16": 46,
"17": 46,
"18": 46,
"19": 46,
"20": 46,
"21": 46
},
subcategoryIds: [],
children: []
} ]
}, {
id: 41,
titles: {
DE: "Verkehrszeichen",
GB: "Traffic signs",
E: "Se\u00f1ales de tr\u00e1fico",
F: "Panneaux de signalisation",
GR: "\u039a\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ad\u03c2 \u03c0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b5\u03c2",
HR: "Prometni znakovi",
I: "Segnali stradali",
P: "Sinais de tr\u00e2nsito",
PL: "Znaki drogowe",
RO: "Semne de circula\u021bie",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0437\u043d\u0430\u043a\u0438",
TR: "Trafik i\u015faretleri",
AR: "\u0627\u0634\u0627\u0631\u0627\u062a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "1",
chapterLevelIndex: "1.4",
questioncount: {
"1": 149,
"2": 149,
"3": 149,
"4": 149,
"5": 46,
"6": 149,
"7": 149,
"8": 149,
"9": 149,
"10": 149,
"11": 149,
"12": 149,
"13": 149,
"15": 149,
"16": 149,
"17": 149,
"18": 149,
"19": 149,
"20": 149,
"21": 149
},
subcategoryIds: [ 42, 83, 60, 79 ],
children: [ {
id: 42,
titles: {
DE: "Gefahrzeichen",
GB: "Danger sign",
E: "Se\u00f1ales de peligro",
F: "Panneaux de danger",
GR: "\u03a3\u03ae\u03bc\u03b1\u03c4\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03bf\u03c5",
HR: "Znak opasnosti",
I: "Segnali di pericolo",
P: "Sinais de perigo",
PL: "Znaki ostrzegawcze",
RO: "Semne de pericol",
RUS: "\u0417\u043d\u0430\u043a\u0438 \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
TR: "Tehlike i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062e\u0637\u0631"
},
basic: "1",
chapterLevelIndex: "1.4.40",
questioncount: {
"1": 38,
"2": 38,
"3": 38,
"4": 38,
"5": 7,
"6": 38,
"7": 38,
"8": 38,
"9": 38,
"10": 38,
"11": 38,
"12": 38,
"13": 38,
"15": 38,
"16": 38,
"17": 38,
"18": 38,
"19": 38,
"20": 38,
"21": 38
},
subcategoryIds: [],
children: []
}, {
id: 83,
titles: {
DE: "Vorschriftzeichen",
GB: "Regulation sign",
E: "Se\u00f1al reglamentaria",
F: "Panneau de prescription",
GR: "\u03a1\u03c5\u03b8\u03bc\u03b9\u03c3\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "Propisni znak",
I: "Segno regolamentare",
P: "Sinal regulamentar",
PL: "Znak regulacyjny",
RO: "Semnul de reglementare",
RUS: "\u0420\u0435\u0433\u0443\u043b\u0438\u0440\u0443\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "d\u00fczenleme i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0644\u0627\u0626\u062d\u0629"
},
basic: "1",
chapterLevelIndex: "1.4.41",
questioncount: {
"1": 74,
"2": 74,
"3": 74,
"4": 74,
"5": 31,
"6": 74,
"7": 74,
"8": 74,
"9": 74,
"10": 74,
"11": 74,
"12": 74,
"13": 74,
"15": 74,
"16": 74,
"17": 74,
"18": 74,
"19": 74,
"20": 74,
"21": 74
},
subcategoryIds: [],
children: []
}, {
id: 60,
titles: {
DE: "Richtzeichen",
GB: "Direction sign",
E: "Signo indicador",
F: "Panneaux indicateurs",
GR: "\u0388\u03bd\u03b4\u03b5\u03b9\u03be\u03b7",
HR: "Znak smjera",
I: "Segno indicativo",
P: "Sinal indicador",
PL: "Znak sygnalizacyjny",
RO: "Semnul indicator",
RUS: "\u0418\u043d\u0434\u0438\u043a\u0430\u0442\u043e\u0440\u043d\u044b\u0439 \u0437\u043d\u0430\u043a",
TR: "y\u00f6n i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0627\u062a\u062c\u0627\u0647"
},
basic: "1",
chapterLevelIndex: "1.4.42",
questioncount: {
"1": 36,
"2": 36,
"3": 36,
"4": 36,
"5": 8,
"6": 36,
"7": 36,
"8": 36,
"9": 36,
"10": 36,
"11": 36,
"12": 36,
"13": 36,
"15": 36,
"16": 36,
"17": 36,
"18": 36,
"19": 36,
"20": 36,
"21": 36
},
subcategoryIds: [],
children: []
}, {
id: 79,
titles: {
DE: "Verkehrseinrichtungen",
GB: "Transport facilities",
E: "Instalaciones de tr\u00e1fico",
F: "Dispositifs de circulation",
GR: "\u0395\u03b3\u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Prometni objekti",
I: "Strutture per il traffico",
P: "Facilidades de tr\u00e1fego",
PL: "Udogodnienia w ruchu drogowym",
RO: "Facilit\u0103\u021bi de trafic",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u043e\u043e\u0440\u0443\u0436\u0435\u043d\u0438\u044f",
TR: "Ula\u015f\u0131m tesisleri",
AR: "\u062a\u0633\u0647\u064a\u0644\u0627\u062a \u0627\u0644\u0646\u0642\u0644"
},
basic: "1",
chapterLevelIndex: "1.4.43",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 92,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "1",
chapterLevelIndex: "1.5",
questioncount: {
"1": 26,
"2": 26,
"3": 26,
"4": 26,
"5": 6,
"6": 26,
"7": 26,
"8": 26,
"9": 26,
"10": 26,
"11": 26,
"12": 26,
"13": 26,
"15": 26,
"16": 26,
"17": 26,
"18": 26,
"19": 26,
"20": 26,
"21": 26
},
subcategoryIds: [ 96 ],
children: [ {
id: 96,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "1",
chapterLevelIndex: "1.5.1",
questioncount: {
"1": 26,
"2": 26,
"3": 26,
"4": 26,
"5": 6,
"6": 26,
"7": 26,
"8": 26,
"9": 26,
"10": 26,
"11": 26,
"12": 26,
"13": 26,
"15": 26,
"16": 26,
"17": 26,
"18": 26,
"19": 26,
"20": 26,
"21": 26
},
subcategoryIds: [],
children: []
} ]
}, {
id: 37,
titles: {
DE: "Technik",
GB: "Technology",
E: "Tecnolog\u00eda",
F: "Technique",
GR: "\u03a4\u03b5\u03c7\u03bd\u03bf\u03bb\u03bf\u03b3\u03af\u03b1",
HR: "tehnologija",
I: "Tecnologia",
P: "Tecnologia",
PL: "Technologia",
RO: "Tehnologie",
RUS: "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f",
TR: "teknoloji",
AR: "\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627"
},
basic: "1",
chapterLevelIndex: "1.7",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 2,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [ 38 ],
children: [ {
id: 38,
titles: {
DE: "Fahrbetrieb, Fahrphysik, Fahrtechnik",
GB: "Driving operation, driving physics, driving technique",
E: "Funcionamiento de la conducci\u00f3n, f\u00edsica de la conducci\u00f3n, t\u00e9cnica de la conducci\u00f3n",
F: "Conduite, physique de la conduite, technique de conduite",
GR: "\u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c6\u03c5\u03c3\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c4\u03b5\u03c7\u03bd\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Operacija vo\u017enje, fizika vo\u017enje, tehnika vo\u017enje",
I: "Funzionamento della guida, fisica della guida, tecnica di guida",
P: "Opera\u00e7\u00e3o de condu\u00e7\u00e3o, f\u00edsica de condu\u00e7\u00e3o, t\u00e9cnica de condu\u00e7\u00e3o",
PL: "Prowadzenie pojazdu, fizyka jazdy, technika jazdy",
RO: "Func\u021bionarea la volan, fizica conducerii, tehnica conducerii",
RUS: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u043c, \u0444\u0438\u0437\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f, \u0442\u0435\u0445\u043d\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f",
TR: "S\u00fcr\u00fc\u015f operasyonu, s\u00fcr\u00fc\u015f fizi\u011fi, s\u00fcr\u00fc\u015f tekni\u011fi",
AR: "\u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u0641\u064a\u0632\u064a\u0627\u0621 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629"
},
basic: "1",
chapterLevelIndex: "1.7.1",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 2,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 93,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Qualification and ability of drivers",
E: "Idoneidad y competencia de los conductores",
F: "Aptitude et capacit\u00e9 des conducteurs de v\u00e9hicules \u00e0 moteur",
GR: "\u039a\u03b1\u03c4\u03b1\u03bb\u03bb\u03b7\u03bb\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03c9\u03bd \u03bf\u03b4\u03b7\u03b3\u03ce\u03bd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Idoneit\u00e0 e competenza dei conducenti",
P: "Adequa\u00e7\u00e3o e compet\u00eancia dos condutores",
PL: "Przydatno\u015b\u0107 i kompetencje maszynist\u00f3w",
RO: "Aptitudinea \u0219i competen\u021ba conduc\u0103torilor auto",
RUS: "\u041f\u0440\u0438\u0433\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "1",
chapterLevelIndex: "1.8",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [ 98 ],
children: [ {
id: 98,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Qualification and ability of drivers",
E: "Aptitud y competencia del conductor",
F: "Aptitude et comp\u00e9tences des conducteurs",
GR: "\u0399\u03ba\u03b1\u03bd\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03bf\u03c5 \u03bf\u03b4\u03b7\u03b3\u03bf\u03cd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Attitudine e competenza dell'autista",
P: "Aptid\u00e3o e compet\u00eancia do condutor",
PL: "predyspozycje i kompetencje kierowcy",
RO: "Aptitudini \u0219i competen\u021be ale conduc\u0103torului auto",
RUS: "\u0421\u043f\u043e\u0441\u043e\u0431\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "1",
chapterLevelIndex: "1.8.1",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"5": 1,
"6": 1,
"7": 1,
"8": 1,
"9": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
} ]
}, {
id: 4,
titles: {
DE: "Zusatzstoff",
GB: "Additive",
E: "Aditivo",
F: "Substance compl\u00e9mentaire",
GR: "\u03a0\u03c1\u03cc\u03c3\u03b8\u03b5\u03c4\u03bf",
HR: "Aditiv",
I: "Additivo",
P: "Aditivo",
PL: "Dodatek",
RO: "Aditiv",
RUS: "\u0414\u043e\u0431\u0430\u0432\u043a\u0430",
TR: "Katk\u0131",
AR: "\u0645\u0627\u062f\u0629 \u0645\u0636\u0627\u0641\u0629"
},
basic: "0",
chapterLevelIndex: "2",
questioncount: {
"1": 380,
"2": 379,
"3": 380,
"4": 158,
"5": 57,
"6": 568,
"7": 349,
"8": 296,
"9": 163,
"10": 311,
"11": 281,
"12": 164,
"13": 226,
"15": 380,
"16": 379,
"17": 380,
"18": 158,
"19": 568,
"20": 164,
"21": 226
},
subcategoryIds: [ 11, 5, 43, 94, 7, 39, 95 ],
children: [ {
id: 11,
titles: {
DE: "Gefahrenlehre",
GB: "Danger theory",
E: "Teor\u00eda del peligro",
F: "Th\u00e9orie des dangers",
GR: "\u0398\u03b5\u03c9\u03c1\u03af\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03c9\u03bd",
HR: "Teorija opasnosti",
I: "Teoria del pericolo",
P: "Teoria do perigo",
PL: "Teoria zagro\u017ce\u0144",
RO: "Teoria riscului",
RUS: "\u0422\u0435\u043e\u0440\u0438\u044f \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0435\u0439",
TR: "tehlike teorisi",
AR: "\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631"
},
basic: "0",
chapterLevelIndex: "2.1",
questioncount: {
"1": 126,
"2": 126,
"3": 126,
"4": 42,
"5": 6,
"6": 161,
"7": 27,
"8": 35,
"9": 3,
"10": 36,
"11": 36,
"12": 15,
"13": 25,
"15": 126,
"16": 126,
"17": 126,
"18": 42,
"19": 161,
"20": 15,
"21": 25
},
subcategoryIds: [ 50, 78, 36, 30, 47, 70, 27, 17, 15, 34, 12 ],
children: [ {
id: 50,
titles: {
DE: "Grundformen des Verkehrsverhaltens",
GB: "Basic forms of traffic behavior",
E: "Formas b\u00e1sicas de comportamiento del tr\u00e1fico",
F: "Formes de base du comportement dans la circulation",
GR: "\u0392\u03b1\u03c3\u03b9\u03ba\u03ad\u03c2 \u03bc\u03bf\u03c1\u03c6\u03ad\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ae\u03c2 \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac\u03c2",
HR: "Osnovni oblici pona\u0161anja u prometu",
I: "Forme di base del comportamento del traffico",
P: "Formas b\u00e1sicas de comportamento no tr\u00e2nsito",
PL: "Podstawowe formy zachowania w ruchu drogowym",
RO: "Forme de baz\u0103 ale comportamentului \u00een trafic",
RUS: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0444\u043e\u0440\u043c\u044b \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435",
TR: "Temel trafik davran\u0131\u015f\u0131 bi\u00e7imleri",
AR: "\u0627\u0644\u0623\u0634\u0643\u0627\u0644 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0644\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0645\u0631\u0648\u0631\u064a"
},
basic: "0",
chapterLevelIndex: "2.1.1",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 2,
"6": 6,
"12": 2,
"13": 2,
"15": 5,
"16": 5,
"17": 5,
"18": 2,
"19": 6,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 78,
titles: {
DE: "Verhalten gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior towards pedestrians",
E: "Comportamiento con los peatones",
F: "Comportement vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03ad\u03bd\u03b1\u03bd\u03c4\u03b9 \u03c4\u03c9\u03bd \u03c0\u03b5\u03b6\u03ce\u03bd",
HR: "Pona\u0161anje prema pje\u0161acima",
I: "Comportamento verso i pedoni",
P: "Comportamento para com os pe\u00f5es",
PL: "Zachowanie wobec pieszych",
RO: "Comportamentul fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u062a\u062c\u0627\u0647 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.2",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 2,
"6": 4,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"13": 1,
"15": 3,
"16": 3,
"17": 3,
"18": 2,
"19": 4,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 36,
titles: {
DE: "Fahrbahn- und Witterungsverh\u00e4ltnisse",
GB: "Road and weather conditions",
E: "Condiciones de la carretera y del tiempo",
F: "Conditions de la chauss\u00e9e et conditions m\u00e9t\u00e9orologiques",
GR: "\u039f\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03b9\u03c1\u03b9\u03ba\u03ad\u03c2 \u03c3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b5\u03c2",
HR: "Cestovni i vremenski uvjeti",
I: "Condizioni stradali e meteorologiche",
P: "Condi\u00e7\u00f5es rodovi\u00e1rias e meteorol\u00f3gicas",
PL: "Warunki drogowe i pogodowe",
RO: "Condi\u021bii rutiere \u0219i meteorologice",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0438 \u043f\u043e\u0433\u043e\u0434\u043d\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f",
TR: "Yol ve hava ko\u015fullar\u0131",
AR: "\u0623\u062d\u0648\u0627\u0644 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0637\u0642\u0633"
},
basic: "0",
chapterLevelIndex: "2.1.3",
questioncount: {
"1": 25,
"2": 25,
"3": 25,
"4": 13,
"5": 5,
"6": 30,
"7": 9,
"8": 10,
"9": 1,
"10": 10,
"11": 10,
"12": 7,
"13": 12,
"15": 25,
"16": 25,
"17": 25,
"18": 13,
"19": 30,
"20": 7,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 30,
titles: {
DE: "Dunkelheit und schlechte Sicht",
GB: "Darkness and poor visibility",
E: "Oscuridad y poca visibilidad",
F: "Obscurit\u00e9 et mauvaise visibilit\u00e9",
GR: "\u03a3\u03ba\u03bf\u03c4\u03ac\u03b4\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03b1\u03ba\u03ae \u03bf\u03c1\u03b1\u03c4\u03cc\u03c4\u03b7\u03c4\u03b1",
HR: "Mrak i slab vid",
I: "Buio e scarsa visibilit\u00e0",
P: "Escurid\u00e3o e m\u00e1 visibilidade",
PL: "Ciemno\u015b\u0107 i s\u0142aba widoczno\u015b\u0107",
RO: "\u00centuneric \u0219i vizibilitate redus\u0103",
RUS: "\u0422\u0435\u043c\u043d\u043e\u0442\u0430 \u0438 \u043f\u043b\u043e\u0445\u0430\u044f \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c",
TR: "Karanl\u0131k ve zay\u0131f g\u00f6r\u00fc\u015f",
AR: "\u0627\u0644\u0638\u0644\u0627\u0645 \u0648\u0636\u0639\u0641 \u0627\u0644\u0631\u0624\u064a\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.4",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 3,
"6": 4,
"12": 1,
"13": 4,
"15": 3,
"16": 3,
"17": 3,
"18": 3,
"19": 4,
"20": 1,
"21": 4
},
subcategoryIds: [],
children: []
}, {
id: 47,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.5",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 1,
"6": 7,
"8": 1,
"10": 1,
"11": 1,
"15": 6,
"16": 6,
"17": 6,
"18": 1,
"19": 7
},
subcategoryIds: [],
children: []
}, {
id: 70,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "0",
chapterLevelIndex: "2.1.6",
questioncount: {
"1": 21,
"2": 21,
"3": 21,
"4": 5,
"6": 26,
"7": 1,
"8": 3,
"10": 4,
"11": 4,
"12": 2,
"13": 1,
"15": 21,
"16": 21,
"17": 21,
"18": 5,
"19": 26,
"20": 2,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 27,
titles: {
DE: "Besondere Verkehrssituationen",
GB: "Special traffic scenarios",
E: "Situaciones especiales de tr\u00e1fico",
F: "Situations de circulation particuli\u00e8res",
GR: "\u0395\u03b9\u03b4\u03b9\u03ba\u03ad\u03c2 \u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Posebne prometne situacije",
I: "Situazioni speciali di traffico",
P: "Situa\u00e7\u00f5es especiais de tr\u00e1fego",
PL: "Szczeg\u00f3lne sytuacje w ruchu drogowym",
RO: "Situa\u021bii speciale de trafic",
RUS: "\u041e\u0441\u043e\u0431\u044b\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438",
TR: "\u00d6zel trafik durumlar\u0131",
AR: "\u062d\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062e\u0627\u0635\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.7",
questioncount: {
"1": 26,
"2": 26,
"3": 26,
"4": 4,
"6": 30,
"7": 6,
"8": 10,
"9": 1,
"10": 9,
"11": 9,
"12": 2,
"13": 4,
"15": 26,
"16": 26,
"17": 26,
"18": 4,
"19": 30,
"20": 2,
"21": 4
},
subcategoryIds: [],
children: []
}, {
id: 17,
titles: {
DE: "Autobahn",
GB: "Freeway",
E: "Autopista",
F: "Autoroute",
GR: "\u0391\u03c5\u03c4\u03bf\u03ba\u03b9\u03bd\u03b7\u03c4\u03cc\u03b4\u03c1\u03bf\u03bc\u03bf\u03c2",
HR: "autocesta",
I: "Autostrada",
P: "Auto-estrada",
PL: "Autostrada",
RO: "Autostrada",
RUS: "\u0410\u0432\u0442\u043e\u043c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u043b\u044c",
TR: "Otoban",
AR: "\u0637\u0631\u064a\u0642 \u0633\u0631\u064a\u0639"
},
basic: "0",
chapterLevelIndex: "2.1.8",
questioncount: {
"1": 19,
"2": 19,
"3": 19,
"6": 21,
"7": 5,
"8": 5,
"9": 1,
"10": 4,
"11": 4,
"15": 19,
"16": 19,
"17": 19,
"19": 21
},
subcategoryIds: [],
children: []
}, {
id: 15,
titles: {
DE: "Alkohol, Drogen, Medikamente",
GB: "Alcohol, drugs, medication",
E: "Alcohol, drogas, medicamentos",
F: "Alcool, drogues, m\u00e9dicaments",
GR: "\u0391\u03bb\u03ba\u03bf\u03cc\u03bb, \u03bd\u03b1\u03c1\u03ba\u03c9\u03c4\u03b9\u03ba\u03ac, \u03c6\u03ac\u03c1\u03bc\u03b1\u03ba\u03b1",
HR: "Alkohol, droge, lijekovi",
I: "Alcool, droghe, farmaci",
P: "\u00c1lcool, drogas, medicamentos",
PL: "Alkohol, narkotyki, leki",
RO: "Alcool, droguri, medicamente",
RUS: "\u0410\u043b\u043a\u043e\u0433\u043e\u043b\u044c, \u043d\u0430\u0440\u043a\u043e\u0442\u0438\u043a\u0438, \u043b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0430",
TR: "Alkol, uyu\u015fturucu, ila\u00e7",
AR: "\u0627\u0644\u0643\u062d\u0648\u0644 \u0648\u0627\u0644\u0645\u062e\u062f\u0631\u0627\u062a \u0648\u0627\u0644\u0623\u062f\u0648\u064a\u0629"
},
basic: "0",
chapterLevelIndex: "2.1.9",
questioncount: {
"10": 2,
"11": 2
},
subcategoryIds: [],
children: []
}, {
id: 34,
titles: {
DE: "Erm\u00fcdung, Ablenkung",
GB: "Fatigue, distraction",
E: "Fatiga, distracci\u00f3n",
F: "Fatigue, distraction",
GR: "\u039a\u03cc\u03c0\u03c9\u03c3\u03b7, \u03b1\u03c0\u03cc\u03c3\u03c0\u03b1\u03c3\u03b7 \u03c0\u03c1\u03bf\u03c3\u03bf\u03c7\u03ae\u03c2",
HR: "Umor, rastresenost",
I: "Fatica, distrazione",
P: "Fadiga, distrac\u00e7\u00e3o",
PL: "Zm\u0119czenie, rozproszenie uwagi",
RO: "Oboseal\u0103, distragere a aten\u021biei",
RUS: "\u0423\u0441\u0442\u0430\u043b\u043e\u0441\u0442\u044c, \u0440\u0430\u0441\u0441\u0435\u044f\u043d\u043d\u043e\u0441\u0442\u044c",
TR: "Yorgunluk, dikkat da\u011f\u0131n\u0131kl\u0131\u011f\u0131",
AR: "\u0627\u0644\u062a\u0639\u0628 \u0648\u0627\u0644\u0625\u0644\u0647\u0627\u0621"
},
basic: "0",
chapterLevelIndex: "2.1.10",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 4,
"6": 8,
"7": 4,
"8": 4,
"10": 4,
"11": 4,
"15": 5,
"16": 5,
"17": 5,
"18": 4,
"19": 8
},
subcategoryIds: [],
children: []
}, {
id: 12,
titles: {
DE: "Affektiv-emotionales Verhalten im Stra\u00dfenverkehr",
GB: "Affective-emotional behavior in traffic",
E: "Comportamiento afectivo-emocional en el tr\u00e1fico rodado",
F: "Comportement affectif et \u00e9motionnel dans la circulation routi\u00e8re",
GR: "\u03a3\u03c5\u03bd\u03b1\u03b9\u03c3\u03b8\u03b7\u03bc\u03b1\u03c4\u03b9\u03ba\u03ae-\u03c3\u03c5\u03bd\u03b1\u03b9\u03c3\u03b8\u03b7\u03bc\u03b1\u03c4\u03b9\u03ba\u03ae \u03c3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1",
HR: "Afektivno-emocionalno pona\u0161anje u prometu",
I: "Comportamento affettivo-emotivo nel traffico stradale",
P: "Comportamento afectivo-emocional no tr\u00e1fego rodovi\u00e1rio",
PL: "Zachowania afektywno-emocjonalne w ruchu drogowym",
RO: "Comportamentul afectiv-emo\u021bional \u00een traficul rutier",
RUS: "\u0410\u0444\u0444\u0435\u043a\u0442\u0438\u0432\u043d\u043e-\u044d\u043c\u043e\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438",
TR: "Trafikte duygusal-duygusal davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0627\u0644\u0639\u0627\u0637\u0641\u064a \u0627\u0644\u0639\u0627\u0637\u0641\u064a \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "0",
chapterLevelIndex: "2.1.11",
questioncount: {
"1": 13,
"2": 13,
"3": 13,
"4": 8,
"5": 1,
"6": 25,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 13,
"16": 13,
"17": 13,
"18": 8,
"19": 25,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 5,
titles: {
DE: "Verhalten im Stra\u00dfenverkehr",
GB: "Behavior in road traffic",
E: "Comportamiento en el tr\u00e1fico rodado",
F: "Comportement dans la circulation routi\u00e8re",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1",
HR: "Pona\u0161anje u prometu",
I: "Comportamento nel traffico stradale",
P: "Comportamento no tr\u00e1fego rodovi\u00e1rio",
PL: "Zachowanie w ruchu drogowym",
RO: "Comportamentul \u00een traficul rutier",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0432 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0438",
TR: "trafikte davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0641\u064a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "0",
chapterLevelIndex: "2.2",
questioncount: {
"1": 134,
"2": 133,
"3": 134,
"4": 49,
"5": 23,
"6": 191,
"7": 96,
"8": 87,
"9": 47,
"10": 56,
"11": 52,
"12": 74,
"13": 85,
"15": 134,
"16": 133,
"17": 134,
"18": 49,
"19": 191,
"20": 74,
"21": 85
},
subcategoryIds: [ 67, 48, 10, 71, 113, 24, 6, 53, 33, 65, 57, 86, 22, 18, 20, 59, 55, 64, 76, 72, 62, 81, 111, 88, 114 ],
children: [ {
id: 67,
titles: {
DE: "Stra\u00dfenbenutzung",
GB: "Road use",
E: "Uso de la carretera",
F: "Utilisation de la route",
GR: "\u039f\u03b4\u03b9\u03ba\u03ae \u03c7\u03c1\u03ae\u03c3\u03b7",
HR: "Kori\u0161tenje cesta",
I: "Uso della strada",
P: "Utiliza\u00e7\u00e3o da estrada",
PL: "U\u017cytkowanie dr\u00f3g",
RO: "Utilizarea drumurilor",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0433",
TR: "Yol kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0637\u0631\u064a\u0642"
},
basic: "0",
chapterLevelIndex: "2.2.2",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 2,
"5": 6,
"6": 2,
"7": 2,
"8": 2,
"9": 1,
"12": 1,
"13": 2,
"15": 3,
"16": 3,
"17": 3,
"18": 2,
"19": 2,
"20": 1,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 48,
titles: {
DE: "Geschwindigkeit",
GB: "Speed",
E: "Velocidad",
F: "Vitesse",
GR: "\u03a4\u03b1\u03c7\u03cd\u03c4\u03b7\u03c4\u03b1",
HR: "ubrzati",
I: "Velocit\u00e0",
P: "Velocidade",
PL: "Pr\u0119dko\u015b\u0107",
RO: "Vitez\u0103",
RUS: "\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c",
TR: "h\u0131z",
AR: "\u0633\u0631\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.3",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 4,
"5": 2,
"6": 19,
"7": 3,
"8": 2,
"9": 2,
"10": 3,
"11": 2,
"13": 6,
"15": 14,
"16": 14,
"17": 14,
"18": 4,
"19": 19,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 10,
titles: {
DE: "Abstand",
GB: "Distance",
E: "Distancia",
F: "Distance",
GR: "\u0391\u03c0\u03cc\u03c3\u03c4\u03b1\u03c3\u03b7",
HR: "udaljenosti",
I: "Distanza",
P: "Dist\u00e2ncia",
PL: "Odleg\u0142o\u015b\u0107",
RO: "Distan\u021ba",
RUS: "\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435",
TR: "mesafe",
AR: "\u0645\u0633\u0627\u0641\u0647: \u0628\u0639\u062f"
},
basic: "0",
chapterLevelIndex: "2.2.4",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 1,
"6": 8,
"7": 6,
"8": 5,
"9": 1,
"10": 3,
"11": 3,
"12": 1,
"13": 2,
"15": 4,
"16": 4,
"17": 4,
"18": 1,
"19": 8,
"20": 1,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 71,
titles: {
DE: "\u00dcberholen",
GB: "Overtaking",
E: "Adelant\u00e1ndose a",
F: "D\u00e9passement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c0\u03ad\u03c1\u03b1\u03c3\u03b7",
HR: "Pretjecanje",
I: "Sorpasso",
P: "Ultrapassar",
PL: "Wyprzedzanie",
RO: "Dep\u0103\u0219irea",
RUS: "\u041e\u0431\u0433\u043e\u043d",
TR: "sollama",
AR: "\u0627\u0644\u062a\u062c\u0627\u0648\u0632"
},
basic: "0",
chapterLevelIndex: "2.2.5",
questioncount: {
"1": 10,
"2": 10,
"3": 10,
"4": 1,
"6": 11,
"7": 4,
"8": 1,
"10": 2,
"12": 2,
"13": 1,
"15": 10,
"16": 10,
"17": 10,
"18": 1,
"19": 11,
"20": 2,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 113,
titles: {
DE: "Vorbeifahren",
GB: "Pass by",
E: "Pasando por",
F: "Passage des v\u00e9hicules",
GR: "\u03a0\u03b5\u03c1\u03bd\u03ce\u03bd\u03c4\u03b1\u03c2",
HR: "Vozite mimo",
I: "Passaggio",
P: "Aprova\u00e7\u00e3o",
PL: "Passing",
RO: "Trecere",
RUS: "\u041f\u0440\u043e\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435",
TR: "ge\u00e7mi\u015f s\u00fcr\u00fcc\u00fc",
AR: "\u0642\u0645 \u0628\u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0641\u064a \u0627\u0644\u0645\u0627\u0636\u064a"
},
basic: "0",
chapterLevelIndex: "2.2.6",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 24,
titles: {
DE: "Benutzung von Fahrstreifen durch Kraftfahrzeuge",
GB: "Use of lanes by motor vehicles",
E: "Uso de los carriles por parte de los veh\u00edculos de motor",
F: "Utilisation de voies de circulation par des v\u00e9hicules \u00e0 moteur",
GR: "\u03a7\u03c1\u03ae\u03c3\u03b7 \u03bb\u03c9\u03c1\u03af\u03b4\u03c9\u03bd \u03b1\u03c0\u03cc \u03bc\u03b7\u03c7\u03b1\u03bd\u03bf\u03ba\u03af\u03bd\u03b7\u03c4\u03b1 \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03b1",
HR: "Kori\u0161tenje traka za motorna vozila",
I: "Uso delle corsie da parte dei veicoli a motore",
P: "Utiliza\u00e7\u00e3o das faixas pelos ve\u00edculos autom\u00f3veis",
PL: "Wykorzystanie pas\u00f3w ruchu przez pojazdy silnikowe",
RO: "Utilizarea benzilor de circula\u021bie de c\u0103tre autovehicule",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u043e\u0441 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044f \u0430\u0432\u0442\u043e\u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043e\u043c",
TR: "Motorlu ara\u00e7lar\u0131n \u015ferit kullan\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0645\u0631\u0627\u062a \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.7",
questioncount: {
"1": 11,
"2": 11,
"3": 11,
"4": 2,
"6": 10,
"7": 4,
"8": 4,
"9": 2,
"10": 3,
"11": 3,
"12": 1,
"13": 1,
"15": 11,
"16": 11,
"17": 11,
"18": 2,
"19": 10,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 6,
titles: {
DE: "Abbiegen, Wenden und R\u00fcckw\u00e4rtsfahren",
GB: "Turning, U-turning and reversing",
E: "Girar, dar vueltas y retroceder",
F: "Tourner, faire demi-tour et faire marche arri\u00e8re",
GR: "\u03a3\u03c4\u03c1\u03bf\u03c6\u03ae, \u03c3\u03c4\u03c1\u03bf\u03c6\u03ae \u03ba\u03b1\u03b9 \u03b1\u03bd\u03b1\u03c3\u03c4\u03c1\u03bf\u03c6\u03ae",
HR: "Okretanje, okretanje i rikverc",
I: "Girare, girare e fare retromarcia",
P: "Torneamento, viragem e invers\u00e3o de marcha",
PL: "Skr\u0119canie, zawracanie i cofanie",
RO: "\u00centoarcerea, \u00eentoarcerea \u0219i mersul \u00eenapoi",
RUS: "\u041f\u043e\u0432\u043e\u0440\u043e\u0442, \u0440\u0430\u0437\u0432\u043e\u0440\u043e\u0442 \u0438 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435 \u0437\u0430\u0434\u043d\u0438\u043c \u0445\u043e\u0434\u043e\u043c",
TR: "D\u00f6nd\u00fcrme, d\u00f6nd\u00fcrme ve geri \u00e7evirme",
AR: "\u0627\u0644\u062f\u0648\u0631\u0627\u0646 \u0648\u0627\u0644\u0627\u0646\u0639\u0637\u0627\u0641 \u0648\u0627\u0644\u0639\u0643\u0633"
},
basic: "0",
chapterLevelIndex: "2.2.9",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 2,
"6": 5,
"7": 4,
"8": 5,
"9": 2,
"10": 3,
"11": 2,
"12": 8,
"13": 8,
"15": 4,
"16": 4,
"17": 4,
"18": 2,
"19": 5,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 53,
titles: {
DE: "Halten und Parken",
GB: "Stopping and parking",
E: "Parada y estacionamiento",
F: "Arr\u00eat et stationnement",
GR: "\u03a3\u03c4\u03ac\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c4\u03ac\u03b8\u03bc\u03b5\u03c5\u03c3\u03b7",
HR: "Zaustavite se i parkirajte",
I: "Sosta e parcheggio",
P: "Paragem e estacionamento",
PL: "Zatrzymanie i parkowanie",
RO: "Oprire \u0219i parcare",
RUS: "\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0438 \u0441\u0442\u043e\u044f\u043d\u043a\u0430",
TR: "Dur ve park et",
AR: "\u062a\u0648\u0642\u0641 \u0648\u062a\u0648\u0642\u0641"
},
basic: "0",
chapterLevelIndex: "2.2.12",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 4,
"5": 2,
"6": 11,
"7": 1,
"10": 2,
"11": 1,
"12": 7,
"13": 7,
"15": 5,
"16": 5,
"17": 5,
"18": 4,
"19": 11,
"20": 7,
"21": 7
},
subcategoryIds: [],
children: []
}, {
id: 33,
titles: {
DE: "Einrichtungen zur \u00dcberwachung der Parkzeit",
GB: "Facilities for monitoring parking time",
E: "Dispositivos de control del tiempo de estacionamiento",
F: "Dispositifs de contr\u00f4le du temps de stationnement",
GR: "\u03a3\u03c5\u03c3\u03ba\u03b5\u03c5\u03ad\u03c2 \u03c0\u03b1\u03c1\u03b1\u03ba\u03bf\u03bb\u03bf\u03cd\u03b8\u03b7\u03c3\u03b7\u03c2 \u03c4\u03bf\u03c5 \u03c7\u03c1\u03cc\u03bd\u03bf\u03c5 \u03c3\u03c4\u03ac\u03b8\u03bc\u03b5\u03c5\u03c3\u03b7\u03c2",
HR: "Objekti za pra\u0107enje vremena parkiranja",
I: "Dispositivi di monitoraggio del tempo di parcheggio",
P: "Dispositivos de monitoriza\u00e7\u00e3o do tempo de estacionamento",
PL: "Urz\u0105dzenia monitoruj\u0105ce czas parkowania",
RO: "Dispozitive de monitorizare a timpului de parcare",
RUS: "\u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044f \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438",
TR: "Park s\u00fcresini izleme olanaklar\u0131",
AR: "\u0645\u0631\u0627\u0641\u0642 \u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0648\u0642\u062a \u0648\u0642\u0648\u0641 \u0627\u0644\u0633\u064a\u0627\u0631\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.13",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 4,
"6": 5,
"12": 1,
"13": 1,
"15": 4,
"16": 4,
"17": 4,
"18": 4,
"19": 5,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 65,
titles: {
DE: "Sorgfaltspflichten",
GB: "Due diligence obligations",
E: "Deberes de asistencia",
F: "Devoir de diligence",
GR: "\u039a\u03b1\u03b8\u03ae\u03ba\u03bf\u03bd\u03c4\u03b1 \u03c6\u03c1\u03bf\u03bd\u03c4\u03af\u03b4\u03b1\u03c2",
HR: "Dubinska analiza",
I: "Doveri di cura",
P: "Deveres de cuidado",
PL: "Obowi\u0105zki w zakresie opieki",
RO: "Obliga\u021biile de \u00eengrijire",
RUS: "\u041e\u0431\u044f\u0437\u0430\u043d\u043d\u043e\u0441\u0442\u0438 \u043f\u043e \u0443\u0445\u043e\u0434\u0443",
TR: "Durum tespit s\u00fcreci",
AR: "\u0627\u062c\u0631\u0627\u0621\u0627\u062a \u0644\u0627\u0631\u0636\u0627\u0621 \u0627\u0644\u0645\u062a\u0637\u0644\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.14",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 2,
"6": 6,
"8": 1,
"11": 1,
"15": 5,
"16": 5,
"17": 5,
"18": 2,
"19": 6
},
subcategoryIds: [],
children: []
}, {
id: 57,
titles: {
DE: "Liegenbleiben und Abschleppen von Fahrzeugen",
GB: "Breakdowns and towing of vehicles",
E: "Inmovilizaci\u00f3n y remolque de veh\u00edculos",
F: "Immobilisation et remorquage de v\u00e9hicules",
GR: "\u0391\u03ba\u03b9\u03bd\u03b7\u03c4\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c1\u03c5\u03bc\u03bf\u03cd\u03bb\u03ba\u03b7\u03c3\u03b7 \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Kvarovi i vu\u010da vozila",
I: "Immobilizzazione e traino di veicoli",
P: "Imobiliza\u00e7\u00e3o e reboque de ve\u00edculos",
PL: "Unieruchomienie i holowanie pojazd\u00f3w",
RO: "Imobilizarea \u0219i tractarea vehiculelor",
RUS: "\u0418\u043c\u043c\u043e\u0431\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0438 \u0431\u0443\u043a\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7lar\u0131n ar\u0131zalanmas\u0131 ve \u00e7ekilmesi",
AR: "\u0623\u0639\u0637\u0627\u0644 \u0648\u0633\u062d\u0628 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.2.15",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"4": 1,
"6": 8,
"7": 2,
"8": 2,
"9": 1,
"10": 2,
"11": 2,
"12": 2,
"13": 2,
"15": 1,
"16": 1,
"17": 1,
"18": 1,
"19": 8,
"20": 2,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 86,
titles: {
DE: "Warnzeichen",
GB: "Warning sign",
E: "Se\u00f1al de advertencia",
F: "Signes d'avertissement",
GR: "\u03a0\u03c1\u03bf\u03b5\u03b9\u03b4\u03bf\u03c0\u03bf\u03b9\u03b7\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "znak upozorenja",
I: "Segnale di avvertimento",
P: "Sinal de advert\u00eancia",
PL: "Znak ostrzegawczy",
RO: "Semn de avertizare",
RUS: "\u041f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0430\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "Uyar\u0131 i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062a\u062d\u0630\u064a\u0631"
},
basic: "0",
chapterLevelIndex: "2.2.16",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 2,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 2,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 22,
titles: {
DE: "Beleuchtung",
GB: "Lighting",
E: "Iluminaci\u00f3n",
F: "\u00c9clairage",
GR: "\u03a6\u03c9\u03c4\u03b9\u03c3\u03bc\u03cc\u03c2",
HR: "rasvjeta",
I: "Illuminazione",
P: "Ilumina\u00e7\u00e3o",
PL: "O\u015bwietlenie",
RO: "Iluminat",
RUS: "\u041e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u0435",
TR: "ayd\u0131nlatma",
AR: "\u0625\u0636\u0627\u0621\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.17",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 1,
"6": 16,
"7": 3,
"8": 2,
"9": 1,
"10": 1,
"11": 1,
"12": 14,
"13": 14,
"15": 6,
"16": 6,
"17": 6,
"18": 1,
"19": 16,
"20": 14,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 18,
titles: {
DE: "Autobahnen und Kraftfahrstra\u00dfen",
GB: "Freeways and highways",
E: "Autopistas y autov\u00edas",
F: "Autoroutes et routes \u00e0 grande circulation",
GR: "\u0391\u03c5\u03c4\u03bf\u03ba\u03b9\u03bd\u03b7\u03c4\u03cc\u03b4\u03c1\u03bf\u03bc\u03bf\u03b9 \u03ba\u03b1\u03b9 \u03b1\u03c5\u03c4\u03bf\u03ba\u03b9\u03bd\u03b7\u03c4\u03cc\u03b4\u03c1\u03bf\u03bc\u03bf\u03b9",
HR: "Autoceste i autoceste",
I: "Autostrade e superstrade",
P: "Auto-estradas e auto-estradas",
PL: "Autostrady i drogi szybkiego ruchu",
RO: "Autostr\u0103zi \u0219i autostr\u0103zi",
RUS: "\u0410\u0432\u0442\u043e\u0441\u0442\u0440\u0430\u0434\u044b \u0438 \u0430\u0432\u0442\u043e\u043c\u0430\u0433\u0438\u0441\u0442\u0440\u0430\u043b\u0438",
TR: "Otoyollar ve otoyollar",
AR: "\u0627\u0644\u0637\u0631\u0642 \u0627\u0644\u0633\u0631\u064a\u0639\u0629 \u0648\u0627\u0644\u0637\u0631\u0642 \u0627\u0644\u0633\u0631\u064a\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.18",
questioncount: {
"1": 16,
"2": 15,
"3": 16,
"6": 18,
"7": 9,
"8": 10,
"9": 5,
"10": 5,
"11": 5,
"15": 16,
"16": 15,
"17": 16,
"19": 18
},
subcategoryIds: [],
children: []
}, {
id: 20,
titles: {
DE: "Bahn\u00fcberg\u00e4nge",
GB: "Level Crossings",
E: "Pasos a nivel",
F: "Passages \u00e0 niveau",
GR: "\u0399\u03c3\u03cc\u03c0\u03b5\u03b4\u03b5\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2",
HR: "Prijelazi preko razine",
I: "Passaggi a livello",
P: "Passagens de n\u00edvel",
PL: "Przejazdy kolejowe",
RO: "Trecerile la nivel",
RUS: "\u041f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u044f \u0443\u0440\u043e\u0432\u043d\u0435\u0439",
TR: "hemzemin ge\u00e7itler",
AR: "\u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0633\u062a\u0648\u0649"
},
basic: "0",
chapterLevelIndex: "2.2.19",
questioncount: [],
subcategoryIds: [],
children: []
}, {
id: 59,
titles: {
DE: "Personenbef\u00f6rderung",
GB: "Passenger transport",
E: "Transporte de pasajeros",
F: "Transport de personnes",
GR: "\u0395\u03c0\u03b9\u03b2\u03b1\u03c4\u03b9\u03ba\u03ad\u03c2 \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2",
HR: "Prijevoz putnika",
I: "Trasporto passeggeri",
P: "Transporte de passageiros",
PL: "Transport pasa\u017cerski",
RO: "Transport de pasageri",
RUS: "\u041f\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0441\u043a\u0438\u0439 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442",
TR: "Yolcu ta\u015f\u0131mac\u0131l\u0131\u011f\u0131",
AR: "\u0646\u0642\u0644 \u0627\u0644\u0631\u0643\u0627\u0628"
},
basic: "0",
chapterLevelIndex: "2.2.21",
questioncount: {
"1": 6,
"2": 6,
"3": 6,
"4": 5,
"5": 4,
"6": 16,
"7": 2,
"8": 2,
"10": 5,
"11": 5,
"12": 1,
"13": 1,
"15": 6,
"16": 6,
"17": 6,
"18": 5,
"19": 16,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 55,
titles: {
DE: "Ladung",
GB: "Cargo",
E: "Cargando",
F: "Chargement",
GR: "\u03a6\u03cc\u03c1\u03c4\u03c9\u03c3\u03b7",
HR: "naplatiti",
I: "Caricamento",
P: "Carregamento",
PL: "\u0141adowanie",
RO: "\u00cenc\u0103rcare",
RUS: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
TR: "\u015farj etmek",
AR: "\u0627\u0644\u0634\u062d\u0646\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.22",
questioncount: {
"1": 4,
"2": 4,
"3": 4,
"4": 2,
"5": 1,
"6": 17,
"7": 21,
"8": 21,
"9": 20,
"12": 7,
"13": 9,
"15": 4,
"16": 4,
"17": 4,
"18": 2,
"19": 17,
"20": 7,
"21": 9
},
subcategoryIds: [],
children: []
}, {
id: 64,
titles: {
DE: "Sonstige Pflichten des Fahrzeugf\u00fchrers",
GB: "Other duties of the driver",
E: "Otras funciones del conductor",
F: "Autres obligations du conducteur",
GR: "\u0386\u03bb\u03bb\u03b1 \u03ba\u03b1\u03b8\u03ae\u03ba\u03bf\u03bd\u03c4\u03b1 \u03c4\u03bf\u03c5 \u03bf\u03b4\u03b7\u03b3\u03bf\u03cd",
HR: "Ostale obveze voza\u010da vozila",
I: "Altri compiti dell'autista",
P: "Outras fun\u00e7\u00f5es do condutor",
PL: "Inne obowi\u0105zki kierowcy",
RO: "Alte sarcini ale \u0219oferului",
RUS: "\u0414\u0440\u0443\u0433\u0438\u0435 \u043e\u0431\u044f\u0437\u0430\u043d\u043d\u043e\u0441\u0442\u0438 \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
TR: "Ara\u00e7 s\u00fcr\u00fcc\u00fcs\u00fcn\u00fcn di\u011fer y\u00fck\u00fcml\u00fcl\u00fckleri",
AR: "\u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645\u0627\u062a \u0627\u0644\u0623\u062e\u0631\u0649 \u0644\u0633\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0643\u0628\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.23",
questioncount: {
"1": 31,
"2": 31,
"3": 31,
"4": 15,
"5": 8,
"6": 19,
"7": 19,
"8": 16,
"9": 6,
"10": 16,
"11": 16,
"12": 22,
"13": 22,
"15": 31,
"16": 31,
"17": 31,
"18": 15,
"19": 19,
"20": 22,
"21": 22
},
subcategoryIds: [],
children: []
}, {
id: 76,
titles: {
DE: "Verhalten an Fu\u00dfg\u00e4nger\u00fcberwegen und gegen\u00fcber Fu\u00dfg\u00e4ngern",
GB: "Behavior at crosswalks and towards pedestrians",
E: "Comportamiento en los pasos de peatones y hacia los peatones",
F: "Comportement aux passages pi\u00e9tons et vis-\u00e0-vis des pi\u00e9tons",
GR: "\u03a3\u03c5\u03bc\u03c0\u03b5\u03c1\u03b9\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03b2\u03ac\u03c3\u03b5\u03b9\u03c2 \u03c0\u03b5\u03b6\u03ce\u03bd \u03ba\u03b1\u03b9 \u03c0\u03c1\u03bf\u03c2 \u03c4\u03bf\u03c5\u03c2 \u03c0\u03b5\u03b6\u03bf\u03cd\u03c2",
HR: "Pona\u0161anje na pje\u0161a\u010dkim prijelazima i prema pje\u0161acima",
I: "Comportamento sulle strisce pedonali e verso i pedoni",
P: "Comportamento nas passagens de pe\u00f5es e em direc\u00e7\u00e3o aos pe\u00f5es",
PL: "Zachowanie na przej\u015bciach dla pieszych i wobec pieszych",
RO: "Comportamentul la trecerile de pietoni \u0219i fa\u021b\u0103 de pietoni",
RUS: "\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043d\u0430 \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u043d\u044b\u0445 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430\u0445 \u0438 \u043f\u043e \u043e\u0442\u043d\u043e\u0448\u0435\u043d\u0438\u044e \u043a \u043f\u0435\u0448\u0435\u0445\u043e\u0434\u0430\u043c",
TR: "Yaya ge\u00e7itlerinde ve yayalara kar\u015f\u0131 davran\u0131\u015f",
AR: "\u0627\u0644\u0633\u0644\u0648\u0643 \u0639\u0646\u062f \u0645\u0639\u0627\u0628\u0631 \u0627\u0644\u0645\u0634\u0627\u0629 \u0648\u0646\u062d\u0648 \u0627\u0644\u0645\u0634\u0627\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.26",
questioncount: {
"6": 1,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 72,
titles: {
DE: "\u00dcberm\u00e4\u00dfige Stra\u00dfenbenutzung",
GB: "Excessive road use",
E: "Uso excesivo de la carretera",
F: "Utilisation excessive de la route",
GR: "\u03a5\u03c0\u03b5\u03c1\u03b2\u03bf\u03bb\u03b9\u03ba\u03ae \u03bf\u03b4\u03b9\u03ba\u03ae \u03c7\u03c1\u03ae\u03c3\u03b7",
HR: "Prekomjerno kori\u0161tenje ceste",
I: "Uso eccessivo della strada",
P: "Uso excessivo da estrada",
PL: "Nadmierne korzystanie z dr\u00f3g",
RO: "Utilizarea excesiv\u0103 a drumurilor",
RUS: "\u0427\u0440\u0435\u0437\u043c\u0435\u0440\u043d\u043e\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0433",
TR: "A\u015f\u0131r\u0131 yol kullan\u0131m\u0131",
AR: "\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0641\u0631\u0637 \u0644\u0644\u0637\u0631\u0642"
},
basic: "0",
chapterLevelIndex: "2.2.29",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"7": 3,
"8": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 62,
titles: {
DE: "Sonntagsfahrverbot",
GB: "Sunday driving ban",
E: "Prohibici\u00f3n de conducir los domingos",
F: "Interdiction de circuler le dimanche",
GR: "\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ac\u03c4\u03b9\u03ba\u03b7 \u03b1\u03c0\u03b1\u03b3\u03cc\u03c1\u03b5\u03c5\u03c3\u03b7 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Zabrana vo\u017enje nedjeljom",
I: "Divieto di guida di domenica",
P: "Proibi\u00e7\u00e3o de condu\u00e7\u00e3o aos domingos",
PL: "Zakaz prowadzenia pojazd\u00f3w w niedziel\u0119",
RO: "Interdic\u021bia de a conduce duminica",
RUS: "\u0417\u0430\u043f\u0440\u0435\u0442 \u043d\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u0435 \u0432 \u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435",
TR: "Pazar s\u00fcr\u00fc\u015f yasa\u011f\u0131",
AR: "\u062d\u0638\u0631 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u064a\u0648\u0645 \u0627\u0644\u0623\u062d\u062f"
},
basic: "0",
chapterLevelIndex: "2.2.30",
questioncount: {
"6": 1,
"7": 4,
"8": 3,
"9": 3,
"19": 1
},
subcategoryIds: [],
children: []
}, {
id: 81,
titles: {
DE: "Verkehrshindernisse",
GB: "Traffic Obstructions",
E: "Obst\u00e1culos al tr\u00e1fico",
F: "Obstacles \u00e0 la circulation",
GR: "\u039a\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ac \u03b5\u03bc\u03c0\u03cc\u03b4\u03b9\u03b1",
HR: "Prometne prepreke",
I: "Ostruzioni al traffico",
P: "Obstru\u00e7\u00f5es de tr\u00e1fego",
PL: "Przeszkody w ruchu drogowym",
RO: "Obstacole \u00een trafic",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u043f\u0440\u0435\u043f\u044f\u0442\u0441\u0442\u0432\u0438\u044f",
TR: "Trafik engelleri",
AR: "\u0627\u0644\u0639\u0648\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0648\u0631\u064a\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.32",
questioncount: {
"6": 2,
"7": 2,
"8": 2,
"9": 1,
"12": 6,
"13": 6,
"19": 2,
"20": 6,
"21": 6
},
subcategoryIds: [],
children: []
}, {
id: 111,
titles: {
DE: "Unfall",
GB: "Accident",
E: "Accidente",
F: "Accident",
GR: "\u0391\u03c4\u03cd\u03c7\u03b7\u03bc\u03b1",
HR: "nesre\u0107a",
I: "Incidente",
P: "Acidente",
PL: "Wypadek",
RO: "Accident",
RUS: "\u041d\u0435\u0441\u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u043b\u0443\u0447\u0430\u0439",
TR: "kaza",
AR: "\u062d\u0627\u062f\u062b\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.34",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"6": 6,
"7": 5,
"8": 5,
"9": 2,
"10": 8,
"11": 8,
"15": 2,
"16": 2,
"17": 2,
"19": 6
},
subcategoryIds: [],
children: []
}, {
id: 88,
titles: {
DE: "Wechsellichtzeichen und Dauerlichtzeichen",
GB: "Alternating and permanent light signals",
E: "Se\u00f1ales luminosas variables y permanentes",
F: "Signaux \u00e0 feux alternatifs et permanents",
GR: "\u039c\u03b5\u03c4\u03b1\u03b2\u03bb\u03b7\u03c4\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03bc\u03cc\u03bd\u03b9\u03bc\u03b5\u03c2 \u03c6\u03c9\u03c4\u03b5\u03b9\u03bd\u03ad\u03c2 \u03c0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b5\u03c2",
HR: "Izmjeni\u010dni svjetlosni signali i trajni svjetlosni signali",
I: "Segni luminosi variabili e permanenti",
P: "Sinais luminosos vari\u00e1veis e permanentes",
PL: "Znaki \u015bwietlne zmienne i sta\u0142e",
RO: "Semne luminoase variabile \u0219i permanente",
RUS: "\u041f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0438 \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0435 \u0441\u0432\u0435\u0442\u043e\u0432\u044b\u0435 \u0432\u044b\u0432\u0435\u0441\u043a\u0438",
TR: "De\u011fi\u015fen \u0131\u015f\u0131k sinyalleri ve kal\u0131c\u0131 \u0131\u015f\u0131k sinyalleri",
AR: "\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u0645\u062a\u0646\u0627\u0648\u0628\u0629 \u0648\u0625\u0634\u0627\u0631\u0627\u062a \u0636\u0648\u0626\u064a\u0629 \u062f\u0627\u0626\u0645\u0629"
},
basic: "0",
chapterLevelIndex: "2.2.37",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 3,
"6": 5,
"7": 1,
"8": 2,
"10": 2,
"11": 2,
"13": 2,
"15": 5,
"16": 5,
"17": 5,
"18": 3,
"19": 5,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 114,
titles: {
DE: "Blaues Blinklicht und gelbes Blinklicht",
GB: "Blue flashing light and yellow flashing light",
E: "Luz azul intermitente y luz amarilla intermitente",
F: "Feu bleu clignotant et feu jaune clignotant",
GR: "\u039c\u03c0\u03bb\u03b5 \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9 \u03ba\u03b1\u03b9 \u03ba\u03af\u03c4\u03c1\u03b9\u03bd\u03bf \u03c6\u03c9\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bd\u03b1\u03b2\u03bf\u03c3\u03b2\u03ae\u03bd\u03b5\u03b9",
HR: "Trep\u0107u\u0107e plavo svjetlo i trep\u0107u\u0107e \u017euto svjetlo",
I: "Luce lampeggiante blu e luce lampeggiante gialla",
P: "Luz intermitente azul e luz intermitente amarela",
PL: "Niebieskie \u015bwiat\u0142o migaj\u0105ce i \u017c\u00f3\u0142te \u015bwiat\u0142o migaj\u0105ce",
RO: "Lumin\u0103 intermitent\u0103 albastr\u0103 \u0219i lumin\u0103 intermitent\u0103 galben\u0103",
RUS: "\u0421\u0438\u043d\u0438\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442 \u0438 \u0436\u0435\u043b\u0442\u044b\u0439 \u043c\u0438\u0433\u0430\u044e\u0449\u0438\u0439 \u0441\u0432\u0435\u0442",
TR: "Yan\u0131p s\u00f6nen mavi \u0131\u015f\u0131k ve yan\u0131p s\u00f6nen sar\u0131 \u0131\u015f\u0131k",
AR: "\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0632\u0631\u0642 \u0648\u0648\u0645\u064a\u0636 \u0627\u0644\u0636\u0648\u0621 \u0627\u0644\u0623\u0635\u0641\u0631"
},
basic: "0",
chapterLevelIndex: "2.2.38",
questioncount: {
"6": 1,
"19": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 43,
titles: {
DE: "Verkehrszeichen",
GB: "Traffic signs",
E: "Se\u00f1ales de tr\u00e1fico",
F: "Panneaux de signalisation",
GR: "\u039a\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03b9\u03b1\u03ba\u03ad\u03c2 \u03c0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b5\u03c2",
HR: "Prometni znakovi",
I: "Segnali stradali",
P: "Sinais de tr\u00e2nsito",
PL: "Znaki drogowe",
RO: "Semne de circula\u021bie",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0437\u043d\u0430\u043a\u0438",
TR: "Trafik i\u015faretleri",
AR: "\u0627\u0634\u0627\u0631\u0627\u062a \u062d\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"
},
basic: "0",
chapterLevelIndex: "2.4",
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 7,
"5": 1,
"6": 31,
"7": 13,
"8": 11,
"9": 2,
"10": 8,
"11": 6,
"12": 13,
"13": 17,
"15": 14,
"16": 14,
"17": 14,
"18": 7,
"19": 31,
"20": 13,
"21": 17
},
subcategoryIds: [ 44, 84, 61, 80 ],
children: [ {
id: 44,
titles: {
DE: "Gefahrzeichen",
GB: "Danger sign",
E: "Se\u00f1ales de peligro",
F: "Panneaux de danger",
GR: "\u03a3\u03ae\u03bc\u03b1\u03c4\u03b1 \u03ba\u03b9\u03bd\u03b4\u03cd\u03bd\u03bf\u03c5",
HR: "Znak opasnosti",
I: "Segnali di pericolo",
P: "Sinais de perigo",
PL: "Znaki ostrzegawcze",
RO: "Semne de pericol",
RUS: "\u0417\u043d\u0430\u043a\u0438 \u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438",
TR: "Tehlike i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u062e\u0637\u0631"
},
basic: "0",
chapterLevelIndex: "2.4.40",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 5,
"6": 6,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 3,
"15": 5,
"16": 5,
"17": 5,
"18": 5,
"19": 6,
"20": 1,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 84,
titles: {
DE: "Vorschriftzeichen",
GB: "Regulation sign",
E: "Se\u00f1al reglamentaria",
F: "Panneau de prescription",
GR: "\u03a1\u03c5\u03b8\u03bc\u03b9\u03c3\u03c4\u03b9\u03ba\u03cc \u03c3\u03ae\u03bc\u03b1",
HR: "Propisni znak",
I: "Segno regolamentare",
P: "Sinal regulamentar",
PL: "Znak regulacyjny",
RO: "Semnul de reglementare",
RUS: "\u0420\u0435\u0433\u0443\u043b\u0438\u0440\u0443\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "d\u00fczenleme i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0644\u0627\u0626\u062d\u0629"
},
basic: "0",
chapterLevelIndex: "2.4.41",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"5": 1,
"6": 10,
"7": 11,
"8": 9,
"9": 2,
"10": 6,
"11": 4,
"12": 11,
"13": 12,
"15": 1,
"16": 1,
"17": 1,
"19": 10,
"20": 11,
"21": 12
},
subcategoryIds: [],
children: []
}, {
id: 61,
titles: {
DE: "Richtzeichen",
GB: "Direction sign",
E: "Se\u00f1al de direcci\u00f3n",
F: "Panneaux indicateurs",
GR: "\u03a0\u03b9\u03bd\u03b1\u03ba\u03af\u03b4\u03b1 \u03ba\u03b1\u03c4\u03b5\u03cd\u03b8\u03c5\u03bd\u03c3\u03b7\u03c2",
HR: "Znak smjera",
I: "Segno direzionale",
P: "Sinal direccional",
PL: "Znak kierunkowy",
RO: "Semn direc\u021bional",
RUS: "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0439 \u0437\u043d\u0430\u043a",
TR: "y\u00f6n i\u015fareti",
AR: "\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u0627\u062a\u062c\u0627\u0647"
},
basic: "0",
chapterLevelIndex: "2.4.42",
questioncount: {
"1": 7,
"2": 7,
"3": 7,
"4": 2,
"6": 14,
"7": 1,
"8": 1,
"10": 1,
"11": 1,
"12": 1,
"13": 2,
"15": 7,
"16": 7,
"17": 7,
"18": 2,
"19": 14,
"20": 1,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 80,
titles: {
DE: "Verkehrseinrichtungen",
GB: "Transport facilities",
E: "Instalaciones de tr\u00e1fico",
F: "Dispositifs de circulation",
GR: "\u0395\u03b3\u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1\u03c2",
HR: "Prometni objekti",
I: "Strutture per il traffico",
P: "Facilidades de tr\u00e1fego",
PL: "Udogodnienia w ruchu drogowym",
RO: "Facilit\u0103\u021bi de trafic",
RUS: "\u0414\u043e\u0440\u043e\u0436\u043d\u044b\u0435 \u0441\u043e\u043e\u0440\u0443\u0436\u0435\u043d\u0438\u044f",
TR: "Ula\u015f\u0131m tesisleri",
AR: "\u062a\u0633\u0647\u064a\u0644\u0627\u062a \u0627\u0644\u0646\u0642\u0644"
},
basic: "0",
chapterLevelIndex: "2.4.43",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 94,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "0",
chapterLevelIndex: "2.5",
questioncount: {
"1": 9,
"2": 9,
"3": 9,
"4": 5,
"5": 1,
"6": 30,
"7": 8,
"8": 7,
"10": 5,
"11": 4,
"12": 2,
"13": 3,
"15": 9,
"16": 9,
"17": 9,
"18": 5,
"19": 30,
"20": 2,
"21": 3
},
subcategoryIds: [ 99 ],
children: [ {
id: 99,
titles: {
DE: "Umweltschutz",
GB: "Environmental protection",
E: "Protecci\u00f3n del medio ambiente",
F: "Protection de l'environnement",
GR: "\u03a0\u03c1\u03bf\u03c3\u03c4\u03b1\u03c3\u03af\u03b1 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03b2\u03ac\u03bb\u03bb\u03bf\u03bd\u03c4\u03bf\u03c2",
HR: "za\u0161tita okoli\u0161a",
I: "Protezione dell'ambiente",
P: "Protec\u00e7\u00e3o ambiental",
PL: "Ochrona \u015brodowiska",
RO: "Protec\u021bia mediului",
RUS: "\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u043a\u0440\u0443\u0436\u0430\u044e\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044b",
TR: "\u00e7evresel koruma",
AR: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0626\u0629"
},
basic: "0",
chapterLevelIndex: "2.5.1",
questioncount: {
"1": 9,
"2": 9,
"3": 9,
"4": 5,
"5": 1,
"6": 30,
"7": 8,
"8": 7,
"10": 5,
"11": 4,
"12": 2,
"13": 3,
"15": 9,
"16": 9,
"17": 9,
"18": 5,
"19": 30,
"20": 2,
"21": 3
},
subcategoryIds: [],
children: []
} ]
}, {
id: 7,
titles: {
DE: "Vorschriften \u00fcber den Betrieb der Fahrzeuge",
GB: "Rules concerning the operation of vehicles",
E: "Normativa relativa a la circulaci\u00f3n de veh\u00edculos",
F: "Prescriptions relatives \u00e0 l'utilisation des v\u00e9hicules",
GR: "\u039a\u03b1\u03bd\u03bf\u03bd\u03b9\u03c3\u03bc\u03bf\u03af \u03c3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5 \u03c4\u03b7 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03c4\u03c9\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Pravila o upravljanju vozilima",
I: "Regolamenti riguardanti il funzionamento dei veicoli",
P: "Regulamentos relativos ao funcionamento dos ve\u00edculos",
PL: "Przepisy dotycz\u0105ce eksploatacji pojazd\u00f3w",
RO: "Reglement\u0103ri privind exploatarea vehiculelor",
RUS: "\u041f\u0440\u0430\u0432\u0438\u043b\u0430, \u043a\u0430\u0441\u0430\u044e\u0449\u0438\u0435\u0441\u044f \u044d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u0438 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7lar\u0131n \u00e7al\u0131\u015fmas\u0131na ili\u015fkin kurallar",
AR: "\u0642\u0648\u0627\u0639\u062f \u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.6",
questioncount: {
"1": 12,
"2": 13,
"3": 12,
"4": 13,
"5": 14,
"6": 29,
"7": 58,
"8": 57,
"9": 30,
"10": 50,
"11": 47,
"12": 20,
"13": 25,
"15": 12,
"16": 13,
"17": 12,
"18": 13,
"19": 29,
"20": 20,
"21": 25
},
subcategoryIds: [ 74, 90, 16, 56, 31, 8, 100 ],
children: [ {
id: 74,
titles: {
DE: "Untersuchung der Fahrzeuge",
GB: "Examination of the vehicles",
E: "Investigaci\u00f3n de veh\u00edculos",
F: "Examen des v\u00e9hicules",
GR: "\u0394\u03b9\u03b5\u03c1\u03b5\u03cd\u03bd\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Istraga vozila",
I: "Indagine sui veicoli",
P: "Investiga\u00e7\u00e3o de ve\u00edculos",
PL: "Dochodzenie w sprawie pojazd\u00f3w",
RO: "Investigarea vehiculelor",
RUS: "\u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7lar\u0131n incelenmesi",
AR: "\u0627\u0644\u062a\u062d\u0642\u064a\u0642 \u0641\u064a \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.6.1",
questioncount: {
"1": 2,
"2": 2,
"3": 2,
"6": 3,
"7": 3,
"8": 2,
"10": 3,
"11": 3,
"12": 1,
"13": 2,
"15": 2,
"16": 2,
"17": 2,
"19": 3,
"20": 1,
"21": 2
},
subcategoryIds: [],
children: []
}, {
id: 90,
titles: {
DE: "Zulassung zum Stra\u00dfenverkehr, Fahrzeugpapiere, Fahrerlaubnis",
GB: "Admission to road traffic, vehicle documents, driver's license",
E: "Admisi\u00f3n al tr\u00e1fico rodado, documentos del veh\u00edculo, permiso de conducir",
F: "Admission \u00e0 la circulation routi\u00e8re, documents du v\u00e9hicule, permis de conduire",
GR: "\u0395\u03b9\u03c3\u03b1\u03b3\u03c9\u03b3\u03ae \u03c3\u03c4\u03b7\u03bd \u03bf\u03b4\u03b9\u03ba\u03ae \u03ba\u03c5\u03ba\u03bb\u03bf\u03c6\u03bf\u03c1\u03af\u03b1, \u03ad\u03b3\u03b3\u03c1\u03b1\u03c6\u03b1 \u03bf\u03c7\u03ae\u03bc\u03b1\u03c4\u03bf\u03c2, \u03ac\u03b4\u03b5\u03b9\u03b1 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Odobrenje za cestovni promet, dokumenti vozila, voza\u010dka dozvola",
I: "Ammissione al traffico stradale, documenti del veicolo, patente di guida",
P: "Admiss\u00e3o ao tr\u00e1fego rodovi\u00e1rio, documentos de ve\u00edculos, carta de condu\u00e7\u00e3o",
PL: "Dopuszczenie do ruchu drogowego, dokumenty pojazdu, prawo jazdy",
RO: "Admiterea \u00een traficul rutier, documentele vehiculului, permisul de conducere",
RUS: "\u0414\u043e\u043f\u0443\u0441\u043a \u043a \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u043c\u0443 \u0434\u0432\u0438\u0436\u0435\u043d\u0438\u044e, \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u043d\u0430 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u043e\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043e, \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u0441\u043a\u043e\u0435 \u0443\u0434\u043e\u0441\u0442\u043e\u0432\u0435\u0440\u0435\u043d\u0438\u0435",
TR: "Karayolu trafi\u011fi, ara\u00e7 belgeleri, ehliyet i\u00e7in onay",
AR: "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0633\u064a\u0631 \u0639\u0644\u0649 \u0627\u0644\u0637\u0631\u0642 \u060c \u0648\u062b\u0627\u0626\u0642 \u0627\u0644\u0645\u0631\u0643\u0628\u0629 \u060c \u0631\u062e\u0635\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629"
},
basic: "0",
chapterLevelIndex: "2.6.2",
questioncount: {
"1": 9,
"2": 10,
"3": 9,
"4": 13,
"5": 14,
"6": 5,
"7": 13,
"8": 14,
"9": 1,
"10": 14,
"11": 13,
"12": 3,
"13": 5,
"15": 9,
"16": 10,
"17": 9,
"18": 13,
"19": 5,
"20": 3,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 16,
titles: {
DE: "Anh\u00e4ngerbetrieb",
GB: "Trailer operation",
E: "Funcionamiento del remolque",
F: "Conduite d'une remorque",
GR: "\u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03c4\u03c1\u03ad\u03b9\u03bb\u03b5\u03c1",
HR: "Rad prikolice",
I: "Funzionamento del rimorchio",
P: "Opera\u00e7\u00e3o de reboque",
PL: "Obs\u0142uga przyczepy",
RO: "Func\u021bionarea remorcii",
RUS: "\u042d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u044f \u043f\u0440\u0438\u0446\u0435\u043f\u0430",
TR: "R\u00f6mork operasyonu",
AR: "\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u0642\u0637\u0648\u0631\u0629"
},
basic: "0",
chapterLevelIndex: "2.6.3",
questioncount: {
"6": 13,
"9": 7,
"10": 1,
"11": 1,
"12": 8,
"13": 9,
"19": 13,
"20": 8,
"21": 9
},
subcategoryIds: [],
children: []
}, {
id: 56,
titles: {
DE: "Lenk- und Ruhezeiten",
GB: "Driving and rest periods",
E: "Periodos de conducci\u00f3n y descanso",
F: "Temps de conduite et de repos",
GR: "\u03a0\u03b5\u03c1\u03af\u03bf\u03b4\u03bf\u03b9 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2 \u03ba\u03b1\u03b9 \u03b1\u03bd\u03ac\u03c0\u03b1\u03c5\u03c3\u03b7\u03c2",
HR: "Razdoblja vo\u017enje i odmora",
I: "Periodi di guida e di riposo",
P: "Per\u00edodos de condu\u00e7\u00e3o e repouso",
PL: "Prowadzenie pojazdu i okresy odpoczynku",
RO: "Perioadele de conducere \u0219i de odihn\u0103",
RUS: "\u0412\u0440\u0435\u043c\u044f \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f \u0438 \u043e\u0442\u0434\u044b\u0445\u0430",
TR: "S\u00fcr\u00fc\u015f ve dinlenme s\u00fcreleri",
AR: "\u0641\u062a\u0631\u0627\u062a \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0648\u0627\u0644\u0631\u0627\u062d\u0629"
},
basic: "0",
chapterLevelIndex: "2.6.4",
questioncount: {
"7": 8,
"8": 9,
"9": 6,
"10": 5,
"11": 5
},
subcategoryIds: [],
children: []
}, {
id: 31,
titles: {
DE: "EG-Kontrollger\u00e4t",
GB: "EC control unit",
E: "Unidad de control CE",
F: "Appareil de contr\u00f4le CE",
GR: "\u039c\u03bf\u03bd\u03ac\u03b4\u03b1 \u03b5\u03bb\u03ad\u03b3\u03c7\u03bf\u03c5 \u0395\u039a",
HR: "EC kontrolni ure\u0111aj",
I: "Unit\u00e0 di controllo CE",
P: "Unidade de controlo CE",
PL: "Jednostka steruj\u0105ca WE",
RO: "Unitatea de control CE",
RUS: "\u0411\u043b\u043e\u043a \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0415\u0421",
TR: "AT kontrol cihaz\u0131",
AR: "\u062c\u0647\u0627\u0632 \u0627\u0644\u062a\u062d\u0643\u0645 EC"
},
basic: "0",
chapterLevelIndex: "2.6.5",
questioncount: {
"7": 8,
"8": 8,
"10": 8,
"11": 8
},
subcategoryIds: [],
children: []
}, {
id: 8,
titles: {
DE: "Abmessungen und Gewichte",
GB: "Dimensions and weights",
E: "Dimensiones y pesos",
F: "Dimensions et poids",
GR: "\u0394\u03b9\u03b1\u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03ba\u03b1\u03b9 \u03b2\u03ac\u03c1\u03b7",
HR: "Dimenzije i te\u017eine",
I: "Dimensioni e pesi",
P: "Dimens\u00f5es e pesos",
PL: "Wymiary i ci\u0119\u017cary",
RO: "Dimensiuni \u0219i greut\u0103\u021bi",
RUS: "\u0420\u0430\u0437\u043c\u0435\u0440\u044b \u0438 \u0432\u0435\u0441",
TR: "Boyutlar ve a\u011f\u0131rl\u0131klar",
AR: "\u0627\u0644\u0623\u0628\u0639\u0627\u062f \u0648\u0627\u0644\u0623\u0648\u0632\u0627\u0646"
},
basic: "0",
chapterLevelIndex: "2.6.6",
questioncount: {
"6": 5,
"7": 7,
"8": 6,
"9": 7,
"10": 6,
"11": 4,
"12": 8,
"13": 8,
"19": 5,
"20": 8,
"21": 8
},
subcategoryIds: [],
children: []
}, {
id: 100,
titles: {
DE: "Lesen einer Stra\u00dfenkarte und Streckenplanung",
GB: "Reading a road map and route planning",
E: "Lectura de un mapa de carreteras y planificaci\u00f3n de rutas",
F: "Lecture d'une carte routi\u00e8re et planification d'un itin\u00e9raire",
GR: "\u0391\u03bd\u03ac\u03b3\u03bd\u03c9\u03c3\u03b7 \u03bf\u03b4\u03b9\u03ba\u03bf\u03cd \u03c7\u03ac\u03c1\u03c4\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c7\u03b5\u03b4\u03b9\u03b1\u03c3\u03bc\u03cc\u03c2 \u03b4\u03b9\u03b1\u03b4\u03c1\u03bf\u03bc\u03ae\u03c2",
HR: "\u010citanje karte puta i planiranje rute",
I: "Lettura di una mappa stradale e pianificazione del percorso",
P: "Leitura de um mapa de estradas e planeamento de rotas",
PL: "Czytanie mapy drogowej i planowanie trasy",
RO: "Citirea unei h\u0103r\u021bi rutiere \u0219i planificarea traseului",
RUS: "\u0427\u0442\u0435\u043d\u0438\u0435 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u044b \u0438 \u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0430",
TR: "Bir yol haritas\u0131 okuma ve bir rota planlama",
AR: "\u0642\u0631\u0627\u0621\u0629 \u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642 \u0648\u062a\u062e\u0637\u064a\u0637 \u0627\u0644\u0637\u0631\u064a\u0642"
},
basic: "0",
chapterLevelIndex: "2.6.7",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 3,
"7": 19,
"8": 18,
"9": 9,
"10": 13,
"11": 13,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 3,
"21": 1
},
subcategoryIds: [],
children: []
} ]
}, {
id: 39,
titles: {
DE: "Technik",
GB: "Technology",
E: "Tecnolog\u00eda",
F: "Technique",
GR: "\u03a4\u03b5\u03c7\u03bd\u03bf\u03bb\u03bf\u03b3\u03af\u03b1",
HR: "tehnologija",
I: "Tecnologia",
P: "Tecnologia",
PL: "Technologia",
RO: "Tehnologie",
RUS: "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f",
TR: "teknoloji",
AR: "\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627"
},
basic: "0",
chapterLevelIndex: "2.7",
questioncount: {
"1": 80,
"2": 79,
"3": 80,
"4": 41,
"5": 12,
"6": 121,
"7": 143,
"8": 96,
"9": 80,
"10": 150,
"11": 131,
"12": 39,
"13": 70,
"15": 80,
"16": 79,
"17": 80,
"18": 41,
"19": 121,
"20": 39,
"21": 70
},
subcategoryIds: [ 40, 101, 102, 103, 104, 105, 106, 107, 108, 109 ],
children: [ {
id: 40,
titles: {
DE: "Fahrbetrieb, Fahrphysik, Fahrtechnik",
GB: "Driving operation, driving physics, driving technique",
E: "Funcionamiento de la conducci\u00f3n, f\u00edsica de la conducci\u00f3n, t\u00e9cnica de la conducci\u00f3n",
F: "Conduite, physique de conduite, technique de conduite",
GR: "\u039b\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c6\u03c5\u03c3\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2, \u03c4\u03b5\u03c7\u03bd\u03b9\u03ba\u03ae \u03bf\u03b4\u03ae\u03b3\u03b7\u03c3\u03b7\u03c2",
HR: "Operacija vo\u017enje, fizika vo\u017enje, tehnika vo\u017enje",
I: "Funzionamento della guida, fisica della guida, tecnica di guida",
P: "Opera\u00e7\u00e3o de condu\u00e7\u00e3o, f\u00edsica de condu\u00e7\u00e3o, t\u00e9cnica de condu\u00e7\u00e3o",
PL: "Prowadzenie pojazdu, fizyka jazdy, technika jazdy",
RO: "Func\u021bionarea la volan, fizica conducerii, tehnica conducerii",
RUS: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u043c, \u0444\u0438\u0437\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f, \u0442\u0435\u0445\u043d\u0438\u043a\u0430 \u0432\u043e\u0436\u0434\u0435\u043d\u0438\u044f",
TR: "S\u00fcr\u00fc\u015f operasyonu, s\u00fcr\u00fc\u015f fizi\u011fi, s\u00fcr\u00fc\u015f tekni\u011fi",
AR: "\u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u0641\u064a\u0632\u064a\u0627\u0621 \u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u060c \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.1",
questioncount: {
"1": 45,
"2": 45,
"3": 45,
"4": 23,
"5": 8,
"6": 61,
"7": 29,
"8": 23,
"9": 8,
"10": 45,
"11": 48,
"12": 10,
"13": 14,
"15": 45,
"16": 45,
"17": 45,
"18": 23,
"19": 61,
"20": 10,
"21": 14
},
subcategoryIds: [],
children: []
}, {
id: 101,
titles: {
DE: "M\u00e4ngelerkennung, Lokalisierung von St\u00f6rungen",
GB: "Defect detection, localization of faults",
E: "Detecci\u00f3n de defectos, localizaci\u00f3n de aver\u00edas",
F: "D\u00e9tection des d\u00e9fauts, localisation des pannes",
GR: "\u0391\u03bd\u03af\u03c7\u03bd\u03b5\u03c5\u03c3\u03b7 \u03b5\u03bb\u03b1\u03c4\u03c4\u03c9\u03bc\u03ac\u03c4\u03c9\u03bd, \u03b5\u03bd\u03c4\u03bf\u03c0\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c3\u03c6\u03b1\u03bb\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Detekcija kvarova, lokalizacija kvarova",
I: "Rilevare i difetti, localizzare i guasti",
P: "Detec\u00e7\u00e3o de defeitos, localiza\u00e7\u00e3o de avarias",
PL: "Wykrywanie wad, lokalizowanie usterek",
RO: "Detectarea defectelor, localizarea defectelor",
RUS: "\u0412\u044b\u044f\u0432\u043b\u0435\u043d\u0438\u0435 \u0434\u0435\u0444\u0435\u043a\u0442\u043e\u0432, \u043b\u043e\u043a\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0435\u0439",
TR: "Ar\u0131za tespiti, ar\u0131zalar\u0131n lokalizasyonu",
AR: "\u0643\u0634\u0641 \u0627\u0644\u062e\u0644\u0644 \u060c \u062a\u0648\u0637\u064a\u0646 \u0627\u0644\u0623\u0639\u0637\u0627\u0644"
},
basic: "0",
chapterLevelIndex: "2.7.2",
questioncount: {
"1": 24,
"2": 23,
"3": 24,
"4": 11,
"6": 31,
"7": 16,
"8": 16,
"9": 6,
"10": 15,
"11": 14,
"12": 3,
"13": 11,
"15": 24,
"16": 23,
"17": 24,
"18": 11,
"19": 31,
"20": 3,
"21": 11
},
subcategoryIds: [],
children: []
}, {
id: 102,
titles: {
DE: "Verbrennungsmaschine, Fl\u00fcssigkeiten, Kraftstoffsystem, elektrische Anlage, Z\u00fcndung, Kraft\u00fcbertragung",
GB: "combustion engine, fluids, fuel system, electrical system, ignition, power transmission",
E: "Motor de combusti\u00f3n interna, fluidos, sistema de combustible, sistema el\u00e9ctrico, encendido, transmisi\u00f3n de potencia",
F: "Moteur \u00e0 combustion interne, fluides, syst\u00e8me de carburant, syst\u00e8me \u00e9lectrique, allumage, transmission de puissance",
GR: "\u039a\u03b9\u03bd\u03b7\u03c4\u03ae\u03c1\u03b1\u03c2 \u03b5\u03c3\u03c9\u03c4\u03b5\u03c1\u03b9\u03ba\u03ae\u03c2 \u03ba\u03b1\u03cd\u03c3\u03b7\u03c2, \u03c5\u03b3\u03c1\u03ac, \u03c3\u03cd\u03c3\u03c4\u03b7\u03bc\u03b1 \u03ba\u03b1\u03c5\u03c3\u03af\u03bc\u03bf\u03c5, \u03b7\u03bb\u03b5\u03ba\u03c4\u03c1\u03b9\u03ba\u03cc \u03c3\u03cd\u03c3\u03c4\u03b7\u03bc\u03b1, \u03b1\u03bd\u03ac\u03c6\u03bb\u03b5\u03be\u03b7, \u03bc\u03b5\u03c4\u03ac\u03b4\u03bf\u03c3\u03b7 \u03b9\u03c3\u03c7\u03cd\u03bf\u03c2",
HR: "Motor s unutarnjim izgaranjem, teku\u0107ine, sustav goriva, elektri\u010dni sustav, paljenje, prijenos snage",
I: "Motore a combustione interna, fluidi, sistema di alimentazione, sistema elettrico, accensione, trasmissione di potenza",
P: "Motor de combust\u00e3o interna, fluidos, sistema de combust\u00edvel, sistema el\u00e9ctrico, igni\u00e7\u00e3o, transmiss\u00e3o de energia",
PL: "Silnik spalinowy, p\u0142yny, uk\u0142ad paliwowy, uk\u0142ad elektryczny, zap\u0142on, przeniesienie nap\u0119du",
RO: "Motor cu ardere intern\u0103, fluide, sistem de alimentare, sistem electric, aprindere, transmisie de putere",
RUS: "\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043b\u044c \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0435\u0433\u043e \u0441\u0433\u043e\u0440\u0430\u043d\u0438\u044f, \u0436\u0438\u0434\u043a\u043e\u0441\u0442\u0438, \u0442\u043e\u043f\u043b\u0438\u0432\u043d\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430, \u044d\u043b\u0435\u043a\u0442\u0440\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430, \u0437\u0430\u0436\u0438\u0433\u0430\u043d\u0438\u0435, \u0442\u0440\u0430\u043d\u0441\u043c\u0438\u0441\u0441\u0438\u044f",
TR: "Yanmal\u0131 motor, s\u0131v\u0131lar, yak\u0131t sistemi, elektrik sistemi, ate\u015fleme, g\u00fc\u00e7 aktar\u0131m\u0131",
AR: "\u0645\u062d\u0631\u0643 \u0627\u0644\u0627\u062d\u062a\u0631\u0627\u0642 \u060c \u0648\u0627\u0644\u0633\u0648\u0627\u0626\u0644 \u060c \u0648\u0646\u0638\u0627\u0645 \u0627\u0644\u0648\u0642\u0648\u062f \u060c \u0648\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a \u060c \u0648\u0627\u0644\u0625\u0634\u0639\u0627\u0644 \u060c \u0648\u0646\u0642\u0644 \u0627\u0644\u0637\u0627\u0642\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.3",
questioncount: {
"6": 2,
"7": 13,
"8": 4,
"10": 12,
"11": 4,
"12": 4,
"13": 4,
"19": 2,
"20": 4,
"21": 4
},
subcategoryIds: [],
children: []
}, {
id: 103,
titles: {
DE: "Schmier- und Frostschutzmittel",
GB: "Lubricant and antifreeze",
E: "Lubricantes y anticongelantes",
F: "Lubrifiants et antigels",
GR: "\u039b\u03b9\u03c0\u03b1\u03bd\u03c4\u03b9\u03ba\u03ac \u03ba\u03b1\u03b9 \u03b1\u03bd\u03c4\u03b9\u03c8\u03c5\u03ba\u03c4\u03b9\u03ba\u03ac",
HR: "Maziva i sredstva protiv smrzavanja",
I: "Lubrificanti e antigelo",
P: "Lubrificantes e anticongelantes",
PL: "Smary i \u015brodki przeciw zamarzaniu",
RO: "Lubrifian\u021bi \u0219i antigel",
RUS: "\u0421\u043c\u0430\u0437\u043e\u0447\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u0438 \u0430\u043d\u0442\u0438\u0444\u0440\u0438\u0437",
TR: "Ya\u011flay\u0131c\u0131lar ve antifriz maddeleri",
AR: "\u0645\u0648\u0627\u062f \u0627\u0644\u062a\u0634\u062d\u064a\u0645 \u0648\u0627\u0644\u0639\u0648\u0627\u0645\u0644 \u0627\u0644\u0645\u0636\u0627\u062f\u0629 \u0644\u0644\u062a\u062c\u0645\u062f"
},
basic: "0",
chapterLevelIndex: "2.7.4",
questioncount: {
"1": 3,
"2": 3,
"3": 3,
"4": 1,
"6": 3,
"7": 6,
"8": 2,
"10": 6,
"11": 3,
"12": 3,
"13": 3,
"15": 3,
"16": 3,
"17": 3,
"18": 1,
"19": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 104,
titles: {
DE: "Verwendung und Wartung von Reifen",
GB: "Use and maintenance of tires",
E: "Uso y mantenimiento de los neum\u00e1ticos",
F: "Utilisation et entretien des pneus",
GR: "\u03a7\u03c1\u03ae\u03c3\u03b7 \u03ba\u03b1\u03b9 \u03c3\u03c5\u03bd\u03c4\u03ae\u03c1\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03b5\u03bb\u03b1\u03c3\u03c4\u03b9\u03ba\u03ce\u03bd",
HR: "Kori\u0161tenje i odr\u017eavanje guma",
I: "Uso e manutenzione dei pneumatici",
P: "Utiliza\u00e7\u00e3o e manuten\u00e7\u00e3o de pneus",
PL: "U\u017cytkowanie i konserwacja opon",
RO: "Utilizarea \u0219i \u00eentre\u021binerea pneurilor",
RUS: "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0438 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u0448\u0438\u043d",
TR: "Lastiklerin kullan\u0131m\u0131 ve bak\u0131m\u0131",
AR: "\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0625\u0637\u0627\u0631\u0627\u062a \u0648\u0635\u064a\u0627\u0646\u062a\u0647\u0627"
},
basic: "0",
chapterLevelIndex: "2.7.5",
questioncount: {
"1": 7,
"2": 7,
"3": 7,
"4": 6,
"5": 3,
"6": 11,
"7": 19,
"8": 16,
"9": 10,
"10": 17,
"11": 16,
"12": 4,
"13": 5,
"15": 7,
"16": 7,
"17": 7,
"18": 6,
"19": 11,
"20": 4,
"21": 5
},
subcategoryIds: [],
children: []
}, {
id: 105,
titles: {
DE: "Bremsanlagen und Geschwindigkeitsregler",
GB: "Braking systems and speed controllers",
E: "Sistemas de frenado y control de crucero",
F: "Syst\u00e8mes de freinage et r\u00e9gulateurs de vitesse",
GR: "\u03a3\u03c5\u03c3\u03c4\u03ae\u03bc\u03b1\u03c4\u03b1 \u03c0\u03ad\u03b4\u03b7\u03c3\u03b7\u03c2 \u03ba\u03b1\u03b9 cruise control",
HR: "Sustavi ko\u010denja i regulatori brzine",
I: "Sistemi frenanti e controllo di crociera",
P: "Sistemas de travagem e controlo de velocidade de cruzeiro",
PL: "Uk\u0142ady hamulcowe i tempomat",
RO: "Sisteme de fr\u00e2nare \u0219i control al vitezei de croazier\u0103",
RUS: "\u0422\u043e\u0440\u043c\u043e\u0437\u043d\u044b\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u044b \u0438 \u043a\u0440\u0443\u0438\u0437-\u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c",
TR: "Fren sistemleri ve h\u0131z reg\u00fclat\u00f6rleri",
AR: "\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0643\u0628\u062d \u0648\u0645\u0646\u0638\u0645\u0627\u062a \u0627\u0644\u0633\u0631\u0639\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.6",
questioncount: {
"6": 12,
"7": 31,
"8": 24,
"9": 13,
"10": 32,
"11": 24,
"12": 4,
"13": 13,
"19": 12,
"20": 4,
"21": 13
},
subcategoryIds: [],
children: []
}, {
id: 106,
titles: {
DE: "Anh\u00e4ngerkupplungssysteme",
GB: "Trailer coupling systems",
E: "Sistemas de acoplamiento de remolques",
F: "Syst\u00e8mes d'attelage de remorque",
GR: "\u03a3\u03c5\u03c3\u03c4\u03ae\u03bc\u03b1\u03c4\u03b1 \u03b6\u03b5\u03cd\u03be\u03b7\u03c2 \u03c1\u03c5\u03bc\u03bf\u03c5\u03bb\u03ba\u03bf\u03cd\u03bc\u03b5\u03bd\u03c9\u03bd",
HR: "Sustavi spojnica za prikolice",
I: "Sistemi di aggancio per rimorchi",
P: "Sistemas de acoplamento de reboques",
PL: "Systemy sprz\u0119gania przyczep",
RO: "Sisteme de cuplare a remorcilor",
RUS: "\u0421\u0438\u0441\u0442\u0435\u043c\u044b \u0441\u0446\u0435\u043f\u043b\u0435\u043d\u0438\u044f \u043f\u0440\u0438\u0446\u0435\u043f\u043e\u0432",
TR: "R\u00f6mork ba\u011flant\u0131 sistemleri",
AR: "\u0623\u0646\u0638\u0645\u0629 \u0627\u0642\u062a\u0631\u0627\u0646 \u0627\u0644\u0645\u0642\u0637\u0648\u0631\u0629"
},
basic: "0",
chapterLevelIndex: "2.7.7",
questioncount: {
"7": 3,
"8": 3,
"9": 20,
"10": 2,
"11": 2,
"12": 7,
"13": 16,
"20": 7,
"21": 16
},
subcategoryIds: [],
children: []
}, {
id: 107,
titles: {
DE: "Wartung von Kraftfahrzeugen und rechtzeitige Veranlassung von Reparaturen",
GB: "Maintenance of motor vehicles and timely initiation of repairs",
E: "Mantenimiento de los veh\u00edculos de motor y arreglo oportuno de las reparaciones",
F: "Entretien des v\u00e9hicules \u00e0 moteur et organisation des r\u00e9parations en temps utile",
GR: "\u03a3\u03c5\u03bd\u03c4\u03ae\u03c1\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03bc\u03b7\u03c7\u03b1\u03bd\u03bf\u03ba\u03af\u03bd\u03b7\u03c4\u03c9\u03bd \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd \u03ba\u03b1\u03b9 \u03ad\u03b3\u03ba\u03b1\u03b9\u03c1\u03b7 \u03b4\u03b9\u03b5\u03c5\u03b8\u03ad\u03c4\u03b7\u03c3\u03b7 \u03c4\u03c9\u03bd \u03b5\u03c0\u03b9\u03c3\u03ba\u03b5\u03c5\u03ce\u03bd",
HR: "Odr\u017eavanje motornih vozila i pravovremeni popravci",
I: "Manutenzione dei veicoli a motore e disposizione tempestiva delle riparazioni",
P: "Manuten\u00e7\u00e3o de ve\u00edculos motorizados e organiza\u00e7\u00e3o atempada de repara\u00e7\u00f5es",
PL: "Utrzymanie pojazd\u00f3w silnikowych i terminowe dokonywanie napraw",
RO: "\u00centre\u021binerea autovehiculelor \u0219i aranjarea la timp a repara\u021biilor",
RUS: "\u0422\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u0430\u0432\u0442\u043e\u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0430 \u0438 \u0441\u0432\u043e\u0435\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u0430\u044f \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f \u0440\u0435\u043c\u043e\u043d\u0442\u0430",
TR: "Motorlu ta\u015f\u0131tlar\u0131n bak\u0131m\u0131 ve zaman\u0131nda onar\u0131mlar",
AR: "\u0635\u064a\u0627\u0646\u0629 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a \u0648\u0627\u0644\u0625\u0635\u0644\u0627\u062d\u0627\u062a \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0645\u0646\u0627\u0633\u0628"
},
basic: "0",
chapterLevelIndex: "2.7.8",
questioncount: {
"1": 1,
"2": 1,
"3": 1,
"6": 1,
"7": 8,
"9": 5,
"10": 8,
"11": 8,
"12": 1,
"13": 1,
"15": 1,
"16": 1,
"17": 1,
"19": 1,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
}, {
id: 108,
titles: {
DE: "Entgegennahme, Transport und Ablieferung der G\u00fcter",
GB: "Receipt, transport and delivery of goods",
E: "Recepci\u00f3n, transporte y entrega de mercanc\u00edas",
F: "R\u00e9ception, transport et livraison des marchandises",
GR: "\u03a0\u03b1\u03c1\u03b1\u03bb\u03b1\u03b2\u03ae, \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ac \u03ba\u03b1\u03b9 \u03c0\u03b1\u03c1\u03ac\u03b4\u03bf\u03c3\u03b7 \u03b1\u03b3\u03b1\u03b8\u03ce\u03bd",
HR: "Prijem, transport i isporuka robe",
I: "Ricevimento, trasporto e consegna delle merci",
P: "Recep\u00e7\u00e3o, transporte e entrega de mercadorias",
PL: "Odbi\u00f3r, transport i dostawa towar\u00f3w",
RO: "Recep\u021bia, transportul \u0219i livrarea m\u0103rfurilor",
RUS: "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435, \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0430 \u0438 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0442\u043e\u0432\u0430\u0440\u043e\u0432",
TR: "Mallar\u0131n al\u0131nmas\u0131, nakliyesi ve teslimi",
AR: "\u0627\u0633\u062a\u0644\u0627\u0645 \u0648\u0646\u0642\u0644 \u0648\u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u0628\u0636\u0627\u0626\u0639"
},
basic: "0",
chapterLevelIndex: "2.7.9",
questioncount: {
"7": 18,
"8": 8,
"9": 18,
"10": 1,
"11": 1,
"12": 3,
"13": 3,
"20": 3,
"21": 3
},
subcategoryIds: [],
children: []
}, {
id: 109,
titles: {
DE: "Ausr\u00fcstung von Fahrzeugen",
GB: "Equipment of vehicles",
E: "Equipamiento de veh\u00edculos",
F: "\u00c9quipement des v\u00e9hicules",
GR: "\u0395\u03be\u03bf\u03c0\u03bb\u03b9\u03c3\u03bc\u03cc\u03c2 \u03bf\u03c7\u03b7\u03bc\u03ac\u03c4\u03c9\u03bd",
HR: "Oprema vozila",
I: "Attrezzatura dei veicoli",
P: "Equipamento de ve\u00edculos",
PL: "Wyposa\u017cenie pojazd\u00f3w",
RO: "Echiparea vehiculelor",
RUS: "\u041e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u043d\u044b\u0445 \u0441\u0440\u0435\u0434\u0441\u0442\u0432",
TR: "Ara\u00e7 ekipmanlar\u0131",
AR: "\u0645\u0639\u062f\u0627\u062a \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.7.10",
questioncount: {
"5": 1,
"10": 12,
"11": 11
},
subcategoryIds: [],
children: []
} ]
}, {
id: 95,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Qualification and ability of drivers",
E: "Idoneidad y competencia de los conductores",
F: "Aptitude et comp\u00e9tences des conducteurs",
GR: "\u039a\u03b1\u03c4\u03b1\u03bb\u03bb\u03b7\u03bb\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03c9\u03bd \u03bf\u03b4\u03b7\u03b3\u03ce\u03bd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Idoneit\u00e0 e competenza dei conducenti",
P: "Adequa\u00e7\u00e3o e compet\u00eancia dos condutores",
PL: "Przydatno\u015b\u0107 i kompetencje maszynist\u00f3w",
RO: "Aptitudinea \u0219i competen\u021ba conduc\u0103torilor auto",
RUS: "\u041f\u0440\u0438\u0433\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.8",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 1,
"6": 5,
"7": 4,
"8": 3,
"9": 1,
"10": 6,
"11": 5,
"12": 1,
"13": 1,
"15": 5,
"16": 5,
"17": 5,
"18": 1,
"19": 5,
"20": 1,
"21": 1
},
subcategoryIds: [ 110 ],
children: [ {
id: 110,
titles: {
DE: "Eignung und Bef\u00e4higung von Kraftfahrern",
GB: "Suitability and competence of drivers",
E: "Idoneidad y competencia de los conductores",
F: "aptitude et comp\u00e9tences des conducteurs",
GR: "\u039a\u03b1\u03c4\u03b1\u03bb\u03bb\u03b7\u03bb\u03cc\u03c4\u03b7\u03c4\u03b1 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03c9\u03bd \u03bf\u03b4\u03b7\u03b3\u03ce\u03bd",
HR: "osposobljenost i sposobnost voza\u010da kamiona",
I: "Idoneit\u00e0 e competenza dei conducenti",
P: "Adequa\u00e7\u00e3o e compet\u00eancia dos condutores",
PL: "Zdolno\u015b\u0107 i kompetencje maszynist\u00f3w",
RO: "Aptitudinea \u0219i competen\u021ba conduc\u0103torilor auto",
RUS: "\u041f\u0440\u0438\u0433\u043e\u0434\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u043f\u0435\u0442\u0435\u043d\u0442\u043d\u043e\u0441\u0442\u044c \u0432\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
TR: "kamyon s\u00fcr\u00fcc\u00fclerinin kalifikasyonu ve yetene\u011fi",
AR: "\u062a\u0623\u0647\u064a\u0644 \u0648\u0642\u062f\u0631\u0629 \u0633\u0627\u0626\u0642\u064a \u0627\u0644\u0634\u0627\u062d\u0646\u0627\u062a"
},
basic: "0",
chapterLevelIndex: "2.8.1",
questioncount: {
"1": 5,
"2": 5,
"3": 5,
"4": 1,
"6": 5,
"7": 4,
"8": 3,
"9": 1,
"10": 6,
"11": 5,
"12": 1,
"13": 1,
"15": 5,
"16": 5,
"17": 5,
"18": 1,
"19": 5,
"20": 1,
"21": 1
},
subcategoryIds: [],
children: []
} ]
} ]
} ];
}

function initCategoryTree2() {
function b(a) {
return {
icon: a.children.length ? "assets/folder.png" : "assets/file.png",
classes: a.children.length ? "categorybranch" : "categoryleave",
content: Object.keys(a.titles).map(function(b) {
return '<span class="t_' + b.toLowerCase() + '">' + a.titles[b] + "</span>";
}).join(""),
attributes: {
chapterLevelIndex: a.chapterLevelIndex,
categoryId: a.id,
basic: a.basic,
subcategoryIds: a.subcategoryIds,
questioncount: a.questioncount
},
expandable: !!a.children.length,
expanded: !1,
components: a.children.map(b)
};
}
var a = getCategoryTree2Data(), c = [ {
kind: "Node",
icon: "assets/folder-big.png",
name: "nodBasicClassContent",
allowHtml: !0,
classes: "categoryroot",
content: "GRUNDSTOFF",
attributes: {
chapterLevelIndex: "1"
},
expandable: !0,
expanded: !1,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: a[0].children.map(b)
}, {
kind: "Node",
icon: "assets/folder-big.png",
name: "nodExtClassContent",
allowHtml: !0,
classes: "categoryroot",
content: "ZUSATZSTOFF",
attributes: {
chapterLevelIndex: "2"
},
expandable: !0,
expanded: !1,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: a[1].children.map(b)
} ];
return c;
}

// ../data/1/tblFocusCategories.js

function initFocusCategoryTree1() {
return [ {
kind: "Node",
icon: "assets/folder-open-big.png",
name: "nodFocusCategory",
allowHtml: !0,
classes: "categoryroot",
content: "Schwerpunkt&uuml;bungen",
attributes: {
chapterLevelIndex: "0"
},
expandable: !0,
expanded: !0,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: [ {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>bl_star</i> Neue Fragen <span class=\"insertdate\"></span></span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>bl_star</i> New Questions <span class=\"insertdate\"></span></span>",
attributes: {
chapterLevelIndex: 0,
categoryId: "newest",
basic: -1,
questioncount: {
"1": 31,
"2": 31,
"3": 31,
"4": 25,
"5": 11,
"6": 44,
"7": 32,
"8": 30,
"9": 24,
"10": 30,
"11": 30,
"12": 25,
"13": 27,
"15": 31,
"16": 31,
"17": 31,
"18": 25,
"19": 44,
"20": 25,
"21": 27
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_movie</i> Videofragen</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_movie</i> Video questions</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1e3,
basic: -1,
questioncount: {
"1": 132,
"2": 132,
"3": 132,
"4": 71,
"5": 20,
"6": 143,
"7": 75,
"8": 83,
"9": 61,
"10": 80,
"11": 81,
"12": 67,
"13": 67,
"15": 132,
"16": 132,
"17": 132,
"18": 71,
"19": 143,
"20": 67,
"21": 67
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_directions</i> Verkehrszeichen</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_directions</i> Traffic sign</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1001,
basic: -1,
questioncount: {
"1": 155,
"2": 155,
"3": 155,
"4": 148,
"5": 44,
"6": 171,
"7": 154,
"8": 152,
"9": 143,
"10": 148,
"11": 146,
"12": 153,
"13": 157,
"15": 155,
"16": 155,
"17": 155,
"18": 148,
"19": 171,
"20": 153,
"21": 157
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_commute</i> Vorfahrt, Vorrang</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_commute</i> Right of way, priority</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1002,
basic: -1,
questioncount: {
"1": 47,
"2": 47,
"3": 47,
"4": 47,
"5": 37,
"6": 47,
"7": 47,
"8": 47,
"9": 47,
"10": 47,
"11": 47,
"12": 47,
"13": 47,
"15": 47,
"16": 47,
"17": 47,
"18": 47,
"19": 47,
"20": 47,
"21": 47
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_filter_1</i> Zahlenfragen</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_filter_1</i> Number questions</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1003,
basic: -1,
questioncount: {
"1": 23,
"2": 22,
"3": 23,
"4": 18,
"5": 6,
"6": 41,
"7": 37,
"8": 34,
"9": 39,
"10": 30,
"11": 28,
"12": 32,
"13": 37,
"15": 23,
"16": 22,
"17": 23,
"18": 18,
"19": 41,
"20": 32,
"21": 37
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_functions</i> Faustformeln</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_functions</i> Rules of thumb</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1005,
basic: -1,
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 4,
"6": 15,
"7": 4,
"8": 4,
"9": 4,
"10": 4,
"11": 4,
"12": 4,
"13": 8,
"15": 14,
"16": 14,
"17": 14,
"18": 4,
"19": 15,
"20": 4,
"21": 8
}
}
} ]
} ];
}

// ../data/2/tblFocusCategories.js

function initFocusCategoryTree2() {
return [ {
kind: "Node",
icon: "assets/folder-open-big.png",
name: "nodFocusCategory",
allowHtml: !0,
classes: "categoryroot",
content: "Schwerpunkt&uuml;bungen",
attributes: {
chapterLevelIndex: "0"
},
expandable: !0,
expanded: !0,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: [ {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>bl_star</i> Neue Fragen <span class=\"insertdate\"></span></span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>bl_star</i> New Questions <span class=\"insertdate\"></span></span>",
attributes: {
chapterLevelIndex: 0,
categoryId: "newest",
basic: -1,
questioncount: {
"1": 24,
"2": 24,
"3": 24,
"4": 17,
"5": 9,
"6": 49,
"7": 20,
"8": 21,
"9": 12,
"10": 22,
"11": 22,
"12": 13,
"13": 13,
"15": 24,
"16": 24,
"17": 24,
"18": 17,
"19": 49,
"20": 13,
"21": 13
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_movie</i> Videofragen</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_movie</i> Video questions</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1e3,
basic: -1,
questioncount: {
"1": 128,
"2": 128,
"3": 128,
"4": 70,
"5": 20,
"6": 139,
"7": 75,
"8": 83,
"9": 61,
"10": 79,
"11": 80,
"12": 67,
"13": 67,
"15": 128,
"16": 128,
"17": 128,
"18": 70,
"19": 139,
"20": 67,
"21": 67
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_directions</i> Verkehrszeichen</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_directions</i> Traffic sign</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1001,
basic: -1,
questioncount: {
"1": 155,
"2": 155,
"3": 155,
"4": 148,
"5": 44,
"6": 171,
"7": 153,
"8": 151,
"9": 142,
"10": 148,
"11": 146,
"12": 153,
"13": 157,
"15": 155,
"16": 155,
"17": 155,
"18": 148,
"19": 171,
"20": 153,
"21": 157
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_commute</i> Vorfahrt, Vorrang</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_commute</i> Right of way, priority</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1002,
basic: -1,
questioncount: {
"1": 47,
"2": 47,
"3": 47,
"4": 47,
"5": 37,
"6": 47,
"7": 47,
"8": 47,
"9": 47,
"10": 47,
"11": 47,
"12": 47,
"13": 47,
"15": 47,
"16": 47,
"17": 47,
"18": 47,
"19": 47,
"20": 47,
"21": 47
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_filter_1</i> Zahlenfragen</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_filter_1</i> Number questions</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1003,
basic: -1,
questioncount: {
"1": 23,
"2": 22,
"3": 23,
"4": 18,
"5": 6,
"6": 41,
"7": 37,
"8": 34,
"9": 39,
"10": 30,
"11": 28,
"12": 32,
"13": 37,
"15": 23,
"16": 22,
"17": 23,
"18": 18,
"19": 41,
"20": 32,
"21": 37
}
}
}, {
icon: "assets/file-special.png",
classes: "categoryleave",
content: "<span class='t_de'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_functions</i> Faustformeln</span><span class='t_gb'><i class='material-icons' style='font-size:1em !important;margin-right:8px;'>ol_functions</i> Rules of thumb</span>",
attributes: {
chapterLevelIndex: 0,
categoryId: 1005,
basic: -1,
questioncount: {
"1": 14,
"2": 14,
"3": 14,
"4": 4,
"6": 15,
"7": 4,
"8": 4,
"9": 4,
"10": 4,
"11": 4,
"12": 4,
"13": 8,
"15": 14,
"16": 14,
"17": 14,
"18": 4,
"19": 15,
"20": 4,
"21": 8
}
}
} ]
} ];
}

// md5.js

function array(a) {
for (i = 0; i < a; i++) this[i] = 0;
this.length = a;
}

function integer(a) {
return a % 4294967296;
}

function shr(a, b) {
return a = integer(a), b = integer(b), a - 2147483648 >= 0 ? (a %= 2147483648, a >>= b, a += 1073741824 >> b - 1) : a >>= b, a;
}

function shl1(a) {
return a %= 2147483648, a & !0 ? (a -= 1073741824, a *= 2, a += 2147483648) : a *= 2, a;
}

function shl(a, b) {
a = integer(a), b = integer(b);
for (var c = 0; c < b; c++) a = shl1(a);
return a;
}

function and(a, b) {
a = integer(a), b = integer(b);
var c = a - 2147483648, d = b - 2147483648;
return c >= 0 ? d >= 0 ? (c & d) + 2147483648 : c & b : d >= 0 ? a & d : a & b;
}

function or(a, b) {
a = integer(a), b = integer(b);
var c = a - 2147483648, d = b - 2147483648;
return c >= 0 ? d >= 0 ? (c | d) + 2147483648 : (c | b) + 2147483648 : d >= 0 ? (a | d) + 2147483648 : a | b;
}

function xor(a, b) {
a = integer(a), b = integer(b);
var c = a - 2147483648, d = b - 2147483648;
return c >= 0 ? d >= 0 ? c ^ d : (c ^ b) + 2147483648 : d >= 0 ? (a ^ d) + 2147483648 : a ^ b;
}

function not(a) {
return a = integer(a), 4294967295 - a;
}

function F(a, b, c) {
return or(and(a, b), and(not(a), c));
}

function G(a, b, c) {
return or(and(a, c), and(b, not(c)));
}

function H(a, b, c) {
return xor(xor(a, b), c);
}

function I(a, b, c) {
return xor(b, or(a, not(c)));
}

function rotateLeft(a, b) {
return or(shl(a, b), shr(a, 32 - b));
}

function FF(a, b, c, d, e, f, g) {
return a = a + F(b, c, d) + e + g, a = rotateLeft(a, f), a += b, a;
}

function GG(a, b, c, d, e, f, g) {
return a = a + G(b, c, d) + e + g, a = rotateLeft(a, f), a += b, a;
}

function HH(a, b, c, d, e, f, g) {
return a = a + H(b, c, d) + e + g, a = rotateLeft(a, f), a += b, a;
}

function II(a, b, c, d, e, f, g) {
return a = a + I(b, c, d) + e + g, a = rotateLeft(a, f), a += b, a;
}

function transform(a, b) {
var c = 0, d = 0, e = 0, f = 0, g = transformBuffer;
c = state[0], d = state[1], e = state[2], f = state[3];
for (i = 0; i < 16; i++) {
g[i] = and(a[i * 4 + b], 255);
for (j = 1; j < 4; j++) g[i] += shl(and(a[i * 4 + j + b], 255), j * 8);
}
c = FF(c, d, e, f, g[0], S11, 3614090360), f = FF(f, c, d, e, g[1], S12, 3905402710), e = FF(e, f, c, d, g[2], S13, 606105819), d = FF(d, e, f, c, g[3], S14, 3250441966), c = FF(c, d, e, f, g[4], S11, 4118548399), f = FF(f, c, d, e, g[5], S12, 1200080426), e = FF(e, f, c, d, g[6], S13, 2821735955), d = FF(d, e, f, c, g[7], S14, 4249261313), c = FF(c, d, e, f, g[8], S11, 1770035416), f = FF(f, c, d, e, g[9], S12, 2336552879), e = FF(e, f, c, d, g[10], S13, 4294925233), d = FF(d, e, f, c, g[11], S14, 2304563134), c = FF(c, d, e, f, g[12], S11, 1804603682), f = FF(f, c, d, e, g[13], S12, 4254626195), e = FF(e, f, c, d, g[14], S13, 2792965006), d = FF(d, e, f, c, g[15], S14, 1236535329), c = GG(c, d, e, f, g[1], S21, 4129170786), f = GG(f, c, d, e, g[6], S22, 3225465664), e = GG(e, f, c, d, g[11], S23, 643717713), d = GG(d, e, f, c, g[0], S24, 3921069994), c = GG(c, d, e, f, g[5], S21, 3593408605), f = GG(f, c, d, e, g[10], S22, 38016083), e = GG(e, f, c, d, g[15], S23, 3634488961), d = GG(d, e, f, c, g[4], S24, 3889429448), c = GG(c, d, e, f, g[9], S21, 568446438), f = GG(f, c, d, e, g[14], S22, 3275163606), e = GG(e, f, c, d, g[3], S23, 4107603335), d = GG(d, e, f, c, g[8], S24, 1163531501), c = GG(c, d, e, f, g[13], S21, 2850285829), f = GG(f, c, d, e, g[2], S22, 4243563512), e = GG(e, f, c, d, g[7], S23, 1735328473), d = GG(d, e, f, c, g[12], S24, 2368359562), c = HH(c, d, e, f, g[5], S31, 4294588738), f = HH(f, c, d, e, g[8], S32, 2272392833), e = HH(e, f, c, d, g[11], S33, 1839030562), d = HH(d, e, f, c, g[14], S34, 4259657740), c = HH(c, d, e, f, g[1], S31, 2763975236), f = HH(f, c, d, e, g[4], S32, 1272893353), e = HH(e, f, c, d, g[7], S33, 4139469664), d = HH(d, e, f, c, g[10], S34, 3200236656), c = HH(c, d, e, f, g[13], S31, 681279174), f = HH(f, c, d, e, g[0], S32, 3936430074), e = HH(e, f, c, d, g[3], S33, 3572445317), d = HH(d, e, f, c, g[6], S34, 76029189), c = HH(c, d, e, f, g[9], S31, 3654602809), f = HH(f, c, d, e, g[12], S32, 3873151461), e = HH(e, f, c, d, g[15], S33, 530742520), d = HH(d, e, f, c, g[2], S34, 3299628645), c = II(c, d, e, f, g[0], S41, 4096336452), f = II(f, c, d, e, g[7], S42, 1126891415), e = II(e, f, c, d, g[14], S43, 2878612391), d = II(d, e, f, c, g[5], S44, 4237533241), c = II(c, d, e, f, g[12], S41, 1700485571), f = II(f, c, d, e, g[3], S42, 2399980690), e = II(e, f, c, d, g[10], S43, 4293915773), d = II(d, e, f, c, g[1], S44, 2240044497), c = II(c, d, e, f, g[8], S41, 1873313359), f = II(f, c, d, e, g[15], S42, 4264355552), e = II(e, f, c, d, g[6], S43, 2734768916), d = II(d, e, f, c, g[13], S44, 1309151649), c = II(c, d, e, f, g[4], S41, 4149444226), f = II(f, c, d, e, g[11], S42, 3174756917), e = II(e, f, c, d, g[2], S43, 718787259), d = II(d, e, f, c, g[9], S44, 3951481745), state[0] += c, state[1] += d, state[2] += e, state[3] += f;
}

function init() {
count[0] = count[1] = 0, state[0] = 1732584193, state[1] = 4023233417, state[2] = 2562383102, state[3] = 271733878;
for (i = 0; i < digestBits.length; i++) digestBits[i] = 0;
}

function update(a) {
var b, c;
b = and(shr(count[0], 3), 63), count[0] < 4294967288 ? count[0] += 8 : (count[1]++, count[0] -= 4294967296, count[0] += 8), buffer[b] = and(a, 255), b >= 63 && transform(buffer, 0);
}

function finish() {
var a = new array(8), b, c = 0, d = 0, e = 0;
for (c = 0; c < 4; c++) a[c] = and(shr(count[0], c * 8), 255);
for (c = 0; c < 4; c++) a[c + 4] = and(shr(count[1], c * 8), 255);
d = and(shr(count[0], 3), 63), e = d < 56 ? 56 - d : 120 - d, b = new array(64), b[0] = 128;
for (c = 0; c < e; c++) update(b[c]);
for (c = 0; c < 8; c++) update(a[c]);
for (c = 0; c < 4; c++) for (j = 0; j < 4; j++) digestBits[c * 4 + j] = and(shr(state[c], j * 8), 255);
}

function hexa(a) {
var b = "0123456789abcdef", c = "", d = a;
for (hexa_i = 0; hexa_i < 8; hexa_i++) c = b.charAt(Math.abs(d) % 16) + c, d = Math.floor(d / 16);
return c;
}

function MD5(a) {
var b, c, d, e, f, g, h;
init();
for (d = 0; d < a.length; d++) b = a.charAt(d), update(ascii.lastIndexOf(b));
finish(), e = f = g = h = 0;
for (i = 0; i < 4; i++) e += shl(digestBits[15 - i], i * 8);
for (i = 4; i < 8; i++) f += shl(digestBits[15 - i], (i - 4) * 8);
for (i = 8; i < 12; i++) g += shl(digestBits[15 - i], (i - 8) * 8);
for (i = 12; i < 16; i++) h += shl(digestBits[15 - i], (i - 12) * 8);
return c = hexa(h) + hexa(g) + hexa(f) + hexa(e), c;
}

var state = new array(4), count = new array(2);

count[0] = 0, count[1] = 0;

var buffer = new array(64), transformBuffer = new array(16), digestBits = new array(16), S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21, ascii = "01234567890123456789012345678901 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

// Alert.js

function alert(a, b, c) {
var d = b.createComponent({});
d.render();
var e = (new Alert).renderInto(d.node);
e.setMessage(a), e.setOwner(b);
if (c != null) {
e.setDoCancel(typeof c.onCancel == "function" || typeof c.cancelText == "string");
for (var f in c) e[f] = c[f];
e.setDynamic(!0);
}
return e.setShowing(!0), e;
}

enyo.kind({
name: "Alert",
kind: "onyx.Popup",
classes: "customalert",
style: "width:330px; max-width:96%; position:fixed; padding:30px 40px 20px 40px;background-color:#fff;color:#333; max-height:calc(95% - 40px); overflow-y:auto;",
centered: !0,
modal: !0,
scrim: !0,
floating: !0,
autoDismiss: !0,
published: {
message: "",
confirmText: "Schlie\u00dfen",
cancelText: "Abbrechen",
doCancel: !1,
dynamic: !1,
onCancel: function(a) {},
onCancelButton: function(a) {},
onConfirm: function(a) {}
},
components: [ {
name: "close",
content: "<i class='material-icons md-black' style='margin-right:0;opacity:0.5;'>ol_close</i>",
allowHtml: !0,
style: "position:absolute; top:12px; right:12px; z-index:999999",
ontap: "cancel"
}, {
name: "message",
style: "padding-bottom:20px !important; padding-right:10px;",
fit: !0,
allowHtml: !0
}, {
layoutKind: "FittableColumnsLayout",
style: "",
components: [ {
name: "confirm",
kind: "onyx.Button",
ontap: "confirm",
showing: !0,
classes: "onyx-blue",
style: "text-transform:uppercase",
content: this.confirmText,
fit: !0
}, {
name: "cancel",
kind: "onyx.Button",
ontap: "cancelButton",
showing: !1,
classes: "onyx-blue",
content: this.cancelText,
style: "width: 50% !important; margin-left:8px; text-transform:uppercase"
} ]
} ],
create: function() {
this.inherited(arguments), this.setConfirmText(appConfig.msgAlertBoxClose), this.setCancelText(appConfig.msgAlertBoxCancel), this.messageChanged(), this.dynamicChanged();
},
dynamicChanged: function(a) {
this.onCancelTextChanged(), this.onConfirmTextChanged(), this.onDoCancelChanged();
},
onCancelTextChanged: function(a) {
this.$.cancel.setContent(this.cancelText);
},
onConfirmTextChanged: function(a) {
this.$.confirm.setContent(this.confirmText), (this.confirmText == "Upgrade" || this.confirmText == "Kaufen") && this.$.confirm.applyStyle("background-color", "#fd9409");
},
onDoCancelChanged: function(a) {
this.$.cancel.setShowing(this.doCancel);
},
messageChanged: function(a) {
this.$.message.setContent(this.message);
},
confirm: function(a, b) {
this.onConfirm(this.owner), this.hide();
try {
this.$.confirm.applyStyle("width", "auto"), this.$.confirm.applyStyle("display", "block"), this.$.confirm.applyStyle("margin-bottom", "0"), this.$.cancel.applyStyle("width", "50% !important"), this.$.cancel.applyStyle("margin-left", "8px");
} catch (c) {}
this.destroy();
},
cancel: function(a, b) {
this.onCancel(this.owner), this.hide();
try {
this.$.confirm.applyStyle("width", "auto"), this.$.confirm.applyStyle("display", "block"), this.$.confirm.applyStyle("margin-bottom", "0"), this.$.cancel.applyStyle("width", "50% !important"), this.$.cancel.applyStyle("margin-left", "8px");
} catch (c) {}
this.destroy();
},
cancelButton: function(a, b) {
this.onCancel(this.owner), this.onCancelButton(this.owner), this.hide(), this.$.confirm.applyStyle("width", "auto"), this.$.confirm.applyStyle("display", "block"), this.$.confirm.applyStyle("margin-bottom", "0"), this.$.cancel.applyStyle("width", "50% !important"), this.$.cancel.applyStyle("margin-left", "8px"), this.destroy();
}
});

// CategoryTree.js

enyo.kind({
name: "categoryTree",
kind: "Control",
events: {
onTreeTap: ""
},
lastClickedNode: -1,
prevLastClickedNode: -1,
blockNodeTap: !1,
currentCategoryId: 0,
resetTree: function() {
var a = this.$.Scroller.getControls();
for (var b = 0; b < a.length; b++) {
var c = a[b].getControls();
for (var d = 0; d < c.length; d++) c[d].expandable && (c[d].setExpanded(!1), c[d].$.caption.applyStyle("background-color", null), c[d].$.caption.applyStyle("color", "#333"));
}
},
getMainCategoryNameByCategoryId: function(a) {
var b = this.$.Scroller.getControls();
for (var c = 0; c < b.length; c++) {
var d = b[c].getControls();
for (var e = 0; e < d.length; e++) {
var f = d[e].getAttributes();
if (typeof f.subcategoryIds != "undefined" && f.subcategoryIds.length > 0 && f.categoryId == a) return d[e].getContent();
var g = d[e].getControls();
for (var h = 0; h < g.length; h++) {
var f = g[h].getAttributes();
if (typeof f.questioncount != "undefined" && f.categoryId == a) return d[e].getContent();
}
}
}
},
getCategoryNameByCategoryId: function(a) {
var b = this.$.Scroller.getControls();
for (var c = 0; c < b.length; c++) {
var d = b[c].getControls();
for (var e = 0; e < d.length; e++) {
var f = d[e].getAttributes();
if (typeof f.subcategoryIds != "undefined" && f.subcategoryIds.length > 0 && f.categoryId == a) return d[e].getContent();
var g = d[e].getControls();
for (var h = 0; h < g.length; h++) {
var f = g[h].getAttributes();
if (typeof f.questioncount != "undefined" && f.categoryId == a) return g[h].getContent();
}
}
}
},
getFirstLevelCategoryProperties: function() {
var a = [], b = this.$.Scroller.getControls();
for (var c = 0; c < b.length; c++) {
var d = b[c].getControls();
for (var e = 0; e < d.length; e++) {
var f = d[e].getAttributes();
typeof f.subcategoryIds != "undefined" && f.subcategoryIds.length > 0 && (a[a.length] = new Object, a[a.length - 1].name = d[e].getContent(), a[a.length - 1].parentname = b[c].getContent(), a[a.length - 1].id = f.categoryId, a[a.length - 1].subcategoryids = f.subcategoryIds);
}
}
return a;
},
updateQuestionNumbers: function() {
var a = appDB.getStatisticsCache();
a != null ? a.statisticData == null && this.$.Statistics.updateStatisticDataIntoDatabase(!0) : this.$.Statistics.updateStatisticDataIntoDatabase(!0);
var a = appDB.getStatisticsCache();
a != null && (questionsInCurrentClass = parseInt(a.statisticData.questionsInCurrentClass, 10), questionsFitForTest = parseInt(a.statisticData.questionsFitForTest, 10), questionsAnswered = parseInt(a.statisticData.questionsAnswered, 10), questionstWrongLastTime = parseInt(a.statisticData.questionstWrongLastTime, 10), arrFirstLevelStatistics = a.statisticData.firstLevelStatistics, arrFirstLevelCategories = a.statisticData.firstLevelCategories);
if (questionsInCurrentClass > 0) var b = questionsFitForTest / questionsInCurrentClass * 100, c = questionsAnswered / questionsInCurrentClass * 100, d = questionstWrongLastTime / questionsInCurrentClass * 100; else var b = 0, c = 0, d = 0;
var e = this.$.Scroller.getControls();
for (var f = 0; f < e.length; f++) {
var g = e[f].getControls();
for (var h = 0; h < g.length; h++) {
var i = g[h].getAttributes();
if (typeof i.questioncount != "undefined") {
var j = this.getQuestionCountByClassId(i.questioncount, appConfig.userClassSelectedId), k = g[h].getContent().split("  (");
if (j > 0) {
var l = "";
for (var m = 0; m < arrFirstLevelCategories.length; m++) arrFirstLevelCategories[m].id == i.categoryId && (l += "" + arrFirstLevelStatistics[m].correct + "<span style='color:#83bc41;vertical-align:top;'>&#9632;</span>", l += ", " + arrFirstLevelStatistics[m].answeredtotal + "<span style='color:#fdc619;vertical-align:top;'>&#9632;</span>", l += ", " + arrFirstLevelStatistics[m].wrong + "<span style='color:#fa3b2a;vertical-align:top;'>&#9632;</span>");
l != "" && (l = "(" + l + ")");
if (i.chapterLevelIndex != "0") var n = appConfig.msgWordChapter + " " + i.chapterLevelIndex + " - "; else var n = "";
if (j == 1) var o = k[0] + "  <small class='hideForMsgBox' style='color:#aaa;'><br />" + n + j + " " + appConfig.msgAppQuestion + " " + l + "</small>"; else var o = k[0] + "  <small class='hideForMsgBox' style='color:#aaa;'><br />" + n + j + " " + appConfig.msgAppQuestions + " " + l + "</small>";
g[h].setContent(o), g[h].show();
} else g[h].hide();
}
var p = g[h].getControls();
for (var q = 0; q < p.length; q++) {
var i = p[q].getAttributes();
if (typeof i.questioncount != "undefined") {
var r = i.questioncount, k = p[q].getContent().split("  (");
this.getQuestionCountByClassId(r, appConfig.userClassSelectedId) > 0 ? (appConfig.appShowQuestionListDebugInfos && p[q].setContent("cat:" + i.categoryId + "; official:" + i.chapterLevelIndex + "; questions: " + this.getQuestionCountByClassId(r, appConfig.userClassSelectedId)), p[q].show()) : p[q].hide();
}
}
}
}
},
getQuestionCountByClassId: function(a, b) {
try {
return typeof a[b] == "undefined" ? 0 : a[b];
} catch (c) {
return 0;
}
},
directSelectNodeWithoutOpen: function(a) {
var b = this.$.Scroller.getControls();
for (var c = 0; c < b.length; c++) {
var d = b[c].getControls();
for (var e = 0; e < d.length; e++) {
var f = d[e].getAttributes();
if (typeof f.subcategoryIds != "undefined" && a == f.categoryId) {
b[c].setExpanded(!0), d[e].setExpanded(!1), this.currentCategoryId = -1;
var g = new Object;
g.originator = d[e], this.prevLastClickedNode = d[e], this.nodeExpand(d[e], g);
break;
}
}
}
this.doTreeTap();
},
directNodeOpen: function(a) {
var b = this.$.Scroller.getControls();
for (var c = 0; c < b.length; c++) {
var d = b[c].getControls();
for (var e = 0; e < d.length; e++) {
var f = d[e].getAttributes();
if (typeof f.subcategoryIds != "undefined" && f.subcategoryIds.length > 0) {
if (a == f.categoryId) {
b[c].setExpanded(!0), d[e].setExpanded(!0), this.currentCategoryId = -1;
var g = new Object;
g.originator = d[e], this.prevLastClickedNode = d[e], this.nodeExpand(d[e], g);
break;
}
var h = d[e].getControls();
for (var i = 0; i < h.length; i++) {
var f = h[i].getAttributes();
if (typeof f.questioncount != "undefined" && f.categoryId == a) {
b[c].setExpanded(!0), d[e].setExpanded(!0), h[i].setExpanded(!0), this.currentCategoryId = -1;
var g = new Object;
g.originator = h[i], this.prevLastClickedNode = h[i], this.nodeTap(h[i], g);
break;
}
}
}
}
}
this.doTreeTap();
},
nodeExpand: function(a, b) {
if (this.blockNodeTap) return;
a.getIcon() == "assets/folder-open-big.png" || a.getIcon() == "assets/folder-big.png" ? a.setIcon("assets/" + (a.expanded ? "folder-open-big.png" : "folder-big.png")) : a.setIcon("assets/" + (a.expanded ? "folder-open.png" : "folder.png"));
var c = b.originator, d = c.getAttributes();
this.$.selection.select(c.id, c);
if (typeof d.subcategoryIds != "undefined" && d.subcategoryIds.length > 0) {
this.currentCategoryId = d.categoryId, appCE.arrTempQuestionIds = new Array;
var e = d.subcategoryIds;
for (var f = 0; f < e.length; f++) {
if (d.basic == "1" || d.basic == "-1") if (dbTableClasses[appConfig.userClassSelectedId].name == "Mofa") for (var g in dbTblQ) dbTblQ[g].category_id.indexOf("," + e[f] + ",") > -1 && dbTblQ[g].basic_mofa == 1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = g); else for (var g in dbTblQ) dbTblQ[g].category_id.indexOf("," + e[f] + ",") > -1 && dbTblQ[g].basic == 1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = g);
if (d.basic == "0" || d.basic == "-1") for (var g in dbTblQ) if (dbTblQ[g].category_id.indexOf("," + e[f] + ",") > -1) {
var h = dbTblQ[g].classes.indexOf("," + appConfig.userClassSelectedId + ",");
h != -1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = g);
}
}
this.doTreeTap();
}
this.prevLastClickedNode = b.originator, enyo.job("closeOthers" + Math.random(), enyo.bind(this, "closeOtherNodes"), 200);
},
closeOtherNodes: function() {
this.blockNodeTap = !0;
try {
var a = this.lastClickedNode.getAttributes(), b = this.prevLastClickedNode.getAttributes(), c = b.chapterLevelIndex.indexOf(a.chapterLevelIndex);
if (!(c > -1)) {
this.lastClickedNode.setExpanded(!1), this.lastClickedNode.getIcon() == "assets/folder-open-big.png" || this.lastClickedNode.getIcon() == "assets/folder-big.png" ? this.lastClickedNode.setIcon("assets/folder-big.png") : this.lastClickedNode.setIcon("assets/folder.png");
var d = this.$.Scroller.getControls();
for (var e = 0; e < d.length; e++) if (d[e].expandable) {
var f = d[e].getAttributes(), g = f.chapterLevelIndex, h = b.chapterLevelIndex;
g.substr(0, 1) != h.substr(0, 1) && (d[e].setExpanded(!1), d[e].getIcon() == "assets/folder-open-big.png" || d[e].getIcon() == "assets/folder-big.png" ? d[e].setIcon("assets/folder-big.png") : d[e].setIcon("assets/folder.png"));
}
}
} catch (i) {}
enyo.job("unblockNodeTap" + Math.random(), enyo.bind(this, "unblockNodeTap"), 500);
},
unblockNodeTap: function() {
this.blockNodeTap = !1, this.lastClickedNode = this.prevLastClickedNode, this.doTreeTap();
},
nodeTap: function(a, b) {
var c = b.originator;
this.$.selection.select(c.id, c);
var d = c.getAttributes();
d.vfdate = this.getNewQuestionsDate();
if (typeof d.categoryId != "undefined") {
if (this.currentCategoryId != d.categoryId) {
this.currentCategoryId = d.categoryId;
if (this.currentCategoryId == "newest") {
appCE.arrTempQuestionIds = new Array;
if (dbTableClasses[appConfig.userClassSelectedId].name == "Mofa") for (var e in dbTblQ) dbTblQ[e].valid_from == d.vfdate && dbTblQ[e].basic_mofa == 1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = e); else for (var e in dbTblQ) dbTblQ[e].valid_from == d.vfdate && dbTblQ[e].basic == 1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = e);
if (d.basic == "0" || d.basic == "-1") for (var e in dbTblQ) if (dbTblQ[e].valid_from == d.vfdate) {
var f = dbTblQ[e].classes.indexOf("," + appConfig.userClassSelectedId + ",");
f != -1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = e);
}
} else {
appCE.arrTempQuestionIds = new Array;
if (d.basic == "1" || d.basic == "-1") if (dbTableClasses[appConfig.userClassSelectedId].name == "Mofa") for (var e in dbTblQ) dbTblQ[e].category_id.indexOf("," + this.currentCategoryId + ",") > -1 && dbTblQ[e].basic_mofa == 1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = e); else for (var e in dbTblQ) dbTblQ[e].category_id.indexOf("," + this.currentCategoryId + ",") > -1 && dbTblQ[e].basic == 1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = e);
if (d.basic == "0" || d.basic == "-1") for (var e in dbTblQ) if (dbTblQ[e].category_id.indexOf("," + this.currentCategoryId + ",") > -1) {
var f = dbTblQ[e].classes.indexOf("," + appConfig.userClassSelectedId + ",");
f != -1 && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = e);
}
}
this.doTreeTap();
}
} else this.currentCategoryId = 0;
},
select: function(a, b) {
b.data.$.caption.addClass("activeChapter"), this.doTreeTap();
},
deselect: function(a, b) {
b.data.$.caption.removeClass("activeChapter"), this.doTreeTap();
}
}), enyo.kind({
name: "categoryTree1",
kind: "categoryTree",
treeType: "official",
components: [ {
kind: "Selection",
onSelect: "select",
onDeselect: "deselect"
}, {
kind: "Scroller",
name: "Scroller",
fit: !0,
components: initCategoryTree1()
} ],
getNewQuestionsDate: function() {
return getCategoryTree1Date();
},
getCategoryData: function(a) {
return getCategoryTree1Data()[a];
}
}), enyo.kind({
name: "categoryTree2",
kind: "categoryTree",
treeType: "official",
components: [ {
kind: "Selection",
onSelect: "select",
onDeselect: "deselect"
}, {
kind: "Scroller",
name: "Scroller",
fit: !0,
components: initCategoryTree2()
} ],
getNewQuestionsDate: function() {
return getCategoryTree2Date();
},
getCategoryData: function(a) {
return getCategoryTree2Data()[a];
}
}), enyo.kind({
name: "focusCategoryTree1",
kind: "categoryTree",
treeType: "focus",
components: [ {
kind: "Selection",
onSelect: "select",
onDeselect: "deselect"
}, {
kind: "Scroller",
name: "Scroller",
fit: !0,
components: initFocusCategoryTree1()
} ],
getNewQuestionsDate: function() {
return getCategoryTree1Date();
},
getCategoryData: function(a) {
return getCategoryTree1Data()[a];
}
}), enyo.kind({
name: "focusCategoryTree2",
kind: "categoryTree",
treeType: "focus",
components: [ {
kind: "Selection",
onSelect: "select",
onDeselect: "deselect"
}, {
kind: "Scroller",
name: "Scroller",
fit: !0,
components: initFocusCategoryTree2()
} ],
getNewQuestionsDate: function() {
return getCategoryTree2Date();
},
getCategoryData: function(a) {
return getCategoryTree2Data()[a];
}
});

// Config_t24_2023.js

inAppPurchaseAlias = "PRO Upgrade", inAppPurchaseID = "t24.pro.vollversion", enyo.kind({
name: "appConfiguration",
kind: "Control",
published: {
appTitle: "THEORIE24 F\u00fchrerschein App",
appTitleIcon: '<a href="#" onclick="fsapp.processIconClick()"><img src="assets/imgT24Logo.png" alt="" style="" height="42px"/></a>',
appTitleHtml: " ",
appSubtitle: "",
appCopyright: "&copy; 2023 theorie24 GmbH, M\u00fcnchen",
appAuthor: "SZNM, York Szantyr, M\u00fcnchen",
appVariantId: "t24a",
appVersion: "2023.07",
appFirstStartAfterInstall: !1,
appFirstStartAfterUpdate: !1,
appShowIntroSlideshow: !0,
appPageHeaderSeparator: "",
appLockable: !1,
appLockMode: 0,
appNumberOfDemoSets: 10,
appNumberOfDemoSetsDB1: 10,
appNumberOfDemoSetsDB2: 10,
appLimitAvailableClasses: "",
appShowExtClassesButton: !0,
appHasPromoHelp: !1,
appOffersInAppPurchase: !0,
appDisplayIAPLabels: !0,
appFrameDocsUpdatable: !1,
appSetupWizardStep: 0,
appDevelopmentMode: !1,
appOnMobileDevice: !1,
appPlatformId: "web",
appMinSyncLimit: 30,
verifierMode: 1,
appWebKitViewerVersion: !1,
extVideoTriggerExtension: ".m4v",
extVideoFileExtension: ".m4v",
urlFSFinder: "",
urlVideoStreaming: "https://www.theorie24.de/live_images/_current_ws_2023-04-01_2023-10-01/videos/",
urlVideoDownload: "https://www.theorie24.de/live_images/_current_ws_2023-04-01_2023-10-01/videos/",
urlStatisticSync: "https://t24.theorie24.de/statsync/sync-2023.php",
urlDemoStatisticSync: "https://t24.theorie24.de/statsync/demouser-2023.php",
urlVerifyUser: "https://t24.theorie24.de/verifylogin/verify-2023.php",
urlRegisterUser: "https://t24.theorie24.de/verifylogin/register-2023.php",
urlLogoPage: "https://www.theorie24.de",
urlMainBGPage: "https://www.theorie24.de/webapp-einstieg/",
urlMainBGPageUnlockedApp: "https://www.theorie24.de/faqs.php",
urlImprintDoc: "",
urlPrivacyDoc: "",
showSplashScreen: !1,
resetStatisticsAllowed: !1,
appSyncDemoCountStatistics: !0,
initialHelpPageFilename: "index.html",
btnBgColorMainMenu: "#444444",
btnBgColor: "#fd9409",
btnFGColor: "#ffffff",
btnCaptionQuickstart: "Quickstart",
btnCaptionQuickstartWrongQuestions: "Letzte Fehler",
btnCaptionSchoolFinder: "",
btnCaptionByChapter: "Thema \u00fcben",
btnCaptionBySet: "Bogen \u00fcben",
btnCaptionByMarked: "Markierte Fragen",
btnCaptionStatistics: "Statistik",
btnCaptionSettings: "Einstellungen",
btnCaptionHelp: "Hilfe",
btnCaptionHelpLockedApp: "Hilfe",
btnCaptionQuit: "Beenden",
btnCaptionSync: "<i class='material-icons md-light'>ol_sync</i> Jetzt synchronisieren",
btnCaptionInAppPurchase: "Upgrade &bdquo;PRO Version&ldquo;",
btnCaptionByDemoSets: "Demo-B\u00f6gen",
btnCaptionUnlockApp: "Freischalten",
btnCaptionLockApp: "Logout",
btnCaptionDownloadVideos: "<i class='material-icons md-light'>ol_cloud_download</i> Videos herunterladen",
pageSubtitleMain: "F\u00fchrerschein",
pageSubtitleByChapter: "Themen",
initialHelpPageFilenameByChapter: "index.html?open=app_training",
pageSubtitleBySet: "Musterb\u00f6gen",
initialHelpPageFilenameBySet: "index.html?open=app_pruefung",
pageSubtitleByMarked: "Markiert<span class='loreshide'>e Fragen</span>",
initialHelpPageFilenameByMarked: "index.html?open=app_wiederholen",
pageSubtitleStatistics: "Statistik",
initialHelpPageFilenameByStatistics: "index.html?open=app_statistik",
pageSubtitleSettings: "Einstellungen",
initialHelpPageFilenameBySettings: "index.html?open=einst_start",
pageSubtitleHelp: "Hilfe",
pageSubtitleSchoolFinder: "",
pageSubtitleLogin: "Freischalten",
imgMainPageBackground: "assets/imgT24MainBg_2016all.png",
imgMainPageBackgroundUnlocked: "assets/imgT24MainBg_2016all.png",
imgMainPageBackgroundSmall: "assets/imgT24MainBg_2016all_small.png",
imgMainPageBackgroundUnlockedSmall: "assets/imgT24MainBg_2016all_small.png",
imgMainPageLogo: "",
pathImgMedium: "assets/img/images/",
pathImgZoom: "assets/img/images/",
extImgMedium: "",
extImgZoom: "",
quickstartQuestions: 30,
msgPlsUseAppInstead: "<u>WICHTIGER HINWEIS:</u> Sie scheinen die Web-App in einem mobilen Browser zu vewenden, dies f\u00fchrt i.d.R. zu Fehlern.<br /><br />Bitte verwenden Sie stattdessen unsere F\u00fchrerschein-App f\u00fcr Ihr Ger\u00e4t. Sie finden die App 'F\u00fchrerschein Theorie' von theorie24 im Appstore.",
msgBack: "<span>Zur\u00fcck</span>",
msgApply: "<span>\u00dcbernehmen</span>",
msgCancelApply: "<span class='subloreshide' style='height:1em;'><i style='vertical-align:top;font-size:1em;' class='material-icons'>ol_arrow_back_ios</i></span> <span>Zur\u00fcck</span>",
msgCancel: "<span>Abbrechen</span>",
msgSolve: "<span>Aufl\u00f6sung</span>",
msgEvaluate: "<span class='subloreshide'>Auswertung</span><span class='subloresshow'>Auswertung</span>",
msgEmpty: "x",
msgClass: "Klasse",
msgSet: "Bogen",
msgPoints: "Punkte",
msgBasic: "Grundstoff",
msgBasicHeaderLabel: "G<span class='subloreshide'>rundstoff</span>",
msgAdvanced: "Zusatzstoff",
msgAdvancedHeaderLabel: "Z<span class='subloreshide'>usatzstoff</span>",
msgQuestions: "Fragen",
msgMainMenu: "<span class='subloreshide'><i style='font-size:inherit;' class='material-icons'>ol_arrow_back_ios</i></span> <span>Zur\u00fcck</span>",
msgReadSet: "<span class='subloreshide'>Bogen lesen</span><span class='subloresshow'>Lesen</span>",
msgPracticeSet: "<span class='subloreshide'>Bogen \u00fcben</span><span class='subloresshow'>\u00dcben</span>",
msgTestSet: "<span class='subloreshide'>Pr\u00fcfungsmodus</span><span class='subloresshow'>Pr\u00fcfen</span>",
msgReadSelection: "<span class='subloreshide'>Fragen lesen</span><span class='subloresshow'>Lesen</span>",
msgPracticeSelection: "<span class='subloreshide'>Fragen \u00fcben</span><span class='subloresshow'>\u00dcben</span>",
msgSelectQuestionsBeforeReading: "Bitte w\u00e4hlen Sie zun\u00e4chst einige Fragen in der Liste aus und klicken Sie dann den Button, um diese zu lesen.",
msgSelectQuestionsBeforePracticing: "Bitte w\u00e4hlen Sie zun\u00e4chst einige Fragen in der Liste aus und klicken Sie dann den Button, um diese zu \u00fcben.",
msgSelectedPhrase1: "<h3 style='margin-bottom:8px;'>Sie haben ",
msgSelectedPhrase2: " ausgew\u00e4hlt</h3>",
msgNoSetSelectedPhrase: "Bitte w\u00e4hlen Sie einen Pr\u00fcfungsbogen aus...",
msgNoSetSelectedPhraseLockedApp: "<h3>Bitte w\u00e4hlen Sie einen der Demo-B\u00f6gen aus...</h3><br /><b>Zur Pru\u0308fungsvorbereitung ist die FREE-Version nicht ausreichend. Bitte benutzen Sie dazu ausschlie\u00dflich die PRO-Version.</b><br/>",
msgStill: "noch",
msgUnansweredQuesitons: "noch {num} Aufgaben",
msgAnswersCorrect: "<span class='anscorrexp'>Diese Frage wurde </span><u>richtig</u> beantwortet!",
msgAnswersIncorrect: "<span class='anscorrexp'>Diese Frage wurde </span><u>falsch</u> beantwortet<span class='anscorrexp'>!</span>",
msgSolveMobileHint: "",
msgSolveHint: "Ihre Antworten erscheinen in schwarz,<br />die Musterl\u00f6sung in <u>grau</u>.",
msgQuestionNeverPractised: "Frage noch nicht 2x ge\u00fcbt!",
msgQuestionCorrectlyAnswered: "Frage wurde richtig beantwortet",
msgQuestionIncorrectlyAnswered: "Frage wurde falsch beantwortet",
msgByChapterExplanation: "<div class='cp_explanation' style='margin:0;padding:8px;text-align:center;position:relative;top:30%;'><div style='padding:16px'>Bitte w\u00e4hlen Sie ein Thema aus dem <a onclick='fsapp.displayChapter({}, {chapter: 13});'>Grundstoff</a>, dem <a onclick='fsapp.displayChapter({}, {chapter: 11});'>Zusatzstoff</a> oder den Schwerpunkt\u00fcbungen aus.<br /><br /><a onclick='fsapp.openHelpPage();'>Mehr Informationen...</a></div></div>",
msgByMarkedExplanation: "<div class='cp_explanation' style='margin:0;padding:8px;text-align:center;position:relative;top:35%;'><div style='padding:16px'>Es sind aktuell keine Fragen markiert</div></div>",
msgButtonUnsolvedQuestions: "W\u00e4hlt Fragen, bei denen Sie noch nicht fit f\u00fcr die Pr\u00fcfung sind",
msgButtonWrongQuestions: "W\u00e4hlt Fragen, die zuletzt falsch beantwortet wurden",
msgButtonFitForTestQuestions: "W\u00e4hlt Fragen, bei denen Sie fit f\u00fcr die Pr\u00fcfung sind",
msgButtonUnsolvedAndWrongQuestions: "W\u00e4hlt Fragen, die noch nicht mind. 2x ge\u00fcbt wurden oder<br />zuletzt falsch beantwortet wurden",
msgButtonAllQuestions: "W\u00e4hlt alle Fragen in der Liste aus",
msgButtonReverseSelQuestions: "Kehrt die Vorauswahl der Fragen in der Liste um",
msgCancelHint: "Bitte beantworten Sie zun\u00e4chst alle Fragen, bevor Sie zur Auswertung gehen. Sie k\u00f6nnen die Pr\u00fcfung mit dem 'x' rechts oben abbrechen.",
msgReadModeHint: "Sie sind momentan im Lesemodus, bitte w\u00e4hlen Sie den \u00dcben- oder Pr\u00fcfungsmodus um die Fragen selbst beantworten zu k\u00f6nnen.",
msgTestSuccess: "<b>Gratulation, Sie haben die Pr\u00fcfung bestanden (%ERRORPOINTS% Fehlerpunkte)</b><hr/>Bitte sehen Sie sich ggf. die rot markierten Fragen noch einmal mit den Musterl\u00f6sungen an.<hr/>Grundstoff: %ERRORPOINTSBASIC% Fehlerpunkte<br />Zusatzstoff: %ERRORPOINTSADDITIVE% Fehlerpunkte",
msgTestFail: "<b>Sie haben die Pr\u00fcfung leider nicht bestanden (%ERRORPOINTS% Fehlerpunkte insgesamt)</b><hr/>Bitte sehen Sie sich die rot markierten Fragen noch einmal mit den Musterl\u00f6sungen an.<hr/>Grundstoff: %ERRORPOINTSBASIC% Fehlerpunkte<br />Zusatzstoff: %ERRORPOINTSADDITIVE% Fehlerpunkte",
msgTestFail5P: "<b>Sie haben die Pr\u00fcfung leider nicht bestanden, da Sie mind. zwei 5 Punkte Fragen falsch beantwortet haben (%ERRORPOINTS% Fehlerpunkte gesamt)</b><hr/>Bitte sehen Sie sich die rot markierten Fragen noch einmal mit den Musterl\u00f6sungen an.<hr/>Grundstoff: %ERRORPOINTSBASIC% Fehlerpunkte<br />Zusatzstoff: %ERRORPOINTSADDITIVE% Fehlerpunkte",
msgQuestionLastAnswered: "zuletzt ge\u00fcbt:",
msgQuestionMarked: "Diese Frage wurde markiert",
msgExplanationStatistics: "Die folgende Auswertung nach Themen zeigt, in welchen Bereichen noch ge\u00fcbt werden muss.<br />Ein Klick auf einen Balken \u00f6ffnet ein Fenster mit weiteren Informationen. Bitte ggf. nach unten scrollen.",
msgExplanationSchoolFinder: "Bitte geben Sie mindestens die ersten drei Buchstaben oder Ziffern des Ortes, der Postleitzahl oder des Fahrschulnamens ein, um in unserer Datenbank zu suchen. <br /><br />Hinweis: F\u00fcr die Suche wird eine Online-Verbindung ben\u00f6tigt.",
msgExplanationLogin1: "Sie haben sich bereits in Ihrer App f\u00fcr die Backup/Synchronisieren-Funktion registriert? Bitte geben Sie diese Zugangsdaten hier ein und klicken Sie auf 'Freischalten', um alle Funktionen nutzen zu k\u00f6nnen.",
msgExplanationLogin2: "Hinweis: F\u00fcr das Freischalten wird eine Online-Verbindung ben\u00f6tigt.",
msgExplanationLogin3: "Sie haben noch keine Zugangsdaten, um die vielen weiteren Funktionen wie z.B. Pr\u00fcfungssimulation, letzte Fehler, markierte Fragen etc. nutzen zu k\u00f6nnen? Bitte klicken Sie hier, um zu erfahren wie die Freischaltung abl\u00e4uft...",
msgExplanationLoginHome: "Bitte melden Sie sich zun\u00e4chst \u00fcber den Login-&shy;Button mit den Anmelde&shy;daten an, die Sie von Ihrer Fahr&shy;schule erhalten haben.",
msgVerificationFailed: "Leider konnte die G\u00fcltigkeit Ihrer Zugangsdaten nicht best\u00e4tigt werden. Bitte pr\u00fcfen Sie Ihre Daten und versuchen Sie es erneut.<br /><br />Die Anwendung wird daher noch nicht freigeschaltet.",
msgVerificationNotSuccessful: "Leider konnten Ihre Zugangsdaten nicht erfolgreich verifiziert werden.<br /><br />Bitte \u00fcberpr\u00fcfen Sie Ihre Angaben und versuchen Sie es erneut.",
msgVideoGeneralIntro: "Bitte starten Sie den Film, um sich mit der Situation vertraut zu machen.",
msgVideoSkip: "Wenn Sie zur Aufgabenstellung wechseln, k\u00f6nnen Sie den Film nicht noch einmal ansehen!<br />Wollen Sie wirklich zur Aufgabenstellung wechseln?",
msgConfirmQuitTesting: "M\u00f6chten Sie die Frageseite wirklich verlassen und zum Hauptmen\u00fc wechseln?",
msgMembernumber: "Passwort",
msgPlsWaitBetweenSyncing: "Bitte warten Sie mindestens 10 Sekunden zwischen zwei Synchronisierungen.",
msgSettingsSyncSwitchHeadline: "Automatische Synchronisierung",
msgSettingsSyncSwitchText: "Wenn diese Funktion eingeschaltet ist, wird die Statistik regelm\u00e4\u00dfig synchronisiert wenn eine Online-Verbindung besteht.",
msgSettingsDBSwitchBefore: "Pr\u00fcfung vor ",
msgSettingsDBSwitchAfter: "Pr\u00fcfung ab ",
msgSettingsDBSwitchText: "Um nur die relevanten Fragen anzuzeigen und zu \u00fcben, w\u00e4hlen Sie hier bitte das voraussichtliche Datum Ihrer Theorie-Pr\u00fcfung aus.",
msgQuickstartExplanation: "Hier werden 30 Fragen zum \u00dcben angezeigt, die noch nicht 2x nacheinander richtig beantwortet wurden.",
msgQuickstartWronglyAnsweredExplanation: "Hier werden bis zu 30 Fragen zum \u00dcben angezeigt, die zuletzt falsch beantwortet wurden.",
msgQuestionMotherflag: "<u>Diese Frage ist eine Mutterfrage:</u> <br/>Bild und/oder Text k\u00f6nnen in der Pr\u00fcfung leicht ver\u00e4ndert sein. Weitere Informationen finden Sie in der Hilfe.",
msgQuestionValidUntil: "Frage ist bis ",
msgQuestionValidFrom: "Frage ist ab ",
msgQuestionValidWord: "relevant",
msgSearchWord: "Suchen",
msgLoginWord: "Freischalten",
msgLoginFirstnameWord: "",
msgLoginLastnameWord: "E-Mail-Adresse",
msgLoginMembershipnumberWord: "Passwort",
msgFineprint: "",
msgRegistration: "Die App ist nun registriert, es stehen jetzt alle Funktionen zur Verf\u00fcgung.",
msgRegistrationFollowUpMsgMobile: "<u>WICHTIG:</u> Unsere Pr\u00fcfungs&shy;fragen richten sich exakt nach den amt&shy;lichen Pr\u00fcfungs&shy;richt&shy;linien, bein&shy;halten voll&shy;st\u00e4ndig alle Fragen f\u00fcr die ange&shy;gebenen F\u00fchrer&shy;schein&shy;klassen, bilden die offizielle Pr\u00fcfungs&shy;ober&shy;fl\u00e4che ab und bein&shy;halten alle amtlichen Pr\u00fcfungs&shy;bilder.",
msgErrorNoOnlineConnection: "F\u00fcr diese Funktion wird eine Online-Verbindung ben\u00f6tigt.<br /><br />Bitte pr\u00fcfen Sie Ihre Verbindung und versuchen Sie es erneut.",
msgErrorVideoNoOnlineConnection: "Um Videofragen vollst\u00e4ndig anzusehen wird eine Online-Verbindung ben\u00f6tigt.<br /><br />Bitte pr\u00fcfen Sie Ihre Verbindung und versuchen Sie es erneut.",
urlRateAppiOS: "Bitte klicken Sie zum Bewerten den Link: <br /><br /><a style=\"text-decoration:underline;color:#fff;font-weight:bold;\" href=\"#\" onclick=\"window.open('https://geo.itunes.apple.com/de/app/auto-fuhrerschein-theorie/id920788519?mt=8&uo=6', '_system', 'location=yes');\" >Unsere App im Appstore bewerten</a><br /><br />Wir freuen uns \u00fcber jede gute Bewertung!",
urlRateAppAndroid: "Bitte klicken Sie zum Bewerten den Link: <br /><br /><a style=\"text-decoration:underline;color:#fff\" href=\"#\" onclick=\"window.open('https://play.google.com/store/apps/details?id=de.theorie24.fs.auto&hl=de', '_system', 'location=yes');\" >Unsere App im Play-Store bewerten</a><br /><br />Wir freuen uns \u00fcber jede gute Bewertung!",
msgT24FreeAppFunctionalityIOS: '<h3 style="margin-top:0;margin-bottom:8px;">Warum sollte ich auf die &bdquo;PRO Version&ldquo; upgraden?</h3>Vielen Dank, dass Sie unsere App nutzen, Sie k\u00f6nnen sich damit vollst\u00e4ndig und mit allen Originalfragen vorbereiten.<br /><br />Zus\u00e4tzliche Funktionen &bdquo;PRO Version&ldquo;: <div style=""><ul id="checkmarklist"><li><u>Falsch beantwortete Fragen</u> gesammelt \u00fcben</li><li><u>Markierte Fragen</u> sammeln und \u00fcben</li><li><u>Pr\u00fcfungssimulation</u> nutzen</li><li>bisherige \u00dcbungsstatistik bleibt beim Upgrade erhalten</li></ul></div>Sichern Sie sich jetzt mit dem Upgrade Ihre optimale Vorbereitung!',
msgT24FreeAppFunctionalityAndroid: '<h3 style="margin-top:0;margin-bottom:8px;">Warum sollte ich auf die &bdquo;PRO Version&ldquo; upgraden?</h3>Vielen Dank, dass Sie unsere App nutzen, Sie k\u00f6nnen sich damit vollst\u00e4ndig und mit allen Originalfragen vorbereiten.<br /><br />Zus\u00e4tzliche Funktionen &bdquo;PRO Version&ldquo;: <div style=""><ul id="checkmarklist"><li><u>Falsch beantwortete Fragen</u> gesammelt \u00fcben</li><li><u>Markierte Fragen</u> sammeln und \u00fcben</li><li><u>Pr\u00fcfungssimulation</u> nutzen</li><li>bisherige \u00dcbungsstatistik bleibt beim Upgrade erhalten</li></ul></div>Sichern Sie sich jetzt mit dem Upgrade Ihre optimale Vorbereitung!',
msgT24InAppPurchaseIOS: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Upgrade kaufen</h2>',
appHas2DBs: !0,
db2ValidFromDate: "01.10.2017",
userDb2selected: !1,
msgDb1Selected: "Aktuell ist die Fragen-Datenbank f\u00fcr Pr\u00fcfungen vor dem %DB2VALIDDATE% ausgew\u00e4hlt. Sie k\u00f6nnen die Datenbank f\u00fcr Pr\u00fcfung ab dem %DB2VALIDDATE% unter 'Einstellungen' ausw\u00e4hlen.",
msgSelectExtClassesExplanation: "W\u00e4hlen Sie diese Option, wenn Sie bereits einen g\u00fcltigen F\u00fchrerschein au\u00dfer Mofa besitzen.",
msgsetValidUntilInfoExplanation: "Mit der \u00c4nderung des Fragenkatalogs werden neue Pr\u00fcfungsb\u00f6gen eingesetzt, die Bogen-Statistik beginnt damit wieder neu.<br /><br />Sie k\u00f6nnen den gew\u00fcnschten Fragenkatalog unter 'Einstellungen' ausw\u00e4hlen.",
msgNoLastWwrongAnsweredQuestions: "Es wurden keine zuletzt falsch beantworteten Fragen gefunden.",
msgLastQuestionGotoFirst: "Diese Frage ist die letzte Frage. M\u00f6chten Sie zur\u00fcck zur ersten Frage springen, um Ihre Angaben noch einmal zu \u00fcberpr\u00fcfen?",
msgNext: "<span>&nbsp;&nbsp;Weiter&nbsp;&nbsp;</span>",
msgSetupDownloadRecommendation: "Wir empfehlen die Videos jetzt per WLAN-Verbindung herunterzuladen, damit die Videos auch offline angesehen werden k\u00f6nnen.",
appTitleIconUnlocked: '<a href="#" onclick="fsapp.processIconClick()"><img src="assets/imgT24LogoPro.png" alt="" style="" height="42px"/></a>',
appTitleLockedSuffix: "",
appTitleUnlockedSuffix: " PRO",
msgCustomFilter: "Manuelle Auswahl",
btnCaptionRemoveVideos: "Heruntergeladene Videos l\u00f6schen",
msgDownloadedFilesRemoved: "Die von dieser App heruntergeladenen Mediadateien wurden vom Ger\u00e4t entfernt.",
msgRemoveDownloadedFilesConfirmation: "M\u00f6chten Sie wirklich alle von dieser App heruntergeladenen Videos von Ihrem Ger\u00e4t entfernen?",
msgWordYes: "Ja",
msgWordNo: "Nein",
appAdShowAds: !0,
appShowStaticWelcomeDisplay: !1,
msgTestSuccessNoError: "Gratulation, Sie haben die Pr\u00fcfung mit 0 Fehlern bestanden!",
hideHeaderHelpIconInDemo: !1,
msgThankYouForIAP: "Vielen Dank f\u00fcr Ihren Kauf des Upgrades! <br /><br />Es sind nun alle Funktionen frei&shy;geschaltet und alle Beschr\u00e4nk&shy;ungen aufgehoben.<br /><br />Sie k\u00f6nnen nun unter Einstellungen ein Backup-Konto einrichten.",
msgPROVersionButtonLabel: "",
msgPROVersionButtonLabelColor: "#0c0",
msgT24RestoreInAppPurchaseIOS: 'Wenn Sie das folgende Produkt bereits gekauft haben, dann k\u00f6nnen Sie es hier wiederherstellen, indem Sie auf den Button "Weiter" klicken:',
appUnlockSyncByUser: !0,
appSyncLocked: !0,
msgRegisterWord: "Registrieren",
forceEnvironment: "",
userSaveUserDataUnescaped: !0,
msgLogoutSuccess: "Sie wurden erfolgreich abgemeldet.",
msgWelcomeBack: "Willkommen zur\u00fcck!<br /><br />Sie sind momentan angemeldet als: !USERNAME!<br /><br />Wir w\u00fcnschen viel Erfolg bei der weiteren Vorbereitung.",
msgRegistrationSuccsessful: "Ihr Backup-Konto wurde erfolgreich eingerichtet.<br/><br /><u>Wichtig:</u> Die verwendeten Zugangsdaten werden im Men\u00fcpunkt 'Backup / Sync' angezeigt, Sonderzeichen und Gro\u00dfbuchstaben wurden ggf. umgewandelt. ",
countDemoQuestionUsageInLockedApp: !0,
activateSyncAfterSyncUnlock: !0,
displayClassIconAboveMenu: !1,
displayStatisticsProgressChart: !0,
displayLoginUserDataOnSyncPage: !1,
displayExplanationInPracticeMode: !1,
msgTrainingGraphExplanation: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Trainingsverlauf</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>Diese Grafik zeigt den Lernfortschritt im zeitlichen Verlauf der letzten zwei Wochen. Auf der x-Achse wird das Datum angezeigt, auf der y-Achse die jeweilige Prozentangabe.',
appAdTriggerMenuButton: 0,
appAdTriggerQuestionCounter: 1,
appAdTriggerSetSuccessful: 2,
appAdTriggerSetFailed: 3,
appAdTriggerLastErrors: 4,
appAdTriggerMarkedQuestion: 5,
appAdTriggerQuestionCounterAmount: 35,
pageSubtitleProfile: "Meine Einstellungen",
msgWordTestBefore: "vor ",
msgWordTestAfter: "ab ",
appVibrateOnWrongAnswer: !0,
appDisplayDisabledSets: !0,
msgWordMotherQuestion: "Mutterfrage",
appDisplayMQHeaderButton: !1,
appDisplaySyncUserPassword: !0,
appDisplayShareQuestionMsg: !0,
appDisplayInfoButtonInMainPageHeader: !0,
appDisplayIntroMessageOnQuickstartEtc: !0,
appDisplayExplanationOnWrongAnswer: !1,
msgThankYouForSharingOurApp: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Vielen Dank</h2>Danke, dass Sie unsere App weiterempfohlen haben. Wir w\u00fcnschen Ihnen weiterhin viel Erfolg bei der Vorbereitung und Gute Fahrt!',
urlPreviewImages: "https://www.theorie24.de/live_images/_current_ws_2023-04-01_2023-10-01/previews/",
urlAdvantagesHelpFile: "index.html?open=theorie_pro",
useAnimatedIAPIcon: !0,
appDisplayPROVersionButtonInIAPMsgBox: !0,
appDisplayIconInDonutCenterOnWelcomePage: !1,
appDisplayAlternativeDonut: !1,
appShareAppTitle: "Die perfekte F\u00fchrerschein App f\u00fcr iOS und Android",
appShareAppText: "Ich lerne gerade mit der F\u00fchrerschein App von theorie24 f\u00fcr iOS und Android, kann ich wirklich jedem weiterempfehlen. Gibt es im Appstore unter theorie24 auch als Gratis-Version.",
appShareAppImages: "https://www.theorie24.de/app-share/t24-share-app.png",
appShareAppURL: "https://www.theorie24.de/",
appShareQuestionVideoPreText: "Hinweis: Diese Frage enth\u00e4lt ein Video, das in der F\u00fchrerschein Theorie App von theorie24 angesehen werden kann. ",
appShareQuestionSentFrom: " (verschickt aus der theorie24 App)",
appShareQuestionURL: "https://www.theorie24.de/",
appTestingModeReading: 1,
appTestingModeExercising: 2,
appTestingModeTesting: 3,
appTestingModeSimulation: 4,
appTestingModeHandsOn: 10,
appOfficialLightBackgroundGreen: "#D3F5DA",
appOfficialDarkBackgroundGreen: "#379149",
appT24LightBackgroundColor: "#EAEAEA",
appT24DarkBackgroundColor: "#29546E ",
pageSubtitleByRoute: "Strecken",
initialHelpPageFilenameByRoute: "praxis.html",
lblRouteSelectionHeadline: "<h3 style='margin-bottom:0;'>Folgende Strecken stehen zur Auswahl</h3>",
msgNoRouteSelectedPhrase: "Bitte w\u00e4hlen Sie eine Strecke aus...",
msgNoRouteSelectedPhraseLockedApp: "Bitte w\u00e4hlen Sie eine Strecke aus...<br /><br />Alle Strecken finden Sie in der Vollversion/PRO-Version",
userRouteSelectedId: 0,
msgRouteSelectedPhrase1: "Sie haben ",
msgRouteSelectedPhrase2: " ausgew\u00e4hlt, bitte starten Sie \u00fcber die Buttons unten Ihre Fahrt.",
msgReadRoute: "Strecke lesen",
msgPracticeRoute: "Strecke \u00fcben",
appEnableQuestionVoiceOver: !1,
appVoiceOverHighlightColor: "#2299ff",
urlAudioStreaming: "https://www.theorie24.de/live_images/_current_ws_2023-04-01_2023-10-01/tts/de/0/",
urlAudioDownload: "https://www.theorie24.de/live_images/_current_ws_2023-04-01_2023-10-01/tts/de/0/",
btnCaptionDownloadAudios: "<i class='material-icons md-light'>ol_cloud_download</i> Audios herunterladen",
btnCaptionRemoveAudios: "Heruntergeladene Audios l\u00f6schen",
msgRemoveDownloadedAudiosConfirmation: "M\u00f6chten Sie wirklich alle von dieser App heruntergeladenen Audiodateien von Ihrem Ger\u00e4t entfernen?",
msgVoiceOverOnlyInPROVersion: "Die Funktion 'Vorlesen von Fragen und Antworten' ist nur in der Vollversion verf\u00fcgbar.",
appSelectedAltLanguageISO2: "DE",
appAvailableLanguages: {
DE: {
id: 1,
name: "Deutsch",
RtL: !1,
lockedQuestionText: "Sie verwenden momentan die LITE-Version in der die ersten 400 offiziellen Fragen enthalten sind. In der Vollversion sind alle Fragen enthalten, Sie k\u00f6nnen diese \u00fcber Upgrade im Hauptmen\u00fc freischalten.",
lockedAnswerText: "Alle Antworten in der Vollversion"
},
AR: {
id: 3,
name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
RtL: !0,
lockedQuestionText: "\u0623\u0646\u062a \u062a\u0633\u062a\u062e\u062f\u0645 \u062d\u0627\u0644\u064a\u064b\u0627 \u0627\u0644\u0625\u0635\u062f\u0627\u0631 LITE \u060c \u0627\u0644\u0630\u064a \u064a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u0623\u0648\u0644 400 \u0633\u0624\u0627\u0644 \u0631\u0633\u0645\u064a. \u0641\u064a \u0627\u0644\u0646\u0633\u062e\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u060c \u064a\u062a\u0645 \u062a\u0636\u0645\u064a\u0646 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u060c \u064a\u0645\u0643\u0646\u0643 \u0641\u062a\u062d\u0647\u0627 \u0639\u0646 \u0637\u0631\u064a\u0642 \u0627\u0644\u062a\u0631\u0642\u064a\u0629 \u0641\u064a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
lockedAnswerText: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u062c\u0648\u0628\u0629 \u0645\u062a\u0627\u062d\u0629 \u0641\u064a \u0627\u0644\u0646\u0633\u062e\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629"
},
GB: {
id: 2,
name: "English",
RtL: !1,
lockedQuestionText: "You are currently using the LITE version, which contains the first 400 official questions. In the full version all questions are included, you can unlock them via Upgrade in the main menu.",
lockedAnswerText: "All answers in the full version"
},
TR: {
id: 4,
name: "T\u00fcrk\u00e7e",
RtL: !1,
lockedQuestionText: "\u015eu anda ilk 400 resmi soruyu i\u00e7eren LITE s\u00fcr\u00fcm\u00fcn\u00fc kullan\u0131yorsunuz. Tam s\u00fcr\u00fcmde, t\u00fcm sorular dahil edilmi\u015ftir, ana men\u00fcden y\u00fckseltme yoluyla a\u00e7abilirsiniz.",
lockedAnswerText: "T\u00fcm cevaplar tam s\u00fcr\u00fcmde mevcuttur"
},
RO: {
id: 6,
name: "Rom\u00e2nesc",
RtL: !1,
lockedQuestionText: "\u00cen prezent, utiliza\u021bi versiunea LITE, care con\u021bine primele 400 de \u00eentreb\u0103ri oficiale. \u00cen versiunea complet\u0103, toate \u00eentreb\u0103rile sunt incluse, le pute\u021bi debloca prin actualizarea \u00een meniul principal.",
lockedAnswerText: "Toate r\u0103spunsurile sunt \u00een versiunea complet\u0103"
},
RUS: {
id: 12,
name: "P\u0443\u0301\u0441\u0441\u043a\u0438\u0439",
RtL: !1,
lockedQuestionText: "\u0412 \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0435 \u0432\u0440\u0435\u043c\u044f \u0432\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0435 \u0432\u0435\u0440\u0441\u0438\u044e LITE, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0441\u043e\u0434\u0435\u0440\u0436\u0438\u0442 \u043f\u0435\u0440\u0432\u044b\u0435 400 \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0445 \u0432\u043e\u043f\u0440\u043e\u0441\u043e\u0432. \u0412\u0441\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u044b \u0432 \u043f\u043e\u043b\u043d\u0443\u044e \u0432\u0435\u0440\u0441\u0438\u044e, \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0440\u0430\u0437\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0438\u0445 \u0447\u0435\u0440\u0435\u0437 \u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0432 \u0433\u043b\u0430\u0432\u043d\u043e\u043c \u043c\u0435\u043d\u044e.",
lockedAnswerText: "\u0412\u0441\u0435 \u043e\u0442\u0432\u0435\u0442\u044b \u0438\u043c\u0435\u044e\u0442\u0441\u044f \u0432 \u043f\u043e\u043b\u043d\u043e\u0439 \u0432\u0435\u0440\u0441\u0438\u0438"
},
PL: {
id: 5,
name: "Polski ",
RtL: !1,
lockedQuestionText: "Obecnie u\u017cywasz wersji LITE, kt\u00f3ra zawiera pierwsze 400 oficjalnych pyta\u0144. Wszystkie pytania s\u0105 zawarte w pe\u0142nej wersji, mo\u017cna je odblokowa\u0107 poprzez Upgrade w menu g\u0142\u00f3wnym.",
lockedAnswerText: "Wszystkie odpowiedzi w pe\u0142nej wersji"
},
I: {
id: 7,
name: "Italiano",
RtL: !1,
lockedQuestionText: "Attualmente state utilizzando la versione LITE che contiene le prime 400 domande ufficiali. Tutte le domande sono incluse nella versione completa, \u00e8 possibile sbloccarle tramite Upgrade nel menu principale.",
lockedAnswerText: "Tutte le risposte sono nella versione completa"
},
GR: {
id: 8,
name: "\u03b5\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
RtL: !1,
lockedQuestionText: "\u0391\u03c5\u03c4\u03ae\u03bd \u03c4\u03b7 \u03c3\u03c4\u03b9\u03b3\u03bc\u03ae \u03c7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03b5\u03af\u03c4\u03b5 \u03c4\u03b7\u03bd \u03ad\u03ba\u03b4\u03bf\u03c3\u03b7 LITE, \u03b7 \u03bf\u03c0\u03bf\u03af\u03b1 \u03c0\u03b5\u03c1\u03b9\u03ad\u03c7\u03b5\u03b9 \u03c4\u03b9\u03c2 \u03c0\u03c1\u03ce\u03c4\u03b5\u03c2 400 \u03b5\u03c0\u03af\u03c3\u03b7\u03bc\u03b5\u03c2 \u03b5\u03c1\u03c9\u03c4\u03ae\u03c3\u03b5\u03b9\u03c2. \u03a3\u03c4\u03b7\u03bd \u03c0\u03bb\u03ae\u03c1\u03b7 \u03ad\u03ba\u03b4\u03bf\u03c3\u03b7, \u03c0\u03b5\u03c1\u03b9\u03bb\u03b1\u03bc\u03b2\u03ac\u03bd\u03bf\u03bd\u03c4\u03b1\u03b9 \u03cc\u03bb\u03b5\u03c2 \u03bf\u03b9 \u03b5\u03c1\u03c9\u03c4\u03ae\u03c3\u03b5\u03b9\u03c2, \u03bc\u03c0\u03bf\u03c1\u03b5\u03af\u03c4\u03b5 \u03bd\u03b1 \u03c4\u03b9\u03c2 \u03be\u03b5\u03ba\u03bb\u03b5\u03b9\u03b4\u03ce\u03c3\u03b5\u03c4\u03b5 \u03bc\u03ad\u03c3\u03c9 \u0391\u03bd\u03b1\u03b2\u03ac\u03b8\u03bc\u03b9\u03c3\u03b7\u03c2 \u03c3\u03c4\u03bf \u03ba\u03cd\u03c1\u03b9\u03bf \u03bc\u03b5\u03bd\u03bf\u03cd.",
lockedAnswerText: "\u038c\u03bb\u03b5\u03c2 \u03bf\u03b9 \u03b1\u03c0\u03b1\u03bd\u03c4\u03ae\u03c3\u03b5\u03b9\u03c2 \u03c3\u03c4\u03b7\u03bd \u03c0\u03bb\u03ae\u03c1\u03b7 \u03ad\u03ba\u03b4\u03bf\u03c3\u03b7"
},
F: {
id: 9,
name: "Fran\u00e7ais",
RtL: !1,
lockedQuestionText: "Vous utilisez actuellement la version LITE qui contient les 400 premi\u00e8res questions officielles. Toutes les questions sont incluses dans la version compl\u00e8te, vous pouvez les d\u00e9verrouiller via Upgrade dans le menu principal.",
lockedAnswerText: "Toutes les r\u00e9ponses se trouvent dans la version compl\u00e8te"
},
E: {
id: 10,
name: "Espa\u00f1ol",
RtL: !1,
lockedQuestionText: "Actualmente est\u00e1 utilizando la versi\u00f3n LITE que contiene las primeras 400 preguntas oficiales. Todas las preguntas est\u00e1n incluidas en la versi\u00f3n completa, puede desbloquearlas a trav\u00e9s de Actualizar en el men\u00fa principal.",
lockedAnswerText: "Encontrar\u00e1 todas las respuestas en la versi\u00f3n completa"
},
P: {
id: 11,
name: "Portugu\u00eas",
RtL: !1,
lockedQuestionText: "Voc\u00ea est\u00e1 atualmente usando a vers\u00e3o LITE que cont\u00e9m as primeiras 400 perguntas oficiais. Todas as perguntas est\u00e3o inclu\u00eddas na vers\u00e3o completa, voc\u00ea pode desbloque\u00e1-las via Upgrade no menu principal.",
lockedAnswerText: "Todas as respostas na vers\u00e3o completa"
},
HR: {
id: 13,
name: "Hrvatski",
RtL: !1,
lockedQuestionText: "Trenutno koristite verziju LITE koja sadr\u017ei prvih 400 slu\u017ebenih pitanja. U punoj verziji, sva pitanja su uklju\u010dena, mo\u017eete ih otklju\u010dati putem Upgrade u glavnom izborniku.",
lockedAnswerText: "Svi odgovori u punoj verziji"
}
},
appMultilingualLocked: !0,
appMultilingualUnlockedQuestionLimit: "1.4.41",
appHasHandsOnModule: !1,
appDisplayQuestionVoiceOverSetting: !0,
appBargraphEmptyColor: "#d2d6d7",
appUseMultiLanguageAdvertising: !0,
msgEvaluateQuestionBeforeContinue: "Sie haben Antworten bei dieser Frage angegeben, aber noch nicht auf den 'Aufl\u00f6sung' Button geklickt. Um die Auswertung und Musterl\u00f6sung zu dieser Frage zu sehen klicken Sie bitte zun\u00e4chst auf den gr\u00fcnen Button 'Aufl\u00f6sung' . ",
msgAnswerQuestionBeforeEvaluating: "Bitte kreuzen Sie zun\u00e4chst mindestens eine Antwort an, bevor Sie die Frage auswerten lassen.",
appAdIncludeFromServer: !0,
appAdIncludeFromServerURL: "https://t24.theorie24.de/adserver2",
appAdIncludeFromServerFrequency: 2,
appAdIncludeFromServerCounter: 1,
forceAdDisplayForDebug: !1,
initialHelpPageFilenameBySearch: "index.html?open=app_wiederholen",
pageSubtitleBySearch: "Fragen suchen<span class='loreshide'></span>",
maxDisplayedSearchResults: 30,
msgBySearchExplanation: "<div class='cp_explanation' style='margin:0;padding:8px;text-align:center;position:relative;top:35%;'><div style='padding:16px'>Bitte geben Sie einen Suchbegriff oder eine Fragenummer ein, um die Suche zu starten.</div></div>",
hideFooterIfPossible: !1,
PageFooterHeight: "44px",
icoMarkedStarHtml: "<span><i class='material-icons' style='font-size:1em;color:#ffcc00;position:relative;top:0.2em;left:0.75em;' >bl_star</i></span>",
statisticsDonutCutoutPercentage: 70,
appShowStatisticBubblesWelcomeDisplay: !0,
btnOpenHelpFAQs: "<i class='material-icons' style='vertical-align:top;'>ol_help_outline</i> Hilfe zu dieser Einstellung",
btnInfoIcon: "<i class='material-icons icon-contexthelp' >ol_info</i>",
btnForwardIcon: "<i class='material-icons' style='font-size:1em;vertical-align:middle;color:#333;' >ol_arrow_forward_ios</i>",
msgStartVideo: "Video starten",
msgShowQuestionText: "Zur Aufgabenstellung",
msgIntroPageWelcome: "Willkommen bei der ADAC F\u00fchrerschein&#8209;App",
msgIntroPageClaim: "Die perfekte Vorbereitung f\u00fcr die theoretische F\u00fchrerscheinpr\u00fcfung",
appInAppBrowserTransitionstyle: "coververtical",
appDisplayWelcomeBackMsg: !1,
appDisplayLoginSuccessfulMsg: !1,
appDisplayLogoutSuccessfulMsg: !1,
appShowSetupWizardAfterLogin: !1,
appShowSetupWizardAfterSlideshow: !0,
appNumberOfIntroSlides: 3,
msgFillInAllFields: "Bitte f\u00fcllen Sie zun\u00e4chst alle Felder vollst\u00e4ndig und gem\u00e4\u00df den Vorgaben aus.",
loginPageHelpFile: "index.html?open=support_login",
msgSettingsSyncPageText: '<div class="classdescription"><h1>Synchronisieren</h1><p>Mit dem "Jetzt synchronisieren"-Button k\u00f6nnen Sie Ihren Lernstand jederzeit mit der zentralen Datenbank synchronisieren. Wenn die "Automatische Synchronisierung" aktiviert ist, wird die Statistik alle 30 Fragen automatisch aktualisiert. Somit k\u00f6nnen Sie auf verschiedenen Ger\u00e4ten \u00fcben.</p></div>',
msgSettingsGeneralPageText1: '<div class="classdescription"><h1>Allgemeine Einstellungen</h1><p>Vibrieren bei falscher Antwort: wenn diese Option eingeschaltet ist, dann vibriert Ihr Ger\u00e4t wenn eine Frage falsch beantwortet wird. Diese Funktion wird nicht von allen Ger\u00e4ten unterst\u00fctzt.</p><p>Erkl\u00e4rung bei falscher Antwort: es wird nach der falschen Beantwortung einer Frage im \u00dcben-Modus automatisch die Erkl\u00e4rung zur Frage angezeigt.</p><p>Intro-Message bei Letzte Fehler: es wird bei jedem Start der Funktionen "Letzte Fehler" und "30 Fragen \u00fcben" eine Einleitungsmeldung angezeigt.</p><p>Vorlesen von Fragen und Antworten: Es wird hinter den Fragen und Antworten ein Lautsprecher-Symbol <i style="font-size:inherit;" class="material-icons">ol_speaker</i> angezeigt. Beim Klick auf die Texte werden diese vorgelesen.</p><p>Die Dark-Mode-Einstellung aktiviert ein dunkleres Farbschema f\u00fcr die App und reduziert so die Erm\u00fcdung der Augen in einer dunklen Umgebung. Sie k\u00f6nnen diese Funktion auch \u00fcber das Sonnen-Symbol im Seitenmen\u00fc ein- oder ausschalten.</p></div>',
msgSettingsGeneralPageText2: '<div class="classdescription"><h1>Allgemeine Einstellungen</h1><p>Vibrieren bei falscher Antwort: wenn diese Option eingeschaltet ist, dann vibriert das Ger\u00e4t wenn eine Frage falsch beantwortet wird. Diese Funktion wird nicht von allen Ger\u00e4ten unterst\u00fctzt.</p><p>Erkl\u00e4rung bei falscher Antwort: es wird nach der falschen Beantwortung einer Frage im \u00dcben-Modus automatisch die Erkl\u00e4rung zur Frage angezeigt.</p><p>Intro-Message bei Letzte Fehler: es wird bei jedem Start der Funktionen "Letzte Fehler" und "30 Zufallsfragen" eine Einleitungsmeldung angezeigt.</p><p>Die Dark-Mode-Einstellung aktiviert ein dunkleres Farbschema f\u00fcr die App und reduziert so die Erm\u00fcdung der Augen in einer dunklen Umgebung. Sie k\u00f6nnen diese Funktion auch \u00fcber das Sonnen-Symbol im Seitenmen\u00fc ein- oder ausschalten.</p></div>',
msgSettingsMediaDownloadPageText1: "<div class='classdescription'><h1>Offline-Medien</h1><p>Auf mobilen Ger\u00e4ten haben Sie die M\u00f6glichkeit, alle Videos und Audios auf Ihr Ger\u00e4t zu speichern. Die Videos k\u00f6nnen dann auch ohne Internetverbindung abgespielt werden. F\u00fcr das Herunterladen der Videos (ca. 350 MB) wird eine WLAN-Verbindung empfohlen. Die Audios werden ausschlie\u00dflich f\u00fcr die Vorlesefunktion ben\u00f6tigt und m\u00fcssen i.d.R. nicht heruntergeladen werden.</p></div>",
msgSettingsMediaDownloadPageText2: "<div class='classdescription'><h1>Offline-Videos</h1><p>Auf mobilen Ger\u00e4ten haben Sie die M\u00f6glichkeit, alle Videos auf Ihrem Ger\u00e4t zu speichern. Die Videos k\u00f6nnen dann auch ohne Internetverbindung abgespielt werden. F\u00fcr das Herunterladen der Videos (ca. 350 MB) wird eine WLAN-Verbindung empfohlen.</p></div>",
msgSettingsExamDatePageText: "<div class='classdescription'><h1>Fragen-Update</h1><p>Geben Sie hier das voraussichtliche Datum Ihrer Pr\u00fcfung an und w\u00e4hlen Sie so den f\u00fcr diesen Zeitpunkt g\u00fcltigen Fragenkatalog aus.<br /><br />Der Fragenkatalog f\u00fcr die Theoretische Pr\u00fcfung wird zweimal im Jahr ge\u00e4ndert, und zwar zum 1. April und zum 1. Oktober eines Jahres. Die F\u00fchrerschein-App enth\u00e4lt immer den aktuellen und den zuk\u00fcnftigen Fragenkatalog und wird ca. drei Monate vor der n\u00e4chsten \u00c4nderung per Update aktualisiert.<br /><br /><u>Hinweis:</u> Ihr Lernstand f\u00fcr die bereits ge\u00fcbten Fragen bleibt nach einem Update erhalten, die Statistik f\u00fcr die neuen Frageb\u00f6gen f\u00e4ngt wieder bei Null an.</p></div>",
msgSettingsLanguagePageText: "<div class='classdescription'><h1>Sprachauswahl</h1><p>W\u00e4hlen Sie bitte aus, in welcher Sprache Sie den Fragenkatalog lernen m\u00f6chten.<br /><br />Der Fragenkatalog wird in Deutsch und in weiteren 12 Sprachen zum \u00dcben und zur offiziellen Pr\u00fcfung angeboten. Sie k\u00f6nnen beim \u00dcben mit einem Klick zwischen der gew\u00e4hlten Fremdsprache und der deutschen Originalfrage wechseln. Die Fragetexte in allen Sprachen sind von T\u00dcV/ArgeTP21 lizenziert und 100% original.</p></div>",
msgLogoutMsgbox: "Wollen Sie sich wirklich abmelden?",
msgPleaseFillInAllFields: "Bitte f\u00fcllen Sie zun\u00e4chst alle Felder vollst\u00e4ndig und gem\u00e4\u00df den Vorgaben aus.",
msgConfirmUnsetAllMarkedQuestions: "M\u00f6chten Sie wirklich alle markierten Fragen zur\u00fccksetzen?",
msgConfirmDownloadAllAudios: "M\u00f6chten Sie alle Audios der aktuell gew\u00e4hlten Datenbank herunterladen?<br /><br /><u>Hinweis:</u> Wenn Sie eine Online-Verbindung w\u00e4hrend des \u00dcbens haben ist kein Download notwendig. Der Download umfasst ca. 100MB je gew\u00e4hlter Sprache und dauert aufgrund der hohen Zahl an Dateien etwas l\u00e4nger.",
msgConfirmDownloadAllVideos: "M\u00f6chten Sie alle Videos der aktuell gew\u00e4hlten Datenbank herunterladen?<br /><br /><u>Hinweis:</u> Vermeiden Sie Verz\u00f6gerungen und zus\u00e4tzliche Geb\u00fchren f\u00fcr Datenverbrauch und verwenden Sie f\u00fcr den Download eine WLAN-Verbindung.",
helpSetupWizardClass: "index.html?open=einst_klasse",
helpSetupWizardDate: "index.html?open=einst_termin",
helpSetupWizardMedia: "index.html?open=einst_medien",
helpSetupWizardGeneral: "index.html?open=einst_allgemein",
helpSetupWizardBackup: "index.html?open=einst_backup",
helpSetupWizardLanguage: "index.html?open=einst_sprache",
userLastViewedTopicId: 0,
userLastViewedQuestionId: 0,
mnuShortcutLabel1: "<i class='material-icons md-black'>ol_home</i> <span>Home</span>",
mnuShortcutLabel2: "<i class='material-icons md-black'>ol_30_fps</i> <span>30 Fragen \u00fcben</span>",
mnuShortcutLabel3: "<i class='material-icons md-black'>ol_playlist_add_check</i> <span>Alle Fragen & Themen</span>",
mnuShortcutLabel4: "<i class='material-icons md-black'>ol_list_alt</i> <span>Musterb\u00f6gen</span>",
mnuShortcutLabel5: "<i class='material-icons md-black'>ol_help_outline</i> <span>Hilfe</span>",
mnuShortcutLabel6: "<i class='material-icons md-black'>ol_done_outline</i> <span>Lerntipps</span>",
mnuShortcutLabel7: "<i class='material-icons md-black'>ol_question_answer</i> <span>Support</span>",
mnuShortcutLabel8: "<i class='material-icons md-black'>ol_thumb_up</i> <span>App empfehlen</span>",
mnuShortcutLabel9: "<i class='material-icons md-white'>ol_home</i> <span>Impressum</span>",
mnuShortcutLabel10: "<i class='material-icons md-white'>ol_home</i> <span>Datenschutz</span>",
mnuShortcutBtnClose: "<i class='material-icons md-black'>ol_close</i>",
mnuShortcutAction1: "home",
mnuShortcutAction2: "quickstart",
mnuShortcutAction3: "bychapter",
mnuShortcutAction4: "byset",
mnuShortcutAction5: "help",
mnuShortcutAction6: "tips",
mnuShortcutAction7: "localsupport",
mnuShortcutAction8: "share",
mnuShortcutAction9: "imprint",
mnuShortcutAction10: "privacy",
msgWelcomePageYourLearningStatus: "<h2 style='margin-bottom:0'>Ihr Lernstand</h2>",
msgPlsChooseYourFilter: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Filterauswahl</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"></div>Bitte w\u00e4hlen Sie, welche Fragen in der Liste vorausgew\u00e4hlt sein sollen:<br /><br />',
msgConfirmTestCancel: "M\u00f6chten Sie diese Pr\u00fcfung wirklich verlassen?",
urlRegisterLink: "https://www.theorie24.de",
msgHeadlineQuestionDetails: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Details zur Frage</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>',
msgPasswordConditions: "<u>Wichtig:</u> E-Mail und Passwort m\u00fcssen jeweils mindestens f\u00fcnf Zeichen lang sein. Bitte verwenden Sie nur Buchstaben, @ und Zahlen, andere Zeichen werden ggf. ersetzt.",
msgBySearchNoHitExplanation: "<div class='cp_explanation' style='margin:0;padding:8px;text-align:center;position:relative;top:35%;'><div style='padding:16px'>Kein Treffer! Bitte versuchen Sie einen anderen Suchbegriff.</div></div>",
appSelectedAppLanguageISO2: "DE",
appAvailableAppLanguages: {
DE: {
id: 1,
name: "Deutsch",
RtL: !1,
langISO2: "de"
},
GB: {
id: 2,
name: "English",
RtL: !1,
langISO2: "en"
}
},
msgAppLanguageHeadline: "<h3 style='margin:0;padding:0'>Sprache der App</h3>",
msgQuestionsLanguageHeadline: "<h3 style='margin:0;padding:0'>Sprache der Pr\u00fcfungsfragen</h3>",
msgMark: "<span><i class='material-icons' style='font-size:1em;'>ol_star_border</i></span>",
msgDemark: "<span><i class='material-icons' style='font-size:1em;' >bl_star</i></span>",
msgSelectExtClasses: "Erweiterungspr\u00fcfung",
msgBtnImageZoomClose: "Schliessen",
msgTestingWordBasic: "Grundstoff",
msgTestingInfoDetailsSituationHeadline: "Details zur Situation",
msgErrorPlsWaitForVideo: "Ihr Video wird gerade vorbereitet, bitte versuchen Sie es in einigen Augenblicken erneut",
msgTestingBtnContinue: "Weiter",
msgVideoMaxViews: "Sie k\u00f6nnen das Video insgesamt {num} Mal ansehen.",
msgVideoRemainingViews: "Sie k\u00f6nnen sich den Film noch {num} mal ansehen.",
msgPlayVideoAgain: "Video erneut abspielen",
msgQuestion: "Frage",
msgFilterCurrentSelection: "Aktuelle Auswahl",
msgFilterInThisTopic: "in diesem Thema",
msgFilterInThisList: "in dieser Liste",
msgFilterLabelReadyForExam: "fit f\u00fcr die Pr\u00fcfung",
msgFilterNoFilter: "Kein Filter - alle Fragen",
msgFilterReadyForExam: "Fit f\u00fcr Pr\u00fcfung",
msgFilterNotReadyForExam: "Nicht fit f\u00fcr Pr\u00fcfung",
msgFilterNeverAnswered: "Noch nicht ge\u00fcbt",
msgFilterImageQuestions: "Bildfragen",
msgFilterVideoQuestions: "Videofragen",
msgFilter5PointQuestions: "5-Punkte-Fragen",
msgFilterStartLastQuestion: "Ab letzter Frage",
msgFilterBoxSelectedForReadingOrPracticing: "ausgew\u00e4hlt zum Lesen/\u00dcben",
msgAlertBoxClose: "Schliessen",
msgAlertBoxCancel: "Abbrechen",
msgInfoListPoints: "P<span class='subloreshide'>unkte</span>",
msgVibrateOnWrongAnswer: "Vibrieren bei falscher Antwort",
msgExplanationOnWrongAnswer: "Autom. Erkl\u00e4rung bei falscher Antwort",
msgHintOnQuickstartLastErrors: "Intro-Message bei Letzte Fehler / 30 Fragen",
msgHintOnVoiceOver: "Vorlesen (nur in Deutsch)",
msgQuestionOfficialNumber: "Fragennummer",
msgQuestionOfficialCategory: "Thema",
msgQuestionLastAnsweredMsgBox: "Frage zuletzt ge\u00fcbt am",
msgQuestionTimesRight: "mal richtig",
msgQuestionTimesWrong: "mal falsch",
msgQuestionWordAnsweredMsgBox: "beantwortet",
msgQuestionLastAnsweredWrong: "Frage zuletzt falsch beantwortet!",
msgQuestionNotYetAnswered: "Frage bisher noch nicht ge\u00fcbt.",
msgQuestionDetailShareLabel: '\u00dcber "Teilen" kann diese Frage an Freunde verschickt werden.',
msgButtonShare: "Teilen",
msgQuestionsInTopic: " Fragen<span class='subloreshide'> im Thema</span>",
msgQuesiontRecentlyAnsweredWrong: "Zuletzt falsch",
msgSearchQuestionPlaceholder: "Stichwort, Fragennummer ...",
btnClearList: "&nbsp;Liste leeren",
msgStatPageOverview: "\u00dcbersicht",
msgStatPageReadyForExam: "Fit f\u00fcr die Pr\u00fcfung",
msgStatPageAlreadyPracticed: "Mind. 1x ge\u00fcbt",
msgStatPageLastWrong: "Zuletzt falsch",
msgStatPageTrainingProgress: "Trainingsverlauf",
msgStatPageExplanationFitForTest: "Fit f\u00fcr die Pr\u00fcfung bedeutet, dass die Frage die letzten 2x richtig beantwortet wurde.",
msgNotYetPracticed: "Nicht ge\u00fcbt",
msgFocusExercises: "Schwerpunkt\u00fcbungen",
msgShortWorForQuestionnaire: "Bogen",
msgSetupWizardPageTitle: "Einrichtung",
msgSettingsVideoCounterAll: "alle",
msgSettingsVideoCounterOf: "von",
msgSettingsVideoCounterAlertPart1: "Es sind",
msgSettingsVideoCounterAlertPart2: "Videos f\u00fcr den ausgew\u00e4hlten Fragenkatalog heruntergeladen.",
msgSetupWizardContinueButton: "Weiter",
pageSubtitleByFocusExercises: "Schwerpunkt\u00fcbungen",
msgBtnCaptionYes: "Ja",
msgBtnCaptionNo: "Nein",
msgBtnSelect: "<span class='subloreshide'>Ausw\u00e4hlen</span><span class='subloresshow'>W\u00e4hlen</span>",
appDisplaySelTestDateAboveMainMenu: !0,
appStoreIdApple: "920819722",
appStoreIdGoogle: "de.theorie24.fs.mofa",
appRatingTriggerCounter: 0,
appRatingTriggerValue: 2,
msgRatingRequest: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Super, bestanden!</h2><h2  style="margin-top:0;margin-bottom:8px;font-weight:normal;">App jetzt bewerten?</h2>Es dauert nur einen Moment und hilft uns die App weiter zu entwickeln. Vielen Dank f\u00fcr Ihre Unterst\u00fctzung!',
msgRatingYes: "Ja",
msgRatingNo: "Sp\u00e4ter",
appRatingAlreadyDone: !1,
msgQuestionExplanationHeadline: "Erkl\u00e4rung zur Frage",
msgAppBasic: "Grundstoff",
msgAppAdvanced: "Zusatzstoff",
msgAppQuestion: "Frage",
msgAppQuestions: "Fragen",
msgAppYes: "Ja",
msgAppNo: "Nein",
msgAppQuickstartAllQuestionsDone: "Es sind alle Fragen schon 'Fit f\u00fcr die Pr\u00fcfung' (zuletzt 2x richtig), bitte ggf. nun in 'Alle Fragen & Themen' weiter \u00fcben.",
msgAppQuickstartAlmostAllQuestionsDone: "Es sind schon fast alle Fragen 'Fit f\u00fcr die Pr\u00fcfung' (zuletzt 2x richtig)! Daher sind nur noch weniger als 30 Fragen \u00fcbrig.",
msgAppEmail: "E-Mail:",
msgAppShowPassword: "Passwort: <u>anzeigen</u>",
msgAppPassword: "Passwort:",
msgBackupAccountAlreadyRegistered: "Konto bereits vorhanden",
msgButtonRegister: "Registrieren",
msgButtonLogin: "Login",
msgLoginConditions: "Bitte tragen Sie die Zugangsdaten ein, die Sie beim Registrieren Ihres Kontos verwendet haben.",
msgSettingsSyncRegistrationPageText: '<div class="classdescription"><h1>Backup / Sync</h1><h2>Erstmalige Anmeldung</h2><p>Tragen Sie hier Ihre E-Mail-Adresse und ein Passwort ein, um die kostenlose Backup- und Synchronisierungsfunktion nutzen zu k\u00f6nnen. Mit diesen Zugangsdaten k\u00f6nnen Sie auch die Webversion auf theorie24.de freischalten.</p><h2>Konto bereits vorhanden</h2><p>Wenn Sie sich bereits auf einem anderen Ger\u00e4t registriert haben, geben Sie Ihre Zugangsdaten ein.</div>',
msgDb1Expired: "Die ausgew\u00e4hlte Fragen-Datenbank ist nicht mehr aktuell. Bitte w\u00e4hlen Sie unter 'Einstellungen' das voraussichtliche Pr\u00fcfungsdatum aus.",
msgAppRestoreIAP: "<span class='iapPopupLink'>Wiederherstellen</span>",
appPriceLabelGoldApp: "9,99 \u20ac",
msgDescAddUpgrade: "Lern&shy;statistik <b>bleibt erhalten</b>.",
msgDescProApp: "Sie kaufen eine neue App, Lern&shy;ergeb&shy;nisse werden <b>nicht</b> \u00fcbernommen. <b>Fragen nur auf deutsch</b>.",
msgDescGoldApp: "Sie kaufen eine neue App, Lern&shy;ergeb&shy;nisse werden <b>nicht</b> \u00fcbernommen. Alle <b>Fragen in 13 Sprachen</b> plus <b>Backup</b> plus <b>ebook</b>.",
msgAppUpgradeExplanationShort: "<span class='iapPopupLink'>Was enth\u00e4lt die Vollversion?</span>",
msgAppUpgradeExplanationLong: "Alle Funktionen, Erkl\u00e4rungen und Muster&shy;b\u00f6gen werden frei&shy;geschaltet, es gibt <b>keine Begrenzung</b> bei der Anzahl der Fragen, B\u00f6gen und Pr\u00fcfungs&shy;simulationen, die ge\u00fcbt werden k\u00f6nnen. Die App ist ein <b>Einmalkauf</b>, Sie schlie\u00dfen <b>kein Abonnement</b> ab.<br /><u><span style='color:#29546e'>Ausblenden...</span></u>",
msgClear: "L\u00f6schen",
appInAppClassDescFileName: "tblClasses_",
msgHintOnVoiceOverGermanApp: "Vorlesen von Fragen und Antworten",
msgLastSyncWithDifferentClassDB: "<u>Hinweis:</u> Bei der letzten Synchronisierung wurde eine andere Klasse oder ein anderes Pr\u00fcfungsdatum verwendet. Wenn Sie diese App auf mehreren Ger\u00e4ten verwenden, stellen Sie sicher, dass auf allen Ger\u00e4ten dieselbe Klasse und dasselbe Pr\u00fcfungsdatum eingestellt sind.",
msgShowDetailsForSelectedClass: "Alle Details zur gew\u00e4hlten Klasse <i class='material-icons' style='font-size:1em;vertical-align:middle;color:#333;' >ol_arrow_forward_ios</i>",
msgWordEvaluation: "Auswertung",
msgRegistrationNotSuccessful: "Leider trat bei der Registrierung ein Problem auf, evtl. ist diese E-Mail-Adresse bereits vergeben. Bitte versuchen Sie es mit einer anderen E-Mail-Adresse.",
msgLoginNotSuccessful: "Leider trat beim Login ein Problem auf, bitte \u00fcberpr\u00fcfen Sie die eingegebene E-Mail-Adresse und das Passwort.",
msgRestoreFromLocalBackup: "Die App hat festgestellt, dass ein Backup (erstellt %CREATIONDATE%) existiert, das mehr gemachte Fragen enth\u00e4lt als die aktuelle Lernstatistik (%QUESTIONS1% vs. %QUESTIONS2% Fragen).<br /><br />M\u00f6chten Sie das Backup wiederherstellen? Falls nicht, wird es durch weiteres \u00dcben \u00fcberschrieben! ",
msgRestoreBackupComplete: "Das Backup wurde vollst\u00e4ndig eingespielt, die App wird automatisch in 5s neu gestartet...",
msgBackupAndStorageInSync: "Das lokale Backup und die Lernstatistik sind auf dem gleichen Stand, das Backup wird daher nicht eingespielt.",
msgBackupAndStorageInSyncWithDate: "Das lokale Backup (%CREATIONDATE%, %QUESTIONS1% Fragen) und die Lernstatistik sind auf dem gleichen Stand, das Backup wird daher nicht eingespielt.",
msgFilterMarkedQuestions: "Markierte Fragen",
msgNewQuestionsUntil: " bis zum ",
msgNewQuestionsFrom: " ab dem ",
appOpenQuestionsInMultilingualLite: 400,
msgRemainingOpenQuestions: "<span style='color:orange; font-size:75%'><br />Noch %REMAININGQUESTIONS% Fragen<br />in LITE VERSION</span>",
msgNoRemainingOpenQuestionsLeft: "Sie haben nun die in der LITE Version enthaltenen kostenlosen %OPENQUESTIONS% Fragen ge\u00fcbt. Um weiter zu lernen kaufen Sie bitte die GOLD Version mit Zugang zu allen Fragen und Funktionen.",
msgCompleteExplanationInPaidVersion: ' ...<br /><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>In der Vollversion finden Sie die vollst\u00e4ndige Erkl\u00e4rung und ggf. die StVO Paragraphen zu dieser Frage.',
mnuShortcutLabelLightMode: "<i class='material-icons md-black'>ol_bright_full</i> <span></span>",
mnuShortcutLabelDarkMode: "<i class='material-icons md-black'>ol_bright_half</i> <span></span>",
mnuShortcutAction0: "toggletheme",
appDarkModeActive: !1,
icoStatisticsIcon: "ol_insert_chart",
icoMnuBtnNext: "<i class='material-icons md-mainmenu' style='float:right'>ol_arrow_forward_ios</i>",
icoMnuBtnPrev: "<i class='material-icons md-mainmenu' style='float:none'>ol_arrow_back_ios</i>",
msgPleaseFinishSetupWizardFirst: "Bitte schlie\u00dfen Sie zun\u00e4chst den Einrichtungsassistenten ab, bevor Sie die Funktionen des Men\u00fcs verwenden.",
msgDarkModeActive: "Dark Mode aktivieren",
appCssFileLight: "css/App_t24.css",
appCssFileDark: "css/App_t24_dark.css",
msgWordStartingFromDate: " ab ",
hasDarkmodeSetting: !0,
msgQuestionApplicableVehicleType: "Bezugsfahrzeug: siehe Hilfe",
appUseAnimatedSlides: !0,
appDisplayQuickChoiceAfterSetupWizard: !0,
msgQuickChoiceMessage: '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Einrichtung erfolgreich</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>Sie sind startbereit! M\u00f6chten Sie nun zuerst unsere "Lerntipps" lesen oder direkt "30&nbsp;Fragen" \u00fcben?',
msgQuickChoiceHowToLearnButton: "Lerntipps lesen",
msgQuickChoice30Questions: "30 Fragen \u00fcben",
appLastNameMustBeEmailToUnlock: !1,
appHideAutoSyncSetting: !1,
appUseOpenApiProcess: !1,
appOpenApiUrl: "",
appUpdateProgressOnServer: !1,
urlSupportCenterDE: "https://help.theorie24.de/",
urlSupportCenterGB: "https://help.theorie24.de/?lang=en",
msgExplainExtClass: "Um eine Erweiterungspr\u00fcfung handelt es sich immer dann, wenn eine bestandene noch g\u00fcltige theoretische Fahrerlaubnispr\u00fcfung oder eine Fahrerlaubnis vorhanden ist.",
appMaxAvailableSetsForUser: 66,

msgWordChapter: "Kapitel",
msgVideoDlComplete: "Video-Downloads abgeschlossen",
msgVideoDlInProgress: "Download ",
msgVideoDlError: "Download-Fehler bei Video ",
msgVideoDlExists: "Bereits vorhanden: ",
msgAudioDlComplete: "Audio-Downloads abgeschlossen",
msgAudioDlInProgress: "Audio Download l\u00e4uft... ",
msgUpdateCompleted: "<h3 style='margin-top:0;margin-bottom:8px;'>Update-Hinweis</h3>Es wurde ein Update durch&shy;gef\u00fchrt und der Fragen&shy;katalog aktualisiert. Sie k\u00f6nnen den gew\u00fcnschten Fragenkatalog unter <i> Einstellungen &gt; Pr\u00fcfungstermin</i> wechseln.",
appLogOutAfterUpdate: !1,
msgAppMembershipHash: "ID: ",
appSaveTestSimulationResults: !1,
appSyncTestSimulationResults: !1,
appShowAccountDeletionButton: !0,
msgButtonDeleteAccount: "<i class='material-icons'>ol_delete_forever</i> Konto l\u00f6schen",
msgConfirmAccountDeletion: "Das Backup-Konto kann nach dem L\u00f6schen nicht wiederhergestellt werden, die Statistik auf Ihrem Ger\u00e4t wird dabei nicht gel\u00f6scht.<br /><br />M\u00f6chten Sie Ihr Backup-Konto wirklich dauerhaft l\u00f6schen?<br /><br /><u>Wichtig:</u> Sie k\u00f6nnen nur ein Backup-Konto pro App-Kauf erstellen (siehe Hilfe).",
msgAccountDeletionSuccessful: "Die L\u00f6schung Ihres Backup-Kontos wurde veranlasst und wird innerhalb von 24h durchgef\u00fchrt werden.",
msgAccountDeletionUnsuccessful: "Die L\u00f6schung Ihres Backup-Kontos war leider nicht erfolgreich. Bitte versuchen Sie es sp\u00e4ter noch einmal.",
urlAccountDeletion: "https://t24.theorie24.de/delaccount/delaccdb-2022.php",
appShowQuestionListDebugInfos: !1,
msgSettingsDbValidityDates: "<div style='margin-left:40px;'><small>Fragen g\u00fcltig von %VALIDDATE1% bis %VALIDDATE2%</small></div>",
appMultilingual: !0,
appDisplayHeaderQuestionExplanationButton: !0,
appMessagesFileName: "exam_messages_",
appInAppMessagesFileName: "app_messages_",
userClassSelectedId: 6,
userSetSelectedId: 0,
userUnlockedApp: !1,
userAutoSync: !0,
appClassMofaId: 5,
appMaxMovieViews: 5,
countDemoSetUsageInLockedApp: !0
},
create: function() {
this.inherited(arguments), this.readExternalConfig();
},
readExternalConfig: function() {
try {
var a = getDb1ValidBeforeDate().split("-");
this.db2ValidFromDate = a[2] + "." + a[1] + "." + a[0];
} catch (b) {}
this.msgDb1Selected = this.msgDb1Selected.replace(/%DB2VALIDDATE%/g, this.db2ValidFromDate), inAppPurchaseAlias = this.getExtConfigValue("inAppPurchaseAlias"), inAppPurchaseID = this.getExtConfigValue("inAppPurchaseID"), this.appTitleHtml = this.getExtConfigValue("appTitleHtml"), this.appTitleIcon = this.getExtConfigValue("appTitleIcon"), this.appTitleIconUnlocked = this.getExtConfigValue("appTitleIconUnlocked"), this.appOffersInAppPurchase = this.getExtConfigValue("appOffersInAppPurchase"), this.appDisplayIAPLabels = this.getExtConfigValue("appDisplayIAPLabels"), this.appLimitAvailableClasses = this.getExtConfigValue("appLimitAvailableClasses"), this.appShowExtClassesButton = this.getExtConfigValue("appShowExtClassesButton"), this.userClassSelectedId = this.getExtConfigValue("userClassSelectedId"), this.btnBgColorMainMenu = this.getExtConfigValue("btnBgColorMainMenu"), this.btnBgColor = this.getExtConfigValue("btnBgColor"), this.btnFGColor = this.getExtConfigValue("btnFGColor"), this.msgFineprint = this.getExtConfigValue("msgFineprint"), this.imgMainPageLogo = this.getExtConfigValue("imgMainPageLogo"), this.urlLogoPage = this.getExtConfigValue("urlLogoPage"), this.userAutoSync = this.getExtConfigValue("userAutoSync"), this.appLockable = this.getExtConfigValue("appLockable"), this.appLockMode = this.getExtConfigValue("appLockMode"), this.appShowIntroSlideshow = this.getExtConfigValue("appShowIntroSlideshow"), this.appAdShowAds = this.getExtConfigValue("appAdShowAds"), this.imgMainPageBackground = this.getExtConfigValue("imgMainPageBackground"), this.imgMainPageBackgroundUnlocked = this.getExtConfigValue("imgMainPageBackgroundUnlocked"), this.imgMainPageBackgroundSmall = this.getExtConfigValue("imgMainPageBackgroundSmall"), this.imgMainPageBackgroundUnlockedSmall = this.getExtConfigValue("imgMainPageBackgroundUnlockedSmall"), this.forceEnvironment = this.getExtConfigValue("forceEnvironment"), this.userSaveUserDataUnescaped = this.getExtConfigValue("userSaveUserDataUnescaped"), this.appMultilingual = this.getExtConfigValue("appMultilingual"), this.msgPROVersionButtonLabel = this.getExtConfigValue("msgPROVersionButtonLabel"), this.appDisplayPROVersionButtonInIAPMsgBox = this.getExtConfigValue("appDisplayPROVersionButtonInIAPMsgBox"), this.urlDemoStatisticSync = this.getExtConfigValue("urlDemoStatisticSync"), this.appVariantId = this.getExtConfigValue("appVariantId"), this.appMultilingualLocked = this.getExtConfigValue("appMultilingualLocked"), this.pageSubtitleMain = this.getExtConfigValue("pageSubtitleMain"), this.appTitleLockedSuffix = this.getExtConfigValue("appTitleLockedSuffix"), this.appTitleUnlockedSuffix = this.getExtConfigValue("appTitleUnlockedSuffix"), this.appDisplayHeaderQuestionExplanationButton = this.getExtConfigValue("appDisplayHeaderQuestionExplanationButton"), this.appStoreIdApple = this.getExtConfigValue("appStoreIdApple"), this.appStoreIdGoogle = this.getExtConfigValue("appStoreIdGoogle"), this.appNumberOfIntroSlides = this.getExtConfigValue("appNumberOfIntroSlides"), this.appMaxAvailableSetsForUser = this.getExtConfigValue("appMaxAvailableSetsForUser");
},
getExtConfigValue: function(a) {
try {
return typeof extConfigValue[a] != "undefined" ? extConfigValue[a] : this[a];
} catch (b) {
return this[a];
}
}
});

var appConfig = new appConfiguration;

// Menu_t24.js

var tmpMenu = [ {
product: "t24",
items: [ {
label: "<i class='material-icons md-menu' >ol_book</i> <span><span class='t_de'>Training</span><span class='t_gb'>Training</span></span>",
classes: "toplevelmenuX",
"function": "",
help: "index.html?open=app_training",
subitems: [ {
label: "<i class='material-icons md-menu'>ol_30_fps</i> <span><span class='t_de'>30 Fragen \u00fcben</span><span class='t_gb'>30 new questions</span></span>",
"function": "quickstart",
help: "index.html?open=app_training"
}, {
label: "<i class='material-icons md-menu'>ol_playlist_add_check</i> <span><span class='t_de'>Alle Fragen & Themen</span><span class='t_gb'>All questions</span></span>",
"function": "bychapter",
help: "index.html?open=app_training"
}, {
label: "<i class='material-icons md-menu'>ol_assignment</i> <span><span class='t_de'>Schwerpunkte \u00fcben</span><span class='t_gb'>Special topics</span></span></span>",
"function": "byfocuschapter",
visible: "mark-iap",
help: "index.html?open=app_training"
}, {
label: "<i class='material-icons md-menu'>ol_search</i> <span><span class='t_de'>Fragen suchen</span><span class='t_gb'>Search for questions</span></span>",
"function": "searchquestions",
visible: "mark-iap",
help: "index.html?open=app_training"
}, {
label: "<i class='material-icons md-menu'>ol_warning</i> <span><span class='t_de'>%LASTERRORS% letzte Fehler</span><span class='t_gb'>%LASTERRORS% last mistakes</span></span>",
"function": "lastwronganswers",
visible: "mark-iap",
help: "index.html?open=app_training"
}, {
label: "<i class='material-icons md-menu'>bl_star</i> <span><span class='t_de'>%MARKEDQUESTIONS% markierte Fragen</span><span class='t_gb'>%MARKEDQUESTIONS% marked questions</span></span>",
"function": "markedquestions",
visible: "mark-iap",
help: "index.html?open=app_training"
} ]
}, {
label: "<i class='material-icons md-menu' >ol_school</i> <span><span class='t_de'>Pr\u00fcfung</span><span class='t_gb'>Test</span></span>",
classes: "toplevelmenuX",
"function": "",
help: "index.html?open=app_pruefung",
subitems: [ {
label: "<i class='material-icons md-menu'>ol_list_alt</i> <span><span class='t_de'>Musterb\u00f6gen</span><span class='t_gb'>Questionnaires</span></span>",
"function": "byset",
help: "index.html?open=app_pruefung"
}, {
label: "<i class='material-icons md-menu'>ol_timer</i> <span><span class='t_de'>Pr\u00fcfungssimulation</span><span class='t_gb'>Test simulation</span></span>",
"function": "simulation",
visible: "mark-iap",
help: "index.html?open=app_pruefung"
}, {
label: "<i class='material-icons md-menu'>ol_warning</i> <span><span class='t_de'>%LASTERRORS% letzte Fehler</span><span class='t_gb'>%LASTERRORS% last mistakes</span></span>",
"function": "lastwronganswers",
visible: "mark-iap",
help: "index.html?open=app_training"
}, {
label: "<i class='material-icons md-menu'>bl_star</i> <span><span class='t_de'>%MARKEDQUESTIONS% markierte Fragen</span><span class='t_gb'>%MARKEDQUESTIONS% marked questions</span></span>",
"function": "markedquestions",
visible: "mark-iap",
help: "index.html?open=app_training"
} ]
}, {
label: "<i class='material-icons md-menu' >ol_insert_chart</i> <span><span class='t_de'>Statistik</span><span class='t_gb'>Statistics</span></span>",
"function": "statistics",
help: "index.html?open=app_statistik"
}, {
label: "<i class='material-icons md-menu'>ol_settings</i> <span><span class='t_de'>Einstellungen</span><span class='t_gb'>Settings</span></span>",
"function": "",
help: "index.html?open=einst_start",
subitems: [ {
label: "<i class='material-icons md-menu'>ol_time_to_leave</i> <span><span class='t_de'>Klasse %SELECTEDCLASS%</span><span class='t_gb'>License class %SELECTEDCLASS%</span></span>",
"function": "settings",
parameters: "class",
help: "index.html?open=einst_klasse"
}, {
label: "<i class='material-icons md-menu'>ol_event</i> <span><span class='t_de'>Pr\u00fcfung %EXAMDATE%</span><span class='t_gb'>Test %EXAMDATE%</span></span>",
"function": "settings",
parameters: "date",
help: "index.html?open=einst_termin"
}, {
label: "<i class='material-icons md-menu'>ol_language</i> <span><span class='t_de'>Sprache w\u00e4hlen</span><span class='t_gb'>Select language</span></span>",
"function": "settings",
parameters: "language",
visible: "only-multilingual",
help: "index.html?open=einst_sprache"
}, {
label: "<i class='material-icons md-menu'>ol_play_queue</i> <span><span class='t_de'>Medien herunterladen</span><span class='t_gb'>Download media</span></span>",
"function": "settings",
parameters: "video",
visible: "only-mobile",
help: "index.html?open=einst_medien"
}, {
label: "<i class='material-icons md-menu'>ol_settings_applications</i> <span><span class='t_de'>Allgemeines</span><span class='t_gb'>General Settings</span></span>",
"function": "settings",
parameters: "general",
help: "index.html?open=einst_allgemein"
}, {
label: "<i class='material-icons md-menu'>ol_backup</i> <span><span class='t_de'>Backup einrichten</span><span class='t_gb'>Register for backup</span></span>",
"function": "settings",
parameters: "sync-register",
visible: "only-app-synclocked-mark-iap",
help: "index.html?open=einst_backup"
}, {
label: "<i class='material-icons md-menu'>ol_sync</i> <span><span class='t_de'>Backup / Sync</span><span class='t_gb'>Backup / Sync</span></span>",
"function": "settings",
parameters: "sync",
visible: "only-app-syncunlocked",
help: "index.html?open=einst_backup"
}, {
label: "<i class='material-icons md-menu'>ol_sync</i> <span><span class='t_de'>Backup / Sync</span><span class='t_gb'>Backup / Sync</span></span>",
"function": "settings",
parameters: "sync",
visible: "only-web-syncunlocked",
help: "index.html?open=einst_backup"
}, {
label: "<i class='material-icons md-menu'>ol_exit_to_app</i> <span><span class='t_de'>Abmelden</span><span class='t_gb'>Log out</span></span>",
"function": "logout-synclock",
visible: "only-web-syncunlocked",
help: "index.html?open=einst_backup"
} ]
}, {
label: "<i class='material-icons md-menu'>ol_help_outline</i> <span><span class='t_de'>Hilfe & Kontakt</span><span class='t_gb'>Help & Contact</span></span>",
"function": "",
help: "index.html",
subitems: [ {
label: "<i class='material-icons md-menu'>ol_done_outline</i> <span><span class='t_de'>Lerntipps</span><span class='t_gb'>Learning Tips</span></span>",
"function": "openhelpfile",
parameters: "index.html?open=theorie_lerntipps"
}, {
label: "<i class='material-icons md-menu'>ol_book</i> <span><span class='t_de'>Benutzerhandbuch</span><span class='t_gb'>User Guide</span></span>",
"function": "openhelpfile",
parameters: "index.html?open=startseite"
}, {
label: "<i class='material-icons md-menu'>ol_assignment</i> <span><span class='t_de'>StVO</span><span class='t_gb'>StVO</span></span>",
"function": "openhelpfile",
parameters: "index.html?open=stvo",
visible: "mark-iap",
mlvisible: "false"
}, {
label: "<i class='material-icons md-menu'>ol_question_answer</i> <span><span class='t_de'>FAQs & Support</span><span class='t_gb'>FAQs & Support</span></span>",
"function": "openhelpfile",
parameters: "index.html?open=support_faq"
}, {
label: "<i class='material-icons md-menu'>ol_info</i> <span><span class='t_de'>App Info</span><span class='t_gb'>App Info</span></span>",
"function": "displayappinfo"
} ]
}, {
label: "<i class='material-icons md-menu'>ol_assignment</i> <span><span class='t_de'>Lehrbuch & StVO</span><span class='t_gb'>Textbook & StVO</span></span>",
"function": "openhelpfile",
parameters: "./ebook/theorie_gold.html?nl=1",
visible: "mark-iap",
mlvisibleonly: "true"
}, {
label: "<i class='material-icons md-iaplock' style='opacity:0.1'>ol_help_outline</i><img src='assets/icoIAPLock.png' style='position:absolute;left:8px;top:10px;height:1em;min-height:40px;opacity:1;' class='rotating' /><img src='assets/icoWhiteCheckmark.png' style='height:1em;min-height:40px;padding:0;position:absolute;left:10px;top:10px;opacity:1;z-index:99999' alt='+' /> <span><span class='t_de'>Upgrade kaufen</span><span class='t_gb'>Buy Upgrade</span></span>",
"function": "inapppurchase",
addclass: "iapbutton",
visible: "only-mobile-notpurchased"
}, {
label: "<i class='material-icons md-iaplock'>ol_help_outline</i><img src='assets/icoIAPLock.png' style='position:absolute;left:8px;top:10px;height:1em;min-height:40px;opacity:1;' class='rotating' /><img src='assets/icoWhiteCheckmark.png' style='height:1em;min-height:40px;padding:0;position:absolute;left:10px;top:10px;opacity:1;z-index:99999' alt='+' /> <span><span class='t_de'>Freischalten</span><span class='t_gb'>Unlock</span></span>",
"function": "unlock-webversion",
addclass: "iapbutton",
visible: "only-web-synclocked"
} ]
} ];

appMenu = tmpMenu[0];

var tmpMenuLocked = [ {
product: "t24",
items: []
} ];

appMenuLocked = tmpMenuLocked[0];

// Database.js

function logsql(a) {
sqlitelog += a + "<br />";
}

function writeJsonFile(a, b) {
if (appConfig.appPlatformId == "android") var c = cordova.file.dataDirectory; else var c = cordova.file.dataDirectory;
window.resolveLocalFileSystemURL(c, function(c) {
c.getFile(a, {
create: !0,
exclusive: !1
}, function(a) {
writeFile(a, b);
}, onErrorCreateFile);
}, onErrorLoadFs);
}

function writeFile(a, b) {
a.createWriter(function(a) {
a.onwriteend = function() {}, a.onerror = function(a) {}, a.write(b);
});
}

function readJsonMetadataFileForBackupPreparation(a) {
try {
if (appConfig.appPlatformId == "android") var b = cordova.file.dataDirectory; else var b = cordova.file.dataDirectory;
window.resolveLocalFileSystemURL(b, function(b) {
b.getFile(a, {
create: !0,
exclusive: !1
}, function(a) {
a.file(function(a) {
var b = new FileReader;
b.onloadend = function() {
appDB.writeConditionalLocalStorageToFile2(this.result);
}, b.readAsText(a);
}, onErrorReadFile);
}, onErrorCreateFileMeta);
}, onErrorLoadFs);
} catch (c) {
log("Debug-Meldung: ERROR in database.js: readJsonMetadataFileForBackupPreparation(): " + c.message);
}
}

function readJsonMetadataFile(a) {
if (appConfig.appPlatformId == "web") return;
if (appConfig.appPlatformId == "android") var b = cordova.file.dataDirectory; else var b = cordova.file.dataDirectory;
window.resolveLocalFileSystemURL(b, function(b) {
b.getFile(a, {
create: !0,
exclusive: !1
}, function(a) {
a.file(function(a) {
var b = new FileReader;
b.onloadend = function() {
appDB.parseLocalStorageBackupMetadata(this.result);
}, b.readAsText(a);
}, onErrorReadFile);
}, onErrorCreateFileMeta);
}, onErrorLoadFs);
}

function readJsonBackupFile(a) {
if (appConfig.appPlatformId == "android") var b = cordova.file.dataDirectory; else var b = cordova.file.dataDirectory;
window.resolveLocalFileSystemURL(b, function(b) {
b.getFile(a, {
create: !1,
exclusive: !1
}, function(a) {
a.file(function(a) {
var b = new FileReader;
b.onloadend = function() {
appDB.restoreLocalStorageFromJson(this.result);
}, b.readAsText(a);
}, onErrorReadFile);
}, onErrorCreateFileBackup);
}, onErrorLoadFs);
}

function readFile(a) {
a.file(function(a) {
var b = new FileReader;
b.onloadend = function() {
return log("Successful file read: " + this.result), this.result;
}, b.readAsText(a);
}, onErrorReadFile);
}

function onErrorCreateFileMeta() {
appDB.parseLocalStorageBackupMetadata("");
}

function onErrorCreateFileBackup() {}

function onErrorCreateFile() {
alert("onErrorCreateFile", fsapp);
}

function onErrorLoadFs() {
alert("onErrorLoadFs", fsapp);
}

function onErrorReadFile() {
alert("onErrorReadFile", fsapp);
}

sqlitelog = "", enyo.kind({
name: "appDatabaseEngine",
kind: "Component",
sqliteAvailable: !1,
getAppUnlockUserData: function() {
return this.getItem("user");
},
setAppUnlockUserData: function(a, b, c) {
var d = new Object;
d.name = a.replace(/[^a-zA-Z0-9_ß-üÀ-Ü]/g, ""), d.uid = b.replace(/\W/g, ""), d.school = c.replace(/[^a-zA-Z0-9_ß-üÀ-Ü ]/g, ""), this.setItem("user", d);
},
setUnescapedAppUnlockUserData: function(a, b, c) {
var d = new Object;
d.name = a, d.uid = b, d.school = c, this.setItem("user", d);
},
resetAppUnlockUserData: function() {
this.removeItemById("user"), this.setMarkedQuestionIds("");
for (var a in dbTblQ) this.readQuestionStatistics(a) != null && this.removeItemById("question." + a);
for (var a in dbTableSets) appDB.getSetStatistics(a) != "0,0,nnn" && appDB.removeItemById("set." + a);
},
setInAppPurchaseStatus: function(a) {
var b = new Object;
b.verified = !0, this.setItem("iapstatus", b);
},
getInAppPurchaseStatus: function() {
return this.getItem("iapstatus");
},
readQuestionStatistics: function(a) {
return this.getItem("question." + a);
},
writeQuestionStatistics: function(a, b, c, d, e) {
var f = new Object;
f.answeredTotal = b, f.answeredCorrect = c, f.answeredAll = d, f.answeredLastDate = e, this.setItem("question." + a, f);
},
getMostRecentlyAnsweredQuestionDate: function() {
var a = "";
try {
for (var b in dbTblQ) {
var c = this.readQuestionStatistics(b);
c != null && c.answeredLastDate > a && (a = c.answeredLastDate);
}
} catch (d) {}
return a;
},
getLastStatisticsCacheUpdateDate: function() {
var a = "";
try {
var b = this.getItem("statisticsCache");
b != null ? a = b.lastStatisticCalcDate : a = "";
} catch (c) {}
return a;
},
setStatisticsCache: function(a) {
var b = new Date, c = new Object;
c.lastStatisticCalcDate = b.toISOString(), c.statisticData = a, this.setItem("statisticsCache", c);
},
getStatisticsCache: function() {
return this.getItem("statisticsCache");
},
writeQuestionStatisticsForSync: function(a, b, c) {
try {
var d = this.getItem("sync.question." + a), e = d.syncQTS.toString(), f = e.split(","), g = d.syncQCorrect.toString(), h = g.split(",");
if (f.length > 2) {
e = "", g = "";
for (var i = f.length - 2; i < f.length; i++) i > f.length - 2 && (e += ",", g += ","), e += f[i], g += h[i];
}
e = e + "," + b, g = g + "," + c;
} catch (j) {
e = b, g = c;
}
var d = new Object;
d.syncQTS = e, d.syncQCorrect = g, this.setItem("sync.question." + a, d);
},
readQuestionStatisticsForSync: function(a) {
return this.getItem("sync.question." + a);
},
resetQuestionStatisticsForSync: function() {
for (var a in dbTblQ) this.readQuestionStatisticsForSync(a) != null && this.removeItemById("sync.question." + a);
},
getNumberOfQuestionsForSync: function() {
var a = 0;
for (var b = 0; b < window.localStorage.length; b++) window.localStorage.key(b).indexOf("sync.question.") > -1 && a++;
return a;
},
writeSimulationStatisticsForSync: function(a, b, c, d, e, f) {
try {
var g = this.getItem("sync.simulation");
if (g == null || g == undefined) var g = [];
} catch (h) {
var g = [];
}
objSimTest = new Object, objSimTest.classId = a, objSimTest.className = b, objSimTest.errorPoints = c, objSimTest.testPassed = d, objSimTest.failed2x5p = e, objSimTest.testTS = f, g.push(objSimTest), this.setItem("sync.simulation", g);
},
writeSetStatisticsForSync: function(a, b, c) {
try {
var d = this.getItem("sync.set." + a), e = d.syncSTS.toString(), f = e.split(","), g = d.syncSCorrect.toString(), h = g.split(",");
if (f.length > 2) {
e = "", g = "";
for (var i = f.length - 2; i < f.length; i++) i > f.length - 2 && (e += ",", g += ","), e += f[i], g += h[i];
}
e = e + "," + b, g = g + "," + c;
} catch (j) {
e = b, g = c;
}
var d = new Object;
d.syncSTS = e, d.syncSCorrect = g, this.setItem("sync.set." + a, d);
},
readSetStatisticsForSync: function(a) {
return this.getItem("sync.set." + a);
},
resetSetStatisticsForSync: function() {
for (var a in dbTableSets) this.readSetStatisticsForSync(a) != null && this.removeItemById("sync.set." + a);
},
incDemoSetCounter: function() {
var a = new Object;
a.Counter = parseInt(this.readDemoSetCounter(), 10) + 1, this.setItem("device.demosets", a);
},
readDemoSetCounter: function() {
try {
var a = this.getItem("device.demosets");
a = a.Counter;
} catch (b) {
var a = 0;
}
return a;
},
resetDemoSetCount: function() {
var a = new Object;
a.Counter = 0, this.setItem("device.demosets", a);
},
incMasterQuestionCounter: function() {
if (fsapp.currentPageId == 6) {
var a = new Object;
a.Counter = parseInt(this.readMasterQuestionCounter(), 10) + 1, this.setItem("device.masterquestions", a);
}
},
readMasterQuestionCounter: function() {
try {
var a = this.getItem("device.masterquestions"), b = a.Counter;
} catch (c) {
var b = 0;
}
return b;
},
incDemoQuestionCounter: function() {
var a = new Object;
a.Counter = parseInt(this.readDemoQuestionCounter(), 10) + 1, this.setItem("device.demoquestions", a);
},
readDemoQuestionCounter: function() {
try {
var a = this.getItem("device.demoquestions"), b = a.Counter;
} catch (c) {
var b = 0;
}
return b;
},
resetDemoQuestionCount: function() {
var a = new Object;
a.Counter = 0, this.setItem("device.demoquestions", a);
},
writeLastViewedTopicAndQuestion: function(a, b, c) {
if (c == 0) {
var d = new Date;
c = d.getTime();
}
var e = new Object;
e.topicId = a, e.questionId = b, e.timestamp = c, this.setItem("device.lastViewedTopicAndQuestion", e);
},
readLastViewedTopicAndQuestion: function() {
try {
var a = this.getItem("device.lastViewedTopicAndQuestion");
return typeof a != "undefined" && a != null ? a : (log("leer: objValues"), a = new Object, a.topicId = 0, a.questionId = 0, a.timestamp = 0, a);
} catch (b) {}
},
readDeviceGUID: function() {
try {
var a = this.getItem("device.guid");
a = a.GUID;
} catch (b) {
var a = "";
}
return a;
},
createDeviceGUID: function() {
var a = new Object;
a.GUID = this.generateGUID(), this.setItem("device.guid", a);
},
generateGUID: function() {
var a = (new Date).getTime(), b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
var c = (a + Math.random() * 16) % 16 | 0;
return a = Math.floor(a / 16), (b == "x" ? c : c & 3 | 8).toString(16);
});
return b;
},
writeQuestionMarkedStatusForSync: function(a, b, c) {
var d = new Object;
d.status = b, d.timestamp = c, this.setItem("sync.markedquestion." + a, d);
},
readQuestionMarkedStatusForSync: function(a) {
return this.getItem("sync.markedquestion." + a);
},
resetQuestionMarkedForSync: function() {
for (var a in dbTblQ) this.readQuestionMarkedStatusForSync(a) != null && this.removeItemById("sync.markedquestion." + a);
},
addMarkedQuestion: function(a) {
var b = new Object, c = "";
this.getItem("markedquestions") != null && (b = this.getItem("markedquestions"), c = b.markedQuestionIds, c = c.replace("," + a + ",", "")), c = c + "," + a + ",", c = c.replace(",,", ","), b.markedQuestionIds = c, this.setItem("markedquestions", b), this.writeQuestionMarkedStatusForSync(a, 1, Math.round((new Date).getTime() / 1e3)), fsapp.displayAd(appConfig.appAdTriggerMarkedQuestion, c);
},
delMarkedQuestion: function(a) {
var b = new Object, c = "";
if (this.getItem("markedquestions") != null) {
b = this.getItem("markedquestions");
var c = b.markedQuestionIds;
c = c.replace("," + a + ",", ",");
}
c = c.replace(",,", ","), b.markedQuestionIds = c, this.setItem("markedquestions", b), this.writeQuestionMarkedStatusForSync(a, 0, Math.round((new Date).getTime() / 1e3));
},
setMarkedQuestionIds: function(a) {
var b = new Object;
b.markedQuestionIds = a, this.setItem("markedquestions", b);
},
initSQLite: function() {
appDB.sqliteAvailable = !1;
},
setItem: function(a, b) {
if (!appDB.sqliteAvailable) typeof a == "string" && (typeof b == "object" ? window.localStorage.setItem(a, JSON.stringify(b)) : typeof b == "string" && window.localStorage.setItem(a, b)); else {
var c;
typeof b == "object" ? c = JSON.stringify(b) : typeof b == "string" && (c = b), this.itemExistsInDB(a) ? appDB.sqliteDB.transaction(function(b) {
b.executeSql("UPDATE items SET itemvalue = ?1 WHERE itemkey = ?2", [ c, a ], function(a, b) {
logsql("SUCCESS UPDATE: rowsAffected: " + b.rowsAffected);
}, function(a, b) {
logsql("UPDATE error: " + b.message);
});
}, function(a) {
logsql("SQLite write error: " + a.message);
}, function() {
logsql("SQLite write successful.");
}) : appDB.sqliteDB.transaction(function(b) {
b.executeSql("INSERT INTO items VALUES (?1, ?2)", [ a, c ], function(a, b) {
logsql("SUCCESS INSERT: rowsAffected: " + b.rowsAffected);
}, function(a, b) {
logsql("INSERT error: " + b.message);
});
}, function(a) {
logsql("SQLite write error: " + a.message);
}, function() {
logsql("SQLite write successful.");
});
}
},
itemExistsInDB: function(a) {
if (!appDB.sqliteAvailable) return !1;
appDB.sqliteDB.transaction(function(b) {
b.executeSql("SELECT count(*) AS mycount FROM items WHERE itemkey = ?", [ a ], function(a, b) {
return b.rows.item(0).mycount > 0;
}, function(a, b) {
return logsql("SELECT count error: " + b.message), !1;
});
});
},
getItem: function(a) {
if (!appDB.sqliteAvailable) {
var b;
return typeof a == "string" && (b = window.localStorage.getItem(a)), typeof b == "string" ? JSON.parse(b) : ((typeof b != "object" || b === null) && typeof b != "undefined" && b !== null, null);
}
typeof a == "string" && appDB.sqliteDB.transaction(function(b) {
b.executeSql("SELECT itemvalue FROM items WHERE itemkey = ?", [ a ], function(b, c) {
var d;
return c.rows.length != 1 ? (c.rows.length != 0 && (d = c.rows.item(0).itemvalue, logsql("SELECT error: more than 1 item for: " + a + "(" + c.rows.length + ")")), null) : (d = c.rows.item(0).itemvalue, typeof d == "string" ? (a == "markedquestions" && logsql("resultValue is string: " + d), JSON.parse(d)) : (logsql("ERROR: resultValue is not String! type: " + d), d));
}, function(a, b) {
return logsql("SELECT error: " + b.message), null;
});
}, function() {}, function(a) {
return logsql("SELECT SQL statement ERROR: " + a.message), null;
});
},
generateTestProgressStatistics: function(a, b) {
var c = new Array;
b--;
for (var d = 0; d < b + 1; d++) if (Math.random() > .3) {
var e = new Array, f = parseInt(Date.now(), 10) - (b - d) * 24 * 60 * 60 * 1e3, g = new Date(f);
e[0] = g.getDate() + "." + (1 + g.getMonth()) + "." + g.getFullYear(), e[1] = d * (100 / b), e[2] = d * (50 / b), e[3] = Math.random() * 100, c[c.length] = e;
}
var c = new Array, h = new Object;
h.data = c, this.setItem("progress", h);
},
setProgressStatistics: function(a, b, c) {
result = this.getItem("progress");
if (typeof result != "undefined" && result != null) var d = result.data; else var d = new Array;
var e = parseInt(Date.now(), 10), f = new Date(e), g = f.getDate() + "." + (1 + f.getMonth()) + "." + f.getFullYear(), h = !1, i = new Array;
i[0] = g, i[1] = a, i[2] = b, i[3] = c;
for (var j = 0; j < d.length; j++) if (d[j][0] == g) {
d[j] = i, h = !0;
break;
}
h || (d[d.length] = i);
var k = new Object;
k.data = d, this.setItem("progress", k);
},
getProgressStatistics: function() {
return result = this.getItem("progress"), typeof result != "undefined" && result != null ? result.data : new Array;
},
removeItemById: function(a) {
if (!appDB.sqliteAvailable) {
if (typeof a != "string") throw "ERROR [Storage.remove]: 'name' was not a String.";
window.localStorage.removeItem(a);
} else {
if (typeof a != "string") throw "ERROR [SQLite remove]: 'name' was not a String.";
appDB.sqliteDB.transaction(function(b) {
b.executeSql("DELETE FROM items WHERE itemkey = ?", [ a ]);
}, function(a) {
logsql("SQLite remove error: " + a.message);
}, function() {
logsql("SQLite remove successful.");
});
}
},
getSetStatistics: function(a) {
var b;
b = this.getItem("set." + a);
if (typeof b != "undefined" && b != null) {
var c = parseInt(b.answeredTotal, 10), d = parseInt(b.answeredCorrect, 10), e = "nnn", f = e.substring(b.answeredLast3.length) + b.answeredLast3;
return c + "," + d + "," + f;
}
return "0,0,nnn";
},
setSetStatistics: function(a, b, c, d) {
var e = new Object;
e.answeredTotal = b, e.answeredCorrect = c;
var f = "nnn" + d.replace(/^\s+|\s+$/g, "");
f = f.substr(f.length - 3), e.answeredLast3 = f, this.setItem("set." + a, e);
},
deleteQuestionStatistics: function() {
var a = "";
if (!this.sqliteAvailable) for (var b = 0; b < window.localStorage.length; b++) window.localStorage.key(b).substring(0, 9) == "question." && (a = window.localStorage.key(b), this.removeItemById(a)); else appDB.sqliteDB.transaction(function(a) {
a.executeSql('DELETE FROM items WHERE itemkey LIKE "question.%"');
}, function(a) {
logsql("SQLite remove error: " + a.message);
}, function() {
logsql("SQLite remove successful.");
});
},
getAnsweredQuestionsAmount: function() {
var a = 0, b = 0, c = 0, d = 0, e = new Object, f = "", g;
if (!this.sqliteAvailable) {
for (var h = 0; h < window.localStorage.length; h++) if (window.localStorage.key(h).substring(0, 9) == "question.") {
a++, e = this.getItem(window.localStorage.key(h));
var i = e.answeredAll;
typeof i != "undefined" && (f = i.substring(0, 3), g = f.split("1").length - 1, g == 3 && d++, g == 2 && c++, g == 1 && b++);
}
return a + "," + d + "," + c + "," + b;
}
appDB.sqliteDB.transaction(function(h) {
var i = 'SELECT * FROM items WHERE itemkey LIKE "question.%"';
h.executeSql(i, [], function(h, i) {
for (var j = 0; j < i.rows.length; j++) {
a++, e = JSON.parse(i.rows.item(j).itemvalue);
var k = e.answeredAll;
try {
typeof k != "undefined" && (f = k.substring(0, 3), g = f.split("1").length - 1, g == 3 && d++, g == 2 && c++, g == 1 && b++);
} catch (l) {}
}
return a + "," + d + "," + c + "," + b;
}, function(a, b) {
logsql("SELECT error: " + b.message);
});
}, function(a) {
logsql("transaction error: " + a.message);
}, function() {
logsql("transaction ok");
});
},
clearLocalStorage: function() {
window.localStorage.clear();
},
writeConditionalLocalStorageToFile: function() {
readJsonMetadataFileForBackupPreparation("fsbackup-meta.json");
},
writeConditionalLocalStorageToFile2: function(a) {
if (a != "") {
try {
var b = JSON.parse(a), c = b.progress;
} catch (d) {
var c = 0;
this.createDeviceGUID();
}
var e = this.readMasterQuestionCounter();
c < e && appDB.writeLocalStorageToFile();
} else appDB.writeLocalStorageToFile();
},
writeLocalStorageToFile: function() {
var a = this.readMasterQuestionCounter(), b = {
guid: this.readDeviceGUID(),
created: Date.now(),
progress: a
}, c = JSON.stringify(b), d = JSON.stringify(window.localStorage);
log("Metadata Local Storage: "), log(c), log("Local Storage: "), log(d), writeJsonFile("fsbackup-meta.json", c), writeJsonFile("fsbackup-data.json", d);
},
readLocalStorageBackupMetadata: function(a) {
typeof a == "undefined" ? this.lbuShowMessageIfNoRestore = !1 : this.lbuShowMessageIfNoRestore = a, readJsonMetadataFile("fsbackup-meta.json");
},
parseLocalStorageBackupMetadata: function(a) {
if (a != "") {
try {
var b = JSON.parse(a);
} catch (c) {}
var d = this.readMasterQuestionCounter(), e = new Date(b.created), f = twoDigitNumber(e.getDate()) + "." + twoDigitNumber(e.getMonth() + 1) + "." + e.getFullYear() + " " + twoDigitNumber(e.getHours()) + ":" + twoDigitNumber(e.getMinutes()) + ":" + twoDigitNumber(e.getSeconds());
if (b.progress > d && d > 50) var g = appConfig.msgRestoreFromLocalBackup.replace("%QUESTIONS1%", b.progress).replace("%QUESTIONS2%", d).replace("%CREATIONDATE%", f), h = alert(g, fsapp, {
cancelText: appConfig.msgAppNo,
confirmText: appConfig.msgAppYes,
onConfirm: function(a) {
this.hide(), appDB.restoreLocalStorageFromFile(), this.destroy();
}
}); else if (this.lbuShowMessageIfNoRestore) {
var i = appConfig.msgBackupAndStorageInSyncWithDate.replace("%QUESTIONS1%", b.progress).replace("%QUESTIONS2%", d).replace("%CREATIONDATE%", f);
alert(i, fsapp);
}
} else this.lbuShowMessageIfNoRestore && alert(appConfig.msgBackupAndStorageInSync, fsapp);
},
restoreLocalStorageFromFile: function() {
readJsonBackupFile("fsbackup-data.json");
},
restoreLocalStorageFromJson: function(a) {
var b = JSON.parse(a);
for (var c in b) this.setItem(c, b[c]);
alert(appConfig.msgRestoreBackupComplete, fsapp), enyo.job("resetApp" + Math.random(), enyo.bind(appDB, "reloadAppAfterRestore"), 5e3);
},
reloadAppAfterRestore: function() {
window.location.reload();
},
__getSize: function() {
var a, b = 0;
for (a = 0; a < window.localStorage.length; a++) b += window.localStorage.getItem(window.localStorage.key(a)).length;
return b;
},
hasNetworkConnection: function() {
if (!appConfig.appOnMobileDevice) return navigator.onLine;
try {
if (appConfig.appDevelopmentMode) return !0;
try {
var a = navigator.connection.type;
} catch (b) {
var a = Connection.UNKNOWN;
}
var c = {};
return c[Connection.UNKNOWN] = "Unknown connection", c[Connection.ETHERNET] = "Ethernet connection", c[Connection.WIFI] = "WiFi connection", c[Connection.CELL_2G] = "Cell 2G connection", c[Connection.CELL_3G] = "Cell 3G connection", c[Connection.CELL_4G] = "Cell 4G connection", c[Connection.NONE] = "No network connection", a != Connection.NONE && a != Connection.UNKNOWN;
} catch (b) {
return !1;
}
},
hasFastNetworkConnection: function() {
if (!appConfig.appOnMobileDevice) return navigator.onLine;
try {
if (appConfig.appDevelopmentMode) return !1;
try {
var a = navigator.connection.type;
} catch (b) {
var a = Connection.UNKNOWN;
}
var c = {};
return c[Connection.UNKNOWN] = "Unknown connection", c[Connection.ETHERNET] = "Ethernet connection", c[Connection.WIFI] = "WiFi connection", c[Connection.CELL_2G] = "Cell 2G connection", c[Connection.CELL_3G] = "Cell 3G connection", c[Connection.CELL_4G] = "Cell 4G connection", c[Connection.NONE] = "No network connection", a == Connection.CELL_3G || a == Connection.CELL_4G || a == Connection.WIFI || a == Connection.ETHERNET;
} catch (b) {
return !1;
}
}
});

// Testing.js

enyo.kind({
name: "t24Answer",
kind: "Control",
published: {
answertext: "",
checkmarkValue: 0,
locked: 0,
correctCheckmarkValue: 0,
timeOfQuestionDisplay: 0
},
events: {
onTextTap: "",
onSpeakerSymbolTap: ""
},
components: [ {
tag: "table",
name: "answercontainer",
components: [ {
tag: "tr",
components: [ {
tag: "td",
name: "answertextRtLContainer",
classes: "t24qatxt",
style: "vertical-align:top;text-align:right",
ontap: "toggleCheckmarkByTextTap",
components: [ {
tag: "span",
name: "answertextRtL",
content: "Antwort",
style: "padding-left:15px;display:inline;text-align:right",
allowHtml: !0
} ]
}, {
tag: "td",
name: "t24checkboxes",
classes: "t24qacheckbox",
style: "height:98px;width:60px;vertical-align:top;",
components: [ {
tag: "div",
name: "t24qachk",
style: "display:block;padding-left:2px;height:48px;width:60px;position:relative;",
classes: "t24qachk",
ontap: "toggleCheckmark"
}, {
tag: "div",
name: "t24qachkCorrect",
style: "padding-left:2px;height:48px;width:60px;position:relative;",
classes: "t24qachk",
ontap: "toggleCheckmark"
} ]
}, {
tag: "td",
name: "answertextContainer",
classes: "t24qatxt",
style: "vertical-align:top;",
ontap: "toggleCheckmarkByTextTap",
components: [ {
tag: "span",
name: "answertext",
content: "Antwort",
style: "padding-right:15px;display:inline;",
allowHtml: !0
}, {
tag: "span",
name: "icoSpeaker",
content: '<i style="font-size:inherit;" class="material-icons speaker-icon">ol_speaker</i>',
style: "padding-right:30px; padding-bottom:30px;",
ontap: "doSpeakerSymbolTap",
allowHtml: !0
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.answertextChanged(), this.$.t24qachk.applyStyle("background", "url(./assets/btn_optquestion_1.gif) 3px 0 no-repeat"), this.$.t24qachk.applyStyle("border-left", "4px solid transparent"), this.$.t24qachkCorrect.applyStyle("border-left", "4px solid transparent"), this.$.answertextRtLContainer.applyStyle("display", "none");
},
answertextChanged: function() {
this.$.answertext.setContent(this.answertext), this.$.answertextRtL.setContent(this.answertext);
},
show: function() {
this.$.answercontainer.applyStyle("display", "block");
},
hide: function() {
this.$.answercontainer.applyStyle("display", "none");
},
showCorrectCheckmark: function() {
try {
parseInt(this.checkmarkValue, 10) == parseInt(this.correctCheckmarkValue, 10) ? (this.$.t24qachkCorrect.applyStyle("background", "url(./assets/corr_optquestion_" + (parseInt(this.correctCheckmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat"), this.$.t24qachk.applyStyle("border-left", "4px solid transparent")) : (this.$.t24qachkCorrect.applyStyle("background", "url(./assets/corr_optquestion_" + (parseInt(this.correctCheckmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat"), this.$.t24qachk.applyStyle("border-left", "4px solid #f00")), this.$.t24qachk.render(), this.$.t24qachkCorrect.render(), this.$.t24qachkCorrect.applyStyle("display", "block");
} catch (a) {}
},
hideCorrectCheckmark: function() {
this.$.t24qachkCorrect.applyStyle("display", "none"), this.$.t24qachk.applyStyle("border-left", "4px solid transparent"), this.$.t24qachk.applyStyle("display", "block");
},
toggleCheckmarkByTextTap: function() {
appConfig.appEnableQuestionVoiceOver || this.toggleCheckmark();
},
toggleCheckmark: function() {
appCE.displayMode == appConfig.appTestingModeReading ? alert(appConfig.msgReadModeHint, this) : this.locked != 1 && (this.checkmarkValue = 1 - parseInt(this.checkmarkValue, 10), this.$.t24qachk.applyStyle("background", "url(./assets/btn_optquestion_" + (parseInt(this.checkmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat"), this.$.t24qachk.render());
},
checkmarkValueChanged: function() {
try {
this.$.t24qachk.applyStyle("background", "url(./assets/btn_optquestion_" + (parseInt(this.checkmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat"), parseInt(this.checkmarkValue, 10) == parseInt(this.correctCheckmarkValue, 10) ? this.$.t24qachkCorrect.applyStyle("background", "url(./assets/corr_optquestion_" + (parseInt(this.correctCheckmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat") : this.$.t24qachkCorrect.applyStyle("background", "url(./assets/corr_optquestion_" + (parseInt(this.correctCheckmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat");
} catch (a) {}
this.$.t24qachkCorrect.render();
},
correctCheckmarkValueChanged: function() {
try {
parseInt(this.checkmarkValue, 10) == parseInt(this.correctCheckmarkValue, 10) ? (this.$.t24qachkCorrect.applyStyle("background", "url(./assets/corr_optquestion_" + (parseInt(this.correctCheckmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat"), this.$.t24qachk.applyStyle("border-left", "4px solid transparent")) : (this.$.t24qachkCorrect.applyStyle("background", "url(./assets/corr_optquestion_" + (parseInt(this.correctCheckmarkValue, 10) + 1) + ".gif) 3px 0 no-repeat"), this.$.t24qachk.applyStyle("border-left", "4px solid #f00"));
} catch (a) {}
this.$.t24qachk.render();
}
}), enyo.kind({
name: "t24positionDisplay",
kind: "Control",
published: {
showbasic: !0,
firstQuestionIndex: 0
},
events: {
onPosTap: "",
onControlTap: ""
},
components: [],
displayPositionButtons: function() {
var a = 1;
this.destroyComponents();
if (appCE.getQuestionOrigin() == 0) {
if (appCE.displayMode == appConfig.appTestingModeHandsOn) var b = "float:right;border-color:" + appConfig.appT24DarkBackgroundColor; else var b = "float:right;";
this.createComponent({
tag: "div",
name: "btnLeftContainer",
style: "z-index:999999",
classes: "t24qposbtncontleft"
}), this.$.btnLeftContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
name: "btnGotoPrev",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: parseInt(appCE.currentQuestionIndex, 10) - 1
},
components: [ {
tag: "img",
src: "assets/btnposprevious.png",
alt: "<",
classes: "t24qposcmdbutton"
} ]
}, {
owner: this
}), this.$.btnLeftContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
name: "btnGotoPrev10",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: parseInt(appCE.currentQuestionIndex, 10) - 10
},
components: [ {
tag: "img",
src: "assets/btnposbackward.png",
alt: "<<",
classes: "t24qposcmdbutton"
} ]
}, {
owner: this
}), this.$.btnLeftContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
name: "btnGotoFirst",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: 0
},
components: [ {
tag: "img",
src: "assets/btnposfirst.png",
alt: "|<",
classes: "t24qposcmdbutton"
} ]
}, {
owner: this
}), this.createComponent({
tag: "div",
name: "btnCenterContainer",
classes: "t24qposbtncontcenter",
style: ""
});
var c = appCE.currentQuestionIndex - 4;
c > parseInt(appCE.arrQuestionIds.length, 10) - 10 && (c = parseInt(appCE.arrQuestionIds.length, 10) - 10), c < 0 && (c = 0);
for (var d = c; d < c + 10; d++) {
if (!(d < parseInt(appCE.arrQuestionIds.length, 10))) break;
var e = "", f = "none", g = "none";
appCE.arrUserAnswers[d][5] != 0 ? appCE.arrUserAnswers[d][5] == 1 ? e += " btnposincorrect" : e += " btnposcorrect" : appCE.isQuestionAnswered(d) && (e += " btnposset"), appCE.hasQuestionVideo(d) && (g = "block"), appCE.isQuestionMarked(d) && (f = "block");
if (appCE.displayMode == appConfig.appTestingModeHandsOn) var b = "border-color:" + appConfig.appT24DarkBackgroundColor; else var b = "";
appCE.currentQuestionIndex == d ? this.$.btnCenterContainer.createComponent({
tag: "div",
classes: "t24qcurrposbutton",
ontap: "doPosTap",
style: "",
attributes: {
questionPos: d
},
components: [ {
tag: "img",
name: "t24qmarkedimg" + d,
classes: "t24markedicon",
src: "assets/btn_pos_marked.gif",
style: "position:absolute;z-index:32000;display:" + f
}, {
tag: "img",
name: "t24qvideoimg" + d,
classes: "t24videoicon",
src: "assets/ico_video.png",
style: "position:absolute;z-index:32000;display:" + g
}, {
tag: "div",
classes: "t24qposbutton" + e,
content: d + 1
} ]
}, {
owner: this
}) : this.$.btnCenterContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: d
},
components: [ {
tag: "img",
name: "t24qmarkedimg" + d,
classes: "t24markedicon",
src: "assets/btn_pos_marked.gif",
style: "position:absolute;z-index:32000;display:" + f
}, {
tag: "img",
name: "t24qvideoimg" + d,
classes: "t24videoicon",
src: "assets/ico_video.png",
style: "position:absolute;z-index:32000;display:" + g
}, {
tag: "div",
classes: "t24qposbutton" + e,
content: d + 1
} ]
}, {
owner: this
});
}
if (appCE.displayMode == appConfig.appTestingModeHandsOn) var b = "border-color:" + appConfig.appT24DarkBackgroundColor; else var b = "";
this.createComponent({
tag: "div",
name: "btnRightContainer",
classes: "t24qposbtncontright"
}), this.$.btnRightContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
name: "btnGotoNext",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: parseInt(appCE.currentQuestionIndex, 10) + 1
},
components: [ {
tag: "img",
src: "assets/btnposnext.png",
alt: ">",
classes: "t24qposcmdbutton"
} ]
}, {
owner: this
}), this.$.btnRightContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
name: "btnGotoNext10",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: parseInt(appCE.currentQuestionIndex, 10) + 10
},
components: [ {
tag: "img",
src: "assets/btnposforward.png",
alt: ">>",
classes: "t24qposcmdbutton"
} ]
}, {
owner: this
}), this.$.btnRightContainer.createComponent({
tag: "div",
classes: "t24qnormposbutton",
style: "margin-right:0;",
name: "btnGotoLast",
ontap: "doPosTap",
style: b,
attributes: {
questionPos: parseInt(appCE.arrQuestionIds.length, 10) - 1
},
components: [ {
tag: "img",
src: "assets/btnposlast.png",
alt: ">|",
classes: "t24qposcmdbutton"
} ]
}, {
owner: this
});
}
if (appCE.getQuestionOrigin() == 1) {
if (this.showbasic) var h = "1"; else var h = "0";
var i = appConfig.userClassSelectedId == appConfig.appClassMofaId;
for (var d = 0; d < appCE.arrQuestionIds.length; d++) if (!i && dataTableQuestions[appCE.arrQuestionIds[d]].basic == h || i && dataTableQuestions[appCE.arrQuestionIds[d]].basic_mofa == h) {
var e = "", f = "none", g = "none";
a == 1 && (this.firstQuestionIndex = d), appCE.arrUserAnswers[d][5] != 0 ? appCE.arrUserAnswers[d][5] == 1 ? e += " btnposincorrect" : e += " btnposcorrect" : appCE.isQuestionAnswered(d) && (e += " btnposset"), appCE.hasQuestionVideo(d) && (g = "block"), appCE.isQuestionMarked(d) && (f = "block");
if (appCE.currentQuestionIndex == d) this.createComponent({
tag: "div",
classes: "t24qcurrposbutton",
style: "height:32px;",
ontap: "doPosTap",
attributes: {
questionPos: d
},
components: [ {
tag: "img",
name: "t24qmarkedimg" + d,
classes: "t24markedicon",
src: "assets/btn_pos_marked.gif",
style: "position:absolute;z-index:32000;display:" + f
}, {
tag: "img",
name: "t24qvideoimg" + d,
classes: "t24videoicon",
src: "assets/ico_video.png",
style: "position:absolute;z-index:32000;display:" + g
}, {
tag: "div",
classes: "t24qposbutton" + e,
content: a,
style: "line-height:30px;height:30px;"
} ]
}); else {
if (appCE.displayMode == appConfig.appTestingModeHandsOn) var b = "height:32px;border-color:" + appConfig.appT24DarkBackgroundColor; else var b = "height:32px;";
this.createComponent({
tag: "div",
classes: "t24qnormposbutton",
style: b,
ontap: "doPosTap",
attributes: {
questionPos: d
},
components: [ {
tag: "img",
name: "t24qmarkedimg" + d,
classes: "t24markedicon",
src: "assets/btn_pos_marked.gif",
style: "position:absolute;z-index:32000;display:" + f
}, {
tag: "img",
name: "t24qvideoimg" + d,
classes: "t24videoicon",
src: "assets/ico_video.png",
style: "position:absolute;z-index:32000;display:" + g
}, {
tag: "div",
classes: "t24qposbutton" + e,
content: a,
style: "line-height:30px;height:30px;"
} ]
});
}
a++;
}
}
this.render();
},
showbasicChanged: function() {
this.displayPositionButtons();
}
}), enyo.kind({
name: "appCoreImageDisplay",
kind: "Control",
events: {
onBackButtonTap: ""
},
components: [ {
tag: "div",
name: "t24qbodyimgcontainer",
classes: "t24ImageZoomContainer",
style: "position:absolute;top:0;bottom:35px;left:0;right:0;",
allowHtml: !0,
content: "<img src='' alt='' class='t24qpicimg' />"
}, {
tag: "div",
name: "t24qzoominfo",
classes: "t24qheader",
style: "position:absolute;bottom:0;left:0;right:0;",
components: [ {
tag: "span",
name: "btnClose",
style: "position:absolute;right:8px;color:#fff !important;background-color:transparent !important;width:auto !important",
content: appConfig.msgBtnImageZoomClose,
ontap: "doBackButtonTap"
}, {
tag: "span",
style: "width:38px;position:absolute;left:0;",
content: "+",
ontap: "zoomIn"
}, {
tag: "span",
style: "width:38px;position:absolute;left:40px;",
content: "-",
ontap: "zoomOut"
} ]
} ],
zoomIn: function() {
$(".t24qpicimg").smartZoom("zoom", .8);
},
zoomOut: function() {
$(".t24qpicimg").smartZoom("zoom", -0.8);
},
displayCurrentQuestionImage: function() {
this.$.btnClose.setContent(appConfig.msgBtnImageZoomClose);
var a = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10);
if (dataTableQuestions[a]["picture"] != "") {
if (appConfig.appOnMobileDevice) {
var b = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture, c = b.substring(b.length - 4, b.length) == appConfig.extVideoTriggerExtension;
if (c) var d = "<img src='" + (appConfig.pathImgMedium + b.substring(0, b.length - 4) + "_ende.jpg" + appConfig.extImgZoom) + "' alt='' class='t24qpicimg' />"; else var d = "<img src='" + (appConfig.pathImgMedium + dataTableQuestions[a].picture + appConfig.extImgZoom) + "' alt='' class='t24qpicimg' />";
} else {
var b = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture, c = b.substring(b.length - 4, b.length) == appConfig.extVideoTriggerExtension;
if (c) var d = "<img src='" + (appConfig.pathImgZoom + b.substring(0, b.length - 4) + "_ende.jpg" + appConfig.extImgZoom) + "' alt='' class='t24qpicimg' />"; else var d = "<img src='" + (appConfig.pathImgZoom + dataTableQuestions[a].picture + appConfig.extImgZoom) + "' alt='' class='t24qpicimg' />";
}
this.$.t24qbodyimgcontainer.setContent(d), this.$.t24qbodyimgcontainer.render();
try {
jQuery(".t24qpicimg").smartZoom({
containerClass: "t24zoomableContainer"
});
} catch (e) {
alert("error init zoom", this);
}
}
},
resizeHandler: function() {
appCE.displayMode == appConfig.appTestingModeHandsOn ? (this.$.t24qbodyimgcontainer.applyStyle("background-color", appConfig.appT24LightBackgroundColor), this.$.t24qzoominfo.applyStyle("background-color", appConfig.appT24DarkBackgroundColor)) : (this.$.t24qbodyimgcontainer.applyStyle("background-color", appConfig.appOfficialLightBackgroundGreen), this.$.t24qzoominfo.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen)), this.inherited(arguments), this.displayCurrentQuestionImage();
}
}), enyo.kind({
name: "appCoreAudio",
kind: "Control",
events: {
onAudioEnded: ""
},
components: [],
currentlyPlaying: !1,
initialized: !1,
audioTag: "",
currFilename: "",
play: function(a) {
this.currFilename = a, appConfig.appOnMobileDevice ? appConfig.appPlatformId == "android" ? window.resolveLocalFileSystemURL(cordova.file.dataDirectory + a, function() {
fsapp.$.coreAudio.playStreaming(cordova.file.dataDirectory + fsapp.$.coreAudio.currFilename);
}, function() {
appDB.hasNetworkConnection() ? fsapp.$.coreAudio.playStreaming(appConfig.urlAudioStreaming + fsapp.$.coreAudio.currFilename) : alert(appConfig.msgErrorNoOnlineConnection, fsapp);
}) : window.resolveLocalFileSystemURL(cordova.file.dataDirectory + a, function(a) {
corePluginAudioPlayer = new Media(a.toInternalURL(), function() {
corePluginAudioPlayer.release(), fsapp.$.coreAudio.triggerAudioEnded();
}, function() {
log("error trying to play media through cordova audio plugin");
}), corePluginAudioPlayer.play();
}, function() {
appDB.hasNetworkConnection() ? fsapp.$.coreAudio.playStreaming(appConfig.urlAudioStreaming + fsapp.$.coreAudio.currFilename) : alert(appConfig.msgErrorNoOnlineConnection, fsapp);
}) : fsapp.$.coreAudio.playStreaming(appConfig.urlAudioStreaming + this.currFilename);
},
stop: function() {
this.blockTriggerAudioEnded = !0, this.currentlyPlaying = !1;
try {
corePluginAudioPlayer.stop();
} catch (a) {}
try {
this.audioTag.stop();
} catch (a) {}
this.blockTriggerAudioEnded = !1;
},
playStreaming: function(a) {
if (!this.currentlyPlaying) {
this.currentlyPlaying = !0, this.initialized || (this.audioTag = document.createElement("audio"), this.audioTag.addEventListener("ended", function() {
fsapp.$.coreAudio.triggerAudioEnded(), fsapp.$.coreAudio.currentlyPlaying = !1;
}, !1), this.initialized = !0);
try {
this.audioTag.setAttribute("src", a), this.audioTag.play();
} catch (b) {
this.currentlyPlaying = !1, this.triggerAudioEnded();
}
}
},
reset: function() {
try {
this.currentlyPlaying = !1, this.triggerAudioEnded(), this.audioTag.pause();
} catch (a) {}
},
triggerAudioEnded: function() {
this.blockTriggerAudioEnded || this.doAudioEnded();
}
}), enyo.kind({
name: "appCoreVideoDisplay",
kind: "Control",
events: {
onBackButtonTap: ""
},
components: [ {
tag: "div",
name: "t24qbody",
classes: "t24qbody0",
style: "position:absolute;top:0;bottom:35px;left:0;right:0;text-align:center",
components: [ {
kind: "jPlayerVideo",
name: "t24qvideo",
showControls: !1,
autoplay: !0,
style: "max-width:100%;max-height:100%;",
src: ""
} ]
}, {
tag: "div",
name: "t24qzoominfo",
classes: "t24qheader",
style: "position:absolute;bottom:0;left:0;right:0;",
components: [ {
tag: "span",
name: "btnClose",
style: "position:absolute;right:8px;color:#fff !important;background-color:transparent !important;width:auto !important",
content: appConfig.msgBtnImageZoomClose,
ontap: "doBackButtonTap"
} ]
} ],
displayCurrentQuestionVideo: function() {
this.$.btnClose.setContent(appConfig.msgBtnImageZoomClose), this.$.t24qvideo.render(), this.$.t24qvideo.resizePlayer();
},
resizeHandler: function() {
appCE.displayMode == appConfig.appTestingModeHandsOn ? (this.$.t24qbody.applyStyle("background-color", appConfig.appT24LightBackgroundColor), this.$.t24qzoominfo.applyStyle("background-color", appConfig.appT24DarkBackgroundColor)) : (this.$.t24qbody.applyStyle("background-color", appConfig.appOfficialLightBackgroundGreen), this.$.t24qzoominfo.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen)), this.inherited(arguments), this.$.t24qvideo.resizePlayer();
}
}), enyo.kind({
name: "appCoreDisplay",
kind: "Control",
events: {
onBackButtonTap: "",
onFullscreenImageTap: "",
onFullscreenVideoTap: ""
},
published: {
comingBackFromVideoPlayer: !1
},
prevPreparedFilename: "",
timerTargetTime: 0,
adQuestionCounter: 0,
questionSolvedOnDisplay: !1,
voiceOverIndex: 0,
components: [ {
tag: "div",
name: "t24clientarea",
classes: "t24clientarea",
style: "width:100%; height:100%; background-color:#000; ",
components: [ {
tag: "div",
style: "width:100%; max-width:1024px; margin:auto; position:relative; height:100%;",
components: [ {
tag: "div",
name: "t24qbody",
classes: "t24qbody",
components: [ {
tag: "div",
name: "t24qheader",
classes: "t24qheader",
components: [ {
tag: "span",
name: "t24qinfolabel1",
style: "left:0;color:#333;width:35px;",
content: "<i class='material-icons' style='color:#666;line-height:35px;width:35px;'>ol_info</i>",
allowHtml: !0,
ontap: "displayQuestionDetailInfo"
}, {
tag: "div",
name: "t24qtimerlabel",
classes: "t24timerdisplay",
style: "left:50%;top:0;margin-left:-40px;width:auto !important;font-size:25px !important;",
allowHtml: !0,
content: ""
}, {
tag: "div",
name: "t24qbasiclabel",
style: "text-align:left",
allowHtml: !0,
content: appConfig.msgTestingWordBasic
}, {
tag: "div",
name: "t24qextraslabel",
classes: "t24qextraslabel",
style: "text-align:center;position:relative;",
components: [ {
tag: "div",
style: "margin:0 auto;padding:0;float:none;position:relative;",
components: [ {
tag: "div",
name: "t24xlabel1x",
style: "margin:0 2px 0 2px;padding:0;border-color:#fff;cursor:pointer;width:20px;height:20px;line-height:20px;text-align:center;border-radius:2px;background-color:#fff;background-image:none;color:#ff0000",
content: "M",
ontap: "showHintM"
}, {
tag: "div",
name: "t24xlabel2x",
style: "display:none;margin:0 2px 0 2px;padding:0;border-color:#fff;cursor:pointer;width:20px;height:20px;line-height:20px;text-align:center;border-radius:2px;background-color:#fff;background-image:none;color:#ff0000",
content: "i",
ontap: "showHintI"
}, {
tag: "div",
name: "t24xlabel3x",
style: "display:none;margin:0 2px 0 2px;padding:0;border-color:#fff;cursor:pointer;width:20px;height:20px;line-height:20px;text-align:center;border-radius:2px;background-color:#fff;background-image:none;color:#ff0000",
content: "D",
ontap: "showHintD"
}, {
tag: "div",
name: "t24xlabel4x",
style: "margin:0 2px 0 2px;background-color:#fff;",
allowHtml: !0,
content: "<img src='assets/icoIdea.png' style='height:1.5em;margin-top:0.25em;' alt='?' />",
ontap: "showQuestionExplanation"
}, {
tag: "div",
name: "t24xlabel5x",
style: "margin:0 2px 0 2px;background-color:#fff;color:#f00;text-transform:uppercase",
allowHtml: !0,
content: "DE",
ontap: "toggleQuestionLanguage"
}, {
tag: "div",
content: " "
} ]
} ]
}, {
tag: "div",
name: "t24qpointslabel",
style: "text-align:right;float:right;",
content: "Punkte: -",
allowHtml: !0,
ontap: "exitCoreDisplay"
}, {
tag: "span",
name: "t24qpointslabel2",
style: "color:#333;width:35px;",
content: '<i class="material-icons" style="color:#666;line-height:35px;width:35px;">ol_close</i>',
allowHtml: !0,
ontap: "exitCoreDisplay"
} ]
}, {
tag: "div",
name: "t24qabody",
classes: "t24qabody",
components: [ {
tag: "div",
name: "t24qscrollcontainer",
classes: "t24qscrollcontainer",
style: "width:100%;max-height:596px;top:34px;bottom:0;position:absolute;padding-bottom:130px;",
components: [ {
kind: "enyo.Scroller",
fit: !0,
name: "t24qscroller",
classes: "t24outermain",
style: "width:100%; height:100%; overflow-y:auto;",
components: [ {
tag: "div",
name: "t24qtext",
classes: "t24qtext",
allowHtml: !0,
content: "Fragentext?",
ontap: "playVoiceOverForWholeText"
}, {
tag: "div",
classes: "t24qmaindiv",
components: [ {
tag: "div",
name: "t24qpic",
classes: "t24qpic",
style: "height:390px;",
ontap: "fullscreenQuestionImage",
components: [ {
tag: "img",
name: "t24qpicimg",
src: "",
style: "cursor:url(./assets/cur_magnify.gif), url(./assets/cur_magnify.cur), pointer;"
}, {
tag: "div",
style: "text-align:center;margin-top:2px;",
components: [ {
tag: "span",
name: "t24btnReplayVideo",
style: "background-color:#0000aa;color:#fff;padding:4px 16px;font-size:80%;",
ontap: "tapVideoPlayButton",
content: appConfig.msgPlayVideoAgain
} ]
} ]
}, {
tag: "div",
name: "t24qvideoinfo",
classes: "t24qanswers t24videoqanswers",
style: "padding-top:16px;padding-bottom:50px;",
components: [ {
kind: "onyx.Button",
name: "t24videoplay",
allowHtml: !0,
content: appConfig.msgStartVideo,
classes: "onyx-blue t24btnvideo",
style: "width:100% !important;float:none !important;margin-bottom:25px;background-color:#0000aa;",
ontap: "fullscreenQuestionImage"
}, {
kind: "onyx.Button",
name: "t24videoskip",
allowHtml: !0,
content: appConfig.msgShowQuestionText,
classes: "onyx-blue t24btnvideo",
style: "width:100% !important;float:none !important;margin-bottom:50px;background-color:#0000aa;",
ontap: "discardRemainingVideoViews"
}, {
tag: "div",
name: "t24qhint0",
classes: "t24qhint",
style: "text-align:center;margin-top:32px;",
allowHtml: !0
} ]
}, {
tag: "div",
name: "t24qanswers",
classes: "t24qanswers",
components: [ {
tag: "div",
name: "t24qhint1",
classes: "t24qhint",
allowHtml: !0
}, {
kind: "t24Answer",
name: "t24answer1",
classes: "t24atext",
style: "clear:both;",
ontap: "tapButtonChkboxAnswer",
attributes: {
btnval: "1"
},
onSpeakerSymbolTap: "playVoiceOver"
}, {
kind: "t24Answer",
name: "t24answer2",
classes: "t24atext",
style: "clear:both;",
ontap: "tapButtonChkboxAnswer",
attributes: {
btnval: "2"
},
onSpeakerSymbolTap: "playVoiceOver"
}, {
kind: "t24Answer",
name: "t24answer3",
classes: "t24atext",
style: "clear:both;",
ontap: "tapButtonChkboxAnswer",
attributes: {
btnval: "3"
},
onSpeakerSymbolTap: "playVoiceOver"
} ]
}, {
tag: "div",
name: "t24qnumberanswer",
classes: "t24qanswers",
style: "",
components: [ {
tag: "div",
name: "t24qhint2",
classes: "t24qhint",
allowHtml: !0
}, {
tag: "div",
style: "float:left;height:50px;margin-right:16px;",
components: [ {
tag: "div",
name: "t24qtxtanswer",
content: "",
style: "height:16px;line-height:16px;vertical-align:middle;overflow:hidden;text-align:right;border:1px solid #000;font-weight:bold;padding:3px;width:100px;background-color:#fff;",
allowHtml: !0
} ]
}, {
tag: "div",
name: "answerhint",
classes: "t24numbersanswerhint",
content: "",
allowHtml: !0,
style: "padding-left:16px;"
}, {
tag: "div",
style: "clear:both"
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "0",
attributes: {
btnval: "0"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "1",
attributes: {
btnval: "1"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "2",
attributes: {
btnval: "2"
}
}, {
tag: "div",
style: "clear:both"
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "3",
attributes: {
btnval: "3"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "4",
attributes: {
btnval: "4"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "5",
attributes: {
btnval: "5"
}
}, {
tag: "div",
style: "clear:both"
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "6",
attributes: {
btnval: "6"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "7",
attributes: {
btnval: "7"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "8",
attributes: {
btnval: "8"
}
}, {
tag: "div",
style: "clear:both"
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "9",
attributes: {
btnval: "9"
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: ",",
attributes: {
btnval: ","
}
}, {
tag: "a",
classes: "t24qtxtansbtn",
ontap: "tapButtonIntxtAnswer",
content: "C",
attributes: {
btnval: "C"
}
}, {
tag: "div",
style: "clear:both"
}, {
tag: "a",
name: "t24qtxtansbtnDel",
classes: "t24qtxtansbtnwide",
ontap: "tapButtonIntxtAnswer",
content: appConfig.msgClear,
attributes: {
btnval: "DEL"
}
} ]
} ]
} ]
}, {
tag: "div",
name: "t24xcontrols",
classes: "t24xcontrols",
style: "position:absolute;right:8px;top:48px;",
components: [ {
kind: "onyx.TooltipDecorator",
components: [ {
tag: "div",
name: "t24xlabel1",
style: "display:none;padding:0;border-color:#fff;cursor:pointer;position:absolute;right:0;top:0;width:20px;height:20px;line-height:20px;text-align:center;border-radius:2px;background-color:#fff;background-image:none;color:#ff0000",
content: "M",
ontap: "showHintM"
}, {
kind: "onyx.Tooltip",
name: "t24xlabel1tt",
style: "position:absolute;left:4px;top:20px;",
content: "Mutterfrage",
allowHtml: !0
} ]
}, {
kind: "onyx.TooltipDecorator",
components: [ {
tag: "div",
name: "t24xlabel2",
style: "display:none;padding:0;border-color:#fff;cursor:pointer;position:absolute;right:0;top:26px;width:20px;height:20px;line-height:20px;text-align:center;border-radius:2px;background-color:#fff;background-image:none;color:#ff0000",
content: "i",
ontap: "showHintI"
}, {
kind: "onyx.Tooltip",
name: "t24xlabel2tt",
style: "position:absolute;left:4px;top:46px;",
content: "Infos zur Frage"
} ]
}, {
kind: "onyx.TooltipDecorator",
components: [ {
tag: "div",
name: "t24xlabel3",
style: "display:none;padding:0;border-color:#fff;cursor:pointer;position:absolute;right:0;top:52px;width:20px;height:20px;line-height:20px;text-align:center;border-radius:2px;background-color:#fff;background-image:none;color:#ff0000",
content: "D",
ontap: "showHintD"
}, {
kind: "onyx.Tooltip",
name: "t24xlabel3tt",
style: "position:absolute;left:4px;top:72px;",
content: "G\u00fcltigkeitsdauer der Frage"
} ]
} ]
}, {
tag: "div",
name: "t24bottomcontrols",
classes: "t24bottomcontrols",
components: [ {
tag: "div",
name: "t24qcontrols",
classes: "t24qcontrols",
components: [ {
tag: "div",
name: "",
style: "position:absolute;left:0;top:48px;border-top:1px solid #BEC0C2;width:90%;"
}, {
tag: "div",
name: "t24qcontroldiv1",
style: "float:left;height:48px;width:auto;border-top:1px solid #D3F5DA;",
classes: "t24qcontroldiv",
components: [ {
tag: "div",
name: "t24qbtnbasic",
classes: "t24qbtnbasicact",
style: "z-index:100",
content: appConfig.msgTestingWordBasic,
allowHtml: !0,
ontap: "switchToBasic"
}, {
tag: "div",
name: "t24qbtnclass",
classes: "t24qbtnclassinact",
style: "z-index:100",
content: "X",
allowHtml: !0,
ontap: "switchToAdvanced"
} ]
}, {
tag: "div",
name: "t24qcontroldiv3",
style: "float:right;height:48px;border-bottom:1px solid #BEC0C2;width:40%;",
classes: "t24qcontroldiv",
components: [ {
kind: "onyx.Button",
name: "t24btnnext",
allowHtml: !0,
content: appConfig.msgTestingBtnContinue,
classes: "onyx-blue t24qcbtngreen",
style: "background-color:#009e53;",
ontap: "displayNextQuestion"
}, {
kind: "onyx.Button",
name: "t24btnmark",
allowHtml: !0,
content: "Markieren",
classes: "onyx-blue t24qcbtnyellow",
style: "background-color:#f3be00;color:#333;",
ontap: "toggleQuestionMarked"
}, {
kind: "onyx.Button",
name: "t24btneval",
allowHtml: !0,
content: "Abgabe",
classes: "onyx-blue t24qcbtnred",
style: "background-color:#f70000;",
ontap: "evaluateTest"
} ]
}, {
tag: "div",
name: "t24qcontroldiv2",
style: "float:right;height:48px;border-bottom:1px solid #BEC0C2;width:36%;",
classes: "t24qcontroldiv t24qcontroldiv2",
components: [ {
tag: "div",
name: "t24qunansweredlbl",
style: "font-size:16px;position:absolute;bottom:16px;font-weight:bold;background:url(./assets/img_attention.gif) left 2px no-repeat;padding-left:26px",
classes: "t24qunansweredlbl",
content: "noch n Aufgaben"
}, {
tag: "div",
name: "t24qansweredfeedback",
style: "display:none;",
content: "Diese Frage wurde richtig / falsch beantwortet!",
allowHtml: !0
} ]
} ]
}, {
tag: "div",
name: "t24qposcontainer",
classes: "t24qposcontainer",
style: "width:100%;position:absolute;bottom:0;height:81px;overflow-x:hidden;overflow-y:auto;",
components: [ {
kind: "t24positionDisplay",
name: "t24posDisplay",
style: "width:100%;",
classes: "t24qpos",
onPosTap: "changeCurrentQuestionIndex"
} ]
} ]
} ]
} ]
} ]
} ]
} ]
} ],
displayGermanVersion: !0,
previousQuestionId: -1,
showQuestionExplanation: function() {
var a = "";
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].info != "") {
a += '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgQuestionExplanationHeadline + '</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>';
if (appConfig.appLockMode == 2 && !appConfig.userUnlockedApp) {
a += '<div style="-webkit-hyphens:auto; -ms-hyphens:auto; hyphens:auto;">' + dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].info.rot13().substr(0, 64) + "</div>", a += appConfig.msgCompleteExplanationInPaidVersion;
var b = alert(a, this, {
cancelText: "Upgrade",
confirmText: "OK",
onConfirm: function(a) {
this.hide(), this.destroy();
},
onCancel: function(a) {
this.hide(), fsapp.makeInAppPurchaseIOS(), this.destroy();
}
});
} else a += '<div style="-webkit-hyphens:auto; -ms-hyphens:auto; hyphens:auto;">' + dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].info.rot13() + "</div>", dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].stvo != "" && (a += "<div style='height:1px;border-bottom:1px solid #999;margin:6px 0;'/></div>StVO: \u00a7\u00a7 " + dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].stvo), alert(a, this);
}
},
showHintM: function() {
alert(strip_tags(this.$.t24xlabel1tt.getContent()), this);
},
showHintI: function() {
alert(this.$.t24xlabel2tt.getContent(), this);
},
showHintD: function() {
alert(this.$.t24xlabel3tt.getContent(), this);
},
toggleQuestionLanguage: function() {
this.displayGermanVersion = !this.displayGermanVersion;
try {
if (this.displayGermanVersion) {
this.$.t24xlabel5x.setContent(appConfig.appSelectedAltLanguageISO2);
if (!appConfig.userDb2selected) var a = "data/1/ext/DE/tblQuestions.js"; else var a = "data/2/ext/DE/tblQuestions.js";
} else {
this.$.t24xlabel5x.setContent("DE");
if (!appConfig.userDb2selected) var a = "data/1/ext/" + appConfig.appSelectedAltLanguageISO2 + "/tblQuestions.js"; else var a = "data/2/ext/" + appConfig.appSelectedAltLanguageISO2 + "/tblQuestions.js";
}
jQuery(".langQuestions").remove(), addScriptTag(a, "langQuestions"), this.activateQuestionInfo(appConfig.appSelectedAppLanguageISO2.toLowerCase());
} catch (b) {}
},
activateQuestionInfo: function(a) {
try {
appConfig.userDb2selected ? initQuestionInfoDb2(a) : initQuestionInfoDb1(a);
} catch (b) {
log("ERROR: Testing.js: activateQuestionInfo(): " + b.message);
}
},
resizeHandler: function() {
this.inherited(arguments);
var a = this.$.t24qtext.getBounds();
parseInt(a.height, 10) != 0 && this.$.t24qpic.applyStyle("top", a.height + "px !important;");
var a = this.$.t24qanswers.getBounds();
parseInt(a.height, 10) != 0 && this.$.t24qpic.applyStyle("bottom", a.height + "px !important;");
},
playVoiceOver: function(a, b) {
var c = "";
this.voiceOverIndex = 0;
var d = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10);
if (!appConfig.appEnableQuestionVoiceOver || !this.displayGermanVersion || appConfig.appMultilingual && appConfig.appAvailableLanguages["DE"].lockedQuestionText == dataTableQuestions[d]["text"].rot13()) return;
if (appConfig.appEnableQuestionVoiceOver) if (appConfig.appLockMode == 2 && !appConfig.userUnlockedApp) alert(appConfig.msgVoiceOverOnlyInPROVersion, this); else {
switch (a.name) {
case "t24qtext":
c = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_q.mp3", this.$.t24qtext.applyStyle("color", appConfig.appVoiceOverHighlightColor), this.$.t24qhint1.applyStyle("color", appConfig.appVoiceOverHighlightColor);
break;
case "t24answer1":
c = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_a" + this.getAnswerUnshuffledIndex(1) + ".mp3", this.$.t24answer1.applyStyle("color", appConfig.appVoiceOverHighlightColor);
break;
case "t24answer2":
c = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_a" + this.getAnswerUnshuffledIndex(2) + ".mp3", this.$.t24answer2.applyStyle("color", appConfig.appVoiceOverHighlightColor);
break;
case "t24answer3":
c = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_a" + this.getAnswerUnshuffledIndex(3) + ".mp3", this.$.t24answer3.applyStyle("color", appConfig.appVoiceOverHighlightColor);
}
c != "" && fsapp.$.coreAudio.play(c);
}
},
playVoiceOverForWholeText: function() {
this.voiceOverIndex = 0, fsapp.$.coreAudio.reset(), this.playVoiceOverForWholeTextLoop();
},
playVoiceOverForWholeTextLoop: function() {
if (fsapp.currentPageId != 6) return;
var a = "", b = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10);
if (!appConfig.appEnableQuestionVoiceOver || !this.displayGermanVersion || appConfig.appMultilingual && appConfig.appAvailableLanguages["DE"].lockedQuestionText == dataTableQuestions[b]["text"].rot13()) return;
if (appConfig.appLockMode == 2 && !appConfig.userUnlockedApp) alert(appConfig.msgVoiceOverOnlyInPROVersion, this); else {
switch (this.voiceOverIndex) {
case 0:
a = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_q.mp3", this.$.t24qtext.applyStyle("color", appConfig.appVoiceOverHighlightColor), this.$.t24qhint1.applyStyle("color", appConfig.appVoiceOverHighlightColor);
break;
case 1:
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 != "2" || appCE.displayMode == appConfig.appTestingModeReading) a = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_a" + this.getAnswerUnshuffledIndex(1) + ".mp3", this.$.t24answer1.applyStyle("color", appConfig.appVoiceOverHighlightColor);
break;
case 2:
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 != "2") try {
typeof dataTableQuestions[b].asw_2 != "undefined" && (a = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_a" + this.getAnswerUnshuffledIndex(2) + ".mp3", this.$.t24answer2.applyStyle("color", appConfig.appVoiceOverHighlightColor));
} catch (c) {}
break;
case 3:
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 != "2") try {
typeof dataTableQuestions[b].asw_3 != "undefined" && (a = appCE.arrQuestionIds[appCE.currentQuestionIndex] + "_a" + this.getAnswerUnshuffledIndex(3) + ".mp3", this.$.t24answer3.applyStyle("color", appConfig.appVoiceOverHighlightColor));
} catch (c) {}
break;
default:
this.voiceOverIndex = -1;
}
this.voiceOverIndex++, a != "" && fsapp.$.coreAudio.play(a);
}
},
unhighlightCurrentQuestion: function() {
this.$.t24qtext.applyStyle("color", "#0B333C"), this.$.t24qhint1.applyStyle("color", "#0B333C"), this.$.t24answer1.applyStyle("color", "#0B333C"), this.$.t24answer2.applyStyle("color", "#0B333C"), this.$.t24answer3.applyStyle("color", "#0B333C");
if (this.voiceOverIndex > 0) {
var a = (new Date).getTime();
enyo.job("nextVoiceOver" + a, enyo.bind(this, "playVoiceOverForWholeTextLoop"), 200);
}
},
getAnswerUnshuffledIndex: function(a) {
return dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]]["asw_index_" + a];
},
displayQuestionDetailInfo: function() {
var a = "";
if (appCE.displayMode == appConfig.appTestingModeHandsOn) {
a += '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgTestingInfoDetailsSituationHeadline + '</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>';
var b = new Object;
b = appDB.readQuestionStatistics(appCE.arrQuestionIds[appCE.currentQuestionIndex]);
if (b != null) {
var c = b.answeredLastDate.split("T"), d = c[0], e = d.split("-");
a += "Frage zuletzt ge\u00fcbt am " + e[2] + "." + e[1] + "." + e[0] + "<br />";
var f = 0, g = 0;
for (n = 0; n < b.answeredAll.length; n++) n == 0 && b["answeredAll"].substring(0, 1) == "0" && (a += "Situation zuletzt falsch beantwortet!<br />"), b["answeredAll"].substring(n, n + 1) == "0" ? g++ : f++;
a += '<span style="color:#fa3b2a;font-weight:bold;">' + g + '</span> mal falsch, <span style="color:#83bc41;font-weight:bold;">' + f + "</span> mal richtig beantwortet<br />";
} else a += "Situation bisher noch nicht ge\u00fcbt.";
alert(a, this);
} else {
a += appConfig.msgHeadlineQuestionDetails;
try {
appConfig.msgQuestionApplicableVehicleType != "" && (a += '<div class="msgBoxQuestionCategory">', a += appConfig.msgQuestionApplicableVehicleType, a += "</div>", a += '<div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>');
} catch (h) {}
a += '<div class="msgBoxQuestionCategory">', a += appConfig.msgQuestionOfficialNumber + ": " + dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].number + "<br />";
if (fsapp.$.ChapterPage.isOfficialCatTree()) {
var i = appConfig.userClassSelectedId == appConfig.appClassMofaId;
if (!i && dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].basic == "1" || i && dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].basic_mofa == "1") {
var j = fsapp.$.ChapterPage.createTitles(fsapp.$.ChapterPage.$.catTree.getCategoryData(0));
a += appConfig.msgQuestionOfficialCategory + ": " + j;
} else {
var k = fsapp.$.ChapterPage.createTitles(fsapp.$.ChapterPage.$.catTree.getCategoryData(1));
a += appConfig.msgQuestionOfficialCategory + ": " + k;
}
var l = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].category_id.split(",");
a += "&nbsp;&gt; " + fsapp.$.ChapterPage.$.catTree.getMainCategoryNameByCategoryId(l[1]), a += "&nbsp;&gt; " + fsapp.$.ChapterPage.$.catTree.getCategoryNameByCategoryId(l[1]) + "<br />";
}
a += "</div>", a += '<div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>', dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].mq_flag == "1" && (a += appConfig.msgQuestionMotherflag, a += '<div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>');
var b = new Object;
b = appDB.readQuestionStatistics(appCE.arrQuestionIds[appCE.currentQuestionIndex]);
if (b != null) {
var c = b.answeredLastDate.split("T"), d = c[0], e = d.split("-");
a += appConfig.msgQuestionLastAnsweredMsgBox + " " + e[2] + "." + e[1] + "." + e[0] + "<br />";
var f = 0, g = 0;
for (n = 0; n < b.answeredAll.length; n++) n == 0 && b["answeredAll"].substring(0, 1) == "0" && (a += appConfig.msgQuestionLastAnsweredWrong + "<br />"), b["answeredAll"].substring(n, n + 1) == "0" ? g++ : f++;
a += '<span style="color:#fa3b2a;font-weight:bold;">' + g + "</span> " + appConfig.msgQuestionTimesWrong + ', <span style="color:#83bc41;font-weight:bold;">' + f + "</span> " + appConfig.msgQuestionTimesRight + " " + appConfig.msgQuestionWordAnsweredMsgBox + "<br />";
} else a += appConfig.msgQuestionNotYetAnswered;
if (appConfig.appOnMobileDevice && appConfig.appDisplayShareQuestionMsg) {
a += '<div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>', a += appConfig.msgQuestionDetailShareLabel;
var m = alert(a, this, {
confirmText: appConfig.msgButtonShare,
cancelText: "OK",
onCancel: function(a) {
this.hide(), this.destroy();
},
onConfirm: function(a) {
this.hide(), fsapp.shareQuestion(), this.destroy();
}
});
} else alert(a, this);
}
},
exitCoreDisplay: function() {
if (appCE.displayMode != appConfig.appTestingModeTesting) this.disableTimer(), this.doBackButtonTap(); else var a = alert(appConfig.msgConfirmTestCancel, this, {
cancelText: appConfig.msgWordNo,
confirmText: appConfig.msgWordYes,
onConfirm: function(a) {
this.hide(), fsapp.$.TestingPage.$.CoreTestingDisplay.exitCoreDisplay2(), this.destroy();
}
});
},
exitCoreDisplay2: function() {
this.disableTimer(), this.doBackButtonTap();
},
tapButtonIntxtAnswer: function(a, b) {
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 != "2" || appCE.displayMode == appConfig.appTestingModeReading) return;
var c = b.originator.getAttributes(), d = c.btnval, e = this.$.t24qtxtanswer.getContent();
if (d == "DEL") var f = ""; else if (d == "C") if (e.length > 1) var f = e.substr(0, e.length - 1); else var f = ""; else {
var f = e;
if (d == ",") e.indexOf(",") == -1 && e.length > 0 && (f += d); else if (parseFloat(e) == 0 && e.length > 0) {
if (d != "0" || e.indexOf(",") != -1) f += d;
} else f += d;
f.length > 1 && f.substr(0, 1) == "0" && f.substr(1, 1) != "," && (f = f.substr(1));
}
this.$.t24qtxtanswer.setContent(f), f == "" ? this.saveUserAnswer(appCE.currentQuestionIndex, appCE.arrQuestionIds[appCE.currentQuestionIndex], 0, 0, 0) : this.saveUserAnswer(appCE.currentQuestionIndex, appCE.arrQuestionIds[appCE.currentQuestionIndex], f, 0, 0);
if (d == ",") {
var g = e.split(",");
if (g.length > 1) return;
}
},
tapButtonChkboxAnswer: function(a, b) {
this.saveUserAnswer(appCE.currentQuestionIndex, appCE.arrQuestionIds[appCE.currentQuestionIndex], this.$.t24answer1.checkmarkValue, this.$.t24answer2.checkmarkValue, this.$.t24answer3.checkmarkValue);
},
saveUserAnswer: function(a, b, c, d, e) {
appCE.setUserAnswer(a, b, c, d, e), this.$.t24posDisplay.displayPositionButtons(), this.displayUnansweredQuestionNumber();
},
tapVideoPlayButton: function() {
appCE.writeVideoQuestionStatus(appCE.currentQuestionIndex, appConfig.appMaxMovieViews - 1), fsapp.openFullscreenVideoPage();
},
toggleQuestionMarked: function() {
appCE.toggleQuestionMarked(appCE.currentQuestionIndex), appCE.isQuestionMarked(appCE.currentQuestionIndex) ? this.$.t24btnmark.setContent(appConfig.msgDemark) : this.$.t24btnmark.setContent(appConfig.msgMark), this.$.t24posDisplay.displayPositionButtons();
},
fullscreenQuestionImage: function() {
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture != "") {
var a = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture, b = a.substring(a.length - 4, a.length) == appConfig.extVideoTriggerExtension, c = parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) < appConfig.appMaxMovieViews;
appCE.displayMode != appConfig.appTestingModeReading && appCE.displayMode != appConfig.appTestingModeExercising && appCE.displayMode != appConfig.appTestingModeTesting && (c = !0);
if (b && c) {
if (appConfig.appPlatformId == "android") {
var d = (new Date).getTime();
if (d - this.timeOfQuestionDisplay < 500) {
alert(appConfig.msgErrorPlsWaitForVideo, this);
return;
}
}
var e = parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) + 1;
appCE.writeVideoQuestionStatus(appCE.currentQuestionIndex, e), this.doFullscreenVideoTap();
} else this.doFullscreenImageTap();
}
},
discardRemainingVideoViews: function() {
this.discardRemainingVideoViews2();
},
discardRemainingVideoViews2: function() {
appCE.writeVideoQuestionStatus(appCE.currentQuestionIndex, appConfig.appMaxMovieViews + 1), this.displayCurrentQuestion();
},
evaluateTest: function() {
if (appCE.displayMode == appConfig.appTestingModeReading || appCE.displayMode == appConfig.appTestingModeExercising || this.$.t24btneval.getContent() == appConfig.msgMainMenu) {
this.doBackButtonTap();
return;
}
if (appCE.displayMode == appConfig.appTestingModeTesting && this.$.t24btneval.getContent() != appConfig.msgMainMenu) if (this.$.t24btneval.getContent() != appConfig.msgCancel) if (appCE.getNumberOfUnansweredQuestions() == 0) {
this.disableTimer();
var a = appCE.evaluateAllUserAnswers(), b = appCE.evaluateAllUserAnswersBasicAdditive();
this.$.t24posDisplay.displayPositionButtons(), this.$.t24btneval.setContent(appConfig.msgCancel), this.$.t24answer1.locked = 1, this.$.t24answer2.locked = 1, this.$.t24answer3.locked = 1, this.$.t24qansweredfeedback.applyStyle("display", "none"), this.$.t24btneval.setContent(appConfig.msgMainMenu);
var c = appDB.getSetStatistics(appConfig.userSetSelectedId).split(",");
if (a > dbTableClasses[appConfig.userClassSelectedId].maxallowedpoints || a == -1) {
var d = b.basic + b.additive;
if (a > dbTableClasses[appConfig.userClassSelectedId].maxallowedpoints) var e = '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgWordEvaluation + "</h2>" + appConfig.msgTestFail.replace("%ERRORPOINTS%", a).replace("%ERRORPOINTSBASIC%", b.basic).replace("%ERRORPOINTSADDITIVE%", b.additive); else var e = '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgWordEvaluation + "</h2>" + appConfig.msgTestFail5P.replace("%ERRORPOINTS%", d).replace("%ERRORPOINTSBASIC%", b.basic).replace("%ERRORPOINTSADDITIVE%", b.additive);
alert(e, this), appCE.skipSetStatisticsEntry || appDB.setSetStatistics(appConfig.userSetSelectedId, parseInt(c[0], 10) + 1, parseInt(c[1], 10), c[2] + "f");
var f = Math.round((new Date).getTime() / 1e3);
appDB.writeSetStatisticsForSync(appConfig.userSetSelectedId, f, 0), appConfig.appRatingTriggerCounter = 0, fsapp.displayAd(appConfig.appAdTriggerSetFailed), appCE.testSimulationMode && (a == -1 ? appDB.writeSimulationStatisticsForSync(appConfig.userClassSelectedId, dbTableClasses[appConfig.userClassSelectedId].name, d, 0, 1, f) : appDB.writeSimulationStatisticsForSync(appConfig.userClassSelectedId, dbTableClasses[appConfig.userClassSelectedId].name, d, 0, 0, f));
} else {
if (a == 0) {
var e = '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgWordEvaluation + "</h2>" + appConfig.msgTestSuccessNoError.replace("%ERRORPOINTS%", a).replace("%ERRORPOINTSBASIC%", b.basic).replace("%ERRORPOINTSADDITIVE%", b.additive);
alert(e, this);
} else {
var e = '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgWordEvaluation + "</h2>" + appConfig.msgTestSuccess.replace("%ERRORPOINTS%", a).replace("%ERRORPOINTSBASIC%", b.basic).replace("%ERRORPOINTSADDITIVE%", b.additive);
alert(e, this);
}
appCE.skipSetStatisticsEntry || appDB.setSetStatistics(appConfig.userSetSelectedId, parseInt(c[0], 10) + 1, parseInt(c[1], 10) + 1, c[2] + "s");
var f = Math.round((new Date).getTime() / 1e3);
appDB.writeSetStatisticsForSync(appConfig.userSetSelectedId, f, 1), appConfig.appRatingTriggerCounter++, appConfig.appRatingTriggerCounter == appConfig.appRatingTriggerValue && (appConfig.appRatingTriggerCounter = 0, fsapp.requestAppRatingFromUser()), fsapp.displayAd(appConfig.appAdTriggerSetSuccessful), appCE.testSimulationMode && appConfig.appSaveTestSimulationResults && appDB.writeSimulationStatisticsForSync(appConfig.userClassSelectedId, dbTableClasses[appConfig.userClassSelectedId].name, a, 1, 0, f);
}
appCE.setSkipSetStatisticsEntry(!1), appCE.setTestSimulationMode(!1);
for (var g = 0; g < appCE.arrQuestionIds.length; g++) {
var h = new Object;
h = appDB.readQuestionStatistics(appCE.arrQuestionIds[g]);
if (h == null) {
var h = new Object;
h.answeredTotal = 0, h.answeredCorrect = 0, h.answeredAll = "", h.answeredLastDate = "";
}
h.answeredTotal = parseInt(h.answeredTotal, 10) + 1, appCE.isQuestionAnsweredCorrectly(g) ? (h.answeredCorrect = parseInt(h.answeredCorrect, 10) + 1, h.answeredAll = "1" + h.answeredAll) : h.answeredAll = "0" + h.answeredAll;
var i = new Date;
h.answeredLastDate = i.toISOString(), appDB.writeQuestionStatistics(appCE.arrQuestionIds[g], h.answeredTotal, h.answeredCorrect, h.answeredAll, h.answeredLastDate);
var f = Math.round((new Date).getTime() / 1e3);
appCE.isQuestionAnsweredCorrectly(g) ? appDB.writeQuestionStatisticsForSync(appCE.arrQuestionIds[g], f, 1) : appDB.writeQuestionStatisticsForSync(appCE.arrQuestionIds[g], f, 0);
}
} else alert(appConfig.msgCancelHint, this); else this.doBackButtonTap();
},
switchToBasic: function() {
appCE.displayMode == appConfig.appTestingModeHandsOn ? (this.$.t24qbtnbasic.removeClass("t24qbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicinact"), this.$.t24qbtnclass.removeClass("t24qbtnclassinact"), this.$.t24qbtnclass.removeClass("t24qbtnclassact"), this.$.t24qbtnbasic.addClass("t24custqbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicinact"), this.$.t24qbtnclass.addClass("t24custqbtnclassinact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassact"), this.$.t24qansweredfeedback.applyStyle("display", "none"), this.$.t24posDisplay.setShowbasic(!0), appCE.currentQuestionIndex = this.$.t24posDisplay.firstQuestionIndex, this.displayCurrentQuestion()) : (this.$.t24qbtnbasic.removeClass("t24custqbtnbasicinact"), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassinact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassact"), this.$.t24qbtnbasic.addClass("t24qbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicinact"), this.$.t24qbtnclass.addClass("t24qbtnclassinact"), this.$.t24qbtnclass.removeClass("t24qbtnclassact"), this.$.t24qansweredfeedback.applyStyle("display", "none"), this.$.t24posDisplay.setShowbasic(!0), appCE.currentQuestionIndex = this.$.t24posDisplay.firstQuestionIndex, this.displayCurrentQuestion());
},
switchToAdvanced: function() {
appCE.displayMode == appConfig.appTestingModeHandsOn ? (this.$.t24qbtnbasic.removeClass("t24qbtnbasicinact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicact"), this.$.t24qbtnclass.removeClass("t24qbtnclassact"), this.$.t24qbtnclass.removeClass("t24qbtnclassinact"), this.$.t24qbtnbasic.addClass("t24custqbtnbasicinact"), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicact"), this.$.t24qbtnclass.addClass("t24custqbtnclassact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassinact"), this.$.t24qansweredfeedback.applyStyle("display", "none"), this.$.t24posDisplay.setShowbasic(!1), appCE.currentQuestionIndex = this.$.t24posDisplay.firstQuestionIndex, this.displayCurrentQuestion()) : (this.$.t24qbtnbasic.removeClass("t24custqbtnbasicinact"), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassinact"), this.$.t24qbtnbasic.addClass("t24qbtnbasicinact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicact"), this.$.t24qbtnclass.addClass("t24qbtnclassact"), this.$.t24qbtnclass.removeClass("t24qbtnclassinact"), this.$.t24qansweredfeedback.applyStyle("display", "none"), this.$.t24posDisplay.setShowbasic(!1), appCE.currentQuestionIndex = this.$.t24posDisplay.firstQuestionIndex, this.displayCurrentQuestion());
},
changeCurrentQuestionIndex: function(a, b) {
if (typeof b == "undefined") var c = this.$.t24btnnext; else var c = b.originator;
var c = this.$.t24btnnext;
if (appCE.displayMode == appConfig.appTestingModeExercising && c.getContent() == appConfig.msgSolve && dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 == "1") {
var d = 0;
typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_corr1 != "undefined" && appCE.arrUserAnswers[appCE.currentQuestionIndex][1] && d++, typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_corr2 != "undefined" && appCE.arrUserAnswers[appCE.currentQuestionIndex][2] && d++, typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_corr3 != "undefined" && appCE.arrUserAnswers[appCE.currentQuestionIndex][3] && d++;
if (d > 0) {
alert(appConfig.msgEvaluateQuestionBeforeContinue, this);
return;
}
}
var e = b.getAttributes(), f = parseInt(e.questionPos, 10);
f < 0 && (f = 0), f > appCE.arrQuestionIds.length - 1 && (f = appCE.arrQuestionIds.length - 1), appCE.currentQuestionIndex = f, appCE.displayMode == appConfig.appTestingModeExercising && (b.originator.getContent() != appConfig.msgSolve && (appCE.arrUserAnswers[appCE.currentQuestionIndex][5] = 0, this.$.t24posDisplay.displayPositionButtons()), this.$.t24btnnext.setContent(appConfig.msgSolve)), this.displayCurrentQuestion();
},
displayNextQuestion: function(a, b) {
if (typeof b == "undefined") var c = this.$.t24btnnext; else var c = b.originator;
if (appCE.displayMode == appConfig.appTestingModeExercising && c.getContent() == appConfig.msgSolve) {
var d;
if (dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 == "1") {
var e = 0;
typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_corr1 != "undefined" && appCE.arrUserAnswers[appCE.currentQuestionIndex][1] && e++, typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_corr2 != "undefined" && appCE.arrUserAnswers[appCE.currentQuestionIndex][2] && e++, typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_corr3 != "undefined" && appCE.arrUserAnswers[appCE.currentQuestionIndex][3] && e++;
if (e == 0) {
alert(appConfig.msgAnswerQuestionBeforeEvaluating, this);
return;
}
}
b.originator.setContent(appConfig.msgNext), d = appCE.evaluateUserAnswersForQuestion(appCE.currentQuestionIndex), dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 == "2" && this.$.t24qtxtanswer.setContent("<span style='color:#999'>" + parseInt(dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_1, 10) + "</span>");
if (appConfig.displayExplanationInPracticeMode && !d) try {
var f = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].explT, g = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].explP;
alert('<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Erkl\u00e4rung</h2>' + f + "<hr />Siehe STVO \u00a7" + g, this);
} catch (h) {}
this.$.t24qunansweredlbl.applyStyle("display", "none"), d ? this.$.t24qansweredfeedback.setContent("<span class='t24answerfeedback' style='color:green'>" + appConfig.msgAnswersCorrect + "</span>") : (this.$.t24qansweredfeedback.setContent("<span class='t24answerfeedback' style='color:red'>" + appConfig.msgAnswersIncorrect + "</span>"), appConfig.appDisplayExplanationOnWrongAnswer && this.showQuestionExplanation()), this.$.t24qansweredfeedback.applyStyle("display", "block");
var i = new Object;
i = appDB.readQuestionStatistics(appCE.arrQuestionIds[appCE.currentQuestionIndex]);
if (i == null) {
var i = new Object;
i.answeredTotal = 0, i.answeredCorrect = 0, i.answeredAll = "", i.answeredLastDate = "";
}
i.answeredTotal = parseInt(i.answeredTotal, 10) + 1, d ? (i.answeredCorrect = parseInt(i.answeredCorrect, 10) + 1, i.answeredAll = "1" + i.answeredAll) : i.answeredAll = "0" + i.answeredAll;
var j = new Date;
i.answeredLastDate = j.toISOString(), appDB.writeQuestionStatistics(appCE.arrQuestionIds[appCE.currentQuestionIndex], i.answeredTotal, i.answeredCorrect, i.answeredAll, i.answeredLastDate);
var k = Math.round((new Date).getTime() / 1e3);
if (d) appDB.writeQuestionStatisticsForSync(appCE.arrQuestionIds[appCE.currentQuestionIndex], k, 1); else {
appDB.writeQuestionStatisticsForSync(appCE.arrQuestionIds[appCE.currentQuestionIndex], k, 0);
var l = 0;
for (var m in dataTableQuestions) {
if (l >= appConfig.quickstartQuestions + 1) break;
if (dataTableQuestions[m]["classes"] == "" || dataTableQuestions[m].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var n = appDB.readQuestionStatistics(m), o = "", p = "1";
if (typeof n == "object") try {
o = n.answeredAll, p = o.substr(0, 1);
} catch (q) {}
p != "1" && l++;
}
}
if (l > appConfig.quickstartQuestions) var r = "" + appConfig.quickstartQuestions + "+"; else var r = l;
fsapp.displayAd(appConfig.appAdTriggerLastErrors, l);
}
this.displayCurrentQuestionCorrectAnswers(), this.$.t24posDisplay.displayPositionButtons();
} else if (appCE.currentQuestionIndex < appCE.arrQuestionIds.length - 1) {
appCE.displayMode == appConfig.appTestingModeExercising && c.setContent(appConfig.msgSolve);
var s = appConfig.userClassSelectedId == appConfig.appClassMofaId;
if (appCE.currentQuestionIndex == -1) if (s) var t = dataTableQuestions[appCE.arrQuestionIds[appCE.arrQuestionIds.length - 1]].basic_mofa; else var t = dataTableQuestions[appCE.arrQuestionIds[appCE.arrQuestionIds.length - 1]].basic; else if (s) var t = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].basic_mofa; else var t = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].basic;
appCE.gotoNextQuestion();
if (s) var u = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].basic_mofa; else var u = dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].basic;
appCE.getQuestionOrigin() == 1 ? t != u ? t == 1 && u == 0 ? this.switchToAdvanced() : this.switchToBasic() : this.displayCurrentQuestion() : this.displayCurrentQuestion(), appCE.displayMode == appConfig.appTestingModeExercising && (appCE.arrUserAnswers[appCE.currentQuestionIndex][5] = 0, this.$.t24posDisplay.displayPositionButtons());
} else var v = alert(appConfig.msgLastQuestionGotoFirst, this, {
cancelText: appConfig.msgBtnCaptionNo,
confirmText: appConfig.msgBtnCaptionYes,
onConfirm: function(a) {
this.hide(), appCE.currentQuestionIndex = -1, fsapp.$.TestingPage.$.CoreTestingDisplay.displayNextQuestion(), this.destroy();
}
});
},
displayUnansweredQuestionNumber: function() {
var a = appCE.getNumberOfUnansweredQuestions();
a > 0 && appCE.getQuestionOrigin() == 1 ? (this.$.t24qunansweredlbl.setContent(appConfig.msgUnansweredQuesitons.replace("{num}", a)), this.$.t24qunansweredlbl.applyStyle("display", "block")) : this.$.t24qunansweredlbl.applyStyle("display", "none");
},
initTestingEnvironment: function(a) {
this.questionSolvedOnDisplay = !1, this.disableTimer(), appCE.currentQuestionIndex = 0, appCE.initVideoQuestionStatus(), !appConfig.appMultilingual || appConfig.appSelectedAltLanguageISO2 == "DE" ? (appConfig.appMultilingual && (this.displayGermanVersion = !1, this.toggleQuestionLanguage()), this.$.t24xlabel5x.hide()) : (this.$.t24xlabel5x.show(), this.displayGermanVersion = !0, this.toggleQuestionLanguage()), this.$.t24qscroller.applyStyle("background-color", appConfig.appOfficialLightBackgroundGreen), this.$.t24qheader.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24qbasiclabel.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24qextraslabel.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24xlabel1x.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24xlabel2x.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24xlabel3x.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24qpointslabel.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24qposcontainer.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24posDisplay.applyStyle("background-color", appConfig.appOfficialDarkBackgroundGreen), this.$.t24bottomcontrols.applyStyle("background-color", appConfig.appOfficialLightBackgroundGreen), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicinact"), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassinact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassact"), this.$.t24qbtnbasic.addClass("t24qbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicinact"), this.$.t24qbtnclass.addClass("t24qbtnclassinact"), this.$.t24qbtnclass.removeClass("t24qbtnclassact"), this.$.t24btneval.setContent(appConfig.msgCancel), this.$.t24xlabel1tt.setContent(appConfig.msgQuestionMotherflag), this.$.t24qtxtansbtnDel.setContent(appConfig.msgClear), appCE.displayMode == appConfig.appTestingModeReading && (this.$.t24btneval.setContent(appConfig.msgCancel), this.$.t24btnnext.setContent(appConfig.msgNext), this.$.t24answer1.locked = 1, this.$.t24answer2.locked = 1, this.$.t24answer3.locked = 1, this.$.t24qansweredfeedback.applyStyle("display", "none"), userDevicePlatform == "phone" && this.$.t24btneval.hide()), appCE.displayMode == appConfig.appTestingModeExercising && (this.$.t24btneval.setContent(appConfig.msgCancel), this.$.t24btnnext.setContent(appConfig.msgSolve), this.$.t24answer1.locked = 0, this.$.t24answer2.locked = 0, this.$.t24answer3.locked = 0, this.$.t24qansweredfeedback.applyStyle("display", "none"), userDevicePlatform == "phone" && this.$.t24btneval.hide()), appCE.displayMode == appConfig.appTestingModeTesting && (this.$.t24btneval.setContent(appConfig.msgEvaluate), this.$.t24btnnext.setContent(appConfig.msgNext), this.$.t24answer1.locked = 0, this.$.t24answer2.locked = 0, this.$.t24answer3.locked = 0, this.$.t24qansweredfeedback.applyStyle("display", "none"), userDevicePlatform == "phone" && this.$.t24btneval.show()), appCE.displayMode == appConfig.appTestingModeHandsOn && (this.$.t24qbtnbasic.removeClass("t24qbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicinact"), this.$.t24qbtnclass.removeClass("t24qbtnclassinact"), this.$.t24qbtnclass.removeClass("t24qbtnclassact"), this.$.t24qbtnbasic.addClass("t24custqbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24custqbtnbasicinact"), this.$.t24qbtnclass.addClass("t24custqbtnclassinact"), this.$.t24qbtnclass.removeClass("t24custqbtnclassact"), this.$.t24qscroller.applyStyle("background-color", appConfig.appT24LightBackgroundColor), this.$.t24qheader.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24qbasiclabel.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24qextraslabel.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24xlabel1x.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24xlabel2x.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24xlabel3x.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24qpointslabel.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24qposcontainer.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24posDisplay.applyStyle("background-color", appConfig.appT24DarkBackgroundColor), this.$.t24bottomcontrols.applyStyle("background-color", appConfig.appT24LightBackgroundColor)), appCE.getQuestionOrigin() == 0 && (this.$.t24qbtnbasic.setContent(appCE.getNumberOfQuestionsInSelection() + " " + this.getQuestionWord(appCE.getNumberOfQuestionsInSelection())), this.$.t24qbtnclass.applyStyle("display", "none"), this.$.t24qunansweredlbl.applyStyle("display", "none"), this.$.t24qbtnbasic.addClass("t24qbtnbasicact"), this.$.t24qbtnbasic.removeClass("t24qbtnbasicinact"), this.$.t24qposcontainer.addRemoveClass("t24qposcontainertheme", !0), this.$.t24bottomcontrols.addRemoveClass("t24bottomcontrolstheme", !0), this.$.t24qscrollcontainer.addRemoveClass("t24qscrollcontainertheme", !0), this.$.t24qscrollcontainer.addRemoveClass("t24qscrollcontainerset", !1)), appCE.getQuestionOrigin() == 1 && (this.$.t24qbtnbasic.setContent(appConfig.msgBasic), this.$.t24qbtnclass.applyStyle("display", "block"), this.$.t24qunansweredlbl.applyStyle("display", "block"), this.$.t24qposcontainer.addRemoveClass("t24qposcontainertheme", !1), this.$.t24bottomcontrols.addRemoveClass("t24bottomcontrolstheme", !1), this.$.t24qscrollcontainer.addRemoveClass("t24qscrollcontainertheme", !1), this.$.t24qscrollcontainer.addRemoveClass("t24qscrollcontainerset", !0), this.switchToBasic());
},
startTimer: function() {
var a = new Date, b = a.getTime();
this.timerTargetTime = b + 18e5, enyo.job("timeJob" + b, enyo.bind(this, "updateTimerDisplay"), 500);
},
disableTimer: function() {
this.timerTargetTime = 0, this.$.t24qtimerlabel.hide();
},
updateTimerDisplay: function() {
if (this.timerTargetTime != 0) {
var a = new Date, b = a.getTime(), c = parseInt((this.timerTargetTime - b) / 1e3, 10), d = new Date(null);
d.setSeconds(c), this.$.t24qtimerlabel.setContent("" + d.toISOString().substr(14, 5)), this.$.t24qtimerlabel.show(), c > 0 && this.timerTargetTime != 0 ? enyo.job("timeJob" + b, enyo.bind(this, "updateTimerDisplay"), 500) : (this.timerTargetTime != 0 && alert("Die Zeit f\u00fcr die Pr\u00fcfung ist abgelaufen. Bitte geben Sie nun ab!", this), this.disableTimer());
}
},
getQuestionWord: function(a) {
if (a == 1) var b = appConfig.msgQuestion; else var b = appConfig.msgQuestions;
return b;
},
displayCurrentQuestionCorrectAnswers: function() {
this.questionSolvedOnDisplay = !0;
var a = appCE.arrQuestionIds[appCE.currentQuestionIndex];
if (dataTableQuestions[a].asw_type_1 == "1") {
var b;
typeof dataTableQuestions[a].asw_1 != "undefined" ? (b = dataTableQuestions[a].asw_index_1, log("SI 1: " + b), this.$.t24answer1.setCorrectCheckmarkValue(parseInt(dataTableQuestions[a].asw_corr1, 10)), this.$.t24answer1.showCorrectCheckmark()) : this.$.t24answer1.hideCorrectCheckmark(), typeof dataTableQuestions[a].asw_2 != "undefined" ? (b = dataTableQuestions[a].asw_index_2, log("SI 2: " + b), this.$.t24answer2.setCorrectCheckmarkValue(parseInt(dataTableQuestions[a].asw_corr2, 10)), this.$.t24answer2.showCorrectCheckmark()) : this.$.t24answer2.hideCorrectCheckmark(), typeof dataTableQuestions[a].asw_3 != "undefined" ? (b = dataTableQuestions[a].asw_index_3, log("SI 3: " + b), this.$.t24answer3.setCorrectCheckmarkValue(parseInt(dataTableQuestions[a].asw_corr3, 10)), this.$.t24answer3.showCorrectCheckmark()) : this.$.t24answer3.hideCorrectCheckmark(), this.$.t24qanswers.applyStyle("display", "block");
} else this.$.t24qtxtanswer.setContent(appCE.arrUserAnswers[appCE.currentQuestionIndex][1] + " <span style='color:#999'>[" + dataTableQuestions[a].asw_1 + "]</span>"), this.$.t24qnumberanswer.applyStyle("display", "block");
if (dataTableQuestions[a].picture != "") {
var c = dataTableQuestions[a].picture, d = c.substring(c.length - 4, c.length) == appConfig.extVideoTriggerExtension;
if (d && appCE.displayMode != appConfig.appTestingModeReading) {
this.$.t24btnReplayVideo.show();
var e = c.split(appConfig.extVideoTriggerExtension);
this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + e[0] + "_ende.jpg" + appConfig.extImgMedium), this.$.t24qvideoinfo.applyStyle("display", "none");
}
}
this.displayHeaderQuestionExplanationButton();
},
displayHeaderQuestionExplanationButton: function() {
appConfig.appDisplayHeaderQuestionExplanationButton ? typeof dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].info != "undefined" ? dataTableQuestions[appCE.arrQuestionIds[appCE.currentQuestionIndex]].info != "" ? this.$.t24xlabel4x.applyStyle("display", "block") : this.$.t24xlabel4x.applyStyle("display", "none") : this.$.t24xlabel4x.applyStyle("display", "none") : this.$.t24xlabel4x.applyStyle("display", "none");
},
displayCurrentQuestion: function() {
var a = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10), b = "", c = !1;
if (appConfig.appLockMode == 2 && appConfig.appMultilingual && !appConfig.userUnlockedApp && fsapp.currentPageId == 6) {
var d = new Object;
d = appDB.readQuestionStatistics(a);
if (d != null) var e = d.answeredAll.length > 0; else var e = !1;
if (!e) {
var f = appConfig.appOpenQuestionsInMultilingualLite - parseInt(appDB.readMasterQuestionCounter(), 10);
f <= 0 && (alert(appConfig.msgNoRemainingOpenQuestionsLeft.replace("%OPENQUESTIONS%", appConfig.appOpenQuestionsInMultilingualLite), this), c = !0);
}
}
this.previousQuestionId != a && !e && appDB.incMasterQuestionCounter(), this.previousQuestionId = a, fsapp.lastPageId == 1 && fsapp.$.ChapterPage.isOfficialCatTree() && (appConfig.userLastViewedQuestionId = a, appDB.writeLastViewedTopicAndQuestion(appConfig.userLastViewedTopicId, appConfig.userLastViewedQuestionId, 0)), this.adQuestionCounter++, !(parseInt(appDB.readDemoQuestionCounter(), 10) > 0 && parseInt(appDB.readDemoQuestionCounter(), 10) <= 150), parseInt(appDB.readDemoQuestionCounter(), 10) > 150 && parseInt(appDB.readDemoQuestionCounter(), 10) <= 500 && (appConfig.appAdTriggerQuestionCounterAmount = 30), parseInt(appDB.readDemoQuestionCounter(), 10) > 500 && parseInt(appDB.readDemoQuestionCounter(), 10) <= 1e4 && (appConfig.appAdTriggerQuestionCounterAmount = 25), parseInt(appDB.readDemoQuestionCounter(), 10) > 1e4 && (appConfig.appAdTriggerQuestionCounterAmount = 10), this.adQuestionCounter % 5 == 0 && fsapp.displayAd(appConfig.appAdTriggerQuestionCounter, this.adQuestionCounter);
if ((appConfig.appLockable || appConfig.appOffersInAppPurchase) && !appConfig.userUnlockedApp || appConfig.appUnlockSyncByUser && appConfig.appSyncLocked && appConfig.appPlatformId == "web") if (appConfig.countDemoQuestionUsageInLockedApp) {
appDB.incDemoQuestionCounter();
var g = appDB.readDemoQuestionCounter();
if (g % 10 == 0) switch (parseInt(appDB.readDemoQuestionCounter(), 10)) {
case 20:
case 40:
case 60:
case 80:
case 100:
case 150:
case 200:
case 250:
case 300:
case 350:
case 400:
case 450:
case 500:
case 600:
case 700:
case 800:
case 900:
case 1e3:
case 1100:
case 1200:
case 1300:
case 1400:
case 1500:
case 2e3:
case 2500:
case 3e3:
case 3500:
case 4e3:
case 4500:
case 5e3:
case 6e3:
case 7e3:
case 8e3:
case 9e3:
case 1e4:
case 15e3:
case 2e4:
case 25e3:
case 3e4:
case 35e3:
case 4e4:
case 5e4:
case 75e3:
case 1e5:
appConfig.appSyncDemoCountStatistics && appDB.hasNetworkConnection() && fsapp.$.TestingPage.syncDemoStatistics();
break;
default:
}
}
appConfig.appDisplayMQHeaderButton ? dataTableQuestions[a].mq_flag == "1" ? this.$.t24xlabel1x.applyStyle("display", "block") : this.$.t24xlabel1x.applyStyle("display", "none") : this.$.t24xlabel1x.applyStyle("display", "none"), this.$.t24xlabel3x.applyStyle("display", "none"), this.$.t24qtext.applyStyle("color", "#0B333C"), this.$.t24qhint1.applyStyle("color", "#0B333C"), this.$.t24answer1.applyStyle("color", "#0B333C"), this.$.t24answer2.applyStyle("color", "#0B333C"), this.$.t24answer3.applyStyle("color", "#0B333C"), this.voiceOverIndex = 0, fsapp.$.coreAudio.reset(), this.$.t24videoplay.setContent(appConfig.msgStartVideo), this.$.t24videoskip.setContent(appConfig.msgShowQuestionText), this.$.t24btnReplayVideo.setContent(appConfig.msgPlayVideoAgain), appConfig.appMultilingual && (appConfig.appAvailableLanguages[appConfig.appSelectedAltLanguageISO2].RtL && !this.displayGermanVersion ? (this.$.t24qtext.applyStyle("text-align", "right"), this.$.t24qhint1.applyStyle("text-align", "right"), this.$.t24answer1.$.answercontainer.applyStyle("text-align", "right"), this.$.t24answer2.$.answercontainer.applyStyle("text-align", "right"), this.$.t24answer3.$.answercontainer.applyStyle("text-align", "right"), this.$.t24answer1.$.answercontainer.applyStyle("float", "right"), this.$.t24answer2.$.answercontainer.applyStyle("float", "right"), this.$.t24answer3.$.answercontainer.applyStyle("float", "right"), this.$.t24answer1.$.answertextRtLContainer.applyStyle("display", "block"), this.$.t24answer2.$.answertextRtLContainer.applyStyle("display", "block"), this.$.t24answer3.$.answertextRtLContainer.applyStyle("display", "block"), this.$.t24answer1.$.answertextContainer.applyStyle("display", "none"), this.$.t24answer2.$.answertextContainer.applyStyle("display", "none"), this.$.t24answer3.$.answertextContainer.applyStyle("display", "none")) : (this.$.t24qtext.applyStyle("text-align", "left"), this.$.t24qhint1.applyStyle("text-align", "left"), this.$.t24answer1.$.answercontainer.applyStyle("text-align", "left"), this.$.t24answer2.$.answercontainer.applyStyle("text-align", "left"), this.$.t24answer3.$.answercontainer.applyStyle("text-align", "left"), this.$.t24answer1.$.answercontainer.applyStyle("float", "left"), this.$.t24answer2.$.answercontainer.applyStyle("float", "left"), this.$.t24answer3.$.answercontainer.applyStyle("float", "left"), this.$.t24answer1.$.answertextRtLContainer.applyStyle("display", "none"), this.$.t24answer2.$.answertextRtLContainer.applyStyle("display", "none"), this.$.t24answer3.$.answertextRtLContainer.applyStyle("display", "none"), this.$.t24answer1.$.answertextContainer.applyStyle("display", "block"), this.$.t24answer2.$.answertextContainer.applyStyle("display", "block"), this.$.t24answer3.$.answertextContainer.applyStyle("display", "block"))), this.$.t24btnReplayVideo.hide(), this.$.t24xlabel4x.applyStyle("display", "none"), appCE.displayMode == appConfig.appTestingModeExercising && this.$.t24btnnext.getContent() == appConfig.msgSolve && (this.comingBackFromVideoPlayer ? this.comingBackFromVideoPlayer = !1 : (log("1) not coming back from video player. " + parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10)), parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) >= appConfig.appMaxMovieViews && (log("2) video views > max views. " + (appCE.arrUserAnswers[appCE.currentQuestionIndex][1] + appCE.arrUserAnswers[appCE.currentQuestionIndex][2] + appCE.arrUserAnswers[appCE.currentQuestionIndex][3])), appCE.arrUserAnswers[appCE.currentQuestionIndex][1] + appCE.arrUserAnswers[appCE.currentQuestionIndex][2] + appCE.arrUserAnswers[appCE.currentQuestionIndex][3] > 0 && (log("3) some answers were given before. "), appCE.resetVideoQuestionStatus(appCE.currentQuestionIndex)))), appCE.arrUserAnswers[appCE.currentQuestionIndex][1] = 0, appCE.arrUserAnswers[appCE.currentQuestionIndex][2] = 0, appCE.arrUserAnswers[appCE.currentQuestionIndex][3] = 0, this.$.t24qansweredfeedback.applyStyle("display", "none"), this.questionSolvedOnDisplay = !1), appCE.displayMode == appConfig.appTestingModeTesting && appCE.arrUserAnswers[appCE.currentQuestionIndex][5] != 0 ? (this.displayCurrentQuestionCorrectAnswers(), appConfig.appOnMobileDevice ? this.$.t24qansweredfeedback.setContent("<span class='t24answerfeedback' style='color:black'>" + appConfig.msgSolveMobileHint + "</span>") : this.$.t24qansweredfeedback.setContent("<span class='t24answerfeedback' style='color:black'>" + appConfig.msgSolveHint + "</span>"), this.$.t24qansweredfeedback.applyStyle("display", "block"), this.displayHeaderQuestionExplanationButton()) : (this.$.t24answer1.hideCorrectCheckmark(), this.$.t24answer2.hideCorrectCheckmark(), this.$.t24answer3.hideCorrectCheckmark()), this.$.t24answer1.setCheckmarkValue(appCE.arrUserAnswers[appCE.currentQuestionIndex][1]), this.$.t24answer2.setCheckmarkValue(appCE.arrUserAnswers[appCE.currentQuestionIndex][2]), this.$.t24answer3.setCheckmarkValue(appCE.arrUserAnswers[appCE.currentQuestionIndex][3]), appCE.displayMode == appConfig.appTestingModeReading && this.displayHeaderQuestionExplanationButton();
if (appCE.displayMode != appConfig.appTestingModeTesting || appCE.arrUserAnswers[appCE.currentQuestionIndex][5] == 0) appCE.arrUserAnswers[appCE.currentQuestionIndex][1] == "0" ? this.$.t24qtxtanswer.setContent("") : this.$.t24qtxtanswer.setContent(appCE.arrUserAnswers[appCE.currentQuestionIndex][1]);
appCE.isQuestionMarked(appCE.currentQuestionIndex) ? this.$.t24btnmark.setContent(appConfig.msgDemark) : this.$.t24btnmark.setContent(appConfig.msgMark);
var h = dbTableClasses[appConfig.userClassSelectedId].name, i = h.split(" ");
i[0] != h ? this.$.t24qbtnclass.setContent(i[0] + "*") : this.$.t24qbtnclass.setContent(i[0]), this.$.t24posDisplay.displayPositionButtons(), this.questionSolvedOnDisplay || this.displayUnansweredQuestionNumber(), this.$.t24qbasiclabel.setContent(dataTableQuestions[a].number), this.$.t24qpointslabel.setContent(appConfig.msgPoints + ": " + dataTableQuestions[a].points), this.$.t24qhint1.setContent(dataTableQuestions[a].asw_pretext), this.$.t24qhint2.setContent(dataTableQuestions[a].asw_pretext);
var j = "", k = dataTableQuestions[a].text.rot13();
this.$.t24answer1.$.icoSpeaker.hide(), this.$.t24answer2.$.icoSpeaker.hide(), this.$.t24answer3.$.icoSpeaker.hide(), appConfig.appEnableQuestionVoiceOver && this.displayGermanVersion && (!appConfig.appMultilingual || appConfig.appAvailableLanguages["DE"].lockedQuestionText != k) && (j = '&nbsp;&nbsp;<i style="font-size:inherit;" class="material-icons speaker-icon">ol_speaker</i>', this.$.t24answer1.$.icoSpeaker.show(), this.$.t24answer2.$.icoSpeaker.show(), this.$.t24answer3.$.icoSpeaker.show()), this.$.t24qtext.setContent(k + j);
if (appConfig.appMultilingual) {
var l = dataTableQuestions[a].asw_index_1;
typeof dataTableQuestions[a]["asw_" + l] != "undefined" ? (dataTableQuestions[a]["asw_type_" + l] == "1" ? (this.$.t24qnumberanswer.applyStyle("display", "none"), this.$.t24qanswers.applyStyle("display", "block"), b = dataTableQuestions[a]["asw_" + l], dataTableQuestions[a]["asw_hint_" + l] != "" && (b += '<div class="answerhint">' + dataTableQuestions[a]["asw_hint_" + l] + "</div>")) : (this.$.t24qnumberanswer.applyStyle("display", "block"), this.$.t24qanswers.applyStyle("display", "none"), this.$.answerhint.setContent(dataTableQuestions[a].asw_hint_1)), this.$.t24answer1.setAnswertext(b), this.$.t24answer1.show()) : this.$.t24answer1.hide(), l = dataTableQuestions[a].asw_index_2, typeof dataTableQuestions[a]["asw_" + l] != "undefined" ? (b = dataTableQuestions[a]["asw_" + l], dataTableQuestions[a]["asw_hint_" + l] != "" && (b += '<span class="answerhint">' + dataTableQuestions[a]["asw_hint_" + l] + "</span>"), this.$.t24answer2.setAnswertext(b), this.$.t24answer2.show()) : this.$.t24answer2.hide(), l = dataTableQuestions[a].asw_index_3, typeof dataTableQuestions[a]["asw_" + l] != "undefined" ? (b = dataTableQuestions[a]["asw_" + l], dataTableQuestions[a]["asw_hint_" + l] != "" && (b += '<span class="answerhint">' + dataTableQuestions[a]["asw_hint_" + l] + "</span>"), this.$.t24answer3.setAnswertext(b), this.$.t24answer3.show()) : this.$.t24answer3.hide();
} else {
var l = 1;
typeof dataTableQuestions[a]["asw_" + l] != "undefined" ? (dataTableQuestions[a]["asw_type_" + l] == "1" ? (this.$.t24qnumberanswer.applyStyle("display", "none"), this.$.t24qanswers.applyStyle("display", "block"), b = dataTableQuestions[a]["asw_" + l], dataTableQuestions[a]["asw_hint_" + l] != "" && (b += '<div class="answerhint">' + dataTableQuestions[a]["asw_hint_" + l] + "</div>")) : (this.$.t24qnumberanswer.applyStyle("display", "block"), this.$.t24qanswers.applyStyle("display", "none"), this.$.answerhint.setContent(dataTableQuestions[a].asw_hint_1)), this.$.t24answer1.setAnswertext(b), this.$.t24answer1.show()) : this.$.t24answer1.hide(), l = 2, typeof dataTableQuestions[a]["asw_" + l] != "undefined" ? (b = dataTableQuestions[a]["asw_" + l], dataTableQuestions[a]["asw_hint_" + l] != "" && (b += '<span class="answerhint">' + dataTableQuestions[a]["asw_hint_" + l] + "</span>"), this.$.t24answer2.setAnswertext(b), this.$.t24answer2.show()) : this.$.t24answer2.hide(), l = 3, typeof dataTableQuestions[a]["asw_" + l] != "undefined" ? (b = dataTableQuestions[a]["asw_" + l], dataTableQuestions[a]["asw_hint_" + l] != "" && (b += '<span class="answerhint">' + dataTableQuestions[a]["asw_hint_" + l] + "</span>"), this.$.t24answer3.setAnswertext(b), this.$.t24answer3.show()) : this.$.t24answer3.hide();
}
c && (this.$.t24qtext.setContent(appConfig.appAvailableLanguages[appConfig.appSelectedAltLanguageISO2].lockedQuestionText), this.$.t24answer1.setAnswertext(appConfig.appAvailableLanguages[appConfig.appSelectedAltLanguageISO2].lockedAnswerText), this.$.t24answer2.setAnswertext(appConfig.appAvailableLanguages[appConfig.appSelectedAltLanguageISO2].lockedAnswerText), this.$.t24answer3.setAnswertext(appConfig.appAvailableLanguages[appConfig.appSelectedAltLanguageISO2].lockedAnswerText)), appCE.displayMode == appConfig.appTestingModeTesting && appCE.arrUserAnswers[appCE.currentQuestionIndex][5] != 0 && (this.displayCurrentQuestionCorrectAnswers(), this.displayHeaderQuestionExplanationButton());
if (dataTableQuestions[a].picture != "") {
var m = dataTableQuestions[a].picture, n = m.substring(m.length - 4, m.length) == appConfig.extVideoTriggerExtension;
if (n) {
(appCE.displayMode != appConfig.appTestingModeTesting || appCE.arrUserAnswers[appCE.currentQuestionIndex][5] == 0) && this.questionSolvedOnDisplay && this.$.t24btnReplayVideo.show();
var o = m.split(appConfig.extVideoTriggerExtension);
if (appCE.displayMode == appConfig.appTestingModeReading || appCE.displayMode == appConfig.appTestingModeExercising || appCE.displayMode == appConfig.appTestingModeTesting) parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) == 0 && (this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + o[0] + "_anfang.jpg" + appConfig.extImgMedium), this.$.t24qtext.setContent(appConfig.msgVideoGeneralIntro), this.$.t24qhint0.setContent(appConfig.msgVideoMaxViews.replace("{num}", "<b>" + appConfig.appMaxMovieViews + "</b>")), this.$.t24qnumberanswer.applyStyle("display", "none"), this.$.t24qanswers.applyStyle("display", "none"), this.$.t24videoskip.applyStyle("display", "none"), this.$.t24qvideoinfo.applyStyle("display", "block")), parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) > 0 && parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) < appConfig.appMaxMovieViews && (this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + o[0] + "_ende.jpg" + appConfig.extImgMedium), this.$.t24qtext.setContent(appConfig.msgVideoGeneralIntro), this.$.t24qhint0.setContent(appConfig.msgVideoRemainingViews.replace("{num}", "<span style='color:red'>" + (appConfig.appMaxMovieViews - parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10)) + "</span>")), this.$.t24qnumberanswer.applyStyle("display", "none"), this.$.t24qanswers.applyStyle("display", "none"), this.$.t24videoskip.applyStyle("display", "block"), this.$.t24qvideoinfo.applyStyle("display", "block")), parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) >= appConfig.appMaxMovieViews && (this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + o[0] + "_ende.jpg" + appConfig.extImgMedium), this.$.t24qvideoinfo.applyStyle("display", "none"), (appCE.displayMode == appConfig.appTestingModeReading || appCE.displayMode == appConfig.appTestingModeExercising && this.$.t24btnnext.getContent() != appConfig.msgSolve || appCE.displayMode == appConfig.appTestingModeTesting && appCE.arrUserAnswers[appCE.currentQuestionIndex][5] != 0) && this.$.t24btnReplayVideo.show());
appCE.displayMode == appConfig.appTestingModeHandsOn && (parseInt(appCE.readVideoQuestionStatus(appCE.currentQuestionIndex), 10) >= appConfig.appMaxMovieViews ? (this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + o[0] + "_ende.jpg" + appConfig.extImgMedium), this.$.t24qvideoinfo.applyStyle("display", "none"), (appCE.displayMode == appConfig.appTestingModeReading || appCE.displayMode == appConfig.appTestingModeHandsOn && this.$.t24btnnext.getContent() != appConfig.msgSolve || appCE.displayMode == appConfig.appTestingModeTesting && appCE.arrUserAnswers[appCE.currentQuestionIndex][5] != 0) && this.$.t24btnReplayVideo.show()) : (this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + o[0] + "_anfang.jpg" + appConfig.extImgMedium), this.$.t24qtext.setContent(appConfig.msgVideoGeneralIntro), this.$.t24qhint0.setContent(""), this.$.t24qnumberanswer.applyStyle("display", "none"), this.$.t24qanswers.applyStyle("display", "none"), this.$.t24videoskip.applyStyle("display", "block"), this.$.t24qvideoinfo.applyStyle("display", "block"))), appConfig.appPlatformId == "android" && (this.$.t24qpicimg.applyStyle("opacity", "0.5"), this.$.t24videoplay.setDisabled(!0), this.$.t24videoplay.setContent("Video wird vorbereitet..."), fsapp.$.FullscreenVideoPage.prepareVideo(), this.timeOfQuestionDisplay = (new Date).getTime(), this.job = window.setTimeout(enyo.bind(this, "unlockVideoButtons"), 500), this.prevPreparedFilename = o[0]);
} else this.$.t24qpicimg.setAttribute("src", appConfig.pathImgMedium + dataTableQuestions[a].picture + appConfig.extImgMedium), this.$.t24qvideoinfo.hide(), typeof dataTableQuestions[a]["asw_1"] != "undefined" && dataTableQuestions[a]["asw_type_1"] == "1" && this.$.t24qanswers.show();
this.$.t24qpicimg.applyStyle("display", "block");
} else this.$.t24qvideoinfo.applyStyle("display", "none"), this.$.t24qpicimg.applyStyle("display", "none");
var p = this.$.t24qtext.getBounds();
parseInt(p.height, 10) != 0 && this.$.t24qpic.applyStyle("top", p.height + "px !important;");
var p = this.$.t24qanswers.getBounds();
parseInt(p.height, 10) != 0 && this.$.t24qpic.applyStyle("bottom", p.height + "px !important;"), this.$.t24qscroller.setScrollTop(0), this.refreshAddQuestionDisplay(), enyo.job("RefreshPage", enyo.bind(this, "refreshAddQuestionDisplay"), 100);
},
refreshAddQuestionDisplay: function() {
this.render(), this.$.t24qscroller.render(), this.$.t24qtext.render();
},
unlockVideoButtons: function() {
this.$.t24qpicimg.applyStyle("opacity", "1.0"), this.$.t24videoplay.setContent(appConfig.msgStartVideo), this.$.t24videoplay.setDisabled(!1);
}
}), enyo.kind({
name: "appCoreEngine",
kind: "Component",
published: {
displayMode: 0,
questionOrigin: 0,
skipSetStatisticsEntry: !1,
testSimulationMode: !1
},
currentQuestionIndex: 0,
arrTempQuestionIds: [],
arrQuestionIds: [],
arrUserAnswers: [],
arrVideoQuestionStatus: [],
clearQuestionIdsArray: function() {
this.currentQuestionIndex = 0, this.arrQuestionIds = new Array, this.arrVideoQuestionStatus = new Array;
},
clearTempQuestionIdsArray: function() {
this.arrTempQuestionIds = new Array;
},
getNumberOfQuestionsInSelection: function() {
return this.arrQuestionIds.length;
},
evaluateAllUserAnswersBasicAdditive: function() {
var a = 0, b = 0;
for (var c = 0; c < this.arrQuestionIds.length; c++) if (!this.evaluateUserAnswersForQuestion(c)) {
var d = appConfig.userClassSelectedId == appConfig.appClassMofaId;
!d && dataTableQuestions[this.arrQuestionIds[c]].basic == "1" || d && dataTableQuestions[this.arrQuestionIds[c]].basic_mofa == "1" ? a += parseInt(dataTableQuestions[this.arrQuestionIds[c]].points, 10) : b += parseInt(dataTableQuestions[this.arrQuestionIds[c]].points, 10);
}
return {
basic: a,
additive: b
};
},
evaluateAllUserAnswers: function() {
var a = 0, b = 0;
for (var c = 0; c < this.arrQuestionIds.length; c++) this.evaluateUserAnswersForQuestion(c) || (a += parseInt(dataTableQuestions[this.arrQuestionIds[c]].points, 10), parseInt(dataTableQuestions[this.arrQuestionIds[c]].points, 10) == 5 && b++);
return a == 10 && b > 1 && (a = -1), a;
},
evaluateUserAnswersForQuestion: function(a) {
if (dataTableQuestions[this.arrQuestionIds[a]].asw_type_1 == "2") {
var b = "0" + this.arrUserAnswers[a][1];
b = b.replace(/,/, ".");
var c = dataTableQuestions[this.arrQuestionIds[a]].asw_1;
c = c.replace(/,/, "."), parseFloat(b) == parseFloat(c) ? this.arrUserAnswers[a][5] = 2 : this.arrUserAnswers[a][5] = 1;
} else this.arrUserAnswers[a][5] = 2, typeof dataTableQuestions[this.arrQuestionIds[a]].asw_corr1 != "undefined" && this.arrUserAnswers[a][1] != parseInt(dataTableQuestions[this.arrQuestionIds[a]].asw_corr1, 10) && (this.arrUserAnswers[a][5] = 1), typeof dataTableQuestions[this.arrQuestionIds[a]].asw_corr2 != "undefined" && this.arrUserAnswers[a][2] != parseInt(dataTableQuestions[this.arrQuestionIds[a]].asw_corr2, 10) && (this.arrUserAnswers[a][5] = 1), typeof dataTableQuestions[this.arrQuestionIds[a]].asw_corr3 != "undefined" && this.arrUserAnswers[a][3] != parseInt(dataTableQuestions[this.arrQuestionIds[a]].asw_corr3, 10) && (this.arrUserAnswers[a][5] = 1);
try {
this.arrUserAnswers[a][5] != 2 && appConfig.appVibrateOnWrongAnswer && navigator.vibrate(500);
} catch (d) {}
return this.arrUserAnswers[a][5] == 2;
},
clearUserAnswersArray: function() {
this.arrUserAnswers = new Array;
for (var a = 0; a < this.arrQuestionIds.length; a++) this.displayMode == appConfig.appTestingModeReading ? (this.arrUserAnswers[a] = new Array, this.arrUserAnswers[a][0] = this.arrQuestionIds[a], this.arrUserAnswers[a][1] = parseInt(dataTableQuestions[this.arrQuestionIds[a]].asw_corr1, 10), this.arrUserAnswers[a][2] = parseInt(dataTableQuestions[this.arrQuestionIds[a]].asw_corr2, 10), this.arrUserAnswers[a][3] = parseInt(dataTableQuestions[this.arrQuestionIds[a]].asw_corr3, 10), this.arrUserAnswers[a][4] = this.isQuestionMarkedPersistent(this.arrQuestionIds[a]), this.arrUserAnswers[a][5] = 0, dataTableQuestions[this.arrQuestionIds[a]].asw_type_1 == "2" && (this.arrUserAnswers[a][1] = dataTableQuestions[this.arrQuestionIds[a]].asw_1)) : (this.arrUserAnswers[a] = new Array, this.arrUserAnswers[a][0] = this.arrQuestionIds[a], this.arrUserAnswers[a][1] = 0, this.arrUserAnswers[a][2] = 0, this.arrUserAnswers[a][3] = 0, this.arrUserAnswers[a][4] = this.isQuestionMarkedPersistent(this.arrQuestionIds[a]), this.arrUserAnswers[a][5] = 0);
},
setUserAnswer: function(a, b, c, d, e) {
this.arrUserAnswers[a][0] = b, this.arrUserAnswers[a][1] = c, this.arrUserAnswers[a][2] = d, this.arrUserAnswers[a][3] = e;
},
toggleQuestionMarked: function(a) {
this.arrUserAnswers[a][4] = 1 - this.arrUserAnswers[a][4], this.arrUserAnswers[a][4] == 1 ? appDB.addMarkedQuestion(this.arrUserAnswers[a][0]) : appDB.delMarkedQuestion(this.arrUserAnswers[a][0]);
},
markQuestion: function(a, b) {
this.arrUserAnswers[a][4] = b, this.arrUserAnswers[a][4] == 1 ? appDB.addMarkedQuestion(this.arrUserAnswers[a][0]) : appDB.delMarkedQuestion(this.arrUserAnswers[a][0]);
},
isQuestionMarked: function(a) {
return this.arrUserAnswers[a][4] == 1;
},
hasQuestionVideo: function(a) {
if (dataTableQuestions[this.arrQuestionIds[a]].picture != "") {
var b = dataTableQuestions[this.arrQuestionIds[a]].picture, c = b.substring(b.length - 4, b.length) == appConfig.extVideoTriggerExtension;
return c;
}
return !1;
},
isQuestionMarkedPersistent: function(a) {
try {
var b = new Object;
b = appDB.getItem("markedquestions");
var c = b.markedQuestionIds;
if (c.indexOf("," + a + ",") > -1) return 1;
} catch (d) {
return 0;
}
return 0;
},
isQuestionAnsweredCorrectly: function(a) {
return this.arrUserAnswers[a][5] == 2;
},
isQuestionAnswered: function(a) {
return typeof this.arrUserAnswers[a] != "undefined" ? dataTableQuestions[this.arrQuestionIds[a]].asw_type_1 == "1" ? this.arrUserAnswers[a][1] + this.arrUserAnswers[a][2] + this.arrUserAnswers[a][3] != 0 : this.arrUserAnswers[a][1] != 0 : !1;
},
getNumberOfUnansweredQuestions: function() {
var a = this.arrQuestionIds.length;
for (var b = 0; b < this.arrQuestionIds.length; b++) this.isQuestionAnswered(b) && a--;
return a;
},
addQuestionIdToArray: function(a) {
this.arrQuestionIds[this.arrQuestionIds.length] = a;
},
fillQuestionIdsFromString: function(a) {
typeof a == "string" || typeof a == "String" ? this.arrQuestionIds = a.split(",") : this.arrQuestionIds = a;
},
addQuestionIdsToQuestionsArray: function(a) {
this.arrQuestionIds = this.arrQuestionIds.concat(a);
},
initVideoQuestionStatus: function() {
this.arrVideoQuestionStatus = new Array;
for (var a = 0; a <= this.arrQuestionIds.length; a++) this.arrVideoQuestionStatus[a] = 0;
},
readVideoQuestionStatus: function(a) {
return this.arrVideoQuestionStatus[a];
},
resetVideoQuestionStatus: function(a) {
this.arrVideoQuestionStatus[a] = 0;
},
writeVideoQuestionStatus: function(a, b) {
this.arrVideoQuestionStatus[a] = b;
},
gotoNextQuestion: function() {
this.currentQuestionIndex < this.arrQuestionIds.length - 1 ? this.currentQuestionIndex++ : appCE.currentQuestionIndex = 0;
},
gotoPreviousQuestion: function() {
this.currentQuestionIndex > 0 && this.currentQuestionIndex--;
},
displayModeChanged: function() {},
switchAnswers: function(a, b, c) {
if (typeof dataTableQuestions[a]["asw_" + b] != "undefined" && typeof dataTableQuestions[a]["asw_" + c] != "undefined") {
var d, e, f, g, h;
try {
d = dataTableQuestions[a]["asw_" + b];
} catch (i) {}
try {
e = dataTableQuestions[a]["asw_type_" + b];
} catch (i) {}
try {
f = dataTableQuestions[a]["asw_corr" + b];
} catch (i) {}
try {
g = dataTableQuestions[a]["asw_hint_" + b];
} catch (i) {}
try {
h = dataTableQuestions[a]["asw_index_" + b];
} catch (i) {
log("e1 bei switchAnswers()");
}
try {
dataTableQuestions[a]["asw_" + b] = dataTableQuestions[a]["asw_" + c];
} catch (i) {
log("ea1 bei switchAnswers()");
}
try {
dataTableQuestions[a]["asw_type_" + b] = dataTableQuestions[a]["asw_type_" + c];
} catch (i) {}
try {
dataTableQuestions[a]["asw_corr" + b] = dataTableQuestions[a]["asw_corr" + c];
} catch (i) {}
try {
dataTableQuestions[a]["asw_hint_" + b] = dataTableQuestions[a]["asw_hint_" + c];
} catch (i) {}
try {
dataTableQuestions[a]["asw_index_" + b] = dataTableQuestions[a]["asw_index_" + c];
} catch (i) {
log("e2 bei switchAnswers()");
}
try {
dataTableQuestions[a]["asw_" + c] = d;
} catch (i) {
log("ea2 bei switchAnswers()");
}
try {
dataTableQuestions[a]["asw_type_" + c] = e;
} catch (i) {}
try {
dataTableQuestions[a]["asw_corr" + c] = f;
} catch (i) {}
try {
dataTableQuestions[a]["asw_hint_" + c] = g;
} catch (i) {}
try {
dataTableQuestions[a]["asw_index_" + c] = h;
} catch (i) {
log("e3 bei switchAnswers()");
}
}
},
shuffleAnswers: function() {
for (var a = 0; a < this.arrQuestionIds.length; a++) {
var b = this.arrQuestionIds[a];
if (dataTableQuestions[b].asw_type_1 == "1") {
var c = dataTableQuestions[b].asw_1;
if (c.indexOf("a)") == -1 && c.indexOf("1)") == -1) {
intRand = parseInt(Math.random() * 3, 10);
switch (intRand) {
case 0:
this.switchAnswers(b, 1, 2);
break;
case 1:
this.switchAnswers(b, 1, 3);
break;
case 2:
this.switchAnswers(b, 2, 3);
}
}
}
}
}
});

// Statistics.js

enyo.kind({
name: "Statistics",
kind: "Control",
classes: "",
events: {
onStatisticsUpdated: "",
onLockDisplay: "",
onUnlockDisplay: ""
},
published: {},
components: [ {
tag: "div",
name: "catTreeContainer",
style: "display:none",
components: []
} ],
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments);
},
forceStatisticsUpdate: !1,
updateStatisticDataIntoDatabase: function(a) {
typeof a != "undefined" ? this.forceStatisticsUpdate = a : this.forceStatisticsUpdate = !1;
try {
fsapp.displayIsLocked || (log("Execute: updateStatisticDataIntoDatabaseASYNC()"), enyo.job("jobUpdateStatisticValues", enyo.bind(this, "updateStatisticDataIntoDatabaseAsync"), 100));
} catch (b) {
log("Couldnt execute: updateStatisticDataIntoDatabase(): " + b.message), this.updateStatisticDataIntoDatabaseSync(a);
}
},
updateStatisticDataIntoDatabaseSync: function(a) {
this.doLockDisplay();
var b = appDB.getMostRecentlyAnsweredQuestionDate(), c = appDB.getLastStatisticsCacheUpdateDate();
if (a || b > c || b == "" && c == "") {
log("updating statistics cache");
try {
this.$.catTree.destroy();
} catch (d) {}
appConfig.userDb2selected ? this.$.catTreeContainer.createComponent({
kind: "categoryTree2",
name: "catTree",
onTreeTap: ""
}, {
owner: this
}) : this.$.catTreeContainer.createComponent({
kind: "categoryTree1",
name: "catTree",
onTreeTap: ""
}, {
owner: this
});
var e = this.$.catTree, f = dbTblQ.length - 1, g = [], h = e.getFirstLevelCategoryProperties(), i = [];
for (var j = 0; j < h.length; j++) i[j] = {}, i[j].total = 0, i[j].answeredtotal = 0, i[j].correct = 0, i[j].wrong = 0, i[j].new = 0;
var k = 0, l = 0, m = 0, n = 0, o = appConfig.appClassMofaId == appConfig.userClassSelectedId;
for (var p in dbTblQ) if (o && dbTblQ[p].basic_mofa == "1" || !o && dbTblQ[p].basic == "1" || dbTblQ[p].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1 && dbTblQ[p].number > "0.999999999") {
k++;
for (var j = 0; j < h.length; j++) {
var q = "," + h[j].id + "," + h[j].subcategoryids + ",", r = dbTblQ[p].category_id.split(","), s = r[1];
if (q.indexOf("," + s + ",") > -1) {
i[j].total = parseInt(i[j].total, 10) + 1;
try {
var t = appDB.readQuestionStatistics(p), u = "";
if (typeof t == "object") try {
u = t.answeredAll;
} catch (v) {}
u.length > 0 ? (m++, i[j].answeredtotal = parseInt(i[j].answeredtotal, 10) + 1, u.substr(0, 2) == "11" ? (l++, i[j].correct = parseInt(i[j].correct, 10) + 1) : u.substr(0, 1) == "0" && (n++, i[j].wrong = parseInt(i[j].wrong, 10) + 1)) : i[j].new = parseInt(i[j].new, 10) + 1;
} catch (d) {}
break;
}
}
}
var w = new Object;
w.firstLevelStatistics = i, w.firstLevelCategories = h, w.questionsInCurrentClass = k, w.questionsFitForTest = l, w.questionsAnswered = m, w.questionstWrongLastTime = n, appDB.setStatisticsCache(w), this.doUnlockDisplay(), appDB.setProgressStatistics(l / k * 100, m / k * 100, n / k * 100), this.doStatisticsUpdated();
} else this.doUnlockDisplay();
},
updateStatisticDataIntoDatabaseAsync: function() {
this.doLockDisplay();
var a = this.forceStatisticsUpdate, b = appDB.getMostRecentlyAnsweredQuestionDate(), c = appDB.getLastStatisticsCacheUpdateDate();
if (a || b > c || b == "" && c == "") {
log("updating statistics cache");
try {
this.$.catTree.destroy();
} catch (d) {}
appConfig.userDb2selected ? this.$.catTreeContainer.createComponent({
kind: "categoryTree2",
name: "catTree",
onTreeTap: ""
}, {
owner: this
}) : this.$.catTreeContainer.createComponent({
kind: "categoryTree1",
name: "catTree",
onTreeTap: ""
}, {
owner: this
});
var e = this.$.catTree, f = dbTblQ.length - 1, g = [], h = e.getFirstLevelCategoryProperties(), i = [];
for (var j = 0; j < h.length; j++) i[j] = {}, i[j].total = 0, i[j].answeredtotal = 0, i[j].correct = 0, i[j].wrong = 0, i[j].new = 0;
var k = 0, l = 0, m = 0, n = 0, o = appConfig.appClassMofaId == appConfig.userClassSelectedId;
for (var p in dbTblQ) if (o && dbTblQ[p].basic_mofa == "1" || !o && dbTblQ[p].basic == "1" || dbTblQ[p].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1 && dbTblQ[p].number > "0.999999999") {
k++;
for (var j = 0; j < h.length; j++) {
var q = "," + h[j].id + "," + h[j].subcategoryids + ",", r = dbTblQ[p].category_id.split(","), s = r[1];
if (q.indexOf("," + s + ",") > -1) {
i[j].total = parseInt(i[j].total, 10) + 1;
try {
var t = appDB.readQuestionStatistics(p), u = "";
if (typeof t == "object") try {
u = t.answeredAll;
} catch (v) {}
u.length > 0 ? (m++, i[j].answeredtotal = parseInt(i[j].answeredtotal, 10) + 1, u.substr(0, 2) == "11" ? (l++, i[j].correct = parseInt(i[j].correct, 10) + 1) : u.substr(0, 1) == "0" && (n++, i[j].wrong = parseInt(i[j].wrong, 10) + 1)) : i[j].new = parseInt(i[j].new, 10) + 1;
} catch (d) {}
break;
}
}
}
var w = new Object;
w.firstLevelStatistics = i, w.firstLevelCategories = h, w.questionsInCurrentClass = k, w.questionsFitForTest = l, w.questionsAnswered = m, w.questionstWrongLastTime = n, appDB.setStatisticsCache(w), this.doUnlockDisplay(), appDB.setProgressStatistics(l / k * 100, m / k * 100, n / k * 100);
if (appConfig.appUseOpenApiProcess && appConfig.appUpdateProgressOnServer && appConfig.userUnlockedApp) try {
if (appDB.hasNetworkConnection()) {
log("Starting progress transfer...");
if (!appConfig.userDb2selected) var x = getDb1ValidBeforeDate() + "T00:00:00.000Z", y = getDb1ValidFromDate(), z = getDb1ValidBeforeDate(); else var x = getDb2ValidBeforeDate() + "T00:00:00.000Z", y = getDb2ValidFromDate(), z = getDb2ValidBeforeDate();
var A = {
passed: l / k * 100,
not_passed: m / k * 100,
failed: n / k * 100,
classname: dbTableClasses[appConfig.userClassSelectedId].name,
catalog_valid_from: y,
catalog_valid_before: z
}, B = "";
try {
var C = appDB.getItem("apiLoginData");
B = C.token;
} catch (d) {
log("ERROR: no auth token found!");
}
var D = JSON.stringify(A), E = new enyo.Ajax({
url: appConfig.appOpenApiUrl + "/progress",
method: "POST",
contentType: "application/json",
headers: {
Authorization: "Bearer " + B
}
});
E.response(this, "processApiProgressResponse"), E.error(this, "processApiProgressError"), E.go(D), appConfig.appUpdateProgressOnServer = !1;
}
} catch (d) {
log("ERROR: transfer progress: " + d.message);
}
this.doStatisticsUpdated();
} else this.doUnlockDisplay();
},
processApiProgressResponse: function() {
appConfig.appUpdateProgressOnServer = !1;
},
processApiProgressError: function() {}
});

// Views.js

var uiAppMainView = [ {
kind: "Signals",
ondeviceready: "deviceReady",
onbackbutton: "androidBackButton"
}, {
tag: "div",
classes: "appCorner1"
}, {
tag: "div",
classes: "appCorner2"
}, {
tag: "div",
classes: "appCorner3"
}, {
tag: "div",
classes: "appCorner4"
}, {
tag: "div",
name: "displayLock",
style: "position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:99999;",
components: [ {
tag: "div",
content: "Datenbank wird aktualisiert<br /><img src='assets/loader.gif' alt='' />",
allowHtml: !0,
style: "color:#fff;font-weight:bold;position:absolute;top:45%;left:0;right:0;text-align:center;"
} ]
}, {
tag: "div",
name: "displayAdLocker",
style: "position:absolute;top:0;left:0;right:0;bottom:0;z-index:99999;",
content: "",
allowHtml: !0
}, {
tag: "div",
name: "displayAdContainer",
id: "t24displayAdContainer",
style: "position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(255,255,255,1);z-index:99998;",
ontap: "displayIntroSlideshow",
content: "",
allowHtml: !0
}, {
tag: "div",
name: "PageScrim",
id: "pagemenuscrim",
classes: "scrimpagemenu",
style: "",
ontap: "hideShortcutMenu"
}, {
tag: "div",
name: "appPurchaseScrim",
classes: "scrimpagemenu",
style: "z-index:999998",
ontap: "hidePurchaseSelector"
}, {
kind: "appPurchaseSelector",
name: "appPurchaseSelector",
style: "z-index:999999",
onIapSelectTap: "tapSelectPurchaseIAP",
onProSelectTap: "tapSelectPurchasePRO",
onGoldSelectTap: "tapSelectPurchaseGOLD",
onRestoreSelectTap: "tapSelectPurchaseRestore"
}, {
kind: "PageMenu",
name: "PageMenu",
id: "pagemenu",
classes: "pagemenu",
onMenuCloseTap: "hideShortcutMenu",
onMenuItemTap: "processShortcutMenuTap"
}, {
kind: "Panels",
name: "pagePanels",
style: "display:none;",
fit: !0,
realtimeFit: !0,
classes: "panels enyo-unselectable",
arrangerKind: "CardArranger",
edgeDragging: !1,
components: [ {
kind: "WelcomePage",
name: "WelcomePage",
styles: "",
onBackButtonTap: "showHomeScreen",
onMenuButtonTap: "showShortcutMenu",
onInAppPurchase: "preInAppPurchaseAndroid",
onDelInAppPurchase: "deleteInAppPurchaseAndroid",
onHandsOnRouteButtonTap: "openHandsOnRoutePage",
onHandsOnTopicButtonTap: "openHandsOnRoutePage",
onHandsOnSimulationButtonTap: "openHandsOnRoutePage",
onRateButtonTap: "openUserAppRating",
onQuickstartButtonTap: "openQuickstartPage",
onQuickstartWrongAnswersButtonTap: "openQuickstartWrongAnswersPage",
onSchoolFinderButtonTap: "openSchoolFinderPage",
onChapterButtonTap: "openChapterPage",
onFocusChapterButtonTap: "openFocusChapterPage",
onSetButtonTap: "openSetPage",
onSimulationButtonTap: "openSimulationPage",
onMarkedButtonTap: "openMarkedPage",
onSearchButtonTap: "openSearchPage",
onStatisticsButtonTap: "openStatisticsPage",
onClassButtonTap: "openSettingsPage",
onHelpButtonTap: "openHelpPage",
onUnlockAppTap: "openLoginPage",
onLockAppButtonTap: "lockApp",
onGraphicsTap: "openStatisticsOrBGLink",
onSyncButtonTap: "syncAppCheckConnection",
onProfileButtonTap: "openProfilePage"
}, {
kind: "ChapterPage",
name: "ChapterPage",
styles: "",
onBackButtonTap: "showChapterPreviousPage",
onMainButtonTap: "showHomeScreenTraining",
onMenuButtonTap: "showShortcutMenu",
onReadButtonTap: "readChapter",
onPracticeButtonTap: "practiseChapter",
onClassButtonTap: "openSettingsPage",
onHelpButtonTap: "openHelpPage"
}, {
kind: "SetPage",
name: "SetPage",
styles: "",
onBackButtonTap: "openMainPage",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onReadButtonTap: "readSet",
onPracticeButtonTap: "practiseSet",
onTestButtonTap: "testSet",
onClassButtonTap: "openSettingsPage",
onHelpButtonTap: "openHelpPage"
}, {
kind: "StatisticsPage",
name: "StatisticsPage",
styles: "",
onBackButtonTap: "showHomeScreen",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onClassButtonTap: "openSettingsPage",
onGotoChapter: "displayChapter",
onHelpButtonTap: "openHelpPage"
}, {
kind: "SettingsPage",
name: "SettingsPage",
styles: "",
onBackButtonTap: "openMainPageIfNotSetupWizard",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onNextSetupWizardButtonTap: "openSetupWizard",
onLockAppButtonTap: "lockApp",
onSyncCompleted: "updateSyncButton",
onSyncButtonTap: "syncAppCheckConnection",
onHelpButtonTap: "openHelpPage"
}, {
kind: "HelpPage",
name: "HelpPage",
onBackButtonTap: "showHomeScreen",
onMainButtonTap: "openMainPage",
onClassButtonTap: "openSettingsPage"
}, {
kind: "TestingPage",
name: "TestingPage",
onBackButtonTap: "openPreTestingPage",
onFullscreenImageTap: "openFullscreenImagePage",
onFullscreenVideoTap: "openFullscreenVideoPage"
}, {
kind: "FullscreenImagePage",
name: "FullscreenImagePage",
onBackButtonTap: "openTestingPage"
}, {
kind: "MarkedPage",
name: "MarkedPage",
styles: "",
onBackButtonTap: "openMainPage",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onReadButtonTap: "readChapter",
onPracticeButtonTap: "practiseChapter",
onClassButtonTap: "openSettingsPage",
onHelpButtonTap: "openHelpPage"
}, {
kind: "ProfilePage",
name: "ProfilePage",
styles: "",
onBackButtonTap: "showHomeScreen",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onClassButtonTap: "openSettingsClassPage",
onVideoButtonTap: "openSettingsVideoPage",
onDateButtonTap: "openSettingsDatePage",
onHelpButtonTap: "openHelpPage"
}, {
tag: "div",
name: "SplashScreen",
style: "position:relative",
content: "",
ontap: "openMainPage",
allowHtml: !0
}, {
kind: "QuickstartPage",
name: "QuickstartPage"
}, {
kind: "FullscreenVideoPage",
name: "FullscreenVideoPage",
onBackButtonTap: "openTestingPageFromVideo"
}, {
kind: "LoginPage",
name: "LoginPage",
styles: "",
onBackButtonTap: "showHomeScreen",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onUnlockButtonTap: "unlockApp",
onHelpButtonTap: "openHelpPage"
}, {
kind: "RoutePage",
name: "RoutePage",
styles: "",
onBackButtonTap: "showHomeScreen",
onMenuButtonTap: "showShortcutMenu",
onMainButtonTap: "openMainPage",
onReadRouteButtonTap: "readRoute",
onPracticeRouteButtonTap: "practiseRoute",
onHelpButtonTap: "openHelpPage"
} ]
}, {
kind: "enyo.Signals",
onbeforeunload: "catchUnload"
}, {
kind: "Statistics",
name: "Statistics",
onLockDisplay: "lockDisplay",
onUnlockDisplay: "unlockDisplay",
onStatisticsUpdated: "updateStatistics"
}, {
kind: "appCoreAudio",
name: "coreAudio",
onAudioEnded: "processAudioEnded"
} ], uiIntroPageView = [ {
kind: "PageHeader",
style: "z-index:9999;position:absolute;width:100%",
name: "PageHeader",
alwaysHideIcon: !0,
maintitleicon: "",
maintitle: "",
separator: "",
subtitle: ""
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea",
style: "bottom:0;height:100%;",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
fit: !0,
style: "background-color:#ffcc00;height:100%;bottom:0;",
components: [ {
tag: "div",
style: "margin:0 auto 0 auto;width:60%;max-width:400px;height:15%;max-height:100px;min-height:50px;background-image:url(assets/imgADACLogo.png);background-size:contain;background-repeat:no-repeat;background-position:center;"
}, {
tag: "div",
content: appConfig.msgIntroPageWelcome,
style: "text-align:center; width:80%; margin:40px auto 40px auto;",
allowHtml: !0
}, {
tag: "div",
content: appConfig.msgIntroPageClaim,
style: "text-align:center; width:80%; margin:40px auto 40px auto;",
allowHtml: !0
}, {
tag: "div",
style: "position:absolute;left:0;right:0;bottom:0;height:35%;min-height:100px;background-color:#ffcc00;",
components: [ {
kind: "onyx.Button",
name: "btnLogin",
content: "Login f\u00fcr Mitglieder",
style: "background-color:#fff;color:000;",
classes: "onyx-blue bigroundbutton",
ontap: "doUnlockAppTap"
}, {
kind: "onyx.Button",
name: "btnRegister",
content: "Jetzt Mitglied werden",
style: "background-color:#fff;color:000;",
classes: "onyx-blue bigroundbutton",
ontap: "openRegisterLink"
} ]
} ]
} ]
} ], uiWelcomePageView = [ {
kind: "PageHeader",
name: "PageHeader",
style: "z-index:9999;position:absolute;width:100%",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleMain
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea",
style: "top:0;bottom:0 !important;",
allowHtml: !0,
components: [ {
tag: "img",
name: "imgBGDecoration",
classes: "imgbgdecoration",
src: "assets/imgBGDecoration.png",
style: "opacity:0.6;position:absolute;bottom:0;right:0;"
}, {
kind: "enyo.Scroller",
fit: !0,
style: "height:100%;opacity:1;",
components: [ {
tag: "img",
name: "contextHelpIconSmall",
id: "contextHelpIconSmall",
src: "assets/icoContextHelp.png",
style: "display:none"
}, {
tag: "div",
name: "GraphContainer2",
style: "margin-left:20px;margin-right:20px;overflow:hidden;min-width:150px;min-height:100px;",
classes: "mainGraphContainer2",
ontap: "doGraphicsTap",
allowHtml: !0
}, {
tag: "div",
name: "GraphContainer",
onresize: "updateChart",
style: "margin-left:20px;margin-right:20px;overflow:hidden;",
classes: "mainGraphContainer",
ontap: "doGraphicsTap",
allowHtml: !0,
components: [ {
tag: "img",
name: "BackgroundImage",
id: "MainBackgroundImage",
allowHtml: !0,
classes: "wp_BackgroundImage",
ontap: "doGraphicsTap"
} ]
}, {
tag: "div",
name: "phoneGraphContainer",
classes: "phonegraphcontainer pgca",
ontap: "doGraphicsTap",
allowHtml: !0,
style: "display:none;background-repeat:no-repeat;background-position:center center;background-size:contain;position:absolute;left:10px;right:10px;",
components: [ {
tag: "div",
classes: "phonegraphbarcontainer",
style: "",
components: [ {
tag: "div",
style: "left:0;width:12px;background-color:#fa3b2a;"
}, {
tag: "div",
classes: "",
style: "margin-left:16px;position:relative;padding-right:16px;",
components: [ {
tag: "div",
name: "phoneGraphRedBar",
style: "left:0;background-color:#fa3b2a;"
} ]
} ]
}, {
tag: "div",
classes: "phonegraphbarcontainer",
style: "",
components: [ {
tag: "div",
style: "left:0;width:12px;background-color:#fdc619;"
}, {
tag: "div",
classes: "",
style: "margin-left:16px;position:relative;padding-right:16px;",
components: [ {
tag: "div",
name: "phoneGraphOrangeBar",
style: "left:0;background-color:#fdc619;"
} ]
} ]
}, {
tag: "div",
classes: "phonegraphbarcontainer",
style: "",
components: [ {
tag: "div",
style: "left:0;width:12px;background-color:#83bc41;"
}, {
tag: "div",
classes: "",
style: "margin-left:16px;position:relative;padding-right:16px;",
components: [ {
tag: "div",
name: "phoneGraphGreenBar",
style: "left:0;background-color:#83bc41;"
} ]
} ]
} ]
}, {
tag: "div",
name: "phoneGraphContainerInfoButton",
classes: "phonegraphcontainer pgci",
content: "",
style: "display:none;position:absolute;right:10px;width:0;"
}, {
tag: "img",
name: "LogoImage",
classes: "wp_LogoImage",
src: appConfig.imgMainPageLogo,
ontap: "openLogoPage"
}, {
kind: "dynamicMenu",
name: "mainDynamicMenu",
classes: "menubuttons gradientblock",
id: "MainMenuContainer",
style: "z-index:9999;padding-bottom:0;border:none;"
} ]
} ]
} ], uiChapterPageView = [ {
kind: "filterQuestionSelector",
name: "filterQuestionSelector",
onModeAllTap: "tapSelectAll",
onModeMarkedTap: "tapSelectMarked",
onModeFitTap: "tapSelectGreen",
onModeNeverTap: "tapSelectNever",
onModeUnfitTap: "tapSelectGrey",
onModeImageTap: "tapSelectImage",
onModeVideoTap: "tapSelectVideo",
onMode5PTap: "tapSelect5P",
onModeLastViewedTap: "tapSelectLastViewedQuestion"
}, {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
style: "z-index:9999",
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleByChapter,
onBackButtonTap: "",
onClassButtonTap: ""
}, {
tag: "div",
name: "questionListSpinnerContainer",
classes: "questionListSpinnerContainer",
components: [ {
kind: "onyx.Spinner",
name: "questionListSpinner",
classes: "onyx-light"
} ]
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea cp_clientarea",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
name: "catTreeScroller",
classes: "cp_leftgroup",
fit: !0,
style: "font-size:16px; padding-left:20px; margin-right:8px; padding-right:8px; float:left; width:40%; height:100%;overflow:auto;",
components: []
}, {
tag: "div",
name: "questionSelectionScroller",
classes: "cp_rightgroup delmarginonphone",
style: "width:55%; height:100%;margin-right:8px; position:absolute;right:0;",
components: [ {
tag: "div",
name: "questionSelection1",
style: "margin-bottom:6px;position:relative;",
components: [ {
kind: "onyx.Button",
name: "t24selbtn3",
classes: "onyx-blue btnclientarea",
style: "",
ontap: "tapSelectReverse",
components: [ {
tag: "span",
content: "<i class='material-icons' style='font-size:1em !important'>bl_iso</i>",
allowHtml: !0,
style: "width:24px;"
} ]
}, {
kind: "onyx.Button",
name: "t24selbtn1",
classes: "onyx-blue btnclientarea",
ontap: "showFilterSelectBox",
style: "min-width:185px;text-align:left",
components: [ {
tag: "span",
content: "<i class='material-icons' style='font-size:1em !important'>ol_filter_list</i> ",
allowHtml: !0,
style: "margin-right:8px;"
}, {
tag: "span",
content: "Kein Filter",
name: "t24selbtn1caption",
style: ""
} ]
}, {
kind: "onyx.Button",
name: "t24selbtnLVX",
classes: "onyx-blue btnclientarea",
style: "",
ontap: "tapRemoveLastViewedFilter",
components: [ {
tag: "span",
content: "<i class='material-icons' style='font-size:1em !important'>ol_backspace</i>",
allowHtml: !0,
style: ""
} ]
}, {
tag: "div",
style: "float:right;margin-top:8px;",
ontap: "displayStatisticsInfo",
components: [ {
tag: "span",
name: "t24selQuestionAmount",
classes: "t24lblqamount",
style: "font-size:125%;",
content: "0",
allowHtml: !0
}, {
tag: "i",
classes: "material-icons icon-contexthelp",
content: "ol_info",
allowHtml: !0,
style: "position:relative;top:-4px;"
} ]
} ]
}, {
tag: "div",
style: "clear:both"
}, {
kind: "enyo.Scroller",
name: "questionListScroller",
classes: "gradientblock delmarginonphone",
fit: !0,
style: "position:absolute;top:56px;bottom:16px;right:0;left:0;width:auto;",
ontap: "scrollQListToTop",
components: [ {
kind: "QuestionList",
name: "questionList",
style: "height:100%;",
questionListPage: 0,
allowHtml: !0,
onCheckmarkChanged: "updateSelectedQuestionDisplay"
} ]
} ]
} ]
}, {
tag: "div",
name: "divPhoneSwitchToQuestions",
classes: "pagefooter",
style: "position:absolute;bottom:0;left:0;right:0; z-index:99999; background-color:#fff;",
components: [ {
kind: "onyx.Button",
name: "btnBackHome",
content: appConfig.msgCancelApply,
allowHtml: !0,
classes: "onyx-negative btnfooter",
ontap: "doMainButtonTap",
style: ""
}, {
kind: "onyx.Button",
name: "btnPhoneSwitchToQuestions",
content: appConfig.msgBtnSelect,
allowHtml: !0,
classes: "onyx-blue btnfooter",
ontap: "switchToQuestionList",
style: "margin-right:0;float:right;background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor + ";"
}, {
tag: "span",
name: "lblQuestionInTopicDisplay",
content: "",
allowHtml: !0,
style: "float:right;vertical-align:middle;margin-right:20px;position:relative;top:7px;font-size:80%;"
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onReadButtonTap: "readSelectedQuestions",
onPracticeButtonTap: "practiceSelectedQuestions",
onBackButtonTap: ""
} ], uiMarkedAndSearchPageView = [ {
kind: "filterQuestionSelector",
name: "filterQuestionSelector",
onModeAllTap: "tapSelectAll",
onModeMarkedTap: "tapSelectMarked",
onModeFitTap: "tapSelectGreen",
onModeNeverTap: "tapSelectNever",
onModeUnfitTap: "tapSelectGrey",
onModeImageTap: "tapSelectImage",
onModeVideoTap: "tapSelectVideo",
onMode5PTap: "tapSelect5P"
}, {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleByMarked,
onBackButtonTap: "doMainButtonTap",
onClassButtonTap: "doClassButtonTap"
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea",
allowHtml: !0,
components: [ {
tag: "div",
style: "height:98.5%; margin:0 8px 0 16px;",
components: [ {
tag: "div",
name: "questionSearchContainer",
style: "",
classes: "questionSearchTextfield",
components: [ {
kind: "onyx.InputDecorator",
name: "inputSearchwordDecorator",
style: "border:none;border-radius:4px;display:block;left:0;top:4px;padding-right:50px;background-color:#fff; position:relative;",
components: [ {
kind: "onyx.Input",
name: "inputSearchword",
unselectable: !1,
placeholder: "",
style: "width:100%;",
onkeydown: "updateSearchwordXButton",
onkeyup: "updateSearchwordXButtonAndResultlist"
}, {
tag: "div",
name: "inputSearchwordX",
content: "<i class='material-icons md-dark' style='font-size:1em !important'>ol_backspace</i>",
allowHtml: !0,
style: "position:absolute;top:8px;right:8px;cursor:pointer;width:20px;height:20px;",
ontap: "emptySearchword"
} ]
}, {
tag: "div",
style: "position:absolute;top:6px;right:10px;",
ontap: "displayStatisticsInfo",
components: [ {
tag: "span",
name: "t24selQuestionAmountSearch",
classes: "",
style: "font-size:125%;",
content: "0",
allowHtml: !0
}, {
tag: "i",
classes: "material-icons icon-contexthelp",
content: "ol_info",
allowHtml: !0,
style: "position:relative;top:-4px;"
} ]
} ]
}, {
tag: "div",
name: "questionSelectionContainer",
style: "display:none;margin-bottom:6px;height:44px;position:absolute;right:8px;left:16px;",
components: [ {
kind: "onyx.Button",
name: "t24selbtn3",
classes: "onyx-blue btnclientarea",
style: "",
ontap: "tapSelectReverse",
components: [ {
tag: "span",
content: "<i class='material-icons' style='font-size:1em !important'>bl_iso</i>",
allowHtml: !0,
style: "width:24px;"
} ]
}, {
kind: "onyx.Button",
name: "t24selbtn1",
classes: "onyx-blue btnclientarea",
ontap: "showFilterSelectBox",
style: "min-width:185px;text-align:left",
components: [ {
tag: "span",
content: "<i class='material-icons' style='font-size:1em !important'>ol_filter_list</i> ",
allowHtml: !0,
style: "margin-right:8px;"
}, {
tag: "span",
content: "Kein Filter",
name: "t24selbtn1caption",
style: ""
} ]
}, {
kind: "onyx.Button",
name: "t24emptylistbtn",
classes: "onyx-blue btnclientarea",
ontap: "tapUnmarkAll",
style: "margin-left:8px;",
components: [ {
tag: "span",
content: "<i class='material-icons' style='font-size:1em !important'>ol_delete_outline</i>",
allowHtml: !0
}, {
tag: "span",
name: "btnClearList",
classes: "loreshide",
content: appConfig.btnClearList,
allowHtml: !0
} ]
}, {
tag: "div",
style: "float:right;margin-top:8px;height:1.5em;overflow-y:hidden;",
ontap: "displayStatisticsInfo",
components: [ {
tag: "span",
name: "t24selQuestionAmount",
classes: "t24lblqamount",
style: "font-size:125%;",
content: "0",
allowHtml: !0
}, {
tag: "i",
classes: "material-icons icon-contexthelp",
content: "ol_info",
allowHtml: !0,
style: "position:relative;top:-4px;"
} ]
} ]
}, {
tag: "div",
style: "clear:both"
}, {
kind: "enyo.Scroller",
name: "questionListScroller",
classes: "gradientblock delmarginonphone",
fit: !0,
style: "position:absolute;top:56px;bottom:16px;right:8px;left:16px;width:auto;",
ontap: "scrollQListToTop",
components: [ {
kind: "QuestionList",
name: "questionList",
style: "height:100%;",
onCheckmarkChanged: "updateSelectedQuestionDisplay",
questionListPage: 1,
allowHtml: !0
} ]
} ]
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onReadButtonTap: "readSelectedQuestions",
onPracticeButtonTap: "practiceSelectedQuestions",
onBackButtonTap: "doMainButtonTap"
} ], uiSetPageView = [ {
kind: "PageHeader",
style: "z-index:9999;position:absolute;width:100%",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleBySet,
onBackButtonTap: "doMainButtonTap",
onClassButtonTap: "doClassButtonTap"
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
fit: !0,
style: "height:100%;",
components: [ {
tag: "div",
name: "setValidUntilInfo",
content: "",
style: "text-align:center; width:80%; margin:20px auto 0 auto;",
allowHtml: !0,
ontap: "showContextHelp"
}, {
tag: "div",
name: "showSetButtons",
style: "margin:12px 0 12px 0;text-align:center;",
components: [ {
kind: "onyx.Button",
name: "btnShowSetGroup1",
content: "1",
style: "background-color:#666;color: " + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "showSetGroupByDate"
}, {
kind: "onyx.Button",
name: "btnShowSetGroup2",
content: "2",
style: "background-color:#666;color: " + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "showSetGroupByDate"
} ]
}, {
kind: "Group",
classes: "group sp_setgroupcontainer gradientblock",
style: "font-size:16px;padding:8px;",
name: "chkGroup",
onActivate: "groupActivated",
highlander: !0,
components: []
}, {
tag: "div",
style: "clear:both"
}, {
tag: "div",
name: "SelectedDisplay",
content: appConfig.msgNoSetSelectedPhrase,
style: "text-align:center; width:80%; margin:20px auto 20px auto;",
allowHtml: !0
} ]
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap"
} ], uiSettingsPageView = [ {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleSettings,
onBackButtonTap: "applyNewClass"
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea sp_clientarea",
style: "overflow:hidden",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
fit: !0,
style: "height:100%;",
components: [ {
tag: "div",
classes: "sp_leftgroup",
style: "float:left; overflow-y:auto; overflow-x:hidden; width:40%;height:100%",
components: [ {
tag: "div",
name: "loginfields",
classes: "group gradientblock sp_chkgroup",
style: "margin:16px 0 16px 16px;padding:16px 10px 0 10px;",
components: [ {
tag: "div",
style: "font-size:16px;float:none;width:100% !important;margin:0 8px 8px 0;",
classes: "classcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkLoginRegister",
checked: !1,
onchange: "updateLoginRegisterButton"
}, {
tag: "span",
name: "lblLoginRegisterSel",
content: appConfig.msgBackupAccountAlreadyRegistered,
allowHtml: !0
} ]
}, {
kind: "onyx.InputDecorator",
style: "display:block; margin-bottom:8px; background-color:#fff; position:relative;",
components: [ {
kind: "onyx.Input",
name: "inputUserLastname",
placeholder: appConfig.msgLoginLastnameWord,
style: "width:100%;text-align:center;z-index:99999",
onkeyupX: "updateEmptyButtons"
} ]
}, {
kind: "onyx.InputDecorator",
style: "display:block; margin-bottom:8px; background-color:#fff; position:relative;",
components: [ {
kind: "onyx.Input",
name: "inputUserMembershipNumber",
placeholder: appConfig.msgLoginMembershipnumberWord,
type: "password",
style: "width:100%;text-align:center;z-index:99999",
onkeyupX: "updateEmptyButtons"
}, {
tag: "div",
name: "btnTogglePasswordVisibility",
"class": "btnTogglePasswordVisibility",
content: "<i class='material-icons'>ol_visibility_off</i>",
allowHtml: !0,
style: "z-index:9999999;position:absolute;right:10px;top:10px;color:#999;cursor:pointer;opacity:0.7;font-size:90%;width:20px;height:20px;",
ontap: "togglePasswordVisibility"
} ]
}, {
tag: "div",
name: "lblPasswordConditions",
content: appConfig.msgPasswordConditions,
classes: "classdescription",
style: "padding:8px;",
allowHtml: !0
}, {
kind: "onyx.Button",
name: "btnRegisterUserAccount",
content: appConfig.msgRegisterWord,
classes: "onyx-blue btnfooter",
style: "margin:16px auto 8px auto;display:block;padding:7px 32px 7px 32px;background-color: " + appConfig.btnBgColor + ";color: " + appConfig.btnFGColor,
ontap: "registerLogin"
} ]
}, {
name: "chkGroup",
classes: "group sp_chkgroup1",
style: "margin:16px 0 16px 16px",
onSelected: "classButtonSelected",
components: []
}, {
kind: "Group",
name: "chkGroupExtClasses",
classes: "group sp_chkgroup",
style: "margin:16px 0 16px 16px;",
onActivate: "groupExtClassActivated",
highlander: !1,
components: [ {
tag: "div",
style: "font-size:16px;float:none;width:100% !important;margin:8px 8px 8px 0;",
classes: "classcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkExtClass",
checked: !1
}, {
tag: "span",
name: "lblExtClassSel",
content: appConfig.msgSelectExtClasses,
allowHtml: !0
} ]
} ]
}, {
kind: "Group",
name: "chkLanguagesApp",
classes: "group gradientblock sp_chkgroup1",
style: "margin:16px 0 16px 16px",
onActivate: "groupLangAppActivated",
highlander: !0,
components: []
}, {
kind: "Group",
name: "chkLanguages",
classes: "group gradientblock sp_chkgroup1",
style: "margin:16px 0 16px 16px",
onActivate: "groupLangActivated",
highlander: !0,
components: []
}, {
kind: "Group",
name: "chkGroupDB",
classes: "group gradientblock sp_chkgroup",
style: "margin:16px 0 16px 16px;",
onActivate: "groupDBActivated",
highlander: !0,
components: [ {
tag: "div",
style: "font-size:16px;float:none;width:100% !important;margin:8px;",
classes: "classcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkDB1",
checked: !appConfig.userDb2selected,
onActivate: "updateQuestionCount"
}, {
tag: "span",
name: "lblDBSel",
content: appConfig.msgSettingsDBSwitchBefore + appConfig.db2ValidFromDate,
allowHtml: !0
} ]
}, {
tag: "div",
style: "font-size:16px;float:none;width:100% !important;margin:8px;",
classes: "classcheckbox",
ontap: "updateQuestionCount",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkDB2",
checked: appConfig.userDb2selected,
onActivate: "updateQuestionCount"
}, {
tag: "span",
name: "lblDBSel2",
content: appConfig.msgSettingsDBSwitchAfter + appConfig.db2ValidFromDate,
allowHtml: !0
} ]
} ]
}, {
kind: "Group",
name: "chkGroupAdd",
classes: "group gradientblock sp_chkgroup2",
style: "margin:16px 0 16px 16px;padding:8px;",
onActivate: "groupAddActivated",
highlander: !1,
components: [ {
tag: "div",
style: "font-size:16px;float:none;width:100% !important",
classes: "classcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkAutoSync",
checked: !0
}, {
tag: "span",
name: "lblAutoSync",
content: appConfig.msgSettingsSyncSwitchHeadline,
allowHtml: !0
} ]
}, {
tag: "div",
style: "height:1px; border-bottom:1px solid #bbb; margin:4px 0 8px 0;"
}, {
kind: "onyx.Button",
name: "btnSyncNow",
style: "width:100%;",
content: appConfig.btnCaptionSync,
allowHtml: !0,
classes: "onyx-negative",
ontap: "doSyncButtonTap"
}, {
tag: "div",
name: "lblAdditionalInfo",
allowHtml: !0,
style: "margin-top:16px;font-size:16px;",
content: "",
ontap: "displayHiddenPassword"
}, {
kind: "onyx.Button",
name: "btnDeleteAccount",
style: "width:100%;margin-top:32px;",
content: appConfig.msgButtonDeleteAccount,
allowHtml: !0,
classes: "onyx-blue",
ontap: "deleteBackupAccount"
} ]
}, {
kind: "Group",
name: "chkGroupDownloadVideos",
classes: "group gradientblock sp_chkgroup",
style: "margin:16px 0 16px 16px;padding:8px;",
components: [ {
tag: "div",
style: "font-size:16px;float:none;width:100% !important;",
classes: "classcheckbox",
components: [ {
kind: "onyx.Button",
name: "downloadVideosButton",
style: "width:100%;",
allowHtml: !0,
content: appConfig.btnCaptionDownloadVideos,
classes: "onyx-negative",
ontap: "downloadAllVideos"
}, {
kind: "onyx.Button",
name: "removeVideosButton",
style: "width:100%;margin-top:4px;background-color: " + appConfig.btnBgColorMainMenu + ";color: " + appConfig.btnFGColor,
content: appConfig.btnCaptionRemoveVideos,
classes: "onyx-blue",
ontap: "deleteAllVideos"
} ]
}, {
tag: "div",
style: "font-size:16px;float:none;width:100% !important;margin-top:16px;",
classes: "classcheckbox",
components: [ {
kind: "onyx.Button",
name: "downloadAudiosButton",
style: "width:100%;",
allowHtml: !0,
content: appConfig.btnCaptionDownloadAudios,
classes: "onyx-negative",
ontap: "downloadAllAudios"
}, {
kind: "onyx.Button",
name: "removeAudiosButton",
style: "width:100%;margin-top:4px;background-color: " + appConfig.btnBgColorMainMenu + ";color: " + appConfig.btnFGColor,
content: appConfig.btnCaptionRemoveAudios,
classes: "onyx-blue",
ontap: "deleteAllAudios"
} ]
} ]
}, {
kind: "Group",
name: "chkGroupGeneral",
classes: "group gradientblock sp_chkgroup",
onActivate: "groupGeneralActivated",
style: "margin:16px 0 16px 16px;padding:8px;",
highlander: !1,
components: [ {
tag: "div",
style: "font-size:16px;float:none;width:100% !important",
classes: "classcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkVibrateOnWrongAnswer",
checked: appConfig.appVibrateOnWrongAnswer
}, {
tag: "span",
name: "lblVibrateOnWrongAnswer",
content: appConfig.msgVibrateOnWrongAnswer,
allowHtml: !0
}, {
tag: "div",
style: "margin-bottom:8px;"
}, {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkDisplayExplanationOnWrongAnswer",
checked: appConfig.appDisplayExplanationOnWrongAnswer
}, {
tag: "span",
name: "lblDisplayExplanationOnWrongAnswer",
content: appConfig.msgExplanationOnWrongAnswer,
allowHtml: !0
}, {
tag: "div",
style: "margin-bottom:8px;"
}, {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkAllowVoiceOver",
checked: appConfig.appEnableQuestionVoiceOver
}, {
tag: "span",
name: "lblDisplayHintOnVoiceOver",
content: appConfig.msgHintOnVoiceOver,
allowHtml: !0
}, {
tag: "div",
style: "margin-bottom:8px;"
}, {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkDisplayHintOnQuickstartLastErrors",
checked: appConfig.appDisplayIntroMessageOnQuickstartEtc
}, {
tag: "span",
name: "lblDisplayHintOnQuickstartLastErrors",
content: appConfig.msgHintOnQuickstartLastErrors,
allowHtml: !0
}, {
tag: "div",
style: "margin-bottom:8px;"
}, {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkDarkModeActive",
checked: appConfig.appDarkModeActive
}, {
tag: "span",
name: "lblDarkModeActive",
content: appConfig.msgDarkModeActive,
allowHtml: !0
} ]
} ]
}, {
tag: "div",
name: "faqHelpLink",
style: "",
classes: "faqHelpLink",
content: appConfig.btnOpenHelpFAQs,
allowHtml: !0,
ontap: "openHelpTopic"
} ]
}, {
kind: "enyo.Scroller",
classes: "sp_rightgroup",
fit: !0,
style: "float:right;width:60%;height:100%; overflow-y:auto;",
components: [ {
tag: "div",
name: "ClassDetails",
classes: "classdetails",
style: "padding-left:16px;",
content: "",
allowHtml: !0
} ]
} ]
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap",
onApplyButtonTap: "applyNewClass",
onNextSetupWizardButtonTap: "applyNewClass"
} ], uiStatisticsPageView = [ {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleStatistics,
onBackButtonTap: "doMainButtonTap",
onClassButtonTap: "doClassButtonTap"
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
fit: !0,
style: "height:100%;text-align:center",
components: [ {
tag: "div",
name: "statisticsdata1",
classes: "t24statisticsoverview",
style: "width:100%;margin:20px auto 40px auto;",
allowHtml: !0,
ontap: "displayFitForTestExplanation"
}, {
tag: "div",
name: "statisticsprogress1",
classes: "t24statisticsoverview",
style: "width:100%;margin:20px auto 40px auto;",
allowHtml: !0,
ontap: "displayProgressChartExplanation"
}, {
tag: "div",
name: "statisticsheaderbasic",
classes: "t24statisticsheader",
style: "",
allowHtml: !0,
content: "<h2>Grundstoff</h2>"
}, {
tag: "div",
name: "statisticsgraphicsbasic",
style: "width:80%; padding:10px; margin: 0 auto;",
allowHtml: !0
}, {
tag: "div",
name: "statisticsheaderextended",
classes: "t24statisticsheader",
style: "",
allowHtml: !0,
content: "<h2>Zusatzstoff</h2>"
}, {
tag: "div",
name: "statisticsgraphicsextended",
style: "width:80%; padding:10px; margin: 0 auto;",
allowHtml: !0
}, {
tag: "div",
name: "statisticsdata2",
style: "width:90%; padding:10px; margin:20px auto 0 auto;",
allowHtml: !0
}, {
kind: "onyx.Button",
name: "resetStatisticsButton",
content: "Statistik zur\u00fccksetzen",
classes: "onyx-negative btnclientarea",
ontap: "resetStatistics"
}, {
tag: "div",
name: "catTreeContainer",
style: "display:none",
components: []
} ]
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap"
} ], uiTestingPageView = [ {
kind: "appCoreDisplay",
name: "CoreTestingDisplay",
style: "height:100%"
} ], uiProfilePageView = [ {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleProfile,
onBackButtonTap: "doMainButtonTap"
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea sp_clientarea",
style: "overflow:hidden",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
fit: !0,
style: "height:100%;padding:10px;",
components: [ {
tag: "div",
content: appConfig.msgStatPageOverview,
allowHtml: !0
}, {
tag: "div",
content: appConfig.msgStatPageClassInfo,
allowHtml: !0
}, {
kind: "onyx.Button",
style: "float:right;margin:16px 0;",
name: "btnClassSettings",
content: "Klasse \u00e4ndern",
classes: "onyx-negative",
ontap: "doClassButtonTap"
}, {
tag: "div",
style: "margin:16px 0;clear:both;border-bottom:1px solid #ccc;",
content: ""
}, {
tag: "div",
content: "Ihr Pr\u00fcfungstermin ist momentan auf 'Vor dem 01.01.1995' eingestellt.",
allowHtml: !0
}, {
kind: "onyx.Button",
style: "float:right;margin:16px 0;",
name: "btnDateSettings",
content: "Pr\u00fcfungstermin \u00e4ndern",
classes: "onyx-negative",
ontap: "doDateButtonTap"
}, {
tag: "div",
style: "margin:16px 0;clear:both;border-bottom:1px solid #ccc;",
content: ""
}, {
tag: "div",
content: "Es sind momentan 0/100 Videos heruntergeladen. Wenn Sie die Videos ohne Internetverbindung verwenden m\u00f6chten, klicken Sie auf den Button und laden Sie die Videos herunter.",
allowHtml: !0
}, {
kind: "onyx.Button",
style: "float:right;margin:16px 0;",
name: "btnVideoSettings",
content: "Videoeinstellungen",
classes: "onyx-negative",
ontap: "doVideoButtonTap"
}, {
tag: "div",
style: "margin:16px 0;clear:both;border-bottom:1px solid #ccc;",
content: ""
} ]
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap",
onApplyButtonTap: "applyNewClass",
onNextSetupWizardButtonTap: "applyNewClass"
} ], uiLoginPageView = [ {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleLogin,
onBackButtonTap: "doMainButtonTap",
onClassButtonTap: "doClassButtonTap"
}, {
kind: "enyo.Scroller",
fit: !0,
name: "ClientArea",
classes: "clientarea",
style: "text-align:center",
components: [ {
tag: "div",
classes: "t24loginfields",
style: "padding:16px 10px 0 10px; width:60%; margin:0 auto;",
components: [ {
kind: "onyx.InputDecorator",
name: "inputUserFirstnameDecorator",
style: "display:block; margin-bottom:8px; background-color:#fff; position:relative;",
components: [ {
kind: "onyx.Input",
name: "inputUserFirstname",
defaultFocus: !1,
placeholder: appConfig.msgLoginFirstnameWord,
style: "text-align:center;",
onkeyup: "updateEmptyButtons"
} ]
}, {
kind: "onyx.InputDecorator",
style: "display:block; margin-bottom:8px; background-color:#fff; position:relative;",
components: [ {
kind: "onyx.Input",
name: "inputUserLastname",
defaultFocus: !1,
placeholder: appConfig.msgLoginLastnameWord,
style: "text-align:center;",
onkeyup: "updateEmptyButtons"
} ]
}, {
kind: "onyx.InputDecorator",
style: "display:block; margin-bottom:8px; background-color:#fff; position:relative;",
components: [ {
kind: "onyx.Input",
name: "inputUserMembershipNumber",
defaultFocus: !1,
placeholder: appConfig.msgLoginMembershipnumberWord,
style: "text-align:center;",
onkeyup: "updateEmptyButtons"
}, {
tag: "div",
name: "btnTogglePasswordVisibility",
"class": "btnTogglePasswordVisibility",
content: "<i class='material-icons'>ol_visibility_off</i>",
allowHtml: !0,
style: "position:absolute;right:10px;top:10px;color:#999;cursor:pointer;opacity:0.7;font-size:90%;width:20px;height:20px;",
ontap: "togglePasswordVisibility"
} ]
}, {
kind: "onyx.Button",
content: appConfig.msgLoginWord,
classes: "onyx-blue btnfooter btnlogin",
style: "margin:16px auto 8px auto;display:block;padding:7px 32px 7px 32px;background-color: " + appConfig.btnBgColor + ";color: " + appConfig.btnFGColor,
ontap: "verifyLogin"
} ]
}, {
tag: "div",
name: "logininfo1",
classes: "t24loginexp",
style: "width:80%; padding:10px; margin:16px auto 0 auto;",
content: appConfig.msgExplanationLogin1,
allowHtml: !0
}, {
tag: "div",
name: "logininfo2",
classes: "t24loginexp",
style: "border-bottom:1px solid #ccc; width:80%; padding:16px; margin:8px auto 8px auto;",
content: appConfig.msgExplanationLogin2,
allowHtml: !0
}, {
tag: "div",
name: "logininfo3",
classes: "t24loginexp",
style: "width:80%; padding:10px; margin:8px auto 16px auto;",
content: '<a href="#" onclick="window.open(\'' + appConfig.urlMainBGPage + "', '_system', 'location=yes');\" >" + appConfig.msgExplanationLogin3 + "</a>",
allowHtml: !0
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap"
} ], uiRoutePageView = [ {
kind: "PageHeader",
style: "z-index:9999;position:absolute;width:100%",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleByRoute,
onBackButtonTap: "doMainButtonTap",
onClassButtonTap: "doClassButtonTap"
}, {
tag: "div",
name: "ClientArea",
classes: "clientarea",
allowHtml: !0,
components: [ {
kind: "enyo.Scroller",
fit: !0,
style: "height:100%;",
components: [ {
tag: "div",
name: "lblRouteSelectionHeadline",
content: appConfig.lblRouteSelectionHeadline,
style: "text-align:center; width:80%; margin:20px auto 0 auto;",
allowHtml: !0
}, {
kind: "Group",
name: "chkGroup",
classes: "group sp_setgroupcontainer",
style: "font-size:16px;background-image:url(assets/lighten.png);border-radius:3px;padding:8px;",
onActivate: "groupActivated",
highlander: !0,
components: []
}, {
tag: "div",
style: "clear:both"
}, {
tag: "div",
name: "SelectedDisplay",
content: appConfig.msgNoRouteSelectedPhrase,
style: "text-align:center; width:80%; margin:20px auto 20px auto;",
allowHtml: !0
} ]
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap"
} ];

// App.js

function inAppPurchaseInitIOS() {
if (appConfig.appLockMode != 2) return;
try {
if (!window.store) {
myVar = setTimeout(inAppPurchaseInitIOS, 3e3);
return;
}
var a = !1;
try {
var b = appDB.getInAppPurchaseStatus();
b.verified == 1 && (a = !0);
} catch (c) {}
if (a) {
fsapp.InAppPurchaseVerifiedAndroid(!0);
return;
}
store.verbosity = store.INFO, store.register([ {
id: inAppPurchaseID,
alias: inAppPurchaseAlias,
type: store.NON_CONSUMABLE
} ]), store.ready(function() {
appConfig.appLockMode == 2 && (inAppPurchaseInitialised = !0);
}), store.error(function(a) {}), store.when(inAppPurchaseAlias).approved(function(a) {
appConfig.appLockMode == 2 && (appDB.setInAppPurchaseStatus(!0), fsapp.displayAppMessage(appConfig.msgThankYouForIAP), a.finish());
}), store.when(inAppPurchaseAlias).verified(function(a) {
appConfig.appLockMode == 2 && (iosIapProductData = a, fsapp.InAppPurchaseVerifiedAndroid(a.owned));
}), store.when(inAppPurchaseAlias).updated(function(a) {
appConfig.appLockMode == 2 && (iosIapProductData = a, fsapp.InAppPurchaseVerifiedAndroid(a.owned));
});
var d = store.get(inAppPurchaseID);
store.refresh();
} catch (c) {}
}

function inAppPurchaseBuyIOS() {
store.order(inAppPurchaseAlias);
}

function inAppPurchaseRestoreIOS() {
store.refresh();
}

function inAppPurchaseInitAndroid() {
try {
if (!window.store) return;
var a = !1;
try {
var b = appDB.getInAppPurchaseStatus();
b.verified == 1 && (a = !0);
} catch (c) {}
if (a) {
fsapp.InAppPurchaseVerifiedAndroid(!0);
return;
}
store.verbosity = store.INFO, store.register({
id: inAppPurchaseID,
alias: inAppPurchaseAlias,
type: store.NON_CONSUMABLE
}), store.ready(function() {
inAppPurchaseInitialised = !0;
}), store.error(function(a) {}), store.when(inAppPurchaseAlias).approved(function(a) {
appConfig.appLockMode != 1 && (appDB.setInAppPurchaseStatus(!0), a.finish());
}), store.when(inAppPurchaseAlias).updated(function(a) {
iosIapProductData = a, fsapp.InAppPurchaseVerifiedAndroid(a.owned);
}), store.when("subscription").updated(function() {
var a = store.get(inAppSubscriptionPurchaseID) || {};
iosIaSubscriptionProductData = a, fsapp.InAppPurchaseVerifiedAndroid(a.owned);
});
var d = store.get(inAppPurchaseID);
store.refresh();
} catch (c) {}
}

function inAppPurchaseInitSuccessHandlerAndroid(a) {
var b = "";
typeof a == "object" ? b = JSON.stringify(a) : b = a, inAppPurchaseInitialised = !0;
try {
inAppPurchaseVerifyAndroid();
} catch (c) {}
}

function inAppPurchaseInitErrorHandlerAndroid(a) {
alert("IAP-Plugin Fehler: " + a, this);
}

function inAppPurchaseVerifyAndroid() {
var a = !1;
try {
var b = appDB.getInAppPurchaseStatus();
b != null && b.verified == 1 && (a = !0);
} catch (c) {}
a ? fsapp.InAppPurchaseVerifiedAndroid(!0) : inAppPurchaseInitialised ? inappbilling.getPurchases(inAppPurchaseVerifySuccessHandlerAndroid, inAppPurchaseVerifyErrorHandlerAndroid) : fsapp.InAppPurchaseVerifiedAndroid(!1);
}

function inAppPurchaseVerifySuccessHandlerAndroid(a) {
var b = "";
typeof a == "object" ? b = JSON.stringify(a) : b = a;
var c = b.indexOf('"productId":"' + inAppPurchaseID + '"') > -1;
c && appDB.setInAppPurchaseStatus(!0), fsapp.InAppPurchaseVerifiedAndroid(c);
}

function inAppPurchaseVerifyErrorHandlerAndroid(a) {
fsapp.InAppPurchaseVerifiedAndroid(!1);
}

function inAppPurchaseBuyAndroid() {
store.order(inAppPurchaseAlias);
}

function inAppPurchaseBuySuccessHandlerAndroid(a) {
var b = "";
typeof a == "object" ? b = JSON.stringify(a) : b = a;
var c = b.indexOf('"orderId":"') > -1, d = b.indexOf('"productId":"' + inAppPurchaseID + '"') > -1;
c && d && (appDB.setInAppPurchaseStatus(c && d), fsapp.displayInAppPurchaseMessageAndroid(c && d), fsapp.InAppPurchaseVerifiedAndroid(c && d)), inAppPurchaseInitialised = !0;
}

function inAppPurchaseSuccessHandlerAndroid(a) {
var b = "";
typeof a == "object" ? b = JSON.stringify(a) : b = a;
var c = b.indexOf('"orderId":"') > -1, d = b.indexOf('"productId":"' + inAppPurchaseID + '"') > -1;
c && d && fsapp.InAppPurchaseVerifiedAndroid(c && d), inAppPurchaseInitialised = !0;
}

function inAppPurchaseErrorHandlerAndroid(a) {
fsapp.InAppPurchaseVerifiedAndroid(!1);
}

function inAppPurchaseOwnedProductsAndroid() {
inappbilling.getPurchases(inAppPurchaseSuccessHandlerAndroid, inAppPurchaseErrorHandlerAndroid);
}

function inAppPurchaseDelete() {
inappbilling.consumePurchase(inAppPurchaseSuccessHandlerAndroid, inAppPurchaseErrorHandlerAndroid, inAppPurchaseID);
}

function respondToBack() {}

function loadcss(a) {
var b = document.getElementsByTagName("head")[0], c = document.createElement("link");
return c.type = "text/css", c.rel = "stylesheet", c.href = a, b.appendChild(c), c;
}

function strip_tags(a, b) {
b = (((b || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
var c = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, d = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
return a.replace(d, "").replace(c, function(a, c) {
return b.indexOf("<" + c.toLowerCase() + ">") > -1 ? a : "";
});
}

function webviewProvidesOwnToolbar() {
return appConfig.appPlatformId == "android" ? !1 : appConfig.appPlatformId == "ios" ? !0 : !0;
}

function getWebviewToolbarStringForDevice() {
return webviewProvidesOwnToolbar() ? "toolbar=yes,footer=yes" : "toolbar=no,footer=no";
}

function openWebviewReplacementiFrame(a, b) {
if (typeof b != "undefined" && b) try {
if (appDB.hasFastNetworkConnection() && appConfig.appAdIncludeFromServer) {
if (appConfig.appAdIncludeFromServerCounter >= appConfig.appAdIncludeFromServerFrequency) {
var c = "DE", d = "";
try {
appConfig.appMultilingual && (c = appConfig.appSelectedAltLanguageISO2), d = appDB.readDeviceGUID();
} catch (e) {}
try {
a = appConfig.appAdIncludeFromServerURL + "/index.php?a=" + appConfig.appVariantId + "&v=" + appConfig.appVersion + "&c=" + appConfig.userClassSelectedId + "&l=" + c + "&o=" + appConfig.appPlatformId + "&i=" + d;
} catch (e) {}
appConfig.appAdIncludeFromServerCounter = -1, openWebview(a, !1);
return;
}
appConfig.appAdIncludeFromServerCounter++;
}
} catch (e) {}
if (a.substr(0, 4).toLowerCase() != "http" && a.substr(0, 4).toLowerCase() != "itms") {
inappbrowseriframeDisabled = !0, jQuery("#inappbrowser").fadeIn(500).css("display", "block"), jQuery("#inappbrowseriframe").attr("src", a), jQuery("#safebody").css("display", "none"), jQuery("#inappbrowserclosebutton").text(appConfig.msgAlertBoxClose), jQuery("#inappbrowserclosebutton").click(function() {
jQuery("#inappbrowser").fadeOut(50).css("display", "none"), jQuery("#safebody").fadeIn(250).css("display", "block").css("height", "100% !important;");
}), typeof b != "undefined" ? b && (jQuery("#inappbrowserfooter").css("display", "none"), jQuery("#inappbrowseriframe").css("bottom", "0"), jQuery("#inappbrowseriframe").css("height", "100% !important;"), jQuery("#inappbrowseriframe").on("load", function() {
var a = document.getElementById("inappbrowseriframe").contentWindow.location.search, b = "?app=close", c = "?app=iap", d = "?app=restore", e = "?app=web";
if (a.indexOf(b) > -1) return jQuery("#inappbrowser").fadeOut(50).css("display", "none"), jQuery("#safebody").fadeIn(250).css("display", "block"), event.preventDefault(), !1;
if (a.indexOf(c) > -1) return inappbrowseriframeDisabled || (jQuery("#inappbrowser").fadeOut(50).css("display", "none"), jQuery("#safebody").fadeIn(250).css("display", "block"), fsapp.makeInAppPurchaseIOS()), event.preventDefault(), !1;
if (a.indexOf(d) > -1) return jQuery("#inappbrowser").fadeOut(50).css("display", "none"), jQuery("#safebody").fadeIn(250).css("display", "block"), fsapp.restoreInAppPurchaseIOS(), event.preventDefault(), !1;
if (a.indexOf(e) > -1) {
jQuery("#inappbrowser").fadeOut(500).css("display", "none"), jQuery("#safebody").fadeIn(500).css("display", "block");
var f = a.replace(e, "");
openWebview(f, !1);
}
})) : (jQuery("#inappbrowserfooter").css("display", "block"), jQuery("#inappbrowseriframe").css("bottom", "25px"), jQuery("#inappbrowseriframe").css("height", "calc(100% - 25px) !important;")), setTimeout(function() {
inappbrowseriframeDisabled = !1;
}, 900);
return;
}
var f = window.open(a, "_blank", "scrollbars=1,zoom=no,disallowoverscroll=yes,transitionstyle=crossdisolve,location=no,footer=yes,hidenavigationbuttons=no,closebuttoncaption=" + appConfig.msgAlertBoxClose);
try {
f.addEventListener("loadstop", function(a) {
f.show();
}), f.addEventListener("loadstart", function(a) {
var b = "?app=close";
a.url.indexOf(b) > -1 && f.close();
});
} catch (e) {}
}

function openWebview(a, b) {
appConfig.appWebKitViewerVersion ? openWebviewSimple(a, b) : openWebviewExtended(a, b);
}

function openWebviewSimple(a, b) {
a.substr(0, 4).toLowerCase() != "http" && a.substr(0, 4).toLowerCase() != "itms" && (a = cordova.file.applicationDirectory + "www/" + a);
var c = !1;
typeof b != "undefined" && (c = b);
if (c) var d = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",location=no,toolbar=no,footer=no"); else var d = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",location=no,toolbar=yes,toolbarcolor=#333333,footer=yes,footercolor=#333333,closebuttoncolor=#35a8ee,closebuttoncaption=" + appConfig.msgAlertBoxClose);
d.addEventListener("loadstart", function(a) {
var b = "?app=close", c = "?app=iap", e = "?app=restore", f = "?app=web";
a.url.indexOf(b) > -1 && d.close(), a.url.indexOf(c) > -1 && (fsapp.makeInAppPurchaseIOS(), d.close()), a.url.indexOf(e) > -1 && (fsapp.restoreInAppPurchaseIOS(), d.close());
if (a.url.indexOf(f) > -1) {
d.close();
var g = a.url.replace(f, "");
openWebviewDirect(g);
}
});
}

function openWebviewExtended(a, b) {
try {
a.substr(0, 4).toLowerCase() != "http" && a.substr(0, 4).toLowerCase() != "itms" && (a = cordova.file.applicationDirectory + "www/" + a);
} catch (c) {}
var d = !1;
typeof b != "undefined" && (d = b);
if (d) var e = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,location=no,disallowoverscroll=yes,toolbar=no,footer=no,hidden=yes,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",suppressesIncrementalRendering=yes"); else var e = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,location=no,disallowoverscroll=yes,toolbar=yes,toolbarcolor=#333333,footer=yes,footercolor=#333333,closebuttoncolor=#35a8ee,hidden=yes,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",suppressesIncrementalRendering=yes,closebuttoncaption=" + appConfig.msgAlertBoxClose);
e.addEventListener("loadstop", function(a) {
e.show();
}), e.addEventListener("loadstart", function(a) {
var b = "?app=close", c = "?app=iap", d = "?app=restore", f = "?app=web";
appConfig.appPlatformId == "ios" && a.url.indexOf("mailto:") > -1 && (e.close(), cordova.InAppBrowser.open(a.url, "_system")), a.url.indexOf(b) > -1 && e.close(), a.url.indexOf(c) > -1 && (fsapp.makeInAppPurchaseIOS(), e.close()), a.url.indexOf(d) > -1 && (fsapp.restoreInAppPurchaseIOS(), e.close());
if (a.url.indexOf(f) > -1) {
e.close();
var g = a.url.replace(f, "");
openWebviewDirect(g);
}
});
}

function openWebviewDirectNoFooter(a) {
var b = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,disallowoverscroll=yes,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",location=no,closebuttoncaption=Schlie\u00dfen");
b.addEventListener("loadstart", function(a) {
var c = "?app=close", d = "?app=iap", e = "?app=restore", f = "?app=web";
appConfig.appPlatformId == "ios" && a.url.indexOf("mailto:") > -1 && (b.close(), cordova.InAppBrowser.open(a.url, "_system")), a.url.indexOf(c) > -1 && b.close(), a.url.indexOf(d) > -1 && (fsapp.makeInAppPurchaseIOS(), b.close()), a.url.indexOf(e) > -1 && (fsapp.restoreInAppPurchaseIOS(), b.close());
if (a.url.indexOf(f) > -1) {
b.close();
var g = a.url.replace(f, "");
openWebviewDirect(g);
}
});
}

function openWebviewDirect(a) {
var b = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,disallowoverscroll=yes,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",location=no,closebuttoncaption=Schlie\u00dfen");
b.addEventListener("loadstart", function(a) {
var c = "?app=close", d = "?app=iap", e = "?app=restore", f = "?app=web";
appConfig.appPlatformId == "ios" && a.url.indexOf("mailto:") > -1 && (b.close(), cordova.InAppBrowser.open(a.url, "_system")), a.url.indexOf(c) > -1 && b.close(), a.url.indexOf(d) > -1 && (fsapp.makeInAppPurchaseIOS(), b.close()), a.url.indexOf(e) > -1 && (fsapp.restoreInAppPurchaseIOS(), b.close());
if (a.url.indexOf(f) > -1) {
b.close();
var g = a.url.replace(f, "");
openWebviewDirect(g);
}
});
}

function openWebviewDirectForceURL(a) {
a.substr(0, 4).toLowerCase() != "http" && (a = cordova.file.applicationDirectory + "www/" + a);
var b = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",scrollbars=1,zoom=no,disallowoverscroll=yes,transitionstyle=" + appConfig.appInAppBrowserTransitionstyle + ",location=yes,closebuttoncaption=Schlie\u00dfen");
}

function openWebviewAdvertising(a) {
a.substr(0, 4).toLowerCase() != "http" && (a = cordova.file.applicationDirectory + "www/" + a);
try {
var b = !0;
if (appDB.hasFastNetworkConnection() && appConfig.appAdIncludeFromServer) {
if (appConfig.appAdIncludeFromServerCounter >= appConfig.appAdIncludeFromServerFrequency) {
var c = "DE", d = "";
try {
appConfig.appMultilingual && (c = appConfig.appSelectedAltLanguageISO2), d = appDB.readDeviceGUID();
} catch (e) {}
try {
a = appConfig.appAdIncludeFromServerURL + "/index.php?a=" + appConfig.appVariantId + "&v=" + appConfig.appVersion + "&c=" + appConfig.userClassSelectedId + "&l=" + c + "&o=" + appConfig.appPlatformId + "&i=" + d;
} catch (e) {}
appConfig.appAdIncludeFromServerCounter = -1, b = !1;
}
appConfig.appAdIncludeFromServerCounter++;
}
} catch (e) {}
if (b) var f = window.open(a, "_blank", "toolbar=no,footer=no,zoom=no,scrollbars=0,location=no,disallowoverscroll=yes,zoom=no"); else var f = window.open(a, "_blank", getWebviewToolbarStringForDevice() + ",zoom=no,scrollbars=0,location=no,disallowoverscroll=yes,closebuttoncaption=" + appConfig.msgAlertBoxClose);
f.addEventListener("loadstop", function(a) {
f.show();
}), f.addEventListener("loadstart", function(a) {
var b = "?app=close", c = "?app=iap", d = "?app=restore", e = "?app=web";
a.url.indexOf(b) > -1 && f.close(), a.url.indexOf(c) > -1 && (f.close(), fsapp.makeInAppPurchaseIOS()), a.url.indexOf(d) > -1 && (f.close(), fsapp.restoreInAppPurchaseIOS());
if (a.url.indexOf(e) > -1) {
f.close();
var g = a.url.replace(e, "");
openWebviewDirect(g);
}
});
}

function keyRotateUni(a, b, c) {
var d = 65536;
return String.fromCharCode.apply(null, a.split("").map(function(a, e) {
var f = b[e % b.length].charCodeAt();
return c && (f = -f), (a.charCodeAt() + f + d) % d;
}));
}

function twoDigitNumber(a) {
return parseInt(a, 10) == "NaN" && alert("NaN: " + a, pacsapp), parseInt(a, 10) < 10 ? "0" + parseInt(a, 10) : parseInt(a, 10);
}

function addScriptTag(a, b) {
var c = document.createElement("script");
c.setAttribute("class", b), c.type = "text/javascript", c.setAttribute("src", a), document.body.appendChild(c), log("Added script tag: " + a + " with className: " + b);
}

function log(a) {
typeof debugModeFlag != "undefined" && debugModeFlag && console.log(a);
}

function updateCssDisplayLanguage(a) {
var b = a.toLowerCase(), c = appConfig.appSelectedAltLanguageISO2.toLowerCase(), d = [];
for (var e in appConfig.appAvailableLanguages) e.toLowerCase() != b && d.push(".t_" + e.toLowerCase());
var f = d.join(", ") + " {display:none !important;} .t_" + b.toLowerCase() + " {display:inline;}", g = [];
for (var e in appConfig.appAvailableLanguages) e.toLowerCase() != c && g.push(".catTree .t_" + e.toLowerCase() + ", .msgBoxQuestionCategory .t_" + e.toLowerCase() + ", .t24statisticsheader .t_" + e.toLowerCase() + ", .t24bargraphtitle .t_" + e.toLowerCase());
var h = g.join(", ") + " {display:none;} .msgBoxQuestionCategory .t_" + c + ", .t24bargraphtitle .t_" + c + ", .t24statisticsheader .t_" + c + ", .catTree .t_" + c + " { display:inline !important; } ";
jQuery("#cattreestyle").remove(), jQuery("head").append('<style id="cattreestyle" type="text/css">' + f + " " + h + "</style>");
}

function getDb1ValidUntilDate() {
try {
return getDb2ValidBeforeDate();
} catch (a) {
return getDb2ValidUntilDate();
}
}

function getDb2ValidUntilDate() {
return "2099-01-01";
}

function convertTSDateToGermanDateFormat(a) {
try {
var b = a.split("-");
return b[2] + "." + b[1] + "." + b[0];
} catch (c) {
return "dd.mm.yyyy";
}
}

var appCE = new appCoreEngine, appDB = new appDatabaseEngine, appMenu, appMenuLocked, dataTableQuestions, iosIapProductData = new Object, iosIaSubscriptionProductData;

inappbrowseriframeDisabled = !1, inAppPurchaseInitialised = !1, appInitialized = !1, appBackgroundImagesRefreshed = !1, deviceReadyAlreadyDone = !1, userDevicePlatform = "web", userDevicePlatformDebug = "web", corePluginAudioPlayer = 0;

var myFilterAlert;

typeof curAppPath == "undefined" && (curAppPath = ""), enyo.kind({
name: "App",
kind: "FittableRows",
fit: !0,
published: {
appCodeVersion: "2022.11"
},
currentPageId: 0,
lastPageId: 0,
finalSync: !1,
classes: "onyx enyo-fit",
downloadedVideoCounter: 0,
totalVideoCounter: 0,
currentSlideshowSlide: -1,
components: uiAppMainView,
processAudioEnded: function() {
this.$.TestingPage.$.CoreTestingDisplay.unhighlightCurrentQuestion();
},
openIntroPage: function() {
this.openPage(10);
},
showHomeScreen: function() {
appConfig.appLockMode == 1 ? appConfig.appLockable && !appConfig.userUnlockedApp ? this.openIntroPage() : (this.openMainPage(), this.$.WelcomePage.showHomeScreen()) : (this.openMainPage(), this.$.WelcomePage.showHomeScreen());
},
showChapterPreviousPage: function() {
this.$.ChapterPage.hasTwoStepChapterSelection && this.$.ChapterPage.currentChapterSelectionStep == 2 ? this.$.ChapterPage.preparePageForTwoStepSelection() : this.showHomeScreenTraining();
},
showHomeScreenTraining: function() {
this.openMainPage(), this.$.WelcomePage.$.mainDynamicMenu.lastInSender = new Object, this.$.WelcomePage.$.mainDynamicMenu.lastInSender.content = "Lernen", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.idx = 0, this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
},
showHomeScreenTesting: function() {
this.openMainPage(), this.$.WelcomePage.$.mainDynamicMenu.lastInSender = new Object, this.$.WelcomePage.$.mainDynamicMenu.lastInSender.content = "Pr\u00fcfen", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.idx = 1, this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
},
showHomeScreenSettings: function() {
this.openMainPage(), this.$.WelcomePage.$.mainDynamicMenu.lastInSender = new Object, this.$.WelcomePage.$.mainDynamicMenu.lastInSender.content = "Einstellungen", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.idx = 2, this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
},
processShortcutMenuTap: function(a) {
this.hideShortcutMenu();
switch (this.$.PageMenu.getLastTapAction()) {
case "home":
this.showHomeScreen();
break;
case "training":
this.showHomeScreenTraining();
break;
case "testing":
this.showHomeScreenTesting();
break;
case "statistics":
this.openStatisticsPage();
break;
case "settings":
this.showHomeScreenSettings();
break;
case "quickstart":
this.openQuickstartPage();
break;
case "bychapter":
this.openChapterPage();
break;
case "byset":
this.openSetPage();
break;
case "simulation":
this.openSimulationPage();
break;
case "help":
this.openHelpPage();
break;
case "logout":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "logout", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "contact":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=support_kontakt", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "appcontact":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=app_kontakt", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "imprint":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=recht_impressum", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "privacy":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=recht_datenschutz", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "localimprint":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openlocalhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "impressum.html", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "localprivacy":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openlocalhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "datenschutz.html", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "tips":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=theorie_lerntipps", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "localsupport":
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=support_faq", this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
break;
case "share":
this.shareThisApp();
break;
case "support":
appConfig.appSelectedAppLanguageISO2 == "DE" && openWebviewDirect(appConfig.urlSupportCenterDE), appConfig.appSelectedAppLanguageISO2 == "GB" && openWebviewDirect(appConfig.urlSupportCenterGB);
break;
case "toggletheme":
appConfig.appDarkModeActive = !appConfig.appDarkModeActive, this.applyDarkModeSetting();
}
},
applyDarkModeSetting: function() {
appConfig.appDarkModeActive ? jQuery("head link#theme").attr("href", appConfig.appCssFileDark) : jQuery("head link#theme").attr("href", appConfig.appCssFileLight), this.$.SettingsPage.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), appConfig.appDarkModeActive ? appDB.setItem("darkmodeactive", "1") : appDB.setItem("darkmodeactive", "0");
if (this.currentPageId == 0 || this.currentPageId == 3) this.drawDonutData(), this.$.StatisticsPage.updateStatistics();
},
openHelpPageForLogin: function() {
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = appConfig.loginPageHelpFile, this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
},
openHelpPageForClass: function(a) {
this.$.WelcomePage.$.mainDynamicMenu.lastSelected.func = "openhelpfile", this.$.WelcomePage.$.mainDynamicMenu.lastSelected.params = "index.html?open=" + a, this.$.WelcomePage.$.mainDynamicMenu.openSubmenu();
},
hidePurchaseSelector: function() {
this.$.appPurchaseSelector.hideSelector();
},
hideShortcutMenuDelayed: function() {
enyo.job("hideMenu" + Math.random(), enyo.bind(this, "hideShortcutMenu"), 1500);
},
hideShortcutMenu: function() {
jQuery("#pagemenuscrim").fadeOut(500), this.$.PageMenu.hideMenu();
},
showShortcutMenu: function() {
this.setupWizardActive ? alert(appConfig.msgPleaseFinishSetupWizardFirst, this) : (jQuery("#pagemenuscrim").fadeOut(1).css("z-index", "9999").fadeIn(500), this.$.PageMenu.showMenu());
},
initExtLanguageData: function() {
!appConfig.appMultilingual || appConfig.appSelectedAltLanguageISO2 == "DE" ? appConfig.appMultilingual ? (this.$.TestingPage.$.CoreTestingDisplay.displayGermanVersion = !1, this.$.TestingPage.$.CoreTestingDisplay.toggleQuestionLanguage()) : (this.$.TestingPage.$.CoreTestingDisplay.displayGermanVersion = !0, this.$.TestingPage.$.CoreTestingDisplay.toggleQuestionLanguage()) : (this.$.TestingPage.$.CoreTestingDisplay.displayGermanVersion = !0, this.$.TestingPage.$.CoreTestingDisplay.toggleQuestionLanguage()), log("initExtLanguageData finished");
},
extDataInitializationComplete: function() {
try {
var a = window.location.href.replace("index.html", "").replace("debug.html", "");
jQuery(".langAppTexts").remove(), addScriptTag("data/app/" + appConfig.appMessagesFileName + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".js", "langAppTexts"), addScriptTag("data/app/" + appConfig.appInAppMessagesFileName + appConfig.appSelectedAppLanguageISO2.toLowerCase() + ".js", "langAppTexts"), addScriptTag("data/app/" + appConfig.appInAppClassDescFileName + appConfig.appSelectedAppLanguageISO2.toLowerCase() + ".js", "langAppTexts"), appConfig.appSelectedAppLanguageISO2.toLowerCase() == "de" ? updateCssDisplayLanguage("de") : updateCssDisplayLanguage("gb");
try {
this.$.TestingPage.$.CoreTestingDisplay.displayCurrentQuestion();
} catch (b) {}
} catch (b) {}
},
openStatisticsOrBGLink: function() {
this.openStatisticsPage();
},
requestAppRatingFromUser: function() {
if (!appConfig.appRatingAlreadyDone) var a = alert(appConfig.msgRatingRequest, this, {
cancelText: appConfig.msgRatingNo,
confirmText: appConfig.msgRatingYes,
onConfirm: function(a) {
this.hide(), fsapp.rateThisApp(), this.destroy();
}
});
},
rateThisApp: function() {
switch (appConfig.appPlatformId) {
case "ios":
var a = appConfig.appStoreIdApple;
break;
case "android":
var a = appConfig.appStoreIdGoogle;
}
LaunchReview.launch(function() {
appConfig.appRatingAlreadyDone = !0, appDB.setItem("userratedapp", "1");
}, function(a) {
log("Error launching store app: " + a);
}, a);
},
shareThisApp: function() {
if (appDB.hasNetworkConnection()) {
var a = {
message: appConfig.appShareAppText,
subject: appConfig.appShareAppTitle,
files: [ appConfig.appShareAppImages ],
url: appConfig.appShareAppURL
}, b = function(a) {
alert(appConfig.msgThankYouForSharingOurApp, fsapp.$.WelcomePage);
}, c = function(a) {
alert("Es trat leider ein Fehler auf: " + a, fsapp.$.WelcomePage);
};
window.plugins.socialsharing.shareWithOptions(a, b, c);
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
shareQuestion: function() {
if (appDB.hasNetworkConnection()) {
var a = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].number, b = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].text.rot13().replace(/####/g, "\\u").replace(/###/g, "\\u0").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
try {
b = JSON.parse('"' + b + '"');
} catch (c) {}
var d = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_pretext + " ", e = "", f = "", g = "";
if (dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_type_1 == "2") {
e = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_1;
try {
e = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_1 + " " + dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_hint_1;
} catch (c) {}
} else typeof dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_1 == "undefined" ? e = "" : (e = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_1, e != "" && (e = " [1] " + e), e = e.replace("</span>", "").replace('<span class="mutterfrage">', "")), typeof dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_2 == "undefined" ? f = "" : (f = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_2, f != "" && (f = " [2] " + f), f = f.replace("</span>", "").replace('<span class="mutterfrage">', "")), typeof dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_3 == "undefined" ? g = "" : (g = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].asw_3, g != "" && (g = " [3] " + g), g = g.replace("</span>", "").replace('<span class="mutterfrage">', ""));
if (dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture != "") {
var h = dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture, i = h.substring(h.length - 4, h.length) == appConfig.extVideoTriggerExtension;
if (!i) var j = appConfig.urlPreviewImages + dbTblQ[appCE.arrQuestionIds[appCE.currentQuestionIndex]].picture; else {
d = appConfig.appShareQuestionVideoPreText + d;
var k = h.split(appConfig.extVideoTriggerExtension), j = appConfig.urlPreviewImages + k[0] + "_anfang.jpg";
}
} else var j = "";
var l = e + f + g, m = l.replace(/(<([^>]+)>)/ig, ""), n = appConfig.msgQuestion + " " + a + ": " + b + " " + d + m;
try {
var o = "<div>" + appConfig.msgQuestion + " " + a + ": " + b + " " + d + m + "</div>";
n = jQuery(o).text();
} catch (c) {}
var p = {
message: n,
subject: appConfig.msgQuestion + " " + a + appConfig.appShareQuestionSentFrom,
files: [ j ],
url: appConfig.appShareQuestionURL
}, q = function(a) {}, r = function(a) {
alert("Es trat leider ein Fehler auf: " + a, fsapp.$.WelcomePage);
};
window.plugins.socialsharing.shareWithOptions(p, q, r);
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
displayAd: function(a, b) {
if (appConfig.appPlatformId == "web" && !appConfig.forceAdDisplayForDebug) a == 0 && this.openLoginPage(); else if (appConfig.appAdShowAds) switch (a) {
case appConfig.appAdTriggerMenuButton:
appConfig.appMultilingual && appConfig.appUseMultiLanguageAdvertising ? openWebviewAdvertising("assets/ad/w0/index_" + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".html") : openWebviewAdvertising("assets/ad/w0/index_de.html");
break;
case appConfig.appAdTriggerQuestionCounter:
var c = !1;
b < 500 ? b % 30 == 0 && (c = !0) : b > 1e3 ? b % 20 == 0 && (c = !0) : b % 25 == 0 && (c = !0);
if (c) if (appConfig.appMultilingual && appConfig.appUseMultiLanguageAdvertising) openWebviewAdvertising("assets/ad/w0/index_" + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".html"); else {
var d = parseInt(Math.random() * 7, 10);
d == 7 ? openWebviewAdvertising("assets/ad/w9/index_de.html") : openWebviewAdvertising("assets/ad/w" + d + "/index_de.html");
}
break;
case appConfig.appAdTriggerSetSuccessful:
appConfig.appMultilingual && appConfig.appUseMultiLanguageAdvertising ? openWebviewAdvertising("assets/ad/w0/index_" + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".html") : openWebviewAdvertising("assets/ad/w7/index_de.html");
break;
case appConfig.appAdTriggerSetFailed:
appConfig.appMultilingual && appConfig.appUseMultiLanguageAdvertising ? openWebviewAdvertising("assets/ad/w0/index_" + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".html") : openWebviewAdvertising("assets/ad/w8/index_de.html");
break;
case appConfig.appAdTriggerLastErrors:
b % 20 == 0 && b > 0 && (appConfig.appMultilingual && appConfig.appUseMultiLanguageAdvertising ? openWebviewAdvertising("assets/ad/w0/index_" + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".html") : openWebviewAdvertising("assets/ad/w9/index_de.html"));
break;
case appConfig.appAdTriggerMarkedQuestion:
appConfig.appMultilingual && appConfig.appUseMultiLanguageAdvertising ? openWebviewAdvertising("assets/ad/w0/index_" + appConfig.appSelectedAltLanguageISO2.toLowerCase() + ".html") : openWebviewAdvertising("assets/ad/w3/index_de.html");
break;
case -1:
this.currentSlideshowSlide = -1, this.displayIntroSlideshow();
}
},
displayIntroSlideshow: function() {
enyo.job("showSlide" + Math.random(), enyo.bind(this, "displayIntroSlideshow2"), 100);
},
displayIntroSlideshow2: function() {
this.currentSlideshowSlide++, slide = this.currentSlideshowSlide;
var a = '<a onclickx="fsapp.displayIntroSlideshow();" style="z-index:999999;position:absolute;top:0;left:0;right:0;bottom:0;"> <div style="background-color:#fff;" id="t24ad"><div style="background-color:#fff;" class="t24adwrapper">';
slide == 0 ? (appConfig.appUseAnimatedSlides ? a += '<iframe class="t24adbox1nocrop" style="position:absolute;border:none;overflow:hidden;" border="0" src="assets/slideshow/slide' + (slide + 1) + '/index.html"></iframe>' : a += '<div class="t24adbox1nocrop" style="position:absolute;background-image:url(assets/slideshow/bg' + (slide + 1) + '.png);background-size:contain;"><div style="position:absolute;top:20%;left:20%;max-width:60%;"><img src="assets/slideshow/fg' + (slide + 1) + '.png" alt="" style="max-width:100%;" class="spinningicon" /></div></div>', a += '<div class="t24adbox2" style="background-position:center center;background-image:url(assets/slideshow/txt' + (slide + 1) + '.png);background-size:contain;background-repeat:no-repeat" >&nbsp;</div>') : (appConfig.appUseAnimatedSlides ? a += '<iframe class="t24adbox1nocrop" style="position:absolute;border:none;overflow:hidden;" border="0" src="assets/slideshow/slide' + (slide + 1) + '/index.html"></iframe>' : a += '<div class="t24adbox1nocrop" style="position:absolute;background-image:url(assets/slideshow/bg' + (slide + 1) + '.png);background-size:contain;"><div style="position:absolute;top:20%;left:20%;max-width:60%;"><img src="assets/slideshow/fg' + (slide + 1) + '.png" alt="" style="max-width:100%;" class="spinningicon" /></div></div>', a += '<div class="t24adbox2" style="background-position:center center;background-image:url(assets/slideshow/txt' + (slide + 1) + '.png);background-size:contain;background-repeat:no-repeat" >&nbsp;</div>'), a += "</div></div></a>", slide < appConfig.appNumberOfIntroSlides ? slide == 0 ? (fsapp.$.displayAdContainer.setContent(a), jQuery("#t24displayAdContainer").fadeIn(500, function() {
fsapp.$.displayAdContainer.render();
}), enyo.job("showAd" + Math.random(), enyo.bind(this, "showAd"), 500)) : (jQuery("#t24displayAdContainer div").animate({
opacity: 0
}, 300, function() {
fsapp.$.displayAdContainer.setContent(a), fsapp.$.displayAdContainer.render();
}), enyo.job("showAd" + Math.random(), enyo.bind(this, "showAd"), 300)) : appConfig.appShowSetupWizardAfterSlideshow ? (fsapp.openSetupWizard(), jQuery("#t24displayAdContainer").fadeOut(300, function() {}), enyo.job("hideAd" + Math.random(), enyo.bind(this, "hideAd"), 300)) : (this.openMainPage(), this.showHomeScreen(), jQuery("#t24displayAdContainer").fadeOut(300, function() {}), enyo.job("hideAd" + Math.random(), enyo.bind(this, "hideAd"), 300));
},
displayAdOld: function() {
if (adType == 1 && appConfig.appAdShowAds) {
if (appConfig.appPlatformId == "android") {
var a = '<div id="t24ad"><div class="t24adwrapper"><div class="t24adbox1" style="background-color:#eaeaea;/*background-position:center bottom;*/background-image:url(assets/ad/bg' + adBGRandomCounter + '.png);background-size:cover;"><div style="position:absolute;top:8px;right:8px;max-width:20%;"><img src="assets/ad/siegel1.png" alt="" style="max-width:100%;" class="spinningicon" /></div></div><div class="t24adbox2" style="background-color:#333;background-position:center center;background-image:url(assets/ad/txt' + adBGRandomCounter + '.png);background-size:contain;background-repeat:no-repeat" ><a onclick="fsapp.makeInAppPurchaseAndroid();fsapp.hideAd();" style="position:absolute;top:0;left:0;right:0;bottom:0;" >&nbsp;</a></div>';
a += '</div><a style="position:absolute;left:' + adCloseX + "%;top:" + adCloseY + '%;padding:4px 6px;background-color:#fff;color:#333;font-weight:bold;" onclick="fsapp.hideAd();">X</a></div>', this.$.displayAdContainer.setContent(a), enyo.job("showAd" + Math.random(), enyo.bind(this, "showAd"), 500);
}
if (appConfig.appPlatformId == "ios") {
var a = '<div id="t24ad"><div class="t24adwrapper"><div class="t24adbox1" style="background-color:#eaeaea;/*background-position:center bottom;*/background-image:url(assets/ad/bg' + adBGRandomCounter + '.png);background-size:cover;"><div style="position:absolute;top:8px;right:8px;max-width:20%;"><img src="assets/ad/siegel1.png" alt="" style="max-width:100%;" class="spinningicon" /></div></div><div class="t24adbox2" style="background-color:#333;background-position:center center;background-image:url(assets/ad/txt' + adBGRandomCounter + '.png);background-size:contain;background-repeat:no-repeat" ><a onclick="fsapp.makeInAppPurchaseIOS();fsapp.hideAd();" style="position:absolute;top:60%;left:0;right:40%;bottom:0;" >&nbsp;</a><a onclick="fsapp.restoreInAppPurchaseIOS();fsapp.hideAd();" style="position:absolute;top:60%;left:60%;right:0;bottom:0;" >&nbsp;</a></div>';
a += '</div><a style="position:absolute;left:' + adCloseX + "%;top:" + adCloseY + '%;padding:4px 6px;background-color:#fff;color:#333;font-weight:bold;" onclick="fsapp.hideAd();">X</a></div>', this.$.displayAdContainer.setContent(a), enyo.job("showAd" + Math.random(), enyo.bind(this, "showAd"), 500);
}
appConfig.appPlatformId != "web";
}
if (adType == 4 || !0) if (appConfig.appAdShowAds || !0) {
if (appConfig.appPlatformId == "android" || !0) {
var a = '<div id="t24ad"><div class="t24adwrapper"><div class="t24adbox1" style="background-color:#eaeaea;/*background-position:center bottom;*/background-image:url(assets/ad/bg' + adBGRandomCounter + '.png);background-size:cover;"><div style="position:absolute;top:8px;right:8px;max-width:20%;"><img src="assets/ad/siegel1.png" alt="" style="max-width:100%;" class="spinningicon" /></div></div><div class="t24adbox2" style="background-color:#333;background-position:center center;background-image:url(assets/ad/txt' + adBGRandomCounter + '.png);background-size:contain;background-repeat:no-repeat" ><a onclick="fsapp.makeInAppPurchaseAndroid();fsapp.hideAd();" style="position:absolute;top:0;left:0;right:0;bottom:0;" >&nbsp;</a></div>';
a += '</div><a style="position:absolute;left:' + adCloseX + "%;top:" + adCloseY + '%;padding:4px 6px;background-color:#fff;color:#333;font-weight:bold;" onclick="fsapp.hideAd();">X</a></div>', this.$.displayAdContainer.setContent(a), enyo.job("showAd" + Math.random(), enyo.bind(this, "showAd"), 500);
}
if (appConfig.appPlatformId == "ios") {
var a = '<div id="t24ad"><div class="t24adwrapper"><div class="t24adbox1" style="background-color:#eaeaea;/*background-position:center bottom;*/background-image:url(assets/ad/bg' + adBGRandomCounter + '.png);background-size:cover;"><div style="position:absolute;top:8px;right:8px;max-width:20%;"><img src="assets/ad/siegel1.png" alt="" style="max-width:100%;" class="spinningicon" /></div></div><div class="t24adbox2" style="background-color:#333;background-position:center center;background-image:url(assets/ad/txt' + adBGRandomCounter + '.png);background-size:contain;background-repeat:no-repeat" ><a onclick="fsapp.makeInAppPurchaseIOS();fsapp.hideAd();" style="position:absolute;top:60%;left:0;right:40%;bottom:0;" >&nbsp;</a><a onclick="fsapp.restoreInAppPurchaseIOS();fsapp.hideAd();" style="position:absolute;top:60%;left:60%;right:0;bottom:0;" >&nbsp;</a></div>';
a += '</div><a style="position:absolute;left:' + adCloseX + "%;top:" + adCloseY + '%;padding:4px 6px;background-color:#fff;color:#333;font-weight:bold;" onclick="fsapp.hideAd();">X</a></div>', this.$.displayAdContainer.setContent(a), enyo.job("showAd" + Math.random(), enyo.bind(this, "showAd"), 500);
}
appConfig.appPlatformId == "web" && this.openLoginPage();
}
},
showAd: function() {
this.$.displayAdContainer.show(), enyo.job("unlockAd" + Math.random(), enyo.bind(this, "unlockAd"), 100);
},
unlockAd: function() {
this.$.displayAdLocker.hide();
},
hideAd: function() {
this.$.displayAdContainer.hide(), this.$.displayAdLocker.hide();
},
displayChapter: function(a, b) {
this.lastPageId = 0, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameByChapter, this.$.ChapterPage.initPage("official"), this.lastPageId = 1, this.$.ChapterPage.openChapter(b.chapter), this.openPage(1);
},
lockDisplay: function() {
this.$.displayLock.show(), this.displayIsLocked = !0;
},
unlockDisplay: function() {
this.$.displayLock.hide(), this.$.displayAdLocker.hide(), this.displayIsLocked = !1;
},
updateStatistics: function() {
this.drawDonutData();
},
processIconClick: function() {
appConfig.hideHeaderHelpIconInDemo ? (!appConfig.appLockable || !!appConfig.userUnlockedApp) && this.openHelpPage() : this.openHelpPage();
},
displayAppInfo: function() {
var a = "<h2 style='margin-top:0;margin-bottom:8px;font-weight:normal;'>App Info</h2><hr size='1'/>", b = [];
try {
b.push({
title: "Variant",
value: appConfig.appVariantId
}), b.push({
title: "Version",
value: appConfig.appVersion
}), b.push({
title: "Unlocked",
value: appConfig.userUnlockedApp
}), b.push({
title: "ClassId",
value: appConfig.userClassSelectedId
}), b.push({
title: "Platform",
value: userDevicePlatform
});
} catch (c) {
b.push({
title: "Info 1",
value: "-"
});
}
try {
appConfig.appHas2DBs ? appConfig.userDb2selected ? (b.push({
title: "Catalog D1",
value: getDb2ValidFromDate()
}), b.push({
title: "Catalog D2",
value: getDb2ValidBeforeDate()
})) : (b.push({
title: "Catalog D1",
value: getDb1ValidFromDate()
}), b.push({
title: "Catalog D2",
value: getDb1ValidBeforeDate()
})) : (b.push({
title: "Catalog D1",
value: getDb1ValidFromDate()
}), b.push({
title: "Catalog D2",
value: getDb1ValidBeforeDate()
}));
} catch (c) {
b.push({
title: "Catalog",
value: "-"
});
}
try {
b.push({
title: "Backup",
value: appDB.getAppUnlockUserData().name
});
} catch (c) {
b.push({
title: "Backup",
value: "-"
});
}
try {
b.push({
title: "Dev. cdva",
value: device.cordova
}), b.push({
title: "Dev. model",
value: device.model
}), b.push({
title: "Dev. platform",
value: device.platform
}), b.push({
title: "Dev. version",
value: device.version
}), b.push({
title: "Dev. man.",
value: device.manufacturer
});
} catch (c) {
b.push({
title: "Dev. info",
value: "-"
});
}
a += "<table width='100%'>";
for (var d = 0; d < b.length; d++) a += "<tr><td><b>" + b[d].title + "</b></td><td>" + b[d].value + "</td></tr>";
a += "</table>", alert(a, this);
},
tapSelectPurchaseIAP: function() {
this.$.appPurchaseSelector.hideSelector(), appConfig.appPlatformId == "android" && inAppPurchaseBuyIOS(), appConfig.appPlatformId == "ios" && inAppPurchaseBuyIOS();
},
tapSelectPurchasePRO: function() {
this.$.appPurchaseSelector.hideSelector(), appConfig.appPlatformId == "android" && openWebview("assets/help/playstore_redir.html"), appConfig.appPlatformId == "ios" && openWebview("itms-apps://itunes.apple.com/app/id920788519");
},
tapSelectPurchaseGOLD: function() {
this.$.appPurchaseSelector.hideSelector(), appConfig.appPlatformId == "android" && openWebview("assets/help/playstore_redir_mlpro.html"), appConfig.appPlatformId == "ios" && openWebview("itms-apps://itunes.apple.com/app/id1423115391");
},
tapSelectPurchaseRestore: function() {
this.$.appPurchaseSelector.hideSelector(), fsapp.restoreInAppPurchaseIOS();
},
create: function() {
this.inherited(arguments), enyo.dispatcher.listen(window, "beforeunload"), this.$.displayAdContainer.hide(), this.$.displayAdLocker.hide(), this.$.displayLock.hide(), this.$.appPurchaseSelector.hideSelector(), appConfig.showSplashScreen && this.showSplashScreen();
if (appConfig.appShowIntroSlideshow) try {
appDB.getItem("appVersion") != appConfig.appVersion && (appConfig.appFirstStartAfterInstall = !0, this.openIntroHelpPage());
} catch (a) {}
},
rendered: function() {
this.inherited(arguments);
try {
appDB.getItem("darkmodeactive") != null && (appConfig.appDarkModeActive = appDB.getItem("darkmodeactive") == "1", this.applyDarkModeSetting());
} catch (a) {}
try {
appDB.getItem("appVersion") != appConfig.appVersion && (appConfig.appFirstStartAfterInstall = !0, appDB.removeItemById("selectdb"), appDB.getItem("appVersion") != null && (appConfig.appFirstStartAfterUpdate = !0, alert(appConfig.msgUpdateCompleted, this), appConfig.appLogOutAfterUpdate && alert("ACHTUNG: UNGETESTETE FUNKTION: 'remove user credentials' in app.js (renderd()) wird nicht ausgef\u00fchrt.", this)), appDB.setItem("appVersion", appConfig.appVersion));
} catch (a) {
alert("<u>Fehler</u>: appVersion kann nicht aus DB gelesen werden. " + appConfig.appVersion + "<br /><br /><u>Hinweis:</u> Dieser Fehler kann entstehen, wenn die Anwendung im Browser <br />mit der Einstellung <u>'Privates Surfen'</u> gestartet wird.<br />In diesem Fall schalten Sie bitte 'Privates Surfen' ab und versuchen Sie es erneut.<br /><br /><u>Hinweis:</u> Um f\u00fcr Tablets und Smartphones alle Funktionen zu nutzen, verwenden Sie bitte <u>unsere App</u>.", this), appDB.setItem("appVersion", appConfig.appVersion);
}
if (appConfig.appHas2DBs) if (appDB.getItem("selectdb") != null) {
appConfig.userDb2selected = appDB.getItem("selectdb") == "2";
if (!appConfig.userDb2selected) {
var b = new Date, c = b.toISOString(), d = c.split("T"), e = d[0].toString();
e >= getDb1ValidBeforeDate() && alert(appConfig.msgDb1Expired, this), appConfig.appNumberOfDemoSets = appConfig.appNumberOfDemoSetsDB1, initDb1TableQuestions(), initQuestionInfoDb1(), initDb1TableSets();
} else appConfig.appNumberOfDemoSets = appConfig.appNumberOfDemoSetsDB2, initDb2TableQuestions(), initQuestionInfoDb2(), initDb2TableSets();
} else {
var b = new Date, c = b.toISOString(), d = c.split("T"), e = d[0].toString(), f = e < getDb1ValidBeforeDate();
f ? (appDB.setItem("selectdb", "1"), appConfig.userDb2selected = !1, appConfig.appNumberOfDemoSets = appConfig.appNumberOfDemoSetsDB1, initDb1TableQuestions(), initQuestionInfoDb1(), initDb1TableSets()) : (appDB.setItem("selectdb", "2"), appConfig.userDb2selected = !0, appConfig.appNumberOfDemoSets = appConfig.appNumberOfDemoSetsDB2, initDb2TableQuestions(), initQuestionInfoDb2(), initDb2TableSets());
} else initDb1TableQuestions(), initQuestionInfoDb1(), initDb1TableSets();
try {
initTableSituations(), initTableRoutes(), categoryTreeSituations();
} catch (a) {}
try {
appDB.getItem("userratedapp") != null && (appConfig.appRatingAlreadyDone = appDB.getItem("userratedapp") == "1");
} catch (a) {}
try {
appDB.getItem("vibrateonwronganswer") != null && (appConfig.appVibrateOnWrongAnswer = appDB.getItem("vibrateonwronganswer") == "1"), appDB.getItem("displayexplanationonwronganswer") != null && (appConfig.appDisplayExplanationOnWrongAnswer = appDB.getItem("displayexplanationonwronganswer") == "1"), appDB.getItem("displayintromessageonquickstartetc") != null && (appConfig.appDisplayIntroMessageOnQuickstartEtc = appDB.getItem("displayintromessageonquickstartetc") == "1"), appConfig.appDisplayQuestionVoiceOverSetting ? appDB.getItem("enablequestionvoiceover") != null && (appConfig.appEnableQuestionVoiceOver = appDB.getItem("enablequestionvoiceover") == "1") : appConfig.appEnableQuestionVoiceOver = !1;
} catch (a) {}
try {
var g = appDB.readLastViewedTopicAndQuestion();
appConfig.userLastViewedTopicId = g.topicId, appConfig.userLastViewedQuestionId = g.questionId;
} catch (a) {}
try {
if (appConfig.appMultilingual) if (appDB.getItem("sellangappid") != null) for (var h in appConfig.appAvailableAppLanguages) appConfig.appAvailableAppLanguages[h].id == appDB.getItem("sellangappid") && (appConfig.appSelectedAppLanguageISO2 = h, log("App Language ISO: " + appConfig.appSelectedAppLanguageISO2 + " (id:" + appDB.getItem("sellangappid") + ")")); else log("sellangappid is empty.. default: " + appConfig.appSelectedAppLanguageISO2);
} catch (a) {
alert(a.message, this);
}
try {
if (appConfig.appMultilingual) if (appDB.getItem("sellangid") != null) for (var h in appConfig.appAvailableLanguages) appConfig.appAvailableLanguages[h].id == appDB.getItem("sellangid") && (appConfig.appSelectedAltLanguageISO2 = h, log("Content Language ISO: " + appConfig.appSelectedAltLanguageISO2 + " (id:" + appDB.getItem("sellangid") + ")")); else log("sellangid is empty ... default: " + appConfig.appSelectedAltLanguageISO2);
} catch (a) {
alert(a.message, this);
}
try {
appConfig.appMultilingual ? this.initExtLanguageData() : updateCssDisplayLanguage("de");
} catch (a) {
alert("Caught error in initExtLanguageData();", this);
}
try {
appDB.getItem("selclassid") != null && (appConfig.userClassSelectedId = appDB.getItem("selclassid")), setClassIdByUrl != -1 && (appConfig.userClassSelectedId = setClassIdByUrl);
} catch (a) {}
if (appConfig.appLockable && !appConfig.userUnlockedApp || appConfig.appUnlockSyncByUser && appConfig.appLockMode == 2 && appConfig.appPlatformId == "web" || appDB.getItem("user") != null) {
try {
appConfig.userAutoSync = parseInt(appDB.getItem("autosync"), 10) == 1, this.$.chkAutoSync.setChecked(appConfig.userAutoSync);
} catch (a) {}
try {
if (appDB.getItem("user") != null) {
appConfig.userUnlockedApp = !0, appConfig.appMultilingual && (appConfig.appMultilingualLocked = !1, this.initExtLanguageData()), appConfig.appUnlockSyncByUser && appConfig.appPlatformId != "web" && (appConfig.appSyncLocked = !1), appConfig.appUnlockSyncByUser && appConfig.appPlatformId == "web" && appDB.getItem("user") != null && (appConfig.appSyncLocked = !1, this.$.WelcomePage.hideInAppPurchaseButton()), appDB.getItem("autosync") != null && (appConfig.userAutoSync = parseInt(appDB.getItem("autosync"), 10) == 1, appConfig.urlStatisticSync == "" && (appConfig.userAutoSync = !1));
if (!appConfig.appFirstStartAfterInstall && appConfig.appDisplayWelcomeBackMsg) if (appDB.getAppUnlockUserData().name != "") {
var i = appConfig.msgWelcomeBack.replace(/!USERNAME!/gi, appDB.getAppUnlockUserData().name);
alert(i, this), this.$.WelcomePage.hideInAppPurchaseButton();
} else appDB.getAppUnlockUserData().school != "" ? alert("Hallo, willkommen zur\u00fcck beim F\u00fchrerschein-Lernsystem von <br /><br /><b>" + appDB.getAppUnlockUserData().school + "</b><br /><br />Wir w\u00fcnschen Ihnen viel Erfolg bei der Vorbereitung auf Ihre F\u00fchrerschein&shy;pr\u00fcfung.", this) : alert("Hallo, willkommen zur\u00fcck.<br /><br />Wir w\u00fcnschen Ihnen viel Erfolg bei der Vorbereitung auf Ihre F\u00fchrerschein&shy;pr\u00fcfung.", this);
appConfig.userAutoSync && this.syncApp(), this.$.WelcomePage.render(), this.$.SettingsPage.render();
}
} catch (a) {
log("error init function: " + a);
}
} else appConfig.userAutoSync = !1;
this.$.HelpPage.prepareHelpTexts(), this.refreshPageHeaders(), this.$.WelcomePage.$.mainDynamicMenu.initCurrentMenu(), this.$.WelcomePage.$.mainDynamicMenu.openMainmenu(), this.updateSyncButton(), this.$.LoginPage.resetTextfields(), appConfig.appVersion < this.appCodeVersion && alert("Fehler: Version der Konfigurationsdatei zu niedrig, das Programm erwartet eine Konfigurations&shy;datei mit Version " + this.appCodeVersion + " oder h\u00f6her.", this), appDB.readDeviceGUID() == "" && appDB.createDeviceGUID(), appConfig.appLockMode == 1 && this.showHomeScreen(), enyo.job("triggerRenderEvent", enyo.bind(this, "triggerRenderEvent"), 1500), enyo.job("verifyDeviceResolution" + Math.random(), enyo.bind(this, "verifyDeviceResolution"), 500), enyo.job("readLocalStorageBackupMetadata" + Math.random(), enyo.bind(appDB, "readLocalStorageBackupMetadata"), 2e3), typeof this.$.ChapterPage.$.catTree == "undefined" && this.$.ChapterPage.initPage("official");
},
displayQuickChoiceMessageBox: function() {
if (appConfig.appDisplayQuickChoiceAfterSetupWizard) {
var a = alert(appConfig.msgQuickChoiceMessage, this, {
cancelText: appConfig.msgQuickChoiceHowToLearnButton,
confirmText: appConfig.msgQuickChoice30Questions,
onCancelButton: function(a) {
this.hide(), fsapp.executeQuickChoiceAction1(), this.destroy();
},
onConfirm: function(a) {
this.hide(), fsapp.executeQuickChoiceAction2(), this.destroy();
}
});
a.$.confirm.applyStyle("width", "100% !important"), a.$.confirm.applyStyle("display", "block"), a.$.confirm.applyStyle("margin-bottom", "16px !important"), a.$.cancel.applyStyle("width", "100% !important"), a.$.cancel.applyStyle("margin-left", "0");
}
this.updateStatisticDataIntoDatabase(!0);
},
executeQuickChoiceAction1: function() {
var a = "index.html?open=theorie_lerntipps";
appConfig.appMultilingual ? this.openHelpFileInWebview(appConfig.appAvailableAppLanguages[appConfig.appSelectedAppLanguageISO2].langISO2 + "/" + a) : this.openHelpFileInWebview(a);
},
executeQuickChoiceAction2: function() {
this.openQuickstartPage();
},
openSetupWizard: function() {
if (appConfig.appFirstStartAfterInstall || appConfig.appShowSetupWizardAfterLogin) {
appConfig.appSetupWizardStep++, this.setupWizardActive = !0;
if (appConfig.appMultilingual) switch (appConfig.appSetupWizardStep) {
case 0:
appConfig.appSetupWizardStep = 1;
case 1:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardLanguage, this.openSettingsPageCategory("languageSetupWizard");
break;
case 2:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardDate, this.openSettingsPageCategory("dateSetupWizard");
break;
case 3:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardClass, this.openSettingsPageCategory("classSetupWizard");
break;
case 4:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardGeneral, this.openSettingsPageCategory("generalSetupWizard");
break;
case 5:
appConfig.appOnMobileDevice ? (this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardMedia, this.openSettingsPageCategory("videoSetupWizard"), this.$.SettingsPage.$.removeVideosButton.setDisabled(!0), this.$.SettingsPage.$.removeAudiosButton.setDisabled(!0)) : (this.displayQuickChoiceMessageBox(), this.setupWizardActive = !1, this.openMainPage());
break;
case 6:
appConfig.appOnMobileDevice && appConfig.appLockMode == 0 ? (this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardBackup, this.openSettingsPageCategory("backupSetupWizard")) : (this.displayQuickChoiceMessageBox(), this.setupWizardActive = !1, this.openMainPage());
break;
case 5:
case 6:
default:
this.displayQuickChoiceMessageBox(), this.setupWizardActive = !1, this.openMainPage();
} else switch (appConfig.appSetupWizardStep) {
case 0:
appConfig.appSetupWizardStep = 1;
case 1:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardDate, this.openSettingsPageCategory("dateSetupWizard");
break;
case 2:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardClass, this.openSettingsPageCategory("classSetupWizard");
break;
case 3:
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardGeneral, this.openSettingsPageCategory("generalSetupWizard");
break;
case 4:
appConfig.appOnMobileDevice ? (this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardMedia, this.openSettingsPageCategory("videoSetupWizard"), this.$.SettingsPage.$.removeVideosButton.setDisabled(!0), this.$.SettingsPage.$.removeAudiosButton.setDisabled(!0)) : (this.displayQuickChoiceMessageBox(), this.setupWizardActive = !1, this.openMainPage());
break;
case 5:
appConfig.appOnMobileDevice && appConfig.appLockMode == 0 ? (this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardBackup, this.openSettingsPageCategory("backupSetupWizard")) : (this.displayQuickChoiceMessageBox(), this.setupWizardActive = !1, this.openMainPage());
break;
case 5:
case 6:
default:
this.displayQuickChoiceMessageBox(), this.setupWizardActive = !1, this.openMainPage();
}
appConfig.userAutoSync && !this.setupWizardActive && this.syncApp();
}
},
initialFrameDocsCopy: function() {
try {
var a = new Array("impressum.html", "datenschutz.html", "extern.css");
for (var b = 0; b < a.length; b++) {
var c = a[b];
if (appConfig.appPlatformId == "android") var d = cordova.file.dataDirectory + c; else var d = cordova.file.dataDirectory + c;
var e = location.href.replace("/index.html", ""), f = e + "/assets/help/" + c, g = new FileTransfer;
g.download(f, d, function(a) {
var b = new Object;
b.ver = appConfig.appVersion, appDB.setItem("doc:" + a.name, b);
}, function(a) {
alert("Fehler beim initialen Kopieren der Hilfedateien: " + a, this);
});
}
} catch (h) {
alert("Achtung: es trat ein Fehler beim Kopieren der Rahmenseiten auf.<br />Dies betrifft Impressum und/oder Datenschutzhinweise.<br />Bitte sehen Sie die entsprechenden Dokumente ggf. bei der Online-Version der App ein.", this);
}
},
drawDonutData: function() {
try {
this.$.WelcomePage.$.GraphContainer2.setContent(""), this.$.WelcomePage.render();
} catch (a) {}
appConfig.appDisplayAlternativeDonut ? appConfig.appShowStaticWelcomeDisplay || enyo.job("drawDonut" + Math.random(), enyo.bind(this, "drawDonutData3"), 500) : appConfig.appShowStaticWelcomeDisplay || enyo.job("drawDonut" + Math.random(), enyo.bind(this, "drawDonutData2"), 500);
},
drawDonutData2: function() {
if (this.donutDrawingInProgress) return;
this.donutDrawingInProgress = !0, appConfig.appShowStaticWelcomeDisplay || this.$.WelcomePage.$.BackgroundImage.hide();
var a = appDB.getStatisticsCache();
a != null ? a.statisticData == null && this.$.Statistics.updateStatisticDataIntoDatabase(!0) : this.$.Statistics.updateStatisticDataIntoDatabase(!0);
var a = appDB.getStatisticsCache();
a != null && (log(a), questionsInCurrentClass = parseInt(a.statisticData.questionsInCurrentClass, 10), questionsFitForTest = parseInt(a.statisticData.questionsFitForTest, 10), questionsAnswered = parseInt(a.statisticData.questionsAnswered, 10), questionstWrongLastTime = parseInt(a.statisticData.questionstWrongLastTime, 10), arrFirstLevelStatistics = a.statisticData.firstLevelStatistics, arrFirstLevelCategories = a.statisticData.firstLevelCategories);
if (questionsInCurrentClass > 0) var b = questionsFitForTest / questionsInCurrentClass * 100, c = questionsAnswered / questionsInCurrentClass * 100, d = questionstWrongLastTime / questionsInCurrentClass * 100; else var b = 0, c = 0, d = 0;
try {
var e = jQuery(".mainGraphContainer").width(), f = jQuery(".mainGraphContainer").height();
this.$.WelcomePage.$.GraphContainer2.applyStyle("width", Math.min(e, f) + "px"), this.$.WelcomePage.$.GraphContainer2.applyStyle("height", Math.min(e, f) + "px");
} catch (g) {}
var h = questionsFitForTest / questionsInCurrentClass * 100, i = questionstWrongLastTime / questionsInCurrentClass * 100, j = questionsAnswered / questionsInCurrentClass * 100;
this.$.WelcomePage.$.GraphContainer2.setContent('<canvas id="myChart1" style="margin:0;position:absolute;" width="100%" height="100%"></canvas> <canvas id="myChart2" style="margin:0px;position:absolute;" width="100%" height="100%"></canvas> <canvas id="myChart3" style="margin:0;position:absolute;" width="100%" height="100%"></canvas>'), this.$.WelcomePage.$.GraphContainer2.render(), this.$.WelcomePage.$.phoneGraphGreenBar.applyStyle("width", h + "%"), this.$.WelcomePage.$.phoneGraphOrangeBar.applyStyle("width", j + "%"), this.$.WelcomePage.$.phoneGraphRedBar.applyStyle("width", i + "%");
var k = document.getElementById("myChart1"), l = document.getElementById("myChart2"), m = document.getElementById("myChart3"), n = 1;
if (appConfig.appDarkModeActive) var o = "#1c1c1e", p = "#373737"; else var o = "#d2d6d7", p = "#eaeaea";
var q = questionsInCurrentClass, r = questionstWrongLastTime / q * (100 - n), s = (questionsInCurrentClass - questionstWrongLastTime) / q * (100 - n), t = {
labels: [ "Ampel", "", "Zuletzt falsch gemacht", "" ],
datasets: [ {
data: [ n - .01, .01, r, s ],
backgroundColor: [ "#fa3b2a", o, "#fa3b2a", o ],
hoverBackgroundColor: [ "#fa3b2a", o, "#fa3b2a", o ],
hoverBorderColor: p,
borderColor: p,
borderWidth: 2
} ]
}, q = questionsInCurrentClass, r = questionsAnswered / q * (100 - n), s = (questionsInCurrentClass - questionsAnswered) / q * (100 - n), u = {
labels: [ "Ampel", "", "Mindestens einmal gemacht", "Noch nicht ge\u00fcbt" ],
datasets: [ {
data: [ n - .01, .01, r, s ],
backgroundColor: [ "#fdc619", o, "#fdc619", o ],
hoverBackgroundColor: [ "#fdc619", o, "#fdc619", o ],
hoverBorderColor: p,
borderColor: p,
borderWidth: 2
} ]
}, q = questionsInCurrentClass, r = questionsFitForTest / q * (100 - n), s = (questionsInCurrentClass - questionsFitForTest) / q * (100 - n), v = {
labels: [ "Ampel", "", "Fit f\u00fcr die Pr\u00fcfung", "Nicht bereit f\u00fcr die Pr\u00fcfung" ],
datasets: [ {
data: [ n - .01, .01, r, s ],
backgroundColor: [ "#83bc41", o, "#83bc41", o ],
hoverBackgroundColor: [ "#83bc41", o, "#83bc41", o ],
hoverBorderColor: p,
borderColor: p,
borderWidth: 2
} ]
}, w = new Chart(k, {
type: "doughnut",
data: t,
options: {
cutoutPercentage: 43,
rotation: -(n / 100) * Math.PI - .5 * Math.PI,
legend: {
display: !1
},
animation: {
easing: "easeOutQuint",
duration: 1500
},
tooltips: {
enabled: !1
},
elements: {
center: {
frontPageGraph: !0,
maxText: " 100.0% ",
text: h.toFixed(1) + "%",
fontColor: "#83bc41",
fontFamily: "'Poppins', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
fontStyle: "normal",
minFontSize: 1,
maxFontSize: 256
}
}
}
}), x = new Chart(l, {
type: "doughnut",
data: u,
options: {
cutoutPercentage: 62,
rotation: -(n / 100) * Math.PI - .5 * Math.PI,
legend: {
display: !1
},
animation: {
easing: "easeOutQuint",
duration: 1500
},
tooltips: {
enabled: !1
}
}
}), y = new Chart(m, {
type: "doughnut",
data: v,
options: {
cutoutPercentage: 81,
rotation: -(n / 100) * Math.PI - .5 * Math.PI,
legend: {
display: !1
},
animation: {
easing: "easeOutQuint",
duration: 1500
},
tooltips: {
enabled: !1
}
}
});
enyo.job("drawDonutFinished" + Math.random(), enyo.bind(this, "donutDrawingFinished"), 1e3);
},
donutDrawingFinished: function() {
this.donutDrawingInProgress = !1;
},
drawDonutData3: function() {
if (this.donutDrawingInProgress) return;
this.donutDrawingInProgress = !0, appConfig.appShowStaticWelcomeDisplay || this.$.WelcomePage.$.BackgroundImage.hide();
var a = appDB.getStatisticsCache();
a != null ? a.statisticData == null && this.$.Statistics.updateStatisticDataIntoDatabase(!0) : this.$.Statistics.updateStatisticDataIntoDatabase(!0);
var a = appDB.getStatisticsCache();
a != null && (log(a), questionsInCurrentClass = parseInt(a.statisticData.questionsInCurrentClass, 10), questionsFitForTest = parseInt(a.statisticData.questionsFitForTest, 10), questionsAnswered = parseInt(a.statisticData.questionsAnswered, 10), questionstWrongLastTime = parseInt(a.statisticData.questionstWrongLastTime, 10), arrFirstLevelStatistics = a.statisticData.firstLevelStatistics, arrFirstLevelCategories = a.statisticData.firstLevelCategories);
if (questionsInCurrentClass > 0) var b = questionsFitForTest / questionsInCurrentClass * 100, c = questionsAnswered / questionsInCurrentClass * 100, d = questionstWrongLastTime / questionsInCurrentClass * 100; else var b = 0, c = 0, d = 0;
try {
var e = jQuery(".mainGraphContainer").width(), f = jQuery(".mainGraphContainer").height();
this.$.WelcomePage.$.GraphContainer2.applyStyle("width", Math.min(e, f) + "px"), this.$.WelcomePage.$.GraphContainer2.applyStyle("height", Math.min(e, f) + "px");
} catch (g) {}
var h = questionsFitForTest / questionsInCurrentClass * 100, i = questionstWrongLastTime / questionsInCurrentClass * 100, j = questionsAnswered / questionsInCurrentClass * 100;
this.$.WelcomePage.$.GraphContainer2.setContent('<canvas id="myChart1" style="margin:0;position:absolute;" width="100%" height="85%"></canvas>'), this.$.WelcomePage.$.GraphContainer2.render(), this.$.WelcomePage.$.phoneGraphGreenBar.applyStyle("width", h + "%"), this.$.WelcomePage.$.phoneGraphOrangeBar.applyStyle("width", j + "%"), this.$.WelcomePage.$.phoneGraphRedBar.applyStyle("width", i + "%");
var k = document.getElementById("myChart1"), l = 0, m = questionsInCurrentClass, n = questionstWrongLastTime / m * (100 - l), o = questionsFitForTest / m * (100 - l), p = j - o - n, q = 100 - j, r = Math.round(o * 10) / 10 + "%", s = Math.round(n * 10) / 10 + "%", t = Math.round(j * 10) / 10 + "%", u = Math.round(q * 10) / 10 + "%", v = {
labels: [ r, t, s, u ],
datasets: [ {
data: [ o, p, n, q ],
backgroundColor: [ "#83bc41", "#FDC619", "#FA3B2A", "#e6e3df" ],
hoverBackgroundColor: [ "#83bc41", "#FDC619", "#FA3B2A", "#e6e3df" ],
hoverBorderColor: "#fff",
borderColor: "#fff",
borderWidth: 2
} ]
}, w = new Chart(k, {
type: "doughnut",
data: v,
options: {
cutoutPercentage: 50,
rotation: -(l / 100) * Math.PI - .5 * Math.PI,
legend: {
display: !0,
position: "bottom",
fullWidth: !0
},
animation: {
easing: "easeOutQuint",
duration: 1500
},
tooltips: {
enabled: !0
},
elements: {
center: {
frontPageGraph: !0,
maxText: " 100.0% ",
text: h.toFixed(1) + "%",
fontColor: "#83bc41",
fontFamily: "'Poppins', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
fontStyle: "normal",
minFontSize: 1,
maxFontSize: 256
}
}
}
});
enyo.job("drawDonutFinished" + Math.random(), enyo.bind(this, "donutDrawingFinished"), 1e3);
},
updateStatisticDataIntoDatabase: function() {
this.$.Statistics.updateStatisticDataIntoDatabase();
},
verifyDeviceResolution: function() {
log("verifyDeviceResolution"), userDevicePlatformDebug += "<hr />";
var a = this.getBounds(), b = Math.max(screen.width, screen.height), c = Math.min(screen.width, screen.height), d = window.devicePixelRatio;
this.$.ChapterPage.hasTwoStepChapterSelection = !1, appConfig.forceEnvironment == "" ? appConfig.appOnMobileDevice ? (appConfig.appPlatformId == "ios" && (window.isTablet ? (this.addClass("tabletapp"), this.removeClass("phoneapp"), userDevicePlatform = "tablet", userDevicePlatformDebug = "tablet: " + b + "; " + c) : (this.$.ChapterPage.hasTwoStepChapterSelection = !0, this.addClass("phoneapp"), this.removeClass("tabletapp"), userDevicePlatform = "phone", userDevicePlatformDebug = "phone: " + b + "; " + c), this.refreshPageHeaders()), appConfig.appPlatformId == "android" && (window.isTablet ? b >= 1024 && c >= 768 ? (this.addClass("tabletapp"), this.removeClass("phoneapp"), userDevicePlatform = "tablet", userDevicePlatformDebug = "tablet: " + b + "; " + c) : (this.$.ChapterPage.hasTwoStepChapterSelection = !0, this.addClass("phoneapp"), this.removeClass("tabletapp"), userDevicePlatform = "phone", userDevicePlatformDebug = "phone: " + b + "; " + c) : (this.$.ChapterPage.hasTwoStepChapterSelection = !0, this.addClass("phoneapp"), this.removeClass("tabletapp"), userDevicePlatform = "phone", userDevicePlatformDebug = "phone: " + b + "; " + c), this.refreshPageHeaders())) : (this.addClass("webapp"), this.removeClass("tabletapp"), this.removeClass("phoneapp"), userDevicePlatformDebug = "web: " + b + "; " + c, this.refreshPageHeaders()) : (appConfig.forceEnvironment == "tablet" && (this.addClass("tabletapp"), this.removeClass("phoneapp"), userDevicePlatform = "tablet", userDevicePlatformDebug = "tablet: " + b + "; " + c), appConfig.forceEnvironment == "phone" && (this.$.ChapterPage.hasTwoStepChapterSelection = !0, this.addClass("phoneapp"), this.removeClass("tabletapp"), userDevicePlatform = "phone", userDevicePlatformDebug = "phone: " + b + "; " + c, this.refreshPageHeaders()), appConfig.forceEnvironment == "web" && (this.addClass("webapp"), this.removeClass("tabletapp"), this.removeClass("phoneapp"), userDevicePlatformDebug = "web: " + b + "; " + c, this.refreshPageHeaders())), log("Set device resolution values: " + appConfig.appPlatformId + " " + userDevicePlatform), this.$.pagePanels.applyStyle("display", "block"), this.$.WelcomePage.updateChart(), appInitialized = !0, userDevicePlatform != "web" ? enyo.job("drawDonutData", enyo.bind(this, "drawDonutData"), 800) : enyo.job("showMainMenu", enyo.bind(this, "showMainMenu"), 800);
},
triggerRenderEvent: function() {
this.$.pagePanels.applyStyle("bottom", "0"), this.$.pagePanels.applyStyle("height", "100%"), this.$.pagePanels.applyStyle("min-height", "100%");
},
orientationLockLandscape: function() {
fsapp.render();
},
showMainMenu: function() {
log("showMainMenu"), this.$.WelcomePage.showMainMenu();
},
unmarkAllQuestions: function() {
objValues = appDB.getItem("markedquestions");
if (objValues != null) var a = objValues.markedQuestionIds; else var a = "";
var b = a.split(",");
for (var c = 0; c < b.length; c++) appDB.delMarkedQuestion(b[c]);
appDB.setMarkedQuestionIds(""), this.$.MarkedPage.refreshQuestionList();
},
catchUnload: function(a) {},
VerifyInAppPurchaseAndroid: function() {
try {
inAppPurchaseVerifyAndroid();
} catch (a) {}
},
InAppPurchaseVerifiedAndroid: function(a) {
var b = !1;
try {
var c = appDB.getInAppPurchaseStatus();
c != null && c.verified == 1 && (b = !0);
} catch (d) {}
a = b || a;
if (a) try {
this.$.WelcomePage.hideInAppPurchaseButton();
} catch (d) {}
appConfig.userUnlockedApp = a;
if (appConfig.appMultilingual) {
appConfig.appMultilingualLocked = !a;
if (a) {
try {
this.initExtLanguageData();
} catch (d) {}
try {
this.$.WelcomePage.hideInAppPurchaseButton();
} catch (d) {}
}
}
a && appDB.getItem("user") != null && (appConfig.userUnlockedApp = !0, appConfig.appUnlockSyncByUser && (appConfig.appSyncLocked = !1, appConfig.userAutoSync = parseInt(appDB.getItem("autosync"), 10) == 1)), this.refreshPageHeaders();
},
displayInAppPurchaseMessageAndroid: function(a) {
appConfig.appLockMode == 2 && (alert(appConfig.msgThankYouForIAP, this), this.refreshPageHeaders());
},
preInAppPurchaseAndroid: function() {
var a = alert(appConfig.msgT24FreeAppFunctionalityAndroid, this, {
cancelText: "Sp\u00e4ter",
confirmText: "Upgrade",
onConfirm: function(a) {
this.hide(), fsapp.makeInAppPurchaseAndroid(), this.destroy();
}
});
},
makeInAppPurchaseAndroid: function() {
inAppPurchaseBuyAndroid();
},
makeInAppPurchaseIOS: function() {
if (userDevicePlatform == "web") fsapp.openLoginPage(); else if (appDB.hasNetworkConnection()) {
var a = "";
try {
a = iosIapProductData.description;
} catch (b) {}
a != "" ? (this.$.appPurchaseSelector.refresh(), this.$.appPurchaseSelector.showSelector()) : alert("Leider erhalten wir momentan keine Verbindung zum Appstore. Bitte warten Sie einige Sekunden und versuchen Sie es erneut. Wir bedauern das Problem, bitte kontaktieren Sie uns, wenn dies mehrfach passieren sollte.", this);
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
restoreInAppPurchaseIOS: function() {
if (appDB.hasNetworkConnection()) var a = '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Wiederherstellen</h2>' + appConfig.msgT24RestoreInAppPurchaseIOS + "<br /><br /><b>" + iosIapProductData.title + "</b><br /><i>" + iosIapProductData.description + "</i><br />Preis: " + iosIapProductData.price, b = alert(a, this, {
cancelText: "Abbrechen ",
confirmText: "Weiter",
onConfirm: function(a) {
this.hide(), inAppPurchaseRestoreIOS(), this.destroy();
}
}); else alert(appConfig.msgErrorNoOnlineConnection, this);
},
deleteInAppPurchaseAndroid: function() {
inAppPurchaseDeleteAndroid();
},
openUserAppRating: function() {
if (appConfig.appPlatformId == "android") {
var a = appConfig.urlRateAppAndroid;
alert(a, this, {
confirmText: "Vielen Dank",
onConfirm: function(a) {
this.hide();
}
});
}
if (appConfig.appPlatformId == "ios") {
var a = appConfig.urlRateAppiOS;
alert(a, this, {
confirmText: "Vielen Dank",
onConfirm: function(a) {
this.hide();
}
});
}
},
showSplashScreen: function() {
this.$.pagePanels.setIndex(10), setTimeout(function(a) {
a.hideSplashScreen();
}, 2e3, this);
},
hideSplashScreen: function() {
this.openMainPage();
},
unlockApp: function(a, b) {
appDB.hasNetworkConnection() ? (appConfig.userUnlockedApp = !0, appConfig.appMultilingualLocked = !1, this.$.pagePanels.setIndex(0), this.refreshPageHeaders(), this.$.WelcomePage.render(), this.$.SettingsPage.render(), this.$.WelcomePage.resized()) : alert(appConfig.msgErrorNoOnlineConnection, this), this.$.HelpPage.prepareHelpTexts(), appConfig.appShowSetupWizardAfterLogin && (appConfig.appSetupWizardStep = 0, this.openSetupWizard());
},
lockAppSyncLock: function() {
appConfig.appSyncLocked = !0, appConfig.appAdShowAds = !0, fsapp.$.WelcomePage.$.mainDynamicMenu.showInAppPurchaseButton(), this.lockApp();
},
lockApp: function() {
appDB.hasNetworkConnection() ? (this.finalSync = !0, this.syncApp(), appConfig.appDisplayLogoutSuccessfulMsg && alert(appConfig.msgLogoutSuccess, this), appDB.resetAppUnlockUserData(), appConfig.userUnlockedApp = !1, this.$.pagePanels.setIndex(0), this.refreshPageHeaders(), this.$.LoginPage.resetTextfields(), this.$.WelcomePage.render(), this.$.SettingsPage.render(), this.$.LoginPage.render(), this.$.WelcomePage.$.mainDynamicMenu.initCurrentMenu(), this.$.WelcomePage.$.mainDynamicMenu.openMainmenu2(), appConfig.appLockMode == 1 && this.showHomeScreen()) : alert(appConfig.msgErrorNoOnlineConnection, this), this.$.HelpPage.prepareHelpTexts();
},
syncApp: function(a, b) {
log("syncApp() called"), this.$.SettingsPage.startSyncProcess();
},
syncAppCheckConnection: function() {
if (appDB.hasNetworkConnection()) {
var a = new Date;
if (appDB.getItem("lastSyncStartTS") != null) {
var b = appDB.getItem("lastSyncStartTS");
if (a.getTime() - b.syncTS < 1e4) {
alert(appConfig.msgPlsWaitBetweenSyncing, this);
return;
}
}
var c = new Object;
c.syncTS = a.getTime(), appDB.setItem("lastSyncStartTS", c), this.$.SettingsPage.$.btnSyncNow.setDisabled(!0), this.syncApp();
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
updateSyncButton: function() {
if (this.$.SettingsPage.$.btnSyncNow.getDisabled()) {
var a = '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">Synchronisierung</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>\u00dcbersicht der Daten, die von der App an den Server gesendet und von dort empfangen wurden:<br /><br />';
a += '<table><tr><td style="vertical-align:middle;"><i style="font-size:2em;" class="material-icons">ol_backup</i> &nbsp;&nbsp;</td><td style="border-left:1px solid #fff;padding-left:6px;">Fragen: ' + this.$.SettingsPage.intSyncSentQuestions + "<br /> B\u00f6gen: " + this.$.SettingsPage.intSyncSentSets + "<br /> markierte Fragen: " + this.$.SettingsPage.intSyncSentMarkedQuestions + "</td></tr></table>", a += '<table><tr><td style="vertical-align:middle;"><i style="font-size:2em;" class="material-icons">ol_cloud_download</i> &nbsp;&nbsp;</td><td style="border-left:1px solid #fff;padding-left:6px;">Fragen: ' + this.$.SettingsPage.intSyncReceivedQuestions + "<br />B\u00f6gen: " + this.$.SettingsPage.intSyncReceivedSets + "<br />markierte Fragen: " + this.$.SettingsPage.intSyncReceivedMarkedQuestions + "</td></tr></table>", a += "<br />Aktuelle Lernposition: " + appConfig.userLastViewedTopicId + ":" + appConfig.userLastViewedQuestionId, alert(a, this), this.$.SettingsPage.$.btnSyncNow.setDisabled(!1);
}
!appConfig.userUnlockedApp && this.finalSync && (this.finalSync = !1, appDB.resetAppUnlockUserData()), this.$.SettingsPage.$.btnSyncNow.applyStyle("display", "block"), appDB.getNumberOfQuestionsForSync() > 0 ? this.$.SettingsPage.$.btnSyncNow.applyStyle("background-color", "#c51616") : this.$.SettingsPage.$.btnSyncNow.applyStyle("background-color", "#aaaaaa"), this.$.Statistics.updateStatisticDataIntoDatabase(!0);
},
checkForNecessaryAutoSync: function() {
try {
var a = new Date;
if (parseInt(this.lastSyncCheckTS, 10) != 0 && a.getTime() - this.lastSyncCheckTS < 1e4) return;
this.lastSyncCheckTS = a.getTime();
} catch (b) {}
try {
appConfig.appSaveTestSimulationResults && appConfig.appSyncTestSimulationResults && appConfig.appUseOpenApiProcess && this.syncTestSimulationResults();
} catch (b) {}
try {
appConfig.userAutoSync ? appDB.getNumberOfQuestionsForSync() > appConfig.appMinSyncLimit ? this.syncApp() : this.updateSyncButton() : this.updateSyncButton();
} catch (b) {}
},
syncTestSimulationResults: function() {
try {
var a = appDB.getItem("sync.simulation");
if (a == null || a == undefined) var a = [];
for (var b = 0; b < a.length; b++) {
var c = a[b];
if (appConfig.appUseOpenApiProcess) {
var d = "";
try {
var e = appDB.getItem("apiLoginData");
d = e.token;
} catch (f) {
log("ERROR: no auth token found!");
return;
}
var g = new Date(c.testTS * 1e3), h = {
class_id: c.classId,
class_name: c.className,
error_points: c.errorPoints,
passed: c.testPassed == 1,
disqualified: c.failed2x5p == 1,
timestamp: g.toISOString()
}, i = JSON.stringify(h), j = new enyo.Ajax({
url: appConfig.appOpenApiUrl + "/sync/simulation",
method: "POST",
contentType: "application/json",
headers: {
Authorization: "Bearer " + d
}
});
j.response(this, "processApiSyncSimulationResponse"), j.error(this, "processApiSyncSimulationError"), j.go(i);
}
}
} catch (f) {
log("ERROR: syncTestSimulationResults(): " + f.message);
}
},
processApiSyncSimulationResponse: function(a, b) {
try {
var c = appDB.getItem("sync.simulation");
if (c == null || c == undefined) var c = [];
for (var d = 0; d < c.length; d++) {
var e = c[d], f = e.testTS, g = new Date(b.timestamp);
if (f * 1e3 == g.getTime()) {
c.splice(d, 1), appDB.setItem("sync.simulation", c), log("sync of test-simulation successful for record from " + g);
return;
}
}
} catch (h) {
log("Es trat ein Fehler bei der Verbindung zur Synchronisierungs API auf: " + h.message, this);
}
},
processApiSyncSimulationError: function(a, b) {
try {
log("ERROR: sync test simulation: api is answering with an error object: "), log(a.xhr.responseText);
} catch (c) {
log("Es trat ein Fehler bei der Verbindung zur Synchronisierungs API auf: " + c.message, this);
}
},
openHelpFileInWebview: function(a) {
if (a == "INTROSLIDESHOW") this.displayIntroSlideshow(0); else {
var b = a.replace("%OSNAME%", appConfig.appPlatformId);
openWebview("assets/help/" + b);
}
},
openHtmlFileInWebview: function(a) {
openWebviewDirectForceURL("assets/help/" + a);
},
openIntroHelpPage: function() {
this.lastPageId = 0, this.displayIntroSlideshow(0);
},
openHandsOnRoutePage: function(a, b) {
this.lastPageId = 14, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameByRoute, this.$.RoutePage.prepareRouteCheckboxes(), this.openPage(14), dataTableQuestions = dbTableSit;
},
openQuickstartPage: function(a, b) {
this.lastPageId = 0, dataTableQuestions = dbTblQ, this.$.QuickstartPage.initQuickstartQuestionArray(), this.$.QuickstartPage.foundQuickstartQuestions > 0 && (this.$.TestingPage.displayTestingEnvironment(2), this.openPage(6));
},
openQuickstartWrongAnswersPage: function(a, b) {
if (appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !appConfig.appMultilingual) {
if (appConfig.appPlatformId == "android") var c = alert(appConfig.msgT24FreeAppFunctionalityAndroid, this, {
cancelText: "Sp\u00e4ter",
confirmText: "Upgrade",
onConfirm: function(a) {
this.hide(), fsapp.makeInAppPurchase(), this.destroy();
}
});
appConfig.appPlatformId == "ios" && alert(appConfig.msgT24FreeAppFunctionalityIOS, this);
} else this.lastPageId = 0, dataTableQuestions = dbTblQ, this.$.QuickstartPage.initQuickstartWrongAnsweredArray(), this.$.QuickstartPage.foundQuickstartQuestions > 0 && (this.$.TestingPage.displayTestingEnvironment(2), this.openPage(6));
},
openProfilePage: function(a, b) {
this.lastPageId = 9, this.openPage(9);
},
openSchoolFinderPage: function(a, b) {
!appDB.hasNetworkConnection();
},
openLoginPage: function(a, b) {
appDB.hasNetworkConnection() ? (appConfig.appOnMobileDevice || enyo.job("focus", enyo.bind(this.$.LoginPage.$.inputUserFirstname, "focus"), 750), this.$.LoginPage.initPage(), this.lastPageId = 13, this.openPage(13)) : alert(appConfig.msgErrorNoOnlineConnection, this);
},
openMainPageIfNotSetupWizard: function(a, b) {
this.setupWizardActive ? alert(appConfig.msgPleaseFinishSetupWizardFirst, this) : (this.checkForNecessaryAutoSync(), this.updateStatisticDataIntoDatabase(!0), appDB.writeConditionalLocalStorageToFile(), this.lastPageId = 0, this.openPage(0), this.drawDonutData());
},
openMainPage: function(a, b) {
this.setupWizardActive = !1, this.checkForNecessaryAutoSync(), this.updateStatisticDataIntoDatabase(), appDB.writeConditionalLocalStorageToFile(), this.lastPageId = 0, this.openPage(0), this.drawDonutData();
},
openChapterPage: function(a, b) {
this.lastPageId = 1, dataTableQuestions = dbTblQ, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameByChapter, this.$.ChapterPage.initPage("official"), this.openPage(1);
},
openFocusChapterPage: function(a, b) {
this.lastPageId = 1, dataTableQuestions = dbTblQ, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameByChapter, this.$.ChapterPage.initPage("focus"), this.openPage(1);
},
openSetPage: function(a, b) {
this.lastPageId = 2, dataTableQuestions = dbTblQ, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameBySet, this.$.SetPage.prepareSetCheckboxes(), this.openPage(2);
},
openSimulationPage: function(a, b) {
this.lastPageId = 0, dataTableQuestions = dbTblQ;
var c = new Array;
for (var d in dbTableSets) dbTableSets[d]["class_id"] == appConfig.userClassSelectedId && c.push(d);
i = parseInt(Math.random() * Math.min(c.length, appConfig.appMaxAvailableSetsForUser), 10), appCE.setQuestionOrigin(1), appCE.clearQuestionIdsArray(), appCE.fillQuestionIdsFromString(dbTableSets[c[i]].question_ids), this.$.TestingPage.displayTestingEnvironment(4), this.openPage(6);
},
openMarkedPage: function(a, b) {
this.lastPageId = 8, dataTableQuestions = dbTblQ, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameByMarked, this.$.MarkedPage.initMarkedQuestionsPage(), this.openPage(8);
},
openSearchPage: function(a, b) {
this.lastPageId = 8, dataTableQuestions = dbTblQ, this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameBySearch, this.$.MarkedPage.initSearchQuestionsPage(), this.openPage(8);
},
openStatisticsPage: function(a, b) {
this.lastPageId = 3, dataTableQuestions = dbTblQ, this.openPage(3), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameByStatistics, this.$.StatisticsPage.updateStatistics();
},
openSettingsPage: function(a, b) {
this.$.SettingsPage.$.PageFooter.$.buttonback.show(), this.$.SettingsPage.$.PageFooter.$.buttonapply.setContent(appConfig.msgApply), this.$.SettingsPage.$.PageFooter.$.buttonapply.hide(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.initialHelpPageFilenameBySettings, this.openSettingsPageCategory("class");
},
openSettingsLanguagePage: function() {
this.openSettingsPageCategory("language");
},
openSettingsVideoPage: function() {
this.openSettingsPageCategory("video");
},
openSettingsDatePage: function() {
this.openSettingsPageCategory("date");
},
openSettingsClassPage: function() {
this.openSettingsPageCategory("class");
},
openSettingsPageCategory: function(a) {
this.lastPageId = 4, this.lastPageSettingsCategory = a, typeof a == undefined && (a = "class"), this.$.SettingsPage.$.PageFooter.$.buttonback.show(), this.$.SettingsPage.$.PageFooter.$.buttonapply.setContent(appConfig.msgApply), this.$.SettingsPage.$.PageFooter.$.buttonapply.hide();
switch (a) {
case "language":
this.$.SettingsPage.displayLanguageSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
break;
case "class":
this.$.SettingsPage.displayClassSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
break;
case "languageSetupWizard":
this.$.SettingsPage.displayLanguageSelection(), this.$.SettingsPage.displaySetupFooterButtons(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardLanguage;
break;
case "classSetupWizard":
this.$.SettingsPage.displayClassSelection(), this.$.SettingsPage.displaySetupFooterButtons(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardClass;
break;
case "generalSetupWizard":
this.$.SettingsPage.displayGeneralSettingsSelection(), this.$.SettingsPage.displaySetupFooterButtons(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardGeneral;
break;
case "date":
this.$.SettingsPage.displayExamDateSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
break;
case "dateSetupWizard":
this.$.SettingsPage.displayExamDateSelection(), this.$.SettingsPage.displaySetupFooterButtons(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardDate;
break;
case "video":
this.$.SettingsPage.displayVideoSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
break;
case "videoSetupWizard":
this.$.SettingsPage.displayVideoSelection(!0), this.$.SettingsPage.displaySetupFooterButtons(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardMedia;
break;
case "sync":
this.$.SettingsPage.displaySyncSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
break;
case "sync-register":
this.$.SettingsPage.displaySyncRegistrationSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
break;
case "backupSetupWizard":
try {
appDB.getAppUnlockUserData().name != "" ? (this.$.SettingsPage.displaySetupFooterButtons(), this.$.SettingsPage.displaySyncSelection(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardBackup) : (this.$.SettingsPage.displaySetupFooterButtons(), this.$.SettingsPage.displaySyncRegistrationSelection(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardBackup);
} catch (b) {
this.$.SettingsPage.displaySetupFooterButtons(), this.$.SettingsPage.displaySyncRegistrationSelection(), this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile = appConfig.helpSetupWizardBackup;
}
break;
case "general":
this.$.SettingsPage.displayGeneralSettingsSelection(), this.$.SettingsPage.displayDefaultFooterButtons();
}
log("open settings page: " + a), this.openPage(4);
},
openHelpPage: function(a, b) {
this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile == "" || this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile == "INTROSLIDESHOW" ? appConfig.initialHelpPageFilename == "INTROSLIDESHOW" ? this.displayIntroSlideshow(0) : appConfig.appMultilingual ? this.openHelpFileInWebview(appConfig.appAvailableAppLanguages[appConfig.appSelectedAppLanguageISO2].langISO2 + "/" + appConfig.initialHelpPageFilename) : this.openHelpFileInWebview(appConfig.initialHelpPageFilename) : (log("open help file: " + this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile), appConfig.appMultilingual ? this.openHelpFileInWebview(appConfig.appAvailableAppLanguages[appConfig.appSelectedAppLanguageISO2].langISO2 + "/" + this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile) : this.openHelpFileInWebview(this.$.WelcomePage.$.mainDynamicMenu.currentHelpFile));
},
openHelpPageChapter: function(a) {
this.openHelpFileInWebview(a);
},
openHelpImprintPage: function(a, b) {},
openPage: function(a) {
try {
appConfig.appEnableQuestionVoiceOver && this.$.coreAudio.stop();
} catch (b) {}
if (deviceReadyAlreadyDone && a != 14) {
var c = !1;
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) c = !0;
c && appConfig.appPlatformId == "web" && !appConfig.appDevelopmentMode && alert(appConfig.msgPlsUseAppInstead, this);
}
this.currentPageId = a, this.$.pagePanels.setIndex(a), this.refreshPageHeaders(), enyo.job("refreshCurrentPage" + Math.random(), enyo.bind(this, "refreshCurrentPage"), 800);
},
refreshCurrentPage: function() {
this.$.pagePanels.refresh();
try {
this.$.ChapterPage.$.PageFooter.render(), this.$.SetPage.$.PageFooter.render(), this.$.StatisticsPage.$.PageFooter.render(), this.$.SettingsPage.$.PageFooter.render(), this.$.HelpPage.$.PageFooter.render(), this.$.MarkedPage.$.PageFooter.render(), this.$.LoginPage.$.PageFooter.render(), this.$.TestingPage.$.t24bottomcontrols.render(), this.$.ProfilePage.$.t24bottomcontrols.render();
} catch (a) {}
},
openPreTestingPage: function(a, b) {
this.$.TestingPage.$.CoreTestingDisplay.disableTimer(), this.lastPageId == 0 && (this.checkForNecessaryAutoSync(), this.updateStatisticDataIntoDatabase()), appDB.writeConditionalLocalStorageToFile(), this.openPage(this.lastPageId), this.lastPageId == 0 && this.drawDonutData(), this.lastPageId == 1 && this.$.ChapterPage.initPageAfterTestingPage(), this.lastPageId == 2 && this.$.SetPage.prepareSetCheckboxes(), this.lastPageId == 8 && this.$.MarkedPage.refreshQuestionList();
},
openTestingPage: function(a, b) {
this.$.TestingPage.$.CoreTestingDisplay.comingBackFromVideoPlayer = !1, this.openPage(6);
},
openTestingPageFromVideo: function(a, b) {
appConfig.appOnMobileDevice || this.$.FullscreenVideoPage.$.appCoreVideoDisplayElement.$.t24qvideo.removePlayer(), this.blockDoubleVideoStart = !1, this.$.TestingPage.$.CoreTestingDisplay.comingBackFromVideoPlayer = !0, this.$.TestingPage.$.CoreTestingDisplay.displayCurrentQuestion(), this.openPage(6);
},
openFullscreenImagePage: function(a, b) {
this.$.FullscreenImagePage.displayCurrentQuestionImage(), this.openPage(7);
},
openFullscreenVideoPage: function(a, b) {
var c = "";
try {
var d = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10);
if (d != 0) {
var e = dbTblQ[d].picture.split(appConfig.extVideoTriggerExtension);
c = e[0] + appConfig.extVideoFileExtension;
}
} catch (f) {}
if (c != "") switch (appConfig.appPlatformId) {
case "android":
this.blockDoubleVideoStart || (this.blockDoubleVideoStart = !0, window.resolveLocalFileSystemURL(cordova.file.dataDirectory + c, function() {
this.src = cordova.file.dataDirectory + c;
var a = {
errorCallback: function(a) {},
shouldAutoClose: !0,
controls: !0
};
window.plugins.streamingMedia.playVideo(this.src, a);
}, function() {
try {
var a = navigator.connection.type;
a == Connection.CELL_2G && fsapp.displaySlowInternetConnectionMessage();
} catch (b) {
var a = Connection.UNKNOWN;
}
if (a != Connection.NONE && a != Connection.UNKNOWN) {
this.src = curAppPath + appConfig.urlVideoStreaming + c;
var d = {
errorCallback: function(a) {},
shouldAutoClose: !0,
controls: !0
};
window.plugins.streamingMedia.playVideo(this.src, d);
} else fsapp.videoplayerror();
}), enyo.job("updateQuestionDisplay", enyo.bind(this, "openTestingPageFromVideo"), 1e3));
break;
case "ios":
this.blockDoubleVideoStart || (this.blockDoubleVideoStart = !0, window.resolveLocalFileSystemURL(cordova.file.dataDirectory + c, function() {
this.src = cordova.file.dataDirectory + c;
var a = {
errorCallback: function(a) {},
shouldAutoClose: !0,
controls: !0
};
window.plugins.streamingMedia.playVideo(this.src, a);
}, function() {
try {
var a = navigator.connection.type;
a == Connection.CELL_2G && fsapp.displaySlowInternetConnectionMessage();
} catch (b) {
var a = Connection.UNKNOWN;
}
if (a != Connection.NONE && a != Connection.UNKNOWN) {
this.src = curAppPath + appConfig.urlVideoStreaming + c;
var d = {
errorCallback: function(a) {},
shouldAutoClose: !0,
controls: !0
};
window.plugins.streamingMedia.playVideo(this.src, d);
} else fsapp.videoplayerror();
}), enyo.job("updateQuestionDisplay", enyo.bind(this, "openTestingPageFromVideo"), 1e3));
break;
default:
this.$.FullscreenVideoPage.displayCurrentQuestionVideo(), this.openPage(12);
} else alert("video error: no filename", fsapp);
},
readSet: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(1), this.openPage(6);
},
readChapter: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(1), this.openPage(6);
},
readRoute: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(appConfig.appTestingModeHandsOn), this.openPage(6);
},
practiseSet: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(2), this.openPage(6);
},
practiseChapter: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(2), this.openPage(6);
},
practiseRoute: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(appConfig.appTestingModeHandsOn), this.openPage(6);
},
testSet: function(a, b) {
this.$.TestingPage.displayTestingEnvironment(3), this.openPage(6);
},
refreshPageHeaderCaptions: function() {
this.$.WelcomePage.$.PageHeader.setSubtitle(appConfig.pageSubtitleMain), this.$.LoginPage.$.PageHeader.setSubtitle(appConfig.pageSubtitleLogin), this.$.MarkedPage.$.PageHeader.setSubtitle(appConfig.pageSubtitleByMarked), this.$.StatisticsPage.$.PageHeader.setSubtitle(appConfig.pageSubtitleStatistics), this.$.SetPage.$.PageHeader.setSubtitle(appConfig.pageSubtitleBySet), this.$.ChapterPage.$.PageHeader.setSubtitle(appConfig.pageSubtitleByChapter), fsapp.setupWizardActive ? this.$.SettingsPage.displaySetupFooterButtons() : this.$.SettingsPage.$.PageHeader.setSubtitle(appConfig.pageSubtitleSettings), (fsapp.lastPageId == 4 && !fsapp.setupWizardActive && fsapp.lastPageSettingsCategory == "language" || fsapp.lastPageId == 4 && fsapp.setupWizardActive && appConfig.appSetupWizardStep == 1) && fsapp.$.SettingsPage.displayLanguageSelection();
},
refreshFooterButtonCaptions: function() {
log("refreshFooterButtonCaptions"), this.$.LoginPage.$.PageFooter.refreshButtonCaptions(), this.$.HelpPage.$.PageFooter.refreshButtonCaptions(), this.$.MarkedPage.$.PageFooter.refreshButtonCaptions(), this.$.SettingsPage.$.PageFooter.refreshButtonCaptions(), this.$.StatisticsPage.$.PageFooter.refreshButtonCaptions(), this.$.ChapterPage.$.PageFooter.refreshButtonCaptions(), this.$.SetPage.$.PageFooter.refreshButtonCaptions(), this.$.SettingsPage.$.faqHelpLink.setContent(appConfig.btnOpenHelpFAQs), this.$.SettingsPage.$.lblExtClassSel.setContent(appConfig.msgSelectExtClasses), this.$.SettingsPage.$.lblVibrateOnWrongAnswer.setContent(appConfig.msgVibrateOnWrongAnswer), this.$.SettingsPage.$.lblDisplayExplanationOnWrongAnswer.setContent(appConfig.msgExplanationOnWrongAnswer), this.$.SettingsPage.$.lblDisplayHintOnQuickstartLastErrors.setContent(appConfig.msgHintOnQuickstartLastErrors), appConfig.appMultilingual ? this.$.SettingsPage.$.lblDisplayHintOnVoiceOver.setContent(appConfig.msgHintOnVoiceOver) : this.$.SettingsPage.$.lblDisplayHintOnVoiceOver.setContent(appConfig.msgHintOnVoiceOverGermanApp), this.$.SettingsPage.$.downloadVideosButton.setContent(appConfig.btnCaptionDownloadVideos), this.$.SettingsPage.$.removeVideosButton.setContent(appConfig.btnCaptionRemoveVideos), this.$.SettingsPage.$.downloadAudiosButton.setContent(appConfig.btnCaptionDownloadAudios), this.$.SettingsPage.$.removeAudiosButton.setContent(appConfig.btnCaptionRemoveAudios), this.$.SettingsPage.$.lblPasswordConditions.setContent(appConfig.msgPasswordConditions), this.$.SettingsPage.$.inputUserLastname.setPlaceholder(appConfig.msgLoginLastnameWord), this.$.SettingsPage.$.inputUserMembershipNumber.setPlaceholder(appConfig.msgLoginMembershipnumberWord), this.$.SettingsPage.$.btnRegisterUserAccount.setContent(appConfig.msgRegisterWord), this.$.ChapterPage.$.btnBackHome.setContent(appConfig.msgCancelApply), this.$.ChapterPage.$.btnPhoneSwitchToQuestions.setContent(appConfig.msgBtnSelect);
},
refreshPageHeaders: function() {
try {
this.$.WelcomePage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.WelcomePage.$.PageHeader.render();
} catch (a) {}
try {
this.$.LoginPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.LoginPage.$.PageHeader.render();
} catch (a) {}
try {
this.$.HelpPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.HelpPage.$.PageHeader.render();
} catch (a) {}
try {
this.$.MarkedPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.MarkedPage.$.PageHeader.render();
} catch (a) {}
try {
this.$.SettingsPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.SettingsPage.$.PageHeader.render();
} catch (a) {}
try {
this.$.StatisticsPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.StatisticsPage.$.PageHeader.render();
} catch (a) {}
try {
this.$.SetPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.SetPage.$.PageHeader.render();
} catch (a) {}
try {
this.$.ChapterPage.$.PageHeader.setSelectedclass(dbTableClasses[appConfig.userClassSelectedId].name), this.$.ChapterPage.$.PageHeader.render();
} catch (a) {}
appConfig.userUnlockedApp && (appConfig.appAdShowAds = !1);
},
quitApp: function() {
this.syncApp(), navigator && navigator.app ? navigator.app.exitApp() : navigator && navigator.device && navigator.device.exitApp();
},
displayAppMessage: function(a) {
alert(a, this);
},
openLogoPage: function() {
window.location = appConfig.urlLogoPage;
},
deviceReady: function() {
this.inherited(arguments), window.open = cordova.InAppBrowser.open, enyo.job("verifyDeviceResolution" + Math.random(), enyo.bind(this, "verifyDeviceResolution"), 500), document.addEventListener("backbutton", function(a) {
fsapp.androidBackButton(), a.preventDefault();
}, !1);
if (!deviceReadyAlreadyDone) {
deviceReadyAlreadyDone = !0, appDB.initSQLite();
try {
appDB.getItem("selclassid") != null && (appConfig.userClassSelectedId = appDB.getItem("selclassid")), setClassIdByUrl != -1 && (appConfig.userClassSelectedId = setClassIdByUrl);
} catch (a) {}
try {
this.refreshPageHeaders();
} catch (a) {}
appConfig.appDevelopmentMode = !1, appConfig.appOnMobileDevice = !0, appConfig.appPlatformId = cordova.platformId;
if (appConfig.appPlatformId == "android") try {
inAppPurchaseInitialised || inAppPurchaseInitAndroid();
} catch (a) {
alert("IAP init error: " + a.message + "<br /><br />Please send a screenshot of this message to our support team at help@theorie24.de<br /><br />Thank you!", this);
}
if (appConfig.appPlatformId == "ios") try {
inAppPurchaseInitialised || inAppPurchaseInitIOS();
} catch (a) {}
appConfig.appOnMobileDevice ? (window.isTablet ? (this.addClass("tabletapp"), userDevicePlatform = "tablet", userDevicePlatformDebug = "tablet: ") : (this.addClass("phoneapp"), userDevicePlatform = "phone", userDevicePlatformDebug = "phone: "), this.$.WelcomePage.refreshBackgroundImages(), this.removeClass("webapp"), this.refreshPageHeaders()) : (this.addClass("webapp"), userDevicePlatformDebug = "web: "), this.$.SettingsPage.render(), enyo.dispatcher.listen(document, "backbutton");
}
},
displaySlowInternetConnectionMessage: function() {
alert("<u>Hinweis:</u> Ihre Online-Verbindung ist zur Zeit eingeschr\u00e4nkt, dies kann zu Fehlern beim Abspielen von Videos oder der Synchronisation f\u00fchren.<br />Wir empfehlen, die Videos per Wifi auf das Ger\u00e4t herunterzuladen \u00fcber den Men\u00fcpunkt 'Einstellungen'", this);
},
videoended: function() {
this.openTestingPageFromVideo();
},
videoready: function() {
this.$.FullscreenVideoPage.startAndroidVideo();
},
videoplayerror: function() {
alert(appConfig.msgErrorNoOnlineConnection + "<br /><hr /><br />Unter 'Einstellungen' k\u00f6nnen Sie die Videos herunterladen, um sie auch offline abzuspielen.", this);
},
checkDownloadedVideoFiles: function(a) {
this.$.SettingsPage.checkDownloadedVideoFiles(a);
},
setCheckDownloadedVideoFile: function(a, b) {
b && this.downloadedVideoCounter++;
},
displayResultOfVideoFileCheck: function() {
this.unlockDisplay();
if (this.downloadedVideoCounter == this.totalVideoCounter) var a = appConfig.msgSettingsVideoCounterAll; else var a = this.downloadedVideoCounter + " " + appConfig.msgSettingsVideoCounterOf + " " + this.totalVideoCounter;
if (this.downloadedVideoCounter > 0) {
var b = this.$.SettingsPage.$.downloadVideosButton.getContent();
b.indexOf("%") == -1 ? this.$.SettingsPage.$.removeVideosButton.setDisabled(!1) : this.$.SettingsPage.$.removeVideosButton.setDisabled(!0);
} else this.$.SettingsPage.$.removeVideosButton.setDisabled(!0);
alert(appConfig.msgSettingsVideoCounterAlertPart1 + " " + a + " " + appConfig.msgSettingsVideoCounterAlertPart2, this);
},
continueDownloadingAudios: function(a) {
this.$.SettingsPage.startDownloadingAudios(a);
},
updateAudioDownloadStatus: function(a) {
this.$.SettingsPage.$.downloadAudiosButton.setContent(a), a == appConfig.msgAudioDlComplete && (this.$.SettingsPage.$.downloadAudiosButton.setDisabled(!1), this.$.SettingsPage.$.removeAudiosButton.setDisabled(!1));
},
continueDownloadingVideos: function(a) {
this.$.SettingsPage.startDownloadingVideos(a);
},
updateVideoDownloadStatus: function(a) {
this.$.SettingsPage.$.downloadVideosButton.setContent(a), a == appConfig.msgVideoDlComplete && (this.$.SettingsPage.$.downloadVideosButton.setDisabled(!1), this.$.SettingsPage.$.removeVideosButton.setDisabled(!1));
},
downloadDocUpdateComplete: function(a) {
this.$.WelcomePage.$.mainDynamicMenu.openExtDataFileInWebviewAfterDownload(a);
},
catchAndroidBackButton: function() {},
androidBackButton: function(a) {
if (this.currentPageId == 10 || this.currentPageId == 13) {
fsapp.showHomeScreen(), a.preventDefault();
return;
}
if (this.currentPageId == 6 || this.currentPageId == 7 || this.currentPageId == 12) {
var b = alert(appConfig.msgConfirmQuitTesting, this, {
cancelText: appConfig.msgBtnCaptionNo,
confirmText: appConfig.msgBtnCaptionYes,
onConfirm: function(a) {
this.hide(), fsapp.openMainPage(), this.destroy();
}
});
a.preventDefault();
} else this.currentPageId == 0 ? this.$.WelcomePage.$.mainDynamicMenu.mainMenuOnDisplay ? (navigator.Backbutton.goHome(function() {
log("success");
}, function() {
log("fail");
}), a.preventDefault()) : (fsapp.showHomeScreen(), a.preventDefault()) : (this.openMainPage(), a.preventDefault()), a.preventDefault();
}
}), Chart.pluginService.register({
afterUpdate: function(a) {
if (a.config.options.elements.center) {
var b = Chart.helpers, c = a.config.options.elements.center, d = Chart.defaults.global, e = a.chart.ctx, f = b.getValueOrDefault(c.fontStyle, d.defaultFontStyle), g = b.getValueOrDefault(c.fontFamily, d.defaultFontFamily);
if (c.fontSize) var h = c.fontSize; else {
e.save();
var h = b.getValueOrDefault(c.minFontSize, 1), i = b.getValueOrDefault(c.maxFontSize, 256), j = b.getValueOrDefault(c.maxText, c.text);
do {
e.font = b.fontString(h, f, g);
var k = e.measureText(j).width;
if (!(k < a.innerRadius * 2 && h < i)) {
h -= 1;
break;
}
h += 1;
} while (!0);
e.restore();
}
a.center = {
font: b.fontString(h, f, g),
fillStyle: b.getValueOrDefault(c.fontColor, d.defaultFontColor)
};
}
},
beforeDraw: function(a) {
if (a.center) {
var b = a.config.options.elements.center, c = a.chart.ctx;
try {
var d = b.frontPageGraph;
} catch (e) {
var d = !1;
}
if (!d) {
c.save(), c.font = a.center.font, c.fillStyle = a.center.fillStyle, c.textAlign = "center", c.textBaseline = "middle";
var f = (a.chartArea.left + a.chartArea.right) / 2, g = (a.chartArea.top + a.chartArea.bottom) / 1.4;
c.fillText(b.text, f, g), c.restore();
} else {
if (appConfig.appDisplayIconInDonutCenterOnWelcomePage) {
c.save(), c.font = a.center.font, c.fillStyle = a.center.fillStyle, c.textAlign = "center", c.textBaseline = "middle";
var f = (a.chartArea.left + a.chartArea.right) / 2, g = (a.chartArea.top + a.chartArea.bottom) / 2.3, h = Chart.helpers, i = Chart.defaults.global, j = "#666666", k = h.getValueOrDefault(b.fontStyle, i.defaultFontStyle), l = h.getValueOrDefault(b.fontFamily, i.defaultFontFamily), m = h.getValueOrDefault(b.minFontSize, 1), n = h.getValueOrDefault(b.maxFontSize, 256), o = h.getValueOrDefault("--- Fit f\u00fcr die Pr\u00fcfung ---", "--- Fit f\u00fcr die Pr\u00fcfung ---");
do {
c.font = h.fontString(m, k, l);
var p = c.measureText(o).width;
if (!(p < a.innerRadius * 2 && m < n)) {
m -= 1;
break;
}
m += 1;
} while (!0);
if (appConfig.appVariantId == "fsp") {
fsapp.$.WelcomePage.$.contextHelpIconSmall.setSrc("assets/fsp_icon.png");
var q = document.getElementById("contextHelpIconSmall");
c.drawImage(q, f - m * 4, g - m * 2, m * 8, m * 8);
} else {
var f = (a.chartArea.left + a.chartArea.right) / 2, g = (a.chartArea.top + a.chartArea.bottom) / 1.9 + m * 2, l = "Material Icons";
c.font = h.fontString(m * 1.75, k, l), c.fillText(appConfig.icoStatisticsIcon, f, g);
}
} else {
c.save(), c.font = a.center.font, c.fillStyle = a.center.fillStyle, c.textAlign = "center", c.textBaseline = "middle";
var f = (a.chartArea.left + a.chartArea.right) / 2, g = (a.chartArea.top + a.chartArea.bottom) / 2.3;
c.fillText(b.text, f, g);
var h = Chart.helpers, i = Chart.defaults.global, j = "#666666", k = h.getValueOrDefault(b.fontStyle, i.defaultFontStyle), l = h.getValueOrDefault(b.fontFamily, i.defaultFontFamily), m = h.getValueOrDefault(b.minFontSize, 1), n = h.getValueOrDefault(b.maxFontSize, 256), o = h.getValueOrDefault("--- Fit f\u00fcr die Pr\u00fcfung ---", "--- Fit f\u00fcr die Pr\u00fcfung ---");
do {
c.font = h.fontString(m, k, l);
var p = c.measureText(o).width;
if (!(p < a.innerRadius * 2 && m < n)) {
m -= 1;
break;
}
m += 1;
} while (!0);
c.fillStyle = j, c.textAlign = "center", c.textBaseline = "middle";
var f = (a.chartArea.left + a.chartArea.right) / 2, g = (a.chartArea.top + a.chartArea.bottom) / 1.9;
c.fillText(appConfig.msgFilterReadyForExam, f, g);
var f = (a.chartArea.left + a.chartArea.right) / 2, g = (a.chartArea.top + a.chartArea.bottom) / 1.9 + m * 2, l = "Material Icons";
c.font = h.fontString(m * 1.75, k, l), c.fillText(appConfig.icoStatisticsIcon, f, g);
}
c.restore();
}
}
}
}), String.prototype.rot13 = function() {
return this.replace(/[a-zA-Z]/g, function(a) {
return String.fromCharCode((a <= "Z" ? 90 : 122) >= (a = a.charCodeAt(0) + 13) ? a : a - 26);
});
}, jQuery(document).ready(function() {
window.addEventListener("message", function(a) {
try {
var b = a.data.task;
switch (b) {
case "openIAB":
var c = a.data.url;
openWebview(c);
}
} catch (a) {}
return !0;
});
});

// Pages.js

enyo.kind({
name: "dynamicMenu",
kind: "Control",
published: {},
events: {
onMainButtonTap: "",
onMenuCaptionChanged: "",
onHandsOnRouteButtonTap: "",
onHandsOnTopicButtonTap: "",
onHandsOnSimulationButtonTap: "",
onChapterButtonTap: "",
onFocusChapterButtonTap: "",
onMarkedButtonTap: "",
onSearchButtonTap: "",
onSetButtonTap: "",
onSimulationButtonTap: "",
onStatisticsButtonTap: "",
onClassButtonTap: "",
onProfileButtonTap: "",
onHelpButtonTap: "",
onHelpImprintButtonTap: "",
onRateButtonTap: "",
onSchoolFinderButtonTap: "",
onQuickstartButtonTap: "",
onQuickstartWrongAnswersButtonTap: "",
onUnlockAppTap: "",
onLockAppButtonTap: "",
onQuitButtonTap: "",
onSyncButtonTap: "",
onInAppPurchase: "",
onDelInAppPurchase: ""
},
initialized: !1,
hideInAppPurchaseButtons: !1,
currentMenu: new array,
currentHelpFile: "",
currentMenuCaption: "",
mainMenuOnDisplay: !1,
extDataFileForWebview: "",
lastSelected: new Object,
lastInSender: new Object,
components: [],
create: function() {
this.inherited(arguments), this.hide(), this.createComponent({
tag: "div",
classes: "fade-in",
style: "height:1px; clear:both;margin-bottom:8px;"
});
},
rendered: function() {
this.inherited(arguments), this.initialized = !0;
},
initCurrentMenu: function() {
appConfig.appLockable && !appConfig.userUnlockedApp ? this.currentMenu = appMenuLocked : this.currentMenu = appMenu;
},
fetchIAPStatusFromDB: function() {
var a = !1;
try {
var b = appDB.getInAppPurchaseStatus();
b != null && b.verified == 1 && (a = !0);
} catch (c) {}
return a;
},
classInfoTap: function() {
fsapp.openSettingsPageCategory("class");
},
dateInfoTap: function() {
fsapp.openSettingsPageCategory("date");
},
openMainmenu: function() {
this.openMainmenu2();
},
openMainmenu2: function() {
var a = new Date, b = a.getTime(), c = "";
this.mainMenuOnDisplay = !0;
var d = 0, e = !1, f = dbTableClasses[appConfig.userClassSelectedId].icon.replace(".gif", "_b.png");
this.destroyComponents();
if (!appInitialized) {
userDevicePlatform != "web";
return;
}
var g = "";
if (appConfig.appLockMode == 2 && appConfig.appMultilingual && !appConfig.userUnlockedApp) {
var h = appConfig.appOpenQuestionsInMultilingualLite - parseInt(appDB.readMasterQuestionCounter(), 10);
g = appConfig.msgRemainingOpenQuestions.replace("%REMAININGQUESTIONS%", Math.max(0, h));
}
appConfig.displayClassIconAboveMenu ? this.createComponent({
tag: "div",
ontap: "classInfoTap",
content: "<span style='display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:90%'><img src='assets/" + f + "' alt='' style='opacity:1;display:inline;height:0.9em;position:relative;top:3px;' /> " + appConfig.msgClass + " " + dbTableClasses[appConfig.userClassSelectedId].name + g + "</span>",
classes: "submenuheader",
allowHtml: !0,
style: "padding-right:20px;font-weight:bold;text-transform:uppercase;font-size:110%;text-align:center;margin-bottom:4px;color:#666;"
}) : (this.createComponent({
tag: "div",
ontap: "classInfoTap",
content: "<span style='display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:90%;'>" + appConfig.msgClass + " " + dbTableClasses[appConfig.userClassSelectedId].name + g + "</span>",
allowHtml: !0,
style: "padding-right:20px;font-weight:bold;text-transform:uppercase;font-size:110%;text-align:center;margin-bottom:4px;color:#666;",
classes: "submenuheader"
}), appConfig.appHas2DBs && appConfig.appDisplaySelTestDateAboveMainMenu && (appConfig.userDb2selected ? c = appConfig.msgSettingsDBSwitchAfter + appConfig.db2ValidFromDate : c = appConfig.msgSettingsDBSwitchBefore + appConfig.db2ValidFromDate, this.createComponent({
tag: "div",
ontap: "dateInfoTap",
content: "<span style='font-size:90%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:90%;'>" + c + "</span>",
allowHtml: !0,
style: "",
classes: "submenuheaderSubline"
}))), this.currentMenuCaption = appConfig.msgClass + " " + dbTableClasses[appConfig.userClassSelectedId].name, this.createComponent({
tag: "div",
classes: "submenuheaderdecorator",
style: "height:1px; border-bottom:1px solid " + appConfig.appBargraphEmptyColor + ";clear:both;margin-bottom:8px;"
});
for (var i = 0; i < this.currentMenu.items.length; i++) {
e = !e;
var j = !0;
if (this.currentMenu.items[i].visible != undefined) {
this.currentMenu.items[i].visible == "only-mobile" && userDevicePlatform == "web" && (j = !1), this.currentMenu.items[i].visible == "only-web" && userDevicePlatform != "web" && (j = !1), this.currentMenu.items[i].visible == "only-mobile-notpurchased" && (appConfig.appOffersInAppPurchase || (j = !1), userDevicePlatform == "web" && (j = !1)), this.hideInAppPurchaseButtons && this.currentMenu.items[i].visible == "only-mobile-notpurchased" && (j = !1), this.currentMenu.items[i].visible == "only-mobile-notpurchased" && this.fetchIAPStatusFromDB() && (j = !1), this.currentMenu.items[i].visible == "only-web-synclocked" && (appConfig.appSyncLocked || (j = !1), userDevicePlatform != "web" && (j = !1), log("only-web-synclocked: appConfig.appSyncLocked: " + appConfig.appSyncLocked + ", web: " + userDevicePlatform));
if (this.currentMenu.items[i].visible == "only-app-synclocked" || this.currentMenu.items[i].visible == "only-app-synclocked-mark-iap") appConfig.appSyncLocked || (j = !1), userDevicePlatform == "web" && (j = !1);
this.currentMenu.items[i].visible == "only-web-syncunlocked" && (appConfig.appSyncLocked && (j = !1), userDevicePlatform != "web" && (j = !1)), this.currentMenu.items[i].visible == "only-app-syncunlocked" && (appConfig.appSyncLocked && (j = !1), userDevicePlatform == "web" && (j = !1)), this.currentMenu.items[i].visible == "only-multilingual" && !appConfig.appMultilingual && (j = !1), this.currentMenu.items[i].mlvisibleonly == "true" && !appConfig.appMultilingual && (j = !1);
}
if (j) {
if (e) var k = "btnmainmenuleft"; else var k = "btnmainmenuright";
if (typeof this.currentMenu.items[i].addclass != "undefined") {
e = !1;
var k = this.currentMenu.items[i].addclass;
}
if (typeof this.currentMenu.items[i].classes != "undefined") var l = this.currentMenu.items[i].classes; else var l = "";
if (this.currentMenu.items[i].label == "-") this.createComponent({
tag: "div",
classes: "fade-in",
style: "height:1px; border-bottom:1px solid " + appConfig.appBargraphEmptyColor + ";clear:both;margin-bottom:8px;"
}), e = !1; else {
var m = "";
(this.currentMenu.items[i].visible == "only-app-synclocked-mark-iap" && appConfig.appSyncLocked || this.currentMenu.items[i].visible == "mark-iap") && (appConfig.appOffersInAppPurchase || appConfig.appDisplayIAPLabels) && !this.hideInAppPurchaseButtons && (this.fetchIAPStatusFromDB() || (m = " <span style='position: relative; top: -0.4em; font-size:60%; font-weight:bold; color:" + appConfig.msgPROVersionButtonLabelColor + ";'>" + appConfig.msgPROVersionButtonLabel + "</span>")), this.createComponent({
kind: "onyx.Button",
content: this.currentMenu.items[i].label + m + appConfig.icoMnuBtnNext,
allowHtml: !0,
attributes: {
func: this.currentMenu.items[i].function,
idx: i,
params: this.currentMenu.items[i].parameters,
help: this.currentMenu.items[i].help
},
style: "background-color:" + appConfig.btnBgColorMainMenu + ";color:" + appConfig.btnFGColor,
classes: "toplevelmenu spinningmenudelay" + d + " spinningmenu onyx-blue btnmainmenu fade-in fader" + d + " " + k + " " + l,
ontap: "openSubmenu"
}, {
owner: this
}), d++;
}
}
}
this.doMenuCaptionChanged(), fsapp.lastPageId == 0 && (this.currentHelpFile = "", log("reset current helpfile in dynamic menu function")), this.createComponent({
tag: "div",
style: "height:1px;clear:both;margin-bottom:8px;"
}), appConfig.msgFineprint != "" && this.createComponent({
tag: "div",
classes: "small-fineprint",
style: "clear:both;margin-bottom:8px;",
allowHtml: !0,
content: appConfig.msgFineprint
}), this.createComponent({
tag: "div",
style: "height:1px;clear:both;margin-bottom:8px;"
}), this.initialized && (this.render(), enyo.job("menuFadeIn" + Math.random(), enyo.bind(this, "menuFadeIn2"), 500));
},
fadeInMenu: function() {
enyo.job("menuFadeIn2", enyo.bind(this, "menuFadeIn2"), 800);
},
menuFadeIn2: function() {
this.show();
},
hideInAppPurchaseButton: function() {
this.hideInAppPurchaseButtons = !0, this.openMainmenu();
},
showInAppPurchaseButton: function() {
this.hideInAppPurchaseButtons = !1, this.openMainmenu();
},
fadeOutMainMenuItems: function() {
fsapp.$.WelcomePage.$.mainDynamicMenu.openSubmenu2();
},
openSubmenu2: function() {
try {
var a = this.lastSelected, b = this.lastInSender, c = a.idx;
b.content == "Lernen" && (b.content = "Training");
} catch (d) {}
this.destroyComponents(), this.show(), this.createComponent({
kind: "onyx.Button",
allowHtml: !0,
content: appConfig.icoMnuBtnPrev,
classes: "submenuheaderdecorator spinningmenudelay0 spinningmenu onyx-blue",
style: "position:absolute;height:30px;width:30px;opacity:1;border:none;padding:0;text-align:center !important;",
ontap: "openMainmenu"
}, {
owner: this
}), this.createComponent({
tag: "div",
classes: "submenuheader",
content: b.content,
allowHtml: !0,
style: "font-weight:bold;text-transform:uppercase;font-size:110%;text-align:center;margin-bottom:4px;color:#666;",
ontap: "openMainmenu"
}, {
owner: this
}), this.createComponent({
tag: "div",
classes: "submenuheaderdecorator",
style: "height:1px; border-bottom:1px solid rgba(180,180,180,.5);clear:both;margin-bottom:8px;"
}), this.currentMenuCaption = b.content;
var e = 0;
try {
var f = new Object;
f = appDB.getItem("markedquestions");
var g = f.markedQuestionIds, h = g.split(",");
for (var i = 0; i < h.length; i++) h[i] != "" && typeof dbTblQ[h[i]] != "undefined" && e++;
} catch (d) {}
var j = 0;
for (var k in dbTblQ) {
if (j >= appConfig.quickstartQuestions + 1) break;
if (appConfig.userClassSelectedId == appConfig.appClassMofaId && dbTblQ[k].basic_mofa == 1 || appConfig.userClassSelectedId != appConfig.appClassMofaId && dbTblQ[k].basic == 1 || dbTblQ[k].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var l = appDB.readQuestionStatistics(k), m = "", n = "1";
if (typeof l == "object") try {
m = l.answeredAll, n = m.substr(0, 1);
} catch (o) {}
n != "1" && j++;
}
}
if (j > appConfig.quickstartQuestions) var p = "" + appConfig.quickstartQuestions + "+"; else var p = j;
var q = 0, r = !1;
for (var i = 0; i < this.currentMenu.items[c].subitems.length; i++) {
var s = !0;
if (this.currentMenu.items[c].subitems[i].visible != undefined) {
this.currentMenu.items[c].subitems[i].visible == "only-mobile" && userDevicePlatform == "web" && (s = !1), this.currentMenu.items[c].subitems[i].visible == "only-web" && userDevicePlatform != "web" && (s = !1), this.currentMenu.items[c].subitems[i].visible == "only-mobile-notpurchased" && (appConfig.appOffersInAppPurchase || (s = !1)), this.currentMenu.items[c].subitems[i].mlvisible == "false" && appConfig.appMultilingual && (s = !1), this.currentMenu.items[c].subitems[i].visible == "only-multilingual" && !appConfig.appMultilingual && (s = !1), this.currentMenu.items[c].subitems[i].mlvisibleonly == "true" && !appConfig.appMultilingual && (s = !1);
if (appConfig.appUnlockSyncByUser && appConfig.appPlatformId != "web") try {
appDB.getItem("user") != null && (appConfig.userUnlockedApp = !0, appConfig.appUnlockSyncByUser && (appConfig.appSyncLocked = !1), appConfig.userAutoSync = !1, appDB.getItem("autosync") != null && (appConfig.userAutoSync = parseInt(appDB.getItem("autosync"), 10) == 1, appConfig.urlStatisticSync == "" && (appConfig.userAutoSync = !1)), appConfig.userAutoSync && this.syncApp());
} catch (d) {
log("error init function: " + d);
}
this.currentMenu.items[c].subitems[i].visible == "only-web-synclocked" && (appConfig.appSyncLocked || (s = !1), userDevicePlatform != "web" && (s = !1));
if (this.currentMenu.items[c].subitems[i].visible == "only-app-synclocked-mark-iap" && appConfig.appMultilingual) !appConfig.userUnlockedApp && appConfig.appMultilingualLocked && (s = !1), appConfig.appSyncLocked || (s = !1); else if (this.currentMenu.items[c].subitems[i].visible == "only-app-synclocked" || this.currentMenu.items[c].subitems[i].visible == "only-app-synclocked-mark-iap") appConfig.appSyncLocked || (s = !1), userDevicePlatform != "web";
this.currentMenu.items[c].subitems[i].visible == "only-web-syncunlocked" && (appConfig.appSyncLocked && (s = !1), userDevicePlatform != "web" && (s = !1)), this.currentMenu.items[c].subitems[i].visible == "only-app-syncunlocked" && (appConfig.appSyncLocked && (s = !1), userDevicePlatform == "web" && (s = !1));
if (this.currentMenu.items[c].subitems[i].visible == "only-app-synclocked-mark-iap") try {
appDB.getItem("userdelacc") != null && (s = !1);
} catch (d) {}
if (this.currentMenu.items[c].subitems[i].visible == "only-mobile-notpurchased") {
if (!appConfig.appOffersInAppPurchase || appConfig.userUnlockedApp) s = !1;
userDevicePlatform == "web" && (s = !1);
}
}
if (s) {
r = !r;
var t = "";
r ? t = "btnmainmenuleft" : t = "btnmainmenuright", this.currentMenu.items[c].subitems[i].addclass != undefined && (r = !1, t = this.currentMenu.items[c].subitems[i].addclass);
if (this.currentMenu.items[c].subitems[i].label == "-") this.createComponent({
tag: "div",
style: "height:1px; border-bottom:1px solid rgba(180,180,180,.5);clear:both;margin-bottom:8px;"
}), r = !1; else {
var u = "", v = "", w = this.currentMenu.items[c].subitems[i].label;
w = w.replace(/%MARKEDQUESTIONS%/gi, e), w = w.replace(/%LASTERRORS%/gi, p), w = w.replace(/%SELECTEDCLASS%/gi, dbTableClasses[appConfig.userClassSelectedId].name), w = w.replace(/%SELECTEDLANG%/gi, appConfig.appSelectedAltLanguageISO2), appConfig.appHas2DBs && (appConfig.userDb2selected ? w = w.replace(/%EXAMDATE%/gi, appConfig.msgWordTestAfter + appConfig.db2ValidFromDate) : w = w.replace(/%EXAMDATE%/gi, appConfig.msgWordTestBefore + appConfig.db2ValidFromDate)), (this.currentMenu.items[c].subitems[i].visible == "only-app-synclocked-mark-iap" && appConfig.appSyncLocked || this.currentMenu.items[c].subitems[i].visible == "mark-iap") && (appConfig.appOffersInAppPurchase || appConfig.appDisplayIAPLabels) && !this.hideInAppPurchaseButtons && (userDevicePlatform != "web" || !!appConfig.appSyncLocked || !appConfig.appUnlockSyncByUser) && (this.fetchIAPStatusFromDB() || (u = "", appConfig.useAnimatedIAPIcon ? (w = w.replace(".png", "-iap.png' class='rotating' /><img src='assets/icoWhiteCheckmark.png' style='height:1em;min-height:40px;padding:0;position:absolute;left:0;opacity:0;z-index:99999' alt='+' /> <img src='assets/icoWhiteCheckmark.png' style='opacity:1;height:1em;min-height:40px;padding:0;' alt='' x"), w = w.replace("md-menu", "md-iaplock"), w = w.replace("i> <span>", "i> <img src='assets/icoIAPLock.png' style='position:absolute;left:8px;top:10px;height:1em;min-height:40px;opacity:1;' class='rotating' /><img src='assets/icoWhiteCheckmark.png' style='height:1em;min-height:40px;padding:0;position:absolute;left:10px;top:10px;opacity:1;z-index:99999' alt='+' /> <span>"), v = "iapicon") : (w = w.replace(".png", "-iap.png' class='rotating' style='height:1em;min-height:32px;padding:0;' alt='' "), w = w.replace("md-menu", "md-iaplock"), w = w.replace("i> <span>", "i> <img src='assets/icoIAPLock.png' style='position:absolute;left:8px;top:10px;height:1em;min-height:40px;opacity:1;' class='rotating' /><img src='assets/icoWhiteCheckmark.png' style='height:1em;min-height:40px;padding:0;position:absolute;left:10px;top:10px;opacity:1;z-index:99999' alt='+' /> <span>"), v = "iapicon"))), this.createComponent({
kind: "onyx.Button",
allowHtml: !0,
attributes: {
func: this.currentMenu.items[c].subitems[i].function,
params: this.currentMenu.items[c].subitems[i].parameters,
help: this.currentMenu.items[c].subitems[i].help,
visible: this.currentMenu.items[c].subitems[i].visible,
idx: i
},
content: w + u + appConfig.icoMnuBtnNext,
style: "background-color:" + appConfig.btnBgColorMainMenu + ";color:" + appConfig.btnFGColor,
classes: "spinningmenudelay" + q + " spinningmenu onyx-blue btnmainmenu fadeX-in faderX" + q + " " + t + " " + v,
ontap: "openSubmenu"
}, {
owner: this
}), q++;
}
}
}
this.render(), this.doMenuCaptionChanged();
},
openSubmenuNoFade: function(a, b) {
if (typeof a == "undefined") {
var c = this.lastSelected;
a = this.lastInSender;
} else var c = a.getAttributes();
try {
typeof c.help != "undefined" && (this.currentHelpFile = c.help, log("set current help file: " + this.currentHelpFile));
} catch (d) {
alert("Error: openSubmenuNoFade: helpfile", fsapp);
}
try {
if (c.func == "" || c.func == "openhelpfile") this.mainMenuOnDisplay = !1, this.lastSelected = c, this.lastInSender = a, this.openSubmenu2();
} catch (d) {
alert("Error: openSubmenuNoFade: func", fsapp);
}
},
openSubmenu: function(a, b) {
try {
if (typeof a == "undefined") {
var c = this.lastSelected;
a = this.lastInSender;
} else var c = a.getAttributes();
} catch (d) {
var c = this.lastSelected;
a = this.lastInSender;
}
c.help != undefined && (this.currentHelpFile = c.help, log("set current help file: " + this.currentHelpFile));
if (c.func == "") this.mainMenuOnDisplay = !1, this.lastSelected = c, this.lastInSender = a, this.fadeOutMainMenuItems(); else switch (c.func) {
case "displayappinfo":
fsapp.displayAppInfo();
break;
case "byhandsonroute":
this.doHandsOnRouteButtonTap();
break;
case "byhandsontopic":
this.doHandsOnTopicButtonTap();
break;
case "handsonsimulation":
this.doHandsOnSimulationButtonTap();
break;
case "openadbanner":
appConfig.appAdShowAds = !0;
var e = c.params.split(",");
fsapp.displayAd(parseInt(e[0], 10), parseInt(e[1], 10));
break;
case "quickstart":
this.doQuickstartButtonTap();
break;
case "bychapter":
this.doChapterButtonTap();
break;
case "byfocuschapter":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : this.doFocusChapterButtonTap();
break;
case "lastwronganswers":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : this.doQuickstartWrongAnswersButtonTap();
break;
case "markedquestions":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : this.doMarkedButtonTap();
break;
case "searchquestions":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : this.doSearchButtonTap();
break;
case "byset":
this.doSetButtonTap();
break;
case "simulation":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : this.doSimulationButtonTap();
break;
case "profile":
this.doProfileButtonTap();
break;
case "statistics":
this.doStatisticsButtonTap();
break;
case "createLBU":
appDB.writeLocalStorageToFile();
break;
case "restoreLBU":
appDB.readLocalStorageBackupMetadata(!0);
break;
case "clearLS":
alert("LocalStorage wird gel\u00f6scht.", this), appDB.clearLocalStorage();
break;
case "drivingschoolpage":
try {
var f = appDB.getItem("apiLoginData");
openWebviewDirect(f.company_url);
} catch (d) {}
break;
case "settings":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() && (c.visible == "mark-iap" || c.visible == "only-app-synclocked-mark-iap") || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : fsapp.openSettingsPageCategory(c.params);
break;
case "openfullscreenhelp":
window.location = "assets/help/einleitung.html";
break;
case "openurl":
openWebviewDirect(c.params);
break;
case "openhelpfile":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() && (c.visible == "mark-iap" || c.visible == "only-app-synclocked-mark-iap") || appConfig.forceAdDisplayForDebug ? fsapp.displayAd(appConfig.appAdTriggerMenuButton) : appConfig.appMultilingual ? fsapp.openHelpFileInWebview(appConfig.appAvailableAppLanguages[appConfig.appSelectedAppLanguageISO2].langISO2 + "/" + c.params) : fsapp.openHelpFileInWebview(c.params);
break;
case "openlocalhelpfile":
if (!appConfig.appOnMobileDevice) if (appDB.hasNetworkConnection()) switch (c.params) {
case "impressum.html":
openWebviewDirect(appConfig.urlImprintDoc);
break;
case "datenschutz.html":
openWebviewDirect(appConfig.urlPrivacyDoc);
} else fsapp.openHelpFileInWebview(c.params); else this.openExtDataFileInWebview(c.params);
break;
case "rate-app":
this.doRateButtonTap();
break;
case "inapppurchase":
appConfig.appLockMode == 2 && !appConfig.userUnlockedApp && !this.fetchIAPStatusFromDB() && fsapp.makeInAppPurchaseIOS();
break;
case "unlock-webversion":
fsapp.openLoginPage();
break;
case "delinapppurchase":
alert("In-App-Purchase wurde entfernt!", this), this.doDelInAppPurchase();
break;
case "logout-synclock":
var g = alert(appConfig.msgLogoutMsgbox, this, {
cancelText: appConfig.msgAppNo,
confirmText: appConfig.msgAppYes,
onConfirm: function(a) {
this.hide(), fsapp.lockAppSyncLock(), this.destroy();
}
});
break;
case "logout":
var g = alert(appConfig.msgLogoutMsgbox, this, {
cancelText: appConfig.msgAppNo,
confirmText: appConfig.msgAppYes,
onConfirm: function(a) {
this.hide(), fsapp.lockApp(), this.destroy();
}
});
break;
case "login":
this.doUnlockAppTap();
break;
case "performsync":
fsapp.syncAppCheckConnection();
break;
case "share":
fsapp.shareThisApp();
break;
case "introslideshow":
fsapp.currentSlideshowSlide = -1, fsapp.displayIntroSlideshow();
break;
default:
}
},
processDocUpdateError: function() {
alert("Es trat ein Fehler auf bei der Pr\u00fcfung auf ein Update.", this);
},
processDocUpdateResponse: function(a, b) {
if (appConfig.appPlatformId == "android") var c = cordova.file.dataDirectory + this.extDataFileForWebview; else var c = cordova.file.dataDirectory + this.extDataFileForWebview;
if (!b) {
openWebviewDirectNoFooter(c);
return;
}
var d = JSON.parse(b), e = 0;
try {
e = d.AppFiles.length;
} catch (f) {}
for (var g = 0; g < e; g++) {
var h = d.AppFiles[g].FileName, i = d.AppFiles[g].Version;
try {
k = appDB.getItem("doc:" + h);
if (k != null) var j = k.ver; else var j = "";
if (i > j) {
var k = new Object;
k.ver = i, appDB.setItem("upddoc:" + h, k), this.downloadDocUpdate(h);
} else this.extDataFileForWebview == h && openWebviewDirectNoFooter(c);
} catch (f) {}
}
},
downloadDocUpdate: function(a) {
if (appConfig.appPlatformId == "android") var b = cordova.file.dataDirectory + a; else var b = cordova.file.dataDirectory + a;
var c = location.href.replace("/index.html", ""), d = c + "/assets/help/" + a, e = "https://adac.theorie24.de/docs/update/" + appConfig.appPlatformId + "/" + a, f = new FileTransfer;
f.download(e, b, function(a) {
fsapp.downloadDocUpdateComplete(a.name);
}, function(a) {
alert("Fehler beim Herunterladen: " + a, this);
});
},
openExtDataFileInWebview: function(a) {
this.extDataFileForWebview = a;
if (appConfig.appPlatformId == "android") var b = cordova.file.dataDirectory + a; else var b = cordova.file.dataDirectory + a;
window.resolveLocalFileSystemURL(b, function() {}, function() {
fsapp.initialFrameDocsCopy();
});
var c = "https://adac.theorie24.de/docs/update/" + appConfig.appPlatformId + "/getversion.php", d = appConfig.appTitle, e = appConfig.appVersion, f = appConfig.appPlatformId, g = new enyo.Ajax({
url: c,
method: "GET",
handleAs: "text"
});
g.response(this, "processDocUpdateResponse"), g.error(this, "processDocUpdateError"), g.go({
appid: d,
appversion: e,
appos: f
});
},
openExtDataFileInWebviewAfterDownload: function(a) {
objValues = appDB.getItem("upddoc:" + a);
if (objValues != null) {
var b = objValues.ver;
appDB.setItem("doc:" + a, objValues);
}
if (appConfig.appPlatformId == "android") var c = cordova.file.dataDirectory + a; else var c = cordova.file.dataDirectory + a;
this.extDataFileForWebview == a && openWebviewDirectNoFooter(c), window.resolveLocalFileSystemURL(c, function() {}, function() {
alert("Datei ist nicht vorhanden.", this);
});
},
checkUpdatedFileForADAC: function(a) {
var b = "de.adac.Fuehrerschein", c = "fa4e48ba-6f9c-48fa-8c94-fc9c1ecf2b01", d = "1.8", e = 0;
switch (e) {
case 0:
default:
var f = "https://m.stagingextern.adac.de/api/fileupdate/v1/";
break;
case 1:
var f = "https://m1.integration-phoenix.adac.de/api/fileupdate/v1/";
break;
case 2:
var f = "https://m.adac.de/api/fileupdate/v1/";
}
switch (appConfig.appPlatformId) {
case "android":
default:
var g = 1;
break;
case "ios":
var g = 0;
}
var h = f + "CurrentAppFiles", i = new enyo.Ajax({
url: h,
method: "GET",
handleAs: "text"
});
i.response(this, "processADACUpdateResponse"), i.error(this, "processADACUpdateError"), i.go({
appid: b,
appversion: d,
platform: g,
clientid: c
});
},
processADACUpdateResponse: function(a, b) {
if (!b) {
alert("Es wurde leider keine Antwort vom ADAC-Updateserver empfangen!", this);
return;
}
var c = JSON.parse(b), d = 0;
try {
d = c.AppFiles.length;
} catch (e) {}
for (var f = 0; f < d; f++) {
var g = c.AppFiles[f].FileName, h = c.AppFiles[f].Version;
g == "impressum.zip" ? h > "0.9" && (alert("Neuere Version von Impressum.zip gefunden!", this), this.getUpdatedADACFile(g)) : alert("Sonstiges: " + g, this);
}
},
processADACUpdateError: function() {
alert("Fehler bei Anfrage auf Update an ADAC-Updateserver", this);
},
getUpdatedADACFile: function(a) {
var b = "de.adac.Fuehrerschein", c = "fa4e48ba-6f9c-48fa-8c94-fc9c1ecf2b01", d = "1.8", e = 0;
switch (e) {
case 0:
default:
var f = "https://m.stagingextern.adac.de/api/fileupdate/v1/";
break;
case 1:
var f = "https://m1.integration-phoenix.adac.de/api/fileupdate/v1/";
break;
case 2:
var f = "https://m.adac.de/api/fileupdate/v1/";
}
switch (appConfig.appPlatformId) {
case "android":
default:
var g = 1;
break;
case "ios":
var g = 0;
}
var h = f + "LoadAppFileByName", i = new enyo.Ajax({
url: h,
method: "GET",
handleAs: "text"
});
i.response(this, "processADACUpdateDownloadResponse"), i.error(this, "processADACUpdateError"), i.go({
appid: b,
appversion: d,
platform: g,
clientid: c,
filename: a
});
},
processADACUpdateDownloadResponse: function(a, b) {
if (!b) {
alert("Es wurde leider keine Antwort vom ADAC-Updateserver empfangen!", this);
return;
}
alert("DOWNLOAD: " + b);
}
}), enyo.kind({
name: "WelcomePage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onHelpButtonTap: "",
onHelpContactButtonTap: "",
onHelpImprintButtonTap: "",
onRateButtonTap: "",
onSchoolFinderButtonTap: "",
onQuickstartButtonTap: "",
onQuickstartWrongAnswersButtonTap: "",
onUnlockAppTap: "",
onLockAppButtonTap: "",
onQuitButtonTap: "",
onSyncButtonTap: "",
onInAppPurchase: "",
onDelInAppPurchase: "",
onGraphicsTap: ""
},
components: uiWelcomePageView,
refreshSqlitelog: function() {
this.$.sqlitelogcontainer.setContent("Log:<hr />" + sqlitelog);
},
getDebugResolution: function() {
alert(userDevicePlatformDebug, this);
},
updatePageTitleWithMenuCaption: function() {
this.$.mainDynamicMenu.currentMenuCaption.indexOf(appConfig.msgClass + " ") != -1 ? this.$.PageHeader.setSubtitle("") : this.$.PageHeader.setSubtitle(this.$.mainDynamicMenu.currentMenuCaption);
},
showHomeScreen: function() {
this.$.mainDynamicMenu.openMainmenu();
},
hideInAppPurchaseButton: function() {
this.$.mainDynamicMenu.hideInAppPurchaseButton();
},
create: function() {
this.inherited(arguments), appConfig.urlLogoPage != "" && this.$.LogoImage.applyStyle("cursor", "pointer"), appConfig.urlMainBGPage == "", appConfig.imgMainPageLogo == "" && this.$.LogoImage.applyStyle("display", "none"), log("init welcomepage, appLockMode = " + appConfig.appLockMode), this.hideMainMenu();
},
showMainMenu: function() {
appInitialized && (log("welcomepage: showMainMenu"), this.$.mainDynamicMenu.openMainmenu());
},
hideMainMenu: function() {},
updateChart: function() {
try {
var a = jQuery(".mainGraphContainer").width(), b = jQuery(".mainGraphContainer").height();
this.$.GraphContainer2.applyStyle("width", Math.min(a, b) + "px"), this.$.GraphContainer2.applyStyle("height", Math.min(a, b) + "px");
} catch (c) {}
},
updateBG: function() {
try {
var a = jQuery(".mainGraphContainer").width(), b = jQuery(".mainGraphContainer").height();
this.$.BackgroundImageContainer.applyStyle("width", Math.min(a, b) + "px"), this.$.BackgroundImageContainer.applyStyle("height", Math.min(a, b) + "px");
} catch (c) {}
},
rendered: function() {
if (appConfig.appShowStaticWelcomeDisplay) if (appConfig.appShowStatisticBubblesWelcomeDisplay) {
try {
var a = appDB.getStatisticsCache();
a != null && (questionsInCurrentClass = parseInt(a.statisticData.questionsInCurrentClass, 10), questionsFitForTest = parseInt(a.statisticData.questionsFitForTest, 10), questionsAnswered = parseInt(a.statisticData.questionsAnswered, 10), questionstWrongLastTime = parseInt(a.statisticData.questionstWrongLastTime, 10), arrFirstLevelStatistics = a.statisticData.firstLevelStatistics, arrFirstLevelCategories = a.statisticData.firstLevelCategories);
if (questionsInCurrentClass > 0) var b = questionsFitForTest / questionsInCurrentClass * 100, c = questionsAnswered / questionsInCurrentClass * 100, d = questionstWrongLastTime / questionsInCurrentClass * 100; else var b = 0, c = 0, d = 0;
var e = "";
appConfig.appHas2DBs && (appConfig.userDb2selected ? e = appConfig.msgSettingsDBSwitchAfter + appConfig.db2ValidFromDate + "<br />" : e = appConfig.msgSettingsDBSwitchBefore + appConfig.db2ValidFromDate + "<br />");
var f = "<h1 style='margin-bottom:8px'>F\u00fchrerschein-App</h1><h2 style='margin-bottom:8px'>Klasse " + dbTableClasses[appConfig.userClassSelectedId].name + "</h2><p style='margin-top:8px'>" + e + Math.round(10 * b) / 10 + "% fit f\u00fcr die Pr\u00fcfung.</p>";
} catch (g) {
var f = "Fehler: Statistik Daten waren nicht verf\u00fcgbar!";
}
try {
this.$.GraphContainer.setContent(f), this.$.GraphContainer.applyStyle("display", "block"), this.$.lblWelcomeText.setContent(f + appConfig.msgWelcomePageYourLearningStatus), this.$.barFit.setTitle("Fit f\u00fcr die Pr\u00fcfung " + Math.round(1e3 * questionsFitForTest / questionsInCurrentClass) / 10 + "% (" + questionsFitForTest + " von " + questionsInCurrentClass + " Fragen)"), this.$.barFit.setPercentage(100 * questionsFitForTest / questionsInCurrentClass), this.$.barAnswered.setTitle("Mind. einmal beantwortet " + Math.round(1e3 * questionsAnswered / questionsInCurrentClass) / 10 + "% (" + questionsAnswered + " von " + questionsInCurrentClass + " Fragen)"), this.$.barAnswered.setPercentage(100 * questionsAnswered / questionsInCurrentClass), this.$.barWrong.setTitle("Zuletzt falsch beantwortet " + Math.round(1e3 * questionstWrongLastTime / questionsInCurrentClass) / 10 + "% (" + questionstWrongLastTime + " von " + questionsInCurrentClass + " Fragen)"), this.$.barWrong.setPercentage(100 * questionstWrongLastTime / questionsInCurrentClass), this.$.BackgroundImage.setContent(""), this.$.BackgroundImage.applyStyle("display", "none !important"), this.updateChart(), this.$.phoneGraphContainer.setContent(f);
} catch (g) {}
} else if (appConfig.appPlatformId != "web") try {
this.refreshBackgroundImages();
} catch (g) {} else appConfig.userUnlockedApp ? this.$.BackgroundImage.setAttribute("src", appConfig.imgMainPageBackgroundUnlocked) : this.$.BackgroundImage.setAttribute("src", appConfig.imgMainPageBackground), deviceReadyAlreadyDone && this.$.BackgroundImage.applyStyle("display", "block");
this.$.mainDynamicMenu.initCurrentMenu();
if (this.$.mainDynamicMenu.mainMenuOnDisplay) appInitialized && this.$.mainDynamicMenu.openMainmenu(); else try {
this.$.mainDynamicMenu.openSubmenuNoFade();
} catch (g) {}
this.inherited(arguments);
},
refreshBackgroundImages: function() {
if (appConfig.appShowStatisticBubblesWelcomeDisplay) return;
var a = Math.max(screen.width, screen.height), b = Math.min(screen.width, screen.height), c = window.devicePixelRatio;
appConfig.appPlatformId == "android" && (a /= c, b /= c), appConfig.userUnlockedApp ? (a < 960 || b < 640) && appConfig.imgMainPageBackgroundUnlockedSmall != "" ? (this.$.BackgroundImage.setAttribute("src", appConfig.imgMainPageBackgroundUnlockedSmall), this.$.phoneGraphContainer.applyStyle("background-image", "url('" + appConfig.imgMainPageBackgroundUnlockedSmall + "')")) : (this.$.BackgroundImage.setAttribute("src", appConfig.imgMainPageBackgroundUnlocked), this.$.phoneGraphContainer.applyStyle("background-image", "url('" + appConfig.imgMainPageBackgroundUnlocked + "')")) : (a < 960 || b < 640) && appConfig.imgMainPageBackgroundSmall != "" ? (this.$.BackgroundImage.setAttribute("src", appConfig.imgMainPageBackgroundSmall), this.$.phoneGraphContainer.applyStyle("background-image", "url('" + appConfig.imgMainPageBackgroundSmall + "')")) : (this.$.BackgroundImage.setAttribute("src", appConfig.imgMainPageBackground), this.$.phoneGraphContainer.applyStyle("background-image", "url('" + appConfig.imgMainPageBackground + "')")), this.$.BackgroundImage.applyStyle("display", "block"), jQuery(".phonegraphcontainer div").hide(), appConfig.appDisplayInfoButtonInMainPageHeader ? (jQuery(".pgci").show(), this.$.phoneGraphContainerInfoButton.applyStyle("display", "block !important")) : (jQuery(".pgci").hide(), this.$.phoneGraphContainerInfoButton.applyStyle("display", "none !important")), jQuery(".pgca").show(), appBackgroundImagesRefreshed = !0;
},
openLogoPage: function() {
appConfig.urlLogoPage != "" && window.open(appConfig.urlLogoPage, "_system", "location=yes");
},
openMainBGPage: function() {
appConfig.urlMainBGPage != "" && appConfig.appLockable && (appConfig.userUnlockedApp && appConfig.urlMainBGPageUnlockedApp != "" ? openWebview(appConfig.urlMainBGPageUnlockedApp, !1) : openWebview(appConfig.urlMainBGPage, !1));
},
quitApp: function() {
try {
jsCallsQt.closeApp();
} catch (a) {
try {
window.close();
} catch (a) {
intel.adp.encapsulator.closeapplication();
}
}
}
}), enyo.kind({
name: "QuickstartPage",
kind: "Control",
published: {
foundQuickstartQuestions: 0
},
initQuickstartWrongAnsweredArray: function() {
appCE.clearQuestionIdsArray();
var a = new Array;
for (var b in dbTblQ) {
if (a.length >= appConfig.quickstartQuestions) break;
if (appConfig.userClassSelectedId == appConfig.appClassMofaId && dbTblQ[b].basic_mofa == 1 || appConfig.userClassSelectedId != appConfig.appClassMofaId && dbTblQ[b].basic == 1 || dbTblQ[b].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var c = appDB.readQuestionStatistics(b), d = "", e = "1";
if (typeof c == "object") try {
d = c.answeredAll, e = d.substr(0, 1);
} catch (f) {}
e != "1" && (a[a.length] = b);
}
}
this.foundQuickstartQuestions = a.length, a.length == 0 ? alert(appConfig.msgNoLastWwrongAnsweredQuestions, this) : (appConfig.appDisplayIntroMessageOnQuickstartEtc && alert(appConfig.msgQuickstartWronglyAnsweredExplanation, this), appCE.setQuestionOrigin(0), appCE.addQuestionIdsToQuestionsArray(a));
},
initQuickstartQuestionArray: function() {
appCE.clearQuestionIdsArray();
var a = new Array, b = new Array;
for (var c in dbTblQ) if (appConfig.userClassSelectedId == appConfig.appClassMofaId && dbTblQ[c].basic_mofa == 1 || appConfig.userClassSelectedId != appConfig.appClassMofaId && dbTblQ[c].basic == 1 || dbTblQ[c].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var d = appDB.readQuestionStatistics(c), e = "000";
if (typeof d == "object") try {
e = d.answeredAll + e;
} catch (f) {}
e.substr(0, 2) != "11" && (a[a.length] = c);
}
if (a.length == 0) this.foundQuickstartQuestions = 0, alert(appConfig.msgAppQuickstartAllQuestionsDone, this); else {
if (a.length <= appConfig.quickstartQuestions) b = a, this.foundQuickstartQuestions = b.length, alert(appConfig.msgAppQuickstartAlmostAllQuestionsDone, this); else {
while (b.length < appConfig.quickstartQuestions) {
var g = Math.floor(Math.random() * a.length);
a[g] != 0 && (b[b.length] = a[g], a[g] = 0);
}
this.foundQuickstartQuestions = b.length;
}
appConfig.appDisplayIntroMessageOnQuickstartEtc && alert(appConfig.msgQuickstartExplanation, this);
var h = [];
for (var i = 0; i < b.length; i++) h[i] = {
id: b[i],
officialNumber: dbTblQ[b[i]].number
};
h.sort(function(a, b) {
return a.officialNumber == b.officialNumber ? 0 : +(a.officialNumber > b.officialNumber) || -1;
});
for (var i = 0; i < h.length; i++) b[i] = h[i].id;
appCE.setQuestionOrigin(0), appCE.addQuestionIdsToQuestionsArray(b);
}
},
initQuickstartQuestionArrayOld: function() {
appCE.clearQuestionIdsArray();
var a = new Array;
for (var b in dbTblQ) {
if (a.length >= appConfig.quickstartQuestions * 2) break;
if (dbTblQ[b]["classes"] == "" || dbTblQ[b].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var c = appDB.readQuestionStatistics(b), d = "";
if (typeof c == "object") try {
d = c.answeredAll;
} catch (e) {}
d.length == 0 && (a[a.length] = b);
}
}
for (var b in dbTblQ) {
if (a.length >= appConfig.quickstartQuestions * 2) break;
if (dbTblQ[b]["classes"] == "" || dbTblQ[b].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var c = appDB.readQuestionStatistics(b), d = "";
if (typeof c == "object") try {
d = c.answeredAll;
} catch (e) {}
d.length == 1 && (a[a.length] = b);
}
}
for (var b in dbTblQ) {
if (a.length >= appConfig.quickstartQuestions * 2) break;
if (dbTblQ[b]["classes"] == "" || dbTblQ[b].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var c = appDB.readQuestionStatistics(b), d = "";
if (typeof c == "object") try {
d = c.answeredAll;
} catch (e) {}
d.length == 2 && (a[a.length] = b);
}
}
for (var b in dbTblQ) {
if (a.length >= appConfig.quickstartQuestions * 2) break;
if (dbTblQ[b]["classes"] == "" || dbTblQ[b].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
var c = appDB.readQuestionStatistics(b), d = "";
if (typeof c == "object") try {
d = c.answeredAll;
} catch (e) {}
d.substr(0, 3) != "111" && (a[a.length] = b);
}
}
this.foundQuickstartQuestions = a.length, a.length < appConfig.quickstartQuestions ? alert("Es wurden fast alle Fragen schon 3x richtig gemacht, daher sind nun nicht mehr soviele Fragen im Test.", this) : (a.sort(function() {
return .5 - Math.random();
}), a = a.slice(0, 30)), a.length == 0 ? alert("Es wurden alle Fragen schon 3x richtig gemacht, bitte ggf. nun in 'Nach Themen' weiter\u00fcben.", this) : (appConfig.appDisplayIntroMessageOnQuickstartEtc && alert(appConfig.msgQuickstartExplanation, this), appCE.setQuestionOrigin(0), appCE.addQuestionIdsToQuestionsArray(a));
}
}), enyo.kind({
name: "QuestionList",
kind: "Control",
events: {
onCheckmarkChanged: ""
},
components: [],
published: {
arrSelectedQuestionIds: [],
selectMode: 0,
questionListPage: 0,
questionsTotal: 0,
questionsFitForTest: 0,
questionsWrongLastTime: 0,
selectQuestionsWithLastViewed: !1
},
create: function() {
this.inherited(arguments), this.questionListPage == 0 && this.setContent(appConfig.msgByChapterExplanation), this.questionListPage == 1 && this.setContent(appConfig.msgByMarkedExplanation), this.questionListPage == 2 && this.setContent(appConfig.msgBySearchExplanation);
},
questionListPageChanged: function() {
this.questionListPage == 0 && this.setContent(appConfig.msgByChapterExplanation), this.questionListPage == 1 && this.setContent(appConfig.msgByMarkedExplanation), this.questionListPage == 2 && this.setContent(appConfig.msgBySearchExplanation);
},
refresh: function() {
this.questionListPageChanged(), this.arrSelectedQuestionIds = new Array, this.destroyComponents();
var a = 0, b = !0, c, d = new Object, e = !1;
this.questionsFitForTest = 0, this.questionsTotal = 0, this.questionsWrongLastTime = 0;
if (!appConfig.appOnMobileDevice) var f = " im letzten Test", g = " im vorletzten Test", h = " im vor-vorletzten Test"; else var f = "", g = "", h = "";
d = appDB.getItem("markedquestions");
if (d != null) var i = d.markedQuestionIds; else var i = "";
if (appCE.arrTempQuestionIds.length > 0) {
var j = new Array;
for (var k = 0; k < appCE.arrTempQuestionIds.length; k++) j[k] = new Object, j[k].id = appCE.arrTempQuestionIds[k], j[k].number = dbTblQ[appCE.arrTempQuestionIds[k]].number;
j.sort(function(a, b) {
return a.number > b.number ? 1 : -1;
});
for (var k = 0; k < appCE.arrTempQuestionIds.length; k++) appCE.arrTempQuestionIds[k] = j[k].id;
}
var l = !1;
if (this.selectQuestionsWithLastViewed) {
for (var k = 0; k < appCE.arrTempQuestionIds.length; k++) if (appConfig.userLastViewedQuestionId == appCE.arrTempQuestionIds[k]) {
l = !0;
break;
}
this.selectQuestionsWithLastViewed = l;
}
for (var k = 0; k < appCE.arrTempQuestionIds.length; k++) {
var m = new Object;
m = appDB.readQuestionStatistics(appCE.arrTempQuestionIds[k]);
var n = "";
a = 0;
var o = new Array, p = new Array;
o[0] = "qlistunanswered", o[1] = "qlistunanswered", o[2] = "qlistunanswered", p[0] = appConfig.msgQuestionNeverPractised, p[1] = appConfig.msgQuestionNeverPractised, p[2] = appConfig.msgQuestionNeverPractised;
var b = !0, q = !0, r = !0, s = !1;
this.questionsTotal++;
var t = 0;
if (m != null) {
b = m.answeredAll.length < 3, q = m.answeredAll.length < 2, r = m.answeredAll.length < 1;
var u = m.answeredLastDate.split("T"), v = u[0], w = v.split("-");
appConfig.appOnMobileDevice || (n = ", " + appConfig.msgQuestionLastAnswered + " " + w[2] + "." + w[1] + "." + w[0]);
for (t = 0; t < m.answeredAll.length; t++) {
if (t > 1) break;
t == 0 && (m["answeredAll"].substring(0, 1) == "0" ? (s = !0, this.questionsWrongLastTime++) : s = !1), m["answeredAll"].substring(t, t + 1) == "0" ? (o[t] = "qlistincorrect", p[t] = appConfig.msgQuestionIncorrectlyAnswered) : (o[t] = "qlistcorrect", p[t] = appConfig.msgQuestionCorrectlyAnswered, a++), t == 0 && (p[t] = p[t] + f), t == 1 && (p[t] = p[t] + g), t == 2 && (p[t] = p[t] + h);
}
}
q || a < 2 || this.questionsFitForTest++, this.selectMode == 0 && (c = !0), this.selectMode == 1 && (c = !1), this.selectMode == 2 && (a < 3 || b ? c = !0 : c = !1), this.selectMode == 3 && (q || a < 2 ? c = !0 : c = !1), this.selectMode == 4 && (s ? c = !0 : c = !1), this.selectMode == 5 && (q || a < 2 ? c = !1 : c = !0);
if (this.selectMode == 6) {
var x = dbTblQ[appCE.arrTempQuestionIds[k]].picture;
x.indexOf(".m4v") > -1 ? c = !0 : c = !1;
}
if (this.selectMode == 7) {
var x = dbTblQ[appCE.arrTempQuestionIds[k]].picture;
x.indexOf(".jpg") > -1 || x.indexOf(".png") > -1 || x.indexOf(".gif") > -1 ? c = !0 : c = !1;
}
this.selectMode == 8 && (dbTblQ[appCE.arrTempQuestionIds[k]].points == 5 ? c = !0 : c = !1), this.selectMode == 9 && (e || appConfig.userLastViewedQuestionId == appCE.arrTempQuestionIds[k] ? c = !0 : c = !1), this.selectMode == 10 && (r ? c = !0 : c = !1), this.selectMode == 11 && (i.indexOf("," + appCE.arrTempQuestionIds[k] + ",") > -1 ? c = !0 : c = !1), this.selectQuestionsWithLastViewed && (e || appConfig.userLastViewedQuestionId == appCE.arrTempQuestionIds[k] ? c = !0 : c = !1), c && (this.arrSelectedQuestionIds[this.arrSelectedQuestionIds.length] = appCE.arrTempQuestionIds[k]);
var y = dbTblQ[appCE.arrTempQuestionIds[k]].text.rot13().replace(/####/g, "\\u").replace(/###/g, "\\u0").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
try {
y = JSON.parse('"' + y + '"'), y = jQuery("<div>").html(y).text();
} catch (z) {
y = "Fehler: " + z.message;
}
y.length > 45 && (y = y.substring(0, 42) + "...");
var A = "";
i.indexOf("," + appCE.arrTempQuestionIds[k] + ",") > -1 && (A = appConfig.icoMarkedStarHtml);
var B = "";
appConfig.userLastViewedQuestionId == appCE.arrTempQuestionIds[k] && (B = " questionlastviewed", e = !0);
if (!appConfig.appShowQuestionListDebugInfos) var C = " <small>(" + dbTblQ[appCE.arrTempQuestionIds[k]].points + "&nbsp;" + appConfig.msgInfoListPoints + n + ")</small>" + A; else var C = " <small>cat:" + dbTblQ[appCE.arrTempQuestionIds[k]].category_id + "; official:" + dbTblQ[appCE.arrTempQuestionIds[k]].number + ";</small>";
this.createComponent({
tag: "table",
attributes: {
border: "0"
},
classes: "questionlisttable" + B,
style: "",
components: [ {
tag: "tr",
components: [ {
tag: "td",
style: "width:40px;",
components: [ {
kind: "onyx.Checkbox",
name: "chkQuestion" + k,
attributes: {
questionId: appCE.arrTempQuestionIds[k]
},
checked: c,
onchange: "updateSelQuestionArray"
} ]
}, {
tag: "td",
style: "width:auto;",
components: [ {
tag: "div",
name: "txtQuestion" + k,
ontap: "",
content: y + C,
attributes: {
questionId: appCE.arrTempQuestionIds[k]
},
allowHtml: !0
} ]
}, {
tag: "td",
components: [ {
tag: "div",
classes: o[0]
} ]
}, {
tag: "td",
components: [ {
tag: "div",
classes: o[1]
} ]
} ]
} ]
});
}
this.updateSelQuestionOpacity(), this.render();
},
changeSelectMode: function(a) {
this.setSelectMode(a), this.selectQuestionsWithLastViewed = !1, this.refresh();
},
selectAll: function() {
this.changeSelectMode(0);
},
selectNone: function() {
this.changeSelectMode(1);
},
selectReverse: function() {
for (var a = 0; a < appCE.arrTempQuestionIds.length; a++) this.$["chkQuestion" + a].setChecked(!this.$["chkQuestion" + a].getChecked());
this.selectQuestionsWithLastViewed = !1, this.updateSelQuestionArray();
},
selectRedYellow: function() {
this.changeSelectMode(2);
},
selectRed: function() {
this.changeSelectMode(4);
},
selectGreen: function() {
this.changeSelectMode(5);
},
selectGrey: function() {
this.changeSelectMode(3);
},
selectNever: function() {
this.changeSelectMode(10);
},
selectImage: function() {
this.changeSelectMode(7);
},
selectVideo: function() {
this.changeSelectMode(6);
},
select5P: function() {
this.changeSelectMode(8);
},
selectLastViewedQuestion: function() {
this.changeSelectMode(9);
},
selectMarked: function() {
this.changeSelectMode(11);
},
updateSelQuestionArray: function() {
this.arrSelectedQuestionIds = new Array;
for (var a = 0; a < appCE.arrTempQuestionIds.length; a++) if (this.$["chkQuestion" + a].getChecked()) {
var b = this.$["chkQuestion" + a].getAttributes();
this.arrSelectedQuestionIds[this.arrSelectedQuestionIds.length] = b.questionId;
}
this.updateSelQuestionOpacity(), this.bubble("onCheckmarkChanged");
},
updateSelQuestionOpacity: function() {
for (var a = 0; a < appCE.arrTempQuestionIds.length; a++) this.$["chkQuestion" + a].getChecked() ? this.$["txtQuestion" + a].applyStyle("opacity", "1.0") : this.$["txtQuestion" + a].applyStyle("opacity", "0.5");
},
getNumberOfSelectedItems: function() {
var a = 0;
for (var b = 0; b < appCE.arrTempQuestionIds.length; b++) this.$["chkQuestion" + b].getChecked() && a++;
return a;
},
getNumberOfFitForTestItems: function() {
return this.questionsFitForTest;
},
getNumberOfItems: function() {
var a = 0;
for (var b = 0; b < appCE.arrTempQuestionIds.length; b++) a++;
return a;
},
getNumberOfAnsweredWrongLastTestItems: function() {
return this.questionsWrongLastTime;
}
}), enyo.kind({
name: "appPurchaseSelector",
kind: "onyx.Popup",
classes: "customalert",
style: "max-width:600px !important; width:85% !important; max-height:90%; overflow-y:auto; overflow-x:hidden; position:fixed; padding:30px 40px 20px 40px;background-color:#fff;color:#333; z-index:999999",
centered: !0,
modal: !0,
scrim: !1,
floating: !1,
autoDismiss: !1,
events: {
onIapSelectTap: "",
onProSelectTap: "",
onGoldSelectTap: "",
onRestoreSelectTap: ""
},
components: [ {
tag: "div",
name: "centerContent",
style: "padding-bottom:20px !important",
fit: !0,
allowHtml: !0,
components: [ {
tag: "div",
name: "btnClose",
allowHtml: !0,
style: "position:absolute;top:13px;right:10px;width:30px;text-align:right;opacity:0.5;",
content: appConfig.mnuShortcutBtnClose,
ontap: "hideSelector"
}, {
tag: "div",
name: "msgboxHeaderHeadline",
allowHtml: !0
}, {
tag: "div",
name: "msgboxHeader",
allowHtml: !0,
ontap: "openAdvantagesHelpPage",
style: "margin-top:8px;margin-bottom:16px;z-index:999999;"
}, {
kind: "onyx.Button",
name: "btnSelectGOLD",
allowHtml: !0,
classes: "onyx-blue",
style: "white-space:normal !important;background-color:#EAEAEA;color:#666;width:100%;margin-bottom:8px;padding:8px;",
ontap: "doGoldSelectTap"
}, {
kind: "onyx.Button",
name: "btnSelectIAP",
allowHtml: !0,
classes: "onyx-blue",
style: "white-space:normal !important;background-color:#EAEAEA;color:#666;width:100%;margin-bottom:8px;padding:8px;",
ontap: "doIapSelectTap"
}, {
kind: "onyx.Button",
name: "btnSelectPRO",
allowHtml: !0,
classes: "onyx-blue",
style: "white-space:normal !important;background-color:#EAEAEA;color:#666;width:100%;margin-bottom:8px;padding:8px;",
ontap: "doProSelectTap"
}, {
tag: "div",
name: "msgboxFooter",
allowHtml: !0,
content: appConfig.msgAppRestoreIAP,
style: "margin-top:8px;",
ontap: "doRestoreSelectTap"
} ]
} ],
rendered: function() {
this.inherited(arguments), appConfig.appDisplayPROVersionButtonInIAPMsgBox || this.$.btnSelectPRO.hide();
try {
this.container.$.appPurchaseScrim.hide();
} catch (a) {}
},
openAdvantagesHelpPage: function() {
appConfig.appMultilingual ? fsapp.openHelpFileInWebview(appConfig.appAvailableAppLanguages[appConfig.appSelectedAppLanguageISO2].langISO2 + "/" + appConfig.urlAdvantagesHelpFile) : fsapp.openHelpFileInWebview(appConfig.urlAdvantagesHelpFile);
},
toggleInfotext: function() {
log("toggleInfotext: getContent: " + this.$.msgboxHeader.getContent()), this.$.msgboxHeader.getContent() == appConfig.msgAppUpgradeExplanationShort ? (log("toggleInfotext: expand"), this.$.msgboxHeader.setContent(appConfig.msgAppUpgradeExplanationLong)) : (log("toggleInfotext: shrink"), this.$.msgboxHeader.setContent(appConfig.msgAppUpgradeExplanationShort)), this.$.msgboxHeader.render();
},
createButtonContent: function(a, b, c, d) {
var e = "";
return e += '<table width="100%"><tr><td style="vertical-align:top;padding-top:4px;">', e += '<img src="' + d + '" alt="" style="width:40px;">', e += '<div style="color:#29546e;text-transform:uppercase;font-weight:bold;">' + c + "</div>", e += '</td><td style="padding-left:16px;vertical-align:top;text-align:left;">', e += '<div style="color:#29546e;text-transform:uppercase;font-weight:bold;">' + a + "</div>", e += "<i>" + b + "</i>", e += "</td></tr></table>", e;
},
refresh: function() {
this.$.msgboxHeaderHeadline.setContent(appConfig.msgT24InAppPurchaseIOS), this.$.msgboxHeader.setContent(appConfig.msgAppUpgradeExplanationShort), this.$.msgboxFooter.setContent(appConfig.msgAppRestoreIAP);
var a = "", b = "Keine Verbindung zum Store", c = "", d = "-", e = appConfig.appPriceLabelGoldApp;
try {
var f = iosIapProductData.title.split(" (");
b = f[0], d = iosIapProductData.price, c = iosIapProductData.description;
} catch (g) {}
try {
c == "" && appConfig.appPlatformId == "web" && (b = "PRO Upgrade", d = "6,99 \u20ac", c = "Schaltet alle Funktionen und Inhalte frei.");
if (c != "") {
d = d.replace(" ", "&nbsp;"), e = e.replace(" ", "&nbsp;");
if (!appConfig.appMultilingual || appConfig.appPlatformId == "web") {
var h = this.createButtonContent(b, c + " " + appConfig.msgDescAddUpgrade, d, "assets/imgT24Logo.png");
this.$.btnSelectIAP.setContent(h);
var h = this.createButtonContent("F\u00fchrerschein PRO", appConfig.msgDescProApp, d, "assets/imgT24LogoPro.png");
this.$.btnSelectPRO.setContent(h), this.$.btnSelectPRO.show();
var h = this.createButtonContent("F\u00fchrerschein GOLD", appConfig.msgDescGoldApp, e, "assets/imgT24LogoMultiPro.png");
this.$.btnSelectGOLD.setContent(h), this.$.btnSelectGOLD.show();
} else {
var h = this.createButtonContent(b, c + " " + appConfig.msgDescAddUpgrade, d, "assets/imgT24LogoMulti.png");
this.$.btnSelectIAP.setContent(h), appConfig.appSelectedAppLanguageISO2 == "GB" ? a = "<table width='100%'><tr><td style='text-align:left;'><div style='color:#29546e;text-transform:uppercase;font-weight:bold;'>F\u00fchrerschein GOLD</div><i>You buy a new app, your learning statistics will <u>not</u> be transferred.</i></td><td style='color:#29546e;text-transform:uppercase;font-weight:bold;'>" + e + "</td></tr></table>" : a = "<table width='100%'><tr><td style='text-align:left;'><div style='color:#29546e;text-transform:uppercase;font-weight:bold;'>F\u00fchrerschein GOLD</div><i>Sie kaufen eine neue App, Ihre bisherigen Lernergebnisse werden <u>nicht</u> \u00fcbernommen.</i></td><td style='color:#29546e;text-transform:uppercase;font-weight:bold;'>" + e + "</td></tr></table>";
var h = this.createButtonContent("F\u00fchrerschein GOLD", appConfig.msgDescGoldApp, e, "assets/imgT24LogoMultiPro.png");
this.$.btnSelectGOLD.setContent(h), this.$.btnSelectGOLD.show(), this.$.btnSelectPRO.hide();
}
} else a = "<table width='100%'><tr><td colspan='2' style='text-align:left;'><div style='color:#29546e;text-transform:uppercase;font-weight:bold;'>Keine Antwort vom AppStore.</div></td></tr></table>", this.$.btnSelectIAP.setContent(a), a = "<table width='100%'><tr><td colspan='2' style='text-align:left;'><div style='color:#29546e;text-transform:uppercase;font-weight:bold;'>Bitte klicken Sie auf Abbrechen</div></td></tr></table>", this.$.btnSelectPRO.setContent(a), a = "<table width='100%'><tr><td colspan='2' style='text-align:left;'><div style='color:#29546e;text-transform:uppercase;font-weight:bold;'>und versuchen Sie es nochmals.</div></td></tr></table>", this.$.btnSelectGOLD.setContent(a), this.$.btnSelectGOLD.show();
} catch (g) {}
appConfig.appDisplayPROVersionButtonInIAPMsgBox || (this.$.btnSelectPRO.hide(), this.$.btnSelectGOLD.hide());
try {
this.container.$.appPurchaseScrim.show();
} catch (g) {}
},
showSelector: function() {
try {
this.container.$.appPurchaseScrim.show();
} catch (a) {}
this.show();
},
hideSelector: function() {
try {
this.container.$.appPurchaseScrim.hide();
} catch (a) {}
this.hide();
}
}), enyo.kind({
name: "filterQuestionSelector",
kind: "onyx.Popup",
classes: "customalert",
style: "width:300px; position:fixed; padding:30px 40px 20px 40px;background-color:#fff;color:#333;",
centered: !0,
modal: !0,
scrim: !0,
floating: !0,
autoDismiss: !0,
events: {
onModeAllTap: "",
onModeFitTap: "",
onModeUnfitTap: "",
onModeImageTap: "",
onModeVideoTap: "",
onMode5PTap: "",
onModeLastViewedTap: "",
onModeNeverTap: "",
onModeMarkedTap: ""
},
components: [ {
tag: "div",
name: "centerContent",
style: "padding-bottom:20px !important",
fit: !0,
allowHtml: !0,
components: [ {
tag: "div",
name: "selectorHeader",
allowHtml: !0,
content: appConfig.msgPlsChooseYourFilter
}, {
kind: "onyx.Button",
name: "btnFilterMode1",
classes: "onyx-blue",
style: "width:100%;margin-bottom:16px;",
ontap: "doModeAllTap",
content: appConfig.msgFilterNoFilter
}, {
kind: "onyx.Button",
name: "btnFilterMode2",
classes: "onyx-blue",
style: "width:100%;margin-bottom:16px;",
ontap: "doModeNeverTap",
content: appConfig.msgFilterNeverAnswered
}, {
kind: "onyx.Button",
name: "btnFilterMode3",
classes: "onyx-blue",
style: "width:100%;margin-bottom:16px;",
ontap: "doModeUnfitTap",
content: appConfig.msgFilterNotReadyForExam
}, {
kind: "onyx.Button",
name: "btnFilterMode6",
classes: "onyx-blue",
style: "width:100%;margin-bottom:16px;",
ontap: "doMode5PTap",
content: appConfig.msgFilter5PointQuestions
}, {
kind: "onyx.Button",
name: "btnFilterMode4",
classes: "onyx-blue",
style: "width:100%;margin-bottom:16px;",
ontap: "doModeImageTap",
content: appConfig.msgFilterImageQuestions
}, {
kind: "onyx.Button",
name: "btnFilterMode5",
classes: "onyx-blue",
style: "width:100%;margin-bottom:16px;",
ontap: "doModeVideoTap",
content: appConfig.msgFilterVideoQuestions
}, {
kind: "onyx.Button",
name: "btnFilterMode8",
classes: "onyx-blue",
style: "width:100%;margin-bottom:0px;",
ontap: "doModeMarkedTap",
content: appConfig.msgFilterMarkedQuestions
} ]
} ],
initSelector: function() {
this.$.selectorHeader.setContent(appConfig.msgPlsChooseYourFilter), this.$.btnFilterMode1.setContent(appConfig.msgFilterNoFilter), this.$.btnFilterMode2.setContent(appConfig.msgFilterNeverAnswered), this.$.btnFilterMode3.setContent(appConfig.msgFilterNotReadyForExam), this.$.btnFilterMode6.setContent(appConfig.msgFilter5PointQuestions), this.$.btnFilterMode4.setContent(appConfig.msgFilterImageQuestions), this.$.btnFilterMode5.setContent(appConfig.msgFilterVideoQuestions), this.$.btnFilterMode8.setContent(appConfig.msgFilterMarkedQuestions);
}
}), enyo.kind({
name: "ChapterPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onReadButtonTap: "",
onPracticeButtonTap: "",
onClassButtonTap: "",
onHelpButtonTap: ""
},
filterMode: "all",
tempFilterMode: "all",
hasTwoStepChapterSelection: !1,
currentChapterSelectionStep: 0,
components: uiChapterPageView,
create: function() {
this.inherited(arguments), this.$.t24selbtnLVX.hide();
},
rendered: function() {
this.inherited(arguments);
},
isOfficialCatTree: function() {
if (typeof this.$.catTree != "undefined") return this.$.catTree.treeType == "official";
log("ERROR: cattree doesnt exist (fn: isOfficialCatTree)");
},
scrollQListToTop: function() {
this.$.questionListScroller.setScrollTop(0);
},
showFilterSelectBox: function() {
this.$.filterQuestionSelector.initSelector(), this.$.filterQuestionSelector.show();
},
createTitles: function(a) {
return Object.keys(a.titles).map(function(b) {
return '<span class="t_' + b.toLowerCase() + '">' + a.titles[b] + "</span>";
}).join("");
},
initPage: function(a) {
try {
this.$.catTree.destroy();
} catch (b) {}
switch (a) {
case "official":
appConfig.appHas2DBs ? appConfig.userDb2selected ? this.$.catTreeScroller.createComponent({
kind: "categoryTree2",
name: "catTree",
classes: "catTree",
onTreeTap: "refreshQuestionList"
}, {
owner: this
}) : this.$.catTreeScroller.createComponent({
kind: "categoryTree1",
name: "catTree",
classes: "catTree",
onTreeTap: "refreshQuestionList"
}, {
owner: this
}) : this.$.catTreeScroller.createComponent({
kind: "categoryTree1",
name: "catTree",
classes: "catTree",
onTreeTap: "refreshQuestionList"
}, {
owner: this
});
try {
var c = this.createTitles(this.$.catTree.getCategoryData(0)), d = this.createTitles(this.$.catTree.getCategoryData(1));
this.$.catTree.$.nodBasicClassContent.setContent("<h2 style='margin:0'>" + c + "</h2>"), this.$.catTree.$.nodExtClassContent.setContent("<h2 style='margin:0'>" + d + " - " + appConfig.msgClass + " " + dbTableClasses[appConfig.userClassSelectedId].name + "</h2>");
} catch (b) {}
this.$.PageHeader.setSubtitle(appConfig.pageSubtitleByChapter);
break;
case "focus":
appConfig.appHas2DBs ? appConfig.userDb2selected ? this.$.catTreeScroller.createComponent({
kind: "focusCategoryTree2",
name: "catTree",
onTreeTap: "refreshQuestionList"
}, {
owner: this
}) : this.$.catTreeScroller.createComponent({
kind: "focusCategoryTree1",
name: "catTree",
onTreeTap: "refreshQuestionList"
}, {
owner: this
}) : this.$.catTreeScroller.createComponent({
kind: "focusCategoryTree1",
name: "catTree",
onTreeTap: "refreshQuestionList"
}, {
owner: this
});
try {
this.$.catTree.$.nodFocusCategory.setContent("<h2 style='margin:0'>" + appConfig.msgFocusExercises + "</h2>");
} catch (b) {}
this.$.PageHeader.setSubtitle(appConfig.pageSubtitleByFocusExercises);
}
this.render(), this.$.questionListSpinner.start(), this.$.questionListSpinnerContainer.show(), this.$.catTree.resetTree(), appCE.clearQuestionIdsArray(), appCE.clearTempQuestionIdsArray(), this.$.catTree.updateQuestionNumbers(), this.$.PageFooter.setBtnchapterread("invisible"), this.$.PageFooter.setBtnchapterpractice("invisible"), this.$.questionList.questionListPageChanged(), enyo.job("jobName", enyo.bind(this, "refreshQuestionList2"), 100), this.selectPageLayoutTwoStepSelection();
try {
fsapp.lastPageId > 0 && (this.isOfficialCatTree() ? appConfig.userLastViewedTopicId > 0 && (this.$.catTree.directNodeOpen(appConfig.userLastViewedTopicId), this.$.questionList.selectQuestionsWithLastViewed = !0, this.$.t24selbtnLVX.show()) : this.$.catTree.directNodeOpen("newest"));
} catch (b) {}
var e = this.$.catTree.getNewQuestionsDate().split("-"), f = e[2] + "." + e[1] + "." + e[0];
jQuery(".insertdate").text(appConfig.msgWordStartingFromDate + f);
},
initPageAfterTestingPage: function() {
this.selectPageLayoutTwoStepSelection(), this.isOfficialCatTree() && appConfig.userLastViewedTopicId > 0 && (this.$.catTree.directNodeOpen(appConfig.userLastViewedTopicId), this.$.questionList.selectQuestionsWithLastViewed = !0, this.$.t24selbtnLVX.show()), this.refreshQuestionList();
},
openChapter: function(a) {
this.$.catTree.directNodeOpen(a);
},
selectPageLayoutTwoStepSelection: function() {
this.hasTwoStepChapterSelection ? this.preparePageForTwoStepSelection() : this.$.divPhoneSwitchToQuestions.hide();
},
preparePageForTwoStepSelection: function() {
this.hasTwoStepChapterSelection = !0, this.currentChapterSelectionStep = 1, this.$.questionSelectionScroller.applyStyle("left", "0"), this.$.questionSelectionScroller.applyStyle("width", "auto !important"), this.$.questionSelectionScroller.applyStyle("height", "auto !important"), this.$.questionSelectionScroller.applyStyle("top", "0px !important"), this.$.questionSelectionScroller.applyStyle("bottom", "0px !important"), this.$.catTreeScroller.applyStyle("left", "0"), this.$.catTreeScroller.applyStyle("width", "auto !important"), this.$.catTreeScroller.applyStyle("float", "none"), this.$.catTreeScroller.applyStyle("top", "0px !important"), this.$.catTreeScroller.applyStyle("bottom", "0px !important"), this.$.questionSelectionScroller.hide(), this.$.catTreeScroller.render(), this.$.catTreeScroller.show(), this.$.divPhoneSwitchToQuestions.show();
},
switchToQuestionList: function() {
this.currentChapterSelectionStep = 2, this.$.questionSelectionScroller.show(), this.$.catTreeScroller.hide(), this.$.divPhoneSwitchToQuestions.hide();
},
displayStatisticsInfo: function() {
var a = parseInt(this.$.questionList.getNumberOfItems(), 10), b = parseInt(this.$.questionList.getNumberOfFitForTestItems(), 10), c = 0, d = parseInt(this.$.questionList.getNumberOfAnsweredWrongLastTestItems(), 10), e = 0, f = this.$.questionList.getNumberOfSelectedItems();
if (a > 0) var c = 100 * b / a, e = 100 * d / a;
var g = "";
g += '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgFilterCurrentSelection + '</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>', g += '<table width="100%" cellpadding="0" cellspacing="0">', g += "<tr><td><b>" + this.getQuestionWord(1 * a) + " " + appConfig.msgFilterInThisTopic + '</b></td><td style="text-align:right"><span class="qamountblack">' + a + " </span></td></tr>", g += "<tr><td>" + appConfig.msgFilterLabelReadyForExam + " (" + Math.round(c * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountgreen">' + b + " </span></td></tr>", g += "<tr><td>" + appConfig.msgQuesiontRecentlyAnsweredWrong + " (" + Math.round(e * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountred">' + d + " </span></td></tr>", g += '<tr><td colspan="2"><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div></td></tr>', g += "<tr><td>" + appConfig.msgFilterBoxSelectedForReadingOrPracticing + '</td><td style="text-align:right"><span class="qamountblack">' + f + " </span></td></tr>", g += "</table>", alert(g, this);
},
getQuestionWord: function(a) {
if (a == 1) var b = appConfig.msgAppQuestion; else var b = appConfig.msgAppQuestions;
return b;
},
refreshQuestionList: function() {
appConfig.appWebKitViewerVersion || (this.$.questionListSpinner.start(), this.$.questionListSpinnerContainer.show(), this.$.questionListSpinnerContainer.render()), this.$.PageFooter.setBtnchapterread("visible"), this.$.PageFooter.setBtnchapterpractice("visible"), this.$.questionListScroller.addClass("gradientblock"), enyo.job("jobName", enyo.bind(this, "refreshQuestionList2"), 100);
},
refreshQuestionList2: function() {
switch (this.filterMode) {
case "all":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNoFilter);
break;
case "never":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNeverAnswered);
break;
case "fit":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterReadyForExam);
break;
case "unfit":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNotReadyForExam);
break;
case "image":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterImageQuestions);
break;
case "video":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterVideoQuestions);
break;
case "5p":
this.$.t24selbtn1caption.setContent(appConfig.msgFilter5PointQuestions);
break;
case "lastviewed":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterStartLastQuestion);
}
appConfig.userLastViewedTopicId != this.$.catTree.currentCategoryId && (this.$.questionList.selectQuestionsWithLastViewed = !1, this.$.t24selbtnLVX.hide()), this.$.questionList.selectQuestionsWithLastViewed && (this.$.t24selbtn1caption.setContent(appConfig.msgFilterStartLastQuestion), this.$.t24selbtnLVX.show()), this.$.questionList.refresh(), this.$.questionList.applyStyle("display", "block"), this.$.questionList.applyStyle("z-index", "1000"), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems()), this.hasTwoStepChapterSelection && (this.$.lblQuestionInTopicDisplay.setContent("&nbsp;&nbsp;" + this.$.questionList.getNumberOfItems() + appConfig.msgQuestionsInTopic), this.$.questionList.getNumberOfItems() > 0 ? this.$.btnPhoneSwitchToQuestions.show() : this.$.btnPhoneSwitchToQuestions.hide(), this.$.divPhoneSwitchToQuestions.show()), this.$.questionListScroller.setScrollTop(0), appConfig.appWebKitViewerVersion ? (this.$.questionListSpinnerContainer.hide(), this.$.questionListSpinner.stop(), this.$.questionList.render(), this.$.questionList.refresh(), enyo.job("jobRefreshTree", enyo.bind(this, "refreshTree"), 100)) : (this.$.questionListSpinnerContainer.hide(), this.$.questionListSpinner.stop()), this.$.PageHeader.render();
},
refreshTreeDelayed: function() {
enyo.job("jobRefreshTree", enyo.bind(this, "refreshTree"), 100);
},
refreshTree: function() {
this.$.catTree.hide(), this.$.catTree.show(), this.$.catTree.render(), this.$.PageHeader.render();
},
prepareSelectedQuestions: function() {
this.isOfficialCatTree() && (appConfig.userLastViewedTopicId = this.$.catTree.currentCategoryId), appCE.clearQuestionIdsArray(), this.addToQuestionSelection();
},
addToQuestionSelection: function() {
this.$.questionList.updateSelQuestionArray(), appCE.setQuestionOrigin(0), appCE.addQuestionIdsToQuestionsArray(this.$.questionList.arrSelectedQuestionIds);
},
readSelectedQuestions: function() {
this.prepareSelectedQuestions(), appCE.getNumberOfQuestionsInSelection() == "0" ? alert(appConfig.msgSelectQuestionsBeforeReading, this) : this.doReadButtonTap();
},
practiceSelectedQuestions: function() {
this.prepareSelectedQuestions(), appCE.getNumberOfQuestionsInSelection() == "0" ? alert(appConfig.msgSelectQuestionsBeforePracticing, this) : this.doPracticeButtonTap();
},
tapSelectAll: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "all";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNoFilter), this.$.questionList.selectAll(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectReverse: function() {
this.$.t24selbtn1caption.setContent(appConfig.msgCustomFilter), this.$.questionList.selectReverse(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectRedYellow: function() {
this.$.filterQuestionSelector.hide(), this.$.questionList.selectRedYellow(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectRed: function() {
this.$.filterQuestionSelector.hide(), this.$.questionList.selectRed(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectGrey: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "unfit";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNotReadyForExam), this.$.questionList.selectGrey(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectGreen: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "fit";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterReadyForExam), this.$.questionList.selectGreen(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectNever: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "never";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNeverAnswered), this.$.questionList.selectNever(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectImage: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "image";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterImageQuestions), this.$.questionList.selectImage(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectVideo: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "video";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterVideoQuestions), this.$.questionList.selectVideo(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelect5P: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "5p";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilter5PointQuestions), this.$.questionList.select5P(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectLastViewedQuestion: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "lastviewed";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterStartLastQuestion), this.$.questionList.selectLastViewedQuestion(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectMarked: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "marked";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterMarkedQuestions), this.$.questionList.selectMarked(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapRemoveLastViewedFilter: function() {
this.$.questionList.selectQuestionsWithLastViewed = !1, this.$.t24selbtnLVX.hide(), this.refreshQuestionList2();
},
updateSelectedQuestionDisplay: function() {
this.$.t24selbtn1caption.setContent(appConfig.msgCustomFilter), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
}
}), enyo.kind({
name: "MarkedPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onReadButtonTap: "",
onPracticeButtonTap: "",
onClassButtonTap: "",
onHelpButtonTap: ""
},
filterMode: "all",
tempFilterMode: "all",
components: uiMarkedAndSearchPageView,
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.$.inputSearchwordX.hide(), this.inherited(arguments);
},
initSearchQuestionsPage: function() {
this.pageMode = "search", this.$.inputSearchword.setPlaceholder(appConfig.msgSearchQuestionPlaceholder), this.$.btnClearList.setContent(appConfig.btnClearList), this.$.PageHeader.setSubtitle(appConfig.pageSubtitleBySearch), this.$.questionSelectionContainer.applyStyle("display", "none"), this.$.questionSearchContainer.applyStyle("display", "block"), this.$.questionList.setQuestionListPage(2), appCE.clearQuestionIdsArray(), this.emptySearchword();
},
initMarkedQuestionsPage: function() {
this.pageMode = "marked", this.$.PageHeader.setSubtitle(appConfig.pageSubtitleByMarked), this.$.btnClearList.setContent(appConfig.btnClearList), this.$.questionSelectionContainer.applyStyle("display", "block"), this.$.questionSearchContainer.applyStyle("display", "none"), this.$.questionList.setQuestionListPage(1), appCE.clearQuestionIdsArray(), this.refreshQuestionList(), this.$.questionListScroller.setScrollTop(0);
},
emptySearchword: function() {
this.$.inputSearchword.setValue(""), this.$.inputSearchwordX.hide(), this.initNewSearch("");
},
updateSearchwordXButton: function() {
this.$.inputSearchword.getValue() == "" ? this.$.inputSearchwordX.hide() : this.$.inputSearchwordX.show();
},
updateSearchwordXButtonAndResultlist: function() {
this.updateSearchwordXButton(), this.initNewSearch(this.$.inputSearchword.getValue());
},
initNewSearch: function(a) {
this.pageMode == "search" && (this.searchInProgress && (this.startNewSearch = !0), this.searchTerm = a.toLowerCase(), this.runSearch());
},
runSearch: function() {
this.searchInProgress = !0;
var a = 0, b, c, d, e;
appCE.clearQuestionIdsArray(), appCE.arrTempQuestionIds = new Array;
if (this.searchTerm != "") for (var f in dbTblQ) {
if (appConfig.userClassSelectedId == appConfig.appClassMofaId && dbTblQ[f].basic_mofa == 1 || appConfig.userClassSelectedId != appConfig.appClassMofaId && dbTblQ[f].basic == 1 || dbTblQ[f].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) {
b = dbTblQ[f].text.rot13().toLowerCase();
try {
c = dbTblQ[f].asw_1.toLowerCase();
} catch (g) {
c = "";
}
try {
d = dbTblQ[f].asw_2.toLowerCase();
} catch (g) {
d = "";
}
try {
e = dbTblQ[f].asw_3.toLowerCase();
} catch (g) {
e = "";
}
typeof c == "undefined" && (c = ""), typeof d == "undefined" && (d = ""), typeof e == "undefined" && (e = "");
if (dbTblQ[f].number.indexOf(this.searchTerm) > -1 || b.indexOf(this.searchTerm) > -1 || c.indexOf(this.searchTerm) > -1 || d.indexOf(this.searchTerm) > -1 || e.indexOf(this.searchTerm) > -1) {
appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = f, a++;
if (a >= appConfig.maxDisplayedSearchResults) break;
}
}
if (this.startNewSearch) {
this.startNewSearch = !1;
break;
}
}
this.$.questionList.refresh(), this.$.t24selQuestionAmountSearch.setContent(this.$.questionList.getNumberOfSelectedItems()), a == 0 && (this.searchTerm == "" ? this.$.questionList.setContent(appConfig.msgBySearchExplanation) : this.$.questionList.setContent(appConfig.msgBySearchNoHitExplanation)), a > 0 ? (this.$.PageFooter.setBtnchapterread("visible"), this.$.PageFooter.setBtnchapterpractice("visible")) : (this.$.PageFooter.setBtnchapterread("invisible"), this.$.PageFooter.setBtnchapterpractice("invisible")), this.searchInProgress = !1;
},
showFilterSelectBox: function() {
this.$.filterQuestionSelector.initSelector(), this.$.filterQuestionSelector.show();
},
displayStatisticsInfo: function() {
var a = parseInt(this.$.questionList.getNumberOfItems(), 10), b = parseInt(this.$.questionList.getNumberOfFitForTestItems(), 10), c = 0, d = parseInt(this.$.questionList.getNumberOfAnsweredWrongLastTestItems(), 10), e = 0, f = this.$.questionList.getNumberOfSelectedItems();
if (a > 0) var c = 100 * b / a, e = 100 * d / a;
var g = "";
g += '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgFilterCurrentSelection + '</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>', g += '<table width="100%" cellpadding="0" cellspacing="0">', g += "<tr><td><b>" + this.getQuestionWord(1 * a) + " " + appConfig.msgFilterInThisList + '</b></td><td style="text-align:right"><span class="qamountblack">' + a + " </span></td></tr>", g += "<tr><td>" + appConfig.msgFilterLabelReadyForExam + " (" + Math.round(c * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountgreen">' + b + " </span></td></tr>", g += "<tr><td>" + appConfig.msgQuesiontRecentlyAnsweredWrong + " (" + Math.round(e * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountred">' + d + " </span></td></tr>", g += '<tr><td colspan="2"><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div></td></tr>', g += "<tr><td>" + appConfig.msgFilterBoxSelectedForReadingOrPracticing + '</td><td style="text-align:right"><span class="qamountblack">' + f + " </span></td></tr>", g += "</table>", alert(g, this);
},
getQuestionWord: function(a) {
if (a == 1) var b = appConfig.msgAppQuestion; else var b = appConfig.msgAppQuestions;
return b;
},
scrollQListToTop: function() {
this.$.questionListScroller.setScrollTop(0);
},
refreshQuestionList: function() {
this.pageMode == "marked" && this.refreshQuestionList2(), this.pageMode == "search" && this.runSearch();
},
refreshQuestionList2: function() {
var a = 0;
appCE.arrTempQuestionIds = new Array;
try {
var b = new Object;
b = appDB.getItem("markedquestions");
var c = b.markedQuestionIds, d = c.split(",");
for (var e = 0; e < d.length; e++) d[e] != "" && typeof dbTblQ[d[e]] != "undefined" && (appCE.arrTempQuestionIds[appCE.arrTempQuestionIds.length] = d[e], a++);
} catch (f) {}
this.$.PageFooter.setBtnchapterread("visible"), this.$.PageFooter.setBtnchapterpractice("visible"), this.$.questionList.refresh();
switch (this.filterMode) {
case "all":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNoFilter);
break;
case "never":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNeverAnswered);
break;
case "fit":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterReadyForExam);
break;
case "unfit":
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNotReadyForExam);
break;
case "image":
this.$.t24selbtn1caption.setContent("Nur Bildfragen");
break;
case "video":
this.$.t24selbtn1caption.setContent("Nur Videofragen");
}
this.$.questionList.getNumberOfSelectedItems() > 0 ? (this.$.PageFooter.setBtnchapterread("visible"), this.$.PageFooter.setBtnchapterpractice("visible")) : (this.$.PageFooter.setBtnchapterread("invisible"), this.$.PageFooter.setBtnchapterpractice("invisible")), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
readSelectedQuestions: function() {
appCE.clearQuestionIdsArray(), this.addToQuestionSelection(), appCE.getNumberOfQuestionsInSelection() == "0" ? alert(appConfig.msgSelectQuestionsBeforeReading, this) : this.doReadButtonTap();
},
practiceSelectedQuestions: function() {
appCE.clearQuestionIdsArray(), this.addToQuestionSelection(), appCE.getNumberOfQuestionsInSelection() == "0" ? alert(appConfig.msgSelectQuestionsBeforePracticing, this) : this.doPracticeButtonTap();
},
addToQuestionSelection: function() {
this.$.questionList.updateSelQuestionArray(), appCE.setQuestionOrigin(0), appCE.addQuestionIdsToQuestionsArray(this.$.questionList.arrSelectedQuestionIds);
},
tapUnmarkAll: function() {
var a = alert(appConfig.msgConfirmUnsetAllMarkedQuestions, this, {
cancelText: appConfig.msgAppNo,
confirmText: appConfig.msgAppYes,
onConfirm: function(a) {
this.hide(), fsapp.unmarkAllQuestions(), this.destroy();
}
});
},
tapSelectAll: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "all";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNoFilter), this.$.questionList.selectAll(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectReverse: function() {
this.$.t24selbtn1caption.setContent(appConfig.msgCustomFilter), this.$.questionList.selectReverse(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectRedYellow: function() {
this.$.filterQuestionSelector.hide(), this.$.questionList.selectRedYellow(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectRed: function() {
this.$.filterQuestionSelector.hide(), this.$.questionList.selectRed(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectGrey: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "unfit";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNotReadyForExam), this.$.questionList.selectGrey(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectGreen: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "fit";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterReadyForExam), this.$.questionList.selectGreen(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectNever: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "never";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterNeverAnswered), this.$.questionList.selectNever(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectImage: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "image";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterImageQuestions), this.$.questionList.selectImage(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectVideo: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "video";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterVideoQuestions), this.$.questionList.selectVideo(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelect5P: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "5p";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilter5PointQuestions), this.$.questionList.select5P(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectLastViewedQuestion: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "lastviewed";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterStartLastQuestion), this.$.questionList.selectLastViewedQuestion(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
tapSelectMarked: function() {
this.$.filterQuestionSelector.hide(), this.filterMode = "marked";
try {
myFilterAlert.hide(), myFilterAlert.destroy();
} catch (a) {}
this.$.t24selbtn1caption.setContent(appConfig.msgFilterMarkedQuestions), this.$.questionList.selectMarked(), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems());
},
updateSelectedQuestionDisplay: function() {
this.$.t24selbtn1caption.setContent(appConfig.msgCustomFilter), this.$.t24selQuestionAmount.setContent(this.$.questionList.getNumberOfSelectedItems()), this.$.t24selQuestionAmountSearch.setContent(this.$.questionList.getNumberOfSelectedItems());
}
}), enyo.kind({
name: "IntroPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onUnlockAppTap: ""
},
components: uiIntroPageView,
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments);
},
openRegisterLink: function() {
openWebview(appConfig.urlRegisterLink, !1);
}
}), enyo.kind({
name: "SetPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onReadButtonTap: "",
onPracticeButtonTap: "",
onTestButtonTap: "",
onClassButtonTap: ""
},
components: uiSetPageView,
filterDate: "",
create: function() {
this.inherited(arguments);
},
showContextHelp: function(a, b) {
try {
switch (a.name) {
case "setValidUntilInfo":
alert(appConfig.msgsetValidUntilInfoExplanation, this);
}
} catch (c) {}
},
prepareShowSetButtons: function() {
this.$.btnShowSetGroup1.hide(), this.$.btnShowSetGroup2.hide();
},
formatSetDate: function(a) {
var b = a.split("-");
return b[2] + "." + b[1] + "." + b[0];
},
showSetGroupByDate: function(a, b) {
this.$.btnShowSetGroup1.applyStyle("background-color", "#666"), this.$.btnShowSetGroup2.applyStyle("background-color", "#666"), b.originator.applyStyle("background-color", appConfig.btnBgColor);
var c = b.originator.getAttributes();
this.prepareSetCheckboxesByDate(c.rel);
},
prepareSetCheckboxes: function(a) {
this.$.PageFooter.$.buttonback.setContent(appConfig.msgCancelApply);
if (this.filterDate == "") {
this.prepareShowSetButtons(), this.$.btnShowSetGroup2.applyStyle("background-color", "#666"), this.$.btnShowSetGroup1.applyStyle("background-color", appConfig.btnBgColor);
var b = this.$.btnShowSetGroup1.getAttributes();
this.prepareSetCheckboxesByDate(b.rel);
} else this.prepareSetCheckboxesByDate(this.filterDate);
this.$.showSetButtons.hide(), appConfig.appHas2DBs ? (appConfig.userDb2selected ? this.$.setValidUntilInfo.setContent("<h3 style='margin-bottom:0;'>" + appConfig.msgSettingsDBSwitchAfter + appConfig.db2ValidFromDate + " " + appConfig.btnInfoIcon + "</h3>") : this.$.setValidUntilInfo.setContent("<h3 style='margin-bottom:0;'>" + appConfig.msgSettingsDBSwitchBefore + appConfig.db2ValidFromDate + " " + appConfig.btnInfoIcon + "</h3>"), this.$.chkGroup.applyStyle("margin-top", "20px")) : (this.$.setValidUntilInfo.hide(), this.$.chkGroup.applyStyle("margin-top", "40px"));
},
prepareSetCheckboxesByDate: function(a) {
this.filterDate = a, this.$.chkGroup.applyStyle("margin-top", "0"), this.$.chkGroup.destroyComponents(), this.$.chkGroup.destroyClientControls(), appConfig.appLockable && !appConfig.userUnlockedApp ? this.$.SelectedDisplay.setContent(appConfig.msgNoSetSelectedPhraseLockedApp) : this.$.SelectedDisplay.setContent(appConfig.msgNoSetSelectedPhrase);
var b = 0, c = !1, d = new Array, e = !1;
for (var f in dbTableSets) if (dbTableSets[f]["class_id"] == appConfig.userClassSelectedId) {
var g = !0;
b >= appConfig.appMaxAvailableSetsForUser && (g = !1);
if (g) {
d = appDB.getSetStatistics(f).split(",");
var h = "", i = "";
for (var j = d[2].length; j > -1; j--) {
j == d[2].length - 1 ? i = "Letzte Pr\u00fcfung: " : i = "Vor " + (d[2].length - j) + " Pr\u00fcfungen: ";
if (d[2].charAt(j) == "n" || d[2].charAt(j) == "-") i = "Bogen noch nicht " + (d[2].length - j) + " mal gepr\u00fcft!", h += "<div title='" + i + "' class='setlistunanswered'></div>";
if (d[2].charAt(j) == "f" || d[2].charAt(j) == "0") i += "nicht bestanden", h += "<div title='" + i + "' class='setlistincorrect'></div>";
if (d[2].charAt(j) == "s" || d[2].charAt(j) == "1") i += "bestanden", h += "<div title='" + i + "' class='setlistcorrect'></div>";
}
var k = appConfig.msgShortWorForQuestionnaire + " " + dbTableSets[f].rank + "<br /><small>" + h + "</small>";
e ? appConfig.appDisplayDisabledSets && this.$.chkGroup.createComponent({
tag: "div",
style: "opacity:0.5",
classes: "setcheckbox",
ontap: "raiseAdTriggerForDisabledSets",
components: [ {
tag: "img",
src: "assets/btn_checkbox_empty.png",
style: "float:left; margin-right:8px; margin-top:2px;"
}, {
tag: "div",
content: k,
style: "float:left; font-size:16px; line-height:110%; ",
allowHtml: !0
} ]
}, {
owner: this
}) : this.$.chkGroup.createComponent({
tag: "div",
style: "",
classes: "setcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "float:left; margin-right:8px; margin-top:2px;",
name: "chkSet" + b,
attributes: {
setId: f
},
checked: c
}, {
tag: "div",
content: k,
style: "float:left; font-size:16px; line-height:110%; ",
allowHtml: !0
} ]
}, {
owner: this
}), b++;
}
appConfig.appMultilingual || (appConfig.appLockable && !appConfig.userUnlockedApp || appConfig.appLockMode == 2 && !appConfig.userUnlockedApp) && b >= appConfig.appNumberOfDemoSets && (e = !0);
}
this.$.chkGroup.render(), this.$.PageFooter.setBtnread("invisible"), this.$.PageFooter.setBtnpractice("invisible"), this.$.PageFooter.setBtntest("invisible");
},
raiseAdTriggerForDisabledSets: function() {
fsapp.displayAd(appConfig.appAdTriggerMenuButton, 0);
},
groupActivated: function(a, b) {
if (b.originator.getActive()) {
var c = b.originator.getAttributes();
appConfig.userSetSelectedId = c.setId, this.$.SelectedDisplay.setContent(appConfig.msgSelectedPhrase1 + appConfig.msgShortWorForQuestionnaire + " " + dbTableSets[appConfig.userSetSelectedId].rank + " (" + appConfig.msgClass + " " + dbTableClasses[appConfig.userClassSelectedId].name + ")" + appConfig.msgSelectedPhrase2);
}
this.$.PageFooter.setBtnread("visible"), this.$.PageFooter.setBtnpractice("visible"), this.$.PageFooter.setBtntest("visible"), appCE.setQuestionOrigin(1), appCE.clearQuestionIdsArray(), appCE.fillQuestionIdsFromString(dbTableSets[appConfig.userSetSelectedId].question_ids);
}
}), enyo.kind({
name: "RoutePage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onReadButtonTap: "",
onPracticeButtonTap: "",
onTestButtonTap: "",
onClassButtonTap: ""
},
components: uiRoutePageView,
filterDate: "",
create: function() {
this.inherited(arguments);
},
prepareRouteCheckboxes: function() {
this.$.PageFooter.$.buttonback.setContent(appConfig.msgCancelApply);
var a = "";
this.filterDate = a, this.$.chkGroup.applyStyle("margin-top", "20px"), this.$.chkGroup.destroyComponents(), this.$.chkGroup.destroyClientControls(), appConfig.appLockable && !appConfig.userUnlockedApp ? this.$.SelectedDisplay.setContent(appConfig.msgNoRouteSelectedPhraseLockedApp) : this.$.SelectedDisplay.setContent(appConfig.msgNoRouteSelectedPhrase);
var b = 0, c = !1, d = new Array, e = !1, f = !0;
for (var g in dbTableRoutes) if (f) {
d = new Array("", "", "010");
var h = "", i = "";
for (var j = d[2].length; j > -1; j--) {
j == d[2].length - 1 ? i = "Letzte Pr\u00fcfung: " : i = "Vor " + (d[2].length - j) + " Pr\u00fcfungen: ";
if (d[2].charAt(j) == "n" || d[2].charAt(j) == "-") i = "Strecke noch nicht " + (d[2].length - j) + " mal gepr\u00fcft!", h += "<div title='" + i + "' class='setlistunanswered'></div>";
if (d[2].charAt(j) == "f" || d[2].charAt(j) == "0") i += "nicht bestanden", h += "<div title='" + i + "' class='setlistincorrect'></div>";
if (d[2].charAt(j) == "s" || d[2].charAt(j) == "1") i += "bestanden", h += "<div title='" + i + "' class='setlistcorrect'></div>";
}
var k = dbTableRoutes[g].title + "<br />" + "<small>" + h + "</small>";
e ? this.$.chkGroup.createComponent({
tag: "div",
style: "opacity:0.5",
classes: "setcheckbox",
ontap: "raiseAdTriggerForDisabledSets",
components: [ {
tag: "img",
src: "assets/btn_checkbox_empty.png",
style: "float:left; margin-right:8px; margin-top:2px;"
}, {
tag: "div",
content: k,
style: "float:left; font-size:16px; line-height:110%; ",
allowHtml: !0
} ]
}, {
owner: this
}) : this.$.chkGroup.createComponent({
tag: "div",
style: "",
classes: "setcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "float:left; margin-right:8px; margin-top:2px;",
name: "chkSet" + b,
attributes: {
routeId: g
},
checked: c
}, {
tag: "div",
content: k,
style: "float:left; font-size:16px; line-height:110%; ",
allowHtml: !0
} ]
}, {
owner: this
}), b++;
}
this.$.chkGroup.render(), this.$.PageFooter.setBtnread("invisible"), this.$.PageFooter.setBtnpractice("invisible"), this.$.PageFooter.setBtntest("invisible");
},
raiseAdTriggerForDisabledSets: function() {
fsapp.displayAd(appConfig.appAdTriggerMenuButton, 0);
},
groupActivated: function(a, b) {
if (b.originator.getActive()) {
var c = b.originator.getAttributes();
appConfig.userRouteSelectedId = c.routeId, this.$.SelectedDisplay.setContent(appConfig.msgRouteSelectedPhrase1 + dbTableRoutes[appConfig.userRouteSelectedId].title + appConfig.msgRouteSelectedPhrase2);
}
this.$.PageFooter.setBtnrouteread("visible"), this.$.PageFooter.setBtnroutepractice("visible"), appCE.setQuestionOrigin(1), appCE.clearQuestionIdsArray(), appCE.fillQuestionIdsFromString(dbTableRoutes[appConfig.userRouteSelectedId].situation_ids);
}
}), enyo.kind({
name: "LoginPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onClassButtonTap: "",
onUnlockButtonTap: "",
onHelpButtonTap: ""
},
membershipnumber: 0,
firstname: "",
lastname: "",
components: uiLoginPageView,
create: function() {
this.inherited(arguments), appConfig.verifierMode == 1 && this.$.inputUserMembershipNumber.setType("text");
},
rendered: function() {
this.$.inputUserFirstnameDecorator.applyStyle("display:block"), appConfig.appOnMobileDevice && this.$.inputUserMembershipNumber.setType("number"), appConfig.msgLoginFirstnameWord == "" && (this.$.inputUserFirstnameDecorator.hide(), this.$.inputUserFirstname.hide()), appConfig.appLockMode == 2 && (this.$.inputUserFirstname.setValue(appDB.readDeviceGUID()), this.$.inputUserFirstnameDecorator.hide(), this.$.inputUserFirstname.hide()), this.inherited(arguments);
},
initPage: function() {
appConfig.appOnMobileDevice ? this.$.inputUserMembershipNumber.setType("number") : this.$.inputUserMembershipNumber.setType("text"), appConfig.verifierMode == 1 && (this.$.inputUserMembershipNumber.setType("text"), this.$.inputUserMembershipNumber.setType("password")), appConfig.appLockMode == 2 && (this.$.inputUserFirstname.setValue(appDB.readDeviceGUID()), this.$.inputUserFirstnameDecorator.hide(), this.$.inputUserFirstname.hide()), appConfig.appUseOpenApiProcess && this.$.inputUserMembershipNumber.setType("text");
},
togglePasswordVisibility: function() {
try {
this.$.inputUserMembershipNumber.getType() == "password" ? (this.$.inputUserMembershipNumber.setType("text"), this.$.btnTogglePasswordVisibility.setContent("<i class='material-icons'>ol_visibility</i>")) : (this.$.inputUserMembershipNumber.setType("password"), this.$.btnTogglePasswordVisibility.setContent("<i class='material-icons'>ol_visibility_off</i>"));
} catch (a) {}
},
updateMembershipCodeField: function() {
try {
var a = this.$.inputUserMembershipNumber.getValue();
a = a.replace(/[^\d-]/g, "");
var b = "####-####-####", c = "";
for (var d = 0; d < a.length; d++) {
var e = b.substr(d, 1);
switch (e) {
case "-":
isNaN(a.substr(d, 1)) ? c += "-" : c = c + "-" + a.substr(d, 1);
break;
case "#":
isNaN(a.substr(d, 1)) ? c += "#" : c += a.substr(d, 1);
}
}
this.$.inputUserMembershipNumber.setValue(c);
} catch (f) {
log(1, "Error: updateMembershipCodeField(): " + f.message);
}
},
emptyTextfield1: function() {
this.$.inputUserFirstname.setValue("");
},
emptyTextfield2: function() {
this.$.inputUserLastname.setValue("");
},
emptyTextfield3: function() {
this.$.inputUserMembershipNumber.setValue("");
},
updateEmptyButtons: function() {},
resetTextfields: function() {
this.$.inputUserFirstname.setValue(""), this.$.inputUserLastname.setValue(""), this.$.inputUserMembershipNumber.setValue(""), this.updateEmptyButtons();
},
emailIsValid: function(a) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a);
},
verifyLogin: function() {
if (!appDB.hasNetworkConnection()) {
alert(appConfig.msgErrorNoOnlineConnection, this);
return;
}
appConfig.appUseOpenApiProcess ? (this.membershipnumber = this.$.inputUserMembershipNumber.getValue().toLowerCase(), this.lastname = this.$.inputUserLastname.getValue().toLowerCase().trim(), this.firstname = "") : (this.membershipnumber = this.$.inputUserMembershipNumber.getValue().toLowerCase().replace(/[^a-z0-9,.?!@\-_]/ig, ""), this.lastname = this.$.inputUserLastname.getValue().toLowerCase(), this.firstname = this.$.inputUserFirstname.getValue().toLowerCase());
var a = !1;
appConfig.appLastNameMustBeEmailToUnlock && (a = !this.emailIsValid(this.lastname));
if (this.membershipnumber.length < 5 || appConfig.msgLoginFirstnameWord != "" && this.firstname.length < 2 || this.lastname < 2 || a) {
alert(appConfig.msgPleaseFillInAllFields, this);
return;
}
if (appConfig.appUseOpenApiProcess) {
var b = {
email: this.lastname,
code: this.membershipnumber
}, c = JSON.stringify(b), d = new enyo.Ajax({
url: appConfig.appOpenApiUrl + "/login",
method: "POST",
contentType: "application/json"
});
d.response(this, "processApiResponse"), d.error(this, "processApiError"), d.go(c);
} else {
var e = MD5(String(Number(Number(this.membershipnumber) + 123)));
try {
if (appConfig.verifierMode == 1) var e = MD5(this.membershipnumber + "123");
} catch (f) {}
var d = new enyo.Ajax({
url: appConfig.urlVerifyUser,
method: "GET",
handleAs: "text"
});
d.response(this, "processResponse"), d.error(this, "processError"), d.go({
n: this.membershipnumber.rot13(),
v: e,
f: this.firstname.rot13(),
l: this.lastname.rot13()
});
}
},
processApiResponse: function(a, b) {
try {
var c = JSON.parse(a.xhr.responseText);
appDB.setItem("apiLoginData", c), appConfig.userSaveUserDataUnescaped ? appDB.setUnescapedAppUnlockUserData(this.lastname, MD5(String(this.lastname)), this.membershipnumber) : appDB.setAppUnlockUserData(this.firstname, MD5(this.membershipnumber), schoolname), appConfig.userUnlockedApp = !0, appConfig.appSyncLocked = !1, appConfig.userAutoSync = appConfig.activateSyncAfterSyncUnlock, appConfig.userAutoSync ? appDB.setItem("autosync", "1") : appDB.setItem("autosync", "0"), appConfig.appDisplayLoginSuccessfulMsg && enyo.job("displayLoginMsg", enyo.bind(this, "displayLoginMsg"), 2500), this.bubble("onUnlockButtonTap");
} catch (d) {
alert("Es trat ein Fehler bei der Verarbeitung der API Antwort auf: " + d.message, this);
}
},
processApiError: function(a, b) {
try {
var c = JSON.parse(a.xhr.responseText);
alert(c.error_description, this);
} catch (d) {
alert("Es trat ein Fehler bei der Verbindung zur API auf: " + d.message, this);
}
},
processResponse: function(a, b) {
if (!b) {
alert(appConfig.msgVerificationNotSuccessful, this);
return;
}
if (b == "valid" || b.substring(0, 6) == "valid:") {
var c = "";
b.substring(0, 6) == "valid:" && (c = b.substring(6)), appConfig.userSaveUserDataUnescaped ? appDB.setUnescapedAppUnlockUserData(this.lastname, MD5(String(this.lastname)), this.membershipnumber) : appDB.setAppUnlockUserData(this.firstname, MD5(this.membershipnumber), c), appConfig.userUnlockedApp = !0, appConfig.appSyncLocked = !1, appConfig.userAutoSync = appConfig.activateSyncAfterSyncUnlock, appConfig.userAutoSync ? appDB.setItem("autosync", "1") : appDB.setItem("autosync", "0"), appDB.hasNetworkConnection() && (fsapp.setupWizardActive = !1, fsapp.syncApp()), appConfig.appDisplayLoginSuccessfulMsg && enyo.job("displayLoginMsg", enyo.bind(this, "displayLoginMsg"), 2500), this.bubble("onUnlockButtonTap");
} else alert(appConfig.msgVerificationFailed, this);
},
processError: function(a, b) {
alert("HTTP Status is " + a.xhrResponse.status, this);
},
displayLoginMsg: function() {
appConfig.appDisplayLoginSuccessfulMsg && (alert(appConfig.msgRegistration, this), userDevicePlatform == "phone" && appConfig.msgRegistrationFollowUpMsgMobile != "" && alert(appConfig.msgRegistrationFollowUpMsgMobile, this), appConfig.appSyncLocked && (appConfig.appSyncLocked = !1, fsapp.$.WelcomePage.hideInAppPurchaseButton()));
}
}), enyo.kind({
name: "GraphBar",
kind: "Control",
published: {
title: "barGraph",
chapterId: 0,
total: 1,
answeredtotal: 0,
correct: 0,
incorrect: 0
},
events: {
onGotoChapter: ""
},
components: [ {
tag: "div",
name: "bargraph",
classes: "t24bargraph",
style: "position:relative;text-align:right;",
components: [ {
tag: "div",
name: "title",
classes: "t24bargraphtitle",
allowHtml: !0,
ontap: "displayDetails"
}, {
tag: "div",
classes: "t24bargraphtitle",
style: "text-align:right;left:auto !important;right:0 !important;",
components: [ {
tag: "span",
name: "gotobutton",
classes: "t24bargraphgotobutton",
content: appConfig.btnForwardIcon,
style: "height:30px;vertical-align:middle;margin-right:10px;padding-left:20px;padding-right:10px;",
allowHtml: !0,
ontap: "jumpToChapterPage"
} ]
}, {
tag: "div",
name: "graphcontainer",
classes: "t24bargraphansweredbar",
style: "height:20px;overflow:hidden;position:absolute;left:0;right:0;bottom:0;background-color:" + appConfig.appBargraphEmptyColor + ";",
components: [ {
tag: "div",
name: "answeredtotal",
style: "",
classes: "t24bargraphansweredtotal"
}, {
tag: "div",
name: "answeredrightwrong",
style: "background-color:transparent;z-index:99;right:0;",
classes: "t24bargraphansweredtotal",
components: [ {
tag: "div",
name: "correct",
classes: "",
style: "float:left;height:100%;background-color:#83bc41;z-index:999;"
}, {
tag: "div",
name: "incorrect",
classes: "",
style: "position:absolute;left:0;height:100%;background-color:#fa3b2a;z-index:999;"
} ]
} ]
}, {
tag: "div",
style: "clear:both"
} ]
} ],
create: function() {
this.inherited(arguments);
},
rendered: function() {
var a = 100 * this.correct / this.total, b = 100 * this.incorrect / this.total, c = 100 * this.answeredtotal / this.total;
this.$.title.setContent(this.title + " " + appConfig.btnInfoIcon), this.$.answeredtotal.applyStyle("width", c + "%"), this.$.correct.applyStyle("width", a + "%"), $ibcLeftPerc = c - b, this.$.incorrect.applyStyle("left", $ibcLeftPerc + "%"), this.$.incorrect.applyStyle("width", b + "%"), this.inherited(arguments), this.total == 0 ? this.$.bargraph.applyStyle("opacity", "0.2") : this.$.bargraph.applyStyle("opacity", "1.0"), appConfig.appLockable && !appConfig.userUnlockedApp ? this.$.gotobutton.hide() : this.$.gotobutton.show();
},
jumpToChapterPage: function() {
this.doGotoChapter({
chapter: this.chapterId
});
},
displayDetails: function() {
var a = 100 * this.correct / this.total, b = 100 * this.incorrect / this.total, c = this.answeredtotal, d = 100 * c / this.total, e = 100 * (c + this.incorrect) / this.total, f = 100 * this.answeredtotal / this.total, g = this.total - this.answeredtotal, h = 100 * g / this.total, i = "";
i += '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + this.title + '</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>', i += '<table width="100%" cellpadding="0" cellspacing="0">', i += "<tr><td><b>" + this.getQuestionWord(1 * this.total) + " " + appConfig.msgFilterInThisTopic + '</b></td><td style="text-align:right"><span class="qamountblack">' + this.total + " </span></td></tr>", i += '<tr><td colspan="2"><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div></td></tr>', i += "<tr><td>" + appConfig.msgStatPageAlreadyPracticed + " (" + Math.round(d * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountorange">' + c + " </span></td></tr>", i += "<tr><td>" + appConfig.msgNotYetPracticed + " (" + Math.round(h * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountgrey">' + g + " </span></td></tr>", i += '<tr><td colspan="2"><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div></td></tr>', i += "<tr><td>" + appConfig.msgFilterLabelReadyForExam + " (" + Math.round(a * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountgreen">' + this.correct + " </span></td></tr>", i += "<tr><td>" + appConfig.msgStatPageLastWrong + " (" + Math.round(b * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountred">' + this.incorrect + " </span></td></tr>", i += "</table>", alert(i, this);
},
getQuestionWord: function(a) {
if (a == 1) var b = appConfig.msgAppQuestion; else var b = appConfig.msgAppQuestions;
return b;
}
}), enyo.kind({
name: "SimpleGraphBar",
kind: "Control",
published: {
title: "Simple Bar Graph",
barcolor: "#f0f",
percentage: 0
},
events: {},
components: [ {
tag: "div",
name: "bargraph",
classes: "t24bargraph",
style: "position:relative;text-align:right;",
components: [ {
tag: "div",
name: "title",
classes: "t24bargraphtitle",
allowHtml: !0,
style: "font-size:0.9em;"
}, {
tag: "div",
name: "graphcontainer",
classes: "t24bargraphansweredbar",
style: "height:20px;overflow:hidden;position:absolute;left:0;right:0;bottom:0;background-color:" + appConfig.appBargraphEmptyColor + ";",
components: [ {
tag: "div",
name: "answeredtotal",
style: "",
classes: "t24bargraphansweredtotal"
}, {
tag: "div",
name: "answeredrightwrong",
style: "background-color:transparent;z-index:99;right:0;",
classes: "t24bargraphansweredtotal",
components: [ {
tag: "div",
name: "correct",
classes: "",
style: "float:left;height:100%;z-index:999;"
} ]
} ]
}, {
tag: "div",
style: "clear:both"
} ]
} ],
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.$.correct.applyStyle("width", parseInt(this.percentage, 10) + "%"), this.$.correct.applyStyle("background-color", this.barcolor), this.$.title.setContent(this.title);
},
percentageChanged: function() {
this.$.correct.applyStyle("width", parseInt(this.percentage, 10) + "%");
},
barcolorChanged: function() {
this.$.correct.applyStyle("background-color", this.barcolor);
}
}), enyo.kind({
name: "BlinkTimer",
kind: enyo.Component,
minInterval: 50,
published: {
baseInterval: 100
},
events: {
onTriggered: ""
},
create: function() {
this.inherited(arguments), this.start();
},
destroy: function() {
this.stop(), this.inherited(arguments);
},
start: function() {
this.job = window.setInterval(enyo.bind(this, "timer"), this.baseInterval);
},
stop: function() {
window.clearInterval(this.job);
},
timer: function() {
this.doTriggered({
time: (new Date).getTime()
});
},
baseIntervalChanged: function(a) {
this.baseInterval = Math.max(this.minInterval, this.baseInterval), this.stop(), this.start();
}
}), enyo.kind({
name: "StatisticsPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onClassButtonTap: ""
},
components: uiStatisticsPageView,
create: function() {
this.inherited(arguments), appConfig.resetStatisticsAllowed || this.$.resetStatisticsButton.applyStyle("display", "none"), appConfig.hideFooterIfPossible ? (this.$.PageFooter.hide(), this.$.ClientArea.applyStyle("bottom", "0")) : (this.$.PageFooter.show(), this.$.ClientArea.applyStyle("bottom", appConfig.PageFooterHeight));
},
rendered: function() {
this.inherited(arguments);
},
resetStatistics: function() {
var a = appDB.getAnsweredQuestionsAmount().split(",");
while (parseInt(a[0], 10) > 0) appDB.deleteQuestionStatistics(), a = appDB.getAnsweredQuestionsAmount().split(",");
this.updateStatistics();
},
displayProgressChartExplanation: function() {
alert(appConfig.msgTrainingGraphExplanation, this);
},
displayFitForTestExplanation: function() {
var a = appDB.getStatisticsCache();
a != null ? a.statisticData == null && this.$.Statistics.updateStatisticDataIntoDatabase(!0) : this.$.Statistics.updateStatisticDataIntoDatabase(!0);
var a = appDB.getStatisticsCache();
a != null && (log(a), questionsInCurrentClass = a.statisticData.questionsInCurrentClass, questionsFitForTest = a.statisticData.questionsFitForTest, questionsAnswered = a.statisticData.questionsAnswered, questionstWrongLastTime = a.statisticData.questionstWrongLastTime, arrFirstLevelStatistics = a.statisticData.firstLevelStatistics, arrFirstLevelCategories = a.statisticData.firstLevelCategories);
var b = questionsFitForTest / questionsInCurrentClass * 100, c = questionsAnswered / questionsInCurrentClass * 100, d = questionstWrongLastTime / questionsInCurrentClass * 100, e = "";
e += '<h2 style="margin-top:0;margin-bottom:8px;font-weight:normal;">' + appConfig.msgStatPageOverview + '</h2><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div>', e += '<table width="100%" cellpadding="0" cellspacing="0">', e += "<tr><td><strong>" + appConfig.msgFilterLabelReadyForExam + " (" + Math.round(b * 10) / 10 + '%)</strong></td><td style="text-align:right"><span class="qamountgreen">' + questionsFitForTest + " </span></td></tr>", e += "<tr><td>" + appConfig.msgStatPageAlreadyPracticed + " (" + Math.round(c * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountorange">' + questionsAnswered + " </span></td></tr>", e += "<tr><td>" + appConfig.msgStatPageLastWrong + " (" + Math.round(d * 10) / 10 + '%)</td><td style="text-align:right"><span class="qamountred">' + questionstWrongLastTime + " </span></td></tr>", e += '<tr><td colspan="2"><div style="height:1px;border-bottom:1px solid #999;margin:6px 0;"/></div></td></tr>', e += "</table>", e += appConfig.msgStatPageExplanationFitForTest + "<br />", alert(e, this);
},
getQuestionWord: function(a) {
if (a == 1) var b = appConfig.msgAppQuestion; else var b = appConfig.msgAppQuestions;
return b;
},
updateStatistics: function() {
var a = appDB.getStatisticsCache();
a != null ? a.statisticData == null && this.$.Statistics.updateStatisticDataIntoDatabase(!0) : this.$.Statistics.updateStatisticDataIntoDatabase(!0);
var a = appDB.getStatisticsCache();
a != null && (log(a), questionsInCurrentClass = parseInt(a.statisticData.questionsInCurrentClass, 10), questionsFitForTest = parseInt(a.statisticData.questionsFitForTest, 10), questionsAnswered = parseInt(a.statisticData.questionsAnswered, 10), questionstWrongLastTime = parseInt(a.statisticData.questionstWrongLastTime, 10), arrFirstLevelStatistics = a.statisticData.firstLevelStatistics, arrFirstLevelCategories = a.statisticData.firstLevelCategories);
if (questionsInCurrentClass > 0) var b = questionsFitForTest / questionsInCurrentClass * 100, c = questionsAnswered / questionsInCurrentClass * 100, d = questionstWrongLastTime / questionsInCurrentClass * 100; else var b = 0, c = 0, d = 0;
html = "<h1>" + appConfig.msgStatPageOverview + '</h1><div class="statisticsPageContainer gradientblock" >', html += '<div style="padding-top:20px;width:33%;min-width:200px;display:inline-block;" id="dchart1"><canvas id="myDChart1" style="height:100%;width:100%"></canvas>', html += '<div style="margin-top:8px"><div style="background-color:#83bc41;" class="t24statcolorbox"> </div> <span class="stp_explanation" style="font-size:80%;margin-bottom:32px;">' + appConfig.msgStatPageReadyForExam + " " + appConfig.btnInfoIcon + "</span></div>", html += "</div>", html += '<div style="padding-top:20px;width:33%;min-width:200px;display:inline-block;" id="dchart2"><canvas id="myDChart2"></canvas>', html += "<div style='margin-top:8px'><div style='background-color:#fdc619;' class='t24statcolorbox'> </div> <span class='stp_explanation' style='font-size:80%;margin-bottom:32px;'>" + appConfig.msgStatPageAlreadyPracticed + "</span></div>", html += "</div>", html += '<div style="padding-top:20px;width:33%;min-width:200px;display:inline-block;" id="dchart3"><canvas id="myDChart3"></canvas>', html += "<div style='margin-top:8px'><div style='background-color:#fa3b2a;' class='t24statcolorbox'> </div> <span class='stp_explanation' style='font-size:80%;margin-bottom:32px;'>" + appConfig.msgStatPageLastWrong + "</span></div>", html += "</div>", html += '<div style="clear:both"></div>', html += "</div>", this.$.statisticsdata1.setContent(html), this.$.statisticsdata1.render(), appConfig.displayStatisticsProgressChart && (html = "<h2>" + appConfig.msgStatPageTrainingProgress + " " + appConfig.btnInfoIcon + '</h2><div class="statisticsPageContainer gradientblock">', html += '<div style="padding-top:20px;width:90%;min-width:200px;display:inline-block;" id="lchart1"><canvas id="myLChart1" style="height:100%;width:100%"></canvas>', html += "</div>", this.$.statisticsprogress1.setContent(html), this.$.statisticsprogress1.render());
var e = fsapp.$.ChapterPage.createTitles(fsapp.$.ChapterPage.$.catTree.getCategoryData(0)), f = fsapp.$.ChapterPage.createTitles(fsapp.$.ChapterPage.$.catTree.getCategoryData(1));
this.$.statisticsgraphicsbasic.destroyComponents(), this.$.statisticsheaderbasic.setContent("<h2>" + e + "</h2>"), this.$.statisticsgraphicsbasic.render();
for (var g = 0; g < arrFirstLevelCategories.length; g++) arrFirstLevelCategories[g].parentname.toLowerCase().indexOf("grundstoff") > -1 && arrFirstLevelStatistics[g].total > 0 && this.$.statisticsgraphicsbasic.createComponent({
kind: "GraphBar",
name: "graphbarG" + g,
title: arrFirstLevelCategories[g].name,
chapterId: arrFirstLevelCategories[g].id,
total: arrFirstLevelStatistics[g].total,
answeredtotal: arrFirstLevelStatistics[g].answeredtotal,
correct: arrFirstLevelStatistics[g].correct,
incorrect: arrFirstLevelStatistics[g].wrong
});
this.$.statisticsheaderextended.setContent("<h2>" + f + " - " + appConfig.msgClass + "&nbsp;" + dbTableClasses[appConfig.userClassSelectedId].name + "</h2>"), this.$.statisticsgraphicsbasic.render(), this.$.statisticsgraphicsextended.destroyComponents();
for (var g = 0; g < arrFirstLevelCategories.length; g++) arrFirstLevelCategories[g].parentname.toLowerCase().indexOf("zusatzstoff") > -1 && arrFirstLevelStatistics[g].total > 0 && this.$.statisticsgraphicsextended.createComponent({
kind: "GraphBar",
name: "graphbarZ" + g,
title: arrFirstLevelCategories[g].name,
chapterId: arrFirstLevelCategories[g].id,
total: arrFirstLevelStatistics[g].total,
answeredtotal: arrFirstLevelStatistics[g].answeredtotal,
correct: arrFirstLevelStatistics[g].correct,
incorrect: arrFirstLevelStatistics[g].wrong
});
this.$.statisticsgraphicsextended.render();
var h = document.getElementById("myDChart1"), i = document.getElementById("myDChart2"), j = document.getElementById("myDChart3");
if (appConfig.appDarkModeActive) var k = "#959494", l = "#373737"; else var k = appConfig.appBargraphEmptyColor, l = "#eaeaea";
var m = {
labels: [ "Zuletzt falsch gemacht", "Andere" ],
datasets: [ {
data: [ questionstWrongLastTime, questionsInCurrentClass - questionstWrongLastTime ],
backgroundColor: [ "#fa3b2a", k ],
hoverBackgroundColor: [ "#fa3b2a", k ],
hoverBorderColor: l,
borderColor: l
} ]
}, n = {
labels: [ "Mindestens 1x ge\u00fcbt", "Noch nicht ge\u00fcbt" ],
datasets: [ {
data: [ questionsAnswered, questionsInCurrentClass - questionsAnswered ],
backgroundColor: [ "#fdc619", k ],
hoverBackgroundColor: [ "#fdc619", k ],
hoverBorderColor: l,
borderColor: l
} ]
}, o = {
labels: [ "Fit f\u00fcr die Pr\u00fcfung", "Noch nicht bereit" ],
datasets: [ {
data: [ questionsFitForTest, questionsInCurrentClass - questionsFitForTest ],
backgroundColor: [ "#83bc41", k ],
hoverBackgroundColor: [ "#83bc41", k ],
hoverBorderColor: l,
borderColor: l
} ]
}, p = new Chart(h, {
type: "doughnut",
data: o,
options: {
cutoutPercentage: appConfig.statisticsDonutCutoutPercentage,
rotation: .9 * Math.PI,
circumference: Math.PI * 1.2,
legend: {
display: !1
},
tooltips: {
enabled: !1
},
elements: {
center: {
maxText: "100.0%",
text: b.toFixed(1) + "%",
fontColor: "#83bc41",
fontFamily: "'Poppins', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
fontStyle: "normal",
minFontSize: 1,
maxFontSize: 256
}
}
}
}), q = new Chart(i, {
type: "doughnut",
data: n,
options: {
cutoutPercentage: appConfig.statisticsDonutCutoutPercentage,
rotation: .9 * Math.PI,
circumference: Math.PI * 1.2,
legend: {
display: !1
},
tooltips: {
enabled: !1
},
elements: {
center: {
maxText: "100.0%",
text: c.toFixed(1) + "%",
fontColor: "#fdc619",
fontFamily: "'Poppins', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
fontStyle: "normal",
minFontSize: 1,
maxFontSize: 256
}
}
}
}), r = new Chart(j, {
type: "doughnut",
data: m,
options: {
cutoutPercentage: appConfig.statisticsDonutCutoutPercentage,
rotation: .9 * Math.PI,
circumference: Math.PI * 1.2,
legend: {
display: !1
},
tooltips: {
enabled: !1
},
elements: {
center: {
maxText: "100.0%",
text: d.toFixed(1) + "%",
fontColor: "#fa3b2a",
fontFamily: "'Poppins', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
fontStyle: "normal",
minFontSize: 1,
maxFontSize: 256
}
}
}
});
if (appConfig.displayStatisticsProgressChart) {
var s = document.getElementById("myLChart1"), t = new Array, u = new Array, v = new Array, w = new Array, x = new Array, y = new Date, z = 14, A = appDB.getProgressStatistics(), B = A.length - 1;
for (var g = 0; g < z; g++) {
var C = z - 1 - g, D = parseInt(Date.now(), 10) - g * 24 * 60 * 60 * 1e3;
y = new Date(D);
var E = y.getDate() + "." + (1 + y.getMonth()) + "." + y.getFullYear();
u[C] = y.getDate() + "." + (1 + y.getMonth()) + ".", B < 0 ? (v[C] = 0, w[C] = 0, x[C] = 0, t[C] = 0) : (v[C] = A[B][1], w[C] = A[B][2], x[C] = A[B][3], t[C] = 0, A[B][0] == E && (B--, t[C] = 0)), g == 0 && (t[C] = 4);
}
var F = {
labels: u,
datasets: [ {
label: "Fit f\u00fcr die Pr\u00fcfung",
backgroundColor: "#83bc41",
borderColor: "#83bc41",
cubicInterpolationMode: "monotone",
lineTension: .1,
data: v,
pointRadius: t,
fill: !1
}, {
label: "mind. 1x ge\u00fcbt",
backgroundColor: "#fdc619",
borderColor: "#fdc619",
cubicInterpolationMode: "monotone",
lineTension: .1,
data: w,
pointRadius: t,
fill: !1
}, {
label: "zuletzt falsch beantwortet",
backgroundColor: "#fa3b2a",
borderColor: "#fa3b2a",
cubicInterpolationMode: "monotone",
lineTension: .1,
data: x,
pointRadius: t,
fill: !1
} ]
}, G = new Chart(s, {
type: "line",
data: F,
options: {
responsive: !0,
title: {
display: !1,
text: ""
},
legend: {
display: !1
},
tooltips: {
enabled: !1
},
scales: {
xAxes: [ {
display: !0,
scaleLabel: {
display: !1,
labelString: "Datum"
}
} ],
yAxes: [ {
display: !0,
scaleLabel: {
display: !1,
labelString: "Prozent"
},
ticks: {
min: 0,
max: 100
}
} ]
}
}
});
}
}
}), enyo.kind({
name: "ProfilePage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onVideoButtonTap: "",
onDateButtonTap: "",
onClassButtonTap: ""
},
components: uiProfilePageView,
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments);
}
}), enyo.kind({
name: "classButton",
kind: "Control",
published: {
topPart: "",
bottomPart: "",
selected: !1
},
events: {
onSelected: ""
},
components: [ {
tag: "div",
name: "buttonContainer",
classes: "t24classButton",
ontap: "buttonSelected",
style: "display:inline-block;overflow:hidden;position:relative;text-align:left;width:75px;height:75px;",
components: [ {
tag: "div",
name: "topPart",
classes: "t24classButtonLabel",
style: "overflow:hidden;position:absolute;left:4px;top:4px;right:4px;height:40px;line-height:40px;vertical-align:middle;",
allowHtml: !0
}, {
tag: "div",
name: "bottomPart",
classes: "t24classButtonIcon",
style: "overflow:hidden;position:absolute;bottom:4px;left:4px;right:4px;height:35px;line-height:35px;vertical-align:middle;",
allowHtml: !0
} ]
} ],
create: function() {
this.inherited(arguments), this.topPartChanged(), this.bottomPartChanged(), this.selectedChanged(), this.selected && this.doSelected();
},
rendered: function() {
this.inherited(arguments);
},
topPartChanged: function() {
this.$.topPart.setContent(this.topPart);
},
bottomPartChanged: function() {
this.$.bottomPart.setContent(this.bottomPart);
},
buttonSelected: function() {
this.doSelected();
},
select: function() {
this.setSelected(!0);
},
unselect: function() {
this.setSelected(!1);
},
selectedChanged: function() {
this.selected ? (this.$.buttonContainer.addClass("selected"), this.$.buttonContainer.removeClass("unselected")) : (this.$.buttonContainer.addClass("unselected"), this.$.buttonContainer.removeClass("selected"));
}
}), enyo.kind({
name: "SettingsPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onLockAppButtonTap: "",
onSyncCompleted: "",
onSyncButtonTap: "",
onHelpButtonTap: "",
onDeleteAccountTap: ""
},
components: uiSettingsPageView,
tmpClassId: 0,
tmpLangISO2: "",
intSyncReceivedQuestions: 0,
intSyncReceivedSets: 0,
intSyncReceivedMarkedQuestions: 0,
intSyncSentQuestions: 0,
intSyncSentSets: 0,
intSyncSentMarkedQuestions: 0,
initPageComplete: !1,
create: function() {
this.inherited(arguments), this.$.PageFooter.setBtnapply("visible"), appConfig.hideFooterIfPossible ? (this.$.PageFooter.hide(), this.$.ClientArea.applyStyle("bottom", "0")) : (this.$.PageFooter.show(), this.$.ClientArea.applyStyle("bottom", appConfig.PageFooterHeight));
},
rendered: function() {
appConfig.appShowExtClassesButton ? this.$.chkGroupExtClasses.show() : this.$.chkGroupExtClasses.hide(), appConfig.appHas2DBs ? this.$.chkGroupDB.show() : this.$.chkGroupDB.hide(), appConfig.appOnMobileDevice ? this.$.chkGroupDownloadVideos.show() : this.$.chkGroupDownloadVideos.hide(), this.$.loginfields.hide(), this.inherited(arguments);
},
openHelpTopic: function() {
this.doHelpButtonTap();
},
showContextHelp: function(a, b) {
switch (a.name) {
case "lblExtClassSel":
alert(appConfig.msgSelectExtClassesExplanation, this);
break;
case "lblDBSel":
alert(appConfig.msgSettingsDBSwitchText, this);
break;
case "lblAutoSync":
alert(appConfig.msgSettingsSyncSwitchText, this);
}
},
deleteAllVideos: function() {
this.$.removeVideosButton.getDisabled() || alert(appConfig.msgRemoveDownloadedFilesConfirmation, this, {
confirmText: appConfig.msgAppYes,
cancelText: appConfig.msgAppNo,
onConfirm: function(a) {
a.deleteAllVideos2();
}
});
},
deleteAllVideos2: function() {
this.$.removeVideosButton.setDisabled(!0);
if (appConfig.appPlatformId == "android") var a = cordova.file.dataDirectory; else var a = cordova.file.dataDirectory;
var b = 0;
window.resolveLocalFileSystemURL(a, function(a) {
var c = a.createReader();
c.readEntries(function(a) {
for (var c = 0; c < a.length; c++) {
var d = a[c].name.length, e = a[c].name.substring(a[c].name.length - 4);
if (e == ".mp4" || e == ".m4v") try {
a[c].remove(), b++;
} catch (f) {}
}
}, function() {
alert("Error reading entries", this), this.$.removeVideosButton.setDisabled(!1);
});
}, function() {
alert("Error getting Reader", this), this.$.removeVideosButton.setDisabled(!1);
}), alert(appConfig.msgDownloadedFilesRemoved, this);
},
deleteAllAudios: function() {
this.$.removeAudiosButton.getDisabled() || alert(appConfig.msgRemoveDownloadedAudiosConfirmation, this, {
confirmText: appConfig.msgAppYes,
cancelText: appConfig.msgAppNo,
onConfirm: function(a) {
a.deleteAllAudios2();
}
});
},
deleteAllAudios2: function() {
this.$.removeAudiosButton.setDisabled(!0);
var a = cordova.file.dataDirectory, b = 0;
window.resolveLocalFileSystemURL(a, function(a) {
var c = a.createReader();
c.readEntries(function(a) {
for (var c = 0; c < a.length; c++) {
var d = a[c].name.length, e = a[c].name.substring(a[c].name.length - 4);
if (e == ".mp3") try {
a[c].remove(), b++;
} catch (f) {}
}
}, function() {
alert("Error reading entries", this), this.$.removeAudiosButton.setDisabled(!1);
});
}, function() {
alert("Error getting Reader", this), this.$.removeAudiosButton.setDisabled(!1);
}), alert(appConfig.msgDownloadedFilesRemoved, this);
},
downloadAllAudios: function() {
this.$.downloadAudiosButton.getDisabled() || (appDB.hasNetworkConnection() ? alert(appConfig.msgConfirmDownloadAllAudios, this, {
confirmText: appConfig.msgAppYes,
cancelText: appConfig.msgAppNo,
onConfirm: function(a) {
a.startDownloadingAudios(0);
}
}) : alert(appConfig.msgErrorNoOnlineConnection, this));
},
downloadAllVideos: function() {
if (!this.$.downloadVideosButton.getDisabled()) if (appDB.hasNetworkConnection()) {
var a = new Array;
for (var b in dbTblQ) dbTblQ[b].picture.indexOf(appConfig.extVideoTriggerExtension) > -1 && a.indexOf(dbTblQ[b].picture) == -1 && (a[a.length] = dbTblQ[b].picture);
alert(appConfig.msgConfirmDownloadAllVideos, this, {
confirmText: appConfig.msgAppYes,
cancelText: appConfig.msgAppNo,
onConfirm: function(a) {
a.startDownloadingVideos(0);
}
});
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
startDownloadingAudios: function(a) {
typeof a == "undefined" && (a = 0);
if (appDB.hasNetworkConnection()) {
this.$.downloadAudiosButton.setDisabled(!0), this.$.removeAudiosButton.setDisabled(!0);
var b = new Array;
for (var c in dbTblQ) b[b.length] = c + "_q.mp3", b[b.length] = c + "_a1.mp3", b[b.length] = c + "_a2.mp3", b[b.length] = c + "_a3.mp3";
var d = parseInt(a, 10), e = cordova.file.dataDirectory, f = appConfig.urlAudioDownload + b[d], g = e + b[d];
window.resolveLocalFileSystemURL(e + b[d], function() {
fsapp.updateAudioDownloadStatus(appConfig.msgAudioDlInProgress + parseInt((d + 1) / b.length * 1e3, 10) / 10 + "%"), d + 1 < b.length ? fsapp.continueDownloadingAudios(d + 1) : fsapp.updateAudioDownloadStatus(appConfig.msgAudioDlComplete);
}, function() {
var a = new FileTransfer, c = 0;
a.onprogress = function(a) {
var e = a.loaded / a.total * 100;
e - c > 10 && (c = parseInt(e, 10), fsapp.updateAudioDownloadStatus(appConfig.msgAudioDlInProgress + parseInt((d + 1) / b.length * 1e3, 10) / 10 + "%"));
}, a.download(f, g, function(a) {
d + 1 < b.length ? fsapp.continueDownloadingAudios(d + 1) : fsapp.updateAudioDownloadStatus(appConfig.msgAudioDlComplete);
}, function(a) {
fsapp.updateAudioDownloadStatus(appConfig.msgAudioDlInProgress + parseInt((d + 1) / b.length * 1e3, 10) / 10 + "%");
var c = JSON.stringify(a);
d + 1 < b.length && fsapp.continueDownloadingAudios(d + 1);
});
});
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
startDownloadingVideos: function(a) {
typeof a == "undefined" && (a = 0);
if (appDB.hasNetworkConnection()) {
this.$.downloadVideosButton.setDisabled(!0);
var b = new Array;
for (var c in dbTblQ) dbTblQ[c].picture.indexOf(appConfig.extVideoTriggerExtension) > -1 && b.indexOf(dbTblQ[c].picture) == -1 && (b[b.length] = dbTblQ[c].picture);
var d = parseInt(a, 10), e = cordova.file.dataDirectory, f = appConfig.urlVideoDownload + b[d], g = e + b[d];
window.resolveLocalFileSystemURL(e + b[d], function() {
fsapp.updateVideoDownloadStatus(appConfig.msgVideoDlExists + (d + 1) + "/" + b.length), d + 1 < b.length ? fsapp.continueDownloadingVideos(d + 1) : fsapp.updateVideoDownloadStatus(appConfig.msgVideoDlComplete);
}, function() {
var a = new FileTransfer, c = 0;
a.onprogress = function(a) {
var e = a.loaded / a.total * 100;
e - c > 10 && (c = parseInt(e, 10), fsapp.updateVideoDownloadStatus(appConfig.msgVideoDlInProgress + (d + 1) + "/" + b.length + " (" + c + "%)"));
}, a.download(f, g, function(a) {
d + 1 < b.length ? fsapp.continueDownloadingVideos(d + 1) : fsapp.updateVideoDownloadStatus(appConfig.msgVideoDlComplete);
}, function(a) {
fsapp.updateVideoDownloadStatus(appConfig.msgVideoDlError + d);
var c = JSON.stringify(a);
d + 1 < b.length && fsapp.continueDownloadingVideos(d + 1);
});
});
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
displayLanguageSelection: function() {
this.initPageComplete = !1, this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync), appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), this.$.chkGroup.applyStyle("display", "block"), appConfig.appShowExtClassesButton ? this.$.chkGroupExtClasses.show() : this.$.chkGroupExtClasses.hide(), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver), this.$.loginfields.hide(), this.$.chkGroup.applyStyle("display", "none"), this.$.chkGroupExtClasses.applyStyle("display", "none"), this.$.chkGroupDB.applyStyle("display", "none"), this.$.chkGroupAdd.applyStyle("display", "none"), this.$.chkGroupDownloadVideos.applyStyle("display", "none"), this.$.chkGroupGeneral.applyStyle("display", "none"), this.$.chkLanguagesApp.applyStyle("display", "block"), this.$.chkLanguages.applyStyle("display", "block"), this.$.ClassDetails.setContent(appConfig.msgSettingsLanguagePageText), this.$.chkLanguagesApp.destroyComponents();
var a = 0, b = !1;
this.$.chkLanguagesApp.createComponent({
tag: "div",
style: "margin:16px 8px 8px 8px;",
content: appConfig.msgAppLanguageHeadline,
allowHtml: !0
});
for (var c in appConfig.appAvailableAppLanguages) c == appConfig.appSelectedAppLanguageISO2 ? b = !0 : b = !1, this.$.chkLanguagesApp.createComponent({
style: "width:calc(49% - 16px); min-width:140px; max-width:180px; margin:8px; font-size:16px",
classes: "langcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkAppLang" + a,
attributes: {
langISO2: c
},
checked: b
}, {
tag: "span",
content: appConfig.appAvailableAppLanguages[c].name,
allowHtml: !0
} ]
}), a++;
this.$.chkLanguagesApp.createComponent({
style: "clear:both"
}), this.$.chkLanguagesApp.render(), this.$.chkLanguages.destroyComponents();
var a = 0, b = !1;
this.$.chkLanguages.createComponent({
tag: "div",
style: "margin:16px 8px 8px 8px;",
content: appConfig.msgQuestionsLanguageHeadline,
allowHtml: !0
});
for (var c in appConfig.appAvailableLanguages) c == appConfig.appSelectedAltLanguageISO2 ? b = !0 : b = !1, this.$.chkLanguages.createComponent({
style: "width:calc(49% - 16px); min-width:140px; max-width:180px; margin:8px; font-size:16px",
classes: "langcheckbox",
components: [ {
kind: "onyx.Checkbox",
style: "margin-right:8px;",
name: "chkLang" + a,
attributes: {
langISO2: c
},
checked: b
}, {
tag: "span",
content: appConfig.appAvailableLanguages[c].name,
allowHtml: !0
} ]
}), a++;
this.$.chkLanguages.createComponent({
style: "clear:both"
}), this.$.chkLanguages.render(), this.initPageComplete = !0;
},
updateQuestionCount: function() {},
updateQuestionCountResult: function() {
var a = 0;
for (var b in dbTblQ) (dbTblQ[b].classes == "" || dbTblQ[b].classes.indexOf("," + appConfig.userClassSelectedId + ",") > -1) && a++;
a > 0 && alert("F\u00fcr die ausgew\u00e4hlte Klasse sind " + a + " Fragen in diesem Fragenkatalog.", this), appConfig.userDb2selected || initDb1TableQuestions(), appConfig.userDb2selected && initDb2TableQuestions();
},
displayClassSelection: function() {
this.initPageComplete = !1, this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync), appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), this.$.chkGroup.applyStyle("display", "block"), appConfig.appShowExtClassesButton ? this.$.chkGroupExtClasses.show() : this.$.chkGroupExtClasses.hide(), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver), this.$.loginfields.hide(), this.$.chkGroupDB.applyStyle("display", "none"), this.$.chkGroupAdd.applyStyle("display", "none"), this.$.chkGroupDownloadVideos.applyStyle("display", "none"), this.$.chkGroupGeneral.applyStyle("display", "none"), this.$.chkLanguagesApp.applyStyle("display", "none"), this.$.chkLanguages.applyStyle("display", "none"), this.prepareClassCheckboxes(), this.initPageComplete = !0;
},
displayExamDateSelection: function() {
this.initPageComplete = !1;
var a = appConfig.msgSettingsDbValidityDates.replace(/%VALIDDATE1%/g, convertTSDateToGermanDateFormat(getDb1ValidFromDate())).replace(/%VALIDDATE2%/g, convertTSDateToGermanDateFormat(getDb1ValidBeforeDate())), b = appConfig.msgSettingsDbValidityDates.replace(/%VALIDDATE1%/g, convertTSDateToGermanDateFormat(getDb2ValidFromDate())).replace(/%VALIDDATE2%/g, convertTSDateToGermanDateFormat(getDb2ValidBeforeDate()));
this.$.lblDBSel.setContent(appConfig.msgSettingsDBSwitchBefore + appConfig.db2ValidFromDate + a), this.$.lblDBSel2.setContent(appConfig.msgSettingsDBSwitchAfter + appConfig.db2ValidFromDate + b), this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync), appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver), this.$.loginfields.hide(), this.$.chkGroup.applyStyle("display", "none"), this.$.chkGroupExtClasses.applyStyle("display", "none"), this.$.chkGroupDB.applyStyle("display", "block"), this.$.chkGroupAdd.applyStyle("display", "none"), this.$.chkGroupDownloadVideos.applyStyle("display", "none"), this.$.chkGroupGeneral.applyStyle("display", "none"), this.$.chkLanguagesApp.applyStyle("display", "none"), this.$.chkLanguages.applyStyle("display", "none"), this.$.ClassDetails.setContent(appConfig.msgSettingsExamDatePageText), this.initPageComplete = !0;
},
displayDefaultFooterButtons: function() {
this.$.PageHeader.setSubtitle(appConfig.pageSubtitleSettings), appConfig.hideFooterIfPossible ? (this.$.PageFooter.hide(), this.$.ClientArea.applyStyle("bottom", "0")) : (this.$.PageFooter.show(), this.$.ClientArea.applyStyle("bottom", appConfig.PageFooterHeight));
},
displaySetupFooterButtons: function() {
this.$.loginfields.hide(), appConfig.appOnMobileDevice ? appConfig.appMultilingual ? appConfig.appLockMode == 0 ? this.$.PageHeader.setSubtitle(appConfig.msgSetupWizardPageTitle + " " + appConfig.appSetupWizardStep + "/6") : this.$.PageHeader.setSubtitle(appConfig.msgSetupWizardPageTitle + " " + appConfig.appSetupWizardStep + "/5") : appConfig.appLockMode == 0 ? this.$.PageHeader.setSubtitle(appConfig.msgSetupWizardPageTitle + " " + appConfig.appSetupWizardStep + "/5") : this.$.PageHeader.setSubtitle(appConfig.msgSetupWizardPageTitle + " " + appConfig.appSetupWizardStep + "/4") : appConfig.appMultilingual ? this.$.PageHeader.setSubtitle(appConfig.msgSetupWizardPageTitle + " " + appConfig.appSetupWizardStep + "/4") : this.$.PageHeader.setSubtitle(appConfig.msgSetupWizardPageTitle + " " + appConfig.appSetupWizardStep + "/3"), this.$.PageFooter.$.buttonback.hide(), this.$.PageFooter.$.buttonapply.setContent(appConfig.msgSetupWizardContinueButton), this.$.PageFooter.$.buttonapply.show(), this.$.PageFooter.show(), this.$.ClientArea.applyStyle("bottom", appConfig.PageFooterHeight);
},
checkDownloadedVideoFiles: function(a) {
var b = new Array;
for (var c in dbTblQ) dbTblQ[c].picture.indexOf(appConfig.extVideoTriggerExtension) > -1 && b.indexOf(dbTblQ[c]["picture"]) == -1 && (b[b.length] = dbTblQ[c].picture);
fsapp.totalVideoCounter = b.length;
var d = parseInt(a, 10);
try {
if (appConfig.appPlatformId == "android") var e = cordova.file.dataDirectory; else var e = cordova.file.dataDirectory;
} catch (f) {}
var g = e + b[d];
window.resolveLocalFileSystemURL(e + b[d], function() {
fsapp.setCheckDownloadedVideoFile(d, !0), d + 1 < b.length ? fsapp.checkDownloadedVideoFiles(d + 1) : fsapp.displayResultOfVideoFileCheck();
}, function() {
fsapp.setCheckDownloadedVideoFile(d, !1), d + 1 < b.length ? fsapp.checkDownloadedVideoFiles(d + 1) : fsapp.displayResultOfVideoFileCheck();
});
},
checkForDownloadedAudioFiles: function() {
this.$.removeAudiosButton.setDisabled(!0);
if (appConfig.appPlatformId == "android") var a = cordova.file.dataDirectory; else var a = cordova.file.dataDirectory;
window.resolveLocalFileSystemURL(a, function(a) {
var b = a.createReader();
b.readEntries(function(a) {
for (var b = 0; b < a.length; b++) {
var c = a[b].name.length, d = a[b].name.substring(a[b].name.length - 4);
if (d == ".mp3") {
fsapp.$.SettingsPage.$.removeAudiosButton.setDisabled(!1);
break;
}
}
}, function() {
fsapp.$.SettingsPage.$.removeAudiosButton.setDisabled(!0);
});
}, function() {
fsapp.$.SettingsPage.$.removeAudiosButton.setDisabled(!0);
});
},
displayVideoSelection: function(a) {
this.initPageComplete = !1, this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync), appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver), this.checkForDownloadedAudioFiles();
if (typeof a == "undefined" || !a) fsapp.lockDisplay(), fsapp.downloadedVideoCounter = 0, this.checkDownloadedVideoFiles(0);
if (appConfig.appDisplayQuestionVoiceOverSetting && appConfig.appEnableQuestionVoiceOver) {
this.$.downloadAudiosButton.show(), this.$.removeAudiosButton.show();
var b = appConfig.msgSettingsMediaDownloadPageText1;
} else {
this.$.downloadAudiosButton.hide(), this.$.removeAudiosButton.hide();
var b = appConfig.msgSettingsMediaDownloadPageText2;
}
this.$.loginfields.hide(), this.$.chkGroup.applyStyle("display", "none"), this.$.chkGroupExtClasses.applyStyle("display", "none"), this.$.chkGroupDB.applyStyle("display", "none"), this.$.chkGroupAdd.applyStyle("display", "none"), this.$.chkGroupDownloadVideos.applyStyle("display", "block"), this.$.chkGroupGeneral.applyStyle("display", "none"), this.$.chkLanguagesApp.applyStyle("display", "none"), this.$.chkLanguages.applyStyle("display", "none"), this.$.ClassDetails.setContent(b), this.initPageComplete = !1;
},
displayHiddenPassword: function() {
try {
appConfig.appOnMobileDevice ? this.$.lblAdditionalInfo.setContent(appConfig.msgAppEmail + " <span class='showlengthbg'>" + appDB.getAppUnlockUserData().name + "</span><br />" + appConfig.msgAppPassword + " <span class='showlengthbg'>" + appDB.getAppUnlockUserData().school + "</span>") : this.$.lblAdditionalInfo.setContent(appConfig.msgAppEmail + " <span class='showlengthbg'>" + appDB.getAppUnlockUserData().name + "</span>");
} catch (a) {}
},
updateLoginRegisterButton: function() {
this.$.chkLoginRegister.getValue() ? (this.$.lblPasswordConditions.setContent(appConfig.msgLoginConditions), this.$.btnRegisterUserAccount.setContent(appConfig.msgButtonLogin)) : (this.$.lblPasswordConditions.setContent(appConfig.msgPasswordConditions), this.$.btnRegisterUserAccount.setContent(appConfig.msgButtonRegister));
},
togglePasswordVisibility: function() {
try {
this.$.inputUserMembershipNumber.getType() == "password" ? (this.$.inputUserMembershipNumber.setType("text"), this.$.btnTogglePasswordVisibility.setContent("<i class='material-icons'>ol_visibility_off</i>")) : (this.$.inputUserMembershipNumber.setType("password"), this.$.btnTogglePasswordVisibility.setContent("<i class='material-icons'>ol_visibility</i>"));
} catch (a) {}
},
deleteBackupAccount: function() {
appDB.hasNetworkConnection() ? alert(appConfig.msgConfirmAccountDeletion, this, {
cancelText: appConfig.msgAppNo,
confirmText: appConfig.msgAppYes,
onConfirm: function(a) {
this.hide(), fsapp.$.SettingsPage.deleteBackupAccountConfirmed(), this.destroy();
}
}) : alert(appConfig.msgErrorNoOnlineConnection, this);
},
deleteBackupAccountConfirmed: function() {
if (appDB.hasNetworkConnection()) {
if (!appConfig.appUseOpenApiProcess) {
var a = new enyo.Ajax({
url: appConfig.urlAccountDeletion,
method: "GET",
handleAs: "text"
});
a.response(this, "processAccountDeletionResponse"), a.error(this, "processAccountDeletionError"), a.go({
n: appDB.getAppUnlockUserData().name,
p: appDB.getAppUnlockUserData().school
});
}
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
processAccountDeletionResponse: function(a, b) {
appDB.removeItemById("user"), appDB.setItem("userdelacc", "1"), appDB.setItem("autosync", "0"), alert(appConfig.msgAccountDeletionSuccessful, this, {
onConfirm: function(a) {
this.hide(), location.reload(), this.destroy();
}
});
},
processAccountDeletionError: function(a, b) {
alert(appConfig.msgAccountDeletionUnsuccessful, this);
},
displaySyncSelection: function() {
this.initPageComplete = !1, this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync);
if (appConfig.appDisplaySyncUserPassword) {
if (appConfig.appVariantId == "adac") try {
this.$.lblAdditionalInfo.setContent(appConfig.msgAppMembershipHash + appDB.getAppUnlockUserData().uid);
} catch (a) {} else try {
appConfig.appOnMobileDevice ? this.$.lblAdditionalInfo.setContent(appConfig.msgAppEmail + " <span class='showlengthbg'>" + appDB.getAppUnlockUserData().name + "</span><br />" + appConfig.msgAppShowPassword) : this.$.lblAdditionalInfo.setContent(appConfig.msgAppEmail + " <span class='showlengthbg'>" + appDB.getAppUnlockUserData().name + "</span>");
} catch (a) {}
this.$.lblAdditionalInfo.show();
} else this.$.lblAdditionalInfo.hide();
this.$.inputUserMembershipNumber.setType("password"), this.$.inputUserMembershipNumber.render();
try {
this.$.btnTogglePasswordVisibility.setContent("<i class='material-icons'>ol_visibility_off</i>"), this.$.lblLoginRegisterSel.setContent(appConfig.msgBackupAccountAlreadyRegistered);
} catch (a) {}
this.$.btnSyncNow.setContent(appConfig.btnCaptionSync), this.$.lblAutoSync.setContent(appConfig.msgSettingsSyncSwitchHeadline);
try {
appConfig.appShowAccountDeletionButton ? (this.$.btnDeleteAccount.setContent(appConfig.msgButtonDeleteAccount), this.$.btnDeleteAccount.show()) : this.$.btnDeleteAccount.hide();
} catch (a) {}
appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver);
try {
appConfig.appHideAutoSyncSetting ? this.$.chkAutoSync.hide() : this.$.chkAutoSync.show();
} catch (a) {}
this.$.loginfields.hide(), this.$.chkGroup.applyStyle("display", "none"), this.$.chkGroupExtClasses.applyStyle("display", "none"), this.$.chkGroupDB.applyStyle("display", "none"), this.$.chkGroupAdd.applyStyle("display", "block"), this.$.chkGroupDownloadVideos.applyStyle("display", "none"), this.$.chkGroupGeneral.applyStyle("display", "none"), this.$.chkLanguagesApp.applyStyle("display", "none"), this.$.chkLanguages.applyStyle("display", "none"), this.$.ClassDetails.setContent(appConfig.msgSettingsSyncPageText), this.initPageComplete = !0;
},
displaySyncRegistrationSelection: function() {
this.initPageComplete = !1, this.$.inputUserMembershipNumber.setType("password"), this.$.inputUserMembershipNumber.render(), this.$.btnTogglePasswordVisibility.setContent("<i class='material-icons'>ol_visibility_off</i>"), this.$.lblLoginRegisterSel.setContent(appConfig.msgBackupAccountAlreadyRegistered), this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync), appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver), this.$.loginfields.show(), this.$.chkGroup.applyStyle("display", "none"), this.$.chkGroupExtClasses.applyStyle("display", "none"), this.$.chkGroupDB.applyStyle("display", "none"), this.$.chkGroupAdd.applyStyle("display", "none"), this.$.chkGroupDownloadVideos.applyStyle("display", "none"), this.$.chkGroupGeneral.applyStyle("display", "none"), this.$.chkLanguagesApp.applyStyle("display", "none"), this.$.chkLanguages.applyStyle("display", "none"), this.$.ClassDetails.setContent(appConfig.msgSettingsSyncRegistrationPageText), this.initPageComplete = !0;
},
displayGeneralSettingsSelection: function() {
this.initPageComplete = !1, this.tmpClassId = appConfig.userClassSelectedId, this.tmpLangISO2 = appConfig.appSelectedAltLanguageISO2, this.$.chkAutoSync.setChecked(appConfig.userAutoSync), appConfig.userDb2selected ? this.$.chkDB2.setChecked(!0) : this.$.chkDB1.setChecked(!0), appConfig.hasDarkmodeSetting ? (this.$.chkDarkModeActive.show(), this.$.lblDarkModeActive.show()) : (this.$.chkDarkModeActive.hide(), this.$.lblDarkModeActive.hide()), this.$.chkDarkModeActive.setChecked(appConfig.appDarkModeActive), this.$.chkVibrateOnWrongAnswer.setChecked(appConfig.appVibrateOnWrongAnswer), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.chkDisplayHintOnQuickstartLastErrors.setChecked(appConfig.appDisplayIntroMessageOnQuickstartEtc), this.$.chkAllowVoiceOver.setChecked(appConfig.appEnableQuestionVoiceOver);
if (appConfig.appDisplayQuestionVoiceOverSetting) {
appConfig.appMultilingual ? this.$.lblDisplayHintOnVoiceOver.setContent(appConfig.msgHintOnVoiceOver) : this.$.lblDisplayHintOnVoiceOver.setContent(appConfig.msgHintOnVoiceOverGermanApp), this.$.chkAllowVoiceOver.show(), this.$.lblDisplayHintOnVoiceOver.show();
var a = appConfig.msgSettingsGeneralPageText1;
} else {
this.$.chkAllowVoiceOver.hide(), this.$.lblDisplayHintOnVoiceOver.hide();
var a = appConfig.msgSettingsGeneralPageText2;
}
appConfig.appDisplayHeaderQuestionExplanationButton ? (this.$.lblDisplayExplanationOnWrongAnswer.show(), this.$.chkDisplayExplanationOnWrongAnswer.show()) : (appConfig.appDisplayExplanationOnWrongAnswer = !1, this.$.chkDisplayExplanationOnWrongAnswer.hide(), this.$.chkDisplayExplanationOnWrongAnswer.setChecked(appConfig.appDisplayExplanationOnWrongAnswer), this.$.lblDisplayExplanationOnWrongAnswer.hide()), this.$.loginfields.hide(), this.$.chkGroup.applyStyle("display", "none"), this.$.chkGroupExtClasses.applyStyle("display", "none"), this.$.chkGroupDB.applyStyle("display", "none"), this.$.chkGroupAdd.applyStyle("display", "none"), this.$.chkGroupDownloadVideos.applyStyle("display", "none"), this.$.chkGroupGeneral.applyStyle("display", "block"), this.$.chkLanguagesApp.applyStyle("display", "none"), this.$.chkLanguages.applyStyle("display", "none"), this.$.ClassDetails.setContent(a), this.initPageComplete = !0;
},
registerLogin: function() {
if (appDB.hasNetworkConnection()) {
this.membershipnumber = this.$.inputUserMembershipNumber.getValue().toLowerCase().replace(/[^a-z0-9,.?!@\-_]/ig, ""), this.lastname = this.$.inputUserLastname.getValue().toLowerCase().replace(/[^a-z0-9.@\-_]/ig, ""), this.firstname = this.lastname, this.membershipnumber = this.membershipnumber.trim(), this.firstname = this.firstname.trim(), this.lastname = this.lastname.trim();
if (this.membershipnumber.length < 5 || appConfig.msgLoginFirstnameWord != "" && this.firstname.length < 2 || this.lastname < 2) alert(appConfig.msgPleaseFillInAllFields, this); else {
var a = MD5(String(Number(Number(this.membershipnumber) + 123)));
try {
if (appConfig.verifierMode == 1) var a = MD5(this.membershipnumber + "123");
} catch (b) {}
this.$.chkLoginRegister.getValue() ? this.loginRegisterMode = "l" : this.loginRegisterMode = "r";
var c = new enyo.Ajax({
url: appConfig.urlRegisterUser,
method: "GET",
handleAs: "text"
});
c.response(this, "processRLResponse"), c.error(this, "processRLError"), c.go({
n: this.membershipnumber.rot13(),
v: a,
f: this.firstname.rot13(),
l: this.lastname.rot13(),
r: this.loginRegisterMode,
g: appDB.readDeviceGUID()
});
}
} else alert(appConfig.msgErrorNoOnlineConnection, this);
},
processRLResponse: function(a, b) {
if (!b) {
this.loginRegisterMode == "l" ? alert(appConfig.msgLoginNotSuccessful, this) : alert(appConfig.msgRegistrationNotSuccessful, this);
return;
}
if (b == "valid" || b.substring(0, 6) == "valid:") {
var c = "";
b.substring(0, 6) == "valid:" && (c = b.substring(6)), appConfig.userSaveUserDataUnescaped ? appDB.setUnescapedAppUnlockUserData(this.lastname, MD5(String(this.lastname)), this.membershipnumber) : appDB.setAppUnlockUserData(this.firstname, MD5(this.membershipnumber), c), appConfig.userUnlockedApp = !0, appConfig.userAutoSync = appConfig.activateSyncAfterSyncUnlock, appConfig.userAutoSync ? appDB.setItem("autosync", "1") : appDB.setItem("autosync", "0"), appDB.hasNetworkConnection() && (fsapp.setupWizardActive = !1, fsapp.syncApp()), enyo.job("displayRegistrationMsg", enyo.bind(this, "displayRegistrationMsg"), 1e3), this.bubble("onUnlockButtonTap");
} else this.loginRegisterMode == "l" ? alert(appConfig.msgLoginNotSuccessful, this) : alert(appConfig.msgRegistrationNotSuccessful, this);
},
processRLError: function(a, b) {
alert("HTTP Status is " + a.xhrResponse.status, this);
},
displayRegistrationMsg: function() {
alert(appConfig.msgRegistrationSuccsessful, this), appConfig.appSyncLocked ? (appConfig.appSyncLocked = !1, fsapp.$.WelcomePage.hideInAppPurchaseButton(), fsapp.openMainPage()) : (fsapp.$.WelcomePage.hideInAppPurchaseButton(), fsapp.openMainPage());
},
prepareClassCheckboxes: function(a) {
typeof a != "undefined" && (a = !0);
if (appConfig.appShowExtClassesButton && !a) try {
parseInt("0" + dbTableClasses[appConfig.userClassSelectedId].parent_class_id, 10) == 0 ? this.$.chkExtClass.setChecked(!1) : this.$.chkExtClass.setChecked(!0);
} catch (b) {
this.$.chkExtClass.setChecked(!1);
}
this.$.chkDB1.setChecked(!appConfig.userDb2selected), this.$.chkDB2.setChecked(appConfig.userDb2selected), this.$.chkAutoSync.setChecked(appConfig.userAutoSync), this.$.chkGroup.destroyComponents();
var c = 0, d = 0, e = !1, f = "," + appConfig.appLimitAvailableClasses + ",", g = [];
for (var h in dbTableClasses) g[dbTableClasses[h].rank] = h;
for (var i in g) {
d = g[i];
var j = parseInt("0" + dbTableClasses[d].parent_class_id, 10);
if (appConfig.appShowExtClassesButton) {
if (this.$.chkExtClass.getChecked() && j > 0 && (f.indexOf(dbTableClasses[j].name) > -1 || f == ",,") || !this.$.chkExtClass.getChecked() && j == 0 && (f.indexOf(dbTableClasses[d].name) > -1 || f == ",,")) {
appConfig.userClassSelectedId == d || dbTableClasses[d].parent_class_id == appConfig.userClassSelectedId || dbTableClasses[appConfig.userClassSelectedId].parent_class_id == d ? e = !0 : e = !1;
var k = dbTableClasses[d].name + " ", l = k.replace("erw.", "<span style='font-size:0.6em'>erw.</span>"), m = k.substr(0, k.indexOf(" ")), n = '<i class="material-icons class-icon">class_' + m.toLowerCase() + "</i>";
this.$.chkGroup.createComponent({
kind: "classButton",
name: "chkClass" + c,
style: "display:inline-block;margin:0 10px 10px 0;",
topPart: n,
bottomPart: l,
attributes: {
classId: d
},
selected: e
}), c++;
}
} else if (f.indexOf(dbTableClasses[d].name) > -1 || f == ",,") {
appConfig.userClassSelectedId == d ? e = !0 : e = !1;
var k = dbTableClasses[d].name + " ", l = k.replace("erw.", "<span style='font-size:0.6em'>erw.</span>"), m = k.substr(0, k.indexOf(" ")), n = '<i class="material-icons class-icon">class_' + m.toLowerCase() + "</i>";
this.$.chkGroup.createComponent({
kind: "classButton",
name: "chkClass" + c,
style: "display:inline-block;margin:0 10px 10px 0;",
topPart: n,
bottomPart: l,
attributes: {
classId: d
},
selected: e
}), c++;
}
}
this.$.chkGroup.createComponent({
style: "clear:both"
}), this.$.chkGroup.render();
},
classButtonSelected: function(a, b) {
var c = this.$.chkGroup.getComponents();
for (var d = 0; d < c.length; d++) {
var e = c[d].name;
try {
this.$.chkGroup.$[e].unselect();
} catch (f) {}
}
b.originator.select();
try {
var g = b.originator.getAttributes();
this.tmpClassId = g.classId;
var h = "<div class='classdescription classfulldescription'><h1>" + appConfig.msgClass + " " + dbTableClasses[g.classId].fullname + "</h1><p>" + dbTableClasses[g.classId].description_full + "</p></div><div class='classdescriptionlink' style='display:none;margin-top:32px;'><a style='color:#000;' href='#' onclick='fsapp.openHelpPageForClass(\"" + dbTableClasses[g.classId].helppage + "\")'>" + appConfig.msgShowDetailsForSelectedClass + "</a></div>";
this.$.ClassDetails.setContent(h), this.applyNewClass();
} catch (f) {
log("error in function classButtonSelected: " + f);
}
},
groupActivated: function(a, b) {
if (b.originator.getActive()) {
var c = b.originator.getAttributes(), d = "<div class='classdescription classfulldescription'><h1>Klasse " + dbTableClasses[c.classId].fullname + "</h1><p>" + dbTableClasses[c.classId].description_full + "</p></div>";
this.$.ClassDetails.setContent(d), this.tmpClassId = c.classId;
}
},
groupLangActivated: function(a, b) {
if (b.originator.getActive()) {
var c = b.originator.getAttributes();
appConfig.appSelectedAltLanguageISO2 = c.langISO2, log("Content language selected: " + appConfig.appSelectedAltLanguageISO2), this.applyNewClass();
}
},
groupLangAppActivated: function(a, b) {
if (b.originator.getActive()) {
fsapp.$.WelcomePage.$.mainDynamicMenu.mainMenuOnDisplay = !0;
var c = b.originator.getAttributes();
appConfig.appSelectedAppLanguageISO2 = c.langISO2, log("App language selected: " + appConfig.appSelectedAppLanguageISO2), this.applyNewClass();
}
},
groupDBActivated: function(a, b) {
this.$.downloadVideosButton.setContent(appConfig.btnCaptionDownloadVideos), this.applyNewClass();
},
groupExtClassActivated: function(a, b) {
this.$.chkExtClass.getChecked() && enyo.job("explainExtClass", enyo.bind(this, "displayExtClassExplanation"), 500), this.prepareClassCheckboxes(!0);
},
displayExtClassExplanation: function() {
alert(appConfig.msgExplainExtClass, this);
},
groupGeneralActivated: function(a, b) {
this.applyNewClass();
},
groupAddActivated: function(a, b) {
if (!appInitialized || !this.initPageComplete) {
log("applyNewClass skipped: " + appInitialized + ", " + this.initPageComplete);
return;
}
appConfig.userAutoSync = this.$.chkAutoSync.checked, appConfig.userAutoSync ? appDB.setItem("autosync", "1") : appDB.setItem("autosync", "0");
},
applyNewClass: function() {
if (!appInitialized || !this.initPageComplete) {
log("applyNewClass: skip function: " + appInitialized + ", " + this.initPageComplete);
return;
}
log("applyNewClass: execute function");
if (this.tmpClassId != 0) {
var a = !0;
appConfig.userClassSelectedId = this.tmpClassId;
} else var a = !1;
appDB.setItem("selclassid", appConfig.userClassSelectedId);
try {
if (appConfig.appMultilingual) {
var b = appConfig.appAvailableLanguages[appConfig.appSelectedAltLanguageISO2].id;
appDB.setItem("sellangid", String(b));
var c = appConfig.appAvailableAppLanguages[appConfig.appSelectedAppLanguageISO2].id;
appDB.setItem("sellangappid", String(c)), fsapp.initExtLanguageData();
}
} catch (d) {
log("Error in applyNewClass() in language loading: " + d.message);
}
appConfig.appDarkModeActive != this.$.chkDarkModeActive.checked && (appConfig.appDarkModeActive = this.$.chkDarkModeActive.checked, appConfig.appDarkModeActive ? jQuery("head link#theme").attr("href", appConfig.appCssFileDark) : jQuery("head link#theme").attr("href", appConfig.appCssFileLight)), appConfig.appVibrateOnWrongAnswer = this.$.chkVibrateOnWrongAnswer.checked, appConfig.appDisplayExplanationOnWrongAnswer = this.$.chkDisplayExplanationOnWrongAnswer.checked, appConfig.appDisplayIntroMessageOnQuickstartEtc = this.$.chkDisplayHintOnQuickstartLastErrors.checked, appConfig.appEnableQuestionVoiceOver = this.$.chkAllowVoiceOver.checked, appConfig.appDarkModeActive ? appDB.setItem("darkmodeactive", "1") : appDB.setItem("darkmodeactive", "0"), appConfig.appVibrateOnWrongAnswer ? appDB.setItem("vibrateonwronganswer", "1") : appDB.setItem("vibrateonwronganswer", "0"), appConfig.appDisplayExplanationOnWrongAnswer ? appDB.setItem("displayexplanationonwronganswer", "1") : appDB.setItem("displayexplanationonwronganswer", "0"), appConfig.appDisplayIntroMessageOnQuickstartEtc ? appDB.setItem("displayintromessageonquickstartetc", "1") : appDB.setItem("displayintromessageonquickstartetc", "0"), appConfig.appEnableQuestionVoiceOver ? appDB.setItem("enablequestionvoiceover", "1") : appDB.setItem("enablequestionvoiceover", "0"), appConfig.userAutoSync = this.$.chkAutoSync.checked, appConfig.userAutoSync ? appDB.setItem("autosync", "1") : appDB.setItem("autosync", "0"), this.$.chkDB1.checked ? (appDB.setItem("selectdb", "1"), appConfig.userDb2selected && (initDb1TableQuestions(), initQuestionInfoDb1(), initDb1TableSets()), appConfig.appNumberOfDemoSets = appConfig.appNumberOfDemoSetsDB1) : (appDB.setItem("selectdb", "2"), appConfig.userDb2selected || (initDb2TableQuestions(), initQuestionInfoDb2(), initDb2TableSets()), appConfig.appNumberOfDemoSets = appConfig.appNumberOfDemoSetsDB2), (appConfig.userDb2selected != this.$.chkDB2.checked || a) && fsapp.$.Statistics.updateStatisticDataIntoDatabase(!0), appConfig.userDb2selected = this.$.chkDB2.checked;
},
startSyncProcess: function() {
this.intSyncSentQuestions = 0, this.intSyncSentSets = 0, this.intSyncSentMarkedQuestions = 0, this.intSyncReceivedQuestions = 0, this.intSyncReceivedSets = 0, this.intSyncReceivedMarkedQuestions = 0;
try {
if (fsapp.setupWizardActive) return;
} catch (a) {}
if (appDB.hasNetworkConnection()) {
var b = appDB.getAppUnlockUserData().name.replace(/\W/g, ""), c = appDB.getAppUnlockUserData().uid.replace(/\W/g, "");
appConfig.appVariantId == "t24w" && appConfig.appPlatformId == "web" && (c = MD5(appDB.getAppUnlockUserData().name.toLowerCase()));
var d = [], e = "", f = 0;
for (var g in dbTblQ) if (appDB.readQuestionStatisticsForSync(g) != null) {
var h = appDB.readQuestionStatisticsForSync(g), i = g + ";" + h.syncQTS + ";" + h.syncQCorrect;
e += i + "#", f++;
if (h.syncQTS.toString().indexOf(",") > -1) {
var j = h.syncQTS.toString().split(","), k = h.syncQCorrect.toString().split(",");
for (var l = 0; l < j.length; l++) {
var i = g + ";" + j[l] + ";" + k[l];
d.push(i);
}
} else d.push(i);
}
this.intSyncSentQuestions = f;
var m = [], n = "", o = 0;
for (var g in dbTblQ) if (appDB.readQuestionMarkedStatusForSync(g) != null) {
var p = appDB.readQuestionMarkedStatusForSync(g), q = g + ";" + p.status + ";" + p.timestamp;
n += q + "#", o++, m.push(q);
}
this.intSyncSentMarkedQuestions = o;
var r = [], s = "", t = 0;
for (var g in dbTableSets) if (appDB.readSetStatisticsForSync(g) != null) {
var h = appDB.readSetStatisticsForSync(g), u = g + ";" + h.syncSTS + ";" + h.syncSCorrect;
s += u + "#", t++;
if (h.syncSTS.toString().indexOf(",") > -1) {
var v = h.syncSTS.toString().split(","), w = h.syncSCorrect.toString().split(",");
for (var l = 0; l < v.length; l++) {
var u = g + ";" + v[l] + ";" + w[l];
r.push(u);
}
} else r.push(u);
}
this.intSyncSentSets = t, syncLastViewedPosition = "";
var x = appDB.readLastViewedTopicAndQuestion();
if (!appConfig.userDb2selected) var y = 1; else var y = 2;
syncLastViewedPosition = x.topicId + ";" + x.questionId + ";" + x.timestamp + ";" + appConfig.userClassSelectedId + ";" + y + ";" + appConfig.appVariantId;
var z = x.timestamp.toString().replace(/\n/g, ""), A = "1628517244";
z = z.substr(0, A.length);
var B = x.topicId + ";" + x.questionId + ";" + z + ";" + appConfig.userClassSelectedId + ";" + y + ";" + appConfig.appVariantId;
syncFileContent = c + ";" + b + ";" + appDB.readDeviceGUID() + "|" + e + "|" + n + "|" + s + "|" + syncLastViewedPosition;
try {
if (appConfig.verifierMode == 1) {
var C = MD5(this.membershipnumber + "123");
syncFileContent = c + ";" + b + "|" + e + "|" + n + "|" + s + "|" + syncLastViewedPosition;
}
} catch (a) {}
syncFileContent = syncFileContent.trim();
if (appConfig.appUseOpenApiProcess) {
var D = "";
try {
var E = appDB.getItem("apiLoginData");
D = E.token;
} catch (a) {
log("ERROR: no auth token found!");
}
var F = {
evaluated_questions: d,
marked_questions: m,
sets: r,
position: B
}, G = JSON.stringify(F), H = new enyo.Ajax({
url: appConfig.appOpenApiUrl + "/sync",
method: "POST",
contentType: "application/json",
headers: {
Authorization: "Bearer " + D
}
});
log("send sync data to api:"), log(G), H.response(this, "processApiSyncResponse"), H.error(this, "processApiSyncError"), H.go(G);
} else {
var C = MD5(String(syncFileContent.length + 123)), H = new enyo.Ajax({
url: appConfig.urlStatisticSync,
method: "POST",
handleAs: "text"
});
H.response(this, "processSyncResponse"), H.error(this, "processSyncError"), H.go({
d: syncFileContent.rot13(),
v: C,
l: appConfig.appSelectedAltLanguageISO2
});
}
}
},
clearSyncData: function() {
appDB.resetQuestionStatisticsForSync(), appDB.resetQuestionMarkedForSync(), appDB.resetSetStatisticsForSync();
},
processApiSyncResponse: function(a, b) {
try {
var c = a.xhr.responseText.split("|");
this.intSyncReceivedQuestions = 0;
var d = appDB.getAnsweredQuestionsAmount().split(",");
while (parseInt(d[0], 10) > 0) appDB.deleteQuestionStatistics(), d = appDB.getAnsweredQuestionsAmount().split(",");
var e = c[0].toString();
if (e != "") {
var f = e.split("#");
for (var g = 0; g < f.length; g++) {
var h = f[g].toString(), i = h.split(";"), j = parseInt(i[4], 10) * 1e3, k = new Date(j), l = k.toISOString();
appDB.writeQuestionStatistics(i[0], i[1], i[2], i[3], l);
}
this.intSyncReceivedQuestions = f.length;
}
var m = "," + c[1].toString().replace(/#/g, ",") + ",";
appDB.setMarkedQuestionIds(m), this.intSyncReceivedMarkedQuestions = 0;
var n = m.split(",");
for (var g = 0; g < n.length; g++) n[g] != "" && this.intSyncReceivedMarkedQuestions++;
this.intSyncReceivedSets = 0;
for (var o in dbTableSets) appDB.getSetStatistics(o) != "0,0,nnn" && appDB.removeItemById("set." + o);
var e = c[2].toString().replace(/^\s+|\s+$/g, "");
if (e != "") {
var f = e.split("#");
for (var g = 0; g < f.length; g++) {
var h = f[g].toString(), i = h.split(";"), p = "nnn" + i[3].toString().replace(/^\s+|\s+$/g, "");
p = p.substr(p.length - 3), appDB.setSetStatistics(i[0], i[1], i[2], p);
}
this.intSyncReceivedSets = f.length;
}
try {
var q = c[3].toString(), r = q.split(";");
appConfig.userLastViewedTopicId = r[0], appConfig.userLastViewedQuestionId = r[1];
var s = r[2] + "000";
try {
var t = r[3], u = r[4];
if (!appConfig.userDb2selected) var v = 1; else var v = 2;
t > 0 && u > 0 && !fsapp.finalSync && (appConfig.userClassSelectedId != t || v != u) && alert(appConfig.msgLastSyncWithDifferentClassDB, this);
} catch (w) {}
appDB.writeLastViewedTopicAndQuestion(appConfig.userLastViewedTopicId, appConfig.userLastViewedQuestionId, s);
} catch (w) {}
appConfig.appUpdateProgressOnServer = !0, this.clearSyncData(), this.bubble("onSyncCompleted");
} catch (w) {
alert("Synchronisierungsfehler: Bei der Verarbeitung der API Antwort trat ein Fehler auf.<br /> " + w.message, this);
}
},
processApiSyncError: function(a, b) {
try {
var c = JSON.parse(a.xhr.responseText);
alert(c.error_description, this), c.error == "unauthorized" && (appDB.resetAppUnlockUserData(), appConfig.userUnlockedApp = !1, fsapp.$.pagePanels.setIndex(0), fsapp.refreshPageHeaders(), fsapp.$.LoginPage.resetTextfields(), fsapp.$.WelcomePage.$.mainDynamicMenu.initCurrentMenu(), fsapp.$.WelcomePage.$.mainDynamicMenu.openMainmenu2(), appConfig.appLockMode == 1 && fsapp.showHomeScreen());
} catch (d) {
log("Es trat ein Fehler bei der Verbindung zur Synchronisierungs API auf: " + d.message, this);
}
},
processSyncResponse: function(a, b) {
if (!b) {
alert("Es wurde leider keine Antwort vom Synchronisierungs-Server empfangen!", this), this.bubble("onSyncCompleted");
return;
}
var c = b.rot13().split("|");
this.intSyncReceivedQuestions = 0;
var d = appDB.getAnsweredQuestionsAmount().split(",");
while (parseInt(d[0], 10) > 0) appDB.deleteQuestionStatistics(), d = appDB.getAnsweredQuestionsAmount().split(",");
var e = c[0].toString();
if (e != "") {
var f = e.split("#");
for (var g = 0; g < f.length; g++) {
var h = f[g].toString(), i = h.split(";"), j = parseInt(i[4], 10) * 1e3, k = new Date(j), l = k.toISOString();
appDB.writeQuestionStatistics(i[0], i[1], i[2], i[3], l);
}
this.intSyncReceivedQuestions = f.length;
}
var m = c[1].toString();
appDB.setMarkedQuestionIds(m), this.intSyncReceivedMarkedQuestions = 0;
var n = m.split(",");
for (var g = 0; g < n.length; g++) n[g] != "" && this.intSyncReceivedMarkedQuestions++;
this.intSyncReceivedSets = 0;
for (var o in dbTableSets) appDB.getSetStatistics(o) != "0,0,nnn" && appDB.removeItemById("set." + o);
var e = c[2].toString().replace(/^\s+|\s+$/g, "");
if (e != "") {
var f = e.split("#");
for (var g = 0; g < f.length; g++) {
var h = f[g].toString(), i = h.split(";"), p = "nnn" + i[3].toString().replace(/^\s+|\s+$/g, "");
p = p.substr(p.length - 3), appDB.setSetStatistics(i[0], i[1], i[2], p);
}
this.intSyncReceivedSets = f.length;
}
try {
var q = c[3].toString(), r = q.split(";");
appConfig.userLastViewedTopicId = r[0], appConfig.userLastViewedQuestionId = r[1];
try {
var s = r[3], t = r[4];
if (!appConfig.userDb2selected) var u = 1; else var u = 2;
s > 0 && t > 0 && !fsapp.finalSync && (appConfig.userClassSelectedId != s || u != t) && alert(appConfig.msgLastSyncWithDifferentClassDB, this);
} catch (v) {}
appDB.writeLastViewedTopicAndQuestion(appConfig.userLastViewedTopicId, appConfig.userLastViewedQuestionId, r[2]);
} catch (v) {}
this.clearSyncData(), this.bubble("onSyncCompleted");
},
processSyncError: function(a, b) {
alert("Sync Error: http status: " + a.xhrResponse.status, this);
}
}), enyo.kind({
name: "HelpPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onMainButtonTap: "",
onClassButtonTap: ""
},
components: [ {
kind: "PageHeader",
name: "PageHeader",
maintitleicon: appConfig.appTitleIcon,
maintitle: appConfig.appTitleHtml,
separator: appConfig.appPageHeaderSeparator,
subtitle: appConfig.pageSubtitleHelp,
onBackButtonTap: "doMainButtonTap",
onClassButtonTap: "doClassButtonTap"
}, {
tag: "div",
name: "helpTopicsContainer",
classes: "helptopicsheader",
style: "background-color:#666"
}, {
kind: "enyo.Scroller",
fit: !0,
name: "ClientArea",
classes: "clientarea",
style: "top:120px;",
components: [ {
tag: "div",
name: "HelpContents",
classes: "helpcontents",
allowHtml: !0
} ]
}, {
kind: "PageFooter",
name: "PageFooter",
style: "position:absolute; bottom:0; width:100%;",
onBackButtonTap: "doMainButtonTap",
onAddHelpButtonTap: "showHelpTopicImprint"
} ],
create: function() {
this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments);
},
prepareHelpTexts: function() {
log("function prepareHelpTexts() deactivated in 2020-11");
},
refreshHelpTopicButtons: function() {
this.$.helpTopicsContainer.destroyClientControls();
for (var a in helpContent) this.$.HelpContents.getContent() == "" && this.$.HelpContents.setContent(helpContent[a].text + "<div class='versionlabel'>" + appConfig.appVersion + "</div>"), helpContent[a]["label"] != "Impressum" ? this.$.helpTopicsContainer.createComponent({
kind: "onyx.Button",
name: "helptopic" + a,
content: helpContent[a].label,
allowHtml: !0,
attributes: {
helpTextId: a
},
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "showHelpTopic"
}, {
owner: this
}) : this.$.PageFooter.addHelpButton(helpContent[a].label, a);
this.$.helpTopicsContainer.render();
},
showHelpTopicImprint: function(a, b) {
var c = this.$.PageFooter.$.buttonaddhelp.getAttributes(), d = parseInt(c.helpTextId, 10);
this.$.HelpContents.setContent(helpContent[d].text + "<div class='versionlabel'>" + appConfig.appVersion + "</div>"), this.scrollToTop();
},
showHelpTopic: function(a, b) {
var c = b.originator.getAttributes(), d = parseInt(c.helpTextId, 10);
this.$.HelpContents.setContent(helpContent[d].text), this.scrollToTop();
},
displayHelpTopicById: function(a) {
this.$.HelpContents.setContent(helpContent[a].text);
},
scrollToTop: function() {
this.$.ClientArea.setScrollTop(0);
}
}), enyo.kind({
name: "TestingPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onBackButtonTap: "",
onFullscreenImageTap: "",
onFullscreenVideoTap: ""
},
components: uiTestingPageView,
create: function() {
this.inherited(arguments);
},
displayTestingEnvironment: function(a) {
if ((appConfig.appLockable || appConfig.appOffersInAppPurchase) && !appConfig.userUnlockedApp && appConfig.countDemoSetUsageInLockedApp) {
appDB.incDemoSetCounter();
if (appConfig.appSyncDemoCountStatistics && appDB.hasNetworkConnection()) switch (parseInt(appDB.readDemoSetCounter(), 10)) {
case 1:
case 2:
case 3:
case 4:
case 5:
case 10:
case 15:
case 20:
case 25:
case 30:
case 40:
case 50:
case 60:
case 70:
case 80:
case 90:
case 100:
case 150:
case 200:
case 300:
case 400:
case 500:
case 1e3:
case 5e3:
case 1e4:
case 5e4:
case 1e5:
this.syncDemoStatistics();
break;
default:
}
}
appCE.shuffleAnswers(), a == 4 ? (appCE.setDisplayMode(3), appCE.setSkipSetStatisticsEntry(!0), appCE.setTestSimulationMode(!0)) : (appCE.setDisplayMode(a), appCE.setSkipSetStatisticsEntry(!1), appCE.setTestSimulationMode(!1)), appCE.clearUserAnswersArray(), this.$.CoreTestingDisplay.initTestingEnvironment(), this.$.CoreTestingDisplay.displayCurrentQuestion(), a == 4 && this.$.CoreTestingDisplay.startTimer();
},
syncDemoStatistics: function(a) {
if (appDB.hasNetworkConnection()) {
if (appConfig.appMultilingual) var b = appDB.readDeviceGUID() + "|" + appDB.readDemoSetCounter() + "|" + appDB.readDemoQuestionCounter() + "|" + appConfig.appVersion + "|" + dbTableClasses[appConfig.userClassSelectedId].name + "|" + appConfig.appSelectedAltLanguageISO2; else var b = appDB.readDeviceGUID() + "|" + appDB.readDemoSetCounter() + "|" + appDB.readDemoQuestionCounter() + "|" + appConfig.appVersion + "|" + dbTableClasses[appConfig.userClassSelectedId].name + "|-";
var c = MD5(String(b.length + 123)), d = new enyo.Ajax({
url: appConfig.urlDemoStatisticSync,
method: "POST",
handleAs: "text"
});
d.response(this, "processSyncResponse"), d.error(this, "processSyncError"), d.go({
d: b.rot13(),
v: c
});
}
},
processSyncResponse: function() {},
processSyncError: function() {}
}), enyo.kind({
name: "FullscreenImagePage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onBackButtonTap: ""
},
components: [ {
kind: "appCoreImageDisplay",
name: "appCoreImageDisplay",
style: "height:100%"
} ],
create: function() {
this.inherited(arguments);
},
displayCurrentQuestionImage: function() {
this.$.appCoreImageDisplay.displayCurrentQuestionImage();
}
}), enyo.kind({
name: "FullscreenVideoPage",
kind: "Control",
classes: "onyx enyo-fit",
events: {
onBackButtonTap: ""
},
components: [ {
kind: "appCoreVideoDisplay",
name: "appCoreVideoDisplayElement",
style: "height:calc(100% + 70px)"
} ],
create: function() {
this.inherited(arguments);
},
displayCurrentQuestionVideo: function() {
appConfig.appPlatformId == "android" ? parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10) != 0 && this.prepareVideo() : this.$.appCoreVideoDisplayElement.displayCurrentQuestionVideo();
},
prepareVideo: function() {
if (parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10) != 0) {
var a = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10), b = dbTblQ[a].picture.split(appConfig.extVideoTriggerExtension), c = b[0] + appConfig.extVideoFileExtension, d = cordova.file.applicationDirectory + "www/assets/img/videos/" + c, e = cordova.file.dataDirectory + "current.mp4";
fsapp.videoready();
}
},
startAndroidVideo: function() {
this.$.appCoreVideoDisplayElement.displayCurrentQuestionVideo();
},
startVideoForReal: function() {
alert("startVideoForReal"), jQuery("#jquery_jplayer_1").jPlayer("play", 0), this.$.appCoreVideoDisplayElement.startVideo();
}
});

// Video.js

function startVideoOutside() {
alert("Start Video 1");
var a = jQuery("#jquery_jplayer_1");
a.jPlayer("play", 0), alert("Start Video 2");
}

var videoSourceUrl = "";

enyo.kind({
name: "jPlayerVideo",
kind: enyo.Control,
published: {
src: "",
poster: "",
myjplayer: ""
},
events: {
onPlayerReady: ""
},
handlers: {},
components: [ {
tag: "div",
id: "jp_container_1",
classes: "jp-video",
style: "background-color:transparent !important;",
allowHtml: !0,
components: [ {
tag: "div",
id: "jquery_jplayer_1",
classes: "jp-jplayer",
allowHtml: !0
}, {
tag: "div",
classes: "jp-gui",
allowHtml: !0,
content: '<div class="jp-interface" style="display:none"><div class="jp-controls-holder"><!--play and pause buttons--><a href="javascript:;" class="jp-play" tabindex="1">play</a><a href="javascript:;" class="jp-pause" tabindex="1">pause</a><span class="separator sep-1"></span> <!--progress bar--><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"><span></span></div></div> </div> <!--time notifications--><div class="jp-current-time"></div><span class="time-sep">/</span><div class="jp-duration"></div><span class="separator sep-2"></span><!--mute / unmute toggle--><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a><!--volume bar--><div class="jp-volume-bar"><div class="jp-volume-bar-value"><span class="handle"></span></div></div><span class="separator sep-2"></span>   </div></div>'
}, {
tag: "div",
classes: "jp-no-solution",
allowHtml: !0,
content: "<div><b>Update notwendig</b></div>Bitte aktualisieren Sie Ihr Flash-Plugin, um dieses Video anzusehen."
} ]
} ],
create: function() {
this.inherited(arguments), jQuery("#jp_container_1").hide;
},
removePlayer: function() {
jQuery("#jquery_jplayer_1").jPlayer("destroy");
},
rendered: function() {
this.inherited(arguments);
if (appConfig.appOnMobileDevice) return;
jQuery("#jp_container_1").show();
var a = jQuery("#jquery_jplayer_1");
a.jPlayer({
backgroundColor: "#D3F5DA",
swfPath: curAppPath + "./jPlayer/",
cssSelectorAncestor: "#jp_container_1",
errorAlerts: !0,
solutions: "html, flash",
supplied: "m4v",
wmode: "transparent",
ready: function() {
try {
if (parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10) != 0) {
var b = parseInt(appCE.arrQuestionIds[appCE.currentQuestionIndex], 10);
if (typeof dbTblQ[b] != "undefined") {
var c = dbTblQ[b].picture.split(appConfig.extVideoTriggerExtension);
this.poster = "./" + appConfig.pathImgZoom + c[0] + "_anfang.jpg" + appConfig.extImgMedium, appConfig.appOnMobileDevice ? appConfig.appPlatformId == "android" ? window.resolveLocalFileSystemURL(cordova.file.dataDirectory + c[0] + appConfig.extVideoFileExtension, function() {
alert("Android Video (local): should not be opened!", fsapp);
}, function() {
alert("Android Video (stream): should not be opened!", fsapp);
}) : window.resolveLocalFileSystemURL(cordova.file.dataDirectory + c[0] + appConfig.extVideoFileExtension, function() {
alert("ios Video (local): should not be opened!", fsapp);
}, function() {
alert("ios Video (stream): should not be opened!", fsapp);
}) : (this.src = curAppPath + appConfig.urlVideoStreaming + c[0] + appConfig.extVideoFileExtension, a.jPlayer("setMedia", {
m4v: this.src
}).jPlayer("play", 0));
}
}
} catch (d) {
alert("init error: " + d, this);
}
},
size: {
width: "700px",
height: "420px",
cssClass: "jp-video-fullwidth"
},
error: function() {},
ended: function() {
fsapp.videoended();
}
}), this.resizePlayer();
},
startVideo: function() {
jQuery("#jquery_jplayer_1").jPlayer("play", 0);
},
srcChanged: function() {},
resizePlayer: function() {
var a = this.owner.getBounds(), b = parseInt(a.width, 10), c = parseInt(a.height, 10) - 100;
jQuery("#jquery_jplayer_1").jPlayer("option", "size", {
width: b + "px",
height: c + "px"
});
},
stopVideo: function() {
jQuery("#jquery_jplayer_1").jPlayer("stop");
},
init: function() {},
destroy: function() {
jQuery("#jquery_jplayer_1").jPlayer("destroy"), this.inherited(arguments);
}
});

// HeaderFooter.js

enyo.kind({
name: "PageHeader",
kind: "Control",
classes: "",
events: {
onBackButtonTap: "",
onClassButtonTap: "",
onHelpButtonTap: "",
onMenuButtonTap: ""
},
published: {
maintitleicon: "",
maintitle: "Main Title",
separator: "",
subtitle: "Subtitle",
selectedclass: ""
},
components: [ {
tag: "div",
name: "container",
classes: "pageheader",
components: [ {
tag: "div",
name: "maintitleicon",
classes: "maintitleicon",
content: this.maintitleicon,
allowHtml: !0
}, {
tag: "div",
name: "maintitle",
classes: "maintitle t24h_main",
content: this.maintitle,
allowHtml: !0,
ontap: "doBackButtonTap"
}, {
tag: "div",
name: "separator",
classes: "separator",
content: this.separator,
allowHtml: !0,
ontap: "doBackButtonTap"
}, {
tag: "div",
name: "subtitle",
classes: "subtitle t24h_sub",
content: this.subtitle,
allowHtml: !0,
ontap: "doBackButtonTap"
}, {
tag: "div",
name: "selectedclass",
classes: "selectedclass t24h_class",
content: "<i class='material-icons'>ol_menu</i>",
allowHtml: !0,
ontap: "doMenuButtonTap"
} ]
} ],
create: function() {
this.inherited(arguments), this.maintitleiconChanged(), this.maintitleChanged(), this.separatorChanged(), this.subtitleChanged(), this.selectedclassChanged();
},
rendered: function() {
this.inherited(arguments), this.$.selectedclass.show(), appConfig.appLockMode == 1 && appConfig.appLockable && !appConfig.userUnlockedApp && this.$.selectedclass.hide(), appConfig.hideHeaderHelpIconInDemo && (appConfig.appLockable && !appConfig.userUnlockedApp ? this.$.selectedclass.hide() : this.$.selectedclass.show()), this.displayProIconAndLabel(), this.$.maintitleicon.addClass("mticon-" + appConfig.appPlatformId);
},
maintitleiconChanged: function() {
this.$.maintitleicon.setContent(this.maintitleicon);
},
maintitleChanged: function() {
this.$.maintitle.setContent(this.maintitle);
},
separatorChanged: function() {
this.separator == "" ? this.$.separator.applyStyle("display", "none") : (this.$.separator.applyStyle("display", "block"), this.$.separator.setContent(this.separator));
},
subtitleChanged: function() {
this.$.subtitle.setContent(this.subtitle);
},
selectedclassChanged: function() {
this.displayProIconAndLabel(), appConfig.hideHeaderHelpIconInDemo && (appConfig.appLockable && !appConfig.userUnlockedApp ? this.$.selectedclass.hide() : this.$.selectedclass.show());
},
displayProIconAndLabel: function() {
try {
var a = this.subtitle;
this.subtitle == appConfig.pageSubtitleMain && (a = this.subtitle + " " + appConfig.appTitleUnlockedSuffix);
} catch (b) {}
try {
appConfig.appLockable && appConfig.userUnlockedApp && (this.setMaintitleicon(appConfig.appTitleIconUnlocked), this.$.subtitle.setContent(a)), !appConfig.appLockable && !appConfig.appOffersInAppPurchase && (this.setMaintitleicon(appConfig.appTitleIconUnlocked), this.$.subtitle.setContent(a)), appConfig.appOffersInAppPurchase && appConfig.userUnlockedApp && (this.setMaintitleicon(appConfig.appTitleIconUnlocked), this.$.subtitle.setContent(a)), (appConfig.appOffersInAppPurchase || appConfig.appDisplayIAPLabels) && !fsapp.$.Welcomepage.$.mainDynamicMenu.hideInAppPurchaseButtons && userDevicePlatform != "web" && (fsapp.$.Welcomepage.$.mainDynamicMenu.fetchIAPStatusFromDB() || (this.setMaintitleicon(appConfig.appTitleIconUnlocked), this.$.subtitle.setContent(a)));
} catch (b) {}
}
}), enyo.kind({
name: "PageFooter",
kind: "Control",
published: {
btnapply: "invisible",
btnread: "invisible",
btnpractice: "invisible",
btntest: "invisible",
btnchapterread: "invisible",
btnchapterpractice: "invisible",
btnrouteread: "invisible",
btnroutepractice: "invisible"
},
events: {
onBackButtonTap: "",
onApplyButtonTap: "",
onReadButtonTap: "",
onPracticeButtonTap: "",
onTestButtonTap: "",
onAddHelpButtonTap: "",
onNextSetupWizardButtonTap: "",
onReadRouteButtonTap: "",
onPracticeRouteButtonTap: ""
},
create: function() {
this.inherited(arguments), this.btnapplyChanged(), this.btnreadChanged(), this.btnpracticeChanged(), this.btntestChanged(), this.btnchapterreadChanged(), this.btnchapterpracticeChanged(), this.btnroutereadChanged(), this.btnroutepracticeChanged(), this.$.buttonaddhelp.hide();
},
components: [ {
tag: "div",
name: "container",
classes: "pagefooter",
style: "depr-background-color:#333",
components: [ {
kind: "onyx.Button",
name: "buttonback",
allowHtml: !0,
content: appConfig.msgMainMenu,
classes: "onyx-negative btnfooter",
ontap: "doBackButtonTap"
}, {
kind: "onyx.Button",
name: "buttonapply",
allowHtml: !0,
content: appConfig.msgApply,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "triggerApplyButtonTap"
}, {
tag: "div",
name: "rightbtncontainer",
classes: "rightfooterbuttoncontainer",
style: "float:right;margin-right:32px;height:100%;",
components: [ {
kind: "onyx.Button",
name: "buttonread",
allowHtml: !0,
content: appConfig.msgReadSet,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doReadButtonTap"
}, {
kind: "onyx.Button",
name: "buttonpractice",
allowHtml: !0,
content: appConfig.msgPracticeSet,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doPracticeButtonTap"
}, {
kind: "onyx.Button",
name: "buttontest",
allowHtml: !0,
content: appConfig.msgTestSet,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doTestButtonTap"
}, {
kind: "onyx.Button",
name: "buttonchapterread",
allowHtml: !0,
content: appConfig.msgReadSelection,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doReadButtonTap"
}, {
kind: "onyx.Button",
name: "buttonchapterpractice",
allowHtml: !0,
content: appConfig.msgPracticeSelection,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doPracticeButtonTap"
}, {
kind: "onyx.Button",
name: "buttonrouteread",
allowHtml: !0,
content: appConfig.msgReadRoute,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doReadRouteButtonTap"
}, {
kind: "onyx.Button",
name: "buttonroutepractice",
allowHtml: !0,
content: appConfig.msgPracticeRoute,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doPracticeRouteButtonTap"
}, {
kind: "onyx.Button",
name: "buttonaddhelp",
allowHtml: !0,
content: appConfig.msgApply,
style: "background-color:" + appConfig.btnBgColor + ";color:" + appConfig.btnFGColor,
classes: "onyx-blue btnfooter",
ontap: "doAddHelpButtonTap"
} ]
} ]
} ],
triggerApplyButtonTap: function() {
fsapp.setupWizardActive ? this.doNextSetupWizardButtonTap() : this.doApplyButtonTap();
},
refreshButtonCaptions: function() {
this.$.buttonback.setContent(appConfig.msgMainMenu), fsapp.setupWizardActive ? this.$.buttonapply.setContent(appConfig.msgSetupWizardContinueButton) : this.$.buttonapply.setContent(appConfig.msgApply), this.$.buttonread.setContent(appConfig.msgReadSet), this.$.buttonpractice.setContent(appConfig.msgPracticeSet), this.$.buttontest.setContent(appConfig.msgTestSet), this.$.buttonchapterread.setContent(appConfig.msgReadSelection), this.$.buttonchapterpractice.setContent(appConfig.msgPracticeSelection), this.$.buttonrouteread.setContent(appConfig.msgReadRoute), this.$.buttonroutepractice.setContent(appConfig.msgPracticeRoute), this.$.buttonaddhelp.setContent(appConfig.msgApply);
},
addHelpButton: function(a, b) {
this.$.buttonaddhelp.setContent(a), this.$.buttonaddhelp.setAttribute("helpTextId", b), this.$.buttonaddhelp.show();
},
btnapplyChanged: function() {
this.btnapply == "invisible" ? this.$.buttonapply.applyStyle("display", "none") : (this.$.buttonapply.applyStyle("display", "inline"), this.$.buttonback.setContent(appConfig.msgMainMenu));
},
btnreadChanged: function() {
this.btnread == "invisible" ? this.$.buttonread.applyStyle("display", "none") : this.$.buttonread.applyStyle("display", "inline");
},
btnpracticeChanged: function() {
this.btnpractice == "invisible" ? this.$.buttonpractice.applyStyle("display", "none") : this.$.buttonpractice.applyStyle("display", "inline");
},
btntestChanged: function() {
this.btntest == "invisible" ? this.$.buttontest.applyStyle("display", "none") : this.$.buttontest.applyStyle("display", "inline");
},
btnchapterreadChanged: function() {
this.btnchapterread == "invisible" ? this.$.buttonchapterread.applyStyle("display", "none") : this.$.buttonchapterread.applyStyle("display", "inline");
},
btnchapterpracticeChanged: function() {
this.btnchapterpractice == "invisible" ? this.$.buttonchapterpractice.applyStyle("display", "none") : this.$.buttonchapterpractice.applyStyle("display", "inline");
},
btnroutereadChanged: function() {
this.btnrouteread == "invisible" ? this.$.buttonrouteread.applyStyle("display", "none") : this.$.buttonrouteread.applyStyle("display", "inline");
},
btnroutepracticeChanged: function() {
this.btnroutepractice == "invisible" ? this.$.buttonroutepractice.applyStyle("display", "none") : this.$.buttonroutepractice.applyStyle("display", "inline");
}
}), enyo.kind({
name: "PageMenu",
kind: "Control",
classes: "",
events: {
onMenuCloseTap: "",
onMenuItemTap: ""
},
lastTapAction: "",
bolMenuOpen: !1,
bolMenuLocked: !1,
components: [ {
tag: "div",
name: "container",
classes: "pagemenucontainer",
style: "width:100%;height:100%;z-index:9999999",
components: [ {
name: "mnuShortcutEmpty0",
content: "",
allowHtml: !0,
style: "height:40px;",
classes: "menuitem",
ontap: ""
}, {
name: "mnuShortcut1",
content: appConfig.mnuShortcutLabel1,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap1"
}, {
name: "mnuShortcut2",
content: appConfig.mnuShortcutLabel2,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap2"
}, {
name: "mnuShortcut3",
content: appConfig.mnuShortcutLabel3,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap3"
}, {
name: "mnuShortcut4",
content: appConfig.mnuShortcutLabel4,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap4"
}, {
name: "mnuShortcutEmpty1",
content: "",
allowHtml: !0,
classes: "menuitem",
ontap: ""
}, {
name: "mnuShortcut5",
content: appConfig.mnuShortcutLabel5,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap5"
}, {
name: "mnuShortcut6",
content: appConfig.mnuShortcutLabel6,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap6"
}, {
name: "mnuShortcut7",
content: appConfig.mnuShortcutLabel7,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap7"
}, {
name: "mnuShortcutEmpty2",
content: "",
allowHtml: !0,
classes: "menuitem",
ontap: ""
}, {
name: "mnuShortcut8",
content: appConfig.mnuShortcutLabel8,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap8"
}, {
name: "mnuShortcut9",
content: appConfig.mnuShortcutLabel9,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap9"
}, {
name: "mnuShortcut10",
content: appConfig.mnuShortcutLabel10,
allowHtml: !0,
classes: "menuitem",
ontap: "mnuItemTap10"
}, {
name: "mnuClose",
content: appConfig.mnuShortcutBtnClose,
allowHtml: !0,
style: "position:absolute;top:25px;right:25px;width:22px;font-size:90%;",
ontap: "doMenuCloseTap"
}, {
name: "mnuThemeSwitch",
content: appConfig.mnuShortcutLabelDarkMode,
allowHtml: !0,
classes: "menuitem",
style: "position:absolute;top:25px;left:0;padding-top:0;",
ontap: "mnuItemTap0"
} ]
} ],
create: function() {
this.inherited(arguments);
},
refreshMenuCaptions: function() {
this.$.mnuShortcut1.setContent(appConfig.mnuShortcutLabel1), this.$.mnuShortcut2.setContent(appConfig.mnuShortcutLabel2), this.$.mnuShortcut3.setContent(appConfig.mnuShortcutLabel3), this.$.mnuShortcut4.setContent(appConfig.mnuShortcutLabel4), this.$.mnuShortcut5.setContent(appConfig.mnuShortcutLabel5), this.$.mnuShortcut6.setContent(appConfig.mnuShortcutLabel6), this.$.mnuShortcut7.setContent(appConfig.mnuShortcutLabel7), this.$.mnuShortcut8.setContent(appConfig.mnuShortcutLabel8), this.$.mnuShortcut9.setContent(appConfig.mnuShortcutLabel9), this.$.mnuShortcut10.setContent(appConfig.mnuShortcutLabel10), appConfig.appDarkModeActive ? this.$.mnuThemeSwitch.setContent(appConfig.mnuShortcutLabelLightMode) : this.$.mnuThemeSwitch.setContent(appConfig.mnuShortcutLabelDarkMode);
},
lockMenu: function() {
for (var a = 1; a < 8; a++) try {
this.$["mnuShortcut" + a].addClass("disabled_menuitem");
} catch (b) {}
this.$.mnuShortcut6.removeClass("disabled_menuitem"), this.bolMenuLocked = !0, appConfig.appOnMobileDevice || (appConfig.appVariantId != "adac" && userDevicePlatform == "web" && this.$.mnuShortcut8.hide(), this.$.mnuShortcut10.hide());
},
unlockMenu: function() {
for (var a = 1; a < 8; a++) try {
this.$["mnuShortcut" + a].removeClass("disabled_menuitem");
} catch (b) {}
this.bolMenuLocked = !1, appConfig.appOnMobileDevice || (appConfig.appVariantId != "adac" && userDevicePlatform == "web" && this.$.mnuShortcut8.hide(), this.$.mnuShortcut10.hide());
},
mnuItemTap0: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction0, this.doMenuItemTap());
},
mnuItemTap1: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction1, this.doMenuItemTap());
},
mnuItemTap2: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction2, this.doMenuItemTap());
},
mnuItemTap3: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction3, this.doMenuItemTap());
},
mnuItemTap4: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction4, this.doMenuItemTap());
},
mnuItemTap5: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction5, this.doMenuItemTap());
},
mnuItemTap6: function() {
this.lastTapAction = appConfig.mnuShortcutAction6, this.doMenuItemTap();
},
mnuItemTap7: function() {
this.bolMenuLocked || (this.lastTapAction = appConfig.mnuShortcutAction7, this.doMenuItemTap());
},
mnuItemTap8: function() {
this.lastTapAction = appConfig.mnuShortcutAction8, this.doMenuItemTap();
},
mnuItemTap9: function() {
this.lastTapAction = appConfig.mnuShortcutAction9, this.doMenuItemTap();
},
mnuItemTap10: function() {
this.lastTapAction = appConfig.mnuShortcutAction10, this.doMenuItemTap();
},
getLastTapAction: function() {
return this.lastTapAction;
},
showMenu: function() {
appConfig.appDarkModeActive ? this.$.mnuThemeSwitch.setContent(appConfig.mnuShortcutLabelLightMode) : this.$.mnuThemeSwitch.setContent(appConfig.mnuShortcutLabelDarkMode), this.bolMenuOpen || (appConfig.appLockable && !appConfig.userUnlockedApp ? this.lockMenu() : this.unlockMenu(), this.toggleMenu());
},
hideMenu: function() {
this.bolMenuOpen && this.toggleMenu();
},
toggleMenu: function() {
appConfig.hasDarkmodeSetting ? this.$.mnuThemeSwitch.show() : this.$.mnuThemeSwitch.hide(), this.bolMenuOpen ? jQuery("#pagemenu").animate({
right: "-300px"
}, 300) : jQuery("#pagemenu").animate({
right: "0"
}, 300), this.bolMenuOpen = !this.bolMenuOpen;
},
closeMenuHome: function() {
this.hideMenu(), this.doHomeButtonTap();
}
});
