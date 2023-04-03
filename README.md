
```
git clone https://github.com/devjume/moodz.git
npm install
npm start
```

## Tietokanta

### profiles (taulu)
```
id = auth.uid() eli tämä tulee vastaamaan käyttäjän id auth.users taulussa

username (text) = käyttäjän syöttämä username
sleep_goal (int)
exercise_goal (int)
relax_goal (int)
```

#### Supabase session object
```
{"user":{"id":"d40353bd-7338-4ce5-a1a2-12657a0057da","aud":"authenticated","role":"authenticated","email":"test_1680308739126@example.com","email_confirmed_at":"2023-04-01T00:25:40.989164445Z","phone":"","last_sign_in_at":"2023-04-01T00:25:40.991354218Z","app_metadata":{"provider":"email","providers":["email"]},"user_metadata":{"exercise_goal":0,"relax_goal":0,"sleep_goal":0,"username":"name_1680308739126"},"identities":[{"id":"d40353bd-7338-4ce5-a1a2-12657a0057da","user_id":"d40353bd-7338-4ce5-a1a2-12657a0057da","identity_data":{"email":"test_1680308739126@example.com","sub":"d40353bd-7338-4ce5-a1a2-12657a0057da"},"provider":"email","last_sign_in_at":"2023-04-01T00:25:40.987641757Z","created_at":"2023-04-01T00:25:40.987682Z","updated_at":"2023-04-01T00:25:40.987682Z"}],"created_at":"2023-04-01T00:25:40.984641Z","updated_at":"2023-04-01T00:25:40.992961Z"},"session":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjgwMzEyMzQwLCJzdWIiOiJkNDAzNTNiZC03MzM4LTRjZTUtYTFhMi0xMjY1N2EwMDU3ZGEiLCJlbWFpbCI6InRlc3RfMTY4MDMwODczOTEyNkBleGFtcGxlLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZXhlcmNpc2VfZ29hbCI6MCwicmVsYXhfZ29hbCI6MCwic2xlZXBfZ29hbCI6MCwidXNlcm5hbWUiOiJuYW1lXzE2ODAzMDg3MzkxMjYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTY4MDMwODc0MH1dLCJzZXNzaW9uX2lkIjoiNTkxMGQzODEtNDhkNy00Y2M4LTg4MzMtMTIzZjg0NWRmZWJmIn0.WLLYBZ4Pk26eEFsvxw96_mK3A9jbThYeBAfBnjGSniU","token_type":"bearer","expires_in":3600,"refresh_token":"2uqQZvrIr8TWN73nIa3lJA","user":{"id":"d40353bd-7338-4ce5-a1a2-12657a0057da","aud":"authenticated","role":"authenticated","email":"test_1680308739126@example.com","email_confirmed_at":"2023-04-01T00:25:40.989164445Z","phone":"","last_sign_in_at":"2023-04-01T00:25:40.991354218Z","app_metadata":{"provider":"email","providers":["email"]},"user_metadata":{"exercise_goal":0,"relax_goal":0,"sleep_goal":0,"username":"name_1680308739126"},"identities":[{"id":"d40353bd-7338-4ce5-a1a2-12657a0057da","user_id":"d40353bd-7338-4ce5-a1a2-12657a0057da","identity_data":{"email":"test_1680308739126@example.com","sub":"d40353bd-7338-4ce5-a1a2-12657a0057da"},"provider":"email","last_sign_in_at":"2023-04-01T00:25:40.987641757Z","created_at":"2023-04-01T00:25:40.987682Z","updated_at":"2023-04-01T00:25:40.987682Z"}],"created_at":"2023-04-01T00:25:40.984641Z","updated_at":"2023-04-01T00:25:40.992961Z"},"expires_at":1680312340}}
```