/**
 * NayePankh VIP - Application Data Layer
 * Handles initial state, local mock data, and template generation engines.
 */

window.NayePankhData = (() => {
  
  // Initial Campaigns Data
  const initialCampaigns = [
    {
      id: 'food',
      title: 'Feed the Needy Drive',
      category: 'Nutrition & Hunger',
      desc: 'Providing freshly cooked, nutritious meals to daily wage laborers, street dwellers, and families in extreme distress.',
      raised: 78500,
      target: 100000,
      donorsCount: 157,
      color: 'var(--primary)'
    },
    {
      id: 'education',
      title: 'Educate the Future',
      category: 'Child Education',
      desc: 'Sponsoring school supplies, stationery kits, and running street teaching camps for children in underprivileged slums.',
      raised: 62400,
      target: 90000,
      donorsCount: 104,
      color: 'var(--secondary)'
    },
    {
      id: 'women',
      title: 'Women Hygiene & Skilling',
      category: 'Women Empowerment',
      desc: 'Distributing biodegradable sanitary napkins and supporting sewing training centers to enable self-employment.',
      raised: 42000,
      target: 60000,
      donorsCount: 84,
      color: 'var(--error)'
    },
    {
      id: 'animal',
      title: 'Stray Animal Rescue',
      category: 'Animal Welfare',
      desc: 'Conducting veterinary camps, feeding stray dogs/cats, and running a critical care recovery program for injured animals.',
      raised: 24500,
      target: 40000,
      donorsCount: 49,
      color: 'var(--accent)'
    }
  ];

  // Initial Donor History Activity
  const initialDonors = [
    { name: 'Aditya Sharma', amount: 2500, campaignId: 'food', time: '5 mins ago' },
    { name: 'Priya Patel', amount: 5000, campaignId: 'education', time: '20 mins ago' },
    { name: 'Rohan Mehta', amount: 1500, campaignId: 'animal', time: '1 hr ago' },
    { name: 'Ananya Verma', amount: 10000, campaignId: 'women', time: '3 hrs ago' },
    { name: 'Siddharth Sen', amount: 3000, campaignId: 'food', time: '5 hrs ago' }
  ];

  // Intern Leaderboard Mock Data
  const initialLeaderboard = [
    { name: 'Kunal Kapoor', xp: 950, tasks: 11, role: 'Social Work Intern', isCurrentUser: false },
    { name: 'Simran Gill', xp: 820, tasks: 9, role: 'Fundraising Intern', isCurrentUser: false },
    { name: 'Aarav Singhal', xp: 740, tasks: 8, role: 'Web Dev Intern', isCurrentUser: false },
    { name: 'Tanvi Joshi', xp: 620, tasks: 7, role: 'Social Work Intern', isCurrentUser: false },
    { name: 'You (Guest Champion)', xp: 120, tasks: 1, role: 'Social Work Intern', isCurrentUser: true },
    { name: 'Varun Nair', xp: 90, tasks: 1, role: 'Fundraising Intern', isCurrentUser: false }
  ];

  // Program Tasks Data for the 4 Weeks
  const programTasks = {
    week1: {
      title: 'Week 1: Foundations & Social Reach',
      tasks: [
        { id: 'w1t1', title: 'Complete Induction Web Seminar', xp: 30, desc: 'Attend the online onboarding call to understand NayePankh mission.' },
        { id: 'w1t2', title: 'Share NayePankh Impact Poster on WhatsApp', xp: 40, desc: 'Post the primary awareness flyer on your WhatsApp status for 24 hours (submit screenshot).' },
        { id: 'w1t3', title: 'Invite 5 Friends to Awareness Page', xp: 50, desc: 'Spread awareness of the NGO by sharing our portal link with 5 close peers.' }
      ]
    },
    week2: {
      title: 'Week 2: Community Volunteering',
      tasks: [
        { id: 'w2t1', title: 'Feed 3 Stray Animals in Your Locality', xp: 80, desc: 'Feed local stray dogs/cats with water, milk, or biscuits and take a photo.' },
        { id: 'w2t2', title: 'Conduct 1-Hour Teaching Session', xp: 100, desc: 'Spend one hour teaching basic reading/math to an underprivileged child (e.g. househelp children).' },
        { id: 'w2t3', title: 'Distribute 3 Hygiene Kits or Sanitary Pads', xp: 100, desc: 'Sponsor and hand over hygiene supplies or sanitary napkins to women in rural or slum areas.' }
      ]
    },
    week3: {
      title: 'Week 3: Campaign & Outreach Drive',
      tasks: [
        { id: 'w3t1', title: 'Send 5 Personalized Outreach Pitch Letters', xp: 80, desc: 'Draft and dispatch outreach letters to corporate or high-net-worth friends (use AI Bot presets).' },
        { id: 'w3t2', title: 'Secure 1 Small Mock Donation Support', xp: 120, desc: 'Mobilize your network and simulate getting a donation (or complete a mock donation yourself).' },
        { id: 'w3t3', title: 'Post Impact Progress on LinkedIn/Insta', xp: 60, desc: 'Draft a summary post describing your social work internship experience so far and tag NayePankh.' }
      ]
    },
    week4: {
      title: 'Week 4: Final Impact Evaluation',
      tasks: [
        { id: 'w4t1', title: 'Submit Detailed Weekly Activity Report', xp: 100, desc: 'Compile a PDF report summarizing all your efforts, hours logged, and photos from Weeks 1-3.' },
        { id: 'w4t2', title: 'Fill out Program Feedback Form', xp: 50, desc: 'Help us improve the internship program by answering a short 5-question review.' },
        { id: 'w4t3', title: 'Claim & Verify Completion Certificate', xp: 100, desc: 'Ensure all checklists are marked. Generate your high-res certificate at the Certificate Desk.' }
      ]
    }
  };

  // Preset chatbot responses based on keywords
  const qaDatabase = [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings'],
      answer: "Hello! I am your NayePankh Outreach Advisor. How can I help you today? You can select a template from the **Presets panel** to generate messages, or ask me questions about fundraising tips, social work, or our active campaigns."
    },
    {
      keywords: ['fundraise', 'fundraising tips', 'outreach', 'raise money', 'how to raise'],
      answer: "Here are **3 core fundraising tips** for your NayePankh campaign:\n\n1. **Start with 'Why'**: Explain why this cause matters to *you* personally. People donate to people, not just organizations.\n2. **Use Clear Visuals**: Share photo/video updates of food distribution or teaching camps. Real impact drives contributions.\n3. **Follow Up Warmly**: Send direct, personal text messages rather than mass broadcast emails. Don't be afraid to politely follow up after 3 days."
    },
    {
      keywords: ['nayepankh', 'what is nayepankh', 'ngo info', 'about foundation'],
      answer: "NayePankh Foundation is a registered Section 8 NGO based in Uttar Pradesh, India (80G & 12A compliant). Our motto is **'Badalte Bharat Ki Nayi Tasveer'**. We work in core sectors: feeding the hungry, underprivileged child education, women sanitation pads distribution, and stray animal care."
    },
    {
      keywords: ['tax exemption', '80g', 'tax benefit', 'receipt'],
      answer: "Yes! All contributions to NayePankh Foundation are eligible for tax exemption under **Section 80G** of the Income Tax Act. Donors receive a receipt and an 80G certificate that saves them up to 50% of their taxable outflow."
    },
    {
      keywords: ['certificate', 'how to get certificate', 'internship completion'],
      answer: "To generate your internship certificate, click on the **Certificate Desk** tab in the sidebar. You need to: 1) Update your full name, 2) Complete tasks to earn at least 300 XP, and 3) Submit at least 3 tasks through the proof form."
    }
  ];

  // Outreach Template Generator
  const generateOutreachTemplate = (campaign, tone, platform) => {
    let baseText = "";
    
    const campaignsMeta = {
      food: {
        theme: "providing dry rations and fresh meals to starving daily-wage families",
        metric: "₹50 is all it takes to sponsor a hearty warm meal for a needy child"
      },
      education: {
        theme: "providing school supplies and street teaching camps to slum kids",
        metric: "₹500 sponsors a comprehensive education-start kit (school bag, books, stationery) for a child"
      },
      women: {
        theme: "empowering women with menstrual hygiene kits and vocational tailoring classes",
        metric: "₹250 sponsors a women's hygiene pack and self-awareness workshop"
      },
      animal: {
        theme: "rescuing, vaccinating, and feeding injured street dogs and cats",
        metric: "₹300 covers basic veterinary medicine and feeding for a stray animal for a week"
      }
    };

    const c = campaignsMeta[campaign] || campaignsMeta.food;

    if (platform === 'whatsapp') {
      if (tone === 'inspiring') {
        baseText = `🌟 *Be the Change!* 🌟\n\nHey! I am volunteering with NayePankh Foundation for their initiative: *${c.theme}*.\n\nDid you know? ${c.metric}. Even a small contribution can bring a massive smile. Let's give wings to those who need it most.\n\n👉 Donate here: *[Your Portal Link]*\n\n(All donations are 50% Tax Exempt under Section 80G) 🙏`;
      } else if (tone === 'urgent') {
        baseText = `🚨 *URGENT SUPPORT NEEDED* 🚨\n\nHey friends! I need your urgent support. NayePankh Foundation is organizing a direct-action drive this weekend for *${c.theme}*.\n\nOur target is to help 200 lives. ${c.metric}. Please join hands. Every rupee counts!\n\n🔗 Donate directly: *[Your Portal Link]*\n\nThank you for your kindness! ❤️`;
      } else if (tone === 'professional') {
        baseText = `Dear colleague, I am coordinating a community support initiative with NayePankh Foundation, focusing on *${c.theme}*.\n\nYour contribution of just ${c.metric.replace('is all it takes to ', '')} makes a direct difference. If you would like to support, please use our secure checkout link:\n\n🔗 *[Your Portal Link]*\n\n80G tax receipt will be issued immediately.`;
      } else {
        baseText = `Hey! Just wanted to share something close to my heart. I'm helping NayePankh raise funds for *${c.theme}*. It's amazing how a small gesture like ${c.metric} can feed/educate someone. Check it out and support if you can! 😊\n\n👉 Link: *[Your Portal Link]*`;
      }
    } else if (platform === 'linkedin') {
      baseText = `Hello network,\n\nI am pleased to share that I have joined NayePankh Foundation as a Student Coordinator. We are currently mobilizing resources to support a critical campaign: *${c.theme.toUpperCase()}*.\n\nOur objective is to bridge gaps and build sustainable relief. Did you know that ${c.metric}? \n\nI invite my professional circle to support this cause. Your contribution is eligible for 50% tax exemption under Section 80G.\n\n👉 Secure Donation Link: [Your Portal Link]\n\n#SocialImpact #CSR #NayePankh #Volunteering #CommunityDevelopment`;
    } else if (platform === 'instagram') {
      baseText = `✨ Small Acts, Big Impact ✨\n\nI’m proud to support NayePankh Foundation in their mission of *${c.theme}*. 🧡\n\nLet’s make a real difference. Did you know? ${c.metric}. Swiping a cup of coffee can sponsor a child's future or feed a family! 🤝\n\n🔗 Link is in my BIO to donate! Let’s give wings to hope.\n\n#NayePankh #GiveBack #NonProfit #SocialService #CommunityCare #MakeADifference`;
    } else { // email
      baseText = `Subject: Sponsoring Hope: Support NayePankh Foundation's ${c.theme.split(' ')[0]} Initiative\n\nDear Friends and Family,\n\nI hope this email finds you well.\n\nAs part of my commitment to social welfare, I am currently interning with NayePankh Foundation (a registered Section 8 NGO). I am actively spearheading our project dedicated to *${c.theme}*.\n\nTo make this program a success, we need collective action. Here is how your contribution transforms lives:\n- ${c.metric}\n- Your donations are 50% tax-exempt under Section 80G.\n- You will receive a formal impact report showing how your funds were utilized.\n\nPlease visit the portal below to make your secure contribution online:\n🔗 [Your Portal Link]\n\nThank you so much for your support, encouragement, and generosity.\n\nWarm regards,\n[Your Name]\nNayePankh Student Coordinator`;
    }

    return baseText;
  };

  // Helper local storage functions to persist user interaction states
  const storageKey = 'NayePankh_VIP_Store';

  const getAppState = () => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Local storage parse error, resetting state", e);
      }
    }

    // Default Fresh State
    const defaultState = {
      campaigns: initialCampaigns,
      donors: initialDonors,
      leaderboard: initialLeaderboard,
      completedTaskIds: ['w1t1'], // Induction starts complete
      userStats: {
        name: 'Guest Champion',
        role: 'Social Work Intern',
        xp: 120,
        level: 1,
        submissionsCount: 1
      },
      notifications: [
        { id: 1, text: 'Welcome to NayePankh VIP Portal! Explore your volunteer tasks.', time: 'Just now', unread: true },
        { id: 2, text: 'Week 1 Task: "Induction Seminar" marked as complete! +30 XP.', time: '1 hr ago', unread: false },
        { id: 3, text: 'Feed the Needy campaign reached 78% funding milestone!', time: '2 hrs ago', unread: true }
      ]
    };

    saveAppState(defaultState);
    return defaultState;
  };

  const saveAppState = (state) => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  return {
    getAppState,
    saveAppState,
    programTasks,
    qaDatabase,
    generateOutreachTemplate
  };
})();
