import { Divider, Grid, Paper, Typography } from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ForumTwoToneIcon from "@mui/icons-material/ForumTwoTone";

import logo from "../../assets/etf.png";

export default function HomePage() {
  return (
    <>
      <Grid
        container
        sx={{
          flexGrow: 1,
          padding: 2,
          backgroundImage: `url(${logo})`,
          backgroundSize: "contain",
          backgroundPosition: "right",
          height: "100vh",
          width: "100%",
          filter: "blur(8px)",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: -1,
        }}
      ></Grid>
      <Grid
        container
        sx={{
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: "8px",
              backgroundColor: "secondary.main",
              height: "100%",
              width: "100%",
              mb:{xs:2, md:0}
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                height: "100%",
                padding: 6,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Raleway, sans-serif",
                }}
              >
                O nama
              </Typography>
              <br />
              <br />
              <Typography
                variant="body1"
                sx={{ fontFamily: "Raleway, sans-serif" }}
              >
                Dobrodošli na našu aplikaciju dizajniranu specijalno za studente
                Elektrotehničkog fakulteta u Istočnom Sarajevu! Naša platforma
                ima za cilj da unaprijedi vaše obrazovno iskustvo, olakša
                praćenje online kurseva i omogući vam da se povežete sa kolegama
                putem studentskog foruma.
              </Typography>
              <br />
              <Divider sx={{ color: "text.primary", width: "100%" }}>
                <Typography
                  variant="overline"
                  gutterBottom
                  sx={{ display: "block", fontFamily: "Raleway, sans-serif" }}
                >
                  Šta vam nudimo?
                </Typography>
              </Divider>
              <Typography sx={{ fontFamily: "Raleway, sans-serif" }}>
                <MenuBookRoundedIcon
                  sx={{
                    verticalAlign: "middle",
                    marginRight: 1,
                    marginBottom: 0.5,
                  }}
                />
                Pristup online kursevima: Učite u bilo koje vrijeme i sa bilo
                kog uređaja. Pratite predavanja, vježbe i dodatne materijale
                koji su vam potrebni za uspješno savladavanje gradiva.
                <br />
                <ForumTwoToneIcon
                  sx={{
                    verticalAlign: "middle",
                    marginRight: 1,
                    marginBottom: 0.5,
                  }}
                />
                Studentski forum: Diskutujte sa kolegama, postavljajte pitanja,
                razmjenjujte ideje i učestvujte u grupnim projektima. Forum je
                idealno mesto za saradnju i razmjenu znanja.
              </Typography>
              <br />
              Naš cilj je da vam omogućimo jednostavan i intuitivan način da
              organizujete svoje učenje i da vas povežemo sa kolegama i
              profesorima na način koji podstiče timski rad i zajednički uspjeh.
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
