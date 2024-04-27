import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ProviderPriceTable({
  items,
}: {
  items: {
    field: string
    value: string
    highlighted?: boolean
  }[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Provider</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow
            className={`${item.highlighted ? "font-bold bg-lime-200 bg-opacity-85" : ""}`}
            key={item.field}
          >
            <TableCell>{item.field}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ProviderPriceTable
