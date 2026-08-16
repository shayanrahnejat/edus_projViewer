export function IrancellStudentClassesPage({onNavigate}){
 const{state}=useIrancellStore();
 const studentId=state.session.currentUserId||'student-1';
 const[showAllRequests,setShowAllRequests]=useState(false);
 const[showAllClasses,setShowAllClasses]=useState(false);

 const requests=Object.values(state.marketplace.requestsById||{})
  .filter(item=>item.studentId===studentId&&!['cancelled','completed'].includes(item.status))
  .sort((first,second)=>new Date(second.createdAt||0)-new Date(first.createdAt||0));

 const classes=Object.values(state.classroom.sessionsById||{})
  .filter(item=>item.studentId===studentId&&!['cancelled','completed'].includes(item.status))
  .sort((first,second)=>new Date(first.startAt||0)-new Date(second.startAt||0));

 const visibleRequests=showAllRequests?requests:requests.slice(0,2);
 const visibleClasses=showAllClasses?classes:classes.slice(0,2);

 function offerCountForRequest(requestId){
  return Object.values(state.marketplace.offersById||{}).filter(offer=>offer.requestId===requestId&&offer.status!=='withdrawn').length
 }

 function formatRequestTime(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return'';
  const now=new Date();
  const startToday=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const startDate=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const dayDifference=Math.round((startToday-startDate)/86400000);
  const time=date.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});
  if(dayDifference===0)return`امروز، ${time}`;
  if(dayDifference===1)return`دیروز، ${time}`;
  return`${date.toLocaleDateString('fa-IR',{month:'short',day:'numeric'})}، ${time}`
 }

 function formatClassSchedule(item){
  if(item.scheduleLabel)return item.scheduleLabel;
  const date=new Date(item.startAt);
  if(Number.isNaN(date.getTime()))return'زمان کلاس مشخص نشده';
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const target=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const dayDifference=Math.round((target-today)/86400000);
  const time=date.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});
  if(dayDifference===0)return`امروز، ساعت ${time}`;
  if(dayDifference===1)return`فردا، ساعت ${time}`;
  return`${date.toLocaleDateString('fa-IR',{weekday:'long'})}، ساعت ${time}`
 }

 function providerNameForClass(item){
  if(item.providerDisplayName)return item.providerDisplayName;
  return state.marketplace.providersById?.[item.providerId]?.name||state.identity.usersById?.[item.providerId]?.name||'مدرس ایرانسل'
 }

 function initialsForName(name){
  return String(name||'').replace(/[()]/g,' ').split(/\s+/).filter(Boolean).slice(-2).map(part=>part[0]).join('')
 }

 return <section className="ir-classes-main" aria-label="کلاس‌ها">
  <header className="ir-classes-main__header">
   <h1>کلاس‌ها</h1>
   <p>مدیریت کلاس‌ها و درخواست‌های شما</p>
  </header>

  <button type="button" className="ir-classes-main__new-request" onClick={()=>onNavigate?.('student/requests')}>
   <span className="ir-classes-main__new-request-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
   </span>
   <span className="ir-classes-main__new-request-copy">
    <strong>ثبت درخواست جدید</strong>
    <small>مشکل یا سوال درسی خود را ثبت کنید</small>
   </span>
   <span className="ir-classes-main__new-request-arrow" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </span>
  </button>

  <section className="ir-classes-main__section" aria-labelledby="irancell-active-requests-title">
   <header className="ir-classes-main__section-heading">
    <h2 id="irancell-active-requests-title">درخواست‌های فعال</h2>
    {requests.length>0&&<button type="button" onClick={()=>requests.length>2?setShowAllRequests(value=>!value):onNavigate?.('student/requests')}>
     {showAllRequests?'نمایش کمتر':'مشاهده همه'}
    </button>}
   </header>

   <div className="ir-classes-main__requests">
    {visibleRequests.length?visibleRequests.map(request=>{
     const offerCount=offerCountForRequest(request.id);
     const hasOffers=offerCount>0||request.status==='offers_received';
     const selected=request.status==='selected';
     const badgeLabel=selected?'پیشنهاد انتخاب شده':hasOffers?`${IrancellFormatPersianNumber(offerCount||1)} پیشنهاد دریافت شده`:'در انتظار پیشنهاد';
     return <button type="button" className="ir-classes-main__request-card" key={request.id} onClick={()=>onNavigate?.(`student/offers?request=${request.id}`)}>
      <span className="ir-classes-main__request-arrow" aria-hidden="true">
       <svg viewBox="0 0 24 24"><path d="m14 5-7 7 7 7"/></svg>
      </span>
      <span className="ir-classes-main__request-content">
       <strong>{request.topic||request.subject}</strong>
       <small>{formatRequestTime(request.createdAt)}</small>
      </span>
      <span className={`ir-classes-main__request-badge ${hasOffers||selected?'is-success':'is-pending'}`}>{badgeLabel}</span>
     </button>
    }):<article className="ir-classes-main__empty">
     <span aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
     </span>
     <div><strong>درخواست فعالی ندارید</strong><small>برای پیدا کردن مدرس مناسب یک درخواست جدید ثبت کنید.</small></div>
     <button type="button" onClick={()=>onNavigate?.('student/requests')}>ثبت درخواست</button>
    </article>}
   </div>
  </section>

  <section className="ir-classes-main__section is-classes" aria-labelledby="irancell-my-classes-title">
   <header className="ir-classes-main__section-heading">
    <h2 id="irancell-my-classes-title">کلاس‌های من</h2>
    {classes.length>0&&<button type="button" onClick={()=>classes.length>2?setShowAllClasses(value=>!value):setShowAllClasses(true)}>
     {showAllClasses?'نمایش کمتر':'مشاهده همه'}
    </button>}
   </header>

   <div className="ir-classes-main__class-list">
    {visibleClasses.length?visibleClasses.map(item=>{
     const providerName=providerNameForClass(item);
     const provider=state.marketplace.providersById?.[item.providerId];
     return <article className="ir-classes-main__class-card" key={item.id}>
      <div className={`ir-classes-main__class-avatar ${provider?.type==='academy'?'is-academy':'is-teacher'}`} aria-hidden="true">
       <span>{initialsForName(providerName)}</span>
      </div>

      <div className="ir-classes-main__class-info">
       <strong>{providerName}</strong>
       <small>{item.subjectLabel||item.title}</small>
       <span className="ir-classes-main__class-time">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>
        <b>{formatClassSchedule(item)}</b>
       </span>
      </div>

      <button type="button" className="ir-classes-main__enter" onClick={()=>onNavigate?.(`class/${item.id}`)}>
       {['live','ready','active'].includes(item.status)?'ورود به کلاس':'مشاهده و ورود'}
      </button>
     </article>
    }):<article className="ir-classes-main__empty">
     <span aria-hidden="true">
      <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>
     </span>
     <div><strong>هنوز کلاسی ندارید</strong><small>پس از انتخاب یک پیشنهاد، کلاس شما اینجا قرار می‌گیرد.</small></div>
     <button type="button" onClick={()=>onNavigate?.('student/requests')}>درخواست کلاس</button>
    </article>}
   </div>
  </section>
 </section>
}
