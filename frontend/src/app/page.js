import HeaderLayout from "@/components/HeaderLayout"
import {useAtomValue} from "jotai";
import {authAtom} from "@/atoms/userState";
import * as React from "react";
import IntroContent from "@/components/introduce/IntroComponent";

export default function Home() {
  const auth = useAtomValue(authAtom);

  return (
      <>
        <IntroContent auth={auth} />
      </>
  );
}

Home.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}