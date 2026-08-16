// Root import/export boundary for irancell-lms/Component.
// External and cross-repository dependencies are imported once for the merged EDUS scope.
import {IRANCELL_ROLE_LABELS,IRANCELL_ROLE_NAVIGATION,IrancellFormatCurrency,IrancellFormatPersianNumber,IrancellUseStore as useIrancellStore} from 'irancell-lms/Core';

const {useEffect,useRef,useState}=React;

const IRANCELL_COMPONENT_INLINE_RUNTIME_VERSION='component-inline-v4-vazirmatn';
const IRANCELL_COMPONENT_INLINE_FONT='"Vazirmatn",Tahoma,Arial,sans-serif';
const IRANCELL_COMPONENT_INLINE_STATE_TOKENS=new Set(['is-active','is-selected','is-on','is-disabled','is-full-bleed','is-passed','is-blocked','is-uploading','is-success','is-failed','is-image','is-file','is-cancel','is-external-trigger','has-error','has-rows','is-empty','primary']);

function IrancellComponentIsInlineOwnedToken(token){
 return token==='material-symbols-outlined'
  ||token==='ir-icon'
  ||token==='ir-spinner'
  ||token==='ir-progress'
  ||token==='ir-check'
  ||token==='ir-page-header'
  ||token==='ir-section-title'
  ||token==='ir-trust-strip'
  ||token==='ir-gate-list'
  ||token==='ir-onboarding-svg'
  ||token.startsWith('ir-button')
  ||token.startsWith('ir-badge')
  ||token.startsWith('ir-card')
  ||token.startsWith('ir-stat')
  ||token.startsWith('ir-brand-mark')
  ||token.startsWith('ir-identity-')
  ||token.startsWith('ir-content-card')
  ||token.startsWith('ir-form')
  ||token.startsWith('ir-generic-')
  ||token.startsWith('ir-field')
  ||token.startsWith('ir-provider-card')
  ||token.startsWith('ir-offer-card')
  ||token.startsWith('ir-modal')
  ||token.startsWith('ir-state')
  ||token.startsWith('ir-skeleton')
  ||token.startsWith('ir-ui-')
  ||token.startsWith('ir-table')
  ||token.startsWith('ir-uploader')
  ||token.startsWith('ir-shared-file-uploader')
  ||token.startsWith('ir-shared-attachment')
  ||token.startsWith('ir-chisti-attachment');
}

function IrancellComponentAssignInlineStyle(element,style){
 if(!element||!style)return;
 Object.entries(style).forEach(([property,value])=>{
  if(value!==undefined&&value!==null)element.style[property]=String(value)
 })
}

function IrancellComponentAssignInlineChildren(element,selector,style){
 Array.from(element.querySelectorAll(selector)).forEach(child=>IrancellComponentAssignInlineStyle(child,style))
}

function IrancellComponentInlineButtonBase(){
 return{
  boxSizing:'border-box',
  appearance:'none',
  WebkitAppearance:'none',
  display:'inline-flex',
  minWidth:'0',
  minHeight:'44px',
  alignItems:'center',
  justifyContent:'center',
  gap:'8px',
  margin:'0',
  padding:'0 18px',
  direction:'rtl',
  fontFamily:IRANCELL_COMPONENT_INLINE_FONT,
  fontSize:'12px',
  fontWeight:'900',
  lineHeight:'1.4',
  textAlign:'center',
  textDecoration:'none',
  whiteSpace:'nowrap',
  cursor:'pointer',
  border:'0',
  borderRadius:'13px',
  boxShadow:'none',
  visibility:'visible',
  opacity:'1',
  pointerEvents:'auto',
  outlineOffset:'3px'
 }
}

function IrancellComponentInlineFieldControlStyle(error=false){
 return{
  boxSizing:'border-box',
  display:'block',
  width:'100%',
  minWidth:'0',
  minHeight:'48px',
  margin:'0',
  padding:'10px 13px',
  direction:'rtl',
  color:'#202024',
  background:'#fff',
  border:error?'1px solid #d94747':'1px solid #ded8bd',
  borderRadius:'13px',
  boxShadow:error?'0 0 0 3px rgba(217,71,71,.08)':'none',
  fontFamily:IRANCELL_COMPONENT_INLINE_FONT,
  fontSize:'12px',
  fontWeight:'600',
  lineHeight:'1.6',
  outline:'none'
 }
}

function IrancellComponentResolveInlineTokens(element){
 const liveTokens=String(element.getAttribute('class')||'').split(/\s+/).filter(Boolean);
 const storedTokens=String(element.getAttribute('data-ir-inline-component-tokens')||'').split(/\s+/).filter(Boolean);
 const liveOwned=liveTokens.filter(token=>IrancellComponentIsInlineOwnedToken(token));
 const hasLiveOwner=liveOwned.length>0;
 const tokens=hasLiveOwner
  ?liveTokens.filter(token=>IrancellComponentIsInlineOwnedToken(token)||IRANCELL_COMPONENT_INLINE_STATE_TOKENS.has(token))
  :storedTokens;
 if(!tokens.length)return null;
 if(hasLiveOwner)element.setAttribute('data-ir-inline-component-tokens',tokens.join(' '));
 return{tokens,liveTokens,hasLiveOwner}
}

function IrancellComponentApplyInlineAppearance(element){
 if(!(element instanceof Element))return;
 const resolved=IrancellComponentResolveInlineTokens(element);
 if(!resolved)return;
 const{tokens,liveTokens,hasLiveOwner}=resolved;
 const has=token=>tokens.includes(token);
 const hasPrefix=prefix=>tokens.some(token=>token.startsWith(prefix));
 const disabled=Boolean(element.disabled||has('is-disabled'));
 const active=has('is-active')||has('is-selected')||has('is-on');
 const error=has('has-error');

 IrancellComponentAssignInlineStyle(element,{
  boxSizing:'border-box',
  fontFamily:IRANCELL_COMPONENT_INLINE_FONT
 });

 if(has('material-symbols-outlined')||has('ir-icon')){
  const size=element.style.fontSize||element.getAttribute('data-size')||'20px';
  IrancellComponentAssignInlineStyle(element,{
   display:'inline-flex',
   width:size,
   minWidth:size,
   height:size,
   alignItems:'center',
   justifyContent:'center',
   overflow:'hidden',
   fontFamily:'"Material Symbols Outlined"',
   fontSize:size,
   fontWeight:'normal',
   fontStyle:'normal',
   lineHeight:'1',
   letterSpacing:'normal',
   textTransform:'none',
   whiteSpace:'nowrap',
   wordWrap:'normal',
   direction:'ltr',
   WebkitFontFeatureSettings:'liga',
   WebkitFontSmoothing:'antialiased',
   fontVariationSettings:"'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
   pointerEvents:'none'
  })
 }

 if(has('ir-button')){
  const primary=has('ir-button--primary');
  const secondary=has('ir-button--secondary');
  const danger=has('ir-button--danger');
  const ghost=has('ir-button--ghost');
  const small=has('ir-button--sm');
  const large=has('ir-button--lg');
  IrancellComponentAssignInlineStyle(element,{
   ...IrancellComponentInlineButtonBase(),
   width:has('ir-button--block')?'100%':has('ir-button--icon')?(small?'38px':large?'52px':'44px'):'auto',
   minWidth:has('ir-button--icon')?(small?'38px':large?'52px':'44px'):'0',
   height:small?'38px':large?'52px':'44px',
   minHeight:small?'38px':large?'52px':'44px',
   padding:has('ir-button--icon')?'0':small?'0 13px':large?'0 22px':'0 18px',
   color:danger?'#fff':primary?'#171719':ghost?'#55575f':'#202024',
   background:danger?'#c93636':primary?'#ffd100':ghost?'transparent':secondary?'#fff':'#fff',
   border:ghost?'1px solid transparent':secondary?'1px solid #dcd5b8':'0',
   borderRadius:small?'11px':large?'15px':'13px',
   boxShadow:primary?'0 8px 20px rgba(190,145,0,.14)':secondary?'0 5px 14px rgba(17,17,17,.05)':'none',
   fontSize:small?'11px':large?'14px':'12px',
   opacity:disabled?'0.5':'1',
   cursor:disabled?'not-allowed':'pointer',
   pointerEvents:disabled?'none':'auto'
  });
  IrancellComponentAssignInlineChildren(element,':scope>span:not(.material-symbols-outlined)',{display:'block',minWidth:'0',overflow:'hidden',textOverflow:'ellipsis'})
 }

 if(has('ir-spinner')){
  IrancellComponentAssignInlineStyle(element,{
   display:'inline-block',
   width:'18px',
   minWidth:'18px',
   height:'18px',
   border:'2px solid rgba(32,32,36,.24)',
   borderTopColor:'#202024',
   borderRadius:'50%'
  })
 }

 if(hasPrefix('ir-badge')){
  const success=has('ir-badge--success');
  const danger=has('ir-badge--danger');
  const warning=has('ir-badge--warning');
  const info=has('ir-badge--info');
  IrancellComponentAssignInlineStyle(element,{
   display:'inline-flex',
   minWidth:'0',
   minHeight:'26px',
   alignItems:'center',
   justifyContent:'center',
   padding:'4px 9px',
   color:success?'#176b43':danger?'#a32929':warning?'#765900':info?'#245f92':'#5f6068',
   background:success?'#e5f7ed':danger?'#ffeded':warning?'#fff4c6':info?'#eaf4ff':'#f1f1f3',
   border:success?'1px solid #bce7ce':danger?'1px solid #f3c8c8':warning?'1px solid #ebd983':info?'1px solid #c7dff5':'1px solid #e1e1e5',
   borderRadius:'999px',
   fontSize:'9px',
   fontWeight:'900',
   lineHeight:'1.4',
   whiteSpace:'nowrap'
  })
 }

 if(has('ir-card')){
  IrancellComponentAssignInlineStyle(element,{
   display:'block',
   width:'100%',
   minWidth:'0',
   margin:'0',
   padding:'0',
   overflow:'hidden',
   color:'#202024',
   background:'#fff',
   border:'1px solid #e7e1c5',
   borderRadius:'20px',
   boxShadow:'0 10px 30px rgba(17,17,17,.07)'
  })
 }

 if(has('ir-card__header')){
  IrancellComponentAssignInlineStyle(element,{
   display:'flex',
   width:'100%',
   minWidth:'0',
   alignItems:'center',
   justifyContent:'space-between',
   gap:'14px',
   padding:'18px 20px 14px',
   borderBottom:'1px solid #eee8cf'
  });
  IrancellComponentAssignInlineChildren(element,'h2',{margin:'0',color:'#202024',fontSize:'15px',fontWeight:'900',lineHeight:'1.6'});
  IrancellComponentAssignInlineChildren(element,'p',{margin:'3px 0 0',color:'#7c7d84',fontSize:'11px',lineHeight:'1.8'})
 }

 if(has('ir-card__body'))IrancellComponentAssignInlineStyle(element,{display:'block',width:'100%',minWidth:'0',padding:'18px 20px'});

 if(hasPrefix('ir-stat')){
  const success=has('ir-stat--success');
  const danger=has('ir-stat--danger');
  const warning=has('ir-stat--warning');
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:'100%',
   minWidth:'0',
   minHeight:'104px',
   gridTemplateColumns:'44px minmax(0,1fr)',
   alignItems:'center',
   gap:'13px',
   padding:'16px',
   color:'#202024',
   background:success?'#effaf3':danger?'#fff1f1':warning?'#fff8d8':'#fff',
   border:success?'1px solid #ccebd8':danger?'1px solid #f0cccc':warning?'1px solid #eadb91':'1px solid #e7e1c5',
   borderRadius:'18px',
   boxShadow:'0 8px 24px rgba(17,17,17,.05)'
  });
  IrancellComponentAssignInlineChildren(element,':scope>div',{display:'flex',minWidth:'0',flexDirection:'column',gap:'3px'});
  IrancellComponentAssignInlineChildren(element,'small',{color:'#7b7c84',fontSize:'10px',fontWeight:'700'});
  IrancellComponentAssignInlineChildren(element,'strong',{color:'#202024',fontSize:'20px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,'em',{color:success?'#177044':danger?'#a32929':'#8b6a00',fontSize:'9px',fontStyle:'normal',fontWeight:'800'})
 }

 if(has('ir-stat__icon')){
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:'44px',
   minWidth:'44px',
   height:'44px',
   placeItems:'center',
   color:'#202024',
   background:'#ffd100',
   borderRadius:'14px'
  })
 }

 if(has('ir-identity-frame')){
  IrancellComponentAssignInlineStyle(element,{
   display:'flex',
   width:'100%',
   minWidth:'0',
   minHeight:'100dvh',
   flexDirection:'column',
   alignItems:'center',
   justifyContent:'center',
   margin:'0',
   padding:'24px 16px',
   direction:'rtl',
   color:'#202024',
   background:'#fffae0'
  })
 }

 if(hasPrefix('ir-brand-mark')){
  IrancellComponentAssignInlineStyle(element,{
   display:'block',
   width:has('is-compact')?'52px':'min(180px,48vw)',
   minWidth:has('is-compact')?'52px':'0',
   maxWidth:has('is-compact')?'52px':'180px',
   height:'auto',
   margin:'0',
   overflow:'visible'
  })
 }

 if(has('ir-identity-profile')){
  IrancellComponentAssignInlineStyle(element,{
   display:'flex',
   width:'100%',
   minWidth:'0',
   flexDirection:'column',
   alignItems:'center',
   gap:'8px',
   margin:'0',
   padding:'0',
   textAlign:'center'
  });
  IrancellComponentAssignInlineChildren(element,'h1',{margin:'4px 0 0',color:'#202024',fontSize:'22px',fontWeight:'900',lineHeight:'1.5'});
  IrancellComponentAssignInlineChildren(element,'p',{maxWidth:'340px',margin:'0',color:'#777982',fontSize:'12px',lineHeight:'1.9'});
  IrancellComponentAssignInlineChildren(element,':scope>small',{display:'inline-flex',alignItems:'center',gap:'5px',color:'#777982',fontSize:'9px',fontWeight:'700'})
 }

 if(has('ir-identity-avatar')){
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:'84px',
   minWidth:'84px',
   height:'84px',
   placeItems:'center',
   overflow:'hidden',
   background:'#ffd100',
   border:'4px solid #fff',
   borderRadius:'50%',
   boxShadow:'0 9px 25px rgba(17,17,17,.13)'
  });
  IrancellComponentAssignInlineChildren(element,'img',{display:'block',width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'})
 }

 if(has('ir-identity-auth-tabs')){
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:'100%',
   minWidth:'0',
   height:'48px',
   gridTemplateColumns:'repeat(2,minmax(0,1fr))',
   gap:'4px',
   padding:'4px',
   background:'#f0ebd3',
   borderRadius:'14px'
  });
  Array.from(element.children).forEach(button=>{
   const selected=button.classList.contains('is-active')||button.getAttribute('aria-selected')==='true';
   IrancellComponentAssignInlineStyle(button,{
    ...IrancellComponentInlineButtonBase(),
    width:'100%',
    height:'40px',
    minHeight:'40px',
    padding:'0 10px',
    color:selected?'#171719':'#74757c',
    background:selected?'#fff':'transparent',
    border:'0',
    borderRadius:'11px',
    boxShadow:selected?'0 5px 13px rgba(17,17,17,.08)':'none',
    fontSize:'11px'
   })
  })
 }

 if(hasPrefix('ir-identity-info')){
  const dark=has('ir-identity-info--dark');
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:'100%',
   minWidth:'0',
   gridTemplateColumns:'20px minmax(0,1fr)',
   alignItems:'start',
   gap:'9px',
   padding:'11px 13px',
   color:dark?'#fff':'#635113',
   background:dark?'#242429':'#fff7cc',
   border:dark?'1px solid #35353b':'1px solid #eadb88',
   borderRadius:'13px',
   fontSize:'10px',
   fontWeight:'700',
   lineHeight:'1.8'
  })
 }

 if(has('ir-identity-linked-account')){
  IrancellComponentAssignInlineStyle(element,{
   display:'inline-flex',
   alignItems:'center',
   gap:'6px',
   padding:'7px 10px',
   color:'#606169',
   background:'#f5f5f6',
   border:'1px solid #e4e4e7',
   borderRadius:'999px',
   fontSize:'9px',
   fontWeight:'800'
  })
 }

 if(hasPrefix('ir-identity-security-badge')){
  const large=has('ir-identity-security-badge--lg');
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:large?'52px':'42px',
   minWidth:large?'52px':'42px',
   height:large?'52px':'42px',
   placeItems:'center',
   color:'#202024',
   background:'#ffd100',
   borderRadius:'50%'
  })
 }

 if(has('ir-onboarding-svg')){
  IrancellComponentAssignInlineStyle(element,{
   display:'block',
   width:'100%',
   minWidth:'0',
   maxWidth:'560px',
   height:'auto',
   maxHeight:'42dvh',
   margin:'0 auto',
   objectFit:'contain'
  })
 }

 if(has('ir-content-card')){
  IrancellComponentAssignInlineStyle(element,{
   display:'grid',
   width:'100%',
   minWidth:'0',
   gridTemplateColumns:'minmax(150px,32%) minmax(0,1fr)',
   gap:'0',
   overflow:'hidden',
   color:'#202024',
   background:'#fff',
   border:'1px solid #e7e1c5',
   borderRadius:'19px',
   boxShadow:'0 9px 26px rgba(17,17,17,.06)',
   cursor:'pointer',
   outlineOffset:'3px'
  })
 }

 if(has('ir-content-card__cover')){
  IrancellComponentAssignInlineStyle(element,{
   position:'relative',
   display:'grid',
   minHeight:'160px',
   placeItems:'center',
   color:'#202024',
   background:'linear-gradient(145deg,#ffd100,#ffe777)'
  });
  IrancellComponentAssignInlineChildren(element,':scope>span',{position:'absolute',right:'9px',bottom:'9px',padding:'4px 7px',color:'#fff',background:'rgba(23,23,25,.78)',borderRadius:'999px',fontSize:'8px',fontWeight:'800'})
 }

 if(has('ir-content-card__body')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',minWidth:'0',flexDirection:'column',gap:'7px',padding:'16px'});
  IrancellComponentAssignInlineChildren(element,':scope>small',{color:'#85868d',fontSize:'9px',fontWeight:'700'});
  IrancellComponentAssignInlineChildren(element,'h3',{margin:'0',color:'#202024',fontSize:'14px',fontWeight:'900',lineHeight:'1.6'});
  IrancellComponentAssignInlineChildren(element,'p',{margin:'0',overflow:'hidden',color:'#74757d',fontSize:'10px',lineHeight:'1.8'})
 }

 if(has('ir-content-card__meta')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px 12px',marginTop:'auto'});
  IrancellComponentAssignInlineChildren(element,':scope>span',{display:'inline-flex',alignItems:'center',gap:'4px',color:'#696a72',fontSize:'9px',fontWeight:'700'})
 }

 if(has('ir-progress')){
  IrancellComponentAssignInlineStyle(element,{position:'relative',display:'block',width:'100%',height:'7px',marginTop:'7px',overflow:'visible',background:'#ececef',borderRadius:'999px'});
  const bar=element.querySelector(':scope>span');
  if(bar)IrancellComponentAssignInlineStyle(bar,{display:'block',height:'100%',background:'#ffd100',borderRadius:'inherit'});
  const label=element.querySelector(':scope>small');
  if(label)IrancellComponentAssignInlineStyle(label,{position:'absolute',left:'0',bottom:'10px',color:'#66676e',fontSize:'8px',fontWeight:'800'})
 }

 if(has('ir-form'))IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',flexDirection:'column',gap:'15px',margin:'0'});

 if(has('ir-form__actions'))IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-end',gap:'9px',marginTop:'5px'});

 if(has('ir-check')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',alignItems:'center',gap:'9px',color:'#404148',fontSize:'11px',fontWeight:'700',cursor:'pointer'});
  IrancellComponentAssignInlineChildren(element,'input',{width:'18px',minWidth:'18px',height:'18px',accentColor:'#ffd100'})
 }

 if(has('ir-field')||has('ir-identity-password-field')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',flexDirection:'column',gap:'7px',color:'#383940',fontSize:'11px',fontWeight:'800'});
  IrancellComponentAssignInlineChildren(element,':scope>span',{display:'block',fontSize:'11px',fontWeight:'800'});
  IrancellComponentAssignInlineChildren(element,':scope>span>b',{marginRight:'3px',color:'#c93636'});
  IrancellComponentAssignInlineChildren(element,':scope>input,:scope>select,:scope>textarea',IrancellComponentInlineFieldControlStyle(error));
  IrancellComponentAssignInlineChildren(element,':scope>textarea',{minHeight:'110px',resize:'vertical'});
  IrancellComponentAssignInlineChildren(element,':scope>small',{color:error?'#b52f2f':'#84858c',fontSize:'9px',fontWeight:error?'800':'600',lineHeight:'1.7'})
 }

 if(has('ir-identity-password-control')){
  IrancellComponentAssignInlineStyle(element,{position:'relative',display:'block',width:'100%',minWidth:'0'});
  IrancellComponentAssignInlineChildren(element,'input',{...IrancellComponentInlineFieldControlStyle(error),paddingLeft:'48px'});
  IrancellComponentAssignInlineChildren(element,'button',{...IrancellComponentInlineButtonBase(),position:'absolute',top:'50%',left:'5px',width:'38px',minWidth:'38px',height:'38px',minHeight:'38px',padding:'0',color:'#707179',background:'transparent',transform:'translateY(-50%)'})
 }

 if(hasPrefix('ir-identity-password-eye')){
  IrancellComponentAssignInlineStyle(element,{display:'block',width:'18px',height:'18px',border:has('is-visible')?'2px solid #202024':'2px solid #777982',borderRadius:'50%',transform:has('is-visible')?'scale(.72)':'scale(1)'})
 }

 if(has('ir-identity-otp-group'))IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',flexDirection:'column',gap:'7px'});

 if(has('ir-identity-otp-fields')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',gridTemplateColumns:`repeat(${Math.max(1,element.children.length)},minmax(0,1fr))`,gap:'7px',direction:'ltr'});
  Array.from(element.children).forEach(input=>IrancellComponentAssignInlineStyle(input,{...IrancellComponentInlineFieldControlStyle(error),height:'52px',minHeight:'52px',padding:'0',direction:'rtl',fontSize:'19px',fontWeight:'900',textAlign:'center'}))
 }

 if(has('ir-generic-grid')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'13px'});
  Array.from(element.children).forEach(article=>{
   IrancellComponentAssignInlineStyle(article,{display:'grid',minWidth:'0',gridTemplateColumns:'44px minmax(0,1fr) 36px',alignItems:'center',gap:'11px',padding:'15px',color:'#202024',background:'#fff',border:'1px solid #e7e1c5',borderRadius:'17px',boxShadow:'0 7px 22px rgba(17,17,17,.05)'});
   IrancellComponentAssignInlineChildren(article,'h3',{margin:'0',fontSize:'12px',fontWeight:'900',lineHeight:'1.6'});
   IrancellComponentAssignInlineChildren(article,'p',{margin:'3px 0 0',color:'#777982',fontSize:'9px',lineHeight:'1.7'});
   IrancellComponentAssignInlineChildren(article,':scope>button',{...IrancellComponentInlineButtonBase(),width:'36px',minWidth:'36px',height:'36px',minHeight:'36px',padding:'0',color:'#202024',background:'#ffd100',borderRadius:'11px'})
  })
 }

 if(has('ir-generic-grid__icon')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'44px',minWidth:'44px',height:'44px',placeItems:'center',color:'#202024',background:'#fff4b8',borderRadius:'14px',fontSize:'12px',fontWeight:'900'})
 }

 if(has('ir-generic-grid__status'))IrancellComponentAssignInlineStyle(element,{color:'#25704c',fontSize:'8px',fontWeight:'900',textAlign:'center'});

 if(has('ir-generic-empty')||hasPrefix('ir-state')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',minHeight:'190px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'9px',padding:'24px',color:'#202024',background:'#fff',border:'1px dashed #dcd4b4',borderRadius:'18px',textAlign:'center'});
  IrancellComponentAssignInlineChildren(element,'h3',{margin:'0',fontSize:'14px',fontWeight:'900',lineHeight:'1.6'});
  IrancellComponentAssignInlineChildren(element,'p',{maxWidth:'440px',margin:'0',color:'#777982',fontSize:'10px',lineHeight:'1.8'})
 }

 if(has('ir-state__fallback-icon')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'42px',height:'42px',placeItems:'center',color:'#202024',background:'#ffd100',borderRadius:'50%',fontSize:'18px',fontWeight:'900'})
 }

 if(has('ir-provider-card')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'58px minmax(0,1fr) auto',alignItems:'center',gap:'14px',padding:'16px',color:'#202024',background:'#fff',border:'1px solid #e7e1c5',borderRadius:'19px',boxShadow:'0 8px 25px rgba(17,17,17,.06)'})
 }

 if(has('ir-provider-card__avatar')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'58px',minWidth:'58px',height:'58px',placeItems:'center',color:'#202024',background:'#ffd100',borderRadius:'17px'})
 }

 if(has('ir-provider-card__main'))IrancellComponentAssignInlineStyle(element,{display:'flex',minWidth:'0',flexDirection:'column',gap:'5px'});

 if(has('ir-provider-card__title')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'7px'});
  IrancellComponentAssignInlineChildren(element,'h3',{margin:'0',fontSize:'13px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,'span',{display:'inline-flex',alignItems:'center',gap:'3px',color:'#1b7047',fontSize:'8px',fontWeight:'900'})
 }

 if(has('ir-provider-card__meta')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px 12px'});
  IrancellComponentAssignInlineChildren(element,'span',{display:'inline-flex',alignItems:'center',gap:'4px',color:'#707179',fontSize:'9px',fontWeight:'700'})
 }

 if(has('ir-provider-card__actions')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',flexDirection:'column',gap:'7px'});
  Array.from(element.children).forEach(button=>IrancellComponentAssignInlineStyle(button,{...IrancellComponentInlineButtonBase(),height:'38px',minHeight:'38px',padding:'0 12px',color:button.classList.contains('primary')?'#171719':'#5d5e66',background:button.classList.contains('primary')?'#ffd100':'#f5f5f6',border:'1px solid #e3e3e6',borderRadius:'11px',fontSize:'9px'}))
 }

 if(hasPrefix('ir-offer-card')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',flexDirection:'column',gap:'13px',padding:'16px',color:'#202024',background:active?'#fff9d9':'#fff',border:active?'2px solid #ffd100':'1px solid #e7e1c5',borderRadius:'18px',boxShadow:'0 8px 24px rgba(17,17,17,.05)'});
  IrancellComponentAssignInlineChildren(element,':scope>header',{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'});
  IrancellComponentAssignInlineChildren(element,'h3',{margin:'0',fontSize:'13px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,'p',{margin:'3px 0 0',color:'#777982',fontSize:'9px',lineHeight:'1.7'});
  IrancellComponentAssignInlineChildren(element,':scope>button',{...IrancellComponentInlineButtonBase(),width:'100%',height:'42px',minHeight:'42px',color:'#171719',background:'#ffd100',borderRadius:'12px'})
 }

 if(has('ir-offer-card__details')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px 14px',padding:'11px',background:'#f7f7f8',borderRadius:'12px'});
  IrancellComponentAssignInlineChildren(element,'span',{display:'inline-flex',alignItems:'center',gap:'4px',color:'#66676f',fontSize:'9px'});
  IrancellComponentAssignInlineChildren(element,'strong',{marginRight:'auto',color:'#202024',fontSize:'12px',fontWeight:'900'})
 }

 if(hasPrefix('ir-modal-backdrop')){
  IrancellComponentAssignInlineStyle(element,{position:'fixed',inset:'0',zIndex:'2147483200',display:'grid',width:'100%',height:'100%',placeItems:has('ir-modal-backdrop--sheet')?'end center':'center',padding:has('ir-modal-backdrop--sheet')?'0':'18px',background:'rgba(17,17,20,.48)',backdropFilter:'blur(5px)',WebkitBackdropFilter:'blur(5px)'})
 }

 if(hasPrefix('ir-modal')&&!hasPrefix('ir-modal-backdrop')&&!has('ir-modal__body')){
  const sheet=has('ir-modal--sheet');
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:sheet?'100%':'min(520px,100%)',minWidth:'0',maxWidth:sheet?'680px':'520px',maxHeight:sheet?'88dvh':'calc(100dvh - 36px)',flexDirection:'column',overflow:'hidden',color:'#202024',background:'#fff',border:'1px solid #e5dec1',borderRadius:sheet?'24px 24px 0 0':'21px',boxShadow:'0 28px 80px rgba(17,17,17,.24)',outline:'none'});
  IrancellComponentAssignInlineChildren(element,':scope>header',{display:'grid',gridTemplateColumns:'minmax(0,1fr) 40px',alignItems:'center',gap:'10px',padding:'16px 18px',borderBottom:'1px solid #eee8d0'});
  IrancellComponentAssignInlineChildren(element,':scope>header h2',{margin:'0',fontSize:'15px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,':scope>header button',{...IrancellComponentInlineButtonBase(),width:'40px',minWidth:'40px',height:'40px',minHeight:'40px',padding:'0',color:'#55565e',background:'#f3f3f5',borderRadius:'12px'});
  IrancellComponentAssignInlineChildren(element,':scope>footer',{display:'flex',flexWrap:'wrap',justifyContent:'flex-end',gap:'9px',padding:'13px 18px',borderTop:'1px solid #eee8d0'})
 }

 if(has('ir-modal__body'))IrancellComponentAssignInlineStyle(element,{display:'block',width:'100%',minWidth:'0',padding:'18px',overflowY:'auto'});

 if(has('ir-page-header')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',flexDirection:'column',gap:'10px',padding:'4px 0 16px'});
  IrancellComponentAssignInlineChildren(element,':scope>nav',{color:'#898a91',fontSize:'9px',fontWeight:'700'});
  IrancellComponentAssignInlineChildren(element,':scope>div',{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'16px'});
  IrancellComponentAssignInlineChildren(element,'h1',{margin:'0',color:'#202024',fontSize:'23px',fontWeight:'900',lineHeight:'1.45'});
  IrancellComponentAssignInlineChildren(element,'p',{maxWidth:'650px',margin:'5px 0 0',color:'#74757d',fontSize:'11px',lineHeight:'1.8'})
 }

 if(has('ir-skeleton')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',flexDirection:'column',gap:'9px',padding:'14px'});
  Array.from(element.children).forEach((line,index)=>IrancellComponentAssignInlineStyle(line,{display:'block',width:index===element.children.length-1?'62%':'100%',height:'12px',background:'linear-gradient(90deg,#ececef,#f7f7f8,#ececef)',borderRadius:'999px'}))
 }

 if(has('ir-section-title')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',alignItems:'flex-end',justifyContent:'space-between',gap:'14px',margin:'0 0 12px'});
  IrancellComponentAssignInlineChildren(element,'h2',{margin:'0',color:'#202024',fontSize:'16px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,'p',{margin:'4px 0 0',color:'#777982',fontSize:'10px',lineHeight:'1.7'})
 }

 if(hasPrefix('ir-ui-page-scaffold')&&!has('ir-ui-page-scaffold__header')&&!has('ir-ui-page-scaffold__content')&&!has('ir-ui-page-scaffold__back')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',minHeight:'100%',flexDirection:'column',gap:'16px',margin:'0',padding:has('is-full-bleed')?'0':'clamp(14px,3vw,28px)',direction:'rtl',color:'#202024',background:'#fffae0'})
 }

 if(has('ir-ui-page-scaffold__header')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'44px minmax(0,1fr) auto',alignItems:'center',gap:'12px',padding:'0 0 13px',borderBottom:'1px solid rgba(222,214,179,.7)'});
  IrancellComponentAssignInlineChildren(element,'h1',{margin:'0',fontSize:'18px',fontWeight:'900',lineHeight:'1.5'});
  IrancellComponentAssignInlineChildren(element,'p',{margin:'3px 0 0',color:'#777982',fontSize:'10px',lineHeight:'1.7'})
 }

 if(has('ir-ui-page-scaffold__back')){
  IrancellComponentAssignInlineStyle(element,{...IrancellComponentInlineButtonBase(),width:'44px',minWidth:'44px',height:'44px',minHeight:'44px',padding:'0',color:'#202024',background:'#fff',border:'1px solid #e5dec1',borderRadius:'13px'})
 }

 if(has('ir-ui-page-scaffold__content'))IrancellComponentAssignInlineStyle(element,{display:'block',width:'100%',minWidth:'0',flex:'1 1 auto'});

 if(has('ir-ui-filter-tabs')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',gap:'6px',padding:'4px',overflowX:'auto',background:'#efead1',borderRadius:'14px'});
  Array.from(element.children).forEach(button=>{
   const selected=button.classList.contains('is-active')||button.getAttribute('aria-pressed')==='true';
   IrancellComponentAssignInlineStyle(button,{...IrancellComponentInlineButtonBase(),height:'39px',minHeight:'39px',flex:'0 0 auto',padding:'0 13px',color:selected?'#171719':'#6f7078',background:selected?'#fff':'transparent',border:'0',borderRadius:'11px',boxShadow:selected?'0 4px 12px rgba(17,17,17,.07)':'none',fontSize:'10px'});
   IrancellComponentAssignInlineChildren(button,'b',{display:'grid',minWidth:'20px',height:'20px',placeItems:'center',padding:'0 4px',background:selected?'#ffd100':'#ded9c2',borderRadius:'999px',fontSize:'8px'})
  })
 }

 if(hasPrefix('ir-ui-toggle-row')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'minmax(0,1fr) 48px',alignItems:'center',gap:'14px',padding:'13px 0',opacity:disabled?'0.55':'1'});
  IrancellComponentAssignInlineChildren(element,':scope>div',{display:'flex',minWidth:'0',flexDirection:'column',gap:'3px'});
  IrancellComponentAssignInlineChildren(element,'strong',{fontSize:'11px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,'small',{color:'#7a7b83',fontSize:'9px',lineHeight:'1.7'});
  const toggle=element.querySelector(':scope>button');
  if(toggle){
   const checked=toggle.classList.contains('is-on')||toggle.getAttribute('aria-checked')==='true';
   IrancellComponentAssignInlineStyle(toggle,{...IrancellComponentInlineButtonBase(),position:'relative',width:'48px',minWidth:'48px',height:'28px',minHeight:'28px',padding:'0',background:checked?'#ffd100':'#d9d9de',border:'0',borderRadius:'999px'});
   const knob=toggle.querySelector(':scope>span');
   if(knob)IrancellComponentAssignInlineStyle(knob,{position:'absolute',top:'4px',right:checked?'24px':'4px',display:'block',width:'20px',height:'20px',background:'#fff',borderRadius:'50%',boxShadow:'0 2px 6px rgba(17,17,17,.2)',transition:'right .18s ease'})
  }
 }

 if(hasPrefix('ir-ui-status-banner')){
  const success=has('is-success');
  const danger=has('is-danger');
  const warning=has('is-warning');
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'24px minmax(0,1fr) auto',alignItems:'start',gap:'10px',padding:'13px 14px',color:danger?'#8d2424':success?'#17633e':warning?'#705600':'#245d89',background:danger?'#fff0f0':success?'#eaf8f0':warning?'#fff7d3':'#eef7ff',border:danger?'1px solid #f0caca':success?'1px solid #c6e8d4':warning?'1px solid #eadb94':'1px solid #cce2f4',borderRadius:'14px'});
  IrancellComponentAssignInlineChildren(element,'strong',{display:'block',fontSize:'11px',fontWeight:'900'});
  IrancellComponentAssignInlineChildren(element,'p',{margin:'3px 0 0',fontSize:'9px',lineHeight:'1.8'})
 }

 if(has('ir-ui-status-banner__action'))IrancellComponentAssignInlineStyle(element,{display:'flex',alignItems:'center',justifyContent:'flex-end'});

 if(has('ir-ui-state-view'))IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minHeight:'260px',placeItems:'center'});

 if(has('ir-ui-chisti-composer')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'minmax(0,1fr) 42px auto',alignItems:'end',gap:'8px',padding:'9px',background:'#fff',border:'1px solid #ddd6b8',borderRadius:'18px',boxShadow:'0 10px 28px rgba(17,17,17,.08)'});
  IrancellComponentAssignInlineChildren(element,':scope>div',{display:'flex',minWidth:'0',flexDirection:'column',gap:'4px'});
  IrancellComponentAssignInlineChildren(element,'textarea',{boxSizing:'border-box',display:'block',width:'100%',minWidth:'0',minHeight:'40px',maxHeight:'160px',padding:'9px 10px',resize:'none',color:'#202024',background:'transparent',border:'0',fontFamily:IRANCELL_COMPONENT_INLINE_FONT,fontSize:'11px',lineHeight:'1.7',outline:'none'})
 }

 if(has('ir-ui-chisti-composer__attach'))IrancellComponentAssignInlineStyle(element,{...IrancellComponentInlineButtonBase(),width:'42px',minWidth:'42px',height:'42px',minHeight:'42px',padding:'0',color:'#5f6068',background:'#f3f3f5',borderRadius:'12px'});

 if(hasPrefix('ir-table-wrap')){
  IrancellComponentAssignInlineStyle(element,{display:'block',width:'100%',minWidth:'0',overflowX:'auto',background:'#fff',border:'1px solid #e7e1c5',borderRadius:'17px',boxShadow:'0 7px 22px rgba(17,17,17,.04)'})
 }

 if(has('ir-table')){
  IrancellComponentAssignInlineStyle(element,{width:'100%',minWidth:'640px',borderCollapse:'collapse',direction:'rtl',color:'#202024',fontFamily:IRANCELL_COMPONENT_INLINE_FONT,fontSize:'10px',textAlign:'right'});
  IrancellComponentAssignInlineChildren(element,'caption',{padding:'12px 14px',fontSize:'12px',fontWeight:'900',textAlign:'right'});
  IrancellComponentAssignInlineChildren(element,'th',{padding:'12px 14px',color:'#66676f',background:'#f7f5e9',borderBottom:'1px solid #e5dfc3',fontSize:'9px',fontWeight:'900',whiteSpace:'nowrap'});
  IrancellComponentAssignInlineChildren(element,'td',{padding:'13px 14px',borderBottom:'1px solid #efead6',fontSize:'10px',verticalAlign:'middle'})
 }

 if(has('ir-table__empty-row'))IrancellComponentAssignInlineChildren(element,'td',{padding:'34px 14px',color:'#7b7c84',textAlign:'center'});

 if(has('ir-trust-strip')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'8px',padding:'12px',color:'#5e6067',background:'#fff8d3',border:'1px solid #eadb91',borderRadius:'16px'});
  IrancellComponentAssignInlineChildren(element,':scope>span',{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'9px',fontWeight:'800',textAlign:'center'})
 }

 if(has('ir-gate-list')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',flexDirection:'column',gap:'8px'});
  Array.from(element.children).forEach(row=>{
   const passed=row.classList.contains('is-passed');
   IrancellComponentAssignInlineStyle(row,{display:'grid',width:'100%',gridTemplateColumns:'30px minmax(0,1fr)',alignItems:'center',gap:'9px',padding:'10px 12px',color:passed?'#17633e':'#8d2929',background:passed?'#edf9f2':'#fff1f1',border:passed?'1px solid #c7e8d4':'1px solid #f0cccc',borderRadius:'13px'});
   IrancellComponentAssignInlineChildren(row,':scope>span',{display:'grid',width:'30px',height:'30px',placeItems:'center',background:passed?'#ccefd9':'#f7d1d1',borderRadius:'50%',fontSize:'12px',fontWeight:'900'});
   IrancellComponentAssignInlineChildren(row,'strong',{display:'block',fontSize:'10px',fontWeight:'900'});
   IrancellComponentAssignInlineChildren(row,'small',{display:'block',marginTop:'2px',fontSize:'8px',lineHeight:'1.7'})
  })
 }

 if(has('ir-uploader')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',minWidth:'0',minHeight:'150px',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px',padding:'20px',color:'#686971',background:'#fffdf2',border:'2px dashed #dacf9e',borderRadius:'17px',textAlign:'center',cursor:'pointer'})
 }

 if(has('ir-uploader__icon')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'46px',height:'46px',placeItems:'center',color:'#202024',background:'#ffd100',borderRadius:'15px'})
 }

 if(has('ir-uploader__hint'))IrancellComponentAssignInlineStyle(element,{color:'#85868d',fontSize:'9px',lineHeight:'1.7'});

 if(hasPrefix('ir-shared-file-uploader'))IrancellComponentAssignInlineStyle(element,{display:'block',width:'100%',minWidth:'0'});

 if(has('ir-chisti-attachment-overlay')){
  IrancellComponentAssignInlineStyle(element,{position:'fixed',inset:'0',zIndex:'2147483300',display:'grid',placeItems:'end center',background:'rgba(17,17,20,.46)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)'})
 }

 if(has('ir-chisti-attachment-sheet')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',width:'100%',maxWidth:'620px',maxHeight:'88dvh',flexDirection:'column',gap:'9px',padding:'10px 16px calc(18px + env(safe-area-inset-bottom))',overflowY:'auto',color:'#202024',background:'#fff',borderRadius:'24px 24px 0 0',boxShadow:'0 -20px 55px rgba(17,17,17,.2)'})
 }

 if(has('ir-chisti-attachment-sheet__handle'))IrancellComponentAssignInlineStyle(element,{display:'block',width:'46px',height:'5px',margin:'0 auto 7px',background:'#d5d5da',borderRadius:'999px'});

 if(has('ir-chisti-attachment-sheet__option')){
  IrancellComponentAssignInlineStyle(element,{...IrancellComponentInlineButtonBase(),width:'100%',minHeight:'52px',justifyContent:'flex-start',padding:'0 13px',color:has('is-cancel')?'#9a2929':'#202024',background:has('is-cancel')?'#fff0f0':'#f7f7f8',border:'1px solid #e4e4e7',borderRadius:'14px',textAlign:'right'})
 }

 if(has('ir-chisti-attachment-sheet__option-icon')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'36px',minWidth:'36px',height:'36px',placeItems:'center',color:'#202024',background:'#ffd100',borderRadius:'11px'})
 }

 if(hasPrefix('ir-chisti-attachment-state')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'100%',minWidth:'0',gridTemplateColumns:'52px minmax(0,1fr) auto',alignItems:'center',gap:'11px',padding:'11px',color:has('is-failed')?'#8e2828':'#202024',background:has('is-failed')?'#fff0f0':has('is-success')?'#edf9f2':'#fff',border:has('is-failed')?'1px solid #efcaca':has('is-success')?'1px solid #c9e9d5':'1px solid #e4dec3',borderRadius:'15px'})
 }

 if(has('ir-chisti-attachment-state__preview')){
  IrancellComponentAssignInlineStyle(element,{display:'grid',width:'52px',minWidth:'52px',height:'52px',placeItems:'center',overflow:'hidden',color:'#202024',background:'#fff3af',borderRadius:'13px'});
  IrancellComponentAssignInlineChildren(element,'img',{display:'block',width:'100%',height:'100%',objectFit:'cover'})
 }

 if(has('ir-chisti-attachment-state__copy')){
  IrancellComponentAssignInlineStyle(element,{display:'flex',minWidth:'0',flexDirection:'column',gap:'3px'});
  IrancellComponentAssignInlineChildren(element,'strong',{overflow:'hidden',fontSize:'10px',fontWeight:'900',textOverflow:'ellipsis',whiteSpace:'nowrap'});
  IrancellComponentAssignInlineChildren(element,'small',{color:'#777982',fontSize:'8px'})
 }

 if(has('ir-chisti-attachment-state__progress')){
  IrancellComponentAssignInlineStyle(element,{display:'block',width:'100%',height:'6px',overflow:'hidden',background:'#e8e8eb',borderRadius:'999px'});
  IrancellComponentAssignInlineChildren(element,'span',{display:'block',height:'100%',background:'#ffd100',borderRadius:'inherit'})
 }

 if(has('ir-chisti-attachment-state__remove')||has('ir-chisti-attachment-state__retry')){
  IrancellComponentAssignInlineStyle(element,{...IrancellComponentInlineButtonBase(),width:'38px',minWidth:'38px',height:'38px',minHeight:'38px',padding:'0',color:has('ir-chisti-attachment-state__remove')?'#9a2929':'#202024',background:has('ir-chisti-attachment-state__remove')?'#fff0f0':'#ffd100',borderRadius:'11px'})
 }

 if(hasLiveOwner){
  const remainingTokens=liveTokens.filter(token=>!IrancellComponentIsInlineOwnedToken(token)&&!IRANCELL_COMPONENT_INLINE_STATE_TOKENS.has(token));
  if(remainingTokens.length)element.setAttribute('class',remainingTokens.join(' '));
  else element.removeAttribute('class')
 }

 element.setAttribute('data-ir-inline-component',IRANCELL_COMPONENT_INLINE_RUNTIME_VERSION)
}

function IrancellComponentUsesDedicatedIconFont(element){
 if(!(element instanceof Element))return false;
 const tokens=String(element.getAttribute('class')||'').split(/\s+/).filter(Boolean);
 return tokens.includes('material-symbols-outlined')
  ||tokens.includes('material-symbols-rounded')
  ||tokens.includes('material-symbols-sharp')
  ||tokens.includes('ir-icon')
  ||element.getAttribute('data-ir-icon-font')==='material-symbols'
}

function IrancellComponentApplyAuthoritativeFont(element){
 if(!(element instanceof Element))return;
 if(['SCRIPT','STYLE','LINK','META','NOSCRIPT'].includes(element.tagName))return;
 if(IrancellComponentUsesDedicatedIconFont(element)){
  element.style.setProperty('font-family','"Material Symbols Outlined"','important');
  element.style.setProperty('font-style','normal','important');
  element.style.setProperty('font-weight','normal','important');
  return
 }
 element.style.setProperty('font-family',IRANCELL_COMPONENT_INLINE_FONT,'important');
 element.style.setProperty('font-optical-sizing','auto');
 element.style.setProperty('font-synthesis','none')
}

function IrancellComponentApplyInlineTree(root){
 if(!(root instanceof Element)&&root!==document)return;
 const fontCandidates=[];
 if(root===document){
  if(document.body){
   fontCandidates.push(document.body);
   fontCandidates.push(...Array.from(document.body.querySelectorAll('*')))
  }
 }else{
  fontCandidates.push(root);
  fontCandidates.push(...Array.from(root.querySelectorAll('*')))
 }
 fontCandidates.forEach(IrancellComponentApplyAuthoritativeFont);
 const appearanceCandidates=fontCandidates.filter(element=>element.hasAttribute('class')||element.hasAttribute('data-ir-inline-component-tokens'));
 appearanceCandidates.forEach(IrancellComponentApplyInlineAppearance)
}

function IrancellComponentInstallInlineRuntime(){
 if(typeof window==='undefined'||typeof document==='undefined'||typeof MutationObserver==='undefined')return;
 if(window.__IRANCELL_COMPONENT_INLINE_RUNTIME__===IRANCELL_COMPONENT_INLINE_RUNTIME_VERSION)return;
 window.__IRANCELL_COMPONENT_INLINE_RUNTIME__=IRANCELL_COMPONENT_INLINE_RUNTIME_VERSION;

 let scheduled=false;
 const pendingRoots=new Set();
 function flush(){
  scheduled=false;
  const roots=Array.from(pendingRoots);
  pendingRoots.clear();
  roots.forEach(IrancellComponentApplyInlineTree)
 }
 function schedule(root){
  if(root)pendingRoots.add(root);
  if(scheduled)return;
  scheduled=true;
  if(typeof window.requestAnimationFrame==='function')window.requestAnimationFrame(flush);
  else Promise.resolve().then(flush)
 }

 const observer=new MutationObserver(records=>{
  records.forEach(record=>{
   if(record.type==='attributes')schedule(record.target);
   Array.from(record.addedNodes||[]).forEach(node=>{if(node instanceof Element)schedule(node)})
  })
 });

 function start(){
  IrancellComponentApplyInlineTree(document);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled','aria-pressed','aria-selected','aria-checked']})
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start()
}

IrancellComponentInstallInlineRuntime();

export {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  BookOpen,
  BrainCircuit,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Construction,
  GraduationCap,
  Home,
  Inbox,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Menu,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UploadCloud,
  UserRound,
  UserRoundCheck,
  Users,
  UsersRound,
  WalletCards,
  X,
  IrancellAppShell,
  IrancellBadge,
  IrancellStatusBadge,
  IrancellButton,
  IrancellCard,
  IrancellStatCard,
  IrancellIdentityFrame,
  IrancellBrandMark,
  IrancellIdentityProfileHeader,
  IrancellIdentityAuthTabs,
  IrancellIdentityInfoBanner,
  IrancellIdentityLinkedAccount,
  IrancellIdentitySecurityBadge,
  IrancellIdentityOnboardingVisual,
  IrancellContentCard,
  IrancellForm,
  IrancellFormActions,
  IrancellCheckbox,
  IrancellGenericModulePage,
  IrancellInput,
  IrancellIdentityPasswordField,
  IrancellIdentityOtpFields,
  IrancellTextarea,
  IrancellSelect,
  IrancellProviderCard,
  IrancellOfferCard,
  IrancellModal,
  IrancellPageHeader,
  IrancellStatePanel,
  IrancellSkeleton,
  IrancellSectionTitle,
  IrancellPageScaffold,
  IrancellFilterTabs,
  IrancellToggleRow,
  IrancellStatusBanner,
  IrancellStateView,
  IrancellBottomSheet,
  IrancellChistiComposer,
  IrancellSimpleFileUploader,
  IrancellTable,
  IrancellToast,
  IrancellToastStack,
  IrancellTrustStrip,
  IrancellGateChecklist,
  IrancellCustomSelect,
  IrancellJalaliDatePicker,
  IrancellInputNormalizeDigits
};
