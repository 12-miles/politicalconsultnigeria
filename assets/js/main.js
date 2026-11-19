(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu */
  var mb=document.getElementById('menubtn'), nl=document.getElementById('navlinks');
  mb.addEventListener('click',function(){
    var open=nl.classList.toggle('open');
    mb.setAttribute('aria-expanded',open?'true':'false');
    mb.textContent=open?'Close':'Menu';
  });
  nl.addEventListener('click',function(e){
    if(e.target.tagName==='A'){nl.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.textContent='Menu';}
  });

  /* signature: structure lattice */
  var SVGNS='http://www.w3.org/2000/svg';
  var tiers=[
    {y:38,  n:1,  r:6,   label:'State / apex',        count:'1'},
    {y:118, n:3,  r:4.6, label:'Local government',    count:'3'},
    {y:198, n:8,  r:3.4, label:'Ward',                count:'8'},
    {y:270, n:20, r:2.2, label:'Polling unit',        count:'20+'}
  ];
  var W=420, padX=42, lines=document.getElementById('latlines'),
      nodes=document.getElementById('latnodes'), labels=document.getElementById('latlabels');
  function xs(n){
    if(n===1) return [W/2];
    var a=[],span=W-padX*2;
    for(var i=0;i<n;i++) a.push(padX+span*(i/(n-1)));
    return a;
  }
  var pts=tiers.map(function(t){return xs(t.n);});
  var order=[];
  tiers.forEach(function(t,ti){
    if(ti>0){
      pts[ti].forEach(function(x){
        var parent=pts[ti-1].reduce(function(p,c){return Math.abs(c-x)<Math.abs(p-x)?c:p;});
        var ln=document.createElementNS(SVGNS,'line');
        ln.setAttribute('x1',parent);ln.setAttribute('y1',tiers[ti-1].y);
        ln.setAttribute('x2',x);ln.setAttribute('y2',t.y);
        ln.setAttribute('class','lat-line');
        if(!reduce){ln.style.opacity='0';ln.style.transition='opacity .5s ease';}
        lines.appendChild(ln);order.push({el:ln,tier:ti});
      });
    }
    pts[ti].forEach(function(x){
      var c=document.createElementNS(SVGNS,'circle');
      c.setAttribute('cx',x);c.setAttribute('cy',t.y);c.setAttribute('r',t.r);
      c.setAttribute('class','lat-node tier-'+(ti+1));
      if(!reduce){c.style.opacity='0';c.style.transition='opacity .45s ease, transform .45s ease';}
      nodes.appendChild(c);order.push({el:c,tier:ti});
    });
    var lb=document.createElementNS(SVGNS,'text');
    lb.setAttribute('x',6);lb.setAttribute('y',t.y-13);lb.setAttribute('class','lat-label');
    lb.textContent=t.label;labels.appendChild(lb);
    var ct=document.createElementNS(SVGNS,'text');
    ct.setAttribute('x',W-4);ct.setAttribute('y',t.y-13);ct.setAttribute('text-anchor','end');
    ct.setAttribute('class','lat-count');ct.textContent=t.count;labels.appendChild(ct);
    if(!reduce){[lb,ct].forEach(function(e){e.style.opacity='0';e.style.transition='opacity .5s ease';order.push({el:e,tier:ti});});}
  });
  if(!reduce){
    /* build from the unit upward, the way the firm says structures are built */
    var byTier=[3,2,1,0];
    byTier.forEach(function(tier,i){
      setTimeout(function(){
        order.filter(function(o){return o.tier===tier;}).forEach(function(o,j){
          setTimeout(function(){o.el.style.opacity='';},j*22);
        });
      }, 260 + i*420);
    });
  }

  /* reveals */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} });
    },{threshold:.16,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.rv, #myth').forEach(function(el,i){
      el.style.transitionDelay=(Math.min(i%3,2)*70)+'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.rv, #myth').forEach(function(el){el.classList.add('is-in');});
  }

  /* consultation form */
  var f={name:'f-name',phone:'f-phone',email:'f-email',org:'f-org',svc:'f-svc',msg:'f-msg'};
  function wrapOf(id){return document.getElementById(id).closest('.field');}
  Object.keys(f).forEach(function(k){
    var el=document.getElementById(f[k]);
    el.addEventListener('input',function(){wrapOf(f[k]).classList.remove('err');});
    el.addEventListener('change',function(){wrapOf(f[k]).classList.remove('err');});
  });
  document.getElementById('submit').addEventListener('click',function(){
    var v={},bad=[];
    Object.keys(f).forEach(function(k){v[k]=document.getElementById(f[k]).value.trim();});
    if(!v.name) bad.push('name');
    if(!v.phone) bad.push('phone');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) bad.push('email');
    if(!v.org) bad.push('org');
    if(!v.svc) bad.push('svc');
    if(v.msg.length<5) bad.push('msg');
    Object.keys(f).forEach(function(k){wrapOf(f[k]).classList.toggle('err',bad.indexOf(k)>-1);});
    var st=document.getElementById('status');
    if(bad.length){
      st.classList.add('show');
      st.textContent='Check the highlighted fields, then send again.';
      document.getElementById(f[bad[0]]).focus();
      return;
    }
    var body=[
      'Full name: '+v.name,
      'Phone: '+v.phone,
      'Email: '+v.email,
      'Organisation / platform: '+v.org,
      'Service needed: '+v.svc,
      '',
      'Consultation needs:',
      v.msg
    ].join('\n');
    st.classList.add('show');
    st.textContent='Opening your email app with the request ready to send.';
    window.location.href='mailto:Solutionsstauts@gmail.com'
      +'?subject='+encodeURIComponent('Consultation request — '+v.name+' ('+v.svc+')')
      +'&body='+encodeURIComponent(body);
  });

  /* current year */
  var y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();
})();
