"use client"

import { atom } from "jotai";

// 비밀번호 찾기용 상태 atoms
export const pwPageAtom = atom(0); // 현재 탭의 페이지 (0: 초기화, 1: 비밀번호 입력, 2: 완료 메시지)
export const idPageAtom = atom(0); // 현재 탭의 페이지 (0: 초기화, 1: 비밀번호 입력, 2: 완료 메시지)
export const idAtom = atom(""); // 입력된 사용자 ID
export const emailAtom = atom(""); // 사용자 이메일
export const verifyAtom = atom(false); // 이메일 인증 여부
export const isEmailSentAtom = atom(false); // 이메일 전송 여부
export const messageAtom = atom(""); // 알림 메시지
export const emailVerifiedAtom = atom(false); // 이메일 인증 여부
export const isSendingAtom = atom(false); // 이메일을 보내는 중 상태
export const countAtom = atom(undefined); // 타이머 카운트 상태
export const isTimedOutAtom = atom(false); // 시간 초과 여부
export const newPasswordAtom = atom(""); // 새 비밀번호
export const newPasswordConfirmAtom = atom(""); // 새 비밀번호 확인

// 상태 초기화를 위한 atom (resetState 역할)
export const resetStateAtom = atom(null, (get, set) => {
  set(pwPageAtom, 0);
  set(idPageAtom, 0);
  set(idAtom, "");
  set(emailAtom, "");
  set(verifyAtom, false);
  set(isEmailSentAtom, false);
  set(messageAtom, "");
  set(emailVerifiedAtom, false);
  set(isSendingAtom, false);
  set(countAtom, undefined);
  set(isTimedOutAtom, false);
  set(newPasswordAtom, "");
  set(newPasswordConfirmAtom, "");
});