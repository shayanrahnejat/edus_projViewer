export function IrancellParentPaymentsPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const parentId=state.session.currentUserId||'parent-1';
 const family=state.family||{};
 const wallet=family.walletsByParentId?.[parentId]||{balance:0};
 const pending=Object.values(family.pendingPaymentsById||{}).filter(item=>item.parentId===parentId&&item.status==='pending');
 const invoices=Object.values(family.invoicesById||{}).filter(item=>item.parentId===parentId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 const[topupOpen,setTopupOpen]=useState(false);
 const[historyOpen,setHistoryOpen]=useState(false);

 function topup(amount){
  dispatch({type:'IRANCELL_PARENT_WALLET_TOPUP',amount});
  setTopupOpen(false)
 }

 return <section className="ir-family-payments">
  <header><h1>پرداخت‌ها</h1><p>مدیریت کیف پول، فاکتورها و تراکنش‌ها</p></header>

  <section className="ir-family-payments__wallet">
   <span className="ir-family-payments__wallet-icon">▣</span>
   <h2>کیف پول خانواده</h2>
   <strong>{IrancellFormatPersianNumber(wallet.balance)} تومان</strong>
   <p>آخرین تراکنش: {wallet.lastTransactionAt?new Date(wallet.lastTransactionAt).toLocaleDateString('fa-IR'):'—'}</p>
   <div><button type="button" onClick={()=>setTopupOpen(true)}>افزایش موجودی</button><button type="button" onClick={()=>setHistoryOpen(value=>!value)}>مشاهده تراکنش‌ها</button></div>
  </section>

  <section className="ir-family-payments__pending">
   <h2>پرداخت‌های در انتظار</h2>
   {pending.length?pending.map(item=><article key={item.id}>
    <div><strong>{item.title}</strong><span>در انتظار پرداخت</span></div>
    <b>{IrancellFormatPersianNumber(item.amount)} تومان</b>
    <button type="button" onClick={()=>onNavigate?.(`payment/${item.orderId}`)}>پرداخت کنید</button>
   </article>):<div className="ir-family-payments__empty">پرداختی در انتظار نیست.</div>}
  </section>

  <section className="ir-family-payments__invoices">
   <h2>فاکتورها</h2>
   <div>
    {invoices.map(item=><article key={item.id}><span>پرداخت‌شده</span><strong>{item.title}</strong><b>{IrancellFormatPersianNumber(item.amount)} تومان</b></article>)}
   </div>
  </section>

  {historyOpen&&<section className="ir-family-payments__history">
   <header><h2>تراکنش‌های اخیر</h2><button type="button" onClick={()=>setHistoryOpen(false)}>بستن</button></header>
   {[...invoices,...pending].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(item=><article key={item.id}><div><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</small></div><b className={item.status==='paid'?'is-paid':'is-pending'}>{IrancellFormatPersianNumber(item.amount)} تومان</b></article>)}
  </section>}

  {topupOpen&&<div className="ir-family-form-overlay" onMouseDown={()=>setTopupOpen(false)}>
   <section className="ir-family-form-sheet ir-family-topup-sheet" onMouseDown={event=>event.stopPropagation()}>
    <span className="ir-family-form-sheet__handle"/>
    <header><h2>افزایش موجودی</h2><button type="button" onClick={()=>setTopupOpen(false)}>×</button></header>
    <p>مبلغ موردنظر را برای کیف پول خانواده انتخاب کنید.</p>
    <div>{[200000,500000,1000000,2000000].map(amount=><button type="button" key={amount} onClick={()=>topup(amount)}>{IrancellFormatPersianNumber(amount)} تومان</button>)}</div>
   </section>
  </div>}
 </section>
}