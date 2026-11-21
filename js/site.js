/* JRishiCPAs · shared site behaviour
   Mobile menu, header state, scroll reveals, CRA deadline countdown,
   document checklists, tabs, FAQ accordion, and the 3-step booking form.
   Every feature checks its markup exists, so pages can use any subset. */
(function () {
  'use strict';

  // ---------- Booking settings: edit these two lines ----------
  // BOOKING_URL: your scheduling page, e.g. 'https://calendly.com/your-name/free-consultation'.
  // While it is empty, finished requests open an email to CONTACT_EMAIL instead.
  var BOOKING_URL = '';
  var CONTACT_EMAIL = 'hello@example.com';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // ---------- Mobile menu ----------
  var toggle = $('.nav-toggle');
  var nav = $('#site-nav');
  if (toggle && nav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) { if (mq.matches) setNav(false); });
  }

  // ---------- Header state on scroll ----------
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Scroll reveals ----------
  // Elements with data-reveal fade in once; siblings inside [data-stagger] cascade.
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('anim');
    $$('[data-stagger]').forEach(function (group) {
      $$('[data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--rd', (i % 6) * 90 + 'ms'); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  // ---------- Count-up numbers ----------
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var fmt = function (v) { return prefix + Math.round(v).toLocaleString('en-CA'); };
    if (reduce || !('IntersectionObserver' in window)) { el.textContent = fmt(end); return; }
    el.textContent = fmt(0);
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), dur = 1400;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.6 });
    o.observe(el);
  });

  // ---------- CRA deadlines ----------
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var next = null;
  $$('[data-deadlines] [data-date]').forEach(function (li) {
    var p = li.getAttribute('data-date').split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    if (d < today) li.classList.add('is-past');
    else if (!next || d < next.date) { next = { el: li, date: d }; }
  });
  if (next) {
    next.el.classList.add('is-next');
    var days = Math.round((next.date - today) / 86400000);
    var label = next.date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
    var short = next.date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    $$('[data-next-days]').forEach(function (el) { el.textContent = days; });
    $$('[data-next-unit]').forEach(function (el) { el.textContent = days === 1 ? 'day' : 'days'; });
    $$('[data-next-date]').forEach(function (el) { el.textContent = label; });
    $$('[data-next-short]').forEach(function (el) { el.textContent = short; });
    $$('[data-next-what]').forEach(function (el) { el.textContent = next.el.getAttribute('data-short'); });
  } else {
    $$('[data-next-wrap]').forEach(function (el) { el.hidden = true; });
  }

  // ---------- Tabs ----------
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach(function (t, i) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on) list.setAttribute('data-active', String(i));
    });
    if (focus) tab.focus();
  }
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); selectTab(n, true); }
      });
    });
  });

  // ---------- Document checklists ----------
  $$('.checklist').forEach(function (list) {
    var boxes = $$('input[type="checkbox"]', list);
    var update = function () {
      var done = boxes.filter(function (b) { return b.checked; }).length;
      var pct = boxes.length ? done / boxes.length : 0;
      $$('[data-cl-done]', list).forEach(function (el) { el.textContent = done; });
      $$('[data-cl-total]', list).forEach(function (el) { el.textContent = boxes.length; });
      $$('[data-cl-bar]', list).forEach(function (el) { el.style.width = (pct * 100) + '%'; });
      $$('[data-cl-pct]', list).forEach(function (el) { el.textContent = Math.round(pct * 100) + '%'; });
      list.classList.toggle('complete', boxes.length > 0 && done === boxes.length);
    };
    list.addEventListener('change', update);
    update();
  });

  // ---------- FAQ accordion ----------
  $$('.acc-item').forEach(function (item) {
    var btn = $('.acc-trigger', item);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // ---------- Booking form (3 steps) ----------
  var SERVICES = {
    personal: 'Personal tax returns', selfemp: 'Self-employed & small business tax', corp: 'Corporate tax & year-end',
    books: 'Bookkeeping', payroll: 'Payroll', setup: 'Business set-up & incorporation', planning: 'Tax planning',
    cra: 'CRA support & catch-up filing', cfo: 'Advisory & fractional CFO'
  };
  var OPTION_SERVICES = {
    employment: ['personal'], investments: ['personal', 'planning'], student: ['personal'], newcomer: ['personal'],
    rental: ['personal', 'planning'], selfemployed: ['selfemp'], sold: ['personal', 'planning'], behind: ['cra'],
    soleprop: ['selfemp'], corp: ['corp'], planning: ['setup'], books: ['books'], gst: ['selfemp'],
    payroll: ['payroll'], cfo: ['cfo'], cra: ['cra']
  };
  var form = $('#intake');
  if (form) {
    var success = $('#intake-success');
    var steps = $$('.step', form);
    var fill = $('.progress-fill', form);
    var track = $('.progress-track', form);
    var planNote = $('#plan-note');
    var current = 1, chosenPlan = '';

    var clientType = function () { var r = $('input[name="clientType"]:checked', form); return r ? r.value : ''; };
    var checked = function (name) { return $$('input[name="' + name + '"]:checked', form).map(function (c) { return c.value; }); };
    var suggestion = function () {
      var type = clientType(), picks = [];
      if (type === 'personal' || type === 'both') picks = picks.concat(checked('personal'));
      if (type === 'business' || type === 'both') picks = picks.concat(checked('business'));
      var keys = [];
      picks.forEach(function (v) { (OPTION_SERVICES[v] || []).forEach(function (k) { if (keys.indexOf(k) === -1) keys.push(k); }); });
      var order = Object.keys(SERVICES);
      keys.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
      return keys.map(function (k) { return SERVICES[k]; }).join(' · ');
    };
    var setError = function (id, msg) { var el = document.getElementById(id); if (el) el.textContent = msg; };
    var updateFit = function () { var f = $('#fit-result'); if (f) f.textContent = suggestion() || 'Select what applies to see the matching services'; };
    var updateGroups = function () {
      var type = clientType();
      $$('.check-group', form).forEach(function (g) { g.hidden = !(type === 'both' || type === g.getAttribute('data-group')); });
      updateFit();
    };
    var showStep = function (n, focus) {
      current = n;
      steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      var step = steps[n - 1];
      $('#step-label').textContent = 'Step ' + n + ' of ' + steps.length;
      $('#step-name').textContent = step.getAttribute('data-name');
      fill.style.width = (n / steps.length * 100) + '%';
      track.setAttribute('aria-valuenow', String(n));
      if (focus) $('.step-title', step).focus();
    };
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phonePattern = /^[+()\-.\s\d]{7,20}$/;
    var rules = {
      name: function (v) { return !v ? 'Please enter your name.' : (v.length < 2 ? 'Name must be at least 2 characters.' : ''); },
      email: function (v) { return !v ? 'Please enter your email address.' : (!emailPattern.test(v) ? 'Enter a valid email, for example name@example.com.' : ''); },
      phone: function (v) { return v && !phonePattern.test(v) ? 'Enter a valid phone number, for example (555) 010-0000.' : ''; }
    };
    var validateField = function (input) {
      var msg = rules[input.name](input.value.trim());
      input.closest('.field').classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      setError(input.name + '-error', msg);
      return !msg;
    };
    var validateStep = function (n) {
      if (n === 1) {
        var ok = !!clientType();
        setError('clientType-error', ok ? '' : 'Please choose who this is for.');
        if (!ok) $('input[name="clientType"]', form).focus();
        return ok;
      }
      if (n === 2) {
        var ok2 = !!suggestion();
        setError('situation-error', ok2 ? '' : 'Select at least one option that applies to you.');
        return ok2;
      }
      var first = null;
      Object.keys(rules).forEach(function (name) { var input = form.elements[name]; if (!validateField(input) && !first) first = input; });
      if (first) first.focus();
      return !first;
    };

    $$('input[name="clientType"]', form).forEach(function (r) { r.addEventListener('change', function () { setError('clientType-error', ''); updateGroups(); }); });
    $$('.check-group input', form).forEach(function (c) { c.addEventListener('change', function () { setError('situation-error', ''); updateFit(); }); });
    $$('[data-next]', form).forEach(function (b) { b.addEventListener('click', function () { if (validateStep(current)) showStep(current + 1, true); }); });
    $$('[data-back]', form).forEach(function (b) { b.addEventListener('click', function () { showStep(current - 1, true); }); });
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener('blur', function () { if (input.value.trim() || input.closest('.field').classList.contains('invalid')) validateField(input); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('invalid')) validateField(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (current !== steps.length) { if (validateStep(current)) showStep(current + 1, true); return; }
      if (!validateStep(3)) return;
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var firstName = name.split(/\s+/)[0];
      var services = suggestion() || chosenPlan;
      var summary = [
        'Client type: ' + (clientType() || 'not given'),
        'Services: ' + (services || 'not sure yet'),
        'Phone: ' + (form.elements.phone.value.trim() || 'not given'),
        'Province: ' + (form.elements.province.value || 'not given'),
        'Notes: ' + (form.elements.message.value.trim() || 'none')
      ].join('\n');
      var link = $('#booking-link');
      $('#success-title').textContent = 'Thanks, ' + firstName + '! One last step.';
      if (BOOKING_URL) {
        var sep = BOOKING_URL.indexOf('?') === -1 ? '?' : '&';
        link.href = BOOKING_URL + sep + 'name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&a1=' + encodeURIComponent(summary);
        link.setAttribute('target', '_blank');
        link.innerHTML = 'Choose your time <span aria-hidden="true">→</span>';
        $('#success-text').textContent = 'Pick a time for your free 20-minute call' + (services ? ' about ' + services : '') + '. Your details are already filled in.';
      } else {
        link.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Free consultation request: ' + name) +
          '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n' + summary + '\n\nPlease suggest a few times for my free 20-minute call.');
        link.removeAttribute('target');
        link.innerHTML = 'Send my request <span aria-hidden="true">→</span>';
        $('#success-text').textContent = 'Send your request and we’ll reply to ' + email + ' with times for your free 20-minute call' + (services ? ' about ' + services : '') + '.';
      }
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    $('#intake-reset').addEventListener('click', function () {
      form.reset();
      chosenPlan = '';
      if (planNote) planNote.hidden = true;
      $$('.field', form).forEach(function (f) { f.classList.remove('invalid'); });
      $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
      $$('.error', form).forEach(function (el) { el.textContent = ''; });
      updateGroups();
      showStep(1);
      success.hidden = true;
      form.hidden = false;
      $('.step-title', steps[0]).focus();
    });

    // Any button with data-plan pre-fills the form ("Book this service")
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-plan]');
      if (!btn) return;
      chosenPlan = btn.getAttribute('data-plan');
      var type = btn.getAttribute('data-type');
      var radio = type ? $('input[name="clientType"][value="' + type + '"]', form) : null;
      if (radio) radio.checked = true;
      setError('clientType-error', '');
      updateGroups();
      if (planNote && chosenPlan) { planNote.textContent = 'You’re asking about: ' + chosenPlan + '.'; planNote.hidden = false; }
      if (!form.hidden) showStep(clientType() ? 2 : 1);
    });

    updateGroups();
    showStep(1);
  }

  // ---------- Hide the phone call bar while booking is on screen ----------
  var mobileCta = $('.mobile-cta');
  var book = $('#book');
  if (mobileCta && book && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { mobileCta.classList.toggle('is-hidden', en[0].isIntersecting); }, { threshold: 0.15 }).observe(book);
  }

  // ---------- Footer year, today's date ----------
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$('[data-today]').forEach(function (el) {
    el.textContent = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });
})();
