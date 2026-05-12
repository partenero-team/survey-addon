# Survey Add-on

## Usage

### 1. Include the Script
```html
<script type="text/javascript" src="https://partenero-team.github.io/survey-addon/survey.js"></script>
```

### 2. Initialize Partenero
```javascript
// Create instance
const partenero = new Partenero(ambientId, templateId, options);

// Initialize with user data
partenero.init({ 
  email: userEmail, 
  clientId: clientId, 
  externalId: externalId 
});
```

### 3. Required Parameters
- **ambientId** (required): Environment ID
- **email** (required): User email
- **templateId** (required): Template ID
- **clientId OR externalId** (one required): Client ID or External ID

### 4. Options
```javascript
{
  debug: true,           // Enable debug mode
  useDefaultStyle: true, // Apply built-in widget styles (default: true)
  containerId: 'my-div', // DOM element ID to mount survey into (default: body)
  colored_nps: true,     // Color NPS scale red/yellow/green (default: false)
  logFunction: fn        // Custom log function
}
```

### 5. Methods
- `partenero.init(userData)` - Initialize survey
- `partenero.destroy()` - Clean up instance

### Demo
Open `survey.html` locally to see a working example with form validation.
