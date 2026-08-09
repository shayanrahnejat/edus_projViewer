const IRANCELL_PAGE_ROLE_CARDS=Object.freeze([
 {id:'family',roles:['student','parent'],label:'خانواده + دانش‌آموز',description:'مدیریت یادگیری و پیگیری تحصیلی',Icon:UsersRound},
 {id:'academy',roles:['academy'],label:'آموزشگاه',description:'مدیریت کلاس‌ها و اساتید مجموعه',Icon:Building2},
 {id:'freelance',roles:['teacher','content-provider'],label:'معلم آزاد / خصوصی',description:'تدریس مستقل و مدیریت شاگردان',Icon:UserRound}
]);
export function IrancellIdentityRoleSelectPage({onNavigate}){
 const{state,dispatch}=useIrancellStore();
 const allowedRoles=Array.isArray(state.session.availableRoles)?state.session.availableRoles:[];
 const[selectedRole,setSelectedRole]=useState(allowedRoles[0]||'');
 function resolveRole(card){return card.roles.find(role=>allowedRoles.includes(role))||''}
 function continueFlow(){if(!selectedRole)return;dispatch(IrancellAuthSelectRole(selectedRole));onNavigate(state.session.requiresOnboarding?'profile-completion':IRANCELL_ROLE_HOME_ROUTES[selectedRole]||'student/home')}
 if(!['role_pending','authenticated'].includes(state.session.status))return <div className="ir-auth-center"><IrancellStatePanel state="unauthorized" title="ورود کامل نشده است" description="ابتدا اطلاعات ورود یا کد یک‌بارمصرف را تأیید کنید." action={<IrancellButton onClick={()=>onNavigate('auth/login')}>بازگشت به ورود</IrancellButton>}/></div>;
 return <IrancellIdentityFrame className="ir-role-selection-reference"><section className="ir-role-selection-reference__panel"><IrancellBrandMark className="ir-role-selection-reference__brand"/><header><h1>نقش‌های خود را انتخاب کنید</h1><p>برای شخصی‌سازی تجربه شما، لطفاً نقش خود را در سیستم آموزشی انتخاب کنید.</p></header><div className="ir-role-selection-reference__list">{IRANCELL_PAGE_ROLE_CARDS.map(card=>{const role=resolveRole(card),selected=Boolean(role&&selectedRole===role),CardIcon=card.Icon;return <button key={card.id} type="button" className={`${selected?'is-selected':''} ${role?'':'is-disabled'}`} disabled={!role} aria-pressed={selected} onClick={()=>setSelectedRole(role)}><span className="ir-role-selection-reference__icon"><CardIcon size={24}/></span><span><strong>{card.label}</strong><small>{card.description}</small></span><i aria-hidden="true">{selected?'✓':''}</i></button>})}</div><button type="button" className="ir-role-selection-reference__continue" disabled={!selectedRole} onClick={continueFlow}>ادامه</button><footer><span>قبلاً ثبت‌نام کرده‌اید؟</span><button type="button" onClick={()=>onNavigate('auth/login')}>ورود</button></footer></section></IrancellIdentityFrame>
}
