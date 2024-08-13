import { useAddTask } from "@/features/add-task";
import { useState } from "react";

export const TaskForm = () => {
  const addTask = useAddTask();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<{ title: string }>({
    title: "",
  });

  return (
    <section className="add-todo">
      {!isFormVisible && (
        <button
          className="add-todo__show-form-button"
          onClick={() => setIsFormVisible(true)}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      )}
      {isFormVisible && (
        <form
          className="add-todo__form"
          onSubmit={(e) => {
            e.preventDefault();
            addTask(formData);
            setFormData({ title: "" });
          }}
        >
          <button
            className="close-button"
            type="button"
            onClick={() => setIsFormVisible(false)}
          >
            <i className="bi bi-x"></i>
          </button>
          <div className="text-input text-input--focus">
            <input
              className="input"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
            />
          </div>
          <button className="button button--filled">Add task</button>
        </form>
      )}
    </section>
  );
};
