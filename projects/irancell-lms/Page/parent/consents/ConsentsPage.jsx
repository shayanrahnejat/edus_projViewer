export function IrancellParentConsentsPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const[names,setNames]=useState({});
 const parentId=state.session.currentUserId;
 const parent=state.identity.usersById[parentId]||{};
 const childIds=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active').map(item=>item.childId);
 const items=Object.values(state.consent.documentsById||{}).filter(item=>item.parentId===parentId&&childIds.includes(item.childId)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 function sign(item){
  const signatureName=String(names[item.id]||parent.name||'').trim();
  if(!signatureName)return;
  dispatch(IrancellConsentSign(item.id,signatureName))
 }
 return <>
  <IrancellPageHeader eyebrow="امضایی" title="رضایت‌نامه‌های خانواده" description="فقط رضایت‌نامه‌های مربوط به فرزندان متصل به حساب شما نمایش داده می‌شوند."/>
  {items.length?<div className="ir-card-list">{items.map(document=>{
   const session=state.classroom.sessionsById[document.sessionId];
   const child=state.identity.usersById[document.childId];
   const expired=new Date(document.expiresAt).getTime()<=Date.now();
   return <IrancellCard key={document.id} title={`رضایت کلاس ${session?.title||''}`} action={<IrancellStatusBadge status={expired&&document.status!=='signed'?'expired':document.status}/>}>
    <p>{document.documentText}</p><small>{child?.name||'دانش‌آموز'} · انقضا: {new Date(document.expiresAt).toLocaleString('fa-IR')}</small>
    {document.status!=='signed'&&!expired&&<div className="ir-inline-form"><IrancellInput label="نام امضاکننده" value={names[document.id]??parent.name??''} onChange={event=>setNames(current=>({...current,[document.id]:event.target.value}))} placeholder="نام و نام خانوادگی والد"/><IrancellButton onClick={()=>sign(document)} disabled={!String(names[document.id]??parent.name??'').trim()}>امضای رضایت</IrancellButton></div>}
    {document.status==='signed'&&session?.orderId&&<IrancellButton onClick={()=>onNavigate?.(`payment/${session.orderId}`)}>ادامه به پرداخت امن</IrancellButton>}
   </IrancellCard>
  })}</div>:<IrancellStatePanel state="empty" title="رضایت‌نامه‌ای وجود ندارد" description="در حال حاضر سند فعالی برای امضا در حساب خانواده شما ثبت نشده است."/>}
 </>
}