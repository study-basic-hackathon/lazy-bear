import { relations } from "drizzle-orm";
import { projects } from "./projects";
import { personas } from "./personas";
import { steps } from "./steps";
import { tasks } from "./tasks";
import { weights } from "./weights";

export const projectsRelations = relations(projects, ({ one, many }) => ({
  persona: one(personas, {
    fields: [projects.personaId],
    references: [personas.personaId],
  }),
  weights: many(weights),
  steps: many(steps),
}));

export const personasRelations = relations(personas, ({ many }) => ({
  projects: many(projects),
}));

export const stepsRelations = relations(steps, ({ one, many }) => ({
  project: one(projects, {
    fields: [steps.projectId],
    references: [projects.projectId],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  step: one(steps, {
    fields: [tasks.stepId],
    references: [steps.stepId],
  }),
}));

export const weightsRelations = relations(weights, ({ one }) => ({
  project: one(projects, {
    fields: [weights.projectId],
    references: [projects.projectId],
  }),
}));
