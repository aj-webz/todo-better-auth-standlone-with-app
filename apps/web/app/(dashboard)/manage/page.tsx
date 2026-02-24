import { CreateTodoSheet } from "../../../components/inputcomponent/TodoSheet";
import { KanbanBoard } from "../../../components/Kanban";

export default function ManagePage() {
  return (
    <section className="flex min-h-screen flex-col p-10">
      <h1 className="font-bold text-4xl">Manage Your Task</h1>

      <div className="mb-5 flex w-full justify-end p-2">
        <CreateTodoSheet />
      </div>

      <div className="w-auto">
        <KanbanBoard />
      </div>
    </section>
  );
}
