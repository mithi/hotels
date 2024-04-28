import { HotelCard } from "@/components/sections/hotel"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import ErrorBoundary from "@/components/common/error-boundary"
import { Card } from "@/components/ui/card"
import { moveUnavailableHotelPricesToBottom, transformPricesToRecord } from "@/lib/hotels"

function HotelList({
  currency,
  hotels,
  prices,
}: {
  currency: CurrencyIdentifier
  hotels: HotelInfo[]
  prices: HotelPrice[]
}) {
  const hotelPriceRecord = transformPricesToRecord(prices ?? [])
  const sortedHotels = moveUnavailableHotelPricesToBottom(hotels, hotelPriceRecord)

  return (
    <>
      {sortedHotels.map(hotelInfo => {
        return (
          <ErrorBoundary
            key={hotelInfo.id}
            fallbackUI={
              <Card className="p-4 text-sm">
                Cannot display this hotel result at this time. Try refreshing the page of
                come back later.
              </Card>
            }
          >
            <HotelCard
              {...hotelInfo}
              priceInfo={hotelPriceRecord[hotelInfo.id]}
              currency={currency}
            />
          </ErrorBoundary>
        )
      })}
    </>
  )
}

export default HotelList
