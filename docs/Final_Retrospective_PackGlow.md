# เอกสารสรุปผลการทำโปรเจค Retrospective

## Pack&Glow Project

**วิชา:** DTI 241 / Software Engineering Project  
**โปรเจค:** Pack&Glow  
**ระยะเวลา:** 3 Sprints (Sprint 1, 2, 3)  
**ประเภทเอกสาร:** Final Retrospective  
**จัดทำโดย:** ทีม Squad Beta (SoftwareEcosystem-268)

---

## 1. ภาพรวมโปรเจค (Project Overview)

### สิ่งที่ระบบทำ

Pack&Glow เป็นเว็บแอปพลิเคชันที่ช่วยผู้ใช้จัดเตรียมการเดินทาง (trip preparation) ให้มีประสิทธิภาพ โดยรวมฟีเจอร์หลัก:

- **เลือกปลายทาง:** ผู้ใช้เลือกประเภทสถานที่ (ทะเล, ภูเขา, เมือง, ต่างประเทศ) และกิจกรรม
- **วางแผนทริป:** บันทึกข้อมูลทริป (วันที่, จำนวนวัน, กิจกรรมเพิ่มเติม)
- **รายการแพ็ค:** สร้างและจัดการรายการที่ต้องนำไปในเที่ยว โดยมี AI suggestions
- **ไอเดียการแต่งตัว:** เสนออาคม (occasion-based outfits) ที่เหมาะกับจุดหมายปลายทาง
- **สภาพอากาศ:** แสดงพยากรณ์อากาศจริง (weather-aware recommendations)
- **แชท AI:** ตอบคำถามเกี่ยวกับการเดินทาง เช่น สถานที่ท่องเที่ยว, อาหาร, ความปลอดภัย
- **สมาชิก Pro:** ฟีเจอร์พิเศษสำหรับ Pro tier พร้อม PromptPay payment

### ผู้ใช้เป้าหมาย

ผู้ชื่นชอบการเดินทางและนักแพ็ค (travelers) ที่ต้องการความช่วยเหลือจากเทคโนโลยี AI เพื่อจัดเตรียมการเดินทางให้เพ็บและสะดวก

### ปัญหาที่แก้ไข

- Traditional packing = ลืมของ, นำของเยอะไม่จำเป็น
- ไม่รู้ว่าควรแต่งตัวอย่างไรให้เหมาะกับจุดหมายปลายทาง
- ไม่สามารถตรวจสอบพยากรณ์อากาศระหว่างการแพ็ค

### ฟีเจอร์หลัก

1. Destination Picker + Trip Planning
2. Packing Checklist (customizable)
3. AI Packing Suggestions (OpenRouter API)
4. Outfit Suggestions Gallery
5. Weather Integration (OpenWeatherMap API)
6. AI Chat Assistant
7. Saved Outfits & Templates
8. User Authentication & Tier System (Pro/Free)

### ทำไม AI และ Weather API จึงมีประโยชน์

- **AI API (OpenRouter):** สร้างรายการแพ็คที่เป็นส่วนตัว (personalized) แทนที่จะใช้ template ธรรมดา
- **Weather API:** แนะนำสิ่งของที่เหมาะกับสภาพอากาศจริง (ไม่ต้องนำเสื้อหนากว่างไปที่ร้อน)

### เป้าหมาย MVP

ระบบ MVP ที่ไม่จำเป็นต้องมีฟีเจอร์ทั้งหมด แต่ครอบคลุม core journey ของผู้ใช้:

- Signup/Login
- Create Trip
- Generate Packing List
- View Outfits
- Chat with AI
- Basic UI/UX ที่สะดวก

---

## 2. สรุป Sprint (Sprint Summary)

### Sprint 1: Foundation & Planning

ระยะแรกมุ่งเน้นการเตรียมความพร้อม ทีมออกแบบ UI/UX, ศึกษา tech stack, เตรียม test plan, สร้าง GitHub structure

- **วัตถุประสงค์หลัก:** เตรียมรากฐานก่อนพัฒนาจริง
- **ความรับผิดชอบ:** UX/UI (design), Dev (tech study), QA (test plan), DevOps (repo setup)
- **ผลลัพธ์:** User flows, UI mockups, API research, test cases, GitHub structure พร้อม
- **ปัญหา:** Requirements ยังกว้าง, Technical decisions ไม่ชัด
- **บทเรียน:** Acceptance criteria ต้องชัดเจน, ควรใช้ GitHub Issues จาก Sprint นี้

### Sprint 2: Core Feature Development

ระยะสอดมุ่งเน้นพัฒนา features หลัก แต่ทำงานช้าเนื่องจากวันหยุดสงกรานต์

- **วัตถุประสงค์หลัก:** Implement core features ของ MVP
- **ความรับผิดชอบ:** Dev (implementation), QA (progress check)
- **ผลลัพธ์:** Trip planning, Packing checklist, Outfit suggestion, Basic integration เสร็จบางส่วน
- **ปัญหา:** Songkran holiday overlap, members unavailable, timeline delayed
- **บทเรียน:** Sprint planning ต้องพิจารณา holidays, tasks ต้องแบ่งเล็ก ๆ, daily standup ต้องสำคัญ

### Sprint 3: Testing, Bug Fix & Deployment

ระยะสุดท้ายมุ่งเน้นการ test ครบถ้วน แก้ bugs, deploy, จบด้วย documentation

- **วัตถุประสงค์หลัก:** Stabilize system, test complete, deploy to production
- **ความรับผิดชอบ:** QA (full testing), Dev (bug fixes), DevOps (deployment)
- **ผลลัพธ์:** Full system tested, bugs fixed, deployed to EC2:8080, documentation completed
- **ปัญหา:** CI/CD failures (Python 3.14, Dockerfile), 8 Dependabot PRs pending
- **บทเรียน:** Testing ต้องเริ่มจาก Sprint 1, CI/CD ต้องเสถียร, automation เป็นสำคัญ

---

## 3. Sprint 1 — Foundation & Planning (การวางรากฐานและวางแผน)

### วัตถุประสงค์ Sprint

เตรียมความพร้อมก่อนการพัฒนาจริง โดยได้ความเข้าใจร่วมกันของทีมเกี่ยวกับ:

- MVP scope
- User journey
- UI/UX design
- Technical stack & API choices
- Testing strategy
- GitHub workflow

### งานที่ทำเสร็จ (Work Completed)

- **UX/UI:** ออกแบบ user flow และ wireframe สำหรับ landing page, destination selection, trip planning, packing checklist, outfit gallery, AI chat, booking summary
- **Dev:** ศึกษา tech stack (Next.js 16, FastAPI, SQLite, OpenRouter API, OpenWeatherMap API), เขียน technical proposal, ออกแบบ data model
- **QA:** เขียน test strategy, สร้าง test cases แรกสำหรับ destination input, form validation, API response, user flow basics
- **DevOps:** Setup GitHub repository, branch strategy (main + feature branches), folder structure, documentation folder, basic CI/CD workflow template
- **PM/Team:** Discuss MVP scope, identify core features vs. nice-to-have

### สิ่งที่ทำได้ดี (What Went Well)

- ทีมมีความเข้าใจร่วมกันเกี่ยวกับ product scope
- UX/UI design ช่วยให้ทุกคนมองเห็นภาพของระบบ
- QA prepared tests early = awareness ของ possible issues
- DevOps repo structure พึ่งพอสำหรับ collaboration
- MVP scope ชัดเจนข้อนี้เอง

### สิ่งที่ต้องปรับปรุง (What Could Improve)

- Requirements ยังกว้างไม่รัดกุม ตัวอย่าง "packing suggestion" ต้องชัดว่า source มาจาก rules หรือ AI
- Technical decisions บางเรื่องไม่ได้ confirm ตัวอย่าง SQLite for production
- Acceptance criteria ต้องเขียนชัดเจนกว่า JIRA/GitHub Issues
- GitHub Issues/Projects ควรใช้ตั้งแต่ Sprint นี้

### Action Items สำหรับ Sprint 2

1. Convert user flow เป็น implementation tasks ใน GitHub Issues
2. Confirm API contract (request/response format) ก่อน Dev implementation
3. Confirm data model (User, Trip, Checklist, Item, Outfit, Template relationships)
4. Write acceptance criteria for each story using Gherkin style
5. Create sprint board ใน GitHub Projects

---

## 4. Sprint 2 — Core Feature Development (การพัฒนาฟีเจอร์หลัก)

### วัตถุประสงค์ Sprint

Implement core features ของ MVP ให้ทำงานได้

### งานที่ทำเสร็จ (Work Completed)

- **Dev:**
  - Trip planning form backend + frontend
  - Packing checklist (create, read, update, delete)
  - Packing items management
  - Outfit suggestions gallery
  - Basic frontend/backend integration
  - API endpoints skeleton (users, trips, packing-items, checklists, outfits)
  - SQLAlchemy ORM models setup
  - JWT authentication skeleton
  - AI/Weather integration prep (didn't finish)

- **QA:** Prepared expanded test cases, created test environment setup

### ปัญหา / Blockers (Issues Found)

#### Major: Songkran Holiday Overlap

- Sprint 2 overlapped with Songkran holiday period
- Some team members unavailable / took leave
- Communication slowed down
- Development time reduced significantly
- **Impact:** Many tasks couldn't complete within original timeline

#### Technical Issues

- **CI/CD Failures:** GitHub Actions หลาย attempts ล้มเหลว
  - Python 3.14 not available on GitHub Actions runners
  - Frontend Dockerfile missing `server.js` (Next.js build artifact)
  - E2E tests port mismatch (Playwright expects 3000, Docker maps 3002)
- **API Integration:** OpenRouter API key not fully tested
- **Frontend/Backend Mismatch:** API response format บางตัวไม่ตรง

#### Project Management

- Tasks size too large (difficult to track)
- No daily standup notes
- Sprint burndown chart wasn't updated

### สิ่งที่ทำได้ดี (What Went Well)

- Core data model + API structure took shape
- Team identified essential MVP features (trip, checklist, outfit, chat)
- Dev made progress on important user flows
- Team resilient: adapted after delay, didn't give up
- Delay forced team to prioritize and cut nice-to-have features

### สิ่งที่ต้องปรับปรุง (What Could Improve)

- Sprint planning ต้อง consider holidays + member availability
- Tasks should be smaller (split large tasks into 4-8 hour subtasks)
- Daily standup ต้องมี + written notes
- API integration testing ต้องเกิดขึ้นตั้งแต่ Dev implementation
- Documentation updates ต้องเป็นส่วนของ development task

### Action Items สำหรับ Sprint 3

1. Move unfinished tasks to Sprint 3 (AI integration, Weather integration)
2. Prioritize MVP features first: Auth → Trip → Checklist → Outfit → Chat
3. Reduce non-essential features (e.g., Booking summary ถ้าไม่เสร็จ)
4. Create QA testing checklist แบบละเอียด
5. Set daily check-in 15 min ทุกเช้า
6. Fix CI/CD pipeline:
   - Change Python from 3.14 → 3.11 (stable)
   - Fix Frontend Dockerfile
   - Fix E2E tests port config

---

## 5. Sprint 3 — Testing, Bug Fixing & Deployment (การทดสอบ บัก-ฟิกส์ และ Deploy)

### วัตถุประสงค์ Sprint

Stabilize system, test all main features, fix bugs, deploy ไปที่ EC2, และ complete documentation

### งานที่ทำเสร็จ (Work Completed)

#### QA Testing

- Full system end-to-end testing
- Happy path: normal user journeys (signup → create trip → generate packing → view outfits → chat)
- Negative cases: missing fields, invalid input, API errors, empty results
- Edge cases: long names, special characters, boundary values
- Cross-browser testing: Chrome, Firefox
- Mobile responsive testing
- Performance: response time checks

#### Dev Bug Fixes

- Fixed API response format mismatches
- Improved error messages
- Fixed UI layout issues
- Improved loading states
- Fixed CORS configuration
- Implemented fallback logic (if API fails, use rules-based suggestions)

#### DevOps Deployment

- Setup environment variables ใน GitHub Secrets
- Created .env generation script สำหรับ production
- Configured Docker Compose for EC2
- Setup Nginx reverse proxy configuration
- Deployed to EC2 instance (labs89.hpc-ignite.org:8080/beta-packglow)
- Tested production URLs

#### Documentation

- Created ARCHITECTURE.md
- Created API documentation (Swagger/ReDoc)
- Created README.md with setup instructions
- Created this Final Retrospective
- Created Function Point Analysis

### QA Testing Scope (รายละเอียดการทดสอบ)

| Test Area                 | Test Case Example                                        | ผลลัพธ์              |
| ------------------------- | -------------------------------------------------------- | -------------------- |
| **Destination Selection** | Select beach + summer activities, verify correct filters | Pass                 |
| **Trip Planning Form**    | Create 5-day trip to beach, verify data saved            | Pass                 |
| **Packing Checklist**     | Generate list for beach trip, mark items as packed       | Pass                 |
| **Outfit Suggestion**     | View outfits filtered by occasion/weather                | Pass                 |
| **Saved Outfits**         | Save outfit, verify appears in saved list                | Pass                 |
| **Checklist Templates**   | Save custom template, reuse for new trip                 | Pass                 |
| **AI Packing Assistant**  | Request packing suggestions, verify JSON format          | Pass                 |
| **AI Chat**               | Ask about destination, verify Thai language response     | Pass (with fallback) |
| **Weather API**           | Verify weather display syncs with destination            | Pass                 |
| **Form Validation**       | Submit form with missing required field                  | Correctly rejected   |
| **API Error Handling**    | Test with invalid token, verify 401 response             | Pass                 |
| **Authentication**        | Register → Login → Access protected routes               | Pass                 |
| **Navigation**            | Test all page transitions                                | Pass                 |
| **Mobile Responsive**     | View on mobile screen sizes                              | Pass (minor issues)  |

### สิ่งที่ทำได้ดี (What Went Well)

- QA testing revealed major bugs early (ก่อน final submission)
- Dev fixed bugs efficiently
- DevOps deployment ใช้ได้โดยไม่มี major issues
- Documentation หมดทั้งหมด
- System more stable than Sprint 2
- AI fallback logic worked (if OpenRouter fails, use rules-based)

### สิ่งที่ต้องปรับปรุง (What Could Improve)

- Testing ต้องเริ่มจาก Sprint 1 ไม่ใช่รอ Sprint 3
- Bugs ต้องพบ early ไม่ใช่ next day ก่อน submission
- Documentation ต้องเขียน ongoing ไม่ใช่ batch ตอน final
- UI/UX ยังมี minor issues (button alignment, color consistency)
- Error messages ควรเป็นภาษาไทยให้ครบ
- Automated tests (unit tests, integration tests) ยังไม่ครบ

### ปัญหาที่ยังมีอยู่ (Remaining Issues)

1. **Dependabot PRs Pending:** 8 dependency update PRs ค้างไม่ได้ merge ต้องตัดสินใจ merge/ignore
2. **SQLite Concurrent Writes:** SQLite ใช้สำหรับ production ต้องเฝ้า concurrent write conflicts
3. **Python 3.14 Issue:** CI/CD uses Python 3.14 ซึ่ง GitHub Actions ไม่มี → fixed to 3.11
4. **API Key Management:** OpenRouter key limit $1/day, ต้อง monitor usage

---

## 6. สิ่งที่ทำได้ดีโดยรวม (What Went Well Overall)

- **Team Communication:** Role separation (UX/UI, Dev, QA, DevOps) ชัดเจน
- **UX/UI Direction:** Design mockups ช่วยให้ dev implementation ถูกทาง
- **MVP Implementation:** Core features เสร็จ (auth, trip, packing, outfit, chat)
- **QA Process:** Found and fixed many bugs before submission
- **DevOps:** Deployment ใช้ได้ และ auto via GitHub Actions
- **Team Adaptability:** Handled Songkran delay gracefully, prioritized MVP
- **Value-Added Features:** System not only basic functionality แต่มี AI + Weather ด้วย
- **Documentation:** Retrospective, architecture, API docs ครบถ้วน

---

## 7. สิ่งที่ไม่ดีนัก (What Did Not Go Well Overall)

- **Sprint 2 Delay:** Songkran overlap affected timeline significantly
- **Requirements Clarity:** Initial requirements ไม่ detail พอ
- **Task Size:** Tasks too large, tracking ยาก
- **CI/CD Instability:** Python 3.14, Dockerfile, port mismatch issues
- **Testing Timeline:** Tests concentrated in Sprint 3 ไม่ early
- **Documentation Timing:** Docs concentrated near end, ควรเขียน ongoing
- **GitHub Workflow:** Issues/Projects ไม่ used consistently
- **Dependency Management:** 8 Dependabot PRs ค้างไม่ deal with
- **Communication During Holiday:** Slower responses, harder to sync

---

## 8. ความท้าทายและปัญหา (Challenges and Problems)

### 1. Managing Scope in Limited Time

- Full-stack project (frontend + backend + AI + weather) ในเวลา 3 sprints
- Solution: Cut non-essential features, focus MVP only

### 2. Coordinating Multiple Roles

- UX/UI, Dev, QA, DevOps ต้องประสานกัน
- Solution: Daily standup, clear roles, shared documentation

### 3. Frontend-Backend Integration Complexity

- API contracts ต้องชัดเจน
- Response format mismatches
- Solution: Created API design doc early, tested early

### 4. External API Dependencies (OpenRouter + OpenWeatherMap)

- ต้อง API keys, ต้อง rate limits, ต้อง error handling
- Solution: Implemented fallback logic, error messages

### 5. Complex Data Relationships

- User ↔ Trip ↔ Checklist ↔ Item ↔ Outfit ↔ Template
- Database design ต้องรัดกุม
- Solution: Drew ERD diagram, confirmed with team

### 6. Testing Many Flows in Short Time

- QA ต้อง test 10+ user flows + edge cases
- Solution: Created test cases early, automated where possible

### 7. Deployment to Production

- Environment variables, Docker, Nginx config ต้องทำให้ถูก
- Solution: DevOps prepared good documentation

### 8. Handling Sprint Delay (Songkran)

- Plan ต้องเปลี่ยน กลางทาง
- Solution: Team met, re-prioritized, communicated changes

---

## 9. บทเรียนที่ได้ (Lessons Learned)

### Process Lessons

1. Sprint planning ต้อง consider real calendar เช่น holidays, team member availability
2. MVP scope ต้องชัดก่อนเริ่มทำ เพื่อ avoid scope creep mid-sprint
3. UX/UI design ช่วยลด confusion ทำให้ dev implementation ถูกทางเร็ว
4. QA ต้องเตรียม tests early test continuously ไม่ใช่ last-minute
5. DevOps important from Sprint 1 เช่น repo structure, documentation, deployment planning
6. Documentation ต้อง ongoing ไม่ใช่ batch นอก sprint
7. Small tasks ดีกว่า Large tasks เพราะ easier to track, estimate, complete
8. Communication critical โดยเฉพาะ when time limited

### Technical Lessons

9. External API ต้อง error handling + fallback เพราะ assume API will fail sometimes
10. CI/CD pipeline ต้อง reliable เพราะ auto testing catches bugs early
11. Database design ต้อง plan carefully เพราะ complex relationships hard to refactor later
12. Frontend-backend contract ต้องชัด เพราะ API documentation important
13. Testing automation important เพราะ manual testing ไม่ scale
14. Code review important เพราะ catch bugs, improve code quality
15. Environment management important เช่น .env, secrets, dev vs. prod configuration

### Team Lessons

16. Role clarity helps ให้ everyone knows responsibility
17. Regular check-in important เช่น daily standup, sprint review, retrospective
18. Adaptability ต้องมี เพราะ plans change team must adjust
19. Documentation helps next project โดยเฉพาะ lessons learned ควร document
20. Retrospective helps learning ให้ team reflects improves process

---

## 10. Team Collaboration Reflection (สะท้อนการทำงานเป็นทีม)

### โครงสร้างทีม

- **Product Manager/Coordinator:** Answer requirements questions, adjust scope
- **UX/UI Designers:** Design user flows, mockups, visual design
- **Backend Developers:** Implement API, database, business logic, AI integration
- **Frontend Developers:** Implement UI, state management, API integration
- **QA Engineers:** Test plan, test cases, system testing, regression testing
- **DevOps Engineer:** GitHub setup, CI/CD pipeline, deployment, infrastructure

### สิ่งที่ทำให้ collaboration ทำงาน

1. Clear roles and responsibility ให้ everyone knows their job
2. Regular communication เช่น daily standup, sprint meetings
3. Shared documentation เช่น README, architecture, API docs
4. Code review ให้ catch issues before merge
5. Test early ให้ QA involved from Sprint 1
6. Respect each role ให้ UX/UI respected by dev QA respected by dev

### สิ่งที่ต้องปรับปรุง

1. Progress tracking ต้อง GitHub Issues/Projects use consistently
2. Documentation update ต้องมี DRI (designated responsible individual) for each doc
3. Blocker resolution ต้อง escalate blockers faster unblock teammate
4. Pair programming ใช้ for complex features knowledge transfer
5. Retrospective action items ต้อง actually implement improvements next sprint

### ข้อเสนอสำหรับ Future Projects

1. Establish team working agreement (hours, communication, holiday policy)
2. Use GitHub Issues/Projects from Day 1
3. Automate testing from Sprint 1 (unit tests, integration tests, E2E tests)
4. Create deployment checklist (before final submission)
5. Schedule retrospective review 1 month after project end (long-term learnings)

---

## 11. Technical Architecture Reflection (สะท้อนสถาปัตยกรรมเทคนิค)

### Frontend-Backend Integration

- What worked: Clear API contract (defined request/response format)
- What didn't: Some API response format changed mid-sprint → frontend broke
- Lesson: API versioning backward compatibility tests needed

### API Design

- What worked: RESTful design clear endpoint naming (/trips, /checklists, /outfits)
- Challenge: Data relationships complex (user → trip → checklist → items)
- Solution: Good ERD diagram, normalize data model

### AI API Integration

- What worked: OpenRouter API pricing model (pay per token) good documentation
- Challenge: API latency (LLM calls are slow) rate limiting
- Solution: Async/await architecture fallback to rules-based user feedback "AI is thinking"

### Weather API Integration

- What worked: OpenWeatherMap free tier (1000 calls/day)
- Challenge: Weather data not always matching user location
- Solution: Allow user override show weather source

### Database Design (SQLite)

- What worked: Simple file-based easy Docker volume setup
- Challenge: Single-writer limitation concurrent writes may block
- Solution: Used SQLite WAL mode 1 worker limit plan PostgreSQL migration path

### Error Handling

- What worked: Global exception handler structured error responses
- Didn't: Some error messages in English should be Thai
- Need: More specific error codes better error messages

### Code Organization

- What worked: Clean separation (models routers services schemas)
- Challenge: Large files (main.py services)
- Solution: Refactor into smaller modules post-MVP

### Testing

- Coverage: Backend 70% minimum (enforced via CI)
- Need: More integration tests fixture not comprehensive
- Recommendation: Add pytest fixtures for auth database state

### Deployment

- What worked: GitHub Actions Docker Compose EC2 deployment
- Challenge: Python 3.14 not on runners Dockerfile had issues
- Solution: Use stable Python 3.11 fix Dockerfile start command

### Security

- What worked: JWT tokens bcrypt hashing secrets management via GitHub
- Need: API key rotation policy audit logging
- Recommendation: Document API key management process (owner: sukit.inpim)

---

## 12. สรุปข้อเสนอการปรับปรุง (Summary of Recommendations)

### Immediate (Before Final Submission)

- Fix Python 3.14 → 3.11 in CI (DONE)
- Fix Frontend Dockerfile (remove server.js) (DONE)
- Fix E2E tests port config (3000 vs 3002) (DONE)
- Test production URL thoroughly (DONE)
- Create final checklist before submission (DONE)

### Short-term (After Submission, Next Sprint)

- Merge pending Dependabot PRs (strategic merge: patch auto major manual)
- Create automated regression tests
- Document API key management (owner: sukit.inpim)
- Add cost/quota tracking for OpenRouter
- Refactor large code files

### Medium-term (Product Improvements)

- Implement caching (Redis) for weather data
- Migrate SQLite → PostgreSQL when user count > 100
- Add push notifications for trip reminders
- Implement user analytics
- Add mobile app (React Native)

### Long-term (Process Improvements)

- Establish CI/CD best practices document
- Create team development guidelines
- Implement automated deployment to staging first
- Add monitoring/alerting (e.g., sentry.io)
- Quarterly retrospectives with team

---

## 13. บทสรุป (Conclusion)

### ความสำเร็จของโปรเจค

Pack&Glow โปรเจค successfully delivered MVP ที่มี:

- User signup/login
- Trip planning
- Packing checklist
- Outfit suggestions
- AI chat assistant (with fallback)
- Weather integration
- Database persistence
- Responsive UI
- Deployment to production

### ปัญหาที่เอาชนะไป

- Handled Songkran holiday delay gracefully
- Separated roles effectively
- Adapted scope based on time constraints
- Tested thoroughly before submission
- Deployed successfully

### ความเรียนรู้

ทีม learned important lessons about:

- Process (sprint planning, testing early, documentation ongoing)
- Technical (API design, error handling, external dependencies)
- Team (communication, adaptability, role clarity)

### ทิศทางข้างหน้า

- Collect user feedback ก่อน deciding next features
- Fix technical debt (refactoring, automated tests)
- Scale infrastructure (PostgreSQL, caching, monitoring)
- Expand features (mobile app, notifications, analytics)
- Culture (continue retrospectives, learning mindset)

---

**เอกสารสรุปผลการทำโปรเจค Pack&Glow หรือเอกสาร Final Retrospective นี้ สร้างเพื่อวัตถุประสงค์การศึกษาวิชา DTI 241 และการพัฒนา software engineering skills ของทีม**

**หมายเหตุ:** ทีม Squad Beta ขอขอบคุณที่ร่วมงานกัน คิดวิจารณญาณ สนับสนุน และเรียนรู้จากกันตลอด 3 sprints นี้

---
