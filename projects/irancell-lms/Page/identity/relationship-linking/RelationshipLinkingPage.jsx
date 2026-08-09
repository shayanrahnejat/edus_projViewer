export const IRANCELL_IDENTITY_ACTIVATION_STAGES=Object.freeze([
 {progress:0,firstComplete:false,secondComplete:false,configurationText:'در انتظار شروع...'},
 {progress:33,firstComplete:true,secondComplete:false,configurationText:'در انتظار شروع...'},
 {progress:66,firstComplete:true,secondComplete:true,configurationText:'در حال پیکربندی دستیار هوشمند...'},
 {progress:100,firstComplete:true,secondComplete:true,configurationText:'در حال پیکربندی دستیار هوشمند...'}
]);

export function IrancellIdentityActivationStatusIcon({complete=false,loading=false}){
 if(loading)return <svg className="ir-activation-svg__spinner" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/></svg>;
 return <svg className={`ir-activation-svg__check ${complete?'is-complete':''}`} viewBox="0 0 20 20" aria-hidden="true"><path d="M18.1669 8.334C18.5474 10.201 18.2762 12.143 17.3984 13.835C16.5206 15.527 15.0893 16.867 13.3431 17.631C11.597 18.396 9.6415 18.538 7.8029 18.036C5.9643 17.533 4.3537 16.415 3.2396 14.868C2.1255 13.321 1.5753 11.44 1.6807 9.536C1.7862 7.633 2.5409 5.824 3.8191 4.41C5.0972 2.995 6.8215 2.062 8.7044 1.766C10.5873 1.469 12.515 1.827 14.166 2.779M7.4997 9.167L9.9997 11.667L18.333 3.333" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}

export function IrancellIdentityActivationStagePage({stageIndex=0,onBack,onContinue}){
 const safeStageIndex=Math.max(0,Math.min(IRANCELL_IDENTITY_ACTIVATION_STAGES.length-1,Number(stageIndex)||0)),stage=IRANCELL_IDENTITY_ACTIVATION_STAGES[safeStageIndex],active=stage.progress===100;
 return <IrancellIdentityFrame className={`ir-activation-svg ${active?'is-active':''}`}>
  <section className="ir-activation-svg__page" aria-live="polite">
   <button type="button" className="ir-activation-svg__back" aria-label="بازگشت" onClick={onBack}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18 9 12l6-6"/></svg>
   </button>
   <div className="ir-activation-svg__visual" aria-hidden="true"><span/></div>
   <div className="ir-activation-svg__copy">
    <h1>در حال فعال‌سازی سیستم یادگیری</h1>
    <p>هوش مصنوعی شما بر اساس انتخاب‌هایتان در حال پیکربندی است</p>
   </div>
   <article className="ir-activation-svg__status">
    <div className={stage.firstComplete?'is-complete':''}>
     <strong>برنامه درسی شناسایی شد</strong>
     <IrancellIdentityActivationStatusIcon complete={stage.firstComplete}/>
    </div>
    <div className={stage.secondComplete?'is-complete':''}>
     <strong>اهداف یادگیری تنظیم شد</strong>
     <IrancellIdentityActivationStatusIcon complete={stage.secondComplete}/>
    </div>
    <div className="is-configuring">
     <strong>{stage.configurationText}</strong>
     <IrancellIdentityActivationStatusIcon loading/>
    </div>
    <div className="ir-activation-svg__progress" aria-label={`${stage.progress} درصد تکمیل شده`}><span style={{width:`${stage.progress}%`}}/></div>
    <footer>
     <span>لطفاً شکیبا باشید</span>
     <strong>{IrancellFormatPersianNumber(stage.progress)}٪ تکمیل شده</strong>
    </footer>
   </article>
   <button type="button" className="ir-activation-svg__continue" disabled={!active} onClick={onContinue}>فعال‌سازی فضای یادگیری من</button>
  </section>
 </IrancellIdentityFrame>
}

export function IrancellIdentityRelationshipLinkingPage({onNavigate}){
 const{state,dispatch}=useIrancellStore(),[stageIndex,setStageIndex]=useState(0),role=state.session.activeRole,homeRoute=IRANCELL_ROLE_HOME_ROUTES[role]||'student/home',completed=stageIndex===IRANCELL_IDENTITY_ACTIVATION_STAGES.length-1;
 React.useEffect(function IrancellIdentityActivationStageProgress(){
  if(completed)return undefined;
  const timeoutId=setTimeout(()=>setStageIndex(current=>Math.min(IRANCELL_IDENTITY_ACTIVATION_STAGES.length-1,current+1)),1200);
  return()=>clearTimeout(timeoutId)
 },[stageIndex,completed]);
 function finish(){
  if(!completed)return;
  dispatch({type:'IRANCELL_IDENTITY_ACTIVATION_COMPLETE'});
  onNavigate(homeRoute)
 }
 return <IrancellIdentityActivationStagePage stageIndex={stageIndex} onBack={()=>onNavigate('profile-completion')} onContinue={finish}/>
}