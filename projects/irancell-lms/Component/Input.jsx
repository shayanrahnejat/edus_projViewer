export function IrancellInput({label,error,helper,id,...props}){const inputId=id||`ir-${props.name||'input'}`;return <label className={`ir-field ${error?'has-error':''}`} htmlFor={inputId}><span>{label}{props.required&&<b>*</b>}</span><input id={inputId} {...props}/>{error?<small className="ir-field__error">{error}</small>:helper?<small>{helper}</small>:null}</label>}
export function IrancellIdentityPasswordField({label,error,helper,id,className='',...props}){const[visible,setVisible]=useState(false),inputId=id||`ir-${props.name||'password'}`;return <label className={`ir-field ir-identity-password-field ${error?'has-error':''} ${className}`} htmlFor={inputId}><span>{label}</span><div className="ir-identity-password-control"><input id={inputId} {...props} type={visible?'text':'password'}/><button type="button" aria-label={visible?'پنهان کردن رمز عبور':'نمایش رمز عبور'} aria-pressed={visible} onClick={()=>setVisible(current=>!current)}><i className={`ir-identity-password-eye ${visible?'is-visible':''}`} aria-hidden="true"/></button></div>{error?<small className="ir-field__error">{error}</small>:helper?<small>{helper}</small>:null}</label>}
export function IrancellIdentityOtpFields({value='',onChange,length=6,error,id='ir-identity-otp',autoFocus=false}){
 const persianDigits='۰۱۲۳۴۵۶۷۸۹';
 const arabicDigits='٠١٢٣٤٥٦٧٨٩';
 function toEnglish(raw){
  return String(raw||'')
   .replace(/[۰-۹]/g,digit=>String(persianDigits.indexOf(digit)))
   .replace(/[٠-٩]/g,digit=>String(arabicDigits.indexOf(digit)))
 }
 function toPersian(raw){
  return String(raw||'').replace(/\d/g,digit=>persianDigits[Number(digit)])
 }
 const normalized=toEnglish(value).replace(/\D/g,'').slice(0,length);
 const digits=Array.from({length},(_,index)=>normalized[index]||'');
 function focus(index){
  if(typeof document==='undefined')return;
  document.getElementById(`${id}-${index}`)?.focus()
 }
 function change(index,raw){
  const digit=toEnglish(raw).replace(/\D/g,'').slice(-1);
  const nextDigits=[...digits];
  nextDigits[index]=digit;
  onChange?.(nextDigits.join('').slice(0,length));
  if(digit&&index<length-1)focus(index+1)
 }
 function keyDown(index,event){
  if(event.key==='Backspace'&&!digits[index]&&index>0)focus(index-1);
  if(event.key==='ArrowLeft'&&index<length-1)focus(index+1);
  if(event.key==='ArrowRight'&&index>0)focus(index-1)
 }
 function paste(event){
  const pasted=toEnglish(event.clipboardData?.getData('text')).replace(/\D/g,'').slice(0,length);
  if(!pasted)return;
  event.preventDefault();
  onChange?.(pasted);
  focus(Math.min(pasted.length,length)-1)
 }
 return <div className={`ir-identity-otp-group ${error?'has-error':''}`}>
  <div className="ir-identity-otp-fields" dir="ltr" onPaste={paste}>
   {digits.map((digit,index)=><input key={index} id={`${id}-${index}`} lang="fa" dir="rtl" value={toPersian(digit)} inputMode="numeric" autoComplete={index===0?'one-time-code':'off'} maxLength={1} aria-label={`رقم ${toPersian(index+1)} کد تأیید`} autoFocus={autoFocus&&index===0} onFocus={event=>event.currentTarget.select()} onChange={event=>change(index,event.target.value)} onKeyDown={event=>keyDown(index,event)}/>)}
  </div>
  {error&&<small className="ir-field__error">{error}</small>}
 </div>
}
export function IrancellTextarea({label,error,helper,id,...props}){const inputId=id||`ir-${props.name||'textarea'}`;return <label className={`ir-field ${error?'has-error':''}`} htmlFor={inputId}><span>{label}{props.required&&<b>*</b>}</span><textarea id={inputId} {...props}/>{error?<small className="ir-field__error">{error}</small>:helper?<small>{helper}</small>:null}</label>}
export function IrancellSelect({label,error,options=[],id,...props}){const inputId=id||`ir-${props.name||'select'}`;return <label className={`ir-field ${error?'has-error':''}`} htmlFor={inputId}><span>{label}{props.required&&<b>*</b>}</span><select id={inputId} {...props}>{options.map(o=><option key={String(o.value)} value={o.value}>{o.label}</option>)}</select>{error&&<small className="ir-field__error">{error}</small>}</label>}