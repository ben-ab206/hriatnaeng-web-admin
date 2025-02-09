import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import type { ElementType, ReactNode } from 'react'
import { LucideLoader2 } from 'lucide-react'

interface BaseLoadingProps extends CommonProps {
    asElement?: ElementType
    customLoader?: ReactNode
    loading?: boolean
    spinnerClass?: string
}

interface LoadingProps extends BaseLoadingProps {
    type?: 'default' | 'cover'
}

const DefaultLoading = ({
    loading = false,
    children,
    spinnerClass = "animate-spin",
    className,
    asElement: Component = 'div',
    customLoader,
}: BaseLoadingProps) => {
    return loading ? (
        <Component
            className={classNames(
                !customLoader && 'flex items-center justify-center h-full',
                className
            )}
        >
            {customLoader ? (
                <>{customLoader}</>
            ) : (
                <LucideLoader2 className={spinnerClass} size={40} />
            )}
        </Component>
    ) : (
        <>{children}</>
    )
}

const CoveredLoading = ({
    loading = false,
    children,
    spinnerClass,
    className,
    asElement: Component = 'div',
    customLoader,
}: BaseLoadingProps) => {
    return (
        <Component className={classNames(loading ? 'relative' : '', className)}>
            {children}
            {loading && (
                <div className="w-full h-full absolute inset-0" />
            )}
            {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    {customLoader ? (
                        <>{customLoader}</>
                    ) : (
                        <LucideLoader2 className={spinnerClass} size={40} />
                    )}
                </div>
            )}
        </Component>
    )
}

const Loading = ({
    type = 'default',
    ...rest
}: LoadingProps) => {
    switch (type) {
        case 'default':
            return <DefaultLoading {...rest} />
        case 'cover':
            return <CoveredLoading {...rest} />
        default:
            return <DefaultLoading {...rest} />
    }
}

export default Loading