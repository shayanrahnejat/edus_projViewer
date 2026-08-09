export const IRANCELL_ROLE_PERMISSIONS=Object.freeze({
 student:['student.*','shared.read','class.join','quality.create'],
 parent:['parent.*','shared.read','consent.sign','payment.create','quality.create'],
 teacher:['teacher.*','shared.read','marketplace.offer','class.join'],
 academy:['academy.*','shared.read','marketplace.offer','class.join'],
 'content-provider':['content.*','shared.read'],
 admin:['admin.*','shared.*','student.*','parent.*','teacher.*','academy.*','content.*','class.join']
});
export function IrancellPermissionMatches(granted,required){if(!required||granted==='*'||granted===required)return true;return granted.endsWith('.*')&&required.startsWith(granted.slice(0,-1));}
export function IrancellHasPermissions(role,requirements){const granted=IRANCELL_ROLE_PERMISSIONS[role]||[];return(requirements||[]).every(r=>granted.some(g=>IrancellPermissionMatches(g,r)));}
