export function IrancellStudentHomePage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const[homeQuestion,setHomeQuestion]=useState('');
 const[homeQuestionError,setHomeQuestionError]=useState('');
 const[homeQuestionSubmitted,setHomeQuestionSubmitted]=useState(false);
 const[homeAttachment,setHomeAttachment]=useState(null);
 const[homeAttachmentStatus,setHomeAttachmentStatus]=useState('empty');
 const[homeAttachmentPickerSignal,setHomeAttachmentPickerSignal]=useState(0);
 const studentId=state.session.currentUserId;
 const student=state.identity.usersById[studentId]||{name:'دانش‌آموز',grade:'پایه تحصیلی ثبت نشده'};
 const studentHasAvatarOverride=Object.prototype.hasOwnProperty.call(student,'avatarDataUrl');
 const studentAvatar=studentHasAvatarOverride?student.avatarDataUrl:IRANCELL_PAGE_STUDENT_HOME_AVATAR;
 const firstName=String(student.name||'دانش‌آموز').trim().split(/\s+/)[0]||'دانش‌آموز';
 const unreadCount=Math.max(0,Number(state.notifications.unreadCount)||0);
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===studentId&&!['completed','cancelled'].includes(item.status)).sort((first,second)=>new Date(first.startAt)-new Date(second.startAt));
 const nextClass=classes[0]||null;
 const progressEntries=Object.entries(state.content.watchProgress||{}).map(([contentId,value])=>({contentId,progress:Math.max(0,Math.min(100,Number(value)||0)),content:state.content.catalogueById[contentId]})).filter(item=>item.content);
 const inProgressEntries=progressEntries.filter(item=>item.progress>0&&item.progress<100);
 const currentLearning=inProgressEntries[0]||null;
 const recommendationIds=Array.isArray(state.content.recommendations)?state.content.recommendations:[];
 const recommendationItems=recommendationIds.map(id=>state.content.catalogueById[id]).filter(Boolean).filter(item=>item.id!==currentLearning?.contentId);
 const recommendedContent=recommendationItems[recommendationItems.length-1]||recommendationItems[0]||Object.values(state.content.catalogueById||{}).find(item=>item.status==='published')||null;
 const progressValues=progressEntries.map(item=>item.progress);
 const weeklyProgress=Math.max(0,Math.min(100,Math.round(progressValues.reduce((sum,value)=>sum+value,0)/Math.max(progressValues.length,1))));
 const continueItems=inProgressEntries.length?inProgressEntries.slice(0,3):recommendedContent?[{contentId:recommendedContent.id,progress:0,content:recommendedContent}]:[];
 const latestChistiRecommendation=state.chisti.lastCompletedProblemId?state.chisti.recommendationsByProblemId?.[state.chisti.lastCompletedProblemId]||null:null;
 function openLearning(item){if(item?.contentId)onNavigate?.(`student/binayi/course/${item.contentId}`);else onNavigate?.('student/binayi')}
 function formatSessionTime(item){if(!item?.startAt)return'زمان کلاس';const value=new Date(item.startAt);if(Number.isNaN(value.getTime()))return'زمان کلاس';return value.toLocaleString('fa-IR',{weekday:'long',hour:'2-digit',minute:'2-digit'})}
 function classStatus(item){if(item?.status==='live')return'در حال برگزاری';if(item?.status==='scheduled')return'رزرو شده';if(item?.status==='pending')return'در انتظار';return'کلاس فعال'}
 function submitHomeQuestion(event){
  event.preventDefault();
  const question=String(homeQuestion||'').trim();
  if(state.ui.offline){setHomeQuestionError('برای ارسال سؤال، اتصال اینترنت را بررسی کنید.');return}
  if(state.chisti.status==='processing'){setHomeQuestionError('پاسخ سؤال قبلی هنوز در حال آماده‌سازی است.');return}
  if(!question){setHomeQuestionError('سؤالت را بنویس تا چیستی آن را بررسی کند.');return}
  if(homeAttachmentStatus==='uploading'){setHomeQuestionError('لطفاً تا پایان بارگذاری فایل صبر کنید.');return}
  if(homeAttachmentStatus==='failed'){setHomeQuestionError('بارگذاری فایل ناموفق بود. فایل را دوباره انتخاب کنید.');return}
  const problemId=`home-problem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  setHomeQuestionError('');
  setHomeQuestionSubmitted(true);
  dispatch(IrancellChistiSubmitProblem({
   problemId,
   text:question,
   grade:student.grade||'دهم',
   topic:'تشخیص خودکار',
   attachmentName:homeAttachment?.name||'',
   attachmentType:homeAttachment?.type||'',
   attachmentSize:Number(homeAttachment?.size)||0
  }));
  IrancellChistiRunProcessing(dispatch,problemId)
 }
 return <section className="ir-exact-student-dashboard" aria-label="داشبورد دانش‌آموز">
  <header className="ir-exact-student-dashboard__header">
   <button type="button" className="ir-exact-student-dashboard__notifications" aria-label={unreadCount?`${IrancellFormatPersianNumber(unreadCount)} اعلان خوانده‌نشده`:'اعلان‌ها'} onClick={()=>onNavigate?.('student/notifications')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
    {unreadCount>0&&<i/>}
   </button>
   <div className="ir-exact-student-dashboard__greeting">
    <h1>سلام {firstName} جان، آماده‌ای یادگیری امروز رو شروع کنیم؟</h1>
    <span>{student.grade||'پایه تحصیلی ثبت نشده'} / {student.name||'دانش‌آموز'}</span>
   </div>
  </header>

  <main className="ir-exact-student-dashboard__body">
   {state.ui.offline&&<aside className="ir-exact-student-dashboard__offline" role="status">
    <span>اتصال اینترنت برقرار نیست؛ آخرین اطلاعات ذخیره‌شده نمایش داده می‌شود.</span>
   </aside>}

   <article className="ir-exact-student-dashboard__welcome ir-exact-student-dashboard__progress-card">
    <div className="ir-exact-student-dashboard__progress-card-copy">
     <div className="ir-exact-student-dashboard__progress-label">
      <strong>میزان پیشرفت تحصیلی این هفته شما</strong>
      <span>{IrancellFormatPersianNumber(weeklyProgress)}٪</span>
     </div>
     <div className="ir-exact-student-dashboard__progress" role="progressbar" aria-label="پیشرفت تحصیلی این هفته" aria-valuemin="0" aria-valuemax="100" aria-valuenow={weeklyProgress}>
      <span style={{width:`${weeklyProgress}%`}}/>
     </div>
     <p>امروز {IrancellFormatPersianNumber(classes.length)} کلاس آنلاین، {IrancellFormatPersianNumber(inProgressEntries.length)} تمرین در حال یادگیری و {IrancellFormatPersianNumber(recommendationIds.length)} پیشنهاد آموزشی در انتظار شماست.</p>
    </div>
    <footer>
     <button type="button" className="is-continue" onClick={()=>currentLearning?openLearning(currentLearning):onNavigate?.('student/binayi')}>ادامه یادگیری</button>
     <button type="button" className="is-plan" onClick={()=>onNavigate?.('student/classes')}><span>مشاهده برنامه امروز</span><b aria-hidden="true">‹</b></button>
    </footer>
   </article>

   <section className="ir-exact-student-dashboard__insights" aria-label="خلاصه فعالیت و دستیار هوشمند">
    <article className="ir-exact-student-dashboard__chisty">
     <span className="ir-exact-student-dashboard__chisty-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></svg>
     </span>
     <div className="ir-exact-student-dashboard__chisty-copy">
      <h2>از چیستی بپرس</h2>
      <p>سؤال درسی‌ات را بپرس تا فوراً راهنمایی شوی.</p>
     </div>
     <form className="ir-exact-student-dashboard__chisty-search" onSubmit={submitHomeQuestion} noValidate>
      <button type="submit" className="is-send" aria-label="ارسال سؤال" disabled={state.ui.offline||state.chisti.status==='processing'||!homeQuestion.trim()}>
       <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
      </button>
      <button type="button" className="is-folder" aria-label="افزودن فایل" aria-haspopup="dialog" onClick={()=>setHomeAttachmentPickerSignal(signal=>signal+1)}>
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h7l2-2h9v14H3Z"/></svg>
      </button>
      <button type="button" className="is-mic" aria-label="پرسش صوتی" onClick={()=>onNavigate?.('student/chisti?voice=1')}>
       <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
      </button>
      <input type="text" value={homeQuestion} onChange={event=>{setHomeQuestion(event.target.value);if(homeQuestionError)setHomeQuestionError('')}} placeholder="مثلاً: معادله درجه دوم را چطور حل کنم؟" aria-label="سؤال از چیستی"/>
     </form>
     <IrancellSimpleFileUploader
      label=""
      hint=""
      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
      maxSizeMb={15}
      hideTrigger
      openSignal={homeAttachmentPickerSignal}
      onChange={setHomeAttachment}
      onStatusChange={setHomeAttachmentStatus}
     />
     {homeQuestionError&&<p className="ir-exact-student-dashboard__chisty-error" role="alert">{homeQuestionError}</p>}
     {homeQuestionSubmitted&&state.chisti.status==='ready'&&latestChistiRecommendation&&<section className="ir-exact-student-dashboard__chisty-answer" aria-live="polite">
      <span>پاسخ چیستی</span>
      <p>{latestChistiRecommendation.answer}</p>
      <footer>
       {latestChistiRecommendation.contentIds?.[0]&&<button type="button" onClick={()=>onNavigate?.(`student/binayi/course/${latestChistiRecommendation.contentIds[0]}`)}>ویدیوی مرتبط</button>}
       <button type="button" onClick={()=>onNavigate?.('student/classes/request/new')}>درخواست مدرس</button>
       <button type="button" onClick={()=>onNavigate?.('student/chisti')}>ادامه گفت‌وگو</button>
      </footer>
     </section>}
    </article>

    <article className="ir-exact-student-dashboard__weekly-summary">
     <header>
      <h2>دستاوردهای این هفته شما</h2>
      <button type="button" aria-label="مشاهده همه دستاوردها" onClick={()=>onNavigate?.('student/achievements')}>
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/></svg>
      </button>
     </header>
     <div>
      <button type="button" onClick={()=>onNavigate?.('student/points')}>
       <span className="is-progress" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m13 2-8 11h6l-1 9 9-12h-6Z"/></svg>
       </span>
       <strong>{IrancellFormatPersianNumber(weeklyProgress)}٪</strong>
       <small>پیشرفت هفتگی</small>
      </button>
      <button type="button" onClick={()=>onNavigate?.('student/chisti')}>
       <span className="is-question" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.8 1.95c-.95.65-1.6 1.08-1.6 2.05M12 17h.01"/></svg>
       </span>
       <strong>{IrancellFormatPersianNumber(Object.keys(state.chisti.recommendationsByProblemId||{}).length)}</strong>
       <small>پرسش حل‌شده</small>
      </button>
      <button type="button" onClick={()=>onNavigate?.('student/classes')}>
       <span className="is-class" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>
       </span>
       <strong>{IrancellFormatPersianNumber(classes.length)}</strong>
       <small>کلاس فعال</small>
      </button>
     </div>
    </article>
   </section>

   <section className="ir-exact-student-dashboard__today" aria-labelledby="irancell-student-today-title">
    <div className="ir-exact-student-dashboard__section-heading">
     <h2 id="irancell-student-today-title">برنامه امروز</h2>
     <button type="button" onClick={()=>onNavigate?.('student/classes')}><span>مشاهده همه</span><b aria-hidden="true">←</b></button>
    </div>

    <div className="ir-exact-student-dashboard__schedule">
     {nextClass?<button type="button" onClick={()=>onNavigate?.(`class/${nextClass.id}`)}>
      <span className="is-video" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-2v8l-4-2Z"/></svg></span>
      <div><strong>{nextClass.title}</strong><small>{formatSessionTime(nextClass)}</small></div>
      <em className={nextClass.status==='live'?'is-live':'is-reserved'}>{classStatus(nextClass)}</em>
     </button>:<button type="button" onClick={()=>onNavigate?.('student/requests')}>
      <span className="is-video" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>
      <div><strong>کلاس جدید رزرو کن</strong><small>مدرس مناسب را براساس درس و زمان پیدا کن.</small></div>
      <em className="is-reserved">شروع</em>
     </button>}

     {currentLearning?<button type="button" onClick={()=>openLearning(currentLearning)}>
      <span className="is-task" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m9 15 6-6M12 8h4v4"/></svg></span>
      <div><strong>تمرین {currentLearning.content.subject||'امروز'}</strong><small className="is-urgent">ادامه از {IrancellFormatPersianNumber(currentLearning.progress)}٪</small></div>
      <em className="is-action">نیاز به انجام</em>
     </button>:<button type="button" onClick={()=>onNavigate?.('student/binayi')}>
      <span className="is-task" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m9 15 6-6M12 8h4v4"/></svg></span>
      <div><strong>تمرین پیشنهادی امروز</strong><small className="is-urgent">یک تمرین متناسب با مسیرت انتخاب کن.</small></div>
      <em className="is-action">مشاهده</em>
     </button>}

     {recommendedContent?<button type="button" onClick={()=>openLearning({contentId:recommendedContent.id,content:recommendedContent,progress:0})}>
      <span className="is-free" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></span>
      <div><strong>ویدیوی پیشنهادی {recommendedContent.subject||''}</strong><small>{recommendedContent.duration?`${IrancellFormatPersianNumber(Math.max(1,Math.round(recommendedContent.duration/60)))} دقیقه`:'محتوای پیشنهادی'}</small></div>
      <em className="is-free-badge">رایگان</em>
     </button>:<button type="button" onClick={()=>onNavigate?.('student/binayi')}>
      <span className="is-free" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></span>
      <div><strong>ویدیوهای پیشنهادی</strong><small>محتوای مناسب مسیر یادگیریت را ببین.</small></div>
      <em className="is-free-badge">مشاهده</em>
     </button>}
    </div>
   </section>

   <section className="ir-exact-student-dashboard__continue-section" aria-labelledby="irancell-student-continue-title">
    <div className="ir-exact-student-dashboard__section-heading">
     <h2 id="irancell-student-continue-title">ادامه یادگیری</h2>
     <button type="button" onClick={()=>onNavigate?.('student/binayi')}><span>مشاهده همه</span><b aria-hidden="true">←</b></button>
    </div>
    <div className="ir-exact-student-dashboard__continue-list">
     {continueItems.map(item=><button type="button" key={item.contentId} onClick={()=>openLearning(item)}>
      <span className="ir-exact-student-dashboard__continue-cover" aria-hidden="true">
       <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg>
      </span>
      <div>
       <strong>{item.content.title}</strong>
       <small>{item.content.subject||'محتوای آموزشی'}{item.progress>0?` · ${IrancellFormatPersianNumber(item.progress)}٪ تکمیل شده`:''}</small>
       <span className="ir-exact-student-dashboard__continue-progress"><i style={{width:`${item.progress}%`}}/></span>
      </div>
     </button>)}
     {!continueItems.length&&<button type="button" className="is-empty" onClick={()=>onNavigate?.('student/binayi')}>
      <span className="ir-exact-student-dashboard__continue-cover" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4ZM8 9h8M8 13h5"/></svg></span>
      <div><strong>مسیر یادگیریت را شروع کن</strong><small>از بینایی یک دوره مناسب انتخاب کن.</small></div>
     </button>}
    </div>
   </section>
  </main>
 </section>
}