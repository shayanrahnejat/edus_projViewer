const IRANCELL_PAGE_IDENTITY_TERMS=Object.freeze([
 {title:'حریم اطلاعات',body:'کلیه اطلاعات کاربران در این سامانه مطابق قوانین حفاظت از داده‌ها نگهداری می‌شود و فقط برای ارائه خدمات آموزشی و احراز هویت استفاده خواهد شد.'},
 {title:'حریم خصوصی',body:'سامانه احراز هویت متعهد به حفظ حریم خصوصی و امنیت داده‌های هویتی شما مطابق استانداردهای امنیتی کشور است.'},
 {title:'مسئولیت کاربری',body:'مسئولیت نگهداری اطلاعات ورود و هرگونه استفاده از حساب کاربری بر عهده صاحب حساب است.'},
 {title:'انطباق با قوانین',body:'استفاده از این سامانه منوط به پذیرش قوانین جمهوری اسلامی ایران و مقررات خدمات آموزشی است.'}
]);

export function IrancellLoginToEnglishDigits(value){
 const persianDigits='۰۱۲۳۴۵۶۷۸۹',arabicDigits='٠١٢٣٤٥٦٧٨٩';
 return String(value||'')
  .replace(/[۰-۹]/g,digit=>String(persianDigits.indexOf(digit)))
  .replace(/[٠-٩]/g,digit=>String(arabicDigits.indexOf(digit)));
}

export function IrancellLoginToPersianDigits(value){
 const persianDigits='۰۱۲۳۴۵۶۷۸۹';
 return String(value||'').replace(/\d/g,digit=>persianDigits[Number(digit)]);
}

export function IrancellNormalizeLoginMobile(value){
 const digits=IrancellLoginToEnglishDigits(value).replace(/\D/g,'').slice(0,12);
 if(!digits)return'';
 if(digits.startsWith('09'))return digits.slice(0,11);
 if(digits.startsWith('9'))return `0${digits.slice(0,10)}`;
 if(digits.startsWith('98')){
  const withoutCountry=digits.slice(2);
  return withoutCountry.startsWith('9')?`0${withoutCountry.slice(0,10)}`:digits.slice(0,11);
 }
 return digits.slice(0,11);
}

function IrancellIdentityLoginPageInlineLegacy({onNavigate,params={}}){
 const{state,dispatch}=useIrancellStore();
 const currentUser=state.identity.usersById[state.session.currentUserId]||null;
 const[authMode,setAuthMode]=useState(params.mode==='create'?'create':'login');
 const[username,setUsername]=useState(currentUser?.mobile||IRANCELL_APP_CONFIG.demoAccounts.student);
 const[password,setPassword]=useState(IRANCELL_APP_CONFIG.demoPassword);
 const[termsOpen,setTermsOpen]=useState(params.mode==='terms');
 const[submitted,setSubmitted]=useState(false);
 const[credentialError,setCredentialError]=useState('');
 const[compact,setCompact]=useState(()=>typeof window!=='undefined'?window.innerWidth<1024:false);
 useEffect(function IrancellLoginTrackViewport(){
  if(typeof window==='undefined')return function IrancellLoginViewportNoopCleanup(){};
  function updateCompact(){setCompact(window.innerWidth<1024)}
  updateCompact();
  window.addEventListener('resize',updateCompact,{passive:true});
  return function IrancellLoginViewportCleanup(){window.removeEventListener('resize',updateCompact)}
 },[]);
 const usernameError=submitted&&authMode==='login'?IrancellValidateMobile(IrancellNormalizeLoginMobile(username)):'';
 const passwordError=submitted&&authMode==='login'&&password.length<6?'رمز عبور باید حداقل ۶ نویسه داشته باشد.':'';
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const fieldStyle={boxSizing:'border-box',display:'grid',gap:'7px',width:'100%',minWidth:0,margin:0,color:'#39393E',fontFamily:font,fontSize:'13px',fontWeight:800};
 const inputStyle=invalid=>({boxSizing:'border-box',display:'block',width:'100%',minWidth:0,height:'52px',margin:0,padding:'11px 14px',color:'#202024',background:'#FFFFFF',border:`1.5px solid ${invalid?'#C62828':'#D9D9DE'}`,borderRadius:'15px',outlineOffset:'3px',fontFamily:font,fontSize:'15px',fontWeight:600});
 const primaryButtonStyle={boxSizing:'border-box',display:'inline-flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:'52px',margin:0,padding:'12px 20px',cursor:'pointer',color:'#171719',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'16px',boxShadow:'0 10px 24px rgba(255,209,0,.22)',fontFamily:font,fontSize:'15px',fontWeight:900,lineHeight:1.6};
 const secondaryButtonStyle={boxSizing:'border-box',display:'inline-flex',alignItems:'center',justifyContent:'center',width:'100%',minHeight:'48px',margin:0,padding:'10px 16px',cursor:'pointer',color:'#35353A',background:'#FFFFFF',border:'1px solid #DCDCE1',borderRadius:'15px',fontFamily:font,fontSize:'13px',fontWeight:800,lineHeight:1.7};
 function resolveUser(value){
  const raw=String(value||'').trim();
  const digits=IrancellLoginToEnglishDigits(raw).replace(/\D/g,'');
  const normalized=digits.length===10&&digits.startsWith('9')?`0${digits}`:digits.length===12&&digits.startsWith('98')?`0${digits.slice(2)}`:digits;
  return Object.values(state.identity.usersById).find(user=>user&&(user.mobile===raw||user.mobile===normalized))||null
 }
 function submit(event){
  event.preventDefault();
  setSubmitted(true);
  setCredentialError('');
  const normalizedUsername=IrancellNormalizeLoginMobile(username);
  setUsername(normalizedUsername);
  if(IrancellValidateMobile(normalizedUsername)||password.length<6)return;
  const user=resolveUser(normalizedUsername);
  if(user&&password!==String(user.credentialPassword||IRANCELL_APP_CONFIG.demoPassword)){setCredentialError('شماره موبایل یا رمز عبور صحیح نیست.');return}
  dispatch(IrancellAuthLoginWithCredentials(normalizedUsername,password));
  if(!user){onNavigate('role-select');return}
  const roles=Array.isArray(user.roles)&&user.roles.length?user.roles:['student'];
  onNavigate(roles.length>1?'role-select':IRANCELL_ROLE_HOME_ROUTES[roles[0]]||'student/home')
 }
 function loginWithOtp(){
  const normalizedMobile=IrancellNormalizeLoginMobile(username);
  setUsername(normalizedMobile);
  setSubmitted(true);
  setCredentialError('');
  if(IrancellValidateMobile(normalizedMobile))return;
  dispatch(IrancellAuthRequestOtp(normalizedMobile,'login'));
  onNavigate('auth/otp?flow=student-login')
 }
 function registerWithKisti(){
  setSubmitted(false);
  setCredentialError('');
  dispatch(IrancellAuthRegisterWithKisti(IRANCELL_APP_CONFIG.demoKistiSignupMobile));
  onNavigate('role-select')
 }
 function changeMode(nextMode){
  setSubmitted(false);
  setCredentialError('');
  setAuthMode(nextMode);
  setUsername(nextMode==='login'?IRANCELL_APP_CONFIG.demoAccounts.student:'');
  setPassword(nextMode==='login'?IRANCELL_APP_CONFIG.demoPassword:'');
  setTermsOpen(false)
 }
 function openDemoProfile(profileKey){
  const profile=IRANCELL_APP_CONFIG.demoMode?.profiles?.[profileKey];
  if(!profile)return;
  dispatch({type:'IRANCELL_DEMO_ACTIVATE_PROFILE',profileKey});
  onNavigate(profile.route)
 }
 const demoProfiles=IRANCELL_APP_CONFIG.demoMode?.enabled&&state.settings?.demo?.enabled!==false&&state.settings?.demo?.showQuickProfiles!==false?Object.entries(IRANCELL_APP_CONFIG.demoMode.profiles||{}).filter(([,profile])=>profile.quick&&state.identity.usersById?.[profile.userId]):[];
 return <IrancellIdentityFrame inlineOnly style={{display:'grid',placeItems:'center',minHeight:'100%',padding:compact?'max(18px, env(safe-area-inset-top)) 14px calc(24px + env(safe-area-inset-bottom))':'32px',overflow:'visible',background:'radial-gradient(circle at 50% 0%,#FFFFFF 0%,#FFFAE0 56%,#FFF2AD 100%)'}}>
  <section style={{boxSizing:'border-box',display:'grid',gridTemplateColumns:compact?'minmax(0,1fr)':'minmax(300px,.82fr) minmax(420px,1.18fr)',gridTemplateAreas:compact?'"brand" "tabs" "copy" "form" "otp" "demo"':'"brand tabs" "brand copy" "brand form" "demo otp"',alignItems:'start',columnGap:compact?0:'34px',rowGap:compact?'18px':'16px',width:'100%',maxWidth:compact?'560px':'1060px',minWidth:0,margin:'auto',padding:compact?'22px 18px':'16px',overflow:'hidden',color:'#202024',background:'#FFFFFF',border:'1px solid rgba(32,32,36,.09)',borderRadius:compact?'28px':'38px',boxShadow:'0 30px 82px rgba(69,55,0,.16)',fontFamily:font,direction:'rtl'}}>
   <header style={{boxSizing:'border-box',gridArea:'brand',display:'flex',minHeight:compact?'auto':'100%',flexDirection:'column',alignItems:compact?'center':'flex-start',justifyContent:'center',gap:'14px',padding:compact?'2px 4px 8px':'40px 34px',textAlign:compact?'center':'right',color:'#171719',background:compact?'transparent':'linear-gradient(150deg,#FFD100 0%,#FFE77B 100%)',border:compact?0:'1px solid #E7BD00',borderRadius:compact?0:'28px'}}><IrancellBrandMark inlineOnly style={{width:compact?'132px':'158px'}}/><h1 style={{margin:0,color:'#202024',fontFamily:font,fontSize:compact?'18px':'26px',fontWeight:900}}>ایرانسل آکادمی</h1><p style={{maxWidth:'300px',margin:0,color:'#514500',fontFamily:font,fontSize:'13px',fontWeight:700,lineHeight:1.9}}>یک حساب امن برای یادگیری، کلاس‌ها و همراهی هوشمند در تمام مسیر آموزشی.</p></header>
   <div role="tablist" aria-label="نوع ورود" style={{gridArea:'tabs',display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'5px',margin:compact?'0':'12px 0 0',padding:'5px',background:'#F3F3F5',border:'1px solid #E6E6E9',borderRadius:'16px'}}>
    {['create','login'].map(mode=>{const active=authMode===mode;return <button key={mode} type="button" role="tab" aria-selected={active} onClick={()=>changeMode(mode)} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:'42px',padding:'8px 12px',cursor:'pointer',color:active?'#171719':'#717178',background:active?'#FFD100':'transparent',border:`1px solid ${active?'#E7BD00':'transparent'}`,borderRadius:'12px',boxShadow:active?'0 7px 16px rgba(255,209,0,.18)':'none',fontFamily:font,fontSize:'14px',fontWeight:900}}>{mode==='create'?'ثبت‌نام':'ورود'}</button>})}
   </div>
   <section style={{gridArea:'copy',margin:0,textAlign:'right'}}><h2 style={{margin:'0 0 8px',fontFamily:font,fontSize:'25px',fontWeight:900}}>{authMode==='create'?'ثبت‌نام با کیستی':'خوش آمدید'}</h2><p style={{margin:0,color:'#707077',fontFamily:font,fontSize:'13px',fontWeight:500,lineHeight:1.9}}>{authMode==='create'?'هویت شما در کیستی تأیید می‌شود و اطلاعات لازم به‌صورت امن دریافت خواهد شد.':'برای ورود، شماره موبایل و رمز عبور خود را وارد کنید.'}</p></section>
   {authMode==='login'?<form onSubmit={submit} noValidate style={{gridArea:'form',display:'grid',gap:'14px',width:'100%',margin:0,fontFamily:font}}>
    <label htmlFor="ir-login-mobile" style={fieldStyle}><span>شماره موبایل</span><input id="ir-login-mobile" type="tel" dir="ltr" inputMode="numeric" autoComplete="tel" value={username} aria-invalid={Boolean(usernameError||credentialError)} aria-describedby={usernameError||credentialError?'ir-login-mobile-error':undefined} onChange={event=>{setUsername(IrancellNormalizeLoginMobile(event.target.value));setCredentialError('')}} placeholder="۰۹۱۲۳۴۵۶۷۸۹" style={inputStyle(Boolean(usernameError||credentialError))}/>{(usernameError||credentialError)&&<small id="ir-login-mobile-error" role="alert" style={{color:'#B42318',fontFamily:font,fontSize:'12px',fontWeight:700}}>{usernameError||credentialError}</small>}</label>
    <label htmlFor="ir-login-password" style={fieldStyle}><span>رمز عبور</span><input id="ir-login-password" type="password" dir="ltr" autoComplete="current-password" value={password} aria-invalid={Boolean(passwordError)} aria-describedby={passwordError?'ir-login-password-error':undefined} onChange={event=>setPassword(event.target.value)} placeholder="رمز عبور" style={inputStyle(Boolean(passwordError))}/>{passwordError&&<small id="ir-login-password-error" role="alert" style={{color:'#B42318',fontFamily:font,fontSize:'12px',fontWeight:700}}>{passwordError}</small>}</label>
    <button type="button" onClick={loginWithOtp} style={{justifySelf:'start',margin:'-2px 0 0',padding:'4px 0',cursor:'pointer',color:'#725F00',background:'transparent',border:0,fontFamily:font,fontSize:'12px',fontWeight:800}}>رمز عبورتان را فراموش کرده‌اید؟</button>
    <button type="submit" style={primaryButtonStyle}>ورود</button>
   </form>:<section style={{gridArea:'form',display:'grid',gap:'12px',width:'100%'}}>
    <div style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'13px 14px',color:'#55555C',background:'#FFF9D9',border:'1px solid #F0D763',borderRadius:'15px',fontFamily:font,fontSize:'12px',fontWeight:600,lineHeight:1.8}}><ShieldCheck size={19}/><span>ثبت‌نام از مسیر امن کیستی انجام می‌شود و پس از تأیید هویت، نقش‌های حساب در همین سامانه فعال خواهند شد.</span></div>
    <button type="button" onClick={registerWithKisti} style={primaryButtonStyle}>ثبت‌نام با کیستی</button>
    <button type="button" onClick={()=>setTermsOpen(true)} style={{...secondaryButtonStyle,minHeight:'42px',color:'#68686f',background:'transparent',borderColor:'transparent'}}>مشاهده شرایط و قوانین</button>
   </section>}
   {authMode==='login'&&<section style={{gridArea:'otp',alignSelf:'end',display:'grid',gap:'14px'}}><div aria-hidden="true" style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:'10px',margin:0,color:'#909097',fontFamily:font,fontSize:'12px'}}><span style={{height:'1px',background:'#E4E4E7'}}/><span>یا</span><span style={{height:'1px',background:'#E4E4E7'}}/></div><button type="button" onClick={loginWithOtp} style={secondaryButtonStyle}><LockKeyhole size={17}/><span style={{marginInlineStart:'8px'}}>ورود یا ثبت‌نام با رمز یکبار مصرف</span></button></section>}
   {authMode==='login'&&demoProfiles.length>0&&<section style={{gridArea:'demo',display:'grid',alignSelf:'end',gap:'12px',margin:0,padding:'16px',background:'#F7F7F8',border:'1px solid #E6E6E9',borderRadius:'18px'}}>
    <header style={{display:'grid',gap:'4px'}}><strong style={{fontFamily:font,fontSize:'13px',fontWeight:900}}>{IrancellFormatPersianNumber(demoProfiles.length)} حساب آماده برای نمایش دمو</strong><small style={{color:'#77777E',fontFamily:font,fontSize:'11px',lineHeight:1.8}}>با انتخاب هر حساب مستقیماً وارد تجربه همان نقش می‌شوید.</small></header>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:'8px'}}>{demoProfiles.map(([profileKey,profile])=>{const demoUser=state.identity.usersById[profile.userId];return <button type="button" key={profileKey} onClick={()=>openDemoProfile(profileKey)} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'3px',minWidth:0,minHeight:'82px',padding:'11px 12px',cursor:'pointer',textAlign:'start',color:'#202024',background:'#FFFFFF',border:'1px solid #DDDEE2',borderRadius:'13px',fontFamily:font}}><strong style={{fontSize:'12px'}}>{profile.label}</strong><span style={{maxWidth:'100%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'11px',fontWeight:700}}>{demoUser?.name||profile.label}</span><small style={{color:'#77777E',fontSize:'10px',lineHeight:1.5}}>{profile.description}</small></button>})}</div>
   </section>}
   {termsOpen&&<div role="dialog" aria-modal="true" aria-labelledby="ir-login-terms-title" style={{position:'fixed',inset:0,zIndex:2147483600,display:'grid',placeItems:'center',padding:'max(18px, env(safe-area-inset-top)) 16px calc(18px + env(safe-area-inset-bottom))',overflowY:'auto',fontFamily:font}}>
    <button type="button" aria-label="بستن شرایط و قوانین" onClick={()=>setTermsOpen(false)} style={{position:'fixed',inset:0,zIndex:0,width:'100%',height:'100%',padding:0,cursor:'pointer',background:'rgba(17,17,19,.64)',border:0,backdropFilter:'blur(5px)',WebkitBackdropFilter:'blur(5px)'}}/>
    <section style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',width:'100%',maxWidth:'520px',maxHeight:'calc(100dvh - 36px)',padding:'22px',overflow:'hidden',background:'#FFFFFF',borderRadius:'26px',boxShadow:'0 30px 90px rgba(0,0,0,.32)',fontFamily:font}}>
     <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'16px'}}><h2 id="ir-login-terms-title" style={{margin:0,fontFamily:font,fontSize:'20px',fontWeight:900}}>شرایط و قوانین</h2><button type="button" aria-label="بستن" onClick={()=>setTermsOpen(false)} style={{display:'grid',placeItems:'center',width:'40px',height:'40px',padding:0,cursor:'pointer',background:'#F2F2F4',border:'1px solid #E2E2E6',borderRadius:'12px',fontFamily:font,fontSize:'22px'}}>×</button></header>
     <div style={{display:'grid',gap:'12px',minHeight:0,overflowY:'auto',overscrollBehaviorY:'contain'}}>{IRANCELL_PAGE_IDENTITY_TERMS.map(item=><article key={item.title} style={{padding:'14px',background:'#F8F8F9',border:'1px solid #E7E7EA',borderRadius:'14px'}}><h3 style={{margin:'0 0 6px',fontFamily:font,fontSize:'14px'}}>{item.title}</h3><p style={{margin:0,color:'#64646B',fontFamily:font,fontSize:'12px',lineHeight:1.9}}>{item.body}</p></article>)}</div>
     <button type="button" onClick={()=>setTermsOpen(false)} style={{...primaryButtonStyle,marginTop:'16px'}}>متوجه شدم</button>
    </section>
   </div>}
  </section>
 </IrancellIdentityFrame>
}

export function IrancellIdentityLoginPageInline({onNavigate,params={}}){
 const{state,dispatch}=useIrancellStore();
 const currentUser=state.identity.usersById[state.session.currentUserId]||null;
 const[authMode,setAuthMode]=useState(params.mode==='create'?'create':'login');
 const[username,setUsername]=useState(currentUser?.mobile||IRANCELL_APP_CONFIG.demoAccounts.student);
 const[registerMobile,setRegisterMobile]=useState('');
 const[password,setPassword]=useState(IRANCELL_APP_CONFIG.demoPassword);
 const[passwordConfirmation,setPasswordConfirmation]=useState('');
 const[firstName,setFirstName]=useState('');
 const[lastName,setLastName]=useState('');
 const[nationalCode,setNationalCode]=useState('');
 const[acceptedTerms,setAcceptedTerms]=useState(false);
 const[passwordVisible,setPasswordVisible]=useState(false);
 const[termsOpen,setTermsOpen]=useState(params.mode==='terms');
 const[submitted,setSubmitted]=useState(false);
 const[credentialError,setCredentialError]=useState('');
 const[compact,setCompact]=useState(()=>typeof window!=='undefined'?window.innerWidth<640:false);

 useEffect(function IrancellKistiLoginTrackViewport(){
  if(typeof window==='undefined')return function IrancellKistiLoginViewportNoopCleanup(){};
  function updateCompact(){setCompact(window.innerWidth<640)}
  updateCompact();
  window.addEventListener('resize',updateCompact,{passive:true});
  return function IrancellKistiLoginViewportCleanup(){window.removeEventListener('resize',updateCompact)}
 },[]);

 const usernameError=submitted&&authMode==='login'?IrancellValidateMobile(IrancellNormalizeLoginMobile(username)):'';
 const registerMobileError=submitted&&authMode==='create'?IrancellValidateMobile(IrancellNormalizeLoginMobile(registerMobile)):'';
 const passwordError=submitted&&password.length<6?'رمز عبور باید حداقل ۶ نویسه داشته باشد.':'';
 const firstNameError=submitted&&authMode==='create'?IrancellValidateRequired(firstName,'نام'):'';
 const lastNameError=submitted&&authMode==='create'?IrancellValidateRequired(lastName,'نام خانوادگی'):'';
 const nationalCodeError=submitted&&authMode==='create'&&!/^\d{10}$/.test(nationalCode)?'کد ملی باید ۱۰ رقم باشد.':'';
 const confirmationError=submitted&&authMode==='create'&&passwordConfirmation!==password?'تکرار رمز عبور با رمز عبور یکسان نیست.':'';
 const termsError=submitted&&authMode==='create'&&!acceptedTerms?'پذیرش شرایط و قوانین الزامی است.':'';
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const iconStyle={display:'block',width:'20px',height:'20px',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'};
 const actionStyle={boxSizing:'border-box',display:'inline-flex',width:'100%',minHeight:'52px',alignItems:'center',justifyContent:'center',margin:0,padding:'11px 18px',cursor:'pointer',color:'#FFFFFF',background:'#168BFF',border:'1px solid #2494FF',borderRadius:'10px',boxShadow:'0 9px 24px rgba(22,139,255,.2)',fontFamily:font,fontSize:'14px',fontWeight:900};
 const quietActionStyle={boxSizing:'border-box',display:'inline-flex',width:'100%',minHeight:'46px',alignItems:'center',justifyContent:'center',margin:0,padding:'9px 12px',cursor:'pointer',color:'#E9E9EC',background:'#2A2A2E',border:'1px solid #3A3A40',borderRadius:'10px',fontFamily:font,fontSize:'12px',fontWeight:800};

 function KistiField({id,value,onChange,placeholder,type='text',inputMode,autoComplete,error,endAdornment,maxLength}){
  return <label htmlFor={id} style={{boxSizing:'border-box',display:'grid',gap:'5px',width:'100%',minWidth:0,margin:0,fontFamily:font}}>
   <span style={{position:'relative',display:'block',width:'100%',minWidth:0}}>
    <input id={id} type={type} dir={type==='tel'||inputMode==='numeric'?'ltr':'rtl'} inputMode={inputMode} autoComplete={autoComplete} maxLength={maxLength} value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} aria-invalid={Boolean(error)} style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,height:'50px',margin:0,padding:endAdornment?'10px 14px 10px 48px':'10px 14px',color:'#F5F5F7',caretColor:'#168BFF',background:'#2B2B2F',border:`1px solid ${error?'#E05252':'#3B3B40'}`,borderRadius:'10px',outlineOffset:'2px',fontFamily:font,fontSize:'13px',fontWeight:600,colorScheme:'dark'}}/>
    {endAdornment&&<span style={{position:'absolute',top:'50%',insetInlineEnd:'8px',display:'grid',width:'34px',height:'34px',placeItems:'center',color:'#9B9BA2',transform:'translateY(-50%)'}}>{endAdornment}</span>}
   </span>
   {error&&<small role="alert" style={{margin:0,color:'#FF7777',fontFamily:font,fontSize:'10px',fontWeight:700,lineHeight:1.6}}>{error}</small>}
  </label>
 }

 function resolveUser(value){
  const raw=String(value||'').trim();
  const digits=IrancellLoginToEnglishDigits(raw).replace(/\D/g,'');
  const normalized=digits.length===10&&digits.startsWith('9')?`0${digits}`:digits.length===12&&digits.startsWith('98')?`0${digits.slice(2)}`:digits;
  return Object.values(state.identity.usersById).find(user=>user&&(user.mobile===raw||user.mobile===normalized))||null
 }

 function submit(event){
  event.preventDefault();
  setSubmitted(true);
  setCredentialError('');
  if(authMode==='create'){
   const normalizedMobile=IrancellNormalizeLoginMobile(registerMobile);
   setRegisterMobile(normalizedMobile);
   const invalid=IrancellValidateRequired(firstName,'نام')||IrancellValidateRequired(lastName,'نام خانوادگی')||(!/^\d{10}$/.test(nationalCode)?'invalid':'')||IrancellValidateMobile(normalizedMobile)||(password.length<6?'invalid':'')||(passwordConfirmation!==password?'invalid':'')||(!acceptedTerms?'invalid':'');
   if(invalid)return;
   dispatch(IrancellAuthRegisterWithKisti(normalizedMobile));
   onNavigate('role-select');
   return
  }
  const normalizedUsername=IrancellNormalizeLoginMobile(username);
  setUsername(normalizedUsername);
  if(IrancellValidateMobile(normalizedUsername)||password.length<6)return;
  const user=resolveUser(normalizedUsername);
  if(user&&password!==String(user.credentialPassword||IRANCELL_APP_CONFIG.demoPassword)){setCredentialError('شماره موبایل یا رمز عبور صحیح نیست.');return}
  dispatch(IrancellAuthLoginWithCredentials(normalizedUsername,password));
  if(!user){onNavigate('role-select');return}
  const roles=Array.isArray(user.roles)&&user.roles.length?user.roles:['student'];
  onNavigate(roles.length>1?'role-select':IRANCELL_ROLE_HOME_ROUTES[roles[0]]||'student/home')
 }

 function loginWithOtp(){
  const normalizedMobile=IrancellNormalizeLoginMobile(username);
  setUsername(normalizedMobile);
  setSubmitted(true);
  setCredentialError('');
  if(IrancellValidateMobile(normalizedMobile))return;
  dispatch(IrancellAuthRequestOtp(normalizedMobile,'login'));
  onNavigate('auth/otp?flow=student-login')
 }

 function changeMode(nextMode){
  setSubmitted(false);
  setCredentialError('');
  setAuthMode(nextMode);
  setUsername(nextMode==='login'?currentUser?.mobile||IRANCELL_APP_CONFIG.demoAccounts.student:'');
  setRegisterMobile('');
  setPassword(nextMode==='login'?IRANCELL_APP_CONFIG.demoPassword:'');
  setPasswordConfirmation('');
  setAcceptedTerms(false);
  setPasswordVisible(false)
 }

 function openDemoProfile(profileKey){
  const profile=IRANCELL_APP_CONFIG.demoMode?.profiles?.[profileKey];
  if(!profile)return;
  dispatch({type:'IRANCELL_DEMO_ACTIVATE_PROFILE',profileKey});
  onNavigate(profile.route)
 }

 const demoProfiles=IRANCELL_APP_CONFIG.demoMode?.enabled&&state.settings?.demo?.enabled!==false&&state.settings?.demo?.showQuickProfiles!==false?Object.entries(IRANCELL_APP_CONFIG.demoMode.profiles||{}).filter(([,profile])=>profile.quick&&state.identity.usersById?.[profile.userId]):[];
 const phoneIcon=<svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z"/></svg>;
 const passwordToggle=<button type="button" aria-label={passwordVisible?'پنهان کردن رمز عبور':'نمایش رمز عبور'} aria-pressed={passwordVisible} onClick={()=>setPasswordVisible(current=>!current)} style={{display:'grid',width:'34px',height:'34px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:passwordVisible?'#168BFF':'#9B9BA2',background:'transparent',border:0,borderRadius:'8px'}}><svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">{passwordVisible?<><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.6"/></>:<><path d="m3 3 18 18M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a14 14 0 0 1-2.1 2.8M6.2 6.2C3.9 7.7 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.6-.8M10.1 10.1a2.7 2.7 0 0 0 3.8 3.8"/></>}</svg></button>;

 return <IrancellIdentityFrame inlineOnly style={{position:'relative',display:'grid',minHeight:'100dvh',placeItems:'center',padding:compact?'max(16px, env(safe-area-inset-top)) 8px calc(16px + env(safe-area-inset-bottom))':'42px 24px',overflowY:'auto',color:'#F5F5F7',background:'radial-gradient(circle at 50% 35%,#1C1D22 0%,#111216 52%,#0E0F12 100%)',fontFamily:font}}>
  <div aria-hidden="true" style={{position:'fixed',inset:0,pointerEvents:'none',opacity:.18,backgroundImage:'linear-gradient(60deg,transparent 49.5%,#3A3B42 50%,transparent 50.5%),linear-gradient(-60deg,transparent 49.5%,#3A3B42 50%,transparent 50.5%)',backgroundSize:'230px 400px'}}/>
  {!compact&&<strong style={{position:'fixed',top:'30px',left:'36px',zIndex:1,color:'#F4F4F5',fontFamily:'Arial, sans-serif',fontSize:'10px',fontWeight:800,letterSpacing:'.6px'}}>●&nbsp; KEESTEE</strong>}
  <section style={{boxSizing:'border-box',position:'relative',zIndex:1,display:'flex',width:'100%',maxWidth:'430px',minWidth:0,flexDirection:'column',gap:compact?'17px':'18px',margin:'auto',padding:compact?'24px 22px 26px':'28px 30px 30px',color:'#F5F5F7',background:'linear-gradient(145deg,#1C1D20 0%,#191A1D 100%)',border:'1px solid #34353A',borderRadius:compact?'32px':'26px',boxShadow:'0 30px 80px rgba(0,0,0,.38)',fontFamily:font,direction:'rtl'}}>
   <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'14px'}}>
    <strong style={{color:'#F5F5F7',fontFamily:font,fontSize:'13px',fontWeight:800}}>سامانه یکپارچه احراز هویت</strong>
    <span aria-hidden="true" style={{display:'grid',width:'34px',height:'34px',placeItems:'center',color:'#FFD100',background:'#26272B',border:'1px solid #3A3B40',borderRadius:'50%'}}><svg viewBox="0 0 24 24" style={{...iconStyle,width:'18px',height:'18px'}}><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg></span>
   </header>

   <div role="tablist" aria-label="نوع ورود" style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'3px',padding:'3px',background:'#232428',border:'1px solid #2D2E33',borderRadius:'999px'}}>
    {['create','login'].map(mode=>{const active=authMode===mode;return <button key={mode} type="button" role="tab" aria-selected={active} onClick={()=>changeMode(mode)} style={{display:'inline-flex',minHeight:'38px',alignItems:'center',justifyContent:'center',margin:0,padding:'7px 12px',cursor:'pointer',color:active?'#FFFFFF':'#8F8F96',background:active?'#74757B':'transparent',border:0,borderRadius:'999px',fontFamily:font,fontSize:'13px',fontWeight:900,boxShadow:active?'inset 0 0 0 1px rgba(255,255,255,.08)':'none'}}>{mode==='create'?'ثبت‌نام':'ورود'}</button>})}
   </div>

   <section style={{display:'grid',gap:'5px',margin:'4px 0 0',textAlign:'right'}}>
    <h1 style={{margin:0,color:'#FFFFFF',fontFamily:font,fontSize:compact?'25px':'28px',fontWeight:900,lineHeight:1.5}}>{authMode==='create'?'ایجاد حساب کاربری':'خوش آمدید'}</h1>
    <p style={{margin:0,color:'#929299',fontFamily:font,fontSize:'12px',fontWeight:500,lineHeight:1.8}}>{authMode==='create'?'اطلاعات خود را برای ثبت‌نام وارد کنید':'برای ورود، اطلاعات خود را وارد کنید'}</p>
   </section>

   <form onSubmit={submit} noValidate style={{display:'grid',gap:'11px',width:'100%',margin:0,fontFamily:font}}>
    {authMode==='create'&&<>
     <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'9px'}}>
      <KistiField id="ir-kisti-first-name" value={firstName} onChange={event=>setFirstName(event.target.value)} placeholder="نام" autoComplete="given-name" error={firstNameError}/>
      <KistiField id="ir-kisti-last-name" value={lastName} onChange={event=>setLastName(event.target.value)} placeholder="نام خانوادگی" autoComplete="family-name" error={lastNameError}/>
     </div>
     <KistiField id="ir-kisti-national-code" value={nationalCode} onChange={event=>setNationalCode(IrancellLoginToEnglishDigits(event.target.value).replace(/\D/g,'').slice(0,10))} placeholder="کد ملی" inputMode="numeric" autoComplete="off" maxLength={10} error={nationalCodeError}/>
     <KistiField id="ir-kisti-register-mobile" type="tel" value={registerMobile} onChange={event=>setRegisterMobile(IrancellNormalizeLoginMobile(event.target.value))} placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="numeric" autoComplete="tel" error={registerMobileError} endAdornment={phoneIcon}/>
    </>}
    {authMode==='login'&&<KistiField id="ir-kisti-login-mobile" type="tel" value={username} onChange={event=>{setUsername(IrancellNormalizeLoginMobile(event.target.value));setCredentialError('')}} placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="numeric" autoComplete="tel" error={usernameError||credentialError} endAdornment={phoneIcon}/>}
    <KistiField id="ir-kisti-password" type={passwordVisible?'text':'password'} value={password} onChange={event=>setPassword(event.target.value)} placeholder="رمز عبور" autoComplete={authMode==='create'?'new-password':'current-password'} error={passwordError} endAdornment={passwordToggle}/>
    {authMode==='create'&&<KistiField id="ir-kisti-password-confirmation" type={passwordVisible?'text':'password'} value={passwordConfirmation} onChange={event=>setPasswordConfirmation(event.target.value)} placeholder="تکرار رمز عبور" autoComplete="new-password" error={confirmationError} endAdornment={passwordToggle}/>}

    {authMode==='login'?<button type="button" onClick={loginWithOtp} style={{justifySelf:'start',margin:'-2px 0 0',padding:'3px 0',cursor:'pointer',color:'#A8A8AE',background:'transparent',border:0,borderBottom:'1px solid #56565C',fontFamily:font,fontSize:'10px',fontWeight:700}}>رمز عبورتان را فراموش کرده‌اید؟</button>:<div style={{display:'grid',gap:'5px'}}>
     <label style={{display:'flex',alignItems:'center',gap:'9px',color:'#A8A8AE',fontFamily:font,fontSize:'11px',fontWeight:600,lineHeight:1.8}}><input type="checkbox" checked={acceptedTerms} onChange={event=>setAcceptedTerms(event.target.checked)} style={{width:'18px',height:'18px',margin:0,accentColor:'#168BFF'}}/><span>با ثبت‌نام، <button type="button" onClick={()=>setTermsOpen(true)} style={{margin:0,padding:0,cursor:'pointer',color:'#168BFF',background:'transparent',border:0,fontFamily:font,fontSize:'11px',fontWeight:800}}>شرایط و قوانین</button> را می‌پذیرم</span></label>
     {termsError&&<small role="alert" style={{color:'#FF7777',fontFamily:font,fontSize:'10px',fontWeight:700}}>{termsError}</small>}
    </div>}

    <button type="submit" style={actionStyle}>{authMode==='create'?'ثبت‌نام':'ورود'}</button>
   </form>

   {authMode==='login'&&<section style={{display:'grid',gap:'11px'}}>
    <div aria-hidden="true" style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:'10px',color:'#77777E',fontFamily:font,fontSize:'10px'}}><span style={{height:'1px',background:'#33343A'}}/><span>یا</span><span style={{height:'1px',background:'#33343A'}}/></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'9px'}}><button type="button" onClick={()=>changeMode('create')} style={quietActionStyle}>ثبت‌نام با کیستی</button><button type="button" onClick={loginWithOtp} style={quietActionStyle}>ورود با رمز یکبار مصرف</button></div>
    {demoProfiles.length>0&&<details style={{padding:'10px 12px',background:'#202125',border:'1px solid #33343A',borderRadius:'11px',fontFamily:font}}><summary style={{cursor:'pointer',color:'#BDBDC2',fontFamily:font,fontSize:'11px',fontWeight:800}}>ورود سریع به حساب‌های دمو</summary><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'7px',marginTop:'10px'}}>{demoProfiles.map(([profileKey,profile])=>{const demoUser=state.identity.usersById[profile.userId];return <button type="button" key={profileKey} onClick={()=>openDemoProfile(profileKey)} style={{display:'grid',gap:'2px',minWidth:0,padding:'9px',cursor:'pointer',textAlign:'right',color:'#F1F1F3',background:'#292A2E',border:'1px solid #3A3B40',borderRadius:'9px',fontFamily:font}}><strong style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'10px'}}>{profile.label}</strong><small style={{overflow:'hidden',color:'#929299',fontSize:'9px',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{demoUser?.name||profile.label}</small></button>})}</div></details>}
   </section>}
  </section>

  <small style={{position:'relative',zIndex:1,alignSelf:'end',marginTop:'18px',color:'#68686F',fontFamily:font,fontSize:'9px'}}>تمامی حقوق این سامانه برای ایرانسل محفوظ است.</small>

  {termsOpen&&<div role="dialog" aria-modal="true" aria-labelledby="ir-kisti-terms-title" style={{position:'fixed',inset:0,zIndex:2147483600,display:'grid',placeItems:'center',padding:'18px',overflowY:'auto',fontFamily:font}}>
   <button type="button" aria-label="بستن شرایط و قوانین" onClick={()=>setTermsOpen(false)} style={{position:'fixed',inset:0,width:'100%',height:'100%',margin:0,padding:0,cursor:'pointer',background:'rgba(0,0,0,.72)',border:0,backdropFilter:'blur(5px)',WebkitBackdropFilter:'blur(5px)'}}/>
   <section style={{boxSizing:'border-box',position:'relative',display:'flex',width:'100%',maxWidth:'500px',maxHeight:'calc(100dvh - 36px)',flexDirection:'column',padding:'22px',overflow:'hidden',color:'#F5F5F7',background:'#1C1D20',border:'1px solid #38393E',borderRadius:'22px',boxShadow:'0 30px 90px rgba(0,0,0,.5)',fontFamily:font,direction:'rtl'}}>
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'14px'}}><h2 id="ir-kisti-terms-title" style={{margin:0,fontFamily:font,fontSize:'19px',fontWeight:900}}>شرایط و قوانین</h2><button type="button" aria-label="بستن" onClick={()=>setTermsOpen(false)} style={{display:'grid',width:'38px',height:'38px',placeItems:'center',padding:0,cursor:'pointer',color:'#FFFFFF',background:'#292A2E',border:'1px solid #3A3B40',borderRadius:'10px',fontFamily:font,fontSize:'20px'}}>×</button></header>
    <div style={{display:'grid',gap:'10px',minHeight:0,overflowY:'auto'}}>{IRANCELL_PAGE_IDENTITY_TERMS.map(item=><article key={item.title} style={{padding:'13px',background:'#242529',border:'1px solid #35363B',borderRadius:'11px'}}><h3 style={{margin:'0 0 5px',fontFamily:font,fontSize:'13px'}}>{item.title}</h3><p style={{margin:0,color:'#A6A6AC',fontFamily:font,fontSize:'11px',lineHeight:1.9}}>{item.body}</p></article>)}</div>
    <button type="button" onClick={()=>{setAcceptedTerms(true);setTermsOpen(false)}} style={{...actionStyle,marginTop:'14px'}}>پذیرش شرایط</button>
   </section>
  </div>}
 </IrancellIdentityFrame>
}

export function IrancellIdentityLoginPage({onNavigate,params={}}){const{state,dispatch}=useIrancellStore(),isStudentMode=true,currentUser=state.identity.usersById[state.session.currentUserId]||null,[authMode,setAuthMode]=useState(params.mode==='create'?'create':'login'),[username,setUsername]=useState(currentUser?.mobile||IRANCELL_APP_CONFIG.demoAccounts.student),[mobile,setMobile]=useState(currentUser?.mobile||IRANCELL_APP_CONFIG.demoAccounts.student),[password,setPassword]=useState(IRANCELL_APP_CONFIG.demoPassword),[firstName,setFirstName]=useState(''),[lastName,setLastName]=useState(''),[nationalCode,setNationalCode]=useState(''),[passwordConfirmation,setPasswordConfirmation]=useState(''),[acceptedTerms,setAcceptedTerms]=useState(false),[termsOpen,setTermsOpen]=useState(params.mode==='terms'),[submitted,setSubmitted]=useState(false),[credentialError,setCredentialError]=useState(''),usernameError=submitted&&authMode==='login'?IrancellValidateMobile(IrancellNormalizeLoginMobile(username)):'',mobileError=submitted&&authMode==='create'?IrancellValidateMobile(mobile):'',passwordError=submitted&&authMode==='login'&&password.length<6?'رمز عبور باید حداقل ۶ نویسه داشته باشد.':'',nameError=submitted&&authMode==='create'?IrancellValidateRequired(firstName,'نام'):'',familyError=submitted&&authMode==='create'?IrancellValidateRequired(lastName,'نام خانوادگی'):'',nationalCodeError=submitted&&authMode==='create'&&!/^\d{10}$/.test(nationalCode)?'کد ملی باید ۱۰ رقم باشد.':'',confirmationError=submitted&&authMode==='create'&&passwordConfirmation!==password?'تکرار رمز عبور با رمز عبور یکسان نیست.':'',termsError=submitted&&authMode==='create'&&!acceptedTerms?'پذیرش قوانین برای عضویت الزامی است.':'';function resolveUser(value){const raw=String(value||'').trim(),digits=IrancellLoginToEnglishDigits(raw).replace(/\D/g,''),normalized=digits.length===10&&digits.startsWith('9')?`0${digits}`:digits.length===12&&digits.startsWith('98')?`0${digits.slice(2)}`:digits;return Object.values(state.identity.usersById).find(user=>user&&(user.mobile===raw||user.mobile===normalized))||null}function submit(event){event.preventDefault();setSubmitted(true);setCredentialError('');if(authMode!=='login')return;const normalizedUsername=IrancellNormalizeLoginMobile(username);setUsername(normalizedUsername);if(IrancellValidateMobile(normalizedUsername)||password.length<6)return;const user=resolveUser(normalizedUsername);if(user&&password!==String(user.credentialPassword||IRANCELL_APP_CONFIG.demoPassword)){setCredentialError('شماره موبایل یا رمز عبور صحیح نیست.');return}dispatch(IrancellAuthLoginWithCredentials(normalizedUsername,password));if(!user){onNavigate('role-select');return}const roles=Array.isArray(user.roles)&&user.roles.length?user.roles:['student'];onNavigate(roles.length>1?'role-select':IRANCELL_ROLE_HOME_ROUTES[roles[0]]||'student/home')}function loginWithOtp(){const normalizedMobile=IrancellNormalizeLoginMobile(username);setUsername(normalizedMobile);setSubmitted(true);setCredentialError('');if(IrancellValidateMobile(normalizedMobile))return;dispatch(IrancellAuthRequestOtp(normalizedMobile,'login'));onNavigate('auth/otp?flow=student-login')}function registerWithKisti(){setSubmitted(false);setCredentialError('');dispatch(IrancellAuthRegisterWithKisti(IRANCELL_APP_CONFIG.demoKistiSignupMobile));onNavigate('role-select')}function changeMode(nextMode){setSubmitted(false);setCredentialError('');setAuthMode(nextMode);setUsername(nextMode==='login'?IRANCELL_APP_CONFIG.demoAccounts.student:'');setPassword(nextMode==='login'?IRANCELL_APP_CONFIG.demoPassword:'');setPasswordConfirmation('');setTermsOpen(false)}function openDemoProfile(profileKey){const profile=IRANCELL_APP_CONFIG.demoMode?.profiles?.[profileKey];if(!profile)return;dispatch({type:'IRANCELL_DEMO_ACTIVATE_PROFILE',profileKey});onNavigate(profile.route)}const demoProfiles=IRANCELL_APP_CONFIG.demoMode?.enabled&&state.settings?.demo?.enabled!==false&&state.settings?.demo?.showQuickProfiles!==false?Object.entries(IRANCELL_APP_CONFIG.demoMode.profiles||{}).filter(([,profile])=>profile.quick&&state.identity.usersById?.[profile.userId]):[];return <IrancellIdentityFrame className="ir-mobile-login-light"><section className={`ir-mobile-login-light__screen ${authMode==='create'?'is-create':'is-login'}`}><section className="ir-mobile-login-light__brand"><IrancellBrandMark/></section><h1 className="ir-mobile-login-light__app">ایرانسل آکادمی</h1><div className="ir-mobile-login-light__tabs" role="tablist" aria-label="نوع ورود"><button type="button" className={authMode==='create'?'is-active':''} aria-selected={authMode==='create'} onClick={()=>changeMode('create')}>ثبت‌نام</button><button type="button" className={authMode==='login'?'is-active':''} aria-selected={authMode==='login'} onClick={()=>changeMode('login')}>ورود</button></div><section className="ir-mobile-login-light__copy"><h2>{authMode==='create'?'ثبت‌نام با کیستی':'خوش آمدید'}</h2><p>{authMode==='create'?'هویت شما در کیستی تأیید می‌شود و اطلاعات لازم به‌صورت امن دریافت خواهد شد.':'برای ورود، شماره موبایل و رمز عبور خود را وارد کنید.'}</p></section>{authMode==='login'?<form className="ir-mobile-login-light__form" onSubmit={submit} noValidate>{authMode==='create'&&<><label className={`ir-mobile-login-light__field is-text ${nameError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg></span><input autoComplete="given-name" value={firstName} onChange={event=>setFirstName(event.target.value)} placeholder="نام"/></label>{nameError&&<small className="ir-mobile-login-light__error">{nameError}</small>}<label className={`ir-mobile-login-light__field is-text ${familyError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2.5A5.5 5.5 0 0 1 9 12a5.5 5.5 0 0 1 5.5 5.5V20"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5A4.5 4.5 0 0 1 21 19"/></svg></span><input autoComplete="family-name" value={lastName} onChange={event=>setLastName(event.target.value)} placeholder="نام خانوادگی"/></label>{familyError&&<small className="ir-mobile-login-light__error">{familyError}</small>}<label className={`ir-mobile-login-light__field is-text ${nationalCodeError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M13 9h5M13 13h5M6 16h5"/></svg></span><div className={`ir-mobile-login-light__localized-number is-national-code ${nationalCode?'':'is-empty'}`}><output lang="fa" dir="rtl" aria-hidden="true">{nationalCode?IrancellLoginToPersianDigits(nationalCode):'کد ملی'}</output><input type="text" lang="fa" dir="rtl" inputMode="numeric" autoComplete="off" maxLength={10} aria-label="کد ملی" value={nationalCode} onChange={event=>setNationalCode(IrancellLoginToEnglishDigits(event.target.value).replace(/\D/g,'').slice(0,10))}/></div></label>{nationalCodeError&&<small className="ir-mobile-login-light__error">{nationalCodeError}</small>}</>}{authMode==='create'?<><label className={`ir-mobile-login-light__field is-phone ${mobileError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z"/></svg></span><b dir="rtl" lang="fa">+۹۸</b><div className={`ir-mobile-login-light__localized-number ${mobile?'':'is-empty'}`}><output lang="fa" dir="ltr" aria-hidden="true">{mobile?IrancellLoginToPersianDigits(String(mobile).replace(/^0/,'')):'۹۱۲۳۴۵۶۷۸۹'}</output><input type="tel" lang="fa" dir="ltr" inputMode="numeric" autoComplete="tel" aria-label="شماره موبایل" value={String(mobile||'').replace(/^0/,'')} onChange={event=>setMobile(IrancellNormalizeLoginMobile(event.target.value))}/></div></label>{mobileError&&<small className="ir-mobile-login-light__error">{mobileError}</small>}</>:<><label className={`ir-mobile-login-light__field is-login-mobile ${usernameError||credentialError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z"/></svg></span><input type="tel" dir="ltr" inputMode="numeric" autoComplete="tel" value={username} onChange={event=>{setUsername(IrancellNormalizeLoginMobile(event.target.value));setCredentialError('')}} placeholder="شماره موبایل"/></label>{usernameError&&<small className="ir-mobile-login-light__error">{usernameError}</small>}{credentialError&&<small className="ir-mobile-login-light__error">{credentialError}</small>}</>}<label className={`ir-mobile-login-light__field is-password ${passwordError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span><input type="password" dir="ltr" autoComplete="current-password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="رمز عبور"/></label>{passwordError&&<small className="ir-mobile-login-light__error">{passwordError}</small>}{authMode==='create'&&<><label className={`ir-mobile-login-light__field is-password ${confirmationError?'has-error':''}`}><span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M9 15l2 2 4-4"/></svg></span><input type="password" dir="ltr" autoComplete="new-password" value={passwordConfirmation} onChange={event=>setPasswordConfirmation(event.target.value)} placeholder="تکرار رمز عبور"/></label>{confirmationError&&<small className="ir-mobile-login-light__error">{confirmationError}</small>}</>}{authMode==='login'?<button type="button" className="ir-mobile-login-light__forgot" onClick={loginWithOtp}>رمز عبورتان را فراموش کرده‌اید؟</button>:<label className={`ir-mobile-login-light__terms ${termsError?'has-error':''}`}><input type="checkbox" checked={acceptedTerms} onChange={event=>setAcceptedTerms(event.target.checked)}/><span>با <button type="button" onClick={()=>setTermsOpen(true)}>شرایط و قوانین</button> موافقم</span>{termsError&&<small>{termsError}</small>}</label>}<button type="submit" className="ir-mobile-login-light__submit">{authMode==='create'?'ثبت‌نام':'ورود'}</button></form>:<section className="ir-mobile-login-light__form"><button type="button" className="ir-mobile-login-light__submit" onClick={registerWithKisti}>ثبت‌نام با کیستی</button></section>}{authMode==='login'&&<><div className="ir-mobile-login-light__divider"><span>یا</span></div><button type="button" className="ir-mobile-login-light__otp" onClick={loginWithOtp}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><rect x="7" y="3" width="10" height="12" rx="2"/><path d="M11 7h2M10 11h4"/></svg><span>ورود یا ثبت‌نام با رمز یکبار مصرف</span></button></>}{authMode==='login'&&demoProfiles.length>0&&<section className="ir-mobile-login-light__demo"><header><strong>{IrancellFormatPersianNumber(demoProfiles.length)} حساب آماده برای نمایش دمو</strong><small>دانش‌آموز، خانواده، مدرس جدید و فعال، آموزشگاه، تولیدکننده محتوا و مدیر سامانه همگی با داده‌های واقعی دمو آماده‌اند.</small></header><div>{demoProfiles.map(([profileKey,profile])=>{const demoUser=state.identity.usersById[profile.userId];return <button type="button" key={profileKey} onClick={()=>openDemoProfile(profileKey)}><strong>{profile.label}</strong><span>{demoUser?.name||profile.label}</span><small>{profile.description}</small></button>})}</div></section>}{termsOpen&&<div className="ir-mobile-login-light__terms-modal" role="dialog" aria-modal="true" aria-labelledby="ir-mobile-login-terms-title"><button type="button" className="ir-mobile-login-light__terms-scrim" aria-label="بستن شرایط و قوانین" onClick={()=>setTermsOpen(false)}/><section><header><button type="button" aria-label="بستن" onClick={()=>setTermsOpen(false)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><h2 id="ir-mobile-login-terms-title">شرایط و قوانین</h2><span/></header><div>{IRANCELL_PAGE_IDENTITY_TERMS.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><button type="button" className="ir-mobile-login-light__terms-accept" onClick={()=>{setAcceptedTerms(true);setTermsOpen(false)}}>پذیرش شرایط</button></section></div>}</section></IrancellIdentityFrame>;if(isStudentMode)return <IrancellIdentityFrame className="ir-ref-student-auth"><div className="ir-ref-student-auth__layout"><aside className="ir-ref-student-auth__promo"><button type="button" className="ir-ref-student-auth__parent-login" onClick={()=>{setMobile(IRANCELL_APP_CONFIG.demoAccounts.parent);changeMode('login')}}><span>ورود والدین</span><ArrowLeft size={15}/></button><div className="ir-ref-student-auth__brand"><span><BookOpen size={22}/></span><strong>پلتفرم آموزشی</strong></div><h1>ورود دانش‌آموز</h1><p>با شماره موبایل و رمز عبور خود وارد شوید تا به فضای یادگیری و برنامه درسی خود دسترسی پیدا کنید.</p><ul><li>دسترسی سریع به برنامه درسی و تکالیف</li><li>مدیریت امن توسط والدین</li><li>تجربه یادگیری هوشمند و شخصی‌سازی‌شده</li></ul></aside><section className="ir-ref-student-auth__main"><header><h1>ورود به حساب</h1><p>برای ادامه اطلاعات ورود را وارد کنید</p></header><IrancellIdentityProfileHeader subtitle="برای ادامه اطلاعات ورود را وارد کنید"/><form className="ir-ref-auth-card" onSubmit={submit} noValidate><h2>ورود دانش‌آموز</h2><label className={`ir-field ir-ref-phone-field ${mobileError?'has-error':''}`}><span>شماره تلفن<b>*</b></span><div className="ir-ref-phone-field__control"><span className="ir-ref-phone-field__prefix" dir="ltr"><b>IR</b><strong>+98</strong></span><input dir="ltr" inputMode="numeric" autoComplete="tel" value={mobile} onChange={event=>setMobile(event.target.value)} required/></div>{mobileError&&<small className="ir-field__error">{mobileError}</small>}</label><IrancellIdentityPasswordField label="رمز عبور" value={password} onChange={event=>setPassword(event.target.value)} error={passwordError} autoComplete="current-password"/><button className="ir-forgot-link" type="button" onClick={loginWithOtp}>رمز عبور را فراموش کردید؟</button><IrancellButton variant="identity" size="lg" block type="submit">ورود</IrancellButton></form><IrancellIdentityInfoBanner>دسترسی شما توسط خانواده‌تان مدیریت می‌شود. برخی تنظیمات ممکن است توسط والدین کنترل شود.</IrancellIdentityInfoBanner></section></div></IrancellIdentityFrame>;return <IrancellIdentityFrame className="ir-prototype-identity-auth"><section className="ir-prototype-identity-auth__card"><header className="ir-prototype-identity-auth__brand"><span className="ir-prototype-identity-auth__sun" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 1.4 4.1 4.1 1.4-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/></svg></span><strong>سامانه یکپارچه احراز هویت</strong></header><IrancellIdentityAuthTabs active={authMode} onChange={changeMode} loginLabel="ورود" createLabel="ثبت‌نام"/><div className="ir-prototype-identity-auth__heading"><h1>{authMode==='create'?'ایجاد حساب کاربری':'خوش آمدید'}</h1><p>{authMode==='create'?'اطلاعات خود را برای ثبت‌نام وارد کنید':'برای ورود، اطلاعات خود را وارد کنید'}</p></div><form className="ir-prototype-identity-auth__form" onSubmit={submit} noValidate>{authMode==='create'&&<><IrancellInput label="نام" value={firstName} onChange={event=>setFirstName(event.target.value)} error={nameError}/><IrancellInput label="نام خانوادگی" value={lastName} onChange={event=>setLastName(event.target.value)} error={familyError}/><IrancellInput label="کد ملی" inputMode="numeric" maxLength={10} value={nationalCode} onChange={event=>setNationalCode(event.target.value.replace(/\D/g,'').slice(0,10))} error={nationalCodeError}/></>}<IrancellInput label="شماره موبایل" inputMode="numeric" value={mobile} onChange={event=>setMobile(event.target.value)} error={mobileError}/><IrancellIdentityPasswordField label="رمز عبور" value={password} onChange={event=>setPassword(event.target.value)} error={passwordError}/>{authMode==='create'&&<IrancellIdentityPasswordField label="تکرار رمز عبور" value={passwordConfirmation} onChange={event=>setPasswordConfirmation(event.target.value)} error={confirmationError}/>} {authMode==='login'?<button type="button" className="ir-forgot-link" onClick={loginWithOtp}>رمز عبور را فراموش کرده‌اید؟</button>:<label className={`ir-prototype-identity-auth__terms ${termsError?'has-error':''}`}><input type="checkbox" checked={acceptedTerms} onChange={event=>setAcceptedTerms(event.target.checked)}/><span>با <button type="button" onClick={()=>setTermsOpen(true)}>شرایط و قوانین</button> موافقم</span>{termsError&&<small>{termsError}</small>}</label>}<IrancellButton variant="dark-auth" size="lg" block type="submit">{authMode==='create'?'ثبت‌نام':'ورود'}</IrancellButton></form>{authMode==='login'&&<><div className="ir-prototype-identity-auth__divider"><span>یا</span></div><div className="ir-prototype-identity-auth__alternatives"><button type="button" onClick={()=>onNavigate('auth/login?mode=student')}>ورود با کد دانش‌آموزی</button><button type="button" onClick={()=>{dispatch(IrancellAuthRequestOtp(mobile));onNavigate('auth/otp')}}>ورود با رمز یکبار مصرف</button></div></>}</section>{termsOpen&&<div className="ir-prototype-terms" role="dialog" aria-modal="true" aria-labelledby="ir-prototype-terms-title"><section><header><button type="button" aria-label="بستن" onClick={()=>setTermsOpen(false)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><h2 id="ir-prototype-terms-title">شرایط و ضوابط سامانه احراز هویت</h2><ShieldCheck size={20}/></header><div>{IRANCELL_PAGE_IDENTITY_TERMS.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section></div>}</IrancellIdentityFrame>}
