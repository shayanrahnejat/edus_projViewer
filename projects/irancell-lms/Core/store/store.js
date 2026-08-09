const IRANCELL_CORE_STORE_V2_DATA_MODE=IRANCELL_APP_CONFIG.dataMode||'production';
const IRANCELL_CORE_STORE_V2_IS_FIXTURE=IRANCELL_CORE_STORE_V2_DATA_MODE==='fixture';
const IRANCELL_CORE_STORE_V2_SAFE_SEED=Object.freeze({
 meta:{schemaVersion:IRANCELL_APP_CONFIG.schemaVersion||2,dataMode:IRANCELL_CORE_STORE_V2_DATA_MODE,bootStatus:'idle',lastHydratedAt:null,activeUserNamespace:'anonymous',online:true,lastServerSyncAt:null,bootError:null},
 requests:{},
 session:{token:null,currentUserId:null,candidateUserId:null,availableRoles:[],activeRole:null,status:'anonymous',mobile:null,pendingMobile:null,otpPurpose:null,requiresOnboarding:false},
 identity:{
  usersById:{
   'student-1':{
    id:'student-1',
    username:'student',
    name:'آراد احمدی',
    firstName:'آراد',
    lastName:'احمدی',
    mobile:'09120000001',
    email:'student@fixture.ir',
    roles:['student'],
    status:'active',
    age:13,
    grade:'پایه هفتم',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'parent-1':{
    id:'parent-1',
    username:'parent',
    name:'امیر احمدی',
    firstName:'امیر',
    lastName:'احمدی',
    mobile:'09120000002',
    email:'parent@fixture.ir',
    roles:['parent'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'teacher-1':{
    id:'teacher-1',
    username:'teacher',
    name:'محمد رضایی',
    firstName:'محمد',
    lastName:'رضایی',
    mobile:'09120000003',
    email:'teacher@fixture.ir',
    roles:['teacher'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'academy-1':{
    id:'academy-1',
    username:'academy',
    name:'آکادمی آینده روشن',
    organizationName:'آکادمی آینده روشن',
    mobile:'09120000004',
    email:'academy@fixture.ir',
    roles:['academy'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'content-1':{
    id:'content-1',
    username:'content',
    name:'استودیو آموزش نو',
    organizationName:'استودیو آموزش نو',
    mobile:'09120000005',
    email:'content@fixture.ir',
    roles:['content-provider'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'admin-1':{
    id:'admin-1',
    username:'admin',
    name:'مدیر عملیات',
    firstName:'مدیر',
    lastName:'عملیات',
    mobile:'09120000006',
    email:'admin@fixture.ir',
    roles:['admin'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'student-2':{
    id:'student-2',
    username:'student2',
    name:'رها محمدی',
    firstName:'رها',
    lastName:'محمدی',
    mobile:'09120000007',
    email:'student2@fixture.ir',
    roles:['student'],
    status:'active',
    age:15,
    grade:'پایه نهم',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'parent-2':{
    id:'parent-2',
    username:'parent2',
    name:'مریم محمدی',
    firstName:'مریم',
    lastName:'محمدی',
    mobile:'09120000008',
    email:'parent2@fixture.ir',
    roles:['parent'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'teacher-2':{
    id:'teacher-2',
    username:'teacher2',
    name:'علیرضا ناصری',
    firstName:'علیرضا',
    lastName:'ناصری',
    mobile:'09120000009',
    email:'teacher2@fixture.ir',
    roles:['teacher'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'academy-2':{
    id:'academy-2',
    username:'academy2',
    name:'آکادمی ریاضی آرا',
    organizationName:'آکادمی ریاضی آرا',
    mobile:'09120000010',
    email:'academy2@fixture.ir',
    roles:['academy'],
    status:'active',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'student-3':{
    id:'student-3',
    username:'student3',
    name:'سارا احمدی',
    firstName:'سارا',
    lastName:'احمدی',
    mobile:'09120000011',
    email:'student3@fixture.ir',
    roles:['student'],
    status:'active',
    age:11,
    grade:'پایه پنجم',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'student-4':{
    id:'student-4',
    username:'student4',
    name:'نیما احمدی',
    firstName:'نیما',
    lastName:'احمدی',
    mobile:'09120000012',
    email:'student4@fixture.ir',
    roles:['student'],
    status:'active',
    age:16,
    grade:'پایه دهم',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'teacher-3':{
    id:'teacher-3',
    username:'teacher3',
    name:'مدرس جدید',
    firstName:'مدرس',
    lastName:'جدید',
    mobile:'09120000013',
    email:'teacher3@fixture.ir',
    roles:['teacher'],
    status:'active',
    profileCompletion:25,
    verificationStatus:'incomplete',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   },
   'multi-role-1':{
    id:'multi-role-1',
    username:'multi',
    name:'کاربر چندنقشی آزمایشی',
    firstName:'کاربر',
    lastName:'آزمایشی',
    mobile:'09120000014',
    email:'multi@fixture.ir',
    roles:['student','parent','teacher','academy','content-provider'],
    status:'active',
    age:18,
    grade:'پایه دوازدهم',
    credentialPassword:'123456',
    credentialConfigured:true,
    registrationSource:'fixture'
   }
  },
  relationshipsById:{},
  permissions:{},
  providerVerification:{}
 },
 chisti:{conversationsById:{},problemsById:{},recommendationsByProblemId:{},activeConversationId:null,activeJob:null,lastCompletedProblemId:null,status:'idle',error:null},
 content:{catalogueById:{},search:'',recommendations:[],watchProgress:{},ratings:{},enrollmentsByUserId:{},selectedContentId:null,selectedView:'course',status:'idle'},
 marketplace:{requestsById:{},offersById:{},providersById:{},availability:{},selectedOfferId:null},
 consent:{documentsById:{},gatesBySessionId:{}},
 payment:{paymentsById:{},escrowByOrderId:{},invoicesById:{},refundsById:{}},
 classroom:{sessionsById:{},roomsById:{},attendanceBySessionId:{}},
 quality:{ratingsById:{},complaintsById:{},qualityScoresByProviderId:{}},
 notifications:{itemsById:{},unreadCount:0,deliveryState:'idle'},
 admin:{filters:{},queues:{providerReview:0,complaints:0,paymentUnknown:0},reports:{mau:0,gmv:0,chistiResolution:0,paidConversion:0,consentCompletion:0,classSuccess:0},systemHealth:{}},
 settings:{demo:{enabled:true,showQuickProfiles:true,showGuidedExamples:true,offlineSimulation:false},appearance:{fontScale:'comfortable'}},
 family:{profilesByParentId:{},walletsByParentId:{},childProgressById:{},activeClassCountByChildId:{},controlsByChildId:{},securityByParentId:{},invoicesById:{},pendingPaymentsById:{},notificationItemsById:{}},
 support:{ticketsById:{}},
 privacy:{requestsById:{}},
 analytics:{eventQueue:[],consentFlags:{},traceContext:{}},
 audit:{events:[]},
 ui:{routeState:{route:'splash',params:{}},modals:{},toasts:[],loading:{},fieldErrors:{},offline:false,parentGate:null}
});
const IRANCELL_CORE_STORE_V2_PERSISTENCE_KEY=IRANCELL_APP_CONFIG.persistenceKey||'irancell-lms-v2';
const IRANCELL_CORE_STORE_V2_LEGACY_KEY=IRANCELL_APP_CONFIG.legacyPersistenceKey||'irancell-lms-v1';
const IRANCELL_CORE_STORE_V2_HAS_REMOTE_CONTRACT=Boolean(IRANCELL_APP_CONFIG.api?.baseUrl&&Object.keys(IRANCELL_APP_CONFIG.api?.operations||{}).length);
const IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE=IRANCELL_CORE_STORE_V2_IS_FIXTURE||!IRANCELL_CORE_STORE_V2_HAS_REMOTE_CONTRACT;
const IRANCELL_CORE_STORE_V2_PUBLISHED_FIXTURE=typeof globalThis!=='undefined'&&globalThis.__IRANCELL_LMS_INITIAL_STATE__&&typeof globalThis.__IRANCELL_LMS_INITIAL_STATE__==='object'?globalThis.__IRANCELL_LMS_INITIAL_STATE__:null;
const IRANCELL_CORE_STORE_V2_LOCAL_SOURCE=IRANCELL_CORE_STORE_V2_PUBLISHED_FIXTURE||IRANCELL_CORE_STORE_V2_SAFE_SEED;
const IRANCELL_CORE_STORE_V2_LOCAL_SEED=Object.freeze({
 ...IRANCELL_CORE_STORE_V2_LOCAL_SOURCE,
 meta:{
  ...(IRANCELL_CORE_STORE_V2_SAFE_SEED.meta||{}),
  ...(IRANCELL_CORE_STORE_V2_LOCAL_SOURCE.meta||{}),
  schemaVersion:IRANCELL_APP_CONFIG.schemaVersion||2,
  dataMode:IRANCELL_CORE_STORE_V2_DATA_MODE,
  storeMode:'local',
  bootStatus:'ready',
  bootError:null
 },
 requests:{},
 session:{...IRANCELL_CORE_STORE_V2_SAFE_SEED.session},
 identity:{
  ...(IRANCELL_CORE_STORE_V2_LOCAL_SOURCE.identity||{}),
  usersById:{
   ...(IRANCELL_CORE_STORE_V2_LOCAL_SOURCE.identity?.usersById||{}),
   ...(IRANCELL_CORE_STORE_V2_SAFE_SEED.identity?.usersById||{})
  }
 },
 settings:{
  ...(IRANCELL_CORE_STORE_V2_LOCAL_SOURCE.settings||{}),
  demo:{
   ...(IRANCELL_CORE_STORE_V2_LOCAL_SOURCE.settings?.demo||{}),
   enabled:true,
   showQuickProfiles:true,
   showGuidedExamples:true
  },
  appearance:{
   ...(IRANCELL_CORE_STORE_V2_SAFE_SEED.settings?.appearance||{}),
   ...(IRANCELL_CORE_STORE_V2_LOCAL_SOURCE.settings?.appearance||{})
  }
 }
});
const IRANCELL_CORE_STORE_V2_BOOT_SEED=IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE?IRANCELL_CORE_STORE_V2_LOCAL_SEED:IRANCELL_CORE_STORE_V2_SAFE_SEED;
const IRANCELL_CORE_STORE_V2_MODEL_NAMES=Object.freeze(Object.keys(IRANCELL_CORE_STORE_V2_SAFE_SEED));
const IRANCELL_CORE_STORE_V2_SUBSCRIBERS=new Set();
const IRANCELL_CORE_STORE_V2_INFLIGHT=new Map();
const IRANCELL_CORE_STORE_V2_LOCAL_ACTIONS=new Set(['IRANCELL_ROUTE_CHANGED','IRANCELL_NAVIGATION_BACK','IRANCELL_UI_TOAST','IRANCELL_UI_DISMISS_TOAST','IRANCELL_RESET','IRANCELL_DEMO_ACTIVATE_PROFILE']);
let IrancellCoreStoreV2Base=null;
let IrancellCoreStoreV2State=IrancellCoreStoreV2ReadPersistedState(IRANCELL_CORE_STORE_V2_BOOT_SEED);
let IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID=null;
let IRANCELL_CORE_STORE_V2_BOOT_PROMISE=null;

function IrancellCoreStoreV2Clone(value){if(value===undefined)return undefined;return JSON.parse(JSON.stringify(value));}
function IrancellCoreStoreV2IsPlainObject(value){return Boolean(value)&&typeof value==='object'&&!Array.isArray(value);}
function IrancellCoreStoreV2Merge(base,patch){
 if(!IrancellCoreStoreV2IsPlainObject(base)||!IrancellCoreStoreV2IsPlainObject(patch))return IrancellCoreStoreV2Clone(patch);
 const next={...base};
 Object.keys(patch).forEach(function IrancellCoreStoreV2MergeKey(key){
  const incoming=patch[key];
  next[key]=IrancellCoreStoreV2IsPlainObject(next[key])&&IrancellCoreStoreV2IsPlainObject(incoming)?IrancellCoreStoreV2Merge(next[key],incoming):IrancellCoreStoreV2Clone(incoming);
 });
 return next;
}
function IrancellCoreStoreV2FilterPatch(value){
 if(!IrancellCoreStoreV2IsPlainObject(value))return{};
 return Object.keys(value).reduce(function IrancellCoreStoreV2FilterPatchKey(result,key){if(IRANCELL_CORE_STORE_V2_MODEL_NAMES.includes(key))result[key]=value[key];return result;},{});
}
function IrancellCoreStoreV2ReadPublishedSeed(){
 if(IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE)return IRANCELL_CORE_STORE_V2_LOCAL_SEED;
 return IRANCELL_CORE_STORE_V2_SAFE_SEED;
}
function IrancellCoreStoreV2BuildLocalSnapshot(state){
 if(!IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE)return null;
 return{
  identity:state.identity||{},
  chisti:state.chisti||{},
  content:state.content||{},
  marketplace:state.marketplace||{},
  consent:state.consent||{},
  payment:state.payment||{},
  classroom:state.classroom||{},
  quality:state.quality||{},
  notifications:state.notifications||{},
  admin:state.admin||{},
  settings:state.settings||{},
  family:state.family||{},
  support:state.support||{},
  privacy:state.privacy||{},
  analytics:state.analytics||{},
  audit:state.audit||{}
 }
}
function IrancellCoreStoreV2ReadPersistedState(seedSource){
 const seed=IrancellCoreStoreV2Clone(seedSource||IRANCELL_CORE_STORE_V2_SAFE_SEED);
 if(typeof window==='undefined'||!window.localStorage)return seed;
 try{
  const raw=window.localStorage.getItem(IRANCELL_CORE_STORE_V2_PERSISTENCE_KEY);
  if(!raw){window.localStorage.removeItem(IRANCELL_CORE_STORE_V2_LEGACY_KEY);return seed;}
  const parsed=JSON.parse(raw);
  if(Number(parsed?.schemaVersion)!==Number(IRANCELL_APP_CONFIG.schemaVersion)){window.localStorage.removeItem(IRANCELL_CORE_STORE_V2_PERSISTENCE_KEY);return seed;}
  const localState=IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE&&IrancellCoreStoreV2IsPlainObject(parsed.localState)?IrancellCoreStoreV2FilterPatch(parsed.localState):{};
  return IrancellCoreStoreV2Merge(IrancellCoreStoreV2Merge(seed,localState),{settings:{appearance:parsed.preferences?.appearance||seed.settings?.appearance||{}},ui:{routeState:parsed.lastRoute||seed.ui?.routeState||{route:'splash',params:{}}}});
 }catch(error){return seed;}
}
function IrancellCoreStoreV2WritePersistedState(){
 if(typeof window==='undefined'||!window.localStorage)return false;
 try{
  const state=IrancellCoreStoreV2State||{};
  window.localStorage.setItem(IRANCELL_CORE_STORE_V2_PERSISTENCE_KEY,JSON.stringify({
   schemaVersion:IRANCELL_APP_CONFIG.schemaVersion,
   dataMode:IRANCELL_CORE_STORE_V2_DATA_MODE,
   storeMode:IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE?'local':'remote',
   userNamespace:state.meta?.activeUserNamespace||'anonymous',
   preferences:{appearance:state.settings?.appearance||{}},
   lastRoute:state.ui?.routeState||{route:'splash',params:{}},
   localState:IrancellCoreStoreV2BuildLocalSnapshot(state)
  }));
  window.localStorage.removeItem(IRANCELL_CORE_STORE_V2_LEGACY_KEY);
  return true;
 }catch(error){if(window.console)window.console.warn('IranCell LMS safe persistence failed.',error);return false;}
}
function IrancellCoreStoreV2BuildModels(){
 const seed=IrancellCoreStoreV2ReadPublishedSeed();
 return IRANCELL_CORE_STORE_V2_MODEL_NAMES.map(function IrancellCoreStoreV2BuildModel(name){
  const value=seed[name]===undefined?IRANCELL_CORE_STORE_V2_SAFE_SEED[name]:seed[name];
  return{name,type:'object',store:'memory',_data:IrancellCoreStoreV2Clone(value),defaultData:IrancellCoreStoreV2Clone(value)};
 });
}
const IRANCELL_CORE_STORE_V2_MODELS=IrancellCoreStoreV2BuildModels();
function IrancellCoreStoreV2Notify(){IRANCELL_CORE_STORE_V2_SUBSCRIBERS.forEach(function IrancellCoreStoreV2NotifySubscriber(listener){try{listener(IrancellCoreStoreV2State);}catch(error){if(typeof window!=='undefined'&&window.console)window.console.error('IranCell LMS store subscriber failed.',error);}});}
function IrancellCoreStoreV2SyncBase(patch){
 const base=IrancellCoreStoreV2CreateStoreWhenReady();
 if(!base)return;
 try{
  if(typeof base.patch==='function')base.patch(patch);
  else if(typeof base.set==='function')base.set(patch);
  else if(typeof base.update==='function')base.update(function IrancellCoreStoreV2BaseUpdate(){return patch;});
 }catch(error){if(typeof window!=='undefined'&&window.console)window.console.warn('IranCell LMS data-store synchronization failed.',error);}
}
function IrancellCoreStoreV2Commit(nextState,patchForBase,options){
 if(!IrancellCoreStoreV2IsPlainObject(nextState)||nextState===IrancellCoreStoreV2State)return IrancellCoreStoreV2State;
 IrancellCoreStoreV2State=nextState;
 if(!options||options.persist!==false)IrancellCoreStoreV2WritePersistedState();
 IrancellCoreStoreV2SyncBase(patchForBase||nextState);
 IrancellCoreStoreV2Notify();
 return IrancellCoreStoreV2State;
}
function IrancellCoreStoreV2ResolveCommand(type){
 if(!String(type||'').startsWith('IRANCELL_')||IRANCELL_CORE_STORE_V2_LOCAL_ACTIONS.has(type))return null;
 const operation=String(type).replace(/^IRANCELL_/,'').toLowerCase().replace(/_/g,'-');
 const domain=type.includes('CHISTI')?'chisti':type.includes('CONTENT')?'binaei':type.includes('MARKETPLACE')||type.includes('TEACHER_OFFER')||type.includes('TEACHER_AVAILABILITY')?'marketplace':type.includes('CONSENT')?'signature':type.includes('PAYMENT')||type.includes('WALLET')||type.includes('PAYOUT')?'payment':type.includes('CLASS')||type.includes('QUALITY')?'dialogi':'identity';
 return[domain,operation]
}
function IrancellCoreStoreV2Gateway(name){
 if(name==='identity')return IRANCELL_IDENTITY_GATEWAY;
 if(name==='chisti')return IRANCELL_CHISTI_GATEWAY;
 if(name==='binaei')return IRANCELL_BINAEI_GATEWAY;
 if(name==='marketplace')return IRANCELL_MARKETPLACE_GATEWAY;
 if(name==='signature')return IRANCELL_SIGNATURE_GATEWAY;
 if(name==='payment')return IRANCELL_PAYMENT_GATEWAY;
 if(name==='dialogi')return IRANCELL_DIALOGI_GATEWAY;
 return new IrancellRemoteGateway(name)
}
function IrancellCoreStoreV2ActionPayload(action){const payload={};Object.keys(action||{}).forEach(key=>{if(key!=='type'&&key!=='meta')payload[key]=action[key];});return payload;}
function IrancellCoreStoreV2RequestKey(action,operation){
 if(action.meta?.requestKey)return action.meta.requestKey;
 const base=`${operation[0]}.${operation[1]}`;
 if(operation[0]==='identity'&&['irancell-auth-login-credentials','irancell-auth-request-otp','irancell-auth-verify-otp','irancell-auth-register-kisti','irancell-auth-complete-registration','irancell-auth-select-role','irancell-auth-logout'].includes(operation[1]))return base;
 const payload=IrancellCoreStoreV2ActionPayload(action);
 return`${base}:${payload.id||payload.userId||payload.requestId||payload.offerId||payload.problemId||payload.sessionId||payload.ticketId||payload.contentId||'default'}`
}
function IrancellCoreStoreV2RequestPatch(requestKey,status,extra={}){return{requests:{...(IrancellCoreStoreV2State.requests||{}),[requestKey]:{...(IrancellCoreStoreV2State.requests?.[requestKey]||{}),status,...extra}}};}
function IrancellCoreStoreV2ResponsePatch(data){
 if(!IrancellCoreStoreV2IsPlainObject(data))return{};
 if(IrancellCoreStoreV2IsPlainObject(data.statePatch))return IrancellCoreStoreV2FilterPatch(data.statePatch);
 if(IrancellCoreStoreV2IsPlainObject(data.state))return IrancellCoreStoreV2FilterPatch(data.state);
 const patch={};
 if(data.session)patch.session=data.session;
 if(data.user){const userId=data.user.id||data.user.userId;patch.identity={usersById:userId?{...(IrancellCoreStoreV2State.identity?.usersById||{}),[userId]:data.user}:IrancellCoreStoreV2State.identity?.usersById||{},...(data.identity||{})};}
 if(Array.isArray(data.roles))patch.session={...(patch.session||{}),availableRoles:data.roles};
 if(data.permissions)patch.identity={...(patch.identity||{}),permissions:data.permissions};
 return IrancellCoreStoreV2FilterPatch(patch)
}
async function IrancellCoreStoreV2RunRemote(action,operation){
 const requestKey=IrancellCoreStoreV2RequestKey(action,operation),requestId=`request-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
 const previous=IRANCELL_CORE_STORE_V2_INFLIGHT.get(requestKey);if(previous?.controller)previous.controller.abort('superseded');
 const controller=typeof AbortController==='function'?new AbortController():null;IRANCELL_CORE_STORE_V2_INFLIGHT.set(requestKey,{requestId,controller});
 IrancellCoreStoreV2Patch(IrancellCoreStoreV2RequestPatch(requestKey,'submitting',{requestId,startedAt:new Date().toISOString(),completedAt:null,error:null,lastArgs:IrancellCoreStoreV2ActionPayload(action)}),{persist:false});
 const result=await IrancellCoreStoreV2Gateway(operation[0]).request(operation[1],IrancellCoreStoreV2ActionPayload(action),{requestId,signal:controller?.signal,idempotencyKey:action.meta?.idempotencyKey});
 if(IRANCELL_CORE_STORE_V2_INFLIGHT.get(requestKey)?.requestId!==requestId)return{ok:false,error:{code:'obsolete_response',message:'پاسخ قدیمی نادیده گرفته شد.',retryable:false}};
 IRANCELL_CORE_STORE_V2_INFLIGHT.delete(requestKey);
 if(!result?.ok){IrancellCoreStoreV2Patch(IrancellCoreStoreV2RequestPatch(requestKey,'error',{completedAt:new Date().toISOString(),error:result?.error||{code:'server_error',message:'عملیات انجام نشد.'}}),{persist:false});return result;}
 IrancellCoreStoreV2Patch(IrancellCoreStoreV2Merge(IrancellCoreStoreV2ResponsePatch(result.data),IrancellCoreStoreV2RequestPatch(requestKey,'success',{completedAt:new Date().toISOString(),error:null,traceId:result.traceId||null})),{persist:false});
 if(action.type==='IRANCELL_AUTH_LOGOUT')IrancellCoreStoreV2ClearUserState();
 return result
}
function IrancellCoreStoreV2RouteDomain(route){const normalized=String(route||''),first=normalized.split('/')[0];if(first==='student'){if(normalized.includes('/ask')||normalized.includes('/chats')||normalized.includes('/chisti'))return'chisti';if(normalized.includes('/learning')||normalized.includes('/content')||normalized.includes('/binayi'))return'binaei';if(normalized.includes('/classes/reservation/')||normalized.includes('/classes/booking-success/'))return'dialogi';if(normalized.includes('/classes/checkout/'))return'payment';if(normalized.includes('/offers')||normalized.includes('/requests')||normalized.includes('/classes')||normalized.includes('/teachers'))return'marketplace';}if(first==='teacher'||first==='academy')return'marketplace';if(first==='payment')return'payment';if(first==='class'||first==='rating'||first==='complaint')return'dialogi';return'identity';}
function IrancellCoreStoreV2LoadRoute(route,params={},screenId){
 const state=IrancellCoreStoreV2GetState();
 const currentUser=state.identity?.usersById?.[state.session?.currentUserId]||null;
 const mockSession=String(state.session?.token||'').startsWith('demo-session')||currentUser?.registrationSource==='fixture';
 if(IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE||mockSession||!route||IRANCELL_PUBLIC_ROUTES.includes(route))return Promise.resolve({ok:true,data:null,meta:{source:'store'}});
 return IrancellCoreStoreV2RunRemote({type:'IRANCELL_ROUTE_DATA_LOAD',route,params,screenId,meta:{requestKey:`route:${route}:${JSON.stringify(params||{})}`}},[IrancellCoreStoreV2RouteDomain(route),'load-route']);
}
function IrancellCoreStoreV2ClearUserState(){const appearance=IrancellCoreStoreV2State.settings?.appearance||{},safe=IrancellCoreStoreV2Clone(IRANCELL_CORE_STORE_V2_SAFE_SEED);safe.settings.appearance=appearance;safe.meta.online=typeof navigator==='undefined'?true:navigator.onLine!==false;IrancellCoreStoreV2Commit(safe,safe);if(typeof window!=='undefined'&&window.localStorage)window.localStorage.removeItem(IRANCELL_CORE_STORE_V2_PERSISTENCE_KEY);return safe;}

export function IrancellCoreStoreV2CreateStoreWhenReady(){
 if(IrancellCoreStoreV2Base)return IrancellCoreStoreV2Base;
 if(typeof createStore!=='function')return null;
 try{
  IrancellCoreStoreV2Base=createStore({models:IRANCELL_CORE_STORE_V2_MODELS});
  return IrancellCoreStoreV2Base;
 }catch(error){if(typeof window!=='undefined'&&window.console)window.console.warn('IranCell LMS data-store initialization failed; safe transient mode remains active.',error);return null;}
}
export function IrancellCoreStoreV2InitLogic(){
 if(IrancellCoreStoreV2CreateStoreWhenReady())return true;
 if(typeof setInterval!=='function')return false;
 IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID=setInterval(function IrancellCoreStoreV2RetryInitialization(){if(IrancellCoreStoreV2CreateStoreWhenReady()){clearInterval(IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID);IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID=null;}},50);
 if(typeof setTimeout==='function')setTimeout(function IrancellCoreStoreV2StopInitializationRetry(){if(IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID){clearInterval(IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID);IRANCELL_CORE_STORE_V2_INIT_INTERVAL_ID=null;}},10000);
 return false;
}
export function IrancellCoreStoreV2GetState(){return IrancellCoreStoreV2State||{};}
export function IrancellCoreStoreV2SetStatePatch(patch){
 const safePatch=IrancellCoreStoreV2FilterPatch(patch||{});
 if(!Object.keys(safePatch).length)return IrancellCoreStoreV2GetState();
 return IrancellCoreStoreV2Commit(IrancellCoreStoreV2Merge(IrancellCoreStoreV2GetState(),safePatch),safePatch);
}
export function IrancellCoreStoreV2Patch(patchOrUpdater,options){
 const patch=typeof patchOrUpdater==='function'?patchOrUpdater(IrancellCoreStoreV2GetState()):patchOrUpdater;
 const safePatch=IrancellCoreStoreV2FilterPatch(patch||{});
 if(!Object.keys(safePatch).length)return IrancellCoreStoreV2GetState();
 return IrancellCoreStoreV2Commit(IrancellCoreStoreV2Merge(IrancellCoreStoreV2GetState(),safePatch),safePatch,options);
}
export function IrancellCoreStoreV2Hydrate(snapshot,options){
 const seed=IrancellCoreStoreV2Clone(IrancellCoreStoreV2ReadPublishedSeed());
 const safeSnapshot=IrancellCoreStoreV2FilterPatch(snapshot||{});
 return IrancellCoreStoreV2Commit(IrancellCoreStoreV2Merge(seed,safeSnapshot),safeSnapshot,options);
}
export function IrancellCoreStoreV2Update(modelNameOrUpdater,valueOrUpdater){
 if(typeof modelNameOrUpdater==='function'){
  const draft=IrancellCoreStoreV2Clone(IrancellCoreStoreV2GetState());
  const result=modelNameOrUpdater(draft);
  const next=IrancellCoreStoreV2IsPlainObject(result)?result:draft;
  return IrancellCoreStoreV2Commit(IrancellCoreStoreV2Merge(IrancellCoreStoreV2GetState(),IrancellCoreStoreV2FilterPatch(next)),IrancellCoreStoreV2FilterPatch(next));
 }
 if(typeof modelNameOrUpdater==='string'&&IRANCELL_CORE_STORE_V2_MODEL_NAMES.includes(modelNameOrUpdater)){
  const current=IrancellCoreStoreV2GetState()[modelNameOrUpdater];
  const value=typeof valueOrUpdater==='function'?valueOrUpdater(current):valueOrUpdater;
  return IrancellCoreStoreV2Patch({[modelNameOrUpdater]:value});
 }
 if(IrancellCoreStoreV2IsPlainObject(modelNameOrUpdater))return IrancellCoreStoreV2Patch(modelNameOrUpdater);
 return IrancellCoreStoreV2GetState();
}
export function IrancellCoreStoreV2Dispatch(action){
 if(typeof action==='function')return action(IrancellCoreStoreV2Dispatch,IrancellCoreStoreV2GetState);
 if(!action||typeof action.type!=='string')return action;
 const currentState=IrancellCoreStoreV2GetState();
 const currentUser=currentState.identity?.usersById?.[currentState.session?.currentUserId]||null;
 const normalizedLogin=String(action.username||action.mobile||'').replace(/\D/g,'');
 const loginMobile=normalizedLogin.length===10&&normalizedLogin.startsWith('9')?`0${normalizedLogin}`:normalizedLogin.length===12&&normalizedLogin.startsWith('98')?`0${normalizedLogin.slice(2)}`:normalizedLogin;
 const targetedMockUser=['IRANCELL_AUTH_LOGIN_CREDENTIALS','IRANCELL_AUTH_REQUEST_OTP'].includes(action.type)?Object.values(currentState.identity?.usersById||{}).find(user=>user?.registrationSource==='fixture'&&(user.mobile===loginMobile||user.username===action.username)):null;
 const mockSession=String(currentState.session?.token||'').startsWith('demo-session')||currentUser?.registrationSource==='fixture'||Boolean(targetedMockUser);
 const useLocalReducer=IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE||mockSession||IRANCELL_CORE_STORE_V2_LOCAL_ACTIONS.has(action.type);
 if(useLocalReducer){
  const nextState=IrancellCoreReducer(currentState,action);
  if(nextState!==currentState)IrancellCoreStoreV2Commit(nextState,nextState);
  if(action.type==='IRANCELL_ROUTE_CHANGED'&&!IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE&&!mockSession)IrancellCoreStoreV2LoadRoute(action.route,action.params,action.screenId);
  return action
 }
 const operation=IrancellCoreStoreV2ResolveCommand(action.type);
 return operation?IrancellCoreStoreV2RunRemote(action,operation):Promise.resolve({ok:false,error:{code:'command_not_registered',message:`فرمان ${action.type} برای حالت تولید ثبت نشده است.`,retryable:false}})
}
export function IrancellCoreStoreV2Subscribe(listener){
 if(typeof listener!=='function')return function IrancellCoreStoreV2NoopUnsubscribe(){};
 IRANCELL_CORE_STORE_V2_SUBSCRIBERS.add(listener);
 return function IrancellCoreStoreV2Unsubscribe(){IRANCELL_CORE_STORE_V2_SUBSCRIBERS.delete(listener);};
}
export function IrancellCoreStoreV2Persist(){return IrancellCoreStoreV2WritePersistedState();}
export function IrancellCoreStoreV2ResetModel(modelName){
 if(!IRANCELL_CORE_STORE_V2_MODEL_NAMES.includes(modelName))return IrancellCoreStoreV2GetState();
 const seed=IrancellCoreStoreV2ReadPublishedSeed();
 return IrancellCoreStoreV2Patch({[modelName]:IrancellCoreStoreV2Clone(seed[modelName]===undefined?IRANCELL_CORE_STORE_V2_SAFE_SEED[modelName]:seed[modelName])});
}
export function IrancellCoreStoreV2ResetAll(){
 if(IrancellCoreStoreV2Base&&typeof IrancellCoreStoreV2Base.resetAll==='function'){try{IrancellCoreStoreV2Base.resetAll();}catch(error){}}
 const next=IrancellCoreStoreV2Clone(IrancellCoreStoreV2ReadPublishedSeed());
 return IrancellCoreStoreV2Commit(next,next);
}
export function IrancellCoreStoreV2GetModel(modelName){
 if(IrancellCoreStoreV2Base&&typeof IrancellCoreStoreV2Base.getModel==='function'){try{return IrancellCoreStoreV2Base.getModel(modelName);}catch(error){}}
 return IRANCELL_CORE_STORE_V2_MODELS.find(function IrancellCoreStoreV2FindModel(model){return model.name===modelName;})||null;
}
export function IrancellCoreStoreV2SetParams(modelName,params,action){
 if(IrancellCoreStoreV2Base&&typeof IrancellCoreStoreV2Base.setParams==='function'){try{return IrancellCoreStoreV2Base.setParams(modelName,params,action||'fetch');}catch(error){return false;}}
 return false;
}

export function IrancellCoreStoreV2ClearSession(){return IrancellCoreStoreV2ClearUserState();}
export function IrancellCoreStoreV2Boot(){
 if(IRANCELL_CORE_STORE_V2_BOOT_PROMISE)return IRANCELL_CORE_STORE_V2_BOOT_PROMISE;
 if(IRANCELL_CORE_STORE_V2_LOCAL_STORE_MODE){
  IrancellCoreStoreV2Patch({meta:{...(IrancellCoreStoreV2State.meta||{}),bootStatus:'ready',bootError:null,dataMode:IRANCELL_CORE_STORE_V2_DATA_MODE,storeMode:'local',online:typeof navigator==='undefined'?true:navigator.onLine!==false}},{persist:false});
  return Promise.resolve({ok:true,data:{fixture:IRANCELL_CORE_STORE_V2_IS_FIXTURE,localStore:true}})
 }
 IrancellCoreStoreV2Patch({meta:{...(IrancellCoreStoreV2State.meta||{}),bootStatus:'restoring-session',bootError:null},session:{...(IrancellCoreStoreV2State.session||{}),status:'restoring'}},{persist:false});
 IRANCELL_CORE_STORE_V2_BOOT_PROMISE=IRANCELL_IDENTITY_GATEWAY.request('restore-session',{}).then(result=>{
  if(!result?.ok){const anonymous=result?.error?.code==='authentication_required'||result?.error?.status===401;IrancellCoreStoreV2Patch({meta:{...(IrancellCoreStoreV2State.meta||{}),bootStatus:anonymous?'ready':'blocked',bootError:anonymous?null:result.error,lastHydratedAt:new Date().toISOString()},session:{...(IrancellCoreStoreV2State.session||{}),status:'anonymous',currentUserId:null,activeRole:null,availableRoles:[]}},{persist:false});return result;}
  const responsePatch=IrancellCoreStoreV2ResponsePatch(result.data),userId=result.data?.user?.id||result.data?.user?.userId||result.data?.session?.currentUserId||responsePatch.session?.currentUserId||null;
  IrancellCoreStoreV2Patch(IrancellCoreStoreV2Merge(responsePatch,{meta:{...(IrancellCoreStoreV2State.meta||{}),bootStatus:'ready',bootError:null,lastHydratedAt:new Date().toISOString(),lastServerSyncAt:new Date().toISOString(),activeUserNamespace:userId?`user:${userId}`:'anonymous'},session:{...(responsePatch.session||{}),status:userId?'authenticated':'anonymous',currentUserId:userId}}),{persist:false});
  return result
 }).finally(()=>{IRANCELL_CORE_STORE_V2_BOOT_PROMISE=null;});
 return IRANCELL_CORE_STORE_V2_BOOT_PROMISE
}
export const IrancellCoreStoreV2=Object.freeze({
 models:IRANCELL_CORE_STORE_V2_MODELS,get:IrancellCoreStoreV2GetState,getState:IrancellCoreStoreV2GetState,set:IrancellCoreStoreV2SetStatePatch,patch:IrancellCoreStoreV2Patch,hydrate:IrancellCoreStoreV2Hydrate,update:IrancellCoreStoreV2Update,dispatch:IrancellCoreStoreV2Dispatch,subscribe:IrancellCoreStoreV2Subscribe,persist:IrancellCoreStoreV2Persist,reset:IrancellCoreStoreV2ResetModel,resetAll:IrancellCoreStoreV2ResetAll,getModel:IrancellCoreStoreV2GetModel,setParams:IrancellCoreStoreV2SetParams,boot:IrancellCoreStoreV2Boot,loadRoute:IrancellCoreStoreV2LoadRoute,clearSession:IrancellCoreStoreV2ClearSession
});
IrancellCoreStoreV2InitLogic();
if(typeof setTimeout==='function')setTimeout(function IrancellCoreStoreV2AutoBoot(){IrancellCoreStoreV2Boot();},0);
if(typeof window!=='undefined'){
 window.addEventListener('online',()=>IrancellCoreStoreV2Patch({meta:{...(IrancellCoreStoreV2State.meta||{}),online:true},ui:{...(IrancellCoreStoreV2State.ui||{}),offline:false}},{persist:false}));
 window.addEventListener('offline',()=>IrancellCoreStoreV2Patch({meta:{...(IrancellCoreStoreV2State.meta||{}),online:false},ui:{...(IrancellCoreStoreV2State.ui||{}),offline:true}},{persist:false}));
 window.Store=IrancellCoreStoreV2;window.IrancellStore=IrancellCoreStoreV2;window.initStore=function IrancellInitStore(){return window.Store;};window.StoreApi=Object.assign({},window.StoreApi,{getState:IrancellCoreStoreV2GetState,patch:IrancellCoreStoreV2Patch,dispatch:IrancellCoreStoreV2Dispatch,resetAll:IrancellCoreStoreV2ResetAll,boot:IrancellCoreStoreV2Boot});
}
