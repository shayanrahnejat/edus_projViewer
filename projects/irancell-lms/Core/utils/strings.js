export function IrancellCreateId(prefix='id'){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;}
export function IrancellNormalizePersianText(v){return String(v||'').trim().replace(/ي/g,'ی').replace(/ك/g,'ک');}
export function IrancellMaskMobile(v){const s=String(v||'');return s.length>=7?`${s.slice(0,4)}***${s.slice(-4)}`:s;}
