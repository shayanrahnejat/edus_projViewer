export function IrancellSharedRatingPage({params,onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const session=state.classroom.sessionsById[params.id];
 const provider=state.marketplace.providersById?.[session?.providerId]||null;
 const existingRating=Object.values(state.quality.ratingsById||{}).find(item=>item.sessionId===params.id&&item.ownerId===state.session.currentUserId)||null;
 const[scores,setScores]=useState({overall:5,teaching:5,communication:5,content:5});
 const[comment,setComment]=useState('');
 const[anonymous,setAnonymous]=useState(false);
 const[submitted,setSubmitted]=useState(Boolean(existingRating));
 const canRate=Boolean(session&&session.status==='completed'&&!existingRating);

 if(!session)return <IrancellStatePanel state="error" title="جلسه پیدا نشد" description="برای این ارزیابی، جلسه معتبری پیدا نشد."/>;

 function setDimensionScore(key,value){
  setScores(current=>({...current,[key]:value}))
 }

 function submit(){
  if(!canRate)return;
  const values=Object.values(scores).map(value=>Math.max(1,Math.min(5,Number(value)||1)));
  const score=Math.round((values.reduce((sum,value)=>sum+value,0)/values.length)*10)/10;
  dispatch(IrancellQualityRate(session.id,session.providerId,score,comment.trim(),scores,anonymous));
  setSubmitted(true)
 }

 function renderStars(key){
  return <span className="ir-post-rating-page__stars" aria-label={`امتیاز ${scores[key]} از ۵`}>
   {[1,2,3,4,5].map(value=><button type="button" key={value} className={value<=scores[key]?'is-active':''} aria-label={`${value} ستاره`} onClick={()=>setDimensionScore(key,value)}>★</button>)}
  </span>
 }

 if(submitted)return <section className="ir-post-rating-page is-success">
  <header className="ir-student-subpage__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>نظر شما درباره این جلسه</h1>
   <span/>
  </header>
  <div className="ir-post-rating-page__success-card">
   <span>✓</span>
   <h2>ممنون از بازخوردت</h2>
   <p>نظر شما ثبت شد و برای بهبود کیفیت کلاس‌ها استفاده می‌شود.</p>
   <button type="button" onClick={()=>onNavigate?.('student/classes')}>بازگشت به کلاس‌ها</button>
  </div>
 </section>;

 return <section className="ir-post-rating-page">
  <header className="ir-student-subpage__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>نظر شما درباره این جلسه</h1>
   <span/>
  </header>

  <article className="ir-post-rating-page__provider">
   <span className="ir-post-rating-page__avatar">{String(provider?.name||session.providerDisplayName||'م').trim().split(/\s+/).slice(-2).map(part=>part.charAt(0)).join('')}</span>
   <div>
    <strong>{provider?.name||session.providerDisplayName||'مدرس ایرانسل'}</strong>
    <small>{session.title}</small>
   </div>
   <span className="ir-post-rating-page__verified">تأییدشده</span>
  </article>

  <section className="ir-post-rating-page__form">
   <h2>تجربه جلسه چطور بود؟</h2>

   <div className="ir-post-rating-page__rating-row">
    <div><strong>رضایت کلی</strong><small>تجربه کلی شما از این جلسه</small></div>
    {renderStars('overall')}
   </div>
   <div className="ir-post-rating-page__rating-row">
    <div><strong>کیفیت تدریس</strong><small>وضوح توضیحات و روش آموزش</small></div>
    {renderStars('teaching')}
   </div>
   <div className="ir-post-rating-page__rating-row">
    <div><strong>ارتباط و رفتار</strong><small>تعامل، احترام و پاسخ‌گویی مدرس</small></div>
    {renderStars('communication')}
   </div>
   <div className="ir-post-rating-page__rating-row">
    <div><strong>محتوای جلسه</strong><small>تناسب مطالب با نیاز آموزشی شما</small></div>
    {renderStars('content')}
   </div>
  </section>

  <label className="ir-post-rating-page__comment">
   <span>نظر شما</span>
   <textarea rows={5} value={comment} onChange={event=>setComment(event.target.value)} placeholder="اگر دوست داری، درباره تجربه این جلسه بیشتر بنویس..."/>
  </label>

  <label className="ir-post-rating-page__anonymous">
   <button type="button" role="switch" aria-checked={anonymous} className={anonymous?'is-on':''} onClick={()=>setAnonymous(value=>!value)}><span/></button>
   <div><strong>نمایش نظر بدون نام</strong><small>نام شما در نمایش عمومی این نظر نشان داده نشود</small></div>
  </label>

  {!canRate&&<aside className="ir-post-rating-page__blocked">
   <strong>امتیازدهی هنوز فعال نیست</strong>
   <p>ثبت نظر پس از ثبت نتیجه نهایی و پایان موفق جلسه فعال می‌شود.</p>
  </aside>}

  <button type="button" className="ir-student-subpage__primary" disabled={!canRate} onClick={submit}>ثبت نظر</button>
  <button type="button" className="ir-post-rating-page__complaint" onClick={()=>onNavigate?.(`complaint/${session.id}`)}>گزارش مشکل یا ثبت شکایت</button>
 </section>
}