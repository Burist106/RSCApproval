import { useState } from 'react'
import { 
  Navbar, 
  Footer, 
  Button, 
  Badge, 
  SectionHeader, 
  FeatureCard, 
  StepCircle, 
  LoginModal 
} from './components'

// Data for features section
const features = [
  {
    icon: 'fa-solid fa-file-contract',
    color: 'primary',
    title: 'ขออนุมัติโครงการ',
    description: 'ระบบ Wizard ช่วยสร้างบันทึกข้อความขออนุมัติโครงการ พร้อมเชื่อมโยงการใช้รถและยืมเงินอัตโนมัติ',
  },
  {
    icon: 'fa-solid fa-money-bill-transfer',
    color: 'blue',
    title: 'ยืมเงิน (FOTO-04)',
    description: 'สร้างสัญญายืมเงินทดรองจ่ายได้ง่ายๆ ระบบช่วยตรวจสอบวงเงินและเงื่อนไขการอนุมัติให้อัตโนมัติ',
  },
  {
    icon: 'fa-solid fa-car',
    color: 'purple',
    title: 'ขอใช้รถยนต์',
    description: 'แบบฟอร์มขออนุมัติใช้รถยนต์ส่วนตัว คำนวณระยะทางและค่าชดเชยน้ำมันให้อย่างแม่นยำ',
  },
  {
    icon: 'fa-solid fa-plane-departure',
    color: 'teal',
    title: 'เดินทางราชการ',
    description: 'ขออนุมัติเดินทางไปประชุม/อบรม พร้อมตารางคำนวณเบี้ยเลี้ยงและที่พักตามระเบียบ',
  },
]

// Data for process steps
const steps = [
  {
    step: 1,
    status: 'default',
    title: 'ยื่นคำขอ',
    description: 'นักวิจัยกรอกข้อมูลผ่านระบบ Wizard และแนบเอกสารที่จำเป็น',
  },
  {
    step: 2,
    status: 'active',
    title: 'ตรวจสอบ',
    description: 'Admin ตรวจสอบความถูกต้องและครบถ้วนของเอกสาร (Screening)',
  },
  {
    step: 3,
    status: 'done',
    title: 'อนุมัติ',
    description: 'ผอ.ศูนย์ พิจารณาอนุมัติผ่านระบบ และออกเอกสาร PDF อัตโนมัติ',
  },
]

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleRoleSelect = (roleId) => {
    console.log('Selected role:', roleId)
    // TODO: Navigate to role-specific dashboard
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <Badge variant="primary" dot className="mb-6">
              Digital Transformation Phase 1
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              ระบบบริหารจัดการโครงการ<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-red-600">และงบประมาณออนไลน์</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              เปลี่ยนการทำงานรูปแบบเดิมสู่ระบบดิจิทัลเต็มรูปแบบ ลดขั้นตอนเอกสาร ติดตามสถานะได้ทันที พร้อมระบบตรวจสอบงบประมาณอัจฉริยะ สำหรับศูนย์ RSC มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowLoginModal(true)} 
                className="hover:-translate-y-1"
              >
                เริ่มต้นใช้งานทันที
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                as="a"
                href="#features"
              >
                <i className="fa-solid fa-circle-play"></i> ดูฟีเจอร์หลัก
              </Button>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-float">
            <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl shadow-slate-400/50">
              <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                {/* Mockup Header */}
                <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                {/* Mockup Body */}
                <div className="bg-slate-50 p-6 grid grid-cols-4 gap-4 h-64 md:h-96 items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-2xl uppercase tracking-widest opacity-20 transform -rotate-12">
                    Smart Dashboard Preview
                  </div>
                  {/* Mockup Cards */}
                  <div className="col-span-4 md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-32 animate-pulse"></div>
                  <div className="col-span-4 md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-32 animate-pulse"></div>
                  <div className="col-span-4 md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-32 animate-pulse"></div>
                  <div className="col-span-4 md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-32 animate-pulse"></div>
                  <div className="col-span-4 md:col-span-3 bg-white p-4 rounded-lg shadow-sm h-48 mt-4 animate-pulse"></div>
                  <div className="col-span-4 md:col-span-1 bg-white p-4 rounded-lg shadow-sm h-48 mt-4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="บริการหลักของระบบ"
            subtitle="รองรับกระบวนการขออนุมัติเอกสารสำคัญทั้ง 4 ประเภท ครอบคลุมทุกความต้องการของนักวิจัยและเจ้าหน้าที่"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader 
            title="ขั้นตอนการทำงาน"
            subtitle="ลดความซับซ้อน เหลือเพียง 3 ขั้นตอนหลัก"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            
            {steps.map((stepData) => (
              <StepCircle key={stepData.step} {...stepData} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSelectRole={handleRoleSelect}
      />
    </div>
  )
}

export default App
