export function IrancellParentReportsPage({params,onNavigate}){
 const{state}=useIrancellStore();
 const parentId=state.session.currentUserId;
 const family=state.family||{};
 const children=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active').map(item=>state.identity.usersById[item.childId]).filter(Boolean);
 const[selectedChildId,setSelectedChildId]=useState(params?.child&&children.some(child=>child.id===params.child)?params.child:children[0]?.id||'');
 const child=children.find(item=>item.id===selectedChildId)||children[0]||null;
 if(!child)return <><IrancellPageHeader eyebrow="خانواده" title="گزارش پیشرفت" description="گزارش آموزشی فرزندان متصل به حساب خانواده."/><IrancellStatePanel state="empty" title="فرزندی متصل نیست" description="برای مشاهده گزارش ابتدا یک دانش‌آموز را به حساب خانواده متصل کنید." action={<IrancellButton onClick={()=>onNavigate?.('parent/children')}>مدیریت فرزندان</IrancellButton>}/></>;
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===child.id);
 const completedClasses=classes.filter(item=>item.status==='completed').length;
 const activeClasses=classes.filter(item=>!['completed','cancelled'].includes(item.status)).length;
 const progress=Math.max(0,Math.min(100,Number(family.childProgressById?.[child.id])||0));
 const requests=Object.values(state.marketplace.requestsById||{}).filter(item=>item.studentId===child.id);
 return <>
  <IrancellPageHeader eyebrow="خانواده" title="گزارش پیشرفت" description="کلاس‌ها، درخواست‌ها و مسیر یادگیری هر فرزند را جداگانه پیگیری کنید."/>
  <IrancellCard title="انتخاب دانش‌آموز"><div className="ir-inline-form"><IrancellSelect label="فرزند" value={child.id} onChange={event=>setSelectedChildId(event.target.value)} options={children.map(item=>({value:item.id,label:`${item.name} — ${item.grade||'پایه ثبت نشده'}`}))}/><IrancellButton onClick={()=>onNavigate?.(`parent/children/${child.id}`)}>پروفایل دانش‌آموز</IrancellButton></div></IrancellCard>
  <div className="ir-stats-grid"><IrancellStatCard label="پیشرفت یادگیری" value={`${IrancellFormatPersianNumber(progress)}٪`}/><IrancellStatCard label="کلاس فعال" value={IrancellFormatPersianNumber(activeClasses)}/><IrancellStatCard label="کلاس تکمیل‌شده" value={IrancellFormatPersianNumber(completedClasses)}/><IrancellStatCard label="درخواست آموزشی" value={IrancellFormatPersianNumber(requests.length)}/></div>
  <IrancellCard title="خلاصه مسیر"><div className="ir-progress"><span style={{width:`${progress}%`}}/></div><p>{child.name} در حال حاضر {IrancellFormatPersianNumber(progress)}٪ از مسیر برنامه‌ریزی‌شده را تکمیل کرده است.</p><div className="ir-inline-form"><IrancellButton onClick={()=>onNavigate?.('parent/classes',{child:child.id})}>کلاس‌ها</IrancellButton><IrancellButton variant="secondary" onClick={()=>onNavigate?.('parent/payments')}>پرداخت‌ها</IrancellButton></div></IrancellCard>
 </>
}