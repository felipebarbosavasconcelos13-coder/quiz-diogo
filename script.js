document.addEventListener('DOMContentLoaded', () => {
    // State
    let userData = {
        name: '',
        email: '',
        whatsapp: ''
    };
    let currentStep = 'capture';
    let currentQuestionIndex = 0;
    let score = 0;

    // Questions Data
    const questions = [
        {
            type: 'technical',
            text: 'De modo geral, qual é o valor da resistência na rede CAN em sistemas onde todos os módulos estão conectados?',
            options: [
                { text: 'A) 120 Ohms', correct: false },
                { text: 'B) 120 Volts', correct: false },
                { text: 'C) 60 Ohms', correct: true },
                { text: 'D) 60 Volts', correct: false }
            ],
            feedback: 'Se você marcou 60 Ohms, acertou! Isso indica o paralelo dos resistores de terminação. Errar isso pode te fazer condenar um módulo sem necessidade.',
            video: {
                show: true,
                src: 'Videos respostas/1.mp4',
                call: 'Veja como um teste de 10 segundos pode salvar seu dia na oficina.'
            }
        },
        {
            type: 'strategic',
            text: 'Quantos serviços de ticket alto (acima de R$ 500 em mão de obra) você deixou de pegar este mês por não se sentir seguro com o scanner ou osciloscópio?',
            options: [
                { text: 'A) Nenhum, eu resolvo tudo.', correct: true }, // Any answer gives point for strategic
                { text: 'B) Entre 1 e 3 (isso dói no bolso).', correct: true },
                { text: 'C) Mais de 5 (estou perdendo muito dinheiro).', correct: true }
            ],
            feedback: 'A dor de perder dinheiro é duas vezes mais forte que o prazer de ganhar. Se você está recusando serviço, sua oficina está pagando para você trabalhar.',
            video: { show: false }
        },
        {
            type: 'technical',
            text: 'Quando aparece um DTC que começa com a letra "U", referindo-se a uma falha de rede CAN, o que isso significa?',
            options: [
                { text: 'A) Todo DTC "U" indica obrigatoriamente curto-circuito na rede física.', correct: false },
                { text: 'B) Pode referir-se apenas a uma falta de informação na rede; o problema pode ser um sensor e não o cabeamento.', correct: true }
            ],
            feedback: 'Exato! O DTC "U" é sobre comunicação. Trocar o chicote sem entender isso é o erro fatal do "trocador de peças".',
            video: {
                show: true,
                src: 'Videos respostas/2.mp4',
                call: 'Entenda de uma vez por todas o que os códigos "U" querem te dizer.'
            }
        },
        {
            type: 'strategic',
            text: 'Se você continuar trabalhando exatamente como faz hoje, sem dominar a Rede CAN, como estará sua oficina daqui a 2 anos com a chegada em massa dos carros híbridos e elétricos?',
            options: [
                { text: 'A) Acho que consigo me virar.', correct: true },
                { text: 'B) Tenho medo de ficar totalmente ultrapassado.', correct: true },
                { text: 'C) Se eu não mudar agora, vou ter que fechar as portas.', correct: true }
            ],
            feedback: 'Tendemos a deixar as coisas como estão (Status Quo), mas a mudança é inevitável. Quem antecipa a evolução domina a região.',
            video: { show: false }
        },
        {
            type: 'technical',
            text: 'Qual a impedância de uma rede CAN e qual o equipamento correto para o teste?',
            options: [
                { text: 'A) 60 Ohms, multímetro na função ohmímetro.', correct: false },
                { text: 'B) 60 Volts, multímetro na função voltímetro.', correct: false },
                { text: 'C) 60 Ohms, analisador de impedância.', correct: true },
                { text: 'D) 60 A, analisador de corrente elétrica.', correct: false }
            ],
            feedback: 'O analisador de impedância é a ferramenta de quem não quer "chutar" o diagnóstico.',
            video: {
                show: true,
                src: 'Videos respostas/3.mp4',
                call: 'Pare de usar ferramentas do século passado para carros modernos.'
            }
        }
    ];

    // Profiles Data
    const profiles = {
        A: {
            title: 'Perfil: Iniciante Travado',
            diagnostic: 'Você é um excelente mecânico prático, mas a eletrônica está te assombrando. Sua oficina vive cheia, mas o lucro é baixo porque você perde horas em defeitos "cabeludos".',
            opportunity: 'Parar de ser "escravo" do carro e passar a dominar a lógica do diagnóstico.'
        },
        B: {
            title: 'Perfil: Reparador em Evolução',
            diagnostic: 'Você já entende que o multímetro não resolve tudo, mas ainda sente insegurança ao cobrar caro pelo diagnóstico. Falta um <strong>método estruturado</strong>.',
            opportunity: 'Subir o ticket médio cobrando o diagnóstico separado da execução.'
        },
        C: {
            title: 'Perfil: Profissional Pronto para o Topo',
            diagnostic: 'Você tem a base, mas o mercado de "troca de peça" está te puxando para baixo. Você precisa do selo de <strong>Especialista em Rede CAN</strong> para se tornar a referência da sua cidade.',
            opportunity: 'Tornar-se a autoridade definitiva e parar de perder serviços complexos e lucrativos.'
        }
    };

    // DOM Elements
    const form = document.getElementById('lead-form');
    const nameSpans = document.querySelectorAll('.lead-name');
    
    // Steps
    const stepCapture = document.getElementById('step-capture');
    const stepIntro = document.getElementById('step-intro');
    const stepQuiz = document.getElementById('step-quiz');
    const stepLoading = document.getElementById('step-loading');
    const stepResult = document.getElementById('step-result');

    // Quiz Elements
    const qNum = document.getElementById('current-q-num');
    const qText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressFill = document.getElementById('quiz-progress');
    const btnStartQuiz = document.getElementById('btn-start-quiz');
    const btnNextQuestion = document.getElementById('btn-next-question');
    
    // Feedback Elements
    const feedbackSection = document.getElementById('feedback-section');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const videoContainer = document.getElementById('video-container');
    const feedbackVideo = document.getElementById('feedback-video');
    const videoCall = document.getElementById('video-call');

    // Result Elements
    const finalScore = document.getElementById('final-score');
    const profileTitle = document.getElementById('profile-title');
    const profileDiagnostic = document.getElementById('profile-diagnostic');
    const profileOpportunity = document.getElementById('profile-opportunity');

    // Utility to switch steps
    function showStep(stepElement) {
        [stepCapture, stepIntro, stepQuiz, stepLoading, stepResult].forEach(el => {
            el.classList.add('hidden');
        });
        stepElement.classList.remove('hidden');
    }

    // Form Submit (Lead Capture)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        userData.name = document.getElementById('name').value.trim();
        userData.email = document.getElementById('email').value.trim();
        const whatsappRaw = document.getElementById('whatsapp').value.replace(/\D/g, '');

        if (whatsappRaw.length !== 11) {
            alert('Informe um número de WhatsApp válido com DDD (ex: 11999999999).');
            return;
        }

        if (/^(\d)\1{10}$/.test(whatsappRaw)) {
            alert('Número de WhatsApp inválido. Verifique e tente novamente.');
            return;
        }

        const ddd = parseInt(whatsappRaw.substring(0, 2));
        if (ddd < 11 || ddd > 99) {
            alert('DDD inválido. Informe um número de WhatsApp com DDD correto.');
            return;
        }

        userData.whatsapp = whatsappRaw;

        // Get first name
        const firstName = userData.name.split(' ')[0];
        
        // Populate name spans
        nameSpans.forEach(span => {
            span.textContent = firstName;
        });

        // Push to dataLayer for GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'lead_capture',
            first_name: firstName,
            last_name: userData.name.split(' ').slice(1).join(' ') || '',
            phone: userData.whatsapp,
            email: userData.email
        });

        console.log('Lead Capturado:', userData);

        showStep(stepIntro);
    });

    // WhatsApp Input Formatting
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', () => {
        let value = whatsappInput.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length > 0) {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + (value.length > 7 ? '-' + value.substring(7) : '');
        }
        whatsappInput.value = value;
    });

    // Start Quiz
    btnStartQuiz.addEventListener('click', () => {
        renderQuestion();
        showStep(stepQuiz);
    });

    // Render Question
    function renderQuestion() {
        const q = questions[currentQuestionIndex];
        
        // Reset UI
        feedbackSection.classList.add('hidden');
        optionsContainer.innerHTML = '';
        
        // Update Progress & Text
        qNum.textContent = currentQuestionIndex + 1;
        progressFill.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
        qText.textContent = q.text;

        // Render Options
        q.options.forEach((opt, index) => {
            const div = document.createElement('div');
            div.className = 'option-card';
            div.textContent = opt.text;
            
            div.addEventListener('click', () => handleOptionClick(div, opt));
            optionsContainer.appendChild(div);
        });

        // Update button text if it's the last question
        if (currentQuestionIndex === questions.length - 1) {
            btnNextQuestion.textContent = 'Ver meu diagnóstico ➔';
        } else {
            btnNextQuestion.textContent = 'Próxima Etapa ➔';
        }
    }

    // Handle Option Click
    function handleOptionClick(selectedDiv, optionData) {
        // Prevent multiple clicks
        const allOptions = optionsContainer.querySelectorAll('.option-card');
        allOptions.forEach(opt => opt.classList.add('disabled'));

        const q = questions[currentQuestionIndex];
        const isCorrect = optionData.correct;

        if (isCorrect) {
            score++;
            selectedDiv.classList.add('selected-correct');
            feedbackBoxState('correct', 'Excelente!', q.feedback);
        } else {
            selectedDiv.classList.add('selected-wrong');
            // Find and highlight correct answer if it's a technical question
            if (q.type === 'technical') {
                const correctIndex = q.options.findIndex(o => o.correct);
                allOptions[correctIndex].classList.add('selected-correct');
                feedbackBoxState('wrong', 'Atenção!', q.feedback);
            } else {
                feedbackBoxState('correct', 'Interessante...', q.feedback);
            }
        }

        // Handle Video Display
        if (q.video.show) {
            videoContainer.classList.remove('hidden');
            videoCall.textContent = q.video.call;
            if (q.video.src && feedbackVideo) {
                feedbackVideo.src = q.video.src;
                feedbackVideo.load();
            }
        } else {
            videoContainer.classList.add('hidden');
        }

        // Show Feedback
        feedbackSection.classList.remove('hidden');
        
        // Scroll to feedback
        setTimeout(() => {
            feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function feedbackBoxState(type, title, text) {
        feedbackSection.className = `feedback-box ${type}`;
        feedbackIcon.textContent = type === 'correct' ? '✅' : '⚠️';
        feedbackTitle.textContent = title;
        feedbackText.innerHTML = text;
    }

    // Next Question or Finish
    btnNextQuestion.addEventListener('click', () => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    });

    // Finish Quiz
    function finishQuiz() {
        progressFill.style.width = '100%';
        showStep(stepLoading);

        // Simulate analysis delay
        setTimeout(() => {
            calculateResult();
            showStep(stepResult);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2500);
    }

    // Calculate Result
    function calculateResult() {
        let profileKey = 'A';
        
        if (score <= 2) profileKey = 'A';
        else if (score <= 4) profileKey = 'B';
        else profileKey = 'C';

        const profile = profiles[profileKey];

        finalScore.textContent = score;
        profileTitle.innerHTML = profile.title;
        profileDiagnostic.innerHTML = profile.diagnostic;
        profileOpportunity.innerHTML = profile.opportunity;
    }
});
