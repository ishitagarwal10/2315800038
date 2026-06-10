import React, { useState, useEffect } from 'react';
import { Log } from '../../logging_middleware/logger';
import { processPriorityInbox } from './utils/prioritySorter';
import './App.css';

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [priorityLimit, setPriorityLimit] = useState(10);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Replace this with your actual access token from registration
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJpc2hpdGEuYWdhcndhbDE5OUBnbWFpbC5jb20iLCJleHAiOjE3ODEwNzMxMjEsImlhdCI6MTc4MTA3MjIyMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijk0Mjg5ZDdlLWVmZWMtNGNlYS1hZjRkLTNjN2RhY2NkZmRiYyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImlzaGl0YSBhZ2Fyd2FsIiwic3ViIjoiMDUxZWNhZDEtYTI0Zi00MzFhLWE4MGEtMTEyNTg5N2MyZTViIn0sImVtYWlsIjoiaXNoaXRhLmFnYXJ3YWwxOTlAZ21haWwuY29tIiwibmFtZSI6ImlzaGl0YSBhZ2Fyd2FsIiwicm9sbE5vIjoiMjMxNTgwMDAzOCIsImFjY2Vzc0NvZGUiOiJSUHNnWXQiLCJjbGllbnRJRCI6IjA1MWVjYWQxLWEyNGYtNDMxYS1hODBhLTExMjU4OTdjMmU1YiIsImNsaWVudFNlY3JldCI6IkV4c0pKcXpFVEpHUGVZcXoifQ.ZQOq_S5mfJ1qAH_eOn_DPbJ73KvdEkYm2jJ76oZftLg";

  useEffect(() => {
    fetchNotifications();
  }, [activeFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    let url = "http://4.224.186.213/evaluation-service/notifications";
    
    // Stage 2: Append filters via query constraints dynamically
    if (activeFilter !== 'All') {
      url += `?notification_type=${activeFilter}`;
    }

    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
      });
      
      if (!res.ok) throw new Error(`HTTP status code ${res.status}`);
      
      const data = await res.json();
      const fetchedItems = data.notifications || [];
      setNotifications(fetchedItems);
      
      // MANDATORY LOGGING INTEGRATION
      await Log("frontend", "info", "api", `Fetched ${fetchedItems.length} notifications dynamically using filter: ${activeFilter}`);
      
    } catch (err) {
      // MANDATORY LOGGING INTEGRATION FOR EXCEPTIONS
      await Log("frontend", "error", "api", `Failed extracting system feed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const priorityFeed = processPriorityInbox(notifications, priorityLimit);

  return (
    <div className="app-layout">
      <header className="navbar">
        <h1>Campus Alert Center</h1>
      </header>

      <section className="dashboard-toolbar">
        <div className="control-group">
          <label htmlFor="filter">Notification Type Filter: </label>
          <select 
            id="filter" 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="All">All Feed Items</option>
            <option value="Placement">Placements Only</option>
            <option value="Result">Results Only</option>
            <option value="Event">Events Only</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="limit">Priority Display Limit: </label>
          <input 
            id="limit"
            type="number" 
            min="1" 
            max="50"
            value={priorityLimit} 
            onChange={(e) => setPriorityLimit(Number(e.target.value) || 10)} 
          />
        </div>
      </section>

      {loading ? (
        <div className="loader-state"><p>Retrieving server broadcast...</p></div>
      ) : (
        <main className="dashboard-viewport">
          {/* Priority Column */}
          <div className="panel priority-panel">
            <h2>🔥 Priority Inbox (Top {priorityLimit})</h2>
            {priorityFeed.length === 0 ? <p className="empty-text">No priorities listed.</p> : (
              priorityFeed.map(item => (
                <div key={item.ID} className={`alert-card edge-${item.Type}`}>
                  <span className="type-tag">{item.Type}</span>
                  <p className="msg-body">{item.Message}</p>
                  <span className="date-stamp">{item.Timestamp}</span>
                </div>
              ))
            )}
          </div>

          {/* General Stream Column */}
          <div className="panel stream-panel">
            <h2>📋 General Broadcast Stream</h2>
            {notifications.length === 0 ? <p className="empty-text">Feed is currently empty.</p> : (
              notifications.map(item => (
                <div key={item.ID} className="alert-card standard">
                  <span className="type-tag">{item.Type}</span>
                  <p className="msg-body">{item.Message}</p>
                  <span className="date-stamp">{item.Timestamp}</span>
                </div>
              ))
            )}
          </div>
        </main>
      )}
    </div>
  );
}