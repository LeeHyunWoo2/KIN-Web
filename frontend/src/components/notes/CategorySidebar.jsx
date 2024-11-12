import React, { useEffect, useState } from 'react';
import { buildCategoryTree } from '@/lib/notes/categoryUtils';
import { fetchCategories } from "@/services/notes/categoryService";
import { useAtom } from 'jotai';
import { noteEventAtom } from '@/atoms/noteStateAtom';

function CategoryItem({ category, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
      <div style={{ marginLeft: category.parent_id ? '20px' : '0px' }}>
        <div onClick={() => { onSelect(category._id); toggleOpen(); }} style={{ cursor: 'pointer' }}>
          <h3>{category.name}</h3>
        </div>
        {isOpen && category.children.length > 0 && (
            <div>
              {category.children.map((child) => (
                  <CategoryItem key={child._id} category={child} onSelect={onSelect} />
              ))}
            </div>
        )}
      </div>
  );
}

export default function CategorySidebar() {
  const [categories, setCategories] = useState([]);
  const [, setNoteEvent] = useAtom(noteEventAtom);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        const categoryTree = buildCategoryTree(categoryData);
        setCategories(categoryTree);
      } catch (error) {
        console.error('카테고리 불러오기 실패', error);
      }
    };
    loadCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setNoteEvent({
      type: 'FILTER_BY_CATEGORY',
      targetId: categoryId
    });
  };

  return (
      <div>
        {categories.map((category) => (
            <CategoryItem key={category._id} category={category} onSelect={handleCategorySelect} />
        ))}
      </div>
  );
}
