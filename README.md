# RetailCart

This project is a simple retail application built with Angular 18.

## Installation and Running the App

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:

   ```bash
   cd retail-cart
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run start
   ```
   Navigate to `http://localhost:4200/` to view the app. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Linting and Tests

- **Linting**: Run `npm run lint` to execute the linter and ensure code quality.
- **Unit Tests**: Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Continuous Integration (CI)

Running the command:

```bash
npm run ci
```

will execute linting and code coverage checks, providing visibility into code quality and ensuring that the code meets quality standards before deployment.

Can be incorporated into deployment pipeline to set thresholds for code quality. This ensures that the codebase maintains high standards over time and prevents regressions.

## Running Tests with Code Coverage

To run tests with code coverage, use the following command:

```bash
npm run test:coverage
```

This will execute the unit tests and generate a code coverage report, which can be found in the `coverage/` directory. Reviewing the code coverage report helps ensure that your tests cover a significant portion of the codebase, highlighting areas that may need additional testing.

A minimum code coverage threshold of 90% is currently being used to maintain high standards of code quality.

## What Next

These are just a few of the many good things we can add going forward to enhance the application:

1. **State Management**: As the application grows, implementing a state management solution like the new NgRx Signal Store will help manage state in a more predictable and scalable way.

2. **The Use of Signals**: Work has already begun on a branch called `signal-based-solution` to incorporate signals, which can enhance reactivity and performance.

3. **Automation Testing**: Consider adding automation testing using tools like Cypress or Selenium to ensure the application functions correctly across different scenarios.

4. **Internalization**: Add support for multiple languages using a library like Transloco to make the application accessible to a wider audience.

5. **Environment Variables**: Use environment variables to avoid hardcoded values and allow the injection of unique values per environment, such as API URLs.

6. **Integration with External Logging and Monitoring Tools**: Currently, our logging service writes logs to the console. The plan is to integrate with providers like Datadog, AWS CloudWatch, etc., to enhance logging and monitoring capabilities.

## Further Help

To get more help on the Angular CLI, use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
