export function IrancellStudentContentDetailsPage({params,onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const content=state.content.catalogueById[params.id];
 const progress=Math.max(0,Math.min(100,Number(state.content.watchProgress[params.id])||0));
 const[playing,setPlaying]=useState(false);
 const[activeTab,setActiveTab]=useState('description');
 const[showAllChapters,setShowAllChapters]=useState(false);
 const[activeChapter,setActiveChapter]=useState(0);
 const viewMode=String(params?.view||'course');
 const isFreeVideo=viewMode==='video';
 const enrollment=state.content.enrollmentsByUserId?.[state.session.currentUserId]?.[params.id]||null;
 const purchased=Boolean(enrollment)||isFreeVideo||progress>0;

 useEffect(function IrancellStudentContentSynchronizeSelection(){
  if(params.id)dispatch(IrancellContentSelect(params.id,viewMode));
 },[dispatch,params.id,viewMode]);

 if(!content)return <IrancellStatePanel state="error" title="محتوا پیدا نشد" description="ممکن است حذف یا از دسترس خارج شده باشد." action={<IrancellButton onClick={()=>onNavigate('student/binayi')}>بازگشت به بینایی</IrancellButton>}/>;

 const courseProfiles={
  'content-math-1':{
   paidTitle:'آموزش معادلات دیفرانسیل',
   freeTitle:'رفع اشکال ریاضی نهم',
   instructor:'دکتر مریم رضایی',
   freeInstructor:'آقای محمد صادقی',
   instructorRole:'استاد دانشگاه صنعتی شریف',
   freeInstructorRole:'مدرس برتر ریاضیات متوسطه',
   level:'پیشرفته',
   freeLevel:'پایه نهم',
   price:1200000,
   rating:4.2,
   freeRating:4.8,
   reviews:128,
   freeReviews:85,
   views:3340,
   date:'۱۵ خرداد ۱۴۰۳',
   freeDuration:'۴۵:۰۰',
   description:'در این دوره جامع، مفاهیم پایه تا پیشرفته معادلات دیفرانسیل به زبان ساده آموزش داده می‌شود. مناسب برای دانشجویان مهندسی و علوم پایه که به دنبال تسلط بر مباحث امتحانی و کنکور ارشد هستند.',
   freeDescription:'در این ویدیو، مسائل و نکات کلیدی ریاضی پایه نهم به صورت ساده و کاربردی توضیح داده شده است. مناسب برای آمادگی امتحان نهایی و مرور سریع مباحث فصل‌های اصلی.'
  },
  'content-physics-1':{
   paidTitle:'فیزیک پیش‌دانشگاهی - مکانیک',
   freeTitle:'نیروها و قوانین نیوتن',
   instructor:'مهندس رضا شریفی',
   freeInstructor:'مهندس رضا شریفی',
   instructorRole:'مدرس فیزیک و مکانیک',
   freeInstructorRole:'مدرس فیزیک متوسطه',
   level:'متوسط',
   freeLevel:content.grade,
   price:980000,
   rating:4.7,
   freeRating:4.8,
   reviews:96,
   freeReviews:74,
   views:2720,
   date:'۱۲ خرداد ۱۴۰۳',
   freeDuration:'۱۳:۵۰',
   description:'دوره‌ای مرحله‌به‌مرحله برای درک مکانیک، نیرو، حرکت و حل مسائل استاندارد فیزیک. مفاهیم با مثال‌های کاربردی و تمرین‌های هدفمند آموزش داده می‌شوند.',
   freeDescription:'در این ویدیو مفهوم نیرو، قانون دوم نیوتن و روش تحلیل مسئله‌های حرکت به زبان ساده مرور می‌شود.'
  },
  'content-english-1':{
   paidTitle:'زبان انگلیسی کاربردی',
   freeTitle:'گرامر در ۱۰ دقیقه',
   instructor:'استاد سارا احمدی',
   freeInstructor:'استاد سارا احمدی',
   instructorRole:'مدرس زبان انگلیسی',
   freeInstructorRole:'مدرس زبان انگلیسی',
   level:'مقدماتی',
   freeLevel:content.grade,
   price:760000,
   rating:4.6,
   freeRating:4.7,
   reviews:72,
   freeReviews:61,
   views:1980,
   date:'۱۰ خرداد ۱۴۰۳',
   freeDuration:'۱۰:۴۰',
   description:'مسیر آموزشی ساختاریافته برای تقویت گرامر و مهارت استفاده از زبان انگلیسی در موقعیت‌های واقعی، همراه با مثال و تمرین.',
   freeDescription:'در این ویدیو ساختار اصلی مبحث گرامر با مثال‌های کوتاه و قابل فهم مرور می‌شود.'
  }
 };

 const meta=courseProfiles[content.id]||{
  paidTitle:content.title,
  freeTitle:content.title,
  instructor:content.provider||'مدرس ایرانسل',
  freeInstructor:content.provider||'مدرس ایرانسل',
  instructorRole:'مدرس تاییدشده ایرانسل',
  freeInstructorRole:'مدرس تاییدشده ایرانسل',
  level:content.level||'متوسط',
  freeLevel:content.grade||'پایه تحصیلی',
  price:890000,
  rating:Number(content.rating)||4.6,
  freeRating:Number(content.rating)||4.6,
  reviews:64,
  freeReviews:58,
  views:Number(content.views)||1200,
  date:'۱۵ خرداد ۱۴۰۳',
  freeDuration:`${IrancellFormatPersianNumber(Math.max(1,Math.floor((Number(content.duration)||600)/60)))}:${String((Number(content.duration)||600)%60).padStart(2,'0').replace(/\d/g,digit=>'۰۱۲۳۴۵۶۷۸۹'[Number(digit)])}`,
  description:content.description,
  freeDescription:content.description
 };

 const chapters=[
  {id:1,title:'مقدمه و مفاهیم پایه',subtitle:'فصل ۱ · ۳ جلسه',free:true},
  {id:2,title:'معادلات مرتبه اول',subtitle:'فصل ۲ · ۵ جلسه'},
  {id:3,title:'معادلات مرتبه دوم',subtitle:'فصل ۳ · ۴ جلسه'},
  {id:4,title:'تبدیل لاپلاس',subtitle:'فصل ۴ · ۴ جلسه'},
  {id:5,title:'دستگاه معادلات دیفرانسیل',subtitle:'فصل ۵ · ۴ جلسه'},
  {id:6,title:'حل نمونه سؤال و جمع‌بندی',subtitle:'فصل ۶ · ۴ جلسه'}
 ];

 const visibleChapters=showAllChapters?chapters:chapters.slice(0,3);
 const relatedItems=Object.values(state.content.catalogueById||{}).filter(item=>item&&item.status==='published'&&item.id!==content.id).slice(0,3);
 const currentRating=Number(content.rating)||(isFreeVideo?meta.freeRating:meta.rating);
 const currentReviews=isFreeVideo?meta.freeReviews:meta.reviews;
 const currentTitle=content.title;
 const currentInstructor=content.instructor||content.provider||(isFreeVideo?meta.freeInstructor:meta.instructor);
 const currentInstructorRole=content.provider?`ارائه‌شده توسط ${content.provider}`:(isFreeVideo?meta.freeInstructorRole:meta.instructorRole);
 const currentPrice=Math.max(0,Number(content.price)||0);

 function togglePlayback(){
  const nextPlaying=!playing;
  setPlaying(nextPlaying);
  if(nextPlaying)dispatch(IrancellContentRecordProgress(content.id,Math.max(progress,15)))
 }

 function selectChapter(index){
  setActiveChapter(index);
  setPlaying(true);
  const nextProgress=Math.max(progress,Math.round(((index+1)/chapters.length)*100));
  dispatch(IrancellContentRecordProgress(content.id,nextProgress))
 }

 function handlePrimaryAction(){
  if(!purchased)dispatch(IrancellContentEnroll(content.id,{view:viewMode,deliveryType:content.deliveryType||'video'}));
  setPlaying(true);
  dispatch(IrancellContentRecordProgress(content.id,Math.max(progress,isFreeVideo?15:purchased?15:1)))
 }

 function renderClassroomHero(){
  return <svg viewBox="0 0 402 225" aria-hidden="true">
   <defs>
    <linearGradient id="ir-course-wall" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b9aea3"/><stop offset="1" stopColor="#756b63"/></linearGradient>
    <linearGradient id="ir-course-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b99878"/><stop offset="1" stopColor="#735b48"/></linearGradient>
   </defs>
   <rect width="402" height="225" fill="#d5d0ca"/>
   <rect y="0" width="402" height="34" fill="#aaa7a2"/>
   <path d="M0 34h402v134H0z" fill="url(#ir-course-wall)"/>
   <rect x="44" y="48" width="313" height="111" rx="2" fill="#5d5851"/>
   <rect x="57" y="60" width="287" height="88" fill="#bbb0a0"/>
   <path d="M68 78h52M69 91h79M66 107h45M181 77h62M183 91h91M186 107h58M269 77h57M274 93h38M272 112h53" stroke="#776d63" strokeWidth="2" opacity=".8"/>
   <path d="M78 124c18-48 38 25 61-15 22-39 35 25 61-13 19-28 39 17 63-19" fill="none" stroke="#5f5a54" strokeWidth="2"/>
   <rect x="80" y="168" width="244" height="17" rx="3" fill="#73543c"/>
   <rect x="98" y="184" width="8" height="41" fill="#4d382b"/>
   <rect x="295" y="184" width="8" height="41" fill="#4d382b"/>
   <rect x="30" y="183" width="64" height="8" rx="4" fill="#8d6c50"/>
   <rect x="42" y="190" width="8" height="35" fill="#574234"/>
   <rect x="348" y="184" width="44" height="8" rx="4" fill="#8d6c50"/>
   <rect x="374" y="191" width="7" height="34" fill="#574234"/>
   <rect y="201" width="402" height="24" fill="url(#ir-course-floor)"/>
  </svg>
 }

 if(isFreeVideo)return <section className="ir-course-detail is-free">
  <header className="ir-course-detail__topbar">
   <button type="button" className="ir-course-detail__back" aria-label="بازگشت" onClick={()=>onNavigate?.('student/binayi')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>مشاهده ویدیو</h1>
   <span/>
  </header>

  <button type="button" className={`ir-course-detail__hero ${playing?'is-playing':''}`} onClick={togglePlayback} aria-label={playing?'توقف پخش':'شروع پخش'}>
   {renderClassroomHero()}
   <span className="ir-course-detail__hero-play">
    {playing?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h3v12H8ZM14 6h3v12h-3Z"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z"/></svg>}
   </span>
   <span className="ir-course-detail__free-badge">رایگان</span>
   <span className="ir-course-detail__time-badge">{meta.freeDuration}</span>
   {playing&&<span className="ir-course-detail__player-status">در حال پخش</span>}
   <i className="ir-course-detail__hero-progress"><b style={{width:`${Math.max(progress,playing?15:progress)}%`}}/></i>
  </button>

  <main className="ir-course-detail__body">
   <div className="ir-course-detail__tags">
    <span className="is-primary">{content.subject}</span>
    <span>{meta.freeLevel}</span>
   </div>

   <h2 className="ir-course-detail__title">{meta.freeTitle}</h2>

   <section className="ir-course-detail__instructor">
    <span className="ir-course-detail__avatar">{currentInstructor.split(' ').filter(Boolean).slice(-2).map(part=>part[0]).join('')}</span>
    <div>
     <strong>{currentInstructor}</strong>
     <small>{currentInstructorRole}</small>
    </div>
   </section>

   <section className="ir-course-detail__free-meta">
    <div className="ir-course-detail__rating">
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9Z"/></svg>
     <strong>{currentRating}</strong>
     <span>({IrancellFormatPersianNumber(currentReviews)} نظر)</span>
    </div>
    <span>{IrancellFormatPersianNumber(meta.views)} بازدید</span>
    <span>{meta.date}</span>
   </section>

   <div className="ir-course-detail__divider"/>

   <section className="ir-course-detail__about">
    <h3>درباره این ویدیو</h3>
    <p>{meta.freeDescription}</p>
   </section>

   <section className="ir-course-detail__related">
    <h3>ویدیوهای مرتبط</h3>
    <div>
     {relatedItems.length?relatedItems.map((item,index)=><button type="button" key={item.id} onClick={()=>onNavigate?.(`student/binayi/course/${item.id}?view=video`)}>
      <span className={`ir-course-detail__related-thumb is-${index+1}`} aria-hidden="true">
       <svg viewBox="0 0 90 58">
        <rect width="90" height="58" rx="7" fill={index===1?'#78a7ae':index===2?'#816f58':'#a88c70'}/>
        <rect x="7" y="7" width="76" height="44" rx="3" fill={index===1?'#b9d0d0':index===2?'#4a443c':'#ddd4c5'}/>
        <path d="M13 17h50M13 25h34M13 33h58M13 41h42" stroke={index===2?'#ddd1bc':'#75837f'} strokeWidth="2"/>
       </svg>
      </span>
      <span className="ir-course-detail__related-copy">
       <strong>{index===0?'ریاضی نهم - فصل ۳':index===1?'هندسه پایه نهم':'آمار و احتمال نهم'}</strong>
       <small>{index===1?'خانم احمدی':'آقای محمد صادقی'}</small>
      </span>
      <small className="ir-course-detail__related-duration">{index===0?'۱۵:۲۰':index===1?'۱۸:۳۰':'۱۱:۱۵'}</small>
     </button>):<button type="button" onClick={()=>onNavigate?.('student/binayi')}>
      <span className="ir-course-detail__related-copy"><strong>ویدیوهای بیشتری ببین</strong><small>بازگشت به بینایی</small></span>
     </button>}
    </div>
   </section>
  </main>

  <footer className="ir-course-detail__purchase is-free">
   <button type="button" onClick={handlePrimaryAction}>{playing?'در حال مشاهده':'شروع دوره'}</button>
   <p>این ویدیو برای همه کاربران <strong>رایگان</strong> است</p>
  </footer>
 </section>;

 return <section className="ir-course-detail is-paid">
  <header className="ir-course-detail__topbar">
   <button type="button" className="ir-course-detail__back" aria-label="بازگشت" onClick={()=>onNavigate?.('student/binayi')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <h1>جزئیات دوره</h1>
   <span/>
  </header>

  <button type="button" className={`ir-course-detail__hero ${playing?'is-playing':''}`} onClick={togglePlayback} aria-label={playing?'توقف پخش':'مشاهده پیش‌نمایش دوره'}>
   {renderClassroomHero()}
   <span className="ir-course-detail__hero-play">
    {playing?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h3v12H8ZM14 6h3v12h-3Z"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z"/></svg>}
   </span>
   {playing&&<span className="ir-course-detail__player-status">پیش‌نمایش دوره</span>}
   <i className="ir-course-detail__hero-progress"><b style={{width:`${Math.max(progress,playing?15:progress)}%`}}/></i>
  </button>

  <main className="ir-course-detail__body">
   <div className="ir-course-detail__tags">
    <span className="is-primary">{content.subject}</span>
    <span>{meta.level}</span>
   </div>

   <h2 className="ir-course-detail__title">{meta.paidTitle}</h2>

   <section className="ir-course-detail__paid-summary">
    <div className="ir-course-detail__instructor">
     <span className="ir-course-detail__avatar">{currentInstructor.split(' ').filter(Boolean).slice(-2).map(part=>part[0]).join('')}</span>
     <div>
      <strong>{currentInstructor}</strong>
      <small>{currentInstructorRole}</small>
     </div>
    </div>

    <div className="ir-course-detail__rating">
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9Z"/></svg>
     <strong>{currentRating}</strong>
     <span>({IrancellFormatPersianNumber(currentReviews)} نظر)</span>
    </div>
   </section>

   <strong className="ir-course-detail__price">{currentPrice>0?IrancellFormatCurrency(currentPrice):'رایگان'}</strong>

   <nav className="ir-course-detail__tabs" aria-label="بخش‌های جزئیات دوره">
    <button type="button" className={activeTab==='description'?'is-active':''} onClick={()=>setActiveTab('description')}>توضیحات</button>
    <button type="button" className={activeTab==='chapters'?'is-active':''} onClick={()=>setActiveTab('chapters')}>سرفصل‌ها</button>
    <button type="button" className={activeTab==='reviews'?'is-active':''} onClick={()=>setActiveTab('reviews')}>نظرات</button>
   </nav>

   {activeTab==='description'&&<>
    <section className="ir-course-detail__about">
     <h3>درباره این دوره</h3>
     <p>{meta.description}</p>
    </section>

    <section className="ir-course-detail__facts">
     <div>
      <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h12v18H6Z"/><path d="m10 9 5 3-5 3Z"/></svg></span>
      <strong>۲۴ جلسه</strong>
     </div>
     <div>
      <span aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg></span>
      <strong>۱۲ ساعت</strong>
     </div>
     <div>
      <span aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="5"/><path d="m9 15-1 6 4-2 4 2-1-6"/></svg></span>
      <strong>گواهینامه</strong>
     </div>
    </section>
   </>}

   {(activeTab==='description'||activeTab==='chapters')&&<section className="ir-course-detail__curriculum">
    <header>
     <h3>سرفصل‌های دوره</h3>
     <button type="button" onClick={()=>setShowAllChapters(value=>!value)}>{showAllChapters?'نمایش کمتر':'مشاهده همه'}</button>
    </header>
    <div>
     {visibleChapters.map((chapter,index)=><button type="button" key={chapter.id} className={activeChapter===index?'is-active':''} onClick={()=>selectChapter(index)}>
      <span className="ir-course-detail__chapter-number">{IrancellFormatPersianNumber(chapter.id)}</span>
      <span className="ir-course-detail__chapter-copy">
       <strong>{chapter.title}</strong>
       <small>{chapter.subtitle}</small>
      </span>
      {chapter.free?<em>رایگان</em>:<svg className="ir-course-detail__chapter-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>}
     </button>)}
    </div>
   </section>}

   {activeTab==='reviews'&&<section className="ir-course-detail__reviews">
    <div className="ir-course-detail__review-score">
     <strong>{currentRating}</strong>
     <span className="ir-course-detail__stars">★★★★★</span>
     <small>{IrancellFormatPersianNumber(currentReviews)} نظر ثبت شده</small>
    </div>
    <article>
     <span className="ir-course-detail__avatar">ع م</span>
     <div>
      <strong>علی محمدی</strong>
      <span>★★★★★</span>
      <p>توضیحات مدرس مرحله‌به‌مرحله و قابل فهم است و مثال‌ها برای مرور مباحث خیلی کمک می‌کنند.</p>
     </div>
    </article>
    <article>
     <span className="ir-course-detail__avatar">س ر</span>
     <div>
      <strong>سارا رضایی</strong>
      <span>★★★★★</span>
      <p>ساختار دوره منظم است و سرفصل‌ها برای یادگیری از پایه تا حل مسئله کافی هستند.</p>
     </div>
    </article>
   </section>}
  </main>

  <footer className="ir-course-detail__purchase">
   <button type="button" onClick={handlePrimaryAction}>{purchased?(progress>15?'ادامه دوره':'شروع دوره'):currentPrice>0?'افزودن به دوره‌های من':'شروع رایگان'}</button>
  </footer>
 </section>
}