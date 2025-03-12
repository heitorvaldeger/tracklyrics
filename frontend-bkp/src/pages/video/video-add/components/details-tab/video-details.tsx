import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Label } from "@radix-ui/react-dropdown-menu";

export const VideoDetails = () => {
  return (
    <div className="space-y-2 p-2">
      <Label className="font-semibold text-sm">Status</Label>
      <Select defaultValue="draft">
        <SelectTrigger className="w-5/12 outline-none border-gray-400">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="review">Pending Review</SelectItem>
        </SelectContent>
      </Select>

      <Table>
        <TableBody>
          <TableRow className="border-gray-400">
            <TableCell className="font-semibold">Created on:</TableCell>
            <TableCell className="text-right">12/10/2023</TableCell>
          </TableRow>

          <TableRow className="border-gray-400">
            <TableCell className="font-semibold">Updated on:</TableCell>
            <TableCell className="text-right">12/10/2023</TableCell>
          </TableRow>
          <TableRow className="border-gray-400">
            <TableCell className="font-semibold">Plays: </TableCell>
            <TableCell className="text-right">560</TableCell>
          </TableRow>
          <TableRow className="border-gray-400">
            <TableCell className="font-semibold">User: </TableCell>
            <TableCell className="text-right">heitorvaldeger</TableCell>
          </TableRow>
          <TableRow className="border-gray-400">
            <TableCell className="font-semibold">Video UUID: </TableCell>
            <TableCell className="text-right">51ee5db3-3451-42ec-ac19-031c12a9224c</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
