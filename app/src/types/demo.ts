export interface Task {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Step {
  id: number;
  title: string;
  tasks: Task[];
}

export interface LearningPlan {
  steps: Step[];
}
