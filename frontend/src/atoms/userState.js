import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// localStorage를 이용한 authAtom 생성 (UX를 위한 전역 상태이며, 실제 인증요소는 아님)
export const authAtom = atomWithStorage("auth", null, {
  getItem: (key) => {
    if(typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    }
    return null;
  },
  setItem: (key, value) => {
    if(typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  removeItem: (key) => {
    if(typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
});

// 튜토리얼 활성화 상태
export const tutorialActiveAtom = atom(false);

// 튜토리얼 스킵 상태
export const tutorialSkippedAtom = atom(false);