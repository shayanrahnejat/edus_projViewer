export function IrancellAcademyReportsPage({onNavigate}){
 const{state}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const teachers=Object.values(state.marketplace.providersById||{}).filter(item=>item.type==='teacher'&&item.academyId===academyId&&item.status!=='archived');
 const offers=Object.values(state.marketplace.offersById||{}).filter(item=>item.providerId===academyId);
 const selected=offers.filter(item=>item.status==='selected');
 const conversion=offers.length?Math.round(selected.length/offers.length*100):0;
 const teacherIds=new Set(teachers.map(item=>item.id));
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.providerId===academyId||teacherIds.has(item.assignedTeacherId));
 const completed=classes.filter(item=>item.status==='completed').length;
 const completion=classes.length?Math.round(completed/classes.length*100):0;
 const revenue=Object.values(state.payment.paymentsById||{}).filter(item=>item.providerId===academyId&&['held','paid','released'].includes(item.status)).reduce((sum,item)=>sum+(Number(item.amount)||0),0);
 const ratings=Object.values(state.quality.ratingsById||{}).filter(item=>item.providerId===academyId||teacherIds.has(item.providerId));
 const averageRating=ratings.length?(ratings.reduce((sum,item)=>sum+(Number(item.score)||0),0)/ratings.length).toFixed(1):'—';
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="تحلیل کسب‌وکار" title="گزارش آموزشگاه" description="عملکرد واقعی بازار، پیشنهادها، کلاس‌ها و تیم آموزشی از داده‌های ذخیره‌شده محاسبه می‌شود."/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))',gap:'11px',marginTop:'16px'}}><IrancellStatCard label="نرخ تبدیل پیشنهاد" value={`${IrancellFormatPersianNumber(conversion)}٪`} tone="success"/><IrancellStatCard label="موفقیت کلاس" value={`${IrancellFormatPersianNumber(completion)}٪`} tone="info"/><IrancellStatCard label="امتیاز میانگین" value={averageRating==='—'?'—':IrancellFormatPersianNumber(averageRating)}/><IrancellStatCard label="ارزش پرداخت‌های موفق" value={IrancellFormatCurrency(revenue)} tone="warning"/></div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:'13px',marginTop:'16px'}}>
   <IrancellCard title="قیف فروش آموزشگاه" subtitle="از قیمت‌دهی تا انتخاب دانش‌آموز"><div style={{display:'grid',gap:'9px'}}>{[{label:'پیشنهاد ارسال‌شده',value:offers.length},{label:'پیشنهاد انتخاب‌شده',value:selected.length},{label:'کلاس ایجادشده',value:classes.length},{label:'کلاس تکمیل‌شده',value:completed}].map(item=><div key={item.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px',background:'#FAFAFB',borderRadius:'12px'}}><span style={{fontSize:'11px'}}>{item.label}</span><strong>{IrancellFormatPersianNumber(item.value)}</strong></div>)}</div></IrancellCard>
   <IrancellCard title="عملکرد مدرس‌ها" subtitle="تیم فعال آموزشگاه"><div style={{display:'grid',gap:'9px'}}>{teachers.length?teachers.map(item=><div key={item.id} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:'8px',padding:'11px',background:'#FAFAFB',borderRadius:'12px'}}><div><strong style={{display:'block',fontSize:'11px'}}>{item.name}</strong><small style={{color:'#74757C',fontSize:'9px'}}>{(item.subjects||[]).join('، ')}</small></div><span style={{fontSize:'10px'}}>★ {IrancellFormatPersianNumber(item.rating||0)}</span></div>):<p style={{color:'#74757C',fontSize:'10px'}}>هنوز مدرسی معرفی نشده است.</p>}</div></IrancellCard>
  </div>
  <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'16px'}}><IrancellButton onClick={()=>onNavigate?.('academy/requests')}>بهبود فروش با پاسخ به تقاضاها</IrancellButton><IrancellButton variant="secondary" onClick={()=>onNavigate?.('academy/teachers')}>مدیریت تیم مدرس‌ها</IrancellButton></div>
 </IrancellPageScaffold>
}