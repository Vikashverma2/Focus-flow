import { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  BarChart3,
  LogIn,
  Search,
} from "lucide-react";
import { Checkbox, Col, Row } from "antd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, subDays, isToday } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import "./UpcomingTasksPanel.css";

interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  icon: string;
  status: "pending" | "completed" | "active";
}
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Mathematics Study",
    startTime: "09:00",
    endTime: "11:00",
    icon: "📚",
    status: "active",
  },
  {
    id: "2",
    title: "Physics Lab",
    startTime: "14:00",
    endTime: "16:00",
    icon: "⚛️",
    status: "pending",
  },
  {
    id: "3",
    title: "Literature Essay",
    startTime: "19:00",
    endTime: "21:00",
    icon: "✍️",
    status: "pending",
  },
  {
    id: "4",
    title: "Chemistry Revision",
    startTime: "11:30",
    endTime: "12:30",
    icon: "🧪",
    status: "completed",
  },
  {
    id: "5",
    title: "Computer Science Practice",
    startTime: "16:30",
    endTime: "18:00",
    icon: "💻",
    status: "pending",
  },
  {
    id: "6",
    title: "Biology Notes Review",
    startTime: "08:00",
    endTime: "09:00",
    icon: "🧬",
    status: "completed",
  },
  {
    id: "7",
    title: "Geography Map Practice",
    startTime: "10:00",
    endTime: "11:00",
    icon: "🗺️",
    status: "pending",
  },
  {
    id: "8",
    title: "Art & Sketching",
    startTime: "13:00",
    endTime: "14:30",
    icon: "🎨",
    status: "active",
  },
  {
    id: "9",
    title: "Economics Reading",
    startTime: "15:00",
    endTime: "16:00",
    icon: "📈",
    status: "completed",
  },
  {
    id: "10",
    title: "English Vocabulary Practice",
    startTime: "20:00",
    endTime: "21:00",
    icon: "📝",
    status: "pending",
  },
];

export const UpcomingTasksPanel = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTasksForDate = (date: Date) => {
    return isToday(date) ? mockTasks : [];
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  const navigateDate = (direction: "prev" | "next") => {
    setSelectedDate((prev) =>
      direction === "prev" ? subDays(prev, 1) : addDays(prev, 1)
    );
  };

  return (
    <Card className="card-container">
      <CardHeader className="flex justify-between ">
        <CardTitle className=" flex  justify-between">
          <div
            style={{
              gap: "10px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Calendar width={"20px"} />
            <p
              style={{
                fontSize: "16px",
              }}
            >
              Tasks List <span style={{ color: "grey" }}>(6 tasks)</span>
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            {/* <ThemeToggle /> */}
            <Search color="grey" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "100px",
                  }}
                >
                  <Avatar>
                    <AvatarFallback>
                      <User className="avatar-icon" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/manage-tasks")}>
                      <Settings className="menu-icon" />
                      Manage Tasks
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/progress")}>
                      <BarChart3 className="menu-icon" />
                      Progress
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="logout-item"
                    >
                      <LogIn className="menu-icon" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    <LogIn className="menu-icon" />
                    Login
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent
        style={{
          height: "70vh",
          overflowY: "auto",
        }}
      >
        {tasksForSelectedDate.length === 0 ? (
          <div className="no-tasks">
            <p className="no-tasks-text">No tasks scheduled</p>
            <p className="no-tasks-subtext">
              {isToday(selectedDate)
                ? "for today"
                : `for ${format(selectedDate, "MMM dd")}`}
            </p>
          </div>
        ) : (
          <div
            style={{
              gap: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {tasksForSelectedDate.map((task) => (
              <Row
                style={{
                  padding: "10px 0px",
                  // backgroundColor: "red",
                }}
              >
                <Row style={{ gap: "10px", width: "100%" }} align={"middle"}>
                  <div className="scale-150">
                    <Checkbox
                      checked={task.status === "completed"}
                      className="custom-checkbox"
                    />
                  </div>

                  <div
                    style={{
                      backgroundColor: "#4e4e4eff",
                      fontSize: "30px",
                      height: "60px",
                      width: "60px",
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      justifyItems: "center",
                      borderRadius: "15px",
                    }}
                  >
                    {task.icon}
                  </div>
                  <Col
                    style={{
                      width: "80%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                      }}
                    >
                      {task.title}
                    </div>
                    <Row justify={"space-between"}>
                      <div>{task.id}</div>
                      <div>At : {task.endTime}</div>
                    </Row>
                  </Col>
                </Row>
              </Row>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
