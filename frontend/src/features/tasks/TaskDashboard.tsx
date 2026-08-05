import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { useTasks } from "@/hooks/useTasks";
import { useDebounce } from "@/hooks/useDebounce";
import { TaskTable } from "./TaskTable";
import { TaskDialog } from "./TaskDialog";
import { TaskDeleteAlert } from "./TaskDeleteAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import type { Task, TaskStatus, TaskCreate } from "@/types/task";

export function TaskDashboard() {
  const {
    tasksData,
    isLoading,
    params,
    updateParams,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useTasks();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    updateParams({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    const success = await handleDeleteTask(taskToDelete.id);
    setIsDeleting(false);
    if (success) {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const onDialogSubmit = async (data: TaskCreate) => {
    if (selectedTask) {
      return await handleUpdateTask(selectedTask.id, data);
    } else {
      return await handleCreateTask(data);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl space-y-8">
      
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border pb-6">
        <div className="flex items-center gap-5">
          <img 
            src={logo} 
            alt="Smartecs Systems" 
            className="h-12 w-auto object-contain select-none" 
            draggable={false}
          />
          <div className="hidden sm:block h-10 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Task Management</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Keep track of your projects and daily tasks.
            </p>
          </div>
        </div>
        <Button onClick={openCreateModal} className="gap-2 shadow-sm font-medium">
          <PlusCircle className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or description..."
            className="pl-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        <Select
          value={params.status || "all"}
          onValueChange={(val) => updateParams({ status: val === "all" || !val ? undefined : (val as TaskStatus) })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Todo">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={params.sort || "created_at"}
          onValueChange={(val) => updateParams({ sort: val || undefined, order: val === "due_date" ? "asc" : "desc" })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="due_date">Due Date (Asc)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TaskTable
        tasks={tasksData?.items || []}
        total={tasksData?.total || 0}
        page={params.page || 1}
        pageSize={params.pageSize || 10}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={(page) => updateParams({ page })}
      />

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        onSubmit={onDialogSubmit}
      />

      {taskToDelete && (
        <TaskDeleteAlert
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={onConfirmDelete}
          isDeleting={isDeleting}
          taskTitle={taskToDelete.title}
        />
      )}
    </div>
  );
}
