# Moon Assist - Frontend

[![pipeline status](https://gitlab.com/moonassistdev/frontend-ui/badges/develop/pipeline.svg)](https://gitlab.com/moonassistdev/frontend-ui/commits/develop)

Moon Assist frontend application.
Our Frontend app is composed with several frontend libraries oriented around React ecosystem.

## Running the app in development mode

To run app in development mode:

```
yarn install
yarn start
```

## Running storybook

We use storybook to develop and test UI components in isolation.

Storybook is a UI development environment for your UI components. With it, you can visualize different states of your UI components and develop them interactively.

To run storybook on your local environment execute.

```
yarn storybook
```

Find out more at https://storybook.js.org/basics/introduction/

## Deployment

```
yarn build
```

### Heroku

https://github.com/mars/create-react-app-buildpack#user-content-procfile


## React & Redux architecture overview

App was generated with official recommended way using Create React App:

- https://github.com/facebook/create-react-app
- https://reactjs.org/

State is handled with Redux. Async actions are implemented with redux-thunk lib.

- https://redux.js.org/
- https://github.com/gaearon/redux-thunk
- https://github.com/reactjs/reselect

For clientside routing, we're using React Router 4

- https://reacttraining.com/react-router/web/guides/philosophy

For advanced froms, we use Redux-Form:

- https://www.npmjs.com/package/redux-form
- https://www.npmjs.com/package/redux-form-validators

For tables we use React Table:

- https://react-table.js.org/#/story/readme

## Testing

Tests are written with Jest and Enzyme

- https://facebook.github.io/jest/
- http://airbnb.io/enzyme/

## Browser support

Moon Assist support all modern browsers, that means no support for IE11 but Edge is supported. Polyfils can be imported, please reffer to create-react-app readme: https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md


