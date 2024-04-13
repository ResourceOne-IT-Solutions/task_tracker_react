import React from "react";
import "./index.css";
import { TASKS } from "../../utils/Constants";
import { Button } from "react-bootstrap";
import { useUserContext } from "../../components/Authcontext/AuthContext";
import { UserContext } from "../../modals/UserModals";

export interface TaskCardProps {
  title: string;
  description: string;
  id: number;
  isAdmin: boolean;
}
const TaskCard = ({ title, description, id, isAdmin }: TaskCardProps) => {
  const handleAssignClick = () => {
    alert("Development is in Progress...");
  };
  return (
    <div className="task-card">
      <div>
        <h3>
          {id}. {title}
        </h3>
        <div>{description}</div>
      </div>
      {isAdmin && (
        <div>
          <Button className="mx-3" onClick={handleAssignClick}>
            Assign to
          </Button>
        </div>
      )}
    </div>
  );
};

const TaskList = () => {
  const { currentUser } = useUserContext() as UserContext;
  const isAdmin = currentUser.isAdmin;
  return (
    <div>
      {" "}
      <h1>Task List</h1>
      <hr />
      <div>
        {TASKS.map((task) => (
          <TaskCard key={task.id} {...task} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
