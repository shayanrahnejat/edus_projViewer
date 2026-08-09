export function IrancellPageParentChildrenNormalizeRouteParams(params){return Object.fromEntries(Object.entries(params||{}).map(([key,value])=>[key,String(value??'').trim()]))}
