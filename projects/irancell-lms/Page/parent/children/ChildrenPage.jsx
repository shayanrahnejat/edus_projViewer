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
 const editingChild=editChildId?state.identity.usersById[editChildId]:null;

 function openEdit(child){
  setEditChildId(child.id);
  setChildForm({name:child.name||'',grade:child.grade||'پایه هفتم',mobile:child.mobile||''})
 }

 function saveEdit(){
  if(!editChildId||!childForm.name.trim())return;
  dispatch({type:'IRANCELL_PARENT_UPDATE_CHILD',childId:editChildId,profile:{name:childForm.name,grade:childForm.grade}});
  setEditChildId('')
 }

 function addChild(){
  if(!childForm.name.trim())return;
  dispatch({type:'IRANCELL_PARENT_ADD_CHILD',name:childForm.name,grade:childForm.grade,mobile:childForm.mobile});
  setAddOpen(false);
  setChildForm({name:'',grade:'پایه هفتم',mobile:''})
 }

 if(route==='parent/children/:id'){
  const child=state.identity.usersById[params?.id];
  const linked=child&&IrancellCanViewChild(state,parentId,child.id);
  if(!child||!linked)return <IrancellStatePanel state="unauthorized" title="پروفایل دانش‌آموز در دسترس نیست" description="برای مشاهده این پروفایل، رابطه معتبر خانواده و دانش‌آموز لازم است."/>;
  const progress=Number(family.childProgressById?.[child.id])||0;
  const controls=family.controlsByChildId?.[child.id]||{};
  return <section className="ir-family-child-detail">
   <header className="ir-family-subpage-header">
    <button type="button" aria-label="بازگشت" onClick={()=>onNavigate?.('parent/children')}>←</button>
    <div><h1>{child.name}</h1><p>پروفایل دانش‌آموز خانواده</p></div>
   </header>
   <section className="ir-family-child-detail__hero">
    <span>{String(child.name||'د').trim().charAt(0)}</span>
    <div><h2>{child.name}</h2><p>{child.grade}</p><small>حساب متصل و تأییدشده</small></div>
   </section>
   <section className="ir-family-child-detail__progress">
    <header><strong>پیشرفت یادگیری</strong><span>{IrancellFormatPersianNumber(progress)}٪</span></header>
    <div><span style={{width:`${progress}%`}}/></div>
    <p>{IrancellFormatPersianNumber(family.activeClassCountByChildId?.[child.id]||0)} کلاس فعال</p>
   </section>
   <div className="ir-family-child-detail__actions">
    <button type="button" onClick={()=>onNavigate?.('parent/reports',{child:child.id})}><span>☷</span><div><strong>گزارش پیشرفت</strong><small>فعالیت آموزشی و مسیر یادگیری</small></div></button>
    <button type="button" onClick={()=>onNavigate?.('parent/profile/family-control',{child:child.id})}><span>▣</span><div><strong>کنترل خانواده</strong><small>{controls.onlineClass?'کلاس آنلاین فعال':'کلاس آنلاین غیرفعال'}</small></div></button>
    <button type="button" onClick={()=>onNavigate?.('parent/classes',{child:child.id})}><span>□</span><div><strong>کلاس‌ها</strong><small>برنامه و وضعیت کلاس‌های دانش‌آموز</small></div></button>
    <button type="button" onClick={()=>openEdit(child)}><span>✎</span><div><strong>ویرایش اطلاعات</strong><small>نام و پایه تحصیلی</small></div></button>
   </div>
  </section>
 }

 return <section className="ir-family-children">
  <header>
   <h1>فرزندان</h1>
   <p>مدیریت پروفایل‌های دانش‌آموزی خانواده</p>
  </header>

  <div className="ir-family-children__list">
   {children.map((child,index)=>{
    const progress=Number(family.childProgressById?.[child.id])||0;
    const activeClasses=Number(family.activeClassCountByChildId?.[child.id])||0;
    return <article key={child.id} className={`is-${index%3}`}>
     <div className="ir-family-children__person">
      <span>{String(child.name||'د').trim().charAt(0)}</span>
      <div><h2>{child.name}</h2><p>{child.grade}</p></div>
     </div>
     <div className="ir-family-children__meta"><span>پیشرفت یادگیری: {IrancellFormatPersianNumber(progress)}٪</span><span>آخرین فعالیت: {index===0?'امروز':index===1?'دیروز':'۲ روز پیش'}</span></div>
     <div className="ir-family-children__progress"><span style={{width:`${progress}%`}}/></div>
     <small>کلاس‌های فعال: {IrancellFormatPersianNumber(activeClasses)}</small>
     <div className="ir-family-children__buttons">
      <button type="button" className="is-primary" onClick={()=>onNavigate?.(`parent/children/${child.id}`)}>ورود به پروفایل</button>
      <button type="button" onClick={()=>openEdit(child)}>ویرایش</button>
     </div>
     <button type="button" className="ir-family-children__report" onClick={()=>onNavigate?.('parent/reports',{child:child.id})}>مشاهده گزارش</button>
    </article>
   })}
  </div>

  <button type="button" className="ir-family-children__add" onClick={()=>{setChildForm({name:'',grade:'پایه هفتم',mobile:''});setAddOpen(true)}}>افزودن دانش‌آموز +</button>

  <aside className="ir-family-children__security">
   <span>▱</span>
   <p>برای خروج از پروفایل دانش‌آموز و بازگشت به بخش خانواده، تأیید والدین لازم است.</p>
   <div><b>اثر انگشت</b><b>Face ID</b><b>کد عبور</b><b>رمز عبور</b></div>
  </aside>

  {(addOpen||editingChild)&&<div className="ir-family-form-overlay" onMouseDown={()=>{setAddOpen(false);setEditChildId('')}}>
   <form className="ir-family-form-sheet" onSubmit={event=>{event.preventDefault();editingChild?saveEdit():addChild()}} onMouseDown={event=>event.stopPropagation()}>
    <span className="ir-family-form-sheet__handle"/>
    <header><h2>{editingChild?'ویرایش دانش‌آموز':'افزودن دانش‌آموز'}</h2><button type="button" onClick={()=>{setAddOpen(false);setEditChildId('')}}>×</button></header>
    <label><span>نام و نام خانوادگی</span><input value={childForm.name} onChange={event=>setChildForm(current=>({...current,name:event.target.value}))} placeholder="نام دانش‌آموز"/></label>
    <label><span>پایه تحصیلی</span><select value={childForm.grade} onChange={event=>setChildForm(current=>({...current,grade:event.target.value}))}>{['پایه چهارم','پایه پنجم','پایه ششم','پایه هفتم','پایه هشتم','پایه نهم','پایه دهم','پایه یازدهم','پایه دوازدهم'].map(item=><option key={item}>{item}</option>)}</select></label>
    {!editingChild&&<label><span>شماره موبایل دانش‌آموز</span><input type="tel" dir="ltr" value={childForm.mobile} onChange={event=>setChildForm(current=>({...current,mobile:event.target.value}))} placeholder="09xxxxxxxxx"/></label>}
    <button type="submit" disabled={!childForm.name.trim()}>{editingChild?'ذخیره تغییرات':'افزودن به خانواده'}</button>
   </form>
  </div>}
 </section>
}