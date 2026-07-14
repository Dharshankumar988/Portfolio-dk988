export const EventTypes = {
  OPEN_ASSISTANT: "openAssistant",
  CLOSE_ASSISTANT: "closeAssistant",
  ASSISTANT_OPEN_SECTION: "assistantOpenSection",
  ASSISTANT_SEND_QUERY: "assistantSendQuery",
  TERMINAL_EXECUTE: "terminalExecute",
  TERMINAL_OPEN: "terminalOpen",
  TERMINAL_CLOSE: "terminalClose",
  TERMINAL_CLEAR: "terminalClear",
  SCROLL_TO_SECTION: "scrollToSection",
  TUTORIAL_STEP_CHANGED: "tutorialStepChanged",
} as const;

export type PortfolioSection = "about" | "projects" | "skills" | "certificates" | "resume" | "github" | "linkedin" | "contact" | "info" | "history";

// Define the payload for each event
export type EventPayloads = {
  [EventTypes.OPEN_ASSISTANT]: undefined;
  [EventTypes.CLOSE_ASSISTANT]: undefined;
  [EventTypes.ASSISTANT_OPEN_SECTION]: { section: PortfolioSection };
  [EventTypes.ASSISTANT_SEND_QUERY]: { query: string };
  [EventTypes.TERMINAL_EXECUTE]: { command: string };
  [EventTypes.TERMINAL_OPEN]: undefined;
  [EventTypes.TERMINAL_CLOSE]: undefined;
  [EventTypes.TERMINAL_CLEAR]: undefined;
  [EventTypes.SCROLL_TO_SECTION]: { section: PortfolioSection };
  [EventTypes.TUTORIAL_STEP_CHANGED]: { stepIndex: number; isActive: boolean };
};

export const eventBus = {
  dispatch<T extends keyof EventPayloads>(event: T, detail?: EventPayloads[T]) {
    if (typeof window === "undefined") return;
    const customEvent = new CustomEvent(event, { detail });
    window.dispatchEvent(customEvent);
  },
  subscribe<T extends keyof EventPayloads>(
    event: T,
    callback: (detail: EventPayloads[T]) => void
  ) {
    if (typeof window === "undefined") return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<EventPayloads[T]>;
      callback(customEvent.detail);
    };
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },
};

// Global API for future onboarding tutorials
if (typeof window !== "undefined") {
  (window as unknown as { portfolioAPI: unknown }).portfolioAPI = {
    openAssistant: () => eventBus.dispatch(EventTypes.OPEN_ASSISTANT),
    closeAssistant: () => eventBus.dispatch(EventTypes.CLOSE_ASSISTANT),
    assistantOpenSection: (section: PortfolioSection) => eventBus.dispatch(EventTypes.ASSISTANT_OPEN_SECTION, { section }),
    terminalExecute: (command: string) => eventBus.dispatch(EventTypes.TERMINAL_EXECUTE, { command }),
    terminalOpen: () => eventBus.dispatch(EventTypes.TERMINAL_OPEN),
    terminalClose: () => eventBus.dispatch(EventTypes.TERMINAL_CLOSE),
    terminalClear: () => eventBus.dispatch(EventTypes.TERMINAL_CLEAR),
    scrollToPortfolioSection: (section: PortfolioSection) => eventBus.dispatch(EventTypes.SCROLL_TO_SECTION, { section }),
  };
}
