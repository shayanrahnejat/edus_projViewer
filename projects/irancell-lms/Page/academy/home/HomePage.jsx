export function IrancellAcademyHomePage({onNavigate}){
 const{state}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const provider=state.marketplace.providersById?.[academyId]||null;
 const teachers=Object.values(state.marketplace.providersById||{}).filter(item=>item.type==='teacher'&&item.academyId===academyId&&item.status!=='archived');
 const activeTeachers=teachers.filter(item=>item.status==='active');
 const academySubjects=Array.isArray(provider?.subjects)?provider.subjects:[];
 const requests=Object.values(state.marketplace.requestsById||{}).filter(item=>['pending','published','offers_received'].includes(item.status)&&(!academySubjects.length||academySubjects.includes(item.subject)));
 const offers=Object.values(state.marketplace.offersById||{}).filter(item=>item.providerId===academyId);
 const activeOfferRequestIds=new Set(offers.filter(item=>item.status==='active').map(item=>item.requestId));
 const unansweredRequests=requests.filter(item=>!activeOfferRequestIds.has(item.id));
 const activeOffers=offers.filter(item=>item.status==='active');
 const selectedOffers=offers.filter(item=>item.status==='selected');
 const teacherIds=new Set(teachers.map(item=>item.id));
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.providerId===academyId||teacherIds.has(item.assignedTeacherId));
 const upcomingClasses=classes.filter(item=>!['completed','cancelled'].includes(item.status));
 const profileReady=Boolean(provider&&provider.registrationStatus==='complete'&&provider.verificationStatus==='verified');
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,210px),1fr))',gap:'12px'};
 const checklist=[
  {done:profileReady,title:'ثبت و تکمیل اطلاعات آموزشگاه',description:'نام حقوقی، مجوز، شهر و حوزه‌های آموزشی',route:'academy/profile'},
  {done:activeTeachers.length>0,title:'معرفی حداقل یک مدرس فعال',description:'مدرس واقعی هر پیشنهاد باید از فهرست آموزشگاه انتخاب شود.',route:'academy/teachers'},
  {done:offers.length>0,title:'پاسخ به اولین درخواست دانش‌آموز',description:'قیمت، زمان، مدرس و شرایط خدمت را شفاف ارسال کنید.',route:'academy/requests'}
 ];
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="پنل آموزشگاه" title={provider?.name||'راه‌اندازی حساب آموزشگاه'} description="تقاضای دانش‌آموز را دریافت کنید، مدرس مناسب را تعیین کنید و پیشنهاد شفاف ارسال کنید." actions={<IrancellButton variant="secondary" onClick={()=>onNavigate?.('academy/profile')}>پروفایل آموزشگاه</IrancellButton>}/>
  {!profileReady&&<IrancellStatusBanner tone="warning" title="ابتدا آموزشگاه را ثبت کنید">تا زمانی که اطلاعات پایه آموزشگاه تکمیل نشود، ارسال پیشنهاد فعال نمی‌شود.</IrancellStatusBanner>}
  <div style={{...grid,marginTop:'16px'}}>
   <IrancellStatCard icon={UsersRound} label="مدرس فعال" value={IrancellFormatPersianNumber(activeTeachers.length)}/>
   <IrancellStatCard icon={Activity} label="درخواست مرتبط" value={IrancellFormatPersianNumber(requests.length)} tone="info"/>
   <IrancellStatCard icon={CheckCircle2} label="پیشنهاد فعال" value={IrancellFormatPersianNumber(activeOffers.length)} tone="warning"/>
   <IrancellStatCard icon={CalendarCheck} label="کلاس پیش رو" value={IrancellFormatPersianNumber(upcomingClasses.length)} tone="success"/>
  </div>
  <IrancellCard title="شروع کار آموزشگاه" subtitle="جریان پیشنهادی شبیه بازار خدمات: ثبت کسب‌وکار ← معرفی نیرو ← دریافت تقاضا ← ارسال قیمت" style={{marginTop:'16px'}}>
   <div style={{display:'grid',gap:'10px'}}>{checklist.map((item,index)=><button type="button" key={item.route} onClick={()=>onNavigate?.(item.route)} style={{display:'grid',gridTemplateColumns:'44px minmax(0,1fr) auto',alignItems:'center',gap:'11px',padding:'13px',cursor:'pointer',textAlign:'right',color:'#202024',background:item.done?'#F1FAF4':'#FFFFFF',border:`1px solid ${item.done?'#B9DDC5':'#E7E1C8'}`,borderRadius:'15px',fontFamily:font}}><span style={{display:'grid',width:'44px',height:'44px',placeItems:'center',background:item.done?'#DDF2E4':'#FFF3AE',borderRadius:'13px',fontWeight:900}}>{item.done?'✓':IrancellFormatPersianNumber(index+1)}</span><span style={{display:'grid',gap:'2px'}}><strong style={{fontSize:'13px'}}>{item.title}</strong><small style={{color:'#74757C',fontSize:'10px',lineHeight:1.8}}>{item.description}</small></span><span aria-hidden="true">←</span></button>)}</div>
  </IrancellCard>
  <div style={{...grid,marginTop:'16px'}}>
   <IrancellCard title="تقاضاهای جدید" subtitle="درخواست‌های مرتبطی که هنوز پاسخ شما را ندارند"><strong style={{display:'block',fontSize:'28px'}}>{IrancellFormatPersianNumber(unansweredRequests.length)}</strong><IrancellButton block style={{marginTop:'12px'}} disabled={!profileReady||!activeTeachers.length} onClick={()=>onNavigate?.('academy/requests')}>بررسی و ارسال پیشنهاد</IrancellButton></IrancellCard>
   <IrancellCard title="پیشنهادهای برنده" subtitle="پیشنهادهایی که دانش‌آموز انتخاب کرده است"><strong style={{display:'block',fontSize:'28px'}}>{IrancellFormatPersianNumber(selectedOffers.length)}</strong><IrancellButton block variant="secondary" style={{marginTop:'12px'}} onClick={()=>onNavigate?.('academy/offers')}>مدیریت پیشنهادها</IrancellButton></IrancellCard>
   <IrancellCard title="تیم آموزشی" subtitle="مدرس‌های متصل به آموزشگاه"><strong style={{display:'block',fontSize:'28px'}}>{IrancellFormatPersianNumber(teachers.length)}</strong><IrancellButton block variant="secondary" style={{marginTop:'12px'}} onClick={()=>onNavigate?.('academy/teachers')}>مدیریت مدرس‌ها</IrancellButton></IrancellCard>
  </div>
 </IrancellPageScaffold>
}