function IrancellComponentRuntimeIcon({glyph,size=20,className='',style,...props}){return React.createElement('span',{...props,className:`material-symbols-outlined ir-icon ${className}`.trim(),style:{...style,fontFamily:'"Material Symbols Outlined"',fontSize:`${size}px`,width:`${size}px`,height:`${size}px`,lineHeight:`${size}px`,display:'inline-flex',alignItems:'center',justifyContent:'center',fontVariationSettings:"'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24"},'aria-hidden':true},glyph)}
export function Activity(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'monitoring'});}
export function AlertTriangle(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'warning'});}
export function ArrowLeft(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'arrow_back'});}
export function Bell(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'notifications'});}
export function BookOpen(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'menu_book'});}
export function BrainCircuit(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'psychology'});}
export function Building2(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'apartment'});}
export function CalendarCheck(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'event_available'});}
export function CalendarDays(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'calendar_month'});}
export function CheckCircle2(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'check_circle'});}
export function Clapperboard(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'movie'});}
export function Clock3(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'schedule'});}
export function Construction(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'construction'});}
export function GraduationCap(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'school'});}
export function Home(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'home'});}
export function Inbox(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'inbox'});}
export function LoaderCircle(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'progress_activity'});}
export function LockKeyhole(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'lock'});}
export function LogOut(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'logout'});}
export function Menu(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'menu'});}
export function PlayCircle(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'play_circle'});}
export function RefreshCw(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'refresh'});}
export function Search(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'search'});}
export function ShieldCheck(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'verified_user'});}
export function Sparkles(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'auto_awesome'});}
export function Star(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'star'});}
export function TrendingUp(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'trending_up'});}
export function UploadCloud(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'cloud_upload'});}
export function UserRound(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'person'});}
export function UserRoundCheck(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'how_to_reg'});}
export function Users(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'group'});}
export function UsersRound(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'groups'});}
export function WalletCards(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'account_balance_wallet'});}
export function X(props){return React.createElement(IrancellComponentRuntimeIcon,{...props,glyph:'close'});}

const IRANCELL_COMPONENT_STATUS_LABELS={draft:'پیش‌نویس',published:'در انتظار پیشنهاد',offers_received:'پیشنهاد دریافت شده',selected:'انتخاب شده',booked:'رزرو شده',completed:'تکمیل شده',pending:'در انتظار',signed:'تأیید شده',held:'پرداخت امن',released:'تسویه شده',refunded:'بازگشت وجه',failed:'ناموفق',scheduled:'زمان‌بندی شده',waiting:'اتاق انتظار',ready:'آماده',live:'در حال برگزاری',submitted:'ثبت شده',reviewing:'در حال بررسی',approved:'تأیید شده',rejected:'رد شده',resolved:'حل شده',verified:'تأیید شده',under_review:'در حال بررسی',suspended:'تعلیق شده',active:'فعال',incomplete:'تکمیل نشده',paused:'متوقف',withdrawn:'لغو شده',cancelled:'لغو شده'};
export function IrancellBadge({children,tone='neutral',className='',style}){const tones={neutral:{color:'#55565D',background:'#F1F1F3',borderColor:'#DEDEE2'},success:{color:'#15733B',background:'#E9F8EF',borderColor:'#BCE9CC'},danger:{color:'#A12828',background:'#FFF0F0',borderColor:'#F2CACA'},warning:{color:'#775D00',background:'#FFF7CF',borderColor:'#F0D55E'},info:{color:'#3C4B84',background:'#EEF1FF',borderColor:'#CDD5FF'}};return <span className={className||undefined} style={{boxSizing:'border-box',display:'inline-flex',minHeight:26,alignItems:'center',justifyContent:'center',gap:5,padding:'4px 9px',direction:'rtl',color:'#55565D',background:'#F1F1F3',border:'1px solid #DEDEE2',borderRadius:999,fontFamily:'"Vazirmatn", Tahoma, Arial, sans-serif',fontSize:10,fontWeight:800,lineHeight:1.5,whiteSpace:'nowrap',...(tones[tone]||tones.neutral),...style}}>{children}</span>}
export function IrancellStatusBadge({status}){const tone=['signed','held','released','refunded','completed','verified','approved','active'].includes(status)?'success':['failed','rejected','suspended','cancelled'].includes(status)?'danger':['pending','scheduled','under_review','reviewing','submitted'].includes(status)?'warning':'info';return <IrancellBadge tone={tone}>{IRANCELL_COMPONENT_STATUS_LABELS[status]||status||'نامشخص'}</IrancellBadge>}