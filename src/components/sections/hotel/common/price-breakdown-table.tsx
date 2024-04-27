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
        <TableRow>
          <TableCell className="text-lg">Total</TableCell>
          <TableCell className="text-lg font-bold">{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default PriceBreakdownTable
