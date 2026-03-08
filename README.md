<!DOCTYPE html><html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Creatorverse.ai</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#0f172a;color:white}
nav{display:flex;justify-content:space-between;align-items:center;padding:18px 30px;background:#020617;position:sticky;top:0}
nav h2{margin:0}
nav button{margin-left:10px}
.hero{padding:90px 20px;text-align:center}
.hero h1{font-size:46px;margin-bottom:10px}
.hero p{color:#cbd5f5}
.btn{background:#6366f1;border:none;color:white;padding:10px 18px;border-radius:6px;cursor:pointer}
.container{max-width:1100px;margin:auto;padding:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
.card{background:#1e293b;padding:20px;border-radius:10px}
.section{display:none}
.section.active{display:block}
input,select{width:100%;padding:10px;margin-top:8px;margin-bottom:12px;border-radius:6px;border:none}
ul{padding-left:18px}
.post{background:#1e293b;margin-top:10px;padding:12px;border-radius:6px}
.footer{margin-top:40px;background:#020617;text-align:center;padding:18px;color:#94a3b8}
</style>
</head>
<body><nav>
<h2>Creatorverse.ai</h2>
<div>
<button class="btn" onclick="show('home')">Home</button>
<button class="btn" onclick="show('dashboard')">Dashboard</button>
<button class="btn" onclick="show('upload')">Upload</button>
<button class="btn" onclick="show('scheduler')">Scheduler</button>
<button class="btn" onclick="show('library')">Library</button>
</div>
</nav><!-- HOME --><section id="home" class="section active">
<div class="hero">
<h1>Upload Once. Reach Everywhere.</h1>
<p>A creator platform to upload, schedule and manage content across platforms.</p>
</div><div class="container grid">
<div class="card">
<h3>Upload Content</h3>
<p>Add videos or posts to your creator library.</p>
</div><div class="card">
<h3>Schedule Posts</h3>
<p>Choose exactly when your content goes live.</p>
</div><div class="card">
<h3>Manage Platforms</h3>
<p>Control all creator accounts from one place.</p>
</div><div class="card">
<h3>Creator Dashboard</h3>
<p>Track upcoming posts and manage your workflow.</p>
</div>
</div>
</section><!-- DASHBOARD --><section id="dashboard" class="section">
<div class="container">
<h2>Creator Dashboard</h2>
<p>Overview of your activity.</p><div class="grid">
<div class="card">
<h3>Total Posts</h3>
<p id="totalPosts">0</p>
</div><div class="card">
<h3>Scheduled Posts</h3>
<p id="scheduledPosts">0</p>
</div><div class="card">
<h3>Library Items</h3>
<p id="libraryItems">0</p>
</div>
</div>
</div>
</section><!-- UPLOAD --><section id="upload" class="section">
<div class="container">
<h2>Upload Content</h2><input id="title" placeholder="Content title" />
<select id="platform">
<option>YouTube</option>
<option>Instagram</option>
<option>TikTok</option>
<option>X / Twitter</option>
</select><button class="btn" onclick="addContent()">Add To Library</button>

</div>
</section><!-- SCHEDULER --><section id="scheduler" class="section">
<div class="container">
<h2>Schedule Content</h2><input id="scheduleTitle" placeholder="Content title" />
<input type="datetime-local" id="scheduleTime" /><button class="btn" onclick="schedulePost()">Schedule Post</button>

<div id="scheduleList"></div>
</div>
</section><!-- LIBRARY --><section id="library" class="section">
<div class="container">
<h2>Content Library</h2>
<div id="libraryList"></div>
</div>
</section><div class="footer">
<p>© 2026 Creatorverse.ai</p>
</div><script>
function show(section){
 document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
 document.getElementById(section).classList.add('active');
 updateStats();
}

let library = JSON.parse(localStorage.getItem('library')||'[]');
let schedules = JSON.parse(localStorage.getItem('schedules')||'[]');

function save(){
 localStorage.setItem('library',JSON.stringify(library));
 localStorage.setItem('schedules',JSON.stringify(schedules));
}

function addContent(){
 let title=document.getElementById('title').value;
 let platform=document.getElementById('platform').value;
 if(!title)return;
 library.push({title,platform});
 save();
 document.getElementById('title').value='';
 renderLibrary();
 updateStats();
}

function schedulePost(){
 let title=document.getElementById('scheduleTitle').value;
 let time=document.getElementById('scheduleTime').value;
 if(!title||!time)return;
 schedules.push({title,time});
 save();
 renderSchedules();
 updateStats();
}

function renderLibrary(){
 let box=document.getElementById('libraryList');
 box.innerHTML='';
 library.forEach(p=>{
 let div=document.createElement('div');
 div.className='post';
 div.innerText=p.title+' → '+p.platform;
 box.appendChild(div);
 });
}

function renderSchedules(){
 let box=document.getElementById('scheduleList');
 box.innerHTML='';
 schedules.forEach(p=>{
 let div=document.createElement('div');
 div.className='post';
 div.innerText=p.title+' scheduled for '+p.time;
 box.appendChild(div);
 });
}

function updateStats(){
 document.getElementById('totalPosts').innerText=library.length;
 document.getElementById('scheduledPosts').innerText=schedules.length;
 document.getElementById('libraryItems').innerText=library.length;
}

renderLibrary();
renderSchedules();
updateStats();
</script></body>
</html>
