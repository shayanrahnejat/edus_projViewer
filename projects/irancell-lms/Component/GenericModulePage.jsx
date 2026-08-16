export function IrancellGenericModulePage({title,description,items=[],onNavigate}){
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 return <section dir="rtl" style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,maxWidth:'none',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,250px),1fr))',alignItems:'stretch',gap:'12px',margin:0,padding:0,direction:'rtl',fontFamily:font}}>
  {items.length?items.map((item,index)=>{
   const Icon=item.icon;
   const iconIsRenderable=typeof Icon==='function'||Boolean(Icon&&typeof Icon==='object'&&Icon.$$typeof);
   const actionable=Boolean(item.route);
   return <article key={item.title||index} style={{boxSizing:'border-box',display:'flex',minWidth:0,minHeight:'142px',flexDirection:'column',gap:'14px',margin:0,padding:'17px',color:'#202024',background:'#FFFEFA',border:'1px solid #E7E2CC',borderRadius:'18px',boxShadow:'0 7px 20px rgba(62,52,12,.05)',fontFamily:font}}>
    <div style={{display:'flex',width:'100%',minWidth:0,alignItems:'flex-start',gap:'12px'}}>
     <span aria-hidden="true" style={{display:'grid',width:'46px',minWidth:'46px',height:'46px',placeItems:'center',color:'#202024',background:'#FFF3AE',border:'1px solid #ECD15D',borderRadius:'14px',fontFamily:font,fontSize:'14px',fontWeight:900}}>{iconIsRenderable?React.createElement(Icon,{size:22}):item.icon||IrancellFormatPersianNumber(index+1)}</span>
     <div style={{minWidth:0,flex:1}}>
      <h3 style={{margin:'0 0 5px',overflowWrap:'anywhere',color:'#202024',fontFamily:font,fontSize:'14px',fontWeight:900,lineHeight:1.7}}>{item.title||'بخش بدون عنوان'}</h3>
      <p style={{margin:0,color:'#74757C',fontFamily:font,fontSize:'11px',fontWeight:500,lineHeight:1.9}}>{item.description||'اطلاعات این بخش پس از ثبت داده نمایش داده می‌شود.'}</p>
     </div>
    </div>
    <div style={{display:'flex',width:'100%',minWidth:0,alignItems:'center',justifyContent:'flex-end',marginTop:'auto'}}>
     {actionable?<button type="button" aria-label={`باز کردن ${item.title||'بخش'}`} onClick={()=>onNavigate?.(item.route)} style={{boxSizing:'border-box',display:'inline-flex',minWidth:'88px',minHeight:'38px',alignItems:'center',justifyContent:'center',gap:'6px',margin:0,padding:'8px 13px',cursor:'pointer',color:'#202024',background:'#FFD100',border:'1px solid #E7BD00',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:900}}><span>مشاهده</span><ArrowLeft size={17}/></button>:<small style={{display:'inline-flex',alignItems:'center',minHeight:'28px',padding:'4px 10px',color:'#21663D',background:'#E9F7EE',borderRadius:'999px',fontFamily:font,fontSize:'10px',fontWeight:900}}>آماده</small>}
    </div>
   </article>
  }):<div role="status" style={{boxSizing:'border-box',display:'flex',gridColumn:'1 / -1',width:'100%',minHeight:'240px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'10px',margin:0,padding:'clamp(24px,5vw,42px)',textAlign:'center',color:'#202024',background:'#FFFEFA',border:'1px dashed #D8CE9F',borderRadius:'20px',fontFamily:font}}>
   <span aria-hidden="true" style={{display:'grid',width:'58px',height:'58px',placeItems:'center',color:'#725F00',background:'#FFF3AE',border:'1px solid #ECD15D',borderRadius:'18px'}}><Construction size={30}/></span>
   <h3 style={{margin:0,fontFamily:font,fontSize:'16px',fontWeight:900,lineHeight:1.6}}>{title||'اطلاعاتی وجود ندارد'}</h3>
   <p style={{maxWidth:'460px',margin:0,color:'#74757C',fontFamily:font,fontSize:'12px',lineHeight:1.95}}>{description||'با انجام نخستین اقدام، اطلاعات این بخش نمایش داده می‌شود.'}</p>
  </div>}
 </section>
}