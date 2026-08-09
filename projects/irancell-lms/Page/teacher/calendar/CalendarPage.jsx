export function IrancellTeacherCalendarPage(){
 const{state,dispatch}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const slots=Array.isArray(state.marketplace.availability?.[teacherId])?state.marketplace.availability[teacherId]:[];
 const[value,setValue]=useState('');
 const[saved,setSaved]=useState(false);
 function addSlot(){
  const timestamp=new Date(value).getTime();
  if(!Number.isFinite(timestamp)||timestamp<=Date.now())return;
  dispatch({type:'IRANCELL_TEACHER_AVAILABILITY_UPDATE',slots:[...slots,new Date(timestamp).toISOString()]});
  setValue('');setSaved(true)
 }
 function removeSlot(slot){dispatch({type:'IRANCELL_TEACHER_AVAILABILITY_UPDATE',slots:slots.filter(item=>item!==slot)});setSaved(true)}
 function formatSlot(slot){const date=new Date(slot);return Number.isNaN(date.getTime())?slot:date.toLocaleString('fa-IR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}
 return <>
  <IrancellPageHeader eyebrow="مدرس" title="تقویم تدریس" description="زمان‌های آزاد خود را ثبت و حذف کنید تا درخواست‌های مرتبط‌تری دریافت کنید."/>
  {saved&&<IrancellCard><strong>تقویم با موفقیت به‌روزرسانی شد.</strong></IrancellCard>}
  <IrancellCard title="افزودن زمان آزاد"><div className="ir-inline-form"><IrancellInput label="تاریخ و ساعت" type="datetime-local" value={value} onChange={event=>{setValue(event.target.value);setSaved(false)}}/><IrancellButton onClick={addSlot} disabled={!value}>افزودن</IrancellButton></div></IrancellCard>
  {slots.length?<div className="ir-card-list">{slots.map(slot=><IrancellCard key={slot}><article className="ir-action-row"><div><strong>{formatSlot(slot)}</strong><small>زمان آزاد برای رزرو</small></div><IrancellButton variant="danger" onClick={()=>removeSlot(slot)}>حذف</IrancellButton></article></IrancellCard>)}</div>:<IrancellStatePanel state="empty" title="زمان آزادی ثبت نشده است" description="حداقل یک بازه زمانی آینده برای دریافت پیشنهاد ثبت کنید."/>}
 </>
}