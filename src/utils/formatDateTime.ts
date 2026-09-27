import dayjs from 'dayjs';

export const formatCreationDate = (isoDate: string): string => {
    const date = dayjs(isoDate);

    return date.isValid() ? date.format('DD-MMM-YY').toLowerCase() : '';
};

export const formatCreationTime = (isoDate: string): string => {
    const date = dayjs(isoDate);

    return date.isValid() ? date.format('HH:mm') : '';
};
