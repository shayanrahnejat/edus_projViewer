export function IrancellIdentitySplashPage({onNavigate}){
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <IrancellIdentityFrame inlineOnly style={{boxSizing:'border-box',display:'grid',width:'100%',minHeight:'100dvh',placeItems:'center',margin:0,padding:'max(24px, env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom))',direction:'rtl',background:'#FFFAE0',fontFamily:font}}>
  <section style={{boxSizing:'border-box',display:'flex',width:'100%',maxWidth:'760px',minHeight:'min(520px,calc(100dvh - 48px))',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'30px',margin:'auto',padding:'32px 20px',textAlign:'center',background:'transparent',border:0,borderRadius:0,boxShadow:'none',fontFamily:font}}>
   <IrancellBrandMark inlineOnly style={{display:'block',width:'clamp(92px,15vw,118px)',height:'auto',margin:0}}/>
   <div style={{display:'flex',width:'100%',flexDirection:'column',alignItems:'center',gap:'8px'}}>
    <h1 style={{margin:0,color:'#202024',fontFamily:font,fontSize:'clamp(28px,4vw,38px)',fontWeight:900,lineHeight:1.55,letterSpacing:'-.025em'}}>دستیار هوشمند آموزشی شما</h1>
    <p style={{maxWidth:'380px',margin:0,color:'#74757D',fontFamily:font,fontSize:'clamp(13px,1.6vw,15px)',fontWeight:500,lineHeight:1.95}}>دستیار هوشمند آموزشی شما برای<br/>یادگیری عمیق‌تر و سریع‌تر</p>
   </div>
   <button type="button" onClick={()=>onNavigate('onboarding')} style={{boxSizing:'border-box',display:'inline-flex',width:'136px',minWidth:'136px',minHeight:'48px',alignItems:'center',justifyContent:'center',margin:'4px 0 0',padding:'11px 22px',cursor:'pointer',color:'#171719',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'999px',boxShadow:'0 10px 24px rgba(120,91,0,.12)',fontFamily:font,fontSize:'13px',fontWeight:900}}>شروع کنید</button>
  </section>
 </IrancellIdentityFrame>
}