// DeepSeek Research — theme controller
// Default theme is set via <html data-theme="..."> in each page (the "back end" knob).
// User toggle cycles: light → grey → dark → light, persisted in localStorage.
(function(){
  var KEY = 'dsr-theme';
  var ORDER = ['light','dark'];
  var LABEL = {light:'Light', dark:'Dark'};
  var ICON  = {light:'☼', dark:'☾'};

  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch(e){}
  if (saved && ORDER.indexOf(saved) !== -1) {
    root.setAttribute('data-theme', saved);
  } else if (!root.getAttribute('data-theme')) {
    root.setAttribute('data-theme', 'light');
  }

  function paintBtn(btn){
    var t = root.getAttribute('data-theme') || 'light';
    btn.textContent = ICON[t] || ICON.light;
    btn.setAttribute('aria-label', 'Theme: ' + (LABEL[t]||t) + ' — click to cycle');
    btn.title = 'Theme: ' + (LABEL[t]||t);
  }

  function cycle(){
    var t = root.getAttribute('data-theme') || 'light';
    var idx = ORDER.indexOf(t);
    var next = ORDER[(idx + 1) % ORDER.length];
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch(e){}
    document.querySelectorAll('[data-theme-toggle]').forEach(paintBtn);
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      paintBtn(btn);
      btn.addEventListener('click', cycle);
    });
  });
})();
