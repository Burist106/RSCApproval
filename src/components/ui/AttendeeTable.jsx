import Button from './Button'

/**
 * AttendeeTable
 * Editable attendee/participant table component
 */

const titleOptions = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
  { value: 'ดร.', label: 'ดร.' },
  { value: 'ผศ.', label: 'ผศ.' },
  { value: 'รศ.', label: 'รศ.' },
  { value: 'ศ.', label: 'ศ.' },
  { value: 'ผศ.ดร.', label: 'ผศ.ดร.' },
  { value: 'รศ.ดร.', label: 'รศ.ดร.' },
  { value: 'ศ.ดร.', label: 'ศ.ดร.' },
]

export default function AttendeeTable({ value = [], onChange, readOnly = false }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      title: 'นาย',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      role: '', // บทบาทในการเดินทาง
    }
    onChange([...value, newItem])
  }

  const handleRemove = (id) => {
    onChange(value.filter(item => item.id !== id))
  }

  const handleItemChange = (id, field, newValue) => {
    onChange(value.map(item => 
      item.id === id ? { ...item, [field]: newValue } : item
    ))
  }

  if (readOnly) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-center w-12">ลำดับ</th>
              <th className="border border-gray-300 px-3 py-2 text-left">ชื่อ-นามสกุล</th>
              <th className="border border-gray-300 px-3 py-2 text-left">ตำแหน่ง</th>
              <th className="border border-gray-300 px-3 py-2 text-left">หน่วยงาน</th>
              <th className="border border-gray-300 px-3 py-2 text-left">บทบาท</th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan="5" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  ยังไม่มีรายชื่อผู้เดินทาง
                </td>
              </tr>
            ) : (
              value.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    {item.title}{item.firstName} {item.lastName}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">{item.position || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.department || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.role || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-2 text-center w-12">ลำดับ</th>
              <th className="border border-gray-300 px-2 py-2 text-left w-20">คำนำหน้า</th>
              <th className="border border-gray-300 px-2 py-2 text-left">ชื่อ</th>
              <th className="border border-gray-300 px-2 py-2 text-left">นามสกุล</th>
              <th className="border border-gray-300 px-2 py-2 text-left">ตำแหน่ง</th>
              <th className="border border-gray-300 px-2 py-2 text-left">หน่วยงาน</th>
              <th className="border border-gray-300 px-2 py-2 text-left">บทบาท</th>
              <th className="border border-gray-300 px-2 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  คลิก "เพิ่มผู้ร่วมเดินทาง" เพื่อเพิ่มรายชื่อ
                </td>
              </tr>
            ) : (
              value.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-1">
                    <select
                      value={item.title}
                      onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {titleOptions.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.firstName}
                      onChange={(e) => handleItemChange(item.id, 'firstName', e.target.value)}
                      placeholder="ชื่อ"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.lastName}
                      onChange={(e) => handleItemChange(item.id, 'lastName', e.target.value)}
                      placeholder="นามสกุล"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.position}
                      onChange={(e) => handleItemChange(item.id, 'position', e.target.value)}
                      placeholder="ตำแหน่ง"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.department}
                      onChange={(e) => handleItemChange(item.id, 'department', e.target.value)}
                      placeholder="หน่วยงาน"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
                      placeholder="บทบาท"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="ลบรายการ"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full border-dashed"
      >
        <i className="fa-solid fa-user-plus mr-2"></i>
        เพิ่มผู้ร่วมเดินทาง
      </Button>
    </div>
  )
}
