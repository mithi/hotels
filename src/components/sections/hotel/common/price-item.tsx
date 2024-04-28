import { GenericItem } from "@/types"

export const PriceItem = ({ field, value, highlighted }: GenericItem) => {
  return (
    <div
      className={
        "flex items-center gap-1 w-full sm:items-start sm:border-r-2 sm:border-dotted sm:w-[100px] sm:justify-center sm:flex-col"
      }
    >
      <div className="truncate w-full font-bold text-left text-sm">
        {value}
      </div>
      <div
        className={`truncate w-full text-muted-foreground items-center text-xs uppercase pr-2 mb-0 pb-0 text-left ${highlighted ? "underline bg-opacity-50 font-bold" : ""}`}
      >
        {field}
      </div>
    </div>
  )
}

export default PriceItem
