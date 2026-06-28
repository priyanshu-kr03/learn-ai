// ── Storage key ───────────────────────────────────────────────────────────────
function storageKey(id){return 'ai-roadmap-v2:'+id}

// ── Confetti ──────────────────────────────────────────────────────────────────
function launchConfetti(){
  var c=document.getElementById('confetti-cv');
  if(!c){
    c=document.createElement('canvas');c.id='confetti-cv';
    c.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(c);
  }
  var W=c.width=window.innerWidth,H=c.height=window.innerHeight;
  var cx=c.getContext('2d');
  var cols=['#4f46e5','#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#a78bfa','#fbbf24'];
  var pts=[];
  for(var i=0;i<150;i++){
    pts.push({
      x:Math.random()*W, y:Math.random()*-H*0.5-10,
      r:Math.random()*7+3, c:cols[i%cols.length],
      vx:(Math.random()-0.5)*8, vy:Math.random()*3+1,
      sp:(Math.random()-0.5)*0.3, ang:Math.random()*6.28,
      wide:Math.random()>0.45, a:1
    });
  }
  var raf;
  function tick(){
    cx.clearRect(0,0,W,H);
    var live=false;
    pts.forEach(function(p){
      if(p.a<=0)return; live=true;
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.13; p.ang+=p.sp;
      if(p.y>H*0.7) p.a=Math.max(0,p.a-0.022);
      cx.save(); cx.globalAlpha=p.a; cx.fillStyle=p.c;
      cx.translate(p.x,p.y); cx.rotate(p.ang);
      if(p.wide) cx.fillRect(-p.r,-p.r*0.4,p.r*2,p.r*0.8);
      else{cx.beginPath();cx.arc(0,0,p.r*0.6,0,6.28);cx.fill();}
      cx.restore();
    });
    if(live) raf=requestAnimationFrame(tick);
  }
  tick();
  setTimeout(function(){cancelAnimationFrame(raf);cx.clearRect(0,0,W,H);},5000);
}

// ── Global completion ─────────────────────────────────────────────────────────
var TOTAL_TOPICS=486;
function countDone(){
  var n=0;
  for(var i=0;i<localStorage.length;i++){
    var k=localStorage.key(i);
    if(k&&k.startsWith('ai-roadmap-v2:')&&localStorage.getItem(k)==='1')n++;
  }
  return n;
}

// ── Certificate helpers ───────────────────────────────────────────────────────
function rrect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
function fitText(ctx,text,maxW,font){
  var size=parseInt(font);
  ctx.font=font;
  while(ctx.measureText(text).width>maxW&&size>18){
    size--;ctx.font=font.replace(/\d+px/,size+'px');
  }
}

// ── Certificate generation ────────────────────────────────────────────────────
function generateCert(){
  var name=(document.getElementById('cert-name').value||'Learner').trim();
  var company=(document.getElementById('cert-company').value||'').trim();
  var date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  var cv=document.getElementById('cert-cv');
  var W=1200,H=840;cv.width=W;cv.height=H;
  var ctx=cv.getContext('2d');

  // Clip to rounded corners (PNG has transparent corners = matches display)
  ctx.clearRect(0,0,W,H);
  rrect(ctx,0,0,W,H,18);ctx.clip();

  // Light warm background
  var bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#fdfcff');bg.addColorStop(1,'#f4f2ff');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  // Very soft top tint
  var gl=ctx.createRadialGradient(W/2,0,0,W/2,0,H*0.55);
  gl.addColorStop(0,'rgba(124,58,237,0.06)');gl.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gl;ctx.fillRect(0,0,W,H);

  // Outer border — gradient purple
  var bd=ctx.createLinearGradient(0,0,W,H);
  bd.addColorStop(0,'#7c3aed');bd.addColorStop(0.5,'#4f46e5');bd.addColorStop(1,'#7c3aed');
  ctx.save();ctx.strokeStyle=bd;ctx.lineWidth=2.5;rrect(ctx,14,14,W-28,H-28,16);ctx.stroke();ctx.restore();

  // Inner decorative border
  ctx.save();ctx.strokeStyle='rgba(124,58,237,0.12)';ctx.lineWidth=1;rrect(ctx,26,26,W-52,H-52,10);ctx.stroke();ctx.restore();

  // Corner brackets
  [[[44,44],[W-44,44],[44,H-44],[W-44,H-44]]].forEach(function(corners){
    corners.forEach(function(pt){
      for(var a=0;a<4;a++){
        ctx.save();ctx.strokeStyle='rgba(124,58,237,0.4)';ctx.lineWidth=2;
        ctx.translate(pt[0],pt[1]);ctx.rotate(a*1.5708);
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,0);ctx.stroke();
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,18);ctx.stroke();
        ctx.restore();
      }
    });
  });

  // Decorative top dots
  for(var d=0;d<5;d++){
    ctx.beginPath();ctx.arc(W/2-40+d*20,62,d===2?4:2.5,0,6.28);
    ctx.fillStyle=d===2?'#7c3aed':'rgba(124,58,237,0.3)';ctx.fill();
  }

  // Brand
  ctx.textAlign='center';
  ctx.font='800 20px Inter,Arial,sans-serif';
  ctx.fillStyle='#4f46e5';
  ctx.fillText('AI ROADMAP',W/2,104);

  // Separator
  var sep=ctx.createLinearGradient(W/2-130,0,W/2+130,0);
  sep.addColorStop(0,'rgba(124,58,237,0)');sep.addColorStop(0.5,'rgba(124,58,237,0.35)');sep.addColorStop(1,'rgba(124,58,237,0)');
  ctx.strokeStyle=sep;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(W/2-130,118);ctx.lineTo(W/2+130,118);ctx.stroke();

  // "Certificate of Completion"
  ctx.font='600 14px Inter,Arial,sans-serif';
  ctx.fillStyle='rgba(79,70,229,0.6)';
  ctx.fillText('C E R T I F I C A T E   O F   C O M P L E T I O N',W/2,158);

  // "This certifies that"
  ctx.font='300 17px Inter,Arial,sans-serif';
  ctx.fillStyle='#64748b';
  ctx.fillText('This certifies that',W/2,218);

  // Name — dark gradient, large serif
  ctx.save();
  var ng=ctx.createLinearGradient(W/2-320,0,W/2+320,0);
  ng.addColorStop(0,'#1e1b4b');ng.addColorStop(0.5,'#4f46e5');ng.addColorStop(1,'#6d28d9');
  ctx.fillStyle=ng;
  ctx.font='700 62px Georgia,"Times New Roman",serif';
  fitText(ctx,name,920,'700 62px Georgia,"Times New Roman",serif');
  ctx.fillText(name,W/2,292);
  ctx.restore();

  // Underline below name
  var ul=ctx.createLinearGradient(W/2-180,0,W/2+180,0);
  ul.addColorStop(0,'rgba(79,70,229,0)');ul.addColorStop(0.5,'rgba(79,70,229,0.5)');ul.addColorStop(1,'rgba(79,70,229,0)');
  ctx.strokeStyle=ul;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(W/2-180,304);ctx.lineTo(W/2+180,304);ctx.stroke();

  // Company
  if(company){
    ctx.font='500 18px Inter,Arial,sans-serif';
    ctx.fillStyle='#7c3aed';
    ctx.fillText(company,W/2,336);
  }

  // Separator
  ctx.strokeStyle=sep;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(W/2-220,company?366:350);ctx.lineTo(W/2+220,company?366:350);ctx.stroke();

  // "has successfully completed"
  ctx.font='300 17px Inter,Arial,sans-serif';
  ctx.fillStyle='#64748b';
  ctx.fillText('has successfully completed',W/2,company?406:388);

  var yOff=company?0:-18;

  // Course name
  ctx.font='700 33px Inter,Arial,sans-serif';
  ctx.fillStyle='#1e1b4b';
  ctx.fillText('AI From Scratch to Advanced',W/2,448+yOff);

  ctx.font='400 14px Inter,Arial,sans-serif';
  ctx.fillStyle='#94a3b8';
  ctx.fillText('A comprehensive curriculum covering the full AI/ML engineering path',W/2,474+yOff);

  // Stats boxes
  var stats=[{n:'486',l:'Topics Covered'},{n:'44',l:'Chapters Completed'},{n:'6-12mo',l:'Full Curriculum'}];
  var bw=155,bh=72,gap=20,bx=W/2-(bw*3+gap*2)/2;
  stats.forEach(function(s,i){
    var cx2=bx+i*(bw+gap);
    ctx.save();
    ctx.fillStyle='rgba(79,70,229,0.06)';
    ctx.strokeStyle='rgba(79,70,229,0.18)';ctx.lineWidth=1;
    rrect(ctx,cx2,504+yOff,bw,bh,10);ctx.fill();ctx.stroke();
    ctx.restore();
    ctx.font='700 26px Inter,Arial,sans-serif';
    ctx.fillStyle='#4f46e5';ctx.textAlign='center';
    ctx.fillText(s.n,cx2+bw/2,539+yOff);
    ctx.font='400 12px Inter,Arial,sans-serif';
    ctx.fillStyle='#94a3b8';
    ctx.fillText(s.l,cx2+bw/2,558+yOff);
  });

  // Bottom separator
  ctx.strokeStyle=sep;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(W/2-260,600+yOff);ctx.lineTo(W/2+260,600+yOff);ctx.stroke();

  // Date
  ctx.textAlign='center';
  ctx.font='400 13px Inter,Arial,sans-serif';
  ctx.fillStyle='#94a3b8';
  ctx.fillText('Issued on '+date,W/2,628+yOff);

  // Bottom dots
  for(var j=0;j<7;j++){
    ctx.beginPath();ctx.arc(W/2-60+j*20,H-48,j===3?3.5:2,0,6.28);
    ctx.fillStyle=j===3?'#7c3aed':'rgba(124,58,237,0.25)';ctx.fill();
  }

  document.getElementById('cert-form').style.display='none';
  document.getElementById('cert-result').style.display='flex';
}

function downloadCert(){
  var cv=document.getElementById('cert-cv');
  var a=document.createElement('a');
  a.download='ai-roadmap-certificate.png';a.href=cv.toDataURL('image/png');a.click();
}

// ── Show / hide cert modal ─────────────────────────────────────────────────────
function showCertModal(){
  var m=document.getElementById('cert-modal');
  if(!m){
    m=document.createElement('div');m.id='cert-modal';
    m.innerHTML='<div class="cm-overlay" onclick="closeCertModal()"></div>'
      +'<div class="cm-panel">'
      +'<button class="cm-x" onclick="closeCertModal()">✕</button>'
      +'<div id="cert-form">'
      +'<div class="cm-icon">🎓</div>'
      +'<h2 class="cm-title">Course complete!</h2>'
      +'<p class="cm-sub">You finished all 486 topics across 44 chapters. Generate your certificate below.</p>'
      +'<div class="cm-fields">'
      +'<label class="cm-label">Your name<input id="cert-name" class="cm-input" type="text" placeholder="e.g. Alex Johnson" autofocus></label>'
      +'<label class="cm-label">Company / Institution<input id="cert-company" class="cm-input" type="text" placeholder="e.g. Independent Learner"></label>'
      +'</div>'
      +'<button class="cm-gen" onclick="generateCert()">Generate Certificate →</button>'
      +'</div>'
      +'<div id="cert-result" style="display:none;flex-direction:column;align-items:center;gap:18px">'
      +'<canvas id="cert-cv" style="max-width:100%;border-radius:18px"></canvas>'
      +'<div class="cm-btns">'
      +'<button class="cm-dl" onclick="downloadCert()">⬇ Download PNG</button>'
      +'<button class="cm-back" onclick="document.getElementById(\'cert-form\').style.display=\'block\';document.getElementById(\'cert-result\').style.display=\'none\'">← Edit</button>'
      +'</div></div></div>';
    document.body.appendChild(m);
  }
  m.style.display='flex';
}

function closeCertModal(){
  var m=document.getElementById('cert-modal');if(m)m.style.display='none';
}

// ── Progress init ─────────────────────────────────────────────────────────────
function initProgress(){
  var checks=[...document.querySelectorAll('[data-progress-check]')];
  checks.forEach(function(cb){cb.checked=localStorage.getItem(storageKey(cb.id))==='1';});
  function render(){
    var total=checks.length,done=checks.filter(function(c){return c.checked;}).length;
    document.querySelectorAll('[data-progress-text]').forEach(function(e){e.textContent=total?done+'/'+total+' completed':'0/0 completed';});
    document.querySelectorAll('[data-progress-bar]').forEach(function(e){e.style.width=total?Math.round(done*100/total)+'%':'0%';});
  }
  checks.forEach(function(cb){
    cb.addEventListener('change',function(){
      localStorage.setItem(storageKey(cb.id),cb.checked?'1':'0');
      render();
      if(cb.checked){
        launchConfetti();
        setTimeout(function(){
          if(countDone()>=TOTAL_TOPICS){setTimeout(showCertModal,1500);}
        },600);
      }
    });
  });
  render();
}

// ── Filter init ───────────────────────────────────────────────────────────────
function initFilter(){
  var s=document.querySelector('#searchInput'),f=document.querySelector('#trackFilter');
  function run(){
    var q=(s?s.value:'').toLowerCase().trim(),track=f?f.value:'all';
    document.querySelectorAll('[data-card]').forEach(function(card){
      var okQ=!q||(card.dataset.search||'').toLowerCase().includes(q);
      var okT=track==='all'||card.dataset.track===track;
      card.classList.toggle('hidden',!(okQ&&okT));
    });
  }
  if(s)s.addEventListener('input',run);
  if(f)f.addEventListener('change',run);
}

document.addEventListener('DOMContentLoaded',function(){initProgress();initFilter();});
