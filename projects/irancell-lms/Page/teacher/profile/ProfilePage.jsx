export function IrancellTeacherProfilePage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const teacher=state.identity.usersById[teacherId]||{};
 const provider=state.marketplace.providersById?.[teacherId]||{};
 const verification=state.identity.providerVerification?.[teacherId]?.status||provider.verificationStatus||'under_review';
 const[editing,setEditing]=useState(false);
 const[saved,setSaved]=useState(false);
 const[form,setForm]=useState({name:teacher.name||'',mobile:teacher.mobile||'',email:teacher.email||'',bio:provider.bio||'',subjects:(provider.subjects||[]).join('، '),priceFrom:String(provider.priceFrom||''),experienceYears:String(provider.experienceYears||'')});
 function save(){
  const subjects=String(form.subjects||'').split(/[،,]/).map(item=>item.trim()).filter(Boolean);
  if(!String(form.name||'').trim()||subjects.length===0||Number(form.priceFrom)<=0)return;
  dispatch({type:'IRANCELL_TEACHER_PROFILE_UPDATE',teacherId,profile:{...form,subjects,priceFrom:Number(form.priceFrom),experienceYears:Number(form.experienceYears)||0}});
  setEditing(false);setSaved(true)
 }
 return <>
  <IrancellPageHeader eyebrow="مدرس" title="پروفایل حرفه‌ای" description="رزومه، تخصص، قیمت، مدارک و وضعیت فعال‌سازی تدریس." actions={<IrancellButton onClick={()=>setEditing(value=>!value)}>{editing?'لغو ویرایش':'ویرایش پروفایل'}</IrancellButton>}/>
  {saved&&<IrancellCard><strong>اطلاعات پروفایل ذخیره شد.</strong></IrancellCard>}
  <div className="ir-stats-grid"><IrancellStatCard label="تکمیل پروفایل" value={`${IrancellFormatPersianNumber(provider.profileCompletion||0)}٪`}/><IrancellStatCard label="امتیاز" value={provider.rating?provider.rating.toLocaleString('fa-IR',{maximumFractionDigits:1}):'—'}/><IrancellStatCard label="کلاس برگزارشده" value={IrancellFormatPersianNumber(provider.completedClasses||0)}/><IrancellStatCard label="شروع قیمت" value={IrancellFormatCurrency(provider.priceFrom||0)}/></div>
  <IrancellCard title="وضعیت تأیید" action={<IrancellStatusBadge status={verification}/>}><p>{verification==='verified'?'حساب مدرس برای دریافت درخواست و برگزاری کلاس فعال است.':'مدارک و اطلاعات حرفه‌ای هنوز در حال بررسی است.'}</p></IrancellCard>
  {editing?<IrancellCard title="ویرایش اطلاعات"><div className="ir-form-grid"><IrancellInput label="نام و نام خانوادگی" value={form.name} onChange={event=>setForm(current=>({...current,name:event.target.value}))}/><IrancellInput label="شماره موبایل" value={form.mobile} onChange={event=>setForm(current=>({...current,mobile:event.target.value}))}/><IrancellInput label="ایمیل" value={form.email} onChange={event=>setForm(current=>({...current,email:event.target.value}))}/><IrancellInput label="دروس و تخصص‌ها" value={form.subjects} onChange={event=>setForm(current=>({...current,subjects:event.target.value}))} helper="موارد را با ویرگول جدا کنید."/><IrancellInput label="شروع قیمت جلسه" type="number" value={form.priceFrom} onChange={event=>setForm(current=>({...current,priceFrom:event.target.value}))}/><IrancellInput label="سابقه تدریس (سال)" type="number" value={form.experienceYears} onChange={event=>setForm(current=>({...current,experienceYears:event.target.value}))}/><IrancellTextarea label="معرفی مدرس" rows={5} value={form.bio} onChange={event=>setForm(current=>({...current,bio:event.target.value}))}/></div><IrancellButton onClick={save} disabled={!form.name.trim()||!form.subjects.trim()||Number(form.priceFrom)<=0}>ذخیره تغییرات</IrancellButton></IrancellCard>:<><IrancellCard title="معرفی مدرس"><p>{provider.bio||'معرفی حرفه‌ای هنوز تکمیل نشده است.'}</p></IrancellCard><IrancellCard title="تخصص‌ها"><div className="ir-chip-row">{(provider.subjects||[]).map(item=><span key={item}>{item}</span>)}</div></IrancellCard><IrancellCard title="مدیریت حرفه‌ای"><div className="ir-inline-form"><IrancellButton onClick={()=>onNavigate?.('teacher/calendar')}>زمان‌های آزاد</IrancellButton><IrancellButton variant="secondary" onClick={()=>onNavigate?.('teacher/earnings')}>اطلاعات مالی</IrancellButton><IrancellButton variant="secondary" onClick={()=>onNavigate?.('teacher/quality')}>کیفیت تدریس</IrancellButton></div></IrancellCard></>}
 </>
}