export function IrancellSharedNotificationsPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const[activeFilter,setActiveFilter]=useState('all');
 const studentId=state.session.currentUserId||'student-1';

 const filters=[
  {id:'all',label:'همه'},
  {id:'unread',label:'خوانده‌نشده'},
  {id:'class',label:'کلاس‌ها'},
  {id:'course',label:'دوره‌ها'},
  {id:'achievement',label:'دستاوردها'},
  {id:'chisti',label:'چیستی'}
 ];

 function resolveCategory(item){
  const source=`${item.title||''} ${item.body||''} ${item.route||''}`.toLocaleLowerCase('fa-IR');
  if(source.includes('badge')||source.includes('certificate')||source.includes('achievement')||source.includes('نشان')||source.includes('گواهی')||source.includes('دستاورد'))return'achievement';
  if(source.includes('class')||source.includes('کلاس'))return'class';
  if(source.includes('binayi')||source.includes('course')||source.includes('دوره')||source.includes('یادگیری'))return'course';
  if(source.includes('chisti')||source.includes('ask')||source.includes('چیستی')||source.includes('سؤال'))return'chisti';
  return'account'
 }

 function categoryIcon(category){
  if(category==='class')return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2.5"/><path d="M8 3.5v4M16 3.5v4M3.5 10h17"/><path d="m9.5 15 1.7 1.7 3.7-4"/></svg>;
  if(category==='course')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H15a2 2 0 0 0-2 2v16a3 3 0 0 1 3-3h4Z"/></svg>;
  if(category==='achievement')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M9 21h6M9.5 17h5"/></svg>;
  if(category==='chisti')return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 14 9l7 3-7 3-2 7-2-7-7-3 7-3Z"/><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
 }

 function groupKey(createdAt){
  const date=new Date(createdAt||Date.now());
  const now=new Date();
  const startToday=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const startItem=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const diffDays=Math.floor((startToday-startItem)/86400000);
  if(diffDays<=0)return'today';
  if(diffDays===1)return'yesterday';
  if(diffDays<=7)return'week';
  return'older'
 }

 const storedItems=Object.values(state.notifications.itemsById||{})
  .filter(item=>!item.ownerId||item.ownerId===studentId)
  .map(item=>({...item,persisted:true,category:resolveCategory(item)}));

 const classItems=Object.values(state.classroom.sessionsById||{})
  .filter(item=>item.studentId===studentId&&['scheduled','waiting','ready'].includes(item.status))
  .slice(0,4)
  .map(item=>({
   id:`notification-class-${item.id}`,
   title:'یادآوری کلاس',
   body:`کلاس ${item.title} در برنامه شما قرار دارد.`,
   route:`student/classes/reservation/${item.id}`,
   read:false,
   createdAt:item.startAt,
   category:'class',
   persisted:false
  }));

 const courseItems=Object.entries(state.content.watchProgress||{})
  .filter(([,progress])=>Number(progress)>0&&Number(progress)<100)
  .slice(0,4)
  .map(([contentId,progress],index)=>({
   id:`notification-course-${contentId}`,
   title:'ادامه یادگیری',
   body:`${state.content.catalogueById?.[contentId]?.title||'دوره آموزشی'} را از ${IrancellFormatPersianNumber(progress)}٪ ادامه بده.`,
   route:`student/binayi/course/${contentId}`,
   read:index>0,
   createdAt:new Date(Date.now()-(index+1)*3600000).toISOString(),
   category:'course',
   persisted:false
  }));

 const allItems=[...storedItems,...classItems,...courseItems].sort((first,second)=>new Date(second.createdAt)-new Date(first.createdAt));
 const unreadItems=allItems.filter(item=>!item.read);
 const visibleItems=activeFilter==='all'?allItems:activeFilter==='unread'?unreadItems:allItems.filter(item=>item.category===activeFilter);

 const groupOrder=['today','yesterday','week','older'];
 const groupLabels={today:'امروز',yesterday:'دیروز',week:'این هفته',older:'قدیمی‌تر'};
 const groupedItems=groupOrder
  .map(key=>({key,label:groupLabels[key],items:visibleItems.filter(item=>groupKey(item.createdAt)===key)}))
  .filter(group=>group.items.length);

 function openNotification(item){
  if(item.persisted&&!item.read)dispatch({type:'IRANCELL_NOTIFICATION_READ',notificationId:item.id});
  if(item.route)onNavigate?.(item.route)
 }

 function markAllRead(){
  storedItems.filter(item=>!item.read).forEach(item=>dispatch({type:'IRANCELL_NOTIFICATION_READ',notificationId:item.id}));
 }

 const headerActions=<div className="ir-student-notifications-page__header-actions">
  {storedItems.some(item=>!item.read)&&<button type="button" className="ir-student-notifications-page__mark-all" onClick={markAllRead}>خواندن همه</button>}
  {activeFilter!=='all'&&<button type="button" className="ir-student-notifications-page__filter-reset" aria-label="پاک کردن فیلتر" onClick={()=>setActiveFilter('all')}>
   <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
  </button>}
 </div>;

 return <IrancellPageScaffold className="ir-student-notifications-page" title="اعلان‌ها" subtitle="خبرهای مهم کلاس، دوره، دستاورد و حساب شما" onBack={()=>onNavigate?.('student/profile')} actions={headerActions}>
  <IrancellFilterTabs
   items={filters.map(filter=>({
    ...filter,
    count:filter.id==='unread'?unreadItems.length:undefined
   }))}
   value={activeFilter}
   onChange={setActiveFilter}
   ariaLabel="فیلتر اعلان‌ها"
  />

  {allItems.length===0?
   <IrancellStateView title="اعلان جدیدی نداری" description="هر وقت خبر مهمی درباره کلاس، دوره یا حساب داشته باشیم اینجا بهت می‌گوییم."/>
   :visibleItems.length===0?
   <IrancellStateView
    state="empty"
    title="اعلانی با این فیلتر پیدا نشد"
    description="دسته دیگری را انتخاب کن تا اعلان‌های دیگر نمایش داده شوند."
    action={<IrancellButton variant="secondary" onClick={()=>setActiveFilter('all')}>نمایش همه اعلان‌ها</IrancellButton>}
   />
   :<div className="ir-student-notifications-page__groups">
    {groupedItems.map(group=><section className="ir-student-notifications-page__group" key={group.key}>
     <h2>{group.label}</h2>
     <div className="ir-student-notifications-page__list">
      {group.items.map(item=><button type="button" key={item.id} className={item.read?'':'is-unread'} onClick={()=>openNotification(item)}>
       <span className={`ir-student-notifications-page__icon is-${item.category}`}>{categoryIcon(item.category)}</span>
       <span className="ir-student-notifications-page__copy">
        <strong>{item.title}</strong>
        <p>{item.body}</p>
        <small>{new Date(item.createdAt).toLocaleString('fa-IR',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</small>
       </span>
       {!item.read&&<i className="ir-student-notifications-page__unread-dot" aria-label="خوانده نشده"/>}
       <span className="ir-student-notifications-page__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
       </span>
      </button>)}
     </div>
    </section>)}
   </div>}
 </IrancellPageScaffold>
}