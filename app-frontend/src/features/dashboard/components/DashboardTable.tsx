import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ConversationExchange } from "../hooks/useDashboard";

interface DashboardTableProps {
  data: ConversationExchange[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: number) => void;
}

export function DashboardTable({
  data,
  isLoading,
  search,
  onSearchChange,
  onDelete,
}: DashboardTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead className="w-[200px]">Conversation</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Response</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading history...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No history found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.prompt_id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {format(new Date(item.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span
                        className="font-medium truncate max-w-[180px]"
                        title={item.conversation_name}
                      >
                        {item.conversation_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={item.prompt}>
                      {item.prompt}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div
                      className="truncate text-muted-foreground"
                      title={item.response || "No response"}
                    >
                      {item.response || <span className="italic">No response</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.prompt_id)}
                        title="Delete this exchange"
                        className="hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
