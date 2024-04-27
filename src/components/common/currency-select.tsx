import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { availableCurrencies } from "@/constants/available-currencies"
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
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        {availableCurrencies.map(current => {
          return (
            <SelectItem key={current.name} value={current.name}>
              {current.name} ({current.symbol}) - {current.description}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
