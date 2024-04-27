import { priceDisplay } from "@/lib/utils"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import {
  BookingCard,
  HotelCardLayout,
  PriceItem,
  ProviderPriceTable,
  Rating,
  SeeMoreDescription,
} from "./common"
import { MapPin } from "lucide-react"
import BasicPopover from "@/components/common/basic-popover"
import HotelStars from "./common/hotel-stars"

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

  const otherProviders =
    price != null && priceInfo?.competitors
      ? Object.entries(priceInfo?.competitors ?? {}).map(entry => {
          const [provider, price] = entry
          return { provider, price, highlighted: false }
        })
      : []

  const mostExpensive =
    otherProviders.length > 0
      ? otherProviders.reduce((acc, provider) => {
          return acc && acc.price > provider.price ? acc : provider
        })
      : null

  /* Assume that "Our Price" is a reserved keyword and there  */
  const sortedProviders =
    price != null && otherProviders.length > 0
      ? [...otherProviders, { provider: "Our Price", price, highlighted: true }]
          .sort((a, b) => {
            return a.price < b.price ? -1 : 1
          })
          ?.map(item => {
            return {
              field: item.provider,
              value: priceDisplay(item.price, currency),
              highlighted: item.highlighted,
            }
          })
      : []

  const ourPriceDisplay = price != null ? priceDisplay(price, currency) : null
  const expensivePriceDisplay =
    mostExpensive?.price != null ? priceDisplay(mostExpensive.price, currency) : null

  const saveUpTo =
    price != null && mostExpensive?.price != null && price < mostExpensive.price
      ? ((mostExpensive.price - price) / mostExpensive.price) * 100
      : 0

  return (
    <HotelCardLayout
      photo={
        <img className="rounded-md" src={photo} alt={`Preview Image for Hotel ${name}`} />
      }
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
          {sortedProviders.map(competitor => {
            return (
              <PriceItem
                key={competitor.field}
                field={competitor.field}
                value={competitor.value}
                highlighted={competitor.highlighted}
              />
            )
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
