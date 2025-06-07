import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { type Task } from '@/common/models/Task';

// Sample task data
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project requirements',
    detail: 'Review all project requirements and make sure everything is clear',
    isComplete: false,
    dueAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  },
  {
    id: '2',
    title: 'Set up development environment',
    detail: 'Install all necessary tools and dependencies',
    isComplete: true,
    dueAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: '3',
    title: 'Create component wireframes',
    isComplete: false,
    dueAt: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
  },
  {
    id: '4',
    title: 'Learn about MSW',
    detail: 'Study Mock Service Worker documentation',
    isComplete: false,
  },
];

// Define handlers
export const handlers = [
  // GET /tasks
  http.get('*/tasks', () => {
    return HttpResponse.json(mockTasks);
  }),

  // GET /tasks/:id
  http.get('*/tasks/:id', ({ params }) => {
    const { id } = params;
    const task = mockTasks.find((task) => task.id === id);

    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(task);
  }),
];

// Set up the mock server
export const server = setupServer(...handlers);
