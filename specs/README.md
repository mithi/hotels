# Hotel Currencies & Price Competitiveness task

## Introduction

To write the application you should use JS and a frontend framework that to help you to achieve the display. It should work in the web browser. There should be no/ minimal server side rendering here.

You can post it as a gist, upload to github or send us via email, anything works as long as the code is correct and you send us instructions how to use it.

## Background & Requirements

Whenever you make a search in any hotel site, you get some information about the hotels given your search parameters for display purposes. Typical details included in the hotel are:

- Name
- Address
- Thumbnail
- Star & Review rating
- Description

As we're dealing with a global customer base, customers should be able to view the hotel prices in their own currency. This means allowing the customer to select their preferred currency for search.

**Pricing**

Pricing in hotel sites is can be a fairly complex workflow, especially when it comes to giving users a competitive & accurate pricing experience.

1. Competition: These days, a good user experience would be to show the price competitiveness of your rate relative to rates out there in the Internet
    1. We may, or may not be competitive, but we should show how well we stack up next to them
    1. We wish to show to the user that they can have some savings if they book with us relative to the more expensive competition out there
1. Taxes and Fees: Hotels charge goods and/or service fees when you stay with them
    1. Tax-Inclusive rates: To be fair to the end user, we don't want to hide any costs, so we should show such rates where applicable
    1. Taxes & fees aren't always available at search, in most cases, this is only available after booking, so there's a discrepancy between hotel rates that are inclusive/ exclusive
    1. We want to declare in the results a rate is tax-inclusive if applicable

**Your Task**

The task is to write a simplified version of a hotel result display upon getting the data after a RESTful API call to the backend.

You are free to display in the information as you deem fit (most hotel booking sites you give you a good idea of how to display it in a logically & decently; e.g. Kayak, Booking, HotelsCombined).

On top of doing up the display of the search results, this task entails a function of allowing us to switch the currency of the results. As a site with a global user base, we have to enable customers to view results in their preferred currency.

Here are the features you need to implement:

|Feature|Function|Description|
|-------|--------|-----------|
|Currencies|Combining results|Default to a particular currency, your search should combine the static data API call with the currency call to display the results|
||Switching currencies|When you switch, a new API call is made for that currency to re-render results. New currency should now be persisted as the user's default choice|
|Competitor Prices|Display|Order and display each competitor's rates within the results. Your UI should work if there's no/ too many competitor rates available|
|||Also show our rates in the competition list, to show where we stand amongst the competition|
||Savings|Where applicable, you should display a "Save X%" message in the result to highlight how much the user saves booking with us if there's a more expensive competition available|
|||Where applicable, also show in each result a strikethrough rate of the most expensive competitor price to emphasise expensive rates out there (to encourage them to pick us)|
|Taxes & Fees|Display|Show an icon/ asterisk to indicate our price is tax-inclusive for that result. On hover, a pop-up displays the breakdown of the rates|

**Note:** Please take sometime to study the data, you'll find that currencies affect the rates of data being returned; which'll in turn affect your implementation.

```
------------------------------------------
|         | Hotel Boss.       Good | 7.5 |
|         |                        S$200 |
|         | Expedia|Booking |Us  |       |
|         | S$190  |S$199   |$200| Book! |
------------------------------------------
```

### Important Behaviours

Here're some important behaviours to expect when designing each function:

**Currency switching**

1. When I do not have prices returned for the currency, that means the rates are unavailable for that hotel
    1. If the hotel details exist but not the prices, then show that hotel result has having "Rates unavailable" and push that result to the bottom of the list
    1. If the hotel details do not exist, but prices do, do not display that hotel
1. When I refresh the page, the results should show in the last currency selected
1. Default the currency searched to USD if no currency was last selected
1. Hotel prices in the results page are typically rounded
    1. Currencies like USD, SGD, CNY are rounded to their nearest dollar. E.g. USD 100.21 is displayed as USD 100
    1. Currencies like KRW, JPY, IDR are rounded to their nearest 100-dollars. E.g. KRW 300123.22 is displayed as KRW 300,100

**Competitor Pricing**

1. When no competitor rates are given, do not show anything or savings (since there's no basis for comparison)
1. When all competitor rates are cheaper than us, there's no savings
1. When 1 or more competitor rates are more expensive than us, we should show our savings over the competitor's rates
1. When there's competitor pricing, we should show in the competitor pricing list our rates and where we stand in the ordering of cheapest to most expensive

**Taxes & Fees**

1. When taxes & fees are given, that means the price given is already tax inclusive, highlight this in the UI for the results

### API Response Format

The hotels data endpoint returns data in the following format.

```
[
  {
    "id": 1,
    "name": "Shinagawa Prince Hotel",
    "rating": 7.7,
    "stars": 4,
    "address": "108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan",
    "photo": "https://d2ey9sqrvkqdfs.cloudfront.net/ZqSQ/i1_t.jpg",
    "description": "<p>Boasting 15 food and beverage options, 2 swimming pools, and its own aquarium, Prince Hotel is right next to JR Shinagawa Train Station, from where Haneda Airport is only a 25-minute train ride away. This 39-storey hotel offers beautiful Tokyo views and free WiFi throughout the entire hotel.</p> <br> <p>The air-conditioned rooms at Shinagawa Prince Hotel have a fridge and an en suite bathroom with a bathtub and shower booth. Free toiletries and a hairdryer are provided. Guests will also find a personal locker in the room.</p> <br> <p>By train, Shibuya is 5 stops away and Shinjuku is a 16-minute ride. Tokyo Station is an 11-minute train ride away. Direct buses to and from Narita Airport stop at the hotel.</p> <br> <p>A city within a city, the hotel has its own movie theatre, bowling alley and tennis courts. Guests can enjoy a visit to the karaoke bar. The hotel also features a 24-hour front desk, indoor and outdoor pools, a sauna facility and massage services. Currency exchange service is available. Guests will find drink vending machines and a cash machine on site.</p> <br> <p>The 39th-floor Dining & Bar Table 9 Tokyo offers one of Tokyo’s best views. Restaurants serves unique Western cuisine, grill and steaks, while the bar lounge offers fusion tapas and drinks including whiskey, cocktails, sake and champagne. </p> <br> <p>Minato is a great choice for travellers interested in clean streets, friendly locals and culture.</p>"
  },
  ...
]
```

The data in endpoints for each currency looks as follows:

- Competitor data is optional
- Taxes & fees data is optional
    - If given, that means the current price is tax-inclusive and this should be highlighted
    - Otherwise, this is a tax exclusive rate
    - Only SGD contains tax-inclusive rates in the data. We'll be testing using it

```
[
  {
    "id": 1,
    "price": 164,
    "competitors": {
      "Traveloka": 190,
      "Expedia": 163,
    },
    "taxes_and_fees": {
      "tax": 13.12,
      "hotel_fees": 16.40
    }
  },
  ...
]
```

For displaying the results, you'll need to collate the data upon matching the prices response to the static hotel information.

### Resources

- The endpoints to use are:
  - Static data: https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo
  - Prices:
    - USD: http://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo/1/USD
    - SGD: http://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo/1/SGD
    - CNY: http://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo/1/CNY
    - KRW: http://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo/1/KRW
- Please note that for the simplification and easiness of testing this is a static urls, they always return the same values, but you cannot treat them as static content (i.e. I may elect to test by modifying the hotel data

## Expectations

What matters:

* Correctness - From the outside, the function should work in exactly the same way as before; this is ensured by writing & running the tests
* Readability - The code should be easy to read, the flow of the currency switching & competitor pricing process should be easy to understand and test
* Consistency - Your code should be consistent, meaning if in 2 similar use cases/ displays, you should have a centralised handling of it.
* Testing - We emphasise on having tests to ensure our code is reliable. You should write specs for essential logic in your features.

## Questions?

If you have any question, don't worry, just send me an email or Skype me, I'll respond as quickly as I can

Good luck!
