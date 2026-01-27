import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type BreadcrumbSegment = {
    label: string
    href?: string
}

type PageBreadcrumbProps = {
    segments: BreadcrumbSegment[]
}

export function PageBreadcrumb({ segments }: PageBreadcrumbProps) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {/* Always start with Herramientas */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/herramientas">Herramientas</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1

                    return (
                        <div key={index} className="flex items-center gap-2">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast || !segment.href ? (
                                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={segment.href}>{segment.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
