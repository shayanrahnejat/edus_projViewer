export function IrancellAcademyProfilePage({params,onNavigate}){
 const{state}=useIrancellStore();
 const sessionProvider=state.marketplace.providersById?.[state.session.currentUserId]||null;
 const academyProvider=Object.values(state.marketplace.providersById||{}).find(provider=>provider.type==='academy')||null;
 const academyId=sessionProvider?.type==='academy'?sessionProvider.id:academyProvider?.id||'academy-2';
 const previewParams={...(params||{}),provider:academyId};

 function IrancellAcademyProfileNavigateFromPreview(target){
  const rawTarget=String(target||'');
  if(rawTarget.startsWith('student/requests'))return onNavigate?.(rawTarget.replace(/^student\/requests/,'academy/requests'));
  if(rawTarget.startsWith('student/offers'))return onNavigate?.(rawTarget.replace(/^student\/offers/,'academy/offers'));
  if(rawTarget==='student/classes'||rawTarget==='student/classes/providers')return onNavigate?.('academy/classes');
  if(rawTarget.startsWith('student/binayi'))return onNavigate?.('academy/profile',{section:'media'});
  return onNavigate?.(rawTarget||'academy/home')
 }

 return <IrancellStudentTeachersPage params={previewParams} onNavigate={IrancellAcademyProfileNavigateFromPreview}/>
}