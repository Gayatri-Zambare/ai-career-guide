from typing import Dict, Any, List, Optional
import json

class AIChatAssistant:
    """
    Intelligent Career Guidance Assistant.
    Provides personalized conversational career guidance using student's profile,
    assessment results, and the curated career knowledge base.
    """

    @classmethod
    def answer_query(
        cls,
        user_message: str,
        student_profile: Any,
        user_name: str,
        recent_recommendations: List[Any],
        career_list: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        msg = user_message.lower().strip()
        top_career_names = [r.career.name for r in recent_recommendations[:3]] if recent_recommendations else []
        top_career = top_career_names[0] if top_career_names else "Software Developer"

        suggestions = [
            "What skills should I learn for data analysis?",
            "What is the difference between a data analyst and data scientist?",
            "What should I learn after Python?",
            "How can I prepare for internships in my field?",
            "What careers match my interests?"
        ]

        # 1. Difference between Data Analyst and Data Scientist
        if "difference" in msg and ("analyst" in msg or "scientist" in msg):
            reply = (
                f"**Data Analyst vs. Data Scientist Comparison:**\n\n"
                f"* **Data Analyst**: Focuses on analyzing historical data, identifying business trends, creating interactive dashboards (Tableau, PowerBI), and writing SQL queries. Typical stack: Excel, SQL, Tableau, Python/R for analysis.\n"
                f"* **Data Scientist**: Focuses on predictive modeling, machine learning algorithms, statistical experiments, and building automated data pipelines. Typical stack: Python, Scikit-Learn, PyTorch/TensorFlow, Advanced Statistics.\n\n"
                f"💡 **Recommendation for you ({user_name})**: If you enjoy business problem solving and visual storytelling, start with Data Analysis. If you love deep mathematics and predictive modeling, head toward Data Science!"
            )
            suggestions = [
                "What skills should I learn for data analysis?",
                "What should I learn after Python?",
                "Show me top recommended careers for me"
            ]

        # 2. What should I learn after Python?
        elif "after python" in msg:
            reply = (
                f"Great question! What you should learn after Python depends on your target domain:\n\n"
                f"1. **Data Analytics / AI**: Learn **Pandas & NumPy** for data wrangling, **SQL** for relational databases, and **Matplotlib/Seaborn** or PowerBI.\n"
                f"2. **Web / Backend Development**: Learn **FastAPI or Django**, understand RESTful API design, database ORMs (SQLAlchemy), and Docker.\n"
                f"3. **Machine Learning / AI**: Learn **Scikit-Learn**, math foundations (Linear Algebra & Probability), followed by **PyTorch**.\n\n"
                f"🚀 **Action Step**: Build 2 mini projects on GitHub showcasing your Python code with clean documentation."
            )
            suggestions = [
                "What skills should I learn for data analysis?",
                "What are the best free resources to learn SQL?",
                "How do I build an impressive student portfolio?"
            ]

        # 3. Skills for Data Analysis
        elif "skills" in msg and ("data" in msg or "analyst" in msg or "analysis" in msg):
            reply = (
                f"To become an industry-ready **Data Analyst**, focus on these foundational skills:\n\n"
                f"• **Core Querying**: Advanced SQL (JOINs, Window Functions, CTEs, Aggregations)\n"
                f"• **Programming**: Python (Pandas, NumPy) for data cleaning and manipulation\n"
                f"• **Business Intelligence**: Power BI or Tableau for executive dashboards\n"
                f"• **Applied Statistics**: Descriptive stats, hypothesis testing, correlation analysis\n"
                f"• **Soft Skills**: Business communication and data storytelling.\n\n"
                f"📌 Check your Career Details page for the complete step-by-step roadmap!"
            )
            suggestions = [
                "What is the difference between a data analyst and data scientist?",
                "What should I learn after Python?",
                "Show my compatibility scores"
            ]

        # 4. Careers matching interests
        elif "careers match" in msg or "my careers" in msg or "recommend" in msg:
            if top_career_names:
                careers_str = ", ".join(f"**{c}**" for c in top_career_names)
                reply = (
                    f"Hello {user_name}! Based on your latest AI Career Assessment, your top recommended career paths are:\n\n"
                    f"🎯 {careers_str}\n\n"
                    f"These careers reflect your high analytical problem solving, current academic stream, and preferred work environment. "
                    f"You can click into each career card on your Dashboard or Results page to inspect your custom Skill-Gap analysis and Roadmap."
                )
            else:
                reply = (
                    f"You haven't completed your Career Assessment yet, {user_name}! "
                    f"Take our 5-minute interactive assessment from the Dashboard to discover your personalized career matches and compatibility scores."
                )
            suggestions = [
                "How can I improve my programming skills?",
                "What careers are best for remote work?",
                "How does the AI calculate my compatibility score?"
            ]

        # 5. How to improve programming skills
        elif "programming" in msg or "coding" in msg:
            reply = (
                f"Here is a proven practical strategy to level up your programming skills:\n\n"
                f"1. **Build Real Projects**: Don't just watch tutorials. Build a portfolio project that solves a small personal problem.\n"
                f"2. **Daily Consistent Practice**: Spend 45 minutes every day writing code on LeetCode/HackerRank for logic and GitHub for apps.\n"
                f"3. **Version Control**: Use Git and push your code commits daily.\n"
                f"4. **Read Other People's Code**: Inspect well-structured open-source projects to understand design patterns and clean code practices."
            )
            suggestions = [
                "What should I learn after Python?",
                "What skills should I learn for cybersecurity?",
                "How can I prepare for technical interviews?"
            ]

        # 6. Specific career lookup by keyword
        elif any(c["name"].lower() in msg for c in career_list):
            matched_c = next((c for c in career_list if c["name"].lower() in msg), None)
            if matched_c:
                skills_list = ", ".join(matched_c.get("skills", [])[:4])
                reply = (
                    f"**{matched_c['name']} Profile Overview:**\n\n"
                    f"{matched_c.get('description', '')}\n\n"
                    f"• **Key Skills Needed**: {skills_list}\n"
                    f"• **Education**: {matched_c.get('education', '')}\n"
                    f"• **Work Environment**: {', '.join(matched_c.get('work_style', []))}\n\n"
                    f"Visit the **Career Explorer** tab to inspect the full step-by-step roadmap for {matched_c['name']}!"
                )
            else:
                reply = f"I found several resources related to that career in our database. Check the Career Explorer page for comprehensive details."

        # Default fallback
        else:
            reply = (
                f"Hello {user_name}! I am your AI Career Assistant. "
                f"I can help you navigate career options, explain skill roadmaps, understand industry requirements, "
                f"and discover learning paths tailored to your strengths."
            )

        return {
            "reply": reply,
            "suggestions": suggestions,
            "disclaimer": "This advice is generated as educational guidance based on your profile and not a guaranteed outcome."
        }
