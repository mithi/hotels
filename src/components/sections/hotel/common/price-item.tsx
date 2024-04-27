export const PriceItem = ({
  field,
  value,
  highlighted,
}: {
  field: string
  value: string
  highlighted?: boolean
}) => {
  return (
    <div
      className={
        "text-ellipsis flex  items-center md:items-start gap-1 shrink-0 w-full md:border-r-2 md:border-dotted md:w-[100px] md:justify-center md:flex-col"
      }
    >
      <div className="font-bold text-left text-sm shrink-0 whitespace-nowrap text-ellipsis overflow-hidden">
        {value}
      </div>
      <div
        className={`text-muted-foreground items-center text-xs uppercase pr-2 mb-0 pb-0 text-left text-ellipsis overflow-hidden whitespace-nowrap ${highlighted ? "underline bg-opacity-50 font-bold" : ""}`}
      >
        {field}
      </div>
    </div>
  )
}

export default PriceItem
