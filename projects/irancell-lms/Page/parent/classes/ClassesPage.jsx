export function IrancellParentClassesPage({params,onNavigate}){
 const{state}=useIrancellStore();
 const parentId=state.session.currentUserId;
 const relationships=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active');
 const childIds=relationships.map(item=>item.childId);
 const requestedChildId=params?.child&&childIds.includes(params.child)?params.child:'';
 const items=Object.values(state.classroom.sessionsById||{}).filter(item=>childIds.includes(item.studentId)&&(!requestedChildId||item.studentId===requestedChildId)).sort((a,b)=>new Date(a.startAt)-new Date(b.startAt));
 return <>
  <IrancellPageHeader eyebrow="نظارت خانواده" title="کلاس‌های فرزندان" description="زمان، مدرس، رضایت، پرداخت و نتیجه کلاس‌های فرزندان متصل به این حساب را مشاهده کنید."/>
  {items.length?<div className="ir-card-list">{items.map(item=>{
   const child=state.identity.usersById[item.studentId];
   return <IrancellCard key={item.id}><article className="ir-class-row"><div><h3>{item.title}</h3><p>{child?.name||'دانش‌آموز'} · {new Date(item.startAt).toLocaleString('fa-IR')}</p><small>{item.providerDisplayName||state.identity.usersById[item.providerId]?.name||'ارائه‌دهنده آموزشی'}</small></div><IrancellStatusBadge status={item.status}/><IrancellButton onClick={()=>onNavigate?.(`class/${item.id}`)}>وضعیت کلاس</IrancellButton></article></IrancellCard>
  })}</div>:<IrancellStatePanel state="empty" title="کلاسی پیدا نشد" description="برای فرزندان متصل به این حساب هنوز کلاس فعالی ثبت نشده است." action={<IrancellButton onClick={()=>onNavigate?.('parent/children')}>مشاهده فرزندان</IrancellButton>}/>} 
 </>
}