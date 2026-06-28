# MediCare Pharmacy — Backend Setup

## Required configuration

This application **will not start** until `JWT_SECRET` is provided — there is
no insecure default baked into the code.

### 1. Generate a JWT secret

```bash
openssl rand -hex 32
```

### 2. Provide configuration

Choose ONE of the following:

**Option A — environment variables** (recommended for production):

```bash
export JWT_SECRET=<your-generated-secret>
export DB_USERNAME=root
export DB_PASSWORD=<your-mysql-password>
export CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**Option B — local properties file** (recommended for local development):

```bash
cp src/main/resources/application-local.properties.example \
   src/main/resources/application-local.properties
```

Edit `application-local.properties` with your values, then run with:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

`application-local.properties` is gitignored and will never be committed.

## Optional configuration

- **Email notifications** (`spring.mail.*`) — if left unset, `EmailService`
  logs to console instead of sending email. The app starts normally either way.
- **Twilio SMS** (`TWILIO_*`, `twilio.enabled`) — disabled by default.
- **CORS** (`CORS_ALLOWED_ORIGINS`) — comma-separated list of allowed
  frontend origins. Defaults to `http://localhost:5173` for local dev.

## Database

Defaults to a local MySQL instance (`pharmacy_db`, auto-created). Set
`DB_USERNAME` / `DB_PASSWORD` to match your MySQL setup. `spring.jpa.hibernate.ddl-auto=update`
will create/update tables automatically on startup.

To seed sample coupons, run `src/main/resources/coupon_schema.sql` manually.
