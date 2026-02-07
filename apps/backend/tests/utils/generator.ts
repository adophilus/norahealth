import { faker } from '@faker-js/faker'

export const createMockUserSignUpDetails = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({
    firstName,
    lastName
  })

  return {
    display_name: `${firstName} ${lastName}`,
    email
  }
}
