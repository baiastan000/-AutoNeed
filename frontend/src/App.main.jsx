import React, { useEffect, useMemo, useState } from "react";
import { categories, categoryKey, initialProducts, read, save, loadAdminProducts } from "./data.js";
import { Icon, Stars, ProductCard } from "./components.jsx";
import { translations } from "./App.jsx";

export default function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem("autoneed-lang")||"ru");
  const [theme,setTheme]=useState(()=>localStorage.getItem("autoneed-theme")||"light");
  const [products,setProducts]=useState(()=>[...loadAdminProducts(),...read("products",initialProducts)]);
  const [cart,setCart]=useState(()=>read("cart",[]));
  const [wishlist,setWishlist]=useState(()=>read("wishlist",[]));
  const [users,setUsers]=useState(()=>read("users",[]));
  const [user,setUser]=useState(()=>read("user",null));
  const [orders,setOrders]=useState(()=>read("orders",[]));
  const [bookings,setBookings]=useState(()=>read("bookings",[]).filter(b=>b.until>Date.now()));
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("all");
  const [sort,setSort]=useState("popular");
  const [panel,setPanel]=useState("");
  const [activeProduct,setActiveProduct]=useState(null);
  const [authMode,setAuthMode]=useState("signIn");
  const [reviewRating,setReviewRating]=useState(5);
  const [toast,setToast]=useState("");
  const [mobileMenu,setMobileMenu]=useState(false);

  const t=key=>translations[lang]?.[key]??translations.ru[key]??key;
  const money=amt=>`${new Intl.NumberFormat(lang==="en"?"en-US":lang==="kg"?"ky-KG":"ru-RU").format(amt)} сом`;
  const categoryName=id=>translations[lang].categories[categoryKey[id]]??id;
  const loc=v=>typeof v==="object"?v?.[lang]||v?.ru||"":v||"";

  const filtered=useMemo(()=>{
    const r=products.filter(p=>(category==="all"||p.category===category)&&`${loc(p.name)} ${p.sku}`.toLowerCase().includes(query.toLowerCase()));
    if(sort==="low")r.sort((a,b)=>a.price-b.price);
    if(sort==="high")r.sort((a,b)=>b.price-a.price);
    if(sort==="rating")r.sort((a,b)=>Number(b.rating||0)-Number(a.rating||0));
    return r;
  },[products,category,query,sort,lang]);

  useEffect(()=>{document.documentElement.lang=lang==="kg"?"ky":lang;},[lang]);
  useEffect(()=>{document.body.classList.toggle("dark",theme==="dark");localStorage.setItem("autoneed-theme",theme);},[theme]);
  useEffect(()=>{localStorage.setItem("autoneed-lang",lang);},[lang]);
  useEffect(()=>{save("products",products);},[products]);
  useEffect(()=>{save("cart",cart);},[cart]);
  useEffect(()=>{save("wishlist",wishlist);},[wishlist]);
  useEffect(()=>{save("users",users);},[users]);
  useEffect(()=>{save("user",user);},[user]);
  useEffect(()=>{save("orders",orders);},[orders]);
  useEffect(()=>{save("bookings",bookings);},[bookings]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(""),2700);return()=>clearTimeout(id);},[toast]);

  const productById=id=>products.find(p=>p.id===id);
  const changeCart=(id,delta)=>setCart(items=>{
    const f=items.find(i=>i.id===id);
    if(!f)return delta>0?[...items,{id,qty:1}]:items;
    return items.map(i=>i.id===id?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0);
  });
  const addToCart=id=>{changeCart(id,1);setToast(t("successCart"));};
  const toggleWish=id=>setWishlist(items=>items.includes(id)?items.filter(i=>i!==id):[...items,id]);
  const cartTotal=cart.reduce((s,i)=>s+(productById(i.id)?.price||0)*i.qty,0);
  const closePanel=()=>setPanel("");
  const openProduct=id=>{setActiveProduct(id);setPanel("product");};
  const reserveProduct=id=>{setActiveProduct(id);setPanel("booking");};
  const switchLang=()=>setLang(c=>c==="ru"?"kg":c==="kg"?"en":"ru");

  const submitReview=e=>{
    e.preventDefault();
    const text=new FormData(e.currentTarget).get("review")?.trim();
    if(!text||!activeProduct)return;
    if(!user){setPanel("auth");setAuthMode("signIn");setToast("Sign in to leave a review.");return;}
    setProducts(items=>items.map(p=>p.id===activeProduct?{...p,reviews:[...(p.reviews||[]),{name:user?.name||t("login"),rating:reviewRating,text}]}:p));
    setReviewRating(5);setToast(t("successReview"));
  };
  const submitBooking=e=>{
    e.preventDefault();
    const phone=new FormData(e.currentTarget).get("phone").trim();
    const p=productById(activeProduct);
    setBookings(items=>[...items,{id:p.id,name:loc(p.name),phone,until:Date.now()+86400000}]);
    closePanel();setToast(t("successBooking"));
  };
  const submitAuth=e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.currentTarget));
    if(authMode==="register"){
      if(users.some(u=>u.phone===data.phone)){setToast(t("loginError"));return;}
      const nu={name:data.name.trim(),phone:data.phone.trim(),password:data.password};
      setUsers(us=>[...us,nu]);setUser({name:nu.name,phone:nu.phone});setToast(t("registered"));
    }else{
      const found=users.find(u=>u.phone===data.phone&&u.password===data.password);
      if(!found){setToast(t("loginError"));return;}
      setUser({name:found.name,phone:found.phone});
    }
    closePanel();
  };
  const submitOrder=e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.currentTarget));
    const items=cart.map(i=>({...i,name:loc(productById(i.id)?.name),price:productById(i.id)?.price||0}));
    setOrders(o=>[...o,{number:`AN-${Date.now().toString().slice(-7)}`,name:data.name,phone:data.phone,address:data.delivery==="pickup"?t("pickup"):data.address,payment:data.payment,total:cartTotal,items,created:Date.now()}]);
    setCart([]);closePanel();setToast(t("successOrder"));
  };

  const features=[
    {icon:"gem",text:t("benefits")[0]},{icon:"cycle",text:t("benefits")[1]},
    {icon:"headset",text:t("benefits")[2]},{icon:"shield",text:t("benefits")[3]},
    {icon:"truck",text:t("benefits")[4]},
  ];

  return(
    <div className={`app-shell ${theme}`}>
      <header className="site-header">
        <a className="brand" href="#"><span className="brand-mark">A<span>N</span></span><span className="brand-copy"><strong>Auto<span>Need</span></strong><small>PARTS THAT MOVE YOU</small></span></a>
        <button className="menu-toggle" onClick={()=>setMobileMenu(o=>!o)}>☰</button>
        <nav className={`main-nav ${mobileMenu?"open":""}`}>
          <a href="#top" onClick={()=>setMobileMenu(false)}>{t("navHome")}</a>
          <a href="#catalog" onClick={()=>setMobileMenu(false)}>{t("navCatalog")}</a>
          <a href="#benefits" onClick={()=>setMobileMenu(false)}>{t("navAbout")}</a>
          <a href="#footer" onClick={()=>setMobileMenu(false)}>{t("navContacts")}</a>
        </nav>
        <label className="search-box"><Icon name="search" size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("search")}/></label>
        <div className="header-actions">
          <button className="round-button" onClick={switchLang}>{lang.toUpperCase()}</button>
          <button className="round-button" onClick={()=>setTheme(c=>c==="light"?"dark":"light")}><Icon name={theme==="light"?"moon":"sun"} size={19}/></button>
          <button className="round-button" onClick={()=>user?(setUser(null),setToast(t("signedOut"))):(setAuthMode("signIn"),setPanel("auth"))}><Icon name="user" size={20}/>{user?.name&&<span>{user.name}</span>}</button>
          <button className="round-button" onClick={()=>setPanel("wishlist")}><Icon name="heart" size={21}/>{wishlist.length>0&&<b className="count-badge">{wishlist.length}</b>}</button>
          <button className="cart-button" onClick={()=>setPanel("cart")}><Icon name="cart" size={19}/><span>{t("cart")}</span><b className="count-badge">{cart.reduce((s,i)=>s+i.qty,0)}</b></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 dangerouslySetInnerHTML={{__html:t("title")}}/>
            <p>{t("subtitle")}</p>
            <a className="gold-button" href="#catalog">{t("shopNow")} <span>→</span></a>
          </div>
          <div className="hero-photo" aria-hidden="true"/>
          <div className="hero-shade" aria-hidden="true"/>
        </section>

        <section className="feature-strip" id="benefits">
          {features.map(f=><div className="feature-item" key={f.icon}><span className="feature-icon"><Icon name={f.icon} size={31}/></span><strong>{f.text}</strong></div>)}
        </section>

        <section className="catalog-section" id="catalog">
          <div className="catalog-heading"><h2>{t("topProducts")}</h2><a href="#catalog">{t("seeAll")} →</a></div>
          <div className="catalog-controls">
            <div className="category-list">{categories.map(id=><button key={id} onClick={()=>setCategory(id)} className={category===id?"active":""}>{categoryName(id)}</button>)}</div>
            <label className="sort-control"><span>{t("sort")}:</span>
              <select value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="popular">{t("popular")}</option>
                <option value="low">{t("lowPrice")}</option>
                <option value="high">{t("highPrice")}</option>
                <option value="rating">{t("rating")}</option>
              </select>
            </label>
          </div>
          {filtered.length
            ?<div className="product-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} lang={lang} t={t} money={money} wished={wishlist.includes(p.id)} onWish={toggleWish} onAdd={addToCart} onReserve={reserveProduct} onOpen={openProduct} index={i}/>)}</div>
            :<div className="empty-results"><h3>{t("noResults")}</h3><p>{t("noResultsText")}</p></div>
          }
        </section>

        <section className="help-banner">
          <div><span className="section-kicker">{t("navNote")}</span><h2>{t("expert")}</h2></div>
          <a className="gold-button" href="tel:+996700555123">+996 700 555 123 ↗</a>
        </section>
      </main>

      <footer id="footer">
        <a className="brand" href="#top"><span className="brand-mark">A<span>N</span></span><span className="brand-copy"><strong>Auto<span>Need</span></strong><small>PARTS THAT MOVE YOU</small></span></a>
        <p>{t("footer")}</p>
        <span>© 2026 Auto Need</span>
      </footer>

      {toast&&<div className="toast-message" role="status">{toast}</div>}

      {panel&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)closePanel();}}>
        {["cart","wishlist"].includes(panel)?(
          <aside className="drawer" role="dialog">
            <div className="panel-heading">
              <div><small>AUTO NEED</small><h2>{panel==="cart"?t("cartTitle"):t("wishlist")}</h2></div>
              <button className="close-button" onClick={closePanel}><Icon name="close"/></button>
            </div>
            {panel==="cart"&&<div className="drawer-content">
              {cart.length?<>
                {cart.map(item=>{const p=productById(item.id);if(!p)return null;return(
                  <div className="cart-row" key={item.id}>
                    <img src={p.image} alt=""/>
                    <div className="cart-product"><strong>{loc(p.name)}</strong><small>{money(p.price)}</small>
                      <div className="quantity"><button onClick={()=>changeCart(item.id,-1)}>−</button><span>{item.qty}</span><button onClick={()=>changeCart(item.id,1)}>+</button></div>
                    </div>
                    <div><strong>{money(p.price*item.qty)}</strong><button className="remove-button" onClick={()=>setCart(items=>items.filter(i=>i.id!==item.id))}>{t("remove")}</button></div>
                  </div>
                );})}
                <div className="total-line"><span>{t("total")}</span><strong>{money(cartTotal)}</strong></div>
                <button className="gold-button full-button" onClick={()=>setPanel("checkout")}>{t("checkout")}</button>
              </>:<div className="empty-panel">{t("emptyCart")}</div>}
            </div>}
            {panel==="wishlist"&&<div className="drawer-content">
              {wishlist.length?wishlist.map(id=>{const p=productById(id);if(!p)return null;return(
                <div className="wish-row" key={id}>
                  <img src={p.image} alt=""/>
                  <div><strong>{loc(p.name)}</strong><small>{money(p.price)}</small></div>
                  <button onClick={()=>toggleWish(id)}>×</button>
                </div>
              );}):(<div className="empty-panel">{t("emptyWishlist")}</div>)}
            </div>}
          </aside>
        ):(
          <section className="modal-card" role="dialog">
            <div className="panel-heading">
              <div><small>AUTO NEED</small><h2>{panel==="product"?t("productDetails"):panel==="booking"?t("bookingTitle"):panel==="checkout"?t("checkoutTitle"):t("authTitle")}</h2></div>
              <button className="close-button" onClick={closePanel}><Icon name="close"/></button>
            </div>

            {panel==="product"&&activeProduct&&(()=>{
              const p=productById(activeProduct);if(!p)return null;
              const reviews=p.reviews||[];
              const score=reviews.length?reviews.reduce((s,r)=>s+Number(r.rating),0)/reviews.length:Number(p.rating||0);
              return(
                <div className="product-detail">
                  <img className="detail-image" src={p.image} alt={loc(p.name)}/>
                  <div className="detail-copy">
                    <h2>{loc(p.name)}</h2>
                    <div className="detail-rating"><span className="stars">★★★★★</span> {score.toFixed(1)} ({(p.baseReviews||0)+reviews.length} {t("reviews")})</div>
                    <strong className="detail-price">{money(p.price)}</strong>
                    <p>{loc(p.description)}</p>
                    <div className="detail-actions">
                      <button className="gold-button" onClick={()=>addToCart(p.id)}>{t("addCart")}</button>
                      <button className="outline-button" onClick={()=>reserveProduct(p.id)}>{t("reserve")}</button>
                    </div>
                  </div>
                  <section className="reviews-section">
                    <h3>{t("writeReview")}</h3>
                    {reviews.length?reviews.map((r,i)=><div className="review-row" key={i}><strong>{r.name}</strong><span className="stars">{"★".repeat(r.rating)}</span><p>{r.text}</p></div>):<p className="muted">{t("noReviews")}</p>}
                    <form onSubmit={submitReview}>
                      <Stars value={reviewRating} onChange={setReviewRating}/>
                      <div className="review-input-row"><input name="review" placeholder={t("reviewPlaceholder")} required maxLength="300"/><button className="gold-button">{t("send")}</button></div>
                    </form>
                  </section>
                </div>
              );
            })()}

            {panel==="booking"&&<form className="form-stack" onSubmit={submitBooking}>
              <p className="muted">{t("bookingText")}<br/><strong>{loc(productById(activeProduct)?.name)}</strong></p>
              <label>{t("phone")}<input name="phone" type="tel" placeholder="+996 700 000 000" required/></label>
              <button className="gold-button full-button">{t("reserve24")}</button>
            </form>}

            {panel==="auth"&&<div>
              <div className="auth-tabs">
                <button className={authMode==="signIn"?"active":""} onClick={()=>setAuthMode("signIn")}>{t("signIn")}</button>
                <button className={authMode==="register"?"active":""} onClick={()=>setAuthMode("register")}>{t("register")}</button>
              </div>
              <form className="form-stack" onSubmit={submitAuth}>
                {authMode==="register"&&<label>{t("name")}<input name="name" required/></label>}
                <label>{t("phone")}<input name="phone" type="tel" required/></label>
                <label>{t("password")}<input name="password" type="password" required/></label>
                <button className="gold-button full-button">{authMode==="register"?t("createAccount"):t("signIn")}</button>
              </form>
              <p className="demo-note">{t("demoNote")}</p>
            </div>}

            {panel==="checkout"&&<form className="form-stack" onSubmit={submitOrder}>
              <label>{t("name")}<input name="name" defaultValue={user?.name||""} required/></label>
              <label>{t("phone")}<input name="phone" type="tel" defaultValue={user?.phone||""} required/></label>
              <label>{t("deliveryType")}<select name="delivery"><option value="delivery">{t("delivery")}</option><option value="pickup">{t("pickup")}</option></select></label>
              <label>{t("address")}<input name="address"/></label>
              <label>{t("payment")}<select name="payment"><option>{t("cash")}</option><option>{t("card")}</option></select></label>
              <div className="total-line"><span>{t("total")}</span><strong>{money(cartTotal)}</strong></div>
              <button className="gold-button full-button">{t("placeOrder")}</button>
            </form>}
          </section>
        )}
      </div>}
    </div>
  );
}
