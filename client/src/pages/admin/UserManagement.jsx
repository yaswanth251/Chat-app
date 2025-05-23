import { Avatar, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { useGetAdminStatsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const { isLoading, data, error, isError } =
    useGetAdminStatsQuery("admin/users");
  // console.log(data); 
  useErrors([{ isError, error }]);
  useEffect(() => {
    if (data?.transformedUsers) {
      setRows(
        data.transformedUsers.map((user) => {
          return {
            ...user,
            id: user._id,
            avatar: transformImage(user.avatar, 50),
          };
        })
      );
    }
  }, [data]);
  return (
    <AdminLayout>
      {isLoading ? (
        <>
          <Skeleton />
        </>
      ) : (
        <Table rows={rows} heading={"All Users"} columns={columns} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
