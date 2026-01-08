# AI Vibe Coding - Full Stack JavaScript Techdegree Project 11

## Created By

- Name: Dragana Begojev
- Date Completed:

---

## Tools Used

_List all the AI tools you utilized to complete the project._

- _GitHub Copilot_ primary AI coding assistant 
- _ChatGPT_ used for debugging, explanations, and refining solutions
- _Windsurf_ tested briefly, but not used extensively as it did not fit my workflow

---

## What Worked

_Describe what parts of the project went smoothly or turned out well. This could include specific features, code organization, approaches to prompts or workflow habits._

- Sequelize models (Book.js and Patron.js) were generated quickly and placed in the correct project structure.
- The database sync and authentication using an IIFE worked as expected once configured.
- Global error handling was successfully implemented and tested with both 404 and 500 errors.
- Set up the Patron Routes and Views was completed smoothly:
    - Routes, controllers, and views were generated correctly.
    - Validation and form handling worked as expected.
    - Despite being nearly identical to the Books step, this implementation required minimal manual fixes.
- Search and Pagination was implemented correctly using Sequelize operators and query parameters.

---

## What Didn't Work

_Explain what parts of the project were challenging or didn't go as planned. Did you hit bugs, confusion, or dead ends?_

- Initial Sequelize model generation was incomplete:
    - Some required properties (such as IDs and validations) were missing and had to be added manually.
- GitHub Copilot added notEmpty validation but omitted notNull validation for required fields, which I added manually.
- Validation was incorrectly added to first_published, even though it was not required.
- Set up the Book Routes and Views - This step caused the most issues and required significant manual intervention:
    - several routes were generated with incorrect paths,
    - some Pug templates were not fully dynamic and required refactoring,
    - validation logic was inconsistent or missing in some routes,
    - variable mismatches in update_book.pug caused runtime errors,
    - the method-override middleware was not added automatically and had to be manually configured in app.js.

In contrast, the next nearly identical step (Set up the Patron Routes and Views) worked correctly, likely due to clearer instructions and lessons learned from fixing in this step.
---

## Pros / Cons of Using an AI Coding Assistant

### Pros

_What were the benefits of using an AI assistant during this project?_

- _(Benefit 1)_ Significantly sped up boilerplate creation (models, routes, views).
- _(Benefit 2)_ Helpful for debugging, explaining errors, and validating design decisions.
- _(Benefit 3)_ Reduced repetitive work and improved overall development speed.

### Cons

_What were the downsides, limitations, or challenges when relying on AI during this project?_

- _(Downside 1)_ AI sometimes misunderstood requirements or added unnecessary logic.
- _(Downside 2)_ Generated code often required manual review and correction.
- _(Downside 3)_ Validation and routing logic were not always aligned with project specifications.
- _(Downside 4)_ Still required strong understanding of Express, Sequelize, and Pug to identify and fix issues.

## Reflection

This project demonstrated that AI coding assistants are most effective when used iteratively and with clear, explicit instructions. While AI accelerated development, critical thinking and a solid understanding of full-stack JavaScript concepts were essential to successfully complete the project and meet all requirements.

