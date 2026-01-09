# AI Vibe Coding - Full Stack JavaScript Techdegree Project 11

## Created By

- Name: Dragana Begojev
- Date Completed: 2026-01-09

---

## Tools Used

_List all the AI tools you utilized to complete the project._

- _GitHub Copilot_ primary AI coding assistant 
- _ChatGPT_ used for debugging, explanations, and refining solutions
- _Windsurf_ tested briefly, but not used extensively as it did not fit my workflow

---

## What Worked

_Describe what parts of the project went smoothly or turned out well. This could include specific features, code organization, approaches to prompts or workflow habits._

- Sequelize models were generated quickly and placed in the correct project structure.
- Database synchronization and authentication using an IIFE worked as expected once properly configured.
- Global error handling was successfully implemented and tested for both 404 and 500 errors.
- The "Set up the Patron Routes and Views" step was completed smoothly:
  - Routes, controllers, and views were generated correctly.
  - Validation and form handling worked as expected.
  - Although this step was nearly identical to "Set up the Book Routes and Views", which caused multiple issues, this implementation required minimal manual fixes. This was likely due to clearer instructions and lessons learned from resolving problems in the previous step.
- Search and pagination were implemented correctly using Sequelize operators and query parameters.
- Associations between Loan, Book, and Patron models were set up correctly.
- Set up the Loan Routes and Views – after some minor refactoring in routes/loans.js, all routes and views worked as expected.
- Patron Loan History – implemented successfully and displayed correctly in the patron view.
- Include Loan Links – navigation links to Loans and related pages were correctly added across the site.

---

## What Didn't Work

_Explain what parts of the project were challenging or didn't go as planned. Did you hit bugs, confusion, or dead ends?_

- Initial Sequelize model generation was incomplete:
  - Some required properties (such as IDs and validations) were missing and had to be added manually.
- GitHub Copilot added `notEmpty` validation but omitted `notNull` validation for required fields, which I added manually.
- Validation was incorrectly added to the `first_published` field, even though it was not required.
- The "Set up the Book Routes and Views" step caused the most issues and required significant manual intervention:
  - Several routes were generated with incorrect paths.
  - Some Pug templates were not fully dynamic and required refactoring.
  - Validation logic was inconsistent or missing in certain routes.
  - Variable mismatches in `update_book.pug` caused runtime errors.
  - The `method-override` middleware was not added automatically and had to be manually configured in `app.js`.
  - In contrast, the following nearly identical step ("Set up the Patron Routes and Views") was completed successfully.
- Loan Search and Pagination – the search functionality did not work initially. Manual refactoring was required to make searching by book title and patron name work correctly.

---

## Pros / Cons of Using an AI Coding Assistant

### Pros

_What were the benefits of using an AI assistant during this project?_

-  Significantly sped up boilerplate creation (models, routes, views).
-  Helpful for debugging, explaining errors, and validating design decisions.
- Reduced repetitive work and improved overall development speed.

### Cons

_What were the downsides, limitations, or challenges when relying on AI during this project?_

- AI sometimes misunderstood requirements or added unnecessary logic.
- Generated code often required manual review and correction.
- Validation and routing logic were not always aligned with project specifications.
- Still required strong understanding of Express, Sequelize, and Pug to identify and fix issues.

---

## Reflection

This project demonstrated that AI coding assistants are most effective when used iteratively and with clear, explicit instructions. While AI accelerated development, critical thinking and a solid understanding of full-stack JavaScript concepts were essential to successfully complete the project and meet all requirements.

