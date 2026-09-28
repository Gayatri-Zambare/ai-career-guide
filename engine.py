from typing import List, Dict, Any, Tuple
import json

class RecommendationEngine:
    """
    Lightweight, Explainable Multi-Attribute Decision Making (MADM) 
    AI Recommendation Engine for Career Guidance.
    
    Formula:
    Career Score = (Interest Match * 0.30)
                 + (Skill Match * 0.25)
                 + (Academic Match * 0.15)
                 + (Work Preference Match * 0.15)
                 + (Career Goal Match * 0.15)
    """

    @staticmethod
    def calculate_profile_radar(answers_dict: Dict[int, Any], student_profile: Any) -> Dict[str, float]:
        """
        Calculates 6-axis dimensional profile for radar and bar charts:
        - Analytical Skills
        - Creativity
        - Communication
        - Leadership
        - Technical Interest
        - Research Interest
        """
        radar = {
            "Analytical Skills": 60.0,
            "Creativity": 50.0,
            "Communication": 50.0,
            "Leadership": 50.0,
            "Technical Interest": 50.0,
            "Research Interest": 50.0
        }

        # Check skill ratings (Q5 to Q19 typically or key questions)
        # We also check academic performance if available
        for q_id, ans in answers_dict.items():
            ans_str = str(ans).lower()
            
            # Analytical
            if any(term in ans_str for term in ["logical", "math", "data analysis", "analytical", "numbers", "problem solving"]):
                if isinstance(ans, (int, float)):
                    radar["Analytical Skills"] += (float(ans) - 3) * 10
                else:
                    radar["Analytical Skills"] += 8

            # Creativity
            if any(term in ans_str for term in ["creative", "design", "visual", "art", "building something", "creating"]):
                if isinstance(ans, (int, float)):
                    radar["Creativity"] += (float(ans) - 3) * 10
                else:
                    radar["Creativity"] += 8

            # Communication
            if any(term in ans_str for term in ["communication", "writing", "helping", "people", "presentation", "public speaking"]):
                if isinstance(ans, (int, float)):
                    radar["Communication"] += (float(ans) - 3) * 10
                else:
                    radar["Communication"] += 8

            # Leadership
            if any(term in ans_str for term in ["leadership", "managing", "business", "leading", "entrepreneurship", "organizing"]):
                if isinstance(ans, (int, float)):
                    radar["Leadership"] += (float(ans) - 3) * 10
                else:
                    radar["Leadership"] += 8

            # Technical Interest
            if any(term in ans_str for term in ["technology", "programming", "software", "computer", "websites", "apps"]):
                if isinstance(ans, (int, float)):
                    radar["Technical Interest"] += (float(ans) - 3) * 10
                else:
                    radar["Technical Interest"] += 10

            # Research Interest
            if any(term in ans_str for term in ["research", "scientific", "experiments", "discovering", "investigating"]):
                if isinstance(ans, (int, float)):
                    radar["Research Interest"] += (float(ans) - 3) * 10
                else:
                    radar["Research Interest"] += 10

        # Adjust with academic profile if present
        if student_profile:
            if student_profile.math_score:
                radar["Analytical Skills"] = (radar["Analytical Skills"] * 0.7) + (student_profile.math_score * 0.3)
            if student_profile.cs_score:
                radar["Technical Interest"] = (radar["Technical Interest"] * 0.7) + (student_profile.cs_score * 0.3)
            if student_profile.english_score:
                radar["Communication"] = (radar["Communication"] * 0.7) + (student_profile.english_score * 0.3)

        # Normalize bounded between 25 and 98
        for k in radar:
            radar[k] = round(max(25.0, min(98.0, radar[k])), 1)

        return radar

    @classmethod
    def evaluate_career_compatibility(
        cls,
        career_data: Dict[str, Any],
        student_answers: Dict[str, Any],
        student_skills: Dict[str, int],
        student_profile: Any,
        user_stream: str
    ) -> Dict[str, Any]:
        """
        Calculates compatibility of a specific career against student inputs.
        Returns sub-scores, overall score, matched factors and growth areas.
        """
        matched_factors: List[str] = []
        growth_areas: List[str] = []

        career_name = career_data.get("name", "")
        career_category = career_data.get("category", "")
        career_skills = [s.lower() for s in career_data.get("skills", [])]
        beginner_skills = career_data.get("beginner_skills", [])
        career_interests = [i.lower() for i in career_data.get("interests", [])]
        career_work_style = [w.lower() for w in career_data.get("work_style", [])]

        # -------------------------------------------------------------
        # 1. INTEREST MATCH (30%)
        # -------------------------------------------------------------
        interest_score = 50.0
        student_interests = student_answers.get("interests", [])
        if isinstance(student_interests, str):
            student_interests = [student_interests]
        student_interests_lower = [str(x).lower() for x in student_interests]

        # Check overlap
        matched_interests = []
        for interest in career_interests:
            for s_int in student_interests_lower:
                if interest in s_int or s_int in interest:
                    matched_interests.append(interest)
                    break

        if matched_interests:
            boost = (len(matched_interests) / max(1, len(career_interests))) * 45
            interest_score = min(98.0, 55.0 + boost)
            matched_factors.append(f"Strong interest in {', '.join(matched_interests[:2])}")
        else:
            # Check domain similarity
            fav_activity = str(student_answers.get("fav_activity", "")).lower()
            if any(term in fav_activity for term in career_interests):
                interest_score = 75.0
                matched_factors.append(f"Favorite activity aligns with {career_name} focus")

        # -------------------------------------------------------------
        # 2. SKILL MATCH (25%)
        # -------------------------------------------------------------
        skill_score = 60.0
        relevant_ratings = []
        matched_high_skills = []
        
        for req_skill in career_skills:
            # Check if student rated this skill
            matched_rating = None
            for s_name, rating in student_skills.items():
                if req_skill in s_name.lower() or s_name.lower() in req_skill:
                    matched_rating = rating
                    break

            if matched_rating is not None:
                relevant_ratings.append(matched_rating)
                if matched_rating >= 4:
                    matched_high_skills.append(req_skill.title())
            else:
                # Default baseline rating if not explicitly rated
                relevant_ratings.append(3)

        if relevant_ratings:
            avg_rating = sum(relevant_ratings) / len(relevant_ratings)
            # Map avg 1-5 to 30-98%
            skill_score = min(98.0, max(30.0, 30.0 + (avg_rating - 1) * 17.0))

        if matched_high_skills:
            matched_factors.append(f"High proficiency in {', '.join(matched_high_skills[:3])}")

        # Identify skill gaps / growth areas
        for b_skill in beginner_skills:
            b_lower = b_skill.lower()
            rated_val = next((r for name, r in student_skills.items() if b_lower in name.lower()), None)
            if rated_val is None or rated_val <= 3:
                growth_areas.append(b_skill)

        if not growth_areas and beginner_skills:
            growth_areas = beginner_skills[:3]

        # -------------------------------------------------------------
        # 3. ACADEMIC MATCH (15%)
        # -------------------------------------------------------------
        academic_score = 70.0
        stream_lower = (user_stream or "").lower()
        if career_category.lower() in ["technology", "science"] and "science" in stream_lower:
            academic_score += 15.0
            matched_factors.append("Science / Tech academic stream background")
        elif career_category.lower() in ["finance", "business"] and "commerce" in stream_lower:
            academic_score += 15.0
            matched_factors.append("Commerce / Business academic stream alignment")
        elif career_category.lower() in ["design", "media", "education"] and ("arts" in stream_lower or "humanities" in stream_lower):
            academic_score += 15.0
            matched_factors.append("Creative / Humanities academic background")
        else:
            academic_score += 5.0  # Flexible interdisciplinary credit

        if student_profile and student_profile.percentage:
            if student_profile.percentage >= 80:
                academic_score = min(98.0, academic_score + 10.0)
            elif student_profile.percentage >= 65:
                academic_score = min(95.0, academic_score + 5.0)

        academic_score = min(98.0, max(45.0, academic_score))

        # -------------------------------------------------------------
        # 4. WORK PREFERENCE / PERSONALITY MATCH (15%)
        # -------------------------------------------------------------
        personality_score = 65.0
        preferred_work_env = str(student_answers.get("work_env", "")).lower()
        problem_style = str(student_answers.get("problem_style", "")).lower()
        self_desc = str(student_answers.get("self_desc", "")).lower()
        tech_comfort = int(student_answers.get("tech_comfort", 3))

        env_matches = [w for w in career_work_style if w in preferred_work_env]
        if env_matches:
            personality_score += 15.0
            matched_factors.append(f"Work style aligns with preferred {env_matches[0]} setting")

        if "analytical" in self_desc and career_category in ["Technology", "Science", "Finance"]:
            personality_score += 10.0
            matched_factors.append("Self-driven analytical problem-solving nature")
        elif "creative" in self_desc and career_category in ["Design", "Media"]:
            personality_score += 10.0
            matched_factors.append("Natural affinity for creative problem solving")
        elif "helping" in self_desc and career_category in ["Healthcare", "Education"]:
            personality_score += 10.0
            matched_factors.append("Strong interpersonal helping & mentoring orientation")

        if tech_comfort >= 4 and career_category in ["Technology", "Science"]:
            personality_score += 8.0
            matched_factors.append("High comfort with learning new technology tools")

        personality_score = min(98.0, max(40.0, personality_score))

        # -------------------------------------------------------------
        # 5. CAREER GOAL MATCH (15%)
        # -------------------------------------------------------------
        goal_score = 65.0
        main_goal = str(student_answers.get("main_goal", "")).lower()
        preferred_industry = str(student_answers.get("preferred_industry", "")).lower()
        entrepreneur_interest = int(student_answers.get("entrepreneur_interest", 3))

        if career_category.lower() in preferred_industry or preferred_industry in career_category.lower():
            goal_score += 20.0
            matched_factors.append(f"Direct alignment with target industry ({career_category})")
        
        if "leadership" in main_goal and any(role in career_name.lower() for role in ["manager", "entrepreneur", "analyst"]):
            goal_score += 10.0
        elif "technical" in main_goal and career_category == "Technology":
            goal_score += 10.0
            matched_factors.append("Focus on high technical depth and mastery")
        elif "creative" in main_goal and career_category in ["Design", "Media"]:
            goal_score += 10.0
        elif "entrepreneurship" in main_goal and (entrepreneur_interest >= 4 or career_name == "Entrepreneur"):
            goal_score += 12.0

        goal_score = min(98.0, max(40.0, goal_score))

        # -------------------------------------------------------------
        # FINAL COMPATIBILITY CALCULATION
        # -------------------------------------------------------------
        total_score = (
            (interest_score * 0.30) +
            (skill_score * 0.25) +
            (academic_score * 0.15) +
            (personality_score * 0.15) +
            (goal_score * 0.15)
        )
        total_score = round(min(98.5, max(35.0, total_score)), 1)

        # Generate Explainable AI summary text
        factors_summary = ", ".join(matched_factors[:3]) if matched_factors else "Your general aptitude and interests"
        explanation = (
            f"Based on your assessment responses, {career_name} is one of the career paths that aligns strongly "
            f"with your current interests and skills. Key drivers include: {factors_summary}. "
            f"This recommendation is provided as intelligent career guidance to help you plan your roadmap."
        )

        return {
            "career_id": career_data.get("id"),
            "career_name": career_name,
            "compatibility_score": total_score,
            "interest_score": round(interest_score, 1),
            "skill_score": round(skill_score, 1),
            "academic_score": round(academic_score, 1),
            "personality_score": round(personality_score, 1),
            "goal_score": round(goal_score, 1),
            "matched_factors": matched_factors[:5],
            "growth_areas": growth_areas[:4],
            "explanation": explanation
        }
