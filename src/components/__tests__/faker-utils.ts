import { faker } from "@faker-js/faker"
import { CurrencyIdentifier, HotelInfo } from "@/types"
import { availableCurrencies } from "@/constants"

export const generateFakeHotelInfo = (id: number): HotelInfo => {
  return {
    id,
    name: faker.lorem.text(),
    rating: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
    stars: faker.number.int({ min: 1, max: 5 }),
    address: faker.location.streetAddress(),
    photo: faker.image.urlLoremFlickr({ category: "hotel" }),
    description: faker.lorem.paragraphs(),
  }
}

export const generateFakeText = (wordCount?: number): string => {
  return faker.lorem.words(wordCount)
}

export const generateRandomNumber = (params?: {
  type?: "int" | "float"
  options?: {
    min: number
    max: number
    fractionDigits?: number
  }
}): number => {
  const options = {
    min: params?.options?.min,
    max: params?.options?.max,
    fractionDigits: params?.options?.fractionDigits ?? 2,
  }
  if (params?.type === "int") {
    return faker.number.int(options)
  }

  return faker.number.float(options)
}

export const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)]
}

export const getRandomCurrency = (): CurrencyIdentifier => {
  return getRandomItem(availableCurrencies).name
}
