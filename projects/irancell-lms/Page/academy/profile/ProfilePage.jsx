export function IrancellAcademyProfilePage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const user=state.identity.usersById?.[academyId]||{};
 const provider=state.marketplace.providersById?.[academyId]||{};
 const[submitted,setSubmitted]=useState(false);
 const[saved,setSaved]=useState(false);
 const[form,setForm]=useState({
  organizationName:provider.organizationName||provider.name||user.organizationName||user.name||'',
  legalName:provider.legalName||'',
  licenseNumber:provider.licenseNumber||'',
  nationalId:provider.nationalId||'',
  managerName:provider.managerName||'',
  mobile:provider.mobile||user.mobile||'',
  city:provider.city||'',
  address:provider.address||'',
  website:provider.website||'',
  subjects:Array.isArray(provider.subjects)?provider.subjects.join('، '):'',
  bio:provider.bio||'',
  priceFrom:provider.priceFrom||''
 });
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 function change(key,value){setSaved(false);setForm(current=>({...current,[key]:value}))}
 function submit(event){
  event.preventDefault();
  setSubmitted(true);
  const subjects=String(form.subjects||'').split(/[,،]/).map(item=>item.trim()).filter(Boolean);
  if(!String(form.organizationName||'').trim()||!String(form.licenseNumber||'').trim()||!String(form.city||'').trim()||!subjects.length)return;
  dispatch(IrancellAcademyUpdateProfile({...form,subjects,priceFrom:Number(form.priceFrom)||0}));
  setSaved(true)
 }
 const errors={organizationName:submitted&&!String(form.organizationName||'').trim(),licenseNumber:submitted&&!String(form.licenseNumber||'').trim(),city:submitted&&!String(form.city||'').trim(),subjects:submitted&&!String(form.subjects||'').trim()};
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="ثبت آموزشگاه" title="پروفایل کسب‌وکار آموزشی" description="این اطلاعات هویت آموزشگاه را می‌سازد و در پیشنهادهای ارسالی به دانش‌آموز نمایش داده می‌شود." actions={<IrancellButton variant="secondary" onClick={()=>onNavigate?.('academy/home')}>بازگشت به داشبورد</IrancellButton>}/>
  {saved&&<IrancellStatusBanner tone="success" title="اطلاعات ذخیره شد">پروفایل آموزشگاه در حافظه محلی ثبت شد و اکنون می‌توانید مدرس معرفی و پیشنهاد ارسال کنید.</IrancellStatusBanner>}
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',gap:'16px',alignItems:'start',marginTop:'16px'}}>
   <IrancellCard title="اطلاعات ثبتی و معرفی" subtitle="فیلدهای ستاره‌دار برای فعال‌شدن بازار الزامی هستند">
    <form onSubmit={submit} style={{display:'grid',gap:'12px'}}>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,220px),1fr))',gap:'12px'}}>
      <IrancellInput label="نام آموزشگاه *" value={form.organizationName} error={errors.organizationName?'نام آموزشگاه الزامی است.':''} onChange={event=>change('organizationName',event.target.value)}/>
      <IrancellInput label="نام حقوقی" value={form.legalName} onChange={event=>change('legalName',event.target.value)}/>
      <IrancellInput label="شماره مجوز *" value={form.licenseNumber} error={errors.licenseNumber?'شماره مجوز الزامی است.':''} onChange={event=>change('licenseNumber',event.target.value)}/>
      <IrancellInput label="شناسه ملی" value={form.nationalId} onChange={event=>change('nationalId',event.target.value)}/>
      <IrancellInput label="نام مدیر مسئول" value={form.managerName} onChange={event=>change('managerName',event.target.value)}/>
      <IrancellInput label="شماره تماس" value={form.mobile} onChange={event=>change('mobile',event.target.value)}/>
      <IrancellInput label="شهر *" value={form.city} error={errors.city?'شهر فعالیت الزامی است.':''} onChange={event=>change('city',event.target.value)}/>
      <IrancellInput label="وب‌سایت" value={form.website} onChange={event=>change('website',event.target.value)}/>
      <IrancellInput label="شروع قیمت خدمات (تومان)" type="number" min="0" value={form.priceFrom} onChange={event=>change('priceFrom',event.target.value)}/>
     </div>
     <IrancellInput label="درس‌ها و حوزه‌ها *" value={form.subjects} error={errors.subjects?'حداقل یک درس وارد کنید.':''} helper="با ویرگول جدا کنید؛ مثال: ریاضی، فیزیک، شیمی" onChange={event=>change('subjects',event.target.value)}/>
     <IrancellTextarea label="آدرس" value={form.address} rows={2} onChange={event=>change('address',event.target.value)}/>
     <IrancellTextarea label="معرفی آموزشگاه" value={form.bio} rows={4} onChange={event=>change('bio',event.target.value)}/>
     <div style={{display:'flex',flexWrap:'wrap',gap:'9px'}}><IrancellButton type="submit">ثبت و فعال‌سازی آموزشگاه</IrancellButton><IrancellButton variant="secondary" onClick={()=>onNavigate?.('academy/teachers')}>مدیریت مدرس‌ها</IrancellButton></div>
    </form>
   </IrancellCard>
   <IrancellCard title="وضعیت حساب" subtitle="آمادگی برای دریافت تقاضا">
    <div style={{display:'grid',gap:'10px'}}>
     <IrancellStatusBadge status={provider.verificationStatus||'incomplete'}/>
     <div style={{padding:'12px',background:'#FFF7CE',borderRadius:'13px'}}><strong style={{display:'block',fontSize:'12px'}}>ذخیره‌سازی محلی فعال است</strong><small style={{display:'block',marginTop:'4px',color:'#746319',fontSize:'10px',lineHeight:1.8}}>پروفایل، مدرس‌ها، درخواست‌ها و پیشنهادها پس از رفرش مرورگر باقی می‌مانند.</small></div><div style={{padding:'12px',background:'#F1FAF4',border:'1px solid #C9E8D4',borderRadius:'13px'}}><strong style={{display:'block',fontSize:'12px'}}>گام بعدی</strong><small style={{display:'block',marginTop:'4px',color:'#41614B',fontSize:'10px',lineHeight:1.8}}>پس از ثبت اطلاعات، حداقل یک مدرس فعال معرفی کنید. سپس فقط درخواست‌های مرتبط با حوزه‌های آموزشگاه در بازار نمایش داده می‌شوند.</small></div>
     <div style={{display:'grid',gap:'7px',fontSize:'11px'}}><span>نام: <b>{provider.name||'تکمیل نشده'}</b></span><span>مجوز: <b>{provider.licenseNumber||'تکمیل نشده'}</b></span><span>شهر: <b>{provider.city||'تکمیل نشده'}</b></span><span>حوزه‌ها: <b>{Array.isArray(provider.subjects)&&provider.subjects.length?provider.subjects.join('، '):'تکمیل نشده'}</b></span></div>
    </div>
   </IrancellCard>
  </div>
 </IrancellPageScaffold>
}