// 两类数据分别保存，方便后续扩展成应用或云端同步。
const PLAN_STORAGE_KEY = "todo-app-plans";
const PLAN_DATE_STORAGE_KEY = "todo-app-plan-date";
const PLAN_FEEDBACK_STORAGE_KEY = "todo-app-plan-feedback";
const REVIEW_ARCHIVE_STORAGE_KEY = "todo-app-review-archive";
const COUNTDOWN_STORAGE_KEY = "todo-app-countdowns";
const LEGACY_STORAGE_KEY = "todo-app-tasks";
const LAYOUT_STORAGE_KEY = "todo-app-layout";
const BEIJING_DAY_END_HOUR = 4;
const FEEDBACK_DEFAULT_REASON = "太忙啦 要注意节奏！";
const FEEDBACK_REASON_OPTIONS = [
  "时间安排过满",
  "临时事务打断",
  "精力状态不足",
  "任务拆得不够小",
];
const WARM_ENCOURAGEMENTS = [
  "你已经把今天往前推了一点，这一点很珍贵。",
  "完成它的你，正在悄悄变强。",
  "别小看这一格勾选，它是你认真生活的证据。",
  "你没有停在原地，这就已经很好。",
  "今天的努力，会在某个清晨回头拥抱你。",
  "慢一点也没关系，你正在走自己的路。",
  "你做到了，给自己一点真诚的肯定。",
  "这一步很小，但它属于真正的前进。",
  "愿你记得，此刻的坚持不是白费。",
  "完成一件事，就是替未来的自己点一盏灯。",
  "你在把混乱变清晰，这很了不起。",
  "今天也在认真靠近想成为的自己。",
  "不必完美，完成就是一种力量。",
  "你已经赢下了这一小段路。",
  "每一次勾选，都是你给自己的回应。",
  "你正在用行动证明，自己值得信任。",
  "这一刻很普通，但你的坚持不普通。",
  "好好收下这份完成感，它属于你。",
  "你又替未来少了一点负担。",
  "做完它的你，值得轻轻松一口气。",
  "不是所有努力都会立刻开花，但都会扎根。",
  "你没有辜负今天给你的这一点时间。",
  "继续这样，一点一点，路会变宽。",
  "你刚刚完成的，是更稳定的自己。",
  "能开始很棒，能完成更棒。",
  "今天的你，比刚才的你更有力量。",
  "把一件事落地，本身就是温柔的胜利。",
  "你正在积累别人看不见的底气。",
  "这一份完成，会成为下一步的台阶。",
  "你认真对待自己的人生，这很动人。",
  "不急，稳稳地完成，也是一种勇敢。",
  "你正在学会和时间站在一起。",
  "这一小步，正在改变你的惯性。",
  "完成了就好，剩下的慢慢来。",
  "你今天的坚持，已经留下痕迹。",
  "谢谢你没有放弃这一件小事。",
  "生活会记得这些安静的努力。",
  "你把想法变成了行动，这很珍贵。",
  "每一次完成，都是在给自己建立信心。",
  "你已经在路上，而且走得很认真。",
  "今天的光，来自你刚刚完成的事。",
  "这不是简单的一勾，是你守住了自己。",
  "你做得很好，真的可以这样告诉自己。",
  "愿这一点成就感，陪你继续向前。",
  "你正在把日子过成有回应的样子。",
  "这一件完成了，心里也会亮一点。",
  "保持这样的节奏，你会越来越稳。",
  "你给了今天一个漂亮的交代。",
  "认真完成的人，值得被自己看见。",
  "继续向前吧，你已经做得很不错。",
];

// 每日计划：{ id: 时间戳, text: 字符串, completed: 布尔值 }
let plans = loadItems(PLAN_STORAGE_KEY);
let planFeedback = loadItems(PLAN_FEEDBACK_STORAGE_KEY);
let reviewArchive = loadItems(REVIEW_ARCHIVE_STORAGE_KEY);
rolloverDailyPlans();
keepOnlyYesterdayFeedback();

// 倒数日待办：{ id: 时间戳, text: 字符串, completed: 布尔值, dueDate: 日期字符串 }
let countdowns = loadCountdowns();

// 每日计划 DOM
const planInput = document.getElementById("plan-input");
const addPlanBtn = document.getElementById("add-plan-btn");
const planList = document.getElementById("plan-list");
const planTotalCount = document.getElementById("plan-total-count");
const planCompletedCount = document.getElementById("plan-completed-count");
const freeReviewInput = document.getElementById("free-review");
const archiveFreeReviewBtn = document.getElementById("archive-free-review");
const feedbackList = document.getElementById("feedback-list");
const reviewArchiveElement = document.getElementById("review-archive");
const exportReviewBtn = document.getElementById("export-review");

// 倒数日 DOM
const todoInput = document.getElementById("todo-input");
const dueDateInput = document.getElementById("due-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");

// 时间和学习计时器 DOM
const beijingClockCard = document.getElementById("beijing-clock-card");
const beijingTimeElement = document.getElementById("beijing-time");
const beijingDateElement = document.getElementById("beijing-date");
const timeOverlay = document.getElementById("time-overlay");
const closeTimeOverlayBtn = document.getElementById("close-time-overlay");
const fullscreenBeijingTimeElement = document.getElementById("fullscreen-beijing-time");
const fullscreenBeijingDateElement = document.getElementById("fullscreen-beijing-date");
const timerDisplay = document.getElementById("timer-display");
const studyTitleInput = document.getElementById("study-title");
const studyMinutesInput = document.getElementById("study-minutes");
const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const focusOverlay = document.getElementById("focus-overlay");
const progressRing = document.getElementById("progress-ring");
const layoutToggleBtn = document.getElementById("layout-toggle");
const focusTitle = document.getElementById("focus-title");

// 数据备份 DOM
const exportBackupBtn = document.getElementById("export-backup");
const importBackupBtn = document.getElementById("import-backup");
const backupFileInput = document.getElementById("backup-file");

let timerTotalSeconds = getStudyDurationSeconds();
let timerSeconds = timerTotalSeconds;
let timerInterval = null;
let activeStudyTitle = "";
applySavedLayout();

function renderPlans() {
  planList.innerHTML = "";
  const encouragementMap = getDailyEncouragementMap();

  plans.forEach((plan) => {
    const li = document.createElement("li");
    li.dataset.id = plan.id;
    li.classList.toggle("completed", plan.completed);

    li.innerHTML = `
      <input
        type="checkbox"
        ${plan.completed ? "checked" : ""}
        onchange="togglePlan(${plan.id})"
      >
      <span class="plan-content">
        <span class="task-text">${escapeHTML(plan.text)}</span>
        ${plan.completed ? `<span class="encouragement-text">${encouragementMap.get(plan.id)}</span>` : ""}
      </span>
      <button class="edit-btn" onclick="startEditPlan(${plan.id})">编辑</button>
      <button class="delete-btn" onclick="deletePlan(${plan.id})">删除</button>
    `;

    planList.appendChild(li);
  });

  planTotalCount.textContent = plans.length;
  planCompletedCount.textContent = plans.filter((plan) => plan.completed).length;
  renderFeedback();
  renderReviewArchive();
}

function applySavedLayout() {
  const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
  const isSingleLayout = savedLayout === "single";

  document.body.classList.toggle("single-layout", isSingleLayout);
  layoutToggleBtn.textContent = isSingleLayout ? "电脑" : "单列";
  layoutToggleBtn.setAttribute("aria-pressed", String(isSingleLayout));
}

function toggleLayout() {
  const isSingleLayout = !document.body.classList.contains("single-layout");

  localStorage.setItem(LAYOUT_STORAGE_KEY, isSingleLayout ? "single" : "desktop");
  applySavedLayout();
}

function renderFeedback() {
  feedbackList.innerHTML = "";

  planFeedback.forEach((item) => {
    const card = document.createElement("article");
    card.className = "feedback-card";
    const optionName = `feedback-reason-${item.id}`;
    const selectedReason = FEEDBACK_REASON_OPTIONS.includes(item.reason) ? item.reason : "";
    const optionsHTML = FEEDBACK_REASON_OPTIONS.map((option) => `
      <label class="reason-option">
        <input
          type="radio"
          name="${optionName}"
          value="${escapeAttribute(option)}"
          onchange="archiveFeedbackWithReason(${item.id}, this.value)"
          ${selectedReason === option ? "checked" : ""}
        >
        <span>${escapeHTML(option)}</span>
      </label>
    `).join("");

    card.innerHTML = `
      <span class="feedback-date">${formatDateLabel(item.date)}</span>
      <strong>${escapeHTML(item.text)}</strong>
      <div class="reason-options" role="group" aria-label="选择未完成原因">
        ${optionsHTML}
      </div>
      <input
        class="custom-reason-input"
        id="feedback-${item.id}"
        type="text"
        placeholder="也可以写下自己的原因..."
        value=""
      >
      <button type="button" onclick="archiveFeedback(${item.id})">保存并收纳</button>
    `;

    feedbackList.appendChild(card);
  });
}

function renderReviewArchive() {
  reviewArchiveElement.innerHTML = "";
  const today = getBeijingDateString(new Date());
  const todayItems = reviewArchive.filter((item) => item.reviewedAt === today);

  if (todayItems.length === 0) {
    return;
  }

  const group = document.createElement("details");
  group.className = "archive-group";
  group.open = true;
  group.innerHTML = `<summary>今天收纳 · ${todayItems.length} 条</summary>`;

  appendArchiveSection(group, "每日完成情况", getArchiveItemsByType(todayItems, "daily"));
  appendArchiveSection(group, "当天复盘", getArchiveItemsByType(todayItems, "review"));

  reviewArchiveElement.appendChild(group);
}

function getArchiveItemsByType(items, type) {
  return items.filter((item) => {
    if (type === "daily") {
      return item.type === "daily" || !item.type;
    }

    return item.type === type;
  });
}

function appendArchiveSection(group, title, items) {
  if (items.length === 0) return;

  const section = document.createElement("section");
  section.className = "archive-section";
  section.innerHTML = `<h4>${title}</h4>`;

  items.forEach((item) => {
    const archiveItem = document.createElement("article");
    archiveItem.className = `archive-item ${getArchiveItemClass(item)}`;
    archiveItem.innerHTML = `
      <span class="archive-source-date">${getArchiveSourceLabel(item)}</span>
      <strong>
        ${getArchiveStatusBadge(item)}
        ${escapeHTML(item.text)}
      </strong>
      <p>${escapeHTML(item.reason)}</p>
    `;

    section.appendChild(archiveItem);
  });

  group.appendChild(section);
}

function getArchiveSourceLabel(item) {
  if (item.type === "review") {
    return "当天复盘";
  }

  return `计划日期：${escapeHTML(item.planDate)}`;
}

function getArchiveItemClass(item) {
  return item.type === "review" ? "review-archive-item" : "daily-archive-item";
}

function getArchiveStatusBadge(item) {
  if (item.type === "review") {
    return "";
  }

  return `<span class="unfinished-badge">未完成</span>`;
}

function renderCountdowns() {
  todoList.innerHTML = "";

  countdowns.forEach((task) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.completed);

    li.innerHTML = `
      <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleCountdown(${task.id})"
      >
      <span class="task-text">${escapeHTML(task.text)}</span>
      <span class="days-left ${getDaysLeftClass(task.dueDate)}">${getDaysLeftText(task.dueDate)}</span>
      <button class="delete-btn" onclick="deleteCountdown(${task.id})">删除</button>
    `;

    todoList.appendChild(li);
  });

  totalCount.textContent = countdowns.length;
  completedCount.textContent = countdowns.filter((task) => task.completed).length;
}

function addPlan() {
  const text = planInput.value.trim();

  if (text === "") {
    alert("请输入每日计划内容");
    return;
  }

  plans.unshift({
    id: Date.now(),
    text: text,
    completed: false,
  });

  planInput.value = "";
  saveItems(PLAN_STORAGE_KEY, plans);
  renderPlans();
}

function addCountdown() {
  const text = todoInput.value.trim();
  const dueDate = dueDateInput.value;

  if (text === "") {
    alert("请输入倒数日任务内容");
    return;
  }

  if (dueDate === "") {
    alert("请选择日期");
    return;
  }

  countdowns.unshift({
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: dueDate,
  });

  todoInput.value = "";
  dueDateInput.value = "";
  saveItems(COUNTDOWN_STORAGE_KEY, countdowns);
  renderCountdowns();
}

function togglePlan(id) {
  plans = plans.map((plan) => {
    if (plan.id === id) {
      return { ...plan, completed: !plan.completed };
    }

    return plan;
  });

  saveItems(PLAN_STORAGE_KEY, plans);
  renderPlans();
}

function toggleCountdown(id) {
  countdowns = countdowns.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }

    return task;
  });

  saveItems(COUNTDOWN_STORAGE_KEY, countdowns);
  renderCountdowns();
}

function deletePlan(id) {
  plans = plans.filter((plan) => plan.id !== id);
  saveItems(PLAN_STORAGE_KEY, plans);
  renderPlans();
}

function deleteCountdown(id) {
  countdowns = countdowns.filter((task) => task.id !== id);
  saveItems(COUNTDOWN_STORAGE_KEY, countdowns);
  renderCountdowns();
}

function startEditPlan(id) {
  const plan = plans.find((item) => item.id === id);
  if (!plan) return;

  const li = [...planList.children].find((item) => {
    return Number(item.dataset.id) === id;
  });

  if (!li) return;

  li.classList.add("editing");
  li.innerHTML = `
    <input type="checkbox" ${plan.completed ? "checked" : ""} onchange="togglePlan(${plan.id})">
    <input class="edit-input" type="text" value="${escapeAttribute(plan.text)}">
    <button class="save-btn" onclick="savePlanEdit(${plan.id})">保存</button>
    <button class="delete-btn" onclick="deletePlan(${plan.id})">删除</button>
  `;

  const editInput = li.querySelector(".edit-input");
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      savePlanEdit(id);
    }
  });
}

function savePlanEdit(id) {
  const li = [...planList.children].find((item) => item.classList.contains("editing"));
  if (!li) return;

  const editInput = li.querySelector(".edit-input");
  const text = editInput.value.trim();

  if (text === "") {
    alert("每日计划内容不能为空");
    return;
  }

  plans = plans.map((plan) => {
    if (plan.id === id) {
      return { ...plan, text: text };
    }

    return plan;
  });

  saveItems(PLAN_STORAGE_KEY, plans);
  renderPlans();
}

function archiveFeedback(id) {
  const customInput = document.getElementById(`feedback-${id}`);
  const reason = customInput?.value.trim();

  if (!reason) {
    alert("请先写下自填原因，或直接选择上方的常规原因。");
    return;
  }

  archiveFeedbackWithReason(id, reason);
}

function archiveFeedbackWithReason(id, reason) {
  const feedback = planFeedback.find((item) => item.id === id);
  if (!feedback) return;

  archiveFeedbackItem(feedback, reason || FEEDBACK_DEFAULT_REASON);

  planFeedback = planFeedback.filter((item) => item.id !== id);

  saveItems(PLAN_FEEDBACK_STORAGE_KEY, planFeedback);
  saveItems(REVIEW_ARCHIVE_STORAGE_KEY, reviewArchive);
  renderFeedback();
  renderReviewArchive();
}

function archiveFreeReview() {
  const reason = freeReviewInput.value.trim();

  if (reason === "") {
    alert("请先写下复盘内容");
    return;
  }

  const today = getBeijingDateString(new Date());

  reviewArchive.unshift({
    id: Date.now(),
    text: "自由复盘",
    reason: reason,
    planDate: today,
    reviewedAt: today,
    type: "review",
  });

  freeReviewInput.value = "";
  saveItems(REVIEW_ARCHIVE_STORAGE_KEY, reviewArchive);
  renderReviewArchive();
}

function rolloverDailyPlans() {
  const today = getBeijingPlanDayString(new Date());
  const savedDate = localStorage.getItem(PLAN_DATE_STORAGE_KEY);

  if (!savedDate) {
    localStorage.setItem(PLAN_DATE_STORAGE_KEY, today);
    return;
  }

  if (savedDate === today) {
    return;
  }

  autoArchivePendingFeedback();

  const unfinishedPlans = plans.filter((plan) => !plan.completed);
  const newFeedback = unfinishedPlans.map((plan) => ({
    id: Date.now() + plan.id,
    text: plan.text,
    date: savedDate,
    reason: "",
  }));

  planFeedback = newFeedback;
  plans = plans.map((plan) => ({
    ...plan,
    completed: false,
  }));

  saveItems(PLAN_FEEDBACK_STORAGE_KEY, planFeedback);
  saveItems(PLAN_STORAGE_KEY, plans);
  localStorage.setItem(PLAN_DATE_STORAGE_KEY, today);
}

function archiveFeedbackItem(feedback, reason = FEEDBACK_DEFAULT_REASON) {
  reviewArchive.unshift({
    id: Date.now() + feedback.id,
    text: feedback.text,
    reason: reason,
    planDate: feedback.date,
    reviewedAt: getBeijingDateString(new Date()),
    type: "daily",
  });
}

function autoArchivePendingFeedback() {
  if (planFeedback.length === 0) return;

  planFeedback.forEach((feedback) => {
    archiveFeedbackItem(feedback, FEEDBACK_DEFAULT_REASON);
  });

  planFeedback = [];
  saveItems(REVIEW_ARCHIVE_STORAGE_KEY, reviewArchive);
}

function keepOnlyYesterdayFeedback() {
  if (planFeedback.length === 0) return;

  const yesterday = getPreviousPlanDayString(new Date());
  const yesterdayFeedback = [];
  const staleFeedback = [];

  planFeedback.forEach((feedback) => {
    if (feedback.date === yesterday) {
      yesterdayFeedback.push(feedback);
    } else {
      staleFeedback.push(feedback);
    }
  });

  if (staleFeedback.length === 0) return;

  staleFeedback.forEach((feedback) => {
    archiveFeedbackItem(feedback, FEEDBACK_DEFAULT_REASON);
  });

  planFeedback = yesterdayFeedback;
  saveItems(PLAN_FEEDBACK_STORAGE_KEY, planFeedback);
  saveItems(REVIEW_ARCHIVE_STORAGE_KEY, reviewArchive);
}

function loadItems(key) {
  const savedItems = localStorage.getItem(key);

  if (!savedItems) {
    return [];
  }

  try {
    return JSON.parse(savedItems);
  } catch (error) {
    console.error("数据读取失败：", error);
    return [];
  }
}

function loadCountdowns() {
  const savedCountdowns = loadItems(COUNTDOWN_STORAGE_KEY);

  if (savedCountdowns.length > 0) {
    return savedCountdowns;
  }

  const legacyTasks = loadItems(LEGACY_STORAGE_KEY);
  if (legacyTasks.length > 0) {
    saveItems(COUNTDOWN_STORAGE_KEY, legacyTasks);
  }

  return legacyTasks;
}

function saveItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function getDaysLeft(dueDate) {
  const today = getBeijingDateAtMidnight(new Date());
  const targetDate = parseDateInput(dueDate);

  return Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
}

function getDaysLeftText(dueDate) {
  const daysLeft = getDaysLeft(dueDate);

  if (daysLeft > 0) {
    return `还有 ${daysLeft} 天`;
  }

  if (daysLeft < 0) {
    return `已过期 ${Math.abs(daysLeft)} 天`;
  }

  return "就是今天";
}

function getDaysLeftClass(dueDate) {
  const daysLeft = getDaysLeft(dueDate);

  if (daysLeft < 0) {
    return "overdue";
  }

  if (daysLeft === 0) {
    return "today";
  }

  return "";
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBeijingDate(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
}

function getBeijingDateString(date) {
  return getDateString(getBeijingDate(date));
}

function getBeijingDateAtMidnight(date) {
  const beijingDate = getBeijingDate(date);
  beijingDate.setHours(0, 0, 0, 0);

  return beijingDate;
}

function getBeijingPlanDayString(date) {
  const beijingDate = getBeijingDate(date);

  if (beijingDate.getHours() < BEIJING_DAY_END_HOUR) {
    beijingDate.setDate(beijingDate.getDate() - 1);
  }

  return getDateString(beijingDate);
}

function getDailyEncouragementMap() {
  const completedPlans = plans
    .filter((plan) => plan.completed)
    .sort((a, b) => a.id - b.id);
  const offset = getEncouragementOffset(getBeijingPlanDayString(new Date()));
  const encouragementMap = new Map();

  completedPlans.forEach((plan, index) => {
    const encouragementIndex = (offset + index) % WARM_ENCOURAGEMENTS.length;
    encouragementMap.set(plan.id, WARM_ENCOURAGEMENTS[encouragementIndex]);
  });

  return encouragementMap;
}

function getEncouragementOffset(dateText) {
  return [...dateText].reduce((sum, char) => sum + char.charCodeAt(0), 0) % WARM_ENCOURAGEMENTS.length;
}

function getPreviousPlanDayString(date) {
  const planDay = parseDateInput(getBeijingPlanDayString(date));
  planDay.setDate(planDay.getDate() - 1);

  return getDateString(planDay);
}

function parseDateInput(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(dateText) {
  if (!dateText) {
    return "未完成计划";
  }

  return `${dateText} 未完成`;
}

function formatReviewDate(dateText) {
  return `${dateText} 写下的复盘`;
}

function exportReviewArchive() {
  if (reviewArchive.length === 0) {
    alert("还没有可以导出的复盘内容");
    return;
  }

  const groups = reviewArchive.reduce((result, item) => {
    if (!result[item.reviewedAt]) {
      result[item.reviewedAt] = [];
    }

    result[item.reviewedAt].push(item);
    return result;
  }, {});

  const sections = Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const dailyItems = getArchiveItemsByType(groups[date], "daily")
        .map((item) => {
          return `
            <div class="review-item">
              <p><strong><span class="status-badge">未完成</span>${escapeHTML(item.text)}</strong></p>
              <p>计划日期：${escapeHTML(item.planDate)}</p>
              <p>未完成原因：${escapeHTML(item.reason).replaceAll("\n", "<br>")}</p>
            </div>
          `;
        })
        .join("");
      const reviewItems = getArchiveItemsByType(groups[date], "review")
        .map((item) => {
          return `
            <div class="review-item review-note">
              <p>${escapeHTML(item.reason).replaceAll("\n", "<br>")}</p>
            </div>
          `;
        })
        .join("");

      return `
        <h2>${formatReviewDate(date)}</h2>
        <h3>每日完成情况</h3>
        ${dailyItems || "<p>这一天没有收纳未完成计划。</p>"}
        <h3>当天复盘</h3>
        ${reviewItems || "<p>这一天还没有写自由复盘。</p>"}
      `;
    })
    .join("");

  const documentHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>F 待办复盘归档</title>
        <style>
          body { font-family: "Microsoft YaHei", Arial, sans-serif; line-height: 1.7; color: #222; }
          h1 { text-align: center; }
          h2 { margin-top: 28px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          h3 { margin: 18px 0 8px; color: #444; }
          .review-item { margin: 14px 0; padding: 12px 14px; border: 1px solid #ddd; }
          .review-note { background: #f7fbff; }
          .status-badge { display: inline-block; margin-right: 8px; padding: 2px 8px; color: #c92a2a; background: #fff5f5; border: 1px solid #ffc9c9; border-radius: 999px; font-size: 12px; }
          p { margin: 6px 0; }
        </style>
      </head>
      <body>
        <h1>F 待办复盘归档</h1>
        ${sections}
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", documentHtml], {
    type: "application/msword;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `F-待办复盘归档-${getBeijingDateString(new Date())}.doc`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportBackupData() {
  const backup = {
    app: "F 待办",
    version: 1,
    exportedAt: new Date().toISOString(),
    planDate: localStorage.getItem(PLAN_DATE_STORAGE_KEY),
    plans: plans,
    planFeedback: planFeedback,
    reviewArchive: reviewArchive,
    countdowns: countdowns,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `F-待办数据备份-${getBeijingDateString(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function openBackupFilePicker() {
  backupFileInput.click();
}

function importBackupData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result);
      const confirmed = confirm("导入后会用备份文件覆盖当前浏览器里的 F 待办数据。确定继续吗？");

      if (!confirmed) {
        backupFileInput.value = "";
        return;
      }

      plans = normalizeArray(backup.plans);
      planFeedback = normalizeArray(backup.planFeedback);
      reviewArchive = normalizeArray(backup.reviewArchive);
      countdowns = normalizeArray(backup.countdowns);

      saveItems(PLAN_STORAGE_KEY, plans);
      saveItems(PLAN_FEEDBACK_STORAGE_KEY, planFeedback);
      saveItems(REVIEW_ARCHIVE_STORAGE_KEY, reviewArchive);
      saveItems(COUNTDOWN_STORAGE_KEY, countdowns);
      localStorage.setItem(
        PLAN_DATE_STORAGE_KEY,
        backup.planDate || getBeijingPlanDayString(new Date())
      );
      keepOnlyYesterdayFeedback();

      renderPlans();
      renderCountdowns();
      alert("数据同步完成。");
    } catch (error) {
      alert("备份文件读取失败，请确认选择的是 F 待办导出的 JSON 文件。");
      console.error("备份导入失败：", error);
    } finally {
      backupFileInput.value = "";
    }
  };

  reader.readAsText(file, "utf-8");
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function updateBeijingClock() {
  const savedPlanDate = localStorage.getItem(PLAN_DATE_STORAGE_KEY);
  rolloverDailyPlans();

  if (savedPlanDate !== localStorage.getItem(PLAN_DATE_STORAGE_KEY)) {
    renderPlans();
  }

  const beijingDate = getBeijingDate(new Date());
  const hours = String(beijingDate.getHours()).padStart(2, "0");
  const minutes = String(beijingDate.getMinutes()).padStart(2, "0");
  const seconds = String(beijingDate.getSeconds()).padStart(2, "0");

  beijingTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
  const dateText = getBeijingPlanDayString(new Date());

  beijingDateElement.textContent = dateText;
  fullscreenBeijingTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
  fullscreenBeijingDateElement.textContent = dateText;
}

function openTimeOverlay() {
  updateBeijingClock();
  timeOverlay.classList.add("active");
  timeOverlay.setAttribute("aria-hidden", "false");
  closeTimeOverlayBtn.focus();
}

function closeTimeOverlay() {
  timeOverlay.classList.remove("active");
  timeOverlay.setAttribute("aria-hidden", "true");
  beijingClockCard.focus();
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const seconds = String(timerSeconds % 60).padStart(2, "0");
  const progress = timerTotalSeconds > 0 ? timerSeconds / timerTotalSeconds : 0;

  timerDisplay.textContent = `${minutes}:${seconds}`;
  progressRing.style.setProperty("--progress", Math.max(progress, 0));
}

function getStudyDurationSeconds() {
  const minutes = Number(studyMinutesInput.value);

  if (!Number.isFinite(minutes) || minutes < 1) {
    studyMinutesInput.value = 25;
    return 25 * 60;
  }

  return Math.min(minutes, 240) * 60;
}

function startTimer() {
  if (timerInterval) return;

  activeStudyTitle = studyTitleInput.value.trim() || "专注学习";
  focusTitle.textContent = activeStudyTitle;

  if (timerSeconds <= 0) {
    setTimerFromInput();
  }

  openFocusMode();
  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      pauseTimer();
      closeFocusMode();
      recordCompletedStudy();
      alert("学习时间到了。辛苦了，先给自己一点肯定。");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  closeFocusMode();
  setTimerFromInput();
}

function setTimerFromInput() {
  timerTotalSeconds = getStudyDurationSeconds();
  timerSeconds = timerTotalSeconds;
  updateTimerDisplay();
}

function openFocusMode() {
  focusOverlay.classList.add("active");
  focusOverlay.setAttribute("aria-hidden", "false");
}

function closeFocusMode() {
  focusOverlay.classList.remove("active");
  focusOverlay.setAttribute("aria-hidden", "true");
}

function recordCompletedStudy() {
  const durationMinutes = Math.round(timerTotalSeconds / 60);
  const title = `${activeStudyTitle}（学习 ${durationMinutes} 分钟）`;

  plans.unshift({
    id: Date.now(),
    text: title,
    completed: true,
  });

  saveItems(PLAN_STORAGE_KEY, plans);
  renderPlans();
  studyTitleInput.value = "";
}

function escapeHTML(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(text) {
  return escapeHTML(text);
}

addPlanBtn.addEventListener("click", addPlan);
addBtn.addEventListener("click", addCountdown);
archiveFreeReviewBtn.addEventListener("click", archiveFreeReview);
exportReviewBtn.addEventListener("click", exportReviewArchive);
exportBackupBtn.addEventListener("click", exportBackupData);
importBackupBtn.addEventListener("click", openBackupFilePicker);
backupFileInput.addEventListener("change", importBackupData);
layoutToggleBtn.addEventListener("click", toggleLayout);
beijingClockCard.addEventListener("click", openTimeOverlay);
beijingClockCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openTimeOverlay();
  }
});
closeTimeOverlayBtn.addEventListener("click", closeTimeOverlay);
timeOverlay.addEventListener("click", (event) => {
  if (event.target === timeOverlay) {
    closeTimeOverlay();
  }
});
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);
studyMinutesInput.addEventListener("change", setTimerFromInput);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && timeOverlay.classList.contains("active")) {
    closeTimeOverlay();
  }
});

planInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addPlan();
  }
});

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addCountdown();
  }
});

dueDateInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addCountdown();
  }
});

renderPlans();
renderCountdowns();
updateBeijingClock();
updateTimerDisplay();
setInterval(updateBeijingClock, 1000);
