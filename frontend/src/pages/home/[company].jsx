import { useRouter } from "next/router";
import { useEffect } from "react";

// /home/"회사명" 과 같은 특수 경로를 작성해 포트폴리오 봤는지 체크
const RedirectHome = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("companyTraceEnabled", true)
    router.replace("/docs");
  }, []);

  return null;
};

export default RedirectHome;