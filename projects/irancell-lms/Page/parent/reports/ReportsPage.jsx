export function IrancellParentReportsPage({params,onNavigate}){
 const{state}=useIrancellStore();
 const parentId=state.session.currentUserId;
 const family=state.family||{};
 const children=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active').map(item=>state.identity.usersById[item.childId]).filter(Boolean);
 const[selectedChildId,setSelectedChildId]=useState(params?.child&&children.some(child=>child.id===params.child)?params.child:children[0]?.id||'');
 const child=children.find(item=>item.id===selectedChildId)||children[0]||null;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';

 if(!child)return <section dir="rtl" style={{display:'flex',minHeight:'100%',flexDirection:'column',gap:'16px',padding:'clamp(14px,3vw,28px)',background:'#FFFAE0',fontFamily:font}}><IrancellPageHeader eyebrow="خانواده" title="گزارش پیشرفت" description="گزارش آموزشی فرزندان متصل به حساب خانواده."/><IrancellStatePanel state="empty" title="فرزندی متصل نیست" description="برای مشاهده گزارش ابتدا یک دانش‌آموز را به حساب خانواده متصل کنید." action={<IrancellButton onClick={()=>onNavigate?.('parent/children')}>مدیریت فرزندان</IrancellButton>}/></section>;

 const enrollmentMap=state.content.enrollmentsByUserId?.[child.id]||{};
 const progressMap=state.content.progressByStudentId?.[child.id]||{};
 const courses=Object.keys(enrollmentMap).map(contentId=>state.content.catalogueById?.[contentId]).filter(Boolean);
 const courseRows=courses.map(content=>({content,progress:Math.max(0,Math.min(100,Number(progressMap[content.id])||0))}));
 const submissions=Object.values(state.content.assignmentSubmissionsByStudentId?.[child.id]||{}).filter(item=>enrollmentMap[item.contentId]).sort((first,second)=>new Date(second.submittedAt||0)-new Date(first.submittedAt||0));
 const assignmentsTotal=courses.length*3;
 const assignmentAverage=submissions.length?Math.round(submissions.reduce((sum,item)=>sum+(Number(item.score)||0),0)/submissions.length):0;
 const correctAssignments=submissions.filter(item=>Number(item.score)===100).length;
 const classes=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===child.id);
 const completedClasses=classes.filter(item=>item.status==='completed').length;
 const activeClasses=classes.filter(item=>!['completed','cancelled'].includes(item.status)).length;
 const attendedClasses=classes.filter(item=>Boolean(state.classroom.attendanceBySessionId?.[item.id]?.[child.id])).length;
 const progressValues=courseRows.map(item=>item.progress);
 const progress=progressValues.length?Math.round(progressValues.reduce((sum,value)=>sum+value,0)/progressValues.length):Math.max(0,Math.min(100,Number(family.childProgressById?.[child.id])||0));
 const subjectGroups=courseRows.reduce((groups,row)=>{
  const subject=row.content.subject||'عمومی';
  const group=groups[subject]||{subject,courses:0,progressTotal:0,scores:[]};
  group.courses+=1;
  group.progressTotal+=row.progress;
  submissions.filter(item=>item.contentId===row.content.id).forEach(item=>group.scores.push(Number(item.score)||0));
  groups[subject]=group;
  return groups
 },{});
 const subjectRows=Object.values(subjectGroups).map(item=>({...item,progress:Math.round(item.progressTotal/Math.max(item.courses,1)),score:item.scores.length?Math.round(item.scores.reduce((sum,value)=>sum+value,0)/item.scores.length):0}));

 return <section dir="rtl" style={{boxSizing:'border-box',display:'flex',width:'100%',minWidth:0,minHeight:'100%',flexDirection:'column',gap:'17px',padding:'clamp(14px,3vw,28px)',direction:'rtl',color:'#202024',background:'#FFFAE0',fontFamily:font}}>
  <IrancellPageHeader eyebrow="نظارت خانواده" title="گزارش واقعی پیشرفت" description="دوره‌ها، تکالیف، نمره‌ها و حضور در کلاس هر فرزند مستقیماً از فعالیت‌های ثبت‌شده محاسبه می‌شود."/>

  <IrancellCard title="دانش‌آموز فعال" subtitle="برای مشاهده گزارش یک فرزند را انتخاب کنید">
   <div style={{display:'flex',width:'100%',minWidth:0,flexWrap:'wrap',alignItems:'flex-end',gap:'10px'}}>
    <div style={{minWidth:'min(100%,240px)',flex:'1 1 280px'}}><IrancellSelect label="فرزند" value={child.id} onChange={event=>setSelectedChildId(event.target.value)} options={children.map(item=>({value:item.id,label:`${item.name} — ${item.grade||'پایه ثبت نشده'}`}))}/></div>
    <IrancellButton onClick={()=>onNavigate?.(`parent/children/${child.id}`)}>پروفایل {child.name}</IrancellButton>
   </div>
  </IrancellCard>

  <div style={{display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,170px),1fr))',gap:'11px'}}>
   <IrancellStatCard label="پیشرفت دوره‌ها" value={`${IrancellFormatPersianNumber(progress)}٪`} icon={TrendingUp}/>
   <IrancellStatCard label="میانگین نمره" value={`${IrancellFormatPersianNumber(Math.round(assignmentAverage/5))} از ۲۰`} icon={Activity}/>
   <IrancellStatCard label="تکالیف انجام‌شده" value={`${IrancellFormatPersianNumber(submissions.length)} از ${IrancellFormatPersianNumber(assignmentsTotal)}`} icon={BookOpen}/>
   <IrancellStatCard label="حضور در کلاس" value={`${IrancellFormatPersianNumber(attendedClasses)} از ${IrancellFormatPersianNumber(classes.length)}`} icon={CalendarCheck}/>
  </div>

  <div style={{display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))',alignItems:'start',gap:'14px'}}>
   <IrancellCard title="عملکرد درسی" subtitle="پیشرفت و نمره به تفکیک درس">
    <div style={{display:'grid',gap:'9px'}}>
     {subjectRows.length?subjectRows.map(item=><article key={item.subject} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',alignItems:'center',gap:'11px',padding:'12px',background:'#FAFAFB',border:'1px solid #E7E7EA',borderRadius:'13px'}}>
      <div style={{display:'flex',minWidth:0,flexDirection:'column',gap:'3px'}}><strong style={{fontFamily:font,fontSize:'12px'}}>{item.subject}</strong><small style={{color:'#777982',fontFamily:font,fontSize:'10px'}}>{IrancellFormatPersianNumber(item.courses)} دوره · پیشرفت {IrancellFormatPersianNumber(item.progress)}٪</small></div>
      <span style={{display:'grid',minWidth:'58px',height:'40px',placeItems:'center',background:'#FFF3AE',borderRadius:'11px',fontFamily:font,fontSize:'11px',fontWeight:900}}>{item.scores.length?`${IrancellFormatPersianNumber(Math.round(item.score/5))}/۲۰`:'بدون نمره'}</span>
     </article>):<IrancellStatePanel state="empty" title="هنوز دوره‌ای ثبت نشده" description="پس از ثبت‌نام دانش‌آموز، عملکرد هر درس نمایش داده می‌شود."/>}
    </div>
   </IrancellCard>

   <IrancellCard title="آخرین تکالیف" subtitle={`${IrancellFormatPersianNumber(correctAssignments)} پاسخ صحیح از ${IrancellFormatPersianNumber(submissions.length)} ارسال`}>
    <div style={{display:'grid',gap:'9px'}}>
     {submissions.length?submissions.slice(0,6).map(item=>{
      const content=state.content.catalogueById?.[item.contentId];
      return <article key={item.id} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',alignItems:'center',gap:'11px',padding:'11px',background:'#FAFAFB',border:'1px solid #E7E7EA',borderRadius:'12px'}}>
       <div style={{display:'flex',minWidth:0,flexDirection:'column',gap:'3px'}}><strong style={{fontFamily:font,fontSize:'11px'}}>{item.title}</strong><small style={{color:'#777982',fontFamily:font,fontSize:'9px'}}>{content?.subject||'درس'} · تلاش {IrancellFormatPersianNumber(item.attempts||1)}</small></div>
       <strong style={{color:Number(item.score)===100?'#21663D':'#9A3C24',fontFamily:font,fontSize:'12px'}}>{IrancellFormatPersianNumber(Math.round(Number(item.score)/5))} از ۲۰</strong>
      </article>
     }):<IrancellStatePanel state="empty" title="تکلیفی ارسال نشده" description="پس از انجام تمرین توسط دانش‌آموز، نمره و بازخورد اینجا نمایش داده می‌شود."/>}
    </div>
   </IrancellCard>
  </div>

  <IrancellCard title="کلاس‌ها و حضور" subtitle="وضعیت کلاس‌های رزروشده و برگزارشده">
   <div style={{display:'grid',width:'100%',minWidth:0,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,160px),1fr))',gap:'10px'}}>
    <div style={{padding:'13px',background:'#FFF8D1',borderRadius:'13px'}}><small style={{color:'#777982',fontFamily:font}}>کلاس فعال</small><strong style={{display:'block',marginTop:'4px',fontFamily:font,fontSize:'20px'}}>{IrancellFormatPersianNumber(activeClasses)}</strong></div>
    <div style={{padding:'13px',background:'#E9F7EE',borderRadius:'13px'}}><small style={{color:'#777982',fontFamily:font}}>کلاس تکمیل‌شده</small><strong style={{display:'block',marginTop:'4px',fontFamily:font,fontSize:'20px'}}>{IrancellFormatPersianNumber(completedClasses)}</strong></div>
    <div style={{padding:'13px',background:'#EDF6FF',borderRadius:'13px'}}><small style={{color:'#777982',fontFamily:font}}>حضور ثبت‌شده</small><strong style={{display:'block',marginTop:'4px',fontFamily:font,fontSize:'20px'}}>{IrancellFormatPersianNumber(attendedClasses)}</strong></div>
   </div>
   <div style={{display:'flex',flexWrap:'wrap',gap:'9px',marginTop:'14px'}}><IrancellButton onClick={()=>onNavigate?.('parent/classes',{child:child.id})}>مشاهده کلاس‌ها</IrancellButton><IrancellButton variant="secondary" onClick={()=>onNavigate?.('parent/payments')}>پرداخت‌ها</IrancellButton></div>
  </IrancellCard>
 </section>
}