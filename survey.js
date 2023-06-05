var Partenero = class {
  token = null;
  debug = false;
  useDefaultStyle = true;
  primary_color = '#107EF4';
  primary_light_color = '#4198f6';
  answers = [];
  survey;
  client_id;
  containerId;
  api_url;
  user = {};
  default_main_div = 'position: absolute; bottom: 30px; right: 0; left: 0; margin-left: auto; margin-right: auto; z-index: 9999';
  styles = {
    close_button: 'cursor: pointer; background-color: white; color: #53585e; text-decoration: none; width: 160px; font-size: .9rem; padding: .5714285714rem 1.4285714286rem; transition: .2s ease; position: relative; display: inline-block; text-align: center; vertical-align: middle; border: 1px solid #e1eaea; border-radius: .25rem; font-weight: 400; margin-left: 1.0714285714rem!important;',
    error_div: 'color: #721c24; margin-bottom: 1.4285714286rem!important; background-color: #f8d7da; padding: .75rem 1.25rem; border: 1px solid #f5c6cb; border-radius: .25rem;',
    final_message_div: 'color: #0c5460; background-color: #d1ecf1; padding: .25rem 1rem; border: 1px solid #bee5eb; border-radius: .25rem; text-align: center;',
    float_button: `cursor: pointer; ${this.default_main_div}; width: 34px; box-shadow: 1px 1px 3px 0.5px #ddd; color: white; background-color: #107EF4; padding: .6rem 1.2rem; border-radius: .25rem; font-size: 20px; transition: .2 ease;`,
    main_div: `${this.default_main_div}; width: 800px; max-width: 60vw; height: auto; padding: 1.4285714286rem!important; background-color: white; box-shadow: 0 0 0 1px rgba(53,72,91,.07), 0 2px 2px rgba(0,0,0,.01), 0 4px 4px rgba(0,0,0,.02), 0 10px 8px rgba(0,0,0,.03), 0 15px 15px rgba(0,0,0,.03), 0 30px 30px rgba(0,0,0,.04), 0 70px 65px rgba(0,0,0,.05);`,
    observation_textarea: 'height: auto; border-color: #e1eaea!important; padding: 1.4285714286rem!important; resize: none; line-height: 1.6; color: #333; display: block; width: 100%; font-size: 1rem; border: 1px solid #ced4da; border-radius: 0.25rem; box-sizing: border-box;',
    question_div: 'padding-top: 1.4285714286rem!important; padding-bottom: 1.4285714286rem!important; box-sizing: border-box;',
    scale_btnGroup: 'position: relative; vertical-align: middle; display: table; width: 100%; table-layout: fixed; margin-bottom: 1.4285714286rem!important;',
    scale_input: 'box-sizing: border-box; padding: 0; display: none !important; left: 0; top: 0; position: absolute !important; overflow: visible; margin: 0;',
    scale_label: 'display: table-cell; width: 1%; float: none; position: relative; cursor: pointer;',
    scale_span__checked: `cursor: pointer; padding-top: .7142857143rem!important; padding-bottom: .7142857143rem!important; font-size: 1.1428571429rem!important; background-color: ${this.primary_color}!important; color: white; border-color: #eee; padding: .5714285714rem 1.4285714286rem; transition: .2s ease; position: relative; line-height: 1.4; width: 100%; display: inline-block; box-sizing: border-box; text-align: center; vertical-align: middle;`,
    scale_span: 'cursor: pointer; padding-top: .7142857143rem!important; padding-bottom: .7142857143rem!important; font-size: 1.1428571429rem!important; background-color: #edf2f8!important; color: #333; border-color: #eee; padding: .5714285714rem 1.4285714286rem; transition: .2s ease; position: relative; line-height: 1.4; width: 100%; display: inline-block; box-sizing: border-box; text-align: center; vertical-align: middle;',
    send_button: `cursor: pointer; background-color: ${this.primary_color}; color: #fff; text-decoration: none; width: 160px; font-size: .9rem; padding: .5714285714rem 1.4285714286rem; transition: .2s ease; position: relative; display: inline-block; text-align: center; vertical-align: middle; border: 1px solid transparent; border-radius: .25rem; font-weight: 400;`,
  }

  constructor(token, templateId, options = {}) {
    const {
      debug,
      useDefaultStyle,
      containerId,
      local,
    } = options;

    if (!token) {
      this.#log('ERROR: token deve ser informado');
    }

    if (!templateId) {
      this.#log('ERROR: templateId deve ser informado');
    }

    this.token = token;
    this.templateId = templateId;
    this.debug = debug || false;
    this.useDefaultStyle = useDefaultStyle || true;
    this.containerId = containerId;

    if (local) {
      this.api_url = 'http://localhost:3000';
    } else {
      this.api_url = 'https://api.partenero.com';
    }
  }

  #log(message) {
    if (this.debug) {
      console.log('PARTENERO', message);
    }
  }

  #saveLocal(key, value) {
    if (localStorage) {
      localStorage.setItem(`partenero.surveys.${key}`, value);
    }
  }

  #loadLocal(key) {
    if (localStorage) {
      return localStorage.getItem(`partenero.surveys.${key}`);
    }
    return null;
  }
  
  #checkIfUserClosed(email, mainSurveyId) {
    const key = `${email}:${mainSurveyId}`;
    const hide_untill = this.#loadLocal(key);
    const now = (new Date()).getTime();
    return now < hide_untill;
  }

  #resetError() {
    const div = document.getElementById('partenero-survey-error-div');
    div.style.display = 'none';
    div.innerHTML = '';
  }

  #showError(message) {
    const div = document.getElementById('partenero-survey-error-div');
    div.style.display = 'block';
    div.innerHTML = message;
  }

  #onRadioCheck(event) {
    const srcElement = event.srcElement;
    const value = srcElement.value;
    const btnGroup = srcElement.parentElement.parentElement;
    const labels = btnGroup.children;

    for (let i = 0; i < labels.length; i++) {
      const span = labels[i].lastChild;
      if (span.value == value) {
        span.style = this.styles.scale_span__checked;
      } else {
        span.style = this.styles.scale_span;
      }
    }

    const order = srcElement.getAttribute('question_order');
    const questionId = srcElement.getAttribute('question_id');
    if (!this.answers[order]) {
      this.answers[order] = { questionId };
    }
    this.answers[order].value = parseInt(value);
  }

  #onTextareaChange(event) {
    const textarea = event.srcElement;
    const order = textarea.getAttribute('question_order');
    const questionId = textarea.getAttribute('question_id');
    if (!this.answers[order]) {
      this.answers[order] = { questionId };
    }
    this.answers[order].observation = textarea.value;
  }

  #onClose(e) {
    e.stopPropagation();
    this.destroy();

    if (this.survey && this.survey._id && this.user && this.user.email) {
      const today = new Date();
      const hide_untill = today.setDate(today.getDate() + 1);
      this.#saveLocal(`${this.user.email}:${this.survey._id}`, hide_untill);
    }
  }

  #renderScaleQuestion(container, question, index) {
    const btnGroup = document.createElement('div');
    btnGroup.style = this.styles.scale_btnGroup;
    container.append(btnGroup);
    for (let i = question.from; i <= question.to; i++) {
      const label = document.createElement('label');
      label.style = this.styles.scale_label;
      btnGroup.append(label);
      const input = document.createElement('input');
      input.name = `partenero-survey-question-${index}`;
      input.type = 'radio';
      input.value = i;
      input.setAttribute('question_order', question.order);
      input.setAttribute('question_id', question._id);
      input.style = this.styles.scale_input;
      input.addEventListener('change', this.#onRadioCheck.bind(this));
      label.append(input);
      const span = document.createElement('span');
      span.value = i;
      span.style = this.styles.scale_span;
      span.innerHTML = i;
      label.append(span);
    }
  }

  #renderObservation(container, question) {
    const span = document.createElement('span');
    span.innerHTML = "Descrição";
    container.append(span);
    const textarea = document.createElement('textarea');
    textarea.rows = 1;
    textarea.style = this.styles.observation_textarea;
    textarea.setAttribute('question_order', question.order);
    textarea.setAttribute('question_id', question._id);
    textarea.onchange = this.#onTextareaChange.bind(this);
    container.append(textarea);
  }

  #renderErrorDiv(container) {
    const div = document.createElement('div');
    div.id = 'partenero-survey-error-div';
    div.style = this.styles.error_div;
    div.style.display = 'none';
    container.append(div);
  }

  #renderSendButton(container) {
    const button = document.createElement('button');
    button.type = 'submit';
    button.innerHTML = 'Enviar';
    button.style = this.styles.send_button;
    button.id = 'partenero-survey-send-button';
    container.append(button);
  }

  #renderCloseButton(container) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Fechar';
    button.style = this.styles.close_button;
    button.id = 'partenero-survey-close-button';
    button.onclick = this.#onClose.bind(this);
    container.append(button);
  }

  #renderSurvey(container) {
    const survey = this.survey;
    const questions = survey.surveyQuestions;

    let mainDiv = document.getElementById('partenero-survey-main-div');
    if (!mainDiv) {
      mainDiv = document.createElement('div');
      mainDiv.id = 'partenero-survey-main-div';
      container.append(mainDiv);
    }
    mainDiv.onclick = null;
    mainDiv.innerHTML = `<h3 style="margin-bottom: 0; color: ${this.primary_color};">${survey.title}</h3>`;
    if (this.useDefaultStyle) {
      mainDiv.style = this.styles.main_div;
    }

    const form = document.createElement('form');
    form.id = 'partenero-survey-form';
    form.onsubmit = this.#submitAnswers.bind(this);
    mainDiv.append(form);

    questions.forEach((question, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.style = this.styles.question_div;
      form.append(questionDiv);
      const p = document.createElement('p');
      p.innerHTML = question.title;
      questionDiv.append(p);
      switch (question.type) {
        case 'scale': this.#renderScaleQuestion(questionDiv, question, index); break;
      }
      if (question.hasObservation) {
        this.#renderObservation(questionDiv, question);
      }
    });

    this.#renderErrorDiv(form);
    this.#renderSendButton(form);
    this.#renderCloseButton(form);
  }

  #renderFinalMessage() {
    const mainDiv = document.getElementById('partenero-survey-main-div');
    const survey = this.survey;
    let message = 'Obrigado por participar da pesquisa!';
    if (survey.type === 'nps') {
      const answer = this.answers[0].value;
      if (answer < 7) {
        if (survey.messageDetrator) message = survey.messageDetrator;
      } else if (answer < 9) {
        if (survey.messageNeutral) message = survey.messageNeutral;
      } else if (answer <= 10) {
        if (survey.messagePromoter) message = survey.messagePromoter;
      }
    }

    const h2 = document.createElement('h2');
    h2.innerHTML = message;
    const div = document.createElement('div');
    div.append(h2);
    div.style = this.styles.final_message_div;
    mainDiv.innerHTML = "";
    mainDiv.append(div);

    setTimeout(() => mainDiv.remove(), 2000);
    mainDiv.onclick = () => mainDiv.remove();
  }

  #renderFloatButton(container) {
    let mainDiv = document.getElementById('partenero-survey-main-div');
    if (!mainDiv) {
      mainDiv = document.createElement('div');
      mainDiv.id = 'partenero-survey-main-div';
      container.append(mainDiv);
    }
    mainDiv.innerHTML = 'NPS';
    mainDiv.style = this.styles.float_button;
    mainDiv.onclick = this.#renderSurvey.bind(this);
  }


  async getAvailableSurvey() {
    const url = `${this.api_url}/v1/surveys/findPublishedSurvey`;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "ambientId": this.token,
        "type": "nps",
        "considerDate": true,
        "templateId": this.templateId,
      }),
    });

    try {
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data);
      }
      this.#log('--- 1 pesquisa disponível ---');
      this.survey = data;
      return data;
    } catch (e) {
      this.#log('--- nenhuma pesquisa disponível ---');
      return undefined;
    }
  }

  async userCanAnswer(surveyId, email, clientId) {
    const url = `${this.api_url}/v1/surveys/userCanAnswer`;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "ambientId": this.token,
        "mainSurveyId": surveyId,
        "email": email,
        "clientIntegrationId": clientId,
      }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data);
    }
    return data;
  }

  async #sendAnswers() {
    const url = `${this.api_url}/v1/surveys/answerSurvey`;
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      referrerPolicy: 'origin-when-cross-origin',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "ambientId": this.token,
        "mainSurveyId": this.survey._id,
        "email": this.user.email,
        "clientId": this.client_id,
        "answers": this.answers
      }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data);
    }
    return data;
  }

  async #submitAnswers(e) {
    e.preventDefault();

    const { answers, survey } = this;
    const questions = survey.surveyQuestions;
    const button = document.getElementById('partenero-survey-send-button');
    let errors = [];

    this.#resetError();

    this.#log('--- respostas ---');
    this.#log(answers);

    try {
      button.innerHTML = 'Enviando...';
      button.disabled = true;
      questions.forEach(question => {
        const order = question.order;
        if (question.required && (!answers[order] || answers[order].value === undefined)) {
          errors.push(`&cross;${question.title} é obrigatório`);
        } /* else if (question.useForScore && answers[order].value < 9 && !answers[order].observation) {
          errors.push(`&cross;${question.title} deve ter uma observação`);
        } */
      });

      if (errors.length > 0) {
        this.#showError(errors.join(`<br\>`));
        return;
      }

      try {
        await this.#sendAnswers();
        this.#renderFinalMessage();
      } catch (e) {
        this.#showError('ERROR: Erro ao enviar respostas.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      button.innerHTML = 'Enviar';
      button.disabled = false;
    }
  }

  async init(user) {
    const {
      clientId,
      email
    } = user;

    this.user = user;

    let container;
    if (this.containerId) {
      container = document.getElementById(this.containerId);    
    } else {
      container = document.getElementsByTagName('body')[0];
    }
    if (!container) {
      this.#log(`ERROR: não foi encontrado elemento com o id ${this.containerId || 'body'}`);
      return;
    }

    const survey = await this.getAvailableSurvey();

    if (!survey) {
      return;
    }

    const userHasClosed = this.#checkIfUserClosed(email, survey._id);
    if (userHasClosed) {
      this.#log(`--- Usuário ${email} escolheu não responder ---`);
      return;
    }

    const userCanAnswer = await this.userCanAnswer(survey._id, email, clientId);
    this.#log(`--- ${email} ${userCanAnswer.message} ---`);
    if (userCanAnswer.canAnswer) {
      this.client_id = userCanAnswer.clientId;
    } else {
      return;
    }

    this.#renderFloatButton(container);
  }

  destroy() {
    let mainDiv = document.getElementById('partenero-survey-main-div');
    if (mainDiv) {
      mainDiv.remove();
    }
  }
}