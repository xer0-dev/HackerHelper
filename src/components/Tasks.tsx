import React, { useState } from 'react';
import styled from 'styled-components';

// TaskItem Component
interface TaskItemProps {
  task: string;
  isComplete: boolean;
  onToggle: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isComplete, onToggle }) => {
  return (
    <StyledTaskItem isComplete={isComplete} onClick={onToggle}>
      <span className="task-text">{task}</span>
    </StyledTaskItem>
  );
};

const StyledTaskItem = styled.div<{ isComplete: boolean }>`
  background-color: ${({ isComplete }) => (isComplete ? '#A5D6A7' : '#FFEBEE')};
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  .task-text {
    text-decoration: ${({ isComplete }) => (isComplete ? 'line-through' : 'none')};
  }

  &:hover {
    background-color: ${({ isComplete }) => (isComplete ? '#81C784' : '#FFCDD2')};
  }
`;

// TaskManager Component (Main Task Manager)
const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<{ task: string; isComplete: boolean }[]>([]);
  const [taskInput, setTaskInput] = useState<string>('');

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { task: taskInput, isComplete: false }]);
      setTaskInput('');
    }
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isComplete: !task.isComplete } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <Container>
      <Title>Advanced Task Manager</Title>
      <TaskList>
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task.task}
            isComplete={task.isComplete}
            onToggle={() => toggleTaskCompletion(index)}
          />
        ))}
      </TaskList>
      <InputContainer>
        <TaskInput
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task"
        />
        <AddButton onClick={handleAddTask}>Add Task</AddButton>
      </InputContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const TaskList = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  max-width: 600px;
  width: 100%;
`;

const TaskInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const AddButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export default Tasks;
