export function IrancellStudentLearningPage({onNavigate,screen}){
 const{state,dispatch}=useIrancellStore();
 const route=screen?.route||'student/binayi';
 const currentUserId=state.session.currentUserId;
 const currentProgressMap=state.content.progressByStudentId?.[currentUserId]||{};
 const[search,setSearch]=useState('');
 const[activeCategory,setActiveCategory]=useState('all');
 const[showAllCourses,setShowAllCourses]=useState(false);
 const[showAllVideos,setShowAllVideos]=useState(false);
 const[myCourseFilter,setMyCourseFilter]=useState(route==='student/binayi/completed'?'completed':'all');
 const[courseFilterOpen,setCourseFilterOpen]=useState(false);
 const[courseTypeFilter,setCourseTypeFilter]=useState('all');
 const[courseStatusFilter,setCourseStatusFilter]=useState(route==='student/binayi/completed'?'completed':'all');
 const[assignmentFilter,setAssignmentFilter]=useState('all');
 const[selectedAnswers,setSelectedAnswers]=useState({});
 const[submissionNotice,setSubmissionNotice]=useState('');

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

 const progressItems=Object.entries(currentProgressMap)
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

 if(route==='student/assignments'||route==='student/statistics'){
  const font='"Vazirmatn", Tahoma, Arial, sans-serif';
  const enrollmentMap=state.content.enrollmentsByUserId?.[currentUserId]||{};
  const enrolledContents=Object.keys(enrollmentMap).map(contentId=>state.content.catalogueById?.[contentId]).filter(content=>content&&content.status==='published');
  const submissionMap=state.content.assignmentSubmissionsByStudentId?.[currentUserId]||{};

  function buildCourseAssignments(content){
   const topic=content.topic||content.title;
   return[
    {id:`${content.id}:1`,contentId:content.id,assignmentIndex:1,title:`مرور مفهوم ${topic}`,question:`برای شروع یادگیری «${topic}» کدام روش مناسب‌تر است؟`,options:[`مرور تعریف و نکات اصلی ${topic}`,'حفظ کردن پاسخ بدون مطالعه','رد شدن از مثال‌های دوره','شروع از یک موضوع نامرتبط'],correctAnswer:0},
    {id:`${content.id}:2`,contentId:content.id,assignmentIndex:2,title:`حل مسئله ${content.subject}`,question:'در حل یک مسئله درسی، ترتیب درست انجام کار کدام است؟',options:['نوشتن پاسخ نهایی و سپس حدس داده‌ها','مشخص کردن داده‌ها، انتخاب رابطه، حل و بررسی پاسخ','حذف واحدها و نوشتن عدد تصادفی','فقط مشاهده پاسخ دیگران'],correctAnswer:1},
    {id:`${content.id}:3`,contentId:content.id,assignmentIndex:3,title:`ارزیابی پایانی ${content.title}`,question:'پس از پاسخ اشتباه، بهترین قدم بعدی چیست؟',options:['کنار گذاشتن کامل مبحث','تغییر پاسخ بدون بررسی','مرور اشتباه، بازبینی درس و حل تمرین مشابه','حذف سابقه تمرین'],correctAnswer:2}
   ].map(item=>({...item,content}))
  }

  const assignments=enrolledContents.flatMap(buildCourseAssignments);
  const filteredAssignments=assignments.filter(item=>{
   const submission=submissionMap[item.id];
   if(assignmentFilter==='pending')return!submission;
   if(assignmentFilter==='graded')return Boolean(submission);
   if(assignmentFilter==='correct')return Number(submission?.score)===100;
   return true
  });
  const submissions=Object.values(submissionMap).filter(item=>enrollmentMap[item.contentId]);
  const gradedCount=submissions.length;
  const correctCount=submissions.filter(item=>Number(item.score)===100).length;
  const averageScore=gradedCount?Math.round(submissions.reduce((sum,item)=>sum+(Number(item.score)||0),0)/gradedCount):0;
  const progressValues=enrolledContents.map(content=>Math.max(0,Math.min(100,Number(currentProgressMap[content.id])||0)));
  const averageProgress=progressValues.length?Math.round(progressValues.reduce((sum,value)=>sum+value,0)/progressValues.length):0;
  const completedCourses=enrolledContents.filter(content=>Number(currentProgressMap[content.id])>=100).length;
  const studentClasses=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===currentUserId);
  const attendedClasses=studentClasses.filter(item=>Boolean(state.classroom.attendanceBySessionId?.[item.id]?.[currentUserId])).length;
  const subjectGroups=enrolledContents.reduce((groups,content)=>{
   const subject=content.subject||'عمومی';
   const current=groups[subject]||{subject,courses:0,progressTotal:0,scores:[]};
   current.courses+=1;
   current.progressTotal+=Math.max(0,Math.min(100,Number(currentProgressMap[content.id])||0));
   submissions.filter(item=>item.contentId===content.id).forEach(item=>current.scores.push(Number(item.score)||0));
   groups[subject]=current;
   return groups
  },{});
  const subjectRows=Object.values(subjectGroups).map(item=>({...item,progress:Math.round(item.progressTotal/Math.max(item.courses,1)),score:item.scores.length?Math.round(item.scores.reduce((sum,value)=>sum+value,0)/item.scores.length):0}));

  function submitAssignment(assignment){
   const selectedAnswer=selectedAnswers[assignment.id];
   if(selectedAnswer===undefined||selectedAnswer==='')return;
   const answerIndex=Number(selectedAnswer);
   dispatch({
    type:'IRANCELL_CONTENT_ASSIGNMENT_SUBMIT',
    contentId:assignment.contentId,
    assignmentIndex:assignment.assignmentIndex,
    title:assignment.title,
    question:assignment.question,
    selectedAnswer:answerIndex,
    answerLabel:assignment.options[answerIndex],
    correctAnswer:assignment.correctAnswer
   });
   setSubmissionNotice(answerIndex===assignment.correctAnswer?'پاسخ درست ثبت شد و امتیاز کامل گرفتی.':'پاسخ ثبت شد. بازخورد را بخوان و دوباره تلاش کن.');
  }

  return <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',flexDirection:'column',gap:'17px',padding:'clamp(14px,3vw,28px)',direction:'rtl',color:'#202024',background:'#FFFAE0',fontFamily:font}}>
   <IrancellPageHeader eyebrow="یادگیری دانش‌آموز" title={route==='student/assignments'?'تکالیف و تمرین‌ها':'آمار و عملکرد یادگیری'} description={route==='student/assignments'?'تمرین‌های دوره‌های ثبت‌نام‌شده را انجام بده، بازخورد فوری بگیر و امتیازت را بهتر کن.':'پیشرفت دوره‌ها، نمره تمرین‌ها و سابقه حضور در کلاس‌ها را یکجا ببین.'} actions={<IrancellButton variant="secondary" onClick={()=>onNavigate?.('student/binayi')}>بازگشت به دوره‌ها</IrancellButton>}/>

   <nav aria-label="بخش‌های یادگیری" style={{display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',gap:'8px',padding:'7px',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'16px',fontFamily:font}}>
    <button type="button" onClick={()=>onNavigate?.('student/assignments')} style={{minHeight:'40px',padding:'8px 15px',cursor:'pointer',color:'#202024',background:route==='student/assignments'?'#FFD100':'transparent',border:route==='student/assignments'?'1px solid #E7BD00':'1px solid transparent',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:900}}>تکالیف</button>
    <button type="button" onClick={()=>onNavigate?.('student/statistics')} style={{minHeight:'40px',padding:'8px 15px',cursor:'pointer',color:'#202024',background:route==='student/statistics'?'#FFD100':'transparent',border:route==='student/statistics'?'1px solid #E7BD00':'1px solid transparent',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:900}}>آمار یادگیری</button>
    <button type="button" onClick={()=>onNavigate?.('student/binayi/my-courses')} style={{minHeight:'40px',padding:'8px 15px',cursor:'pointer',color:'#55565D',background:'transparent',border:'1px solid transparent',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:800}}>دوره‌های من</button>
   </nav>

   <div style={{display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,170px),1fr))',gap:'11px'}}>
    <IrancellStatCard label="دوره‌های من" value={IrancellFormatPersianNumber(enrolledContents.length)} icon={BookOpen}/>
    <IrancellStatCard label="پیشرفت میانگین" value={`${IrancellFormatPersianNumber(averageProgress)}٪`} icon={TrendingUp}/>
    <IrancellStatCard label="میانگین نمره" value={`${IrancellFormatPersianNumber(Math.round(averageScore/5))} از ۲۰`} icon={Activity}/>
    <IrancellStatCard label="حضور در کلاس" value={`${IrancellFormatPersianNumber(attendedClasses)} از ${IrancellFormatPersianNumber(studentClasses.length)}`} icon={CalendarCheck}/>
   </div>

   {route==='student/assignments'?<>
    <IrancellCard title="وضعیت تمرین‌ها" subtitle={`${IrancellFormatPersianNumber(gradedCount)} تمرین انجام‌شده و ${IrancellFormatPersianNumber(Math.max(0,assignments.length-gradedCount))} تمرین در انتظار`}>
     <div style={{display:'flex',width:'100%',flexWrap:'wrap',gap:'7px'}}>
      {[['all','همه'],['pending','در انتظار'],['graded','انجام‌شده'],['correct','پاسخ درست']].map(([id,label])=><button type="button" key={id} aria-pressed={assignmentFilter===id} onClick={()=>setAssignmentFilter(id)} style={{minHeight:'36px',padding:'7px 13px',cursor:'pointer',color:'#202024',background:assignmentFilter===id?'#FFD100':'#F5F5F6',border:assignmentFilter===id?'1px solid #E7BD00':'1px solid #E2E2E6',borderRadius:'999px',fontFamily:font,fontSize:'10px',fontWeight:900}}>{label}</button>)}
     </div>
     {submissionNotice&&<div role="status" style={{marginTop:'12px',padding:'11px 13px',color:'#21663D',background:'#E9F7EE',border:'1px solid #BFE6CC',borderRadius:'12px',fontFamily:font,fontSize:'11px',fontWeight:800}}>{submissionNotice}</div>}
    </IrancellCard>

    {filteredAssignments.length?<div style={{display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',alignItems:'start',gap:'13px'}}>
     {filteredAssignments.map(assignment=>{
      const submission=submissionMap[assignment.id]||null;
      const selectedValue=selectedAnswers[assignment.id]===undefined?submission?.selectedAnswer??'':selectedAnswers[assignment.id];
      return <IrancellCard key={assignment.id} title={assignment.title} subtitle={`${assignment.content.subject} · ${assignment.content.title}`} action={submission?<span style={{display:'inline-flex',padding:'5px 9px',color:Number(submission.score)===100?'#21663D':'#8A4C00',background:Number(submission.score)===100?'#E9F7EE':'#FFF3D6',borderRadius:'999px',fontFamily:font,fontSize:'10px',fontWeight:900}}>{IrancellFormatPersianNumber(Math.round(Number(submission.score)/5))} از ۲۰</span>:null}>
       <p style={{margin:'0 0 13px',color:'#303036',fontFamily:font,fontSize:'12px',fontWeight:800,lineHeight:1.9}}>{assignment.question}</p>
       <div role="radiogroup" aria-label={assignment.question} style={{display:'grid',gap:'8px'}}>
        {assignment.options.map((option,index)=>{
         const selected=Number(selectedValue)===index;
         return <button type="button" role="radio" aria-checked={selected} key={option} onClick={()=>{setSelectedAnswers(current=>({...current,[assignment.id]:index}));setSubmissionNotice('')}} style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,minHeight:'44px',gridTemplateColumns:'24px minmax(0,1fr)',alignItems:'center',gap:'9px',padding:'9px 11px',cursor:'pointer',direction:'rtl',textAlign:'right',color:'#202024',background:selected?'#FFF8D1':'#FAFAFB',border:selected?'1px solid #FFD100':'1px solid #E5E5E8',borderRadius:'12px',fontFamily:font,fontSize:'11px',fontWeight:selected?900:600}}>
          <span aria-hidden="true" style={{display:'grid',width:'20px',height:'20px',placeItems:'center',background:selected?'#FFD100':'#FFFFFF',border:selected?'1px solid #DDB500':'1px solid #CFCFD4',borderRadius:'50%',fontSize:'10px'}}>{selected?'✓':''}</span>
          <span>{option}</span>
         </button>
        })}
       </div>
       {submission&&<div style={{marginTop:'11px',padding:'11px',color:Number(submission.score)===100?'#21663D':'#7A4D00',background:Number(submission.score)===100?'#E9F7EE':'#FFF5D9',borderRadius:'11px',fontFamily:font,fontSize:'10px',fontWeight:700,lineHeight:1.8}}>{submission.feedback} · تلاش {IrancellFormatPersianNumber(submission.attempts)}</div>}
       <IrancellButton block style={{marginTop:'12px'}} disabled={selectedValue===''} onClick={()=>submitAssignment(assignment)}>{submission?'ثبت تلاش جدید':'ارسال پاسخ'}</IrancellButton>
      </IrancellCard>
     })}
    </div>:<IrancellStatePanel state="empty" title={enrolledContents.length?'تمرینی با این فیلتر پیدا نشد':'هنوز در دوره‌ای ثبت‌نام نکرده‌ای'} description={enrolledContents.length?'فیلتر تمرین‌ها را تغییر بده.':'از بخش بینایی یک دوره را انتخاب و به دوره‌های خود اضافه کن.'} action={<IrancellButton onClick={()=>onNavigate?.('student/binayi')}>مشاهده دوره‌ها</IrancellButton>}/>}
   </>:<>
    <div style={{display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))',gap:'14px'}}>
     <IrancellCard title="خلاصه عملکرد" subtitle="محاسبه‌شده از فعالیت‌های واقعی حساب">
      <div style={{display:'grid',gap:'12px'}}>
       {[['پیشرفت دوره‌ها',averageProgress],['دقت پاسخ تمرین‌ها',gradedCount?Math.round((correctCount/gradedCount)*100):0],['دوره‌های تکمیل‌شده',enrolledContents.length?Math.round((completedCourses/enrolledContents.length)*100):0],['نرخ حضور در کلاس',studentClasses.length?Math.round((attendedClasses/studentClasses.length)*100):0]].map(([label,value])=><div key={label} style={{display:'grid',gap:'6px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px',fontFamily:font,fontSize:'11px'}}><span>{label}</span><strong>{IrancellFormatPersianNumber(value)}٪</strong></div>
        <div style={{height:'8px',overflow:'hidden',background:'#E9E9EC',borderRadius:'999px'}}><span style={{display:'block',width:`${value}%`,height:'100%',background:'#FFD100',borderRadius:'inherit'}}/></div>
       </div>)}
      </div>
     </IrancellCard>

     <IrancellCard title="عملکرد در درس‌ها" subtitle="پیشرفت و نمره به تفکیک موضوع">
      <div style={{display:'grid',gap:'9px'}}>
       {subjectRows.length?subjectRows.map(item=><article key={item.subject} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',alignItems:'center',gap:'11px',padding:'11px',background:'#FAFAFB',border:'1px solid #E7E7EA',borderRadius:'12px'}}>
        <div style={{display:'flex',minWidth:0,flexDirection:'column',gap:'3px'}}><strong style={{fontFamily:font,fontSize:'12px'}}>{item.subject}</strong><small style={{color:'#777982',fontFamily:font,fontSize:'10px'}}>{IrancellFormatPersianNumber(item.courses)} دوره · پیشرفت {IrancellFormatPersianNumber(item.progress)}٪</small></div>
        <span style={{display:'grid',minWidth:'54px',height:'38px',placeItems:'center',color:'#202024',background:'#FFF3AE',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:900}}>{item.scores.length?`${IrancellFormatPersianNumber(Math.round(item.score/5))}/۲۰`:'—'}</span>
       </article>):<IrancellStatePanel state="empty" title="آمار درسی آماده نیست" description="پس از ثبت‌نام در دوره‌ها، آمار هر درس اینجا نمایش داده می‌شود."/>}
      </div>
     </IrancellCard>
    </div>
   </>}
  </section>
 }

 if(route==='student/binayi/my-courses'||route==='student/binayi/completed'){
  const currentUserId=state.session.currentUserId;
  const enrollmentMap=state.content.enrollmentsByUserId?.[currentUserId]||{};
  const progressedIds=Object.entries(currentProgressMap).filter(([,progress])=>Number(progress)>0).map(([contentId])=>contentId);
  const myCourseIds=[...new Set([...Object.keys(enrollmentMap),...progressedIds])];
  const myCourseRows=myCourseIds.map(contentId=>{
   const content=state.content.catalogueById?.[contentId];
   if(!content||content.status!=='published')return null;
   const enrollment=enrollmentMap[contentId]||null;
   const progress=Math.max(0,Math.min(100,Number(currentProgressMap[contentId])||0));
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

  <section aria-label="مدیریت یادگیری" style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))',gap:'10px',padding:'0 16px'}}>
   <button type="button" onClick={()=>onNavigate?.('student/binayi/my-courses')} style={{display:'flex',minHeight:'58px',alignItems:'center',justifyContent:'space-between',gap:'10px',padding:'12px 14px',cursor:'pointer',direction:'rtl',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'15px',fontFamily:'"Vazirmatn", Tahoma, Arial, sans-serif',fontSize:'11px',fontWeight:900}}><span>دوره‌های من</span><span aria-hidden="true">←</span></button>
   <button type="button" onClick={()=>onNavigate?.('student/assignments')} style={{display:'flex',minHeight:'58px',alignItems:'center',justifyContent:'space-between',gap:'10px',padding:'12px 14px',cursor:'pointer',direction:'rtl',color:'#202024',background:'#FFF3AE',border:'1px solid #E8CF5B',borderRadius:'15px',fontFamily:'"Vazirmatn", Tahoma, Arial, sans-serif',fontSize:'11px',fontWeight:900}}><span>تکالیف و تمرین‌ها</span><span aria-hidden="true">←</span></button>
   <button type="button" onClick={()=>onNavigate?.('student/statistics')} style={{display:'flex',minHeight:'58px',alignItems:'center',justifyContent:'space-between',gap:'10px',padding:'12px 14px',cursor:'pointer',direction:'rtl',color:'#FFFFFF',background:'#202024',border:'1px solid #202024',borderRadius:'15px',fontFamily:'"Vazirmatn", Tahoma, Arial, sans-serif',fontSize:'11px',fontWeight:900}}><span>آمار و نمره‌ها</span><span aria-hidden="true">←</span></button>
  </section>

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