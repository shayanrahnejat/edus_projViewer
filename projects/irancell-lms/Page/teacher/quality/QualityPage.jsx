export function IrancellTeacherQualityPage(){
 const{state}=useIrancellStore();
 const teacherId=state.session.currentUserId;
 const sessions=Object.values(state.classroom.sessionsById||{}).filter(item=>item.providerId===teacherId);
 const sessionIds=new Set(sessions.map(item=>item.id));
 const ratings=Object.values(state.quality.ratingsById||{}).filter(item=>item.providerId===teacherId||sessionIds.has(item.sessionId));
 const complaints=Object.values(state.quality.complaintsById||{}).filter(item=>sessionIds.has(item.sessionId));
 const average=ratings.length?ratings.reduce((sum,item)=>sum+(Number(item.score)||0),0)/ratings.length:0;
 const qualityScore=Number(state.quality.qualityScoresByProviderId?.[teacherId])||0;
 return <>
  <IrancellPageHeader eyebrow="کیفیت مدرس" title="کیفیت تدریس" description="امتیازها، حضور، شکایت‌ها و شاخص کیفیت حساب مدرس."/>
  <div className="ir-stats-grid"><IrancellStatCard label="شاخص کیفیت" value={`${IrancellFormatPersianNumber(qualityScore)}٪`}/><IrancellStatCard label="میانگین امتیاز" value={average?average.toLocaleString('fa-IR',{maximumFractionDigits:1}):'—'}/><IrancellStatCard label="کلاس تکمیل‌شده" value={IrancellFormatPersianNumber(sessions.filter(item=>item.status==='completed').length)}/><IrancellStatCard label="شکایت ثبت‌شده" value={IrancellFormatPersianNumber(complaints.length)}/></div>
  {ratings.length?<IrancellCard title="نظرهای اخیر">{ratings.slice().reverse().map(item=><article className="ir-list-row" key={item.id}><div><strong>{IrancellFormatPersianNumber(item.score)} از ۵</strong><small>{item.comment||'بدون توضیح'} · {new Date(item.createdAt).toLocaleDateString('fa-IR')}</small></div></article>)}</IrancellCard>:<IrancellStatePanel state="empty" title="هنوز امتیازی ثبت نشده است" description="پس از پایان کلاس، ارزیابی دانش‌آموزان در این بخش نمایش داده می‌شود."/>}
 </>
}