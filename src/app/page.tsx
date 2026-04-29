"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2, Settings, Clock, CircleDollarSign, Wrench, Car, Play, Quote, Star } from "lucide-react";

// Testimonial Videos
const testimonials = [
  { src: "/videos/WhatsApp-Video-2026-03-04-at-08.37.16.mp4", name: "Cristian", info: "Sócio-proprietário da Mecânica Edu — São Paulo" },
  { src: "/videos/WhatsApp-Video-2026-03-04-at-08.23.19.mp4", name: "Rubens", info: "Portugal" },
  { src: "/videos/WhatsApp-Video-2026-03-02-at-19.27.09.mp4", name: "Aluno", info: "Depoimento real" },
  { src: "/videos/WhatsApp-Video-2026-03-03-at-08.48.48.mp4", name: "Fernando", info: "Pato Branco — Paraná" },
  { src: "/videos/WhatsApp-Video-2026-03-21-at-15.44.45.mp4", name: "Luís", info: "São Paulo" },
  { src: "/videos/WhatsApp-Video-2026-03-21-at-15.49.03.mp4", name: "Aluno", info: "Depoimento real" },
];

// Types
type UserData = {
  name: string;
  email: string;
  whatsapp: string;
};

type Option = {
  text: string;
  correct: boolean;
};

type Question = {
  type: "technical" | "strategic";
  text: string;
  options: Option[];
  feedback: string;
  video: {
    show: boolean;
    call?: string;
  };
};

// Data
const questions: Question[] = [
  {
    type: "technical",
    text: "De modo geral, qual é o valor da resistência na rede CAN em sistemas onde todos os módulos estão conectados?",
    options: [
      { text: "A) 120 Ohms", correct: false },
      { text: "B) 120 Volts", correct: false },
      { text: "C) 60 Ohms", correct: true },
      { text: "D) 60 Volts", correct: false },
    ],
    feedback:
      "O valor de 60 Ohms indica o paralelo dos resistores de terminação (120 Ohms cada). Errar esse conceito básico pode te fazer condenar um módulo sem necessidade.",
    video: {
      show: true,
      call: "Veja como um teste de 10 segundos pode salvar seu dia na oficina.",
    },
  },
  {
    type: "strategic",
    text: "Quantos serviços de ticket alto (acima de R$ 500 em mão de obra) você deixou de pegar este mês por não se sentir seguro com o scanner ou osciloscópio?",
    options: [
      { text: "A) Nenhum, eu resolvo tudo.", correct: true },
      { text: "B) Entre 1 e 3 (isso dói no bolso).", correct: true },
      { text: "C) Mais de 5 (estou perdendo muito dinheiro).", correct: true },
    ],
    feedback:
      "A dor de perder dinheiro é duas vezes mais forte que o prazer de ganhar. Se você está recusando serviço, sua oficina está pagando para você trabalhar.",
    video: { show: false },
  },
  {
    type: "technical",
    text: 'Quando aparece um DTC que começa com a letra "U", referindo-se a uma falha de rede CAN, o que isso significa?',
    options: [
      {
        text: 'A) Todo DTC "U" indica obrigatoriamente curto-circuito na rede física.',
        correct: false,
      },
      {
        text: 'B) Pode referir-se apenas a uma falta de informação na rede; o problema pode ser um sensor e não o cabeamento.',
        correct: true,
      },
    ],
    feedback:
      'O DTC "U" refere-se especificamente à comunicação de rede. Trocar o chicote ou módulos sem investigar a causa lógica é o erro fatal do "trocador de peças".',
    video: {
      show: true,
      call: 'Entenda de uma vez por todas o que os códigos "U" querem te dizer.',
    },
  },
  {
    type: "strategic",
    text: "Se você continuar trabalhando exatamente como faz hoje, sem dominar a Rede CAN, como estará sua oficina daqui a 2 anos com a chegada em massa dos carros híbridos e elétricos?",
    options: [
      { text: "A) Acho que consigo me virar.", correct: true },
      { text: "B) Tenho medo de ficar totalmente ultrapassado.", correct: true },
      {
        text: "C) Se eu não mudar agora, vou ter que fechar as portas.",
        correct: true,
      },
    ],
    feedback:
      "Tendemos a deixar as coisas como estão (Status Quo), mas a mudança é inevitável. Quem antecipa a evolução domina a região.",
    video: { show: false },
  },
  {
    type: "technical",
    text: "Qual a impedância de uma rede CAN e qual o equipamento correto para o teste?",
    options: [
      {
        text: "A) 60 Ohms, multímetro na função ohmímetro.",
        correct: false,
      },
      {
        text: "B) 60 Volts, multímetro na função voltímetro.",
        correct: false,
      },
      { text: "C) 60 Ohms, analisador de impedância.", correct: true },
      {
        text: "D) 60 A, analisador de corrente elétrica.",
        correct: false,
      },
    ],
    feedback:
      'O analisador de impedância é a ferramenta de quem não quer "chutar" o diagnóstico.',
    video: {
      show: true,
      call: "Pare de usar ferramentas do século passado para carros modernos.",
    },
  },
];

const profiles = {
  A: {
    title: "Perfil: Iniciante Travado",
    diagnostic:
      'Você é um excelente mecânico prático, mas a eletrônica está te assombrando. Sua oficina vive cheia, mas o lucro é baixo porque você perde horas em defeitos "cabeludos".',
    opportunity:
      'Parar de ser "escravo" do carro e passar a dominar a lógica do diagnóstico.',
  },
  B: {
    title: "Perfil: Reparador em Evolução",
    diagnostic:
      "Você já entende que o multímetro não resolve tudo, mas ainda sente insegurança ao cobrar caro pelo diagnóstico. Falta um <strong>método estruturado</strong>.",
    opportunity:
      "Subir o ticket médio cobrando o diagnóstico separado da execução.",
  },
  C: {
    title: "Perfil: Profissional Pronto para o Topo",
    diagnostic:
      'Você tem a base, mas o mercado de "troca de peça" está te puxando para baixo. Você precisa do selo de <strong>Especialista em Rede CAN</strong> para se tornar a referência da sua cidade.',
    opportunity:
      "Tornar-se a autoridade definitiva e parar de perder serviços complexos e lucrativos.",
  },
};

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -40, scale: 0.98, transition: { duration: 0.3 } },
};

export default function App() {
  const [step, setStep] = useState<"capture" | "intro" | "quiz" | "loading" | "result">("capture");
  const [userData, setUserData] = useState<UserData>({ name: "", email: "", whatsapp: "" });
  const [firstName, setFirstName] = useState("");
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Computed Values
  const currentQuestion = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;

  useEffect(() => {
    if (userData.name) {
      setFirstName(userData.name.split(" ")[0]);
    }
  }, [userData.name]);

  const handleLeadSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep("intro");
  };

  const handleStartQuiz = () => {
    setStep("quiz");
  };

  const handleOptionSelect = (index: number, option: Option) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(index);
    if (option.correct) setScore((prev) => prev + 1);
    setShowFeedback(true);
    
    // Auto scroll to feedback
    setTimeout(() => {
      document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setStep("loading");
      setTimeout(() => {
        setStep("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2500);
    } else {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const getProfile = () => {
    if (score <= 2) return profiles.A;
    if (score <= 4) return profiles.B;
    return profiles.C;
  };

  return (
    <main className="min-h-screen bg-carbon relative flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-radial-glow z-0" />

      <div className="w-full max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: CAPTURE */}
          {step === "capture" && (
            <motion.div key="capture" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Card className="bg-[#0a0a0a]/90 backdrop-blur border-border border-t-4 border-t-primary p-8 md:p-12 shadow-2xl relative overflow-hidden rounded-none">
                <div className="absolute top-[-4px] right-0 w-[30%] h-1 bg-secondary" />
                
                {/* Hero with Diogo photo */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <div className="flex-1">
                    <div className="inline-block border border-primary text-primary px-4 py-1 text-xs font-black uppercase tracking-widest mb-6">
                      Diagnóstico Gratuito
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic text-gradient leading-tight mb-4 tracking-tight">
                      Você sente que está sendo atropelado pela tecnologia dos novos carros?
                    </h1>
                    
                    <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                      Descubra agora o que está <strong className="text-white">travando sua evolução</strong> e saiba se você é um trocador de peças ou um <strong className="text-white">especialista em diagnósticos avançados</strong>. Receba seu diagnóstico em 2 minutos.
                    </p>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div className="w-48 h-56 md:w-56 md:h-64 relative overflow-hidden border-b-4 border-b-primary">
                      <Image src="/images/Hero.png" alt="Diogo — Especialista em Rede CAN" fill className="object-cover object-top" priority />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 whitespace-nowrap">
                      Mestre Diogo
                    </div>
                  </div>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs text-white uppercase tracking-wider font-bold">Seu primeiro nome</Label>
                    <Input 
                      id="name" 
                      required 
                      placeholder="Ex: João" 
                      className="bg-black border-neutral-800 h-14 text-white focus-visible:ring-0 focus-visible:border-l-4 focus-visible:border-l-primary rounded-none transition-all"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs text-white uppercase tracking-wider font-bold">Seu melhor e-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      placeholder="joao@oficina.com.br" 
                      className="bg-black border-neutral-800 h-14 text-white focus-visible:ring-0 focus-visible:border-l-4 focus-visible:border-l-primary rounded-none transition-all"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-xs text-white uppercase tracking-wider font-bold">Seu WhatsApp</Label>
                    <Input 
                      id="whatsapp" 
                      type="tel" 
                      required 
                      placeholder="(11) 99999-9999" 
                      className="bg-black border-neutral-800 h-14 text-white focus-visible:ring-0 focus-visible:border-l-4 focus-visible:border-l-primary rounded-none transition-all"
                      value={userData.whatsapp}
                      onChange={(e) => setUserData({ ...userData, whatsapp: e.target.value })}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-16 text-base md:text-lg font-black uppercase italic tracking-wider bg-gradient-to-br from-primary to-secondary hover:shadow-[0_0_25px_rgba(255,123,41,0.5)] transition-all clip-button text-white border-0 mt-4">
                    Iniciar Diagnóstico Gratuito
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: INTRO */}
          {step === "intro" && (
            <motion.div key="intro" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Card className="bg-[#0a0a0a]/90 backdrop-blur border-border border-t-4 border-t-primary p-8 md:p-12 shadow-2xl relative overflow-hidden rounded-none text-center">
                <div className="absolute top-[-4px] right-0 w-[30%] h-1 bg-secondary" />
                
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 text-white">
                  Bem-vindo, <span className="text-primary">{firstName}</span>!
                </h2>
                <p className="text-2xl font-bold mb-4 text-white">O mercado automotivo mudou.</p>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  Quem não domina a eletrônica está perdendo dinheiro todos os dias para a concessionária. <strong className="text-white">{firstName}</strong>, responda com sinceridade às próximas {questions.length} perguntas e veja seu nível atual.
                </p>
                
                <Button onClick={handleStartQuiz} className="w-full md:w-auto px-12 h-16 text-lg font-black uppercase italic tracking-wider bg-gradient-to-br from-primary to-secondary hover:shadow-[0_0_25px_rgba(255,123,41,0.5)] transition-all clip-button text-white border-0">
                  Começar o Quiz
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: QUIZ */}
          {step === "quiz" && (
            <motion.div key="quiz" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Card className="bg-[#0a0a0a]/90 backdrop-blur border-border border-t-4 border-t-primary p-6 md:p-10 shadow-2xl relative overflow-hidden rounded-none">
                <div className="absolute top-[-4px] right-0 w-[30%] h-1 bg-secondary" />
                
                {/* RPM Progress Bar */}
                <div className="w-full h-3 bg-black border border-neutral-800 mb-6 relative">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(255,123,41,0.5)]"
                    initial={{ width: `${(currentQIndex / questions.length) * 100}%` }}
                    animate={{ width: `${((currentQIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-primary font-black uppercase tracking-widest text-sm mb-6">
                  Pergunta {currentQIndex + 1} de {questions.length}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-8 leading-snug">
                  {currentQuestion.text}
                </h3>
                
                <div className="space-y-4">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = opt.correct;
                    const showCorrect = showFeedback && currentQuestion.type === "technical" && isCorrect;
                    
                    let bgClass = "bg-black hover:bg-[#111] border-neutral-800";
                    let borderLeft = "border-l-transparent group-hover:border-l-primary";
                    let textColor = "text-white";

                    if (showFeedback) {
                      if (isSelected) {
                        if (isCorrect) {
                          bgClass = "bg-primary/10 border-primary";
                          borderLeft = "border-l-primary";
                        } else {
                          bgClass = "bg-secondary/10 border-secondary";
                          borderLeft = "border-l-secondary";
                        }
                      } else if (showCorrect) {
                         bgClass = "bg-primary/10 border-primary";
                         borderLeft = "border-l-primary";
                      }
                    }

                    return (
                      <div 
                        key={idx}
                        onClick={() => handleOptionSelect(idx, opt)}
                        className={`group p-5 border border-l-4 ${borderLeft} ${bgClass} cursor-pointer transition-all duration-200 flex items-center ${showFeedback ? "pointer-events-none" : ""}`}
                      >
                        <span className={`text-lg font-semibold ${textColor}`}>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback Section */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      id="feedback-section"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                      className={`p-6 bg-black border border-neutral-800 border-l-4 ${
                        currentQuestion.type === "technical" && !currentQuestion.options[selectedOption!].correct 
                        ? "border-l-secondary" : "border-l-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">
                          {currentQuestion.type === "technical" && !currentQuestion.options[selectedOption!].correct ? "⚠️" : "✅"}
                        </span>
                        <h4 className="text-xl font-black uppercase text-white">
                          {currentQuestion.type === "technical" && !currentQuestion.options[selectedOption!].correct ? "Atenção!" : 
                           currentQuestion.type === "strategic" ? "Interessante..." : "Excelente!"}
                        </h4>
                      </div>
                      <p className="text-neutral-300 leading-relaxed mb-6">
                        {currentQuestion.feedback}
                      </p>

                      {currentQuestion.video.show && (
                        <div className="mb-6">
                          <div className="w-full aspect-video bg-black border border-neutral-800 relative flex flex-col justify-center items-center cursor-pointer group shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.03),transparent)]" />
                            <PlayCircle className="w-16 h-16 text-neutral-600 group-hover:text-primary transition-all duration-300 group-hover:scale-110 mb-3" />
                            <span className="text-neutral-500 font-semibold z-10">Vídeo Explicativo</span>
                          </div>
                          <p className="text-center text-primary font-bold mt-4">
                            {currentQuestion.video.call}
                          </p>
                        </div>
                      )}

                      <Button onClick={handleNextQuestion} className="w-full h-14 text-base font-black uppercase italic tracking-wider bg-gradient-to-br from-primary to-secondary hover:shadow-[0_0_25px_rgba(255,123,41,0.5)] transition-all clip-button text-white border-0">
                        {isLastQuestion ? "Ver meu diagnóstico ➔" : "Próxima Etapa ➔"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </Card>
            </motion.div>
          )}

          {/* STEP 4: LOADING */}
          {step === "loading" && (
            <motion.div key="loading" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center">
               <Card className="bg-[#0a0a0a]/90 backdrop-blur border-border border-t-4 border-t-primary p-12 shadow-2xl relative rounded-none flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 border-4 border-neutral-800 border-t-primary border-r-secondary rounded-full animate-spin mb-8" />
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
                    Analisando seu perfil, <span className="text-primary">{firstName}</span>...
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Calculando seus resultados e gerando seu diagnóstico personalizado.
                  </p>
               </Card>
            </motion.div>
          )}

          {/* STEP 5: RESULT */}
          {step === "result" && (
            <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
              
              <Card className="bg-[#0a0a0a]/90 backdrop-blur border-border border-t-4 border-t-primary p-8 md:p-10 shadow-2xl relative rounded-none">
                <div className="absolute top-[-4px] right-0 w-[30%] h-1 bg-secondary" />
                
                <div className="inline-block border border-primary text-primary px-6 py-2 text-xl font-black tracking-widest mb-8 bg-black">
                  Sua Pontuação: {score}/5
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black uppercase italic text-white mb-8 tracking-tight">
                  {getProfile().title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-black p-6 border border-neutral-800 border-l-4 border-l-secondary">
                      <h4 className="text-white font-black uppercase mb-3">Diagnóstico Atual</h4>
                      <p className="text-neutral-400 leading-relaxed" dangerouslySetInnerHTML={{__html: getProfile().diagnostic}} />
                   </div>
                   <div className="bg-black p-6 border border-neutral-800 border-l-4 border-l-primary">
                      <h4 className="text-primary font-black uppercase mb-3">Sua Oportunidade</h4>
                      <p className="text-neutral-400 leading-relaxed" dangerouslySetInnerHTML={{__html: getProfile().opportunity}} />
                   </div>
                </div>
              </Card>

              {/* Testimonials Section */}
              <div className="bg-[#0a0a0a] border border-neutral-800 p-8 md:p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <Quote className="text-primary w-8 h-8" />
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                    Quem já passou por isso fala:
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((t, i) => (
                    <div key={i} className="bg-black border border-neutral-800 overflow-hidden group">
                      <video
                        controls
                        preload="metadata"
                        className="w-full aspect-video bg-black"
                        playsInline
                      >
                        <source src={t.src} type="video/mp4" />
                      </video>
                      <div className="p-4 border-t border-neutral-800 border-l-4 border-l-primary">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-black text-lg">{t.name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, s) => (
                              <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-500 text-sm">{t.info}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landing Page Offer Area */}
              <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-neutral-800 p-8 md:p-12 relative overflow-hidden border-b-4 border-b-primary">
                <h1 className="text-3xl md:text-5xl font-black uppercase text-center mb-10 leading-tight">
                  Saia da &quot;Briga por Preço&quot; e torne-se o <span className="text-primary">Especialista</span> que as concessionárias tentam esconder.
                </h1>

                <div className="w-full aspect-video bg-black border border-neutral-800 relative flex flex-col justify-center items-center cursor-pointer group shadow-2xl overflow-hidden mb-10">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.03),transparent)]" />
                  <PlayCircle className="w-20 h-20 text-neutral-600 group-hover:text-primary transition-all duration-300 group-hover:scale-110 mb-4" />
                  <span className="text-neutral-400 font-semibold text-lg z-10">Assista e entenda o método</span>
                </div>

                <p className="text-xl text-center text-neutral-300 mb-10">
                  O curso <strong>Especialista em CAN BUS</strong> é o único passo a passo prático que te ensina a dominar a eletrônica veicular sem precisar de diploma de engenharia.
                </p>

                <div className="grid grid-cols-1 gap-4 mb-12">
                   <div className="flex items-center gap-4 bg-black border border-neutral-800 p-5">
                      <Settings className="text-primary w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-semibold text-lg">Fim do medo de errar diagnóstico e &quot;queimar o nome&quot;.</span>
                   </div>
                   <div className="flex items-center gap-4 bg-black border border-neutral-800 p-5">
                      <Clock className="text-primary w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-semibold text-lg">Redução drástica do tempo perdido com carros parados.</span>
                   </div>
                   <div className="flex items-center gap-4 bg-black border border-neutral-800 p-5">
                      <CircleDollarSign className="text-primary w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-semibold text-lg">Liberdade para cobrar pelo conhecimento, não só pelas peças.</span>
                   </div>
                   <div className="flex items-center gap-4 bg-black border border-neutral-800 p-5">
                      <Wrench className="text-primary w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-semibold text-lg">Domínio total de Scanners e Osciloscópios.</span>
                   </div>
                   <div className="flex items-center gap-4 bg-black border border-neutral-800 p-5">
                      <Car className="text-primary w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-semibold text-lg">Casos reais de oficina: i30, Jetta e Peugeot.</span>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 bg-black p-8 border border-neutral-800 mb-12">
                  <div className="w-32 h-32 relative rounded-full border-4 border-primary overflow-hidden flex-shrink-0">
                    <Image src="/images/Diogo.jpg" alt="Diogo na oficina" fill className="object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-2xl font-black uppercase text-white mb-2">Com o Mestre Diogo</h4>
                    <p className="text-neutral-400 leading-relaxed text-lg">
                      Mais de 15 anos dentro de oficina descascando pepinos que ninguém queria pegar. Criador do método que já destravou milhares de reparadores pelo Brasil.
                    </p>
                  </div>
                </div>

                <div className="text-center bg-[#050505] p-10 border border-neutral-800">
                  <p className="text-xl text-neutral-300 mb-6">
                    A janela de oportunidade está fechando. Ou você se atualiza, <strong className="text-white">ou as oficinas especializadas vão roubar seus melhores clientes.</strong>
                  </p>
                  
                  <div className="mb-10">
                    <div className="text-6xl font-black text-primary drop-shadow-[0_0_20px_rgba(255,123,41,0.5)] mb-2 tracking-tighter">
                      12x R$ 49,90
                    </div>
                    <div className="text-neutral-500 font-bold uppercase tracking-widest text-sm">
                      Ou R$ 497,00 à vista
                    </div>
                  </div>
                  
                  <Button className="w-full h-20 text-xl md:text-2xl font-black uppercase italic tracking-wider bg-gradient-to-br from-primary to-secondary hover:shadow-[0_0_35px_rgba(255,123,41,0.6)] transition-all clip-button text-white border-0 hover:scale-[1.02]">
                    Quero Dominar a Rede CAN Agora
                  </Button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
