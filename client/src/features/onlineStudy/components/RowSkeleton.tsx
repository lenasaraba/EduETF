import { Box, Skeleton } from "@mui/joy";
import { Theme } from "@mui/material";

interface ThemeTableProps {
  themeM: Theme; // Define the 'theme' prop type
}
export default function RowSkeleton({themeM}:ThemeTableProps) {
  return (
    <tr
      style={{
        borderBottom: "1px solid",
        borderColor: themeM.palette.background.paper,

        // borderWidth:"90%",
        // borderCollapse: "collapse",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between", // Koristimo space-between da rasporedimo sadržaj
        alignItems: "center", // Osiguravamo da su stavke poravnate
        padding: "16px 0", // Povećavamo visinu redova za bolju vidljivost
        transition: "background-color 0.3s ease",
        //height:"100%"
      }}
    >
      {/* First Column Skeleton */}
      <td
        style={{
          flex: 1,
          border: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "0 12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row", // Postavi ih u horizontalni raspored
            alignItems: "center", // Centriraj vertikalno
            width: "100%",
            gap: 0.5, // Razmak između avatara i tekstualnog skeletona
          }}
        >
          {/* Krug (Avatar-like skeleton) */}
          <Box
            sx={{
              position: "relative",
              width: "15%", // Avatar će zauzeti 20% širine
              height: "0",
              paddingBottom: "15%", // Održava odnos visine i širine za krug
              borderRadius: "50%",
              overflow: "hidden", // Sprečava da animacija izlazi van granica kruga
            }}
          >
            <Skeleton
              animation="wave"
              variant="circular"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: themeM.palette.background.default,
                "&::after": {
                  background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, // Ombre efekat
                },
              }}
            />
          </Box>

          {/* Tekstualni skeleton */}
          <Box
            sx={{
              position: "relative",
              width: "80%", // Tekstualni deo zauzima 80% širine tabele
              height: "20px", // Visina tekstualnog skeletona
              borderRadius: "4px",
              overflow: "hidden", // Sprečava izlazak animacije van granica
            }}
          >
            <Skeleton
              animation="wave"
              variant="text"
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: themeM.palette.background.default,
                "&::before": {
                background: themeM.palette.background.default,
              },
                "&::after": {
                  background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, // Ombre efekat
                },
              }}
            />
            
          </Box>
        </Box>
      </td>

      {/* Second Column Skeleton */}
      <td
        style={{
          flex: 1,
          border: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%", // Podesi da zauzima celu širinu
            height: 40, // Osiguraj da dimenzije budu iste
            // backgroundColor:"red" ,  // Koristi boju pozadine tabele
            borderRadius: "4px",
            overflow: "hidden", // Ovaj deo je ključan da se spreči izlazak animacije van granica
          }}
        >
         <Skeleton
            animation="wave"
            variant="text"
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: themeM.palette.background.default, // Pozadina za text variant
              "&::before": {
                background: themeM.palette.background.default,
              },
              "&::after": {
                content: '""', // Osiguraj da se ::after element stvori
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, // Ombre efekat
                // animation: "wave-animation 1.5s infinite", // Animacija talasa
              },
            }}
          />
        </Box>
      </td>

      {/* Third Column Skeleton */}
      <td
        style={{
          flex: 1,
          border: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%", // Podesi da zauzima celu širinu
            height: 40, // Osiguraj da dimenzije budu iste
            // backgroundColor:"red" ,  // Koristi boju pozadine tabele
            borderRadius: "4px",
            overflow: "hidden", // Ovaj deo je ključan da se spreči izlazak animacije van granica
          }}
        >
         <Skeleton
            animation="wave"
            variant="text"
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: themeM.palette.background.default, // Pozadina za text variant
              "&::before": {
                background: themeM.palette.background.default,
              },
              "&::after": {
                content: '""', // Osiguraj da se ::after element stvori
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, // Ombre efekat
                // animation: "wave-animation 1.5s infinite", // Animacija talasa
              },
            }}
          />
        </Box>
      </td>

      {/* Fourth Column Skeleton */}
      {/* <td
        style={{
          flex: 1,
          border: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{ height: "30%", width: "100%", margin: 1, position: "relative" }}
        >
          <Skeleton animation="wave" sx={{ position: 0 }} />
        </Box>
      </td> */}

      {/* Fourth Column Skeleton */}
      <td
        style={{
          flex: 1,
          border: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%", // Podesi da zauzima celu širinu
            height: 40, // Osiguraj da dimenzije budu iste
            // backgroundColor:"red" ,  // Koristi boju pozadine tabele
            borderRadius: "4px",
            overflow: "hidden", // Ovaj deo je ključan da se spreči izlazak animacije van granica
          }}
        >
         <Skeleton
            animation="wave"
            variant="text"
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: themeM.palette.background.default, // Pozadina za text variant
              "&::before": {
                background: themeM.palette.background.default,
              },
              "&::after": {
                content: '""', // Osiguraj da se ::after element stvori
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, // Ombre efekat
                // animation: "wave-animation 1.5s infinite", // Animacija talasa
              },
            }}
          />
        </Box>
      </td>
    </tr>
  );
}
