FROM node:15.3.0-alpine3.10 as build-deps

# workaround for https://github.com/parcel-bundler/parcel/issues/2031
ENV PARCEL_WORKERS=1

WORKDIR /app

# Copy package.json and restore as distinct layers
COPY ./client/package.json ./
RUN yarn install

# Copy everything else and build
COPY ./client/ ./
RUN yarn run build

RUN ls ./dist

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./server/Moonshot.Server/*.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY ./server/Moonshot.Server/ ./
RUN dotnet publish -c Release -o out --no-cache

COPY --from=build-deps /app/dist/ ./out/client

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
ENV ASPNETCORE_URLS http://+:80
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Moonshot-Server.dll"]