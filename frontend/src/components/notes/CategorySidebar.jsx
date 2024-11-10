import React, { useEffect, useState } from 'react';
import { buildCategoryTree } from '@/lib/notes/categoryUtils';
import {fetchCategories} from "@/services/notes/categoryService";

function CategoryItem({ category }) {
  const [isOpen, setIsOpen] = useState(false);

  // 카테고리 상태 토글
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
      <div style={{ marginLeft: category.parent_id ? '20px' : '0px' }}>
        <div onClick={toggleOpen} style={{ cursor: 'pointer' }}>
          <h3>{category.name}</h3>
        </div>
        {isOpen && category.children.length > 0 && (
            <div>
              {category.children.map((child) => (
                  <CategoryItem key={child._id} category={child} />
              ))}
            </div>
        )}
      </div>
  );
}

export default function CategorySidebar() {
  const [categories, setCategories] = useState([]);

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

  return (
      <div>
        {categories.map((category) => (
            <CategoryItem key={category._id} category={category} />
        ))}
      </div>
  );
}