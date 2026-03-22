export enum LogLevel {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  DEBUG = "debug",
}

export interface LogContext {
  service?: string;
  jobName?: string;
  pipelineName?: string;
  subscriber?: string;
  [key: string]: unknown;
}

class PrettyLogger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const icons = {
      [LogLevel.INFO]: "📋",
      [LogLevel.SUCCESS]: "✅",
      [LogLevel.WARNING]: "⚠️",
      [LogLevel.ERROR]: "❌",
      [LogLevel.DEBUG]: "🔍",
    };

    const colors = {
      [LogLevel.INFO]: "\x1b[36m",
      [LogLevel.SUCCESS]: "\x1b[32m",
      [LogLevel.WARNING]: "\x1b[33m",
      [LogLevel.ERROR]: "\x1b[31m",
      [LogLevel.DEBUG]: "\x1b[90m",
    };

    const reset = "\x1b[0m";
    const icon = icons[level];
    const color = colors[level];

    let contextStr = "";
    if (context) {
      const contextParts = Object.entries(context)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`);
      if (contextParts.length > 0) {
        contextStr = ` [${contextParts.join(", ")}]`;
      }
    }

    return `${color}${icon} [${timestamp}] ${this.serviceName.toUpperCase()}${contextStr} | ${message}${reset}`;
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  success(message: string, context?: LogContext) {
    console.log(this.formatMessage(LogLevel.SUCCESS, message, context));
  }

  warning(message: string, context?: LogContext) {
    console.log(this.formatMessage(LogLevel.WARNING, message, context));
  }

  error(message: string, context?: LogContext) {
    console.log(this.formatMessage(LogLevel.ERROR, message, context));
  }

  debug(message: string, context?: LogContext) {
    console.log(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  // Special methods for job tracking
  jobStarted(jobName: string, pipelineName?: string) {
    this.info("🚀 Job processing started", { jobName, pipelineName });
  }

  jobCompleted(jobName: string, result?: unknown) {
    this.success("🎉 Job completed successfully", {
      jobName,
      result: result ? JSON.stringify(result).substring(0, 100) : "N/A",
    });
  }

  jobFailed(jobName: string, error: string) {
    this.error("💥 Job failed", { jobName, error });
  }

  deliveryAttempt(
    jobName: string,
    pipelineName: string,
    subscriber: string,
    attempt: number,
    status: string,
  ) {
    const statusIcon = status === "success" ? "✅" : "❌";
    this.info(`📤 Delivery attempt ${attempt} ${statusIcon} ${subscriber}`, {
      jobName,
      pipelineName,
      subscriber,
      attempt,
      status,
    });
  }

  pipelineStep(stepName: string, jobName: string, data?: unknown) {
    this.info(`⚙️ Pipeline step: ${stepName}`, {
      jobName,
      data: data ? JSON.stringify(data).substring(0, 50) : "N/A",
    });
  }
}

export function createLogger(serviceName: string): PrettyLogger {
  return new PrettyLogger(serviceName);
}
