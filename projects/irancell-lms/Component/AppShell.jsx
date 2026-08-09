function IrancellComponentResolveNavIcon(iconName){const icons={home:Home,ask:BrainCircuit,learning:BookOpen,teachers:GraduationCap,classes:CalendarCheck,user:UserRound,children:Users,consents:ShieldCheck,payments:WalletCards,requests:Search,calendar:CalendarCheck,earnings:WalletCards,library:BookOpen,upload:BookOpen,analytics:Search,users:Users,providers:GraduationCap,complaints:ShieldCheck,system:ShieldCheck};return icons[iconName]||Home;}
function IrancellComponentNavItemIsActive(item,currentRoute){const normalizedRoute=String(currentRoute||'').replace(/^\/+|\/+$/g,'');return(item.matches||[item.route]).some(match=>match.endsWith('/')?normalizedRoute.startsWith(match):normalizedRoute===match||normalizedRoute.startsWith(`${match}/`));}
export function IrancellAppShell({children,currentRoute,onNavigate,onRoleChange}){
 const{state,dispatch}=useIrancellStore();
 const[mobileOpen,setMobileOpen]=useState(false);
 const role=state.session.activeRole;
 const nav=IRANCELL_ROLE_NAVIGATION[role]||[];
 const currentUser=state.identity.usersById[state.session.currentUserId];
 const roleOptions=(currentUser?.roles||[role]).filter(Boolean);
 function closeMenu(){setMobileOpen(false)}
 function navigate(route){onNavigate?.(route);closeMenu()}
 function logout(){dispatch({type:'IRANCELL_AUTH_LOGOUT'});closeMenu();onNavigate?.('auth/login')}
 return <div className="ir-shell ir-shell--visual-identity" dir="rtl">
  <button type="button" className={`ir-shell__scrim ${mobileOpen?'is-visible':''}`} aria-label="بستن منو" onClick={closeMenu}/>
  <aside className={`ir-sidebar ${mobileOpen?'is-open':''}`} aria-label="ناوبری نقش فعال">
   <div className="ir-brand">
    <IrancellBrandMark compact/>
    <div><strong>آموزش ایرانسل</strong><small>{IRANCELL_ROLE_LABELS[role]||'حساب کاربری'}</small></div>
    <button type="button" className="ir-sidebar__close" onClick={closeMenu} aria-label="بستن منو"><X size={20}/></button>
   </div>
   <div className="ir-sidebar__profile"><span>{String(currentUser?.name||'ک').trim().charAt(0)}</span><div><strong>{currentUser?.name||'کاربر ایرانسل'}</strong><small>{IRANCELL_ROLE_LABELS[role]||role}</small></div></div>
   <nav>{nav.map(item=>{const Icon=IrancellComponentResolveNavIcon(item.icon),active=IrancellComponentNavItemIsActive(item,currentRoute);return <button type="button" key={item.route} className={active?'is-active':''} aria-current={active?'page':undefined} onClick={()=>navigate(item.route)}><Icon size={21}/><span>{item.label}</span></button>})}</nav>
   <div className="ir-sidebar__footer">
    {roleOptions.length>1&&<label><span>نقش فعال</span><select value={role||''} onChange={event=>onRoleChange?.(event.target.value)}>{roleOptions.map(roleKey=><option key={roleKey} value={roleKey}>{IRANCELL_ROLE_LABELS[roleKey]||roleKey}</option>)}</select></label>}
    <button type="button" onClick={logout}><LogOut size={18}/><span>خروج امن</span></button>
   </div>
  </aside>
  <div className="ir-shell__main">
   <header className="ir-topbar">
    <button type="button" className="ir-menu-button" onClick={()=>setMobileOpen(true)} aria-label="باز کردن منو"><Menu size={22}/></button>
    <div><strong>{IRANCELL_ROLE_LABELS[role]||'آموزش ایرانسل'}</strong><small>{currentUser?.name||''}</small></div>
    <button type="button" className="ir-notification-button" onClick={()=>navigate(role==='student'?'student/notifications':'notifications')} aria-label="اعلان‌ها"><Bell size={21}/>{Number(state.notifications.unreadCount)>0&&<span>{state.notifications.unreadCount}</span>}</button>
   </header>
   <main className="ir-main-content">{children}</main>
   <nav className="ir-bottom-nav" aria-label="ناوبری موبایل">{nav.slice(0,5).map(item=>{const Icon=IrancellComponentResolveNavIcon(item.icon),active=IrancellComponentNavItemIsActive(item,currentRoute);return <button type="button" key={item.route} className={`${item.primary?'is-primary ':''}${active?'is-active':''}`.trim()} aria-current={active?'page':undefined} onClick={()=>navigate(item.route)}><Icon size={22}/><span>{item.label}</span></button>})}</nav>
  </div>
 </div>
}
