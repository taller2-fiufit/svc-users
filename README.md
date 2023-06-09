<p align="center">
  <a href="http://fi.uba.ar/" target="blank"><a href="https://ibb.co/sg2mHKD"><img src="https://i.ibb.co/NFsVS9k/Isotipo.png" alt="Kinetix Logo" width="200" border="0" align="left"/></a></a>
</p>

[![Deploy](https://github.com/taller2-fiufit/svc-users/actions/workflows/cd.yml/badge.svg)](https://github.com/taller2-fiufit/svc-users/actions/workflows/cd.yml)

[![codecov](https://codecov.io/github/taller2-fiufit/svc-users/branch/main/graph/badge.svg?token=5XUJID246G)](https://codecov.io/github/taller2-fiufit/svc-users)

# Kinetix

[Kinetix](https://github.com/taller2-fiufit) es una aplicación para la gestión de actividades físicas.

## svc-users
Servicio para la gestión de usuarios.

## Instalación
Revisar el .env.example para ver las configuraciones necesarias.

Requiere de una base de datos Postgre.

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
