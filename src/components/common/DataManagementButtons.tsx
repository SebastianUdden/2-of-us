import { Task } from "../../types/Task";
import { useTaskPersistence } from "../../data/hooks/useTaskPersistence";

const DataManagementButtons = () => {
  const { saveTasks, loadTasks } = useTaskPersistence();

  const handleExport = async () => {
    try {
      const tasks = await loadTasks();
      const blob = new Blob([JSON.stringify(tasks, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "todo-backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting tasks:", error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const tasks = JSON.parse(content) as Task[];

          // Validate the imported data
          if (!Array.isArray(tasks)) {
            throw new Error("Invalid backup file format");
          }

          // Save the imported tasks
          await saveTasks(tasks);

          // Reload the tasks to update the UI
          await loadTasks();
        } catch (error) {
          console.error("Error importing tasks:", error);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Export Backup
      </button>
      <label className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer">
        Import Data
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default DataManagementButtons;
