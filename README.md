# Run the app on docker

To run the db, the server and the front on docker, execute the following commands (in order):

## 1. DB and server

```shell
cd server
```

Only if you have not yet created it, create the network:

```shell
yarn docker:network
```

Then run the db container

```shell
yarn db
```

Install the dependencies

```shell
yarn
```

Build the docker image

```shell
yarn docker:build
```

Run the docker server image

```shell
yarn docker
```

PS: In real life, I swear I never put secrets in the package.json file or any git-not-ignored files, this is an exception.

## 2. Client image

```shell
cd ../client
```
Install dependencies

```shell
yarn
```

Build the client image

```shell
yarn docker:build
```

Run the client image

```shell
yarn docker
```

Go to http://localhost:3000/login and buy some dip !

# BUY'N'HOLD

L'objectif est simple: Un CRUD fullstack permettant à plusieurs participants de passer des ordres d'achat.

## 1. Data

```
User {
  id: number,
  username: string,
  password: string
}

Order {
  id: number
  price: number
  expirationDate: Date
}
```

## 2. Les étapes

### 2.1. Authentification

Je saisis un `username`et un `password` dans le formulaire, si le `username` n'existe pas en DB, je crée un nouvel utilisateur avec les données saisies. Si le `username` existe déjà en DB, je vérifie que le `password` saisi est le bon, dans le cas contraire => erreur ! Si les informations sont valides, je redirige mon utilisateur vers la page `/trade?token={myJWTToken}`

### 2.2 CRUD

#### 2.2.1 Un utilisateur peut créer de nouveaux ordres d'achats (expiration automatique après 2 semaines)

#### 2.2.2 Un utilisateur peut visionner la liste de tout les ordres d'achats de tout les utilisateurs sans restrictions

#### 2.2.3 Un utilisateur peut modifier / supprimer uniquement ses propres ordres d'achat

### 2.3 Statistiques

#### 2.3.1 Somme valeur totale des ordres d'achats arrivant à expiration à une date donnée

#### 2.3.2 Moyenne des ordres d'achats

#### 2.3.3 Répartition des plus gros acheteurs (diagramme / liste)

### 2.4 Docker (optionnel, mais c'est quand même plus pratique)

#### 2.4.1 Côté BACK : dockeriser API et DB

#### 2.4.2 Côté FRONT : dockeriser le client

### Petit bonus : l'interface n'est pas très belle, tu as carte blanche !

![Steps](https://i.imgur.com/Oi1QDgI.png)
