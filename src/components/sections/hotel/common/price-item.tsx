import { GenericItem } from "@/types"

export const PriceItem = ({ field, value, highlighted }: GenericItem) => {
  return (
    <div
      className={
        "truncate flex items-center gap-1 w-full min-h-[13px] md:items-start md:border-r-2 md:border-dotted md:min-w-[100px] md:w-[100px] md:justify-center md:flex-col"
      }
    >
      <div className="truncate  min-w-[80px] font-bold text-left text-sm">{value}</div>
      <div
        className={`truncate md:w-[100px] text-muted-foreground justify-left items-center text-xs uppercase pr-2 mb-0 pb-0 text-left ${highlighted ? "underline bg-opacity-50 font-bold" : ""}`}
      >
        {field}
      </div>
    </div>
  )
}

export default PriceItem
