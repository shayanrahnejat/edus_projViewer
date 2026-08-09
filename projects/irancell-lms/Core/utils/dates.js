export function IrancellFormatDateTime(v){return new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short'}).format(v?new Date(v):new Date());}
export function IrancellIsWithinClassWindow(startAt,minutes=15){const s=new Date(startAt).getTime(),n=Date.now();return n>=s-minutes*60000&&n<=s+120*60000;}
