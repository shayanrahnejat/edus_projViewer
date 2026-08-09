export function IrancellTeacherOffersPage(){
 const{state,dispatch}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const offers=Object.values(state.marketplace.offersById||{}).filter(item=>item.providerId===teacherId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 return <>
  <IrancellPageHeader eyebrow="مدرس" title="پیشنهادهای من" description="قیمت‌ها و زمان‌های پیشنهادی ثبت‌شده و نتیجه انتخاب دانش‌آموز."/>
  {offers.length?<div className="ir-card-list">{offers.map(offer=>{const request=state.marketplace.requestsById[offer.requestId];return <IrancellCard key={offer.id} title={`${request?.subject||'درخواست آموزشی'} — ${request?.topic||''}`} action={<IrancellStatusBadge status={offer.status}/>}><p>{IrancellFormatCurrency(offer.price)} · {new Date(offer.proposedTime).toLocaleString('fa-IR')}</p><small>{request?.grade||''} · {request?.description||''}</small>{offer.status==='active'&&<IrancellButton variant="danger" onClick={()=>dispatch({type:'IRANCELL_TEACHER_OFFER_CANCEL',offerId:offer.id})}>لغو پیشنهاد</IrancellButton>}</IrancellCard>})}</div>:<IrancellStatePanel state="empty" title="پیشنهادی ثبت نشده است" description="از بخش درخواست‌ها برای دانش‌آموزان پیشنهاد قیمت و زمان ارسال کنید."/>}
 </>
}