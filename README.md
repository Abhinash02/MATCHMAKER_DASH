# TDC Matchmaker Dashboard & Matching Algorithm MVP

A simple, internal Matchmaker Dashboard and algorithmic matchmaking MVP designed to help the TDC team manage customers, view detailed profiles, calculate compatibility, and assign matches.

---

## 🚀 Live Links & Credentials
* **Frontend Application:** [https://perfectpair-five.vercel.app/](https://perfectpair-five.vercel.app/)
* **Backend REST API:** [https://backendmathc.vercel.app/](https://backendmathc.vercel.app/)

### Sample Credentials (One-click login buttons available on the login page)
* **Admin Role:**
  * **Email:** `admin@tdc.com`
  * **Password:** `Admin123`
* **Matchmaker Role:**
  * **Email:** `matchmaker@tdc.com`
  * **Password:** `Match123`

---

## 🛠️ Tech Choices
* **Frontend:** Built using **Next.js 14 (App Router)** and **React**. Styling is done with vanilla **CSS** coupled with **Tailwind CSS** utilities to produce a clean, responsive layout. **React Hot Toast** is used for micro-feedback, and custom animated SVG/CSS loaders provide a premium user experience.
* **Backend:** Built using **Node.js** and **Express.js**. Database connection and modeling are handled by **Mongoose** for MongoDB.
* **Database:** Hosted **MongoDB Atlas** database containing:
  * Matrimonial client profiles (Dashboard users)
  * A simulation pool of **111** dummy profiles of opposite genders
  * Matchmaker staff users
  * Interaction log notes
* **Deployment & Hosting:** Both the frontend client and the backend API are hosted live on **Vercel** with integrated environment routing.

---

## 🧠 Algorithmic Matching Logic (Gender-Specific)
The algorithm calculates compatibility scores (0–100) based on realistic expectations in the matrimonial space, split into gender-specific rules:

### Male Clients (Searching for Female Matches)
* **Age Gap:** Prioritizes women who are younger (1–5 years younger awards `+20` points, 5–10 years younger awards `+10` points).
* **Height Compatibility:** Prioritizes matches where the female is shorter (`+15` points).
* **Income & Financials:** Prioritizes matches where the female is financially independent (`+5` points) but earns less than the male client (`+20` points).
* **Children Alignment:** Matches on their desire/views for children (`+15` points).

### Female Clients (Searching for Male Matches)
* **Age Gap:** Prioritizes men who are older (1–5 years older awards `+15` points, 5–10 years older awards `+8` points).
* **Education Compatibility:** Matches are scored higher if the male has an equal or higher education tier (`+20` points).
* **Financial Stability:** Prioritizes matches where the male earns equal to or more than the female client (`+10` points).
* **Relocation Flexibility:** Awards points if either partner is open to relocate (`+15` points).
* **Family Value Alignment:** Checks if both prefer similar family types (Nuclear/Joint) (`+15` points).

### General Matching Criteria (All Genders)
* **Same Religion:** `+10` points
* **Same Caste/Community:** `+5` points
* **Same Diet:** `+5` points
* **Matching Lifestyle Choices (Smoking/Drinking):** Up to `+5` points

Scores are categorized into descriptive labels:
* `85 - 100`: **Exceptional Match**
* `70 - 84`: **High Potential Match**
* `55 - 69`: **Good Match**
* `40 - 54`: **Possible Match**
* `0 - 39`: **Low Match**

---

## ✨ AI Integrations
1. **AI Bio Generation:** Uses OpenAI's `gpt-4o-mini` to compile customer details (location, career, education, and hobbies) into a warm, natural, first-person bio.
2. **AI Partner Expectations Generation:** Generates a custom section detailing the type of partner the customer is looking for based on their personal traits and lifestyle choices.
3. **AI Personal Introduction Email Drafts:** When assigning a match, clicking the AI button drafts a personalized introduction email detailing specific compatibility reasons, ready to be reviewed, edited, and sent.

---

## 📋 Assumptions Made
* Matchmakers work in a collaborative environment where any staff member can view client profiles, log call/meeting notes in the interaction history, and run AI matching algorithms.
* A client's profile type is marked as `'client'` (staff dashboard) or `'pool'` (dummy matrimonial search pool).
* Values like **Manglik status**, **Caste**, **Family Type (Joint/Nuclear)**, **Dietary preferences (Veg/Non-Veg)**, and **Mother Tongue** are highly relevant fields that are critical for filtering in Indian matchmaking.
