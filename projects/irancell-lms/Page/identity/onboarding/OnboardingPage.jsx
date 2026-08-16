const IRANCELL_PAGE_ONBOARDING_SLIDES=Object.freeze([
 {id:'welcome',title:'دستیار هوشمند آموزشی شما',description:'دستیار هوشمند آموزشی شما برای یادگیری عمیق‌تر و سریع‌تر',action:'شروع کنید'},
 {id:'ai',title:'یادگیری با هوش مصنوعی',description:'با استفاده از قدرت هوش مصنوعی، مفاهیم پیچیده آموزشی را به سادگی و در کمترین زمان ممکن درک کنید.',action:'بعدی'},
 {id:'path',title:'مسیر یادگیری اختصاصی',description:'برنامه‌ای کاملاً شخصی‌سازی‌شده متناسب با سطح و سرعت یادگیری شما برای رسیدن به اهداف آموزشی.',action:'بعدی'},
 {id:'progress',title:'پیگیری هوشمند پیشرفت',description:'نقاط قوت و ضعف خود را به دقت شناسایی کنید و با تحلیل‌های هوشمند، عملکرد تحصیلی خود را ارتقا دهید.',action:'احراز هویت'}
]);

export function IrancellIdentityOnboardingPage({onNavigate}){
 const[activeIndex,setActiveIndex]=useState(0);
 const[viewport,setViewport]=useState(()=>({
  compact:typeof window!=='undefined'?window.innerWidth<768:false,
  short:typeof window!=='undefined'?window.innerHeight<760:false
 }));

 useEffect(function IrancellOnboardingTrackViewport(){
  if(typeof window==='undefined')return function IrancellOnboardingViewportNoopCleanup(){};
  function updateViewport(){setViewport({compact:window.innerWidth<768,short:window.innerHeight<760})}
  updateViewport();
  window.addEventListener('resize',updateViewport,{passive:true});
  return function IrancellOnboardingViewportCleanup(){window.removeEventListener('resize',updateViewport)}
 },[]);

 const slide=IRANCELL_PAGE_ONBOARDING_SLIDES[activeIndex];
 const isWelcome=activeIndex===0;
 const isLast=activeIndex===IRANCELL_PAGE_ONBOARDING_SLIDES.length-1;
 const featureSlides=IRANCELL_PAGE_ONBOARDING_SLIDES.slice(1);
 const compact=viewport.compact;
 const short=viewport.short;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const yellow='#FFD100';
 const pageBackground='#FFFAE0';
 const primaryButtonStyle={
  boxSizing:'border-box',
  display:'inline-flex',
  minWidth:isLast?'100%':'108px',
  minHeight:'48px',
  alignItems:'center',
  justifyContent:'center',
  margin:0,
  padding:'10px 22px',
  cursor:'pointer',
  color:'#171719',
  background:yellow,
  border:'1px solid #E7BD00',
  borderRadius:'999px',
  boxShadow:'0 9px 22px rgba(255,209,0,.2)',
  fontFamily:font,
  fontSize:'14px',
  fontWeight:900,
  lineHeight:1.7
 };

 function next(){
  if(isLast){onNavigate?.('auth/login');return}
  setActiveIndex(current=>Math.min(current+1,IRANCELL_PAGE_ONBOARDING_SLIDES.length-1))
 }

 function skip(){
  onNavigate?.('auth/login')
 }

 if(isWelcome)return <IrancellIdentityFrame inlineOnly style={{
  boxSizing:'border-box',
  display:'grid',
  width:'100%',
  minHeight:'100dvh',
  placeItems:'center',
  margin:0,
  padding:'max(18px, env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom))',
  overflowY:'auto',
  color:'#202024',
  background:pageBackground,
  fontFamily:font
 }}>
  <section aria-live="polite" style={{
   boxSizing:'border-box',
   display:'flex',
   width:'100%',
   maxWidth:'560px',
   minHeight:compact?'calc(100dvh - 42px)':'650px',
   flexDirection:'column',
   alignItems:'center',
   justifyContent:'center',
   margin:'auto',
   padding:compact?(short?'34px 6px 12px':'76px 8px 22px'):'72px 24px 38px',
   textAlign:'center',
   fontFamily:font,
   direction:'rtl'
  }}>
   <IrancellBrandMark inlineOnly style={{
    width:compact?'136px':'164px',
    margin:'0 0 42px'
   }}/>
   <h1 style={{
    margin:'0 0 7px',
    color:'#202024',
    fontFamily:font,
    fontSize:compact?'clamp(23px,7vw,28px)':'36px',
    fontWeight:900,
    lineHeight:1.55
   }}>{slide.title}</h1>
   <p style={{
    maxWidth:'390px',
    margin:0,
    color:'#7B7B82',
    fontFamily:font,
    fontSize:compact?'13px':'15px',
    fontWeight:500,
    lineHeight:1.95
   }}>{slide.description}</p>
   <button type="button" onClick={next} style={{
    ...primaryButtonStyle,
    minWidth:'128px',
    marginTop:compact?'auto':'86px'
   }}>{slide.action}</button>
  </section>
 </IrancellIdentityFrame>;

 return <IrancellIdentityFrame inlineOnly style={{
  boxSizing:'border-box',
  display:'grid',
  width:'100%',
  minHeight:'100dvh',
  placeItems:'center',
  margin:0,
  padding:compact
   ?'max(12px, env(safe-area-inset-top)) 14px calc(14px + env(safe-area-inset-bottom))'
   :'clamp(28px,5vh,52px) clamp(32px,7vw,90px)',
  overflowY:'auto',
  color:'#202024',
  background:pageBackground,
  fontFamily:font
 }}>
  <section aria-live="polite" style={{
   boxSizing:'border-box',
   display:'grid',
   gridTemplateColumns:compact?'minmax(0,1fr)':'minmax(330px,1fr) minmax(390px,.95fr)',
   gridTemplateRows:compact?(short?'minmax(210px,36dvh) auto':'minmax(250px,43dvh) auto'):'auto',
   gridTemplateAreas:compact?'"visual" "content"':'"visual content"',
   alignItems:'center',
   gap:compact?(short?'10px':'18px'):'clamp(42px,7vw,92px)',
   width:'100%',
   maxWidth:compact?'600px':'1160px',
   minWidth:0,
   minHeight:compact?'calc(100dvh - 28px)':'610px',
   margin:'auto',
   padding:compact?0:'12px',
   fontFamily:font,
   direction:'ltr'
  }}>
   <div style={{
    boxSizing:'border-box',
    gridArea:'visual',
    display:'grid',
    width:'100%',
    height:'100%',
    minWidth:0,
    placeItems:'center',
    alignSelf:'stretch',
    padding:0,
    overflow:'hidden',
    direction:'rtl'
   }}>
    <IrancellIdentityOnboardingVisual inlineOnly variant={slide.id} style={{
     width:'100%',
     maxWidth:compact?'430px':'500px',
     maxHeight:'100%',
     background:'#F7EFD9',
     borderRadius:compact?'24px':'30px',
     boxShadow:'0 14px 34px rgba(62,52,12,.08)'
    }}/>
   </div>

   <section style={{
    boxSizing:'border-box',
    gridArea:'content',
    display:'flex',
    width:'100%',
    minWidth:0,
    minHeight:0,
    flexDirection:'column',
    justifyContent:'center',
    padding:compact?(short?'0 14px 4px':'0 18px 8px'):'28px 8px',
    textAlign:compact?'center':'right',
    fontFamily:font,
    direction:'rtl'
   }}>
    <h1 style={{
     margin:'0 0 9px',
     color:'#202024',
     fontFamily:font,
     fontSize:compact?(short?'22px':'clamp(23px,7vw,29px)'):'38px',
     fontWeight:900,
     lineHeight:1.5
    }}>{slide.title}</h1>
    <p style={{
     maxWidth:'500px',
     margin:compact?'0 auto':'0',
     color:'#74757D',
     fontFamily:font,
     fontSize:compact?(short?'12px':'13px'):'16px',
     fontWeight:500,
     lineHeight:compact?1.9:1.95
    }}>{slide.description}</p>

    <div aria-label={`مرحله ${activeIndex} از ${featureSlides.length}`} dir="ltr" style={{
     display:'flex',
     alignItems:'center',
     justifyContent:compact?'center':'flex-start',
     gap:'7px',
     margin:compact?(short?'14px 0 12px':'auto 0 18px'):'34px 0 28px',
     paddingTop:compact&&short?0:'18px',
     direction:'ltr'
    }}>
     {featureSlides.map((item,index)=>{
      const active=activeIndex===index+1;
      return <button
       key={item.id}
       type="button"
       aria-current={active?'step':undefined}
       aria-label={`مرحله ${index+1}`}
       onClick={()=>setActiveIndex(index+1)}
       style={{
        boxSizing:'border-box',
        display:'block',
        width:active?'20px':'7px',
        minWidth:active?'20px':'7px',
        height:'7px',
        margin:0,
        padding:0,
        cursor:'pointer',
        background:active?yellow:'#E3E3E7',
        border:0,
        borderRadius:'999px',
        transition:'width .18s ease, background .18s ease'
       }}
      />
     })}
    </div>

    <footer dir="ltr" style={{
     display:'flex',
     width:'100%',
     maxWidth:'500px',
     alignItems:'center',
     justifyContent:isLast?'stretch':'space-between',
     gap:'14px',
     margin:compact?'0 auto':'0',
     direction:'ltr'
    }}>
     {!isLast&&<button type="button" onClick={skip} style={{
      display:'inline-flex',
      minHeight:'44px',
      alignItems:'center',
      justifyContent:'center',
      margin:0,
      padding:'8px 4px',
      cursor:'pointer',
      color:'#77777E',
      background:'transparent',
      border:0,
      fontFamily:font,
      fontSize:'13px',
      fontWeight:800,
      direction:'rtl'
     }}>رد کردن</button>}
     <button type="button" onClick={next} style={{
      ...primaryButtonStyle,
      direction:'rtl'
     }}>{slide.action}</button>
    </footer>
   </section>
  </section>
 </IrancellIdentityFrame>
}