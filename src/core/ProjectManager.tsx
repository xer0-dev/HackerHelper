import React, { useState, useEffect } from 'react';
import useLocalStorage from '../utils/hooks/useLocalStorage';
import { saveAs } from 'file-saver';

interface Project {
  name: string;
  notes: string[];
  tasks: string[];
  mindMaps: string[];
  repos: string[];
  crypto: string[];
  security: string[];
  password: string[];
  soundPlayer: string[];
  recon: string[]; 
}

import styled from 'styled-components'; // Keep this line

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [savePath, setSavePath] = useState('');

  useEffect(() => {
    if (currentProject) {
      setProjects(projects.map((p: Project) => (p.name === currentProject.name ? currentProject : p)));
    }
  }, [currentProject, projects]);

  const handleCreateProject = () => {
    if (projectName.trim() === '') return;

    const newProject: Project = {
      name: projectName,
      notes: [],
      tasks: [],
      mindMaps: [],
      repos: [],
      crypto: [],
      security: [],
      password: [],
      soundPlayer: [],
      recon: [], 
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setProjectName('');
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
  };

  const handleDeleteProject = (projectName: string) => {
    setProjects(projects.filter((p: Project) => p.name !== projectName));
    setCurrentProject(null);
  };

  const handleSaveProject = () => {
    if (!currentProject) return;

    const db = {
      projects: projects.map((project: Project) => ({
        name: project.name,
        notes: project.notes,
        tasks: project.tasks,
        mindMaps: project.mindMaps,
        repos: project.repos,
        crypto: project.crypto,
        security: project.security,
        password: project.password,
        soundPlayer: project.soundPlayer,
        recon: project.recon, // Include recon in the saved data
      })),
    };

    const blob = new Blob([JSON.stringify(db)], { type: 'application/json' });
    saveAs(blob, `${savePath}/${currentProject.name}.json`);
  };

  const handleImportProject = (importedProject: Project) => {
    setProjects([...projects, importedProject]);
    setCurrentProject(importedProject);
  };

  const handleSavePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSavePath(e.target.value);
  };

  return (
    <ProjectManagerContainer>
      <h2>Project Manager</h2>
      <ProjectList>
        {projects.map((project: Project) => (
          <ProjectItem
            key={project.name}
            project={project}
            onSelect={() => handleSelectProject(project)}
            onDelete={() => handleDeleteProject(project.name)}
          />
        ))}
      </ProjectList>
      <ProjectForm>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button onClick={handleCreateProject}>Create Project</button>
      </ProjectForm>
      {currentProject && (
        <ProjectDetails>
          <h3>{currentProject.name}</h3>
          {/* Add components for editing project data */}
          <button onClick={handleSaveProject}>Save Project</button>
          <input
            type="text"
            placeholder="Save Path"
            value={savePath}
            onChange={handleSavePathChange}
          />
        </ProjectDetails>
      )}
      {/* Add components for importing projects */}
    </ProjectManagerContainer>
  );
};

const ProjectManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px;
  text-align: center;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

interface ProjectItemProps {
  project: Project;
  onSelect: () => void;
  onDelete: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, onSelect, onDelete }) => {
  return (
    <div>
      <span>{project.name}</span>
      <button onClick={onSelect}>Select</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

const ProjectForm = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export default ProjectManager;
const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [savePath, setSavePath] = useState('');

  useEffect(() => {
    if (currentProject) {
      setProjects(projects.map((p: Project) => (p.name === currentProject.name ? currentProject : p)));
    }
  }, [currentProject, projects]);

  const handleCreateProject = () => {
    if (projectName.trim() === '') return;

    const newProject: Project = {
      name: projectName,
      notes: [],
      tasks: [],
      mindMaps: [],
      repos: [],
      crypto: [],
      security: [],
      password: [],
      soundPlayer: [],
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setProjectName('');
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
  };

  const handleDeleteProject = (projectName: string) => {
    setProjects(projects.filter((p: Project) => p.name !== projectName));
    setCurrentProject(null);
  };

  const handleSaveProject = () => {
    if (!currentProject) return;

    const db = {
      projects: projects.map((project: Project) => ({
        name: project.name,
        notes: project.notes,
        tasks: project.tasks,
        mindMaps: project.mindMaps,
        repos: project.repos,
        crypto: project.crypto,
        security: project.security,
        password: project.password,
        soundPlayer: project.soundPlayer,
      })),
    };

    const blob = new Blob([JSON.stringify(db)], { type: 'application/json' });
    saveAs(blob, `${savePath}/${currentProject.name}.json`);
  };

  const handleImportProject = (importedProject: Project) => {
    setProjects([...projects, importedProject]);
    setCurrentProject(importedProject);
  };

  const handleSavePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSavePath(e.target.value);
  };

  return (
    <ProjectManagerContainer>
      <h2>Project Manager</h2>
      <ProjectList>
        {projects.map((project: Project) => (
          <ProjectItem
            key={project.name}
            project={project}
            onSelect={() => handleSelectProject(project)}
            onDelete={() => handleDeleteProject(project.name)}
          />
        ))}
      </ProjectList>
      <ProjectForm>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button onClick={handleCreateProject}>Create Project</button>
      </ProjectForm>
      {currentProject && (
        <ProjectDetails>
          <h3>{currentProject.name}</h3>
          {/* Add components for editing project data */}
          <button onClick={handleSaveProject}>Save Project</button>
          <input
            type="text"
            placeholder="Save Path"
            value={savePath}
            onChange={handleSavePathChange}
          />
        </ProjectDetails>
      )}
      {/* Add components for importing projects */}
    </ProjectManagerContainer>
  );
};

const ProjectManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px;
  text-align: center;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

interface ProjectItemProps {
  project: Project;
  onSelect: () => void;
  onDelete: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, onSelect, onDelete }) => {
  return (
    <div>
      <span>{project.name}</span>
      <button onClick={onSelect}>Select</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

const ProjectForm = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export default ProjectManager;
