window.addEvent('domready', function(){
  
  window.loader = {
    active: true,
    wrapper: $('loader'),
    remaining: $$('#loader .remaining')[0],
    label: $$('#loader .label')[0]
  };
  
  var height = loader.remaining.getStyle('height').toInt(),
      points = [0.75,0.45,0.0],
      i = 0,
      loadFx = new Fx.Tween(loader.remaining, {
        link: 'chain',
        duration: 900,
        transition: Fx.Transitions.Expo.easeOut
      });
  
  // Begin the loading animation
  // OPTIMIZE: put real loading stuff here if web page starts getting too slow
  (function(){
    loadFx.start('height',height * points[i]);
    i += 1;
    if(i < points.length)
      setTimeout(arguments.callee, 800 + (i-1) * 600);
    else
      doneLoading();
  })();
  
  // animated loading dots (yay!)
  var count = 4;
  (function(){
    var label = loader.label;
    label.innerHTML += '.';
    count += 1;
    if(count > 4){
      label.innerHTML = label.innerHTML.substr(0,label.innerHTML.length-4);
      count = count % 4;
    }
    if(loader.active)
      setTimeout(arguments.callee, 300);
  })();
});

function doneLoading(){
  // return;
  loader.active = false;
  loader.wrapper.set('transmorph',{
    duration: 1200,
    unit: '%',
    onComplete: function(){
      loader.label.fade('out');
    }
  }).transmorph({top:[50,155]},{top:'cubic:in:out'});
}
