export function IrancellStudentChatsPage({params={},onNavigate,onBack,screen}){
 const{state,dispatch}=useIrancellStore();
 const[draft,setDraft]=useState('');
 const[subject,setSubject]=useState('ریاضی');
 const[attachmentName,setAttachmentName]=useState('');
 const[conversationSearch,setConversationSearch]=useState('');
 const[selectedConversationId,setSelectedConversationId]=useState('');
 const[mobileListOpen,setMobileListOpen]=useState(false);
 const processingRunRef=useRef('');
 const messagesEndRef=useRef(null);
 const attachmentInputRef=useRef(null);
 const currentUserId=state.session.currentUserId;
 const currentStudent=state.identity.usersById?.[currentUserId]||{};
 const isHistoryView=screen?.route==='student/chisti/history'||String(params?.mode||'')==='history';
 const conversations=useMemo(()=>{
  return Object.values(state.chisti.conversationsById||{})
   .filter(conversation=>!conversation.ownerId||conversation.ownerId===currentUserId)
   .sort((first,second)=>new Date(second.updatedAt||second.createdAt||0)-new Date(first.updatedAt||first.createdAt||0));
 },[state.chisti.conversationsById,currentUserId]);
 const conversationsKey=conversations.map(conversation=>`${conversation.id}:${conversation.updatedAt||''}`).join('|');
 const filteredConversations=useMemo(()=>{
  const normalizedSearch=String(conversationSearch||'').trim().toLowerCase();
  if(!normalizedSearch)return conversations;
  return conversations.filter(conversation=>{
   const problemText=(conversation.problemIds||[]).map(problemId=>state.chisti.problemsById?.[problemId]?.text||'').join(' ');
   return problemText.toLowerCase().includes(normalizedSearch);
  });
 },[conversationSearch,conversations,state.chisti.problemsById]);
 const selectedConversation=state.chisti.conversationsById?.[selectedConversationId]||null;
 const selectedProblems=(selectedConversation?.problemIds||[])
  .map(problemId=>state.chisti.problemsById?.[problemId])
  .filter(Boolean)
  .sort((first,second)=>new Date(first.createdAt||0)-new Date(second.createdAt||0));
 const activeJob=state.chisti.activeJob||null;
 const activeProcessingProblem=activeJob?state.chisti.problemsById?.[activeJob.problemId]||null:null;
 const selectedFirstProblem=selectedProblems[0]||null;
 const selectedLastProblem=selectedProblems[selectedProblems.length-1]||null;
 const selectedTitle=selectedFirstProblem?.text||'گفت‌وگوی جدید با چیستی';
 const suggestions=[
  {subject:'ریاضی',text:'معادله درجه دوم را با یک مثال مرحله‌به‌مرحله توضیح بده.'},
  {subject:'فیزیک',text:'قانون دوم نیوتن را با یک مسئله عددی ساده توضیح بده.'},
  {subject:'زبان انگلیسی',text:'Present Perfect را با سه مثال کوتاه آموزش بده.'},
  {subject:'شیمی',text:'مفهوم مول را ساده و کاربردی توضیح بده.'}
 ];

 useEffect(function IrancellStudentChatsSynchronizeSelection(){
  const requestedConversationId=String(params?.conversation||'');
  const requestedProblemId=String(params?.problem||'');
  const conversationFromProblem=requestedProblemId?conversations.find(conversation=>(conversation.problemIds||[]).includes(requestedProblemId)):null;
  const requestedConversation=requestedConversationId?conversations.find(conversation=>conversation.id===requestedConversationId):null;
  const currentSelectionExists=selectedConversationId&&conversations.some(conversation=>conversation.id===selectedConversationId);
  const nextConversationId=conversationFromProblem?.id||requestedConversation?.id||state.chisti.activeConversationId||conversations[0]?.id||'';
  if((!currentSelectionExists||conversationFromProblem||requestedConversation)&&nextConversationId!==selectedConversationId)setSelectedConversationId(nextConversationId);
 },[params?.conversation,params?.problem,conversationsKey,state.chisti.activeConversationId,selectedConversationId]);

 useEffect(function IrancellStudentChatsFollowNewConversation(){
  if(state.chisti.activeConversationId&&state.chisti.activeConversationId!==selectedConversationId)setSelectedConversationId(state.chisti.activeConversationId);
 },[state.chisti.activeConversationId,selectedConversationId]);

 useEffect(function IrancellStudentChatsResumeProcessing(){
  const job=state.chisti.activeJob;
  if(!job||job.status!=='processing'||processingRunRef.current===job.id)return;
  processingRunRef.current=job.id;
  IrancellChistiRunProcessing(dispatch,job.problemId).finally(function IrancellStudentChatsReleaseProcessingRunner(){
   if(processingRunRef.current===job.id)processingRunRef.current='';
  });
 },[state.chisti.activeJob?.id,dispatch]);

 useEffect(function IrancellStudentChatsScrollMessages(){
  if(messagesEndRef.current&&typeof messagesEndRef.current.scrollIntoView==='function')messagesEndRef.current.scrollIntoView({block:'end',behavior:'smooth'});
 },[selectedConversationId,selectedProblems.length,state.chisti.activeJob?.progress,state.chisti.lastCompletedProblemId]);

 function returnFromChats(){
  if(typeof onBack==='function'){
   onBack('student/home');
   return
  }
  onNavigate?.('student/home')
 }

 function openConversation(conversationId){
  setSelectedConversationId(conversationId);
  setMobileListOpen(false);
  if(isHistoryView)onNavigate?.('student/chisti',{conversation:conversationId})
 }

 function startNewConversation(){
  if(state.chisti.activeJob?.status==='processing')return;
  dispatch(IrancellChistiStartConversation());
  setSelectedConversationId('');
  setDraft('');
  setAttachmentName('');
  setMobileListOpen(false);
  if(isHistoryView)onNavigate?.('student/chisti')
 }

 function selectSuggestion(suggestion){
  setSubject(suggestion.subject);
  setDraft(suggestion.text);
 }

 function handleAttachment(event){
  const file=event.target.files?.[0]||null;
  event.target.value='';
  if(!file)return;
  if(Number(file.size||0)>15*1024*1024){
   dispatch({type:'IRANCELL_UI_TOAST',tone:'danger',message:'حجم فایل باید کمتر از ۱۵ مگابایت باشد.'});
   return
  }
  setAttachmentName(file.name||'پیوست')
 }

 function submitMessage(event){
  event.preventDefault();
  const question=String(draft||'').trim();
  if(!question){
   dispatch({type:'IRANCELL_UI_TOAST',tone:'danger',message:'متن سؤال را وارد کنید.'});
   return
  }
  if(state.chisti.activeJob?.status==='processing'){
   dispatch({type:'IRANCELL_UI_TOAST',tone:'warning',message:'پاسخ سؤال قبلی هنوز در حال آماده‌سازی است.'});
   return
  }
  const problemId=`problem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  dispatch(IrancellChistiSubmitProblem({
   problemId,
   text:question,
   subject,
   grade:currentStudent.grade||'دهم',
   topic:'تشخیص خودکار',
   attachmentName
  }));
  setDraft('');
  setAttachmentName('')
 }

 function retryProblem(problemId){
  dispatch(IrancellChistiRetryProblem(problemId))
 }

 function openRecommendedContent(contentId){
  if(!contentId)return;
  dispatch(IrancellContentSelect(contentId,'course'));
  onNavigate?.(`student/binayi/course/${contentId}`)
 }

 return <section className={`ir-chisti-main-chat ${isHistoryView?'is-history-view':''} ${mobileListOpen?'is-list-open':''}`}>
  <button type="button" className="ir-chisti-main-chat__scrim" aria-label="بستن فهرست گفت‌وگوها" onClick={()=>setMobileListOpen(false)}/>

  <aside className="ir-chisti-main-chat__sidebar">
   <header className="ir-chisti-main-chat__sidebar-header">
    <div>
     <span className="ir-chisti-main-chat__brand-mark" aria-hidden="true">✦</span>
     <div><strong>چیستی</strong><small>دستیار یادگیری هوشمند</small></div>
    </div>
    <button type="button" className="ir-chisti-main-chat__sidebar-close" aria-label="بستن فهرست" onClick={()=>setMobileListOpen(false)}>×</button>
   </header>

   <button type="button" className="ir-chisti-main-chat__new" disabled={state.chisti.activeJob?.status==='processing'} onClick={startNewConversation}>
    <span aria-hidden="true">＋</span>
    گفت‌وگوی جدید
   </button>

   <label className="ir-chisti-main-chat__search">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
    <input value={conversationSearch} onChange={event=>setConversationSearch(event.target.value)} placeholder="جست‌وجوی گفت‌وگوها"/>
   </label>

   <div className="ir-chisti-main-chat__conversation-list" role="list">
    {filteredConversations.length?filteredConversations.map(conversation=>{
     const conversationProblems=(conversation.problemIds||[]).map(problemId=>state.chisti.problemsById?.[problemId]).filter(Boolean);
     const firstProblem=conversationProblems[0]||null;
     const lastProblem=conversationProblems[conversationProblems.length-1]||null;
     const isActive=conversation.id===selectedConversationId;
     return <button type="button" role="listitem" className={isActive?'is-active':''} key={conversation.id} onClick={()=>openConversation(conversation.id)}>
      <span className="ir-chisti-main-chat__conversation-icon" aria-hidden="true">✦</span>
      <span>
       <strong>{firstProblem?.text||'گفت‌وگوی آموزشی'}</strong>
       <small>{IrancellFormatPersianNumber(conversationProblems.length)} پیام · {new Date(conversation.updatedAt||conversation.createdAt||Date.now()).toLocaleDateString('fa-IR')}</small>
      </span>
      {lastProblem?.status==='processing'&&<i className="ir-chisti-main-chat__processing-dot" aria-label="در حال پردازش"/>}
     </button>
    }):<div className="ir-chisti-main-chat__sidebar-empty"><strong>گفت‌وگویی پیدا نشد</strong><small>یک گفت‌وگوی تازه بسازید یا عبارت جست‌وجو را تغییر دهید.</small></div>}
   </div>
  </aside>

  <main className="ir-chisti-main-chat__workspace">
   <header className="ir-chisti-main-chat__topbar">
    <div className="ir-chisti-main-chat__topbar-start">
     <button type="button" className="ir-chisti-main-chat__back" aria-label="بازگشت" onClick={returnFromChats}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
     </button>
     <button type="button" className="ir-chisti-main-chat__list-toggle" aria-label="نمایش گفت‌وگوها" onClick={()=>setMobileListOpen(true)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
     </button>
     <div>
      <strong>{selectedTitle.length>55?`${selectedTitle.slice(0,55)}…`:selectedTitle}</strong>
      <small>{activeProcessingProblem?'چیستی در حال آماده‌سازی پاسخ است':selectedLastProblem?.subject||'آماده پاسخ‌گویی'}</small>
     </div>
    </div>
    <button type="button" className="ir-chisti-main-chat__history-button" onClick={()=>onNavigate?.('student/chisti/history')}>تاریخچه</button>
   </header>

   <div className="ir-chisti-main-chat__messages" aria-live="polite">
    {!selectedProblems.length&&<section className="ir-chisti-main-chat__welcome">
     <span className="ir-chisti-main-chat__welcome-mark" aria-hidden="true">✦</span>
     <h1>سلام {currentStudent.firstName||currentStudent.name||'دانش‌آموز'}، چه چیزی می‌خواهی یاد بگیری؟</h1>
     <p>سؤال درسی، تصویر تمرین یا فایل آموزشی را بفرست تا چیستی مرحله‌به‌مرحله همراهت باشد.</p>
     <div>{suggestions.map(suggestion=><button type="button" key={suggestion.text} onClick={()=>selectSuggestion(suggestion)}><strong>{suggestion.subject}</strong><span>{suggestion.text}</span></button>)}</div>
    </section>}

    {selectedProblems.map(problem=>{
     const recommendation=state.chisti.recommendationsByProblemId?.[problem.id]||null;
     const recommendedContent=(recommendation?.contentIds||[]).map(contentId=>state.content.catalogueById?.[contentId]).filter(Boolean);
     const isProblemProcessing=activeJob?.problemId===problem.id&&activeJob.status==='processing';
     return <section className="ir-chisti-main-chat__exchange" key={problem.id}>
      <article className="ir-chisti-main-chat__message is-user">
       <div className="ir-chisti-main-chat__avatar">{String(currentStudent.name||'د').charAt(0)}</div>
       <div>
        <header><strong>شما</strong><time>{new Date(problem.createdAt||Date.now()).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}</time></header>
        <p>{problem.text}</p>
        {problem.attachmentName&&<span className="ir-chisti-main-chat__message-attachment">📎 {problem.attachmentName}</span>}
       </div>
      </article>

      <article className={`ir-chisti-main-chat__message is-assistant ${problem.status==='failed'?'is-failed':''}`}>
       <div className="ir-chisti-main-chat__avatar is-assistant" aria-hidden="true">✦</div>
       <div>
        <header><strong>چیستی</strong><time>{problem.answeredAt?new Date(problem.answeredAt).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'}):''}</time></header>

        {isProblemProcessing&&<div className="ir-chisti-main-chat__thinking">
         <span/><span/><span/>
         <p>{activeJob.stage==='topic'?'در حال تشخیص موضوع سؤال':activeJob.stage==='resources'?'در حال یافتن منابع آموزشی':activeJob.stage==='path'?'در حال ساخت مسیر یادگیری':activeJob.stage==='answer'?'در حال نوشتن پاسخ':'در حال آماده‌سازی پاسخ'}</p>
         <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={activeJob.progress||0}><i style={{width:`${activeJob.progress||0}%`}}/></div>
         <button type="button" onClick={()=>dispatch(IrancellChistiCancelProcessing(problem.id))}>لغو پردازش</button>
        </div>}

        {!isProblemProcessing&&problem.status==='failed'&&<div className="ir-chisti-main-chat__error">
         <strong>پاسخ آماده نشد</strong>
         <p>{state.chisti.error?.problemId===problem.id?state.chisti.error.message:'در آماده‌سازی پاسخ مشکلی رخ داد.'}</p>
         <button type="button" onClick={()=>retryProblem(problem.id)}>تلاش دوباره</button>
        </div>}

        {!isProblemProcessing&&problem.status==='cancelled'&&<div className="ir-chisti-main-chat__error">
         <strong>پردازش لغو شد</strong>
         <p>سؤال شما ذخیره شده و می‌توانید دوباره پاسخ را بسازید.</p>
         <button type="button" onClick={()=>retryProblem(problem.id)}>ساخت دوباره پاسخ</button>
        </div>}

        {recommendation&&<div className="ir-chisti-main-chat__answer">
         <p>{recommendation.answer}</p>
         {recommendedContent.length>0&&<div className="ir-chisti-main-chat__resources">
          <strong>پیشنهاد برای ادامه یادگیری</strong>
          {recommendedContent.map(content=><button type="button" key={content.id} onClick={()=>openRecommendedContent(content.id)}>
           <span>▶</span>
           <span><b>{content.title}</b><small>{content.subject} · {content.grade}</small></span>
          </button>)}
         </div>}
         {Array.isArray(recommendation.nextActions)&&recommendation.nextActions.length>0&&<div className="ir-chisti-main-chat__next-actions">{recommendation.nextActions.map(actionLabel=><button type="button" key={actionLabel} onClick={()=>setDraft(actionLabel)}>{actionLabel}</button>)}</div>}
        </div>}
       </div>
      </article>
     </section>
    })}
    <div ref={messagesEndRef}/>
   </div>

   <form className="ir-chisti-main-chat__composer" onSubmit={submitMessage}>
    {attachmentName&&<div className="ir-chisti-main-chat__selected-attachment"><span>📎 {attachmentName}</span><button type="button" aria-label="حذف پیوست" onClick={()=>setAttachmentName('')}>×</button></div>}
    <div className="ir-chisti-main-chat__subject-row">
     <label>
      <span>درس</span>
      <select value={subject} onChange={event=>setSubject(event.target.value)}>
       <option value="ریاضی">ریاضی</option>
       <option value="فیزیک">فیزیک</option>
       <option value="شیمی">شیمی</option>
       <option value="زیست‌شناسی">زیست‌شناسی</option>
       <option value="زبان انگلیسی">زبان انگلیسی</option>
       <option value="علوم">علوم</option>
       <option value="فارسی">فارسی</option>
      </select>
     </label>
     <small>{state.ui.offline?'حالت آفلاین؛ ارسال پس از اتصال امکان‌پذیر است':'پاسخ‌ها در تاریخچه حساب شما ذخیره می‌شوند.'}</small>
    </div>
    <div className="ir-chisti-main-chat__composer-box">
     <button type="button" className="ir-chisti-main-chat__attach" aria-label="افزودن پیوست" onClick={()=>attachmentInputRef.current?.click()}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 11.5-8.8 8.8a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.5-8.5"/></svg>
     </button>
     <textarea value={draft} onChange={event=>setDraft(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitMessage(event)}}} placeholder="سؤالت را برای چیستی بنویس..." rows="1" disabled={state.chisti.activeJob?.status==='processing'||state.ui.offline}/>
     <button type="submit" className="ir-chisti-main-chat__send" disabled={!String(draft||'').trim()||state.chisti.activeJob?.status==='processing'||state.ui.offline} aria-label="ارسال سؤال">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14-8-4 16-3-6Z"/><path d="m12 14 7-10"/></svg>
     </button>
     <input ref={attachmentInputRef} type="file" hidden accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" onChange={handleAttachment}/>
    </div>
   </form>
  </main>
 </section>
}