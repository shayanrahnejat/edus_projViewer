export const IRANCELL_PAGE_PROTOTYPE_CATALOG=Object.freeze(`slice-2 onboarding-welcome onboarding-features-1 onboarding-features-2 onboarding-features-3 ai-activation-active chisty-ai-search chisty-ai-search-1 chisty-ai-results chisty-ai-generating student-profile student-profile-edit student-profile-photo-change irancell-redirect family-profile-switch family-add-child student-learning-setup family-home family-children family-payments family-profile student-exit-gate classes-offers-marketplace institute-profile tutor-profile-independent student-dashboard irancell-countdown-4 irancell-countdown-3 irancell-countdown-2 irancell-countdown-1 family-add-child-filled family-grade-picker-overlay family-date-picker-overlay student-account-info student-permissions student-family-control student-account-security student-notifications-settings student-support notification-detail-overlay chisty-search-typed chisty-search-typed-1 student-home support-new-request support-chat support-contact support-faq support-request-detail support-closed-request support-subject-dropdown support-child-dropdown support-file-picker support-success-overlay support-request-submitted student-courses course-detail-video student-completed-courses course-filter-overlay course-detail-live student-achievements student-badges student-badge-detail student-certificates student-certificate-detail student-points-levels chisty-attachment-overlay chisty-attachment-sheet chisty-attachment-states student-notifications notifications-empty notifications-no-results student-privacy student-privacy-visibility student-privacy-activity student-privacy-stored-data student-privacy-data-sharing student-privacy-chisty student-privacy-data-export student-privacy-delete-data student-privacy-select-delete student-delete-account student-parent-gate-overlay student-delete-history-confirm student-delete-account-confirm student-success-state student-delete-account-checked student-request-success student-my-requests student-request-detail student-support-satisfaction student-report-issue student-support-search-results student-support-search-empty student-support-offline student-support-error student-support-home student-faq-categories student-faq-detail student-create-request role-selection-family role-selection-institute role-selection-freelance student-settings student-settings-teacher-selected family-add-child-date-filled ai-activation-inactive ai-activation-step-2 ai-activation-step-3 otp-verification-overlay classes-main classes-new-request classes-offer-confirm-pay classes-booking-success classes-reservation-details classes-online-session classes-post-rating chisty-ai-search-dark course-detail-paid course-detail-free video-watching video-fullscreen-landscape`.split(' '));

const IRANCELL_PAGE_PROTOTYPE_TITLES=Object.freeze({
 'onboarding-welcome':'دستیار هوشمند آموزشی شما','onboarding-features-1':'یادگیری با هوش مصنوعی','onboarding-features-2':'مسیر یادگیری اختصاصی','onboarding-features-3':'پیگیری هوشمند پیشرفت','family-home':'مدیریت خانواده','family-children':'فرزندان من','family-payments':'پرداخت‌ها','family-profile':'حساب خانواده','student-home':'خانه یادگیری','student-dashboard':'داشبورد آموزشی','student-courses':'دوره‌های من','student-completed-courses':'دوره‌های تکمیل‌شده','student-profile':'پروفایل دانش‌آموز','student-notifications':'اعلان‌ها','student-support-home':'مرکز پشتیبانی','student-settings':'تنظیمات','student-privacy':'حریم خصوصی','classes-main':'کلاس‌ها','classes-new-request':'ثبت درخواست کلاس','classes-offers-marketplace':'پیشنهادهای مدرس‌ها','classes-offer-confirm-pay':'تأیید و پرداخت','classes-booking-success':'رزرو با موفقیت انجام شد','classes-reservation-details':'جزئیات رزرو','classes-online-session':'کلاس آنلاین','classes-post-rating':'نظر شما درباره جلسه','chisty-ai-search':'چیستی','chisty-ai-results':'پاسخ چیستی','chisty-ai-generating':'در حال ساخت پاسخ هوشمند','course-detail-video':'دوره ویدیویی','course-detail-live':'دوره زنده','course-detail-paid':'دوره آموزشی','course-detail-free':'دوره رایگان','otp-verification-overlay':'تأیید کد یک‌بارمصرف','student-learning-setup':'تنظیم مسیر یادگیری','student-permissions':'مجوزها و دسترسی‌ها','student-account-security':'امنیت حساب','student-account-info':'اطلاعات حساب','support-new-request':'ثبت درخواست پشتیبانی','support-request-detail':'جزئیات درخواست پشتیبانی','support-request-submitted':'درخواست شما ثبت شد','student-my-requests':'درخواست‌های من','student-request-detail':'جزئیات درخواست','student-achievements':'دستاوردها','student-badges':'نشان‌های من','student-certificates':'گواهی‌های من','student-points-levels':'امتیازها و سطح‌ها','institute-profile':'پروفایل آموزشگاه','tutor-profile-independent':'پروفایل مدرس مستقل'
});

export function IrancellPrototypePageGlyph({name='spark'}){const paths={back:'M15 18l-6-6 6-6',home:'M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3Z',search:'m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',user:'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',book:'M4 4h6a2 2 0 0 1 2 2v15a3 3 0 0 0-3-3H4ZM20 4h-6a2 2 0 0 0-2 2v15a3 3 0 0 1 3-3h5Z',calendar:'M6 2v4M18 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v15H3V6a2 2 0 0 1 2-2Z',wallet:'M3 6h16a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2ZM3 10h18M17 14h2',shield:'M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Zm-3-10 2 2 4-4',check:'m5 12 4 4L19 6',plus:'M12 5v14M5 12h14',play:'M8 5v14l11-7Z',star:'m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17l-6.3 3.5L7 13.7 2 8.9 9 8Z',lock:'M5 10h14v11H5ZM8 10V7a4 4 0 0 1 8 0v3',info:'M12 11v6M12 7h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',paperclip:'m21 12-8 8a6 6 0 0 1-8-8l8-8a4 4 0 0 1 6 6l-8 8a2 2 0 1 1-3-3l8-8',trash:'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14',spark:'m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6Z'};return <svg className="ir-svg-page-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]||paths.spark}/></svg>}

export function IrancellPrototypePageKind(id){if(id.startsWith('onboarding-'))return'onboarding';if(id.startsWith('role-selection-'))return'roles';if(id.includes('activation')||id.includes('countdown')||id==='irancell-redirect'||id.includes('generating'))return'progress';if(id.includes('overlay')||id.includes('picker')||id.includes('dropdown')||id.includes('sheet')||id.includes('confirm'))return'overlay';if(id.includes('success')||id.includes('submitted'))return'success';if(id.includes('online-session')||id.includes('video-'))return'video';if(id.startsWith('course-detail'))return'course';if(id.includes('new-request')||id.includes('create-request')||id.includes('add-child')||id.includes('profile-edit')||id.includes('learning-setup')||id.includes('report-issue'))return'form';if(id.includes('profile'))return'profile';if(id.includes('privacy')||id.includes('security')||id.includes('permissions')||id.includes('control')||id.includes('settings')||id.includes('delete')||id.includes('exit-gate')||id.includes('account-info'))return'settings';if(id.includes('search'))return'search';if(id.includes('chat')||id.includes('ai-results'))return'chat';if(id.includes('payment')||id.includes('confirm-pay'))return'payment';if(id.includes('rating')||id.includes('satisfaction'))return'rating';if(id.includes('home')||id.includes('dashboard'))return'home';return'list'}

export const IRANCELL_PAGE_STUDENT_HOME_AVATAR='data:image/webp;base64,UklGRtoDAABXRUJQVlA4IM4DAADQFgCdASpgAGAAPrFIoEsnJCMlKrQMqOAWCWMAzBQ01BvMpxS5GKJkeDEDgjuXGbngejceiQWZAeLaH99Qd3anBLdH6+7qrNU2hiJfJqkQ+AKv7OvNAcxNHwFsc5NkB9YhyyGiSyBTVy+Enpz8TV0yAVxjrtBIuzjhmLSsHXzqh4gCDLtlHfcBF4W3W87z+D2nQ0wTFLpMGKyE2SqjzPeFwP/C1be1ZwpiONJdvvSEw+wtkDA6rhZj/yfVEgXq0AD+53L8EqX9efsROX3/bWQOdHiG9O3eK7bE1BpnRQDIkTIROqBVwGbPo8hZnQqluAQVynd/Mpw/1Q4Z663rciELea9+ooOilsT4yP8PIqGNojLBaeMmeNx2jtE4HcjKdbwhbFtQDfDOuVoQjvTLQJfm0j7pRTTRKb6Vvxxntks55ukBgEeTzU3wcCMgL5SgNn5mcJ42ZbYx2WdmRgmWr8cYujxuv5FRJt2Pr3FZSfD4+gz9Pi++tC6HEUaXZvzZM/9wZY7DWoq0g7GvEbZxN9V8RoUGnwZWKwFK1DKqInj2h8G6Tl1O4U8JITGJYxDznI3rhXRoIj1ohz9CbFPCnCDZ4MEgIAUr1OZPWjH1sVnR5+R9WfD9z5J+DuH1BMrUo64I+hAD36TrkhajZRf8vcaWQ8aPPKD67+qLrd6syEPM7WbeTQ6cHFskDLgBNUfz1V6McIAZ7+zMRRRSaps05d1us2LyP2/D1StSMJvjp2gR6/GjV1nHF8dNkhzdBACm53r6Nc42hmNe5YSMI6xmasjM7Gw/mwrpokcxpRt+1DOc39/J/90X3pauz1E7bHKNRUxzQm1Eff8yyAeQQ3Ahab7f5UFO4gZ/mCURWIhIXkJ8Jnr7vtNOQ9FGBmz71+25DpgBxKYbOdIJJPFwQJWc7peifacXQD7qcfoHIWhGDXDyvLwuiYD8x6X80DGJqpS54q8ncoC+7gC6D/oI0S6TECjUjOTlJmGtVRw1X3UA7vS+fCvSHz2/+edG5kWCSjIz2wivmbEpGTF7Xqo9QdcXTBatbiw+wsmUUpHIcNqWIfVhsVugFw72ejWsbVkzMqWuHtOsgnycjEACkls338j2QC1NUPMuBF7h0yVuUCib/T/Va90hRANw7VClPzPhs25UXySNsperwjCWSoxFDAGXhduTWzZH+jCFhaOC41iqCOXHh78mnn731XnL11ubTLCDF6IHhchY1G0orF2ocd+NoAltjKgL+Y8q0xhkqNGLzUYhiQGnzRvCTzF1FB1FF1N6+Jj4GVWVFBgMPs5aewAAAA==';

export function IrancellPrototypeStudentDashboardPage({onNavigate}){
 const{state}=useIrancellStore();
 const icon=name=><IrancellPrototypePageGlyph name={name}/>;
 const studentId=state.session.currentUserId||'student-1';
 const student=state.identity.usersById[studentId]||state.identity.usersById['student-1']||{name:'دانش‌آموز',grade:'پایه تحصیلی ثبت نشده'};
 const firstName=String(student.name||'دانش‌آموز').trim().split(/\s+/)[0]||'دانش‌آموز';
 const classes=Object.values(state.classroom.sessionsById).filter(item=>item.studentId===studentId).sort((first,second)=>new Date(first.startAt)-new Date(second.startAt));
 const nextClass=classes.find(item=>!['completed','cancelled'].includes(item.status))||null;
 const recommendationIds=Array.isArray(state.content.recommendations)?state.content.recommendations:[];
 const recommendedContent=recommendationIds.map(id=>state.content.catalogueById[id]).find(Boolean)||Object.values(state.content.catalogueById).find(item=>item.status==='published')||null;
 const progressValues=Object.values(state.content.watchProgress).map(value=>Number(value)||0);
 const weeklyProgress=Math.max(0,Math.min(100,Math.round(progressValues.reduce((sum,value)=>sum+value,0)/Math.max(progressValues.length,1))));
 const unreadCount=Number(state.notifications.unreadCount)||0;
 return <section className="ir-exact-student-dashboard">
  <header className="ir-exact-student-dashboard__header">
   <button type="button" aria-label="اعلان‌ها" onClick={()=>onNavigate?.('notifications')}>{icon('bell')}{unreadCount>0&&<i>{IrancellFormatPersianNumber(unreadCount)}</i>}</button>
   <div><strong>{student.name}</strong><span>{student.grade||'پایه تحصیلی ثبت نشده'}</span></div>
   <img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt={student.name||'پروفایل دانش‌آموز'}/>
  </header>
  <article className="ir-exact-student-dashboard__welcome">
   <h1>سلام {firstName}، آماده‌ای یادگیری امروز را شروع کنیم؟</h1>
   <p>{nextClass?`یک کلاس پیش رو و ${IrancellFormatPersianNumber(recommendationIds.length)} پیشنهاد آموزشی برایت آماده است.`:'برای امروز محتوای پیشنهادی و مسیر یادگیری شخصی‌سازی‌شده داری.'}</p>
   <div className="ir-exact-student-dashboard__progress-label"><strong>پیشرفت یادگیری</strong><span>{IrancellFormatPersianNumber(weeklyProgress)}٪</span></div>
   <div className="ir-exact-student-dashboard__progress"><span style={{width:`${weeklyProgress}%`}}/></div>
   <footer><button type="button" onClick={()=>onNavigate?.('student/classes')}>برنامه کلاس‌ها</button><button type="button" onClick={()=>onNavigate?.('student/learning')}>ادامه یادگیری</button></footer>
  </article>
  <article className="ir-exact-student-dashboard__chisty">
   <span className="ir-exact-student-dashboard__chisty-icon">{icon('spark')}</span>
   <div><small>از دستیار هوشمند بپرس</small><strong>سؤال درسی‌ات را بنویس تا پاسخ و مسیر مناسب پیشنهاد شود.</strong></div>
   <button type="button" onClick={()=>onNavigate?.('student/ask')}>{icon('search')}<span>مثلاً: معادله درجه دوم را چطور حل کنم؟</span>{icon('paperclip')}</button>
  </article>
  <div className="ir-exact-student-dashboard__section-heading"><h2>برنامه امروز</h2><button type="button" onClick={()=>onNavigate?.('student/classes')}>مشاهده همه</button></div>
  <div className="ir-exact-student-dashboard__schedule">
   {nextClass?<button type="button" onClick={()=>onNavigate?.(`class/${nextClass.id}`)}><span className="is-video">{icon('calendar')}</span><div><strong>{nextClass.title}</strong><small>{new Date(nextClass.startAt).toLocaleString('fa-IR',{weekday:'long',hour:'2-digit',minute:'2-digit'})}</small></div><em>{nextClass.status==='live'?'در حال برگزاری':'رزرو شده'}</em></button>:<button type="button" onClick={()=>onNavigate?.('student/requests')}><span className="is-video">{icon('plus')}</span><div><strong>یک کلاس جدید رزرو کن</strong><small>مدرس مناسب را بر اساس درس و زمان پیدا کن.</small></div><em>شروع</em></button>}
   {recommendedContent&&<button type="button" onClick={()=>onNavigate?.(`student/content/${recommendedContent.id}`)}><span className="is-task">{icon('book')}</span><div><strong>{recommendedContent.title}</strong><small>{recommendedContent.subject} · {recommendedContent.duration?`${IrancellFormatPersianNumber(Math.round(recommendedContent.duration/60))} دقیقه`:'محتوای آموزشی'}</small></div><em>پیشنهادی</em></button>}
   <button type="button" onClick={()=>onNavigate?.('student/requests')}><span className="is-free">{icon('user')}</span><div><strong>درخواست مدرس</strong><small>برای رفع اشکال یا برنامه‌ریزی درسی درخواست ثبت کن.</small></div><em>جدید</em></button>
  </div>
  <nav className="ir-exact-student-dock" aria-label="ناوبری دانش‌آموز">
   <button type="button" onClick={()=>onNavigate?.('student/profile')}><img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="پروفایل"/></button>
   <button type="button" onClick={()=>onNavigate?.('student/classes')}>{icon('calendar')}</button>
   <button type="button" className="is-center" aria-label="دستیار هوشمند" onClick={()=>onNavigate?.('student/ask')}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button>
   <button type="button" onClick={()=>onNavigate?.('student/learning')}>{icon('book')}</button>
   <button type="button" className="is-active" onClick={()=>onNavigate?.('student/home')}>{icon('home')}</button>
  </nav>
 </section>
}

export function IrancellPrototypeFamilyHomePage({onNavigate}){
 const icon=name=><IrancellPrototypePageGlyph name={name}/>;
 return <section className="ir-exact-family-home">
  <header className="ir-exact-family-home__profile">
   <div><small>سلام، خوش آمدید</small><strong>آقای احمدی</strong></div>
   <img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="آقای احمدی"/>
  </header>
  <div className="ir-exact-family-home__title"><h1>مدیریت خانواده</h1><span>{icon('check')} حساب تأیید شده</span></div>
  <article className="ir-exact-family-home__summary">
   <h2>خانواده شما</h2>
   <div><span><strong>۲</strong><small>تعداد دانش‌آموزان</small></span><span><strong>۳</strong><small>کلاس‌های فعال</small></span><span><strong>۱</strong><small>درخواست در انتظار</small></span></div>
   <button type="button" onClick={()=>onNavigate?.('parent/children')}>افزودن دانش‌آموز +</button>
  </article>
  <div className="ir-exact-family-home__section-heading"><h2>فرزندان / دانش‌آموزان</h2><button type="button" onClick={()=>onNavigate?.('parent/children')}>مشاهده همه</button></div>
  <article className="ir-exact-family-home__child">
   <header><div><strong>آراد احمدی</strong><small>پایه هشتم</small></div><img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="آراد احمدی"/></header>
   <div className="ir-exact-family-home__child-progress-label"><span>پیشرفت یادگیری</span><strong>۷۸٪</strong></div>
   <div className="ir-exact-family-home__child-progress"><span/></div>
   <small>کلاس‌های فعال: ۲</small>
   <button type="button" onClick={()=>onNavigate?.('student/home')}>ورود به پروفایل دانش‌آموز</button>
  </article>
  <h2 className="ir-exact-family-home__quick-title">دسترسی سریع</h2>
  <div className="ir-exact-family-home__quick">
   <button type="button" onClick={()=>onNavigate?.('parent/consents')}>{icon('shield')}<span>مجوزها</span></button>
   <button type="button" onClick={()=>onNavigate?.('parent/payments')}>{icon('wallet')}<span>پرداخت‌ها</span></button>
   <button type="button" onClick={()=>onNavigate?.('parent/classes')}>{icon('calendar')}<span>کلاس‌ها</span></button>
   <button type="button" onClick={()=>onNavigate?.('parent/reports')}>{icon('book')}<span>گزارش‌ها</span></button>
  </div>
  <nav className="ir-exact-family-dock" aria-label="ناوبری خانواده">
   <button type="button" onClick={()=>onNavigate?.('parent/profile')}><img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="پروفایل"/></button>
   <button type="button" onClick={()=>onNavigate?.('parent/payments')}>{icon('wallet')}</button>
   <button type="button" onClick={()=>onNavigate?.('parent/children')}>{icon('user')}</button>
   <button type="button" className="is-active" onClick={()=>onNavigate?.('parent/home')}>{icon('home')}</button>
  </nav>
 </section>
}

export function IrancellPrototypeFamilyChildrenPage({onNavigate}){
 const{state}=useIrancellStore();
 const icon=name=><IrancellPrototypePageGlyph name={name}/>;
 const parentId=state.session.activeRole==='parent'?state.session.currentUserId:'parent-1';
 const relationships=Object.values(state.identity.relationshipsById||{}).filter(relationship=>relationship.parentId===parentId&&relationship.status==='active');
 const linkedChildren=relationships.map(relationship=>state.identity.usersById?.[relationship.childId]).filter(Boolean);
 const fallbackChildren=Object.values(state.identity.usersById||{}).filter(user=>Array.isArray(user.roles)&&user.roles.includes('student')).slice(0,3);
 const children=(linkedChildren.length?linkedChildren:fallbackChildren).map((child,index)=>{
  const progress=Math.max(0,Math.min(100,Number(state.family?.childProgressById?.[child.id])||0));
  const activeClasses=Math.max(0,Number(state.family?.activeClassCountByChildId?.[child.id])||0);
  return{...child,progress,width:`${progress}%`,progressLabel:`${IrancellFormatPersianNumber(progress)}٪`,activeClasses,tone:['yellow','green','gray'][index%3]}
 });
 return <section className="ir-exact-family-children">
  <header><h1>فرزندان</h1><p>مدیریت پروفایل‌های دانش‌آموزی خانواده</p></header>
  <div className="ir-exact-family-children__list">
   {children.length?children.map((child,index)=><article className={`is-${child.tone}`} key={child.id}>
    <header><div><strong>{child.name}</strong><small>{child.grade||'پایه تحصیلی ثبت نشده'}</small></div>{child.avatarDataUrl||index===0?<img src={child.avatarDataUrl||IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt={child.name}/>:<span>{String(child.name||'د').charAt(0)}</span>}</header>
    <div className="ir-exact-family-children__progress-label"><span>پیشرفت یادگیری: {child.progressLabel}</span><small>{child.activeClasses?`${IrancellFormatPersianNumber(child.activeClasses)} کلاس فعال`:'کلاس فعالی ندارد'}</small></div>
    <div className="ir-exact-family-children__progress"><span style={{width:child.width}}/></div>
    <footer><button type="button" onClick={()=>onNavigate?.(`parent/children/${child.id}`,{mode:'edit'})}>ویرایش</button><button type="button" onClick={()=>onNavigate?.(`parent/children/${child.id}`)}>مشاهده پروفایل</button></footer>
    <button type="button" className="ir-exact-family-children__report" onClick={()=>onNavigate?.('parent/reports',{childId:child.id})}>مشاهده گزارش</button>
   </article>):<div className="ir-generic-empty"><h3>هنوز دانش‌آموزی متصل نشده است</h3><p>برای شروع، پروفایل دانش‌آموز را به حساب خانواده اضافه کنید.</p></div>}
  </div>
  <button type="button" className="ir-exact-family-children__add" onClick={()=>onNavigate?.('parent/children',{mode:'add'})}>افزودن دانش‌آموز +</button>
  <aside className="ir-exact-family-children__security">{icon('lock')}<div><strong>برای خروج از پروفایل دانش‌آموز و بازگشت به بخش خانواده، تأیید والدین الزامی است.</strong><span><b>اثر انگشت</b><b>Face ID</b><b>کد عبور</b><b>رمز عبور</b></span></div></aside>
  <nav className="ir-exact-family-dock" aria-label="ناوبری خانواده">
   <button type="button" onClick={()=>onNavigate?.('parent/profile')}>{icon('user')}</button>
   <button type="button" onClick={()=>onNavigate?.('parent/payments')}>{icon('wallet')}</button>
   <button type="button" className="is-active" onClick={()=>onNavigate?.('parent/children')}>{icon('user')}</button>
   <button type="button" onClick={()=>onNavigate?.('parent/home')}>{icon('home')}</button>
  </nav>
 </section>
}

export function IrancellPrototypeChistyMark({size=24}){
 return <svg className="ir-chisty-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
  <path d="M15.8 3.2v7.1M15.8 21.7v7.1M3.1 16h7.2M21.5 16h7.3M8.2 8.4l4.2 4.2M19.2 19.2l4.4 4.4M23.5 8.4l-4.2 4.2M12.4 19.2l-4.3 4.3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
  <path d="M16 10.2c3.2 0 5.8 2.6 5.8 5.8s-2.6 5.8-5.8 5.8-5.8-2.6-5.8-5.8 2.6-5.8 5.8-5.8Z" fill="none" stroke="currentColor" strokeWidth="2.4"/>
  <circle cx="16" cy="16" r="1.8" fill="currentColor"/>
  <circle cx="25.7" cy="5.7" r="2.2" fill="none" stroke="currentColor" strokeWidth="2"/>
 </svg>
}

export function IrancellPrototypeChistyDock({active='chisty',onNavigate}){
 return <nav className="ir-chisty-dock" aria-label="ناوبری چیستی">
  <button type="button" className={active==='profile'?'is-active':''} aria-label="پروفایل" onClick={()=>onNavigate?.('student/profile')}>
   <img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="پروفایل آراد"/>
  </button>
  <button type="button" className={active==='classes'?'is-active':''} aria-label="کلاس‌ها" onClick={()=>onNavigate?.('student/classes')}>
   <IrancellPrototypePageGlyph name="calendar"/>
  </button>
  <button type="button" className={active==='answers'?'is-active':''} aria-label="پاسخ‌های من" onClick={()=>onNavigate?.('student/chats')}>
   <svg className="ir-chisty-dock__eye" viewBox="0 0 32 22" aria-hidden="true"><path d="M2 11s5-8 14-8 14 8 14 8-5 8-14 8S2 11 2 11Z"/><circle cx="16" cy="11" r="3.5"/></svg>
  </button>
  <button type="button" className={`is-chisty ${active==='chisty'?'is-active':''}`} aria-label="چیستی" onClick={()=>onNavigate?.('student/ask')}>
   <IrancellPrototypeChistyMark size={25}/>
  </button>
  <button type="button" className={active==='home'?'is-active':''} aria-label="خانه" onClick={()=>onNavigate?.('student/home')}>
   <IrancellPrototypePageGlyph name="home"/>
  </button>
 </nav>
}

export function IrancellPrototypeChistySearchPage({onNavigate}){
 const[question,setQuestion]=useState('');
 const recentSearches=['ریاضی - معادله درجه دوم','فیزیک - قانون نیوتن','زبان - گرامر'];
 const suggestions=['تکلیف','نمایش ویدیو','توضیح مفهوم','مسئله ریاضی'];
 function submit(event){
  event.preventDefault();
  if(!question.trim())setQuestion('قوانین نیوتن را توضیح بده');
  onNavigate?.('prototype/chisty-ai-generating')
 }
 return <section className="ir-chisty-svg ir-chisty-search-svg">
  <header className="ir-chisty-svg__brand"><span><IrancellPrototypeChistyMark size={24}/></span><strong>چیستی</strong></header>
  <div className="ir-chisty-search-svg__intro">
   <h1>بپرس، یاد بگیر.</h1>
   <p>دستیار هوش مصنوعی شما آماده پاسخگویی است</p>
  </div>
  <form className="ir-chisty-search-svg__form" onSubmit={submit}>
   <IrancellPrototypePageGlyph name="search"/>
   <input value={question} onChange={event=>setQuestion(event.target.value)} placeholder="چیزی می‌خوای یاد بگیری؟"/>
   <button type="button" className="ir-chisty-search-svg__attach" aria-label="افزودن پیوست" onClick={()=>onNavigate?.('prototype/chisty-attachment-overlay')}><IrancellPrototypePageGlyph name="paperclip"/></button>
   <button type="submit" className="ir-chisty-search-svg__voice" aria-label="ارسال سؤال صوتی">
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>
   </button>
  </form>
  <section className="ir-chisty-search-svg__recent">
   <h2>آخرین جستجوها</h2>
   {recentSearches.map(item=><button type="button" key={item} onClick={()=>setQuestion(item)}><span>{item}</span><IrancellPrototypePageGlyph name="back"/></button>)}
  </section>
  <section className="ir-chisty-search-svg__suggestions">
   <h2>موضوعات پیشنهادی</h2>
   <div>{suggestions.map((item,index)=><button type="button" key={item} className={index===suggestions.length-1?'is-active':''} onClick={()=>setQuestion(item)}>{item}</button>)}</div>
  </section>
  <IrancellPrototypeChistyDock active="chisty" onNavigate={onNavigate}/>
 </section>
}

export function IrancellPrototypeChistyResultsPage({onNavigate}){
 const[nextQuestion,setNextQuestion]=useState('');
 function submit(event){
  event.preventDefault();
  if(!nextQuestion.trim())return;
  onNavigate?.('prototype/chisty-ai-generating')
 }
 return <section className="ir-chisty-svg ir-chisty-results-svg">
  <header className="ir-chisty-results-svg__header">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/ask')}><IrancellPrototypePageGlyph name="back"/></button>
   <div><strong>داشبورد</strong><span>تکمیل شد ✓</span></div>
  </header>
  <section className="ir-chisty-results-svg__question">
   <small>سؤال شما:</small>
   <h1>قوانین حرکت نیوتن</h1>
  </section>
  <article className="ir-chisty-results-svg__answer">
   <header><strong>درک هوش مصنوعی</strong><span><IrancellPrototypeChistyMark size={21}/></span></header>
   <p>قوانین نیوتن توضیح می‌دهند که نیروها چگونه بر حرکت اجسام تأثیر می‌گذارند. درک این اصول برای تسلط بر فیزیک کلاسیک ضروری است.</p>
   <button type="button" onClick={()=>onNavigate?.('student/learning')}>شروع مسیر یادگیری</button>
  </article>
  <section className="ir-chisty-results-svg__resources">
   <h2>منابع</h2>
   <article>
    <button type="button" className="ir-chisty-results-svg__play" aria-label="پخش ویدیوی نیرو و حرکت" onClick={()=>onNavigate?.('student/content/newton-video')}><IrancellPrototypePageGlyph name="play"/></button>
    <div><strong>ویدیوی درس: نیرو و حرکت</strong><small>۱۲:۳۰ · مبتدی</small></div>
   </article>
   <article>
    <button type="button" className="ir-chisty-results-svg__watch" onClick={()=>onNavigate?.('student/content/newton-steps')}>مشاهده</button>
    <div><strong>گام به گام: حل مسائل</strong><small>مراحل تقسیم و حل</small></div>
   </article>
  </section>
  <form className="ir-chisty-results-svg__followup" onSubmit={submit}>
   <button type="submit" aria-label="ارسال سؤال"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-8-8 18-2-7-8-3Z"/><path d="m11 14 4-4"/></svg></button>
   <input value={nextQuestion} onChange={event=>setNextQuestion(event.target.value)} placeholder="سؤال بعدی را بپرس..."/>
   <button type="button" aria-label="ضبط صدا" onClick={()=>setNextQuestion(current=>current||'این بخش را با یک مثال ساده‌تر توضیح بده')}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>
   <button type="button" aria-label="افزودن پیوست" onClick={()=>onNavigate?.('prototype/chisty-attachment-overlay')}><IrancellPrototypePageGlyph name="paperclip"/></button>
  </form>
  <IrancellPrototypeChistyDock active="chisty" onNavigate={onNavigate}/>
 </section>
}

export function IrancellPrototypeChistyGeneratingPage({onNavigate}){
 return <section className="ir-chisty-svg ir-chisty-generating-svg">
  <header className="ir-chisty-generating-svg__header">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/ask')}><IrancellPrototypePageGlyph name="back"/></button>
   <div><span><IrancellPrototypeChistyMark size={23}/></span><strong>چیستی</strong></div>
  </header>
  <article className="ir-chisty-generating-svg__question">
   <small>سؤال شما:</small>
   <h1>قوانین نیوتن را توضیح بده</h1>
   <p>چیستی · هوش مصنوعی در حال پردازش...</p>
  </article>
  <div className="ir-chisty-generating-svg__orb" aria-hidden="true"><span/></div>
  <section className="ir-chisty-generating-svg__copy">
   <h2>در حال تحلیل سؤال شما...</h2>
   <p>هوش مصنوعی دارد بهترین پاسخ را برای تو آماده می‌کند</p>
  </section>
  <article className="ir-chisty-generating-svg__stages">
   <h3>مراحل پردازش</h3>
   <div className="is-complete"><span>✓</span><strong>شناسایی موضوع: فیزیک کلاسیک</strong></div>
   <div className="is-loading"><span>↻</span><strong>جستجو در منابع یادگیری...</strong></div>
   <div><span/><strong>آماده‌سازی مسیر یادگیری</strong></div>
   <div className="ir-chisty-generating-svg__progress"><span/></div>
   <footer><span>۶۵٪ تکمیل شده</span></footer>
  </article>
  <div className="ir-chisty-generating-svg__actions">
   <button type="button" onClick={()=>onNavigate?.('student/ask')}>لغو و بازگشت</button>
   <button type="button" onClick={()=>onNavigate?.('student/chats')}>مشاهده نتایج</button>
  </div>
  <IrancellPrototypeChistyDock active="chisty" onNavigate={onNavigate}/>
 </section>
}

export const IRANCELL_PAGE_ROLE_DOCKS=Object.freeze({
 student:Object.freeze([
  {route:'student/profile',icon:'user',label:'پروفایل',tokens:['profile','settings','privacy','account','notification','support']},
  {route:'student/classes',icon:'calendar',label:'کلاس‌ها',tokens:['class','reservation','rating']},
  {route:'student/chats',icon:'spark',label:'پاسخ‌ها',tokens:['results','chat']},
  {route:'student/ask',icon:'search',label:'چیستی',tokens:['chisty-ai-search','generating','typed','attachment'],primary:true},
  {route:'student/home',icon:'home',label:'خانه',tokens:['student-home','dashboard']}
 ]),
 parent:Object.freeze([
  {route:'parent/profile',icon:'user',label:'حساب خانواده',tokens:['profile','settings','privacy','account']},
  {route:'parent/payments',icon:'wallet',label:'پرداخت‌ها',tokens:['payment','wallet','finance']},
  {route:'parent/children',icon:'user',label:'فرزندان',tokens:['children','permission','control','consent']},
  {route:'parent/home',icon:'home',label:'خانه',tokens:['family-home','dashboard']}
 ]),
 teacher:Object.freeze([
  {route:'teacher/profile',icon:'user',label:'پروفایل',tokens:['tutor-profile','profile']},
  {route:'teacher/classes',icon:'calendar',label:'کلاس‌ها',tokens:['class','reservation','rating']},
  {route:'teacher/requests',icon:'book',label:'درخواست‌ها',tokens:['request','offer']},
  {route:'teacher/home',icon:'home',label:'خانه',tokens:['teacher-home','dashboard']}
 ]),
 academy:Object.freeze([
  {route:'academy/profile',icon:'user',label:'پروفایل',tokens:['institute-profile','profile']},
  {route:'academy/classes',icon:'calendar',label:'کلاس‌ها',tokens:['class','reservation','rating']},
  {route:'academy/teachers',icon:'book',label:'مدرس‌ها',tokens:['tutor','teacher','offer','request']},
  {route:'academy/home',icon:'home',label:'خانه',tokens:['academy-home','dashboard']}
 ]),
 'content-provider':Object.freeze([
  {route:'content/profile',icon:'user',label:'پروفایل',tokens:['profile','settings']},
  {route:'content/library',icon:'book',label:'کتابخانه',tokens:['course','content','certificate']},
  {route:'content/upload',icon:'plus',label:'بارگذاری',tokens:['upload','form']},
  {route:'content/home',icon:'home',label:'خانه',tokens:['content-home','dashboard']}
 ]),
 admin:Object.freeze([
  {route:'admin/settings',icon:'shield',label:'تنظیمات',tokens:['settings','system','privacy','security']},
  {route:'admin/reports',icon:'book',label:'گزارش‌ها',tokens:['report','achievement']},
  {route:'admin/users',icon:'user',label:'کاربران',tokens:['user','provider','children']},
  {route:'admin/home',icon:'home',label:'خانه',tokens:['admin-home','dashboard']}
 ])
});

export function IrancellPrototypeResolveRole(screen,id){
 const explicitRole=screen?.role;
 if(IRANCELL_PAGE_ROLE_DOCKS[explicitRole])return explicitRole;
 if(String(id).startsWith('family-'))return'parent';
 if(String(id).startsWith('institute-'))return'academy';
 if(String(id).startsWith('tutor-'))return'teacher';
 return'student';
}

export function IrancellPrototypeRoleHomeRoute(role){
 return{parent:'parent/home',teacher:'teacher/home',academy:'academy/home','content-provider':'content/home',admin:'admin/home'}[role]||'student/home';
}

export function IrancellPrototypeResolveDockItems(role,id){
 const normalizedId=String(id||'').toLowerCase();
 const items=IRANCELL_PAGE_ROLE_DOCKS[role]||IRANCELL_PAGE_ROLE_DOCKS.student;
 return items.map(function IrancellPrototypeResolveDockItem(item){
  return{...item,isActive:item.tokens.some(token=>normalizedId.includes(token))}
 });
}

export function IrancellPrototypeStudentCoursesPage({onNavigate}){
 const[selectedFilter,setSelectedFilter]=useState('all');
 const icon=name=><IrancellPrototypePageGlyph name={name}/>;
 const filters=[{id:'all',label:'همه'},{id:'live',label:'کلاس زنده'},{id:'video',label:'ویدیویی'},{id:'completed',label:'تکمیل‌شده'}];
 const courses=[
  {id:'math-live',category:'live',title:'ریاضی پایه هفتم',teacher:'دکتر احمدی',badge:'کلاس زنده',badgeClass:'is-live',progress:65,meta:'آخرین جلسه: امروز ۱۸:۰۰',action:'مشاهده جزئیات',route:'student/classes'},
  {id:'science-video',category:'video',title:'علوم تجربی - فصل انرژی',teacher:'استاد رضایی',badge:'دوره ویدیویی',badgeClass:'is-video',progress:40,meta:'آخرین مشاهده: درس ۳',action:'ادامه یادگیری',route:'student/content/content-physics-1'},
  {id:'english-completed',category:'completed',title:'زبان انگلیسی پایه هفتم',teacher:'خانم کریمی',badge:'تکمیل‌شده',badgeClass:'is-private',progress:100,meta:'پایان دوره ثبت شده',action:'مشاهده گواهینامه',route:'prototype/student-certificate-detail'},
  {id:'math-video',category:'video',title:'تابع درجه دوم در ۱۲ دقیقه',teacher:'استودیو آموزش نو',badge:'دوره ویدیویی',badgeClass:'is-video',progress:32,meta:'آخرین مشاهده: دقیقه ۴',action:'ادامه مشاهده',route:'student/content/content-math-1'}
 ];
 const visibleCourses=selectedFilter==='all'?courses:courses.filter(course=>course.category===selectedFilter);
 const completedCount=courses.filter(course=>course.progress===100).length;
 const activeCount=courses.length-completedCount;
 function cycleFilter(){const currentIndex=filters.findIndex(filter=>filter.id===selectedFilter),nextIndex=(currentIndex+1)%filters.length;setSelectedFilter(filters[nextIndex].id)}
 return <section className="ir-student-courses-svg">
  <header className="ir-student-courses-svg__header"><button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('student/home')}>{icon('back')}</button><h2>دوره‌های من</h2><button type="button" aria-label="تغییر فیلتر دوره‌ها" onClick={cycleFilter}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18l-7 8v6l-4 2v-8Z"/></svg></button></header>
  <div className="ir-student-courses-svg__stats"><article><strong>{courses.length.toLocaleString('fa-IR')}</strong><span>دوره</span></article><article><strong>{completedCount.toLocaleString('fa-IR')}</strong><span>تکمیل‌شده</span></article><article><strong>{activeCount.toLocaleString('fa-IR')}</strong><span>در حال یادگیری</span></article></div>
  <div className="ir-student-courses-svg__filters">{filters.map(filter=><button type="button" key={filter.id} className={selectedFilter===filter.id?'is-active':''} aria-pressed={selectedFilter===filter.id} onClick={()=>setSelectedFilter(filter.id)}>{filter.label}</button>)}</div>
  <div className="ir-student-courses-svg__list">{visibleCourses.map(course=><article className="ir-student-course-card" key={course.id}><header><div><h3>{course.title}</h3><p>{icon('user')}<span>{course.teacher}</span></p></div><span className={`ir-student-course-card__badge ${course.badgeClass}`}>{course.badge}</span></header><div className="ir-student-course-card__progress-label"><strong>پیشرفت</strong><span>{course.progress.toLocaleString('fa-IR')}٪</span></div><div className="ir-student-course-card__progress"><span style={{width:`${course.progress}%`}}/></div><footer><span>{course.meta}</span><button type="button" onClick={()=>onNavigate?.(course.route)}>{course.action}</button></footer></article>)}</div>
 </section>
}

export function IrancellSharedPrototypePage({screen,params={},onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const id=screen?.prototypeId||params.prototypeId||'student-home';
 const title=IRANCELL_PAGE_PROTOTYPE_TITLES[id]||String(id).replaceAll('-',' ');
 const kind=IrancellPrototypePageKind(id);
 const[selected,setSelected]=useState(0),[query,setQuery]=useState(''),[rating,setRating]=useState(5),[enabled,setEnabled]=useState(true),[feedback,setFeedback]=useState(''),[draft,setDraft]=useState({name:'',title:'',grade:'',time:'',description:''});
 const icon=name=><IrancellPrototypePageGlyph name={name}/>;
 const role=IrancellPrototypeResolveRole(screen,id);
 const homeRoute=IrancellPrototypeRoleHomeRoute(role);
 const dockItems=IrancellPrototypeResolveDockItems(role,id);
 const next=id.includes('support')?'help':id.includes('class')?'student/classes':id.includes('course')?'student/learning':homeRoute;
 const linkedChildId=Object.values(state.identity.relationshipsById||{}).find(relationship=>relationship.parentId===state.session.currentUserId&&relationship.status==='active')?.childId||null;
 const activeStudentId=state.session.activeRole==='student'?state.session.currentUserId:linkedChildId||Object.values(state.identity.usersById||{}).find(user=>user.roles?.includes('student'))?.id||null;
 const firstContent=Object.values(state.content.catalogueById||{}).find(content=>content.status==='published')||Object.values(state.content.catalogueById||{})[0]||null;
 const firstSession=Object.values(state.classroom.sessionsById||{}).find(session=>session.participantIds?.includes(state.session.currentUserId)||session.studentId===activeStudentId)||Object.values(state.classroom.sessionsById||{})[0]||null;
 const completedSession=Object.values(state.classroom.sessionsById||{}).find(session=>session.status==='completed'&&(session.participantIds?.includes(state.session.currentUserId)||session.studentId===activeStudentId))||null;
 const pendingPayment=Object.values(state.payment.paymentsById||{}).find(payment=>['pending','failed'].includes(payment.status))||null;
 const profileRoute=role==='content-provider'?'content/profile':role==='admin'?'admin/settings':`${role}/profile`;
 function showPrototypeResult(message,tone='success'){dispatch({type:'IRANCELL_UI_TOAST',message,tone})}
 function openPrototypeContent(){
  if(!firstContent){showPrototypeResult('محتوای قابل نمایش در فروشگاه ثبت نشده است.','warning');return}
  const currentProgress=Number(state.content.watchProgress?.[firstContent.id])||0;
  dispatch(IrancellContentRecordProgress(firstContent.id,Math.min(100,Math.max(1,currentProgress+10))));
  onNavigate?.(`student/content/${firstContent.id}`)
 }
 function submitPrototypeForm(event){
  event.preventDefault();
  const effectiveTitle=String(draft.title||title).trim();
  const effectiveDescription=String(draft.description||`ثبت از بخش ${title}`).trim();
  if(id.includes('add-child')){
   dispatch({type:'IRANCELL_PARENT_ADD_CHILD',name:String(draft.name||'دانش‌آموز جدید').trim(),grade:String(draft.grade||'پایه تحصیلی ثبت نشده').trim()});
   showPrototypeResult('دانش‌آموز در فروشگاه خانواده ثبت شد.')
  }else if(id.includes('request')||id.includes('new-request')||id.includes('create-request')){
   dispatch(IrancellMarketplaceCreateRequest({subject:effectiveTitle,topic:effectiveTitle,grade:String(draft.grade||'هفتم'),preferredTime:draft.time||new Date(Date.now()+86400000).toISOString(),budget:2500000,description:effectiveDescription},activeStudentId));
   showPrototypeResult('درخواست جدید در فروشگاه ثبت شد.')
  }else if(id.includes('support')||id.includes('report-issue')){
   dispatch({type:'IRANCELL_STUDENT_SUPPORT_CREATE',subject:effectiveTitle,message:effectiveDescription,category:'general',responseMethod:'app'});
   showPrototypeResult('درخواست پشتیبانی ثبت شد.')
  }else if(id.includes('profile-edit')){
   const profile={name:String(draft.name||state.identity.usersById?.[state.session.currentUserId]?.name||'').trim(),grade:String(draft.grade||state.identity.usersById?.[state.session.currentUserId]?.grade||'').trim()};
   dispatch({type:state.session.activeRole==='parent'?'IRANCELL_PARENT_PROFILE_UPDATE':'IRANCELL_STUDENT_PROFILE_UPDATE',profile});
   showPrototypeResult('تغییرات پروفایل در فروشگاه ذخیره شد.')
  }else{
   showPrototypeResult('اطلاعات این بخش در فروشگاه ذخیره شد.')
  }
  onNavigate?.(next)
 }
 function completePrototypePayment(){
  if(!pendingPayment){showPrototypeResult('پرداخت در انتظار برای این حساب وجود ندارد.','warning');return}
  dispatch(IrancellPaymentHold(pendingPayment.orderId||pendingPayment.id,['wallet','gateway'][selected]||'gateway'));
  showPrototypeResult('درخواست پرداخت به فروشگاه ارسال شد.');
  onNavigate?.(next)
 }
 function submitPrototypeRating(){
  if(!completedSession){showPrototypeResult('پس از پایان یک جلسه می‌توانید امتیاز ثبت کنید.','warning');return}
  dispatch(IrancellQualityRate(completedSession.id,completedSession.providerId,rating,feedback));
  showPrototypeResult('امتیاز شما در فروشگاه ثبت شد.');
  onNavigate?.(next)
 }
 function togglePrototypeSetting(item,index){
  const nextEnabled=!enabled;
  setEnabled(nextEnabled);
  if(state.session.activeRole==='student')dispatch({type:'IRANCELL_STUDENT_PRIVACY_UPDATE',settings:{[`prototypeSetting${index}`]:nextEnabled,[item]:nextEnabled}});
  showPrototypeResult('تنظیمات در فروشگاه به‌روزرسانی شد.')
 }
 const rows=id.startsWith('family-')?[[ 'آراد احمدی','پایه هشتم · پیشرفت ۷۸٪','user'],['پارسا احمدی','پایه پنجم · پیشرفت ۶۳٪','user'],['پرداخت‌ها و کیف پول','مشاهده تراکنش‌های خانواده','wallet']]:id.includes('support')?[[ 'پرسش‌های متداول','پاسخ سریع به موضوعات پرتکرار','book'],['ثبت درخواست جدید','ارتباط با تیم پشتیبانی','plus'],['درخواست‌های من','پیگیری درخواست‌های فعال','info']]:[[ 'ریاضی هشتم','فصل چهارم · ۶۸٪ تکمیل','book'],['کلاس ریاضی','فردا ساعت ۱۸:۰۰','calendar'],['تمرین روزانه چیستی','۵ سؤال متناسب با سطح شما','spark']];
 let body=null;
 if(id==='student-dashboard')body=<IrancellPrototypeStudentDashboardPage onNavigate={onNavigate}/>;
 else if(id==='family-home')body=<IrancellPrototypeFamilyHomePage onNavigate={onNavigate}/>;
 else if(id==='family-children')body=<IrancellPrototypeFamilyChildrenPage onNavigate={onNavigate}/>;
 else if(['ai-activation-inactive','ai-activation-step-2','ai-activation-step-3','ai-activation-active'].includes(id))body=<IrancellIdentityActivationStagePage stageIndex={{'ai-activation-inactive':0,'ai-activation-step-2':1,'ai-activation-step-3':2,'ai-activation-active':3}[id]} onBack={()=>onNavigate?.('role-select')} onContinue={()=>onNavigate?.('student/home')}/>;
 else if(['chisty-ai-search','chisty-ai-search-1'].includes(id))body=<IrancellPrototypeChistySearchPage onNavigate={onNavigate}/>;
 else if(id==='chisty-ai-results')body=<IrancellPrototypeChistyResultsPage onNavigate={onNavigate}/>;
 else if(id==='chisty-ai-generating')body=<IrancellPrototypeChistyGeneratingPage onNavigate={onNavigate}/>;
 else if(kind==='onboarding')body=<section className="ir-svg-onboarding"><div className="ir-svg-onboarding__art">{id==='onboarding-welcome'?<IrancellBrandMark compact/>:icon(id.endsWith('-1')?'spark':id.endsWith('-2')?'book':'star')}</div><h2>{title}</h2><p>تجربه‌ای هوشمند، امن و شخصی‌سازی‌شده برای یادگیری عمیق‌تر و سریع‌تر.</p><button className="ir-svg-primary" onClick={()=>onNavigate?.(id==='onboarding-features-3'?'auth/login':'prototype/'+({'onboarding-welcome':'onboarding-features-1','onboarding-features-1':'onboarding-features-2','onboarding-features-2':'onboarding-features-3'}[id]||'onboarding-features-1'))}>ادامه</button></section>;
 else if(kind==='roles')body=<section className="ir-svg-roles"><IrancellBrandMark compact/><h2>{title}</h2>{['خانواده + دانش‌آموز','آموزشگاه','معلم آزاد / خصوصی'].map((item,index)=><button className={selected===index?'is-selected':''} onClick={()=>setSelected(index)} key={item}>{icon(index===0?'user':index===1?'book':'spark')}<span><strong>{item}</strong><small>برای ادامه این نقش را انتخاب کنید</small></span>{selected===index&&icon('check')}</button>)}<button className="ir-svg-primary" onClick={()=>onNavigate?.('profile-completion')}>ادامه</button></section>;
 else if(kind==='progress')body=<section className="ir-svg-progress"><div className="ir-svg-progress__orb"><i/><b/></div><h2>{title}</h2><p>در حال آماده‌سازی تجربه یادگیری و اتصال امن اطلاعات شما هستیم.</p>{['پروفایل هویتی شناسایی شد','هدف‌های یادگیری تنظیم شد','پیکربندی دستیار هوشمند'].map(text=><article key={text}>{icon('check')}<span>{text}</span></article>)}<div className="ir-svg-bar"><span style={{width:id.includes('inactive')?'38%':id.includes('step-2')?'62%':id.includes('step-3')?'84%':'100%'}}/></div><button className="ir-svg-primary" onClick={()=>onNavigate?.(next)}>ادامه</button></section>;
 else if(kind==='search')body=<section className={`ir-svg-search ${id.includes('dark')?'is-dark':''}`}><div className="ir-svg-search__brand">{icon('spark')}<strong>چیستی</strong></div><h2>بپرس، یاد بگیر.</h2><p>هر سؤال آموزشی داری بپرس؛ چیستی قدم‌به‌قدم همراهت است.</p><label><button type="button" aria-label="پیشنهاد سؤال" onClick={()=>setQuery(current=>current||'روش حل معادله درجه دوم را مرحله‌به‌مرحله توضیح بده')}>{icon('spark')}</button><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="چه چیزی می‌خواهی یاد بگیری؟"/><button type="button" aria-label="افزودن پیوست" onClick={()=>onNavigate?.('prototype/chisty-attachment-overlay')}>{icon('paperclip')}</button></label>{['روش حل معادله درجه دوم','نمونه سؤال امتحانی علوم','فرق جرم و وزن'].map(text=><button type="button" className="ir-svg-row" onClick={()=>setQuery(text)} key={text}>{icon('search')}<span>{text}</span>{icon('back')}</button>)}<button type="button" className="ir-svg-primary" onClick={()=>{const text=String(query||'روش حل معادله درجه دوم را توضیح بده').trim();dispatch(IrancellChistiSubmitProblem({text,subject:'آموزشی',grade:state.identity.usersById?.[activeStudentId]?.grade||'',topic:text,attachments:[]}));onNavigate?.('student/chats')}}>ساخت پاسخ هوشمند</button></section>;
 else if(kind==='chat')body=<section className="ir-svg-chat"><article><header>{icon('spark')}<strong>پاسخ چیستی</strong></header><h2>روش حل معادله درجه دوم</h2><p>ابتدا ضرایب را مشخص کنید، سپس دلتا را محاسبه کرده و ریشه‌های معادله را به‌دست آورید.</p><b dir="ltr">x = (−b ± √Δ) ÷ 2a</b></article>{rows.map(([a,b,c])=><button type="button" className="ir-svg-card" key={a} onClick={openPrototypeContent}>{icon(c)}<span><strong>{a}</strong><small>{b}</small></span>{icon('back')}</button>)}</section>;
 else if(id==='student-home')body=<section className="ir-student-home-svg"><label className="ir-student-home-svg__search"><IrancellPrototypePageGlyph name="search"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="جستجوی دوره یا ویدیو..."/></label><div className="ir-student-home-svg__chips">{['همه','ریاضی','فیزیک','شیمی','زبان انگلیسی'].map((item,index)=><button key={item} type="button" className={selected===index?'is-active':''} onClick={()=>setSelected(index)}>{item}</button>)}</div><header className="ir-student-home-svg__heading"><h2>دوره‌های پیشنهادی</h2><button type="button" onClick={()=>onNavigate?.('student/learning')}>مشاهده همه</button></header><div className="ir-student-home-svg__courses"><article><div className="ir-student-home-svg__cover is-equations"><button type="button" aria-label="پخش آموزش معادلات دیفرانسیل" onClick={()=>onNavigate?.('student/content/differential')}>{icon('play')}</button></div><h3>آموزش معادلات دیفرانسیل</h3><p>دکتر مریم رضایی</p><div className="ir-student-home-svg__stars">☆ ☆ ☆ ☆ ☆</div><strong>۱٬۲۰۰٬۰۰۰ تومان</strong></article><article><div className="ir-student-home-svg__cover is-mechanics"><button type="button" aria-label="پخش فیزیک دانشگاهی" onClick={()=>onNavigate?.('student/content/mechanics')}>{icon('play')}</button></div><h3>فیزیک دانشگاهی - مکانیک</h3><p>مهندس سارا مرادی</p><div className="ir-student-home-svg__stars">☆ ☆ ☆ ☆ ☆</div><strong>۹۸۰٬۰۰۰ تومان</strong></article></div><header className="ir-student-home-svg__heading"><h2>ویدیوهای رایگان</h2><button type="button" onClick={()=>onNavigate?.('student/learning')}>مشاهده همه</button></header><div className="ir-student-home-svg__videos"><article><div className="ir-student-home-svg__video-cover is-algebra"><button type="button" aria-label="پخش رفع اشکال ریاضی" onClick={()=>onNavigate?.('student/content/free-algebra')}>{icon('play')}</button><time>۱۲:۴۵</time></div><h3>رفع اشکال ریاضی نهم</h3><p>آقای محمد صادقی</p></article><article><div className="ir-student-home-svg__video-cover is-forces"><button type="button" aria-label="پخش آموزش نیروها" onClick={()=>onNavigate?.('student/content/free-forces')}>{icon('play')}</button></div><h3>نیروها</h3><p>آموزش مفاهیم فیزیک</p></article></div><header className="ir-student-home-svg__heading ir-student-home-svg__continue-heading"><h2>ادامه یادگیری</h2></header><article className="ir-student-home-svg__continue"><h3>فیزیک پیش‌دانشگاهی - مکانیک</h3><p>قسمت ۴ از ۱۲ · ۶۲٪ پیشرفت</p><div><span/></div><button type="button" onClick={()=>onNavigate?.('student/content/mechanics')}>ادامه مشاهده</button></article><nav className="ir-student-home-svg__dock" aria-label="ناوبری دانش‌آموز"><button type="button" onClick={()=>onNavigate?.('student/profile')}><img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="پروفایل آراد"/></button><button type="button" onClick={()=>onNavigate?.('student/classes')}>{icon('calendar')}</button><button type="button" className="is-center" onClick={()=>onNavigate?.('student/ask')}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button><button type="button" onClick={()=>onNavigate?.('student/ask')}>{icon('spark')}</button><button type="button" onClick={()=>onNavigate?.('student/home')}>{icon('home')}</button></nav></section>;else if(kind==='home')body=<section className="ir-svg-home"><header><span><small>سلام آراد 👋</small><h2>{title}</h2></span><i>آ</i></header><article className="ir-svg-hero">{icon(id.startsWith('family')?'user':'spark')}<span><small>{id.startsWith('family')?'خانواده شما':'ادامه مسیر یادگیری'}</small><strong>{id.startsWith('family')?'۲ دانش‌آموز فعال':'ریاضی پایه هشتم'}</strong><p>{id.startsWith('family')?'همه فعالیت‌ها در یک نگاه':'فصل چهارم · معادله‌ها'}</p></span><button onClick={()=>onNavigate?.(next)}>{icon('play')}</button></article><h3>دسترسی سریع</h3>{rows.map(([a,b,c])=><button className="ir-svg-card" key={a} onClick={()=>onNavigate?.(next)}>{icon(c)}<span><strong>{a}</strong><small>{b}</small></span>{icon('back')}</button>)}</section>;
 else if(kind==='form')body=<form className="ir-svg-form" onSubmit={submitPrototypeForm}><h2>{title}</h2><p>اطلاعات موردنیاز را کامل کنید.</p><label><span>نام و نام خانوادگی</span><input value={draft.name} onChange={event=>setDraft(current=>({...current,name:event.target.value}))} placeholder="وارد کنید"/></label><label><span>موضوع یا عنوان</span><input value={draft.title} onChange={event=>setDraft(current=>({...current,title:event.target.value}))} placeholder="وارد کنید"/></label><label><span>پایه تحصیلی</span><input value={draft.grade} onChange={event=>setDraft(current=>({...current,grade:event.target.value}))} placeholder="وارد کنید"/></label><label><span>زمان پیشنهادی</span><input value={draft.time} onChange={event=>setDraft(current=>({...current,time:event.target.value}))} placeholder="وارد کنید"/></label><label><span>توضیحات</span><textarea value={draft.description} onChange={event=>setDraft(current=>({...current,description:event.target.value}))} placeholder="جزئیات بیشتر"/></label><button type="submit" className="ir-svg-primary">ثبت و ادامه</button></form>;
 else if(kind==='overlay')body=<section className="ir-svg-overlay"><div/><article><i/><h2>{title}</h2><p>گزینه موردنظر را انتخاب کنید.</p>{['انتخاب از گالری','انتخاب فایل','تأیید و ادامه'].map((item,index)=><button key={item} onClick={()=>onNavigate?.(next)}>{icon(index===0?'user':index===1?'paperclip':'check')}<span>{item}</span></button>)}</article></section>;
 else if(kind==='success')body=<section className="ir-svg-success"><i>{icon('check')}</i><h2>{title}</h2><p>عملیات با موفقیت انجام شد و نتیجه در حساب شما ثبت شد.</p><button className="ir-svg-primary" onClick={()=>onNavigate?.(next)}>مشاهده جزئیات</button><button onClick={()=>onNavigate?.('student/home')}>بازگشت</button></section>;
 else if(kind==='video')body=<section className="ir-svg-video"><article><span dir="ltr">DEMONSTRATION · EQUATIONS</span><b dir="ltr">2x + 5 = 17</b><button type="button" aria-label="پخش و ثبت پیشرفت" onClick={openPrototypeContent}>{icon('play')}</button></article><h2>{title}</h2><p>{firstContent?.title||'حل معادله‌های درجه اول · جلسه سوم'}</p></section>;
 else if(kind==='course')body=<section className="ir-svg-course"><article><button type="button" aria-label="پخش دوره" onClick={openPrototypeContent}>{icon('play')}</button></article><h2>{firstContent?.title||title}</h2><p>مدرس: {firstContent?.provider||'مدرس تأییدشده'} · امتیاز {IrancellFormatPersianNumber(firstContent?.rating||0)}</p>{rows.map(([a,b,c])=><button type="button" className="ir-svg-card" key={a} onClick={openPrototypeContent}>{icon(c)}<span><strong>{a}</strong><small>{b}</small></span>{icon('play')}</button>)}<button type="button" className="ir-svg-primary" onClick={openPrototypeContent}>شروع یادگیری</button></section>;
 else if(kind==='profile')body=<section className="ir-svg-profile"><i>{String(state.identity.usersById?.[state.session.currentUserId]?.name||'ک').charAt(0)}</i><h2>{state.identity.usersById?.[state.session.currentUserId]?.name||title}</h2><p>اطلاعات حساب، دستاوردها و تنظیمات</p>{rows.map(([a,b,c])=><button type="button" className="ir-svg-card" key={a} onClick={()=>onNavigate?.(profileRoute)}>{icon(c)}<span><strong>{a}</strong><small>{b}</small></span>{icon('back')}</button>)}</section>;
 else if(kind==='settings')body=<section className="ir-svg-settings"><h2>{title}</h2>{['اعلان‌ها','حریم خصوصی','موقعیت مکانی','دوربین و میکروفن','امنیت حساب'].map((item,index)=><button type="button" key={item} aria-pressed={enabled||index<2} onClick={()=>togglePrototypeSetting(item,index)}><span>{icon(index<2?'shield':'info')}<b>{item}</b></span><i className={enabled||index<2?'is-on':''}><em/></i></button>)}{id.includes('delete')&&<button type="button" className="ir-svg-danger" onClick={()=>onNavigate?.('student/privacy/delete')}>حذف اطلاعات</button>}</section>;
 else if(kind==='payment')body=<section className="ir-svg-payment"><article>{icon('wallet')}<span><small>مبلغ قابل پرداخت</small><strong>{IrancellFormatCurrency(pendingPayment?.amount||0)}</strong></span></article>{rows.slice(0,2).map(([a,b,c],index)=><button type="button" className={selected===index?'is-selected':''} aria-pressed={selected===index} onClick={()=>setSelected(index)} key={a}>{icon(c)}<span><strong>{a}</strong><small>{b}</small></span>{selected===index&&icon('check')}</button>)}<button type="button" className="ir-svg-primary" disabled={!pendingPayment} onClick={completePrototypePayment}>پرداخت و ادامه</button></section>;
 else if(kind==='rating')body=<section className="ir-svg-rating"><i>س</i><h2>{title}</h2><p>تجربه خود را با ما به اشتراک بگذارید.</p><div>{[1,2,3,4,5].map(value=><button type="button" className={rating>=value?'is-active':''} aria-label={`${value} ستاره`} aria-pressed={rating===value} onClick={()=>setRating(value)} key={value}>{icon('star')}</button>)}</div><textarea value={feedback} onChange={event=>setFeedback(event.target.value)} placeholder="نظر خود را بنویسید"/><button type="button" className="ir-svg-primary" disabled={!completedSession} onClick={submitPrototypeRating}>ثبت نظر</button></section>;
 else if(id==='student-courses')body=<IrancellPrototypeStudentCoursesPage onNavigate={onNavigate}/>;else body=<section className="ir-svg-list"><label><input placeholder="جست‌وجو"/>{icon('search')}</label>{rows.map(([a,b,c])=><button className="ir-svg-card" key={a} onClick={()=>onNavigate?.(next)}>{icon(c)}<span><strong>{a}</strong><small>{b}</small></span>{icon('back')}</button>)}<button className="ir-svg-primary" onClick={()=>onNavigate?.(next)}>ادامه</button></section>;
 const dedicatedChromeIds=['student-home','student-dashboard','student-courses','family-home','family-children','chisty-ai-search','chisty-ai-search-1','chisty-ai-results','chisty-ai-generating'],hideHeader=dedicatedChromeIds.includes(id)||['onboarding','roles','progress','search','overlay','success','video'].includes(kind),dockVisible=!dedicatedChromeIds.includes(id)&&!['onboarding','roles','progress','overlay','success','video','form','course','payment','rating'].includes(kind),hideNav=!dockVisible;
 return <main className={`ir-svg-prototype-page ir-svg-prototype-page--${kind}`} data-prototype-id={id} data-prototype-role={role} dir="rtl"><div className={`ir-svg-prototype-page__viewport ${hideHeader?'is-headerless':''} ${hideNav?'is-navless':''} ${dockVisible?'has-app-dock':''}`}>{!hideHeader&&<header><button type="button" aria-label="بازگشت به خانه" onClick={()=>onNavigate?.(homeRoute)}>{icon('back')}</button><h1>{title}</h1><span/></header>}<div className={`ir-svg-prototype-page__body ir-svg-prototype-page__body--${kind} ${id==='student-home'?'is-student-home':''}`}>{body}</div>{dockVisible&&<nav className="ir-svg-app-dock" style={{'--ir-dock-columns':dockItems.length}} aria-label="ناوبری اصلی">{dockItems.map(item=><button type="button" key={item.route} className={`${item.primary?'is-primary ':''}${item.isActive?'is-active':''}`.trim()} aria-label={item.label} aria-current={item.isActive?'page':undefined} onClick={()=>onNavigate?.(item.route)}>{item.route.endsWith('/profile')&&role==='student'?<img src={IRANCELL_PAGE_STUDENT_HOME_AVATAR} alt="پروفایل آراد"/>:icon(item.icon)}</button>)}</nav>}</div></main>
}

export const IRANCELL_PAGE_GENERIC_ROLE_SHORTCUTS=Object.freeze({
 student:[{title:'مرکز یادگیری',description:'دوره‌ها و محتوای پیشنهادی را ادامه دهید.',route:'student/learning'},{title:'درخواست مدرس',description:'برای رفع اشکال یک درخواست جدید ثبت کنید.',route:'student/requests'},{title:'کلاس‌های من',description:'جلسه‌ها و وضعیت ورود را پیگیری کنید.',route:'student/classes'}],
 parent:[{title:'فرزندان من',description:'پروفایل‌ها و رابطه‌های تأییدشده را مدیریت کنید.',route:'parent/children'},{title:'رضایت‌ها',description:'مجوزهای کلاس‌های فرزند را بررسی کنید.',route:'parent/consents'},{title:'پرداخت امن',description:'پرداخت‌ها و رسیدهای کلاس را ببینید.',route:'parent/payments'}],
 teacher:[{title:'درخواست‌های جدید',description:'درخواست‌های مرتبط با تخصص خود را ببینید.',route:'teacher/requests'},{title:'تقویم تدریس',description:'زمان‌بندی جلسه‌های آینده را مدیریت کنید.',route:'teacher/calendar'},{title:'کیفیت تدریس',description:'بازخورد و امتیاز خدمت را پیگیری کنید.',route:'teacher/quality'}],
 academy:[{title:'تقاضاهای جدید',description:'درخواست‌های قابل پاسخ را بررسی کنید.',route:'academy/requests'},{title:'مدیریت مدرس‌ها',description:'مدرس‌های آموزشگاه و وضعیت آن‌ها را ببینید.',route:'academy/teachers'},{title:'گزارش عملکرد',description:'شاخص‌های کلاس، کیفیت و درآمد را تحلیل کنید.',route:'academy/reports'}],
 'content-provider':[{title:'کتابخانه من',description:'محتوا و وضعیت انتشار را مدیریت کنید.',route:'content/library'},{title:'بارگذاری محتوا',description:'محتوای جدید را برای بررسی ارسال کنید.',route:'content/upload'},{title:'تحلیل محتوا',description:'بازدید، تکمیل و امتیاز را بررسی کنید.',route:'content/analytics'}],
 admin:[{title:'سلامت سامانه',description:'وضعیت سرویس‌ها و رخدادها را پایش کنید.',route:'admin/system'},{title:'مدیریت کاربران',description:'حساب‌ها، نقش‌ها و دسترسی‌ها را بررسی کنید.',route:'admin/users'},{title:'گزارش‌های مدیریتی',description:'شاخص‌های کلیدی محصول و عملیات را ببینید.',route:'admin/reports'}],
 shared:[{title:'اعلان‌ها',description:'پیام‌ها و اقدام‌های مهم را بررسی کنید.',route:'notifications'},{title:'مرکز راهنما',description:'پرسش‌های متداول و مسیر پشتیبانی را ببینید.',route:'help'}]
});

export function IrancellPageGenericResolveItems(config,shortcuts){
 const provided=Array.isArray(config.items)?config.items:[];
 const placeholderTitles=['وضعیت جاری','امنیت و دسترسی','حالت‌های صفحه'];
 const meaningful=provided.filter(item=>item&&!placeholderTitles.includes(item.title));
 if(meaningful.length)return meaningful.map((item,index)=>({...item,icon:item.icon||[Activity,ShieldCheck,TrendingUp][index%3]}));
 const searchable=`${config.title||''} ${config.description||''}`;
 const routes=shortcuts.map(item=>item.route);
 if(/مالی|پرداخت|تسویه|درآمد|تراکنش/.test(searchable))return[{title:'خلاصه مالی',description:'مبلغ‌های قابل پرداخت، تسویه‌شده و در انتظار را یکجا ببینید.',icon:WalletCards,route:routes[0]},{title:'سوابق و رسیدها',description:'جزئیات تراکنش‌ها و رسیدهای ثبت‌شده را بررسی کنید.',icon:Activity,route:routes[1]},{title:'کنترل امنیت پرداخت',description:'وضعیت پرداخت امن و موارد نیازمند پیگیری را مشاهده کنید.',icon:ShieldCheck,route:routes[2]}];
 if(/کلاس|تقویم|جلسه|حضور/.test(searchable))return[{title:'برنامه پیش رو',description:'کلاس‌ها و جلسه‌های آینده را بر اساس زمان مشاهده کنید.',icon:CalendarCheck,route:routes[0]},{title:'آمادگی و دسترسی',description:'وضعیت ورود، رضایت و پرداخت هر جلسه را بررسی کنید.',icon:ShieldCheck,route:routes[1]},{title:'سوابق کلاس',description:'کلاس‌های تکمیل‌شده، لغوشده و نتیجه خدمت را ببینید.',icon:Activity,route:routes[2]}];
 if(/کاربر|مدرس|آموزشگاه|فرزند|پروفایل|تولیدکننده/.test(searchable))return[{title:'اطلاعات اصلی',description:'مشخصات، نقش و اطلاعات تماس ثبت‌شده را مشاهده کنید.',icon:UsersRound,route:routes[0]},{title:'وضعیت تأیید',description:'وضعیت هویت، مدارک و دسترسی‌های حساب را بررسی کنید.',icon:ShieldCheck,route:routes[1]},{title:'فعالیت و عملکرد',description:'کلاس‌ها، محتوا و فعالیت‌های مرتبط با حساب را ببینید.',icon:TrendingUp,route:routes[2]}];
 if(/محتوا|کتابخانه|انتشار|بارگذاری/.test(searchable))return[{title:'محتوای فعال',description:'فهرست محتوا و وضعیت انتشار هر مورد را مدیریت کنید.',icon:BookOpen,route:routes[0]},{title:'کنترل کیفیت',description:'موارد نیازمند اصلاح یا بررسی را پیش از انتشار ببینید.',icon:ShieldCheck,route:routes[1]},{title:'عملکرد محتوا',description:'بازدید، تکمیل و امتیاز کاربران را تحلیل کنید.',icon:TrendingUp,route:routes[2]}];
 if(/درخواست|پیشنهاد|شکایت|بررسی|نظارت/.test(searchable))return[{title:'موارد جدید',description:'موارد تازه و نیازمند اقدام را در اولویت ببینید.',icon:Activity,route:routes[0]},{title:'در حال پیگیری',description:'وضعیت بررسی و آخرین اقدام انجام‌شده را مشاهده کنید.',icon:ShieldCheck,route:routes[1]},{title:'نتیجه و سابقه',description:'موارد تکمیل‌شده و تصمیم‌های ثبت‌شده را مرور کنید.',icon:CheckCircle2,route:routes[2]}];
 if(/گزارش|تحلیل|کیفیت|عملکرد/.test(searchable))return[{title:'شاخص‌های کلیدی',description:'خلاصه مهم‌ترین شاخص‌های این بخش را مشاهده کنید.',icon:Activity,route:routes[0]},{title:'روند عملکرد',description:'تغییرات عملکرد را در بازه‌های مختلف مقایسه کنید.',icon:TrendingUp,route:routes[1]},{title:'اقدام پیشنهادی',description:'موارد نیازمند توجه و پیشنهادهای بهبود را ببینید.',icon:ShieldCheck,route:routes[2]}];
 return[{title:'نمای کلی',description:'خلاصه وضعیت و موارد مهم این بخش را مشاهده کنید.',icon:Activity,route:routes[0]},{title:'اقدام‌های اصلی',description:'کارهای پرتکرار را سریع و مستقیم انجام دهید.',icon:CheckCircle2,route:routes[1]},{title:'امنیت و دسترسی',description:'وضعیت دسترسی و حفاظت از اطلاعات را بررسی کنید.',icon:ShieldCheck,route:routes[2]}];
}

export function IrancellPageGenericResolveMetrics(state,role){
 const actorId=state.session.currentUserId;
 const allClasses=Object.values(state.classroom.sessionsById);
 const allRequests=Object.values(state.marketplace.requestsById);
 const publishedContent=Object.values(state.content.catalogueById).filter(item=>item.status==='published');
 if(role==='student')return[{label:'کلاس‌های من',value:IrancellFormatPersianNumber(allClasses.filter(item=>item.studentId===actorId).length),icon:CalendarCheck},{label:'محتوای آموزشی',value:IrancellFormatPersianNumber(publishedContent.length),icon:BookOpen},{label:'درخواست‌های من',value:IrancellFormatPersianNumber(allRequests.filter(item=>item.studentId===actorId).length),icon:GraduationCap},{label:'اعلان جدید',value:IrancellFormatPersianNumber(state.notifications.unreadCount||0),icon:ShieldCheck}];
 if(role==='parent')return[{label:'فرزند متصل',value:IrancellFormatPersianNumber(Object.values(state.identity.relationshipsById).filter(item=>item.parentId===actorId&&item.status==='active').length),icon:UsersRound},{label:'کلاس فعال',value:IrancellFormatPersianNumber(allClasses.length),icon:CalendarCheck},{label:'رضایت در انتظار',value:IrancellFormatPersianNumber(Object.values(state.consent.gatesBySessionId).filter(item=>item.status!=='signed').length),icon:ShieldCheck},{label:'پرداخت ثبت‌شده',value:IrancellFormatPersianNumber(Object.keys(state.payment.paymentsById).length),icon:WalletCards}];
 if(role==='teacher'||role==='academy')return[{label:'کلاس‌های من',value:IrancellFormatPersianNumber(allClasses.filter(item=>item.providerId===actorId).length),icon:CalendarCheck},{label:'درخواست‌های بازار',value:IrancellFormatPersianNumber(allRequests.length),icon:GraduationCap},{label:'امتیاز کیفیت',value:`${IrancellFormatPersianNumber(state.quality.qualityScoresByProviderId[actorId]||0)}٪`,icon:Activity},{label:'اعلان جدید',value:IrancellFormatPersianNumber(state.notifications.unreadCount||0),icon:ShieldCheck}];
 if(role==='content-provider')return[{label:'محتوای منتشرشده',value:IrancellFormatPersianNumber(publishedContent.length),icon:BookOpen},{label:'بازدید کل',value:IrancellFormatPersianNumber(publishedContent.reduce((sum,item)=>sum+(Number(item.views)||0),0)),icon:TrendingUp},{label:'در انتظار بررسی',value:IrancellFormatPersianNumber(Object.values(state.content.catalogueById).filter(item=>item.status!=='published').length),icon:ShieldCheck},{label:'میانگین امتیاز',value:(publishedContent.reduce((sum,item)=>sum+(Number(item.rating)||0),0)/Math.max(publishedContent.length,1)).toLocaleString('fa-IR',{maximumFractionDigits:1}),icon:Activity}];
 if(role==='shared')return[{label:'اعلان جدید',value:IrancellFormatPersianNumber(state.notifications.unreadCount||0),icon:ShieldCheck},{label:'کلاس ثبت‌شده',value:IrancellFormatPersianNumber(allClasses.length),icon:CalendarCheck},{label:'محتوای آموزشی',value:IrancellFormatPersianNumber(publishedContent.length),icon:BookOpen},{label:'وضعیت خدمات',value:'فعال',icon:CheckCircle2}];
 return[{label:'کاربران فعال',value:IrancellFormatPersianNumber(state.admin.reports.mau||0),icon:Users},{label:'کلاس‌های ثبت‌شده',value:IrancellFormatPersianNumber(allClasses.length),icon:CalendarCheck},{label:'درخواست‌های فعال',value:IrancellFormatPersianNumber(allRequests.length),icon:GraduationCap},{label:'سلامت کلاس‌ها',value:`${IrancellFormatPersianNumber(state.admin.reports.classSuccess||0)}٪`,icon:Activity}];
}

export function IrancellSharedGenericRoutePage({config,onNavigate}){
 const{state}=useIrancellStore();
 const role=IRANCELL_PAGE_GENERIC_ROLE_SHORTCUTS[config.eyebrow]?config.eyebrow:(IRANCELL_PAGE_GENERIC_ROLE_SHORTCUTS[state.session.activeRole]?state.session.activeRole:'shared');
 const shortcuts=IRANCELL_PAGE_GENERIC_ROLE_SHORTCUTS[role]||IRANCELL_PAGE_GENERIC_ROLE_SHORTCUTS.shared;
 const roleLabels={student:'دانش‌آموز',parent:'خانواده',teacher:'مدرس',academy:'آموزشگاه','content-provider':'تولید محتوا',admin:'مدیریت سامانه',shared:'خدمات کاربری'};
 const metrics=IrancellPageGenericResolveMetrics(state,role);
 const moduleItems=IrancellPageGenericResolveItems(config,shortcuts);
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <section className="ir-generic-page" dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,maxWidth:'none',minHeight:'100%',flexDirection:'column',gap:'18px',margin:0,padding:'clamp(14px,3vw,28px)',direction:'rtl',color:'#202024',background:'#FFFAE0',fontFamily:font}}>
  <IrancellPageHeader eyebrow={roleLabels[role]} title={config.title} description={config.description} actions={shortcuts[0]&&<IrancellButton onClick={()=>onNavigate?.(shortcuts[0].route)}>{shortcuts[0].title}</IrancellButton>}/>
  <IrancellTrustStrip/>
  <div className="ir-stats-grid" style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))',gap:'12px'}}>
   {metrics.map(item=><IrancellStatCard key={item.label}{...item}/>)}
  </div>
  <div className="ir-dashboard-grid ir-generic-page__grid" style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,390px),1fr))',alignItems:'stretch',gap:'16px'}}>
   <IrancellCard title="امکانات این بخش" subtitle="اطلاعات مهم و اقدام‌های اصلی در یک نگاه" style={{height:'100%'}}>
    <IrancellGenericModulePage title={config.title} description={config.description} items={moduleItems} onNavigate={onNavigate}/>
   </IrancellCard>
   <IrancellCard title="دسترسی سریع" subtitle="مسیرهای مرتبط با نقش فعال" style={{height:'100%'}}>
    <div style={{display:'grid',width:'100%',minWidth:0,gap:'9px'}}>
     {shortcuts.map((item,index)=><article className="ir-action-row" key={item.route} style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'38px minmax(0,1fr) auto',alignItems:'center',gap:'11px',margin:0,padding:'12px',background:'#FFFEFA',border:'1px solid #E7E2CC',borderRadius:'15px',fontFamily:font}}>
      <span aria-hidden="true" style={{display:'grid',width:'38px',height:'38px',placeItems:'center',color:'#665500',background:'#FFF3AE',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:900}}>{IrancellFormatPersianNumber(index+1)}</span>
      <div style={{display:'flex',minWidth:0,flexDirection:'column',gap:'2px'}}>
       <strong style={{overflowWrap:'anywhere',color:'#202024',fontFamily:font,fontSize:'12px',fontWeight:900,lineHeight:1.7}}>{item.title}</strong>
       <small style={{overflowWrap:'anywhere',color:'#777982',fontFamily:font,fontSize:'10px',fontWeight:500,lineHeight:1.7}}>{item.description}</small>
      </div>
      <button type="button" onClick={()=>onNavigate?.(item.route)} aria-label={`مشاهده ${item.title}`} style={{boxSizing:'border-box',display:'inline-flex',minWidth:'78px',minHeight:'36px',alignItems:'center',justifyContent:'center',gap:'5px',margin:0,padding:'7px 11px',cursor:'pointer',color:'#202024',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'10px',fontFamily:font,fontSize:'10px',fontWeight:900}}><span>مشاهده</span><ArrowLeft size={15}/></button>
     </article>)}
    </div>
   </IrancellCard>
  </div>
 </section>
}
