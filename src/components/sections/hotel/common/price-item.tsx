import { GenericItem } from "@/types"

export const PriceItem = ({ field, value, highlighted }: GenericItem) => {
  return (
    <div
      className={
        "flex items-center gap-1 w-full md:items-start md:border-r-2 md:border-dotted md:w-[100px] md:justify-center md:flex-col"
      }
    >
      <div className="truncate min-w-[80px] md:w-full font-bold text-left text-sm">
        {value}
      </div>
      <div
        className={`truncate text-muted-foreground items-center text-xs uppercase pr-2 mb-0 pb-0 text-left ${highlighted ? "underline bg-opacity-50 font-bold" : ""}`}
      >
        {field}
      </div>
    </div>
  )
}

export default PriceItem
