import React from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { categoryListAtom, selectedCategoryAtom } from '@/atoms/filterAtoms';

function CategoryItem({ category, onSelect }) {
  return (
      <div style={{ marginLeft: category.parent_id ? '20px' : '0px' }}>
        <div onClick={() => onSelect(category._id)} style={{ cursor: 'pointer' }}>
          <h3>{category.name}</h3>
        </div>
      </div>
  );
}

export default function CategorySidebar() {
  const categories = useAtomValue(categoryListAtom); // 카테고리 구조 상태
  const setSelectedCategory = useSetAtom(selectedCategoryAtom);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // 선택된 카테고리를 전역 상태에 저장
  };

  return (
      <div>
        {categories.map((category) => (
            <CategoryItem key={category._id} category={category} onSelect={handleCategorySelect} />
        ))}
      </div>
  );
}

/*

import React, { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { categoryListAtom, selectedCategoryAtom } from '@/atoms/filterAtoms';
import { createCategory } from '@/services/notes/categoryService';
import { calculateCategoryDepth } from '@/lib/notes/categoryUtils';

function CategoryItem({ category, onSelect, isSelected }) {
  return (
      <div style={{ marginLeft: category.parent_id ? '20px' : '0px' }}>
        <div
            onClick={() => onSelect(category._id)}
            style={{
              cursor: 'pointer',
              fontWeight: isSelected ? 'bold' : 'normal', // 선택된 카테고리는 볼드체로
            }}
        >
          <h3>{category.name}</h3>
        </div>
      </div>
  );
}

export default function CategorySidebar() {
  const categories = useAtomValue(categoryListAtom); // 카테고리 구조 상태
  const setSelectedCategory = useSetAtom(selectedCategoryAtom);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // 선택된 카테고리를 전역 상태에 저장
  };

  const handleAddCategory = async (parentId) => {
    try {
      // 1. 깊이 제한 확인
      const currentDepth = calculateCategoryDepth(parentId, categories);
      if (currentDepth > 3) {
        alert('카테고리는 최대 3단계까지만 추가할 수 있습니다.');
        return;
      }

      // 2. 새 카테고리 생성
      const newCategoryData = {
        name: newCategoryName,
        parent_id: parentId || null, // 상위 카테고리가 없으면 null
      };
      const newCategory = await createCategory(newCategoryData);

      // 3. 상태 업데이트
      setNewCategoryName(''); // 입력 필드 초기화
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
      <div>
        {/!* 카테고리 리스트 *!/}
        {categories.map((category) => (
            <CategoryItem
                key={category._id}
                category={category}
                onSelect={handleCategorySelect}
                isSelected={useAtomValue(selectedCategoryAtom) === category._id}
            />
        ))}

        {/!* 새 카테고리 추가 *!/}
        <div>
          <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="새 카테고리 이름"
          />
          <button onClick={() => handleAddCategory(null)}>최상위 추가</button>
          <button onClick={() => handleAddCategory(useAtomValue(selectedCategoryAtom))}>
            하위 추가
          </button>
        </div>
      </div>
  );
}
*/
