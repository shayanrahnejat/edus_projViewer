export function IrancellStoreRead(store){const source=store||IrancellCoreStoreV2;if(!source)return{};if(typeof source.getState==='function')return source.getState()||{};if(typeof source.get==='function')return source.get()||{};return{};}
export function IrancellUseStore(selector){
 const activeStore=IrancellCoreStoreV2;
 const[state,setState]=React.useState(function IrancellUseStoreInitialState(){return IrancellStoreRead(activeStore);});
 React.useEffect(function IrancellUseStoreSubscribe(){
  setState(IrancellStoreRead(activeStore));
  if(!activeStore||typeof activeStore.subscribe!=='function')return function IrancellUseStoreNoopCleanup(){};
  return activeStore.subscribe(function IrancellUseStoreHandleChange(nextState){setState(nextState||IrancellStoreRead(activeStore));});
 },[activeStore]);
 const dispatch=React.useCallback(function IrancellUseStoreDispatch(action){return activeStore.dispatch(action);},[activeStore]);
 const selected=typeof selector==='function'?selector(state):state;
 return typeof selector==='function'?selected:React.useMemo(function IrancellUseStoreValue(){return{state:selected,dispatch,store:activeStore};},[selected,dispatch,activeStore]);
}
export function IrancellCoreSelectCurrentUser(state){return state&&state.identity&&state.identity.usersById?state.identity.usersById[state.session.currentUserId]||null:null;}
export function IrancellCoreSelectRoleItems(state,collection){return Object.values(collection||{}).filter(Boolean);}
if(typeof window!=='undefined'){
 window.AppHooks=Object.assign({},window.AppHooks,{useIrancellStore:IrancellUseStore});
 window.StoreUtils=Object.assign({},window.StoreUtils,{IrancellSelectCurrentUser:IrancellCoreSelectCurrentUser,IrancellSelectRoleItems:IrancellCoreSelectRoleItems});
}
