Build a 6-digit OTP code verification input.

* **Inputs**: Six single-character boxes (`data-testid="otp-input-[0-5]"`).
* **Behavior**: Typing a digit automatically shifts focus to the next input field. Pressing `Backspace` on an empty input shifts focus back.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
