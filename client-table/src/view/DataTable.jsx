import React, { useEffect, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel
} from '@tanstack/react-table';

import classNames from 'classname';
import { rankItem } from "@tanstack/match-sorter-utils";
import { 
    MagnifyingGlassIcon, 
    BarsArrowDownIcon, 
    BarsArrowUpIcon, 
    ChevronUpDownIcon, 
    ChevronDoubleLeftIcon, 
    ChevronDoubleRightIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon
} from '@heroicons/react/24/solid';
import { deleteClient, getAllClients } from '../api/clients.api';

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({itemRank})

    return itemRank.passed
}

const DebouncedInput = ({value:keyWord, onChange, ...props}) => {
    const [value, setValue] = useState(keyWord);

    useEffect(()=> {
        const timeout = setTimeout(() => {
            onChange(value) 
        }, 500);
        return () => clearTimeout(timeout);
    }, [value])

    return (
        <input {...props} value={value} onChange={e=> setValue(e.target.value)}/>
    )
}

const DataTable = () => {

    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])

    async function loadClients() {
        const res = await getAllClients()
        setData(res.data)
    }

    useEffect(()=> {
        loadClients();
    }, [])

    const columns = [
        {
            accessorKey: 'name',
            header: ()=> <span>Nombre</span>,
            cell: info => <span className='font-bold'>{info.getValue()}</span>
        },
        {
            accessorKey: 'lastname',
            header: ()=> <span>Apellido</span>
        },
        {
            accessorKey: 'dni',
            header: ()=> <span>DNI</span>
        },
        {
            accessorKey: 'birthdate',
            header: ()=> <span>Fecha de nacimiento</span>,
            cell: info => {
                console.log(info.getValue())
                const fecha = new Date(`${info.getValue()}T00:00:00`)
                return `${fecha.toLocaleDateString()}`
            }
        },
        {
            accessorKey: 'isGBA',
            header: ()=> {
                return(
                    <div className='flex justify-center'>
                        <span>Es de GBA</span>
                    </div>
                )
            },
           cell: info => {
                return (
                    <div className='flex items-center justify-center'>
                        <div className={classNames({
                            ' rounded-full pb-1 text-center': true,
                                'bg-red-100 text-red-500 px-2': false === info.getValue(),
                                'bg-green-100 text-green-500 px-3': true === info.getValue()
                            })}>
                            <span >
                                {info.getValue()? 'Si': 'No'}
                            </span>
                        </div>
                        
                    </div>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'id',
            header: 'Acciones',
            cell: info => {
                return (
                    <div className='space-x-2'>
                        <button className='text-red-600' onClick={async()=> {
                            const accepted = window.confirm("Estas seguro/a?")
                            if(accepted){
                                await deleteClient(info.getValue())
                                loadClients();
                            }
                            }}>Eliminar</button>
                        {/*<button className='text-blue-600'>Editar</button>*/}
                    </div>
                )
            },
            enableSorting: false
        }
    ]

    const getStateTable = () => {
        const totalRows = table.getFilteredRowModel().rows.length;
        const pageSize = table.getState().pagination.pageSize;
        const pageIndex = table.getState().pagination.pageIndex;
        const rowsPerPage = table.getRowModel().rows.length;

        const firstIndex = (pageIndex * pageSize) + 1;
        const lastIndex = (pageIndex * pageSize) + rowsPerPage;
        
        return {
            totalRows,
            firstIndex,
            lastIndex
        }
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting
        },
        initialState: {
            pagination: {
                pageSize: 5
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting
    })

    return (
        <div className='px-6 py-4 '>
            <div className='my-2 flex justify-center items-center flex-wrap md:flex-nowrap md:justify-between'>
                <h3 className='text-black font-bold text-2xl pt-3 order-1'>Listado de clientes</h3>
                <img src='/sport-club.png' className='object-contain md:order-2'/>
                <div className='flex justify-end pt-2 order-2 md:order-3 w-full md:w-1/3 lg:w-1/4'>
                    <div className='relative flex items-center w-full'>
                        <MagnifyingGlassIcon className='w-5 h-5 absolute right-3' />
                        <DebouncedInput 
                            type='text'
                            value={globalFilter??''}
                            className='px-6 py-2 text-gray-600 border border-gray-300 rounded outline-sport-bg-red w-full'
                            placeholder='Buscar...'
                            onChange={value => {
                                setGlobalFilter(String(value))
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='overflow-auto'>
                <table className='table-auto w-full min-w-[560px]'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className='border-b border-gray-300 text-white bg-gradient-to-r from-sport-bg-yellow to-sport-bg-red'>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className='py-2 px-4 text-left'>
                                        {header.isPlaceholder
                                        ? null 
                                        : 
                                        <div
                                            className={classNames({
                                                "cursor-pointer select-none flex justify-between": header.column.getCanSort(),
                                            })}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: <BarsArrowUpIcon className='w-5 h-5'/>,
                                                desc: <BarsArrowDownIcon className='w-5 h-5'/>
                                            }[header.column.getIsSorted()]?? [header.column.getCanSort()? <ChevronUpDownIcon key={header.id}className='w-5 h-5' />: null]}
                                        </div>
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row=> (
                            <tr key={row.id} className='text-gray-600 hover:bg-slate-100'>
                                {row.getVisibleCells().map(cell=> (
                                    <td key={cell.id} className='py-2 px-4'>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='mt-4 md:flex items-center justify-between space-y-4 text-center'>
                <div className='flex items-center gap-2'>
                    <button 
                        className=' py-1 px-1 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                        onClick={()=> table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronDoubleLeftIcon className='w-4 h-4'/>
                    </button>
                    <button 
                        className='  py-1 px-2 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                        onClick={()=> table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon className='w-4 h-4'/>
                    </button>
                    {table.getPageOptions().map((value, key)=> (
                        <button 
                            key={key} 
                            className={classNames({
                                "  py-0.3 px-2 rounded border font-bold border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300": true, 
                                " text-indigo-700": value === table.getState().pagination.pageIndex
                            })}
                            onClick={()=> table.setPageIndex(value)}
                        >
                            {value + 1}
                        </button>
                    ))}
                    <button 
                        className='  py-1 px-2 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300' 
                        onClick={()=> table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon className='w-4 h-4'/>
                    </button>
                    <button 
                        className='  py-1 px-1 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                        onClick={()=> table.setPageIndex(table.getPageCount() - 1 )}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronDoubleRightIcon className='w-4 h-4'/>
                    </button>
                </div>
                    {getStateTable().totalRows? 
                    (
                        <div className='text-gray-600 font-semibold mx-1'>
                            Mostrandode de {getStateTable().firstIndex}&nbsp;a&nbsp;
                            {getStateTable().lastIndex}&nbsp; 
                            del total de {getStateTable().totalRows}&nbsp; registros
                        </div>
                    )
                    : 'No se encontraron registros para la búsqueda'}
                
                <select 
                    className='text-gray-600 border border-gray-300 rounded outline-indigo-700 py-2'
                    onChange={ e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    <option value="5">Ver 5</option>
                    <option value="10">Ver 10</option>
                    <option value="15">Ver 15</option>
                </select>
            </div>
        </div>
    )
}

export default DataTable;