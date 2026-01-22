"""
Test script for authentication endpoints
"""
import asyncio
import httpx
import os
from dotenv import load_dotenv

# Load environment variables BEFORE importing app
load_dotenv()

from app.main import app


async def test_auth_endpoints():
    """
    Test authentication endpoints with various scenarios
    """
    # Verify database URL is loaded
    db_url = os.getenv("DATABASE_URL")
    if not db_url or db_url == "your_default_dev_database_url":
        print("[ERROR] DATABASE_URL not set in .env file!")
        print("Please set DATABASE_URL in your .env file")
        return
    
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        try:
            # Test health endpoint
            response = await client.get("/health")
            assert response.status_code == 200
            assert response.json() == {"status": "healthy"}
            print("[PASS] Health endpoint working")

            # Test home endpoint
            response = await client.get("/")
            assert response.status_code == 200
            assert "message" in response.json()
            print("[PASS] Home endpoint working")

            # Test signup with valid data
            signup_data = {
                "email": "test@example.com",
                "password": "TestPass123!",
                "name": "Test User"
            }
            response = await client.post("/api/auth/signup", json=signup_data)
            print(f"Signup response: {response.status_code}, {response.json()}")

            if response.status_code == 201:
                print("[PASS] Signup endpoint working with valid data")
                user_data = response.json()
                token = user_data.get('token', '')
            else:
                print(f"[FAIL] Signup failed: {response.json()}")
                token = ''

            # Test signup with duplicate email
            response = await client.post("/api/auth/signup", json=signup_data)
            if response.status_code == 409:  # Conflict for duplicate email
                print("[PASS] Signup correctly rejects duplicate email")
            else:
                print(f"[WARNING] Expected 409, got {response.status_code}: {response.json()}")

            # Test login with valid credentials
            if token:  # Only test login if signup worked
                login_data = {
                    "email": "test@example.com",
                    "password": "TestPass123!"
                }
                response = await client.post("/api/auth/login", json=login_data)
                assert response.status_code == 200
                print("[PASS] Login endpoint working with valid credentials")

                # Test /me endpoint with valid token
                headers = {"Authorization": f"Bearer {token}"}
                response = await client.get("/api/auth/me", headers=headers)
                assert response.status_code == 200
                print("[PASS] /me endpoint working with valid token")

            # Test login with invalid credentials
            invalid_login_data = {
                "email": "test@example.com",
                "password": "WrongPassword123!"
            }
            response = await client.post("/api/auth/login", json=invalid_login_data)
            if response.status_code == 401:  # Unauthorized
                print("[PASS] Login correctly rejects invalid credentials")
            else:
                print(f"[WARNING] Expected 401, got {response.status_code}")

            print("\n✅ Authentication testing completed!")
            
        except Exception as e:
            print(f"\n❌ Test failed with error: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(test_auth_endpoints())