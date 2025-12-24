# EE Score Checker

A modern full-stack web application that allows users to query Canadian IRCC (Immigration, Refugees and Citizenship Canada) CRS (Comprehensive Ranking System) scores from the official IRCC API by selecting a date range.

<img width="1507" height="801" alt="image" src="https://github.com/user-attachments/assets/7e1327d8-a9c9-4d4b-a7e1-736418364ae1" />

## 🚀 Features

- ✅ Query CRS scores from the official IRCC Express Entry rounds API
- 📅 Filter by date range (start date and/or end date)
- 📊 View all rounds if no date range is specified
- 🎨 Modern, responsive UI with gradient design
- ⚡ Fast development experience with Vite
- 🔄 Real-time data fetching with 5-minute caching
- 📱 Mobile-friendly responsive design

## 📋 Displayed Information

Each query result displays comprehensive information:
- **Draw Number**: Unique identifier for each Express Entry draw
- **Draw Date**: Full date of the draw
- **Program Name**: Express Entry program (e.g., Provincial Nominee Program, Canadian Experience Class)
- **CRS Score**: Comprehensive Ranking System score
- **Invitations Issued**: Number of invitations sent in that draw
- **Draw Date & Time**: Exact timestamp of the draw
- **Tie-breaking Rule**: Cut-off timestamp for tie-breaking (if available)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend build tool
- **CSS3** - Modern styling with gradients and animations

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.8+** - Backend runtime
- **httpx** - Async HTTP client for API calls
- **Pydantic** - Data validation

### Data Source
- **IRCC Official API**: [Express Entry Rounds JSON](https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json)

## 📁 Project Structure

```
.
├── frontend/              # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── DateRangeForm.tsx
│   │   │   ├── ResultsPanel.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── App.tsx       # Main app component
│   │   ├── App.css        # App styles
│   │   ├── index.tsx      # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.ts     # Vite configuration
│   ├── tsconfig.json      # TypeScript configuration
│   ├── tsconfig.node.json # TypeScript config for Vite
│   └── package.json       # Frontend dependencies
├── backend/               # FastAPI backend
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── venv/              # Virtual environment (gitignored)
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **Python** 3.8 or higher
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
     If the system not allow script run, temporary detour it by
     ```bash
     Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at:
   - **API**: `http://localhost:8000`
   - **Interactive API Docs**: `http://localhost:8000/docs`
   - **Alternative Docs**: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

   The app will automatically open in your browser, or you can navigate to the URL manually.

## 📡 API Endpoints

### `GET /api/crs-scores`

Query CRS scores with optional date range filtering.

**Query Parameters:**
- `start_date` (optional): Start date for filtering in `YYYY-MM-DD` format
- `end_date` (optional): End date for filtering in `YYYY-MM-DD` format

**Examples:**
```bash
# Get all rounds
GET /api/crs-scores

# Get rounds within a date range
GET /api/crs-scores?start_date=2024-01-01&end_date=2024-12-31

# Get rounds from a specific date onwards
GET /api/crs-scores?start_date=2024-06-01

# Get rounds up to a specific date
GET /api/crs-scores?end_date=2024-06-30
```

**Response:**
```json
[
  {
    "drawNumber": "386",
    "drawDate": "2025-12-15",
    "drawDateFull": "December 15, 2025",
    "drawName": "Provincial Nominee Program",
    "drawSize": "399",
    "drawCRS": "731",
    "drawDateTime": "December 15, 2025 at 14:39:41 UTC",
    "drawCutOff": "October 18, 2025 at  7:18:52 UTC",
    "drawText2": "Provincial Nominee Program"
  }
]
```

### `GET /api/rounds/all`

Get all CRS rounds without any filtering.

### `GET /`

Root endpoint that returns API information.

## 💡 Usage

1. **Start both servers** (backend and frontend)
2. **Open** `http://localhost:3000` in your browser
3. **Select a date range** (optional):
   - Leave both dates empty to see all rounds
   - Enter a start date to see rounds from that date onwards
   - Enter an end date to see rounds up to that date
   - Enter both dates to see rounds within that range
4. **Click "Query CRS Scores"** to fetch and display results
5. **View the results** in organized cards with all draw information

## 🔧 Configuration

### Backend Configuration

The backend uses a 5-minute cache for IRCC API responses to reduce load on the official API. This can be adjusted in `backend/main.py`:

```python
# Cache for 5 minutes
if (datetime.now() - cache_timestamp).seconds < 300:
```

### Frontend Configuration

Vite configuration is in `frontend/vite.config.ts`. The proxy is configured to forward `/api` requests to the backend:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 8000 is already in use:

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr ":3000"

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### CORS Errors

If you encounter CORS errors, ensure:
1. Backend CORS is configured for `http://localhost:3000`
2. Frontend proxy is correctly configured in `vite.config.ts`

### Module Not Found Errors

If you see module errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. For Python: ensure virtual environment is activated and dependencies are installed

## 🌐 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📝 Development

### Running in Development Mode

Both servers support hot-reload:
- **Backend**: Uses `--reload` flag with uvicorn
- **Frontend**: Vite's built-in HMR (Hot Module Replacement)

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

**Backend:**
The backend is ready for production. Consider using a production ASGI server like Gunicorn with uvicorn workers.

## 🌏 Deploy  - by using AWS SAM ##
### Install mangum in the backend virtual environment ###
``` bash
.\vent\Scripts\activate
pip install mangum
```
Add the following libraries permanently by modifying requirments.txt and add  mangum, and add code in main.py
``` python
from mangum import Mangum
// All the CODE
handler = Mangum(app)
```

### AWS SAM Config ###
Check are AWS CLI and SAM installed
``` bash
aws --version
sam --version
```
If not
``` bash
brew install awssamcli        # macOS
choco install awssamcli       # Windows
```

Then create a user in AWS IAM and create an access key for the user (do not provide console permission)
``` bash
aws configure
```
Create a template.yaml
``` yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: FastAPI backend deployed with AWS SAM

Globals:
  Function:
    Timeout: 30
    MemorySize: 1024
    Runtime: python3.13

Resources:
  # For CORS configuration
  HttpApi:
    Type: AWS::Serverless::HttpApi
    Properties:
      CorsConfiguration:
        AllowOrigins:
          - https://ee-scores-checker.vercel.app
        AllowMethods:
          - GET
          - POST
          - PUT
          - DELETE
          - OPTIONS
        AllowHeaders:
          - Content-Type
          - Authorization
        AllowCredentials: false
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: main.handler
      CodeUri: .
      Events:
        ApiEvent:
          Type: HttpApi
          Properties:
            ApiId: !Ref HttpApi
            Path: /{proxy+}
            Method: ANY
      Environment:
        Variables:
          APP_ENV: prod
          DATABASE_URL: !Ref DatabaseUrl
          JWT_SECRET: !Ref JwtSecret

Parameters:
  DatabaseUrl:
    Type: String
    Default: "NOT_USED"
    NoEcho: true
  JwtSecret:
    Type: String  
    Default: "NOT_USED" 
    NoEcho: true

Outputs:
  # Output1: The
  ApiEndpoint:
    Description: "HTTP API endpoint URL"
    Value: !Sub "https://${HttpApi}.execute-api.${AWS::Region}.amazonaws.com/"

  # Output2: Lambda function name (optional)输出2：Lambda函数名称（可选，方便调试）
  LambdaFunctionName:
    Description: "AutoComment Lambda Function Name"
    Value: !Ref ApiFunction
```

Then install aws sam cli and run
``` bash
sam build

sam deploy --guided
```

| Prompt                    | Recommended Answer      |
| ------------------------- | ----------------------- |
| Stack name                | `your-project-name-dev` |
| Region                    | `us-east-1`             |
| Confirm changes           | `y`                     |
| Allow IAM role creation   | `y`                     |
| Disable rollback          | `n`                     |
| No authentication warning | `y`                     |
| Save SAM config           | `y`                     |
| Config environment        | `default`               |

The output will give you api endpoint url. I choose to store this api endpoint in frontend environment variables. There are many alternative options.
``` tsx
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
```
Be careful that this meta.env cannot be recognized as a type by TypeScript if no declaritions specifically listed. So add a vite-env.d.ts in /src to include all vite/client types.


## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Data provided by [Immigration, Refugees and Citizenship Canada (IRCC)](https://www.canada.ca/en/immigration-refugees-citizenship.html)
- Built with [FastAPI](https://fastapi.tiangolo.com/) and [React](https://react.dev/)
