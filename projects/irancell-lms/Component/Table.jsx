export function IrancellTable({columns=[],rows=[],emptyText='داده‌ای برای نمایش وجود ندارد.',caption='',rowKey='id'}){
 const safeColumns=Array.isArray(columns)?columns.filter(column=>column&&column.key):[];
 const safeRows=Array.isArray(rows)?rows:[];
 return <div className={`ir-table-wrap ${safeRows.length?'has-rows':'is-empty'}`} role="region" aria-label={caption||'جدول اطلاعات'} tabIndex="0">
  <table className="ir-table">
   {caption&&<caption>{caption}</caption>}
   <thead><tr>{safeColumns.map(column=><th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
   <tbody>
    {safeRows.length?safeRows.map((row,index)=><tr key={row?.[rowKey]||row?.id||index}>{safeColumns.map(column=><td key={column.key} data-label={column.label}>{column.render?column.render(row,index):row?.[column.key]}</td>)}</tr>):<tr className="ir-table__empty-row"><td colSpan={Math.max(1,safeColumns.length)} data-label="وضعیت">{emptyText}</td></tr>}
   </tbody>
  </table>
 </div>
}