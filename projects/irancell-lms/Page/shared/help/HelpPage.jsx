export function IrancellSharedHelpPage({onNavigate,params,screen}){
 const{state,dispatch}=useIrancellStore();
 const[view,setView]=useState('home');
 const[search,setSearch]=useState('');
 const[activeCategory,setActiveCategory]=useState('all');
 const[expandedFaq,setExpandedFaq]=useState('');
 const[contactOpen,setContactOpen]=useState(false);
 const[supportMessage,setSupportMessage]=useState('');
 const[submitted,setSubmitted]=useState(false);
 const rawRoute=screen?.route||'student/support';
 const route=rawRoute.startsWith('parent/support')?rawRoute.replace(/^parent\/support/,'student/support'):rawRoute;
 const[requestFilter,setRequestFilter]=useState('all');
 const[requestAttachment,setRequestAttachment]=useState(null);
 const[requestAttachmentStatus,setRequestAttachmentStatus]=useState('empty');
 const[technicalAttachment,setTechnicalAttachment]=useState(null);
 const[technicalAttachmentStatus,setTechnicalAttachmentStatus]=useState('empty');
 const[requestReply,setRequestReply]=useState('');
 const[replyAttachment,setReplyAttachment]=useState(null);
 const[replyAttachmentStatus,setReplyAttachmentStatus]=useState('empty');
 const[replyAttachmentSignal,setReplyAttachmentSignal]=useState(0);
 const[replyAttachmentResetSignal,setReplyAttachmentResetSignal]=useState(0);
 const[faqFeedback,setFaqFeedback]=useState('');
 const[satisfactionScore,setSatisfactionScore]=useState(0);
 const[satisfactionComment,setSatisfactionComment]=useState('');
 const[supportRequestForm,setSupportRequestForm]=useState({category:'',service:'',childId:'',title:'',description:'',responseMethod:'app',classBlocking:false,priority:'urgent'});
 const[technicalForm,setTechnicalForm]=useState({section:'',problemType:'',description:'',includeDiagnostics:true});
 const[subjectPickerOpen,setSubjectPickerOpen]=useState(false);
 const[childPickerOpen,setChildPickerOpen]=useState(false);
 const actor=state.identity.usersById[state.session.currentUserId]||{};
 const linkedChildren=state.session.activeRole==='parent'?Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===state.session.currentUserId&&item.status==='active').map(item=>state.identity.usersById[item.childId]).filter(Boolean):[];
 const firstName=String(actor.name||'کاربر').trim().split(/\s+/)[0]||'کاربر';
 const supportProfileRoute=state.session.activeRole==='parent'?'parent/profile':'student/profile';
 const existingTickets=Object.values(state.support?.ticketsById||{}).filter(ticket=>ticket.ownerId===state.session.currentUserId);

 useEffect(function IrancellSupportRouteStateReset(){
  setSubmitted(false);
  setFaqFeedback('');
  setRequestReply('');
  setReplyAttachment(null);
  setReplyAttachmentStatus('empty');
  setReplyAttachmentResetSignal(value=>value+1)
 },[rawRoute]);

 const categories=[
  {id:'all',label:'همه'},
  {id:'account',label:'حساب کاربری'},
  {id:'course',label:'دوره‌ها'},
  {id:'class',label:'کلاس‌ها'},
  {id:'payment',label:'پرداخت'}
 ];

 const faqs=[
  {id:'faq-1',category:'account',title:'چطور اطلاعات پروفایلم را تغییر بدهم؟',answer:'از پروفایل وارد بخش ویرایش پروفایل شو. تغییرات حساس ممکن است به تأیید خانواده نیاز داشته باشند.'},
  {id:'faq-2',category:'course',title:'چطور دوره‌ای را که شروع کرده‌ام ادامه بدهم؟',answer:'از پروفایل وارد «دوره‌های من» شو و روی دکمه ادامه یادگیری همان دوره بزن.'},
  {id:'faq-3',category:'class',title:'چطور برای کلاس جدید درخواست ثبت کنم؟',answer:'از بخش کلاس‌ها گزینه ثبت درخواست جدید را انتخاب کن، موضوع و زمان موردنظر را وارد کن و درخواست را ثبت کن.'},
  {id:'faq-4',category:'class',title:'لینک ورود به کلاس چه زمانی فعال می‌شود؟',answer:'لینک امن دیالوگی فقط پس از تکمیل پیش‌نیازهای هویت، رضایت، پرداخت و رسیدن بازه مجاز کلاس فعال می‌شود.'},
  {id:'faq-5',category:'payment',title:'اگر پرداخت در وضعیت نامشخص ماند چه کار کنم؟',answer:'پرداخت را دوباره تکرار نکن. از وضعیت سفارش یا پشتیبانی نتیجه قطعی تراکنش را پیگیری کن.'},
  {id:'faq-6',category:'account',title:'چطور حریم خصوصی حسابم را مدیریت کنم؟',answer:'از پروفایل وارد حریم خصوصی شو و تنظیمات قابل تغییر را در بخش نمایش‌پذیری اطلاعات مدیریت کن.'}
 ];

 const normalizedSearch=String(search||'').trim().toLocaleLowerCase('fa-IR');
 const visibleFaqs=faqs.filter(item=>{
  const categoryMatches=activeCategory==='all'||item.category===activeCategory;
  const queryMatches=!normalizedSearch||`${item.title} ${item.answer}`.toLocaleLowerCase('fa-IR').includes(normalizedSearch);
  return categoryMatches&&queryMatches
 });

 function submitSupportRequest(){
  const message=String(supportMessage||'').trim();
  if(!message)return;
  dispatch({type:'IRANCELL_STUDENT_SUPPORT_CREATE',subject:'گزارش مشکل آموزشی',message});
  setSupportMessage('');
  setSubmitted(true);
  setContactOpen(false)
 }

 function submitDetailedSupportRequest(){
  const title=String(supportRequestForm.title||'').trim();
  const description=String(supportRequestForm.description||'').trim();
  if(!supportRequestForm.category||!title||!description||requestAttachmentStatus==='uploading'||requestAttachmentStatus==='failed')return;
  const requestId=`support-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  dispatch({
   type:'IRANCELL_STUDENT_SUPPORT_CREATE',
   id:requestId,
   subject:title,
   message:description,
   category:supportRequestForm.category,
   relatedService:supportRequestForm.service,
   childId:supportRequestForm.childId,
   priority:supportRequestForm.priority,
   responseMethod:supportRequestForm.responseMethod,
   classBlocking:Boolean(supportRequestForm.classBlocking),
   attachmentName:requestAttachment?.name||'',
   attachmentType:requestAttachment?.type||'',
   attachmentSize:Number(requestAttachment?.size)||0
  });
  onNavigate?.('student/support/request-success',{id:requestId})
 }

 function submitTechnicalIssue(){
  const description=String(technicalForm.description||'').trim();
  if(!technicalForm.section||!technicalForm.problemType||!description||technicalAttachmentStatus==='uploading'||technicalAttachmentStatus==='failed')return;
  const requestId=`support-tech-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  dispatch({
   type:'IRANCELL_STUDENT_SUPPORT_CREATE',
   id:requestId,
   subject:`گزارش مشکل فنی: ${technicalForm.problemType}`,
   message:description,
   category:'technical',
   relatedService:technicalForm.section,
   responseMethod:'app',
   technicalMetadata:technicalForm.includeDiagnostics?{
    appVersion:'2.4.1',
    device:typeof navigator!=='undefined'?navigator.userAgent:'unknown',
    online:typeof navigator!=='undefined'?navigator.onLine:true,
    capturedAt:new Date().toISOString()
   }:null,
   attachmentName:technicalAttachment?.name||'',
   attachmentType:technicalAttachment?.type||'',
   attachmentSize:Number(technicalAttachment?.size)||0
  });
  onNavigate?.('student/support/request-success',{id:requestId})
 }

 function submitSupportReply(requestId){
  const message=String(requestReply||'').trim();
  if(!message||replyAttachmentStatus==='uploading'||replyAttachmentStatus==='failed')return;
  dispatch({type:'IRANCELL_STUDENT_SUPPORT_REPLY',requestId,message,attachmentName:replyAttachment?.name||'',attachmentType:replyAttachment?.type||'',attachmentSize:Number(replyAttachment?.size)||0});
  setRequestReply('');
  setReplyAttachment(null);
  setReplyAttachmentStatus('empty');
  setReplyAttachmentResetSignal(value=>value+1)
 }

 function submitSupportChat(ticket){
  const message=String(requestReply||'').trim();
  if(!message||replyAttachmentStatus==='uploading'||replyAttachmentStatus==='failed')return;
  if(ticket){submitSupportReply(ticket.id);return}
  const requestId=`support-chat-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  dispatch({type:'IRANCELL_STUDENT_SUPPORT_CREATE',id:requestId,subject:'گفتگو با پشتیبانی',message,category:'chat',responseMethod:'app',attachmentName:replyAttachment?.name||'',attachmentType:replyAttachment?.type||'',attachmentSize:Number(replyAttachment?.size)||0});
  setRequestReply('');
  setReplyAttachment(null);
  setReplyAttachmentStatus('empty');
  setReplyAttachmentResetSignal(value=>value+1)
 }

 function submitSatisfaction(requestId){
  if(!satisfactionScore)return;
  dispatch({type:'IRANCELL_STUDENT_SUPPORT_SATISFACTION',requestId,score:satisfactionScore,comment:satisfactionComment.trim()});
  onNavigate?.('student/support')
 }

 if(route==='student/support/chat'){
  const tickets=Object.values(state.support?.ticketsById||{}).filter(ticket=>ticket.ownerId===state.session.currentUserId);
  const requestedTicket=state.support?.ticketsById?.[params?.id]||null;
  const ticket=requestedTicket?.ownerId===state.session.currentUserId?requestedTicket:tickets[0]||null;
  const messages=Array.isArray(ticket?.messages)?ticket.messages:[];
  return <section className="ir-student-support-page is-family-chat">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}><svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg></button>
    <h1>گفتگو با پشتیبانی</h1><span/>
   </header>
   <aside className="ir-family-support-agent"><span>••</span><div><strong>پشتیبانی ایرانسل</strong><small>پاسخ‌گویی در ساعات کاری</small></div><i/></aside>
   <section className="ir-support-request-detail__messages">
    {ticket&&<article className="is-user"><p>{ticket.message}</p>{ticket.attachmentName&&<b>⌕ {ticket.attachmentName}</b>}<small>شما</small></article>}
    {messages.length?messages.map(message=><article key={message.id} className={message.author==='student'||message.author==='parent'?'is-user':'is-support'}><p>{message.text}</p>{message.attachmentName&&<b>⌕ {message.attachmentName}</b>}<small>{message.author==='support'?'پشتیبانی':'شما'}</small></article>):<article className="is-support"><p>سلام، چطور می‌توانیم به شما کمک کنیم؟</p><small>پشتیبانی</small></article>}
   </section>
   <div className="ir-family-support-quick-replies"><button type="button" onClick={()=>setRequestReply('مشکل پرداخت دارم')}>مشکل پرداخت</button><button type="button" onClick={()=>setRequestReply('مشکل کلاس دارم')}>مشکل کلاس</button><button type="button" onClick={()=>setRequestReply('پیگیری درخواست')}>پیگیری درخواست</button></div>
   <IrancellSimpleFileUploader label="" hint="" accept="image/*,video/*,.pdf,.txt" maxSizeMb={15} hideTrigger openSignal={replyAttachmentSignal} resetSignal={replyAttachmentResetSignal} onChange={setReplyAttachment} onStatusChange={setReplyAttachmentStatus}/>
   <form className="ir-support-request-detail__composer" onSubmit={event=>{event.preventDefault();submitSupportChat(ticket)}}>
    <button type="submit" aria-label="ارسال" disabled={!requestReply.trim()||replyAttachmentStatus==='uploading'||replyAttachmentStatus==='failed'}>➤</button><input value={requestReply} onChange={event=>setRequestReply(event.target.value)} placeholder="پیام خود را بنویسید..."/><button type="button" aria-label="افزودن فایل" onClick={()=>setReplyAttachmentSignal(value=>value+1)}>⌕</button>
   </form>
  </section>
 }

 if(route==='student/support/contact'){
  return <section className="ir-student-support-page is-contact-center">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}><svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg></button>
    <h1>تماس با مرکز پشتیبانی</h1><span/>
   </header>
   <article className="ir-family-support-contact-card">
    <span>☎</span><h2>مرکز پشتیبانی کیستی</h2><strong dir="ltr">۰۹۳۵۰۰۰۱۳۳۴</strong><p>ساعات پاسخ‌گویی: ۸ صبح تا ۲۰</p>
   </article>
   <button type="button" className="ir-family-support-call" onClick={()=>{if(typeof window!=='undefined')window.location.href='tel:09350001334'}}>تماس مستقیم ☎</button>
   <button type="button" className="ir-family-support-callback" disabled={submitted} onClick={()=>{dispatch({type:'IRANCELL_STUDENT_SUPPORT_CREATE',subject:'درخواست تماس پشتیبانی',message:'لطفاً برای پیگیری موضوع با من تماس بگیرید.',category:'contact'});setSubmitted(true)}}>{submitted?'درخواست تماس ثبت شد':'ثبت درخواست تماس'}</button>
   {submitted&&<aside className="ir-student-support-page__success" role="status"><span>✓</span><div><strong>درخواست تماس ثبت شد</strong><p>همکاران پشتیبانی در ساعات کاری با شما تماس می‌گیرند.</p></div></aside>}
   <button type="button" className="ir-family-support-faq-link" onClick={()=>onNavigate?.('student/support/faq')}>سوالات متداول <span>قبل از تماس سوالات پرتکرار را مشاهده کنید</span></button>
  </section>
 }

 if(route==='student/support/search'){
  const query=String(params?.q||search||'').trim();
  const normalized=query.toLocaleLowerCase('fa-IR');
  const results=faqs.filter(item=>!normalized||`${item.title} ${item.answer}`.toLocaleLowerCase('fa-IR').includes(normalized));

  return <section className="ir-student-support-page is-search">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>نتایج جستجو</h1>
    <span/>
   </header>

   <label className="ir-student-support-page__search">
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
    <input value={search||query} onChange={event=>setSearch(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')onNavigate?.('student/support/search',{q:event.currentTarget.value})}} placeholder="جستجو در راهنما"/>
   </label>

   {results.length?<section className="ir-support-search-results">
    <p>نتایج برای «{query||'همه موضوعات'}»</p>
    {results.map(item=><button type="button" key={item.id} onClick={()=>onNavigate?.(`student/support/faq/${item.id}`)}>
     <strong>{item.title}</strong>
     <span>‹</span>
    </button>)}
   </section>:<div className="ir-support-search-empty">
    <span>⌕</span>
    <strong>نتیجه‌ای پیدا نشد</strong>
    <p>عبارت دیگری جستجو کن یا مستقیماً درخواست پشتیبانی ثبت کن.</p>
    <button type="button" onClick={()=>onNavigate?.('student/support/new')}>ثبت درخواست پشتیبانی</button>
   </div>}
  </section>
 }

 if(route==='student/support/faq/:id'){
  const faq=faqs.find(item=>item.id===params?.id)||faqs[0];
  return <section className="ir-student-support-page is-faq-detail">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support/faq')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>راهنما</h1>
    <span/>
   </header>

   <article className="ir-faq-detail-page">
    <h2>{faq.title}</h2>
    <p>{faq.answer}</p>
    <ol>
     <li>ابتدا وضعیت اتصال و حساب را بررسی کن.</li>
     <li>در صورت وجود کلاس یا درخواست مرتبط، از همان بخش وارد جزئیات شو.</li>
     <li>اگر مشکل ادامه داشت، درخواست پشتیبانی ثبت کن.</li>
    </ol>
    <aside>این راهنما اطلاعات حساس، رمز یا کد ورود از شما درخواست نمی‌کند.</aside>
   </article>

   <section className="ir-faq-detail-page__feedback">
    <strong>این پاسخ مفید بود؟</strong>
    <div><button type="button" className={faqFeedback==='yes'?'is-active':''} onClick={()=>setFaqFeedback('yes')}>بله</button><button type="button" className={faqFeedback==='no'?'is-active':''} onClick={()=>setFaqFeedback('no')}>خیر</button></div>
    {faqFeedback&&<small role="status">{faqFeedback==='yes'?'ممنون؛ بازخورد شما ثبت شد.':'ممنون؛ برای تکمیل راهنما از بازخورد شما استفاده می‌کنیم.'}</small>}
   </section>

   <button type="button" className="ir-student-subpage__primary" onClick={()=>onNavigate?.('student/support/new',{service:faq.category})}>هنوز مشکل دارم</button>
  </section>
 }

 if(route==='student/support/faq'){
  const visible=faqs.filter(item=>activeCategory==='all'||item.category===activeCategory);
  return <section className="ir-student-support-page is-faq">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>پرسش‌های متداول</h1>
    <span/>
   </header>

   <label className="ir-student-support-page__search">
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
    <input value={search} onChange={event=>setSearch(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')onNavigate?.('student/support/search',{q:event.currentTarget.value})}} placeholder="جستجو در پرسش‌های متداول"/>
   </label>

   <nav className="ir-student-subpage__chips">
    {categories.map(category=><button type="button" key={category.id} className={activeCategory===category.id?'is-active':''} onClick={()=>setActiveCategory(category.id)}>{category.label}</button>)}
   </nav>

   <section className="ir-student-support-page__faq-list">
    {visible.map(item=><article key={item.id}>
     <button type="button" onClick={()=>onNavigate?.(`student/support/faq/${item.id}`)}>
      <strong>{item.title}</strong><span>‹</span>
     </button>
    </article>)}
   </section>

   <aside className="ir-student-support-page__need-help">
    <strong>پاسخ سوالت را پیدا نکردی؟</strong>
    <p>یک درخواست برای تیم پشتیبانی ثبت کن.</p>
    <button type="button" onClick={()=>onNavigate?.('student/support/new')}>ثبت درخواست</button>
   </aside>
  </section>
 }

 if(route==='student/support/new'){
  const categoryOptions=['کلاس آنلاین','دوره آموزشی','پرداخت و بازگشت وجه','حساب کاربری','چیستی','سایر'];
  const serviceOptions=['کلاس ریاضی','دوره علوم تجربی','چیستی','پروفایل دانش‌آموز','سایر'];

  return <section className="ir-student-support-page is-create">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>ثبت درخواست پشتیبانی</h1>
    <span/>
   </header>

   <p className="ir-support-create-page__intro">موضوع و جزئیات مشکل را وارد کن تا تیم پشتیبانی بتواند دقیق‌تر راهنمایی کند.</p>

   <form className="ir-support-create-page" onSubmit={event=>{event.preventDefault();submitDetailedSupportRequest()}}>
    <label><span>موضوع درخواست</span><button type="button" className="ir-support-create-page__picker" onClick={()=>setSubjectPickerOpen(true)}>{supportRequestForm.category||'انتخاب کنید...'} <b>⌄</b></button></label>
    <label><span>خدمت مرتبط</span><select value={supportRequestForm.service} onChange={event=>setSupportRequestForm(current=>({...current,service:event.target.value}))}><option value="">انتخاب مورد مرتبط</option>{serviceOptions.map(item=><option key={item}>{item}</option>)}</select></label>
    {state.session.activeRole==='parent'&&<label><span>فرزند مرتبط</span><button type="button" className="ir-support-create-page__picker" onClick={()=>setChildPickerOpen(true)}>{linkedChildren.find(child=>child.id===supportRequestForm.childId)?.name||'انتخاب فرزند'} <b>⌄</b></button></label>}
    <label><span>عنوان درخواست</span><input maxLength={80} value={supportRequestForm.title} onChange={event=>setSupportRequestForm(current=>({...current,title:event.target.value}))} placeholder="عنوان کوتاهی برای درخواست بنویس"/><small>{IrancellFormatPersianNumber(supportRequestForm.title.length)}/۸۰</small></label>

    {subjectPickerOpen&&<div className="ir-family-picker-overlay" onMouseDown={()=>setSubjectPickerOpen(false)}><section className="ir-family-picker-sheet" onMouseDown={event=>event.stopPropagation()}><span/><h2>موضوع درخواست</h2>{categoryOptions.map(item=><button type="button" key={item} className={supportRequestForm.category===item?'is-active':''} onClick={()=>{setSupportRequestForm(current=>({...current,category:item}));setSubjectPickerOpen(false)}}><i/>{item}</button>)}<button type="button" className="ir-family-picker-sheet__confirm" onClick={()=>setSubjectPickerOpen(false)}>تأیید</button></section></div>}

    {childPickerOpen&&<div className="ir-family-picker-overlay" onMouseDown={()=>setChildPickerOpen(false)}><section className="ir-family-picker-sheet" onMouseDown={event=>event.stopPropagation()}><span/><h2>فرزند مرتبط</h2>{linkedChildren.map(child=><button type="button" key={child.id} className={supportRequestForm.childId===child.id?'is-active':''} onClick={()=>{setSupportRequestForm(current=>({...current,childId:child.id}));setChildPickerOpen(false)}}><i/><b className="ir-family-picker-sheet__avatar">{String(child.name||'د').trim().charAt(0)}</b>{child.name}</button>)}<button type="button" className="ir-family-picker-sheet__confirm" onClick={()=>setChildPickerOpen(false)}>تأیید</button></section></div>}
    <label><span>شرح درخواست</span><textarea maxLength={1000} rows={6} value={supportRequestForm.description} onChange={event=>setSupportRequestForm(current=>({...current,description:event.target.value}))} placeholder="مشکل یا سوال خود را با جزئیات توضیح بده"/><small>{IrancellFormatPersianNumber(supportRequestForm.description.length)}/۱۰۰۰</small></label>

    <div className="ir-support-create-page__attachment">
     <strong>تصویر یا فایل</strong>
     <IrancellSimpleFileUploader label="افزودن فایل" hint="تصویر، ویدیو یا فایل مرتبط را پیوست کن" accept="image/*,video/*,.pdf,.txt" maxSizeMb={15} onChange={setRequestAttachment} onStatusChange={setRequestAttachmentStatus}/>
    </div>

    <fieldset className="ir-support-create-page__priority">
     <legend>اولویت درخواست</legend>
     <label><input type="radio" name="support-priority" checked={supportRequestForm.priority==='urgent'} onChange={()=>setSupportRequestForm(current=>({...current,priority:'urgent'}))}/><span>فوری</span></label>
     <label><input type="radio" name="support-priority" checked={supportRequestForm.priority==='important'} onChange={()=>setSupportRequestForm(current=>({...current,priority:'important'}))}/><span>مهم</span></label>
     <label><input type="radio" name="support-priority" checked={supportRequestForm.priority==='normal'} onChange={()=>setSupportRequestForm(current=>({...current,priority:'normal'}))}/><span>عادی</span></label>
    </fieldset>

    <fieldset>
     <legend>روش دریافت پاسخ</legend>
     <label><input type="radio" name="support-response" checked={supportRequestForm.responseMethod==='app'} onChange={()=>setSupportRequestForm(current=>({...current,responseMethod:'app'}))}/><span>اعلان داخل برنامه</span></label>
     <label><input type="radio" name="support-response" checked={supportRequestForm.responseMethod==='sms'} onChange={()=>setSupportRequestForm(current=>({...current,responseMethod:'sms'}))}/><span>پیامک به شماره خانواده</span></label>
    </fieldset>

    <label className="ir-support-create-page__check"><input type="checkbox" checked={supportRequestForm.classBlocking} onChange={()=>setSupportRequestForm(current=>({...current,classBlocking:!current.classBlocking}))}/><span>این مشکل مانع ورود من به کلاس در حال برگزاری است.</span></label>

    <button type="submit" disabled={!supportRequestForm.category||!supportRequestForm.title.trim()||!supportRequestForm.description.trim()||requestAttachmentStatus==='uploading'||requestAttachmentStatus==='failed'}>ارسال درخواست</button>
   </form>
  </section>
 }

 if(route==='student/support/technical'){
  return <section className="ir-student-support-page is-technical">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>گزارش مشکل فنی</h1>
    <span/>
   </header>

   <p className="ir-support-create-page__intro">جزئیات مشکل را ثبت کن تا تیم فنی بتواند آن را بررسی کند.</p>

   <form className="ir-support-create-page" onSubmit={event=>{event.preventDefault();submitTechnicalIssue()}}>
    <label><span>مشکل در کدام بخش رخ داده است؟</span><select value={technicalForm.section} onChange={event=>setTechnicalForm(current=>({...current,section:event.target.value}))}><option value="">انتخاب بخش</option><option>کلاس آنلاین</option><option>دوره آموزشی</option><option>چیستی</option><option>پروفایل</option><option>پرداخت</option></select></label>
    <label><span>چه مشکلی رخ داده است؟</span><select value={technicalForm.problemType} onChange={event=>setTechnicalForm(current=>({...current,problemType:event.target.value}))}><option value="">انتخاب نوع مشکل</option><option>صفحه باز نمی‌شود</option><option>ویدیو پخش نمی‌شود</option><option>ورود به کلاس انجام نمی‌شود</option><option>خطای شبکه</option><option>سایر</option></select></label>
    <label><span>شرح مشکل</span><textarea rows={6} value={technicalForm.description} onChange={event=>setTechnicalForm(current=>({...current,description:event.target.value}))} placeholder="مراحل رخ دادن مشکل را توضیح بده"/></label>

    <div className="ir-support-create-page__attachment">
     <strong>تصویر یا ویدیو از مشکل</strong>
     <IrancellSimpleFileUploader label="افزودن فایل" hint="اسکرین‌شات یا ویدیوی خطا را پیوست کن" accept="image/*,video/*,.txt,.pdf" maxSizeMb={15} onChange={setTechnicalAttachment} onStatusChange={setTechnicalAttachmentStatus}/>
    </div>

    <aside className="ir-support-technical-page__diagnostics">
     <label><input type="checkbox" checked={technicalForm.includeDiagnostics} onChange={()=>setTechnicalForm(current=>({...current,includeDiagnostics:!current.includeDiagnostics}))}/><span>اطلاعات فنی همراه گزارش ارسال می‌شود</span></label>
     <dl>
      <div><dt>نسخه برنامه</dt><dd>۲.۴.۱</dd></div>
      <div><dt>مدل دستگاه</dt><dd>دستگاه فعلی</dd></div>
      <div><dt>اتصال</dt><dd>{typeof navigator!=='undefined'&&navigator.onLine?'آنلاین':'آفلاین'}</dd></div>
     </dl>
    </aside>

    <label className="ir-support-create-page__check"><input type="checkbox" checked readOnly/><span>اجازه می‌دهم اطلاعات فنی لازم برای بررسی این خطا ارسال شود.</span></label>
    <button type="submit" disabled={!technicalForm.section||!technicalForm.problemType||!technicalForm.description.trim()||technicalAttachmentStatus==='uploading'||technicalAttachmentStatus==='failed'}>ارسال گزارش</button>
   </form>
  </section>
 }

 if(route==='student/support/requests'){
  const tickets=Object.values(state.support?.ticketsById||{}).filter(ticket=>ticket.ownerId===state.session.currentUserId).sort((a,b)=>new Date(b.updatedAt||b.createdAt)-new Date(a.updatedAt||a.createdAt));
  const visibleTickets=tickets.filter(ticket=>{
   if(requestFilter==='all')return true;
   if(requestFilter==='needs_reply')return ticket.status==='needs_student_reply';
   if(requestFilter==='reviewing')return ['submitted','under_review'].includes(ticket.status);
   if(requestFilter==='resolved')return ['resolved','closed'].includes(ticket.status);
   return true
  });

  return <section className="ir-student-support-page is-requests">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>درخواست‌های من</h1>
    <span/>
   </header>

   <nav className="ir-student-subpage__chips">
    <button type="button" className={requestFilter==='all'?'is-active':''} onClick={()=>setRequestFilter('all')}>همه</button>
    <button type="button" className={requestFilter==='needs_reply'?'is-active':''} onClick={()=>setRequestFilter('needs_reply')}>نیازمند پاسخ</button>
    <button type="button" className={requestFilter==='reviewing'?'is-active':''} onClick={()=>setRequestFilter('reviewing')}>در حال بررسی</button>
    <button type="button" className={requestFilter==='resolved'?'is-active':''} onClick={()=>setRequestFilter('resolved')}>حل‌شده</button>
   </nav>

   {visibleTickets.length?<div className="ir-support-requests-page__list">
    {visibleTickets.map(ticket=><button type="button" key={ticket.id} onClick={()=>onNavigate?.(`student/support/requests/${ticket.id}`)}>
     <header><small># {String(ticket.id).slice(-4)}</small><span className={`is-${ticket.status}`}>{ticket.status==='needs_student_reply'?'نیازمند پاسخ':ticket.status==='resolved'||ticket.status==='closed'?'حل‌شده':'در حال بررسی'}</span></header>
     <strong>{ticket.subject}</strong>
     <p>{ticket.relatedService||ticket.category||'پشتیبانی عمومی'} · {new Date(ticket.updatedAt||ticket.createdAt).toLocaleDateString('fa-IR')}</p>
    </button>)}
   </div>:<div className="ir-student-subpage__empty"><span>◎</span><strong>درخواستی در این بخش نیست</strong><p>می‌توانی از صفحه پشتیبانی یک درخواست جدید ثبت کنی.</p><button type="button" onClick={()=>onNavigate?.('student/support/new')}>ثبت درخواست</button></div>}
  </section>
 }

 if(route==='student/support/requests/:id'){
  const ticket=state.support?.ticketsById?.[params?.id]||null;
  if(!ticket||ticket.ownerId!==state.session.currentUserId)return <section className="ir-student-support-page"><div className="ir-student-subpage__empty"><span>!</span><strong>درخواست پیدا نشد</strong><p>ممکن است درخواست حذف شده یا در دسترس این حساب نباشد.</p><button type="button" onClick={()=>onNavigate?.('student/support/requests')}>بازگشت</button></div></section>;
  const messages=Array.isArray(ticket.messages)?ticket.messages:[];

  return <section className="ir-student-support-page is-request-detail">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/support/requests')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>جزئیات درخواست</h1>
    <span/>
   </header>

   <article className="ir-support-request-detail__summary">
    <header><strong>درخواست شماره {String(ticket.id).slice(-4)}</strong><span className={`is-${ticket.status}`}>{ticket.status==='needs_student_reply'?'نیازمند پاسخ':ticket.status==='resolved'||ticket.status==='closed'?'حل‌شده':'در حال بررسی'}</span></header>
    <p>خدمت مرتبط: {ticket.relatedService||ticket.category||'پشتیبانی عمومی'}</p>
   </article>

   {ticket.status==='needs_student_reply'&&<aside className="ir-support-request-detail__attention">پشتیبانی برای ادامه بررسی به پاسخ شما نیاز دارد.</aside>}

   <section className="ir-support-request-detail__messages">
    <article className="is-user"><p>{ticket.message}</p>{ticket.attachmentName&&<b>⌕ {ticket.attachmentName}</b>}<small>{new Date(ticket.createdAt).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}</small></article>
    {messages.map(message=><article key={message.id} className={message.author==='student'||message.author==='parent'?'is-user':'is-support'}><p>{message.text}</p>{message.attachmentName&&<b>⌕ {message.attachmentName}</b>}<small>{new Date(message.createdAt).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}</small></article>)}
    {messages.length===0&&<article className="is-support"><p>درخواست شما دریافت شده و در صف بررسی قرار دارد.</p><small>پشتیبانی</small></article>}
   </section>

   {['resolved','closed'].includes(ticket.status)?<div className="ir-support-request-detail__resolved">
    <strong>این درخواست حل شده است.</strong>
    <button type="button" onClick={()=>onNavigate?.(`student/support/satisfaction/${ticket.id}`)}>ارزیابی پاسخ پشتیبانی</button>
   </div>:<>
    <IrancellSimpleFileUploader label="" hint="" accept="image/*,video/*,.pdf,.txt" maxSizeMb={15} hideTrigger openSignal={replyAttachmentSignal} resetSignal={replyAttachmentResetSignal} onChange={setReplyAttachment} onStatusChange={setReplyAttachmentStatus}/>
    <form className="ir-support-request-detail__composer" onSubmit={event=>{event.preventDefault();submitSupportReply(ticket.id)}}>
     <button type="submit" aria-label="ارسال" disabled={!requestReply.trim()||replyAttachmentStatus==='uploading'||replyAttachmentStatus==='failed'}>➤</button>
     <input value={requestReply} onChange={event=>setRequestReply(event.target.value)} placeholder="پاسخ خود را بنویس..."/>
     <button type="button" aria-label="افزودن فایل" onClick={()=>setReplyAttachmentSignal(value=>value+1)}>⌕</button>
    </form>
   </>}
  </section>
 }

 if(route==='student/support/request-success'){
  return <section className="ir-student-subpage ir-support-request-success">
   <div>
    <span>✓</span>
    <h1>درخواست شما ثبت شد</h1>
    <p>درخواست با موفقیت ثبت شد و وضعیت آن از بخش درخواست‌های من قابل پیگیری است.</p>
    <article><small>شماره درخواست</small><strong>{String(params?.id||'').slice(-8)||'ثبت‌شده'}</strong></article>
    <button type="button" onClick={()=>onNavigate?.(params?.id?`student/support/requests/${params.id}`:'student/support/requests')}>مشاهده درخواست</button>
    <button type="button" className="is-secondary" onClick={()=>onNavigate?.('student/support')}>بازگشت به پشتیبانی</button>
   </div>
  </section>
 }

 if(route==='student/support/satisfaction/:id'){
  return <section className="ir-support-satisfaction-page">
   <div className="ir-support-satisfaction-page__backdrop"/>
   <section className="ir-support-satisfaction-page__sheet">
    <span className="ir-support-satisfaction-page__handle"/>
    <h1>از پاسخ پشتیبانی راضی بودی؟</h1>
    <p>نظر تو به ما کمک می‌کند کیفیت پشتیبانی را بهتر کنیم.</p>

    <div className="ir-support-satisfaction-page__scores">
     {[{value:4,label:'خوب',icon:'☺'},{value:3,label:'معمولی',icon:'◡'},{value:2,label:'بد',icon:'−'},{value:1,label:'خیلی بد',icon:'☹'}].map(item=><button type="button" key={item.value} className={satisfactionScore===item.value?'is-active':''} onClick={()=>setSatisfactionScore(item.value)}><span>{item.icon}</span><small>{item.label}</small></button>)}
    </div>

    <textarea rows={4} value={satisfactionComment} onChange={event=>setSatisfactionComment(event.target.value)} placeholder="نظرت را برای بهتر شدن پشتیبانی بنویس..."/>
    <button type="button" className="ir-support-satisfaction-page__submit" disabled={!satisfactionScore} onClick={()=>submitSatisfaction(params?.id)}>ثبت نظر</button>
    <button type="button" className="ir-support-satisfaction-page__later" onClick={()=>onNavigate?.('student/support')}>بعداً</button>
   </section>
  </section>
 }

 if(state.ui.offline||params?.state==='offline'){
  return <section className="ir-student-support-state-page">
   <header className="ir-student-subpage__topbar"><span/><h1>پشتیبانی</h1><span/></header>
   <div><span>⌁</span><h2>اتصال اینترنت برقرار نیست</h2><p>برای دریافت محتوای جدید پشتیبانی، اتصال اینترنت را بررسی کن.</p><button type="button" onClick={()=>typeof window!=='undefined'&&window.location.reload()}>تلاش دوباره</button></div>
  </section>
 }

 if(params?.state==='error'){
  return <section className="ir-student-support-state-page is-error">
   <header className="ir-student-subpage__topbar"><span/><h1>پشتیبانی</h1><span/></header>
   <div><span>△</span><h2>مشکلی پیش آمده</h2><p>در حال حاضر امکان بارگذاری این بخش نیست.</p><button type="button" onClick={()=>onNavigate?.('student/support')}>تلاش دوباره</button><button type="button" className="is-secondary" onClick={()=>onNavigate?.('student/home')}>بازگشت</button></div>
  </section>
 }

 if(view==='faq')return <section className="ir-student-support-page is-faq">
  <header className="ir-student-subpage__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>{setView('home');setSearch('');setActiveCategory('all')}}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>پرسش‌های متداول</h1>
   <span/>
  </header>

  <label className="ir-student-support-page__search">
   <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
   <input value={search} onChange={event=>setSearch(event.target.value)} placeholder="جستجو در پرسش‌های متداول"/>
  </label>

  <nav className="ir-student-subpage__chips">
   {categories.map(category=><button type="button" key={category.id} className={activeCategory===category.id?'is-active':''} onClick={()=>setActiveCategory(category.id)}>{category.label}</button>)}
  </nav>

  <section className="ir-student-support-page__faq-list">
   {visibleFaqs.length?visibleFaqs.map(item=><article key={item.id} className={expandedFaq===item.id?'is-open':''}>
    <button type="button" aria-expanded={expandedFaq===item.id} onClick={()=>setExpandedFaq(current=>current===item.id?'':item.id)}>
     <strong>{item.title}</strong>
     <span>{expandedFaq===item.id?'−':'+'}</span>
    </button>
    {expandedFaq===item.id&&<p>{item.answer}</p>}
   </article>):<div className="ir-student-subpage__empty is-compact">
    <span>؟</span>
    <strong>پاسخی پیدا نشد</strong>
    <p>عبارت دیگری جستجو کن یا مستقیم با پشتیبانی در ارتباط باش.</p>
   </div>}
  </section>

  <aside className="ir-student-support-page__need-help">
   <strong>پاسخ سوالت را پیدا نکردی؟</strong>
   <p>مشکل را برای تیم پشتیبانی توضیح بده.</p>
   <button type="button" onClick={()=>{setView('home');setContactOpen(true)}}>ارتباط با پشتیبانی</button>
  </aside>
 </section>;

 return <section className="ir-student-support-page">
  <header className="ir-student-subpage__topbar">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.(supportProfileRoute)}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>پشتیبانی</h1>
   <span/>
  </header>

  <section className="ir-student-support-page__hero">
   <span aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M5 14v-2a7 7 0 0 1 14 0v2"/><path d="M5 13H3v5h4v-5ZM19 13h2v5h-4v-5Z"/><path d="M17 20h-5"/></svg>
   </span>
   <div>
    <h2>سلام {firstName} 👋</h2>
    <p>چطور می‌توانیم کمکت کنیم؟</p>
   </div>
  </section>

  <label className="ir-student-support-page__search">
   <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
   <input value={search} onChange={event=>setSearch(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&event.currentTarget.value.trim())onNavigate?.('student/support/search',{q:event.currentTarget.value.trim()})}} placeholder="موضوع یا سوالت را جستجو کن"/>
  </label>

  <section className="ir-student-support-page__quick">
   <h2>دسترسی سریع</h2>
   <div>
    <button type="button" onClick={()=>onNavigate?.('student/support/new')}>
     <span><svg viewBox="0 0 24 24"><path d="M4 5h16v12H8l-4 4Z"/><path d="M8 9h8M8 13h5"/></svg></span>
     <strong>ثبت درخواست جدید</strong>
    </button>
    <button type="button" onClick={()=>onNavigate?.('student/support/chat')}>
     <span><svg viewBox="0 0 24 24"><path d="M4 5h16v12H8l-4 4Z"/><path d="M8 9h8M8 13h5"/></svg></span>
     <strong>گفتگو با پشتیبانی</strong>
    </button>
    <button type="button" onClick={()=>onNavigate?.('student/support/contact')}>
     <span><svg viewBox="0 0 24 24"><path d="M6 3h4l2 5-3 2c1 3 3 5 6 6l2-3 4 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 3-2Z"/></svg></span>
     <strong>تماس با مرکز پشتیبانی</strong>
    </button>
    <button type="button" onClick={()=>onNavigate?.('student/support/faq')}>
     <span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 0 1 4.5 1.2c0 2-2.3 2.1-2.3 4M12 18h.01"/></svg></span>
     <strong>سوالات متداول</strong>
    </button>
   </div>
  </section>

  <section className="ir-student-support-page__topics">
   <header><h2>موضوعات پرکاربرد</h2><button type="button" onClick={()=>setView('faq')}>مشاهده همه</button></header>
   {faqs.slice(0,4).map(item=><button type="button" key={item.id} onClick={()=>{setView('faq');setActiveCategory(item.category);setExpandedFaq(item.id)}}>
    <span>؟</span>
    <strong>{item.title}</strong>
    <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
   </button>)}
  </section>

  {contactOpen&&<section className="ir-student-support-page__contact">
   <header><strong>گزارش مشکل</strong><button type="button" onClick={()=>setContactOpen(false)}>×</button></header>
   <p>بدون ارسال رمز، کد ورود یا اطلاعات حساس، مشکل را توضیح بده.</p>
   <textarea value={supportMessage} onChange={event=>setSupportMessage(event.target.value)} rows={5} placeholder="مثلاً هنگام باز کردن دوره با خطا روبه‌رو شدم..."/>
   <button type="button" disabled={!supportMessage.trim()} onClick={submitSupportRequest}>ثبت درخواست</button>
  </section>}

  {submitted&&<aside className="ir-student-support-page__success" role="status">
   <span>✓</span>
   <div><strong>درخواستت ثبت شد</strong><p>پشتیبانی موضوع را بررسی می‌کند و نتیجه از همین حساب قابل پیگیری است.</p></div>
  </aside>}

  <footer className="ir-student-support-page__status">
   <span>✓</span>
   <div>
    <strong>پشتیبانی در دسترس است</strong>
    <small>{existingTickets.length?`${IrancellFormatPersianNumber(existingTickets.length)} درخواست در حساب شما ثبت شده است.`:'می‌توانی از همین صفحه درخواست جدید ثبت کنی.'}</small>
   </div>
  </footer>
 </section>
}