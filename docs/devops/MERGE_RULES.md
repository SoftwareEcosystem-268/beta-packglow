# กฎการ Merge ของทีม Beta (Pack&Glow)

ไฟล์นี้ใช้เป็นมาตรฐานกลางของทีมสำหรับการรวมโค้ดเข้า branch หลัก

## เป้าหมาย
- ลดบั๊กจากการ merge
- ให้ทุกงานผ่านการ review
- ให้ทุกงานผ่าน CI ก่อนเข้า branch หลัก

## Branch ที่ป้องกัน
- main

## กฎหลักก่อน Merge
1. ห้าม push ตรงเข้า main
2. ทุกงานต้องเข้าโดย Pull Request เท่านั้น
3. ต้องมีผู้รีวิวอนุมัติอย่างน้อย 1 คน
4. ต้องแก้ทุก review comment ที่สำคัญก่อน merge
5. CI ต้องผ่านทั้งหมดก่อน merge
6. แนะนำให้ใช้ Squash merge เพื่อลดความรกของ commit history
7. หลัง merge ให้ลบ branch งานทิ้ง

## Required Status Checks (ตอนนี้)
- Backend Checks

หมายเหตุ:
- ตอนนี้ CI ตรวจฝั่ง backend เป็นหลัก
- เมื่อเริ่ม frontend แล้ว ให้เพิ่ม status check ของ frontend ภายหลัง

## มาตรฐาน Pull Request
1. PR title ควรสื่อความชัดเจน เช่น feat:, fix:, chore:
2. PR description ต้องมี
   - สรุปสิ่งที่เปลี่ยน
   - เหตุผลที่เปลี่ยน
   - วิธีทดสอบ
3. ต้องลิงก์ Issue ที่เกี่ยวข้อง (ถ้ามี)

## ข้อกำหนด Commit Message
- feat: เพิ่มความสามารถใหม่
- fix: แก้บั๊ก
- chore: งานระบบ/DevOps
- docs: เอกสาร
- test: งานทดสอบ
- refactor: ปรับโครงสร้างโค้ด

## กรณีฉุกเฉิน (Hotfix)
1. สร้าง branch จาก main ชื่อ hotfix/<short-name>
2. เปิด PR เข้า main
3. ต้องมี reviewer อย่างน้อย 1 คนเหมือนเดิม
4. หลัง merge ให้ sync กลับไป branch พัฒนา

## วิธีตั้งค่าใน GitHub (Branch Protection)
ไปที่ Settings > Branches > Add branch protection rule

ตั้งค่าตามนี้:
- Branch name pattern: main
- Require a pull request before merging: เปิด
- Require approvals: 1
- Dismiss stale pull request approvals when new commits are pushed: เปิด
- Require review from code owners: ปิดไว้ก่อนได้
- Require status checks to pass before merging: เปิด
- Required status checks: Backend Checks
- Require branches to be up to date before merging: เปิด
- Require conversation resolution before merging: เปิด
- Allow force pushes: ปิด
- Allow deletions: ปิด

คำอธิบายแบบสั้นต่อค่าแต่ละข้อ:
- Branch name pattern: main: ระบุว่ากฎนี้ใช้กับ branch main
- Require a pull request before merging: เปิด: บังคับให้ merge ผ่าน PR เท่านั้น ห้าม push ตรง
- Require approvals: 1: ต้องมีคนรีวิวอนุมัติอย่างน้อย 1 คน
- Dismiss stale pull request approvals when new commits are pushed: เปิด: ถ้ามี commit ใหม่ approval เดิมจะถูกยกเลิกและต้องรีวิวใหม่
- Require review from code owners: ปิดไว้ก่อนได้: ตอนนี้ยังไม่บังคับเจ้าของไฟล์รีวิว
- Require status checks to pass before merging: เปิด: บังคับให้ CI ผ่านก่อน merge
- Required status checks: Backend Checks: ระบุชื่อ job ที่ต้องผ่าน (ตอนนี้คือ Backend Checks)
- Require branches to be up to date before merging: เปิด: บังคับให้ branch งานต้องอัปเดตเทียบกับ main ล่าสุด
- Require conversation resolution before merging: เปิด: ต้องกด resolve ทุก discussion/comment ที่ยังไม่จบ
- Allow force pushes: ปิด: ป้องกันการเขียนทับประวัติ branch
- Allow deletions: ปิด: ป้องกันการลบ branch main

## คอมเมนต์คืออะไร (ใน Pull Request)
- คอมเมนต์ คือข้อความที่ reviewer เขียนไว้ใน PR เพื่อขอแก้ไข ชี้จุดเสี่ยง หรือสอบถามเหตุผล
- คอมเมนต์อาจอยู่ได้ 2 แบบ
   - General comment: คอมเมนต์ภาพรวมของ PR
   - Line comment: คอมเมนต์ผูกกับบรรทัดโค้ดเฉพาะจุด

## วิธีจัดการคอมเมนต์ใน PR
1. เปิดแท็บ Files changed แล้วอ่านคอมเมนต์ทั้งหมด
2. แยกคอมเมนต์เป็น 3 กลุ่ม: ต้องแก้ทันที, ต้องอธิบายเพิ่ม, และคุยต่อได้
3. แก้โค้ดตามคอมเมนต์ที่จำเป็น แล้ว push commit เพิ่มเข้า branch เดิม
4. ตอบคอมเมนต์ทุกจุดว่าทำอะไรไป เช่น "แก้แล้วใน commit ล่าสุด" หรือ "เลือกแนวทางนี้เพราะ..."
5. กด Resolve conversation เมื่อประเด็นนั้นจบแล้ว
6. ถ้ามี commit ใหม่และ approval ถูกรีเซ็ต ให้ขอ reviewer อนุมัติใหม่

## ตัวอย่างคอมเมนต์และการตอบ
ตัวอย่างที่ 1: ขอแก้โค้ด
- Reviewer: "จุดนี้ควรเช็ค null ก่อนเรียกใช้ตัวแปร"
- ผู้เขียน PR: "แก้แล้วโดยเพิ่ม null check และเพิ่ม test กรณีข้อมูลว่าง"

ตัวอย่างที่ 2: ขอเหตุผลการออกแบบ
- Reviewer: "ทำไมเลือกใช้วิธีนี้แทนการ query ตรง?"
- ผู้เขียน PR: "เลือกวิธีนี้เพื่อลดจำนวน query ซ้ำในหน้าเดียวกัน และอ่านโค้ดง่ายขึ้น"

ตัวอย่างที่ 3: ต้องคุยต่อก่อน resolve
- Reviewer: "ชื่อตัวแปรยังไม่สื่อความหมาย"
- ผู้เขียน PR: "เสนอเปลี่ยนเป็น orderSummaryItems ถ้าโอเคจะปรับตามนี้"
- เมื่อ reviewer ตอบตกลงแล้วค่อยแก้และกด Resolve conversation

## Merge Checklist (ใช้ก่อนกดปุ่ม Merge)
- โค้ดผ่าน CI
- มี reviewer อนุมัติ
- ไม่มี conflict
- ตรวจผลกระทบกับระบบหลักแล้ว
- PR description ครบ
