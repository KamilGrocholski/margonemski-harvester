import { AxiosError } from 'axios'
import { ZodError } from 'zod'

export type ErrorName =
    | 'UNDESCRIBED_ERROR'
    | 'TABLE_PAGE_ERROR'
    | 'AXIOS_ERROR'
    | 'INTERNAL_ERROR'
    | 'VALIDATION_ERROR'

export type OnPageSuccess<T> = (pageResultSuccess: {
    data: T
    currentPage: number
}) => Promise<void> | void

export type OnPageError = (pageResultError: {
    errorData: ErrorData
    currentPage: number
}) => Promise<void> | void

export type PaginationResult = PaginationSuccessResult | PaginationErrorResult

export type PaginationSuccessResult = {
    success: true
    totalPages: number
}

export type PaginationErrorResult = {} & ErrorData

export type SinglePageResult<T> =
    | SinglePageSuccessResult<T>
    | SinglePageErrorResult

export type SinglePageSuccessResult<T> = {
    success: true
    data: T
    page: number
}

export type SinglePageErrorResult = {
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

export class PaginationError extends Error {
    constructor(message: string) {
        super(message)

        this.name = 'PaginationError'
        Object.setPrototypeOf(this, PaginationError.prototype)
    }
}

export class InternalError extends Error {
    constructor(message: string) {
        super(message)

        this.name = 'InternalError'
        Object.setPrototypeOf(this, InternalError.prototype)
    }
}

const errorsMap = new Map<any, ErrorName>([
    [InternalError, 'INTERNAL_ERROR'],
    [PaginationError, 'TABLE_PAGE_ERROR'],
    [AxiosError, 'AXIOS_ERROR'],
    [ZodError, 'VALIDATION_ERROR']
])

export function getErrorData(error: unknown): ErrorData {
    for (const [errorFromMap, name] of errorsMap) {
        if (error instanceof errorFromMap) {
            return {
                cause: error,
                success: false,
                errorName: name
            }
        }
    }

    return {
        cause: error,
        success: false,
        errorName: 'UNDESCRIBED_ERROR'
    }
}
