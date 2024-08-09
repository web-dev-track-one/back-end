# back-end

In order to run the dev version, make sure to first install all npm packages using `npm i`, then run `node src/server.js` in the project root directory.

Note that in order for the backend to work successfully, a `.env` file must be present in the project root directory. Within this file, the following vars are required to be present for success:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
MONGO_URL
JWT_SECRET
PORT
```

The `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` vars are used to access photos stored in an s3 bucket for team members. The `MONGO_URL` var is used to access the mongoDB database used for the backend. The `JWT_SECRET` var is used for javascript authentication purposes. The `PORT` var is used to determine which port the backend will be hosted on. 