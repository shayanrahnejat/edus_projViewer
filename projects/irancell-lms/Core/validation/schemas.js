export function IrancellValidateMobile(v){return /^09\d{9}$/.test(String(v||''))?'':'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.';}
export function IrancellValidateOtp(v){return /^\d{5}$/.test(String(v||''))?'':'کد یک‌بارمصرف باید ۵ رقم باشد.';}
export function IrancellValidateRequired(v,label='این فیلد'){return String(v??'').trim()?'':`${label} الزامی است.`;}
export function IrancellValidateTeacherRequest(d){const e={};for(const k of ['subject','grade','topic','preferredTime','urgency'])if(!String(d?.[k]||'').trim())e[k]='تکمیل این فیلد الزامی است.';return e;}
