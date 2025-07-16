import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  CheckCircle2,
  Maximize,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./ActiveTaskPanel.css";

export const ActiveTaskPanel = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdownStyle, setCountdownStyle] = useState("digital");

  const totalTime = 7200;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const CircularProgress = ({ value, size = 200 }) => {
    const circumference = 2 * Math.PI * (size / 2 - 10);
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="circular-wrapper" style={{ width: size, height: size }}>
        <svg className="circular-svg" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="circular-track"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="circular-progress"
            strokeLinecap="round"
          />
        </svg>
        <div className="circular-center">
          <div className="circular-time">{formatTime(timeRemaining)}</div>
          <div className="circular-text">{Math.round(progress)}% Complete</div>
        </div>
      </div>
    );
  };

  const renderCountdown = () => {
    switch (countdownStyle) {
      case "circle":
        return (
          <div className="circle-style">
            <CircularProgress
              value={progress}
              size={isFullscreen ? 300 : 200}
            />
            <p className="circle-total">Total: {formatTime(totalTime)}</p>
          </div>
        );

      case "minimal":
        return (
          <div className="minimal-style">
            <div className="minimal-time">{formatTime(timeRemaining)}</div>
            <div className="minimal-progress-wrapper">
              <Progress value={progress} />
            </div>
            <p className="minimal-text">
              {Math.round(progress)}% of {formatTime(totalTime)}
            </p>
          </div>
        );

      case "neon":
        return (
          <div className="neon-style">
            <div className="neon-wrapper">
              <div className="neon-time">{formatTime(timeRemaining)}</div>
              <div className="neon-glow">{formatTime(timeRemaining)}</div>
            </div>
            <div className="neon-bar">
              <div
                className="neon-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="neon-text">{formatTime(totalTime)} session</p>
          </div>
        );

      default:
        return (
          <div className="digital-style">
            <div className="digital-time">{formatTime(timeRemaining)}</div>
            <p className="digital-total">Total: {formatTime(totalTime)}</p>
          </div>
        );
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeRemaining(totalTime);
  };
  const handleComplete = () => {
    setIsCompleted(true);
    setIsRunning(false);
  };

  if (isCompleted) {
    return (
      <Card className="completed-card">
        <CardContent className="completed-content">
          <CheckCircle2 className="completed-icon" />
          <h2 className="completed-title">🎉 Task Completed!</h2>
          <p className="completed-text">
            Great job! You’ve successfully completed your study session.
          </p>
          <Button
            onClick={() => {
              setIsCompleted(false);
              setTimeRemaining(totalTime);
            }}
            className="completed-button"
          >
            Start New Task
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullscreen ? "fullscreen-card" : "normal-card"}>
      <CardHeader className="header">
        <div className="header-top">
          <CardTitle className={`header-title ${isFullscreen ? "large" : ""}`}>
            <p
              style={{
                fontSize: "16px",
              }}
            >
              Active Task
            </p>
          </CardTitle>
          <div className="header-actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCountdownStyle("digital")}>
                  Digital Timer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountdownStyle("circle")}>
                  Circle Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountdownStyle("minimal")}>
                  Minimal Style
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCountdownStyle("neon")}>
                  Neon Effect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {onToggleFullscreen && (
              <Button variant="ghost" size="sm" onClick={onToggleFullscreen}>
                <Maximize />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="content">
        <div className="countdown-container">{renderCountdown()}</div>
        <div className="session-title">
          <h3 className={isFullscreen ? "session-text large" : "session-text"}>
            Mathematics Study Session
          </h3>
        </div>
        <div className="controls">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size={isFullscreen ? "lg" : "default"}
              style={{ backgroundColor: "#007bff", color: "#fff" }}
            >
              <Play /> Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size={isFullscreen ? "lg" : "default"}
              style={{ backgroundColor: "#28a745", color: "#fff" }}
            >
              <Pause /> Pause
            </Button>
          )}

          <Button
            onClick={handleComplete}
            size={isFullscreen ? "lg" : "default"}
            style={{ backgroundColor: "tomato", color: "#fff" }}
          >
            <CheckCircle2 /> Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
