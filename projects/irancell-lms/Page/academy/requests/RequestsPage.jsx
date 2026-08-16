export function IrancellAcademyRequestsPage({params,onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const academy=state.marketplace.providersById?.[academyId]||null;
 const teachers=Object.values(state.marketplace.providersById||{}).filter(item=>item.type==='teacher'&&item.academyId===academyId&&item.status==='active');
 const academySubjects=Array.isArray(academy?.subjects)?academy.subjects:[];
 const ownOffers=Object.values(state.marketplace.offersById||{}).filter(item=>item.providerId===academyId&&item.status!=='withdrawn');
 const ownOfferByRequest=ownOffers.reduce((result,item)=>{if(item.status==='active')result[item.requestId]=item;return result;},{});
 const allOpenRequests=Object.values(state.marketplace.requestsById||{}).filter(item=>['pending','published','offers_received'].includes(item.status));
 const matchedRequests=allOpenRequests.filter(item=>!academySubjects.length||academySubjects.includes(item.subject));
 const focusedRequestId=String(params?.request||'');
 const[view,setView]=useState(focusedRequestId?'all':'new');
 const[active,setActive]=useState(null);
 const[submitted,setSubmitted]=useState(false);
 const[form,setForm]=useState({assignedTeacherId:'',price:'',proposedTime:'',sessionCount:'1',sessionDuration:'60',deliveryMode:'آنلاین',responseLabel:'پاسخ‌گویی در همان روز',description:'',terms:''});
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const newCount=matchedRequests.filter(item=>!ownOfferByRequest[item.id]).length;
 const respondedCount=matchedRequests.filter(item=>Boolean(ownOfferByRequest[item.id])).length;
 const visibleRequests=matchedRequests.filter(item=>view==='all'||(view==='new'?!ownOfferByRequest[item.id]:Boolean(ownOfferByRequest[item.id]))).sort((a,b)=>{
  if(focusedRequestId&&(a.id===focusedRequestId||b.id===focusedRequestId))return a.id===focusedRequestId?-1:1;
  const urgentA=a.urgency==='فوری'?1:0,urgentB=b.urgency==='فوری'?1:0;
  if(urgentA!==urgentB)return urgentB-urgentA;
  return new Date(b.createdAt||0)-new Date(a.createdAt||0)
 });
 function teachersForRequest(request){return teachers.filter(item=>!Array.isArray(item.subjects)||!item.subjects.length||item.subjects.includes(request?.subject))}
 function requestModeLabel(request){if(request?.deliveryMode==='inperson')return'حضوری';if(request?.deliveryMode==='either')return'آنلاین یا حضوری';return'آنلاین'}
 function openRequest(request){
  const eligibleTeachers=teachersForRequest(request);
  if(!eligibleTeachers.length)return;
  const previous=ownOfferByRequest[request.id];
  const teacherId=previous?.assignedTeacherId||eligibleTeachers[0]?.id||'';
  setSubmitted(false);
  setForm({assignedTeacherId:teacherId,price:previous?.price||request.budget||'',proposedTime:previous?.proposedTime?new Date(previous.proposedTime).toISOString().slice(0,16):request.preferredTime?new Date(request.preferredTime).toISOString().slice(0,16):new Date(Date.now()+86400000).toISOString().slice(0,16),sessionCount:String(previous?.sessionCount||1),sessionDuration:String(previous?.sessionDuration||60),deliveryMode:previous?.modes?.[0]||(request.deliveryMode==='inperson'?'حضوری':'آنلاین'),responseLabel:previous?.responseLabel||'پاسخ‌گویی در همان روز',description:previous?.description||'',terms:previous?.terms||''});
  setActive(request)
 }
 function change(key,value){setForm(current=>({...current,[key]:value}))}
 function submit(){
  setSubmitted(true);
  const teacher=teachers.find(item=>item.id===form.assignedTeacherId);
  const price=Number(form.price);
  if(!active||!teacher||!Number.isFinite(price)||price<=0||!form.proposedTime)return;
  dispatch(IrancellMarketplaceSubmitOffer(active.id,price,new Date(form.proposedTime).toISOString(),teacher.name,{assignedTeacherId:teacher.id,description:form.description,sessionCount:Number(form.sessionCount)||1,sessionDuration:Number(form.sessionDuration)||60,responseLabel:form.responseLabel,modes:[form.deliveryMode],terms:form.terms}));
  setActive(null);setSubmitted(false);setView('responded')
 }
 if(!academy||academy.registrationStatus!=='complete')return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}><IrancellPageHeader eyebrow="بازار آموزش" title="تقاضاهای دانش‌آموز" description="ابتدا پروفایل کسب‌وکار خود را تکمیل کنید."/><IrancellStatePanel state="blocked" title="آموزشگاه هنوز ثبت نشده است" description="پس از تکمیل اطلاعات آموزشگاه و معرفی مدرس، تقاضاهای بازار برای شما فعال می‌شود." action={<IrancellButton onClick={()=>onNavigate?.('academy/profile')}>ثبت آموزشگاه</IrancellButton>}/></IrancellPageScaffold>;
 if(!teachers.length)return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}><IrancellPageHeader eyebrow="بازار آموزش" title="تقاضاهای دانش‌آموز" description="برای قیمت‌دهی باید مدرس واقعی جلسه مشخص باشد."/><IrancellStatePanel state="blocked" title="مدرس فعالی ندارید" description="حداقل یک مدرس را معرفی و فعال کنید؛ سپس می‌توانید برای تقاضاها پیشنهاد ارسال کنید." action={<IrancellButton onClick={()=>onNavigate?.('academy/teachers')}>معرفی مدرس</IrancellButton>}/></IrancellPageScaffold>;
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="بازار تقاضا" title="درخواست‌های مرتبط با آموزشگاه" description="فقط درخواست‌های حوزه‌های ثبت‌شده آموزشگاه نمایش داده می‌شوند. برای هر درخواست مدرس واقعی، قیمت و زمان را مشخص کنید." actions={<IrancellButton variant="secondary" onClick={()=>onNavigate?.('academy/offers')}>پیشنهادهای من</IrancellButton>}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,170px),1fr))',gap:'10px',marginTop:'16px'}}><IrancellStatCard label="درخواست مرتبط" value={IrancellFormatPersianNumber(matchedRequests.length)}/><IrancellStatCard label="بدون پاسخ شما" value={IrancellFormatPersianNumber(newCount)} tone="warning"/><IrancellStatCard label="پاسخ داده‌شده" value={IrancellFormatPersianNumber(respondedCount)} tone="success"/><IrancellStatCard label="مدرس فعال" value={IrancellFormatPersianNumber(teachers.length)} tone="info"/></div>
  <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'14px'}}>{[{id:'new',label:`جدید (${IrancellFormatPersianNumber(newCount)})`},{id:'responded',label:`پاسخ داده‌شده (${IrancellFormatPersianNumber(respondedCount)})`},{id:'all',label:'همه'}].map(item=><IrancellButton key={item.id} size="sm" variant={view===item.id?'primary':'secondary'} onClick={()=>setView(item.id)}>{item.label}</IrancellButton>)}</div>
  <div style={{display:'grid',gap:'12px',marginTop:'14px'}}>{visibleRequests.length?visibleRequests.map(request=>{
   const student=state.identity.usersById?.[request.studentId]||{};
   const previous=ownOfferByRequest[request.id];
   const eligibleTeachers=teachersForRequest(request);
   const preferredTime=request.preferredTime?new Date(request.preferredTime):null;
   return <IrancellCard key={request.id} title={`${request.subject||'درس'} — ${request.topic||'درخواست آموزشی'}`} subtitle={`${student.name||'دانش‌آموز'} · ${request.grade||'پایه نامشخص'}`} style={focusedRequestId===request.id?{border:'2px solid #E8BD00',boxShadow:'0 10px 28px rgba(105,82,0,.12)'}:undefined}>
    <div style={{display:'grid',gap:'10px'}}>
     <p style={{margin:0,color:'#62636B',fontSize:'11px',lineHeight:1.9}}>{request.description||'بدون توضیح تکمیلی'}</p>
     <div style={{display:'flex',flexWrap:'wrap',gap:'7px'}}><IrancellStatusBadge status={previous?'offers_received':'pending'}/>{request.budget?<span style={{padding:'6px 9px',background:'#FFF3AE',borderRadius:'999px',fontSize:'10px'}}>بودجه: {IrancellFormatCurrency(request.budget)}</span>:<span style={{padding:'6px 9px',background:'#F2F2F4',borderRadius:'999px',fontSize:'10px'}}>بودجه آزاد</span>}<span style={{padding:'6px 9px',background:'#F2F2F4',borderRadius:'999px',fontSize:'10px'}}>{request.urgency||'عادی'}</span><span style={{padding:'6px 9px',background:'#F2F2F4',borderRadius:'999px',fontSize:'10px'}}>{requestModeLabel(request)}</span>{preferredTime&&!Number.isNaN(preferredTime.getTime())&&<span style={{padding:'6px 9px',background:'#F2F2F4',borderRadius:'999px',fontSize:'10px'}}>{preferredTime.toLocaleString('fa-IR',{dateStyle:'short',timeStyle:'short'})}</span>}</div>
     {eligibleTeachers.length?<div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}><IrancellButton size="sm" onClick={()=>openRequest(request)}>{previous?'ویرایش پیشنهاد':'ارسال پیشنهاد'}</IrancellButton><span style={{color:'#6D6E75',fontSize:'10px'}}>{IrancellFormatPersianNumber(eligibleTeachers.length)} مدرس مناسب</span>{previous&&<span style={{color:'#287149',fontSize:'10px',fontWeight:800}}>پیشنهاد فعال: {IrancellFormatCurrency(previous.price)}</span>}</div>:<IrancellStatusBanner tone="warning" title="مدرس متناسب ندارید" action={<IrancellButton size="sm" variant="secondary" onClick={()=>onNavigate?.('academy/teachers')}>مدیریت مدرس‌ها</IrancellButton>}>هیچ مدرس فعال این آموزشگاه، درس {request.subject} را در تخصص‌های خود ندارد.</IrancellStatusBanner>}
    </div>
   </IrancellCard>
  }):<IrancellStatePanel state="empty" title={view==='new'?'درخواست جدیدی برای پاسخ نیست':view==='responded'?'هنوز به درخواستی پاسخ نداده‌اید':'تقاضای مرتبطی در بازار نیست'} description={view==='new'?'درخواست‌هایی که هنوز از طرف آموزشگاه شما پیشنهاد ندارند اینجا ظاهر می‌شوند.':'درخواست‌های جدید مرتبط با حوزه‌های آموزشی شما به‌صورت خودکار در این بخش نمایش داده می‌شوند.'}/>}</div>
  <IrancellModal open={Boolean(active)} title={active?`پیشنهاد برای ${active.subject} — ${active.topic}`:'ارسال پیشنهاد'} onClose={()=>setActive(null)} actions={<div style={{display:'flex',gap:'8px'}}><IrancellButton variant="secondary" onClick={()=>setActive(null)}>انصراف</IrancellButton><IrancellButton onClick={submit}>ثبت پیشنهاد</IrancellButton></div>}>
   <div style={{display:'grid',gap:'11px'}}><IrancellSelect label="مدرس قطعی جلسه *" value={form.assignedTeacherId} error={submitted&&!form.assignedTeacherId?'مدرس را انتخاب کنید.':''} onChange={event=>change('assignedTeacherId',event.target.value)} options={teachersForRequest(active).map(item=>({value:item.id,label:`${item.name} — ${(item.subjects||[]).join('، ')}`}))}/><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))',gap:'10px'}}><IrancellInput label="قیمت پیشنهادی (تومان) *" type="number" min="1" value={form.price} error={submitted&&(!Number(form.price)||Number(form.price)<=0)?'قیمت معتبر وارد کنید.':''} onChange={event=>change('price',event.target.value)}/><IrancellInput label="زمان پیشنهادی *" type="datetime-local" value={form.proposedTime} error={submitted&&!form.proposedTime?'زمان را انتخاب کنید.':''} onChange={event=>change('proposedTime',event.target.value)}/><IrancellInput label="تعداد جلسه" type="number" min="1" value={form.sessionCount} onChange={event=>change('sessionCount',event.target.value)}/><IrancellInput label="مدت هر جلسه (دقیقه)" type="number" min="30" step="15" value={form.sessionDuration} onChange={event=>change('sessionDuration',event.target.value)}/></div><IrancellSelect label="شیوه برگزاری" value={form.deliveryMode} onChange={event=>change('deliveryMode',event.target.value)} options={[{value:'آنلاین',label:'آنلاین'},{value:'حضوری',label:'حضوری'}]}/><IrancellInput label="زمان پاسخ‌گویی" value={form.responseLabel} onChange={event=>change('responseLabel',event.target.value)}/><IrancellTextarea label="شرح پیشنهاد" value={form.description} rows={3} placeholder="روش تدریس، پشتیبانی و مزیت این پیشنهاد" onChange={event=>change('description',event.target.value)}/><IrancellTextarea label="شرایط و توضیحات تکمیلی" value={form.terms} rows={2} placeholder="قوانین لغو، جابه‌جایی مدرس یا پشتیبانی" onChange={event=>change('terms',event.target.value)}/></div>
  </IrancellModal>
 </IrancellPageScaffold>
}