<summary>State Transition Testing</summary>

### Reservation States

- `Pending`
- `Reserved`
- `Checked In`
- `Checked Out`
- `Cancelled`

### Events That Change Reservation States

- Submitting a reservation
- Cancelling a reservation
- Checking in to a reservation
- Checking out from a reservation
- Paying for a reservation


### State Transition Table

| Current State | Event                         | Expected State    | Expected Result                                       |
| ---           | ---                           | ---               | ---                                                   |
| Pending       | Payment succeeds              | Reserved          | Reservation is confirmed                              |
| Pending       | Reservation not completed     | Cancelled         | Reservation is cancelled                              |
| Reserved      | Guest checks in               | Checked In        | Guest is checked into the reservation                 |
| Checked In    | Guest checks out              | Checked Out       | Guest is checked out from the reservation             |
| Reserved      | Guest cancels                 | Cancelled         | Reservation is cancelled                              |
| Checked In    | Guest checks out early        | Checked Out       | Guest is checked out at earlier date                  |
| Pending       | Payment fails                 | Pending           | A `ValueError` is raised                              |
| Pending       | Reservation is invalid        | Pending           | A `ValueError` is raised                              |
| Checked In    | Guest attempts to cancel      | Checked In        | An `InvalidStateError` is raised                      |


### Test Cases

| Test ID | Init State  | Event                         | Expected      | Expected Result                   | Transition    | 
| ---     | ---         | ---                           | ---           | ---                               | ---           |
| ST01    | Pending     | Payment succeeds              | Reserved      | Reservation is confirmed          | Valid         |
| ST02    | Pending     | Reservation not completed     | Cancelled     | Reservation is cancelled          | Valid         |
| ST03    | Reserved    | Guest checks in               | Checked In    | Checked into reservation          | Valid         |
| ST04    | Checked In  | Guest checks out              | Checked Out   | Checked out from reservation      | Valid         |
| ST05    | Pending     | Days not available            | Cancelled     | Reservation is cancelled          | Valid         |
| ST06    | Checked In  | Guest checks out early        | Checked Out   | Checked out from reservation      | Valid         |
| ST07    | Checked In  | Guest attempts to cancel      | Checked In    | An `InvalidStateError` is raised  | Invalid       |
| ST08    | Pending     | Payment fails                 | Pending       | A `ValueError` is raised          | Invalid       |
| ST09    | Pending     | Reservation is invalid        | Pending       | A `ValueError` is raised          | Invalid       |
| ST10    | Pending     | Guest stays at hotel          | Checked Out   | Complete reservation sequence     | Valid         |
| ST11    | Reserved    | Guest cancels                 | Cancelled     | Reservation is cancelled          | Valid         |
