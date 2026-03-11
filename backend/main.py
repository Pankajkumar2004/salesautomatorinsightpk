from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import pandas as pd
import os
import io
import google.generativeai as genai
import requests
import aiofiles
from datetime import datetime
from typing import Optional
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Sales Data Automator API",
    description="API for processing sales data with AI and sending email summaries",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Email service configuration
EMAIL_SERVICE_URL = os.getenv("EMAIL_SERVICE_URL", "https://api.resend.com/emails")
EMAIL_API_KEY = os.getenv("EMAIL_API_KEY")

def validate_token(token: str = Depends(security)):
    # Simple token validation - in production, use proper JWT validation
    if token.credentials != os.getenv("API_TOKEN", "secure-token-123"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

@app.get("/")
async def root():
    return {"message": "Sales Data Automator API", "version": "1.0.0"}

@app.post("/upload-and-process")
@limiter.limit("5/minute")
async def upload_and_process(
    request: Request,
    file: UploadFile = File(...),
    email: str = Form(...),
    token: str = Depends(validate_token)
):
    try:
        # Validate file type
        if not file.filename.endswith(('.csv', '.xlsx')):
            raise HTTPException(status_code=400, detail="Only CSV and XLSX files are allowed")
        
        # Validate email
        if not email or '@' not in email:
            raise HTTPException(status_code=400, detail="Valid email is required")
        
        # Read file content
        contents = await file.read()
        
        # Process file based on type
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(contents))
        
        # Generate AI summary
        summary = await generate_sales_summary(df)
        
        # Send email
        await send_email_summary(email, summary, file.filename)
        
        return {
            "status": "success",
            "message": "Sales data processed and summary sent successfully",
            "summary": summary,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

async def generate_sales_summary(df: pd.DataFrame) -> str:
    try:
        # Convert DataFrame to a readable format
        data_sample = df.head(10).to_string()
        total_records = len(df)
        columns = list(df.columns)
        
        # Create prompt for Gemini
        prompt = f"""
        Analyze the following sales data and provide a professional executive summary:
        
        Data Sample:
        {data_sample}
        
        Total Records: {total_records}
        Columns: {columns}
        
        Please provide:
        1. Key insights and trends
        2. Top performing areas
        3. Areas for improvement
        4. Actionable recommendations
        
        Format the response as a professional business summary.
        """
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        response = model.generate_content(prompt)
        
        if response and response.candidates:
            return response.candidates[0].content.parts[0].text
        else:
            return "AI could not generate summary."
        
    except Exception as e:
        return f"AI Analysis Error: {str(e)}"

async def send_email_summary(email: str, summary: str, filename: str):
    try:
        email_data = {
            "from": os.getenv("FROM_EMAIL", "noreply@salesautomator.com"),
            "to": [email],
            "subject": f"Sales Data Analysis Report - {filename}",
            "html": f"""
            <html>
                <body>
                    <h2>Sales Data Analysis Report</h2>
                    <p><strong>File:</strong> {filename}</p>
                    <p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                    <hr>
                    <div style="white-space: pre-wrap; font-family: Arial, sans-serif;">
                        {summary}
                    </div>
                    <hr>
                    <p><em>This report was generated by Sales Data Automator</em></p>
                </body>
            </html>
            """
        }
        
        headers = {
            "Authorization": f"Bearer {EMAIL_API_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(EMAIL_SERVICE_URL, json=email_data, headers=headers)
        response.raise_for_status()
        
    except Exception as e:
        raise Exception(f"Failed to send email: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
