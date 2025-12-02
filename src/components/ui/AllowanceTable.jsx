import Button from './Button'

/**
 * AllowanceTable
 * Editable per diem (เบี้ยเลี้ยง) and accommodation table component
 */

export default function AllowanceTable({ value = [], onChange, readOnly = false }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      date: '',
      perDiemRate: 240, // Default rate per day
      perDiemAmount: 240,
      accommodationRate: 0,
      accommodationAmount: 0,
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

  const totalPerDiem = value.reduce((sum, item) => sum + (parseFloat(item.perDiemAmount) || 0), 0)
  const totalAccommodation = value.reduce((sum, item) => sum + (parseFloat(item.accommodationAmount) || 0), 0)
  const grandTotal = totalPerDiem + totalAccommodation

  if (readOnly) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left" rowSpan="2">วันที่</th>
              <th className="border border-gray-300 px-3 py-2 text-center" colSpan="2">เบี้ยเลี้ยง</th>
              <th className="border border-gray-300 px-3 py-2 text-center" colSpan="2">ค่าที่พัก</th>
              <th className="border border-gray-300 px-3 py-2 text-left" rowSpan="2">หมายเหตุ</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-right">อัตรา/วัน</th>
              <th className="border border-gray-300 px-3 py-2 text-right">จำนวนเงิน</th>
              <th className="border border-gray-300 px-3 py-2 text-right">อัตรา/คืน</th>
              <th className="border border-gray-300 px-3 py-2 text-right">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan="6" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  ยังไม่มีรายการค่าเบี้ยเลี้ยงและที่พัก
                </td>
              </tr>
            ) : (
              value.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="border border-gray-300 px-3 py-2">{item.date || '-'}</td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {(item.perDiemRate || 0).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {(item.perDiemAmount || 0).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {(item.accommodationRate || 0).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {(item.accommodationAmount || 0).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">{item.notes || '-'}</td>
                </tr>
              ))
            )}
            <tr className="bg-gray-50 font-medium">
              <td className="border border-gray-300 px-3 py-2 text-right">รวม</td>
              <td className="border border-gray-300 px-3 py-2"></td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {totalPerDiem.toLocaleString()} บาท
              </td>
              <td className="border border-gray-300 px-3 py-2"></td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {totalAccommodation.toLocaleString()} บาท
              </td>
              <td className="border border-gray-300 px-3 py-2"></td>
            </tr>
            <tr className="bg-primary-50 font-bold">
              <td colSpan="5" className="border border-gray-300 px-3 py-2 text-right">
                รวมค่าเบี้ยเลี้ยงและค่าที่พักทั้งหมด
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right text-primary-700">
                {grandTotal.toLocaleString()} บาท
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
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-2 text-left w-32" rowSpan="2">วันที่</th>
              <th className="border border-gray-300 px-2 py-2 text-center" colSpan="2">เบี้ยเลี้ยง</th>
              <th className="border border-gray-300 px-2 py-2 text-center" colSpan="2">ค่าที่พัก</th>
              <th className="border border-gray-300 px-2 py-2 text-left" rowSpan="2">หมายเหตุ</th>
              <th className="border border-gray-300 px-2 py-2 w-12" rowSpan="2"></th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-2 py-2 text-right w-24">อัตรา/วัน</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-24">จำนวนเงิน</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-24">อัตรา/คืน</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-24">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {value.length === 0 ? (
              <tr>
                <td colSpan="7" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                  คลิก "เพิ่มรายการ" เพื่อเพิ่มค่าเบี้ยเลี้ยงและที่พัก
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
                      type="number"
                      value={item.perDiemRate}
                      onChange={(e) => handleItemChange(item.id, 'perDiemRate', parseFloat(e.target.value) || 0)}
                      placeholder="240"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      value={item.perDiemAmount}
                      onChange={(e) => handleItemChange(item.id, 'perDiemAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      value={item.accommodationRate}
                      onChange={(e) => handleItemChange(item.id, 'accommodationRate', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      value={item.accommodationAmount}
                      onChange={(e) => handleItemChange(item.id, 'accommodationAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-right"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                      placeholder="หมายเหตุ"
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
            {value.length > 0 && (
              <>
                <tr className="bg-gray-50 font-medium">
                  <td className="border border-gray-300 px-3 py-2 text-right">รวม</td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {totalPerDiem.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {totalAccommodation.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2" colSpan="2"></td>
                </tr>
                <tr className="bg-primary-50 font-bold">
                  <td colSpan="5" className="border border-gray-300 px-3 py-2 text-right">
                    รวมทั้งหมด
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-primary-700">
                    {grandTotal.toLocaleString()} บาท
                  </td>
                  <td className="border border-gray-300"></td>
                </tr>
              </>
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
        เพิ่มรายการ
      </Button>
    </div>
  )
}
