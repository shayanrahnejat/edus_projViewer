export function IrancellChistiStartConversation(){return{type:'IRANCELL_CHISTI_START_CONVERSATION'};}
export function IrancellChistiSubmitProblem(payload){return{type:'IRANCELL_CHISTI_SUBMIT',...payload};}
export function IrancellChistiAdvanceProcessing(problemId,stage,progress){return{type:'IRANCELL_CHISTI_ADVANCE_PROCESSING',problemId,stage,progress};}
export function IrancellChistiResolveProblem(problemId){return{type:'IRANCELL_CHISTI_RESOLVE_PROBLEM',problemId};}
export function IrancellChistiFailProcessing(problemId,errorCode,message){return{type:'IRANCELL_CHISTI_FAIL_PROCESSING',problemId,errorCode,message};}
export function IrancellChistiCancelProcessing(problemId){return{type:'IRANCELL_CHISTI_CANCEL_PROCESSING',problemId};}
export function IrancellChistiRetryProblem(problemId){return{type:'IRANCELL_CHISTI_RETRY_PROBLEM',problemId};}
export function IrancellChistiDismissResult(problemId){return{type:'IRANCELL_CHISTI_DISMISS_RESULT',problemId};}

export async function IrancellChistiRunProcessing(dispatch,problemId){
 if(typeof dispatch!=='function'||!problemId)return false;
 const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
 const gatewayOperations=IRANCELL_APP_CONFIG.api?.operations||{};
 const gatewayEnabled=Boolean(IRANCELL_APP_CONFIG.api?.baseUrl&&Object.keys(gatewayOperations).length);
 const gateway=gatewayEnabled&&typeof IRANCELL_CHISTI_GATEWAY!=='undefined'?IRANCELL_CHISTI_GATEWAY:null;

 async function requestStage(operation,stage,progress,minimumDelay){
  dispatch(IrancellChistiAdvanceProcessing(problemId,stage,progress));
  const gatewayPromise=gateway&&typeof gateway.request==='function'?gateway.request(operation,{problemId}):Promise.resolve({ok:true,operation,problemId});
  const result=await Promise.race([
   Promise.all([gatewayPromise,wait(minimumDelay)]).then(values=>values[0]),
   wait(8000).then(()=>{throw new Error('chisti_timeout')})
  ]);
  if(result&&result.ok===false)throw new Error(result.errorCode||'chisti_service_error');
  return result
 }

 try{
  await requestStage('classify-problem','topic',18,600);
  await requestStage('retrieve-learning-resources','resources',45,720);
  await requestStage('build-learning-path','path',72,760);
  await requestStage('compose-answer','answer',92,720);
  dispatch(IrancellChistiResolveProblem(problemId));
  return true
 }catch(error){
  const code=error?.message==='chisti_timeout'?'timeout':'service_error';
  const message=code==='timeout'?'آماده‌سازی پاسخ بیشتر از حد انتظار طول کشید. دوباره تلاش کنید.':'در آماده‌سازی پاسخ مشکلی پیش آمد. سؤال شما ذخیره شده و می‌توانید دوباره تلاش کنید.';
  dispatch(IrancellChistiFailProcessing(problemId,code,message));
  return false
 }
}