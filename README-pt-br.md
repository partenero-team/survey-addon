# Survey Add-on

## Uso

### 1. Incluir o Script
```html
<script type="text/javascript" src="https://partenero-team.github.io/survey-addon/survey.js"></script>
```

### 2. Inicializar o Partenero
```javascript
// Criar instância
const partenero = new Partenero(ambientId, templateId, options);

// Inicializar com dados do usuário
partenero.init({ 
  email: userEmail, 
  clientId: clientId, 
  externalId: externalId 
});
```

### 3. Parâmetros Obrigatórios
- **ambientId** (obrigatório): ID do ambiente
- **email** (obrigatório): Email do usuário
- **templateId OU surveyId** (um obrigatório): ID do template ou ID da pesquisa
- **clientId OU externalId** (um obrigatório): ID do cliente ou ID externo

### 4. Opções
```javascript
{
  debug: true,        // Habilitar modo debug
  sandbox: true,      // Usar ambiente sandbox
  logFunction: fn     // Função de log personalizada
}
```

### 5. Métodos
- `partenero.init(userData)` - Inicializar pesquisa
- `partenero.destroy()` - Limpar instância

### Demo
Abra `survey.html` para ver um exemplo funcional com validação de formulário.