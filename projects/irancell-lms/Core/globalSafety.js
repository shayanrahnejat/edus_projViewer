export function IrancellEvaluateClassGate(state,sessionId,role){
 const s=state.classroom.sessionsById[sessionId];
 if(!state.session.token||state.session.status!=='authenticated')return{allowed:false,code:'identity_required',message:'ابتدا وارد حساب کاربری شوید.',actionRoute:'auth/login'};
 if(!IrancellHasPermissions(role,['class.join']))return{allowed:false,code:'role_forbidden',message:'نقش فعال اجازه ورود به کلاس را ندارد.',actionRoute:`${role}/home`};
 if(!s)return{allowed:false,code:'session_missing',message:'کلاس موردنظر پیدا نشد.',actionRoute:`${role}/classes`};
 const uid=state.session.currentUserId;
 if(!s.participantIds.includes(uid))return{allowed:false,code:'participant_missing',message:'شما در فهرست شرکت‌کنندگان این کلاس نیستید.',actionRoute:`${role}/classes`};
 if(state.identity.usersById[uid]?.status!=='active')return{allowed:false,code:'account_inactive',message:'حساب کاربری غیرفعال است.',actionRoute:'help'};
 if(s.requiresConsent){const g=state.consent.gatesBySessionId[sessionId];if(!g||g.status!=='signed'||new Date(g.expiresAt)<=new Date())return{allowed:false,code:'consent_required',message:'رضایت والد هنوز امضا نشده یا منقضی شده است.',actionRoute:`consent/${s.consentDocumentId}`};}
 if(s.isPaid&&state.payment.escrowByOrderId[s.orderId]?.status!=='held')return{allowed:false,code:'payment_required',message:'پرداخت امانی قطعی نشده است.',actionRoute:`payment/${s.orderId}`};
 if(!IrancellIsWithinClassWindow(s.startAt,15)&&s.status!=='live')return{allowed:false,code:'outside_window',message:'بازه ورود کلاس هنوز فعال نیست.',actionRoute:`${role}/classes`};
 const p=state.marketplace.providersById[s.providerId];if(p&&['suspended','rejected'].includes(p.verificationStatus))return{allowed:false,code:'provider_suspended',message:'ارائه‌دهنده مجاز به برگزاری نیست.',actionRoute:'help'};
 return{allowed:true,code:'allowed',message:'هویت، رضایت، پرداخت، مشارکت و زمان تأیید شد.'};
}
export function IrancellCanViewChild(state,parentId,childId){return Object.values(state.identity.relationshipsById).some(r=>r.parentId===parentId&&r.childId===childId&&r.status==='active');}
