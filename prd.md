This PRD outlines the key features, user flows, and technical requirements for developing the platform connecting clothing manufacturers and textile workshops. It is designed to ensure all stakeholders have a clear understanding of scope and functionality for guiding development efforts.

# Connecting Clothing Manufacturers and Textile Workshops

## Product Overview

This platform connects clothing manufacturers with textile workshops to streamline production services. Manufacturers can post their production needs, while workshops can offer services tailored to those needs. The main problem we're addressing is the inefficiency of matching manufacturer requirements with workshop capabilities, leading to delays and miscommunication throughout the production lifecycle.

## Hybrid Product Model

**User research finding (April 2026):** Workshops are not tech-savvy and do not use web platforms or mobile apps — WhatsApp is their primary work tool. Based on this, the product adopts a hybrid model:

- **Manufacturers** interact exclusively via the web platform.
- **Workshops** interact exclusively via a WhatsApp AI agent (no web UI for workshops).

### WhatsApp Agent Role

The agent is a **matching broker, not a communication relay**. Once a manufacturer and workshop connect, they communicate directly via WhatsApp. The agent handles:

1. **Onboarding:** Interviews the workshop via conversation to build their profile (machines, capabilities, specialties, production capacity). Shows a summary for confirmation before saving.
2. **Matching notifications:** When a manufacturer posts an order, the system runs matching and the agent proactively notifies compatible workshops with order details.
3. **Offer collection:** Workshop replies with interest + offer (price, timeline, conditions). Agent parses the response and writes the structured offer to the database.
4. **Connection handoff:** Once the manufacturer accepts an offer, they receive the workshop's WhatsApp number to communicate directly.

### End-to-End Flow

```
1. Manufacturer posts order (web)
2. Matching runs → compatible workshops identified
3. Agent sends WA message to each workshop with order details
4. Workshop replies via WA: interested + offer
5. Agent parses offer → saves to DB
6. Manufacturer reviews offers on web → accepts one
7. Manufacturer receives workshop's WA number → direct communication
```

## Core User Flows

1. **Manufacturers** login, create profiles with business information, and post orders that detail their production specifications. They can search for workshops based on location and capabilities, subsequently tracking the order status through a dashboard. Finally, after project completion, they provide ratings to ensure quality.  
2. **Workshops** onboard via WhatsApp conversation with the AI agent, receive matching proposals proactively, submit offers through chat, and manage active orders via WhatsApp. No web login required.
## Functional Requirements

- **User Registration System**: Users, both manufacturers and workshops, can sign up securely with credentials.  
- **Order Tracking Feature**: Provides users visibility into the lifecycle of their orders.  
- **Basic Matching Algorithm**: Matches manufacturers with suitable workshops based on predefined criteria.  
- **Rating System**: Allows users to rate and give feedback post-completion of projects.  
- **Messaging System**: Facilitates direct communication between manufacturers and workshops.  
- **Search Filters**: Enable users to find workshops based on ratings, location, and services.  
- **Profile Management**: Allows users to edit and maintain their profiles.
## User Roles & Permissions

- **Manufacturers**: Have full access to create orders, view the status of orders, and manage their profiles.  
- **Workshops**: Have limited access to browse orders, accept or decline requests, and manage their own profiles.
## Data Model & Key Objects

Key data entities include:  
- **Users**: Contains profile details of manufacturers and workshops.  
- **Orders**: Includes data related to submissions by manufacturers, including status and timestamps.  
- **Ratings**: Records feedback from both manufacturers and workshops about each other.
## Business Rules & Logic

- The matching algorithm prioritizes workshops based on operational capacity and relevant skills.  
- Order tracking updates should occur when milestone events are reached.  
- Ratings that fall below a set threshold trigger administrative review alerts.
## Edge Cases & Error Handling

- If no workshops match the criteria provided, manufacturers are informed with alternative options.  
- For order delays, automatic notifications should be sent to manufacturers about status changes.
## Success Metrics & Analytics

We will measure user engagement through active profile counts.  
Order completion rates and the average time to fulfill orders will indicate overall platform efficiency.  
User ratings will measure the quality of services rendered.
## Technical Constraints & Dependencies

- Must comply with data privacy regulations for user transactions.  
- Reliable server infrastructure is necessary to handle anticipated traffic and data storage requirements.
## Testing & QA Requirements

- Conduct User Acceptance Testing (UAT) for complete user journeys for both manufacturers and workshops.  
- Perform load testing to assess performance under peak activity.  
- Implement Continuous Integration and Deployment (CI/CD) to ensure updates are rolled out without service disruption.