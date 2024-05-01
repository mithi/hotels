import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PriceBreakdownTable({
  total,
  hotelFee,
  tax,
  beforeFees,
}: {
  beforeFees: string
  total: string
  hotelFee: string
  tax: string
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>{beforeFees}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell>{tax}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Hotel Fee</TableCell>
            <TableCell>{hotelFee}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow className="text-lg font-bold">
            <TableCell>Total*</TableCell>
            <TableCell>{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <span className="font-normal text-xs text-muted-foreground ml-1">
        *Final price (Total) is rounded
      </span>
    </>
  )
}

export default PriceBreakdownTable
