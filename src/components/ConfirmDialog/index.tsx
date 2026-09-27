import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import type { ConfirmDialogProps } from './types';

export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    submitting = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
            <DialogContentText>{description}</DialogContentText>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose} disabled={submitting}>
                {cancelLabel}
            </Button>
            <Button color="error" variant="contained" onClick={onConfirm} disabled={submitting}>
                {confirmLabel}
            </Button>
        </DialogActions>
    </Dialog>
);
