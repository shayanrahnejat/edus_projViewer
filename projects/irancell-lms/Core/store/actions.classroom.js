export function IrancellClassStart(sessionId){return{type:'IRANCELL_CLASS_START',sessionId};}
export function IrancellClassEnd(sessionId){return{type:'IRANCELL_CLASS_END',sessionId};}
export function IrancellClassCancel(sessionId,reason='user_cancelled'){return{type:'IRANCELL_CLASS_CANCEL',sessionId,reason};}