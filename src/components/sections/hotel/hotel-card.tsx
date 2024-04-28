import { MapPin } from "lucide-react"
import { CurrencyIdentifier, HotelInfo, HotelPrice, ProviderItem } from "@/types"
import {
  BookingCard,
  HotelCardLayout,
  PriceItem,
  ProviderPriceTable,
  Rating,
  SeeMoreDescription,
  HotelStars,
} from "./common"
import BasicPopover from "@/components/common/basic-popover"
import {
  computeSavings,
  mostExpensiveProvider,
  providerRecordToArray,
  providersToSortedGenericItems,
} from "@/lib/hotels"
import { priceDisplay } from "@/lib/currencies"

function HotelCard({
  name,
  address,
  photo,
  stars,
  rating,
  description,
  priceInfo,
  currency,
}: HotelInfo & { priceInfo?: HotelPrice } & { currency: CurrencyIdentifier }) {
  const price = priceInfo?.price

  const otherProviders: ProviderItem[] =
    price != null && priceInfo?.competitors
      ? providerRecordToArray(priceInfo.competitors)
      : []

  const mostExpensive =
    otherProviders.length > 0 ? mostExpensiveProvider(otherProviders) : null

  /* Assume that "Our Price" is a reserved provider here */
  const sortedProviders =
    price != null && otherProviders.length > 0
      ? providersToSortedGenericItems(
          [...otherProviders, { provider: "Our Price", price, highlighted: true }],
          currency
        )
      : []

  const ourPriceDisplay = price != null ? priceDisplay(price, currency) : null
  const expensivePriceDisplay =
    mostExpensive?.price != null ? priceDisplay(mostExpensive.price, currency) : null

  const saveUpTo =
    price != null && mostExpensive?.price != null && price < mostExpensive.price
      ? computeSavings(price, mostExpensive.price)
      : 0

  return (
    <HotelCardLayout
      photo={<img className="rounded-md" src={photo} alt={`Preview Image for ${name}`} />}
      title={name}
      address={
        <>
          <MapPin
            opacity={0.6}
            strokeWidth="1"
            className={"scale-90"}
            aria-hidden={true}
          />
          {address}
        </>
      }
      description={<SeeMoreDescription htmlString={description} />}
      rating={<Rating value={rating} />}
      stars={<HotelStars value={stars} />}
      availableProviders={
        <div className="flex gap-2 flex-col md:flex-row">
          {sortedProviders.map(provider => {
            return <PriceItem key={provider.field} {...provider} />
          })}
        </div>
      }
      seeProviderBreakdown={
        <div className="absolute bottom-2">
          {otherProviders.length > 0 && (
            <BasicPopover
              trigger={
                <span className="underline text-muted-foreground text-sm">
                  Compare all {sortedProviders.length} prices
                </span>
              }
              content={<ProviderPriceTable items={sortedProviders} />}
            />
          )}
        </div>
      }
      booking={
        <BookingCard
          saveUpTo={saveUpTo}
          price={ourPriceDisplay}
          competitorPrice={saveUpTo > 0 ? expensivePriceDisplay : null}
          taxesAndFeesBreakdown={
            priceInfo?.taxes_and_fees && price != null
              ? {
                  beforeFees: priceDisplay(
                    price -
                      priceInfo.taxes_and_fees.tax -
                      priceInfo.taxes_and_fees.hotel_fees,
                    currency
                  ),
                  tax: priceDisplay(priceInfo.taxes_and_fees.tax, currency),
                  hotelFee: priceDisplay(priceInfo.taxes_and_fees.hotel_fees, currency),
                }
              : null
          }
        />
      }
    />
  )
}

export default HotelCard
