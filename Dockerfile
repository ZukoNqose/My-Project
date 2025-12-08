# Stage 1 — build (use .NET 9 SDK)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy csproj and nuget config first (to use layered cache)
COPY ["DemoDockerApp.csproj", "NuGet.Config", "./"]

# set a container-local NuGet packages folder (optional but clean)
ENV NUGET_PACKAGES=/root/.nuget/packages
RUN mkdir -p $NUGET_PACKAGES

# restore using the explicit config
RUN dotnet restore "DemoDockerApp.csproj" --configfile NuGet.Config

# copy rest of source and publish
COPY . .
RUN dotnet publish "DemoDockerApp.csproj" -c Release -o /app/publish --no-restore

# Stage 2 — runtime (use .NET 9 runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "DemoDockerApp.dll"]
# End of Dockerfile