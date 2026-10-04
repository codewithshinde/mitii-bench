Build a profile form validated against a Zod schema with React Hook Form.

* **Schema**: Email must be valid format, age must be a number ≥ 18.
* **Error Banner** (`data-testid="zod-error-list"`): Displays schema validation errors.

Use `@hookform/resolvers/zod` (`zodResolver`) with `useForm`.
