const roles=["學生","家長","老師","行政"];
const nav={行政:["營運總覽","行事曆","學生管理","教師管理","課程班級","成績與出席","聯絡簿","系統啟用中心"],老師:["教學總覽","行事曆","我的班級","成績登錄","出席點名","作業管理","聯絡簿","教材中心"],家長:["孩子總覽","行事曆","學習成績","出席紀錄","作業進度","聯絡簿","教材檔案","通知中心"],學生:["我的首頁","行事曆","我的課程","我的成績","作業清單","聯絡簿","補課影片","教材下載"]};
let role="學生",active="我的首頁";
const students=[["S001","王得勝","高一","英文、數學","王媽媽","正常"],["S002","林品妤","高一","國文、英文、物理","林先生","正常"],["S003","陳奕安","高一","數學、化學","陳媽媽","待補資料"],["S004","張芯瑜","高一","巔峰班、英文","張先生","正常"]];
const courses=[["高一英文","Penny","星期二","24","7/28"],["高一數學","解創智數學","星期三","31","7/8"],["國文寫作","陳怡樺","星期四","26","7/2"],["英文素養","Gary","星期四","22","7/16"],["高一物理","陸怡中","星期六","28","7/18"],["高一化學","江青釗","星期六","27","7/18"],["國文常態","方韻慈","星期日","30","8/2"],["高一數學","陳建州","星期日","33","7/5"]];
const grades=[["王得勝","英文單字測驗","92","已完成"],["林品妤","數學單元測驗","88","已完成"],["陳奕安","化學隨堂測驗","—","待登錄"],["張芯瑜","國文寫作","A","已完成"]];
function show(id){document.getElementById(id).classList.remove("hidden")}function hide(id){document.getElementById(id).classList.add("hidden")}
document.querySelectorAll("[data-scroll]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
const scheduleModal=document.getElementById("schedule-modal");
function openSchedule(){show("schedule-modal");scheduleModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-lock")}
function closeSchedule(){hide("schedule-modal");scheduleModal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-lock")}
document.querySelectorAll(".schedule-open").forEach(el=>{el.onclick=openSchedule;el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openSchedule()}}});
document.querySelector(".schedule-close").onclick=closeSchedule;
scheduleModal.onclick=e=>{if(e.target===scheduleModal)closeSchedule()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!scheduleModal.classList.contains("hidden"))closeSchedule()});
const scheduleCourses=document.querySelectorAll(".course-card");
const courseTeacherMap={
  "解創智數學":"解創智數學",
  "陳建州｜進度一":"陳建州數學",
  "Penny｜雙週解題":"Penny 老師",
  "怡樺八週班":"陳怡樺老師",
  "方韻慈":"方韻慈老師",
  "陸怡中":"陸怡中老師",
  "金刀（江青釗）":"金刀老師（江青釗）"
};
function jumpToTeacher(teacherName){
  closeSchedule();
  window.setTimeout(()=>{
    const cards=[...document.querySelectorAll(".faculty-card")];
    const card=cards.find(item=>item.querySelector("h3")?.textContent.trim()===teacherName);
    if(!card)return;
    document.querySelectorAll(".faculty-card.subject-highlight").forEach(item=>item.classList.remove("subject-highlight"));
    card.scrollIntoView({behavior:"smooth",block:"center"});
    window.setTimeout(()=>{
      card.classList.add("subject-highlight");
      window.setTimeout(()=>card.classList.remove("subject-highlight"),2200);
    },520);
  },160);
}
scheduleCourses.forEach(card=>{
  const courseName=card.querySelector("b")?.textContent.trim()||"";
  const teacherName=courseTeacherMap[courseName];
  if(!teacherName){
    card.classList.add("course-no-profile");
    card.removeAttribute("tabindex");
    card.setAttribute("aria-label",`${courseName}，目前沒有師資介紹頁`);
    return;
  }
  card.dataset.teacher=teacherName;
  const go=()=>jumpToTeacher(teacherName);
  card.onclick=go;
  card.setAttribute("aria-label",`${courseName}，查看 ${teacherName} 師資介紹`);
  card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}};
});
const facultyProfileModal=document.getElementById("faculty-profile-modal");
const facultyGrid=document.querySelector(".teachers");
if(facultyGrid){
  const cards=[...facultyGrid.querySelectorAll(".faculty-card")];
  const cardByName=name=>cards.find(card=>card.querySelector("h3")?.textContent.trim()===name);
  const facultyResumeUpdates={
    "陸怡中老師":"前附中老師｜民國 89 年起在附中任教｜附中教書超過 25 年｜多家出版社社會參考書作者",
    "金刀老師（江青釗）":"前附中老師｜前師大附中科學班導師｜逾 26 年教學經驗｜教育部教師最高榮譽獎"
  };
  Object.entries(facultyResumeUpdates).forEach(([name,resume])=>{
    const card=cardByName(name);
    const summary=card?.querySelector("p");
    if(summary)summary.textContent=resume;
  });
  const makeHeading=(eyebrow,title,description)=>{
    const heading=document.createElement("header");
    heading.className="faculty-zone-head";
    heading.innerHTML=`<span>${eyebrow}</span><h3>${title}</h3><p>${description}</p>`;
    return heading;
  };
  const featured=document.createElement("section");
  featured.className="faculty-zone featured-math";
  featured.append(makeHeading("FEATURED MATHEMATICS","頂尖數學名師","以完整觀念與邏輯訓練，建立得勝者最具代表性的數學教學主線。"));
  const featuredGrid=document.createElement("div");
  featuredGrid.className="featured-math-grid";
  ["解創智數學","陳建州數學"].forEach(name=>{const card=cardByName(name);if(card)featuredGrid.append(card)});
  featured.append(featuredGrid);

  const allSubjects=document.createElement("section");
  allSubjects.className="faculty-zone all-subjects";
  allSubjects.append(makeHeading("COMPLETE FACULTY","全科專業師資","英文、國文與自然科依學科清楚分區，每位老師保持一致的視覺份量。"));
  const subjectGrid=document.createElement("div");
  subjectGrid.className="other-subjects-grid";
  [
    {key:"english",code:"ENGLISH",title:"英文",names:["Penny 老師"]},
    {key:"chinese",code:"CHINESE",title:"國文",names:["陳怡樺老師","方韻慈老師"]},
    {key:"science",code:"SCIENCE",title:"自然",names:["陸怡中老師","金刀老師（江青釗）"]}
  ].forEach(subject=>{
    const block=document.createElement("section");
    block.className="subject-block";
    block.dataset.subject=subject.key;
    block.innerHTML=`<header><span>${subject.code}</span><h4>${subject.title}</h4></header>`;
    const teacherGrid=document.createElement("div");
    teacherGrid.className="subject-card-grid";
    teacherGrid.style.setProperty("--teacher-count",subject.names.length);
    subject.names.forEach(name=>{const card=cardByName(name);if(card)teacherGrid.append(card)});
    block.append(teacherGrid);
    subjectGrid.append(block);
  });
  allSubjects.append(subjectGrid);
  facultyGrid.classList.add("faculty-groups");
  facultyGrid.replaceChildren(featured,allSubjects);
}
const facultyCards=document.querySelectorAll(".faculty-card");
const facultyProfileImage=document.getElementById("faculty-profile-image");
const facultyProfileName=document.getElementById("faculty-profile-name");
const facultyProfileSubject=document.getElementById("faculty-profile-subject");
const facultyProfileTagline=document.getElementById("faculty-profile-tagline");
const facultyProfileId=document.getElementById("faculty-profile-id");
function openFacultyProfile(card,index){
  const image=card.querySelector("img");
  facultyProfileImage.src=image.src;
  facultyProfileImage.alt=image.alt;
  facultyProfileName.textContent=card.querySelector("h3").textContent;
  facultyProfileSubject.textContent=card.querySelector(":scope > span:not(.faculty-view)").textContent;
  facultyProfileTagline.textContent=card.querySelector("p").textContent;
  facultyProfileId.textContent=String(index+1).padStart(2,"0");
  show("faculty-profile-modal");
  facultyProfileModal.setAttribute("aria-hidden","false");
  document.body.classList.add("faculty-modal-lock");
}
function closeFacultyProfile(){
  hide("faculty-profile-modal");
  facultyProfileModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("faculty-modal-lock");
}
facultyCards.forEach((card,index)=>{
  card.onclick=()=>openFacultyProfile(card,index);
  card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openFacultyProfile(card,index)}};
});
document.querySelector(".faculty-profile-close").onclick=closeFacultyProfile;
facultyProfileModal.onclick=e=>{if(e.target===facultyProfileModal)closeFacultyProfile()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!facultyProfileModal.classList.contains("hidden"))closeFacultyProfile()});
const campusAccount=document.getElementById("campus-account");
const campusPassword=document.getElementById("campus-password");
const campusLoginError=document.getElementById("login-error");
const campusLoginRule=document.getElementById("login-rule");
function updateCampusLoginFields(){
  const studentFamily=role==="學生"||role==="家長";
  const teacher=role==="老師";
  campusAccount.placeholder=studentFamily?"請輸入學生學號":teacher?"請輸入老師帳號":"請輸入行政帳號";
  campusAccount.inputMode=studentFamily?"numeric":"text";
  campusPassword.placeholder=studentFamily?"民國生日年月日 6 碼":teacher?"請輸入老師密碼":"請輸入行政密碼";
  campusPassword.inputMode=studentFamily?"numeric":"text";
  campusPassword.maxLength=studentFamily?6:64;
  campusLoginRule.lastChild.textContent=studentFamily
    ?"學生與家長：帳號為學號，密碼為民國生日 6 碼；100 年請輸入 00"
    :teacher?"老師請使用核發的老師帳號與密碼":"行政請使用核發的行政帳號與密碼";
  campusLoginError.textContent="";
}
document.querySelectorAll(".portal-open").forEach(b=>b.onclick=()=>{updateCampusLoginFields();show("login")});document.querySelector(".modal-close").onclick=()=>hide("login");
document.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{role=b.dataset.role;document.querySelectorAll("[data-role]").forEach(x=>x.classList.toggle("selected",x===b));updateCampusLoginFields()});
document.querySelector(".login-box").onsubmit=e=>{
  e.preventDefault();
  const account=campusAccount.value.trim();
  const password=campusPassword.value.trim();
  if(role==="學生"||role==="家長"){
    if(!/^\d+$/.test(account)){campusLoginError.textContent="請輸入正確的學生學號";campusAccount.focus();return}
    if(!/^\d{6}$/.test(password)){campusLoginError.textContent="密碼請輸入民國生日年月日 6 碼，例如 99/10/25 請輸入 991025";campusPassword.focus();return}
  }else if(role==="老師"){
    if(!(account==="teacher"&&password==="T2026")){campusLoginError.textContent="老師帳號或密碼不正確";return}
  }else if(role==="行政"){
    if(!(account==="admin"&&password==="A2026")){campusLoginError.textContent="行政帳號或密碼不正確";return}
  }
  const portalRole={學生:"student",家長:"parent",老師:"teacher",行政:"admin"}[role];
  const auth={role:portalRole,account,studentId:(portalRole==="student"||portalRole==="parent")?account:null,issuedAt:Date.now()};
  window.sessionStorage.setItem("victorCampusAuth",JSON.stringify(auth));
  window.location.href=`portal.html?role=${portalRole}`;
};
document.getElementById("back-site").onclick=()=>{hide("portal");show("official");window.scrollTo({top:0,behavior:"smooth"})};
const inquiryEndpoint="https://script.google.com/macros/s/AKfycbx5gqERJdjXqOeRl8zXCW94_QcuturvPYBYWYFeGofwwLPHmdcY7LE71VYDVQbHBLnK/exec";
const consultForm=document.getElementById("consult");
const consultStatus=document.getElementById("consult-status");
const consultSubmit=consultForm.querySelector('button[type="submit"]');
const teacherSubject={
  "解創智數學":"數學",
  "陳建州數學":"數學",
  "Penny 老師":"英文",
  "陳怡樺老師":"國文",
  "方韻慈老師":"國文",
  "陸怡中老師":"物理",
  "金刀老師（江青釗）":"化學"
};
document.querySelector(".profile-inquiry").onclick=()=>{
  const teacher=facultyProfileName.textContent.trim();
  consultForm.elements.teacher.value=teacher;
  consultForm.elements.subject.value=teacherSubject[teacher]||"";
  closeFacultyProfile();
  document.getElementById("contact").scrollIntoView({behavior:"smooth",block:"center"});
  window.setTimeout(()=>consultForm.elements.parentName.focus(),500);
};
consultForm.onsubmit=async e=>{
  e.preventDefault();
  if(!consultForm.reportValidity())return;
  consultSubmit.disabled=true;
  consultSubmit.textContent="資料送出中…";
  consultStatus.className="consult-status";
  consultStatus.textContent="正在安全送出問班資料";
  const formData=new FormData(consultForm);
  const payload={
    parentName:String(formData.get("parentName")||"").trim(),
    studentName:String(formData.get("studentName")||"").trim(),
    grade:String(formData.get("grade")||""),
    subject:String(formData.get("subject")||""),
    teacher:String(formData.get("teacher")||""),
    phone:String(formData.get("phone")||"").trim(),
    lineId:String(formData.get("lineId")||"").trim(),
    message:String(formData.get("message")||"").trim(),
    source:"victor-campus.vercel.app"
  };
  try{
    await fetch(inquiryEndpoint,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });
    consultForm.reset();
    consultStatus.className="consult-status success";
    consultStatus.textContent="已成功送出！我們會盡快與您聯絡。";
    consultSubmit.textContent="已送出問班資料";
  }catch(error){
    consultStatus.className="consult-status error";
    consultStatus.textContent="目前無法送出，請稍後再試，或使用右下角官方 LINE 聯絡我們。";
    consultSubmit.textContent="重新送出";
  }finally{
    consultSubmit.disabled=false;
  }
};
function roleButtons(){const box=document.querySelector(".role-switch>div");box.innerHTML=roles.map(r=>`<button class="${r===role?'selected':''}" data-switch="${r}">${r}</button>`).join("");box.querySelectorAll("button").forEach(b=>b.onclick=()=>{role=b.dataset.switch;active=nav[role][0];renderPortal()})}
function renderPortal(){roleButtons();document.getElementById("account-role").textContent=role+"帳號";const n=document.getElementById("portal-nav");n.innerHTML=nav[role].map(x=>`<button class="${x===active?'active':''}" data-page="${x}">${x}</button>`).join("");n.querySelectorAll("button").forEach(b=>b.onclick=()=>{active=b.dataset.page;renderPortal()});document.getElementById("portal-content").innerHTML=page()}
function hero(title,sub,button="查看本月行事曆 →"){return `<section class="dash-hero"><div><span>VICTOR+ CAMPUS</span><h1>${title}</h1><p>${sub}</p></div><button>${button}</button></section>`}
function table(headers,rows){return `<div class="table-wrap"><table><thead><tr>${headers.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>`<td>${i===r.length-1?`<span class="badge">${x}</span>`:x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
function overview(){const title=role==="行政"?"教務營運總覽":role==="老師"?"今日教學中心":role==="家長"?"王得勝學習總覽":"王得勝的學習首頁";return hero(title,"課程、學習紀錄與重要訊息，都集中在這裡。")+`<section class="metrics"><article><small>在籍學生</small><strong>${role==="行政"?286:1}</strong><span>本學期穩定成長</span></article><article><small>進行中課程</small><strong>${role==="行政"?10:3}</strong><span>本週 8 堂課</span></article><article><small>本月出席率</small><strong>96%</strong><span>較上月 +2%</span></article><article><small>待處理事項</small><strong>4</strong><span>2 則新聯絡簿</span></article></section><div class="portal-grid"><section class="panel"><div class="panel-title"><h2>今日安排</h2></div><div class="timeline"><article><time>14:00</time><p><b>高一物理</b><span>陸怡中老師・201 教室</span></p></article><article><time>17:30</time><p><b>巔峰班</b><span>大講堂・點名待完成</span></p></article><article><time>19:00</time><p><b>高一化學</b><span>江青釗老師・301 教室</span></p></article></div></section><section class="panel"><div class="panel-title"><h2>常用功能</h2></div><div class="quick">${["學生管理","成績登錄","出席點名","聯絡簿"].map(x=>`<button>${x}</button>`).join("")}</div></section><section class="panel wide"><div class="panel-title"><h2>近期學習紀錄</h2></div>${table(["學生","項目","成績","狀態"],grades)}</section></div>`}
function calendar(){let cells="";for(let i=0;i<42;i++){const d=i-4;const cur=d>0&&d<=31;const day=cur?d:(d<=0?31+d:d-31);const week=i%7;let events="";if(cur&&week===1)events=`<button class="cal-event">英文・Penny</button>`;if(cur&&week===2)events=`<button class="cal-event">解創智數學</button>`;if(cur&&week===3)events=`<button class="cal-event">國文寫作</button><button class="cal-event">英文素養</button>`;if(cur&&week===5)events=`<button class="cal-event">物理</button><button class="cal-event">化學</button>`;if(cur&&week===6)events=`<button class="cal-event">國文常態</button><button class="cal-event">數學</button>`;cells+=`<div><b>${day}</b>${events}</div>`}return hero((role==="行政"?"全校課程":"我的課程")+"行事曆","2026 高一上學期完整課表","＋ 新增行程")+`<div class="portal-grid"><section class="panel wide"><div class="panel-title"><h2>2026 年 8 月</h2></div><div class="calendar">${cells}</div></section></div>`}
function dataPage(){let title=active,headers=["課程","教師","上課日","人數","開課日"],rows=courses;if(active.includes("學生")){title="學生管理";headers=["學號","姓名","年級","選修課程","家長","狀態"];rows=students}else if(active.includes("成績")){title="成績與學習紀錄";headers=["學生","測驗項目","成績","狀態"];rows=grades}else if(active.includes("出席")||active.includes("點名")){title="出席與點名";headers=["學生","課程","日期","出席","補課狀態"];rows=[["王得勝","高一數學","8/5","準時","不需補課"],["林品妤","英文素養","8/6","請假","影片已開放"],["陳奕安","高一化學","8/8","準時","不需補課"]]}else if(active.includes("聯絡")||active.includes("通知")){title="聯絡簿與通知";headers=["發送者","對象","內容","日期","狀態"];rows=[["解創智數學","王得勝家長","請完成講義 P.18","今天","已讀"],["教務處","高一家長","8/22 學習成果診斷","昨天","已送出"]]}else if(active.includes("作業")){title="作業管理";headers=["課程","作業內容","期限","已繳/總數","狀態"];rows=[["高一數學","講義 P.18–22","8/10","25/31","收件中"],["高一英文","核心單字 Unit 3","8/11","20/24","收件中"]]}else if(active.includes("教材")||active.includes("影片")){title="教材與補課中心";headers=["課程","檔案","類型","更新日期","狀態"];rows=[["高一數學","函數題型整理","PDF","8/2","可下載"],["高一物理","直線運動補課","影片","8/1","可觀看"]]}return hero(title,"資料、紀錄與相關操作集中管理。","＋ 新增資料")+`<div class="portal-grid"><section class="panel wide"><div class="panel-title"><h2>${title}</h2></div>${table(headers,rows)}</section></div>`}
function page(){if(active.includes("總覽")||active==="我的首頁")return overview();if(active==="行事曆")return calendar();return dataPage()}
