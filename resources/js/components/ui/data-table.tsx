import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable, 
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import Pagination from "./pagination";
import { Input } from "./input"; 
import { Key, ComponentType, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Definição das colunas da tabela
  data: TData[]; // Dados da tabela
}

// Função que renderiza a tabela
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // hook useReactTable
  const table = useReactTable({
    data, // Dados que serão exibidos na tabela
    columns, // Colunas da tabela
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(), 
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-md border">
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} // filtro da coluna "name"
          className="max-w-sm"
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value) // Atualiza o filtro quando o valor do input muda
          }
        />
      </div>

      {/* Tabela */}
      <Table>
        <TableHeader>
          {/* Iterando sobre os grupos de cabeçalhos da tabela */}
          {table.getHeaderGroups().map((headerGroup: { id: Key | null | undefined; headers: any[]; }) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: { id: Key | null | undefined; isPlaceholder: any; column: { columnDef: { header: string | number | bigint | boolean | ComponentType<any> | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }; getContext: () => any; }) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* corpo da Tabela */}
        <TableBody>
          {/* Verificando se há linhas para renderizar */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: { id: Key | null | undefined; getIsSelected: () => any; getVisibleCells: () => any[]; }) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}> {/* Verifica se a linha está selecionada */}
                {/* Renderizando células visíveis da linha */}
                {row.getVisibleCells().map((cell: { id: Key | null | undefined; column: { columnDef: { cell: string | number | bigint | boolean | ComponentType<any> | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }; getContext: () => any; }) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext() // Passa o contexto para o renderizador da célula
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Se não houver resultados
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Componente de Paginação */}
      <Pagination table={table} />
    </div>
  );
}

export default DataTable;
