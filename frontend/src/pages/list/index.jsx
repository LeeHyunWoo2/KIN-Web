import React, {useEffect, useState} from "react";

import {columns} from "./components/columns"
import {DataTable} from "./components/data-table"
import {UserNav} from "./components/user-nav"
import HeaderLayout from "@/components/HeaderLayout";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 비동기 데이터를 API를 통해 불러옴
    async function fetchTasks() {
      try {
        // Next.js API 라우트를 호출하여 데이터를 가져옴
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          console.error('Failed to fetch tasks, status:', response.status);
          setLoading(false); // 로딩을 완료 상태로 업데이트
          return;
        }
        const tasksData = await response.json();
        setTasks(tasksData); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    }

    fetchTasks(); // 컴포넌트가 마운트될 때 데이터 불러오기
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
      <>
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UserNav />
            </div>
          </div>
          <DataTable data={tasks} columns={columns} />
        </div>
      </>
  );
}

TaskPage.getLayout = function getLayout(page) {
  return <HeaderLayout>{page}</HeaderLayout>;
}