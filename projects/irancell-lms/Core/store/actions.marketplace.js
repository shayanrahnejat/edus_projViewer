export function IrancellMarketplaceCreateRequest(data,studentId){return{type:'IRANCELL_MARKETPLACE_CREATE_REQUEST',data,studentId};}
export function IrancellMarketplaceCancelRequest(requestId){return{type:'IRANCELL_MARKETPLACE_CANCEL_REQUEST',requestId};}
export function IrancellMarketplaceSubmitOffer(requestId,price,proposedTime,assignedTeacherName,details={}){return{type:'IRANCELL_MARKETPLACE_SUBMIT_OFFER',requestId,price,proposedTime,assignedTeacherName,assignedTeacherId:details.assignedTeacherId||null,description:details.description||'',sessionCount:details.sessionCount||1,sessionDuration:details.sessionDuration||60,responseLabel:details.responseLabel||'',modes:Array.isArray(details.modes)?details.modes:[],terms:details.terms||''};}
export function IrancellMarketplaceSelectOffer(offerId){return{type:'IRANCELL_MARKETPLACE_SELECT_OFFER',offerId};}
export function IrancellMarketplaceWithdrawOffer(offerId){return{type:'IRANCELL_MARKETPLACE_WITHDRAW_OFFER',offerId};}
export function IrancellAcademyUpdateProfile(data){return{type:'IRANCELL_ACADEMY_PROFILE_UPDATE',data};}
export function IrancellAcademyAddTeacher(data){return{type:'IRANCELL_ACADEMY_TEACHER_ADD',data};}
export function IrancellAcademyUpdateTeacher(teacherId,data){return{type:'IRANCELL_ACADEMY_TEACHER_UPDATE',teacherId,data};}