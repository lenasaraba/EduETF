// /* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Link,
  useTheme,
  Grid,
} from "@mui/material";
import { User, UsersCourse } from "../../../app/models/course";

const listItems = [
  {
    id: "INV-1234",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "O",
      name: "Olivia Ryhe",
      email: "olivia@email.com",
    },
  },
  {
    id: "INV-1233",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "S",
      name: "Steve Hampton",
      email: "steve.hamp@email.com",
    },
  },
  {
    id: "INV-1232",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "C",
      name: "Ciaran Murray",
      email: "ciaran.murray@email.com",
    },
  },
  {
    id: "INV-1231",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "M",
      name: "Maria Macdonald",
      email: "maria.mc@email.com",
    },
  },
  {
    id: "INV-1230",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "C",
      name: "Charles Fulton",
      email: "fulton@email.com",
    },
  },
  {
    id: "INV-1229",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "J",
      name: "Jay Hooper",
      email: "hooper@email.com",
    },
  },
];

// function RowMenu() {
//   return (
//     <Dropdown>
//       <MenuButton
//         slots={{ root: IconButton }}
//         slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
//       >
//         <MoreHorizRoundedIcon />
//       </MenuButton>
//       <Menu size="sm" sx={{ minWidth: 140 }}>
//         <MenuItem>Edit</MenuItem>
//         <MenuItem>Rename</MenuItem>
//         <MenuItem>Move</MenuItem>
//         <Divider />
//         <MenuItem color="danger">Delete</MenuItem>
//       </Menu>
//     </Dropdown>
//   );
// }

// const listItems = [
//   {
//     id: "123",
//     customer: { initial: "A", name: "Ana Petrović", email: "ana@example.com" },
//     date: "15.01.2025",
//     status: "Paid",
//   },
//   {
//     id: "456",
//     customer: { initial: "M", name: "Marko Jovanović", email: "marko@example.com" },
//     date: "10.01.2025",
//     status: "Refunded",
//   },
//   {
//     id: "789",
//     customer: { initial: "J", name: "Jovana Nikolić", email: "jovana@example.com" },
//     date: "05.01.2025",
//     status: "Cancelled",
//   },
// ];
interface StudentProps {
  students: UsersCourse[] | null;
}
export default function StudentsOnCourse({ students }: StudentProps) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          // bgcolor: "secondary.main",
          borderRadius: 3,
          padding: 0, // Padding koji osigurava da sadržaj ne bude previše blizu ivica
          // border: "2px solid",
          borderColor: (theme) => theme.palette.divider,
          // boxShadow: "inset 0px 0px 8px rgba(22, 167, 121, 0.1)",
          background: (theme) =>
            `linear-gradient(0deg, ${theme.palette.background.paper}, ${theme.palette.primary.main})`,
          boxSizing: "border-box", // Sprečava da sadržaj pređe padding
        }}
      >
        {students && students.length > 0 ? (
          <List sx={{ width: "100%", padding: 0 }}>
            {students.map((student, index) => (
              <Box key={student.id} sx={{ width: "100%" }}>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    px: 1, // Padding levo i desno za još veću distancu unutar Box-a
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        color: "background.paper",
                        backgroundColor: "primary.dark",
                      }}
                    >
                      {student.user.firstName.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      student.user.firstName + " " + student.user.lastName
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {student.user.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(student.enrollDate).toLocaleDateString(
                            "sr-RS"
                          )}{" "}
                          -{" "}
                          {student.withdrawDate != "0001-01-01T00:00:00"
                            ? new Date(student.withdrawDate).toLocaleDateString(
                                "sr-RS"
                              )
                            : "danas"}
                        </Typography>
                      </>
                    }
                  />
                  {/* <Chip variant="outlined" label={listItem.status} /> */}
                </ListItem>
                {index < listItems.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Typography sx={{ color: "text.primary", height:"18vh", lineHeight:"18vh", textAlign:"center" }}>Nema upisanih studenata</Typography>
        )}
      </Box>
    </>
  );
}

{
  /* <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
        //   size="sm"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" sx={{ mx: 'auto' }}>
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
        //   size="sm"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box> */
}
// </Box>
