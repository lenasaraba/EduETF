import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}
export default function AppPagination({ metaData, onPageChange }: Props) {
  const { currentPage, pageSize, totalCount, totalPages } = metaData;
  console.log(
    "METADATA ....................................   " + currentPage,
    pageSize,
    totalCount,
    totalPages
  );
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{flexDirection:{xs:"column", sm:"column", md:"row"}}}>
      <Typography
        sx={{ fontFamily: "Raleway, sans-serif", color: "primary.main" }}
      >
        Prikazano je {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        od {totalCount} kurseva.
      </Typography>
      <Pagination
        variant="outlined"
        color="secondary"
        count={totalPages}
        size="large"
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
        sx={{
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "background.paper", // Boja pozadine za selektovani broj stranice
            color: "text.primary", // Boja broja stranice
          },
        }}
      />
    </Box>
  );
}
