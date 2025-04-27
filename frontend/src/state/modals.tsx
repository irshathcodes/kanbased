import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";

interface ModalState<T> {
  activeModal: T | null;
}

interface ModalControls<T> {
  openModal: (modal: T) => void;
  closeModal: () => boolean;
}

const ModalStateContext = createContext<ModalState<any> | null>(null);
const ModalControlsContext = createContext<ModalControls<any> | null>(null);

interface ModalProviderProps<T> {
  children: ReactNode;
}

export function ModalProvider<T>({ children }: ModalProviderProps<T>) {
  const [activeModal, setModal] = useState<T | null>(null);

  const openModal = useCallback((modal: T) => {
    setModal(modal);
  }, []);

  const closeModal = useCallback((): boolean => {
    let wasActive = false;

    setModal((prev) => {
      wasActive = prev !== null;
      return null;
    });

    return wasActive;
  }, []);

  const controls = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal],
  );

  return (
    (<ModalStateContext value={{ activeModal }}>
      <ModalControlsContext value={controls}>
        {children}
      </ModalControlsContext>
    </ModalStateContext>)
  );
}

export function useModalState<T>() {
  const context = useContext(ModalStateContext);
  if (!context) {
    throw new Error("useModalState must be used within ModalProvider");
  }
  return context as ModalState<T>;
}

export function useModalControls<T>() {
  const context = useContext(ModalControlsContext);
  if (!context) {
    throw new Error("useModalControls must be used within ModalProvider");
  }
  return context as ModalControls<T>;
}
