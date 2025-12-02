import Button from './Button'

/**
 * TravelTable
 * Editable travel itinerary table component
 */

const vehicleTypes = [
  { value: 'plane', label: 'เครื่องบิน' },
  { value: 'train', label: 'รถไฟ' },
  { value: 'bus', label: 'รถโดยสารประจำทาง' },
  { value: 'van', label: 'รถตู้' },
  { value: 'personal-car', label: 'รถยนต์ส่วนตัว' },
  { value: 'official-car', label: 'รถยนต์ราชการ' },
  { value: 'taxi', label: 'รถแท็กซี่' },
  { value: 'other', label: 'อื่นๆ' },
]

export default function TravelTable({ value = [], onChange, readOnly = false }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      date: '',
      departureTime: '',
      arrivalTime: '',
      origin: '',
      destination: '',
      vehicleType: 'bus',
      fare: 0,
      notes: '',
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

  const totalFare = value.reduce((sum, item) => sum + (parseFloat(item.fare) || 0), 0)

  if (readOnly) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left">วันที่</th>
              <th className="border border-gray-300 px-3 py-2 text-left">เวลาออก</th>
              <th className="border border-gray-300 px-3 py-2 text-left">เวลาถึง</th>
              <th className="border border-gray-300 px-3 py-2 text-left">ต้นทาง</th>
              <th className="border border-gray-300 px-3 py-2 text-left">ปลายทาง</th>
              <th className="border border-gray-300 px-3 py-2 text-left">พาหนะ</th>
              <th className="border border-gray-300 px-3 py-2 text-right">ค่าใช้จ่าย (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan="7" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  ยังไม่มีรายการเดินทาง
                </td>
              </tr>
            ) : (
              value.map((item, index) => {
                const vehicle = vehicleTypes.find(v => v.value === item.vehicleType)
                return (
                  <tr key={item.id || index}>
                    <td className="border border-gray-300 px-3 py-2">{item.date || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.departureTime || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.arrivalTime || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.origin || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{item.destination || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{vehicle?.label || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      {(item.fare || 0).toLocaleString()}
                    </td>
                  </tr>
                )
              })
            )}
            <tr className="bg-gray-50 font-medium">
              <td colSpan="6" className="border border-gray-300 px-3 py-2 text-right">
                รวมค่าพาหนะทั้งหมด
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {totalFare.toLocaleString()} บาท
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-2 text-left w-28">วันที่</th>
              <th className="border border-gray-300 px-2 py-2 text-left w-20">เวลาออก</th>
              <th className="border border-gray-300 px-2 py-2 text-left w-20">เวลาถึง</th>
              <th className="border border-gray-300 px-2 py-2 text-left">ต้นทาง</th>
              <th className="border border-gray-300 px-2 py-2 text-left">ปลายทาง</th>
              <th className="border border-gray-300 px-2 py-2 text-left w-36">พาหนะ</th>
              <th className="border border-gray-300 px-2 py-2 text-left w-28">ค่าใช้จ่าย</th>
              <th className="border border-gray-300 px-2 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  คลิก "เพิ่มรายการ" เพื่อเพิ่มรายการเดินทาง
                </td>
              </tr>
            ) : (
              value.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleItemChange(item.id, 'date', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="time"
                      value={item.departureTime}
                      onChange={(e) => handleItemChange(item.id, 'departureTime', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="time"
                      value={item.arrivalTime}
                      onChange={(e) => handleItemChange(item.id, 'arrivalTime', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.origin}
                      onChange={(e) => handleItemChange(item.id, 'origin', e.target.value)}
                      placeholder="สถานที่ต้นทาง"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.destination}
                      onChange={(e) => handleItemChange(item.id, 'destination', e.target.value)}
                      placeholder="สถานที่ปลายทาง"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <select
                      value={item.vehicleType}
                      onChange={(e) => handleItemChange(item.id, 'vehicleType', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {vehicleTypes.map(v => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      value={item.fare}
                      onChange={(e) => handleItemChange(item.id, 'fare', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-right"
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
            {value.length > 0 && (
              <tr className="bg-gray-50 font-medium">
                <td colSpan="6" className="border border-gray-300 px-3 py-2 text-right">
                  รวมค่าพาหนะทั้งหมด
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {totalFare.toLocaleString()} บาท
                </td>
                <td className="border border-gray-300"></td>
              </tr>
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
        <i className="fa-solid fa-plus mr-2"></i>
        เพิ่มรายการเดินทาง
      </Button>
    </div>
  )
}
