<details>

<summary>Number of Nights</summary>

| Classification   | Partition             | Range or Condition  | Expected Result                     |
| ---------------- | --------------------- | ------------------- | ----------------------------------- |
| Number of nights | Invalid low           | Fewer than 1 night  | `ValueError`                        |
| Number of nights | Invalid high          | More than 31 nights | `ValueError`                        |
| Number of nights | Valid, standard rate  | 1-31 nights         | Costs $200 per night                |
| Number of nights | Invalid low  | Less than `checkout date - check-in date` | `ValueError`           |
| Number of nights | Invalid high | More than `checkout date - check-in date` | `ValueError`           |

**TEST CASE 1**
- **Classification:** Number of nights
- **Partition:** Invalid low
- **Input:** 0 nights
- **Expected Result:** Reservation is rejected with `ValueError`.

**TEST CASE 2**
- **Classification:** Number of nights
- **Partition:** Invalid high 
- **Input:** 32 nights
- **Expected Result:** Reservation is rejected with `ValueError`.

**TEST CASE 3**
- **Classification:** Number of nights
- **Partition:** Valid, standard rate
- **Input:** 24
- **Expected Result:** Reservation is accepted at the standard rate of $200 per night.

**TEST CASE 4**
- **Classification:** Number of nights
- **Partition:** Invalid low
- **Input:** 0 days when the check-in date is 10/14 and the checkout date is 10/16.
- **Expected Result:** Reservation is rejected with `ValueError`.

**TEST CASE 5**
- **Classification:** Number of nights
- **Partition:** Invalid high
- **Input:** 2 days when the check-in date is 10/14 and the checkout date is 10/16.
- **Expected Result:** Reservation is rejected with `ValueError`.

</details>

<details>

<summary>Number of Guests</summary>

| Classification   | Partition             | Range or Condition  | Expected Result                     |
| ---------------- | --------------------- | ------------------- | ----------------------------------- |
| Number of guests | Invalid low           | Fewer than 1 guest  | `ValueError`                        |
| Number of guests | Invalid high          | More than 12 guests | `ValueError`                        |
| Number of guests | Valid, standard rate  | 1–5 guests          | No additional guest fee             |
| Number of guests | Valid, additional fee | 6–12 guests         | Additional $25 per guest, per night |

**TEST CASE 1**
- **Classification:** Number of guests
- **Partition:** Invalid low
- **Input:** 0 guests
- **Expected Result:** Reservation is rejected with `ValueError`.

**TEST CASE 2**
- **Classification:** Number of guests
- **Partition:** Invalid high 
- **Input:** 15 guests
- **Expected Result:** Reservation is rejected with `ValueError`.

**TEST CASE 3**
- **Classification:** Number of guests
- **Partition:** Valid, standard rate
- **Input:** 3 guests
- **Expected Result:** Reversation is accepted with no additional guest fee.

**TEST CASE 4**
- **Classification:** Number of guests
- **Partition:** Valid, additional fee
- **Input:** 8 guests
- **Expected Result:** Reversation is accepted for an additional $25 per guest, per night.

</details>

<details>

<summary>Check-in and Checkout Dates</summary>

| Classification              | Partition             | Range or Condition  | Expected Result                     |
| --------------------------- | --------------------- | ------------------- | ----------------------------------- |
| Check-in and checkout dates | Invalid | The check-in date must be before the checkout date.  | `ValueError`     |
| Check-in and checkout dates | Invalid | The checkout date is not counted as a reserved night. | `ValueError`    |

**TEST CASE 1**
- **Classification:** Check-in and checkout dates
- **Partition:** Invalid
- **Input:** The check-in date must be before the checkout date.
- **Expected Result:** Reservation is rejected with `ValueError`.

**TEST CASE 2**
- **Classification:** Check-in and checkout dates
- **Partition:** Invalid
- **Input:** The checkout date is not counted as a reserved night.
- **Expected Result:** Reservation is rejected with `ValueError`.

</details>

<details>

<summary>Availability</summary>

| Classification   | Partition             | Range or Condition  | Expected Result                     |
| ---------------- | --------------------- | ------------------- | ----------------------------------- |
| Availability | Invalid | Every night in the requested date range must be available. | `UnavailableError`   |

**TEST CASE 1**
- **Classification:** Availability
- **Partition:** Invalid
- **Input:** Every night in the requested date range must be available.
- **Expected Result:** Reservation is rejected with `UnavailableError`.

</details>
