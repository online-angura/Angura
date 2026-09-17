---
name: customization-authoring
description: "Use when creating or updating a reusable SKILL.md for a workflow, team process, or project pattern. Covers deciding scope, extracting decision points, drafting frontmatter, writing the workflow body, and validating the final skill before saving."
---

# Customization Authoring

## Purpose

Turn a repeated workflow into a reusable Copilot skill so the process can be applied consistently without re-explaining the same steps each time.

Use this skill when you want to create, refine, or update a skill for:
- debugging or review workflows
- implementation checklists
- project setup and validation
- team conventions or reusable patterns
- agent customization guidance

## Decision Flow

1. Identify the real workflow
   - Is there a multi-step process the user repeats?
   - Does it include a clear sequence, branches, or completion checks?
   - Is it specific enough to be useful as a skill rather than a general instruction?

2. Determine scope
   - Workspace-scoped: use for project-specific methods that should be available inside the repo
   - User-scoped: use for personal preferences or cross-workspace habits

3. Choose the correct customization primitive
   - Most work, always-on guidance → instructions
   - One focused task with inputs → prompt
   - Reusable multi-step workflow with bundled assets → skill
   - Different context isolation or tool restrictions → custom agent

4. Extract the workflow details
   - Step-by-step process
   - Decision points and branching logic
   - Quality gates or completion checks
   - Common pitfalls to avoid

5. Draft the skill file
   - Create or update the skill in the correct folder
   - Add valid YAML frontmatter
   - Write a clear description that matches likely trigger phrases
   - Include sections such as purpose, workflow, checks, and examples

6. Validate before finishing
   - Confirm the file is in the correct location
   - Ensure the frontmatter is valid YAML
   - Verify the description is specific and discoverable
   - Check the workflow is practical, not vague or overly generic

## Workflow Template

Use this pattern when writing the body of the skill:

### 1. Purpose
Explain what the skill is for and when it should be used.

### 2. Decision Flow
Document the main decisions in order, including branch points.

### 3. Step-by-Step Process
List the actions to take in a clear sequence.

### 4. Quality Checks
Include the conditions that signal success or completion.

### 5. Examples or Edge Cases
Add a few examples, exceptions, and pitfalls so the workflow is reliable.

## Writing Standards

- Keep the description action-oriented and specific.
- Prefer concrete triggers over generic phrases like “help me code.”
- Make the workflow observable and testable.
- Include success criteria so the agent knows when to stop.
- Avoid “always do X” rules unless they truly apply globally.

## Validation Checklist

Before finalizing the skill, confirm all of the following:

- The skill has a clear purpose and target use case.
- The workflow is actually reusable and not just a one-off note.
- The file is in the correct folder for the chosen scope.
- Frontmatter is valid YAML and the description is well written.
- The skill includes decision points, actions, and completion checks.
- The wording is specific enough for discovery and use.

## Example

A good skill description:

> Use when turning a repeated debugging or review process into a reusable Copilot skill. Covers workflow extraction, branch logic, validation steps, and completion checks for project-specific workflows.

A weak skill description:

> Helps with tasks.

## Scope Guidance

Prefer workspace-scoped skills for project-specific methods, especially when the workflow depends on repo structure, scripts, or conventions.

Prefer user-level customizations when the workflow is personal and general across projects.

## Final Output

Once the skill is drafted and validated, summarize:
- what the skill produces
- when to use it
- what completion looks like
- related customizations to create next
