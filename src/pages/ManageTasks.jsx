import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  List,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ManageTasks.css"; // Your custom CSS file

const mockTasks = [
  {
    id: 1,
    title: "Mathematics Study Session",
    description: "Algebra and Calculus Review",
    status: "active",
    startTime: "09:00",
    endTime: "11:00",
    date: new Date(),
    color: "#1e40af", // Tailwind "blue-900"
    icon: "📚",
    progress: 45,
  },
  {
    id: 2,
    title: "Physics Assignment",
    description: "Complete chapter 5 problems",
    status: "upcoming",
    startTime: "14:00",
    endTime: "16:00",
    date: new Date(),
    color: "#16a34a", // Tailwind "green-600"
    icon: "⚡",
    progress: 0,
  },
  {
    id: 3,
    title: "History Essay",
    description: "World War II research paper",
    status: "completed",
    startTime: "10:00",
    endTime: "12:00",
    date: new Date(Date.now() - 86400000),
    color: "#7c3aed", // Tailwind "purple-600"
    icon: "📝",
    progress: 100,
  },
  {
    id: 4,
    title: "Chemistry Lab Report",
    description: "Organic compounds analysis",
    status: "pending",
    startTime: "16:00",
    endTime: "18:00",
    date: new Date(Date.now() + 86400000),
    color: "#ea580c", // Tailwind "orange-600"
    icon: "🧪",
    progress: 25,
  },
];

export const ManageTasks = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeView, setActiveView] = useState("list");

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const TaskCard = ({ task }) => (
    <Card className="task-card">
      <CardContent className="task-card-content">
        <div className="task-header">
          <div className="task-icon-container" style={{ backgroundColor: task.color }}>
            {task.icon}
          </div>
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.description}</p>
          </div>
          <Badge className={`task-badge ${task.status}`}>{task.status}</Badge>
        </div>
        <div className="task-time-progress">
          <span>{task.startTime} - {task.endTime}</span>
          <span>{task.progress}%</span>
        </div>
        <div className="task-progress-bar">
          <div className="task-progress-fill" style={{ width: `${task.progress}%`, backgroundColor: task.color }}></div>
        </div>
      </CardContent>
    </Card>
  );

  const groupedTasks = {
    active: [],
    upcoming: [],
    completed: [],
    pending: [],
  };

  mockTasks.forEach(task => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  return (
    <div className="manage-tasks-container">
      <Header />

      <main className="main-content">
        <div className="tasks-header">
          <h1 className="tasks-title">Tasks</h1>
          <Button onClick={() => setIsAddTaskOpen(true)} className="add-btn">
            <Plus className="icon" /> Add
          </Button>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView}>
          <div className="tabs-header">
            <TabsList>
              <TabsTrigger value="list">
                <List className="icon" /> List
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarIcon className="icon" /> Calendar
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" className="filter-btn">
              <Filter className="icon" /> Filter
            </Button>
          </div>

          <TabsContent value="list">
            <div className="tasks-list">
              {Object.entries(groupedTasks).map(([status, tasks]) =>
                tasks.length > 0 ? (
                  <div key={status} className="tasks-group">
                    <h3 className={`group-title ${status}`}>
                      {status === "active" && <PlayCircle className="icon" />}
                      {status === "upcoming" && <Clock className="icon" />}
                      {status === "completed" && <CheckCircle2 className="icon" />}
                      {status === "pending" && <AlertCircle className="icon" />}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </h3>
                    <div className="tasks-group-list">
                      {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="calendar-view">
              <Card className="calendar-card">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                </CardContent>
              </Card>

              <Card className="tasks-calendar-card">
                <CardHeader>
                  <CardTitle>Tasks for {selectedDate?.toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="tasks-calendar-content">
                  {mockTasks
                    .filter(task => task.date.toDateString() === selectedDate.toDateString())
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  {mockTasks.filter(task => task.date.toDateString() === selectedDate.toDateString()).length === 0 && (
                    <div className="no-tasks-message">
                      <CalendarIcon className="icon-large" />
                      <p>No tasks scheduled for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
    </div>
  );
};

export default ManageTasks;
