import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 기본 인증 상태를 null로 초기화한 authAtom 생성
export const authAtom = atom(null);

// 로컬 스토리지와 동기화되는 atom
export const userProfileAtom = atomWithStorage('userInfo', null);

// 튜토리얼 활성화 상태
export const tutorialActiveAtom = atom(false);

// 튜토리얼 스킵 상태
export const tutorialSkippedAtom = atom(false);