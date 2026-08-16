export function IrancellParentChildrenPage({params,onNavigate,screen}){
 const{state,dispatch}=useIrancellStore();
 const parentId=state.session.currentUserId||'parent-1';
 const route=screen?.route||'parent/children';
 const family=state.family||{};
 const relationships=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active');
 const children=relationships.map(item=>state.identity.usersById[item.childId]).filter(Boolean);
 const[addOpen,setAddOpen]=useState(Boolean(params?.add));
 const[editChildId,setEditChildId]=useState('');
 const[childForm,setChildForm]=useState({name:'',grade:'پایه هفتم',mobile:''});
 const[formError,setFormError]=useState('');
 const editingChild=editChildId?state.identity.usersById[editChildId]:null;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'14px'};

 function closeForm(){setAddOpen(false);setEditChildId('');setFormError('')}
 function openAdd(){setChildForm({name:'',grade:'پایه هفتم',mobile:''});setFormError('');setAddOpen(true)}
 function openEdit(child){setEditChildId(child.id);setChildForm({name:child.name||'',grade:child.grade||'پایه هفتم',mobile:child.mobile||''});setFormError('')}
 function submitChild(event){
  event.preventDefault();
  const name=childForm.name.trim(),mobile=childForm.mobile.replace(/\D/g,'');
  if(!name){setFormError('نام دانش‌آموز را وارد کنید.');return}
  if(!editingChild&&mobile&&!/^09\d{9}$/.test(mobile)){setFormError('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.');return}
  if(editingChild)dispatch({type:'IRANCELL_PARENT_UPDATE_CHILD',childId:editingChild.id,profile:{name,grade:childForm.grade}});
  else dispatch({type:'IRANCELL_PARENT_ADD_CHILD',name,grade:childForm.grade,mobile});
  closeForm()
 }

 const childModal=<IrancellModal open={addOpen||Boolean(editingChild)} title={editingChild?'ویرایش اطلاعات دانش‌آموز':'افزودن دانش‌آموز'} variant="sheet" onClose={closeForm} actions={<><IrancellButton variant="secondary" onClick={closeForm}>انصراف</IrancellButton><IrancellButton onClick={submitChild} disabled={!childForm.name.trim()}>{editingChild?'ذخیره تغییرات':'افزودن به خانواده'}</IrancellButton></>}>
  <IrancellForm onSubmit={submitChild}>
   <IrancellInput label="نام و نام خانوادگی" value={childForm.name} onChange={event=>{setChildForm(current=>({...current,name:event.target.value}));setFormError('')}} placeholder="نام دانش‌آموز" autoFocus/>
   <IrancellSelect label="پایه تحصیلی" value={childForm.grade} onChange={event=>setChildForm(current=>({...current,grade:event.target.value}))} options={['پایه چهارم','پایه پنجم','پایه ششم','پایه هفتم','پایه هشتم','پایه نهم','پایه دهم','پایه یازدهم','پایه دوازدهم'].map(item=>({value:item,label:item}))}/>
   {!editingChild&&<IrancellInput label="شماره موبایل دانش‌آموز (اختیاری)" type="tel" dir="ltr" inputMode="numeric" value={childForm.mobile} onChange={event=>{setChildForm(current=>({...current,mobile:event.target.value.replace(/\D/g,'').slice(0,11)}));setFormError('')}} placeholder="09xxxxxxxxx"/>}
   {formError&&<p role="alert" style={{margin:0,padding:'10px 12px',color:'#A12626',background:'#FFF0F0',border:'1px solid #F1C7C7',borderRadius:'12px',fontFamily:font,fontSize:'11px',fontWeight:800}}>{formError}</p>}
   <button type="submit" style={{position:'absolute',width:'1px',height:'1px',overflow:'hidden',clipPath:'inset(50%)'}}>ثبت</button>
  </IrancellForm>
 </IrancellModal>;

 if(route==='parent/children/:id'){
  const child=state.identity.usersById[params?.id];
  const linked=child&&IrancellCanViewChild(state,parentId,child.id);
  if(!child||!linked)return <IrancellPageScaffold title="پروفایل دانش‌آموز" onBack={()=>onNavigate?.('parent/children')}><IrancellStatePanel state="unauthorized" title="پروفایل دانش‌آموز در دسترس نیست" description="برای مشاهده این پروفایل، رابطه معتبر خانواده و دانش‌آموز لازم است."/></IrancellPageScaffold>;
  const progress=Math.max(0,Math.min(100,Number(family.childProgressById?.[child.id])||0));
  const controls=family.controlsByChildId?.[child.id]||{};
  const sessions=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===child.id);
  const completed=sessions.filter(item=>item.status==='completed').length;
  return <IrancellPageScaffold title={child.name} subtitle={`${child.grade||'پایه ثبت نشده'} · حساب متصل و تأییدشده`} onBack={()=>onNavigate?.('parent/children')} actions={<IrancellButton size="sm" variant="secondary" onClick={()=>openEdit(child)}>ویرایش اطلاعات</IrancellButton>}>
   <div style={{...grid,marginBottom:'15px'}}><IrancellStatCard icon={TrendingUp} label="پیشرفت یادگیری" value={`${IrancellFormatPersianNumber(progress)}٪`} tone="success"/><IrancellStatCard icon={CalendarCheck} label="کلاس فعال" value={IrancellFormatPersianNumber(family.activeClassCountByChildId?.[child.id]||0)} tone="info"/><IrancellStatCard icon={CheckCircle2} label="کلاس تکمیل‌شده" value={IrancellFormatPersianNumber(completed)}/></div>
   <IrancellCard title="مسیر یادگیری" subtitle="پیشرفت از فعالیت دوره‌ها، تکالیف و کلاس‌ها محاسبه می‌شود.">
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'9px'}}><span style={{color:'#686970',fontSize:'12px'}}>پیشرفت کل</span><strong style={{fontSize:'18px',fontWeight:900}}>{IrancellFormatPersianNumber(progress)}٪</strong></div>
    <div style={{height:'10px',overflow:'hidden',background:'#E8E8EC',borderRadius:'999px'}}><span style={{display:'block',width:`${progress}%`,height:'100%',background:'#FFD100',borderRadius:'inherit'}}/></div>
   </IrancellCard>
   <IrancellCard title="مدیریت دانش‌آموز" style={{marginTop:'15px'}}><div style={grid}>{[
    {label:'گزارش پیشرفت',description:'نمره‌ها، تکالیف و فعالیت‌ها',icon:Activity,onClick:()=>onNavigate?.('parent/reports',{child:child.id})},
    {label:'کلاس‌ها',description:'برنامه و وضعیت جلسات',icon:CalendarCheck,onClick:()=>onNavigate?.('parent/classes',{child:child.id})},
    {label:'کنترل خانواده',description:controls.onlineClass?'کلاس آنلاین فعال است':'کلاس آنلاین غیرفعال است',icon:ShieldCheck,onClick:()=>onNavigate?.('parent/profile/family-control',{child:child.id})},
    {label:'ویرایش اطلاعات',description:'نام و پایه تحصیلی',icon:UserRound,onClick:()=>openEdit(child)}
   ].map(item=>{const Icon=item.icon;return <button type="button" key={item.label} onClick={item.onClick} style={{display:'flex',minWidth:0,alignItems:'center',gap:'12px',padding:'15px',cursor:'pointer',textAlign:'right',color:'#202024',background:'#FFFDF2',border:'1px solid #E8E1C7',borderRadius:'17px',fontFamily:font}}><span style={{display:'grid',width:'45px',height:'45px',placeItems:'center',flex:'0 0 45px',background:'#FFF3AE',borderRadius:'14px'}}><Icon size={21}/></span><span style={{display:'flex',minWidth:0,flexDirection:'column',gap:'3px'}}><strong style={{fontSize:'13px',fontWeight:900}}>{item.label}</strong><small style={{color:'#777982',fontSize:'10px'}}>{item.description}</small></span></button>})}</div></IrancellCard>
   {childModal}
  </IrancellPageScaffold>
 }

 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,28px)'}}>
  <IrancellPageHeader eyebrow="خانواده" title="فرزندان" description="پروفایل، پیشرفت، کلاس‌ها و دسترسی‌های هر دانش‌آموز را جداگانه مدیریت کنید." actions={<IrancellButton icon={Users} onClick={openAdd}>افزودن دانش‌آموز</IrancellButton>}/>
  {children.length?<div style={grid}>{children.map(child=>{
   const progress=Math.max(0,Math.min(100,Number(family.childProgressById?.[child.id])||0));
   const activeClasses=Number(family.activeClassCountByChildId?.[child.id])||0;
   return <IrancellCard key={child.id} style={{padding:'17px'}}>
    <div style={{display:'flex',minWidth:0,alignItems:'center',gap:'11px',marginBottom:'15px'}}><span style={{display:'grid',width:'52px',height:'52px',placeItems:'center',flex:'0 0 52px',color:'#202024',background:'#FFD100',borderRadius:'17px',fontSize:'19px',fontWeight:900}}>{String(child.name||'د').trim().charAt(0)}</span><div style={{minWidth:0}}><h2 style={{margin:0,fontSize:'15px',fontWeight:900}}>{child.name}</h2><p style={{margin:'3px 0 0',color:'#777982',fontSize:'11px'}}>{child.grade||'پایه ثبت نشده'}</p></div></div>
    <div style={{display:'flex',justifyContent:'space-between',gap:'10px',fontSize:'11px'}}><span style={{color:'#686970'}}>پیشرفت یادگیری</span><b>{IrancellFormatPersianNumber(progress)}٪</b></div>
    <div style={{height:'8px',margin:'8px 0 11px',overflow:'hidden',background:'#E8E8EC',borderRadius:'999px'}}><span style={{display:'block',width:`${progress}%`,height:'100%',background:'#FFD100',borderRadius:'inherit'}}/></div>
    <small style={{display:'block',marginBottom:'14px',color:'#686970',fontSize:'10px'}}>{IrancellFormatPersianNumber(activeClasses)} کلاس فعال</small>
    <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}><IrancellButton size="sm" onClick={()=>onNavigate?.(`parent/children/${child.id}`)}>ورود به پروفایل</IrancellButton><IrancellButton size="sm" variant="secondary" onClick={()=>openEdit(child)}>ویرایش</IrancellButton><IrancellButton size="sm" variant="ghost" onClick={()=>onNavigate?.('parent/reports',{child:child.id})}>گزارش</IrancellButton></div>
   </IrancellCard>
  })}</div>:<IrancellStatePanel state="empty" title="دانش‌آموزی به حساب متصل نیست" description="با افزودن دانش‌آموز، کنترل خانواده و گزارش آموزشی او فعال می‌شود." action={<IrancellButton onClick={openAdd}>افزودن دانش‌آموز</IrancellButton>}/>}
  <IrancellCard style={{marginTop:'15px',background:'#FFF7CE',borderColor:'#EDD365'}}><div style={{display:'flex',minWidth:0,alignItems:'flex-start',gap:'11px'}}><ShieldCheck size={22}/><div><strong style={{display:'block',fontSize:'13px',fontWeight:900}}>حفاظت از حساب دانش‌آموز</strong><p style={{margin:'4px 0 0',color:'#765F00',fontSize:'11px',lineHeight:1.9}}>خروج از پنل دانش‌آموز و تغییر تنظیمات حساس مطابق کنترل‌های خانواده به تأیید سرپرست نیاز دارد.</p></div></div></IrancellCard>
  {childModal}
 </IrancellPageScaffold>
}