# Manage My Debt v2

A comprehensive debt management application that helps users implement the debt avalanche method for optimal interest savings, while also supporting the debt snowball method for those who prefer it. Built with Nuxt.js and Supabase.

## Key Features

- **Smart Debt Repayment**: Implements both debt avalanche (highest interest first) and snowball (lowest balance first) methods
- **Compound Interest Awareness**: Tracks different compounding frequencies (daily, monthly, etc.)
- **Emergency Fund Integration**: Recommends building 6-month emergency fund before accelerated payoff
- **Method Comparison**: Shows potential savings between avalanche and snowball methods
- **Flexible Strategy**: Allows switching between methods while maintaining payment history
- **Progress Tracking**: Visual representations of debt payoff journey
- **Mobile First**: Full featured mobile experience for on-the-go debt management

## Tech Stack

This project utilizes the following technologies and services:

- **Frontend Framework:** [Nuxt.js](https://nuxt.com/) (v3)
- **UI Component Library:** Genesis UI (Custom UI library)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend as a Service (BaaS):** [Supabase](https://supabase.com/)
  - Authentication
  - PostgreSQL Database
  - REST API
- **Hosting:** [AWS Amplify](https://aws.amazon.com/amplify/)
- **DNS Management:** [AWS Route 53](https://aws.amazon.com/route53/)
- **Transactional Email:** [Brevo](https://www.brevo.com/) (formerly Sendinblue)
- **CAPTCHA Service:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
