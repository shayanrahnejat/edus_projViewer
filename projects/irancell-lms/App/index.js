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

const IRANCELL_APP_PERSISTENT_NAVIGATION_INLINE_CSS=String.raw`
/* Authoritative dock/sidebar styles. This namespace is isolated from legacy dock rules. */
html body #root .ir-route-layer-host.has-persistent-dock{
    box-sizing:border-box!important;
    position:relative!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:none!important;
    min-height:100dvh!important;
    overflow-x:hidden!important;
    overflow-y:visible!important;
    background:#fffae0!important;
   }

   html body #root .ir-route-layer-host.has-persistent-dock>.ir-route-layer-host__page{
    box-sizing:border-box!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:none!important;
    min-height:100dvh!important;
    height:auto!important;
    margin:0!important;
    overflow:visible!important;
    background:transparent!important;
    transform:none!important;
   }

   html body #root .ir-route-layer-host.has-persistent-dock>.ir-route-layer-host__page>.ir-screen-surface{
    box-sizing:border-box!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:none!important;
    min-height:100dvh!important;
    height:auto!important;
    margin:0!important;
    overflow:visible!important;
    transform:none!important;
   }

   /* Duplicate navigation neutralizer: EDUS merges page and component sources. */
   html body #root .ir-route-layer-host.has-persistent-dock>
   .ir-route-layer-host__page :is(
    .ir-app-persistent-dock,
    .ir-sidebar,
    .ir-bottom-nav,
    .ir-exact-student-dock,
    .ir-exact-family-dock,
    .ir-student-home-svg__dock,
    .ir-svg-app-dock,
    .ir-chisty-dock
   ){
    display:none!important;
    visibility:hidden!important;
    opacity:0!important;
    pointer-events:none!important;
   }

   html body #root .ir-navigation-v8,
   html body #root .ir-navigation-v8 *{
    box-sizing:border-box!important;
    font-family:var(--ir-font-family,"Vazirmatn",sans-serif)!important;
   }

   html body #root .ir-navigation-v8{
    direction:rtl!important;
    color-scheme:light!important;
    contain:layout style!important;
    font:400 14px/1.5 var(--ir-font-family,"Vazirmatn",sans-serif)!important;
    text-align:right!important;
    text-decoration:none!important;
    visibility:visible!important;
    opacity:1!important;
    pointer-events:auto!important;
    isolation:isolate!important;
   }

   html body #root .ir-navigation-v8 button{
    appearance:none!important;
    -webkit-appearance:none!important;
    font:inherit!important;
    line-height:1.5!important;
    text-align:center!important;
    text-decoration:none!important;
    visibility:visible!important;
    opacity:1!important;
    pointer-events:auto!important;
    filter:none!important;
    outline-offset:3px!important;
    cursor:pointer!important;
   }

   html body #root .ir-navigation-v8__icon{
    display:block!important;
    width:22px!important;
    min-width:22px!important;
    height:22px!important;
    fill:none!important;
    stroke:currentColor!important;
    stroke-width:1.8!important;
    stroke-linecap:round!important;
    stroke-linejoin:round!important;
   }

   html body #root .ir-navigation-v8__avatar{
    position:relative!important;
    display:grid!important;
    width:34px!important;
    min-width:34px!important;
    height:34px!important;
    place-items:center!important;
    overflow:visible!important;
    color:#171719!important;
    background:#ffd100!important;
    border-radius:50%!important;
    font-size:12px!important;
    font-weight:900!important;
   }

   html body #root .ir-navigation-v8__avatar img{
    display:block!important;
    width:100%!important;
    height:100%!important;
    object-fit:cover!important;
    border-radius:inherit!important;
   }

   html body #root .ir-navigation-v8__avatar i{
    position:absolute!important;
    top:-4px!important;
    left:-4px!important;
    display:grid!important;
    min-width:17px!important;
    height:17px!important;
    place-items:center!important;
    padding:0 3px!important;
    color:#fff!important;
    background:#ff3b30!important;
    border:2px solid #fff!important;
    border-radius:999px!important;
    font-size:7px!important;
    font-style:normal!important;
    font-weight:900!important;
    line-height:1!important;
   }

   @media(max-width:1023px){
    html body #root .ir-route-layer-host.has-persistent-dock>.ir-route-layer-host__page{
     padding:0 0 calc(92px + env(safe-area-inset-bottom))!important;
    }

    html body #root .ir-navigation-v8{
     position:fixed!important;
     inset:auto 12px calc(12px + env(safe-area-inset-bottom)) 12px!important;
     z-index:2147483000!important;
     display:block!important;
     width:auto!important;
     min-width:0!important;
     max-width:none!important;
     height:70px!important;
     min-height:70px!important;
     max-height:70px!important;
     margin:0!important;
     padding:7px!important;
     overflow:visible!important;
     color:#aaaab2!important;
     background:rgba(23,23,25,.97)!important;
     border:1px solid rgba(255,255,255,.09)!important;
     border-radius:24px!important;
     box-shadow:0 18px 42px rgba(17,17,17,.25)!important;
     backdrop-filter:blur(18px)!important;
     -webkit-backdrop-filter:blur(18px)!important;
     transform:none!important;
    }

    html body #root .ir-navigation-v8__desktop{
     display:none!important;
    }

    html body #root .ir-navigation-v8__mobile{
     display:grid!important;
     width:100%!important;
     height:100%!important;
     grid-template-columns:repeat(var(--ir-navigation-item-count,5),minmax(0,1fr))!important;
     align-items:center!important;
     justify-content:stretch!important;
     gap:3px!important;
    }

    html body #root .ir-navigation-v8__mobile-item{
     position:relative!important;
     display:flex!important;
     width:100%!important;
     min-width:0!important;
     max-width:none!important;
     height:56px!important;
     min-height:56px!important;
     flex-direction:column!important;
     align-items:center!important;
     justify-content:center!important;
     gap:3px!important;
     margin:0!important;
     padding:4px 2px!important;
     overflow:hidden!important;
     color:#aaaab2!important;
     background:transparent!important;
     border:0!important;
     border-radius:17px!important;
     box-shadow:none!important;
     transform:none!important;
    }

    html body #root .ir-navigation-v8__mobile-item>span{
     display:block!important;
     width:100%!important;
     overflow:hidden!important;
     font-size:8px!important;
     font-weight:700!important;
     line-height:1.2!important;
     text-align:center!important;
     text-overflow:ellipsis!important;
     white-space:nowrap!important;
    }

    html body #root .ir-navigation-v8__mobile-item.is-active{
     color:#ffd100!important;
     background:#2c2c30!important;
    }

    html body #root .ir-navigation-v8__mobile-item.is-primary{
     color:#171719!important;
     background:#ffd100!important;
     border-radius:18px!important;
     box-shadow:0 8px 20px rgba(255,209,0,.2)!important;
    }

    html body #root .ir-navigation-v8__mobile-item.is-primary>span{
     font-weight:900!important;
    }

    html body #root .ir-navigation-v8__mobile-item .ir-navigation-v8__avatar{
     width:25px!important;
     min-width:25px!important;
     height:25px!important;
    }
   }

   @media(min-width:1024px){
    html body #root .ir-route-layer-host.has-persistent-dock>.ir-route-layer-host__page{
     padding:0 112px 0 0!important;
     transition:padding-right .24s cubic-bezier(.2,.8,.2,1)!important;
    }

    html body #root .ir-navigation-v8{
     position:fixed!important;
     inset:20px 20px 20px auto!important;
     z-index:2147483000!important;
     display:block!important;
     width:72px!important;
     min-width:72px!important;
     max-width:72px!important;
     height:auto!important;
     min-height:0!important;
     max-height:none!important;
     margin:0!important;
     padding:14px 10px!important;
     overflow:hidden!important;
     color:#74767f!important;
     background:rgba(255,255,255,.95)!important;
     border:1px solid rgba(228,222,193,.98)!important;
     border-radius:26px!important;
     box-shadow:0 16px 42px rgba(17,17,17,.1)!important;
     backdrop-filter:blur(18px)!important;
     -webkit-backdrop-filter:blur(18px)!important;
     transform:none!important;
     transition:width .24s cubic-bezier(.2,.8,.2,1),min-width .24s cubic-bezier(.2,.8,.2,1),max-width .24s cubic-bezier(.2,.8,.2,1),padding .24s cubic-bezier(.2,.8,.2,1)!important;
    }

    html body #root .ir-navigation-v8:hover,
    html body #root .ir-navigation-v8:focus-within{
     width:300px!important;
     min-width:300px!important;
     max-width:300px!important;
     padding-right:18px!important;
     padding-left:18px!important;
     background:rgba(255,255,255,.99)!important;
     box-shadow:0 22px 58px rgba(17,17,17,.14)!important;
    }

    html body #root .ir-navigation-v8__mobile{
     display:none!important;
    }

    html body #root .ir-navigation-v8__desktop{
     display:flex!important;
     width:100%!important;
     height:100%!important;
     min-height:0!important;
     flex-direction:column!important;
     align-items:center!important;
     gap:5px!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__desktop,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__desktop{
     align-items:stretch!important;
    }

    html body #root .ir-navigation-v8__brand{
     display:flex!important;
     width:48px!important;
     min-width:48px!important;
     max-width:48px!important;
     min-height:54px!important;
     flex:0 0 54px!important;
     align-items:center!important;
     justify-content:center!important;
     gap:0!important;
     margin:0 0 7px!important;
     padding:5px 0 11px!important;
     overflow:hidden!important;
     border-bottom:1px solid transparent!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__brand,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__brand{
     width:100%!important;
     min-width:0!important;
     max-width:none!important;
     justify-content:flex-start!important;
     gap:10px!important;
     border-bottom-color:#e7e2ca!important;
    }

    html body #root .ir-navigation-v8__brand-logo{
     display:grid!important;
     width:44px!important;
     min-width:44px!important;
     height:31px!important;
     place-items:center!important;
     flex:0 0 44px!important;
     color:#111!important;
     background:#ffd100!important;
     border:2px solid #111!important;
     border-radius:50%!important;
     font-family:Arial,Tahoma,sans-serif!important;
     font-size:8px!important;
     font-weight:900!important;
     line-height:1!important;
     transform:rotate(-2deg)!important;
    }

    html body #root .ir-navigation-v8__brand-logo b{
     display:block!important;
     font:900 8px/8px Arial,Tahoma,sans-serif!important;
    }

    html body #root .ir-navigation-v8__brand-logo small{
     display:block!important;
     margin-top:-2px!important;
     font:900 6px/6px Arial,Tahoma,sans-serif!important;
    }

    html body #root .ir-navigation-v8__brand-copy{
     display:flex!important;
     width:0!important;
     min-width:0!important;
     max-width:0!important;
     flex-direction:column!important;
     gap:2px!important;
     overflow:hidden!important;
     opacity:0!important;
     text-align:right!important;
     white-space:nowrap!important;
     transition:opacity .15s ease .06s!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__brand-copy,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__brand-copy{
     width:auto!important;
     max-width:190px!important;
     opacity:1!important;
    }

    html body #root .ir-navigation-v8__brand-copy strong{
     color:#171719!important;
     font-size:12px!important;
     font-weight:900!important;
     line-height:1.5!important;
    }

    html body #root .ir-navigation-v8__brand-copy small{
     color:#85858d!important;
     font-size:9px!important;
     line-height:1.5!important;
    }

    html body #root .ir-navigation-v8__profile{
     display:grid!important;
     width:48px!important;
     min-width:48px!important;
     max-width:48px!important;
     height:50px!important;
     min-height:50px!important;
     max-height:50px!important;
     flex:0 0 50px!important;
     grid-template-columns:34px 0!important;
     align-items:center!important;
     justify-content:center!important;
     gap:0!important;
     margin:0 0 5px!important;
     padding:0!important;
     overflow:hidden!important;
     color:#171719!important;
     background:#faf5df!important;
     border:1px solid #eee5bd!important;
     border-radius:16px!important;
     box-shadow:none!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__profile,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__profile{
     width:100%!important;
     min-width:0!important;
     max-width:none!important;
     height:62px!important;
     min-height:62px!important;
     max-height:62px!important;
     flex-basis:62px!important;
     grid-template-columns:42px minmax(0,1fr)!important;
     justify-content:stretch!important;
     gap:10px!important;
     padding:9px 11px!important;
    }

    html body #root .ir-navigation-v8__profile-copy{
     display:flex!important;
     width:0!important;
     min-width:0!important;
     max-width:0!important;
     flex-direction:column!important;
     gap:2px!important;
     overflow:hidden!important;
     opacity:0!important;
     text-align:right!important;
     white-space:nowrap!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__profile-copy,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__profile-copy{
     width:auto!important;
     max-width:none!important;
     opacity:1!important;
    }

    html body #root .ir-navigation-v8__profile-copy strong{
     overflow:hidden!important;
     color:#171719!important;
     font-size:11px!important;
     font-weight:900!important;
     text-overflow:ellipsis!important;
     white-space:nowrap!important;
    }

    html body #root .ir-navigation-v8__profile-copy small{
     overflow:hidden!important;
     color:#777982!important;
     font-size:9px!important;
     text-overflow:ellipsis!important;
     white-space:nowrap!important;
    }

    html body #root .ir-navigation-v8__items{
     display:flex!important;
     width:100%!important;
     min-height:0!important;
     flex:1 1 auto!important;
     flex-direction:column!important;
     align-items:center!important;
     gap:4px!important;
     overflow-y:auto!important;
     overflow-x:hidden!important;
     scrollbar-width:none!important;
    }

    html body #root .ir-navigation-v8__items::-webkit-scrollbar{
     display:none!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__items,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__items{
     align-items:stretch!important;
    }

    html body #root .ir-navigation-v8__desktop-item{
     display:grid!important;
     width:48px!important;
     min-width:48px!important;
     max-width:48px!important;
     height:45px!important;
     min-height:45px!important;
     max-height:45px!important;
     flex:0 0 45px!important;
     grid-template-columns:23px 0!important;
     align-items:center!important;
     justify-content:center!important;
     gap:0!important;
     margin:0!important;
     padding:0!important;
     overflow:hidden!important;
     color:#74767f!important;
     background:transparent!important;
     border:0!important;
     border-radius:14px!important;
     box-shadow:none!important;
     transform:none!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__desktop-item,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__desktop-item{
     width:100%!important;
     min-width:0!important;
     max-width:none!important;
     grid-template-columns:24px minmax(0,1fr)!important;
     justify-content:stretch!important;
     gap:12px!important;
     padding:0 13px!important;
    }

    html body #root .ir-navigation-v8__desktop-item>span{
     display:block!important;
     width:0!important;
     min-width:0!important;
     max-width:0!important;
     overflow:hidden!important;
     opacity:0!important;
     color:inherit!important;
     font-size:11px!important;
     font-weight:800!important;
     line-height:1.5!important;
     text-align:right!important;
     text-overflow:ellipsis!important;
     white-space:nowrap!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__desktop-item>span,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__desktop-item>span{
     width:auto!important;
     max-width:none!important;
     opacity:1!important;
    }

    html body #root .ir-navigation-v8__desktop-item.is-active,
    html body #root .ir-navigation-v8__desktop-item.is-primary{
     color:#171719!important;
     background:#ffd100!important;
    }

    html body #root .ir-navigation-v8__footer{
     display:grid!important;
     width:48px!important;
     min-width:48px!important;
     max-width:48px!important;
     height:46px!important;
     min-height:46px!important;
     max-height:46px!important;
     flex:0 0 46px!important;
     grid-template-columns:22px 0!important;
     align-items:center!important;
     justify-content:center!important;
     gap:0!important;
     margin:7px 0 0!important;
     padding:0!important;
     overflow:hidden!important;
     color:#171719!important;
     background:#f4f4f5!important;
     border:1px solid #e5e5e8!important;
     border-radius:14px!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__footer,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__footer{
     width:100%!important;
     min-width:0!important;
     max-width:none!important;
     grid-template-columns:22px minmax(0,1fr)!important;
     justify-content:stretch!important;
     gap:11px!important;
     padding:0 13px!important;
    }

    html body #root .ir-navigation-v8__footer>span{
     display:block!important;
     width:0!important;
     max-width:0!important;
     overflow:hidden!important;
     opacity:0!important;
     font-size:10px!important;
     font-weight:900!important;
     text-align:right!important;
     white-space:nowrap!important;
    }

    html body #root .ir-navigation-v8:hover .ir-navigation-v8__footer>span,
    html body #root .ir-navigation-v8:focus-within .ir-navigation-v8__footer>span{
     width:auto!important;
     max-width:none!important;
     opacity:1!important;
    }
   }

   @media(min-width:1280px){
    html body #root .ir-route-layer-host.has-persistent-dock:has(>.ir-navigation-v8:hover)>.ir-route-layer-host__page,
    html body #root .ir-route-layer-host.has-persistent-dock:has(>.ir-navigation-v8:focus-within)>.ir-route-layer-host__page{
     padding-right:340px!important;
    }
   }
`;

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
  bell:<><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  logout:<><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>
 };
 const aliases={ask:'spark',learning:'book',classes:'calendar',payments:'wallet',consents:'shield',requests:'book',teachers:'children',earnings:'wallet',library:'book',upload:'plus',analytics:'report',users:'children',providers:'children',complaints:'shield',system:'shield'};
 const resolvedName=aliases[name]||name;
 return <svg viewBox="0 0 24 24" aria-hidden="true" style={{display:'block',width:22,minWidth:22,height:22,fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round',pointerEvents:'none'}}>{paths[resolvedName]||paths.home}</svg>
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
 if(normalizedRoute.startsWith('prototype/')||normalizedRoute.startsWith('parent-gate/')||normalizedRoute.startsWith('class/'))return false;
 if(normalizedRoute.includes('/processing')||normalizedRoute.includes('/redirect'))return false;
 return screen?.role!=='public';
}

export function IrancellAppUseCompactNavigation(){
 const[compact,setCompact]=React.useState(function IrancellAppInitialCompactNavigation(){return typeof window!=='undefined'?window.innerWidth<1024:false;});
 React.useEffect(function IrancellAppTrackCompactNavigation(){
  if(typeof window==='undefined')return function IrancellAppCompactNavigationNoopCleanup(){};
  function updateCompactNavigation(){setCompact(window.innerWidth<1024);}
  updateCompactNavigation();
  window.addEventListener('resize',updateCompactNavigation,{passive:true});
  return function IrancellAppCompactNavigationCleanup(){window.removeEventListener('resize',updateCompactNavigation);};
 },[]);
 return compact;
}

export function IrancellAppPersistentDock({role,currentRoute,onNavigate,compact=false,onExpandedChange}){
 const{state,dispatch}=useIrancellStore();
 const[desktopExpanded,setDesktopExpanded]=React.useState(function IrancellAppInitialDesktopSidebarExpansion(){
  if(typeof window==='undefined')return false;
  try{return window.localStorage.getItem('irancell-lms-sidebar-expanded')==='true';}catch(error){return false;}
 });

 React.useEffect(function IrancellAppSyncNavigationExpansion(){
  onExpandedChange?.(!compact&&desktopExpanded);
 },[compact,desktopExpanded,onExpandedChange]);

 const normalizedRoute=String(currentRoute||'').replace(/^\/+|\/+$/g,'');
 const baseItems=IRANCELL_APP_PERSISTENT_DOCKS[role]||[];
 const items=role==='parent'?[...baseItems].reverse():baseItems;
 const unreadCount=Math.max(0,Number(state.notifications.unreadCount)||0);
 const dockAvatarUser=state.identity.usersById[state.session.currentUserId]||null;
 const sessionRoles=Array.isArray(state.session.availableRoles)?state.session.availableRoles:[];
 const userRoles=Array.isArray(dockAvatarUser?.roles)?dockAvatarUser.roles:[];
 const availableRoles=Array.from(new Set([...sessionRoles,...userRoles])).filter(roleKey=>Boolean(IRANCELL_ROLE_HOME_ROUTES[roleKey]));
 const canSwitchRole=availableRoles.length>1;
 const dockAvatarOverride=typeof dockAvatarUser?.avatarDataUrl==='string'?dockAvatarUser.avatarDataUrl.trim():'';
 const dockAvatarHasOverride=Boolean(dockAvatarOverride);
 const dockAvatar=role==='student'?(dockAvatarHasOverride?dockAvatarOverride:IRANCELL_PAGE_STUDENT_HOME_AVATAR):(dockAvatarHasOverride?dockAvatarOverride:null);
 const dockAvatarInitial=String(dockAvatarUser?.name||'خ').trim().charAt(0)||'خ';
 const roleTitles={student:'دانش‌آموز',parent:'خانواده',academy:'آموزشگاه','content-provider':'تولیدکننده محتوا',admin:'مدیریت سامانه'};
 const profileItem=baseItems.find(item=>item.icon==='user'||String(item.route||'').includes('profile'))||null;
 const profileRoute=profileItem?.route||(role==='admin'?'admin/settings':IRANCELL_ROLE_HOME_ROUTES[role]||'student/home');
 const profileSubtitle=role==='student'?(dockAvatarUser?.grade||'دانش‌آموز'):roleTitles[role]||'حساب کاربری';
 const desktopItems=items.filter(item=>item.route!==profileRoute);
 const mobileProfileItem=items.find(item=>item.route===profileRoute)||null;
 const initialMobileItems=items.slice(0,5);
 const mobileItems=mobileProfileItem&&!initialMobileItems.includes(mobileProfileItem)?[...items.filter(item=>item!==mobileProfileItem).slice(0,4),mobileProfileItem]:initialMobileItems;
 const desktopSupplementalItems=role==='student'?[
  {label:'تکالیف و تمرین‌ها',route:'student/assignments',icon:'book',matches:['student/assignments']},
  {label:'آمار یادگیری',route:'student/statistics',icon:'report',matches:['student/statistics']},
  {label:'کارنامه و دستاوردها',route:'student/achievements',icon:'report',matches:['student/achievements','student/badges','student/points','student/certificates']},
  {label:'اعلان‌ها',route:'student/notifications',icon:'bell',matches:['student/notifications']}
 ]:[];
 const isDesktop=!compact;
 const isExpanded=isDesktop&&desktopExpanded;
 const fontFamily='"Vazirmatn",Tahoma,Arial,sans-serif';
 const buttonReset={boxSizing:'border-box',appearance:'none',WebkitAppearance:'none',fontFamily,fontStyle:'normal',lineHeight:1.5,textDecoration:'none',cursor:'pointer',opacity:1,visibility:'visible',pointerEvents:'auto',outlineOffset:3,filter:'none'};
 const navigationStyle=isDesktop?{
  boxSizing:'border-box',position:'fixed',top:20,right:20,bottom:20,left:'auto',zIndex:2147483000,display:'block',width:isExpanded?300:78,minWidth:isExpanded?300:78,maxWidth:isExpanded?300:78,height:'calc(100dvh - 40px)',minHeight:0,maxHeight:'calc(100dvh - 40px)',margin:0,padding:isExpanded?'18px 16px':'14px 10px',overflow:'hidden',direction:'rtl',color:'#4e5058',background:'rgba(255,255,255,.99)',border:'1px solid #e8e1c5',borderRadius:26,boxShadow:isExpanded?'0 22px 58px rgba(68,55,0,.14)':'0 12px 34px rgba(68,55,0,.09)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',fontFamily,fontSize:14,lineHeight:1.5,textAlign:'right',visibility:'visible',opacity:1,pointerEvents:'auto',isolation:'isolate',transform:'none',transition:'width .24s cubic-bezier(.2,.8,.2,1), min-width .24s cubic-bezier(.2,.8,.2,1), max-width .24s cubic-bezier(.2,.8,.2,1), padding .24s cubic-bezier(.2,.8,.2,1), box-shadow .2s ease'
 }:{
  boxSizing:'border-box',position:'fixed',top:'auto',right:12,bottom:'calc(12px + env(safe-area-inset-bottom))',left:12,zIndex:2147483000,display:'block',width:'auto',minWidth:0,maxWidth:'none',height:72,minHeight:72,maxHeight:72,margin:0,padding:7,overflow:'visible',direction:'rtl',color:'#4d4f56',background:'rgba(255,255,255,.97)',border:'1px solid rgba(222,190,26,.48)',borderRadius:24,boxShadow:'0 18px 42px rgba(68,55,0,.18)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',fontFamily,fontSize:14,lineHeight:1.5,textAlign:'right',visibility:'visible',opacity:1,pointerEvents:'auto',isolation:'isolate',transform:'none'
 };

 function dockItemIsActive(item){
  return(item.matches||[item.route]).some(match=>match.endsWith('/')?normalizedRoute.startsWith(match):normalizedRoute===match||normalizedRoute.startsWith(`${match}/`));
 }

 function dockItemUsesAvatar(item){
  return item.route===profileRoute||item.route==='student/profile'||item.route==='parent/profile';
 }

 function dockAvatarElement(size){
  return <b style={{boxSizing:'border-box',position:'relative',display:'grid',width:size,minWidth:size,height:size,placeItems:'center',overflow:'visible',color:'#171719',background:'#ffd100',borderRadius:'50%',fontFamily,fontSize:size<=25?9:12,fontWeight:900,lineHeight:1}}>
   {dockAvatar?<img src={dockAvatar} alt="" style={{display:'block',width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:<span aria-hidden="true">{dockAvatarInitial}</span>}
   {role==='student'&&unreadCount>0&&<i style={{boxSizing:'border-box',position:'absolute',top:-4,left:-4,display:'grid',minWidth:17,height:17,placeItems:'center',padding:'0 3px',color:'#fff',background:'#ff3b30',border:'2px solid #fff',borderRadius:999,fontFamily,fontSize:7,fontStyle:'normal',fontWeight:900,lineHeight:1}}>{unreadCount>9?'9+':unreadCount}</i>}
  </b>;
 }

 function desktopItemStyle(item,active){
  const selected=Boolean(active||item.primary);
  return {...buttonReset,display:'grid',width:isExpanded?'100%':54,minWidth:isExpanded?0:54,maxWidth:isExpanded?'none':54,height:48,minHeight:48,maxHeight:48,flex:'0 0 48px',gridTemplateColumns:isExpanded?'24px minmax(0,1fr)':'23px 0',alignItems:'center',justifyContent:isExpanded?'stretch':'center',gap:isExpanded?12:0,margin:0,padding:isExpanded?'0 13px':0,overflow:'hidden',color:selected?'#171719':'#5f6168',background:selected?'#fffdf2':'transparent',border:`1px solid ${selected?'#ffd100':'transparent'}`,borderRadius:14,boxShadow:selected?'0 8px 18px rgba(255,209,0,.12)':'none',transform:'none'};
 }

 function desktopItemLabelStyle(){
  return {display:'block',width:isExpanded?'auto':0,minWidth:0,maxWidth:isExpanded?'none':0,overflow:'hidden',opacity:isExpanded?1:0,color:'inherit',fontFamily,fontSize:11,fontWeight:800,lineHeight:1.5,textAlign:'right',textOverflow:'ellipsis',whiteSpace:'nowrap'};
 }

 function mobileItemStyle(item,active){
  return {...buttonReset,position:'relative',display:'flex',width:'100%',minWidth:0,maxWidth:'none',height:58,minHeight:58,flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,margin:0,padding:'4px 2px',overflow:'hidden',color:active||item.primary?'#171719':'#696b72',background:active||item.primary?'#ffd100':'transparent',border:`1px solid ${active||item.primary?'#e5ba00':'transparent'}`,borderRadius:18,boxShadow:active||item.primary?'0 8px 20px rgba(255,209,0,.2)':'none',transform:'none'};
 }

 function logout(){
  dispatch({type:'IRANCELL_AUTH_LOGOUT'});
  setDesktopExpanded(false);
  onNavigate?.('auth/login');
 }

 function openRoleSwitcher(){
  setDesktopExpanded(false);
  onExpandedChange?.(false);
  onNavigate?.('role-select');
 }

 function updateDesktopExpanded(nextExpanded){
  if(!isDesktop)return;
  const expanded=Boolean(nextExpanded);
  setDesktopExpanded(expanded);
  if(typeof window!=='undefined')try{window.localStorage.setItem('irancell-lms-sidebar-expanded',expanded?'true':'false');}catch(error){}
 }

 return <nav data-ir-navigation-inline="v15-toggle" data-ir-navigation-mounted="true" data-ir-navigation-route={normalizedRoute} style={navigationStyle} dir="rtl" aria-label="ناوبری اصلی" aria-expanded={isExpanded} onKeyDown={event=>{if(event.key==='Escape'&&isExpanded){updateDesktopExpanded(false);event.stopPropagation()}}}>
   {isDesktop&&<div data-ir-navigation-surface="desktop" style={{boxSizing:'border-box',display:'flex',width:'100%',height:'100%',minHeight:0,flexDirection:'column',alignItems:isExpanded?'stretch':'center',gap:5,overflow:'hidden',borderRadius:22}}>
    <header aria-label="پلتفرم آموزشی ایرانسل" style={{boxSizing:'border-box',display:'flex',width:isExpanded?'100%':54,minWidth:isExpanded?0:54,maxWidth:isExpanded?'none':54,minHeight:58,flex:'0 0 58px',alignItems:'center',justifyContent:isExpanded?'flex-start':'center',gap:isExpanded?10:0,margin:'0 0 7px',padding:'5px 0 11px',overflow:'hidden',borderBottom:isExpanded?'1px solid #eee7cc':'1px solid transparent'}}>
     <span aria-hidden="true" style={{boxSizing:'border-box',display:'grid',width:44,minWidth:44,height:31,placeItems:'center',flex:'0 0 44px',color:'#111',background:'#ffd100',border:'2px solid #111',borderRadius:'50%',fontFamily,fontSize:8,fontWeight:900,lineHeight:1,transform:'rotate(-2deg)'}}><b style={{display:'block',fontFamily,fontSize:8,fontWeight:900,lineHeight:'8px'}}>ایرانسل</b><small style={{display:'block',marginTop:-2,fontFamily,fontSize:6,fontWeight:900,lineHeight:'6px'}}>MTN</small></span>
     <span style={{boxSizing:'border-box',display:'flex',width:isExpanded?'auto':0,minWidth:0,maxWidth:isExpanded?190:0,flexDirection:'column',gap:2,overflow:'hidden',opacity:isExpanded?1:0,textAlign:'right',whiteSpace:'nowrap',transition:'opacity .15s ease .06s'}}><strong style={{color:'#202024',fontFamily,fontSize:12,fontWeight:900,lineHeight:1.5}}>پلتفرم آموزشی ایرانسل</strong><small style={{color:'#85858d',fontFamily,fontSize:9,lineHeight:1.5}}>{roleTitles[role]||'حساب کاربری'}</small></span>
    </header>

    <button type="button" aria-label={isExpanded?'جمع کردن منوی کناری':'باز کردن منوی کناری'} aria-expanded={isExpanded} title={isExpanded?'جمع کردن منو':'باز کردن منو'} onClick={()=>updateDesktopExpanded(!isExpanded)} style={{...buttonReset,display:'grid',width:isExpanded?'100%':54,minWidth:isExpanded?0:54,maxWidth:isExpanded?'none':54,height:44,minHeight:44,maxHeight:44,flex:'0 0 44px',gridTemplateColumns:isExpanded?'24px minmax(0,1fr)':'24px 0',alignItems:'center',justifyContent:isExpanded?'stretch':'center',gap:isExpanded?11:0,margin:'0 0 7px',padding:isExpanded?'0 13px':0,overflow:'hidden',color:'#4f460f',background:'#fff8ce',border:'1px solid #ead35c',borderRadius:13,boxShadow:'none'}}>
     <span aria-hidden="true" style={{display:'grid',width:24,height:24,placeItems:'center',fontFamily,fontSize:22,fontWeight:900,lineHeight:1}}>{isExpanded?'›':'‹'}</span>
     <span style={{display:'block',width:isExpanded?'auto':0,minWidth:0,maxWidth:isExpanded?'none':0,overflow:'hidden',opacity:isExpanded?1:0,fontFamily,fontSize:10,fontWeight:900,textAlign:'right',whiteSpace:'nowrap'}}>{isExpanded?'جمع کردن منو':'باز کردن منو'}</span>
    </button>

    <button type="button" aria-label="مشاهده پروفایل" aria-current={dockItemIsActive(profileItem||{route:profileRoute})?'page':undefined} onClick={()=>onNavigate?.(profileRoute)} style={{...buttonReset,display:'grid',width:isExpanded?'100%':54,minWidth:isExpanded?0:54,maxWidth:isExpanded?'none':54,height:isExpanded?66:54,minHeight:isExpanded?66:54,maxHeight:isExpanded?66:54,flex:isExpanded?'0 0 66px':'0 0 54px',gridTemplateColumns:isExpanded?'42px minmax(0,1fr)':'34px 0',alignItems:'center',justifyContent:isExpanded?'stretch':'center',gap:isExpanded?10:0,margin:'0 0 7px',padding:isExpanded?'9px 11px':0,overflow:'hidden',color:'#171719',background:dockItemIsActive(profileItem||{route:profileRoute})?'#fff9d7':'#fffdf2',border:'1px solid #ffd100',borderRadius:16,boxShadow:'0 8px 20px rgba(68,55,0,.07)'}}>
     {dockAvatarElement(34)}
     <span style={{boxSizing:'border-box',display:'flex',width:isExpanded?'auto':0,minWidth:0,maxWidth:isExpanded?'none':0,flexDirection:'column',gap:2,overflow:'hidden',opacity:isExpanded?1:0,textAlign:'right',whiteSpace:'nowrap'}}>
      <strong style={{overflow:'hidden',color:'inherit',fontFamily,fontSize:11,fontWeight:900,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{dockAvatarUser?.name||'کاربر ایرانسل'}</strong>
      <small style={{overflow:'hidden',color:'#74767d',fontFamily,fontSize:9,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profileSubtitle}</small>
     </span>
    </button>

    {canSwitchRole&&<button type="button" aria-label="تغییر نقش فعال" title={isExpanded?'':'تغییر نقش'} onClick={openRoleSwitcher} style={{...buttonReset,display:'grid',width:isExpanded?'100%':54,minWidth:isExpanded?0:54,maxWidth:isExpanded?'none':54,height:44,minHeight:44,maxHeight:44,flex:'0 0 44px',gridTemplateColumns:isExpanded?'22px minmax(0,1fr)':'22px 0',alignItems:'center',justifyContent:isExpanded?'stretch':'center',gap:isExpanded?11:0,margin:'0 0 5px',padding:isExpanded?'0 13px':0,overflow:'hidden',color:'#5F5100',background:'#FFF8D1',border:'1px solid #E9D15C',borderRadius:13}}>
     <IrancellAppPersistentDockIcon name="children"/>
     <span style={{display:'block',width:isExpanded?'auto':0,maxWidth:isExpanded?'none':0,overflow:'hidden',opacity:isExpanded?1:0,fontFamily,fontSize:10,fontWeight:900,textAlign:'right',whiteSpace:'nowrap'}}>تغییر نقش فعال</span>
    </button>}

    <div style={{boxSizing:'border-box',display:'flex',width:'100%',minHeight:0,flex:'1 1 auto',flexDirection:'column',alignItems:isExpanded?'stretch':'center',gap:4,overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none'}}>
     {desktopItems.map(item=>{
      const active=dockItemIsActive(item);
      return <button type="button" key={`desktop-${item.route}`} aria-label={item.label} aria-current={active?'page':undefined} onClick={()=>onNavigate?.(item.route)} style={desktopItemStyle(item,active)}>
       <IrancellAppPersistentDockIcon name={item.icon}/>
       <span style={desktopItemLabelStyle()}>{item.label}</span>
      </button>
     })}
     {desktopSupplementalItems.map(item=>{
      const active=dockItemIsActive(item);
      return <button type="button" key={`desktop-extra-${item.route}`} aria-label={item.label} aria-current={active?'page':undefined} onClick={()=>onNavigate?.(item.route)} style={desktopItemStyle(item,active)}>
       <IrancellAppPersistentDockIcon name={item.icon}/>
       <span style={desktopItemLabelStyle()}>{item.label}</span>
      </button>
     })}
    </div>

    <button type="button" aria-label="خروج امن" onClick={logout} style={{...buttonReset,display:'grid',width:isExpanded?'100%':54,minWidth:isExpanded?0:54,maxWidth:isExpanded?'none':54,height:46,minHeight:46,maxHeight:46,flex:'0 0 46px',gridTemplateColumns:isExpanded?'22px minmax(0,1fr)':'22px 0',alignItems:'center',justifyContent:isExpanded?'stretch':'center',gap:isExpanded?11:0,margin:'7px 0 0',padding:isExpanded?'0 13px':0,overflow:'hidden',color:'#8f3434',background:'#fff4f4',border:'1px solid #f2d5d5',borderRadius:14}}>
     <IrancellAppPersistentDockIcon name="logout"/>
     <span style={{display:'block',width:isExpanded?'auto':0,maxWidth:isExpanded?'none':0,overflow:'hidden',opacity:isExpanded?1:0,fontFamily,fontSize:10,fontWeight:900,textAlign:'right',whiteSpace:'nowrap'}}>خروج امن</span>
    </button>
   </div>}

   {!isDesktop&&canSwitchRole&&<button type="button" aria-label="تغییر نقش فعال" onClick={openRoleSwitcher} style={{...buttonReset,position:'absolute',top:-46,right:0,display:'inline-flex',minWidth:102,minHeight:38,alignItems:'center',justifyContent:'center',gap:7,margin:0,padding:'7px 12px',color:'#202024',background:'#FFD100',border:'1px solid #E4BA00',borderRadius:13,boxShadow:'0 10px 24px rgba(68,55,0,.18)',fontFamily,fontSize:10,fontWeight:900}}>
    <IrancellAppPersistentDockIcon name="children"/>
    <span>تغییر نقش</span>
   </button>}
   {!isDesktop&&<div data-ir-navigation-surface="mobile" style={{boxSizing:'border-box',display:'grid',width:'100%',height:'100%',gridTemplateColumns:`repeat(${Math.max(mobileItems.length,1)},minmax(0,1fr))`,alignItems:'center',justifyContent:'stretch',gap:3}}>
    {mobileItems.map(item=>{
     const active=dockItemIsActive(item);
     const avatarProfile=dockItemUsesAvatar(item);
     return <button type="button" key={`mobile-${item.route}`} aria-label={item.label} aria-current={active?'page':undefined} onClick={()=>onNavigate?.(item.route)} style={mobileItemStyle(item,active)}>
      {avatarProfile?dockAvatarElement(25):<IrancellAppPersistentDockIcon name={item.icon}/>}
      <span style={{display:'block',width:'100%',overflow:'hidden',fontFamily,fontSize:8,fontWeight:item.primary?900:700,lineHeight:1.2,textAlign:'center',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>
     </button>
    })}
   </div>}
 </nav>
}

export function IrancellAppRuntime(){
 const{state,dispatch}=useIrancellStore();
 const[location,setLocation]=React.useState(function IrancellInitialLocation(){return IrancellAppParseHashLocation(typeof window==='undefined'?'':window.location.hash);});
 const routePageRef=React.useRef(null);
 const compactNavigation=IrancellAppUseCompactNavigation();
 const[desktopNavigationExpanded,setDesktopNavigationExpanded]=React.useState(function IrancellAppInitialDesktopNavigationReserve(){
  if(typeof window==='undefined')return false;
  try{return window.localStorage.getItem('irancell-lms-sidebar-expanded')==='true';}catch(error){return false;}
 });
 React.useEffect(function IrancellAppResetDesktopNavigationExpansion(){if(compactNavigation)setDesktopNavigationExpanded(false);},[compactNavigation]);
 React.useEffect(function IrancellConfigureDocument(){
  if(typeof document==='undefined')return undefined;

  document.documentElement.lang=IRANCELL_BOOT_CONFIG.language;
  document.documentElement.dir=IRANCELL_BOOT_CONFIG.direction;
  document.documentElement.dataset.irFontScale=state.settings?.appearance?.fontScale||'comfortable';
  document.documentElement.dataset.irDemoMode=state.settings?.demo?.enabled===false?'off':'on';
  const applicationFont='"Vazirmatn", Tahoma, Arial, sans-serif';
  document.documentElement.dataset.irStyleRevision='navigation-inline-reference-v14';
  document.documentElement.style.boxSizing='border-box';
  document.documentElement.style.width='100%';
  document.documentElement.style.height='100%';
  document.documentElement.style.minHeight='100%';
  document.documentElement.style.margin='0';
  document.documentElement.style.overflow='hidden';
  document.documentElement.style.direction='rtl';
  document.documentElement.style.background='#FFFAE0';
  document.documentElement.style.fontFamily=applicationFont;
  if(document.body){
   document.body.style.boxSizing='border-box';
   document.body.style.width='100%';
   document.body.style.height='100%';
   document.body.style.minHeight='100%';
   document.body.style.margin='0';
   document.body.style.padding='0';
   document.body.style.overflow='hidden';
   document.body.style.direction='rtl';
   document.body.style.background='#FFFAE0';
   document.body.style.fontFamily=applicationFont;
  }
  const applicationRoot=document.getElementById('root');
  if(applicationRoot){
   applicationRoot.style.boxSizing='border-box';
   applicationRoot.style.width='100%';
   applicationRoot.style.height='100%';
   applicationRoot.style.minHeight='100%';
   applicationRoot.style.margin='0';
   applicationRoot.style.padding='0';
   applicationRoot.style.overflow='hidden';
   applicationRoot.style.direction='rtl';
   applicationRoot.style.background='#FFFAE0';
   applicationRoot.style.fontFamily=applicationFont;
  }

  const vazirmatnHref='https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap';
  const vazirmatnLinks=Array.from(document.head.querySelectorAll('link[data-irancell-vazirmatn-font="true"],link[href*="family=Vazirmatn"],link[href*="Vazirmatn-font-face"]'));
  let vazirmatnLink=vazirmatnLinks.find(link=>link.getAttribute('data-irancell-vazirmatn-font')==='true')||vazirmatnLinks[0];
  if(!vazirmatnLink){
   vazirmatnLink=document.createElement('link');
   document.head.appendChild(vazirmatnLink);
  }
  vazirmatnLink.setAttribute('rel','stylesheet');
  vazirmatnLink.setAttribute('href',vazirmatnHref);
  vazirmatnLink.setAttribute('data-irancell-vazirmatn-font','true');
  vazirmatnLinks.forEach(link=>{if(link!==vazirmatnLink)link.remove()});
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
 React.useEffect(function IrancellResetCanonicalRouteScroll(){
  const routePage=routePageRef.current;
  if(!routePage)return undefined;
  function resetRouteScroll(){
   routePage.scrollTop=0;
   routePage.scrollLeft=0;
  }
  resetRouteScroll();
  const frame=typeof window!=='undefined'&&typeof window.requestAnimationFrame==='function'?window.requestAnimationFrame(resetRouteScroll):0;
  return function IrancellResetCanonicalRouteScrollCleanup(){
   if(frame&&typeof window!=='undefined'&&typeof window.cancelAnimationFrame==='function')window.cancelAnimationFrame(frame);
  };
 },[location.route,location.query]);

 React.useEffect(function IrancellEnableCanonicalGestureScrolling(){
  const routePage=routePageRef.current;
  if(!routePage||typeof window==='undefined')return undefined;
  let lastTouchY=null;

  function nestedElementCanScroll(target,deltaY){
   let element=target&&target.nodeType===1?target:target?.parentElement;
   while(element&&element!==routePage){
    const computedStyle=window.getComputedStyle(element);
    const overflowY=computedStyle.overflowY;
    const scrollable=(overflowY==='auto'||overflowY==='scroll'||overflowY==='overlay')&&element.scrollHeight>element.clientHeight+1;
    if(scrollable){
     const canMoveUp=deltaY<0&&element.scrollTop>0;
     const canMoveDown=deltaY>0&&element.scrollTop+element.clientHeight<element.scrollHeight-1;
     if(canMoveUp||canMoveDown)return true;
    }
    element=element.parentElement;
   }
   return false;
  }

  function scrollCanonicalPage(deltaY,event){
   if(!Number.isFinite(deltaY)||Math.abs(deltaY)<0.5||routePage.scrollHeight<=routePage.clientHeight+1)return false;
   if(nestedElementCanScroll(event.target,deltaY))return false;
   const previousScrollTop=routePage.scrollTop;
   routePage.scrollTop=Math.max(0,Math.min(routePage.scrollHeight-routePage.clientHeight,previousScrollTop+deltaY));
   const moved=routePage.scrollTop!==previousScrollTop;
   if(moved&&event.cancelable)event.preventDefault();
   return moved;
  }

  function handleWheel(event){
   if(event.defaultPrevented||event.ctrlKey)return;
   const multiplier=event.deltaMode===1?16:event.deltaMode===2?routePage.clientHeight:1;
   scrollCanonicalPage(event.deltaY*multiplier,event);
  }

  function handleTouchStart(event){
   if(event.touches.length!==1){lastTouchY=null;return}
   lastTouchY=event.touches[0].clientY;
  }

  function handleTouchMove(event){
   if(event.touches.length!==1||lastTouchY===null)return;
   const nextTouchY=event.touches[0].clientY;
   const deltaY=lastTouchY-nextTouchY;
   lastTouchY=nextTouchY;
   scrollCanonicalPage(deltaY,event);
  }

  function handleTouchEnd(){
   lastTouchY=null;
  }

  routePage.addEventListener('wheel',handleWheel,{passive:false});
  routePage.addEventListener('touchstart',handleTouchStart,{passive:true});
  routePage.addEventListener('touchmove',handleTouchMove,{passive:false});
  routePage.addEventListener('touchend',handleTouchEnd,{passive:true});
  routePage.addEventListener('touchcancel',handleTouchEnd,{passive:true});

  return function IrancellDisableCanonicalGestureScrolling(){
   routePage.removeEventListener('wheel',handleWheel);
   routePage.removeEventListener('touchstart',handleTouchStart);
   routePage.removeEventListener('touchmove',handleTouchMove);
   routePage.removeEventListener('touchend',handleTouchEnd);
   routePage.removeEventListener('touchcancel',handleTouchEnd);
  };
 },[location.route]);
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
 const screenSurfaceStyle={boxSizing:'border-box',position:'relative',display:'block',width:'100%',minWidth:0,maxWidth:'none',minHeight:'100%',margin:0,padding:0,overflow:'visible',direction:'rtl',color:'#202024',background:screenUsesFullBleed?'transparent':'#FFFAE0',fontFamily:'"Vazirmatn", Tahoma, Arial, sans-serif'};
 const page=ScreenComponent?(parentRootFullscreen?<ScreenComponent params={{...match.params,...location.query}} onNavigate={navigate} onBack={navigateBack} screen={resolvedScreen}/>:<div data-ir-screen-surface={screenUsesFullBleed?'full-bleed':'standard'} style={screenSurfaceStyle}><ScreenComponent params={{...match.params,...location.query}} onNavigate={navigate} onBack={navigateBack} screen={resolvedScreen}/></div>):<div data-ir-screen-surface="standard" style={screenSurfaceStyle}><div style={{boxSizing:'border-box',display:'grid',width:'100%',minHeight:'100%',placeItems:'center',padding:'24px',fontFamily:'"Vazirmatn", Tahoma, Arial, sans-serif'}}><IrancellStatePanel state="error" title="صفحه قابل نمایش نیست" description="بارگذاری این بخش کامل نشده است. به صفحه اصلی برگردید و دوباره تلاش کنید." action={<IrancellButton onClick={()=>navigate(IrancellAppResolveSafeHomeRoute(state))}>بازگشت به خانه</IrancellButton>}/></div></div>;
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
 const applicationFont='"Vazirmatn", Tahoma, Arial, sans-serif';
 const desktopNavigationReserve=desktopNavigationExpanded?340:118;
 const routeLayerStyle={boxSizing:'border-box',position:'relative',isolation:'isolate',display:'block',width:'100%',minWidth:0,maxWidth:'none',height:'100dvh',minHeight:'100dvh',maxHeight:'100dvh',margin:0,padding:0,paddingInlineStart:showPersistentDock&&!compactNavigation?desktopNavigationReserve:0,overflow:'hidden',direction:'rtl',color:'#202024',background:'#FFFAE0',fontFamily:applicationFont,transition:'padding-inline-start .24s cubic-bezier(.2,.8,.2,1)'};
 const routePageStyle={boxSizing:'border-box',position:'relative',zIndex:0,display:'block',width:'100%',minWidth:0,maxWidth:'none',height:'100%',minHeight:0,maxHeight:'100dvh',margin:0,padding:0,paddingBottom:showPersistentDock&&compactNavigation?'calc(106px + env(safe-area-inset-bottom))':0,overflowX:'hidden',overflowY:'auto',overflowAnchor:'none',overscrollBehavior:'contain',touchAction:'pan-y',WebkitOverflowScrolling:'touch',scrollbarGutter:'stable',scrollbarWidth:'thin',scrollbarColor:'#D3B000 transparent',pointerEvents:isOtpModal?'none':'auto',userSelect:isOtpModal?'none':'auto',fontFamily:applicationFont,transition:'padding-bottom .18s ease'};
 const content=<div data-ir-route-layer="canonical" data-ir-navigation-mode={showPersistentDock?(compactNavigation?'mobile':'desktop'):'none'} style={routeLayerStyle}><div ref={routePageRef} data-ir-route-page="canonical" style={routePageStyle} aria-hidden={isOtpModal?'true':undefined}>{visiblePage}</div>{showPersistentDock&&<IrancellAppPersistentDock role={dockRole} currentRoute={dockRoute} onNavigate={navigate} compact={compactNavigation} onExpandedChange={setDesktopNavigationExpanded}/>} {isOtpModal&&page}</div>;
 return <>{content}</>;
}

/* IRANCELL_APP_ACCIDENTAL_DUPLICATE_NAVIGATION_DISABLED
 const profileActive=dockItemIsActive(profileItem||{route:profileRoute});
 const navigationZIndex=2147483000;

 if(compact)return <div role="navigation" aria-label="ناوبری اصلی" data-ir-canonical-navigation="mobile" dir="rtl" style={{boxSizing:'border-box',position:'fixed',right:'12px',bottom:'calc(12px + env(safe-area-inset-bottom))',left:'12px',zIndex:navigationZIndex,display:'grid',width:'auto',minWidth:0,maxWidth:'none',height:'70px',minHeight:'70px',maxHeight:'70px',gridTemplateColumns:`repeat(${Math.max(mobileItems.length,1)},minmax(0,1fr))`,alignItems:'center',justifyContent:'stretch',gap:'3px',margin:0,padding:'7px',overflow:'visible',direction:'rtl',color:'#AAAAB2',background:'rgba(23,23,25,.97)',border:'1px solid rgba(255,255,255,.09)',borderRadius:'24px',boxShadow:'0 18px 42px rgba(17,17,17,.25)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',fontFamily:navigationFont}}>
  {mobileItems.map(item=>{
   const active=dockItemIsActive(item);
   const key=`mobile-${item.route}`;
   const avatarProfile=dockItemUsesAvatar(item);
   return <button type="button" key={key} aria-label={item.label} aria-current={active?'page':undefined} title={item.label} style={navigationItemStyle(item,active,'mobile',key)} {...focusHandlers(key)} onClick={()=>onNavigate?.(item.route)}>
    {avatarProfile?renderDockAvatar(25):<IrancellAppPersistentDockIcon name={item.icon}/>}
    <span style={{display:'block',width:'100%',minWidth:0,overflow:'hidden',fontFamily:navigationFont,fontSize:'8px',fontWeight:item.primary||active?900:700,lineHeight:1.2,textAlign:'center',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>
   </button>;
  })}
 </div>;

 return <aside role="navigation" aria-label="ناوبری اصلی" aria-expanded={expanded} data-ir-canonical-navigation="desktop" dir="rtl" onMouseEnter={()=>setExpanded(true)} onMouseLeave={event=>{if(typeof document==='undefined'||!event.currentTarget.contains(document.activeElement))setExpanded(false);}} onFocusCapture={()=>setExpanded(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setExpanded(false);}} onKeyDown={event=>{if(event.key==='Escape'){setExpanded(false);event.currentTarget.querySelector('button')?.focus();}}} style={{boxSizing:'border-box',position:'fixed',top:'20px',right:'20px',bottom:'20px',left:'auto',zIndex:navigationZIndex,display:'flex',width:expanded?'300px':'72px',minWidth:expanded?'300px':'72px',maxWidth:expanded?'300px':'72px',height:'auto',minHeight:0,flexDirection:'column',alignItems:expanded?'stretch':'center',gap:'5px',margin:0,padding:expanded?'14px 18px':'14px 10px',overflow:'hidden',direction:'rtl',color:'#C7C7CD',background:'rgba(23,23,25,.985)',border:'1px solid rgba(255,255,255,.09)',borderRadius:'26px',boxShadow:expanded?'0 22px 58px rgba(17,17,17,.25)':'0 16px 42px rgba(17,17,17,.18)',backdropFilter:'blur(18px)',WebkitBackdropFilter:'blur(18px)',fontFamily:navigationFont,transition:'width .24s cubic-bezier(.2,.8,.2,1),min-width .24s cubic-bezier(.2,.8,.2,1),max-width .24s cubic-bezier(.2,.8,.2,1),padding .24s cubic-bezier(.2,.8,.2,1),box-shadow .24s ease'}}>
  <header aria-label="پلتفرم آموزشی ایرانسل" style={{boxSizing:'border-box',display:'flex',width:expanded?'100%':'48px',minWidth:expanded?0:'48px',minHeight:'54px',flex:'0 0 54px',alignItems:'center',justifyContent:expanded?'flex-start':'center',gap:expanded?'10px':0,margin:'0 0 7px',padding:'5px 0 11px',overflow:'hidden',borderBottom:expanded?'1px solid rgba(255,255,255,.12)':'1px solid transparent',fontFamily:navigationFont}}>
   <span aria-hidden="true" style={{boxSizing:'border-box',display:'grid',width:'44px',minWidth:'44px',height:'31px',placeItems:'center',flex:'0 0 44px',color:'#111111',background:'#FFD100',border:'2px solid #111111',borderRadius:'50%',fontFamily:navigationFont,fontSize:'8px',fontWeight:900,lineHeight:1,transform:'rotate(-2deg)'}}><b style={{display:'block',fontFamily:navigationFont,fontSize:'8px',fontWeight:900,lineHeight:'8px'}}>ایرانسل</b><small style={{display:'block',marginTop:'-2px',fontFamily:navigationFont,fontSize:'6px',fontWeight:900,lineHeight:'6px'}}>MTN</small></span>
   {expanded&&<span style={{display:'flex',minWidth:0,flexDirection:'column',gap:'2px',overflow:'hidden',fontFamily:navigationFont,textAlign:'right',whiteSpace:'nowrap'}}><strong style={{color:'#FFFFFF',fontFamily:navigationFont,fontSize:'12px',fontWeight:900,lineHeight:1.5}}>پلتفرم آموزشی ایرانسل</strong><small style={{color:'#A9A9B1',fontFamily:navigationFont,fontSize:'9px',lineHeight:1.5}}>{roleTitles[role]||'حساب کاربری'}</small></span>}
  </header>

  <button type="button" aria-label="مشاهده پروفایل" aria-current={profileActive?'page':undefined} title="مشاهده پروفایل" style={{boxSizing:'border-box',appearance:'none',WebkitAppearance:'none',display:'grid',width:expanded?'100%':'48px',minWidth:expanded?0:'48px',maxWidth:expanded?'none':'48px',height:expanded?'62px':'50px',minHeight:expanded?'62px':'50px',maxHeight:expanded?'62px':'50px',flex:expanded?'0 0 62px':'0 0 50px',gridTemplateColumns:expanded?'42px minmax(0,1fr)':'34px',alignItems:'center',justifyContent:expanded?'stretch':'center',gap:expanded?'10px':0,margin:'0 0 5px',padding:expanded?'9px 11px':0,overflow:'hidden',color:profileActive?'#171719':'#FFFFFF',background:profileActive?'#FFD100':'#2B2B2F',border:focusedItemKey==='profile'?'1px solid #FFD100':'1px solid rgba(255,255,255,.08)',borderRadius:'16px',outline:focusedItemKey==='profile'?'2px solid rgba(255,209,0,.30)':'none',outlineOffset:'1px',fontFamily:navigationFont,textAlign:'right',cursor:'pointer'}} {...focusHandlers('profile')} onClick={()=>onNavigate?.(profileRoute)}>
   {renderDockAvatar(expanded?36:34)}
   {expanded&&<span style={{display:'flex',minWidth:0,flexDirection:'column',gap:'2px',overflow:'hidden',fontFamily:navigationFont,textAlign:'right',whiteSpace:'nowrap'}}><strong style={{overflow:'hidden',color:'inherit',fontFamily:navigationFont,fontSize:'11px',fontWeight:900,textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{dockAvatarUser?.name||'کاربر ایرانسل'}</strong><small style={{overflow:'hidden',color:profileActive?'#4B4100':'#B5B5BC',fontFamily:navigationFont,fontSize:'9px',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profileSubtitle}</small></span>}
  </button>

  <div style={{boxSizing:'border-box',display:'flex',width:'100%',minHeight:0,flex:'1 1 auto',flexDirection:'column',alignItems:expanded?'stretch':'center',gap:'4px',overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none'}}>
   {desktopItems.map(item=>{
    const active=dockItemIsActive(item);
    const key=`desktop-${item.route}`;
    return <button type="button" key={key} aria-label={item.label} aria-current={active?'page':undefined} title={expanded?'':item.label} style={navigationItemStyle(item,active,'desktop',key)} {...focusHandlers(key)} onClick={()=>onNavigate?.(item.route)}>
     <IrancellAppPersistentDockIcon name={item.icon}/>
     {expanded&&<span style={{display:'block',minWidth:0,overflow:'hidden',color:'inherit',fontFamily:navigationFont,fontSize:'11px',fontWeight:item.primary||active?900:800,lineHeight:1.5,textAlign:'right',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>}
    </button>;
   })}
   {desktopSupplementalItems.map(item=>{
    const active=dockItemIsActive(item);
    const key=`desktop-extra-${item.route}`;
    return <button type="button" key={key} aria-label={item.label} aria-current={active?'page':undefined} title={expanded?'':item.label} style={navigationItemStyle(item,active,'desktop',key)} {...focusHandlers(key)} onClick={()=>onNavigate?.(item.route)}>
     <IrancellAppPersistentDockIcon name={item.icon}/>
     {expanded&&<span style={{display:'block',minWidth:0,overflow:'hidden',color:'inherit',fontFamily:navigationFont,fontSize:'11px',fontWeight:active?900:800,lineHeight:1.5,textAlign:'right',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>}
    </button>;
   })}
  </div>

  <button type="button" aria-label="خروج امن" title={expanded?'':'خروج امن'} style={{...navigationItemStyle({primary:false},false,'desktop','logout'),marginTop:'7px',color:focusedItemKey==='logout'?'#FFD100':'#FFFFFF',background:focusedItemKey==='logout'?'#343438':'#2B2B2F',borderColor:focusedItemKey==='logout'?'#FFD100':'rgba(255,255,255,.08)'}} {...focusHandlers('logout')} onClick={logout}>
   <IrancellAppPersistentDockIcon name="logout"/>
   {expanded&&<span style={{display:'block',minWidth:0,overflow:'hidden',color:'inherit',fontFamily:navigationFont,fontSize:'10px',fontWeight:900,textAlign:'right',whiteSpace:'nowrap'}}>خروج امن</span>}
  </button>
 </aside>;

 IRANCELL_APP_LEGACY_NAVIGATION_CSS_DISABLED{content}</>;
*/

export default function App(){return <IrancellAppRuntime/>;}
export function IrancellApplication(){return <IrancellAppRuntime/>;}
