export function IrancellModal({open,title,children,onClose,actions,variant='dialog',closeOnBackdrop=true,closeOnEscape=true}){
 const dialogRef=useRef(null);
 const previousFocusRef=useRef(null);
 useEffect(function IrancellModalAccessibilityEffect(){
  if(!open||typeof document==='undefined')return undefined;
  previousFocusRef.current=document.activeElement;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const dialog=dialogRef.current;
  const focusables=()=>Array.from(dialog?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')||[]);
  const first=focusables()[0]||dialog;
  window.setTimeout(()=>first?.focus?.(),0);
  function handleKeyDown(event){
   if(event.key==='Escape'&&closeOnEscape){event.preventDefault();onClose?.();return}
   if(event.key!=='Tab')return;
   const items=focusables();
   if(!items.length){event.preventDefault();dialog?.focus();return}
   const firstItem=items[0],lastItem=items[items.length-1];
   if(event.shiftKey&&document.activeElement===firstItem){event.preventDefault();lastItem.focus()}
   else if(!event.shiftKey&&document.activeElement===lastItem){event.preventDefault();firstItem.focus()}
  }
  document.addEventListener('keydown',handleKeyDown);
  return function IrancellModalAccessibilityCleanup(){document.removeEventListener('keydown',handleKeyDown);document.body.style.overflow=previousOverflow;previousFocusRef.current?.focus?.()}
 },[open,onClose,closeOnEscape]);
 if(!open)return null;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const isSheet=variant==='sheet';
 const isFullscreen=variant==='fullscreen';
 return <div data-ir-modal-inline={variant} role="presentation" onMouseDown={event=>{if(closeOnBackdrop&&event.target===event.currentTarget)onClose?.()}} style={{boxSizing:'border-box',position:'fixed',inset:0,zIndex:2147483600,display:'flex',width:'100%',height:'100dvh',alignItems:isSheet?'flex-end':'center',justifyContent:'center',margin:0,padding:isFullscreen?0:'max(16px, env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom))',overflowY:'auto',background:'rgba(17,17,19,.64)',backdropFilter:'blur(5px)',WebkitBackdropFilter:'blur(5px)',fontFamily:font}}><section ref={dialogRef} role="dialog" aria-modal="true" aria-label={title||'پنجره'} tabIndex={-1} dir="rtl" style={{boxSizing:'border-box',position:'relative',display:'flex',width:'100%',maxWidth:isFullscreen?'none':isSheet?'680px':'620px',height:isFullscreen?'100dvh':'auto',maxHeight:isFullscreen?'100dvh':'calc(100dvh - 32px)',minWidth:0,flexDirection:'column',margin:0,padding:0,overflow:'hidden',direction:'rtl',color:'#202024',background:'#FFFFFF',border:isFullscreen?0:'1px solid rgba(255,255,255,.7)',borderRadius:isFullscreen?0:isSheet?'28px 28px 0 0':'26px',boxShadow:isFullscreen?'none':'0 30px 90px rgba(0,0,0,.32)',outline:'none',fontFamily:font}}><header style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,alignItems:'center',justifyContent:'space-between',gap:'12px',margin:0,padding:'18px 20px',borderBottom:'1px solid #E7E7EA',fontFamily:font}}><h2 style={{minWidth:0,margin:0,color:'#202024',fontFamily:font,fontSize:'19px',fontWeight:900,lineHeight:1.55}}>{title}</h2>{onClose&&<button type="button" onClick={onClose} aria-label="بستن" style={{boxSizing:'border-box',display:'grid',width:'40px',minWidth:'40px',height:'40px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:'#3F4046',background:'#F2F2F4',border:'1px solid #E2E2E6',borderRadius:'12px',fontFamily:font}}><X size={20}/></button>}</header><div style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,maxWidth:'none',minHeight:0,flex:'1 1 auto',padding:'20px',overflowY:'auto',overscrollBehaviorY:'contain',fontFamily:font}}>{children}</div>{actions&&<footer style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'center',justifyContent:'flex-end',gap:'10px',margin:0,padding:'14px 20px calc(14px + env(safe-area-inset-bottom))',background:'#FFFFFF',borderTop:'1px solid #E7E7EA',fontFamily:font}}>{actions}</footer>}</section></div>
}