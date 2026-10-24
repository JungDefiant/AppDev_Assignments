<summary>Decision Table Testing</summary>

## Decision Table

| Conditions                                    | 1     | 2     | 3     | 4     | 5     | 6     |
| ---                                           | ---   | ---   | ---   | ---   | ---   | ---   |
| Reservation between 1 and 31 nights           | T     | T     | T     | F     | T     | T     |
| Reservation between 1 and 12 guests           | T     | T     | F     | T     | T     | T     |
| More than 5 guests                            | T     | F     | F     | T     | F     | F     |
| Every night is available                      | T     | F     | T     | T     | T     | F     |
| Nights = ``check-in date - checkout date``    | T     | F     | T     | T     | T     | T     |

| Actions                                       | 1     | 2     | 3     | 4     | 5     | 6     |
| ---                                           | ---   | ---   | ---   | ---   | ---   | ---   |
| Reservation costs $200 per night              | X     | -     | -     | -     | X     | -     |
| Additional $25 per night per guest            | X     | -     | -     | -     | -     | -     |
| One-time $50 cleaning fee                     | X     | -     | -     | -     | X     | -     |
| Raise a `ValueError`                          | -     | -     | X     | -     | -     | -     |
| Raise an `UnavailableError`                   | -     | X     | -     | X     | -     | X     |


## Test Cases

### TC01: Rule 1 — Valid reservation with more than five guests

- **Check-in:** October 1
- **Checkout:** October 4
- **Nights:** 3
- **Number of guests:** 8
- **Availability:** Every requested night is available.
- **Expected Result:** The reservation is created.
- **Expected Price:** `$875`
  - Three nights at $200: `$600`
  - Extra guest fee for three guests over five at $25 per night: `$225`
  - One-time cleaning fee: `$50`

### TC02: Rule 2 — Checkout before check-in with unavailable nights

- **Check-in:** October 4
- **Checkout:** October 1
- **Nights:** -3 (the checkout date is before the check-in date)
- **Number of guests:** 3
- **Availability:** At least one requested night is unavailable.
- **Expected Result:** An `UnavailableError` is raised.

### TC03: Rule 3 — Zero guests

- **Check-in:** October 1
- **Checkout:** October 4
- **Nights:** 3
- **Number of guests:** 0
- **Availability:** Every requested night is available.
- **Expected Result:** A `ValueError` is raised.

### TC04: Rule 4 — More than 31 nights with more than five guests

- **Check-in:** October 1
- **Checkout:** November 10
- **Nights:** 40
- **Number of guests:** 8
- **Availability:** Every requested night is available.
- **Expected Result:** An `UnavailableError` is raised.

### TC05: Rule 5 — Valid reservation with five guests

- **Check-in:** October 1
- **Checkout:** October 4
- **Nights:** 3
- **Number of guests:** 5
- **Availability:** Every requested night is available.
- **Expected Result:** The reservation is created.
- **Expected Price:** `$650`
  - Three nights at $200: `$600`
  - One-time cleaning fee: `$50`

### TC06: Rule 6 — Valid reservation with unavailable nights

- **Check-in:** October 1
- **Checkout:** October 4
- **Nights:** 3
- **Number of guests:** 3
- **Availability:** At least one requested night is unavailable.
- **Expected Result:** An `UnavailableError` is raised.
