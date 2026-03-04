export type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  renderActions?: (row: T) => React.ReactNode;
};

export function DataTable<T>({
  columns,
  data,
  loading,
  renderActions,
}: DataTableProps<T>) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          {columns.map((col, i) => (
            <th key={i} className="border px-3 py-2">
              {col.header}
            </th>
          ))}
          {renderActions && (
            <th className="border px-3 py-2">Actions</th>
          )}
        </tr>
      </thead>

      <tbody>
        {loading && (
          <tr>
            <td
              colSpan={columns.length + (renderActions ? 1 : 0)}
              className="text-center py-4"
            >
              Loading...
            </td>
          </tr>
        )}

        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j} className="border px-3 py-2">
                {col.accessor(row)}
              </td>
            ))}

            {renderActions && (
              <td className="border px-3 py-2">
                {renderActions(row)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}