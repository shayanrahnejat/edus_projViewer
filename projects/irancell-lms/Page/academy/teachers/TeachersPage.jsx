export function IrancellAcademyTeachersPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const provider=state.marketplace.providersById?.[academyId]||null;
 const teachers=Object.values(state.marketplace.providersById||{}).filter(item=>item.type==='teacher'&&item.academyId===academyId&&item.status!=='archived').sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'fa'));
 const[open,setOpen]=useState(false);
 const[editing,setEditing]=useState(null);
 const[submitted,setSubmitted]=useState(false);
 const emptyForm={name:'',mobile:'',subjects:'',experienceYears:'',priceFrom:'',bio:''};
 const[form,setForm]=useState(emptyForm);
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 function startAdd(){setEditing(null);setSubmitted(false);setForm(emptyForm);setOpen(true)}
 function startEdit(teacher){setEditing(teacher);setSubmitted(false);setForm({name:teacher.name||'',mobile:teacher.mobile||'',subjects:Array.isArray(teacher.subjects)?teacher.subjects.join('، '):'',experienceYears:teacher.experienceYears||'',priceFrom:teacher.priceFrom||'',bio:teacher.bio||''});setOpen(true)}
 function change(key,value){setForm(current=>({...current,[key]:value}))}
 function selectedSubjects(){return String(form.subjects||'').split(/[,،]/).map(item=>item.trim()).filter(Boolean)}
 function toggleSubject(subject){const current=selectedSubjects();const next=current.includes(subject)?current.filter(item=>item!==subject):[...current,subject];change('subjects',next.join('، '))}
 function save(){
  setSubmitted(true);
  const subjects=selectedSubjects();
  const allowedSubjects=Array.isArray(provider?.subjects)?provider.subjects:[];
  if(!String(form.name||'').trim()||!subjects.length||(allowedSubjects.length&&subjects.some(subject=>!allowedSubjects.includes(subject))))return;
  const data={...form,subjects,experienceYears:Number(form.experienceYears)||0,priceFrom:Number(form.priceFrom)||0};
  if(editing)dispatch(IrancellAcademyUpdateTeacher(editing.id,data));else dispatch(IrancellAcademyAddTeacher(data));
  setOpen(false);setEditing(null);setSubmitted(false);setForm(emptyForm)
 }
 if(!provider||provider.registrationStatus!=='complete')return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}><IrancellPageHeader eyebrow="آموزشگاه" title="مدرس‌های آموزشگاه" description="ابتدا اطلاعات آموزشگاه را تکمیل کنید."/><IrancellStatePanel state="blocked" title="پروفایل آموزشگاه تکمیل نشده" description="برای معرفی مدرس، ابتدا هویت و مجوز آموزشگاه را ثبت کنید." action={<IrancellButton onClick={()=>onNavigate?.('academy/profile')}>تکمیل پروفایل</IrancellButton>}/></IrancellPageScaffold>;
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="تأمین مدرس" title="مدرس‌های آموزشگاه" description="مدرس‌هایی که اینجا معرفی می‌کنید در فرم قیمت‌دهی قابل انتخاب هستند." actions={<IrancellButton onClick={startAdd}>افزودن مدرس</IrancellButton>}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'13px',marginTop:'16px'}}>
   {teachers.length?teachers.map(teacher=><IrancellCard key={teacher.id} title={teacher.name} subtitle={Array.isArray(teacher.subjects)?teacher.subjects.join('، '):'بدون درس'}>
    <div style={{display:'grid',gap:'9px'}}>
     <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}><IrancellStatusBadge status={teacher.status||'active'}/><span style={{fontSize:'10px',color:'#6E7078'}}>{IrancellFormatPersianNumber(teacher.experienceYears||0)} سال سابقه</span></div>
     <p style={{margin:0,color:'#65666E',fontSize:'10px',lineHeight:1.9}}>{teacher.bio||'برای این مدرس توضیح کوتاهی ثبت نشده است.'}</p>
     <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}><IrancellButton size="sm" variant="secondary" onClick={()=>startEdit(teacher)}>ویرایش</IrancellButton><IrancellButton size="sm" variant={teacher.status==='active'?'danger':'success'} onClick={()=>dispatch(IrancellAcademyUpdateTeacher(teacher.id,{status:teacher.status==='active'?'paused':'active'}))}>{teacher.status==='active'?'توقف دریافت کلاس':'فعال‌کردن'}</IrancellButton></div>
    </div>
   </IrancellCard>):<IrancellStatePanel state="empty" title="هنوز مدرسی معرفی نشده" description="حداقل یک مدرس فعال اضافه کنید تا آموزشگاه بتواند برای درخواست دانش‌آموز قیمت ارسال کند." action={<IrancellButton onClick={startAdd}>معرفی اولین مدرس</IrancellButton>}/>} 
  </div>
  <IrancellModal open={open} title={editing?'ویرایش مدرس':'معرفی مدرس جدید'} onClose={()=>setOpen(false)} actions={<div style={{display:'flex',gap:'8px'}}><IrancellButton variant="secondary" onClick={()=>setOpen(false)}>انصراف</IrancellButton><IrancellButton onClick={save}>{editing?'ذخیره تغییرات':'افزودن مدرس'}</IrancellButton></div>}>
   <div style={{display:'grid',gap:'11px'}}><IrancellInput label="نام و نام خانوادگی *" value={form.name} error={submitted&&!String(form.name||'').trim()?'نام مدرس الزامی است.':''} onChange={event=>change('name',event.target.value)}/><IrancellInput label="شماره تماس" value={form.mobile} onChange={event=>change('mobile',event.target.value)}/><div style={{display:'grid',gap:'7px'}}><strong style={{fontSize:'11px'}}>درس‌ها *</strong><div style={{display:'flex',flexWrap:'wrap',gap:'7px'}}>{(provider.subjects||[]).map(subject=>{const active=selectedSubjects().includes(subject);return <button type="button" key={subject} aria-pressed={active} onClick={()=>toggleSubject(subject)} style={{minHeight:'38px',padding:'7px 11px',cursor:'pointer',color:'#29292D',background:active?'#FFD100':'#FFFFFF',border:`1px solid ${active?'#E7BD00':'#D9D9DE'}`,borderRadius:'11px',fontFamily:font,fontSize:'10px',fontWeight:800}}>{subject}</button>})}</div>{submitted&&!selectedSubjects().length&&<small style={{color:'#A12626',fontSize:'9px'}}>حداقل یک درس از حوزه‌های آموزشگاه انتخاب کنید.</small>}<small style={{color:'#777982',fontSize:'9px',lineHeight:1.8}}>فقط حوزه‌هایی که در پروفایل آموزشگاه ثبت شده‌اند قابل انتخاب هستند.</small></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,160px),1fr))',gap:'10px'}}><IrancellInput label="سابقه (سال)" type="number" min="0" value={form.experienceYears} onChange={event=>change('experienceYears',event.target.value)}/><IrancellInput label="شروع قیمت" type="number" min="0" value={form.priceFrom} onChange={event=>change('priceFrom',event.target.value)}/></div><IrancellTextarea label="معرفی مدرس" value={form.bio} rows={3} onChange={event=>change('bio',event.target.value)}/></div>
  </IrancellModal>
 </IrancellPageScaffold>
}