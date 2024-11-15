import HeaderLayout from "@/components/HeaderLayout"
import {useEffect} from "react";
import {useAtom} from "jotai";
import {authAtom} from "@/atoms/authAtom";
import {useRouter} from "next/router";


export default function Home() {
  const router = useRouter();
  const [auth] = useAtom(authAtom);

   useEffect(() => {
      router.push(auth ? '/notes' : '/login');
  }, []);

  return null;
}

Home.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}
