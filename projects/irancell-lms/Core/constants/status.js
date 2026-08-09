export const IRANCELL_STATE_MACHINES=Object.freeze({
 request:['draft','published','offers_received','selected','booked','completed','expired','cancelled'],
 offer:['active','selected','rejected','expired','withdrawn'],
 consent:['not_required','pending','signed','expired','revoked'],
 payment:['pending','processing','held','released','failed','unknown','refunded','partially_refunded','cancelled'],
 classroom:['scheduled','waiting','ready','live','completed','cancelled','no_show','disputed'],
 complaint:['submitted','triaged','reviewing','approved','rejected','resolved'],
 verification:['draft','submitted','under_review','verified','rejected','suspended']
});
export function IrancellCanTransition(machine,from,to){
 const g={request:{draft:['published','cancelled'],published:['offers_received','expired','cancelled'],offers_received:['selected','expired','cancelled'],selected:['booked','cancelled'],booked:['completed','cancelled']},
 offer:{active:['selected','rejected','expired','withdrawn']},consent:{pending:['signed','expired','revoked'],signed:['expired','revoked']},
 payment:{pending:['processing','failed','cancelled'],processing:['held','failed','unknown','cancelled'],held:['released','refunded','partially_refunded'],failed:['processing','cancelled'],unknown:['processing','refunded','cancelled']},
 classroom:{scheduled:['waiting','cancelled'],waiting:['ready','no_show','cancelled'],ready:['live','cancelled'],live:['completed','disputed'],completed:['disputed']},
 complaint:{submitted:['triaged'],triaged:['reviewing','rejected'],reviewing:['approved','rejected'],approved:['resolved'],rejected:['resolved']},
 verification:{draft:['submitted'],submitted:['under_review'],under_review:['verified','rejected'],verified:['suspended'],rejected:['submitted'],suspended:['under_review']}};
 return Boolean(g[machine]?.[from]?.includes(to));
}
