export function IrancellInput({label,error,helper,id,style={},...props}){const inputId=id||`ir-${props.name||'input'}`,font='"Vazirmatn", Tahoma, Arial, sans-serif',messageId=`${inputId}-message`;return <label htmlFor={inputId} style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gap:'7px',margin:0,color:'#3F4046',fontFamily:font,fontSize:'12px',fontWeight:800,lineHeight:1.7}}><span style={{fontFamily:font}}>{label}{props.required&&<b style={{marginInlineStart:'3px',color:'#B42318'}}>*</b>}</span><input id={inputId} {...props} aria-invalid={error?true:props['aria-invalid']} aria-describedby={error||helper?messageId:props['aria-describedby']} style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,minHeight:'48px',margin:0,padding:'10px 13px',color:'#202024',background:'#FFFFFF',border:`1.5px solid ${error?'#C62828':'#D9D9DE'}`,borderRadius:'14px',outlineOffset:'3px',fontFamily:font,fontSize:'13px',fontWeight:600,lineHeight:1.6,...style}}/>{error?<small id={messageId} role="alert" style={{margin:0,color:'#B42318',fontFamily:font,fontSize:'11px',fontWeight:700,lineHeight:1.7}}>{error}</small>:helper?<small id={messageId} style={{margin:0,color:'#797A82',fontFamily:font,fontSize:'11px',fontWeight:500,lineHeight:1.7}}>{helper}</small>:null}</label>}
export function IrancellIdentityPasswordField({label,error,helper,id,className='',style={},...props}){const[visible,setVisible]=useState(false),inputId=id||`ir-${props.name||'password'}`,font='"Vazirmatn", Tahoma, Arial, sans-serif',messageId=`${inputId}-message`;return <label className={className||undefined} htmlFor={inputId} style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gap:'7px',margin:0,color:'#3F4046',fontFamily:font,fontSize:'12px',fontWeight:800,lineHeight:1.7}}><span style={{fontFamily:font}}>{label}</span><div style={{boxSizing:'border-box',position:'relative',display:'block',width:'100%',minWidth:0}}><input id={inputId} {...props} type={visible?'text':'password'} aria-invalid={error?true:props['aria-invalid']} aria-describedby={error||helper?messageId:props['aria-describedby']} style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,minHeight:'48px',margin:0,padding:'10px 13px 10px 50px',color:'#202024',background:'#FFFFFF',border:`1.5px solid ${error?'#C62828':'#D9D9DE'}`,borderRadius:'14px',outlineOffset:'3px',fontFamily:font,fontSize:'13px',fontWeight:600,lineHeight:1.6,...style}}/><button type="button" aria-label={visible?'پنهان کردن رمز عبور':'نمایش رمز عبور'} aria-pressed={visible} onClick={()=>setVisible(current=>!current)} style={{boxSizing:'border-box',position:'absolute',top:'50%',insetInlineEnd:'7px',display:'grid',width:'36px',height:'36px',placeItems:'center',margin:0,padding:0,cursor:'pointer',color:visible?'#725F00':'#707077',background:visible?'#FFF3AE':'transparent',border:0,borderRadius:'10px',transform:'translateY(-50%)',fontFamily:font,fontSize:'16px',fontWeight:900}}><span aria-hidden="true">{visible?'◉':'○'}</span></button></div>{error?<small id={messageId} role="alert" style={{margin:0,color:'#B42318',fontFamily:font,fontSize:'11px',fontWeight:700,lineHeight:1.7}}>{error}</small>:helper?<small id={messageId} style={{margin:0,color:'#797A82',fontFamily:font,fontSize:'11px',fontWeight:500,lineHeight:1.7}}>{helper}</small>:null}</label>}
export function IrancellIdentityOtpFields({value='',onChange,length=6,error,id='ir-identity-otp',autoFocus=false}){
 const persianDigits='۰۱۲۳۴۵۶۷۸۹';
 const arabicDigits='٠١٢٣٤٥٦٧٨٩';
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
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
 return <div style={{boxSizing:'border-box',display:'grid',gap:'10px',width:'100%',minWidth:0,fontFamily:font}}>
  <div dir="ltr" onPaste={paste} style={{boxSizing:'border-box',display:'grid',gridTemplateColumns:`repeat(${length},minmax(0,1fr))`,gap:'8px',width:'100%',minWidth:0}}>
   {digits.map((digit,index)=><input key={index} id={`${id}-${index}`} lang="fa" dir="rtl" value={toPersian(digit)} inputMode="numeric" autoComplete={index===0?'one-time-code':'off'} maxLength={1} aria-label={`رقم ${toPersian(index+1)} کد تأیید`} aria-invalid={Boolean(error)} aria-describedby={error?`${id}-error`:undefined} autoFocus={autoFocus&&index===0} onFocus={event=>event.currentTarget.select()} onChange={event=>change(index,event.target.value)} onKeyDown={event=>keyDown(index,event)} style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,height:'52px',margin:0,padding:'6px',textAlign:'center',color:'#202024',background:'#FFFFFF',border:`1.5px solid ${error?'#C62828':'#D9D9DE'}`,borderRadius:'14px',outlineOffset:'3px',fontFamily:font,fontSize:'21px',fontWeight:900}}/>)}
  </div>
  {error&&<small id={`${id}-error`} role="alert" style={{display:'block',margin:0,color:'#B42318',fontFamily:font,fontSize:'12px',fontWeight:700,lineHeight:1.7}}>{error}</small>}
 </div>
}
export function IrancellTextarea({label,error,helper,id,style={},...props}){const inputId=id||`ir-${props.name||'textarea'}`,font='"Vazirmatn", Tahoma, Arial, sans-serif',messageId=`${inputId}-message`;return <label htmlFor={inputId} style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gap:'7px',margin:0,color:'#3F4046',fontFamily:font,fontSize:'12px',fontWeight:800,lineHeight:1.7}}><span style={{fontFamily:font}}>{label}{props.required&&<b style={{marginInlineStart:'3px',color:'#B42318'}}>*</b>}</span><textarea id={inputId} {...props} aria-invalid={error?true:props['aria-invalid']} aria-describedby={error||helper?messageId:props['aria-describedby']} style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,minHeight:'120px',margin:0,padding:'12px 13px',resize:'vertical',color:'#202024',background:'#FFFFFF',border:`1.5px solid ${error?'#C62828':'#D9D9DE'}`,borderRadius:'14px',outlineOffset:'3px',fontFamily:font,fontSize:'13px',fontWeight:600,lineHeight:1.8,...style}}/>{error?<small id={messageId} role="alert" style={{margin:0,color:'#B42318',fontFamily:font,fontSize:'11px',fontWeight:700,lineHeight:1.7}}>{error}</small>:helper?<small id={messageId} style={{margin:0,color:'#797A82',fontFamily:font,fontSize:'11px',lineHeight:1.7}}>{helper}</small>:null}</label>}
export function IrancellSelect({label,error,options=[],id,style={},...props}){const inputId=id||`ir-${props.name||'select'}`,font='"Vazirmatn", Tahoma, Arial, sans-serif',messageId=`${inputId}-message`;return <label htmlFor={inputId} style={{boxSizing:'border-box',display:'grid',width:'100%',minWidth:0,gap:'7px',margin:0,color:'#3F4046',fontFamily:font,fontSize:'12px',fontWeight:800,lineHeight:1.7}}><span style={{fontFamily:font}}>{label}{props.required&&<b style={{marginInlineStart:'3px',color:'#B42318'}}>*</b>}</span><select id={inputId} {...props} aria-invalid={error?true:props['aria-invalid']} aria-describedby={error?messageId:props['aria-describedby']} style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,minHeight:'48px',margin:0,padding:'9px 13px',direction:'rtl',color:'#202024',background:'#FFFFFF',border:`1.5px solid ${error?'#C62828':'#D9D9DE'}`,borderRadius:'14px',outlineOffset:'3px',fontFamily:font,fontSize:'13px',fontWeight:700,lineHeight:1.6,...style}}>{options.map(o=><option key={String(o.value)} value={o.value}>{o.label}</option>)}</select>{error&&<small id={messageId} role="alert" style={{margin:0,color:'#B42318',fontFamily:font,fontSize:'11px',fontWeight:700,lineHeight:1.7}}>{error}</small>}</label>}