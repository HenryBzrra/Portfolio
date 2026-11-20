/* Interactive background: proximity dots + 2 procedural spiders */
(function(){
var cv=document.getElementById('bg-canvas'),c=cv.getContext('2d'),w=0,h=0,dots=[],R=180,REACH=80;
var m={x:-9999,y:-9999};
// Aqui eu deixo o canvas sempre do tamanho da janela. Só recalculo quando largura ou altura mudam de verdade,
// e a quantidade de pontos acompanha a área da tela (com teto de 500) para não pesar no celular.
function resize(){if(w!==innerWidth||h!==innerHeight){w=cv.width=innerWidth;h=cv.height=innerHeight;
var n=Math.min(500,Math.floor(w*h/4200));dots=[];for(var i=0;i<n;i++)dots.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+.5,a:0});}}
function many(n,f){var o=[];for(var i=0;i<n;i++)o.push(f(i));return o}
function spawn(i){var s={x:Math.random()*innerWidth,y:Math.random()*innerHeight,o:i?1:-1,legs:[]};
for(var k=0;k<8;k++)s.legs.push({d:null,side:k%2?1:-1});return s}
var spiders=many(2,spawn);
addEventListener('pointermove',function(e){m.x=e.clientX;m.y=e.clientY});
document.documentElement.addEventListener('pointerleave',function(){m.x=m.y=-9999});
// Cada "pé" da aranha precisa de um ponto de apoio. Aqui eu junto os pontos que estão dentro do alcance (REACH)
// e sorteio um; o mínimo de 14px evita que o pé caia em cima do corpo.
function anchor(s,l){var best=[],i,d,dx,dy;for(i=0;i<dots.length;i++){dx=dots[i].x-s.x;dy=dots[i].y-s.y;d=Math.sqrt(dx*dx+dy*dy);if(d<REACH&&d>14)best.push(dots[i])}
l.d=best.length?best[Math.floor(Math.random()*best.length)]:null}
// Esse é o loop principal: a cada quadro eu limpo o canvas, atualizo os pontos e só depois desenho as aranhas por cima.
function frame(){resize();c.clearRect(0,0,w,h);var i,d,k;
for(i=0;i<dots.length;i++){var p=dots[i],dx=p.x-m.x,dy=p.y-m.y;d=Math.sqrt(dx*dx+dy*dy);k=Math.max(0,1-d/R);k=k*k*(3-2*k);
// Como o k acima mede a proximidade do mouse (0 longe, 1 em cima) e o k*k*(3-2*k) suaviza essa curva,
// aqui o brilho atual (p.a) anda só 12% do caminho por quadro até chegar no k. É isso que faz o ponto
// acender e apagar devagar, em vez de piscar.
p.a+=(k-p.a)*.12;
if(p.a>.04){c.fillStyle='rgba(255,59,78,'+(.35*p.a)+')';c.beginPath();c.arc(p.x,p.y,p.r*4,0,6.283);c.fill()}
c.fillStyle='rgba(255,255,255,'+(.1+.85*p.a)+')';c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.fill()}
c.lineWidth=.8;c.lineCap='round';
spiders.forEach(function(s){c.strokeStyle=s.o>0?'rgba(255,59,78,.75)':'rgba(255,255,255,.85)';
// A aranha não vai direto ao cursor: ela persegue um alvo levemente deslocado (cada uma para um lado)
// e a linha s.x += (alvo - s.x) * .06 anda 6% da distância por quadro, por isso ela desacelera ao chegar.
// Se o mouse saiu da tela, o alvo é a própria posição e ela fica parada.
var tx=m.x>-999?m.x+s.o*22:s.x,ty=m.y>-999?m.y-s.o*14:s.y;
s.x+=(tx-s.x)*.06;s.y+=(ty-s.y)*.06;
s.legs.forEach(function(l){
// Enquanto o pé alcança o ponto, ele continua preso nele. Quando o corpo se afasta além do alcance eu solto
// e procuro outro ponto; é essa troca que dá a sensação de a aranha estar dando passos.
if(!l.d||Math.hypot(l.d.x-s.x,l.d.y-s.y)>REACH)anchor(s,l);
if(!l.d)return;
// A perna tem dois segmentos: corpo, joelho e pé. O joelho fica no meio do caminho, empurrado 9px na
// perpendicular do vetor (-vy, vx), e o "side" alterna o lado de cada perna para elas formarem um V.
var mx=(s.x+l.d.x)/2,my=(s.y+l.d.y)/2,vx=l.d.x-s.x,vy=l.d.y-s.y,len=Math.hypot(vx,vy)||1,
kx=mx+(-vy/len)*9*l.side,ky=my+(vx/len)*9*l.side;
c.beginPath();c.moveTo(s.x,s.y);c.lineTo(kx,ky);c.lineTo(l.d.x,l.d.y);c.stroke();
c.fillStyle='#fff';c.beginPath();c.arc(l.d.x,l.d.y,1.4,0,6.283);c.fill()});
c.fillStyle='#fff';c.beginPath();c.arc(s.x,s.y,2.6,0,6.283);c.fill()});
requestAnimationFrame(frame)}
frame()})();

/* Flying scroll */
// Rolagem "voando": em vez do salto instantâneo eu animo o scroll com easeInOutCubic (começa devagar,
// acelera no meio e desacelera no fim). A duração cresce com a distância, entre 0,8 e 1,8 segundos.
// Se a pessoa pediu menos movimento no sistema, eu pulo direto.
function fly(y){if(matchMedia('(prefers-reduced-motion:reduce)').matches){scrollTo(0,y);return}var s=scrollY,d=y-s,t0=performance.now(),D=Math.min(1800,800+Math.abs(d)*.3);
function f(t){var p=Math.min(1,(t-t0)/D),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;scrollTo(0,s+d*e);if(p<1)requestAnimationFrame(f)}
requestAnimationFrame(f)}
document.querySelectorAll('[data-t]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();
var el=document.getElementById(a.dataset.t);fly(a.dataset.t==='home'?0:el.getBoundingClientRect().top+scrollY-64)})});
var nav=document.getElementById('nav');
addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>10)},{passive:true});

/* Section eyebrows */
document.querySelectorAll('h2').forEach(function(h){var t=h.textContent;h.insertAdjacentHTML('beforebegin','<p class="eyebrow rv">'+({'About me':'Who I am','Projects':'Selected work','Technologies':'What I work with','Contact me':'Get in touch'}[t]||'')+'</p>')});

/* Carrossel de tecnologias */
// Como a lista já está pronta no HTML, em vez de repetir tudo eu clono os itens duas vezes e marco as cópias como "dup".
// Com a original, ficam três cópias em fila, que é o que o CSS precisa para o loop emendar sem buraco em qualquer largura.
// O aria-hidden evita que o leitor de tela leia cada tecnologia três vezes.
var tech=document.querySelector('.tech'),base=Array.from(tech.children);
[1,2].forEach(function(){base.forEach(function(li){var copy=li.cloneNode(true);copy.classList.add('dup');copy.setAttribute('aria-hidden','true');tech.appendChild(copy)})});

/* Scroll reveal */
// Quando um bloco entra 15% na tela eu adiciono a classe "in" (o CSS faz o fade-up) e paro de observar,
// assim a animação acontece só na primeira vez.
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});

/* Project modal */
var dlg=document.getElementById('dlg');
document.querySelectorAll('.card').forEach(function(b){b.addEventListener('click',function(){
document.getElementById('dt').textContent=b.dataset.title;document.getElementById('dd').textContent=b.dataset.desc;dlg.showModal()})});
document.getElementById('dc').addEventListener('click',function(){dlg.close()});

/* Contact form (front-end only) */
document.getElementById('form').addEventListener('submit',function(e){e.preventDefault();
var f=e.target,msg=document.getElementById('msg');
if(!f.n.value.trim()||!/^\S+@\S+\.\S+$/.test(f.e.value)||!f.m.value.trim()){msg.textContent='Fill in your name, a valid email and a message.';return}
// Como a página não tem servidor, eu monto um link mailto com assunto e corpo já preenchidos
// e deixo o aplicativo de e-mail da pessoa fazer o envio.
var sub=encodeURIComponent('Portfolio contact from '+f.n.value.trim()),body=encodeURIComponent(f.m.value.trim()+'\n\n'+f.n.value.trim()+'\n'+f.e.value.trim());
msg.textContent='Opening your email app. If nothing opens, write to henrybezerra16@gmail.com.';
location.href='mailto:henrybezerra16@gmail.com?subject='+sub+'&body='+body;f.reset()});
