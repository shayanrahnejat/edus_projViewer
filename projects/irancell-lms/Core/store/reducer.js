function IrancellReducerClone(value){return JSON.parse(JSON.stringify(value));}
function IrancellReducerAnalytics(state,eventName,payload={}){
 const event={eventName,eventVersion:1,occurredAt:new Date().toISOString(),userId:state.session.currentUserId,activeRole:state.session.activeRole,sessionId:state.session.token,screenId:payload.screenId||null,route:state.ui.routeState.route,entityType:payload.entityType||null,entityId:payload.entityId||null,traceId:IrancellCreateId('trace'),sourceModule:payload.sourceModule||'frontend',outcome:payload.outcome||'success',errorCode:payload.errorCode||null,properties:payload.properties||{},privacyClass:payload.privacyClass||'internal'};
 return{...state,analytics:{...state.analytics,eventQueue:[...state.analytics.eventQueue,event].slice(-500)}};
}
function IrancellReducerAudit(state,eventName,details={}){
 const event={id:IrancellCreateId('audit'),eventName,occurredAt:new Date().toISOString(),actorId:state.session.currentUserId,activeRole:state.session.activeRole,traceId:IrancellCreateId('trace'),details};
 return{...state,audit:{...state.audit,events:[event,...state.audit.events].slice(0,250)}};
}
function IrancellReducerToast(state,message,tone='error'){
 const toast={id:IrancellCreateId('toast'),message,tone};
 return{...state,ui:{...state.ui,toasts:[...state.ui.toasts,toast].slice(-4)}};
}
function IrancellReducerReject(state,eventName,errorCode,message,properties={}){
 return IrancellReducerToast(IrancellReducerAnalytics(state,eventName,{outcome:'failure',errorCode,properties}),message,'error');
}
function IrancellReducerFindUserByMobile(state,mobile){return Object.values(state.identity.usersById).find(function IrancellReducerMatchMobile(user){return user&&user.mobile===mobile;})||null;}
function IrancellReducerCanParentManageChild(state,parentId,childId){return IrancellCanViewChild(state,parentId,childId);}
function IrancellReducerHasBlockingComplaint(state,sessionId){return Object.values(state.quality.complaintsById).some(function IrancellReducerBlockingComplaint(item){return item&&item.sessionId===sessionId&&['submitted','triaged','reviewing','approved'].includes(item.status);});}
function IrancellReducerProviderIsActive(state,providerId){const provider=state.marketplace.providersById[providerId];const user=state.identity.usersById[providerId];return Boolean(provider&&provider.verificationStatus==='verified'&&(!user||user.status==='active'));}

export function IrancellCoreReducer(state,action){
 const s=state||IrancellReducerClone(IRANCELL_INITIAL_STATE);
 if(!action||typeof action.type!=='string')return s;
 switch(action.type){
  case'IRANCELL_RESET':return IrancellReducerClone(IRANCELL_INITIAL_STATE);
  case'IRANCELL_ROUTE_CHANGED':{
   const currentRoute=String(s.ui?.routeState?.route||'');
   const nextRoute=String(action.route||'');
   const currentHistory=Array.isArray(s.ui?.navigationHistory)?s.ui.navigationHistory:[];
   const navigationHistory=currentRoute&&currentRoute!==nextRoute?[...currentHistory,currentRoute].slice(-30):currentHistory;
   return IrancellReducerAnalytics({...s,ui:{...s.ui,routeState:{route:nextRoute,params:action.params||{}},navigationHistory}},'ScreenViewed',{screenId:action.screenId,properties:{route:nextRoute}});
  }
  case'IRANCELL_NAVIGATION_BACK':{
   const currentHistory=Array.isArray(s.ui?.navigationHistory)?s.ui.navigationHistory:[];
   return{...s,ui:{...s.ui,navigationHistory:currentHistory.slice(0,-1)}};
  }
  case'IRANCELL_AUTH_LOGIN_CREDENTIALS':{
   const username=String(action.username||'').trim();
   const password=String(action.password||'');
   const usernameDigits=username.replace(/\D/g,'');
   const normalizedMobile=usernameDigits.length===10&&usernameDigits.startsWith('9')?`0${usernameDigits}`:usernameDigits.length===12&&usernameDigits.startsWith('98')?`0${usernameDigits.slice(2)}`:usernameDigits;
   if(!/^09\d{9}$/.test(normalizedMobile)||password.length<6)return IrancellReducerAnalytics({...s,session:{...s.session,token:null,currentUserId:null,candidateUserId:null,availableRoles:[],activeRole:null,status:'credential_error'}},'UserAuthenticationFailed',{sourceModule:'kisti',outcome:'failure',errorCode:'invalid_credentials'});
   let matched=Object.values(s.identity.usersById).find(function IrancellReducerMatchCredentialUser(user){return Boolean(user&&(user.username===username||user.mobile===username||user.mobile===normalizedMobile));})||null;
   let identity=s.identity;
   const isNewUser=!matched;
   if(isNewUser){
    const userId=`kisti-${normalizedMobile}`;
    matched={id:userId,username:null,name:'کاربر جدید کیستی',mobile:normalizedMobile,roles:['student','parent','academy','content-provider'],status:'active',age:null,grade:null,credentialPassword:password,credentialConfigured:true,registrationSource:'kisti-auto'};
    identity={...s.identity,usersById:{...s.identity.usersById,[userId]:matched}};
   }else{
    const expectedPassword=String(matched.credentialPassword||IRANCELL_APP_CONFIG.demoPassword);
    if(password!==expectedPassword)return IrancellReducerAnalytics({...s,session:{...s.session,token:null,currentUserId:null,candidateUserId:null,availableRoles:[],activeRole:null,status:'credential_error'}},'UserAuthenticationFailed',{entityType:'user',entityId:matched.id,sourceModule:'kisti',outcome:'failure',errorCode:'invalid_credentials'});
   }
   const roles=(Array.isArray(matched.roles)&&matched.roles.length?matched.roles:['student']).filter(function IrancellReducerFilterSupportedCredentialRole(roleKey){return Boolean(IRANCELL_ROLE_HOME_ROUTES[roleKey]);});
   if(!roles.length)return IrancellReducerAnalytics({...s,session:{...s.session,token:null,currentUserId:null,candidateUserId:null,availableRoles:[],activeRole:null,status:'credential_error'}},'UserAuthenticationFailed',{entityType:'user',entityId:matched.id,sourceModule:'kisti',outcome:'failure',errorCode:'role_unavailable'});
   const needsRoleSelection=isNewUser||roles.length>1;
   const nextSession=needsRoleSelection?{...s.session,token:null,currentUserId:null,candidateUserId:matched.id,availableRoles:roles,activeRole:null,status:'role_pending',mobile:matched.mobile,pendingMobile:null,otpPurpose:null,requiresOnboarding:isNewUser}:{...s.session,token:IrancellCreateId('session'),currentUserId:matched.id,candidateUserId:null,availableRoles:roles,activeRole:roles[0],status:'authenticated',mobile:matched.mobile,pendingMobile:null,otpPurpose:null,requiresOnboarding:false};
   return IrancellReducerAnalytics({...s,identity,session:nextSession,ui:{...s.ui,fieldErrors:{...s.ui.fieldErrors,auth:null}}},isNewUser?'UserRegistered':'UserAuthenticated',{entityType:'user',entityId:matched.id,sourceModule:'kisti',properties:{method:'username_password',firstUse:isNewUser}});
  }
  case'IRANCELL_AUTH_REGISTER_KISTI':{
   const requestedMobile=String(action.mobile||IRANCELL_APP_CONFIG.demoKistiSignupMobile||'').replace(/\D/g,'');
   const normalizedMobile=requestedMobile.length===10&&requestedMobile.startsWith('9')?`0${requestedMobile}`:requestedMobile.length===12&&requestedMobile.startsWith('98')?`0${requestedMobile.slice(2)}`:requestedMobile;
   if(!/^09\d{9}$/.test(normalizedMobile))return IrancellReducerReject(s,'UserRegistrationFailed','mobile_invalid','شماره موبایل بازگشتی از کیستی معتبر نیست.');
   let matched=IrancellReducerFindUserByMobile(s,normalizedMobile);
   let identity=s.identity;
   const isNewUser=!matched;
   if(isNewUser){
    const userId=`kisti-${normalizedMobile}`;
    matched={id:userId,username:null,name:'کاربر جدید کیستی',mobile:normalizedMobile,roles:['student','parent','academy','content-provider'],status:'active',age:null,grade:null,credentialPassword:IRANCELL_APP_CONFIG.demoPassword,credentialConfigured:false,registrationSource:'kisti'};
    identity={...s.identity,usersById:{...s.identity.usersById,[userId]:matched}};
   }
   const roles=(Array.isArray(matched.roles)&&matched.roles.length?matched.roles:['student']).filter(function IrancellReducerFilterSupportedKistiRole(roleKey){return Boolean(IRANCELL_ROLE_HOME_ROUTES[roleKey]);});
   if(!roles.length)return IrancellReducerReject(s,'UserAuthenticationFailed','role_unavailable','این نوع حساب در نسخه فعلی قابل ورود نیست.');
   return IrancellReducerAnalytics({...s,identity,session:{...s.session,token:null,currentUserId:null,candidateUserId:matched.id,availableRoles:roles,activeRole:null,status:'role_pending',mobile:matched.mobile,pendingMobile:null,otpPurpose:null,requiresOnboarding:isNewUser}},isNewUser?'UserRegistered':'UserAuthenticated',{entityType:'user',entityId:matched.id,sourceModule:'kisti',properties:{method:'kisti',firstUse:isNewUser}});
  }
  case'IRANCELL_AUTH_REQUEST_OTP':{
   const purpose=action.purpose||'login';
   if(purpose==='family-approval'&&s.session.currentUserId)return{...s,session:{...s.session,pendingMobile:action.mobile,status:'otp_pending',otpPurpose:purpose}};
   return{...s,session:{...s.session,token:null,currentUserId:null,candidateUserId:null,availableRoles:[],activeRole:null,pendingMobile:action.mobile,mobile:null,status:'otp_pending',otpPurpose:purpose,requiresOnboarding:false}};
  }
  case'IRANCELL_AUTH_VERIFY_OTP':{
   if(!s.session.pendingMobile||String(action.otp)!==String(IRANCELL_APP_CONFIG.otpCode))return IrancellReducerReject({...s,session:{...s.session,status:'otp_error'}},'UserAuthenticationFailed','invalid_otp','کد یک‌بارمصرف صحیح نیست یا درخواست ورود منقضی شده است.');
   if(s.session.otpPurpose==='family-approval')return IrancellReducerAnalytics({...s,session:{...s.session,status:'authenticated',pendingMobile:null,otpPurpose:null}},'ParentGateVerified',{entityType:'user',entityId:s.session.currentUserId,sourceModule:'kisti',properties:{method:'otp'}});
   let matched=IrancellReducerFindUserByMobile(s,s.session.pendingMobile);
   let identity=s.identity;
   const isNewUser=!matched;
   if(isNewUser){
    const userId=`kisti-${String(s.session.pendingMobile)}`;
    matched={id:userId,username:null,name:'کاربر جدید کیستی',mobile:s.session.pendingMobile,roles:['student','parent','academy','content-provider'],status:'active',age:null,grade:null,credentialPassword:IRANCELL_APP_CONFIG.demoPassword,credentialConfigured:false,registrationSource:'otp-kisti'};
    identity={...s.identity,usersById:{...s.identity.usersById,[userId]:matched}};
   }
   const roles=(Array.isArray(matched.roles)&&matched.roles.length?matched.roles:['student']).filter(function IrancellReducerFilterSupportedOtpRole(roleKey){return Boolean(IRANCELL_ROLE_HOME_ROUTES[roleKey]);});
   if(!roles.length)return IrancellReducerReject(s,'UserAuthenticationFailed','role_unavailable','این نوع حساب در نسخه فعلی قابل ورود نیست.');
   return IrancellReducerAnalytics({...s,identity,session:{...s.session,token:null,currentUserId:null,status:'role_pending',mobile:s.session.pendingMobile,pendingMobile:null,otpPurpose:null,candidateUserId:matched.id,availableRoles:roles,activeRole:null,requiresOnboarding:isNewUser}},isNewUser?'UserRegistered':'UserAuthenticated',{entityType:'user',entityId:matched.id,sourceModule:'kisti',properties:{method:'otp',firstUse:isNewUser}});
  }
  case'IRANCELL_AUTH_COMPLETE_REGISTRATION':{
   const userId=s.session.currentUserId||s.session.candidateUserId;
   const user=s.identity.usersById[userId];
   const username=String(action.username||'').trim();
   const password=String(action.password||'');
   if(!user||!username||password.length<6)return IrancellReducerReject(s,'UserRegistrationFailed','credentials_invalid','نام کاربری و رمز عبور معتبر وارد کنید.');
   const duplicate=Object.values(s.identity.usersById).some(function IrancellReducerDuplicateUsername(item){return item&&item.id!==user.id&&item.username===username;});
   if(duplicate)return IrancellReducerReject(s,'UserRegistrationFailed','username_exists','این نام کاربری قبلاً استفاده شده است.');
   const updatedUser={...user,username,credentialPassword:password,credentialConfigured:true};
   return IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[user.id]:updatedUser}},session:{...s.session,requiresOnboarding:false}},'UserRegistrationCompleted',{entityType:'user',entityId:user.id,sourceModule:'kisti'});
  }
  case'IRANCELL_AUTH_SELECT_ROLE':{
   if(!['role_pending','authenticated'].includes(s.session.status))return IrancellReducerReject(s,'RoleSelectionFailed','identity_required','ابتدا ورود کیستی و کد یک‌بارمصرف را کامل کنید.');
   const userId=s.session.candidateUserId||s.session.currentUserId;
   const user=s.identity.usersById[userId];
   const roles=Array.isArray(s.session.availableRoles)&&s.session.availableRoles.length?s.session.availableRoles:Array.isArray(user?.roles)?user.roles:[];
   if(!user||!roles.includes(action.role)||!IRANCELL_ROLE_HOME_ROUTES[action.role])return IrancellReducerReject(s,'RoleSelectionFailed','role_not_assigned','این نقش برای حساب کیستی شما فعال نیست.');
   return IrancellReducerAnalytics({...s,session:{...s.session,token:s.session.token||IrancellCreateId('session'),currentUserId:user.id,candidateUserId:null,availableRoles:roles,activeRole:action.role,status:'authenticated'}},'RoleSelected',{entityType:'user',entityId:user.id,sourceModule:'kisti',properties:{role:action.role}});
  }
  case'IRANCELL_AUTH_LOGOUT':return IrancellReducerAudit({...s,session:{...IRANCELL_INITIAL_STATE.session},ui:{...s.ui,routeState:{route:'auth/login',params:{}}}},'UserLoggedOut',{});
  case'IRANCELL_DEMO_ACTIVATE_PROFILE':{
   const demoConfig=IRANCELL_APP_CONFIG.demoMode;
   const profile=demoConfig?.profiles?.[action.profileKey]||null;
   if(!demoConfig?.enabled||s.settings?.demo?.enabled===false||!profile)return IrancellReducerReject(s,'DemoProfileActivationFailed','demo_disabled','حالت دمو در این محیط فعال نیست.');
   const user=s.identity.usersById[profile.userId];
   const supportedRoles=Array.isArray(user?.roles)?user.roles.filter(function IrancellReducerFilterSupportedDemoRole(roleKey){return Boolean(IRANCELL_ROLE_HOME_ROUTES[roleKey]);}):[];
   if(!user||!supportedRoles.includes(profile.role))return IrancellReducerReject(s,'DemoProfileActivationFailed','demo_profile_invalid','پروفایل دمو معتبر نیست.');
   const nextSession={...s.session,token:IrancellCreateId('demo-session'),currentUserId:user.id,candidateUserId:null,availableRoles:supportedRoles,activeRole:profile.role,status:'authenticated',mobile:user.mobile,pendingMobile:null,otpPurpose:null,requiresOnboarding:false};
   return IrancellReducerAnalytics({...s,session:nextSession,ui:{...s.ui,fieldErrors:{...s.ui.fieldErrors,auth:null}}},'DemoProfileActivated',{entityType:'user',entityId:user.id,sourceModule:'demo',properties:{profileKey:action.profileKey,role:profile.role}});
  }
  case'IRANCELL_ADMIN_SETTINGS_UPDATE':{
   if(s.session.activeRole!=='admin')return IrancellReducerReject(s,'AdminSettingsUpdateFailed','admin_required','تغییر تنظیمات سامانه فقط برای مدیر مجاز است.');
   const patch=action.settings&&typeof action.settings==='object'?action.settings:{};
   const currentSettings=s.settings||IRANCELL_INITIAL_STATE.settings;
   const settings={
    ...currentSettings,
    demo:{...(currentSettings.demo||{}),...(patch.demo||{})},
    appearance:{...(currentSettings.appearance||{}),...(patch.appearance||{})}
   };
   const offlineSimulation=Boolean(settings.demo?.offlineSimulation);
   return IrancellReducerAnalytics({...s,settings,ui:{...s.ui,offline:offlineSimulation}},'AdminSettingsUpdated',{entityType:'settings',entityId:'application',sourceModule:'admin',properties:{fontScale:settings.appearance?.fontScale,demoEnabled:settings.demo?.enabled,offlineSimulation}});
  }
  case'IRANCELL_ADMIN_SETTINGS_RESET':{
   if(s.session.activeRole!=='admin')return IrancellReducerReject(s,'AdminSettingsResetFailed','admin_required','بازنشانی تنظیمات فقط برای مدیر مجاز است.');
   return IrancellReducerAnalytics({...s,settings:IrancellReducerClone(IRANCELL_INITIAL_STATE.settings),ui:{...s.ui,offline:false}},'AdminSettingsReset',{entityType:'settings',entityId:'application',sourceModule:'admin'});
  }
  case'IRANCELL_CHISTI_START_CONVERSATION':{
   if(s.session.status!=='authenticated'||s.session.activeRole!=='student')return IrancellReducerReject(s,'ConversationStartFailed','student_required','ایجاد گفت‌وگوی چیستی فقط برای دانش‌آموز فعال است.');
   if(s.chisti.activeJob?.status==='processing')return IrancellReducerReject(s,'ConversationStartFailed','already_processing','ابتدا منتظر آماده‌شدن پاسخ فعلی بمانید یا آن را لغو کنید.');
   return{...s,chisti:{...s.chisti,activeConversationId:null,lastCompletedProblemId:null,error:null,status:'ready'}};
  }
  case'IRANCELL_CHISTI_SUBMIT':{
   if(s.session.status!=='authenticated'||s.session.activeRole!=='student')return IrancellReducerReject(s,'ProblemSubmissionFailed','student_required','ثبت سؤال فقط برای نقش دانش‌آموز فعال است.');
   const text=String(action.text||'').trim();
   if(!text)return IrancellReducerReject(s,'ProblemSubmissionFailed','problem_required','متن سؤال را وارد کنید.');
   if(s.chisti.activeJob&&s.chisti.activeJob.status==='processing')return IrancellReducerAnalytics({...s,chisti:{...s.chisti,error:{code:'already_processing',message:'پاسخ سؤال قبلی هنوز در حال آماده‌سازی است.',problemId:s.chisti.activeJob.problemId}}},'ProblemSubmissionFailed',{sourceModule:'chisti',outcome:'failure',errorCode:'already_processing'});
   const lowerText=text.toLowerCase();
   const detectedSubject=/نیوتن|فیزیک|نیرو|شتاب|سرعت|انرژی/.test(lowerText)?'فیزیک':/گرامر|انگلیسی|english|present|past/.test(lowerText)?'زبان انگلیسی':/شیمی|مول|اتم|واکنش/.test(lowerText)?'شیمی':action.subject||'ریاضی';
   const detectedTopic=/نیوتن|نیرو|شتاب/.test(lowerText)?'فیزیک کلاسیک':/معادله درجه دوم|درجه دوم|سهمی/.test(lowerText)?'معادله درجه دوم':/گرامر|present|past/.test(lowerText)?'گرامر زبان':action.topic&&action.topic!=='تشخیص خودکار'?action.topic:detectedSubject;
   const problemId=action.problemId||IrancellCreateId('problem');
   const conversationId=s.chisti.activeConversationId||IrancellCreateId('conversation');
   const createdAt=new Date().toISOString();
   const problem={id:problemId,ownerId:s.session.currentUserId,text,subject:detectedSubject,grade:action.grade||'دهم',topic:detectedTopic,intent:'learning_help',urgency:action.urgency||'عادی',attachmentName:action.attachmentName||'',createdAt,status:'processing'};
   const activeJob={id:IrancellCreateId('chisti-job'),problemId,conversationId,status:'processing',stage:'queued',progress:8,detectedSubject,detectedTopic,startedAt:createdAt,updatedAt:createdAt};
   const conversation=s.chisti.conversationsById[conversationId]||{id:conversationId,ownerId:s.session.currentUserId,problemIds:[],createdAt};
   return IrancellReducerAnalytics({...s,chisti:{...s.chisti,activeConversationId:conversationId,activeJob,lastCompletedProblemId:null,status:'processing',error:null,problemsById:{...s.chisti.problemsById,[problemId]:problem},conversationsById:{...s.chisti.conversationsById,[conversationId]:{...conversation,problemIds:[...conversation.problemIds,problemId],updatedAt:createdAt}}}},'ProblemSubmitted',{entityType:'problem',entityId:problemId,sourceModule:'chisti',properties:{subject:detectedSubject,topic:detectedTopic,hasAttachment:Boolean(action.attachmentName)}});
  }
  case'IRANCELL_CHISTI_ADVANCE_PROCESSING':{
   const job=s.chisti.activeJob;
   if(!job||job.problemId!==action.problemId||job.status!=='processing')return s;
   const progress=Math.max(job.progress||0,Math.min(99,Math.max(0,Number(action.progress)||0)));
   return{...s,chisti:{...s.chisti,status:'processing',activeJob:{...job,stage:action.stage||job.stage,progress,updatedAt:new Date().toISOString()},error:null}};
  }
  case'IRANCELL_CHISTI_RESOLVE_PROBLEM':{
   const job=s.chisti.activeJob;
   const problem=s.chisti.problemsById[action.problemId];
   if(!job||job.problemId!==action.problemId||job.status!=='processing'||!problem)return s;
   const physics=problem.subject==='فیزیک';
   const english=problem.subject==='زبان انگلیسی';
   const chemistry=problem.subject==='شیمی';
   const newton=/نیوتن|نیرو|شتاب/.test(problem.text.toLowerCase());
   const quadratic=/معادله درجه دوم|درجه دوم|سهمی/.test(problem.text.toLowerCase());
   const answer=newton?'سه قانون نیوتن پایهٔ تحلیل حرکت هستند: قانون اول می‌گوید جسم بدون نیروی خالص حالت حرکتش را حفظ می‌کند؛ قانون دوم رابطهٔ نیرو، جرم و شتاب را بیان می‌کند؛ و قانون سوم می‌گوید هر نیرو یک نیروی واکنش هم‌اندازه و خلاف جهت دارد. برای حل مسئله ابتدا نیروهای وارد بر جسم را مشخص کن و سپس نیروی خالص را به‌دست بیاور.':quadratic?'برای حل معادله درجه دوم ابتدا آن را به فرم استاندارد ax²+bx+c=0 بنویس. سپس می‌توانی از تجزیه، کامل کردن مربع یا فرمول دلتا استفاده کنی. اگر Δ=b²−4ac باشد، علامت دلتا تعداد جواب‌های حقیقی را مشخص می‌کند.':english?'ابتدا ساختار جمله و زمان فعل را مشخص کن، سپس فاعل، فعل کمکی و شکل اصلی فعل را جدا کن. بعد از فهم ساختار، با چند مثال کوتاه همان الگو را تمرین کن.':chemistry?'ابتدا داده‌های مسئله و واحدها را مشخص کن، واکنش یا رابطه اصلی را بنویس و سپس تبدیل واحد و جایگذاری را مرحله‌به‌مرحله انجام بده.':'برای حل این مسئله ابتدا داده‌ها و مجهول را جدا کن، رابطه یا قاعده اصلی را بنویس و سپس حل را مرحله‌به‌مرحله پیش ببر. در پایان پاسخ را با شرایط سؤال بررسی کن.';
   const contentId=physics?'content-physics-1':english?'content-english-1':'content-math-1';
   const recommendation={id:IrancellCreateId('recommendation'),problemId:problem.id,type:problem.text.length>160?'hybrid':'content',confidence:newton||quadratic?.94:.88,answer,contentIds:[contentId],nextActions:['مشاهده ویدئوی مرتبط','تمرین مشابه','درخواست مدرس'],resolvedAt:new Date().toISOString()};
   const completedProblem={...problem,status:'answered',answeredAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,chisti:{...s.chisti,status:'ready',activeJob:null,lastCompletedProblemId:problem.id,error:null,problemsById:{...s.chisti.problemsById,[problem.id]:completedProblem},recommendationsByProblemId:{...s.chisti.recommendationsByProblemId,[problem.id]:recommendation}}},'RouteRecommended',{entityType:'problem',entityId:problem.id,sourceModule:'chisti',properties:{recommendationType:recommendation.type,confidence:recommendation.confidence,contentId}});
  }
  case'IRANCELL_CHISTI_FAIL_PROCESSING':{
   const job=s.chisti.activeJob;
   const problem=s.chisti.problemsById[action.problemId];
   if(!problem||job?.problemId!==action.problemId)return s;
   const failedProblem={...problem,status:'failed',failedAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,chisti:{...s.chisti,status:'error',activeJob:null,error:{problemId:problem.id,code:action.errorCode||'service_error',message:action.message||'در آماده‌سازی پاسخ مشکلی پیش آمد.'},problemsById:{...s.chisti.problemsById,[problem.id]:failedProblem}}},'ChistiProcessingFailed',{entityType:'problem',entityId:problem.id,sourceModule:'chisti',outcome:'failure',errorCode:action.errorCode||'service_error'});
  }
  case'IRANCELL_CHISTI_CANCEL_PROCESSING':{
   const job=s.chisti.activeJob;
   const problem=s.chisti.problemsById[action.problemId];
   if(!job||job.problemId!==action.problemId||!problem)return s;
   const cancelledProblem={...problem,status:'cancelled',cancelledAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,chisti:{...s.chisti,status:'ready',activeJob:null,error:null,problemsById:{...s.chisti.problemsById,[problem.id]:cancelledProblem}}},'ChistiProcessingCancelled',{entityType:'problem',entityId:problem.id,sourceModule:'chisti'});
  }
  case'IRANCELL_CHISTI_RETRY_PROBLEM':{
   const problem=s.chisti.problemsById[action.problemId];
   if(!problem||problem.ownerId!==s.session.currentUserId||!['failed','cancelled'].includes(problem.status))return s;
   if(s.chisti.activeJob&&s.chisti.activeJob.status==='processing')return s;
   const retriedAt=new Date().toISOString();
   const activeJob={id:IrancellCreateId('chisti-job'),problemId:problem.id,conversationId:s.chisti.activeConversationId,status:'processing',stage:'queued',progress:8,detectedSubject:problem.subject,detectedTopic:problem.topic,startedAt:retriedAt,updatedAt:retriedAt};
   return IrancellReducerAnalytics({...s,chisti:{...s.chisti,status:'processing',activeJob,lastCompletedProblemId:null,error:null,problemsById:{...s.chisti.problemsById,[problem.id]:{...problem,status:'processing',retriedAt}}}},'ChistiProcessingRetried',{entityType:'problem',entityId:problem.id,sourceModule:'chisti'});
  }
  case'IRANCELL_CHISTI_DISMISS_RESULT':{
   if(!s.chisti.lastCompletedProblemId||s.chisti.lastCompletedProblemId!==action.problemId)return s;
   return{...s,chisti:{...s.chisti,lastCompletedProblemId:null}};
  }
  case'IRANCELL_CONTENT_SELECT':{
   const content=s.content.catalogueById[action.contentId];
   if(!content||content.status!=='published')return IrancellReducerReject(s,'ContentSelectionFailed','content_missing','دوره انتخاب‌شده در دسترس نیست.');
   return{...s,content:{...s.content,selectedContentId:content.id,selectedView:action.view==='video'?'video':'course'}};
  }
  case'IRANCELL_CONTENT_ENROLL':{
   if(s.session.status!=='authenticated'||s.session.activeRole!=='student')return IrancellReducerReject(s,'ContentEnrollmentFailed','student_required','افزودن دوره فقط برای حساب دانش‌آموز فعال است.');
   const content=s.content.catalogueById[action.contentId];
   if(!content||content.status!=='published')return IrancellReducerReject(s,'ContentEnrollmentFailed','content_missing','دوره انتخاب‌شده در دسترس نیست.');
   const userId=s.session.currentUserId;
   const userEnrollments=s.content.enrollmentsByUserId?.[userId]||{};
   const existing=userEnrollments[content.id]||null;
   const enrolledAt=existing?.enrolledAt||new Date().toISOString();
   const enrollment={
    ...(existing||{}),
    id:existing?.id||`${userId}:${content.id}`,
    userId,
    contentId:content.id,
    status:existing?.status==='completed'?'completed':'active',
    deliveryType:content.deliveryType||action.deliveryType||'video',
    priceAtEnrollment:Number(content.price)||0,
    enrolledAt,
    updatedAt:new Date().toISOString()
   };
   const userProgress=s.content.progressByStudentId?.[userId]||{};
   const initialProgress=Math.max(0,Number(userProgress[content.id])||0);
   return IrancellReducerAnalytics({...s,content:{...s.content,selectedContentId:content.id,selectedView:action.view==='video'?'video':'course',enrollmentsByUserId:{...(s.content.enrollmentsByUserId||{}),[userId]:{...userEnrollments,[content.id]:enrollment}},progressByStudentId:{...(s.content.progressByStudentId||{}),[userId]:{...userProgress,[content.id]:initialProgress}},watchProgress:{...s.content.watchProgress,[content.id]:initialProgress}}},existing?'ContentEnrollmentResumed':'ContentEnrolled',{entityType:'content',entityId:content.id,sourceModule:'binaei',properties:{deliveryType:enrollment.deliveryType}});
  }
  case'IRANCELL_CONTENT_PROGRESS':{
   const content=s.content.catalogueById[action.contentId];
   if(!content)return IrancellReducerReject(s,'ContentProgressFailed','content_missing','محتوای انتخاب‌شده پیدا نشد.');
   const progress=Math.min(100,Math.max(0,Number(action.progress)||0));
   const userId=s.session.activeRole==='student'?s.session.currentUserId:null;
   const enrollmentsByUserId={...(s.content.enrollmentsByUserId||{})};
   const currentUserProgress=userId?s.content.progressByStudentId?.[userId]||{}:{};
   const nextUserProgress=userId?{...currentUserProgress,[content.id]:progress}:currentUserProgress;
   if(userId){
    const userEnrollments=enrollmentsByUserId[userId]||{};
    const existing=userEnrollments[content.id]||null;
    const now=new Date().toISOString();
    enrollmentsByUserId[userId]={...userEnrollments,[content.id]:{
     ...(existing||{}),
     id:existing?.id||`${userId}:${content.id}`,
     userId,
     contentId:content.id,
     status:progress>=100?'completed':'active',
     deliveryType:content.deliveryType||existing?.deliveryType||'video',
     priceAtEnrollment:Number(content.price)||existing?.priceAtEnrollment||0,
     enrolledAt:existing?.enrolledAt||now,
     updatedAt:now,
     ...(progress>=100?{completedAt:existing?.completedAt||now}:{})
    }};
   }
   const progressValues=Object.values(nextUserProgress).map(value=>Math.max(0,Math.min(100,Number(value)||0)));
   const averageProgress=progressValues.length?Math.round(progressValues.reduce((sum,value)=>sum+value,0)/progressValues.length):0;
   const nextFamily=userId?{...s.family,childProgressById:{...(s.family?.childProgressById||{}),[userId]:averageProgress}}:s.family;
   return IrancellReducerAnalytics({...s,family:nextFamily,content:{...s.content,selectedContentId:content.id,enrollmentsByUserId,progressByStudentId:userId?{...(s.content.progressByStudentId||{}),[userId]:nextUserProgress}:s.content.progressByStudentId||{},watchProgress:{...s.content.watchProgress,[content.id]:progress}}},progress>=100?'ContentCompleted':'ContentStarted',{entityType:'content',entityId:content.id,sourceModule:'binaei'});
  }
  case'IRANCELL_CONTENT_ASSIGNMENT_SUBMIT':{
   if(s.session.status!=='authenticated'||s.session.activeRole!=='student')return IrancellReducerReject(s,'AssignmentSubmissionFailed','student_required','ارسال تکلیف فقط برای حساب دانش‌آموز فعال است.');
   const userId=s.session.currentUserId;
   const content=s.content.catalogueById[action.contentId];
   const enrollment=s.content.enrollmentsByUserId?.[userId]?.[action.contentId];
   if(!content||content.status!=='published')return IrancellReducerReject(s,'AssignmentSubmissionFailed','content_missing','دوره مرتبط با این تکلیف در دسترس نیست.');
   if(!enrollment)return IrancellReducerReject(s,'AssignmentSubmissionFailed','enrollment_required','ابتدا در دوره ثبت‌نام کنید.');
   const assignmentIndex=Math.max(1,Math.min(3,Number(action.assignmentIndex)||1));
   const selectedAnswer=Number(action.selectedAnswer);
   const correctAnswer=Math.max(0,Math.min(3,Number(action.correctAnswer)||0));
   if(!Number.isInteger(selectedAnswer)||selectedAnswer<0||selectedAnswer>3)return IrancellReducerReject(s,'AssignmentSubmissionFailed','answer_required','یکی از پاسخ‌ها را انتخاب کنید.');
   const assignmentId=`${content.id}:${assignmentIndex}`;
   const submissionsByStudentId=s.content.assignmentSubmissionsByStudentId||{};
   const studentSubmissions=submissionsByStudentId[userId]||{};
   const previousSubmission=studentSubmissions[assignmentId]||null;
   const correct=selectedAnswer===correctAnswer;
   const submittedAt=new Date().toISOString();
   const submission={
    id:`${userId}:${assignmentId}`,
    assignmentId,
    assignmentIndex,
    studentId:userId,
    contentId:content.id,
    title:String(action.title||`تمرین ${assignmentIndex}`),
    question:String(action.question||''),
    selectedAnswer,
    answerLabel:String(action.answerLabel||''),
    correctAnswer,
    score:correct?100:0,
    maxScore:100,
    status:'graded',
    feedback:correct?'پاسخ درست است. این بخش را با موفقیت یاد گرفته‌ای.':'پاسخ نیاز به مرور دارد. توضیح دوره را دوباره ببین و سپس تلاش کن.',
    attempts:(Number(previousSubmission?.attempts)||0)+1,
    submittedAt,
    gradedAt:submittedAt
   };
   const nextStudentSubmissions={...studentSubmissions,[assignmentId]:submission};
   const completedAssignmentCount=Object.values(nextStudentSubmissions).filter(item=>item.contentId===content.id&&item.status==='graded').length;
   const previousCompletedCount=Object.values(studentSubmissions).filter(item=>item.contentId===content.id&&item.status==='graded').length;
   const currentProgressMap=s.content.progressByStudentId?.[userId]||{};
   const currentProgress=Math.max(0,Number(currentProgressMap[content.id])||0);
   const assignmentProgress=Math.min(100,Math.round(25+(Math.min(3,completedAssignmentCount)/3)*75));
   const nextProgress=completedAssignmentCount>=3?100:Math.max(currentProgress,assignmentProgress);
   const nextProgressMap={...currentProgressMap,[content.id]:nextProgress};
   const userEnrollments=s.content.enrollmentsByUserId?.[userId]||{};
   const nextEnrollment={...enrollment,status:nextProgress>=100?'completed':'active',updatedAt:submittedAt,...(nextProgress>=100?{completedAt:enrollment.completedAt||submittedAt}:{})};
   const progressValues=Object.values(nextProgressMap).map(value=>Math.max(0,Math.min(100,Number(value)||0)));
   const averageProgress=progressValues.length?Math.round(progressValues.reduce((sum,value)=>sum+value,0)/progressValues.length):0;
   const relationship=Object.values(s.identity.relationshipsById||{}).find(item=>item.childId===userId&&item.status==='active');
   const completedNow=completedAssignmentCount>=3&&previousCompletedCount<3;
   const familyNotificationId=`family-assignment-${userId}-${content.id}`;
   const familyNotifications=completedNow&&relationship?{...(s.family?.notificationItemsById||{}),[familyNotificationId]:{id:familyNotificationId,parentId:relationship.parentId,childId:userId,category:'children',importance:'normal',title:'تکالیف دوره تکمیل شد',body:`${s.identity.usersById[userId]?.name||'دانش‌آموز'} همه تمرین‌های دوره ${content.title} را انجام داد.`,actionLabel:'مشاهده گزارش',route:`parent/reports?child=${userId}`,read:false,createdAt:submittedAt}}:s.family?.notificationItemsById||{};
   const next={...s,content:{...s.content,assignmentSubmissionsByStudentId:{...submissionsByStudentId,[userId]:nextStudentSubmissions},progressByStudentId:{...(s.content.progressByStudentId||{}),[userId]:nextProgressMap},watchProgress:{...s.content.watchProgress,[content.id]:nextProgress},enrollmentsByUserId:{...(s.content.enrollmentsByUserId||{}),[userId]:{...userEnrollments,[content.id]:nextEnrollment}}},family:{...s.family,childProgressById:{...(s.family?.childProgressById||{}),[userId]:averageProgress},notificationItemsById:familyNotifications}};
   return IrancellReducerAnalytics(next,'AssignmentSubmitted',{entityType:'assignment',entityId:assignmentId,sourceModule:'binaei',properties:{contentId:content.id,score:submission.score,attempts:submission.attempts}});
  }
  case'IRANCELL_MARKETPLACE_CREATE_REQUEST':{
   if(!['student','parent'].includes(s.session.activeRole))return IrancellReducerReject(s,'TeacherRequestFailed','role_forbidden','ثبت درخواست مدرس فقط برای دانش‌آموز یا والد مجاز است.');
   const studentId=action.studentId||(s.session.activeRole==='student'?s.session.currentUserId:null);
   if(!studentId||!s.identity.usersById[studentId])return IrancellReducerReject(s,'TeacherRequestFailed','student_missing','دانش‌آموز درخواست مشخص نیست.');
   if(s.session.activeRole==='parent'&&!IrancellReducerCanParentManageChild(s,s.session.currentUserId,studentId))return IrancellReducerReject(s,'TeacherRequestFailed','relationship_required','رابطه معتبر والد و فرزند برای ثبت درخواست لازم است.');
   const id=action.data?.id||IrancellCreateId('request');
   const createdAt=new Date().toISOString();
   const rawBudget=Number(action.data?.budget);
   const budget=Number.isFinite(rawBudget)&&rawBudget>0?Math.round(rawBudget):null;
   const item={...action.data,id,ownerId:s.session.currentUserId,studentId,budget,status:'pending',createdAt,publishedAt:createdAt,pendingSince:createdAt,offerCount:0,selectedOfferId:null,orderId:null,sessionId:null};
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,requestsById:{...s.marketplace.requestsById,[id]:item}}},'TeacherRequestCreated',{entityType:'teacher_request',entityId:id,sourceModule:'marketplace',properties:{status:'pending',budget,deliveryMode:item.deliveryMode||'online'}});
  }
  case'IRANCELL_MARKETPLACE_CANCEL_REQUEST':{
   if(!['student','parent'].includes(s.session.activeRole))return IrancellReducerReject(s,'TeacherRequestCancelFailed','buyer_role_required','لغو درخواست فقط برای دانش‌آموز یا والد مرتبط مجاز است.');
   const request=s.marketplace.requestsById[action.requestId];
   if(!request)return IrancellReducerReject(s,'TeacherRequestCancelFailed','request_missing','درخواست موردنظر پیدا نشد.');
   if(s.session.activeRole==='student'&&request.studentId!==s.session.currentUserId)return IrancellReducerReject(s,'TeacherRequestCancelFailed','request_owner_required','فقط مالک درخواست می‌تواند آن را لغو کند.');
   if(s.session.activeRole==='parent'&&!IrancellReducerCanParentManageChild(s,s.session.currentUserId,request.studentId))return IrancellReducerReject(s,'TeacherRequestCancelFailed','relationship_required','رابطه معتبر والد و فرزند برای لغو درخواست لازم است.');
   if(!['pending','published','offers_received'].includes(request.status))return IrancellReducerReject(s,'TeacherRequestCancelFailed','request_not_cancellable','این درخواست در وضعیت فعلی قابل لغو نیست.');
   const cancelledAt=new Date().toISOString();
   const nextOffersById=Object.entries(s.marketplace.offersById||{}).reduce(function IrancellReducerCancelRequestOffers(result,[offerId,offer]){result[offerId]=offer.requestId===request.id&&offer.status==='active'?{...offer,status:'rejected',rejectedReason:'request_cancelled',updatedAt:cancelledAt}:offer;return result;},{});
   const nextRequest={...request,status:'cancelled',cancelledAt,offerCount:0};
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,offersById:nextOffersById,requestsById:{...s.marketplace.requestsById,[request.id]:nextRequest}}},'TeacherRequestCancelled',{entityType:'teacher_request',entityId:request.id,sourceModule:'marketplace'});
  }
  case'IRANCELL_MARKETPLACE_SUBMIT_OFFER':{
   if(s.session.activeRole!=='academy')return IrancellReducerReject(s,'OfferSubmissionFailed','provider_role_required','ثبت پیشنهاد فقط برای آموزشگاه فعال مجاز است.');
   const request=s.marketplace.requestsById[action.requestId];
   if(!request||!['pending','published','offers_received'].includes(request.status))return IrancellReducerReject(s,'OfferSubmissionFailed','request_unavailable','این درخواست برای دریافت پیشنهاد فعال نیست.');
   if(!IrancellReducerProviderIsActive(s,s.session.currentUserId))return IrancellReducerReject(s,'OfferSubmissionFailed','provider_not_verified','ابتدا پروفایل ارائه‌دهنده را تکمیل و فعال کنید.');
   const price=Number(action.price);
   if(!Number.isFinite(price)||price<=0||!action.proposedTime)return IrancellReducerReject(s,'OfferSubmissionFailed','offer_invalid','قیمت و زمان معتبر برای پیشنهاد لازم است.');
   const provider=s.marketplace.providersById[s.session.currentUserId]||{};
   let assignedTeacherId=action.assignedTeacherId||null;
   let assignedTeacherName=String(action.assignedTeacherName||'').trim();
   if(s.session.activeRole==='academy'){
    const assignedTeacher=assignedTeacherId?s.marketplace.providersById[assignedTeacherId]:null;
    if(!assignedTeacher||assignedTeacher.type!=='teacher'||assignedTeacher.academyId!==s.session.currentUserId||assignedTeacher.status==='archived'||assignedTeacher.status==='paused')return IrancellReducerReject(s,'OfferSubmissionFailed','academy_teacher_required','برای پیشنهاد آموزشگاه باید یک مدرس فعال از فهرست مدرس‌های همان آموزشگاه انتخاب شود.');
    if(request.subject&&Array.isArray(assignedTeacher.subjects)&&assignedTeacher.subjects.length&&!assignedTeacher.subjects.includes(request.subject))return IrancellReducerReject(s,'OfferSubmissionFailed','teacher_subject_mismatch','مدرس انتخاب‌شده برای درس این درخواست در فهرست تخصص‌های خود تأیید نشده است.');
    assignedTeacherName=assignedTeacher.name;
   }else{
    assignedTeacherId=s.session.currentUserId;
    assignedTeacherName=assignedTeacherName||provider.name||s.identity.usersById[s.session.currentUserId]?.name||'مدرس';
   }
   const existingOffer=Object.values(s.marketplace.offersById||{}).find(item=>item.requestId===action.requestId&&item.providerId===s.session.currentUserId&&item.status==='active');
   const id=existingOffer?.id||IrancellCreateId('offer');
   const createdAt=existingOffer?.createdAt||new Date().toISOString();
   const item={...existingOffer,id,requestId:action.requestId,providerId:s.session.currentUserId,providerRole:s.session.activeRole,providerDisplayName:provider.name||s.identity.usersById[s.session.currentUserId]?.name||'ارائه‌دهنده آموزشی',assignedTeacherId,assignedTeacherName,price:Math.round(price),proposedTime:action.proposedTime,description:String(action.description||'').trim()||`پیشنهاد ${provider.name||'ارائه‌دهنده'} برای ${request.subject} — ${request.topic}`,sessionCount:Math.max(1,Number(action.sessionCount)||1),sessionDuration:Math.max(30,Number(action.sessionDuration)||60),responseLabel:String(action.responseLabel||'پاسخ‌گویی در همان روز'),modes:Array.isArray(action.modes)&&action.modes.length?action.modes:[request.deliveryMode==='inperson'?'حضوری':'آنلاین'],terms:String(action.terms||'').trim(),rating:Number(provider.rating)||0,reviewCount:Number(provider.completedClasses)||0,badges:['تأیید شده',s.session.activeRole==='academy'?'آموزشگاه':'مدرس'].filter(Boolean),acceptanceLabel:'پیشنهاد مستقیم ارائه‌دهنده',acceptanceTone:'high',status:'active',createdAt,updatedAt:new Date().toISOString()};
   const activeOfferCount=Object.values({...s.marketplace.offersById,[id]:item}).filter(offer=>offer.requestId===action.requestId&&offer.status==='active').length;
   const nextRequest={...request,status:'offers_received',offerCount:activeOfferCount,lastOfferAt:item.updatedAt};
   const notificationId=`notification-offer-${id}`;
   const notification={id:notificationId,ownerId:request.studentId,title:existingOffer?'یک پیشنهاد برای درخواست شما به‌روزرسانی شد':'پیشنهاد جدید برای درخواست شما',body:`${item.providerDisplayName} برای ${request.subject||'درخواست آموزشی'} قیمت و زمان پیشنهادی ارسال کرده است.`,route:`student/offers?request=${request.id}`,read:false,createdAt:item.updatedAt};
   const nextNotifications={...s.notifications,itemsById:{...s.notifications.itemsById,[notificationId]:notification}};
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,offersById:{...s.marketplace.offersById,[id]:item},requestsById:{...s.marketplace.requestsById,[action.requestId]:nextRequest}},notifications:nextNotifications},existingOffer?'OfferUpdated':'OfferSubmitted',{entityType:'offer',entityId:id,sourceModule:'marketplace',properties:{requestId:action.requestId,assignedTeacherId,providerRole:s.session.activeRole}});
  }
  case'IRANCELL_MARKETPLACE_WITHDRAW_OFFER':{
   if(!['teacher','academy'].includes(s.session.activeRole))return IrancellReducerReject(s,'OfferWithdrawalFailed','provider_role_required','لغو پیشنهاد فقط توسط ارائه‌دهنده ثبت‌کننده مجاز است.');
   const offer=s.marketplace.offersById[action.offerId];
   if(!offer||offer.providerId!==s.session.currentUserId)return IrancellReducerReject(s,'OfferWithdrawalFailed','offer_owner_required','این پیشنهاد متعلق به حساب فعال نیست.');
   if(offer.status!=='active')return s;
   const nextOffer={...offer,status:'withdrawn',withdrawnAt:new Date().toISOString()};
   const activeOfferCount=Object.values({...s.marketplace.offersById,[action.offerId]:nextOffer}).filter(item=>item.requestId===offer.requestId&&item.status==='active').length;
   const request=s.marketplace.requestsById[offer.requestId];
   const nextRequest=request?{...request,status:activeOfferCount?'offers_received':'pending',offerCount:activeOfferCount}:request;
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,offersById:{...s.marketplace.offersById,[action.offerId]:nextOffer},requestsById:request?{...s.marketplace.requestsById,[offer.requestId]:nextRequest}:s.marketplace.requestsById}},'OfferWithdrawn',{entityType:'offer',entityId:action.offerId,sourceModule:'marketplace'});
  }
  case'IRANCELL_ACADEMY_PROFILE_UPDATE':{
   if(s.session.activeRole!=='academy')return IrancellReducerReject(s,'AcademyProfileUpdateFailed','academy_role_required','ثبت اطلاعات آموزشگاه فقط در نقش آموزشگاه مجاز است.');
   const academyId=s.session.currentUserId;
   const data=action.data&&typeof action.data==='object'?action.data:{};
   const organizationName=String(data.organizationName||data.name||'').trim();
   const licenseNumber=String(data.licenseNumber||'').trim();
   const city=String(data.city||'').trim();
   const subjects=Array.isArray(data.subjects)?data.subjects.map(item=>String(item||'').trim()).filter(Boolean):[];
   if(!organizationName||!licenseNumber||!city||!subjects.length)return IrancellReducerReject(s,'AcademyProfileUpdateFailed','academy_profile_incomplete','نام آموزشگاه، شماره مجوز، شهر و حداقل یک حوزه تدریس الزامی است.');
   const existing=s.marketplace.providersById[academyId]||{};
   const updatedAt=new Date().toISOString();
   const provider={...existing,id:academyId,type:'academy',name:organizationName,organizationName,legalName:String(data.legalName||organizationName).trim(),licenseNumber,nationalId:String(data.nationalId||'').trim(),managerName:String(data.managerName||'').trim(),mobile:String(data.mobile||s.identity.usersById[academyId]?.mobile||'').trim(),city,address:String(data.address||'').trim(),website:String(data.website||'').trim(),subjects,bio:String(data.bio||'').trim(),priceFrom:Math.max(0,Number(data.priceFrom)||Number(existing.priceFrom)||0),verificationStatus:'verified',registrationStatus:'complete',status:'active',profileCompletion:100,updatedAt,registeredAt:existing.registeredAt||updatedAt};
   const currentUser=s.identity.usersById[academyId]||{id:academyId,roles:['academy'],status:'active'};
   const nextUser={...currentUser,name:organizationName,organizationName,mobile:provider.mobile||currentUser.mobile,academyProfileComplete:true,updatedAt};
   const next={...s,identity:{...s.identity,usersById:{...s.identity.usersById,[academyId]:nextUser},providerVerification:{...(s.identity.providerVerification||{}),[academyId]:{status:'verified',verifiedAt:updatedAt,source:'local-profile'}}},marketplace:{...s.marketplace,providersById:{...s.marketplace.providersById,[academyId]:provider}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'AcademyProfileUpdated',{entityType:'provider',entityId:academyId,sourceModule:'academy',privacyClass:'restricted'}),'AcademyProfileUpdated',{academyId});
  }
  case'IRANCELL_ACADEMY_TEACHER_ADD':{
   if(s.session.activeRole!=='academy')return IrancellReducerReject(s,'AcademyTeacherAddFailed','academy_role_required','افزودن مدرس فقط در نقش آموزشگاه مجاز است.');
   const academyId=s.session.currentUserId;
   if(!IrancellReducerProviderIsActive(s,academyId))return IrancellReducerReject(s,'AcademyTeacherAddFailed','academy_profile_required','ابتدا پروفایل آموزشگاه را تکمیل کنید.');
   const data=action.data&&typeof action.data==='object'?action.data:{};
   const name=String(data.name||'').trim();
   const subjects=Array.isArray(data.subjects)?data.subjects.map(item=>String(item||'').trim()).filter(Boolean):[];
   if(!name||!subjects.length)return IrancellReducerReject(s,'AcademyTeacherAddFailed','teacher_profile_incomplete','نام مدرس و حداقل یک درس الزامی است.');
   const academy=s.marketplace.providersById[academyId]||{};
   const academySubjects=Array.isArray(academy.subjects)?academy.subjects:[];
   if(academySubjects.length&&subjects.some(subject=>!academySubjects.includes(subject)))return IrancellReducerReject(s,'AcademyTeacherAddFailed','teacher_subject_outside_academy','تخصص‌های مدرس باید از حوزه‌های آموزشی ثبت‌شده برای آموزشگاه انتخاب شوند.');
   const id=data.id||IrancellCreateId('academy-teacher');
   const createdAt=new Date().toISOString();
   const teacher={id,type:'teacher',academyId,employmentType:'academy',name,mobile:String(data.mobile||'').trim(),subjects,bio:String(data.bio||'').trim(),experienceYears:Math.max(0,Number(data.experienceYears)||0),priceFrom:Math.max(0,Number(data.priceFrom)||0),rating:Number(data.rating)||5,completedClasses:Number(data.completedClasses)||0,verificationStatus:'verified',status:'active',createdAt,updatedAt:createdAt};
   const next={...s,marketplace:{...s.marketplace,providersById:{...s.marketplace.providersById,[id]:teacher}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'AcademyTeacherAdded',{entityType:'provider',entityId:id,sourceModule:'academy',properties:{academyId}}),'AcademyTeacherAdded',{academyId,teacherId:id});
  }
  case'IRANCELL_ACADEMY_TEACHER_UPDATE':{
   if(s.session.activeRole!=='academy')return IrancellReducerReject(s,'AcademyTeacherUpdateFailed','academy_role_required','ویرایش مدرس فقط در نقش آموزشگاه مجاز است.');
   const teacher=s.marketplace.providersById[action.teacherId];
   if(!teacher||teacher.type!=='teacher'||teacher.academyId!==s.session.currentUserId)return IrancellReducerReject(s,'AcademyTeacherUpdateFailed','academy_teacher_missing','مدرس موردنظر در فهرست این آموزشگاه نیست.');
   const data=action.data&&typeof action.data==='object'?action.data:{};
   const nextStatus=['active','paused','archived'].includes(data.status)?data.status:teacher.status||'active';
   const subjects=Array.isArray(data.subjects)?data.subjects.map(item=>String(item||'').trim()).filter(Boolean):teacher.subjects;
   const academy=s.marketplace.providersById[teacher.academyId]||{};
   const academySubjects=Array.isArray(academy.subjects)?academy.subjects:[];
   if(academySubjects.length&&subjects.some(subject=>!academySubjects.includes(subject)))return IrancellReducerReject(s,'AcademyTeacherUpdateFailed','teacher_subject_outside_academy','تخصص‌های مدرس باید از حوزه‌های آموزشی ثبت‌شده برای آموزشگاه انتخاب شوند.');
   const nextTeacher={...teacher,...data,name:String(data.name||teacher.name||'').trim()||teacher.name,mobile:String(data.mobile??teacher.mobile??'').trim(),subjects,bio:String(data.bio??teacher.bio??'').trim(),experienceYears:Math.max(0,Number(data.experienceYears??teacher.experienceYears)||0),priceFrom:Math.max(0,Number(data.priceFrom??teacher.priceFrom)||0),status:nextStatus,academyId:teacher.academyId,type:'teacher',employmentType:'academy',verificationStatus:teacher.verificationStatus||'verified',updatedAt:new Date().toISOString()};
   const next={...s,marketplace:{...s.marketplace,providersById:{...s.marketplace.providersById,[action.teacherId]:nextTeacher}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'AcademyTeacherUpdated',{entityType:'provider',entityId:action.teacherId,sourceModule:'academy',properties:{academyId:teacher.academyId,status:nextStatus}}),'AcademyTeacherUpdated',{academyId:teacher.academyId,teacherId:action.teacherId,status:nextStatus});
  }
  case'IRANCELL_MARKETPLACE_SELECT_OFFER':{
   if(!['student','parent'].includes(s.session.activeRole))return IrancellReducerReject(s,'OfferSelectionFailed','buyer_role_required','انتخاب پیشنهاد فقط برای دانش‌آموز یا والد مجاز است.');
   const offer=s.marketplace.offersById[action.offerId];if(!offer||offer.status!=='active')return IrancellReducerReject(s,'OfferSelectionFailed','offer_unavailable','پیشنهاد انتخاب‌شده فعال نیست.');
   const request=s.marketplace.requestsById[offer.requestId];if(!request)return IrancellReducerReject(s,'OfferSelectionFailed','request_missing','درخواست مرتبط با پیشنهاد پیدا نشد.');
   if(!IrancellReducerProviderIsActive(s,offer.providerId))return IrancellReducerReject(s,'OfferSelectionFailed','provider_not_verified','ارائه‌دهنده این پیشنهاد دیگر مجاز به ارائه خدمت نیست.');
   if(s.session.activeRole==='student'&&request.studentId!==s.session.currentUserId)return IrancellReducerReject(s,'OfferSelectionFailed','request_owner_required','فقط مالک درخواست می‌تواند پیشنهاد را انتخاب کند.');
   if(s.session.activeRole==='parent'&&!IrancellReducerCanParentManageChild(s,s.session.currentUserId,request.studentId))return IrancellReducerReject(s,'OfferSelectionFailed','relationship_required','رابطه معتبر والد و فرزند برای انتخاب پیشنهاد لازم است.');
   const assignedTeacher=offer.providerRole==='academy'?(offer.assignedTeacherId?s.marketplace.providersById[offer.assignedTeacherId]:Object.values(s.marketplace.providersById||{}).find(item=>item.type==='teacher'&&item.academyId===offer.providerId&&item.status==='active'&&(!offer.assignedTeacherName||item.name===offer.assignedTeacherName))):s.marketplace.providersById[offer.providerId];
   const resolvedAssignedTeacherId=offer.providerRole==='academy'?assignedTeacher?.id||null:offer.providerId;
   if(offer.providerRole==='academy'&&(!assignedTeacher||assignedTeacher.academyId!==offer.providerId||assignedTeacher.status!=='active'))return IrancellReducerReject(s,'OfferSelectionFailed','assigned_teacher_unavailable','مدرس معرفی‌شده توسط آموزشگاه در حال حاضر فعال نیست. پیشنهاد دیگری انتخاب کنید.');
   const relationship=Object.values(s.identity.relationshipsById).find(function IrancellReducerRequestRelationship(item){return item.childId===request.studentId&&item.status==='active';});
   const student=s.identity.usersById[request.studentId]||{};
   const requiresParent=Boolean(relationship)||Number(student.age||18)<18;
   if(requiresParent&&!relationship)return IrancellReducerReject(s,'OfferSelectionFailed','parent_relationship_required','برای نهایی‌کردن کلاس دانش‌آموز زیر ۱۸ سال باید حساب خانواده متصل باشد.');
   const parentId=relationship?.parentId||null;
   const orderId=IrancellCreateId('order'),sessionId=IrancellCreateId('class'),consentId=requiresParent?IrancellCreateId('consent'):null;
   const createdAt=new Date().toISOString();
   const consent=requiresParent?{id:consentId,sessionId,childId:request.studentId,parentId,status:'pending',createdAt,expiresAt:new Date(Date.now()+7*86400000).toISOString(),documentText:`رضایت‌نامه حضور ${student.name||'دانش‌آموز'} در کلاس ${request.subject} با ${offer.assignedTeacherName||offer.providerDisplayName||'ارائه‌دهنده تأییدشده'}.`}:null;
   const payment={id:orderId,orderId,sessionId,amount:offer.price,status:'pending',createdAt,providerId:offer.providerId};
   const participantIds=[request.studentId,offer.providerId,resolvedAssignedTeacherId].filter((value,index,array)=>value&&array.indexOf(value)===index);
   const proposedDate=new Date(offer.proposedTime);
   const startAt=Number.isNaN(proposedDate.getTime())?new Date(Date.now()+60*60000).toISOString():proposedDate.toISOString();
   const session={id:sessionId,title:`کلاس ${request.subject} — ${request.topic}`,subjectLabel:`${request.subject} ${request.grade||''}`.trim(),studentId:request.studentId,providerId:offer.providerId,providerRole:offer.providerRole,providerDisplayName:offer.providerDisplayName||s.marketplace.providersById[offer.providerId]?.name||'',assignedTeacherId:resolvedAssignedTeacherId,assignedTeacherName:assignedTeacher?.name||offer.assignedTeacherName||'',participantIds,startAt,status:'scheduled',requiresConsent:requiresParent,isPaid:true,orderId,consentDocumentId:consentId,roomId:null,createdAt};
   const nextOffersById=Object.entries(s.marketplace.offersById).reduce((result,[offerId,item])=>{result[offerId]=item.requestId===offer.requestId?{...item,status:offerId===action.offerId?'selected':item.status==='active'?'rejected':item.status,...(offerId===action.offerId?{selectedAt:createdAt}:{})}:item;return result;},{});
   let nextFamily=s.family;
   if(parentId){
    const familyPaymentId=`family-payment-${orderId}`;
    const familyNotificationId=`family-notification-${orderId}`;
    const familyPayment={id:familyPaymentId,parentId,childId:request.studentId,title:`پرداخت ${session.title}`,amount:offer.price,status:'pending',orderId,consentId,sessionId,createdAt};
    const familyNotification={id:familyNotificationId,parentId,childId:request.studentId,category:'consent',importance:'action',title:'درخواست تأیید رزرو کلاس',body:`برای ${session.title} ${requiresParent?'رضایت‌نامه و ':''}پرداخت در انتظار تأیید شماست.`,actionLabel:'بررسی و تأیید',route:requiresParent?`consent/${consentId}`:`payment/${orderId}`,read:false,createdAt};
    nextFamily={...s.family,pendingPaymentsById:{...s.family.pendingPaymentsById,[familyPaymentId]:familyPayment},notificationItemsById:{...s.family.notificationItemsById,[familyNotificationId]:familyNotification}};
   }
   const nextConsent=consent?{...s.consent,documentsById:{...s.consent.documentsById,[consentId]:consent}}:s.consent;
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,selectedOfferId:action.offerId,offersById:nextOffersById,requestsById:{...s.marketplace.requestsById,[offer.requestId]:{...request,status:'selected',selectedOfferId:action.offerId,orderId,sessionId,selectedAt:createdAt}}},consent:nextConsent,payment:{...s.payment,paymentsById:{...s.payment.paymentsById,[orderId]:payment}},classroom:{...s.classroom,sessionsById:{...s.classroom.sessionsById,[sessionId]:session}},family:nextFamily},'OfferSelected',{entityType:'offer',entityId:action.offerId,sourceModule:'marketplace',properties:{orderId,consentId,sessionId,parentId,assignedTeacherId:resolvedAssignedTeacherId}});
  }
  case'IRANCELL_CONSENT_SIGN':{
   const document=s.consent.documentsById[action.consentId];if(!document)return IrancellReducerReject(s,'ConsentSigningFailed','consent_missing','سند رضایت پیدا نشد.');
   if(!['parent','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'ConsentSigningFailed','parent_required','امضای رضایت فقط توسط والد مرتبط مجاز است.');
   if(s.session.activeRole!=='admin'&&(document.parentId!==s.session.currentUserId||!IrancellReducerCanParentManageChild(s,s.session.currentUserId,document.childId)))return IrancellReducerReject(s,'ConsentSigningFailed','relationship_required','رابطه معتبر والد و فرزند برای امضا لازم است.');
   if(document.status!=='pending'||new Date(document.expiresAt)<=new Date())return IrancellReducerReject(s,'ConsentSigningFailed','consent_expired','سند رضایت فعال نیست یا منقضی شده است.');
   const signatureName=String(action.signatureName||'').trim();if(!signatureName)return IrancellReducerReject(s,'ConsentSigningFailed','signature_required','نام کامل امضاکننده را وارد کنید.');
   const gate={sessionId:document.sessionId,status:'signed',signedBy:s.session.currentUserId,signedAt:new Date().toISOString(),expiresAt:document.expiresAt};
   const next={...s,consent:{...s.consent,documentsById:{...s.consent.documentsById,[action.consentId]:{...document,status:'signed',signedBy:s.session.currentUserId,signatureName,signedAt:gate.signedAt}},gatesBySessionId:{...s.consent.gatesBySessionId,[document.sessionId]:gate}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'ConsentSigned',{entityType:'consent',entityId:action.consentId,sourceModule:'emzaei',privacyClass:'restricted'}),'ConsentSigned',{consentId:action.consentId,sessionId:document.sessionId});
  }
  case'IRANCELL_PAYMENT_HOLD':{
   const payment=s.payment.paymentsById[action.orderId];if(!payment)return IrancellReducerReject(s,'PaymentHoldFailed','payment_missing','تراکنش موردنظر پیدا نشد.');
   if(!['student','parent','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'PaymentHoldFailed','payer_role_required','پرداخت این کلاس برای نقش فعال مجاز نیست.');
   const session=s.classroom.sessionsById[payment.sessionId];if(!session)return IrancellReducerReject(s,'PaymentHoldFailed','session_missing','کلاس مرتبط با پرداخت پیدا نشد.');
   const studentCanPay=s.session.activeRole==='student'&&session.studentId===s.session.currentUserId&&!session.requiresConsent;
   const parentCanPay=s.session.activeRole==='parent'&&IrancellReducerCanParentManageChild(s,s.session.currentUserId,session.studentId);
   if(s.session.activeRole!=='admin'&&!studentCanPay&&!parentCanPay)return IrancellReducerReject(s,'PaymentHoldFailed','relationship_required','پرداخت باید توسط دانش‌آموز مجاز یا والد مرتبط انجام شود.');
   if(session.requiresConsent&&s.consent.gatesBySessionId[session.id]?.status!=='signed')return IrancellReducerReject(s,'PaymentHoldFailed','consent_required','ابتدا رضایت‌نامه والد را امضا کنید.');
   if(!['pending','failed'].includes(payment.status))return s;
   const heldAt=new Date().toISOString();
   const escrow={orderId:action.orderId,paymentId:payment.id,amount:payment.amount,status:'held',heldAt,releaseCondition:'successful_session_and_no_blocking_dispute'};
   const familyPendingEntry=Object.values(s.family.pendingPaymentsById||{}).find(function IrancellReducerFindFamilyPendingPayment(item){return item.orderId===action.orderId;});
   const familyInvoiceId=`family-invoice-${action.orderId}`;
   const familyNotificationId=`family-notification-paid-${action.orderId}`;
   const studentNotificationId=`notification-payment-${action.orderId}`;
   const familyPendingPayments=familyPendingEntry?{...s.family.pendingPaymentsById,[familyPendingEntry.id]:{...familyPendingEntry,status:'paid',paidAt:heldAt}}:s.family.pendingPaymentsById;
   const familyInvoices=familyPendingEntry?{...s.family.invoicesById,[familyInvoiceId]:{id:familyInvoiceId,parentId:familyPendingEntry.parentId,childId:familyPendingEntry.childId,title:familyPendingEntry.title,amount:payment.amount,status:'paid',orderId:action.orderId,createdAt:heldAt}}:s.family.invoicesById;
   const familyNotifications=familyPendingEntry?{...s.family.notificationItemsById,[familyNotificationId]:{id:familyNotificationId,parentId:familyPendingEntry.parentId,category:'payments',importance:'normal',title:'پرداخت امن ثبت شد',body:`پرداخت ${session.title} با موفقیت در امانت ثبت شد.`,actionLabel:'مشاهده پرداخت',route:'parent/payments',read:false,createdAt:heldAt}}:s.family.notificationItemsById;
   const studentNotification={id:studentNotificationId,ownerId:session.studentId,title:'رزرو کلاس نهایی شد',body:`پرداخت ${session.title} تأیید شد و رزرو در برنامه شما ثبت شد.`,route:`student/classes/booking-success/${session.id}`,read:false,createdAt:heldAt};
   const next={...s,payment:{...s.payment,paymentsById:{...s.payment.paymentsById,[action.orderId]:{...payment,status:'held',method:action.method||'gateway',heldAt}},escrowByOrderId:{...s.payment.escrowByOrderId,[action.orderId]:escrow},invoicesById:{...s.payment.invoicesById,[action.orderId]:{id:action.orderId,amount:payment.amount,issuedAt:heldAt,status:'paid_held'}}},family:{...s.family,pendingPaymentsById:familyPendingPayments,invoicesById:familyInvoices,notificationItemsById:familyNotifications},notifications:{...s.notifications,itemsById:{...s.notifications.itemsById,[studentNotificationId]:studentNotification},unreadCount:(Number(s.notifications.unreadCount)||0)+1}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'PaymentHeld',{entityType:'payment',entityId:action.orderId,sourceModule:'payment',privacyClass:'financial'}),'PaymentHeld',{orderId:action.orderId,amount:payment.amount});
  }
  case'IRANCELL_CLASS_CANCEL':{
   const session=s.classroom.sessionsById[action.sessionId];if(!session)return IrancellReducerReject(s,'ClassCancellationFailed','session_missing','کلاس موردنظر پیدا نشد.');
   if(!['scheduled','waiting','ready'].includes(session.status))return IrancellReducerReject(s,'ClassCancellationFailed','session_not_cancellable','این کلاس در وضعیت فعلی قابل لغو نیست.');
   const role=s.session.activeRole,userId=s.session.currentUserId;
   const canCancel=role==='admin'||(role==='student'&&session.studentId===userId)||(role==='parent'&&IrancellReducerCanParentManageChild(s,userId,session.studentId));
   if(!canCancel)return IrancellReducerReject(s,'ClassCancellationFailed','cancel_forbidden','لغو این کلاس برای حساب فعال مجاز نیست.');
   const cancelledAt=new Date().toISOString();
   const payment=session.orderId?s.payment.paymentsById[session.orderId]:null;
   const escrow=session.orderId?s.payment.escrowByOrderId[session.orderId]:null;
   const shouldRefund=payment?.status==='held';
   const refundId=shouldRefund?IrancellCreateId('refund'):'';
   const nextPayments=payment?{...s.payment.paymentsById,[payment.id]:{...payment,status:shouldRefund?'refunded':'cancelled',cancelledAt}}:s.payment.paymentsById;
   const nextEscrow=escrow?{...s.payment.escrowByOrderId,[session.orderId]:{...escrow,status:shouldRefund?'refunded':'cancelled',cancelledAt}}:s.payment.escrowByOrderId;
   const nextRefunds=shouldRefund?{...s.payment.refundsById,[refundId]:{id:refundId,orderId:session.orderId,paymentId:payment.id,amount:payment.amount,status:'completed',reason:action.reason||'user_cancelled',createdAt:cancelledAt}}:s.payment.refundsById;
   const familyPendingEntry=session.orderId?Object.values(s.family.pendingPaymentsById||{}).find(function IrancellReducerFindCancellationFamilyPayment(item){return item.orderId===session.orderId;}):null;
   const familyPendingPayments=familyPendingEntry?{...s.family.pendingPaymentsById,[familyPendingEntry.id]:{...familyPendingEntry,status:shouldRefund?'refunded':'cancelled',cancelledAt}}:s.family.pendingPaymentsById;
   const familyInvoices=Object.fromEntries(Object.entries(s.family.invoicesById||{}).map(function IrancellReducerMapCancelledFamilyInvoice(entry){const[id,item]=entry;return[id,item.orderId===session.orderId?{...item,status:shouldRefund?'refunded':'cancelled',cancelledAt}:item];}));
   const next={...s,classroom:{...s.classroom,sessionsById:{...s.classroom.sessionsById,[session.id]:{...session,status:'cancelled',cancelledAt,cancelReason:action.reason||'user_cancelled'}}},payment:{...s.payment,paymentsById:nextPayments,escrowByOrderId:nextEscrow,refundsById:nextRefunds},family:{...s.family,pendingPaymentsById:familyPendingPayments,invoicesById:familyInvoices}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'ClassCancelled',{entityType:'class_session',entityId:session.id,sourceModule:'dialogi',properties:{refundCreated:shouldRefund}}),'ClassCancelled',{sessionId:session.id,refundId:refundId||null});
  }
  case'IRANCELL_CLASS_START':{
   const gate=IrancellEvaluateClassGate(s,action.sessionId,s.session.activeRole);if(!gate.allowed)return IrancellReducerReject(s,'ClassEntryAttempted',gate.code,gate.message,{sessionId:action.sessionId});
   const session=s.classroom.sessionsById[action.sessionId];if(!session||!['scheduled','waiting','ready','active'].includes(session.status))return s;
   const roomId=session.roomId||IrancellCreateId('room');
   const next={...s,classroom:{...s.classroom,sessionsById:{...s.classroom.sessionsById,[action.sessionId]:{...session,status:'live',roomId,startedAt:new Date().toISOString()}},roomsById:{...s.classroom.roomsById,[roomId]:{id:roomId,sessionId:action.sessionId,status:'active',provisionedAt:new Date().toISOString()}},attendanceBySessionId:{...s.classroom.attendanceBySessionId,[action.sessionId]:{...(s.classroom.attendanceBySessionId[action.sessionId]||{}),[s.session.currentUserId]:{joinedAt:new Date().toISOString(),status:'present'}}}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'SessionStarted',{entityType:'class_session',entityId:action.sessionId,sourceModule:'dialogi'}),'ClassEntryGranted',{sessionId:action.sessionId,roomId});
  }
  case'IRANCELL_CLASS_END':{
   const session=s.classroom.sessionsById[action.sessionId];if(!session||session.status!=='live')return IrancellReducerReject(s,'SessionEndFailed','session_not_live','فقط جلسه زنده قابل پایان دادن است.');
   if(s.session.activeRole!=='admin'&&!session.participantIds.includes(s.session.currentUserId))return IrancellReducerReject(s,'SessionEndFailed','participant_required','فقط شرکت‌کننده مجاز می‌تواند جلسه را پایان دهد.');
   const escrow=s.payment.escrowByOrderId[session.orderId],payment=s.payment.paymentsById[session.orderId],blocking=IrancellReducerHasBlockingComplaint(s,session.id);
   const nextEscrow=escrow?{...escrow,status:blocking?'disputed':'released',...(blocking?{disputedAt:new Date().toISOString()}:{releasedAt:new Date().toISOString()})}:escrow;
   const nextPayment=payment?{...payment,status:blocking?'held':'released'}:payment;
   const next={...s,classroom:{...s.classroom,sessionsById:{...s.classroom.sessionsById,[action.sessionId]:{...session,status:'completed',endedAt:new Date().toISOString()}}},payment:{...s.payment,escrowByOrderId:{...s.payment.escrowByOrderId,[session.orderId]:nextEscrow},paymentsById:{...s.payment.paymentsById,[session.orderId]:nextPayment}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'SessionEnded',{entityType:'class_session',entityId:action.sessionId,sourceModule:'dialogi',properties:{settlement:blocking?'blocked':'released'}}),blocking?'PaymentSettlementBlocked':'PaymentReleasedAfterSession',{sessionId:action.sessionId,orderId:session.orderId});
  }
  case'IRANCELL_QUALITY_RATE':{
   const session=s.classroom.sessionsById[action.sessionId];if(!session||session.status!=='completed')return IrancellReducerReject(s,'SessionRatingFailed','session_not_completed','امتیازدهی پس از پایان موفق جلسه فعال می‌شود.');
   const isParticipant=session.participantIds.includes(s.session.currentUserId),isParent=s.session.activeRole==='parent'&&IrancellReducerCanParentManageChild(s,s.session.currentUserId,session.studentId);
   if(!isParticipant&&!isParent&&s.session.activeRole!=='admin')return IrancellReducerReject(s,'SessionRatingFailed','rating_forbidden','شما مجاز به ارزیابی این جلسه نیستید.');
   const score=Math.min(5,Math.max(1,Number(action.score)||0)),id=IrancellCreateId('rating'),rating={id,sessionId:action.sessionId,providerId:action.providerId||session.providerId,ownerId:s.session.currentUserId,score,comment:action.comment,dimensions:action.dimensions&&typeof action.dimensions==='object'?{...action.dimensions}:{},anonymous:Boolean(action.anonymous),createdAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,quality:{...s.quality,ratingsById:{...s.quality.ratingsById,[id]:rating}}},'SessionRated',{entityType:'rating',entityId:id,sourceModule:'quality'});
  }
  case'IRANCELL_QUALITY_COMPLAINT':{
   const session=s.classroom.sessionsById[action.sessionId];if(!session)return IrancellReducerReject(s,'ComplaintSubmissionFailed','session_missing','کلاس مرتبط با شکایت پیدا نشد.');
   const isParticipant=session.participantIds.includes(s.session.currentUserId),isParent=s.session.activeRole==='parent'&&IrancellReducerCanParentManageChild(s,s.session.currentUserId,session.studentId);
   if(!isParticipant&&!isParent&&s.session.activeRole!=='admin')return IrancellReducerReject(s,'ComplaintSubmissionFailed','complaint_forbidden','شما مجاز به ثبت شکایت برای این جلسه نیستید.');
   const description=String(action.description||'').trim();if(!description)return IrancellReducerReject(s,'ComplaintSubmissionFailed','description_required','شرح شکایت را وارد کنید.');
   const id=IrancellCreateId('complaint'),complaint={id,sessionId:action.sessionId,ownerId:s.session.currentUserId,category:action.category,description,status:'submitted',createdAt:new Date().toISOString()};
   const next={...s,quality:{...s.quality,complaintsById:{...s.quality.complaintsById,[id]:complaint}},admin:{...s.admin,queues:{...s.admin.queues,complaints:Number(s.admin.queues.complaints||0)+1}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'ComplaintSubmitted',{entityType:'complaint',entityId:id,sourceModule:'quality',privacyClass:'restricted'}),'ComplaintSubmitted',{complaintId:id,sessionId:action.sessionId});
  }
  case'IRANCELL_NOTIFICATION_READ':{
   const notification=s.notifications.itemsById[action.notificationId];if(!notification||notification.read)return s;
   return{...s,notifications:{...s.notifications,itemsById:{...s.notifications.itemsById,[action.notificationId]:{...notification,read:true}},unreadCount:Math.max(0,s.notifications.unreadCount-1)}};
  }
  case'IRANCELL_STUDENT_PROFILE_UPDATE':{
   if(!['student','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'StudentProfileUpdateFailed','student_role_required','ویرایش پروفایل دانش‌آموز فقط در حساب مجاز انجام می‌شود.');
   const userId=action.userId||s.session.currentUserId;
   const user=s.identity.usersById[userId];
   if(!user)return IrancellReducerReject(s,'StudentProfileUpdateFailed','student_missing','پروفایل دانش‌آموز پیدا نشد.');
   if(s.session.activeRole==='student'&&userId!==s.session.currentUserId)return IrancellReducerReject(s,'StudentProfileUpdateFailed','profile_forbidden','ویرایش این پروفایل برای حساب فعال مجاز نیست.');
   const profile=action.profile||{};
   const nextUser={
    ...user,
    name:String(profile.name||user.name||'').trim()||user.name,
    mobile:String(profile.mobile||user.mobile||'').replace(/\s/g,''),
    email:String(profile.email??user.email??'').trim(),
    grade:String(profile.grade||user.grade||'').trim()||user.grade,
    profileUpdatedAt:new Date().toISOString()
   };
   return IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[userId]:nextUser}}},'StudentProfileUpdated',{entityType:'user',entityId:userId,sourceModule:'student_profile',privacyClass:'restricted'});
  }
  case'IRANCELL_STUDENT_PROFILE_PHOTO_UPDATE':{
   if(!['student','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'StudentProfilePhotoUpdateFailed','student_role_required','ویرایش تصویر پروفایل فقط در حساب مجاز انجام می‌شود.');
   const userId=action.userId||s.session.currentUserId;
   const user=s.identity.usersById[userId];
   if(!user)return IrancellReducerReject(s,'StudentProfilePhotoUpdateFailed','student_missing','پروفایل دانش‌آموز پیدا نشد.');
   if(s.session.activeRole==='student'&&userId!==s.session.currentUserId)return IrancellReducerReject(s,'StudentProfilePhotoUpdateFailed','profile_forbidden','ویرایش این تصویر برای حساب فعال مجاز نیست.');
   const nextUser={...user,avatarDataUrl:typeof action.avatarDataUrl==='string'&&action.avatarDataUrl?action.avatarDataUrl:null,profilePhotoUpdatedAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[userId]:nextUser}}},'StudentProfilePhotoUpdated',{entityType:'user',entityId:userId,sourceModule:'student_profile',privacyClass:'restricted'});
  }
  case'IRANCELL_IDENTITY_ACTIVATION_COMPLETE':{
   const userId=s.session.currentUserId||s.session.candidateUserId;
   const user=s.identity.usersById[userId];
   const identity=user?{...s.identity,usersById:{...s.identity.usersById,[userId]:{...user,learningActivationStatus:'active',learningActivatedAt:new Date().toISOString()}}}:s.identity;
   return IrancellReducerAnalytics({...s,identity,session:{...s.session,requiresOnboarding:false}},'LearningActivationCompleted',{entityType:'user',entityId:userId||null,sourceModule:'kisti'});
  }
  case'IRANCELL_STUDENT_PRIVACY_UPDATE':{
   if(!['student','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'StudentPrivacyUpdateFailed','student_role_required','تغییر تنظیمات حریم خصوصی برای این نقش مجاز نیست.');
   const userId=action.userId||s.session.currentUserId;
   const user=s.identity.usersById[userId];
   if(!user)return IrancellReducerReject(s,'StudentPrivacyUpdateFailed','student_missing','پروفایل دانش‌آموز پیدا نشد.');
   if(s.session.activeRole==='student'&&userId!==s.session.currentUserId)return IrancellReducerReject(s,'StudentPrivacyUpdateFailed','privacy_forbidden','تغییر حریم خصوصی این حساب مجاز نیست.');
   const settings=action.settings&&typeof action.settings==='object'?action.settings:{};
   const nextUser={...user,privacySettings:{...(user.privacySettings||{}),...settings,advertisingUse:false},privacyUpdatedAt:new Date().toISOString()};
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[userId]:nextUser}}},'StudentPrivacyUpdated',{entityType:'user',entityId:userId,sourceModule:'student_privacy',privacyClass:'restricted'}),'StudentPrivacyUpdated',{userId});
  }
  case'IRANCELL_STUDENT_PARENT_GATE_VERIFY':{
   if(s.session.activeRole!=='student')return IrancellReducerReject(s,'ParentGateFailed','student_role_required','این تأیید برای پروفایل دانش‌آموز تعریف شده است.');
   const rawCode=String(action.code||'').replace(/\D/g,'');
   const configuredCode=String(IRANCELL_APP_CONFIG.otpCode||'');
   const validCode=rawCode===configuredCode||rawCode===configuredCode.padStart(6,'0');
   if(!validCode)return IrancellReducerReject({...s,ui:{...s.ui,parentGate:null}},'ParentGateFailed','invalid_parent_code','کد تأیید خانواده صحیح نیست.');
   const verifiedAt=new Date().toISOString();
   return IrancellReducerAudit({...s,ui:{...s.ui,parentGate:{actionKey:String(action.actionKey||'protected_action'),userId:action.userId||s.session.currentUserId,verifiedAt,expiresAt:new Date(Date.now()+5*60000).toISOString()},fieldErrors:{...s.ui.fieldErrors,parentGate:null}}},'ParentGateVerified',{actionKey:String(action.actionKey||'protected_action'),userId:action.userId||s.session.currentUserId});
  }
  case'IRANCELL_STUDENT_PRIVACY_EXPORT_REQUEST':{
   if(s.session.activeRole!=='student')return IrancellReducerReject(s,'PrivacyExportFailed','student_role_required','دریافت نسخه اطلاعات فقط برای پروفایل دانش‌آموز فعال در دسترس است.');
   const id=IrancellCreateId('privacy-export'),request={id,userId:action.userId||s.session.currentUserId,kind:'export',format:['zip','pdf'].includes(action.format)?action.format:'zip',categories:Array.isArray(action.categories)?action.categories:[],status:'submitted',createdAt:new Date().toISOString()};
   const privacy=s.privacy||{requestsById:{}};
   const next={...s,privacy:{...privacy,requestsById:{...(privacy.requestsById||{}),[id]:request}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'PrivacyExportRequested',{entityType:'privacy_request',entityId:id,sourceModule:'privacy',privacyClass:'restricted'}),'PrivacyExportRequested',{requestId:id,userId:request.userId});
  }
  case'IRANCELL_STUDENT_PRIVACY_DELETE_REQUEST':{
   if(s.session.activeRole!=='student')return IrancellReducerReject(s,'PrivacyDeleteFailed','student_role_required','حذف اطلاعات فقط برای پروفایل دانش‌آموز فعال قابل درخواست است.');
   const gate=s.ui?.parentGate;
   if(!gate?.verifiedAt||new Date(gate.expiresAt).getTime()<Date.now())return IrancellReducerReject(s,'PrivacyDeleteFailed','parent_gate_required','برای این عملیات تأیید خانواده لازم است.');
   const userId=action.userId||s.session.currentUserId,categories=Array.isArray(action.categories)?action.categories:[],id=IrancellCreateId('privacy-delete'),kind=action.kind==='account'?'account':'partial',request={id,userId,kind,categories,reason:String(action.reason||''),status:'submitted',createdAt:new Date().toISOString()};
   const privacy=s.privacy||{requestsById:{}};
   let nextChisti=s.chisti;
   if(kind==='partial'&&(categories.includes('chisti')||categories.includes('personalizedRecommendations'))){
    const ownedProblemIds=new Set(Object.values(s.chisti?.problemsById||{}).filter(problem=>problem.ownerId===userId).map(problem=>problem.id));
    const removeHistory=categories.includes('chisti');
    const conversationsById=removeHistory?Object.fromEntries(Object.entries(s.chisti?.conversationsById||{}).filter(([,conversation])=>conversation.ownerId!==userId)):(s.chisti?.conversationsById||{});
    const problemsById=removeHistory?Object.fromEntries(Object.entries(s.chisti?.problemsById||{}).filter(([problemId,problem])=>problem.ownerId!==userId&&!ownedProblemIds.has(problemId))):(s.chisti?.problemsById||{});
    const recommendationsByProblemId=Object.fromEntries(Object.entries(s.chisti?.recommendationsByProblemId||{}).filter(([problemId])=>!ownedProblemIds.has(problemId)));
    const activeConversationOwned=Boolean(s.chisti?.activeConversationId&&s.chisti?.conversationsById?.[s.chisti.activeConversationId]?.ownerId===userId);
    const activeJobOwned=Boolean(s.chisti?.activeJob?.problemId&&ownedProblemIds.has(s.chisti.activeJob.problemId));
    nextChisti={...s.chisti,conversationsById,problemsById,recommendationsByProblemId,activeConversationId:removeHistory&&activeConversationOwned?null:s.chisti?.activeConversationId||null,activeJob:removeHistory&&activeJobOwned?null:s.chisti?.activeJob||null,lastCompletedProblemId:removeHistory&&ownedProblemIds.has(s.chisti?.lastCompletedProblemId)?null:s.chisti?.lastCompletedProblemId||null};
   }
   const next={...s,chisti:nextChisti,privacy:{...privacy,requestsById:{...(privacy.requestsById||{}),[id]:request}},ui:{...s.ui,parentGate:null}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'PrivacyDeletionRequested',{entityType:'privacy_request',entityId:id,sourceModule:'privacy',privacyClass:'restricted',properties:{kind,categories}}),'PrivacyDeletionRequested',{requestId:id,userId:request.userId,kind,categories});
  }
  case'IRANCELL_STUDENT_SUPPORT_CREATE':{
   if(!['student','parent','teacher','academy','content-provider','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'SupportRequestFailed','authenticated_role_required','برای ثبت درخواست پشتیبانی باید وارد حساب شوید.');
   const message=String(action.message||'').trim();
   if(!message)return IrancellReducerReject(s,'SupportRequestFailed','message_required','شرح مشکل را وارد کنید.');
   const id=action.id||IrancellCreateId('support'),createdAt=new Date().toISOString(),ticket={
    id,
    ownerId:s.session.currentUserId,
    role:s.session.activeRole,
    subject:String(action.subject||'درخواست پشتیبانی').trim(),
    message,
    category:String(action.category||'general'),
    relatedService:String(action.relatedService||''),
    childId:String(action.childId||''),
    responseMethod:['app','sms'].includes(action.responseMethod)?action.responseMethod:'app',
    classBlocking:Boolean(action.classBlocking),
    attachmentName:String(action.attachmentName||''),
    attachmentType:String(action.attachmentType||''),
    attachmentSize:Number(action.attachmentSize)||0,
    technicalMetadata:action.technicalMetadata&&typeof action.technicalMetadata==='object'?{...action.technicalMetadata}:null,
    status:'submitted',
    unreadForStudent:false,
    messages:[],
    createdAt,
    updatedAt:createdAt
   };
   const support=s.support||{ticketsById:{}};
   const next={...s,support:{...support,ticketsById:{...(support.ticketsById||{}),[id]:ticket}}};
   return IrancellReducerAudit(IrancellReducerAnalytics(next,'SupportRequestCreated',{entityType:'support_request',entityId:id,sourceModule:'support',privacyClass:'restricted'}),'SupportRequestCreated',{ticketId:id,ownerId:s.session.currentUserId});
  }
  case'IRANCELL_STUDENT_SUPPORT_REPLY':{
   const support=s.support||{ticketsById:{}},ticket=support.ticketsById?.[action.requestId];
   if(!ticket||ticket.ownerId!==s.session.currentUserId)return IrancellReducerReject(s,'SupportReplyFailed','ticket_forbidden','درخواست پشتیبانی در دسترس نیست.');
   const text=String(action.message||'').trim();
   if(!text)return IrancellReducerReject(s,'SupportReplyFailed','message_required','متن پاسخ را وارد کنید.');
   const createdAt=new Date().toISOString(),message={id:IrancellCreateId('support-message'),author:s.session.activeRole==='parent'?'parent':'student',text,attachmentName:String(action.attachmentName||''),attachmentType:String(action.attachmentType||''),attachmentSize:Number(action.attachmentSize)||0,createdAt};
   const nextTicket={...ticket,status:'under_review',messages:[...(ticket.messages||[]),message],updatedAt:createdAt,unreadForStudent:false};
   return IrancellReducerAudit({...s,support:{...support,ticketsById:{...support.ticketsById,[ticket.id]:nextTicket}}},'SupportReplyAdded',{ticketId:ticket.id});
  }
  case'IRANCELL_STUDENT_SUPPORT_RESOLVE':{
   const support=s.support||{ticketsById:{}},ticket=support.ticketsById?.[action.requestId];
   if(!ticket||ticket.ownerId!==s.session.currentUserId)return IrancellReducerReject(s,'SupportResolveFailed','ticket_forbidden','درخواست پشتیبانی در دسترس نیست.');
   const updatedAt=new Date().toISOString(),status=action.reopen?'reopened':'resolved';
   return IrancellReducerAudit({...s,support:{...support,ticketsById:{...support.ticketsById,[ticket.id]:{...ticket,status,updatedAt}}}},'SupportStatusChanged',{ticketId:ticket.id,status});
  }
  case'IRANCELL_STUDENT_SUPPORT_SATISFACTION':{
   const support=s.support||{ticketsById:{}},ticket=support.ticketsById?.[action.requestId];
   if(!ticket||ticket.ownerId!==s.session.currentUserId)return IrancellReducerReject(s,'SupportSatisfactionFailed','ticket_forbidden','درخواست پشتیبانی در دسترس نیست.');
   const score=Math.max(1,Math.min(4,Number(action.score)||0)),updatedAt=new Date().toISOString();
   const nextTicket={...ticket,status:'closed',satisfaction:{score,comment:String(action.comment||'').trim(),createdAt:updatedAt},updatedAt};
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,support:{...support,ticketsById:{...support.ticketsById,[ticket.id]:nextTicket}}},'SupportSatisfactionSubmitted',{entityType:'support_request',entityId:ticket.id,sourceModule:'support',properties:{score}}),'SupportSatisfactionSubmitted',{ticketId:ticket.id,score});
  }
  case'IRANCELL_PARENT_PROFILE_UPDATE':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentProfileUpdateFailed','parent_role_required','ویرایش حساب خانواده فقط برای نقش والد مجاز است.');
   const parentId=s.session.currentUserId;
   const user=s.identity.usersById[parentId];
   if(!user)return IrancellReducerReject(s,'ParentProfileUpdateFailed','parent_missing','حساب خانواده پیدا نشد.');
   const profile=action.profile&&typeof action.profile==='object'?action.profile:{};
   const family=s.family||IRANCELL_INITIAL_STATE.family;
   const nextUser={...user,name:String(profile.name||user.name||'').trim()||user.name,mobile:String(profile.mobile||user.mobile||'').trim()||user.mobile,profileUpdatedAt:new Date().toISOString()};
   const nextProfile={...(family.profilesByParentId?.[parentId]||{}),email:String(profile.email??family.profilesByParentId?.[parentId]?.email??'').trim(),emergencyMobile:String(profile.emergencyMobile??family.profilesByParentId?.[parentId]?.emergencyMobile??'').trim(),address:String(profile.address??family.profilesByParentId?.[parentId]?.address??'').trim(),city:String(profile.city??family.profilesByParentId?.[parentId]?.city??'').trim(),province:String(profile.province??family.profilesByParentId?.[parentId]?.province??'').trim(),updatedAt:new Date().toISOString()};
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[parentId]:nextUser}},family:{...family,profilesByParentId:{...(family.profilesByParentId||{}),[parentId]:nextProfile}}},'ParentProfileUpdated',{entityType:'user',entityId:parentId,sourceModule:'family'}),'ParentProfileUpdated',{parentId});
  }
  case'IRANCELL_PARENT_ADD_CHILD':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentChildLinkFailed','parent_role_required','افزودن دانش‌آموز فقط برای حساب خانواده مجاز است.');
   const parentId=s.session.currentUserId,name=String(action.name||'').trim(),grade=String(action.grade||'').trim();
   if(!name)return IrancellReducerReject(s,'ParentChildLinkFailed','child_name_required','نام دانش‌آموز را وارد کنید.');
   const childId=IrancellCreateId('student'),relationshipId=IrancellCreateId('relationship'),createdAt=new Date().toISOString();
   const child={id:childId,name,mobile:String(action.mobile||''),roles:['student'],status:'active',grade:grade||'پایه تحصیلی ثبت نشده',createdAt};
   const relationship={id:relationshipId,parentId,childId,status:'active',verifiedAt:createdAt};
   const family=s.family||IRANCELL_INITIAL_STATE.family;
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[childId]:child},relationshipsById:{...s.identity.relationshipsById,[relationshipId]:relationship}},family:{...family,childProgressById:{...(family.childProgressById||{}),[childId]:0},activeClassCountByChildId:{...(family.activeClassCountByChildId||{}),[childId]:0},controlsByChildId:{...(family.controlsByChildId||{}),[childId]:{onlineClass:true,recordedContent:true,askTeacher:true,directPayment:false,parentApprovalForClass:true,parentApprovalForPanelExit:true,dailyHours:2,allowedFrom:'16:00',allowedTo:'20:00'}}}},'ParentChildLinked',{entityType:'relationship',entityId:relationshipId,sourceModule:'family'}),'ParentChildLinked',{parentId,childId});
  }
  case'IRANCELL_PARENT_UPDATE_CHILD':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentChildUpdateFailed','parent_role_required','ویرایش دانش‌آموز فقط برای حساب خانواده مجاز است.');
   const parentId=s.session.currentUserId,childId=action.childId;
   const linked=Object.values(s.identity.relationshipsById||{}).some(item=>item.parentId===parentId&&item.childId===childId&&item.status==='active');
   if(!linked)return IrancellReducerReject(s,'ParentChildUpdateFailed','relationship_required','رابطه معتبر خانواده و دانش‌آموز پیدا نشد.');
   const child=s.identity.usersById[childId];
   if(!child)return IrancellReducerReject(s,'ParentChildUpdateFailed','child_missing','دانش‌آموز پیدا نشد.');
   const patch=action.profile&&typeof action.profile==='object'?action.profile:{};
   const nextChild={...child,name:String(patch.name||child.name).trim()||child.name,grade:String(patch.grade||child.grade).trim()||child.grade,updatedAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[childId]:nextChild}}},'ParentChildUpdated',{entityType:'user',entityId:childId,sourceModule:'family'});
  }
  case'IRANCELL_PARENT_UPDATE_CONTROLS':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentControlsUpdateFailed','parent_role_required','کنترل خانواده فقط برای نقش والد مجاز است.');
   const parentId=s.session.currentUserId,childId=action.childId;
   const linked=Object.values(s.identity.relationshipsById||{}).some(item=>item.parentId===parentId&&item.childId===childId&&item.status==='active');
   if(!linked)return IrancellReducerReject(s,'ParentControlsUpdateFailed','relationship_required','رابطه معتبر خانواده و دانش‌آموز پیدا نشد.');
   const family=s.family||IRANCELL_INITIAL_STATE.family,current=family.controlsByChildId?.[childId]||{};
   const controls={...current,...(action.controls&&typeof action.controls==='object'?action.controls:{}),updatedAt:new Date().toISOString()};
   return IrancellReducerAudit({...s,family:{...family,controlsByChildId:{...(family.controlsByChildId||{}),[childId]:controls}}},'ParentControlsUpdated',{parentId,childId});
  }
  case'IRANCELL_PARENT_WALLET_TOPUP':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentWalletTopupFailed','parent_role_required','افزایش موجودی فقط برای حساب خانواده مجاز است.');
   const parentId=s.session.currentUserId,amount=Math.max(0,Math.round(Number(action.amount)||0));
   if(amount<10000)return IrancellReducerReject(s,'ParentWalletTopupFailed','invalid_amount','مبلغ افزایش موجودی معتبر نیست.');
   const family=s.family||IRANCELL_INITIAL_STATE.family,current=family.walletsByParentId?.[parentId]||{balance:0};
   const wallet={...current,balance:(Number(current.balance)||0)+amount,lastTransactionAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,family:{...family,walletsByParentId:{...(family.walletsByParentId||{}),[parentId]:wallet}}},'ParentWalletToppedUp',{entityType:'wallet',entityId:parentId,sourceModule:'family',properties:{amount}});
  }
  case'IRANCELL_PARENT_NOTIFICATION_READ':{
   if(s.session.activeRole!=='parent')return s;
   const parentId=s.session.currentUserId,family=s.family||IRANCELL_INITIAL_STATE.family,item=family.notificationItemsById?.[action.notificationId];
   if(!item||item.parentId!==parentId||item.read)return s;
   return{...s,family:{...family,notificationItemsById:{...family.notificationItemsById,[item.id]:{...item,read:true,readAt:new Date().toISOString()}}}};
  }
  case'IRANCELL_PARENT_NOTIFICATIONS_READ_ALL':{
   if(s.session.activeRole!=='parent')return s;
   const parentId=s.session.currentUserId,family=s.family||IRANCELL_INITIAL_STATE.family,notificationItemsById={...family.notificationItemsById};
   Object.keys(notificationItemsById||{}).forEach(id=>{const item=notificationItemsById[id];if(item?.parentId===parentId&&!item.read)notificationItemsById[id]={...item,read:true,readAt:new Date().toISOString()};});
   return{...s,family:{...family,notificationItemsById}};
  }
  case'IRANCELL_PARENT_GUARDIAN_INVITE':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentGuardianInviteFailed','parent_role_required','دعوت سرپرست فقط برای حساب خانواده مجاز است.');
   const parentId=s.session.currentUserId,name=String(action.name||'').trim(),mobile=String(action.mobile||'').replace(/\D/g,'');
   if(!name)return IrancellReducerReject(s,'ParentGuardianInviteFailed','guardian_name_required','نام سرپرست را وارد کنید.');
   if(!/^09\d{9}$/.test(mobile))return IrancellReducerReject(s,'ParentGuardianInviteFailed','guardian_mobile_invalid','شماره موبایل سرپرست معتبر نیست.');
   const family=s.family||IRANCELL_INITIAL_STATE.family,currentProfile=family.profilesByParentId?.[parentId]||{},invitedAt=new Date().toISOString();
   const nextProfile={...currentProfile,secondaryGuardianName:name,secondaryGuardianMobile:mobile,secondaryGuardianStatus:'pending',secondaryGuardianInvitedAt:invitedAt};
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,family:{...family,profilesByParentId:{...(family.profilesByParentId||{}),[parentId]:nextProfile}}},'ParentGuardianInvited',{entityType:'user',entityId:parentId,sourceModule:'family'}),'ParentGuardianInvited',{parentId,mobile});
  }
  case'IRANCELL_PARENT_SECURITY_UPDATE':{
   if(s.session.activeRole!=='parent')return IrancellReducerReject(s,'ParentSecurityUpdateFailed','parent_role_required','تنظیمات امنیتی فقط برای حساب خانواده مجاز است.');
   const parentId=s.session.currentUserId,family=s.family||IRANCELL_INITIAL_STATE.family,current=family.securityByParentId?.[parentId]||{};
   const nextSecurity={...current,...(action.security&&typeof action.security==='object'?action.security:{}),updatedAt:new Date().toISOString()};
   return IrancellReducerAudit({...s,family:{...family,securityByParentId:{...(family.securityByParentId||{}),[parentId]:nextSecurity}}},'ParentSecurityUpdated',{parentId});
  }
  case'IRANCELL_TEACHER_PROFILE_UPDATE':{
   if(!['teacher','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'TeacherProfileUpdateFailed','teacher_role_required','ویرایش پروفایل مدرس فقط برای حساب مدرس یا مدیر مجاز است.');
   const teacherId=action.teacherId||s.session.currentUserId;
   const user=s.identity.usersById[teacherId];
   if(!user)return IrancellReducerReject(s,'TeacherProfileUpdateFailed','teacher_missing','حساب مدرس پیدا نشد.');
   if(s.session.activeRole==='teacher'&&teacherId!==s.session.currentUserId)return IrancellReducerReject(s,'TeacherProfileUpdateFailed','teacher_forbidden','ویرایش این پروفایل برای حساب فعال مجاز نیست.');
   const profile=action.profile&&typeof action.profile==='object'?action.profile:{};
   const currentProvider=s.marketplace.providersById[teacherId]||{id:teacherId,type:'teacher',verificationStatus:s.identity.providerVerification?.[teacherId]?.status||'under_review',rating:0,completedClasses:0,payoutRequests:[]};
   const subjects=Array.isArray(profile.subjects)?profile.subjects.map(item=>String(item||'').trim()).filter(Boolean).slice(0,12):currentProvider.subjects||[];
   const nextUser={...user,name:String(profile.name||user.name||'').trim()||user.name,mobile:String(profile.mobile||user.mobile||'').replace(/\s/g,''),email:String(profile.email??user.email??'').trim(),profileUpdatedAt:new Date().toISOString()};
   const completedFields=[nextUser.name,String(profile.bio??currentProvider.bio??'').trim(),subjects.length,String(profile.priceFrom??currentProvider.priceFrom??'').trim()].filter(Boolean).length;
   const nextProvider={...currentProvider,id:teacherId,type:'teacher',name:nextUser.name,subjects,bio:String(profile.bio??currentProvider.bio??'').trim(),priceFrom:Math.max(0,Number(profile.priceFrom??currentProvider.priceFrom)||0),experienceYears:Math.max(0,Number(profile.experienceYears??currentProvider.experienceYears)||0),profileCompletion:Math.max(Number(currentProvider.profileCompletion)||0,Math.round(completedFields/4*100)),updatedAt:new Date().toISOString()};
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,identity:{...s.identity,usersById:{...s.identity.usersById,[teacherId]:nextUser}},marketplace:{...s.marketplace,providersById:{...s.marketplace.providersById,[teacherId]:nextProvider}}},'TeacherProfileUpdated',{entityType:'provider',entityId:teacherId,sourceModule:'teacher_profile'}),'TeacherProfileUpdated',{teacherId});
  }
  case'IRANCELL_TEACHER_AVAILABILITY_UPDATE':{
   if(s.session.activeRole!=='teacher')return IrancellReducerReject(s,'TeacherAvailabilityUpdateFailed','teacher_role_required','مدیریت زمان‌های آزاد فقط برای حساب مدرس مجاز است.');
   const teacherId=s.session.currentUserId;
   const slots=Array.isArray(action.slots)?Array.from(new Set(action.slots.map(item=>String(item||'').trim()).filter(Boolean))).slice(0,40):[];
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,availability:{...s.marketplace.availability,[teacherId]:slots}}},'TeacherAvailabilityUpdated',{entityType:'provider',entityId:teacherId,sourceModule:'teacher_calendar',properties:{slotCount:slots.length}});
  }
  case'IRANCELL_TEACHER_OFFER_CANCEL':{
   if(!['teacher','academy'].includes(s.session.activeRole))return IrancellReducerReject(s,'TeacherOfferCancelFailed','provider_role_required','لغو پیشنهاد فقط برای ارائه‌دهنده ثبت‌کننده مجاز است.');
   const offer=s.marketplace.offersById[action.offerId];
   if(!offer||offer.providerId!==s.session.currentUserId)return IrancellReducerReject(s,'TeacherOfferCancelFailed','offer_forbidden','پیشنهاد در دسترس این حساب نیست.');
   if(offer.status!=='active')return s;
   return IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,offersById:{...s.marketplace.offersById,[offer.id]:{...offer,status:'cancelled',cancelledAt:new Date().toISOString()}}}},'TeacherOfferCancelled',{entityType:'offer',entityId:offer.id,sourceModule:'marketplace'});
  }
  case'IRANCELL_TEACHER_PAYOUT_REQUEST':{
   if(!['teacher','academy'].includes(s.session.activeRole))return IrancellReducerReject(s,'TeacherPayoutRequestFailed','provider_role_required','درخواست تسویه فقط برای ارائه‌دهنده فعال مجاز است.');
   const providerId=s.session.currentUserId,provider=s.marketplace.providersById[providerId];
   if(!provider)return IrancellReducerReject(s,'TeacherPayoutRequestFailed','provider_missing','پروفایل مالی ارائه‌دهنده پیدا نشد.');
   const amount=Math.round(Number(action.amount)||0),available=Math.max(0,Number(provider.settlementAmount)||0);
   if(amount<10000||amount>available)return IrancellReducerReject(s,'TeacherPayoutRequestFailed','payout_amount_invalid','مبلغ تسویه باید بیشتر از ده هزار تومان و حداکثر برابر موجودی قابل تسویه باشد.');
   const request={id:IrancellCreateId('payout'),providerId,amount,status:'submitted',createdAt:new Date().toISOString()};
   const nextProvider={...provider,settlementAmount:available-amount,payoutRequests:[...(provider.payoutRequests||[]),request]};
   return IrancellReducerAudit(IrancellReducerAnalytics({...s,marketplace:{...s.marketplace,providersById:{...s.marketplace.providersById,[providerId]:nextProvider}}},'TeacherPayoutRequested',{entityType:'payout',entityId:request.id,sourceModule:'teacher_earnings',privacyClass:'financial',properties:{amount}}),'TeacherPayoutRequested',{providerId,requestId:request.id,amount});
  }
  case'IRANCELL_CONTENT_UPLOAD':{
   if(!['content-provider','admin'].includes(s.session.activeRole))return IrancellReducerReject(s,'ContentUploadFailed','content_role_required','بارگذاری محتوا فقط برای تولیدکننده محتوا یا ادمین مجاز است.');
   const id=IrancellCreateId('content'),provider=s.identity.usersById[s.session.currentUserId]?.name||'تولیدکننده محتوا',item={id,...action.data,provider,status:'under_review',rating:0,views:0,createdAt:new Date().toISOString()};
   return IrancellReducerAnalytics({...s,content:{...s.content,catalogueById:{...s.content.catalogueById,[id]:item}}},'ContentUploaded',{entityType:'content',entityId:id,sourceModule:'binaei'});
  }
  case'IRANCELL_ADMIN_PROVIDER_STATUS':{
   if(s.session.activeRole!=='admin')return IrancellReducerReject(s,'ProviderStatusChangeFailed','admin_required','این عملیات فقط برای ادمین مجاز است.');
   const provider=s.marketplace.providersById[action.providerId];if(!provider)return IrancellReducerReject(s,'ProviderStatusChangeFailed','provider_missing','ارائه‌دهنده پیدا نشد.');
   if(!['verified','under_review','rejected','suspended'].includes(action.status))return IrancellReducerReject(s,'ProviderStatusChangeFailed','status_invalid','وضعیت انتخاب‌شده معتبر نیست.');
   return IrancellReducerAudit({...s,marketplace:{...s.marketplace,providersById:{...s.marketplace.providersById,[action.providerId]:{...provider,verificationStatus:action.status}}}},'ProviderStatusChanged',{providerId:action.providerId,status:action.status});
  }
  case'IRANCELL_UI_TOAST':return IrancellReducerToast(s,action.message,action.tone||'success');
  case'IRANCELL_UI_DISMISS_TOAST':return{...s,ui:{...s.ui,toasts:s.ui.toasts.filter(function IrancellReducerKeepToast(toast){return toast.id!==action.id;})}};
  default:return s;
 }
}
