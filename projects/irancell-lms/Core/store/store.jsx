/* IRANCELL_CORE_LEGACY_STORE_DISABLED
const IRANCELL_STORE_SAFE_SEED=Object.freeze({session:{token:null,currentUserId:null,activeRole:null,status:'anonymous'},identity:{usersById:{},relationshipsById:{},permissions:{},providerVerification:{}},chisti:{conversationsById:{},problemsById:{},recommendationsByProblemId:{}},content:{catalogueById:{},search:'',recommendations:[],watchProgress:{},ratings:{},status:'idle'},marketplace:{requestsById:{},offersById:{},providersById:{},availability:{},selectedOfferId:null},consent:{documentsById:{},gatesBySessionId:{}},payment:{paymentsById:{},escrowByOrderId:{},invoicesById:{},refundsById:{}},classroom:{sessionsById:{},roomsById:{},attendanceBySessionId:{}},quality:{ratingsById:{},complaintsById:{},qualityScoresByProviderId:{}},notifications:{itemsById:{},unreadCount:0,deliveryState:'idle'},admin:{filters:{},queues:{},reports:{mau:0,gmv:0,chistiResolution:0,paidConversion:0,consentCompletion:0,classSuccess:0},systemHealth:{}},analytics:{eventQueue:[],consentFlags:{},traceContext:{}},audit:{events:[]},ui:{routeState:{route:'splash',params:{}},modals:{},toasts:[],loading:{},fieldErrors:{},offline:false}});
const IRANCELL_STORE_PERSISTENCE_KEY='irancell-lms-v1';
const IRANCELL_STORE_BOOT_SEED=typeof globalThis!=='undefined'&&globalThis.__IRANCELL_LMS_INITIAL_STATE__&&typeof globalThis.__IRANCELL_LMS_INITIAL_STATE__==='object'?globalThis.__IRANCELL_LMS_INITIAL_STATE__:IRANCELL_STORE_SAFE_SEED;
const IRANCELL_STORE_MODEL_NAMES=Object.freeze(Object.keys(IRANCELL_STORE_BOOT_SEED));
const IRANCELL_STORE_MODELS=IRANCELL_STORE_MODEL_NAMES.map(function IrancellStoreBuildModel(name){return{name,type:'object',store:'local',_data:IrancellStoreClone(IRANCELL_STORE_BOOT_SEED[name]),defaultData:IrancellStoreClone(IRANCELL_STORE_BOOT_SEED[name])};});
const IRANCELL_STORE_SUBSCRIBERS=new Set();
let IrancellStoreBase=null;
let IrancellStoreState=IrancellStoreLoadState(IRANCELL_STORE_BOOT_SEED);

function IrancellStoreClone(value){if(value===undefined)return undefined;return JSON.parse(JSON.stringify(value));}
function IrancellStoreIsPlainObject(value){return Boolean(value)&&typeof value==='object'&&!Array.isArray(value);}
function IrancellStoreMerge(base,patch){if(patch===undefined||patch===null)return IrancellStoreClone(base);if(!IrancellStoreIsPlainObject(base)||!IrancellStoreIsPlainObject(patch))return IrancellStoreClone(patch);const next={...base};Object.keys(patch).forEach(function IrancellStoreMergeKey(key){const incoming=patch[key];next[key]=IrancellStoreIsPlainObject(next[key])&&IrancellStoreIsPlainObject(incoming)?IrancellStoreMerge(next[key],incoming):incoming===undefined||incoming===null?IrancellStoreClone(next[key]):IrancellStoreClone(incoming);});return next;}
function IrancellStoreLoadState(seedSource){const seed=IrancellStoreClone(seedSource||IRANCELL_STORE_SAFE_SEED);if(typeof window==='undefined'||!window.localStorage)return seed;try{const raw=window.localStorage.getItem(IRANCELL_STORE_PERSISTENCE_KEY);if(!raw)return seed;const parsed=JSON.parse(raw);return IrancellStoreMerge(seed,parsed);}catch(error){return seed;}}
function IrancellStorePersistState(){if(typeof window==='undefined'||!window.localStorage)return;try{window.localStorage.setItem(IRANCELL_STORE_PERSISTENCE_KEY,JSON.stringify(IrancellStoreState));}catch(error){if(window.console)window.console.warn('IranCell LMS store persistence failed.',error);}}
function IrancellStoreCreateBase(){if(IrancellStoreBase)return IrancellStoreBase;if(typeof createStore!=='function')return null;try{IrancellStoreBase=createStore({models:IRANCELL_STORE_MODELS,localStoreKey:IRANCELL_STORE_PERSISTENCE_KEY});return IrancellStoreBase;}catch(error){if(typeof window!=='undefined'&&window.console)window.console.warn('IranCell LMS data-store initialization failed; safe in-memory mode is active.',error);return null;}}
function IrancellStoreSyncBase(patch){const base=IrancellStoreCreateBase();if(!base)return;try{if(typeof base.patch==='function')base.patch(patch);else if(typeof base.set==='function')base.set(patch);else if(typeof base.update==='function')base.update(patch);}catch(error){if(typeof window!=='undefined'&&window.console)window.console.warn('IranCell LMS data-store synchronization failed.',error);}}
function IrancellStoreNotify(){IRANCELL_STORE_SUBSCRIBERS.forEach(function IrancellStoreNotifySubscriber(listener){try{listener(IrancellStoreState);}catch(error){if(typeof window!=='undefined'&&window.console)window.console.error('IranCell LMS store subscriber failed.',error);}});}
function IrancellStoreCommit(nextState,patchForBase){if(!nextState||nextState===IrancellStoreState)return IrancellStoreState;IrancellStoreState=nextState;IrancellStorePersistState();IrancellStoreSyncBase(patchForBase||nextState);IrancellStoreNotify();return IrancellStoreState;}

export const IrancellStore=Object.freeze({
 models:IRANCELL_STORE_MODELS,
 get:function IrancellStoreGet(){return IrancellStoreState;},
 getState:function IrancellStoreGetState(){return IrancellStoreState;},
 getModel:function IrancellStoreGetModel(name){return IrancellStoreState[name];},
 set:function IrancellStoreSet(patchOrUpdater){const patch=typeof patchOrUpdater==='function'?patchOrUpdater(IrancellStoreState):patchOrUpdater;if(!patch||typeof patch!=='object')return IrancellStoreState;return IrancellStoreCommit(IrancellStoreMerge(IrancellStoreState,patch),patch);},
 patch:function IrancellStorePatch(patchOrUpdater){return IrancellStore.set(patchOrUpdater);},
 update:function IrancellStoreUpdate(name,valueOrUpdater){if(!IRANCELL_STORE_MODEL_NAMES.includes(name))return IrancellStoreState;const current=IrancellStoreState[name];const value=typeof valueOrUpdater==='function'?valueOrUpdater(current):valueOrUpdater;return IrancellStore.set({[name]:value});},
 dispatch:function IrancellStoreDispatch(action){if(!action||typeof action.type!=='string')return action;const nextState=IrancellCoreReducer(IrancellStoreState,action);IrancellStoreCommit(nextState,nextState);return action;},
 subscribe:function IrancellStoreSubscribe(listener){if(typeof listener!=='function')return function IrancellStoreNoopUnsubscribe(){};IRANCELL_STORE_SUBSCRIBERS.add(listener);return function IrancellStoreUnsubscribe(){IRANCELL_STORE_SUBSCRIBERS.delete(listener);};},
 reset:function IrancellStoreReset(){const seed=typeof globalThis!=='undefined'&&globalThis.__IRANCELL_LMS_INITIAL_STATE__||IRANCELL_STORE_SAFE_SEED;const next=IrancellStoreClone(seed);return IrancellStoreCommit(next,next);},
 hydrate:function IrancellStoreHydrate(snapshot){const seed=typeof globalThis!=='undefined'&&globalThis.__IRANCELL_LMS_INITIAL_STATE__||IRANCELL_STORE_SAFE_SEED;const next=IrancellStoreMerge(IrancellStoreClone(seed),snapshot||{});return IrancellStoreCommit(next,next);},
 persist:function IrancellStorePersist(){IrancellStorePersistState();return IrancellStoreState;}
});

export function IrancellStoreProvider({children}){return children??null;}
export function useIrancellStore(){const[state,setState]=React.useState(function IrancellUseStoreInitialState(){return IrancellStore.getState();});React.useEffect(function IrancellUseStoreSubscribe(){setState(IrancellStore.getState());return IrancellStore.subscribe(function IrancellUseStoreHandleChange(nextState){setState(nextState);});},[]);const dispatch=React.useCallback(function IrancellUseStoreDispatch(action){return IrancellStore.dispatch(action);},[]);return React.useMemo(function IrancellUseStoreValue(){return{state,dispatch,store:IrancellStore};},[state,dispatch]);}
export function IrancellSelectCurrentUser(state){return state&&state.identity&&state.identity.usersById?state.identity.usersById[state.session.currentUserId]||null:null;}
export function IrancellSelectRoleItems(state,collection){return Object.values(collection||{}).filter(Boolean);}

function IrancellStoreHydratePublishedSeed(){if(typeof globalThis==='undefined')return;const publishedSeed=globalThis.__IRANCELL_LMS_INITIAL_STATE__;if(!IrancellStoreIsPlainObject(publishedSeed)||publishedSeed===IRANCELL_STORE_BOOT_SEED)return;const next=IrancellStoreLoadState(publishedSeed);IrancellStoreCommit(next,next);}
let IRANCELL_STORE_INIT_INTERVAL_ID=null;
function IrancellStoreInitRuntime(){if(IrancellStoreCreateBase())return true;if(typeof setInterval!=='function')return false;IRANCELL_STORE_INIT_INTERVAL_ID=setInterval(function IrancellStoreRetryCreateBase(){if(IrancellStoreCreateBase()){clearInterval(IRANCELL_STORE_INIT_INTERVAL_ID);IRANCELL_STORE_INIT_INTERVAL_ID=null;}},50);if(typeof setTimeout==='function')setTimeout(function IrancellStoreStopRetry(){if(IRANCELL_STORE_INIT_INTERVAL_ID){clearInterval(IRANCELL_STORE_INIT_INTERVAL_ID);IRANCELL_STORE_INIT_INTERVAL_ID=null;}},10000);return false;}
IrancellStoreInitRuntime();
if(typeof setTimeout==='function')setTimeout(IrancellStoreHydratePublishedSeed,0);
if(typeof window!=='undefined'){
 window.IrancellStore=IrancellStore;
 window.Store=IrancellStore;
 window.initStore=function IrancellInitStore(){return window.Store;};
}
*/
export const IRANCELL_CORE_LEGACY_STORE_DISABLED=Object.freeze({activeStore:'store.js'});
