import { TaskDashboard } from "@/features/tasks/TaskDashboard";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <TaskDashboard />
      <Toaster />
    </div>
  );
}

export default App;
