import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";

export default function UserTable({ users, setUsers }) {
  const deleteUser = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const editUser = (index) => {
    const newName = prompt("Enter new name:", users[index].name);
    const newEmail = prompt("Enter new email:", users[index].email);

    if (!newName || !newEmail) return;

    const updated = [...users];
    updated[index] = { name: newName, email: newEmail };
    setUsers(updated);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.NO",
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },

      /* ✅ EDIT COLUMN */
      {
        header: "Edit",
        cell: (info) => (
          <button
            style={{ background: "#2196f3", color: "white" }}
            onClick={() => editUser(info.row.index)}
          >
            Edit
          </button>
        ),
      },

      /* ✅ DELETE COLUMN */
      {
        header: "Delete",
        cell: (info) => (
          <button
            style={{ background: "#ef5350", color: "white" }}
            onClick={() => deleteUser(info.row.index)}
          >
            Delete
          </button>
        ),
      },
    ],
    [users],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
