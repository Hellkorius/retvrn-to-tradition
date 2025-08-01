import React, { useState } from 'react';
import { Person } from './types';

interface PersonFormProps {
  onSubmit: (person: Omit<Person, 'id'>) => void;
  onCancel: () => void;
  position: { x: number; y: number };
}

export const PersonForm: React.FC<PersonFormProps> = ({ onSubmit, onCancel, position }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    gender: '' as Person['gender'] | ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      birthDate: formData.birthDate || undefined,
      deathDate: formData.deathDate || undefined,
      gender: formData.gender || undefined,
      x: position.x,
      y: position.y
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="person-form-overlay">
      <form className="person-form" onSubmit={handleSubmit}>
        <h3>Add New Person</h3>
        
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deathDate">Death Date</label>
          <input
            id="deathDate"
            type="date"
            value={formData.deathDate}
            onChange={(e) => handleChange('deathDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Not specified</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Add Person
          </button>
        </div>
      </form>
    </div>
  );
};