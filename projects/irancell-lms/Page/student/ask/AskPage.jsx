export function IrancellStudentAskPage({params,onNavigate,onBack}){
 const{state,dispatch}=useIrancellStore();
 const[text,setText]=useState('');
 const[subject,setSubject]=useState('ریاضی');
 const[activeSuggestion,setActiveSuggestion]=useState('مسئله ریاضی');
 const[attachmentName,setAttachmentName]=useState('');
 const[attachmentMeta,setAttachmentMeta]=useState(null);
 const[attachmentOverlayOpen,setAttachmentOverlayOpen]=useState(false);
 const[fieldMessage,setFieldMessage]=useState('');
 const[submitted,setSubmitted]=useState(false);
 const[followUpText,setFollowUpText]=useState('');
 const[showSteps,setShowSteps]=useState(false);
 const processingRunRef=useRef('');
 const attachmentCameraInputRef=useRef(null);
 const attachmentGalleryInputRef=useRef(null);
 const attachmentFileInputRef=useRef(null);
 const student=state.identity.usersById[state.session.currentUserId]||{};
 const grade=student.grade||'دهم';
 const problems=Object.values(state.chisti.problemsById||{}).filter(item=>!item.ownerId||item.ownerId===state.session.currentUserId).sort((first,second)=>new Date(second.createdAt||0)-new Date(first.createdAt||0));
 const recommendations=Object.values(state.chisti.recommendationsByProblemId||{});
 const recommendation=recommendations[recommendations.length-1]||null;
 const activeJob=state.chisti.activeJob||null;
 const processingProblem=activeJob?state.chisti.problemsById[activeJob.problemId]||null:null;
 const failedProblem=state.chisti.error?.problemId?state.chisti.problemsById[state.chisti.error.problemId]||null:null;
 const completedProblemId=state.chisti.lastCompletedProblemId||null;
 const completedProblem=completedProblemId?state.chisti.problemsById[completedProblemId]||null:null;
 const completedRecommendation=completedProblemId?state.chisti.recommendationsByProblemId[completedProblemId]||null:null;
 const completedContentId=completedRecommendation?.contentIds?.[0]||null;
 const completedContent=completedContentId?state.content.catalogueById[completedContentId]||null:null;

 useEffect(function IrancellStudentAskResumeProcessing(){
  const job=state.chisti.activeJob;
  if(!job||job.status!=='processing'||processingRunRef.current===job.id)return;
  processingRunRef.current=job.id;
  IrancellChistiRunProcessing(dispatch,job.problemId).finally(function IrancellStudentAskReleaseProcessingRunner(){
   if(processingRunRef.current===job.id)processingRunRef.current='';
  });
 },[state.chisti.activeJob?.id,dispatch]);

 useEffect(function IrancellStudentAskAttachmentKeyboardDismiss(){
  if(!attachmentOverlayOpen)return undefined;
  function handleKeyDown(event){
   if(event.key==='Escape')setAttachmentOverlayOpen(false);
  }
  document.addEventListener('keydown',handleKeyDown);
  return()=>document.removeEventListener('keydown',handleKeyDown);
 },[attachmentOverlayOpen]);

 useEffect(function IrancellStudentAskOpenRequestedAttachment(){
  if(String(params?.attachment||'')==='1')setAttachmentOverlayOpen(true);
 },[params?.attachment]);

 useEffect(function IrancellStudentAskAttachmentUploadProgress(){
  if(!attachmentMeta||attachmentMeta.status!=='uploading')return undefined;
  const timer=window.setInterval(()=>{
   setAttachmentMeta(current=>{
    if(!current||current.status!=='uploading')return current;
    const nextProgress=Math.min(100,(Number(current.progress)||0)+18);
    return{...current,progress:nextProgress,status:nextProgress>=100?'success':'uploading'};
   });
  },180);
  return()=>window.clearInterval(timer);
 },[attachmentMeta?.status,attachmentMeta?.uploadId]);

 useEffect(function IrancellStudentAskAttachmentPreviewCleanup(){
  return()=>{
   if(attachmentMeta?.previewUrl&&attachmentMeta.previewUrl.startsWith('blob:'))URL.revokeObjectURL(attachmentMeta.previewUrl);
  };
 },[attachmentMeta?.previewUrl]);

 const starterSearches=[
  {id:'math',label:'ریاضی - معادله درجه دوم',query:'معادله درجه دوم را چطور حل کنم؟',subject:'ریاضی'},
  {id:'physics',label:'فیزیک - قانون نیوتن',query:'قانون دوم نیوتن را با یک مثال توضیح بده.',subject:'فیزیک'},
  {id:'english',label:'زبان - گرامر',query:'گرامر زمان حال کامل را ساده توضیح بده.',subject:'زبان انگلیسی'}
 ];
 const recentItems=problems.length?problems.slice(0,3).map(problem=>({id:problem.id,label:`${problem.subject||'درس'} - ${problem.text}`,query:problem.text,subject:problem.subject||'ریاضی'})):starterSearches;
 const suggestions=state.settings?.demo?.showGuidedExamples===false?[]:[
  {label:'مسئله ریاضی',subject:'ریاضی',prompt:'یک مسئله ریاضی متناسب با پایه من را مرحله‌به‌مرحله حل کن و روش حل را توضیح بده.'},
  {label:'یافتن معلم',subject:'ریاضی',prompt:'برای موضوعی که در آن مشکل دارم یک مسیر مناسب برای پیدا کردن معلم پیشنهاد بده.'},
  {label:'کمک تکلیف',subject:'عمومی',prompt:'برای انجام تکلیفم کمکم کن؛ ابتدا مسئله را بفهم و بعد مرحله‌به‌مرحله راهنمایی کن.'},
  {label:'نمایش ویدیو',subject:'ریاضی',prompt:'برای موضوع درسی من یک ویدیوی آموزشی مناسب پیشنهاد بده و بگو بعد از دیدنش چه تمرینی انجام بدهم.'}
 ];

 function submit(event){
  event.preventDefault();
  const question=String(text||'').trim();
  setSubmitted(true);
  if(state.chisti.status==='processing'){
   setFieldMessage('پاسخ سؤال قبلی هنوز در حال آماده‌سازی است.');
   return
  }
  if(state.ui.offline){
   setFieldMessage('برای ارسال سؤال، اتصال اینترنت را بررسی کنید.');
   return
  }
  const validation=IrancellValidateRequired(question,'سؤال');
  if(validation){
   setFieldMessage(validation);
   return
  }
  if(attachmentMeta?.status==='uploading'){
   setFieldMessage('لطفاً تا پایان بارگذاری فایل صبر کنید.');
   return
  }
  if(attachmentMeta?.status==='failed'){
   setFieldMessage('بارگذاری فایل ناموفق بود. ابتدا دوباره تلاش کنید.');
   return
  }
  const problemId=`problem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  setFieldMessage('');
  dispatch(IrancellChistiSubmitProblem({problemId,text:question,subject,grade,topic:'تشخیص خودکار',attachmentName}));
 }

 function chooseRecent(item){
  setText(item.query);
  setSubject(item.subject);
  setFieldMessage('');
  setSubmitted(false);
 }

 function chooseSuggestion(item){
  setActiveSuggestion(item.label);
  setSubject(item.subject);
  setText(item.prompt);
  setFieldMessage('');
  setSubmitted(false);
 }

 function startVoice(target='search'){
  if(typeof window==='undefined')return;
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){
   setFieldMessage('ورودی صوتی در این دستگاه پشتیبانی نمی‌شود.');
   return
  }
  const recognition=new Recognition();
  recognition.lang='fa-IR';
  recognition.interimResults=false;
  recognition.maxAlternatives=1;
  recognition.onresult=event=>{
   const transcript=event.results?.[0]?.[0]?.transcript||'';
   if(transcript){
    if(target==='followup')setFollowUpText(transcript);
    else setText(transcript);
    setFieldMessage('');
    setSubmitted(false);
   }
  };
  recognition.onerror=()=>setFieldMessage('دریافت صدا انجام نشد. دوباره تلاش کنید.');
  recognition.start();
 }

 function formatAttachmentSize(size){
  const bytes=Math.max(0,Number(size)||0);
  if(bytes<1024)return`${IrancellFormatPersianNumber(bytes)} بایت`;
  if(bytes<1024*1024)return`${IrancellFormatPersianNumber(Math.max(1,Math.round(bytes/1024)))} کیلوبایت`;
  return`${IrancellFormatPersianNumber((bytes/(1024*1024)).toFixed(1))} مگابایت`;
 }

 function clearAttachment(){
  setAttachmentMeta(current=>{
   if(current?.previewUrl&&current.previewUrl.startsWith('blob:'))URL.revokeObjectURL(current.previewUrl);
   return null;
  });
  setAttachmentName('');
  setFieldMessage('');
 }

 function retryAttachment(){
  setAttachmentMeta(current=>{
   if(!current)return current;
   if(Number(current.size||0)>15*1024*1024)return{...current,status:'failed',progress:0,error:'حجم فایل بیشتر از ۱۵ مگابایت است.'};
   return{...current,status:'uploading',progress:8,error:'',uploadId:`upload-${Date.now()}`};
  });
  setFieldMessage('');
 }

 function handleAttachmentSelected(event){
  const file=event.target.files?.[0]||null;
  event.target.value='';
  if(!file)return;
  const isImage=String(file.type||'').startsWith('image/');
  const previewUrl=isImage&&typeof URL!=='undefined'&&typeof URL.createObjectURL==='function'?URL.createObjectURL(file):'';
  const tooLarge=Number(file.size||0)>15*1024*1024;
  setAttachmentMeta(current=>{
   if(current?.previewUrl&&current.previewUrl.startsWith('blob:'))URL.revokeObjectURL(current.previewUrl);
   return{
    id:`attachment-${Date.now()}`,
    uploadId:`upload-${Date.now()}`,
    file,
    name:file.name||'پیوست',
    size:Number(file.size)||0,
    type:file.type||'application/octet-stream',
    isImage,
    previewUrl,
    progress:tooLarge?0:8,
    status:tooLarge?'failed':'uploading',
    error:tooLarge?'حجم فایل بیشتر از ۱۵ مگابایت است.':''
   };
  });
  setAttachmentName(file.name||'پیوست');
  setFieldMessage('');
  setAttachmentOverlayOpen(false);
 }

 function openAttachmentSource(inputRef){
  const input=inputRef?.current;
  if(!input)return;
  input.click();
 }

 function renderAttachmentState(){
  if(!attachmentMeta)return null;
  const isUploading=attachmentMeta.status==='uploading';
  const isFailed=attachmentMeta.status==='failed';
  const isSuccess=attachmentMeta.status==='success';
  const progress=Math.max(0,Math.min(100,Number(attachmentMeta.progress)||0));

  if(isFailed)return <article className="ir-chisti-attachment-state is-failed" role="alert">
   <span className="ir-chisti-attachment-state__failed-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v6M12 17h.01"/></svg>
   </span>
   <strong>بارگذاری ناموفق بود</strong>
   <button type="button" className="ir-chisti-attachment-state__retry" onClick={retryAttachment}>تلاش مجدد</button>
  </article>;

  return <article className={`ir-chisti-attachment-state ${attachmentMeta.isImage?'is-image':'is-file'} ${isUploading?'is-uploading':''} ${isSuccess?'is-success':''}`}>
   <span className="ir-chisti-attachment-state__preview" aria-hidden="true">
    {attachmentMeta.isImage&&attachmentMeta.previewUrl?<img src={attachmentMeta.previewUrl} alt=""/>:<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5"/></svg>}
    {isSuccess&&!attachmentMeta.isImage&&<i className="ir-chisti-attachment-state__success-mark">✓</i>}
   </span>

   <div className="ir-chisti-attachment-state__copy">
    <strong>{attachmentMeta.name}</strong>
    {isUploading?<small className="is-uploading-text">در حال بارگذاری...</small>:<small>{formatAttachmentSize(attachmentMeta.size)}</small>}
   </div>

   <button type="button" className="ir-chisti-attachment-state__remove" aria-label="حذف فایل" onClick={clearAttachment}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m9 9 6 6M15 9l-6 6"/></svg>
   </button>

   {isUploading&&<div className="ir-chisti-attachment-state__progress" aria-label="درصد بارگذاری" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
    <span style={{width:`${progress}%`}}/>
   </div>}
  </article>
 }

 function renderAttachmentOverlay(){
  if(!attachmentOverlayOpen)return null;

  function chooseAttachment({accept,capture}){
   if(typeof document==='undefined')return;

   const nativeInput=document.createElement('input');
   nativeInput.type='file';
   nativeInput.accept=accept;
   nativeInput.tabIndex=-1;
   nativeInput.setAttribute('aria-hidden','true');
   if(capture)nativeInput.setAttribute('capture',capture);

   nativeInput.style.setProperty('display','none','important');
   nativeInput.style.setProperty('position','fixed','important');
   nativeInput.style.setProperty('width','0','important');
   nativeInput.style.setProperty('height','0','important');
   nativeInput.style.setProperty('opacity','0','important');
   nativeInput.style.setProperty('pointer-events','none','important');

   const removeNativeInput=()=>nativeInput.remove();

   nativeInput.addEventListener('change',event=>{
    handleAttachmentSelected(event);
    removeNativeInput();
   },{once:true});
   nativeInput.addEventListener('cancel',removeNativeInput,{once:true});

   document.body.appendChild(nativeInput);
   nativeInput.click()
  }

  const overlay=<div className="ir-chisti-attachment-overlay" role="presentation" onMouseDown={()=>setAttachmentOverlayOpen(false)}>
   <section className="ir-chisti-attachment-sheet" role="dialog" aria-modal="true" aria-label="افزودن پیوست" onMouseDown={event=>event.stopPropagation()}>
    <span className="ir-chisti-attachment-sheet__handle" aria-hidden="true"/>

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>chooseAttachment({accept:'image/*',capture:'environment'})}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" style={{display:'block',width:'22px',height:'22px',fill:'none',stroke:'#202024',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
       <path d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3v10.2H4Z"/>
       <circle cx="12" cy="13.2" r="3.4"/>
      </svg>
     </span>
     <span>گرفتن عکس</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>chooseAttachment({accept:'image/*'})}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" style={{display:'block',width:'22px',height:'22px',fill:'none',stroke:'#202024',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
       <rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/>
       <circle cx="9" cy="9.5" r="1.7"/>
       <path d="m5.5 17.5 4.6-4.6 3.2 3.2 2.1-2.1 3.1 3.5"/>
      </svg>
     </span>
     <span>انتخاب از گالری</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>chooseAttachment({accept:'image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt'})}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" style={{display:'block',width:'22px',height:'22px',fill:'none',stroke:'#202024',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
       <path d="M6.5 3.5h7.7l3.8 3.8v13.2H6.5Z"/>
       <path d="M14 3.7v4h3.8M9 12h6M9 15.5h6"/>
      </svg>
     </span>
     <span>انتخاب فایل</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option is-cancel" onClick={()=>setAttachmentOverlayOpen(false)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" style={{display:'block',width:'22px',height:'22px',fill:'none',stroke:'#B3261E',strokeWidth:1.9,strokeLinecap:'round',strokeLinejoin:'round'}}>
       <circle cx="12" cy="12" r="8"/>
       <path d="m9 9 6 6M15 9l-6 6"/>
      </svg>
     </span>
     <span>انصراف</span>
    </button>
   </section>
  </div>;
  if(typeof document!=='undefined'&&typeof ReactDOM!=='undefined'&&typeof ReactDOM.createPortal==='function')return ReactDOM.createPortal(overlay,document.body);
  return overlay
 }

 function returnFromChisti(fallbackRoute='student/home'){
  if(typeof onBack==='function'){
   onBack(fallbackRoute);
   return
  }
  onNavigate?.(fallbackRoute)
 }

 function closeGeneratedResult(nextRoute){
  if(completedProblemId)dispatch(IrancellChistiDismissResult(completedProblemId));
  setSubmitted(false);
  setShowSteps(false);
  setFollowUpText('');
  setFieldMessage('');
  if(nextRoute)onNavigate?.(nextRoute);
 }

 function openCompletedLearning(){
  if(completedProblemId)dispatch(IrancellChistiDismissResult(completedProblemId));
  if(completedContentId)onNavigate?.(`student/binayi/course/${completedContentId}`);
  else onNavigate?.('student/binayi');
 }

 function submitFollowUp(event){
  event.preventDefault();
  const question=String(followUpText||'').trim();
  if(state.ui.offline){
   setFieldMessage('برای ارسال سؤال، اتصال اینترنت را بررسی کنید.');
   return
  }
  if(!question){
   setFieldMessage('سؤال بعدی را بنویس.');
   return
  }
  if(attachmentMeta?.status==='uploading'){
   setFieldMessage('لطفاً تا پایان بارگذاری فایل صبر کنید.');
   return
  }
  if(attachmentMeta?.status==='failed'){
   setFieldMessage('بارگذاری فایل ناموفق بود. ابتدا دوباره تلاش کنید.');
   return
  }
  const problemId=`problem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  setFieldMessage('');
  setFollowUpText('');
  setShowSteps(false);
  dispatch(IrancellChistiSubmitProblem({
   problemId,
   text:question,
   subject:completedProblem?.subject||subject,
   grade:completedProblem?.grade||grade,
   topic:completedProblem?.topic||'تشخیص خودکار',
   attachmentName
  }));
 }

 if(processingProblem||failedProblem){
  const problem=processingProblem||failedProblem;
  const progress=activeJob?.progress||0;
  const isFailed=Boolean(failedProblem)&&state.chisti.status==='error';
  const topicDone=progress>=40;
  const resourcesDone=progress>=68;
  const pathDone=progress>=90;
  const topicActive=!topicDone;
  const resourcesActive=topicDone&&!resourcesDone;
  const pathActive=resourcesDone&&!pathDone;
  function cancelAndReturn(){
   if(activeJob?.problemId)dispatch(IrancellChistiCancelProcessing(activeJob.problemId));
   setSubmitted(false);
   setText(problem.text||'');
   setSubject(problem.subject||subject);
   setFieldMessage('');
   returnFromChisti('student/home')
  }
  function retryGeneration(){
   if(state.ui.offline){
    setFieldMessage('برای تلاش دوباره، اتصال اینترنت را بررسی کنید.');
    return
   }
   processingRunRef.current='';
   dispatch(IrancellChistiRetryProblem(problem.id));
  }
  return <section className={`ir-chisti-generating-page ${isFailed?'is-failed':''}`} aria-label={isFailed?'خطا در آماده‌سازی پاسخ':'در حال آماده‌سازی پاسخ'}>
   <header className="ir-chisti-generating-page__header">
    <button type="button" aria-label="بازگشت" onClick={cancelAndReturn}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/><path d="M8 12h11"/></svg>
    </button>
    <div>
     <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></svg></span>
     <strong>هوش مصنوعی آموزشی</strong>
    </div>
   </header>

   <article className="ir-chisti-generating-page__question">
    <span>سؤال شما:</span>
    <strong>{problem.text}</strong>
    <small>{isFailed?'پردازش متوقف شد؛ سؤال شما ذخیره شده است.':'چیستی · هوش مصنوعی در حال پردازش...'}</small>
   </article>

   <section className="ir-chisti-generating-page__processing">
    <span className="ir-chisti-generating-page__processing-kicker">{isFailed?'پردازش متوقف شد':'چیستی در حال فکر کردن است'}</span>
    <div className="ir-chisti-generating-page__orb" aria-hidden="true"><i/></div>
    <h1>{isFailed?'آماده‌سازی پاسخ کامل نشد':'در حال تحلیل سؤال شما...'}</h1>
    <p>{isFailed?state.chisti.error?.message:'سؤال، منابع و مسیر مناسب یادگیری هم‌زمان بررسی می‌شوند.'}</p>
   </section>

   <article className="ir-chisti-generating-page__stages">
    <h2>مراحل پردازش</h2>
    <div className={`ir-chisti-generating-page__stage ${topicDone?'is-done':topicActive?'is-active':''}`}>
     <span className="ir-chisti-generating-page__stage-icon">{topicDone?'✓':topicActive?'↻':'○'}</span>
     <strong>شناسایی موضوع: {activeJob?.detectedTopic||problem.topic||problem.subject}</strong>
    </div>
    <div className={`ir-chisti-generating-page__stage ${resourcesDone?'is-done':resourcesActive?'is-active':''}`}>
     <span className="ir-chisti-generating-page__stage-icon">{resourcesDone?'✓':resourcesActive?'↻':'○'}</span>
     <strong>جستجو در منابع یادگیری...</strong>
    </div>
    <div className={`ir-chisti-generating-page__stage ${pathDone?'is-done':pathActive?'is-active':''}`}>
     <span className="ir-chisti-generating-page__stage-icon">{pathDone?'✓':pathActive?'↻':'○'}</span>
     <strong>آماده‌سازی مسیر یادگیری</strong>
    </div>
    <div className="ir-chisti-generating-page__progress" role="progressbar" aria-label="پیشرفت آماده‌سازی پاسخ" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
     <span style={{width:`${progress}%`}}/>
    </div>
    <small>{IrancellFormatPersianNumber(progress)}٪ تکمیل شده</small>
   </article>

   <div className="ir-chisti-generating-page__actions">
    {isFailed?<button type="button" onClick={retryGeneration}>تلاش دوباره</button>:<button type="button" onClick={cancelAndReturn}>لغو و بازگشت</button>}
    <button type="button" disabled={!isFailed&&state.chisti.status==='processing'} onClick={()=>{if(isFailed)retryGeneration()}}>مشاهده نتایج</button>
   </div>

   {fieldMessage&&<p className="ir-chisti-generating-page__error" role="alert">{fieldMessage}</p>}
  </section>
 }

 if(completedProblem&&completedRecommendation){
  const resultTopic=completedProblem.topic&&completedProblem.topic!=='تشخیص خودکار'?completedProblem.topic:completedProblem.text;
  const durationMinutes=Math.max(1,Math.floor((Number(completedContent?.duration)||750)/60));
  const durationSeconds=Math.max(0,(Number(completedContent?.duration)||750)%60);
  const durationLabel=`${durationMinutes.toLocaleString('fa-IR')}:${String(durationSeconds).padStart(2,'0').replace(/\d/g,digit=>'۰۱۲۳۴۵۶۷۸۹'[Number(digit)])} دقیقه`;
  const resourceTitle=completedContent?.title||`ویدیوی درس: ${completedProblem.topic||completedProblem.subject||'آموزشی'}`;

  return <section className="ir-chisti-results-page" aria-label="نتیجه هوش مصنوعی آموزشی">
   <header className="ir-chisti-results-page__header">
    <button type="button" className="ir-chisti-results-page__back" aria-label="بازگشت" onClick={()=>{closeGeneratedResult();returnFromChisti('student/home')}}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/><path d="M8 12h11"/></svg>
    </button>
    <button type="button" className="ir-chisti-results-page__dashboard" onClick={()=>closeGeneratedResult('student/home')}>داشبورد</button>
   </header>

   <div className="ir-chisti-results-page__status"><span>✓</span> تکمیل شد</div>

   <section className="ir-chisti-results-page__question">
    <div className="ir-chisti-results-page__question-meta">
     <span>سؤال شما</span>
     <div>
      <b>{completedProblem.subject||'موضوع آموزشی'}</b>
      <b>{completedProblem.grade||grade}</b>
     </div>
    </div>
    <h1>{resultTopic}</h1>
   </section>

   <article className="ir-chisti-results-page__understanding">
    <header>
     <div className="ir-chisti-results-page__ai-title">
      <span className="ir-chisti-results-page__ai-mark" aria-hidden="true">
       <svg viewBox="0 0 24 24"><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></svg>
      </span>
      <div>
       <small>پاسخ چیستی</small>
       <h2>درک هوش مصنوعی</h2>
      </div>
     </div>
     <span className="ir-chisti-results-page__confidence">
      <b>{Math.round((completedRecommendation.confidence||0)*100).toLocaleString('fa-IR')}٪</b>
      <small>اطمینان</small>
     </span>
    </header>
    <p>{completedRecommendation.answer}</p>
    <div className="ir-chisti-results-page__confidence-bar" aria-hidden="true">
     <span style={{width:`${Math.round((completedRecommendation.confidence||0)*100)}%`}}/>
    </div>
    <button type="button" className="ir-chisti-results-page__start" onClick={openCompletedLearning}>
     <span>شروع مسیر یادگیری</span>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
   </article>

   <section className="ir-chisti-results-page__resources" aria-labelledby="irancell-chisti-result-resources">
    <h2 id="irancell-chisti-result-resources">منابع</h2>

    <button type="button" className="ir-chisti-results-page__resource is-video" onClick={openCompletedLearning}>
     <span className="ir-chisti-results-page__resource-play" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg>
     </span>
     <div>
      <strong>{resourceTitle}</strong>
      <small>{durationLabel}</small>
     </div>
    </button>

    <article className={`ir-chisti-results-page__resource is-steps ${showSteps?'is-open':''}`}>
     <button type="button" className="ir-chisti-results-page__steps-action" onClick={()=>setShowSteps(value=>!value)}>{showSteps?'بستن':'مشاهده'}</button>
     <div>
      <strong>گام به گام: حل مسائل</strong>
      <small>مراحل تقسیم و حل</small>
     </div>
     {showSteps&&<ol>
      <li>داده‌ها و مجهول اصلی سؤال را مشخص کن.</li>
      <li>قانون یا رابطه مرتبط با موضوع را انتخاب کن.</li>
      <li>مقادیر را مرحله‌به‌مرحله جایگذاری و محاسبه کن.</li>
      <li>پاسخ نهایی را با شرایط مسئله بررسی کن.</li>
     </ol>}
    </article>
   </section>

   <form className={`ir-chisti-results-page__followup ${fieldMessage?'has-error':''}`} onSubmit={submitFollowUp} noValidate>
    <button type="submit" className="ir-chisti-results-page__send" aria-label="ارسال سؤال بعدی" disabled={!followUpText.trim()||state.ui.offline}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8Z"/><path d="M7 12h14"/></svg>
    </button>

    <input value={followUpText} onChange={event=>{setFollowUpText(event.target.value);setFieldMessage('')}} placeholder="سوال بعدی را بپرس..." aria-label="سؤال بعدی"/>

    <button type="button" className="ir-chisti-results-page__mic" aria-label="پرسش صوتی" onClick={()=>startVoice('followup')}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
    </button>

    <button type="button" className="ir-chisti-results-page__attach" aria-label="افزودن فایل" aria-haspopup="dialog" onClick={()=>setAttachmentOverlayOpen(true)}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>
    </button>
   </form>

   {renderAttachmentState()}

   {fieldMessage&&<p className="ir-chisti-results-page__error" role="alert">{fieldMessage}</p>}
   {renderAttachmentOverlay()}
  </section>
 }

 const searchFont='"Vazirmatn", Tahoma, Arial, sans-serif';
 const searchIconStyle={display:'block',width:'20px',height:'20px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'};
 const searchIconButtonStyle={boxSizing:'border-box',display:'grid',width:'42px',minWidth:'42px',height:'42px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:'#777982',background:'transparent',border:0,borderRadius:'12px',fontFamily:searchFont};

 return <section aria-label="هوش مصنوعی آموزشی" dir="rtl" style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,minHeight:'100%',placeItems:'center',margin:0,padding:'clamp(28px,7vh,74px) clamp(14px,4vw,38px) 48px',color:'#202024',background:'#FFFAE0',fontFamily:searchFont}}>
  <div style={{boxSizing:'border-box',display:'flex',width:'100%',maxWidth:'760px',minWidth:0,flexDirection:'column',gap:'24px',margin:'auto',padding:'clamp(24px,4vw,42px)',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'28px',boxShadow:'0 20px 55px rgba(48,39,0,.11)',fontFamily:searchFont}}>
   <header style={{display:'flex',width:'100%',alignItems:'center',justifyContent:'flex-start'}}>
    <div style={{display:'inline-flex',alignItems:'center',gap:'9px'}}>
     <span aria-hidden="true" style={{display:'grid',width:'34px',height:'34px',placeItems:'center',color:'#202024',background:'#FFD100',borderRadius:'50%'}}>
      <svg viewBox="0 0 24 24" style={searchIconStyle}><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></svg>
     </span>
     <strong style={{fontFamily:searchFont,fontSize:'14px',fontWeight:900}}>چیستی · هوش مصنوعی آموزشی</strong>
    </div>
   </header>

   <section style={{display:'flex',width:'100%',flexDirection:'column',alignItems:'center',gap:'6px',padding:'4px 0',textAlign:'center'}}>
    <h1 style={{margin:0,color:'#202024',fontFamily:searchFont,fontSize:'clamp(30px,5vw,42px)',fontWeight:900,lineHeight:1.45}}>بپرس. یاد بگیر.</h1>
    <p style={{margin:0,color:'#777982',fontFamily:searchFont,fontSize:'13px',fontWeight:600,lineHeight:1.9}}>دستیار هوش مصنوعی شما آماده پاسخگویی به سؤال‌های درسی شماست</p>
   </section>

   <form onSubmit={submit} noValidate style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'46px minmax(0,1fr) 42px 42px',alignItems:'center',gap:'4px',margin:0,padding:'5px 7px',background:'#FFFFFF',border:`1.5px solid ${fieldMessage?'#A12626':'#E7BD00'}`,borderRadius:'999px',boxShadow:'0 8px 22px rgba(92,73,0,.05)',fontFamily:searchFont}}>
    <button type="submit" aria-label="جستجو" disabled={state.chisti.status==='loading'||state.ui.offline} style={{boxSizing:'border-box',display:'grid',width:'42px',minWidth:'42px',height:'42px',placeItems:'center',margin:0,padding:0,cursor:state.chisti.status==='loading'||state.ui.offline?'not-allowed':'pointer',color:'#171719',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'50%',fontFamily:searchFont,opacity:state.chisti.status==='loading'||state.ui.offline?0.6:1}}>
     {state.chisti.status==='loading'?<span aria-hidden="true" style={{fontFamily:searchFont,fontSize:'16px',fontWeight:900}}>…</span>:<svg viewBox="0 0 24 24" aria-hidden="true" style={searchIconStyle}><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>}
    </button>

    <input value={text} onChange={event=>{setText(event.target.value);setFieldMessage('');setSubmitted(false)}} placeholder="چیزی می‌خوای یاد بگیری؟" aria-label="سؤال آموزشی" style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,height:'42px',margin:0,padding:'0 10px',direction:'rtl',color:'#202024',background:'transparent',border:0,borderRadius:'12px',outline:'none',fontFamily:searchFont,fontSize:'13px',fontWeight:600}}/>

    <button type="button" aria-label="افزودن فایل" aria-haspopup="dialog" onClick={()=>setAttachmentOverlayOpen(true)} style={searchIconButtonStyle}>
     <svg viewBox="0 0 24 24" aria-hidden="true" style={searchIconStyle}><path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>
    </button>

    <button type="button" aria-label="پرسش صوتی" onClick={startVoice} style={searchIconButtonStyle}>
     <svg viewBox="0 0 24 24" aria-hidden="true" style={searchIconStyle}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
    </button>
   </form>

   {renderAttachmentState()}

   {fieldMessage&&<p role="alert" style={{margin:'-12px 8px 0',color:'#A12626',fontFamily:searchFont,fontSize:'11px',fontWeight:700,lineHeight:1.8}}>{fieldMessage}</p>}

   <section aria-labelledby="irancell-chisti-recent-title" style={{display:'flex',width:'100%',minWidth:0,flexDirection:'column',gap:'10px'}}>
    <h2 id="irancell-chisti-recent-title" style={{margin:0,color:'#202024',fontFamily:searchFont,fontSize:'14px',fontWeight:900}}>آخرین جستجوها</h2>
    <div style={{display:'flex',width:'100%',minWidth:0,flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:'8px',overflowX:'auto',padding:'1px 0 4px'}}>
     {recentItems.map(item=><button type="button" key={item.id} onClick={()=>chooseRecent(item)} style={{boxSizing:'border-box',display:'inline-flex',minWidth:'max-content',minHeight:'38px',alignItems:'center',justifyContent:'center',gap:'8px',margin:0,padding:'8px 13px',cursor:'pointer',color:'#3F4046',background:'#F7F7F8',border:'1px solid #E2E2E6',borderRadius:'13px',fontFamily:searchFont}}>
      <strong style={{fontFamily:searchFont,fontSize:'10px',fontWeight:800}}>{item.label}</strong>
      <span aria-hidden="true" style={{display:'grid',width:'18px',height:'18px',placeItems:'center',color:'#8B8C92'}}>
       <svg viewBox="0 0 24 24" style={{...searchIconStyle,width:'17px',height:'17px'}}><path d="m15 18-6-6 6-6"/></svg>
      </span>
     </button>)}
    </div>
   </section>

   {suggestions.length>0&&<section aria-labelledby="irancell-chisti-suggestions-title" style={{display:'flex',width:'100%',minWidth:0,flexDirection:'column',gap:'10px'}}>
    <h2 id="irancell-chisti-suggestions-title" style={{margin:0,color:'#202024',fontFamily:searchFont,fontSize:'14px',fontWeight:900}}>موضوعات پیشنهادی</h2>
    <div style={{display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
     {suggestions.map(item=>{const active=activeSuggestion===item.label;return <button type="button" key={item.label} aria-pressed={active} onClick={()=>chooseSuggestion(item)} style={{boxSizing:'border-box',display:'inline-flex',minHeight:'36px',alignItems:'center',justifyContent:'center',margin:0,padding:'8px 14px',cursor:'pointer',color:'#202024',background:active?'#FFD100':'#FFFFFF',border:`1px solid ${active?'#E7BD00':'#E1E1E5'}`,borderRadius:'999px',fontFamily:searchFont,fontSize:'10px',fontWeight:active?900:700,boxShadow:active?'0 6px 14px rgba(255,209,0,.15)':'none'}}>{item.label}</button>})}
    </div>
   </section>}
  </div>

  {renderAttachmentOverlay()}
 </section>
}