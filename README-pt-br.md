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
- **templateId** (obrigatório): ID do template
- **clientId OU externalId** (um obrigatório): ID do cliente ou ID externo

### 4. Opções
```javascript
{
  debug: true,           // Habilitar modo debug
  useDefaultStyle: true, // Aplicar estilos padrão do widget (padrão: true)
  containerId: 'my-div', // ID do elemento DOM onde o survey será montado (padrão: body)
  colored_nps: true,     // Colorir escala NPS em vermelho/amarelo/verde (padrão: false)
  logFunction: fn        // Função de log personalizada
}
```

### 5. Métodos
- `partenero.init(userData)` - Inicializar pesquisa
- `partenero.destroy()` - Limpar instância

### Demo
Abra `survey.html` localmente para ver um exemplo funcional com validação de formulário.
