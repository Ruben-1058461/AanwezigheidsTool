# Aanwezigheidstool

## Over de aanwezigheidstool

Het is een webapplicatie om de aanwezigheid bij te houden 
van studenten tijdens de lessen en andere bijeenkomsten
zoals een evenement alle eerstejaars. 

## Waaruit bestaat de webapplicatie?

Deze repository bevat een Flask applicatie met: 
- Een database
- Templates
- De Flask server
- JavaScript en HTML / CSS

## Hoe de webapplicatie te starten?

Om Flask te kunnen starten zullen eerst de Flask packages 
moeten worden geïnstalleerd. 

In requirements.txt staan alle benodigde packages 
om de code succesvol te draaien. Ze zijn gemakkelijk
te installeren via pip.

Om problemen met versies voorkomen, wordt aangeraden om
een virtual environment te maken en daar de modules in te installeren:  
```
pip install virtualenv
virtualenv venv
.\venv\sripts\activate
pip install -r requirements.txt
```

Om de applicatie te starten: 
``` 
.\venv\sripts\activate
python app.py
```

De code is geschreven in Python 3.11.1

## Hoe in te loggen? Inloggegevens:

Er kan als docent ingelogd worden met de volgende inloggegevens: 
```
Gebruikersnaam: docent@email.com 
Wachtwoord: test
```
Er kan als beheerder ingelogd worden met de volgende inloggegevens:
```
Gebruikersnaam: admin@email.com 
Wachtwoord: test
```
Er kan als student ingelogd worden met de volgende inloggegevens:
```
Gebruikersnaam: sclark@example.net 
Wachtwoord: test
```

## Hoe een nieuw account aan te maken?

De webapplicatie omvat een signup pagina waarop 
docenten en studenten een nieuw account kunnen aanmaken.

## Structuur

De Model-View-Controller (MVC) structuur is gebruikt.
- Model bestanden zitten in de folder models
- Controller bestanden zitten in de folder controllers
- View bestanden zitten in de folder templates

## Ontwikkelaars van de webapplicatie

- Mees Pols, Laravel Developer
- Ruben de Ruijter, PHP Developer
- Ruben Voogt, PHP Developer
- Anant Singh, Junior Intern

## Bronnen

Link naar [website](https://github.com/Maarten-vd-Sande/voorbeeldRepo) gebruikt 
als voorbeeld voor deze readme.md