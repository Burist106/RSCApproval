/**
 * รหัส FD ปีงบประมาณ 2569
 * ข้อมูลจาก RSC รหัส FD ปีงบประมาณ 2569
 * 
 * โครงสร้างข้อมูล:
 * - fdCode: รหัสงบประมาณ (FD07)
 * - acc: รหัส ACC
 * - projectName: ชื่อโครงการ
 * - budget: งบประมาณ (บาท)
 * - planCode: รหัสแผนงาน (FD02)
 * - planName: ชื่อแผนงาน
 * - projectCode: รหัสโครงการ (FD03)
 * - expenseCode: รหัสหมวดรายจ่าย (FD04)
 * - expenseName: หมวดรายจ่าย
 * - fundCode: รหัสแหล่งเงิน (FD05)
 * - fundName: แหล่งเงิน
 * - fiscalYear: ปีงบประมาณ (FD06)
 * - spent: ใช้ไปแล้ว (บาท) - default 0
 * - status: สถานะ (active/inactive)
 */

export const fdCodes = [
  {
    no: 1,
    fdCode: '66009000146',
    acc: '4-KTB_พัฒนาชุมชน_คกล-68',
    projectName: 'งบบริหารศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ-68',
    budget: 500000,
    planCode: '40005000',
    planName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    projectCode: '6600900',
    expenseCode: 'E0202001',
    expenseName: 'ค่าใช้สอย',
    fundCode: 'S01',
    fundName: 'รายรับจากรัฐบาล',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 2,
    fdCode: '66009000147',
    acc: '4-KTB_พัฒนาชุมชน_คกล-68',
    projectName: 'งบบริหารศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ-68',
    budget: 400000,
    planCode: '40005000',
    planName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    projectCode: '6600900',
    expenseCode: 'E0203001',
    expenseName: 'ค่าวัสดุ',
    fundCode: 'S01',
    fundName: 'รายรับจากรัฐบาล',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 3,
    fdCode: '66009000148',
    acc: '4-KTB_พัฒนาชุมชน_คกล-68',
    projectName: 'งบบริหารศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ-68',
    budget: 100000,
    planCode: '40005000',
    planName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    projectCode: '6600900',
    expenseCode: 'E0301001',
    expenseName: 'ค่าสาธารณูปโภค',
    fundCode: 'S01',
    fundName: 'รายรับจากรัฐบาล',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 4,
    fdCode: '66009000143',
    acc: '4-KTB_พัฒนาชุมชน_คกล-69',
    projectName: 'งบบริหารศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ-69',
    budget: 4600000,
    planCode: '40005000',
    planName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    projectCode: '6600900',
    expenseCode: 'E0202001',
    expenseName: 'ค่าใช้สอย',
    fundCode: 'S01',
    fundName: 'รายรับจากรัฐบาล',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 5,
    fdCode: '66009000144',
    acc: '4-KTB_พัฒนาชุมชน_คกล-69',
    projectName: 'งบบริหารศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ-69',
    budget: 4400000,
    planCode: '40005000',
    planName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    projectCode: '6600900',
    expenseCode: 'E0203001',
    expenseName: 'ค่าวัสดุ',
    fundCode: 'S01',
    fundName: 'รายรับจากรัฐบาล',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 6,
    fdCode: '66009000145',
    acc: '4-KTB_พัฒนาชุมชน_คกล-69',
    projectName: 'งบบริหารศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ-69',
    budget: 300000,
    planCode: '40005000',
    planName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    projectCode: '6600900',
    expenseCode: 'E0301001',
    expenseName: 'ค่าสาธารณูปโภค',
    fundCode: 'S01',
    fundName: 'รายรับจากรัฐบาล',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 7,
    fdCode: '66014420012',
    acc: 'RSC-705-เรียนรู้และสร้างอาชีพ-3202',
    projectName: 'งานบริหารทั่วไปสำหรับการบริการวิชาการ',
    budget: 2000000,
    planCode: '40001000',
    planName: 'เงินบริจาค RSC',
    projectCode: '6601442',
    expenseCode: 'E0205001',
    expenseName: 'รายจ่ายอื่น',
    fundCode: 'S06',
    fundName: 'รายรับเงินบริจาค',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 8,
    fdCode: '69000910002',
    acc: 'RSC-69-ภาพถ่ายUAV-หนองเขียว_สกสว',
    projectName: 'การประยุกต์ใช้ภาพถ่ายจาก UAV ชนิดหลายช่วงคลื่น เพื่อการตรวจสอบความผิดปกติของพืช และการจำแนกประเภทพืช กรณีศึกษา ศูนย์พัฒนาโครงการหลวงแม่แฮและหนองเขียว',
    budget: 434520,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900091',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 9,
    fdCode: '69001380002',
    acc: 'RSC-69-ชุมชนชายขอบ_สกสว',
    projectName: 'การศึกษาโมเดลเพื่อลดความเหลื่อมล้ำในชุมชนพื้นที่ห่างไกลในมิติ Multi-Dimensional Poverty Index',
    budget: 1554480,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900138',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 10,
    fdCode: '69001520002',
    acc: 'RSC-69-โรงเรียนชาวนา-น่าน_สกสว',
    projectName: 'โครงการโรงเรียนชาวนาเพื่อการปรับตัวของชาวนาน่านต่อการเปลี่ยนแปลงสภาพภูมิอากาศและลดปัญหามลพิษจากการเผา',
    budget: 415000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900152',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 11,
    fdCode: '69001750002',
    acc: 'RSC-69-พัฒนาทักษะEF_สกสว',
    projectName: 'การจัดประสบการณ์การเรียนรู้อย่างเหมาะสมสำหรับเด็กปฐมวัย เพื่อพัฒนาทักษะสมอง EF ใน ต.เต่างอย',
    budget: 705000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900175',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 12,
    fdCode: '69001750003',
    acc: 'RSC-69-พัฒนาทักษะEF_สกสว',
    projectName: 'การจัดประสบการณ์การเรียนรู้อย่างเหมาะสมสำหรับเด็กปฐมวัย เพื่อพัฒนาทักษะสมอง EF ใน ต.เต่างอย',
    budget: 15000,
    planCode: '30002000',
    planName: 'เครื่องพิมพ์เอกสาร 1 เครื่อง 28882',
    projectCode: '6900175',
    expenseCode: 'E0415000',
    expenseName: 'ครุภัณฑ์คอมพิวเตอร์',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 13,
    fdCode: '69001870001',
    acc: 'RSC-69-พหุวัฒนธรรม-บ่อเกลือ_สกสว',
    projectName: 'สังคมพหุวัฒนธรรมกับการใช้ประโยชน์และการจัดการพื้นที่ป่าในเขตพื้นที่ป่าสงวนแห่งชาติป่าภูคา-ผาแดง อ.บ่อเกลือ จ.น่าน นรชาติ วงศ์วันดี',
    budget: 456000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900187',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 14,
    fdCode: '69002040002',
    acc: 'RSC-69-ลูกสุกรดำบนพื้นที่สูง_สกสว',
    projectName: 'การใช้กล้วยน้ำว้าเป็นอาหารเสริมต่ออัตราการเจริญเติบโตและอัตราการเลี้ยงรอดของลูกสุกรดำระยะดูดนมจนถึงระยะหย่านมที่เลี้ยงบนพื้นที่สูง',
    budget: 319000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900204',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 15,
    fdCode: '69002120001',
    acc: 'RSC-69-สวนกาแฟน่าน_สกสว',
    projectName: 'การถอดบทเรียนเพื่อสนับสนุนการจัดการระบบนิเวศเกษตรสวนกาแฟเพื่อรับมือต่อการเปลี่ยนแปลงสภาพอากาศในจังหวัดน่าน - นรชาติ วงศ์วันดี',
    budget: 574000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900212',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 16,
    fdCode: '69002440002',
    acc: 'RSC-69-สุขภาพชุมชน-โละจูด_สกสว',
    projectName: 'การพัฒนาระบบสารสนเทศเพื่อการสนับสนุนระบบดูแลสุขภาพชุมชนในพื้นที่องค์กรปกครองส่วนท้องถิ่น ตำบลโละจูด อำเภอแว้ง จังหวัดนราธิวาส',
    budget: 452000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900244',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 17,
    fdCode: '68009520003',
    acc: 'RSC-68-โรงเรือนอัจริยะloT_วช.',
    projectName: 'โครงการถ่ายทอดเทคโนโลยีโรงเรือนอัจฉริยะเพื่อการปลูกผักสำหรับเกษตรกรบนพื้นที่สูงตลอดห่วงโซ่ธุรกิจสำหรับเครือข่ายวิสาหกิจชุมชนเกษตรอินทรีย์น่าน',
    budget: 450000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6800952',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 18,
    fdCode: '68005450008',
    acc: 'RSC-68_ระบบไฟฟ้า-อมก๋อย_สกสว',
    projectName: 'การศึกษาแนวทางการบริหารจัดการระบบผลิตไฟฟ้าแบบไม่เชื่อมต่อสายส่ง กรณีศึกษา อำเภออมก๋อย จังหวัดเชียงใหม่',
    budget: 220000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6800545',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 19,
    fdCode: '68004800002',
    acc: 'RSC-68_แหล่งเรียนรู้ชุมชนสกลนคร_สกสว',
    projectName: 'การพัฒนาการจัดการเรียนรู้โดยใช้ชุมชนเป็นฐานเพื่อส่งเสริมสมรรถนะของทักษะการเรียนรู้ในศตวรรษที่ 21 สำหรับนักเรียนระดับชั้นประถมศึกษา อำเภอเต่างอย จังหวัดสกลนคร',
    budget: 550000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6800480',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 20,
    fdCode: '68004760002',
    acc: 'RSC-68_เห็ดป่า-ชุมชน_สกสว',
    projectName: 'มูลค่าเห็ดป่ากินได้และการใช้ประโยชน์อย่างยั่งยืนในตำบลเต่างอย จังหวัดสกลนคร',
    budget: 400000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6800476',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 21,
    fdCode: '68003420002',
    acc: 'RSC-68_แผนแม่บทแกน้อย_สกสว',
    projectName: 'การวางแผนการใช้ที่ดินเพื่อสนับสนุนโครงการจัดทำแผนแม่บทในการพัฒนาพื้นที่สูงอย่างยั่งยืน กรณีศึกษา ศูนย์พัฒนาโครงการหลวงแกน้อย',
    budget: 600000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6800342',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 22,
    fdCode: '68003400012',
    acc: 'RSC-68_สมาทฟาร์ม-คกล_สกสว',
    projectName: 'การพัฒนาระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ สำหรับภูมิอากาศของไทย',
    budget: 400000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6800340',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 23,
    fdCode: '68324250001',
    acc: 'TR-RSC-KRIS-68_43',
    projectName: 'การประชุมวิชาการ เรื่อง ความรู้และการวิจัยเพื่อสังคมที่เท่าเทียม (Knowledge and research inclusive society seminar) ระหว่างวันที่ 24 - 25 พฤศจิกายน 2568 โครงการการจัดการเรียนรู้แบบ Non-Degree (หน่วยการเรียนรู้ Train)',
    budget: 1375000,
    planCode: '40003000',
    planName: 'งานฝึกอบรม',
    projectCode: '6802425',
    expenseCode: 'E0205001',
    expenseName: 'รายจ่ายอื่น',
    fundCode: 'S05',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 24,
    fdCode: '69002430011',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'ฮีทเตอร์ไฟฟ้า 2,000 W จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 5000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0406000',
    expenseName: 'ค่าครุภัณฑ์ไฟฟ้าและวิทยุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 25,
    fdCode: '69002430010',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'เครื่องแลกเปลี่ยนความร้อนแบบไหลสวนทาง จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 15000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0402000',
    expenseName: 'ค่าครุภัณฑ์การศึกษา',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 26,
    fdCode: '69002430009',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'มอเตอร์ขนาด 2 แรงม้า จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 10000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0410000',
    expenseName: 'ค่าครุภัณฑ์โรงงาน',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 27,
    fdCode: '69002430008',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'พัดลมแลกเปลี่ยนความร้อน สำหรับ Heat Exchanger จำนวน 2 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 20000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0402000',
    expenseName: 'ค่าครุภัณฑ์การศึกษา',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 28,
    fdCode: '69002430007',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'ปั๊มน้ำขนาด 1 แรงม้า จำนวน 2 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 5000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0404000',
    expenseName: 'ค่าครุภัณฑ์การเกษตร',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 29,
    fdCode: '69002430006',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'Dehumidifier Wheel (Silica Gel) จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 48000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0402000',
    expenseName: 'ค่าครุภัณฑ์การศึกษา',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 30,
    fdCode: '69002430005',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'พัดลมดูดอากาศออก อัตราการไหลไม่น้อยกว่า 1,000 CFM จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 20000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0401000',
    expenseName: 'ค่าครุภัณฑ์สำนักงาน',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 31,
    fdCode: '69002430004',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'พัดลมดูดอากาศเข้า อัตราการไหลไม่น้อยกว่า 1,000 CFM จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 20000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0401000',
    expenseName: 'ค่าครุภัณฑ์สำนักงาน',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 32,
    fdCode: '69002430003',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'เครื่องแลกเปลี่ยนความร้อนแบบไหลสวนทาง จำนวน 1 เครื่อง - การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 30000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0402000',
    expenseName: 'ค่าครุภัณฑ์การศึกษา',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  },
  {
    no: 33,
    fdCode: '69002430002',
    acc: 'RSC-69-โรงเรือนอัจฉริยะพื้นที่สูง_สกสว',
    projectName: 'การประยุกต์ใช้ระบบการทำความเย็นไอระเหยไม่สัมผัสแบบดึงน้ำกลับ ร่วมกับโรงเรือนอัจฉริยะสำหรับการปลูกพืชบนพื้นที่สูง',
    budget: 289000,
    planCode: '30002000',
    planName: 'งานวิจัยโครงการ',
    projectCode: '6900243',
    expenseCode: 'E0204001',
    expenseName: '(เงินอุดหนุน) ใช้สอย,วัสดุ',
    fundCode: 'S04',
    fundName: 'รายรับจากงานวิจัยและวิชาการ',
    fiscalYear: '2569',
    spent: 0,
    status: 'active'
  }
]

/**
 * ฟังก์ชันค้นหา FD จาก ACC
 */
export const getFDByAcc = (acc) => {
  return fdCodes.find(fd => fd.acc === acc)
}

/**
 * ฟังก์ชันค้นหา FD จาก FD Code
 */
export const getFDByCode = (fdCode) => {
  return fdCodes.find(fd => fd.fdCode === fdCode)
}

/**
 * ฟังก์ชันดึงรายการ ACC สำหรับ dropdown (unique ACC only)
 */
export const getAccOptions = () => {
  // Get unique ACC values
  const uniqueAccs = [...new Set(fdCodes.filter(fd => fd.status === 'active').map(fd => fd.acc))]
  
  return uniqueAccs.map(acc => {
    // Get first FD with this ACC for project name
    const fd = fdCodes.find(f => f.acc === acc)
    // Sum budget for all FDs with same ACC
    const totalBudget = fdCodes
      .filter(f => f.acc === acc && f.status === 'active')
      .reduce((sum, f) => sum + f.budget, 0)
    const totalSpent = fdCodes
      .filter(f => f.acc === acc && f.status === 'active')
      .reduce((sum, f) => sum + f.spent, 0)
    
    return {
      value: acc,
      label: acc,
      fdCode: fd.fdCode,
      projectName: fd.projectName,
      budget: totalBudget,
      spent: totalSpent,
      remaining: totalBudget - totalSpent
    }
  })
}

/**
 * ฟังก์ชันดึงรายการ FD Code สำหรับ dropdown
 */
export const getFDOptions = () => {
  return fdCodes
    .filter(fd => fd.status === 'active')
    .map(fd => ({
      value: fd.fdCode,
      label: `${fd.fdCode} - ${fd.expenseName}`,
      acc: fd.acc,
      projectName: fd.projectName,
      budget: fd.budget,
      spent: fd.spent,
      remaining: fd.budget - fd.spent
    }))
}

/**
 * ฟังก์ชันดึงรายการ FD ตาม ACC
 */
export const getFDsByAcc = (acc) => {
  return fdCodes.filter(fd => fd.acc === acc && fd.status === 'active')
}

/**
 * Format จำนวนเงินเป็น string พร้อมเครื่องหมายคอมม่า
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH').format(amount)
}

export default fdCodes
