export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    submitting?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}
