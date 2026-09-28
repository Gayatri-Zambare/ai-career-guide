from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)

    # 1. Login
    res = client.post('/api/auth/login', json={'email': 'student@aicareerguide.com', 'password': 'student123'})
    assert res.status_code == 200, f'Login failed: {res.text}'
    data = res.json()
    token = data['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print("[PASS] Auth Login successful.")

    # 2. Get questions
    res = client.get('/api/questions')
    assert res.status_code == 200, f'Questions failed: {res.text}'
    questions = res.json()
    print(f"[PASS] Retrieved {len(questions)} assessment questions.")

    # 3. Start assessment
    res = client.post('/api/assessment/start', headers=headers)
    assert res.status_code == 200, f'Start failed: {res.text}'
    assessment_id = res.json()['assessment_id']
    print(f"[PASS] Assessment session started (ID: {assessment_id}).")

    # 4. Submit assessment
    sample_answers = []
    for q in questions:
        if q['category'] == 'Skills':
            sample_answers.append({'question_id': q['id'], 'answer': 4})
        elif q['question_type'] == 'multi_choice':
            sample_answers.append({'question_id': q['id'], 'answer': ['Mathematics', 'Computer Science']})
        elif q['question_type'] == 'rating':
            sample_answers.append({'question_id': q['id'], 'answer': 4})
        else:
            sample_answers.append({'question_id': q['id'], 'answer': q['options'][0] if q['options'] else 'Technology'})

    res = client.post(
        '/api/assessment/submit',
        headers=headers,
        json={'assessment_id': assessment_id, 'answers': sample_answers}
    )
    assert res.status_code == 200, f'Submit failed: {res.text}'
    res_data = res.json()
    print("[PASS] Assessment submitted successfully. Top recommended careers:")
    for r in res_data['recommendations'][:3]:
        print(f"   * {r['career']['name']}: {r['compatibility_score']}% match")

    # 5. Career Details & Skill-gap
    top_c_id = res_data['recommendations'][0]['career']['id']
    res = client.get(f'/api/careers/{top_c_id}/skill-gap', headers=headers)
    assert res.status_code == 200, f'Skill-gap failed: {res.text}'
    sg = res.json()
    print(f"[PASS] Skill gap analysis generated for {sg['career_name']}.")

    # 6. Chat assistant test
    res = client.post('/api/chat', headers=headers, json={'message': 'What is the difference between a data analyst and data scientist?'})
    assert res.status_code == 200, f'Chat failed: {res.text}'
    print("[PASS] Chat assistant query processed successfully.")

    # 7. Admin Dashboard check
    admin_login = client.post('/api/auth/login', json={'email': 'admin@aicareerguide.com', 'password': 'admin123'})
    assert admin_login.status_code == 200
    admin_headers = {'Authorization': f"Bearer {admin_login.json()['access_token']}"}
    admin_dash = client.get('/api/admin/dashboard', headers=admin_headers)
    assert admin_dash.status_code == 200
    print("[PASS] Admin dashboard metrics retrieved successfully.")

    print("\n==========================================")
    print("ALL BACKEND INTEGRATION TESTS PASSED 100%!")
    print("==========================================\n")

if __name__ == '__main__':
    run_tests()
