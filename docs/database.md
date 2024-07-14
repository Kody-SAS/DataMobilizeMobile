# Database management
Here we detail how we manage and query the database.

## Introduction
We use an ORM for our relational database and also have a key-value pair storage database.

## Details
In this template, you will find the install ORM to be [drizzle](https://orm.drizzle.team/docs).
The database is linked in the database folder. We have plugged [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/).

Expo SQLite is a relational database. We also installed [React native asyncstorage](https://react-native-async-storage.github.io/async-storage/docs) which is used with
redux persist to persist data with key-value pairing when opening and closing the app and also we use it with [i18next](https://react.i18next.com/) for internationalization.

