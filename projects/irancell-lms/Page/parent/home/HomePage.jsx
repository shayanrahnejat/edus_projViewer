export function IrancellParentHomePage({onNavigate}){
 const{state}=useIrancellStore();
 const parentId=state.session.currentUserId||'parent-1';
 const parent=state.identity.usersById[parentId]||{name:'خانواده'};
 const relationships=Object.values(state.identity.relationshipsById||{}).filter(item=>item.parentId===parentId&&item.status==='active');
 const children=relationships.map(item=>state.identity.usersById[item.childId]).filter(Boolean);
 const family=state.family||{};
 const progressByChild=family.childProgressById||{};
 const classCountByChild=family.activeClassCountByChildId||{};
 const pendingPayments=Object.values(family.pendingPaymentsById||{}).filter(item=>item.parentId===parentId&&item.status==='pending');
 const pendingConsents=Object.values(state.consent.documentsById||{}).filter(item=>item.parentId===parentId&&item.status==='pending');
 const notifications=Object.values(family.notificationItemsById||{}).filter(item=>item.parentId===parentId&&!item.read);
 const activeClassCount=children.reduce((sum,child)=>sum+(Number(classCountByChild[child.id])||0),0);
 const averageProgress=children.length?Math.round(children.reduce((sum,child)=>sum+(Number(progressByChild[child.id])||0),0)/children.length):0;
 const parentFirstName=String(parent.name||'').split(/\s+/).slice(-1)[0]||parent.name;
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,220px),1fr))',gap:'14px'};
 const iconBox={display:'grid',width:'46px',height:'46px',placeItems:'center',flex:'0 0 46px',color:'#202024',background:'#FFF3AE',borderRadius:'15px'};

 return <IrancellPageScaffold style={{padding:'clamp(16px,3vw,30px)',background:'#FFF9DF'}}>
  <IrancellPageHeader eyebrow="پنل خانواده" title={`سلام ${parentFirstName}، وضعیت خانواده آماده است`} description="پیشرفت تحصیلی، کلاس‌ها، پرداخت‌ها و مجوزهای فرزندان را از یک محل مدیریت کنید." actions={<IrancellButton variant="secondary" icon={Bell} onClick={()=>onNavigate?.('parent/profile/notifications')}>{notifications.length?`${IrancellFormatPersianNumber(notifications.length)} اعلان جدید`:'اعلان‌ها'}</IrancellButton>}/>

  <div style={{...grid,marginBottom:'18px'}}>
   <IrancellStatCard icon={UsersRound} label="دانش‌آموز متصل" value={IrancellFormatPersianNumber(children.length)}/>
   <IrancellStatCard icon={CalendarCheck} label="کلاس فعال" value={IrancellFormatPersianNumber(activeClassCount)} tone="info"/>
   <IrancellStatCard icon={TrendingUp} label="میانگین پیشرفت" value={`${IrancellFormatPersianNumber(averageProgress)}٪`} tone="success"/>
   <IrancellStatCard icon={WalletCards} label="نیازمند تأیید شما" value={IrancellFormatPersianNumber(pendingPayments.length+pendingConsents.length)} tone={pendingPayments.length+pendingConsents.length?'warning':'success'}/>
  </div>

  <IrancellCard title="فرزندان شما" subtitle="خلاصه زنده مسیر یادگیری هر دانش‌آموز" action={<IrancellButton size="sm" onClick={()=>onNavigate?.('parent/children',{add:'1'})}>افزودن دانش‌آموز</IrancellButton>}>
   {children.length?<div style={grid}>{children.map(child=>{
    const progress=Math.max(0,Math.min(100,Number(progressByChild[child.id])||0));
    return <article key={child.id} style={{display:'flex',minWidth:0,flexDirection:'column',gap:'13px',padding:'17px',background:'#FFFDF2',border:'1px solid #E8E1C7',borderRadius:'18px',fontFamily:font}}>
     <div style={{display:'flex',minWidth:0,alignItems:'center',gap:'11px'}}><span style={iconBox}><UserRound size={22}/></span><div style={{minWidth:0}}><strong style={{display:'block',fontSize:'14px',fontWeight:900}}>{child.name}</strong><small style={{color:'#777982',fontSize:'11px'}}>{child.grade||'پایه ثبت نشده'}</small></div></div>
     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px',fontSize:'11px'}}><span style={{color:'#777982'}}>پیشرفت یادگیری</span><b>{IrancellFormatPersianNumber(progress)}٪</b></div>
     <div aria-label={`پیشرفت ${progress} درصد`} style={{height:'8px',overflow:'hidden',background:'#E8E8EC',borderRadius:'999px'}}><span style={{display:'block',width:`${progress}%`,height:'100%',background:'#FFD100',borderRadius:'inherit'}}/></div>
     <small style={{color:'#676870',fontSize:'10px'}}>{IrancellFormatPersianNumber(classCountByChild[child.id]||0)} کلاس فعال</small>
     <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}><IrancellButton size="sm" onClick={()=>onNavigate?.(`parent/children/${child.id}`)}>مشاهده پروفایل</IrancellButton><IrancellButton size="sm" variant="secondary" onClick={()=>onNavigate?.('parent/reports',{child:child.id})}>گزارش کامل</IrancellButton></div>
    </article>
   })}</div>:<IrancellStatePanel state="empty" title="هنوز دانش‌آموزی متصل نشده است" description="برای شروع مدیریت آموزشی، پروفایل دانش‌آموز را به حساب خانواده اضافه کنید." action={<IrancellButton onClick={()=>onNavigate?.('parent/children',{add:'1'})}>افزودن دانش‌آموز</IrancellButton>}/>}
  </IrancellCard>

  {(pendingPayments.length>0||pendingConsents.length>0)&&<IrancellCard title="نیازمند اقدام" subtitle="رضایت‌نامه و پرداخت کلاس‌هایی که دانش‌آموز از بازار انتخاب کرده است" style={{marginTop:'16px'}}>
   <div style={{display:'grid',gap:'10px'}}>
    {pendingConsents.slice(0,3).map(item=>{const child=state.identity.usersById?.[item.childId];const session=state.classroom.sessionsById?.[item.sessionId];return <article key={item.id} style={{display:'flex',minWidth:0,flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'14px',background:'#FFF1E8',border:'1px solid #F0C6A8',borderRadius:'15px'}}><div style={{minWidth:0,flex:'1 1 240px'}}><strong style={{display:'block',fontSize:'13px',fontWeight:900}}>رضایت‌نامه {child?.name||'دانش‌آموز'}</strong><small style={{color:'#81512F',fontSize:'10px'}}>{session?.title||'کلاس انتخاب‌شده'}</small></div><IrancellButton size="sm" onClick={()=>onNavigate?.(`consent/${item.id}`)}>بررسی و امضا</IrancellButton></article>})}
    {pendingPayments.slice(0,3).map(item=><article key={item.id} style={{display:'flex',minWidth:0,flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'12px',padding:'14px',background:'#FFF7CE',border:'1px solid #EDD365',borderRadius:'15px'}}><div style={{minWidth:0,flex:'1 1 240px'}}><strong style={{display:'block',fontSize:'13px',fontWeight:900}}>{item.title}</strong><small style={{color:'#765F00',fontSize:'10px'}}>{IrancellFormatPersianNumber(item.amount)} تومان</small></div><IrancellButton size="sm" onClick={()=>onNavigate?.(`payment/${item.orderId}`)}>بررسی و پرداخت</IrancellButton></article>)}
   </div>
  </IrancellCard>}

  <IrancellCard title="دسترسی سریع" style={{marginTop:'16px'}}>
   <div style={grid}>{[
    {label:'کلاس‌های فرزندان',description:'برنامه و ورود به کلاس',icon:CalendarCheck,route:'parent/classes'},
    {label:'گزارش پیشرفت',description:'نمره، تکلیف و آمار',icon:Activity,route:'parent/reports'},
    {label:'رضایت‌نامه‌ها',description:'بررسی و امضای امن',icon:ShieldCheck,route:'parent/consents'},
    {label:'پرداخت‌ها',description:'کیف پول و فاکتورها',icon:WalletCards,route:'parent/payments'}
   ].map(item=>{const Icon=item.icon;return <button type="button" key={item.route} onClick={()=>onNavigate?.(item.route)} style={{display:'flex',minWidth:0,alignItems:'center',gap:'12px',padding:'15px',cursor:'pointer',textAlign:'right',color:'#202024',background:'#FFFFFF',border:'1px solid #E5DEC1',borderRadius:'17px',boxShadow:'0 8px 20px rgba(62,52,12,.05)',fontFamily:font}}><span style={iconBox}><Icon size={22}/></span><span style={{display:'flex',minWidth:0,flexDirection:'column',gap:'2px'}}><strong style={{fontSize:'13px',fontWeight:900}}>{item.label}</strong><small style={{color:'#777982',fontSize:'10px'}}>{item.description}</small></span></button>})}</div>
  </IrancellCard>
 </IrancellPageScaffold>
}