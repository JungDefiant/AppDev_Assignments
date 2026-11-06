# Learning Practice: Experience-Based Testing

## Topics

- Error guessing
- Exploratory testing
- Checklist-based testing
- Acceptance testing

## Learning Objectives

By the end of this practice, you should be able to:

- Use your experience with similar websites to predict possible failures.
- Investigate a feature through a focused exploratory testing session.
- Create and perform a reusable testing checklist.
- Write acceptance criteria from an end user's perspective.
- Determine whether a feature satisfies its acceptance criteria.
- Record your testing clearly enough that another person can understand what you tested and what happened.

## Resources

- [What Is Acceptance Testing?](https://agilealliance.org/glossary/acceptance-testing/)
- [Applying BDD Acceptance Criteria in User Stories](https://www.thoughtworks.com/en-us/insights/blog/applying-bdd-acceptance-criteria-user-stories)

## Step 1: Error Guessing

Choose one feature of the `airbnb-clone-ts` application, such as creating or viewing a booking.

Based on your experience with similar websites, list **three things you think might go wrong**.

These are predictions based on your experience, knowledge, and instincts. You do not need to prove that they are defects at this point.

<details>
<summary>Error guessing</summary>

- Invalid input for new booking field
- Booking with the same name and address already exists
- Missing data when creating a new booking

</details>

## Step 2: Exploratory Testing

Write a one-sentence **testing charter** describing what you want to investigate about your selected feature.

Spend **10 to 15 minutes** testing the feature. As you work, briefly record:

- What you tried
- What happened
- What you decided to investigate next

Your testing should remain focused on the goal described in your charter. If you discover a new area that you want to investigate, record it as an idea for a future testing session.

<details>
<summary>Exploratory testing notes</summary>

Explore the flow for creating a new booking for ways that the user can submit an invalid booking.


| What I Tried | What Happened | What I Decided to Try Next |
| ------------ | ------------- | -------------------------- |
| Inputting a past date, then submitting | Date was set to one week before and booking was successfully submitted | Setting Guests to 0 |
| Decrease guests below 1 by directly modifying input field, then submitting | Guests field was set to 0, but message appears preventing the booking to be submitted and requiring the guests to be set to 1 or more | Setting Guests to 99, then submitting |
| Set Guests field to 99 by directly modifying input field, then submitting | Guests field was set to 99 and booking was successfully submitted | Submitting with no input for date |

</details>

## Step 3: Checklist-Based Testing

Create a checklist containing at least **five checks** for the same feature.

You may use ideas from:

- Your error guesses
- Your exploratory testing session
- Problems you have experienced with similar applications
- Common usability or validation concerns

Perform each check and record one of the following results:

- **Passed**
- **Failed**
- **Unable to Test**

Include a brief note when a result needs additional explanation.

<details>
<summary>Checklist format</summary>

| Check | Result | Notes |
| ----- | ------ | ----- |
| Booking cannot submit more than 10 guests | Failed | Arbitrary number used for maximum guests |
| Booking cannot submit less than 1 guest | Passed ||
| Booking cannot submit a past date | Failed ||
| Booking cannot submit with no date specified | Passed ||
| More than one booking cannot be submitted for the same date | Failed ||

</details>

## Step 4: Acceptance Testing

The previous steps approach the feature from a tester's perspective by predicting failures, exploring behavior, and completing specific checks.

Acceptance testing approaches the feature from the end user's perspective. It asks whether the feature allows the user to accomplish the goal it was created to support.

Acceptance criteria are often written using the **Given, When, Then** format:

- **Given:** The starting condition
- **When:** The action the user performs
- **Then:** The specific result that should occur

For example:

```text
Given I am on the booking form,
when I submit a rental, date, and number of guests,
then the reservation should appear in my list of bookings.
```

For the same feature you selected in Step 1:

- Write **three to five acceptance criteria** using the Given, When, Then format.
- Write each criterion from the user's perspective.
- Make each expected result specific enough to determine whether it passed or failed.
- Perform each criterion against the running application.
- Mark each result as **Passed**, **Failed**, or **Unable to Test**.
- If a criterion fails, explain what happened.

<details>
<summary>Acceptance criteria format</summary>

| Given, When, Then                | Result | Notes |
| -------------------------------- | ------ | ----- |
| Given I am creating a new booking, when I submit a booking with no date, then the booking should be prevented from submitting. | Passed | |
| Given I am creating a new booking, when I submit a booking with an available date, then the booking should be submitted. | Passed | |
| Given I am creating a new booking, when I submit a booking with 0 guests, then the booking should be prevented from submitting. | Passed | |
| Given I am creating a new booking, when I submit a booking with 10 or more guests, then the booking should be prevented from submitting. | Failed | Arbitrary max guests of 10 used |
| Given I am creating a new booking, when I submit more than one booking for the same date, then every booking after the first should be prevented from submitting. | Failed | |

</details>

A checklist item usually describes one specific check, such as submitting a form with an empty date. An acceptance criterion describes whether the user can accomplish a complete goal, such as successfully booking a rental.

Your checklist and acceptance criteria may overlap because they examine the same feature for different purposes.

## What to Submit

1. Create and initialize a GitHub repository.
2. Commit and push your work to the repository.
3. Make sure the repository is public. Private repositories will not receive credit.
4. Submit the URL on Canvas.

## AI Transparency

AI was used to help create portions of this file and to clean up its writing and formatting.
