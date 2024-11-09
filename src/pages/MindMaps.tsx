import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Space, Typography, message, ColorPicker } from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { MindMap } from 'react-mind-map';

const { Title } = Typography;

interface Node {
  id: string;
  label: string;
  color?: string;
  image?: string;  // Path to image
  file?: string;   // Path to file
  children?: Node[];
}

interface MindMapState {
  nodes: Node[];
  selectedNode: Node | null;
  undoStack: Node[];  // Stack for undo
  redoStack: Node[];  // Stack for redo
}

const MindMaps: React.FC = () => {
  const [mindMap, setMindMap] = useLocalStorage<MindMapState>('mindMap', {
    nodes: [],
    selectedNode: null,
    undoStack: [],
    redoStack: [],
  });
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [selectedParent, setSelectedParent] = useState<Node | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');

  const mindMapRef = useRef(mindMap);

  // Helper to manage undo and redo stacks
  const addToUndoStack = (newMindMap: MindMapState) => {
    const newUndoStack = [...mindMap.undoStack, mindMapRef.current];
    const newRedoStack = []; // Clear redo stack after a new action
    setMindMap({ ...newMindMap, undoStack: newUndoStack, redoStack: newRedoStack });
  };

  // Handle Undo
  const handleUndo = () => {
    if (mindMap.undoStack.length > 0) {
      const previousState = mindMap.undoStack[mindMap.undoStack.length - 1];
      setMindMap({
        ...previousState,
        undoStack: mindMap.undoStack.slice(0, -1),
        redoStack: [mindMapRef.current, ...mindMap.redoStack],
      });
    }
  };

  // Handle Redo
  const handleRedo = () => {
    if (mindMap.redoStack.length > 0) {
      const nextState = mindMap.redoStack[0];
      setMindMap({
        ...nextState,
        undoStack: [...mindMap.undoStack, mindMapRef.current],
        redoStack: mindMap.redoStack.slice(1),
      });
    }
  };

  // Handle Delete Node with Children
  const handleDeleteNode = () => {
    if (!mindMap.selectedNode) {
      message.error('Please select a node to delete.');
      return;
    }

    const deleteNodeRecursively = (nodeId: string, nodes: Node[]): Node[] => {
      return nodes.filter((node) => {
        if (node.id === nodeId) {
          return false;
        }
        if (node.children) {
          node.children = deleteNodeRecursively(nodeId, node.children);
        }
        return true;
      });
    };

    const updatedNodes = deleteNodeRecursively(mindMap.selectedNode.id, mindMap.nodes);
    addToUndoStack({ ...mindMap, nodes: updatedNodes, selectedNode: null });
  };

  // Handle Node Selection (for expanding/collapsing)
  const handleNodeSelect = (node: Node) => {
    setSelectedParent(node);
  };

  // Handle Copy Node
  const handleCopyNode = () => {
    if (!mindMap.selectedNode) {
      message.error('Please select a node to copy.');
      return;
    }

    const copiedNode = JSON.parse(JSON.stringify(mindMap.selectedNode)); // Deep clone the selected node
    setMindMap({ ...mindMap, selectedNode: copiedNode });
  };

  // Handle Paste Node
  const handlePasteNode = () => {
    if (!mindMap.selectedNode) {
      message.error('Please copy a node first.');
      return;
    }

    const copiedNode = JSON.parse(JSON.stringify(mindMap.selectedNode)); // Deep clone the copied node
    if (selectedParent) {
      const updatedNodes = [...mindMap.nodes];
      const parentIndex = updatedNodes.findIndex((n) => n.id === selectedParent.id);
      if (parentIndex !== -1) {
        if (!updatedNodes[parentIndex].children) {
          updatedNodes[parentIndex].children = [];
        }
        updatedNodes[parentIndex].children.push(copiedNode);
        addToUndoStack({ ...mindMap, nodes: updatedNodes });
      }
    } else {
      setMindMap({ ...mindMap, nodes: [...mindMap.nodes, copiedNode] });
    }
  };

  // Handle Color Picker Change
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  // Keyboard Events for Copy, Paste, Undo, Redo
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (event.key === 'z') {
        handleUndo();
      } else if (event.key === 'y') {
        handleRedo();
      } else if (event.key === 'c') {
        handleCopyNode();
      } else if (event.key === 'v') {
        handlePasteNode();
      }
    }
  };

  useEffect(() => {
    mindMapRef.current = mindMap;
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mindMap]);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Mind Map Manager</Title>
      <Space direction="vertical" style={{ marginBottom: '20px' }}>
        <Space>
          <Input
            placeholder="New node label"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
          />
          <ColorPicker value={selectedColor} onChange={handleColorChange} />
          <Button type="primary" onClick={() => {}} icon={<PlusOutlined />}>
            Add Node
          </Button>
        </Space>
        <Space>
          <Button
            type="default"
            icon={<SaveOutlined />}
            onClick={handleSaveMindMap}
          >
            Save MindMap
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={handleDeleteNode}
          >
            Delete Node
          </Button>
          <Button
            type="default"
            onClick={handleUndo}
          >
            Undo (Ctrl+Z)
          </Button>
          <Button
            type="default"
            onClick={handleRedo}
          >
            Redo (Ctrl+Y)
          </Button>
          <Button
            type="default"
            onClick={handleCopyNode}
          >
            Copy Node (Ctrl+C)
          </Button>
          <Button
            type="default"
            onClick={handlePasteNode}
          >
            Paste Node (Ctrl+V)
          </Button>
        </Space>

        {/* Render Mind Map */}
        <MindMap
          nodes={mindMap.nodes}
          selectedNode={mindMap.selectedNode}
        />
      </Space>
    </div>
  );
};

export default MindMaps;
