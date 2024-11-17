import React from 'react';
import { X } from 'lucide-react';
import { PREDEFINED_TAGS, MAX_TAGS } from '../types';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export function TagSelector({ selectedTags, onChange, error }: TagSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < MAX_TAGS) {
      const newTags = [...selectedTags, tag];
      onChange(newTags);
      
      // Close dropdown if we've reached the maximum
      if (newTags.length >= MAX_TAGS) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const filteredTags = PREDEFINED_TAGS.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const handleOpenClick = () => {
    // Only allow opening if we haven't reached the maximum
    if (selectedTags.length < MAX_TAGS) {
      setIsOpen(!isOpen);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-lg bg-white">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-emerald-600"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
        {selectedTags.length < MAX_TAGS && (
          <button
            type="button"
            onClick={handleOpenClick}
            className="text-sm text-gray-500 hover:text-emerald-600"
          >
            {selectedTags.length === 0 ? 'Add tags' : '+ Add more'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {isOpen && selectedTags.length < MAX_TAGS && (
        <div className="relative">
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {filteredTags.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">No matching tags</p>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {filteredTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="text-left px-3 py-2 text-sm rounded hover:bg-emerald-50 text-gray-700 hover:text-emerald-700"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {selectedTags.length} of {MAX_TAGS} tags selected
      </p>
    </div>
  );
}