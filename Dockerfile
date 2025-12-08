# build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["DemoApp.csproj", "./"]
RUN dotnet restore "./DemoApp.csproj"
COPY . .
RUN dotnet publish "DemoApp.csproj" -c Release -o /app/publish

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "DemoApp.dll"]
