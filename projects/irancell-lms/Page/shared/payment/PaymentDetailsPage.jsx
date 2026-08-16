export function IrancellSharedPaymentDetailsPage({params,onNavigate,screen}){
 const{state,dispatch}=useIrancellStore();
 const route=screen?.route||'payment/:id';
 const offer=params?.offerId?state.marketplace.offersById[params.offerId]:null;
 const request=offer?state.marketplace.requestsById[offer.requestId]:null;
 const directPayment=params?.id?state.payment.paymentsById[params.id]:null;
 const requestedSessionId=params?.reservationId||request?.sessionId||directPayment?.sessionId||'';
 const session=requestedSessionId?state.classroom.sessionsById[requestedSessionId]:null;
 const payment=directPayment||(session?.orderId?state.payment.paymentsById[session.orderId]:null);
 const consentDocument=session?.consentDocumentId?state.consent.documentsById[session.consentDocumentId]:null;
 const consentGate=session?state.consent.gatesBySessionId[session.id]:null;
 const consentStatus=consentGate?.status||consentDocument?.status||(session?.requiresConsent?'pending':'signed');
 const provider=session?state.marketplace.providersById[session.providerId]:null;
 const role=state.session.activeRole;
 const userId=state.session.currentUserId;
 const relationships=Object.values(state.identity.relationshipsById||{});
 const parentCanManage=role==='parent'&&relationships.some(item=>item.parentId===userId&&item.childId===session?.studentId&&item.status==='active');
 const canView=Boolean(session)&&(role==='admin'||session.studentId===userId||parentCanManage||session.participantIds?.includes(userId));
 const isCheckout=route==='student/classes/checkout/:offerId';
 const isSuccess=route==='student/classes/booking-success/:reservationId';
 const isReservation=route==='student/classes/reservation/:reservationId';
 if(isCheckout&&!offer)return <IrancellStateView state="error" title="پیشنهاد پیدا نشد" description="پیشنهاد انتخاب‌شده در دسترس نیست. از بازار پیشنهادها دوباره انتخاب کنید." action={<IrancellButton onClick={()=>onNavigate?.('student/offers')}>بازگشت به پیشنهادها</IrancellButton>}/>;
 if(!session||!payment)return <IrancellStateView state="error" title="رزرو پیدا نشد" description="تراکنش یا رزرو مرتبط وجود ندارد یا منقضی شده است." action={<IrancellButton onClick={()=>onNavigate?.(role==='parent'?'parent/payments':'student/classes')}>بازگشت</IrancellButton>}/>;
 if(!canView)return <IrancellStateView state="unauthorized" title="دسترسی به رزرو مجاز نیست" description="این رزرو به حساب یا فرزند فعال شما مرتبط نیست."/>;
 const studentCanPay=role==='student'&&session.studentId===userId&&!session.requiresConsent;
 const canPay=(['parent','admin'].includes(role)||studentCanPay)&&consentStatus==='signed'&&['pending','failed'].includes(payment.status);
 const cancellable=['scheduled','waiting','ready'].includes(session.status);
 const providerName=provider?.name||state.identity.usersById[session.providerId]?.name||'ارائه‌دهنده آموزشی';
 function pay(){if(!canPay)return;dispatch(IrancellPaymentHold(payment.orderId,'gateway-demo'))}
 function cancelReservation(){if(cancellable)dispatch(IrancellClassCancel(session.id,'user_cancelled'))}
 if(isSuccess&&!['held','released'].includes(payment.status))return <IrancellStateView state="warning" title="پرداخت هنوز کامل نشده است" description="پس از تأیید خانواده و ثبت پرداخت امن، این صفحه فعال می‌شود." action={<IrancellButton onClick={()=>onNavigate?.(`student/classes/checkout/${params.offerId||state.marketplace.selectedOfferId||''}`)}>بازگشت به پیش‌فاکتور</IrancellButton>}/>;
 return <IrancellPageScaffold className="ir-booking-flow" title={isSuccess?'رزرو با موفقیت ثبت شد':isReservation?'جزئیات رزرو':isCheckout?'تأیید پیشنهاد و پیش‌فاکتور':'پرداخت امن کلاس'} subtitle={isSuccess?'کد رزرو و وضعیت پرداخت برای پیگیری در حساب شما ذخیره شده است.':isReservation?'وضعیت کلاس، رضایت خانواده و تراکنش امن را یکجا بررسی کنید.':'وجه تا پایان موفق کلاس در امانت ایرانسل نگه‌داری می‌شود.'} onBack={()=>onNavigate?.(role==='parent'?'parent/payments':isCheckout?'student/offers':'student/classes')}>
  {isSuccess&&<IrancellStatusBanner tone="success" title="رزرو نهایی شد">پرداخت در وضعیت امن ثبت شده و کلاس در برنامه شما قرار گرفته است.</IrancellStatusBanner>}
  {session.status==='cancelled'&&<IrancellStatusBanner tone="danger" title="رزرو لغو شده">{payment.status==='refunded'?'بازگشت وجه برای این رزرو ثبت شده است.':'این رزرو لغو شده و پرداختی از این مسیر انجام نمی‌شود.'}</IrancellStatusBanner>}
  {consentStatus!=='signed'&&session.requiresConsent&&<IrancellStatusBanner tone="warning" title={role==='student'?'در انتظار تأیید خانواده':'تأیید خانواده لازم است'} action={['parent','admin'].includes(role)&&consentDocument?<IrancellButton variant="secondary" size="sm" onClick={()=>onNavigate?.(`consent/${consentDocument.id}`)}>مشاهده رضایت‌نامه</IrancellButton>:null}>{role==='student'?'درخواست رزرو برای خانواده ارسال شده است. پس از امضای رضایت‌نامه و پرداخت امن، رزرو نهایی می‌شود.':'پیش از پرداخت، والد مرتبط باید رضایت‌نامه این کلاس را تأیید کند.'}</IrancellStatusBanner>}
  {['held','released'].includes(payment.status)&&!isSuccess&&<IrancellStatusBanner tone="success" title="پرداخت امن ثبت شده">وجه این کلاس در وضعیت {payment.status==='held'?'امانی':'تسویه‌شده'} قرار دارد.</IrancellStatusBanner>}
  <div className="ir-booking-flow__grid">
   <IrancellCard title="خلاصه رزرو" action={<IrancellStatusBadge status={session.status}/>}>
    <dl className="ir-definition-list">
     <div><dt>کلاس</dt><dd>{session.title}</dd></div>
     <div><dt>ارائه‌دهنده</dt><dd>{providerName}</dd></div>
     <div><dt>زمان</dt><dd>{new Date(session.startAt).toLocaleString('fa-IR',{dateStyle:'medium',timeStyle:'short'})}</dd></div>
     <div><dt>کد رزرو</dt><dd dir="ltr">{session.id}</dd></div>
    </dl>
   </IrancellCard>
   <IrancellCard title={isCheckout?'پیش‌فاکتور':'وضعیت تراکنش'} action={<IrancellStatusBadge status={payment.status}/>}>
    <dl className="ir-definition-list">
     <div><dt>مبلغ</dt><dd>{IrancellFormatCurrency(payment.amount)}</dd></div>
     <div><dt>وضعیت رضایت</dt><dd><IrancellStatusBadge status={consentStatus}/></dd></div>
     <div><dt>شناسه سفارش</dt><dd dir="ltr">{payment.orderId}</dd></div>
     <div><dt>تضمین</dt><dd>نگه‌داری امانی تا تحویل موفق خدمت</dd></div>
    </dl>
   </IrancellCard>
  </div>
  <footer className="ir-booking-flow__actions">
   {canPay&&<IrancellButton onClick={pay}>پرداخت و نگه‌داری در امانت</IrancellButton>}
   {['parent','admin'].includes(role)&&consentStatus!=='signed'&&consentDocument&&<IrancellButton variant="secondary" onClick={()=>onNavigate?.(`consent/${consentDocument.id}`)}>تأیید رضایت‌نامه</IrancellButton>}
   {isSuccess&&<IrancellButton onClick={()=>onNavigate?.(`student/classes/reservation/${session.id}`)}>مشاهده جزئیات رزرو</IrancellButton>}
   {isReservation&&['live','ready'].includes(session.status)&&<IrancellButton onClick={()=>onNavigate?.(`class/${session.id}`)}>ورود به کلاس</IrancellButton>}
   {isReservation&&session.status==='completed'&&<IrancellButton onClick={()=>onNavigate?.(`rating/${session.id}`)}>ثبت امتیاز جلسه</IrancellButton>}
   {isReservation&&cancellable&&<IrancellButton variant="destructive" onClick={cancelReservation}>لغو رزرو</IrancellButton>}
   {isCheckout&&!canPay&&<IrancellButton variant="secondary" onClick={()=>onNavigate?.('student/classes')}>مشاهده کلاس‌های من</IrancellButton>}
   {!isCheckout&&!isSuccess&&!isReservation&&['held','released'].includes(payment.status)&&<IrancellButton onClick={()=>onNavigate?.(role==='parent'?'parent/payments':`student/classes/reservation/${session.id}`)}>ادامه</IrancellButton>}
  </footer>
 </IrancellPageScaffold>
}