"use client";

import { m, AnimatePresence } from "framer-motion";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              {isDangerous && (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              )}
              <span>{title}</span>
            </ModalHeader>
            <ModalBody>
              <p className="text-muted-foreground">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onCancel}>
                {cancelText}
              </Button>
              <Button
                color={isDangerous ? "danger" : "primary"}
                onPress={async () => {
                  await onConfirm();
                  onClose();
                }}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
