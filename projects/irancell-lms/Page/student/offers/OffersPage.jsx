export function IrancellStudentOffersPage({params,onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const requestId=params.request||Object.keys(state.marketplace.requestsById).at(-1);
 const request=state.marketplace.requestsById[requestId];
 const[activeFilter,setActiveFilter]=useState('all');
 const[showFullQuestion,setShowFullQuestion]=useState(false);
 const[expandedOfferId,setExpandedOfferId]=useState('');

 const offers=Object.values(state.marketplace.offersById||{})
  .filter(item=>item.requestId===requestId&&item.status!=='withdrawn')
  .sort((first,second)=>{
   if(Boolean(first.featured)!==Boolean(second.featured))return first.featured?-1:1;
   return Number(second.rating||0)-Number(first.rating||0)
  });

 const filters=[
  {id:'teacher',label:'مدرس خصوصی'},
  {id:'academy',label:'مؤسسه معتبر'},
  {id:'online',label:'آنلاین'},
  {id:'inperson',label:'حضوری'}
 ];

 const filteredOffers=offers.filter(offer=>{
  if(activeFilter==='all')return true;
  if(activeFilter==='teacher')return offer.providerRole==='teacher';
  if(activeFilter==='academy')return offer.providerRole==='academy';
  if(activeFilter==='online')return Array.isArray(offer.modes)&&offer.modes.includes('آنلاین');
  if(activeFilter==='inperson')return Array.isArray(offer.modes)&&offer.modes.includes('حضوری');
  return true
 });

 if(!request)return <section className="ir-offers-marketplace">
  <header className="ir-offers-marketplace__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <div><h1>پیشنهادها</h1><p>مؤسسات پیشنهادی برای سؤال شما</p></div>
  </header>
  <article className="ir-offers-marketplace__empty">
   <strong>درخواستی برای نمایش پیدا نشد</strong>
   <p>یک درخواست جدید ثبت کنید تا پیشنهادهای مناسب برای شما نمایش داده شوند.</p>
   <button type="button" onClick={()=>onNavigate?.('student/requests')}>ثبت درخواست جدید</button>
  </article>
 </section>;

 function providerName(offer){
  return offer.providerDisplayName||state.marketplace.providersById?.[offer.providerId]?.name||offer.assignedTeacherName||'تأمین‌کننده آموزشی'
 }

 function providerInitials(name){
  return String(name||'').split(/\s+/).filter(Boolean).slice(-2).map(part=>part[0]).join('')
 }

 function selectOffer(offer){
  if(state.marketplace.selectedOfferId!==offer.id)dispatch(IrancellMarketplaceSelectOffer(offer.id));
  onNavigate?.(`student/classes/checkout/${offer.id}`)
 }

 function toggleDetails(offerId){
  setExpandedOfferId(current=>current===offerId?'':offerId)
 }

 function filterOffer(filterId){
  setActiveFilter(current=>current===filterId?'all':filterId)
 }

 return <section className="ir-offers-marketplace" aria-label="پیشنهادهای مدرس و مؤسسه">
  <header className="ir-offers-marketplace__topbar">
   <button type="button" className="ir-offers-marketplace__back" aria-label="بازگشت به کلاس‌ها" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <div>
    <h1>پیشنهادها</h1>
    <p>مؤسسات پیشنهادی برای سؤال شما</p>
   </div>
  </header>

  <article className="ir-offers-marketplace__question">
   <header>
    <span>سؤال شما</span>
    <b>پاسخ‌های دریافت شده {IrancellFormatPersianNumber(offers.length)}</b>
   </header>
   <h2>{request.topic}</h2>
   {showFullQuestion&&request.description&&<p>{request.description}</p>}
   <button type="button" onClick={()=>setShowFullQuestion(value=>!value)}>
    {showFullQuestion?'بستن متن کامل':'مشاهده کامل سؤال'}
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>
   </button>
  </article>

  <nav className="ir-offers-marketplace__filters" aria-label="فیلتر پیشنهادها">
   <button type="button" className="ir-offers-marketplace__filter-reset" aria-label="حذف فیلترها" onClick={()=>setActiveFilter('all')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6"/></svg>
   </button>
   {filters.map(filter=><button type="button" key={filter.id} className={activeFilter===filter.id?'is-active':''} aria-pressed={activeFilter===filter.id} onClick={()=>filterOffer(filter.id)}>{filter.label}</button>)}
  </nav>

  <section className="ir-offers-marketplace__received" aria-labelledby="irancell-offers-received-title">
   <h2 id="irancell-offers-received-title">پیشنهادهای دریافتی</h2>

   {filteredOffers.length?<div className="ir-offers-marketplace__list">
    {filteredOffers.map(offer=>{
     const name=providerName(offer);
     const selected=state.marketplace.selectedOfferId===offer.id;
     const expanded=expandedOfferId===offer.id;
     const rating=Math.max(0,Math.min(5,Number(offer.rating)||0));
     const filledStars=Math.round(rating);
     const modes=Array.isArray(offer.modes)?offer.modes:[];
     const badges=Array.isArray(offer.badges)?offer.badges:[];

     return <article key={offer.id} className={`ir-market-offer-card ${offer.featured?'is-featured':''} ${selected?'is-selected':''}`}>
      {offer.featured&&<span className="ir-market-offer-card__corner is-featured" aria-label="پیشنهاد برتر">
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 8 4 3 3-6 3 6 4-3-2 9H7Z"/><path d="M7 20h10"/></svg>
      </span>}

      {offer.popular&&<span className="ir-market-offer-card__corner is-popular" aria-label="پیشنهاد محبوب">
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9Z"/></svg>
      </span>}

      <header className="ir-market-offer-card__header">
       <div className={`ir-market-offer-card__avatar ${offer.providerRole==='teacher'?'is-teacher':'is-academy'}`}>
        <span>{providerInitials(name)}</span>
       </div>

       <div className="ir-market-offer-card__identity">
        <strong>{name}</strong>
        {offer.assignedTeacherName&&offer.assignedTeacherName!==name&&<small>{offer.assignedTeacherName}</small>}
       </div>

       <div className="ir-market-offer-card__rating" aria-label={`امتیاز ${rating} از ۵`}>
        <span>{[0,1,2,3,4].map(index=><i key={index} className={index<filledStars?'is-filled':''}>★</i>)}</span>
        <b>{rating.toLocaleString('fa-IR',{maximumFractionDigits:1})}</b>
       </div>
      </header>

      {badges.length>0&&<div className="ir-market-offer-card__badges">
       {badges.map((badge,index)=><span key={`${offer.id}-${badge}`} className={index===0&&offer.featured?'is-crown':''}>
        {index===0&&offer.featured&&<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 8 4 3 3-6 3 6 4-3-2 9H7Z"/></svg>}
        {badge.includes('پاسخ سریع')&&<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 9-13h-6Z"/></svg>}
        {badge.includes('تأیید')&&<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-9"/></svg>}
        {badge}
       </span>)}
      </div>}

      <div className="ir-market-offer-card__price-row">
       <div className="ir-market-offer-card__price">
        <strong>{IrancellFormatCurrency(offer.price)}</strong>
       </div>
       <span>قیمت پیشنهادی</span>
      </div>

      <p className={`ir-market-offer-card__chance is-${offer.acceptanceTone||'medium'}`}>{offer.acceptanceLabel||'شانس پذیرش: متوسط'}</p>

      <p className="ir-market-offer-card__description">{offer.description||'پیشنهاد آموزشی متناسب با نیاز و زمان درخواستی شما.'}</p>

      <div className="ir-market-offer-card__meta">
       <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>
        {IrancellFormatPersianNumber(offer.sessionCount||1)} جلسه {IrancellFormatPersianNumber(offer.sessionDuration||60)} دقیقه‌ای
       </span>
       <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>
        {offer.responseLabel||'پاسخ‌دهی سریع'}
       </span>
      </div>

      {modes.length>0&&<div className="ir-market-offer-card__modes">
       {modes.map(mode=><span key={`${offer.id}-${mode}`} className={mode==='فوری'?'is-urgent':mode==='آنلاین'?'is-online':mode==='تضمین‌شده'?'is-guaranteed':''}>{mode}</span>)}
      </div>}

      {expanded&&<section className="ir-market-offer-card__details">
       <div>
        <span>نوع ارائه‌دهنده</span>
        <strong>{offer.providerRole==='teacher'?'مدرس خصوصی':'مؤسسه آموزشی'}</strong>
       </div>
       <div>
        <span>زمان پیشنهادی</span>
        <strong>{new Date(offer.proposedTime).toLocaleString('fa-IR',{weekday:'long',hour:'2-digit',minute:'2-digit'})}</strong>
       </div>
       <div>
        <span>امتیاز کاربران</span>
        <strong>{rating.toLocaleString('fa-IR')} از ۵</strong>
       </div>
       <p>انتخاب این پیشنهاد، کلاس را برای شما رزرو می‌کند و مراحل تأیید والد و پرداخت امن در ادامه جریان انجام می‌شود.</p>
      </section>}

      <footer className="ir-market-offer-card__actions">
       <button type="button" className="is-primary" disabled={selected} onClick={()=>selectOffer(offer)}>{selected?'انتخاب شده':'انتخاب و ادامه'}</button>
       <button type="button" className="is-secondary" onClick={()=>onNavigate?.(`student/teachers?provider=${offer.providerId}&offer=${offer.id}`)}>مشاهده پروفایل</button>
      </footer>
     </article>
    })}
   </div>:<article className="ir-offers-marketplace__empty">
    <strong>پیشنهادی با این فیلتر پیدا نشد</strong>
    <p>فیلترها را تغییر دهید تا سایر مدرس‌ها و مؤسسات نمایش داده شوند.</p>
    <button type="button" onClick={()=>setActiveFilter('all')}>نمایش همه پیشنهادها</button>
   </article>}
  </section>
 </section>
}