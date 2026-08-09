export function IrancellModal({open,title,children,onClose,actions,variant='dialog',closeOnBackdrop=true,closeOnEscape=true}){
 const dialogRef=useRef(null);
 const previousFocusRef=useRef(null);
 useEffect(function IrancellModalAccessibilityEffect(){
  if(!open||typeof document==='undefined')return undefined;
  previousFocusRef.current=document.activeElement;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const dialog=dialogRef.current;
  const focusables=()=>Array.from(dialog?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')||[]);
  const first=focusables()[0]||dialog;
  window.setTimeout(()=>first?.focus?.(),0);
  function handleKeyDown(event){
   if(event.key==='Escape'&&closeOnEscape){event.preventDefault();onClose?.();return}
   if(event.key!=='Tab')return;
   const items=focusables();
   if(!items.length){event.preventDefault();dialog?.focus();return}
   const firstItem=items[0],lastItem=items[items.length-1];
   if(event.shiftKey&&document.activeElement===firstItem){event.preventDefault();lastItem.focus()}
   else if(!event.shiftKey&&document.activeElement===lastItem){event.preventDefault();firstItem.focus()}
  }
  document.addEventListener('keydown',handleKeyDown);
  return function IrancellModalAccessibilityCleanup(){document.removeEventListener('keydown',handleKeyDown);document.body.style.overflow=previousOverflow;previousFocusRef.current?.focus?.()}
 },[open,onClose,closeOnEscape]);
 if(!open)return null;
 return <div className={`ir-modal-backdrop ir-modal-backdrop--${variant}`} role="presentation" onMouseDown={event=>{if(closeOnBackdrop&&event.target===event.currentTarget)onClose?.()}}><section ref={dialogRef} className={`ir-modal ir-modal--${variant}`} role="dialog" aria-modal="true" aria-label={title||'پنجره'} tabIndex={-1}><header><h2>{title}</h2>{onClose&&<button type="button" onClick={onClose} aria-label="بستن"><X size={20}/></button>}</header><div className="ir-modal__body">{children}</div>{actions&&<footer>{actions}</footer>}</section></div>
}