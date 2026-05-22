"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import {
  LogOut,
  Plus,
  Timer,
  Utensils,
  Activity,
  Loader2,
  Trash2,
  Pencil,
  Calendar,
  Clock,
  Edit3,
  X,
  Play,
  Square,
  BarChart2,
  History,
  Leaf, // <-- Ícone importado da Landing Page
} from "lucide-react";

import MealModal from "./components/MealModal";
import AIAssistant from "./components/AIAssistant";
import WaterTracker from "./components/WaterTracker"; 

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Meal {
  id: string;
  description: string;
  calories: number;
  type: string;
  dateRaw: number;
}

interface Fast {
  id: string;
  startTime: number;
  endTime: number | null;
  type: string;
  goalHours: number;
}

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false); // Correção de Hidratação do Next.js
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [dailyGoal, setDailyGoal] = useState(2000);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [consumedCalories, setConsumedCalories] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState("");

  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [viewEndDate, setViewEndDate] = useState<Date | null>(null);

  const [plannerDays, setPlannerDays] = useState<
    { label: string; dateStr: string; dayNum: number }[]
  >([]);

  // JEJUM
  const [activeFast, setActiveFast] = useState<Fast | null>(null);
  const [fastHistory, setFastHistory] = useState<Fast[]>([]);
  const [fastType, setFastType] = useState("16:8");
  const [elapsedFastTime, setElapsedFastTime] = useState("00h 00m 00s");
  const [fastProgress, setFastProgress] = useState(0);

  // Define os valores iniciais de data apenas no lado do cliente para evitar erro de div (hydration)
  useEffect(() => {
    setIsMounted(true);
    setSelectedDateStr(new Date().toISOString().split("T")[0]);
    setViewEndDate(new Date());
  }, []);

  useEffect(() => {
    if (!viewEndDate) return;

    const days = [];
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(viewEndDate);
      d.setDate(d.getDate() - i);

      days.push({
        label: weekdays[d.getDay()],
        dayNum: d.getDate(),
        dateStr: d.toISOString().split("T")[0],
      });
    }

    setPlannerDays(days);
  }, [viewEndDate]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const unsubscribeProfile = onSnapshot(
        doc(db, "users", currentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setDailyGoal(docSnap.data().dailyGoal || 2000);
            setLoading(false);
          } else {
            router.push("/onboarding");
          }
        }
      );

      const unsubscribeMeals = onSnapshot(
        collection(db, "users", currentUser.uid, "meals"),
        (snapshot) => {
          const fetchedMeals: Meal[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            fetchedMeals.push({
              id: doc.id,
              description: data.description,
              calories: data.calories,
              type: data.type,
              dateRaw: data.dateRaw || Date.now(),
            });
          });

          fetchedMeals.sort((a, b) => a.dateRaw - b.dateRaw);
          setMeals(fetchedMeals);
        }
      );

      const unsubscribeFasts = onSnapshot(
        collection(db, "users", currentUser.uid, "fasts"),
        (snapshot) => {
          let currentFast: Fast | null = null;
          const history: Fast[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();

            const fastObj = {
              id: doc.id,
              startTime: data.startTime,
              endTime: data.endTime,
              type: data.type,
              goalHours: data.goalHours,
            };

            if (!data.endTime) {
              currentFast = fastObj;
            } else {
              history.push(fastObj);
            }
          });

          history.sort((a, b) => (b.endTime || 0) - (a.endTime || 0));

          setActiveFast(currentFast);
          setFastHistory(history);
        }
      );

      return () => {
        unsubscribeProfile();
        unsubscribeMeals();
        unsubscribeFasts();
      };
    });

    return () => unsubscribeAuth();
  }, [router]);

  const filteredMeals = meals.filter((meal) => {
    const mealDateStr = new Date(meal.dateRaw).toISOString().split("T")[0];
    return mealDateStr === selectedDateStr;
  });

  useEffect(() => {
    const total = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
    setConsumedCalories(total);
  }, [meals, selectedDateStr, filteredMeals]);

  // RELÓGIO DO JEJUM
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeFast) {
      interval = setInterval(() => {
        const now = Date.now();
        const diffMs = now - activeFast.startTime;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        const secs = Math.floor((diffMs / 1000) % 60);

        const format = (n: number) => n.toString().padStart(2, "0");

        setElapsedFastTime(`${format(hours)}h ${format(mins)}m ${format(secs)}s`);

        const goalMs = activeFast.goalHours * 60 * 60 * 1000;
        const progress = Math.min((diffMs / goalMs) * 100, 100);

        setFastProgress(progress);
      }, 1000);
    } else {
      setElapsedFastTime("00h 00m 00s");
      setFastProgress(0);
    }

    return () => clearInterval(interval);
  }, [activeFast]);

  // AÇÕES DO JEJUM
  const handleStartFast = async () => {
    if (!user) return;

    const goalMap: Record<string, number> = {
      "16:8": 16,
      "18:6": 18,
      "20:4": 20,
      "24h": 24,
    };

    const goalHours = goalMap[fastType] || 16;

    try {
      await addDoc(collection(db, "users", user.uid, "fasts"), {
        startTime: Date.now(),
        endTime: null,
        type: fastType,
        goalHours,
      });
    } catch (error) {
      alert("Erro ao iniciar jejum.");
    }
  };

  const handleEndFast = async () => {
    if (!user || !activeFast) return;

    try {
      await updateDoc(doc(db, "users", user.uid, "fasts", activeFast.id), {
        endTime: Date.now(),
      });
    } catch (error) {
      alert("Erro ao encerrar jejum.");
    }
  };

  const handleSaveNewGoal = async () => {
    if (!user || !newGoalInput || isNaN(Number(newGoalInput))) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        dailyGoal: Number(newGoalInput),
      });

      setIsGoalModalOpen(false);
    } catch (error) {
      alert("Erro ao atualizar a meta.");
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!user || !window.confirm("Tem certeza que deseja excluir esta refeição?")) return;
    await deleteDoc(doc(db, "users", user.uid, "meals", id));
  };

  // Previne os erros de hidratação (divs desalinhadas entre server e cliente)
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F5]">
        <Loader2 className="animate-spin text-[#2E4F3B] w-10 h-10 mb-4" />
        <p className="text-gray-500 font-medium">Sincronizando seus dados...</p>
      </div>
    );
  }

  const progressPercentage = Math.min((consumedCalories / dailyGoal) * 100, 100);

  // DADOS GRÁFICO
  const chartData = plannerDays.map((day) => {
    const dayMeals = meals.filter((m) => {
      const mDate = new Date(m.dateRaw).toISOString().split("T")[0];
      return mDate === day.dateStr;
    });

    const totalDayCals = dayMeals.reduce((sum, m) => sum + m.calories, 0);

    return {
      name: day.label,
      calorias: totalDayCals,
    };
  });

  return (
    <div className="min-h-screen bg-[#F5F7F5] font-sans antialiased text-gray-800 relative">
      
      {/* HEADER ATUALIZADO (Base Landing Page) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-16 py-4 flex justify-between items-center bg-[#2E4F3B]/90 backdrop-blur-md shadow-md border-b border-white/5 transition-all text-white">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <div className="bg-[#A7D1AB] p-2 rounded-xl shadow-sm flex items-center justify-center">
            <Leaf className="text-[#2E4F3B] w-6 h-6" />
          </div>
          NutriTrack
        </div>

        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 text-[#C2D6C6] hover:text-white transition-colors text-sm font-semibold"
        >
          <LogOut size={18} /> Sair
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        {/* META */}
        <div className="bg-gradient-to-r from-[#2E4F3B] to-[#3F634D] text-white p-6 md:p-8 rounded-3xl shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] bg-[#496E58] text-[#A7D1AB] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Acompanhamento Atual
            </span>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
              Sua Meta Diária é de{" "}
              <span className="text-[#A7D1AB] font-black">{dailyGoal} kcal</span>
            </h2>

            <p className="text-sm text-[#C2D6C6] mt-1">
              Mantenha seus registros atualizados para acompanhar sua evolução.
            </p>
          </div>

          <button
            onClick={() => {
              setNewGoalInput(dailyGoal.toString());
              setIsGoalModalOpen(true);
            }}
            className="flex items-center gap-2 bg-white text-[#2E4F3B] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm shrink-0"
          >
            <Edit3 size={16} /> Alterar Meta
          </button>
        </div>

{/* CARDS */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-stretch">

  {/* CARD BALANÇO */}
  <div className="xl:col-span-2 h-full">
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden h-full flex flex-col">

      {/* Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#A7D1AB]/10 blur-3xl rounded-full" />

      <div className="relative z-10 flex flex-col h-full">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6 gap-4">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#F0F7F2] p-2 rounded-xl">
                <Utensils size={16} className="text-[#2E4F3B]" />
              </div>

              <h3 className="font-bold text-gray-800 text-sm">
                Balanço do Dia
              </h3>
            </div>

            <p className="text-xs text-gray-400">
              Acompanhe seu consumo diário
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-black text-[#2E4F3B] leading-none">
              {consumedCalories}
            </p>

            <span className="text-xs text-gray-400 font-medium">
              de {dailyGoal} kcal
            </span>
          </div>
        </div>

        {/* PROGRESSO */}
        <div className="mb-6">
          <div className="flex justify-between text-[11px] font-medium text-gray-400 mb-2">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${
                consumedCalories > dailyGoal
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-[#2E4F3B] to-[#A7D1AB]"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* WATER TRACKER */}
        <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-4 mt-auto">
          <WaterTracker
            user={user}
            selectedDateStr={selectedDateStr}
          />
        </div>
      </div>
    </div>
  </div>

  {/* CARD JEJUM */}
  <div className="h-full">
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden">

      {/* Glow */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#A7D1AB]/10 blur-3xl rounded-full" />

      {activeFast && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-[#A7D1AB] to-[#2E4F3B] transition-all duration-1000"
            style={{ width: `${fastProgress}%` }}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#F0F7F2] p-2 rounded-xl">
                <Timer
                  size={16}
                  className={
                    activeFast
                      ? "text-[#2E4F3B] animate-pulse"
                      : "text-[#2E4F3B]"
                  }
                />
              </div>

              <h3 className="font-bold text-gray-800 text-sm">
                Jejum Intermitente
              </h3>
            </div>

            <p className="text-xs text-gray-400">
              Controle seu período de jejum
            </p>
          </div>

          {activeFast ? (
            <span className="text-[10px] bg-[#E8EDDF] text-[#2E4F3B] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {activeFast.type}
            </span>
          ) : (
            <select
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none text-gray-600"
              value={fastType}
              onChange={(e) => setFastType(e.target.value)}
            >
              <option value="16:8">16:8</option>
              <option value="18:6">18:6</option>
              <option value="20:4">20:4</option>
              <option value="24h">24h</option>
            </select>
          )}
        </div>

        {/* TIMER */}
        <div className="flex flex-col items-center justify-center flex-1">

          <div className="w-36 h-36 rounded-full border-[10px] border-[#F0F7F2] flex items-center justify-center relative mb-5">

            <div
              className="absolute inset-0 rounded-full border-[10px] border-[#A7D1AB]"
              style={{
                clipPath: `inset(${100 - fastProgress}% 0 0 0)`,
              }}
            />

            <div className="text-center px-2">
              <p
                className={`text-xl font-black tracking-tight ${
                  activeFast
                    ? "text-[#2E4F3B]"
                    : "text-gray-300"
                }`}
              >
                {elapsedFastTime}
              </p>

              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                tempo atual
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            {Math.round(fastProgress)}% concluído
          </p>

          {activeFast ? (
            <button
              onClick={handleEndFast}
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Square size={14} />
              Encerrar Jejum
            </button>
          ) : (
            <button
              onClick={handleStartFast}
              className="w-full bg-[#2E4F3B] text-white hover:bg-[#1f3628] font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Play size={14} />
              Iniciar Jejum
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
        {/* PLANNER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex justify-between items-center mb-3 ml-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={14} /> Planner de Dias
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium hidden md:inline">
                Buscar histórico:
              </span>
              <input
                type="date"
                className="text-xs border border-gray-200 text-gray-600 rounded-lg px-2 py-1 outline-none focus:border-[#2E4F3B]"
                value={selectedDateStr}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDateStr(e.target.value);
                    setViewEndDate(new Date(e.target.value + "T12:00:00"));
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {plannerDays.map((day, idx) => {
              const isSelected = day.dateStr === selectedDateStr;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateStr(day.dateStr)}
                  className={`p-2 md:p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#2E4F3B] text-white shadow-sm scale-105 font-bold"
                      : "bg-[#FAFAFA] text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-70">
                    {day.label}
                  </span>
                  <span className="text-base md:text-lg font-black mt-0.5">
                    {day.dayNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* REFEIÇÕES */}
        <div className="mb-6 flex justify-between items-end mt-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-gray-900 mb-1">
              Refeições do Dia
            </h1>
          </div>
          <button
            onClick={() => {
              setMealToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-[#2E4F3B] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1f3628] transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Nova
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {filteredMeals.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">
              Nenhuma refeição registrada para a data selecionada.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredMeals.map((meal) => {
                const mealTimeStr = new Date(meal.dateRaw).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={meal.id}
                    className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-[#FAFAFA] hover:border-[#C2D6C6] transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 capitalize flex items-center gap-2">
                        {meal.description}
                        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-0.5">
                          <Clock size={10} /> {mealTimeStr}
                        </span>
                      </h4>
                      <span className="text-[9px] font-bold text-[#2E4F3B] uppercase bg-[#E8EDDF] px-2 py-0.5 rounded-md mt-1 inline-block">
                        {meal.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 text-sm">
                        {meal.calories} kcal
                      </span>
                      <button
                        onClick={() => {
                          setMealToEdit(meal);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GRÁFICOS ABAIXO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* RESUMO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-6">
              <BarChart2 size={16} className="text-[#A7D1AB]" />
              Resumo da Semana
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <Tooltip
                    cursor={{ fill: "#F9FAFB" }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <ReferenceLine y={dailyGoal} stroke="#A7D1AB" strokeDasharray="3 3" />
                  <Bar dataKey="calorias" fill="#2E4F3B" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-2">
              A linha pontilhada representa sua meta diária de {dailyGoal} kcal.
            </p>
          </div>

          {/* HISTÓRICO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2 mb-6">
              <History size={16} className="text-[#A7D1AB]" />
              Histórico de Jejuns
            </h3>

            {fastHistory.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-center text-gray-400 text-sm">
                Nenhum jejum concluído ainda.
                <br />
                Inicie seu primeiro jejum no card acima.
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {fastHistory.map((fast) => {
                  const durationMs = (fast.endTime || 0) - fast.startTime;
                  const hours = Math.floor(durationMs / (1000 * 60 * 60));
                  const mins = Math.floor((durationMs / (1000 * 60)) % 60);
                  const dateStr = new Date(fast.startTime).toLocaleDateString("pt-BR");

                  return (
                    <div
                      key={fast.id}
                      className="flex justify-between items-center p-3 rounded-xl border border-gray-50 bg-[#FAFAFA]"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#2E4F3B] uppercase bg-[#E8EDDF] px-2 py-0.5 rounded-md inline-block mb-1">
                          {fast.type}
                        </span>
                        <p className="text-xs text-gray-500 font-medium">Iniciado em {dateStr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-800">
                          {hours}h {mins}m
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Duração
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>



{/* FOOTER */}
<footer className="mt-20 bg-[#2E4F3B] text-white border-t border-[#496E58]/40 relative overflow-hidden">
  {/* Detalhe sutil de luz no topo do footer */}
  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A7D1AB]/30 to-transparent" />

  <div className="max-w-6xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
      
      {/* BRANDING */}
      <div className="max-w-sm">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-3">
          <div className="bg-[#A7D1AB] p-2 rounded-xl shadow-md flex items-center justify-center transition-transform hover:rotate-6 duration-300">
            <Leaf className="text-[#2E4F3B] w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-white to-[#C2D6C6] bg-clip-text text-transparent">
            NutriTrack
          </span>
        </div>
        <p className="text-sm text-[#C2D6C6]/80 leading-relaxed">
          Sua jornada para uma vida mais saudável. Acompanhe sua alimentação, controle seus jejuns e gerencie suas metas diárias em um só lugar.
        </p>
      </div>

      {/* QUICK STATUS */}
      <div className="flex flex-col sm:flex-row gap-4 md:justify-end w-full">
        <div className="bg-[#3F634D]/60 backdrop-blur-sm border border-[#496E58]/30 rounded-2xl p-4 flex-1 max-w-[240px] shadow-sm">
          <p className="text-[11px] font-bold text-[#A7D1AB] uppercase tracking-wider mb-1">Meta Diária</p>
          <p className="text-xl font-black text-white tracking-tight">{dailyGoal} <span className="text-xs font-normal text-[#C2D6C6]">kcal</span></p>
        </div>

        <div className="bg-[#3F634D]/60 backdrop-blur-sm border border-[#496E58]/30 rounded-2xl p-4 flex-1 max-w-[240px] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#A7D1AB] uppercase tracking-wider mb-1">Consumido Hoje</p>
            <p className="text-xl font-black text-white tracking-tight">{consumedCalories} <span className="text-xs font-normal text-[#C2D6C6]">kcal</span></p>
          </div>
          {/* Mini barra de progresso sutil */}
          <div className="w-full bg-[#2E4F3B] h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-[#A7D1AB] h-full transition-all duration-500" 
              style={{ width: `${Math.min((consumedCalories / dailyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

    </div>

    {/* DIVIDER */}
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#496E58]/40 to-transparent my-8" />

    {/* COPYRIGHT */}
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left text-xs text-[#C2D6C6]/60">
      <p>© 2026 NutriTrack. Todos os direitos reservados.</p>
      <p className="flex items-center gap-1.5">
        Feito para uma vida mais saudável 
        <span className="inline-block animate-pulse text-[#A7D1AB]">🌱</span>
      </p>
    </div>
  </div>

</footer>


     <AIAssistant /> 
  
      {/* MODAIS */}
      {isModalOpen && (
        <MealModal
          user={user}
          mealToEdit={mealToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setMealToEdit(null);
          }}
        />
      )}

      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Alterar Meta Diária</h2>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Nova Meta (Kcal)
              </label>

              <input
                type="number"
                min="500"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B]"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
              />

              <button
                onClick={handleSaveNewGoal}
                className="w-full bg-[#2E4F3B] text-white py-3.5 mt-5 rounded-xl font-bold flex justify-center items-center hover:bg-[#1f3628] transition-all"
              >
                Salvar Nova Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}