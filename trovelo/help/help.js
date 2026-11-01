// Trovelo Help: search, the article's device tabs, its table of contents
// and the "Was this helpful?" answer. Every page works without it.
(function () {
  'use strict';

  // ── Every article, written or planned. href is null until it exists.
  var TOPICS = {
    'Getting started': ['i-sparkles', '#E3EDFF', '#2774FD', 'getting-started'],
    'Board & cards': ['i-board', '#FFE5E6', '#E23136', 'board-cards'],
    'Map & routes': ['i-map', '#FDEBD9', '#E65200', 'map-routes'],
    'Flights & transport': ['i-plane', '#E2E9FF', '#2947A0', 'flights-transport'],
    'Expenses': ['i-card', '#E0F5F0', '#2A8572', 'expenses'],
    'Plan together': ['i-people', '#EFE6FE', '#7440C0', 'plan-together'],
    'Weather & packing': ['i-weather', '#DDF5FB', '#0377BE', 'weather-packing'],
    'Guides & Someday': ['i-compass', '#FBEFFF', '#C130B7', 'guides-someday'],
    'My Spots & medals': ['i-globe', '#FEE4EE', '#C1195B', 'my-spots'],
    'Widgets, Watch & Calendar': ['i-watch', '#D6F0F5', '#057E97', 'widgets-watch-calendar'],
    'Mac & AI Plan': ['i-mac', '#ECECF1', '#1D1D1F', 'mac-ai-plan'],
    'iCloud, privacy & Pro': ['i-lock', '#FFF3CC', '#8A6100', 'icloud-privacy-pro']
  };
  var ARTICLES = [
    ['Add places to your days', 'Board & cards', '/trovelo/help/add-places-to-your-days/', 'add place sight restaurant search apple maps card day plus new'],
    ['Create your first trip', 'Getting started', null, 'new trip start dates destination'],
    ['Trips with more than one city', 'Getting started', null, 'cities multi destination route'],
    ['Move a card to another day', 'Board & cards', null, 'move drag date day change reschedule'],
    ['Change the order of your day', 'Board & cards', null, 'order reorder sort first'],
    ['How full is my day?', 'Board & cards', null, 'pace busy time left hours'],
    ['Every kind of card', 'Board & cards', null, 'types category hotel food note'],
    ['Notes, files and photos', 'Board & cards', null, 'note file photo pdf attach'],
    ['Unplanned: ideas without a day', 'Board & cards', null, 'unplanned ideas later tray'],
    ['Confirmation numbers', 'Board & cards', null, 'booking code reference reservation'],
    ['Optimize a day’s route', 'Map & routes', null, 'optimize route order map distance'],
    ['What’s nearby', 'Map & routes', null, 'nearby coffee food around map'],
    ['Drop a pin on the map', 'Map & routes', null, 'pin map hold place'],
    ['Add a flight, with layovers', 'Flights & transport', null, 'flight plane airport layover stop boarding'],
    ['Trains, buses and ferries', 'Flights & transport', null, 'train bus ferry cruise transport ticket'],
    ['Import a booking from an email', 'Flights & transport', null, 'import booking email pdf screenshot hotel flight rental car'],
    ['Log an expense', 'Expenses', null, 'expense cost spend money price'],
    ['See costs in your own money', 'Expenses', null, 'currency home money exchange'],
    ['Split costs with your group', 'Expenses', null, 'split group pot share costs friends'],
    ['Invite someone to your trip', 'Plan together', null, 'invite share friend together icloud'],
    ['Can view or can edit', 'Plan together', null, 'permission view edit share'],
    ['What stays private', 'Plan together', null, 'private share home packing documents'],
    ['Typical weather and live forecast', 'Weather & packing', null, 'weather forecast rain temperature'],
    ['Your packing list', 'Weather & packing', null, 'packing list suitcase pack'],
    ['Plugs and voltage', 'Weather & packing', null, 'plug adapter voltage socket'],
    ['Start a trip from a guide', 'Guides & Someday', null, 'guide itinerary template road trip'],
    ['Save places for Someday', 'Guides & Someday', null, 'someday save wishlist later'],
    ['Paste a list from a blog', 'Guides & Someday', null, 'paste list blog chatgpt notes'],
    ['Add places you’ve been', 'My Spots & medals', null, 'spots visited countries map been'],
    ['Find past trips in your photos', 'My Spots & medals', null, 'photos past trips scan'],
    ['Medals, from First Stepper up', 'My Spots & medals', null, 'medals countries badges'],
    ['Your flight on the Lock Screen', 'Widgets, Watch & Calendar', null, 'lock screen live activity widget flight gate'],
    ['Trovelo on Apple Watch', 'Widgets, Watch & Calendar', null, 'watch wrist'],
    ['Your trip in Calendar', 'Widgets, Watch & Calendar', null, 'calendar events'],
    ['Trovelo on Mac', 'Mac & AI Plan', null, 'mac desktop board columns'],
    ['Plan with your AI assistant', 'Mac & AI Plan', null, 'ai claude mcp assistant chatgpt plan'],
    ['Drag cards between days', 'Mac & AI Plan', null, 'drag mac columns move'],
    ['How iCloud sync works', 'iCloud, privacy & Pro', null, 'icloud sync devices account'],
    ['Back up all your trips', 'iCloud, privacy & Pro', null, 'backup zip export restore'],
    ['What Trovelo Pro includes', 'iCloud, privacy & Pro', null, 'pro purchase unlimited price']
  ];

  var fold = function (s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');
  };
  var esc = function (s) {
    return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var INDEX = ARTICLES.map(function (a) {
    return { title: a[0], topic: a[1], href: a[2], hay: fold(a[0] + ' ' + a[1] + ' ' + a[3]) };
  });

  function search(q) {
    var words = fold(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return INDEX.filter(function (a) {
      return words.every(function (w) { return a.hay.indexOf(w) !== -1; });
    }).sort(function (a, b) { return (b.href ? 1 : 0) - (a.href ? 1 : 0); }).slice(0, 8);
  }

  function row(a) {
    var t = TOPICS[a.topic];
    var tile = '<span class="tile" style="--tile:' + t[1] + ';--ac:' + t[2] + '"><span class="sf ' + t[0] + '"></span></span>';
    var text = '<span class="res-t"><b>' + esc(a.title) + '</b><small>' + esc(a.topic) + '</small></span>';
    if (a.href) return '<a class="res" href="' + a.href + '">' + tile + text + '<span class="sf i-chev" style="width:12px;height:12px;color:#9AA0AE"></span></a>';
    return '<div class="res soon">' + tile + text + '<span class="soon-tag">Soon</span></div>';
  }

  // ── Search on the Help home.
  var input = document.getElementById('q');
  var box = document.getElementById('results');
  if (input && box) {
    var render = function () {
      var q = input.value.trim();
      if (!q) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      var hits = search(q);
      box.innerHTML = hits.length
        ? hits.map(row).join('')
        : '<div class="res-empty">Nothing yet for “' + esc(q) + '”.<span>Ask me on <a href="https://www.reddit.com/r/trovelo/">r/trovelo</a> and I’ll answer.</span></div>';
      box.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (e) {
      var links = box.querySelectorAll('a.res');
      if (e.key === 'ArrowDown' && links.length) { e.preventDefault(); links[0].focus(); }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (links.length) location.href = links[0].getAttribute('href');
      }
      if (e.key === 'Escape') { input.value = ''; render(); }
    });
    box.addEventListener('keydown', function (e) {
      var links = Array.prototype.slice.call(box.querySelectorAll('a.res'));
      var i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && i < links.length - 1) { e.preventDefault(); links[i + 1].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (i > 0 ? links[i - 1] : input).focus(); }
      if (e.key === 'Escape') { input.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search')) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); input.select(); }
    });
    var start = new URLSearchParams(location.search).get('q');
    if (start) {
      input.value = start;
      document.getElementById('search').scrollIntoView({ block: 'center' });
      input.focus();
      render();
    }
  }

  // ── Article: iPhone & iPad / Mac tabs. Without the script both show.
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var tocs = document.querySelectorAll('[data-toc]');
  var pick = function (id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    Array.prototype.forEach.call(tocs, function (n) { n.hidden = n.getAttribute('data-toc') !== id; });
    watch();
  };
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      pick(next.getAttribute('aria-controls'));
    });
  });

  // ── Article: light up the step being read in the table of contents.
  var observer = null;
  function watch() {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.toc:not([hidden]) a');
    if (!links.length) return;
    var byId = {};
    Array.prototype.forEach.call(links, function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Array.prototype.forEach.call(links, function (a) { a.classList.remove('on'); });
        var a = byId[en.target.id];
        if (a) a.classList.add('on');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
  if (tabs.length) pick(tabs[0].getAttribute('aria-controls'));

  // ── Article: "Was this helpful?"
  var vote = document.querySelector('.vote');
  if (vote) {
    vote.querySelectorAll('[data-vote]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-vote');
        vote.querySelector('.vote-q').hidden = true;
        vote.querySelector('[data-answer="' + v + '"]').hidden = false;
        vote.querySelectorAll('.mascot img').forEach(function (img) {
          img.hidden = img.getAttribute('data-mood') !== v;
        });
        vote.querySelector('[data-answer="' + v + '"]').focus();
      });
    });
  }
})();
