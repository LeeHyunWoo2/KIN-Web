const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { taskSchema } = require('./schema');

const tasks = Array.from({ length: 100 }, () => ({
  id: faker.datatype.uuid(),
  title: faker.company.catchPhrase(),
  status: faker.helpers.arrayElement(['backlog', 'in progress', 'complete']),
  label: faker.helpers.arrayElement(['feature', 'bug', 'chore']),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
}));

const validTasks = tasks.filter((task) => taskSchema.safeParse(task).success);

fs.writeFileSync('tasks.json', JSON.stringify(validTasks, null, 2));