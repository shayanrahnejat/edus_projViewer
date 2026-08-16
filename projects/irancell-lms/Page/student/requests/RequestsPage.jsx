export function IrancellStudentRequestsPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const studentId=state.session.currentUserId||'student-1';
 const student=state.identity.usersById[studentId]||{};
 const[submitted,setSubmitted]=useState(false);
 const[attachment,setAttachment]=useState(null);
 const[attachmentStatus,setAttachmentStatus]=useState('empty');
 const[form,setForm]=useState({
  subject:'',
  educationLevel:'',
  grade:'',
  topic:'',
  description:'',
  budget:'',
  preferredTime:new Date(Date.now()+86400000).toISOString().slice(0,16),
  urgency:'عادی',
  deliveryMode:'online'
 });

 const subjects=['ریاضی','فیزیک','شیمی','زبان انگلیسی','زیست‌شناسی','آمار','جبر','هندسه'];
 const educationLevels=['متوسطه اول','متوسطه دوم','دانشگاه'];
 const gradesByLevel={
  'متوسطه اول':['هفتم','هشتم','نهم'],
  'متوسطه دوم':['دهم','یازدهم','دوازدهم'],
  'دانشگاه':['کارشناسی','کارشناسی ارشد','دکتری']
 };

 const validation=submitted?IrancellValidateTeacherRequest(form):{};
 const budgetError=submitted&&form.budget&&(!Number.isFinite(Number(form.budget))||Number(form.budget)<=0)?'بودجه پیشنهادی معتبر وارد کنید.':'';
 const descriptionError=submitted&&!String(form.description||'').trim()?'توضیحات مشکل را وارد کنید.':'';

 function change(key,value){
  setForm(current=>({...current,[key]:value}))
 }

 function changeEducationLevel(value){
  setForm(current=>({...current,educationLevel:value,grade:''}))
 }


 function submit(event){
  event.preventDefault();
  setSubmitted(true);
  const requestErrors=IrancellValidateTeacherRequest(form);
  const currentDescriptionError=!String(form.description||'').trim();
  const currentBudgetError=Boolean(form.budget)&&(!Number.isFinite(Number(form.budget))||Number(form.budget)<=0);
  if(Object.keys(requestErrors).length||currentDescriptionError||currentBudgetError||attachmentStatus==='uploading'||attachmentStatus==='failed')return;
  const requestId=`request-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  dispatch(IrancellMarketplaceCreateRequest({
   ...form,
   id:requestId,
   budget:Number(form.budget)||null,
   educationLevel:form.educationLevel,
   attachmentName:attachment?.name||'',
   attachmentType:attachment?.type||'',
   attachmentSize:Number(attachment?.size)||0,
   studentName:student.name||''
  },studentId));
  onNavigate?.(`student/offers?request=${requestId}`)
 }

 return <section className="ir-new-class-request" aria-label="ثبت درخواست جدید">
  <header className="ir-new-class-request__header">
   <button type="button" className="ir-new-class-request__back" aria-label="بازگشت به کلاس‌ها" onClick={()=>onNavigate?.('student/classes')}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m10 7-5 5 5 5"/></svg>
   </button>
   <div>
    <h1>ثبت درخواست جدید</h1>
    <p>مشکل یا سوال درسی خود را ثبت کنید</p>
   </div>
  </header>

  <form className="ir-new-class-request__form" onSubmit={submit} noValidate>
   <section className="ir-new-class-request__card">
    <label className="ir-new-class-request__field is-full">
     <strong>موضوع درسی</strong>
     <span className={`ir-new-class-request__select ${validation.subject?'has-error':''}`}>
      <select value={form.subject} onChange={event=>change('subject',event.target.value)}>
       <option value="">انتخاب کنید (ریاضی، فیزیک...)</option>
       {subjects.map(subject=><option value={subject} key={subject}>{subject}</option>)}
      </select>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
     </span>
     {validation.subject&&<small className="ir-new-class-request__error">{validation.subject}</small>}
    </label>

    <div className="ir-new-class-request__two-columns">
     <label className="ir-new-class-request__field">
      <strong>مقطع تحصیلی</strong>
      <span className={`ir-new-class-request__select ${submitted&&!form.educationLevel?'has-error':''}`}>
       <select value={form.educationLevel} onChange={event=>changeEducationLevel(event.target.value)}>
        <option value="">انتخاب کنید...</option>
        {educationLevels.map(level=><option value={level} key={level}>{level}</option>)}
       </select>
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
      </span>
      {submitted&&!form.educationLevel&&<small className="ir-new-class-request__error">مقطع تحصیلی را انتخاب کنید.</small>}
     </label>

     <label className="ir-new-class-request__field">
      <strong>پایه تحصیلی</strong>
      <span className={`ir-new-class-request__select ${validation.grade?'has-error':''}`}>
       <select value={form.grade} disabled={!form.educationLevel} onChange={event=>change('grade',event.target.value)}>
        <option value="">{form.educationLevel?'مثلاً: دهم':'ابتدا مقطع را انتخاب کنید'}</option>
        {(gradesByLevel[form.educationLevel]||[]).map(grade=><option value={grade} key={grade}>{grade}</option>)}
       </select>
       <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
      </span>
      {validation.grade&&<small className="ir-new-class-request__error">{validation.grade}</small>}
     </label>
    </div>

    <label className="ir-new-class-request__field is-full">
     <strong>عنوان مشکل درسی</strong>
     <span className={`ir-new-class-request__input ${validation.topic?'has-error':''}`}>
      <input value={form.topic} onChange={event=>change('topic',event.target.value)} placeholder="مثلاً: حل معادله دیفرانسیل درجه دوم"/>
     </span>
     {validation.topic&&<small className="ir-new-class-request__error">{validation.topic}</small>}
    </label>

    <label className="ir-new-class-request__field is-full">
     <strong>توضیحات</strong>
     <span className={`ir-new-class-request__textarea ${descriptionError?'has-error':''}`}>
      <textarea value={form.description} onChange={event=>change('description',event.target.value)} rows={5} placeholder="مشکل درسی خود را به طور کامل شرح دهید تا مدرسان بهتر بتوانند به شما کمک کنند"/>
     </span>
     {descriptionError&&<small className="ir-new-class-request__error">{descriptionError}</small>}
    </label>

    <div className="ir-new-class-request__attachment">
     <strong>افزودن تصویر یا فایل</strong>
     <IrancellSimpleFileUploader
      label=""
      hint="عکس از تمرین، جزوه یا سوال خود بارگذاری کنید"
      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
      maxSizeMb={15}
      onChange={setAttachment}
      onStatusChange={setAttachmentStatus}
     />
     {attachmentStatus==='uploading'&&<small className="ir-new-class-request__attachment-help">بعد از تکمیل بارگذاری می‌توانید درخواست را ثبت کنید.</small>}
    </div>
   </section>

   <section className="ir-new-class-request__budget-card">
    <label className="ir-new-class-request__field is-full">
     <strong>بودجه پیشنهادی (تومان)</strong>
     <span className={`ir-new-class-request__budget ${budgetError?'has-error':''}`}>
      <input type="number" inputMode="numeric" min="0" step="10000" value={form.budget} onChange={event=>change('budget',event.target.value)} placeholder="اختیاری؛ آموزشگاه قیمت نهایی را پیشنهاد می‌دهد"/>
      <b>تومان</b>
     </span>
     {budgetError&&<small className="ir-new-class-request__error">{budgetError}</small>}
     <small className="ir-new-class-request__attachment-help">بودجه فقط برای راهنمایی ارائه‌دهنده است؛ هر آموزشگاه قیمت، مدرس و شرایط خودش را ارسال می‌کند.</small>
    </label>
    <div className="ir-new-class-request__two-columns">
     <label className="ir-new-class-request__field">
      <strong>زمان ترجیحی</strong>
      <span className={`ir-new-class-request__input ${validation.preferredTime?'has-error':''}`}><input type="datetime-local" value={form.preferredTime} onChange={event=>change('preferredTime',event.target.value)}/></span>
      {validation.preferredTime&&<small className="ir-new-class-request__error">{validation.preferredTime}</small>}
     </label>
     <label className="ir-new-class-request__field">
      <strong>فوریت</strong>
      <span className={`ir-new-class-request__select ${validation.urgency?'has-error':''}`}><select value={form.urgency} onChange={event=>change('urgency',event.target.value)}><option value="عادی">عادی</option><option value="فوری">فوری</option><option value="این هفته">این هفته</option></select><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></span>
     </label>
    </div>
    <label className="ir-new-class-request__field is-full">
     <strong>شیوه برگزاری</strong>
     <span className="ir-new-class-request__select"><select value={form.deliveryMode} onChange={event=>change('deliveryMode',event.target.value)}><option value="online">آنلاین</option><option value="inperson">حضوری</option><option value="either">فرقی ندارد</option></select><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></span>
    </label>
   </section>

   <button type="submit" className="ir-new-class-request__submit">ثبت درخواست</button>
  </form>
 </section>
}
