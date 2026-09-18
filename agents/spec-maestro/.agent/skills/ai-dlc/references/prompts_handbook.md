# Caderno de Prompts Operacionais AI-DLC (Appendix A Handbook)

Este caderno contém os padrões de prompt estabelecidos no Apêndice A do documento metodológico oficial da AWS, ajustados para conduzir as sessões com a IA de forma padronizada.

---

## 1. Setup da Sessão e Estrutura de Diretórios

```markdown
We will work on building an application today. For every front end and backend component we will create a project folder. All documents will reside in the spec-docs folder. Throughout our session I'll ask you to plan your work ahead and create an md file for the plan. You may work only after I approve said plan. These plans will always be stored in spec-docs/plans folder. You will create many types of documents in the md format. Requirement, features changes documents will reside in spec-docs/requirements folder. User stories must be stored in the spec-docs/story-artifacts folder. Architecture and Design documents must be stored in the spec-docs/design-artifacts folder. All prompts in order must be stored in the spec-docs/prompts.md file. Confirm your understanding of this prompt. Create the necessary folders and files for storage, if they do not exist already.
```

---

## 2. Inception: Elaboração de User Stories

```markdown
Your Role: You are an expert product manager and are tasked with creating well defined user stories that becomes the contract for developing the system as mentioned in the Task section below. Plan for the work ahead and write your steps in an md file (user_stories_plan.md) with checkboxes for each step in the plan. If any step needs my clarification, add a note in the step to get my confirmation. Do not make critical decisions on your own. Upon completing the plan, ask for my review and approval. After my approval, you can go ahead to execute the same plan one step at a time. Once you finish each step, mark the checkboxes as done in the plan.

Your Task: Build user stories for the high-level requirement as described here: << describe product description >>
```

---

## 3. Inception: Agrupamento em Units e Bolts

```markdown
Your Role: You are an experienced software architect. Before you start the task as mentioned below, please do the planning and write your steps in the units_plan.md file with checkboxes against each step in the plan. If any step needs my clarification, please add it to the step to interact with me and get my confirmation. Do not make critical decisions on your own. Once you produce the plan, ask for my review and approval. After my approval, you can go ahead to execute the same plan one step at a time. Once you finish each step, mark the checkboxes as done in the plan.

Your Task: Refer to the user stories mvp_user_stories.md file. Group the user stories into multiple units that can be built independently. Each unit contains highly cohesive user stories that can be built by a single team. The units are loosely coupled with each other. For each unit, write their respective user stories and acceptance criteria in individual md files in the design/ folder.
```

---

## 4. Construction: Modelagem de Domínio (DDD)

```markdown
Your Role: You are an experienced software engineer. Before you start the task as mentioned below, please do the planning and write your steps in an design/component_model.md file with checkboxes against each step in the plan. If any step needs my clarification, please add it to the step to interact with me and get my confirmation. Do not make critical decisions on your own. Once you produce the plan, ask for my review and approval. After my approval, you can go ahead to execute the same plan one step at a time. Once you finish each step, mark the checkboxes as done in the plan.

Your Task: Refer to the user stories in design/<<unit_name>>_unit.md file. Design the component model to implement all the user stories. This model shall contain all the components, the attributes, the behaviours and how the components interact to implement the user stories. Do not generate any codes yet. Write the component model in a separate md file in the /design folder.
```

---

## 5. Construction: Logical Design, Padrões em Nuvem e ADRs

```markdown
Your Role: You are an experienced software and cloud architect. Before you start the task as mentioned below, please do the planning and write your steps in a logical_design_plan.md file with checkboxes against each step in the plan. If any step needs my clarification, please add it to the step to interact with me and get my confirmation. Do not make critical decisions on your own. Once you produce the plan, ask for my review and approval. After my approval, you can go ahead to execute the same plan one step at a time. Once you finish each step, mark the checkboxes as done in the plan. Do not generate application source code; focus strictly on architecture, cloud patterns, and ADR specifications.

Task: Refer to the Domain Model in spec-docs/design-artifacts/<<unit_component>>_domain_model.md. Elaborate the Logical Design specification and Architecture Decision Records (ADRs) meeting the Non-Functional Requirements (scalability, resilience, security). Document all interface contracts and cloud service mappings in spec-docs/design-artifacts/<<unit_component>>_logical_design.md.
```

---

## 6. Construction: Especificação de Arquitetura de Nuvem e Plano de Implantação

```markdown
Your Role: You are an experienced Cloud Architect. Before you start the task as mentioned below, please do the planning and write your steps in a deployment_plan.md file with checkboxes against each step in the plan. If any step needs my clarification, please add it to the step to interact with me and get my confirmation. Do not make critical decisions on your own. Once you produce the plan, ask for my review and approval. After my approval, you can go ahead to execute the same plan one step at a time. Once you finish each step, mark the checkboxes as done in the plan.

Task: Refer to the component design model, units, and logical architecture. Complete the following:
- Generate an end-to-end architectural plan for deployment of the system on cloud using [Terraform, CDK, CloudFormation].
- Specify all networking, sizing, IAM policies, and prerequisites for deployment.
- Define the test validation plan and acceptance criteria report structure that will be executed after implementation.
- Note: Do not write application or IaC code; provide the detailed specifications to be handed off to the coding/DevOps agent.
```
