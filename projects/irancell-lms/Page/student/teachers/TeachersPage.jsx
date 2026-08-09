export function IrancellStudentTeachersPage({params,onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const providerId=params?.provider||'';
 const offerId=params?.offer||'';
 const provider=providerId?state.marketplace.providersById?.[providerId]||null:null;
 const offer=offerId?state.marketplace.offersById?.[offerId]||null:null;
 const[reviewFilter,setReviewFilter]=useState('all');
 const[selectedTime,setSelectedTime]=useState('');
 const[messageOpen,setMessageOpen]=useState(false);
 const[messageText,setMessageText]=useState('');
 const[messageSent,setMessageSent]=useState(false);

 if(!providerId)return <><IrancellPageHeader eyebrow="بازار مدرس" title="مدرس‌ها و آموزشگاه‌های تأییدشده" description="امتیاز، سابقه، بازه قیمت و وضعیت تأیید را شفاف مقایسه کنید."/><div className="ir-provider-list">{Object.values(state.marketplace.providersById).filter(p=>p.verificationStatus==='verified').map(p=><IrancellProviderCard key={p.id} provider={{...p,completedSessions:p.completedClasses,basePrice:p.priceFrom}} onView={()=>onNavigate(`student/teachers?provider=${p.id}`)} onSelect={()=>onNavigate(`student/requests?provider=${p.id}`)}/>)}</div></>;

 const providerRole=offer?.providerRole||provider?.type||'teacher';
 const isInstitute=providerRole==='academy';
 const profileName=offer?.providerDisplayName||(isInstitute?'آکادمی ریاضی آرا':'استاد ناصری');
 const profileRating=Number(offer?.rating||provider?.rating||(isInstitute?4.8:4.9));
 const reviewCount=Number(offer?.reviewCount||(isInstitute?187:187));
 const priceFrom=Number(offer?.price||provider?.priceFrom||(isInstitute?2450000:240000));
 const availableTimes=state.marketplace.availability?.[providerId]||['امروز ۱۸:۰۰','فردا ۱۶:۳۰','پنجشنبه ۲۰:۰۰'];
 const subjects=isInstitute?['ریاضی','فیزیک','شیمی','زبان انگلیسی','پایه هفتم']:['ریاضی','فیزیک','کنکور','رفع اشکال','پایه دهم'];
 const backRoute=offer?.requestId?`student/offers?request=${offer.requestId}`:'student/classes/providers';

 const instituteReviews=[
  {id:'ir',name:'مریم علوی',role:'والدین',rating:5,date:'۲۱ فروردین ۱۴۰۳',body:'دخترم از کلاس‌های ریاضی این آموزشگاه خیلی راضیه. نحوه برخورد و پیگیری مؤسسه عالی بود.'},
  {id:'is',name:'سعید محمدی',role:'والدین',rating:4.5,date:'۱۸ فروردین ۱۴۰۳',body:'محیط آموزشی خوب، اداره و مدرسین با تجربه‌ای استفاده می‌کنند.'},
  {id:'it',name:'آراد حسینی',role:'دانش‌آموزان',rating:4.8,date:'۱۶ فروردین ۱۴۰۳',body:'کلاس‌ها منظم و توضیح مدرس‌ها برای امتحان خیلی کاربردی بود.'}
 ];

 const tutorReviews=[
  {id:'tr',name:'علی تهرانی',role:'دانش‌آموز',rating:5,date:'۵ فروردین ۱۴۰۳',body:'استاد احمدی واقعا دلسوز هستند و تا موضوع رو کامل یاد نگیری ول نمی‌کنن. ممنون ازشون.'},
  {id:'ts',name:'سپیده راستگو',role:'دانش‌آموز',rating:4.8,date:'۲ فروردین ۱۴۰۳',body:'بسیار مسلط و خوش برخورد.'}
 ];

 const visibleInstituteReviews=instituteReviews.filter(item=>reviewFilter==='all'||item.role===reviewFilter);

 function starNodes(rating){
  return [0,1,2,3,4].map(index=><i key={index} className={index<Math.round(rating)?'is-filled':''}>★</i>)
 }

 function selectPrimary(){
  if(offer){
   dispatch(IrancellMarketplaceSelectOffer(offer.id));
   onNavigate?.('student/classes');
   return
  }
  onNavigate?.(`student/requests?provider=${providerId}${selectedTime?`&time=${encodeURIComponent(selectedTime)}`:''}`)
 }

 function sendMessage(event){
  event.preventDefault();
  if(!String(messageText||'').trim())return;
  setMessageText('');
  setMessageSent(true)
 }

 function renderMessagePanel(){
  if(!messageOpen)return null;
  return <div className="ir-provider-profile__message-backdrop" role="presentation" onMouseDown={()=>setMessageOpen(false)}>
   <form className="ir-provider-profile__message-sheet" onSubmit={sendMessage} onMouseDown={event=>event.stopPropagation()}>
    <span className="ir-provider-profile__message-handle" aria-hidden="true"/>
    <header>
     <div>
      <strong>پیام به {profileName}</strong>
      <small>پیامت را بنویس؛ پاسخ در بخش کلاس‌ها پیگیری می‌شود.</small>
     </div>
     <button type="button" aria-label="بستن" onClick={()=>setMessageOpen(false)}>×</button>
    </header>
    {messageSent&&<p className="ir-provider-profile__message-success">پیام شما ثبت شد.</p>}
    <textarea rows={4} value={messageText} onChange={event=>{setMessageText(event.target.value);setMessageSent(false)}} placeholder="پیام خود را بنویسید..."/>
    <button type="submit" disabled={!messageText.trim()}>ارسال پیام</button>
   </form>
  </div>
 }

 if(isInstitute){
  return <section className="ir-provider-profile is-institute" aria-label={`پروفایل ${profileName}`}>
   <header className="ir-provider-profile__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.(backRoute)}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>{profileName}</h1>
    <span/>
   </header>

   <article className="ir-provider-profile__hero">
    <div className="ir-provider-profile__academy-logo" aria-hidden="true">
     <svg viewBox="0 0 64 64"><rect x="13" y="9" width="38" height="46" rx="9"/><path d="M23 45V22h20v23"/><path d="M28 29h10M28 35h10"/><circle cx="22" cy="21" r="7"/><path d="M18 21h8M22 17v8"/></svg>
    </div>
    <h2>{profileName}</h2>
    <div className="ir-provider-profile__hero-badges">
     <span className="is-category">آموزشگاه</span>
     <span className="is-verified">احراز شده</span>
    </div>
    <div className="ir-provider-profile__hero-rating">
     <span>{starNodes(profileRating)}</span>
     <strong>{profileRating.toLocaleString('fa-IR',{maximumFractionDigits:1})}</strong>
     <small>({IrancellFormatPersianNumber(reviewCount)} نظر)</small>
    </div>
    <div className="ir-provider-profile__hero-actions">
     <button type="button" className="is-primary" onClick={selectPrimary}>{offer?'انتخاب پیشنهاد':'درخواست پیشنهاد'}</button>
     <button type="button" className="is-secondary" onClick={()=>onNavigate?.('student/classes/providers')}>مشاهده کلاس‌ها</button>
    </div>
   </article>

   <section className="ir-provider-profile__card ir-provider-profile__credentials">
    <h2>اعتبارات و ضمانت</h2>
    <div>
     <span>پشتیبانی والدین</span>
     <span>جایگزینی مدرس SLA</span>
     <span>مجوز آموزشگاه</span>
     <span>مدرسین تأیید شده</span>
     <span>پرداخت امن</span>
    </div>
   </section>

   <section className="ir-provider-profile__card ir-provider-profile__about">
    <h2>درباره آموزشگاه</h2>
    <p>آکادمی ریاضی آرا با بیش از ۸ سال تجربه در تدریس ریاضی، فیزیک و شیمی مقاطع متوسطه، با تیمی از اساتید ارشد و دکتری دانشگاه‌های برتر، بهترین روش‌های آموزشی را برای موفقیت دانش‌آموزان در امتحانات نهایی و کنکور فراهم می‌کند.</p>
   </section>

   <div className="ir-provider-profile__chips">
    {subjects.map(subject=><span key={subject}>{subject}</span>)}
   </div>

   <section className="ir-provider-profile__stats">
    <div><strong>۱۲</strong><span>تعداد مدرسین</span></div>
    <div><strong>۳۴۰</strong><span>دانش‌آموزان</span></div>
    <div><strong>۹۶٪</strong><span>رضایت والدین</span></div>
    <div><strong>۱۰۰٪</strong><span>جایگزینی SLA</span></div>
   </section>

   <section className="ir-provider-profile__card ir-provider-profile__samples">
    <header>
     <h2>نمونه تدریس و ویدیوها</h2>
     <button type="button" onClick={()=>onNavigate?.('student/binayi')}>مشاهده همه</button>
    </header>
    <div>
     <button type="button" onClick={()=>onNavigate?.('student/binayi/course/content-math-1?view=video')}>
      <span className="ir-provider-profile__sample-image is-classroom">
       <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></i>
       <em>رایگان</em>
      </span>
      <strong>رفع اشکال ریاضی نهم</strong>
      <small>۱۳:۴۵</small>
     </button>
     <button type="button" onClick={()=>onNavigate?.('student/binayi/course/content-physics-1?view=video')}>
      <span className="ir-provider-profile__sample-image is-digital">
       <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></i>
      </span>
      <strong>آمادگی کنکور</strong>
      <small>۱۸:۲۰</small>
     </button>
    </div>
   </section>

   <section className="ir-provider-profile__card ir-provider-profile__availability">
    <h2>زمان‌های در دسترس</h2>
    <div>
     {availableTimes.slice(0,3).map((time,index)=><button type="button" key={time} className={selectedTime===time||(!selectedTime&&index===0)?'is-active':''} onClick={()=>setSelectedTime(time)}>{time}</button>)}
    </div>
   </section>

   <section className="ir-provider-profile__card ir-provider-profile__pricing">
    <h2>تعرفه‌ها و پرداخت</h2>
    <div className="ir-provider-profile__price-row">
     <span>شروع از</span>
     <strong>{IrancellFormatCurrency(priceFrom)}</strong>
    </div>
    <p>امکان دریافت چند پیشنهاد و مقایسه قیمت</p>
    <small>پرداخت امن امانی (وجه تا تأیید شما نزد ما می‌ماند)</small>
   </section>

   <section className="ir-provider-profile__card ir-provider-profile__rules">
    <h2>قوانین و لغو</h2>
    <ul>
     <li>لغو تا ۱۲ ساعت قبل از جلسه بدون جریمه</li>
     <li>تعهد کامل مؤسسه به جایگزینی مدرس در صورت عدم رضایت</li>
     <li>پشتیبانی مستقیم و اختصاصی برای والدین</li>
    </ul>
   </section>

   <section className="ir-provider-profile__card ir-provider-profile__reviews">
    <header>
     <h2>نظرات کاربران</h2>
     <button type="button" onClick={()=>setReviewFilter('all')}>همه نظرات</button>
    </header>
    <nav>
     <button type="button" className={reviewFilter==='all'?'is-active':''} onClick={()=>setReviewFilter('all')}>همه</button>
     <button type="button" className={reviewFilter==='والدین'?'is-active':''} onClick={()=>setReviewFilter('والدین')}>والدین</button>
     <button type="button" className={reviewFilter==='دانش‌آموزان'?'is-active':''} onClick={()=>setReviewFilter('دانش‌آموزان')}>دانش‌آموزان</button>
    </nav>
    <div className="ir-provider-profile__review-list">
     {visibleInstituteReviews.map(review=><article key={review.id}>
      <span className="ir-provider-profile__review-avatar">{review.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span>
      <div>
       <header><strong>{review.name}</strong><small>{review.date}</small></header>
       <span className="ir-provider-profile__review-stars">{starNodes(review.rating)} <b>{review.rating.toLocaleString('fa-IR')}</b></span>
       <p>{review.body}</p>
      </div>
     </article>)}
    </div>
   </section>

   <footer className="ir-provider-profile__sticky-action">
    <button type="button" className="ir-provider-profile__chat-button" aria-label="ارسال پیام" onClick={()=>setMessageOpen(true)}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 1-3-6.2"/><path d="m5 19-1 3 3-1"/><path d="M8 11h8"/></svg>
    </button>
    <button type="button" className="ir-provider-profile__sticky-primary" onClick={selectPrimary}>{offer?'انتخاب و ادامه':'درخواست پیشنهاد'}</button>
   </footer>

   {renderMessagePanel()}
  </section>
 }

 return <section className="ir-provider-profile is-tutor" aria-label={`پروفایل ${profileName}`}>
  <header className="ir-provider-profile__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.(backRoute)}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>پروفایل مدرس</h1>
   <span/>
  </header>

  <article className="ir-provider-profile__hero">
   <div className="ir-provider-profile__teacher-avatar" aria-hidden="true"><span>{profileName.split(' ').filter(Boolean).slice(-2).map(part=>part[0]).join('')}</span></div>
   <h2>{profileName}</h2>
   <div className="ir-provider-profile__hero-badges">
    <span className="is-category">مدرس مستقل</span>
    <span className="is-verified">احراز شده</span>
   </div>
   <div className="ir-provider-profile__hero-rating">
    <span>{starNodes(profileRating)}</span>
    <strong>{profileRating.toLocaleString('fa-IR',{maximumFractionDigits:1})}</strong>
    <small>({IrancellFormatPersianNumber(reviewCount)} نظر)</small>
   </div>
   <div className="ir-provider-profile__hero-actions">
    <button type="button" className="is-primary" onClick={selectPrimary}>{offer?'رزرو این پیشنهاد':'رزرو کلاس خصوصی'}</button>
    <button type="button" className="is-secondary" onClick={()=>setMessageOpen(true)}>ارسال پیام</button>
   </div>
  </article>

  <section className="ir-provider-profile__card ir-provider-profile__credentials">
   <h2>تأییدیه تخصصی</h2>
   <div>
    <span>تأیید تخصص</span>
    <span>سابقه آموزشی معتبر</span>
    <span>پرداخت امن</span>
    <span>احراز هویت</span>
   </div>
  </section>

  <section className="ir-provider-profile__card ir-provider-profile__about">
   <h2>درباره مدرس</h2>
   <p>با بیش از ۸ سال تجربه در تدریس ریاضی و فیزیک کنکور، هدف من ساده‌سازی مفاهیم پیچیده برای دانش‌آموزان است. من معتقدم هر دانش‌آموز با متد درست می‌تواند به درصدهای بالا در کنکور برسد.</p>
  </section>

  <div className="ir-provider-profile__chips">
   {subjects.map(subject=><span key={subject}>{subject}</span>)}
  </div>

  <section className="ir-provider-profile__stats">
   <div><strong>۴۲۰</strong><span>تعداد کلاس‌ها</span></div>
   <div><strong>۹۸٪</strong><span>درصد رضایت</span></div>
   <div><strong>۴.۹</strong><span>میانگین امتیاز</span></div>
   <div><strong>۱۵ دقیقه</strong><span>زمان پاسخ</span></div>
  </section>

  <section className="ir-provider-profile__card ir-provider-profile__samples">
   <header><h2>ویدیوهای آموزشی</h2></header>
   <div>
    <button type="button" onClick={()=>onNavigate?.('student/binayi/course/content-physics-1?view=video')}>
     <span className="ir-provider-profile__sample-image is-studio">
      <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></i>
     </span>
     <strong>نیروی فیزیک</strong>
     <small>۱۸:۳۰</small>
    </button>
    <button type="button" onClick={()=>onNavigate?.('student/binayi/course/content-math-1?view=video')}>
     <span className="ir-provider-profile__sample-image is-board">
      <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></i>
      <em>رایگان</em>
     </span>
     <strong>آموزش حد و پیوستگی</strong>
     <small>۱۵:۳۰</small>
    </button>
   </div>
  </section>

  <section className="ir-provider-profile__card ir-provider-profile__pricing is-tutor-price">
   <h2>نرخ تدریس</h2>
   <div className="ir-provider-profile__price-row">
    <span>کلاس ۶۰ دقیقه</span>
    <strong>{IrancellFormatCurrency(priceFrom)}</strong>
   </div>
   <p>پرداخت امن امانی (ضمانت بازگشت وجه)</p>
  </section>

  <section className="ir-provider-profile__card ir-provider-profile__reviews">
   <header><h2>نظرات دانش‌آموزان</h2></header>
   <div className="ir-provider-profile__review-list">
    {tutorReviews.map(review=><article key={review.id}>
     <span className="ir-provider-profile__review-avatar">{review.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span>
     <div>
      <header><strong>{review.name}</strong><small>{review.date}</small></header>
      <span className="ir-provider-profile__review-stars">{starNodes(review.rating)} <b>{review.rating.toLocaleString('fa-IR')}</b></span>
      <p>{review.body}</p>
     </div>
    </article>)}
   </div>
  </section>

  <footer className="ir-provider-profile__sticky-action">
   <button type="button" className="ir-provider-profile__chat-button" aria-label="ارسال پیام" onClick={()=>setMessageOpen(true)}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 1-3-6.2"/><path d="m5 19-1 3 3-1"/><path d="M8 11h8"/></svg>
   </button>
   <button type="button" className="ir-provider-profile__sticky-primary" onClick={selectPrimary}>{offer?'رزرو این پیشنهاد':'رزرو کلاس خصوصی'}</button>
  </footer>

  {renderMessagePanel()}
 </section>
}