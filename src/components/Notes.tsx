import React, { useState } from 'react';
import styled from 'styled-components';

// NoteItem Component
interface NoteItemProps {
  note: string;
  onDelete: () => void;
  onEdit: (newNote: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(note);

  const handleEdit = () => {
    if (isEditing && editNote !== note) {
      onEdit(editNote);
    }
    setIsEditing(!isEditing);
  };

  return (
    <StyledNoteItem>
      {isEditing ? (
        <input
          type="text"
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
        />
      ) : (
        <span>{note}</span>
      )}
      <Actions>
        <button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
        <button onClick={onDelete}>Delete</button>
      </Actions>
    </StyledNoteItem>
  );
};

const StyledNoteItem = styled.div`
  background-color: #fff;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;

  button {
    background-color: #4caf50;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background-color: #45a049;
    }

    &:last-child {
      background-color: #f44336;
    }
  }
`;

// Notes Component
const Notes: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes([...notes, noteInput]);
      setNoteInput('');
    }
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleEditNote = (index: number, newNote: string) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? newNote : note
    );
    setNotes(updatedNotes);
  };

  return (
    <Container>
      <Title>Notes Manager</Title>
      <NoteList>
        {notes.map((note, index) => (
          <NoteItem
            key={index}
            note={note}
            onDelete={() => handleDeleteNote(index)}
            onEdit={(newNote) => handleEditNote(index, newNote)}
          />
        ))}
      </NoteList>
      <InputContainer>
        <NoteInput
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Enter a new note"
        />
        <AddButton onClick={handleAddNote}>Add Note</AddButton>
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

const NoteList = styled.div`
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

const NoteInput = styled.input`
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

export default Notes;
