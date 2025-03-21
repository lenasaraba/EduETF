# ﻿EduETF
 Aplikacija je namijenjena za online učenje i komunikaciju putem foruma. Korisnici su podijeljeni u dvije uloge: profesori i studenti. Profesori mogu kreirati kurseve, dok se studenti mogu upisivati na te kurseve. Kursevi su organizovani po kategorijama koje odgovaraju godinama fakulteta i smjerovima. Pored kurseva, korisnici mogu kreirati teme na forumu, slati poruke, dijeliti materijale, te kreirati i odgovarati na ankete. Obavještenja su implementirana putem Toastify i push notifikacija. Prijava korisnika se vrši putem OpenID Connect autentifikacije.
## Tehnologije
*Backend*: .NET (C#)  
*Frontend*: React (TypeScript)  
*Autentifikacija*: OpenID Connect  
*Obavještenja*: Toastify, Push notifikacije  
*Baza podataka*: SQL Server  
## Ključne funkcionalnosti  
### Kursevi
- Profesori kreiraju i upravljaju kursevima.
- Studenti se upisuju na kurseve.
- Kursevi su kategorizovani prema godini studija i smjeru.
- Mogućnost dodavanja anketa u sklopu kursa.

### Forum  
- Svi korisnici mogu kreirati teme za diskusiju.
- Teme mogu biti vezane za određeni kurs ili mogu biti slobodne.
- Korisnici mogu slati poruke, dijeliti materijale i odgovarati na teme.
- Mogućnost dodavanja anketa u okviru poruka na forumu.

### Notifikacije
- Implementirana su Toatify obavještenja.
- Push notifikacije za važna obavještenja vezana za kurseve i forum.

### Autentifikacija 
- Prijava korisnika se vrši pomoću OpenID Connect.

## Pokretanje  
### Backend:  
- Nakon otvaranja aplikacije u Visual Studio Code-u, potrebno je u terminal ukucati komandu *dotnet watch run*. Prethodno je potrebno importovati sql bazu (fajl *skripta.sql*) u SQL Server Management Studio. Ukoliko je to neophodno, potrebno je promijeniti konekcioni string tako da on odgovara instanci SQL Servera koju imate instaliranu na vašem računaru.

### Frontend:
- Potrebno je otvoriti frontend direktorijum, pa instalirati zavisnosti pomoću komande *npm install*. Zatim možete pokrenuti aplikaciju koristeći komandu *npm start*.

## Autori
Ivana Jugović – *ivana.jugovic.2121@student.etf.ues.rs.ba* / *jugovicivana12@gmail.com*  
Lena Šaraba – *lena.saraba.2094@student.etf.ues.rs.ba* / *lenasaraba8@gmail.com*
  
