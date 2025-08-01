import React, { useState, useCallback } from 'react';
import { Person, Relationship } from './types';

interface PersonNodeProps {
  person: Person;
  onPersonUpdate: (person: Person) => void;
  onPersonDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  interactionMode: 'navigate' | 'add-person' | 'connect';
  connectionType: Relationship['type'];
  onConnectionDrag: (personId: string, startPos: { x: number; y: number }, currentPos: { x: number; y: number }) => void;
  onConnectionDragEnd: () => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  zoom?: number;
  pan?: { x: number; y: number };
}

export const PersonNode: React.FC<PersonNodeProps> = ({
  person,
  onPersonUpdate,
  onPersonDelete,
  isSelected,
  onSelect,
  interactionMode,
  connectionType,
  onConnectionDrag,
  onConnectionDragEnd,
  canvasRef,
  zoom = 1,
  pan = { x: 0, y: 0 }
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const screenToCanvasCoords = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef?.current) return { x: screenX, y: screenY };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (screenX - rect.left - pan.x) / zoom;
    const canvasY = (screenY - rect.top - pan.y) / zoom;
    
    return { x: canvasX, y: canvasY };
  }, [canvasRef, pan, zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('PersonNode mousedown:', { 
      person: person.name, 
      interactionMode, 
      isEditing,
      button: e.button,
      target: (e.target as HTMLElement).tagName 
    });
    
    if (e.button !== 0) return; // Only left click
    if (isEditing) return; // Don't drag in edit mode
    if ((e.target as HTMLElement).tagName === 'INPUT' || 
        (e.target as HTMLElement).tagName === 'SELECT' ||
        (e.target as HTMLElement).tagName === 'BUTTON') {
      return; // Don't drag when interacting with form elements
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (interactionMode === 'connect') {
      // Start connection drag
      console.log('Starting connection drag from:', person.name);
      setIsConnecting(true);
      const centerX = person.x + 75; // center of person node
      const centerY = person.y + 50;
      setDragStart({ x: centerX, y: centerY });
      const currentPos = screenToCanvasCoords(e.clientX, e.clientY);
      console.log('Connection drag positions:', { start: { x: centerX, y: centerY }, current: currentPos });
      onConnectionDrag(person.id, { x: centerX, y: centerY }, currentPos);
    } else if (interactionMode === 'navigate' || interactionMode === 'add-person') {
      // Start position drag (allowed in both navigate and add-person modes)
      setIsDragging(true);
      setDragStart({
        x: e.clientX - person.x,
        y: e.clientY - person.y
      });
    }
    
    onSelect();
  }, [person.x, person.y, person.id, person.name, interactionMode, isEditing, onSelect, onConnectionDrag, screenToCanvasCoords]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Snap to grid (optional)
      const gridSize = 20;
      const snappedX = Math.round(newX / gridSize) * gridSize;
      const snappedY = Math.round(newY / gridSize) * gridSize;
      
      onPersonUpdate({ 
        ...person, 
        x: snappedX, 
        y: snappedY 
      });
    } else if (isConnecting) {
      // Update connection drag line
      const currentPos = screenToCanvasCoords(e.clientX, e.clientY);
      onConnectionDrag(person.id, dragStart, currentPos);
    }
  }, [isDragging, isConnecting, dragStart, person, onPersonUpdate, onConnectionDrag, screenToCanvasCoords]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    console.log('PersonNode mouseup:', { person: person.name, isDragging, isConnecting, interactionMode });
    
    if (isDragging) {
      setIsDragging(false);
    } else if (isConnecting) {
      setIsConnecting(false);
      onConnectionDragEnd();
    } else if (interactionMode === 'connect') {
      // This person is being targeted for connection
      console.log('Person targeted for connection:', person.name);
      onSelect(); // This should trigger the connection completion
    }
  }, [isDragging, isConnecting, interactionMode, person.name, onConnectionDragEnd, onSelect]);

  const handleGlobalMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    } else if (isConnecting) {
      setIsConnecting(false);
      onConnectionDragEnd();
    }
  }, [isDragging, isConnecting, onConnectionDragEnd]);

  React.useEffect(() => {
    if (isDragging || isConnecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, isConnecting, handleMouseMove, handleGlobalMouseUp]);

  const handleNameChange = (name: string) => {
    onPersonUpdate({ ...person, name });
  };

  const handleDateChange = (field: 'birthDate' | 'deathDate', value: string) => {
    onPersonUpdate({ ...person, [field]: value });
  };

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (interactionMode === 'navigate') {
      e.stopPropagation();
      setIsEditing(true);
    }
  }, [interactionMode]);

  const handleEditSubmit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const formatDateRange = useCallback(() => {
    const birth = person.birthDate ? new Date(person.birthDate).getFullYear() : '';
    const death = person.deathDate ? new Date(person.deathDate).getFullYear() : '';
    
    if (birth && death) return `${birth} - ${death}`;
    if (birth) return `b. ${birth}`;
    if (death) return `d. ${death}`;
    return '';
  }, [person.birthDate, person.deathDate]);

  const getGenderIcon = () => {
    switch (person.gender) {
      case 'male': return '♂';
      case 'female': return '♀';
      default: return '';
    }
  };

  const getNodeClasses = () => {
    let classes = 'person-node';
    if (isSelected) classes += ' selected';
    if (isDragging) classes += ' dragging';
    if (isConnecting) classes += ' connecting';
    if (isEditing) classes += ' editing';
    if (interactionMode === 'connect') classes += ' connectable';
    return classes;
  };

  const getCursor = () => {
    if (interactionMode === 'connect') return 'crosshair';
    if (isDragging) return 'grabbing';
    if (isConnecting) return 'crosshair';
    if (interactionMode === 'add-person' || interactionMode === 'navigate') return 'grab';
    return 'grab';
  };

  if (isEditing) {
    return (
      <div
        className={getNodeClasses()}
        style={{ 
          left: person.x, 
          top: person.y,
          position: 'absolute'
        }}
      >
        <div className="person-edit-form">
          <div className="form-group">
            <input
              type="text"
              value={person.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Name"
              className="name-input"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <input
              type="date"
              value={person.birthDate || ''}
              onChange={(e) => handleDateChange('birthDate', e.target.value)}
              title="Birth Date"
            />
          </div>
          
          <div className="form-group">
            <input
              type="date"
              value={person.deathDate || ''}
              onChange={(e) => handleDateChange('deathDate', e.target.value)}
              title="Death Date"
            />
          </div>
          
          <div className="form-group">
            <select
              value={person.gender || ''}
              onChange={(e) => onPersonUpdate({ 
                ...person, 
                gender: e.target.value as Person['gender'] 
              })}
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="edit-actions">
            <button onClick={handleEditSubmit} className="done-btn">
              Done
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this person?')) {
                  onPersonDelete(person.id);
                }
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={getNodeClasses()}
      style={{ 
        left: person.x, 
        top: person.y,
        position: 'absolute',
        cursor: getCursor()
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
      data-person-id={person.id}
    >
      <div className="person-display">
        <div className="person-name">
          {getGenderIcon()} {person.name}
        </div>
        {formatDateRange() && (
          <div className="person-dates">
            {formatDateRange()}
          </div>
        )}
      </div>
    </div>
  );
};