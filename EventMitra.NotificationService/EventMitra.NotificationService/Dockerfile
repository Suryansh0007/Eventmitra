FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY EventMitra.NotificationService/EventMitra.NotificationService.csproj EventMitra.NotificationService/
RUN dotnet restore EventMitra.NotificationService/EventMitra.NotificationService.csproj

COPY EventMitra.NotificationService/ EventMitra.NotificationService/
RUN dotnet publish EventMitra.NotificationService/EventMitra.NotificationService.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5224
EXPOSE 5224

ENTRYPOINT ["dotnet", "EventMitra.NotificationService.dll"]
