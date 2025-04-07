import { Task } from "../../types/Task";
import { useTaskPersistence } from "../../data/hooks/useTaskPersistence";

interface BackupPanelProps {
  onClose: () => void;
}

const BackupPanel = ({ onClose }: BackupPanelProps) => {
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
          onClose();
        } catch (error) {
          console.error("Error importing tasks:", error);
        }
      };
      reader.readAsText(file);
      window.location.reload();
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium">
        Hantera sparade data, lägg till eller ta bort. Export sparar din data i
        en fil. Om du importerar filen kommer all data att läggas till i din
        databas och skriva över den befintliga datan.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Exportera backup
        </button>
        <label className="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer text-center">
          Importera data
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default BackupPanel;
