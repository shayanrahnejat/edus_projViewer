export function IrancellStudentLearningPage({onNavigate,screen}){
 const{state,dispatch}=useIrancellStore();
 const route=screen?.route||'student/binayi';
 const[search,setSearch]=useState('');
 const[activeCategory,setActiveCategory]=useState('all');
 const[showAllCourses,setShowAllCourses]=useState(false);
 const[showAllVideos,setShowAllVideos]=useState(false);
 const[myCourseFilter,setMyCourseFilter]=useState(route==='student/binayi/completed'?'completed':'all');
 const[courseFilterOpen,setCourseFilterOpen]=useState(false);
 const[courseTypeFilter,setCourseTypeFilter]=useState('all');
 const[courseStatusFilter,setCourseStatusFilter]=useState(route==='student/binayi/completed'?'completed':'all');

 const categories=[
  {id:'all',label:'همه'},
  {id:'math',label:'ریاضی',subject:'ریاضی'},
  {id:'physics',label:'فیزیک',subject:'فیزیک'},
  {id:'chemistry',label:'شیمی',subject:'شیمی'},
  {id:'english',label:'زبان انگلیسی',subject:'زبان انگلیسی'}
 ];

 const displayMeta={
  'content-math-1':{price:1200000,instructor:'دکتر مریم رضایی',courseTitle:'آموزش معادلات دیفرانسیل',videoTitle:'رفع اشکال ریاضی نهم',duration:765,variant:'math'},
  'content-physics-1':{price:980000,instructor:'مهندس رضا شریفی',courseTitle:'فیزیک پیش‌دانشگاهی - مکانیک',videoTitle:'نیروها و قوانین نیوتن',duration:830,variant:'physics'},
  'content-english-1':{price:760000,instructor:'استاد سارا احمدی',courseTitle:'زبان انگلیسی کاربردی',videoTitle:'گرامر در ۱۰ دقیقه',duration:640,variant:'english'}
 };

 const normalizedSearch=String(search||'').trim().toLocaleLowerCase('fa-IR');
 const selectedCategory=categories.find(item=>item.id===activeCategory)||categories[0];

 const publishedItems=useMemo(()=>Object.values(state.content.catalogueById||{}).filter(item=>item&&item.status==='published'),[state.content.catalogueById]);

 const filteredItems=useMemo(()=>publishedItems.filter(item=>{
  const matchesCategory=!selectedCategory.subject||item.subject===selectedCategory.subject;
  const searchable=`${item.title||''} ${item.subject||''} ${item.topic||''} ${item.description||''} ${item.provider||''}`.toLocaleLowerCase('fa-IR');
  const matchesSearch=!normalizedSearch||searchable.includes(normalizedSearch);
  return matchesCategory&&matchesSearch
 }),[publishedItems,selectedCategory.subject,normalizedSearch]);

 const recommendationOrder=Array.isArray(state.content.recommendations)?state.content.recommendations:[];
 const recommendedItems=[...filteredItems].sort((first,second)=>{
  const firstIndex=recommendationOrder.indexOf(first.id);
  const secondIndex=recommendationOrder.indexOf(second.id);
  if(firstIndex===-1&&secondIndex===-1)return 0;
  if(firstIndex===-1)return 1;
  if(secondIndex===-1)return-1;
  return firstIndex-secondIndex
 });

 const courseItems=showAllCourses?recommendedItems:recommendedItems.slice(0,4);
 const videoItems=showAllVideos?filteredItems:filteredItems.slice(0,4);

 const progressItems=Object.entries(state.content.watchProgress||{})
  .map(([contentId,progress])=>({contentId,progress:Math.max(0,Math.min(100,Number(progress)||0)),content:state.content.catalogueById?.[contentId]}))
  .filter(item=>item.content&&item.progress>0&&item.progress<100);

 const continueItem=progressItems[0]||(recommendedItems[0]?{contentId:recommendedItems[0].id,content:recommendedItems[0],progress:0}:null);

 function openContent(contentId,view='course'){
  if(!contentId)return;
  dispatch(IrancellContentSelect(contentId,view));
  onNavigate?.(`student/binayi/course/${contentId}${view==='video'?'?view=video':''}`)
 }

 function chooseCategory(categoryId){
  setActiveCategory(categoryId);
  setShowAllCourses(false);
  setShowAllVideos(false)
 }

 function clearSearch(){
  setSearch('');
  setActiveCategory('all');
  setShowAllCourses(false);
  setShowAllVideos(false)
 }

 function getMeta(content){
  return{
   price:Math.max(0,Number(content?.price)||0),
   instructor:content?.instructor||content?.provider||'مدرس ایرانسل',
   courseTitle:content?.title||'دوره آموزشی',
   videoTitle:content?.title||'ویدیوی آموزشی',
   duration:Number(content?.duration)||600,
   variant:String(content?.subject||'').includes('فیزیک')?'physics':String(content?.subject||'').includes('زبان')?'english':'math'
  }
 }

 function getDurationLabel(seconds){
  const total=Math.max(0,Number(seconds)||0);
  const minutes=Math.floor(total/60);
  const remaining=String(total%60).padStart(2,'0');
  return`${IrancellFormatPersianNumber(minutes)}:${remaining.replace(/\d/g,digit=>'۰۱۲۳۴۵۶۷۸۹'[Number(digit)])}`
 }

 function renderThumbnail(content,video=false){
  const meta=getMeta(content);
  return <span className={`ir-binayi-home__media is-${meta.variant} ${video?'is-video':''}`} aria-hidden="true">
   {meta.variant==='physics'?<svg viewBox="0 0 220 118">
    <rect width="220" height="118" rx="12" fill="#eef1ee"/>
    <rect x="12" y="11" width="121" height="84" rx="4" fill="#f7f7f3"/>
    <path d="M30 82 81 35l41 47" fill="#d7b38a"/>
    <path d="M42 70h63M57 56l8 8M84 44l8 9" stroke="#62666a" strokeWidth="2"/>
    <path d="M139 20h68v67h-68z" fill="#fff"/>
    <path d="M147 29h50M147 37h42" stroke="#2c5270" strokeWidth="3"/>
    <path d="M153 73 181 44l18 29" stroke="#e49d37" strokeWidth="3" fill="none"/>
    <circle cx="176" cy="49" r="4" fill="#577f62"/>
   </svg>:meta.variant==='english'?<svg viewBox="0 0 220 118">
    <rect width="220" height="118" rx="12" fill="#e8e3d9"/>
    <rect x="13" y="13" width="194" height="92" rx="6" fill="#f8f6ed"/>
    <path d="M35 35h64M35 48h93M35 61h76M35 74h106" stroke="#bbb4a5" strokeWidth="3"/>
    <text x="153" y="52" textAnchor="middle" fontSize="25" fontWeight="900" fill="#40536c">EN</text>
    <text x="153" y="73" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7a8792">LEARNING</text>
   </svg>:<svg viewBox="0 0 220 118">
    <rect width="220" height="118" rx="12" fill="#d7c7ae"/>
    <rect x="9" y="9" width="202" height="78" rx="4" fill="#4f514a"/>
    <path d="M20 24h48M27 37h32M114 25h74M136 40h47M24 66h61M112 64h78" stroke="#eee7d7" strokeWidth="2" opacity=".75"/>
    <path d="M70 45c15-25 32 26 49 1 17-25 30 12 49-7" stroke="#e8dec8" strokeWidth="2" fill="none"/>
    <path d="M11 89h198M35 96v15M185 96v15" stroke="#9e8367" strokeWidth="4"/>
    <rect x="145" y="90" width="34" height="15" rx="2" fill="#c8ad89"/>
   </svg>}
   <i className="ir-binayi-home__play">
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg>
   </i>
   {video&&<b className="ir-binayi-home__duration">{getDurationLabel(meta.duration)}</b>}
  </span>
 }

 if(route==='student/binayi/my-courses'||route==='student/binayi/completed'){
  const currentUserId=state.session.currentUserId;
  const enrollmentMap=state.content.enrollmentsByUserId?.[currentUserId]||{};
  const progressedIds=Object.entries(state.content.watchProgress||{}).filter(([,progress])=>Number(progress)>0).map(([contentId])=>contentId);
  const myCourseIds=[...new Set([...Object.keys(enrollmentMap),...progressedIds])];
  const myCourseRows=myCourseIds.map(contentId=>{
   const content=state.content.catalogueById?.[contentId];
   if(!content||content.status!=='published')return null;
   const enrollment=enrollmentMap[contentId]||null;
   const progress=Math.max(0,Math.min(100,Number(state.content.watchProgress?.[contentId])||0));
   const kind=content.deliveryType||enrollment?.deliveryType||'video';
   return{content,progress,kind,meta:getMeta(content),enrollment}
  }).filter(Boolean);
  const visibleCourses=myCourseRows.filter(item=>{
   const chipMatches=myCourseFilter==='all'||(myCourseFilter==='completed'&&item.progress>=100)||(myCourseFilter==='live'&&item.kind==='live')||(myCourseFilter==='video'&&item.kind==='video');
   const typeMatches=courseTypeFilter==='all'||item.kind===courseTypeFilter;
   const statusMatches=courseStatusFilter==='all'||(courseStatusFilter==='learning'&&item.progress>0&&item.progress<100)||(courseStatusFilter==='completed'&&item.progress>=100)||(courseStatusFilter==='reserved'&&item.kind==='live'&&item.progress<100)||(courseStatusFilter==='cancelled'&&false);
   return chipMatches&&typeMatches&&statusMatches
  });
  const completedCount=myCourseRows.filter(item=>item.progress>=100).length;
  const activeCount=myCourseRows.filter(item=>item.progress>0&&item.progress<100).length;
  const filters=[
   {id:'all',label:'همه'},
   {id:'live',label:'کلاس زنده'},
   {id:'video',label:'ویدیویی'},
   {id:'completed',label:'تکمیل‌شده'}
  ];

  return <section className="ir-student-subpage ir-my-courses-page" aria-label="دوره‌های من">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/profile')}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>{route==='student/binayi/completed'?'دوره‌های تکمیل‌شده':'دوره‌های من'}</h1>
    <button type="button" aria-label="فیلتر دوره‌ها" aria-haspopup="dialog" onClick={()=>setCourseFilterOpen(true)}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>
    </button>
   </header>

   <section className="ir-my-courses-page__summary" aria-label="خلاصه دوره‌ها">
    <article>
     <strong>{IrancellFormatPersianNumber(myCourseRows.length)}</strong>
     <span>دوره</span>
    </article>
    <article>
     <strong>{IrancellFormatPersianNumber(completedCount)}</strong>
     <span>تکمیل‌شده</span>
    </article>
    <article>
     <strong>{IrancellFormatPersianNumber(activeCount)}</strong>
     <span>در حال یادگیری</span>
    </article>
   </section>

   <nav className="ir-student-subpage__chips" aria-label="فیلتر دوره‌ها">
    {filters.map(filter=><button type="button" key={filter.id} className={myCourseFilter===filter.id?'is-active':''} aria-pressed={myCourseFilter===filter.id} onClick={()=>setMyCourseFilter(filter.id)}>{filter.label}</button>)}
   </nav>

   {courseFilterOpen&&<div className="ir-course-filter-overlay" role="presentation" onMouseDown={()=>setCourseFilterOpen(false)}>
    <section className="ir-course-filter-sheet" role="dialog" aria-modal="true" aria-label="فیلتر دوره‌ها" onMouseDown={event=>event.stopPropagation()}>
     <span className="ir-course-filter-sheet__handle" aria-hidden="true"/>
     <header>
      <h2>فیلتر دوره‌ها</h2>
      <button type="button" aria-label="بستن" onClick={()=>setCourseFilterOpen(false)}>×</button>
     </header>

     <fieldset>
      <legend>نوع دوره</legend>
      <div>
       <button type="button" className={courseTypeFilter==='live'?'is-active':''} onClick={()=>setCourseTypeFilter('live')}>کلاس زنده</button>
       <button type="button" className={courseTypeFilter==='video'?'is-active':''} onClick={()=>setCourseTypeFilter('video')}>دوره ویدیویی</button>
       <button type="button" className={courseTypeFilter==='private'?'is-active':''} onClick={()=>setCourseTypeFilter('private')}>تدریس خصوصی</button>
       <button type="button" className={courseTypeFilter==='academy'?'is-active':''} onClick={()=>setCourseTypeFilter('academy')}>دوره آموزشگاه</button>
      </div>
     </fieldset>

     <fieldset>
      <legend>وضعیت</legend>
      <div>
       <button type="button" className={courseStatusFilter==='learning'?'is-active':''} onClick={()=>setCourseStatusFilter('learning')}>در حال یادگیری</button>
       <button type="button" className={courseStatusFilter==='reserved'?'is-active':''} onClick={()=>setCourseStatusFilter('reserved')}>رزروشده</button>
       <button type="button" className={courseStatusFilter==='completed'?'is-active':''} onClick={()=>setCourseStatusFilter('completed')}>تکمیل‌شده</button>
       <button type="button" className={courseStatusFilter==='cancelled'?'is-active':''} onClick={()=>setCourseStatusFilter('cancelled')}>لغوشده</button>
      </div>
     </fieldset>

     <button type="button" className="ir-course-filter-sheet__apply" onClick={()=>setCourseFilterOpen(false)}>اعمال فیلتر</button>
     <button type="button" className="ir-course-filter-sheet__clear" onClick={()=>{setCourseTypeFilter('all');setCourseStatusFilter('all');setMyCourseFilter('all')}}>پاک کردن فیلترها</button>
    </section>
   </div>}

   <div className="ir-my-courses-page__list">
    {visibleCourses.length?visibleCourses.map((item,index)=>{
     const typeLabel=item.kind==='live'?'کلاس زنده':item.kind==='video'?'ویدیویی':'خصوصی';
     const completed=item.progress>=100;
     return <article className="ir-my-course-card" key={item.content.id}>
      <div className="ir-my-course-card__media">
       {renderThumbnail(item.content)}
       <span className={`is-${item.kind}`}>{typeLabel}</span>
      </div>

      <div className="ir-my-course-card__body">
       <div className="ir-my-course-card__heading">
        <div>
         <h2>{item.meta.courseTitle}</h2>
         <p>{item.meta.instructor}</p>
        </div>
        {completed&&<span className="ir-my-course-card__completed">تکمیل‌شده</span>}
       </div>

       <div className="ir-my-course-card__progress-copy">
        <span>{completed?'پیشرفت کامل':'پیشرفت دوره'}</span>
        <strong>{IrancellFormatPersianNumber(item.progress)}٪</strong>
       </div>
       <div className="ir-my-course-card__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={item.progress}>
        <span style={{width:`${item.progress}%`}}/>
       </div>

       {!completed&&<small>{item.content.topic?`ادامه یادگیری: ${item.content.topic}`:'ادامه مسیر یادگیری'}</small>}

       <button type="button" onClick={()=>completed?onNavigate?.(`student/certificates?course=${item.content.id}`):openContent(item.content.id)}>
        {completed?'مشاهده گواهینامه':item.progress>0?'ادامه یادگیری':'مشاهده جزئیات'}
       </button>
      </div>
     </article>
    }):<div className="ir-student-subpage__empty">
     <span aria-hidden="true">◎</span>
     <strong>دوره‌ای در این بخش نیست</strong>
     <p>فیلتر دیگری را انتخاب کن یا از بینایی یک دوره جدید شروع کن.</p>
     <button type="button" onClick={()=>setMyCourseFilter('all')}>نمایش همه دوره‌ها</button>
    </div>}
   </div>
  </section>
 }

 return <section className="ir-binayi-home" aria-label="بینایی، مرکز یادگیری دانش‌آموز">
  <header className="ir-binayi-home__search-wrap">
   <label className="ir-binayi-home__search">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
    <input value={search} onChange={event=>setSearch(event.target.value)} placeholder="جستجوی دوره یا ویدیو..." aria-label="جستجوی دوره یا ویدیو"/>
    {search&&<button type="button" aria-label="پاک کردن جستجو" onClick={()=>setSearch('')}>×</button>}
   </label>
  </header>

  <nav className="ir-binayi-home__categories" aria-label="فیلتر موضوعی">
   {categories.map(category=><button type="button" key={category.id} className={activeCategory===category.id?'is-active':''} aria-pressed={activeCategory===category.id} onClick={()=>chooseCategory(category.id)}>{category.label}</button>)}
  </nav>

  <section className="ir-binayi-home__section" aria-labelledby="irancell-binayi-courses-title">
   <header className="ir-binayi-home__section-heading">
    <h1 id="irancell-binayi-courses-title">دوره‌های پیشنهادی</h1>
    {recommendedItems.length>0&&<button type="button" onClick={()=>setShowAllCourses(value=>!value)}>{showAllCourses?'نمایش کمتر':'مشاهده همه'} <span aria-hidden="true">←</span></button>}
   </header>

   {courseItems.length?<div className={`ir-binayi-home__course-list ${showAllCourses?'is-expanded':''}`}>
    {courseItems.map(content=>{
     const meta=getMeta(content);
     const roundedRating=Math.max(0,Math.min(5,Math.round(Number(content.rating)||0)));
     return <button type="button" className="ir-binayi-home__course-card" key={content.id} onClick={()=>openContent(content.id)}>
      {renderThumbnail(content)}
      <span className="ir-binayi-home__course-copy">
       <strong>{meta.courseTitle}</strong>
       <small>{meta.instructor}</small>
       <span className="ir-binayi-home__rating" aria-label={`امتیاز ${content.rating||0} از ۵`}>
        {[0,1,2,3,4].map(index=><i key={index} className={index<roundedRating?'is-filled':''}>★</i>)}
       </span>
       <b>{IrancellFormatCurrency(meta.price)}</b>
      </span>
     </button>
    })}
   </div>:<div className="ir-binayi-home__empty">
    <strong>محتوایی پیدا نشد</strong>
    <p>عبارت جستجو یا فیلتر درس را تغییر بده.</p>
    <button type="button" onClick={clearSearch}>نمایش همه محتواها</button>
   </div>}
  </section>

  <section className="ir-binayi-home__section is-videos" aria-labelledby="irancell-binayi-videos-title">
   <header className="ir-binayi-home__section-heading">
    <h2 id="irancell-binayi-videos-title">ویدیوهای رایگان</h2>
    {filteredItems.length>0&&<button type="button" onClick={()=>setShowAllVideos(value=>!value)}>{showAllVideos?'نمایش کمتر':'مشاهده همه'} <span aria-hidden="true">←</span></button>}
   </header>

   {videoItems.length?<div className={`ir-binayi-home__video-list ${showAllVideos?'is-expanded':''}`}>
    {videoItems.map(content=>{
     const meta=getMeta(content);
     return <button type="button" className="ir-binayi-home__video-card" key={content.id} onClick={()=>openContent(content.id,'video')}>
      {renderThumbnail(content,true)}
      <span>
       <strong>{meta.videoTitle}</strong>
       <small>{meta.instructor}</small>
      </span>
     </button>
    })}
   </div>:<div className="ir-binayi-home__empty is-compact">
    <strong>ویدیویی برای این فیلتر نیست</strong>
    <button type="button" onClick={clearSearch}>پاک کردن فیلتر</button>
   </div>}
  </section>

  <section className="ir-binayi-home__continue" aria-labelledby="irancell-binayi-continue-title">
   <h2 id="irancell-binayi-continue-title">ادامه یادگیری</h2>
   {continueItem?<article>
    <div className="ir-binayi-home__continue-copy">
     <strong>{getMeta(continueItem.content).courseTitle}</strong>
     <small>قسمت {IrancellFormatPersianNumber(Math.max(1,Math.round(Math.max(continueItem.progress,1)/16)))} از ۱۲ · {IrancellFormatPersianNumber(continueItem.progress)}٪ پیشرفت</small>
    </div>
    <div className="ir-binayi-home__continue-progress" role="progressbar" aria-label="پیشرفت دوره" aria-valuemin="0" aria-valuemax="100" aria-valuenow={continueItem.progress}>
     <span style={{width:`${continueItem.progress}%`}}/>
    </div>
    <button type="button" onClick={()=>openContent(continueItem.contentId)}>{continueItem.progress>0?'ادامه مشاهده':'شروع یادگیری'}</button>
   </article>:<article className="is-empty">
    <div className="ir-binayi-home__continue-copy">
     <strong>هنوز دوره‌ای شروع نکرده‌ای</strong>
     <small>یکی از دوره‌های پیشنهادی را انتخاب کن.</small>
    </div>
   </article>}
  </section>
 </section>
}