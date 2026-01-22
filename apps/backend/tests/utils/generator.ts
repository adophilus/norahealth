import { faker } from '@faker-js/faker'

export const createMockUserSignUpDetails = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({
    firstName,
    lastName
  })
  const phoneNumber = faker.phone.number({
    style: 'international'
  })

  return {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    email
  }
}
