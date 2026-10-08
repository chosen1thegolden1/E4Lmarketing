/* E4L site behaviour: nav, Malik, Ask Malik, forms, calendar links. */
(function(){
  var root=document.querySelector('.e4l'); if(!root) return;
  var C=window.E4L_CONFIG||{};
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function talk(m,ms){ m.classList.add('talk'); clearTimeout(m._t); m._t=setTimeout(function(){m.classList.remove('talk');},ms||3200); }

  /* mobile nav */
  var burger=root.querySelector('.burger'), menu=root.querySelector('.nav ul');
  if(burger&&menu){burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false');});}

  /* nav dropdown (touch + keyboard) */
  root.querySelectorAll('.menu-btn').forEach(function(b){
    var m=b.nextElementSibling;
    b.addEventListener('click',function(e){ e.stopPropagation(); var o=!m.classList.contains('open'); m.classList.toggle('open',o); b.setAttribute('aria-expanded',o?'true':'false'); });
    document.addEventListener('click',function(){ m.classList.remove('open'); b.setAttribute('aria-expanded','false'); });
    b.addEventListener('keydown',function(e){ if(e.key==='Escape'){ m.classList.remove('open'); b.setAttribute('aria-expanded','false'); } });
  });

  /* FAQ: Malik comments on whatever you open */
  var fm=root.querySelector('#faq-malik');
  root.querySelectorAll('details.faq').forEach(function(d){
    d.addEventListener('toggle',function(){ if(d.open){ root.querySelectorAll('details.faq[open]').forEach(function(o){ if(o!==d) o.open=false; }); if(fm){ var s=fm.querySelector('.say'); if(s&&d.dataset.say) s.textContent=d.dataset.say; talk(fm,2800); } } });
  });

  /* calendar + email links */
  root.querySelectorAll('[data-cal]').forEach(function(a){ if(C.CALENDAR_URL){a.href=C.CALENDAR_URL;a.target='_blank';a.rel='noopener';} });
  root.querySelectorAll('[data-email]').forEach(function(a){ if(C.EMAIL){a.href='mailto:'+C.EMAIL;a.textContent=a.textContent.trim()||C.EMAIL;} });
  root.querySelectorAll('[data-school]').forEach(function(a){ if(C.SCHOOL_URL){a.href=C.SCHOOL_URL;} });
  root.querySelectorAll('[data-scorecard]').forEach(function(a){ if(C.SCORECARD_URL){a.href=C.SCORECARD_URL;} });

  /* Hero video: play the loop when allowed, otherwise fall back to the still */
  root.querySelectorAll('.malik.video').forEach(function(m){
    var v=m.querySelector('video'); if(!v) return;
    function still(){ m.classList.remove('video'); try{v.pause();}catch(e){} v.remove(); }
    if(reduce){ still(); return; }
    v.addEventListener('error',still);
    var srcs=v.querySelectorAll('source'); if(srcs.length){ srcs[srcs.length-1].addEventListener('error',still); }
    var p=v.play&&v.play(); if(p&&p.catch){ p.catch(function(){ /* autoplay blocked: poster still shows */ }); }
    setTimeout(function(){ if(v.readyState<2 && v.networkState===3) still(); },4000);
  });

  /* Malik: reveal on scroll, say a line when he arrives, say lines on hover */
  var maliks=root.querySelectorAll('.malik');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); if(e.target.dataset.greet!=='no') setTimeout(function(){talk(e.target,3600);},500); io.unobserve(e.target);} });},{threshold:.35});
    maliks.forEach(function(m){io.observe(m);});
  } else { maliks.forEach(function(m){m.classList.add('in');}); }
  maliks.forEach(function(m){ m.addEventListener('click',function(){talk(m,3000);}); });
  /* safety net: never leave Malik hidden if the observer never fires */
  setTimeout(function(){ maliks.forEach(function(m){m.classList.add('in');}); },1500);

  /* Ask Malik glossary */
  var ask=root.querySelector('[data-ask]');
  if(ask){
    var terms=JSON.parse(ask.querySelector('script[type="application/json"]').textContent);
    var chips=ask.querySelector('.chips'), out=ask.querySelector('.answer'), side=ask.querySelector('.malik');
    Object.keys(terms).forEach(function(k,i){
      var b=document.createElement('button'); b.type='button'; b.className='chip'+(i===0?' on':''); b.textContent=k; b.setAttribute('aria-pressed',i===0?'true':'false');
      b.addEventListener('click',function(){ show(k); chips.querySelectorAll('.chip').forEach(function(c){c.classList.remove('on');c.setAttribute('aria-pressed','false');}); b.classList.add('on'); b.setAttribute('aria-pressed','true'); });
      chips.appendChild(b);
    });
    function show(k){ var t=terms[k]; out.innerHTML='<div class="term">'+k+'</div><div class="plain">'+t.plain+'</div><div class="so"><b>Why you care:</b> '+t.so+'</div>'; if(side){ var s=side.querySelector('.say'); if(s){s.textContent=t.say||'Pick a term.';} talk(side,2600);} }
    show(Object.keys(terms)[0]);
  }

  /* forms -> GHL inbound webhook */
  root.querySelectorAll('form[data-webhook]').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var msg=f.querySelector('.msg'), btn=f.querySelector('button[type="submit"]');
      var url=C[f.dataset.webhook]||'';
      var data={}; new FormData(f).forEach(function(v,k){data[k]=v;});
      data.source=f.dataset.source||'website'; data.page=location.pathname; data.submitted_at=new Date().toISOString();
      if(!data.email||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)){ msg.className='msg err'; msg.textContent='Add a real email so we can send it to you.'; return; }
      if(!url){ msg.className='msg err'; msg.textContent='This form is not wired yet (webhook URL missing). Email us instead: '+(C.EMAIL||''); return; }
      btn.disabled=true; var old=btn.textContent; btn.textContent='Sending…';
      fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
        .then(function(r){ if(!r.ok) throw new Error(r.status); msg.className='msg ok'; msg.textContent=f.dataset.ok||'Got it. Check your inbox.'; f.reset(); var m=f.closest('section')&&f.closest('section').querySelector('.malik'); if(m){var s=m.querySelector('.say'); if(s) s.textContent='Received. A real person will follow up.'; talk(m,3000);} if(f.dataset.next){ setTimeout(function(){location.href=f.dataset.next;},900); } })
        .catch(function(){ msg.className='msg err'; msg.textContent='That didn\'t go through. Try again or email '+(C.EMAIL||'us')+'.'; })
        .finally(function(){ btn.disabled=false; btn.textContent=old; });
    });
  });

  /* booking embed */
  var emb=root.querySelector('[data-cal-embed]');
  if(emb){ if(C.CALENDAR_EMBED_URL){ var fr=document.createElement('iframe'); fr.src=C.CALENDAR_EMBED_URL; fr.title='Book a Game Plan Call'; fr.setAttribute('loading','lazy'); emb.innerHTML=''; emb.appendChild(fr); } }

  /* year */
  root.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear();});
})();
