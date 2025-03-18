import { Box, Skeleton } from "@mui/joy";
import { Theme } from "@mui/material";
interface ThemeTableProps {
  themeM: Theme;  
}
export default function TableRowSkeleton({ themeM }: ThemeTableProps) {
  return (
    <tr
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
      }}
    >
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
            width: "100%", 
            height: 40, 
            borderRadius: "4px",
            overflow: "hidden", 
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
                content: '""', 
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`,
              },
            }}
          />
        </Box>
      </td>

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
            width: "100%", 
            height: 40, 
            borderRadius: "4px",
            overflow: "hidden", 
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
                content: '""', 
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`,
              },
            }}
          />
        </Box>
      </td>

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
            width: "100%", 
            height: 40, 
            borderRadius: "4px",
            overflow: "hidden", 
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
                content: '""',
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, 
              },
            }}
          />
        </Box>
      </td>


      <td
        style={{
          flex: 1,
          border: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row", 
            alignItems: "center", 
            width: "100%",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "15%", 
              height: "0",
              paddingBottom: "15%",
              borderRadius: "50%",
              overflow: "hidden", 
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
                  background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, 
                },
              }}
            />
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "80%", 
              height: "20px", 
              borderRadius: "4px",
              overflow: "hidden", 
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
                  background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, 
                },
              }}
            />
          </Box>
        </Box>
      </td>

      <td
        style={{
          width: "10%",
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
            width: "100%",
            height: 40, 
            borderRadius: "4px",
            overflow: "hidden", 
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
                content: '""', 
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, 
              },
            }}
          />
        </Box>
      </td>

      <td
        style={{
          width: "10%",
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
            width: "100%",
            height: 40, 
            borderRadius: "4px",
            overflow: "hidden", 
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
                content: '""', 
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`, 
              },
            }}
          />
        </Box>
      </td>

      <td
        style={{
          width: "10%",
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
            width: "100%", 
            height: 40,
            borderRadius: "4px",
            overflow: "hidden", 
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
                content: '""', 
                background: `linear-gradient(45deg, ${themeM.palette.background.default} 0%, ${themeM.palette.primary.main} 100%)`,
              },
            }}
          />
        </Box>
      </td>
    </tr>
  );
}
