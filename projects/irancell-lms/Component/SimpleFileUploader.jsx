export function IrancellSimpleFileUploader({
 label='بارگذاری فایل',
 hint='فایل را انتخاب کنید یا اینجا رها کنید',
 accept='image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt',
 maxSizeMb=15,
 openSignal=0,
 resetSignal=0,
 hideTrigger=false,
 onChange,
 onStatusChange
}){
 const[overlayOpen,setOverlayOpen]=useState(false);
 const[attachment,setAttachment]=useState(null);
 const cameraInputRef=useRef(null);
 const galleryInputRef=useRef(null);
 const fileInputRef=useRef(null);
 const acceptsImages=String(accept||'').includes('image/')||String(accept||'').includes('*/*');
 const maximumBytes=Math.max(1,Number(maxSizeMb)||15)*1024*1024;

 useEffect(function IrancellSimpleFileUploaderKeyboardDismiss(){
  if(!overlayOpen)return undefined;
  function handleKeyDown(event){
   if(event.key==='Escape')setOverlayOpen(false);
  }
  document.addEventListener('keydown',handleKeyDown);
  return()=>document.removeEventListener('keydown',handleKeyDown);
 },[overlayOpen]);

 useEffect(function IrancellSimpleFileUploaderExternalOpen(){
  if(!openSignal)return;
  setOverlayOpen(true);
 },[openSignal]);

 useEffect(function IrancellSimpleFileUploaderExternalReset(){
  if(!resetSignal)return;
  clearAttachment()
 },[resetSignal]);

 useEffect(function IrancellSimpleFileUploaderProgress(){
  if(!attachment||attachment.status!=='uploading')return undefined;
  const timer=window.setInterval(()=>{
   setAttachment(current=>{
    if(!current||current.status!=='uploading')return current;
    const progress=Math.min(100,(Number(current.progress)||0)+16);
    return{...current,progress,status:progress>=100?'success':'uploading'};
   });
  },170);
  return()=>window.clearInterval(timer);
 },[attachment?.uploadId,attachment?.status]);

 useEffect(function IrancellSimpleFileUploaderNotifyStatus(){
  onStatusChange?.(attachment?.status||'empty');
 },[attachment?.status,onStatusChange]);

 useEffect(function IrancellSimpleFileUploaderPreviewCleanup(){
  return()=>{
   if(attachment?.previewUrl&&attachment.previewUrl.startsWith('blob:')&&typeof URL!=='undefined')URL.revokeObjectURL(attachment.previewUrl);
  };
 },[attachment?.previewUrl]);

 function formatSize(size){
  const bytes=Math.max(0,Number(size)||0);
  if(bytes<1024)return`${bytes.toLocaleString('fa-IR')} بایت`;
  if(bytes<1024*1024)return`${Math.max(1,Math.round(bytes/1024)).toLocaleString('fa-IR')} کیلوبایت`;
  return`${(bytes/(1024*1024)).toLocaleString('fa-IR',{maximumFractionDigits:1})} مگابایت`
 }

 function clearAttachment(){
  setAttachment(current=>{
   if(current?.previewUrl&&current.previewUrl.startsWith('blob:')&&typeof URL!=='undefined')URL.revokeObjectURL(current.previewUrl);
   return null
  });
  onChange?.(null)
 }

 function retryAttachment(){
  setAttachment(current=>{
   if(!current)return current;
   if(Number(current.size||0)>maximumBytes)return{...current,status:'failed',progress:0,error:`حجم فایل باید کمتر از ${Number(maxSizeMb)||15} مگابایت باشد.`};
   return{...current,status:'uploading',progress:8,error:'',uploadId:`upload-${Date.now()}`}
  })
 }

 function acceptAttachment(file){
  if(!file)return;
  const isImage=String(file.type||'').startsWith('image/');
  const previewUrl=isImage&&typeof URL!=='undefined'&&typeof URL.createObjectURL==='function'?URL.createObjectURL(file):'';
  const tooLarge=Number(file.size||0)>maximumBytes;
  setAttachment(current=>{
   if(current?.previewUrl&&current.previewUrl.startsWith('blob:')&&typeof URL!=='undefined')URL.revokeObjectURL(current.previewUrl);
   return{
    id:`attachment-${Date.now()}`,
    uploadId:`upload-${Date.now()}`,
    file,
    name:file.name||'پیوست',
    size:Number(file.size)||0,
    type:file.type||'application/octet-stream',
    isImage,
    previewUrl,
    progress:tooLarge?0:8,
    status:tooLarge?'failed':'uploading',
    error:tooLarge?`حجم فایل باید کمتر از ${Number(maxSizeMb)||15} مگابایت باشد.`:''
   }
  });
  onChange?.(tooLarge?null:file);
  setOverlayOpen(false)
 }

 function handleNativeInput(event){
  const file=event.target.files?.[0]||null;
  event.target.value='';
  acceptAttachment(file)
 }

 function openNativeInput(inputRef){
  inputRef?.current?.click()
 }

 function handleDrop(event){
  event.preventDefault();
  event.stopPropagation();
  acceptAttachment(event.dataTransfer?.files?.[0]||null)
 }

 function renderAttachmentState(){
  if(!attachment)return null;
  const uploading=attachment.status==='uploading';
  const failed=attachment.status==='failed';
  const success=attachment.status==='success';
  const progress=Math.max(0,Math.min(100,Number(attachment.progress)||0));

  if(failed)return <article className="ir-chisti-attachment-state is-failed" role="alert">
   <span className="ir-chisti-attachment-state__failed-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v6M12 17h.01"/></svg>
   </span>
   <span className="ir-shared-attachment-failed-copy">
    <strong>بارگذاری ناموفق بود</strong>
    <small>{attachment.error}</small>
   </span>
   <button type="button" className="ir-chisti-attachment-state__retry" onClick={retryAttachment}>تلاش مجدد</button>
   <button type="button" className="ir-shared-attachment-remove-failed" aria-label="حذف فایل" onClick={clearAttachment}>×</button>
  </article>;

  return <article className={`ir-chisti-attachment-state ${attachment.isImage?'is-image':'is-file'} ${uploading?'is-uploading':''} ${success?'is-success':''}`}>
   <span className="ir-chisti-attachment-state__preview" aria-hidden="true">
    {attachment.isImage&&attachment.previewUrl?<img src={attachment.previewUrl} alt=""/>:<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5"/></svg>}
    {success&&!attachment.isImage&&<i className="ir-chisti-attachment-state__success-mark">✓</i>}
   </span>

   <div className="ir-chisti-attachment-state__copy">
    <strong>{attachment.name}</strong>
    {uploading?<small className="is-uploading-text">در حال بارگذاری...</small>:<small>{formatSize(attachment.size)}</small>}
   </div>

   <button type="button" className="ir-chisti-attachment-state__remove" aria-label="حذف فایل" onClick={clearAttachment}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="m9 9 6 6M15 9l-6 6"/></svg>
   </button>

   {uploading&&<div className="ir-chisti-attachment-state__progress" role="progressbar" aria-label="درصد بارگذاری" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
    <span style={{width:`${progress}%`}}/>
   </div>}
  </article>
 }

 function renderOverlay(){
  if(!overlayOpen)return null;
  const overlay=<div className="ir-chisti-attachment-overlay" role="presentation" onMouseDown={()=>setOverlayOpen(false)}>
   <section className="ir-chisti-attachment-sheet" role="dialog" aria-modal="true" aria-label="افزودن پیوست" onMouseDown={event=>event.stopPropagation()}>
    <span className="ir-chisti-attachment-sheet__handle" aria-hidden="true"/>

    {acceptsImages&&<button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>openNativeInput(cameraInputRef)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>
     </span>
     <span>گرفتن عکس</span>
    </button>}

    {acceptsImages&&<button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>openNativeInput(galleryInputRef)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m5 18 5-5 3 3 2-2 4 4"/></svg>
     </span>
     <span>انتخاب از گالری</span>
    </button>}

    <button type="button" className="ir-chisti-attachment-sheet__option" onClick={()=>openNativeInput(fileInputRef)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5"/></svg>
     </span>
     <span>انتخاب فایل</span>
    </button>

    <button type="button" className="ir-chisti-attachment-sheet__option is-cancel" onClick={()=>setOverlayOpen(false)}>
     <span className="ir-chisti-attachment-sheet__option-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m9 9 6 6M15 9l-6 6"/></svg>
     </span>
     <span>انصراف</span>
    </button>

    <input ref={cameraInputRef} className="ir-chisti-attachment-sheet__native-input" type="file" accept="image/*" capture="environment" onChange={handleNativeInput}/>
    <input ref={galleryInputRef} className="ir-chisti-attachment-sheet__native-input" type="file" accept="image/*" onChange={handleNativeInput}/>
    <input ref={fileInputRef} className="ir-chisti-attachment-sheet__native-input" type="file" accept={accept||undefined} onChange={handleNativeInput}/>
   </section>
  </div>;

  if(typeof document!=='undefined'&&typeof ReactDOM!=='undefined'&&typeof ReactDOM.createPortal==='function')return ReactDOM.createPortal(overlay,document.body);
  return overlay
 }

 return <div className={`ir-shared-file-uploader ${hideTrigger?'is-external-trigger':''}`}>
  {!hideTrigger&&!attachment&&<button type="button" className="ir-uploader" aria-haspopup="dialog" onClick={()=>setOverlayOpen(true)} onDragOver={event=>event.preventDefault()} onDrop={handleDrop}>
   <span className="ir-uploader__icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 14v5h14v-5"/></svg>
   </span>
   {label&&<strong>{label}</strong>}
   {hint&&<span className="ir-uploader__hint">{hint}</span>}
  </button>}
  {renderAttachmentState()}
  {renderOverlay()}
 </div>
}