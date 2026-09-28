import json
from sqlalchemy.orm import Session
from app.models.all_models import User, StudentProfile, Skill, Question, Career
from app.auth.security import get_password_hash

SKILLS_DATA = [
    {"name": "Mathematics", "category": "Analytical"},
    {"name": "Logical Reasoning", "category": "Analytical"},
    {"name": "Programming", "category": "Technical"},
    {"name": "Communication", "category": "Soft"},
    {"name": "Writing", "category": "Soft"},
    {"name": "Creativity", "category": "Creative"},
    {"name": "Problem Solving", "category": "Analytical"},
    {"name": "Leadership", "category": "Soft"},
    {"name": "Teamwork", "category": "Soft"},
    {"name": "Analytical Thinking", "category": "Analytical"},
    {"name": "Research", "category": "Analytical"},
    {"name": "Time Management", "category": "Soft"},
    {"name": "Presentation", "category": "Soft"},
    {"name": "Data Analysis", "category": "Technical"},
    {"name": "Design", "category": "Creative"},
]

QUESTIONS_DATA = [
    # Category A: Interests (Q1 to Q4)
    {
        "category": "Interests",
        "question_text": "Which type of activity do you enjoy most?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Solving logical problems",
            "Creating websites/apps",
            "Designing visual content",
            "Working with numbers/business",
            "Helping and communicating with people",
            "Conducting scientific experiments",
            "Writing and researching",
            "Organizing and managing activities"
        ]),
        "weight": 1.2,
        "order_index": 1
    },
    {
        "category": "Interests",
        "question_text": "Which subjects do you naturally enjoy the most?",
        "question_type": "multi_choice",
        "options": json.dumps([
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science",
            "Economics",
            "Business Studies",
            "Accountancy",
            "English/Languages",
            "Psychology",
            "History/Political Science",
            "Art/Design"
        ]),
        "weight": 1.1,
        "order_index": 2
    },
    {
        "category": "Interests",
        "question_text": "What kind of problem would you enjoy solving most?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Technical problems",
            "Business problems",
            "Social problems",
            "Scientific problems",
            "Creative problems",
            "Financial problems",
            "Environmental problems"
        ]),
        "weight": 1.2,
        "order_index": 3
    },
    {
        "category": "Interests",
        "question_text": "Which activity would you prefer during your free time?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Building something new",
            "Learning new technology",
            "Reading/researching topics",
            "Creating designs/videos",
            "Managing a project or team",
            "Helping others or volunteering",
            "Analyzing data and statistics",
            "Starting or brainstorming a business"
        ]),
        "weight": 1.0,
        "order_index": 4
    },

    # Category B: Skills Assessment (Q5 to Q19: 15 rating questions)
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Mathematics (numbers, formulas, algebra, quantitative concepts)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Mathematics", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 5
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Logical Reasoning & Deductive Thinking",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Logical Reasoning", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 6
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Programming & Writing Code (Python, C++, JS, or general coding)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Programming", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 7
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Communication (explaining ideas clearly, interpersonal speech)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Communication", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 8
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Written Expression & Technical/Creative Writing",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Writing", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 9
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Creativity & Innovation (coming up with unique visual or conceptual ideas)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Creativity", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 10
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Problem Solving (deconstructing complex challenges systematically)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Problem Solving", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 11
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Leadership & Initiative (guiding groups, taking ownership)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Leadership", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 12
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Teamwork & Collaboration with peers",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Teamwork", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 13
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Analytical Thinking (interpreting patterns, drawing conclusions)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Analytical Thinking", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 14
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Research & Deep Investigation (finding reliable information)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Research", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 15
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Time Management & Prioritization",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Time Management", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 16
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Presentation & Public Speaking",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Presentation", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 17
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in Data Analysis (tables, charts, statistics, spreadsheet modeling)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Data Analysis", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 18
    },
    {
        "category": "Skills",
        "question_text": "Rate your skill level in UI/Visual Design (layout, typography, aesthetics)",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "skill_key": "Design", "labels": ["Beginner", "Basic", "Intermediate", "Good", "Excellent"]}),
        "weight": 1.0,
        "order_index": 19
    },

    # Category C: Personality / Work Preferences (Q20 to Q24)
    {
        "category": "Work Preferences",
        "question_text": "When solving a difficult problem, what approach do you naturally prefer?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Analyze it step by step using facts and logic",
            "Discuss it with others to brainstorm collectively",
            "Try creative out-of-the-box solutions",
            "Research extensively before deciding"
        ]),
        "weight": 1.0,
        "order_index": 20
    },
    {
        "category": "Work Preferences",
        "question_text": "Which work environment sounds most appealing and engaging to you?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Working independently with focused autonomy",
            "Working collaboratively in an agile team",
            "Leading and mentoring a team of professionals",
            "Working directly with clients and customers",
            "Working in a laboratory or scientific research facility",
            "Working remotely with digital flexibility",
            "Working in a creative studio / agency environment"
        ]),
        "weight": 1.1,
        "order_index": 21
    },
    {
        "category": "Work Preferences",
        "question_text": "Which statement describes your personal motivation best?",
        "question_type": "single_choice",
        "options": json.dumps([
            "I enjoy analyzing complex information and finding truth",
            "I enjoy creating and building tangible things",
            "I enjoy helping people and making a positive community impact",
            "I enjoy leading others and driving strategic outcomes",
            "I enjoy discovering new ideas and exploring unknown frontiers",
            "I enjoy organizing systems and ensuring flawless execution"
        ]),
        "weight": 1.1,
        "order_index": 22
    },
    {
        "category": "Work Preferences",
        "question_text": "How comfortable are you with rapidly adopting and learning new technologies?",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "labels": ["Uncomfortable", "Slightly hesitant", "Moderate", "Comfortable", "Extremely enthusiastic"]}),
        "weight": 1.0,
        "order_index": 23
    },
    {
        "category": "Work Preferences",
        "question_text": "How comfortable are you with public speaking, pitching, and presenting to groups?",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "labels": ["Very nervous", "Somewhat hesitant", "Neutral", "Comfortable", "Thrive under spotlight"]}),
        "weight": 1.0,
        "order_index": 24
    },

    # Category D: Academic Profile (Q25)
    {
        "category": "Academic Profile",
        "question_text": "Which subject area has consistently been your strongest academic performer?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Mathematics & Quantitative Reasoning",
            "Computer Science & Information Technology",
            "Physical/Biological Sciences",
            "Economics, Commerce & Accountancy",
            "Languages, Literature & Humanities",
            "Arts, Visual Media & Design",
            "Balanced across all subjects"
        ]),
        "weight": 1.0,
        "order_index": 25
    },

    # Category E: Career Goals (Q26 to Q29)
    {
        "category": "Career Goals",
        "question_text": "What is your primary long-term career ambition?",
        "question_type": "single_choice",
        "options": json.dumps([
            "High technical expertise & engineering mastery",
            "Leadership, management & executive authority",
            "Creative expression & innovative design",
            "Academic research, discovery & publishing",
            "Entrepreneurship & building scalable companies",
            "Social impact & improving people's lives",
            "High financial growth & wealth generation",
            "Stable, prestigious professional career",
            "Still exploring and open-minded"
        ]),
        "weight": 1.2,
        "order_index": 26
    },
    {
        "category": "Career Goals",
        "question_text": "Which industry domain attracts you most?",
        "question_type": "single_choice",
        "options": json.dumps([
            "Technology & Software",
            "Data Science & AI",
            "Business & Corporate Strategy",
            "Finance & Banking",
            "Healthcare & Medicine",
            "Design, UI/UX & Media",
            "Education & Training",
            "Scientific Research",
            "Environment & Sustainability"
        ]),
        "weight": 1.2,
        "order_index": 27
    },
    {
        "category": "Career Goals",
        "question_text": "How important is flexible work arrangement (remote work, flexible hours) to you?",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "labels": ["Not important", "Slight preference", "Moderate", "Very important", "Essential requirement"]}),
        "weight": 0.8,
        "order_index": 28
    },
    {
        "category": "Career Goals",
        "question_text": "How interested are you in starting your own business or startup venture in the future?",
        "question_type": "rating",
        "options": json.dumps({"min": 1, "max": 5, "labels": ["No interest", "Low interest", "Moderate interest", "High interest", "Top life goal"]}),
        "weight": 1.0,
        "order_index": 29
    }
]

CAREERS_DATA = [
    {
        "name": "Software Developer",
        "category": "Technology",
        "description": "Design, build, test, and maintain robust software applications and systems. Software developers solve complex technical problems and turn logic into functional products used by millions.",
        "education": "Bachelor's in Computer Science, Software Engineering, BCA/MCA, or relevant bootcamps/certifications.",
        "skills": ["Programming", "Problem Solving", "Logical Reasoning", "Teamwork"],
        "beginner_skills": ["Python or JavaScript", "Git & GitHub", "Data Structures Basics", "HTML/CSS"],
        "advanced_skills": ["System Design", "Cloud Deployment (AWS/Docker)", "Microservices Architecture", "Database Optimization"],
        "interests": ["Creating websites/apps", "Solving logical problems", "Technology & Software", "Building something new"],
        "work_style": ["remotely", "agile team", "independently"],
        "roadmap": [
            {"step": 1, "title": "Programming Fundamentals", "description": "Master a core language (Python, Java, or JavaScript) and foundational programming concepts."},
            {"step": 2, "title": "Data Structures & Algorithms", "description": "Learn arrays, hash maps, trees, graphs, sorting, and algorithmic complexity (Big O)."},
            {"step": 3, "title": "Version Control & Git", "description": "Understand branching, pull requests, merge conflict resolution, and collaborative GitHub workflows."},
            {"step": 4, "title": "Full-Stack or Systems Project", "description": "Build and deploy 2-3 full-stack applications with frontend, backend REST APIs, and database integration."},
            {"step": 5, "title": "DevOps & Cloud Basics", "description": "Learn Docker containerization, CI/CD automated pipelines, and cloud hosting on AWS/GCP/Vercel."},
            {"step": 6, "title": "Internship & Portfolio Building", "description": "Contribute to open-source, complete an engineering internship, and prepare for coding interviews."}
        ],
        "related_courses": [
            {"name": "CS50: Introduction to Computer Science", "platform": "Harvard / edX", "level": "Beginner"},
            {"name": "The Complete Full-Stack Web Development Bootcamp", "platform": "Coursera / Udemy", "level": "Intermediate"},
            {"name": "System Design for Software Engineers", "platform": "Educative", "level": "Advanced"}
        ],
        "related_job_roles": ["Frontend Engineer", "Backend Engineer", "Full-Stack Developer", "Mobile App Developer"],
        "responsibilities": [
            "Write clean, maintainable, and efficient code adhering to software design patterns",
            "Collaborate with product managers and designers to implement user-facing features",
            "Debug issues, write unit tests, and review peer code pull requests",
            "Monitor application performance and refactor legacy codebases"
        ]
    },
    {
        "name": "Data Analyst",
        "category": "Technology",
        "description": "Transform raw numbers and business metrics into clear, actionable insights. Data analysts build interactive dashboards, discover underlying trends, and empower executives to make evidence-based decisions.",
        "education": "Degree in Statistics, Mathematics, Computer Science, Economics, Business Analytics, or related quantitative field.",
        "skills": ["Data Analysis", "Mathematics", "Analytical Thinking", "Presentation"],
        "beginner_skills": ["Advanced Excel (VLOOKUP, Pivot Tables)", "SQL Foundations", "Basic Statistics", "Tableau/Power BI"],
        "advanced_skills": ["Python for Data Analysis (Pandas, NumPy)", "A/B Testing", "Data Warehousing (Snowflake/BigQuery)", "Executive Storytelling"],
        "interests": ["Analyzing data and statistics", "Working with numbers/business", "Data Science & AI", "Solving logical problems"],
        "work_style": ["remotely", "independently", "agile team"],
        "roadmap": [
            {"step": 1, "title": "Spreadsheets & Numerical Analysis", "description": "Master Excel/Sheets formulas, statistical summaries, pivot tables, and conditional logic."},
            {"step": 2, "title": "Relational Databases & SQL", "description": "Write advanced SQL queries using JOINs, CTEs, Window Functions, and GROUP BY operations."},
            {"step": 3, "title": "Business Intelligence (BI) Tools", "description": "Build interactive, executive-ready dashboards in Tableau or Microsoft Power BI."},
            {"step": 4, "title": "Python for Data Analysis", "description": "Use Pandas and NumPy for automated data cleaning, aggregation, and Matplotlib/Seaborn for visualization."},
            {"step": 5, "title": "End-to-End Analytics Case Study", "description": "Analyze an industry dataset (e.g. e-commerce, healthcare) and present strategic recommendations."},
            {"step": 6, "title": "Junior Data Analyst Placement", "description": "Interview for entry-level analyst roles and demonstrate data storytelling skills."}
        ],
        "related_courses": [
            {"name": "Google Data Analytics Professional Certificate", "platform": "Coursera", "level": "Beginner"},
            {"name": "SQL for Data Science", "platform": "UC Davis / Coursera", "level": "Intermediate"},
            {"name": "Data Storytelling and Dashboard Design", "platform": "LinkedIn Learning", "level": "Intermediate"}
        ],
        "related_job_roles": ["Business Intelligence Analyst", "Marketing Data Analyst", "Operations Analyst", "Healthcare Analytics Specialist"],
        "responsibilities": [
            "Extract and clean data from diverse transactional databases and APIs",
            "Develop automated KPI reporting dashboards for department leaders",
            "Identify seasonal anomalies, customer churn patterns, and revenue opportunities",
            "Present statistical findings in non-technical terms to stakeholders"
        ]
    },
    {
        "name": "Data Scientist",
        "category": "Technology",
        "description": "Combine mathematics, statistical modeling, programming, and domain knowledge to build predictive machine learning models, unearth hidden correlations, and solve ambiguous data-driven problems.",
        "education": "Master's or Bachelor's in Data Science, Computer Science, Statistics, Mathematics, or Physics.",
        "skills": ["Data Analysis", "Programming", "Analytical Thinking", "Research", "Mathematics"],
        "beginner_skills": ["Python & Scientific Libraries (NumPy, SciPy)", "Multivariate Calculus & Linear Algebra", "Probability & Hypothesis Testing", "SQL"],
        "advanced_skills": ["Machine Learning Algorithms (Regression, Trees, Clustering)", "Feature Engineering", "Scikit-Learn & XGBoost", "Model Evaluation & Drift"],
        "interests": ["Analyzing data and statistics", "Scientific problems", "Solving logical problems", "Data Science & AI"],
        "work_style": ["independently", "remotely", "agile team"],
        "roadmap": [
            {"step": 1, "title": "Mathematical Foundations", "description": "Master Linear Algebra (matrices, eigenvalues), Multivariable Calculus, and Probability distributions."},
            {"step": 2, "title": "Python & Data Wrangling", "description": "Proficiency in NumPy, Pandas, Scipy, and exploratory data analysis (EDA)."},
            {"step": 3, "title": "Statistical Inference & Modeling", "description": "Perform hypothesis testing, ANOVA, confidence intervals, and regression modeling."},
            {"step": 4, "title": "Machine Learning Foundations", "description": "Train and evaluate supervised and unsupervised learning algorithms with Scikit-Learn."},
            {"step": 5, "title": "Machine Learning Projects", "description": "Compete on Kaggle, publish reproducible notebooks, and deploy ML models using FastAPI/Streamlit."},
            {"step": 6, "title": "Industry Data Science Role", "description": "Join an enterprise analytics or product ML team as an associate data scientist."}
        ],
        "related_courses": [
            {"name": "Machine Learning Specialization", "platform": "DeepLearning.AI / Stanford", "level": "Intermediate"},
            {"name": "Applied Data Science with Python", "platform": "University of Michigan", "level": "Intermediate"},
            {"name": "Mathematics for Machine Learning", "platform": "Imperial College London", "level": "Beginner to Intermediate"}
        ],
        "related_job_roles": ["Predictive Modeler", "Decision Scientist", "Quantitative Researcher", "ML Analyst"],
        "responsibilities": [
            "Formulate business questions into mathematically tractable data science hypotheses",
            "Perform rigorous feature engineering on unstructured and structured data",
            "Train, tune, cross-validate, and deploy predictive machine learning models",
            "Run randomized controlled experiments (A/B testing) to measure impact"
        ]
    },
    {
        "name": "AI/ML Engineer",
        "category": "Technology",
        "description": "Design, architect, and optimize cutting-edge Artificial Intelligence systems, Deep Neural Networks, Natural Language Processing models, and Computer Vision pipelines for production scale.",
        "education": "Degree in Computer Science, Artificial Intelligence, Robotics, or Electrical Engineering.",
        "skills": ["Programming", "Mathematics", "Logical Reasoning", "Analytical Thinking", "Problem Solving"],
        "beginner_skills": ["Python OOP", "Calculus & Linear Algebra", "PyTorch Basics", "Git"],
        "advanced_skills": ["Deep Learning (CNNs, Transformers, LLMs)", "MLOps (MLflow, Kubeflow)", "TensorRT & Model Quantization", "GPU Compute Optimization"],
        "interests": ["Technology & Software", "Data Science & AI", "Solving logical problems", "Building something new"],
        "work_style": ["agile team", "remotely", "independently"],
        "roadmap": [
            {"step": 1, "title": "Advanced Python & C++", "description": "Learn object-oriented programming, memory management, and high-performance computation."},
            {"step": 2, "title": "Deep Learning Fundamentals", "description": "Understand backpropagation, gradient descent, activation functions, and neural network architectures."},
            {"step": 3, "title": "Deep Learning Frameworks (PyTorch)", "description": "Build neural networks, train image classifiers, and implement sequence models."},
            {"step": 4, "title": "Generative AI & LLMs", "description": "Fine-tune transformer models, implement RAG (Retrieval-Augmented Generation), and use vector databases."},
            {"step": 5, "title": "Production MLOps", "description": "Containerize models with Docker, configure CI/CD pipelines, monitor latency and model drift."},
            {"step": 6, "title": "AI Engineering Career Launch", "description": "Deploy state-of-the-art AI applications to cloud infrastructure and secure an AI Engineer position."}
        ],
        "related_courses": [
            {"name": "Deep Learning Specialization", "platform": "DeepLearning.AI", "level": "Intermediate"},
            {"name": "Natural Language Processing Specialization", "platform": "Coursera", "level": "Advanced"},
            {"name": "Full Stack LLM BootCamp", "platform": "FullStackDeepLearning", "level": "Advanced"}
        ],
        "related_job_roles": ["Machine Learning Engineer", "Computer Vision Specialist", "NLP Engineer", "LLM Application Architect"],
        "responsibilities": [
            "Research, implement, and benchmark state-of-the-art deep learning architectures",
            "Scale model inference on GPU clusters to ensure sub-100ms latency",
            "Build automated data pipelines for data labeling, augmentation, and model training",
            "Integrate generative AI APIs and fine-tuned models into consumer products"
        ]
    },
    {
        "name": "Cybersecurity Analyst",
        "category": "Technology",
        "description": "Protect critical digital infrastructure, networks, and confidential information from cyber threats, unauthorized intrusion, ransomware attacks, and security vulnerabilities.",
        "education": "Degree in Cybersecurity, Information Technology, Computer Science, or certifications like CompTIA Security+, CEH, CISSP.",
        "skills": ["Problem Solving", "Analytical Thinking", "Research", "Logical Reasoning"],
        "beginner_skills": ["Networking Protocols (TCP/IP, DNS, OSI Model)", "Linux CLI & Bash", "Security Fundamentals", "Wireshark Packet Analysis"],
        "advanced_skills": ["SIEM Tools (Splunk, Elastic)", "Threat Hunting & Incident Response", "Penetration Testing (Metasploit, Burp Suite)", "Cryptographic Implementations"],
        "interests": ["Technical problems", "Technology & Software", "Solving logical problems", "Reading/researching topics"],
        "work_style": ["agile team", "independently", "remotely"],
        "roadmap": [
            {"step": 1, "title": "Networking & Operating Systems", "description": "Master OSI model, routing, switching, firewalls, and Linux system administration."},
            {"step": 2, "title": "Security Foundations & CompTIA Security+", "description": "Learn threat types, cryptography, identity access management, and vulnerability scanning."},
            {"step": 3, "title": "SOC & Security Information Management (SIEM)", "description": "Analyze network logs, identify malicious indicators of compromise (IoC) with Splunk."},
            {"step": 4, "title": "Ethical Hacking & Vulnerability Assessment", "description": "Practice penetration testing in virtual labs (TryHackMe, HackTheBox) using Kali Linux."},
            {"step": 5, "title": "Incident Response & Forensics", "description": "Develop disaster recovery plans and run digital forensic analysis on compromised systems."},
            {"step": 6, "title": "SOC Analyst / Cyber Specialist Role", "description": "Obtain industry certification and join a Corporate Security Operations Center."}
        ],
        "related_courses": [
            {"name": "Google Cybersecurity Professional Certificate", "platform": "Coursera", "level": "Beginner"},
            {"name": "CompTIA Security+ Exam Prep", "platform": "Udemy / Professor Messer", "level": "Intermediate"},
            {"name": "Practical Ethical Hacking", "platform": "TCM Security", "level": "Intermediate"}
        ],
        "related_job_roles": ["Information Security Analyst", "SOC Tier 1/2 Analyst", "Penetration Tester", "Security Consultant"],
        "responsibilities": [
            "Monitor enterprise networks for suspicious security events and anomalies 24/7",
            "Perform vulnerability assessments and recommend remediation patches",
            "Conduct root cause analysis on confirmed security breaches and author post-mortems",
            "Educate organizational employees regarding phishing and cyber hygiene"
        ]
    },
    {
        "name": "Cloud Engineer",
        "category": "Technology",
        "description": "Architect, provision, and maintain resilient cloud computing infrastructure, serverless solutions, and global distributed networks on platforms like AWS, Microsoft Azure, and Google Cloud.",
        "education": "Degree in Computer Science, Information Systems, or certifications such as AWS Solutions Architect / Azure Administrator.",
        "skills": ["Problem Solving", "Programming", "Logical Reasoning", "Teamwork"],
        "beginner_skills": ["Linux Administration", "Networking Basics (VPC, Subnets)", "Cloud Fundamentals (AWS/Azure)", "Python Scripting"],
        "advanced_skills": ["Infrastructure as Code (Terraform)", "Kubernetes Container Orchestration", "Serverless Computing (AWS Lambda)", "Cloud Cost Optimization"],
        "interests": ["Technology & Software", "Building something new", "Technical problems"],
        "work_style": ["remotely", "agile team", "independently"],
        "roadmap": [
            {"step": 1, "title": "Linux & Networking Mastery", "description": "Comfort with terminal commands, SSH keys, DNS routing, load balancing, and CIDR blocks."},
            {"step": 2, "title": "Cloud Fundamentals (AWS/Azure/GCP)", "description": "Learn compute instances (EC2/VMs), storage (S3/Blob), identity (IAM), and security groups."},
            {"step": 3, "title": "Containerization with Docker", "description": "Package microservice applications into reproducible lightweight container images."},
            {"step": 4, "title": "Infrastructure as Code (IaC)", "description": "Automate cloud provisioning declaratively using Terraform or AWS CloudFormation."},
            {"step": 5, "title": "Container Orchestration with Kubernetes", "description": "Deploy, scale, and manage fault-tolerant container clusters using K8s."},
            {"step": 6, "title": "Cloud Architect / Engineer Role", "description": "Complete AWS Certified Solutions Architect and step into high-demand cloud engineering positions."}
        ],
        "related_courses": [
            {"name": "AWS Certified Solutions Architect Associate", "platform": "A Cloud Guru / Udemy", "level": "Intermediate"},
            {"name": "Docker & Kubernetes: The Practical Guide", "platform": "Udemy", "level": "Intermediate"},
            {"name": "Terraform for AWS Infrastructure", "platform": "HashiCorp Learn", "level": "Intermediate to Advanced"}
        ],
        "related_job_roles": ["DevOps Engineer", "Cloud Solutions Architect", "Site Reliability Engineer (SRE)", "Infrastructure Engineer"],
        "responsibilities": [
            "Architect highly available, fault-tolerant, and auto-scaling cloud architectures",
            "Implement automated Infrastructure-as-Code pipelines via CI/CD workflows",
            "Enforce cloud security compliance, zero-trust access, and encrypted backups",
            "Continuously audit cloud resource consumption to eliminate wasteful expenditure"
        ]
    },
    {
        "name": "UI/UX Designer",
        "category": "Design",
        "description": "Design intuitive, delightful, and human-centered digital experiences for mobile and web apps. UI/UX designers conduct user research, craft wireframes, and design polished visual interfaces.",
        "education": "Degree in Interaction Design, Human-Computer Interaction (HCI), Graphic Design, Psychology, or design bootcamps.",
        "skills": ["Design", "Creativity", "Communication", "Problem Solving"],
        "beginner_skills": ["Figma & FigJam", "Color Theory & Typography", "Wireframing & Prototyping", "Design Principles (Gestalt)"],
        "advanced_skills": ["User Research & Usability Testing", "Design Systems Architecture", "Micro-Interactions & Animation", "Design-to-Code Handoff"],
        "interests": ["Designing visual content", "Creating designs/videos", "Design, UI/UX & Media", "Creative problems"],
        "work_style": ["creative studio", "remotely", "agile team"],
        "roadmap": [
            {"step": 1, "title": "Design Principles & Fundamentals", "description": "Study hierarchy, contrast, balance, typography, accessibility (WCAG), and responsive grid systems."},
            {"step": 2, "title": "Mastering Figma", "description": "Master vector tools, auto-layout, nested components, interactive prototyping, and community plugins."},
            {"step": 3, "title": "User Experience (UX) Research", "description": "Conduct user interviews, build user personas, journey maps, and information architecture."},
            {"step": 4, "title": "Interactive Prototyping & Micro-animations", "description": "Create clickable, realistic prototypes to test user flows with potential customers."},
            {"step": 5, "title": "Design System Construction", "description": "Build a comprehensive reusable token-based design library for web and mobile."},
            {"step": 6, "title": "Portfolio Presentation & Agency/Tech Role", "description": "Showcase 3 thorough case studies on Behance/Dribbble/personal site and interview for UI/UX roles."}
        ],
        "related_courses": [
            {"name": "Google UX Design Professional Certificate", "platform": "Coursera", "level": "Beginner"},
            {"name": "Design Rules: Principles & Practices for UI Designers", "platform": "Udemy", "level": "Intermediate"},
            {"name": "Figma UI/UX Advanced Design Masterclass", "platform": "Interaction Design Foundation", "level": "Intermediate"}
        ],
        "related_job_roles": ["Product Designer", "User Experience Researcher", "Interaction Designer", "Visual UI Designer"],
        "responsibilities": [
            "Conduct exploratory user interviews and synthesize feedback into actionable user stories",
            "Produce low-fidelity wireframes and high-fidelity interactive Figma prototypes",
            "Maintain and expand the company design system components and token standards",
            "Collaborate closely with frontend software engineers during sprint implementations"
        ]
    },
    {
        "name": "Graphic Designer",
        "category": "Design",
        "description": "Create compelling visual artwork, brand identity systems, illustrations, marketing collateral, and packaging that communicate brand stories and capture audience attention.",
        "education": "Bachelor of Fine Arts (BFA), Graphic Design, Visual Communication, or extensive verified portfolio.",
        "skills": ["Design", "Creativity", "Presentation", "Time Management"],
        "beginner_skills": ["Adobe Illustrator", "Adobe Photoshop", "Visual Hierarchy", "Layout Composition"],
        "advanced_skills": ["Brand Identity Strategy", "Motion Graphics (After Effects)", "Print Production & Pre-press", "Art Direction"],
        "interests": ["Designing visual content", "Creating designs/videos", "Design, UI/UX & Media", "Creative expression & innovative design"],
        "work_style": ["creative studio", "independently", "remotely"],
        "roadmap": [
            {"step": 1, "title": "Visual Art & Color Theory", "description": "Master color palettes, optical balance, typography pairing, and vector fundamentals."},
            {"step": 2, "title": "Industry Standard Tools", "description": "In-depth proficiency with Adobe Illustrator, Photoshop, and InDesign."},
            {"step": 3, "title": "Brand Identity Design", "description": "Design complete brand identities: logos, typography guidelines, iconography, and style guides."},
            {"step": 4, "title": "Digital & Print Collateral", "description": "Create social media creatives, brochures, banners, billboards, and packaging mockups."},
            {"step": 5, "title": "Motion & Animation Intro", "description": "Learn basic keyframe animation in After Effects to create animated social media graphics."},
            {"step": 6, "title": "Curated Portfolio & Creative Placement", "description": "Compile a standout Behance portfolio and join a creative agency or branding studio."}
        ],
        "related_courses": [
            {"name": "Graphic Design Specialization", "platform": "CalArts / Coursera", "level": "Beginner"},
            {"name": "Illustrator 2024 MasterClass", "platform": "Udemy", "level": "Intermediate"},
            {"name": "Logo Design Mastery in Illustrator", "platform": "Skillshare", "level": "Intermediate"}
        ],
        "related_job_roles": ["Brand Designer", "Visual Artist", "Marketing Graphic Designer", "Creative Art Director"],
        "responsibilities": [
            "Develop distinct visual concepts, brand marks, and style kits for multi-channel campaigns",
            "Produce digital marketing assets for websites, social media channels, and email newsletters",
            "Prepare high-resolution files for commercial offset and digital printing",
            "Work alongside copywriters and marketing teams to brainstorm campaign themes"
        ]
    },
    {
        "name": "Digital Marketing Specialist",
        "category": "Business",
        "description": "Drive customer acquisition, brand awareness, and revenue growth through search engine marketing (SEO/SEM), paid social ads, content strategy, email marketing, and web analytics.",
        "education": "Degree in Marketing, Business Administration, Mass Communication, or digital marketing certifications.",
        "skills": ["Communication", "Writing", "Analytical Thinking", "Creativity"],
        "beginner_skills": ["SEO Fundamentals", "Social Media Marketing", "Content Creation", "Google Analytics 4"],
        "advanced_skills": ["Performance Marketing (Meta Ads, Google Ads)", "Marketing Automation & CRM", "Conversion Rate Optimization (CRO)", "Attribution Modeling"],
        "interests": ["Working with numbers/business", "Creating designs/videos", "Business & Corporate Strategy", "Starting or brainstorming a business"],
        "work_style": ["remotely", "agile team", "clients and customers"],
        "roadmap": [
            {"step": 1, "title": "Marketing Fundamentals & Customer Funnels", "description": "Understand customer personas, buyer journeys, and the AIDA funnel model."},
            {"step": 2, "title": "Content & Organic Search (SEO)", "description": "Learn keyword research, on-page optimization, backlink strategies, and search algorithms."},
            {"step": 3, "title": "Paid Advertising (PPC & Paid Social)", "description": "Manage targeted advertising budgets on Google Ads, Meta Ads Manager, and LinkedIn Ads."},
            {"step": 4, "title": "Web Analytics & Measurement", "description": "Track conversions, bounce rates, and traffic attribution using Google Analytics 4 & Tag Manager."},
            {"step": 5, "title": "Email Marketing & Retention", "description": "Build automated email nurture sequences using HubSpot, Mailchimp, or Klaviyo."},
            {"step": 6, "title": "Campaign Growth Manager Role", "description": "Manage multi-channel campaigns and advance into digital marketing managerial positions."}
        ],
        "related_courses": [
            {"name": "Google Digital Marketing & E-commerce Certificate", "platform": "Coursera", "level": "Beginner"},
            {"name": "Meta Certified Digital Marketing Associate", "platform": "Coursera", "level": "Intermediate"},
            {"name": "Advanced Search Engine Optimization (SEO)", "platform": "Semrush Academy", "level": "Intermediate to Advanced"}
        ],
        "related_job_roles": ["Performance Marketer", "SEO Specialist", "Growth Marketing Lead", "Social Media Strategist"],
        "responsibilities": [
            "Plan and execute data-driven digital ad campaigns across search and social channels",
            "Conduct A/B testing on landing pages to maximize conversion rates and return on ad spend",
            "Author engaging blog articles, case studies, and social copy that ranks on search engines",
            "Analyze marketing analytics and report weekly ROI performance to leadership"
        ]
    },
    {
        "name": "Business Analyst",
        "category": "Business",
        "description": "Bridge the gap between business stakeholders and technical engineering teams. Business analysts evaluate processes, uncover operational inefficiencies, and document product requirements.",
        "education": "Degree in Business Administration, Management Information Systems, Finance, or Engineering.",
        "skills": ["Analytical Thinking", "Communication", "Problem Solving", "Presentation"],
        "beginner_skills": ["Business Process Modeling (BPMN)", "Requirements Gathering", "Excel Modeling", "Jira & Agile Workflows"],
        "advanced_skills": ["SQL for Business Insights", "Cost-Benefit Analysis", "Enterprise Architecture", "Stakeholder Management"],
        "interests": ["Working with numbers/business", "Business problems", "Business & Corporate Strategy", "Solving logical problems"],
        "work_style": ["agile team", "clients and customers", "remotely"],
        "roadmap": [
            {"step": 1, "title": "Business Fundamentals & Strategy", "description": "Study corporate finance, SWOT analysis, value chain optimization, and market sizing."},
            {"step": 2, "title": "Requirements Engineering", "description": "Learn to write clear Functional and Non-Functional Requirement Documents (BRD, FRD, PRD)."},
            {"step": 3, "title": "Process Mapping & Modeling", "description": "Create standard flowchart process maps in Lucidchart/Visio using BPMN 2.0 standards."},
            {"step": 4, "title": "Agile & Scrum Methodologies", "description": "Manage user stories, acceptance criteria, and sprint backlogs in Jira."},
            {"step": 5, "title": "Data-Driven Business Verification", "description": "Query business data with SQL to validate operational assumptions and ROI metrics."},
            {"step": 6, "title": "Certified Business Analyst Professional (CBAP)", "description": "Lead business transformation initiatives in corporate and consulting firms."}
        ],
        "related_courses": [
            {"name": "Business Analysis Foundations", "platform": "LinkedIn Learning", "level": "Beginner"},
            {"name": "Agile with Atlassian Jira", "platform": "Coursera", "level": "Intermediate"},
            {"name": "Data Analysis for Management", "platform": "LSE / edX", "level": "Intermediate"}
        ],
        "related_job_roles": ["Operations Analyst", "IT Business Analyst", "Strategy Consultant", "Process Improvement Lead"],
        "responsibilities": [
            "Interview executive and operational stakeholders to elicit precise project requirements",
            "Translate high-level business goals into actionable technical specifications and epics",
            "Evaluate operational workflows and identify automated cost-saving solutions",
            "Facilitate sprint planning, backlog grooming, and user acceptance testing (UAT)"
        ]
    },
    {
        "name": "Financial Analyst",
        "category": "Finance",
        "description": "Examine financial performance, build dynamic valuation models, analyze market trends, and advise companies and investors on capital allocation, investments, and mergers.",
        "education": "Degree in Finance, Accounting, Economics, Commerce, or pursuit of CFA (Chartered Financial Analyst).",
        "skills": ["Mathematics", "Analytical Thinking", "Data Analysis", "Presentation"],
        "beginner_skills": ["Financial Accounting Basics", "Excel Financial Formulas (NPV, IRR)", "Corporate Valuation Intro", "Ratio Analysis"],
        "advanced_skills": ["Discounted Cash Flow (DCF) Modeling", "Three-Statement Financial Models", "M&A Modeling", "Capital Budgeting"],
        "interests": ["Working with numbers/business", "Financial problems", "Finance & Banking", "High financial growth & wealth generation"],
        "work_style": ["independently", "agile team", "clients and customers"],
        "roadmap": [
            {"step": 1, "title": "Financial Accounting Principles", "description": "Master Income Statements, Balance Sheets, and Cash Flow Statement interconnections."},
            {"step": 2, "title": "Advanced Excel for Finance", "description": "Learn INDEX/MATCH, dynamic data tables, scenario managers, and financial functions."},
            {"step": 3, "title": "Corporate Finance & Capital Markets", "description": "Understand cost of capital (WACC), debt vs. equity financing, and macroeconomic indicators."},
            {"step": 4, "title": "Three-Statement Integrated Modeling", "description": "Build an integrated financial forecasting model projecting corporate revenues and expenses."},
            {"step": 5, "title": "Valuation Techniques (DCF & Comps)", "description": "Perform enterprise valuation using Discounted Cash Flows and Comparable Company analysis."},
            {"step": 6, "title": "Investment Banking / Corporate Finance Career", "description": "Complete CFA Level 1 and join an investment bank, private equity firm, or corporate FP&A team."}
        ],
        "related_courses": [
            {"name": "Financial Markets by Robert Shiller", "platform": "Yale / Coursera", "level": "Beginner"},
            {"name": "Complete Financial Analyst Training & Investing Course", "platform": "Udemy", "level": "Intermediate"},
            {"name": "Financial Modeling and Valuation", "platform": "Corporate Finance Institute (CFI)", "level": "Intermediate to Advanced"}
        ],
        "related_job_roles": ["FP&A Analyst", "Equity Research Associate", "Investment Banking Analyst", "Portfolio Analyst"],
        "responsibilities": [
            "Build dynamic 3-statement forecast models to evaluate prospective acquisitions",
            "Track variance between quarterly actual financial figures and budgeted forecasts",
            "Conduct industry research and synthesize equity research investment memos",
            "Prepare presentations for the Chief Financial Officer (CFO) and board members"
        ]
    },
    {
        "name": "Chartered Accountant",
        "category": "Finance",
        "description": "Provide expert counsel on corporate taxation, financial auditing, regulatory compliance, statutory reporting, and forensic accounting to protect financial integrity.",
        "education": "Chartered Accountancy qualification (CA / CPA / ACCA) following Bachelor of Commerce or direct entry.",
        "skills": ["Analytical Thinking", "Mathematics", "Problem Solving", "Time Management"],
        "beginner_skills": ["Statutory Accounting Principles", "Taxation Laws & Codes", "Auditing Standards", "ERP / Tally / QuickBooks"],
        "advanced_skills": ["Corporate Tax Planning", "Forensic Auditing", "International Financial Reporting Standards (IFRS)", "Risk Advisory"],
        "interests": ["Working with numbers/business", "Financial problems", "Finance & Banking", "Stable, prestigious professional career"],
        "work_style": ["independently", "agile team", "clients and customers"],
        "roadmap": [
            {"step": 1, "title": "Foundation Examination & Registration", "description": "Clear foundational accounting, business law, economics, and quantitative aptitude exams."},
            {"step": 2, "title": "Intermediate Level Studies", "description": "Study corporate law, cost and management accounting, direct and indirect taxation, and auditing."},
            {"step": 3, "title": "Practical Articleship Training", "description": "Complete 2-3 years of intensive mandatory practical audit training at a licensed accounting firm."},
            {"step": 4, "title": "Advanced Financial Management & IFRS", "description": "Master advanced auditing ethics, strategic financial management, and international taxation."},
            {"step": 5, "title": "Final Professional Certification", "description": "Pass comprehensive Final CA/CPA board examinations."},
            {"step": 6, "title": "Practice or Corporate Leadership", "description": "Launch an independent accounting consultancy or join a Big 4 accounting firm as a Senior Auditor."}
        ],
        "related_courses": [
            {"name": "ACCA / CA Foundation Preparation", "platform": "Institute Portals", "level": "Beginner"},
            {"name": "International Taxation Masterclass", "platform": "Coursera", "level": "Intermediate"},
            {"name": "Forensic Accounting and Fraud Examination", "platform": "West Virginia University", "level": "Advanced"}
        ],
        "related_job_roles": ["Statutory Auditor", "Tax Consultant", "Forensic Accountant", "Chief Accounting Officer"],
        "responsibilities": [
            "Perform rigorous statutory financial audits on balance sheets and corporate records",
            "Advise commercial clients on legal tax minimization strategies and filing deadlines",
            "Ensure complete compliance with international accounting standards (IFRS / GAAP)",
            "Investigate financial anomalies and suspicious transactions during forensic reviews"
        ]
    },
    {
        "name": "Entrepreneur",
        "category": "Business",
        "description": "Identify market gaps, develop innovative products or services, assemble talent, secure capital investment, and build scalable, resilient business enterprises from the ground up.",
        "education": "Any educational background; practical business acumen, leadership, and resilience are paramount.",
        "skills": ["Leadership", "Problem Solving", "Communication", "Creativity", "Time Management"],
        "beginner_skills": ["Lean Canvas Modeling", "Market Research & Validation", "MVP Prototyping", "Pitch Deck Presentation"],
        "advanced_skills": ["Venture Capital Fundraising", "Go-To-Market Strategy", "Financial Unit Economics (CAC/LTV)", "Organizational Scaling"],
        "interests": ["Starting or brainstorming a business", "Building something new", "Business & Corporate Strategy", "Entrepreneurship & building scalable companies"],
        "work_style": ["leading a team", "clients and customers", "creative studio"],
        "roadmap": [
            {"step": 1, "title": "Problem Discovery & Customer Validation", "description": "Identify a painful, unserved problem and conduct 50+ customer discovery interviews."},
            {"step": 2, "title": "Build a Minimum Viable Product (MVP)", "description": "Create a simple, functional prototype to validate whether users are willing to pay."},
            {"step": 3, "title": "Find Co-Founders & Core Team", "description": "Partner with complementary talent (e.g. a technical engineer paired with a business growth leader)."},
            {"step": 4, "title": "Go-to-Market & Early Traction", "description": "Acquire your first 100 paying customers and refine your product based on feedback."},
            {"step": 5, "title": "Fundraising & Seed Capital", "description": "Pitch to angel investors, accelerators (Y Combinator, Techstars), or venture capital funds."},
            {"step": 6, "title": "Scaling Operations & Team", "description": "Scale customer acquisition channels, hire departmental managers, and build lasting enterprise value."}
        ],
        "related_courses": [
            {"name": "Entrepreneurship 101: Who is your customer?", "platform": "MIT / edX", "level": "Beginner"},
            {"name": "How to Start a Startup", "platform": "Y Combinator", "level": "Beginner to Intermediate"},
            {"name": "Venture Finance & Startup Valuation", "platform": "Wharton / Coursera", "level": "Intermediate"}
        ],
        "related_job_roles": ["Startup Founder / CEO", "Managing Partner", "Venture Builder", "Incubator Director"],
        "responsibilities": [
            "Define the long-term vision, company mission, and strategic direction of the business",
            "Recruit and retain top engineering, marketing, and operational talent",
            "Manage corporate cash runway, financial forecasts, and investor relations",
            "Drive customer feedback into continuous product iteration"
        ]
    },
    {
        "name": "Product Manager",
        "category": "Technology",
        "description": "Serve as the strategic hub between business goals, user experience, and software engineering. Product Managers define what to build, why to build it, and measure product success.",
        "education": "Degree in Computer Science, Business, Engineering, or relevant technical product experience.",
        "skills": ["Leadership", "Communication", "Problem Solving", "Analytical Thinking"],
        "beginner_skills": ["Product Requirements (PRD) Drafting", "User Story Mapping", "Competitive Analysis", "Agile & Scrum"],
        "advanced_skills": ["Product Roadmapping & Prioritization (RICE Framework)", "A/B Testing & Product Metrics", "Go-To-Market Execution", "Executive Stakeholder Alignment"],
        "interests": ["Business problems", "Technology & Software", "Managing a project or team", "Leadership, management & executive authority"],
        "work_style": ["leading a team", "agile team", "remotely"],
        "roadmap": [
            {"step": 1, "title": "Tech & UX Literacy", "description": "Understand software development lifecycles, APIs, design systems, and UX wireframing."},
            {"step": 2, "title": "Product Discovery & Market Research", "description": "Analyze competitor offerings, study customer friction points, and identify product opportunities."},
            {"step": 3, "title": "Prioritization Frameworks", "description": "Master frameworks like RICE, MoSCoW, and Kano to decide feature roadmap trade-offs."},
            {"step": 4, "title": "Writing Excellent Product Specs (PRDs)", "description": "Write crisp PRDs including acceptance criteria, user stories, mockups, and telemetry metrics."},
            {"step": 5, "title": "Data-Driven Experimentation", "description": "Formulate hypotheses, run multivariate A/B tests, and track retention (Cohort retention curves)."},
            {"step": 6, "title": "Associate Product Manager (APM) Placement", "description": "Join a high-growth tech company as an APM leading a dedicated feature squad."}
        ],
        "related_courses": [
            {"name": "Become a Product Manager | Learn the Skills", "platform": "Udemy", "level": "Beginner"},
            {"name": "Digital Product Management: Modern Fundamentals", "platform": "University of Virginia", "level": "Intermediate"},
            {"name": "Product Strategy", "platform": "Northwestern Kellogg", "level": "Advanced"}
        ],
        "related_job_roles": ["Technical Product Manager", "Growth Product Manager", "Group Product Manager", "Director of Product"],
        "responsibilities": [
            "Define the multi-quarter product roadmap aligned with strategic business objectives",
            "Lead sprint planning, daily standups, and retrospective meetings with engineering squads",
            "Synthesize user feedback and product telemetry into clear iterative enhancements",
            "Coordinate cross-functional launches with sales, marketing, and legal teams"
        ]
    },
    {
        "name": "Research Scientist",
        "category": "Science",
        "description": "Investigate natural, physical, or computational phenomena through controlled experiments, rigorous mathematical formulation, peer-reviewed publications, and breakthrough discoveries.",
        "education": "Ph.D. or Master's in Physics, Chemistry, Biology, Materials Science, Computer Science, or Mathematics.",
        "skills": ["Research", "Analytical Thinking", "Problem Solving", "Writing"],
        "beginner_skills": ["Scientific Method & Hypothesis Formulation", "Literature Review & Citations", "Experimental Design", "Data Collection"],
        "advanced_skills": ["Grant Writing & Funding Acquisition", "Peer-Reviewed Journal Publishing", "Advanced Statistical Analysis", "Laboratory Instrumentation"],
        "interests": ["Conducting scientific experiments", "Scientific problems", "Reading/researching topics", "Academic research, discovery & publishing"],
        "work_style": ["laboratory", "independently", "agile team"],
        "roadmap": [
            {"step": 1, "title": "Undergraduate Scientific Rigor", "description": "Maintain high GPA in foundational science courses and join university laboratory research early."},
            {"step": 2, "title": "Literature Synthesis & Methodology", "description": "Read academic journals regularly, write comprehensive literature reviews, and master lab protocols."},
            {"step": 3, "title": "Master's & Doctoral Research (Ph.D.)", "description": "Select an unresolved frontier topic and complete original dissertation research."},
            {"step": 4, "title": "Scientific Publishing & Conferences", "description": "Publish first-author papers in prestigious peer-reviewed journals and present at conferences."},
            {"step": 5, "title": "Postdoctoral Fellowship", "description": "Deepen your domain specialization in a renowned international academic or industrial research lab."},
            {"step": 6, "title": "Principal Investigator (PI) / Senior Scientist", "description": "Direct your own independent research group or corporate R&D laboratory."}
        ],
        "related_courses": [
            {"name": "Understanding Research Methods", "platform": "University of London", "level": "Beginner"},
            {"name": "Writing in the Sciences", "platform": "Stanford University", "level": "Intermediate"},
            {"name": "Quantitative Research Methods", "platform": "Amsterdam University", "level": "Intermediate"}
        ],
        "related_job_roles": ["Principal Investigator", "R&D Scientist", "Staff Researcher", "Laboratory Director"],
        "responsibilities": [
            "Formulate and test original hypotheses using controlled scientific experimentation",
            "Analyze experimental data with statistical precision and publish peer-reviewed papers",
            "Apply for government and private foundation scientific research grants",
            "Supervise graduate student research assistants and maintain lab safety standards"
        ]
    },
    {
        "name": "Teacher/Educator",
        "category": "Education",
        "description": "Inspire, mentor, and educate learners by designing engaging curricula, delivering lectures, fostering inclusive learning environments, and cultivating intellectual curiosity.",
        "education": "Bachelor's/Master's in Education (B.Ed/M.Ed), subject-matter degree, and relevant state teaching credentials.",
        "skills": ["Communication", "Leadership", "Presentation", "Time Management"],
        "beginner_skills": ["Lesson Plan Design", "Classroom Management", "Educational Psychology", "Formative Assessment"],
        "advanced_skills": ["Instructional Design & EdTech Integration", "Curriculum Development", "Differentiated Instruction", "Mentorship Strategy"],
        "interests": ["Helping and communicating with people", "Social problems", "Education & Training", "Social impact & improving people's lives"],
        "work_style": ["leading a team", "clients and customers", "agile team"],
        "roadmap": [
            {"step": 1, "title": "Subject Matter Specialization", "description": "Gain deep subject mastery in your chosen academic discipline (Science, Math, Languages, etc.)."},
            {"step": 2, "title": "Pedagogy & Educational Theory", "description": "Study student cognitive development, inclusive classroom practices, and pedagogical methods."},
            {"step": 3, "title": "Student Teaching Internship", "description": "Practice under the guidance of an experienced master teacher in a real classroom setting."},
            {"step": 4, "title": "Licensure & Certification", "description": "Pass mandatory national/state educator certification examinations."},
            {"step": 5, "title": "Digital EdTech & Interactive Learning", "description": "Incorporate multimedia simulations, gamified quizzes, and LMS platforms into daily instruction."},
            {"step": 6, "title": "Senior Educator & Instructional Leader", "description": "Lead departmental curriculum committees or advance into educational administration."}
        ],
        "related_courses": [
            {"name": "Foundations of Teaching for Learning", "platform": "Commonwealth Education Trust", "level": "Beginner"},
            {"name": "Instructional Design: Digital Learning", "platform": "University of Maryland", "level": "Intermediate"},
            {"name": "Classroom Management Strategies", "platform": "Coursera", "level": "Intermediate"}
        ],
        "related_job_roles": ["High School Educator", "College Lecturer", "Curriculum Developer", "Corporate Instructional Designer"],
        "responsibilities": [
            "Deliver interactive, clear, and engaging daily lectures and laboratory exercises",
            "Design balanced assessments, grade assignments objectively, and provide actionable feedback",
            "Mentor struggling students one-on-one and communicate progress with parents",
            "Continuously update course materials to reflect modern pedagogical standards"
        ]
    },
    {
        "name": "Psychologist",
        "category": "Healthcare",
        "description": "Study human mental processes, emotions, cognitive behavior, and interpersonal dynamics. Psychologists provide clinical counseling, behavioral therapy, or organizational guidance.",
        "education": "Master's or Doctorate (Psy.D. / Ph.D.) in Clinical, Counseling, or Industrial-Organizational Psychology with state licensure.",
        "skills": ["Communication", "Research", "Analytical Thinking", "Problem Solving"],
        "beginner_skills": ["Active Listening", "Psychological Theories & History", "Basic Behavioral Observation", "Empathy & Ethics"],
        "advanced_skills": ["Cognitive Behavioral Therapy (CBT)", "Psychometric Testing & Assessment", "Diagnostic Evaluation (DSM-5)", "Crisis Intervention"],
        "interests": ["Helping and communicating with people", "Social problems", "Reading/researching topics", "Social impact & improving people's lives"],
        "work_style": ["clients and customers", "independently", "remotely"],
        "roadmap": [
            {"step": 1, "title": "Undergraduate Psychology Foundation", "description": "Study biopsychology, cognitive psychology, social psychology, and research methods."},
            {"step": 2, "title": "Research & Field Volunteerism", "description": "Volunteer at crisis hotlines, mental health shelters, and participate in psychology research labs."},
            {"step": 3, "title": "Graduate Degree (Master's / Ph.D.)", "description": "Complete graduate clinical training, ethics coursework, and statistical research."},
            {"step": 4, "title": "Supervised Clinical Practicum", "description": "Complete 1,500–2,000 hours of supervised therapy sessions with diverse client populations."},
            {"step": 5, "title": "Licensure Examination", "description": "Pass the board licensing examinations for professional psychological practice."},
            {"step": 6, "title": "Private Practice or Clinical Setting", "description": "Establish an independent counseling practice, join a hospital, or consult for corporate wellness."}
        ],
        "related_courses": [
            {"name": "Introduction to Psychology", "platform": "Yale University / Coursera", "level": "Beginner"},
            {"name": "Foundations of Cognitive Behavioral Therapy", "platform": "Beck Institute", "level": "Intermediate"},
            {"name": "Psychological First Aid", "platform": "Johns Hopkins University", "level": "Beginner to Intermediate"}
        ],
        "related_job_roles": ["Clinical Psychologist", "Counseling Psychologist", "School Psychologist", "Organizational Wellness Specialist"],
        "responsibilities": [
            "Conduct structured clinical intake interviews and psychometric evaluations",
            "Develop personalized therapeutic treatment plans incorporating evidence-based techniques",
            "Guide clients through anxiety, depression, trauma, and life transition challenges",
            "Maintain strict patient confidentiality according to healthcare privacy laws"
        ]
    },
    {
        "name": "Healthcare Professional",
        "category": "Healthcare",
        "description": "Provide vital diagnostic, medical, nursing, or clinical care to patients to prevent illness, treat acute and chronic conditions, and enhance overall public health and longevity.",
        "education": "MBBS, Nursing Degree (BSN), Allied Health Sciences, or Doctor of Medicine (MD) with clinical residency.",
        "skills": ["Problem Solving", "Communication", "Teamwork", "Time Management"],
        "beginner_skills": ["Human Anatomy & Physiology", "Vital Signs Monitoring", "Medical Terminology", "CPR / First Aid"],
        "advanced_skills": ["Clinical Diagnosis & Patient Assessment", "Pharmacology & Treatment Regimens", "Electronic Health Records (EHR)", "Emergency Triage"],
        "interests": ["Helping and communicating with people", "Scientific problems", "Healthcare & Medicine", "Social impact & improving people's lives"],
        "work_style": ["laboratory", "clients and customers", "agile team"],
        "roadmap": [
            {"step": 1, "title": "Pre-Med & Biological Sciences", "description": "Excel in biology, chemistry, physics, and medical entrance examinations (NEET / MCAT)."},
            {"step": 2, "title": "Medical School / Clinical Training", "description": "Complete preclinical coursework in anatomy, pathology, pharmacology, and physiology."},
            {"step": 3, "title": "Clinical Rotations", "description": "Rotate across internal medicine, surgery, pediatrics, emergency care, and psychiatry."},
            {"step": 4, "title": "Licensing & Board Examinations", "description": "Pass national medical licensing examinations for independent medical practice."},
            {"step": 5, "title": "Residency Program", "description": "Complete specialized hospital residency training in your selected medical specialty."},
            {"step": 6, "title": "Attending Physician / Specialist", "description": "Practice in premier hospital health systems or launch specialized medical care clinics."}
        ],
        "related_courses": [
            {"name": "Vital Signs: Understanding What the Body Is Telling Us", "platform": "University of Pennsylvania", "level": "Beginner"},
            {"name": "Clinical Terminology for International and U.S. Students", "platform": "University of Pittsburgh", "level": "Beginner"},
            {"name": "Infectious Disease Transmission and Prevention", "platform": "Coursera", "level": "Intermediate"}
        ],
        "related_job_roles": ["Physician / Doctor", "Registered Nurse (RN)", "Physician Assistant", "Public Health Officer"],
        "responsibilities": [
            "Examine patients, review medical histories, and order diagnostic laboratory scans",
            "Formulate accurate clinical diagnoses and prescribe pharmacological treatment plans",
            "Perform medical procedures and collaborate with surgical and nursing teams",
            "Educate patients and families regarding lifestyle modifications and preventative health"
        ]
    },
    {
        "name": "Environmental Scientist",
        "category": "Environment",
        "description": "Protect our planet's ecosystems by analyzing soil, water, and atmospheric samples, assessing climate impact, advising policymakers, and designing sustainable environmental solutions.",
        "education": "Degree in Environmental Science, Ecology, Geology, Environmental Engineering, or Forestry.",
        "skills": ["Research", "Analytical Thinking", "Data Analysis", "Problem Solving"],
        "beginner_skills": ["Environmental Ecology Basics", "Field Sampling Techniques", "Geographic Information Systems (GIS Basics)", "Environmental Policy Intro"],
        "advanced_skills": ["Environmental Impact Assessment (EIA)", "Advanced GIS & Remote Sensing (ArcGIS/QGIS)", "Pollution Modeling", "Carbon Accounting & Sustainability Reporting"],
        "interests": ["Conducting scientific experiments", "Environmental problems", "Reading/researching topics", "Environment & Sustainability"],
        "work_style": ["laboratory", "independently", "remotely"],
        "roadmap": [
            {"step": 1, "title": "Earth Science Foundations", "description": "Master chemistry, earth systems science, ecology, and climate dynamics."},
            {"step": 2, "title": "Fieldwork & Sample Collection", "description": "Learn hands-on field protocols for measuring water quality, soil contamination, and air particulates."},
            {"step": 3, "title": "Geographic Information Systems (GIS)", "description": "Map spatial environmental datasets, land cover changes, and deforestation using ArcGIS or QGIS."},
            {"step": 4, "title": "Environmental Regulations & Law", "description": "Study EPA regulations, Clean Air & Water Acts, and international environmental agreements."},
            {"step": 5, "title": "Environmental Impact Assessment (EIA)", "description": "Perform comprehensive EIA reviews for renewable energy and infrastructure projects."},
            {"step": 6, "title": "Sustainability Consultant / Scientist", "description": "Work with environmental consultancies, research institutes, or government conservation bodies."}
        ],
        "related_courses": [
            {"name": "Introduction to Environmental Science", "platform": "Dartmouth / edX", "level": "Beginner"},
            {"name": "GIS, Mapping, and Spatial Analysis Specialization", "platform": "University of Toronto", "level": "Intermediate"},
            {"name": "Corporate Sustainability: Strategies & Methodologies", "platform": "Erasmus University", "level": "Intermediate"}
        ],
        "related_job_roles": ["Ecology Specialist", "Sustainability Consultant", "GIS Environmental Analyst", "Conservation Officer"],
        "responsibilities": [
            "Collect and analyze chemical and biological samples from lakes, rivers, and soil reserves",
            "Prepare detailed Environmental Impact Statements (EIS) for industrial projects",
            "Model climate adaptation strategies and advise companies on carbon offset reductions",
            "Ensure industrial manufacturing plants comply with statutory environmental discharge limits"
        ]
    },
    {
        "name": "Content/Media Professional",
        "category": "Media",
        "description": "Produce captivating written articles, video content, podcasts, journalism pieces, and multimedia storytelling that inform, inspire, entertain, and educate global audiences.",
        "education": "Degree in Journalism, Mass Communication, English Literature, Film Production, or verified creative portfolio.",
        "skills": ["Writing", "Communication", "Creativity", "Time Management"],
        "beginner_skills": ["Storytelling Frameworks", "Research & Fact-Checking", "Grammar & Editorial Stylebooks (AP Style)", "Basic Video Editing (Premiere/CapCut)"],
        "advanced_skills": ["Multi-Platform Content Strategy", "Scriptwriting & Podcasting", "SEO Copywriting", "Audience Engagement Analytics"],
        "interests": ["Writing and researching", "Creating designs/videos", "Design, UI/UX & Media", "Creative expression & innovative design"],
        "work_style": ["creative studio", "remotely", "independently"],
        "roadmap": [
            {"step": 1, "title": "Storytelling & Editorial Craft", "description": "Study narrative structures, character arcs, persuasive rhetoric, and journalistic integrity."},
            {"step": 2, "title": "Multi-Channel Writing", "description": "Draft long-form essays, short-form viral social copy, investigative journalism, and newsletters."},
            {"step": 3, "title": "Audio/Video Production Essentials", "description": "Record crisp audio, conduct professional interviews, and edit video stories in Premiere Pro."},
            {"step": 4, "title": "Publishing & Personal Brand", "description": "Launch a Substack publication or YouTube channel, publish weekly, and study retention data."},
            {"step": 5, "title": "Content Strategy & Distribution", "description": "Repurpose single cornerstone stories into reels, threads, podcast snippets, and articles."},
            {"step": 6, "title": "Media House / Content Director Role", "description": "Join a prominent digital media publication, creative agency, or corporate brand editorial team."}
        ],
        "related_courses": [
            {"name": "Writing for the Web", "platform": "Open2Study", "level": "Beginner"},
            {"name": "The Strategy of Content Marketing", "platform": "UC Davis / Coursera", "level": "Intermediate"},
            {"name": "Video Editing with Premiere Pro", "platform": "Skillshare", "level": "Beginner to Intermediate"}
        ],
        "related_job_roles": ["Journalist / Reporter", "Content Strategist", "Video Producer", "Copywriter & Author"],
        "responsibilities": [
            "Research, pitch, and produce compelling multimedia stories and documentary features",
            "Interview experts and cross-verify facts to maintain high journalistic credibility",
            "Optimize content headlines and structure for social virality and organic search discovery",
            "Analyze viewer engagement metrics to continuously refine audience retention strategies"
        ]
    }
]

def seed_database(db: Session):
    # 1. Seed Skills
    for s in SKILLS_DATA:
        existing = db.query(Skill).filter(Skill.name == s["name"]).first()
        if not existing:
            db.add(Skill(name=s["name"], category=s["category"]))
    db.commit()

    # 2. Seed Questions
    for q in QUESTIONS_DATA:
        existing = db.query(Question).filter(Question.order_index == q["order_index"]).first()
        if not existing:
            db.add(Question(
                category=q["category"],
                question_text=q["question_text"],
                question_type=q["question_type"],
                options=q["options"],
                weight=q["weight"],
                order_index=q["order_index"]
            ))
    db.commit()

    # 3. Seed Careers
    for c in CAREERS_DATA:
        existing = db.query(Career).filter(Career.name == c["name"]).first()
        if not existing:
            db.add(Career(
                name=c["name"],
                category=c["category"],
                description=c["description"],
                education=c["education"],
                skills=json.dumps(c["skills"]),
                beginner_skills=json.dumps(c.get("beginner_skills", [])),
                advanced_skills=json.dumps(c.get("advanced_skills", [])),
                interests=json.dumps(c["interests"]),
                work_style=json.dumps(c.get("work_style", [])),
                roadmap=json.dumps(c["roadmap"]),
                related_courses=json.dumps(c.get("related_courses", [])),
                related_job_roles=json.dumps(c.get("related_job_roles", [])),
                responsibilities=json.dumps(c.get("responsibilities", []))
            ))
    db.commit()

    # 4. Seed Admin User
    admin = db.query(User).filter(User.email == "admin@aicareerguide.com").first()
    if not admin:
        admin_user = User(
            name="Platform Administrator",
            email="admin@aicareerguide.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()

    # 5. Seed Demo Student User
    demo_student = db.query(User).filter(User.email == "student@aicareerguide.com").first()
    if not demo_student:
        student_user = User(
            name="Alex Morgan",
            email="student@aicareerguide.com",
            password_hash=get_password_hash("student123"),
            role="student"
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        # Create Profile
        profile = StudentProfile(
            user_id=student_user.id,
            age=20,
            education_level="Undergraduate",
            current_class_year="3rd Year",
            stream="Science",
            percentage=85.5,
            math_score=88.0,
            science_score=84.0,
            cs_score=92.0,
            english_score=80.0,
            commerce_score=70.0,
            goals="Aspiring to build impactful AI systems and data solutions for real-world problems."
        )
        db.add(profile)
        db.commit()

    print("Seed data successfully populated in SQLite!")
