export function IrancellAcademyOffersPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const offers=Object.values(state.marketplace.offersById||{}).filter(item=>item.providerId===academyId).sort((a,b)=>new Date(b.updatedAt||b.createdAt||0)-new Date(a.updatedAt||a.createdAt||0));
 const activeCount=offers.filter(item=>item.status==='active').length;
 const selectedCount=offers.filter(item=>item.status==='selected').length;
 const totalQuoted=offers.reduce((sum,item)=>sum+(Number(item.price)||0),0);
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="مدیریت فروش" title="پیشنهادهای آموزشگاه" description="قیمت‌های ارسالی، مدرس تعیین‌شده و وضعیت انتخاب هر پیشنهاد را مدیریت کنید." actions={<IrancellButton onClick={()=>onNavigate?.('academy/requests')}>مشاهده تقاضاهای جدید</IrancellButton>}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))',gap:'11px',marginTop:'16px'}}><IrancellStatCard label="کل پیشنهاد" value={IrancellFormatPersianNumber(offers.length)}/><IrancellStatCard label="فعال" value={IrancellFormatPersianNumber(activeCount)} tone="warning"/><IrancellStatCard label="انتخاب‌شده" value={IrancellFormatPersianNumber(selectedCount)} tone="success"/><IrancellStatCard label="ارزش قیمت‌های ارسالی" value={IrancellFormatCurrency(totalQuoted)} tone="info"/></div>
  <div style={{display:'grid',gap:'12px',marginTop:'16px'}}>{offers.length?offers.map(offer=>{
   const request=state.marketplace.requestsById?.[offer.requestId]||{};
   return <IrancellCard key={offer.id} title={`${request.subject||'درخواست'} — ${request.topic||offer.requestId}`} subtitle={`مدرس: ${offer.assignedTeacherName||'تعیین نشده'}`}>
    <div style={{display:'grid',gap:'9px'}}><div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}><IrancellStatusBadge status={offer.status}/><strong style={{fontSize:'14px'}}>{IrancellFormatCurrency(offer.price)}</strong><span style={{color:'#6D6E75',fontSize:'10px'}}>{offer.proposedTime?new Date(offer.proposedTime).toLocaleString('fa-IR'):'زمان ثبت نشده'}</span></div><p style={{margin:0,color:'#666871',fontSize:'10px',lineHeight:1.9}}>{offer.description||'بدون توضیح تکمیلی'}</p><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{offer.status==='active'&&<IrancellButton size="sm" variant="danger" onClick={()=>dispatch(IrancellMarketplaceWithdrawOffer(offer.id))}>لغو پیشنهاد</IrancellButton>}<IrancellButton size="sm" variant="secondary" onClick={()=>onNavigate?.('academy/requests',{request:offer.requestId})}>مشاهده درخواست</IrancellButton>{offer.status==='selected'&&<IrancellButton size="sm" onClick={()=>onNavigate?.('academy/classes')}>مشاهده کلاس</IrancellButton>}</div></div>
   </IrancellCard>
  }):<IrancellStatePanel state="empty" title="هنوز پیشنهادی ارسال نشده" description="تقاضاهای دانش‌آموز را بررسی کنید و با تعیین مدرس، قیمت و زمان، اولین پیشنهاد را بفرستید." action={<IrancellButton onClick={()=>onNavigate?.('academy/requests')}>رفتن به بازار تقاضا</IrancellButton>}/>}</div>
 </IrancellPageScaffold>
}