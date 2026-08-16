export function IrancellAcademyFinancePage({onNavigate}){
 const{state}=useIrancellStore();
 const academyId=state.session.currentUserId;
 const payments=Object.values(state.payment.paymentsById||{}).filter(item=>item.providerId===academyId).sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
 const paid=payments.filter(item=>['held','paid','released'].includes(item.status));
 const held=payments.filter(item=>state.payment.escrowByOrderId?.[item.orderId]?.status==='held');
 const total=paid.reduce((sum,item)=>sum+(Number(item.amount)||0),0);
 const heldTotal=held.reduce((sum,item)=>sum+(Number(item.amount)||0),0);
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF',fontFamily:font}}>
  <IrancellPageHeader eyebrow="مالی آموزشگاه" title="پرداخت‌ها و وجه امانی" description="مبالغ کلاس‌ها پس از پرداخت خانواده در وضعیت امانی نگهداری و با نتیجه خدمت قابل تسویه می‌شوند."/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,190px),1fr))',gap:'11px',marginTop:'16px'}}><IrancellStatCard label="پرداخت موفق" value={IrancellFormatPersianNumber(paid.length)} tone="success"/><IrancellStatCard label="ارزش پرداخت‌های موفق" value={IrancellFormatCurrency(total)} tone="info"/><IrancellStatCard label="در امانت" value={IrancellFormatCurrency(heldTotal)} tone="warning"/><IrancellStatCard label="کل تراکنش" value={IrancellFormatPersianNumber(payments.length)}/></div>
  <IrancellCard title="تراکنش‌های آموزشگاه" subtitle="آخرین وضعیت پرداخت سفارش‌های مرتبط" style={{marginTop:'16px'}}>
   <div style={{display:'grid',gap:'9px'}}>{payments.length?payments.map(item=>{const session=state.classroom.sessionsById?.[item.sessionId];const escrow=state.payment.escrowByOrderId?.[item.orderId];return <article key={item.id} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:'10px',alignItems:'center',padding:'12px',background:'#FAFAFB',border:'1px solid #E7E7EA',borderRadius:'13px'}}><div><strong style={{display:'block',fontSize:'12px'}}>{session?.title||item.orderId}</strong><small style={{color:'#72737A',fontSize:'9px'}}>وضعیت پرداخت: {item.status==='held'?'در امانت':item.status==='paid'?'پرداخت شده':item.status==='released'?'تسویه شده':item.status==='pending'?'در انتظار':item.status} · امانت: {escrow?.status==='held'?'نگهداری‌شده':escrow?.status==='released'?'آزادشده':escrow?.status||'ایجاد نشده'}</small></div><strong style={{fontSize:'12px'}}>{IrancellFormatCurrency(item.amount)}</strong></article>}):<IrancellStatePanel state="empty" title="تراکنشی وجود ندارد" description="بعد از انتخاب پیشنهاد و پرداخت خانواده، تراکنش‌های آموزشگاه اینجا نمایش داده می‌شوند."/>}</div>
  </IrancellCard>
 </IrancellPageScaffold>
}