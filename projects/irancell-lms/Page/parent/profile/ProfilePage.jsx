export function IrancellParentProfilePage({params,onNavigate,screen}){
 const{state,dispatch}=useIrancellStore();
 const parentId=state.session.currentUserId||'parent-1';
 const parent=state.identity.usersById[parentId];
 const route=screen?.route||'parent/profile';
 const family=state.family||{};
 const profile=family.profilesByParentId?.[parentId]||{};
 const security=family.securityByParentId?.[parentId]||{};
 const relationships=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active');
 const children=relationships.map(item=>state.identity.usersById[item.childId]).filter(Boolean);
 const[selectedChildId,setSelectedChildId]=useState(params?.child||children[0]?.id||'');
 const[profileForm,setProfileForm]=useState({name:parent?.name||'',mobile:parent?.mobile||'',emergencyMobile:profile.emergencyMobile||'',email:profile.email||'',address:profile.address||'',city:profile.city||'',province:profile.province||''});
 const[controlDraft,setControlDraft]=useState(()=>({...family.controlsByChildId?.[params?.child||children[0]?.id]||{}}));
 const[notificationFilter,setNotificationFilter]=useState('all');
 const[selectedNotificationId,setSelectedNotificationId]=useState('');
 const[guardianInviteOpen,setGuardianInviteOpen]=useState(false);
 const[guardianInviteForm,setGuardianInviteForm]=useState({name:profile.secondaryGuardianName||'',mobile:profile.secondaryGuardianMobile||''});
 const[securityPanel,setSecurityPanel]=useState('');
 const[passwordForm,setPasswordForm]=useState({password:'',confirmation:''});
 const[passwordError,setPasswordError]=useState('');
 const notifications=Object.values(family.notificationItemsById||{}).filter(item=>item.parentId===parentId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 const unreadCount=notifications.filter(item=>!item.read).length;
 const importantCount=notifications.filter(item=>item.importance==='important').length;

 useEffect(function IrancellParentProfileSyncControls(){
  if(!selectedChildId)return;
  setControlDraft({...family.controlsByChildId?.[selectedChildId]||{}})
 },[selectedChildId]);

 function saveProfile(){
  dispatch({type:'IRANCELL_PARENT_PROFILE_UPDATE',profile:profileForm});
  onNavigate?.('parent/profile')
 }

 function saveControls(){
  if(!selectedChildId)return;
  dispatch({type:'IRANCELL_PARENT_UPDATE_CONTROLS',childId:selectedChildId,controls:controlDraft})
 }

 function toggleControl(key){
  setControlDraft(current=>({...current,[key]:!current[key]}))
 }

 function updateSecurity(patch){
  dispatch({type:'IRANCELL_PARENT_SECURITY_UPDATE',security:patch})
 }

 function submitGuardianInvite(event){
  event.preventDefault();
  const name=String(guardianInviteForm.name||'').trim(),mobile=String(guardianInviteForm.mobile||'').replace(/\D/g,'');
  if(!name||!/^09\d{9}$/.test(mobile))return;
  dispatch({type:'IRANCELL_PARENT_GUARDIAN_INVITE',name,mobile});
  setGuardianInviteOpen(false)
 }

 function submitPasswordUpdate(event){
  event.preventDefault();
  if(String(passwordForm.password||'').length<6){setPasswordError('رمز عبور باید حداقل ۶ کاراکتر باشد.');return}
  if(passwordForm.password!==passwordForm.confirmation){setPasswordError('تکرار رمز عبور با رمز جدید یکسان نیست.');return}
  updateSecurity({passwordActive:true,passwordUpdatedAt:new Date().toISOString()});
  setPasswordForm({password:'',confirmation:''});
  setPasswordError('');
  setSecurityPanel('')
 }

 function openNotification(item){
  if(!item.read)dispatch({type:'IRANCELL_PARENT_NOTIFICATION_READ',notificationId:item.id});
  setSelectedNotificationId(item.id)
 }

 function familyHeader(title,description,backRoute='parent/profile'){
  return <header className="ir-family-settings-header">
   <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.(backRoute)}>←</button>
   <div><h1>{title}</h1><p>{description}</p></div>
  </header>
 }

 if(!parent)return <IrancellStatePanel state="error" title="حساب خانواده پیدا نشد" description="اطلاعات هویتی این حساب در دسترس نیست."/>;

 if(route==='parent/profile/account'){
  return <section className="ir-family-settings-page">
   {familyHeader('اطلاعات حساب خانواده','مدیریت اطلاعات اصلی خانواده و شماره‌های تماس')}
   <article className="ir-family-account-card">
    <span>{String(parent.name||'خ').trim().charAt(0)}</span>
    <div><h2>{parent.name}</h2><p>سرپرست خانواده</p></div>
    <dl><div><dt>شماره موبایل</dt><dd dir="ltr">{parent.mobile}</dd></div><div><dt>کد ملی</dt><dd>{profile.nationalIdMasked||'ثبت شده'}</dd></div><div><dt>ایمیل</dt><dd>{profile.email||'ثبت نشده'}</dd></div></dl>
   </article>

   <section className="ir-family-account-form">
    <label><span>نام و نام خانوادگی سرپرست</span><input value={profileForm.name} onChange={event=>setProfileForm(current=>({...current,name:event.target.value}))}/></label>
    <label><span>شماره تماس اصلی</span><input type="tel" dir="ltr" value={profileForm.mobile} onChange={event=>setProfileForm(current=>({...current,mobile:event.target.value}))}/></label>
    <label><span>شماره تماس اضطراری</span><input type="tel" dir="ltr" value={profileForm.emergencyMobile} onChange={event=>setProfileForm(current=>({...current,emergencyMobile:event.target.value}))} placeholder="وارد کنید..."/></label>
    <label><span>ایمیل</span><input type="email" dir="ltr" value={profileForm.email} onChange={event=>setProfileForm(current=>({...current,email:event.target.value}))}/></label>
    <label><span>آدرس محل سکونت</span><input value={profileForm.address} onChange={event=>setProfileForm(current=>({...current,address:event.target.value}))}/></label>
    <label><span>شهر و استان</span><input value={profileForm.city} onChange={event=>setProfileForm(current=>({...current,city:event.target.value,province:event.target.value}))}/></label>
   </section>

   <button type="button" className="ir-family-settings-primary" onClick={saveProfile}>ذخیره تغییرات</button>
   <button type="button" className="ir-family-settings-cancel" onClick={()=>onNavigate?.('parent/profile')}>لغو تغییرات</button>
  </section>
 }

 if(route==='parent/profile/permissions'){
  return <section className="ir-family-settings-page">
   {familyHeader('مجوزها و امضایی','مدیریت مجوزهای والدین، فرزندان و رضایت‌نامه‌ها')}
   <section className="ir-family-permissions-card">
    <h2>والدین و سرپرستان مجاز</h2>
    <article><span>♙</span><div><strong>{parent.name} (سرپرست اصلی)</strong><small>حساب خانواده</small></div><b>تأیید شده</b></article>
    <article><span>♙</span><div><strong>{profile.secondaryGuardianName||'سرپرست دوم'}</strong><small>{profile.secondaryGuardianMobile||'والد دوم'}</small></div><b className="is-pending">{profile.secondaryGuardianStatus==='pending'?'در انتظار تأیید':profile.secondaryGuardianName?'تأیید شده':'ثبت نشده'}</b></article>
    <button type="button" onClick={()=>setGuardianInviteOpen(true)}>افزودن والد یا سرپرست</button>
   </section>

   <section className="ir-family-permissions-card">
    <h2>فرزندان متصل به حساب</h2>
    {children.map(child=><article key={child.id}><span>{String(child.name||'د').trim().charAt(0)}</span><div><strong>{child.name}</strong><small>{child.grade}</small></div><b>فعال</b></article>)}
   </section>

   <section className="ir-family-permissions-card">
    <h2>رضایت‌نامه‌ها</h2>
    <article><div><strong>رضایت‌نامه کلاس آنلاین</strong></div><b>امضا شده</b></article>
    <article><div><strong>رضایت‌نامه پرداخت و رزرو</strong></div><b className="is-pending">نیازمند بررسی</b></article>
    <article><div><strong>استفاده از خدمات هوش مصنوعی</strong></div><b>فعال</b></article>
    <button type="button" className="is-link" onClick={()=>onNavigate?.('parent/consents')}>مشاهده و مدیریت رضایت‌نامه‌ها</button>
   </section>

   {guardianInviteOpen&&<div className="ir-family-form-overlay" onMouseDown={()=>setGuardianInviteOpen(false)}>
    <form className="ir-family-form-sheet" onSubmit={submitGuardianInvite} onMouseDown={event=>event.stopPropagation()}>
     <span className="ir-family-form-sheet__handle"/>
     <header><h2>افزودن والد یا سرپرست</h2><button type="button" onClick={()=>setGuardianInviteOpen(false)}>×</button></header>
     <label><span>نام و نام خانوادگی</span><input value={guardianInviteForm.name} onChange={event=>setGuardianInviteForm(current=>({...current,name:event.target.value}))} placeholder="نام سرپرست"/></label>
     <label><span>شماره موبایل</span><input type="tel" dir="ltr" inputMode="numeric" value={guardianInviteForm.mobile} onChange={event=>setGuardianInviteForm(current=>({...current,mobile:event.target.value.replace(/\D/g,'').slice(0,11)}))} placeholder="09xxxxxxxxx"/></label>
     <button type="submit" disabled={!guardianInviteForm.name.trim()||!/^09\d{9}$/.test(guardianInviteForm.mobile)}>ارسال دعوت‌نامه</button>
    </form>
   </div>}
  </section>
 }

 if(route==='parent/profile/family-control'){
  const activeChild=children.find(child=>child.id===selectedChildId)||children[0]||null;
  return <section className="ir-family-settings-page">
   {familyHeader('کنترل خانواده','مدیریت دسترسی‌ها و محدودیت‌های فرزندان')}
   <div className="ir-family-control-tabs">{children.map(child=><button type="button" key={child.id} className={selectedChildId===child.id?'is-active':''} onClick={()=>setSelectedChildId(child.id)}>{child.name}</button>)}</div>

   {activeChild&&<section className="ir-family-control-card">
    <h2>دسترسی‌ها</h2>
    {[
     ['onlineClass','دسترسی به کلاس آنلاین'],
     ['recordedContent','دسترسی به محتوای ضبط‌شده'],
     ['askTeacher','امکان ارسال سؤال به معلم'],
     ['directPayment','امکان پرداخت مستقیم'],
     ['parentApprovalForClass','نیاز به تأیید والد برای رزرو کلاس'],
     ['parentApprovalForPanelExit','خروج از پنل با تأیید والد']
    ].map(([key,label])=><article key={key}><span>{label}</span><button type="button" role="switch" aria-checked={Boolean(controlDraft[key])} className={controlDraft[key]?'is-on':''} onClick={()=>toggleControl(key)}><i/></button></article>)}
   </section>}

   <section className="ir-family-control-time">
    <h2>محدودیت زمانی</h2>
    <div><span>ساعت مجاز استفاده روزانه:</span><strong>{IrancellFormatPersianNumber(controlDraft.dailyHours||2)} ساعت</strong></div>
    <div><span>بازه مجاز:</span><strong>{controlDraft.allowedFrom||'16:00'} تا {controlDraft.allowedTo||'20:00'}</strong></div>
    <label><span>از</span><input type="time" value={controlDraft.allowedFrom||'16:00'} onChange={event=>setControlDraft(current=>({...current,allowedFrom:event.target.value}))}/></label>
    <label><span>تا</span><input type="time" value={controlDraft.allowedTo||'20:00'} onChange={event=>setControlDraft(current=>({...current,allowedTo:event.target.value}))}/></label>
   </section>

   <button type="button" className="ir-family-settings-primary" onClick={saveControls}>ذخیره تنظیمات کنترل خانواده</button>
  </section>
 }

 if(route==='parent/profile/security'){
  return <section className="ir-family-settings-page">
   {familyHeader('امنیت حساب','رمز عبور، ورود امن و نشست‌های فعال')}
   <section className="ir-family-security-status">
    <span>⬡</span><div><h2>وضعیت امنیت حساب: خوب</h2><p>✓ شماره موبایل تأیید شده</p><p>✓ Face ID {security.faceIdActive?'فعال':'غیرفعال'}</p><p>✓ رمز عبور فعال</p></div>
   </section>
   <div className="ir-family-security-list">
    <button type="button" onClick={()=>setSecurityPanel('password')}><span>●</span><strong>تغییر رمز عبور</strong><b>‹</b></button>
    <button type="button" onClick={()=>updateSecurity({pinActive:!security.pinActive})}><span>▦</span><strong>مدیریت PIN</strong><b>{security.pinActive?'فعال':'غیرفعال'}</b></button>
    <button type="button" onClick={()=>updateSecurity({faceIdActive:!security.faceIdActive})}><span>◎</span><strong>فعال‌سازی Face ID</strong><b>{security.faceIdActive?'فعال':'غیرفعال'}</b></button>
    <button type="button" onClick={()=>updateSecurity({fingerprintActive:!security.fingerprintActive})}><span>◉</span><strong>فعال‌سازی اثر انگشت</strong><b>{security.fingerprintActive?'فعال':'غیرفعال'}</b></button>
    <button type="button" onClick={()=>setSecurityPanel('devices')}><span>▯</span><strong>دستگاه‌های متصل</strong><b>{IrancellFormatPersianNumber(security.connectedDevices||0)}</b></button>
    <button type="button" onClick={()=>setSecurityPanel('sessions')}><span>□</span><strong>نشست‌های فعال</strong><b>{IrancellFormatPersianNumber(security.activeSessions||0)}</b></button>
    <button type="button" onClick={()=>setSecurityPanel('history')}><span>◷</span><strong>تاریخچه ورود</strong><b>‹</b></button>
   </div>
   <button type="button" className="ir-family-security-logout" onClick={()=>dispatch({type:'IRANCELL_AUTH_LOGOUT'})}>خروج از همه دستگاه‌ها</button>
   <p className="ir-family-security-note">برای تغییر تنظیمات حساس، تأیید والد یا رمز عبور لازم است.</p>

   {securityPanel==='password'&&<div className="ir-family-form-overlay" onMouseDown={()=>setSecurityPanel('')}>
    <form className="ir-family-form-sheet" onSubmit={submitPasswordUpdate} onMouseDown={event=>event.stopPropagation()}>
     <span className="ir-family-form-sheet__handle"/>
     <header><h2>تغییر رمز عبور</h2><button type="button" onClick={()=>setSecurityPanel('')}>×</button></header>
     <label><span>رمز عبور جدید</span><input type="password" value={passwordForm.password} onChange={event=>{setPasswordForm(current=>({...current,password:event.target.value}));setPasswordError('')}}/></label>
     <label><span>تکرار رمز عبور</span><input type="password" value={passwordForm.confirmation} onChange={event=>{setPasswordForm(current=>({...current,confirmation:event.target.value}));setPasswordError('')}}/></label>
     {passwordError&&<p role="alert">{passwordError}</p>}
     <button type="submit">ثبت رمز عبور جدید</button>
    </form>
   </div>}

   {['devices','sessions','history'].includes(securityPanel)&&<div className="ir-family-form-overlay" onMouseDown={()=>setSecurityPanel('')}>
    <section className="ir-family-form-sheet" onMouseDown={event=>event.stopPropagation()}>
     <span className="ir-family-form-sheet__handle"/>
     <header><h2>{securityPanel==='devices'?'دستگاه‌های متصل':securityPanel==='sessions'?'نشست‌های فعال':'تاریخچه ورود'}</h2><button type="button" onClick={()=>setSecurityPanel('')}>×</button></header>
     <dl>
      <div><dt>دستگاه فعلی</dt><dd>مرورگر فعلی · فعال</dd></div>
      <div><dt>تعداد</dt><dd>{IrancellFormatPersianNumber(securityPanel==='devices'?security.connectedDevices||0:securityPanel==='sessions'?security.activeSessions||0:3)}</dd></div>
      <div><dt>آخرین ورود</dt><dd>{security.lastLoginAt?new Date(security.lastLoginAt).toLocaleString('fa-IR'):'ثبت نشده'}</dd></div>
     </dl>
     <button type="button" onClick={()=>setSecurityPanel('')}>بستن</button>
    </section>
   </div>}
  </section>
 }

 if(route==='parent/profile/notifications'){
  const filters=[{id:'all',label:'همه'},{id:'children',label:'فرزندان'},{id:'payments',label:'پرداخت‌ها'},{id:'class',label:'کلاس‌ها'},{id:'unread',label:'خوانده‌نشده'}];
  const visible=notifications.filter(item=>notificationFilter==='all'||(notificationFilter==='unread'&&!item.read)||item.category===notificationFilter);
  const selectedNotification=notifications.find(item=>item.id===selectedNotificationId)||null;
  return <section className="ir-family-settings-page ir-family-notifications-page">
   {familyHeader('اعلان‌ها','مشاهده پیام‌ها، یادآوری‌ها و هشدارهای مهم خانواده')}
   <section className="ir-family-notifications-summary"><article><span>مهم</span><strong>{IrancellFormatPersianNumber(importantCount)}</strong></article><article><span>خوانده نشده</span><strong>{IrancellFormatPersianNumber(unreadCount)}</strong></article><article><span>همه اعلان‌ها</span><strong>{IrancellFormatPersianNumber(notifications.length)}</strong></article></section>
   <nav className="ir-family-notification-filters">{filters.map(filter=><button type="button" key={filter.id} className={notificationFilter===filter.id?'is-active':''} onClick={()=>setNotificationFilter(filter.id)}>{filter.label}</button>)}</nav>
   <div className="ir-family-notifications-list">
    {visible.map(item=><button type="button" key={item.id} className={`${item.read?'':'is-unread'} ${item.importance==='important'?'is-important':''}`} onClick={()=>openNotification(item)}>
     <span className={`is-${item.category}`}>{item.category==='class'?'□':item.category==='payments'?'▣':item.category==='security'?'⬡':item.category==='children'?'♙':'○'}</span>
     <div><header><small>{new Date(item.createdAt).toLocaleString('fa-IR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small>{!item.read&&<i/>}</header><strong>{item.title}</strong><p>{item.body}</p>{item.actionLabel&&<b>{item.actionLabel}</b>}</div>
     <em>‹</em>
    </button>)}
   </div>
   <button type="button" className="ir-family-notifications-read-all" onClick={()=>dispatch({type:'IRANCELL_PARENT_NOTIFICATIONS_READ_ALL'})}>علامت‌گذاری همه به‌عنوان خوانده‌شده</button>

   {selectedNotification&&<div className="ir-family-notification-overlay" onMouseDown={()=>setSelectedNotificationId('')}>
    <section onMouseDown={event=>event.stopPropagation()}>
     <button type="button" className="ir-family-notification-overlay__close" onClick={()=>setSelectedNotificationId('')}>×</button>
     <h2>{selectedNotification.title}</h2>
     <small>{new Date(selectedNotification.createdAt).toLocaleString('fa-IR')}</small>
     <span className="ir-family-notification-overlay__icon">{selectedNotification.category==='class'?'□':'!'}</span>
     <b>{selectedNotification.read?'خوانده‌شده':'جدید'}</b>
     <p>{selectedNotification.body}</p>
     <strong>فرزند: {children[0]?.name||'دانش‌آموز خانواده'}</strong>
     {selectedNotification.actionLabel&&<button type="button" className="ir-family-notification-overlay__action" onClick={()=>{setSelectedNotificationId('');onNavigate?.(selectedNotification.route)}}>{selectedNotification.actionLabel}</button>}
     <footer>علامت‌گذاری به‌عنوان خوانده‌شده</footer>
    </section>
   </div>}
  </section>
 }

 return <section className="ir-family-profile">
  <header><h1>حساب من</h1><p>مدیریت اطلاعات خانواده و تنظیمات امنیتی</p></header>
  <article className="ir-family-profile__identity">
   <div><span>{String(parent.name||'خ').trim().charAt(0)}</span><section><h2>{parent.name}</h2><p>✓ شماره موبایل تأیید شده</p><small>حساب تأیید شده ✓</small></section></div>
   <button type="button" onClick={()=>onNavigate?.('parent/profile/account')}>ویرایش پروفایل</button>
  </article>
  <nav className="ir-family-profile__menu">
   <button type="button" onClick={()=>onNavigate?.('parent/profile/account')}><span className="is-yellow">⌂</span><div><strong>اطلاعات حساب خانواده</strong><small>ویرایش نام، شماره تماس و اطلاعات پایه</small></div><b>‹</b></button>
   <button type="button" onClick={()=>onNavigate?.('parent/profile/permissions')}><span className="is-gray">⬡</span><div><strong>مجوزها و امضایی</strong><small>تأیید والدین و رضایت‌نامه‌ها</small></div><b>‹</b></button>
   <button type="button" onClick={()=>onNavigate?.('parent/profile/family-control')}><span className="is-yellow">▣</span><div><strong>کنترل والدین</strong><small>مدیریت دسترسی‌ها</small></div><b>‹</b></button>
   <button type="button" onClick={()=>onNavigate?.('parent/profile/security')}><span className="is-green">◉</span><div><strong>امنیت حساب</strong><small>رمز عبور، کد عبور و Face ID</small></div><b>‹</b></button>
   <button type="button" onClick={()=>onNavigate?.('parent/profile/notifications')}><span className="is-yellow">♢</span><div><strong>اعلان‌ها</strong><small>مدیریت پیامک و یادآوری‌ها</small></div><b>‹</b></button>
   <button type="button" onClick={()=>onNavigate?.('parent/support')}><span className="is-gray">○</span><div><strong>پشتیبانی</strong><small>پیگیری درخواست‌ها</small></div><b>‹</b></button>
  </nav>
 </section>
}