export const IRANCELL_APP_PROTOTYPE_ROUTE_MAP=Object.freeze({});
export const IRANCELL_APP_LEGACY_ROUTE_ALIASES=Object.freeze({
 'student/dashboard':'student/home',
 'student/learning':'student/binayi',
 'student/teachers':'student/classes/providers'
});

export function IrancellAppResolveCanonicalRoute(routeValue){
 const route=String(routeValue||'').replace(/^\/+|\/+$/g,'');
 if(IRANCELL_APP_LEGACY_ROUTE_ALIASES[route])return IRANCELL_APP_LEGACY_ROUTE_ALIASES[route];
 if(route.startsWith('student/content/'))return `student/binayi/course/${route.slice('student/content/'.length)}`;
 return route;
}

export function IrancellAppResolvePrototypeId(screen,activeRoute){
 if(screen?.route!=='prototype/:prototypeId')return '';
 const route=String(activeRoute||'').replace(/^\/+|\/+$/g,'');
 return route.startsWith('prototype/')?route.slice('prototype/'.length):'';
}

export function IrancellAppParseHashLocation(hashValue){
 const raw=String(hashValue||'').replace(/^#\/?/,'');
 const separatorIndex=raw.indexOf('?');
 const pathPart=separatorIndex>=0?raw.slice(0,separatorIndex):raw;
 const queryPart=separatorIndex>=0?raw.slice(separatorIndex+1):'';
 let decodedRoute=IRANCELL_BOOT_CONFIG.defaultRoute;
 try{decodedRoute=decodeURIComponent(pathPart||IRANCELL_BOOT_CONFIG.defaultRoute);}catch(error){decodedRoute=IRANCELL_BOOT_CONFIG.defaultRoute;}
 const route=IrancellAppResolveCanonicalRoute(decodedRoute)||IRANCELL_BOOT_CONFIG.defaultRoute;
 const query={};
 queryPart.split('&').forEach(function IrancellParseHashQueryPair(pair){
  if(!pair)return;
  const equalIndex=pair.indexOf('=');
  const rawKey=equalIndex>=0?pair.slice(0,equalIndex):pair;
  const rawValue=equalIndex>=0?pair.slice(equalIndex+1):'';
  try{const key=decodeURIComponent(rawKey||'');if(key)query[key]=decodeURIComponent(rawValue||'');}catch(error){}
 });
 return{route,query};
}

export function IrancellAppMatchRegisteredScreen(route){
 const segments=IrancellAppResolveCanonicalRoute(route).split('/').filter(Boolean);
 for(const screen of IrancellScreenRegistryEntries()){
  const pattern=screen.route.split('/').filter(Boolean);
  if(pattern.length!==segments.length)continue;
  const params={};let matches=true;
  for(let index=0;index<pattern.length;index+=1){
   if(pattern[index].startsWith(':'))params[pattern[index].slice(1)]=segments[index];
   else if(pattern[index]!==segments[index]){matches=false;break;}
  }
  if(matches)return{screen,params};
 }
 return null;
}

export function IrancellAppNavigateToRoute(target,params={}){
 const raw=String(target||IRANCELL_BOOT_CONFIG.defaultRoute).replace(/^#\/?/,'').replace(/^\/+/, '');
 const separatorIndex=raw.indexOf('?');
 const route=separatorIndex>=0?raw.slice(0,separatorIndex):raw;
 const query=new URLSearchParams(separatorIndex>=0?raw.slice(separatorIndex+1):'');
 Object.keys(params||{}).forEach(function IrancellNavigateParam(key){const value=params[key];if(value===undefined||value===null||value==='')query.delete(key);else query.set(key,String(value));});
 const canonicalRoute=IrancellAppResolveCanonicalRoute(route);
 const nextHash=`#/${canonicalRoute||IRANCELL_BOOT_CONFIG.defaultRoute}${query.toString()?`?${query.toString()}`:''}`;
 if(typeof window==='undefined')return nextHash;
 if(window.location.hash===nextHash){window.dispatchEvent(typeof HashChangeEvent==='function'?new HashChangeEvent('hashchange'):new Event('hashchange'));return nextHash;}
 window.location.hash=nextHash;
 return nextHash;
}

export function IrancellAppResolveSafeHomeRoute(state){return IRANCELL_ROLE_HOME_ROUTES[state?.session?.activeRole]||IRANCELL_BOOT_CONFIG.defaultRoute;}

export const IRANCELL_APP_SVG_ROUTE_MAP=Object.freeze({
 'student/home':'student-dashboard',
 'student/chisti':'chisty-ai-search',
 'student/chisti/history':'chisty-ai-results',
 'student/binayi':'student-home',
 'student/binayi/course/:id':'course-detail-video',
 'parent/home':'family-home',
 'parent/children':'family-children',
 'student/notifications':'student-notifications',
 'student/support':'student-support-home',
 'academy/profile':'institute-profile'
});

export function IrancellAppResolveSvgPrototypeId(screen,activeRoute){
 const registeredRoute=screen?.route||'';
 const normalizedRoute=String(activeRoute||registeredRoute).replace(/^\/+|\/+$/g,'');
 return IRANCELL_APP_SVG_ROUTE_MAP[registeredRoute]||IRANCELL_APP_SVG_ROUTE_MAP[normalizedRoute]||'';
}

export const IRANCELL_APP_PERSISTENT_DOCKS=IRANCELL_ROLE_NAVIGATION;

export function IrancellAppPersistentDockIcon({name}){
 const paths={
  user:<><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
  calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
  spark:<><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></>,
  eye:<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  book:<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H15a2 2 0 0 0-2 2v16a3 3 0 0 1 3-3h4Z"/></>,
  home:<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3Z"/>,
  wallet:<><rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 9h15a3 3 0 0 1 3 3v5h-5a3 3 0 0 1 0-6h5M6 6V4h12"/></>,
  children:<><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2.5A5.5 5.5 0 0 1 9 12a5.5 5.5 0 0 1 5.5 5.5V20"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5A4.5 4.5 0 0 1 21 19"/></>,
  plus:<path d="M12 5v14M5 12h14"/>,
  shield:<><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  report:<><path d="M7 21h10"/><path d="M9 17h6"/><path d="M8 3h8l2 3v5a6 6 0 0 1-12 0V6Z"/><path d="M6 7H3v2a4 4 0 0 0 4 4M18 7h3v2a4 4 0 0 1-4 4"/></>,
  bell:<><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>
 };
 const aliases={ask:'spark',learning:'book',classes:'calendar',payments:'wallet',consents:'shield',requests:'book',teachers:'children',earnings:'wallet',library:'book',upload:'plus',analytics:'report',users:'children',providers:'children',complaints:'shield',system:'shield'};
 const resolvedName=aliases[name]||name;
 return <svg className="ir-app-persistent-dock__icon" viewBox="0 0 24 24" aria-hidden="true">{paths[resolvedName]||paths.home}</svg>
}

export function IrancellAppResolvePersistentDockRole(state,screen,route){
 const routeRole=String(route||'').split('/')[0];
 if(IRANCELL_APP_PERSISTENT_DOCKS[routeRole])return routeRole;
 if(IRANCELL_APP_PERSISTENT_DOCKS[screen?.role])return screen.role;
 return IRANCELL_APP_PERSISTENT_DOCKS[state?.session?.activeRole]?state.session.activeRole:'';
}

export function IrancellAppShouldShowPersistentDock(state,screen,route,role){
 if(state?.session?.status!=='authenticated'||!role||!IRANCELL_APP_PERSISTENT_DOCKS[role])return false;
 const normalizedRoute=String(route||'').replace(/^\/+|\/+$/g,'');
 if(!normalizedRoute)return false;
 if(['splash','onboarding','auth/login','auth/otp','role-select','profile-completion','relationship-linking'].includes(normalizedRoute))return false;
 if(normalizedRoute.startsWith('prototype/')||normalizedRoute.startsWith('parent-gate/')||normalizedRoute.startsWith('class/')||normalizedRoute.startsWith('student/binayi/lesson/')||normalizedRoute==='student/chisti/history')return false;
 if(normalizedRoute.includes('/processing')||normalizedRoute.includes('/redirect'))return false;
 return screen?.role!=='public';
}

export function IrancellAppPersistentDock({role,currentRoute,onNavigate}){
 const{state}=useIrancellStore();
 const normalizedRoute=String(currentRoute||'').replace(/^\/+|\/+$/g,'');
 const baseItems=IRANCELL_APP_PERSISTENT_DOCKS[role]||[];
 const items=['parent','teacher'].includes(role)?[...baseItems].reverse():baseItems;
 const unreadCount=Math.max(0,Number(state.notifications.unreadCount)||0);
 const dockAvatarUser=state.identity.usersById[state.session.currentUserId]||null;
 const dockAvatarOverride=typeof dockAvatarUser?.avatarDataUrl==='string'?dockAvatarUser.avatarDataUrl.trim():'';
 const dockAvatarHasOverride=Boolean(dockAvatarOverride);
 const dockAvatar=role==='student'?(dockAvatarHasOverride?dockAvatarOverride:IRANCELL_PAGE_STUDENT_HOME_AVATAR):(dockAvatarHasOverride?dockAvatarOverride:null);
 const dockAvatarInitial=String(dockAvatarUser?.name||'خ').trim().charAt(0)||'خ';
 const roleTitles={student:'دانش‌آموز',parent:'خانواده',teacher:'مدرس',academy:'آموزشگاه','content-provider':'تولیدکننده محتوا',admin:'مدیریت سامانه'};
 const profileItem=baseItems.find(item=>item.icon==='user'||String(item.route||'').includes('profile'))||null;
 const profileRoute=profileItem?.route||(role==='admin'?'admin/settings':IRANCELL_ROLE_HOME_ROUTES[role]||'student/home');
 const profileActive=profileItem?(profileItem.matches||[profileItem.route]).some(match=>match.endsWith('/')?normalizedRoute.startsWith(match):normalizedRoute===match||normalizedRoute.startsWith(`${match}/`)):false;
 const profileSubtitle=role==='student'?(dockAvatarUser?.grade||'دانش‌آموز'):roleTitles[role]||'حساب کاربری';
 const desktopSupplementalItems=role==='student'?[
  {label:'کارنامه و گزارشات',route:'student/achievements',icon:'report',matches:['student/achievements','student/badges','student/points','student/certificates']},
  {label:'اعلان‌ها',route:'student/notifications',icon:'bell',matches:['student/notifications']}
 ]:[];
 return <nav className={`ir-app-persistent-dock is-${role}`} dir="rtl" style={{'--ir-app-dock-count':items.length}} aria-label="ناوبری اصلی">
  <div className="ir-app-persistent-dock__brand" aria-hidden="true">
   <span className="ir-app-persistent-dock__brand-logo"><b>ایرانسل</b><small>MTN</small></span>
   <span className="ir-app-persistent-dock__brand-copy"><strong>پلتفرم آموزشی ایرانسل</strong><small>طراحی شده توسط ایرانسل</small></span>
  </div>

  <button type="button" className={`ir-app-persistent-dock__profile-card ${profileActive?'is-active':''}`} aria-label="مشاهده پروفایل" onClick={()=>onNavigate?.(profileRoute)}>
   <b className="ir-app-persistent-dock__profile-avatar">
    {dockAvatar?<img src={dockAvatar} alt=""/>:<span>{dockAvatarInitial}</span>}
    {role==='student'&&unreadCount>0&&<i>{unreadCount>9?'9+':unreadCount}</i>}
   </b>
   <span className="ir-app-persistent-dock__profile-copy">
    <strong>{dockAvatarUser?.name||'کاربر ایرانسل'}</strong>
    <small>{profileSubtitle}</small>
   </span>
  </button>

  <div className="ir-app-persistent-dock__divider"/>

  {items.map(item=>{
   const active=(item.matches||[item.route]).some(match=>match.endsWith('/')?normalizedRoute.startsWith(match):normalizedRoute===match||normalizedRoute.startsWith(`${match}/`));
   const avatarProfile=(role==='student'&&item.route==='student/profile')||(role==='parent'&&item.route==='parent/profile')||item.route===profileRoute;
   return <button type="button" key={item.route} className={`${item.primary?'is-primary ':''}${active?'is-active':''}${avatarProfile?' is-profile':''}`.trim()} aria-label={item.label} aria-current={active?'page':undefined} onClick={()=>onNavigate?.(item.route)}>
    {avatarProfile?<b className="ir-app-persistent-dock__avatar">{dockAvatar?<img src={dockAvatar} alt=""/>:<span aria-hidden="true">{dockAvatarInitial}</span>}{role==='student'&&unreadCount>0&&<i>{unreadCount>9?'9+':unreadCount}</i>}</b>:<IrancellAppPersistentDockIcon name={item.icon}/>}
    <span>{item.label}</span>
   </button>
  })}

  {desktopSupplementalItems.map(item=>{
   const active=(item.matches||[item.route]).some(match=>match.endsWith('/')?normalizedRoute.startsWith(match):normalizedRoute===match||normalizedRoute.startsWith(`${match}/`));
   return <button type="button" key={item.route} className={`ir-app-persistent-dock__desktop-only ${active?'is-active':''}`.trim()} aria-label={item.label} aria-current={active?'page':undefined} onClick={()=>onNavigate?.(item.route)}>
    <IrancellAppPersistentDockIcon name={item.icon}/>
    <span>{item.label}</span>
   </button>
  })}

  <div className="ir-app-persistent-dock__quick-profile">
   <span className="ir-app-persistent-dock__quick-profile-icon" aria-hidden="true">
    <IrancellAppPersistentDockIcon name="children"/>
   </span>
   <span className="ir-app-persistent-dock__quick-profile-copy">
    <strong>تغییر سریع پروفایل</strong>
    <small>{dockAvatarUser?.name||roleTitles[role]||'پروفایل فعلی'}</small>
   </span>
   <button type="button" aria-label="مدیریت پروفایل" onClick={()=>onNavigate?.(profileRoute)}>تغییر</button>
  </div>
 </nav>
}

export function IrancellAppRuntime(){
 const{state,dispatch}=useIrancellStore();
 const[location,setLocation]=React.useState(function IrancellInitialLocation(){return IrancellAppParseHashLocation(typeof window==='undefined'?'':window.location.hash);});
 React.useEffect(function IrancellConfigureDocument(){
  if(typeof document==='undefined')return undefined;

  document.documentElement.lang=IRANCELL_BOOT_CONFIG.language;
  document.documentElement.dir=IRANCELL_BOOT_CONFIG.direction;
  document.documentElement.dataset.irFontScale=state.settings?.appearance?.fontScale||'comfortable';
  document.documentElement.dataset.irDemoMode=state.settings?.demo?.enabled===false?'off':'on';
  document.title='ایرانسل آموزش';

  function IrancellEnsureAppMeta(name,content){
   let element=document.head.querySelector(`meta[name="${name}"]`);
   if(!element){
    element=document.createElement('meta');
    element.setAttribute('name',name);
    document.head.appendChild(element);
   }
   element.setAttribute('content',content);
   return element;
  }

  let viewportMeta=document.head.querySelector('meta[name="viewport"]');
  if(!viewportMeta){
   viewportMeta=document.createElement('meta');
   viewportMeta.setAttribute('name','viewport');
   document.head.appendChild(viewportMeta);
  }
  viewportMeta.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');

  IrancellEnsureAppMeta('theme-color','#FFD100');
  IrancellEnsureAppMeta('mobile-web-app-capable','yes');
  IrancellEnsureAppMeta('apple-mobile-web-app-capable','yes');
  IrancellEnsureAppMeta('apple-mobile-web-app-status-bar-style','black-translucent');
  IrancellEnsureAppMeta('apple-mobile-web-app-title','آموزش ایرانسل');
  IrancellEnsureAppMeta('application-name','آموزش ایرانسل');

  if(typeof window!=='undefined'){
   const documentUrl=new URL(window.location.href);
   documentUrl.hash='';
   documentUrl.search='';

   const scopeUrl=new URL('./',documentUrl.href).href;
   const startUrl=`${documentUrl.href}#/${IRANCELL_BOOT_CONFIG.defaultRoute}`;
   const discoveredIcons=Array.from(document.head.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]')).map(function IrancellManifestIcon(link){
    const icon={src:link.href};
    const sizes=link.getAttribute('sizes');
    const type=link.getAttribute('type');
    if(sizes)icon.sizes=sizes;
    if(type)icon.type=type;
    return icon;
   }).filter(function IrancellManifestValidIcon(icon){return Boolean(icon.src);});

   const manifest={
    id:documentUrl.href,
    name:'پلتفرم آموزشی ایرانسل',
    short_name:'آموزش ایرانسل',
    description:'پلتفرم آموزشی ایرانسل',
    lang:IRANCELL_BOOT_CONFIG.language||'fa',
    dir:IRANCELL_BOOT_CONFIG.direction||'rtl',
    start_url:startUrl,
    scope:scopeUrl,
    display:'fullscreen',
    display_override:['fullscreen','standalone'],
    orientation:'any',
    background_color:'#FFFAE0',
    theme_color:'#FFD100',
    prefer_related_applications:false
   };

   if(discoveredIcons.length)manifest.icons=discoveredIcons;

   const manifestHref=`data:application/manifest+json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest))}`;
   let manifestLink=document.head.querySelector('link[rel="manifest"]');
   if(!manifestLink){
    manifestLink=document.createElement('link');
    manifestLink.setAttribute('rel','manifest');
    document.head.appendChild(manifestLink);
   }
   manifestLink.setAttribute('href',manifestHref);
   manifestLink.setAttribute('data-irancell-runtime-manifest','true');

   const fullscreenMedia=typeof window.matchMedia==='function'?window.matchMedia('(display-mode: fullscreen)'):null;
   const standaloneMedia=typeof window.matchMedia==='function'?window.matchMedia('(display-mode: standalone)'):null;

   function IrancellSyncInstalledDisplayMode(){
    const isFullscreen=Boolean(fullscreenMedia?.matches);
    const isStandalone=Boolean(standaloneMedia?.matches||(typeof navigator!=='undefined'&&navigator.standalone===true));
    document.documentElement.dataset.irDisplayMode=isFullscreen?'fullscreen':isStandalone?'standalone':'browser';
    document.documentElement.classList.toggle('ir-installed-app',isFullscreen||isStandalone);
   }

   IrancellSyncInstalledDisplayMode();

   if(fullscreenMedia?.addEventListener)fullscreenMedia.addEventListener('change',IrancellSyncInstalledDisplayMode);
   else fullscreenMedia?.addListener?.(IrancellSyncInstalledDisplayMode);

   if(standaloneMedia?.addEventListener)standaloneMedia.addEventListener('change',IrancellSyncInstalledDisplayMode);
   else standaloneMedia?.addListener?.(IrancellSyncInstalledDisplayMode);

   return function IrancellConfigureDocumentCleanup(){
    if(fullscreenMedia?.removeEventListener)fullscreenMedia.removeEventListener('change',IrancellSyncInstalledDisplayMode);
    else fullscreenMedia?.removeListener?.(IrancellSyncInstalledDisplayMode);

    if(standaloneMedia?.removeEventListener)standaloneMedia.removeEventListener('change',IrancellSyncInstalledDisplayMode);
    else standaloneMedia?.removeListener?.(IrancellSyncInstalledDisplayMode);
   };
  }

  return undefined;
 },[state.settings?.appearance?.fontScale,state.settings?.demo?.enabled]);
 React.useEffect(function IrancellSubscribeHash(){
  if(typeof window==='undefined')return function IrancellHashNoopCleanup(){};
  if(!window.location.hash)window.location.hash=`#/${IRANCELL_BOOT_CONFIG.defaultRoute}`;
  const handler=function IrancellHandleHashChange(){setLocation(IrancellAppParseHashLocation(window.location.hash));};
  window.addEventListener('hashchange',handler);handler();
  return function IrancellCleanupHash(){window.removeEventListener('hashchange',handler);};
 },[]);
 const match=React.useMemo(function IrancellResolveScreen(){return IrancellAppMatchRegisteredScreen(location.route);},[location.route]);
 React.useEffect(function IrancellTrackRoute(){if(match)dispatch({type:'IRANCELL_ROUTE_CHANGED',route:location.route,params:{...match.params,...location.query},screenId:match.screen.screenId});},[dispatch,location.route,location.query,match]);
 const navigate=React.useCallback(function IrancellRuntimeNavigate(target,params){
  const normalizedTarget=String(target||'').replace(/^#\/?/,'').replace(/^\/+/,'');
  const roleScopedTarget=state.session.activeRole==='parent'&&normalizedTarget.startsWith('student/support')?normalizedTarget.replace(/^student\/support/,'parent/support'):state.session.activeRole==='parent'&&normalizedTarget==='help'?'parent/support':state.session.activeRole==='student'&&normalizedTarget==='notifications'?'student/notifications':state.session.activeRole==='student'&&normalizedTarget==='help'?'student/support':target;
  if(location.route!=='auth/otp'&&(normalizedTarget==='auth/otp'||normalizedTarget.startsWith('auth/otp?'))){
   const sourceQuery=new URLSearchParams(location.query||{}).toString();
   return IrancellAppNavigateToRoute(roleScopedTarget,{...(params||{}),from:location.route,fromQuery:sourceQuery})
  }
  return IrancellAppNavigateToRoute(roleScopedTarget,params)
 },[location.route,location.query,state.session.activeRole]);
 const navigateBack=React.useCallback(function IrancellRuntimeNavigateBack(fallbackRoute){
  const history=Array.isArray(state.ui?.navigationHistory)?state.ui.navigationHistory:[];
  const previousRoute=history.length?history[history.length-1]:'';
  dispatch({type:'IRANCELL_NAVIGATION_BACK'});
  return navigate(previousRoute||fallbackRoute||IrancellAppResolveSafeHomeRoute(state))
 },[dispatch,navigate,state]);
 if(!match){const safe=IrancellAppResolveSafeHomeRoute(state);return <div className="ir-standalone-state"><IrancellStatePanel state="error" title="صفحه پیدا نشد" description="نشانی واردشده معتبر نیست یا این صفحه جابه‌جا شده است." action={<IrancellButton onClick={()=>navigate(safe)}>بازگشت به خانه</IrancellButton>}/></div>}
 const{screen}=match,status=state.session.status,role=state.session.activeRole,isAuthenticated=status==='authenticated';
 if(screen.route==='auth/otp'&&!['otp_pending','otp_error'].includes(status))return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="ابتدا شماره موبایل را ثبت کنید" description="صفحه کد یک‌بارمصرف فقط پس از درخواست معتبر ورود فعال است." action={<IrancellButton onClick={()=>navigate('auth/login')}>ورود با کیستی</IrancellButton>}/></div>;
 if(screen.route==='role-select'&&!['role_pending','authenticated'].includes(status))return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="احراز هویت کامل نشده است" description="برای انتخاب نقش، کد یک‌بارمصرف را تأیید کنید." action={<IrancellButton onClick={()=>navigate('auth/login')}>بازگشت به ورود</IrancellButton>}/></div>;
 if(screen.role!=='public'&&!isAuthenticated)return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="برای ادامه وارد شوید" description="برای حفاظت از اطلاعات حساب و دسترسی به امکانات آموزشی، ابتدا وارد حساب خود شوید." action={<IrancellButton onClick={()=>navigate('auth/login')}>رفتن به صفحه ورود</IrancellButton>}/></div>;
 if(screen.route==='prototype/:prototypeId'&&!IRANCELL_BOOT_CONFIG.prototypeCatalogueEnabled){const safe=IrancellAppResolveSafeHomeRoute(state);return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="کاتالوگ نمونه در دسترس نیست" description="این مسیر فقط با پرچم توسعه فعال می‌شود و در تجربه عادی محصول قابل استفاده نیست." action={<IrancellButton onClick={()=>navigate(safe)}>بازگشت به صفحه امن</IrancellButton>}/></div>}
 const roleAllowed=screen.role==='public'||screen.role==='shared'||screen.role===role||role==='admin';
 const permissionAllowed=screen.role==='public'||IrancellHasPermissions(role,screen.permissions);
 if(!roleAllowed||!permissionAllowed){const safe=IrancellAppResolveSafeHomeRoute(state);return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="دسترسی مجاز نیست" description="این صفحه برای نقش فعال یا سطح دسترسی فعلی قابل مشاهده نیست." action={<IrancellButton onClick={()=>navigate(safe)}>بازگشت به خانه نقش</IrancellButton>}/></div>}
 const prototypeId=IrancellAppResolvePrototypeId(screen,location.route);
 const candidateScreenComponent=screen.component;
 const screenComponentIsValid=typeof candidateScreenComponent==='string'||typeof candidateScreenComponent==='function'||Boolean(candidateScreenComponent&&typeof candidateScreenComponent==='object'&&candidateScreenComponent.$$typeof);
 const ScreenComponent=screenComponentIsValid?candidateScreenComponent:null;
 const usesPrototypeScreen=Boolean(prototypeId)&&ScreenComponent===IrancellSharedPrototypePage;
 const resolvedScreen=usesPrototypeScreen?{...screen,prototypeId,fullBleed:true}:screen;
 const fullBleedRoutes=['splash','onboarding','auth/login','auth/otp','role-select','profile-completion','relationship-linking','student/home','student/ask','student/chats','student/chisti','student/binayi','student/binayi/course/:id','student/classes','student/requests','student/classes/request/new','student/offers','student/teachers','student/classes/providers','student/profile'];
 const screenUsesFullBleed=usesPrototypeScreen||Boolean(screen.fullBleed)||fullBleedRoutes.includes(screen.route);
 const parentRootFullscreen=['parent/home','parent/children','parent/payments','parent/profile'].includes(screen.route);
 const page=ScreenComponent?(parentRootFullscreen?<ScreenComponent params={{...match.params,...location.query}} onNavigate={navigate} onBack={navigateBack} screen={resolvedScreen}/>:<div className={`ir-screen-surface ${screenUsesFullBleed?'is-full-bleed':'is-standard'}`}><ScreenComponent params={{...match.params,...location.query}} onNavigate={navigate} onBack={navigateBack} screen={resolvedScreen}/></div>):<div className="ir-screen-surface is-standard"><div className="ir-standalone-state"><IrancellStatePanel state="error" title="صفحه قابل نمایش نیست" description="بارگذاری این بخش کامل نشده است. به صفحه اصلی برگردید و دوباره تلاش کنید." action={<IrancellButton onClick={()=>navigate(IrancellAppResolveSafeHomeRoute(state))}>بازگشت به خانه</IrancellButton>}/></div></div>;
 const isOtpModal=screen.route==='auth/otp';
 const otpSourceRoute=isOtpModal&&location.query.from&&location.query.from!=='auth/otp'?String(location.query.from):'auth/login';
 const otpSourceMatch=isOtpModal?IrancellAppMatchRegisteredScreen(otpSourceRoute):null;
 const OtpSourceComponent=otpSourceMatch&&otpSourceMatch.screen.route!=='prototype/:prototypeId'?otpSourceMatch.screen.component:null;
 const otpSourceComponentIsValid=typeof OtpSourceComponent==='string'||typeof OtpSourceComponent==='function'||Boolean(OtpSourceComponent&&typeof OtpSourceComponent==='object'&&OtpSourceComponent.$$typeof);
 const otpSourceScreen=otpSourceMatch?.screen||null;
 const otpSourceQuery={};
 if(isOtpModal&&location.query.fromQuery)new URLSearchParams(String(location.query.fromQuery)).forEach(function IrancellRestoreOtpSourceQuery(value,key){otpSourceQuery[key]=value;});
 const otpSourceParams=otpSourceMatch?{...otpSourceMatch.params,...otpSourceQuery}:location.query.flow==='student-signup'?{mode:'create'}:{mode:'login'};
 const otpSourcePage=otpSourceComponentIsValid?<OtpSourceComponent params={otpSourceParams} onNavigate={navigate} screen={otpSourceScreen}/>:null;
 const visiblePage=isOtpModal&&otpSourcePage?otpSourcePage:page;
 const dockRoute=isOtpModal?otpSourceRoute:location.route;
 const dockScreen=isOtpModal?otpSourceScreen:resolvedScreen;
 const dockRole=IrancellAppResolvePersistentDockRole(state,dockScreen,dockRoute);
 const showPersistentDock=IrancellAppShouldShowPersistentDock(state,dockScreen,dockRoute,dockRole);
 const content=<div className={`ir-route-layer-host ${isOtpModal?'has-modal':''} ${showPersistentDock?'has-persistent-dock':''} ${parentRootFullscreen?'is-parent-root-fullscreen':''}`.trim()}><div className="ir-route-layer-host__page" aria-hidden={isOtpModal?'true':undefined}>{visiblePage}</div>{showPersistentDock&&<IrancellAppPersistentDock role={dockRole} currentRoute={dockRoute} onNavigate={navigate}/>} {isOtpModal&&page}</div>;
 return <>{content}</>;
}

export default function App(){return <IrancellAppRuntime/>;}
export function IrancellApplication(){return <IrancellAppRuntime/>;}
