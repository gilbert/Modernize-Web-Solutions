/*
--- 
script: Fx.TransMorph.js

description: Defines Fx.TransMorph, class that allows per-property transitions.

license: MIT-style

authors:
- Lim Chee Aun

requires:
- core:1.2.4/Fx.Morph

provides: [Fx.TransMorph]

...
*/

Fx.TransMorph = new Class({
  
  Extends: Fx.CSS,
  
  initialize: function(element, options){
		this.element = this.subject = document.id(element);
		this.parent(options);
	},
  
  set: function(now){
		if (typeof now == 'string') now = this.search(now);
		for (var p in now) this.render(this.element, p, now[p], this.options.unit);
		return this;
	},
  
	step: function(){
		var time = Date.now();
		if (time < this.time + this.options.duration){
			var delta = {};
			var d = (time - this.time) / this.options.duration;
			var t = this.transition(d);
			for (p in this.from){
				var trans = this.transitions[p];
				delta[p] = (trans) ? trans(d) : t;
			}
			this.set(this.compute(this.from, this.to, delta));
		} else {
			this.set(this.compute(this.from, this.to, 1));
			this.complete();
		}
	},
	
	compute: function(from, to, delta){
		var now = {};
		var isArray = (typeOf(delta) == 'object');
		for (var p in from) now[p] = this.parent(from[p], to[p], isArray ? delta[p] : delta);
		return now;
	},
	
	start: function(properties, transitions){
	  console.log('gr');
		if (!this.check(properties, transitions)){ console.log('whi?');return this;}
		if (typeof properties == 'string') properties = this.search(properties);
		var from = {}, to = {};
		for (var p in properties){
			var parsed = this.prepare(this.element, p, properties[p]);
			from[p] = parsed.from;
			to[p] = parsed.to;
		}
		transitions = transitions || {};
		Object.each(transitions, function(trans, key){
			transitions[key] = this.getTransition(trans);
		}, this);
		this.transitions = transitions;
		console.log('retoyning',from,to);
		return Fx.CSS.prototype.start.apply(this,[from,to]);
	},

	getTransition: function(transition){
		var trans = transition || this.options.transition || Fx.Transitions.Sine.easeInOut;
		if (typeof trans == 'string'){
			var data = trans.split(':');
			trans = Fx.Transitions;
			trans = trans[data[0]] || trans[data[0].capitalize()];
			if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
		}
		return trans;
	}
	
});

Element.Properties.transmorph = {

	set: function(options){
	  console.log('set',options);
		var transmorph = this.retrieve('transmorph');
		if (transmorph) transmorph.cancel();
		return this.eliminate('transmorph').store('transmorph:options', Object.append({link: 'cancel'}, options));
	},

	get: function(options){
	  console.log('get',options);
		if (options || !this.retrieve('transmorph')){
			if (options || !this.retrieve('transmorph:options')) this.set('transmorph', options);
			console.log('try store',this.retrieve('transmorph:options'));
			this.store('transmorph', new Fx.TransMorph(this, this.retrieve('transmorph:options')));
			console.log('store');
		}
		console.log(this.retrieve('transmorph'));
		return this.retrieve('transmorph');
	}

};

Element.implement({

	transmorph: function(props, trans){
		this.get('transmorph').start(props, trans);
		return this;
	}

});
