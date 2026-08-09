export function IrancellContentSelect(contentId,view='course'){return{type:'IRANCELL_CONTENT_SELECT',contentId,view};}
export function IrancellContentEnroll(contentId,options={}){return{type:'IRANCELL_CONTENT_ENROLL',contentId,...options};}
export function IrancellContentRecordProgress(contentId,progress){return{type:'IRANCELL_CONTENT_PROGRESS',contentId,progress};}
export function IrancellContentUpload(data){return{type:'IRANCELL_CONTENT_UPLOAD',data};}