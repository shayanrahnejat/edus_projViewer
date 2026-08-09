/* IRANCELL_APP_LEGACY_ENTRY_DISABLED
export function IrancellParseHashLocation(hashValue){
 const raw=String(hashValue||'').replace(/^#\/?/,'');
 const [pathPart,queryPart='']=raw.split('?');
 let decodedRoute=IRANCELL_BOOT_CONFIG.defaultRoute;try{decodedRoute=decodeURIComponent(pathPart||IRANCELL_BOOT_CONFIG.defaultRoute);}catch(error){decodedRoute=IRANCELL_BOOT_CONFIG.defaultRoute;}const route=decodedRoute.replace(/^\/+|\/+$/g,'');
 const query={};
 new URLSearchParams(queryPart).forEach((value,key)=>{query[key]=value});
 return{route,query};
}

export function IrancellMatchRegisteredScreen(route){
 const segments=String(route||'').split('/').filter(Boolean);
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

export function IrancellNavigateToRoute(target,params={}){
 let route=String(target||IRANCELL_BOOT_CONFIG.defaultRoute).replace(/^#\/?/,'').replace(/^\/+/, '');
 const query=new URLSearchParams(params);
 if(typeof window!=='undefined')window.location.hash=`#/${route}${query.toString()?`?${query.toString()}`:''}`;
}

export function IrancellApplicationRuntime(){
 const{state,dispatch}=useIrancellStore();
 const[location,setLocation]=React.useState(()=>IrancellParseHashLocation(typeof window==='undefined'?'':window.location.hash));
 React.useEffect(()=>{if(!window.location.hash)window.location.hash=`#/${IRANCELL_BOOT_CONFIG.defaultRoute}`;const handler=()=>setLocation(IrancellParseHashLocation(window.location.hash));window.addEventListener('hashchange',handler);handler();return()=>window.removeEventListener('hashchange',handler)},[]);
 const match=React.useMemo(()=>IrancellMatchRegisteredScreen(location.route),[location.route]);
 React.useEffect(()=>{if(match)dispatch({type:'IRANCELL_ROUTE_CHANGED',route:location.route,params:{...match.params,...location.query},screenId:match.screen.screenId})},[dispatch,location.route,location.query,match]);
 const navigate=React.useCallback((target,params)=>IrancellNavigateToRoute(target,params),[]);
 if(!match){const safe=IRANCELL_ROLE_HOME_ROUTES[state.session.activeRole]||'splash';return <div className="ir-standalone-state"><IrancellStatePanel state="error" title="صفحه پیدا نشد" description="نشانی واردشده در رجیستری canonical وجود ندارد." action={<IrancellButton onClick={()=>navigate(safe)}>رفتن به صفحه امن</IrancellButton>}/></div>}
 const{screen}=match,role=state.session.activeRole,isAuthenticated=state.session.status==='authenticated';
 if(screen.role!=='public'&&!isAuthenticated)return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="ورود لازم است" description="برای حفاظت از داده‌ها و عملیات حساس، ابتدا با کیستی وارد شوید." action={<IrancellButton onClick={()=>navigate('auth/login')}>ورود امن</IrancellButton>}/></div>;
 const roleAllowed=screen.role==='public'||screen.role==='shared'||screen.role===role||role==='admin';
 const permissionAllowed=screen.role==='public'||IrancellHasPermissions(role,screen.permissions);
 if(!roleAllowed||!permissionAllowed){const safe=IRANCELL_ROLE_HOME_ROUTES[role]||'splash';return <div className="ir-standalone-state"><IrancellStatePanel state="unauthorized" title="دسترسی مجاز نیست" description="این صفحه برای نقش فعال یا سطح دسترسی فعلی قابل مشاهده نیست." action={<IrancellButton onClick={()=>navigate(safe)}>بازگشت به خانه نقش</IrancellButton>}/></div>}
 const ScreenComponent=screen.component;
 const page=<ScreenComponent params={{...match.params,...location.query}} onNavigate={navigate} screen={screen}/>;
 const content=screen.role==='public'?page:<IrancellAppShell currentRoute={location.route} onNavigate={navigate} onRoleChange={nextRole=>{dispatch(IrancellAuthSelectRole(nextRole));navigate(IRANCELL_ROLE_HOME_ROUTES[nextRole])}}>{page}</IrancellAppShell>;
 return <>{content}<IrancellToastStack items={state.ui.toasts} onDismiss={id=>dispatch({type:'IRANCELL_UI_DISMISS_TOAST',id})}/></>;
}
*/
export const IRANCELL_APP_LEGACY_ENTRY_DISABLED=Object.freeze({activeEntry:'index.js'});

