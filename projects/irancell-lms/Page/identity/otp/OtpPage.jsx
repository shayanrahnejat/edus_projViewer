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
 const title=isFamilyApproval?'تأیید والد':'تأیید شماره موبایل';
 const description=isFamilyApproval?'کد تأیید برای والد مجاز ارسال شده است.':`کد ${IrancellFormatPersianNumber(otpLength)} رقمی ارسال شده به ${formattedMobile} را وارد کنید.`;
 const actionLabel=isFamilyApproval?'تأیید والد و ادامه':existingOtpUser?'تأیید و ورود':'تأیید و ثبت‌نام';
 const footerText=isFamilyApproval?'این کد فقط باید توسط والد مجاز وارد شود.':'کد تأیید را در اختیار دیگران قرار ندهید.';
 const formatError=submitted?IrancellValidateOtp(otp):'';
 const wrong=submitted&&!formatError&&otp!==expectedOtp?'کد واردشده صحیح نیست. دوباره تلاش کنید.':'';
 const isComplete=otp.length===otpLength;
 const sourceRoute=params.from&&params.from!=='auth/otp'?String(params.from):'auth/login';
 const sourceTarget=`${sourceRoute}${params.fromQuery?`?${String(params.fromQuery)}`:''}`;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const iconStyle={display:'block',width:'18px',height:'18px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'};
 const otpDigits=Array.from({length:otpLength},(_,index)=>otp[index]||'');

 React.useEffect(function IrancellIdentityOtpCountdown(){
  if(seconds<=0)return undefined;
  const intervalId=setInterval(()=>setSeconds(current=>Math.max(0,current-1)),1000);
  return()=>clearInterval(intervalId)
 },[seconds]);

 function normalizeOtp(value){
  const persianDigits='۰۱۲۳۴۵۶۷۸۹',arabicDigits='٠١٢٣٤٥٦٧٨٩';
  return String(value||'').replace(/[۰-۹]/g,digit=>String(persianDigits.indexOf(digit))).replace(/[٠-٩]/g,digit=>String(arabicDigits.indexOf(digit))).replace(/\D/g,'').slice(0,otpLength)
 }

 function submit(event){
  event.preventDefault();
  setSubmitted(true);
  if(isSubmitting||IrancellValidateOtp(otp)||otp!==expectedOtp)return;
  setIsSubmitting(true);
  dispatch(IrancellAuthVerifyOtp(otp));
  if(params.flow==='activation'&&params.role){dispatch(IrancellAuthSelectRole(params.role));onNavigate('relationship-linking');return}
  if(isFamilyApproval){onNavigate(params.next||'student/home');return}
  if(!existingOtpUser){onNavigate('role-select');return}
  if(existingOtpRoles.length===1){const existingRole=existingOtpRoles[0];dispatch(IrancellAuthSelectRole(existingRole));onNavigate(IRANCELL_ROLE_HOME_ROUTES[existingRole]||'student/home');return}
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

 const submitDisabled=!isComplete||isSubmitting;
 return <IrancellIdentityFrame inlineOnly style={{position:'fixed',inset:0,zIndex:2147483600,display:'grid',minHeight:'100dvh',placeItems:'center',padding:'max(18px, env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom))',overflowY:'auto',color:'#F5F5F7',background:'radial-gradient(circle at 50% 35%,#1C1D22 0%,#111216 56%,#0E0F12 100%)',fontFamily:font}}>
  <div aria-hidden="true" style={{position:'fixed',inset:0,pointerEvents:'none',opacity:.18,backgroundImage:'linear-gradient(60deg,transparent 49.5%,#3A3B42 50%,transparent 50.5%),linear-gradient(-60deg,transparent 49.5%,#3A3B42 50%,transparent 50.5%)',backgroundSize:'230px 400px'}}/>
  <strong style={{position:'fixed',top:'30px',left:'36px',zIndex:1,color:'#F4F4F5',fontFamily:'Arial, sans-serif',fontSize:'10px',fontWeight:800,letterSpacing:'.6px'}}>●&nbsp; KEESTEE</strong>
  <section role="dialog" aria-modal="true" aria-labelledby="ir-kisti-otp-title" style={{boxSizing:'border-box',position:'relative',zIndex:1,display:'flex',width:'100%',maxWidth:'430px',minWidth:0,flexDirection:'column',margin:'auto',padding:'28px 24px 30px',color:'#F5F5F7',background:'#191A1D',border:'1px solid #36373C',borderRadius:'26px',boxShadow:'0 30px 90px rgba(0,0,0,.44)',fontFamily:font,direction:'rtl'}}>
   <button type="button" aria-label="بازگشت به صفحه ورود" onClick={()=>onNavigate(sourceTarget)} style={{display:'grid',width:'34px',height:'34px',placeItems:'center',alignSelf:'flex-start',margin:0,padding:0,cursor:'pointer',color:'#9A9AA1',background:'#242529',border:'1px solid #303137',borderRadius:'50%'}}><svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>

   <section style={{margin:'26px 0 24px',textAlign:'center'}}>
    <h1 id="ir-kisti-otp-title" style={{margin:'0 0 9px',color:'#FFFFFF',fontFamily:font,fontSize:'25px',fontWeight:900,lineHeight:1.55}}>{title}</h1>
    <p style={{margin:0,color:'#929299',fontFamily:font,fontSize:'12px',fontWeight:500,lineHeight:1.9}}>{description}</p>
   </section>

   <form onSubmit={submit} noValidate style={{display:'grid',gap:'20px',width:'100%',margin:0,fontFamily:font}}>
    <label htmlFor="ir-kisti-otp-input" style={{position:'relative',display:'block',width:'100%',cursor:'text'}}>
     <input id="ir-kisti-otp-input" type="text" dir="ltr" inputMode="numeric" autoComplete="one-time-code" autoFocus value={otp} onChange={event=>{setOtp(normalizeOtp(event.target.value));setSubmitted(false)}} aria-label="کد تأیید" aria-invalid={Boolean(formatError||wrong)} aria-describedby={formatError||wrong?'ir-kisti-otp-error':undefined} style={{position:'absolute',inset:0,zIndex:2,display:'block',width:'100%',height:'100%',margin:0,padding:0,cursor:'text',opacity:.01,color:'transparent',background:'transparent',border:0,fontSize:'16px'}}/>
     <span dir="ltr" aria-hidden="true" style={{display:'grid',gridTemplateColumns:`repeat(${otpLength},minmax(0,1fr))`,gap:'8px',width:'100%'}}>{otpDigits.map((digit,index)=><span key={index} style={{boxSizing:'border-box',display:'grid',height:'52px',placeItems:'center',color:'#FFFFFF',background:'#242529',border:`1.5px solid ${formatError||wrong?'#E05252':digit?'#168BFF':'#3B3C42'}`,borderRadius:'10px',boxShadow:digit?'0 0 0 2px rgba(22,139,255,.08)':'none',fontFamily:font,fontSize:'21px',fontWeight:900}}>{IrancellFormatPersianNumber(digit)}</span>)}</span>
    </label>
    {(formatError||wrong)&&<small id="ir-kisti-otp-error" role="alert" style={{margin:'-12px 0 0',color:'#FF7777',fontFamily:font,fontSize:'11px',fontWeight:700,textAlign:'center'}}>{formatError||wrong}</small>}

    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',minHeight:'26px',fontFamily:font,fontSize:'11px'}}>
     {seconds>0&&<time dir="ltr" style={{color:'#168BFF',fontFamily:font,fontWeight:900}}>{IrancellFormatPersianNumber(`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`)}</time>}
     <button type="button" disabled={seconds>0} onClick={resend} style={{margin:0,padding:'3px',cursor:seconds>0?'default':'pointer',color:seconds>0?'#168BFF':'#55A9FF',background:'transparent',border:0,fontFamily:font,fontSize:'11px',fontWeight:800,opacity:seconds>0?.84:1}}>{seconds>0?'تا ارسال مجدد کد':'ارسال مجدد کد'}</button>
    </div>

    <button type="submit" disabled={submitDisabled} style={{boxSizing:'border-box',display:'inline-flex',width:'100%',minHeight:'52px',alignItems:'center',justifyContent:'center',margin:0,padding:'11px 18px',cursor:submitDisabled?'not-allowed':'pointer',color:submitDisabled?'#8C8C92':'#FFFFFF',background:submitDisabled?'#2B2C30':'#168BFF',border:`1px solid ${submitDisabled?'#38393E':'#2494FF'}`,borderRadius:'10px',boxShadow:submitDisabled?'none':'0 9px 24px rgba(22,139,255,.2)',fontFamily:font,fontSize:'14px',fontWeight:900}}>{isSubmitting?'در حال بررسی...':actionLabel}</button>
   </form>

   <footer style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',margin:'18px 0 0',color:'#77777E',fontFamily:font,fontSize:'10px',fontWeight:600,lineHeight:1.7,textAlign:'center'}}><LockKeyhole size={14}/><span>{footerText}</span></footer>
  </section>
  <small style={{position:'relative',zIndex:1,alignSelf:'end',marginTop:'18px',color:'#68686F',fontFamily:font,fontSize:'9px'}}>تمامی حقوق این سامانه برای ایرانسل محفوظ است.</small>
 </IrancellIdentityFrame>
}