export function IrancellStudentProfilePage({params,onNavigate,screen}){
 const{state,dispatch}=useIrancellStore();
 const studentId=state.session.currentUserId||'student-1';
 const user=state.identity.usersById[studentId];
 const route=screen?.route||'student/profile';
 const safeName=String(user?.name||'آراد احمدی').trim();
 const safeNameParts=safeName.split(/\s+/).filter(Boolean);
 const safeGrade=String(user?.grade||'پایه هفتم').replace(/^پایه\s*/,'').split('،')[0].trim()||'هفتم';
 const[profileForm,setProfileForm]=useState({
  firstName:safeNameParts[0]||'آراد',
  familyName:safeNameParts.slice(1).join(' ')||'احمدی',
  mobile:String(user?.mobile||''),
  email:String(user?.email||'arad.ahmadi@email.com'),
  grade:safeGrade
 });
 const[profileFormError,setProfileFormError]=useState('');
 const[photoError,setPhotoError]=useState('');
 const galleryInputRef=useRef(null);
 const cameraInputRef=useRef(null);
 const[achievementFilter,setAchievementFilter]=useState('all');
 const[selectedBadgeId,setSelectedBadgeId]=useState('');
 const[certificateFilter,setCertificateFilter]=useState('all');
 const[certificateVerification,setCertificateVerification]=useState('');
 const[privacyDraft,setPrivacyDraft]=useState(()=>({
  profileVisible:user?.privacySettings?.profileVisible!==false,
  displayNameVisible:user?.privacySettings?.displayNameVisible!==false,
  avatarVisible:user?.privacySettings?.avatarVisible!==false,
  gradeVisible:user?.privacySettings?.gradeVisible!==false,
  completedCoursesVisible:user?.privacySettings?.completedCoursesVisible!==false,
  certificatesVisible:user?.privacySettings?.certificatesVisible!==false,
  achievementsVisible:user?.privacySettings?.achievementsVisible!==false,
  learningActivityVisible:Boolean(user?.privacySettings?.learningActivityVisible),
  personalizedRecommendations:user?.privacySettings?.personalizedRecommendations!==false,
  learningDataSharing:Boolean(user?.privacySettings?.learningDataSharing),
  siblingAchievementsVisible:Boolean(user?.privacySettings?.siblingAchievementsVisible),
  chistiHistoryEnabled:user?.privacySettings?.chistiHistoryEnabled!==false,
  chistiPersonalization:user?.privacySettings?.chistiPersonalization!==false,
  chistiFilesEnabled:user?.privacySettings?.chistiFilesEnabled!==false,
  chistiAutoDelete:Boolean(user?.privacySettings?.chistiAutoDelete),
  advertisingUse:false
 }));
 const[privacySaved,setPrivacySaved]=useState(false);
 const[privacyStoredOpen,setPrivacyStoredOpen]=useState('account');
 const[exportSelections,setExportSelections]=useState({profile:true,courses:true,assignments:true,certificates:true,chisti:true,files:true});
 const[exportFormat,setExportFormat]=useState('zip');
 const[deleteSelections,setDeleteSelections]=useState({chisti:false,uploadedFiles:false,searchHistory:false,personalizedRecommendations:false});
 const[deleteReason,setDeleteReason]=useState('دیگر از برنامه استفاده نمی‌کنم');
 const[deleteReasonDetail,setDeleteReasonDetail]=useState('');
 const[deleteAcknowledged,setDeleteAcknowledged]=useState(false);
 const[parentGateOtpSent,setParentGateOtpSent]=useState(false);
 const[parentGateCode,setParentGateCode]=useState('');
 const[parentGateSubmitted,setParentGateSubmitted]=useState(false);

 if(!user)return <IrancellStatePanel state="error" title="پروفایل پیدا نشد" description="اطلاعات هویتی دانش‌آموز در دسترس نیست."/>;

 const hasAvatarOverride=Object.prototype.hasOwnProperty.call(user,'avatarDataUrl');
 const avatarSource=hasAvatarOverride?user.avatarDataUrl:IRANCELL_PAGE_STUDENT_HOME_AVATAR;
 const avatarInitial=String(user.name||'آ').trim().charAt(0)||'آ';
 const gradeLabel=String(user.grade||'پایه هفتم').split('،')[0];
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===studentId);
 const completedClasses=classes.filter(item=>item.status==='completed').length;
 const catalogueCount=Object.keys(state.content.catalogueById||{}).length;
 const completedLearningCount=Object.values(state.content.progressByStudentId?.[studentId]||{}).filter(value=>Number(value)>=90).length;
 const courseCount=Math.max(12,catalogueCount);
 const completedCourseCount=Math.max(8,completedLearningCount);
 const certificateCount=Math.max(5,completedClasses);
 const photoReturnRoute=params?.return==='edit'?'student/profile/edit':'student/profile';

 function renderProfileAvatar(className,alt){
  return <span className={className}>{avatarSource?<img src={avatarSource} alt={alt||user.name}/>:<b aria-hidden="true">{avatarInitial}</b>}</span>
 }

 function updateProfileField(field,value){
  setProfileForm(current=>({...current,[field]:value}));
  if(profileFormError)setProfileFormError('')
 }

 function saveProfile(event){
  event.preventDefault();
  const firstName=String(profileForm.firstName||'').trim();
  const familyName=String(profileForm.familyName||'').trim();
  const mobile=String(profileForm.mobile||'').replace(/\s/g,'');
  const email=String(profileForm.email||'').trim();

  if(!firstName||!familyName){
   setProfileFormError('نام و نام خانوادگی را کامل وارد کنید.');
   return
  }

  if(IrancellValidateMobile(mobile)){
   setProfileFormError('شماره تلفن معتبر وارد کنید.');
   return
  }

  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
   setProfileFormError('ایمیل واردشده معتبر نیست.');
   return
  }

  dispatch({
   type:'IRANCELL_STUDENT_PROFILE_UPDATE',
   userId:studentId,
   profile:{
    name:`${firstName} ${familyName}`.trim(),
    mobile,
    email,
    grade:`پایه ${profileForm.grade}`
   }
  });
  onNavigate?.('student/profile')
 }

 function saveProfilePhoto(dataUrl){
  dispatch({
   type:'IRANCELL_STUDENT_PROFILE_PHOTO_UPDATE',
   userId:studentId,
   avatarDataUrl:dataUrl
  });
  onNavigate?.(photoReturnRoute)
 }

 function persistProfilePhoto(file){
  setPhotoError('');
  if(!file)return;
  if(!String(file.type||'').startsWith('image/')){
   setPhotoError('فقط فایل تصویری قابل انتخاب است.');
   return
  }
  if(Number(file.size)>8*1024*1024){
   setPhotoError('حجم تصویر باید کمتر از ۸ مگابایت باشد.');
   return
  }

  const reader=new FileReader();
  reader.onerror=function IrancellStudentProfilePhotoReadFailed(){
   setPhotoError('خواندن تصویر ناموفق بود. دوباره تلاش کنید.')
  };
  reader.onload=function IrancellStudentProfilePhotoReadCompleted(){
   const source=String(reader.result||'');
   if(!source){
    setPhotoError('تصویر انتخاب‌شده قابل استفاده نیست.');
    return
   }

   const image=new Image();
   image.onerror=function IrancellStudentProfilePhotoDecodeFallback(){
    saveProfilePhoto(source)
   };
   image.onload=function IrancellStudentProfilePhotoResize(){
    const longestEdge=Math.max(Number(image.width)||1,Number(image.height)||1);
    const scale=Math.min(1,720/longestEdge);
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.width*scale));
    canvas.height=Math.max(1,Math.round(image.height*scale));
    const context=canvas.getContext('2d');

    if(!context){
     saveProfilePhoto(source);
     return
    }

    context.drawImage(image,0,0,canvas.width,canvas.height);
    saveProfilePhoto(canvas.toDataURL('image/jpeg',.86))
   };
   image.src=source
  };
  reader.readAsDataURL(file)
 }

 function removeProfilePhoto(){
  dispatch({
   type:'IRANCELL_STUDENT_PROFILE_PHOTO_UPDATE',
   userId:studentId,
   avatarDataUrl:null
  });
  onNavigate?.(photoReturnRoute)
 }

 function logout(){
  dispatch({type:'IRANCELL_AUTH_LOGOUT'});
  onNavigate?.('auth/login')
 }

 function togglePrivacySetting(key){
  setPrivacyDraft(current=>({...current,[key]:!current[key]}));
  setPrivacySaved(false)
 }

 function savePrivacySettings(){
  dispatch({type:'IRANCELL_STUDENT_PRIVACY_UPDATE',userId:studentId,settings:privacyDraft});
  setPrivacySaved(true)
 }

 function submitPrivacyExport(){
  dispatch({
   type:'IRANCELL_STUDENT_PRIVACY_EXPORT_REQUEST',
   userId:studentId,
   format:exportFormat,
   categories:Object.keys(exportSelections).filter(key=>exportSelections[key])
  });
  onNavigate?.('student/privacy/success',{kind:'export'})
 }

 function submitPartialDeletion(){
  const categories=Object.keys(deleteSelections).filter(key=>deleteSelections[key]);
  if(!categories.length)return;
  onNavigate?.('student/privacy/parent-gate',{action:'partial-delete',next:'student/privacy/delete/history-confirm',categories:categories.join(',')})
 }

 function submitAccountDeletion(){
  const resolvedReason=deleteReason==='دلیل دیگر'?(deleteReasonDetail.trim()||deleteReason):deleteReason;
  if(!deleteAcknowledged||(deleteReason==='دلیل دیگر'&&!deleteReasonDetail.trim()))return;
  onNavigate?.('student/privacy/parent-gate',{action:'account-delete',next:'student/privacy/delete/account-confirm',reason:resolvedReason})
 }

 function verifyPrivacyParentGate(){
  setParentGateSubmitted(true);
  const expectedLength=Math.max(4,String(IRANCELL_APP_CONFIG.otpCode||'12345').replace(/\D/g,'').length||5);
  if(!parentGateOtpSent||String(parentGateCode||'').replace(/\D/g,'').length<expectedLength)return;
  dispatch({
   type:'IRANCELL_STUDENT_PARENT_GATE_VERIFY',
   userId:studentId,
   actionKey:params?.action||'privacy',
   code:String(parentGateCode||'').replace(/\D/g,'')
  })
 }

 useEffect(function IrancellStudentProfileParentGateReset(){
  if(route!=='student/privacy/parent-gate')return;
  setParentGateOtpSent(false);
  setParentGateCode('');
  setParentGateSubmitted(false)
 },[route,params?.action]);

 useEffect(function IrancellStudentProfileParentGateCompletion(){
  if(route!=='student/privacy/parent-gate'||!parentGateSubmitted)return;
  const gate=state.ui?.parentGate;
  if(!gate||gate.actionKey!==String(params?.action||'privacy')||!gate.verifiedAt)return;
  const target=String(params?.next||'student/privacy');
  const forwarded={};
  if(params?.categories)forwarded.categories=params.categories;
  if(params?.reason)forwarded.reason=params.reason;
  setParentGateSubmitted(false);
  onNavigate?.(target,forwarded)
 },[route,parentGateSubmitted,state.ui?.parentGate?.verifiedAt,state.ui?.parentGate?.actionKey,params?.action,params?.next,params?.categories,params?.reason]);

 if(route==='student/achievements'){
  const achievementPoints=Math.max(2450,completedCourseCount*240+completedClasses*150);
  const progressToNext=Math.max(20,Math.min(92,Math.round((achievementPoints%1000)/10)));
  const recentBadges=[
   {id:'consistent',title:'یادگیرنده پیوسته',subtitle:'۷ روز فعالیت متوالی',symbol:'⚡'},
   {id:'course',title:'دوره‌تمام‌کن',subtitle:'تکمیل یک دوره آموزشی',symbol:'★'},
   {id:'class',title:'فعال در کلاس',subtitle:'حضور منظم در جلسات',symbol:'✓'}
  ];

  const achievementsFont='"Vazirmatn", Tahoma, Arial, sans-serif';
  const achievementsCard={boxSizing:'border-box',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'20px',boxShadow:'0 10px 28px rgba(62,52,12,.07)',fontFamily:achievementsFont};
  const achievementProgressRows=[
   {title:'یادگیری مستمر',description:'۵ روز از ۷ روز هدف هفتگی',value:'۵/۷',progress:71,color:'#FFD100',soft:'#FFF7CE',symbol:'✦'},
   {title:'تکمیل درس‌ها',description:'۳ درس جدید در این هفته',value:'۳/۵',progress:60,color:'#35C96F',soft:'#E9F7EE',symbol:'✓'},
   {title:'کلاس‌های موفق',description:'حضور و مشارکت در کلاس',value:'۸۰٪',progress:80,color:'#7867E8',soft:'#F0EDFF',symbol:'★'}
  ];

  return <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',flexDirection:'column',gap:'18px',margin:0,padding:'24px clamp(14px,3vw,30px) 48px',color:'#202024',background:'#FFFAE0',fontFamily:achievementsFont}}>
   <header style={{boxSizing:'border-box',display:'grid',width:'100%',gridTemplateColumns:'44px minmax(0,1fr) 44px',alignItems:'center',gap:'10px',padding:'0 0 12px',borderBottom:'1px solid rgba(222,214,179,.72)'}}>
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/profile')} style={{boxSizing:'border-box',display:'grid',width:'44px',height:'44px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'13px',fontFamily:achievementsFont}}>
     <svg viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',width:'21px',height:'21px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <div><h1 style={{margin:0,fontFamily:achievementsFont,fontSize:'clamp(22px,3vw,30px)',fontWeight:900,lineHeight:1.5}}>دستاوردهای من</h1><small style={{color:'#777982',fontFamily:achievementsFont,fontSize:'10px',fontWeight:600}}>داشبورد / دستاوردهای من</small></div>
    <span/>
   </header>

   <section style={{...achievementsCard,display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'center',gap:'18px',padding:'18px 20px'}}>
    <div aria-label={`سطح ۷، ${IrancellFormatPersianNumber(progressToNext)} درصد پیشرفت`} style={{boxSizing:'border-box',display:'grid',width:'78px',minWidth:'78px',height:'78px',placeItems:'center',padding:'7px',background:`conic-gradient(#FFD100 0 ${progressToNext}%,#EEEAD8 ${progressToNext}% 100%)`,borderRadius:'50%'}}>
     <div style={{display:'flex',width:'62px',height:'62px',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#202024',background:'#FFFFFF',borderRadius:'50%'}}><span style={{fontSize:'9px',fontWeight:700}}>سطح</span><strong style={{fontSize:'22px',fontWeight:900}}>{IrancellFormatPersianNumber(7)}</strong></div>
    </div>
    <span style={{display:'grid',width:'58px',minWidth:'58px',height:'58px',placeItems:'center',overflow:'hidden',color:'#171719',background:'#FFD100',border:'2px solid #FFFFFF',borderRadius:'50%',boxShadow:'0 5px 14px rgba(62,52,12,.12)',fontFamily:achievementsFont,fontSize:'18px',fontWeight:900}}>{avatarSource?<img src={avatarSource} alt={user.name} style={{display:'block',width:'100%',height:'100%',objectFit:'cover'}}/>:<b aria-hidden="true">{avatarInitial}</b>}</span>
    <div style={{display:'flex',minWidth:'220px',flex:'1 1 320px',flexDirection:'column',gap:'5px'}}>
     <h2 style={{margin:0,fontFamily:achievementsFont,fontSize:'17px',fontWeight:900}}>{user.name}</h2>
     <p style={{margin:0,color:'#777982',fontFamily:achievementsFont,fontSize:'11px',fontWeight:700}}>یادگیرنده پرتلاش</p>
     <div style={{display:'block',width:'100%',height:'7px',overflow:'hidden',direction:'ltr',background:'#ECEDEF',borderRadius:'999px'}}><span style={{display:'block',width:`${progressToNext}%`,height:'100%',background:'#FFD100',borderRadius:'inherit'}}/></div>
     <small style={{color:'#777982',fontFamily:achievementsFont,fontSize:'9px'}}>{IrancellFormatPersianNumber(100-progressToNext)}٪ تا سطح بعدی</small>
    </div>
   </section>

   <section style={{display:'grid',width:'100%',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'10px'}}>
    {[{value:achievementPoints,label:'امتیاز',symbol:'☆'},{value:Math.max(9,completedCourseCount),label:'نشان',symbol:'♙'},{value:certificateCount,label:'گواهینامه',symbol:'▣'}].map(item=><article key={item.label} style={{...achievementsCard,display:'flex',minWidth:0,alignItems:'center',justifyContent:'space-between',gap:'8px',padding:'14px clamp(10px,2vw,18px)'}}><div style={{display:'flex',minWidth:0,flexDirection:'column'}}><strong style={{fontFamily:achievementsFont,fontSize:'clamp(16px,2.4vw,22px)',fontWeight:900}}>{IrancellFormatPersianNumber(item.value)}</strong><span style={{color:'#777982',fontFamily:achievementsFont,fontSize:'9px',fontWeight:700}}>{item.label}</span></div><b aria-hidden="true" style={{display:'grid',width:'34px',minWidth:'34px',height:'34px',placeItems:'center',color:'#8A7200',background:'#FFF7CE',borderRadius:'11px',fontFamily:achievementsFont}}>{item.symbol}</b></article>)}
   </section>

   <section style={{...achievementsCard,display:'flex',width:'100%',flexDirection:'column',gap:'14px',padding:'18px'}}>
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}><h2 style={{margin:0,fontFamily:achievementsFont,fontSize:'16px',fontWeight:900}}>نشان‌های اخیر</h2><button type="button" onClick={()=>onNavigate?.('student/badges')} style={{cursor:'pointer',color:'#6657D9',background:'transparent',border:0,fontFamily:achievementsFont,fontSize:'10px',fontWeight:800}}>مشاهده همه ←</button></header>
    <div style={{display:'grid',width:'100%',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:'10px'}}>
     {recentBadges.map((badge,index)=><button type="button" key={badge.id} onClick={()=>onNavigate?.('student/badges')} style={{boxSizing:'border-box',display:'flex',minWidth:0,flexDirection:'column',alignItems:'center',gap:'5px',padding:'14px 10px',cursor:'pointer',color:'#202024',background:index===0?'#FFFDF2':'#FFFFFF',border:'1px solid #EEE9D4',borderRadius:'16px',fontFamily:achievementsFont}}><span aria-hidden="true" style={{display:'grid',width:'42px',height:'42px',placeItems:'center',color:index===1?'#7867E8':index===2?'#21663D':'#8A7200',background:index===1?'#F0EDFF':index===2?'#E9F7EE':'#FFF7CE',borderRadius:'50%',fontSize:'18px'}}>{badge.symbol}</span><strong style={{fontFamily:achievementsFont,fontSize:'11px',fontWeight:900}}>{badge.title}</strong><small style={{color:'#777982',fontFamily:achievementsFont,fontSize:'8px',textAlign:'center'}}>{badge.subtitle}</small></button>)}
    </div>
   </section>

   <section style={{...achievementsCard,display:'flex',width:'100%',flexDirection:'column',gap:'12px',padding:'18px'}}>
    <h2 style={{margin:0,fontFamily:achievementsFont,fontSize:'16px',fontWeight:900}}>پیشرفت این هفته</h2>
    {achievementProgressRows.map(row=><article key={row.title} style={{boxSizing:'border-box',display:'grid',width:'100%',gridTemplateColumns:'38px minmax(0,1fr) auto',alignItems:'center',gap:'11px',padding:'10px 0',borderBottom:'1px solid #F0ECD9'}}><span aria-hidden="true" style={{display:'grid',width:'38px',height:'38px',placeItems:'center',color:row.color,background:row.soft,borderRadius:'50%',fontWeight:900}}>{row.symbol}</span><div style={{display:'flex',minWidth:0,flexDirection:'column',gap:'3px'}}><strong style={{fontFamily:achievementsFont,fontSize:'11px',fontWeight:900}}>{row.title}</strong><small style={{color:'#777982',fontFamily:achievementsFont,fontSize:'8px'}}>{row.description}</small><i style={{display:'block',width:'100%',height:'5px',overflow:'hidden',direction:'ltr',background:'#ECEDEF',borderRadius:'999px'}}><b style={{display:'block',width:`${row.progress}%`,height:'100%',background:row.color,borderRadius:'inherit'}}/></i></div><em style={{fontFamily:achievementsFont,fontSize:'10px',fontStyle:'normal',fontWeight:900}}>{row.value}</em></article>)}
   </section>

   <div style={{display:'grid',width:'100%',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'10px'}}>
    <button type="button" onClick={()=>onNavigate?.('student/points')} style={{minHeight:'46px',cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'14px',fontFamily:achievementsFont,fontSize:'11px',fontWeight:900}}>امتیازها و سطح‌ها</button>
    <button type="button" onClick={()=>onNavigate?.('student/certificates')} style={{minHeight:'46px',cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'14px',fontFamily:achievementsFont,fontSize:'11px',fontWeight:900}}>گواهینامه‌های من</button>
   </div>
   <button type="button" onClick={()=>onNavigate?.('student/badges')} style={{boxSizing:'border-box',display:'inline-flex',width:'100%',minHeight:'48px',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#171719',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'14px',fontFamily:achievementsFont,fontSize:'12px',fontWeight:900}}>مشاهده همه نشان‌ها</button>
  </section>
 }

 if(route==='student/badges'){
  const badgeDefinitions=[
   {id:'first-course',category:'learning',title:'اولین قدم',description:'اولین دوره را شروع کردی',symbol:'✦',earned:true},
   {id:'course-master',category:'learning',title:'دوره‌تمام‌کن',description:'یک دوره را کامل کردی',symbol:'★',earned:completedCourseCount>0},
   {id:'week-streak',category:'streak',title:'هفته طلایی',description:'۷ روز پیوسته یاد گرفتی',symbol:'⚡',earned:true},
   {id:'class-active',category:'class',title:'فعال در کلاس',description:'در کلاس‌ها مشارکت داشتی',symbol:'✓',earned:classes.length>0},
   {id:'five-courses',category:'learning',title:'یادگیرنده حرفه‌ای',description:'۵ دوره را کامل کن',symbol:'◆',earned:completedCourseCount>=5},
   {id:'month-streak',category:'streak',title:'ماه درخشان',description:'۳۰ روز پیوسته یاد بگیر',symbol:'☀',earned:false},
   {id:'ten-classes',category:'class',title:'همراه کلاس',description:'۱۰ جلسه موفق داشته باش',symbol:'◎',earned:completedClasses>=10},
   {id:'expert',category:'learning',title:'استاد مسیر',description:'همه هدف‌های این سطح را کامل کن',symbol:'♛',earned:false}
  ];
  const categories=[
   {id:'all',label:'همه'},
   {id:'learning',label:'یادگیری'},
   {id:'streak',label:'پیوستگی'},
   {id:'class',label:'کلاس'}
  ];
  const visibleBadges=achievementFilter==='all'?badgeDefinitions:badgeDefinitions.filter(item=>item.category===achievementFilter);
  const selectedBadge=badgeDefinitions.find(item=>item.id===selectedBadgeId);

  return <section className="ir-student-subpage ir-badges-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/achievements')}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>نشان‌های من</h1>
    <span/>
   </header>

   <nav className="ir-student-subpage__chips">
    {categories.map(category=><button type="button" key={category.id} className={achievementFilter===category.id?'is-active':''} onClick={()=>setAchievementFilter(category.id)}>{category.label}</button>)}
   </nav>

   <section className="ir-badges-page__summary">
    <div>
     <strong>{IrancellFormatPersianNumber(badgeDefinitions.filter(item=>item.earned).length)}</strong>
     <span>نشان دریافت‌شده</span>
    </div>
    <div>
     <strong>{IrancellFormatPersianNumber(badgeDefinitions.length)}</strong>
     <span>کل نشان‌ها</span>
    </div>
   </section>

   <div className="ir-badges-page__grid">
    {visibleBadges.map((badge,index)=><button type="button" key={badge.id} className={badge.earned?'is-earned':'is-locked'} onClick={()=>onNavigate?.(`student/badges/${badge.id}`)}>
     <span className={`is-${index%4+1}`}>{badge.symbol}</span>
     <strong>{badge.title}</strong>
     <small>{badge.description}</small>
     <em>{badge.earned?'دریافت شد':'در انتظار'}</em>
    </button>)}
   </div>

   {selectedBadge&&<aside className="ir-badges-page__detail">
    <button type="button" aria-label="بستن جزئیات نشان" onClick={()=>setSelectedBadgeId('')}>×</button>
    <span>{selectedBadge.symbol}</span>
    <div>
     <strong>{selectedBadge.title}</strong>
     <p>{selectedBadge.description}</p>
     <small>{selectedBadge.earned?'این نشان در حساب شما ثبت شده است.':'با تکمیل شرط این نشان، به صورت خودکار به دستاوردهای شما اضافه می‌شود.'}</small>
    </div>
   </aside>}

   <section className="ir-badges-page__next">
    <strong>نشان بعدی نزدیک است</strong>
    <p>با ادامه مسیر یادگیری، امتیاز و نشان‌های بیشتری دریافت می‌کنی.</p>
    <div><span style={{width:'72%'}}/></div>
   </section>
  </section>
 }

 if(route==='student/badges/:id'){
  const badgeId=params?.id||'week-streak';
  const badgeDefinitions={
   'first-course':{title:'شروع قدرتمند',description:'اولین دوره را تکمیل کردی',symbol:'✦',earned:true,points:100,category:'یادگیری',date:'۱۸ تیر ۱۴۰۴'},
   'course-master':{title:'دوره‌تمام‌کن',description:'یک دوره آموزشی را کامل کردی',symbol:'★',earned:true,points:150,category:'یادگیری',date:'۱۸ تیر ۱۴۰۴'},
   'week-streak':{title:'یادگیرنده پرتلاش',description:'با تکمیل پنج درس در مدت یک هفته، این نشان را دریافت کردی.',symbol:'⚡',earned:true,points:150,category:'تداوم',date:'۱۸ تیر ۱۴۰۴'},
   'class-active':{title:'حضور منظم',description:'در کلاس‌های برنامه‌ریزی‌شده حضور منظم داشتی.',symbol:'✓',earned:true,points:120,category:'کلاس',date:'۱۶ تیر ۱۴۰۴'},
   'five-courses':{title:'ستاره ریاضی',description:'امتیاز لازم در مسیر ریاضی را کسب کردی.',symbol:'◆',earned:true,points:200,category:'یادگیری',date:'۱۵ تیر ۱۴۰۴'}
  };
  const badge=badgeDefinitions[badgeId]||badgeDefinitions['week-streak'];
  const steps=[
   {title:'شروع ماجرا',description:'درس اول تکمیل شد',done:true},
   {title:'پیشرفت سریع',description:'سه درس در چهار روز',done:true},
   {title:'هدف محقق شد',description:'پنج درس در یک هفته',done:true},
   {title:'نشان دریافت شد',description:badge.date,done:badge.earned}
  ];

  const badgeDetailFont='"Vazirmatn", Tahoma, Arial, sans-serif';
  return <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',flexDirection:'column',gap:'16px',margin:0,padding:'20px clamp(14px,4vw,34px) 48px',color:'#202024',background:'#FFFAE0',fontFamily:badgeDetailFont}}>
   <header style={{boxSizing:'border-box',display:'grid',width:'100%',gridTemplateColumns:'44px minmax(0,1fr) 44px',alignItems:'center',gap:'10px',padding:'0 0 12px',borderBottom:'1px solid rgba(222,214,179,.72)'}}>
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/badges')} style={{boxSizing:'border-box',display:'grid',width:'44px',height:'44px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'13px',fontFamily:badgeDetailFont}}>
     <svg viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',width:'21px',height:'21px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <div><h1 style={{margin:0,fontFamily:badgeDetailFont,fontSize:'clamp(20px,3vw,28px)',fontWeight:900,lineHeight:1.5}}>جزئیات دستاورد</h1><small style={{color:'#777982',fontFamily:badgeDetailFont,fontSize:'9px'}}>دستاوردها / {badge.title}</small></div>
    <span/>
   </header>

   <article style={{boxSizing:'border-box',display:'flex',width:'100%',maxWidth:'720px',minWidth:0,flexDirection:'column',alignItems:'center',gap:'14px',margin:'0 auto',padding:'22px clamp(16px,4vw,34px)',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'22px',boxShadow:'0 14px 38px rgba(62,52,12,.09)',fontFamily:badgeDetailFont}}>
    <section style={{display:'flex',width:'100%',flexDirection:'column',alignItems:'center',gap:'7px',textAlign:'center'}}>
     <span aria-hidden="true" style={{display:'grid',width:'74px',height:'74px',placeItems:'center',color:'#8A7200',background:'#FFF7CE',border:'1px solid #F0D763',borderRadius:'50%',fontFamily:badgeDetailFont,fontSize:'30px',boxShadow:'0 8px 22px rgba(255,209,0,.14)'}}>{badge.symbol}</span>
     <em style={{padding:'5px 10px',color:badge.earned?'#21663D':'#765F00',background:badge.earned?'#E9F7EE':'#FFF7CE',borderRadius:'999px',fontFamily:badgeDetailFont,fontSize:'9px',fontStyle:'normal',fontWeight:900}}>{badge.earned?'دریافت‌شده':'در انتظار'}</em>
     <h2 style={{margin:'2px 0 0',fontFamily:badgeDetailFont,fontSize:'20px',fontWeight:900}}>{badge.title}</h2>
     <p style={{maxWidth:'520px',margin:0,color:'#777982',fontFamily:badgeDetailFont,fontSize:'11px',fontWeight:600,lineHeight:1.9}}>{badge.description}</p>
    </section>

    <section style={{display:'grid',width:'100%',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'8px'}}>
     {[{label:'تاریخ',value:badge.date},{label:'امتیاز',value:IrancellFormatPersianNumber(badge.points)},{label:'دسته‌بندی',value:badge.category}].map(item=><article key={item.label} style={{display:'flex',minWidth:0,flexDirection:'column',alignItems:'center',gap:'4px',padding:'12px 7px',background:'#F8F8F8',border:'1px solid #EEEEF0',borderRadius:'13px',textAlign:'center'}}><span style={{color:'#85858D',fontFamily:badgeDetailFont,fontSize:'8px',fontWeight:700}}>{item.label}</span><strong style={{fontFamily:badgeDetailFont,fontSize:'10px',fontWeight:900}}>{item.value}</strong></article>)}
    </section>

    <section style={{boxSizing:'border-box',display:'flex',width:'100%',flexDirection:'column',gap:'7px',padding:'14px 16px',background:'#FAFAFA',border:'1px solid #EEEEF0',borderRadius:'16px'}}>
     <h2 style={{margin:'0 0 5px',fontFamily:badgeDetailFont,fontSize:'13px',fontWeight:900}}>چگونه این نشان را دریافت کردی؟</h2>
     {steps.slice().reverse().map(step=><article key={step.title} style={{display:'grid',width:'100%',gridTemplateColumns:'28px minmax(0,1fr)',alignItems:'center',gap:'9px',padding:'7px 0'}}><span aria-hidden="true" style={{display:'grid',width:'26px',height:'26px',placeItems:'center',color:step.done?'#202024':'#85858D',background:step.done?'#FFD100':'#ECEDEF',borderRadius:'50%',fontSize:'10px',fontWeight:900}}>{step.done?'✓':'○'}</span><div style={{display:'flex',minWidth:0,flexDirection:'column',gap:'2px'}}><strong style={{fontFamily:badgeDetailFont,fontSize:'10px',fontWeight:900}}>{step.title}</strong><small style={{color:'#777982',fontFamily:badgeDetailFont,fontSize:'8px'}}>{step.description}</small></div></article>)}
    </section>

    <button type="button" onClick={()=>{if(typeof navigator!=='undefined'&&navigator.share)navigator.share({title:badge.title,text:badge.description}).catch(()=>{})}} style={{boxSizing:'border-box',display:'inline-flex',width:'100%',minHeight:'48px',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#171719',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'13px',fontFamily:badgeDetailFont,fontSize:'11px',fontWeight:900}}>اشتراک‌گذاری دستاورد</button>
    <button type="button" onClick={()=>onNavigate?.('student/badges')} style={{boxSizing:'border-box',display:'inline-flex',minHeight:'38px',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#6657D9',background:'transparent',border:0,borderRadius:'11px',fontFamily:badgeDetailFont,fontSize:'10px',fontWeight:800}}>مشاهده دستاورد مشابه</button>
   </article>
  </section>
 }

 if(route==='student/points'){
  const points=1250;
  const levelProgress=64;
  const earningRows=[
   {title:'تکمیل دوره‌ها',points:500,symbol:'▣'},
   {title:'حضور در کلاس زنده',points:300,symbol:'▣'},
   {title:'انجام تمرین‌ها',points:250,symbol:'✓'},
   {title:'دریافت نشان‌ها',points:150,symbol:'♙'},
   {title:'ثبت نظر مفید',points:50,symbol:'◯'}
  ];
  const levels=[
   {level:7,title:'یادگیرنده فعال',requirement:'۱۲۵۰ امتیاز فعلی',active:true},
   {level:8,title:'یادگیرنده حرفه‌ای',requirement:'۱۵۷۰ امتیاز',active:false},
   {level:9,title:'دانش‌آموز ممتاز',requirement:'۲۰۰۰ امتیاز',active:false},
   {level:10,title:'قهرمان یادگیری',requirement:'۳۰۰۰ امتیاز',active:false}
  ];

  return <section className="ir-student-subpage ir-points-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/achievements')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>امتیازها و سطح‌ها</h1>
    <span/>
   </header>

   <section className="ir-points-page__hero">
    <strong>سطح {IrancellFormatPersianNumber(7)}</strong>
    <h2>یادگیرنده فعال</h2>
    <p>☆ {IrancellFormatPersianNumber(points)} امتیاز</p>
    <div><span style={{width:`${levelProgress}%`}}/></div>
    <small>{IrancellFormatPersianNumber(320)} امتیاز تا سطح ۸</small>
   </section>

   <section className="ir-points-page__section">
    <h2>امتیازها را چگونه کسب کرده‌ای؟</h2>
    <div className="ir-points-page__earnings">
     {earningRows.map(row=><article key={row.title}>
      <span>{row.symbol}</span>
      <strong>{row.title}</strong>
      <em>{IrancellFormatPersianNumber(row.points)} امتیاز</em>
     </article>)}
    </div>
   </section>

   <section className="ir-points-page__section">
    <h2>سطح‌های بعدی</h2>
    <div className="ir-points-page__levels">
     {levels.map(row=><article key={row.level} className={row.active?'is-active':'is-locked'}>
      <span>{row.active?'★':'▣'}</span>
      <div><strong>سطح {IrancellFormatPersianNumber(row.level)} · {row.title}</strong><small>{row.requirement}</small></div>
      <em>{row.active?'فعال':'قفل'}</em>
     </article>)}
    </div>
   </section>

   <p className="ir-points-page__note">امتیازها انگیزشی هستند و در حال حاضر قابل تبدیل به پول نمی‌باشند.</p>
  </section>
 }

 if(route==='student/certificates'){
  const certificates=[
   {id:'math-7',type:'online',title:'ریاضی پایه هفتم',provider:'آموزشگاه ممتاز',teacher:'علی رضایی',date:'۱۵ تیر ۱۴۰۴',score:'۹۲ از ۱۰۰'},
   {id:'science',type:'live',title:'مبانی علوم تجربی',provider:'مدرس سارا محمدی',teacher:'سارا محمدی',date:'۱۰ تیر ۱۴۰۴',score:'۸۸ از ۱۰۰'},
   {id:'logic',type:'skill',title:'حل مسئله و تفکر منطقی',provider:'پلتفرم آموزشی ایرانسل',teacher:'گروه آموزشی',date:'۵ تیر ۱۴۰۴',score:'۹۵ از ۱۰۰'},
   {id:'english',type:'online',title:'زبان انگلیسی مقدماتی',provider:'آموزشگاه دانش',teacher:'مریم احمدی',date:'۲۹ خرداد ۱۴۰۴',score:'۹۰ از ۱۰۰'},
   {id:'study',type:'skill',title:'مهارت‌های مطالعه',provider:'پلتفرم آموزشی ایرانسل',teacher:'گروه آموزشی',date:'۲۰ خرداد ۱۴۰۴',score:'۹۴ از ۱۰۰'}
  ];
  const visibleCertificates=certificateFilter==='all'?certificates:certificates.filter(certificate=>certificate.type===certificateFilter);

  const certificatesFont='"Vazirmatn", Tahoma, Arial, sans-serif';
  const certificateFilters=[{id:'all',label:'همه'},{id:'online',label:'دوره‌های آنلاین'},{id:'live',label:'کلاس‌های زنده'},{id:'skill',label:'مهارت‌ها'}];
  return <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',flexDirection:'column',gap:'16px',margin:0,padding:'20px clamp(14px,4vw,34px) 48px',color:'#202024',background:'#FFFAE0',fontFamily:certificatesFont}}>
   <header style={{boxSizing:'border-box',display:'grid',width:'100%',gridTemplateColumns:'44px minmax(0,1fr) 44px',alignItems:'center',gap:'10px',padding:'0 0 12px',borderBottom:'1px solid rgba(222,214,179,.72)'}}>
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/achievements')} style={{boxSizing:'border-box',display:'grid',width:'44px',height:'44px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'13px',fontFamily:certificatesFont}}>
     <svg viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',width:'21px',height:'21px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <div><h1 style={{margin:0,fontFamily:certificatesFont,fontSize:'clamp(20px,3vw,28px)',fontWeight:900,lineHeight:1.5}}>گواهینامه‌های من</h1><small style={{color:'#777982',fontFamily:certificatesFont,fontSize:'9px'}}>دستاوردها / گواهینامه‌ها</small></div>
    <span/>
   </header>

   <article style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,flexDirection:'column',gap:'14px',padding:'clamp(16px,3vw,24px)',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'22px',boxShadow:'0 12px 34px rgba(62,52,12,.08)',fontFamily:certificatesFont}}>
    <h2 style={{margin:0,fontFamily:certificatesFont,fontSize:'15px',fontWeight:900}}>لیست گواهینامه‌های دریافت‌شده</h2>
    <nav aria-label="فیلتر گواهینامه‌ها" style={{display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'center',gap:'7px',padding:'0 0 3px'}}>
     {certificateFilters.map(filter=>{const active=certificateFilter===filter.id;return <button type="button" key={filter.id} aria-pressed={active} onClick={()=>setCertificateFilter(filter.id)} style={{boxSizing:'border-box',display:'inline-flex',minHeight:'34px',alignItems:'center',justifyContent:'center',margin:0,padding:'7px 13px',cursor:'pointer',color:'#202024',background:active?'#FFD100':'#F7F7F8',border:`1px solid ${active?'#E7BD00':'#E2E2E6'}`,borderRadius:'999px',fontFamily:certificatesFont,fontSize:'9px',fontWeight:active?900:700}}>{filter.label}</button>})}
    </nav>

    <div style={{display:'flex',width:'100%',minWidth:0,flexDirection:'column',gap:'8px'}}>
     {visibleCertificates.map(certificate=><button type="button" key={certificate.id} onClick={()=>onNavigate?.(`student/certificates/${certificate.id}`)} style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'center',gap:'11px',margin:0,padding:'10px 12px',cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #EEE9D4',borderRadius:'15px',fontFamily:certificatesFont,textAlign:'right'}}>
      <span aria-hidden="true" style={{display:'grid',width:'38px',minWidth:'38px',height:'38px',placeItems:'center',color:'#B08E00',background:'#FFF7CE',borderRadius:'50%',fontFamily:certificatesFont,fontSize:'18px'}}>♙</span>
      <div style={{display:'flex',minWidth:'150px',flex:'1 1 280px',flexDirection:'column',gap:'2px'}}>
       <strong style={{fontFamily:certificatesFont,fontSize:'11px',fontWeight:900}}>{certificate.title}</strong>
       <small style={{color:'#777982',fontFamily:certificatesFont,fontSize:'8px'}}>{certificate.provider}</small>
       <em style={{alignSelf:'flex-start',padding:'2px 6px',color:'#21663D',background:'#E9F7EE',borderRadius:'999px',fontFamily:certificatesFont,fontSize:'7px',fontStyle:'normal',fontWeight:800}}>معتبر</em>
      </div>
      <b style={{display:'inline-flex',minHeight:'34px',alignItems:'center',justifyContent:'center',padding:'7px 12px',color:'#171719',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'9px',fontFamily:certificatesFont,fontSize:'9px',fontWeight:900}}>مشاهده گواهینامه</b>
     </button>)}
     {!visibleCertificates.length&&<div role="status" style={{padding:'24px',color:'#777982',background:'#FAFAFA',border:'1px dashed #D9D4BF',borderRadius:'15px',fontFamily:certificatesFont,fontSize:'11px',textAlign:'center'}}>گواهینامه‌ای در این دسته ثبت نشده است.</div>}
    </div>
   </article>
  </section>
 }

 if(route==='student/certificates/:id'){
  const certificateId=params?.id||'math-7';
  const certificateMap={
   'math-7':{title:'ریاضی پایه هفتم',provider:'آموزشگاه ممتاز',teacher:'علی رضایی',date:'۱۵ تیر ۱۴۰۴',score:'۹۲ از ۱۰۰',code:'IR-EDU-1405-78452',skills:['حل معادلات','هندسه مقدماتی','تفکر مسئله‌محور']},
   science:{title:'مبانی علوم تجربی',provider:'آکادمی علوم',teacher:'سارا محمدی',date:'۱۰ تیر ۱۴۰۴',score:'۸۸ از ۱۰۰',code:'IR-EDU-1405-78471',skills:['آزمایش','انرژی','روش علمی']},
   logic:{title:'حل مسئله و تفکر منطقی',provider:'پلتفرم آموزشی ایرانسل',teacher:'گروه آموزشی',date:'۵ تیر ۱۴۰۴',score:'۹۵ از ۱۰۰',code:'IR-EDU-1405-78510',skills:['منطق','حل مسئله','تفکر تحلیلی']}
  };
  const certificate=certificateMap[certificateId]||certificateMap['math-7'];

  function downloadCertificate(){
   if(typeof document==='undefined')return;
   const text=`گواهینامه ${certificate.title}\nدانش‌آموز: ${user.name}\nمدرس: ${certificate.teacher}\nتاریخ: ${certificate.date}\nنمره نهایی: ${certificate.score}\nکد: ${certificate.code}`;
   const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
   const url=URL.createObjectURL(blob);
   const anchor=document.createElement('a');
   anchor.href=url;
   anchor.download=`${certificate.code}.txt`;
   anchor.click();
   URL.revokeObjectURL(url)
  }

  const certificateDetailFont='"Vazirmatn", Tahoma, Arial, sans-serif';
  const certificateActionStyle={boxSizing:'border-box',display:'inline-flex',width:'100%',minHeight:'44px',alignItems:'center',justifyContent:'center',margin:0,padding:'9px 12px',cursor:'pointer',borderRadius:'11px',fontFamily:certificateDetailFont,fontSize:'10px',fontWeight:900};
  return <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',flexDirection:'column',gap:'16px',margin:0,padding:'20px clamp(14px,4vw,34px) 48px',color:'#202024',background:'#FFFAE0',fontFamily:certificateDetailFont}}>
   <header style={{boxSizing:'border-box',display:'grid',width:'100%',gridTemplateColumns:'44px minmax(0,1fr) 44px',alignItems:'center',gap:'10px',padding:'0 0 12px',borderBottom:'1px solid rgba(222,214,179,.72)'}}>
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/certificates')} style={{boxSizing:'border-box',display:'grid',width:'44px',height:'44px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:'#202024',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'13px',fontFamily:certificateDetailFont}}>
     <svg viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',width:'21px',height:'21px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <div><h1 style={{margin:0,fontFamily:certificateDetailFont,fontSize:'clamp(20px,3vw,28px)',fontWeight:900,lineHeight:1.5}}>جزئیات گواهینامه</h1><small style={{color:'#777982',fontFamily:certificateDetailFont,fontSize:'9px'}}>دستاوردها / گواهینامه / {certificate.title}</small></div>
    <span/>
   </header>

   <div style={{display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'flex-start',gap:'14px'}}>
    <aside style={{boxSizing:'border-box',display:'flex',minWidth:'min(100%,220px)',flex:'1 1 220px',flexDirection:'column',gap:'10px',padding:'14px',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'18px',boxShadow:'0 10px 28px rgba(62,52,12,.07)',fontFamily:certificateDetailFont}}>
     <h2 style={{margin:0,fontFamily:certificateDetailFont,fontSize:'12px',fontWeight:900}}>به‌اشتراک‌گذاری و دریافت</h2>
     <button type="button" onClick={downloadCertificate} style={{...certificateActionStyle,color:'#171719',background:'#FFD100',border:'1px solid #E7BD00'}}>دانلود گواهینامه ↓</button>
     <button type="button" onClick={()=>{if(typeof navigator!=='undefined'&&navigator.share)navigator.share({title:certificate.title,text:`کد گواهینامه: ${certificate.code}`}).catch(()=>{})}} style={{...certificateActionStyle,color:'#202024',background:'#FFFFFF',border:'1px solid #DED9C4'}}>اشتراک‌گذاری ⤴</button>
     <button type="button" onClick={()=>setCertificateVerification(certificate.code)} style={{...certificateActionStyle,color:'#6657D9',background:'#F6F4FF',border:'1px solid #DCD5FF'}}>بررسی اعتبار گواهینامه</button>
     {certificateVerification===certificate.code&&<aside role="status" style={{display:'flex',flexDirection:'column',gap:'3px',padding:'10px',color:'#21663D',background:'#E9F7EE',border:'1px solid #BFE5CC',borderRadius:'11px',fontFamily:certificateDetailFont}}><strong style={{fontSize:'9px',fontWeight:900}}>گواهینامه معتبر است</strong><span style={{fontSize:'8px',lineHeight:1.8}}>کد {certificate.code} با اطلاعات این دانش‌آموز مطابقت دارد.</span></aside>}
    </aside>

    <article style={{boxSizing:'border-box',display:'flex',minWidth:'min(100%,360px)',flex:'2 1 540px',flexDirection:'column',alignItems:'stretch',gap:'12px',overflow:'hidden',background:'#FFFFFF',border:'1px solid #DDD7BC',borderRadius:'20px',boxShadow:'0 14px 40px rgba(62,52,12,.09)',fontFamily:certificateDetailFont}}>
     <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'clamp(20px,4vw,34px) clamp(16px,4vw,32px) 10px',textAlign:'center'}}>
      <small style={{color:'#777982',fontFamily:certificateDetailFont,fontSize:'9px',fontWeight:700}}>گواهینامه پایان دوره</small>
      <hr style={{width:'68px',height:'2px',margin:0,background:'#FFD100',border:0,borderRadius:'999px'}}/>
      <h2 style={{margin:'4px 0 0',fontFamily:certificateDetailFont,fontSize:'clamp(20px,3.2vw,30px)',fontWeight:900}}>{certificate.title}</h2>
      <span aria-hidden="true" style={{display:'grid',width:'48px',height:'48px',placeItems:'center',color:'#A28100',background:'#FFF7CE',border:'1px solid #F0D763',borderRadius:'50%',fontFamily:certificateDetailFont,fontSize:'22px'}}>⌁</span>
     </div>
     <dl style={{boxSizing:'border-box',display:'flex',width:'100%',flexDirection:'column',gap:0,margin:0,padding:'0 clamp(16px,4vw,32px)'}}>
      {[['دانش‌آموز:',user.name],['مؤسسه:',certificate.provider],['مدرس:',certificate.teacher],['تاریخ:',certificate.date],['نمره نهایی:',certificate.score],['کد گواهینامه:',certificate.code]].map(([label,value],index)=><div key={label} style={{display:'grid',width:'100%',gridTemplateColumns:'minmax(90px,.45fr) minmax(0,1fr)',alignItems:'center',gap:'10px',padding:'10px 0',borderBottom:index===5?0:'1px solid #EEE9D4'}}><dt style={{color:'#777982',fontFamily:certificateDetailFont,fontSize:'9px',fontWeight:700}}>{label}</dt><dd dir={label==='کد گواهینامه:'?'ltr':'rtl'} style={{margin:0,color:index===4?'#21663D':'#202024',fontFamily:certificateDetailFont,fontSize:'10px',fontWeight:900,textAlign:'right',overflowWrap:'anywhere'}}>{value}</dd></div>)}
     </dl>
     <section style={{display:'flex',flexDirection:'column',gap:'8px',padding:'2px clamp(16px,4vw,32px) 16px'}}>
      <h3 style={{margin:0,fontFamily:certificateDetailFont,fontSize:'11px',fontWeight:900}}>مهارت‌های کسب‌شده</h3>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>{certificate.skills.map(skill=><span key={skill} style={{padding:'5px 9px',color:'#4C4D53',background:'#F7F7F8',border:'1px solid #E2E2E6',borderRadius:'999px',fontFamily:certificateDetailFont,fontSize:'8px',fontWeight:700}}>{skill}</span>)}</div>
     </section>
     <footer style={{boxSizing:'border-box',display:'flex',width:'100%',minHeight:'42px',alignItems:'center',justifyContent:'center',padding:'10px 16px',color:'#171719',background:'#FFD100',borderTop:'1px solid #E7BD00',fontFamily:certificateDetailFont,fontSize:'10px',fontWeight:900}}>این گواهینامه معتبر است و امکان تأیید شده است ✓</footer>
    </article>
   </div>
  </section>
 }

 if(route==='student/privacy'){
  return <section className="ir-student-subpage ir-privacy-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/profile')}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>حریم خصوصی</h1>
    <span/>
   </header>

   <aside className="ir-privacy-page__trust">
    <span>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z"/><path d="m9 12 2 2 4-4"/></svg>
    </span>
    <div>
     <strong>اطلاعات شما تحت حفاظت است</strong>
     <p>تنظیمات حریم خصوصی به شما کمک می‌کند مشخص کنید چه اطلاعاتی قابل مشاهده یا قابل استفاده باشد.</p>
    </div>
   </aside>

   <section className="ir-privacy-page__group">
    <h2>حریم خصوصی حساب</h2>
    <div className="ir-privacy-page__list">
     <button type="button" onClick={()=>onNavigate?.('student/privacy/visibility')}>
      <span className="is-yellow">
       <svg viewBox="0 0 24 24"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
      </span>
      <div><strong>نمایش‌پذیری اطلاعات</strong><small>کنترل نمایش پروفایل و دستاوردها</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>

     <button type="button" onClick={()=>onNavigate?.('student/privacy/activity')}>
      <span className="is-green">
       <svg viewBox="0 0 24 24"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></svg>
      </span>
      <div><strong>فعالیت‌های اخیر</strong><small>ورودها، تغییرات حساب و فعالیت آموزشی</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>

     <button type="button" onClick={()=>onNavigate?.('student/privacy/chisti')}>
      <span className="is-blue">
       <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4Z"/><path d="M8 9h8M8 13h6"/></svg>
      </span>
      <div><strong>حریم خصوصی چیستی</strong><small>پرسش‌ها، تاریخچه و فایل‌های بارگذاری‌شده</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>
    </div>
   </section>

   <section className="ir-privacy-page__group">
    <h2>داده‌ها و امنیت</h2>
    <div className="ir-privacy-page__list">
     <button type="button" onClick={()=>onNavigate?.('student/privacy/stored-data')}>
      <span className="is-yellow">
       <svg viewBox="0 0 24 24"><path d="M5 4h14v16H5Z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
      </span>
      <div><strong>اطلاعات ذخیره‌شده</strong><small>مشاهده دسته‌های اطلاعات نگه‌داری‌شده</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>

     <button type="button" onClick={()=>onNavigate?.('student/privacy/sharing')}>
      <span className="is-green">
       <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/></svg>
      </span>
      <div><strong>اشتراک‌گذاری اطلاعات</strong><small>خانواده، مدرس، آموزشگاه و خدمات هوشمند</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>

     <button type="button" onClick={()=>onNavigate?.('student/privacy/export')}>
      <span className="is-purple">
       <svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M5 19h14"/></svg>
      </span>
      <div><strong>دریافت نسخه اطلاعات</strong><small>درخواست امن خروجی از داده‌های قابل ارائه</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>

     <button type="button" onClick={()=>onNavigate?.('student/privacy/delete')}>
      <span className="is-red">
       <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></svg>
      </span>
      <div><strong>مدیریت و حذف داده‌ها</strong><small>عملیات حساس با تأیید خانواده انجام می‌شود</small></div>
      <svg className="ir-privacy-page__arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
     </button>
    </div>
   </section>

   <footer className="ir-privacy-page__footer">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z"/></svg>
    <span>تنظیمات حساس و حذف اطلاعات محافظت‌شده بدون تأیید مجاز انجام نمی‌شود.</span>
   </footer>
  </section>
 }

 if(route==='student/privacy/visibility'){
  const visibilityRows=[
   {key:'displayNameVisible',title:'نام نمایشی',description:'استفاده از نام مستعار به جای نام کامل'},
   {key:'avatarVisible',title:'تصویر پروفایل',description:'نمایش آواتار انتخابی برای سایر کاربران'},
   {key:'gradeVisible',title:'پایه تحصیلی',description:'مشاهده مقطع تحصیلی در نتایج جستجو'},
   {key:'achievementsVisible',title:'دستاوردها',description:'نمایش نشان‌ها و جوایز کسب‌شده'},
   {key:'completedCoursesVisible',title:'دوره‌های تکمیل‌شده',description:'لیست آموزش‌هایی که با موفقیت گذرانده‌ای'},
   {key:'certificatesVisible',title:'گواهینامه‌ها',description:'نمایش مدارک پایان دوره در پروفایل عمومی'}
  ];

  return <section className="ir-student-subpage ir-privacy-settings-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>نمایش پروفایل</h1>
    <span/>
   </header>

   <p className="ir-privacy-settings-page__intro">انتخاب کن کدام اطلاعات عمومی پروفایل برای کاربران دیگر قابل مشاهده باشد.</p>

   <div className="ir-privacy-settings-page__list">
    {visibilityRows.map(row=><article key={row.key}>
     <div><strong>{row.title}</strong><p>{row.description}</p></div>
     <button type="button" role="switch" aria-checked={Boolean(privacyDraft[row.key])} className={privacyDraft[row.key]?'is-on':''} onClick={()=>togglePrivacySetting(row.key)}><span/></button>
    </article>)}
   </div>

   <aside className="ir-privacy-settings-page__note">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z"/></svg>
    <p><strong>اطلاعات هویتی</strong><br/>نام کامل، شماره تماس، اطلاعات خانواده و داده‌های حساس برای سایر کاربران نمایش داده نمی‌شوند.</p>
   </aside>

   {privacySaved&&<p className="ir-privacy-settings-page__saved" role="status">تغییرات با موفقیت ذخیره شد.</p>}
   <button type="button" className="ir-student-subpage__primary" onClick={savePrivacySettings}>ذخیره تغییرات</button>
  </section>
 }

 if(route==='student/privacy/activity'){
  const requiredRows=[
   {title:'نمایش پیشرفت دوره‌ها',description:'وضعیت گذراندن جلسات آموزشی',locked:true},
   {title:'نمایش تکالیف به مدرس',description:'ارسال پاسخ‌های شما برای تصحیح و بازخورد',locked:true},
   {title:'اشتراک پیشرفت با خانواده',description:'ارسال گزارش تحصیلی به پنل والد',locked:true},
   {title:'نمایش دستاوردها به همکلاسی‌ها',description:'مشاهده رتبه شما در جدول یک کلاس',locked:false,key:'siblingAchievementsVisible'},
   {title:'نمایش وضعیت حضور در کلاس',description:'ثبت زمان ورود و خروج به کلاس‌های آنلاین',locked:true}
  ];

  return <section className="ir-student-subpage ir-privacy-activity-settings-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>فعالیت‌های آموزشی</h1>
    <span/>
   </header>

   <div className="ir-privacy-activity-settings-page__list">
    {requiredRows.map(row=><article key={row.title}>
     <div>
      <strong>{row.title}</strong>
      <p>{row.description}</p>
     </div>
     {row.locked?<span className="ir-privacy-activity-settings-page__locked">
      <svg viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
      الزامی برای ارائه خدمت
     </span>:<button type="button" role="switch" aria-checked={Boolean(privacyDraft[row.key])} className={privacyDraft[row.key]?'is-on':''} onClick={()=>togglePrivacySetting(row.key)}><span/></button>}
    </article>)}
   </div>

   <aside className="ir-privacy-settings-page__note">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
    <p>برخی اطلاعات آموزشی برای برگزاری کلاس، ارزیابی و ارائه گزارش به خانواده ضروری است.</p>
   </aside>

   {privacySaved&&<p className="ir-privacy-settings-page__saved">تنظیمات ذخیره شد.</p>}
   <button type="button" className="ir-student-subpage__primary" onClick={savePrivacySettings}>ذخیره تغییرات</button>
  </section>
 }

 if(route==='student/privacy/stored-data'){
  const storedGroups=[
   {id:'account',title:'اطلاعات حساب',description:'اطلاعات پایه پروفایل و حساب کاربری',items:['نام نمایشی','پایه تحصیلی','تصویر پروفایل','نقش کاربری']},
   {id:'learning',title:'فعالیت‌های آموزشی',description:'سوابق حضور در کلاس‌ها و دوره‌ها',items:['پیشرفت دوره‌ها','کلاس‌های رزروشده','تکالیف و نتایج']},
   {id:'chisti',title:'فعالیت‌های چیستی',description:'سابقه تعامل با هوش مصنوعی',items:['پرسش‌های ذخیره‌شده','پاسخ‌ها','فایل‌های مرتبط']},
   {id:'technical',title:'اطلاعات فنی',description:'گزارش‌های ورود و دستگاه‌های متصل',items:['نوع دستگاه','نشست‌های حساب','رخدادهای امنیتی']}
  ];

  return <section className="ir-student-subpage ir-privacy-stored-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>اطلاعات ذخیره‌شده</h1>
    <span/>
   </header>

   <div className="ir-privacy-stored-page__list">
    {storedGroups.map(group=><article key={group.id} className={privacyStoredOpen===group.id?'is-open':''}>
     <button type="button" onClick={()=>setPrivacyStoredOpen(current=>current===group.id?'':group.id)}>
      <span>{group.id==='account'?'○':group.id==='learning'?'▣':group.id==='chisti'?'✦':'□'}</span>
      <div><strong>{group.title}</strong><small>{group.description}</small></div>
      <b>{privacyStoredOpen===group.id?'⌄':'‹'}</b>
     </button>
     {privacyStoredOpen===group.id&&<ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul>}
    </article>)}
   </div>

   <aside className="ir-privacy-stored-page__note">اطلاعات فقط برای ارائه خدمات آموزشی، امنیت حساب و بهبود تجربه یادگیری استفاده می‌شود.</aside>
  </section>
 }

 if(route==='student/privacy/sharing'){
  const sharingRows=[
   {id:'family',title:'خانواده',description:'والد یا سرپرست می‌تواند گزارش‌های آموزشی، پرداخت‌ها و وضعیت‌ها را مشاهده کند.',status:'فعال',locked:true},
   {id:'teacher',title:'مدرس',description:'دسترسی به اطلاعات موردنیاز برای برگزاری کلاس و ارزیابی',status:'جزئیات',expanded:true},
   {id:'academy',title:'آموزشگاه',description:'مشاهده اطلاعات مرتبط با خدمات رزروشده',status:'جزئیات'},
   {id:'ai',title:'خدمات هوشمند',description:'استفاده از پرسش‌ها برای پیشنهاد محتوای مرتبط',status:'جزئیات'},
   {id:'ads',title:'استفاده تبلیغاتی',description:'اطلاعات دانش‌آموز برای تبلیغات شخصی استفاده نمی‌شود.',status:'غیرفعال',toggle:true}
  ];

  return <section className="ir-student-subpage ir-privacy-sharing-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>اشتراک‌گذاری اطلاعات</h1>
    <span/>
   </header>

   <div className="ir-privacy-sharing-page__list">
    {sharingRows.map(row=><article key={row.id} className={row.expanded?'is-expanded':''}>
     <header>
      <span>{row.id==='family'?'○':row.id==='teacher'?'○':row.id==='academy'?'▦':row.id==='ai'?'✦':'◉'}</span>
      <div><strong>{row.title}</strong><p>{row.description}</p></div>
      {row.toggle?<button type="button" role="switch" aria-checked={privacyDraft.advertisingUse} className={privacyDraft.advertisingUse?'is-on':''} onClick={()=>togglePrivacySetting('advertisingUse')}><i/></button>:<em>{row.status}</em>}
     </header>
     {row.expanded&&<ul>
      <li>نام نمایشی</li>
      <li>پایه تحصیلی</li>
      <li>تکالیف و پیشرفت دوره</li>
      <li>حضور در کلاس</li>
     </ul>}
    </article>)}
   </div>

   <p className="ir-privacy-sharing-page__footer">جهت‌گیری حریم خصوصی این حساب بر پایه حداقل دسترسی لازم برای ارائه خدمت است.</p>
  </section>
 }

 if(route==='student/privacy/chisti'){
  return <section className="ir-student-subpage ir-privacy-chisti-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>حریم خصوصی ایرانسل</h1>
    <span/>
   </header>

   <aside className="ir-privacy-chisti-page__hero">
    <span>✦</span>
    <div><strong>پرسش‌ها و فایل‌های شما</strong><p>چیستی برای پاسخ‌گویی، محتوای پرسش و فایل‌های بارگذاری‌شده را پردازش می‌کند.</p></div>
   </aside>

   <div className="ir-privacy-chisti-page__settings">
    <article>
     <div><strong>ذخیره تاریخچه پرسش‌ها</strong><small>دسترسی به پرسش‌های قبلی برای ورود مجدد</small></div>
     <button type="button" role="switch" className={privacyDraft.chistiHistoryEnabled?'is-on':''} onClick={()=>togglePrivacySetting('chistiHistoryEnabled')}><span/></button>
    </article>
    <article>
     <div><strong>استفاده برای پیشنهاد آموزشی</strong><small>شخصی‌سازی محتوای مرتبط براساس سابقه شما</small></div>
     <button type="button" role="switch" className={privacyDraft.chistiPersonalization?'is-on':''} onClick={()=>togglePrivacySetting('chistiPersonalization')}><span/></button>
    </article>
    <article>
     <div><strong>ذخیره فایل‌های بارگذاری‌شده</strong><small>نگهداری تصاویر و اسناد در حساب کاربری</small></div>
     <button type="button" role="switch" className={privacyDraft.chistiFilesEnabled?'is-on':''} onClick={()=>togglePrivacySetting('chistiFilesEnabled')}><span/></button>
    </article>
    <article>
     <div><strong>حذف خودکار فایل‌ها</strong><small>حذف خودکار فایل‌ها پس از ۳۰ روز</small></div>
     <button type="button" role="switch" className={privacyDraft.chistiAutoDelete?'is-on':''} onClick={()=>togglePrivacySetting('chistiAutoDelete')}><span/></button>
    </article>
   </div>

   <button type="button" className="ir-privacy-chisti-page__history" onClick={()=>onNavigate?.('student/chisti/history')}>
    <span>تاریخچه چیستی</span>
    <small>مدیریت پرسش‌ها و سوابق تعامل</small>
    <b>مشاهده</b>
   </button>

   <button type="button" className="ir-privacy-chisti-page__clear" onClick={()=>onNavigate?.('student/privacy/parent-gate',{action:'chisti-history-delete',next:'student/privacy/delete/history-confirm',categories:'chisti'})}>پاک کردن تاریخچه چیستی</button>
   <button type="button" className="ir-privacy-chisti-page__save" onClick={savePrivacySettings}>ذخیره تنظیمات</button>
  </section>
 }

 if(route==='student/privacy/export'){
  const exportRows=[
   {key:'profile',label:'اطلاعات پروفایل'},
   {key:'courses',label:'دوره‌ها و کلاس‌ها'},
   {key:'assignments',label:'تکالیف و نتایج'},
   {key:'certificates',label:'گواهینامه‌ها و دستاوردها'},
   {key:'chisti',label:'تاریخچه چیستی'},
   {key:'files',label:'تصاویر و فایل‌های بارگذاری‌شده'}
  ];

  return <section className="ir-student-subpage ir-privacy-export-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>دریافت نسخه اطلاعات</h1>
    <span/>
   </header>

   <aside className="ir-privacy-export-page__intro">می‌توانی یک نسخه از اطلاعات حساب و فعالیت‌های آموزشی خود دریافت کنی.</aside>

   <h2>دسته‌بندی اطلاعات</h2>
   <div className="ir-privacy-export-page__categories">
    {exportRows.map(row=><label key={row.key}>
     <input type="checkbox" checked={Boolean(exportSelections[row.key])} onChange={()=>setExportSelections(current=>({...current,[row.key]:!current[row.key]}))}/>
     <span>{row.label}</span>
    </label>)}
   </div>

   <h2>فرمت فایل</h2>
   <div className="ir-privacy-export-page__formats">
    <label><input type="radio" name="export-format" checked={exportFormat==='zip'} onChange={()=>setExportFormat('zip')}/><span>ZIP</span></label>
    <label><input type="radio" name="export-format" checked={exportFormat==='pdf'} onChange={()=>setExportFormat('pdf')}/><span>PDF</span></label>
   </div>

   <aside className="ir-privacy-export-page__note">آماده‌سازی فایل ممکن است زمان ببرد. پس از آماده‌شدن، نتیجه از طریق اعلان حساب اطلاع داده می‌شود.</aside>
   <button type="button" className="ir-student-subpage__primary" disabled={!Object.values(exportSelections).some(Boolean)} onClick={submitPrivacyExport}>ثبت درخواست دریافت اطلاعات</button>
  </section>
 }

 if(route==='student/privacy/delete'){
  return <section className="ir-student-subpage ir-privacy-delete-home">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>حذف اطلاعات یا حساب</h1>
    <span/>
   </header>

   <aside className="ir-privacy-delete-home__warning">
    <strong>این عملیات حساس است</strong>
    <p>حذف برخی اطلاعات ممکن است باعث از دست رفتن سابقه آموزشی، فایل‌ها یا دسترسی به خدمات شود.</p>
   </aside>

   <h2>انتخاب نوع حذف</h2>
   <div className="ir-privacy-delete-home__choices">
    <button type="button" onClick={()=>onNavigate?.('student/privacy/delete/select')}>
     <span>▤</span>
     <div><strong>حذف بخشی از اطلاعات</strong><small>انتخاب و حذف تاریخچه چیستی، فایل‌ها یا فعالیت‌های مشخص</small></div>
     <b>‹</b>
    </button>
    <button type="button" className="is-danger" onClick={()=>onNavigate?.('student/privacy/delete/account')}>
     <span>□</span>
     <div><strong>درخواست حذف حساب</strong><small>ارسال درخواست حذف کامل حساب دانش‌آموز</small></div>
     <b>‹</b>
    </button>
   </div>

   <p className="ir-privacy-delete-home__footer">حذف حساب دانش‌آموز فقط با تأیید والد یا سرپرست و پس از بررسی تعهدات فعال انجام می‌شود.</p>
  </section>
 }

 if(route==='student/privacy/delete/select'){
  const rows=[
   {key:'chisti',label:'تاریخچه چیستی'},
   {key:'uploadedFiles',label:'فایل‌های بارگذاری‌شده'},
   {key:'searchHistory',label:'سابقه جست‌وجو'},
   {key:'personalizedRecommendations',label:'پیشنهادهای شخصی‌سازی‌شده'}
  ];
  const protectedRows=['سوابق مالی','رضایت‌نامه‌های قانونی','اطلاعات کلاس‌های در حال برگزاری','گزارش‌های امنیتی ضروری'];

  return <section className="ir-student-subpage ir-privacy-select-delete-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy/delete')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>انتخاب اطلاعات برای حذف</h1>
    <span/>
   </header>

   <p className="ir-privacy-select-delete-page__intro">اطلاعات قابل حذف</p>

   <div className="ir-privacy-select-delete-page__list">
    {rows.map(row=><label key={row.key}>
     <input type="checkbox" checked={Boolean(deleteSelections[row.key])} onChange={()=>setDeleteSelections(current=>({...current,[row.key]:!current[row.key]}))}/>
     <span>{row.label}</span>
    </label>)}
   </div>

   <aside className="ir-privacy-select-delete-page__locked">
    <strong>اطلاعات محافظت‌شده (غیرقابل حذف)</strong>
    {protectedRows.map(item=><span key={item}>{item}</span>)}
   </aside>

   <button type="button" className="ir-privacy-select-delete-page__danger" disabled={!Object.values(deleteSelections).some(Boolean)} onClick={submitPartialDeletion}>ادامه حذف</button>
  </section>
 }

 if(route==='student/privacy/delete/account'){
  const reasons=['دیگر از برنامه استفاده نمی‌کنم','حساب دیگری دارم','نگرانی درباره حریم خصوصی','مشکل در استفاده از برنامه','دلیل دیگر'];

  return <section className="ir-student-subpage ir-delete-account-page">
   <header className="ir-student-subpage__topbar">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/privacy/delete')}>
     <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>درخواست حذف حساب</h1>
    <span/>
   </header>

   <aside className="ir-delete-account-page__warning">
    <strong>توجه: پیامدهای حذف حساب</strong>
    <ul>
     <li>دسترسی به دوره‌ها و کلاس‌ها متوقف می‌شود</li>
     <li>تاریخچه آموزشی ممکن است حذف شود</li>
     <li>فایل‌ها و پاسخ‌های ذخیره‌شده حذف می‌شوند</li>
     <li>گواهینامه‌ها و سوابق قانونی طبق قوانین نگهداری می‌شوند</li>
     <li>کلاس‌ها یا پرداخت‌های فعال باید ابتدا تعیین تکلیف شوند</li>
    </ul>
   </aside>

   <h2>دلیل حذف حساب</h2>
   <div className="ir-delete-account-page__reasons">
    {reasons.map(reason=><label key={reason}>
     <input type="radio" name="delete-reason" checked={deleteReason===reason} onChange={()=>setDeleteReason(reason)}/>
     <span>{reason}</span>
    </label>)}
    <textarea rows={3} disabled={deleteReason!=='دلیل دیگر'} value={deleteReasonDetail} onChange={event=>setDeleteReasonDetail(event.target.value)} placeholder="توضیحات بیشتر"/>
   </div>

   <label className="ir-delete-account-page__ack">
    <input type="checkbox" checked={deleteAcknowledged} onChange={()=>setDeleteAcknowledged(value=>!value)}/>
    <span>پیامدهای حذف حساب را خواندم و متوجه شدم.</span>
   </label>

   <button type="button" className="ir-delete-account-page__submit" disabled={!deleteAcknowledged||(deleteReason==='دلیل دیگر'&&!deleteReasonDetail.trim())} onClick={submitAccountDeletion}>ارسال درخواست حذف حساب</button>
  </section>
 }

 if(route==='student/privacy/parent-gate'){
  const gateError=parentGateSubmitted&&!state.ui?.parentGate?.verifiedAt?state.ui?.fieldErrors?.parentGate||'کد تأیید والد یا سرپرست را بررسی کن.':'';
  const relationship=Object.values(state.identity.relationshipsById||{}).find(item=>item.childId===studentId&&item.status==='active');
  const parentUser=relationship?state.identity.usersById?.[relationship.parentId]:null;
  const parentMobile=String(parentUser?.mobile||'').replace(/\D/g,'');
  const maskedMobile=parentMobile.length>6?`${parentMobile.slice(0,4)}***${parentMobile.slice(-3)}`:'';
  const expectedLength=Math.max(4,String(IRANCELL_APP_CONFIG.otpCode||'12345').replace(/\D/g,'').length||5);
  const cancelRoute=params?.action==='account-delete'?'student/privacy/delete/account':params?.action==='chisti-history-delete'?'student/privacy/chisti':'student/privacy/delete/select';
  const backgroundTitle=params?.action==='account-delete'?'درخواست حذف حساب':params?.action==='chisti-history-delete'?'پاک کردن تاریخچه چیستی':'حذف اطلاعات';

  return <section className="ir-parent-gate-page">
   <div className="ir-parent-gate-page__background" aria-hidden="true"><h1>{backgroundTitle}</h1></div>

   <section className="ir-parent-gate-page__sheet" role="dialog" aria-modal="true" aria-labelledby="privacy-parent-gate-title">
    <span className="ir-parent-gate-page__handle"/>
    <span className="ir-parent-gate-page__icon">◎</span>
    {!parentGateOtpSent?<>
     <h2 id="privacy-parent-gate-title">تأیید والد یا سرپرست</h2>
     <p>برای انجام این تغییر، یک کد یک‌بارمصرف برای والد یا سرپرست ارسال می‌شود.{maskedMobile?` شماره مقصد: ${maskedMobile}`:''}</p>
     <button type="button" className="ir-parent-gate-page__primary" onClick={()=>{setParentGateOtpSent(true);setParentGateCode('');setParentGateSubmitted(false)}}>ارسال کد یک‌بارمصرف</button>
     <button type="button" className="ir-parent-gate-page__cancel" onClick={()=>onNavigate?.(cancelRoute)}>انصراف</button>
    </>:<>
     <h2 id="privacy-parent-gate-title">تأیید کد یک‌بارمصرف</h2>
     <p>کد ارسال‌شده را وارد کن تا عملیات حساس ادامه پیدا کند.</p>
     <label>
      <span>کد یک‌بارمصرف</span>
      <input type="tel" inputMode="numeric" autoComplete="one-time-code" autoFocus dir="ltr" maxLength={expectedLength} value={parentGateCode} onChange={event=>{setParentGateCode(event.target.value.replace(/\D/g,'').slice(0,expectedLength));setParentGateSubmitted(false)}} placeholder={Array(expectedLength).fill('•').join(' ')}/>
     </label>
     {gateError&&<small className="ir-parent-gate-page__error" role="alert">{gateError}</small>}
     <button type="button" className="ir-parent-gate-page__primary" disabled={parentGateCode.length<expectedLength} onClick={verifyPrivacyParentGate}>تأیید</button>
     <button type="button" className="ir-parent-gate-page__cancel" onClick={()=>onNavigate?.(cancelRoute)}>انصراف</button>
    </>}
   </section>
  </section>
 }

 if(route==='student/privacy/delete/history-confirm'){
  const categories=String(params?.categories||'chisti').split(',').filter(Boolean);
  const isChistiOnly=categories.length===1&&categories[0]==='chisti';

  function confirmPartialDelete(){
   dispatch({type:'IRANCELL_STUDENT_PRIVACY_DELETE_REQUEST',userId:studentId,kind:'partial',categories});
   onNavigate?.('student/privacy/success',{kind:'delete'})
  }

  return <section className="ir-privacy-confirm-page">
   <div className="ir-privacy-confirm-page__background"/>
   <section className="ir-privacy-confirm-page__sheet" role="dialog" aria-modal="true">
    <span className="ir-privacy-confirm-page__danger-icon">△</span>
    <h2>{isChistiOnly?'تاریخچه چیستی پاک شود؟':'اطلاعات انتخاب‌شده حذف شوند؟'}</h2>
    <p>{isChistiOnly?'بعد از پاک شدن تاریخچه، امکان بازیابی پرسش‌ها و پاسخ‌های حذف‌شده وجود ندارد.':'پس از تأیید، درخواست حذف اطلاعات انتخاب‌شده ثبت می‌شود و بخشی از آن‌ها قابل بازیابی نخواهد بود.'}</p>
    <button type="button" className="is-danger" onClick={confirmPartialDelete}>{isChistiOnly?'پاک کردن تاریخچه':'ادامه حذف'}</button>
    <button type="button" onClick={()=>onNavigate?.(isChistiOnly?'student/privacy/chisti':'student/privacy/delete/select')}>انصراف</button>
   </section>
  </section>
 }

 if(route==='student/privacy/delete/account-confirm'){
  function confirmAccountDelete(){
   dispatch({type:'IRANCELL_STUDENT_PRIVACY_DELETE_REQUEST',userId:studentId,kind:'account',reason:params?.reason||deleteReason});
   onNavigate?.('student/privacy/success',{kind:'account'})
  }

  return <section className="ir-privacy-confirm-page">
   <div className="ir-privacy-confirm-page__background"/>
   <section className="ir-privacy-confirm-page__sheet" role="dialog" aria-modal="true">
    <span className="ir-privacy-confirm-page__danger-icon">△</span>
    <h2>درخواست حذف حساب ارسال شود؟</h2>
    <p>درخواست برای بررسی و تأیید نهایی ارسال می‌شود و از طریق اعلان به خانواده اطلاع داده خواهد شد.</p>
    <button type="button" className="is-danger" onClick={confirmAccountDelete}>ارسال درخواست</button>
    <button type="button" onClick={()=>onNavigate?.('student/privacy/delete/account')}>انصراف</button>
   </section>
  </section>
 }

 if(route==='student/privacy/success'){
  const kind=params?.kind||'export';
  const isExport=kind==='export';
  const title=isExport?'درخواست دریافت اطلاعات ثبت شد':'درخواست ثبت شد';
  const description=isExport?'پس از آماده‌شدن نسخه اطلاعات، از طریق اعلان حساب مطلع می‌شوی.':'درخواست شما ثبت شد و از طریق اعلان به والد یا سرپرست اطلاع داده می‌شود.';

  return <section className="ir-student-subpage ir-student-success-page">
   <header className="ir-student-subpage__topbar"><span/><h1>{isExport?'تأیید درخواست':'تأیید درخواست'}</h1><span/></header>
   <div className="ir-student-success-page__content">
    <span>✓</span>
    <h1>{title}</h1>
    <p>{description}</p>
    <button type="button" onClick={()=>onNavigate?.(isExport?'student/privacy':'student/profile')}>{isExport?'بازگشت به حریم خصوصی':'بازگشت به پروفایل'}</button>
   </div>
  </section>
 }

 if(route==='student/profile/edit'){
  return <section className="ir-student-profile-edit-page">
   <header className="ir-student-profile-edit-page__header">
    <button type="button" aria-label="بازگشت به پروفایل" onClick={()=>onNavigate?.('student/profile')}>
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
    </button>
    <h1>ویرایش پروفایل</h1>
   </header>

   <button type="button" className="ir-student-profile-edit-page__avatar-button" aria-label="تغییر تصویر پروفایل" onClick={()=>onNavigate?.('student/profile/photo',{return:'edit'})}>
    {renderProfileAvatar('ir-student-profile-edit-page__avatar',user.name)}
    <i aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M4 8h4l2-3h4l2 3h4v11H4Z"/><circle cx="12" cy="13" r="3"/></svg>
    </i>
   </button>

   <aside className="ir-student-profile-edit-page__family-notice">
    <span aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z"/></svg>
    </span>
    <div>
     <strong>تأیید خانواده الزامی است</strong>
     <p>هر تغییری نیاز به تأیید یا کد OTP ارسال شده به شماره خانواده دارد</p>
    </div>
   </aside>

   <form className="ir-student-profile-edit-page__form" onSubmit={saveProfile} noValidate>
    <label>
     <span>نام</span>
     <input value={profileForm.firstName} onChange={event=>updateProfileField('firstName',event.target.value)} autoComplete="given-name"/>
    </label>

    <label>
     <span>نام خانوادگی</span>
     <input value={profileForm.familyName} onChange={event=>updateProfileField('familyName',event.target.value)} autoComplete="family-name"/>
    </label>

    <label>
     <span>شماره تلفن</span>
     <input type="tel" inputMode="numeric" dir="ltr" maxLength={11} value={profileForm.mobile} onChange={event=>updateProfileField('mobile',event.target.value)} autoComplete="tel"/>
    </label>

    <label>
     <span>ایمیل</span>
     <input type="email" dir="ltr" value={profileForm.email} onChange={event=>updateProfileField('email',event.target.value)} autoComplete="email"/>
    </label>

    <label>
     <span>پایه تحصیلی</span>
     <span className="ir-student-profile-edit-page__select">
      <select value={profileForm.grade} onChange={event=>updateProfileField('grade',event.target.value)}>
       {['هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم'].map(item=><option key={item} value={item}>{item}</option>)}
      </select>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>
     </span>
    </label>

    {profileFormError&&<p className="ir-student-profile-edit-page__error" role="alert">{profileFormError}</p>}

    <button type="submit" className="ir-student-profile-edit-page__submit">ادامه و تأیید خانواده</button>
   </form>
  </section>
 }

 if(route==='student/profile/photo'){
  return <section className="ir-student-profile-photo-page" onClick={()=>onNavigate?.(photoReturnRoute)}>
   <div className="ir-student-profile-photo-page__backdrop" aria-hidden="true">
    <header>
     <h1>پروفایل</h1>
     <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></svg>
    </header>
    {renderProfileAvatar('ir-student-profile-photo-page__backdrop-avatar',user.name)}
   </div>

   <section className="ir-student-profile-photo-page__sheet" role="dialog" aria-modal="true" aria-labelledby="irancell-student-photo-title" onClick={event=>event.stopPropagation()}>
    <span className="ir-student-profile-photo-page__handle" aria-hidden="true"/>
    <h1 id="irancell-student-photo-title">ویرایش تصویر پروفایل</h1>

    {renderProfileAvatar('ir-student-profile-photo-page__preview',user.name)}

    <div className="ir-student-profile-photo-page__actions">
     <button type="button" onClick={()=>galleryInputRef.current?.click()}>
      <span aria-hidden="true">
       <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18M16 3v18"/></svg>
      </span>
      <strong>انتخاب از گالری</strong>
      <svg className="ir-student-profile-photo-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
     </button>

     <button type="button" onClick={()=>cameraInputRef.current?.click()}>
      <span aria-hidden="true">
       <svg viewBox="0 0 24 24"><path d="M4 8h4l2-3h4l2 3h4v11H4Z"/><circle cx="12" cy="13" r="3"/></svg>
      </span>
      <strong>عکس جدید بگیر</strong>
      <svg className="ir-student-profile-photo-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
     </button>
    </div>

    {photoError&&<p className="ir-student-profile-photo-page__error" role="alert">{photoError}</p>}

    <button type="button" className="ir-student-profile-photo-page__remove" onClick={removeProfilePhoto}>حذف تصویر فعلی</button>

    <input ref={galleryInputRef} type="file" accept="image/*" hidden onChange={event=>persistProfilePhoto(event.target.files?.[0])}/>
    <input ref={cameraInputRef} type="file" accept="image/*" capture="user" hidden onChange={event=>persistProfilePhoto(event.target.files?.[0])}/>
   </section>
  </section>
 }

 return <section className="ir-student-profile-main-page">
  <header className="ir-student-profile-main-page__header">
   <h1>پروفایل</h1>
  </header>

  <section className="ir-student-profile-main-page__identity">
   <button type="button" className="ir-student-profile-main-page__avatar-button" aria-label="ویرایش تصویر پروفایل" onClick={()=>onNavigate?.('student/profile/photo')}>
    {renderProfileAvatar('ir-student-profile-main-page__avatar',user.name)}
   </button>
   <h2>{user.name}</h2>
   <p>دانش‌آموز {gradeLabel}</p>
  </section>

  <section className="ir-student-profile-main-page__metrics" aria-label="خلاصه یادگیری">
   <article>
    <strong>{IrancellFormatPersianNumber(courseCount)}</strong>
    <span>دوره‌ها</span>
   </article>
   <article>
    <strong>{IrancellFormatPersianNumber(completedCourseCount)}</strong>
    <span>تکمیل‌شده</span>
   </article>
   <article>
    <strong>{IrancellFormatPersianNumber(certificateCount)}</strong>
    <span>گواهینامه</span>
   </article>
  </section>

  <section className="ir-student-profile-main-page__menu">
   <button type="button" onClick={()=>onNavigate?.('student/profile/edit')}>
    <span className="is-yellow" aria-hidden="true">
     <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></svg>
    </span>
    <strong>ویرایش پروفایل</strong>
    <svg className="ir-student-profile-main-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
   </button>

   <button type="button" onClick={()=>onNavigate?.('student/binayi/my-courses')}>
    <span className="is-yellow" aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23Z"/></svg>
    </span>
    <strong>دوره‌های من</strong>
    <svg className="ir-student-profile-main-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
   </button>

   <button type="button" onClick={()=>onNavigate?.('student/achievements')}>
    <span className="is-yellow" aria-hidden="true">
     <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="m8.5 12.5-1 8 4.5-2 4.5 2-1-8"/></svg>
    </span>
    <strong>دستاوردها</strong>
    <svg className="ir-student-profile-main-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
   </button>

   <button type="button" onClick={()=>onNavigate?.('student/notifications')}>
    <span className="is-yellow" aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
    </span>
    <strong>اعلان‌ها</strong>
    <svg className="ir-student-profile-main-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
   </button>

   <button type="button" onClick={()=>onNavigate?.('student/privacy')}>
    <span className="is-green" aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z"/><path d="m9 12 2 2 4-4"/></svg>
    </span>
    <strong>حریم خصوصی</strong>
    <svg className="ir-student-profile-main-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
   </button>

   <button type="button" onClick={()=>onNavigate?.('student/support')}>
    <span className="is-yellow" aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 1 1-3-6"/><path d="M8 12h8"/><path d="m5 19-1 3 3-1"/></svg>
    </span>
    <strong>پشتیبانی</strong>
    <svg className="ir-student-profile-main-page__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
   </button>

   <button type="button" className="is-logout" onClick={logout}>
    <span className="is-red" aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M10 4H5v16h5"/><path d="M13 8l4 4-4 4"/><path d="M17 12H8"/></svg>
    </span>
    <strong>خروج از حساب</strong>
   </button>
  </section>

  {params?.section==='achievements'&&<aside className="ir-student-profile-main-page__inline-panel">
   <header>
    <strong>دستاوردهای من</strong>
    <button type="button" aria-label="بستن" onClick={()=>onNavigate?.('student/profile')}>×</button>
   </header>
   <p>{IrancellFormatPersianNumber(certificateCount)} گواهینامه و {IrancellFormatPersianNumber(completedCourseCount)} دوره تکمیل‌شده در مسیر یادگیری شما ثبت شده است.</p>
   <button type="button" onClick={()=>onNavigate?.('student/binayi')}>مشاهده مسیر یادگیری</button>
  </aside>}

  {params?.section==='privacy'&&<aside className="ir-student-profile-main-page__inline-panel is-privacy">
   <header>
    <strong>حریم خصوصی</strong>
    <button type="button" aria-label="بستن" onClick={()=>onNavigate?.('student/profile')}>×</button>
   </header>
   <p>اطلاعات آموزشی شما فقط در سطح مجاز دانش‌آموز و خانواده استفاده می‌شود. تغییرات حساس حساب نیازمند تأیید خانواده است.</p>
   <button type="button" onClick={()=>onNavigate?.('student/support')}>راهنمای حریم خصوصی</button>
  </aside>}
 </section>
}
