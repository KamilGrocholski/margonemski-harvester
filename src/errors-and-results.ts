import { AxiosError } from 'axios'
import { ZodError } from 'zod'

export type ErrorName =
    | 'UNDESCRIBED_ERROR'
    | 'TABLE_PAGE_ERROR'
    | 'AXIOS_ERROR'
    | 'INTERNAL_ERROR'
    | 'VALIDATION_ERROR'

export type PaginationResult = PaginationSuccessResult | PaginationErrorResult

export type PaginationSuccessResult = {
    success: true
    totalPages: number
    message: string
}

export type PaginationErrorResult = {
    message: string
} & ErrorData

export type SinglePageResult<T> =
    | SinglePageSuccessResult<T>
    | SinglePageErrorResult

export type SinglePageSuccessResult<T> = {
    success: true
    data: T
    page: number
}

type SinglePageErrorResult = {
    page: number
} & ErrorData

export type SuccessResult<T> = {
    success: true
    data: T
}

export type ErrorResult = ErrorData

export type Result<T> = SuccessResult<T> | ErrorResult

export type ErrorData = {
    success: false
    errorName: ErrorName
    cause: unknown
}

export function getErrorData(error: unknown): ErrorData {
    const base: Omit<ErrorData, 'errorName'> = {
        cause: error,
        success: false,
    }

    if (error instanceof ZodError) {
        return {
            ...base,
            errorName: 'VALIDATION_ERROR',
        }
    }

    if (error instanceof AxiosError) {
        return {
            ...base,
            errorName: 'AXIOS_ERROR',
        }
    }

    if (error instanceof PaginationError) {
        return {
            ...base,
            errorName: 'TABLE_PAGE_ERROR',
        }
    }

    if (error instanceof InternalError) {
        return {
            ...base,
            errorName: 'INTERNAL_ERROR',
        }
    }

    return {
        ...base,
        errorName: 'UNDESCRIBED_ERROR',
    }
}

export class PaginationError extends Error {
    constructor(message: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/tc39/proposal-error-cause
        super(message, { cause })

        this.name = 'PaginationError'
        Object.setPrototypeOf(this, PaginationError)
    }
}

export class InternalError extends Error {
    constructor(message: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/tc39/proposal-error-cause
        super(message, { cause })

        this.name = 'InternalError'
        Object.setPrototypeOf(this, InternalError)
    }
}
