# Hotels

## ✅ Task and features

- ➡️ ✅ Retrieve data from API and display them as I deem fit

- ➡️ ✅ Ability to switch to preferred currency, persist selected currency in the browser

- ➡️ Display prices given selected currency

- ➡️ Display competitor's rates in the results in an ordered fashion (lowest to highest)

- ➡️ Should handle no / too many competitors available

- ➡️ If applicable, Display "Save X%" message to highlight if there's a more expensive competition

- ➡️ If applicable, show a strikethrough rate of the most expensive competitor

- ➡️ Show an icon / asterisk to indicate that price is tax inclusive

- ➡️ On hover, pop-up displays a breakdown of the fee (taxes, fees)

* Note: Currencies affect rate of data being returned

## ✅ Important Behaviors

- ➡️ Hotel details exist but not price, show "Rates Unavailable" and push at the bottom of the list

- ➡️ If hotel details exist but price do, do not display hotel

- ➡️ When page is refreshed, results show in the last currency selected

- ➡️ Default currency to USD if no currency was last selected

- ➡️ Round hotel prices

  - USD, SGD, CNY rounded to nearest dollar USD 100.21 -> 100
  - KRW, JPY, IDR rounded to nearest 100 dollar 300123.22 -> 300,100

- ➡️ If no competitor rates are given, do not show savings

- ➡️ When all competitors are cheaper, no savings

- ➡️ When 1 or more competitor rates are more expensive than us, we should show our savings over the competitor's rates

- ➡️ When there's competitor pricing, we should show in the competitor pricing list our rates and where we stand in the ordering of cheapest to most expensive

- ➡️ When taxes & fees are given, that means the price given is already tax inclusive, highlight this in the UI for the results. Example: "taxes and other fees may apply" or show "tax included"

## ✅ API Price Response

- ➡️ Competitor prices are optional

- ➡️ Taxes and fees are optional, if given, current price is tax-inclusive else, tax exclusive

## ✅ Expectations

- ➡️ Correctness, write and run tests

- ➡️ Readability, easy to understand

- ➡️ Consistency - 2 similar use cases / displays, centralized handling

- ➡️ Testing - Emphasize having tests to ensure reliable code, write specs for essential logic in your features

https://gist.github.com/mal90/4627e6beb44ec038b90f64ea1bb30638
