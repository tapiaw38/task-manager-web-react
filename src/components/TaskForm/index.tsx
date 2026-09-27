import { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { z } from 'zod';

import { taskPayloadSchema, validateTaskPayload, type TaskFormErrors } from '../../schemas/task';
import type { TaskFormProps } from './types';

type TaskFormValues = z.input<typeof taskPayloadSchema>;

const emptyValues: TaskFormValues = { title: '', description: '' };

export const TaskForm = ({ submitting, onSubmit }: TaskFormProps) => {
    const [values, setValues] = useState<TaskFormValues>(emptyValues);
    const [errors, setErrors] = useState<TaskFormErrors>({});

    const handleChange = (field: keyof TaskFormValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { data, errors: validationErrors } = validateTaskPayload(values);

        if (Object.keys(validationErrors).length > 0 || !data) {
            setErrors(validationErrors);

            return;
        }

        const created = await onSubmit(data);

        if (created) {
            setValues(emptyValues);
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ alignItems: { md: 'flex-start' } }}
            >
                <TextField
                    label="Title"
                    value={values.title}
                    onChange={(event) => handleChange('title', event.target.value)}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                    disabled={submitting}
                    fullWidth
                />

                <TextField
                    label="Description"
                    value={values.description}
                    onChange={(event) => handleChange('description', event.target.value)}
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                    disabled={submitting}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={submitting}
                    sx={{ minWidth: 160, paddingY: 1.75 }}
                >
                    Add task
                </Button>
            </Stack>
        </form>
    );
};
