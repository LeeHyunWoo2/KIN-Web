import { faker } from '@faker-js/faker';
import { taskSchema } from './schema';
import {labels, priorities, statuses} from "@/lib/list/data";

export const lists = Array.from({ length: 100 }, () => ({
  id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  status: faker.helpers.arrayElement(statuses).value,
  label: faker.helpers.arrayElement(labels).value,
  priority: faker.helpers.arrayElement(priorities).value,
}));

export const validTasks = lists.filter((task) => taskSchema.safeParse(task).success);