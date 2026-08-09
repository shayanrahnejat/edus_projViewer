export function IrancellPageSharedClassNormalizeRouteParams(params){return Object.fromEntries(Object.entries(params||{}).map(([key,value])=>[key,String(value??'').trim()]))}
