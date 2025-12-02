import { useState } from 'react'
import { Button, Input, Select } from './index'

/**
 * ExpenseTable Component
 * Editable table for expenses/budget (ค่าใช้จ่าย)
 * 
 * @param {array} items - Expense items array
 * @param {function} onChange - Change handler
 * @param {boolean} showCategory - Show category column
 */

// Expense categories
const expenseCategories = [
  { value: 'travel', label: 'ค่าเดินทาง' },
  { value: 'accommodation', label: 'ค่าที่พัก' },
  { value: 'food', label: 'ค่าอาหาร/เครื่องดื่ม' },
  { value: 'material', label: 'ค่าวัสดุ' },
  { value: 'equipment', label: 'ค่าอุปกรณ์' },
  { value: 'speaker', label: 'ค่าวิทยากร' },
  { value: 'document', label: 'ค่าเอกสาร' },
  { value: 'other', label: 'อื่นๆ' },
]

const defaultItem = {
  category: '',
  description: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0,
}

export default function ExpenseTable({
  items = [],
  onChange,
  showCategory = true,
  className = '',
}) {
  const handleAdd = () => {
    if (onChange) {
      onChange([...items, { ...defaultItem, id: Date.now() }])
    }
  }

  const handleRemove = (index) => {
    if (onChange) {
      const newItems = items.filter((_, i) => i !== index)
      onChange(newItems)
    }
  }

  const handleChange = (index, field, value) => {
    if (onChange) {
      const newItems = items.map((item, i) => {
        if (i !== index) return item
        
        const updated = { ...item, [field]: value }
        
        // Auto-calculate amount
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = (updated.quantity || 0) * (updated.unitPrice || 0)
        }
        
        return updated
      })
      onChange(newItems)
    }
  }

  // Calculate total
  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0)

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-slate-700">
          <i className="fa-solid fa-coins mr-2 text-slate-400"></i>
          ค่าใช้จ่าย
        </label>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i>
          เพิ่มรายการ
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-receipt text-3xl text-slate-300 mb-3"></i>
          <p className="text-sm text-slate-500 mb-3">ยังไม่มีรายการค่าใช้จ่าย</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i>
            เพิ่มรายการแรก
          </Button>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 w-10">#</th>
                  {showCategory && (
                    <th className="px-3 py-2 text-left font-medium text-slate-600 w-36">หมวดหมู่</th>
                  )}
                  <th className="px-3 py-2 text-left font-medium text-slate-600">รายละเอียด</th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 w-20">หน่วย</th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 w-20">จำนวน</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600 w-28">ราคา/หน่วย</th>
                  <th className="px-3 py-2 text-right font-medium text-slate-600 w-28">รวม</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <tr key={item.id || index} className="group hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-400 text-center">{index + 1}</td>
                    {showCategory && (
                      <td className="px-2 py-2">
                        <select
                          value={item.category}
                          onChange={(e) => handleChange(index, 'category', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                        >
                          <option value="">เลือก...</option>
                          {expenseCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </td>
                    )}
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                        placeholder="ระบุรายละเอียด..."
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleChange(index, 'unit', e.target.value)}
                        placeholder="หน่วย"
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-center"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-center"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-slate-800">
                      {(item.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-primary-50">
                <tr>
                  <td colSpan={showCategory ? 6 : 5} className="px-4 py-3 font-bold text-slate-800 text-right">
                    รวมทั้งสิ้น
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-primary-600 text-lg">
                    {totalAmount.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary */}
      {items.length > 0 && (
        <div className="mt-3 flex justify-end">
          <div className="bg-slate-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-slate-500">ยอดรวม:</span>
            <span className="ml-2 text-lg font-bold text-primary-600">
              {totalAmount.toLocaleString()} บาท
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
