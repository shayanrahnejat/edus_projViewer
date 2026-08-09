export function IrancellTeacherHomePage({params,onNavigate}){
 const{state}=useIrancellStore();
 const teacherId=state.session.currentUserId||'teacher-1';
 const teacher=state.identity.usersById[teacherId]||{name:'مدرس'};
 const verification=state.identity.providerVerification?.[teacherId];
 const provider=state.marketplace.providersById?.[teacherId]||null;
 const subjects=Array.isArray(provider?.subjects)?provider.subjects:[];
 const allRequests=Object.values(state.marketplace.requestsById||{}).filter(item=>!['selected','cancelled','expired'].includes(item.status));
 const relatedRequests=allRequests.filter(item=>subjects.length===0||subjects.includes(item.subject));
 const activeOffers=Object.values(state.marketplace.offersById||{}).filter(item=>item.providerId===teacherId&&item.status==='active');
 const futureClasses=Object.values(state.classroom.sessionsById||{}).filter(item=>item.providerId===teacherId&&['scheduled','waiting','ready','live'].includes(item.status)).sort((a,b)=>new Date(a.startAt)-new Date(b.startAt));
 const qualityScore=Number(state.quality.qualityScoresByProviderId?.[teacherId])||0;
 const isNewTutor=verification?.status!=='verified'||!provider;
 const loading=params?.state==='loading'||Boolean(state.ui.loading?.teacherDashboard);
 const forceNoRequests=params?.state==='no-requests';
 const forceNoClass=params?.state==='no-class';
 const visibleRequests=forceNoRequests?[]:relatedRequests;
 const visibleClasses=forceNoClass?[]:futureClasses;
 const profileCompletion=isNewTutor?30:provider?.profileCompletion||80;
 const settlementAmount=isNewTutor?0:Number(provider?.settlementAmount)||3450000;
 const monthlyIncome=isNewTutor?0:Number(provider?.monthlyIncome)||8200000;
 const nextClass=visibleClasses[0]||null;
 const loadError=params?.state==='error'||Boolean(state.ui?.fieldErrors?.teacherDashboard);

 if(loadError)return <section className="ir-tutor-dashboard"><IrancellStatePanel state="error" title="خطا در بارگذاری داشبورد" description="اطلاعات مدرس بارگذاری نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید." action={<IrancellButton onClick={()=>onNavigate?.('teacher/home')}>تلاش مجدد</IrancellButton>}/></section>;

 if(loading)return <section className="ir-tutor-dashboard is-loading">
  <header className="ir-tutor-dashboard__header"><span className="ir-tutor-skeleton is-avatar"/><div><span className="ir-tutor-skeleton is-title"/><span className="ir-tutor-skeleton is-copy"/></div></header>
  <div className="ir-tutor-skeleton is-banner"/>
  <div className="ir-tutor-dashboard__stats">{[1,2,3,4].map(item=><span className="ir-tutor-skeleton is-stat" key={item}/>)}</div>
  <span className="ir-tutor-skeleton is-section"/>
  <span className="ir-tutor-skeleton is-card"/>
  <span className="ir-tutor-skeleton is-section"/>
  <span className="ir-tutor-skeleton is-card"/>
 </section>;

 return <section className={`ir-tutor-dashboard${isNewTutor?' is-new-tutor':''}`}>
  {isNewTutor&&<aside className="ir-tutor-dashboard__activation-alert">پروفایل شما ناقص است؛ لطفاً جهت فعال‌سازی تدریس اقدام کنید</aside>}

  <header className="ir-tutor-dashboard__header">
   <button type="button" className="ir-tutor-dashboard__avatar" onClick={()=>onNavigate?.('teacher/profile')}><span>{String(teacher.name||'م').trim().charAt(0)}</span></button>
   <div><h1>سلام، {teacher.name}</h1><p>{isNewTutor?'در انتظار تکمیل اطلاعات':'پنل مدرس مستقل'}</p></div>
   <button type="button" className="ir-tutor-dashboard__shield" aria-label="امنیت و تأیید پروفایل" onClick={()=>onNavigate?.('teacher/profile')}>⬡</button>
   <button type="button" className="ir-tutor-dashboard__bell" onClick={()=>onNavigate?.('notifications')}>♢<i>{IrancellFormatPersianNumber(2)}</i></button>
  </header>

  <section className={`ir-tutor-dashboard__profile-progress${isNewTutor?' is-urgent':''}`}>
   <header><strong>پروفایل شما {IrancellFormatPersianNumber(profileCompletion)}٪ تکمیل شده است</strong><span>{isNewTutor?'اقدام فوری':'نیاز به اقدام'}</span></header>
   <div><span style={{width:`${profileCompletion}%`}}/></div>
   <small>{IrancellFormatPersianNumber(profileCompletion)}٪ تکمیل شده</small>
   <ul><li className="is-done">احراز هویت</li><li className={isNewTutor?'':'is-done'}>اطلاعات مالی</li><li className={isNewTutor?'':'is-done'}>حساب تسویه</li></ul>
   <p>{isNewTutor?'برای شروع دریافت درخواست‌ها، پروفایل و مدارک را کامل کنید.':'برای دریافت تسویه، اطلاعات مالی را تکمیل کنید.'}</p>
   <button type="button" onClick={()=>onNavigate?.('teacher/profile')}>{isNewTutor?'تکمیل پروفایل و ارسال مدارک':'تکمیل اطلاعات'}</button>
  </section>

  <section className="ir-tutor-dashboard__stats">
   <article><span className="is-orange">▱</span><strong>{IrancellFormatPersianNumber(isNewTutor?0:visibleRequests.length)}</strong><small>درخواست‌های جدید</small></article>
   <article><span className="is-purple">◉</span><strong>{IrancellFormatPersianNumber(isNewTutor?0:activeOffers.length)}</strong><small>پیشنهادهای فعال</small></article>
   {!isNewTutor&&<article><span className="is-green">□</span><strong>{IrancellFormatPersianNumber(visibleClasses.length)}</strong><small>کلاس‌های آینده</small></article>}
   {!isNewTutor&&<article><span className="is-yellow">▣</span><strong>{IrancellFormatPersianNumber(settlementAmount)} تومان</strong><small>قابل تسویه</small></article>}
  </section>

  <section className="ir-tutor-dashboard__section">
   <header><h2>کلاس بعدی</h2></header>
   {isNewTutor?<div className="ir-tutor-dashboard__empty-card is-calendar"><span>□</span><strong>هنوز کلاس ندارید</strong><p>پس از تأیید نهایی مدارک، می‌توانید کلاس برگزار کنید.</p></div>:nextClass?<article className="ir-tutor-dashboard__next-class">
    <div><span>پرداخت‌شده</span><span>تأیید شده</span></div>
    <h3>{nextClass.title}</h3>
    <strong>موضوع: {nextClass.subjectLabel||nextClass.title}</strong>
    <p>دانش‌آموز: {state.identity.usersById[nextClass.studentId]?.name||'دانش‌آموز'}</p>
    <footer><span>امروز، ساعت {new Date(nextClass.startAt).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}</span><b>شروع کلاس تا {IrancellFormatPersianNumber(Math.max(0,Math.round((new Date(nextClass.startAt).getTime()-Date.now())/3600000)))} ساعت دیگر</b></footer>
    <div className="ir-tutor-dashboard__next-actions"><button type="button" onClick={()=>onNavigate?.(`class/${nextClass.id}`)}>ورود به کلاس</button><button type="button" onClick={()=>onNavigate?.('teacher/classes')}>مشاهده جزئیات</button></div>
   </article>:<div className="ir-tutor-dashboard__empty-card is-calendar"><span>□</span><strong>در حال حاضر کلاس فعالی ندارید</strong><p>کلاس‌های تأییدشده اینجا نمایش داده می‌شوند.</p></div>}
  </section>

  <section className="ir-tutor-dashboard__section">
   <header><h2>درخواست‌های جدید</h2>{visibleRequests.length>0&&<button type="button" onClick={()=>onNavigate?.('teacher/requests')}>مشاهده همه درخواست‌ها</button>}</header>
   {isNewTutor?<div className="ir-tutor-dashboard__locked"><span>▱</span><strong>پس از تکمیل پروفایل، درخواست‌ها نمایش داده می‌شوند</strong></div>:visibleRequests.length?<div className="ir-tutor-dashboard__requests">
    {visibleRequests.slice(0,3).map((request,index)=><article key={request.id}>
     <header><h3>{request.subject} پایه {request.grade}</h3>{index===0&&<span>رفع اشکال فوری</span>}</header>
     <strong>موضوع: {request.topic}</strong>
     <p>زمان: {new Date(request.preferredTime).toLocaleString('fa-IR',{weekday:'long',hour:'2-digit',minute:'2-digit'})}</p>
     <b>بودجه: {IrancellFormatPersianNumber(index===0?600000:500000)} تا {IrancellFormatPersianNumber(index===0?700000:800000)} تومان</b>
     <footer><button type="button" onClick={()=>onNavigate?.('teacher/requests')}>مشاهده درخواست</button><span>{index===0?'۴۵ دقیقه مانده':`${index+2} ساعت مانده`}</span></footer>
    </article>)}
   </div>:<div className="ir-tutor-dashboard__empty-card is-inbox"><span>▱</span><strong>در حال حاضر درخواست جدیدی وجود ندارد</strong><p>نکته: زمان‌های آزاد خود را به‌روزرسانی کنید تا درخواست‌های بیشتری دریافت کنید.</p></div>}
  </section>

  {!isNewTutor&&<section className="ir-tutor-dashboard__section">
   <header><h2>پیشنهادهای فعال من</h2><button type="button" onClick={()=>onNavigate?.('teacher/offers')}>مشاهده پیشنهادها</button></header>
   {activeOffers.length?<div className="ir-tutor-dashboard__offers">{activeOffers.slice(0,2).map((offer,index)=><article key={offer.id}><strong>{state.marketplace.requestsById[offer.requestId]?.subject||'درخواست آموزشی'} پایه {state.marketplace.requestsById[offer.requestId]?.grade||''}</strong><p>قیمت: {IrancellFormatPersianNumber(offer.price)} تومان · {new Date(offer.proposedTime).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}</p><span>{index===0?'در انتظار پاسخ':'مشاهده‌شده'}</span></article>)}</div>:<div className="ir-tutor-dashboard__empty-inline">پیشنهاد فعالی ندارید.</div>}
  </section>}

  <section className="ir-tutor-dashboard__section">
   <header><h2>خلاصه درآمد</h2>{!isNewTutor&&<button type="button" onClick={()=>onNavigate?.('teacher/earnings')}>مشاهده گزارش مالی</button>}</header>
   <article className="ir-tutor-dashboard__income"><h3>درآمد این ماه: {IrancellFormatPersianNumber(monthlyIncome)} تومان</h3>{!isNewTutor&&<><p><span>در انتظار برگزاری کلاس</span><strong>{IrancellFormatPersianNumber(1500000)} تومان</strong></p><p><span>در انتظار آزادسازی</span><strong>{IrancellFormatPersianNumber(2250000)} تومان</strong></p><p><span>قابل تسویه</span><strong>{IrancellFormatPersianNumber(settlementAmount)} تومان</strong></p><p><span>تسویه‌شده</span><strong>{IrancellFormatPersianNumber(1000000)} تومان</strong></p></>}</article>
  </section>

  <section className="ir-tutor-dashboard__section">
   <header><h2>کیفیت عملکرد</h2>{!isNewTutor&&<button type="button" onClick={()=>onNavigate?.('teacher/quality')}>مشاهده نظرات</button>}</header>
   {isNewTutor?<div className="ir-tutor-dashboard__empty-inline">هنوز کلاسی برگزار نشده</div>:<article className="ir-tutor-dashboard__quality"><header><strong>امتیاز کلی تدریس</strong><b>{qualityScore?`${(qualityScore/20).toLocaleString('fa-IR',{maximumFractionDigits:1})} / ۵`:'—'} ☆</b></header><div><span>کلاس موفق: ۴۷</span><span>حضور به‌موقع: ۹۶٪</span><span>شکایت معتبر: ۱٪</span></div><p>«بسیار باحوصله و مسلط به حل مسائل پیچیده بودند.»</p></article>}
  </section>

  <section className="ir-tutor-dashboard__quick">
   <h2>دسترسی سریع</h2>
   <div>
    <button type="button" className={isNewTutor?'is-urgent':''} onClick={()=>onNavigate?.('teacher/profile')}><span>✎</span><strong>تکمیل پروفایل</strong></button>
    <button type="button" onClick={()=>onNavigate?.('teacher/calendar')}><span>□</span><strong>ثبت زمان‌های آزاد</strong></button>
    <button type="button" onClick={()=>onNavigate?.('teacher/earnings')}><span>▣</span><strong>اطلاعات مالی</strong></button>
    <button type="button" onClick={()=>onNavigate?.('help')}><span>?</span><strong>پشتیبانی</strong></button>
   </div>
  </section>
 </section>
}