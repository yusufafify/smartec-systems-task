import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, CalendarDays, Inbox } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TaskTable({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  page,
  pageSize,
  total,
  onPageChange,
}: TaskTableProps) {
  const totalPages = Math.ceil(total / pageSize);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-success hover:bg-success/90 text-success-foreground border-transparent";
      case "In Progress":
        return "bg-warning hover:bg-warning/90 text-warning-foreground border-transparent";
      default: // To Do
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-transparent";
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent";
      case "Medium":
        return "bg-warning hover:bg-warning/90 text-warning-foreground border-transparent";
      default: // Low
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-transparent";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%] font-semibold text-foreground">
                Task Details
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Priority
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Due Date
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Created
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Updated
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground animate-in fade-in zoom-in-95 duration-300">
                    <div className="p-4 bg-muted/50 rounded-full">
                      <Inbox className="h-8 w-8 text-muted-foreground/80" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      No tasks found
                    </p>
                    <p className="text-sm">
                      Try adjusting your filters or create a new task to get
                      started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Task Rows
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="group transition-colors duration-200 hover:bg-muted/30 cursor-default"
                >
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px] sm:max-w-[300px]">
                        {task.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-medium ${getStatusBadgeStyle(task.status)}`}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-medium ${getPriorityBadgeStyle(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.due_date ? (
                      <div className="flex items-center text-sm text-muted-foreground font-mono">
                        <CalendarDays className="mr-2 h-3.5 w-3.5" />
                        {formatDate(task.due_date)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">----</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground font-mono">
                      {formatDate(task.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground font-mono">
                      {formatDate(task.updated_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(task)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-sm text-muted-foreground font-medium">
            Showing{" "}
            <span className="text-foreground">{(page - 1) * pageSize + 1}</span>{" "}
            to{" "}
            <span className="text-foreground">
              {Math.min(page * pageSize, total)}
            </span>{" "}
            of <span className="text-foreground">{total}</span> tasks
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="shadow-sm transition-all active:scale-95"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="shadow-sm transition-all active:scale-95"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
