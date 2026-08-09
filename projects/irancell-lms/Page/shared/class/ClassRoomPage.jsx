export function IrancellSharedClassRoomPage({params,onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const session=state.classroom.sessionsById[params.id];
 const gate=useMemo(()=>IrancellEvaluateClassGate(state,params.id,state.session.activeRole),[state,params.id]);
 const[now,setNow]=useState(Date.now());
 const[openResult,setOpenResult]=useState('');

 useEffect(function IrancellDialogiCountdownClock(){
  const timer=setInterval(()=>setNow(Date.now()),30000);
  return()=>clearInterval(timer)
 },[]);

 if(!session)return <IrancellStatePanel state="error" title="کلاس پیدا نشد" description="شناسه کلاس معتبر نیست."/>;

 const consent=state.consent.gatesBySessionId[session.id];
 const escrow=state.payment.escrowByOrderId[session.orderId];
 const rawDialogiUrl=String(session.dialogiUrl||session.externalJoinUrl||'').trim();
 let safeDialogiUrl='';
 try{
  const parsedUrl=new URL(rawDialogiUrl);
  if(parsedUrl.protocol==='https:')safeDialogiUrl=parsedUrl.toString()
 }catch(error){}
 const startAt=new Date(session.startAt).getTime();
 const minutesToStart=Math.max(0,Math.ceil((startAt-now)/60000));
 const gateItems=[
  {key:'identity',label:'هویت و نشست',passed:state.session.status==='authenticated'},
  {key:'participant',label:'شرکت‌کننده مجاز',passed:session.participantIds.includes(state.session.currentUserId)},
  {key:'consent',label:'رضایت والد',passed:!session.requiresConsent||consent?.status==='signed'},
  {key:'payment',label:'پرداخت امن',passed:!session.isPaid||escrow?.status==='held'||escrow?.status==='released'}
 ];

 function openDialogi(){
  setOpenResult('');
  if(!gate.allowed)return;
  dispatch(IrancellClassStart(session.id));
  if(!safeDialogiUrl){
   setOpenResult('joined');
   return
  }
  const opened=window.open(safeDialogiUrl,'_blank','noopener,noreferrer');
  setOpenResult(opened?'opened':'blocked')
 }

 if(session.status==='completed')return <section className="ir-dialogi-handoff is-completed">
  <header className="ir-student-subpage__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>کلاس پایان یافت</h1>
   <span/>
  </header>
  <div className="ir-dialogi-handoff__result">
   <span>✓</span>
   <h2>{session.title}</h2>
   <p>نتیجه جلسه ثبت شده است. حالا می‌توانی تجربه کلاس را ارزیابی کنی یا در صورت وجود مشکل با پشتیبانی در ارتباط باشی.</p>
   <button type="button" onClick={()=>onNavigate?.(`rating/${session.id}`)}>ثبت نظر درباره جلسه</button>
   <button type="button" className="is-secondary" onClick={()=>onNavigate?.('student/support')}>پشتیبانی</button>
  </div>
 </section>;

 return <section className="ir-dialogi-handoff">
  <header className="ir-student-subpage__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>ورود به کلاس آنلاین</h1>
   <span/>
  </header>

  <section className="ir-dialogi-handoff__hero">
   <span className="ir-dialogi-handoff__logo">D</span>
   <div>
    <strong>{session.title}</strong>
    <p>{session.providerDisplayName||state.marketplace.providersById?.[session.providerId]?.name||'مدرس تأییدشده ایرانسل'}</p>
   </div>
  </section>

  <section className="ir-dialogi-handoff__countdown">
   <span>زمان شروع کلاس</span>
   <strong>{minutesToStart>0?`${IrancellFormatPersianNumber(minutesToStart)} دقیقه دیگر`:'بازه ورود کلاس'}</strong>
   <small>{new Date(session.startAt).toLocaleString('fa-IR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</small>
  </section>

  <section className="ir-dialogi-handoff__gates">
   <h2>بررسی شرایط ورود</h2>
   {gateItems.map(item=><div key={item.key} className={item.passed?'is-passed':'is-blocked'}>
    <span>{item.passed?'✓':'!'}</span>
    <strong>{item.label}</strong>
   </div>)}
  </section>

  {!gate.allowed&&<aside className="ir-dialogi-handoff__message is-warning">
   <strong>ورود هنوز فعال نیست</strong>
   <p>{gate.message}</p>
   {gate.actionRoute&&<button type="button" onClick={()=>onNavigate?.(gate.actionRoute)}>رفع پیش‌نیاز</button>}
  </aside>}

  {gate.allowed&&!safeDialogiUrl&&<aside className="ir-dialogi-handoff__message">
   <strong>در انتظار لینک امن دیالوگی</strong>
   <p>همه پیش‌نیازها تأیید شده‌اند. لینک خارجی جلسه هنوز از سرویس دیالوگی دریافت نشده است.</p>
  </aside>}

  {openResult==='joined'&&<aside className="ir-dialogi-handoff__message is-success"><strong>حضور شما ثبت شد</strong><p>کلاس در فروشگاه مرکزی فعال شد و زمان ورود شما در سابقه حضور جلسه ذخیره شد.</p></aside>}
  {openResult==='blocked'&&<aside className="ir-dialogi-handoff__message is-warning"><strong>باز شدن صفحه مسدود شد</strong><p>حضور شما در فروشگاه ثبت شده است. اجازه باز شدن صفحه خارجی را در مرورگر فعال کنید و دوباره تلاش کنید.</p></aside>}
  {openResult==='opened'&&<aside className="ir-dialogi-handoff__message is-success"><strong>دیالوگی باز شد</strong><p>حضور شما در فروشگاه ثبت شد. پس از پایان جلسه برای ثبت نتیجه به این صفحه برگردید.</p></aside>}

  <button type="button" className="ir-student-subpage__primary" disabled={!gate.allowed} onClick={openDialogi}>{safeDialogiUrl?'ثبت حضور و ورود امن به دیالوگی':'ثبت حضور و ورود به کلاس'}</button>

  <footer className="ir-dialogi-handoff__privacy">
   <svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z"/></svg>
   <span>ویدیو، صدا، چت و کنترل‌های جلسه داخل سرویس دیالوگی مدیریت می‌شوند و در این اپ بازسازی نمی‌شوند.</span>
  </footer>
 </section>
}