import { FamilyTree } from './types';

const STORAGE_KEY = 'family-tree-data';

export const saveFamilyTree = (tree: FamilyTree): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch (error) {
    console.error('Failed to save family tree:', error);
  }
};

export const loadFamilyTree = (): FamilyTree => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load family tree:', error);
  }
  
  return { people: [], relationships: [] };
};

export const exportFamilyTree = (tree: FamilyTree): void => {
  const dataStr = JSON.stringify(tree, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFamilyTree = (): Promise<FamilyTree> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const tree = JSON.parse(event.target?.result as string);
          resolve(tree);
        } catch (error) {
          reject(new Error('Invalid file format'));
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  });
};