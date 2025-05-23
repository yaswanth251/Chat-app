/* eslint-disable react/prop-types */
import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { matBlack } from "../../constants/color";
import { useState } from "react";

const Table = ({ rows, columns, heading, rowHeight = 52, totalRows }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // Default page size
  });

  return (
    <Container sx={{ height: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          padding: "1rem 4rem",
          borderRadius: "1rem",
          margin: "auto", // Fixed typo
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none",
        }}
      >
        <Typography
          textAlign="center"
          variant="h4"
          sx={{
            margin: "2rem",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          paginationMode="client"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[ 10, 50,100]} // Ensure pageSize is included
          rowCount={totalRows} // Should be passed from parent/API
          sx={{
            height: "80%", // Moved from style to sx
            border: "none",
            ".table-header": {
              bgcolor: matBlack,
              color: "white",
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
