// ============================================================
// js/coach.js — AI Career Coach Frontend Controller
// ============================================================
'use strict';

(function () {
  const { apiFetch, getToken, getSession, showToast } = window.EduNetAPI;
  
  let coachData = null;
  let chartInstance = null;

  // Initialize Page Shell
  if (window.initPageShell) {
    window.initPageShell();
  }

  // Suggestion selector helper
  window.selectSuggestion = function (val) {
    const input = document.getElementById('goalInput');
    if (input) {
      input.value = val;
    }
  };

  // Onboarding generation handler
  const btnGenerate = document.getElementById('btnGenerateBlueprint');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', async () => {
      const input = document.getElementById('goalInput');
      const goal = input ? input.value.trim() : '';

      if (!goal || goal.length < 3) {
        showToast('Please type or select a valid career goal description.', 'warning');
        return;
      }

      btnGenerate.disabled = true;
      btnGenerate.textContent = '🤖 Analyzing Track & Generating Blueprint...';

      try {
        const res = await apiFetch('/api/coach/generate', {
          method: 'POST',
          body: JSON.stringify({ goal })
        });

        if (res.success) {
          showToast('Blueprint generated successfully! Let\'s begin.', 'success');
          // Reload
          await loadCoachDashboard();
        } else {
          showToast(res.message || 'Failed to generate plan.', 'error');
        }
      } catch (e) {
        showToast('Server connection failed.', 'error');
      } finally {
        btnGenerate.disabled = false;
        btnGenerate.textContent = '🚀 Generate Personalized Blueprint';
      }
    });
  }

  // Regenerate / change target plan
  const btnChangeTarget = document.getElementById('btnRegeneratePlan');
  if (btnChangeTarget) {
    btnChangeTarget.addEventListener('click', () => {
      document.getElementById('coachMainPlanner').style.display = 'none';
      document.getElementById('coachOnboarding').style.display = 'block';
      const input = document.getElementById('goalInput');
      if (input && coachData) {
        input.value = coachData.goal || '';
      }
    });
  }

  // Main Loader
  async function loadCoachDashboard() {
    try {
      document.getElementById('coachSkeleton').style.display = 'block';
      document.getElementById('coachOnboarding').style.display = 'none';
      document.getElementById('coachMainPlanner').style.display = 'none';

      const data = await apiFetch('/api/coach/dashboard');
      
      document.getElementById('coachSkeleton').style.display = 'none';

      if (!data.success) {
        showToast('Failed to load mentor details.', 'error');
        return;
      }

      if (data.onboarding) {
        document.getElementById('coachOnboarding').style.display = 'block';
        return;
      }

      coachData = data.coach;
      document.getElementById('coachMainPlanner').style.display = 'block';

      // Update header details
      const goalTitle = document.getElementById('coachGoalTitle');
      const targetDate = document.getElementById('coachCompletionDate');
      if (goalTitle) goalTitle.textContent = coachData.goal;
      if (targetDate) targetDate.textContent = coachData.estimated_completion;

      // Update statistics band
      document.getElementById('statWeeklyPct').textContent = coachData.completion_percentage + '%';
      document.getElementById('statCompletedCount').textContent = coachData.completed_tasks;
      document.getElementById('statStreakDays').textContent = coachData.streak + ' 🔥';
      document.getElementById('statInterviewReady').textContent = coachData.interview_readiness + '/100';
      document.getElementById('statResumeScore').textContent = coachData.resume_score + '%';

      // Load children sections
      await Promise.all([
        loadTodayTasks(),
        loadRecommendations(),
        loadCalendar(),
        loadWeeklyBlueprint()
      ]);

    } catch (err) {
      console.error(err);
      showToast('Error syncing details.', 'error');
    }
  }

  // Render Daily Planners Checklist
  async function loadTodayTasks() {
    const list = document.getElementById('dailyTasksList');
    if (!list) return;

    try {
      const data = await apiFetch('/api/coach/tasks');
      if (!data.success) return;

      const todayStr = new Date().toISOString().slice(0, 10);
      // Filter tasks for today or overdue pending tasks
      const todayTasks = data.tasks.filter(t => {
        return t.task_date === todayStr || (t.status === 'pending' && t.task_date < todayStr);
      });

      if (!todayTasks.length) {
        list.innerHTML = '<div class="empty-state">✅ All set for today! No pending or scheduled tasks.</div>';
        return;
      }

      list.innerHTML = todayTasks.map(t => {
        const isCompleted = t.status === 'completed';
        const badgeClass = `task-badge task-badge-${t.task_type.toLowerCase()}`;
        return `
          <div class="task-item-card ${isCompleted ? 'completed' : ''}">
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.25rem;">
                <span class="${badgeClass}">${t.task_type}</span>
                <span style="font-size:11px; color:var(--mist-dim); font-family:var(--font-mono);">${t.task_date}</span>
              </div>
              <div style="font-size:13.5px; font-weight:600; color:var(--frost);">${t.title}</div>
              <div style="font-size:12px; color:var(--mist); margin-top:2px;">${t.description || ''}</div>
            </div>
            <div class="task-actions">
              ${isCompleted ? `
                <span style="color:var(--emerald); font-size:13px; font-weight:700;">✓ Done</span>
              ` : `
                <button class="btn btn-emerald btn-sm" onclick="taskAction(${t.id}, 'complete')">✓</button>
                <button class="btn btn-secondary btn-sm" onclick="taskAction(${t.id}, 'postpone')" title="Move to Tomorrow">⏳</button>
                <button class="btn btn-danger btn-sm" onclick="taskAction(${t.id}, 'skip')" title="Skip">✕</button>
              `}
            </div>
          </div>
        `;
      }).join('');

    } catch (e) {
      list.innerHTML = '<div class="empty-state">Error loading checklist.</div>';
    }
  }

  // Task checklist action execution wrapper
  window.taskAction = async function (taskId, action) {
    try {
      const res = await apiFetch(`/api/coach/task/${action}`, {
        method: 'POST',
        body: JSON.stringify({ id: taskId })
      });

      if (res.success) {
        showToast(res.message, 'success');
        
        // Silent achievements trigger if completed
        if (action === 'complete' && res.xp_awarded > 0) {
          apiFetch('/api/achievements/check', { method: 'POST' })
            .then(achRes => {
              if (achRes.newly_earned && achRes.newly_earned.length > 0) {
                achRes.newly_earned.forEach(a => {
                  showToast(`🏆 Achievement unlocked: ${a.title}! ${a.xp_reward ? '+' + a.xp_reward + ' XP' : ''}`, 'success', 5000);
                });
              }
            }).catch(() => {});
        }

        // Reload planner states
        await loadCoachDashboard();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  // Render Recommendations Cards
  async function loadRecommendations() {
    const list = document.getElementById('recsList');
    if (!list) return;

    try {
      const data = await apiFetch('/api/coach/recommendations');
      if (!data.success || !data.recommendations.length) {
        list.innerHTML = '<div class="empty-state">No dynamic recommendations compiled yet.</div>';
        return;
      }

      list.innerHTML = data.recommendations.slice(0, 3).map(r => `
        <div class="rec-card">
          <div>
            <div class="rec-type">${r.item_type}</div>
            <div class="rec-title">${r.title}</div>
            <div class="rec-desc">${r.description || ''}</div>
          </div>
          <a href="${r.url || '#'}" class="btn btn-secondary btn-sm btn-full" style="text-align:center; display:block; margin-top:0.5rem;">Explore</a>
        </div>
      `).join('');
    } catch (e) {
      list.innerHTML = '<div class="empty-state">Error loading suggestions.</div>';
    }
  }

  // Render Monthly Calendar Matrix
  async function loadCalendar() {
    const grid = document.getElementById('calendarDaysGrid');
    if (!grid) return;

    try {
      const data = await apiFetch('/api/coach/calendar');
      if (!data.success) return;

      const tasks = data.tasks || [];
      const sessions = data.sessions || [];

      // Calculate calendar month details
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();

      // Days of month
      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
      const prevLastDay = new Date(year, month, 0).getDate();

      let cellsHtml = '';

      // trailing buffer days
      for (let x = firstDayIndex; x > 0; x--) {
        cellsHtml += `<div class="calendar-day-cell other-month">${prevLastDay - x + 1}</div>`;
      }

      // active days
      for (let i = 1; i <= lastDay; i++) {
        const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // Find tasks scheduled on this date
        const dayTasks = tasks.filter(t => t.task_date === currentDayStr);
        const daySession = sessions.find(s => s.day === currentDayStr);
        
        const hasTasks = dayTasks.length > 0;
        const allCompleted = hasTasks && dayTasks.every(t => t.status === 'completed');

        let cellClass = 'calendar-day-cell';
        if (i === date.getDate()) cellClass += ' today';
        if (allCompleted) cellClass += ' all-done';
        else if (hasTasks) cellClass += ' has-tasks';

        cellsHtml += `
          <div class="${cellClass}" title="${dayTasks.length} tasks scheduled">
            <span style="font-weight:600;">${i}</span>
            ${daySession ? `<span style="font-size:8.5px; color:var(--accent); font-weight:700;">${daySession.duration_minutes}m</span>` : ''}
          </div>
        `;
      }

      grid.innerHTML = cellsHtml;

      // Update Analytics Chart configurations
      renderAnalyticsChart(tasks);

    } catch (e) {
      grid.innerHTML = '<div class="empty-state">Error drawing calendar.</div>';
    }
  }

  // Draw weekly blueprint accordion
  async function loadWeeklyBlueprint() {
    const container = document.getElementById('weeklyBlueprintList');
    if (!container) return;

    try {
      const dashboard = await apiFetch('/api/coach/dashboard');
      const tasksData = await apiFetch('/api/coach/tasks');
      if (!dashboard.success || !tasksData.success) return;

      const tasks = tasksData.tasks;
      // Group tasks by week
      const weeklyGroups = { 1: [], 2: [], 3: [], 4: [] };
      tasks.forEach(t => {
        // Deterministic week sorting: evaluate task date difference from coach creation date
        const weekNum = t.week_plan_id ? 1 : 1; // placeholder, group by task_date index
      });

      // Simple mock weekly blueprints
      const weeksInfo = [
        { week: 1, title: 'Week 1: Foundations & Architecture', desc: 'Core setup, initial libraries configuration, syntax review.' },
        { week: 2, title: 'Week 2: Advanced Systems & Interfaces', desc: 'Database connections setups, REST operations routing.' },
        { week: 3, title: 'Week 3: Scale & Socket Integrations', desc: 'Realtime updates, indexing benchmarks tuning.' },
        { week: 4, title: 'Week 4: Mock Readiness & Placements', desc: 'Docker packaging configurations, placement interviews.' }
      ];

      container.innerHTML = weeksInfo.map((w, idx) => {
        // Filter tasks for this week based on dates spacing (each week is 7 days)
        const weekTasks = tasks.filter(t => {
          const creationDate = new Date(coachData.estimated_completion);
          creationDate.setDate(creationDate.getDate() - 28);
          
          const tDate = new Date(t.task_date);
          const diffTime = Math.abs(tDate - creationDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays >= (idx * 7) && diffDays < ((idx + 1) * 7);
        });

        const completedCount = weekTasks.filter(t => t.status === 'completed').length;
        const totalCount = weekTasks.length;
        const weekPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

        return `
          <div class="week-accordion-item ${idx === 0 ? 'open' : ''}" id="weekAccordion_${w.week}">
            <div class="week-header" onclick="toggleAccordion(${w.week})">
              <span>${w.title}</span>
              <span style="font-family:var(--font-mono); color:var(--accent);">${weekPct}%</span>
            </div>
            <div class="week-body">
              <p style="color:var(--mist); font-size:12px; margin-bottom:0.75rem;">${w.desc}</p>
              <div>
                ${weekTasks.map(wt => `
                  <div class="week-task-line">
                    <span style="color:var(--frost);">${wt.title}</span>
                    <span style="color:${wt.status === 'completed' ? 'var(--emerald)' : 'var(--mist-dim)'}; font-weight:700;">
                      ${wt.status === 'completed' ? 'Done' : wt.status}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (e) {
      container.innerHTML = '<div class="empty-state">Error building blueprint accordion.</div>';
    }
  }

  // Toggle Accordion trigger
  window.toggleAccordion = function (weekNum) {
    const el = document.getElementById(`weekAccordion_${weekNum}`);
    if (el) {
      const isOpen = el.classList.contains('open');
      document.querySelectorAll('.week-accordion-item').forEach(item => item.classList.remove('open'));
      if (!isOpen) {
        el.classList.add('open');
      }
    }
  };

  // Render Analytics Telemetry Chart.js
  function renderAnalyticsChart(tasks) {
    const canvas = document.getElementById('coachProgressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Group tasks stats by status
    const completed = tasks.filter(t => t.status === 'completed').length;
    const skipped = tasks.filter(t => t.status === 'skipped').length;
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'postponed').length;

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending', 'Skipped'],
        datasets: [{
          data: [completed, pending, skipped],
          backgroundColor: [
            'hsl(150, 80%, 40%)',
            'rgba(255,255,255,0.08)',
            'hsl(0, 80%, 50%)'
          ],
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              boxWidth: 12,
              font: { family: 'Inter', size: 11 }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  // Bootstrap On Loading
  loadCoachDashboard();

})();
