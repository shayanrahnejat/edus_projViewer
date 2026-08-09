export function IrancellParentComplaintsPage({onNavigate}){
 const{state}=useIrancellStore();
 const parentId=state.session.currentUserId;
 const childIds=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active').map(item=>item.childId);
 const sessions=Object.values(state.classroom.sessionsById||{}).filter(item=>childIds.includes(item.studentId));
 const sessionIds=new Set(sessions.map(item=>item.id));
 const items=Object.values(state.quality.complaintsById||{}).filter(item=>item.ownerId===parentId||sessionIds.has(item.sessionId)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 const complaintSession=sessions.find(item=>['completed','live','scheduled'].includes(item.status))||sessions[0]||null;
 return <>
  <IrancellPageHeader eyebrow="کیفیت و بازیابی خدمت" title="شکایت‌ها" description="شکایت‌های مرتبط با کلاس‌های فرزندان این حساب و وضعیت رسیدگی آن‌ها."/>
  <IrancellButton onClick={()=>complaintSession&&onNavigate?.(`complaint/${complaintSession.id}`)} disabled={!complaintSession}>ثبت شکایت جدید</IrancellButton>
  {items.length?<div className="ir-card-list">{items.map(item=><IrancellCard key={item.id} title={item.category} action={<IrancellStatusBadge status={item.status}/>}><p>{item.description}</p><small>{state.classroom.sessionsById[item.sessionId]?.title||'کلاس آموزشی'} · {new Date(item.createdAt).toLocaleString('fa-IR')}</small></IrancellCard>)}</div>:<IrancellStatePanel state="empty" title="شکایتی ثبت نشده است" description="درخواست‌های ثبت‌شده برای کلاس‌های فرزندان در این بخش نمایش داده می‌شوند."/>}
 </>
}