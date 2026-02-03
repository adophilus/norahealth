Here's a rough draft my partner came up with:
```
user model fields
fields:
- name
- email
- age group [17-25, 26-40, 41-60+]
- gender
- weight class [slim, medium, heavy/fat]
- injuries [if yes, specify]
- medical conditions [if yes, specify]
- fitness goals [weight loss, muscle gain, endurance, general health, etc.]
- time available for workouts per week (will be used to send notifications when its time for the workout)
- do you have any allergies [if yes, specify]
- location (country, city)

interative pages 
page 1: 
  - name
  - email
  - age group [17-25, 26-40, 41-60+]
page 2:
  - gender
page 3:
  - weight class [slim, medium, heavy/fat]
page 4:
  - injuries [if yes, specify]
page 5:
  - medical conditions [if yes, specify]
page 6:
  - fitness goals [weight loss, muscle gain, endurance, general health, etc.]
page 7:
  - time available for workouts per week (will be used to send notifications when its time for the workout)
  - do you have any allergies [if yes, specify]
  - location (country, city)
```

By 'pages' he just means screens he'll show to the user (all of the required data would still be passed to the backend in on api request). We've decided on email auth so basically, the user enters in their email, if they have account, they just get an otp but if they don't, an account is created for them (begind the scene) and they get an otp.
If this is the first time the user is signing-in (signing-up), then the user is taken through the onboarding flow. So we need a /user/onboarding endpoint to capture all the information my partner drafted up above.

Create a plan to do this and let me have a look
