const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
window.addEventListener("load",()=>setTimeout(()=>$("#loader").style.display="none",500));

$("#menuBtn").onclick=()=>$("#navlinks").classList.toggle("open");
$$(".navlinks a").forEach(a=>a.onclick=()=>$("#navlinks").classList.remove("open"));

$("#darkBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.theme=document.body.classList.contains("dark")?"dark":"light";$("#darkBtn").textContent=document.body.classList.contains("dark")?"☀️":"🌙"};
if(localStorage.theme==="dark"){document.body.classList.add("dark");$("#darkBtn").textContent="☀️"}

let urdu=false;
$("#langBtn").onclick=()=>{
  urdu=!urdu; document.documentElement.lang=urdu?"ur":"en"; document.documentElement.dir=urdu?"rtl":"ltr";
  $("#langBtn").textContent=urdu?"English":"اردو";
  $$("[data-en]").forEach(e=>e.textContent=urdu?e.dataset.ur:e.dataset.en);
  toast(urdu?"زبان اردو کر دی گئی۔":"Language changed to English.");
};

const notices=[
 ["Admission Open","Admissions for the new session are now open."],
 ["Holiday Notice","Please check the school office for the latest holiday schedule."],
 ["Parent Meeting","Parent-Teacher Meeting is scheduled for October 22."]
];
$("#notices").innerHTML=notices.map(n=>`<div class="notice"><b>NOTICE</b><span><strong>${n[0]}</strong><br>${n[1]}</span></div>`).join("");

$$(".counter").forEach(el=>{
 let end=+el.dataset.target, n=0, step=Math.max(1,Math.ceil(end/60));
 let t=setInterval(()=>{n+=step;if(n>=end){n=end;clearInterval(t)}el.textContent=n},25);
});

$$(".filters button").forEach(btn=>btn.onclick=()=>{
 $$(".filters button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
 const f=btn.dataset.filter;
 $$(".gallery-item").forEach(x=>x.style.display=f==="all"||x.classList.contains(f)?"flex":"none");
});

function toast(msg){$("#toast").textContent=msg;$("#toast").style.display="block";setTimeout(()=>$("#toast").style.display="none",2600)}
function openLogin(){$("#loginModal").classList.add("show")}
function closeLogin(){$("#loginModal").classList.remove("show")}
function closeDashboard(){$("#dashboardModal").classList.remove("show")}

$("#admissionForm").onsubmit=e=>{
 e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
 const old=JSON.parse(localStorage.admissions||"[]");old.push({...data,date:new Date().toLocaleString()});localStorage.admissions=JSON.stringify(old);
 e.target.reset();toast("Admission application saved successfully.");
};
$("#contactForm").onsubmit=e=>{e.preventDefault();e.target.reset();toast("Message sent successfully.");};

$("#loginForm").onsubmit=e=>{
 e.preventDefault(); const role=$("#role").value, user=$("#username").value;
 localStorage.lastLogin=JSON.stringify({role,user,date:new Date().toISOString()}); closeLogin(); showDashboard(role,user);
};
function showDashboard(role,user){
 const names={student:"Student",parent:"Parent",teacher:"Teacher",admin:"Admin"};
 const cards={
 student:[["Attendance","92%","attendance"],["Exam Results","A Grade","results"],["Homework","4 pending","homework"],["Fee Status","Paid","fees"],["Timetable","View timetable","timetable"],["Notices","Latest notices","notices"]],
 parent:[["Child Attendance","92%","attendance"],["Performance","A Grade","results"],["Fee Status","Paid","fees"],["PTM","Request meeting","ptm"],["Homework","4 pending","homework"],["Notices","Latest notices","notices"]],
 teacher:[["My Classes","6 classes","classes"],["Mark Attendance","Open","attendance"],["Enter Marks","Open","marks"],["Homework","Manage","homework"],["Student List","184 students","students"],["Notices","Manage","notices"]],
 admin:[["Students","1,200","students"],["Teachers","75","teachers"],["Admissions","32","admissions"],["Notices","8","notices"],["Fees","Manage","fees"],["Attendance","Manage","attendance"],["Results","Manage","results"],["Events","Manage","events"]]
 }[role];
 $("#dashboardContent").innerHTML=`<div class="section-head left"><span>${names[role].toUpperCase()} PORTAL</span><h2>Welcome, ${user}</h2><p>School Management Portal</p></div><div class="dash-cards">${cards.map(x=>`<button class="dash-card portal-card" onclick="openPortalSection('${x[2]}')"><small>${x[0]}</small><h3>${x[1]}</h3><span>Open →</span></button>`).join("")}</div><div id="portalArea" class="portal-area"><h3>School Portal</h3><p>Select a section above to open it.</p></div>`;
 $("#dashboardModal").classList.add("show");
}
function openPortal(){ const a=$("#portalArea"); if(a) openPortalSection("students"); }
function openPortalSection(section){
 const area=$("#portalArea"); if(!area)return;
 const d={students:["Students",["Ali Ahmed • Class 7","Ayesha Khan • Class 6","Hamza Raza • Class 8"],"Add Student"],teachers:["Teachers",["Sarah Ahmed • English","Ahmed Khan • Mathematics","Fatima Noor • Science"],"Add Teacher"],admissions:["Admission Applications",["New application • Grade 5","New application • Grade 8","Pending interview • Grade 6"],"Review Admissions"],notices:["Notice Board",["Parent-Teacher Meeting • Oct 22","Sports Day • Oct 15","Science Exhibition • Nov 05"],"Add Notice"],fees:["Fee Management",["Ali Ahmed • Paid","Ayesha Khan • Pending","Hamza Raza • Paid"],"Update Fees"],attendance:["Attendance",["Class 6 • 94%","Class 7 • 92%","Class 8 • 96%"],"Mark Attendance"],results:["Results",["Class 6 • A Grade","Class 7 • A Grade","Class 8 • B+ Grade"],"Enter Results"],homework:["Homework",["Mathematics • Chapter 4","English • Essay writing","Science • Lab worksheet"],"Add Homework"],timetable:["Timetable",["08:00 • Mathematics","09:00 • English","10:00 • Science"],"View Timetable"],classes:["My Classes",["Class 6","Class 7","Class 8"],"Open Class"],marks:["Enter Marks",["Class 6 • Mathematics","Class 7 • Mathematics","Class 8 • Mathematics"],"Enter Marks"],ptm:["Parent-Teacher Meeting",["Request a meeting with class teacher","View available meeting slots"],"Request Meeting"],events:["Events",["Sports Day • Oct 15","PTM • Oct 22","Science Exhibition • Nov 05"],"Add Event"]};
 const x=d[section]||d.students; area.innerHTML=`<div class="portal-panel"><h3>${x[0]}</h3>${x[1].map(r=>`<div class="portal-row"><span>${r}</span><b>›</b></div>`).join("")}<button class="btn btn-primary" onclick="portalAction('${x[2]}')">${x[2]}</button></div>`; area.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function portalAction(action){ localStorage.setItem("rehan_"+action.replace(/\W+/g,"_"),new Date().toLocaleString()); toast(action+" opened successfully."); }

$("#backTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});
window.onscroll=()=>$("#backTop").style.display=scrollY>500?"grid":"none";
