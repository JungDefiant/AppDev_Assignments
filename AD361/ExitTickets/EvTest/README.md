**Given** that I am creating a new listing for a rental
**When** I input a listing that is between 5 to 50 characters long
**Then** the listing title should be accepted.

**Test Case 1:** "Home" is rejected
- Result: Failure
- Precondition: <5 characters long

**Test Case 2:** "Beautiful Alki Beach Rental" is successful
- Result: Success
- Precondition: >=5 & <=50 characters long

**Test Case 3:** "Tukwila Rental; close to Southcenter Mall and not far from SeaTac" is rejected
- Result: Failure
- Precondition: >50 characters long