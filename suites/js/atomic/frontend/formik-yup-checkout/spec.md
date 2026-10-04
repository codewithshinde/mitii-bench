Build a checkout billing address form using Formik and Yup.

* **Inputs**: Zip Code (`data-testid="zip-input"`).
* **Yup Rule**: Zip Code must match 5-digit regex (`^\d{5}$`). Display error on blur if invalid.

Use Formik `validateOnBlur` (or equivalent) with a Yup schema.
