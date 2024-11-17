import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { PREDEFINED_TAGS } from '../types';

interface TagFilterProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
          selectedTags.length > 0 ? 'border-emerald-500 text-emerald-600' : 'border-gray-200 text-gray-700'
        }`}
      >
        <span>Filter by tags</span>
        {selectedTags.length > 0 && (
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">
            {selectedTags.length}
          </span>
        )}
      </button>

      {selectedTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="ml-1 hover:text-emerald-600"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow-lg">
          <div className="p-2 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {PREDEFINED_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-left px-3 py-2 text-sm rounded ${
                    selectedTags.includes(tag)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'hover:bg-emerald-50 text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}