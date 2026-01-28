'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

export default function Calendar() {
  return (
    <div className="card bg-base-100 shadow-xl relative py-4 px-5 md:px-[10%]">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        locale={frLocale}
        events={[
         
          { title: 'Réunion', date: '2026-01-10' },
          { title: 'Meeting équipe', date: '2026-01-15' },
        ]}
      />
    </div>
  )
}
