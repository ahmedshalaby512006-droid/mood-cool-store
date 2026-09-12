
/* ===== Product data (approximate Egyptian market prices, for demo/display purposes) ===== */
const PRODUCTS = [
  {id:1, brand:'أل جي', model:'ARTCOOL انفرتر', hp:'1.5', type:'cool-heat', tech:'inverter', price:24999, old:27500, badge:'الأكثر مبيعًا'},
  {id:2, brand:'أل جي', model:'ديولار انفرتر', hp:'2.25', type:'cool-heat', tech:'inverter', price:34999, old:null},
  {id:3, brand:'شارب', model:'بريميوم بلس', hp:'1.5', type:'cool', tech:'normal', price:18770, old:null},
  {id:4, brand:'شارب', model:'بلازما ديجيتال', hp:'2.25', type:'cool-heat', tech:'inverter', price:31500, old:34900},
  {id:5, brand:'تورنيدو', model:'ديچيتال تبريد سريع', hp:'2.25', type:'cool', tech:'normal', price:30699, old:null},
  {id:6, brand:'تورنيدو', model:'انفرتر ديچيتال مستورد', hp:'2.25', type:'cool-heat', tech:'inverter', price:40499, old:null, badge:'إنفرتر'},
  {id:7, brand:'كاريير', model:'كلاسيك كول كونسيلد', hp:'3', type:'cool-heat', tech:'normal', price:43900, old:null},
  {id:8, brand:'كاريير', model:'إكسترا انفرتر', hp:'1.5', type:'cool', tech:'inverter', price:23000, old:25500},
  {id:9, brand:'هاير', model:'سمارت بارد فقط', hp:'1.5', type:'cool', tech:'normal', price:23350, old:null},
  {id:10, brand:'هاير', model:'سمارت بارد ساخن', hp:'1.5', type:'cool-heat', tech:'normal', price:26150, old:null},
  {id:11, brand:'فريش', model:'ميجا كول انفرتر', hp:'1.5', type:'cool', tech:'inverter', price:19500, old:21900, badge:'عرض خاص'},
  {id:12, brand:'فريش', model:'ميجا كول ديجيتال', hp:'2.25', type:'cool-heat', tech:'inverter', price:29900, old:null},
  {id:13, brand:'يونيون اير', model:'ستاندرد بارد فقط', hp:'1.5', type:'cool', tech:'normal', price:17500, old:null, badge:'أوفر سعر'},
  {id:14, brand:'توشيبا', model:'انفرتر بارد ساخن', hp:'1.5', type:'cool-heat', tech:'inverter', price:26500, old:null},
  {id:15, brand:'ميديا', model:'إيكو انفرتر', hp:'1.5', type:'cool', tech:'inverter', price:21000, old:23000, badge:'موفر طاقة'},
  {id:16, brand:'وايت ويل', model:'ستاندرد بارد فقط', hp:'1.5', type:'cool', tech:'normal', price:16800, old:null},
  {id:17, brand:'كاريير', model:'باور كول', hp:'5', type:'cool', tech:'normal', price:76500, old:null},
  {id:18, brand:'أل جي', model:'دوال انفرتر', hp:'3', type:'cool-heat', tech:'inverter', price:52000, old:null},
];

const typeLabel = {cool:'بارد فقط', 'cool-heat':'بارد وساخن'};
const techLabel = {inverter:'إنفرتر', normal:'عادي'};

let cart = {}; // id -> qty
let activeBrand = 'all';
let activeHp = 'all';
let activeType = 'all';

const acIconSvg = `<svg viewBox="0 0 100 60" fill="none"><rect x="4" y="4" width="92" height="36" rx="10" fill="none" stroke="currentColor" stroke-width="3"/><rect x="14" y="16" width="60" height="5" rx="2.5" fill="currentColor"/><rect x="14" y="27" width="40" height="4" rx="2" fill="currentColor" opacity="0.5"/><circle cx="82" cy="22" r="6" fill="currentColor"/><path d="M30 44 Q34 52 30 58" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/><path d="M50 44 Q54 53 50 60" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/><path d="M70 44 Q74 52 70 58" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/></svg>`;

function buildFilters(){
  const brands = ['all', ...new Set(PRODUCTS.map(p => p.brand))];
  const hps = ['all', ...new Set(PRODUCTS.map(p => p.hp))];

  document.getElementById('brandFilters').innerHTML = brands.map(b =>
    `<button class="chip ${b===activeBrand?'active':''}" onclick="setFilter('brand','${b}')">${b==='all'?'كل الماركات':b}</button>`
  ).join('');

  document.getElementById('hpFilters').innerHTML = hps.map(h =>
    `<button class="chip ${h===activeHp?'active':''}" onclick="setFilter('hp','${h}')">${h==='all'?'كل القدرات':h+' حصان'}</button>`
  ).join('');

  document.getElementById('typeFilters').innerHTML = ['all','cool','cool-heat'].map(t =>
    `<button class="chip ${t===activeType?'active':''}" onclick="setFilter('type','${t}')">${t==='all'?'كل الأنواع':typeLabel[t]}</button>`
  ).join('');
}

function setFilter(kind, val){
  if(kind==='brand') activeBrand = val;
  if(kind==='hp') activeHp = val;
  if(kind==='type') activeType = val;
  buildFilters();
  renderProducts();
}

function renderProducts(){
  const search = document.getElementById('searchInput').value.trim().toLowerCase();
  const sort = document.getElementById('sortSelect').value;

  let list = PRODUCTS.filter(p => {
    if(activeBrand!=='all' && p.brand!==activeBrand) return false;
    if(activeHp!=='all' && p.hp!==activeHp) return false;
    if(activeType!=='all' && p.type!==activeType) return false;
    if(search && !(p.brand+' '+p.model).toLowerCase().includes(search)) return false;
    return true;
  });

  if(sort==='low') list = list.slice().sort((a,b)=>a.price-b.price);
  if(sort==='high') list = list.slice().sort((a,b)=>b.price-a.price);

  const grid = document.getElementById('productGrid');
  if(list.length===0){
    grid.innerHTML = `<div class="no-results">مفيش نتائج مطابقة، جرب تغيير الفلاتر 🔍</div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="card">
      ${p.badge ? `<div class="card-badge ${p.tech==='inverter'?'eco':''}">${p.badge}</div>` : ''}
      <div class="card-media">${acIconSvg}</div>
      <div class="card-body">
        <div class="brand-tag">${p.brand}</div>
        <div class="card-title">${p.model} — ${p.hp} حصان</div>
        <div class="spec-row">
          <span class="spec-pill">${typeLabel[p.type]}</span>
          <span class="spec-pill">${techLabel[p.tech]}</span>
        </div>
        <div class="price-row">
          <div class="price">
            <span class="now">${p.price.toLocaleString('ar-EG')} ج.م</span>
            ${p.old ? `<span class="old">${p.old.toLocaleString('ar-EG')} ج.م</span>` : ''}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
}
function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  renderCart();
}
function removeItem(id){
  delete cart[id];
  renderCart();
}

function renderCart(){
  const ids = Object.keys(cart);
  const countEl = document.getElementById('cartCount');
  const totalCount = ids.reduce((s,id)=>s+cart[id],0);
  countEl.textContent = totalCount;

  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');

  if(ids.length===0){
    body.innerHTML = `<div class="drawer-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      عربتك فاضية دلوقتي
    </div>`;
    foot.style.display = 'none';
    return;
  }

  let total = 0;
  body.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(x=>x.id==id);
    const qty = cart[id];
    total += p.price * qty;
    return `
      <div class="cart-item">
        <div class="thumb">${acIconSvg}</div>
        <div class="info">
          <h5>${p.brand} ${p.model}</h5>
          <span>${p.hp} حصان • ${p.price.toLocaleString('ar-EG')} ج.م</span>
          <div class="qty-ctrl">
            <button onclick="changeQty(${p.id},-1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${p.id},1)">+</button>
          </div>
        </div>
        <button class="remove" onclick="removeItem(${p.id})">حذف</button>
      </div>
    `;
  }).join('');

  document.getElementById('cartTotal').textContent = total.toLocaleString('ar-EG') + ' ج.م';
  foot.style.display = 'block';
}

function openCart(){
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function closeCart(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

function openCheckout(){
  const ids = Object.keys(cart);
  if(ids.length===0) return;
  let total = ids.reduce((s,id)=> s + PRODUCTS.find(p=>p.id==id).price * cart[id], 0);

  document.getElementById('checkoutContent').innerHTML = `
    <h3>إتمام الطلب</h3>
    <p>هنتواصل معاك لتأكيد الطلب والتوصيل والتركيب.</p>
    <label>الاسم بالكامل</label>
    <input type="text" id="ckName" placeholder="اكتب اسمك">
    <label>رقم الموبايل</label>
    <input type="text" id="ckPhone" placeholder="01xxxxxxxxx">
    <label>العنوان</label>
    <input type="text" id="ckAddress" placeholder="المحافظة والمنطقة">
    <div class="subtotal-row"><span>إجمالي الطلب</span><b>${total.toLocaleString('ar-EG')} ج.م</b></div>
    <button class="checkout-btn" onclick="submitOrder()">تأكيد الطلب</button>
  `;
  document.getElementById('checkoutOverlay').classList.add('show');
}

const STORE_WHATSAPP_NUMBER = '201551644292'; // 01551644292 بصيغة دولية بدون صفر وبكود مصر 20

function buildOrderWhatsAppLink(name, phone, address, total){
  const ids = Object.keys(cart);
  let lines = [];
  ids.forEach(id => {
    const p = PRODUCTS.find(x => x.id == id);
    const qty = cart[id];
    const lineTotal = (p.price * qty).toLocaleString('ar-EG');
    lines.push(`• ${p.brand} ${p.model} (${p.hp} حصان) × ${qty} = ${lineTotal} ج.م`);
  });

  let msg = `طلب جديد من متجر Mood Cool 🧊\n\n`;
  msg += `👤 الاسم: ${name}\n`;
  msg += `📱 الموبايل: ${phone}\n`;
  msg += `📍 العنوان: ${address || 'لم يُذكر'}\n\n`;
  msg += `🛒 الأجهزة المطلوبة:\n${lines.join('\n')}\n\n`;
  msg += `💰 الإجمالي: ${total.toLocaleString('ar-EG')} ج.م`;

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function submitOrder(){
  const name = document.getElementById('ckName').value.trim();
  const phone = document.getElementById('ckPhone').value.trim();
  const address = document.getElementById('ckAddress').value.trim();
  if(!name || !phone){
    alert('من فضلك اكتب الاسم ورقم الموبايل');
    return;
  }

  const ids = Object.keys(cart);
  const total = ids.reduce((s,id)=> s + PRODUCTS.find(p=>p.id==id).price * cart[id], 0);
  const waLink = buildOrderWhatsAppLink(name, phone, address, total);

  // يفتح واتساب في تاب جديد مع تفاصيل الطلب جاهزة — المستخدم لازم يدوس "إرسال" جوه واتساب
  window.open(waLink, '_blank');

  document.getElementById('checkoutContent').innerHTML = `
    <div class="success-box">
      <div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
      <h3>خطوة أخيرة يا ${name}!</h3>
      <p>فتحنالك واتساب وجهزنا رسالة فيها كل تفاصيل طلبك — تأكيد وصولها بس دوس "إرسال" جوه واتساب.</p>
      <a href="${waLink}" target="_blank" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:6px;">فتح واتساب تاني</a>
    </div>
  `;
  cart = {};
  renderCart();
}

function closeCheckout(){
  document.getElementById('checkoutOverlay').classList.remove('show');
}

/* init */
buildFilters();
renderProducts();
renderCart();
