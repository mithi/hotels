import { ReactNode } from "react"
import { CircleHelp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverPopover, BasicPopover } from "@/components/common"
import PriceBreakdownTable from "./price-breakdown-table"

export const PriceNotAvailable = () => {
  return <p className="m-1 text-sm font-bold">Rates unavailable</p>
}

export const StrikeThroughPrice = ({ value }: { value: string }) => {
  return (
    <div
      className="shrink-0 my-2 text-sm mb-0 pb-0 text-red-500 line-through font-normal"
      data-testid="strikethrough-price"
    >
      {value}
    </div>
  )
}

export const BookingAction = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button className="w-full min-w-[175px]" onClick={onClick}>
      Book
    </Button>
  )
}

export const Savings = ({
  value,
  message = "Savings are computed against the most expensive known provider using the original unrounded prices",
}: {
  value: number
  message?: string
}) => {
  return (
    <BasicPopover
      side="bottom"
      trigger={
        <Badge
          variant="outline"
          className="bg-lime-200 text-xs"
          data-testid="hotel-savings"
        >
          Save up to {value.toFixed(2)}% <CircleHelp className=" scale-75" />
        </Badge>
      }
      content={<div className="text-xs">{message}</div>}
    />
  )
}

export const PriceBreakdownPopover = ({
  price,
  taxesAndFeesBreakdown,
  trigger,
}: {
  price: string
  taxesAndFeesBreakdown: { beforeFees: string; tax: string; hotelFees: string }
  trigger?: ReactNode
}) => {
  return (
    <HoverPopover
      trigger={trigger ?? <>{price}*</>}
      content={
        <PriceBreakdownTable
          beforeFees={taxesAndFeesBreakdown.beforeFees}
          tax={taxesAndFeesBreakdown.tax}
          hotelFees={taxesAndFeesBreakdown.hotelFees}
          total={price}
        />
      }
    />
  )
}

export const PriceWarning = ({ hasBreakdown }: { hasBreakdown: boolean }) => {
  return (
    <div className={`text-end mb-2 text-xs`}>
      {hasBreakdown ? (
        <span className="text-lime-500" data-testid="other-fees-included">
          Taxes and Hotel Fees Included
        </span>
      ) : (
        <span className="text-yellow-600" data-testid="other-fees-not-included">
          Taxes and other fees may apply
        </span>
      )}
    </div>
  )
}

export const BookingCardLayout = ({
  savings,
  strikethroughPrice,
  price,
  subtitle,
  action,
}: {
  price: ReactNode
  action: ReactNode
  savings?: ReactNode
  strikethroughPrice?: ReactNode
  subtitle?: ReactNode
}) => {
  return (
    <section className="border rounded-lg m-0 p-2 flex flex-col justify-end text-end items-end">
      {savings}
      <div className="flex flex-col md:flex-row md:gap-2 items-end font-bold">
        {strikethroughPrice} {price}
      </div>
      {subtitle}
      {action}
    </section>
  )
}

export default BookingCardLayout
