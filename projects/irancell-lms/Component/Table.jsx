export function IrancellTable({columns=[],rows=[],emptyText='داده‌ای برای نمایش وجود ندارد.',caption='',rowKey='id'}){
 const safeColumns=Array.isArray(columns)?columns.filter(column=>column&&column.key):[];
 const safeRows=Array.isArray(rows)?rows:[];
 const font='"Vazirmatn", Tahoma, Arial, sans-serif';
 const cellStyle={boxSizing:'border-box',padding:'13px 15px',textAlign:'right',verticalAlign:'middle',borderBottom:'1px solid #ECE8D7',fontFamily:font,fontSize:'12px',lineHeight:1.7};
 return <div role="region" aria-label={caption||'جدول اطلاعات'} tabIndex="0" dir="rtl" style={{boxSizing:'border-box',display:'block',width:'100%',minWidth:0,maxWidth:'none',margin:0,overflowX:'auto',overscrollBehaviorX:'contain',background:'#FFFFFF',border:'1px solid #E7E2CC',borderRadius:'18px',boxShadow:'0 8px 24px rgba(62,52,12,.05)',outlineOffset:'3px',fontFamily:font}}>
  <table style={{boxSizing:'border-box',width:'100%',minWidth:'680px',borderCollapse:'separate',borderSpacing:0,direction:'rtl',color:'#202024',background:'#FFFFFF',fontFamily:font}}>
   {caption&&<caption style={{padding:'13px 15px',textAlign:'right',color:'#5F6067',fontFamily:font,fontSize:'11px',fontWeight:800}}>{caption}</caption>}
   <thead><tr>{safeColumns.map(column=><th key={column.key} scope="col" style={{...cellStyle,color:'#5F6067',background:'#FFF8D8',fontSize:'11px',fontWeight:900}}>{column.label}</th>)}</tr></thead>
   <tbody>
    {safeRows.length?safeRows.map((row,index)=><tr key={row?.[rowKey]||row?.id||index} style={{background:index%2===0?'#FFFFFF':'#FFFEF8'}}>{safeColumns.map(column=><td key={column.key} data-label={column.label} style={{...cellStyle,color:'#38393E',fontWeight:600}}>{column.render?column.render(row,index):row?.[column.key]}</td>)}</tr>):<tr><td colSpan={Math.max(1,safeColumns.length)} data-label="وضعیت" style={{...cellStyle,height:'150px',textAlign:'center',color:'#777982',fontWeight:700}}>{emptyText}</td></tr>}
   </tbody>
  </table>
 </div>
}