export function IrancellAdminSettingsPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const settings=state.settings||{demo:{enabled:true,showQuickProfiles:true,showGuidedExamples:true,offlineSimulation:false},appearance:{fontScale:'comfortable'}};
 const demo=settings.demo||{};
 const appearance=settings.appearance||{};
 const demoProfiles=Object.entries(IRANCELL_APP_CONFIG.demoMode?.profiles||{});

 function updateDemo(key,value){
  dispatch({type:'IRANCELL_ADMIN_SETTINGS_UPDATE',settings:{demo:{[key]:value}}})
 }

 function updateAppearance(key,value){
  dispatch({type:'IRANCELL_ADMIN_SETTINGS_UPDATE',settings:{appearance:{[key]:value}}})
 }

 function launchDemo(profileKey,profile){
  if(!demo.enabled)return;
  dispatch({type:'IRANCELL_DEMO_ACTIVATE_PROFILE',profileKey});
  onNavigate?.(profile.route)
 }

 function resetSettings(){
  dispatch({type:'IRANCELL_ADMIN_SETTINGS_RESET'})
 }

 return <section className="ir-admin-settings-page">
  <header className="ir-admin-settings-page__header">
   <div>
    <span>مدیریت سامانه</span>
    <h1>تنظیمات و حالت ارائه</h1>
    <p>ظاهر، سناریوهای آماده و رفتارهای قابل نمایش نسخه دمو را از یک نقطه مدیریت کنید.</p>
   </div>
   <button type="button" onClick={()=>onNavigate?.('admin/home')}>بازگشت به داشبورد</button>
  </header>

  <section className="ir-admin-settings-page__card">
   <header>
    <div><h2>خوانایی و اندازه متن</h2><p>فونت اصلی برنامه Vazirmatn است. فقط مقیاس نمایش را تغییر دهید.</p></div>
    <span className="is-success">Vazirmatn فعال</span>
   </header>
   <div className="ir-admin-settings-page__font-scale">
    <button type="button" className={appearance.fontScale==='compact'?'is-active':''} onClick={()=>updateAppearance('fontScale','compact')}><strong>فشرده</strong><small>برای نمایش اطلاعات بیشتر</small></button>
    <button type="button" className={!appearance.fontScale||appearance.fontScale==='comfortable'?'is-active':''} onClick={()=>updateAppearance('fontScale','comfortable')}><strong>استاندارد</strong><small>پیشنهاد اصلی برای موبایل</small></button>
    <button type="button" className={appearance.fontScale==='large'?'is-active':''} onClick={()=>updateAppearance('fontScale','large')}><strong>درشت</strong><small>خوانایی بیشتر</small></button>
   </div>
  </section>

  <section className="ir-admin-settings-page__card">
   <header>
    <div><h2>حالت دمو</h2><p>این گزینه‌ها فقط تجربه ارائه و سناریوهای آماده را کنترل می‌کنند.</p></div>
    <span className={demo.enabled?'is-success':'is-muted'}>{demo.enabled?'فعال':'غیرفعال'}</span>
   </header>

   <div className="ir-admin-settings-page__toggles">
    <article>
     <div><strong>فعال بودن حالت دمو</strong><small>امکان ورود سریع به پروفایل‌های نمایشی</small></div>
     <button type="button" role="switch" aria-checked={demo.enabled!==false} className={demo.enabled!==false?'is-on':''} onClick={()=>updateDemo('enabled',demo.enabled===false)}><span/></button>
    </article>

    <article>
     <div><strong>پروفایل‌های سریع در صفحه ورود</strong><small>دانش‌آموز، خانواده، مدرس، آموزشگاه، محتوا و مدیر</small></div>
     <button type="button" role="switch" aria-checked={demo.showQuickProfiles!==false} className={demo.showQuickProfiles!==false?'is-on':''} onClick={()=>updateDemo('showQuickProfiles',demo.showQuickProfiles===false)}><span/></button>
    </article>

    <article>
     <div><strong>نمونه سؤال‌ها و راهنمای تعاملی</strong><small>چیپ‌های آماده چیستی در خانه و صفحه سؤال</small></div>
     <button type="button" role="switch" aria-checked={demo.showGuidedExamples!==false} className={demo.showGuidedExamples!==false?'is-on':''} onClick={()=>updateDemo('showGuidedExamples',demo.showGuidedExamples===false)}><span/></button>
    </article>

    <article>
     <div><strong>شبیه‌سازی حالت آفلاین</strong><small>برای نمایش خطاها و رفتار بدون اینترنت</small></div>
     <button type="button" role="switch" aria-checked={Boolean(demo.offlineSimulation)} className={demo.offlineSimulation?'is-on':''} onClick={()=>updateDemo('offlineSimulation',!demo.offlineSimulation)}><span/></button>
    </article>
   </div>
  </section>

  <section className="ir-admin-settings-page__card">
   <header>
    <div><h2>سناریوهای آماده ارائه</h2><p>هر کارت مستقیماً همان نقش و داده‌های مربوط به آن را فعال می‌کند.</p></div>
    <span>{IrancellFormatPersianNumber(demoProfiles.length)} سناریو</span>
   </header>

   <div className="ir-admin-settings-page__profiles">
    {demoProfiles.map(([profileKey,profile])=>{
     const user=state.identity.usersById[profile.userId];
     return <button type="button" key={profileKey} disabled={!demo.enabled} onClick={()=>launchDemo(profileKey,profile)}>
      <span>{profile.role==='student'?'د':profile.role==='parent'?'خ':profile.role==='teacher'?'م':profile.role==='academy'?'آ':profile.role==='content-provider'?'ت':'ا'}</span>
      <div><strong>{profile.label}</strong><small>{user?.name||profile.description}</small><p>{profile.description}</p></div>
      <b>شروع دمو</b>
     </button>
    })}
   </div>
  </section>

  <section className="ir-admin-settings-page__card">
   <header><div><h2>اطلاعات محیط</h2><p>تنظیمات پایه این نسخه برای تست و ارائه.</p></div></header>
   <dl className="ir-admin-settings-page__environment">
    <div><dt>نسخه برنامه</dt><dd>{IRANCELL_APP_CONFIG.version}</dd></div>
    <div><dt>زبان و جهت</dt><dd>فارسی · RTL</dd></div>
    <div><dt>فونت رابط</dt><dd>Vazirmatn</dd></div>
    <div><dt>حالت دمو</dt><dd>{demo.enabled?'فعال':'غیرفعال'}</dd></div>
    <div><dt>وضعیت شبکه نمایشی</dt><dd>{state.ui.offline?'آفلاین':'آنلاین'}</dd></div>
   </dl>
  </section>

  <footer className="ir-admin-settings-page__footer">
   <button type="button" onClick={resetSettings}>بازنشانی تنظیمات نمایش</button>
   <button type="button" className="is-primary" onClick={()=>onNavigate?.('admin/home')}>ذخیره شده · بازگشت</button>
  </footer>
 </section>
}