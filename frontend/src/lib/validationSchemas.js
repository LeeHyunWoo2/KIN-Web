import { z } from "zod";

// 1번 페이지 스키마: 체크박스 및 리캡차
export const ValidationSchemas = z.object({
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "필수 약관에 동의해야 합니다.",
  }),
  recaptchaToken: z.string().min(1, "리캡차 인증이 필요합니다."),
  name: z.string().min(1, "이름은 필수입니다."),
  id: z
  .string()
  .min(4, "아이디는 최소 4자 이상이어야 합니다.")
  .regex(/^[a-zA-Z0-9_]+$/, "아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
  .regex(/[A-Z]/, "비밀번호에는 대문자가 포함되어야 합니다.")
  .regex(/[a-z]/, "비밀번호에는 소문자가 포함되어야 합니다.")
  .regex(/[0-9]/, "비밀번호에는 숫자가 포함되어야 합니다.")
  .regex(/[@$!%*?&#]/, "비밀번호에는 특수문자가 포함되어야 합니다."),
});