export function IrancellIdentityOtpPage({onNavigate,params={}}){
 const{state,dispatch}=useIrancellStore();
 const expectedOtp=String(IRANCELL_APP_CONFIG.otpCode||'');
 const otpLength=expectedOtp.length||5;
 const[otp,setOtp]=useState('');
 const[submitted,setSubmitted]=useState(false);
 const[seconds,setSeconds]=useState(45);
 const[isSubmitting,setIsSubmitting]=useState(false);
 const mobile=String(state.session.pendingMobile||IRANCELL_APP_CONFIG.demoAccounts.student||'').replace(/\D/g,'');
 const existingOtpUser=Object.values(state.identity.usersById).find(user=>user&&String(user.mobile||'').replace(/\D/g,'')===mobile)||null;
 const existingOtpRoles=Array.isArray(existingOtpUser?.roles)&&existingOtpUser.roles.length?existingOtpUser.roles:['student'];
 const localMobile=mobile.startsWith('0')?mobile.slice(1):mobile;
 const formattedMobile=IrancellFormatPersianNumber(`+98 ${localMobile.slice(0,3)} ${localMobile.slice(3,6)} ${localMobile.slice(6)}`);
 const isFamilyApproval=params.flow==='family-approval';
 const title=isFamilyApproval?'تأیید والد':existingOtpUser?'تأیید ورود':'تأیید ثبت‌نام';
 const description=isFamilyApproval?'کد تأیید برای والد مجاز ارسال شده است.':existingOtpUser?'کد ورود ارسال‌شده به شماره زیر را وارد کنید.':'این شماره هنوز حساب ندارد؛ با تأیید کد، حساب کیستی ساخته می‌شود.';
 const actionLabel=isFamilyApproval?'تأیید والد و ادامه':existingOtpUser?'تأیید و ورود':'تأیید و ثبت‌نام';
 const footerText=isFamilyApproval?'این کد فقط باید توسط والد مجاز وارد شود.':'کد تأیید را در اختیار دیگران قرار ندهید.';
 const formatError=submitted?IrancellValidateOtp(otp):'';
 const wrong=submitted&&!formatError&&otp!==expectedOtp?'کد واردشده صحیح نیست. دوباره تلاش کنید.':'';
 const isComplete=otp.length===otpLength;
 const sourceRoute=params.from&&params.from!=='auth/otp'?String(params.from):'auth/login';
 const sourceTarget=`${sourceRoute}${params.fromQuery?`?${String(params.fromQuery)}`:''}`;

 React.useEffect(function IrancellIdentityOtpCountdown(){
  if(seconds<=0)return undefined;
  const intervalId=setInterval(()=>setSeconds(current=>Math.max(0,current-1)),1000);
  return()=>clearInterval(intervalId)
 },[seconds]);

 function submit(event){
  event.preventDefault();
  setSubmitted(true);
  if(isSubmitting||IrancellValidateOtp(otp)||otp!==expectedOtp)return;
  setIsSubmitting(true);
  dispatch(IrancellAuthVerifyOtp(otp));
  if(params.flow==='activation'&&params.role){
   dispatch(IrancellAuthSelectRole(params.role));
   onNavigate('relationship-linking');
   return
  }
  if(isFamilyApproval){
   onNavigate(params.next||'student/home');
   return
  }
  if(!existingOtpUser){
   onNavigate('role-select');
   return
  }
  if(existingOtpRoles.length===1){
   const existingRole=existingOtpRoles[0];
   dispatch(IrancellAuthSelectRole(existingRole));
   onNavigate(IRANCELL_ROLE_HOME_ROUTES[existingRole]||'student/home');
   return
  }
  onNavigate('role-select')
 }

 function resend(){
  if(seconds>0)return;
  dispatch(IrancellAuthRequestOtp(mobile,state.session.otpPurpose||'login'));
  setOtp('');
  setSubmitted(false);
  setIsSubmitting(false);
  setSeconds(45);
  dispatch({type:'IRANCELL_UI_TOAST',message:'کد تأیید جدید ارسال شد.',tone:'success'})
 }

 return <IrancellIdentityFrame className="ir-mobile-otp">
  <main className="ir-mobile-otp__page">
   <button type="button" className="ir-mobile-otp__scrim" aria-label="بستن پنجره کد تأیید" onClick={()=>onNavigate(sourceTarget)}/>
   <section className="ir-mobile-otp__modal" role="dialog" aria-modal="true" aria-labelledby="ir-mobile-otp-title">
    <div className="ir-mobile-otp__badge"><IrancellIdentitySecurityBadge size="lg"/></div>
    <section className="ir-mobile-otp__copy">
     <h1 id="ir-mobile-otp-title">{title}</h1>
     <p>{description}</p>
     <strong dir="ltr">{formattedMobile}</strong>
    </section>
    <div className="ir-mobile-otp__divider"/>
    <form onSubmit={submit} noValidate>
     <IrancellIdentityOtpFields value={otp} onChange={value=>{setOtp(value);setSubmitted(false)}} length={otpLength} error={formatError||wrong} autoFocus/>
     <div className="ir-mobile-otp__resend">
      <button type="button" disabled={seconds>0} onClick={resend}>{seconds>0?'ارسال مجدد کد':'دریافت کد جدید'}</button>
      {seconds>0&&<time dir="ltr">{IrancellFormatPersianNumber(`۰۰:${String(seconds).padStart(2,'0')}`)}</time>}
     </div>
     <button type="submit" className="ir-mobile-otp__submit" disabled={!isComplete||isSubmitting}>{isSubmitting?'در حال بررسی...':actionLabel}</button>
    </form>
    <footer className="ir-mobile-otp__footer"><LockKeyhole size={15}/><span>{footerText}</span></footer>
   </section>
  </main>
 </IrancellIdentityFrame>
}