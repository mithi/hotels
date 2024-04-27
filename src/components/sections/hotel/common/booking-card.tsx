import { Badge } from "@/components/ui/badge"
import { CircleHelp } from "lucide-react"
import { Button } from "@/components/ui/button"
import BasicPopover from "@/components/common/basic-popover"
import PriceBreakdownTable from "./price-breakdown-table"

export const BookingCard = ({
  saveUpTo,
  price,
  competitorPrice,
  taxesAndFeesBreakdown,
  onBook,
}: {
  saveUpTo?: number
  price?: string | null
  competitorPrice?: string | null
  taxesAndFeesBreakdown?: { beforeFees: string; tax: string; hotelFee: string } | null
  onBook?: () => void
}) => {
  if (price == null) {
    return (
      <div className="border rounded-lg m-0 p-2 text-end">
        <p className="m-1 w-full text-start text-sm font-bold">Price not available</p>
        <Button className="w-full min-w-[175px]" onClick={onBook}>
          Book
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg m-0 p-2 text-end">
      <div className="w-full text-end">
        {saveUpTo != null && saveUpTo > 0 && (
          <BasicPopover
            trigger={
              <Badge variant="outline" className="bg-lime-200  text-xs">
                Save up to {saveUpTo.toFixed(2)}% <CircleHelp className=" scale-75" />
              </Badge>
            }
            content={
              <div className="text-xs">
                Savings are computed based on the most expensive known provider
              </div>
            }
          />
        )}
      </div>
      <div className="flex flex-col md:flex-row md:gap-1 justify-end">
        {competitorPrice && (
          <div className="shrink-0 my-2 text-md mb-0 pb-0 text-red-500 line-through">
            {competitorPrice}
          </div>
        )}
        <div className="shrink-0 text-2xl my-0 py-0 font-bold">
          {taxesAndFeesBreakdown ? (
            <BasicPopover
              trigger={<>{price}*</>}
              content={
                <PriceBreakdownTable
                  beforeFees={taxesAndFeesBreakdown.beforeFees}
                  tax={taxesAndFeesBreakdown.tax}
                  hotelFee={taxesAndFeesBreakdown.hotelFee}
                  total={price}
                />
              }
            />
          ) : (
            price
          )}
        </div>
      </div>
      <div
        className={`text-end mb-2 text-xs ${taxesAndFeesBreakdown == null ? "text-yellow-600" : "text-lime-500"}`}
      >
        {taxesAndFeesBreakdown
          ? "Taxes and Hotel Fees Inclusive"
          : "Taxes and other fees may apply"}
      </div>
      <Button className="w-full min-w-[175px]" onClick={onBook}>
        Book
      </Button>
    </div>
  )
}

export default BookingCard
