import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
    name: string;
    href?: string;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav aria-label="breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.href ? (
                            <li>
                                <Link
                                    href={item.href}
                                    className="hover:underline"
                                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ) : (
                            <li aria-current="page" style={{ color: '#333', fontWeight: 500 }}>
                                {item.name}
                            </li>
                        )}
                        {index < items.length - 1 && (
                            <li aria-hidden="true" style={{ color: '#ccc', userSelect: 'none' }}>
                                ›
                            </li>
                        )}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
}
