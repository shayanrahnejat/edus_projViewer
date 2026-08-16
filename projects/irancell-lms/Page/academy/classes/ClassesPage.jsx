export function IrancellAcademyClassesPage({onNavigate}){
 const{state}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const teacherIds=new Set(Object.values(state.marketplace.providersById||{}).filter(item=>item.type==='teacher'&&item.academyId===academyId).map(item=>item.id));
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.providerId===academyId||teacherIds.has(item.assignedTeacherId)).sort((a,b)=>new Date(a.startAt||0)-new Date(b.startAt||0));
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="عملیات آموزشگاه" title="کلاس‌ها و برنامه مدرس‌ها" description="کلاس‌های حاصل از پیشنهادهای انتخاب‌شده با مدرس واقعی، دانش‌آموز و وضعیت پرداخت نمایش داده می‌شوند."/>
  <div style={{display:'grid',gap:'12px',marginTop:'16px'}}>{classes.length?classes.map(item=>{
   const student=state.identity.usersById?.[item.studentId]||{};
   const teacher=item.assignedTeacherId?state.marketplace.providersById?.[item.assignedTeacherId]:null;
   const payment=item.orderId?state.payment.paymentsById?.[item.orderId]:null;
   const consent=item.consentDocumentId?state.consent.documentsById?.[item.consentDocumentId]:null;
   return <IrancellCard key={item.id} title={item.title} subtitle={`${student.name||'دانش‌آموز'} · ${teacher?.name||item.assignedTeacherName||'مدرس تعیین نشده'}`}>
    <div style={{display:'grid',gap:'9px'}}><div style={{display:'flex',flexWrap:'wrap',gap:'7px'}}><IrancellStatusBadge status={item.status}/><span style={{padding:'6px 9px',background:'#F2F2F4',borderRadius:'999px',fontSize:'10px'}}>{new Date(item.startAt).toLocaleString('fa-IR')}</span><span style={{padding:'6px 9px',background:['held','paid','released'].includes(payment?.status)?'#E6F5EB':'#FFF3AE',borderRadius:'999px',fontSize:'10px'}}>پرداخت: {payment?.status==='held'?'در امانت':payment?.status==='paid'?'پرداخت شده':payment?.status==='released'?'تسویه شده':payment?.status==='pending'?'در انتظار':'نامشخص'}</span>{item.requiresConsent&&<span style={{padding:'6px 9px',background:consent?.status==='signed'?'#E6F5EB':'#FFE8E0',borderRadius:'999px',fontSize:'10px'}}>رضایت: {consent?.status||'pending'}</span>}</div><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}><IrancellButton size="sm" onClick={()=>onNavigate?.(`class/${item.id}`)}>جزئیات کلاس</IrancellButton><IrancellButton size="sm" variant="secondary" onClick={()=>onNavigate?.('academy/teachers')}>مدیریت مدرس‌ها</IrancellButton></div></div>
   </IrancellCard>
  }):<IrancellStatePanel state="empty" title="کلاسی برای آموزشگاه ثبت نشده" description="پس از انتخاب یک پیشنهاد توسط دانش‌آموز و تکمیل مراحل خانواده، کلاس در این صفحه ساخته می‌شود." action={<IrancellButton onClick={()=>onNavigate?.('academy/requests')}>بررسی تقاضاها</IrancellButton>}/>}</div>
 </IrancellPageScaffold>
}