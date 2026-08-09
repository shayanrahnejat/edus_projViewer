export function IrancellFormatMoney(v){return new Intl.NumberFormat('fa-IR').format(Number(v||0))+' تومان';}
export function IrancellFormatNumber(v){return new Intl.NumberFormat('fa-IR').format(Number(v||0));}
export function IrancellFormatPercent(v){return new Intl.NumberFormat('fa-IR',{maximumFractionDigits:1}).format(Number(v||0))+'٪';}
export function IrancellFormatCurrency(value){return IrancellFormatMoney(value);}
export function IrancellFormatPersianNumber(value){return IrancellFormatNumber(value);}
