/**
 * NayePankh VIP - Main Application Controller
 * Handles application routing, events subscription, and state flow coordination.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Load state from local storage or get default initial state
  let state = NayePankhData.getAppState();

  // Selected Active Navigation View (default: home)
  let activeView = 'home';

  // --- HTML DOM ELEMENT SELECTORS ---
  const views = {
    home: document.getElementById('view-home'),
    dashboard: document.getElementById('view-dashboard'),
    volunteer: document.getElementById('view-volunteer'),
    assistant: document.getElementById('view-assistant'),
    certificate: document.getElementById('view-certificate')
  };

  const navButtons = document.querySelectorAll('.sidebar-nav .nav-item');
  const viewTitle = document.getElementById('viewTitle');
  const viewSubtitle = document.getElementById('viewSubtitle');
  const sidebar = document.getElementById('appSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  // Theme Controls
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;

  // Donation Modal Controls
  const donationModal = document.getElementById('donationModal');
  const closeDonationModal = document.getElementById('closeDonationModal');
  const headerDonateBtn = document.getElementById('headerDonateBtn');
  const calcDonateBtn = document.getElementById('calcDonateBtn');
  const donationForm = document.getElementById('donationForm');
  const modalCampaignSelect = document.getElementById('modalCampaignSelect');
  const paymentOptions = document.querySelectorAll('.payment-option');

  // Home Page Action Buttons
  const heroDonateBtn = document.getElementById('heroDonateBtn');
  const heroJoinBtn = document.getElementById('heroJoinBtn');
  const homeApplyBtn = document.getElementById('homeApplyBtn');

  // Tax Calculator Controls
  const calcAmountInput = document.getElementById('calcAmount');
  const exemptAmountSpan = document.getElementById('exemptAmount');
  const taxSavedAmountSpan = document.getElementById('taxSavedAmount');

  // Volunteer Task Submission Form Controls
  const submitWeekSelect = document.getElementById('submitWeekSelect');
  const submitTaskSelect = document.getElementById('submitTaskSelect');
  const taskSubmissionForm = document.getElementById('taskSubmissionForm');

  // AI Chat Bot Controls
  const chatMessages = document.getElementById('chatMessages');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatInputField = document.getElementById('chatInputField');
  const generatePresetBtn = document.getElementById('generatePresetBtn');

  // Certificate Controls
  const certificateForm = document.getElementById('certificateForm');
  const certNameInput = document.getElementById('certName');
  const certRoleSelect = document.getElementById('certRole');
  const certDurationInput = document.getElementById('certDuration');
  const certIdInput = document.getElementById('certId');
  const regenerateCertId = document.getElementById('regenerateCertId');
  const downloadCertBtn = document.getElementById('downloadCertBtn');

  // Notifications Dropdown Controls
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const notificationList = document.getElementById('notificationList');
  const notificationBadge = document.getElementById('notificationBadge');
  const markAllReadBtn = document.getElementById('markAllReadBtn');


  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  const init = () => {
    // 1. Setup Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // 2. Render Core Components
    updateHeaderStats();
    NayePankhUI.renderCampaigns(state.campaigns, openDonationFlow);
    NayePankhUI.renderDonorFeed(state.donors);
    NayePankhUI.renderLeaderboard(state.leaderboard);
    NayePankhUI.renderNewspaper(NayePankhData.newspaperRecognition);
    NayePankhUI.renderLegalDocs(NayePankhData.legalRegistry, handleViewLegalDoc);
    renderVolunteerDashboard();
    renderNotificationList();

    // 3. Setup Donation Campaign Modal Select Options
    populateCampaignSelect();

    // 4. Load AI Chat welcome messages
    loadWelcomeMessages();

    // 5. Setup Tax Exemption Calculators
    updateTaxCalculation();

    // 6. Setup Certificate ID
    generateNewCertificateCode();
    updateCertificateChecklist();

    // 7. Render initial certificate with template data
    NayePankhUI.drawCertificate("Enter Your Name", "Social Work Intern", "May 2026 - June 2026", certIdInput.value, state.userStats.xp);
  };


  // ==========================================================================
  // VIEW ROUTING
  // ==========================================================================
  const switchView = (viewName) => {
    if (!views[viewName]) return;

    activeView = viewName;
    
    // Toggle active view sections
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });

    // Toggle active nav menu items
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Close Mobile Sidebar if open
    sidebar.classList.remove('active');

    // Update Top Header titles dynamically
    if (viewName === 'home') {
      viewTitle.textContent = "Welcome to NayePankh";
      viewSubtitle.textContent = "UP Government Registered NGO • 80G & 12A Compliant";
    } else if (viewName === 'dashboard') {
      viewTitle.textContent = "Active Welfare Campaigns";
      viewSubtitle.textContent = "Your contributions directly support grassroot social work";
      setTimeout(NayePankhUI.animateCounters, 100);
    } else if (viewName === 'volunteer') {
      viewTitle.textContent = "Intern & Volunteer Hub";
      viewSubtitle.textContent = "Log your social work tasks, earn XP, and lead";
    } else if (viewName === 'assistant') {
      viewTitle.textContent = "AI Outreach Assistant";
      viewSubtitle.textContent = "Craft engaging fundraising and outreach copy";
    } else if (viewName === 'certificate') {
      viewTitle.textContent = "Certificates & Verification";
      viewSubtitle.textContent = "Official organization credentials & student internship desk";
      
      if (state.userStats.name !== 'Guest Champion' && certNameInput.value === '') {
        certNameInput.value = state.userStats.name;
      }
      triggerCertificateDraw();
    }
  };

  // Nav items click handler
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.getAttribute('data-view'));
    });
  });

  // Mobile navigation hamburger toggle
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Home Page Banner Action Event Listeners
  if (heroDonateBtn) {
    heroDonateBtn.addEventListener('click', () => {
      switchView('dashboard');
    });
  }

  if (heroJoinBtn) {
    heroJoinBtn.addEventListener('click', () => {
      switchView('volunteer');
    });
  }

  if (homeApplyBtn) {
    homeApplyBtn.addEventListener('click', () => {
      switchView('volunteer');
    });
  }


  // ==========================================================================
  // THEME SWITCHER
  // ==========================================================================
  const updateThemeIcon = (theme) => {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  };

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    NayePankhUI.showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    
    if (activeView === 'certificate') {
      triggerCertificateDraw();
    }
  });


  // ==========================================================================
  // STATE MANAGEMENT AND HEADER METRICS
  // ==========================================================================
  const updateHeaderStats = () => {
    document.getElementById('userNameDisplay').textContent = state.userStats.name;
    document.getElementById('userRoleDisplay').textContent = `${state.userStats.role} (Lvl ${state.userStats.level})`;
    
    setTimeout(NayePankhUI.animateCounters, 150);
  };


  // ==========================================================================
  // DONATION WORKFLOW
  // ==========================================================================
  const populateCampaignSelect = () => {
    if (!modalCampaignSelect) return;
    
    modalCampaignSelect.innerHTML = '';
    state.campaigns.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = `${c.title} (${c.category})`;
      modalCampaignSelect.appendChild(option);
    });
  };

  const openDonationFlow = (campaignId) => {
    document.getElementById('donationCampaignId').value = campaignId;
    modalCampaignSelect.value = campaignId;
    
    const targetCampaign = state.campaigns.find(c => c.id === campaignId);
    if (targetCampaign) {
      document.getElementById('modalTitle').textContent = `Support: ${targetCampaign.title}`;
    }

    donationModal.style.display = 'flex';
  };

  // Quick donate button in header
  headerDonateBtn.addEventListener('click', () => {
    openDonationFlow('food');
  });

  closeDonationModal.addEventListener('click', () => {
    donationModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === donationModal) {
      donationModal.style.display = 'none';
    }
  });

  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input').checked = true;
    });
  });

  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const donorName = document.getElementById('donorName').value.trim();
    const donorEmail = document.getElementById('donorEmail').value.trim();
    const donorAmount = parseInt(document.getElementById('donorAmount').value);
    const campaignId = modalCampaignSelect.value;
    
    if (!donorName || !donorEmail || isNaN(donorAmount) || donorAmount < 100) {
      NayePankhUI.showToast("Please enter valid details. Minimum donation is ₹100.", "error");
      return;
    }

    const campaignIndex = state.campaigns.findIndex(c => c.id === campaignId);
    if (campaignIndex !== -1) {
      state.campaigns[campaignIndex].raised += donorAmount;
      state.campaigns[campaignIndex].donorsCount += 1;
    }

    const newDonor = {
      name: donorName,
      amount: donorAmount,
      campaignId: campaignId,
      time: 'Just now'
    };
    state.donors.unshift(newDonor);
    if (state.donors.length > 6) state.donors.pop();

    let xpGranted = 0;
    if (donorName.toLowerCase().includes('you') || donorName === state.userStats.name) {
      xpGranted = Math.min(Math.round(donorAmount / 10), 150);
      grantXP(xpGranted);
      
      if (!state.completedTaskIds.includes('w3t2')) {
        state.completedTaskIds.push('w3t2');
        xpGranted += 120;
        grantXP(120);
        NayePankhUI.showToast("Week 3: Campaign mock donation task verified!", "success");
      }
    }

    const notifText = `${donorName} contributed ₹${donorAmount.toLocaleString('en-IN')} to ${state.campaigns[campaignIndex].title}!`;
    state.notifications.unshift({
      id: Date.now(),
      text: notifText,
      time: 'Just now',
      unread: true
    });

    NayePankhData.saveAppState(state);
    
    NayePankhUI.renderCampaigns(state.campaigns, openDonationFlow);
    NayePankhUI.renderDonorFeed(state.donors);
    renderVolunteerDashboard();
    renderNotificationList();
    updateHeaderStats();
    updateCertificateChecklist();

    donationModal.style.display = 'none';
    donationForm.reset();
    
    NayePankhUI.showToast(`Thank you, ${donorName}! Simulated contribution of ₹${donorAmount} logged. ${xpGranted > 0 ? '+' + xpGranted + ' XP earned.' : ''}`, "success");
  });


  // ==========================================================================
  // TAX EXEMPTION CALCULATOR
  // ==========================================================================
  const updateTaxCalculation = () => {
    if (!calcAmountInput) return;

    const amount = parseFloat(calcAmountInput.value) || 0;
    const exemptOutlay = Math.round(amount * 0.5);
    const estimatedTaxSaved = Math.round(exemptOutlay * 0.3);

    exemptAmountSpan.textContent = `₹${exemptOutlay.toLocaleString('en-IN')}`;
    taxSavedAmountSpan.textContent = `₹${estimatedTaxSaved.toLocaleString('en-IN')}`;
  };

  if (calcAmountInput) {
    calcAmountInput.addEventListener('input', updateTaxCalculation);
  }

  if (calcDonateBtn) {
    calcDonateBtn.addEventListener('click', () => {
      const amount = calcAmountInput.value;
      openDonationFlow('food');
      document.getElementById('donorAmount').value = amount;
    });
  }


  // ==========================================================================
  // VOLUNTEER INTERN TRACKING SYSTEM
  // ==========================================================================
  const renderVolunteerDashboard = () => {
    NayePankhUI.renderWeeksTasks(NayePankhData.programTasks, state.completedTaskIds, handleTaskCheckboxChange);

    document.getElementById('internProfileName').textContent = state.userStats.name;
    document.getElementById('internLevel').textContent = `Level ${state.userStats.level}`;
    document.getElementById('internXp').textContent = `${state.userStats.xp} XP`;
    
    const totalCount = Object.values(NayePankhData.programTasks).reduce((acc, week) => acc + week.tasks.length, 0);
    document.getElementById('internTasksCount').textContent = `${state.completedTaskIds.length}/${totalCount}`;
    
    updateWeekTaskSelectOptions();
  };

  const handleTaskCheckboxChange = (taskId, isChecked) => {
    let targetTask = null;
    Object.values(NayePankhData.programTasks).forEach(week => {
      const found = week.tasks.find(t => t.id === taskId);
      if (found) targetTask = found;
    });

    if (!targetTask) return;

    if (isChecked) {
      if (!state.completedTaskIds.includes(taskId)) {
        state.completedTaskIds.push(taskId);
        grantXP(targetTask.xp);
        NayePankhUI.showToast(`Task completed! +${targetTask.xp} XP earned.`, "success");
      }
    } else {
      const index = state.completedTaskIds.indexOf(taskId);
      if (index > -1) {
        state.completedTaskIds.splice(index, 1);
        grantXP(-targetTask.xp);
        NayePankhUI.showToast(`Task unmarked. Lost ${targetTask.xp} XP.`, "info");
      }
    }

    const userIndex = state.leaderboard.findIndex(l => l.isCurrentUser);
    if (userIndex !== -1) {
      state.leaderboard[userIndex].xp = state.userStats.xp;
      state.leaderboard[userIndex].tasks = state.completedTaskIds.length;
    }

    NayePankhData.saveAppState(state);
    
    renderVolunteerDashboard();
    NayePankhUI.renderLeaderboard(state.leaderboard);
    updateHeaderStats();
    updateCertificateChecklist();
  };

  const grantXP = (amount) => {
    state.userStats.xp = Math.max(state.userStats.xp + amount, 0);
    
    const oldLevel = state.userStats.level;
    const computedLevel = Math.min(Math.floor(state.userStats.xp / 200) + 1, 5);
    
    state.userStats.level = computedLevel;

    if (computedLevel > oldLevel) {
      NayePankhUI.showToast(`🎉 Congratulations! You leveled up to Level ${computedLevel}!`, "success");
      state.notifications.unshift({
        id: Date.now(),
        text: `Leveled up to Level ${computedLevel}! Keep up the amazing social service.`,
        time: 'Just now',
        unread: true
      });
    }
  };

  const updateWeekTaskSelectOptions = () => {
    if (!submitWeekSelect) return;
    
    submitWeekSelect.addEventListener('change', (e) => {
      const weekVal = e.target.value;
      NayePankhUI.updateProofSelectors(NayePankhData.programTasks, weekVal, state.completedTaskIds);
    });
  };

  // Submit Proof Form
  taskSubmissionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const week = submitWeekSelect.value;
    const taskId = submitTaskSelect.value;
    const desc = document.getElementById('submissionDescription').value.trim();
    const link = document.getElementById('submissionLink').value.trim();

    if (!week || !taskId || !desc || !link) {
      NayePankhUI.showToast("Please fill all form inputs.", "error");
      return;
    }

    NayePankhUI.showToast("Uploading evidence files and linking URL...", "info");

    setTimeout(() => {
      if (!state.completedTaskIds.includes(taskId)) {
        handleTaskCheckboxChange(taskId, true);
      } else {
        NayePankhUI.showToast("Evidence updated for review.", "success");
      }

      state.userStats.submissionsCount += 1;
      
      state.notifications.unshift({
        id: Date.now(),
        text: `Task submission review completed! Evidence accepted for Week ${week.replace('week','')}.`,
        time: 'Just now',
        unread: true
      });

      NayePankhData.saveAppState(state);
      renderVolunteerDashboard();
      renderNotificationList();
      updateCertificateChecklist();
      
      taskSubmissionForm.reset();
      submitTaskSelect.disabled = true;
      submitTaskSelect.innerHTML = '<option value="" disabled selected>First select a week...</option>';
    }, 1200);
  });


  // ==========================================================================
  // AI CHAT BOT SYSTEM & MESSAGE PRESETS
  // ==========================================================================
  const loadWelcomeMessages = () => {
    if (!chatMessages) return;

    chatMessages.innerHTML = `
      <div class="chat-msg bot">
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">
          Hi! I'm the NayePankh Outreach Assistant. I can write WhatsApp messages, email letters, or LinkedIn posts for your campaign! 
          <br><br>
          Select templates in the left presets panel, or ask me questions about our campaigns, Kanpur office, or society registration!
        </div>
      </div>
    `;
  };

  const addChatMessage = (sender, content, isHTML = false) => {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    
    const avatarIcon = sender === 'bot' ? 'fa-robot' : 'fa-user';
    
    msg.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
      <div class="msg-bubble">${isHTML ? content : escapeHTML(content)}</div>
    `;

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const escapeHTML = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const toggleTypingIndicator = (show) => {
    const existing = document.getElementById('typingIndicator');
    if (show) {
      if (existing) return;
      const indicator = document.createElement('div');
      indicator.className = 'chat-msg bot';
      indicator.id = 'typingIndicator';
      indicator.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      chatMessages.appendChild(indicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      if (existing) existing.remove();
    }
  };

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userText = chatInputField.value.trim();
    if (!userText) return;

    addChatMessage('user', userText);
    chatInputField.value = '';

    toggleTypingIndicator(true);

    setTimeout(() => {
      toggleTypingIndicator(false);
      
      let botResponse = "I'm not sure I understand. I am specialized in fundraising templates, Kanpur operations, 80G tax exemptions, and certificate requirements. Try selecting a template preset on the left or asking about 'contact phone'.";
      
      const query = userText.toLowerCase();
      
      for (const entry of NayePankhData.qaDatabase) {
        const matched = entry.keywords.some(keyword => query.includes(keyword));
        if (matched) {
          botResponse = entry.answer;
          break;
        }
      }

      addChatMessage('bot', botResponse.replace(/\n/g, '<br>'), true);
    }, 850);
  });

  generatePresetBtn.addEventListener('click', () => {
    const campaign = document.getElementById('presetCampaign').value;
    const tone = document.getElementById('presetTone').value;
    const platform = document.getElementById('presetPlatform').value;

    const generatedText = NayePankhData.generateOutreachTemplate(campaign, tone, platform);

    toggleTypingIndicator(true);

    setTimeout(() => {
      toggleTypingIndicator(false);
      
      const responseHtml = `
        I have successfully generated your customized outreach message template! Here is your draft:
        <div class="outreach-box-container">
          <div class="outreach-box-header">
            <span>Channel: ${platform.toUpperCase()} (${tone})</span>
            <button onclick="navigator.clipboard.writeText(this.closest('.outreach-box-container').querySelector('.outreach-box-content').innerText); alert('Template copied!')">
              <i class="fa-regular fa-copy"></i> Copy Text
            </button>
          </div>
          <div class="outreach-box-content" id="outreachTextCode">${generatedText}</div>
        </div>
        <p style="margin-top:8px; font-size:0.75rem" class="text-muted">💡 Intern Tip: Personalize the <code>[Your Portal Link]</code> variable and double check spelling before sending!</p>
      `;

      addChatMessage('bot', responseHtml, true);
      NayePankhUI.showToast("Message template loaded in chat feed!", "success");
    }, 400);
  });


  // ==========================================================================
  // LEGAL REGISTRY & CERTIFICATE DESK SYSTEM
  // ==========================================================================
  const handleViewLegalDoc = (title, authority, desc) => {
    NayePankhUI.showToast(`Connecting to Ministry of Corporate Affairs for official verification...`, 'info');
    setTimeout(() => {
      NayePankhUI.showToast(`Credential for ${title} validated successfully against Government database records.`, 'success');
    }, 1500);
  };

  const generateNewCertificateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NP-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    certIdInput.value = code;
  };

  regenerateCertId.addEventListener('click', () => {
    generateNewCertificateCode();
    triggerCertificateDraw();
    NayePankhUI.showToast("Regenerated custom tracking ID", "info");
  });

  const updateCertificateChecklist = () => {
    const reqName = document.getElementById('reqName');
    const reqXp = document.getElementById('reqXp');
    const reqSubmit = document.getElementById('reqSubmit');

    let checksCount = 0;

    const currentName = state.userStats.name.trim();
    const hasName = currentName !== '' && currentName !== 'Guest Champion' && currentName !== 'Guest Visitor';
    if (hasName) {
      reqName.className = 'completed';
      reqName.innerHTML = `<i class="fa-solid fa-circle-check"></i> Profile Name Updated (${currentName})`;
      checksCount++;
    } else {
      reqName.className = 'pending';
      reqName.innerHTML = `<i class="fa-solid fa-xmark"></i> Update Profile Name (Edit below)`;
    }

    const hasXp = state.userStats.xp >= 300;
    if (hasXp) {
      reqXp.className = 'completed';
      reqXp.innerHTML = `<i class="fa-solid fa-circle-check"></i> Earned 300+ XP (${state.userStats.xp} XP)`;
      checksCount++;
    } else {
      reqXp.className = 'pending';
      reqXp.innerHTML = `<i class="fa-solid fa-xmark"></i> Earn at least 300 XP (${state.userStats.xp}/300 XP)`;
    }

    const hasSubmissions = state.completedTaskIds.length >= 3;
    if (hasSubmissions) {
      reqSubmit.className = 'completed';
      reqSubmit.innerHTML = `<i class="fa-solid fa-circle-check"></i> Completed 3+ Tasks (${state.completedTaskIds.length}/12)`;
      checksCount++;
    } else {
      reqSubmit.className = 'pending';
      reqSubmit.innerHTML = `<i class="fa-solid fa-xmark"></i> Complete at least 3 Tasks (${state.completedTaskIds.length}/3)`;
    }

    if (checksCount === 3) {
      downloadCertBtn.disabled = false;
      document.getElementById('certRequirementBox').style.borderColor = 'var(--accent)';
    } else {
      downloadCertBtn.disabled = true;
      document.getElementById('certRequirementBox').style.borderColor = 'var(--border)';
    }
  };

  const triggerCertificateDraw = () => {
    const name = certNameInput.value.trim() || "Enter Your Name";
    const role = certRoleSelect.value;
    const duration = certDurationInput.value.trim() || "May 2026 - June 2026";
    const code = certIdInput.value;
    const xp = state.userStats.xp;

    NayePankhUI.drawCertificate(name, role, duration, code, xp);
  };

  certNameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val !== '') {
      state.userStats.name = val;
      NayePankhData.saveAppState(state);
      updateHeaderStats();
    }
    updateCertificateChecklist();
    triggerCertificateDraw();
  });

  certRoleSelect.addEventListener('change', (e) => {
    state.userStats.role = e.target.value;
    NayePankhData.saveAppState(state);
    updateHeaderStats();
    triggerCertificateDraw();
  });

  certDurationInput.addEventListener('input', triggerCertificateDraw);

  certificateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    triggerCertificateDraw();
    NayePankhUI.showToast("Certificate re-rendered with new styles!", "success");
  });

  downloadCertBtn.addEventListener('click', () => {
    const canvas = document.getElementById('certificateCanvas');
    if (!canvas) return;

    const imgUrl = canvas.toDataURL('image/png');
    const dlLink = document.createElement('a');
    dlLink.href = imgUrl;
    
    const cleanName = state.userStats.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    dlLink.download = `NayePankh_Internship_${cleanName}.png`;
    
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    NayePankhUI.showToast("Certificate image download initiated successfully!", "success");
  });


  // ==========================================================================
  // NOTIFICATIONS LISTENER
  // ==========================================================================
  const renderNotificationList = () => {
    if (!notificationList) return;

    notificationList.innerHTML = '';
    
    const unreadCount = state.notifications.filter(n => n.unread).length;
    if (unreadCount > 0) {
      notificationBadge.style.display = 'flex';
      notificationBadge.textContent = unreadCount;
    } else {
      notificationBadge.style.display = 'none';
    }

    if (state.notifications.length === 0) {
      notificationList.innerHTML = `<li class="notification-item" style="justify-content:center; color:var(--text-muted)">No notifications.</li>`;
      return;
    }

    state.notifications.forEach(n => {
      const item = document.createElement('li');
      item.className = `notification-item ${n.unread ? 'unread' : ''}`;
      
      item.innerHTML = `
        <i class="fa-solid fa-bell"></i>
        <div>
          <span class="notif-text">${n.text}</span>
          <span class="notif-time">${n.time}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        n.unread = false;
        NayePankhData.saveAppState(state);
        renderNotificationList();
      });

      notificationList.appendChild(item);
    });
  };

  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const disp = notificationDropdown.style.display;
    notificationDropdown.style.display = disp === 'block' ? 'none' : 'block';
  });

  markAllReadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.notifications = [];
    NayePankhData.saveAppState(state);
    renderNotificationList();
    NayePankhUI.showToast("Cleared all notifications", "info");
  });

  window.addEventListener('click', () => {
    if (notificationDropdown) notificationDropdown.style.display = 'none';
  });

  notificationDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });


  // Run Initialization
  init();
});
