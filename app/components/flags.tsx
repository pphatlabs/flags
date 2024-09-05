"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useState, useEffect } from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Button } from './ui/button';
import { CornersIcon } from '@radix-ui/react-icons';

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
    const searchParams = useSearchParams();
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const [currentPage, setCurrentPage] = useState(Number(page) || 1);
    const [currentLimit, setCurrentLimit] = useState(Number(limit) || 8);

    useEffect(() => {
        fetchFlags();
        setCurrentPage(Number(page) || 1);
        setCurrentLimit(Number(limit) || 8  );
    }, [page, limit]);

    const fetchFlags = async () => {
        const res = await fetch(`/api/flags?limit=${currentLimit}&page=${currentPage}`);
        const data = await res.json();
        setCountries(data.result);
        setPagination(data.pagination);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        window.history.pushState(null, '', `?${params.toString()}`);
    };

    const handleDownload = async ({
        svgUrl,
        fileName,
    }: {
        svgUrl: string;
        fileName: string;
    }) => {
        try {
            const response = await fetch(svgUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading SVG:', error);
        }
    }

    return (
        <div className='container mx-auto'>
            <ul role="list" className="grid grid-cols-2 p-5 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                {countries.map((country, key) => (
                    <li key={key} className="relative border rounded-xl">
                        <div className="relative block w-full overflow-hidden bg-gray-100 rounded-tl-lg rounded-tr-lg group aspect-h-7 aspect-w-10 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
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
                            <Link href={`/api/flag/4x3/${String(country.topLevelDomain[0]).replace('.','')}`} className='absolute inset-0 flex items-start justify-end p-2 group z-1'>
                                <span className='hidden p-2 rounded-lg group-hover:block bg-white/20'>
                                    <CornersIcon className='size-7'/>
                                </span>
                            </Link>
                        </div>
                        <div className='p-4 '>
                            <p className="block mt-2 text-sm font-medium text-gray-900 truncate pointer-events-none">{country.name}</p>
                            <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                                {
                                    country.topLevelDomain.map((domain, index) => (
                                        <React.Fragment key={index}>
                                            {domain}
                                            {index < country.topLevelDomain.length - 1 ? ', ' : ''}
                                        </React.Fragment>
                                    ))
                                }
                            </p>

                            <div className='flex items-center justify-end gap-3'>
                                <Button
                                    variant={'outline'}
                                    onClick={() => handleDownload({
                                        svgUrl: `/api/flag/4x3/${String(country.topLevelDomain[0]).replace('.','')}.svg`,
                                        fileName: `${country.name}.svg`,
                                    })}
                                    >Download
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {pagination && (
                <Pagination className='my-10'>
                    <PaginationContent>
                        <PaginationItem>
                            <button
                                className='px-4 py-1.5 leading-6 rounded-md hover:bg-slate-100'
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}>
                                Previous
                            </button>
                        </PaginationItem>
                        <PaginationItem>
                            {currentPage} { pagination.totalPages > 1 && 'of' && pagination.totalPages}
                        </PaginationItem>
                        <PaginationItem>
                            <button
                                className='px-4 py-1.5 leading-6 rounded-md hover:bg-slate-100'
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                            >
                                Next
                            </button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

            )}
        </div>
    );
};

