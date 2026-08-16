function IrancellComponentResolveNavIcon(iconName){const icons={home:Home,ask:BrainCircuit,learning:BookOpen,teachers:GraduationCap,classes:CalendarCheck,user:UserRound,children:Users,consents:ShieldCheck,payments:WalletCards,requests:Search,calendar:CalendarCheck,earnings:WalletCards,library:BookOpen,upload:BookOpen,analytics:Search,users:Users,providers:GraduationCap,complaints:ShieldCheck,system:ShieldCheck};return icons[iconName]||Home;}
function IrancellComponentNavItemIsActive(item,currentRoute){const normalizedRoute=String(currentRoute||'').replace(/^\/+|\/+$/g,'');return(item.matches||[item.route]).some(match=>match.endsWith('/')?normalizedRoute.startsWith(match):normalizedRoute===match||normalizedRoute.startsWith(`${match}/`));}
export function IrancellAppShell({children,currentRoute,onNavigate,onRoleChange}){
 const{state,dispatch}=useIrancellStore();
 const[mobileOpen,setMobileOpen]=useState(false);
 const[viewportWidth,setViewportWidth]=useState(()=>typeof window==='undefined'?1024:Math.max(0,Number(window.innerWidth)||0));

 useEffect(function IrancellAppShellTrackViewport(){
  if(typeof window==='undefined')return undefined;
  const updateViewport=()=>setViewportWidth(Math.max(0,Number(window.innerWidth)||0));
  updateViewport();
  window.addEventListener('resize',updateViewport,{passive:true});
  return()=>window.removeEventListener('resize',updateViewport);
 },[]);

 const role=state.session.activeRole;
 const nav=IRANCELL_ROLE_NAVIGATION[role]||[];
 const currentUser=state.identity.usersById[state.session.currentUserId];
 const roleOptions=(currentUser?.roles||[role]).filter(Boolean);
 const isDesktop=viewportWidth>=1024;
 const mobileItems=nav.slice(0,5);
 const fontFamily='"Vazirmatn",Tahoma,Arial,sans-serif';
 const unreadCount=Math.max(0,Number(state.notifications.unreadCount)||0);
 const buttonReset={boxSizing:'border-box',appearance:'none',WebkitAppearance:'none',fontFamily,cursor:'pointer',textDecoration:'none',visibility:'visible',opacity:1,pointerEvents:'auto',outlineOffset:3};
 const sidebarVisible=isDesktop||mobileOpen;
 const rootStyle={boxSizing:'border-box',position:'relative',display:'block',width:'100%',minWidth:0,minHeight:'100dvh',margin:0,padding:0,direction:'rtl',fontFamily,color:'#202024',background:'#fffae0',overflowX:'hidden'};
 const scrimStyle={...buttonReset,position:'fixed',inset:0,zIndex:2147482990,display:!isDesktop&&mobileOpen?'block':'none',width:'100%',height:'100%',margin:0,padding:0,background:'rgba(17,17,20,.42)',border:0,backdropFilter:'blur(3px)',WebkitBackdropFilter:'blur(3px)'};
 const sidebarStyle={
  boxSizing:'border-box',
  position:'fixed',
  top:isDesktop?20:12,
  right:isDesktop?20:12,
  bottom:isDesktop?20:12,
  left:'auto',
  zIndex:2147483000,
  display:'flex',
  width:isDesktop?280:'min(320px,calc(100vw - 24px))',
  minWidth:0,
  maxWidth:isDesktop?280:'calc(100vw - 24px)',
  minHeight:0,
  flexDirection:'column',
  gap:10,
  margin:0,
  padding:isDesktop?'18px 16px':'16px 14px',
  overflowX:'hidden',
  overflowY:'auto',
  direction:'rtl',
  color:'#6f7179',
  background:'rgba(255,255,255,.98)',
  border:'1px solid rgba(228,222,193,.98)',
  borderRadius:26,
  boxShadow:isDesktop?'0 18px 48px rgba(17,17,17,.11)':'0 24px 70px rgba(17,17,17,.24)',
  backdropFilter:'blur(20px)',
  WebkitBackdropFilter:'blur(20px)',
  fontFamily,
  visibility:sidebarVisible?'visible':'hidden',
  opacity:sidebarVisible?1:0,
  pointerEvents:sidebarVisible?'auto':'none',
  transform:isDesktop||mobileOpen?'translateX(0)':'translateX(calc(100% + 28px))',
  transition:'transform .24s cubic-bezier(.2,.8,.2,1), opacity .2s ease, visibility .2s ease'
 };
 const mainStyle={boxSizing:'border-box',display:'block',width:'100%',minWidth:0,minHeight:'100dvh',margin:0,padding:isDesktop?'0 320px 0 0':`0 0 calc(92px + env(safe-area-inset-bottom))`,overflow:'visible'};
 const topbarStyle={boxSizing:'border-box',position:isDesktop?'relative':'sticky',top:0,zIndex:50,display:'grid',width:'100%',minHeight:isDesktop?72:64,gridTemplateColumns:'44px minmax(0,1fr) 44px',alignItems:'center',gap:10,margin:0,padding:isDesktop?'12px 28px':'10px 14px',direction:'rtl',color:'#202024',background:isDesktop?'transparent':'rgba(255,250,224,.96)',borderBottom:isDesktop?'0':'1px solid rgba(221,211,164,.55)',backdropFilter:isDesktop?'none':'blur(14px)',WebkitBackdropFilter:isDesktop?'none':'blur(14px)',fontFamily};
 const topbarButtonStyle={...buttonReset,position:'relative',display:'grid',width:44,minWidth:44,height:44,placeItems:'center',margin:0,padding:0,color:'#202024',background:'#fff',border:'1px solid #ebe4c7',borderRadius:14,boxShadow:'0 6px 18px rgba(17,17,17,.07)'};
 const contentStyle={boxSizing:'border-box',display:'block',width:'100%',minWidth:0,minHeight:isDesktop?'calc(100dvh - 72px)':'calc(100dvh - 64px)',margin:0,padding:0,overflow:'visible'};
 const mobileDockStyle={boxSizing:'border-box',position:'fixed',right:12,bottom:'calc(12px + env(safe-area-inset-bottom))',left:12,zIndex:2147483000,display:isDesktop?'none':'grid',width:'auto',minWidth:0,height:70,minHeight:70,maxHeight:70,gridTemplateColumns:`repeat(${Math.max(mobileItems.length,1)},minmax(0,1fr))`,alignItems:'center',gap:3,margin:0,padding:7,direction:'rtl',color:'#aaaab2',background:'rgba(23,23,25,.97)',border:'1px solid rgba(255,255,255,.09)',borderRadius:24,boxShadow:'0 18px 42px rgba(17,17,17,.25)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',fontFamily,visibility:'visible',opacity:1,pointerEvents:'auto'};

 function closeMenu(){setMobileOpen(false)}
 function navigate(route){onNavigate?.(route);closeMenu()}
 function logout(){dispatch({type:'IRANCELL_AUTH_LOGOUT'});closeMenu();onNavigate?.('auth/login')}

 function sidebarNavigationItemStyle(item,active){
  const selected=Boolean(active||item.primary);
  return {...buttonReset,display:'grid',width:'100%',minWidth:0,height:48,minHeight:48,gridTemplateColumns:'24px minmax(0,1fr)',alignItems:'center',justifyContent:'stretch',gap:12,margin:0,padding:'0 14px',overflow:'hidden',direction:'rtl',color:selected?'#171719':'#72747c',background:selected?'#ffd100':'transparent',border:0,borderRadius:14,boxShadow:'none',fontSize:12,fontWeight:selected?900:800,textAlign:'right'};
 }

 function mobileNavigationItemStyle(item,active){
  return {...buttonReset,position:'relative',display:'flex',width:'100%',minWidth:0,height:56,minHeight:56,flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,margin:0,padding:'4px 2px',overflow:'hidden',color:item.primary?'#171719':active?'#ffd100':'#aaaab2',background:item.primary?'#ffd100':active?'#2c2c30':'transparent',border:0,borderRadius:item.primary?18:17,boxShadow:item.primary?'0 8px 20px rgba(255,209,0,.2)':'none',fontSize:8,fontWeight:item.primary?900:700,lineHeight:1.2,textAlign:'center'};
 }

 return <div data-ir-shell-inline="v2" style={rootStyle} dir="rtl">
  <button type="button" style={scrimStyle} aria-label="بستن منو" onClick={closeMenu}/>

  <aside data-ir-shell-surface="sidebar" style={sidebarStyle} aria-label="ناوبری نقش فعال">
   <div style={{boxSizing:'border-box',display:'grid',width:'100%',minHeight:56,gridTemplateColumns:'44px minmax(0,1fr) 38px',alignItems:'center',gap:10,padding:'0 2px 12px',borderBottom:'1px solid #e9e2c5'}}>
    <div style={{display:'grid',width:44,height:44,placeItems:'center',overflow:'hidden'}}>
     <IrancellBrandMark compact/>
    </div>
    <div style={{display:'flex',minWidth:0,flexDirection:'column',gap:2,textAlign:'right'}}>
     <strong style={{overflow:'hidden',color:'#171719',fontSize:13,fontWeight:900,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>آموزش ایرانسل</strong>
     <small style={{overflow:'hidden',color:'#85858d',fontSize:10,fontWeight:600,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{IRANCELL_ROLE_LABELS[role]||'حساب کاربری'}</small>
    </div>
    <button type="button" onClick={closeMenu} aria-label="بستن منو" style={{...topbarButtonStyle,display:isDesktop?'none':'grid',width:38,minWidth:38,height:38,borderRadius:12}}><X size={20}/></button>
   </div>

   <div style={{boxSizing:'border-box',display:'grid',width:'100%',minHeight:66,gridTemplateColumns:'42px minmax(0,1fr)',alignItems:'center',gap:11,margin:'2px 0 4px',padding:'10px 12px',color:'#171719',background:'#faf5df',border:'1px solid #eee5bd',borderRadius:17}}>
    <span style={{display:'grid',width:42,minWidth:42,height:42,placeItems:'center',color:'#171719',background:'#ffd100',borderRadius:'50%',fontSize:15,fontWeight:900}}>{String(currentUser?.name||'ک').trim().charAt(0)}</span>
    <div style={{display:'flex',minWidth:0,flexDirection:'column',gap:2,textAlign:'right'}}>
     <strong style={{overflow:'hidden',fontSize:12,fontWeight:900,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{currentUser?.name||'کاربر ایرانسل'}</strong>
     <small style={{overflow:'hidden',color:'#777982',fontSize:10,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{IRANCELL_ROLE_LABELS[role]||role}</small>
    </div>
   </div>

   <nav aria-label="فهرست نقش فعال" style={{boxSizing:'border-box',display:'flex',width:'100%',minHeight:0,flex:'1 1 auto',flexDirection:'column',gap:5,overflowX:'hidden',overflowY:'auto'}}>
    {nav.map(item=>{
     const Icon=IrancellComponentResolveNavIcon(item.icon);
     const active=IrancellComponentNavItemIsActive(item,currentRoute);
     return <button type="button" key={item.route} aria-current={active?'page':undefined} onClick={()=>navigate(item.route)} style={sidebarNavigationItemStyle(item,active)}>
      <Icon size={21}/>
      <span style={{display:'block',minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>
     </button>
    })}
   </nav>

   <div style={{boxSizing:'border-box',display:'flex',width:'100%',flexDirection:'column',gap:9,marginTop:'auto',paddingTop:11,borderTop:'1px solid #e9e2c5'}}>
    {roleOptions.length>1&&<label style={{display:'flex',width:'100%',flexDirection:'column',gap:6,color:'#777982',fontSize:10,fontWeight:800}}>
     <span>نقش فعال</span>
     <select value={role||''} onChange={event=>onRoleChange?.(event.target.value)} style={{boxSizing:'border-box',display:'block',width:'100%',height:42,padding:'0 11px',direction:'rtl',color:'#202024',background:'#fff',border:'1px solid #e5ddbb',borderRadius:12,fontFamily,fontSize:11,fontWeight:800,outline:'none'}}>
      {roleOptions.map(roleKey=><option key={roleKey} value={roleKey}>{IRANCELL_ROLE_LABELS[roleKey]||roleKey}</option>)}
     </select>
    </label>}
    <button type="button" onClick={logout} style={{...buttonReset,display:'grid',width:'100%',height:44,gridTemplateColumns:'20px minmax(0,1fr)',alignItems:'center',gap:10,padding:'0 13px',color:'#9b2929',background:'#fff1f1',border:'1px solid #f1cece',borderRadius:13,fontSize:11,fontWeight:900,textAlign:'right'}}><LogOut size={18}/><span>خروج امن</span></button>
   </div>
  </aside>

  <div data-ir-shell-surface="content" style={mainStyle}>
   <header style={topbarStyle}>
    <button type="button" style={{...topbarButtonStyle,display:isDesktop?'none':'grid'}} onClick={()=>setMobileOpen(true)} aria-label="باز کردن منو"><Menu size={22}/></button>
    <div style={{display:'flex',minWidth:0,flexDirection:'column',alignItems:'flex-start',gap:2,textAlign:'right'}}>
     <strong style={{overflow:'hidden',color:'#202024',fontSize:isDesktop?16:13,fontWeight:900,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{IRANCELL_ROLE_LABELS[role]||'آموزش ایرانسل'}</strong>
     <small style={{overflow:'hidden',color:'#81828a',fontSize:10,fontWeight:600,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{currentUser?.name||''}</small>
    </div>
    <button type="button" style={topbarButtonStyle} onClick={()=>navigate(role==='student'?'student/notifications':'notifications')} aria-label="اعلان‌ها">
     <Bell size={21}/>
     {unreadCount>0&&<span style={{position:'absolute',top:-4,left:-4,display:'grid',minWidth:18,height:18,placeItems:'center',padding:'0 4px',color:'#fff',background:'#ff3b30',border:'2px solid #fffae0',borderRadius:999,fontSize:7,fontWeight:900,lineHeight:1}}>{unreadCount>9?'9+':unreadCount}</span>}
    </button>
   </header>

   <main style={contentStyle}>{children}</main>

   <nav data-ir-shell-surface="mobile-dock" style={mobileDockStyle} aria-label="ناوبری موبایل">
    {mobileItems.map(item=>{
     const Icon=IrancellComponentResolveNavIcon(item.icon);
     const active=IrancellComponentNavItemIsActive(item,currentRoute);
     return <button type="button" key={item.route} aria-current={active?'page':undefined} onClick={()=>navigate(item.route)} style={mobileNavigationItemStyle(item,active)}>
      <Icon size={22}/>
      <span style={{display:'block',width:'100%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>
     </button>
    })}
   </nav>
  </div>
 </div>
}
