import { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const ScrollableTwoColumnLayout = ({
  left,
  right,
  fixed,
}: {
  left: ReactNode
  right: ReactNode
  fixed?: ReactNode
}) => {
  // see also: https://stackoverflow.com/questions/43235102/cant-make-overflow-x-work-in-a-full-width-flexbox-column
  // Can't make overflow-x work in a full width flexbox column https://jsfiddle.net/buahdeco/

  return (
    <>
      <div className="p-0 m-0 w-full h-full  min-w-0 items-end relative flex gap-2">
        <div className="min-w-0 mb-10 grow-1 shrink-1 w-full flex overflow-hidden  max-h-[100px] sm:h-full">
          {left}
        </div>
        <div className="shrink-0">{right}</div>
        {fixed}
      </div>
    </>
  )
}

export const HotelCardLayout = ({
  photo,
  title,
  address,
  rating,
  stars,
  description,
  booking,
  availableProviders,
  seeProviderBreakdown,
}: {
  photo: ReactNode
  title: ReactNode
  address: ReactNode
  rating: ReactNode
  stars: ReactNode
  description: ReactNode
  booking: ReactNode
  availableProviders?: ReactNode
  seeProviderBreakdown?: ReactNode
}) => {
  return (
    <Card data-testid="hotel-card" className="flex flex-col sm:flex-row min-w-[350px]">
      <div className="m-2 w-[250px] sm:w-[200px] lg:w-[250px] shrink-0">{photo}</div>
      <div className="w-full min-w-0 p-2 m-0">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl text-ellipsis">{title}</CardTitle>
          <CardDescription className="flex relative">{address}</CardDescription>
          <div className="flex items-center">
            {rating}
            {stars}
          </div>
        </CardHeader>
        <CardContent className="p-0 my-2">{description}</CardContent>
        <CardFooter className="p-0 m-0">
          <ScrollableTwoColumnLayout
            left={availableProviders}
            right={booking}
            fixed={seeProviderBreakdown}
          />
        </CardFooter>
      </div>
    </Card>
  )
}

export default HotelCardLayout
