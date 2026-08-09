export function IrancellButton({children,variant='primary',loading=false,icon:Icon,type='button',className='',block=false,size='md',iconOnly=false,...props}){
 const iconIsRenderable=typeof Icon==='string'||typeof Icon==='function'||Boolean(Icon&&typeof Icon==='object'&&Icon.$$typeof);
 const disabled=Boolean(loading||props.disabled);
 return <button type={type} className={`ir-button ir-button--${variant} ir-button--${size} ${block?'ir-button--block':''} ${iconOnly?'ir-button--icon':''} ${className}`.trim()} disabled={disabled} aria-busy={loading||undefined} {...props}>{loading?<span className="ir-spinner" aria-hidden="true"/>:iconIsRenderable?React.createElement(Icon,{size:size==='sm'?16:18}):null}{children!==undefined&&children!==null&&<span>{children}</span>}</button>
}