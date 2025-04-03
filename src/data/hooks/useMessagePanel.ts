import { useCallback, useState } from "react";

interface UseMessagePanelResult {
  isMessagePanelOpen: boolean;
  messagePanelTitle: string | undefined;
  messagePanelMessage: string | undefined;
  openMessagePanel: (title?: string, message?: string) => void;
  closeMessagePanel: () => void;
}

export const useMessagePanel = (): UseMessagePanelResult => {
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);
  const [messagePanelMessage, setMessagePanelMessage] = useState<
    string | undefined
  >();
  const [messagePanelTitle, setMessagePanelTitle] = useState<
    string | undefined
  >();

  const openMessagePanel = useCallback((title?: string, message?: string) => {
    setMessagePanelTitle(title);
    setMessagePanelMessage(message);
    setIsMessagePanelOpen(true);
  }, []);

  const closeMessagePanel = useCallback(() => {
    setMessagePanelTitle(undefined);
    setMessagePanelMessage(undefined);
    setIsMessagePanelOpen(false);
  }, []);

  return {
    isMessagePanelOpen,
    messagePanelTitle,
    messagePanelMessage,
    openMessagePanel,
    closeMessagePanel,
  };
};
