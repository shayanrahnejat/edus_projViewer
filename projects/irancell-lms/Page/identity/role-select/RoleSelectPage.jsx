const IRANCELL_PAGE_ROLE_CARDS=Object.freeze([
 {id:'student',role:'student',label:'دانش‌آموز',description:'یادگیری، کلاس‌ها، تمرین‌ها و دستیار هوشمند',Icon:GraduationCap},
 {id:'parent',role:'parent',label:'خانواده',description:'پیگیری فرزندان، رضایت‌نامه‌ها و پرداخت‌ها',Icon:UsersRound},
 {id:'academy',role:'academy',label:'آموزشگاه',description:'مدیریت مدرس‌ها، کلاس‌ها و امور مالی',Icon:Building2},
 {id:'content-provider',role:'content-provider',label:'تولیدکننده محتوا',description:'کتابخانه، انتشار محتوا، تحلیل و تسویه',Icon:BookOpen},
 {id:'admin',role:'admin',label:'مدیر سامانه',description:'کاربران، گزارش‌ها، شکایت‌ها و تنظیمات',Icon:ShieldCheck}
]);

export function IrancellIdentityRoleSelectPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const accountId=state.session.candidateUserId||state.session.currentUserId;
 const account=state.identity.usersById[accountId]||null;
 const sessionRoles=Array.isArray(state.session.availableRoles)?state.session.availableRoles:[];
 const accountRoles=Array.isArray(account?.roles)?account.roles:[];
 const allowedRoles=Array.from(new Set([...sessionRoles,...accountRoles])).filter(role=>Boolean(IRANCELL_ROLE_HOME_ROUTES[role]));
 const availableCards=IRANCELL_PAGE_ROLE_CARDS.filter(card=>allowedRoles.includes(card.role));
 const[selectedRole,setSelectedRole]=useState(allowedRoles.includes(state.session.activeRole)?state.session.activeRole:allowedRoles[0]||'');
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';

 useEffect(function IrancellIdentitySynchronizeSelectedRole(){
  if(!allowedRoles.includes(selectedRole))setSelectedRole(allowedRoles[0]||'');
 },[allowedRoles.join('|'),selectedRole]);

 function continueFlow(){
  if(!selectedRole||!allowedRoles.includes(selectedRole))return;
  dispatch(IrancellAuthSelectRole(selectedRole));
  onNavigate?.(state.session.requiresOnboarding?'profile-completion':IRANCELL_ROLE_HOME_ROUTES[selectedRole]||'student/home');
 }

 if(!['role_pending','authenticated'].includes(state.session.status))return <div dir="rtl" style={{boxSizing:'border-box',display:'grid',width:'100%',minHeight:'100dvh',placeItems:'center',padding:'24px',background:'#FFFAE0',fontFamily:font}}><IrancellStatePanel state="unauthorized" title="ورود کامل نشده است" description="ابتدا اطلاعات ورود یا کد یک‌بارمصرف را تأیید کنید." action={<IrancellButton onClick={()=>onNavigate?.('auth/login')}>بازگشت به ورود</IrancellButton>}/></div>;

 return <IrancellIdentityFrame inlineOnly style={{height:'100dvh',minHeight:'100dvh',overflowX:'hidden',overflowY:'auto',overscrollBehavior:'contain',WebkitOverflowScrolling:'touch'}}>
  <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',alignItems:'center',justifyContent:'center',margin:0,padding:'clamp(18px,5vw,48px)',direction:'rtl',fontFamily:font}}>
   <div style={{boxSizing:'border-box',display:'flex',width:'min(100%,760px)',minWidth:0,flexDirection:'column',alignItems:'center',gap:'22px',margin:'auto',padding:'clamp(22px,4vw,38px)',color:'#202024',background:'rgba(255,255,255,.96)',border:'1px solid #E7E2CC',borderRadius:'28px',boxShadow:'0 24px 70px rgba(62,52,12,.12)',fontFamily:font}}>
    <IrancellBrandMark compact inlineOnly style={{width:'86px'}}/>

    <header style={{display:'flex',width:'100%',minWidth:0,flexDirection:'column',alignItems:'center',gap:'7px',textAlign:'center',fontFamily:font}}>
     <span style={{display:'inline-flex',minHeight:'27px',alignItems:'center',padding:'4px 11px',color:'#665500',background:'#FFF4B5',border:'1px solid #EBD264',borderRadius:'999px',fontFamily:font,fontSize:'10px',fontWeight:900}}>حساب کیستی</span>
     <h1 style={{margin:0,color:'#202024',fontFamily:font,fontSize:'clamp(22px,4vw,30px)',fontWeight:900,lineHeight:1.5}}>انتخاب نقش فعال</h1>
     <p style={{maxWidth:'540px',margin:0,color:'#74757C',fontFamily:font,fontSize:'12px',fontWeight:500,lineHeight:1.95}}>هر نقش فضای کاری، اطلاعات و دسترسی‌های مستقل خود را دارد. نقش موردنظر را برای ادامه انتخاب کنید.</p>
    </header>

    {availableCards.length?<div role="list" aria-label="نقش‌های قابل انتخاب" style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,210px),1fr))',gap:'11px',fontFamily:font}}>
     {availableCards.map(card=>{
      const selected=selectedRole===card.role;
      const CardIcon=card.Icon;
      return <button key={card.id} type="button" role="listitem" aria-pressed={selected} onClick={()=>setSelectedRole(card.role)} style={{boxSizing:'border-box',appearance:'none',WebkitAppearance:'none',display:'grid',width:'100%',minWidth:0,minHeight:'104px',gridTemplateColumns:'46px minmax(0,1fr) 24px',alignItems:'center',gap:'11px',margin:0,padding:'14px',cursor:'pointer',direction:'rtl',textAlign:'right',color:'#202024',background:selected?'#FFF8D1':'#FFFEFA',border:selected?'2px solid #FFD100':'1px solid #E5E0CC',borderRadius:'17px',boxShadow:selected?'0 10px 24px rgba(255,209,0,.16)':'0 5px 16px rgba(62,52,12,.04)',fontFamily:font,outlineOffset:'3px'}}>
       <span aria-hidden="true" style={{display:'grid',width:'46px',height:'46px',placeItems:'center',color:'#202024',background:selected?'#FFD100':'#FFF3AE',border:'1px solid #E8CF5B',borderRadius:'14px'}}><CardIcon size={22}/></span>
       <span style={{display:'flex',minWidth:0,flexDirection:'column',gap:'3px',fontFamily:font}}>
        <strong style={{color:'#202024',fontFamily:font,fontSize:'13px',fontWeight:900,lineHeight:1.65}}>{card.label}</strong>
        <small style={{color:'#74757C',fontFamily:font,fontSize:'10px',fontWeight:500,lineHeight:1.75}}>{card.description}</small>
       </span>
       <i aria-hidden="true" style={{display:'grid',width:'22px',height:'22px',placeItems:'center',color:selected?'#202024':'transparent',background:selected?'#FFD100':'#FFFFFF',border:selected?'1px solid #DDB500':'1px solid #D9D9DE',borderRadius:'50%',fontFamily:font,fontSize:'12px',fontStyle:'normal',fontWeight:900}}>{selected?'✓':''}</i>
      </button>;
     })}
    </div>:<div role="status" style={{boxSizing:'border-box',display:'flex',width:'100%',minHeight:'130px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',padding:'20px',textAlign:'center',background:'#FFF8D1',border:'1px dashed #D8C45C',borderRadius:'17px',fontFamily:font}}>
     <strong style={{fontFamily:font,fontSize:'14px',fontWeight:900}}>نقش فعالی برای این حساب پیدا نشد</strong>
     <small style={{color:'#74757C',fontFamily:font,fontSize:'11px',lineHeight:1.8}}>برای بررسی دسترسی‌های حساب دوباره وارد شوید.</small>
    </div>}

    <IrancellButton block size="lg" disabled={!selectedRole} onClick={continueFlow}>ورود به پنل {IRANCELL_PAGE_ROLE_CARDS.find(card=>card.role===selectedRole)?.label||''}</IrancellButton>

    <footer style={{display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:'7px',paddingTop:'4px',color:'#777982',fontFamily:font,fontSize:'11px'}}>
     <span>می‌خواهید با حساب دیگری وارد شوید؟</span>
     <button type="button" onClick={()=>onNavigate?.('auth/login')} style={{appearance:'none',WebkitAppearance:'none',margin:0,padding:'4px',cursor:'pointer',color:'#806A00',background:'transparent',border:0,fontFamily:font,fontSize:'11px',fontWeight:900}}>بازگشت به ورود</button>
    </footer>
   </div>
  </section>
 </IrancellIdentityFrame>
}
