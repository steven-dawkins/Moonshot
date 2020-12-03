FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./server/Moonshot.Server/*.csproj ./
COPY ./server/Moonshot.Server/nuget.config ./
RUN dotnet restore

# Copy everything else and build
COPY ./server/Moonshot.Server/ ./
RUN dotnet publish -c Release -o out --no-cache

COPY ./client/dist/ ./out/client

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
ENV ASPNETCORE_URLS http://+:80
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Moonshot-Server.dll"]