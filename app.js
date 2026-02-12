// BesideYou App v7 — zero inline event handlers
// All interactions use addEventListener + data attributes.
// Works even when CSP blocks 'unsafe-inline'.

var App = {
  state: { role:null, theme:'dark', onboarded:false, dismissedWelcome:[], checkins:[], symptoms:[], medications:[], appointments:[], gooddays:[], journal:[], doctorQuestions:[], handoffs:[] },
  _importFile:null, _breathInterval:null, _breathRunning:false, _currentSev:5, _glossaryCat:'all',
  _nightBreathInterval:null, _nightBreathing:false, _groundStep:0, _phraseIndex:0,
  _pendingImport:null, _clearStep:0,

  init: function() {
    this.load();
    if (!this.state.dismissedWelcome) this.state.dismissedWelcome = [];
    if (this.state.theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('theme-btn').textContent = this.state.theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    if (this.state.onboarded && this.state.role) this.go('screen-home');
    this.buildSev();
    this.initWelcomePanels();
    this.renderAll();
    this.updateNudge();
    this.updateFreshVisit();
  },

  save: function() { try { localStorage.setItem('besideyou', JSON.stringify(this.state)); } catch(e) {} },
  load: function() { try { var s = localStorage.getItem('besideyou'); if (s) this.state = Object.assign({}, this.state, JSON.parse(s)); } catch(e) {} },

  go: function(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    document.getElementById(id).classList.add('active');
    var showNav = (['screen-welcome', 'screen-role'].indexOf(id) === -1);
    document.getElementById('bottom-nav').style.display = showNav ? 'flex' : 'none';
    var showFab = (['screen-welcome', 'screen-role', 'screen-crisis', 'screen-3am'].indexOf(id) === -1);
    document.getElementById('crisis-fab').classList.toggle('visible', showFab);
    if (id !== 'screen-3am' && this._nightBreathing) this.stopNightBreathing();
    var nm = {'screen-home':0, 'screen-symptoms':1, 'screen-checkin':1, 'screen-medications':2, 'screen-gooddays':3, 'screen-resources':4, 'screen-crisis':4};
    var navItems = document.querySelectorAll('.nav-item');
    for (var j = 0; j < navItems.length; j++) navItems[j].classList.toggle('active', j === nm[id]);
    if (id === 'screen-home') this.updateGreeting();
    window.scrollTo(0, 0);
  },
  nav: function(s) { this.go(s); },

  setRole: function(role) {
    this.state.role = role; this.state.onboarded = true; this.save();
    document.getElementById('qa-carer').style.display = role === 'carer' ? 'block' : 'none';
    document.getElementById('qa-patient').style.display = role === 'carer' ? 'none' : 'block';
    this.go('screen-home');
  },

  toggleTheme: function() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    if (this.state.theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-btn').textContent = this.state.theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    this.save();
  },

  updateGreeting: function() {
    var h = new Date().getHours();
    document.getElementById('greeting').textContent = h < 12 ? 'Good morning.' : h < 17 ? 'Good afternoon.' : 'Good evening.';
    document.getElementById('qa-carer').style.display = this.state.role === 'carer' ? 'block' : 'none';
    document.getElementById('qa-patient').style.display = this.state.role === 'carer' ? 'none' : 'block';
  },

  pickMood: function(btn) {
    var btns = document.querySelectorAll('#mood-grid .mood-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');
  },
  saveCheckin: function() {
    var moodEl = document.querySelector('#mood-grid .mood-btn.active');
    var mood = moodEl ? moodEl.getAttribute('data-mood') : '';
    var syms = []; var pills = document.querySelectorAll('#checkin-symptoms .pill.active');
    for (var i = 0; i < pills.length; i++) syms.push(pills[i].textContent);
    var notes = document.getElementById('ci-notes').value;
    var good = document.getElementById('ci-good').value;
    this.state.checkins.unshift({id: Date.now(), date: new Date().toISOString(), mood: mood, symptoms: syms, notes: notes, good: good});
    if (good.trim()) this.state.gooddays.unshift({id: Date.now() + 1, date: new Date().toISOString(), text: good.trim()});
    this.save(); this.toast('Check-in saved \u2713');
    var moodBtns = document.querySelectorAll('#mood-grid .mood-btn');
    for (var j = 0; j < moodBtns.length; j++) moodBtns[j].classList.remove('active');
    var ciPills = document.querySelectorAll('#checkin-symptoms .pill');
    for (var k = 0; k < ciPills.length; k++) ciPills[k].classList.remove('active');
    document.getElementById('ci-notes').value = ''; document.getElementById('ci-good').value = '';
    this.go('screen-home'); this.renderAll();
  },

  pickSymType: function(btn) {
    var pills = document.querySelectorAll('#modal-symptom .pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    btn.classList.add('active'); document.getElementById('sym-name').value = btn.textContent;
  },
  buildSev: function() {
    var el = document.getElementById('sev-scale'); if (!el) return; el.innerHTML = '';
    var self = this;
    for (var i = 1; i <= 10; i++) {
      (function(n) {
        var b = document.createElement('button'); b.className = 'sev-btn'; b.textContent = n;
        b.addEventListener('click', function() {
          var all = document.querySelectorAll('.sev-btn');
          for (var x = 0; x < all.length; x++) all[x].classList.remove('active');
          b.classList.add('active'); self._currentSev = n;
        });
        el.appendChild(b);
      })(i);
    }
  },
  saveSymptom: function() {
    var name = document.getElementById('sym-name').value.trim();
    if (!name) { this.toast('Please enter a symptom'); return; }
    this.state.symptoms.unshift({id: Date.now(), date: new Date().toISOString(), name: name, severity: this._currentSev, notes: document.getElementById('sym-notes').value});
    this.save(); this.closeModal('modal-symptom'); this.toast('Symptom logged \u2713'); this.renderSymptoms();
  },
  renderSymptoms: function() {
    var el = document.getElementById('symptom-list'); var self = this;
    if (!this.state.symptoms.length) { el.innerHTML = '<div class="empty"><div class="ei">\uD83D\uDC93</div><h3>No symptoms logged yet</h3><p class="sub mt-8">When you\'re ready, tap above to log your first symptom.</p></div>'; return; }
    el.innerHTML = this.state.symptoms.map(function(s) {
      return '<div class="li" style="margin-bottom:8px;cursor:default"><div class="li-icon" style="background:' + (s.severity <= 3 ? 'var(--sage)' : s.severity <= 6 ? 'var(--warm)' : 'var(--rose)') + ';color:#fff;font-size:.8rem;font-weight:600;width:36px;height:36px">' + s.severity + '</div><div style="flex:1;min-width:0"><div class="li-t">' + self.esc(s.name) + '</div><div class="li-s">' + self.fmtDate(s.date) + (s.notes ? ' \u00B7 ' + self.esc(s.notes) : '') + '</div></div><button class="del-btn" data-del="symptoms:' + s.id + '">\u2715</button></div>';
    }).join('');
  },

  saveMed: function() {
    var name = document.getElementById('med-name').value.trim();
    if (!name) { this.toast('Please enter a medication name'); return; }
    this.state.medications.unshift({id: Date.now(), name: name, dose: document.getElementById('med-dose').value, frequency: document.getElementById('med-freq').value, purpose: document.getElementById('med-purpose').value, questions: document.getElementById('med-q').value, date: new Date().toISOString()});
    this.save(); this.closeModal('modal-med'); this.toast('Medication added \u2713'); this.renderMeds();
  },
  renderMeds: function() {
    var el = document.getElementById('med-list'); var self = this;
    if (!this.state.medications.length) { el.innerHTML = '<div class="empty"><div class="ei">\uD83D\uDC8A</div><h3>No medications added yet</h3><p class="sub mt-8">Add your medications so you have them all in one place.</p></div>'; return; }
    el.innerHTML = this.state.medications.map(function(m) {
      return '<div class="li" style="margin-bottom:8px;cursor:default"><div class="li-icon warm">\uD83D\uDC8A</div><div style="flex:1;min-width:0"><div class="li-t">' + self.esc(m.name) + (m.dose ? ' \u2014 ' + self.esc(m.dose) : '') + '</div><div class="li-s">' + (m.frequency ? self.esc(m.frequency) : '') + (m.purpose ? ' \u00B7 ' + self.esc(m.purpose) : '') + '</div>' + (m.questions ? '<div class="li-s" style="color:var(--sky);margin-top:4px">\u2753 ' + self.esc(m.questions) + '</div>' : '') + '</div><button class="del-btn" data-del="medications:' + m.id + '">\u2715</button></div>';
    }).join('');
  },

  saveAppt: function() {
    var type = document.getElementById('appt-type').value.trim();
    if (!type) { this.toast('Please enter the appointment type'); return; }
    this.state.appointments.unshift({id: Date.now(), type: type, date: document.getElementById('appt-date').value, time: document.getElementById('appt-time').value, location: document.getElementById('appt-loc').value, notes: document.getElementById('appt-notes').value});
    this.save(); this.closeModal('modal-appt'); this.toast('Appointment added \u2713'); this.renderAppts();
  },
  renderAppts: function() {
    var el = document.getElementById('appt-list'); var self = this;
    if (!this.state.appointments.length) { el.innerHTML = '<div class="empty" style="padding:24px"><div class="ei">\uD83D\uDCC5</div><h3>No appointments yet</h3></div>'; return; }
    el.innerHTML = this.state.appointments.map(function(a) {
      return '<div class="li" style="margin-bottom:8px;cursor:default"><div class="li-icon gold">\uD83D\uDCC5</div><div style="flex:1;min-width:0"><div class="li-t">' + self.esc(a.type) + '</div><div class="li-s">' + (a.date ? self.fmtDateShort(a.date) : 'No date') + (a.time ? ' at ' + a.time : '') + (a.location ? ' \u00B7 ' + self.esc(a.location) : '') + '</div>' + (a.notes ? '<div class="li-s" style="margin-top:4px">' + self.esc(a.notes) + '</div>' : '') + '</div><button class="del-btn" data-del="appointments:' + a.id + '">\u2715</button></div>';
    }).join('');
  },

  addDQ: function() {
    var inp = document.getElementById('dq-input'); var q = inp.value.trim(); if (!q) return;
    this.state.doctorQuestions.unshift({id: Date.now(), text: q, done: false}); inp.value = ''; this.save(); this.renderDQ();
  },
  toggleDQ: function(id) {
    var found = null;
    for (var i = 0; i < this.state.doctorQuestions.length; i++) {
      if (this.state.doctorQuestions[i].id === id) { found = this.state.doctorQuestions[i]; break; }
    }
    if (found) found.done = !found.done; this.save(); this.renderDQ();
  },
  renderDQ: function() {
    var el = document.getElementById('dq-list'); var self = this;
    if (!this.state.doctorQuestions.length) { el.innerHTML = ''; return; }
    el.innerHTML = this.state.doctorQuestions.map(function(q) {
      return '<div class="dq"><button class="dq-check ' + (q.done ? 'done' : '') + '" data-dq="' + q.id + '">' + (q.done ? '\u2713' : '') + '</button><div class="dq-text" style="' + (q.done ? 'text-decoration:line-through;color:var(--t3)' : '') + '">' + self.esc(q.text) + '</div><button class="del-btn" data-del="doctorQuestions:' + q.id + '" style="width:24px;height:24px">\u2715</button></div>';
    }).join('');
  },

  addGoodDay: function() {
    var inp = document.getElementById('gd-input'); var t = inp.value.trim(); if (!t) return;
    this.state.gooddays.unshift({id: Date.now(), date: new Date().toISOString(), text: t}); inp.value = ''; this.save(); this.toast('Moment saved \u2728'); this.renderGoodDays();
  },
  renderGoodDays: function() {
    var el = document.getElementById('gd-list'); var self = this;
    if (!this.state.gooddays.length) { el.innerHTML = '<div class="empty"><div class="ei">\u2728</div><h3>Your jar is waiting</h3><p class="sub mt-8">Add your first moment above.</p></div>'; return; }
    el.innerHTML = this.state.gooddays.map(function(g) {
      return '<div class="gd-moment"><div class="gd-icon">\u2728</div><div class="gd-body"><div class="gd-text">' + self.esc(g.text) + '</div><div class="gd-date">' + self.fmtDate(g.date) + '</div></div><button class="del-btn" data-del="gooddays:' + g.id + '">\u2715</button></div>';
    }).join('');
  },

  saveJournal: function() {
    var inp = document.getElementById('journal-input'); var t = inp.value.trim(); if (!t) return;
    this.state.journal.unshift({id: Date.now(), date: new Date().toISOString(), text: t}); inp.value = ''; this.save(); this.toast('Entry saved \u2713'); this.renderJournal();
  },
  renderJournal: function() {
    var el = document.getElementById('journal-list'); var self = this;
    if (!this.state.journal.length) { el.innerHTML = '<div class="empty"><div class="ei">\uD83D\uDCDD</div><h3>No entries yet</h3><p class="sub mt-8">Write whatever is on your mind.</p></div>'; return; }
    el.innerHTML = this.state.journal.map(function(j) {
      return '<div class="j-entry"><div class="j-date">' + self.fmtDate(j.date) + '</div><div class="j-text">' + self.esc(j.text) + '</div><button class="del-btn mt-8" data-del="journal:' + j.id + '">\u2715</button></div>';
    }).join('');
  },

  filterGlossary: function() {
    var searchEl = document.getElementById('glossary-search');
    this.renderGlossary(searchEl ? searchEl.value.toLowerCase() : '');
  },
  filterGlossaryCat: function(btn, cat) {
    var pills = document.querySelectorAll('#glossary-filters .pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    btn.classList.add('active'); this._glossaryCat = cat; this.renderGlossary();
  },
  renderGlossary: function(search) {
    var searchEl = document.getElementById('glossary-search');
    var q = (search || (searchEl ? searchEl.value : '') || '').toLowerCase();
    var cat = this._glossaryCat; var self = this;
    var terms = GLOSSARY.filter(function(t) {
      if (cat !== 'all' && t.cat !== cat) return false;
      if (q && t.term.toLowerCase().indexOf(q) === -1 && t.def.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var el = document.getElementById('glossary-list');
    if (!terms.length) { el.innerHTML = '<div class="empty" style="padding:32px"><p class="sub">No terms found. Try a different search.</p></div>'; return; }
    el.innerHTML = terms.map(function(t) {
      return '<div class="gl-term" data-toggle-open><div class="gl-name">' + self.esc(t.term) + '</div><div class="gl-def">' + self.esc(t.def) + '</div><div class="gl-cat">' + t.cat + '</div></div>';
    }).join('');
  },

  filterRes: function(btn, cat) {
    var pills = document.querySelectorAll('#screen-resources .pill');
    for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
    btn.classList.add('active'); this.renderResources(cat);
  },
  renderResources: function(cat) {
    cat = cat || 'all'; var self = this;
    var el = document.getElementById('resources-list');
    var res = RESOURCES.filter(function(r) { return cat === 'all' || r.cat === cat; });
    el.innerHTML = res.map(function(r) {
      return '<div class="rcard"><div class="rcard-t">' + self.esc(r.name) + '</div><div class="rcard-d">' + self.esc(r.desc) + '</div><div style="margin-top:8px;display:flex;gap:12px">' + (r.phone ? '<a href="tel:' + r.phone.replace(/\s/g, '') + '" class="rcard-a">\uD83D\uDCDE ' + r.phone + '</a>' : '') + (r.url ? '<a href="' + r.url + '" target="_blank" rel="noopener noreferrer" class="rcard-a">\uD83D\uDD17 Website</a>' : '') + '</div><div style="margin-top:6px;display:flex;gap:4px">' + r.who.split(',').map(function(w) { return '<span style="font-size:.7rem;padding:2px 8px;border-radius:10px;background:var(--sage-s);color:var(--sage)">' + w.trim() + '</span>'; }).join('') + '</div></div>';
    }).join('');
  },

  saveHandoff: function() {
    var meds = document.getElementById('ho-meds').value;
    var mood = document.getElementById('ho-mood').value;
    var notes = document.getElementById('ho-notes').value;
    var upcoming = document.getElementById('ho-upcoming').value;
    if (!meds && !mood && !notes && !upcoming) { this.toast('Add at least one detail'); return; }
    this.state.handoffs.unshift({id: Date.now(), date: new Date().toISOString(), meds: meds, mood: mood, notes: notes, upcoming: upcoming});
    this.save(); this.toast('Handoff saved \u2713');
    var ids = ['ho-meds', 'ho-mood', 'ho-notes', 'ho-upcoming'];
    for (var i = 0; i < ids.length; i++) document.getElementById(ids[i]).value = '';
    this.renderHandoffs();
  },
  copyHandoff: function() {
    var m = document.getElementById('ho-meds').value; var mo = document.getElementById('ho-mood').value;
    var n = document.getElementById('ho-notes').value; var u = document.getElementById('ho-upcoming').value;
    var text = 'CARER HANDOFF \u2014 ' + new Date().toLocaleString() + '\n\nMedications: ' + (m || '\u2014') + '\nHow they\'re doing: ' + (mo || '\u2014') + '\nThings to know: ' + (n || '\u2014') + '\nComing up: ' + (u || '\u2014');
    navigator.clipboard.writeText(text).then(function() { App.toast('Copied to clipboard \u2713'); }).catch(function() { App.toast('Could not copy'); });
  },
  renderHandoffs: function() {
    var el = document.getElementById('handoff-list'); var self = this;
    if (!this.state.handoffs.length) { el.innerHTML = ''; return; }
    el.innerHTML = this.state.handoffs.slice(0, 10).map(function(h) {
      return '<div class="ho-card"><div class="ho-date">' + self.fmtDate(h.date) + '</div>' + (h.meds ? '<div class="ho-section"><strong>Meds</strong><p>' + self.esc(h.meds) + '</p></div>' : '') + (h.mood ? '<div class="ho-section"><strong>Status</strong><p>' + self.esc(h.mood) + '</p></div>' : '') + (h.notes ? '<div class="ho-section"><strong>Notes</strong><p>' + self.esc(h.notes) + '</p></div>' : '') + (h.upcoming ? '<div class="ho-section"><strong>Coming up</strong><p>' + self.esc(h.upcoming) + '</p></div>' : '') + '<button class="del-btn mt-4" data-del="handoffs:' + h.id + '">\u2715</button></div>';
    }).join('');
  },

  startBreathing: function() {
    if (this._breathRunning) { this.stopBreathing(); return; }
    this._breathRunning = true;
    document.getElementById('breath-btn').textContent = 'Stop';
    var circle = document.getElementById('breath-circle'); var text = document.getElementById('breath-text');
    var phase = 'inhale';
    var cycle = function() {
      if (phase === 'inhale') { circle.className = 'breath-circle inhale'; text.textContent = 'Breathe in...'; phase = 'hold1'; }
      else if (phase === 'hold1') { text.textContent = 'Hold...'; phase = 'exhale'; }
      else if (phase === 'exhale') { circle.className = 'breath-circle exhale'; text.textContent = 'Breathe out...'; phase = 'hold2'; }
      else { text.textContent = 'Hold...'; phase = 'inhale'; }
    };
    cycle();
    this._breathInterval = setInterval(cycle, 4000);
  },
  stopBreathing: function() {
    this._breathRunning = false; clearInterval(this._breathInterval);
    document.getElementById('breath-btn').textContent = 'Start breathing';
    document.getElementById('breath-circle').className = 'breath-circle';
    document.getElementById('breath-text').textContent = 'Tap to begin';
  },

  exportData: function() { this.openModal('modal-export'); },
  doExport: function() {
    var self = this;
    var p1 = document.getElementById('exp-pass').value; var p2 = document.getElementById('exp-pass2').value;
    if (!p1) { this.toast('Please enter a passphrase'); return; }
    if (p1 !== p2) { this.toast('Passphrases don\'t match'); return; }
    try {
      var data = JSON.stringify(this.state);
      var enc = new TextEncoder();
      crypto.subtle.importKey('raw', enc.encode(p1), 'PBKDF2', false, ['deriveKey']).then(function(keyMaterial) {
        var salt = crypto.getRandomValues(new Uint8Array(16)); var iv = crypto.getRandomValues(new Uint8Array(12));
        return crypto.subtle.deriveKey({name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256'}, keyMaterial, {name: 'AES-GCM', length: 256}, false, ['encrypt']).then(function(key) {
          return crypto.subtle.encrypt({name: 'AES-GCM', iv: iv}, key, enc.encode(data)).then(function(encrypted) {
            var result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            result.set(salt, 0); result.set(iv, salt.length); result.set(new Uint8Array(encrypted), salt.length + iv.length);
            var blob = new Blob([result], {type: 'application/octet-stream'});
            var url = URL.createObjectURL(blob); var a = document.createElement('a');
            a.href = url; a.download = 'besideyou-backup-' + new Date().toISOString().slice(0, 10) + '.besideyou';
            a.click(); URL.revokeObjectURL(url);
            self.closeModal('modal-export'); self.toast('Backup downloaded \u2713');
            document.getElementById('exp-pass').value = ''; document.getElementById('exp-pass2').value = '';
          });
        });
      }).catch(function(e) { self.toast('Export failed: ' + e.message); });
    } catch(e) { this.toast('Export failed: ' + e.message); }
  },
  importData: function(event) {
    var self = this;
    var file = event.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function() { self._importFile = reader.result; self.openModal('modal-import'); };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  },
  doImport: function() {
    var self = this;
    var pass = document.getElementById('imp-pass').value;
    if (!pass) { this.toast('Please enter your passphrase'); return; }
    try {
      var data = new Uint8Array(this._importFile);
      var salt = data.slice(0, 16); var iv = data.slice(16, 28); var encrypted = data.slice(28);
      var enc = new TextEncoder();
      crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']).then(function(keyMaterial) {
        return crypto.subtle.deriveKey({name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256'}, keyMaterial, {name: 'AES-GCM', length: 256}, false, ['decrypt']).then(function(key) {
          return crypto.subtle.decrypt({name: 'AES-GCM', iv: iv}, key, encrypted).then(function(decrypted) {
            var json = new TextDecoder().decode(decrypted);
            self.state = Object.assign({}, self.state, JSON.parse(json)); self.save();
            self.closeModal('modal-import'); self.toast('Data restored \u2713');
            document.getElementById('imp-pass').value = ''; self.renderAll();
          });
        });
      }).catch(function() { self.toast('Wrong passphrase or corrupted file'); });
    } catch(e) { this.toast('Wrong passphrase or corrupted file'); }
  },

  openModal: function(id) {
    if (id === 'modal-symptom') {
      document.getElementById('sym-name').value = ''; document.getElementById('sym-notes').value = '';
      var pills = document.querySelectorAll('#modal-symptom .pill');
      for (var i = 0; i < pills.length; i++) pills[i].classList.remove('active');
      var sevs = document.querySelectorAll('.sev-btn');
      for (var j = 0; j < sevs.length; j++) sevs[j].classList.remove('active');
      this._currentSev = 5;
    }
    if (id === 'modal-med') { var mids = ['med-name', 'med-dose', 'med-freq', 'med-purpose', 'med-q']; for (var k = 0; k < mids.length; k++) document.getElementById(mids[k]).value = ''; }
    if (id === 'modal-appt') { var aids = ['appt-type', 'appt-date', 'appt-time', 'appt-loc', 'appt-notes']; for (var l = 0; l < aids.length; l++) document.getElementById(aids[l]).value = ''; }
    document.getElementById(id).classList.add('active');
  },
  closeModal: function(id) { document.getElementById(id).classList.remove('active'); },

  del: function(collection, id) {
    this.state[collection] = this.state[collection].filter(function(x) { return x.id !== id; }); this.save(); this.renderAll();
  },

  // Welcome Panels
  initWelcomePanels: function() {
    if (!this.state.dismissedWelcome) return;
    for (var i = 0; i < this.state.dismissedWelcome.length; i++) {
      var panel = document.getElementById('wp-' + this.state.dismissedWelcome[i]);
      if (panel) panel.classList.add('hidden');
    }
  },
  dismissWelcome: function(moduleId) {
    var panel = document.getElementById('wp-' + moduleId);
    if (panel) panel.classList.add('hidden');
    if (!this.state.dismissedWelcome) this.state.dismissedWelcome = [];
    if (this.state.dismissedWelcome.indexOf(moduleId) === -1) {
      this.state.dismissedWelcome.push(moduleId);
      this.save();
    }
  },
  showWelcome: function(moduleId) {
    var panel = document.getElementById('wp-' + moduleId);
    if (panel) panel.classList.remove('hidden');
    if (!this.state.dismissedWelcome) return;
    var idx = this.state.dismissedWelcome.indexOf(moduleId);
    if (idx > -1) {
      this.state.dismissedWelcome.splice(idx, 1);
      this.save();
    }
  },

  // 3am Module
  startNightBreathing: function() {
    if (this._nightBreathing) { this.stopNightBreathing(); return; }
    this._nightBreathing = true;
    var btn = document.getElementById('night-breath-btn');
    if (btn) btn.textContent = 'Stop';
    var circle = document.getElementById('night-breath');
    var text = document.getElementById('night-breath-text');
    var phase = 'inhale';
    var run = function() {
      if (phase === 'inhale') { circle.className = 'night-breath inhale'; text.textContent = 'Breathe in\u2026'; phase = 'hold1'; }
      else if (phase === 'hold1') { text.textContent = 'Hold\u2026'; phase = 'exhale'; }
      else if (phase === 'exhale') { circle.className = 'night-breath exhale'; text.textContent = 'Breathe out\u2026'; phase = 'hold2'; }
      else { text.textContent = 'Hold\u2026'; phase = 'inhale'; }
    };
    run();
    this._nightBreathInterval = setInterval(run, 4000);
  },
  stopNightBreathing: function() {
    this._nightBreathing = false;
    clearInterval(this._nightBreathInterval);
    var btn = document.getElementById('night-breath-btn');
    if (btn) btn.textContent = 'Start breathing';
    var circle = document.getElementById('night-breath');
    if (circle) circle.className = 'night-breath';
    var text = document.getElementById('night-breath-text');
    if (text) text.textContent = 'Tap to begin';
  },
  nextGround: function() {
    this._groundStep++;
    if (this._groundStep > 4) this._groundStep = 0;
    for (var i = 0; i <= 4; i++) {
      var step = document.getElementById('ngs-' + i);
      if (step) {
        if (i === this._groundStep) step.classList.add('visible');
        else step.classList.remove('visible');
      }
    }
    var btn = document.getElementById('ground-btn');
    if (btn) btn.textContent = this._groundStep === 4 ? 'Start again' : 'Next';
  },
  nextPhrase: function() {
    if (typeof DARK_PHRASES === 'undefined') return;
    this._phraseIndex = (this._phraseIndex + 1) % DARK_PHRASES.length;
    var el = document.getElementById('night-phrase');
    if (!el) return;
    el.classList.remove('visible');
    var idx = this._phraseIndex;
    setTimeout(function() {
      el.textContent = DARK_PHRASES[idx];
      el.classList.add('visible');
    }, 800);
  },

  // === DATA PORTABILITY ===
  countEntries: function() {
    var s = this.state;
    return (s.checkins||[]).length + (s.symptoms||[]).length + (s.medications||[]).length +
      (s.appointments||[]).length + (s.gooddays||[]).length + (s.journal||[]).length +
      (s.doctorQuestions||[]).length + (s.handoffs||[]).length;
  },
  getDateRange: function() {
    var dates = [];
    var collections = ['checkins','symptoms','medications','appointments','gooddays','journal','handoffs'];
    for (var c = 0; c < collections.length; c++) {
      var arr = this.state[collections[c]] || [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].date) dates.push(arr[i].date);
      }
    }
    if (!dates.length) return null;
    dates.sort();
    return { earliest: dates[0].slice(0,10), latest: dates[dates.length-1].slice(0,10) };
  },
  getCategories: function() {
    var cats = [];
    var s = this.state;
    if ((s.checkins||[]).length) cats.push('mood');
    if ((s.symptoms||[]).length) cats.push('symptoms');
    if ((s.medications||[]).length) cats.push('medication');
    if ((s.appointments||[]).length) cats.push('appointments');
    if ((s.gooddays||[]).length) cats.push('gooddays');
    if ((s.journal||[]).length) cats.push('journal');
    if ((s.doctorQuestions||[]).length) cats.push('questions');
    if ((s.handoffs||[]).length) cats.push('handoffs');
    return cats;
  },
  exportPlainJSON: function() {
    var total = this.countEntries();
    var range = this.getDateRange();
    var envelope = {
      app: 'BesideYou',
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportVersion: 1,
      summary: {
        totalEntries: total,
        dateRange: range || { earliest: null, latest: null },
        categories: this.getCategories()
      },
      data: JSON.parse(JSON.stringify(this.state))
    };
    var json = JSON.stringify(envelope, null, 2);
    var blob = new Blob([json], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'besideyou-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    // Track export for nudge
    try {
      localStorage.setItem('besideyou_lastExport', new Date().toISOString());
      localStorage.setItem('besideyou_entriesAtLastExport', String(total));
    } catch(e) {}
    this.toast('Backup saved \u2713');
    this.updateNudge();
  },
  triggerImportFile: function() {
    document.getElementById('import-json-file').click();
  },
  handleImportFile: function(event) {
    var self = this;
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function() {
      try {
        var parsed = JSON.parse(reader.result);
        if (parsed.app !== 'BesideYou' || !parsed.exportVersion) {
          self.toast("This doesn\u2019t look like a BesideYou backup file.");
          return;
        }
        self._pendingImport = parsed;
        // Show confirmation panel
        var total = parsed.summary ? parsed.summary.totalEntries : '?';
        var range = parsed.summary && parsed.summary.dateRange ? parsed.summary.dateRange : {};
        var earliest = range.earliest || 'unknown';
        var latest = range.latest || 'unknown';
        document.getElementById('import-confirm-summary').textContent =
          'This file contains ' + total + ' entries from ' + earliest + ' to ' + latest + '.';
        document.getElementById('import-confirm-panel').style.display = 'block';
      } catch(e) {
        self.toast("This doesn\u2019t look like a BesideYou backup file.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },
  importReplace: function() {
    if (!this._pendingImport || !this._pendingImport.data) return;
    var imported = this._pendingImport.data;
    // Clear and replace
    this.state = Object.assign({}, {
      role:null, theme:'dark', onboarded:false, dismissedWelcome:[],
      checkins:[], symptoms:[], medications:[], appointments:[],
      gooddays:[], journal:[], doctorQuestions:[], handoffs:[]
    }, imported);
    this.save();
    this._pendingImport = null;
    document.getElementById('import-confirm-panel').style.display = 'none';
    this.toast('Restored ' + this.countEntries() + ' entries \u2713');
    // Re-init the view
    if (this.state.theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-btn').textContent = this.state.theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    if (this.state.onboarded && this.state.role) this.go('screen-home');
    this.renderAll();
    this.updateNudge();
    this.updateFreshVisit();
  },
  importMerge: function() {
    if (!this._pendingImport || !this._pendingImport.data) return;
    var imported = this._pendingImport.data;
    var merged = 0;
    var collections = ['checkins','symptoms','medications','appointments','gooddays','journal','doctorQuestions','handoffs'];
    for (var c = 0; c < collections.length; c++) {
      var key = collections[c];
      var existing = this.state[key] || [];
      var incoming = imported[key] || [];
      // Build set of existing IDs
      var existingIds = {};
      for (var i = 0; i < existing.length; i++) existingIds[existing[i].id] = true;
      for (var j = 0; j < incoming.length; j++) {
        if (!existingIds[incoming[j].id]) {
          existing.push(incoming[j]);
          merged++;
        }
      }
      // Sort by date descending if date exists
      existing.sort(function(a,b) {
        if (!a.date || !b.date) return 0;
        return new Date(b.date) - new Date(a.date);
      });
      this.state[key] = existing;
    }
    // Merge simple fields if not set
    if (!this.state.role && imported.role) this.state.role = imported.role;
    if (!this.state.onboarded && imported.onboarded) this.state.onboarded = imported.onboarded;
    this.save();
    this._pendingImport = null;
    document.getElementById('import-confirm-panel').style.display = 'none';
    this.toast('Added ' + merged + ' new entries \u2713');
    if (this.state.onboarded && this.state.role) this.go('screen-home');
    this.renderAll();
    this.updateNudge();
    this.updateFreshVisit();
  },
  importCancel: function() {
    this._pendingImport = null;
    document.getElementById('import-confirm-panel').style.display = 'none';
  },
  clearAllData: function() {
    if (this._clearStep === 0) {
      this._clearStep = 1;
      document.getElementById('clear-confirm').style.display = 'block';
      return;
    }
  },
  clearConfirm: function() {
    // Remove all BesideYou localStorage
    try {
      localStorage.removeItem('besideyou');
      localStorage.removeItem('besideyou_lastExport');
      localStorage.removeItem('besideyou_entriesAtLastExport');
    } catch(e) {}
    this._clearStep = 0;
    document.getElementById('clear-confirm').style.display = 'none';
    this.toast('All data cleared');
    // Reset state and reload view
    this.state = { role:null, theme:'dark', onboarded:false, dismissedWelcome:[], checkins:[], symptoms:[], medications:[], appointments:[], gooddays:[], journal:[], doctorQuestions:[], handoffs:[] };
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-btn').textContent = '\uD83C\uDF19';
    this.go('screen-welcome');
    document.getElementById('bottom-nav').style.display = 'none';
    this.renderAll();
    this.updateFreshVisit();
  },
  clearCancel: function() {
    this._clearStep = 0;
    document.getElementById('clear-confirm').style.display = 'none';
  },
  // Backup nudge
  shouldShowNudge: function() {
    var total = this.countEntries();
    if (total <= 5) return false;
    var lastExport = null;
    try { lastExport = localStorage.getItem('besideyou_lastExport'); } catch(e) {}
    if (!lastExport) return true; // Never exported
    var atExport = 0;
    try { atExport = parseInt(localStorage.getItem('besideyou_entriesAtLastExport') || '0', 10); } catch(e) {}
    return (total - atExport) >= 10;
  },
  updateNudge: function() {
    var nudge = document.getElementById('backup-nudge');
    if (!nudge) return;
    if (this.shouldShowNudge()) {
      var total = this.countEntries();
      document.getElementById('nudge-count').textContent = total;
      nudge.style.display = 'flex';
    } else {
      nudge.style.display = 'none';
    }
  },
  // Fresh visit
  updateFreshVisit: function() {
    var el = document.getElementById('fresh-visit');
    if (!el) return;
    var total = this.countEntries();
    el.style.display = (total === 0) ? 'block' : 'none';
  },

  renderAll: function() {
    this.renderSymptoms(); this.renderMeds(); this.renderAppts(); this.renderDQ();
    this.renderGoodDays(); this.renderJournal(); this.renderGlossary(); this.renderResources(); this.renderHandoffs();
  },

  toast: function(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2500);
  },

  esc: function(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; },
  fmtDate: function(iso) {
    try { var d = new Date(iso); return d.toLocaleDateString('en-AU', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}); } catch(e) { return iso; }
  },
  fmtDateShort: function(ds) {
    try { var d = new Date(ds + 'T00:00:00'); return d.toLocaleDateString('en-AU', {weekday: 'short', day: 'numeric', month: 'short'}); } catch(e) { return ds; }
  }
};

// ===== EVENT DELEGATION =====
// Manual DOM traversal — does NOT use Element.closest() for max compatibility.

// Walk up from el to find an ancestor (or self) with the given attribute
function _up(el, attr) {
  while (el && el.nodeType === 1) {
    if (el.hasAttribute && el.hasAttribute(attr)) return el;
    el = el.parentElement;
  }
  return null;
}

document.addEventListener('click', function(e) {
  try {
    var t = e.target;
    var el;

    el = _up(t, 'data-wp-dismiss');
    if (el) { App.dismissWelcome(el.getAttribute('data-wp-dismiss')); return; }

    el = _up(t, 'data-wp-show');
    if (el) { App.showWelcome(el.getAttribute('data-wp-show')); return; }

    el = _up(t, 'data-go');
    if (el) { App.go(el.getAttribute('data-go')); return; }

    el = _up(t, 'data-role');
    if (el) { App.setRole(el.getAttribute('data-role')); return; }

    el = _up(t, 'data-nav');
    if (el) { App.nav(el.getAttribute('data-nav')); return; }

    el = _up(t, 'data-mood');
    if (el) { App.pickMood(el); return; }

    el = _up(t, 'data-toggle');
    if (el) { el.classList.toggle('active'); return; }

    el = _up(t, 'data-toggle-open');
    if (el) { el.classList.toggle('open'); return; }

    el = _up(t, 'data-modal');
    if (el) { App.openModal(el.getAttribute('data-modal')); return; }

    el = _up(t, 'data-close');
    if (el) { App.closeModal(el.getAttribute('data-close')); return; }

    el = _up(t, 'data-action');
    if (el) {
      var action = el.getAttribute('data-action');
      if (typeof App[action] === 'function') App[action]();
      return;
    }

    el = _up(t, 'data-sym');
    if (el) { App.pickSymType(el); return; }

    el = _up(t, 'data-gcat');
    if (el) { App.filterGlossaryCat(el, el.getAttribute('data-gcat')); return; }

    el = _up(t, 'data-rcat');
    if (el) { App.filterRes(el, el.getAttribute('data-rcat')); return; }

    el = _up(t, 'data-trigger');
    if (el) { document.getElementById(el.getAttribute('data-trigger')).click(); return; }

    el = _up(t, 'data-del');
    if (el) {
      var parts = el.getAttribute('data-del').split(':');
      App.del(parts[0], parseInt(parts[1], 10));
      return;
    }

    el = _up(t, 'data-dq');
    if (el) { App.toggleDQ(parseInt(el.getAttribute('data-dq'), 10)); return; }
  } catch(err) {
    // Show error visually so user can report it
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#d94444;color:#fff;padding:12px;z-index:99999;font-size:13px;text-align:center';
    d.textContent = 'Error: ' + err.message;
    document.body.appendChild(d);
    setTimeout(function() { if (d.parentNode) d.parentNode.removeChild(d); }, 5000);
  }
});

// Non-click events
document.getElementById('import-file').addEventListener('change', function(e) { App.importData(e); });
document.getElementById('import-json-file').addEventListener('change', function(e) { App.handleImportFile(e); });
document.getElementById('glossary-search').addEventListener('input', function() { App.filterGlossary(); });

// Init
App.init();
