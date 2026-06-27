// ============================================================
// backend/config/migrate.js — Safe Migration + Comprehensive Seed
// Run: node backend/config/migrate.js
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const cfg = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'edunet',
  multipleStatements: true
};

async function addColumnSafe(conn, table, col, def) {
  const [rows] = await conn.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND COLUMN_NAME=?`,
    [cfg.database, table, col]
  );
  if (!rows.length) {
    await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${def}`);
    console.log(`  + Added ${table}.${col}`);
  }
}

async function run() {
  const conn = await mysql.createConnection(cfg);
  console.log('✅  DB connected\n');

  // ── 1. Safe column additions ─────────────────────────────────
  console.log('📐  Running safe migrations...');
  await addColumnSafe(conn, 'notifications', 'title',       'VARCHAR(255) DEFAULT NULL AFTER id');
  await addColumnSafe(conn, 'notifications', 'type',        "VARCHAR(20) DEFAULT 'info' AFTER title");
  await addColumnSafe(conn, 'notifications', 'target_role', "VARCHAR(20) DEFAULT 'all' AFTER type");
  await addColumnSafe(conn, 'certificates',  'title',       'VARCHAR(255) DEFAULT NULL AFTER id');
  await addColumnSafe(conn, 'certificates',  'issued_at',   'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER title');
  await addColumnSafe(conn, 'language_templates', 'template_name', 'VARCHAR(100) DEFAULT NULL AFTER language');
  await addColumnSafe(conn, 'language_templates', 'description',   'TEXT DEFAULT NULL AFTER template_code');
  await addColumnSafe(conn, 'roadmaps',      'salary_min',  'INT DEFAULT NULL');
  await addColumnSafe(conn, 'roadmaps',      'salary_max',  'INT DEFAULT NULL');
  await addColumnSafe(conn, 'roadmaps',      'enrolled',    'INT DEFAULT 0');
  await addColumnSafe(conn, 'ai_tools',      'website_url', 'VARCHAR(255) DEFAULT NULL');
  await addColumnSafe(conn, 'ai_tools',      'is_free',     'TINYINT(1) DEFAULT 1');
  await addColumnSafe(conn, 'ai_tools',      'review_count','INT DEFAULT 0');
  await addColumnSafe(conn, 'users',         'xp',          'INT DEFAULT 0');
  await addColumnSafe(conn, 'users',         'level',       'INT DEFAULT 1');
  await addColumnSafe(conn, 'users',         'bio',         'TEXT DEFAULT NULL');
  await addColumnSafe(conn, 'users',         'linkedin',    'VARCHAR(255) DEFAULT NULL');
  await addColumnSafe(conn, 'users',         'github',      'VARCHAR(255) DEFAULT NULL');
  await addColumnSafe(conn, 'users',         'skills',      'TEXT DEFAULT NULL');
  await addColumnSafe(conn, 'users',         'streak',      'INT DEFAULT 0');
  await addColumnSafe(conn, 'users',         'avatar_initials', 'VARCHAR(5) DEFAULT NULL');

  // ── 2. Roadmap metadata ──────────────────────────────────────
  console.log('\n🗺   Seeding roadmaps metadata...');
  const roadmapUpdates = [
    ['dsa','Data Structures & Algorithms','Master DSA from arrays to advanced graph algorithms and dynamic programming.','Programming','Beginner','16 weeks',2000,48,'🧮','arrays,trees,graphs,dp,sorting',1,60000,130000,12400],
    ['backend','Backend Development','Build scalable web servers with Node.js, Express, SQL and cloud deployment.','Web Dev','Intermediate','12 weeks',1800,36,'⚡','nodejs,express,rest,sql,docker',1,75000,150000,9800],
    ['frontend','Frontend Development','Learn React, HTML/CSS and build stunning user interfaces.','Web Dev','Beginner','10 weeks',1500,30,'🎨','react,html,css,tailwind,typescript',1,65000,130000,11200],
    ['full-stack','Full Stack Development','Design, build and deploy full-stack web apps from front to back.','Web Dev','Intermediate','20 weeks',3000,60,'🌐','react,node,sql,docker,aws',1,85000,170000,8900],
    ['ml','Machine Learning','Master ML algorithms, neural networks, and model deployment.','AI/ML','Advanced','24 weeks',3500,72,'🤖','python,sklearn,tensorflow,pytorch,mlops',1,90000,180000,7600],
    ['ai-engineer','AI Engineer','Build LLMs, RAG pipelines, agents and production AI systems.','AI/ML','Advanced','20 weeks',3200,56,'🧠','openai,langchain,embeddings,agents,mlops',1,110000,220000,5400],
    ['data-science','Data Science','Analyze data, build dashboards, uncover insights with Python and SQL.','Data','Intermediate','16 weeks',2200,44,'📊','python,pandas,sql,tableau,ml',0,80000,155000,8100],
    ['cybersecurity','Cybersecurity Analyst','Secure networks, penetration testing, and cyber threat defense.','Security','Advanced','20 weeks',2800,52,'🛡️','networking,ethical-hacking,certs,linux,ctf',0,85000,165000,4300],
    ['devops','DevOps Engineer','CI/CD pipelines, infrastructure-as-code, Docker, Kubernetes.','DevOps','Intermediate','16 weeks',2500,48,'🔄','docker,kubernetes,jenkins,terraform,aws',0,85000,165000,6700],
    ['aws','AWS Cloud Architect','Deploy and scale on AWS with certifications and best practices.','Cloud','Intermediate','14 weeks',2200,40,'☁️','aws,lambda,s3,rds,cloudwatch',0,80000,160000,5900],
    ['python','Python Developer','Master Python from basics through async, OOP, testing, and ML.','Programming','Beginner','10 weeks',1500,32,'🐍','python,oop,testing,flask,pandas',0,65000,125000,13800],
    ['system-design','System Design','Design scalable distributed systems, microservices, and databases.','Architecture','Advanced','12 weeks',2500,36,'🏗️','microservices,databases,caching,cdn',1,100000,200000,6200],
    ['flutter','Flutter Developer','Cross-platform mobile apps with Flutter and Dart.','Mobile','Intermediate','12 weeks',2000,36,'📱','flutter,dart,firebase,animations',0,70000,140000,4800],
    ['android','Android Developer','Native Android with Kotlin and Jetpack Compose.','Mobile','Intermediate','14 weeks',2100,40,'📲','kotlin,android,jetpack,room,retrofit',0,72000,142000,5100],
    ['ui-ux','UI/UX Design','User-centered design with Figma and design systems.','Design','Beginner','10 weeks',1600,28,'✏️','figma,design-systems,ux-research,prototyping',0,60000,120000,6800],
    ['sql','SQL & Database Mastery','Master SQL, database design, query optimization, and NoSQL.','Data','Beginner','8 weeks',1200,24,'🗄️','sql,mysql,postgresql,mongodb,redis',0,60000,120000,7500],
    ['competitive','Competitive Programming','Solve coding problems and compete in algorithmic contests.','Programming','Advanced','20 weeks',3000,64,'🏆','algorithms,dp,graphs,math,cp',0,85000,170000,4200],
    ['placement','Placement Preparation','Crack top tech interviews with DSA, system design, and HR prep.','Career','Intermediate','8 weeks',2000,32,'🎯','dsa,system-design,hr,aptitude,mock',1,75000,150000,14500],
    ['java','Java Developer','Java ecosystem: Spring, microservices, JVM tuning.','Programming','Intermediate','14 weeks',2100,40,'☕','java,spring,hibernate,maven,jvm',0,70000,140000,7800],
    ['cpp','C++ Developer','High-performance C++ with STL, concurrency, and game dev.','Programming','Advanced','16 weeks',2400,44,'⚙️','cpp,stl,concurrency,memory,game-dev',0,72000,145000,4100],
    ['nodejs','Node.js Developer','Node.js backend: APIs, real-time systems, and microservices.','Web Dev','Intermediate','12 weeks',1900,36,'🟢','nodejs,express,mongodb,redis,microservices',0,72000,142000,5900],
    ['react','React Developer','React ecosystem: hooks, state management, testing, performance.','Web Dev','Intermediate','12 weeks',1900,36,'⚛️','react,redux,typescript,testing,nextjs',0,70000,140000,8600],
    ['blockchain','Blockchain Developer','dApps with Solidity, Web3.js, and smart contracts.','Blockchain','Advanced','16 weeks',2800,44,'⛓️','solidity,ethereum,web3,defi,nft',0,90000,180000,2800],
  ];
  for (const [id,title,desc,cat,diff,dur,xp,lc,icon,tags,feat,smin,smax,enrolled] of roadmapUpdates) {
    await conn.query(
      `UPDATE roadmaps SET title=?,description=?,category=?,difficulty=?,duration=?,xp_reward=?,
       lesson_count=?,icon=?,tags=?,is_featured=?,salary_min=?,salary_max=?,enrolled=? WHERE id=?`,
      [title,desc,cat,diff,dur,xp,lc,icon,tags,feat,smin,smax,enrolled,id]
    );
  }

  // ── 3. Tests ──────────────────────────────────────────────────
  console.log('\n🧠  Seeding quiz tests...');
  const tests = [
    [1,'DSA Fundamentals','Easy','MCQ'],
    [2,'Python Basics','Easy','MCQ'],
    [3,'JavaScript Essentials','Intermediate','MCQ'],
    [4,'System Design Concepts','Hard','MCQ'],
    [5,'Database & SQL Mastery','Intermediate','MCQ'],
    [6,'Operating Systems','Intermediate','MCQ'],
    [7,'Computer Networks','Intermediate','MCQ'],
    [8,'OOP & Design Patterns','Intermediate','MCQ'],
    [9,'Machine Learning Basics','Hard','MCQ'],
    [10,'Web Development HTML/CSS','Easy','MCQ'],
  ];
  for (const [id,title,diff,type] of tests) {
    await conn.query(
      'INSERT INTO tests (id,lesson_id,course_id,title,difficulty,type) VALUES (?,NULL,NULL,?,?,?) ON DUPLICATE KEY UPDATE title=?,difficulty=?,type=?',
      [id,title,diff,type,title,diff,type]
    );
  }

  // ── 4. Questions ──────────────────────────────────────────────
  console.log('\n❓  Seeding 90 quiz questions...');
  const questions = [
    [1,1,'What is the time complexity of binary search?','O(n)','O(log n)','O(n²)','O(1)','B'],
    [2,1,'Which data structure uses LIFO order?','Queue','Stack','Array','LinkedList','B'],
    [3,1,'What is the height of a balanced BST with n nodes?','O(n)','O(n²)','O(log n)','O(1)','C'],
    [4,1,'Which sorting algorithm has best average time complexity?','Bubble Sort','Selection Sort','Merge Sort','Insertion Sort','C'],
    [5,1,'What is a spanning tree of a graph?','A tree connecting all vertices with minimum edges','A tree with maximum edges','A tree with cycles','None of the above','A'],
    [6,1,'What is Dijkstra algorithm used for?','Minimum spanning tree','Shortest path','Topological sort','Cycle detection','B'],
    [7,1,'What is the space complexity of recursive Fibonacci?','O(1)','O(n)','O(n²)','O(log n)','B'],
    [8,1,'What does DFS stand for?','Data First Search','Depth First Search','Dynamic First Search','Direct First Search','B'],
    [9,1,'Which data structure is used in BFS?','Stack','Tree','Queue','Graph','C'],
    [10,1,'What is dynamic programming based on?','Greedy approach','Divide and conquer','Optimal substructure and overlapping subproblems','Recursion only','C'],
    [11,1,'Worst-case complexity of QuickSort?','O(n log n)','O(n)','O(n²)','O(log n)','C'],
    [12,1,'What is a hash collision?','When two keys map to the same index','When hash table is full','When a key is deleted','None of the above','A'],
    [13,1,'What is a Min-Heap?','Parent >= children','Parent <= children','A balanced BST','A complete graph','B'],
    [14,1,'What is topological sort used for?','Undirected graphs','Directed acyclic graphs','Trees only','Connected components','B'],
    [15,1,'What is memoization?','Storing results of expensive computations','Sorting an array','Searching efficiently','Graph traversal','A'],
    [16,2,'What is a Python list comprehension?','Create lists concisely','A loop structure','An import statement','A class method','A'],
    [17,2,'Keyword to define a function in Python?','function','def','fn','func','B'],
    [18,2,'Output of len(["a","b","c"])?','2','3','4','Error','B'],
    [19,2,'What does PEP 8 define?','Performance metrics','Code style guide','Package manager','Build system','B'],
    [20,2,'What is a Python decorator?','Modifies another function','A design pattern','A class method','A module','A'],
    [21,2,'Difference between list and tuple?','Lists are immutable','Tuples are immutable, lists are mutable','No difference','Tuples have no indexing','B'],
    [22,2,'What is GIL in Python?','Global Import Library','Global Interpreter Lock','General Input Language','None of the above','B'],
    [23,2,'What does yield keyword do?','Returns value and ends','Pauses and returns a generator','Imports a module','Creates a class','B'],
    [24,2,'Which library for data manipulation?','NumPy','Flask','Django','Requests','A'],
    [25,2,'What is __init__ in Python?','A global function','A class constructor','A module initializer','A loop','B'],
    [26,2,'Use of *args?','Accept keyword args','Accept variable positional args','Define defaults','None','B'],
    [27,2,'What is a virtual environment?','A cloud server','An isolated Python environment','A package manager','A testing tool','B'],
    [28,2,'What does isinstance() do?','Creates instance','Checks object class','Deletes object','Imports a class','B'],
    [29,2,'Output of 3//2 in Python?','1.5','1','2','Error','B'],
    [30,2,'What is a lambda function?','Named function','A module','Anonymous function','A class','C'],
    [31,3,'Difference between let and var?','No difference','let is block-scoped, var is function-scoped','var is block-scoped','let is global','B'],
    [32,3,'What does === check?','Value only','Type only','Both value and type','Neither','C'],
    [33,3,'What is a Promise?','A function','Object representing future value','A variable type','A class','B'],
    [34,3,'What is event bubbling?','Child to parent','Parent to child','Events cancel themselves','None','A'],
    [35,3,'What does JSON.parse() do?','Object to JSON','JSON string to object','Fetches data','None','B'],
    [36,3,'Use of async/await?','Synchronous execution','Async code in sync style','Import modules','None','B'],
    [37,3,'What is the prototype chain?','An inheritance mechanism','A design pattern','A loop','A sorting algorithm','A'],
    [38,3,'What does Array.map() return?','Original array','New transformed array','Nothing','An object','B'],
    [39,3,'What is closure?','Function with no params','Function remembering outer scope','Import modules','None','B'],
    [40,3,'What is the DOM?','Document Object Model','Data Object Manager','Dynamic Object Method','None','A'],
    [41,3,'What is localStorage?','A database','Client-side key-value storage','Server storage','A cookie','B'],
    [42,3,'What does spread operator do?','Creates function','Expands array or object','Imports modules','Declares variables','B'],
    [43,3,'What is a JS module?','A function','Self-contained unit of code','A class','An HTML file','B'],
    [44,3,'null vs undefined?','Both same','null is empty, undefined is not assigned','undefined is empty','None','B'],
    [45,3,'Use of setTimeout()?','Executes after delay','Loops infinitely','Synchronizes code','None','A'],
    [46,4,'What is horizontal scaling?','More CPU','More servers','Reduce resources','Upgrade OS','B'],
    [47,4,'What is a CDN?','Content Delivery Network','Central Data Node','Cloud DNS','None','A'],
    [48,4,'What is a load balancer?','A database','Distributes traffic across servers','A caching layer','A DNS server','B'],
    [49,4,'What is eventual consistency?','Always consistent','Becomes consistent over time','Never consistent','CAP only','B'],
    [50,4,'What is a microservice?','Monolithic app','Small independent service','Frontend component','A database','B'],
    [51,4,'What does CAP theorem state?','All 3 guaranteed','Only 2 of 3 guaranteed','SQL only','None','B'],
    [52,4,'What is rate limiting?','Slowing server','Restricting client requests','Caching strategy','Load balancing','B'],
    [53,4,'What is a message queue?','A data structure','Async communication between services','A web socket','A database index','B'],
    [54,4,'What is database sharding?','Backing up','Partitioning across servers','Indexing','Replicating','B'],
    [55,4,'What is a reverse proxy?','Forward proxy','Server forwarding to backends','A DNS server','A CDN','B'],
    [56,5,'What does SELECT * do?','Selects specific columns','Selects all columns','Deletes table','Inserts data','B'],
    [57,5,'What is a PRIMARY KEY?','Can be NULL','Unique row identifier','A foreign key','An index','B'],
    [58,5,'What is a JOIN?','Deletes tables','Combines rows from tables','Creates index','Modifies table','B'],
    [59,5,'WHERE vs HAVING?','No difference','WHERE filters rows, HAVING filters groups','HAVING filters rows','None','B'],
    [60,5,'What is an index?','A backup','Speeds up queries','A constraint','A procedure','B'],
    [61,5,'What is normalization?','Adding data','Reducing redundancy','Backing up','Encrypting','B'],
    [62,5,'What does GROUP BY do?','Sorts data','Groups same values','Joins tables','Filters data','B'],
    [63,5,'What is a stored procedure?','A view','Precompiled SQL in database','A trigger','An index','B'],
    [64,5,'What is ACID?','Atomicity, Consistency, Isolation, Durability','A type of join','A normal form','None','A'],
    [65,5,'What is a foreign key?','A primary key','References primary key in another table','An index','A constraint','B'],
    [66,6,'What is a deadlock?','Programming error','Two processes waiting for each other','A race condition','Memory leak','B'],
    [67,6,'What is virtual memory?','Physical RAM','Disk space used as RAM','Cache memory','ROM','B'],
    [68,6,'What is context switching?','Switching apps','Saving and restoring CPU state','Changing UI','None','B'],
    [69,6,'What is a semaphore?','A data structure','Synchronization primitive','A type of lock','A scheduling algorithm','B'],
    [70,6,'What is paging in OS?','Memory management with fixed-size blocks','File management','Process scheduling','I/O management','A'],
    [71,7,'What is the OSI model?','7-layer network architecture','A database model','A programming model','An OS model','A'],
    [72,7,'TCP vs UDP?','No difference','TCP reliable, UDP faster but unreliable','UDP reliable','Both connectionless','B'],
    [73,7,'What is DNS?','Distributed Network System','Domain Name System resolving IPs','A protocol','A firewall','B'],
    [74,7,'HTTP vs HTTPS?','No difference','HTTPS adds SSL/TLS encryption','HTTP more secure','Same port','B'],
    [75,7,'What is an IP address?','Unique device identifier on a network','A website URL','A domain name','A MAC address','A'],
    [76,8,'What is inheritance?','Function calling itself','Class deriving from another','A design pattern','An interface','B'],
    [77,8,'What is polymorphism?','One interface, multiple implementations','A type of inheritance','A design pattern','None','A'],
    [78,8,'What is encapsulation?','Hiding data within a class','A type of inheritance','A design pattern','A module','A'],
    [79,8,'What is the Singleton pattern?','Multiple instances','Only one instance exists','A UI pattern','None','B'],
    [80,8,'What is the Observer pattern?','Creates clones','Objects notify observers on change','A structural pattern','None','B'],
    [81,9,'What is supervised learning?','Without labels','With labeled training data','Reinforcement learning','Transfer learning','B'],
    [82,9,'What is overfitting?','Poor on training','Great on training, poor on test','Learns nothing','None','B'],
    [83,9,'What is gradient descent?','Minimizes loss function','A type of network','A preprocessing step','None','A'],
    [84,9,'What is a neural network?','A graph database','Interconnected layers of neurons','A regression type','None','B'],
    [85,9,'What is regularization?','Adding data','Prevents overfitting by penalizing complexity','A type of optimizer','None','B'],
    [86,10,'What does HTML stand for?','Hyper Text Markup Language','High Text Machine Language','Hyper Tool Markup Language','None','A'],
    [87,10,'Purpose of CSS?','Interactivity','Style and layout of HTML','Server-side scripting','Database management','B'],
    [88,10,'What is a semantic HTML element?','No meaning','Describes its content meaning','Self-closing tag','Block element','B'],
    [89,10,'What is the box model?','3D layout','Content, padding, border, margin','A Flexbox concept','None','B'],
    [90,10,'What is Flexbox?','CSS one-dimensional layout model','CSS animation','A JavaScript library','None','A'],
  ];
  for (const [id,tid,q,a,b,c,d,ans] of questions) {
    await conn.query(
      'INSERT INTO questions (id,test_id,question_text,option_a,option_b,option_c,option_d,correct_option) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE question_text=VALUES(question_text)',
      [id,tid,q,a,b,c,d,ans]
    );
  }

  // ── 5. Videos ─────────────────────────────────────────────────
  console.log('\n🎬  Seeding videos...');
  const videos = [
    [1,'JavaScript Full Course 2024','Complete JavaScript from zero to hero with ES6+ features','https://www.youtube.com/watch?v=PkZNo7MFNFg','PkZNo7MFNFg','https://www.youtube.com/embed/PkZNo7MFNFg','https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg','JavaScript','javascript,web-dev,es6','freeCodeCamp','1h 53m','Web Dev',1],
    [2,'Python for Beginners','Learn Python from scratch with hands-on projects','https://www.youtube.com/watch?v=rfscVS0vtbw','rfscVS0vtbw','https://www.youtube.com/embed/rfscVS0vtbw','https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg','Python','python,beginner,programming','freeCodeCamp','4h 21m','Programming',1],
    [3,'Data Structures and Algorithms','Master DSA with animations and problem solving','https://www.youtube.com/watch?v=pkYVOmU3MgA','pkYVOmU3MgA','https://www.youtube.com/embed/pkYVOmU3MgA','https://img.youtube.com/vi/pkYVOmU3MgA/hqdefault.jpg','DSA','dsa,algorithms,data-structures','mycodeschool','8h 12m','Programming',1],
    [4,'React JS Tutorial','Build modern React apps with hooks and best practices','https://www.youtube.com/watch?v=w7ejDZ8SWv8','w7ejDZ8SWv8','https://www.youtube.com/embed/w7ejDZ8SWv8','https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg','React','react,frontend,javascript','Traversy Media','3h 28m','Web Dev',0],
    [5,'Machine Learning Full Course','ML from regression to deep learning','https://www.youtube.com/watch?v=NWONeJKn6kc','NWONeJKn6kc','https://www.youtube.com/embed/NWONeJKn6kc','https://img.youtube.com/vi/NWONeJKn6kc/hqdefault.jpg','Machine Learning','ml,python,ai','Sentdex','12h 30m','AI/ML',0],
    [6,'Node.js Crash Course','Build REST APIs with Node.js and Express','https://www.youtube.com/watch?v=fBNz5xF-Kx4','fBNz5xF-Kx4','https://www.youtube.com/embed/fBNz5xF-Kx4','https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg','Node.js','nodejs,express,backend','Traversy Media','2h 18m','Web Dev',0],
    [7,'Docker Tutorial 2024','Master Docker containers for development','https://www.youtube.com/watch?v=3c-iBn73dDE','3c-iBn73dDE','https://www.youtube.com/embed/3c-iBn73dDE','https://img.youtube.com/vi/3c-iBn73dDE/hqdefault.jpg','DevOps','docker,containers,devops','TechWorld with Nana','3h 45m','DevOps',0],
    [8,'SQL Full Course','SQL queries, joins, optimization and design','https://www.youtube.com/watch?v=HXV3zeQKqGY','HXV3zeQKqGY','https://www.youtube.com/embed/HXV3zeQKqGY','https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg','Database','sql,database,mysql','freeCodeCamp','4h 20m','Data',0],
    [9,'System Design Primer','Design scalable distributed systems','https://www.youtube.com/watch?v=xpDnVSmNFX0','xpDnVSmNFX0','https://www.youtube.com/embed/xpDnVSmNFX0','https://img.youtube.com/vi/xpDnVSmNFX0/hqdefault.jpg','System Design','system-design,architecture','Gaurav Sen','2h 10m','Architecture',1],
    [10,'Git and GitHub Complete Guide','Version control with Git and GitHub','https://www.youtube.com/watch?v=RGOj5yH7evk','RGOj5yH7evk','https://www.youtube.com/embed/RGOj5yH7evk','https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg','Tools','git,github,version-control','freeCodeCamp','1h 24m','General',0],
    [11,'TypeScript Full Course','TypeScript and type-safe JavaScript','https://www.youtube.com/watch?v=30LWjhZzg50','30LWjhZzg50','https://www.youtube.com/embed/30LWjhZzg50','https://img.youtube.com/vi/30LWjhZzg50/hqdefault.jpg','TypeScript','typescript,javascript','Academind','3h 15m','Web Dev',0],
    [12,'Kubernetes Tutorial','Container orchestration for production','https://www.youtube.com/watch?v=X48VuDVv0do','X48VuDVv0do','https://www.youtube.com/embed/X48VuDVv0do','https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg','DevOps','kubernetes,k8s','TechWorld with Nana','3h 26m','DevOps',0],
    [13,'C++ STL Tutorial','Master Standard Template Library for competitive programming','https://www.youtube.com/watch?v=LyGlTmaWEPs','LyGlTmaWEPs','https://www.youtube.com/embed/LyGlTmaWEPs','https://img.youtube.com/vi/LyGlTmaWEPs/hqdefault.jpg','C++','cpp,stl,competitive','Luv','2h 30m','Programming',0],
    [14,'CSS Flexbox and Grid','Modern CSS layouts with Flexbox and Grid','https://www.youtube.com/watch?v=phWxA89Dy94','phWxA89Dy94','https://www.youtube.com/embed/phWxA89Dy94','https://img.youtube.com/vi/phWxA89Dy94/hqdefault.jpg','CSS','css,flexbox,grid,frontend','freeCodeCamp','1h 08m','Web Dev',0],
    [15,'Operating Systems Complete Course','OS concepts: processes, threads, memory, I/O','https://www.youtube.com/watch?v=vBURTt97EkA','vBURTt97EkA','https://www.youtube.com/embed/vBURTt97EkA','https://img.youtube.com/vi/vBURTt97EkA/hqdefault.jpg','OS','operating-systems,processes,memory','Gate Smashers','6h 45m','General',0],
  ];
  for (const [id,title,desc,yt,vid,embed,thumb,cat,tags,inst,dur,branch,pinned] of videos) {
    await conn.query(
      `INSERT INTO videos (id,title,description,youtube_url,video_id,embed_url,thumbnail,category,tags,instructor,duration,branch,pinned,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'active')
       ON DUPLICATE KEY UPDATE title=VALUES(title),embed_url=VALUES(embed_url),thumbnail=VALUES(thumbnail),pinned=VALUES(pinned)`,
      [id,title,desc,yt,vid,embed,thumb,cat,tags,inst,dur,branch,pinned]
    );
  }

  // ── 6. Language Templates ─────────────────────────────────────
  console.log('\n💻  Seeding code templates...');
  try {
    await conn.query('ALTER TABLE language_templates DROP INDEX language');
  } catch(e) { /* index may not exist */ }
  await conn.query('TRUNCATE TABLE language_templates');
  const templates = [
    ['python','Hello World','print("Hello, World!")\n','Simple Python hello world'],
    ['python','Two Sum','def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))\n','Classic Two Sum'],
    ['python','Fibonacci','def fib(n):\n    a,b=0,1\n    for _ in range(n):\n        print(a,end=" ")\n        a,b=b,a+b\nfib(10)\n','Fibonacci sequence'],
    ['python','Binary Search','def binary_search(arr,t):\n    l,r=0,len(arr)-1\n    while l<=r:\n        m=(l+r)//2\n        if arr[m]==t: return m\n        elif arr[m]<t: l=m+1\n        else: r=m-1\n    return -1\nprint(binary_search([1,3,5,7,9,11],7))\n','Binary search'],
    ['python','Stack Implementation','class Stack:\n    def __init__(self):\n        self.items=[]\n    def push(self,x): self.items.append(x)\n    def pop(self): return self.items.pop()\n    def peek(self): return self.items[-1]\n    def is_empty(self): return len(self.items)==0\n\ns=Stack()\ns.push(1); s.push(2); s.push(3)\nprint(s.pop())\nprint(s.peek())\n','Stack data structure'],
    ['javascript','Hello World','console.log("Hello, World!");\n','Simple JS hello world'],
    ['javascript','Array Methods','const nums=[1,2,3,4,5];\nconsole.log("Map:",nums.map(n=>n*2));\nconsole.log("Filter:",nums.filter(n=>n%2===0));\nconsole.log("Reduce:",nums.reduce((a,b)=>a+b,0));\n','Array map/filter/reduce'],
    ['javascript','Promises','const fetchData=()=>new Promise((resolve,reject)=>{\n  setTimeout(()=>resolve({name:"EduNet",version:2}),500);\n});\n\nfetchData().then(d=>console.log(d)).catch(e=>console.error(e));\n','Promise usage'],
    ['javascript','Linked List','class Node{constructor(v){this.v=v;this.next=null;}}\nclass LinkedList{\n  constructor(){this.head=null;}\n  append(v){const n=new Node(v);if(!this.head){this.head=n;return;}let c=this.head;while(c.next)c=c.next;c.next=n;}\n  print(){let c=this.head,r=[];while(c){r.push(c.v);c=c.next;}console.log(r.join("->"));}\n}\nconst ll=new LinkedList();\nll.append(1);ll.append(2);ll.append(3);\nll.print();\n','Linked list'],
    ['cpp','Hello World','#include<iostream>\nusing namespace std;\nint main(){\n    cout<<"Hello, World!"<<endl;\n    return 0;\n}\n','C++ hello world'],
    ['cpp','Two Sum STL','#include<iostream>\n#include<vector>\n#include<unordered_map>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums,int t){\n    unordered_map<int,int> m;\n    for(int i=0;i<nums.size();i++){\n        if(m.count(t-nums[i]))return{m[t-nums[i]],i};\n        m[nums[i]]=i;\n    }\n    return{};\n}\nint main(){\n    vector<int> nums={2,7,11,15};\n    auto r=twoSum(nums,9);\n    cout<<r[0]<<","<<r[1]<<endl;\n}\n','C++ Two Sum'],
    ['java','Hello World','public class Main{\n    public static void main(String[] args){\n        System.out.println("Hello, World!");\n    }\n}\n','Java hello world'],
    ['java','ArrayList Demo','import java.util.*;\npublic class Main{\n    public static void main(String[] args){\n        ArrayList<Integer> list=new ArrayList<>();\n        list.add(1);list.add(2);list.add(3);\n        for(int n:list) System.out.print(n+" ");\n        System.out.println();\n        Collections.sort(list,(a,b)->b-a);\n        System.out.println(list);\n    }\n}\n','Java ArrayList'],
  ];
  for (const [lang,name,code,desc] of templates) {
    await conn.query(
      'INSERT INTO language_templates (language,template_name,template_code,description) VALUES (?,?,?,?)',
      [lang,name,code,desc]
    );
  }

  // ── 7. Notifications ──────────────────────────────────────────
  console.log('\n🔔  Seeding notifications...');
  const [users] = await conn.query('SELECT id FROM users');
  const msgs = [
    ['🎉 Welcome to EduNet 2.0!','The platform has been completely rebuilt with 24 roadmaps, 100+ AI tools, and 500+ quiz questions! Explore everything.','success',0,0],
    ['🧠 Quiz Center Launched','Test your knowledge with 90+ questions across DSA, Python, JavaScript, System Design, SQL, and more. Earn XP for every correct answer!','info',0,1],
    ['🤖 AI Tools Directory','Browse 100+ curated AI tools for coding, design, writing, and productivity. Bookmark your favorites!','info',0,2],
    ['🏆 Leaderboard is LIVE','Earn XP by completing roadmaps, passing quizzes, and using the coding lab. Climb the weekly rankings!','warning',1,3],
    ['📄 Resume Builder Enhanced','New templates, ATS score checker, and live preview now available. Export as PDF directly from the browser.','success',0,1],
  ];
  for (const u of users) {
    for (const [title,message,type,is_read,daysAgo] of msgs) {
      const created = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0,19).replace('T',' ');
      await conn.query(
        'INSERT IGNORE INTO notifications (user_id,title,message,type,is_read,created_at) VALUES (?,?,?,?,?,?)',
        [u.id,title,message,type,is_read,created]
      );
    }
  }

  // ── 8. Certificates for all users ─────────────────────────────
  console.log('\n🎓  Seeding certificates...');
  for (const u of users) {
    const hash = 'EN-' + Math.random().toString(36).slice(2,12).toUpperCase();
    await conn.query(
      'INSERT IGNORE INTO certificates (user_id,title,certificate_hash,issue_date) SELECT ?,?,?,NOW() WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE user_id=? AND title=?)',
      [u.id,'EduNet Platform Pioneer',hash,u.id,'EduNet Platform Pioneer']
    );
  }

  // ── 9. Feature top tools ──────────────────────────────────────
  console.log('\n🛠   Featuring top tools...');
  await conn.query('UPDATE ai_tools SET featured=1, is_free=1 WHERE id IN (SELECT id FROM (SELECT id FROM ai_tools ORDER BY rating DESC LIMIT 20) t)');
  await conn.query("UPDATE ai_tools SET is_free=0 WHERE pricing IN ('Paid','Premium','$20/mo','$30/mo')");

  // ── 10. Update user XP/level ──────────────────────────────────
  console.log('\n👤  Seeding user XP...');
  await conn.query("UPDATE users SET xp=500, level=2, streak=3 WHERE username='student'");
  await conn.query("UPDATE users SET xp=2500, level=6, streak=12 WHERE username='faculty'");
  await conn.query("UPDATE users SET xp=9999, level=20, streak=30 WHERE username='admin'");

  await conn.end();
  console.log('\n✅  Migration + seed complete!\n');
}

run().catch(err => { console.error('❌  Error:', err.message); process.exit(1); });
