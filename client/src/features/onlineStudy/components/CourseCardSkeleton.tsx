import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
} from "@mui/material";

export default function CourseCardSkeleton() {
  return (
    <Card
      sx={{
        width: "100%", 
        borderRadius: "20pt",
        boxSizing: "border-box",
      }}
    >
      <CardHeader
        sx={{ width: "300px" }}
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="100%"
            sx={{ marginBottom: 1 }}
          />
        }
      />
      <Skeleton
        sx={{ height: 140, width: "100%" }}
        animation="wave"
        variant="rectangular"
      />
      <CardContent>
        <>
          <Skeleton animation="wave" height={10} sx={{ marginBottom: 1 }} />
          <Skeleton animation="wave" height={10} width="100%" />
        </>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <>
          <Skeleton animation="wave" height={30} width="40%" />
          <Skeleton animation="wave" height={30} width="20%" />
        </>
      </CardActions>
    </Card>
  );
}
