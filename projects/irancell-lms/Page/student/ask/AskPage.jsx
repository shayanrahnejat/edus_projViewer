export function IrancellStudentAskPage({params,onNavigate,onBack}){
 const{state,dispatch}=useIrancellStore();
 const[text,setText]=useState('');
 const[subject,setSubject]=useState('ریاضی');
 const[activeSuggestion,setActiveSuggestion]=useState('حل معادله درجه دوم');
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
  {label:'حل معادله درجه دوم',subject:'ریاضی',prompt:'معادله درجه دوم x²−5x+6=0 را مرحله‌به‌مرحله حل کن و در پایان جواب‌ها را بررسی کن.'},
  {label:'قانون دوم نیوتن',subject:'فیزیک',prompt:'قانون دوم نیوتن را خیلی ساده توضیح بده و یک مثال عددی از نیرو، جرم و شتاب حل کن.'},
  {label:'Present Perfect',subject:'زبان انگلیسی',prompt:'Present Perfect را با ساختار جمله، کاربرد و سه مثال ساده انگلیسی توضیح بده.'},
  {label:'مرور قبل امتحان',subject:'شیمی',prompt:'برای مرور سریع فصل واکنش‌های شیمیایی قبل از امتحان یک مسیر ۲۰ دقیقه‌ای پیشنهاد بده.'},
  {label:'ویدیوی مناسب',subject:'ریاضی',prompt:'برای یادگیری تابع درجه دوم یک ویدیوی آموزشی کوتاه پیشنهاد بده و بگو بعدش چه تمرینی انجام بدهم.'}
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
  const overlay=<div className="ir-chisti-attachment-overlay" role="presentation" onMouseDown={()=>setAttachmentOverlayOpen(false)}>
   <section className="ir-chisti-attachment-sheet" role="dialog" aria-modal="true" aria-label="افزودن پیوست" onMouseDown={event=>event.stopPropagation()}>
    <span className="ir-chisti-attachment-sheet__handle" aria-hidden="true"/>

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>openAttachmentSource(attachmentCameraInputRef)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>
     </span>
     <span>گرفتن عکس</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>openAttachmentSource(attachmentGalleryInputRef)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m5 18 5-5 3 3 2-2 4 4"/></svg>
     </span>
     <span>انتخاب از گالری</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>openAttachmentSource(attachmentFileInputRef)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5"/></svg>
     </span>
     <span>انتخاب فایل</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option is-cancel" onClick={()=>setAttachmentOverlayOpen(false)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m9 9 6 6M15 9l-6 6"/></svg>
     </span>
     <span>انصراف</span>
    </button>

    <input ref={attachmentCameraInputRef} className="ir-chisti-attachment-sheet__native-input" type="file" accept="image/*" capture="environment" onChange={handleAttachmentSelected}/>
    <input ref={attachmentGalleryInputRef} className="ir-chisti-attachment-sheet__native-input" type="file" accept="image/*" onChange={handleAttachmentSelected}/>
    <input ref={attachmentFileInputRef} className="ir-chisti-attachment-sheet__native-input" type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" onChange={handleAttachmentSelected}/>
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

 return <section className="ir-chisti-search-page" aria-label="هوش مصنوعی آموزشی">
  <header className="ir-chisti-search-page__brand">
   <span aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></svg>
   </span>
   <strong>هوش مصنوعی آموزشی</strong>
  </header>

  <section className="ir-chisti-search-page__hero">
   <div className="ir-chisti-search-page__hero-kicker">
    <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 14 9l6 3-6 3-2 6-2-6-6-3 6-3Z"/></svg></span>
    <strong>چیستی، هم‌مسیر یادگیری تو</strong>
   </div>
   <h1>بپرس، <mark>یاد بگیر.</mark></h1>
   <p>سؤالت را هرطور راحتی بپرس؛ چیستی موضوع را می‌فهمد، جواب می‌دهد و قدم بعدی یادگیری را می‌سازد.</p>
   <div className="ir-chisti-search-page__hero-meta">
    <span>پاسخ شخصی‌سازی‌شده</span>
    <span>منابع آموزشی</span>
    <span>مسیر یادگیری</span>
   </div>
  </section>

  <form className={`ir-chisti-search-page__composer ${fieldMessage?'has-error':''}`} onSubmit={submit} noValidate>
   <button type="submit" className="ir-chisti-search-page__submit" aria-label="جستجو" disabled={state.chisti.status==='loading'||state.ui.offline}>
    {state.chisti.status==='loading'?<span className="ir-chisti-search-page__spinner"/>:<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>}
   </button>

   <input value={text} onChange={event=>{setText(event.target.value);setFieldMessage('');setSubmitted(false)}} placeholder="چیزی می‌خوای یاد بگیری؟" aria-label="سؤال آموزشی"/>

   <button type="button" className="ir-chisti-search-page__attachment" aria-label="افزودن فایل" aria-haspopup="dialog" onClick={()=>setAttachmentOverlayOpen(true)}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>
   </button>

   <button type="button" className="ir-chisti-search-page__voice" aria-label="پرسش صوتی" onClick={startVoice}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
   </button>
  </form>

  {renderAttachmentState()}

  {fieldMessage&&<p className="ir-chisti-search-page__message" role="alert">{fieldMessage}</p>}

  <section className="ir-chisti-search-page__recent" aria-labelledby="irancell-chisti-recent-title">
   <h2 id="irancell-chisti-recent-title">آخرین جستجوها</h2>
   <div>
    {recentItems.map(item=><button type="button" key={item.id} onClick={()=>chooseRecent(item)}>
     <span className="ir-chisti-search-page__recent-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>
     </span>
     <span className="ir-chisti-search-page__recent-copy">
      <strong>{item.label}</strong>
      <small>{item.subject||'پرسش آموزشی'}</small>
     </span>
     <span className="ir-chisti-search-page__recent-go" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
     </span>
    </button>)}
   </div>
  </section>

  {suggestions.length>0&&<section className="ir-chisti-search-page__suggestions" aria-labelledby="irancell-chisti-suggestions-title">
   <h2 id="irancell-chisti-suggestions-title">نمونه‌های آماده برای امتحان چیستی</h2>
   <div>
    {suggestions.map(item=><button type="button" key={item.label} className={activeSuggestion===item.label?'is-active':''} onClick={()=>chooseSuggestion(item)}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 14 9l6 3-6 3-2 6-2-6-6-3 6-3Z"/></svg>
     <span>{item.label}</span>
    </button>)}
   </div>
  </section>}

  {renderAttachmentOverlay()}
 </section>
}