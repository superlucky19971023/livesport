import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState, useMemo } from 'react';
import './CalendarModal.css';
import { star, close } from 'ionicons/icons';
import { fetchData } from '../../apiServices';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  favoriteTeams?: number[];
}

interface CalendarDay {
  date: number;
  hasEvents: boolean;
  hasFavoriteTeam: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, onDateSelect, favoriteTeams = [] }) => {
  const currentDate = new Date(); // Remove useState since we only show current month
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [eventCache, setEventCache] = useState<Record<string, any[]>>({});

  const fetchMonthEvents = async (year: number, month: number) => {
    const cacheKey = `${year}-${month}`;
    if (eventCache[cacheKey]) {
      return eventCache[cacheKey];
    }

    try {
      // Get all days in the month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const allMonthEvents = [];

      // Fetch data for each day in the month
      for (let day = 1; day <= daysInMonth; day++) {
        console.log(`Fetching events for ${day}/${month + 1}/${year}`);
        const response = await fetchData(`matches/${day}/${month + 1}/${year}`);
        if (response?.events) {
          const dayEvents = response.events.map((event: any) => ({
            startTimestamp: event.startTimestamp,
            homeTeamId: event.homeTeam.id,
            awayTeamId: event.awayTeam.id
          }));
          allMonthEvents.push(...dayEvents);
        }
      }
      
      setEventCache(prev => ({
        ...prev,
        [cacheKey]: allMonthEvents
      }));
      
      return allMonthEvents;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: CalendarDay[] = [];

    // Add empty slots for proper alignment
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: 0,
        hasEvents: false,
        hasFavoriteTeam: false,
        isCurrentMonth: false,
        isSelected: false
      });
    }

    // Create a map of dates to events for faster lookup
    const eventsByDate = events.reduce((acc: Record<number, any[]>, event) => {
      const eventDate = new Date(event.startTimestamp * 1000);
      if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
        const day = eventDate.getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(event);
      }
      return acc;
    }, {});

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEvents = eventsByDate[i] || [];
      const hasFavoriteTeam = dayEvents.some(event => 
        favoriteTeams.includes(event.homeTeamId) || 
        favoriteTeams.includes(event.awayTeamId)
      );

      days.push({
        date: i,
        hasEvents: dayEvents.length > 0,
        hasFavoriteTeam,
        isCurrentMonth: true,
        isSelected: selectedDate?.getDate() === i && 
                   selectedDate?.getMonth() === month && 
                   selectedDate?.getFullYear() === year
      });
    }

    return days;
  }, [currentDate, events, selectedDate, favoriteTeams]);

  useEffect(() => {
    fetchMonthEvents(currentDate.getFullYear(), currentDate.getMonth())
      .then(setEvents);
  }, []);

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day.date
      );
      setSelectedDate(newDate);
      onDateSelect(newDate.toISOString());
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="calendar-modal">
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-header">{day}</div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} 
                         ${day.isSelected ? 'selected' : ''} 
                         ${day.hasEvents ? 'has-events' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="day-content">
                <span className="day-number">{day.date}</span>
                {day.hasFavoriteTeam && (
                  <IonIcon icon={star} className="favorite-indicator" />
                )}
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default CalendarModal; 
