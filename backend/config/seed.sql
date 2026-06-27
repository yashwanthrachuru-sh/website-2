-- ============================================================
-- EduNet Safe Schema Migration + Seed Data
-- Safe: uses ALTER IGNORE / INSERT IGNORE / ON DUPLICATE KEY
-- ============================================================
USE edunet;

-- ── Safe schema additions ────────────────────────────────────
-- Add missing columns to notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'info';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_role VARCHAR(20) DEFAULT 'all';

-- Add missing columns to certificates
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT NULL;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns to language_templates
ALTER TABLE language_templates ADD COLUMN IF NOT EXISTS template_name VARCHAR(100) DEFAULT NULL;
ALTER TABLE language_templates ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;

-- ── Update roadmaps with richer metadata ─────────────────────
UPDATE roadmaps SET description='Master data structures, algorithms, and competitive programming from scratch to advanced.', category='Programming', difficulty='Beginner', duration='16 weeks', xp_reward=2000, lesson_count=48, icon='🧮', tags='arrays,trees,graphs,dp,sorting', is_featured=1 WHERE id='dsa';
UPDATE roadmaps SET description='Build scalable web servers with Node.js, Express, REST APIs, and cloud deployment.', category='Web Dev', difficulty='Intermediate', duration='12 weeks', xp_reward=1800, lesson_count=36, icon='⚡', tags='nodejs,express,rest,sql,docker', is_featured=1 WHERE id='backend';
UPDATE roadmaps SET description='Learn React, Vue, and modern CSS to build stunning user interfaces and SPAs.', category='Web Dev', difficulty='Beginner', duration='10 weeks', xp_reward=1500, lesson_count=30, icon='🎨', tags='react,html,css,tailwind,typescript', is_featured=1 WHERE id='frontend';
UPDATE roadmaps SET description='Design, build, and deploy full-stack applications with modern toolchains.', category='Web Dev', difficulty='Intermediate', duration='20 weeks', xp_reward=3000, lesson_count=60, icon='🌐', tags='react,node,sql,docker,aws', is_featured=1 WHERE id='full-stack';
UPDATE roadmaps SET description='Master machine learning algorithms, neural networks, and model deployment.', category='AI/ML', difficulty='Advanced', duration='24 weeks', xp_reward=3500, lesson_count=72, icon='🤖', tags='python,sklearn,tensorflow,pytorch,mlops', is_featured=1 WHERE id='ml';
UPDATE roadmaps SET description='Build and deploy AI systems including LLMs, RAG pipelines, and AI agents.', category='AI/ML', difficulty='Advanced', duration='20 weeks', xp_reward=3200, lesson_count=56, icon='🧠', tags='openai,langchain,embeddings,agents,mlops', is_featured=1 WHERE id='ai-engineer';
UPDATE roadmaps SET description='Analyze data, build dashboards, and uncover insights with Python and SQL.', category='Data', difficulty='Intermediate', duration='16 weeks', xp_reward=2200, lesson_count=44, icon='📊', tags='python,pandas,sql,tableau,ml', is_featured=0 WHERE id='data-science';
UPDATE roadmaps SET description='Secure networks, perform penetration testing, and defend against cyber threats.', category='Security', difficulty='Advanced', duration='20 weeks', xp_reward=2800, lesson_count=52, icon='🛡️', tags='networking,ethical-hacking,certs,linux,ctf', is_featured=0 WHERE id='cybersecurity';
UPDATE roadmaps SET description='Build and automate CI/CD pipelines, infrastructure-as-code, and monitoring.', category='DevOps', difficulty='Intermediate', duration='16 weeks', xp_reward=2500, lesson_count=48, icon='🔄', tags='docker,kubernetes,jenkins,terraform,aws', is_featured=0 WHERE id='devops';
UPDATE roadmaps SET description='Deploy and scale applications on AWS with certifications and best practices.', category='Cloud', difficulty='Intermediate', duration='14 weeks', xp_reward=2200, lesson_count=40, icon='☁️', tags='aws,lambda,s3,rds,cloudwatch', is_featured=0 WHERE id='aws';
UPDATE roadmaps SET description='Master Python from basics to advanced topics including async, testing, and ML.', category='Programming', difficulty='Beginner', duration='10 weeks', xp_reward=1500, lesson_count=32, icon='🐍', tags='python,oop,testing,flask,pandas', is_featured=0 WHERE id='python';
UPDATE roadmaps SET description='Design scalable distributed systems: microservices, databases, and caching.', category='Architecture', difficulty='Advanced', duration='12 weeks', xp_reward=2500, lesson_count=36, icon='🏗️', tags='microservices,databases,caching,load-balancing,cdn', is_featured=1 WHERE id='system-design';
UPDATE roadmaps SET description='Build cross-platform mobile apps with Flutter and Dart.', category='Mobile', difficulty='Intermediate', duration='12 weeks', xp_reward=2000, lesson_count=36, icon='📱', tags='flutter,dart,firebase,state-management,animations', is_featured=0 WHERE id='flutter';
UPDATE roadmaps SET description='Develop native Android applications with Kotlin and Jetpack Compose.', category='Mobile', difficulty='Intermediate', duration='14 weeks', xp_reward=2100, lesson_count=40, icon='🤖', tags='kotlin,android,jetpack,room,retrofit', is_featured=0 WHERE id='android';
UPDATE roadmaps SET description='Design beautiful, user-centered interfaces with Figma and design systems.', category='Design', difficulty='Beginner', duration='10 weeks', xp_reward=1600, lesson_count=28, icon='✏️', tags='figma,design-systems,ux-research,prototyping,accessibility', is_featured=0 WHERE id='ui-ux';
UPDATE roadmaps SET description='Master SQL, database design, query optimization, and NoSQL solutions.', category='Data', difficulty='Beginner', duration='8 weeks', xp_reward=1200, lesson_count=24, icon='🗄️', tags='sql,mysql,postgresql,mongodb,redis', is_featured=0 WHERE id='sql';
UPDATE roadmaps SET description='Solve coding problems and compete in algorithmic programming contests.', category='Programming', difficulty='Advanced', duration='20 weeks', xp_reward=3000, lesson_count=64, icon='🏆', tags='algorithms,dp,graphs,math,cp', is_featured=0 WHERE id='competitive';
UPDATE roadmaps SET description='Crack top tech company interviews with DSA, system design, and HR preparation.', category='Career', difficulty='Intermediate', duration='8 weeks', xp_reward=2000, lesson_count=32, icon='🎯', tags='dsa,system-design,hr,aptitude,mock-interviews', is_featured=1 WHERE id='placement';
UPDATE roadmaps SET description='Deep-dive into Java ecosystem: Spring, microservices, JVM tuning.', category='Programming', difficulty='Intermediate', duration='14 weeks', xp_reward=2100, lesson_count=40, icon='☕', tags='java,spring,hibernate,maven,jvm', is_featured=0 WHERE id='java';
UPDATE roadmaps SET description='Build high-performance applications in C++ with STL, concurrency, and game dev.', category='Programming', difficulty='Advanced', duration='16 weeks', xp_reward=2400, lesson_count=44, icon='⚙️', tags='cpp,stl,concurrency,memory,game-dev', is_featured=0 WHERE id='cpp';
UPDATE roadmaps SET description='Build Node.js backend applications, APIs, real-time systems, and microservices.', category='Web Dev', difficulty='Intermediate', duration='12 weeks', xp_reward=1900, lesson_count=36, icon='🟢', tags='nodejs,express,mongodb,redis,microservices', is_featured=0 WHERE id='nodejs';
UPDATE roadmaps SET description='Master React ecosystem: hooks, state management, testing, and performance.', category='Web Dev', difficulty='Intermediate', duration='12 weeks', xp_reward=1900, lesson_count=36, icon='⚛️', tags='react,redux,typescript,testing,nextjs', is_featured=0 WHERE id='react';
UPDATE roadmaps SET description='Develop decentralized applications with Solidity, Web3, and smart contracts.', category='Blockchain', difficulty='Advanced', duration='16 weeks', xp_reward=2800, lesson_count=44, icon='⛓️', tags='solidity,ethereum,web3,defi,nft', is_featured=0 WHERE id='blockchain';

-- ── Seed Tests (Quizzes) ─────────────────────────────────────
INSERT IGNORE INTO tests (id, lesson_id, course_id, title, difficulty, type) VALUES
(1, NULL, NULL, 'DSA Fundamentals', 'Easy', 'MCQ'),
(2, NULL, NULL, 'Python Basics', 'Easy', 'MCQ'),
(3, NULL, NULL, 'JavaScript Essentials', 'Intermediate', 'MCQ'),
(4, NULL, NULL, 'System Design Concepts', 'Hard', 'MCQ'),
(5, NULL, NULL, 'Database & SQL Mastery', 'Intermediate', 'MCQ'),
(6, NULL, NULL, 'Operating Systems', 'Intermediate', 'MCQ'),
(7, NULL, NULL, 'Computer Networks', 'Intermediate', 'MCQ'),
(8, NULL, NULL, 'OOP & Design Patterns', 'Intermediate', 'MCQ'),
(9, NULL, NULL, 'Machine Learning Basics', 'Hard', 'MCQ'),
(10, NULL, NULL, 'Web Development HTML/CSS', 'Easy', 'MCQ');

-- ── Seed Questions ────────────────────────────────────────────
INSERT IGNORE INTO questions (id, test_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
(1,1,'What is the time complexity of binary search?','O(n)','O(log n)','O(n²)','O(1)','B'),
(2,1,'Which data structure uses LIFO order?','Queue','Stack','Array','LinkedList','B'),
(3,1,'What is the height of a balanced BST with n nodes?','O(n)','O(n²)','O(log n)','O(1)','C'),
(4,1,'Which sorting algorithm has the best average time complexity?','Bubble Sort','Selection Sort','Merge Sort','Insertion Sort','C'),
(5,1,'What is a spanning tree of a graph?','A tree connecting all vertices with minimum edges','A tree with maximum edges','A tree with cycles','None of the above','A'),
(6,1,'Dijkstra algorithm is used for?','Minimum spanning tree','Shortest path','Topological sort','Cycle detection','B'),
(7,1,'What is the space complexity of recursive Fibonacci?','O(1)','O(n)','O(n²)','O(log n)','B'),
(8,1,'What does DFS stand for?','Data First Search','Depth First Search','Dynamic First Search','Direct First Search','B'),
(9,1,'Which data structure is used in BFS?','Stack','Tree','Queue','Graph','C'),
(10,1,'What is dynamic programming primarily based on?','Greedy approach','Divide and conquer','Optimal substructure and overlapping subproblems','Recursion only','C'),
(11,1,'What is the worst-case complexity of QuickSort?','O(n log n)','O(n)','O(n²)','O(log n)','C'),
(12,1,'What is a hash collision?','When two keys map to the same index','When hash table is full','When a key is deleted','None of the above','A'),
(13,1,'What is a Min-Heap?','A tree where parent >= children','A tree where parent <= children','A balanced BST','A complete graph','B'),
(14,1,'What is topological sort used for?','Undirected graphs','Directed acyclic graphs','Trees only','Connected components','B'),
(15,1,'What is memoization?','Storing results of expensive computations','Sorting an array','Searching efficiently','Graph traversal','A'),
(16,2,'What is a Python list comprehension?','A way to create lists concisely','A loop structure','An import statement','A class method','A'),
(17,2,'What keyword is used to define a function in Python?','function','def','fn','func','B'),
(18,2,'What is the output of len(["a","b","c"])?','2','3','4','Error','B'),
(19,2,'What does PEP 8 define?','Python performance metrics','Python code style guide','Python package manager','Python build system','B'),
(20,2,'What is a Python decorator?','A function that modifies another function','A design pattern','A class method','A module','A'),
(21,2,'What is the difference between list and tuple?','Lists are immutable, tuples are mutable','Tuples are immutable, lists are mutable','No difference','Tuples do not support indexing','B'),
(22,2,'What is GIL in Python?','Global Import Library','Global Interpreter Lock','General Input Language','None of the above','B'),
(23,2,'What does the yield keyword do?','Returns a value and ends function','Pauses function and returns a generator','Imports a module','Creates a class','B'),
(24,2,'Which Python library is used for data manipulation?','NumPy','Flask','Django','Requests','A'),
(25,2,'What is __init__ in Python?','A global function','A class constructor method','A module initializer','A loop','B'),
(26,2,'What is the use of *args in a function?','Accept keyword arguments','Accept variable positional arguments','Define default arguments','None','B'),
(27,2,'What is a virtual environment in Python?','A cloud server','An isolated Python environment','A package manager','A testing tool','B'),
(28,2,'What does isinstance() do?','Creates an instance','Checks if an object is an instance of a class','Deletes an object','Imports a class','B'),
(29,2,'What is the output of 3//2 in Python?','1.5','1','2','Error','B'),
(30,2,'What is a lambda function?','A named function','A module','An anonymous function','A class','C'),
(31,3,'What is the difference between let and var?','No difference','let is block-scoped, var is function-scoped','var is block-scoped','let is global','B'),
(32,3,'What does === check in JavaScript?','Only value equality','Only type equality','Both value and type equality','Neither','C'),
(33,3,'What is a Promise in JavaScript?','A function','An object representing a future value','A variable type','A class','B'),
(34,3,'What is event bubbling?','Events bubble from child to parent','Events bubble from parent to child','Events cancel themselves','None','A'),
(35,3,'What does JSON.parse() do?','Converts object to JSON string','Converts JSON string to object','Fetches data from API','None','B'),
(36,3,'What is the use of async/await?','Synchronous code execution','Asynchronous code in synchronous style','Import modules','None','B'),
(37,3,'What is the prototype chain?','An inheritance mechanism','A design pattern','A loop structure','A sorting algorithm','A'),
(38,3,'What does Array.map() return?','The original array','A new array with transformed elements','Nothing','An object','B'),
(39,3,'What is closure in JavaScript?','A function with no parameters','A function that remembers its outer scope','A way to import modules','None','B'),
(40,3,'What is the DOM?','Document Object Model','Data Object Manager','Dynamic Object Method','None','A'),
(41,3,'What is localStorage?','A database','Client-side key-value storage','Server-side storage','A cookie','B'),
(42,3,'What does the spread operator (...) do?','Creates a function','Expands an array or object','Imports modules','Declares variables','B'),
(43,3,'What is a JavaScript module?','A function','A self-contained unit of code','A class','An HTML file','B'),
(44,3,'What is null vs undefined in JS?','Both are the same','null is intentionally empty, undefined means not assigned','undefined is intentionally empty','None','B'),
(45,3,'What is the use of setTimeout()?','Executes code after a delay','Loops code infinitely','Synchronizes code','None','A'),
(46,4,'What is horizontal scaling?','Adding more CPU to a server','Adding more servers','Reducing server resources','Upgrading OS','B'),
(47,4,'What is a CDN?','Content Delivery Network','Central Data Node','Cloud DNS','None','A'),
(48,4,'What is a load balancer?','A database','Distributes network traffic across servers','A caching layer','A DNS server','B'),
(49,4,'What is eventual consistency?','Data is always consistent','Data becomes consistent over time','Data is never consistent','A CAP theorem concept only','B'),
(50,4,'What is a microservice?','A monolithic application','A small independent service','A frontend component','A database','B'),
(51,4,'What does CAP theorem state?','All 3 guaranteed','Only 2 of 3 can be guaranteed','Only applies to SQL databases','None','B'),
(52,4,'What is rate limiting?','Slowing down a server','Restricting number of requests from a client','A caching strategy','A load balancing technique','B'),
(53,4,'What is a message queue?','A data structure','Asynchronous communication between services','A web socket','A database index','B'),
(54,4,'What is database sharding?','Backing up a database','Partitioning database across multiple servers','Indexing a database','Replicating a database','B'),
(55,4,'What is a reverse proxy?','A forward proxy','A server that forwards client requests to backends','A DNS server','A CDN','B'),
(56,5,'What does SELECT * do?','Selects specific columns','Selects all columns from a table','Deletes a table','Inserts data','B'),
(57,5,'What is a PRIMARY KEY?','A key that can be NULL','A unique identifier for a row','A foreign key','An index','B'),
(58,5,'What is a JOIN in SQL?','Deletes tables','Combines rows from two or more tables','Creates an index','Modifies a table','B'),
(59,5,'What is the difference between WHERE and HAVING?','No difference','WHERE filters rows, HAVING filters groups','HAVING filters rows, WHERE filters groups','None','B'),
(60,5,'What is an index in SQL?','A backup','A data structure that speeds up queries','A constraint','A stored procedure','B'),
(61,5,'What is normalization?','Adding more data','Organizing data to reduce redundancy','Backing up data','Encrypting data','B'),
(62,5,'What does GROUP BY do?','Sorts data','Groups rows with the same values','Joins tables','Filters data','B'),
(63,5,'What is a stored procedure?','A view','Precompiled SQL code saved in the database','A trigger','An index','B'),
(64,5,'What is ACID in databases?','Atomicity, Consistency, Isolation, Durability','A type of join','A normalization form','None','A'),
(65,5,'What is a foreign key?','A primary key','A key that references a primary key in another table','An index','A constraint only','B'),
(66,6,'What is a deadlock?','A programming error','Two processes waiting indefinitely for each other','A race condition','A memory leak','B'),
(67,6,'What is virtual memory?','Physical RAM','Disk space used as RAM extension','Cache memory','ROM','B'),
(68,6,'What is context switching?','Switching between applications','Saving and restoring the state of a CPU process','Changing user interfaces','None','B'),
(69,6,'What is a semaphore?','A data structure','A synchronization primitive used to control access','A type of lock','A scheduling algorithm','B'),
(70,6,'What is paging in OS?','A memory management technique dividing memory into fixed-size blocks','File system management','Process scheduling','I/O management','A'),
(71,7,'What is the OSI model?','A 7-layer network architecture model','A database model','A programming model','An OS model','A'),
(72,7,'What is TCP vs UDP?','No difference','TCP is reliable, UDP is faster but unreliable','UDP is reliable, TCP is faster','Both are connectionless','B'),
(73,7,'What is DNS?','Distributed Network System','Domain Name System that translates domains to IPs','A protocol','A firewall','B'),
(74,7,'What is HTTP vs HTTPS?','No difference','HTTPS is HTTP with SSL/TLS encryption','HTTP is more secure','Both use the same port','B'),
(75,7,'What is an IP address?','A unique identifier for a device on a network','A website URL','A domain name','A MAC address','A'),
(76,8,'What is inheritance in OOP?','A function calling itself','A class deriving properties from another class','A design pattern','An interface','B'),
(77,8,'What is polymorphism?','One interface, multiple implementations','A type of inheritance','A design pattern','None','A'),
(78,8,'What is encapsulation in OOP?','Hiding data within a class','A type of inheritance','A design pattern','A module','A'),
(79,8,'What is the Singleton pattern?','Creates multiple instances','Ensures only one instance of a class exists','A UI pattern','None','B'),
(80,8,'What is the Observer pattern?','Creates object clones','A subscription mechanism where objects notify observers','A structural pattern','None','B'),
(81,9,'What is supervised learning?','Learning without labels','Learning with labeled training data','Reinforcement learning','Transfer learning','B'),
(82,9,'What is overfitting?','Model performs poorly on training data','Model performs well on training but poorly on test data','Model learns nothing','None','B'),
(83,9,'What is gradient descent?','An optimization algorithm that minimizes loss function','A type of neural network','A data preprocessing step','None','A'),
(84,9,'What is a neural network?','A graph database','A series of interconnected layers of neurons for learning','A type of regression','None','B'),
(85,9,'What is regularization in ML?','Adding more data','Technique to prevent overfitting by penalizing complexity','A type of optimizer','None','B'),
(86,10,'What does HTML stand for?','Hyper Text Markup Language','High Text Machine Language','Hyper Tool Markup Language','None','A'),
(87,10,'What is the purpose of CSS?','Add interactivity','Style and layout of HTML elements','Server-side scripting','Database management','B'),
(88,10,'What is a semantic HTML element?','An element with no meaning','An element that describes its content meaning','A self-closing tag','A block element','B'),
(89,10,'What is the box model in CSS?','A 3D layout technique','Content, padding, border, margin model','A Flexbox concept','None','B'),
(90,10,'What is Flexbox?','A CSS layout model for one-dimensional layouts','A CSS animation','A JavaScript library','None','A');

-- ── Seed Videos ────────────────────────────────────────────────
INSERT IGNORE INTO videos (id, title, description, youtube_url, video_id, embed_url, thumbnail, category, tags, instructor, duration, branch, pinned, status) VALUES
(1,'JavaScript Full Course 2024','Complete JavaScript from zero to hero with modern ES6+ features','https://www.youtube.com/watch?v=PkZNo7MFNFg','PkZNo7MFNFg','https://www.youtube.com/embed/PkZNo7MFNFg','https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg','JavaScript','javascript,web-dev,es6','freeCodeCamp','1h 53m','Web Dev',1,'active'),
(2,'Python for Beginners','Learn Python programming from scratch with hands-on projects','https://www.youtube.com/watch?v=rfscVS0vtbw','rfscVS0vtbw','https://www.youtube.com/embed/rfscVS0vtbw','https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg','Python','python,beginner,programming','freeCodeCamp','4h 21m','Programming',1,'active'),
(3,'Data Structures and Algorithms','Master DSA concepts with animations and problem solving','https://www.youtube.com/watch?v=pkYVOmU3MgA','pkYVOmU3MgA','https://www.youtube.com/embed/pkYVOmU3MgA','https://img.youtube.com/vi/pkYVOmU3MgA/hqdefault.jpg','DSA','dsa,algorithms,data-structures','mycodeschool','8h 12m','Programming',1,'active'),
(4,'React JS Tutorial','Build modern React apps with hooks, context, and best practices','https://www.youtube.com/watch?v=w7ejDZ8SWv8','w7ejDZ8SWv8','https://www.youtube.com/embed/w7ejDZ8SWv8','https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg','React','react,frontend,javascript','Traversy Media','3h 28m','Web Dev',0,'active'),
(5,'Machine Learning Course','Comprehensive ML course covering regression to deep learning','https://www.youtube.com/watch?v=NWONeJKn6kc','NWONeJKn6kc','https://www.youtube.com/embed/NWONeJKn6kc','https://img.youtube.com/vi/NWONeJKn6kc/hqdefault.jpg','Machine Learning','ml,python,ai,deep-learning','Sentdex','12h 30m','AI/ML',0,'active'),
(6,'Node.js Crash Course','Build REST APIs with Node.js and Express framework','https://www.youtube.com/watch?v=fBNz5xF-Kx4','fBNz5xF-Kx4','https://www.youtube.com/embed/fBNz5xF-Kx4','https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg','Node.js','nodejs,express,backend','Traversy Media','2h 18m','Web Dev',0,'active'),
(7,'Docker Tutorial 2024','Master Docker containers and containerized application development','https://www.youtube.com/watch?v=3c-iBn73dDE','3c-iBn73dDE','https://www.youtube.com/embed/3c-iBn73dDE','https://img.youtube.com/vi/3c-iBn73dDE/hqdefault.jpg','DevOps','docker,containers,devops','TechWorld with Nana','3h 45m','DevOps',0,'active'),
(8,'SQL Full Course','Master SQL queries, joins, optimization, and database design','https://www.youtube.com/watch?v=HXV3zeQKqGY','HXV3zeQKqGY','https://www.youtube.com/embed/HXV3zeQKqGY','https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg','Database','sql,database,mysql','freeCodeCamp','4h 20m','Data',0,'active'),
(9,'System Design Primer','Learn how to design scalable distributed systems','https://www.youtube.com/watch?v=xpDnVSmNFX0','xpDnVSmNFX0','https://www.youtube.com/embed/xpDnVSmNFX0','https://img.youtube.com/vi/xpDnVSmNFX0/hqdefault.jpg','System Design','system-design,architecture,scalability','Gaurav Sen','2h 10m','Architecture',1,'active'),
(10,'Git and GitHub Complete Guide','Master version control with Git and collaboration with GitHub','https://www.youtube.com/watch?v=RGOj5yH7evk','RGOj5yH7evk','https://www.youtube.com/embed/RGOj5yH7evk','https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg','Tools','git,github,version-control','freeCodeCamp','1h 24m','General',0,'active'),
(11,'TypeScript Full Course','Learn TypeScript and type-safe JavaScript development','https://www.youtube.com/watch?v=30LWjhZzg50','30LWjhZzg50','https://www.youtube.com/embed/30LWjhZzg50','https://img.youtube.com/vi/30LWjhZzg50/hqdefault.jpg','TypeScript','typescript,javascript,web','Academind','3h 15m','Web Dev',0,'active'),
(12,'Kubernetes Tutorial','Container orchestration with Kubernetes for production','https://www.youtube.com/watch?v=X48VuDVv0do','X48VuDVv0do','https://www.youtube.com/embed/X48VuDVv0do','https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg','DevOps','kubernetes,k8s,containers','TechWorld with Nana','3h 26m','DevOps',0,'active');

-- ── Update tools as featured/pinned (top 10 by rating) ───────
UPDATE tools t1 JOIN (SELECT id FROM tools ORDER BY rating DESC LIMIT 10) t2 ON t1.id = t2.id SET t1.featured=1, t1.pinned=1;

-- ── Seed language_templates ───────────────────────────────────
INSERT INTO language_templates (language, template_name, template_code, description) VALUES
('python','Hello World','print("Hello, World!")\n','Simple Python hello world'),
('python','Two Sum','def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n\nprint(two_sum([2,7,11,15], 9))\n','Two Sum algorithm'),
('javascript','Hello World','console.log("Hello, World!");\n','Simple JS hello world'),
('javascript','Array Methods','const nums = [1,2,3,4,5];\nconsole.log(nums.map(n=>n*2));\nconsole.log(nums.filter(n=>n%2===0));\nconsole.log(nums.reduce((a,b)=>a+b,0));\n','Array map/filter/reduce'),
('cpp','Hello World','#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n','C++ hello world'),
('java','Hello World','public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n','Java hello world'),
('python','Fibonacci','def fib(n):\n    a,b=0,1\n    for _ in range(n):\n        print(a,end=" ")\n        a,b=b,a+b\nfib(10)\n','Fibonacci sequence'),
('python','Binary Search','def binary_search(arr,t):\n    l,r=0,len(arr)-1\n    while l<=r:\n        m=(l+r)//2\n        if arr[m]==t: return m\n        elif arr[m]<t: l=m+1\n        else: r=m-1\n    return -1\nprint(binary_search([1,3,5,7,9],7))\n','Binary search')
ON DUPLICATE KEY UPDATE template_name=VALUES(template_name), description=VALUES(description);

-- ── Seed Notifications (per existing users) ───────────────────
INSERT IGNORE INTO notifications (user_id, message, is_read, created_at)
SELECT u.id, '🎉 Welcome to EduNet 2.0! The platform has been completely rebuilt with 24 roadmaps, 100+ AI tools, and 500+ quiz questions!', 0, NOW()
FROM users u WHERE u.id NOT IN (SELECT user_id FROM notifications WHERE message LIKE '%Welcome to EduNet%');

INSERT IGNORE INTO notifications (user_id, message, is_read, created_at)
SELECT u.id, '🧠 Quiz Center Launched! Test your knowledge across DSA, Python, JavaScript, System Design, SQL, and more.', 0, NOW()
FROM users u;

INSERT IGNORE INTO notifications (user_id, message, is_read, created_at)
SELECT u.id, '🤖 AI Tools Directory: Browse 100+ curated AI tools for coding, design, writing, and productivity.', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)
FROM users u;

INSERT IGNORE INTO notifications (user_id, message, is_read, created_at)
SELECT u.id, '🏆 Leaderboard is LIVE! Earn XP by completing roadmaps, passing quizzes, and using the coding lab.', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)
FROM users u;

-- ── Seed Certificates for existing users ─────────────────────
INSERT IGNORE INTO certificates (user_id, course_id, roadmap_id, certificate_hash, issue_date, title)
SELECT u.id, NULL, NULL, CONCAT('EN-', UPPER(SUBSTRING(MD5(CONCAT(u.id, 'pioneer')), 1, 10))), NOW(), 'EduNet Platform Pioneer'
FROM users u;
