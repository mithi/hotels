import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { availableCurrencies } from "@/constants"
import { currencyItemSelectionDisplay } from "@/lib/currencies"
import { CurrencyIdentifier } from "@/types"

export const CurrencySelect = ({
  value,
  setValue,
  disabled,
}: {
  value: CurrencyIdentifier
  setValue: (v: CurrencyIdentifier) => void
  disabled?: boolean
}) => {
  return (
    <Select disabled={disabled} value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[250px]" aria-label="currency-select">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        {availableCurrencies.map(current => {
          return (
            <SelectItem key={current.name} value={current.name}>
              {currencyItemSelectionDisplay(current.name)}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export default CurrencySelect
