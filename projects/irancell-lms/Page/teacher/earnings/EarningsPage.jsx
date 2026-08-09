export function IrancellTeacherEarningsPage(){
 const{state,dispatch}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const provider=state.marketplace.providersById?.[teacherId]||{};
 const available=Math.max(0,Number(provider.settlementAmount)||0);
 const[amount,setAmount]=useState(String(available||''));
 const[message,setMessage]=useState('');
 const payments=Object.values(state.payment.paymentsById||{}).filter(item=>item.providerId===teacherId);
 const released=payments.filter(item=>item.status==='released').reduce((sum,item)=>sum+(Number(item.amount)||0),0);
 const held=payments.filter(item=>['held','pending'].includes(item.status)).reduce((sum,item)=>sum+(Number(item.amount)||0),0);
 function requestPayout(){
  const value=Math.round(Number(amount)||0);
  if(value<10000||value>available){setMessage('مبلغ تسویه معتبر نیست.');return}
  dispatch({type:'IRANCELL_TEACHER_PAYOUT_REQUEST',amount:value});
  setAmount('');setMessage('درخواست تسویه ثبت شد و در صف بررسی مالی قرار گرفت.')
 }
 return <>
  <IrancellPageHeader eyebrow="مالی مدرس" title="درآمد و تسویه" description="موجودی قابل تسویه، مبالغ امانی و درخواست‌های برداشت."/>
  <div className="ir-stats-grid"><IrancellStatCard label="درآمد این ماه" value={IrancellFormatCurrency(provider.monthlyIncome||0)}/><IrancellStatCard label="قابل تسویه" value={IrancellFormatCurrency(available)}/><IrancellStatCard label="در حال آزادسازی" value={IrancellFormatCurrency(held)}/><IrancellStatCard label="آزادشده" value={IrancellFormatCurrency(released)}/></div>
  <IrancellCard title="درخواست تسویه"><div className="ir-inline-form"><IrancellInput label="مبلغ (تومان)" type="number" min="10000" max={available} value={amount} onChange={event=>{setAmount(event.target.value);setMessage('')}}/><IrancellButton onClick={requestPayout} disabled={!available||!amount}>ثبت درخواست</IrancellButton></div>{message&&<p role="status">{message}</p>}</IrancellCard>
  {(provider.payoutRequests||[]).length>0&&<IrancellCard title="درخواست‌های اخیر">{provider.payoutRequests.slice().reverse().map(item=><article className="ir-list-row" key={item.id}><div><strong>{IrancellFormatCurrency(item.amount)}</strong><small>{new Date(item.createdAt).toLocaleString('fa-IR')}</small></div><IrancellStatusBadge status={item.status}/></article>)}</IrancellCard>}
 </>
}