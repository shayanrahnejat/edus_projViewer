export function IrancellParentPaymentsPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const parentId=state.session.currentUserId||'parent-1';
 const family=state.family||{};
 const wallet=family.walletsByParentId?.[parentId]||{balance:0};
 const pending=Object.values(family.pendingPaymentsById||{}).filter(item=>item.parentId===parentId&&item.status==='pending').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 const invoices=Object.values(family.invoicesById||{}).filter(item=>item.parentId===parentId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 const[topupOpen,setTopupOpen]=useState(false);
 const[historyOpen,setHistoryOpen]=useState(false);
 const[selectedInvoiceId,setSelectedInvoiceId]=useState('');
 const[customAmount,setCustomAmount]=useState('');
 const[topupError,setTopupError]=useState('');
 const selectedInvoice=invoices.find(item=>item.id===selectedInvoiceId)||null;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const paidTotal=invoices.filter(item=>item.status==='paid').reduce((sum,item)=>sum+(Number(item.amount)||0),0);

 function topup(amount){
  const normalized=Math.round(Number(amount)||0);
  if(normalized<10000){setTopupError('حداقل مبلغ افزایش موجودی ۱۰٬۰۰۰ تومان است.');return}
  dispatch({type:'IRANCELL_PARENT_WALLET_TOPUP',amount:normalized});
  setCustomAmount('');setTopupError('');setTopupOpen(false)
 }
 function downloadInvoice(item){
  if(typeof document==='undefined'||typeof URL==='undefined')return;
  const content=['رسید پرداخت ایرانسل آموزش',`عنوان: ${item.title}`,`مبلغ: ${item.amount} تومان`,`وضعیت: ${item.status==='paid'?'پرداخت‌شده':item.status}`,`تاریخ: ${new Date(item.createdAt).toLocaleString('fa-IR')}`,`شناسه: ${item.id}`].join('\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`irancell-receipt-${item.id}.txt`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),0)
 }

 return <IrancellPageScaffold>
  <IrancellPageHeader eyebrow="پرداخت امن" title="پرداخت‌ها و کیف پول" description="موجودی خانواده، پرداخت‌های در انتظار، فاکتورها و رسیدهای قابل دریافت را مدیریت کنید." actions={<IrancellButton variant="secondary" onClick={()=>setHistoryOpen(value=>!value)}>{historyOpen?'بستن تاریخچه':'تاریخچه تراکنش‌ها'}</IrancellButton>}/>
  <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'14px',marginBottom:'15px'}}>
   <IrancellCard style={{minHeight:'210px',justifyContent:'space-between',color:'#FFFFFF',background:'linear-gradient(135deg,#202024,#353527)',borderColor:'#202024',boxShadow:'0 18px 42px rgba(32,32,36,.2)'}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'}}><span style={{display:'grid',width:'50px',height:'50px',placeItems:'center',background:'#FFD100',borderRadius:'16px',color:'#202024'}}><WalletCards size={24}/></span><small style={{color:'#D9D9CE',fontFamily:font,fontSize:'11px'}}>کیف پول خانواده</small></div>
    <div style={{margin:'28px 0'}}><strong style={{display:'block',fontFamily:font,fontSize:'clamp(24px,4vw,36px)',fontWeight:900}}>{IrancellFormatPersianNumber(wallet.balance)} <small style={{fontSize:'13px'}}>تومان</small></strong><span style={{display:'block',marginTop:'5px',color:'#D2D2C8',fontFamily:font,fontSize:'10px'}}>آخرین تراکنش: {wallet.lastTransactionAt?new Date(wallet.lastTransactionAt).toLocaleDateString('fa-IR'):'—'}</span></div>
    <IrancellButton onClick={()=>setTopupOpen(true)}>افزایش موجودی</IrancellButton>
   </IrancellCard>
   <div style={{display:'grid',gap:'12px'}}><IrancellStatCard icon={Activity} label="کل پرداخت موفق" value={`${IrancellFormatPersianNumber(paidTotal)} تومان`} tone="success"/><IrancellStatCard icon={WalletCards} label="در انتظار پرداخت" value={IrancellFormatPersianNumber(pending.length)} tone={pending.length?'warning':'success'}/></div>
  </section>

  {historyOpen&&<IrancellCard title="تراکنش‌های اخیر" subtitle="تازه‌ترین پرداخت‌ها و درخواست‌های مالی" style={{marginBottom:'15px'}}>
   <div style={{display:'grid',gap:'9px'}}>{[...invoices,...pending].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(item=><article key={item.id} style={{display:'flex',minWidth:0,flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'12px 0',borderBottom:'1px solid #EEE9D4',fontFamily:font}}><div style={{minWidth:0,flex:'1 1 220px'}}><strong style={{display:'block',fontSize:'12px',fontWeight:900}}>{item.title}</strong><small style={{color:'#777982',fontSize:'10px'}}>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</small></div><div style={{textAlign:'left'}}><b style={{display:'block',fontSize:'12px'}}>{IrancellFormatPersianNumber(item.amount)} تومان</b><small style={{color:item.status==='paid'?'#21663D':'#765F00',fontSize:'10px'}}>{item.status==='paid'?'پرداخت‌شده':'در انتظار'}</small></div></article>)}</div>
  </IrancellCard>}

  <IrancellCard title="پرداخت‌های در انتظار" subtitle="تکمیل این پرداخت‌ها برای نهایی‌شدن رزرو لازم است" style={{marginBottom:'15px'}}>
   {pending.length?<div style={{display:'grid',gap:'10px'}}>{pending.map(item=><article key={item.id} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',alignItems:'center',gap:'12px',padding:'14px',background:'#FFF7CE',border:'1px solid #EDD365',borderRadius:'16px',fontFamily:font}}><div style={{minWidth:0}}><strong style={{display:'block',fontSize:'13px',fontWeight:900}}>{item.title}</strong><small style={{color:'#765F00',fontSize:'10px'}}>در انتظار تأیید و پرداخت امن</small></div><div style={{textAlign:'left'}}><b style={{display:'block',marginBottom:'7px',fontSize:'13px'}}>{IrancellFormatPersianNumber(item.amount)} تومان</b><IrancellButton size="sm" onClick={()=>onNavigate?.(`payment/${item.orderId}`)}>پرداخت</IrancellButton></div></article>)}</div>:<IrancellStatePanel state="success" title="پرداخت معوق ندارید" description="همه پرداخت‌های لازم برای کلاس‌های فرزندان تکمیل شده‌اند."/>}
  </IrancellCard>

  <IrancellCard title="فاکتورها و رسیدها" subtitle="رسید هر پرداخت را مشاهده یا دریافت کنید">
   {invoices.length?<div style={{display:'grid',gap:'9px'}}>{invoices.map(item=><article key={item.id} style={{display:'flex',minWidth:0,flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'13px',background:'#F7F7F8',border:'1px solid #E7E7EA',borderRadius:'15px',fontFamily:font}}><div style={{minWidth:0,flex:'1 1 240px'}}><strong style={{display:'block',fontSize:'12px',fontWeight:900}}>{item.title}</strong><small style={{color:'#777982',fontSize:'10px'}}>{new Date(item.createdAt).toLocaleDateString('fa-IR')} · پرداخت‌شده</small></div><b style={{fontSize:'12px'}}>{IrancellFormatPersianNumber(item.amount)} تومان</b><div style={{display:'flex',gap:'7px'}}><IrancellButton size="sm" variant="secondary" onClick={()=>setSelectedInvoiceId(item.id)}>جزئیات</IrancellButton><IrancellButton size="sm" variant="ghost" onClick={()=>downloadInvoice(item)}>دریافت رسید</IrancellButton></div></article>)}</div>:<IrancellStatePanel state="empty" title="فاکتوری ثبت نشده است" description="پس از اولین پرداخت موفق، فاکتور آن در این بخش قرار می‌گیرد."/>}
  </IrancellCard>

  <IrancellModal open={topupOpen} title="افزایش موجودی کیف پول" variant="sheet" onClose={()=>{setTopupOpen(false);setTopupError('')}}>
   <div style={{display:'grid',gap:'14px',fontFamily:font}}><p style={{margin:0,color:'#686970',fontSize:'12px',lineHeight:1.9}}>یک مبلغ پیشنهادی را انتخاب کنید یا مبلغ دلخواه را به تومان وارد کنید.</p><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'9px'}}>{[200000,500000,1000000,2000000].map(amount=><IrancellButton type="button" variant="secondary" key={amount} onClick={()=>topup(amount)}>{IrancellFormatPersianNumber(amount)} تومان</IrancellButton>)}</div><IrancellInput label="مبلغ دلخواه" type="number" min="10000" step="10000" dir="ltr" value={customAmount} onChange={event=>{setCustomAmount(event.target.value);setTopupError('')}} placeholder="مثلاً 300000" error={topupError}/><IrancellButton block onClick={()=>topup(customAmount)} disabled={!customAmount}>افزایش موجودی</IrancellButton></div>
  </IrancellModal>
  <IrancellModal open={Boolean(selectedInvoice)} title="جزئیات فاکتور" onClose={()=>setSelectedInvoiceId('')} actions={selectedInvoice?<IrancellButton onClick={()=>downloadInvoice(selectedInvoice)}>دریافت رسید</IrancellButton>:null}>
   {selectedInvoice&&<dl style={{display:'grid',gap:'0',margin:0,fontFamily:font}}>{[['عنوان',selectedInvoice.title],['مبلغ',`${IrancellFormatPersianNumber(selectedInvoice.amount)} تومان`],['وضعیت','پرداخت‌شده'],['تاریخ',new Date(selectedInvoice.createdAt).toLocaleString('fa-IR')],['شناسه',selectedInvoice.id]].map(([label,value])=><div key={label} style={{display:'flex',minWidth:0,justifyContent:'space-between',gap:'12px',padding:'12px 0',borderBottom:'1px solid #EEE9D4'}}><dt style={{color:'#777982',fontSize:'11px'}}>{label}</dt><dd style={{margin:0,textAlign:'left',fontSize:'11px',fontWeight:900,overflowWrap:'anywhere'}}>{value}</dd></div>)}</dl>}
  </IrancellModal>
 </IrancellPageScaffold>
}