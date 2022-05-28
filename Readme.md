# Feather Take Home Assessment

## Getting started

1. Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine
2. Set up the environment variables

```bash
cp ./backend/.env.example ./backend/.env
```

3. Build and run the Docker image:

```bash
cd backend
docker-compose build
docker-compose up
```

4. On a new terminal, run the migration and the seed script to add initial data:

```bash
docker compose exec backend yarn prisma migrate dev
docker compose exec backend yarn prisma db seed
```

5. That’s it!

You can see the app on `http://localhost:3000`

The API should be running on `http://localhost:4000`

** Note **
If you want to install new dependencies, you'll have to do it inside the docker container. To do that, you can use the following command:

```
docker compose exec {backend OR frontend} yarn add {the_name_of_the_package}
```

Make sure to replace the values between the curly braces `{}` with the correct ones.

## API

After following the [Getting started](#Getting-started) guide, the backend should be running on port `4000`. The backend currently have one endpoint:

| Request type | Path              | Query Params                                              | Example                                                                                                                                                                     |
|--------------|-------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET`        | `/policies`       | `search`, `limit`, `offset`, `sortField`, `sortDirection` | `/policies?search=TK&limit=5&offset=0&sortField=provider&sortDirection=desc`                                                                                                |
| `POST`       | `/policy`         |                                                           | `{ "firstName": "Nazmul1", "lastName": "Khan","dateOfBirth": "1985-02-28 12:51:27.000","provider": "DAK","insuranceType": "HEALTH","startDate": "1985-02-28 12:51:27.000"}` |
| `PUT`        | `/policy/{id}`    |                                                           | `{ "startDate": "1985-02-28 12:51:27.000", "firstName": "IIIII" }`                                                                                                          |
| `GET`        | `/policy-history` | `limit`, `offset`                                         | `/policy-history?limit=5&offset=0`                                                                                                                                          |


## Data structure

### Policy

| fields         | type                            | comment                                       |
| -------------- | ------------------------------- | --------------------------------------------- |
| id             | string                          | Used to identify the policy                   |
| customer       | [Customer](#Customer)           | Object holding the customer's informations    |
| provider       | string                          | Name of the provider (Allianz, AXA…)          |
| insuranceType  | [InsuranceType](#InsuranceType) | Type of the insurance (Liability, Household…) |
| status         | [PolicyStatus](#PolicyStatus)   | Status of the insurance (Active, Cancelled)   |
| startDate      | date                            | Date when the policy should start             |
| endDate        | date                            | Date when the policy ends                     |
| createdAt      | date                            | Date when the record was created              |

### Customer

| fields      | type   | comment                       |
| ----------- | ------ | ----------------------------- |
| id          | uuid   | Used to identify the customer |
| firstName   | string | Customer’s first name         |
| lastName    | string | Customer’s last name          |
| dateOfBirth | date   | Customer’s date of birth      |

### InsuranceType

`InsuranceType` can be of `LIABILITY`, `HOUSEHOLD`, `HEALTH`

### PolicyStatus

`PolicyStatus` can be of `ACTIVE`, `PENDING`, `CANCELLED` and `DROPPED_OUT`

## General questions

- How much time did you spend working on the solution?
  - ~ 5 hours
- What’s the part of the solution you are most proud of?
  - It should be backend's  `src/index.ts` file
  - I have also updated the docker-compose a bit. As user story was updated a bit later, I had updated the frontend also with the old  user story
- If you had more time, what other things you would like to do?
  - I would improve the `orderBy` fields filter
  - add some more field validations
  - add/update the customer's family members history tracking
  - update the frontend with forms to support addition / update operation
  - lastly, I never had the exposure to Prisma before, so I would dig in more to update stuff more accurately
- Do you have any feedback regarding this coding challenge?
  - No it's all good. I just had issues with docker-compose but can really remember what was that. So I updated that accordingly
  - One more thing, the customer's family member record schema is not correct by default. I guess it would be better if I could clarify more about this.
