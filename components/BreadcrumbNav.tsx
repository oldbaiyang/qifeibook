"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    name: string;
    href?: string;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav aria-label="breadcrumb" className="mb-6">
            <ol
                className="flex items-center gap-1.5 text-sm"
                style={{
                    listStyle: 'none',
                    padding: '0.5rem 1rem',
                    margin: 0,
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                }}
            >
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.href ? (
                            <li className="flex items-center">
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors"
                                    style={{
                                        color: '#64748b',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#2563eb';
                                        e.currentTarget.style.background = '#eff6ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#64748b';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {index === 0 && <Home size={14} />}
                                    {item.name}
                                </Link>
                            </li>
                        ) : (
                            <li
                                aria-current="page"
                                className="px-2 py-1"
                                style={{ color: '#1e293b', fontWeight: 600 }}
                            >
                                {item.name}
                            </li>
                        )}
                        {index < items.length - 1 && (
                            <li aria-hidden="true" className="flex items-center" style={{ color: '#cbd5e1' }}>
                                <ChevronRight size={14} />
                            </li>
                        )}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
}
