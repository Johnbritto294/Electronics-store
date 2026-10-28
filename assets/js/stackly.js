if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------- Image fallback so every picture always shows ---------- */
document.addEventListener('error', e => {
  const t = e.target;
  if (t.tagName === 'IMG' && !t.dataset.fb) {
    t.dataset.fb = 1;
    t.src = 'https://picsum.photos/seed/' + encodeURIComponent((t.alt || 'stackly').replace(/\s+/g, '-')) + '/900/700';
  }
}, true);

/* ---------- Data ---------- */
const PRODUCTS = [
  {id:1,name:'Aura Max Wireless Headphones',cat:'Audio',price:349,old:429,badge:'Best seller',rating:4.9,rev:2184,img:'assets/images/product-01-aura-headphones.webp'},
  {id:2,name:'Nova X Pro Smartphone',cat:'Mobile',price:999,old:null,badge:'New',rating:4.8,rev:1320,img:'assets/images/product-02-nova-smartphone.webp'},
  {id:3,name:'Zenbook Air 14 Laptop',cat:'Computing',price:1299,old:1449,badge:'Sale',rating:4.7,rev:864,img:'assets/images/product-03-zenbook-laptop.webp'},
  {id:4,name:'Pulse Buds ANC',cat:'Audio',price:179,old:229,badge:'Sale',rating:4.6,rev:3011,img:'assets/images/product-04-pulse-buds.webp'},
  {id:5,name:'Orbit Watch S3',cat:'Mobile',price:329,old:null,badge:'New',rating:4.7,rev:742,img:'assets/images/product-05-orbit-watch.webp'},
  {id:6,name:'Frame Mirrorless Camera',cat:'Cameras',price:1549,old:1699,badge:'Pro pick',rating:4.9,rev:512,img:'assets/images/product-06-frame-camera.webp'},
  {id:7,name:'Vortex Wireless Controller',cat:'Gaming',price:79,old:null,badge:'Popular',rating:4.8,rev:4120,img:'assets/images/product-07-vortex-controller.webp'},
  {id:8,name:'Halo Smart Speaker',cat:'Audio',price:129,old:159,badge:'Sale',rating:4.5,rev:1650,img:'assets/images/product-08-halo-speaker.webp'},
  {id:9,name:'Keystone Mechanical Keyboard',cat:'Gaming',price:149,old:null,badge:'New',rating:4.7,rev:956,img:'assets/images/product-09-keystone-keyboard.webp'},
  {id:10,name:'Forge Studio 16 Laptop',cat:'Computing',price:2199,old:null,badge:'Creator',rating:4.9,rev:403,img:'assets/images/product-10-forge-laptop.webp'},
  {id:11,name:'Skyline 4K Drone',cat:'Cameras',price:799,old:899,badge:'Sale',rating:4.6,rev:688,img:'assets/images/product-11-skyline-drone.webp'},
  {id:12,name:'Rift VR Headset',cat:'Gaming',price:449,old:null,badge:'Hot',rating:4.7,rev:1204,img:'assets/images/product-12-rift-vr.webp'}
];
const fmt = n => '$' + n.toLocaleString('en-US');
const stars = r => '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(r)) + (r % 1 >= .5 ? '<i class="fa-solid fa-star-half-stroke"></i>' : '');

/* ---------- Toast ---------- */
let toastTl;
function toast(msg) {
  const box = document.getElementById('toast');
  if (!box) return;
  document.getElementById('toastMsg').textContent = msg;
  if (toastTl) toastTl.kill();
  toastTl = gsap.timeline()
    .to('#toast', {opacity:1, y:0, duration:.4, ease:'back.out(2)'})
    .to('#toast', {opacity:0, y:40, duration:.4, delay:1.8});
}

/* ---------- Render products ---------- */
const grid = document.getElementById('productGrid');
if (grid) {
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="col-6 col-lg-3 p-item" data-cat="${p.cat}">
      <div class="p-card">
        <div class="p-img">
          <span class="p-badge">${p.badge}</span>
          <button class="p-wish" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
          <img src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="p-body">
          <div class="p-cat">${p.cat}</div>
          <h3 class="p-name">${p.name}</h3>
          <div class="p-stars">${stars(p.rating)}<span>${p.rating} (${p.rev.toLocaleString()})</span></div>
          <div class="p-foot">
            <div class="p-price">${fmt(p.price)}${p.old ? `<del>${fmt(p.old)}</del>` : ''}</div>
            <button class="p-add" data-id="${p.id}" aria-label="Add ${p.name} to bag"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

/* ---------- Cart ---------- */
const CART_KEY = 'stacklyCart';
let cart = {};
try {
  cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
} catch (err) {
  cart = {};
}
const cartCountEls = document.querySelectorAll('.cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const cartItemsEl = document.getElementById('cartItems');

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (err) {}
}

function renderCart() {
  const items = Object.values(cart);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);
  cartCountEls.forEach(el => el.textContent = count);
  if (cartTotalEl) cartTotalEl.textContent = fmt(total);
  if (!cartItemsEl) return;
  if (!items.length) {
    cartItemsEl.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-bag-shopping" style="font-size:2rem;margin-bottom:14px;"></i><p>Your bag is empty.<br>Add something shiny.</p></div>';
    saveCart();
    return;
  }
  cartItemsEl.innerHTML = items.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div class="flex-grow-1">
        <h6>${i.name}</h6>
        <div class="muted" style="font-size:.85rem;margin-bottom:8px;">${fmt(i.price)}</div>
        <div class="qty"><button data-act="dec" data-id="${i.id}">−</button><span>${i.qty}</span><button data-act="inc" data-id="${i.id}">+</button></div>
      </div>
      <button class="btn-close" style="font-size:.7rem;" data-act="rm" data-id="${i.id}" aria-label="Remove"></button>
    </div>`).join('');
  saveCart();
}

function bump() {
  cartCountEls.forEach(el => gsap.fromTo(el, {scale:1.8}, {scale:1, duration:.6, ease:'back.out(3)'}));
}

function flyToCart(imgEl) {
  const target = [...document.querySelectorAll('.cart-btn')].find(b => b.offsetParent !== null);
  if (!imgEl || !target) return;
  const a = imgEl.getBoundingClientRect(), b = target.getBoundingClientRect();
  const clone = imgEl.cloneNode();
  Object.assign(clone.style, {position:'fixed', left:a.left + 'px', top:a.top + 'px', width:a.width + 'px', height:a.height + 'px', objectFit:'cover', borderRadius:'20px', zIndex:3500, pointerEvents:'none'});
  document.body.appendChild(clone);
  gsap.to(clone, {left:b.left + b.width / 2 - 20, top:b.top + b.height / 2 - 20, width:40, height:40, borderRadius:'50%', opacity:.4, duration:.9, ease:'power3.inOut', onComplete:() => {clone.remove(); bump();}});
}

document.addEventListener('click', e => {
  const add = e.target.closest('.p-add');
  if (add) {
    const p = PRODUCTS.find(x => x.id == add.dataset.id);
    if (!p) return;
    cart[p.id] = cart[p.id] ? {...cart[p.id], qty: cart[p.id].qty + 1} : {...p, qty:1};
    renderCart();
    flyToCart(add.closest('.p-card').querySelector('.p-img img'));
    toast(p.name + ' added to bag');
    return;
  }
  const act = e.target.closest('[data-act]');
  if (act && cart[act.dataset.id]) {
    const id = act.dataset.id;
    if (act.dataset.act === 'inc') cart[id].qty++;
    if (act.dataset.act === 'dec') { cart[id].qty--; if (cart[id].qty <= 0) delete cart[id]; }
    if (act.dataset.act === 'rm') delete cart[id];
    renderCart();
    return;
  }
  const wish = e.target.closest('.p-wish');
  if (wish) {
    wish.classList.toggle('on');
    const ic = wish.querySelector('i');
    ic.className = wish.classList.contains('on') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    gsap.fromTo(wish, {scale:.7}, {scale:1, duration:.5, ease:'elastic.out(1,.4)'});
  }
});

const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!Object.keys(cart).length) return toast('Your bag is empty');
    window.location.href = '404.html';
  });
}
renderCart();

/* ---------- Filters ---------- */
const filters = document.getElementById('filters');
if (filters) {
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn'); if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    const items = [...document.querySelectorAll('.p-item')];
    const show = items.filter(i => f === 'all' || i.dataset.cat === f);
    const hide = items.filter(i => !show.includes(i));
    gsap.to(hide, {opacity:0, scale:.9, duration:.25, onComplete:() => {
      hide.forEach(i => i.style.display = 'none');
      show.forEach(i => i.style.display = '');
      gsap.fromTo(show, {opacity:0, y:40, scale:.95}, {opacity:1, y:0, scale:1, duration:.6, stagger:.06, ease:'power3.out', overwrite:true});
      ScrollTrigger.refresh();
    }});
  });
}

/* ---------- Intro animations ---------- */
function heroIntro() {
  const tl = gsap.timeline({delay:.35});
  tl.from('.hl', {yPercent:115, duration:1, ease:'power4.out', stagger:.12})
    .from('#heroChip', {opacity:0, y:20, duration:.6}, '-=.8')
    .from('#heroSub', {opacity:0, y:24, duration:.7}, '-=.6')
    .from('#heroBtns', {opacity:0, y:24, duration:.6}, '-=.5')
    .from('#heroMeta', {opacity:0, y:24, duration:.6}, '-=.45')
    .from('#blob', {scale:0, duration:1.1, ease:'elastic.out(1,.6)'}, 0.35)
    .from('#heroFrame', {clipPath:'inset(100% 0 0 0 round 36px)', duration:1.2, ease:'power4.out'}, 0.4)
    .from('#rotor', {scale:0, rotate:-120, duration:1, ease:'back.out(1.7)'}, 1)
    .from('.float-chip', {opacity:0, scale:.6, duration:.7, stagger:.14, ease:'back.out(2)'}, 1.1);
}

function pageIntro() {
  const head = document.querySelector('.page-head');
  if (!head) return;
  gsap.timeline({delay:.2})
    .from(head.querySelectorAll('.chip'), {opacity:0, y:16, duration:.5, ease:'power3.out'})
    .from(head.querySelectorAll('h1'), {opacity:0, y:44, duration:.9, ease:'power3.out'}, '-=.3')
    .from(head.querySelectorAll('p'), {opacity:0, y:24, duration:.7, ease:'power3.out'}, '-=.55');
}

function runIntro() {
  if (document.querySelector('.hero')) heroIntro();
  else pageIntro();
}

const preloader = document.getElementById('preloader');
if (preloader) {
  const pl = {v:0};
  gsap.to(pl, {v:100, duration:0.4, ease:'power2.out',
    onUpdate:() => {
      document.getElementById('plPct').textContent = Math.floor(pl.v) + '%';
      document.getElementById('plBar').style.width = pl.v + '%';
    },
    onComplete:() => {
      gsap.to('#preloader', {yPercent:-100, duration:.4, ease:'power2.inOut', onComplete:() => {
        preloader.style.display = 'none';
        runIntro();
      }});
    }
  });
}

/* ---------- Nav / cursor / magnetic / dashboard topbars ---------- */
const nav = document.getElementById('mainNav'), 
      toTop = document.getElementById('toTop'),
      dashTopbar = document.querySelector('.dash-topbar'),
      b2bTopbar = document.querySelector('.b2b-topbar');

if (nav || toTop || dashTopbar || b2bTopbar) {
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 50);
    if (dashTopbar) dashTopbar.classList.toggle('scrolled', scrollY > 15);
    if (b2bTopbar) b2bTopbar.classList.toggle('scrolled', scrollY > 15);
    if (toTop) toTop.classList.toggle('show', scrollY > 600);
  }, {passive:true});
}
if (toTop) toTop.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

if (matchMedia('(hover:hover)').matches) {
  const dot = document.getElementById('cDot'), ring = document.getElementById('cRing');
  if (dot && ring) {
    addEventListener('mousemove', e => {gsap.to(dot, {x:e.clientX, y:e.clientY, duration:.08}); gsap.to(ring, {x:e.clientX, y:e.clientY, duration:.35, ease:'power3.out'});});
    document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.p-card,.cat-card')) gsap.to(ring, {scale:1.6, duration:.3}); });
    document.addEventListener('mouseout', e => { if (e.target.closest('a,button,.p-card,.cat-card')) gsap.to(ring, {scale:1, duration:.3}); });
  }

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {const r = el.getBoundingClientRect(); gsap.to(el, {x:(e.clientX - r.left - r.width / 2) * .3, y:(e.clientY - r.top - r.height / 2) * .45, duration:.4, ease:'power3.out'});});
    el.addEventListener('mouseleave', () => gsap.to(el, {x:0, y:0, duration:.6, ease:'elastic.out(1,.4)'}));
  });

  document.querySelectorAll('.p-card').forEach(c => {
    c.addEventListener('mousemove', e => {const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; gsap.to(c, {rotateY:x * 10, rotateX:-y * 10, duration:.5, ease:'power2.out'});});
    c.addEventListener('mouseleave', () => gsap.to(c, {rotateX:0, rotateY:0, duration:.7, ease:'elastic.out(1,.5)'}));
  });
}

/* ---------- Hero scroll scrub ---------- */
if (document.getElementById('heroFrame')) {
  gsap.to('#heroFrame', {scale:.88, rotate:-3, y:50, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
  gsap.to('#blob', {scale:1.25, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
  gsap.utils.toArray('.float-chip').forEach(c => {
    gsap.to(c, {y:+c.dataset.speed, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
  });
}

/* ---------- Generic reveals ---------- */
gsap.utils.toArray('.reveal-up').forEach(el => {
  gsap.from(el, {y:50, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:el, start:'top 88%'}});
});
if (document.querySelector('.p-item')) ScrollTrigger.batch('.p-item', {start:'top 92%', once:true, onEnter:b => gsap.fromTo(b, {y:70, opacity:0}, {y:0, opacity:1, duration:.9, stagger:.1, ease:'power3.out', overwrite:true})});
if (document.querySelector('.svc-anim')) ScrollTrigger.batch('.svc-anim', {start:'top 90%', once:true, onEnter:b => gsap.from(b, {y:60, opacity:0, duration:.9, stagger:.12, ease:'power3.out'})});
if (document.querySelector('.blog-anim')) ScrollTrigger.batch('.blog-anim', {start:'top 90%', once:true, onEnter:b => gsap.from(b, {y:60, opacity:0, duration:.9, stagger:.12, ease:'power3.out'})});
if (document.querySelector('.partner-anim')) ScrollTrigger.batch('.partner-anim', {start:'top 92%', once:true, onEnter:b => gsap.from(b, {y:40, opacity:0, scale:.92, duration:.7, stagger:.07, ease:'back.out(1.6)'})});

/* ---------- Clip-path image reveals (scrubbed) ---------- */
gsap.utils.toArray('.img-reveal').forEach(box => {
  const img = box.querySelector('img');
  if (!img) return;
  const r = getComputedStyle(box).borderRadius;
  gsap.fromTo(box, {clipPath:`inset(14% 14% 14% 14% round ${r === '0px' ? '0px' : '30px'})`}, {clipPath:`inset(0% 0% 0% 0% round ${r === '0px' ? '0px' : '30px'})`, ease:'none', scrollTrigger:{trigger:box, start:'top 95%', end:'top 35%', scrub:true}});
  gsap.fromTo(img, {scale:1.35}, {scale:1, ease:'none', scrollTrigger:{trigger:box, start:'top 95%', end:'bottom 20%', scrub:true}});
});

/* ---------- Word-by-word scrub ---------- */
const about = document.getElementById('aboutText');
if (about) {
  about.innerHTML = about.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  gsap.fromTo('#aboutText .w', {opacity:.14}, {opacity:1, stagger:.12, ease:'none', scrollTrigger:{trigger:about, start:'top 80%', end:'bottom 55%', scrub:true}});
}

/* ---------- Counters ---------- */
document.querySelectorAll('[data-count]').forEach(el => {
  const t = +el.dataset.count;
  ScrollTrigger.create({trigger:el, start:'top 92%', once:true, onEnter:() => {
    const o = {v:0}; gsap.to(o, {v:t, duration:2, ease:'power2.out', onUpdate:() => el.textContent = Math.floor(o.v) + (t >= 300 ? '+' : t === 48 ? 'k+' : '')});
  }});
});

/* ---------- Footer big word ---------- */
if (document.getElementById('footerBig')) {
  gsap.from('#footerBig', {yPercent:40, opacity:0, ease:'none', scrollTrigger:{trigger:'#footerBig', start:'top 100%', end:'top 60%', scrub:true}});
}

/* ---------- Responsive pinned scenes ---------- */
const mm = gsap.matchMedia();

mm.add('(min-width: 992px)', () => {
  const track = document.getElementById('catTrack');
  if (track && document.getElementById('categories')) {
    const dist = () => track.scrollWidth - window.innerWidth;
    const horiz = gsap.to(track, {x:() => -dist(), ease:'none', scrollTrigger:{trigger:'#categories', start:'top top', end:() => '+=' + dist(), pin:true, scrub:1, invalidateOnRefresh:true, anticipatePin:1}});
    gsap.utils.toArray('.cat-card').forEach(card => {
      gsap.fromTo(card.querySelector('img'), {xPercent:-9}, {xPercent:9, ease:'none', scrollTrigger:{trigger:card, containerAnimation:horiz, start:'left right', end:'right left', scrub:true}});
      gsap.from(card, {y:80, opacity:0, ease:'none', scrollTrigger:{trigger:card, containerAnimation:horiz, start:'left 98%', end:'left 70%', scrub:true}});
    });
  }

  if (document.getElementById('showcase') && document.querySelector('.show-step')) {
    gsap.set(['.s2', '.s3'], {autoAlpha:0, y:50});
    const tl = gsap.timeline({defaults:{ease:'none'}, scrollTrigger:{trigger:'#showcase', start:'top top', end:'+=2600', pin:true, scrub:1, anticipatePin:1}});
    tl.to('#showImg', {rotate:12, scale:1.04, duration:1}, 0)
      .to('#sBar', {width:'33%', duration:1}, 0)
      .to('.s1', {autoAlpha:0, y:-50, duration:.5}, 1)
      .fromTo('.s2', {autoAlpha:0, y:50}, {autoAlpha:1, y:0, duration:.5}, 1.4)
      .to('#showImg', {rotate:-10, scale:1.1, duration:1}, 1)
      .to('#sBar', {width:'66%', duration:1}, 1)
      .to('.s2', {autoAlpha:0, y:-50, duration:.5}, 2)
      .fromTo('.s3', {autoAlpha:0, y:50}, {autoAlpha:1, y:0, duration:.5}, 2.4)
      .to('#showImg', {rotate:0, scale:1.16, borderRadius:'28%', duration:1}, 2)
      .to('#sBar', {width:'100%', duration:1}, 2)
      .to({}, {duration:.6});
  }
});

mm.add('(max-width: 991px)', () => {
  if (document.querySelector('.show-step')) {
    gsap.utils.toArray('.show-step').forEach(s => gsap.from(s, {y:50, opacity:0, duration:.9, ease:'power3.out', scrollTrigger:{trigger:s, start:'top 88%'}}));
    gsap.fromTo('#showImg', {rotate:-14}, {rotate:14, ease:'none', scrollTrigger:{trigger:'#showcase', start:'top bottom', end:'bottom top', scrub:true}});
  }
  if (document.getElementById('catTrack')) {
    gsap.from('.cat-card', {y:30, opacity:0, duration:.7, stagger:.08, ease:'power3.out', scrollTrigger:{trigger:'#catTrack', start:'top 85%'}});
  }
});

/* ---------- Countdown ---------- */
const countdown = document.getElementById('countdown');
if (countdown) {
  const endTime = Date.now() + (3 * 24 * 3600 + 8 * 3600 + 24 * 60) * 1000;
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    let s = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    document.getElementById('cdD').textContent = pad(Math.floor(s / 86400));
    document.getElementById('cdH').textContent = pad(Math.floor(s % 86400 / 3600));
    document.getElementById('cdM').textContent = pad(Math.floor(s % 3600 / 60));
    document.getElementById('cdS').textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);
}

/* ---------- Rolewise Auth System (Customer & Business Partner) ---------- */
const ROLE_CONTENT = {
  customer: {
    login: {
      badge: 'Customer Sign in',
      title: 'Your account.<br>Your gear.',
      subtitle: 'Enter the personal email you used at checkout and your password.',
      emailLabel: 'Personal Email',
      emailPlaceholder: 'you@email.com',
      submitBtn: 'Sign in as Customer <i class="fa-solid fa-arrow-right"></i>',
      altLink: 'signup.html?role=customer',
      altText: 'Create a customer account',
      asideBadge: 'Customer Benefits',
      asideTitle: 'Your Stackly account,<br>in one place.',
      asidePoints: `
        <li><i class="fa-solid fa-box"></i><div><b style="color:var(--porcelain);">Track every order</b><br>Live delivery updates and full purchase history.</div></li>
        <li><i class="fa-solid fa-heart"></i><div><b style="color:var(--porcelain);">Save favourites</b><br>Keep a wishlist across all your devices.</div></li>
        <li><i class="fa-solid fa-bolt"></i><div><b style="color:var(--porcelain);">First access</b><br>Early looks at launches and member-only deals.</div></li>`
    },
    signup: {
      badge: 'Customer Registration',
      title: 'Join the<br>Stackly list.',
      subtitle: 'It takes less than a minute — no spam, just the good stuff.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Personal Email',
      emailPlaceholder: 'you@email.com',
      termsLabel: 'I agree to the <a href="404.html" target="_blank">terms</a> and <a href="404.html" target="_blank">customer privacy policy</a>',
      submitBtn: 'Create Customer Account <i class="fa-solid fa-arrow-right"></i>',
      altLink: 'login.html?role=customer',
      altText: 'Sign in to your customer account',
      asideBadge: 'Customer Perks',
      asideTitle: 'More than<br>a login.',
      asidePoints: `
        <li><i class="fa-solid fa-truck-fast"></i><div><b style="color:var(--porcelain);">Faster checkout</b><br>Saved addresses and payment details, ready to go.</div></li>
        <li><i class="fa-solid fa-shield-halved"></i><div><b style="color:var(--porcelain);">Warranty wallet</b><br>Every receipt and warranty in one safe place.</div></li>
        <li><i class="fa-solid fa-tag"></i><div><b style="color:var(--porcelain);">Member pricing</b><br>Occasional member-only bundles and early drops.</div></li>`
    }
  },
  business: {
    login: {
      badge: 'Partner Portal',
      title: 'Business &amp;<br>Partner Login',
      subtitle: 'Sign in with your corporate or partner credentials for B2B pricing & services.',
      emailLabel: 'Work / Business Email',
      emailPlaceholder: 'partner@company.com',
      submitBtn: 'Sign in as Business Partner <i class="fa-solid fa-arrow-right"></i>',
      altLink: 'signup.html?role=business',
      altText: 'Register as a Business Partner',
      asideBadge: 'Partner Privileges',
      asideTitle: 'Enterprise power,<br>direct support.',
      asidePoints: `
        <li><i class="fa-solid fa-tags"></i><div><b style="color:var(--porcelain);">Wholesale & Bulk Rates</b><br>Tiered volume pricing on workstations, displays & audio.</div></li>
        <li><i class="fa-solid fa-file-invoice-dollar"></i><div><b style="color:var(--porcelain);">Tax-Exempt Invoicing</b><br>Automatic GST/business invoice generation and PO support.</div></li>
        <li><i class="fa-solid fa-screwdriver-wrench"></i><div><b style="color:var(--porcelain);">Priority Service Dispatch</b><br>Fast-track repairs and dedicated corporate technician support.</div></li>`
    },
    signup: {
      badge: 'Partner Registration',
      title: 'Stackly B2B<br>&amp; Partnerships.',
      subtitle: 'Register your business for bulk rates, net invoicing & dedicated service.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Business Email',
      emailPlaceholder: 'partner@company.com',
      termsLabel: 'I agree to the <a href="404.html" target="_blank">terms</a> and <a href="404.html" target="_blank">business partner privacy policy</a>',
      submitBtn: 'Create Business Partner Account <i class="fa-solid fa-arrow-right"></i>',
      altLink: 'login.html?role=business',
      altText: 'Sign in to partner portal',
      asideBadge: 'Partner Privileges',
      asideTitle: 'B2B Wholesale<br>&amp; Logistics.',
      asidePoints: `
        <li><i class="fa-solid fa-boxes-stacked"></i><div><b style="color:var(--porcelain);">Volume Tier Rates</b><br>Unlock discounted commercial pricing on multi-unit orders.</div></li>
        <li><i class="fa-solid fa-handshake"></i><div><b style="color:var(--porcelain);">Dedicated Account Lead</b><br>Direct tech line and fast quote turnaround under 2 hours.</div></li>
        <li><i class="fa-solid fa-file-invoice"></i><div><b style="color:var(--porcelain);">Corporate Net Terms</b><br>Flexible commercial invoicing, PO billing & verified receipts.</div></li>`
    }
  }
};

function applyLoginRole(role) {
  const data = ROLE_CONTENT[role].login;
  const badge = document.getElementById('loginRoleBadge');
  const title = document.getElementById('loginTitle');
  const subtitle = document.getElementById('loginSubtitle');
  const emailLabel = document.getElementById('loginEmailLabel');
  const emailInput = document.getElementById('loginEmail');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const signupLink = document.getElementById('signupLink');
  const asideBadge = document.getElementById('asideBadge');
  const asideTitle = document.getElementById('asideTitle');
  const asideList = document.getElementById('asideList');
  const roleInput = document.getElementById('loginRoleInput');

  if (roleInput) roleInput.value = role;
  if (badge) badge.textContent = data.badge;
  if (title) title.innerHTML = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (emailLabel) emailLabel.textContent = data.emailLabel;
  if (emailInput) emailInput.placeholder = data.emailPlaceholder;
  if (submitBtn) submitBtn.innerHTML = data.submitBtn;
  if (signupLink) { signupLink.href = data.altLink; signupLink.textContent = data.altText; }
  if (asideBadge) asideBadge.textContent = data.asideBadge;
  if (asideTitle) asideTitle.innerHTML = data.asideTitle;
  if (asideList) asideList.innerHTML = data.asidePoints;
}

function applySignupRole(role) {
  const data = ROLE_CONTENT[role].signup;
  const badge = document.getElementById('signupRoleBadge');
  const title = document.getElementById('signupTitle');
  const subtitle = document.getElementById('signupSubtitle');
  const nameLabel = document.getElementById('signupNameLabel');
  const nameInput = document.getElementById('signupName');
  const emailLabel = document.getElementById('signupEmailLabel');
  const emailInput = document.getElementById('signupEmail');
  const termsLabel = document.getElementById('termsLabel');
  const submitBtn = document.getElementById('signupSubmitBtn');
  const loginLink = document.getElementById('loginLink');
  const asideBadge = document.getElementById('signupAsideBadge');
  const asideTitle = document.getElementById('signupAsideTitle');
  const asideList = document.getElementById('signupAsideList');
  const roleInput = document.getElementById('signupRoleInput');

  if (roleInput) roleInput.value = role;
  if (badge) badge.textContent = data.badge;
  if (title) title.innerHTML = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (nameLabel) nameLabel.textContent = data.nameLabel;
  if (nameInput) nameInput.placeholder = data.namePlaceholder;
  if (emailLabel) emailLabel.textContent = data.emailLabel;
  if (emailInput) emailInput.placeholder = data.emailPlaceholder;
  if (termsLabel) termsLabel.innerHTML = data.termsLabel;
  if (submitBtn) submitBtn.innerHTML = data.submitBtn;
  if (loginLink) { loginLink.href = data.altLink; loginLink.textContent = data.altText; }
  if (asideBadge) asideBadge.textContent = data.asideBadge;
  if (asideTitle) asideTitle.innerHTML = data.asideTitle;
  if (asideList) asideList.innerHTML = data.asidePoints;
}

// Initialise Role Switches based on URL or defaults
const urlRole = new URLSearchParams(window.location.search).get('role');
const initialRole = (urlRole === 'business') ? 'business' : 'customer';

const loginToggle = document.getElementById('loginRoleToggle');
if (loginToggle) {
  const btns = loginToggle.querySelectorAll('.role-btn');
  btns.forEach(b => {
    b.classList.toggle('active', b.dataset.role === initialRole);
    b.addEventListener('click', () => {
      btns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');
      applyLoginRole(b.dataset.role);
    });
  });
  applyLoginRole(initialRole);
}

const signupToggle = document.getElementById('signupRoleToggle');
if (signupToggle) {
  const btns = signupToggle.querySelectorAll('.role-btn');
  btns.forEach(b => {
    b.classList.toggle('active', b.dataset.role === initialRole);
    b.addEventListener('click', () => {
      btns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');
      applySignupRole(b.dataset.role);
    });
  });
  applySignupRole(initialRole);
}

const termsLabelEl = document.getElementById('termsLabel');
if (termsLabelEl) {
  termsLabelEl.addEventListener('click', e => {
    if (e.target.closest('a')) {
      e.stopPropagation();
    }
  });
}

// Auth submission handler
document.querySelectorAll('.authForm').forEach(f => {
  const pwd = f.querySelector('input[data-password]');
  const confirm = f.querySelector('input[data-confirm]');
  if (pwd && confirm) {
    confirm.addEventListener('input', () => confirm.setCustomValidity(confirm.value === pwd.value ? '' : 'Passwords do not match'));
  }
  f.addEventListener('submit', e => {
    if (pwd && confirm && pwd.value !== confirm.value) {
      e.preventDefault();
      confirm.reportValidity();
      return;
    }
    e.preventDefault();
    const isRegister = f.dataset.auth === 'register';
    const roleInput = f.querySelector('input[name="role"]');
    const role = (roleInput ? roleInput.value : 'customer') || 'customer';
    
    let userName = 'Member';
    let userEmail = '';
    let userCompany = '';

    if (isRegister) {
      const nameInput = document.getElementById('signupName');
      const emailInput = document.getElementById('signupEmail');
      const compInput = document.getElementById('signupCompany');
      userName = (nameInput && nameInput.value.trim()) || 'Member';
      userEmail = (emailInput && emailInput.value.trim()) || '';
      userCompany = (compInput && compInput.value.trim()) || '';
    } else {
      const emailInput = document.getElementById('loginEmail');
      userEmail = (emailInput && emailInput.value.trim()) || '';
      userName = userEmail.split('@')[0] || (role === 'business' ? 'Partner' : 'Customer');
    }

    const userData = {
      name: userName,
      email: userEmail,
      company: userCompany,
      role: role,
      loggedIn: true,
      time: new Date().toISOString()
    };
    try {
      localStorage.setItem('stacklyUser', JSON.stringify(userData));
    } catch (err) {}

    const toastMsg = isRegister 
      ? (role === 'business' ? `Business Partner account created! Welcome, ${userCompany || userName}` : `Customer account created! Welcome to Stackly, ${userName}`)
      : (role === 'business' ? `Signed in to Partner Portal — Welcome back, ${userName}!` : `Signed in as Customer — Welcome back, ${userName}!`);
    
    toast(toastMsg);
    setTimeout(() => {
      location.href = role === 'business' ? 'b2b-dashboard.html' : 'dashboard.html';
    }, 850);
  });
});

/* ---------- Website Navbar: Always show Login and Register ---------- */
function initNavbarUser() {
  // Website navbar always retains standard Login & Register buttons.
  // User profile and role information is displayed exclusively inside dashboard.html.
}
initNavbarUser();

/* ---------- Dashboard Mobile Menu ---------- */
function initDashboardMobileMenu() {
  const toggle = document.getElementById('dashMobileToggle');
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashOverlay');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  });
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
  document.querySelectorAll('.side-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }
  });
}

/* ---------- Reference Admin Dashboard Controller ---------- */
function initDashboard() {
  const dashApp = document.getElementById('dashApp');
  if (!dashApp) return;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('stacklyUser'));
  } catch (err) {}

  // Default user profile if accessed directly
  if (!user || !user.loggedIn) {
    user = {
      name: 'brittoj346',
      email: 'brittoj346@stackly.com',
      company: '',
      role: 'customer',
      loggedIn: true
    };
  }

  const DATA_MODES = {
    customer: {
      title: 'Customer Dashboard',
      roleLabel: 'Customer',
      kpi1: { title: 'Total Gear Spend', val: 14850, prefix: '$', badge: '+ 12.5%', sub: 'from last month' },
      kpi2: { title: 'Reward Volt Points', val: 24689, prefix: '', badge: '+ 6.2%', sub: 'from last week' },
      kpi3: { title: 'Orders Placed', val: 1847, prefix: '', badge: '- 2.1%', sub: 'from yesterday' },
      kpi4: { title: 'Warranty Claims', val: 3.47, suffix: '%', decimals: 2, badge: '+ 0.3%', sub: '100% resolved' },
      barTitle: 'Real-time Gear Activity',
      sum1: '47,829',
      sum2: '186,247',
      deviceTitle: 'Personal Gear Breakdown',
      deviceTotal: '+3,650 net active sessions',
      devices: [
        { name: 'Audio (Headphones & Buds)', pct: '+ 45.8%', pos: true, w: '72%' },
        { name: 'Smartphones & Mobile', pct: '+ 38.7%', pos: true, w: '58%' },
        { name: 'Laptops & Workstations', pct: '- 11.3%', pos: false, w: '34%' },
        { name: 'Gaming & Wearables', pct: '- 15.5%', pos: false, w: '42%' }
      ],
      mapTitle: 'Salem & Regional Delivery Network',
      revTitle: 'Total Gear Value',
      revVal: '$847,290',
      revConv: '3.47%',
      revUsers: '24,689'
    },
    business: {
      title: 'Enterprise Cockpit',
      roleLabel: 'B2B Partner Active',
      kpi1: { title: 'Active subscribers', val: 847290, prefix: '$', badge: '+ 12.5%', sub: 'from last month' },
      kpi2: { title: 'Active Users', val: 24689, prefix: '', badge: '+ 6.2%', sub: 'from last week' },
      kpi3: { title: 'Orders', val: 1847, prefix: '', badge: '- 2.1%', sub: 'from yesterday' },
      kpi4: { title: 'Conversion Rate', val: 3.47, suffix: '%', decimals: 2, badge: '+ 0.3%', sub: 'from last month' },
      barTitle: 'Real-time Analytics',
      sum1: '47,829',
      sum2: '186,247',
      deviceTitle: 'Device Analytics',
      deviceTotal: '+3,650 net new sessions',
      devices: [
        { name: 'Desktop', pct: '+ 45.8%', pos: true, w: '72%' },
        { name: 'Mobile', pct: '+ 38.7%', pos: true, w: '58%' },
        { name: 'Tablet', pct: '- 11.3%', pos: false, w: '34%' },
        { name: 'Watch', pct: '- 15.5%', pos: false, w: '42%' }
      ],
      mapTitle: 'Global User Distribution',
      revTitle: 'Total Revenue',
      revVal: '$847,290',
      revConv: '3.47%',
      revUsers: '24,689'
    }
  };

  function syncDashTopbarOffset() {
    const topbar = document.querySelector('.dash-topbar');
    const main = document.querySelector('.dash-main');
    if (topbar && main) {
      const h = topbar.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty('--dash-topbar-h', `${h}px`);
        if (window.innerWidth <= 992) {
          main.style.paddingTop = `${h + 18}px`;
        } else {
          main.style.paddingTop = '';
        }
      }
    }
  }

  function renderDashboard(currentRole) {
    const isBiz = currentRole === 'business';
    const d = isBiz ? DATA_MODES.business : DATA_MODES.customer;

    // Sidebar & Profile
    const emailVal = document.getElementById('sidebarEmailVal');
    const userName = document.getElementById('sideUserName');
    const roleLabel = document.getElementById('sideRoleLabel');
    const topTitle = document.getElementById('topbarTitle');
    const roleBtnText = document.getElementById('roleSwitchBtnText');

    if (emailVal) emailVal.textContent = user.email || 'brittoj346@stackly.com';
    if (userName) userName.textContent = user.name || user.company || (isBiz ? 'Enterprise Partner' : 'brittoj346');
    if (roleLabel) roleLabel.textContent = isBiz ? 'Business Partner' : 'Customer';
    if (topTitle) topTitle.textContent = d.title;
    if (roleBtnText) roleBtnText.textContent = isBiz ? 'Switch to Customer' : 'Switch to Partner';

    // KPI 1
    const k1Title = document.getElementById('kpi1Title');
    const k1Val = document.getElementById('kpi1Val');
    const k1Badge = document.getElementById('kpi1Badge');
    const k1Sub = document.getElementById('kpi1Sub');
    if (k1Title) k1Title.textContent = d.kpi1.title;
    if (k1Val) { k1Val.dataset.target = d.kpi1.val; k1Val.dataset.prefix = d.kpi1.prefix || ''; k1Val.dataset.suffix = d.kpi1.suffix || ''; if (d.kpi1.decimals !== undefined) k1Val.dataset.decimals = d.kpi1.decimals; }
    if (k1Badge) k1Badge.textContent = d.kpi1.badge;
    if (k1Sub) k1Sub.textContent = d.kpi1.sub;

    // KPI 2
    const k2Title = document.getElementById('kpi2Title');
    const k2Val = document.getElementById('kpi2Val');
    const k2Badge = document.getElementById('kpi2Badge');
    const k2Sub = document.getElementById('kpi2Sub');
    if (k2Title) k2Title.textContent = d.kpi2.title;
    if (k2Val) { k2Val.dataset.target = d.kpi2.val; k2Val.dataset.prefix = d.kpi2.prefix || ''; k2Val.dataset.suffix = d.kpi2.suffix || ''; if (d.kpi2.decimals !== undefined) k2Val.dataset.decimals = d.kpi2.decimals; }
    if (k2Badge) k2Badge.textContent = d.kpi2.badge;
    if (k2Sub) k2Sub.textContent = d.kpi2.sub;

    // KPI 3
    const k3Title = document.getElementById('kpi3Title');
    const k3Val = document.getElementById('kpi3Val');
    const k3Badge = document.getElementById('kpi3Badge');
    const k3Sub = document.getElementById('kpi3Sub');
    if (k3Title) k3Title.textContent = d.kpi3.title;
    if (k3Val) { k3Val.dataset.target = d.kpi3.val; k3Val.dataset.prefix = d.kpi3.prefix || ''; k3Val.dataset.suffix = d.kpi3.suffix || ''; if (d.kpi3.decimals !== undefined) k3Val.dataset.decimals = d.kpi3.decimals; }
    if (k3Badge) k3Badge.textContent = d.kpi3.badge;
    if (k3Sub) k3Sub.textContent = d.kpi3.sub;

    // KPI 4
    const k4Title = document.getElementById('kpi4Title');
    const k4Val = document.getElementById('kpi4Val');
    const k4Badge = document.getElementById('kpi4Badge');
    const k4Sub = document.getElementById('kpi4Sub');
    if (k4Title) k4Title.textContent = d.kpi4.title;
    if (k4Val) { k4Val.dataset.target = d.kpi4.val; k4Val.dataset.prefix = d.kpi4.prefix || ''; k4Val.dataset.suffix = d.kpi4.suffix || ''; if (d.kpi4.decimals !== undefined) k4Val.dataset.decimals = d.kpi4.decimals; }
    if (k4Badge) k4Badge.textContent = d.kpi4.badge;
    if (k4Sub) k4Sub.textContent = d.kpi4.sub;

    // Charts & Titles
    const barTitle = document.getElementById('barChartTitle');
    if (barTitle) barTitle.textContent = d.barTitle;
    const devTitle = document.getElementById('deviceBoxTitle');
    if (devTitle) devTitle.textContent = d.deviceTitle;
    const devTotal = document.getElementById('deviceTotalVal');
    if (devTotal) devTotal.innerHTML = d.deviceTotal;

    // Device items
    d.devices.forEach((dev, idx) => {
      const nameEl = document.getElementById(`d${idx+1}Name`);
      const pctEl = document.getElementById(`d${idx+1}Pct`);
      if (nameEl) nameEl.textContent = dev.name;
      if (pctEl) {
        pctEl.textContent = dev.pct;
        pctEl.className = 'd-pct ' + (dev.pos ? 'pos' : 'neg');
      }
    });

    // Map Title
    const mapTitle = document.getElementById('mapTitle');
    if (mapTitle) mapTitle.textContent = d.mapTitle;

    // Counter animations
    animateCounters();
    syncDashTopbarOffset();
  }

  // Numerical Counter Animations
  function animateCounters(container) {
    const parent = container || document;
    const counters = parent.querySelectorAll('.stat-counter');
    counters.forEach(c => {
      const target = parseFloat(c.dataset.target || 0);
      const prefix = c.dataset.prefix || '';
      const suffix = c.dataset.suffix || '';
      const decimals = c.dataset.decimals ? parseInt(c.dataset.decimals) : 0;
      const duration = 1100;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = ease * target;

        let formatted = current.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        c.textContent = prefix + formatted + suffix;

        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // Interactive Hover Counter Re-trigger on stat-card-hover
  document.querySelectorAll('.stat-card-hover').forEach(card => {
    let hoverTimeout;
    card.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        const cardCounters = card.querySelectorAll('.stat-counter');
        if (cardCounters.length) {
          animateCounters(card);
        }
      }, 80);
    });
  });

  // Initial render
  let activeRole = user.role || 'customer';
  renderDashboard(activeRole);
  animateCounters();

  // Role Switch Button
  const switchBtn = document.getElementById('roleSwitchBtn');
  if (switchBtn) {
    switchBtn.addEventListener('click', () => {
      activeRole = activeRole === 'business' ? 'customer' : 'business';
      user.role = activeRole;
      try { localStorage.setItem('stacklyUser', JSON.stringify(user)); } catch (e) {}
      renderDashboard(activeRole);
      animateCounters();
      toast(`Switched view to ${activeRole === 'business' ? 'Enterprise Partner' : 'Customer'} Dashboard`);
    });
  }

  // TAB NAVIGATION SYSTEM
  const tabLinks = document.querySelectorAll('.side-nav-link[data-tab-nav]');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');
  const TAB_TITLES = {
    dashboard: 'Dashboard',
    electronics: 'Electronics — Stackly',
    smartgear: 'Smart Gear — Stackly',
    inventory: 'Inventory — Stackly',
    warranties: 'Warranties — Stackly',
    serviceorders: 'Service Orders — Stackly'
  };

  function switchTab(tabId) {
    if (!tabId) return;
    const targetPane = document.getElementById(`pane-${tabId}`);
    if (!targetPane) return;

    tabPanes.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    targetPane.classList.add('active');
    targetPane.style.display = 'block';

    tabLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.tabNav === tabId);
    });

    const topTitle = document.getElementById('topbarTitle');
    if (topTitle && TAB_TITLES[tabId]) {
      topTitle.textContent = TAB_TITLES[tabId];
    }

    try { history.replaceState(null, '', `#${tabId}`); } catch (err) {}

    // Animate counters inside newly active tab
    animateCounters(targetPane);
    syncDashTopbarOffset();

    // Scroll cleanly to the top of page so all starting contents & KPI cards are completely visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Expose globally for customer dashboard
  window.switchCustomerTab = switchTab;

  // Global event delegation for side nav clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.side-nav-link[data-tab-nav]');
    if (link) {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab-nav');
      switchTab(tabId);
    }
  });

  // Check initial hash on load
  const initialHash = (location.hash || '').replace('#', '').toLowerCase();
  if (initialHash && document.getElementById(`pane-${initialHash}`)) {
    switchTab(initialHash);
  } else {
    const activePane = document.querySelector('.dash-tab-pane.active') || document.getElementById('pane-dashboard');
    if (activePane) animateCounters(activePane);
  }

  // Dynamic topbar height offset syncing for mobile/tablet viewports
  syncDashTopbarOffset();
  window.addEventListener('resize', syncDashTopbarOffset, { passive: true });
  window.addEventListener('orientationchange', syncDashTopbarOffset);
  const dashTopbarElem = document.querySelector('.dash-topbar');
  if (dashTopbarElem && window.ResizeObserver) {
    new ResizeObserver(() => syncDashTopbarOffset()).observe(dashTopbarElem);
  }

  window.addEventListener('hashchange', () => {
    const h = (location.hash || '').replace('#', '').toLowerCase();
    if (h && document.getElementById(`pane-${h}`)) {
      switchTab(h);
    }
  });

  // Quick Order "Add to Bag" inside Store Tab
  document.querySelectorAll('.add-gear-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || 'Stackly Gear';
      const price = parseFloat(btn.dataset.price || 0);
      const cartCountEl = document.querySelector('.cartCount');
      if (cartCountEl) {
        let count = parseInt(cartCountEl.textContent || '0') + 1;
        document.querySelectorAll('.cartCount').forEach(el => el.textContent = count);
      }
      toast(`Added ${name} to your bag ($${price})`);
    });
  });

  // Submit RMA Button
  const submitRmaBtn = document.getElementById('submitRmaBtn');
  if (submitRmaBtn) {
    submitRmaBtn.addEventListener('click', () => {
      toast('Warranty diagnostic ticket submitted. Pickup courier scheduled!');
    });
  }

  // Live Chat Button
  const startLiveChatBtn = document.getElementById('startLiveChatBtn');
  if (startLiveChatBtn) {
    startLiveChatBtn.addEventListener('click', () => {
      toast('Connecting to Stackly Hardware Support specialist...');
    });
  }

  // Time Filter Buttons
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toast(`Updated range to: ${btn.dataset.range}`);
    });
  });

  // Refresh Button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      animateCounters();
      toast('Live metrics refreshed');
    });
  }

  // Export Button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      toast('Exporting dashboard report (PDF/CSV)...');
    });
  }

  // Sidebar Logout
  const logoutBtn = document.getElementById('sidebarLogoutBtn');
  if (logoutBtn && logoutBtn.tagName !== 'A') {
    logoutBtn.addEventListener('click', () => {
      try { localStorage.removeItem('stacklyUser'); } catch (err) {}
      location.href = 'login.html';
    });
  } else if (logoutBtn && logoutBtn.tagName === 'A') {
    logoutBtn.addEventListener('click', () => {
      try { localStorage.removeItem('stacklyUser'); } catch (err) {}
    });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  initDashboardMobileMenu();
  initDashboard();
});
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initDashboardMobileMenu();
  initDashboard();
}
const contactForm = document.getElementById('contactForm');
if (contactForm && !document.getElementById('homeContactForm')) contactForm.addEventListener('submit', e => {e.preventDefault(); e.target.reset(); toast('Message sent — we will reply soon');});
const nlForm = document.getElementById('nlForm');
if (nlForm) nlForm.addEventListener('submit', e => {e.preventDefault(); e.target.reset(); toast('You are on the list');});

/* ---------- Fullscreen Mobile Hamburger Menu & Scroll Lock ---------- */
const navMenuEl = document.getElementById('navMenu');
const navTogglerEl = document.querySelector('.navbar-toggler');

if (navMenuEl) {
  // Lock background scroll and switch icon to X when menu opens
  navMenuEl.addEventListener('show.bs.collapse', () => {
    document.documentElement.classList.add('nav-open');
    document.body.classList.add('nav-open');
    if (navTogglerEl) {
      navTogglerEl.classList.add('active');
      const icon = navTogglerEl.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  });

  // Restore background scroll and switch icon back to bars when menu closes
  navMenuEl.addEventListener('hidden.bs.collapse', () => {
    document.documentElement.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
    if (navTogglerEl) {
      navTogglerEl.classList.remove('active');
      const icon = navTogglerEl.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close fullscreen menu on any link click inside the menu
  navMenuEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenuEl.classList.contains('show') && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navMenuEl) || new bootstrap.Collapse(navMenuEl, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // Escape key closes mobile menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenuEl.classList.contains('show') && typeof bootstrap !== 'undefined') {
      const bsCollapse = bootstrap.Collapse.getInstance(navMenuEl);
      if (bsCollapse) bsCollapse.hide();
    }
  });

  // Window resize reset (e.g. rotating device from portrait to landscape desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && navMenuEl.classList.contains('show') && typeof bootstrap !== 'undefined') {
      const bsCollapse = bootstrap.Collapse.getInstance(navMenuEl);
      if (bsCollapse) bsCollapse.hide();
      document.documentElement.classList.remove('nav-open');
      document.body.classList.remove('nav-open');
    }
  });
}

/* ---------- Smooth anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({behavior:'smooth'});
      if (navMenuEl && navMenuEl.classList.contains('show') && typeof bootstrap !== 'undefined') {
        bootstrap.Collapse.getOrCreateInstance(navMenuEl).hide();
      }
    }
  });
});

/* ---------- Active nav link for current page ---------- */
const navLinks = document.querySelectorAll('.nav-link-stackly');
const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase() || 'index.html';
navLinks.forEach(l => {
  const href = (l.getAttribute('href') || '').split('#')[0].toLowerCase() || 'index.html';
  const active = href === currentPage;
  l.classList.toggle('active', active);
  if (active) l.setAttribute('aria-current', 'page');
  else l.removeAttribute('aria-current');
});

/* ---------- Custom Select Dropdown (Zero Overflow, Strictly Bounded) ---------- */
function initCustomSelects() {
  const selects = document.querySelectorAll('.contact-box select.form-select');
  selects.forEach(select => {
    if (select.dataset.customSelectInit === 'true') return;
    select.dataset.customSelectInit = 'true';

    // Hide native select visually and from pointer, but preserve in DOM & form
    select.style.position = 'absolute';
    select.style.opacity = '0';
    select.style.pointerEvents = 'none';
    select.style.width = '1px';
    select.style.height = '1px';
    select.style.clip = 'rect(0,0,0,0)';
    select.style.margin = '-1px';
    select.tabIndex = -1;

    // Create wrapper
    const wrap = document.createElement('div');
    wrap.className = 'custom-select-wrap';

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const valueSpan = document.createElement('span');
    valueSpan.className = 'custom-select-value';
    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    valueSpan.textContent = selectedOption ? selectedOption.text : '';

    const arrow = document.createElement('i');
    arrow.className = 'fa-solid fa-chevron-down custom-select-arrow';

    trigger.appendChild(valueSpan);
    trigger.appendChild(arrow);
    wrap.appendChild(trigger);

    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');

    const optionsList = [];
    Array.from(select.options).forEach((opt, idx) => {
      const optEl = document.createElement('div');
      optEl.className = 'custom-select-option' + (idx === select.selectedIndex ? ' is-selected' : '');
      optEl.setAttribute('role', 'option');
      optEl.setAttribute('data-value', opt.value);
      optEl.textContent = opt.text;

      optEl.addEventListener('click', e => {
        e.stopPropagation();
        select.selectedIndex = idx;
        select.value = opt.value;
        valueSpan.textContent = opt.text;

        optionsList.forEach(o => o.classList.remove('is-selected'));
        optEl.classList.add('is-selected');

        closeMenu();
        trigger.focus();

        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
      });

      menu.appendChild(optEl);
      optionsList.push(optEl);
    });

    wrap.appendChild(menu);
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);

    if (select.id) {
      const label = document.querySelector(`label[for="${select.id}"]`);
      if (label) {
        label.addEventListener('click', e => {
          e.preventDefault();
          trigger.focus();
          toggleMenu();
        });
      }
    }

    function openMenu() {
      document.querySelectorAll('.custom-select-wrap.is-open').forEach(w => {
        if (w !== wrap) {
          w.classList.remove('is-open');
          const btn = w.querySelector('.custom-select-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
      if (wrap.classList.contains('is-open')) closeMenu();
      else openMenu();
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu();
    });

    trigger.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!wrap.classList.contains('is-open')) {
          openMenu();
        } else if (e.key === 'ArrowDown') {
          const next = (select.selectedIndex + 1) % optionsList.length;
          optionsList[next].click();
          openMenu();
        } else if (e.key === 'ArrowUp') {
          const prev = (select.selectedIndex - 1 + optionsList.length) % optionsList.length;
          optionsList[prev].click();
          openMenu();
        } else if (e.key === 'Enter' || e.key === ' ') {
          closeMenu();
        }
      } else if (e.key === 'Escape') {
        closeMenu();
      }
    });

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) closeMenu();
    });

    const form = select.closest('form');
    if (form) {
      form.addEventListener('reset', () => {
        setTimeout(() => {
          const curOpt = select.options[select.selectedIndex] || select.options[0];
          valueSpan.textContent = curOpt ? curOpt.text : '';
          optionsList.forEach((o, i) => {
            o.classList.toggle('is-selected', i === select.selectedIndex);
          });
        }, 10);
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}

addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

