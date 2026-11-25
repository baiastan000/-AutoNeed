import React from "react";
import { photo } from "./data.js";

export function Icon({name,size=20}){
  const paths={
    search:<><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
    cart:<><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></>,
    heart:<path d="M20.2 8.7c0 4.1-8.2 10-8.2 10s-8.2-5.9-8.2-10a4.2 4.2 0 0 1 7.7-2.3.6.6 0 0 0 1 0 4.2 4.2 0 0 1 7.7 2.3Z"/>,
    user:<><circle cx="12" cy="8" r="3.3"/><path d="M5.5 20c.5-3.5 2.8-5.3 6.5-5.3s6 1.8 6.5 5.3"/></>,
    moon:<path d="M20.5 14.2A8.3 8.3 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>,
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    close:<path d="m18 6-12 12M6 6l12 12"/>,
    truck:<><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="17.5" cy="19" r="1.5"/></>,
    shield:<><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    headset:<><path d="M3 12a9 9 0 0 1 18 0"/><path d="M3 12v5a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2Zm18 0v5a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z"/></>,
    gem:<><path d="m3 9 4-6h10l4 6-9 12L3 9Z"/><path d="M3 9h18M7 3l5 18 5-18M7 3l-4 6m14-6 4 6"/></>,
    cycle:<><path d="M3 12a9 9 0 0 1 15-6l2 2"/><path d="M20 3v5h-5M21 12a9 9 0 0 1-15 6l-2-2"/><path d="M4 21v-5h5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Stars({value,onChange}){
  return <div className="review-stars">{[1,2,3,4,5].map(s=><button key={s} type="button" className={s<=value?"selected":""} onClick={()=>onChange(s)}>★</button>)}</div>;
}

export function ProductCard({product,lang,t,money,wished,onWish,onAdd,onReserve,onOpen,index}){
  const name=product.name?.[lang]||product.name?.ru||product.name;
  const reviews=product.reviews||[];
  const score=reviews.length?reviews.reduce((s,r)=>s+Number(r.rating),0)/reviews.length:Number(product.rating||0);
  const count=(product.baseReviews||0)+reviews.length;
  return(
    <article className="product-card" onClick={()=>onOpen(product.id)}>
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={name} loading="lazy"
          onError={e=>{e.currentTarget.src=photo("photo-1486262715619-67b85e0b08d3");}}/>
        {index<3&&<span className="product-tag">{index===0?"−15%":index===1?"−20%":"TOP"}</span>}
        <button className={`product-heart ${wished?"active":""}`}
          onClick={e=>{e.stopPropagation();onWish(product.id);}}>
          <Icon name="heart" size={18}/>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-title">{name}</h3>
        <div className="product-rating"><span className="stars">★</span><strong>{score.toFixed(1)}</strong><span className="rating-count">({count})</span></div>
        <div className="product-meta">
          <span className="product-price">{money(product.price)}</span>
          <span className={`stock ${product.inStock===false?"out":""}`}>{product.inStock===false?t("outStock"):t("inStock")}</span>
        </div>
        <div className="product-actions">
          <button className="add-cart" disabled={product.inStock===false}
            onClick={e=>{e.stopPropagation();onAdd(product.id);}}>
            <Icon name="cart" size={16}/><span>{t("addCart")}</span>
          </button>
          <button className="reserve-btn" onClick={e=>{e.stopPropagation();onReserve(product.id);}}>{t("reserve")}</button>
        </div>
      </div>
    </article>
  );
}
