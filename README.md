# Sales Data Automator

AI-powered sales data analysis and reporting tool that transforms raw CSV/Excel files into professional insights delivered via email.

## 🚀 Features

- **File Upload**: Support for CSV and Excel (.xlsx) files
- **AI Analysis**: Google Gemini integration for intelligent sales data insights
- **Email Delivery**: Automated report delivery via Resend email service
- **Real-time Feedback**: Loading states and success/error notifications
- **Secure API**: Rate limiting, authentication, and input validation
- **Live Documentation**: Interactive Swagger/OpenAPI documentation

## 🏗️ Architecture

### Frontend (Next.js 14)
- Modern React SPA with TypeScript
- Tailwind CSS for responsive design
- Real-time status updates and error handling
- File upload with drag-and-drop support

### Backend (FastAPI)
- RESTful API with automatic OpenAPI documentation
- File processing with pandas
- Rate limiting and security middleware
- Integration with Gemini AI and Resend email service

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## 🛠️ Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salesautomatorinsight
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   EMAIL_API_KEY=your_resend_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   API_TOKEN=secure-token-123
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Local Development

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security Implementation

### API Security
- **Authentication**: Bearer token-based authentication
- **Rate Limiting**: 5 requests per minute per IP address
- **Input Validation**: File type restrictions and email validation
- **CORS Protection**: Configured for specific origins
- **File Size Limits**: Prevents resource abuse

### Environment Variables
All sensitive data is stored in environment variables:
- API keys and tokens
- Email service credentials
- Database connections (if needed)

## 📊 API Endpoints

### Main Endpoint
```
POST /upload-and-process
```

**Request:**
- `file`: CSV or Excel file (multipart/form-data)
- `email`: Recipient email address
- `Authorization`: Bearer token

**Response:**
```json
{
  "status": "success",
  "message": "Sales data processed and summary sent successfully",
  "summary": "AI-generated insights...",
  "timestamp": "2024-01-01T12:00:00"
}
```

### Documentation
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy automatically on push to main branch

### Environment Variables for Production
```env
GEMINI_API_KEY=your_production_gemini_key
EMAIL_API_KEY=your_production_resend_key
FROM_EMAIL=your_verified_domain_email
API_TOKEN=your_secure_production_token
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest -v
```

### Frontend Tests
```bash
cd frontend
npm run lint
npm run build
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Backend Testing**
   - Python linting with flake8
   - Unit tests with pytest
   - Security scanning

2. **Frontend Testing**
   - Node.js linting
   - Build verification
   - Dependency checks

3. **Docker Validation**
   - Multi-stage build testing
   - Docker Compose validation

4. **Security Scanning**
   - Trivy vulnerability scanner
   - SARIF report generation

## 📧 Email Service Setup (Resend)

1. Sign up at [Resend](https://resend.com)
2. Verify your domain
3. Create an API key
4. Set the `EMAIL_API_KEY` and `FROM_EMAIL` environment variables

## 🤖 AI Service Setup (Google Gemini)

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set the `GEMINI_API_KEY` environment variable
3. The system automatically analyzes sales data and generates insights

## 📁 Project Structure

```
salesautomatorinsight/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Main application page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile          # Frontend Docker configuration
│   └── next.config.js      # Next.js configuration
├── .github/workflows/
│   └── ci-cd.yml          # GitHub Actions pipeline
├── docker-compose.yml      # Multi-container setup
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🎯 End-to-End Flow

1. **User uploads** CSV/Excel file through the web interface
2. **Frontend validates** file type and sends to backend
3. **Backend processes** the file with pandas
4. **AI analyzes** data using Gemini API
5. **Email service** sends formatted report to recipient
6. **User receives** professional sales insights via email

## 🐛 Troubleshooting

### Common Issues

1. **File upload fails**
   - Check file size (max 10MB)
   - Verify file format (CSV/XLSX only)

2. **Email not received**
   - Check Resend API key
   - Verify domain is verified in Resend
   - Check spam folder

3. **API errors**
   - Verify environment variables
   - Check rate limiting (5 req/min)
   - Ensure valid authentication token

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs`
- Review the troubleshooting section above
