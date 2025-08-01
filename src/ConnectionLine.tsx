import React from 'react';
import { Person, Relationship } from './types';

interface ConnectionLineProps {
  relationship: Relationship;
  fromPerson: Person;
  toPerson: Person;
  onDelete: (id: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  relationship,
  fromPerson,
  toPerson,
  onDelete
}) => {
  const x1 = fromPerson.x + 75; // center of person node
  const y1 = fromPerson.y + 50;
  const x2 = toPerson.x + 75;
  const y2 = toPerson.y + 50;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const getLineColor = () => {
    switch (relationship.type) {
      case 'parent': return '#2196F3';
      case 'spouse': return '#E91E63';
      case 'child': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={getLineColor()}
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      <circle
        cx={midX}
        cy={midY}
        r={8}
        fill="white"
        stroke={getLineColor()}
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={() => onDelete(relationship.id)}
      />
      <text
        x={midX}
        y={midY + 1}
        textAnchor="middle"
        fontSize="8"
        fill={getLineColor()}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => onDelete(relationship.id)}
      >
        ×
      </text>
      <text
        x={midX}
        y={midY - 15}
        textAnchor="middle"
        fontSize="10"
        fill={getLineColor()}
        style={{ userSelect: 'none' }}
      >
        {relationship.type}
      </text>
    </g>
  );
};