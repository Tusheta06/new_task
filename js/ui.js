/**
 * NayePankh VIP - Dynamic UI Rendering Layer
 * Manages DOM generation, animations, toast alerts, and HTML5 Canvas rendering.
 */

window.NayePankhUI = (() => {

  // Toast Notification helper
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Slide out and remove after 3.5s
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3500);
  };

  // Smooth Animate Counter Numbers
  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText.replace(/,/g, '');
      const speed = 200; // lower is faster
      const increment = Math.ceil(target / speed);
      
      const updateCount = () => {
        const current = +counter.innerText.replace(/,/g, '');
        if (current < target) {
          const nextVal = Math.min(current + increment, target);
          counter.innerText = nextVal.toLocaleString('en-IN');
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target.toLocaleString('en-IN');
        }
      };
      
      if (count === 0) {
        updateCount();
      } else {
        counter.innerText = target.toLocaleString('en-IN');
      }
    });
  };

  // Render Campaign Cards
  const renderCampaigns = (campaigns, onDonateClick) => {
    const container = document.getElementById('campaignsContainer');
    if (!container) return;

    container.innerHTML = '';
    campaigns.forEach(c => {
      const progressPercent = Math.min(Math.round((c.raised / c.target) * 100), 100);
      const card = document.createElement('div');
      card.className = 'campaign-card card-glass';
      
      // Inline SVGs for campaign thumbnails so they look polished
      let thumbnailSvg = '';
      if (c.id === 'food') {
        thumbnailSvg = `<svg viewBox="0 0 400 200" style="background:linear-gradient(135deg, #FF9E3D, #FF5C00)">
          <circle cx="200" cy="100" r="70" fill="rgba(255,255,255,0.15)"/>
          <path d="M150 90 L250 90 A50 50 0 0 1 150 90 Z" fill="#fff" opacity="0.9"/>
          <rect x="170" y="82" width="60" height="8" rx="4" fill="#fff" opacity="0.9"/>
          <path d="M165 72 C165 72, 180 50, 200 70 C220 50, 235 72, 235 72" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>`;
      } else if (c.id === 'education') {
        thumbnailSvg = `<svg viewBox="0 0 400 200" style="background:linear-gradient(135deg, #38BDF8, #0284C7)">
          <circle cx="200" cy="100" r="70" fill="rgba(255,255,255,0.15)"/>
          <path d="M200 50 L270 80 L200 110 L130 80 Z" fill="#fff" opacity="0.95"/>
          <path d="M150 90 L150 130 C150 145, 250 145, 250 130 L250 90" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
          <line x1="270" y1="80" x2="270" y2="125" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
          <circle cx="270" cy="125" r="8" fill="#fff"/>
        </svg>`;
      } else if (c.id === 'women') {
        thumbnailSvg = `<svg viewBox="0 0 400 200" style="background:linear-gradient(135deg, #F43F5E, #BE123C)">
          <circle cx="200" cy="100" r="70" fill="rgba(255,255,255,0.15)"/>
          <path d="M200 60 C170 30, 130 50, 130 90 C130 135, 200 170, 200 170 C200 170, 270 135, 270 90 C270 50, 230 30, 200 60 Z" fill="#fff" opacity="0.95"/>
          <circle cx="200" cy="95" r="20" fill="var(--error)"/>
        </svg>`;
      } else { // animal
        thumbnailSvg = `<svg viewBox="0 0 400 200" style="background:linear-gradient(135deg, #34D399, #059669)">
          <circle cx="200" cy="100" r="70" fill="rgba(255,255,255,0.15)"/>
          <path d="M175 125 C175 110, 225 110, 225 125 C225 130, 175 130, 175 125 Z M150 95 C160 95, 165 85, 165 75 C165 65, 145 65, 145 75 C145 85, 140 95, 150 95 Z M250 95 C260 95, 255 85, 255 75 C255 65, 235 65, 235 75 C235 85, 240 95, 250 95 Z" fill="#fff"/>
          <path d="M200 75 C185 75, 185 95, 200 95 C215 95, 215 75, 200 75 Z" fill="#fff"/>
        </svg>`;
      }

      card.innerHTML = `
        <div class="campaign-thumbnail">
          ${thumbnailSvg}
          <span class="campaign-tag">${c.category}</span>
        </div>
        <div class="campaign-content">
          <h4>${c.title}</h4>
          <p class="desc">${c.desc}</p>
          
          <div class="campaign-progress">
            <div class="progress-header">
              <span>Progress</span>
              <span>${progressPercent}%</span>
            </div>
            <div class="progress-bar-outer">
              <div class="progress-bar-inner" style="width: ${progressPercent}%; background: ${c.color}"></div>
            </div>
          </div>

          <div class="campaign-details-row">
            <div class="detail-item">
              <span>Raised</span>
              <strong>₹${c.raised.toLocaleString('en-IN')}</strong>
            </div>
            <div class="detail-item" style="text-align: right;">
              <span>Target</span>
              <strong class="text-muted">₹${c.target.toLocaleString('en-IN')}</strong>
            </div>
          </div>
          
          <button class="btn btn-secondary btn-block" style="margin-top: 20px; background-color: ${c.color}">
            <i class="fa-solid fa-heart-pulse"></i> Support Initiative
          </button>
        </div>
      `;

      card.querySelector('button').addEventListener('click', () => onDonateClick(c.id));
      container.appendChild(card);
    });
  };

  // Render Recent Donors Feed
  const renderDonorFeed = (donors) => {
    const container = document.getElementById('donorFeed');
    if (!container) return;

    container.innerHTML = '';
    donors.forEach(d => {
      const row = document.createElement('div');
      row.className = 'donor-row';
      
      const initials = d.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      row.innerHTML = `
        <div class="donor-badge">${initials}</div>
        <div class="donor-info">
          <h5>${d.name}</h5>
          <p>Supported ${d.campaignId.toUpperCase()} • ${d.time}</p>
        </div>
        <div class="donor-val">₹${d.amount.toLocaleString('en-IN')}</div>
      `;
      container.appendChild(row);
    });
  };

  // Render Leaderboard list
  const renderLeaderboard = (leaderboard) => {
    const container = document.getElementById('leaderboardList');
    if (!container) return;

    container.innerHTML = '';
    const sorted = [...leaderboard].sort((a, b) => b.xp - a.xp);

    sorted.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = `leaderboard-row ${item.isCurrentUser ? 'current-user' : ''}`;
      
      const rank = index + 1;
      let rankClass = '';
      if (rank <= 3) rankClass = `rank-${rank}`;

      row.innerHTML = `
        <div class="rank-badge ${rankClass}">${rank}</div>
        <div class="leaderboard-name">${item.name} <p class="text-muted" style="font-size:0.7rem; font-weight:normal; margin:0">${item.role}</p></div>
        <div class="leaderboard-score">${item.xp} XP</div>
      `;
      container.appendChild(row);
    });
  };

  // Render Weeks Tasks Accordions
  const renderWeeksTasks = (programTasks, completedTaskIds, onCheckboxChange) => {
    const container = document.getElementById('weeksAccordion');
    if (!container) return;

    container.innerHTML = '';
    
    Object.keys(programTasks).forEach((weekKey, index) => {
      const weekData = programTasks[weekKey];
      const item = document.createElement('div');
      item.className = `accordion-item ${index === 0 ? 'active' : ''}`;
      
      const totalTasks = weekData.tasks.length;
      const doneTasks = weekData.tasks.filter(t => completedTaskIds.includes(t.id)).length;
      
      let tasksListHtml = '';
      weekData.tasks.forEach(task => {
        const isChecked = completedTaskIds.includes(task.id);
        tasksListHtml += `
          <label class="task-item-checkbox ${isChecked ? 'completed' : ''}" data-task-id="${task.id}">
            <input type="checkbox" data-task-id="${task.id}" ${isChecked ? 'checked' : ''}>
            <div class="task-text-container">
              <div class="task-title-line">
                <h5>${task.title}</h5>
                <span class="xp-badge">+${task.xp} XP</span>
              </div>
              <p>${task.desc}</p>
            </div>
          </label>
        `;
      });

      item.innerHTML = `
        <button class="accordion-header">
          <div class="accordion-header-left">
            <span class="week-badge">Week ${index + 1}</span>
            <h4>${weekData.title}</h4>
            <span class="text-muted" style="font-size:0.8rem; margin-left: 10px;">(${doneTasks}/${totalTasks} Done)</span>
          </div>
          <i class="fa-solid fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-content">
          <div class="task-list">
            ${tasksListHtml}
          </div>
        </div>
      `;

      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.closest('label')) return;
        
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });

      item.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const taskId = e.target.getAttribute('data-task-id');
          const isChecked = e.target.checked;
          
          const label = e.target.closest('.task-item-checkbox');
          if (isChecked) {
            label.classList.add('completed');
          } else {
            label.classList.remove('completed');
          }

          onCheckboxChange(taskId, isChecked);
        });
      });

      container.appendChild(item);
    });
  };

  // Populate selection options for proof submit form
  const updateProofSelectors = (programTasks, selectedWeek, completedTaskIds) => {
    const taskSelect = document.getElementById('submitTaskSelect');
    if (!taskSelect) return;

    taskSelect.innerHTML = '<option value="" disabled selected>Select task...</option>';
    
    if (!selectedWeek || !programTasks[selectedWeek]) {
      taskSelect.disabled = true;
      return;
    }

    const tasks = programTasks[selectedWeek].tasks;
    tasks.forEach(task => {
      const isCompleted = completedTaskIds.includes(task.id);
      const suffix = isCompleted ? ' (Completed)' : '';
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = `${task.title} (+${task.xp} XP)${suffix}`;
      taskSelect.appendChild(option);
    });

    taskSelect.disabled = false;
  };

  // Render Newspaper Recognition Grid
  const renderNewspaper = (newsList) => {
    const container = document.getElementById('newspaperGrid');
    if (!container) return;

    container.innerHTML = '';
    newsList.forEach(news => {
      const card = document.createElement('div');
      card.className = 'newspaper-card card-glass';
      card.innerHTML = `
        <div class="newspaper-header">
          <h4>${news.title}</h4>
          <span class="news-badge">${news.badge}</span>
        </div>
        <div class="newspaper-body">
          <p>"${news.excerpt}"</p>
          <div class="newspaper-source">
            <span>Press Release</span>
            <strong>${news.date}</strong>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  };

  // Render Legal Certificates Registry
  const renderLegalDocs = (docsList, onViewDocClick) => {
    const container = document.getElementById('legalDocsGrid');
    if (!container) return;

    container.innerHTML = '';
    docsList.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'legal-doc-card card-glass';
      
      let icon = 'fa-file-signature';
      if (doc.id.includes('80g')) icon = 'fa-percent';
      if (doc.id.includes('12a')) icon = 'fa-building-columns';

      card.innerHTML = `
        <div class="legal-doc-header">
          <div class="doc-icon-wrapper">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div>
            <h4>${doc.title}</h4>
            <p>${doc.authority}</p>
          </div>
        </div>
        <div class="legal-doc-body">
          <p>${doc.desc}</p>
        </div>
        <button class="btn btn-secondary doc-action-btn">
          <i class="fa-solid fa-eye"></i> View Credentials
        </button>
      `;

      card.querySelector('button').addEventListener('click', () => {
        onViewDocClick(doc.title, doc.authority, doc.desc);
      });
      container.appendChild(card);
    });
  };

  // Drawing the certificate using HTML5 canvas
  const drawCertificate = (name, role, duration, certId, xpPoints) => {
    const canvas = document.getElementById('certificateCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // 1. Clear Canvas & Fill Background (Soft elegant off-white cream)
    ctx.fillStyle = '#FCFBF9';
    ctx.fillRect(0, 0, w, h);

    // 2. Draw Outer Border & Inner Gold Inset Lines
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#222B38'; // Dark charcoal border
    ctx.strokeRect(7, 7, w - 14, h - 14);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#D9A74A'; // Elegant Gold border
    ctx.strokeRect(22, 22, w - 44, h - 44);

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(28, 28, w - 56, h - 56);

    // 3. Draw Classical Corner Ornaments
    const drawCornerOrnament = (cx, cy, rotation) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = '#D9A74A';
      ctx.lineWidth = 2;

      ctx.beginPath();
      // Floral/wing-like abstract corner paths
      ctx.moveTo(0, 0);
      ctx.lineTo(35, 0);
      ctx.lineTo(35, 5);
      ctx.lineTo(5, 5);
      ctx.lineTo(5, 35);
      ctx.lineTo(0, 35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(15, 15, 8, 0, Math.PI * 0.5);
      ctx.stroke();

      ctx.restore();
    };

    drawCornerOrnament(35, 35, 0);
    drawCornerOrnament(w - 35, 35, Math.PI * 0.5);
    drawCornerOrnament(w - 35, h - 35, Math.PI);
    drawCornerOrnament(35, h - 35, Math.PI * 1.5);

    // 4. Header branding logo drawing
    ctx.save();
    ctx.translate(w / 2, 90);
    
    const wingGrad = ctx.createLinearGradient(-40, 0, 40, 0);
    wingGrad.addColorStop(0, '#FF7A00');
    wingGrad.addColorStop(1, '#00A3FF');
    
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    // Wing left
    ctx.moveTo(-5, 0);
    ctx.bezierCurveTo(-15, -25, -45, -20, -60, -10);
    ctx.bezierCurveTo(-50, 5, -40, 15, -20, 10);
    ctx.bezierCurveTo(-12, 8, -8, 5, -5, 0);
    // Wing right
    ctx.moveTo(5, 0);
    ctx.bezierCurveTo(15, -25, 45, -20, 60, -10);
    ctx.bezierCurveTo(50, 5, 40, 15, 20, 10);
    ctx.bezierCurveTo(12, 8, 8, 5, 5, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 5. Header Typography Text
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 13px "Inter"';
    ctx.fillStyle = '#FF7A00';
    ctx.letterSpacing = '5px';
    ctx.fillText('NAYEPANKH FOUNDATION', w / 2, 145);
    ctx.letterSpacing = '0px';

    ctx.font = 'bold 28px "Plus Jakarta Sans"';
    ctx.fillStyle = '#1E293B';
    ctx.fillText('CERTIFICATE OF APPRECIATION', w / 2, 190);

    ctx.font = 'italic 15px "Georgia"';
    ctx.fillStyle = '#64748B';
    ctx.fillText('This certificate is proudly presented to', w / 2, 235);

    // 6. Awardee Name Display
    ctx.font = 'bold 38px "Plus Jakarta Sans"';
    ctx.fillStyle = '#FF7A00';
    ctx.shadowColor = 'rgba(255, 122, 0, 0.1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(name.toUpperCase(), w / 2, 295);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Divider line
    ctx.strokeStyle = '#D9A74A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 160, 315);
    ctx.lineTo(w / 2 + 160, 315);
    ctx.stroke();

    // Small diamond ornament on divider
    ctx.fillStyle = '#D9A74A';
    ctx.beginPath();
    ctx.moveTo(w / 2, 310);
    ctx.lineTo(w / 2 + 5, 315);
    ctx.lineTo(w / 2, 320);
    ctx.lineTo(w / 2 - 5, 315);
    ctx.closePath();
    ctx.fill();

    // 7. Statement description
    ctx.font = '15px "Inter"';
    ctx.fillStyle = '#334155';
    
    const statement = `for outstanding dedication and active service as a ${role} during the`;
    ctx.fillText(statement, w / 2, 360);

    ctx.font = 'bold 15px "Inter"';
    ctx.fillStyle = '#1E293B';
    ctx.fillText(`NayePankh Social Upliftment Internship Program (${duration})`, w / 2, 395);

    ctx.font = '14px "Inter"';
    ctx.fillStyle = '#64748B';
    
    const performanceText = `During the tenure, they successfully completed community tasks, logging an outstanding performance score of ${xpPoints} XP.`;
    ctx.fillText(performanceText, w / 2, 430);

    ctx.font = 'italic 13px "Georgia"';
    ctx.fillStyle = '#64748B';
    ctx.fillText('"Your efforts have given wings to underprivileged dreams, moving India closer to a brighter future."', w / 2, 470);

    // 8. Signatures & Stamp area
    const baselineY = 600;

    // 8a. Left: Verification ID & Registry numbers
    ctx.textAlign = 'left';
    ctx.font = '600 11px monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`VERIFICATION ID: ${certId}`, 100, baselineY - 20);
    ctx.font = '11px monospace';
    ctx.fillText('SOCIETY REG NO: KAP/04397/2021-2022', 100, baselineY - 5);
    ctx.font = '11px "Inter"';
    ctx.fillText('Verify online at: nayepankh.com/verify', 100, baselineY + 12);

    // 8b. Right: Signature lines
    ctx.textAlign = 'center';
    
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w - 240, baselineY - 30);
    ctx.bezierCurveTo(w - 220, baselineY - 45, w - 210, baselineY - 15, w - 190, baselineY - 35);
    ctx.bezierCurveTo(w - 180, baselineY - 45, w - 170, baselineY - 20, w - 150, baselineY - 30);
    ctx.stroke();

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w - 260, baselineY - 10);
    ctx.lineTo(w - 130, baselineY - 10);
    ctx.stroke();

    ctx.font = 'bold 12px "Inter"';
    ctx.fillStyle = '#1E293B';
    ctx.fillText('PRASHANT SHUKLA', w - 195, baselineY + 8);
    ctx.font = '500 11px "Inter"';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Founder President, NayePankh', w - 195, baselineY + 23);

    // 8c. Center: Official Ribbon Seal
    ctx.save();
    ctx.translate(w / 2, baselineY + 15);
    
    ctx.fillStyle = '#FF5C00';
    ctx.beginPath();
    // Left ribbon
    ctx.moveTo(-15, 0);
    ctx.lineTo(-30, 70);
    ctx.lineTo(-15, 60);
    ctx.lineTo(0, 70);
    ctx.lineTo(-5, 0);
    ctx.fill();

    ctx.beginPath();
    // Right ribbon
    ctx.moveTo(5, 0);
    ctx.lineTo(0, 70);
    ctx.lineTo(15, 60);
    ctx.lineTo(30, 70);
    ctx.lineTo(15, 0);
    ctx.fill();

    // Gold seal base
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    const sealGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 38);
    sealGrad.addColorStop(0, '#FFE899');
    sealGrad.addColorStop(0.8, '#D9A74A');
    sealGrad.addColorStop(1, '#B58226');
    
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // spiked points
    ctx.strokeStyle = '#FFE899';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const angle = (i * Math.PI * 2) / 30;
      const rOuter = 38;
      const rInner = 34;
      const xOuter = Math.cos(angle) * rOuter;
      const yOuter = Math.sin(angle) * rOuter;
      const xInner = Math.cos(angle + 0.1) * rInner;
      const yInner = Math.sin(angle + 0.1) * rInner;
      
      if (i === 0) {
        ctx.moveTo(xOuter, yOuter);
      } else {
        ctx.lineTo(xOuter, yOuter);
      }
      ctx.lineTo(xInner, yInner);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner gold ring
    ctx.strokeStyle = '#B58226';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 29, 0, Math.PI * 2);
    ctx.stroke();

    // Center emblem
    ctx.fillStyle = '#B58226';
    ctx.font = 'bold 9px "Inter"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SEAL OF', 0, -8);
    ctx.font = 'bold 8px "Inter"';
    ctx.fillText('IMPACT', 0, 4);
    ctx.font = '600 7px "Inter"';
    ctx.fillText('NGO REG', 0, 14);

    ctx.restore();
  };

  return {
    showToast,
    animateCounters,
    renderCampaigns,
    renderDonorFeed,
    renderLeaderboard,
    renderWeeksTasks,
    updateProofSelectors,
    renderNewspaper,
    renderLegalDocs,
    drawCertificate
  };
})();
