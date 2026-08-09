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
 const activeClassCount=children.reduce((sum,child)=>sum+(Number(classCountByChild[child.id])||0),0);
 const featuredChild=children[0]||null;
 const featuredProgress=featuredChild?Number(progressByChild[featuredChild.id])||0:0;
 const parentFirstName=String(parent.name||'').split(/\s+/).slice(-1)[0]||parent.name;

 return <section className="ir-family-home">
  <header className="ir-family-home__header">
   <button type="button" className="ir-family-home__avatar" aria-label="پروفایل خانواده" onClick={()=>onNavigate?.('parent/profile')}><span>{String(parent.name||'خ').trim().charAt(0)}</span></button>
   <div>
    <small>سلام، خوش آمدید</small>
    <strong>آقای {parentFirstName}</strong>
   </div>
  </header>

  <div className="ir-family-home__title-row">
   <h1>مدیریت خانواده</h1>
   <span>حساب تأیید شده</span>
  </div>

  <section className="ir-family-home__summary">
   <h2>خانواده شما</h2>
   <div>
    <article><strong>{IrancellFormatPersianNumber(children.length)}</strong><span>تعداد دانش‌آموزان</span></article>
    <article><strong>{IrancellFormatPersianNumber(activeClassCount)}</strong><span>کلاس‌های فعال</span></article>
    <article><strong>{IrancellFormatPersianNumber(pendingPayments.length)}</strong><span>پرداخت‌های در انتظار</span></article>
   </div>
   <button type="button" onClick={()=>onNavigate?.('parent/children',{add:'1'})}>افزودن دانش‌آموز +</button>
  </section>

  <section className="ir-family-home__children">
   <header><h2>فرزندان / دانش‌آموزان</h2><button type="button" onClick={()=>onNavigate?.('parent/children')}>مشاهده همه</button></header>
   {featuredChild?<article className="ir-family-home__child-card">
    <div className="ir-family-home__child-heading">
     <span>{String(featuredChild.name||'د').trim().charAt(0)}</span>
     <div><strong>{featuredChild.name}</strong><small>{featuredChild.grade||'پایه ثبت نشده'}</small></div>
    </div>
    <div className="ir-family-home__progress-copy"><span>پیشرفت یادگیری</span><strong>{IrancellFormatPersianNumber(featuredProgress)}٪</strong></div>
    <div className="ir-family-home__progress"><span style={{width:`${Math.max(0,Math.min(100,featuredProgress))}%`}}/></div>
    <p>کلاس‌های فعال: {IrancellFormatPersianNumber(classCountByChild[featuredChild.id]||0)}</p>
    <button type="button" onClick={()=>onNavigate?.(`parent/children/${featuredChild.id}`)}>ورود به پروفایل دانش‌آموز</button>
   </article>:<div className="ir-family-home__empty"><strong>هنوز دانش‌آموزی متصل نشده است</strong><button type="button" onClick={()=>onNavigate?.('parent/children',{add:'1'})}>افزودن دانش‌آموز</button></div>}
  </section>

  <section className="ir-family-home__quick">
   <h2>دسترسی سریع</h2>
   <div>
    <button type="button" onClick={()=>onNavigate?.('parent/payments')}><span>▣</span><strong>پرداخت‌ها</strong></button>
    <button type="button" onClick={()=>onNavigate?.('parent/classes')}><span>□</span><strong>رزرو کلاس</strong></button>
    <button type="button" onClick={()=>onNavigate?.('parent/reports')}><span>☷</span><strong>گزارش پیشرفت</strong></button>
    <button type="button" onClick={()=>onNavigate?.('parent/profile/permissions')}><span>▱</span><strong>مجوزها</strong></button>
   </div>
  </section>
 </section>
}