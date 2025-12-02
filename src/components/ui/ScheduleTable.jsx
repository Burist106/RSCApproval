import { useState } from 'react'
import { Button, Input, Select } from './index'

/**
 * ScheduleTable Component
 * Editable table for activity schedule (กำหนดการ)
 * 
 * @param {array} items - Schedule items array
 * @param {function} onChange - Change handler
 */

const defaultItem = {
  date: '',
  time: '',
  activity: '',
  location: '',
}

export default function ScheduleTable({
  items = [],
  onChange,
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
      const newItems = items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
      onChange(newItems)
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-slate-700">
          <i className="fa-solid fa-calendar-days mr-2 text-slate-400"></i>
          กำหนดการ
        </label>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <i className="fa-solid fa-plus"></i>
          เพิ่มกิจกรรม
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-calendar-plus text-3xl text-slate-300 mb-3"></i>
          <p className="text-sm text-slate-500 mb-3">ยังไม่มีกำหนดการ</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <i className="fa-solid fa-plus"></i>
            เพิ่มกิจกรรมแรก
          </Button>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-600 w-32">วันที่</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600 w-28">เวลา</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">กิจกรรม</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600 w-40">สถานที่</th>
                <th className="px-3 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr key={item.id || index} className="group hover:bg-slate-50/50">
                  <td className="px-2 py-2">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleChange(index, 'date', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => handleChange(index, 'time', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => handleChange(index, 'activity', e.target.value)}
                      placeholder="ระบุกิจกรรม..."
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      placeholder="สถานที่..."
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
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
          </table>
        </div>
      )}
    </div>
  )
}
