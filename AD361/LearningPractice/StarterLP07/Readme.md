# Learning Practice: Test Planning

## Topics

- Test objectives and scope
- Test approach
- Roles and responsibilities
- Test environments and test data
- Risks and mitigation
- Entry and exit criteria
- Test schedules and communication

## Learning Objectives

- Explain the purpose of a test plan.
- Define the scope and objectives of testing.
- Select appropriate test types and techniques.
- Identify the people, tools, environments, and data needed for testing.
- Identify testing risks and possible responses.
- Create measurable entry and exit criteria.
- Organize testing activities into a simple schedule.

## The Product

The North Vacation Booking development team is preparing a new version of its booking application.

The application allows a user to:

- Select a rental.
- Enter check-in and checkout dates.
- Enter the number of guests.
- Create a booking.
- View their bookings.
- Increase, decrease, or reset values where applicable.

The team wants a plan describing how the application should be tested before release. You will create a short test plan for this release.

## Step 1: Define the Test Context

Describe what will be tested and why.

Include:

- Two test objectives
- Features that are in scope
- Features that are out of scope
- The test basis, such as requirements, user stories, source code, or designs
- At least one assumption or constraint

<details>
<summary>Test Context</summary>

| Section                  | Description                                    |
| ------------------------ | ---------------------------------------------  |
| Test objective           | 1. Verify functionality of booking a rental    |
|                          | 2. Verify functionality of viewing bookings    |
| In scope                 | 1. Selecting a rental                          |
|                          | 2. Entering check-in/check-out dates           |
|                          | 3. Setting number of guests                    |
|                          | 4. Creating a booking                          |
|                          | 4. View bookings                               |
| Out of scope             | 1. Creating a new rental                       |
|                          | 2. Cancelling a booking                        |
|                          | 3. Filtering search for rental                 |
| Test basis               | User stories                                   |
| Assumption or constraint | No code written, minimal resources             |

</details>

## Step 2: Identify Roles and Responsibilities

Identify at least **three roles** involved in testing.

For each role, explain:

- What the person is responsible for
- When they will be involved
- Who they need to communicate with

<details>
<summary>Roles & Responsibilities</summary>

| Role      | Responsibilities           | When Involved                    | Communication                 |
| ------    | -------------------------- | -------------------------------- | ----------------------------- |
| Tester    | Designs and executes tests | Before and during test execution | Reports defects to developers |
| Manager   | Schedules tests            | Before test execution            | Reports schedules to testers  |
| Developer | Fixes defects              | After test execution             | Notifies managers of fixes    |

</details>

## Step 3: Define the Test Approach

Explain how the application will be tested.

Include:

- The test levels that will be used
- At least two test types
- At least two test techniques
- Any manual or automated testing
- The test deliverables that will be created

Possible test deliverables include:

- Test cases
- Automated test files
- Test results
- Coverage reports
- Defect reports
- A test completion report

<details>
<summary>Test Approach</summary>

| Test Area         | Test Level or Type    | Technique                 | Manual or Automated   | Deliverable                       |
| ------------      | ------------------    | -----------------------   | -------------------   | --------------                    |
| Booking form      | Component testing     | Boundary value analysis   | Automated             | Jest test file                    |
| Rental listing    | Functional testing    | Exploratory testing   | Manual                | Test results  |
| Booking a rental  | Structural testing    | Path coverage             | Automated             | Jest test file                    |
| Booking a rental  | System testing        | Decision table testing    | Manual                | Decision table document           |

</details>

## Step 4: Identify Test Requirements

Describe what is needed to complete the testing.

Include:

- The test environment
- Browsers or devices
- Testing tools
- Test data
- Any access, accounts, or permissions
- Any people or training needed

<details>
<summary>Test Requirements</summary>

- Environment: Computer lab or other space where testing can take place
- Browsers/Devices: Windows laptops installed with Chrome
- Testing Tools: Visual Studio for running Jest files, word processor for recording results
- Test Data: Mock database with data copied from current development database or synthetic data
- Access Needs: Testers will require permissions to run Jest files
- People/Training: Trained testers, testing manager/coordinator, and developers available to address defects found

</details>

## Step 5: Create a Risk Register

Identify at least **three risks** that could affect the product or the testing process.

For each risk, include:

- A description of the risk
- Whether it is a product risk or project risk
- Its likelihood
- Its impact
- A possible mitigation

<details>
<summary>Risk Register</summary>

| Risk                                                  | Type         | Likelihood | Impact | Mitigation                                  |
| ----------------------------------------------        | ------------ | ---------- | ------ | ------------------------------------        |
| A user can create a booking with invalid dates        | Product risk | Medium     | High   | Prioritize date validation tests            |
| The test environment is unavailable                   | Project risk | Low        | High   | Confirm access before testing begins        |
| A user can create a booking with 0 guests             | Product risk | Low        | Medium | Prioritize form validation tests            |
| The testers are inexperienced                         | Project risk | Medium     | High   | Create a test plan and do basic training    |
| A user can book more guests than a rental's capacity  | Product risk | Medium     | High   | Prioritize form validation                  |

</details>

## Step 6: Define Entry Criteria

Entry criteria describe what must be ready before test execution can begin.

Create at least **three entry criteria** for this project.

Your criteria may address:

- Availability of testable code
- Completion of earlier testing
- Availability of the test environment
- Availability of test cases
- Availability of test data
- Installation of testing tools

Write criteria that can be clearly checked as met or not met.

## Step 7: Define Exit Criteria

Exit criteria describe when testing is complete or when it should stop.

Create at least **three measurable exit criteria**.

Your criteria may address:

- Percentage of planned tests completed
- Required code or requirements coverage
- Number or severity of unresolved defects
- Completion of high-risk testing
- Successful regression testing
- Release deadlines

<details>
<summary>Entry & Exit Criteria</summary>

| Type  | Criterion                                                 |
| ----- | -----------------------------------------------------     |
| Entry | The application can be opened in the test environment     |
| Entry | All planned test cases have been reviewed                 |
| Entry | Testers have received plans and basic traing              |
| Entry | Testers have access to the test environment               |
| Entry | Devices and platforms have been acquired for test         |
| Exit  | All planned high-priority tests have been executed        |
| Exit  | No critical defects remain unresolved                     |
| Exit  | Testing has been completed within the next deadline       |
| Exit  | All tests have >=90% statement, branch, and path coverage |
| Exit  | All discovered defects are logged and assigned severity   |

</details>

## Step 8: Create a Test Schedule

Create a simple schedule containing at least **five testing activities**.

Include:

- The activity
- The person or role responsible
- When it will happen
- Any activity that must be completed first

<details>
<summary>Test Schedule</summary>

| Activity                      | Responsible Role              | Time  | Dependency                            |
| -------------------           | ------------------------      | ----- | -------------------------------       |
| Review requirements           | Tester and product owner      | Day 1 | Requirements are available            |
| Design test cases             | Tester                        | Day 2 | Requirements have been reviewed       |
| Requisition devices/platforms | Project manager               | Day 3 | Resources available to requisition    |
| Setup test environment        | Tester and developer          | Day 4 | Devices and platforms are available   |
| Execute tests                 | Tester and project manager    | Day 5 | Previous requirements completed       |

</details>

## Step 9: Define the Communication Plan

Explain how testing information will be shared with the team.

Include:

- What information will be communicated
- Who will receive it
- How it will be communicated
- When or how often it will be communicated

<details>
<summary>Communication Plan</summary>

| Information               | Audience     | Method             | Frequency                         |
| -------------             | ------------ | --------------     | ----------------------            |
| Test progress             | Project team | Daily stand-up     | Daily                             |
| Defect report             | Developer    | GitHub issue       | When a defect is found            |
| Test completion           | Project team | Test report        | Completion of testing             |
| Requirements reviewed     | Testing team | Review document    | Completion of review              |
| Test cases designed       | Project team | Test context       | Completion of test case designs   |

</details>

## What to Submit

1. Create and initialize a GitHub repository.
2. Commit and push your work to the repository.
3. Make sure the repository is public. Private repositories will not receive credit.
4. Submit the URL on canvas

## AI Transparency

AI was used to help create portions of this file and to clean up its writing and formatting.
