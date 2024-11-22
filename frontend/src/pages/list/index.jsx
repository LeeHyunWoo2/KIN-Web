import React, {useEffect, useState} from "react";

import {columns} from "@/components/list/columns"
import {DataTable} from "@/components/list//data-table"
import HeaderLayout from "@/components/HeaderLayout";
import {validTasks} from "@/lib/list/seed";
import {FancyMultiSelect} from "@/components/fancy-multi-select";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
// 컴포넌트가 마운트될 때 tasks 데이터 설정
  useEffect(() => {
    setTasks(validTasks); // tasks.js에서 가져온 데이터를 상태로 설정
  }, []);

  return (

      <div>
        <div
            className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div
              className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div
                className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex min-w-[1100px]">
              <div className="flex items-center justify-between space-y-2">
              {/*  <div className="flex items-center space-x-2">
              프로필 버튼 있던자리
                </div>*/}
              </div>
              <DataTable data={tasks} columns={columns}/>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mb-72 max-w-[1100px]">
          <div className="flex items-center justify-between space-y-2">
            <FancyMultiSelect/>
          </div>
          </div>
        </div>
        );
        }

        TaskPage.getLayout = function getLayout(page) {
        return <HeaderLayout>{page}</HeaderLayout>;
}