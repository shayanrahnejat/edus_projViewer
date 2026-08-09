export function IrancellTeacherClassesPage({onNavigate}){
 const{state}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const[filter,setFilter]=useState('active');
 const sessions=Object.values(state.classroom.sessionsById||{}).filter(item=>item.providerId===teacherId).sort((a,b)=>new Date(a.startAt)-new Date(b.startAt));
 const visible=sessions.filter(item=>filter==='all'||(filter==='active'&&!['completed','cancelled'].includes(item.status))||item.status===filter);
 return <>
  <IrancellPageHeader eyebrow="مدرس" title="کلاس‌های من" description="جلسه‌های آینده، زنده و تکمیل‌شده این حساب مدرس."/>
  <div className="ir-inline-form"><IrancellButton variant={filter==='active'?'primary':'secondary'} onClick={()=>setFilter('active')}>فعال</IrancellButton><IrancellButton variant={filter==='completed'?'primary':'secondary'} onClick={()=>setFilter('completed')}>تکمیل‌شده</IrancellButton><IrancellButton variant={filter==='all'?'primary':'secondary'} onClick={()=>setFilter('all')}>همه</IrancellButton></div>
  {visible.length?<div className="ir-card-list">{visible.map(item=><IrancellCard key={item.id} title={item.title} action={<IrancellStatusBadge status={item.status}/>}><p>{state.identity.usersById[item.studentId]?.name||'دانش‌آموز'} · {new Date(item.startAt).toLocaleString('fa-IR')}</p><small>{item.providerDisplayName||state.identity.usersById[item.providerId]?.name}</small><IrancellButton onClick={()=>onNavigate?.(`class/${item.id}`)}>{item.status==='completed'?'مشاهده نتیجه':'ورود و بررسی کلاس'}</IrancellButton></IrancellCard>)}</div>:<IrancellStatePanel state="empty" title="کلاسی در این وضعیت وجود ندارد" description="جلسه‌های انتخاب‌شده پس از رزرو دانش‌آموز در این بخش نمایش داده می‌شوند."/>}
 </>
}