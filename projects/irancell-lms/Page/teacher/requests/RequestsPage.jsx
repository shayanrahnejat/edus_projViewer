export function IrancellTeacherRequestsPage(){
 const{state,dispatch}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const provider=state.marketplace.providersById?.[teacherId]||null;
 const verified=state.identity.providerVerification?.[teacherId]?.status==='verified'||provider?.verificationStatus==='verified';
 const subjects=Array.isArray(provider?.subjects)?provider.subjects:[];
 const[active,setActive]=useState(null);
 const[price,setPrice]=useState('320000');
 const[time,setTime]=useState(new Date(Date.now()+86400000).toISOString().slice(0,16));
 const[formError,setFormError]=useState('');
 const[submitted,setSubmitted]=useState(false);
 const items=Object.values(state.marketplace.requestsById||{}).filter(item=>!['selected','cancelled','expired'].includes(item.status)&&(subjects.length===0||subjects.includes(item.subject))).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 function openOffer(request){setActive(request);setFormError('');setSubmitted(false)}
 function submit(){
  const amount=Number(price),proposedAt=new Date(time).getTime();
  if(!active){setFormError('درخواست انتخاب‌شده معتبر نیست.');return}
  if(!verified){setFormError('برای ثبت پیشنهاد ابتدا پروفایل و مدارک مدرس باید تأیید شود.');return}
  if(!Number.isFinite(amount)||amount<=0){setFormError('قیمت جلسه را به‌درستی وارد کنید.');return}
  if(!Number.isFinite(proposedAt)||proposedAt<=Date.now()){setFormError('زمان پیشنهادی باید در آینده باشد.');return}
  dispatch(IrancellMarketplaceSubmitOffer(active.id,amount,new Date(proposedAt).toISOString(),state.identity.usersById[teacherId]?.name));
  setSubmitted(true);
  setActive(null)
 }
 return <>
  <IrancellPageHeader eyebrow="بازار مدرس" title="درخواست‌های مرتبط" description="فقط درخواست‌های مرتبط با تخصص و وضعیت تأیید شما نمایش داده می‌شوند."/>
  {!verified&&<IrancellStatePanel state="unauthorized" title="پروفایل مدرس هنوز فعال نیست" description="پس از تکمیل و تأیید اطلاعات حرفه‌ای می‌توانید برای درخواست‌ها پیشنهاد ارسال کنید."/>}
  {submitted&&<IrancellCard><strong>پیشنهاد با موفقیت ثبت شد.</strong></IrancellCard>}
  <div className="ir-card-list">{items.length?items.map(item=><IrancellCard key={item.id}><article className="ir-request-row"><div><h3>{item.subject} — {item.topic}</h3><p>پایه {item.grade} · فوریت {item.urgency}</p><small>{item.description}</small></div><IrancellStatusBadge status={item.status}/><IrancellButton onClick={()=>openOffer(item)} disabled={!verified}>ثبت پیشنهاد</IrancellButton></article></IrancellCard>):<IrancellStatePanel state="empty" title="درخواست مرتبطی وجود ندارد" description="زمان‌های آزاد و تخصص‌های پروفایل خود را به‌روز نگه دارید."/>}</div>
  <IrancellModal open={Boolean(active)} title="پیشنهاد قیمت و زمان" onClose={()=>setActive(null)} actions={<IrancellButton onClick={submit}>ارسال پیشنهاد</IrancellButton>}><IrancellInput label="قیمت جلسه (تومان)" type="number" min="10000" value={price} onChange={event=>{setPrice(event.target.value);setFormError('')}}/><IrancellInput label="زمان پیشنهادی" type="datetime-local" value={time} onChange={event=>{setTime(event.target.value);setFormError('')}}/>{formError&&<small className="ir-field__error" role="alert">{formError}</small>}</IrancellModal>
 </>
}