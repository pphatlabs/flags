"use client";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from 'react';

interface Country {
    name: string;
    code: string;
    flag: string;
    topLevelDomain: [
        undefined
    ];
}

interface PaginationData {
    limit: number;
    total: number;
    skip: number;
    offset: number;
    totalPages: number;
    page: number;
}

export const FlagList = () => {
    const [countries, setCountries]     = useState<Country[]>([]);
    const [pagination, setPagination]   = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchFlags();
    }, [currentPage]);

    const fetchFlags = async () => {
        const res = await fetch(`/api/svg?limit=20&page=${currentPage}`);
        const data = await res.json();
        setCountries(data.result);
        setPagination(data.pagination);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                {countries.map((country, key) => (
                    <li key={key} className="relative">
                        <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-h-7 aspect-w-10 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                            <Image
                                src={`/flags/4x3/${String(country.topLevelDomain[0]).replace('.','')}.svg`}
                                alt={country.name}
                                className="object-cover pointer-events-none group-hover:opacity-75"
                                width={512}
                                height={512}
                            />
                            <button type="button" className="absolute inset-0 focus:outline-none">
                                <span className="sr-only">{country.name}</span>
                            </button>
                        </div>
                        <p className="block mt-2 text-sm font-medium text-gray-900 truncate pointer-events-none">{country.name}</p>
                        <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                            {
                                country.topLevelDomain.map((domain, index) => (
                                    <span key={index}>
                                        {domain}
                                        {index < country.topLevelDomain.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                            }
                        </p>
                        <Link href={`/api/svg/4x3/${String(country.topLevelDomain[0]).replace('.','')}`} className='absolute inset-0 z-50'></Link>
                    </li>
                ))}
            </ul>
            {pagination && (
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

