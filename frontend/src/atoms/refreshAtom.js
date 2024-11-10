import { atom } from 'jotai';

export const refreshAtom = atom(0);

export const triggerRefresh = () => {
  refreshAtom.update(prev => prev + 1);
};