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
 function categoryIcon(category){const Icon=category==='class'?CalendarCheck:category==='course'?BookOpen:category==='achievement'?Activity:category==='chisti'?BrainCircuit:ShieldCheck;return <Icon size={22}/>}
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
 const storedItems=Object.values(state.notifications.itemsById||{}).filter(item=>!item.ownerId||item.ownerId===studentId).map(item=>({...item,persisted:true,category:resolveCategory(item)}));
 const classItems=Object.values(state.classroom.sessionsById||{}).filter(item=>item.studentId===studentId&&['scheduled','waiting','ready'].includes(item.status)).slice(0,4).map(item=>({id:`notification-class-${item.id}`,title:'یادآوری کلاس',body:`کلاس ${item.title} در برنامه شما قرار دارد.`,route:`student/classes/reservation/${item.id}`,read:false,createdAt:item.startAt,category:'class',persisted:false}));
 const courseItems=Object.entries(state.content.watchProgress||{}).filter(([,progress])=>Number(progress)>0&&Number(progress)<100).slice(0,4).map(([contentId,progress],index)=>({id:`notification-course-${contentId}`,title:'ادامه یادگیری',body:`${state.content.catalogueById?.[contentId]?.title||'دوره آموزشی'} را از ${IrancellFormatPersianNumber(progress)}٪ ادامه بده.`,route:`student/binayi/course/${contentId}`,read:index>0,createdAt:new Date(Date.now()-(index+1)*3600000).toISOString(),category:'course',persisted:false}));
 const allItems=[...storedItems,...classItems,...courseItems].sort((first,second)=>new Date(second.createdAt)-new Date(first.createdAt));
 const visibleItems=activeFilter==='all'?allItems:activeFilter==='unread'?allItems.filter(item=>!item.read):allItems.filter(item=>item.category===activeFilter);
 const groupOrder=['today','yesterday','week','older'];
 const groupLabels={today:'امروز',yesterday:'دیروز',week:'این هفته',older:'قدیمی‌تر'};
 const groupedItems=groupOrder.map(key=>({key,label:groupLabels[key],items:visibleItems.filter(item=>groupKey(item.createdAt)===key)})).filter(group=>group.items.length);
 function openNotification(item){if(item.persisted&&!item.read)dispatch({type:'IRANCELL_NOTIFICATION_READ',notificationId:item.id});if(item.route)onNavigate?.(item.route)}
 return <IrancellPageScaffold className="ir-student-notifications-page" title="اعلان‌ها" subtitle="خبرهای مهم کلاس، دوره، دستاورد و حساب شما" onBack={()=>onNavigate?.('student/profile')} actions={<button type="button" className="ir-student-notifications-page__filter-reset" aria-label="پاک کردن فیلتر" onClick={()=>setActiveFilter('all')}><span className="material-symbols-outlined" aria-hidden="true">filter_list</span></button>}>
  <IrancellFilterTabs items={filters.map(filter=>({...filter,count:filter.id==='unread'?allItems.filter(item=>!item.read).length:undefined}))} value={activeFilter} onChange={setActiveFilter} ariaLabel="فیلتر اعلان‌ها"/>
  {allItems.length===0?<IrancellStateView title="اعلان جدیدی نداری" description="هر وقت خبر مهمی درباره کلاس، دوره یا حساب داشته باشیم اینجا بهت می‌گوییم."/>:visibleItems.length===0?<IrancellStateView state="empty" title="اعلانی با این فیلتر پیدا نشد" description="دسته دیگری را انتخاب کن تا اعلان‌های دیگر نمایش داده شوند." action={<IrancellButton variant="secondary" onClick={()=>setActiveFilter('all')}>نمایش همه اعلان‌ها</IrancellButton>}/>:<div className="ir-student-notifications-page__groups">{groupedItems.map(group=><section className="ir-student-notifications-page__group" key={group.key}><h2>{group.label}</h2><div className="ir-student-notifications-page__list">{group.items.map(item=><button type="button" key={item.id} className={item.read?'':'is-unread'} onClick={()=>openNotification(item)}><span className={`ir-student-notifications-page__icon is-${item.category}`}>{categoryIcon(item.category)}</span><span className="ir-student-notifications-page__copy"><strong>{item.title}</strong><p>{item.body}</p><small>{new Date(item.createdAt).toLocaleString('fa-IR',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</small></span>{!item.read&&<i aria-label="خوانده نشده"/>}<span className="material-symbols-outlined ir-student-notifications-page__arrow" aria-hidden="true">chevron_left</span></button>)}</div></section>)}</div>}
 </IrancellPageScaffold>
}